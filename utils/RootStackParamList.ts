import { Pet } from './helpers/petfinderHelpers';
import { Organization } from '@shares/models/organizations';

export type RootStackParamList = {
  TABS: undefined;
  AUTH: undefined;
  DetalleMascota: { pet: Pet };
  NewPassword: undefined;
  Refugios: undefined;
  DetalleRefugio: { org: Organization };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  NewPassword: undefined;
};
