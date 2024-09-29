// src/routes/api/stargazers/[owner]/[repo]/+server.js

import { graphql } from '@octokit/graphql';
import { redis } from '$lib/server/utils/redis';

export async function GET({ params, url, request }) {
  const { owner, repo } = params;

  // Extract query parameters
  const perPage = parseInt(url.searchParams.get('per_page')) || 100;
  const cursor = url.searchParams.get('cursor') || null;

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

  try {
    // Create GraphQL client
    const graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `token ${apiKey}`,
      },
    });

    // Build GraphQL query
    const query = `
      query ($owner: String!, $name: String!, $after: String, $first: Int!) {
        repository(owner: $owner, name: $name) {
          stargazers(first: $first, after: $after) {
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
      after: cursor,
      first: perPage,
    };

    // Fetch data from GitHub API
    const response = await graphqlWithAuth(query, variables);

    const stargazersData = response.repository.stargazers.nodes;
    const pageInfo = response.repository.stargazers.pageInfo;

    // Prepare response data
    const data = {
      stargazers: stargazersData,
      pageInfo,
    };

    // Return response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching stargazers:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
