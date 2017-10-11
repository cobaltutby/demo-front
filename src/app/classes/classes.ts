import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// database tools

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

// external dependence's

import { MdSort } from '@angular/material';

export class RequestOptions {

  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType: 'arraybuffer';
  withCredentials?: boolean;
}

export class User {

  first_name: string;
  surname: string;
  password: string;
  email: string;
  admin: boolean;
  power_user: boolean;
  common_user: boolean;

  constructor(obj?: any) {

    this.first_name = _get('first_name', obj);
    this.surname = _get('surname', obj);
    this.password = _get('password', obj);
    this.email = _get('email', obj);
    this.admin = _get('admin', obj);
    this.power_user = _get('power_user', obj);
    this.common_user = _get('common_user', obj);
  }

}

export class CheckUserLoginResponse {

  logged_in: boolean;

  constructor(obj?: any) {

    this.logged_in = _get('logged_in', obj);
  }

}

export class CheckUserPasswordResponse {

  password_correct: boolean;

  constructor(obj?: any) {

    this.password_correct = _get('password_correct', obj);
  }

}

export class CheckUserEmailResponse {

  email_correct: boolean;

  constructor(obj?: any) {

    this.email_correct = _get('email_correct', obj);
  }

}

export class ApplicationDatabase {

  last_modified: number;
  user_data: Trip[];
  user_list: User[];

  constructor(obj?: any) {

    this.last_modified = Number(_get('last_modified', obj));
    this.user_data = _getArray('user_data', obj).map(element => new Trip(element));
    this.user_list = _getArray('user_list', obj).map(element => new User(element));

  }

}

export class Trip {

  email: string;
  cw: number;
  date: Date;
  distance: number;
  time: number;
  average_speed: number;

  constructor(obj?: any) {

    this.email = _get('email', obj);
    this.cw = Number(_get('cw', obj));
    this.date = new Date(_get('date', obj) || Date.now());
    this.distance = Number(_get('distance', obj));
    this.time = Number(_get('time', obj));
    this.average_speed = Number(_get('average_speed', obj));

  }

}

export class ReportData {

  cw: number;
  total_distance: number;
  average_speed: number;

  constructor(obj?: any) {

    this.cw = Number(_get('cw', obj));
    this.total_distance = Number(_get('total_distance', obj));
    this.average_speed = Number(_get('average_speed', obj));

  }

}

function _get(name: string, obj: any) {

  return (obj !== undefined && obj !== null && obj[name] !== undefined && (obj[name] !== null)) ? obj[name] : null;

}

function _getArray(name: string, obj: any) {

  return (obj !== undefined && obj !== null && obj[name] !== undefined && (obj[name] !== null)) ? obj[name] : [];

}


export class TripDatabase {

  dataChange: BehaviorSubject<Trip[]> = new BehaviorSubject<Trip[]>([]);
  get data(): Trip[] { return this.dataChange.value; }

  constructor(applicationDatabase: ApplicationDatabase) {

    applicationDatabase.user_data.forEach(trip => {
      this.addRow(trip);
    });
  }

  addRow(trip: Trip) {
    const copiedData = this.data.slice();
    copiedData.push(trip);
    this.dataChange.next(copiedData);
  }

  deleteRow(trip: Trip) {

    const copiedData = this.data.slice();
    let index_to_delete = -1;
    copiedData.forEach((element, index) => {
      if (element === trip) {
        index_to_delete = index;
        return;
      }
    });
    if (index_to_delete > -1) {
      copiedData.splice(index_to_delete, 1);
      this.dataChange.next(copiedData);
    }

  }
}


export class UserDatabase {

  dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  get data(): User[] { return this.dataChange.value; }

  constructor(applicationDatabase: ApplicationDatabase) {

    applicationDatabase.user_list.forEach(user => {
      this.addRow(user);
    });
  }

  addRow(user: User) {
    const copiedData = this.data.slice();
    copiedData.push(user);
    this.dataChange.next(copiedData);
  }

  deleteRow(user: User) {

    const copiedData = this.data.slice();
    let index_to_delete = -1;
    copiedData.forEach((element, index) => {
      if (element === user) {
        index_to_delete = index;
        return;
      }
    });
    if (index_to_delete > -1) {
      copiedData.splice(index_to_delete, 1);
      this.dataChange.next(copiedData);
    }
  }

}


export class RecordsDataSource extends DataSource<any> {
  constructor(private _database: TripDatabase, private _sort: MdSort, public user: User) {
    super();
  }

