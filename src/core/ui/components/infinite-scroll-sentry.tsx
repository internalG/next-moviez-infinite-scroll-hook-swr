import type { Maybe } from '@/core/shared/types';
import { Alert } from '@mui/material';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { LoadingIndicator } from './loading-indicator';

export type InfiniteScrollSentryProps = Pick<
  Parameters<typeof useInfiniteScroll>[0],
  'hasNextPage' | 'loading' | 'onLoadMore'
> & { error: Maybe<Error> };

export function InfiniteScrollSentry({
  hasNextPage,
  loading,
  error,
  onLoadMore,
}: InfiniteScrollSentryProps) {
  const [sentryRef] = useInfiniteScroll({
    hasNextPage,
    loading,
    disabled: !!error,
    onLoadMore,
    rootMargin: '0px 0px 400px 0px',
  });

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error.message}
      </Alert>
    );
  }

  if (!hasNextPage) return null;

  return (
    <LoadingIndicator
      ref={sentryRef}
      // If list has next page, we keep loading shown
      // to prevent flickering of loading indicator.
      loading
    />
  );
}
