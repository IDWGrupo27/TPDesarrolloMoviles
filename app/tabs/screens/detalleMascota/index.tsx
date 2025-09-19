import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Header from '../../../../components/Header';
import { useRoute } from '@react-navigation/native';
import { Pet } from '../../../../utils/helpers/petfinderHelpers';
import { translateGender, translateSize } from '../../../../utils/helpers/translatePet';
import AspectRatioImage from '../../../../components/AspectRatioImage';

type RouteParams = {
  pet: Pet;
};

export default function DetalleMascota() {
  const route = useRoute();
  const { pet } = route.params as RouteParams;
  const [modalVisible, setModalVisible] = useState(false);

  // Limpiar descripción
  const description = pet.description
    ? pet.description.replace(/\n/g, ' ').trim()
    : 'No hay descripción disponible';

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Carrusel de fotos */}
        {pet.photos && pet.photos.length > 0 && (
          <FlatList
            data={pet.photos}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <AspectRatioImage uri={item.medium} style={styles.imageWrapper} />
            )}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
        )}

        {/* Datos básicos */}
        <Text style={styles.nombre}>{pet.name}</Text>
        <Text style={styles.razaEdad}>
          {pet.breeds?.primary || 'Desconocida'} {pet.breeds?.mixed ? '(Mestizo)' : ''} •{' '}
          {pet.age || 'Edad desconocida'}
        </Text>
        {pet.gender && <Text style={styles.razaEdad}>Sexo: {translateGender(pet.gender)}</Text>}
        {pet.size && <Text style={styles.razaEdad}>Tamaño: {translateSize(pet.size)}</Text>}

        {/* Atributos */}
        <View style={styles.attributesContainer}>
          {pet.attributes?.spayed_neutered && <Text style={styles.attribute}>Castrado/a</Text>}
          {pet.attributes?.house_trained && <Text style={styles.attribute}>Entrenado/a</Text>}
          {pet.attributes?.shots_current && <Text style={styles.attribute}>Vacunas al día</Text>}
          {pet.attributes?.special_needs && (
            <Text style={[styles.attribute, { color: 'red' }]}>Necesidades especiales</Text>
          )}
        </View>

        {/* Compatibilidad */}
        <View style={styles.attributesContainer}>
          {pet.environment?.children && <Text style={styles.attribute}>Compatible con niños</Text>}
          {pet.environment?.dogs && <Text style={styles.attribute}>Compatible con perros</Text>}
          {pet.environment?.cats && <Text style={styles.attribute}>Compatible con gatos</Text>}
        </View>

        {/* Descripción */}
        <Text style={styles.descripcion}>{description}</Text>

        {/* Botón de contacto */}
        <TouchableOpacity style={styles.contactButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.contactButtonText}>Contacto</Text>
        </TouchableOpacity>

        {/* Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Información del refugio</Text>
              {pet.contact?.email && <Text>Email: {pet.contact.email}</Text>}
              {pet.contact?.phone && <Text>Teléfono: {pet.contact.phone}</Text>}
              {pet.contact?.address?.address1 && (
                <Text>Dirección: {pet.contact.address.address1}</Text>
              )}
              {pet.contact?.address?.city && <Text>Ciudad: {pet.contact.address.city}</Text>}
              {pet.contact?.address?.state && <Text>Provincia: {pet.contact.address.state}</Text>}

              <TouchableOpacity
                style={[styles.contactButton, { alignSelf: 'center', marginTop: 15 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.contactButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 300,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginRight: 15,
  },
  nombre: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  razaEdad: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
    textAlign: 'center',
  },
  attributesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 10,
  },
  attribute: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 14,
    margin: 3,
  },
  descripcion: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: 'center',
  },
  contactButton: {
    backgroundColor: '#5e2b83',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 30,
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
