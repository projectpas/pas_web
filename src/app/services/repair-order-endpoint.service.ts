import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError,map} from 'rxjs/operators';
@Injectable()
export class RepairOrderEndpoint extends EndpointFactory {

  private readonly _repairOrderLiteUrl: string = "/api/RepairOrder/basic";
  private readonly _roByIdUrl: string = "/api/repairOrder/robyid";
  private readonly _saveCreateROApproval: string = "/api/repairOrder/createroapprover";
  private readonly _updateROApproval: string = "/api/repairOrder/updateroapprover";

  get repairOrderBasicListUrl() { return this.configurations.baseUrl + this._repairOrderLiteUrl; }

  constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

    super(http, configurations, injector);
  }

  getRepairOrderBasicList<T>(): Observable<T> {
    return this.http.get<any>(this._repairOrderLiteUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getRepairOrderBasicList());
      }));
  }
  
  // 2
  saveRepairOrder<T>(param: any): Observable<any> {
    let url = `${this.configurations.baseUrl}/api/repairOrder/createrepairOrder`;
    let body = JSON.stringify(param);
    return this.http.post(url, body, this.getRequestHeaders())
      .pipe(map((response: Response) => {
        return <any>response;
      }),catchError(error => {
        return this.handleError(error, () => this.saveRepairOrder(param));
    }));
  }
  
  // 3
  saverRepairOrderParts<T>(param: any): Observable<any> {
    let url = `${this.configurations.baseUrl}/api/repairOrder/createrepairOrderparts`;
    let body = JSON.stringify(param);
    return this.http.post(url, body, this.getRequestHeaders())
      .pipe(map((response: Response) => {
        return <any>response;

      }),catchError(error => {
        return this.handleError(error, () => this.saverRepairOrderParts(param));
    }));

  }
   
  getRepairOrderPartsById<T>(Id: number, workOrderPartNumberId): Observable<T> {
    workOrderPartNumberId= workOrderPartNumberId ? workOrderPartNumberId : 0;
		let endPointUrl = `${this.configurations.baseUrl}/api/repairOrder/roPartsById?repairOrderId=${Id}&workOrderPartNoId=${workOrderPartNumberId}`;

		return this.http.get<any>(endPointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getRepairOrderPartsById<T>(Id, workOrderPartNumberId));
			}));
	}

  // 5
  getROList(data) {
    const url = `${this.configurations.baseUrl}/api/repairOrder/roListWithFilters`;
		return this.http.post(url, JSON.stringify(data), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getROList(data));
			}));
	}

  // 6

  getROViewById(repairOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/repairOrder/roViewById?repairOrderId=${repairOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getROViewById(repairOrderId));
    }));
  }


  // 7
  getROPartsViewById(repairOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/repairOrder/roPartsViewById?repairOrderId=${repairOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getROPartsViewById(repairOrderId));
    }));
  } 
  
   // 17
   getROApprovalListById(repairOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/repairOrder/getroapprovallist?repairOrderId=${repairOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getROApprovalListById(repairOrderId));
    }));
  }



  // 12 4
  getVendorROHeaderById(repairOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/repairOrder/roheaderdetails?repairOrderId=${repairOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getVendorROHeaderById(repairOrderId));
          }));
  }

   // 13
   getroPartsById(repairOrderId,workOrderPartNoId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/repairOrder/roPartsById?repairOrderId=${repairOrderId}&workOrderPartNoId=${workOrderPartNoId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getroPartsById(repairOrderId,workOrderPartNoId));
    }));
  }


  // 14
  getROHistory(repairOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/repairOrder/rohistory?repairOrderId=${repairOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getROHistory(repairOrderId));
    }));
  }

  // 15
  deleteRO(repairOrderId, updatedBy) {
    return this.http.delete<any>(`${this.configurations.baseUrl}/api/repairOrder/deleteRo?repairOrderId=${repairOrderId}&updatedBy=${updatedBy}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.deleteRO(repairOrderId, updatedBy));
    }));
  }

  // 16 11
  getApproversListByTaskIdModuleAmt(taskId, moduleAmount) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/approvalrule/approverslist?approvalTaskId=${taskId}&moduleAmount=${moduleAmount}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getApproversListByTaskIdModuleAmt(taskId, moduleAmount));
    }));
  }


 

  // 18
  saveRepairOrderApproval<T>(param: any): Observable<any> {
    let url = `${this.configurations.baseUrl}/api/repairOrder/repairOrderapproval`;
    let body = JSON.stringify(param);
    return this.http.post(url, body, this.getRequestHeaders())
      .pipe(map((response: Response) => {
        return <any>response;

      }),catchError(error => {
        return this.handleError(error, () => this.saveRepairOrderApproval(param));
      }));
  }
  
  // 20
  getVendorROAddressById(repairOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/repairOrder/roaddressdetails?repairOrderId=${repairOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getVendorROAddressById(repairOrderId));
    }));
  }

  // 21
  saveRepairOrderAddress<T>(param: any): Observable<any> {
    let url = `${this.configurations.baseUrl}/api/repairOrder/createroaddress`;
    let body = JSON.stringify(param);
    return this.http.post(url, body, this.getRequestHeaders())
      .pipe(map((response: Response) => {
        return <any>response;
      }),catchError(error => {
        return this.handleError(error, () => this.saveRepairOrderAddress(param));
      }));
  }
  
  getROApproverList(repairOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/repairOrder/roapproverslist?repairOrderId=${repairOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getROApproverList(repairOrderId));
    }));
  }

  getROTotalCostById(repairOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/repairOrder/getrototalcost?repairOrderId=${repairOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getROTotalCostById(repairOrderId));
    }));
  }

////////////////////////////////////////////
 /*
  getVendorROById<T>(Id: number): Observable<T> {
    let endPointUrl = `${this._roByIdUrl}?repairOrderId=${Id}`;

    return this.http.get<T>(endPointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.getVendorROById(Id));
      });
  }

  saveCreateROApproval<T>(param: any): Observable<any> {
    let body = JSON.stringify(param);
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
    return this.http.post(this._saveCreateROApproval, body, this.getRequestHeaders())
      .map((response: Response) => {
        return <any>response;

      }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateROApproval<T>(param: any): Observable<any> {
    let body = JSON.stringify(param);
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
    return this.http.post(this._updateROApproval, body, this.getRequestHeaders())
      .map((response: Response) => {
        return <any>response;

      }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }




  getROStatus(repairOrderId, status, updatedBy) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/repairOrder/rostatus?repairOrderId=${repairOrderId}&status=${status}&updatedBy=${updatedBy}`)
  }
  
  repairOrderGlobalSearch(filterText, pageNumber, pageSize, vendorId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/repairOrder/roglobalsearch?filterText=${filterText}&pageNumber=${pageNumber}&pageSize=${pageSize}&vendorId=${vendorId}`)
  }

 
*/
}