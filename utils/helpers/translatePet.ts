//translatePet.ts
import i18n from '../../app/services/i18n';

export function translateGender(gender: string) {
  const key = gender?.toLowerCase() || 'unknown';
  return i18n.t(`petDetail:gender.${key}`, { defaultValue: i18n.t('petDetail:gender.unknown') });
}

export function translateSize(size: string) {
  const key = size?.toLowerCase() || 'unknown';
  return i18n.t(`petDetail:size.${key}`, { defaultValue: i18n.t('petDetail:size.unknown') });
}

export function translateAge(age: string) {
  const key = age?.toLowerCase() || 'unknown';
  return i18n.t(`petDetail:age.${key}`, { defaultValue: i18n.t('petDetail:age.unknown') });
}

export function translateAttribute(attribute: string) {
  return i18n.t(`petDetail:attributes.${attribute}`, { defaultValue: attribute });
}

export function translateEnvironment(environment: string) {
  return i18n.t(`petDetail:environment.${environment}`, { defaultValue: environment });
}

export function translateBooleanAttribute(value: boolean | null, label: string) {
  return value ? label : null;
}
