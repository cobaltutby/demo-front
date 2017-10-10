import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as Classes from '../classes/classes';


import * as Services from '../services/services';

@Injectable()
export class TrialService {

  current_user: Classes.User;
  database: Classes.ApplicationDatabase;
  record_to_edit: Classes.Trip;
  user_to_edit: Classes.User;

  current_user_ls = 'current_user_ls';
  database_ls = 'database_ls';
  user_list_ls = 'user_list_ls';

  constructor() {

  }

  unique(arr: string[]) {
    const obj = {};
    for (let i = 0; i < arr.length; i++) {
      const str = arr[i];
      obj[str] = true;
    }
    return Object.keys(obj);
  }

  getTimeFromString(time: string) {

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

  getTime(time: number) {

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

  getWeek(date?: string) {

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

}
