// environments/environment.ts (desarrollo)
export const environment = {
  production: false,
  apiUrl: '/api', // Usando proxy local
};

// environments/environment.prod.ts (producción)
export const environmentProd = {
  production: true,
  apiUrl: 'https://tudominio.com/api', // Cambiar según el URL de producción
};
