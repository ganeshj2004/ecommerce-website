import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0F4C81',
      light: '#00B4D8',
      dark: '#083359',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00B4D8',
      light: '#48CAE4',
      dark: '#0096B4',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8FAFC',
      paper: '#ffffff',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
        <Toaster position="bottom-right" reverseOrder={false} />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
