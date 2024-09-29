// src/routes/api/stargazers/[owner]/[repo]/+server.js

import { Octokit } from '@octokit/rest';
import { graphql } from '@octokit/graphql';
import { redis } from '$lib/server/utils/redis';

export async function GET({ params, request }) {
  const { owner, repo } = params;

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

  const cacheKey = `stargazers:${owner}:${repo}`;

  try {
    // Check if data is in cache
    let cachedData = await redis.get(cacheKey);

    if (cachedData) {
      const data = JSON.parse(cachedData);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch data using GraphQL
    const graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `token ${apiKey}`,
      },
    });

    let hasNextPage = true;
    let endCursor = null;
    const allStargazers = [];

    while (hasNextPage) {
      const query = `
        query ($owner: String!, $name: String!, $after: String) {
          repository(owner: $owner, name: $name) {
            stargazers(first: 100, after: $after) {
              pageInfo {
                endCursor
                hasNextPage
              }
              nodes {
                login
                name
                avatarUrl
                url
                company
                email
                location
                websiteUrl
                twitterUsername
                repositories {
                  totalCount
                }
              }
            }
          }
        }
      `;

      const variables = {
        owner,
        name: repo,
        after: endCursor,
      };

      const response = await graphqlWithAuth(query, variables);

      const stargazersData = response.repository.stargazers.nodes;
      allStargazers.push(...stargazersData);

      hasNextPage = response.repository.stargazers.pageInfo.hasNextPage;
      endCursor = response.repository.stargazers.pageInfo.endCursor;
    }

    const dataToCache = { stargazers: allStargazers };

    // Cache the data with a 4-hour expiration
    await redis.setex(cacheKey, 60 * 60 * 4, JSON.stringify(dataToCache));

    return new Response(JSON.stringify(dataToCache), {
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
