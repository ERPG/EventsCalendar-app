import * as moment from 'moment';

export interface CalendarDates {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
}
