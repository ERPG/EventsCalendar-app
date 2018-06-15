import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CalendarEventsService {
  constructor(
    private _http: Http
  ) { }

  public getCalendarEvents(url: string, success: any, e: any) {
    this._http.get(url)
      .map(res => res.json())
      .catch((err: Response) => {
        console.log(err);
        return [];
      })
      .subscribe((results) => {
        success(results);
      }, (err) => {
        console.log(err);
        Error(err);
      });
  }
};
