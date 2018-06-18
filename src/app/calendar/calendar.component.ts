import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CalendarDates } from './../abstraction/calendarDates.service';
import { CalendarEventsService } from 'app/services/calendarEvents.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  animations: [
    trigger('visible', [
      state('0', style({
        opacity: 0
      })),
      state('1', style({
        opacity: 1
      })),
      transition('0 => 1', animate(300)),
      transition('1 => 0', animate(300))
    ])
  ]
})
export class CalendarComponent implements OnInit {
  public eventsArray = [];
  public eventDate: any;
  public eventPoint = [];
  public eventFormated: any;
  public selectedDate: any;
  public event: any;
  public currentDate = moment();
  public dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  public weeks: CalendarDates[][] = [];
  public load: any;

  @Input() selectedDates: CalendarDates[] = [];

  constructor(private _calendarEventsService: CalendarEventsService) { }

  ngOnInit(): void {
    this.generateCalendar();
    this.getScheduledEvents();
  }

  // Get scheduled events method
  getScheduledEvents() {
    this._calendarEventsService
      .getCalendarEvents('../../assets/events.json',
      (results) => {
        for (const event of results.events) {
          this.eventsArray.push(event);
        }
        this.eventsArray.forEach(elem => {
          this.eventPoint.push(moment(new Date(elem.occurred_on * 1000)).format('DD/MM/YYYY'));
        });
      }, (error) => {
        console.log(error);
      });
    return this.eventsArray;
  }

  // date checkers
  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  isSelected(date: moment.Moment): boolean {
    return _.findIndex(this.selectedDates, (selectedDate) => {
      return moment(date).isSame(selectedDate.mDate, 'day');
    }) > -1;
  }

  isSelectedMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.currentDate, 'month');
  }

  // Check date
  selectDate(date: CalendarDates, event): void {
    this.selectedDate = date.mDate.format('DD/MM/YYYY');
    const selectedElements = document.getElementsByClassName('selected');
    for (let i = 0; i < selectedElements.length; i++) {
      selectedElements[i].classList.remove('selected');
    }
    event.target.className += ' selected';

    // Display Modal
    this.showModal(date, event);
  }

  // Modal functionality
  showModal(date: CalendarDates, event: any) {
    this.load = 0;
    this.event = '';
    this.formatDates(this.eventsArray);
    const modal = document.getElementById('calendar-modal');
    document.addEventListener('click', (evt) => {
      if (evt.target !== event.target) {
        modal.style.visibility = 'hidden';
        this.load = 0;
      } else {
        const offsetTop = event.target.classList.contains('week-date') ? event.target.offsetTop : event.target.parentNode.offsetTop;
        const offsetLeft = event.target.classList.contains('week-date') ? event.target.offsetLeft : event.target.parentNode.offsetLeft;
        modal.style.visibility = 'visible';
        modal.style.top = offsetTop + 35 + 'px';
        modal.style.left = offsetLeft + 'px';
        this.load = 1;
      }
    });
  }

  // formatt function
  formatDates(array: any) {
    array.forEach(elem => {
      this.eventFormated = '';
      this.eventFormated = moment(new Date(elem.occurred_on * 1000)).format('DD/MM/YYYY');
      if (this.eventFormated === this.selectedDate) {
        this.event = elem;
      }
    });
  }

  // actions from calendar
  prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
  }

  firstMonth(): void {
    this.currentDate = moment(this.currentDate).startOf('year');
    this.generateCalendar();
  }

  lastMonth(): void {
    this.currentDate = moment(this.currentDate).endOf('year');
    this.generateCalendar();
  }

  prevYear(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'year');
    this.generateCalendar();
  }

  nextYear(): void {
    this.currentDate = moment(this.currentDate).add(1, 'year');
    this.generateCalendar();
  }

  // generate the calendar grid
  generateCalendar(): void {
    const dates = this.fillDates(this.currentDate);
    const weeks: CalendarDates[][] = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;
  }

  // Get dates
  fillDates(currentMoment: moment.Moment): CalendarDates[] {
    const firstOfMonth = moment(currentMoment).startOf('month').day();
    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    const start = firstDayOfGrid.date();
    return _.range(start, start + 42)
      .map((date: number): CalendarDates => {
        const d = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(d),
          selected: this.isSelected(d),
          mDate: d,
        };
      });
  }

}
