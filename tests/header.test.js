const Page = require('./helper/page');

let page
beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('The brand logo has a corrrect test', async () => {
  const text = await page.getContentOf('a.brand-logo');
  expect(text).toEqual('Blogster');
});

test('Click on the login to google link', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test('When sign in, shows  logout button', async () => {
  await page.login();
  const text = await page.getContentOf('a[href="/auth/logout"]');
  expect(text).toEqual('Logout');
});