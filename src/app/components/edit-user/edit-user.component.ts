import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormControl, Validators } from '@angular/forms';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


import * as Services from '../../services/services';
import * as Classes from '../../classes/classes';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  roles = ['Admin', 'Manager', 'User'];
  selected_role: string;
  edit: boolean;
  repeat_password: string;
  email_list: string[];
  new_email_valid: boolean;
  r_password_valid: boolean;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(EMAIL_REGEX)]);

  constructor(

    public route: ActivatedRoute,
    public router: Router,
    public trialService: Services.TrialService,
    public ppService: Services.PPService,

  ) {
    this.repeat_password = null;
    this.email_list = [];
    this.new_email_valid = true;
    this.r_password_valid = true;
  }

  ngOnInit() {

    if (this.trialService.user_to_edit) {
      this.edit = true;
    } else {
      this.trialService.user_to_edit = new Classes.User;
    }

    this.selected_role = this.getUserRole();

    this.trialService.database.user_list.forEach(user => {
      this.email_list.push(user.email);
    });

  }


  submit() {
    if (!this.edit) {
      this.trialService.database.user_list.push(this.trialService.user_to_edit);
    }

    this.ppService.saveDatabaseToLS(this.trialService.database);

    if (this.trialService.current_user.email === 'guest@email') {
      this.trialService.current_user = this.trialService.user_to_edit;
      localStorage.setItem(this.trialService.current_user_ls, JSON.stringify(this.trialService.current_user));

    }
    this.router.navigate(['JoggingApp']);


  }

  onRoleSelect() {

     // some stupid hardcode. need to change later!

    if (this.selected_role === this.roles[0]) {
      this.trialService.user_to_edit.admin = true;
      this.trialService.user_to_edit.power_user = true;
      this.trialService.user_to_edit.common_user = true;

    }
    if (this.selected_role === this.roles[1]) {
      this.trialService.user_to_edit.admin = false;
      this.trialService.user_to_edit.power_user = true;
      this.trialService.user_to_edit.common_user = true;
    }
    if (this.selected_role === this.roles[2]) {
      this.trialService.user_to_edit.admin = false;
      this.trialService.user_to_edit.power_user = false;
      this.trialService.user_to_edit.common_user = true;
    }
  
  }

  getUserRole() {

    if (this.trialService.user_to_edit.admin) {
      return this.roles[0];
    }
    if (this.trialService.user_to_edit.power_user) {
      return this.roles[1];
    }
    if (this.trialService.user_to_edit.common_user) {
      return this.roles[2];
    }
    return this.roles[2];
  }

  checkEmail() {

    if (!this.edit && this.email_list.some((element) => {
      return element === this.trialService.user_to_edit.email
    })) {
      this.new_email_valid = false;
      return;
    }
    this.new_email_valid = true;
  }

  checkRPassword() {
    if (!this.edit && this.repeat_password && (this.repeat_password !== this.trialService.user_to_edit.password)) {
      this.r_password_valid = false;
      return;
    }
    this.r_password_valid = true;
  }

}

