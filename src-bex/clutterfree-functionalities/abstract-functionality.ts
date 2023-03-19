import { UserSettings } from 'src/models/user-settings.model';

export abstract class AbstractFunctionality {
  $ = (selector: string) => document.querySelector(selector);
  $$ = (a: string) => Array.from(document.querySelectorAll(a));
  running = false;
  async init() {
    if (this.running) return;

    this.running = true;
    await this.run();
    this.stopRunning();
  }

  async getUserSettings() {
    try {
      let settings: UserSettings = (
        await chrome.storage.sync.get('clutterfree')
      ).clutterfree as UserSettings;

      if (settings) {
        return settings;
      } else {
        settings = new UserSettings();
        await chrome.storage.sync.set({ clutterfree: settings });
        return settings;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async setUserSettings(settings: UserSettings) {
    try {
      await chrome.storage.sync.set({ clutterfree: settings });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  stopRunning() {
    this.running = false;
  }

  abstract run(): Promise<void>;
}
