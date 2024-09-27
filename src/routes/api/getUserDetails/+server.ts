import axios from 'axios';
import { redisGet, redisSet } from '../../../lib/redis';  // Import redis utility functions
import type { RequestHandler } from "@sveltejs/kit"; // Use type-only import for request handler

export const GET: RequestHandler = async (req) => {
	const url = new URL(req.url);
	const username = url.searchParams.get("username");
	const cacheKey = `user-${username}`;

	// Check if running on localhost
	const isLocalhost = process.env.NODE_ENV === "development";

	// Check Redis cache only if not running on localhost
	let cachedUser;
	if (!isLocalhost) {
		cachedUser = await redisGet(cacheKey);
		if (cachedUser) {
			if (process.env.DEBUG === "TRUE") {
				console.log("Cached User Data:", cachedUser);
			}
			return new Response(JSON.stringify(cachedUser), { status: 200 });
		}
	}

	// If cache miss, make GitHub API call
	try {
		const apiKey = process.env.GITHUB_API_KEY; // Use the API key from .env
		const response = await axios.get(
			`https://api.github.com/users/${username}`,
			{
				headers: {
					Authorization: `token ${apiKey}`,
					Accept: "application/vnd.github.v3+json"
				},
			}
		);

		if (process.env.DEBUG === "TRUE") {
			console.log("Fetched User Data:", response.data);
		}

		// Save the user data to Redis only if not running on localhost
		if (!isLocalhost) {
			await redisSet(cacheKey, response.data, 3600);
		}

		return new Response(JSON.stringify(response.data), { status: 200 });
	} catch (error) {
		console.error('Error fetching user details:', error);
		return new Response(JSON.stringify({ error: 'Error fetching user details' }), { status: 500 });
	}
};