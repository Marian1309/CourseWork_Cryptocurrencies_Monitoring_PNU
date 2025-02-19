'use client';

import { type ChangeEvent, useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';

type Properties = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const TableSearchInput = ({
  searchTerm,
  setSearchTerm,
  placeholder = 'Search cryptocurrencies...',
  className
}: Properties) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const reference = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    reference.current?.focus();
  }, [reference]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        setSearchTerm(localSearchTerm.trim());
      }
    }, 800); // Adjust debounce delay

    return () => clearTimeout(debounceTimeout); // Cleanup timeout on input change or unmount
  }, [localSearchTerm, searchTerm, setSearchTerm]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(event.target.value);
  };

  return (
    <div className={className}>
      <Input
        aria-label="Search cryptocurrencies"
        className="w-full rounded-lg border border-gray-200 p-2 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:focus:border-blue-500 dark:focus:ring-blue-200"
        onChange={handleInputChange}
        placeholder={placeholder}
        ref={reference}
        type="text"
        value={localSearchTerm}
      />
    </div>
  );
};

export default TableSearchInput;
