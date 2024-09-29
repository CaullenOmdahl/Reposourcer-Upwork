// src/lib/utils/validators.js
export function validateRepoURL(url) {
  try {
    const parsedURL = new URL(url);
    if (parsedURL.hostname !== 'github.com') {
      return null;
    }
    const parts = parsedURL.pathname.split('/').filter(Boolean);
    if (parts.length < 2) {
      return null;
    }
    const [owner, repo] = parts;
    return { owner, repo };
  } catch (e) {
    return null;
  }
}
