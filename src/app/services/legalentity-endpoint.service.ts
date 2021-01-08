
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class LegalEntityEndpontService extends EndpointFactory { 


	private readonly _entityurl: string = "/api/legalEntity/Get";
	 
    private readonly _managementUrl: string = "/api/ManagementStrcture/ManagementGet";
	private readonly _managementLegalUrl: string = "/api/ManagementStrcture/ManagementGetView"; 
	private readonly _parentEntityUrl: string = "/api/legalEntity/ParentEntities"; 
	private readonly _ledgerUrl: string = "/api/ManagementStrcture/LedgerNames";
	private readonly _entityediturl: string = "/api/legalEntity/GetforEdit";
	private readonly _entityUrlNew: string = "/api/legalEntity/legalEntitypost";
	private readonly _customerContactHistory1: string = '/api/legalEntity/Legalcontactauditdetails'

	//create
	private readonly _entityUrlNewlockbox: string = "/api/legalEntity/LegalEntityBankingLockBoxPost"; 
	private readonly _entityUrlNewdomestic: string = "/api/legalEntity/legalEntityDomesticPayment";
	private readonly _entityUrlNewinternationalwire: string = "/api/legalEntity/LegalEntityInternationalPaymentCreate";
	private readonly _entityUrlNewACH: string = "/api/legalEntity/LegalEntityBankingACHPost";

	//update
	private readonly _updatelegallockbox: string = "/api/legalEntity/UpdateLegalEntityBankingLockBox"; 
	private readonly _updatelegalDomesticwire: string = "/api/legalEntity/domesticPaymentUpdate";
	private readonly _updatelegalInternalwire: string = "/api/legalEntity/LegalEntityInternationalPaymentUPdate";
	private readonly _updatelegalACH: string = "/api/legalEntity/LegalEntityBankingACHUpdate";
	private readonly _updatelegalContact:string = "/api/legalentity/LegalEntityContactPost";
	private readonly _updatelegalContactStatus:string = "/api/LegalEntity/UpdateConatctActive";
	

	//restore apis

	private readonly restoreBillingURl: string = "/api/legalentity/RestoreLegalbillingaddress"; 
	private readonly restoreDomesticHipURl: string = "/api/legalentity/RestoreLegalDomShippingaddress";
	private readonly restoreLegalDocsURl: string = "/api/legalEntity/RestoreDocuments";
	private readonly restoreLegalContactsURl: string = "/api/legalEntity/RestoreLegalcontacts";
	
	//get list by legal entity id
	private readonly _customerHistory: string = "/api/legalEntity/GetLegalEntityAuditHistoryByid"; 
	//private readonly _entityUrlNewdomesticList: string = "/api/legalEntity/getEntityDomesticWireById"; 
	//private readonly _entityUrlNewinternationalwireList: string = "/api/legalEntity/getEntityInternationalWireById"; 
	//private readonly _entityUrlNewACHList: string = "/api/legalEntity/getEntityACHById"; 

	private readonly _legalEntityHistory: string = "/api/legalEntity/legalEntityHistoryById"; 
	private readonly _legalEntityHistoryContact: string = "api/legalEntity/Legalcontactauditdetails"; 
	private readonly _managementposturl: string = "/api/ManagementStrcture/managementEntitypost";
	private readonly _managementrestoreturl: string = "/api/ManagementStrcture/managementrestore";
	private readonly _deleteLegalEntity: string = "/api/legalEntity/deleteLegalEntity";
	private readonly _deleteLegalEntityContact: string = "/api/LegalEntity/LegalentityContact";

    private readonly _JobTilesUrlAuditHistory: string = "/api/legalEntity/auditHistoryById";
    private readonly getEntitySetupAccounts: string = "/api/legalEntity/legalEntityAccountsById";

	private readonly _activeUrl: string = "/api/legalEntity/UpdateActive";
	private readonly getLegalEntityAddressByIdURL: string = "/api/legalEntity/legalentityaddressbyid";
	private readonly _contactUrl: string = "/api/legalentity/ContactList";
	private readonly _billingLIstUrl: string = "/api/LegalEntity/BillinginfoList";
	private readonly _domesticShipUrl: string = "/api/LegalEntity/DomesticShippingList";
	
	private readonly _countryUrl: string = "/api/legalEntity/GetcountryList";
	private readonly _entityUpdateUrl: string = "/api/LegalEntity/UpdateLegalEntityDetails";
	private readonly _generalEmptyObjurl: string = "/api/LegalEntity/generalEmptyObj";
	private readonly _billingInfoUrl: string = "/api/LegalEntity/LegalEntityBillingPost";
	private readonly _updateBillingViaDetails: string = "/api/legalEntity/LegalEntityBillAddressdetails";
	private readonly _legalEntityBillingHistory: string = "/api/LegalEntity/getLegalEntityBillingHistory"
	private readonly _legalEntityBillingUpdateforActive: string = '/api/LegalEntity/legalentitybillingaddressstatus'
	private readonly _deleteBillingEntityDettilas: string = "/api/LegalEntity/deletelegalentitybillingaddress";
	private readonly excelUpload: string = "/api/LegalEntity/uploadLegalEntitybillingaddress"
	private readonly ContactexcelUpload: string = "/api/LegalEntity/uploadlegalEntitycontacts"
	private readonly _getlegalEntityDocumentAttachmentslist: string = "/api/FileUpload/getattachmentdetails";
	private readonly _addDocumentDetails: string = '/api/LegalEntity/LegalEntityFinanceDocumentUpload';
	private readonly _deleteLegalEntityDocuments: string = '/api/LegalEntity/deleteLegalEntityDocuments';
	private readonly _getlegalEntityDocumentHistory: string = "/api/LegalEntity/getLegalEntityDocumentsAudit"

	private readonly _updateShippingViaDetails: string = "/api/legalEntity/updateShipViaDetails";
	private readonly _legalEntityShipAddressdetails: string = "/api/legalEntity/legalEntityShippingAddressDetails";
	private readonly _legalEntityShippingUrlNew: string = "/api/legalEntity/updateStatuslegalEntityShipping";
	private readonly _getShipViaByShippingId: string = "/api/legalEntity/DomesticShipviaList";
	private readonly _getShipViaHistory: string = "/api/legalEntity/getShipViaHistory";
	private readonly _shippingInfoUrl: string = "/api/legalEntity/LegalEntityShippingPost";
	private readonly _saveShipViaDetails: string = "/api/legalEntity/addShipViaDetails";
	private readonly _updatshippingAddressDetails: string = "/api/legalEntity/updateShipAddress";
	private readonly _updateStatuslegalEntityShipping: string = "/api/legalEntity/updateStatusLegalEntityShipping";
	private readonly _legalEntityShipViaDetails: string = "/api/legalEntity/getlegalEntityShipViaDetails";
	private readonly _cusShippingGeturl = "/api/legalEntity/legalentityshippingaddresslist";
	private readonly _cusShippingGeturlwithId = "/api/Vendor/cusshippingGetwithid";
	private readonly _internationalshippingpost: string = '/api/legalEntity/createinternationalshipping'
	private readonly _internationalshippingget: string = '/api/legalEntity/InternationalShippingList'
	private readonly _internationalshpViaList: string = '/api/legalEntity/InternationalShipviaList'
	
	private readonly _internationalstatus: string = '/api/legalEntity/internationalshippingdetailsstatus'
	private readonly _internationalShippingDelete: string = '/api/legalEntity/deleteinternationalshipping';
	private readonly _internationalshippingdetailsbyid: string = '/api/legalEntity/internationalshippingdetailsbyid';
	private readonly _updateinternationalshipping: string = '/api/legalEntity/updateinternationalshipping';
	private readonly _createinternationalshippingviadetails: string = '/api/legalEntity/createintershippingviadetails';
	private readonly _internationalShipViaList: string = '/api/legalEntity/getshippingviadetails';
	private readonly _updateshippingviadetails: string = '/api/legalEntity/updateintershippingviadetails';
	private readonly excelUploadShipping: string = "/api/legalEntity/uploadlegalEntityshippingaddress"
	private readonly excelUploadInterShipping: string = "/api/legalEntity/uploadlegalEntityinternationalshipping"
	private readonly _legalEntityShippingHistory: string = "/api/legalEntity/getLegalEntityShippingHistory"
	private readonly _legalEntityInterShippingHistory: string = "/api/legalEntity/GetlegalEntityInternationalShippingAuditHistoryByid";
	private readonly _legalEntityShipViaHistory: string = "/api/legalEntity/GetShipViaAudit"
	private readonly _legalEntityInterShipViaHistory: string = "/api/legalEntity/getauditshippingviadetailsbyid"
	private readonly _deleteInternationalShippingViaMapUrl: string = '/api/legalEntity/deleteintershippingviadetails';
	private readonly _deleteShipVia: string = '/api/legalEntity/deleteshipviadetails';
	private readonly _internationalShipViaByShippingIdList: string = '/api/legalEntity/getinternationalshippingviadetails';
	private readonly _addShipViaDetails: string = '/api/legalEntity/addShipViaDetails';
	private readonly _shippingDetailsStatus: string = '/api/legalEntity/shippingdetailsstatus';
	private readonly _shippingdetailsviastatus: string = '/api/legalEntity/shippingdetailsviastatus';
	private readonly _uploadlegalEntityLogo: string = '/api/legalentity/LegalEntityLogoUplodad'; 
	private readonly _getContactById: string = '/api/legalEntity/ContactGet'; 
	private readonly searchUrl: string = '/api/legalentity/List';
	private readonly EntityGlobalSearch: string = '/api/legalentity/ListGlobalSearch';

	private readonly LogogDell: string = '/api/legalentity/LogoDelete';
	// legal banking History URls
	private readonly lockBoxURl: string = '/api/legalEntity/GetEntityLockBoxAudit';
	private readonly DomsticWireUrl: string = '/api/legalEntity/GetEntityDomesticWireAudit';
	private readonly InternationalWireURL: string = '/api/legalEntity/GetEntityInternationalWireAudit';
	private readonly ACHUrl: string = '/api/legalEntity/GetEntityACHAudit';
	   
	get cusShippingUrl() { return this.configurations.baseUrl + this._cusShippingGeturl; }
	get cusShippingUrlwithaddressid() { return this.configurations.baseUrl + this._cusShippingGeturlwithId; }

	get entityurl() { return this.configurations.baseUrl + this._entityurl; }
    get managemententityurl() { return this.configurations.baseUrl + this._managementUrl; }
	get managementlengalentityurl() { return this.configurations.baseUrl + this._managementLegalUrl; } 
	get parentEntityUrl() { return this.configurations.baseUrl + this._parentEntityUrl; }  
	get ledgerNamesurl() { return this.configurations.baseUrl + this._ledgerUrl; }
	get entityediturl() { return this.configurations.baseUrl + this._entityediturl; }
	get contactUrl() { return this.configurations.baseUrl + this._contactUrl; }
	get billingLIstUrl() { return this.configurations.baseUrl + this._billingLIstUrl; }
	get domesticShipUrl() { return this.configurations.baseUrl + this._domesticShipUrl; }
	get countryUrl() { return this.configurations.baseUrl + this._countryUrl; }
	get generalurl() { return this.configurations.baseUrl + this._generalEmptyObjurl }
	get legalEntityBillingUpdateforActive() { return this.configurations.baseUrl + this._legalEntityBillingUpdateforActive }
	get InternationalShippingPost() { return this.configurations.baseUrl + this._internationalshippingpost }
	get InternationalShippingList() { return this.configurations.baseUrl + this._internationalshippingget }
	get InternationalShipViaList() { return this.configurations.baseUrl + this._internationalshpViaList }
	
	get InternationalShippingStatus() { return this.configurations.baseUrl + this._internationalstatus }
	get InternationalShippingDelete() { return this.configurations.baseUrl + this._internationalShippingDelete }
	get InternationalShippingById() { return this.configurations.baseUrl + this._internationalshippingdetailsbyid }
	get UpdateInternationalshippingUrl() { return this.configurations.baseUrl + this._updateinternationalshipping }
	get InternationalShipVia() { return this.configurations.baseUrl + this._createinternationalshippingviadetails }
	get ShipViaByInternationalShippingId() { return this.configurations.baseUrl + this._internationalShipViaList }
	get UpdateShipViaInternational() { return this.configurations.baseUrl + this._updateshippingviadetails }
	get deleteShipVia() { return this.configurations.baseUrl + this._deleteShipVia; }
	get InternatioanlShipViaByInternationalShippingId() { return this.configurations.baseUrl + this._internationalShipViaByShippingIdList }
	get domesticShipVia() { return this.configurations.baseUrl + this._addShipViaDetails }
	get ShippingDetailsStatus() { return this.configurations.baseUrl + this._shippingDetailsStatus }
	get shippingdetailsviastatus() { return this.configurations.baseUrl + this._shippingdetailsviastatus }
	get serach() { return this.configurations.baseUrl + this.searchUrl; }
	get _LogogDell() { return this.configurations.baseUrl + this.LogogDell; }

	get _EntityGlobalSearch() { return this.configurations.baseUrl + this.EntityGlobalSearch; }


	


	get domesticShipVia1() { return this.configurations.baseUrl + this._getShipViaByShippingId }

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
		let endpointUrl = `${this._updateStatuslegalEntityShipping}?id=${roleObject.legalEntityShippingAddressId}&updatedby=${roleObject.updatedBy}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateStatusShippinginfo(roleObject, legalEntityId));
			});
	}
	getCusHippingaddresdetails<T>(legalEntityId: any): Observable<T> {
		let endpointurl = `${this.cusShippingUrl}?legalEntityId=${legalEntityId}`;
		//let endpointUrl = `${this.entityBillViaDetails}?billingAddressId=${id}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getCusHippingaddresdetails(legalEntityId));
			});
	}
	getCusHippingaddresdetailswithid<T>(legalEntityId: any): Observable<T> {
		let endpointurl = `${this.cusShippingUrlwithaddressid}/${legalEntityId}`;
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
		return this.http.post(`${this.configurations.baseUrl}${this.ContactexcelUpload}?legalEntityId=${legalEntityId}`, file).catch(error => {
			return this.handleErrorCommon(error, () => this.legalEntityContactFileUpload(file, legalEntityId));
		})
	
	}
	legalEntityShippingFileUpload(file, legalEntityId) {
		return this.http.post(`${this.configurations.baseUrl}${this.excelUploadShipping}?legalEntityId=${legalEntityId}`, file).catch(error => {
			return this.handleErrorCommon(error, () => this.legalEntityShippingFileUpload(file, legalEntityId));
		})
	}
	legalEntityInternationalShippingFileUpload(file, legalEntityId) {
		return this.http.post(`${this.configurations.baseUrl}${this.excelUploadInterShipping}?legalEntityId=${legalEntityId}`, file).catch(error => {
			return this.handleErrorCommon(error, () => this.legalEntityInternationalShippingFileUpload(file, legalEntityId));
		})
	}
	getlegalEntityShippingHistory( legalEntityId,legalEntityShippingAddressId) {
		return this.http.get(`${this.configurations.baseUrl}/${this._legalEntityShippingHistory}/${legalEntityId}?entityShippingAddressId=${legalEntityShippingAddressId}`, this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getlegalEntityShippingHistory( legalEntityId,legalEntityShippingAddressId));
		})
	}
	getlegalEntityInterShippingHistory(legalEntityId, legalEntityInterShippingId) {
		return this.http.get(`${this.configurations.baseUrl}/${this._legalEntityInterShippingHistory}?LegalEntityId=${legalEntityId}&internationalShippingId=${legalEntityInterShippingId}`, this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getlegalEntityInterShippingHistory(legalEntityId, legalEntityInterShippingId));
		})
	}

	getlegalEntityShipViaHistory(legalEntityId, legalEntityShippingAddressId, legalEntityShippingId) {
		return this.http.get(`${this.configurations.baseUrl}/${this._legalEntityShipViaHistory}?legalEntityId=${legalEntityId}&legalEntityShippingAddressId=${legalEntityShippingAddressId}&legalEntityShippingId=${legalEntityShippingId}`, this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getlegalEntityShipViaHistory(legalEntityId, legalEntityShippingAddressId, legalEntityShippingId));
		})
	}
	getlegalEntityInterShipViaHistory(legalEntityId, internationalShippingId, shippingViaDetailsId) {
		return this.http.get(`${this.configurations.baseUrl}/${this._legalEntityInterShipViaHistory}?legalEntityId=${legalEntityId}&internationalShippingId=${internationalShippingId}&shippingViaDetailsId=${shippingViaDetailsId}`, this.getRequestHeaders()).catch(error => {
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
		return this.http.get<T>(`${this.InternatioanlShipViaByInternationalShippingId}?legalEntityInternationalShippingId=${id}`, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getInternationalShipViaByInternationalShippingId(id));
			});
	}

	postDomesticShipVia<T>(postData) {
		return this.http.post<T>(this.domesticShipVia, JSON.stringify(postData), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.postDomesticShipVia(postData));
			});
	}

	updateShipViaInternational<T>(postData) {
		return this.http.post<T>(this.UpdateShipViaInternational, JSON.stringify(postData), this.getRequestHeaders())
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
		return this.http.get<T>(`${this.ShipViaByInternationalShippingId}?internationalShippingId=${id}&pageNumber=${pageIndex}&pageSize=${pageSize}`, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getShipViaByInternationalShippingId(id, pageIndex, pageSize));
			});
	}
	postInternationalShipVia<T>(postData) {

		return this.http.post<T>(this.InternationalShipVia, JSON.stringify(postData), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.postInternationalShipVia(postData));
			});
	}

	updateInternationalShipping<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this.UpdateInternationalshippingUrl}`;
		return this.http.post<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateInternationalShipping(roleObject));
			});
	}

	getInternationalShippingById<T>(id) {
		return this.http.get<T>(`${this.InternationalShippingById}?id=${id}`, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getInternationalShippingById(id));
			});
	}

	deleteInternationalShipping<T>(id, updatedBy) {
			let endpointUrl = `${this.InternationalShippingDelete}?id=${id}&updatedBy=${updatedBy}`;
			return this.http.put<T>(endpointUrl, this.getRequestHeaders())
				.catch(error => {
					return this.handleErrorCommon(error, () => this.deleteInternationalShipping(id, updatedBy));
				});
	}
	updateStatusForShippingDetails<T>(id, status, updatedBy) {
		let endpointUrl = `${this.ShippingDetailsStatus}?id=${id}&status=${status}&updatedBy=${updatedBy}`;
		return this.http.put<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateStatusForShippingDetails(id, status, updatedBy));
			});

	}
	updateStatusForInternationalShipping<T>(id, status, updatedBy) {

		let endpointUrl = `${this.InternationalShippingStatus}?id=${id}&status=${status}&updatedBy=${updatedBy}`;
		return this.http.put<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateStatusForInternationalShipping(id, status, updatedBy));
			});

	}
	// updateStatusForInternationalShippingVia(id, status, updatedBy) {
	// 	return this.http.get(``)

	// }

	updateStatusForInternationalShippingVia(id, status, updatedBy) {

		let endpointUrl = `${this.configurations.baseUrl}/api/legalEntity/intershippingviadetailsstatus?id=${id}&status=${status}&updatedBy=${updatedBy}`;
		return this.http.put(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.	updateStatusForInternationalShippingVia(id, status, updatedBy));
			});

	}

	deleteInternationalShipViaId<T>(id, updatedBy) {

		let endpointUrl = `${this._deleteInternationalShippingViaMapUrl}?id=${id}&updatedBy=${updatedBy}`;
		return this.http.put<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () =>this.deleteInternationalShipViaId(id, updatedBy));
			});


		// return this.http.get<T>(``)
		// 	.catch(error => {
		// 		return this.handleErrorCommon(error, () => this.deleteInternationalShipViaId(id, updatedBy));
		// 	});
	}

	deleteShipViaDetails<T>(id, updatedBy) {
	
			let endpointUrl = `${this._deleteShipVia}?id=${id}&updatedBy=${updatedBy}`;
			return this.http.put<T>(endpointUrl,this.getRequestHeaders())
				.catch(error => {
					return this.handleErrorCommon(error, () => this.deleteShipViaDetails(id, updatedBy));
				});
	}

	postInternationalShippingPost<T>(postData) {
		return this.http.post<T>(this.InternationalShippingPost, JSON.stringify(postData), this.getRequestHeaders())
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


		return this.http.get<T>(`${this.configurations.baseUrl}${this._customerContactHistory1}?customerContactId=${customerContactId}&customerId=${customerId}`, this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getCustomerContactAuditDetails1<T>(customerContactId, customerId));
		});
	}

	getDocumentList(legalEntityId,deletedStatus) {
		return this.http.get(`${this.configurations.baseUrl}/api/legalEntity/getlegalEntityDocumentDetail/${legalEntityId}?isdeleted=${deletedStatus}`, this.getRequestHeaders()).catch(error => {
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
		return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}?legalEntityId=${entityId}`, file)
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
		return this.http.put<any>(`${this._deleteBillingEntityDettilas}?billingAddressId=${legalEntityId}&updatedBy=${moduleId}`, this.getRequestHeaders())
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
		return this.http.get(`${this.configurations.baseUrl}/${this._legalEntityBillingHistory}?legalEntityId=${legalEntityId}&legalEntityBillingaddressId=${legalEntityBillingAddressId}`, this.getRequestHeaders()).catch(error => {
			return this.handleErrorCommon(error, () => this.getGeneralrobj());
		});
	}



	getGeneralrobj<T>(): Observable<T> {
		return this.http.get<T>(this.generalurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getGeneralrobj());
			});
	}

	getLegalEntityEndpontService<T>(): Observable<T> {

		return this.http.get<T>(this.entityurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLegalEntityEndpontService());
			});
	}

	SearchData<T>(pageSearch: any): Observable<T> {
		let endpointUrl = this.serach;
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

	getManagemtentEntityData<T>(): Observable<T> {

		return this.http.get<T>(this.managemententityurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLegalEntityEndpontService());
			});
	}

	getEntityDataById(entityId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/legalEntity/getEntitydatabyid/${entityId}`).catch(error => {
			return this.handleErrorCommon(error, () => this.getEntityDataById(entityId));
		});
	}
	getBankingApisData(entityId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/legalEntity/Getentitybybanking?legalEntityId=${entityId}`).catch(error => {
			return this.handleErrorCommon(error, () => this.getBankingApisData(entityId));
		});
	}
	

	getMSHistoryDataById(msID) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/ManagementStrcture/mshistory/?msID=${msID}`).catch(error => {
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

		return this.http.get<T>(this.countryUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getcountryListEndpoint());
			});
	}

    getManagemtentLengalEntityData<T>(): Observable<T> {

        return this.http.get<T>(this.managementlengalentityurl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getLegalEntityEndpontService());
            });
    }

	loadParentEntities<T>(): Observable<T> {
		return this.http.get<T>(this.parentEntityUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLegalEntityEndpontService());
			});
	}

	getLedgerNamesData<T>(): Observable<T> { 
		
		return this.http.get<T>(this.ledgerNamesurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLegalEntityEndpontService());
			});
	}
	

	getEntityforEdit<T>(): Observable<T> {

		return this.http.get<T>(this.entityediturl, this.getRequestHeaders())
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
        let endpointUrl = `${this.contactUrl}/${userObject.legalEntityId}`;
        return this.http.post<T>(endpointUrl,  JSON.stringify(userObject),this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getContcatDetails(userObject));
            });
    }
    getBillingList<T>(userObject): Observable<T> {
        let endpointUrl = `${this.billingLIstUrl}/${userObject.legalEntityId}`;
        return this.http.post<T>(endpointUrl,  JSON.stringify(userObject),this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getBillingList(userObject));
            });
	}
	getDomesticShipList<T>(userObject): Observable<T> {
        let endpointUrl = `${this.domesticShipUrl}/${userObject.legalEntityId}`;
        return this.http.post<T>(endpointUrl,  JSON.stringify(userObject),this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getDomesticShipList(userObject));
            });
	}
	getDomesticShipViaList<T>(userObject): Observable<T> {
        let endpointUrl = `${this.domesticShipVia1}/${userObject.legalEntityShippingAddressId}`;
        return this.http.post<T>(endpointUrl,  JSON.stringify(userObject),this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getDomesticShipViaList(userObject));
            });
	}
	getinternationalShippingData<T>(userObject): Observable<T> {
        let endpointUrl = `${this.InternationalShippingList}/${userObject.legalEntityId}`;
        return this.http.post<T>(endpointUrl,  JSON.stringify(userObject),this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getinternationalShippingData(userObject));
            });
	}
	
	
	getInternationalShipViaList<T>(userObject): Observable<T> {
        let endpointUrl = `${this.InternationalShipViaList}/${userObject.legalEntityInternationalShippingId}`;
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
		let endpointUrl = `${this.shippingdetailsviastatus}?id=${id}&status=${status}&updatedBy=${updatedBy}`;
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
		let endpointUrl = `/api/legalentity/LegalEntityContactPost`;
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
		let endpointUrl = `/api/legalentity/ContactPost`;
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
		return this.http.get<any>(`${this.configurations.baseUrl}/api/legalEntity/getEntityLockBoxdata?legalEntityId=${legalEntityId}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getEntityLockboxDataById(legalEntityId));
		});
	}
	getEntityDomesticDataById(entityId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/legalEntity/getEntityDomesticWireById?legalEntityId=${entityId}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getEntityDomesticDataById(entityId));
		});
	}
	getEntityInternationalDataById(entityId) {
		//alert('lol,');
		return this.http.get<any>(`${this.configurations.baseUrl}/api/legalEntity/getEntityInternationalWireById?legalEntityId=${entityId}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getEntityInternationalDataById(entityId));
		});
	}
	getEntityACHDataById(entityId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/legalEntity/getEntityACHById?legalEntityId=${entityId}`, this.getRequestHeaders())
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
		return this.http.get(`${this.configurations.baseUrl}/${this._customerHistory}?LegalEntityId=${customerId}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getLegalEntityHistory(customerId));
		});
	}

	
	getLegalEntityContactById(contactId) {
		return this.http.get(`${this.configurations.baseUrl}${this._getContactById}/${contactId}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getLegalEntityAddressById(contactId));
		});
	}
	getDeleteActionEndpointLogo<T>(actionId: number): Observable<T> {
		let endpointUrl = `${this._LogogDell}/${actionId}`;

		console.log("Deleting");

		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				console.log("Error on Deleting");
				return this.handleErrorCommon(error, () => this.getDeleteActionEndpointLogo(actionId));
			});
	}

	getGlobalEntityRecords<T>(pageSearch: any): Observable<T> {
		let endpointUrl = this._EntityGlobalSearch;
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
		return this.http.get<any>(`${this.configurations.baseUrl}/${this._legalEntityHistory}/${legalEntityId}`)
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
		let endpointUrl = `${this.legalEntityBillingUpdateforActive}?billingAddressId=${id}&status=${status}&updatedBy=${updatedBy}`
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
		return this.http.get<any>(`${this.configurations.baseUrl}/${this._legalEntityHistoryContact}?legalentitycontactId=${legalentitycontactId}&legalentityId=${legalentityId}`)
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getLegalEntityContactHistoryById(legalentitycontactId,legalentityId));
			});
	}
	
	deleteLegalEntityContact<T>(conatctId: number,updatedBy): Observable<T> {
		let endpointUrl = `${this._deleteLegalEntityContact}/${conatctId}?updatedBy=${updatedBy}`;

		return this.http.put<T>(endpointUrl, this.getRequestHeaders())
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