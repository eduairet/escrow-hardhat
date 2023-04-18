import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import EscrowContextProvider from './store/escrow-context';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <EscrowContextProvider>
            <App />
        </EscrowContextProvider>
    </React.StrictMode>
);

reportWebVitals();
