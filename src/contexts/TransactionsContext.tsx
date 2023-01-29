import React from 'react'
import { createContext } from 'use-context-selector'

import { api } from '../lib/axios'

interface CreateTransactionInput {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

interface TransactionContextType {
  transactions: Transaction[]
  fetchData: (query?: string) => Promise<void>
  createTransaction: (data: CreateTransactionInput) => Promise<void>
}

export const TransactionsContext = createContext({} as TransactionContextType)

interface TransactionProviderProps {
  children: React.ReactNode
}

export function TransactionsProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = React.useState<Transaction[]>([])

  const fetchData = React.useCallback(async (query?: string) => {
    const response = await api.get('/transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',

        q: query,
      },
    })
    setTransactions(response.data)
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const createTransaction = React.useCallback(
    async (data: CreateTransactionInput) => {
      const { description, category, price, type } = data

      const response = await api.post('transactions', {
        description,
        price,
        category,
        type,
        createdAt: new Date(),
      })

      setTransactions((state) => [response.data, ...state])
    },
    [],
  )

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchData, createTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
