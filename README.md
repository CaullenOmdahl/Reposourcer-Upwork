# StarScope

## Overview

**StarScope** is a proof-of-concept web application designed to help GitHub repository owners analyze their stargazers. By visualizing and filtering stargazer data, developers can gain insights into the community interested in their projects.

## Features

- **Stargazer Analysis:** View detailed profiles of users who have starred your GitHub repositories.
- **Filtering Options:** Filter stargazers based on location, email availability, company affiliation, Twitter presence, and website availability.
- **Data Export:** Download filtered results as a CSV file for further analysis.
- **GitHub Activity Charts:** Visual representation of each stargazer's GitHub activity.
- **Responsive Design:** Accessible and optimized for various devices.

## Demo

[Live Demo](https://starscope-demo.com)

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **Git**

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/CaullenOmdahl/StarScope.git
   cd StarScope
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root directory and add your Upstash Redis credentials:

   ```env
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   ```

4. **Run the Development Server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Deployment

StarScope can be deployed on platforms like Vercel, Netlify, or any other that supports SvelteKit.

1. **Build the Application:**

   ```bash
   npm run build
   ```

2. **Deploy:**

   Follow the deployment instructions specific to your chosen platform.

## Technology Stack

- **Frontend:**
  - SvelteKit
  - Tailwind CSS
  - Papaparse for CSV generation

- **Backend:**
  - GitHub GraphQL API
  - Upstash Redis for caching and rate limit management

- **Others:**
  - Axios for HTTP requests

## Methodology

### Fetching Data

- Utilize GitHub's GraphQL API to fetch stargazer data, including detailed user information.
- Implement pagination to handle repositories with a large number of stargazers.

### Caching

- Use Upstash Redis to cache API responses, reducing redundant requests and adhering to rate limits.

### Filtering

- Provide a user-friendly interface to filter stargazers based on various criteria.
- Ensure real-time filtering without additional API calls.

### Exporting Data

- Enable users to download filtered results as CSV files for offline analysis.

## Limitations

- **GitHub API Rate Limits:** The application respects GitHub's API rate limits. Users should provide a valid GitHub API key to increase their rate limit quotas.
- **Maximum Stargazers Displayed:** Due to API limitations and performance considerations, a maximum of 100 stargazers are displayed per page.
- **Data Accuracy:** The application relies on GitHub's API for data accuracy. Any discrepancies on GitHub's side will reflect here.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.

## Contact

- Website: [caphe.media](https://caphe.media)
- LinkedIn: [Caullen Omdahl](https://www.linkedin.com/in/caullen/)
- Upwork: [Caullen Omdahl](https://www.upwork.com/freelancers/caullenomdahl2?mp_source=share)
