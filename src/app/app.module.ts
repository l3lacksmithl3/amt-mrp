import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from './material/material.module';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from "ngx-ui-loader";
import { SidenavComponent } from './page/sidenav/sidenav.component';
import { UploadYieldComponent } from './page/yield/upload-yield/upload-yield.component';
import { FormsModule } from '@angular/forms';
import { ShowYieldComponent } from './page/yield/show-yield/show-yield.component';
import { AgGridModule } from 'ag-grid-angular';
import { SummaryYieldComponent } from './page/yield/summary-yield/summary-yield.component';
import { BracketYieldComponent } from './page/yield/bracket-yield/bracket-yield.component';
import { ModelYieldComponent } from './page/yield/model-yield/model-yield.component';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "red",
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounce, // background spinner type
  fgsType: SPINNER.threeStrings, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
  // "text": "Loading . . .",
};

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    UploadYieldComponent,
    ShowYieldComponent,
    SummaryYieldComponent,
    BracketYieldComponent,
    ModelYieldComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    MaterialModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    FormsModule,
    CommonModule,
    HttpClientModule,
    AgGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
