import { Wallet, TrendingUp, Calendar, IndianRupee } from 'lucide-react';
import { isToday, isThisMonth, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

interface Transaction {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

interface EarningsCardsProps {
  transactions: Transaction[];
  totalRevenue: number;
}

export function EarningsCards({ transactions, totalRevenue }: EarningsCardsProps) {
  const successfulTransactions = transactions.filter(t => t.status === 'success');
  
  const todaysEarnings = successfulTransactions
    .filter(t => isToday(new Date(t.created_at)))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlyEarnings = successfulTransactions
    .filter(t => isThisMonth(new Date(t.created_at)))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const cards = [
    {
      label: "Today's Earnings",
      value: todaysEarnings,
      icon: IndianRupee,
      color: 'bg-success/10',
      iconColor: 'text-success',
    },
    {
      label: 'This Month',
      value: monthlyEarnings,
      icon: Calendar,
      color: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      label: 'Total Revenue',
      value: totalRevenue,
      icon: TrendingUp,
      color: 'bg-warning/10',
      iconColor: 'text-warning',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color}`}>
              <card.icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                ₹{card.value.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
