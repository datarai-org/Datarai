import React, { useEffect, useState } from 'react';

const GitHubCommitCount = ({ username, repo, branch }) => {
  const [commitCount, setCommitCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommitCount = async () => {
      try {
        const url = `https://api.github.com/repos/${username}/${repo}/commits?sha=${branch}&per_page=1&page=1`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const linkHeader = response.headers.get('Link');

        if (!linkHeader) {
          throw new Error('No Link header found');
        }

        // Extract the page count from the rel="last" link
        const lastPageLink = linkHeader.split(',').find(link => link.includes('rel="last"'));
        if (!lastPageLink) {
          throw new Error('No rel="last" link found');
        }

        const lastPageUrl = lastPageLink.match(/<(.*?)>/)[1];
        const urlParams = new URLSearchParams(lastPageUrl.split('?')[1]);
        const pageCount = urlParams.get('page');

        setCommitCount(parseInt(pageCount, 10));
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCommitCount();
  }, [username, repo, branch]);

  return (
    <div>
      {commitCount !== null ? (
        <p className='text-black/50 dark:text-text-dark/50 text-xs'>Vers. 1.0.{commitCount} (Alpha)</p>
      ) : (
        <p className='text-black/50 dark:text-text-dark/50 text-xs'>1.0.0 (Alpha)</p>
      )}
    </div>
  );
};

export default GitHubCommitCount;