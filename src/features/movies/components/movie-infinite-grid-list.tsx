'use client';

import type { Maybe, PaginationResponse } from '@/core/shared/types';
import { GridList } from '@/core/ui/components/grid-list';
import {
  SWRInfiniteScroll,
  useSWRInfiniteScroll,
} from '@/core/ui/components/swr-infinite-scroll';
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
  const { items, hasNextPage, loading, error, loadMore } =
    useSWRInfiniteScroll<MovieListItem>(pageKeyTemplate, firstPage);

  if (!firstPage) return null;

  const movies = skipFirstMovie ? items.slice(1) : items;

  return (
    <GridList>
      <SWRInfiniteScroll
        items={movies}
        renderItem={(movie) => <MovieCard movie={movie} />}
        hasNextPage={hasNextPage}
        loading={loading}
        error={error}
        onLoadMore={loadMore}
      />
    </GridList>
  );
}
