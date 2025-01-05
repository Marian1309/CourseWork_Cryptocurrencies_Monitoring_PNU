'use client';

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

const TablePagination = ({ searchPage, onPageChange, totalItems }: Properties) => {
  const router = useRouter();

  const totalPages = totalItems;

  const currentPage = Math.min(Math.max(1, +searchPage || 1), totalPages);

  if (currentPage !== +searchPage && totalPages > 0) {
    router.push(`/?search_page=${currentPage}`, { scroll: false });
    return;
  }

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const renderPaginationItems = () => {
    if (totalPages <= 1) return;

    const items = [];

    items.push(
      <PaginationItem className="dark:text-white" key={1}>
        <PaginationLink
          className="cursor-pointer dark:text-white"
          isActive={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > 3) {
      items.push(
        <PaginationItem className="dark:text-white" key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (
      let index = Math.max(2, currentPage - 1);
      index <= Math.min(totalPages - 1, currentPage + 1);
      index++
    ) {
      items.push(
        <PaginationItem key={index}>
          <PaginationLink
            className="cursor-pointer dark:text-white"
            isActive={currentPage === index}
            onClick={() => handlePageChange(index)}
          >
            {index}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem className="dark:text-white" key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    items.push(
      <PaginationItem className="dark:text-white" key={totalPages}>
        <PaginationLink
          className="cursor-pointer dark:text-white"
          isActive={currentPage === totalPages}
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
