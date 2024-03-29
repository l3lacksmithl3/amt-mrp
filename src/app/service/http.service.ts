import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }
  Url: any = environment.UrlApi



  // //ITasset
  // updateAsset(id: any, data: any): Observable<any> {
  //   return this.http.put(this.Url + "/ITasset/insert/" + id, data)
  // }
  Yield_Last(): Observable<any> {
    return this.http.get(this.Url + "/yield_model/lastData/")
  }
  Yield_add(data: any): Observable<any> {
    return this.http.post(this.Url + "/yield_model/", data)
  }
  Yield_getALl(): Observable<any> {
    return this.http.get(this.Url + "/yield_model/")
  }
  YieldGetByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/yield_model/getByCondition/", data)
  }
  YieldByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/yield_model/delByCondition/", data)
  }
  YieldUpdate(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/yield_model/insert/" + id, data)
  }
  YieldByAgg(data: any): Observable<any> {
    return this.http.post(this.Url + "/yield_model/getByAggregate/", data)
  }
  getByAG(data: any): Observable<any> {
    return this.http.post(this.Url + "/yield_model/getByAG/", data)
  }



  Yield_Sum_add(data: any): Observable<any> {
    return this.http.post(this.Url + "/yield_summary/", data)
  }
  Yield_Sum_getALl(): Observable<any> {
    return this.http.get(this.Url + "/yield_summary/")
  }
  Yield_Sum_GetByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/yield_summary/getByCondition/", data)
  }
  Yield_Sum_ByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/yield_summary/delByCondition/", data)
  }
  Yield_Sum_update(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/yield_summary/insert/" + id, data)
  }
  Yield_Sum_getByMonth(data: any): Observable<any> {
    return this.http.post(this.Url + "/yield_summary/getByMonth/", data)
  }




  Yield_bracket_add(data: any): Observable<any> {
    return this.http.post(this.Url + "/yield_bracket/", data)
  }
  Yield_bracket_getALl(): Observable<any> {
    return this.http.get(this.Url + "/yield_bracket/")
  }
  Yield_bracket_GetByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/yield_bracket/getByCondition/", data)
  }
  Yield_bracket_ByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/yield_bracket/delByCondition/", data)
  }
  Yield_bracket_update(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/yield_bracket/insert/" + id, data)
  }



  Yield_bracket_PU_add(data: any): Observable<any> {
    return this.http.post(this.Url + "/yield_bracket_PU/", data)
  }
  Yield_bracket_PU_getALl(): Observable<any> {
    return this.http.get(this.Url + "/yield_bracket_PU/")
  }
  Yield_bracket_PU_GetByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/yield_bracket_PU/getByCondition/", data)
  }
  Yield_bracket_PU_ByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/yield_bracket_PU/delByCondition/", data)
  }
  Yield_bracket_PU_update(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/yield_bracket_PU/insert/" + id, data)
  }
  Yield_bracket_PU_last(): Observable<any> {
    return this.http.get(this.Url + "/yield_bracket_PU/lastData/" )
  }


  Import_data_add(data: any): Observable<any> {
    return this.http.post(this.Url + "/Import_data_macro/", data)
  }
  Import_dat_GetByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/Import_data_macro/getByCondition/", data)
  }
  Import_del_ByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/Import_data_macro/delByCondition/", data)
  }
  Import_dat_Aggregations(data: any): Observable<any> {
    return this.http.post(this.Url + "/Import_data_macro/aggregations/", data)
  }
  Import_data_update(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/Import_data_macro/insert/" + id, data)
  }



  WIP_Update(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/WIP/insert/" + id, data)
  }
  WIP_Add(data: any): Observable<any> {
    return this.http.post(this.Url + "/WIP/", data)
  }
  WIP_GetByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/WIP/getByCondition/", data)
  }
  WIP_DelByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/WIP/delByCondition/", data)
  }



  Input_Plan_Update(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/Input_Plan/insert/" + id, data)
  }
  Input_Plan_Add(data: any): Observable<any> {
    return this.http.post(this.Url + "/Input_Plan/", data)
  }
  Input_Plan_GetByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/Input_Plan/getByCondition/", data)
  }
  Input_Plan_DelByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/Input_Plan/delByCondition/", data)
  }

}

// getDataView
