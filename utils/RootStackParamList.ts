import { Pet } from './helpers/petfinderHelpers'; 

export type RootStackParamList = {
  TABS: undefined;
  AUTH: undefined;
  DetalleMascota: { pet: Pet }; 
  NewPassword: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  NewPassword: undefined;
};
