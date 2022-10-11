const { ethers } = require('ethers');
const fetch = require('node-fetch');

const INFURA_ENDPOINT = 'https://mainnet.infura.io/v3/' + process.env.INFURA_API_KEY;
const IPFS_URL = 'https://loopring.mypinata.cloud/ipfs/';

const provider = new ethers.providers.JsonRpcProvider(INFURA_ENDPOINT);

const getCounterFactualNFT = async (nft) => {
  try {
    const contractABIERC1155 = [`function uri(uint256 id) external view returns (string memory)`];

    const nftContract = new ethers.Contract('0xB25f6D711aEbf954fb0265A3b29F7b9Beba7E55d', contractABIERC1155, provider);

    const uri = await nftContract.uri(nft.nftID);
    return uri;
  } catch (error) {
    return null;
  }
};

const getERC721URI = async (nft, isFailOver = false) => {
  try {
    const contractABIERC721 = [
      `function tokenURI(uint256 tokenId) public view virtual override returns (string memory)`,
    ];

    const nftContract = new ethers.Contract(nft.token, contractABIERC721, provider);

    const uri = await nftContract.tokenURI(nft.nftID);
    return uri;
  } catch (error) {
    if (!isFailOver) {
      return await getERC1155URI(nft, true);
    } else {
      return await getCounterFactualNFT(nft);
    }
  }
};

const getERC1155URI = async (nft, isFailOver = false) => {
  try {
    const contractABIERC1155 = [`function uri(uint256 id) external view returns (string memory)`];
    const nftContract = new ethers.Contract(nft.token, contractABIERC1155, provider);

    const uri = await nftContract.uri(nft.nftID);

    return uri;
  } catch (error) {
    if (!isFailOver) {
      return await getERC721URI(nft, true);
    } else {
      return await getCounterFactualNFT(nft);
    }
  }
};

const getNftMetadata = async (token, nftID) => {
  const ipfsUri = await getERC1155URI({ token, nftID });
  if (!ipfsUri) {
    throw new Error('[CRITICAL] Could not get NFT IPFS');
  }
  const metadata = await fetch(ipfsUri.replace('ipfs://', IPFS_URL));
  return await metadata.json();
};

module.exports = {
  getCounterFactualNFT,
  getERC1155URI,
  getERC721URI,
  getNftMetadata
};