import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {


  page: any
  input :any
  wip:any
  Compare:any
  InputPlan:any

  constructor() { }

  ngOnInit(): void {
    this.Compare = [
      { path: '/Compare', title: 'Compare', icon: 'assets/comparison.png', class: '' },
    ]

    this.page = [
      { path: '/model_yield', title: 'Yield By Model', icon: 'assets/yield-by-model.png', class: '' },
      { path: '/yield_by_type', title: 'Yield By Type', icon: 'assets/yield-by-type.png', class: '' },
      { path: '/BracketYield', title: 'Bracket', icon: 'assets/yield-bracket.png', class: '' },

    ]


    this.input = [
      { path: '/upload_yield', title: 'Upload Yield', icon: 'assets/excel_2.png', class: '' },
      { path: '/InputCompare', title: 'Upload Compare', icon: 'assets/excel_2.png', class: '' },
      { path: '/WIP_Upload', title: 'Upload WIP', icon: 'assets/excel_2.png', class: '' },
      { path: '/InputPlan', title: 'Upload Plan', icon: 'assets/excel_2.png', class: '' },
    ]








  }




}
