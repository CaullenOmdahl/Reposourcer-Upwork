import axios from 'axios';
import { redisGet, redisSet } from '../../../lib/redis';  // Redis functions for caching
import type { RequestHandler } from "@sveltejs/kit"; // Import necessary types

export const GET: RequestHandler = async ({ url }) => {
	const owner = url.searchParams.get("owner");
	const repo = url.searchParams.get("repo");
	const page = url.searchParams.get("page") || "1";
	const apiKey = url.searchParams.get("apiKey");

	// Check for required parameters
	if (!owner || !repo || !apiKey) {
		return new Response(JSON.stringify({ error: "Missing required parameters" }), { status: 400 });
	}

	const cacheKey = `${owner}-${repo}-${page}`;
	const isLocalhost = process.env.NODE_ENV === "development"; // Check if running locally

	let cachedStargazers;
	// Check Redis cache only if not running on localhost
	if (!isLocalhost) {
		cachedStargazers = await redisGet(cacheKey);
		if (cachedStargazers) {
			if (process.env.DEBUG === "TRUE") {
				console.log("Cached Stargazers Data:", cachedStargazers);
			}
			return new Response(JSON.stringify(cachedStargazers), { status: 200 });
		}
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

		const stargazers = response.data.map(stargazer => {
			const userDetails = stargazer.user || {}; // Default to an empty object if user is undefined
			return {
				...stargazer,
				name: userDetails.name || "Unknown", // Provide a default value
				location: userDetails.location || "N/A",
				company: userDetails.company || "N/A",
				twitter: userDetails.twitter_username || "",
				website: userDetails.blog || "",
				email: userDetails.email || "",
				total_stars: stargazer.total_stars || 0,
			};
		});

		// Save the stargazers data to Redis only if not running on localhost
		if (!isLocalhost) {
			await redisSet(cacheKey, stargazers, 3600);
		}

		return new Response(JSON.stringify(stargazers), { status: 200 });
	} catch (error) {
		console.error('Error fetching stargazers:', error);
		return new Response(JSON.stringify({ error: 'Error fetching stargazers' }), { status: 500 });
	}
};