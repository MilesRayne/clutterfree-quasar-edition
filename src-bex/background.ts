import { BexBridge } from '@quasar/app-vite';
import { bexBackground } from 'quasar/wrappers';

let bridgeInstance: BexBridge | null = null;

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.action.onClicked.addListener((/* tab */) => {
//     // Opens our extension in a new browser window.
//     // Only if a popup isn't defined in the manifest.
//     chrome.tabs.create(
//       {
//         url: chrome.runtime.getURL('www/index.html'),
//       },
//       (/* newTab */) => {
//         // Tab opened.
//       }
//     );
//   });
// });

chrome.runtime.onMessage.addListener((message) => {
  console.log('Caught the message', message);
  if (message.type == 'theme-change') {
    bridgeInstance!.send('theme-change', message.data);
  }
});

declare module '@quasar/app-vite' {
  interface BexEventMap {
    log: [{ message: string; data?: any[] }, never];
    getTime: [never, number];

    'storage.get': [{ key: string | null }, any];
    'storage.set': [{ key: string; value: any }, any];
    'storage.remove': [{ key: string }, any];
  }
}

export default bexBackground((bridge /* , allActiveConnections */) => {
  console.log('Background script running...');
  bridgeInstance = bridge;

  bridge.on('log', ({ data, respond }) => {
    console.log(
      `[Clutterfree - background] ${data.message}`,
      ...(data.data || [])
    );
    respond();
  });

  bridge.on('getTime', ({ respond }) => {
    respond(Date.now());
  });

  bridge.on('storage.get', ({ data, respond }) => {
    const { key } = data;
    if (key === null) {
      chrome.storage.local.get(null, (items) => {
        // Group the values up into an array to take advantage of the bridge's chunk splitting.
        respond(Object.values(items));
      });
    } else {
      chrome.storage.local.get([key], (items) => {
        respond(items[key]);
      });
    }
  });
  // Usage:
  // const { data } = await bridge.send('storage.get', { key: 'someKey' })

  bridge.on('storage.set', ({ data, respond }) => {
    chrome.storage.local.set({ [data.key]: data.value }, () => {
      respond();
    });
  });
  // Usage:
  // await bridge.send('storage.set', { key: 'someKey', value: 'someValue' })

  bridge.on('storage.remove', ({ data, respond }) => {
    chrome.storage.local.remove(data.key, () => {
      respond();
    });
  });

  // Usage:
  // await bridge.send('storage.remove', { key: 'someKey' })
  /*

  // Send a message to the client based on something happening.
  chrome.tabs.onCreated.addListener(tab => {
    bridge.send('browserTabCreated', { tab })
  })

  // Send a message to the client based on something happening.
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      bridge.send('browserTabUpdated', { tab, changeInfo })
    }
  })
   */
});
