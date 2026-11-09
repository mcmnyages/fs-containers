import {
  test,
  expect,
} from '@playwright/test'

const TEST_USERNAME = 'testuser'
const TEST_PASSWORD = 'password'

const {
  loginWith,
  createBlog,
  getBlog,
  likeBlog,
  deleteBlog,
} = require('./helper')


test.beforeEach(async ({ page, request }) => {
  await request.post(
    'http://localhost:3003/api/testing/reset'
  )

  await request.post(
    'http://localhost:3003/api/users',
    {
      data: {
        username: TEST_USERNAME,
        password: TEST_PASSWORD,
        name: 'Test User',
      },
    }
  )

  await page.goto(
    'http://localhost:5173'
  )
})


test('login succeeds with correct credentials', async ({ page }) => {
  await page.getByRole('link', {
    name: 'login',
  }).click()

  await loginWith(
    page,
    TEST_USERNAME,
    TEST_PASSWORD
  )

  await expect(
    page.getByText('Test User logged in')
  ).toBeVisible()
})


test('login fails with incorrect credentials', async ({ page }) => {
  await page.getByRole('link', {
    name: 'login',
  }).click()

  await loginWith(
    page,
    'wronguser',
    'wrongpassword'
  )

  await expect(
    page.getByText(
      'wrong username or password'
    )
  ).toBeVisible()
})


test('logged-in user can create a blog', async ({ page }) => {
  await page.getByRole('link', {
    name: 'login',
  }).click()

  await loginWith(
    page,
    TEST_USERNAME,
    TEST_PASSWORD
  )

  await createBlog(
    page,
    'My Playwright Blog',
    'Test User',
    'https://example.com'
  )

  await expect(
    getBlog(
      page,
      'My Playwright Blog'
    )
  ).toBeVisible()
})


test('logged-in user can like a blog', async ({ page }) => {
  await page.getByRole('link', {
    name: 'login',
  }).click()

  await loginWith(
    page,
    TEST_USERNAME,
    TEST_PASSWORD
  )

  await createBlog(
    page,
    'Blog To Like',
    'Test User',
    'https://example.com'
  )

  const blog = getBlog(
    page,
    'Blog To Like'
  )

  await likeBlog(
    page,
    blog,
    1
  )

  await expect(
    page.getByText('1 likes')
  ).toBeVisible()
})


test('logged-in user can delete a blog', async ({ page }) => {
  await page.getByRole('link', {
    name: 'login',
  }).click()

  await loginWith(
    page,
    TEST_USERNAME,
    TEST_PASSWORD
  )

  await createBlog(
    page,
    'Blog To Delete',
    'Test User',
    'https://example.com'
  )

  const blog = getBlog(
    page,
    'Blog To Delete'
  )

  await deleteBlog(
    page,
    blog
  )

  await expect(
    page.getByRole('link', {
      name: 'Blog To Delete',
    })
  ).not.toBeVisible()
})
