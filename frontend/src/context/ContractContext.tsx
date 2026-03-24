import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContractConfig {
  contractId: string;
  network: 'TESTNET' | 'MAINNET' | 'FUTURENET' | 'STANDALONE';
  rpcUrl: string;
}

interface ContractContextType {
  config: ContractConfig;
  updateConfig: (newConfig: Partial<ContractConfig>) => void;
}

// Default Testnet configuration for Soroban
const defaultConfig: ContractConfig = {
  contractId: (import.meta as any).env.VITE_CONTRACT_ID || '', 
  network: 'TESTNET',
  rpcUrl: 'https://soroban-testnet.stellar.org',
};

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ContractConfig>(defaultConfig);

  const updateConfig = (newConfig: Partial<ContractConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  return (
    <ContractContext.Provider value={{ config, updateConfig }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};
