
import App from './App.jsx';
//css import
import './index.css'
//Library import
import { BrowserRouter } from 'react-router-dom';
import React from 'react'
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')).render(
 <BrowserRouter>
    <App />
 </BrowserRouter>
)
