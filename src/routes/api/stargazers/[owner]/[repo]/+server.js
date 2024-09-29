// src/routes/api/stargazers/[owner]/[repo]/+server.js
import { Octokit } from '@octokit/rest';
import { graphql } from '@octokit/graphql';
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
      const token = process.env.GITHUB_API_KEY;
      if (!token) {
        return new Response(JSON.stringify({ error: 'GitHub API key is not set.' }), {
          status: 500,
        });
      }

      // Fetch stargazers and their details using GraphQL
      const query = `
        query($owner: String!, $repo: String!, $first: Int!, $after: String) {
          repository(owner: $owner, name: $repo) {
            stargazers(first: $first, after: $after) {
              pageInfo {
                hasNextPage
                hasPreviousPage
                endCursor
                startCursor
              }
              edges {
                starredAt
                node {
                  login
                  avatarUrl
                  htmlUrl: url
                  name
                  location
                  company
                  email
                  websiteUrl
                  twitterUsername
                  repositories {
                    totalCount
                  }
                }
              }
            }
          }
        }
      `;

      const variables = {
        owner,
        repo,
        first: per_page,
        after: null,
      };

      // Calculate the cursor for pagination
      if (page > 1) {
        const cursorCacheKey = `stargazers:${owner}:${repo}:page:${page - 1}:endCursor`;
        const previousEndCursor = await redis.get(cursorCacheKey);
        if (previousEndCursor) {
          variables.after = previousEndCursor;
        }
      }

      const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `token ${token}`,
        },
      });

      const response = await graphqlWithAuth(query, variables);

      const stargazersData = response.repository.stargazers;
      const stargazersWithDetails = stargazersData.edges.map((edge) => {
        const user = edge.node;
        return {
          login: user.login,
          avatar_url: user.avatarUrl,
          html_url: user.htmlUrl,
          details: {
            name: user.name,
            location: user.location,
            company: user.company,
            email: user.email,
            blog: user.websiteUrl,
            twitter_username: user.twitterUsername,
            public_repos: user.repositories.totalCount,
          },
        };
      });

      // Pagination info
      const hasNextPage = stargazersData.pageInfo.hasNextPage;
      const hasPrevPage = stargazersData.pageInfo.hasPreviousPage;
      const endCursor = stargazersData.pageInfo.endCursor;

      // Cache the endCursor for pagination
      if (endCursor) {
        const cursorCacheKey = `stargazers:${owner}:${repo}:page:${page}:endCursor`;
        await redis.setex(cursorCacheKey, 60 * 60 * 4, endCursor);
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
