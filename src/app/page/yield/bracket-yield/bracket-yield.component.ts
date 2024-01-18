import { lastValueFrom } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpService } from 'src/app/service/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bracket-yield',
  templateUrl: './bracket-yield.component.html',
  styleUrls: ['./bracket-yield.component.scss']
})
export class BracketYieldComponent implements OnInit {

  startDate: any;
  endDate: any;

  moment: any = moment
  rawdata: any

  list: any

  rowData: any
  columnDefs: any

  rowData_PU: any
  columnDefs_PU: any
  data_bracket: any

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

    let dataRaw = await lastValueFrom(this.api.Yield_bracket_getALl())
    let date: any = [...new Set(dataRaw.map((item: any) => item.date))];
    date.sort()
    this.startDate = moment(date[0]).format()
    this.endDate = moment().format()

    this.updateDate()
    // this.checkupdate()


  }


  async updateDate() {
    this.data_bracket = await lastValueFrom(this.api.Yield_bracket_GetByCondition({
      date: {
        $gte: moment(this.startDate).startOf("month").toDate(),
        $lte: moment(this.endDate).endOf("month").toDate(),
      },
    }))
    this.updateInput()
    this.updateInput_PU()
  }


  // async checkupdate() {

  //   let data_NA = this.data_bracket.filter((d: any) => d.statusType == "NA")
  //   let data_PU = this.data_bracket.filter((d: any) => d.statusType == "PU")

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
  //       let data_user = data_PU.filter((d: any) => d.date == date[date.length - 1] && d['Analog/Digital'] == item['Analog/Digital'] && d['Material %NG'] == item['Material %NG'])
  //       item.value = data_user[0].value
  //       delete item._id
  //       item.statusType = "PU"
  //       list.push(item)
  //     }
  //   }

  //   let add = await lastValueFrom(this.api.Yield_bracket_add(list))



  // }



  async updateInput() {

    let data_NA = this.data_bracket
    let field: any = [
      {
        field: "Analog / Digital",
        cellStyle: { 'text-align': 'center' },
        width: 150
      },
      {
        field: "Material %NG",
        width: 150
      }
    ]
    let date: any = [...new Set(data_NA.map((item: any) => item.date))];
    date.sort()
    for (const [index, iterator] of date.entries()) {
      field.push(
        {
          field: `${moment(iterator).format("MMM YY")}`,
          width: 110,
          valueGetter: function (params: any) {
            if (params.data.value && params.data.value.length > 0) {
              let value = params.data.value[index + 0]['value']
              return value ? value : ''
            }
            return '';
          },
        }
      )
    }
    this.columnDefs = field

    let lastData = []
    let type: any = [...new Set(data_NA.map((item: any) => item['Analog/Digital']))];


    for (const iterator of type) {
      let data = data_NA.filter((d: any) => d['Analog/Digital'] == iterator)
      // let list: any = {
      //   "Analog / Digital": iterator,
      //   "Material %NG": data[0]['Material %NG']
      // }
      let list_new: any = []
      for (const item of date) {
        let data = data_NA.filter((d: any) => d['Analog/Digital'] == iterator && d.date == item)
        if (data.length != 0) {
          // list[`${moment(item).format('MMM YYYY')}`] = ((Number(data[0].value) * 100).toFixed(2)).toString() + " %"
          list_new.push(
            {
              'data': `${moment(item).format("MMM 'YY")}`,
              'value': ((Number(data[0].value) * 100).toFixed(2)).toString() + " %",
              'pu': ((Number(data[0].PU_yield) * 100).toFixed(2)).toString() + " %",
            }
          )
        }
      }
      lastData.push(
        {
          "Analog / Digital": iterator,
          "Material %NG": data[0]['Material %NG'],
          'value': list_new
        }
      )

    }
    this.rowData = lastData
  }



  async updateInput_PU() {
    let data_PU = this.data_bracket
    let field: any = [
      {
        field: "Analog / Digital",
        cellStyle: { 'text-align': 'center' },
        width: 150
      },
      {
        field: "Material %NG",
        width: 150
      }
    ]

    let date: any = [...new Set(data_PU.map((item: any) => item.date))];
    date.sort()
    for (const [index, iterator] of date.entries()) {
      // field.push(
      //   {
      //     field: `${moment(iterator).format("MMM YYYY")}`,
      //     width: 110,
      //     editable: true,
      //     onCellValueChanged: this.onCellValueChanged.bind(this),
      //   }
      // )
      field.push(
        {
          field: `${moment(iterator).format("MMM YY")}`,
          width: 110,
          editable: true,
          onCellValueChanged: this.onCellValueChanged.bind(this, this, index),
          valueGetter: function (params: any) {
            if (params.data.value && params.data.value.length > 0) {
              let value = params.data.value[index + 0]['pu']
              // let value = 'sss'
              return value ? value : ''
            }
            return '';
          },
          // cellRenderer: (data: any) => {
          //   const text = document.createElement('text');
          //   text.innerHTML = `${data.value}` ? `${data.value}` : '-';

          //   // text.classList.add('setFull')

          //   // if (data.data.value[index + 0]['StatusType'] == 1) {
          //   //   text.classList.add('color_type_By')
          //   // }

          //   return text;
          // }


        }
      )
    }

    this.columnDefs_PU = field




    let lastData: any = []
    let type: any = [...new Set(data_PU.map((item: any) => item['Analog/Digital']))];
    for (const iterator of type) {
      let data = data_PU.filter((d: any) => d['Analog/Digital'] == iterator)
      // let list: any = {
      //   "Analog / Digital": iterator,
      //   "Material %NG": data[0]['Material %NG']
      // }
      let list_new: any = []
      for (const item of date) {
        let data = data_PU.filter((d: any) => d['Analog/Digital'] == iterator && d.date == item)
        if (data.length != 0) {
          // list[`${moment(item).format('MMM YYYY')}`] = ((Number(data[0].value) * 100).toFixed(2)).toString() + " %"
          list_new.push(
            {
              'data': `${moment(item).format("MMM 'YY")}`,
              'value': ((Number(data[0].value) * 100).toFixed(2)).toString() + " %",
              'pu': ((Number(data[0].PU_yield) * 100).toFixed(2)).toString() + " %",
              'id' : data[0]._id
            }
          )
        }
      }
      lastData.push(
        {
          "Analog / Digital": iterator,
          "Material %NG": data[0]['Material %NG'],
          'value': list_new
        }
      )

    }
    this.rowData_PU = lastData
  }



  async onCellValueChanged(context: any, index: any, params: any) {


    console.log(params.data.value[index]);

    console.log(`${params.colDef.field}`);
    console.log(params.data[`${params.colDef.field}`]);



    // this.data_bracket = this.data_bracket.map((e: any) => {
    //   return {
    //     ...e,
    //     newDate: moment(e.date).format('MMM YYYY')
    //   }
    // })

    // let rawData = this.data_bracket.filter((d: any) =>
    //   d.newDate == params.colDef.field &&
    //   d["Analog/Digital"] == params.data['Analog / Digital'] &&
    //   d["Material %NG"] == params.data['Material %NG']
    // )

    Swal.fire({
      title: `Do you want to change ? <br> ${params.oldValue} => ${params.data[`${params.colDef.field}`]} `,
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        let update :any = lastValueFrom(this.api.Yield_bracket_update(params.data.value[index].id, { PU_yield: Number(params.data[`${params.colDef.field}`].toString().replace("%", "")) / 100 }))
        //code end
        setTimeout(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1500,
          }).then(()=>{
            this.updateDate()
          })
        }, 200);
      }
    })


    // s

  }

  update(){

  }


}
