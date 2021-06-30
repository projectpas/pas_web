
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { environment } from 'src/environments/environment';
@Injectable()
export class LegalEntityEndpontService extends EndpointFactory { 

	baseUrl = environment.baseUrl;
	private readonly _entityurl: string =this.baseUrl + "/api/legalEntity/Get";
	 
    private readonly _managementUrl: string =this.baseUrl + "/api/ManagementStrcture/ManagementGet";
	private readonly _managementLegalUrl: string =this.baseUrl + "/api/ManagementStrcture/ManagementGetView"; 
	private readonly _parentEntityUrl: string =this.baseUrl + "/api/legalEntity/ParentEntities"; 
	private readonly _ledgerUrl: string =this.baseUrl + "/api/ManagementStrcture/LedgerNames";
	private readonly _entityediturl: string =this.baseUrl + "/api/legalEntity/GetforEdit";
	private readonly _entityUrlNew: string =this.baseUrl + "/api/legalEntity/legalEntitypost";
	private readonly _customerContactHistory1: string =this.baseUrl + '/api/legalEntity/Legalcontactauditdetails'

	//create
	private readonly _entityUrlNewlockbox: string =this.baseUrl + "/api/legalEntity/LegalEntityBankingLockBoxPost"; 
	private readonly _entityUrlNewdomestic: string =this.baseUrl + "/api/legalEntity/legalEntityDomesticPayment";
	private readonly _entityUrlNewinternationalwire: string =this.baseUrl + "/api/legalEntity/LegalEntityInternationalPaymentCreate";
	private readonly _entityUrlNewACH: string = this.baseUrl +"/api/legalEntity/LegalEntityBankingACHPost";

	//update
	private readonly _updatelegallockbox: string = this.baseUrl +"/api/legalEntity/UpdateLegalEntityBankingLockBox"; 
	private readonly _updatelegalDomesticwire: string =this.baseUrl + "/api/legalEntity/domesticPaymentUpdate";
	private readonly _updatelegalInternalwire: string = this.baseUrl +"/api/legalEntity/LegalEntityInternationalPaymentUPdate";
	private readonly _updatelegalACH: string =this.baseUrl + "/api/legalEntity/LegalEntityBankingACHUpdate";
	private readonly _updatelegalContact:string =this.baseUrl + "/api/legalentity/LegalEntityContactPost";
	private readonly _updatelegalContactStatus:string =this.baseUrl + "/api/LegalEntity/UpdateConatctActive";
	

	//restore apis

	private readonly restoreBillingURl: string =this.baseUrl + "/api/legalentity/RestoreLegalbillingaddress"; 
	private readonly restoreDomesticHipURl: string = this.baseUrl +"/api/legalentity/RestoreLegalDomShippingaddress";
	private readonly restoreLegalDocsURl: string = this.baseUrl +"/api/legalEntity/RestoreDocuments";
	private readonly restoreLegalContactsURl: string =this.baseUrl + "/api/legalEntity/RestoreLegalcontacts";
	
	//get list by legal entity id
	private readonly _customerHistory: string =this.baseUrl + "/api/legalEntity/GetLegalEntityAuditHistoryByid"; 
	//private readonly _entityUrlNewdomesticList: string = "/api/legalEntity/getEntityDomesticWireById"; 
	//private readonly _entityUrlNewinternationalwireList: string = "/api/legalEntity/getEntityInternationalWireById"; 
	//private readonly _entityUrlNewACHList: string = "/api/legalEntity/getEntityACHById"; 

	private readonly _legalEntityHistory: string =this.baseUrl + "/api/legalEntity/legalEntityHistoryById"; 
	private readonly _legalEntityHistoryContact: string =this.baseUrl + "/api/legalEntity/Legalcontactauditdetails"; 
	private readonly _managementposturl: string =this.baseUrl + "/api/ManagementStrcture/managementEntitypost";
	private readonly _managementrestoreturl: string =this.baseUrl + "/api/ManagementStrcture/managementrestore";
	private readonly _deleteLegalEntity: string =this.baseUrl + "/api/legalEntity/deleteLegalEntity";
	private readonly _deleteLegalEntityContact: string =this.baseUrl + "/api/LegalEntity/LegalentityContact";

    private readonly _JobTilesUrlAuditHistory: string =this.baseUrl + "/api/legalEntity/auditHistoryById";
    private readonly getEntitySetupAccounts: string =this.baseUrl + "/api/legalEntity/legalEntityAccountsById";

	private readonly _activeUrl: string =this.baseUrl + "/api/legalEntity/UpdateActive";
	private readonly getLegalEntityAddressByIdURL: string = this.baseUrl +"/api/legalEntity/legalentityaddressbyid";
	private readonly _contactUrl: string =this.baseUrl + "/api/legalentity/ContactList";
	private readonly _billingLIstUrl: string =this.baseUrl + "/api/LegalEntity/BillinginfoList";
	private readonly _domesticShipUrl: string = this.baseUrl +"/api/LegalEntity/DomesticShippingList";
	
