
import {
  render,
  screen,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MemoryRouter,
  useLocation,
} from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

const LocationDisplay = () => {
  const location = useLocation()

  return <div data-testid="location">{location.pathname}</div>
}

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const addBlog = vi.fn().mockResolvedValue({
    title: 'React testing',
    author: 'John Doe',
    url: 'https://example.com',
  })

  render(
    <MemoryRouter initialEntries={['/blogs/new']}>
      <BlogForm addBlog={addBlog} />
      <LocationDisplay />
    </MemoryRouter>
  )

  const titleInput = screen.getByRole('textbox', {
    name: /title/i,
  })

  const authorInput = screen.getByRole('textbox', {
    name: /author/i,
  })

  const urlInput = screen.getByRole('textbox', {
    name: /url/i,
  })

  await user.type(titleInput, 'React testing')
  await user.type(authorInput, 'John Doe')
  await user.type(urlInput, 'https://example.com')

  await user.click(
    screen.getByRole('button', { name: /create/i })
  )

  expect(addBlog).toHaveBeenCalledTimes(1)

  expect(addBlog).toHaveBeenCalledWith({
    title: 'React testing',
    author: 'John Doe',
    url: 'https://example.com',
  })

  expect(titleInput).toHaveValue('')
  expect(authorInput).toHaveValue('')
  expect(urlInput).toHaveValue('')

  expect(screen.getByTestId('location')).toHaveTextContent('/')
})
