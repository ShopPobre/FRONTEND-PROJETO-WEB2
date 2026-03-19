# FRONTEND-PROJETO-WEB2

## ShopPobre - Frontend

### 1. Visao geral
Interface web do sistema **ShopPobre**, desenvolvida em Angular, consumindo a API do backend para autenticação, catalogo de produtos, carrinho, pedidos e pagamento com Stripe.

- Frontend (Angular): `http://localhost:4200`
- Backend (API): `http://localhost:3000`
- Documentacao da API (Swagger): `http://localhost:3000/api-docs`

---

### 2. Como executar

Este frontend depende do backend em execucao. O roteiro recomendado para demonstracao e:

1. Subir stack completa com Docker Compose (MySQL + MinIO + API + seed + frontend).
2. Configurar Stripe localmente (incluindo webhook).
3. Acessar frontend Angular.
4. Demonstrar fluxo completo: login -> carrinho -> pedido -> pagamento.

---

### 3. Pre-requisitos

- Docker e Docker Compose (obrigatorio no modo recomendado)
- Stripe CLI (obrigatorio apenas para confirmar pagamentos localmente via webhook)

### 3.1 Variaveis de ambiente (.env) antes do compose

Antes do `docker compose up`, configure o `.env` do backend:

```bash
test -f BACKEND-PROJETO-WEB2/.env || cp BACKEND-PROJETO-WEB2/.env.example BACKEND-PROJETO-WEB2/.env
```

Minimo recomendado para subir a stack:

```env
DB_USER=shopobre
DB_PASS=root123
DB_NAME=shopobre
JWT_SECRET=troque_esta_chave_em_producao
JWT_TOKEN_AUDIENCE=shopobre
JWT_TOKEN_ISSUER=shopobre
JWT_TTL=3600
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=admin123
```

Para testar pagamento Stripe, adicione tambem no mesmo `.env`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

### 4. Subindo stack (modo oficial)

#### Estrutura com repositorios separados

Organize os repositorios lado a lado em uma pasta pai:

```bash
workspace/
├── BACKEND-PROJETO-WEB2/
└── FRONTEND-PROJETO-WEB2/
```

Crie `docker-compose.yml` na pasta `workspace/` com este conteudo:

```yaml
services:
  database:
    image: mysql:8
    container_name: shopobre-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASS:-root123}
      MYSQL_DATABASE: ${DB_NAME:-shopobre}
      MYSQL_USER: ${DB_USER:-shopobre}
      MYSQL_PASSWORD: ${DB_PASS:-root123}
    ports:
      - "${DB_PORT:-3306}:3306"
    volumes:
      - mysqldata:/var/lib/mysql
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h localhost -u$${MYSQL_USER} -p$${MYSQL_PASSWORD} --silent"]
      interval: 10s
      timeout: 5s
      retries: 15
      start_period: 30s
    networks:
      - shopobre-net

  minio:
    image: minio/minio:latest
    container_name: shopobre-minio
    restart: always
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-minioadmin}
    ports:
      - "${MINIO_PORT:-9000}:9000"
      - "${MINIO_CONSOLE_PORT:-9001}:9001"
    volumes:
      - miniodata:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 10s
      timeout: 5s
      retries: 15
      start_period: 10s
    networks:
      - shopobre-net

  backend:
    build:
      context: ./BACKEND-PROJETO-WEB2
      dockerfile: Dockerfile
    container_name: shopobre-backend
    restart: always
    env_file:
      - ./BACKEND-PROJETO-WEB2/.env
    environment:
      DB_DIALECT: mysql
      DB_HOST: database
      DB_PORT: "3306"
      DB_USER: ${DB_USER:-shopobre}
      DB_PASS: ${DB_PASS:-root123}
      DB_NAME: ${DB_NAME:-shopobre}
      JWT_SECRET: ${JWT_SECRET:-shopobre_dev_jwt_secret_change_me}
      JWT_TOKEN_AUDIENCE: ${JWT_TOKEN_AUDIENCE:-shopobre}
      JWT_TOKEN_ISSUER: ${JWT_TOKEN_ISSUER:-shopobre}
      JWT_TTL: ${JWT_TTL:-3600}
      MINIO_ENDPOINT: minio
      MINIO_PORT: "9000"
      MINIO_ACCESS_KEY: ${MINIO_ROOT_USER:-minioadmin}
      MINIO_SECRET_KEY: ${MINIO_ROOT_PASSWORD:-minioadmin}
      MINIO_BUCKET: ${MINIO_BUCKET:-shopobre}
      MINIO_USE_SSL: "false"
      PORT: "3000"
    depends_on:
      database:
        condition: service_healthy
      minio:
        condition: service_healthy
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/health"]
      interval: 15s
      timeout: 5s
      retries: 15
      start_period: 40s
    networks:
      - shopobre-net

  seed:
    build:
      context: ./BACKEND-PROJETO-WEB2
      dockerfile: Dockerfile
    container_name: shopobre-seed
    env_file:
      - ./BACKEND-PROJETO-WEB2/.env
    environment:
      DB_DIALECT: mysql
      DB_HOST: database
      DB_PORT: "3306"
      DB_USER: ${DB_USER:-shopobre}
      DB_PASS: ${DB_PASS:-root123}
      DB_NAME: ${DB_NAME:-shopobre}
      JWT_SECRET: ${JWT_SECRET:-shopobre_dev_jwt_secret_change_me}
      JWT_TOKEN_AUDIENCE: ${JWT_TOKEN_AUDIENCE:-shopobre}
      JWT_TOKEN_ISSUER: ${JWT_TOKEN_ISSUER:-shopobre}
      JWT_TTL: ${JWT_TTL:-3600}
      MINIO_ENDPOINT: minio
      MINIO_PORT: "9000"
      MINIO_ACCESS_KEY: ${MINIO_ROOT_USER:-minioadmin}
      MINIO_SECRET_KEY: ${MINIO_ROOT_PASSWORD:-minioadmin}
      MINIO_BUCKET: ${MINIO_BUCKET:-shopobre}
      MINIO_USE_SSL: "false"
    command:
      - sh
      - -c
      - |
        for i in 1 2 3 4 5 6; do
          npm run setup && exit 0
          echo "Aguardando DB/MinIO para seed... tentativa $$i/6"
          sleep 5
        done
        exit 1
    depends_on:
      database:
        condition: service_healthy
      minio:
        condition: service_healthy
    restart: on-failure:5
    networks:
      - shopobre-net

  frontend:
    build:
      context: ./FRONTEND-PROJETO-WEB2/shopobre-ui
      dockerfile: Dockerfile
    container_name: shopobre-frontend
    restart: always
    depends_on:
      backend:
        condition: service_healthy
      seed:
        condition: service_completed_successfully
    ports:
      - "4200:4200"
    networks:
      - shopobre-net

networks:
  shopobre-net:

volumes:
  mysqldata:
  miniodata:
```

