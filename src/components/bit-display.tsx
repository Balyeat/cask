interface BitDisplayProps {
  value: number;
  bits: number;
  allocated?: boolean;
  prevAllocated?: boolean;
}

export function BitDisplay({ value, bits, allocated, prevAllocated }: BitDisplayProps) {
  const binaryString = value.toString(2).padStart(bits, '0');
  
  return (
    <div className="flex gap-1 font-mono text-sm">
      {binaryString.split('').map((bit, index) => (
        <span
          key={index}
          className={`
            w-6 h-6 flex items-center justify-center rounded
            ${index === bits - 1 && allocated !== undefined ? 
              allocated ? 'bg-red-500 text-white dark:bg-red-600' : 'bg-green-500 text-white dark:bg-green-600'
              : index === bits - 2 && prevAllocated !== undefined ?
              prevAllocated ? 'bg-yellow-500 text-white dark:bg-yellow-600' : 'bg-blue-500 text-white dark:bg-blue-600'
              : 'bg-gray-100 dark:bg-gray-800'}
          `}
        >
          {bit}
        </span>
      ))}
    </div>
  );
}

