import redis from '../../redis'; // Import Redis
import axios from 'axios'; // Import axios for HTTP requests

export default async (req, res) => {
    const { owner, repo, page } = req.query; // Destructure query parameters
    const cacheKey = `${owner}-${repo}-${page}`; // Create a unique cache key

    // Check cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData)); // Return cached data
    }

    // Fetch from GitHub if not cached
    try {
        const response = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/stargazers`, {
                headers: {
                    Authorization: req.headers.authorization || `token ${process.env.GITHUB_API_KEY}`, // Use API key for authorization
                },
                params: {
                    per_page: 100,
                    page: page || 1 // Default to page 1 if not provided
                }
            }
        );

        // Store in cache (with expiration)
        await redis.set(cacheKey, JSON.stringify(response.data), 'EX', 3600); // 1 hour cache
        res.status(200).json(response.data); // Return fetched data
    } catch (error) {
        console.error("Error fetching stargazers from GitHub API:", error); // Log the error
        res.status(error.response ? error.response.status : 500).json({ error: error.message }); // Handle errors
    }
};