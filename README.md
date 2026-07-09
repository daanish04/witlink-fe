# 🎮 WitLink - Real-time Multiplayer Quiz Game

Live trivia battles with AI-generated questions and real-time scoring, built with Next.js, Socket.io, and Gemini.  
Think _Skribbl.io_, but for quizzes.

[🚀 Play Live](https://wit-link.vercel.app/) \
[🛠 Backend Repo](https://github.com/daanish04/witlink-be)

---

## 🎮 Features

- ✅ Real-time multiplayer gameplay (Socket.io)
- 🧠 Questions generated on-the-fly by **Google Gemini AI**
- 📊 Live leaderboard, timer, chat, and host controls
- 🧑‍🤝‍🧑 Room-based system with shareable room codes
- 🔁 Session Persistence and Connection Resilience with a 30 second grace period
- ✨ Clean, responsive UI with TailwindCSS + RadixUI

---

## 🧩 Tech Stack

### Frontend

- [Next.js 15](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.io-client](https://socket.io/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

### Backend (external repo)

- Node.js + Express
- Socket.io
- In-memory game state
- Gemini API integration

🔗 **Backend code:** [🛠 WitLink Backend](https://github.com/daanish04/witlink-be)

---

## 📁 Project Structure

```
witLink/
├── client/                # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   └── lib/               # Utility functions
├── server/
│   ├── index.js           # Node.js backend
│   ├── socketHandlers.js  # Socket.io event handlers
│   ├── rooms.js           # Room management
│   ├── questions.js       # AI question generation
│   ├── topics.js          # Quiz topics list
│   └── routes.js          # REST API routes
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- WitLink backend server running (or deployed backend URL)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set environment variables**
   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_SOCKET_URL=http://localhost:8000/
   # For production, use your deployed backend URL
   # NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com/
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

---

## ✨ Inspiration

Built to learn Socket.io and to recreate the chaotic fun of Skribbl.io, but for trivia.  
No drawing skills required — just fast fingers and quick thinking.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
