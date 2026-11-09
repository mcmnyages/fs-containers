
import {
  render,
  screen,
} from '@testing-library/react'
import {
  MemoryRouter,
  Routes,
  Route,
} from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import Blog from './Blog'

const blog = {
  id: '123',
  title: 'React testing',
  author: 'John Doe',
  url: 'https://example.com',
  likes: 10,
  user: {
    username: 'johndoe',
    name: 'John Doe',
  },
}

const renderBlog = (user) => {
  render(
    <MemoryRouter initialEntries={['/blogs/123']}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blogs={[blog]}
              user={user}
              likeBlog={vi.fn()}
              deleteBlog={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

test('unauthenticated user sees blog information but no buttons', () => {
  renderBlog(null)

  expect(
    screen.getByText('React testing')
  ).toBeDefined()

  expect(
    screen.getByText(/10\s*likes/i)
  ).toBeDefined()

  expect(
    screen.queryByRole('button', { name: /like/i })
  ).toBeNull()

  expect(
    screen.queryByRole('button', { name: /remove/i })
  ).toBeNull()
})

test('authenticated user who is not the creator sees like button but not delete button', () => {
  const user = {
    username: 'someoneelse',
    name: 'Someone Else',
  }

  renderBlog(user)

  expect(
    screen.getByText('React testing')
  ).toBeDefined()

  expect(
    screen.getByRole('button', { name: /like/i })
  ).toBeDefined()

  expect(
    screen.queryByRole('button', { name: /remove/i })
  ).toBeNull()
})

test('blog creator sees both like and delete buttons', () => {
  const user = {
    username: 'johndoe',
    name: 'John Doe',
  }

  renderBlog(user)

  expect(
    screen.getByRole('button', { name: /like/i })
  ).toBeDefined()

  expect(
    screen.getByRole('button', { name: /remove/i })
  ).toBeDefined()
})
