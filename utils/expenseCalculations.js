export const calculateMonthlyExpense = (items, selectedMonth) => {
  return items.reduce((sum, item) => {
    const monthTotal = item.expenses
      .filter(expense => expense.month === selectedMonth)
      .reduce((total, expense) => total + expense.amount, 0);
    return sum + monthTotal;
  }, 0);
};

export const calculateItemMonthlyTotal = (expenses, selectedMonth) => {
  return expenses
    .filter(expense => expense.month === selectedMonth)
    .reduce((sum, expense) => sum + expense.amount, 0);
};
