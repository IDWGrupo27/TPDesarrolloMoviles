export interface Organization {
    id: string;
    name: string;
    address: {
        address1: string | null;
        address2: string | null;
        city: string | null;
        state: string | null;
        postcode: string | null;
        country: string | null;
    };
    photos?: { medium: string }[];
    social_media?: Record<string, string | null>;
    [key: string]: any;
}