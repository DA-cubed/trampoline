import { BigNumber, BigNumberish, ethers, Wallet } from 'ethers';
import { SimpleAccount, SimpleAccount__factory, SimpleAccountFactory, SimpleAccountFactory__factory, UserOperationStruct, } from '@account-abstraction/contracts';
import { arrayify, hexConcat } from 'ethers/lib/utils';


import { AccountApiParamsType, AccountApiType } from './types';
import { MessageSigningRequest } from '../../Background/redux-slices/signing';
import { TransactionDetailsForUserOp } from '@account-abstraction/sdk/dist/src/TransactionDetailsForUserOp';
import config from '../../../exconfig';

const FACTORY_ADDRESS = config.factory_address || '0x6C583EE7f3a80cB53dDc4789B0Af1aaFf90e55F3';
const entrypoint_abi = '[{ "inputs": [{ "components": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "bytes", "name": "initCode", "type": "bytes" }, { "internalType": "bytes", "name": "callData", "type": "bytes" }, { "internalType": "uint256", "name": "callGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "verificationGasLimit", "type": "uint256" }, { "internalType": "uint256", "name": "preVerificationGas", "type": "uint256" }, { "internalType": "uint256", "name": "maxFeePerGas", "type": "uint256" }, { "internalType": "uint256", "name": "maxPriorityFeePerGas", "type": "uint256" }, { "internalType": "bytes", "name": "paymasterAndData", "type": "bytes" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }], "internalType": "struct UserOperation", "name": "userOp", "type": "tuple" }], "name": "getUserOpHash", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }]'

const simpleAccount_abi = '[{ "inputs": [], "name": "getNonce", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]'

const new_provider = new ethers.providers.JsonRpcProvider(config.network.provider);


/**
 * An implementation of the BaseAccountAPI using the SimpleAccount contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
class SimpleAccountAPI extends AccountApiType {
  name: string;
  factoryAddress?: string;
  owner: Wallet;
  index: number;

  /**
   * our account contract.
   * should support the "execFromEntryPoint" and "nonce" methods
   */
  accountContract?: SimpleAccount;

  factory?: SimpleAccountFactory;

  constructor(params: AccountApiParamsType<{}>) {
    super(params);
    this.factoryAddress = FACTORY_ADDRESS;

    // this.owner = "e4aefe65eccaba065942581b83df0574e1f76951a5763bfb09011db17479525a"
    this.owner = params.deserializeState?.privateKey
      ? new ethers.Wallet(params.deserializeState?.privateKey)
      : ethers.Wallet.createRandom();
    this.index = 0;
    this.name = 'SimpleAccountAPI';
  }

  serialize = async (): Promise<object> => {
    return {
      privateKey: this.owner.privateKey,
    };
  };

  async createUnsignedUserOp(
    info: TransactionDetailsForUserOp): Promise<UserOperationStruct> {
      const userOp = await super.createUnsignedUserOp(info);
      console.log('sender', userOp.sender)
      const ww = await userOp.sender
      const zz = ww.toString().toLowerCase()
      console.log('zzzzz', zz)

      userOp.sender = zz
      console.log(userOp.sender)
      // await userOp.preVerificationGas;
      // const a = '0x'+Number(await userOp.preVerificationGas) * 3;
      // userOp.preVerificationGas = a.toString(16)
      userOp.preVerificationGas = Number(await userOp.preVerificationGas) *2.5;
      userOp.callGasLimit = Number(await userOp.callGasLimit) * 2.5;
      userOp.signature = "0x"
      console.log('unsigned', userOp);
      userOp.paymasterAndData = config.network.paymaster
      return userOp;
    }

  async _getAccountContract(): Promise<SimpleAccount> {
    if (this.accountContract == null) {
      this.accountContract = SimpleAccount__factory.connect(
        await this.getAccountAddress(),
        this.provider
      );
    }
    return this.accountContract;
  }

  /**
   * return the value to put into the "initCode" field, if the account is not yet deployed.
   * this value holds the "factory" address, followed by this account's information
   */
  async getAccountInitCode(): Promise<string> {
    if (this.factory == null) {
      if (this.factoryAddress != null && this.factoryAddress !== '') {
        this.factory = SimpleAccountFactory__factory.connect(
          this.factoryAddress,
          this.provider
        );
      } else {
        throw new Error('no factory to get initCode');
      }
    }
    return hexConcat([
      this.factory.address,
      this.factory.interface.encodeFunctionData('createAccount', [ await this.owner.getAddress(), this.index, ]),
    ]);
  }

  async getNonce(): Promise<BigNumber> {
    if (await this.checkAccountPhantom()) {
      return BigNumber.from(0);
    }

    const accountContract = await this._getAccountContract();
    const acc_contract = new ethers.Contract(accountContract.address, simpleAccount_abi, new_provider)
    // const accountContract = await this._getAccountContract();
    // console.log('acccontr', accountContract)
    const nonce_arr = await acc_contract.functions.getNonce();
    return nonce_arr[0]
  }

  /**
   * encode a method call from entryPoint to our contract
   * @param target
   * @param value
   * @param data
   */
  async encodeExecute(
    target: string,
    value: BigNumberish,
    data: string
  ): Promise<string> {
    const accountContract = await this._getAccountContract();
    return accountContract.interface.encodeFunctionData('execute', [
      target,
      value,
      data,
    ]);
  }

  async signUserOpHash(userOpHash: string): Promise<string> {
    const a = await this.owner.signMessage(arrayify(userOpHash));
    return a
  }

  signMessage = async (
    context: any,
    request?: MessageSigningRequest
  ): Promise<string> => {
    return this.owner.signMessage(request?.rawSigningData || '');
  };


  signUserOpWithContext = async ( userOp: UserOperationStruct, context: any): Promise<UserOperationStruct> => {

    const entr = new ethers.Contract(config.network.entryPointAddress, entrypoint_abi, new_provider)
      // const client = await Client.init(config.network.provider, config.network.entryPointAddress);
    const qwe = [userOp.sender, userOp.nonce, userOp.initCode, userOp.callData, userOp.callGasLimit, userOp.verificationGasLimit, userOp.preVerificationGas, userOp.maxFeePerGas, userOp.maxPriorityFeePerGas, userOp.paymasterAndData, userOp.signature]
    console.log('qwe', qwe)
    const hash = await entr.functions.getUserOpHash([userOp.sender, userOp.nonce, userOp.initCode, userOp.callData, userOp.callGasLimit, userOp.verificationGasLimit, userOp.preVerificationGas, userOp.maxFeePerGas, userOp.maxPriorityFeePerGas, userOp.paymasterAndData, userOp.signature])
    console.log('from entrypoint', hash)
    const a = {
      ...userOp,
      signature: await this.signUserOpHash(await hash[0]),
    };
    console.log(a)
    return a
  };
}

export default SimpleAccountAPI;
