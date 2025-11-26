import { geocodeAddress } from "@app/api/geocodeAdress";
import { getAccessToken } from "../../app/api/petfinder";
import type { Organization } from "@shares/models/organizations"; // si lo ponés en otro archivo

export async function fetchOrganizations(): Promise<Organization[]> {
    const token = await getAccessToken();
    const res = await fetch(
        `https://api.petfinder.com/v2/organizations?limit=100`,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) throw new Error("Error al obtener organizaciones");

    const data = await res.json();

    // 1. Filtrar organizaciones con dirección válida
    const orgs = (data.organizations || []).filter((org: { address: any; }) => {
        const a = org.address;
        return a && a.address1 && a.city && a.state && a.country;
    });

    // 2. Agregar coordenadas con geocoding
    for (const org of orgs) {
        const fullAddress = `${org.address.address1}, ${org.address.city}, ${org.address.state}, ${org.address.country}`;
        const geo = await geocodeAddress(fullAddress);

        if (geo) {
            org.latitude = geo.lat;
            org.longitude = geo.lng;
        }
    }

    // 3. Eliminar las organizaciones SIN coordenadas
    const orgsWithCoords = orgs.filter(
        (org: Organization) => org.latitude != null && org.longitude != null
    );

    // 4. Devolver solo las válidas
    return orgsWithCoords;

}