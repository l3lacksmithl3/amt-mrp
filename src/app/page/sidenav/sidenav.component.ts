import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {


  page: any
  constructor() { }

  ngOnInit(): void {

    this.page = [
      { path: '/dashboard_yield', title: 'Yield By Model', icon: 'assets/yield-by-model.png', class: '' },
      { path: '/yield_by_type', title: 'Yield By Type', icon: 'assets/yield-by-type.png', class: '' },
      { path: '/BracketYield', title: 'Bracket', icon: 'assets/yield-bracket.png', class: '' },
      { path: '/upload_yield', title: 'Upload', icon: 'assets/upload-folder.png', class: '' },
    ]
  }




}
