'use client';

import type { FC } from 'react';

import { useRouter } from 'next/navigation';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from '@/components/ui/pagination';

type Properties = {
  searchPage: string;
  onPageChange: (page: number) => void;
  totalItems: number;
};

const TablePagination: FC<Properties> = ({ searchPage, onPageChange, totalItems }) => {
  const router = useRouter();

  const totalPages = Math.ceil(totalItems);

  // Ensure `searchPage` is always within valid range
  if (+searchPage > totalPages && totalPages > 0) {
    router.push(`/?search_page=${totalPages}`, { scroll: false });
    return;
  }

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const renderPaginationItems = () => {
    if (totalPages <= 1) return; // No pagination if there’s only 1 page

    const items = [];

    // First page
    items.push(
      <PaginationItem className="dark:text-white" key={1}>
        <PaginationLink
          className="cursor-pointer dark:text-white"
          isActive={+searchPage === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Ellipsis before middle pages
    if (+searchPage > 3) {
      items.push(
        <PaginationItem className="dark:text-white" key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Middle pages
    for (
      let index = Math.max(2, +searchPage - 1);
      index <= Math.min(totalPages - 1, +searchPage + 1);
      index++
    ) {
      items.push(
        <PaginationItem key={index}>
          <PaginationLink
            className="cursor-pointer dark:text-white"
            isActive={+searchPage === index}
            onClick={() => handlePageChange(index)}
          >
            {index}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis after middle pages
    if (+searchPage < totalPages - 2) {
      items.push(
        <PaginationItem className="dark:text-white" key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Last page
    items.push(
      <PaginationItem className="dark:text-white" key={totalPages}>
        <PaginationLink
          className="cursor-pointer dark:text-white"
          isActive={+searchPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );

    return items;
  };

  return (
    <Pagination className="pt-4 dark:text-white">
      <PaginationContent className="dark:text-white">
        {renderPaginationItems()}
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
