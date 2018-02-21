import { Selector } from 'testcafe';

const serverUrl = 'http://localhost:8000';

fixture `docs.angularjs.org`

test.page(`${serverUrl}/build/docs/index-production.html`)
  ('clicking a link to a service', async t => {

  await t.click('.definition-table td a[href="api/ng/directive/ngClick"]');

  const mainHeader = Selector('.main-body h1');
  await t.expect(mainHeader.innerText).eql('ngClick');
});

test.page(`${serverUrl}/build/docs/index-production.html#!api/ng/directive/ngClick`)
  ('should include the files for the embedded examples from the same domain', async t => {

  const pageOrigin = await t.eval(() => document.location.origin);
  const exampleIFrame = Selector('[name=example-ng-click]');

  // This is technically an implementation detail, but if this changes, then there's a good
  // chance the deployment process changed
  await t.expect(exampleIFrame.getAttribute('src')).contains('examples/example-ng-click/index.html');

  await t.switchToIframe(exampleIFrame);

  // Ensure the included script is from the same domain
  // - first that the origins are the same
  const frameOrigin = await t.eval(() => document.location.origin);
  await t.expect(pageOrigin).eql(frameOrigin);
  // - second that the src url is relative
  const scriptEl = Selector(() => document.scripts[0]);
  await t.expect(scriptEl.getAttribute('src')).match(/^[^:]*\//);
});

test.page(`${serverUrl}/build/docs/index-production.html#!/api/ng/function/angular.noop/`)
  ('should be resilient to trailing slashes', async t => {

  const mainHeader = Selector('.main-body h1 ');
  await t.expect(mainHeader.innerText).eql('angular.noop');
});

test.page(`${serverUrl}/build/docs/index-production.html#!/api/ng/function/angular.noop/index`)
  ('should be resilient to trailing "index"', async t => {

  const mainHeader = Selector('.main-body h1');
  await t.expect(mainHeader.innerText).eql('angular.noop');
});

test.page(`${serverUrl}/build/docs/index-production.html#!/api/ng/function/angular.noop/index/`)
  ('should be resilient to trailing "index/"', async t => {

  const mainHeader = Selector('.main-body h1');
  await t.expect(mainHeader.innerText).eql('angular.noop');
});

test.page(`${serverUrl}/build/docs/index-production.html#!error/ng/areq?p0=Missing&p1=not%20a%20function,%20got%20undefined`)
  ('should display formatted error messages on error doc pages', async t => {

  const errorMessage = Selector('.minerr-errmsg');
  await t.expect(errorMessage.innerText).eql('Argument \'Missing\' is not a function, got undefined');
});

test.page(`${serverUrl}/build/docs/index-production.html#!/api/does/not/exist`)
  ('should display an error if the page does not exist', async t => {

  const mainHeader = Selector('.main-body h1');
  await t.expect(mainHeader.innerText).eql('Oops!');
});