# PetWay 🐾

## Idea detrás del nombre
Representa "el camino hacia tu mascota", reflejando la función principal de la aplicación: ayudar a los usuarios a encontrar y conectar con mascotas disponibles para adopción.

## Descripción general
PetWay permite a los usuarios explorar animales disponibles para adopción y buscar refugios mediante filtros por tipo de mascota, raza, edad, tamaño y ubicación. Utiliza la geolocalización del dispositivo para mostrar mascotas y refugios cercanos. La aplicación se conecta a la API pública de Petfinder, que proporciona información actualizada sobre mascotas y organizaciones de adopción.

## Objetivo general del proyecto
Facilitar la búsqueda y adopción de mascotas mediante una aplicación móvil que conecta usuarios con animales disponibles en refugios, combinando filtros, geolocalización y datos en tiempo real de la API Petfinder.

## Objetivos específicos

- Permitir a los usuarios buscar y filtrar mascotas disponibles para adopción según tipo, raza, edad, tamaño y ubicación
- Mostrar información detallada de cada mascota, incluyendo fotos y datos de contacto del refugio
- Integrar geolocalización para filtrar mascotas y refugios cercanos al usuario
- Usar la cámara del dispositivo para que el usuario pueda crear un perfil con foto dentro de la app
- Contar con un sistema básico de autenticación local para personalizar la experiencia
- Incorporar funcionalidades extra, como listado de refugios, filtros avanzados o búsqueda por nombre

## Requerimientos mínimos cubiertos en PetWay

### Comunicación con una API
Se conecta a la API de Petfinder para mostrar mascotas y refugios disponibles.

### Autenticación
Los usuarios pueden registrarse e iniciar sesión para personalizar su experiencia.

### Mínimo de 4 pantallas
- Login
- <img width="235" height="500" alt="login" src="https://github.com/user-attachments/assets/f847b394-d59f-4329-8852-5966b23607f0" />

- Registro
- ![registro](https://github.com/user-attachments/assets/b39ddb21-38b8-46a1-90bb-b20c655a0e10)

- Pantalla de inicio
- ![home](https://github.com/user-attachments/assets/6cfee41f-01d6-49fa-bcda-85020c0d22cd)

- Nosotros
- ![nosotros](https://github.com/user-attachments/assets/c6ad6952-9b0d-42a7-ae30-86e348f7834d)

- Perfil
- ![perfil](https://github.com/user-attachments/assets/a79ef4d9-f1cb-4da0-9b3d-3f7a58aaa61b)

### Mapas y geolocalización
Muestra mascotas y refugios cercanos según la ubicación del usuario.

### Guardar y leer desde el sistema de archivos / Cámara
La app permite al usuario tomar una foto de perfil usando la cámara del dispositivo y almacenarla localmente para personalizar su cuenta.

### Notificaciones locales
Recordatorios de explorar mascotas o refugios cercanos al abrir la app.

### Funcionalidad extra
Búsqueda por filtros avanzados, scroll infinito y perfiles de refugios.

## API utilizada

**Petfinder API** - [Petfinder's Free API for Developers](https://www.petfinder.com/developers/)

### Características técnicas
- **Tipo**: Pública, RESTful, solo lectura de datos
- **Autenticación**: OAuth2 con client_id y client_secret
- **Formato de respuesta**: JSON
- **Limitaciones**: Datos centrados en EE. UU. y Canadá, solo lectura

### Funciones principales
- Obtener lista de animales adoptables con filtros
- Obtener detalle de cada animal (fotos, descripción, contacto)
- Obtener lista de refugios y organizaciones

---


*Desarrollado para conectar mascotas con familias amorosas* ❤️
