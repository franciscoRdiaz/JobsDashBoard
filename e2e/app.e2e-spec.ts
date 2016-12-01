import { JobsDashBoardPage } from './app.po';

describe('jobs-dash-board App', function() {
  let page: JobsDashBoardPage;

  beforeEach(() => {
    page = new JobsDashBoardPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
