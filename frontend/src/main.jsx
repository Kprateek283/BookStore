import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RootProvider } from './context';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <RootProvider>
                <App />
            </RootProvider>
        </BrowserRouter>
    </React.StrictMode>
);
