const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog) => {
    if (!favorite || blog.likes > favorite.likes) {
      return blog
    }

    return favorite
  }, null)
}


const mostBlogs = (blogs) => {
  const blogCounts = {}

  blogs.forEach(blog => {
    if (!blogCounts[blog.author]) {
      blogCounts[blog.author] = 0
    }

    blogCounts[blog.author] += 1
  })

  return Object.entries(blogCounts).reduce((most, current) => {
    const [author, blogs] = current

    if (blogs > most.blogs) {
      return {
        author,
        blogs
      }
    }

    return most
  }, {
    author: '',
    blogs: 0
  })
}

const mostLikes = (blogs) => {
  const authorLikes = {}

  blogs.forEach(blog => {
    if (!authorLikes[blog.author]) {
      authorLikes[blog.author] = 0
    }

    authorLikes[blog.author] += blog.likes
  })

  return Object.entries(authorLikes).reduce((most, current) => {
    const [author, likes] = current

    if (likes > most.likes) {
      return {
        author,
        likes
      }
    }

    return most
  }, {
    author: '',
    likes: 0
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}