import { useState, useEffect } from "react";
import Notification from "./components/Notification";
import ErrorMessage from "./components/ErrorMessage";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, newTitle] = useState("");
  const [author, newAuthor] = useState("");
  const [url, newUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = (event) => {
    event.preventDefault();

    const blogObject = {
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
    }

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));

      setNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
      );

      setTimeout(() => {
        setNotification(null);
      }, 5000);

      newTitle("");
      newAuthor("");
      newUrl("");
    });
  };

  const handleTitleChange = (event) => {
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
  );

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
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <h2>log in to application</h2>
        <label>
          username{" "}
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  );

  return (
    <div>
      <Notification message={notification} />
      <ErrorMessage message={errorMessage} />
      {!user && loginForm()}
      {user && (
        <form onSubmit={handleLogOut}>
          <div>
            <h2>Blogs</h2>
            <p>
              {user.name} logged in<button type="submit">logout</button>
            </p>
          </div>
        </form>
      )}
      {user && (
        <div>
          {blogForm()}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
