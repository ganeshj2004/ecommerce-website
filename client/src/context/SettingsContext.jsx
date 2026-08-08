import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const SettingsContext = createContext();

const defaultSettings = {
  company_name: 'AquaCraft Bottles',
  company_tagline: 'Hydrate in Style, Sustain the Planet',
  company_logo: '', // Clean initial state - no hardcoded bottle image flash
  hero_title: 'Elevate Your Hydration with Eco-Luxury Bottles',
  hero_subtitle: '100% BPA-Free vacuum insulated thermo flasks & eco borosilicate glass bottles designed for peak performance.',
  hero_banner: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&q=80',
  about_us: 'AquaCraft Bottles is dedicated to crafting premium, sustainable hydration vessels that keep your drinks ice-cold for 24 hours or steaming hot for 12 hours.',
  phone: '+1 (800) 555-AQUA',
  email: 'support@aquacraftbottles.com',
  address: '742 Evergreen Hydration Way, Suite 400, San Francisco, CA 94107',
  free_shipping_min: '50',
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('aquacraft_cached_settings');
      return cached ? JSON.parse(cached) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await API.get('/settings');
      if (res.data && res.data.settings) {
        setSettings((prev) => {
          const updated = { ...prev, ...res.data.settings };
          localStorage.setItem('aquacraft_cached_settings', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.warn('Failed to load dynamic website settings, using defaults.', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
