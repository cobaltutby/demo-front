import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as Services from '../../services/services';
import * as Classes from '../../classes/classes';

@Component({
  selector: 'app-edit-record',
  templateUrl: './edit-record.component.html',
  styleUrls: ['./edit-record.component.css']
})
export class EditRecordComponent implements OnInit {

  time_string: string;
  edit: boolean;

  constructor(

    public route: ActivatedRoute,
    public router: Router,
    public trialService: Services.TrialService,
    public ppService: Services.PPService,

  ) {

  }
  ngOnInit() {

    if (this.trialService.record_to_edit) {
      this.edit = true;
    } else {
      this.trialService.record_to_edit = new Classes.Trip;
    }
    this.trialService.record_to_edit.email = this.trialService.current_user.email;
    this.time_string = this.trialService.getTime(this.trialService.record_to_edit.time);
  }

  getAverageSpeed(row: Classes.Trip) {

    if (row) {
      return (row.distance / 1000) / row.time;
    }

  }

  setCurrentTimeFromString() {

    this.trialService.record_to_edit.time = this.trialService.getTimeFromString(this.time_string);

  }

  submit() {

    if (!this.edit) {
      this.trialService.database.user_data.push(this.trialService.record_to_edit);
    }

    this.ppService.saveDatabaseToLS(this.trialService.database);

    this.router.navigate(['JoggingApp']);

  }

  setWeek() {

    if (this.trialService.record_to_edit.date) {
      this.trialService.record_to_edit.cw = this.trialService.getWeek(this.trialService.record_to_edit.date.toString());
    }
  }


}

