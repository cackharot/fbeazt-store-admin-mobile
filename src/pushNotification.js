import { Platform } from 'react-native';
import Config from './appConfig';
import { PushNotificationService } from './services/pushNotificationService';

registerDevice = (email, tokenData, prevTokenData) => {
    const token = tokenData['token'];
    const prevToken = prevTokenData['token'];
    if (token === prevToken) {
        return;
    }
    let service = new PushNotificationService();
    if(prevToken && prevToken.length > 0) {
        service.unregister(email, prevToken).catch((e)=>{
            console.error(`Failed to unregister device ${e}`);
        });
    }
    service.register(email, tokenData).catch((e)=>{
        console.error(`Failed to register device ${e}`);
    });
}

showLocalNotification = (pn) => {
    pn.localNotification({
        title: 'Login success',
        message: 'You will be notified on new Orders'
    });
}

_configurePushNotification = async (email) => {
    var PushNotification = require('react-native-push-notification');
    const DEVICE_TOKEN_KEY = "device-token-key";
    console.log(`Configuring PUSH notification with GCM Sender ID: ${Config.GCM_SENDER_ID}`);

    PushNotification.configure({
        onRegister: function (tokenData) {
            console.log('GCM TOKEN:', tokenData);
            storage.load({key: DEVICE_TOKEN_KEY, autoSync: false})
                .then((prevTokenData) => {
                    registerDevice(email, tokenData, prevTokenData);
                }).catch((e)=> {
                    storage.save({key: DEVICE_TOKEN_KEY, data: tokenData });
                    registerDevice(email, tokenData, null);
                });
            showLocalNotification(PushNotification);
        },
        // (required) Called when a remote or local notification is opened or received
        onNotification: function (notification) {
            console.log('RECEIVED NOTIFICATION:', notification);
            if (notification.foreground === true && notification.userInteraction === false && notification['google.message_id']) {
                // that._showLocalNotification(notification);
            }
            if (notification.userInteraction === true) {
                // that._tryNavigateOnNotification(notification);
            }
        },
        // ANDROID ONLY: (optional) GCM Sender ID.
        senderID: Config.GCM_SENDER_ID,
        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
            alert: true,
            badge: true,
            sound: true
        },
        popInitialNotification: true,
        requestPermissions: true
    });
}

export function setupNotification(email) {
    if(Platform.OS === 'ios'){
        console.log('Push notification feature is not available in ios');
    }else{
        _configurePushNotification(email).then(() => {
            console.log('Push notification successfully configured');
        });
    }
}
