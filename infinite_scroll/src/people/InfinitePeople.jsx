import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import axios from "axios";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  return await axios.get(url);
};

export function InfinitePeople() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useInfiniteQuery(
    "sw-people",
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    { getNextPageParam: (lastPage) => lastPage.data.next || undefined }
  );

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((pageData) => {
          return pageData.data.results.map((person) => {
            return (
              <Person
                key={person.name}
                name={person.name}
                hairColor={person.hair_color}
                eyeColor={person.eye_color}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
