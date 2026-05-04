# CloudSentinel Setup Guide

This guide will help you set up and run the CloudSentinel Security Scanner on your local machine.

## Prerequisites

- **Python 3.x**
- **Node.js & npm** (only required if you want to modify the React frontend)
- **OpenStack environment** (MicroStack is assumed in the configuration, but you can update the file paths in `scanner.py` if needed)

## 1. Backend Setup (Flask)

The backend handles the actual scanning of the OpenStack configuration files and serves the dashboard.

1. Navigate to the project root directory.
2. Install the required Python packages:
   ```bash
   pip install flask
   ```
3. Open `scanner.py` and ensure the OpenStack config paths in the `CONFIG_FILES` dictionary match your local OpenStack/MicroStack installation.

## 2. Frontend Setup (React / Shadcn UI)

The frontend is a React application built with Vite, Tailwind CSS, and Shadcn UI. The compiled assets are served by Flask. If you want to make changes to the UI, follow these steps:

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. To run the frontend development server (with hot-reloading):
   ```bash
   npm run dev
   ```
4. **Important**: When you are done making changes, you must rebuild the frontend so Flask can serve the new files:
   ```bash
   npm run build
   ```
   *(The `npm run build` command compiles the static UI assets into `frontend/dist`. The Flask app is already configured to serve from this `dist` folder.)*

## 3. Running the Complete Application

To run the full application (Backend API + Production Frontend) without needing a separate Node server:

1. From the project root directory, start the Flask application:
   ```bash
   python3 app.py
   ```
2. Open your web browser and navigate to:
   ```text
   http://127.0.0.1:8080
   ```

You should now see the modern CloudSentinel dashboard, actively fetching and displaying scan results!
