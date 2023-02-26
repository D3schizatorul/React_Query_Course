import { useQuery, useMutation } from "react-query";
import axios from "axios";

async function fetchComments(postId) {
  return await axios.get(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
}

async function deletePost(postId) {
  return await axios.delete(
    `https://jsonplaceholder.typicode.com/postId/${postId}`
  );
}

async function updatePost(postId) {
  return await axios.patch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { data: { title: "React Query" } }
  );
}

export function PostDetail({ post }) {
  const { data, isError, error, isLoading } = useQuery(
    ["comments", post.id],
    () => fetchComments(post.id)
  );

  const deleteMutation = useMutation((postId) => deletePost(postId));
  const updateMutation = useMutation((postId) => updatePost(postId));

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
      <h3 style={{ color: "blue" }}>{post.title}</h3>

      <button onClick={() => deleteMutation.mutate(post.id)}>
        Delete
      </button>{" "}
      {deleteMutation.isError && (
        <p style={{ color: "red" }}>Error: {deleteMutation.error.message}</p>
      )}
      {deleteMutation.isLoading && (
        <p style={{ color: "purple" }}>Deleting the post</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: "green" }}>Post had (not) been deleted</p>
      )}

      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {updateMutation.isError && (
        <p style={{ color: "red" }}>Error: {updateMutation.error.message}</p>
      )}
      {updateMutation.isLoading && (
        <p style={{ color: "purple" }}>Updating the post</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{ color: "green" }}>Post had (not) been updated</p>
      )}
      
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
