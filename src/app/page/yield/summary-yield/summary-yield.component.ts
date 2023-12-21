import { GridOptions } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-summary-yield',
  templateUrl: './summary-yield.component.html',
  styleUrls: ['./summary-yield.component.scss']
})
export class SummaryYieldComponent implements OnInit {



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

    // onGridSizeChanged: () => {
    //   setTimeout(() => {
    //     let columnApi: any = this.gridOptions.columnApi;
    //     if (columnApi.columnModel.bodyWidth < columnApi.columnModel.scrollWidth) this.gridOptions.api?.sizeColumnsToFit();
    //     else this.gridOptions.columnApi!.autoSizeAllColumns();
    //   }, 10);
    // },
  }
  constructor(
    private api: HttpService,
    private ngxService: NgxUiLoaderService
  ) { }

  async ngOnInit() {
    let dataRaw = await lastValueFrom(this.api.Yield_Sum_getALl())
    // console.log("🚀 ~ file: summary-yield.component.ts:58 ~ SummaryYieldComponent ~ ngOnInit ~ dataRaw:", dataRaw)
    let date: any = [...new Set(dataRaw.map((item: any) => item.date))];
    date.sort()
    this.startDate = moment(date[0]).format()
    this.endDate = moment().format()

    this.updateDate()
    this.checkupdate()

  }




 async updateDate(){
  this.data_by_Type = await lastValueFrom(this.api.Yield_Sum_GetByCondition({
    date: {
      $gte: moment(this.startDate).startOf("month").toDate(),
      $lte: moment(this.endDate).startOf("month").toDate(),
    }
  }))
  this.updateInput()
  this.updateInput_PU()
 }




  async checkupdate() {
    let data_NA = this.data_by_Type.filter((d: any) => d.statusType == "NA")
    let data_PU = this.data_by_Type.filter((d: any) => d.statusType == "PU")

    let list = []
    for (const item of data_NA) {
      let checkHave = data_PU.some((d: any) =>
        d['Analog/Digital'] == item['Analog/Digital'] &&
        d['Material %NG'] == item['Material %NG'] &&
        d['date'] == item['date'],
      )


      if (!checkHave) {
        let date: any = [...new Set(data_PU.map((item: any) => item.date))];
        date.sort()
        // let data_user = data_PU.filter((d: any) => d.date == date[date.length - 1] && d['Analog/Digital'] == item['Analog/Digital'] && d['Material %NG'] == item['Material %NG'])
        // item.value = data_user[0].value
        delete item._id
        item.statusType = "PU"
        list.push(item)
      }
    }
    console.log(list);


    let add = await lastValueFrom(this.api.Yield_Sum_add(list))
  }



  async updateInput() {




    let data_NA = this.data_by_Type.filter((d: any) => d.statusType == "NA")
    let data_PU = this.data_by_Type.filter((d: any) => d.statusType == "PU")

    let field: any = [
      {
        field: "Camera type",
        cellStyle: { 'text-align': 'center' },
        width: 150
      },
      {
        field: "Model",width: 120,
      }
    ]
    let date: any = [...new Set(data_NA.map((item: any) => item.date))];
    for (const iterator of date) {
      field.push(
        {
          field: `Strt Yield ${moment(iterator).format("MMM YYYY")}`,
          width: 120,
          wrapHeaderText: true,
          autoHeaderHeight: true,
        },
        {
          field: `Total Yield ${moment(iterator).format("MMM YYYY")}`,
          width: 120,
          wrapHeaderText: true,
          autoHeaderHeight: true,
        }
      )
    }
    this.columnDefs = field

    let lastData = []
    let model: any = [...new Set(data_NA.map((item: any) => item.model))];
    for (const iterator of model) {
      let data = data_NA.filter((d: any) => d.model == iterator)
      let list: any = {
        "Camera type": data[0].type,
        "Model": iterator
      }
      for (const item of date) {
        let data = data_NA.filter((d: any) => d.date == item && d.model == iterator)
        list[`Strt Yield ${moment(item).format('MMM YYYY')}`] = ((Number(data[0].StrtYield) * 100).toFixed(2)).toString() + " %"
        list[`Total Yield ${moment(item).format('MMM YYYY')}`] = ((Number(data[0].TotalYield) * 100).toFixed(2)).toString() + " %"
      }
      lastData.push(list)
    }
    this.rowData = lastData


  }


  async updateInput_PU() {
    console.log(this.data_by_Type);

    let data_NA = this.data_by_Type.filter((d: any) => d.statusType == "NA")
    let data_PU = this.data_by_Type.filter((d: any) => d.statusType == "PU")
    console.log("🚀 ~ file: summary-yield.component.ts:175 ~ SummaryYieldComponent ~ updateInput_PU ~ data_PU:", data_PU)



    let field: any = [
      {
        field: "Camera type",
        cellStyle: { 'text-align': 'center' },
        width: 150
      },
      {

        field: "Model",width: 120,
      }
    ]
    let date: any = [...new Set(data_PU.map((item: any) => item.date))];
    for (const iterator of date) {
      field.push(
        {
          field: `Strt Yield ${moment(iterator).format("MMM YYYY")}`,
          editable: true,
          onCellValueChanged: this.onCellValueChanged.bind(this),
          width: 120,
          wrapHeaderText: true,
          autoHeaderHeight: true,
        },
        {
          field: `Total Yield ${moment(iterator).format("MMM YYYY")}`,
          editable: true,
          onCellValueChanged: this.onCellValueChanged.bind(this),
          width: 120,
          wrapHeaderText: true,
          autoHeaderHeight: true,
        }
      )
    }
    this.columnDefs_PU = field

    let lastData = []
    let model: any = [...new Set(data_PU.map((item: any) => item.model))];
    for (const iterator of model) {
      let data = data_PU.filter((d: any) => d.model == iterator)
      let list: any = {
        "Camera type": data[0].type,
        "Model": iterator
      }
      for (const item of date) {
        let data = data_PU.filter((d: any) => d.date == item && d.model == iterator)
        list[`Strt Yield ${moment(item).format('MMM YYYY')}`] = ((Number(data[0].StrtYield) * 100).toFixed(2)).toString() + " %"
        list[`Total Yield ${moment(item).format('MMM YYYY')}`] = ((Number(data[0].TotalYield) * 100).toFixed(2)).toString() + " %"
      }
      lastData.push(list)
    }
    this.rowData_PU = lastData


  }

  async onCellValueChanged(params: any) {

    this.data_by_Type = this.data_by_Type.map((e: any) => {
      return {
        ...e,
        newDate: moment(e.date).format('MMM YYYY')
      }
    })
    // console.log("🚀 ~ file: summary-yield.component.ts:245 ~ SummaryYieldComponent ~ this.data_by_Type=this.data_by_Type.map ~ this.data_by_Type:", this.data_by_Type)

    let rawData = this.data_by_Type.filter((d: any) =>
      d.statusType == 'PU' &&
      d.newDate == params.colDef.field.replace("Strt Yield", "").replace("Total Yield", "").trim() &&
      d["model"] == params.data['Model'] &&
      d["type"] == params.data['Camera type']
    )
    // console.log(rawData);
    // console.log(params.colDef.field.split(" "));

    Swal.fire({
      title: `Do you want to change ? <br> ${params.oldValue} => ${params.newValue} `,
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        if (params.colDef.field.split(" ")[0] == 'Strt') {
          let update = lastValueFrom(this.api.Yield_Sum_update(rawData[0]._id, { StrtYield: Number(params.newValue.toString().replace("%", "")) / 100 }))
        }
        if (params.colDef.field.split(" ")[0] == 'Total') {
          let update = lastValueFrom(this.api.Yield_Sum_update(rawData[0]._id, { TotalYield: Number(params.newValue.toString().replace("%", "")) / 100 }))

        }

        //code end
        setTimeout(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1500,
          })
        }, 200);
      }
    })


    // s

  }


}
