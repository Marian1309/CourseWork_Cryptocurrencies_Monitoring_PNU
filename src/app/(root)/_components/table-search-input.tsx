'use client';

import { type ChangeEvent, type FC, memo } from 'react';

import { Input } from '@/components/ui/input';

type TableSearchInputProperties = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder?: string;
};

const TableSearchInput: FC<TableSearchInputProperties> = memo(
  ({ searchTerm, setSearchTerm, placeholder = 'Search cryptocurrencies...' }) => {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value.trim());
    };

    return (
      <div className="mb-4">
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
