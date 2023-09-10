import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { WagmiConfig, createClient } from 'wagmi';
import { configureChains } from '@wagmi/core';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { fantomTestnet } from 'wagmi/chains';

import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { FANTOM_DEV_NODE } from 'constants/addresses';
import Sdk, { ManifestBuilder } from '@radixdlt/alphanet-walletextension-sdk';
import {
  StateApi,
  StatusApi,
  TransactionApi
} from '@radixdlt/alphanet-gateway-api-v0-sdk';

import './index.scss';

require('@solana/wallet-adapter-react-ui/styles.css');

const sdk = Sdk();

const _transactionApi = new TransactionApi();
const _statusApi = new StatusApi();
const stateApi = new StateApi();

const test = async () => {
  try {
    const result = await sdk.request({
      accountAddresses: {}
    });
    if (result.isErr()) {
      throw result.error;
    }

    const { accountAddresses } = result.value;
    if (accountAddresses) {
      const addr = accountAddresses[0].address;
      const balance = await getBalance(addr);
      console.log(addr, balance);
      //send(addr)
    }
  } catch (err) {
    console.log(err);
  }
};
setTimeout(test, 1000);

const getBalance = async (addr: string) => {
  try {
    const account_state = await stateApi.stateComponentPost({
      v0StateComponentRequest: { component_address: addr }
    });

    const account_vault: any = account_state.owned_vaults.find(
      (vault: any) =>
        vault.resource_amount.resource_address == '[resource_address]'
    );
    if (account_vault) {
      const amount =
        account_vault.resource_amount.amount_attos / Math.pow(10, 18);
      return amount;
    }
  } catch (err) {
    console.log(err);
  }
  return 0;
};

const _send = async (addr: string) => {
  const manifest = new ManifestBuilder()
    .callMethod(addr, 'lock_fee', ['Decimal("100")'])
    .withdrawFromAccountByAmount(
      addr,
      10,
      'resource_tdx_a_1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqegh4k9'
    )
    .callMethod(addr, 'deposit_batch', ['Expression("ENTIRE_WORKTOP")'])
    .build()
    .toString();

  console.log(manifest);

  const transactionHash = await sdk
    .sendTransaction(manifest)
    .map((response) => response.transactionHash);

  console.log(transactionHash);
};

const { provider, chains } = configureChains(
  [fantomTestnet],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: FANTOM_DEV_NODE
      })
    })
  ]
);

const client = createClient(
  getDefaultClient({
    appName: 'Ponzi Roll',
    chains,
    provider: provider
  })
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const App = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WagmiConfig client={client}>
            <ConnectKitProvider>
              <RouterProvider router={router} />
            </ConnectKitProvider>
          </WagmiConfig>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
