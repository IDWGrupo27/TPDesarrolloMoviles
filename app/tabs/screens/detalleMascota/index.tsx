import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Button } from 'react-native';
import Header from '../../../../components/Header';
import { useRoute } from '@react-navigation/native';
import { Pet } from '../../../../utils/helpers/petfinderHelpers';

type RouteParams = {
  pet: Pet;
};

export default function DetalleMascota() {
  const route = useRoute();
  const { pet } = route.params as RouteParams;

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        {pet.photos && pet.photos[0] && (
          <Image source={{ uri: pet.photos[0].medium }} style={styles.foto} />
        )}
        <Text style={styles.nombre}>{pet.name}</Text>
        <Text style={styles.razaEdad}>
          {pet.breeds?.primary || 'Desconocida'} • {pet.age || 'Edad desconocida'}
        </Text>
        {pet.gender && <Text style={styles.razaEdad}>Sexo: {pet.gender}</Text>}
        {pet.size && <Text style={styles.razaEdad}>Tamaño: {pet.size}</Text>}
        {pet.contact?.email && (
          <Text style={styles.contact}>Email refugio: {pet.contact.email}</Text>
        )}
        {pet.contact?.phone && (
          <Text style={styles.contact}>Teléfono refugio: {pet.contact.phone}</Text>
        )}
        {pet.description && <Text style={styles.descripcion}>{pet.description}</Text>}

        <Button title="Adoptar" onPress={() => alert('Función mock: adoptar')} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  foto: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  razaEdad: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  contact: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
});
