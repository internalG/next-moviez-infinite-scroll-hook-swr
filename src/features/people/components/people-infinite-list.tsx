'use client';

import type { PaginationResponse } from '@/core/shared/types';
import { InfiniteScrollList } from '@/core/ui/components/infinite-scroll-list';
import type { PersonListItem } from '@/features/people/types';
import { PersonCard } from './person-card';

type PeopleInfiniteListProps = {
  firstPage: PaginationResponse<PersonListItem>;
  pageKeyTemplate: string;
};

export function PeopleInfiniteGridList({
  firstPage,
  pageKeyTemplate,
}: PeopleInfiniteListProps) {
  return (
    <InfiniteScrollList
      firstPage={firstPage}
      pageKeyTemplate={pageKeyTemplate}
      renderItem={(person) => <PersonCard person={person} />}
    />
  );
}
