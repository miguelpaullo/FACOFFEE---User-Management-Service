# Setup do Ambiente

## Pré-requisitos

Instalar:

### Git

Verificar:

```bash
git --version
```

### Node.js

Versão recomendada:

```text
Node.js 22 LTS
```

Verificar:

```bash
node -v
npm -v
```

### VS Code

Extensões recomendadas:

* ESLint
* Prettier
* Prisma
* Thunder Client

---

## Clonar o Projeto

```bash
git clone <https://github.com/miguelpaullo/FACOFFEE---User-Management-Service>

cd FACOFFEE---User-Management-Service
```

---

## Instalar Dependências

```bash
npm install
```

---

## Arquivo de Ambiente

Criar:

```text
.env
```

Baseado em:

```text
.env.example
```

Exemplo:

```env
PORT=3001
```

---

## Executar Aplicação

Modo desenvolvimento:

```bash
npm run dev
```

Saída esperada:

```text
Users Service running on port 3001
```

---

## Testar API

Healthcheck:

```text
http://localhost:3001/health
```

Swagger:

```text
http://localhost:3001/docs
```

---

## Estrutura do Projeto

```text
src/
├── controllers/
├── dtos/
├── routes/
├── services/
├── config/
└── server.ts
```

---

## Fluxo de Desenvolvimento

### Atualizar Main

```bash
git checkout main
git pull origin main
```

### Criar Branch

```bash
git checkout -b feat/nome-da-feature
```

### Commit

```bash
git add .

git commit -m "feat: descrição"
```

### Push

```bash
git push -u origin nome-da-branch
```

### Pull Request

Abrir PR para main e referenciar a Issue:

```text
Closes #numero-da-issue
```

---

## Convenção de Branches

### Features

```text
feat/*
```

### Correções

```text
fix/*
```

### Documentação

```text
docs/*
```

### Infraestrutura

```text
chore/*
```
