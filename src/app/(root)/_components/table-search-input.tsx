'use client';

import { type ChangeEvent, type FC, memo } from 'react';

import { Input } from '@/components/ui/input';

type TableSearchInputProperties = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const TableSearchInput: FC<TableSearchInputProperties> = memo(
  ({
    searchTerm,
    setSearchTerm,
    placeholder = 'Search cryptocurrencies...',
    className
  }) => {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value.trim());
    };

    return (
      <div className={className}>
        <Input
          aria-label="Search cryptocurrencies"
          className="w-full rounded-lg border border-gray-200 p-2 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:focus:border-blue-500 dark:focus:ring-blue-200"
          onChange={handleInputChange}
          placeholder={placeholder}
          type="text"
          value={searchTerm}
        />
      </div>
    );
  }
);

TableSearchInput.displayName = 'TableSearchInput';

export default TableSearchInput;
