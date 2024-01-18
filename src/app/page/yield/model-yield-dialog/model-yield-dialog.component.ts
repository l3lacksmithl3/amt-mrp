import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-model-yield-dialog',
  templateUrl: './model-yield-dialog.component.html',
  styleUrls: ['./model-yield-dialog.component.scss']
})
export class ModelYieldDialogComponent implements OnInit {

  moment: any = moment
  custom: any

  data_use: any = {}
  select: any
  constructor(
    private dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: HttpService
  ) { }

  async ngOnInit(): Promise<void> {

    // console.log(this.data);

    this.data_use = {
      Yield_Type: this.data.value.Yield_Type,
      Strt_Yield: this.data.value.value[3].Strt,
      Total_Yield: this.data.value.value[3].Total,
      Average_Strt: this.data.value.Average_Strt,
      Average_Total: this.data.value.Average_Total,
      Average_PU: this.data.value.Average_PU,
      custom: this.data.value.Average_PU
    }
    // console.log(this.data_use);
    // console.log(moment(this.data.month).format('MM'));
    // console.log(this.data);


    let list = {
      "Model No": this.data.value['Model No'],
      "Type": this.data.value['Type'],
      "date": {
        $gte: moment(this.data.month).startOf("month").toDate(),
        $lte: moment(this.data.month).endOf("month").toDate(),
      }
    }
    this.select = await lastValueFrom(this.api.YieldGetByCondition(list))
  }

  async Select(num: any) {
    let value
    switch (num) {
      case 1:
        value = Number(this.data_use.Yield_Type.split(" ")[0]) / 100 || 0
        break;
      case 2:
        value = Number(this.data_use.Average_Strt.split(" ")[0]) / 100 || 0
        break;
      case 3:
        value = Number(this.data_use.Average_Total.split(" ")[0]) / 100 || 0
        break;
      case 4:
        value = Number(this.data_use.Average_PU.split(" ")[0]) / 100 || 0
        break;
      case 5:
        value = Number(this.custom) / 100 || 0
        break;
      case 6:
        value = Number(this.data_use.Strt_Yield.split(" ")[0]) / 100 || 0
        break;
      case 7:
        value = Number(this.data_use.Total_Yield.split(" ")[0]) / 100 || 0
        break;
      default:
        break;
    }
    // console.log(value);

    if (this.select.length != 0) {
      this.select[0].PU_yield = value
      if (num != 1) {
        this.select[0].statusByType = 0
      }else{
        this.select[0].statusByType = 1
      }
      let update = await lastValueFrom(this.api.YieldUpdate(this.select[0]._id, this.select[0]))
      if (update) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          let data = {
            value : this.select[0].PU_yield,
            type : num
          }
          this.dialog.close(data)
        })
      }
    }

  }



}
