# 🗳️ Indian Election Assistant

**Live Demo: [https://election-assistant-411391941393.us-central1.run.app](https://election-assistant-411391941393.us-central1.run.app)**

An interactive, AI-powered web application designed to educate citizens about the Indian electoral process. From timelines to terminology, the Election Assistant makes democratic procedures accessible and engaging.

---

## 🌟 New & Core Features

### 📊 Election Insights Dashboard
- **Live Seat Tracker**: Real-time visualization of seat distributions for major parties (BJP, Congress, TMC, etc.).
- **Interactive Breakdown**: Clickable "Others" section to view specific regional party performance.
- **Global News Feed**: Integrated election news with robust image fallback handling.
- **Source Redirection**: One-click access to original news sources in a secure new tab.

### 🤖 Interactive Chat Pro
- **GK-Based Intelligence**: Ask questions about the electoral process and get answers based on general knowledge.
- **Casual Interactivity**: Engaging, non-robotic responses that encourage user interaction.
- **Bilingual Brain**: Full conversational support in both English and Hindi.

### 🌐 Seamless Bilingual Support
- **English & Hindi**: Instant website-wide translation via a dedicated language toggle.
- **Contextual Data**: All charts, flashcards, and timelines update dynamically to the selected language.

### 📚 Educational Suite
- **Interactive Timeline**: A visual journey through the phases of an election.
- **Flashcards**: Learn key electoral terms like 'Model Code of Conduct' and 'VVPAT'.
- **Gamified Quiz**: Test your democratic knowledge with instant feedback.

---

## 🏗️ Architecture & Review

### 💎 Code Quality
- **Modular Component Design**: Built with highly reusable React components for maintainability.
- **State Management**: Efficient use of React hooks (`useState`, `useEffect`) for seamless UI updates.
- **Bilingual Engine**: Centralized translation utility (`translations.js`) for scalable language support.

### 🔒 Security
- **Secure Redirection**: All external links use `rel="noopener noreferrer"` to prevent tab-nabbing.
- **Input Sanitization**: Chat inputs are handled carefully to prevent injection.
- **Environment Safety**: Deployed on Google Cloud Run with IAM-controlled permissions.

### ⚡ Efficiency
- **Vite Build System**: Optimized bundling for near-instant load times.
- **Asset Optimization**: Responsive image handling and lightweight Lucide-React icons.
- **Vanilla CSS Performance**: Zero-overhead styling using modern CSS variables and flex/grid.

### ♿ Accessibility
- **Semantic HTML5**: Proper use of `<main>`, `<header>`, `<section>`, and `<a>` tags.
- **High-Contrast Themes**: Professional Light and Dark modes for better readability.
- **Responsive Layout**: Fluid design that adapts perfectly from mobile screens to 4K monitors.

### ☁️ Google Services Integration
- **Google Cloud Run**: Serverless container hosting for high availability.
- **Cloud SDK**: Automated deployment pipeline using `gcloud` CLI.
- **Global Distribution**: Hosted on `us-central1` with edge delivery capabilities.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Modern CSS variables, Flexbox/Grid)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Google Cloud Run + Docker

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Praveeng029/Election-Assistant.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🐳 Docker Support
```bash
docker build -t election-assistant .
docker run -p 8080:80 election-assistant
```

---
Built with ❤️ for democratic awareness.
