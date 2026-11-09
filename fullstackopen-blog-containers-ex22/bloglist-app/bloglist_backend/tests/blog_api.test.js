
const { after, before, beforeEach, test } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const { MongoMemoryServer } = require('mongodb-memory-server')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token = ''
let mongoServer

before(async () => {
  mongoServer = await MongoMemoryServer.create()

  await mongoose.connect(mongoServer.getUri())
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const testPassword = 'sekret'
  const passwordHash = await bcrypt.hash(testPassword, 10)

  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash,
  })

  await user.save()

  const response = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'sekret',
    })


  token = response.body.token

  for (const blog of helper.initialBlogs) {
    const blogObject = new Blog({
      ...blog,
      user: user._id,
    })

    await blogObject.save()
  }
})

test('blogs returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(
    response.body.length,
    helper.initialBlogs.length
  )
})

test('unique identifier property id named id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog.__id, undefined)
  })
})

test('a valid blog post can be added', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'New Author',
    url: 'https://example.com/new-blog',
    likes: 7,
  }

  const blogsAtStart = await api.get('/api/blogs')

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await api.get('/api/blogs')

  assert.strictEqual(
    blogsAtEnd.body.length,
    blogsAtStart.body.length + 1
  )
})

test('likes defaults to 0 if missing', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'John Doe',
    url: 'https://example.com/no-likes',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'John Doe',
    url: 'https://example.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(400)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'A blog without URL',
    author: 'John Doe',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(400)
})

test('blog cannot be added without a token and returns 401', async () => {
  const newBlog = {
    title: 'Unauthorized Blog',
    author: 'Hacker',
    url: 'https://example.com/unauthorized',
  }

  const blogsAtStart = await helper.blogsInDb()

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(
    blogsAtEnd.length,
    blogsAtStart.length - 1
  )

  const titles = blogsAtEnd.map(blog => blog.title)

  assert.strictEqual(
    titles.includes(blogToDelete.title),
    false
  )
})

test('a blog likes can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedData = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 10,
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)

  assert.strictEqual(
    response.body.likes,
    blogToUpdate.likes + 10
  )

  const blogsAtEnd = await helper.blogsInDb()

  const updatedBlogInDb = blogsAtEnd.find(
    blog => blog.id === blogToUpdate.id
  )

  assert.strictEqual(
    updatedBlogInDb.likes,
    blogToUpdate.likes + 10
  )
})

after(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close()
    }
  } finally {
    if (mongoServer) {
      await mongoServer.stop()
    }
  }
})
