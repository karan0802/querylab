'use client';

import React, { useState } from 'react';
import { FaDatabase, FaShoppingCart, FaBlog, FaUsers, FaChartLine, FaCode } from 'react-icons/fa';

const Examples = () => {
  const [activeExample, setActiveExample] = useState('users');

  const examples = {
    users: {
      icon: <FaUsers />,
      title: 'Users & Orders',
      description: 'Master JOINs and aggregations with customer and order data',
      color: '#531294',
      scenarios: [
        {
          title: 'Find High-Value Customers',
          description: 'Identify customers who have spent more than $500',
          sql: `-- Find customers with total spending > $500
SELECT 
  u.name,
  u.email,
  COUNT(o.id) as total_orders,
  SUM(o.amount) as total_spent
FROM users u
INNER JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name, u.email
HAVING SUM(o.amount) > 500
ORDER BY total_spent DESC;`,
          mongodb: `// Find users who spent over $500
db.orders.aggregate([
  {
    $group: {
      _id: "$user_id",
      totalSpent: { $sum: "$amount" },
      orderCount: { $sum: 1 }
    }
  },
  { $match: { totalSpent: { $gt: 500 } } },
  { $sort: { totalSpent: -1 } }
])`,
          result: 'Returns: 2 customers (Alice: $1,525.49, Bob: $164.99)'
        },
        {
          title: 'Recent Orders Report',
          description: 'Get latest 5 orders with customer details',
          sql: `-- Most recent orders with customer info
SELECT 
  o.id,
  u.name as customer_name,
  o.product,
  o.amount,
  o.order_date
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.order_date DESC
LIMIT 5;`,
          mongodb: `// Get recent orders with details
db.orders.find()
  .sort({ order_date: -1 })
  .limit(5)

// Then lookup user details
db.users.find({ 
  _id: { $in: [retrieved_user_ids] } 
})`,
          result: 'Returns: Latest 5 orders with customer names'
        },
        {
          title: 'Customer Purchase Analysis',
          description: 'Average order value per customer',
          sql: `-- Average order value by customer
SELECT 
  u.name,
  COUNT(o.id) as num_orders,
  AVG(o.amount) as avg_order_value,
  MIN(o.amount) as min_purchase,
  MAX(o.amount) as max_purchase
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
ORDER BY avg_order_value DESC;`,
          mongodb: `// Calculate customer statistics
db.orders.aggregate([
  {
    $group: {
      _id: "$user_id",
      avgOrderValue: { $avg: "$amount" },
      minPurchase: { $min: "$amount" },
      maxPurchase: { $max: "$amount" },
      orderCount: { $sum: 1 }
    }
  },
  { $sort: { avgOrderValue: -1 } }
])`,
          result: 'Returns: Statistics for each customer'
        }
      ]
    },
    blog: {
      icon: <FaBlog />,
      title: 'Blog Platform',
      description: 'Work with posts, comments, and engagement metrics',
      color: '#6b1bb8',
      scenarios: [
        {
          title: 'Popular Posts with Engagement',
          description: 'Posts with highest views and comment counts',
          sql: `-- Top posts by engagement
SELECT 
  p.title,
  p.author,
  p.views,
  COUNT(c.id) as comment_count,
  (p.views + COUNT(c.id) * 10) as engagement_score
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
GROUP BY p.id, p.title, p.author, p.views
ORDER BY engagement_score DESC
LIMIT 5;`,
          mongodb: `// Find popular posts with comments
db.posts.find({ 
  views: { $gt: 1000 } 
})
.sort({ views: -1 })

// Then count comments per post
db.comments.aggregate([
  {
    $group: {
      _id: "$post_id",
      commentCount: { $sum: 1 }
    }
  },
  { $sort: { commentCount: -1 } }
])`,
          result: 'Returns: Top 5 posts by engagement'
        },
        {
          title: 'Author Performance Dashboard',
          description: 'Statistics per author',
          sql: `-- Author statistics
SELECT 
  p.author,
  COUNT(p.id) as total_posts,
  SUM(p.views) as total_views,
  AVG(p.views) as avg_views_per_post,
  COUNT(DISTINCT c.id) as total_comments
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
GROUP BY p.author
ORDER BY total_views DESC;`,
          mongodb: `// Author performance metrics
db.posts.aggregate([
  {
    $group: {
      _id: "$author",
      totalPosts: { $sum: 1 },
      totalViews: { $sum: "$views" },
      avgViews: { $avg: "$views" }
    }
  },
  { $sort: { totalViews: -1 } }
])`,
          result: 'Returns: Stats for each author'
        },
        {
          title: 'Trending Content',
          description: 'Posts with growing engagement',
          sql: `-- Posts with high comment-to-view ratio
SELECT 
  p.title,
  p.views,
  COUNT(c.id) as comments,
  ROUND(COUNT(c.id) * 100.0 / p.views, 2) as engagement_rate
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
WHERE p.views > 0
GROUP BY p.id, p.title, p.views
HAVING COUNT(c.id) > 0
ORDER BY engagement_rate DESC;`,
          mongodb: `// Find highly engaged posts
db.posts.aggregate([
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "post_id",
      as: "comments"
    }
  },
  {
    $project: {
      title: 1,
      views: 1,
      commentCount: { $size: "$comments" },
      engagementRate: {
        $multiply: [
          { $divide: [{ $size: "$comments" }, "$views"] },
          100
        ]
      }
    }
  },
  { $sort: { engagementRate: -1 } }
])`,
          result: 'Returns: Posts with best engagement rates'
        }
      ]
    },
    ecommerce: {
      icon: <FaShoppingCart />,
      title: 'E-commerce Store',
      description: 'Analyze products, inventory, and customer behavior',
      color: '#8b5cf6',
      scenarios: [
        {
          title: 'Inventory Alert System',
          description: 'Find products that need restocking',
          sql: `-- Low stock products alert
SELECT 
  name,
  category,
  price,
  stock,
