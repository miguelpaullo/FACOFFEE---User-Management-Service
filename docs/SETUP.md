# FACOFFEE - Setup Atual do Projeto

## Infraestrutura

A infraestrutura local está funcionando através do Docker Compose.

## Pré-requisitos

* Node.js 22+
* Git
* NPM

### Serviços disponíveis

| Serviço             | Porta |
| ------------------- | ----- |
| Keycloak            | 8080  |
| RabbitMQ Management | 15672 |
| RabbitMQ AMQP       | 5672  |
| Mailpit             | 8025  |
| SMTP Mailpit        | 1025  |
| API Gateway         | 18000 |
| Users Service       | 3001  |

---

## Inicialização

---

## Keycloak

### URL

```text
http://localhost:8080
```

### Realm

```text
facoffee
```

### Usuário de teste

```text
Email: facoffee@facom.ufms.br
Senha: facoffee
```

### Clients

```text
facoffee-public
facoffee-private
```

---

## RabbitMQ

### URL

```text
http://localhost:15672
```

### Credenciais

```text
Usuário: facoffee
Senha: facoffee
```

### Exchange

```text
domain.events
```

### Filas existentes

```text
participation.user-deactivated
notification.finance-pendency-created
reporting.finance-pendency-created
```

---

## API Gateway

### URL

```text
http://localhost:18000
```

### Rotas mapeadas

```text
/api/users
/api/participation
/api/finance
```

### Observação

O Gateway está operacional.

O Keycloak deve ser acessado internamente pelo gateway com o cabeçalho `Host: localhost:8080`, para que o issuer do token (`http://localhost:8080/realms/facoffee`) coincida com o host do request interno.

Além disso, o endpoint `/userinfo` exige um token com o escopo `openid`.

---

## Mailpit

### URL

```text
http://localhost:8025
```

Utilizado para captura de e-mails em ambiente local.

---

## Users Service

### Inicialização

```bash
npm install
```

### Configurar variáveis de ambiente

Criar um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="file:./dev.db"
```

### Instalar e configurar Prisma

Caso ainda não esteja instalado:

```bash
npm install prisma@6 @prisma/client@6
```

Validar o schema:

```bash
npx prisma validate
```

Gerar o cliente Prisma:

```bash
npx prisma generate
```

---

### Criar banco SQLite

Executar a migration:

```bash
npx prisma migrate dev --name init
```

Ao final será criado:

```text
prisma/dev.db
```

Banco SQLite utilizado pelo serviço.

---

### Abrir Prisma Studio

Para visualizar e editar os dados do banco:

```bash
npx prisma studio
```

A interface ficará disponível em:

```text
http://localhost:5555
```

Tabelas disponíveis:

* User
* UserRole

Funcionalidades:

* Visualizar usuários
* Visualizar papéis dos usuários
* Editar registros manualmente
* Verificar Soft Delete
* Validar persistência dos dados

---

### Subir infraestrutura Docker

No diretório ../../FACOFFEE---User-Management-Service/facoffee-docs-guia

```bash
docker compose up -d
```

Verificar containers:

```bash
docker ps
```

### Rodar a aplicação

```bash
npm run dev
```

### URL

```text
http://localhost:3001
```

### Endpoints implementados

```http
POST   /users
GET    /users
GET    /users/:userId
PATCH  /users/:userId
DELETE /users/:userId
PUT    /users/:userId/roles
```

## Evento UserDeactivated

### Fluxo

```text
DELETE /users/:userId
        ↓
UserService.delete()
        ↓
UserDeactivatedPublisher.publish()
        ↓
RabbitMQ
```

### Exchange

```text
domain.events
```

### Routing Key

```text
users.deactivated
```

### Status

Evento implementado e testado com sucesso.
