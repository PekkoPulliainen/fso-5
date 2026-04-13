import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import Blog from "../components/Blog";
import Notification from "../components/Notification";
import ErrorMessage from "../components/ErrorMessage";
import LoginForm from "../components/LoginForm";
import BlogForm from "../components/BlogForm";
import Togglable from "../components/Togglable";
import blogService from "../services/blogs";

const BlogList = ({ blogs, updateBlog, removeBlog }) => {
  const [user, setUser] = useState(null);
  const [notification] = useState(null);
  const [errorMessage] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  /* useEffect(() => {
    blogService
      .getAll()
      .then((initialBlogs) =>
        setBlogs(initialBlogs.sort((a, b) => b.likes - a.likes)),
      );
  }, []); */

  /* console.log("User: ", user); */
  /* const handleLogOut = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    window.location.reload();
  }; */

  return (
    <div>
      <h1>blogs</h1>
      <Notification message={notification} />
      <ErrorMessage message={errorMessage} />
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
          user={user}
        />
      ))}
    </div>
  );
};

export default BlogList;
