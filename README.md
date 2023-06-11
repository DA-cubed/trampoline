<img src="src/assets/img/logo.png" width="260"/>

## DA(cubed) account abstraction wallet extension

### Run:

1. Verify that your [Node.js](https://nodejs.org/) version is >= **18.12.0**.
2. Clone this repository.
3. Make sure you configure the `provider` in `src/exconfig.ts` to the `Goerli` network.
4. Edit the `bundler` URL pointing to `Goerli` network and accepting EntryPoint=`0x0576a174D229E3cFA37253523E645A78A0C91B57`
5. Run `yarn install` to install the dependencies.
6. Run `yarn start`
7. Load your extension in Chrome by following these steps:
   1. Go to `chrome://extensions/`
   2. Enable `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `build` folder.
8. Happy hacking.


For the moment the paymaster is hardcoded in the config, not chosen by a user.

> **Warning**
> Auto refresh is disabled by default, so you will have to manually refresh the page.
> If you make changes in background script or account-api, you will also have to refresh the background page. Check instructions on how to do that below.

> **Warning**
> Logs of all the blockchain interactions are shown in the background script. Do keep it open for faster debugging.


