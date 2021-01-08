"use strict";
// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LegalEntityService = void 0;
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/observable/forkJoin");
require("rxjs/add/operator/do");
require("rxjs/add/operator/map");
var rxjs_1 = require("rxjs");
var LegalEntityService = /** @class */ (function () {
    function LegalEntityService(router, http, authService, legalEntityEndpont) {
        this.router = router;
        this.http = http;
        this.authService = authService;
        this.legalEntityEndpont = legalEntityEndpont;
        this._rolesChanged = new Subject_1.Subject();
        this.ShowPtab = true;
        this.currentUrl = this.router.url;
        this.bredcrumbObj = new Subject_1.Subject();
        this.alertObj = new Subject_1.Subject();
        this.indexObj = new Subject_1.Subject();
        this.enableExternal = false;
        this.isEntityEditMode = new rxjs_1.BehaviorSubject(false);
        this.currentEditModeStatus = this.isEntityEditMode.asObservable();
        this.isReset = false;
        this.activeStep = new Subject_1.Subject();
    }
    LegalEntityService.prototype.changeofTab = function (activeIndex) {
        this.activeStep.next(activeIndex);
    };
    LegalEntityService.prototype.newShippingAdd = function (action) {
        return this.legalEntityEndpont.getNewShipppinginfo(action);
    };
    LegalEntityService.prototype.updateshippinginfo = function (legalEntityshipping) {
        return this.legalEntityEndpont.updateShippinginfo(legalEntityshipping, legalEntityshipping.legalEntityShippingAddressId);
    };
    LegalEntityService.prototype.updateStatusHipping = function (legalEntityshipping) {
        return this.legalEntityEndpont.updateStatusShippinginfo(legalEntityshipping, legalEntityshipping.legalEntityShippingAddressId);
    };
    LegalEntityService.prototype.getlegalEntityShipAddressGet = function (legalEntityId) {
        return Observable_1.forkJoin(this.legalEntityEndpont.getCusHippingaddresdetails(legalEntityId));
    };
    LegalEntityService.prototype.getlegalEntityShipAddressGetWIthAddressId = function (legalEntityId) {
        return Observable_1.forkJoin(this.legalEntityEndpont.getCusHippingaddresdetailswithid(legalEntityId));
    };
    LegalEntityService.prototype.ShippingFileUpload = function (file, legalEntityId) {
        return this.legalEntityEndpont.legalEntityShippingFileUpload(file, legalEntityId);
    };
    LegalEntityService.prototype.InternationalShippingUpload = function (file, legalEntityId) {
        return this.legalEntityEndpont.legalEntityInternationalShippingFileUpload(file, legalEntityId);
    };
    LegalEntityService.prototype.getlegalEntityShippingHistory = function (legalEntityId, legalEntityShippingAddressId) {
        return this.legalEntityEndpont.getlegalEntityShippingHistory(legalEntityId, legalEntityShippingAddressId);
    };
    LegalEntityService.prototype.getlegalEntityInterShippingHistory = function (legalEntityId, legalEntityInterShippingId) {
        return this.legalEntityEndpont.getlegalEntityInterShippingHistory(legalEntityId, legalEntityInterShippingId);
    };
    LegalEntityService.prototype.getlegalEntityShipViaHistory = function (legalEntityId, legalEntityShippingAddressId, legalEntityShippingId) {
        return this.legalEntityEndpont.getlegalEntityShipViaHistory(legalEntityId, legalEntityShippingAddressId, legalEntityShippingId);
    };
    LegalEntityService.prototype.getlegalEntityInterShipViaHistory = function (legalEntityId, internationalShippingId, shippingViaDetailsId) {
        return this.legalEntityEndpont.getlegalEntityInterShipViaHistory(legalEntityId, internationalShippingId, shippingViaDetailsId);
    };
    LegalEntityService.prototype.updateStatusForShippingDetails = function (id, status, updatedBy) {
        return this.legalEntityEndpont.updateStatusForShippingDetails(id, status, updatedBy);
    };
    LegalEntityService.prototype.Shippingdetailsviastatus = function (id, status, updatedBy) {
        return this.legalEntityEndpont.Shippingdetailsviastatus(id, status, updatedBy);
    };
    LegalEntityService.prototype.getInternationalShipViaByInternationalShippingId = function (legalEntityInternationalShippingId) {
        return this.legalEntityEndpont.getInternationalShipViaByInternationalShippingId(legalEntityInternationalShippingId);
    };
    LegalEntityService.prototype.getShipViaByDomesticShippingId = function (legalEntityShippingId) {
        return this.legalEntityEndpont.getShipViaByDomesticShippingId(legalEntityShippingId);
    };
    LegalEntityService.prototype.updateshippingViainfo = function (legalEntityshipping) {
        return this.legalEntityEndpont.updateShippingViainfo(legalEntityshipping, legalEntityshipping.legalEntityShippingId);
    };
    LegalEntityService.prototype.newShippingViaAdd = function (action) {
        return this.legalEntityEndpont.postDomesticShipVia(action);
    };
    LegalEntityService.prototype.updateShipViaInternational = function (data) {
        return this.legalEntityEndpont.updateShipViaInternational(data);
    };
    LegalEntityService.prototype.getInternationalShippingById = function (id) {
        return this.legalEntityEndpont.getInternationalShippingById(id);
    };
    LegalEntityService.prototype.updateInternationalShipping = function (data) {
        return this.legalEntityEndpont.updateInternationalShipping(data);
    };
    //updateInternationalShipping(data: any) {
    //	return this.legalEntityEndpont.updateInternationalShipping(data, data.legalEntityInternationalShippingId);
    //}
    LegalEntityService.prototype.postInternationalShipVia = function (data) {
        return this.legalEntityEndpont.postInternationalShipVia(data);
    };
    LegalEntityService.prototype.getShipViaByInternationalShippingId = function (id, pageIndex, pageSize) {
        return this.legalEntityEndpont.getShipViaByInternationalShippingId(id, pageIndex, pageSize);
    };
    LegalEntityService.prototype.postInternationalShippingPost = function (data) {
        return this.legalEntityEndpont.postInternationalShippingPost(data);
    };
    LegalEntityService.prototype.getInternationalShippingBylegalEntityId = function (legalEntityId) {
        return this.legalEntityEndpont.getInternationalShippingBylegalEntityId(legalEntityId);
    };
    LegalEntityService.prototype.updateStatusForInternationalShippings = function (id, status, updatedBy) {
        return this.legalEntityEndpont.updateStatusForInternationalShipping(id, status, updatedBy);
    };
    LegalEntityService.prototype.updateStatusForInternationalShippingsVia = function (id, status, updatedBy) {
        return this.legalEntityEndpont.updateStatusForInternationalShippingVia(id, status, updatedBy);
    };
    LegalEntityService.prototype.deleteInternationalShipViaId = function (id, updatedBy) {
        return this.legalEntityEndpont.deleteInternationalShipViaId(id, updatedBy);
    };
    LegalEntityService.prototype.deleteShipViaDetails = function (id, updatedBy) {
        return this.legalEntityEndpont.deleteShipViaDetails(id, updatedBy);
    };
    LegalEntityService.prototype.deleteInternationalShipping = function (id, updatedBy) {
        return this.legalEntityEndpont.deleteInternationalShipping(id, updatedBy);
    };
    LegalEntityService.prototype.toGetUploadDocumentsList = function (attachmentId, legalEntityId, moduleId) {
        return this.legalEntityEndpont.GetUploadDocumentsList(attachmentId, legalEntityId, moduleId);
    };
    LegalEntityService.prototype.getCustomerContactAuditDetails1 = function (customerContactId, customerId) {
        return this.legalEntityEndpont.getCustomerContactAuditDetails1(customerContactId, customerId);
    };
    LegalEntityService.prototype.getDocumentList = function (legalEntityId) {
        return this.legalEntityEndpont.getDocumentList(legalEntityId);
    };
    LegalEntityService.prototype.documentUploadAction = function (action) {
        return this.legalEntityEndpont.getDocumentUploadEndpoint(action);
    };
    LegalEntityService.prototype.deleteDocumentListbyId = function (legalEntityDocumentId) {
        return this.legalEntityEndpont.getdeleteDocumentListbyId(legalEntityDocumentId);
    };
    LegalEntityService.prototype.getlegalEntityDocumentHistory = function (id, legalEntityId) {
        return this.legalEntityEndpont.getLegalEntityDocumentAuditHistory(id, legalEntityId);
    };
    LegalEntityService.prototype.newBillingAdd = function (action) {
        return this.legalEntityEndpont.getNewBillinginfo(action);
    };
    LegalEntityService.prototype.updateBillinginfo = function (legalEntityBilling) {
        return this.legalEntityEndpont.updateBillingViainfo(legalEntityBilling, legalEntityBilling.legalEntityBillingAddressId);
    };
    LegalEntityService.prototype.getlegalEntityBillingHistory = function (entityId, legalEntityBillingAddressId) {
        return this.legalEntityEndpont.getlegalEntityBillingHistory(entityId, legalEntityBillingAddressId);
    };
    LegalEntityService.prototype.legalEntitysBillingUpdateforActive = function (id, status, updatedBy) {
        return this.legalEntityEndpont.LegalEntityBillingUpdateforActive(id, status, updatedBy);
    };
    LegalEntityService.prototype.updateDeleteBillinginfo = function (legalEntityBillingAddressId, name) {
        return this.legalEntityEndpont.deleteBillingAddress(legalEntityBillingAddressId, name);
    };
    LegalEntityService.prototype.BillingFileUpload = function (file, legalEntityId) {
        return this.legalEntityEndpont.LegalEntityBillingFileUpload(file, legalEntityId);
    };
    LegalEntityService.prototype.getGeneralObj = function () {
        return Observable_1.forkJoin(this.legalEntityEndpont.getGeneralrobj());
    };
    LegalEntityService.prototype.getEntityList = function () {
        return Observable_1.forkJoin(this.legalEntityEndpont.getLegalEntityEndpontService());
    };
    //getEntityList(serverSidePagesData: any) {
    //	return forkJoin(
    //		this.legalEntityEndpont.SearchData<any[]>(serverSidePagesData));
    //}
    LegalEntityService.prototype.getEntityLists = function (data) {
        return Observable_1.forkJoin(this.legalEntityEndpont.SearchData(data));
    };
    LegalEntityService.prototype.getEntityDataById = function (entityId) {
        return this.legalEntityEndpont.getEntityDataById(entityId);
    };
    LegalEntityService.prototype.getMSHistoryDataById = function (msID) {
        return this.legalEntityEndpont.getMSHistoryDataById(msID);
    };
    LegalEntityService.prototype.updateEntityDetails = function (action) {
        return this.legalEntityEndpont.updateEntityListDetails(action);
    };
    LegalEntityService.prototype.getCountrylist = function () {
        return Observable_1.forkJoin(this.legalEntityEndpont.getcountryListEndpoint());
    };
    LegalEntityService.prototype.getManagemententity = function () {
        return Observable_1.forkJoin(this.legalEntityEndpont.getManagemtentEntityData());
    };
    LegalEntityService.prototype.getManagemtentLengalEntityData = function () {
        return Observable_1.forkJoin(this.legalEntityEndpont.getManagemtentLengalEntityData());
    };
    LegalEntityService.prototype.loadParentEntities = function () {
        return Observable_1.forkJoin(this.legalEntityEndpont.loadParentEntities());
    };
    LegalEntityService.prototype.getLedgerNamesData = function () {
        return Observable_1.forkJoin(this.legalEntityEndpont.getLedgerNamesData());
    };
    LegalEntityService.prototype.getEntityforEdit = function () {
        return Observable_1.forkJoin(this.legalEntityEndpont.getEntityforEdit());
    };
    LegalEntityService.prototype.newAddEntity = function (action) {
        return this.legalEntityEndpont.getNewLegalEntityEndpontService(action);
    };
    LegalEntityService.prototype.getmanagementPost = function (action) {
        return this.legalEntityEndpont.getmanagementPost(action);
    };
    LegalEntityService.prototype.checkEntityEditmode = function (val) {
        this.isEntityEditMode.next(val);
    };
    LegalEntityService.prototype.updateEntity = function (action) {
        return this.legalEntityEndpont.getUpdateLegalEntityEndpontService(action, action.legalEntityId);
    };
    LegalEntityService.prototype.updateLegalEntity = function (action) {
        return this.legalEntityEndpont.updateLegalEntityEndpointService(action, action.legalEntityId);
    };
    LegalEntityService.prototype.updateEntitydelete = function (action) {
        return this.legalEntityEndpont.getDeleteActionEndpoint1(action);
    };
    LegalEntityService.prototype.updateManagementEntity = function (action) {
        return this.legalEntityEndpont.updateManagement(action);
    };
    LegalEntityService.prototype["delete"] = function (action) {
        return this.legalEntityEndpont.getDeleteActionEndpoint(action);
    };
    LegalEntityService.prototype.deleteEntity = function (actionId) {
        return this.legalEntityEndpont.getDeleteLegalEntityEndpontService(actionId);
    };
    LegalEntityService.prototype.getContacts = function (id) {
        return Observable_1.forkJoin(this.legalEntityEndpont.getContcatDetails(id));
    };
    LegalEntityService.prototype.getEntityBillViaDetails = function (id) {
        return Observable_1.forkJoin(this.legalEntityEndpont.getEntityBillViaDetails(id));
    };
    LegalEntityService.prototype.getFileSystem = function () {
        //debugger;
        var obj = {
            "data": [
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
        };
        return obj.data;
    };
    LegalEntityService.prototype.historyEntity = function (actionId) {
        return Observable_1.forkJoin(this.legalEntityEndpont.getHistoryLegalEntityEndpontService(actionId));
    };
    LegalEntityService.prototype.getEntityAccounts = function (entityId) {
        return Observable_1.forkJoin(this.legalEntityEndpont.getAccountsInfoById(entityId));
    };
    LegalEntityService.prototype.updateLegalEntityForActive = function (action) {
        return this.legalEntityEndpont.getUpdateLegalEntityActive(action, action.legalEntityId);
    };
    LegalEntityService.prototype.getLegalEntityAddressById = function (entityId) {
        return Observable_1.forkJoin(this.legalEntityEndpont.getLegalEntityAddressById(entityId));
    };
    LegalEntityService.prototype.uploadLegalEntityLogo = function (action) {
        return this.legalEntityEndpont.uploadLegalEntityLogoEndpoint(action);
    };
    LegalEntityService.prototype.updateLegalEntityStatus = function (id, status, updatedBy) {
        return this.legalEntityEndpont.updateLegalEntityStatus(id, status, updatedBy);
    };
    LegalEntityService.prototype.newAddContactInfo = function (contact) {
        return this.legalEntityEndpont.getNewLegalEntityContactInfo(contact);
    };
    LegalEntityService.prototype.newAddLegalEntityContact = function (Customer) {
        return this.legalEntityEndpont.addLegalEntityContactDetails(Customer);
    };
    LegalEntityService.prototype.newAddlockboxEntity = function (action) {
        return this.legalEntityEndpont.getNewlockboxLegalEntityEndpontService(action);
    };
    LegalEntityService.prototype.getNewdomesticwireLegalEntity = function (action) {
        return this.legalEntityEndpont.getNewdomesticwireLegalEntityEndpontService(action);
    };
    LegalEntityService.prototype.getNewinternationalwireLegalEntity = function (action) {
        return this.legalEntityEndpont.getNewinternationaLegalEntityEndpontService(action);
    };
    LegalEntityService.prototype.getNewACHLegalEntity = function (action) {
        return this.legalEntityEndpont.getNewACHLegalEntityEndpontService(action);
    };
    LegalEntityService.prototype.getEntityLockboxDataById = function (entityId) {
        return this.legalEntityEndpont.getEntityLockboxDataById(entityId);
    };
    LegalEntityService.prototype.getEntityDomesticDataById = function (entityId) {
        return this.legalEntityEndpont.getEntityDomesticDataById(entityId);
    };
    LegalEntityService.prototype.getEntityInternalDataById = function (entityId) {
        return this.legalEntityEndpont.getEntityInternationalDataById(entityId);
    };
    LegalEntityService.prototype.getEntityAchDataById = function (entityId) {
        return this.legalEntityEndpont.getEntityACHDataById(entityId);
    };
    LegalEntityService.prototype.updateLegalEntityLockbox = function (action) {
        return this.legalEntityEndpont.updateLegalLockbox(action);
    };
    LegalEntityService.prototype.updateLegalDomestic = function (action) {
        return this.legalEntityEndpont.updateLegalDomestic(action);
    };
    LegalEntityService.prototype.updateLegalInternational = function (action) {
        return this.legalEntityEndpont.updateLegalInternational(action);
    };
    LegalEntityService.prototype.updateLegalACH = function (action) {
        return this.legalEntityEndpont.updateLegalACH(action);
    };
    LegalEntityService.prototype.getLeaglEntityHistory = function (customerId) {
        return this.legalEntityEndpont.getLegalEntityHistory(customerId);
    };
    LegalEntityService.prototype.deleteLogo = function (action) {
        return this.legalEntityEndpont.getDeleteActionEndpointLogo(action);
    };
    LegalEntityService.prototype.getGlobalSearch = function (data) {
        return this.legalEntityEndpont.getGlobalEntityRecords(data);
    };
    LegalEntityService.prototype.getLeaglEntityHistoryById = function (legalEntityId) {
        return this.legalEntityEndpont.getLegalEntityHistoryById(legalEntityId);
    };
    LegalEntityService.roleAddedOperation = "add";
    LegalEntityService.roleDeletedOperation = "delete";
    LegalEntityService.roleModifiedOperation = "modify";
    LegalEntityService = __decorate([
        core_1.Injectable()
    ], LegalEntityService);
    return LegalEntityService;
}());
exports.LegalEntityService = LegalEntityService;
