import {
    ConnectedWalletAccount,
    RequestSignTransactionsOptions,
    SignInOptions,
    WalletConnection,
} from "../wallet-connection";

import { Near } from '../../near';
import { Account, SignAndSendTransactionOptions } from '../../account'
import { InjectedWallet, RequestSignTransactionsInjectedOptions } from "./wallet-injected-interface";
import { FinalExecutionOutcome } from "../../providers";
import { Transaction } from "../../transaction";

export class WalletConnectionInjected extends WalletConnection {
    private injecteWallet: InjectedWallet;

    constructor(near: Near, appKeyPrefix: string | null, walletName: string) {
        super(near, appKeyPrefix);
        this.injecteWallet = window[walletName] as InjectedWallet;
    }

    async requestSignTransactions({ transactions }: RequestSignTransactionsOptions): Promise<void> {
        // TODO: we should have a common interface here
        this.injecteWallet.requestSignTransactions({ transactions } as RequestSignTransactionsInjectedOptions)
            .then((res) => {
                // TODO: change interface or convert responce
                console.log('requestSignTransactions res:', res);
            });
    }

    async requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions): Promise<void> {
        this.injecteWallet.requestSignIn({
            contractId, methodNames
        }).then((result) => {
            console.log('requestSignIn result:', result);
        })
        //TODO: how to return something here? Should we change interface?
    }

    isSignedIn(): boolean {
        return this.injecteWallet.isSignedIn();
    }

    getAccountId(): string {
        return this.injecteWallet.getAccountId();
    }

    signOut(): boolean {
        return this.injecteWallet.signOut();
    }

    account(): Account {
        if (!this._connectedAccount) {
            this._connectedAccount = new ConnectedWalletAccountInjected(this, this._near.connection, this.getAccountId());
        }
        return this._connectedAccount;
    }
}

class ConnectedWalletAccountInjected extends ConnectedWalletAccount {
    /**
    * Sign a transaction with InjectedWallet
    */
    async signAndSendTransaction({ receiverId, actions, walletMeta, walletCallbackUrl }: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> {
        this.walletConnection.requestSignTransactions({ transactions: [{ receiverId, actions } as Transaction] });
        return null; //TODO: convert or create common interface
    }
}