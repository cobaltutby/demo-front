import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../../app.component';

import { HeaderComponent } from '../../components/header/header.component';
import { DemoAppComponent } from '../../components/demo-app/demo-app.component';
import { EditRecordComponent } from '../../components/edit-record/edit-record.component';
import { EditUserComponent } from '../../components/edit-user/edit-user.component';

const Routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: 'JoggingApp',
        component: DemoAppComponent,
      },
      {
        path: 'EditRecord',
        component: EditRecordComponent,
      }
      ,
      {
        path: 'EditUser',
        component: EditUserComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(Routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
