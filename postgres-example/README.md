# Postgres example

## Local development with a Docker postgres

Start local temporary postgres:

```bash
docker run --rm -it -e POSTGRES_DB=demo -e POSTGRES_USER=demo -e POSTGRES_PASSWORD=demo -p 5432:5432 postgres
```

Start local server (in a second terminal):

```bash
DB_URL=postgresql://demo:demo@127.0.0.1:5432/demo npm run dev
```

## Local testing with Docker container for DB & app

Start docker container from Docker hub:

```bash
docker network create postgres-example

docker run --rm -d --net=postgres-example --name postgres-example-db -e POSTGRES_DB=demo -e POSTGRES_USER=demo -e POSTGRES_PASSWORD=demo postgres

docker run --rm -d --net=postgres-example --name postgres-example-app -e DB_URL=postgresql://demo:demo@postgres-example-db:5432/demo jerolimov/postgres-example
```

Cleanup:

```
docker stop postgres-example-db postgres-example-app
docker network rm postgres-example
```
