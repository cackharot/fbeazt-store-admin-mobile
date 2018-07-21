import { httpClient } from '../actions/httpClient';

export class PushNotificationService {
  register(email, deviceTokenData) {
    console.log(`Registering device with app server, email: ${email}`);
    return httpClient.post('/push_service/register',
      {
          email: email,
          device_token: deviceTokenData
      })
      .then((response) => response.data);
  }

  unregister(email, deviceToken) {
    console.log('unregistering device with app server');
    return httpClient.post('/push_service/unregister',
      {
          email: email,
          device_token: deviceToken
      })
      .then((response) => response.data);
  }
}
