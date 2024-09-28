import { fetchStargazers } from '$lib/utils/api';

export async function get({ params }) {
  const { owner, repo } = params;

  try {
    const data = await fetchStargazers(owner, repo);
    return {
      status: 200,
      body: data,
    };
  } catch (error) {
    return {
      status: 500,
      body: { error: error.message },
    };
  }
}
