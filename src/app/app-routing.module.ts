import { BracketYieldComponent } from './page/yield/bracket-yield/bracket-yield.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadYieldComponent } from './page/yield/upload-yield/upload-yield.component';
import { ShowYieldComponent } from './page/yield/show-yield/show-yield.component';
import { SummaryYieldComponent } from './page/yield/summary-yield/summary-yield.component';
import { ModelYieldComponent } from './page/yield/model-yield/model-yield.component';
import { InputCompareComponent } from './page/Input/input-compare/input-compare.component';
import { CompareComponent } from './page/Compare/compare/compare.component';
import { WipUploadComponent } from './page/WIP/wip-upload/wip-upload.component';
import { InputPlanComponent } from './page/Input/input-plan/input-plan.component';


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
    path: 'InputCompare', component: InputCompareComponent
  },
  {
    path: 'InputPlan', component: InputPlanComponent
  },
  {
    path: 'Compare', component: CompareComponent
  },


  {
    path: 'WIP_Upload', component: WipUploadComponent
  },



  {
    path: '**',
    redirectTo: 'Compare'
    // redirectTo: 'dashboard'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
