# 🗄️ QueryLab

**QueryLab** is an interactive web-based platform for learning and practicing SQL (SQLite) and MongoDB queries without any local installation. Perfect for students, developers, and anyone looking to master database querying skills.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)

---

## 🆕 What's New

**Latest Updates:**
- MongoDB integration with session isolation
- AI-powered error explanations with Gemini
- Automatic session cleanup (24-hour retention)
- Responsive design for mobile devices
- Monaco Editor for better code editing experience

**Coming Soon:**
- 📚 Comprehensive documentation
- 🗄️ Database overview pages
- 🎯 Interactive tutorials
- 📊 Query performance metrics

---

![QueryLab Screenshot](https://via.placeholder.com/800x400?text=QueryLab+Screenshot)

---

## 📸 Screenshots

### Query Interface
![Query Interface](./public/homePage.png)

### Schema Visualization
![Schema View](./public/schema.png)

### AI-Powered Help
![AI Help](/public/ai-response.png)

---

## ✨ Features

### 🎓 **Educational Focus**
- **Zero Installation Required** - Practice SQL and MongoDB directly in your browser
- **Sample Databases** - Pre-loaded datasets for Users & Orders, Blog, and E-commerce scenarios
- **Isolated Sessions** - Each user gets their own isolated database environment
- **Real-Time Execution** - See query results instantly
- **Schema Visualization** - View database structure before writing queries

### 💾 **Dual Database Support**
- **SQL (SQLite)** - Runs entirely in the browser using sql.js
- **MongoDB** - Cloud-based with session isolation for multi-user support

### 🤖 **AI-Powered Help**
- **Gemini Integration** - Get intelligent explanations for query errors
- **Error Analysis** - Understand what went wrong and how to fix it
- **Learning Assistant** - Helps students debug and improve their queries

### 🎨 **Modern UI/UX**
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Code Editor** - Syntax highlighting with Monaco Editor
- **Clean Interface** - Intuitive navigation and clear result display

### 🔄 **Data Management**
- **Auto-Cleanup** - Old sessions automatically deleted after 24 hours
- **Session Persistence** - Your data persists across page refreshes
- **Reset Option** - Start fresh with new sample data anytime
- **Custom Mode** - Create your own tables and collections

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- MongoDB Atlas account (free tier)
- (Optional) Gemini API key for AI help feature

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/manavbansal1/query-lab.git
   cd query-lab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Atlas Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   
   # Gemini AI (Optional)
   GEMINI_API_KEY=your_gemini_api_key
   
   # EmailJS (Optional - for contact form)
