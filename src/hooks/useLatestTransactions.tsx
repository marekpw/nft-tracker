import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  nftId: string;
  buyer: string;
  seller: string;
  ts: number;
  price: number;
  fee: number;
}

export interface Transactions {
  state: 'loading' | 'error' | 'ok';
  transactions: Transaction[];
}

export const useLatestTransactions = () => {
  const [transactionData, setTransactionData] = useState<Transactions>({
    state: 'loading',
    transactions: [],
  });

  useEffect(() => {
    (async () => {
      try {
        const transactions = await import('../data/transactions.json');
        
        setTransactionData({
          state: 'ok',
          transactions: transactions.default,
        });
      } catch (error) {
        setTransactionData(data => ({ ...data, state: 'error' }))
      }
    })();
  }, []);

  return transactionData;
};