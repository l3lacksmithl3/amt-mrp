import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-summary-yield-dialog',
  templateUrl: './summary-yield-dialog.component.html',
  styleUrls: ['./summary-yield-dialog.component.scss']
})
export class SummaryYieldDialogComponent implements OnInit {

  data_use: any
  select: any
  custom: any
  moment: any = moment

  constructor(
    private dialog: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: HttpService
  ) { }

  async ngOnInit(): Promise<void> {
    console.log(this.data);
    console.log(`${moment(this.data.month).subtract(1, 'month').format('M')}_Strt`);

    this.data_use = {
      // Yield_Type: this.data.value['Camera type'],
      Strt_Yield: this.data.value.value[this.data.value.value.length - 1]['Strt'],
      Total_Yield: this.data.value.value[this.data.value.value.length - 1]['Total'],
      Last_PU: this.data.value.value[this.data.value.value.length - 2]['PU'],
      Average_Strt: this.data.value.Average_Strt,
      Average_Total: this.data.value.Average_Total,
      Average_PU: this.data.value.Average_PU,
      custom: '-'
    }
    console.log(this.data_use);
    // console.log(moment(this.data.month).format('MM'));
    // console.log(this.data);


    let list = {
      "model": this.data.value['Model'],
      "type": this.data.value['Camera type'],
      "date": {
        $gte: moment(this.data.month).startOf("month").toDate(),
        $lte: moment(this.data.month).endOf("month").toDate(),
      }
    }
    // console.log(list);

    this.select = await lastValueFrom(this.api.Yield_Sum_GetByCondition(list))
    // console.log("🚀 ~ file: summary-yield-dialog.component.ts:48 ~ SummaryYieldDialogComponent ~ ngOnInit ~ this.select:", this.select)

  }

  async Select(num: any) {
    let value
    switch (num) {
      case 1:
        value = Number(this.data_use.Last_PU.split(" ")[0]) / 100 || 0
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

      if (Number(this.data_use.Last_PU.split(" ")[0]) / 100 == value) {
        this.select[0].status_pu = 1
      } else {
        this.select[0].status_pu = 0
      }
      // console.log(Number(this.data_use.Last_PU.split(" ")[0]) / 100 || 0);
      // console.log(value);

      // console.log(this.select[0]);


      let update = await lastValueFrom(this.api.Yield_Sum_update(this.select[0]._id, this.select[0]))
      if (update) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          let data = {
            value: this.select[0].PU_yield,
            type: this.select[0].status_pu
          }
          this.dialog.close(data)
        })
      }
    }

  }


}
