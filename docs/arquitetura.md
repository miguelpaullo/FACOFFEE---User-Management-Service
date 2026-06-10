# Arquitetura do Projeto

# FACOFFEE - User Management Service

## Objetivo

Desenvolver o microsserviço responsável pelo gerenciamento de usuários da plataforma FACOFFEE.

O serviço será responsável por:

* Cadastro de usuários
* Consulta de usuários
* Atualização de usuários
* Desativação lógica de usuários
* Gerenciamento de papéis (roles)
* Integração com Keycloak

---

# Arquitetura Geral

A solução segue uma arquitetura baseada em microsserviços.

```text
Cliente
    |
    v
API Gateway
    |
    v
Users Service
    |
    +------> SQLite
    |
    +------> Keycloak
    |
    +------> RabbitMQ
```

O serviço será acessado através do API Gateway disponibilizado pela infraestrutura FACOFFEE.

---

# Stack Tecnológica

## Backend

* Node.js
* TypeScript
* Express

## Persistência

* SQLite
* Prisma ORM

## Testes

* Vitest

## Mensageria

* RabbitMQ

## Autenticação e Autorização

* Keycloak
* OAuth2
* JWT

## Resiliência

* Circuit Breaker (Opossum)

---

# Padrões Arquiteturais

## API Gateway

Todas as requisições serão realizadas através do gateway disponibilizado pela infraestrutura do projeto.

Benefícios:

* Centralização do acesso.
* Validação de autenticação.
* Encaminhamento para os microsserviços.

---

## Database per Service

Cada microsserviço possui sua própria base de dados.

Neste projeto:

```text
Users Service
└── users.db
```

Benefícios:

* Baixo acoplamento.
* Independência entre serviços.
* Evolução isolada do domínio.

---

## OAuth2 + JWT

A autenticação será centralizada no Keycloak.

Fluxo:

```text
Usuário
   |
   v
Keycloak
   |
 JWT
   |
   v
Users Service
```

Benefícios:

* Centralização da autenticação.
* Controle de acesso baseado em roles.
* Segurança padronizada.

---

## Circuit Breaker

As integrações externas serão protegidas utilizando o padrão Circuit Breaker.

Aplicação prevista:

```text
Users Service
      |
      v
Keycloak
```

Caso o Keycloak esteja indisponível:

* Interromper chamadas repetidas.
* Evitar degradação do serviço.
* Retornar erro controlado.

---

# Estrutura do Serviço

```text
src/

controllers/
services/
repositories/
routes/
middlewares/
dtos/
entities/
config/
```

---

# Responsabilidades da Equipe

## Integrante 1

Responsável por:

* Estrutura do projeto
* Controllers
* Rotas
* DTOs
* Integração HTTP
* Conformidade com OpenAPI

---

## Integrante 2

Responsável por:

* Modelagem do banco
* Prisma ORM
* Repositórios
* Regras de negócio

---

## Integrante 3

Responsável por:

* Keycloak
* JWT
* RabbitMQ
* Circuit Breaker
* Testes automatizados

---

# Endpoints do Serviço

* POST /users
* GET /users
* GET /users/{userId}
* PATCH /users/{userId}
* DELETE /users/{userId}
* PUT /users/{userId}/roles

---

# Objetivos da Primeira Entrega

* Estrutura inicial do projeto.
* Configuração do TypeScript.
* Configuração do Prisma.
* Endpoint de healthcheck.
* Preparação para implementação dos endpoints do domínio Users.
