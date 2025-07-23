export const calculateMonthlyExpense = (items, selectedMonth) => {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    const monthTotal = item.expenses
      .filter(expense => expense.month === selectedMonth)
      .reduce((total, expense) => total + expense.amount, 0);
    return sum + monthTotal;
  }, 0);
};

export const calculateItemMonthlyTotal = (expenses, selectedMonth) => {
  if (!expenses || !Array.isArray(expenses)) return 0;
  return expenses
    .filter(expense => expense.month === selectedMonth)
    .reduce((sum, expense) => sum + expense.amount, 0);
};
