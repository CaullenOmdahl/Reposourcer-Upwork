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
		if (process.env.DEBUG === "TRUE") {
			console.log("Cached Stargazers Data:", cachedStargazers);
		}
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

		// Check if stargazers is already declared
		if (typeof stargazers === "undefined") {
			const stargazers = response.data; // Declare stargazers only if not already declared
		}

		// Log the fetched stargazers data if DEBUG is TRUE
		if (process.env.DEBUG === "TRUE") {
			console.log("Fetched Stargazers Data:", stargazers);
		}

		// Ensure company is fetched correctly in fetchStargazers
		const stargazers = response.data.map(stargazer => {
			const userDetails = stargazer.user;
			return {
				...stargazer,
				name: userDetails.name || "",
				location: userDetails.location || "",
				company: userDetails.company || "N/A", // Default to "N/A" if not available
				twitter: userDetails.twitter_username || "",
				website: userDetails.blog || "",
				email: userDetails.email || "",
				total_stars: stargazer.total_stars || 0,
			};
		});

		// Save the stargazers data to Redis (with a TTL of 1 hour)
		await redisSet(cacheKey, stargazers, 3600);

		return new Response(JSON.stringify(stargazers), { status: 200 });
	} catch (error) {
		console.error('Error fetching stargazers:', error);
		return new Response(JSON.stringify({ error: 'Error fetching stargazers' }), { status: 500 });
	}
};
