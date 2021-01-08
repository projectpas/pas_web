import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError,map} from'rxjs/operators';
@Injectable()
export class PurchaseOrderEndpoint extends EndpointFactory {

  private readonly _purchaseOrderLiteUrl: string = "/api/PurchaseOrder/basic";
  private readonly _poByIdUrl: string = "/api/purchaseorder/pobyid";
  private readonly _saveCreatePOApproval: string = "/api/purchaseorder/createpoapprover";
  private readonly _updatePOApproval: string = "/api/purchaseorder/updatepoapprover";

  get purchaseOrderBasicListUrl() { return this.configurations.baseUrl + this._purchaseOrderLiteUrl; }

  constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

    super(http, configurations, injector);
  }

  getPurchaseOrderBasicList<T>(): Observable<T> {
    return this.http.get<any>(this._purchaseOrderLiteUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getPurchaseOrderBasicList());
      }));
  }

  getVendorPOHeaderById(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/poheaderdetails?purchaseOrderId=${purchaseOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getVendorPOHeaderById(purchaseOrderId));
    }));
  }

  
  getPurchaseOrderPartsById(purchaseOrderId, workOrderPartNumberId) {
    const woId = workOrderPartNumberId ? workOrderPartNumberId : 0;
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/purchaseorderparts?purchaseOrderId=${purchaseOrderId}&workOrderPartNoId=${woId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getPurchaseOrderPartsById(purchaseOrderId, workOrderPartNumberId));
    }));
  }

  getPurchaseOrderAllPartsById(purchaseOrderId, employeeID, workOrderPartNumberId) {
    const woId = workOrderPartNumberId ? workOrderPartNumberId : 0;
    const eID = employeeID ? employeeID : 0;
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/purchaseorderpartsAll?purchaseOrderId=${purchaseOrderId}&employeeID=${employeeID}&workOrderPartNoId=${woId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getPurchaseOrderAllPartsById(purchaseOrderId, employeeID, workOrderPartNumberId));
    }));
  }
  getPOTotalCostById(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/getpototalcost?purchaseOrderId=${purchaseOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getPOTotalCostById(purchaseOrderId));
    }));
  }

  getAllEditID(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/getAllEditID?poID=${purchaseOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getAllEditID(purchaseOrderId));
    }));
  }


  

  getApproversListByTaskIdModuleAmt(taskId, moduleAmount) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/approvalrule/approverslist?approvalTaskId=${taskId}&moduleAmount=${moduleAmount}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getApproversListByTaskIdModuleAmt(taskId, moduleAmount));
    }));
    
  }  

  approverslistbyTaskId(taskId, id) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/approvalrule/approverslistbyTaskId?approvalTaskId=${taskId}&id=${id}`)
    .pipe(catchError(error => {
      return this.handleErrorCommon(error, () => this.approverslistbyTaskId(taskId, id));
    }));
    
  }  
  

  
 
  getPOApprovalListById(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/getpoapprovallist?purchaseOrderId=${purchaseOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getPOApprovalListById(purchaseOrderId));
    }));
  }

  getPartDetailsWithidForSinglePart<T>(partId): Observable<T> {
		let endpointurl = `${this.configurations.baseUrl}/api/purchaseorder/GetpartdetailsWithidForSinglePart/${partId}`;
		return this.http.get<any>(endpointurl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getPartDetailsWithidForSinglePart<T>(partId));
			}));
	}
  
  getVendorPOAddressById(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/poaddressdetails?purchaseOrderId=${purchaseOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getVendorPOAddressById(purchaseOrderId));
    }));
  } 

  savePurchaseOrderHeader<T>(param: any): Observable<any> {
    let url = `${this.configurations.baseUrl}/api/purchaseorder/createpurchaseorder`;
    let body = JSON.stringify(param);
    return this.http.post(url, body, this.getRequestHeaders())
      .pipe(map((response: Response) => {
        return <any>response;
      }) ,catchError(error => {
        return this.handleError(error, () => this.savePurchaseOrderHeader<T>(param));
      }));
  }

  savePurchaseOrderParts<T>(param: any): Observable<any> {
    let url = `${this.configurations.baseUrl}/api/purchaseorder/createpurchaseorderparts`;
    let body = JSON.stringify(param);
    return this.http.post(url, body, this.getRequestHeaders())
      .pipe(map((response: Response) => {
        return <any>response;

      }),catchError(error => {
        return this.handleError(error, () => this.savePurchaseOrderParts<T>(param));
      }));
  }
  
  savePurchaseOrderAddress<T>(param: any): Observable<any> {
    let url = `${this.configurations.baseUrl}/api/purchaseorder/createpoaddress`;
    let body = JSON.stringify(param);
    return this.http.post(url, body, this.getRequestHeaders())
      .pipe(map((response: Response) => {
        return <any>response;

      }),catchError(error => {
        return this.handleError(error, () => this.savePurchaseOrderAddress<T>(param));
      }));
  }
    
  savePurchaseOrderApproval<T>(param: any): Observable<any> {
    let url = `${this.configurations.baseUrl}/api/purchaseorder/purchaseorderapproval`;
    let body = JSON.stringify(param);
    return this.http.post(url, body, this.getRequestHeaders())
      .pipe(map((response: Response) => {
        return <any>response;
      }),catchError(error => {
        return this.handleError(error, () => this.savePurchaseOrderApproval<T>(param));
      }));
  }

  
  getPOList(data) {
    const url = `${this.configurations.baseUrl}/api/purchaseorder/polist`;
		return this.http.post(url, JSON.stringify(data), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getPOList(data));
			}));
  }

  
  getPOStatus(purchaseOrderId, status, updatedBy) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/postatus?purchaseOrderId=${purchaseOrderId}&status=${status}&updatedBy=${updatedBy}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getPOStatus(purchaseOrderId, status, updatedBy));
    }));
  }

  deletePO(purchaseOrderId, updatedBy) {
    return this.http.delete(`${this.configurations.baseUrl}/api/purchaseorder/deletepo?purchaseOrderId=${purchaseOrderId}&updatedBy=${updatedBy}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.deletePO(purchaseOrderId, updatedBy));
    }));
  }

  
  getPOViewById(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/poview?purchaseOrderId=${purchaseOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getPOViewById(purchaseOrderId) );
    }));    
  }

  getPOPartsViewById(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/popartsview?purchaseOrderId=${purchaseOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getPOPartsViewById(purchaseOrderId));
    })); 
  }  

  getPOHistory(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/pohistory?purchaseOrderId=${purchaseOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getPOHistory(purchaseOrderId));
    })); 
  }



  purchaseOrderGlobalSearch(filterText, pageNumber, pageSize, vendorId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/poglobalsearch?filterText=${filterText}&pageNumber=${pageNumber}&pageSize=${pageSize}&vendorId=${vendorId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.purchaseOrderGlobalSearch(filterText, pageNumber, pageSize, vendorId));
    }));
  }

  getVendorPOById<T>(Id: number): Observable<T> {
    let endPointUrl = `${this._poByIdUrl}?purchaseOrderId=${Id}`;

    return this.http.get<any>(endPointUrl, this.getRequestHeaders())
      .pipe(catchError(error => {
        return this.handleError(error, () => this.getVendorPOById(Id));
      }));
  }

  saveCreatePOApproval<T>(param: any): Observable<any> {
    let body = JSON.stringify(param);
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
    return this.http.post(this._saveCreatePOApproval, body, this.getRequestHeaders())
      .pipe(map((response: Response) => {
        return <any>response;

      }),catchError(error => {
        return this.handleError(error, () => this.saveCreatePOApproval<T>(param));
      }));
  }

  updatePOApproval<T>(param: any): Observable<any> {
    let body = JSON.stringify(param);
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
    return this.http.post(this._updatePOApproval, body, this.getRequestHeaders())
      .pipe(map((response: Response) => {
        return <any>response;

      }),catchError(error => {
        return this.handleError(error, () => this.updatePOApproval<T>(param));
      }));
  }

  getPOApproverList(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/poapproverslist?purchaseOrderId=${purchaseOrderId}`)
    .pipe(catchError(error => {
      return this.handleError(error, () => this.getPOApproverList(purchaseOrderId) );
    }));
    }

    savePurchaseOrderSettingMasterDate<T>(param: any): Observable<any> {
        let body = JSON.stringify(param);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
        return this.http.post('/api/purchaseorder/savepurchaseordersettingmaster', body, this.getRequestHeaders())
            .pipe(map((response: Response) => {
                return <any>response;
            }),catchError(error => {
                return this.handleErrorCommon(error, () => this.savePurchaseOrderSettingMasterDate<T>(param));
            }));
    }

    getPurchaseOrderSettingMasterData() {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/getPOSetting`)
            .pipe(catchError(error => {
                return this.handleErrorCommon(error, () => this.getPurchaseOrderSettingMasterData());
            }));
    }







  
 







  
 

  /* ./vendor PO*/
}