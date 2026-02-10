import { TransactionSection } from './TransactionSection';

export const TransactionSections = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <TransactionSection title="Import Transactions" accentColor="blue" />
      <TransactionSection title="Export Transactions" accentColor="red" />
    </div>
  );
};
