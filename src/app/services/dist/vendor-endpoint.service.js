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
exports.VendorEndpointService = void 0;
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
var endpoint_factory_service_1 = require("./endpoint-factory.service");
var VendorEndpointService = /** @class */ (function (_super) {
    __extends(VendorEndpointService, _super);
    function VendorEndpointService(http, configurations, injector) {
        var _this = _super.call(this, http, configurations, injector) || this;
        _this._vendorUrl = "/api/Vendor/Get";
        _this._vendorLiteUrl = "/api/Vendor/basic";
        _this._vendorCapabilityUrl = "/api/Vendor/getVendorCapabilityList";
        _this._vendorUrlNew = "/api/Vendor/vendor";
        _this._partDetails = "/api/Vendor/Getpartdetails";
        _this._partDetailswithid = "/api/Vendor/GetpartdetailsWithid";
        _this._partDetailswithidForsinglePart = "/api/Vendor/GetpartdetailsWithidForSinglePart";
        _this._saveVendorCapesByVendor = "/api/Vendor/PostVendorCapes";
        _this._capabilityUrl = "/api/Vendor/GetCapabilityList";
        _this._vendrUrl = "/api/Vendor/GetListDetails";
        _this._domesticWIthVendor = "/api/Vendor/GetDomesticWithVedor";
        _this._internationalWIthVendor = "/api/Vendor/GetInternationalWithVedor";
        _this._defaultwithVendor = "/api/Vendor/GetdefaultListVedor";
        _this._Vendercodebyid = "/api/Vendor/GetVendorNameAndCodewithId";
        _this._vendorsWithId = "/api/Vendor/GetVendorsListwithId";
        _this._contacturl = "/api/Vendor/ContactGet";
        _this._contactGeturl = "/api/Vendor/ContactCompleteGet";
        _this._checkPaymnetAddressUrl = "/api/Vendor/CheckAddress";
        _this._bencusAddress = "/api/Vendor/BencusAddress";
        _this._contactsEmptyObjurl = "/api/Vendor/contactEmptyObj";
        _this._finalEmptyObjurl = "/api/Vendor/fianlEmptyObj";
        _this._paymentEmptyObjurl = "/api/Vendor/paymentEmptyObj";
        _this._generalEmptyObjurl = "/api/Vendor/generalEmptyObj";
        _this._addressUrl = "/api/Vendor/AddressGet";
        _this._vendorsUrlNew = "/api/Vendor/vendorPost";
        _this._getVendorForPo = "/api/Vendor/getVendorForPo";
        _this._vendorwarningUrl = "/api/Vendor/saveVendorWarnings";
        _this._saveVendorpurchases = "/api/Vendor/saveVendorpurchases";
        _this._savePOAddress = "/api/Vendor/saveVendorpurchasesAddress";
        _this._saveVendorrepaire = "/api/Vendor/saveVendorRepairOrder";
        _this._saveVendorpurchasespart = "/api/Vendor/saveVendorpurchasespart";
        _this._saveVendorrepairepart = "/api/Vendor/saveVendorRepairPart";
        _this._vendorUpdateUrl = "/api/Vendor/vendorUpdate";
        _this._vendorContactUrlNew = "/api/Vendor/updateStatusVenShippingAddress";
        _this._deleteCheckPayment = "/api/Vendor/deleteCheckPayment";
        _this._restoreCheckPayment = "/api/Vendor/restoreCheckPayment";
        _this._deleteContactUrl = "/api/Vendor/vendorContact";
        _this._vendorShippingUrlNew = "/api/Vendor/updateStatusVendorShipping";
        _this._vendorShippingAddressUrlDelete = "/api/Vendor/deletevendorshippingaddress";
        _this._vendorShippingAddressUrlRestore = "/api/Vendor/restorevendorshippingaddress";
        _this._vendorShippingAddressViaUrlDelete = "/api/Vendor/deletevendorshippingviaaddress";
        _this._vendorShippingAddressViaUrlRestore = "/api/Vendor/restorevendorshippingviaaddress";
        _this._vendorShippingAddressViaInterUrlDelete = "/api/Vendor/deleteinternationalshipvia";
        _this._vendorShippingAddressViaInterUrlRestore = "/api/Vendor/restoreinternationalshipvia";
        _this._vendorsContctUrl = "/api/Vendor/vendorContactPost";
        _this._checkPaymntUpdateUrl = "/api/Vendor/checkPaymentUpdate";
        _this._domesticUpdate = "/api/Vendor/domesticPaymentUpdate";
        _this._internationalUpdate = "/api/Vendor/InternationalUpdate";
        _this._defaultUpdate = "/api/Vendor/defaultUpdate";
        _this._addpaymentUrl = "/api/Vendor/paymentCheckPost";
        _this._adddomesticpaymentUrl = "/api/Vendor/paymentDomesticPost";
        _this._addinternationalpaymentUrl = "/api/Vendor/paymentInternationalPost";
        _this._adddefaultpaymentUrl = "/api/Vendor/paymentDefaultPost";
        _this._vendorsUpdateContctUrl = "/api/Vendor/ContactPost";
        _this._vendorCheckpaymentUpdate = "/api/Vendor/vendorCheckPayment";
        _this._vendorShipAddressdetails = "/api/Vendor/vendorShippingAddressDetails";
        _this._vendorDomesticpaymentUpdate = "/api/Vendor/vendorDomesticPayment";
        _this._vendorInternationalpaymentUpdate = "/api/Vendor/vendorInternationalPayment";
        _this._vendorDefaultUpdate = "/api/Vendor/updatevendorDefault";
        _this._vendorFinanceUrl = "/api/Vendor/vendorFinancePost";
        _this._shippingInfoUrl = "/api/Vendor/vendorShippingPost";
        _this._billingInfoUrl = "/api/Vendor/vendorBillingPost";
        _this._billingInfoNew = "/api/Vendor/createvendorbillingaddress";
        _this._saveShipViaDetails = "/api/Vendor/addShipViaDetails";
        _this._saveShipViaInterDetails = "/api/Vendor/createinternationalshipvia";
        _this._saveBillViaDetails = "/api/Vendor/addBillViaDetails";
        _this._addShipViaDetails = "/api/Vendor/updateShipviaAddress";
        _this._updateShipAddressDetails = "/api/Vendor/updateShipAddress";
        _this._updateShippingViaDetails = "/api/Vendor/updateShipViaDetails";
        _this._updateBillingViaDetails = "/api/Vendor/updateBillViaDetails";
        _this._actionsUrlAuditHistory = "/api/Vendor/auditHistoryById";
        _this._vendorShipAddressGetUrl = "/api/Vendor/vendorAddressGet";
        _this._vendorBillAddressGetUrl = "/api/Vendor/vendorBillingAddressGet";
        _this._getSitesAddress = "/api/Vendor/getSitesAddress";
        _this._vendorwarningsUrl = "/api/Vendor/vendorWarningsget";
        _this._vendorShipViaDetilas = "/api/Vendor/getVendorShipViaDetails";
        _this._vendorShipViaInterDetails = "/api/Vendor/internationalshipviadetaillist";
        _this._vendorBillViaDetails = "/api/Vendor/getVendorBillViaDetails";
        _this._getContactHistroty = "/api/Vendor/getContactHistroty";
        _this._getCheckPayHist = "/api/Vendor/getCheckPayHist";
        _this._getVendorhistory = "/api/Vendor/getVendorHistory";
        _this._getcheckhistory = "/api/Vendor/getcheckHistory";
        _this._getShipViaHistory = "/api/Vendor/getShipViaHistory";
        _this._getShipViaHistoryInter = "/api/Vendor/internationalshipviaaudit";
        _this._getBillViaHistory = "/api/Vendor/getBillViaHistory";
        _this._getshipaddresshistory = "/api/Vendor/getshipaddresshistory";
        _this._getbilladdresshistory = "/api/Vendor/getbilladdresshistory";
        _this._updateVendorIsDelete = "/api/Vendor/updateVendorIsDelete";
        _this._actionsUrl = "api/Vendor/Getdiscount";
        _this._discountPutUrl = "api/Vendor/updatediscount";
        _this._newDiscount = "api/Vendor/insertDiscount";
        _this._listUrl = "/api/Vendor/GetvendorList";
        _this._updateActiveInactive = "/api/Vendor/vendorUpdateforActive";
        _this._updateActiveInactiveforContact = "/api/Vendor/vendorUpdateforActiveforcontact";
        _this._updateActiveInactiveforpayment = "/api/Vendor/vendorUpdateforActiveforpayment";
        _this._updateActiveInactivefordshipping = "/api/Vendor/vendorUpdateforActiveforshipping";
        _this._updateActiveInactivefordbilling = "/api/Vendor/vendorUpdateforActiveforbilling";
        _this._updateActiveInactivefordshipviaDetails = "/api/Vendor/vendorUpdateforActiveforshipviaDetails";
        _this._polisturl = "/api/Vendor/polist";
        _this._stockLinePOlisturl = "/api/Vendor/stocklinePOList";
        _this._countryUrl = "/api/Customer/GetcountryList";
        _this._rolist = "/api/Vendor/rolist";
        _this._purchaseorderDetails = "/api/Vendor/GetvendorpurchaseList";
        _this._managementSiteDetails = "/api/Vendor/GetmanagementSiteList";
        _this._repaireorderDetails = "/api/Vendor/GetvendorrepairList";
        _this._updateShipvendorAddressDetails = "/api/Vendor/updatevendorShipAddress";
        _this._updateBillvendorAddressDetails = "/api/Vendor/updatevendorBillAddress";
        _this._defaultsUpdate = "/api/Vendor/defaultmethodUpdate";
        _this._deletePoPart = "/api/Vendor/deletePoPart";
        _this._deleteRoPart = "/api/Vendor/deleteRoPart";
        _this._actionsUrlNew2 = "/api/Vendor/GetATASubchapter";
        _this._capabilityListUrl = "/api/Vendor/capabilityTypeList";
        _this._vendorCapability = "/api/Vendor/vendorCapabilityPost";
        _this._vendorCapabilityType = "/api/Vendor/vendorCapabilityTypePost";
        _this._vendorCapabilityAircraftType = "/api/Vendor/vendorCapabilityAircraftTypePost";
        _this._vendorCapabilityAircraftModel = "/api/Vendor/vendorCapabilityAircraftModelPost";
        _this._vendorCapabilityGet = "/api/Vendor/vendorCapabilityTypeGet";
        _this._vendorManufacturer = "/api/Vendor/vendorAircraftManufacturerGet";
        _this._vendorManufacturerModel = "/api/Vendor/vendorAircraftManufacturerModelGet";
        _this._vendorCapabilityUpdate = "/api/Vendor/vendorCapabilityUpdate"; //which will be specified in the Controller
        _this._deleteVendorCapabilityTypeUrl = "/api/Vendor/deleteVendorCapabilityType";
        _this._deleteVendorCapabilityAircraftManufacturer = "/api/Vendor/deleteVendorCapabilityAircraftManafacturer";
        _this._deleteVendorCapabilityAircraftModel = "/api/Vendor/deleteVendorCapabilityAircraftModel";
        _this._deleteVendorCapability = "/api/Vendor/deleteVendorCapability";
        _this._getVendorContactByID = "/api/Vendor/getvendorContactByVendorID";
        _this._actionsCapsUrl = "/api/Vendor/GetListforCapes";
        _this._capesdata = "/api/Vendor/GetVendorCapesDatawithMasterId";
        _this._mancapPost = "/api/Vendor/VendorMancapespost";
        _this._aircraftmodelsPost = "/api/Vendor/Aircraftpost";
        _this._vendorContactsGetByID = "/api/Common/vendorcontacts";
        _this.getVendor = "/api/vendor/pagination";
        _this._vendorsForDropDown = "/api/Vendor/GetVendorsForDropDown";
        _this._saveVendorRepairOrder = "/api/repairorder/createrepairorder";
        _this._saveROAddress = "/api/Vendor/saveVendorRepairAddress";
        _this._saveVendorRepairOrderPart = "/api/repairorder/createrepairorderparts";
        _this._roByIdUrl = "/api/Vendor/roById";
        _this._roPartByIdUrl = "/api/Vendor/roPartsById";
        _this._poPartByItemIdUrl = "/api/Vendor/POListByMasterItemId";
        _this._roPartByItemIdUrl = "/api/Vendor/ROListByMasterItemId";
        _this._roListWithFiltersUrl = "/api/repairorder/roListWithFilters";
        _this._saveCreateROApproval = "/api/Vendor/createRoApprover";
        _this._updateROApproval = "/api/Vendor/updateRoApprover";
        _this._getVendorPOmemolist = "/api/Vendor/vendorpomemolist";
        _this._getVendorROmemolist = "/api/Vendor/vendorromemolist";
        _this._updateVendorPOROmemolist = "/api/Vendor/updatevendormemotext";
        _this._getVendorDocslist = "/api/Vendor/getVendorDocumentDetailList";
        _this._addDocumentDetails = "/api/Vendor/vendorDocumentUpload";
        _this._updateDocumentDetails = "/api/Vendor/vendorDocumentUpdate";
        _this._getVendorDocsDetailsById = "/api/Vendor/getVendorDocumentDetail";
        _this._getVendorDocumentAttachmentslist = "/api/FileUpload/getattachmentdetails";
        _this._getVendorDeleteDocsDetailsById = "/api/Vendor/vendorDocumentDelete";
        _this._getVendorShippingHistory = "/api/Vendor/getVendorShippingHistory";
        _this._getVendorBillingHistory = "/api/Vendor/getVendorBillingHistory";
        _this._getVendorContactHistory = "/api/Vendor/getVendorContactHistory";
        _this._getVendorDocumentHistory = "/api/Vendor/getVendorDocumentAudit";
        _this._getVendorCapabilityHistory = "/api/Vendor/getVendorCapabilityHistory";
        _this._updateVendorBillAddressDetails = "/api/Vendor/updatevendorbillingaddress";
        _this._addVendorDocumentDetails = "/api/FileUpload/uploadfiles";
        _this._addVendorFileUpload = "/api/Vendor/vendorGeneralDocumentUpload";
        _this._addVendorgeneralFileDetails = "/api/Vendor/getVendorGeneralDocumentDetail";
        _this._vendorDeleteAttachment = "/api/Vendor/vendorAttachmentDelete";
        _this._vendorProcess1099Id = "/api/Vendor/getVendorProcess1099ListForFinance";
        _this._vendorProcess1099IdFromTransaction = "/api/Vendor/getVendorProcess1099ListFromTransaction";
        _this._deleteVendorBillingAddressDelete = "/api/Vendor/deletevendorbillingaddress";
        _this._restoreVendorBillingAddressDelete = "/api/Vendor/restorevendorbillingaddress";
        _this._updateVendorBillingAddressStatus = "/api/Vendor/vendorbillingaddressstatus";
        _this._vendorListsUrl = "/api/Vendor/vendorlist";
        _this.excelUploadBilling = "/api/Vendor/uploadvendorbillingaddress";
        _this.excelUploadShipping = "/api/Vendor/uploadvendorshippingaddress";
        _this.excelUploadInternationalShipping = "/api/Vendor/uploadvendorinternationalshipping";
        _this.excelUploadContact = "/api/Vendor/uploadvendorrcontacts";
        _this.excelUploadPayment = "/api/Vendor/uploadvendorpaymentaddress";
        _this._receivingPOList = "/api/Vendor/receiveposearch";
        _this._receivingPOListGlobal = "/api/Vendor/receivepoglobalsearch";
        _this._receivingROList = "/api/Vendor/receiverosearch";
        _this._receivingROListGlobal = "/api/Vendor/receiveroglobalsearch";
        return _this;
    }
    Object.defineProperty(VendorEndpointService.prototype, "capabilityTypeListUrl", {
        get: function () { return this.configurations.baseUrl + this._capabilityListUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorlistsUrl", {
        get: function () { return this.configurations.baseUrl + this._vendrUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorBasicListUrl", {
        get: function () { return this.configurations.baseUrl + this._vendorLiteUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorListWithId", {
        get: function () { return this.configurations.baseUrl + this._vendorsWithId; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorattributesUrl", {
        get: function () { return this.configurations.baseUrl + this._vendorUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorCapabilityListsUrl", {
        get: function () { return this.configurations.baseUrl + this._vendorCapabilityUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "partDetails", {
        get: function () { return this.configurations.baseUrl + this._partDetails; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "partDetailswithid", {
        get: function () { return this.configurations.baseUrl + this._partDetailswithid; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "partDetailswithidForsinglePart", {
        get: function () { return this.configurations.baseUrl + this._partDetailswithidForsinglePart; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorDomestic", {
        get: function () { return this.configurations.baseUrl + this._domesticWIthVendor; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "internationalWIthVendor", {
        get: function () { return this.configurations.baseUrl + this._internationalWIthVendor; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "defaultVendor", {
        get: function () { return this.configurations.baseUrl + this._defaultwithVendor; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorsForDropDownURL", {
        get: function () { return this.configurations.baseUrl + this._vendorsForDropDown; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorCodeById", {
        get: function () { return this.configurations.baseUrl + this._Vendercodebyid; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "VendorShipDetails", {
        get: function () { return this.configurations.baseUrl + this._vendorShipViaDetilas; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorShipAddressUrl", {
        get: function () { return this.configurations.baseUrl + this._vendorShipAddressGetUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorBillAddressUrl", {
        get: function () { return this.configurations.baseUrl + this._vendorBillAddressGetUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "getSiteAddress", {
        get: function () { return this.configurations.baseUrl + this._getSitesAddress; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorWarningsDetails", {
        get: function () { return this.configurations.baseUrl + this._vendorwarningsUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorShipViaDetails", {
        get: function () { return this.configurations.baseUrl + this._vendorShipViaDetilas; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorShipViaInterDetails", {
        get: function () { return this.configurations.baseUrl + this._vendorShipViaInterDetails; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorBillViaDetails", {
        get: function () { return this.configurations.baseUrl + this._vendorBillViaDetails; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "contctsUrl", {
        get: function () { return this.configurations.baseUrl + this._contacturl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "contctsCompleteUrl", {
        get: function () { return this.configurations.baseUrl + this._contactGeturl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "contactEmptyurl", {
        get: function () { return this.configurations.baseUrl + this._contactsEmptyObjurl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "fianlurl", {
        get: function () { return this.configurations.baseUrl + this._finalEmptyObjurl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "paymenturl", {
        get: function () { return this.configurations.baseUrl + this._paymentEmptyObjurl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "generalurl", {
        get: function () { return this.configurations.baseUrl + this._generalEmptyObjurl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "addressUrl", {
        get: function () { return this.configurations.baseUrl + this._addressUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "checkPaymentAddress", {
        get: function () { return this.configurations.baseUrl + this._checkPaymnetAddressUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "bencusAddress", {
        get: function () { return this.configurations.baseUrl + this._bencusAddress; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "getContactHistory", {
        get: function () { return this.configurations.baseUrl + this._getContactHistroty; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "getCheckPayHist", {
        get: function () { return this.configurations.baseUrl + this._getCheckPayHist; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "getVendorhistory", {
        get: function () { return this.configurations.baseUrl + this._getVendorhistory; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "getcheckhistory", {
        get: function () { return this.configurations.baseUrl + this._getcheckhistory; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "getShipViaHistory", {
        get: function () { return this.configurations.baseUrl + this._getShipViaHistory; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "getShipViaHistoryInter", {
        get: function () { return this.configurations.baseUrl + this._getShipViaHistoryInter; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "getBillViaHistory", {
        get: function () { return this.configurations.baseUrl + this._getBillViaHistory; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "getshipaddresshistory", {
        get: function () { return this.configurations.baseUrl + this._getshipaddresshistory; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "getbilladdresshistory", {
        get: function () { return this.configurations.baseUrl + this._getbilladdresshistory; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "capabilityUrl", {
        get: function () { return this.configurations.baseUrl + this._capabilityUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "polisturl", {
        get: function () { return this.configurations.baseUrl + this._polisturl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "stockLinepolisturl", {
        get: function () { return this.configurations.baseUrl + this._stockLinePOlisturl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "rolisturl", {
        get: function () { return this.configurations.baseUrl + this._rolist; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "listUrl", {
        get: function () { return this.configurations.baseUrl + this._listUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "countryUrl", {
        get: function () { return this.configurations.baseUrl + this._countryUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "purchaseorderDetails", {
        get: function () { return this.configurations.baseUrl + this._purchaseorderDetails; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "managementSiteDetails", {
        get: function () { return this.configurations.baseUrl + this._managementSiteDetails; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "repaireorderDetails", {
        get: function () { return this.configurations.baseUrl + this._repaireorderDetails; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorCapabilityurl", {
        get: function () { return this.configurations.baseUrl + this._vendorCapabilityGet; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorManufacturerurl", {
        get: function () { return this.configurations.baseUrl + this._vendorManufacturer; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorManufacturerModelurl", {
        get: function () { return this.configurations.baseUrl + this._vendorManufacturerModel; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "actionsUrlCaps", {
        get: function () { return this.configurations.baseUrl + this._actionsCapsUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "capesdata", {
        get: function () { return this.configurations.baseUrl + this._capesdata; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "paginate", {
        get: function () { return this.configurations.baseUrl + this.getVendor; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "roListWithFiltersUrl", {
        get: function () { return this.configurations.baseUrl + this._roListWithFiltersUrl; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorProcess1099Id", {
        get: function () { return this.configurations.baseUrl + this._vendorProcess1099Id; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorProcess1099IdFromTransaction", {
        get: function () { return this.configurations.baseUrl + this._vendorProcess1099IdFromTransaction; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VendorEndpointService.prototype, "vendorListUrl", {
        get: function () { return this.configurations.baseUrl + this._vendorListsUrl; },
        enumerable: false,
        configurable: true
    });
    VendorEndpointService.prototype.getReceivingPOListing = function () {
        var _this = this;
        return this.http.get(this.configurations.baseUrl + "/api/vendor/recevingpolist")["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getReceivingPOListing(); });
        });
    };
    VendorEndpointService.prototype.postNewBillingAddress = function (object) {
        var _this = this;
        var url = this.configurations.baseUrl + "/api/Vendor/createvendorbillingaddress";
        return this.http.post(url, JSON.stringify(object), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.postNewBillingAddress(object); });
        });
    };
    VendorEndpointService.prototype.getVendorCapesData = function (vendorId) {
        var _this = this;
        var url = this.capesdata + "/" + vendorId;
        return this.http.get(url, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorCapesData(vendorId); });
        });
    };
    VendorEndpointService.prototype.saveVendorCapesmaninfo = function (data) {
        var _this = this;
        return this.http.post(this._mancapPost, JSON.stringify(data), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.saveVendorCapesmaninfo(data); });
        });
    };
    VendorEndpointService.prototype.saveAircraftinfo = function (data) {
        var _this = this;
        return this.http.post(this._aircraftmodelsPost, JSON.stringify(data), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.saveVendorCapesmaninfo(data); });
        });
    };
    VendorEndpointService.prototype.getNewvendorEndpoint = function (userObject) {
        var _this = this;
        return this.http.post(this._vendorUrlNew, JSON.stringify(userObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getNewvendorEndpoint(userObject); });
        });
    };
    VendorEndpointService.prototype.getEditvendorEndpoint = function (vendorId) {
        var _this = this;
        var endpointUrl = vendorId ? this._vendorUrlNew + "/" + vendorId : this._vendorUrlNew;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getEditvendorEndpoint(vendorId); });
        });
    };
    VendorEndpointService.prototype.getDeletevendorEndpoint = function (vendorId) {
        var _this = this;
        var endpointUrl = this._vendorUrlNew + "/" + vendorId;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getDeletevendorEndpoint(vendorId); });
        });
    };
    VendorEndpointService.prototype.getvendorCapabilityListEndpoint = function (status, vendorId) {
        var _this = this;
        return this.http.get(this.vendorCapabilityListsUrl + "/?status=" + status + "&vendorId=" + vendorId, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getvendorEndpoint = function () {
        var _this = this;
        return this.http.get(this.vendorattributesUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getvendorBasicEndpoint = function () {
        var _this = this;
        return this.http.get(this.vendorBasicListUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorBasicEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getCapabilityTypeListEndpoint = function () {
        var _this = this;
        return this.http.get(this.capabilityTypeListUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getCapabilityTypeListEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getManagementSiteDataByCompanyIdEdpoint = function (companyId) {
        var _this = this;
        var endUrl = this.managementSiteDetails + "/" + companyId;
        return this.http.get(endUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getManagementSiteDataByCompanyIdEdpoint(companyId); });
        });
    };
    VendorEndpointService.prototype.getpurchasevendorlist = function (vendorId) {
        var _this = this;
        var endUrl = this.purchaseorderDetails + "/" + vendorId;
        return this.http.get(endUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getrepairevendorlist = function (vendorId) {
        var _this = this;
        var endUrl = this.repaireorderDetails + "/" + vendorId;
        return this.http.get(endUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getCompletePartDetails = function () {
        var _this = this;
        return this.http.get(this.partDetails, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getPartDetailsWithid = function (partId) {
        var _this = this;
        var endpointurl = this.partDetailswithid + "/" + partId;
        return this.http.get(endpointurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getPartDetailsWithidForSinglePart = function (partId) {
        var _this = this;
        var endpointurl = this.partDetailswithidForsinglePart + "/" + partId;
        return this.http.get(endpointurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorEndpoint(); });
        });
    };
    VendorEndpointService.prototype.saveVendorCapes = function (vendorId, data) {
        var _this = this;
        return this.http.put(this._saveVendorCapesByVendor + "/" + vendorId, data, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.saveVendorCapes(vendorId, data); });
        });
    };
    VendorEndpointService.prototype.deleteVendorCapesRecordEndpoint = function (id, updatedBy) {
        var _this = this;
        var endpointUrl = this.configurations.baseUrl + "/api/Vendor/vendorcapesdelete/" + id + "?updatedBy=" + updatedBy;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.deleteVendorCapesRecordEndpoint(id, updatedBy); });
        });
    };
    VendorEndpointService.prototype.restoreVendorCapesRecordEndpoint = function (id, updatedBy) {
        var _this = this;
        var endpointUrl = this.configurations.baseUrl + "/api/Vendor/vendorcapesrestore/" + id + "?updatedBy=" + updatedBy;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.restoreVendorCapesRecordEndpoint(id, updatedBy); });
        });
    };
    VendorEndpointService.prototype.getCapabilityEndpoint = function () {
        var _this = this;
        return this.http.get(this.capabilityUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getCapabilityEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getDomesticWire = function (vendorId) {
        var _this = this;
        var endpointurl = this.vendorDomestic + "/" + vendorId;
        return this.http.get(endpointurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorEndpoint(); });
        });
    };
    VendorEndpointService.prototype.updateInternational = function (roleObject) {
        var _this = this;
        var endpointUrl = this._internationalUpdate + "/" + roleObject.internationalWirePaymentId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateDomestic(roleObject); });
        });
    };
    VendorEndpointService.prototype.updateDefault = function (roleObject) {
        var _this = this;
        var endpointUrl = this._defaultUpdate + "/" + roleObject.vendorPaymentId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateDefaults(roleObject); });
        });
    };
    VendorEndpointService.prototype.getInternational = function (vendorId) {
        var _this = this;
        var endpointurl = this.internationalWIthVendor + "/" + vendorId;
        return this.http.get(endpointurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getDefault = function (vendorId) {
        var _this = this;
        var endpointurl = this.defaultVendor + "/" + vendorId;
        return this.http.get(endpointurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getVendorCodeAndNameById = function (vendorId) {
        var _this = this;
        var endpointurl = this.vendorCodeById + "/" + vendorId;
        return this.http.get(endpointurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getVendorShipvia = function () {
        var _this = this;
        return this.http.get(this.VendorShipDetails, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getVendorShipAddressdetails = function (vendorId) {
        var _this = this;
        var endpointurl = this.vendorShipAddressUrl + "/" + vendorId;
        return this.http.get(endpointurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getVendorBillAddressdetails = function (vendorId) {
        var _this = this;
        var endpointurl = this.vendorBillAddressUrl + "/" + vendorId;
        return this.http.get(endpointurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getSiteAddresses = function () {
        var _this = this;
        return this.http.get(this.getSiteAddress, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getSiteAddresses(); });
        });
    };
    VendorEndpointService.prototype.getVendorwarnigs = function (vendorId) {
        var _this = this;
        var endpointurl = this.vendorWarningsDetails + "/" + vendorId;
        return this.http.get(endpointurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getVendorShipViaDetails = function (vendorShippingAddressId, currentDeletedstatusShipVia) {
        var _this = this;
        var endpointUrl = this.vendorShipViaDetails + "/" + vendorShippingAddressId + "?isDeleted=" + currentDeletedstatusShipVia;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorShipViaDetails(vendorShippingAddressId, currentDeletedstatusShipVia); });
        });
    };
    VendorEndpointService.prototype.getVendorShipViaInterDetails = function (id, currentDeletedstatusIntShipVia) {
        var _this = this;
        var endpointUrl = this.vendorShipViaInterDetails + "?VendorInternationalShippingId=" + id + "&isDeleted=" + currentDeletedstatusIntShipVia;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorShipViaInterDetails(id, currentDeletedstatusIntShipVia); });
        });
    };
    VendorEndpointService.prototype.getVendorBillViaDetails = function (roleObject) {
        var _this = this;
        var endpointUrl = this.vendorBillViaDetails + "/" + roleObject.vendorBillingAddressId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorBillViaDetails(roleObject); });
        });
    };
    VendorEndpointService.prototype.getvendorList = function () {
        var _this = this;
        return this.http.get(this.vendorlistsUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorList(); });
        });
    };
    VendorEndpointService.prototype.getvendorListForVendor = function (isActive) {
        var _this = this;
        var endpointurl = this.vendorlistsUrl + "?isActive=" + isActive;
        return this.http.get(endpointurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getvendorListForVendor(isActive); });
        });
    };
    VendorEndpointService.prototype.getVendorsDatawithid = function (vendorId) {
        var _this = this;
        var endpointurl = this.vendorListWithId + "/" + vendorId;
        return this.http.get(endpointurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorsDatawithid(vendorId); });
        });
    };
    VendorEndpointService.prototype.getContcatDetails = function (vendorId) {
        var _this = this;
        var endpointUrl = this.contctsUrl + "/" + vendorId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getContcatDetails(vendorId); });
        });
    };
    VendorEndpointService.prototype.getContcatCompleteDetails = function () {
        var _this = this;
        return this.http.get(this.contctsCompleteUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getContcatCompleteDetails(); });
        });
    };
    VendorEndpointService.prototype.getCheckPaymnetDetails = function (vendorId) {
        var _this = this;
        var endpointUrl = this.checkPaymentAddress + "/" + vendorId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getCheckPaymnetDetails(vendorId); });
        });
    };
    VendorEndpointService.prototype.getBeneficiaryCustomerDetails = function () {
        var _this = this;
        return this.http.get(this.bencusAddress, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getBeneficiaryCustomerDetails(); });
        });
    };
    VendorEndpointService.prototype.getEmptyrobj = function () {
        var _this = this;
        return this.http.get(this.contactEmptyurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getEmptyrobj(); });
        });
    };
    VendorEndpointService.prototype.getFinalrobj = function () {
        var _this = this;
        return this.http.get(this.fianlurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getFinalrobj(); });
        });
    };
    VendorEndpointService.prototype.getGeneralrobj = function () {
        var _this = this;
        return this.http.get(this.generalurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getGeneralrobj(); });
        });
    };
    VendorEndpointService.prototype.getPaymentrobj = function () {
        var _this = this;
        return this.http.get(this.paymenturl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getPaymentrobj(); });
        });
    };
    VendorEndpointService.prototype.getAddressDeatails = function () {
        var _this = this;
        return this.http.get(this.addressUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getAddressDeatails(); });
        });
    };
    VendorEndpointService.prototype.getNewVendorEndpoint = function (param) {
        var _this = this;
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._vendorsUrlNew, body, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleErrorCommon(error, function () { return _this.getNewVendorEndpoint(param); });
        });
    };
    VendorEndpointService.prototype.getVendorPoDetails = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._getVendorForPo, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.saveVendorWarningdata = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._vendorwarningUrl, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.savePurchaseorderdetails = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._saveVendorpurchases, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.savePurchaseorderAddress = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._savePOAddress, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.savesaveRepairorderorderdetails = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._saveVendorrepaire, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.savePurchaseorderdetailspart = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._saveVendorpurchasespart, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.saveRepaireorderpartrdetailspart = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._saveVendorrepairepart, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.getNewShipppinginfo = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http
            .post(this._shippingInfoUrl, body, this.getRequestHeaders())
            .map(function (res) { return res; })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.getNewBillinginfo = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http
            .post(this._billingInfoUrl, body, this.getRequestHeaders())
            .map(function (res) { return res; })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.createNewBillinginfo = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http
            .post(this._billingInfoNew, body, this.getRequestHeaders())
            .map(function (res) { return res; })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.updateShipAddressDetails = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http
            .post(this._updateShipAddressDetails, body, this.getRequestHeaders())
            .map(function (res) { return res.json(); })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.saveShipViaDetails = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http
            .post(this._saveShipViaDetails, body, this.getRequestHeaders())
            .map(function (res) { return res; })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.saveInterShipViaDetails = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http
            .post(this._saveShipViaInterDetails, body, this.getRequestHeaders())
            .map(function (res) { return res; })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.saveBillViaDetails = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http
            .post(this._saveBillViaDetails, body, this.getRequestHeaders())
            .map(function (res) { return res; })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.addShipViaDetails = function (roleObject, vendorId) {
        var _this = this;
        var endpointUrl = this._addShipViaDetails + "/" + vendorId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.addShipViaDetails(roleObject, vendorId); });
        });
    };
    VendorEndpointService.prototype.updateVendorIsDelete = function (roleObject) {
        var _this = this;
        var endpointUrl = this._updateVendorIsDelete + "/" + roleObject.vendorId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateVendorIsDelete(roleObject); });
        });
    };
    VendorEndpointService.prototype.getNewShipppinginfoWithAddressId = function (param, addressId) {
        param.vendorShippingAddressId = addressId;
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http
            .post(this._shippingInfoUrl, body, this.getRequestHeaders())
            .map(function (res) { return res.json(); })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.getNewBillinginfoWithAddressId = function (param, addressId) {
        param.vendorBillingAddressId = addressId;
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http
            .post(this._billingInfoUrl, body, this.getRequestHeaders())
            .map(function (res) { return res.json(); })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.getNewVendorContactInfo = function (param) {
        var _this = this;
        delete param.contactId;
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._vendorsContctUrl, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getNewVendorContactInfo(param); });
        });
    };
    VendorEndpointService.prototype.addPaymentCheckinfo = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._addpaymentUrl, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.addPaymentDomesticinfo = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._adddomesticpaymentUrl, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.addPaymentInternationalinfo = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._addinternationalpaymentUrl, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.addPaymentDefaultinfo = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._adddefaultpaymentUrl, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.AddvendorContactDetails = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._vendorsUpdateContctUrl, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.updateVendorCheckpayment = function (param, vendorId) {
        param.VendorId = vendorId;
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._vendorCheckpaymentUpdate, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.updateVendorAddressDetails = function (param, vendorId) {
        param.VendorId = vendorId;
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._vendorShipAddressdetails, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.updateVendorDomesticWirePayment = function (param, vendorId) {
        param.VendorId = vendorId;
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._vendorDomesticpaymentUpdate, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.updateVendorInternationalWirePayment = function (param, vendorId) {
        param.VendorId = vendorId;
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._vendorInternationalpaymentUpdate, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.getNewVendorfinanceInfo = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._vendorFinanceUrl, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.getUpdatevendorEndpoint = function (roleObject, addressId, vendorId) {
        var _this = this;
        var endpointUrl = this._vendorsUrlNew + "/" + addressId + "/" + vendorId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdatevendorEndpoint(roleObject, addressId, vendorId); });
        });
    };
    VendorEndpointService.prototype.updateVendorWarnings = function (roleObject) {
        var _this = this;
        var endpointUrl = this._vendorwarningUrl + "/" + roleObject.vendorId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateVendorWarnings(roleObject); });
        });
    };
    VendorEndpointService.prototype.updateVendorListDetails = function (roleObject) {
        var _this = this;
        var endpointUrl = this._vendorUpdateUrl + "/" + roleObject.vendorId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateVendorListDetails(roleObject); });
        });
    };
    VendorEndpointService.prototype.getUpdateContactInfo = function (roleObject, vendorId) {
        var _this = this;
        var endpointUrl = this._vendorsContctUrl + "/" + vendorId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdateContactInfo(roleObject, vendorId); });
        });
    };
    VendorEndpointService.prototype.updateCheckPaymentInfo = function (roleObject, vendorId) {
        var _this = this;
        var endpointUrl = this._checkPaymntUpdateUrl + "/" + vendorId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdateContactInfo(roleObject, vendorId); });
        });
    };
    VendorEndpointService.prototype.updateDomestic = function (roleObject) {
        var _this = this;
        var endpointUrl = this._domesticUpdate + "/" + roleObject.domesticWirePaymentId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateDomestic(roleObject); });
        });
    };
    VendorEndpointService.prototype.updateDefaults = function (roleObject) {
        var _this = this;
        var endpointUrl = this._defaultsUpdate + "/" + roleObject.VendorPaymentMethodId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateDefaults(roleObject); });
        });
    };
    VendorEndpointService.prototype.getUpdateFinanceInfo = function (roleObject, vendorId) {
        var _this = this;
        var endpointUrl = this._vendorFinanceUrl + "/" + vendorId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdateFinanceInfo(roleObject, vendorId); });
        });
    };
    VendorEndpointService.prototype.updateShippinginfo = function (roleObject, vendorId) {
        var _this = this;
        var endpointUrl = this._updateShipvendorAddressDetails + "/" + vendorId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateShippinginfo(roleObject, vendorId); });
        });
    };
    VendorEndpointService.prototype.updateBillinginfo = function (roleObject, vendorId) {
        var _this = this;
        var endpointUrl = this._updateBillvendorAddressDetails + "/" + vendorId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateBillinginfo(roleObject, vendorId); });
        });
    };
    VendorEndpointService.prototype.updateShippingViainfo = function (roleObject, vendorId) {
        var _this = this;
        var endpointUrl = this._updateShippingViaDetails + "/" + vendorId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateShippinginfo(roleObject, vendorId); });
        });
    };
    VendorEndpointService.prototype.updateBillingViainfo = function (roleObject, vendorId) {
        var _this = this;
        var endpointUrl = this._updateBillingViaDetails + "/" + vendorId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateBillinginfo(roleObject, vendorId); });
        });
    };
    VendorEndpointService.prototype.getDeletevendorContactEndpoint = function (roleObject) {
        var _this = this;
        var endpointUrl = this._vendorContactUrlNew + "/" + roleObject.vendorShippingAddressId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getDeletevendorContactEndpoint(roleObject); });
        });
    };
    VendorEndpointService.prototype.deletePOPart = function (roleObject) {
        var _this = this;
        var endpointUrl = this._deletePoPart + "/" + roleObject;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.deletePOPart(roleObject); });
        });
    };
    VendorEndpointService.prototype.deleteROPart = function (roleObject) {
        var _this = this;
        var endpointUrl = this._deleteRoPart + "/" + roleObject;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.deletePOPart(roleObject); });
        });
    };
    VendorEndpointService.prototype.deleteCheckPayment = function (roleObject) {
        var _this = this;
        var endpointUrl = this._deleteCheckPayment + "/" + roleObject;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.deleteCheckPayment(roleObject); });
        });
    };
    VendorEndpointService.prototype.restoreCheckPayment = function (roleObject) {
        var _this = this;
        var endpointUrl = this._restoreCheckPayment + "/" + roleObject;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.restoreCheckPayment(roleObject); });
        });
    };
    VendorEndpointService.prototype.deleteContact = function (contactId, updatedBy) {
        var _this = this;
        var endpointUrl = this._deleteContactUrl + "/" + contactId + "?UpdatedBy=" + updatedBy;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.deleteContact(contactId, updatedBy); });
        });
    };
    VendorEndpointService.prototype.getDeletevendorshippingEndpoint = function (roleObject) {
        var _this = this;
        var endpointUrl = this._vendorShippingAddressUrlDelete + "/" + roleObject.vendorShippingAddressId + "?updatedBy=" + roleObject.updatedBy;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getDeletevendorshippingEndpoint(roleObject); });
        });
    };
    VendorEndpointService.prototype.getRestorevendorshippingEndpoint = function (vendorShippingAddressId, updatedBy) {
        var _this = this;
        var endpointUrl = this._vendorShippingAddressUrlRestore + "/" + vendorShippingAddressId + "?updatedBy=" + updatedBy;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getRestorevendorshippingEndpoint(vendorShippingAddressId, updatedBy); });
        });
    };
    VendorEndpointService.prototype.getDeletevendorshippingViaEndpoint = function (roleObject) {
        var _this = this;
        var endpointUrl = this._vendorShippingAddressViaUrlDelete + "/" + roleObject.vendorShippingId + "?updatedBy=" + roleObject.updatedBy;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getDeletevendorshippingViaEndpoint(roleObject); });
        });
    };
    VendorEndpointService.prototype.restorevendorshippingViaEndpoint = function (roleObject) {
        var _this = this;
        var endpointUrl = this._vendorShippingAddressViaUrlRestore + "/" + roleObject.vendorShippingId + "?updatedBy=" + roleObject.updatedBy;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.restorevendorshippingViaEndpoint(roleObject); });
        });
    };
    VendorEndpointService.prototype.getDeletevendorshipViaInterEndpoint = function (roleObject) {
        var _this = this;
        var endpointUrl = this._vendorShippingAddressViaInterUrlDelete + "/?id=" + roleObject.vendorInternationalShipViaDetailsId + "&updatedBy=" + roleObject.updatedBy;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getDeletevendorshipViaInterEndpoint(roleObject); });
        });
    };
    VendorEndpointService.prototype.getRestorevendorshipViaInterEndpoint = function (roleObject) {
        var _this = this;
        var endpointUrl = this._vendorShippingAddressViaInterUrlRestore + "/?id=" + roleObject.vendorInternationalShipViaDetailsId + "&updatedBy=" + roleObject.updatedBy;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getRestorevendorshipViaInterEndpoint(roleObject); });
        });
    };
    VendorEndpointService.prototype.getHistoryvendorEndpoint = function (vendorId) {
        var _this = this;
        var endpointUrl = this.getContactHistory + "/" + vendorId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getHistoryvendorEndpoint(vendorId); });
        });
    };
    VendorEndpointService.prototype.getCheckPaymentHist = function (vendorId) {
        var _this = this;
        var endpointUrl = this.getCheckPayHist + "/" + vendorId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getCheckPaymentHist(vendorId); });
        });
    };
    VendorEndpointService.prototype.getVendndorhistory = function (vendorId) {
        var _this = this;
        var endpointUrl = this.getVendorhistory + "/" + vendorId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendndorhistory(vendorId); });
        });
    };
    VendorEndpointService.prototype.gethistoryOfcheckpayment = function (vendorId) {
        var _this = this;
        var endpointUrl = this.getcheckhistory + "/" + vendorId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.gethistoryOfcheckpayment(vendorId); });
        });
    };
    VendorEndpointService.prototype.getShipviaHistory = function (vendorId) {
        var _this = this;
        var endpointUrl = this.getShipViaHistory + "/" + vendorId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getShipviaHistory(vendorId); });
        });
    };
    VendorEndpointService.prototype.getShipviaHistoryInter = function (id) {
        var _this = this;
        var endpointUrl = this.getShipViaHistoryInter + "/" + id;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getShipviaHistoryInter(id); });
        });
    };
    VendorEndpointService.prototype.getBillviaHistory = function (vendorId) {
        var _this = this;
        var endpointUrl = this.getShipViaHistory + "/" + vendorId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getBillviaHistory(vendorId); });
        });
    };
    VendorEndpointService.prototype.getShipaddressHistory = function (vendorId) {
        var _this = this;
        var endpointUrl = this.getshipaddresshistory + "/" + vendorId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getShipaddressHistory(vendorId); });
        });
    };
    VendorEndpointService.prototype.getBilladdressHistory = function (vendorId) {
        var _this = this;
        var endpointUrl = this.getbilladdresshistory + "/" + vendorId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getBilladdressHistory(vendorId); });
        });
    };
    VendorEndpointService.prototype.getDiscountEndpoint = function () {
        var _this = this;
        return this.http.get(this._actionsUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getDiscountEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getNewDiscount = function (userObject) {
        var _this = this;
        return this.http.post(this._newDiscount, JSON.stringify(userObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getNewDiscount(userObject); });
        });
    };
    VendorEndpointService.prototype.getupdateDiscount = function (roleObject, discountId) {
        var _this = this;
        var endpointUrl = this._discountPutUrl + "/" + discountId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getupdateDiscount(roleObject, discountId); });
        });
    };
    VendorEndpointService.prototype.getVendorByNameList = function (vendorName) {
        var _this = this;
        var url = this.listUrl + "/" + vendorName;
        return this.http.get(url, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorByNameList(vendorName); });
        });
    };
    VendorEndpointService.prototype.getUpdatevendorEndpointforActive = function (roleObject, vendorId) {
        var _this = this;
        var endpointUrl = this._updateActiveInactive + "/" + roleObject.vendorId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdatevendorsEndpoint(roleObject, vendorId); });
        });
    };
    VendorEndpointService.prototype.getUpdatevendorsEndpoint = function (roleObject, vendorId) {
        var _this = this;
        var endpointUrl = this._vendorsUrlNew + "/" + vendorId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdatevendorsEndpoint(roleObject, vendorId); });
        });
    };
    VendorEndpointService.prototype.getUpdatevendorContactEndpointforActive = function (roleObject, contactId) {
        var _this = this;
        var endpointUrl = this._updateActiveInactiveforContact + "/" + roleObject.contactId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdatevendorContactEndpoint(roleObject, contactId); });
        });
    };
    VendorEndpointService.prototype.getUpdatevendorContactEndpoint = function (roleObject, contactId) {
        var _this = this;
        var endpointUrl = this._vendorsUrlNew + "/" + contactId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdatevendorContactEndpoint(roleObject, contactId); });
        });
    };
    VendorEndpointService.prototype.getUpdatevendorpaymentEndpointforActive = function (checkpayment) {
        var _this = this;
        var endpointUrl = this._updateActiveInactiveforpayment + "/" + checkpayment.checkPaymentId;
        return this.http.put(endpointUrl, JSON.stringify(checkpayment), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdatevendorpaymentEndpoint(checkpayment); });
        });
    };
    VendorEndpointService.prototype.getUpdatevendorpaymentEndpoint = function (checkpayment) {
        var _this = this;
        var endpointUrl = this._vendorsUrlNew + "/" + checkpayment;
        return this.http.put(endpointUrl, JSON.stringify(checkpayment), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdatevendorpaymentEndpoint(checkpayment); });
        });
    };
    VendorEndpointService.prototype.getUpdatevendorEndpointforActiveforshipping = function (roleObject, vendorShippingAddressId) {
        var _this = this;
        var endpointUrl = this._updateActiveInactivefordshipping + "/" + roleObject.vendorShippingAddressId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdatevendorsEndpointforshipping(roleObject, vendorShippingAddressId); });
        });
    };
    VendorEndpointService.prototype.getUpdatevendorEndpointforActiveforbilling = function (roleObject, vendorBillingAddressId) {
        var _this = this;
        var endpointUrl = this._updateActiveInactivefordbilling + "/" + roleObject.vendorBillingAddressId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdatevendorsEndpointforshipping(roleObject, vendorBillingAddressId); });
        });
    };
    VendorEndpointService.prototype.getUpdatevendorEndpointforActiveforshipViaDetails = function (roleObject, vendorShippingId) {
        var _this = this;
        var endpointUrl = this._updateActiveInactivefordshipviaDetails + "/" + roleObject.vendorShippingId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdatevendorsEndpointforshipping(roleObject, vendorShippingId); });
        });
    };
    VendorEndpointService.prototype.getUpdatevendorsEndpointforshipping = function (roleObject, vendorShippingAddressId) {
        var _this = this;
        var endpointUrl = this._vendorsUrlNew + "/" + vendorShippingAddressId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getUpdatevendorsEndpointforshipping(roleObject, vendorShippingAddressId); });
        });
    };
    VendorEndpointService.prototype.getPurchaseOrderList = function () {
        var _this = this;
        return this.http.get(this.stockLinepolisturl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getPurchaseOrderList(); });
        });
    };
    VendorEndpointService.prototype.getPOList = function (data) {
        var _this = this;
        return this.http.post(this.polisturl, JSON.stringify(data), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getPOList(data); });
        });
    };
    VendorEndpointService.prototype.getcountryListEndpoint = function () {
        var _this = this;
        return this.http.get(this.countryUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getcountryListEndpoint(); });
        });
    };
    VendorEndpointService.prototype.getRepaireOrderList = function () {
        var _this = this;
        return this.http.get(this.rolisturl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getRepaireOrderList(); });
        });
    };
    VendorEndpointService.prototype.getATASubchapterDataEndpoint = function (mainId) {
        var _this = this;
        var endpointUrl = this._actionsUrlNew2 + "/" + mainId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getATASubchapterDataEndpoint(mainId); });
        });
    };
    //for new Vendor Capability Post
    VendorEndpointService.prototype.newVendorCapabilityEndPoint = function (userObject) {
        var _this = this;
        return this.http.post(this._vendorCapability, JSON.stringify(userObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.newVendorCapabilityEndPoint(userObject); });
        });
    };
    VendorEndpointService.prototype.newVendorCapabilityTypeListEndPoint = function (userObject) {
        var _this = this;
        return this.http.post(this._vendorCapabilityType, JSON.stringify(userObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.newVendorCapabilityTypeListEndPoint(userObject); });
        });
    };
    VendorEndpointService.prototype.newVendorCapabilityAircraftTypeEndPoint = function (userObject) {
        var _this = this;
        return this.http.post(this._vendorCapabilityAircraftType, JSON.stringify(userObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.newVendorCapabilityAircraftTypeEndPoint(userObject); });
        });
    };
    VendorEndpointService.prototype.newVendorCapabiltiyAircraftModelEndPoint = function (userObject) {
        var _this = this;
        return this.http.post(this._vendorCapabilityAircraftModel, JSON.stringify(userObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.newVendorCapabiltiyAircraftModelEndPoint(userObject); });
        });
    };
    VendorEndpointService.prototype.getVendorCapabilityListEndpoint = function (vendorId) {
        var _this = this;
        var url = this.vendorCapabilityurl + "/" + vendorId;
        return this.http.get(url, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorCapabilityListEndpoint(vendorId); });
        });
    };
    VendorEndpointService.prototype.getVendorCapabilityAircraftManafacturerListEndpoint = function (vendorId) {
        var _this = this;
        var url = this.vendorManufacturerurl + "/" + vendorId;
        return this.http.get(url, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorCapabilityAircraftManafacturerListEndpoint(vendorId); });
        });
    };
    VendorEndpointService.prototype.getVendorCapabilityAircraftManafacturerModelListEndpoint = function (vendorId) {
        var _this = this;
        var url = this.vendorManufacturerModelurl + "/" + vendorId;
        return this.http.get(url, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorCapabilityAircraftManafacturerModelListEndpoint(vendorId); });
        });
    };
    //for updating stockline
    VendorEndpointService.prototype.getupdateVendorCapabilityEndpoint = function (roleObject, vendorCapabilityId) {
        var _this = this;
        var endpointUrl = this._vendorCapabilityUpdate + "/" + roleObject.vendorCapabilityId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getupdateVendorCapabilityEndpoint(roleObject, vendorCapabilityId); });
        });
    };
    VendorEndpointService.prototype.getDeletevendorCapabilityTypeEndpoint = function (capabilityid) {
        var _this = this;
        var endpointUrl = this._deleteVendorCapabilityTypeUrl + "/" + capabilityid;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getDeletevendorCapabilityTypeEndpoint(capabilityid); });
        });
    };
    VendorEndpointService.prototype.getDeletevendorCapabilityAircraftManafacturerEndpoint = function (capabilityid) {
        var _this = this;
        var endpointUrl = this._deleteVendorCapabilityAircraftManufacturer + "/" + capabilityid;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getDeletevendorCapabilityAircraftManafacturerEndpoint(capabilityid); });
        });
    };
    VendorEndpointService.prototype.getDeletevendorCapabilityAircraftModelEndpoint = function (capabilityid) {
        var _this = this;
        var endpointUrl = this._deleteVendorCapabilityAircraftModel + "/" + capabilityid;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getDeletevendorCapabilityAircraftModelEndpoint(capabilityid); });
        });
    };
    VendorEndpointService.prototype.deleteVendorCapabilityEndpoint = function (capabilityid, UpdatedBy) {
        var _this = this;
        var endpointUrl = this._deleteVendorCapability + "/" + capabilityid + "?UpdatedBy=" + UpdatedBy;
        return this.http["delete"](endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.deletePOPart(capabilityid); });
        });
    };
    VendorEndpointService.prototype.getVendorContactEndpoint = function (vendorId, isDContact) {
        var _this = this;
        var url = this._getVendorContactByID + "/" + vendorId + "/" + isDContact;
        return this.http.get(url, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorContactEndpoint(vendorId, isDContact); });
        });
    };
    VendorEndpointService.prototype.getVendorContactsByIDEndpoint = function (vendorId) {
        var _this = this;
        var url = this._vendorContactsGetByID + "?vendorId=" + vendorId;
        return this.http.get(url, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorContactsByIDEndpoint(vendorId); });
        });
    };
    VendorEndpointService.prototype.getVendorsForDropdownEndPoint = function () {
        var _this = this;
        return this.http.get(this.vendorsForDropDownURL, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorsForDropdownEndPoint(); });
        });
    };
    VendorEndpointService.prototype.getVendorbillingsitenames = function (vendorId) {
        var _this = this;
        return this.http.get(this.configurations.baseUrl + "/api/Vendor/vendorbillingsitenames?vendorId=" + vendorId)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorbillingsitenames(vendorId); });
        });
    };
    VendorEndpointService.prototype.getVendorAddressById = function (vendorId) {
        var _this = this;
        return this.http.get(this.configurations.baseUrl + "/api/Vendor/vendorbillingaddressbyid?billingAddressId=" + vendorId)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorAddressById(vendorId); });
        });
    };
    VendorEndpointService.prototype.saveRepairorderdetails = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._saveVendorRepairOrder, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.saveRepairOrderAddress = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._saveROAddress, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.saveRepairorderdetailspart = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._saveVendorRepairOrderPart, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.error || 'Server error'); });
    };
    VendorEndpointService.prototype.getROStatus = function (repairOrderId, isActive, updatedBy) {
        var _this = this;
        return this.http.put(this.configurations.baseUrl + "/api/Vendor/roStatus?repairOrderId=" + repairOrderId + "&isActive=" + isActive + "&updatedBy=" + updatedBy, {}, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getROStatus(repairOrderId, isActive, updatedBy); });
        });
    };
    VendorEndpointService.prototype.deleteRO = function (repairOrderId, updatedBy) {
        var _this = this;
        return this.http["delete"](this.configurations.baseUrl + "/api/repairorder/deleteRo?repairOrderId=" + repairOrderId + "&updatedBy=" + updatedBy)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.deleteRO(repairOrderId, updatedBy); });
        });
    };
    VendorEndpointService.prototype.getROHistory = function (repairOrderId) {
        var _this = this;
        return this.http.get(this.configurations.baseUrl + "/api/Vendor/roHistory?repairOrderId=" + repairOrderId)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getROHistory(repairOrderId); });
        });
    };
    VendorEndpointService.prototype.getVendorROById = function (Id) {
        var _this = this;
        var endPointUrl = this._roByIdUrl + "?repairOrderId=" + Id;
        return this.http.get(endPointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorROById(Id); });
        });
    };
    VendorEndpointService.prototype.getVendorROHeaderById = function (repairOrderId) {
        return this.http.get(this.configurations.baseUrl + "/api/repairorder/roheaderdetails?repairOrderId=" + repairOrderId);
    };
    VendorEndpointService.prototype.getVendorROAddressById = function (repairOrderId) {
        return this.http.get(this.configurations.baseUrl + "/api/repairorder/roaddressdetails?repairOrderId=" + repairOrderId);
    };
    VendorEndpointService.prototype.getRepairOrderPartsById = function (Id, workOrderPartNumberId) {
        var _this = this;
        var endPointUrl = this._roPartByIdUrl + "?repairOrderId=" + Id + "&workOrderPartNoId=" + workOrderPartNumberId;
        return this.http.get(endPointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getRepairOrderPartsById(Id, workOrderPartNumberId); });
        });
    };
    VendorEndpointService.prototype.getPurchaseOrderByItemId = function (Id) {
        var _this = this;
        var endPointUrl = this._poPartByItemIdUrl + "?itemMasterId=" + Id;
        return this.http.get(endPointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getPurchaseOrderByItemId(Id); });
        });
    };
    VendorEndpointService.prototype.getRepiarOrderByItemId = function (Id) {
        var _this = this;
        var endPointUrl = this._roPartByItemIdUrl + "?itemMasterId=" + Id;
        return this.http.get(endPointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getRepiarOrderByItemId(Id); });
        });
    };
    VendorEndpointService.prototype.getROViewById = function (repairOrderId) {
        return this.http.get(this.configurations.baseUrl + "/api/repairorder/roViewById?repairOrderId=" + repairOrderId);
    };
    VendorEndpointService.prototype.getROPartsViewById = function (repairOrderId) {
        return this.http.get(this.configurations.baseUrl + "/api/repairorder/roPartsViewById?repairOrderId=" + repairOrderId);
    };
    VendorEndpointService.prototype.getROList = function (data) {
        var _this = this;
        return this.http.post(this.roListWithFiltersUrl, JSON.stringify(data), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getROList(data); });
        });
    };
    VendorEndpointService.prototype.saveCreateROApproval = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(this._saveCreateROApproval, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.updateROApproval = function (param) {
        var body = JSON.stringify(param);
        var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.put(this._updateROApproval, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.getROApproverList = function (repairOrderId) {
        return this.http.get(this.configurations.baseUrl + "/api/Vendor/roApproversList?repairOrderId=" + repairOrderId);
    };
    VendorEndpointService.prototype.getReceivingROList = function () {
        return this.http.get(this.configurations.baseUrl + "/api/Vendor/recevingRoList");
    };
    VendorEndpointService.prototype.getROTotalCostById = function (repairOrderId) {
        return this.http.get(this.configurations.baseUrl + "/api/repairorder/getrototalcost?repairOrderId=" + repairOrderId);
    };
    VendorEndpointService.prototype.getApproversListByTaskIdModuleAmt = function (taskId, moduleAmount) {
        return this.http.get(this.configurations.baseUrl + "/api/approvalrule/approverslist?approvalTaskId=" + taskId + "&moduleAmount=" + moduleAmount);
    };
    VendorEndpointService.prototype.getROApprovalListById = function (repairOrderId) {
        return this.http.get(this.configurations.baseUrl + "/api/repairorder/getroapprovallist?repairOrderId=" + repairOrderId);
    };
    VendorEndpointService.prototype.saveRepairOrderApproval = function (param) {
        var url = this.configurations.baseUrl + "/api/repairorder/repairorderapproval";
        var body = JSON.stringify(param);
        return this.http.post(url, body, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.getVendorPOMemolist = function (vendorId) {
        var _this = this;
        var endpointUrl = this._getVendorPOmemolist + "?vendorId=" + vendorId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorPOMemolist(vendorId); });
        });
    };
    VendorEndpointService.prototype.getVendorROMemolist = function (vendorId) {
        var _this = this;
        var endpointUrl = this._getVendorROmemolist + "?vendorId=" + vendorId;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorROMemolist(vendorId); });
        });
    };
    VendorEndpointService.prototype.updateVendorPOROmemolist = function (id, type, memoText, updatedBy) {
        return this.http.put(this._updateVendorPOROmemolist + "?id=" + id + "&type=" + type + "&memoText=" + memoText + "&updatedBy=" + updatedBy, {}, this.getRequestHeaders());
    };
    VendorEndpointService.prototype.getDocumentList = function (vendorId, isDeleted) {
        return this.http.get(this._getVendorDocslist + "/" + vendorId + "?isDeleted=" + isDeleted, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.getDocumentUploadEndpoint = function (file) {
        var headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post("" + this._addDocumentDetails, file);
    };
    VendorEndpointService.prototype.getDocumentListbyId = function (vendorDocumentId) {
        return this.http.get(this._getVendorDocsDetailsById + "/" + vendorDocumentId, this.getRequestHeaders())
            .map(function (response) {
            return response;
        })["catch"](function (error) { return Observable_1.Observable["throw"](error.json().error || 'Server error'); });
    };
    VendorEndpointService.prototype.getUpdateDocumentUploadEndpoint = function (file) {
        var headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.put("" + this._updateDocumentDetails, file);
    };
    VendorEndpointService.prototype.GetUploadDocumentsList = function (attachmentId, vendorId, moduleId) {
        return this.http.get(this._getVendorDocumentAttachmentslist + "?attachmentId=" + attachmentId + "&referenceId=" + vendorId + "&moduleId=" + moduleId, this.getRequestHeaders());
    };
    VendorEndpointService.prototype.getdeleteDocumentListbyId = function (vendorDocumentId) {
        return this.http["delete"](this._getVendorDeleteDocsDetailsById + "/" + vendorDocumentId, this.getRequestHeaders());
    };
    VendorEndpointService.prototype.getVendorShippingAuditHistory = function (vendorId, vendorShippingAddressId) {
        return this.http.get(this._getVendorShippingHistory + "?vendorId=" + vendorId + "&vendorShippingAddressId=" + vendorShippingAddressId, this.getRequestHeaders());
    };
    VendorEndpointService.prototype.getVendorBillingAuditHistory = function (vendorId, vendorBillingaddressId) {
        return this.http.get(this._getVendorBillingHistory + "?vendorId=" + vendorId + "&vendorBillingaddressId=" + vendorBillingaddressId, this.getRequestHeaders());
    };
    VendorEndpointService.prototype.getVendorContactAuditHistory = function (vendorId, vendorContactId) {
        return this.http.get(this._getVendorContactHistory + "?vendorId=" + vendorId + "&vendorContactId=" + vendorContactId, this.getRequestHeaders());
    };
    VendorEndpointService.prototype.getVendorDocumentAuditHistory = function (id) {
        return this.http.get(this._getVendorDocumentHistory + "/" + id, this.getRequestHeaders());
    };
    VendorEndpointService.prototype.getVendorCapabilityAuditHistory = function (VendorCapabilityId, VendorId) {
        return this.http.get(this._getVendorCapabilityHistory + "?VendorCapabilityId=" + VendorCapabilityId + "&VendorId=" + VendorId, this.getRequestHeaders());
    };
    VendorEndpointService.prototype.updateBillAddressDetails = function (roleObject, vendorBillingAddressId) {
        var _this = this;
        var endpointUrl = this._updateVendorBillAddressDetails + "/" + roleObject.vendorBillingAddressId;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateBillAddressDetails(roleObject, vendorBillingAddressId); });
        });
    };
    VendorEndpointService.prototype.vendorGeneralDocumentUploadEndpoint = function (file, vendorId, moduleId, moduleName, uploadedBy, masterCompanyId) {
        var headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post(this._addVendorDocumentDetails + "?referenceId=" + vendorId + "&moduleId=" + moduleId + "&moduleName=" + moduleName + "&uploadedBy=" + uploadedBy + "&masterCompanyId=" + masterCompanyId, file);
    };
    VendorEndpointService.prototype.vendorGeneralFileUploadEndpoint = function (file) {
        var headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post("" + this._addVendorFileUpload, file);
    };
    VendorEndpointService.prototype.GetVendorGeneralDocumentsListEndpoint = function (vendorId, moduleId) {
        return this.http.get(this._addVendorgeneralFileDetails + "/" + vendorId + "?moduleId=" + moduleId, this.getRequestHeaders());
    };
    VendorEndpointService.prototype.GetVendorAttachmentDeleteEndpoint = function (attachmentDetailId, updatedBy) {
        return this.http["delete"](this._vendorDeleteAttachment + "/" + attachmentDetailId + "?updatedBy=" + updatedBy, this.getRequestHeaders());
    };
    VendorEndpointService.prototype.getVendorProcess1099id = function (companyId) {
        var _this = this;
        var endpointurl = this.vendorProcess1099Id + "?companyId=" + companyId;
        return this.http.get(endpointurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorProcess1099id(companyId); });
        });
    };
    VendorEndpointService.prototype.getVendorProcess1099idFromTransaction = function (vendorId) {
        var _this = this;
        var endpointurl = this.vendorProcess1099IdFromTransaction + "?vendorId=" + vendorId;
        return this.http.get(endpointurl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorProcess1099idFromTransaction(vendorId); });
        });
    };
    VendorEndpointService.prototype.repairOrderGlobalSearch = function (filterText, pageNumber, pageSize, vendorId) {
        return this.http.get(this.configurations.baseUrl + "/api/Vendor/roglobalsearch?filterText=" + filterText + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&vendorId=" + vendorId);
    };
    VendorEndpointService.prototype.GetVendorBillingAddressDeleteEndpoint = function (billingAddressId, updatedBy) {
        var _this = this;
        return this.http.get(this._deleteVendorBillingAddressDelete + "?billingAddressId=" + billingAddressId + "&updatedBy=" + updatedBy, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.GetVendorBillingAddressDeleteEndpoint(billingAddressId, updatedBy); });
        });
    };
    VendorEndpointService.prototype.GetVendorBillingAddressRestoreEndpoint = function (billingAddressId, updatedBy) {
        var _this = this;
        return this.http.get(this._restoreVendorBillingAddressDelete + "?billingAddressId=" + billingAddressId + "&updatedBy=" + updatedBy, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.GetVendorBillingAddressDeleteEndpoint(billingAddressId, updatedBy); });
        });
    };
    VendorEndpointService.prototype.GetUpdateVendorBillingAddressStatusEndpoint = function (billingAddressId, status, updatedBy) {
        var _this = this;
        return this.http.get(this._updateVendorBillingAddressStatus + "?billingAddressId=" + billingAddressId + "&status=" + status + "&updatedBy=" + updatedBy, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.GetUpdateVendorBillingAddressStatusEndpoint(billingAddressId, status, updatedBy); });
        });
    };
    VendorEndpointService.prototype.getHistoryForVendor = function (vendorId) {
        var _this = this;
        return this.http.get(this.configurations.baseUrl + "/api/Vendor/GetVendorAuditHistory/" + vendorId)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getHistoryForVendor(vendorId); });
        });
    };
    VendorEndpointService.prototype.getVendorCapabilityByVendorId = function (vendorId) {
        return this.http.get(this.configurations.baseUrl + "/api/Vendor/getVendorCapabilityByVendorId?vendorId=" + vendorId);
    };
    VendorEndpointService.prototype.getVendorDataById = function (vendorId) {
        var _this = this;
        return this.http.get(this.configurations.baseUrl + "/api/Vendor/getvendordatabyid/" + vendorId)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorDataById(vendorId); });
        });
    };
    VendorEndpointService.prototype.getAllVendorList = function (data) {
        var _this = this;
        return this.http.post(this.vendorListUrl, JSON.stringify(data), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getAllVendorList(data); });
        });
    };
    VendorEndpointService.prototype.vendorListGlobalSearch = function (filterText, pageNumber, pageSize, isActive) {
        return this.http.get(this.configurations.baseUrl + "/api/Vendor/vendorglobalsearch?filterText=" + filterText + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&isActive=" + isActive);
    };
    VendorEndpointService.prototype.VendorBillingFileUpload = function (file, vendorId) {
        return this.http.post("" + this.configurations.baseUrl + this.excelUploadBilling + "?vendorId=" + vendorId, file);
    };
    VendorEndpointService.prototype.VendorShippingFileUpload = function (file, vendorId) {
        return this.http.post("" + this.configurations.baseUrl + this.excelUploadShipping + "?vendorId=" + vendorId, file);
    };
    VendorEndpointService.prototype.VendorInternationalShippingFileUpload = function (file, vendorId) {
        return this.http.post("" + this.configurations.baseUrl + this.excelUploadInternationalShipping + "?vendorId=" + vendorId, file);
    };
    VendorEndpointService.prototype.VendorContactFileUpload = function (file, vendorId) {
        return this.http.post("" + this.configurations.baseUrl + this.excelUploadContact + "?vendorId=" + vendorId, file);
    };
    VendorEndpointService.prototype.VendorCheckPaymentFileUpload = function (file, vendorId) {
        return this.http.post("" + this.configurations.baseUrl + this.excelUploadPayment + "?vendorId=" + vendorId, file);
    };
    VendorEndpointService.prototype.getInternationalShippingByVendorId = function (vendorId) {
        var _this = this;
        return this.http.get(this.configurations.baseUrl + "/api/Vendor/internationalshippingdetaillist?VendorId=" + vendorId)["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorDataById(vendorId); });
        });
    };
    VendorEndpointService.prototype.postInternationalShipping = function (data) {
        var _this = this;
        return this.http.post(this.configurations.baseUrl + "/api/Vendor/createinternationalshipping", JSON.stringify(data), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.postInternationalShipping(data); });
        });
    };
    VendorEndpointService.prototype.updateInternationalShipping = function (data) {
        var _this = this;
        return this.http.post(this.configurations.baseUrl + "/api/Vendor/createinternationalshipping", JSON.stringify(data), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateInternationalShipping(data); });
        });
    };
    VendorEndpointService.prototype.getInternationalShippingById = function (vendorInternationalShippingId) {
        var _this = this;
        return this.http.get(this.configurations.baseUrl + "/api/Vendor/internationalshippingdetailsbyid/" + vendorInternationalShippingId, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getInternationalShippingById(vendorInternationalShippingId); });
        });
    };
    VendorEndpointService.prototype.getVendorInternationalAuditHistory = function (vendorInternationalShippingId) {
        var _this = this;
        return this.http.get(this.configurations.baseUrl + "/api/Vendor/internationalshippingaudit/" + vendorInternationalShippingId, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorInternationalAuditHistory(vendorInternationalShippingId); });
        });
    };
    VendorEndpointService.prototype.deleteVendorInternationalShipping = function (vendorId, updatedBy) {
        var _this = this;
        return this.http["delete"](this.configurations.baseUrl + "/api/Vendor/deleteinternationalshipping?id=" + vendorId + "&updatedBy=" + updatedBy, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.deleteVendorInternationalShipping(vendorId, updatedBy); });
        });
    };
    VendorEndpointService.prototype.updateStatusForInternationalShipping = function (vendorInternationalShippingId, status, updatedBy) {
        var _this = this;
        return this.http.put(this.configurations.baseUrl + "/api/Vendor/internationalshippingstatusupdate?id=" + vendorInternationalShippingId + "&status=" + status + "&updatedBy=" + updatedBy, {}, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateStatusForInternationalShipping(vendorInternationalShippingId, status, updatedBy); });
        });
    };
    VendorEndpointService.prototype.updateStatusForInternationalShippingVia = function (id, status, updatedBy) {
        var _this = this;
        return this.http.put(this.configurations.baseUrl + "/api/Vendor/internationalshipviastatusupdate?id=" + id + "&status=" + status + "&updatedBy=" + updatedBy, {}, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateStatusForInternationalShippingVia(id, status, updatedBy); });
        });
    };
    VendorEndpointService.prototype.updateStatusForDomesticShippingVia = function (id, status, updatedBy) {
        var _this = this;
        return this.http.put(this.configurations.baseUrl + "/api/Vendor/vendorshippingstatus?id=" + id + "&status=" + status + "&updatedBy=" + updatedBy, {}, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateStatusForDomesticShippingVia(id, status, updatedBy); });
        });
    };
    VendorEndpointService.prototype.getATAMappingByContactId = function (contactId, isDeleted) {
        var _this = this;
        var endpointUrl = this.configurations.baseUrl + "/api/Vendor/getVendorContactATAMapped/" + contactId + "?isDeleted=" + isDeleted;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getATAMappingByContactId(contactId, isDeleted); });
        });
    };
    VendorEndpointService.prototype.postVendorContactATAMapped = function (data) {
        var _this = this;
        var url = this.configurations.baseUrl + "/api/Vendor/VendorContactATAPost";
        return this.http.post(url, JSON.stringify(data), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.postVendorContactATAMapped(data); });
        });
    };
    VendorEndpointService.prototype.updateVendorContactATAMApped = function (data) {
        var _this = this;
        var url = this.configurations.baseUrl + "/api/Vendor/VendorContactATAUpdate/" + data.vendorContactATAMappingId;
        return this.http.put(url, JSON.stringify(data), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.updateVendorContactATAMApped(data); });
        });
    };
    VendorEndpointService.prototype.deleteATAMappedByContactId = function (contactId) {
        var _this = this;
        return this.http["delete"](this.configurations.baseUrl + "/api/Vendor/DeleteVendorContactATAMapping/" + contactId, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.deleteATAMappedByContactId(contactId); });
        });
    };
    VendorEndpointService.prototype.restoreATAMappedByContactId = function (contactId) {
        var _this = this;
        return this.http["delete"](this.configurations.baseUrl + "/api/Vendor/RestoreVendorContactATAMapping/" + contactId, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.restoreATAMappedByContactId(contactId); });
        });
    };
    VendorEndpointService.prototype.getVendorContactATAAuditDetails = function (vendorContactATAMappingId) {
        var _this = this;
        var url = this.configurations.baseUrl + "/api/Vendor/getVendorATAMappedAudit/" + vendorContactATAMappingId;
        return this.http.get(url, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorContactATAAuditDetails(vendorContactATAMappingId); });
        });
    };
    VendorEndpointService.prototype.getATAMappedByVendorId = function (id, isDeleted) {
        var _this = this;
        var url = this.configurations.baseUrl + "/api/Vendor/getVendorATAMapped/" + id + "?isDeleted=" + isDeleted;
        return this.http.get(url, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getATAMappedByVendorId(id, isDeleted); });
        });
    };
    VendorEndpointService.prototype.searchATAMappedByMultiATAIDATASUBIDByVendorId = function (vendorId, searchUrl) {
        var _this = this;
        var endpointUrl = this.configurations.baseUrl + "/api/Vendor/searchGetVendorATAMappedByMultiATAIDATASubID?vendorId=" + vendorId + "&" + searchUrl;
        return this.http.get(endpointUrl, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.searchATAMappedByMultiATAIDATASUBIDByVendorId(vendorId, searchUrl); });
        });
    };
    VendorEndpointService.prototype.getContactsByVendorId = function (vendorId) {
        var _this = this;
        var url = this.configurations.baseUrl + "/api/vendor/GetContactsByVendorId?id=" + vendorId;
        return this.http.get(url, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getContactsByVendorId(vendorId); });
        });
    };
    VendorEndpointService.prototype.getReceivingPOList = function (data) {
        var _this = this;
        return this.http.post(this._receivingPOList, JSON.stringify(data), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getReceivingPOList(data); });
        });
    };
    VendorEndpointService.prototype.getReceivingPOListGlobal = function (data) {
        var _this = this;
        return this.http.post(this._receivingPOListGlobal, JSON.stringify(data), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getReceivingPOListGlobal(data); });
        });
    };
    VendorEndpointService.prototype.getAllReceivingROList = function (data) {
        var _this = this;
        return this.http.post(this._receivingROList, JSON.stringify(data), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getAllReceivingROList(data); });
        });
    };
    VendorEndpointService.prototype.getReceivingROListGlobal = function (data) {
        var _this = this;
        return this.http.post(this._receivingROListGlobal, JSON.stringify(data), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getReceivingROListGlobal(data); });
        });
    };
    VendorEndpointService.prototype.getVendorNameCodeListwithFilter = function (filterVal, count, idList) {
        var _this = this;
        return this.http.get(this.configurations.baseUrl + "/api/vendor/vendorDataFilter?filterVal=" + filterVal + "&count=" + count + "&idList=" + (idList !== undefined ? idList : '0'), this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorNameCodeListwithFilter(filterVal, count, idList); });
        });
    };
    VendorEndpointService.prototype.getVendorNameCodeList = function () {
        var _this = this;
        var url = this.configurations.baseUrl + "/api/vendor/vendordataforporo";
        return this.http.get(url, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorNameCodeList(); });
        });
    };
    VendorEndpointService.prototype.getVendorContactDataByVendorId = function (id) {
        var _this = this;
        var url = this.configurations.baseUrl + "/api/vendor/vendorcontactdatabyvendorid/" + id;
        return this.http.get(url, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorContactDataByVendorId(id); });
        });
    };
    VendorEndpointService.prototype.getVendorCreditTermsByVendorId = function (id) {
        var _this = this;
        var url = this.configurations.baseUrl + "/api/vendor/vendorcreditterms/" + id;
        return this.http.get(url, this.getRequestHeaders())["catch"](function (error) {
            return _this.handleError(error, function () { return _this.getVendorCreditTermsByVendorId(id); });
        });
    };
    VendorEndpointService = __decorate([
        core_1.Injectable()
    ], VendorEndpointService);
    return VendorEndpointService;
}(endpoint_factory_service_1.EndpointFactory));
exports.VendorEndpointService = VendorEndpointService;
