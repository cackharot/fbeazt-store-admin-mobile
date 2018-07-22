import { Platform } from 'react-native';
import Config from './appConfig';
import { PushNotificationService } from './services/pushNotificationService';

registerDevice = (email, tokenData, prevTokenData) => {
    const token = tokenData['token'];
    const prevToken = prevTokenData ? prevTokenData['token'] : null;
    if (token === prevToken) {
        return;
    }
    let service = new PushNotificationService();
    if(prevToken && prevToken.length > 0) {
        service.unregister(email, prevToken).catch((e)=>{
            console.log(`Failed to unregister device ${e}`);
        });
    }
    service.register(email, tokenData).catch((e)=>{
        console.log(`Failed to register device ${e}`);
    });
}

showLoginSuccess = (pn) => {
    return;
    showLocalNotification(pn, {
        title: 'Login success',
        message: 'You will be notified on new Orders'
    });
}

showLocalNotification = (pn, notification) => {
    pn.localNotification(Object.assign({
        id: 0,
        autoCancel: true,
        default: true,
        largeIcon: "ic_launcher",
        smallIcon: "ic_notification",
        bigText: notification.message,
        vibrate: true,
        vibration: 300,
        playSound: true,
        number: 1,
        collapse_key: null
    }, notification));
}

tryNavigateOnNotification = (notification) => {
    console.log('**********Navigating*********', notification.store_order_no, notification.store_order_id);
    if (notification.store_order_id && notification.store_order_id.length > 0) {
        const { store_order_no, store_order_id } = notification;
        let name = '#' + store_order_no + ' Details';
        // Actions.orderDetails({ title: name, store_order_id: store_order_id });
    }
}

_configurePushNotification = async (email) => {
    var PushNotification = require('react-native-push-notification');
    const DEVICE_TOKEN_KEY = "deviceTokenKey";
    console.log(`Configuring PUSH notification with GCM Sender ID: ${Config.GCM_SENDER_ID}`);
    PushNotification.configure({
        onRegister: function (tokenData) {
            console.log('GCM TOKEN:', tokenData);
            storage.load({key: DEVICE_TOKEN_KEY, autoSync: false, syncInBackground: false})
                .then((prevTokenData) => {
                    registerDevice(email, tokenData, prevTokenData);
                }).catch((e)=> {
                    console.log('Failed to load device token', e);
                    storage.save({key: DEVICE_TOKEN_KEY, data: tokenData, expires: null});
                    registerDevice(email, tokenData, null);
                });
            showLoginSuccess(PushNotification);
        },
        // (required) Called when a remote or local notification is opened or received
        onNotification: function (notification) {
            console.log('RECEIVED NOTIFICATION:', notification);
            if (notification.foreground === true && notification.userInteraction === false && notification['google.message_id']) {
                // that._showLocalNotification(notification);
                showLocalNotification(PushNotification, notification);
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
