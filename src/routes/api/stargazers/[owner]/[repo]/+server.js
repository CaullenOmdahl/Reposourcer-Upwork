// src/routes/api/stargazers/[owner]/[repo]/+server.js
import { Octokit } from '@octokit/rest';
import { redis } from '$lib/server/utils/redis';

/**
 * Handles GET requests to fetch stargazers for a repository.
 * Utilizes the user's GitHub API Key for authenticated requests.
 */
export async function GET({ params, url, request }) {
  const { owner, repo } = params;

  if (!owner || !repo) {
    return new Response(JSON.stringify({ error: 'Invalid repository owner or name.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Extract API Key from headers
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'GitHub API Key is missing in headers.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const tokenMatch = authHeader.match(/token\s+(.+)/i);
  const apiKey = tokenMatch ? tokenMatch[1] : null;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Invalid GitHub API Key format.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const cacheKey = `stargazers:${owner}:${repo}:all`;

  try {
    // Check if data is in cache
    let data = await redis.get(cacheKey);

    if (data) {
      // Data is in cache; no need to fetch again
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Data not in cache; fetch all stargazers from GitHub API
      const octokit = new Octokit({
        auth: apiKey,
      });

      let allStargazers = [];
      let currentPage = 1;
      const per_page = 100; // Maximum per page for GitHub API
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await octokit.request('GET /repos/{owner}/{repo}/stargazers', {
          owner,
          repo,
          page: currentPage,
          per_page,
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        });

        const stargazers = response.data;

        // Fetch additional user details in batches to respect rate limits
        const userDetailsPromises = stargazers.map(async (user) => {
          try {
            const userDetails = await octokit.request('GET /users/{username}', {
              username: user.login,
            });
            return {
              ...user,
              details: userDetails.data,
            };
          } catch (error) {
            console.error(`Error fetching details for user ${user.login}:`, error);
            return {
              ...user,
              details: null,
            };
          }
        });

        const stargazersWithDetails = await Promise.all(userDetailsPromises);
        allStargazers = allStargazers.concat(stargazersWithDetails);

        // Check if there is a next page
        const linkHeader = response.headers.link;
        if (linkHeader) {
          const parsed = parseLinkHeader(linkHeader);
          hasNextPage = !!parsed.next;
          currentPage += 1;
        } else {
          hasNextPage = false;
        }
      }

      data = {
        stargazers: allStargazers,
      };

      // Cache the data with expiration of 4 hours
      await redis.setex(cacheKey, 60 * 60 * 4, data);

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
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
