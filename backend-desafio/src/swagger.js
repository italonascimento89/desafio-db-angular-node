import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Votação API',
      version: '1.0.0',
      description: 'API para votação de enquetes',
    },
  },
  apis: ['./src/**/*.js'], // pega todos os arquivos JS dentro de src
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
