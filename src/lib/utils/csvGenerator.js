// src/lib/utils/csvGenerator.js
import Papa from 'papaparse';

export function generateCSV(data) {
  const csvData = data.map((user) => ({
    Username: user.login,
    Name: user.details?.name || '',
    Location: user.details?.location || '',
    Company: user.details?.company || '',
    Total_Stars: user.details?.public_repos || 0,
    Twitter: user.details?.twitter_username
      ? `https://twitter.com/${user.details.twitter_username}`
      : '',
    Website: user.details?.blog || '',
    Email: user.details?.email || '',
  }));

  const csv = Papa.unparse(csvData);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'stargazers.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
