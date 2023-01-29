import React, { createContext } from "react";

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
    const url = new URL("http://localhost:3000/transactions");

    if (query) {
      url.searchParams.append("q", query);
    }

    const response = await fetch(url);
    const json = await response.json();
    setTransactions(json);
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
