// src/routes/api/stargazers/[owner]/[repo]/+server.js
import { Octokit } from '@octokit/rest';
import { redis } from '$lib/server/utils/redis';

export async function GET({ params, url }) {
  const { owner, repo } = params;
  const page = parseInt(url.searchParams.get('page') || '1');
  const per_page = parseInt(url.searchParams.get('per_page') || '25');

  if (!owner || !repo) {
    return new Response(JSON.stringify({ error: 'Invalid repository owner or name.' }), {
      status: 400,
    });
  }

  const cacheKey = `stargazers:${owner}:${repo}:page:${page}`;

  try {
    // Check if data is in cache
    let data = await redis.get(cacheKey);

    if (data) {
      // Data is in cache; data is already an object
    } else {
      // Data not in cache, fetch from GitHub API
      const octokit = new Octokit({
        auth: process.env.GITHUB_API_KEY,
      });

      const response = await octokit.request('GET /repos/{owner}/{repo}/stargazers', {
        owner,
        repo,
        page,
        per_page,
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      });

      const stargazers = response.data;

      // Fetch additional user details
      const userDetailsPromises = stargazers.map(async (user) => {
        const userDetails = await octokit.request('GET /users/{username}', {
          username: user.login,
        });
        return {
          ...user,
          details: userDetails.data,
        };
      });

      const stargazersWithDetails = await Promise.all(userDetailsPromises);

      // Parse Link header for pagination info
      const linkHeader = response.headers.link;
      let hasNextPage = false;
      let hasPrevPage = false;

      if (linkHeader) {
        const parsed = parseLinkHeader(linkHeader);
        hasNextPage = !!parsed.next;
        hasPrevPage = !!parsed.prev;
      }

      data = {
        stargazers: stargazersWithDetails,
        hasNextPage,
        hasPrevPage,
        currentPage: page,
      };

      // Cache the data with expiration of 4 hours
      await redis.setex(cacheKey, 60 * 60 * 4, data);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching stargazers:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.status || 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Helper function to parse the Link header
function parseLinkHeader(header) {
  const links = {};
  const parts = header.split(',');

  parts.forEach((part) => {
    const section = part.split(';');
    if (section.length !== 2) return;

    const url = section[0].replace(/<(.*)>/, '$1').trim();
    const name = section[1].replace(/rel="(.*)"/, '$1').trim();
    links[name] = url;
  });

  return links;
}
