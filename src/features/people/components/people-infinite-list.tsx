'use client';

import type { PaginationResponse } from '@/core/shared/types';
import { GridList } from '@/core/ui/components/grid-list';
import {
  SWRInfiniteScroll,
  useSWRInfiniteScroll,
} from '@/core/ui/components/swr-infinite-scroll';
import type { PersonListItem } from '@/features/people/types';
import { PersonCard } from './person-card';

type PeopleInfiniteListProps = {
  firstPage: PaginationResponse<PersonListItem>;
  pageKeyTemplate: string;
};

export function PeopleInfiniteList({
  firstPage,
  pageKeyTemplate,
}: PeopleInfiniteListProps) {
  const { items, hasNextPage, loading, error, loadMore } =
    useSWRInfiniteScroll<PersonListItem>(pageKeyTemplate, firstPage);

  return (
    <GridList>
      <SWRInfiniteScroll
        items={items}
        renderItem={(person) => <PersonCard person={person} />}
        hasNextPage={hasNextPage}
        loading={loading}
        error={error}
        onLoadMore={loadMore}
      />
    </GridList>
  );
}
