import { Navigation } from 'react-native-navigation';
import { iconsMap, iconsLoaded } from './appIcons';
import { registerScreens } from './screens';
import configureStore from './store/configureStore';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
const store = configureStore();

import { setDefaultNavOptions, showMainApp, showLogin } from './appNav';

registerScreens(store);

iconsLoaded.then(() => {
  startApp();
});

function setupGoogleSigin() {
  GoogleSignin.hasPlayServices({ autoResolve: true })
    .then(() => {
      GoogleSignin.configure({
        iosClientId: '280436316587-7nf2r3l2s0o2out6ootnqggfcr0p1j79.apps.googleusercontent.com', // only for iOS
        webClientId: '280436316587-pc2v79112kdqu0jiruu56m92s8nr4s42.apps.googleusercontent.com',
        offlineAccess: true
      }).then(() => {
        // start login screen on if user is available else main screen
        GoogleSignin.currentUserAsync().then((user) => {
          if (user && user.idToken) {
            showMainApp();
          } else {
            showLogin();
          }
        }).catch((e) => {
          console.error(e);
          showLogin();
        })
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
