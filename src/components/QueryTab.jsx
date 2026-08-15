'use client'
import { v4 as uuidv4 } from 'uuid';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useState, useEffect, useMemo } from 'react'
import '../styles/QueryTab.css';
import { sampleQueries, databaseOptions } from '@/data/SampleQueries';
import { FaPlay, FaTrash, FaDatabase, FaEye, FaRobot, FaTimes } from 'react-icons/fa';
import { createSampleDatabase, createEmptyDatabase, executeQuery, getDatabaseSchema } from "@/lib/sqlite-manager";
import Editor from "@monaco-editor/react";
import '../styles/AiResponse.css';

const QueryTab = () => {
    
    const [ dbMode, setDbMode ] = useState("sql"); // sql or mongodb   default: sql
    const [ currentDatabase, setCurrentDatabase ] = useState('users');  // users default
    const [ mongoConnected, setMongoConnected ] = useState(true);   // State to track if the db is connected
    const [ showSchema, setShowSchema ] = useState(false); // state to check if the user wants to see the  svhema 
    const [ schema, setSchema ] = useState([]);  // State for schema
    const [ db, setDb ] = useState(null);
    const [ query, setQuery ] = useState('');  // state to mnage query
    const [ results, setResults ] = useState(null);  // state to manage query result
    const [sessionId, setSessionId] = useState(null);  // For sessionId
    const [mongoSchema, setMongoSchema] = useState(null);  // for mongodb schema
    const [ error, setError ] = useState(null);  // error state
    const [ loading, setLoading ] = useState(false); // While processing, show spinner state
    const [ executionTime, setExecutionTime ] = useState(null);  // To show user the time it took to execute thequery
    const [ aiLoading, setAiLoading ] = useState(false); // state to manage is loading
    const [ aiResponse, setAiResponse ] = useState(null); // Store ai response

    // Initialize database when mode or database changes
    useEffect(() => {
        if (dbMode === 'sql') {
        loadDatabase(currentDatabase);
        } else {
        // MongoDB mode - just load sample queries
        setQuery(sampleQueries.mongodb[currentDatabase]);
        setResults(null);
        setError(null);
        }
    }, [currentDatabase, dbMode]);

    useEffect(() => {
        if (dbMode === 'mongodb' && mongoConnected && sessionId) {
            fetchMongoSchema();
        }
    }, [dbMode, mongoConnected, currentDatabase, sessionId]);

    // Initialize session on component mount
    useEffect(() => {
        let storedSessionId = localStorage.getItem('querylab_session');
        
        if (!storedSessionId) {
            storedSessionId = uuidv4();
            localStorage.setItem('querylab_session', storedSessionId);
        }
        
        setSessionId(storedSessionId);
    }, []);

    useEffect(() => {
        // Configure marked options
        marked.setOptions({
            breaks: true,         
            gfm: true,          
            headerIds: false,   
            mangle: false      
        });
    }, []);

    const loadDatabase = async (dbType) => {
        setLoading(true);
        try {
        let newDb;
        if (dbType === 'custom') {
            newDb = await createEmptyDatabase();
        } else {
            newDb = await createSampleDatabase(dbType);
        }
        setDb(newDb);
        setQuery(sampleQueries.sql[dbType]);
        setResults(null);
        setError(null);
        
        const dbSchema = getDatabaseSchema(newDb);
        setSchema(dbSchema);
        } catch (err) {
        setError('Failed to load database: ' + err.message);
        } finally {
        setLoading(false);
        }
    };

    const executeUserQuery = async () => {
        
        setAiResponse(null); // Clear AI response

        if (dbMode === 'mongodb') {
        if (!mongoConnected) {
            setError('MongoDB is not connected. Please run the local installer first.');
            return;
        }
        // Execute MongoDB query via bridge server
        executeMongoQuery();
        return;
        }

        if (!db) return;
        
        setLoading(true);
        setError(null);
        setResults(null);
        setExecutionTime(null);
        
        const startTime = performance.now();
        
        try {
            const result = executeQuery(db, query);
            setResults(result);
            
            const newSchema = getDatabaseSchema(db);
            setSchema(newSchema);
            
            setExecutionTime(((performance.now() - startTime) / 1000).toFixed(3));
        } catch (err) {
            const endTime = ((performance.now() - startTime) / 1000).toFixed(3);
            setError(err.message);
            setExecutionTime(null); // Don't show execution time on error
        } finally {
            setLoading(false);
        }
    };

    const executeMongoQuery = async () => {
        if (!sessionId) {
            setError('Session not initialized');
            return;
        }
    
        setLoading(true);
        setError(null);
        setResults(null);
        setAiResponse(null);
        
        const startTime = performance.now();
        
        try {
            const response = await fetch('/api/mongodb-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    query,
                    sessionId,
                    dbType: currentDatabase
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Query failed');
            }
            
            setResults({
                type: 'json',
                data: data.results,
                documentCount: data.results.length
            });
            
            setExecutionTime(((performance.now() - startTime) / 1000).toFixed(3));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Retrieve mongodb schema
    const fetchMongoSchema = async () => {
        if (!sessionId) return;
        
        try {
            const response = await fetch(`/api/mongodb-query?sessionId=${sessionId}&dbType=${currentDatabase}`);
            const data = await response.json();
            
            if (data.success) {
                setMongoSchema(data.schema);
            }
        } catch (error) {
            console.error('Failed to fetch MongoDB schema:', error);
        }
    };

    const askGemini = async () => {
        setAiLoading(true);
        setAiResponse(null);
        
        try {
          const res = await fetch("/api/ask-gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query,
              error,
              schema,
            }),
          });
      
          if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to get AI assistance");
          }
      
          const data = await res.json();
          setAiResponse(data.answer);
        } catch (err) {
            console.error("Gemini error:", err.message);
            setAiResponse(`Failed to get AI help: ${err.message}`);
        } finally {
            setAiLoading(false);
        }
    };

    const closeAiResponse = () => {
        setAiResponse(null);
    };

    const resetSession = () => {
        const newSessionId = uuidv4();
        localStorage.setItem('querylab_session', newSessionId);
        setSessionId(newSessionId);
        setResults(null);
        setError(null);
        setMongoSchema(null);
        alert('✅ Session reset! You have fresh data now.');
    };
            
    const renderMarkdown = (markdown) => {
        if (!markdown) return '';
        
        try {
            // Parse markdown to HTML
            const rawHtml = marked.parse(markdown);

            // Sanitize HTML to prevent XSS attacks
            const cleanHtml = DOMPurify.sanitize(rawHtml, {
                ALLOWED_TAGS: [
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'p', 'br', 'strong', 'em', 'u', 'code', 'pre',
                    'ul', 'ol', 'li', 'blockquote', 'a', 'table',
                    'thead', 'tbody', 'tr', 'th', 'td', 'hr'
                ],
                ALLOWED_ATTR: ['href', 'target', 'rel']
            }); 
            return cleanHtml;
        } catch (error) {
            console.error('Markdown parsing error:', error);
            return markdown; // Return plain text if parsing fails
        }
    };

    return (
        <div className="querylab-container">
            <div className="querylab-content">
                {/* Database Mode Selector */}
                <div className="querylab-card">
                    <div className="querylab-card-body">
                        <label className="form-label">Select Database Type</label>
                        
                        {/* The buttons to choose between SQL or MongoDB */}
                        <div className="button-group">
                            <button className={`btn ${dbMode === 'sql' ? 'btn-active-db' : 'btn-inactive-db'}`}
                            onClick={ () => setDbMode("sql") }
                            >
                                <FaDatabase size={25} className="db-symbol mx-2" />
                                SQL (SQLite)
                            </button>

                            <button
                                className={`btn ${dbMode === 'mongodb' ? 'btn-active-db' : 'btn-inactive-db'}`}
                                onClick={() => setDbMode('mongodb')}
                            >
                                <FaDatabase size={25} className="db-symbol mx-2" />
                                MongoDB
                            </button>
                        </div>

                        {/* Select the database you want to practice on */}
                        <label className="form-label">Select Database Type</label>
