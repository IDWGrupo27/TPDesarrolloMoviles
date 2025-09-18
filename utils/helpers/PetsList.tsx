import { useState, useEffect, useRef } from "react";
import { FlatList } from "react-native";
import { Pet, fetchPets } from "../helpers/petfinderHelpers";
import PetCard from "../../components/PetCard";

export default function PetsList({ type }: { type: string }) {
    const [pets, setPets] = useState<Pet[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loading = useRef(false);
    const seenIds = useRef<Set<number>>(new Set());

    const loadPets = async (nextPage = 1) => {
        if (loading.current || !hasMore) return;
        loading.current = true;

        try {
            const fetched = await fetchPets(type, nextPage, 20);
            const newPets = fetched.filter(p => !seenIds.current.has(p.id));
            newPets.forEach(p => seenIds.current.add(p.id));

            setPets(prev => [...prev, ...newPets]);

            // Si no hay más mascotas en la página, queda hasMore = false
            setHasMore(fetched.length > 0);
        } catch (err) {
            console.error("Error cargando mascotas:", err);
        } finally {
            loading.current = false;
        }
    };

    // Reset cuando cambia tipo
    useEffect(() => {
        seenIds.current.clear();
        setPets([]);
        setPage(1);
        setHasMore(true);
        loadPets(1); 
    }, [type]);

    // Scroll infinito
    const handleEndReached = () => {
        if (!loading.current && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadPets(nextPage); 
        }
    };

    return (
        <FlatList
            data={pets}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <PetCard pet={item} />}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.2} 
        />
    );
}
