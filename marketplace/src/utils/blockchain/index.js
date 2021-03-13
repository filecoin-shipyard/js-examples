const Web3 = require("web3");
const contract = require("./contract");
const metamask = window.ethereum;

const NETWORK_URL = "http://127.0.0.1:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(NETWORK_URL));

const MemeMarketplace = new web3.eth.Contract(contract.abi, contract.address, {
  from: metamask.selectedAddress,
});

console.log(metamask.selectedAddress);

export const awardMemeToken = async (address, tokenMetadata, callback) => {
  try {
    let data = MemeMarketplace.methods
      .awardMemeToken(address, tokenMetadata)
      .encodeABI();

    const receipt = await metamask.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: metamask.selectedAddress,
          to: contract.address,
          data,
        },
      ],
    });

    await callback(null, receipt);
  } catch (err) {
    console.error(err);
  }
};

export const getTokenOwner = async (tokenId) => {
  try {
    let data = MemeMarketplace.methods.ownerOf(tokenId).encodeABI();

    const receipt = await metamask.request({
      method: "eth_call",
      params: [
        {
          from: metamask.selectedAddress,
          to: contract.address,
          data,
        },
      ],
    });

    await web3.eth.abi.decodeParameters(["address"], receipt);
  } catch (err) {
    console.error(err);
  }
};

export const getTokenMetadata = async (tokenId) => {
  try {
    let data = MemeMarketplace.methods.tokenURI(tokenId).encodeABI();

    const receipt = await metamask.request({
      method: "eth_call",
      params: [
        {
          from: metamask.selectedAddress,
          to: contract.address,
          data,
        },
      ],
    });

    await web3.eth.abi.decodeParameters(["string"], receipt);
  } catch (err) {
    console.error(err);
  }
};

export const getTotalSupply = async () => {
  try {
    let data = MemeMarketplace.methods.totalSupply().encodeABI();

    const receipt = await metamask.request({
      method: "eth_call",
      params: [
        {
          from: metamask.selectedAddress,
          to: contract.address,
          data,
        },
      ],
    });
    await web3.eth.abi.decodeParameters(["uint256"], receipt);
  } catch (err) {
    console.error(err);
  }
};