	private readonly _countryUrl: string = this.baseUrl +"/api/legalEntity/GetcountryList";
	private readonly _entityUpdateUrl: string =this.baseUrl + "/api/LegalEntity/UpdateLegalEntityDetails";
	private readonly _generalEmptyObjurl: string =this.baseUrl + "/api/LegalEntity/generalEmptyObj";
	private readonly _billingInfoUrl: string =this.baseUrl + "/api/LegalEntity/LegalEntityBillingPost";
	private readonly _updateBillingViaDetails: string =this.baseUrl + "/api/legalEntity/LegalEntityBillAddressdetails";
	private readonly _legalEntityBillingHistory: string =this.baseUrl + "/api/LegalEntity/getLegalEntityBillingHistory"
	private readonly _legalEntityBillingUpdateforActive: string = this.baseUrl +'/api/LegalEntity/legalentitybillingaddressstatus'
	private readonly _deleteBillingEntityDettilas: string =this.baseUrl + "/api/LegalEntity/deletelegalentitybillingaddress";
	private readonly excelUpload: string =this.baseUrl + "/api/LegalEntity/uploadLegalEntitybillingaddress"
	private readonly ContactexcelUpload: string =this.baseUrl + "/api/LegalEntity/uploadlegalEntitycontacts"
	private readonly _getlegalEntityDocumentAttachmentslist: string = this.baseUrl +"/api/FileUpload/getattachmentdetails";
	private readonly _addDocumentDetails: string =this.baseUrl + '/api/LegalEntity/LegalEntityFinanceDocumentUpload';
	private readonly _deleteLegalEntityDocuments: string =this.baseUrl + '/api/LegalEntity/deleteLegalEntityDocuments';
	private readonly _getlegalEntityDocumentHistory: string = this.baseUrl +"/api/LegalEntity/getLegalEntityDocumentsAudit"

	private readonly _updateShippingViaDetails: string = this.baseUrl +"/api/legalEntity/updateShipViaDetails";
	private readonly _legalEntityShipAddressdetails: string = this.baseUrl +"/api/legalEntity/legalEntityShippingAddressDetails";
	private readonly _legalEntityShippingUrlNew: string = this.baseUrl +"/api/legalEntity/updateStatuslegalEntityShipping";
	private readonly _getShipViaByShippingId: string = this.baseUrl +"/api/legalEntity/DomesticShipviaList";
	private readonly _getShipViaHistory: string =this.baseUrl + "/api/legalEntity/getShipViaHistory";
	private readonly _shippingInfoUrl: string =this.baseUrl + "/api/legalEntity/LegalEntityShippingPost";
	private readonly _saveShipViaDetails: string = this.baseUrl +"/api/legalEntity/addShipViaDetails";
	private readonly _updatshippingAddressDetails: string = this.baseUrl +"/api/legalEntity/updateShipAddress";
	private readonly _updateStatuslegalEntityShipping: string = this.baseUrl +"/api/legalEntity/updateStatusLegalEntityShipping";
	private readonly _legalEntityShipViaDetails: string = this.baseUrl +"/api/legalEntity/getlegalEntityShipViaDetails";
	private readonly _cusShippingGeturl = this.baseUrl +"/api/legalEntity/legalentityshippingaddresslist";
	private readonly _cusShippingGeturlwithId = this.baseUrl +"/api/Vendor/cusshippingGetwithid";
	private readonly _internationalshippingpost: string = this.baseUrl +'/api/legalEntity/createinternationalshipping'
	private readonly _internationalshippingget: string = this.baseUrl +'/api/legalEntity/InternationalShippingList'
	private readonly _internationalshpViaList: string =this.baseUrl + '/api/legalEntity/InternationalShipviaList'
	
	private readonly _internationalstatus: string =this.baseUrl + '/api/legalEntity/internationalshippingdetailsstatus'
	private readonly _internationalShippingDelete: string =this.baseUrl + '/api/legalEntity/deleteinternationalshipping';
	private readonly _internationalshippingdetailsbyid: string = this.baseUrl +'/api/legalEntity/internationalshippingdetailsbyid';
	private readonly _updateinternationalshipping: string =this.baseUrl + '/api/legalEntity/updateinternationalshipping';
	private readonly _createinternationalshippingviadetails: string = this.baseUrl +'/api/legalEntity/createintershippingviadetails';
	private readonly _internationalShipViaList: string =this.baseUrl + '/api/legalEntity/getshippingviadetails';
	private readonly _updateshippingviadetails: string =this.baseUrl + '/api/legalEntity/updateintershippingviadetails';
	private readonly excelUploadShipping: string =this.baseUrl + "/api/legalEntity/uploadlegalEntityshippingaddress"
	private readonly excelUploadInterShipping: string =this.baseUrl + "/api/legalEntity/uploadlegalEntityinternationalshipping"
	private readonly _legalEntityShippingHistory: string =this.baseUrl + "/api/legalEntity/getLegalEntityShippingHistory"
	private readonly _legalEntityInterShippingHistory: string =this.baseUrl + "/api/legalEntity/GetlegalEntityInternationalShippingAuditHistoryByid";
	private readonly _legalEntityShipViaHistory: string =this.baseUrl + "/api/legalEntity/GetShipViaAudit"
	private readonly _legalEntityInterShipViaHistory: string =this.baseUrl + "/api/legalEntity/getauditshippingviadetailsbyid"
	private readonly _deleteInternationalShippingViaMapUrl: string =this.baseUrl + '/api/legalEntity/deleteintershippingviadetails';
	private readonly _deleteShipVia: string = this.baseUrl +'/api/legalEntity/deleteshipviadetails';
	private readonly _internationalShipViaByShippingIdList: string = this.baseUrl +'/api/legalEntity/getinternationalshippingviadetails';
	private readonly _addShipViaDetails: string = this.baseUrl +'/api/legalEntity/addShipViaDetails';
	private readonly _shippingDetailsStatus: string = this.baseUrl +'/api/legalEntity/shippingdetailsstatus';
	private readonly _shippingdetailsviastatus: string = this.baseUrl +'/api/legalEntity/shippingdetailsviastatus';
	private readonly _uploadlegalEntityLogo: string = this.baseUrl +'/api/legalentity/LegalEntityLogoUplodad'; 
	private readonly _getContactById: string = this.baseUrl +'/api/legalEntity/ContactGet'; 
	private readonly searchUrl: string = this.baseUrl +'/api/legalentity/List';
	private readonly EntityGlobalSearch: string =this.baseUrl + '/api/legalentity/ListGlobalSearch';
	private readonly LogogDell: string =this.baseUrl + '/api/legalentity/LogoDelete';
	// legal banking History URls
	private readonly lockBoxURl: string =this.baseUrl + '/api/legalEntity/GetEntityLockBoxAudit';
	private readonly DomsticWireUrl: string =this.baseUrl + '/api/legalEntity/GetEntityDomesticWireAudit';
	private readonly InternationalWireURL: string =this.baseUrl + '/api/legalEntity/GetEntityInternationalWireAudit';
	private readonly ACHUrl: string =this.baseUrl + '/api/legalEntity/GetEntityACHAudit';
	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

