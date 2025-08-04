# rudnote

## Set up project

1. Clone the repository

    ```bash
    git clone https://github.com/rudnam/rudnote.git
    ```

2. Run the app using Docker

    ```bash
    docker compose up --build
    ```

3. Visit the app at: http://localhost:3000

## Development

### For Frontend

1. Navigate to the frontend directory

    ```bash
    cd ./frontend
    ```

2. Run the backend

    ```bash
    docker compose up --build backend db
    ```

3. Install dependencies

    ```bash
    npm install
    ```

4. Start the frontend dev server

    ```bash
    npm run dev
    ```

5. Stop backend when done

    ```bash
    docker compose down
    # Or, to also delete database data:
    docker compose down -v
    ```

### For Backend

1. Navigate to the backend directory

    ```bash
    cd ./backend
    ```
