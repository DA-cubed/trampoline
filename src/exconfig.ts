// eslint-disable-next-line import/no-anonymous-default-export
export default {
  enablePasswordEncryption: false,
  showTransactionConfirmationScreen: true,
  factory_address: '0xbFC8B462184Dd935CcB1D8a055237a427752eF08',
  stateVersion: '0.1',
  network: {
    chainID: '5',
    family: 'EVM',
    name: 'Goerli',
    // provider: 'https://goerli.infura.io/v3/98ca88c0245b473e8ae0274702536b17',
    provider: 'https://rpc.eu-north-1.gateway.fm/v4/ethereum/non-archival/goerli',
    entryPointAddress: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    paymaster: '0xd4b251Fb8B53B5fF567EbF92581b6a2425739766',
    bundler:
      'https://node.stackup.sh/v1/rpc/006aef92ec2aa68080f7a66eeac8b0a3d6d402a6371d209f49da9d12f7c08ff6',
      // 'https://api.blocknative.com/v1/goerli/bundler',
    optimismBundler: 'https://api.stackup.sh/v1/node/3127139e1c53688c0b9a1f4e8f0353481b7379375b2c9fc2f7524486cbf1ca5c',
    optimismNode: 'https://rpc.eu-north-1.gateway.fm/v4/optimism/non-archival/goerli',
    baseAsset: {
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
      image:
        'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
    },
  },
};



