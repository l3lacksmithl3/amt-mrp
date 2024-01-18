import { GridApi, GridOptions } from 'ag-grid-community';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import { SummaryYieldDialogComponent } from '../summary-yield-dialog/summary-yield-dialog.component';


@Component({
  selector: 'app-summary-yield',
  templateUrl: './summary-yield.component.html',
  styleUrls: ['./summary-yield.component.scss']
})
export class SummaryYieldComponent implements OnInit {
  @ViewChild('myGrid') grid!: AgGridAngular;


  startDate: any;
  endDate: any;

  moment: any = moment
  rawdata: any

  list: any

  rowData: any
  columnDefs: any
  data_by_Type: any

  columnDefs_PU: any
  rowData_PU: any


  gridOptions: GridOptions<any> = {
    accentedSort: true,
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    defaultColDef: {
      cellStyle: { 'text-align': 'center' },
      sortable: true,
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
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog
  ) { }



  onGridFilterChanged(event: any) {
    // เข้าถึง API ของ grid
    // const gridApi = event.api;
    console.log(event);


    // ใช้ API เพื่อดึงข้อมูลที่ถูก filter ไว้ใน column ต่างๆ
    // const filteredData:any = [];
    // gridApi.getColumnDefs().forEach((columnDef: any) => {
    //   const columnName = columnDef.field;
    //   const filterInstance = gridApi.getFilterInstance(columnName);
    //   console.log("🚀 ~ file: summary-yield.component.ts:70 ~ SummaryYieldComponent ~ gridApi.getColumnDefs ~ filterInstance:", columnName)
    //   console.log("🚀 ~ file: summary-yield.component.ts:70 ~ SummaryYieldComponent ~ gridApi.getColumnDefs ~ filterInstance:", filterInstance)

    //   if (filterInstance && filterInstance.isFilterActive()) {
    //     const filterValue = filterInstance.getModel();
    //     const filteredRows = gridApi.getFilterApi().getFilteredRows(filterInstance);
    //     // ดึงข้อมูลที่ถูก filter ไว้จากแต่ละ column
    //     filteredData.push({ columnName, filterValue, filteredRows });
    //   }
    // });

    // console.log(filteredData);
  }


  async ngOnInit() {
    let dataRaw = await lastValueFrom(this.api.Yield_Sum_getALl())
    let date: any = [...new Set(dataRaw.map((item: any) => item.date))];
    date.sort()
    this.startDate = moment(date[0]).format()
    this.endDate = moment().format()

    this.updateDate()
    // this.checkupdate()

  }




  async updateDate() {
    this.data_by_Type = await lastValueFrom(this.api.Yield_Sum_GetByCondition({
      date: {
        $gte: moment(this.startDate).startOf("month").toDate(),
        $lte: moment(this.endDate).startOf("month").toDate(),
      }
    }))
    this.updateInput()
    // this.updateInput_PU()
  }




  // async checkupdate() {
  //   let data_NA = this.data_by_Type.filter((d: any) => d.statusType == "NA")

  //   let list = []
  //   for (const item of data_NA) {
  //     let checkHave = data_PU.some((d: any) =>
  //       d['Analog/Digital'] == item['Analog/Digital'] &&
  //       d['Material %NG'] == item['Material %NG'] &&
  //       d['date'] == item['date'],
  //     )


  //     if (!checkHave) {
  //       let date: any = [...new Set(data_PU.map((item: any) => item.date))];
  //       date.sort()
  //       // let data_user = data_PU.filter((d: any) => d.date == date[date.length - 1] && d['Analog/Digital'] == item['Analog/Digital'] && d['Material %NG'] == item['Material %NG'])
  //       // item.value = data_user[0].value
  //       delete item._id
  //       item.statusType = "PU"
  //       list.push(item)
  //     }
  //   }
  //   console.log(list);


  //   let add = await lastValueFrom(this.api.Yield_Sum_add(list))
  // }



  async updateInput() {

    // let data_NA = this.data_by_Type.filter((d: any) => d.statusType == "NA")
    let field: any = [
      {
        field: "Camera type",
        cellStyle: { 'text-align': 'center' },
        width: 130,
        pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,
      },
      {
        field: "Model", width: 120,
        pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,
      }
    ]
    let date: any = [...new Set(this.data_by_Type.map((item: any) => item.date))];
    date.sort()


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
                headerName: "Strt Yield", field: `value`, cellClass: 'colorYieldlock', suppressMovable: true,
                valueGetter: function (params: any) {
                  if (params.data.value && params.data.value.length > 0) {
                    let value = params.data.value[index + 0]['Strt']
                    return value ? value : ''
                  }
                  return '';
                },
              },
              {
                headerName: "Total Yield", field: `value`, cellClass: 'colorYieldlock', suppressMovable: true,
                valueGetter: function (params: any) {
                  if (params.data.value && params.data.value.length > 0) {
                    let value = params.data.value[index + 0]['Total']
                    return value ? value : ''
                  }
                  return '';
                },
              },
              {
                headerName: `${moment(iterator).add(1,'month').format("MMM'YY")} PU Yield`, field: `value`, cellClass: 'color_type_By_full', editable: true, suppressMovable: true,
                onCellValueChanged: this.onCellValueChanged.bind(this),
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
                    text.classList.add('color_type_By')
                  }

                  return text;
                }

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
            autoHeaderHeight: true,
            headerClass: 'setCenter',
            suppressMovable: true,
            children: [
              {
                headerName: "Strt Yield", field: `value`, cellClass: 'colorYieldlock', suppressMovable: true,
                valueGetter: function (params: any) {
                  if (params.data.value && params.data.value.length > 0) {
                    let value = params.data.value[index + 0]['Strt']
                    return value ? value : ''
                  }
                  return '';
                },
              },
              {
                headerName: "Total Yield", field: `value`, cellClass: 'colorYieldlock', suppressMovable: true,
                valueGetter: function (params: any) {
                  if (params.data.value && params.data.value.length > 0) {
                    let value = params.data.value[index + 0]['Total']
                    return value ? value : ''
                  }
                  return '';
                },
              },
              {
                headerName: `${moment(iterator).add(1,'month').format("MMM'YY")} PU Yield`, field: `value`, cellClass: 'color_type_By_full', editable: true, suppressMovable: true,
                onCellValueChanged: this.onCellValueChanged.bind(this),
                valueGetter: function (params: any) {
                  if (params.data.value && params.data.value.length > 0) {
                    let value = params.data.value[index + 0]['PU']
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

                  if (data.data.value[index + 0]['StatusType'] == 1) {
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


    //average
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
          { headerName: "Strt yield", field: `Average_Strt`, cellClass: 'color', pinned: 'right', width: 120, suppressMovable: true, },
          { headerName: "Total yield", field: `Average_Total`, cellClass: 'color', pinned: 'right', width: 120, suppressMovable: true, },
          { headerName: "PU yield", field: `Average_PU`, cellClass: 'color', pinned: 'right', width: 120, suppressMovable: true, }
        ],
      },
    )



    this.columnDefs = field
    console.log("🚀 ~ file: summary-yield.component.ts:190 ~ SummaryYieldComponent ~ updateInput ~ field:", field)

    let lastData = []
    let model: any = [...new Set(this.data_by_Type.map((item: any) => item.model))];
    // console.log(this.data_by_Type);
    // console.log(model);


    for (const iterator of model) {
      let data = this.data_by_Type.filter((d: any) => d.model == iterator)
      data = this.sort(data, 'date', 1)
      let count_1 = data.slice(0, 4)
      let sum_strt = count_1.reduce((a: any, b: any) => a + Number(b['StrtYield']), 0)
      let sum_total = count_1.reduce((a: any, b: any) => a + Number(b['TotalYield']), 0)
      let count_2 = data.slice(1, 4)
      let sum_pu = count_2.reduce((a: any, b: any) => a + Number(b['PU_yield']), 0)

      let list_new: any = []
      for (const item of date) {
        let data_get = this.data_by_Type.filter((d: any) => d.date == item && d.model == iterator)
        // if (data.length != 0) {
        //   list[`${moment(item).format('M')}_Strt`] = ((Number(data[0].StrtYield) * 100).toFixed(2)).toString() + " %"
        //   list[`${moment(item).format('M')}_Total`] = ((Number(data[0].TotalYield) * 100).toFixed(2)).toString() + " %"
        //   list[`${moment(item).format('M')}_PU`] = ((Number(data[0].PU_yield) * 100).toFixed(2)).toString() + " %"
        //   list[`${moment(item).format('M')}_StatusType`] = data[0].status_pu
        // }
        // if (data.length == 0) {
        //   list[`${moment(item).format('M')}_Strt`] = ''
        //   list[`${moment(item).format('M')}_Total`] = ''
        //   list[`${moment(item).format('M')}_PU`] = ''
        //   list[`${moment(item).format('M')}_StatusType`] = ''

        // }
        if (data_get.length != 0) {
          list_new.push(
            {
              'data': `${moment(item).format("MMM 'YY")}`,
              'Strt': ((Number(data_get[0].StrtYield) * 100).toFixed(2)).toString() + " %",
              'Total': ((Number(data_get[0].TotalYield) * 100).toFixed(2)).toString() + " %",
              'PU': ((Number(data_get[0].PU_yield) * 100).toFixed(2)).toString() + " %",
              'StatusType': data_get[0].status_pu,
            }
          )
        }
        if (data_get.length == 0) {
          list_new.push(
            {
              'data': `${moment(item).format("MMM 'YY")}`,
              'Strt': '',
              'Total': '',
              'PU': '',
              'StatusType': '',
            }
          )
        }

      }
      // list.Average_Strt = ((Number(sum_strt / 4) * 100).toFixed(2)).toString() + " %",
      // list.Average_Total = ((Number(sum_total / 4) * 100).toFixed(2)).toString() + " %",
      // list.Average_PU = ((Number(sum_pu / 3) * 100).toFixed(2)).toString() + " %"

      lastData.push(
        {
          "Camera type": data[0].type,
          "Model": iterator,
          'value': list_new,
          'Average_Strt': ((Number(sum_strt / 4) * 100).toFixed(2)).toString() + " %",
          'Average_Total': ((Number(sum_total / 4) * 100).toFixed(2)).toString() + " %",
          'Average_PU': ((Number(sum_pu / 3) * 100).toFixed(2)).toString() + " %"
        }
      )

      // lastData.push(list)
    }



    console.log("🚀 ~ file: summary-yield.component.ts:179 ~ SummaryYieldComponent ~ updateInput ~ lastData:", lastData)
    this.rowData = lastData



    if (this.rowData.length != 0) {
      setTimeout(() => {
        let aas = document.querySelector('div.ag-body-horizontal-scroll-viewport');
        aas?.scrollBy(999999, 0)
      }, 10);

    }

  }

  check() {
    this.grid!.api!.forEachNodeAfterFilter(function (rowNode: any, index: any) {
      console.log(rowNode);
    });
  }



  async onCellValueChanged(params: any) {
    console.log(params);
    this.data_by_Type = this.data_by_Type.map((d: any) => {
      return {
        ...d,
        month: Number(moment(d.date).format('M'))
      }
    })
    let rawData = this.data_by_Type.filter((d: any) =>
      d["model"] == params.data['Model'] &&
      d["type"] == params.data['Camera type'] &&
      d['month'] == Number(params.colDef.field.split('_')[0])
    )
    rawData = this.sort(rawData, 'date', 0)
    Swal.fire({
      title: `Do you want to change ? <br> ${params.oldValue} => ${Number(params.newValue.toString().replace("%", "")) + " %"} `,
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        if (params.colDef.field.split("_")[1] == 'Strt') {
          let update = lastValueFrom(this.api.Yield_Sum_update(rawData[0]._id, { StrtYield: Number(params.newValue.toString().replace("%", "")) / 100 }))
        }
        if (params.colDef.field.split("_")[1] == 'Total') {
          let update = lastValueFrom(this.api.Yield_Sum_update(rawData[0]._id, { TotalYield: Number(params.newValue.toString().replace("%", "")) / 100 }))
        }
        if (params.colDef.field.split("_")[1] == 'PU') {
          let update = lastValueFrom(this.api.Yield_Sum_update(rawData[0]._id, { PU_yield: Number(params.newValue.toString().replace("%", "")) / 100 }))
        }

        //code end
        setTimeout(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.updateDate()
          })
        }, 200);
      }
    })

    // s

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

    console.log(value);
    console.log(month);

    let data = {
      value: value,
      month: month
    }
    let closeDialog = this.dialog.open(SummaryYieldDialogComponent, {
      width: '1000px',
      data: data

    });
    closeDialog.afterClosed().subscribe(close => {
      if (close) {
        console.log(close);
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

}
