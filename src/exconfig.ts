// eslint-disable-next-line import/no-anonymous-default-export
export default {
  enablePasswordEncryption: false,
  showTransactionConfirmationScreen: true,
  factory_address: '0x09c58cf6be8E25560d479bd52B4417d15bCA2845',
  stateVersion: '0.1',
  network: {
    chainID: '5',
    family: 'EVM',
    name: 'Goerli',
    provider: 'https://goerli.infura.io/v3/98ca88c0245b473e8ae0274702536b17',
    entryPointAddress: '0x0576a174D229E3cFA37253523E645A78A0C91B57',
    bundler:
      // 'https://node.stackup.sh/v1/rpc/006aef92ec2aa68080f7a66eeac8b0a3d6d402a6371d209f49da9d12f7c08ff6',
      'https://api.blocknative.com/v1/goerli/bundler',
    baseAsset: {
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
      image:
        'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp',
    },
  },
};
