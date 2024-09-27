import axios from 'axios';
import { redisGet, redisSet } from '../../../lib/redis';  // Redis functions for caching
import type { RequestHandler } from "@sveltejs/kit"; // Import necessary types

export const GET: RequestHandler = async ({ url }) => { // Changed 'get' to 'GET'
	const owner = url.searchParams.get("owner");
	const repo = url.searchParams.get("repo");
	const page = url.searchParams.get("page") || "1";
	const apiKey = url.searchParams.get("apiKey");

	// Check for required parameters
	if (!owner || !repo || !apiKey) {
		return new Response(JSON.stringify({ error: "Missing required parameters" }), { status: 400 });
	}

	const cacheKey = `${owner}-${repo}-${page}`;

	// Check Redis cache first
	const cachedStargazers = await redisGet(cacheKey);
	if (cachedStargazers) {
		return new Response(JSON.stringify(cachedStargazers), { status: 200 });
	}

	// If cache miss, make GitHub API call
	try {
		const response = await axios.get(
			`https://api.github.com/repos/${owner}/${repo}/stargazers`,
			{
				headers: {
					Authorization: `token ${apiKey}`,
				},
				params: {
					per_page: 100,
					page,
				},
			}
		);

		// Save the stargazers data to Redis (with a TTL of 1 hour)
		await redisSet(cacheKey, response.data, 3600);

		return new Response(JSON.stringify(response.data), { status: 200 });
	} catch (error) {
		console.error('Error fetching stargazers:', error);
		return new Response(JSON.stringify({ error: 'Error fetching stargazers' }), { status: 500 });
	}
};
