# ElevateCV - Modern Premium Resume Builder

ElevateCV is a visually stunning, responsive, and secure MERN stack web application designed to help professionals build, manage, and export high-fidelity resumes in real time. 

Featuring interactive split-screen layouts, instant template switching, persistent dark/light styling, and debounced cloud autosaving, ElevateCV simplifies resume building.

---

## Key Features

- **Secure User Sessions**: Registration and login using JWT (JSON Web Tokens) with secure client-side session caching and bcrypt password hashing.
- **Dynamic Split-Screen Workspace**: Side-by-side editing interface where you fill details on the left and see them instantly rendered on the right.
- **Pulsing Autosave Sync**: A debounced auto-save hook listens to your form edits, waiting for a 2000ms pause in typing before safely uploading changes to MongoDB.
- **Multiple Premium Templates**: Switch layout styles on the fly without losing any entered details:
  - **Modern Professional**: Balanced timeline layout with deep indigo accents.
  - **Elegant Minimal**: Generous spacing and clean typography.
  - **Creative Sidebar**: High-contrast sidebar paired with a clean work history sheet.
  - **Classic Executive**: Centered classic serif template representing traditional corporate profiles.
- **Scale-to-Fit Preview**: Advanced resizing engine dynamically scales the standard A4 document wrapper so it fits perfectly on all monitor widths without breaking font sizes or layout lines.
- **Vector-Perfect PDF Export**: Uses specialized `@media print` style overrides that hide interface buttons and scale the preview layout to exactly 100% dimensions, letting the browser's built-in print engine output high-resolution vectors.
- **Global Theme Toggler**: Persistent dark-mode styling (sleek deep slates with violet glow highlights) and light-mode styling (clean card layouts with elegant shadows).

---

## Technology Stack

### Frontend
- **Core**: React.js SPA (scaffolded via Vite)
- **Styling**: Tailwind CSS v3
- **Navigation**: React Router Dom v6
- **API Client**: Axios (configured with automated JWT headers and base URL settings)
- **Icons**: Lucide React

### Backend
- **Server Framework**: Node.js & Express
- **Database Mongoose ODM**: MongoDB (local instance connection or Mongo Atlas)
- **Security Headers & Logging**: Helmet & Morgan
- **Session Authentication**: JWT & BcryptJS

---

## Project Directory Structure

```text
c:\collage\
├── backend\
│   ├── config\db.js         # MongoDB connection helper
│   ├── middleware\auth.js   # JWT verification middleware
│   ├── models\User.js       # User account schema
│   ├── models\Resume.js     # Resume sub-document schema
│   ├── routes\auth.js       # Register, Login, Profile APIs
│   ├── routes\resumes.js    # Secure CRUD controller APIs
│   ├── .env                 # Port, JWT secret, and database URL config
│   ├── package.json         # Node dependency file
│   └── server.js            # Express server entry point
│
├── frontend\
│   ├── index.html           # HTML5 entry & SEO tags
│   ├── tailwind.config.js   # Custom primary colors & typography
│   ├── postcss.config.js    # PostCSS bundler plugins
│   ├── package.json         # Vite dev/production package list
│   └── src\
│       ├── main.jsx         # App initialization anchor
│       ├── index.css        # Global classes, scrollbars, print rules
│       ├── App.jsx          # Route coordinator & protected route guard
│       ├── context\         # Theme and Authentication Providers
│       ├── components\      # Navbar, Accordion Forms, Auto-scaler
│       ├── pages\           # Landing Page, Login, Register, Dashboard, Editor
│       └── templates\       # Modern, Minimal, Creative, Professional styles
│
└── .gitignore               # Excludes secrets, builds, and node_modules
```

---

## Local Development Guide

To start this application on your local machine, follow these steps:

### Prerequisites
- Make sure [Node.js](https://nodejs.org/) is installed.
- Ensure a local instance of [MongoDB](https://www.mongodb.com/try/download/community) is running (defaulting to `mongodb://localhost:27017`), or obtain a MongoDB Atlas connection string.

### Step 1: Initialize the Backend Server
Navigate to the `backend` folder, create a `.env` file from the settings, and start the development server:
```bash
cd backend
npm run dev
```
*The server will boot up and connect to your database:*
`MongoDB Connected: 127.0.0.1`  
`Server running in development mode on port 5000`

### Step 2: Initialize the Frontend Server
Open another terminal panel, navigate to the `frontend` folder, and start the Vite dev bundle:
```bash
cd frontend
npm run dev
```
*The development environment starts in milliseconds:*
`➜  Local:   http://localhost:5173/`

### Step 3: Run and Experience
1. Open `http://localhost:5173` in your browser.
2. Sign up on the landing page, and create a resume document from your dashboard workspace.
3. Edit details, see changes sync in real-time, swap template designs, and click "Export PDF" to download a professional physical copy.
