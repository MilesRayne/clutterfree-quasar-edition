import polyfill from './clutterfree-functionalities/polyfill';
import { Notifications } from './clutterfree-functionalities/notifications';
import { NotificationSettings } from './clutterfree-functionalities/notification-settings';
import { bexContent } from 'quasar/wrappers';
import { ThemeFetching } from './clutterfree-functionalities/theme-fetching';

const notifications = new Notifications();
const notificationSettings = new NotificationSettings();
const themeFetching = new ThemeFetching();

async function setupCSS() {
  const css = await polyfill.importCSS('assets/content.css');
  polyfill.GM_addStyle(css);
}

(async () => {
  polyfill.applyConsolePrefix();
  const observer = new MutationObserver(() => {
    if (window.location.hostname === 'anilist.co') {
      if (polyfill.page(/^\/settings/)) {
        themeFetching.init();
      } else if (polyfill.page(/^\/notifications/)) {
        notifications.init();
      } else if (polyfill.page(/^\/settings\/notifications/)) {
        notificationSettings.init();
      }
    }
  });

  observer.observe(document, { childList: true, subtree: true });

  await setupCSS();
})();

export default bexContent(() => {
  /**
   * Something to do
   */
});
