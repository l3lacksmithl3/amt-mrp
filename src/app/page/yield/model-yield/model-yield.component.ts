import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import * as moment from 'moment';
import { GridOptions } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-model-yield',
  templateUrl: './model-yield.component.html',
  styleUrls: ['./model-yield.component.scss']
})
export class ModelYieldComponent implements OnInit {

  constructor(
    private api: HttpService,
    private ngxService: NgxUiLoaderService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  startDate: any;
  endDate: any;

  moment: any = moment
  rawdata: any

  list: any

  rowData: any
  columnDefs: any
  rowData_PU: any
  columnDefs_PU: any

  head: any
  dateSelect: any
  Zoom: any = 65
  labelHead: any
  data: any

  primaryColor = 'blue'

  index_head: any = []
  length_index: any = []
  date_select: any
  dataRaw: any
  average: any
  data_average: any

  model_hide: any = true
  data_pu: any

  //TODO key
  key_model: any
  key_customer: any
  key_Type: any
  key_AD: any
  key_Input: any = {}

  PU_key_model: any
  PU_key_customer: any
  PU_key_Type: any
  PU_key_AD: any
  PU_key_Input: any = {}


  gridOptions: GridOptions<any> = {
    accentedSort: true,
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    defaultColDef: {
      sortable: true,
      filter: true,
      // editable: true,
      floatingFilter: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },

    },


  }

  displayedColumns: string[] = ['Model','Customer','Type','AD','0','1'];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;

  async ngOnInit() {
    this.date_select = moment('10/1/2023').format()
    this.Data_Model()
    this.BTN_PU()
  }




  async Data_Model() {

    this.endDate = moment(this.date_select).format()
    this.startDate = moment(this.date_select).subtract(3, 'month').format()

    let data_list = {
      date: {
        $gte: moment(this.startDate).startOf("month").toDate(),
        $lte: moment(this.endDate).startOf("month").toDate(),
      }
    }
    this.dataRaw = await lastValueFrom(this.api.YieldGetByCondition(data_list))


    //TODO Datashow
    // console.log("🚀 ~ file: show-yield.component.ts:106 ~ ShowYieldComponent ~ Data_Model ~ this.dataRaw:", this.dataRaw)
    let model: any = [...new Set(this.dataRaw.map((item: any) => item['Model No']))];
    let date: any = [...new Set(this.dataRaw.map((item: any) => item.date))];

    let koo = model.map((d: any) => {
      let Select_Data = this.dataRaw.filter((a: any) => a['Model No'] == d)[0]
      return {
        Model: d,
        Customer: Select_Data['Customer part number'],
        Type: Select_Data['Type'],
        StatusType: Select_Data['statusType'],
        TypeAD: Select_Data['Analog / Digital'],
        value: date.map((a: any) => {
          return this.dataRaw.filter((b: any) => b['Model No'] == d && b['date'] == a)[0]
        })
      }

    })

    this.labelHead = date
    this.data = koo
    this.index_head = []
    for (let index = 1; index <= date.length * 3; index++) {
      this.index_head.push(index % this.labelHead.length)
    }
    this.length_index = [...this.index_head]
    this.length_index.push("s")
    this.length_index.push("s")
    this.length_index.push("s")
    this.length_index.push("s")
    this.index_head.sort()
    date.sort()

    // console.log(date.length);

    this.data = this.data.map((d: any) => {
      let aoo = this.dataRaw.filter((a: any) => a['Model No'] == d['Model'])
      let Sum_Input = aoo.reduce((a: any, b: any) => a + b['Input'], 0)
      let Sum_Output = aoo.reduce((a: any, b: any) => a + b['Output'], 0)
      let Sum_OutputRep = aoo.reduce((a: any, b: any) => a + b['Output repair'], 0)
      Sum_Input = Sum_Input / date.length || ''
      Sum_Output = Sum_Output / date.length || ''
      Sum_OutputRep = Sum_OutputRep / date.length || ''
      return {
        ...d,
        average: [Sum_Input.toLocaleString(), Sum_Output.toLocaleString(), Sum_OutputRep.toLocaleString()]
      }
    })

    // console.log(this.data);

  }


  async updateDate() {
    // this.Data_Model()
    this.date_select = moment(this.dateSelect).format()
    this.Data_Model()
    this.BTN_PU()

  }





  sort(array: any, key: any, mode: any) {
    array = array.sort(function (a: any, b: any) {
      if (mode == 1) {
        return b[key].localeCompare(a[key])
      } else {
        return a[key].localeCompare(b[key])
      }

    })
    return array
  }



