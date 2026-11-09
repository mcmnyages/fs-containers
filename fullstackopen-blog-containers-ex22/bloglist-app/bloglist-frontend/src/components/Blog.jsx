
import {
  useParams,
  useNavigate,
} from 'react-router-dom'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
} from '@mui/material'

const Blog = ({ blogs, user, likeBlog, deleteBlog }) => {
  const id = useParams().id
  const navigate = useNavigate()

  const blog = blogs.find(
    blog => blog.id === id
  )

  if (!blog) {
    return null
  }

  const handleLike = () => {
    likeBlog(blog)
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete blog "${blog.title}"?`
    )

    if (!confirmed) {
      return
    }

    await deleteBlog(blog.id)
    navigate('/')
  }

  const isCreator =
    user &&
    blog.user &&
    blog.user.username === user.username

  return (
    <Card
      sx={{
        maxWidth: 700,
        mb: 3,
        mt: 3,
      }}
    >
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {blog.title}
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          gutterBottom
        >
          by {blog.author}
        </Typography>

        <Typography
          component="a"
          href={blog.url}
          target="_blank"
          rel="noreferrer"
          sx={{
            display: 'block',
            mb: 2,
          }}
        >
          {blog.url}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Added by {blog.user.name}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
          }}
        >
          <Typography>
            {blog.likes} likes
          </Typography>

          {user && (
            <Button
              variant="contained"
              onClick={handleLike}
            >
              Like
            </Button>
          )}

          {isCreator && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
            >
              Remove
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default Blog
