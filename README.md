# Daily Tasks

A personal daily planner for adding tasks, choosing due dates and priorities, and keeping track of completed work. Tasks are saved in the current browser and do not sync between devices.

## Run locally

This project uses pnpm workspaces and Node.js 24.

```sh
pnpm install
PORT=5000 BASE_PATH=/ pnpm --filter @workspace/daily-tasks run dev
```

Open `http://localhost:5000`.

## App source

The Daily Tasks web app lives in `artifacts/daily-tasks`. It is a React and Vite app; the API server and reusable workspace libraries are included in this repository.