# FACOFFEE User-Management-Service

## Disciplina

Técnicas Avançadas em Desenvolvimento de Software - Engenharia de Software

## Equipe

| Integrante | Responsabilidade |
|------------|------------------|
| Integrante 1 | API e Endpoints |
| Integrante 2 | Regras de Negócio e Persistência |
| Integrante 3 | Autenticação, Integrações e Testes |

---

# Repositório

Link do repositório:

> [https://github.com/miguelpaullo/FACOFFEE---User-Management-Service](https://github.com/miguelpaullo/FACOFFEE---User-Management-Service)

---

# Objetivo

Desenvolver o microsserviço **Users** da aplicação FACOFFEE, responsável pelo gerenciamento de usuários, perfis de acesso e integração com o sistema de autenticação.

---

# Escopo do Microsserviço

O serviço será responsável por:

- Cadastro de usuários
- Consulta de usuários
- Atualização de usuários
- Desativação de usuários
- Gerenciamento de papéis (roles)
- Integração com Keycloak

---

# Endpoints Implementados

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | `/users` | Criar usuário |
| GET | `/users` | Listar usuários |
| GET | `/users/{userId}` | Buscar usuário |
| PATCH | `/users/{userId}` | Atualizar usuário |
| DELETE | `/users/{userId}` | Desativar usuário |
| PUT | `/users/{userId}/roles` | Alterar papéis |

---

# Requisitos Funcionais

RF01 - Cadastrar usuário

RF02 - Consultar usuário

RF03 - Atualizar usuário

RF04 - Desativar usuário

RF05 - Gerenciar papéis

RF06 - Listar usuários

# Regras de Negócio

RN01 - Unicidade de e-mail

RN02 - Papel padrão PARTICIPANT

RN03 - Status inicial ACTIVE

RN04 - Apenas MANAGER lista usuários

RN05 - Participante consulta apenas seus dados

RN06 - Participante altera apenas seus dados

RN07 - Substituição integral de papéis

RN08 - Desativação lógica

RN09 - Consistência com Keycloak

# Stack Tecnológica (Proposta)

A stack definitiva será validada pela equipe após estudo inicial.

## Backend

- Node.js
- TypeScript
- Express

## Persistência

- SQLite
- Prisma ORM

## Testes

- Vitest

## Infraestrutura

- Docker
- Keycloak
- RabbitMQ

---

# Estratégia de Desenvolvimento

O desenvolvimento será realizado em etapas.

## Fase 1 - Estudo

Objetivo:

Compreender as tecnologias e os requisitos do projeto.

Tópicos:

- REST APIs
- Node.js
- Express
- TypeScript
- Prisma
- JWT
- Keycloak
- RabbitMQ

## Fase 2 - Estrutura Inicial

- Configuração do projeto
- Configuração do TypeScript
- Estruturação das pastas
- Configuração do banco

## Fase 3 - Implementação dos Endpoints

Ordem de desenvolvimento:

1. Criar usuário
2. Buscar usuário por ID
3. Listar usuários
4. Atualizar usuário
5. Desativar usuário
6. Atualizar papéis

## Fase 4 - Persistência

- Modelagem dos dados
- Implementação dos repositórios
- Integração com banco de dados

## Fase 5 - Autenticação

- Validação de JWT
- Controle de acesso por roles
- Integração com Keycloak

## Fase 6 - Eventos

- Integração com RabbitMQ
- Publicação dos eventos previstos

## Fase 7 - Testes

- Testes unitários
- Testes de integração
- Testes de autorização

## Fase 8 - Documentação

- README final
- Instruções de execução
- Evidências de testes

---

# Plano de Estudos da Equipe

O desenvolvimento do projeto exigirá o aprendizado de tecnologias e conceitos relacionados à arquitetura de microsserviços, APIs REST, autenticação, mensageria e persistência de dados.

Para otimizar o tempo disponível, os estudos serão divididos conforme as responsabilidades de cada integrante.

---

## Integrante 1 - API e Endpoints

### Objetivo

Implementar os endpoints do microsserviço Users e garantir aderência ao contrato OpenAPI.

### Conteúdos

#### REST API

- Métodos HTTP
- Status HTTP
- JSON
- Boas práticas REST

#### Node.js

- Estrutura de projetos
- npm
- Módulos

#### Express

- Rotas
- Controllers
- Middlewares
- Request e Response

#### TypeScript

- Interfaces
- Types
- Async/Await

#### Prisma

- CRUD
- Consultas
- Integração com banco

#### OpenAPI

- Interpretação do contrato
- Schemas
- Requests e Responses

### Resultado Esperado

Ser capaz de implementar todos os endpoints do domínio Users.

---

## Integrante 2 - Regras de Negócio e Persistência

### Objetivo

Implementar a camada de negócio e a persistência dos dados.

### Conteúdos

#### Modelagem de Dados

- Entidades
- Relacionamentos
- Modelagem conceitual

#### Banco de Dados

- SQL básico
- Consultas
- Restrições
- Integridade dos dados

#### Prisma ORM

- Migrations
- Relacionamentos
- Queries avançadas

#### Arquitetura Backend

- Services
- Repositories
- Separação de responsabilidades

#### Regras de Negócio

- Controle de status
- Controle de permissões
- Validações de domínio

### Resultado Esperado

Ser capaz de implementar toda a lógica de negócio do microsserviço.

---

## Integrante 3 - Integrações, Segurança e Testes

### Objetivo

Implementar autenticação, autorização, mensageria e testes automatizados.

### Conteúdos

#### JWT

- Estrutura do token
- Claims
- Autorização baseada em roles

#### Keycloak

- Realm
- Clients
- Roles
- Integração com APIs

#### RabbitMQ

- Exchanges
- Filas
- Producers
- Consumers

#### Testes

- Testes Unitários
- Testes de Integração
- Mocking

#### Docker

- Containers
- Docker Compose
- Execução local

### Resultado Esperado

Garantir autenticação, integração entre serviços e qualidade do software.

---

# Conhecimentos Compartilhados

Todos os integrantes deverão possuir conhecimento básico sobre:

- Arquitetura do projeto FACOFFEE
- Fluxo de autenticação
- Fluxo de integração entre serviços
- Contrato OpenAPI
- Git e GitHub
- Processo de Pull Request

---

# Estratégia de Aprendizado

O estudo será realizado de forma paralela ao desenvolvimento.

Cada integrante será responsável por aprofundar os conteúdos relacionados à sua área principal de atuação e compartilhar o conhecimento adquirido durante reuniões da equipe.

Dessa forma, busca-se reduzir a curva de aprendizado individual e aumentar a capacidade de colaboração durante o desenvolvimento do projeto.

---

# Cronograma

| Período | Atividade |
|----------|------------|
| Semana 1 | Estudo e configuração do ambiente |
| Semana 2 | Implementação dos endpoints |
| Semana 3 | Integrações, testes e documentação |
| 11/06 | Entrega final |

---

# Status Atual do Projeto

## Funcionalidades Implementadas

### API

- [x] POST /users
- [x] GET /users
- [x] GET /users/{userId}
- [x] PATCH /users/{userId}
- [x] DELETE /users/{userId}
- [x] PUT /users/{userId}/roles

### Persistência

- [x] Configuração do Prisma ORM
- [x] Banco SQLite
- [x] Migration inicial
- [x] Model User
- [x] Model UserRole
- [x] UserRepository

### Regras de Negócio

- [x] Papel padrão PARTICIPANT
- [x] Status inicial ACTIVE
- [x] Atualização de usuário
- [x] Atualização de papéis
- [x] Soft Delete
- [x] Busca por e-mail

### Eventos

- [x] Publicação do evento UserDeactivated
- [x] Integração com RabbitMQ
- [x] Exchange domain.events

### Infraestrutura

- [x] Docker Compose
- [x] API Gateway
- [x] Keycloak
- [x] RabbitMQ
- [x] Mailpit

# Pendências

## Regras de Negócio

- [ ] RN01 - Garantir unicidade de e-mail
- [ ] RN04 - Apenas MANAGER lista usuários
- [ ] RN05 - Participante consulta apenas seus dados
- [ ] RN06 - Participante altera apenas seus dados
- [ ] RN09 - Consistência completa com Keycloak

## Segurança

- [ ] Validação completa de JWT
- [ ] Controle de autorização por roles

## Testes

- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes de autorização

## Tratamento de Erros

- [ ] USER_NOT_FOUND
- [ ] USER_ALREADY_INACTIVE
- [ ] EMAIL_ALREADY_EXISTS

## Fase 1 - Estudo
✅ Concluída

## Fase 2 - Estrutura Inicial
✅ Concluída

## Fase 3 - Implementação dos Endpoints
✅ Concluída

## Fase 4 - Persistência
🚧 Em andamento

## Fase 5 - Autenticação
🚧 Em andamento

## Fase 6 - Eventos
✅ Concluída

## Fase 7 - Testes
❌ Pendente

# Observações

O foco inicial da equipe será garantir a implementação completa dos requisitos obrigatórios definidos no contrato OpenAPI, priorizando funcionalidade, organização do código e aderência às regras de negócio antes da implementação de melhorias adicionais.