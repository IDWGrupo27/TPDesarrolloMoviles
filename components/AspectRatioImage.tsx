
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface AspectRatioImageProps {
  uri: string;
  style?: object;
}

export default function AspectRatioImage({ uri, style }: AspectRatioImageProps) {
  const [ratio, setRatio] = useState(1.5);

  useEffect(() => {
    Image.getSize(
      uri,
      (width, height) => setRatio(width / height),
      (err) => console.warn('No se pudo obtener tamaño de imagen:', err)
    );
  }, [uri]);

  return (
    <View style={[styles.container, { aspectRatio: ratio }, style]}>
      <Image source={{ uri }} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
