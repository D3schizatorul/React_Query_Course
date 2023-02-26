import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { PostDetail } from "./PostDetail";

const maxPostPage = 10;

async function fetchPosts(pageNum) {
  return await axios.get(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(
        ["posts", nextPage],
        () => fetchPosts(nextPage),
        { staleTime: 5000, keepPreviousData: true }
      );
    }
    // eslint-disable-next-line
  }, [currentPage]);

  const { data, isError, error, isLoading } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 5000,
    }
  );

  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>Oops, something went wrong.</h3>
        <p>{error.message}</p>
      </>
    );

  return (
    <>
      <ul>
        {data.data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prevValue) => prevValue - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prevValue) => prevValue + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
