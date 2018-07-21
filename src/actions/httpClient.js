import { Platform } from 'react-native';
import Config from '../appConfig';
const axios = require('axios');

// const baseURL = Platform.OS === 'ios' ? 'http://localhost:4000/api' : 'http://10.0.3.2:4000/api';
const baseURL = Platform.OS === 'ios' ? Config.IOS_BASE_URL : Config.ANDROID_BASE_URL;

const AUTH_TOKEN = null;

export const httpClient = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {'X-Client': 'StoreAdminApp'}
});
