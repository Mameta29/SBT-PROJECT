import axios from 'axios';
const pinataJWT = import.meta.env.VITE_PINATA_JWT;

export const pinataClient = axios.create({
  baseURL: 'https://api.pinata.cloud',
  headers: {
    Authorization: `Bearer ${pinataJWT}`,
  },
});