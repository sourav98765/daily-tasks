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

## Firebase Hosting

The Firebase Hosting configuration serves the production build from `artifacts/daily-tasks/dist/public` and rewrites app routes to `index.html`.

To deploy manually, install and sign in to the Firebase CLI, create a Firebase project with Hosting enabled, and run:

```sh
PORT=5000 BASE_PATH=/ NODE_ENV=production pnpm --filter @workspace/daily-tasks run build
firebase deploy --project daliy385 --only hosting
```

The site will be available at `https://daliy385.web.app`. Tasks remain saved in each visitor's browser and do not sync between devices.