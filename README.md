# rudnam-notes

## Set up project

1. Clone the repository

```bash
git clone https://github.com/rudnam/rudnam-notes.git
```

2. Run the app using Docker

```bash
docker compose up --build
```

3. Visit the app at: http://localhost:3000

## Development

### For Frontend

1. Navigate to the frontend directory

```shell
cd ./frontend
```

2. Create an `.env` file in `/frontend/.env` and copy contents from `.env.example`

```env
# .env for local development
VITE_API_URL=http://localhost:8080/api
```

3. Run the backend

```shell
docker compose up --build backend db
```

4. Install dependencies

```shell
npm install
```

5. Start the frontend dev server

```shell
npm run dev
```

6. Stop backend when done

```shell
docker compose down
# Or, to also delete database data:
docker compose down -v
```

### For Backend

1. Navigate to the backend directory

```shell
cd ./backend
```
