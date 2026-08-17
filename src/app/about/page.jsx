'use client';

import React from 'react';
import { FaHeart, FaLightbulb, FaCode, FaRocket, FaGithub, FaEnvelope, FaBook } from 'react-icons/fa';
import Link from 'next/link';
import '../../styles/Documentation.css'
import '../../styles/About.css'

const Page = () => {
  return (
    <div className="docs-container">
      <div className="docs-content">
        {/* Hero Section - Same as Documentation */}
        <div className="docs-hero">
          <div className="docs-hero-content">
            <div className="hero-badge">
              <FaHeart className="pulse-icon" />
              <span>Passion Project</span>
            </div>
            <h1 className="docs-title">
              <FaBook className="title-icon" />
              About QueryLab
            </h1>
            <p className="docs-subtitle">
              Making database learning accessible to everyone—no installation required, no barriers, just pure learning in your browser.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="docs-main">
          <div className="docs-section">
            
            {/* The Story */}
            <h2 className="section-title">The Story Behind QueryLab</h2>
            
            <div className="info-card">
              <h3>
                <FaLightbulb style={{ marginRight: '10px', color: '#f59e0b' }} />
                The Problem
              </h3>
              <p>
                As a developer who mentored students, I witnessed the same barrier repeatedly: before anyone could write their first SQL query, they needed to install MySQL, PostgreSQL, or MongoDB. Troubleshoot connection issues. Configure environments. Deal with compatibility problems.
              </p>
              <p>
                For many students, this initial setup became an insurmountable hurdle. They wanted to learn databases, not become system administrators.
              </p>
            </div>

            <div className="info-card">
              <h3>
                <FaRocket style={{ marginRight: '10px', color: '#10b981' }} />
                The Solution
              </h3>
              <p>
                What if learning databases could be as simple as opening a website? No installation, no configuration, no barriers—just pure learning.
              </p>
              <p>
                QueryLab brings SQL (SQLite) and MongoDB directly to your browser. Click a button, write a query, see results instantly. That's it.
              </p>
            </div>

            <div className="info-card">
              <h3>
                <FaCode style={{ marginRight: '10px', color: '#8b5cf6' }} />
                The Execution
              </h3>
              <p>
                Built with Next.js, sql.js, and MongoDB Atlas, QueryLab runs SQLite entirely in your browser while providing cloud-based MongoDB sessions. Each user gets an isolated environment that persists across page refreshes.
              </p>
              <p>
                AI-powered help from Google Gemini acts as your personal tutor, explaining errors and suggesting fixes when you get stuck.
              </p>
            </div>

            {/* Why This Matters */}
            <h2 className="section-title" style={{ marginTop: '3rem' }}>Why This Matters</h2>
            
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-number">01</div>
                <h4>Accessibility</h4>
                <p>
                  Anyone with internet access can practice databases. No powerful computer required. No admin privileges needed.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-number">02</div>
                <h4>Immediate Feedback</h4>
                <p>
                  Write query → Execute → See results. The learning loop is measured in seconds, not hours.
