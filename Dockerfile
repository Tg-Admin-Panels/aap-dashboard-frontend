# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Define build arguments
ARG VITE_NODE_ENV
ARG VITE_PROD_BASE_URL
ARG VITE_DEV_BASE_URL
ARG VITE_LOCAL_BASE_URL

# Set environment variables from build arguments
ENV VITE_NODE_ENV=$VITE_NODE_ENV
ENV VITE_PROD_BASE_URL=$VITE_PROD_BASE_URL
ENV VITE_DEV_BASE_URL=$VITE_DEV_BASE_URL
ENV VITE_LOCAL_BASE_URL=$VITE_LOCAL_BASE_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:prod

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
