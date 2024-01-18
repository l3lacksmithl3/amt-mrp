import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpService } from 'src/app/service/http.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
type AOA = any[][];
import { lastValueFrom, reduce } from 'rxjs';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GridOptions } from 'ag-grid-community';


@Component({
  selector: 'app-wip-upload',
  templateUrl: './wip-upload.component.html',
  styleUrls: ['./wip-upload.component.scss']
})
export class WipUploadComponent implements OnInit {

  dataExcel: any
  timeStamp: any
  type: any
  selected = 'Analog';
  dateSelect: any
  check: any
  moment :any = moment

  rowData: any = []
  columnDefs: any = []
  sum_1: any
  sum_2: any
  sum_3: any
  sum_4: any
  sum_5: any
  sum_6: any
  sum_7: any
  sum_8: any
  sum_9: any
  sum_10: any
  sum_11: any
  sum_12: any

  gridOptions: GridOptions<any> = {
    accentedSort: true,
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    // defaultColDef: {
    //   lockPinned: true,
    //   // sortable: true,
    //   // filter: true,
    //   // editable: true,
    //   floatingFilter: true,
    //   floatingFilterComponentParams: {
    //     suppressFilterButton: true,
    //   },

    // },


  }


  constructor(
    private api: HttpService,
    private ngxService: NgxUiLoaderService
  ) {
  }

  ngOnInit(): void {
    // this.timeStamp = moment('11/1/2023').format()
    // this.type = 'analog'
    this.ngxService.start()
    this.ngxService.stop()

  }



