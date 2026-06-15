export class KeycloakService {
  private readonly baseUrl = process.env.KEYCLOAK_URL!;
  private readonly realm = process.env.KEYCLOAK_REALM!;
  private readonly clientId = process.env.KEYCLOAK_CLIENT_ID!;
  private readonly clientSecret = process.env.KEYCLOAK_CLIENT_SECRET!;

  private async getAdminToken(): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      }
    );

    const data = await response.json();

    return data.access_token;
  }

  async createUser(name: string, email: string,): Promise<string> {

    const token = await this.getAdminToken();

    const response = await fetch(
      `${this.baseUrl}/admin/realms/${this.realm}/users`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          email,
          enabled: true,
          firstName: name,
          emailVerified: true,
        }),
      }
    );

    if (!response.ok) {

        const body = await response.text();

        console.log('STATUS:', response.status);
        console.log('BODY:', body);

        throw new Error(`Erro Keycloak ${response.status}`);
}

    const location = response.headers.get('location');

    return location!.split('/').pop()!;
  }

  private async getRole(roleName: string) {

    const token = await this.getAdminToken();

    const response = await fetch(
      `${this.baseUrl}/admin/realms/${this.realm}/roles/${roleName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Role ${roleName} não encontrada`);
    }

    return response.json();
  }


  async updateRoles(keycloakId: string, roles: string[],): Promise<void> {

    const token = await this.getAdminToken();

    const keycloakRoles = await Promise.all(
      roles.map(role => this.getRole(role)),
    );

    const response = await fetch(
      `${this.baseUrl}/admin/realms/${this.realm}/users/${keycloakId}/role-mappings/realm`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(keycloakRoles),
      },
    );

    if (!response.ok) {

      const body = await response.text();

      console.log('STATUS:', response.status);
      console.log('BODY:', body);

      throw new Error('Erro ao atualizar roles no Keycloak');
    }
  }

}