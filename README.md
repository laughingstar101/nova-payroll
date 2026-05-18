# Nova Payroll System

A modern payroll management system for companies, built as our final‑year Computer Science diploma project.  
The application allows companies to register, manage employees, and securely handle user authentication.

## Features

- **Company Registration** – Companies can sign up with name, email, and password.  
- **Role‑Based Dashboards** – HR users see an employee management interface; regular employees see a welcome screen.  
- **Employee Management (HR)** – Add multiple employees at once, assign roles (`Part‑time`, `Full‑time`, `HR`).  
  - New employees receive a temporary password and a password‑reset email (via Supabase).  
- **Profile Editing** – Users can update their display name.  
- **Password Reset** – Secure password recovery via email.  
- **Responsive UI** – Built with Tailwind CSS, works on desktop and mobile.  
- **Authentication** – Fully managed by Supabase Auth.  
- **Database Triggers** – Automatically create employee records when a new user signs up (using metadata).

## Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | React 19, React Router DOM, Tailwind CSS        |
| Backend     | Supabase (PostgreSQL, Auth)                     |
| Build Tool  | Vite                                            |
| Language    | JavaScript (ES2022) / JSX                       |

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- npm or yarn
- A Supabase account (free tier works)

### Installation

1. **Clone the repository**
2. **Install dependencies**
```
npm install
```
3. **Run the development server**
```
npm run dev
```
### Database Setup

Execute the SQL in [`database/schema.sql`](database/schema.sql) in your Supabase SQL editor.

### Security Notes
- Passwords are never stored client‑side; Supabase Auth handles hashing.
- Temporary passwords are set to 123456 for demo; in production, generate a random strong password.
- Row Level Security is disabled – the application relies on Supabase Auth sessions and explicit query conditions.

### Testing
- Use a test email service (e.g., Mailhog) to catch password‑reset emails during development.
- Supabase’s local emulator can be used for offline testing.

### License
This project is for educational purposes as part of a diploma final year project. Free to use and modify for learning.
