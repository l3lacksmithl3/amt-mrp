import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  dataExcel: any
  timeStamp: any
  dateSelect: any
  dataCompare: any = []
  dataWIP: any = []

  rowData: any = []
  columnDefs: any = []
  columnDefs_ad: any = []
  moment: any = moment
  temp: any = []

  gridOptions: GridOptions<any> = {
    accentedSort: true,
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    defaultColDef: {
      lockPinned: true,
      // sortable: true,
      filter: true,
      // editable: true,
      floatingFilter: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },

    },
  }

  constructor(
    private api: HttpService,
    private ngxService: NgxUiLoaderService
  ) {
  }
  ngOnInit(): void {
    this.dateSelect = '2023-10-1'
    this.updateInput()
  }


  async updateInput() {

    this.dateSelect = moment(this.dateSelect).date(1).format();

    this.dataCompare = await lastValueFrom(this.api.Import_dat_GetByCondition({ date: this.dateSelect || "" }))
    let DataWIP = await lastValueFrom(this.api.WIP_GetByCondition({ date: this.dateSelect || "" }))
    let DataModel = await lastValueFrom(this.api.YieldGetByCondition({ date: this.dateSelect || "" }))
    let DataByType = await lastValueFrom(this.api.Yield_Sum_GetByCondition({ date: this.dateSelect || "" }))
    let InputPlan = await lastValueFrom(this.api.Input_Plan_GetByCondition({ date: this.dateSelect || "" }))

    //TODO WIP
    this.dataCompare = this.dataCompare.map((d: any) => {
      let GetYield = DataModel.filter((a: any) => a['Model No'] == d['KC品番'])[0]
      let YieldByType

      if (d['PU_yield_new']) {
        return {
          ...d,
          PU_yield: d['PU_yield_new'],
          Status_yield: GetYield ? 0 : 1,
        }
      } else {

        let DataType = DataByType.filter((a: any) => a['model'] == d['機種'])[0]
        return {
          ...d,
          PU_yield: GetYield && GetYield['PU_yield'] != 0 ? GetYield['PU_yield'] : DataType['PU_yield'],
          Status_yield: GetYield && GetYield['PU_yield'] != 0 ? 0 : 1,
        }
      }


    })
    // console.log(this.dataCompare);


    //TODO select data
    let WIP_data: any = []
    for (const WIP of DataWIP) {
      let CheckDup = this.dataCompare.filter((d: any) => d['KC品番'] == WIP['Row Labels'])
      if (CheckDup.length >= 2) {
        let Point_Start = CheckDup[0].value.findIndex((item: any) => item.data == `合計 / ${moment(this.dateSelect).format('YYYY')}年${moment(this.dateSelect).format('M')}月`);
        for (let index = Point_Start; index <= CheckDup[0].value.length; index++) {
          if (CheckDup[0].value[index]['value']) {
            let data = {
              'key': CheckDup[0]['key'],
              'FG': WIP['FG'],
              'WIP': WIP['WIP'],
              'Repair': WIP['Repair'],
              'TTL FG': WIP['FG'] + (WIP['WIP'] * CheckDup[0]['PU_yield']) + (WIP['Repair'] * 0.5),
            }
            WIP_data.push(data)
            break
          }
          if (CheckDup[1].value[index]['value']) {
            let data = {
              'key': CheckDup[1]['key'],
              'FG': WIP['FG'],
              'WIP': WIP['WIP'],
              'Repair': WIP['Repair'],
              'TTL FG': WIP['FG'] + (WIP['WIP'] * CheckDup[1]['PU_yield']) + (WIP['Repair'] * 0.5),
            }
            WIP_data.push(data)
            break
          }
        }
      }
      if (CheckDup.length == 1) {
        let data = {
          'key': CheckDup[0]['key'],
          'FG': WIP['FG'],
          'WIP': WIP['WIP'],
          'Repair': WIP['Repair'],
          'TTL FG': WIP['FG'] + (WIP['WIP'] * CheckDup[0]['PU_yield']) + (WIP['Repair'] * 0.5),
        }
        WIP_data.push(data)
      }
    }

    let NewData = this.dataCompare.map((d: any) => {
      let CheckDup = this.dataCompare.filter((a: any) => a['KC品番'] == d['KC品番'])
      let WIP = WIP_data.filter((a: any) => a['key'] == d['key'])[0]
      return {
        ...d,
        'FG': WIP ? WIP['FG'] : null,
        'WIP': WIP ? WIP['WIP'] : null,
        'Repair': WIP ? WIP['Repair'] : null,
        'TTL FG': WIP ? WIP['TTL FG'] : null,
        'Status_Dup': CheckDup.length == 2 ? 1 : 0,
      }
    })
    // console.log(CheckDup);
    // console.log(DataWIP[3]);


    // let debug = NewData.filter((d: any) => d['PU_yield'] == 999)

    this.setRow_normal()
    this.setRow_ad()

    //TODO new table
    let Point_Start = NewData[0].value.findIndex((item: any) => item.data == `合計 / ${moment(this.dateSelect).format('YYYY')}年${moment(this.dateSelect).format('M')}月`);
    NewData = NewData.map((d: any) => {
      let New_Value: any = []
      New_Value.push(
        {
          'data': 'Yield_list',
          'value': ((d['value'][Point_Start].value || 0) + (d['value'][Point_Start + 1].value || 0)) / d['PU_yield'] || 0
        }
      )
      New_Value.push(
        {
          'data': 'Oct Input B/L',
          'value': ((d['value'][Point_Start].value || 0) + (d['value'][Point_Start + 1].value || 0) - (d['TTL FG'] || 0)) / d['PU_yield'] || 0
        }
      )
      let data_1st = ((d['value'][Point_Start].value || 0) + (d['value'][Point_Start + 1].value || 0) - (d['TTL FG'] || 0)) / d['PU_yield'] || 0
      New_Value.push(
        {
          'data': d['value'][Point_Start].data,
          'value': data_1st >= 0 ? data_1st : 0
        }
      )

      for (let index = 1; index < 100; index++) {
        if (d['value'][Point_Start + index].data.includes('FY')) {
          break
        }
        if (data_1st >= 0) {
          New_Value.push(
            {
              'data': d['value'][Point_Start + index].data,
              'value': d['value'][Point_Start + index + 1].value / d['PU_yield'] || 0
            }
          )
        }
        if (data_1st < 0) {
          let data = d['value'][Point_Start + index + 1].value
          New_Value.push(
            {
              'data': d['value'][Point_Start + index].data,
              'value': data == 0 && data == null ? 0 : (data / d['PU_yield'] || 0)
            }
          )
        }

      }

      if (data_1st < 0) {
        let coin = data_1st
        for (let i = 2; i < New_Value.length; i++) {
          if (New_Value[i].value != 0) {
            coin = coin + New_Value[i].value
            if (coin < 0) {
              New_Value[i].value = 0
              New_Value[i].status = 1
            } else {
              New_Value[i].value = coin
              New_Value[i].status = 1
              break
            }
          }
        }
      }

      return {
        ...d,
        'New_Value': New_Value
      }
    })
    for (const item of InputPlan) {
      if (NewData.filter((d: any) => d['KTC BOM'] == item['Model']).length == 0) {
      }
    }

    NewData = NewData.map((d: any) => {
      let Plan = InputPlan.filter((a: any) => a['Model'] == d['KTC BOM'])
      return {
        ...d,
        InputPlan: d['TTL FG'] && Plan.length != 0 ? Plan[0]['Qty'] : 0,
        FGPlan: d['TTL FG'] && Plan.length != 0 ? Plan[0]['Qty'] * d['PU_yield'] : 0,
      }
    })
    this.rowData = NewData
  }


  setRow_normal() {
    let field: any = [
      {
        children: [
          {
            headerName: `生産地`,
            field: "生産地(最終出荷)",
            width: 70,
            pinned: 'left',
            suppressMovable: true,
          },
        ]
      },
      {
        children: [
          {
            headerName: `機種`,
            field: "機種",
            width: 70,
            pinned: 'left',
            suppressMovable: true,
          },
        ]
      },
      {
        children: [
          {
            headerName: `KC品番 (Sales)`,
            field: "KC品番",
            width: 120,
            pinned: 'left',
            suppressMovable: true,
            cellRenderer: (data: any) => {
              const text = document.createElement('text');
              text.innerHTML = data.value != '0' && data.value != null && data.value != '-' ? `${data.value}` : '';
              if (data.data.Status_Dup == 1) {
                text.classList.add('setColor_dup');
              }
              return text;
            }
          },
        ]
      },
      {
        children: [
          {
            headerName: `カメラ形状種類`,
            field: "カメラ形状種類",
            width: 100,
            pinned: 'left',
            suppressMovable: true,
          },
        ]
      },
      {

        children: [
          {
            headerName: `客先品番`,
            field: "客先品番",
            width: 120,
            pinned: 'left',
            suppressMovable: true,
          },
        ]
      },
      {
        children: [
          {
            headerName: `Analog / Digital`,
            field: "Analog/Digital",
            width: 120,
            pinned: 'left',
            suppressMovable: true,
          },
        ]
      },
      {
        children: [
          {
            headerName: `KTC BOM use`,
            field: "KTC BOM",
            width: 150,
            pinned: 'left',
            suppressMovable: true,
          },
        ]
      },
      {
        children: [
          {
            headerName: `Mass/Prelaunch`,
            field: "Mass/Pre-launch ",
            width: 120,
            pinned: 'left',
            suppressMovable: true,
          },
        ]
      },
      {
        children: [
          {
            headerName: `Yield`,
            field: "PU_yield",
            width: 120,
            pinned: 'left',
            editable: true,
            suppressMovable: true,
            cellRenderer: (data: any) => {
              const text = document.createElement('text');
              text.innerHTML = data.value != '0' && data.value != null && data.value != '-' ? `${(Number(data.value) * 100).toFixed(2)} %` : '';
              if (data.data.Status_yield == 1) { text.classList.add('setColor_blue') }
              return text;
            },
            onCellValueChanged: this.onCellValueChanged.bind(this),

          },
        ]
      },
      {
        headerName: `Stock End ${moment(this.dateSelect).subtract(1, 'month').format("MMM 'YY")}`,
        headerClass: 'setCenter Color_YELLOW',
        children: [
          {
            headerName: `FG`,
            field: "FG",
            width: 120,
            pinned: 'top',
            suppressMovable: true,
          },
          {
            headerName: `WIP`,
            field: "WIP",
            width: 120,
            pinned: 'top',
            suppressMovable: true,
          },
          {
            headerName: `Repair`,
            field: "Repair",
            width: 120,
            pinned: 'top',
            suppressMovable: true,
          },
          {
            headerName: `TTL FG`,
            field: "TTL FG",
            width: 120,
            pinned: 'top',
            cellClass: 'Color_Green',
            suppressMovable: true,
            cellRenderer: (data: any) => {
              const text = document.createElement('text');
              text.innerHTML = data.value != '0' && data.value != null && data.value != '-' ? `${(Number(data.value)).toFixed(0)}` : '';
              return text;
            }
          },
        ]
      },
      {
        children: [
          {
            headerName: `${moment(this.dateSelect).format("MMM")} Input`,
            field: "InputPlan",
            width: 120,
            pinned: 'top',
            // editable: true,
            suppressMovable: true,
            cellRenderer: (data: any) => {
              const text = document.createElement('text');
              text.innerHTML = data.value != '0' && data.value != null && data.value != '-' ? `${(Number(data.value)).toFixed(0)}` : '';
              return text;
            }
          },
        ]
      },
      {
        children: [
          {
            headerName: `${moment(this.dateSelect).format("MMM")} FG`,
            field: "FGPlan",
            width: 120,
            pinned: 'top',
            // editable: true,
            cellClass: 'Color_Green',
            suppressMovable: true,
            cellRenderer: (data: any) => {
              const text = document.createElement('text');
              text.innerHTML = data.value != '0' && data.value != null && data.value != '-' ? `${(Number(data.value)).toFixed(0)}` : '';
              return text;
            }
          },
        ]
      },

    ]

    let Point_Start = this.dataCompare[0]?.value.findIndex((item: any) => item.data == `合計 / ${moment(this.dateSelect).format('YYYY')}年${moment(this.dateSelect).format('M')}月`);
    for (let index = 0; index <= 6; index++) {
      let label = this.dataCompare[0].value[index + Point_Start]['data']
      field.push(
        {
          headerName: `${moment(label.split(' / ')[1].split('月')[0].split('年')[1]).format('MMM')}-${moment(label.split(' / ')[1].split('月')[0].split('年')[0]).format('YY')}`,
          children: [
            {
              headerName: `${label}`,
              field: 'value',
              valueGetter: function (params: any) {
                if (params.data.value && params.data.value.length > 0) {
                  //(params.data.value[Point_Start + index].value).toString().toFixed(0);
                  let value = params.data.value[Point_Start + index].value
                  return value ? value.toFixed(0) : ''
                }
                return '';
              },
              sortable: true,
              resizable: true,
              width: 200,
              pinned: 'top',
              // editable: true,
              suppressMovable: true,
            },
          ]
        }
      )
    }



    this.columnDefs = field
    this.temp = field

  }

  setRow_ad() {
    let field: any = [
      {
        children: [
          {
            headerName: `生産地`,
            field: "生産地(最終出荷)",
            width: 70,
            pinned: 'left',
            suppressMovable: true,
          },
        ]
      },
      {
        children: [
          {
            headerName: `機種`,
            field: "機種",
            width: 70,
            pinned: 'left',
            suppressMovable: true,
          },
        ]
      },
      {
        children: [
          {
            headerName: `KC品番 (Sales)`,
            field: "KC品番",
            width: 120,
            pinned: 'left',
            suppressMovable: true,
            cellRenderer: (data: any) => {
              const text = document.createElement('text');
              text.innerHTML = data.value != '0' && data.value != null && data.value != '-' ? `${data.value}` : '';
              if (data.data.Status_Dup == 1) {
                text.classList.add('setColor_dup');
              }
              return text;
            }
          },
        ]
      },
      {
        children: [
          {
            headerName: `カメラ形状種類`,
            field: "カメラ形状種類",
            width: 100,
            pinned: 'left',
            suppressMovable: true,
          },
        ]
      },
      {

        children: [
          {
            headerName: `客先品番`,
            field: "客先品番",
            width: 120,
            pinned: 'left',
            suppressMovable: true,
          },
        ]
      },
      {
        children: [
          {
            headerName: `Analog / Digital`,
            field: "Analog/Digital",
            width: 120,
            pinned: 'left',
            suppressMovable: true,
          },
        ]
      },
      {
        children: [
          {
            headerName: `KTC BOM use`,
            field: "KTC BOM",
            width: 150,
            pinned: 'left',
            suppressMovable: true,
          },
        ]
      },
      {
        children: [
          {
            headerName: `Mass/Prelaunch`,
            field: "Mass/Pre-launch ",
            width: 120,
            pinned: 'left',
            suppressMovable: true,
          },
        ]
      },
      {
        children: [
          {
            headerName: `Yield`,
            field: "PU_yield",
            width: 120,
            pinned: 'left',
            editable: true,
            suppressMovable: true,
            cellRenderer: (data: any) => {
              const text = document.createElement('text');
              text.innerHTML = data.value != '0' && data.value != null && data.value != '-' ? `${(Number(data.value) * 100).toFixed(2)} %` : '';
              if (data.data.Status_yield == 1) { text.classList.add('setColor_blue') }
              return text;
            },
            onCellValueChanged: this.onCellValueChanged.bind(this),

          },
        ]
      },
      {
        headerName: `Stock End ${moment(this.dateSelect).subtract(1, 'month').format("MMM 'YY")}`,
        headerClass: 'setCenter Color_YELLOW',
        children: [
          {
            headerName: `FG`,
            field: "FG",
            width: 120,
            pinned: 'top',
            suppressMovable: true,
          },
          {
            headerName: `WIP`,
            field: "WIP",
            width: 120,
            pinned: 'top',
            suppressMovable: true,
          },
          {
            headerName: `Repair`,
            field: "Repair",
            width: 120,
            pinned: 'top',
            suppressMovable: true,
          },
          {
            headerName: `TTL FG`,
            field: "TTL FG",
            width: 120,
            pinned: 'top',
            cellClass: 'Color_Green',
            suppressMovable: true,
            cellRenderer: (data: any) => {
              const text = document.createElement('text');
              text.innerHTML = data.value != '0' && data.value != null && data.value != '-' ? `${(Number(data.value)).toFixed(0)}` : '';
              return text;
            }
          },
        ]
      },
      {
        children: [
          {
            headerName: `${moment(this.dateSelect).format("MMM")} Input`,
            field: "InputPlan",
            width: 180,
            pinned: 'top',
            // editable: true,
            suppressMovable: true,
            cellRenderer: (data: any) => {
              const text = document.createElement('text');
              text.innerHTML = data.value != '0' && data.value != null && data.value != '-' ? `${(Number(data.value)).toFixed(0)}` : '';
              return text;
            }
          },
        ]
      },
      {
        children: [
          {
            headerName: `${moment(this.dateSelect).format("MMM")}+${moment(this.dateSelect).add(1, 'month').format("MMM")}/ Yield`,
            field: "New_Value",
            width: 200,
            pinned: 'top',
            // editable: true,
            suppressMovable: true,
            valueGetter: function (params: any) {
              if (params.data.New_Value && params.data.New_Value.length > 0) {
                let value = params.data.New_Value[0]['value']
                return value ? value.toFixed(0) : ''
              }
              return '';
            },
          },
        ]
      },
      {
        children: [
          {
            headerName: `Oct Input B/L`,
            field: "New_Value",
            valueGetter: function (params: any) {
              if (params.data.New_Value && params.data.New_Value.length > 0) {
                let value = params.data.New_Value[1]['value']
                return value ? value.toFixed(0) : ''
              }
              return '';
            },
            cellRenderer: (data: any) => {
              const text = document.createElement('text');
              text.innerHTML = data.value != '0' && data.value != null && data.value != '-' ? `${data.value}` : '';
              if (data.value < 0) {
                text.classList.add('Color_RED');
              }
              return text;
            },
            width: 180,
            pinned: 'top',
            // editable: true,
            suppressMovable: true,
          },
        ]
      },

    ]

    let Point_Start = this.dataCompare[0].value.findIndex((item: any) => item.data == `合計 / ${moment(this.dateSelect).format('YYYY')}年${moment(this.dateSelect).format('M')}月`);
    for (let index = 0; index <= 6; index++) {
      let label = this.dataCompare[0].value[index + Point_Start]['data']
      let date = label.split(' / ')[1].split('月')[0].split('年')
      field.push(
        {
          children: [
            {
              headerName: `${moment(date[1]).format('MMM')}-${moment(date[0]).format('YY')}`,
              field: 'New_Value',
              valueGetter: function (params: any) {
                if (params.data.New_Value && params.data.New_Value.length > 0) {
                  let value = params.data.New_Value[index + 2].value
                  return value ? value.toFixed(0) : ''
                }
                return '';
              },
              cellRenderer: (data: any) => {
                const text = document.createElement('text');

                text.innerHTML = data.value != null && data.value != '-' ? `${data.value}` : '';
                if (data.data.New_Value[index + 2].status == 1) {
                  text.classList.add('Color_PINK');
                  text.innerHTML = data.value ? data.value : '0'
                }
                if (data.value != '' && index == 0) {
                  text.classList.add('Color_YELLOW');
                }
                if (data.value == '' && index == 0) {
                  text.classList.add('Color_PINK');
                  text.innerHTML = "."
                }
                return text;
              },
              sortable: true,
              resizable: true,
              width: 200,
              pinned: 'top',
              // editable: true,
              suppressMovable: true,
            },
          ]
        }
      )
    }

    this.columnDefs_ad = field
  }


  async onCellValueChanged(params: any) {
    let id = params.data._id
    let Status = params.data.Status_yield
    let update = await lastValueFrom(this.api.Import_data_update(id, { 'PU_yield_new': params.newValue }))


  }

  setMonthAndYear(normalizedMonthAndYear: any, datepicker: any) {
    this.dateSelect = normalizedMonthAndYear
    datepicker.close();
    this.updateInput()
  }


  function1Active = false;
  hidden() {
    this.function1Active = !this.function1Active;
    if (this.function1Active) {
      let Hide = [
        "生産地(最終出荷)",
        "カメラ形状種類",
        "客先品番",
      ]
      this.columnDefs = this.columnDefs.filter((d: any) => !Hide.includes(d.children[0].field));
      this.columnDefs_ad = this.columnDefs_ad.filter((d: any) => !Hide.includes(d.children[0].field));
      //Hidden
    } else {
      this.columnDefs = this.temp
      this.columnDefs_ad = this.temp
      //Unhide
    }
  }

}
