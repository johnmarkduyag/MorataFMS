interface TransactionSectionProps {
  title: string;
  accentColor: 'blue' | 'red';
}

export const TransactionSection = ({ title, accentColor }: TransactionSectionProps) => {
  const colorClass = accentColor === 'blue' ? 'bg-blue-500' : 'bg-red-500';
  
  return (
    <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className={`w-2 h-6 ${colorClass} rounded-full mr-3`}></span>
        {title}
      </h2>
      <div className="space-y-4">
        <div className="h-32 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl text-white/30">
          Placeholder: {title.toLowerCase()} will appear here
        </div>
      </div>
    </div>
  );
};
