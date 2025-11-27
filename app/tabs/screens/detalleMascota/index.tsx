import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
  Platform,
  Pressable,
  Linking,
} from 'react-native';
import Header from '../../../../components/Header';
import { useRoute } from '@react-navigation/native';
import { Pet } from '../../../../utils/helpers/petfinderHelpers';
import { translateGender, translateSize } from '../../../../utils/helpers/translatePet';
import AspectRatioImage from '../../../../components/AspectRatioImage';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { sendNotification } from './notifications';
import { materialColors } from '../../../../utils/colors';
import { Ionicons } from '@expo/vector-icons';

type RouteParams = {
  pet: Pet;
};

export default function DetalleMascota() {
  const route = useRoute();
  const { pet } = route.params as RouteParams;
  const [modalVisible, setModalVisible] = useState(false);

  const [modalNotification, setModalNotification] = useState(false);
  const [timeNotification, setTimeNotification] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());


  // Limpiar descripción
  const description = pet.description
    ? pet.description.replace(/\n/g, ' ').trim()
    : 'No hay descripción disponible';

  // Chips de atributos/entorno
  const chips: Array<{ icon: any; label: string; tone?: 'success' | 'info' | 'secondary' | 'danger' | 'tertiary' }> = [];
  if (pet.attributes?.spayed_neutered) chips.push({ icon: 'checkmark-circle-outline', label: 'Castrado/a', tone: 'success' });
  if (pet.attributes?.house_trained) chips.push({ icon: 'home-outline', label: 'Entrenado/a', tone: 'tertiary' });
  if (pet.attributes?.shots_current) chips.push({ icon: 'shield-checkmark-outline', label: 'Vacunas al día', tone: 'info' });
  if (pet.attributes?.special_needs) chips.push({ icon: 'alert-circle-outline', label: 'Necesidades especiales', tone: 'danger' });
  if (pet.environment?.children) chips.push({ icon: 'people-outline', label: 'Con niños', tone: 'secondary' });
  if (pet.environment?.dogs) chips.push({ icon: 'paw-outline', label: 'Con perros', tone: 'secondary' });
  if (pet.environment?.cats) chips.push({ icon: 'paw-outline', label: 'Con gatos', tone: 'secondary' });

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
      setShowDatePicker(false);
      setShowTimePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };

  const onChangeTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      setTime(selectedDate);
      setShowTimePicker(false);
      const finalDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        selectedDate.getHours(),
        selectedDate.getMinutes()
      );
      setTimeNotification(finalDate);
      setModalNotification(true);
    } else {
      setShowTimePicker(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            contentContainerStyle={{ paddingHorizontal: 8 }}
          />
        )}

        {/* Datos básicos en tarjeta */}
        <View style={styles.card}>
          <Text style={styles.nombre}>{pet.name}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="pricetag-outline" size={16} color={materialColors.schemes.light.onSurfaceVariant} />
              <Text style={styles.metaText}>{pet.breeds?.primary || 'Desconocida'} {pet.breeds?.mixed ? '(Mestizo)' : ''}</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="time-outline" size={16} color={materialColors.schemes.light.onSurfaceVariant} />
              <Text style={styles.metaText}>{pet.age || 'Edad desconocida'}</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            {pet.gender && (
              <View style={styles.metaChip}>
                <Ionicons name="male-female-outline" size={16} color={materialColors.schemes.light.onSurfaceVariant} />
                <Text style={styles.metaText}>Sexo: {translateGender(pet.gender)}</Text>
              </View>
            )}
            {pet.size && (
              <View style={styles.metaChip}>
                <Ionicons name="expand-outline" size={16} color={materialColors.schemes.light.onSurfaceVariant} />
                <Text style={styles.metaText}>Tamaño: {translateSize(pet.size)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Chips en tarjeta */}
        {chips.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Características</Text>
            <View style={styles.chipsRow}>
              {chips.map((c, idx) => {
                const scheme = materialColors.schemes.light;
                let bg = scheme.primaryContainer;
                let fg = scheme.onPrimaryContainer;
                if (c.tone === 'success') { bg = scheme.secondaryContainer; fg = scheme.onSecondaryContainer; }
                else if (c.tone === 'secondary') { bg = scheme.tertiaryFixedDim; fg = scheme.onTertiaryFixed; }
                else if (c.tone === 'danger') { bg = scheme.errorContainer; fg = scheme.onErrorContainer; }
                else if (c.tone === 'tertiary') { bg = scheme.tertiaryContainer; fg = scheme.onTertiaryContainer; }
                else if (c.tone === 'info') { bg = scheme.primaryContainer; fg = scheme.onPrimaryContainer; }
                return (
                  <View key={idx} style={[styles.chipFilled, { backgroundColor: bg }] }>
                    <Ionicons name={c.icon} size={16} color={fg} />
                    <Text style={[styles.chipFilledText, { color: fg }]}>{c.label}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {/* Descripción en tarjeta */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descripcion}>{description}</Text>
        </View>

        {/* Acciones */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.outlineButton, { flex: 1 }]} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.outlineButtonText}>Recordarme</Text>
          </TouchableOpacity>
          <View style={{ width: 12 }} />
          <TouchableOpacity style={[styles.primaryButton, { flex: 1 }]} onPress={() => setModalVisible(true)}>
            <Text style={styles.primaryButtonText}>Contactar</Text>
          </TouchableOpacity>
        </View>

        {/* Modal Contacto (rediseñado) */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Contacto del Refugio</Text>
                <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={22} color={materialColors.schemes.light.onSurface} />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Acciones rápidas */}
                {pet.contact?.email && (
                  <TouchableOpacity
                    style={styles.actionButtonPrimary}
                    onPress={() => Linking.openURL(`mailto:${pet.contact?.email}`)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="mail-outline" size={20} color={materialColors.schemes.light.onPrimary} />
                    <Text style={styles.actionButtonPrimaryText}>Enviar Email</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.actionsRowWrap}>
                  {pet.contact?.phone && (
                    <TouchableOpacity
                      style={[styles.actionButtonOutline, { flex: 1 }]}
                      onPress={() => Linking.openURL(`tel:${pet.contact?.phone}`)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="call-outline" size={20} color={materialColors.schemes.light.primary} />
                      <Text style={styles.actionButtonOutlineText}>Llamar</Text>
                    </TouchableOpacity>
                  )}
                  {(pet.contact?.address?.city || pet.contact?.address?.state || pet.contact?.address?.address1) && (
                    <TouchableOpacity
                      style={[styles.actionButtonOutline, { flex: 1, marginLeft: pet.contact?.phone ? 10 : 0 }]}
                      onPress={() => {
                        const addr = `${pet.contact?.address?.address1 || ''} ${pet.contact?.address?.city || ''} ${pet.contact?.address?.state || ''}`.trim();
                        const q = encodeURIComponent(addr);
                        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="location-outline" size={20} color={materialColors.schemes.light.primary} />
                      <Text style={styles.actionButtonOutlineText}>Ver en mapa</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.divider} />

                {/* Detalles */}
                {pet.contact?.email && (
                  <View style={styles.contactRow}>
                    <Ionicons name="mail-outline" size={18} color={materialColors.schemes.light.primary} />
                    <Text style={styles.contactText}>{pet.contact.email}</Text>
                  </View>
                )}
                {pet.contact?.phone && (
                  <View style={styles.contactRow}>
                    <Ionicons name="call-outline" size={18} color={materialColors.schemes.light.primary} />
                    <Text style={styles.contactText}>{pet.contact.phone}</Text>
                  </View>
                )}
                {(pet.contact?.address?.address1 || pet.contact?.address?.city || pet.contact?.address?.state) && (
                  <View style={styles.contactRow}>
                    <Ionicons name="location-outline" size={18} color={materialColors.schemes.light.primary} />
                    <Text style={styles.contactText}>
                      {pet.contact?.address?.address1 || ''} {pet.contact?.address?.city ? `• ${pet.contact.address.city}` : ''} {pet.contact?.address?.state ? `• ${pet.contact.address.state}` : ''}
                    </Text>
                  </View>
                )}

                <TouchableOpacity style={[styles.primaryButton, { marginTop: 18 }]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.primaryButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            locale='es-AR'
            onChange={onChangeDate}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            locale='es-AR'
            onChange={onChangeTime}
          />
        )}

        {/* Modal Notificacion */}
        <Modal visible={modalNotification} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={[styles.primaryButton, { alignSelf: 'center', marginTop: 15 }]}
                onPress={async () => {
                  setModalNotification(false)
                  await sendNotification(timeNotification, {id: pet.id, name: pet.name, photos: pet.photos}, {edad: pet.age, genero: translateGender(pet.gender), tamaño: translateSize(pet.size)})
                }}
              >
                <Text style={styles.primaryButtonText}>Recordarme</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { alignSelf: 'center' }]} > {timeNotification.toLocaleString()} </Text>
              <TouchableOpacity
                onPress={() => setModalNotification(false)}
                style={{ alignSelf: 'center', marginTop: 20, backgroundColor: '#eeeeee', borderRadius: 20 }}>

                <Text style={{ fontSize: 20,  padding: 10 }}>Cancelar</Text>

              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView >

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 12,
    backgroundColor: '#fff',
    alignItems: 'stretch',
  },
  card: {
    backgroundColor: materialColors.schemes.light.surface,
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  imageWrapper: {
    width: 300,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginRight: 15,
  },
  nombre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: materialColors.schemes.light.primary,
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: materialColors.schemes.light.surfaceVariant,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 13,
    color: materialColors.schemes.light.onSurface,
  },
  attributesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 8,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: materialColors.schemes.light.onSurface,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipFilled: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipFilledText: {
    fontSize: 13,
    fontWeight: '600',
  },
  attribute: {
    backgroundColor: materialColors.schemes.light.surfaceVariant,
    color: materialColors.schemes.light.onSurface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 13,
    margin: 3,
  },
  descripcion: {
    fontSize: 16,
    marginVertical: 12,
    textAlign: 'center',
    color: materialColors.schemes.light.onSurface,
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: materialColors.schemes.light.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: materialColors.schemes.light.onPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: materialColors.schemes.light.primary,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: materialColors.schemes.light.primary,
    fontWeight: '700',
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
    width: '92%',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalClose: {
    padding: 6,
    marginLeft: 8,
  },
  modalBody: {
    paddingTop: 12,
  },
  actionButtonPrimary: {
    backgroundColor: materialColors.schemes.light.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPrimaryText: {
    color: materialColors.schemes.light.onPrimary,
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  actionsRowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  actionButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: materialColors.schemes.light.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonOutlineText: {
    color: materialColors.schemes.light.primary,
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: materialColors.schemes.light.outlineVariant,
    marginVertical: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: materialColors.schemes.light.onSurface,
    flex: 1,
    flexWrap: 'wrap',
    lineHeight: 20,
    marginLeft: 8,
  },
});
