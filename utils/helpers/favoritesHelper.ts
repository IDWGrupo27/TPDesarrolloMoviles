// favoritesHelper.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from './petfinderHelpers';

const FAVORITES_KEY = '@PETWAY_FAVORITES';

export async function getFavorites(): Promise<Pet[]> {
    try {
        const data = await AsyncStorage.getItem(FAVORITES_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
}

export async function addFavorite(pet: Pet): Promise<void> {
    try {
        const favorites = await getFavorites();
        const exists = favorites.some(p => p.id === pet.id);
        if (!exists) {
            favorites.push(pet);
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        }
    } catch (error) {
        console.error('Error adding favorite:', error);
    }
}

export async function removeFavorite(petId: number): Promise<void> {
    try {
        const favorites = await getFavorites();
        const filtered = favorites.filter(p => p.id !== petId);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Error removing favorite:', error);
    }
}

export async function isFavorite(petId: number): Promise<boolean> {
    try {
        const favorites = await getFavorites();
        return favorites.some(p => p.id === petId);
    } catch (error) {
        console.error('Error checking favorite:', error);
        return false;
    }
}

export async function toggleFavorite(pet: Pet): Promise<boolean> {
    try {
        const isFav = await isFavorite(pet.id);
        if (isFav) {
            await removeFavorite(pet.id);
            return false;
        } else {
            await addFavorite(pet);
            return true;
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        return false;
    }
}
