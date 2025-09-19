import { Pet } from './helpers/petfinderHelpers'; 

export type RootStackParamList = {
    TABS: undefined;
    AUTH: undefined;
    DetalleMascota: { pet: Pet }; 
};
