 // ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';


import { AuthService } from './auth.service';
import { User } from '../models/user.model';
 
import { Condition } from '../models/condition.model';
import { AuditHistory } from '../models/audithistory.model';
import { Role } from '../models/role.model';
import { LegalEntityEndpontService } from './legalentity-endpoint.service';
import { TreeNode } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class LegalEntityService {

	public static readonly roleAddedOperation: RolesChangedOperation = "add";
	public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
	public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

	private _rolesChanged = new Subject<RolesChangedEventArg>();
	isEditMode: boolean;
	ShowPtab: boolean = true;
	public currentUrl = this.router.url;
	public bredcrumbObj = new Subject<any>();
	public alertObj = new Subject<any>();
	public indexObj = new Subject<any>();
	enableExternal: boolean = false;
	listCollection: any;
	private isEntityEditMode = new BehaviorSubject(false);
	currentEditModeStatus = this.isEntityEditMode.asObservable();
	isReset: boolean = false;
	activeStep = new Subject();

	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService,
		private legalEntityEndpont: LegalEntityEndpontService) { }

	changeofTab(activeIndex) {
		this.activeStep.next(activeIndex);
	}

	newShippingAdd(action: any) {
		return this.legalEntityEndpont.getNewShipppinginfo<any>(action);
	}

	updateshippinginfo(legalEntityshipping: any) {
		return this.legalEntityEndpont.updateShippinginfo(legalEntityshipping, legalEntityshipping.legalEntityShippingAddressId);
	}
	updateStatusHipping(legalEntityshipping: any) {
		return this.legalEntityEndpont.updateStatusShippinginfo(legalEntityshipping, legalEntityshipping.legalEntityShippingAddressId);
	}

	getlegalEntityShipAddressGet(legalEntityId: any) {
		return Observable.forkJoin(
			this.legalEntityEndpont.getCusHippingaddresdetails<any[]>(legalEntityId));
	}
	getlegalEntityShipAddressGetWIthAddressId(legalEntityId: any) {
		return Observable.forkJoin(
			this.legalEntityEndpont.getCusHippingaddresdetailswithid<any>(legalEntityId));
	}
	ShippingFileUpload(file, legalEntityId) {
		return this.legalEntityEndpont.legalEntityShippingFileUpload(file, legalEntityId);
	}
	legalEntityContactFileUpload(file, legalEntityId) {
		return this.legalEntityEndpont.legalEntityContactFileUpload(file, legalEntityId);
	}
	
	InternationalShippingUpload(file, legalEntityId) {
		return this.legalEntityEndpont.legalEntityInternationalShippingFileUpload(file, legalEntityId);
	}
	getlegalEntityShippingHistory(legalEntityId, legalEntityShippingAddressId) {
		return this.legalEntityEndpont.getlegalEntityShippingHistory(legalEntityId,legalEntityShippingAddressId)
	}
	getlegalEntityInterShippingHistory(legalEntityId, legalEntityShippingAddressId) {
		return this.legalEntityEndpont.getlegalEntityInterShippingHistory(legalEntityId, legalEntityShippingAddressId)
	}

	getlegalEntityShipViaHistory(legalEntityId, legalEntityShippingAddressId, legalEntityShippingId) {
		return this.legalEntityEndpont.getlegalEntityShipViaHistory(legalEntityId, legalEntityShippingAddressId, legalEntityShippingId)
	}
	getlegalEntityInterShipViaHistory(legalEntityId, internationalShippingId, shippingViaDetailsId) {
		return this.legalEntityEndpont.getlegalEntityInterShipViaHistory(legalEntityId, internationalShippingId, shippingViaDetailsId)
	}
	updateStatusForShippingDetails(id, status, updatedBy) {
		return this.legalEntityEndpont.updateStatusForShippingDetails(id, status, updatedBy)
	}
	Shippingdetailsviastatus(id, status, updatedBy) {
		return this.legalEntityEndpont.Shippingdetailsviastatus(id, status, updatedBy)
	}

	getInternationalShipViaByInternationalShippingId(legalEntityInternationalShippingId) {
		return this.legalEntityEndpont.getInternationalShipViaByInternationalShippingId(legalEntityInternationalShippingId);
	}
	// getShipViaByDomesticShippingId(legalEntityShippingId) {
	// 	return this.legalEntityEndpont.getShipViaByDomesticShippingId(legalEntityShippingId);
	// }
	updateshippingViainfo(legalEntityshipping: any) {
		return this.legalEntityEndpont.updateShippingViainfo(legalEntityshipping, legalEntityshipping.legalEntityShippingId);
	}
	newShippingViaAdd(action: any) {
		return this.legalEntityEndpont.postDomesticShipVia<any>(action);
	}
	updateShipViaInternational(data) {
		return this.legalEntityEndpont.updateShipViaInternational(data);
	}
	getInternationalShippingById(id) {
		return this.legalEntityEndpont.getInternationalShippingById(id);
	}
	updateInternationalShipping(data) {
		return this.legalEntityEndpont.updateInternationalShipping(data);
	}

	//updateInternationalShipping(data: any) {
	//	return this.legalEntityEndpont.updateInternationalShipping(data, data.legalEntityInternationalShippingId);
	//}
	postInternationalShipVia(data) {
		return this.legalEntityEndpont.postInternationalShipVia(data);
	}

	getShipViaByInternationalShippingId(id, pageIndex, pageSize) {
		return this.legalEntityEndpont.getShipViaByInternationalShippingId(id, pageIndex, pageSize);
	}

	postInternationalShippingPost(data) {
		return this.legalEntityEndpont.postInternationalShippingPost(data);
	}

	updateStatusForInternationalShippings(id, status, updatedBy) {
		return this.legalEntityEndpont.updateStatusForInternationalShipping(id, status, updatedBy)
	}
	updateStatusForInternationalShippingsVia(id, status, updatedBy) {
		return this.legalEntityEndpont.updateStatusForInternationalShippingVia(id, status, updatedBy)
	}

	deleteInternationalShipViaId(id, updatedBy) {
		return this.legalEntityEndpont.deleteInternationalShipViaId(id, updatedBy)
	}
	deleteShipViaDetails(id, updatedBy) {
		return this.legalEntityEndpont.deleteShipViaDetails(id, updatedBy)
	}
	deleteInternationalShipping(id, updatedBy) {
		return this.legalEntityEndpont.deleteInternationalShipping(id, updatedBy)
	}
	toGetUploadDocumentsList(attachmentId, legalEntityId, moduleId) {
		return this.legalEntityEndpont.GetUploadDocumentsList(attachmentId, legalEntityId, moduleId);
	}

	getCustomerContactAuditDetails1(customerContactId, customerId) {
		return this.legalEntityEndpont.getCustomerContactAuditDetails1<any>(customerContactId, customerId)
	}

	getDocumentList(legalEntityId,deleetdStatus) {
		return this.legalEntityEndpont.getDocumentList(legalEntityId,deleetdStatus)
	}
	restoreDocumentLegal(id:any,updatedBy){
		return this.legalEntityEndpont.restoreDocumentLegal(id, updatedBy)
	}
	restoreCOntact(id:any,updatedBy){
		return this.legalEntityEndpont.restoreCOntact(id, updatedBy)
	}
	documentUploadAction(action: any) {
		return this.legalEntityEndpont.getDocumentUploadEndpoint<any>(action);
	}

	deleteDocumentListbyId(legalEntityDocumentId) {
		return this.legalEntityEndpont.getdeleteDocumentListbyId(legalEntityDocumentId)
	}
	getlegalEntityDocumentHistory(id, legalEntityId) {
		return this.legalEntityEndpont.getLegalEntityDocumentAuditHistory(id, legalEntityId)
	}
	newBillingAdd(action: any) {
		return this.legalEntityEndpont.getNewBillinginfo<any>(action);
	}

	updateBillinginfo(legalEntityBilling: any) {
		return this.legalEntityEndpont.updateBillingViainfo(legalEntityBilling, legalEntityBilling.legalEntityBillingAddressId);
	}

	getlegalEntityBillingHistory(entityId, legalEntityBillingAddressId) {
		return this.legalEntityEndpont.getlegalEntityBillingHistory(entityId, legalEntityBillingAddressId)
	}
	legalEntitysBillingUpdateforActive(id, status, updatedBy) {
		return this.legalEntityEndpont.LegalEntityBillingUpdateforActive(id, status, updatedBy)
	}
	updateDeleteBillinginfo(legalEntityBillingAddressId, name) {
		return this.legalEntityEndpont.deleteBillingAddress(legalEntityBillingAddressId, name);
	}
	BillingFileUpload(file, legalEntityId) {
		return this.legalEntityEndpont.LegalEntityBillingFileUpload(file, legalEntityId);
	}

	getGeneralObj() {
		return Observable.forkJoin(
			this.legalEntityEndpont.getGeneralrobj<any>());
	}

	getEntityList() {
		return Observable.forkJoin(
			this.legalEntityEndpont.getLegalEntityEndpontService<any[]>());
	}

	//getEntityList(serverSidePagesData: any) {
	//	return Observable.forkJoin(
	//		this.legalEntityEndpont.SearchData<any[]>(serverSidePagesData));
	//}

	getEntityLists(data) {
		return Observable.forkJoin(
		 this.legalEntityEndpont.SearchData(data));
	}

	getEntityDataById(entityId) {
		return this.legalEntityEndpont.getEntityDataById(entityId);
	}
	getBankingApisData(entityId) {
		return this.legalEntityEndpont.getBankingApisData(entityId);
	}
	
	getMSHistoryDataById(msID) {
		return this.legalEntityEndpont.getMSHistoryDataById(msID);
	}
	

	updateEntityDetails(action: any) {
		return this.legalEntityEndpont.updateEntityListDetails<any>(action);
	}

	getCountrylist() {
		return Observable.forkJoin(
			this.legalEntityEndpont.getcountryListEndpoint<any[]>());
	}

	getManagemententity(masterCompanyId?) {
		return Observable.forkJoin(
			this.legalEntityEndpont.getManagemtentEntityData<any[]>(masterCompanyId));
    }

    getManagemtentLengalEntityData() {
        return Observable.forkJoin(
            this.legalEntityEndpont.getManagemtentLengalEntityData<any[]>());
	}
	loadParentEntities() {
		return Observable.forkJoin(
			this.legalEntityEndpont.loadParentEntities<any[]>());
	}
	getLedgerNamesData() {
		return Observable.forkJoin(
			this.legalEntityEndpont.getLedgerNamesData<any[]>());
	}
	getEntityforEdit() {
		return Observable.forkJoin(
			this.legalEntityEndpont.getEntityforEdit<any[]>());
	}
	newAddEntity(action: any) {
		return this.legalEntityEndpont.getNewLegalEntityEndpontService<any>(action);
	}
	getmanagementPost(action: any) {
		return this.legalEntityEndpont.getmanagementPost<any>(action);
	}

	checkEntityEditmode(val) {
		this.isEntityEditMode.next(val);
	}

	updateEntity(action: any) {
		return this.legalEntityEndpont.getUpdateLegalEntityEndpontService(action, action.legalEntityId);
	}
	updateLegalEntity(action: any) {
		return this.legalEntityEndpont.updateLegalEntityEndpointService(action, action.legalEntityId);
	}
	updateEntitydelete(action: any) {
		return this.legalEntityEndpont.getDeleteActionEndpoint1(action);
	}
	updateManagementEntity(action: any) {
		return this.legalEntityEndpont.updateManagement(action);
	}
	delete(action: any) {
		return this.legalEntityEndpont.getDeleteActionEndpoint(action);
	}

	restore(action: any) {
		return this.legalEntityEndpont.getrestoreActionEndpoint(action);
	}
	deleteEntity(actionId: number) {
		return this.legalEntityEndpont.getDeleteLegalEntityEndpontService(actionId);
    }
    getContacts(data) {
        return Observable.forkJoin(
            this.legalEntityEndpont.getContcatDetails<any>(data));
	}
	getBillingList(data) {
        return Observable.forkJoin(
            this.legalEntityEndpont.getBillingList<any>(data));
    }
	getDomesticShipList(data) {
        return Observable.forkJoin(
            this.legalEntityEndpont.getDomesticShipList<any>(data));
	}
	getDomesticShipViaList(data) {
        return Observable.forkJoin(
            this.legalEntityEndpont.getDomesticShipViaList<any>(data));
	}
	getinternationalShippingData(data) {
        return Observable.forkJoin(
            this.legalEntityEndpont.getinternationalShippingData<any>(data));
	}
	getInternationalShipViaList(data) {
        return Observable.forkJoin(
            this.legalEntityEndpont.getInternationalShipViaList<any>(data));
    }
	getFileSystem() {
		//debugger;
		let obj: any = {
			"data":
				[
					{
						"data": {
							"name": "Documents",
							"size": "75kb",
							"type": "Folder"
						},
						"children": [
							{
								"data": {
									"name": "Work",
									"size": "55kb",
									"type": "Folder"
								},
								"children": [
									{
										"data": {
											"name": "Expenses.doc",
											"size": "30kb",
											"type": "Document"
										}
									},
									{
										"data": {
											"name": "Resume.doc",
											"size": "25kb",
											"type": "Resume"
										}
									}
								]
							},
							{
								"data": {
									"name": "Home",
									"size": "20kb",
									"type": "Folder"
								},
								"children": [
									{
										"data": {
											"name": "Invoices",
											"size": "20kb",
											"type": "Text"
										}
									}
								]
							}
						]
					},
					{
						"data": {
							"name": "Pictures",
							"size": "150kb",
							"type": "Folder"
						},
						"children": [
							{
								"data": {
									"name": "barcelona.jpg",
									"size": "90kb",
									"type": "Picture"
								}
							},
							{
								"data": {
									"name": "primeui.png",
									"size": "30kb",
									"type": "Picture"
								}
							},
							{
								"data": {
									"name": "optimus.jpg",
									"size": "30kb",
									"type": "Picture"
								}
							}
						]
					}
				]
		}
		return obj.data;
	}

	historyEntity(actionId: number) {
		return Observable.forkJoin(this.legalEntityEndpont.getHistoryLegalEntityEndpontService<AuditHistory[]>(actionId));
    }

    getEntityAccounts(entityId: number) {
        return Observable.forkJoin(this.legalEntityEndpont.getAccountsInfoById<any>(entityId));
    }


    updateLegalEntityForActive(action: any) {
        return this.legalEntityEndpont.getUpdateLegalEntityActive(action, action.legalEntityId);
	}
	
	getLegalEntityAddressById(entityId: number) {
        return Observable.forkJoin(this.legalEntityEndpont.getLegalEntityAddressById<any>(entityId));
	}
	
	uploadLegalEntityLogo(action: any) {
        return this.legalEntityEndpont.uploadLegalEntityLogoEndpoint<any>(action);
	}
	
	updateLegalEntityStatus(id, status, updatedBy) {
        return this.legalEntityEndpont.updateLegalEntityStatus(id, status, updatedBy);
	}

	newAddContactInfo(contact: any) { 
        return this.legalEntityEndpont.getNewLegalEntityContactInfo<any>(contact);
	}
	
	newAddLegalEntityContact(Customer: any) {
        return this.legalEntityEndpont.addLegalEntityContactDetails<any>(Customer);
	}

	restorebillingRecord(id:any,user){
		return this.legalEntityEndpont.restorebillingRecord<any>(id,user);
	}
	restoreDomesticShippingRecord(id:any,user){
		return this.legalEntityEndpont.restoreDomesticShippingRecord<any>(id,user);
	}
	newAddlockboxEntity(action: any) {
		return this.legalEntityEndpont.getNewlockboxLegalEntityEndpontService<any>(action);    
	}

	

	getNewdomesticwireLegalEntity(action: any) {
		return this.legalEntityEndpont.getNewdomesticwireLegalEntityEndpontService<any>(action);
	}


	getNewinternationalwireLegalEntity(action: any) {
		return this.legalEntityEndpont.getNewinternationaLegalEntityEndpontService<any>(action);
	}

	getNewACHLegalEntity(action: any) {
		return this.legalEntityEndpont.getNewACHLegalEntityEndpontService<any>(action);
	}




	getEntityLockboxDataById(entityId) {
		return this.legalEntityEndpont.getEntityLockboxDataById(entityId);
	}
	getEntityDomesticDataById(entityId) {
		return this.legalEntityEndpont.getEntityDomesticDataById(entityId);
	}
	getEntityInternalDataById(entityId) {
		return this.legalEntityEndpont.getEntityInternationalDataById(entityId);
	}
	getEntityAchDataById(entityId) {
		return this.legalEntityEndpont.getEntityACHDataById(entityId);
	}
	getLegalEntityContactById(contactId) {
		return this.legalEntityEndpont.getLegalEntityContactById(contactId);
	}
	updateLegalEntityLockbox(action: any) {
		return this.legalEntityEndpont.updateLegalLockbox(action);
	}


	updateLegalDomestic(action: any) {
		return this.legalEntityEndpont.updateLegalDomestic(action);
	}


	updateLegalInternational(action: any) {
		return this.legalEntityEndpont.updateLegalInternational(action);
	}


	updateLegalACH(action: any) {
		return this.legalEntityEndpont.updateLegalACH(action);
	}


	getLeaglEntityHistory(customerId) {
		return this.legalEntityEndpont.getLegalEntityHistory(customerId)
	}


	deleteLogo(action: any) {
		return this.legalEntityEndpont.getDeleteActionEndpointLogo(action);
	}

	getGlobalSearch(data) {

		return this.legalEntityEndpont.getGlobalEntityRecords<any>(data);
	}


	getLeaglEntityHistoryById(legalEntityId) {
		return this.legalEntityEndpont.getLegalEntityHistoryById(legalEntityId)
	}
	updateLegalEntityContact(obj) {
		return this.legalEntityEndpont.updateContact(obj)
	}
	updateLegalEntitytContactStatus(obj) {
		return this.legalEntityEndpont.updateLegalEntitytContactStatus(obj)
	}
	getLegalEntityContactHistoryById(legalentitycontactId,legalentityId) {
		return this.legalEntityEndpont.getLegalEntityContactHistoryById(legalentitycontactId,legalentityId)
	}
	deleteLegalEntityContact(conatctId,updatedBy){
		return this.legalEntityEndpont.deleteLegalEntityContact(conatctId,updatedBy)
	}
	
	getLeaglLockBoxHistory(legalEntityId) {
		return this.legalEntityEndpont.getLeaglLockBoxHistory(legalEntityId)
	}
	getLeaglDomesticHistory(legalEntityId) {
		return this.legalEntityEndpont.getLeaglDomesticHistory(legalEntityId)
	}
	getLeaglInternationalHistory(legalEntityId) {
		return this.legalEntityEndpont.getLeaglInternationalHistory(legalEntityId)
	}
	getLeaglAchHistory(legalEntityId) {
		return this.legalEntityEndpont.getLeaglAchHistory(legalEntityId)
	}
}

