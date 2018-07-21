import { Navigation } from 'react-native-navigation';
import { iconsMap, iconsLoaded } from './appIcons';
import { registerScreens } from './screens';
import configureStore from './store/configureStore';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
const store = configureStore();

import { setDefaultNavOptions, showMainApp, showLogin } from './appNav';
import { initStorage } from './initStorage';
import { httpClient } from './actions/httpClient';
import Config from './appConfig';

initStorage();

registerScreens(store);

iconsLoaded.then(() => {
  startApp();
});

function setupGoogleSigin() {
  GoogleSignin.hasPlayServices({ autoResolve: true })
    .then(() => {
      GoogleSignin.configure({
          iosClientId: Config.IOS_CLIENT_ID,
          webClientId: Config.WEB_CLIENT_ID,
          offlineAccess: true
      }).then(() => {
        // start login screen on if user is available else main screen
        GoogleSignin.currentUserAsync().then((user) => {
          if (user && user.idToken) {
            storage.save({key: 'loginState', data: user});
            storage.save({key: 'idToken', data: user.idToken});
            httpClient.defaults.headers.common['Authorization'] = `Bearer ${user.idToken}`;
            showMainApp();
          } else {
            showLogin();
          }
        }).catch((e) => {
          console.error(e);
          showLogin();
        });
      });
    })
    .catch(err => {
      console.log('Play services error', err.code, err.message);
    });
}

function startApp() {
  Navigation.events().registerAppLaunchedListener(() => {
    setDefaultNavOptions();
    setupGoogleSigin();
  });
}
