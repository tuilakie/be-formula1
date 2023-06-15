# Be-formula1

## Development

After clone the repository, run the following command to install the dependencies:

```bash
# for server backend
$ npm install
```

Running docker (for the postgresql database):

```bash
$ docker-compose up -d
```

Pushing schema to database:

```bash
$ npx prisma db push
```

Generate type for prisma client

```bash
$ npx prisma generate
```

Seeding data

```bash
$ npx prisma db seed
```

If you want to access the database, you can use the following command:

```bash
$ npx prisma studio
```

Let's start the app:

```bash
# for backend server development
$ npm run start dev

# If you want start with watch mode
$ npm run start:dev
```
##

## Ports

| URL                   | Port | Description |
| --------------------- | ---- | ----------- |
| http://localhost:5173 | 5173 | Frontend (other repository)   |
| http://localhost:3001| 3001 | Backend     |

## Useful links

| URL                       | Name    | Description |
| ------------------------- | ------- | ----------- |
| http://localhost:3001/api | Swagger | API docs    |

##