		super(http, configurations, injector);
	}

	updateShippingViainfo<T>(roleObject: any, legalEntityId: any): Observable<T> {
		let endpointUrl = `${this._updateShippingViaDetails}/${legalEntityId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateShippingViainfo(roleObject, legalEntityId));
			});
	}
	updateShippinginfo<T>(roleObject: any, legalEntityId: any): Observable<T> {
		let endpointUrl = `${this._updatshippingAddressDetails}/${roleObject.legalEntityShippingAddressId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateShippinginfo(roleObject, legalEntityId));
			});
	}

	updateStatusShippinginfo<T>(roleObject: any, legalEntityId: any): Observable<T> {
		var id=roleObject.legalEntityShippingAddressId;
		let endpointUrl = `${this._updateStatuslegalEntityShipping}/${id}`;
		var modelData={
            updatedBy:roleObject.updatedBy
        };
		return this.http.put<T>(endpointUrl, JSON.stringify(modelData), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateStatusShippinginfo(roleObject, legalEntityId));
			});
	}
	getCusHippingaddresdetails<T>(legalEntityId: any): Observable<T> {
		let endpointurl = `${this._cusShippingGeturl}?legalEntityId=${legalEntityId}`;
		//let endpointUrl = `${this.entityBillViaDetails}?billingAddressId=${id}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getCusHippingaddresdetails(legalEntityId));
			});
	}
	getCusHippingaddresdetailswithid<T>(legalEntityId: any): Observable<T> {
		let endpointurl = `${this._cusShippingGeturlwithId}/${legalEntityId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getlegalEntityEndpoint());
			});
	}

	getlegalEntityEndpoint<T>(): Observable<T> {

		return this.http.get<T>(this._entityUrlNew, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getlegalEntityEndpoint());
			});
	}
	
	legalEntityContactFileUpload(file, legalEntityId) {
		return this.http.post(`${this.ContactexcelUpload}?legalEntityId=${legalEntityId}`, file).catch(error => {
			return this.handleErrorCommon(error, () => this.legalEntityContactFileUpload(file, legalEntityId));
		})
	
	}
	legalEntityShippingFileUpload(file, legalEntityId) {
		return this.http.post(`${this.excelUploadShipping}?legalEntityId=${legalEntityId}`, file).catch(error => {
			return this.handleErrorCommon(error, () => this.legalEntityShippingFileUpload(file, legalEntityId));
		})
	}
	legalEntityInternationalShippingFileUpload(file, legalEntityId) {
		return this.http.post(`${this.excelUploadInterShipping}?legalEntityId=${legalEntityId}`, file).catch(error => {
			return this.handleErrorCommon(error, () => this.legalEntityInternationalShippingFileUpload(file, legalEntityId));
		})
	}
	getlegalEntityShippingHistory( legalEntityId,legalEntityShippingAddressId) {
		return this.http.get(`${this._legalEntityShippingHistory}/${legalEntityId}?entityShippingAddressId=${legalEntityShippingAddressId}`, this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getlegalEntityShippingHistory( legalEntityId,legalEntityShippingAddressId));
		})
	}
	getlegalEntityInterShippingHistory(legalEntityId, legalEntityInterShippingId) {
		return this.http.get(`${this._legalEntityInterShippingHistory}?LegalEntityId=${legalEntityId}&internationalShippingId=${legalEntityInterShippingId}`, this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getlegalEntityInterShippingHistory(legalEntityId, legalEntityInterShippingId));
		})
	}

	getlegalEntityShipViaHistory(legalEntityId, legalEntityShippingAddressId, legalEntityShippingId) {
		return this.http.get(`${this._legalEntityShipViaHistory}?legalEntityId=${legalEntityId}&legalEntityShippingAddressId=${legalEntityShippingAddressId}&legalEntityShippingId=${legalEntityShippingId}`, this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getlegalEntityShipViaHistory(legalEntityId, legalEntityShippingAddressId, legalEntityShippingId));
		})
	}
	getlegalEntityInterShipViaHistory(legalEntityId, internationalShippingId, shippingViaDetailsId) {
		return this.http.get(`${this._legalEntityInterShipViaHistory}?legalEntityId=${legalEntityId}&internationalShippingId=${internationalShippingId}&shippingViaDetailsId=${shippingViaDetailsId}`, this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getlegalEntityInterShipViaHistory(legalEntityId, internationalShippingId, shippingViaDetailsId));
		})
	}

	getNewShipppinginfo<T>(param: any): Observable<T> {

		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http
			.post(this._shippingInfoUrl, body, this.getRequestHeaders())
			.map((res: Response) => res).catch(error => {
				return this.handleErrorCommon(error, () => this.getNewShipppinginfo(param));
			});
			// .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}




	getInternationalShipViaByInternationalShippingId<T>(id) {
		return this.http.get<T>(`${this._internationalShipViaByShippingIdList}?legalEntityInternationalShippingId=${id}`, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getInternationalShipViaByInternationalShippingId(id));
			});
	}

	postDomesticShipVia<T>(postData) {
		return this.http.post<T>(this._addShipViaDetails, JSON.stringify(postData), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.postDomesticShipVia(postData));
			});
	}

	updateShipViaInternational<T>(postData) {
		return this.http.post<T>(this._updateshippingviadetails, JSON.stringify(postData), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateShipViaInternational(postData));
			});
	}

	// updateShipViaInternational<T>(roleObject: any): Observable<T> {
	// 	let endpointUrl = `${this.UpdateShipViaInternational}`;
	// 	return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
	// 		.catch(error => {
	// 			return this.handleErrorCommon(error, () => this.updateShipViaInternational(roleObject));
	// 		});
	// }


	getShipViaByInternationalShippingId<T>(id, pageIndex, pageSize) {
		return this.http.get<T>(`${this._internationalShipViaList}?internationalShippingId=${id}&pageNumber=${pageIndex}&pageSize=${pageSize}`, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getShipViaByInternationalShippingId(id, pageIndex, pageSize));
			});
	}
	postInternationalShipVia<T>(postData) {

		return this.http.post<T>(this._createinternationalshippingviadetails, JSON.stringify(postData), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.postInternationalShipVia(postData));
			});
	}

	updateInternationalShipping<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._updateinternationalshipping}`;
		return this.http.post<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateInternationalShipping(roleObject));
			});
	}

	getInternationalShippingById<T>(id) {
		return this.http.get<T>(`${this._internationalshippingdetailsbyid}?id=${id}`, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getInternationalShippingById(id));
			});
	}

	deleteInternationalShipping<T>(id, updatedBy) {
			let endpointUrl = `${this._internationalShippingDelete}?${id}`;
			var modelData={
				updatedBy:updatedBy
			};
			return this.http.put<T>(endpointUrl,JSON.stringify(modelData), this.getRequestHeaders())
				.catch(error => {
					return this.handleErrorCommon(error, () => this.deleteInternationalShipping(id, updatedBy));
				});
	}
	updateStatusForShippingDetails<T>(id, status, updatedBy) {
		let endpointUrl = `${this._shippingDetailsStatus}?id=${id}&status=${status}&updatedBy=${updatedBy}`;
		return this.http.put<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateStatusForShippingDetails(id, status, updatedBy));
			});

	}
	updateStatusForInternationalShipping<T>(id, status, updatedBy) {

		let endpointUrl = `${this._internationalstatus}?id=${id}&status=${status}&updatedBy=${updatedBy}`;
		return this.http.put<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateStatusForInternationalShipping(id, status, updatedBy));
			});

	}
	// updateStatusForInternationalShippingVia(id, status, updatedBy) {
	// 	return this.http.get(``)

	// }

	updateStatusForInternationalShippingVia(id, status, updatedBy) {

		let endpointUrl = `${this.baseUrl}/api/legalEntity/intershippingviadetailsstatus?id=${id}&status=${status}&updatedBy=${updatedBy}`;
		return this.http.put(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.	updateStatusForInternationalShippingVia(id, status, updatedBy));
			});

	}

	deleteInternationalShipViaId<T>(id, updatedBy) {

		let endpointUrl = `${this._deleteInternationalShippingViaMapUrl}/${id}`;
		var modelData={
            updatedBy:updatedBy
        };
		return this.http.put<T>(endpointUrl,JSON.stringify(modelData), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () =>this.deleteInternationalShipViaId(id, updatedBy));
			});


		// return this.http.get<T>(``)
		// 	.catch(error => {
		// 		return this.handleErrorCommon(error, () => this.deleteInternationalShipViaId(id, updatedBy));
		// 	});
	}

	deleteShipViaDetails<T>(id, updatedBy) {
	
			let endpointUrl = `${this._deleteShipVia}?${id}`;
			var modelData={
				updatedBy:updatedBy
			};
			return this.http.put<T>(endpointUrl,JSON.stringify(modelData),this.getRequestHeaders())
				.catch(error => {
					return this.handleErrorCommon(error, () => this.deleteShipViaDetails(id, updatedBy));
				});
	}

	postInternationalShippingPost<T>(postData) {
		return this.http.post<T>(this._internationalshippingpost, JSON.stringify(postData), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.postInternationalShippingPost(postData));
			});
	}


	GetUploadDocumentsList(attachmentId, legalEntityId, moduleId) {
		return this.http.get<any>(`${this._getlegalEntityDocumentAttachmentslist}?attachmentId=${attachmentId}&referenceId=${legalEntityId}&moduleId=${moduleId}`, this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.GetUploadDocumentsList(attachmentId, legalEntityId, moduleId));
		});
	}


	getCustomerContactAuditDetails1<T>(customerContactId, customerId) {


		return this.http.get<T>(`${this._customerContactHistory1}?customerContactId=${customerContactId}&customerId=${customerId}`, this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getCustomerContactAuditDetails1<T>(customerContactId, customerId));
		});
	}

	getDocumentList(legalEntityId,deletedStatus) {
		return this.http.get(`${this.baseUrl}/api/legalEntity/getlegalEntityDocumentDetail/${legalEntityId}?isdeleted=${deletedStatus}`, this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getDocumentList(legalEntityId,deletedStatus));
		});
	}

	//getDocumentUploadEndpoint<T>(file: any): Observable<T> {
	//	const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
	//	return this.http.post<T>(`${this._addDocumentDetails}`, file);
	//}

	getDocumentUploadEndpoint<T>(file: any): Observable<T> {
		const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
		return this.http.post<T>(`${this._addDocumentDetails}`, file)
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getDocumentUploadEndpoint(file));
		});
	}
	getdeleteDocumentListbyId(legalEntityDocumentId) {
		return this.http.delete(`${this._deleteLegalEntityDocuments}/${legalEntityDocumentId}`,this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getdeleteDocumentListbyId(legalEntityDocumentId));
		});
	}
	getLegalEntityDocumentAuditHistory(id, legalEntityId) {
		return this.http.get<any>(`${this._getlegalEntityDocumentHistory}?id=${id}&legalEntityId=${legalEntityId}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getLegalEntityDocumentAuditHistory(id, legalEntityId));
		});
}

	LegalEntityBillingFileUpload(file, entityId) {
		return this.http.post(`${this.excelUpload}?legalEntityId=${entityId}`, file)
		.catch(error => {
			return this.handleErrorCommon(error, () => this.LegalEntityBillingFileUpload(file, entityId));
		});
}

	//deleteBillingAddress<T>(roleObject: any, legalEntityId: any): Observable<T> {
	//	let endpointUrl = `${this._deleteBillingEntityDettilas}/${legalEntityId}`;
	//	return this.http.get<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
	//		.catch(error => {
	//			return this.handleErrorCommon(error, () => this.deleteBillingAddress(roleObject, legalEntityId));
	//		});
	//}

	deleteBillingAddress(legalEntityId, moduleId) {
		var modelData={
			updatedBy:moduleId
		}
		return this.http.put<any>(`${this._deleteBillingEntityDettilas}?${legalEntityId}`,JSON.stringify(modelData), this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.updateBillingViainfo(legalEntityId, moduleId));
		});
}

	//deleteBillingAddress<T>(roleObject: any, legalEntityId: any): Observable<T> {
	//	let endpointUrl = `${this._deleteBillingEntityDettilas}/${legalEntityId}`;
	//	return this.http.get<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
	//		.catch(error => {
	//			return this.handleErrorCommon(error, () => this.deleteBillingAddress(roleObject, legalEntityId));
	//		});
	//}





	updateBillingViainfo<T>(roleObject: any, entityId: any): Observable<T> {
		let endpointUrl = `${this._updateBillingViaDetails}/${entityId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateBillingViainfo(roleObject, entityId));
			});
	}

	getlegalEntityBillingHistory(legalEntityId, legalEntityBillingAddressId) {
		return this.http.get(`${this._legalEntityBillingHistory}?legalEntityId=${legalEntityId}&legalEntityBillingaddressId=${legalEntityBillingAddressId}`, this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getGeneralrobj());
		});
	}



	getGeneralrobj<T>(): Observable<T> {
		return this.http.get<T>(this._generalEmptyObjurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getGeneralrobj());
			});
	}

	getLegalEntityEndpontService<T>(): Observable<T> {

		return this.http.get<T>(this._entityurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLegalEntityEndpontService());
			});
	}

	SearchData<T>(pageSearch: any): Observable<T> {
		let endpointUrl = this.searchUrl;
		return this.http.post<T>(endpointUrl, JSON.stringify(pageSearch), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.SearchData(pageSearch));
			});
	}

	//SearchData(data) {
	//	return this.http.post(this.serach, JSON.stringify(data), this.getRequestHeaders())
	//		.catch(error => {
	//			return this.handleErrorCommon(error, () => this.SearchData(data));
	//		});
	//}

	getManagemtentEntityData<T>(masterCompanyId?): Observable<T> {
		let endpointUrl = `${this._managementUrl}/${ masterCompanyId !==undefined ? masterCompanyId : 1 }`;		
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLegalEntityEndpontService());
		});
	}

	getEntityDataById(entityId) {
		return this.http.get<any>(`${this.baseUrl}/api/legalEntity/getEntitydatabyid/${entityId}`,this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getEntityDataById(entityId));
		});
	}
	getBankingApisData(entityId) {
		return this.http.get<any>(`${this.baseUrl}/api/legalEntity/Getentitybybanking?legalEntityId=${entityId}`,this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getBankingApisData(entityId));
		});
	}
	

	getMSHistoryDataById(msID) {
		return this.http.get<any>(`${this.baseUrl}/api/ManagementStrcture/mshistory/?msID=${msID}`,this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getEntityDataById(msID));
		});
	}

	

	updateEntityListDetails<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._entityUpdateUrl}/${roleObject.legalEntityId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateEntityListDetails(roleObject));
			});
	}



	getcountryListEndpoint<T>(): Observable<T> {

		return this.http.get<T>(this._countryUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getcountryListEndpoint());
			});
	}

    getManagemtentLengalEntityData<T>(): Observable<T> {

        return this.http.get<T>(this._managementLegalUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getLegalEntityEndpontService());
            });
    }

	loadParentEntities<T>(): Observable<T> {
		return this.http.get<T>(this._parentEntityUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLegalEntityEndpontService());
			});
	}

	getLedgerNamesData<T>(): Observable<T> { 
		
		return this.http.get<T>(this._ledgerUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLegalEntityEndpontService());
			});
	}
	

	getEntityforEdit<T>(): Observable<T> {

		return this.http.get<T>(this._entityediturl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLegalEntityEndpontService());
			});
	}
	getNewLegalEntityEndpontService<T>(userObject: any): Observable<T> {

		return this.http.post<T>(this._entityUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewLegalEntityEndpontService(userObject));
			});
	}
	updateLegalEntityEndpointService(roleObject: any, id: number) {
		//alert(JSON.stringify(roleObject));
		let endpointUrl = `${this._entityUrlNew}/${id}`;
		return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateLegalEntityEndpointService(roleObject, id));
			});
	}
	getmanagementPost<T>(userObject: any): Observable<T> {

		return this.http.post<T>(this._managementposturl, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getmanagementPost(userObject));
			});
	}
	updateManagement<T>(userObject: any): Observable<T> {
		let endpointUrl = `${this._managementposturl}/${userObject.managementStructureId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateManagement(userObject));
			});
	}
	getDeleteActionEndpoint<T>(actionId: number): Observable<T> {
		let endpointUrl = `${this._managementposturl}/${actionId}`;

		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getDeleteActionEndpoint(actionId));
			});
	}

	getrestoreActionEndpoint<T>(actionId: number): Observable<T> {
		let endpointUrl = `${this._managementrestoreturl}/${actionId}`;
		return this.http.post<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getrestoreActionEndpoint(actionId));
			});
	}

	
	getDeleteActionEndpoint1<T>(actionId: number): Observable<T> {
		let endpointUrl = `${this._deleteLegalEntity}/${actionId}`;

		return this.http.put<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getDeleteActionEndpoint(actionId));
			});
	}

    getContcatDetails<T>(userObject): Observable<T> {
        let endpointUrl = `${this._contactUrl}/${userObject.legalEntityId}`;
        return this.http.post<T>(endpointUrl,  JSON.stringify(userObject),this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getContcatDetails(userObject));
            });
    }
    getBillingList<T>(userObject): Observable<T> {
        let endpointUrl = `${this._billingLIstUrl}/${userObject.legalEntityId}`;
        return this.http.post<T>(endpointUrl,  JSON.stringify(userObject),this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getBillingList(userObject));
            });
	}
	getDomesticShipList<T>(userObject): Observable<T> {
        let endpointUrl = `${this._domesticShipUrl}/${userObject.legalEntityId}`;
        return this.http.post<T>(endpointUrl,  JSON.stringify(userObject),this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getDomesticShipList(userObject));
            });
	}
	getDomesticShipViaList<T>(userObject): Observable<T> {
        let endpointUrl = `${this._getShipViaByShippingId}/${userObject.legalEntityShippingAddressId}`;
        return this.http.post<T>(endpointUrl,  JSON.stringify(userObject),this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getDomesticShipViaList(userObject));
            });
	}
	getinternationalShippingData<T>(userObject): Observable<T> {
        let endpointUrl = `${this._internationalshippingget}/${userObject.legalEntityId}`;
        return this.http.post<T>(endpointUrl,  JSON.stringify(userObject),this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getinternationalShippingData(userObject));
            });
	}
	
	
	getInternationalShipViaList<T>(userObject): Observable<T> {
        let endpointUrl = `${this._internationalshpViaList}/${userObject.legalEntityInternationalShippingId}`;
        return this.http.post<T>(endpointUrl,  JSON.stringify(userObject),this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getInternationalShipViaList(userObject));
            });
	}

	
	getUpdateLegalEntityEndpontService<T>(roleObject: any, actionId: number): Observable<T> {
		let endpointUrl = `${this._entityUrlNew}/${actionId}`;
		let obj = {
			'name': roleObject.name,
			'description': roleObject.description,
			'doingLegalAs': roleObject.doingLegalAs,
			'address1': roleObject.address1,
			'address2': roleObject.address2,
			'city': roleObject.city,
			'stateOrProvince': roleObject.stateOrProvince,
			'postalCode': roleObject.postalCode,
			'country': roleObject.country,
			'faxNumber': roleObject.faxNumber,
			'phoneNumber1': roleObject.phoneNumber1,
			'functionalCurrencyId': roleObject.functionalCurrencyId,
			'reportingCurrencyId': roleObject.reportingCurrencyId,
			'isBalancingEntity': roleObject.isBalancingEntity,
			'cageCode': roleObject.cageCode,
			'faaLicense': roleObject.faaLicense,
			'taxId': roleObject.taxId,
			'ledgerName': roleObject.ledgerName,
			'isBankingInfo': roleObject.isBankingInfo,
			'isLastLevel': roleObject.isLastLevel,
			'poBox': roleObject.poBox,
			'bankStreetaddress1': roleObject.bankStreetaddress1,
			'bankStreetaddress2': roleObject.bankStreetaddress2,
			'bankCity': roleObject.bankCity,
			'bankProvince': roleObject.bankProvince,
			'bankcountry': roleObject.bankcountry,
			'bankpostalCode': roleObject.bankpostalCode,
			'domesticBankName': roleObject.domesticBankName,
			'domesticIntermediateBank': roleObject.domesticIntermediateBank,
			'domesticBenficiaryBankName': roleObject.domesticBenficiaryBankName,
			'domesticBankAccountNumber': roleObject.domesticBankAccountNumber,
			'domesticABANumber': roleObject.domesticABANumber,
			'internationalBankName': roleObject.internationalBankName,
			'internationalIntermediateBank': roleObject.internationalIntermediateBank,
			'internationalBenficiaryBankName': roleObject.internationalBenficiaryBankName,
			'internationalBankAccountNumber': roleObject.internationalBankAccountNumber,
			'internationalSWIFTID': roleObject.internationalSWIFTID,
			'achBankName': roleObject.achBankName,
			'achIntermediateBank': roleObject.achIntermediateBank,
			'achBenficiaryBankName': roleObject.achBenficiaryBankName,
			'achBankAccountNumber': roleObject.achBankAccountNumber,
			'achABANumber': roleObject.achABANumber,
			'achSWIFTID': roleObject.achSWIFTID,
			'legalEntityId': roleObject.legalEntityId,
			'createdBy': roleObject.createdBy,
            'updatedBy': roleObject.updatedBy,

		}
		return this.http.put<T>(endpointUrl, JSON.stringify(obj), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getUpdateLegalEntityEndpontService(roleObject, actionId));
			});
	}

	getDeleteLegalEntityEndpontService<T>(actionId: number): Observable<T> {
		let endpointUrl = `${this._entityUrlNew}/${actionId}`;

		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getDeleteLegalEntityEndpontService(actionId));
			});
	}

	getHistoryLegalEntityEndpontService<T>(jobTitleId: number): Observable<T> {
		let endpointUrl = `${this._JobTilesUrlAuditHistory}/${jobTitleId}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getHistoryLegalEntityEndpontService(jobTitleId));
			});
    }

    getAccountsInfoById<T>(entityId: number): Observable<T> {
        let endpointUrl = `${this.getEntitySetupAccounts}/${entityId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAccountsInfoById(entityId));
            });
    }

    getUpdateLegalEntityActive<T>(roleObject: any, legalEntityId: number): Observable<T> {
       // let endpointUrl = `${this._entityUrlNew}/${legalEntityId}`;

        return this.http.put<T>(this._activeUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getUpdateLegalEntityActive(roleObject, legalEntityId));
            });
	}
	Shippingdetailsviastatus<T>(id, status, updatedBy) {
		let endpointUrl = `${this._shippingdetailsviastatus}?id=${id}&status=${status}&updatedBy=${updatedBy}`;
		return this.http.put<T>(endpointUrl,  this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () =>this.Shippingdetailsviastatus(id, status, updatedBy));
			});
		// return this.http.get<T>(`${this.shippingdetailsviastatus}?id=${id}&status=${status}&updatedBy=${updatedBy}`)
		// 	.catch(error => {
		// 		return this.handleErrorCommon(error, () => this.Shippingdetailsviastatus(id, status, updatedBy));
		// 	});
	}
	
	updateLegalEntitytContactStatus<T>(roleObject): Observable<T> {
		let endpointUrl = `${this._updatelegalContactStatus}?Contactid=${roleObject.contactId}&status=${roleObject.status}&updatedby=${roleObject.updatedBy}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateLegalEntitytContactStatus(roleObject));
			});
	}
	updateLegalEntityStatus<T>(id, status, updatedBy): Observable<T> {
        let endpointUrl = `${this._activeUrl}?legalEntityId=${id}&status=${status}&updatedBy=${updatedBy}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateLegalEntityStatus(id, status, updatedBy));
            });
    }
	
	getLegalEntityAddressById<T>(entityId: number): Observable<T> {
        let endpointUrl = `${this.getLegalEntityAddressByIdURL}/${entityId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getLegalEntityAddressById(entityId));
            });
    }


	
	uploadLegalEntityLogoEndpoint<T>(file: any): Observable<T> {
        const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post<T>(`${this._uploadlegalEntityLogo}`, file).catch(error => {
			return this.handleErrorCommon(error, () => this.uploadLegalEntityLogoEndpoint(file));
		});
	}
	
	getNewLegalEntityContactInfo<T>(param: any): Observable<any> { 
        delete param.contactId;
		let body = JSON.stringify(param);
		let endpointUrl = this.baseUrl +`/api/legalentity/LegalEntityContactPost`;
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
        return this.http.post(endpointUrl, body, this.getRequestHeaders())
            .map((response: Response) => {
                return <any>response;
            }).catch(error => {
				return this.handleErrorCommon(error, () => this.getNewLegalEntityContactInfo(param));
			});
	}
	
	addLegalEntityContactDetails<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let endpointUrl = this.baseUrl +`/api/legalentity/ContactPost`;
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
        return this.http.post(endpointUrl, body, this.getRequestHeaders())
            .map((response: Response) => {
                return <any>response;
            }).catch(error => {
				return this.handleErrorCommon(error, () => this.addLegalEntityContactDetails(param));
			});
	}



	//bankingpost lock box

	getNewlockboxLegalEntityEndpontService<T>(userObject: any): Observable<T> {

		return this.http.post<T>(this._entityUrlNewlockbox, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewlockboxLegalEntityEndpontService(userObject));
			});
	}

	
	getNewdomesticwireLegalEntityEndpontService<T>(userObject: any): Observable<T> {

		return this.http.post<T>(this._entityUrlNewdomestic, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewdomesticwireLegalEntityEndpontService(userObject));
			});
	}


	getNewinternationaLegalEntityEndpontService<T>(userObject: any): Observable<T> {

		return this.http.post<T>(this._entityUrlNewinternationalwire, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewinternationaLegalEntityEndpontService(userObject));
			});
	}
	getNewACHLegalEntityEndpontService<T>(userObject: any): Observable<T> {

		return this.http.post<T>(this._entityUrlNewACH, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getNewACHLegalEntityEndpontService(userObject));
			});
	}



	getEntityLockboxDataById(legalEntityId) {
		return this.http.get<any>(`${this.baseUrl}/api/legalEntity/getEntityLockBoxdata?legalEntityId=${legalEntityId}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getEntityLockboxDataById(legalEntityId));
		});
	}
	getEntityDomesticDataById(entityId) {
		return this.http.get<any>(`${this.baseUrl}/api/legalEntity/getEntityDomesticWireById?legalEntityId=${entityId}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getEntityDomesticDataById(entityId));
		});
	}
	getEntityInternationalDataById(entityId) {
		//alert('lol,');
		return this.http.get<any>(`${this.baseUrl}/api/legalEntity/getEntityInternationalWireById?legalEntityId=${entityId}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getEntityInternationalDataById(entityId));
		});
	}
	getEntityACHDataById(entityId) {
		return this.http.get<any>(`${this.baseUrl}/api/legalEntity/getEntityACHById?legalEntityId=${entityId}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getEntityACHDataById(entityId));
		});
	}


	updateLegalLockbox<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._updatelegallockbox}/${roleObject.LegalEntityId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateLegalLockbox(roleObject));
			});
	}


	updateLegalDomestic<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._updatelegalDomesticwire}/${roleObject.LegalEntityId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateLegalDomestic(roleObject));
			});
	}

	
	restorebillingRecord<T>(id: any,user): Observable<T> {
		let endpointUrl = `${this.restoreBillingURl}?billingAddressId=${id}&updatedby=${user}`;
		return this.http.put<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.restorebillingRecord(id,user));
			});
	}
	restoreDocumentLegal<T>(id: any,user): Observable<T> {
		let endpointUrl = `${this.restoreLegalDocsURl}?id=${id}&updatedby=${user}`;
		return this.http.put<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.restoreDocumentLegal(id,user));
			});
	}
	restoreCOntact<T>(id: any,user): Observable<T> {
		let endpointUrl = `${this.restoreLegalContactsURl}?id=${id}&updatedby=${user}`;
		return this.http.put<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.restoreCOntact(id,user));
			});
	}
	
	restoreDomesticShippingRecord<T>(id: any,user): Observable<T> {
		let endpointUrl = `${this.restoreDomesticHipURl}?id=${id}&updatedby=${user}`;
		return this.http.put<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.restoreDomesticShippingRecord(id,user));
			});
	}
	updateLegalInternational<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._updatelegalInternalwire}/${roleObject.LegalEntityId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateLegalInternational(roleObject));
			});
	}


	updateLegalACH<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._updatelegalACH}/${roleObject.LegalEntityId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateLegalACH(roleObject));
			});
	}


	getLegalEntityHistory(customerId) {
		return this.http.get(`${this._customerHistory}?LegalEntityId=${customerId}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getLegalEntityHistory(customerId));
		});
	}

	
	getLegalEntityContactById(contactId) {
		return this.http.get(`${this._getContactById}/${contactId}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getLegalEntityAddressById(contactId));
		});
	}
	getDeleteActionEndpointLogo<T>(actionId: number): Observable<T> {
		let endpointUrl = `${this.LogogDell}/${actionId}`;

		console.log("Deleting");

		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				console.log("Error on Deleting");
				return this.handleErrorCommon(error, () => this.getDeleteActionEndpointLogo(actionId));
			});
	}

	getGlobalEntityRecords<T>(pageSearch: any): Observable<T> {
		let endpointUrl = this.EntityGlobalSearch;
		return this.http.post<T>(endpointUrl, JSON.stringify(pageSearch), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getGlobalEntityRecords(pageSearch));
			});
	}
	getNewBillinginfo<T>(param: any): Observable<T> {

		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http
			.post(this._billingInfoUrl, body, this.getRequestHeaders())
			.map((res: Response) => res).catch(error => {
				return this.handleErrorCommon(error, () => this.getNewBillinginfo(param));
			});
			// .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}
	getLegalEntityHistoryById(legalEntityId) {
		//return this.http.get<any>(`${this.configurations.baseUrl}/${this._legalEntityHistory}?legalEntityId=${legalEntityId}`)
		return this.http.get<any>(`${this._legalEntityHistory}/${legalEntityId}`,this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLegalEntityHistoryById(legalEntityId));
			});
	}

	updateContact<T>(roleObject): Observable<T> {
		let endpointUrl = `${this._updatelegalContact}/${roleObject.contactId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateContact(roleObject));
			});
	}

		LegalEntityBillingUpdateforActive<T>(id, status, updatedBy) {
		let endpointUrl = `${this._legalEntityBillingUpdateforActive}?billingAddressId=${id}&status=${status}&updatedBy=${updatedBy}`
		return this.http.put<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.LegalEntityBillingUpdateforActive(id, status, updatedBy));
			});
	}

	// LegalEntityBillingUpdateforActive<T>(roleObject) {
	// 	let endpointUrl = `${this.legalEntityBillingUpdateforActive}?billingAddressId=${roleObject.id}&status=${roleObject.statusInfo}&updatedBy=${roleObject.updatedBy}`
	// 	return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
	// 		.catch(error => {
	// 			return this.handleErrorCommon(error, () => this.LegalEntityBillingUpdateforActive(roleObject));
	// 		});
	// }
	getLegalEntityContactHistoryById(legalentitycontactId,legalentityId) {
		return this.http.get<any>(`${this._legalEntityHistoryContact}?legalentitycontactId=${legalentitycontactId}&legalentityId=${legalentityId}`)
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLegalEntityContactHistoryById(legalentitycontactId,legalentityId));
			});
	}
	
	deleteLegalEntityContact<T>(conatctId: number,updatedBy): Observable<T> {
		let endpointUrl = `${this._deleteLegalEntityContact}/${conatctId}`;
		var modelData={
			updatedBy:updatedBy
		};	
		return this.http.put<T>(endpointUrl,JSON.stringify(modelData), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.deleteLegalEntityContact(conatctId,updatedBy));
			});
	}
	getLeaglLockBoxHistory<T>(legalEntityId: number): Observable<T> {
		let endpointUrl = `${this.lockBoxURl}/${legalEntityId}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLeaglLockBoxHistory(legalEntityId));
			});
	}
	getLeaglDomesticHistory<T>(legalEntityId: number): Observable<T> {
		let endpointUrl = `${this.DomsticWireUrl}/${legalEntityId}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLeaglDomesticHistory(legalEntityId));
			});
	}
	getLeaglInternationalHistory<T>(legalEntityId: number): Observable<T> {
		let endpointUrl = `${this.InternationalWireURL}/${legalEntityId}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLeaglInternationalHistory(legalEntityId));
			});
	}
	getLeaglAchHistory<T>(legalEntityId: number): Observable<T> {
		let endpointUrl = `${this.ACHUrl}/${legalEntityId}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLeaglAchHistory(legalEntityId));
			});
    }
}


//localhost:5020/api/LegalEntity/LegalEntityBillAddressdetails/95
//localhost:5230/api/legalentity/LegalEntityBillAddressdetails/96