import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { CalendarEventsService } from 'app/services/calendarEvents.service';
import { CalendarComponent } from './calendar.component';

const events = [
  {
    'description': 'fake_event1',
    'id': '1eed5edc-f58f-4989-aba0-9cddc08a0896',
    'occurred_on': 'fake_date1'
  },
  {
    'description': 'fake_event2',
    'id': '647333b5-c0bb-47e9-bcab-f15765dca5f5',
    'occurred_on': 'fake_date2'
  },
  {
    'description': 'fake_event3',
    'id': '5bcd71cd-f7f4-4a3b-8df6-9789c818a137',
    'occurred_on': 'fake_date3'
  }
];

class CalendarEventsServiceStub {
  getCalendarEvents() {
    return events;
  }
}

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarComponent],
      providers: [
        { provide: CalendarEventsService, useClass: CalendarEventsServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the current Month', () => {
    const elt = fixture.nativeElement.querySelector('span.CurrentMonth');
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    const month = d.getMonth();
    fixture.detectChanges();
    expect(elt.innerText).toEqual(monthNames[month]);
  });

  it('should return the current year', () => {
    const elt = fixture.nativeElement.querySelector('span.CurrentYear');
    const d = new Date();
    const year = d.getFullYear();
    fixture.detectChanges();
    expect(parseInt(elt.innerText)).toEqual(year);
  });

  it('should return the days of the week', () => {
    const elt = fixture.nativeElement.querySelectorAll('div.day-name');

    fixture.detectChanges();

    expect(elt[1].innerText).toEqual('MON');
    expect(elt[2].innerText).toEqual('TUE');
    expect(elt[3].innerText).toEqual('WED');
    expect(elt[4].innerText).toEqual('THU');
    expect(elt[5].innerText).toEqual('FRI');
    expect(elt[6].innerText).toEqual('SAT');
    expect(elt[0].innerText).toEqual('SUN');
  });
});
