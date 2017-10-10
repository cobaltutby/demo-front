import { Component } from '@angular/core';

import * as Services from './services/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  constructor(public trialService: Services.TrialService) {

  }
}
