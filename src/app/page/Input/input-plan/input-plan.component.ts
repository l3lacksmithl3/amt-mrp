import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
type AOA = any[][];

@Component({
  selector: 'app-input-plan',
  templateUrl: './input-plan.component.html',
  styleUrls: ['./input-plan.component.scss']
})
export class InputPlanComponent implements OnInit {

  dateSelect: any
  moment: any = moment
  dataExcel: any

  digital_data: any
  analog_data: any
  checkHave: any = []
  data_all: any

  data_list: any
  rowData_list: any = []
  columnDefs_list: any = []

  rowData_Analog: any = []
  columnDefs_Analog: any = []

  rowData_Digital: any = []
  columnDefs_Digital: any = []

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
      resizable: false

    },


  }

  constructor(
    private api: HttpService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    // this.dateSelect = '2023-10-30'
    // this.dateSelect = moment()
    // console.log(this.dateSelect);

    // this.updateInput()
  }

  async setMonthAndYear(normalizedMonthAndYear: any, datepicker: any) {
    this.dateSelect = normalizedMonthAndYear
    datepicker?.close();

    this.checkHave = await lastValueFrom(this.api.Input_Plan_GetByCondition({ date: this.dateSelect || "" }))
    let data_compare = await lastValueFrom(this.api.Import_dat_GetByCondition({ date: this.dateSelect || "" }))
    let NoList: any = []
    this.data_all = this.checkHave.map((d: any) => {
      let data = data_compare.filter((a: any) => a['KTC BOM'] == d['Model']).length
      if (data == 0) {
        NoList.push(
          {
            'Model': d['Model'],
            'Qty': d['Qty'],
            'type': d['type'],
            'status': 1
          }
        )
      }
      return {
        ...d,
        status: data == 0 ? 1 : 0
      }
    })
    this.data_list = NoList
    // console.log("🚀 ~ InputPlanComponent ~ setMonthAndYear ~ NoList:", this.data_all)


    // NO list
    // console.log(NoList);


    // this.updateInput()
    this.setDataListRow()
    this.setDataAnalogRow()
    this.setDataDigitalRow()
    this.setDataListCol()
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
          this.Digital(wb)
          this.Analog(wb)
          this.dataDuplication()
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


  async Digital(wb: any) {

    this.ngxService.start()
    const ws: XLSX.WorkSheet = wb.Sheets['DIGITAL'];
    if (!ws) {
      Swal.fire(`The information doesn't match.<br> Please check again.`, '', 'error')
    } else {
      // this.ngxService.start()
      this.dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      let max_row: any
      for (const [index, item] of this.dataExcel.entries()) {
        if (item[0] == '(blank)' || item[0] == 'Grand Total') {
          max_row = index - 1
          break
        } else {
          max_row = index + 1
        }
      }


      let data = []
      for (let index = 1; index <= max_row; index++) {
        data.push(
          {
            'Model': this.dataExcel[index][0],
            'Qty': this.dataExcel[index][1],
          }
        )
      }
      this.digital_data = data
    }
  }
  async Analog(wb: any) {

    this.ngxService.start()
    const ws: XLSX.WorkSheet = wb.Sheets['ANALOG'];
    if (!ws) {
      Swal.fire(`The information doesn't match.<br> Please check again.`, '', 'error')
    } else {
      // this.ngxService.start()
      this.dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      let max_row: any
      for (const [index, item] of this.dataExcel.entries()) {
        if (item[0] == '(blank)' || item[0] == 'Grand Total') {
          max_row = index - 1
          break
        } else {
          max_row = index + 1
        }
      }


      let data = []
      for (let index = 1; index <= max_row; index++) {
        data.push(
          {
            'Model': this.dataExcel[index][0],
            'Qty': this.dataExcel[index][1],
          }
        )
      }
      this.analog_data = data

    }
  }

  async dataDuplication() {
    let data_type = await lastValueFrom(this.api.Yield_Sum_getALl())
    let data = this.analog_data.concat(this.digital_data)
    data = data.filter((d: any) => d['Qty'] != 0)
    const unique: any = [...new Set(data.map((item: any) => item.Model))]; // [ 'A', 'B']

    let data_last = unique.map((d: any) => {
      return {
        Model: d,
        Qty: data.filter((a: any) => a.Model == d)[0].Qty,
        type: data_type.filter((a: any) => a.model == d.slice(0, 3))[0].type,
        date: this.dateSelect
      }
    })

    for (const item of data_last) {
      let add = await lastValueFrom(this.api.Input_Plan_Add(item))
    }

    setTimeout(() => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Success',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        this.ngxService.stop()
      })
    }, 500);

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
          // this.updateInput()
        }
        // WIP_DelByCondition
        //code end
        setTimeout(() => {
          Swal.fire('Success', '', 'success')
        }, 200);
      }
    })
  }




  setDataListCol() {
    var elements = document.querySelectorAll('.ag-body-viewport.ag-selectable.ag-layout-normal.ag-row-no-animation');
    let width: any
    elements.forEach(function (element) {
      var style = getComputedStyle(element);
      width = parseInt(style.width);
    });
    let field = [
      {
        headerName: "Model",
        field: "Model",
        width: width / 3,
        pinned: 'top',
        suppressMovable: true,
        valueGetter: function (params: any) {
          if (params.data.status == 1) {
            params.colDef.cellClass = 'Color_PINK'
            if (params.data.statusModel == 1) {
              params.colDef.cellClass = 'Color_BlueLow'
            }
          }else{
            params.colDef.cellClass = ''
            if (params.data.statusModel == 1) {
              params.colDef.cellClass = 'Color_BlueLow'
            }
          }
          let value = params.data.Model
          return value ? value : ''
        },


        cellRenderer: (data: any) => {
          const button = document.createElement('button');
          button.innerHTML = `${data.value}`;
          button.classList.add('btn')
          if (data.data._id) {
            button.addEventListener('click', (event) => this.onBtnClick1(event, data.data, ''));
          }


          return button;
        }

      },

      {
        headerName: "Qty",
        field: "Qty",
        width: width / 3,
        pinned: 'top',
        suppressMovable: true,
        valueGetter: function (params: any) {
          if (params.data.status == 1) {
            params.colDef.cellClass = 'Color_PINK'
            if (params.data.statusModel == 1) {
              params.colDef.cellClass = 'Color_BlueLow'
            }
          }else{
            params.colDef.cellClass = ''
            if (params.data.statusModel == 1) {
              params.colDef.cellClass = 'Color_BlueLow'
            }
          }
          let value = params.data.Qty
          return value ? value : ''
        },
      },
      {
        headerName: "Type",
        field: "type",
        width: width / 3,
        pinned: 'top',
        suppressMovable: true,
        valueGetter: function (params: any) {
          if (params.data.status == 1) {
            params.colDef.cellClass = 'Color_PINK'
            if (params.data.statusModel == 1) {
              params.colDef.cellClass = 'Color_BlueLow'
            }
          }else{
            params.colDef.cellClass = ''
            if (params.data.statusModel == 1) {
              params.colDef.cellClass = 'Color_BlueLow'
            }
          }
          let value = params.data.type
          return value ? value : ''
        },
      },
    ]
    this.columnDefs_list = field
    this.columnDefs_Analog = field
    this.columnDefs_Digital = field

  }


  setDataListRow() {
    this.rowData_list = this.data_list
  }

  setDataAnalogRow() {
    let analog = this.data_all.filter((d: any) => d['type'] == 'Analog')
    this.rowData_Analog = analog
  }

  setDataDigitalRow() {
    let digital = this.data_all.filter((d: any) => d['type'] == 'Digital')
    this.rowData_Digital = digital
  }

  async onBtnClick1(event: any, value: any, month: any) {
    const inputValue : any= value.Model
    const { value: model } = await Swal.fire({
      input: "text",
      inputLabel: "Edit Model",
      inputPlaceholder: "Model",
      inputValue,
      width : 200,
      showClass: {
        popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `
      },
      hideClass: {
        popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `
      }
    });

    if (model) {
      // console.log(value);
      value.Model = model
      value.statusModel = 1
      let update = await lastValueFrom(this.api.Input_Plan_Update(value._id,value))
      if (update) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success',
          showConfirmButton: false,
          timer: 1500,
        }).then(()=>{
          this.setMonthAndYear(this.dateSelect,null)
        })
      }

    }
  }
}
