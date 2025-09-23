# SWR Infinite Scroll

This is a set of a hook and a component to create infinite scroll lists with SWR.

## Installation

This solution depends on `react-infinite-scroll-hook` and `swr`.

```sh
npm install react-infinite-scroll-hook swr
```

## `useSWRInfiniteScroll` Hook

This hook encapsulates the logic for fetching paginated data with `useSWRInfinite`.

### Arguments

| Name              | Description                                                         | Type                    | Optional |
| ----------------- | ------------------------------------------------------------------- | ----------------------- | -------- |
| `pageKeyTemplate` | A string template for the SWR key. It should include `%pageIndex%`. | `string`                | ❌       |
| `firstPage`       | The initial data for the first page.                                | `PaginationResponse<T>` | ✅       |

### Return Value

| Name          | Description                                  | Type         |
| ------------- | -------------------------------------------- | ------------ |
| `items`       | An array of all items fetched so far.        | `T[]`        |
| `hasNextPage` | Whether there are more items to load.        | `boolean`    |
| `loading`     | Whether a request is in progress.            | `boolean`    |
| `error`       | An error object if a request fails.          | `Error`      |
| `loadMore`    | A function to trigger loading the next page. | `() => void` |

## `SWRInfiniteScroll` Component

This component renders the infinite scroll list and the sentry to trigger loading more items.

### Props

| Name          | Description                                  | Type                                          |
| ------------- | -------------------------------------------- | --------------------------------------------- |
| `items`       | An array of items to render.                 | `T[]`                                         |
| `renderItem`  | A function to render each item.              | `(item: T, index: number) => React.ReactNode` |
| `hasNextPage` | Whether there are more items to load.        | `boolean`                                     |
| `loading`     | Whether a request is in progress.            | `boolean`                                     |
| `error`       | An error object if a request fails.          | `Error`                                       |
| `onLoadMore`  | A function to trigger loading the next page. | `() => void`                                  |

## Example

```tsx
import {
  SWRInfiniteScroll,
  useSWRInfiniteScroll,
} from '@/core/ui/components/swr-infinite-scroll';

function MyListComponent({ firstPage }) {
  const { items, hasNextPage, loading, error, loadMore } = useSWRInfiniteScroll(
    '/api/my-data?page=%pageIndex%',
    firstPage,
  );

  return (
    <ul>
      <SWRInfiniteScroll
        items={items}
        hasNextPage={hasNextPage}
        loading={loading}
        error={error}
        onLoadMore={loadMore}
        renderItem={(item) => <li key={item.id}>{item.name}</li>}
      />
    </ul>
  );
}
```
