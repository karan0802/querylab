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