  connect(): Observable<Trip[]> {
    const displayDataChanges = [
      this._database.dataChange,
      this._sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData(this.user);
    });
  }

  disconnect() { }

  getSortedData(user: User): Trip[] {
    const data = this._database.data.filter(record => {
      return record.email === user.email
    })

    if (!this._sort.active || this._sort.direction === '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'date_records': [propertyA, propertyB] = [Date.parse(a.date.toString()), Date.parse(a.date.toString())]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}



export class ReportsDataSource extends DataSource<any> {
  constructor(private _database: TripDatabase, private _sort: MdSort, public user: User) {
    super();
  }

  connect(): Observable<ReportData[]> {
    const displayDataChanges = [
      this._database.dataChange,
      this._sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData(this.user);
    });
  }

  disconnect() { }

  getSortedData(user: User): ReportData[] {
    const filtered_data = this._database.data.filter(record => {
      return record.email === user.email
    })
    const data = createReportTable(filtered_data);

    if (!this._sort.active || this._sort.direction === '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'week': [propertyA, propertyB] = [a.cw, b.cw]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}


export class UserDataSource extends DataSource<any> {
  constructor(private _database: UserDatabase, private _sort: MdSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<User[]> {
    const displayDataChanges = [
      this._database.dataChange,
      this._sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });
  }

  disconnect() { }

  /** Returns a sorted copy of the database data. */
  getSortedData(): User[] {
    const data = this._database.data.slice();
    return data;
  }
}

export class AllRecordsDataSource extends DataSource<any> {
  constructor(private _database: TripDatabase, private _sort: MdSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Trip[]> {
    const displayDataChanges = [
      this._database.dataChange,
      this._sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });
  }

  disconnect() { }

  /** Returns a sorted copy of the database data. */
  getSortedData(): Trip[] {
    const data = this._database.data.slice();
    if (!this._sort.active || this._sort.direction === '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'date': [propertyA, propertyB] = [Date.parse(a.date.toString()), Date.parse(a.date.toString())]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}

function getWeek(date?: string) {

  if (!date) {
    return;
  }
  const value = date || new Date().toJSON().slice(0, 10);
  const target = new Date(value);
  const dayNr = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);

}


function createReportTable(user_data: Trip[]) {

  const week_list = getWeeksList(user_data);
  return createDataRows(week_list, user_data);

}

function createDataRows(week_list: string[], user_data: Trip[]) {

  const copiedData: ReportData[] = [];

  week_list.forEach(week => {
    const tmp_row = new ReportData;
    tmp_row.cw = Number(week);
    tmp_row.total_distance = calculateWeekDistance(tmp_row.cw, user_data);
    tmp_row.average_speed = calculateWeekAvs(tmp_row.cw, tmp_row.total_distance, user_data);
    copiedData.push(tmp_row);
  });
  return copiedData;
}


function getWeeksList(user_data: Trip[]) {

  const copiedData = user_data.slice();
  const weeks_list: string[] = [];
  copiedData.forEach(element => {
    if (element.cw) {
      weeks_list.push(element.cw.toString());
    } else {
      weeks_list.push(getWeek(element.date.toString()).toString());
    }

  });

  return unique(weeks_list);

}

function calculateWeekDistance(week: number, user_data: Trip[]) {

  let week_distance = 0;
  user_data.forEach(data_row => {
    if (!data_row.cw) {
      data_row.cw = getWeek(data_row.date.toString());
    }
    if (week === data_row.cw) {
      week_distance = week_distance + data_row.distance;
    }

  });
  return week_distance;

}

function calculateWeekAvs(week: number, total_distance: number, user_data: Trip[]) {

  let total_time = 0;
  user_data.forEach(data_row => {
    if (!data_row.cw) {
      data_row.cw = getWeek(data_row.date.toString());
    }
    if (week === data_row.cw) {
      total_time = total_time + data_row.time;
    }

  });
  if (total_time) {
    return (total_distance / 1000) / (total_time / 3600);
  } else {
    return null;
  }

}

function unique(arr: string[]) {
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    const str = arr[i];
    obj[str] = true;
  }
  return Object.keys(obj);
}

function getTimeFromString(time: string) {

  if (time) {
    let hours: string;
    time.indexOf(':') > -1 ? hours = time.slice(0, time.indexOf(':')) : hours = time.slice();
    time.indexOf(':') > -1 ? time = time.slice(time.indexOf(':') + 1, time.length) : time = '';

    let minutes: string;
    time.indexOf(':') > -1 ? minutes = time.slice(0, time.indexOf(':')) : minutes = time.slice();
    time.indexOf(':') > -1 ? time = time.slice(time.indexOf(':') + 1, time.length) : time = '';

    let seconds: string;
    time.indexOf(':') > -1 ? seconds = time.slice(0, time.indexOf(':')) : seconds = time.slice();

    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);

  } else {

    return null;

  }

}

function getTime(time: number) {

  if (time) {
    let time_in_seconds = time;
    const hours = Math.floor(time_in_seconds / 3600);
    time_in_seconds = time_in_seconds - hours * 3600;
    const minutes = Math.floor(time_in_seconds / 60);
    time_in_seconds = time_in_seconds - minutes * 60;
    const seconds = time_in_seconds;

    return hours.toString() + ':' + minutes.toString() + ':' + seconds.toString();

  }

}


