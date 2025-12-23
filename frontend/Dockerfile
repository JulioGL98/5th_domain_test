# ETAPA 1: CONSTRUCCIÓN (NODE)
FROM node:20-alpine as build
WORKDIR /app

# INSTALAR DEPENDENCIAS
COPY package*.json ./
RUN npm install

# COPIAR CÓDIGO
COPY . .

# DEFINIR LA URL DE LA API PARA LA BUILD
# (Esto es crucial: Apunta a localhost porque el navegador del usuario es quien hace la petición)
ARG VITE_API_URL=http://localhost:5068
ENV VITE_API_URL=$VITE_API_URL

# CONSTRUIR LA APP OPTIMIZADA
RUN npm run build

# ETAPA 2: SERVIDOR WEB (NGINX)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copiamos config de nginx (ver paso siguiente)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]