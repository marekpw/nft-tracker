const fetch = require('node-fetch');

const GITHUB_API_KEY = process.env.GITHUB_API_KEY;

/**
 * 
 * @param {string} filePath Path of the file in the repository.
 * @returns {Promise<{ sha: string, content: string }>}
 */
const getFile = async (filePath) => {
  const file = await fetch(`https://api.github.com/repos/marekpw/nft-tracker/contents/${filePath}`, {
    method: 'GET',
    headers: {
      Authorization: `token ${GITHUB_API_KEY}`,
    },
  });

  const result = await file.json();
  if (result.content) {
    return {
      ...result,
      content: Buffer.from(result.content, 'base64'),
    };
  }

  if (!result.download_url) {
    throw new Error(`File ${filePath}: No content received, cannot continue.`);
  }

  console.log(`[INFO] file ${filePath}: downloading contents from ${result.download_url}...`);

  // The file is too big to be returned directly - we need to download it with another request.
  const fileContents = await fetch(result.download_url);

  // download urls are not encoded in base64 so no need to decode anything
  const text = await fileContents.text();
  return {
    ...result,
    content: text,
  }
};

/**
 * 
 * @param {string} filePath Path to the file in the repository.
 * @param {string} sha SHA of the blob
 * @param {string} fileContent Contents of the file, without base64. Will be encoded automatically.
 * @returns {Promise<void>}
 */
const updateFile = async (filePath, sha, fileContent) => {
  const response = await fetch(`https://api.github.com/repos/marekpw/nft-tracker/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_API_KEY}`,
    },
    body: JSON.stringify({
      message: `netlify bot: update ${filePath}`,
      committer: {
        name: 'Netlify Bot',
        email: 'michal@marek.pw'
      },
      content: Buffer.from(fileContent).toString('base64'),
      sha,
    }),
  });

  return await response.json();
};

module.exports = {
  getFile,
  updateFile,
};