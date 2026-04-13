import { useState, useEffect } from "react";
import Notification from "./components/Notification";
import ErrorMessage from "./components/ErrorMessage";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Blog from "./components/Blog";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogList from "./components/BlogList";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
  useLocation,
} from "react-router-dom";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  /* const blogFormRef = useRef(); */

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((initialBlogs) =>
      setBlogs(
        initialBlogs
          .map((blog) => ({
            ...blog,
            user:
              typeof blog.user === "object" && blog.user !== null
                ? blog.user
                : { username: "unknown", name: "unknown" },
          }))
          .sort((a, b) => b.likes - a.likes),
      ),
    );
  }, []);

  console.log("user: ", user);

  const createBlog = (blogObject) => {
    /* blogFormRef.current.toggleVisibility(); */

    if (!blogObject.title || !blogObject.author || !blogObject.url) {
      setErrorMessage("Fill every field");

      setTimeout(() => {
        setErrorMessage(null);
      }, 2000);
      return null;
    }

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));

      setNotification(`${blogObject.title} ${blogObject.author}`);

      setTimeout(() => {
        setNotification(null);
      }, 2000);
    });
  };

  const updateBlog = (blog) => {
    blogService
      .update(blog.id, {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user._id,
      })
      .then((response) => {
        const updatedBlog = {
          ...response,
          user: typeof response.user === "object" ? response.user : blog.user,
        };
        setBlogs(
          blogs
            .map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
            .sort((a, b) => b.likes - a.likes),
        );
      });
  };

  const removeBlog = (blogToRemove) => {
    if (
      window.confirm(
        `Remove blog ${blogToRemove.title} by ${blogToRemove.author}`,
      )
    ) {
      blogService.remove(blogToRemove.id).then(() => {
        setBlogs(blogs.filter((blog) => blog.id !== blogToRemove.id));
      });

      setNotification(`${blogToRemove.title} has been deleted`);

      setTimeout(() => {
        setNotification("");
      }, 2000);
    } else {
      return null;
    }
  };

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
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 2000);
    }
  };

  const handleLogOut = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    window.location.reload();
  };

  const padding = {
    padding: 5,
  };

  const match = useMatch("/blogs/:id");

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  console.log(blog);

  const location = useLocation();

  return (
    <div>
      <div>
        {user ? (
          <>
            {location.pathname !== "/blogs" && (
              <Link style={padding} to="/blogs">
                blogs
              </Link>
            )}
            {location.pathname !== "/create" && (
              <Link style={padding} to="/create">
                new blog
              </Link>
            )}
            <p>
              {user.name} logged in{" "}
              <button onClick={handleLogOut}>logout</button>
            </p>
          </>
        ) : (
          location.pathname !== "/login" && (
            <Link style={padding} to="/login">
              login
            </Link>
          )
        )}
      </div>

      <Routes>
        {user && (
          <Route
            path="/blogs"
            element={
              <>
                <Notification message={notification} />
                <ErrorMessage message={errorMessage} />
                <BlogList
                  blogs={blogs}
                  updateBlog={updateBlog}
                  removeBlog={removeBlog}
                />
              </>
            }
          />
        )}
        {user && (
          <Route
            path="/create"
            element={
              <>
                <Notification message={notification} />
                <ErrorMessage message={errorMessage} />
                <BlogForm createBlog={createBlog} />
              </>
            }
          />
        )}
        {!user && (
          <Route
            path="/login"
            element={
              <>
                <Notification message={notification} />
                <ErrorMessage message={errorMessage} />
                <LoginForm
                  handleLogin={handleLogin}
                  setUsername={setUsername}
                  setPassword={setPassword}
                  username={username}
                  password={password}
                />
              </>
            }
          />
        )}
      </Routes>
    </div>
  );
};

export default App;
