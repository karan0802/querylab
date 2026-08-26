'use client';

import React, { useState } from 'react';
import CollapsibleSection from './CollapsibleSection';

const SQLGuide = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="docs-section">
      <h2 className="section-title">SQL (SQLite) Guide</h2>

      <div className="info-card">
        <h3>SQL Basics</h3>
        <p>
          SQL (Structured Query Language) is the standard language for managing relational databases. 
          In QueryLab, we use SQLite, a lightweight database engine perfect for learning.
        </p>
      </div>

      {/* SELECT Queries */}
      <CollapsibleSection
        id="sql-select"
        title="SELECT - Retrieving Data"
        isExpanded={expandedSections['sql-select']}
        toggle={toggleSection}
      >
        <p>The SELECT statement retrieves data from one or more tables.</p>
        
        <h4>Basic SELECT</h4>
        <div className="code-block">
          <pre>{`-- Select all columns from users table
SELECT * FROM users;

-- Select specific columns
SELECT name, email FROM users;

-- Select with alias
SELECT name AS full_name, email AS user_email FROM users;`}</pre>
        </div>

        <h4>WHERE Clause</h4>
        <div className="code-block">
          <pre>{`-- Filter by condition
SELECT * FROM users WHERE age > 30;

-- Multiple conditions
SELECT * FROM users WHERE age > 25 AND name LIKE 'A%';

-- Using IN operator
SELECT * FROM products WHERE category IN ('Electronics', 'Furniture');`}</pre>
        </div>

        <h4>ORDER BY</h4>
        <div className="code-block">
          <pre>{`-- Sort ascending (default)
SELECT * FROM posts ORDER BY views;

-- Sort descending
SELECT * FROM posts ORDER BY views DESC;

-- Multiple columns
SELECT * FROM users ORDER BY age DESC, name ASC;`}</pre>
        </div>

        <h4>LIMIT</h4>
        <div className="code-block">
          <pre>{`-- Get top 5 users
SELECT * FROM users LIMIT 5;

-- Pagination (skip first 10, get next 5)
SELECT * FROM users LIMIT 5 OFFSET 10;`}</pre>
        </div>
      </CollapsibleSection>

      {/* JOIN Operations */}
      <CollapsibleSection
        id="sql-joins"
        title="JOIN - Combining Tables"
        isExpanded={expandedSections['sql-joins']}
        toggle={toggleSection}
      >
        <p>JOINs combine rows from two or more tables based on related columns.</p>

        <h4>INNER JOIN</h4>
        <div className="code-block">
          <pre>{`-- Get users with their orders
SELECT u.name, o.product, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;`}</pre>
        </div>

        <h4>LEFT JOIN</h4>
        <div className="code-block">
          <pre>{`-- Get all users, including those without orders
SELECT u.name, o.product, o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;`}</pre>
        </div>

        <h4>Multiple JOINs</h4>
        <div className="code-block">
          <pre>{`-- Join posts with comments
SELECT p.title, c.author, c.comment
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
ORDER BY p.views DESC;`}</pre>
        </div>
      </CollapsibleSection>

