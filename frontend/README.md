# Pulse Frontend (Angular)

Este é o SPA (Single Page Application) do Pulse, responsável pela interface web e pela integração com o backend HTTP. O foco é Brasil (PT-BR), incluindo descrições de testes e rótulos.

- Stack: Angular 15, TypeScript, RxJS, Jasmine/Karma (unit), Protractor (e2e – opcional), Nginx, Docker.
- Padrões: chamadas REST via `/api`, testes em PT-BR, cobertura mínima aprovada (Statements ≥ 80, Branches ≥ 55, Functions ≥ 80, Lines ≥ 80).
- Ambientes: desenvolvimento com proxy HTTP; produção servida por Nginx com fallback de SPA e proxy para a API.

## Visão Geral da Arquitetura

- SPA Angular acessa o backend via `/api`.
- Desenvolvimento (localhost): o proxy do Angular encaminha `http://localhost:4200/api/*` → `http://localhost:8081/api/*`.
- Produção (Docker): o Nginx do container encaminha `/api/*` → `http://backend:8081/` na mesma rede Docker.
- Porta do frontend no Docker (host): `3000` (mapeada para `80` do container).

## Tecnologias e Métodos Aplicados

- Angular 15 + TypeScript + RxJS: SPA modular com serviços e componentes.
- Testes unitários: Jasmine + Karma (Chrome Headless via Puppeteer). Thresholds configurados no `karma.conf.js`.
- E2E (opcional): Protractor (mantido por compatibilidade do projeto; pode ser substituído por Cypress futuramente).
- Qualidade de código: Prettier, TSLint (projeto legado Angular 15), Husky + lint-staged (format automático em pre-commit).
- Infra: Dockerfile multi-stage (build + Nginx), `nginx.conf` com fallback de SPA e proxy `/api`, `docker-compose.yml` (exemplo de backend).
- Interceptor HTTP: padroniza headers (`Content-Type`, `Accept`, `Authorization` opcional, `X-Correlation-ID`) e faz logging de erros 400/404.

## Integração com o Backend

Base URLs (conforme guia e coleção Postman):
- Local (dev): `http://localhost:8081`
- Docker (host): `http://localhost:8081`
- Docker (rede interna): `http://backend:8081` (nome do serviço no Compose)

Headers (padrão):
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (opcional; se existir no `localStorage`, é repassado ao downstream)
- `X-Correlation-ID` (opcional; gerado quando ausente)

Erros (padrão):
- 400/404: `{ "error": string, "timestamp": string, "path": string }`
- 400 validação (DTO): `{ "campo": "mensagem", ... }`

Recursos principais – Direto (sem BFF):
- Fabricantes (`/api/fabricantes`)
  - `POST` FabricanteDTO `{ nome, cnpj, endereco?, telefone?, contato? }`
  - `GET` lista
  - `GET /{id}`
  - `PUT /{id}`
  - `DELETE /{id}`
- Produtos (`/api/produtos`)
  - `POST` ProdutoDTO `{ nome, codigoBarras, fabricanteId, descricao?, preco?, estoque? }`
  - `GET` lista; `?fabricanteId` opcional
  - `GET /{id}`
  - `PUT /{id}`
  - `DELETE /{id}`
  - `GET /paged` – query: `nome?`, `fabricanteId?`, `page=0`, `size=10`, `sort=campo,asc|desc`
  - `GET /relatorio` – retorna mapa `{ "Nome do Fabricante": [ProdutoResponse, ...], ... }`

BFF (opcional):
- Mesmos contratos sob `/api/bff` (`/fabricantes[...]`, `/produtos[...]`, `/produtos/paged`, `/produtos/relatorio`).

Coleção Postman (exemplos completos): ver `pulse-backend/docs/postman/pulse-backend.postman_collection.json` no repositório do backend.

## Como Executar (Desenvolvimento)

Pré-requisitos: Node 18+, npm.

1) Instalar dependências
- `npm install` (na pasta `frontend`)

2) Subir o backend
- Disponibilize a API em `http://localhost:8081` (conforme guia do backend).

3) Rodar a aplicação com proxy de API
- `npm start` (abre `http://localhost:4200`)
- O proxy (`proxy.conf.json`) encaminha `/api` → `http://localhost:8081` mantendo o prefixo.

## Como Executar (Produção com Docker/Nginx)

Build e run direto com Docker (na raiz do repo):
- `docker build -t pulse-frontend:latest -f frontend/Dockerfile frontend`
- `docker run --rm -p 3000:80 pulse-frontend:latest`
- Acesse: `http://localhost:3000`

Com Docker Compose (na raiz do repo):
- `docker compose up --build`
- Acesse: `http://localhost:3000`
- Para subir o backend junto, use o exemplo comentado no `docker-compose.yml` e garanta o nome do serviço `backend` (porta `8081`).

## Testes e Cobertura

- Unit: `npm run test:coverage`
  - Headless Chrome (Puppeteer) com thresholds globais:
    - Statements ≥ 80
    - Branches ≥ 55
    - Functions ≥ 80
    - Lines ≥ 80
  - Relatório HTML em: `frontend/coverage/frontend/index.html`
- Watch (dev): `npm run test:watch`
- E2E (opcional, Protractor): `npm run e2e`

## Scripts NPM (frontend/package.json)

- `start`: `ng serve --proxy-config proxy.conf.json --open`
- `build`: `ng build`
- `test`: `ng test`
- `test:watch`: `ng test`
- `test:coverage`: roda testes headless com cobertura
- `lint`, `format`: qualidade e formatação
- `e2e`: Protractor (legado)

## Estrutura de Pastas (resumo)

- `src/app/core/` – `api.service.ts` (base de chamadas), `http.interceptor.ts` (headers/erros), `core.module.ts`
- `src/app/products/` – serviços, componentes de listagem/formulário e relatório (agrupado por fabricante; exporta CSV)
- `src/app/manufacturers/` – serviços e componentes de fabricantes
- `src/environments/` – `environment.ts` (dev), `environment.prod.ts` (prod) com `apiBaseUrl = '/api'`
- `proxy.conf.json` – proxy de dev para `http://localhost:8081`
- `nginx.conf` – proxy de prod para `http://backend:8081` e fallback SPA
- `Dockerfile` – build multi-stage + Nginx
- `docker-compose.yml` (na raiz) – serviço do frontend e exemplo comentado do backend

## Padrões de Código e Qualidade

- Testes unitários em PT-BR (descrições `describe/it`), alinhados ao template atual.
- Husky + lint-staged: roda formatação no pre-commit.
- Prettier + TSLint (legado) padronizam estilo.
- CSV export: componentes de produtos geram relatórios em CSV (geral e por grupo).

## Troubleshooting

- Backend em porta diferente de `8081`:
  - Dev: ajuste `frontend/proxy.conf.json` (campo `target`).
  - Prod: ajuste `frontend/nginx.conf` (`proxy_pass`).
- Backend sem prefixo `/api`:
  - Dev/Prod: mantenha `/api` do lado do frontend e mapeie o proxy para o caminho real do backend.
- ChromeHeadless em CI/Windows:
  - `karma.conf.js` define launcher `ChromeHeadlessCI` com flags `--no-sandbox`, etc.
- CRLF vs LF em Windows: mensagens de aviso do Git são esperadas; não impactam o build.

## Licença

MIT (ver arquivo `LICENSE` na raiz do repositório).