  settable() {
    var elements = document.querySelectorAll('.ag-body-viewport.ag-selectable.ag-layout-normal.ag-row-no-animation');
    let width: any
    elements.forEach(function (element) {
      var style = getComputedStyle(element);
      width = parseInt(style.width);
    });
    console.log(width);


    let field: any = [
      {
        headerName: `Row Labels`,
        field: "Row Labels",
        width: width/14,
        pinned: 'top',
        suppressMovable: true,
      },
      {
        // Sum_1
        field: `${this.sum_1}`,
        width: width/14,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        headerClass: 'setCenter',
        suppressMovable: true,
        children: [
          {
            headerName: `WIP`,
            wrapText: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: 'setCenter',
            field: ``,
            width: width/14, suppressMovable: true,
            children: [
              {
                headerName: `66AA1110-1`,
                wrapText: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                field: `66AA1110-1`,
                width: width/14, suppressMovable: true,
                cellRenderer: (data: any) => {
                  const text = document.createElement('text');
                  text.innerHTML = data.value != '0' && data.value != null ? `${data.value}` : '';
                  return text;
                }
              },
            ]
          },
        ]

      },
      {
        // Sum_1
        field: `${this.sum_2}`,
        width: width/14,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        headerClass: 'setCenter',
        suppressMovable: true,
        children: [
          {
            headerName: `WIP`,
            wrapText: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: 'setCenter',
            field: ``,
            width: width/14, suppressMovable: true,
            children: [
              {
                headerName: `66AA1110-2`,
                wrapText: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                field: `66AA1110-2`,
                width: width/14, suppressMovable: true,
                cellRenderer: (data: any) => {
                  const text = document.createElement('text');
                  text.innerHTML = data.value != '0' && data.value != null ? `${data.value}` : '';
                  return text;
                }
              },
            ]
          },
        ]

      }
      ,
      {
        // Sum_1
        field: `${this.sum_3}`,
        width: width/14,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        headerClass: 'setCenter',
        suppressMovable: true,
        children: [
          {
            headerName: `WIP`,
            wrapText: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: 'setCenter',
            field: ``,
            width: width/14, suppressMovable: true,
            children: [
              {
                headerName: `66AA1110-3`,
                wrapText: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                field: `66AA1110-3`,
                width: width/14, suppressMovable: true,
                cellRenderer: (data: any) => {
                  const text = document.createElement('text');
                  text.innerHTML = data.value != '0' && data.value != null ? `${data.value}` : '';
                  return text;
                }
              },
            ]
          },
        ]

      },
      {
        // Sum_1
        field: `${this.sum_4}`,
        width: width/14,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        headerClass: 'setCenter',
        suppressMovable: true,
        children: [
          {
            headerName: `WIP`,
            wrapText: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: 'setCenter',
            field: ``,
            width: width/14, suppressMovable: true,
            children: [
              {
                headerName: `66AA1110-4`,
                wrapText: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                field: `66AA1110-4`,
                width: width/14, suppressMovable: true,
                cellRenderer: (data: any) => {
                  const text = document.createElement('text');
                  text.innerHTML = data.value != '0' && data.value != null ? `${data.value}` : '';
                  return text;
                }
              },
            ]
          },
        ]

      }, {
        // Sum_1
        field: `${this.sum_5}`,
        width: width/14,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        headerClass: 'setCenter',
        suppressMovable: true,
        children: [
          {
            headerName: `WIP`,
            wrapText: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: 'setCenter',
            field: ``,
            width: width/14, suppressMovable: true,
            children: [
              {
                headerName: `66AA1110-5`,
                wrapText: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                field: `66AA1110-5`,
                width: width/14, suppressMovable: true,
                cellRenderer: (data: any) => {
                  const text = document.createElement('text');
                  text.innerHTML = data.value != '0' && data.value != null ? `${data.value}` : '';
                  return text;
                }
              },
            ]
          },
        ]

      }, {
        // Sum_1
        field: `${this.sum_6}`,
        width: width/14,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        headerClass: 'setCenter',
        suppressMovable: true,
        children: [
          {
            headerName: `WIP`,
            wrapText: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: 'setCenter',
            field: ``,
            width: width/14, suppressMovable: true,
            children: [
              {
                headerName: `66AA1110-6`,
                wrapText: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                field: `66AA1110-6`,
                width: width/14, suppressMovable: true,
                cellRenderer: (data: any) => {
                  const text = document.createElement('text');
                  text.innerHTML = data.value != '0' && data.value != null ? `${data.value}` : '';
                  return text;
                }
              },
            ]
          },
        ]

      },
      {
        // Sum_1
        field: `${this.sum_7}`,
        width: width/14,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        headerClass: 'setCenter',
        suppressMovable: true,
        children: [
          {
            headerName: `Repair`,
            wrapText: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: 'setCenter',
            field: ``,
            width: width/14, suppressMovable: true,
            children: [
              {
                headerName: `Repair`,
                wrapText: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                field: `Repair`,
                width: width/14, suppressMovable: true,
                cellRenderer: (data: any) => {
                  const text = document.createElement('text');
                  text.innerHTML = data.value != '0' && data.value != null ? `${data.value}` : '';
                  return text;
                }
              },
            ]
          },
        ]

      }
      ,
      {
        // Sum_1
        field: `${this.sum_8}`,
        width: width/14,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        headerClass: 'setCenter',
        suppressMovable: true,
        children: [
          {
            headerName: ``,
            wrapText: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: 'setCenter',
            field: ``,
            width: width/14, suppressMovable: true,
            children: [
              {
                headerName: `Grand Total`,
                wrapText: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                field: `GrandTotal`,
                width: width/14, suppressMovable: true,
                cellRenderer: (data: any) => {
                  const text = document.createElement('text');
                  text.innerHTML = data.value != '0' && data.value != null ? `${data.value}` : '';
                  return text;
                }
              },
            ]
          },
        ]

      }
      ,
      {
        headerName: ``,
        field: "En_1",
        width: 130,
        pinned: 'top',
        suppressMovable: true,
      },
      {
        field: `Stock End ${moment(this.dateSelect).format("MMM 'YYYY")}`,
        width: width/14,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        headerClass: 'setCenter',
        suppressMovable: true,
        children: [
          {
            headerName: `${this.sum_9}`,
            wrapText: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: 'setCenter',
            field: ``,
            width: width/14, suppressMovable: true,
            children: [
              {
                headerName: `FG`,
                wrapText: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                field: `66AA1110-6`,
                width: width/14, suppressMovable: true,
                cellRenderer: (data: any) => {
                  const text = document.createElement('text');
                  text.innerHTML = data.value != '0' && data.value != null ? `${data.value}` : '';
                  return text;
                }
              },
            ]
          },
          {
            headerName: `${this.sum_10}`,
            wrapText: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: 'setCenter',
            field: ``,
            width: width/14, suppressMovable: true,
            children: [
              {
                headerName: `WIP`,
                wrapText: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                field: `WIP`,
                width: width/14, suppressMovable: true,
                cellRenderer: (data: any) => {
                  const text = document.createElement('text');
                  text.innerHTML = data.value != '0' && data.value != null ? `${data.value}` : '';
                  return text;
                }
              },
            ]
          },
          {
            headerName: `${this.sum_11}`,
            wrapText: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: 'setCenter',
            field: ``,
            width: width/14, suppressMovable: true,
            children: [
              {
                headerName: `Repair`,
                wrapText: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                field: `Repair`,
                width: width/14, suppressMovable: true,
                cellRenderer: (data: any) => {
                  const text = document.createElement('text');
                  text.innerHTML = data.value != '0' && data.value != null ? `${data.value}` : '';
                  return text;
                }
              },
            ]
          },
          {
            headerName: `${this.sum_12}`,
            wrapText: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerClass: 'setCenter',
            field: ``,
            width: width/14, suppressMovable: true,
            children: [
              {
                headerName: `TTL FG`,
                wrapText: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                field: `TTL`,
                width: width/14, suppressMovable: true,
                cellRenderer: (data: any) => {
                  const text = document.createElement('text');
                  text.innerHTML = data.value != '0' && data.value != null ? `${data.value}` : '';
                  return text;
                }
              },
            ]
          },
        ]

      },

    ]
    this.columnDefs = field

  }


