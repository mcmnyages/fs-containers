const { expect } = require('@playwright/test')


const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)

  await page.getByRole('button', {
    name: 'login',
  }).click()
}


const createNote = async (page, content) => {
  await page.getByRole('button', {
    name: 'new note',
  }).click()

  await page.getByRole('textbox').fill(content)

  await page.getByRole('button', {
    name: 'save',
  }).click()
}


const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', {
    name: 'create',
  }).click()

  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)

  await page.getByRole('button', {
    name: 'create',
  }).click()

  await expect(
    page.getByRole('link', {
      name: title,
    })
  ).toBeVisible()
}


const getBlog = (page, title) => {
  return page.getByRole('link', {
    name: title,
  }).first()
}


const likeBlog = async (page, blogLocator, times) => {
  await blogLocator.click()

  for (let i = 0; i < times; i++) {
    await page.getByRole('button', {
      name: 'like',
    }).click()

    await expect(
      page.getByText(`${i + 1} likes`)
    ).toBeVisible()
  }
}


const deleteBlog = async (page, blogLocator) => {
  await blogLocator.click()

  page.once('dialog', async dialog => {
    await dialog.accept()
  })

  await page.getByRole('button', {
    name: 'remove',
  }).click()
}


module.exports = {
  loginWith,
  createNote,
  createBlog,
  getBlog,
  likeBlog,
  deleteBlog,
}
