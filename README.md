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

The GitHub Actions workflow deploys the app to Firebase Hosting after pushes to `main`. It stays skipped until the Firebase project variable is configured. Add these in the repository's **Settings → Secrets and variables → Actions**:

- Repository variable `FIREBASE_PROJECT_ID` with your Firebase project ID.
- Repository secret `FIREBASE_SERVICE_ACCOUNT` with a service account JSON key authorized to deploy to Firebase Hosting.

After adding both values, run the workflow from GitHub Actions once; later pushes to `main` deploy automatically. The site will be available at `https://<FIREBASE_PROJECT_ID>.web.app`. Tasks remain saved in each visitor's browser and do not sync between devices.