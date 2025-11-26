const GEOCODE_API_KEY = "";

export async function geocodeAddress(address: string) {
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
        )}&key=${GEOCODE_API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.results?.length) return null;

        return data.results[0].geometry.location; // { lat, lng }
    } catch (err) {
        console.error("Error geocodificando dirección:", err);
        return null;
    }
}