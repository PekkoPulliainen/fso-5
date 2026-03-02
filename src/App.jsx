import { useState, useEffect, useRef } from "react";
import Notification from "./components/Notification";
import ErrorMessage from "./components/ErrorMessage";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Blog from "./components/Blog";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  /* const [title, newTitle] = useState("");
  const [author, newAuthor] = useState("");
  const [url, newUrl] = useState(""); */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => setBlogs(initialBlogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();

    /* const blogObject = {
      title: title,
      author: author,
      url: url,
    };

    if (!blogObject.title || !blogObject.author || !blogObject.url) {
      setErrorMessage("Fill every field");

      setTimeout(() => {
        setErrorMessage(null);
      }, 2500);
      return null;
    } */

    if (!blogObject.title || !blogObject.author || !blogObject.url) {
      setErrorMessage("Fill every field");

      setTimeout(() => {
        setErrorMessage(null);
      }, 2500);
      return null;
    }

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));

      setNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
      );

      setTimeout(() => {
        setNotification(null);
      }, 5000);

      /* newTitle("");
      newAuthor("");
      newUrl(""); */
    });
  };

  /* const handleTitleChange = (event) => {
    newTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    newAuthor(event.target.value);
  };

  const handleUrlChange = (event) => {
    newUrl(event.target.value);
  };

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <p>
          title:
          <input value={title} onChange={handleTitleChange}></input>
        </p>
        <p>
          author:
          <input value={author} onChange={handleAuthorChange}></input>
        </p>
        <p>
          url: <input value={url} onChange={handleUrlChange}></input>
        </p>
        <button type="submit">create</button>
      </div>
    </form>
  ); */

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch {
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogOut = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    window.location.reload();
  };

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  );

  return (
    <div>
      <Notification message={notification} />
      <ErrorMessage message={errorMessage} />

      {!user && loginForm()}

      {user && (
        <div>
          <h2>Blogs</h2>
          <p>
            {user.name} logged in<button onClick={handleLogOut}>logout</button>
          </p>
          <Togglable buttonLabel="create a new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}

      {user && (
        <div>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
