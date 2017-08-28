import {UmiApplicationClientPage} from './app.po';

describe('umi-application-client App', () => {
  let page: UmiApplicationClientPage;

  beforeEach(() => {
    page = new UmiApplicationClientPage();
  });

  it('Home title should be "home works!"', async () => {
    page.navigateTo();

    expect(await page.getParagraphText()).toEqual('home works!'); // using async/await
    // Is the same as :
    /* // add : import {browser, element, by} from 'protractor';
    element(by.css('h1')).getText().then(function (text) {
      expect(text).toEqual('home works!');
    });*/
  });
});
