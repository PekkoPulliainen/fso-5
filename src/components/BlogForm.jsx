import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, newTitle] = useState("");
  const [author, newAuthor] = useState("");
  const [url, newUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: title,
      author: author,
      url: url,
    });

    newTitle("");
    newAuthor("");
    newUrl("");
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <p>
          title:
          <input
            value={title}
            onChange={(event) => newTitle(event.target.value)}
          ></input>
        </p>
        <p>
          author:
          <input
            value={author}
            onChange={(event) => newAuthor(event.target.value)}
          ></input>
        </p>
        <p>
          url:{" "}
          <input
            value={url}
            onChange={(event) => newUrl(event.target.value)}
          ></input>
        </p>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
