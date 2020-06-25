# Postgres example

## Testing

Start local postgres:

```
docker run --rm -it -e POSTGRES_DB=demo -e POSTGRES_USER=demo -e POSTGRES_PASSWORD=demo -p 5432:5432 postgres
```

Start local server:

```
DB_URL=postgresql://demo:demo@127.0.0.1:5432/demo npm run dev
```
