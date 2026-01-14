# Samuhik Whiteboard: Open-Source Real-time Whiteboard

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)
![WebSockets](https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Rough.js](https://img.shields.io/badge/Rough.js-f39c12?style=for-the-badge)

A high-performance, self-hosted collaborative whiteboard inspired by Excalidraw. This application enables multiple users to sketch, diagram, and brainstorm in a shared virtual space with a beautiful "hand-drawn" aesthetic—without the subscription fees.

The project leverages a **React-based Canvas engine** on the frontend and a **Python-powered WebSocket orchestrator** on the backend to ensure sub-100ms latency for stroke synchronization and multi-user presence.

## Core MVP Features

- **Hand-Drawn Aesthetics**: Integration with `Rough.js` to provide that organic, sketchy feel for rectangles, ellipses, lines, and arrows.
- **Real-time Multi-user Collaboration**: Low-latency stroke synchronization. See your teammates drawing in real-time.
- **Live Cursors**: Track the movement of all active collaborators with labeled "ghost cursors."
- **Infinite Canvas**: Support for panning and zooming across an unbounded workspace.
- **State Persistence**: Automatic saving of board states using a hybrid approach of LocalStorage (client-side) and PostgreSQL (server-side).
- **Export Capabilities**: Save your diagrams as PNG or SVG directly from the browser.

## Tech Stack & Tooling

### Frontend (The Canvas)

- **React + Vite**: For a lightning-fast development cycle and UI rendering.
- **Rough.js**: The engine behind the "Excalidraw" look.
- **Zustand/Redux**: To manage the complex, nested state of drawing elements.
- **Yjs (Optional/Recommended)**: A CRDT (Conflict-free Replicated Data Type) library to handle seamless state merging without merge conflicts.

### Backend (The Sync Engine)

- **Python (FastAPI)**: A modern, high-performance web framework for handling WebSocket connections.
- **WebSockets (`WebSockets` / `FastAPI.WebSocket`)**: The primary protocol for bi-directional, real-time communication.
- **Redis**: Acts as a Pub/Sub message broker to synchronize data across multiple backend worker instances.
- **PostgreSQL**: To store persistent JSON blobs of the whiteboard elements.

## System Architecture

The project utilizes a **State-Broadcast Architecture** to ensure all clients stay in sync:

1.  **Stroke Interaction**: As a user draws on the React canvas, the coordinates are captured and converted into a JSON-based element model (e.g., `{type: 'rect', x: 10, y: 10, color: '#000'}`).
2.  **The WebSocket Pipeline**: The client pushes "Delta" updates (small changes) to the Python backend via a persistent WebSocket connection.
3.  **Conflict Resolution (The Brain)**: The Python server receives the update. To prevent "last-writer-wins" bugs where users overwrite each other, we implement a **CRDT (Conflict-free Replicated Data Type)** logic.
4.  **Broadcast**: The server broadcasts the validated update to all other connected clients in the same "room."
5.  **Re-rendering**: The receiving React clients inject the new element into their local state, and `Rough.js` re-paints the canvas instantly.

### Why Python for WebSockets?

While Node.js is common for WebSockets, Python (FastAPI/Starlette) offers superior readability and high performance through `asyncio`. It allows us to easily integrate future AI features (like "sketch-to-image" using Stable Diffusion or diagram-to-code using LLMs) which are predominantly built in the Python ecosystem.

## Planned Directory Structure

```text
.
├── client/                 # React (Vite) Frontend
│   ├── src/
│   │   ├── components/     # Toolbar, Canvas, UserCursors
│   │   ├── hooks/          # useSocket, useCanvas, useHistory (Undo/Redo)
│   │   ├── store/          # Zustand state management
│   │   └── utils/          # Rough.js rendering logic & math helpers
├── server/                 # Python (FastAPI) Backend
│   ├── app/
│   │   ├── main.py         # Entry point & WebSocket routes
│   │   ├── manager.py      # Connection Manager (Room logic)
│   │   ├── schemas.py      # Pydantic models for drawing elements
│   │   └── database.py     # Postgres/SQLAlchemy setup
│   ├── requirements.txt
│   └── .env
└── docker-compose.yml      # Orchestration for Redis, DB, and Apps
```

## Setup & Roadmap

### Phase 1: The Engine (Current)

- [ ] Implement basic canvas drawing (Line, Rect).
- [ ] Integrate Rough.js for styling.
- [ ] Local state management for "Undo/Redo".

### Phase 2: The Bridge

- [ ] Set up FastAPI WebSocket server.
- [ ] Implement "Room" logic (multiple users on one board).
- [ ] Real-time cursor broadcasting.

### Phase 3: The Vault

- [ ] PostgreSQL integration for saving boards.
- [ ] User authentication and private boards.
- [ ] Export to PNG/SVG feature.

---

### Getting Started

_(Instructions will be updated as the repository matures)_

1. **Clone & Install Client**
   ```bash
   cd client && npm install
   ```
2. **Setup Python Environment**
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. **Launch**
   - Run Server: `uvicorn app.main:app --reload --port 8000`
   - Run Client: `npm run dev`

## 🤝 How to Contribute

We welcome contributions from all team members! To keep our project organized and our `main` branch stable, please follow this workflow:

### 1. Identify or Create an Issue

Before writing any code, check the **Issues** tab to see what needs to be done.

- **Found a new feature?** Create a new issue, describe the feature, and add the `enhancement` label.
- **Found a bug?** Create an issue with the `bug` label and steps to reproduce it.

### 2. Claim Your Task

Once an issue exists, "self-assign" it to yourself.

- This lets the rest of the team know you are working on it so we don't duplicate effort.
- If you aren't sure how to solve it yet, use the issue comments to discuss ideas or ask for help!

### 3. Create a Feature Branch

**Never commit directly to the `main` branch.** Always create a new branch for your work.

- **Branch Naming Convention:** Use a clear prefix followed by a short description.
  - `feature/add-login-logic`
  - `bugfix/fix-header-alignment`
  - `docs/update-readme`
- **Command:** `git checkout -b feature/your-feature-name`

### 4. Commit and Push

As you work, make small, frequent commits with clear messages.

- **Commit Message Tip:** Start with a verb (e.g., "Add," "Fix," "Update") and explain _what_ was changed.
- **Pushing:** When you're ready to share your progress, push your branch to GitHub:
  - `git push origin feature/your-feature-name`

### 5. Open a Pull Request (PR)

When your feature is ready (or even if it's a "Work in Progress"), open a Pull Request against the `main` branch.

- **Link the Issue:** In the PR description, write `Closes #12` (replace 12 with your issue number). This automatically closes the issue when the PR is merged.
- **Request a Review:** Tag at least one other team member to look over your code. This is a great way for us to learn from each other!

### 6. Merge and Cleanup

Once the PR is approved and passes any tests:

1. Merge the PR into `main`.
2. Delete the feature branch from GitHub to keep the repository clean.
3. Celebrate—your contribution is live! 🎉

---

### 💡 Pro-Tips for Our Team:

- **Keep it Small:** It is much easier for us to review a 50-line PR than a 500-line one.
- **Sync Often:** Before starting new work, run `git pull origin main` to make sure you have the latest code.
- **Don't be afraid to break things:** That’s what branches are for! Just make sure it works before you ask for a merge.

---

### Why these tweaks help your group:

- **Labeling:** Using `enhancement` vs `bug` helps you at the end of the semester when you have to document what you actually _did_ for the project.
- **Closes #X:** This is a "magic" GitHub keyword. It saves you the manual step of closing issues and keeps your project board looking professional.
- **Branch Prefixes:** Prefixes like `feature/` make the branch list much easier to read when 4 people are all pushing at once.
- **Review Process:** Even if you trust each other, having one other person "LGTM" (Look Good To Me) your code prevents accidental "oops" moments from breaking the main site/app right before a demo.
