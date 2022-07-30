let { Octokit } = require('@octokit/rest');
const fetch = require('node-fetch');
Octokit = Octokit.plugin(require('octokit-commit-multiple-files'));

const GITHUB_API_KEY = process.env.GITHUB_API_KEY;

const octokit = new Octokit({
  auth: GITHUB_API_KEY,
});

/**
 * 
 * @param {string} filePath Path of the file in the repository.
 * @returns {Promise<{ sha: string, content: string }>}
 */
const getFile = async (filePath) => {
  const { data: result } = await octokit.rest.repos.getContent({
    owner: 'marekpw',
    repo: 'nft-tracker',
    path: filePath,
  });

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

const updateMultipleFiles = async files => {
  return await octokit.rest.repos.createOrUpdateFiles({
    owner: 'marekpw',
    repo: 'nft-tracker',
    branch: 'master',
    changes: [
      {
        message: 'netlify bot: update files',
        files
      }
    ]
  });
};

module.exports = {
  getFile,
  updateMultipleFiles,
};