  async BTN_Model() {
    // console.log(this.key_Input);

    this.dataRaw = this.dataRaw.map((d: any) => {
      return {
        ...d,
        'Input': d['Input']?.toString(),
        'Output': d['Output']?.toString(),
        'Output repair': d['Output repair']?.toString(),
        'Strt yield': d['Strt yield']?.toString(),
        'Total yields': d['Total yields']?.toString(),
        'Total output': d['Total output']?.toString(),
        'Customer part number': d['Customer part number']?.toString() || '',
        'Analog / Digital': d['Analog / Digital']?.toString() || '',
      }
    })
    // console.log("🚀 ~ file: show-yield.component.ts:451 ~ ShowYieldComponent ~ this.dataRaw=this.dataRaw.map ~ this.dataRaw:", this.dataRaw)
    // console.log(this.dataRaw);
    // this.key_Input['0']= 11
    let new_data: any = []
    if (this.dataRaw) {
      // console.log(dataRaw);
      new_data = this.dataRaw.filter((d: any) =>
        d["Model No"].match(new RegExp(this.key_model, "i")) &&
        d["Customer part number"].match(new RegExp(this.key_customer, "i")) &&
        d["Type"].match(new RegExp(this.key_Type, "i"))
        // d["Analog / Digital"].match(new RegExp(this.key_AD, "i"))
      );
      // console.log("🚀 ~ file: show-yield.component.ts:441 ~ ShowYieldComponent ~ BTN_Model ~ loo:", new_data)
    }
    new_data = new_data.map((d: any) => {
      return {
        ...d,
        'Input': Number(d['Input']),
        'Output': Number(d['Output']),
        'Output repair': Number(d['Output repair']),
        'Strt yield': d['Strt yield'],
        'Total yields': d['Total yields'],
        'Total output': d['Total output'],
        'Customer part number': d['Customer part number'],
        'Analog / Digital': d['Analog / Digital'],
      }
    })



    let model: any = [...new Set(new_data.map((item: any) => item['Model No']))];
    let date: any = [...new Set(new_data.map((item: any) => item.date))];


    let data = model.map((d: any) => {
      let Select_Data = new_data.filter((a: any) => a['Model No'] == d)[0]
      return {
        Model: d,
        Customer: Select_Data['Customer part number'],
        Type: Select_Data['Type'],
        StatusType: Select_Data['statusType'],
        TypeAD: Select_Data['Analog / Digital'],
        value: date.map((a: any) => {
          return new_data.filter((b: any) => b['Model No'] == d && b['date'] == a)[0]
        })
      }

    })


    this.key_Input = {}
    for (const [i, item] of date.entries()) {
      let data_date = new_data.filter((d: any) => d.date == item)
      let Sum_Input = data_date.reduce((a: any, b: any) => a + Number(b['Input']), 0)
      let Sum_Output = data_date.reduce((a: any, b: any) => a + Number(b['Output']), 0)
      let Sum_OutputRep = data_date.reduce((a: any, b: any) => a + Number(b['Output repair']), 0)
      this.key_Input[`${0 + (Number(i) * 3)}`] = Sum_Input.toLocaleString()
      this.key_Input[`${1 + (Number(i) * 3)}`] = Sum_Output.toLocaleString()
      this.key_Input[`${2 + (Number(i) * 3)}`] = Sum_OutputRep.toLocaleString()
    }

    // console.log("🚀 ~ file: show-yield.component.ts:486 ~ ShowYieldComponent ~ BTN_Model ~ data_dete:", data_date)
    console.log(data);

    data = data.map((d: any) => {
      let aoo = new_data.filter((a: any) => a['Model No'] == d['Model'])
      let Sum_Input = aoo.reduce((a: any, b: any) => a + b['Input'], 0)
      let Sum_Output = aoo.reduce((a: any, b: any) => a + b['Output'], 0)
      let Sum_OutputRep = aoo.reduce((a: any, b: any) => a + b['Output repair'], 0)
      Sum_Input = Sum_Input / date.length || ''
      Sum_Output = Sum_Output / date.length || ''
      Sum_OutputRep = Sum_OutputRep / date.length || ''
      return {
        ...d,
        average: [Sum_Input.toLocaleString(), Sum_Output.toLocaleString(), Sum_OutputRep.toLocaleString()]
      }
    })

    this.data = data
    // console.log("🚀 ~ file: show-yield.component.ts:484 ~ ShowYieldComponent ~ BTN_Model ~ data:", data)
    console.log(this.data);

    // console.log("🚀 ~ file: show-yield.component.ts:490 ~ ShowYieldComponent ~ BTN_Model ~ this.data:", this.data)

    // console.log("🚀 ~ file: show-yield.component.ts:428 ~ ShowYieldComponent ~ BTN_Model ~ dataRaw:", dataRaw)

  }


