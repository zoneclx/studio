
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Plugin {
    id: string;
    name: string;
    description: string;
    version: string;
    apiKeyRequired: boolean;
    apiKey: string;
    connected: boolean;
}

interface PluginContextType {
  plugins: Plugin[];
  connectPlugin: (id: string) => void;
  disconnectPlugin: (id: string) => void;
  updatePluginApiKey: (id: string, apiKey: string) => void;
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

const PLUGINS_STORAGE_KEY = 'monochrome-plugins';

const initialPlugins: Plugin[] = [
    { id: 'ai-code-assistant', name: 'AI Code Assistant', description: 'Get AI-powered code suggestions and completions.', version: '1.2.0', apiKeyRequired: true, apiKey: '', connected: false },
    { id: 'live-db-connector', name: 'Live Database Connector', description: 'Connect to a live database for dynamic content.', version: '0.8.5', apiKeyRequired: true, apiKey: '', connected: false },
    { id: 'theme-pack', name: 'Theme Pack', description: 'A collection of additional themes for your editor.', version: '2.0.1', apiKeyRequired: false, apiKey: '', connected: true },
    { id: 'deployment-helper', name: 'Deployment Helper', description: 'Easily deploy your project to various platforms.', version: '1.5.0', apiKeyRequired: true, apiKey: '', connected: false },
];

const getStoredPlugins = (): Plugin[] => {
  try {
    if (typeof window !== 'undefined') {
        const pluginsStr = localStorage.getItem(PLUGINS_STORAGE_KEY);
        if (pluginsStr) {
            return JSON.parse(pluginsStr) as Plugin[];
        }
    }
  } catch (error) {
    console.error("Failed to parse plugins from localStorage", error);
  }
  // Return initial state if nothing in storage or on server
  return initialPlugins;
};

const setStoredPlugins = (plugins: Plugin[]) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PLUGINS_STORAGE_KEY, JSON.stringify(plugins));
    }
  } catch (error) {
     console.error("Failed to set plugins in localStorage", error);
  }
};

export const PluginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [plugins, setPlugins] = useState<Plugin[]>(getStoredPlugins);

  useEffect(() => {
    // This effect runs on client-side and initializes state from localStorage
    setPlugins(getStoredPlugins());
  }, []);
  
  const updatePlugins = (newPlugins: Plugin[]) => {
      setPlugins(newPlugins);
      setStoredPlugins(newPlugins);
  }

  const connectPlugin = (id: string) => {
    const newPlugins = plugins.map(p => p.id === id ? { ...p, connected: true } : p);
    updatePlugins(newPlugins);
  };
  
  const disconnectPlugin = (id: string) => {
    const newPlugins = plugins.map(p => p.id === id ? { ...p, connected: false } : p);
    updatePlugins(newPlugins);
  }

  const updatePluginApiKey = (id: string, apiKey: string) => {
    const newPlugins = plugins.map(p => p.id === id ? { ...p, apiKey } : p);
    updatePlugins(newPlugins);
  }

  return (
    <PluginContext.Provider value={{ plugins, connectPlugin, disconnectPlugin, updatePluginApiKey }}>
      {children}
    </PluginContext.Provider>
  );
};

export const usePlugins = (): PluginContextType => {
  const context = useContext(PluginContext);
  if (context === undefined) {
    throw new Error('usePlugins must be used within a PluginProvider');
  }
  return context;
};
