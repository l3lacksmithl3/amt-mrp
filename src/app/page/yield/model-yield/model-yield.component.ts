import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import * as moment from 'moment';
import { GridOptions, GridApi } from 'ag-grid-community';
import Swal from 'sweetalert2';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { ModelYieldDialogComponent } from '../model-yield-dialog/model-yield-dialog.component';


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
    private renderer: Renderer2,
    private dialog: MatDialog
  ) { }

  startDate: any;
  endDate: any;

  moment: any = moment
  rawdata: any

  list: any

  rowData: any
  columnDefs: any

  rowData_use: any
  columnDefs_use: any

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


  data_sum: any = []

  gridOptions: GridOptions<any> = {
    accentedSort: true,
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    defaultColDef: {
      lockPinned: true,
      sortable: true,
      filter: true,
      // editable: true,
      floatingFilter: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },

    },



  }

  displayedColumns: string[] = ['Model', 'Customer', 'Type', 'AD', '0', '1'];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild('myGrid') grid!: AgGridAngular;

  async ngOnInit() {
    let lastData = await lastValueFrom(this.api.Yield_Last())
    this.dateSelect = moment(lastData[0].date).format()
    // this.dateSelect = moment('10/1/2023').format()
    // this.updateDate()
    // this.Data_Model()
    this.updateDate()


  }

  async updateDate() {
    this.date_select = moment(this.dateSelect).format()
    this.Data_Model()
    this.Data_PU()


    setTimeout(() => {
      let right: any = document.querySelectorAll('div.ag-body-horizontal-scroll-viewport');
      for (const item of right) {
        item?.scrollBy(999999, 0)
      }
      this.SumIFAll()
      this.Data_Model()
    }, 2000);
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
    let model: any = [...new Set(this.dataRaw.map((item: any) => item['Model No']))];
    let date: any = [...new Set(this.dataRaw.map((item: any) => item.date))];
    for (const item of date) {
      this.data_sum.push('')
    }
    ;




    //TODO new
    let field: any = [
      {
        field: "Model No",
        width: 130,
        pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,
      },
      {
        field: "Customer", width: 120,
        pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,

      },
      {
        field: "Type", width: 100,
        pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,

      },
      {
        field: "Analog Digital", width: 120,
        pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,

      }
    ]



    for (const [index, iterator] of date.entries()) {

      field.push(
        {
          field: `${moment(iterator).format("MMM YYYY")}`,
          width: 120,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          headerClass: 'setCenter',
          suppressMovable: true,
          children: [
            {
              headerName: `Input (${this.data_sum[index]['Input']})`, wrapText: true, wrapHeaderText: true, autoHeaderHeight: true, field: 'value', cellClass: 'colorYieldlock', width: 150, suppressMovable: true,
              valueGetter: function (params: any) {
                if (params.data.value && params.data.value.length > 0) {
                  let value = params.data.value[index + 0]['Input']
                  return value ? value : ''
                }
                return '';
              },
            },
            {
              headerName: `Output (${this.data_sum[index]['Output']})`, wrapText: true, wrapHeaderText: true, autoHeaderHeight: true, field: `value`, cellClass: 'colorYieldlock', width: 150, suppressMovable: true,
              valueGetter: function (params: any) {
                if (params.data.value && params.data.value.length > 0) {
                  let value = params.data.value[index + 0]['Output']
                  return value ? value : ''
                }
                return '';
              },
            },
            {
              headerName: `OutputRepair (${this.data_sum[index]['Output Repair']})`, wrapText: true, wrapHeaderText: true, autoHeaderHeight: true, field: `value`, cellClass: 'color_type_By_full', width: 150, suppressMovable: true,
              valueGetter: function (params: any) {
                if (params.data.value && params.data.value.length > 0) {
                  let value = params.data.value[index + 0]['OutputRepair']
                  return value ? value : ''
                }
                return '';
              },
            }

            // { headerName: `Input ()`, wrapText: true, wrapHeaderText: true, autoHeaderHeight: true, field: `${moment(iterator).format('M')}_Input`, cellClass: 'colorYieldlock', width: 150, },
            // { headerName: `Output ()`, wrapText: true, wrapHeaderText: true, autoHeaderHeight: true, field: `${moment(iterator).format('M')}_Output`, cellClass: 'colorYieldlock', width: 150, },
            // { headerName: `OutputRepair ()`, wrapText: true, wrapHeaderText: true, autoHeaderHeight: true, field: `${moment(iterator).format('M')}_OutputRepair`, cellClass: 'colorYield', width: 150, }
          ]
        },
      )
    }


    field.push(
      {
        headerName: "Average 4 months ago",
        field: `Average`,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        headerClass: 'setCenter',
        pinned: 'right',
        cellClass: 'color',
        suppressMovable: true,
        children: [
          { headerName: "Input", field: `Average_Input`, cellClass: 'color', pinned: 'right', width: 120, suppressMovable: true, },
          { headerName: "Output", field: `Average_Output`, cellClass: 'color', pinned: 'right', width: 120, suppressMovable: true, },
          { headerName: "Output repair", field: `Average_OutputRepair`, cellClass: 'color', pinned: 'right', width: 120, suppressMovable: true, },
        ],
      },
    )

    field.push(
      {
        headerName: "",
        field: `Average`,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        headerClass: 'setCenter',
        pinned: 'right',
        cellClass: 'color',
        suppressMovable: true,
        children: [
          { headerName: "", field: ``, cellClass: 'color', pinned: 'right', width: 120, suppressMovable: true, }
        ],
      },
    )



    this.columnDefs = field
    this.rowData = []


    //TODO row
    let data = model.map((d: any) => {
      let Select_Data = this.dataRaw.filter((a: any) => a['Model No'] == d)[0]
      return {
        'Model No': d,
        Customer: Select_Data['Customer part number'],
        Type: Select_Data['Type'],
        TypeAD: Select_Data['Analog / Digital'],
        value: date.map((a: any) => {
          return this.dataRaw.filter((b: any) => b['Model No'] == d && b['date'] == a)[0]
        })
      }
    })

    let lastData = []
    for (const iterator of model) {
      let data = this.dataRaw.filter((d: any) => d['Model No'] == iterator)
      let list: any = {
        'Model No': iterator,
        Customer: data[0]['Customer part number'],
        Type: data[0]['Type'],

        // TypeAD: Select_Data['Analog / Digital'],
      }
      let list_new: any = []
      for (const item of date) {
        let data = this.dataRaw.filter((d: any) => d.date == item && d['Model No'] == iterator)
        // if (data.length != 0) {
        //   list[`${moment(item).format('M')}_Input`] = data[0]['Input'].toLocaleString() != '0' ? data[0]['Input'].toLocaleString() : ''
        //   list[`${moment(item).format('M')}_Output`] = data[0]['Output'].toLocaleString() != '0' ? data[0]['Output'].toLocaleString() : ''
        //   list[`${moment(item).format('M')}_OutputRepair`] = data[0]['Output repair'].toString() != '0' ? data[0]['Output repair'].toLocaleString() : ''
        // }

        if (data.length != 0) {
          list_new.push(
            {
              'data': `${moment(item).format("MMM 'YY")}`,
              'Input': data[0]['Input'].toLocaleString() != '0' ? data[0]['Input'].toLocaleString() : '',
              'Output': data[0]['Output'].toLocaleString() != '0' ? data[0]['Output'].toLocaleString() : '',
              'OutputRepair': data[0]['Output repair'].toString() != '0' ? data[0]['Output repair'].toLocaleString() : '',
            }
          )
        }else{
          list_new.push(
            {
              'data': `${moment(item).format("MMM 'YY")}`,
              'Input': '',
              'Output': '',
              'OutputRepair': '',
            }
          )
        }

        // list[`Strt Yield ${moment(item).format('MMM YYYY')}`] = ((Number(data[0].StrtYield) * 100).toFixed(2)).toString() + " %"
        // list[`Total Yield ${moment(item).format('MMM YYYY')}`] = ((Number(data[0].TotalYield) * 100).toFixed(2)).toString() + " %"
      }
      lastData.push(
        {
          'Model No': iterator,
          'Customer': data[0]['Customer part number'],
          'Type': data[0]['Type'],
          'value': list_new,
        }
      )
    }

    lastData = lastData.map((d: any) => {
      let aoo = this.dataRaw.filter((a: any) => a['Model No'] == d['Model No'])
      let Sum_Input = aoo.reduce((a: any, b: any) => a + b['Input'], 0)
      let Sum_Output = aoo.reduce((a: any, b: any) => a + b['Output'], 0)
      let Sum_OutputRep = aoo.reduce((a: any, b: any) => a + b['Output repair'], 0)
      Sum_Input = Sum_Input / date.length || ''
      Sum_Output = Sum_Output / date.length || ''
      Sum_OutputRep = Sum_OutputRep / date.length || ''
      return {
        ...d,
        "Average_Input": Sum_Input.toLocaleString(),
        "Average_Output": Sum_Output.toLocaleString(),
        "Average_OutputRepair": Sum_OutputRep.toLocaleString()
      }
    })



    this.rowData = lastData


  }

  async Data_PU() {

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
    let model: any = [...new Set(this.dataRaw.map((item: any) => item['Model No']))];
    let date: any = [...new Set(this.dataRaw.map((item: any) => item.date))];
    for (const item of date) {
      this.data_sum.push('')
    }

    let yield_by_type = await lastValueFrom(this.api.Yield_Sum_GetByCondition({
      date: {
        $gte: moment(date[date.length - 1]).startOf("month").toDate(),
        $lte: moment(date[date.length - 1]).startOf("month").toDate(),
      }
    }))



    //TODO new field
    let field: any = [
      {
        field: "Model No",
        width: 130,
        pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,
      },
      {
        field: "Customer", width: 120,
        pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,
      },
      {
        field: "Type", width: 100,
        pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,
      },
      {
        field: "Analog Digital", width: 120,
        pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,
      }
    ]



    for (const [index, iterator] of date.entries()) {
      if (index != date.length - 1) {
        field.push(
          {
            field: `${moment(iterator).format("MMM YYYY")}`,
            width: 120,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: 'setCenter',
            suppressMovable: true,
            children: [
              {
                headerName: `Strt yield`,
                wrapText: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                field: `value`,
                cellClass: 'colorYieldlock',
                width: 150,
                suppressMovable: true,
                valueGetter: function (params: any) {
                  if (params.data.value && params.data.value.length > 0) {
                    let value = params.data.value[index + 0]['Strt']
                    return value ? value : ''
                  }
                  return '';
                },
              },
              {
                headerName: `Total yield`,
                wrapText: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                field: `value`,
                cellClass: 'colorYieldlock',
                width: 150,
                suppressMovable: true,
                valueGetter: function (params: any) {
                  if (params.data.value && params.data.value.length > 0) {
                    let value = params.data.value[index + 0]['Total']
                    return value ? value : ''
                  }
                  return '';
                },
              },
              {
                headerName: `PU yield ${moment(iterator).add(1, 'month').format('MMM YYYY')}`,
                wrapText: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                field: `value`,
                cellClass: 'color_type_By_full',
                width: 150,
                suppressMovable: true,
                valueGetter: function (params: any) {
                  if (params.data.value && params.data.value.length > 0) {
                    let value = params.data.value[index + 0]['PU']
                    return value ? value : ''
                  }
                  return '';
                },
                cellRenderer: (data: any) => {
                  const text = document.createElement('text');
                  text.innerHTML = `${data.value}` ? `${data.value}` : '-';
                  text.classList.add('setFull')
                  if (data.data.value[index + 0]['StatusType'] == 1) {
                    text.classList.add('color_type')
                  }
                  return text;
                }
                ,
              }
            ]
          },
        )
      } else {
        field.push(
          {
            field: `${moment(iterator).format("MMM YYYY")}`,
            width: 120,
            wrapHeaderText: true,
            headerClass: 'setCenter',
            autoHeaderHeight: true,
            suppressMovable: true,
            children: [
              {
                headerName: `Strt yield`, wrapText: true, wrapHeaderText: true, autoHeaderHeight: true, field: `value`, cellClass: 'colorYieldlock', width: 150, suppressMovable: true,
                valueGetter: function (params: any) {
                  if (params.data.value && params.data.value.length > 0) {
                    let value = params.data.value[3]['Strt']
                    return value ? value : ''
                  }
                  return '';
                },
              },
              {
                headerName: `Total yield`, wrapText: true, wrapHeaderText: true, autoHeaderHeight: true, field: `value`, cellClass: 'colorYieldlock', width: 150, suppressMovable: true,
                valueGetter: function (params: any) {
                  if (params.data.value && params.data.value.length > 0) {
                    let value = params.data.value[3]['Total']
                    return value ? value : ''
                  }
                  return '';
                },
              },

              {
                headerName: `PU yield ${moment(iterator).add(1, 'month').format('MMM YYYY')}`, wrapText: true, wrapHeaderText: true, autoHeaderHeight: true, field: `${moment(iterator).format('M')}_PU`, cellClass: 'color_type_By_full', width: 150, suppressMovable: true,
                valueGetter: function (params: any) {
                  if (params.data.value && params.data.value.length > 0) {
                    let value = params.data.value[3]['PU']
                    return value ? value : ''
                  }
                  return '';
                },

                cellRenderer: (data: any) => {
                  const button = document.createElement('button');
                  button.innerHTML = `${data.value}` ? `${data.value}` : '-';
                  if (data.value) {
                    button.classList.add('btn', 'setFull')
                  } else {
                    button.classList.add('btn', 'setFull')
                  }
                  if (data.data.value[3]['StatusType'] == 1) {
                    button.classList.add('color_type')
                  } else {
                    button.classList.add('color_red')
                  }
                  button.setAttribute('id', 'setBtn_action')
                  button.addEventListener('click', (event) => this.onBtnClick1(event, data.data, iterator));
                  return button;
                }
              }
            ]
          },
        )
      }

    }


    field.push(
      {
        headerName: "Average 4 months ago",
        field: `Average`,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        headerClass: 'setCenter',
        pinned: 'right',
        cellClass: 'color',
        suppressMovable: true,
        children: [
          { headerName: `Yield Bytype`, field: `Yield_Type`, cellClass: 'color_YieldByType', pinned: 'right', width: 120, suppressMovable: true, },
          { headerName: "Strt yield", field: `Average_Strt`, cellClass: 'color', pinned: 'right', width: 120, suppressMovable: true, },
          { headerName: "Total yield", field: `Average_Total`, cellClass: 'color', pinned: 'right', width: 120, suppressMovable: true, },
          { headerName: "PU yield", field: `Average_PU`, cellClass: 'color', pinned: 'right', width: 120, suppressMovable: true, }
        ],
      },
    )



    this.columnDefs_use = field
    this.rowData = []




    //TODO row
    let data = model.map((d: any) => {
      let Select_Data = this.dataRaw.filter((a: any) => a['Model No'] == d)[0]
      return {
        'Model No': d,
        Customer: Select_Data['Customer part number'],
        Type: Select_Data['Type'],
        TypeAD: Select_Data['Analog / Digital'],
        value: date.map((a: any) => {
          return this.dataRaw.filter((b: any) => b['Model No'] == d && b['date'] == a)[0]
        })
      }
    })

    let lastData = []
    for (const iterator of model) {
      let data = this.dataRaw.filter((d: any) => d['Model No'] == iterator)
      let list_new: any = []
      for (const item of date) {
        let data = this.dataRaw.filter((d: any) => d.date == item && d['Model No'] == iterator)

        // if (data.length != 0) {
        //   list[`${moment(item).format('M')}_Strt`] = data[0]['Input'] != '0' ? ((Number(data[0]['Strt yield']) * 100).toFixed(2)).toString() + " %" : ''
        //   list[`${moment(item).format('M')}_Total`] = data[0]['Input'] != '0' ? ((Number(data[0]['Total yields']) * 100).toFixed(2)).toString() + " %" : ''
        //   list[`${moment(item).format('M')}_PU`] = data[0]['PU_yield'] != '0' ? ((Number(data[0]['PU_yield']) * 100).toFixed(2)).toString() + " %" : ''
        //   list[`${moment(item).format('M')}_StatusType`] = data[0]['statusByType'] ? 1 : 0
        // }else{
        //   list[`${moment(item).format('M')}_Strt`] = ''
        //   list[`${moment(item).format('M')}_Total`] = ''
        //   list[`${moment(item).format('M')}_PU`] = ''
        //   list[`${moment(item).format('M')}_StatusType`] = 0
        // }

        if (data.length != 0) {
          list_new.push(
            {
              'data': `${moment(item).format("MMM 'YY")}`,
              'Strt': data[0]['Input'] != '0' ? ((Number(data[0]['Strt yield']) * 100).toFixed(2)).toString() + " %" : '',
              'Total': data[0]['Input'] != '0' ? ((Number(data[0]['Total yields']) * 100).toFixed(2)).toString() + " %" : '',
              'PU': data[0]['PU_yield'] != '0' ? ((Number(data[0]['PU_yield']) * 100).toFixed(2)).toString() + " %" : '',
              'id': data[0]['_id'],
              'StatusType': data[0]['statusByType'] ? 1 : 0
            }
          )
        } else {
          list_new.push(
            {
              'data': `${moment(item).format("MMM 'YY")}`,
              'Strt': '',
              'Total': '',
              'PU': '',
              'StatusType': 0
            }
          )
        }
      }

      lastData.push(
        {
          'Model No': iterator,
          'Customer': data[0]['Customer part number'],
          'Type': data[0]['Type'],
          'value': list_new,
        }
      )
    }






    lastData = lastData.map((d: any) => {
      let YBT = yield_by_type.filter((a: any) => a['model'] == d['Type'])[0]
      let RawData = this.dataRaw.filter((a: any) => a['Model No'] == d['Model No'] && a['Input'] != 0)
      let average = this.dataRaw.filter((a: any) => a['Model No'] == d['Model No'])
      average = this.sort(average, 'date', 0)
      average = average.slice(0, 3);

      let Sum_Strt = RawData.reduce((a: any, b: any) => a + b['Strt yield'], 0)
      let Sum_Total = RawData.reduce((a: any, b: any) => a + b['Total yields'], 0)
      let Sum_PU = average.reduce((a: any, b: any) => a + b['PU_yield'], 0)

      if (RawData.length == 4) {
        Sum_Strt = ((Number(Sum_Strt) / 4 * 100).toFixed(2)).toString() + " %",
          Sum_Total = ((Number(Sum_Total) / 4 * 100).toFixed(2)).toString() + " %"
      }
      if (RawData.length == 3) {
        Sum_Strt = ((Number(Sum_Strt) / 3 * 100).toFixed(2)).toString() + " %",
          Sum_Total = ((Number(Sum_Total) / 3 * 100).toFixed(2)).toString() + " %"
      }
      if (RawData.length == 2) {
        Sum_Strt = ((Number(Sum_Strt) / 2 * 100).toFixed(2)).toString() + " %",
          Sum_Total = ((Number(Sum_Total) / 2 * 100).toFixed(2)).toString() + " %"
      }
      if (RawData.length == 1) {
        Sum_Strt = ((Number(Sum_Strt) / 1 * 100).toFixed(2)).toString() + " %",
          Sum_Total = ((Number(Sum_Total) / 1 * 100).toFixed(2)).toString() + " %"
      }
      if (average.length != 0) {
        Sum_PU = ((Number(Sum_PU) / average.length * 100).toFixed(2)).toString() + " %"
      }
      if (RawData.length == 0) {
        Sum_Strt = ''
        Sum_Total = ''
      }


      return {
        ...d,
        'Yield_Type': ((Number(YBT.PU_yield) * 100).toFixed(2)).toString() + " %",
        'Average_Strt': Sum_Strt,
        'Average_Total': Sum_Total,
        'Average_PU': Sum_PU
      }
    })

    //TODO check NaN



    this.rowData_use = lastData


    let NaN = lastData.map((d: any) => {
      return {
        value: d['value'][3]['PU']
      }
    })
    if (NaN.filter((d: any) => d['value'] == 'NaN %').length > 100) {
      this.setNewData()
    }


  }




  SumIFAll() {
    setTimeout(() => {
      // console.log("sss");

      let data: any = []
      this.data_sum = []
      this.grid!.api!.forEachNodeAfterFilter(function (rowNode: any, index: any) {
        data.push(rowNode.data)
      });
      let date: any = [...new Set(this.dataRaw.map((item: any) => item.date))];

      for (const [index,item] of date.entries()) {
        let Sum_1_check = data.filter((d: any) => d?.value[index]?.Input != '')
        // console.log(Sum_1_check);

        let Sum_1 = Sum_1_check.reduce((a: any, b: any) => a + Number(b.value[index]?.Input.replace(',', '')), 0)

        let Sum_2_check = data.filter((d: any) => d?.value[index]?.Output != '')
        let Sum_2 = Sum_2_check.reduce((a: any, b: any) => a + Number(b.value[index]?.Output.replace(',', '')), 0)

        let Sum_3_check = data.filter((d: any) => d?.value[index]?.OutputRepair != '')
        let Sum_3 = Sum_3_check.reduce((a: any, b: any) => a + Number(b.value[index]?.OutputRepair.replace(',', '')), 0)
        this.data_sum.push({ 'Input': Sum_1, 'Output': Sum_2, 'Output Repair': Sum_3 })
      }
    //   // this.grid!.api.setColumnDefs(this.columnDefs);
      // console.log(this.data_sum);

      this.Data_Model()

    //   // this.grid!.api.setColumnDefs(this.columnDefs)

    }, 100);
  }













  async BTN_Model() {

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

    let new_data: any = []
    if (this.dataRaw) {
      new_data = this.dataRaw.filter((d: any) =>
        d["Model No"].match(new RegExp(this.key_model, "i")) &&
        d["Customer part number"].match(new RegExp(this.key_customer, "i")) &&
        d["Type"].match(new RegExp(this.key_Type, "i"))
      );
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


  }


  //TODO UP
  async BTN_PU() {
    this.endDate = moment(this.date_select).format()
    this.startDate = moment(this.date_select).subtract(3, 'month').format()

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
    let new_data: any = []
    if (dataRaw) {
      new_data = dataRaw.filter((d: any) =>
        d["Model No"].match(new RegExp(this.PU_key_model, "i")) &&
        d["Customer part number"].match(new RegExp(this.PU_key_customer, "i")) &&
        d["Type"].match(new RegExp(this.PU_key_Type, "i"))
      );
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



  onBtnClick1(event: any, value: any, month: any) {
    let data = {
      value: value,
      month: month
    }
    let closeDialog = this.dialog.open(ModelYieldDialogComponent, {
      width: '1000px',
      data: data

    });
    closeDialog.afterClosed().subscribe(close => {
      if (close) {
        event.target.innerHTML = (Number(close.value) * 100).toFixed(2).toString() + " %"
        if (close.type == 1) {
          event.target.classList.add("color_type")
          event.target.classList.remove("color_red")
        } else {
          event.target.classList.add("color_red")
          event.target.classList.remove("color_type")

        }
      }
    })



  }



  async setNewData() {
    let update = this.rowData_use.map((d: any) => {
      let data = d['value'][3]
      let setData: any
      if (data.PU == 'NaN %') {

        if (d['value'][3]['Strt'] == '') {
          if (d['Average_Total'] != '') {
            //3
            setData = d['Average_Total']
          }
          if (d['Average_Total'] == '') {
            //2
            setData = d['Yield_Type']
          }
        } else {
          //1
          setData = d['value'][3]['Strt']
        }

        d.value = d.value.map((a: any) => {
          return {
            ...a,
            PU: a['PU'] != "NaN %" ? a['PU'] : setData
          }
        })
        return {
          ...d,
        }
      } else {
        return {
          ...d,
        }
      }
    })

    for (const item of update) {
      if (item.value[3]['id']) {
        let update_db = await lastValueFrom(this.api.YieldUpdate(item.value[3]['id'], { PU_yield: Number(item.value[3]['PU'].split(" ")[0]) / 100 || 0 }))
        // PU_yield
      }

    }

  }

  setMonthAndYear(normalizedMonthAndYear: any , datepicker :any) {
    this.dateSelect = normalizedMonthAndYear
    datepicker.close();
    this.updateDate()
  }

}
