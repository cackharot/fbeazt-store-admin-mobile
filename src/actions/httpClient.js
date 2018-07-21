import { Platform } from 'react-native';
const axios = require('axios');

const baseURL = Platform.OS === 'ios' ? 'http://localhost:4000/api' : 'http://10.0.3.2:4000/api';

const AUTH_TOKEN = null;

export const httpClient = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {'X-Client': 'StoreAdminApp'}
});
