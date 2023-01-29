import React from "react";
import { TransactionsContext } from "../contexts/TransactionsContext";

export function useSummary() {
  const { transactions } = React.useContext(TransactionsContext);

  const summary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") {
        acc.income += transaction.price;
        acc.total += acc.income;
      } else {
        acc.outcome += transaction.price;
        acc.total -= acc.outcome;
      }

      return acc;
    },
    {
      income: 0,
      outcome: 0,
      total: 0,
    }
  );
  return summary;
}
