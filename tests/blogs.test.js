const Page = require('./helper/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
})

describe('When logged in ', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('can see the blog create form', async () => {
    const titleLabel = await page.getContentOf('form label');
    expect(titleLabel).toEqual('Blog Title')
  });

  describe('And using invalid inputs ', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });

    test('the form shows error message', async () => {
      const error1 = await page.getContentOf('.title .red-text');
      const error2 = await page.getContentOf('.content .red-text');

      expect(error1).toEqual('You must provide a value');
      expect(error2).toEqual('You must provide a value');
    });
  });

  describe('And using valid input', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Title');
      await page.type('.content input', 'My Content');
      await page.click('form button');
    });

    test('submitting takes user to review screen', async () => {
      const title = await page.getContentOf('form h5');
      expect(title).toEqual('Please confirm your entries')

    });

    test('submitting the saving adds blog to the blog index page', async () => {
      await page.click('button.green');
      await page.waitFor('.card');

      const title = await page.getContentOf('.card-title');
      const content = await page.getContentOf('p');

      expect(title).toEqual('My Title');
      expect(content).toEqual('My Content');
    });
  });
});

describe('User is not logged in', async () => {
  const actions = [{
    method: 'get',
    path: '/api/blogs'
  }, {
    method: 'post',
    path: '/api/blogs',
    data: {
      title: 'T',
      content: 'C'
    }
  }];

  test('Blog related actions are prohibited', async () => {
    const results = await page.execRequests(actions);

    for (let result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });
});

/*
When not logged in
  create apost results in an error
  viewing apost results in an error

when logged in
  can see the form
  when using valid form inputs
    submitting takes user to review screen
    submitting then saving adds blog to 'blog index' page
  when using invalid inputs
    submitting shows error messages


  fetch('/api/blogs', {
    method: 'POST',
    credentials: 'same-origin',
    header: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: 'My Title1', content: 'My Content1'})
  })
 */