import React, { createContext } from "react";
import { api } from "../lib/axios";

interface Transaction {
  id: number;
  description: string;
  type: "income" | "outcome";
  price: number;
  category: string;
  createdAt: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  fetchData: (query?: string) => Promise<void>;
}

export const TransactionsContext = createContext({} as TransactionContextType);

interface TransactionProviderProps {
  children: React.ReactNode;
}

export function TransactionsProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  async function fetchData(query?: string) {
    const response = await api.get("/transactions", {
      params: { q: query },
    });
    setTransactions(response.data);
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <TransactionsContext.Provider value={{ transactions, fetchData }}>
      {children}
    </TransactionsContext.Provider>
  );
}
