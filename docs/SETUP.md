# FACOFFEE - Setup Atual do Projeto

## Infraestrutura

A infraestrutura local está funcionando através do Docker Compose.

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

### Subir infraestrutura

```bash
docker compose up -d
```

### Verificar containers

```bash
docker compose ps
```

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

A validação do token Keycloak ainda apresenta comportamento inconsistente e permanece em investigação.

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

Atualmente os retornos ainda são mockados.

---

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
