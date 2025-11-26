import React from "react";
import MapView, { MAP_TYPES, Marker } from "react-native-maps";
import { Organization } from "@shares/models/organizations";
import { StyleSheet, Text, View } from 'react-native'

interface MapProps {
  organizations: Organization[];
  onSelect: (org: Organization) => void;
}

export default function Map({ organizations, onSelect }: MapProps) {

  const validOrgs = organizations.filter(
    (org) => org.latitude != null && org.longitude != null
  );

  if (validOrgs.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No se encontraron refugios con ubicación.</Text> ;
      </View>
    );
  }

  const first = validOrgs[0];

  return (
    <MapView
      style={styles.map}
      mapType={MAP_TYPES.STANDARD}
      initialRegion={{
        latitude: first.latitude,
        longitude: first.longitude,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      }}
    >
      {validOrgs.map((org) => (
        <Marker
          key={org.id}
          coordinate={{
            latitude: org.latitude!,
            longitude: org.longitude!
          }}
          title={org.name}
          description={org.address.city!}
          onPress={() => onSelect(org)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})