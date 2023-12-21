import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { HttpService } from 'src/app/service/http.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
type AOA = any[][];
import { lastValueFrom } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-upload-yield',
  templateUrl: './upload-yield.component.html',
  styleUrls: ['./upload-yield.component.scss']
})

export class UploadYieldComponent implements OnInit {

  dateSelect: any
  data: any = []
  dataExcel: any

  displayedColumns: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9',];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;

  constructor(
    private api: HttpService,
    private ngxService: NgxUiLoaderService

  ) { }

  ngOnInit(): void {

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
      this.ngxService.start()
      //TODO /////////////////////////////////////////////////////////////////
      this.import_yield_sum(wb)
      this.import_yield_bracket(wb)
      this.import_yield_byModel(wb)


    };
    reader.readAsBinaryString(target.files[0]);
    let id_import = document.getElementById("files") as HTMLInputElement
    id_import.value = ""

  }




  async import_yield_byModel(wb: any) {
    const ws: XLSX.WorkSheet = wb.Sheets['Yield'];
    if (!ws) {
      Swal.fire(`The information doesn't match.<br> Please check again.`, '', 'error')
    } else {
      // this.ngxService.start()
      let header
      this.dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      header = this.dataExcel[0].map((d: any) => {
        let text = d.replaceAll('.', '')
        let text2 = text.replaceAll('\r\n', '')
        return text2
      })
      console.log(header);

      let data_raw: any = {}
      let max_row: any

      for (let index = 0; index < this.dataExcel.length; index++) {
        if (this.dataExcel[index].length == 0) {
          max_row = index
          console.log(index);
          break
        }
        max_row = index + 1
      }

      let rawdata = []
      for (let index = 1; index < max_row; index++) {
        data_raw = {}
        for (const [i, item] of this.dataExcel[index].entries()) {
          let datanew = item
          if (item == undefined || item == "") {
            // console.log("aaaa");
            datanew = 0
          }
          data_raw[header[i]] = datanew
        }
        rawdata.push(data_raw)
      }

      rawdata = rawdata.map((d: any) => {
        return {
          ...d,
          date: moment(this.dateSelect).format(),
        }
      })

      let del = await lastValueFrom(this.api.YieldByCondition({ date: moment(this.dateSelect).format() }))
      if (del) {
        for (const item of rawdata) {
          let addData = await lastValueFrom(this.api.Yield_add(item))
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
        })
        this.updateInput()
      }, 1000);
      //TODO /////////////////////////////////////////////////////////////////

    }
  }


  async import_yield_sum(wb: any) {
    const ws: XLSX.WorkSheet = wb.Sheets['Summary'];
    if (!ws) {
      Swal.fire(`The information doesn't match.<br> Please check again.`, '', 'error')
    } else {
      // this.ngxService.start()

      this.dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      let max_row: any


      for (let index = 0; index < this.dataExcel.length; index++) {
        if (this.dataExcel[index].length == 0) {
          max_row = index
          break
        }
        max_row = index + 1
      }

      let rawdata = []
      for (let row = 2; row < max_row; row++) {
        for (const [index, iterator] of this.dataExcel[row].entries()) {
          if (index > 1 && index % 2 == 0) {
            let data = {
              date: moment(this.dataExcel[1][index].replace("%Yield on ", "")).format(),
              model: this.dataExcel[row][1],
              type: this.dataExcel[row][0],
              "StrtYield": this.dataExcel[row][index],
              "TotalYield": this.dataExcel[row][index + 1],
              'statusType' : "NA"
            }
            rawdata.push(data)
          }
        }
      }
      rawdata = rawdata.filter((d: any) => d.date == moment(this.dateSelect).format())
      let check = await lastValueFrom(this.api.Yield_Sum_GetByCondition({ date: this.dateSelect }))
      if (check.length != 0) {
        for (const [i, item] of check.entries()) {
          let update = await lastValueFrom(this.api.Yield_Sum_update(item._id, { StrtYield: rawdata[i].StrtYield, TotalYield: rawdata[i].TotalYield }))
        }
      } else {
        for (const item of rawdata) {
          let add = await lastValueFrom(this.api.Yield_Sum_add(item))
        }
      }



      // let del = await lastValueFrom(this.api.Yield_Sum_ByCondition({}))
      // if (del) {
      //   for (const item of rawdata) {
      //     let addData = await lastValueFrom(this.api.Yield_Sum_add(item))
      //   }
      // }

    }
  }


  async import_yield_bracket(wb: any) {
    const ws: XLSX.WorkSheet = wb.Sheets['Bracket'];
    if (!ws) {
      Swal.fire(`The information doesn't match.<br> Please check again.`, '', 'error')
    } else {
      // this.ngxService.start()

      this.dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      let max_row: any


      for (let index = 0; index < this.dataExcel.length; index++) {
        if (this.dataExcel[index].length == 0) {
          max_row = index
          break
        }
        max_row = index + 1
      }
      // console.log(max_row);

      // console.log(this.dataExcel);

      let rawdata = []
      for (let row = 1; row < max_row; row++) {
        for (const [index, iterator] of this.dataExcel[row].entries()) {
          if (index > 1) {
            let data = {
              "Analog/Digital": this.dataExcel[row][0],
              "Material %NG": this.dataExcel[row][1],
              "date": moment(this.dataExcel[0][index].replace("-", "-20")).format(),
              "value": this.dataExcel[row][index],
              'PU_yield' : "0"
            }
            rawdata.push(data)
          }
        }
      }
      rawdata = rawdata.filter((d: any) => d.date == moment(this.dateSelect).format())
      // console.log(rawdata);


      let check = await lastValueFrom(this.api.Yield_bracket_GetByCondition({ date: this.dateSelect }))
      if (check.length != 0) {
        for (const [i, item] of check.entries()) {
          let update = await lastValueFrom(this.api.Yield_bracket_update(item._id, { value: rawdata[i].value }))
        }
      } else {
        for (const item of rawdata) {
          let add = await lastValueFrom(this.api.Yield_bracket_add(item))
        }
      }

    }
  }


  async updateInput() {
    this.dateSelect = moment(this.dateSelect).date(1).format();
    let get_dataByDate = await lastValueFrom(this.api.YieldGetByCondition({ date: moment(this.dateSelect).format() }))
    this.data = get_dataByDate
    this.dataSource = new MatTableDataSource(this.data)
    this.dataSource.paginator = this.paginator;
  }
}
