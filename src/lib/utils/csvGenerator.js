// src/lib/utils/csvGenerator.js
import Papa from 'papaparse';

export function generateCSV(data) {
  const csvData = data.map((user) => ({
    Username: user.login,
    Name: user.name || '',
    Location: user.location || '',
    Company: user.company || '',
    Total_Repos: user.repositories?.totalCount || 0,
    Twitter: user.twitterUsername
      ? `https://twitter.com/${user.twitterUsername}`
      : '',
    Website: user.websiteUrl || '',
    Email: user.email || '',
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
