# Etapa 1: build da aplicação Angular
FROM node:18-alpine AS build
WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm ci

# Copia o código e compila (produção)
COPY . .
RUN npx ng build --configuration=production

# Etapa 2: imagem final com Nginx servindo os estáticos
FROM nginx:1.25-alpine

# Configuração do Nginx para SPA (fallback para index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o build gerado na etapa anterior
COPY --from=build /app/dist/frontend /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
