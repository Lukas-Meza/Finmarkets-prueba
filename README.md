## Prueba técnica - React & Vue

### Instalación y Ejecución

#### 1. Instalar dependencias

```bash
# Servidor
cd server
npm install

# React-Chat
cd ../react-chat
npm install

# Vue-Chat
cd ../vue-chat
npm install
```

#### 2. Ejecutar el proyecto

```bash
# Servidor
cd server
node server.js
# Escucha en puerto 3001

# React
cd react-chat
npm run dev
# Accede a http://localhost:5173
La aplicación se sirve (por defecto) en `http://localhost:5173`.

# Vue
cd vue-chat
npm run dev
# Accede a http://localhost:5174
La aplicación se sirve en `http://localhost:5174` (configurado en `vite.config.ts`).
```
#### Resumen

Para ambos clientes se definieron 3 componentes principales encargados de mostrar e interactuar con el chat.  
El usuario debe ingresar un nombre para ser identificado antes de poder enviar mensajes.

#### Arquitectura

**Flujo de Comunicación**

Cliente (React/Vue)  
&nbsp;&nbsp;&nbsp;&nbsp;↓  
Socket.IO Client  
&nbsp;&nbsp;&nbsp;&nbsp;↓  
Server Express + Socket.IO (puerto 3001)  
&nbsp;&nbsp;&nbsp;&nbsp;↓  
Broadcast a todos los clientes  
&nbsp;&nbsp;&nbsp;&nbsp;↓  
Actualiza estado y renderiza

El servidor captura cada mensaje y lo emite nuevamente a todos los clientes activos.  
Cuando cada cliente recibe el evento, actualiza su estado interno y vuelve a pintar la interfaz para reflejar el nuevo mensaje en el chat en tiempo real.

### Funcionalidades implementadas

- **Conexión al servidor Socket.io** con indicador visual.
- **Enviar mensajes** con nombre de usuario configurable.
- **Recibir mensajes en tiempo real** entre varias pestañas / navegadores.
- **Historial de mensajes en sesión** con scroll automático al último mensaje.
- **Indicador de conexión** (conectado / conectando / desconectado).
- **Bonus**:
  - TypeScript en ambas apps.
  - Reconexión automática de Socket.io.
  - Scroll automático del chat.
  - Persistencia básica en `localStorage`.
  - Avatar basado en iniciales del usuario.

