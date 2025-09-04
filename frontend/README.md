# Frontend

Este projeto usa Angular e pode ser executado via Docker/Nginx para produção.

## Integração com backend (DEV e Produção)

- Base da API no frontend: `/api` (definido em `environment.ts` e `environment.prod.ts`).
- Desenvolvimento (ng serve): o arquivo `proxy.conf.json` encaminha `/api` para `http://localhost:8081` e mantém o prefixo `/api`.
  - Ajuste `target` caso seu backend rode em outra porta.
  - Comando já configurado no `npm start` para usar o proxy.
- Produção (Docker + Nginx): o `nginx.conf` faz proxy de `/api` para `http://backend:8081/` dentro do mesmo network Docker.
  - Se o backend estiver fora do Docker, pode usar `host.docker.internal:8081` (alternativa comentada no arquivo).
  - Garanta que o serviço Docker do backend se chame `backend` (ou ajuste o `proxy_pass`).

## Executar com Docker

Requisitos: Docker 20+.

Build da imagem (na raiz do repositório):

```
docker build -t pulse-frontend:latest -f frontend/Dockerfile frontend
```

Executar o container (porta 3000 -> 80):

```
docker run --rm -p 3000:80 pulse-frontend:latest
```

Acesse: http://localhost:3000

## Executar com Docker Compose

Na raiz do repositório:

```
docker compose up --build
```

Isso expõe a aplicação em http://localhost:3000. Para subir com o backend, use o exemplo comentado de serviço `backend` em `docker-compose.yml`.

---

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
