"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LegalEntityEndpontService = void 0;
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
var endpoint_factory_service_1 = require("./endpoint-factory.service");
var LegalEntityEndpontService = /** @class */ (function (_super) {
    __extends(LegalEntityEndpontService, _super);
    function LegalEntityEndpontService(http, configurations, injector) {
        var _this = _super.call(this, http, configurations, injector) || this;
        _this._entityurl = "/api/legalEntity/Get";
        _this._managementUrl = "/api/ManagementStrcture/ManagementGet";
        _this._managementLegalUrl = "/api/ManagementStrcture/ManagementGetView";
        _this._parentEntityUrl = "/api/legalEntity/ParentEntities";
        _this._ledgerUrl = "/api/ManagementStrcture/LedgerNames";
        _this._entityediturl = "/api/legalEntity/GetforEdit";
        _this._entityUrlNew = "/api/legalEntity/legalEntitypost";
        _this._customerContactHistory1 = '/api/legalEntity/Legalcontactauditdetails';
        //create
        _this._entityUrlNewlockbox = "/api/legalEntity/LegalEntityBankingLockBoxPost";
        _this._entityUrlNewdomestic = "/api/legalEntity/legalEntityDomesticPayment";
        _this._entityUrlNewinternationalwire = "/api/legalEntity/LegalEntityInternationalPaymentCreate";
        _this._entityUrlNewACH = "/api/legalEntity/LegalEntityBankingACHPost";
        //update
        _this._updatelegallockbox = "/api/legalEntity/UpdateLegalEntityBankingLockBox";
        _this._updatelegalDomesticwire = "/api/legalEntity/domesticPaymentUpdate";
        _this._updatelegalInternalwire = "/api/legalEntity/LegalEntityInternationalPaymentUPdate";
        _this._updatelegalACH = "/api/legalEntity/LegalEntityBankingACHUpdate";
        //get list by legal entity id
        _this._customerHistory = "/api/legalEntity/GetLegalEntityAuditHistoryByid";
        //private readonly _entityUrlNewdomesticList: string = "/api/legalEntity/getEntityDomesticWireById"; 
        //private readonly _entityUrlNewinternationalwireList: string = "/api/legalEntity/getEntityInternationalWireById"; 
        //private readonly _entityUrlNewACHList: string = "/api/legalEntity/getEntityACHById"; 
        _this._legalEntityHistory = "/api/legalEntity/legalEntityHistoryById";
        _this._managementposturl = "/api/ManagementStrcture/managementEntitypost";
        _this._deleteLegalEntity = "/api/legalEntity/deleteLegalEntity";
        _this._JobTilesUrlAuditHistory = "/api/legalEntity/auditHistoryById";
        _this.getEntitySetupAccounts = "/api/legalEntity/legalEntityAccountsById";
        _this._activeUrl = "/api/legalEntity/UpdateActive";
        _this.getLegalEntityAddressByIdURL = "/api/legalEntity/legalentityaddressbyid";
        _this._contactUrl = "/api/LegalEntity/legalentitycontacts";
        _this._entityBillViaDetails = "/api/LegalEntity/legalentitybillingaddressbyid";
        _this._countryUrl = "/api/legalEntity/GetcountryList";
        _this._entityUpdateUrl = "/api/LegalEntity/UpdateLegalEntityDetails";
        _this._generalEmptyObjurl = "/api/LegalEntity/generalEmptyObj";
        _this._billingInfoUrl = "/api/LegalEntity/LegalEntityBillingPost";
        _this._updateBillingViaDetails = "/api/LegalEntity/LegalEntityBillAddressdetails";
        _this._legalEntityBillingHistory = "/api/LegalEntity/getLegalEntityBillingHistory";
        _this._legalEntityBillingUpdateforActive = '/api/LegalEntity/legalentitybillingaddressstatus';
        _this._deleteBillingEntityDettilas = "/api/LegalEntity/deletelegalentitybillingaddress";
        _this.excelUpload = "/api/LegalEntity/uploadLegalEntitybillingaddress";
        _this._getlegalEntityDocumentAttachmentslist = "/api/FileUpload/getattachmentdetails";
        _this._addDocumentDetails = '/api/LegalEntity/LegalEntityFinanceDocumentUpload';
        _this._deleteLegalEntityDocuments = '/api/LegalEntity/deleteLegalEntityDocuments';
        _this._getlegalEntityDocumentHistory = "/api/LegalEntity/getLegalEntityDocumentsAudit";
        _this._updateShippingViaDetails = "/api/legalEntity/updateShipViaDetails";
        _this._legalEntityShipAddressdetails = "/api/legalEntity/legalEntityShippingAddressDetails";
        _this._legalEntityShippingUrlNew = "/api/legalEntity/updateStatuslegalEntityShipping";
        _this._getShipViaByShippingId = "/api/legalEntity/GetShipVia";
        _this._getShipViaHistory = "/api/legalEntity/getShipViaHistory";
        _this._shippingInfoUrl = "/api/legalEntity/legalEntityShippingPost";
        _this._saveShipViaDetails = "/api/legalEntity/addShipViaDetails";
        _this._updatshippingAddressDetails = "/api/legalEntity/cusShippingUpdate";
        _this._updateStatuslegalEntityShipping = "/api/legalEntity/updateStatuslegalEntityShipping";
        _this._legalEntityShipViaDetails = "/api/legalEntity/getlegalEntityShipViaDetails";
        _this._cusShippingGeturl = "/api/legalEntity/legalentityshippingaddresslist";
        _this._cusShippingGeturlwithId = "/api/Vendor/cusshippingGetwithid";
        _this._internationalshippingpost = '/api/legalEntity/createinternationalshipping';
        _this._internationalshippingget = '/api/legalEntity/internationalshippingdetaillist';
        _this._internationalstatus = '/api/legalEntity/internationalshippingdetailsstatus';
        _this._internationalShippingDelete = '/api/legalEntity/deleteinternationalshipping';
        _this._internationalshippingdetailsbyid = '/api/legalEntity/internationalshippingdetailsbyid';
        _this._updateinternationalshipping = '/api/legalEntity/updateinternationalshipping';
        _this._createinternationalshippingviadetails = '/api/legalEntity/createintershippingviadetails';
        _this._internationalShipViaList = '/api/legalEntity/getshippingviadetails';
        _this._updateshippingviadetails = '/api/legalEntity/updateintershippingviadetails';
        _this.excelUploadShipping = "/api/legalEntity/uploadlegalEntityshippingaddress";
        _this.excelUploadInterShipping = "/api/legalEntity/uploadlegalEntityinternationalshipping";
        _this._legalEntityShippingHistory = "/api/legalEntity/getlegalEntityShippingHistory";
        _this._legalEntityInterShippingHistory = "/api/legalEntity/GetlegalEntityInternationalShippingAuditHistoryByid";
        _this._legalEntityShipViaHistory = "/api/legalEntity/GetShipViaAudit";
        _this._legalEntityInterShipViaHistory = "/api/legalEntity/getauditshippingviadetailsbyid";
        _this._deleteInternationalShippingViaMapUrl = '/api/legalEntity/deleteintershippingviadetails';
        _this._deleteShipVia = '/api/legalEntity/deleteshipviadetails';
        _this._internationalShipViaByShippingIdList = '/api/legalEntity/getinternationalshippingviadetails';
        _this._addShipViaDetails = '/api/legalEntity/addShipViaDetails';
        _this._shippingDetailsStatus = '/api/legalEntity/shippingdetailsstatus';
        _this._shippingdetailsviastatus = '/api/legalEntity/shippingdetailsviastatus';
        _this._uploadlegalEntityLogo = '/api/legalentity/LegalEntityLogoUplodad';
        _this.searchUrl = '/api/legalentity/List';
        _this.EntityGlobalSearch = '/api/legalentity/ListGlobalSearch';
        _this.LogogDell = '/api/legalentity/LogoDelete';
        return _this;
    }
    Object.defineProperty(LegalEntityEndpontService.prototype, "cusShippingUrl", {
        get: function () { return this.configurations.baseUrl + this._cusShippingGeturl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "cusShippingUrlwithaddressid", {
        get: function () { return this.configurations.baseUrl + this._cusShippingGeturlwithId; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "entityurl", {
        get: function () { return this.configurations.baseUrl + this._entityurl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "managemententityurl", {
        get: function () { return this.configurations.baseUrl + this._managementUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "managementlengalentityurl", {
        get: function () { return this.configurations.baseUrl + this._managementLegalUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "parentEntityUrl", {
        get: function () { return this.configurations.baseUrl + this._parentEntityUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "ledgerNamesurl", {
        get: function () { return this.configurations.baseUrl + this._ledgerUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "entityediturl", {
        get: function () { return this.configurations.baseUrl + this._entityediturl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "contactUrl", {
        get: function () { return this.configurations.baseUrl + this._contactUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "entityBillViaDetails", {
        get: function () { return this.configurations.baseUrl + this._entityBillViaDetails; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "countryUrl", {
        get: function () { return this.configurations.baseUrl + this._countryUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "generalurl", {
        get: function () { return this.configurations.baseUrl + this._generalEmptyObjurl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "legalEntityBillingUpdateforActive", {
        get: function () { return this.configurations.baseUrl + this._legalEntityBillingUpdateforActive; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "InternationalShippingPost", {
        get: function () { return this.configurations.baseUrl + this._internationalshippingpost; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "InternationalShippingList", {
        get: function () { return this.configurations.baseUrl + this._internationalshippingget; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "InternationalShippingStatus", {
        get: function () { return this.configurations.baseUrl + this._internationalstatus; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "InternationalShippingDelete", {
        get: function () { return this.configurations.baseUrl + this._internationalShippingDelete; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "InternationalShippingById", {
        get: function () { return this.configurations.baseUrl + this._internationalshippingdetailsbyid; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "UpdateInternationalshipping", {
        get: function () { return this.configurations.baseUrl + this._updateinternationalshipping; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "InternationalShipVia", {
        get: function () { return this.configurations.baseUrl + this._createinternationalshippingviadetails; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "ShipViaByInternationalShippingId", {
        get: function () { return this.configurations.baseUrl + this._internationalShipViaList; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "UpdateShipViaInternational", {
        get: function () { return this.configurations.baseUrl + this._updateshippingviadetails; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "deleteShipVia", {
        get: function () { return this.configurations.baseUrl + this._deleteShipVia; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "InternatioanlShipViaByInternationalShippingId", {
        get: function () { return this.configurations.baseUrl + this._internationalShipViaByShippingIdList; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "domesticShipVia", {
        get: function () { return this.configurations.baseUrl + this._addShipViaDetails; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "ShippingDetailsStatus", {
        get: function () { return this.configurations.baseUrl + this._shippingDetailsStatus; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "shippingdetailsviastatus", {
        get: function () { return this.configurations.baseUrl + this._shippingdetailsviastatus; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "serach", {
        get: function () { return this.configurations.baseUrl + this.searchUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "_LogogDell", {
        get: function () { return this.configurations.baseUrl + this.LogogDell; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "_EntityGlobalSearch", {
        get: function () { return this.configurations.baseUrl + this.EntityGlobalSearch; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LegalEntityEndpontService.prototype, "domesticShipVia1", {
        get: function () { return this.configurations.baseUrl + this._getShipViaByShippingId; },
        enumerable: false,
        configurable: true
    });
    LegalEntityEndpontService.prototype.updateShippingViainfo = function (roleObject, legalEntityId) {
        var _this = this;
        var endpointUrl = this._updateShippingViaDetails + "/" + legalEntityId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateShippingViainfo(roleObject, legalEntityId); });
        });
    };
    LegalEntityEndpontService.prototype.updateShippinginfo = function (roleObject, legalEntityId) {
        var _this = this;
        var endpointUrl = this._updatshippingAddressDetails + "/" + roleObject.legalEntityShippingAddressId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateShippinginfo(roleObject, legalEntityId); });
        });
    };
    LegalEntityEndpontService.prototype.updateStatusShippinginfo = function (roleObject, legalEntityId) {
        var _this = this;
        var endpointUrl = this._updateStatuslegalEntityShipping + "/" + roleObject.legalEntityShippingAddressId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateStatusShippinginfo(roleObject, legalEntityId); });
        });
    };
    LegalEntityEndpontService.prototype.getCusHippingaddresdetails = function (legalEntityId) {
        var _this = this;
        var endpointurl = this.cusShippingUrl + "?legalEntityId=" + legalEntityId;
        //let endpointUrl = `${this.entityBillViaDetails}?billingAddressId=${id}`;
        return this.http.get(endpointurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getCusHippingaddresdetails(legalEntityId); });
        });
    };
    LegalEntityEndpontService.prototype.getCusHippingaddresdetailswithid = function (legalEntityId) {
        var _this = this;
        var endpointurl = this.cusShippingUrlwithaddressid + "/" + legalEntityId;
        return this.http.get(endpointurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getlegalEntityEndpoint(); });
        });
    };
    LegalEntityEndpontService.prototype.getlegalEntityEndpoint = function () {
        var _this = this;
        return this.http.get(this._entityUrlNew, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getlegalEntityEndpoint(); });
        });
    };
    LegalEntityEndpontService.prototype.legalEntityShippingFileUpload = function (file, legalEntityId) {
        return this.http.post("" + this.configurations.baseUrl + this.excelUploadShipping + "?legalEntityId=" + legalEntityId, file);
    };
    LegalEntityEndpontService.prototype.legalEntityInternationalShippingFileUpload = function (file, legalEntityId) {
        return this.http.post("" + this.configurations.baseUrl + this.excelUploadInterShipping + "?legalEntityId=" + legalEntityId, file);
    };
    LegalEntityEndpontService.prototype.getlegalEntityShippingHistory = function (legalEntityId, legalEntityShippingAddressId) {
        return this.http.get(this.configurations.baseUrl + "/" + this._legalEntityShippingHistory + "?legalEntityId=" + legalEntityId + "&legalEntityShippingAddressId=" + legalEntityShippingAddressId);
    };
    LegalEntityEndpontService.prototype.getlegalEntityInterShippingHistory = function (legalEntityId, legalEntityInterShippingId) {
        return this.http.get(this.configurations.baseUrl + "/" + this._legalEntityInterShippingHistory + "?legalEntityId=" + legalEntityId + "&internationalShippingId=" + legalEntityInterShippingId);
    };
    LegalEntityEndpontService.prototype.getlegalEntityShipViaHistory = function (legalEntityId, legalEntityShippingAddressId, legalEntityShippingId) {
        return this.http.get(this.configurations.baseUrl + "/" + this._legalEntityShipViaHistory + "?legalEntityId=" + legalEntityId + "&legalEntityShippingAddressId=" + legalEntityShippingAddressId + "&legalEntityShippingId=" + legalEntityShippingId);
    };
    LegalEntityEndpontService.prototype.getlegalEntityInterShipViaHistory = function (legalEntityId, internationalShippingId, shippingViaDetailsId) {
        return this.http.get(this.configurations.baseUrl + "/" + this._legalEntityInterShipViaHistory + "?legalEntityId=" + legalEntityId + "&internationalShippingId=" + internationalShippingId + "&shippingViaDetailsId=" + shippingViaDetailsId);
    };
    LegalEntityEndpontService.prototype.getNewShipppinginfo = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http
            .post(this._shippingInfoUrl, body, this.getRequestHeaders())
            .map(function (res) { return res; })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    LegalEntityEndpontService.prototype.updateStatusForShippingDetails = function (id, status, updatedBy) {
        var _this = this;
        return this.http.get(this.ShippingDetailsStatus + "?id=" + id + "&status=" + status + "&updatedBy=" + updatedBy)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateStatusForShippingDetails(id, status, updatedBy); });
        });
    };
    LegalEntityEndpontService.prototype.Shippingdetailsviastatus = function (id, status, updatedBy) {
        var _this = this;
        return this.http.get(this.shippingdetailsviastatus + "?id=" + id + "&status=" + status + "&updatedBy=" + updatedBy)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.Shippingdetailsviastatus(id, status, updatedBy); });
        });
    };
    LegalEntityEndpontService.prototype.getInternationalShipViaByInternationalShippingId = function (id) {
        var _this = this;
        return this.http.get(this.InternatioanlShipViaByInternationalShippingId + "?legalEntityInternationalShippingId=" + id)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getInternationalShipViaByInternationalShippingId(id); });
        });
    };
    LegalEntityEndpontService.prototype.getShipViaByDomesticShippingId = function (legalEntityShippingId) {
        var _this = this;
        //alert(JSON.stringify(this.domesticShipVia1 + legalEntityShippingId));
        return this.http.get(this.domesticShipVia1 + "/" + legalEntityShippingId)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getShipViaByDomesticShippingId(legalEntityShippingId); });
        });
        //return this.http.get(`${this.configurations.baseUrl}/${this._getShipViaByShippingId}?id=${legalEntityShippingId}`, this.getRequestHeaders())
    };
    LegalEntityEndpontService.prototype.postDomesticShipVia = function (postData) {
        var _this = this;
        return this.http.post(this.domesticShipVia, JSON.stringify(postData), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.postDomesticShipVia(postData); });
        });
    };
    LegalEntityEndpontService.prototype.updateShipViaInternational = function (postData) {
        var _this = this;
        //alert(postData);
        return this.http.post(this.UpdateShipViaInternational, JSON.stringify(postData), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateShipViaInternational(postData); });
        });
    };
    //updateShipViaInternational<T>(roleObject: any, legalEntityId: any): Observable<T> {
    //	let endpointUrl = `${this.UpdateShipViaInternational}/${legalEntityId}`;
    //	return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
    //		.catch(error => {
    //			return this.handleError(error, () => this.updateShipViaInternational(roleObject, legalEntityId));
    //		});
    //}
    LegalEntityEndpontService.prototype.getShipViaByInternationalShippingId = function (id, pageIndex, pageSize) {
        var _this = this;
        return this.http.get(this.ShipViaByInternationalShippingId + "?internationalShippingId=" + id + "&pageNumber=" + pageIndex + "&pageSize=" + pageSize)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getShipViaByInternationalShippingId(id, pageIndex, pageSize); });
        });
    };
    LegalEntityEndpontService.prototype.postInternationalShipVia = function (postData) {
        var _this = this;
        return this.http.post(this.InternationalShipVia, JSON.stringify(postData), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.postInternationalShipVia(postData); });
        });
    };
    LegalEntityEndpontService.prototype.updateInternationalShipping = function (postData) {
        var _this = this;
        return this.http.post(this.UpdateInternationalshipping, JSON.stringify(postData), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateInternationalShipping(postData); });
        });
    };
    LegalEntityEndpontService.prototype.getInternationalShippingById = function (id) {
        var _this = this;
        return this.http.get(this.InternationalShippingById + "?id=" + id)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getInternationalShippingById(id); });
        });
    };
    LegalEntityEndpontService.prototype.deleteInternationalShipping = function (id, updatedBy) {
        var _this = this;
        return this.http.get(this.InternationalShippingDelete + "?id=" + id + "&updatedBy=" + updatedBy)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.deleteInternationalShipping(id, updatedBy); });
        });
    };
    LegalEntityEndpontService.prototype.updateStatusForInternationalShipping = function (id, status, updatedBy) {
        var _this = this;
        return this.http.get(this.InternationalShippingStatus + "?id=" + id + "&status=" + status + "&updatedBy=" + updatedBy)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateStatusForInternationalShipping(id, status, updatedBy); });
        });
    };
    LegalEntityEndpontService.prototype.updateStatusForInternationalShippingVia = function (id, status, updatedBy) {
        return this.http.get(this.configurations.baseUrl + "/api/legalEntity/intershippingviadetailsstatus?id=" + id + "&status=" + status + "&updatedBy=" + updatedBy);
    };
    LegalEntityEndpontService.prototype.getInternationalShippingBylegalEntityId = function (legalEntityId) {
        var _this = this;
        return this.http.get(this.InternationalShippingList + "?legalEntityId=" + legalEntityId)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getInternationalShippingBylegalEntityId(legalEntityId); });
        });
    };
    LegalEntityEndpontService.prototype.deleteInternationalShipViaId = function (id, updatedBy) {
        var _this = this;
        return this.http.get(this._deleteInternationalShippingViaMapUrl + "?id=" + id + "&updatedBy=" + updatedBy)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.deleteInternationalShipViaId(id, updatedBy); });
        });
    };
    LegalEntityEndpontService.prototype.deleteShipViaDetails = function (id, updatedBy) {
        var _this = this;
        return this.http.get(this._deleteShipVia + "?id=" + id + "&updatedBy=" + updatedBy)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.deleteShipViaDetails(id, updatedBy); });
        });
    };
    LegalEntityEndpontService.prototype.postInternationalShippingPost = function (postData) {
        var _this = this;
        return this.http.post(this.InternationalShippingPost, JSON.stringify(postData), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.postInternationalShippingPost(postData); });
        });
    };
    LegalEntityEndpontService.prototype.GetUploadDocumentsList = function (attachmentId, legalEntityId, moduleId) {
        return this.http.get(this._getlegalEntityDocumentAttachmentslist + "?attachmentId=" + attachmentId + "&referenceId=" + legalEntityId + "&moduleId=" + moduleId, this.getRequestHeaders());
    };
    LegalEntityEndpontService.prototype.getCustomerContactAuditDetails1 = function (customerContactId, customerId) {
        return this.http.get("" + this.configurations.baseUrl + this._customerContactHistory1 + "?customerContactId=" + customerContactId + "&customerId=" + customerId, this.getRequestHeaders());
    };
    LegalEntityEndpontService.prototype.getDocumentList = function (legalEntityId) {
        return this.http.get(this.configurations.baseUrl + "/api/legalEntity/getlegalEntityDocumentDetail/" + legalEntityId, this.getRequestHeaders());
    };
    //getDocumentUploadEndpoint<T>(file: any): Observable<T> {
    //	const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    //	return this.http.post<T>(`${this._addDocumentDetails}`, file);
    //}
    LegalEntityEndpontService.prototype.getDocumentUploadEndpoint = function (file) {
        var headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post("" + this._addDocumentDetails, file);
    };
    LegalEntityEndpontService.prototype.getdeleteDocumentListbyId = function (legalEntityDocumentId) {
        return this.http["delete"](this._deleteLegalEntityDocuments + "/" + legalEntityDocumentId, this.getRequestHeaders());
    };
    LegalEntityEndpontService.prototype.getLegalEntityDocumentAuditHistory = function (id, legalEntityId) {
        return this.http.get(this._getlegalEntityDocumentHistory + "?id=" + id + "&legalEntityId=" + legalEntityId, this.getRequestHeaders());
        //getCustomerDocumentAuditHistory(id, customerId) {
        //	return this.http.get<any>(`${this._getCustomerDocumentHistory}?id=${id}&customerId=${customerId}`, this.getRequestHeaders())
        //}
    };
    LegalEntityEndpontService.prototype.LegalEntityBillingFileUpload = function (file, entityId) {
        return this.http.post("" + this.configurations.baseUrl + this.excelUpload + "?legalEntityId=" + entityId, file);
    };
    //deleteBillingAddress<T>(roleObject: any, legalEntityId: any): Observable<T> {
    //	let endpointUrl = `${this._deleteBillingEntityDettilas}/${legalEntityId}`;
    //	return this.http.get<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
    //		.catch(error => {
    //			return this.handleError(error, () => this.deleteBillingAddress(roleObject, legalEntityId));
    //		});
    //}
    LegalEntityEndpontService.prototype.deleteBillingAddress = function (legalEntityId, moduleId) {
        return this.http.get(this._deleteBillingEntityDettilas + "?billingAddressId=" + legalEntityId + "&updatedBy=" + moduleId, this.getRequestHeaders());
    };
    //deleteBillingAddress<T>(roleObject: any, legalEntityId: any): Observable<T> {
    //	let endpointUrl = `${this._deleteBillingEntityDettilas}/${legalEntityId}`;
    //	return this.http.get<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
    //		.catch(error => {
    //			return this.handleError(error, () => this.deleteBillingAddress(roleObject, legalEntityId));
    //		});
    //}
    LegalEntityEndpontService.prototype.getNewBillinginfo = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http
            .post(this._billingInfoUrl, body, this.getRequestHeaders())
            .map(function (res) { return res; })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    LegalEntityEndpontService.prototype.updateBillingViainfo = function (roleObject, entityId) {
        var _this = this;
        var endpointUrl = this._updateBillingViaDetails + "/" + entityId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateBillingViainfo(roleObject, entityId); });
        });
    };
    LegalEntityEndpontService.prototype.getlegalEntityBillingHistory = function (legalEntityId, legalEntityBillingAddressId) {
        return this.http.get(this.configurations.baseUrl + "/" + this._legalEntityBillingHistory + "?legalEntityId=" + legalEntityId + "&legalEntityBillingaddressId=" + legalEntityBillingAddressId);
    };
    LegalEntityEndpontService.prototype.LegalEntityBillingUpdateforActive = function (id, status, updatedBy) {
        var _this = this;
        return this.http.get(this.legalEntityBillingUpdateforActive + "?billingAddressId=" + id + "&status=" + status + "&updatedBy=" + updatedBy)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.LegalEntityBillingUpdateforActive(id, status, updatedBy); });
        });
    };
    LegalEntityEndpontService.prototype.getGeneralrobj = function () {
        var _this = this;
        return this.http.get(this.generalurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getGeneralrobj(); });
        });
    };
    LegalEntityEndpontService.prototype.getLegalEntityEndpontService = function () {
        var _this = this;
        return this.http.get(this.entityurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getLegalEntityEndpontService(); });
        });
    };
    LegalEntityEndpontService.prototype.SearchData = function (pageSearch) {
        var _this = this;
        var endpointUrl = this.serach;
        return this.http.post(endpointUrl, JSON.stringify(pageSearch), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.SearchData(pageSearch); });
        });
    };
    //SearchData(data) {
    //	return this.http.post(this.serach, JSON.stringify(data), this.getRequestHeaders())
    //		.catch(error => {
    //			return this.handleError(error, () => this.SearchData(data));
    //		});
    //}
    LegalEntityEndpontService.prototype.getManagemtentEntityData = function () {
        var _this = this;
        return this.http.get(this.managemententityurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getLegalEntityEndpontService(); });
        });
    };
    LegalEntityEndpontService.prototype.getEntityDataById = function (entityId) {
        var _this = this;
        return this.http.get(this.configurations.baseUrl + "/api/legalEntity/getEntitydatabyid/" + entityId)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getEntityDataById(entityId); });
        });
    };
    LegalEntityEndpontService.prototype.getMSHistoryDataById = function (msID) {
        var _this = this;
        return this.http.get(this.configurations.baseUrl + "/api/ManagementStrcture/mshistory/?msID=" + msID)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getEntityDataById(msID); });
        });
    };
    LegalEntityEndpontService.prototype.updateEntityListDetails = function (roleObject) {
        var _this = this;
        var endpointUrl = this._entityUpdateUrl + "/" + roleObject.legalEntityId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateEntityListDetails(roleObject); });
        });
    };
    LegalEntityEndpontService.prototype.getcountryListEndpoint = function () {
        var _this = this;
        return this.http.get(this.countryUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getcountryListEndpoint(); });
        });
    };
    LegalEntityEndpontService.prototype.getManagemtentLengalEntityData = function () {
        var _this = this;
        return this.http.get(this.managementlengalentityurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getLegalEntityEndpontService(); });
        });
    };
    LegalEntityEndpontService.prototype.loadParentEntities = function () {
        var _this = this;
        return this.http.get(this.parentEntityUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getLegalEntityEndpontService(); });
        });
    };
    LegalEntityEndpontService.prototype.getLedgerNamesData = function () {
        var _this = this;
        return this.http.get(this.ledgerNamesurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getLegalEntityEndpontService(); });
        });
    };
    LegalEntityEndpontService.prototype.getEntityforEdit = function () {
        var _this = this;
        return this.http.get(this.entityediturl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getLegalEntityEndpontService(); });
        });
    };
    LegalEntityEndpontService.prototype.getNewLegalEntityEndpontService = function (userObject) {
        var _this = this;
        return this.http.post(this._entityUrlNew, JSON.stringify(userObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getNewLegalEntityEndpontService(userObject); });
        });
    };
    LegalEntityEndpontService.prototype.updateLegalEntityEndpointService = function (roleObject, id) {
        var _this = this;
        //alert(JSON.stringify(roleObject));
        var endpointUrl = this._entityUrlNew + "/" + id;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateLegalEntityEndpointService(roleObject, id); });
        });
    };
    LegalEntityEndpontService.prototype.getmanagementPost = function (userObject) {
        var _this = this;
        return this.http.post(this._managementposturl, JSON.stringify(userObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getmanagementPost(userObject); });
        });
    };
    LegalEntityEndpontService.prototype.updateManagement = function (userObject) {
        var _this = this;
        var endpointUrl = this._managementposturl + "/" + userObject.managementStructureId;
        return this.http.put(endpointUrl, JSON.stringify(userObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateManagement(userObject); });
        });
    };
    LegalEntityEndpontService.prototype.getDeleteActionEndpoint = function (actionId) {
        var _this = this;
        var endpointUrl = this._managementposturl + "/" + actionId;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getDeleteActionEndpoint(actionId); });
        });
    };
    LegalEntityEndpontService.prototype.getDeleteActionEndpoint1 = function (actionId) {
        var _this = this;
        var endpointUrl = this._deleteLegalEntity + "/" + actionId;
        return this.http.put(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getDeleteActionEndpoint(actionId); });
        });
    };
    LegalEntityEndpontService.prototype.getContcatDetails = function (id) {
        var _this = this;
        var endpointUrl = this.contactUrl + "?legalEntityId=" + id;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getContcatDetails(id); });
        });
    };
    LegalEntityEndpontService.prototype.getUpdateLegalEntityEndpontService = function (roleObject, actionId) {
        var _this = this;
        var endpointUrl = this._entityUrlNew + "/" + actionId;
        var obj = {
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
            'updatedBy': roleObject.updatedBy
        };
        return this.http.put(endpointUrl, JSON.stringify(obj), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdateLegalEntityEndpontService(roleObject, actionId); });
        });
    };
    LegalEntityEndpontService.prototype.getDeleteLegalEntityEndpontService = function (actionId) {
        var _this = this;
        var endpointUrl = this._entityUrlNew + "/" + actionId;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getDeleteLegalEntityEndpontService(actionId); });
        });
    };
    LegalEntityEndpontService.prototype.getHistoryLegalEntityEndpontService = function (jobTitleId) {
        var _this = this;
        var endpointUrl = this._JobTilesUrlAuditHistory + "/" + jobTitleId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getHistoryLegalEntityEndpontService(jobTitleId); });
        });
    };
    LegalEntityEndpontService.prototype.getAccountsInfoById = function (entityId) {
        var _this = this;
        var endpointUrl = this.getEntitySetupAccounts + "/" + entityId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getAccountsInfoById(entityId); });
        });
    };
    LegalEntityEndpontService.prototype.getUpdateLegalEntityActive = function (roleObject, legalEntityId) {
        // let endpointUrl = `${this._entityUrlNew}/${legalEntityId}`;
        var _this = this;
        return this.http.put(this._activeUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdateLegalEntityActive(roleObject, legalEntityId); });
        });
    };
    LegalEntityEndpontService.prototype.updateLegalEntityStatus = function (id, status, updatedBy) {
        var _this = this;
        var endpointUrl = this._activeUrl + "?legalEntityId=" + id + "&status=" + status + "&updatedBy=" + updatedBy;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateLegalEntityStatus(id, status, updatedBy); });
        });
    };
    LegalEntityEndpontService.prototype.getLegalEntityAddressById = function (entityId) {
        var _this = this;
        var endpointUrl = this.getLegalEntityAddressByIdURL + "/" + entityId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getLegalEntityAddressById(entityId); });
        });
    };
    LegalEntityEndpontService.prototype.getEntityBillViaDetails = function (id) {
        var _this = this;
        //alert(JSON.stringify(roleObject));
        var endpointUrl = this.entityBillViaDetails + "?billingAddressId=" + id;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getEntityBillViaDetails(id); });
        });
        //getContcatDetails<T>(id): Observable < T > {
        //	let endpointUrl = `${this.contactUrl}?legalEntityId=${id}`;
        //	return this.http.get<T>(endpointUrl, this.getRequestHeaders())
        //		.catch(error => {
        //			return this.handleError(error, () => this.getContcatDetails(id));
        //		});
        //}
    };
    LegalEntityEndpontService.prototype.uploadLegalEntityLogoEndpoint = function (file) {
        var headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post("" + this._uploadlegalEntityLogo, file);
    };
    LegalEntityEndpontService.prototype.getNewLegalEntityContactInfo = function (param) {
        var _this = this;
        delete param.contactId;
        var body = JSON.stringify(param);
        var endpointUrl = "/api/legalentity/LegalEntityContactPost";
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(endpointUrl, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getNewLegalEntityContactInfo(param); });
        });
    };
    LegalEntityEndpontService.prototype.addLegalEntityContactDetails = function (param) {
        var _this = this;
        var body = JSON.stringify(param);
        var endpointUrl = "/api/legalentity/ContactPost";
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(endpointUrl, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) {
            return _this.handleError(error, function () { return _this.addLegalEntityContactDetails(param); });
        });
    };
    //bankingpost lock box
    LegalEntityEndpontService.prototype.getNewlockboxLegalEntityEndpontService = function (userObject) {
        var _this = this;
        return this.http.post(this._entityUrlNewlockbox, JSON.stringify(userObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getNewlockboxLegalEntityEndpontService(userObject); });
        });
    };
    LegalEntityEndpontService.prototype.getNewdomesticwireLegalEntityEndpontService = function (userObject) {
        var _this = this;
        return this.http.post(this._entityUrlNewdomestic, JSON.stringify(userObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getNewdomesticwireLegalEntityEndpontService(userObject); });
        });
    };
    LegalEntityEndpontService.prototype.getNewinternationaLegalEntityEndpontService = function (userObject) {
        var _this = this;
        return this.http.post(this._entityUrlNewinternationalwire, JSON.stringify(userObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getNewinternationaLegalEntityEndpontService(userObject); });
        });
    };
    LegalEntityEndpontService.prototype.getNewACHLegalEntityEndpontService = function (userObject) {
        var _this = this;
        return this.http.post(this._entityUrlNewACH, JSON.stringify(userObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getNewACHLegalEntityEndpontService(userObject); });
        });
    };
    LegalEntityEndpontService.prototype.getEntityLockboxDataById = function (legalEntityId) {
        return this.http.get(this.configurations.baseUrl + "/api/legalEntity/getEntityLockBoxdata?legalEntityId=" + legalEntityId);
    };
    LegalEntityEndpontService.prototype.getEntityDomesticDataById = function (entityId) {
        return this.http.get(this.configurations.baseUrl + "/api/legalEntity/getEntityDomesticWireById?legalEntityId=" + entityId);
    };
    LegalEntityEndpontService.prototype.getEntityInternationalDataById = function (entityId) {
        //alert('lol,');
        return this.http.get(this.configurations.baseUrl + "/api/legalEntity/getEntityInternationalWireById?legalEntityId=" + entityId);
    };
    LegalEntityEndpontService.prototype.getEntityACHDataById = function (entityId) {
        return this.http.get(this.configurations.baseUrl + "/api/legalEntity/getEntityACHById?legalEntityId=" + entityId);
    };
    LegalEntityEndpontService.prototype.updateLegalLockbox = function (roleObject) {
        var _this = this;
        var endpointUrl = this._updatelegallockbox + "/" + roleObject;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateLegalLockbox(roleObject); });
        });
    };
    LegalEntityEndpontService.prototype.updateLegalDomestic = function (roleObject) {
        var _this = this;
        var endpointUrl = this._updatelegalDomesticwire + "/" + roleObject;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateLegalDomestic(roleObject); });
        });
    };
    LegalEntityEndpontService.prototype.updateLegalInternational = function (roleObject) {
        var _this = this;
        var endpointUrl = this._updatelegalInternalwire + "/" + roleObject;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateLegalInternational(roleObject); });
        });
    };
    LegalEntityEndpontService.prototype.updateLegalACH = function (roleObject) {
        var _this = this;
        var endpointUrl = this._updatelegalACH + "/" + roleObject;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateLegalACH(roleObject); });
        });
    };
    LegalEntityEndpontService.prototype.getLegalEntityHistory = function (customerId) {
        return this.http.get(this.configurations.baseUrl + "/" + this._customerHistory + "?LegalEntityId=" + customerId);
    };
    LegalEntityEndpontService.prototype.getDeleteActionEndpointLogo = function (actionId) {
        var _this = this;
        var endpointUrl = this._LogogDell + "/" + actionId;
        console.log("Deleting");
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            console.log("Error on Deleting");
            return _this.handleError(error, function () { return _this.getDeleteActionEndpointLogo(actionId); });
        });
    };
    //getGlobalEntityRecords<T>(value, pageIndex, pageSize): Observable<T> {
    //	// let endpointUrl = this.globalSearch;
    //	return this.http.post<T>(`${this.configurations.baseUrl}${this._EntityGlobalSearch}?value=${value}&pageNumber=${pageIndex}&pageSize=${pageSize}`, this.getRequestHeaders())
    //		.catch(error => {
    //			return this.handleError(error, () => this.getGlobalEntityRecords(value, pageIndex, pageSize));
    //		});
    //}
    LegalEntityEndpontService.prototype.getGlobalEntityRecords = function (pageSearch) {
        var _this = this;
        var endpointUrl = this._EntityGlobalSearch;
        return this.http.post(endpointUrl, JSON.stringify(pageSearch), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getGlobalEntityRecords(pageSearch); });
        });
    };
    LegalEntityEndpontService.prototype.getLegalEntityHistoryById = function (legalEntityId) {
        var _this = this;
        //return this.http.get<any>(`${this.configurations.baseUrl}/${this._legalEntityHistory}?legalEntityId=${legalEntityId}`)
        return this.http.get(this.configurations.baseUrl + "/" + this._legalEntityHistory + "/" + legalEntityId)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getLegalEntityHistoryById(legalEntityId); });
        });
    };
    LegalEntityEndpontService = __decorate([
        core_1.Injectable()
    ], LegalEntityEndpontService);
    return LegalEntityEndpontService;
}(endpoint_factory_service_1.EndpointFactory));
exports.LegalEntityEndpontService = LegalEntityEndpontService;
