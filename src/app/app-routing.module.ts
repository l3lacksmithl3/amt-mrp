import { BracketYieldComponent } from './page/yield/bracket-yield/bracket-yield.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadYieldComponent } from './page/yield/upload-yield/upload-yield.component';
import { ShowYieldComponent } from './page/yield/show-yield/show-yield.component';
import { SummaryYieldComponent } from './page/yield/summary-yield/summary-yield.component';
import { ModelYieldComponent } from './page/yield/model-yield/model-yield.component';


const routes: Routes = [

  {
    path: 'dashboard_yield', component: ShowYieldComponent
  },
  {
    path: 'yield_by_type', component: SummaryYieldComponent
  },
  {
    path: 'BracketYield', component: BracketYieldComponent
  },
  {
    path: 'upload_yield', component: UploadYieldComponent
  },
  {
    path: 'model_yield', component: ModelYieldComponent
  },



  {
    path: '**',
    redirectTo: 'upload_yield'
    // redirectTo: 'dashboard'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
