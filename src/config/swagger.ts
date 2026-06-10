import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load(
  './docs/users-service.yaml'
);

export { swaggerUi, swaggerDocument };