'use client';

import type { PaginationResponse } from '@/core/shared/types';
import { getAllPageResults, getHasNextPage } from '@/core/shared/utils';
import useSWRInfinite from 'swr/infinite';
import { InfiniteGridList, getInfiniteSwrKey } from './infinite-grid-list';

type InfiniteScrollListProps<T> = {
  firstPage: PaginationResponse<T>;
  pageKeyTemplate: string;
  renderItem: (item: T) => React.ReactNode;
  skipFirstItem?: boolean;
  listEmptyMessage?: string;
};

export function InfiniteScrollList<T extends { id: number | string }>({
  firstPage,
  pageKeyTemplate,
  renderItem,
  skipFirstItem,
  listEmptyMessage,
}: InfiniteScrollListProps<T>) {
  const { data, error, setSize, isValidating } = useSWRInfinite<
    PaginationResponse<T>,
    Error
  >((pageIndex: number) => getInfiniteSwrKey({ pageIndex, pageKeyTemplate }), {
    fallbackData: [firstPage],
    revalidateFirstPage: false,
    revalidateIfStale: false,
  });

  const hasNextPage = getHasNextPage(data);
  const items = getAllPageResults(data);

  return (
    <InfiniteGridList
      hasNextPage={hasNextPage}
      loading={isValidating}
      error={error}
      onLoadMore={() => setSize((size) => size + 1)}
      listEmptyMessage={listEmptyMessage}
    >
      {items.map((item, index) => {
        if (skipFirstItem && index === 0) return null;
        return <li key={item.id}>{renderItem(item)}</li>;
      })}
    </InfiniteGridList>
  );
}
