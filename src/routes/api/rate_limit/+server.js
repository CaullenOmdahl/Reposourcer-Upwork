// src/routes/api/rate_limit/+server.js
import { Octokit } from '@octokit/rest';

/**
 * Handles GET requests to fetch rate limit information.
 * Utilizes the user's GitHub API Key for authenticated requests.
 */
export async function GET({ request }) {
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
    const octokit = new Octokit({
      auth: apiKey,
    });

    const response = await octokit.request('GET /rate_limit', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching rate limit:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.status || 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
