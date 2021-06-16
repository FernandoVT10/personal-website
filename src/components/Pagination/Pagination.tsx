import React from "react";

import { useRouter } from "next/router";

import getPaginationPages from "@/utils/getPaginationPages";

import styles from "./Pagination.module.scss";

export const PAGINATION_PROPS = `
  totalPages
  page
  hasPrevPage
  prevPage
  hasNextPage
  nextPage
`;

interface PaginationProps {
  data: {
    totalPages: number
    page: number
    hasPrevPage: boolean
    prevPage: number
    hasNextPage: boolean
    nextPage: number
  }
}



const Pagination = ({ data }: PaginationProps) => {
  const router = useRouter();

  const changePage = (page: number) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page
      }
    });
  }

  return (
    <div className={styles.pagination}>
      <button
        className={styles.button}
        onClick={() => changePage(data.prevPage)}
        disabled={!data.hasPrevPage}

      >
        <i className="fas fa-chevron-left" aria-hidden="true"></i>
      </button>

      {getPaginationPages(data.totalPages, data.page).map(page => {
        const buttonClass = data.page === page ? styles.active : "";

        return (
          <button
            className={`${styles.button} ${buttonClass}`}
            onClick={() => changePage(page)}
            key={page}
          >{ page }</button>
        );
      })}

      <button
        className={styles.button}
        onClick={() => changePage(data.nextPage)}
        disabled={!data.hasNextPage}

      >
        <i className="fas fa-chevron-right" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default Pagination;
