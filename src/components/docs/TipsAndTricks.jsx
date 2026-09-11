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
        'Use short, clear table aliases (u for users)',
        'Rename columns for clarity',
        'Helps in complex queries',
        'Makes results easier to understand'
      ],
      example: {
        sql: 'SELECT \n  u.name AS customer_name,\n  COUNT(o.id) AS order_count\nFROM users u\nJOIN orders o ON u.id = o.user_id\nGROUP BY u.id;',
        mongodb: 'db.users.aggregate([\n  {\n    $project: {\n      customer_name: "$name",\n      email: "$email"\n    }\n  }\n])'
      },
      level: 'Intermediate',
      color: '#5c1884ff'
    },
    {
      category: 'intermediate',
      title: 'Group Data Effectively',
      description: 'Master GROUP BY to analyze data by categories.',
      details: [
        'Group by one column first',
        'Add aggregate functions (COUNT, SUM, AVG)',
        'Use HAVING to filter groups',
        'Combine with ORDER BY for sorted results'
      ],
      example: {
        sql: 'SELECT \n  category,\n  COUNT(*) as products,\n  AVG(price) as avg_price\nFROM products\nGROUP BY category\nORDER BY products DESC;',
        mongodb: 'db.products.aggregate([\n  {\n    $group: {\n      _id: "$category",\n      products: { $sum: 1 },\n      avgPrice: { $avg: "$price" }\n    }\n  },\n  { $sort: { products: -1 } }\n])'
      },
      level: 'Intermediate',
      color: '#5c1884ff'
    },
    {
      category: 'intermediate',
      title: 'Understand Query Execution Order',
      description: 'Know how databases process your queries for better results.',
      details: [
        'FROM/JOIN happens first',
        'WHERE filters rows',
        'GROUP BY aggregates',
        'HAVING filters groups',
        'SELECT picks columns',
        'ORDER BY sorts results',
        'LIMIT restricts output'
      ],
      level: 'Intermediate',
      color: '#5c1884ff'
    },

    // Advanced Tips
    {
      category: 'advanced',
      title: 'Use Subqueries Wisely',
      description: 'Break complex problems into smaller, manageable queries.',
      details: [
        'Test subquery independently first',
        'Use in WHERE, FROM, or SELECT',
        'Consider JOINs as alternative',
        'Watch for performance impact'
      ],
      example: {
        sql: '-- Find users with above-average spending\nSELECT name, total_spent\nFROM customers\nWHERE total_spent > (\n  SELECT AVG(total_spent)\n  FROM customers\n);',
        mongodb: '// Use aggregation pipeline\ndb.customers.aggregate([\n  {\n    $group: {\n      _id: null,\n      avgSpent: { $avg: "$total_spent" }\n    }\n  }\n])'
      },
      level: 'Advanced',
      color: '#8b5cf6'
    },
    {
      category: 'advanced',
      title: 'Leverage Indexes (Conceptually)',
      description: 'Understand which fields benefit from indexing for faster queries.',
      details: [
        'Index columns used in WHERE',
        'Index foreign key columns',
        'Index columns used in ORDER BY',
        'Don\'t over-index (trade-off)'
      ],
      level: 'Advanced',
      color: '#8b5cf6'
    },
    {
      category: 'advanced',
      title: 'Master Aggregation Pipelines',
      description: 'MongoDB\'s aggregation framework is powerful - learn to chain operations.',
      details: [
        'Each stage transforms data',
        'Order of stages matters',
        '$match early for performance',
        'Use $project to shape output'
      ],
      example: {
        sql: '-- Multi-step analysis\nSELECT \n  category,\n  ROUND(AVG(price), 2) as avg_price,\n  COUNT(*) as count\nFROM products\nWHERE stock > 0\nGROUP BY category\nHAVING COUNT(*) > 3\nORDER BY avg_price DESC;',
        mongodb: 'db.products.aggregate([\n  { $match: { stock: { $gt: 0 } } },\n  {\n    $group: {\n      _id: "$category",\n      avgPrice: { $avg: "$price" },\n      count: { $sum: 1 }\n    }\n  },\n  { $match: { count: { $gt: 3 } } },\n  { $sort: { avgPrice: -1 } }\n])'
      },
      level: 'Advanced',
      color: '#8b5cf6'
    },
    {
      category: 'advanced',
      title: 'Use CASE for Conditional Logic',
      description: 'Add computed columns based on conditions.',
      details: [
        'CASE WHEN for if-then logic',
        'Can use in SELECT or WHERE',
        'Useful for categorization',
        'MongoDB: use $cond in aggregation'
