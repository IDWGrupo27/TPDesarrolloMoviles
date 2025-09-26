export interface IUser {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
}

export class User implements IUser {
    id: number;
    nombre: string;
    apellido: string;
    email: string;

    constructor(id: number, nombre: string, apellido: string, email: string) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
    }
}