  setdata() {
    this.ngxService.start()
    this.check = this.check.map((d: any) => {
      return {
        ...d,
        GrandTotal: Number(d['66AA1110-1'] || 0) + Number(d['66AA1110-2'] || 0) + Number(d['66AA1110-3'] || 0) + Number(d['66AA1110-4'] || 0) + Number(d['66AA1110-5'] || 0) + Number(d['66AA1110-6'] || 0) + Number(d['Repair'] || 0),
        TTL: Number(d['FG'] || 0) + Number(d['WIP'] || 0) + Number(d['Repair'] || 0),
      }
    })
    console.log(this.check);

    this.sum_1 = this.check.reduce((a: any, b: any) => a + b['66AA1110-1'], 0).toLocaleString()
    this.sum_2 = this.check.reduce((a: any, b: any) => a + b['66AA1110-2'], 0).toLocaleString()
    this.sum_3 = this.check.reduce((a: any, b: any) => a + b['66AA1110-3'], 0).toLocaleString()
    this.sum_4 = this.check.reduce((a: any, b: any) => a + b['66AA1110-4'], 0).toLocaleString()
    this.sum_5 = this.check.reduce((a: any, b: any) => a + b['66AA1110-5'], 0).toLocaleString()
    this.sum_6 = this.check.reduce((a: any, b: any) => a + b['66AA1110-6'], 0).toLocaleString()
    this.sum_7 = this.check.reduce((a: any, b: any) => a + b['Repair'], 0).toLocaleString()
    this.sum_8 = this.check.reduce((a: any, b: any) => a + b['Grand Total'], 0).toLocaleString()
    this.sum_9 = this.check.reduce((a: any, b: any) => a + b['FG'], 0).toLocaleString()
    this.sum_10 = this.check.reduce((a: any, b: any) => a + b['WIP'], 0).toLocaleString()
    this.sum_11 = this.check.reduce((a: any, b: any) => a + b['Repair'], 0).toLocaleString()
    this.sum_12 = this.check.reduce((a: any, b: any) => a + b['TTL'], 0).toLocaleString()
    this.rowData = this.check
    this.ngxService.stop()
  }


  async updateInput() {
    this.dateSelect = moment(this.dateSelect).date(1).format();
    console.log(this.dateSelect);
    console.log(this.selected);

    this.check = await lastValueFrom(this.api.WIP_GetByCondition({ date: this.dateSelect || "", "type": this.selected.toLocaleLowerCase() }))
    console.log("🚀 ~ file: wip-upload.component.ts:39 ~ WipUploadComponent ~ updateInput ~ this.check:", this.check)
    this.setdata()
    this.settable()
    // let get_dataByDate = await lastValueFrom(this.api.YieldGetByCondition({ date: moment(this.dateSelect).format() }))
    // this.data = get_dataByDate
    // this.dataSource = new MatTableDataSource(this.data)
    // this.dataSource.paginator = this.paginator;
  }


