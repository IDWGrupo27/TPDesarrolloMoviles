import { getAccessToken } from "../../app/api/petfinder";

export interface Pet {
    id: number;
    name: string;
    photos: { medium: string }[];
    [key: string]: any;
}

export async function fetchPets(type: string, page = 1, limit = 20): Promise<Pet[]> {
    const token = await getAccessToken();
    const res = await fetch(
        `https://api.petfinder.com/v2/animals?type=${type}&limit=${limit}&page=${page}&sort=random`,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) throw new Error("Error al obtener mascotas");

    const data = await res.json();
    return (data.animals || []).filter((p: Pet) => p.photos && p.photos.length > 0);
}
