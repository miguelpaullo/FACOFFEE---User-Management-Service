# Status Atual do Projeto

## Baseline 2 - Persistência e Regras de Negócio Básicas

### Funcionalidades Implementadas

#### Persistência

* [x] Configuração do Prisma ORM
* [x] Banco SQLite
* [x] Migration inicial
* [x] Prisma Studio
* [x] Repository Pattern

#### Endpoints

* [x] POST /users
* [x] GET /users
* [x] GET /users/{userId}
* [x] PATCH /users/{userId}
* [x] DELETE /users/{userId}
* [x] PUT /users/{userId}/roles

#### Regras de Negócio Implementadas

* [x] Usuário inicia com status ACTIVE
* [x] Usuário recebe role padrão PARTICIPANT quando nenhuma role é informada
* [x] Atualização de dados do usuário
* [x] Atualização de papéis (roles)
* [x] Soft Delete de usuários
* [x] Registro de data de desativação

#### Eventos

* [x] Publicação do evento UserDeactivated
* [x] Integração com RabbitMQ
* [x] Exchange domain.events

#### Infraestrutura

* [x] Docker Compose
* [x] API Gateway
* [x] Keycloak
* [x] RabbitMQ
* [x] Mailpit

---

# Setup do Ambiente

## Instalar Dependências

```bash
npm install
```

---

## Variáveis de Ambiente

Criar o arquivo `.env`

```env
DATABASE_URL="file:./dev.db"
```

---

## Prisma

Gerar o cliente Prisma:

```bash
npx prisma generate
```

Executar migrations:

```bash
npx prisma migrate dev
```

Validar schema:

```bash
npx prisma validate
```

---

## Prisma Studio

Abrir interface de gerenciamento do banco:

```bash
npx prisma studio
```

Disponível em:

```text
http://localhost:5555
```

Permite:

* Visualizar usuários
* Visualizar papéis
* Conferir persistência
* Verificar Soft Delete

---

## Executar Infraestrutura

No diretório da documentação:

```bash
docker compose up -d
```

Verificar containers:

```bash
docker ps
```

Containers esperados:

* facoffee-keycloak
* facoffee-rabbitmq
* facoffee-mailpit
* facoffee-api-gateway

---

## Executar Serviço

```bash
npm run dev
```

---

# Serviços Disponíveis

| Serviço       | URL                        |
| ------------- | -------------------------- |
| Users Service | http://localhost:3001      |
| Swagger       | http://localhost:3001/docs |
| Prisma Studio | http://localhost:5555      |
| API Gateway   | http://localhost:18000     |
| Keycloak      | http://localhost:8080      |
| RabbitMQ      | http://localhost:15672     |
| Mailpit       | http://localhost:8025      |

---

# Modelo de Dados

## User

| Campo         | Tipo              |
| ------------- | ----------------- |
| id            | UUID              |
| name          | String            |
| email         | String            |
| status        | ACTIVE / INACTIVE |
| createdAt     | DateTime          |
| updatedAt     | DateTime          |
| deactivatedAt | DateTime?         |

## UserRole

| Campo  | Tipo                  |
| ------ | --------------------- |
| id     | UUID                  |
| userId | UUID                  |
| role   | MANAGER / PARTICIPANT |

---

# Fluxo de Persistência

Controller
↓
Service
↓
Repository
↓
Prisma ORM
↓
SQLite

---

# Evento UserDeactivated

Quando um usuário é desativado:

```http
DELETE /users/{userId}
```

O serviço:

1. Atualiza status para INACTIVE
2. Preenche deactivatedAt
3. Publica evento UserDeactivated

Payload:

```json
{
  "eventId": "evt_xxx",
  "eventType": "UserDeactivated",
  "occurredAt": "2026-06-11T12:00:00Z",
  "version": "1.0",
  "payload": {
    "userId": "uuid",
    "reason": "Usuário desativado manualmente"
  }
}
```

---

# Arquitetura

## Padrões Utilizados

### Database per Service

Cada microsserviço possui seu próprio banco de dados.

O User Management Service é proprietário exclusivo dos dados:

* users
* user_roles

Nenhum outro serviço acessa essas tabelas diretamente.

### Repository Pattern

A persistência é isolada através da camada UserRepository.

Benefícios:

* Baixo acoplamento
* Melhor testabilidade
* Facilidade para trocar mecanismo de persistência

### Event-Driven Communication

Comunicação assíncrona através de RabbitMQ.

Evento implementado:

* UserDeactivated

---

# Pendências

## Regras de Negócio

* [ ] Validação de e-mail duplicado
* [ ] USER_NOT_FOUND
* [ ] USER_ALREADY_INACTIVE
* [ ] Validação de roles

## Segurança

* [ ] Integração completa com API Gateway
* [ ] OAuth2/JWT ponta a ponta
* [ ] Controle de autorização por papéis

## Qualidade

* [ ] Testes unitários
* [ ] Testes de integração
* [ ] Cobertura automatizada

## Arquitetura

* [ ] Consumers de eventos
* [ ] Circuit Breaker
* [ ] Observabilidade
* [ ] Métricas

---

# Status das Fases

| Fase                 | Status |
| -------------------- | ------ |
| Estudo do Domínio    | ✅      |
| Estrutura Inicial    | ✅      |
| Endpoints REST       | ✅      |
| Persistência Prisma  | ✅      |
| SQLite               | ✅      |
| Soft Delete          | ✅      |
| RabbitMQ             | ✅      |
| Regras Avançadas     | 🚧     |
| Autenticação Gateway | 🚧     |
| Testes Automatizados | ⏳      |
| Entrega Final        | ⏳      |

```
```
