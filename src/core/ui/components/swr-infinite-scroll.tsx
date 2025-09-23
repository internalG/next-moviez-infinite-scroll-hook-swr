'use client';

import type { Maybe, PaginationResponse } from '@/core/shared/types';
import { getAllPageResults, getHasNextPage } from '@/core/shared/utils';
import { Alert } from '@mui/material';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';
import { LoadingIndicator } from './loading-indicator';

function getInfiniteSWRKey({
  pageIndex,
  pageKeyTemplate,
}: {
  pageIndex: number;
  pageKeyTemplate: string;
}) {
  return decodeURIComponent(pageKeyTemplate).replace(
    '%pageIndex%',
    (pageIndex + 1).toString(),
  );
}

export function useSWRInfiniteScroll<T extends { id: string | number }>(
  pageKeyTemplate: string,
  firstPage?: Maybe<PaginationResponse<T>>,
) {
  const {
    data,
    error,
    setSize,
    isValidating: loading,
  } = useSWRInfinite<PaginationResponse<T>, Error>(
    (pageIndex: number) => getInfiniteSWRKey({ pageIndex, pageKeyTemplate }),
    {
      fallbackData: firstPage ? [firstPage] : [],
      revalidateFirstPage: false,
      revalidateIfStale: false,
    },
  );

  const hasNextPage = getHasNextPage(data);
  const items = getAllPageResults(data);

  return {
    items,
    hasNextPage,
    loading,
    error,
    loadMore: () => setSize((size) => size + 1),
  };
}

export type SWRInfiniteScrollProps<T extends { id: string | number }> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
} & Pick<
  Parameters<typeof useInfiniteScroll>[0],
  'hasNextPage' | 'loading' | 'onLoadMore'
> & { error: Maybe<Error> };

export function SWRInfiniteScroll<T extends { id: string | number }>({
  hasNextPage,
  loading,
  error,
  onLoadMore,
  items,
  renderItem,
}: SWRInfiniteScrollProps<T>) {
  const [sentryRef] = useInfiniteScroll({
    hasNextPage,
    loading,
    disabled: !!error,
    onLoadMore,
    rootMargin: '0px 0px 400px 0px',
  });

  return (
    <>
      {items.map((item, index) => renderItem(item, index))}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error.message}
        </Alert>
      )}

      {hasNextPage && (
        <LoadingIndicator
          ref={sentryRef}
          // If list has next page, we keep loading shown
          // to prevent flickering of loading indicator.
          loading
        />
      )}
    </>
  );
}
