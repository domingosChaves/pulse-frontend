# Pulse Frontend (Angular)

Este é o SPA (Single Page Application) do Pulse, responsável pela interface web e pela integração com o backend HTTP. O foco é Brasil (PT-BR), incluindo descrições de testes e rótulos.

- Stack: Angular 15, TypeScript, RxJS, Jasmine/Karma (unit), Protractor (e2e – opcional), Nginx, Docker.
- Padrões: chamadas REST via `/api`, testes em PT-BR, cobertura mínima aprovada (Statements ≥ 80, Branches ≥ 55, Functions ≥ 80, Lines ≥ 80).
- Ambientes: desenvolvimento com proxy HTTP; produção servida por Nginx com fallback de SPA e proxy para a API.

## Visão Geral da Arquitetura

- SPA Angular acessa o backend via `/api`.
- Desenvolvimento (localhost): o proxy do Angular encaminha `http://localhost:4200/api/*` → `http://localhost:8081/api/*`.
- Produção (Docker): o Nginx do container encaminha `/api/*` → `http://backend:8081` na mesma rede Docker.
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

### Upstream do backend (variável BACKEND_UPSTREAM)

A imagem usa um template do Nginx processado em runtime (envsubst) com a variável `BACKEND_UPSTREAM` para definir o destino de `/api`. Exemplos:

- Backend no host (Windows/macOS – Docker Desktop): `BACKEND_UPSTREAM=host.docker.internal:8081` (padrão)
- Backend no host (Linux): usar host-gateway no compose
- Backend em rede Docker (mesmo Compose): `BACKEND_UPSTREAM=pulse-backend:8081` (ou o nome/porta do seu serviço)

### Docker direto

Build e run direto com Docker (na raiz do repo):
- `docker build -t pulse-frontend:latest -f frontend/Dockerfile frontend`
- `docker run --rm -p 3000:80 pulse-frontend:latest`
- Acesse: `http://localhost:3000`

### Docker Compose (recomendado)

Na raiz do repositório:

```
# backend no host (Windows/macOS) – padrão
docker compose build --no-cache frontend
docker compose up -d

# backend no host (Linux) – se host.docker.internal não resolver, habilite host-gateway
# edite docker-compose.yml e descomente:
# extra_hosts:
#   - "host.docker.internal:host-gateway"
# então rode:
docker compose build --no-cache frontend
docker compose up -d

# backend no mesmo compose (serviço pulse-backend)
# rode com variável ou ajuste no arquivo:
BACKEND_UPSTREAM=pulse-backend:8081 docker compose up -d --build
```

Acesse: `http://localhost:3000`.

## Autenticação e Cadastro (novo)

- Rotas:
  - /login: login tradicional (usuário/senha) e social (Google/GitHub).
  - /register: cadastro de usuário (nome, e-mail, usuário, senha e confirmação).
  - /auth/callback: callback de OAuth para Google/GitHub.
- Fluxo JWT:
  - Após login/callback, o backend retorna { token, user }; o token é salvo no localStorage e enviado no header Authorization.
  - /auth/me retorna o usuário atual; rotas de negócio exigem JWT.
- Requisitos de backend:
  - Prefixo /api para todos os endpoints.
  - OAuth: permitir redirect_uri http://localhost:4200/auth/callback em dev e o domínio/IP público em produção.

## Configuração de API (proxy vs direto)

- Dev com proxy (padrão):
  - environment.ts → apiBaseUrl: '/api'.
  - proxy.conf.json: encaminha /api → http://localhost:8081.
  - Inicie o backend em http://localhost:8081 e rode `npm start` no frontend.
- Sem proxy (direto):
  - Ajuste environment.ts → apiBaseUrl: 'http://localhost:8081/api' (ou base do seu backend).
  - Reinicie o frontend.
- Se o backend não usa prefixo /api, adicione pathRewrite no proxy.

## Scripts utilitários de diagnóstico (novo)

- Testar endpoints do backend (direto):
  - `npm run check:api`
- Testar via proxy do dev server:
  - `npm run check:api:proxy`
- Observação: respostas 401 indicam conectividade ok porém sem autenticação; falhas de rede (ECONNREFUSED/timeout) indicam indisponibilidade/porta errada.

## Deploy Docker/Nginx

- Variável BACKEND_UPSTREAM aponta para o backend (host:porta) que atenderá o prefixo /api via Nginx.
- Exemplos locais:
  - BACKEND_UPSTREAM=localhost:8081 docker compose up -d --build

## Deploy em AWS (IP público) (novo)

- Frontend e backend em contêineres nas instâncias EC2, expostos por IP público.
- Configure o container do frontend com:
  - BACKEND_UPSTREAM="<IP_PUBLICO_BACKEND>:8081"
- Configure o backend para permitir o frontend público:
  - CORS Allowed Origin: http://<IP_PUBLICO_FRONT>
  - OAuth redirect allowlist: http://<IP_PUBLICO_FRONT>/auth/callback
- Dica: o IP público da EC2 pode ser obtido via metadata service (169.254.169.254) e injetado em variáveis de ambiente no start.

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

## Guia de Estilos e Responsividade (novo)

- Estilos globais consolidados em `src/styles.scss` com variáveis CSS (`:root`) para espaçamento, cores e bordas.
- Header fixo `.app-header` com navegação que destaca link ativo (`routerLinkActive="active"`).
- Layout responsivo:
  - `.container` com largura máxima e padding lateral.
  - `.toolbar-actions` para filtros e ações com quebra automática em telas pequenas.
  - `.table-responsive` com rolagem horizontal para tabelas estreitas.
  - Inputs e botões padronizados com estado hover/focus e tamanhos de toque adequados.
- Acessibilidade: `.sr-only` para legendas e `:focus-visible` visível em elementos interativos.

## Changelog de UI/CSS (resumo)

- Refatorado `app.component.html` para remover estilos inline legados; estilos migrados para `styles.scss`.
- Padronizados botões primários (classe `primary`) para ações de criação em listas de Fabricantes e Produtos.
- Relatório de Produtos atualizado para usar `.toolbar-actions` e herdar estilos globais; SCSS local simplificado.
- Tabelas com cabeçalho em fundo sutil e linhas zebradas para melhor leitura.

## Troubleshooting (atualizado)

- "Error occurred while trying to proxy":
  - Verifique se o backend responde em http://localhost:8081 (ou BACKEND_UPSTREAM configurado).
  - Rode `npm run check:api` e/ou `npm run check:api:proxy` para diagnosticar.
  - Confirme o redirect_uri do OAuth permitido no backend.
- 401 em todas as rotas:
  - É esperado sem token; faça login/cadastro para testar rotas protegidas.
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
