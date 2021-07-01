import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

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
    return this.http.get<T>(this._purchaseOrderLiteUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getPurchaseOrderBasicList());
      });
  }

  getVendorPOHeaderById(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/poheaderdetails?purchaseOrderId=${purchaseOrderId}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.getVendorPOHeaderById(purchaseOrderId));
    });
  }

  
  getPurchaseOrderPartsById(purchaseOrderId, workOrderPartNumberId) {
    const woId = workOrderPartNumberId ? workOrderPartNumberId : 0;
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/purchaseorderparts?purchaseOrderId=${purchaseOrderId}&workOrderPartNoId=${woId}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.getPurchaseOrderPartsById(purchaseOrderId, workOrderPartNumberId));
    });
  }

  getPurchaseOrderAllPartsById(purchaseOrderId, employeeID, workOrderPartNumberId) {
    const woId = workOrderPartNumberId ? workOrderPartNumberId : 0;
    const eID = employeeID ? employeeID : 0;
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/purchaseorderpartsAll?purchaseOrderId=${purchaseOrderId}&employeeID=${employeeID}&workOrderPartNoId=${woId}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.getPurchaseOrderAllPartsById(purchaseOrderId, employeeID, workOrderPartNumberId));
    });
  }
  getPOTotalCostById(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/getpototalcost?purchaseOrderId=${purchaseOrderId}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.getPOTotalCostById(purchaseOrderId));
    });
  }

  getAllEditID(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/getAllEditID?poID=${purchaseOrderId}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.getAllEditID(purchaseOrderId));  
    });
  }


  

  getApproversListByTaskIdModuleAmt(taskId, moduleAmount) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/approvalrule/approverslist?approvalTaskId=${taskId}&moduleAmount=${moduleAmount}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.getApproversListByTaskIdModuleAmt(taskId, moduleAmount));
    });
    
  }  

  approverslistbyTaskId(taskId, id) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/approvalrule/approverslistbyTaskId?approvalTaskId=${taskId}&id=${id}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.approverslistbyTaskId(taskId, id));
    });
    
  }  
  

  
 
  getPOApprovalListById(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/getpoapprovallist?purchaseOrderId=${purchaseOrderId}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.getPOApprovalListById(purchaseOrderId));
    });
  }

  getPartDetailsWithidForSinglePart<T>(partId): Observable<T> {
		let endpointurl = `${this.configurations.baseUrl}/api/purchaseorder/GetpartdetailsWithidForSinglePart/${partId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getPartDetailsWithidForSinglePart<T>(partId));
			});
	}
  
  getVendorPOAddressById(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/poaddressdetails?purchaseOrderId=${purchaseOrderId}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.getVendorPOAddressById(purchaseOrderId));
    });
  } 

  savePurchaseOrderHeader<T>(param: any): Observable<any> {
    let url = `${this.configurations.baseUrl}/api/purchaseorder/createpurchaseorder`;
    let body = JSON.stringify(param);
    return this.http.post(url, body, this.getRequestHeaders())
      .map((response: Response) => {
        return <any>response;
      }) .catch(error => {
        return this.handleErrorCommon(error, () => this.savePurchaseOrderHeader<T>(param));
      });
  }

  savePurchaseOrderParts<T>(param: any): Observable<any> {
    let url = `${this.configurations.baseUrl}/api/purchaseorder/createpurchaseorderparts`;
    let body = JSON.stringify(param);
    return this.http.post(url, body, this.getRequestHeaders())
      .map((response: Response) => {
        return <any>response;

      }).catch(error => {
        return this.handleErrorCommon(error, () => this.savePurchaseOrderParts<T>(param));
      });
  }
  
  savePurchaseOrderAddress<T>(param: any): Observable<any> {
    let url = `${this.configurations.baseUrl}/api/purchaseorder/createpoaddress`;
    let body = JSON.stringify(param);
    return this.http.post(url, body, this.getRequestHeaders())
      .map((response: Response) => {
        return <any>response;

      }).catch(error => {
        return this.handleErrorCommon(error, () => this.savePurchaseOrderAddress<T>(param));
      });
  }
    
  savePurchaseOrderApproval<T>(param: any): Observable<any> {
    let url = `${this.configurations.baseUrl}/api/purchaseorder/purchaseorderapproval`;
    let body = JSON.stringify(param);
    return this.http.post(url, body, this.getRequestHeaders())
      .map((response: Response) => {
        return <any>response;
      }).catch(error => {
        return this.handleErrorCommon(error, () => this.savePurchaseOrderApproval<T>(param));
      });
  }

  
  getPOList(data) {
    const url = `${this.configurations.baseUrl}/api/purchaseorder/polist`;
		return this.http.post(url, JSON.stringify(data), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getPOList(data));
			});
  }

  
  getPOStatus(purchaseOrderId, status, updatedBy) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/postatus?purchaseOrderId=${purchaseOrderId}&status=${status}&updatedBy=${updatedBy}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.getPOStatus(purchaseOrderId, status, updatedBy));
    });
  }

  deletePO(purchaseOrderId, updatedBy) {
    return this.http.delete(`${this.configurations.baseUrl}/api/purchaseorder/deletepo?purchaseOrderId=${purchaseOrderId}&updatedBy=${updatedBy}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.deletePO(purchaseOrderId, updatedBy));
    });
  }

  
  getPOViewById(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/poview?purchaseOrderId=${purchaseOrderId}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.getPOViewById(purchaseOrderId) );
    });    
  }

  getPOPartsViewById(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/popartsview?purchaseOrderId=${purchaseOrderId}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.getPOPartsViewById(purchaseOrderId));
    }); 
  }  

  getPOHistory(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/pohistory?purchaseOrderId=${purchaseOrderId}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.getPOHistory(purchaseOrderId));
    }); 
  }

  purchaseOrderGlobalSearch(filterText, pageNumber, pageSize, vendorId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/poglobalsearch?filterText=${filterText}&pageNumber=${pageNumber}&pageSize=${pageSize}&vendorId=${vendorId}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.purchaseOrderGlobalSearch(filterText, pageNumber, pageSize, vendorId));
    });
  }

  getVendorPOById<T>(Id: number): Observable<T> {
    let endPointUrl = `${this._poByIdUrl}?purchaseOrderId=${Id}`;

    return this.http.get<T>(endPointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleErrorCommon(error, () => this.getVendorPOById(Id));
      });
  }

  saveCreatePOApproval<T>(param: any): Observable<any> {
    let body = JSON.stringify(param);
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
    return this.http.post(this._saveCreatePOApproval, body, this.getRequestHeaders())
      .map((response: Response) => {
        return <any>response;

      }).catch(error => {
        return this.handleErrorCommon(error, () => this.saveCreatePOApproval<T>(param));
      });
  }

  updatePOApproval<T>(param: any): Observable<any> {
    let body = JSON.stringify(param);
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
    return this.http.post(this._updatePOApproval, body, this.getRequestHeaders())
      .map((response: Response) => {
        return <any>response;

      }).catch(error => {
        return this.handleErrorCommon(error, () => this.updatePOApproval<T>(param));
      });
  }

  getPOApproverList(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/poapproverslist?purchaseOrderId=${purchaseOrderId}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.getPOApproverList(purchaseOrderId) );
    });
  }

  savePurchaseOrderSettingMasterDate<T>(param: any): Observable<any> {
        let body = JSON.stringify(param);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })        
        return this.http.post(this.configurations.baseUrl + '/api/purchaseorder/savepurchaseordersettingmaster', body, this.getRequestHeaders())
            .map((response: Response) => {
                return <any>response;
            }).catch(error => {
                return this.handleErrorCommon(error, () => this.savePurchaseOrderSettingMasterDate<T>(param));
            });
  }

  getPurchaseOrderSettingMasterData(currentUserMasterCompanyId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/getPOSetting?masterCompanyId=${currentUserMasterCompanyId}`)
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getPurchaseOrderSettingMasterData(currentUserMasterCompanyId));
            });
  }

  getPrintPurchaseOrderData(purchaseOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/purchaseorder/getPrintPurchaseOrderData?purchaseOrderId=${purchaseOrderId}`)
    .catch(error => {
      return this.handleErrorCommon(error, () => this.getPrintPurchaseOrderData(purchaseOrderId) );
    });    
  }







  
 







  
 

  /* ./vendor PO*/
}