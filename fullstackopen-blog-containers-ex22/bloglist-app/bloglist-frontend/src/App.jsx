import { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom'

import blogService from './services/blogs'
import loginService from './services/login'

import BlogList from './components/BlogList'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import {
  AppBar,
  Toolbar,
  Button,
  Typography
} from '@mui/material'



const Navigation = ({ user, logout }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          Users
        </Button>

        {user && (
          <Button color="inherit" component={Link} to="/create">
            Create
          </Button>
        )}

        <Typography sx={{ flexGrow: 1 }} />

        {user ? (
          <>
            <Typography sx={{ mr: 2 }}>
              {user.name} logged in
            </Typography>
            <Button
              color="inherit"
              sx={{
                color: 'error.contrastText',
                backgroundColor: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.dark',
                }
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(initialBlogs => {
      setBlogs(initialBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      'loggedBlogappUser'
    )

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({
      message,
      type,
    })

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const login = async (username, password) => {
    try {
      const loggedUser = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser)
      )

      blogService.setToken(loggedUser.token)
      setUser(loggedUser)

      showNotification('login successful')

      return true
    } catch (error) {
      showNotification(
        'wrong username or password',
        'error',
        error
      )

      return false
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async blogObject => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      const updatedBlogs = await blogService.getAll()

      setBlogs(updatedBlogs)

      showNotification(
        `a new blog "${returnedBlog.title}" was added`
      )

      return returnedBlog
    } catch (error) {
      showNotification(
        'creating the blog failed',
        'error'
      )

      throw error
    }
  }

  const likeBlog = async blog => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    const returnedBlog = await blogService.updateBlog(
      blog.id,
      updatedBlog
    )
    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs)
    showNotification(
      `Updated blog ${returnedBlog.title} updated successfully`,
      'success'
    )
  }

  const deleteBlog = async id => {
    await blogService.deleteBlog(id)

    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs)
  }

  return (
    <div>
      <h1>blog app</h1>

      <Navigation
        user={user}
        logout={logout}
      />

      <Notification
        notification={notification}
      />

      <Routes>
        <Route
          path="/"
          element={
            <BlogList
              blogs={blogs}
            />
          }
        />

        <Route
          path="/login"
          element={
            user
              ? <Navigate replace to="/" />
              : <LoginForm
                login={login}
              />
          }
        />

        <Route
          path="/blogs/:id"
          element={
            <Blog
              blogs={blogs}
              user={user}
              likeBlog={likeBlog}
              deleteBlog={deleteBlog}
            />
          }
        />

        <Route
          path="/create"
          element={
            user
              ? <BlogForm
                addBlog={addBlog}
              />
              : <Navigate
                replace
                to="/login"
              />
          }
        />
      </Routes>
    </div>
  )
}

export default App
