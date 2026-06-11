# Integrações do Users Service

Este documento registra as integrações implementadas no Users Service da aplicação FACOFFEE.

## 1. Objetivo

A responsabilidade desta parte do projeto foi configurar as integrações do serviço de usuários com os componentes de infraestrutura da arquitetura de microsserviços, principalmente Keycloak e RabbitMQ.

As integrações implementadas foram:

* Validação de Access Token JWT.
* Integração com Keycloak.
* Extração do usuário autenticado a partir do token.
* Configuração de publisher RabbitMQ.
* Publicação de evento assíncrono de domínio.
* Rotas temporárias de debug para validação das integrações.

## 2. Integração com Keycloak e JWT

Foi implementado o middleware `authMiddleware`, responsável por proteger rotas HTTP que exigem autenticação.

O middleware lê o cabeçalho:

```http
Authorization: Bearer <access_token>
```

Em seguida, valida o token JWT usando as chaves públicas do realm `facoffee` no Keycloak.

Após a validação, o middleware extrai as informações do usuário autenticado:

* `id`
* `email`
* `roles`

As roles são lidas a partir da claim `roles`, com fallback para `realm_access.roles`.

## 3. Rota protegida de validação

Foi criada uma rota temporária para testar a autenticação:

```http
GET /debug/protected
```

Essa rota exige um token válido. Quando o token é aceito, retorna os dados do usuário autenticado.

Exemplo de resposta obtida durante os testes:

```json
{
  "message": "Rota protegida acessada com sucesso.",
  "authenticatedUser": {
    "id": "6034a244-7106-4614-926b-412d2e5ce734",
    "email": "facoffee@facom.ufms.br",
    "roles": ["MANAGER"]
  }
}
```

Essa evidência mostra que o token emitido pelo Keycloak foi validado corretamente e que a role `MANAGER` foi extraída com sucesso.

## 4. Integração com RabbitMQ

Foi implementado o arquivo:

```text
src/integrations/rabbitmq/eventPublisher.ts
```

Esse módulo é responsável por conectar no RabbitMQ, criar um canal e publicar eventos de domínio em um exchange do tipo `topic`.

As variáveis usadas para configuração são:

```env
RABBITMQ_URL=amqp://facoffee:facoffee@localhost:5672
RABBITMQ_EXCHANGE=facoffee.users
```

## 5. Evento assíncrono implementado

Foi criada uma rota temporária para validar a publicação de eventos:

```http
POST /debug/events/user-created
```

Essa rota publica o evento:

```text
users.created
```

O evento contém:

* identificador único do evento;
* routing key;
* data e hora de ocorrência;
* dados do usuário enviado no corpo da requisição;
* dados do usuário autenticado que solicitou a operação.

Exemplo de evidência obtida:

```text
Evento de usuário publicado no RabbitMQ.
routingKey=users.created
```

## 6. Comandos usados para teste

Gerar token no Keycloak:

```powershell
$response = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/realms/facoffee/protocol/openid-connect/token" -ContentType "application/x-www-form-urlencoded" -Body "grant_type=password&client_id=facoffee-public&username=facoffee@facom.ufms.br&password=facoffee"

$token = $response.access_token
```

Testar rota protegida:

```powershell
curl.exe http://localhost:3001/debug/protected -H "Authorization: Bearer $token"
```

Criar corpo do evento:

```powershell
$body = @'
{
  "id": "teste-1",
  "name": "Usuario Teste",
  "email": "teste@facom.ufms.br",
  "roles": ["PARTICIPANT"]
}
'@
```

Publicar evento no RabbitMQ:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3001/debug/events/user-created" `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $body
```

## 7. Relação com padrões de microsserviços

A integração com Keycloak e JWT está relacionada ao padrão Access Token, pois o serviço valida tokens de acesso para controlar quem pode acessar rotas protegidas.

A integração com RabbitMQ reforça a comunicação assíncrona entre microsserviços, permitindo que eventos de domínio sejam publicados sem acoplamento direto entre os serviços.

A configuração separada dessas integrações também mantém o Users Service mais independente, alinhado à ideia de microsserviços com responsabilidades bem delimitadas.