#### Comando unico para tudo

Na raiz `workspace/` que contem `BACKEND-PROJETO-WEB2` e `FRONTEND-PROJETO-WEB2`:

```bash
docker compose up -d --build
```

Valide:

```bash
curl http://localhost:3000/health
```

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`

---

### 5. Configuracao local do Stripe (obrigatorio para pagamento)

No backend, confirme que o `.env` ja contem `STRIPE_SECRET_KEY` e `STRIPE_PUBLISHABLE_KEY`.

#### 5.1 Instalar e autenticar Stripe CLI

1. Instale a Stripe CLI (documentacao oficial): [https://docs.stripe.com/stripe-cli](https://docs.stripe.com/stripe-cli)
2. Faça login:

```bash
stripe login
```

#### 5.2 Encaminhar webhook para API local

Com backend rodando:

```bash
stripe listen --forward-to localhost:3000/webhook/stripe
```

- Esse comando imprime um segredo `whsec_...`.
- Copie esse valor para `STRIPE_WEBHOOK_SECRET` no `.env` do backend.
- Reinicie o backend para aplicar:

```bash
docker compose restart backend
```

---

### 6. Executando o frontend

Com a stack completa no ar, o frontend estara disponivel em:

`http://localhost:4200`

> Nesta documentacao, o frontend e executado somente via Docker Compose.

---

### 7. Roteiro rapido de demonstracao

1. Abrir frontend em `http://localhost:4200`
2. Fazer login com usuario cliente
3. Adicionar produtos ao carrinho
4. Fechar pedido
5. Ir para tela de pagamento
6. Pagar com cartao de teste Stripe (ex.: `4242 4242 4242 4242`)
7. Mostrar confirmacao e pedido atualizado

---

### 8. Solucao de problemas comum

- **Frontend sem produtos**: backend nao esta no ar ou CORS incorreto.
- **Pagamento nao confirma**: `STRIPE_WEBHOOK_SECRET` nao configurado ou `stripe listen` nao ativo.
- **Falha ao criar pagamento**: chaves Stripe invalidas no `.env` do backend.

---

### 9. Funcionalidades do frontend

- Login e cadastro de usuarios (JWT)
- Listagem e busca de produtos
- Carrinho de compras
- Finalizacao de pedidos
- Pagamento com Stripe
- Historico de compras
- Painel admin (gerenciamento de produtos e categorias)