  //TODO UP
  async BTN_PU() {
    this.endDate = moment(this.date_select).format()
    this.startDate = moment(this.date_select).subtract(3, 'month').format()
    console.log(this.endDate);
    console.log(this.startDate);

    let data_list = {
      date: {
        $gte: moment(this.startDate).startOf("month").toDate(),
        $lte: moment(this.endDate).startOf("month").toDate(),
      }
    }
    let dataRaw = await lastValueFrom(this.api.YieldGetByCondition(data_list))



    dataRaw = dataRaw.map((d: any) => {
      return {
        ...d,
        'Input': d['Input']?.toString(),
        'Output': d['Output']?.toString(),
        'Output repair': d['Output repair']?.toString(),
        'Strt yield': d['Strt yield']?.toString(),
        'Total yields': d['Total yields']?.toString(),
        'Total output': d['Total output']?.toString(),
        'Customer part number': d['Customer part number']?.toString() || '',
        'Analog / Digital': d['Analog / Digital']?.toString() || '',
      }
    })
    // console.log("🚀 ~ file: show-yield.component.ts:451 ~ ShowYieldComponent ~ this.dataRaw=this.dataRaw.map ~ this.dataRaw:", this.dataRaw)
    // console.log(this.dataRaw);
    // this.key_Input['0']= 11
    let new_data: any = []
    if (dataRaw) {
      // console.log(dataRaw);
      new_data = dataRaw.filter((d: any) =>
        d["Model No"].match(new RegExp(this.PU_key_model, "i")) &&
        d["Customer part number"].match(new RegExp(this.PU_key_customer, "i")) &&
        d["Type"].match(new RegExp(this.PU_key_Type, "i"))
        // d["Analog / Digital"].match(new RegExp(this.PU_key_AD, "i"))
      );
      // console.log("🚀 ~ file: show-yield.component.ts:441 ~ ShowYieldComponent ~ BTN_Model ~ loo:", new_data)
    }
    new_data = new_data.map((d: any) => {
      return {
        ...d,
        'Input': Number(d['Input']),
        'Output': Number(d['Output']),
        'Output repair': Number(d['Output repair']),
        'Strt yield': d['Strt yield'],
        'Total yields': d['Total yields'],
        'Total output': d['Total output'],
        'Customer part number': d['Customer part number'],
        'Analog / Digital': d['Analog / Digital'],
      }
    })
    dataRaw = [...new_data]


    // console.log("🚀 ~ file: show-yield.component.ts:306 ~ ShowYieldComponent ~ BTN_PU ~ dataRaw:", dataRaw)
    let models: any = [...new Set(dataRaw.map((item: any) => item['Model No']))];
    let date: any = [...new Set(dataRaw.map((item: any) => item.date))];
    date.sort()
    let data = models.map((d: any) => {
      let value = []
      let average = []
      let model
      let detail
      let data = dataRaw.filter((a: any) => a['Model No'] == d && a['Input'] != 0)
      data = this.sort(data, "date", 0)

      if (data.length != 0 && data.length == 4) {
        // let newDate = data.slice(-3)
        let sum_strt = data.reduce((a: any, b: any) => a + Number(b['Strt yield']), 0)
        let sum_total = data.reduce((a: any, b: any) => a + Number(b['Total yields']), 0)
        average.push(((Number(sum_strt / 4) * 100).toFixed(2)).toString() + " %")
        average.push(((Number(sum_total / 4) * 100).toFixed(2)).toString() + " %")
      }

      if (data.length != 0 && data.length <= 3) {
        let newDate = data.slice(-1)
        let sum_strt = newDate.reduce((a: any, b: any) => a + Number(b['Strt yield']), 0)
        let sum_total = newDate.reduce((a: any, b: any) => a + Number(b['Total yields']), 0)
        average.push(((Number(sum_strt) * 100).toFixed(2)).toString() + " %")
        average.push(((Number(sum_total) * 100).toFixed(2)).toString() + " %")
      }
      if (data.length == 0) {
        average.push('')
        average.push('')
      }



      for (const month of date) {

        detail = dataRaw.filter((a: any) => a['Model No'] == d)
        model = detail.filter((a: any) => a['date'] == month)[0]
        if (model) {
          if (model['Input']) {
            value.push(((Number(model['Strt yield']) * 100).toFixed(2)).toString() + " %")
            value.push(((Number(model['Total yields']) * 100).toFixed(2)).toString() + " %")
            value.push(((Number(model['PU_yield']) * 100).toFixed(2)).toString() + " %")
          } else {
            value.push('')
            value.push('')
            value.push('')
          }
        } else {
          value.push('')
          value.push('')
          value.push('')
        }
      }
      return {
        'Model': d,
        'Customer': detail[0]['Customer part number'] || '',
        'Type': detail[0]['Type'] || '',
        'TypeAD': detail[0]['Analog / Digital'] || '',
        value: value,
        average: average
      }
    })
    this.data_pu = data

    this.dataSource = new MatTableDataSource(this.data_pu)
    this.dataSource.paginator = this.paginator;

    console.log("🚀 ~ file: show-yield.component.ts:424 ~ ShowYieldComponent ~ BTN_PU ~ this.data_pu:", this.data_pu)




  }




}
