import { IUser } from '../shares/models/users';
import * as SecureStore from 'expo-secure-store';

const STORAGE_NAME = 'PETWAY_';

export const STORAGE_KEYS = {
    USER: 'user',
    JWT_TOKEN: 'jwtToken',
    JWT_REFRESH_TOKEN: 'jwtTokenRefresh',
    DEVICE_ID: 'deviceId'
}

const _setItem = (key: any, value: any, options?: any) =>
    SecureStore.setItemAsync(`${STORAGE_NAME}${key}`, value, options);
const _getItem = (key: any, options?: any) =>
    SecureStore.getItemAsync(`${STORAGE_NAME}${key}`, options);
const _deleteItem = (key: any, options?: any) =>
    SecureStore.deleteItemAsync(`${STORAGE_NAME}${key}`, options);

const setUser = (user: IUser) =>
    _setItem(STORAGE_KEYS.USER, JSON.stringify(user));

const getUser = async () => {
    const user = await _getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
}

const deleteUser = () =>
    _deleteItem(STORAGE_KEYS.USER);

export { setUser, getUser, deleteUser };