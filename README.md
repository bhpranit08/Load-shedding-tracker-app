## Power Track

A full‑stack web application for tracking and visualizing power outages (load shedding) in your area.  
Users can register/login, report outages, verify community reports, and explore all outages on an interactive map.

- **Frontend**: React + Vite, React Router, React Leaflet, Tailwind CSS + DaisyUI, React Toastify  
- **Backend**: Express, MongoDB (Mongoose), JWT authentication, CORS

---

## Features

- **Authentication**: User registration and login with JWT-based auth.
- **Nearby outages**: Dashboard shows outages near the authenticated user based on their saved home location.
- **Reporting**: Users can submit new outage reports.
- **Verification & voting**: Community upvotes/downvotes and resolution confirmations.
- **Interactive map**: Leaflet map visualizing all reports with status-based markers and filters.

---

## Project Structure (High Level)

- `client/` – React Vite SPA (UI, map, dashboard, auth)
- `server/` – Express API, MongoDB connection, auth and outage routes

You typically run **both** `client` (frontend) and `server` (backend) during development.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/Load-shedding-tracker-app.git
cd Load-shedding-tracker-app
```

> Replace `<your-username>` with your GitHub username if you fork the project.

---

### 2. Backend setup (`server/`)

1. Go into the server folder:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in `server/` with the following variables:

   ```bash
   PORT=5000
   NODE_ENV=development

   # Local MongoDB URI for development
   MONGO_LOCAL=mongodb://localhost:27017/load_shedding_tracker_local

   # MongoDB Atlas / remote connection (used when NODE_ENV !== development)
   MONGO_DB_URL=mongodb+srv://<username>:<password>@<cluster-host>/<db-name>?retryWrites=true&w=majority

   # MongoDB Atlas credentials (if used)
   MONGO_USERNAME=<mongo-username>
   MONGO_PASSWORD=<mongo-password>

   # JWT secret used for signing authentication tokens
   JWT_SECRET=<strong-random-secret>

   # URL where the frontend is served from (for CORS)
   FRONTEND_URL=http://localhost:3000
   ```

   **Do not commit real secrets** (passwords, JWT secret, production URIs) to version control.

4. Start the backend server:

   ```bash
   npm run server
   ```

   The API will run on `http://localhost:5000` by default.

---

### 3. Frontend setup (`client/`)

1. In a new terminal, from the project root:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in `client/` with:

   ```bash
   VITE_API_URL=http://localhost:5000
   ```

   This must point to the backend URL you configured in the server `.env`.

4. Start the frontend dev server:

   ```bash
   npm run dev
   ```

5. Open the app in your browser (by default):

   ```text
   http://localhost:5173
   ```

   After login, the main app is served under `/home` with nested routes for the dashboard, map, and reporting pages.

---

## Usage Overview

- **Register / Login**: Create an account and authenticate.
- **Dashboard**: View nearby outages, verify reports, vote, and navigate from cards to the map.
- **Map**: View all reports, filter by date, click markers to see outage details.
- **Report Outage**: Submit new outage reports based on your location.

---

## How to Contribute (Beginner‑Friendly)

Contributions are welcome. Here is a simple, beginner‑friendly workflow:

1. **Fork** this repository to your own GitHub account.
2. **Clone** your fork:

   ```bash
   git clone https://github.com/<your-username>/Load-shedding-tracker-app.git
   cd Load-shedding-tracker-app
   ```

3. **Sync with the original repo (optional but recommended)**  
   If your fork is older, add the original repo as an `upstream` remote and pull the latest changes:

   ```bash
   git remote add upstream https://github.com/<original-owner>/Load-shedding-tracker-app.git
   git checkout main
   git pull upstream main
   git push origin main
   ```

4. **Create a new branch** using the required naming pattern  
   Use: `<github-username>-<feature>` (all lowercase and hyphen‑separated).

   ```bash
   # Example: user "alex" adding a map filter
   git checkout -b alex-map-filter
   ```

5. **Set up and run the project**  
   Follow the steps in **Getting Started** for both `server` and `client` so you can run the app locally.

6. **Make your changes**  
   - Keep changes focused on one feature or bugfix per branch.
   - Write clear, small commits rather than one huge commit.

7. **Run lint / checks** before committing:

   ```bash
   cd client
   npm run lint
   ```

   (Add and run tests as the project grows.)

8. **Commit your changes** with a clear message:

   ```bash
   git add .
   git commit -m "feat: add map filter"   # or "fix: ..."
   ```

9. **Push your branch** to your fork:

   ```bash
   git push origin <github-username>-<feature>
   ```

10. **Open a Pull Request (PR)**  
    - Go to your fork on GitHub.  
    - You’ll see a prompt to open a PR from your branch.  
    - Describe **what** you changed and **why**, and (if relevant) add screenshots or GIFs.

11. **Respond to review comments**  
    - If changes are requested, push new commits to the same branch.  
    - The PR will update automatically.

This is the standard GitHub workflow and is a good foundation for beginners contributing to open‑source projects.

---

## Environment Variables Summary

### Server (`server/.env`)

- `PORT` – Port on which the Express server runs (e.g. `5000`).
- `NODE_ENV` – Environment name (`development`, `production`, etc.).
- `MONGO_LOCAL` – Local MongoDB connection string for development.
- `MONGO_DB_URL` – Remote/Atlas MongoDB connection string.
- `MONGO_USERNAME` – Username for MongoDB Atlas (if using).
- `MONGO_PASSWORD` – Password for MongoDB Atlas (if using).
- `JWT_SECRET` – Secret key for signing JWT tokens.
- `FRONTEND_URL` – Frontend origin used by CORS (e.g. `http://localhost:3000`).

### Client (`client/.env`)

- `VITE_API_URL` – Base URL of the backend API (e.g. `http://localhost:5000`).

---

## Credits

<p align="left">
  <a href="https://github.com/bhpranit08">
    <img
      src="https://github.com/bhpranit08.png"
      alt="Pranit Bhandari"
      width="96"
      height="96"
      style="border-radius:50%; object-fit:cover;"
    />
  </a>
  <br />
  <a href="https://github.com/bhpranit08">
    <img
      src="https://img.shields.io/badge/Primary%20Contributor-blueviolet?style=for-the-badge"
      alt="Primary Contributor"
    />
  </a>
</p>

If you use this project or extend it, please keep the original primary contributor credited and feel free to add yourself to a contributors section in your fork or PR.

