
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PluginContextType {
  connectedPlugins: string[];
  apiKeys: { [key: string]: string };
  connectPlugin: (pluginId: string, apiKey: string) => void;
  disconnectPlugin: (pluginId: string) => void;
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

const PLUGIN_STORAGE_KEY = 'byteai-plugins';

export const PluginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connectedPlugins, setConnectedPlugins] = useState<string[]>([]);
  const [apiKeys, setApiKeys] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem(PLUGIN_STORAGE_KEY);
        if (storedData) {
          const { connected, keys } = JSON.parse(storedData);
          if(Array.isArray(connected)) setConnectedPlugins(connected);
          if(typeof keys === 'object') setApiKeys(keys);
        }
      }
    } catch (error) {
      console.error('Failed to load plugin data from localStorage', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const persistData = (connected: string[], keys: { [key: string]: string }) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(PLUGIN_STORAGE_KEY, JSON.stringify({ connected, keys }));
      }
    } catch (error) {
      console.error('Failed to save plugin data to localStorage', error);
    }
  };

  const connectPlugin = (pluginId: string, apiKey: string) => {
    if (!connectedPlugins.includes(pluginId)) {
      const newConnected = [...connectedPlugins, pluginId];
      const newApiKeys = { ...apiKeys, [pluginId]: apiKey };
      setConnectedPlugins(newConnected);
      setApiKeys(newApiKeys);
      persistData(newConnected, newApiKeys);
    }
  };

  const disconnectPlugin = (pluginId: string) => {
    const newConnected = connectedPlugins.filter(id => id !== pluginId);
    const newApiKeys = { ...apiKeys };
    delete newApiKeys[pluginId];
    setConnectedPlugins(newConnected);
    setApiKeys(newApiKeys);
    persistData(newConnected, newApiKeys);
  };

  if (loading) {
      return null;
  }

  return (
    <PluginContext.Provider value={{ connectedPlugins, apiKeys, connectPlugin, disconnectPlugin }}>
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
