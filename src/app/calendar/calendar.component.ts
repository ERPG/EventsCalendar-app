import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CalendarDates } from './../abstraction/calendarDates.service';
import { CalendarEventsService } from 'app/services/calendarEvents.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {
  public results: any;
  currentDate = moment();
  dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  weeks: CalendarDates[][] = [];
  sortedDates: CalendarDates[] = [];

  @Input() selectedDates: CalendarDates[] = [];
  @Output() onSelectDate = new EventEmitter<CalendarDates>();

  constructor(private _calendarEventsService: CalendarEventsService) { }

  ngOnInit(): void {
    this.generateCalendar();
    this.getScheduledEvents();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDates &&
      changes.selectedDates.currentValue &&
      changes.selectedDates.currentValue.length > 1) {
      // sort on date changes for better performance when range checking
      this.sortedDates = _.sortBy(changes.selectedDates.currentValue, (m: CalendarDates) => m.mDate.valueOf());
      this.generateCalendar();
    }
  }

  // Get events method
  getScheduledEvents() {
    this._calendarEventsService
      .getCalendarEvents('../../assets/events.json',
      (results) => {
        console.log(results);
        this.results = results.content;
      }, (error) => {
        console.log(error);
      });
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

  selectDate(date: CalendarDates, event): void {
    const selectedElements = document.getElementsByClassName('selected');
    for (let i = 0; i < selectedElements.length; i++) {
      console.log(selectedElements[i]);
      selectedElements[i].classList.remove('selected');
    }
    event.target.className += ' selected';
    this.showModal(event);

    // this.onSelectDate.emit(date);
  }

  // Modal functionality
  showModal(event: any) {
    const modal = document.getElementById('calendar-modal');
    document.addEventListener('click', (evt) => {
      if (evt.target !== event.target) {
        modal.style.visibility = 'hidden';
      } else {
        const offsetTop = event.target.offsetTop;
        const offsetLeft = event.target.offsetLeft;
        modal.style.visibility = 'visible';
        modal.style.top = offsetTop + 35 + 'px';
        modal.style.left = offsetLeft + 'px';
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
