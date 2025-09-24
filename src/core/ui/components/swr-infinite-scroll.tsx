'use client';

import useInfiniteScroll from 'react-infinite-scroll-hook';
import useSWRInfinite from 'swr/infinite';

// import { getAllPageResults, getHasNextPage } from '@/core/shared/utils';
import _ from 'lodash';

import { Box, CircularProgress , Alert } from '@mui/material';
import { forwardRef } from 'react';


export type Maybe<T> = T | null | undefined;
export type PaginationResponse<Data> = {
  results: Data[];
  page: number;
  total_pages: number;
  total_results: number;
};

export function getAllPageResults<T extends { id: number | string }>(
  allPages: Maybe<PaginationResponse<T>[]>,
): T[] {
  if (!allPages) return [];

  const flatPages = allPages.flatMap((page) => page.results);

  return _.uniqBy(flatPages, (item) => item.id);
}

export function getHasNextPage<T>(allPages: Maybe<PaginationResponse<T>[]>) {
  const lastPage = allPages?.[allPages.length - 1];

  if (!lastPage) return false;

  return lastPage.page < lastPage.total_pages;
}

type LoadingIndicatorProps = {
  loading: boolean;
  children?: React.ReactNode;
};

export const LoadingIndicator = forwardRef<
  React.ComponentRef<'div'>,
  LoadingIndicatorProps
>(function LoadingIndicator({ loading, children }, ref) {
  if (!loading) return children;

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        marginY: 2,
        flexGrow: 1,
      }}
    >
      <CircularProgress aria-label="Loading..." size={48} color="secondary" />
    </Box>
  );
});

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
