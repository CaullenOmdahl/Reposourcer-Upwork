import axios from 'axios';

export default async (req, res) => {
    const { username } = req.query;
    const apiKey = process.env.GITHUB_API_KEY;

    try {
        const response = await axios.get(`https://api.github.com/users/${username}`, {
            headers: {
                Authorization: `token ${apiKey}`,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching user details from GitHub API:", error); // Log the error
        res.status(error.response ? error.response.status : 500).json({ error: error.message });
    }
};