const CLIENT_ID = "oXnSBS4BNlgduAVkvATsnLIJGNtqQhXlQ9kNASHOa4VrwvJxtF";
const CLIENT_SECRET = "nau6zzmLez6BALCAv2B2JDKnZwaGiW6sEeZTMQp8";

export async function getAccessToken(): Promise<string> {
    const response = await fetch("https://api.petfinder.com/v2/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    });

    if (!response.ok) throw new Error("No se pudo obtener token");

    const data = await response.json();
    return data.access_token;
}
