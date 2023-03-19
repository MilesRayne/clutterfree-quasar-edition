export class UserSettings {
  notifications: {
    shouldGroup?: boolean;
    byPerson?: boolean;
  };
  aniList: {
    theme: string;
  };

  constructor() {
    this.notifications = {
      shouldGroup: true,
      byPerson: false,
    };
    this.aniList = {
      theme: 'dark',
    };
  }
}
