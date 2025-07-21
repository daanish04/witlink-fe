# WitLink Frontend

This is the frontend for **WitLink**, a real-time multiplayer quiz platform. Built with Next.js, React, and Tailwind CSS.

## Features

- **Real-time Multiplayer**: Join or create quiz rooms and play with friends.
- **Player Registration**: Enter your name to start playing.
- **Room Management**: Create public/private rooms, set topic, difficulty, and max players.
- **Game Flow**:
  - Lobby with room rules and player list.
  - Host controls game start and settings.
  - Real-time question answering with timers.
  - Automatic leaderboard at game end.
- **Socket.io Integration**: Live updates for player actions, scores, and game state.
- **Responsive UI**: Modern, mobile-friendly design using Tailwind CSS.
- **Error Handling**: User-friendly error and status messages.
- **(Optional) Chat**: Chat component included (can be enabled for in-room chat).

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set environment variable for backend URL (if not using default):

   - Create a `.env.local` file:
     ```
     NEXT_PUBLIC_SOCKET_URL=http://localhost:8000/
     ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Lint code

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Socket.io-client](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/docs/primitives/components/dialog)
- [Sonner](https://sonner.emilkowal.ski/) (for toasts)

## Folder Structure

- `app/` – Main pages and routing
- `components/` – UI and game logic components
- `contexts/` – Socket context for real-time features
- `lib/` – Utility functions
- `globals.css` – Global styles
