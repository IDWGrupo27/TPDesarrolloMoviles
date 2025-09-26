export interface IUser {
    id: number;
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
    descripcion?: string;
    pass: string;
    email: string;
}

export class User implements IUser {
    id: number;
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
    descripcion: string;
    email: string;
    pass: string;

    constructor(id: number, nombre: string, apellido: string, direccion: string, telefono: string, descripcion: string, email: string, pass: string) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.direccion = direccion;
        this.telefono = telefono;
        this.descripcion = descripcion ? descripcion : '';
        this.email = email;
        this.pass = pass;
    }
}