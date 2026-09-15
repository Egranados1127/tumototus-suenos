import { API_URL } from '@/lib/api';
// Configuración centralizada de la API
// En producción usa la variable de entorno NEXT_PUBLIC_API_URL
// En desarrollo local usa localhost:3001
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '${API_URL}';
