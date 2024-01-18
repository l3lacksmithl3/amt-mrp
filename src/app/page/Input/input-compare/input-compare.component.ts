import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpService } from 'src/app/service/http.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
type AOA = any[][];
import { lastValueFrom } from 'rxjs';
import { GridOptions } from 'ag-grid-community';
import {Moment} from 'moment';

@Component({
  selector: 'app-input-compare',
  templateUrl: './input-compare.component.html',
  styleUrls: ['./input-compare.component.scss']
})
export class InputCompareComponent implements OnInit {

  dataExcel: any
  timeStamp: any
  dateSelect: any
  check: any = []

  rowData: any = []
  columnDefs: any = []
  moment : any = moment

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
  ) { }

  ngOnInit(): void {
    // this.dateSelect = '2023-10-30'
    // this.updateInput()
    this.ngxService.start()
    this.ngxService.stop()
  }


  async updateInput() {
    this.ngxService.start()

    this.dateSelect = moment(this.dateSelect).date(1).format();

    this.check = await lastValueFrom(this.api.Import_dat_GetByCondition({ date: this.dateSelect || "" }))
    // console.log("🚀 ~ file: wip-upload.component.ts:39 ~ WipUploadComponent ~ updateInput ~ this.check:", this.check)
    // this.setdata()
    // this.settable()
    // let get_dataByDate = await lastValueFrom(this.api.YieldGetByCondition({ date: moment(this.dateSelect).format() }))
    // this.data = get_dataByDate
    // this.dataSource = new MatTableDataSource(this.data)
    // this.dataSource.paginator = this.paginator;
    if (this.check.length != 0) {
      this.setColumnDefs()
      this.setRowData()
      this.ngxService.stop()
    }else{
      this.ngxService.stop()

    }

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
          this.Import_Compare(wb)
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



  async Import_Compare(wb: any) {

    this.ngxService.start()
    const ws: XLSX.WorkSheet = wb.Sheets['Compare'];
    if (!ws) {
      Swal.fire(`The information doesn't match.<br> Please check again.`, '', 'error')
    } else {
      // this.ngxService.start()
      let header
      this.dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      let StartRow = 6
      header = this.dataExcel[StartRow].map((d: any) => {
        let text = d.replaceAll('.', '')
        let text2 = text.replaceAll('\r\n', '')
        return text2
      })
      // console.log(header);

      console.log(this.dataExcel);


      let row = 6
      let head_start = row
      let max_row: any

      for (let index = row + 1; index < this.dataExcel.length; index++) {
        if (this.dataExcel[index][0] == null) {
          max_row = index
          break
        }
        max_row = index + 1
      }


      let data_raw: any = []
      for (let loop = 6; loop <= max_row - 2; loop++) {
        let data: any = {}
        data.value = []
        for (let i = 1; i <= 9; i++) {
          data[`${this.dataExcel[head_start][i]}`] = this.dataExcel[loop + 1][i]
        }

        //month / data / year
        data['date'] = this.timeStamp
        data['amount'] = 1

        // console.log(header);

        for (let j = 10; j <= header.length; j++) {


          // if (!this.dataExcel[loop + 1][j]) {
          data.value.push(
            {
              "data": this.dataExcel[head_start][j],
              "value": this.dataExcel[loop + 1][j]
            }
          )
          // }
        }
        // console.log(data);

        data_raw.push(data)
      }



      data_raw = data_raw.map((d: any) => {
        return {
          ...d,
          date: this.dateSelect
        }
      })

      for (const item of data_raw) {
        let add_data = await lastValueFrom(this.api.Import_data_add(item))
      }

      this.ngxService.stop()

      setTimeout(() => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success',
          showConfirmButton: false,
          timer: 1500,
        })
      }, 500);



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
        let del = await lastValueFrom(this.api.Import_del_ByCondition({ date: this.dateSelect || "" }))
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


  setColumnDefs() {
    // console.log(this.check);
    let field: any = [
      {
        headerName: "生産地(最終出荷)",
        field: "生産地(最終出荷)",
        width: 130,
        // pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,
      },
      {
        headerName: "機種",
        field: "機種", width: 120,
        // pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,
      },
      {
        headerName: "KC品番",
        field: "KC品番", width: 100,
        // pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,
      },
      {
        headerName: "カメラ形状種類",
        field: "カメラ形状種類", width: 120,
        // pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,
      },
      {
        headerName: "客先品番",
        field: "客先品番", width: 120,
        // pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,
      },
      {
        headerName: "Analog/Digital",
        field: "Analog/Digital", width: 120,
        // pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,
      },
      {
        headerName: "KTC BOM",
        field: "KTC BOM", width: 120,
        // pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,
      },
      {
        headerName: "Mass/Pre-launch ",
        field: "Mass/Pre-launch ", width: 120,
        // pinned: 'left',
        cellClass: 'color',
        suppressMovable: true,
      }
    ]

    for (const [index, iterator] of this.check[0]?.value.entries()) {
      field.push(
        {
          headerName: iterator && iterator.data ? `${iterator.data}` : '',
          field: "value",
          width: 200,

          // pinned: 'left',
          cellClass: iterator && iterator.data ? '' : 'color',
          suppressMovable: true,
          valueGetter: function (params: any) {
            if (params && params.data.value && params.data.value[index] && params.data.value.length > 0) {
              // console.log(params);

              let value = params.data.value[index]['value']
              if (value) {
                if (value.toString().split('.').length > 1) {
                  return value.toFixed(2)
                }else{
                  return value
                }
              }else{
                return ''
              }
            }
            return '';
          },

        }
      )
    }

    this.columnDefs = field
  }

  setRowData() {
    this.rowData = this.check
  }


  setMonthAndYear(normalizedMonthAndYear: any , datepicker :any) {
    this.dateSelect = normalizedMonthAndYear
    datepicker.close();
    this.updateInput()
  }
}
