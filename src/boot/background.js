import { Plugins } from '@capacitor/core';

const { App } = Plugins;

App.addListener('appStateChange', (state) => {
  console.log(state.isActive);
});
