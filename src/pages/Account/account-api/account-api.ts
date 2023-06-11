import { BigNumber, BigNumberish, ethers, Wallet } from 'ethers';
import {
  SimpleAccount,
  SimpleAccount__factory,
  SimpleAccountFactory,
  SimpleAccountFactory__factory,
  UserOperationStruct,
} from '@account-abstraction/contracts';
import { arrayify, hexConcat } from 'ethers/lib/utils';

import { AccountApiParamsType, AccountApiType } from './types';
import { MessageSigningRequest } from '../../Background/redux-slices/signing';
import { TransactionDetailsForUserOp } from '@account-abstraction/sdk/dist/src/TransactionDetailsForUserOp';
import config from '../../../exconfig';

const FACTORY_ADDRESS =
  config.factory_address || '0x6C583EE7f3a80cB53dDc4789B0Af1aaFf90e55F3';

console.log(FACTORY_ADDRESS)

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
      // await userOp.preVerificationGas;
      // const a = '0x'+Number(await userOp.preVerificationGas) * 3;
      // userOp.preVerificationGas = a.toString(16)
      userOp.preVerificationGas = Number(await userOp.preVerificationGas) *2.5;
      userOp.callGasLimit = Number(await userOp.callGasLimit) * 2.5;
      console.log('unsigned', userOp);
      // userOp.paymasterAndData = "0x78Fd39Fd13dc35a22D72499B5B560B1AbCE62c7b"
      //
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
    return await accountContract.nonce();
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
    console.log('this',this)
    console.log('key', this.owner.privateKey)
    console.log('arryed', arrayify(userOpHash))
    console.log('hash', userOpHash)
    const a = await this.owner.signMessage(arrayify(userOpHash));
    console.log('signed', a)
    return a
  }

  signMessage = async (
    context: any,
    request?: MessageSigningRequest
  ): Promise<string> => {
    console.log('context', context)
    return this.owner.signMessage(request?.rawSigningData || '');
  };

  signUserOpWithContext = async ( userOp: UserOperationStruct, context: any): Promise<UserOperationStruct> => {
    console.log('cont', context)
    console.log('realuserop', userOp)
    const a = {
      ...userOp,
      signature: await this.signUserOpHash(await this.getUserOpHash(userOp)),
    };
    console.log(a)
    return a
  };
}

export default SimpleAccountAPI;
