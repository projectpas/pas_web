
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class ReceivingCustomerWorkEndpoint extends EndpointFactory {


	private readonly _actionsUrl: string = "/api/ReceivingCustomerWork/Get";
	private readonly _actionsUrlNew: string = "/api/ReceivingCustomerWork/receivingCustomerWork";
	private readonly _actionsUpdateUrlNew: string = "/api/ReceivingCustomerWork/UpdatereceivingCustomerWork";
	private readonly _actionDeleteUrlNew: string = "/api/ReceivingCustomerWork/deletereceivingCustomerWork";
    private readonly _actionsUrlAuditHistory: string = "/api/ReceivingCustomerWork/auditHistoryById";
    private readonly _actionsTimeUrlNew: string = "/api/ReceivingCustomerWork/PostTimeLine";
    private readonly _TimeLifeUpdate: string = "/api/ReceivingCustomerWork/timeLifeUpdate";
    private readonly _updateActiveInactive: string = "/api/ReceivingCustomerWork/updateForActive";
    private readonly _actionsUrlAudit: string = "/api/ReceivingCustomerWork/GetAudit";
    private readonly _customerList: string = '/api/ReceivingCustomerWork/List';
    private readonly _customerWorkRowBySearchId: string = '/api/ReceivingCustomerWork/receivingCustomerWorkById';
    private readonly _customerGlobalSearch: string = '/api/ReceivingCustomerWork/ListGlobalSearch'
    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }
    get customerWorkRowById() { return this.configurations.baseUrl + this._customerWorkRowBySearchId; }

	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

		super(http, configurations, injector);
	}

	getReasonEndpoint<T>(): Observable<T> {

		return this.http.get<any>(this.actionsUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getReasonEndpoint());
			}));
    }

    getCustomerWorkListByid<T>(receivingCustomerWorkId: any): Observable<T> {
        let endpointurl = `${this.customerWorkRowById}/${receivingCustomerWorkId}`;
        return this.http.get<any>(endpointurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerWorkListByid(receivingCustomerWorkId));
            }));
    }

    
    getCustomerWorkAll(data) {
        return this.http.post(this._customerList, JSON.stringify(data), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerWorkAll(data));
            }));
    }
	getNewReasonEndpoint<T>(userObject: any): Observable<T> {

		return this.http.post<any>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getNewReasonEndpoint(userObject));
			}));
    }
    
    updateCustomerWorkReceivingEndpoint<T>(userObject: any): Observable<T> {

		return this.http.put<any>(this._actionsUpdateUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.updateCustomerWorkReceivingEndpoint(userObject));
		}));
	}

	getHistoryReasonEndpoint<T>(receivingCustomerWorkId: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlAuditHistory}/${receivingCustomerWorkId}`;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getHistoryReasonEndpoint(receivingCustomerWorkId));
			}));
	}

	getEditReasonEndpoint<T>(receivingCustomerWorkId?: number): Observable<T> {
		let endpointUrl = receivingCustomerWorkId ? `${this._actionsUrl}/${receivingCustomerWorkId}` : this._actionsUrl;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getEditReasonEndpoint(receivingCustomerWorkId));
			}));
	}

	getUpdateReasonEndpoint<T>(roleObject: any, receivingCustomerWorkId: number): Observable<T> {
		//let endpointUrl = `${this._actionsUpdateUrlNew}/${receivingCustomerWorkId}`;
        let json = {
            "receivingCustomerWorkId": roleObject.receivingCustomerWorkId,
            "customerId": roleObject.customerId,
            "receivingCustomerNumber": roleObject.receivingCustomerNumber,
            "customerReference": roleObject.customerReference,
            "isSerialized": roleObject.isSerialized,
            "itemMasterId": roleObject.itemMasterId,
            "customerClassificationId": roleObject.customerClassificationId,
            "scopeId": roleObject.scopeId,
            "priorityId": roleObject.priorityId,
            "statusId": roleObject.statusId,
            "contactId": roleObject.contactId,
            "changePartNumber": roleObject.changePartNumber,
            "partCertificationNumber": roleObject.partCertificationNumber,
            "quantity": roleObject.quantity,
            "conditionId": roleObject.conditionId,
            "siteId": roleObject.siteId,
            "binId": roleObject.binId,
            "shelfId": roleObject.shelfId,
            "warehouseId": roleObject.warehouseId,
            "workOrderId": roleObject.workOrderId,
            "locationId": roleObject.locationId,
            "owner": roleObject.owner,
            "ownerType": roleObject.ownerType,
            "isMFGDate": roleObject.isMFGDate,
            "isCustomerStock": roleObject.isCustomerStock,
            "traceableToCustomerId": roleObject.traceableToCustomerId,
            "traceableToVendorId": roleObject.traceableToVendorId,
            "traceableToOther": roleObject.traceableToOther,
            "manufacturingDate": roleObject.manufacturingDate,
            "managementStructureId": roleObject.managementStructureId,
            "expirationDate": roleObject.expirationDate,
            "timeLifeDate": roleObject.timeLifeDate,
            "timeLifeOrigin": roleObject.timeLifeOrigin,
            "timeLifeCyclesId": roleObject.timeLifeCyclesId,
            "manufacturingTrace": roleObject.manufacturingTrace,
            "manufacturingLotNumber": roleObject.manufacturingLotNumber,
            "reasonForRemoval": roleObject.reasonForRemoval,
            "employeeId": roleObject.employeeId,
            "serialNumber": roleObject.serialNumber,
            "certifiedBy": roleObject.certifiedBy,
            "tagDate": roleObject.tagDate,
            "tagType": roleObject.tagType,
            "traceableTo": roleObject.traceableTo,
            "obtainFrom": roleObject.obtainFrom,
            "obtainFromType": roleObject.obtainFromType,
            "isTimeLife": roleObject.isTimeLife,
            "timeLifeId": roleObject.timeLifeId,
            "manufacturer": roleObject.manufacturer,
            "manufacturerLotNumber": roleObject.manufacturerLotNumber,
            "companyId": roleObject.companyId,
            "businessUnitId": roleObject.businessUnitId,
            "divisionId": roleObject.divisionId,
            "departmentId": roleObject.departmentId,
            "obtainFromVendorId": roleObject.obtainFromVendorId,
            "obtainFromCustomerId": roleObject.obtainFromCustomerId,
            "obtainFromOther": roleObject.obtainFromOther,
            "masterCompanyId": roleObject.masterCompanyId ,
            "isActive": roleObject.isActive,
            "isDelete": roleObject.isDelete,
            "isExpirationDate": roleObject.isExpirationDate,
            "partNumber": roleObject.partNumber,
            "partDescription": roleObject.partDescription,
            "createdBy": roleObject.createdBy,
            "updatedBy": roleObject.updatedBy,
            "updatedDate": roleObject.updatedDate ,
            "createdDate": roleObject.createdDate,
            "name": roleObject.name,
            "traceableToType": roleObject.traceableToType,
            "workPhone": roleObject.workPhone
        }

        return this.http.put<any>(this._actionsUpdateUrlNew, JSON.stringify(json), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getUpdateReasonEndpoint(roleObject, receivingCustomerWorkId));
			}));
	}

	//getDeleteReasonEndpoint<T>(receivingCustomerWorkId: number): Observable<T> {
	//	let endpointUrl = `${this._actionDeleteUrlNew}/${receivingCustomerWorkId}`;

	//	return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
	//		.catch(error => {
	//			return this.handleError(error, () => this.getDeleteReasonEndpoint(receivingCustomerWorkId));
	//		});
 //   }
    getDeleteReasonEndpoint<T>(id, updatedBy) {
        return this.http.get<any>(`${this._actionDeleteUrlNew}?id=${id}&updatedBy=${updatedBy}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteReasonEndpoint(id, updatedBy));
            }));
    }
    getNewTimeAdjustmentEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._actionsTimeUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewTimeAdjustmentEndpoint(userObject));
            }));
    }
    getUpdatestockLineTimeLifeEndpoint<T>(roleObject: any, timeLifeCyclesId: number): Observable<T> {
        return this.http.put<any>(this._TimeLifeUpdate, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdatestockLineTimeLifeEndpoint(roleObject, timeLifeCyclesId));
            }));
    }
    //getUpdateActionforActive<T>(roleObject: any, receivingCustomerWorkId: number): Observable<T> {
    //    let endpointUrl = `${this._updateActiveInactive}/${roleObject.receivingCustomerWorkId}`;

    //    return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
    //        .catch(error => {
    //            return this.handleError(error, () => this.getUpdateForActive(roleObject, receivingCustomerWorkId));
    //        });
    //}
    getUpdateForActive<T>(roleObject: any, receivingCustomerWorkId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${roleObject.receivingCustomerWorkId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateForActive(roleObject, receivingCustomerWorkId));
            }));
    }
    getAuditHistory(receivingCustomerWorkId) {
        return this.http.get(`${this.configurations.baseUrl}/${this._actionsUrlAudit}?receivingCustomerWorkId=${receivingCustomerWorkId}`)
    }
    getUpdateActionforActive(receivingCustomerWorkId:number,status:string,updatedBy:string) {
        return this.http.get(`${this.configurations.baseUrl}/${this._updateActiveInactive}?id=${receivingCustomerWorkId}&status=${status}&updatedBy=${updatedBy}`)
    }
    getGlobalCustomerRecords<T>(value, pageIndex, pageSize): Observable<T> {
        // let endpointUrl = this.globalSearch;
        return this.http.get<any>(`${this.configurations.baseUrl}${this._customerGlobalSearch}?value=${value}&pageNumber=${pageIndex}&pageSize=${pageSize}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getGlobalCustomerRecords(value, pageIndex, pageSize));
            }));
    }
}


