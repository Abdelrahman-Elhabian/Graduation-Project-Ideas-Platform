# 🎓 GradIdeas - Graduation Project Ideas Platform

A modern SaaS-style web platform for university students to create teams, share graduation project ideas, vote on concepts, and collaborate — built with React.js, Material UI, and Firebase.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![MUI](https://img.shields.io/badge/MUI-6-007FFF?logo=mui)
![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?logo=firebase)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)

---

## ✨ Features

### 🔐 Authentication
- Email/password registration and login
- Firebase Authentication integration
- Protected routes for authenticated users
- Global auth state via Context API

### 👥 Team System
- Create teams with auto-generated 6-character Team IDs
- Join existing teams using Team ID
- Team dashboard with member list
- Leave team functionality

### 💡 Ideas System
- Create project ideas with title, description, technologies, and difficulty
- Beautiful responsive card layout
- Full idea detail page
- Delete ideas (creator only)

### 👍 Voting System
- Like/unlike ideas (one vote per user per idea)
- Real-time likes count
- Sort ideas by most liked
- Duplicate vote prevention

### 🔍 Search & Filtering
- Search ideas by title/description
- Filter by technology
- Filter by difficulty level
- Sort by newest, oldest, or most liked

### 🎨 UI/UX
- Premium dark theme with purple/cyan accents
- Glassmorphism card effects
- Animated page transitions (Framer Motion)
- Responsive sidebar dashboard layout
- Loading states and empty states
- Snackbar notifications
- Confirmation dialogs

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ConfirmDialog.jsx
│   ├── EmptyState.jsx
│   ├── IdeaCard.jsx
│   ├── LoadingScreen.jsx
│   └── PageHeader.jsx
├── context/             # React Context providers
│   ├── AuthContext.jsx
│   └── SnackbarContext.jsx
├── firebase/            # Firebase configuration
│   └── config.js
├── layouts/             # Layout components
│   └── DashboardLayout.jsx
├── pages/               # Page components
│   ├── AddIdeaPage.jsx
│   ├── CreateTeamPage.jsx
│   ├── HomePage.jsx
│   ├── IdeaDetailsPage.jsx
│   ├── JoinTeamPage.jsx
│   ├── LoginPage.jsx
│   ├── NotFoundPage.jsx
│   ├── ProfilePage.jsx
│   ├── RegisterPage.jsx
│   └── TeamDashboard.jsx
├── routes/              # Routing configuration
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── services/            # Firebase service functions
│   ├── authService.js
│   ├── ideaService.js
│   └── teamService.js
├── utils/               # Utilities and theme
│   ├── helpers.js
│   └── theme.js
├── App.jsx
├── index.css
└── main.jsx
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- A Firebase project

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd graduation-project-ideas
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. **Enable Authentication:**
   - Go to Authentication > Sign-in method
   - Enable **Email/Password** provider
4. **Create Firestore Database:**
   - Go to Firestore Database > Create database
   - Start in **test mode** (update rules later)
5. **Get Config:**
   - Go to Project Settings > General > Your apps
   - Click "Add app" > Web
   - Copy the Firebase config object

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Deploy Firestore Rules

Copy the contents of `firestore.rules` to your Firebase Console:
- Firestore Database > Rules > Paste > Publish

---

## 🗄️ Database Structure

```
Firestore Collections:

├── users/
│   └── {userId}
│       ├── uid: string
│       ├── email: string
│       ├── displayName: string
│       ├── teamId: string | null
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── teams/
│   └── {teamId}  (6-char alphanumeric)
│       ├── teamId: string
│       ├── name: string
│       ├── ownerId: string
│       ├── ownerName: string
│       ├── members: array
│       │   └── { uid, displayName, role, joinedAt }
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
└── ideas/
    └── {ideaId}  (auto-generated)
        ├── title: string
        ├── description: string
        ├── technologies: array<string>
        ├── difficulty: string (beginner|intermediate|advanced|expert)
        ├── creatorId: string
        ├── creatorName: string
        ├── teamId: string
        ├── likes: array<userId>
        ├── likesCount: number
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

---

## 🌐 Firebase Hosting Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting
# Select your project
# Set public directory to: dist
# Configure as SPA: Yes
# Set up automatic builds: No

# Build for production
npm run build

# Deploy
firebase deploy --only hosting
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite 8 | Build Tool |
| Material UI 6 | Component Library |
| React Router 7 | Client-side Routing |
| Firebase Auth | Authentication |
| Cloud Firestore | Database |
| Framer Motion | Animations |
| Context API | State Management |

---

## 📄 License

This project is for educational purposes. MIT License.
