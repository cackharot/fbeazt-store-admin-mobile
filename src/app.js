import { Navigation } from 'react-native-navigation';
import { iconsMap, iconsLoaded } from './appIcons';
import { registerScreens } from './screens';
import configureStore from './store/configureStore';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
const store = configureStore();

import { setDefaultNavOptions, showMainApp, showLogin } from './appNav';
import { initStorage } from './initStorage';
import { httpClient } from './actions/httpClient';
import { setupNotification } from './pushNotification';
import Config from './appConfig';

startApp();

function setupGoogleSigin() {
  GoogleSignin.hasPlayServices({ autoResolve: true })
    .then(() => {
      console.log('Configuring google sigin');
      GoogleSignin.configure({
          iosClientId: Config.IOS_CLIENT_ID,
          webClientId: Config.WEB_CLIENT_ID,
          offlineAccess: false,
          forceConsentPrompt: true
      }).then(() => {
          showLogin();
      });
    })
    .catch(err => {
      console.log('Play services error', err.code, err.message);
      showLogin();
    });
}

function startApp() {
    console.log('Starting app');
    Navigation.events().registerAppLaunchedListener(() => {
        initStorage();
        registerScreens(store);

        iconsLoaded.then(() => {
            setDefaultNavOptions();
            setupGoogleSigin();
        });
    });
}
