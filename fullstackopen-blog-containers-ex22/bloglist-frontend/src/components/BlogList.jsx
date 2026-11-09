import { Link } from 'react-router-dom'
import {
  Typography,
  Box,
  Paper,
  Stack,
  Chip
} from '@mui/material'

const BlogList = ({ blogs }) => {
  const sortedBlogs = [...blogs].sort(
    (a, b) => b.likes - a.likes
  )

  return (
    <Box>
      <Typography
        variant="h6"
        component="h2"
        sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}
      >
        Blogs ({blogs.length})
      </Typography>

      <Stack spacing={1.5}>
        {sortedBlogs.map(blog => (
          <Paper
            key={blog.id}
            component={Link}
            to={`/blogs/${blog.id}`}
            elevation={0}
            variant="outlined"
            sx={{
              p: 2,
              textDecoration: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: 2,
              borderColor: 'divider',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderColor: 'primary.main',
              }
            }}
          >
            <Box sx={{ minWidth: 0, pr: 2 }}>
              <Typography
                variant="subtitle1"
                component="h3"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 0.5
                }}
              >
                {blog.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                by {blog.author}
              </Typography>
            </Box>

            <Chip
              label={`${blog.likes}`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 500, flexShrink: 0 }}
            />
          </Paper>
        ))}
      </Stack>
    </Box>
  )
}

export default BlogList