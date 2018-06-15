import { EventsCalendarAppPage } from './app.po';

describe('events-calendar-app App', () => {
  let page: EventsCalendarAppPage;

  beforeEach(() => {
    page = new EventsCalendarAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
