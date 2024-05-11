const axios = require('axios');
const https = require('https');

// Configura el agente HTTPS para permitir certificados autofirmados
// En producción, deberías usar un certificado válido y quitar 'rejectUnauthorized: false'
const httpsAgent = new https.Agent({
  rejectUnauthorized: false // Solo para desarrollo con certificados autofirmados
});

// URL del servidor ESP32
const url = 'https://dirección-ip-del-esp32/';

// Función para hacer una petición GET
async function fetchData() {
  try {
    const response = await axios.get(url, { httpsAgent });
    console.log('Datos recibidos:', response.data);
  } catch (error) {
    console.error('Error al realizar la solicitud GET:', error);
  }
}

// Función para enviar datos con una petición POST
async function sendData(data) {
  try {
    const response = await axios.post(url, data, { httpsAgent });
    console.log('Respuesta del servidor:', response.data);
  } catch (error) {
    console.error('Error al realizar la solicitud POST:', error);
  }
}

// Ejemplo de uso de las funciones
fetchData();
sendData({ sensor: 'valor' });
