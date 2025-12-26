import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log("Main.jsx executing");
const root = document.getElementById('root');
console.log("Root element:", root);

// Error boundary to catch rendering errors
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('React Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '40px', color: 'white', backgroundColor: '#1a1a2e', minHeight: '100vh', fontFamily: 'monospace' }}>
                    <h1 style={{ color: '#ff6b6b', fontSize: '36px' }}>⚠️ Application Error</h1>
                    <pre style={{ color: '#ff6b6b', marginTop: '20px', padding: '20px', background: 'rgba(255,107,107,0.1)', borderRadius: '8px' }}>
                        {this.state.error?.toString()}
                    </pre>
                    <p style={{ marginTop: '20px', color: '#22d3ee' }}>Please refresh the page or check the console for more details.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

try {
    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </React.StrictMode>,
    );
    console.log("React app mounted successfully");
} catch (error) {
    console.error("Failed to mount React app:", error);
    root.innerHTML = `<div style="padding: 40px; color: white; background: #1a1a2e; min-height: 100vh; font-family: monospace;">
        <h1 style="color: #ff6b6b; font-size: 36px;">⚠️ Mount Error</h1>
        <p style="margin-top: 20px; color: #22d3ee;">Failed to initialize Multivac AI</p>
        <pre style="color: #ff6b6b; margin-top: 20px; padding: 20px; background: rgba(255,107,107,0.1); border-radius: 8px;">${error.message}</pre>
    </div>`;
}
