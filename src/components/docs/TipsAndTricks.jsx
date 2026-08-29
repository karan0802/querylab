'use client';

import React, { useState } from 'react';
import { FaLightbulb, FaRocket, FaCode, FaDatabase, FaBolt, FaGraduationCap, FaCheckCircle } from 'react-icons/fa';
import '../../styles/TipsAndTricks.css'

const TipsAndTricks = ({ setActiveTab }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Tips', icon: <FaLightbulb /> },
    { id: 'beginner', name: 'Beginner', icon: <FaGraduationCap /> },
    { id: 'intermediate', name: 'Intermediate', icon: <FaCode /> },
    { id: 'advanced', name: 'Advanced', icon: <FaRocket /> },
    { id: 'performance', name: 'Performance', icon: <FaBolt /> }
  ];

  const tips = [
    // Beginner Tips
    {
      category: 'beginner',
      title: 'Start with Simple Queries',
      description: 'Master the basics before moving to complex operations. Build your understanding step by step.',
      details: [
        'Begin with SELECT * to see all data',
        'Add WHERE clauses one at a time',
        'Practice ORDER BY and LIMIT',
        'Understand each part before combining'
      ],
      example: {
        sql: 'SELECT * FROM users LIMIT 10;',
        mongodb: 'db.users.find().limit(10)'
      },
      level: 'Beginner',
      color: '#4a14a0ff'
    },
    {
      category: 'beginner',
      title: 'Always View the Schema First',
      description: 'Understanding the database structure is crucial before writing any queries.',
      details: [
        'Click "Show Schema" before querying',
        'Note table/collection names',
        'Understand column/field relationships',
        'Check data types'
      ],
      level: 'Beginner',
      color: '#4a14a0ff'
    },
    {
      category: 'beginner',
      title: 'Use Sample Queries as Templates',
      description: 'Learn from working examples and modify them for your needs.',
      details: [
        'Click "Load Sample Queries" button',
        'Run the sample first to see results',
        'Modify one part at a time',
        'Save successful queries for reference'
      ],
      level: 'Beginner',
      color: '#4a14a0ff'
    },
    {
      category: 'beginner',
      title: 'Test with Small Datasets',
      description: 'Use LIMIT to work with manageable result sets while learning.',
      details: [
        'Add LIMIT 10 to SQL queries',
        'Use .limit(10) in MongoDB',
        'Faster execution during testing',
        'Easier to review results'
      ],
      example: {
        sql: '-- Always limit while testing\nSELECT * FROM orders\nWHERE amount > 100\nLIMIT 10;',
        mongodb: '// Limit results for testing\ndb.orders.find({ \n  amount: { $gt: 100 } \n}).limit(10)'
      },
      level: 'Beginner',
      color: '#4a14a0ff'
    },

    // Intermediate Tips
    {
      category: 'intermediate',
      title: 'Master JOINs Progressively',
      description: 'Start with INNER JOIN, then move to LEFT/RIGHT joins as you understand the concepts.',
      details: [
        'INNER JOIN: matching records only',
        'LEFT JOIN: all from left table',
        'Practice with 2 tables first',
        'Then try multi-table joins'
      ],
      example: {
        sql: '-- Start with INNER JOIN\nSELECT u.name, o.product\nFROM users u\nINNER JOIN orders o \n  ON u.id = o.user_id;',
        mongodb: '// Use aggregation lookup\ndb.orders.aggregate([\n  {\n    $lookup: {\n      from: "users",\n      localField: "user_id",\n      foreignField: "_id",\n      as: "user_info"\n    }\n  }\n])'
      },
      level: 'Intermediate',
      color: '#5c1884ff'
    },
    {
      category: 'intermediate',
      title: 'Use Meaningful Aliases',
      description: 'Make your queries readable with clear table and column aliases.',
      details: [
