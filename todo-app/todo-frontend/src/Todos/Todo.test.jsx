
import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import Todo from './Todo'

describe('Todo component', () => {
  const todo = {
    _id: '123',
    text: 'Learn Docker',
    done: false
  }

  test('renders todo text', () => {
    render(
      <Todo
        todo={todo}
        deleteTodo={vi.fn()}
        completeTodo={vi.fn()}
      />
    )

    expect(screen.getByText('Learn Docker')).toBeInTheDocument()
  })

  test('shows Set as done button when todo is not done', () => {
    render(
      <Todo
        todo={todo}
        deleteTodo={vi.fn()}
        completeTodo={vi.fn()}
      />
    )

    expect(screen.getByText('Set as done')).toBeInTheDocument()
  })

  test('shows This todo is done when todo is completed', () => {
    render(
      <Todo
        todo={{ ...todo, done: true }}
        deleteTodo={vi.fn()}
        completeTodo={vi.fn()}
      />
    )

    expect(screen.getByText('This todo is done')).toBeInTheDocument()
  })
})
