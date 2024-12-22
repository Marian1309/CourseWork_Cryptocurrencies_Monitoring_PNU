import type { FC } from 'react';
import { useState } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from '@/components/ui/pagination';

type Properties = {
  searchPage: number;
};

const TablePagination: FC<Properties> = ({ searchPage }) => {
  const [currentPage, setCurrentPage] = useState(searchPage);
  const totalPages = 417;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const items = [];

    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          href={`/?searchPage=1`}
          isActive={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
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
            href={`/?searchPage=${index}`}
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
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    items.push(
      <PaginationItem key={totalPages}>
        <PaginationLink
          href={`/?searchPage=${totalPages}`}
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
    <Pagination className="pt-4">
      <PaginationContent>{renderPaginationItems()}</PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
