# GitHub Stargazers Viewer

This project is a web application that allows users to view the list of stargazers for a specific GitHub repository. It utilizes Redis for caching and Axios for making HTTP requests to the GitHub API.

## Features
- View stargazers of a GitHub repository
- Caching of API responses using Redis
- Pagination for stargazer results
- Filters for location and email availability
- User-friendly interface with modals for API key input

## Technologies Used
- Svelte for the frontend
- Node.js with Express for the backend
- Redis for caching
- Axios for HTTP requests

## Setup

### Prerequisites
- Node.js (v14 or higher)
- Redis server (local or Upstash)
- GitHub API key

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/github-stargazers-viewer.git
   cd github-stargazers-viewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```plaintext
   GITHUB_API_KEY=your_github_api_key
   UPSTASH_REDIS_URL=your_upstash_redis_url
   UPSTASH_REDIS_PASSWORD=your_upstash_redis_password
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage
- Enter the GitHub repository URL in the input field (e.g., `https://github.com/owner/repo`).
- Click the "Search" button to fetch stargazers.
- Use the filters to narrow down the results by location and email availability.
- Select stargazers using checkboxes and download the selected stargazers as a CSV file.

## Deployment
To deploy the application, you can use platforms like Vercel or Heroku. Ensure that your environment variables are set in the deployment platform.

1. Push your code to a Git repository.
2. Connect your repository to the deployment platform.
3. Set the environment variables in the platform's settings.
4. Deploy the application.

## Possible Improvements
- Implement user authentication to save favorite repositories.
- Add more filters (e.g., by date of stargazing).
- Improve error handling and user feedback for API failures.
- Enhance UI/UX with better styling and animations.
- Implement unit and integration tests for better reliability.

## License
This project is licensed under the MIT License.