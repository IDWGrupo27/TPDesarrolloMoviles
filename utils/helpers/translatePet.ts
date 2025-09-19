
export function translateGender(gender: string) {
  switch (gender.toLowerCase()) {
    case 'male': return 'Macho';
    case 'female': return 'Hembra';
    default: return 'Desconocido';
  }
}

export function translateSize(size: string) {
  switch (size.toLowerCase()) {
    case 'small': return 'Pequeño';
    case 'medium': return 'Mediano';
    case 'large': return 'Grande';
    case 'xlarge': return 'Extra grande';
    default: return 'Desconocido';
  }
}

export function translateBooleanAttribute(value: boolean | null, label: string) {
  return value ? label : null;
}
