import { KeycloakService } from './services/KeycloakService';
import 'dotenv/config';

async function main() {

    console.log('URL=', process.env.KEYCLOAK_URL);
    console.log('REALM=', process.env.KEYCLOAK_REALM);
    console.log('CLIENT=', process.env.KEYCLOAK_CLIENT_ID);

  const service = new KeycloakService();

  const id = await service.createUser(
    'Teste Keycloak',
    `teste-${Date.now()}@email.com`
  );

  console.log('USER ID:', id);
}

main();