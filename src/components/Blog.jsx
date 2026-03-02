import { useState } from "react";

const Blog = ({ blog }) => {
  const [expand, setExpansion] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const showWhenVisible = { display: expand ? "none" : "" };
  const hideWhenVisible = { display: expand ? "" : "none" };

  return (
    <div style={blogStyle}>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}{" "}
        <button onClick={() => setExpansion(!expand)}>expand</button>
      </div>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}{" "}
        <button onClick={() => setExpansion(!expand)}>hide</button>
        <div>{blog.url}</div>
        <div>
          {blog.likes} <button>like</button>
        </div>
        <div>{blog.author}</div>
      </div>
    </div>
  );
};

export default Blog;
