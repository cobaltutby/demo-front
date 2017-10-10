import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'; // old http
import { HttpClientModule } from '@angular/common/http'; // new http
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdNativeDateModule } from '@angular/material';
import {
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdChipsModule,
  MdDatepickerModule,
  MdDialogModule,
  MdExpansionModule,
  MdFormFieldModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdPaginatorModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdSortModule,
  MdTableModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  MdStepperModule,
} from '@angular/material';


import { AppRoutingModule } from './routing/app-routing/app-routing.module';

import { DndModule } from 'ng2-dnd';
import { Ng2ImgToolsModule } from 'ng2-img-tools';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';

import { TrialService } from './services/trial.service';
import { PPService } from './services/pp.service';
import { ConfigService } from './services/config.service';
import { DemoAppComponent } from './components/demo-app/demo-app.component';
import { EditRecordComponent } from './components/edit-record/edit-record.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';


// modal popups & commonn components

import { LoginComponent } from './services/login/login.component';

// pipes

import { NumberToFixedPipe } from './pipes/number-to-fixed';




@NgModule({
  declarations: [

    // common

    AppComponent,
    HeaderComponent,
    DemoAppComponent,
    EditRecordComponent,
    EditUserComponent,

    // modal services & common components

    LoginComponent,

    // pipes

    NumberToFixedPipe,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,

    // material
    MdNativeDateModule,
    // MdAutocompleteModule,
    MdButtonModule,
    // MdButtonToggleModule,
    MdCardModule,
    // MdCheckboxModule,
    // MdChipsModule,
    MdDatepickerModule,
    MdDialogModule,
    // MdExpansionModule,
    MdFormFieldModule,
    // MdGridListModule,
    MdIconModule,
    MdInputModule,
    // MdListModule,
    // MdMenuModule,
    // MdPaginatorModule,
    // MdProgressBarModule,
    // MdProgressSpinnerModule,
    // MdRadioModule,
    MdSelectModule,
    // MdSidenavModule,
    // MdSliderModule,
    // MdSlideToggleModule,
    // MdSnackBarModule,
    MdSortModule,
    MdTableModule,
    MdTabsModule,
    // MdToolbarModule,
    MdTooltipModule,
    // MdStepperModule,

    AppRoutingModule,
    ReactiveFormsModule,
    DndModule.forRoot(),
    Ng2ImgToolsModule
  ],
  entryComponents: [
    LoginComponent,
  ],
  providers: [
    TrialService,
    PPService,
    ConfigService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

