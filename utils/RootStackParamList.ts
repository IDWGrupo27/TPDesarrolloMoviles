import { Pet } from './helpers/petfinderHelpers'; // ajustá el path

export type RootStackParamList = {
    TABS: undefined;
    AUTH: undefined;
    DetalleMascota: { pet: Pet }; 
};