  upload(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();

    reader.onload = async (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */

      const data: any[] = []
      const files = evt.target.files
      data.push(...files)
      // console.log(data);


      Swal.fire({
        title: 'Do you want to import data ?',
        icon: 'question',
        showCancelButton: true,
      }).then(async r => {
        if (r.isConfirmed) {
          //code start
          this.Import_WIP(wb)
          //code end
          setTimeout(() => {
            // Swal.fire('Success', '', 'success')
          }, 200);

        }
      })
      //TODO /////////////////////////////////////////////////////////////////


    };
    reader.readAsBinaryString(target.files[0]);
    let id_import = document.getElementById("files") as HTMLInputElement
    id_import.value = ""

  }


  // async loo() {
  //   let list = {
  //     date: this.dateSelect || ""
  //   }
  //   let koo = await lastValueFrom(this.api.WIP_GetByCondition(list))
  //   console.log(koo);

  // }



  async Import_WIP(wb: any) {
    this.ngxService.start()
    // console.log(wb.Sheets);
    // console.log(this.selected);

    const ws: XLSX.WorkSheet = wb.Sheets[`${this.selected}_WIP_Pivot`];
    if (!ws) {
      Swal.fire(`The information doesn't match. <br> Please check again.`, '', 'error')
    } else {
      // this.ngxService.start()
      let header
      this.dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      // console.log(this.dataExcel);

      let StartRow = 0
      header = this.dataExcel[StartRow].map((d: any) => {
        let text = d.replaceAll('.', '')
        let text2 = text.replaceAll('\r\n', '')
        return text2
      })
      // console.log("🚀 ~ file: wip-upload.component.ts:92 ~ WipUploadComponent ~ header=this.dataExcel[StartRow].map ~ header:", header)



      // let row = 6
      // let head_start = row
      let max_row: any
      for (let index = StartRow; index < this.dataExcel.length; index++) {
        if (this.dataExcel[index] == null) {
          max_row = index
          break
        }
        max_row = index + 1
      }


      let data_raw: any
      let rawdata = []
      for (let index = StartRow + 1; index <= max_row - 2; index++) {
        data_raw = {}
        for (const [i, item] of this.dataExcel[index].entries()) {
          let datanew = item
          if (item == undefined || item == "") {
            datanew = 0
          }
          data_raw[header[i]] = datanew
        }
        rawdata.push(data_raw)
      }


      rawdata = rawdata.map((d: any) => {
        return {
          ...d,
          "type": this.selected,
          "date": this.dateSelect,
          "FG": d['66AA1110-6'],
          "WIP": Number(d['66AA1110-1'] || 0) + Number(d['66AA1110-2'] || 0) + Number(d['66AA1110-3'] || 0) + Number(d['66AA1110-4'] || 0) + Number(d['66AA1110-5'] || 0),
        }
      })
      console.log(rawdata);



      for (const item of rawdata) {
        let data = this.check.filter((d: any) => d['Row Labels'] == item['Row Labels'])[0]
        if (data) {
          let update = lastValueFrom(this.api.WIP_Update(data._id, item))
        } else {
          let addData = lastValueFrom(this.api.WIP_Add(item))
        }
      }

      this.ngxService.stop()
      setTimeout(() => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success',
          showConfirmButton: false,
          timer: 1500,
        }).then(()=>{
          this.updateInput()
        })
      }, 1000);





    }
  }



  remove() {
    Swal.fire({
      title: 'Do you want to remove data ?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        //code start
        console.log(this.check);
        let del = await lastValueFrom(this.api.WIP_DelByCondition({ date: this.dateSelect || "", "type": this.selected }))
        if (del) {
          this.updateInput()
        }
        // WIP_DelByCondition
        //code end
        setTimeout(() => {
          Swal.fire('Success', '', 'success')
        }, 200);
      }
    })
  }


  setMonthAndYear(normalizedMonthAndYear: any , datepicker :any) {
    this.dateSelect = normalizedMonthAndYear
    datepicker.close();
    this.updateInput()
  }
}
