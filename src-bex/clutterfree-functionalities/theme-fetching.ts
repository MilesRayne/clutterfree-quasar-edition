import { AbstractFunctionality } from './abstract-functionality';

export class ThemeFetching extends AbstractFunctionality {
  async run(): Promise<void> {
    //add listeners to theme preview buttons
    this.addThemePreviewListeners();
  }

  addThemePreviewListeners() {
    const themeButtons = this.$$('.theme-preview');

    //check if class cf-listeners-added is already present
    if (themeButtons![0].classList.contains('cf-listeners-added')) {
      return;
    }

    console.log('Adding theme preview listeners...');

    themeButtons!.forEach((button) => {
      button.classList.add('cf-listeners-added');
      button.addEventListener('click', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('A new theme preview was clicked');
        const data = await this.getStyles();
        try {
          console.log('Sending theme to background script', data);
          await chrome.runtime.sendMessage({
            type: 'theme-change',
            data,
          });
        } catch (error) {
          console.error('Error sending theme to background', error);
        }
      });
    });
  }

  async settingsChanged(): Promise<{ changed: boolean; theme: string }> {
    const userSettings = await this.getUserSettings();
    const currentTheme = this.getCurrentTheme();
    const changed = userSettings.aniList?.theme !== currentTheme;
    return {
      changed,
      theme: currentTheme,
    };
  }

  async updateSettings(theme) {
    const userSettings = await this.getUserSettings();
    userSettings.aniList = {
      ...userSettings.aniList,
      theme,
    };
    await this.setUserSettings(userSettings);
  }

  getCurrentTheme() {
    const body = document.body;
    const theme = body.classList.contains('site-theme-dark')
      ? 'dark'
      : body.classList.contains('site-theme-contrast')
      ? 'contrast'
      : 'light';

    console.log('current theme', theme);
    return theme;
  }
  async getStyles(updateSettings = true) {
    //find out which theme is active by the class of body
    const theme = this.getCurrentTheme();
    if (updateSettings) {
      await this.updateSettings(theme);
    }

    let style: CSSStyleDeclaration;

    switch (theme) {
      case 'dark':
      case 'contrast':
        style = getComputedStyle(document.body);
        break;
      case 'light':
        style = getComputedStyle(document.documentElement);
        break;
    }

    const colors = {
      background: style.getPropertyValue('--color-background'),
      foreground: style.getPropertyValue('--color-foreground'),
      text: style.getPropertyValue('--color-text'),
      mainHeader: theme == 'dark' ? '21,34,50' : '43,45,66',
    };

    return colors;
  }
}
