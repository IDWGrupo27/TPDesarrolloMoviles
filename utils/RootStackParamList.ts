import { Pet } from './helpers/petfinderHelpers'; 

export type RootStackParamList = {
    TABS: undefined;
    AUTH: undefined;
    DetalleMascota: { pet: Pet }; 
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  NewPassword: undefined;
};