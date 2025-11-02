# Backend para gestión de órdenes

#### Descripción

Backend API REST para gestionar órdenes. Permite crealas, listarlas a todas, detallar una en particular, avanzar su estado.

---

## Stack usado

- **NestJS**
- **Sequelize** con **Postgres**
- **Jest**
- **Redis**
- **Docker**

---

## Contenido

1. Instalación
2. Ejecución en docker
3. Ejecución local
4. Gestión de órdenes
5. Colección de APIs

---

## 1. Instalación

##### 1. Clonar el repo

```bash
git clone https://github.com/marianogarino/orders-nest.git
cd orders-nest
```

##### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

---

## 2. Ejecución en docker

##### 1. Levantar los servicios

```bash
docker-compose up -d --build
```

##### 2. Verificar logs

```bash
# Estado de contenedores
docker compose ps

# Logs del backend
docker compose logs -f backend
```

---

## 3. Ejecución local

1. Instalar dependencias:

```bash
npm install
```

2. Copiar y editar variables de entorno:

```bash
cp .env.example .env
```

3. Ejecutar test unitario sobre **OrdersService**:

```bash
npm run test
```

3. Ejecutar aplicación:

```bash
npm run start:dev
```

---

## 4. Gestión de órdenes

### Crear una órden

`POST /orders`

```bash
curl --request POST \
  --url http://localhost:3000/orders \
  --header 'content-type: application/json' \
  --data '{
  "clientName": "Ana López",
  "items": [
    { "description": "Ceviche", "quantity": 2, "unitPrice": 5},
    { "description": "Chicha morada", "quantity": 1, "unitPrice": 10 }
  ]
}
```

### Detallar una órden

`GET /orders/:id`

```bash
curl --request GET \
  --url http://localhost:3000/orders/6e00b76c-f529-4ded-9318-f4acfd8f1d26
```

### Listar todas las órdenes

`GET /orders`

```bash
curl --request GET \
  --url http://localhost:3000/orders
```

### Avanzar una órden

`POST /orders/:id/advance`

```bash
curl --request POST \
  --url http://localhost:3000/orders/d746a4b7-a583-4642-b691-9ba91c5dc6f0/advance
```

##### Estados de la orden

initiated (cuando es creada) => sent => delivered

Una vez que llega al estado de 'delivered', es eliminade de la base de datos.

---

## 5. Colección de APIs

- **Postman/Hoppscotch**: Archivo `Orders.postman_collection.json`

---
