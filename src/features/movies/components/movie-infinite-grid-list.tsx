'use client';

import type { Maybe, PaginationResponse } from '@/core/shared/types';
import { InfiniteScrollList } from '@/core/ui/components/infinite-scroll-list';
import { MovieCard } from '@/features/movies/components/movie-card';
import type { MovieListItem } from '@/features/movies/types';

type MovieInfiniteGridListProps = {
  firstPage: Maybe<PaginationResponse<MovieListItem>>;
  pageKeyTemplate: string;
  skipFirstMovie?: boolean;
};

export function MovieInfiniteGridList({
  firstPage,
  pageKeyTemplate,
  skipFirstMovie,
}: MovieInfiniteGridListProps) {
  if (!firstPage) return null;

  return (
    <InfiniteScrollList
      firstPage={firstPage}
      pageKeyTemplate={pageKeyTemplate}
      skipFirstItem={skipFirstMovie}
      renderItem={(movie) => <MovieCard movie={movie} />}
    />
  );
}
