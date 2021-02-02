import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { Vendor } from '../models/vendor.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class VendorEndpointService extends EndpointFactory {
	localCollection: Response;

	private readonly _vendorUrl: string = "/api/Vendor/Get";
	private readonly _vendorLiteUrl: string = "/api/Vendor/basic"
	private readonly _vendorCapabilityUrl: string = "/api/Vendor/getVendorCapabilityList";
	private readonly _filteredVendorCapabilityListsUrl: string = "/api/Vendor/vendorcapabilitylist";
	private readonly _vendorUrlNew: string = "/api/Vendor/vendor";
	private readonly _partDetails: string = "/api/Vendor/Getpartdetails";
	private readonly _partDetailswithid: string = "/api/Vendor/GetpartdetailsWithid";
	private readonly _partDetailswithidForsinglePart = "/api/Vendor/GetpartdetailsWithidForSinglePart"
	private readonly _saveVendorCapesByVendor: string = environment.baseUrl + "/api/Vendor/PostVendorCapes";
	private readonly _capabilityUrl: string = "/api/Vendor/GetCapabilityList";
	private readonly _vendrUrl: string = "/api/Vendor/GetListDetails";
	private readonly _domesticWIthVendor = "/api/Vendor/GetDomesticWithVedor";
	private readonly _internationalWIthVendor = "/api/Vendor/GetInternationalWithVedor";
	private readonly _defaultwithVendor = "/api/Vendor/GetdefaultListVedor";
	private readonly _Vendercodebyid = "/api/Vendor/GetVendorNameAndCodewithId";
	private readonly _vendorsWithId: string = "/api/Vendor/GetVendorsListwithId";
	private readonly _contacturl: string = "/api/Vendor/ContactGet";
	private readonly _contactGeturl: string = "/api/Vendor/ContactCompleteGet";
	private readonly _checkPaymnetAddressUrl: string = "/api/Vendor/CheckAddress";
	private readonly _bencusAddress: string = "/api/Vendor/BencusAddress";
	private readonly _contactsEmptyObjurl: string = "/api/Vendor/contactEmptyObj";
	private readonly _finalEmptyObjurl: string = "/api/Vendor/fianlEmptyObj";
	private readonly _paymentEmptyObjurl: string = "/api/Vendor/paymentEmptyObj";
	private readonly _generalEmptyObjurl: string = "/api/Vendor/generalEmptyObj";
	private readonly _addressUrl: string = "/api/Vendor/AddressGet";
	private readonly _vendorsUrlNew: string = environment.baseUrl + "/api/Vendor/vendorPost";
	private readonly _getVendorForPo: string = "/api/Vendor/getVendorForPo";
	private readonly _vendorwarningUrl: string = environment.baseUrl + "/api/Vendor/saveVendorWarnings";
	private readonly _saveVendorpurchases: string = "/api/Vendor/saveVendorpurchases";
	private readonly _savePOAddress: string = "/api/Vendor/saveVendorpurchasesAddress";
	private readonly _saveVendorrepaire: string = "/api/Vendor/saveVendorRepairOrder";
	private readonly _saveVendorpurchasespart: string = "/api/Vendor/saveVendorpurchasespart";
	private readonly _saveVendorrepairepart: string = "/api/Vendor/saveVendorRepairPart";
	private readonly _vendorUpdateUrl: string = environment.baseUrl + "/api/Vendor/vendorUpdate";
	private readonly _vendorContactUrlNew: string = "/api/Vendor/updateStatusVenShippingAddress";
	private readonly _deleteCheckPayment: string = environment.baseUrl +"/api/Vendor/deleteCheckPayment";
	private readonly _restoreCheckPayment: string = environment.baseUrl + "/api/Vendor/restoreCheckPayment";
	private readonly _deleteContactUrl: string = environment.baseUrl + "/api/Vendor/vendorContact";
	private readonly _vendorShippingUrlNew: string = "/api/Vendor/updateStatusVendorShipping";
	private readonly _vendorShippingAddressUrlDelete: string = environment.baseUrl + "/api/Vendor/deletevendorshippingaddress";
	private readonly _vendorShippingAddressUrlRestore: string = environment.baseUrl + "/api/Vendor/restorevendorshippingaddress";
	private readonly _vendorShippingAddressViaUrlDelete: string = environment.baseUrl + "/api/Vendor/deletevendorshippingviaaddress";
	private readonly _vendorShippingAddressViaUrlRestore: string = environment.baseUrl + "/api/Vendor/restorevendorshippingviaaddress";
	private readonly _vendorShippingAddressViaInterUrlDelete: string = environment.baseUrl + "/api/Vendor/deleteinternationalshipvia";
	private readonly _vendorShippingAddressViaInterUrlRestore: string = environment.baseUrl + "/api/Vendor/restoreinternationalshipvia";
	private readonly _vendorsContctUrl: string = environment.baseUrl + "/api/Vendor/vendorContactPost";
	private readonly _checkPaymntUpdateUrl: string = environment.baseUrl + "/api/Vendor/checkPaymentUpdate";
	private readonly _domesticUpdate: string = environment.baseUrl + "/api/Vendor/domesticPaymentUpdate";
	private readonly _internationalUpdate: string = environment.baseUrl + "/api/Vendor/InternationalUpdate";
	private readonly _defaultUpdate: string = environment.baseUrl + "/api/Vendor/defaultUpdate";
	private readonly _addpaymentUrl: string = environment.baseUrl + "/api/Vendor/paymentCheckPost";
	private readonly _adddomesticpaymentUrl: string = environment.baseUrl + "/api/Vendor/paymentDomesticPost";
	private readonly _addinternationalpaymentUrl: string = environment.baseUrl + "/api/Vendor/paymentInternationalPost";
	private readonly _adddefaultpaymentUrl: string = environment.baseUrl + "/api/Vendor/paymentDefaultPost";
	private readonly _vendorsUpdateContctUrl: string = environment.baseUrl + "/api/Vendor/ContactPost";
	private readonly _vendorCheckpaymentUpdate: string = environment.baseUrl + "/api/Vendor/vendorCheckPayment";
	private readonly _vendorShipAddressdetails: string = "/api/Vendor/vendorShippingAddressDetails";
	private readonly _vendorDomesticpaymentUpdate: string = environment.baseUrl + "/api/Vendor/vendorDomesticPayment";
	private readonly _vendorInternationalpaymentUpdate: string = "/api/Vendor/vendorInternationalPayment";
	private readonly _vendorDefaultUpdate: string = "/api/Vendor/updatevendorDefault";
	private readonly _vendorFinanceUrl: string = environment.baseUrl +"/api/Vendor/vendorFinancePost";
	private readonly _shippingInfoUrl: string = environment.baseUrl + "/api/Vendor/vendorShippingPost";
	private readonly _billingInfoUrl: string = "/api/Vendor/vendorBillingPost";
	private readonly _billingInfoNew: string = environment.baseUrl + "/api/Vendor/createvendorbillingaddress";
	private readonly _saveShipViaDetails: string = environment.baseUrl + "/api/Vendor/addShipViaDetails";
	private readonly _saveShipViaInterDetails: string = environment.baseUrl + "/api/Vendor/createinternationalshipvia";
	private readonly _saveBillViaDetails: string = "/api/Vendor/addBillViaDetails";
	private readonly _addShipViaDetails: string = "/api/Vendor/updateShipviaAddress";
	private readonly _updateShipAddressDetails: string = "/api/Vendor/updateShipAddress";
	private readonly _updateShippingViaDetails: string = environment.baseUrl +"/api/Vendor/updateShipViaDetails";
	private readonly _updateBillingViaDetails: string = "/api/Vendor/updateBillViaDetails";
	private readonly _actionsUrlAuditHistory: string = "/api/Vendor/auditHistoryById";
	private readonly _vendorShipAddressGetUrl: string = "/api/Vendor/vendorAddressGet";
	private readonly _vendorBillAddressGetUrl: string = "/api/Vendor/vendorBillingAddressGet";
	private readonly _getSitesAddress: string = "/api/Vendor/getSitesAddress";
	private readonly _vendorwarningsUrl: string = "/api/Vendor/vendorWarningsget";
	private readonly _vendorShipViaDetilas: string = "/api/Vendor/getVendorShipViaDetails";
	private readonly _vendorShipViaInterDetails: string = "/api/Vendor/internationalshipviadetaillist";
	private readonly _vendorBillViaDetails: string = "/api/Vendor/getVendorBillViaDetails";
	private readonly _getContactHistroty: string = "/api/Vendor/getContactHistroty";
	private readonly _getCheckPayHist: string = "/api/Vendor/getCheckPayHist";
	private readonly _getVendorhistory: string = "/api/Vendor/getVendorHistory";
	private readonly _getcheckhistory: string = "/api/Vendor/getcheckHistory";
	private readonly _getShipViaHistory: string = "/api/Vendor/getShipViaHistory";
	private readonly _getShipViaHistoryInter: string = "/api/Vendor/internationalshipviaaudit";
	private readonly _getBillViaHistory: string = "/api/Vendor/getBillViaHistory";
	private readonly _getshipaddresshistory: string = "/api/Vendor/getshipaddresshistory";
	private readonly _getbilladdresshistory: string = "/api/Vendor/getbilladdresshistory";
	private readonly _updateVendorIsDelete: string = environment.baseUrl + "/api/Vendor/updateVendorIsDelete";
	private readonly _actionsUrl: string = environment.baseUrl + "/api/Vendor/Getdiscount";
	private readonly _discountPutUrl: string = environment.baseUrl + "/api/Vendor/updatediscount";
	private readonly _newDiscount: string = environment.baseUrl + "/api/Vendor/insertDiscount";
	private readonly _listUrl: string = "/api/Vendor/GetvendorList";
	private readonly _updateActiveInactive: string = environment.baseUrl + "/api/Vendor/vendorUpdateforActive";
	private readonly _updateActiveInactiveforContact: string = environment.baseUrl + "/api/Vendor/vendorUpdateforActiveforcontact";
	private readonly _updateActiveInactiveforpayment: string = environment.baseUrl + "/api/Vendor/vendorUpdateforActiveforpayment";
	private readonly _updateActiveInactivefordshipping: string = environment.baseUrl + "/api/Vendor/vendorUpdateforActiveforshipping";
	private readonly _updateActiveInactivefordbilling: string = "/api/Vendor/vendorUpdateforActiveforbilling";
	private readonly _updateActiveInactivefordshipviaDetails: string = "/api/Vendor/vendorUpdateforActiveforshipviaDetails";
	private readonly _polisturl: string = "/api/Vendor/polist";
	private readonly _stockLinePOlisturl: string = "/api/Vendor/stocklinePOList";
	private readonly _countryUrl: string = "/api/Customer/GetcountryList";
	private readonly _rolist: string = "/api/Vendor/rolist";
	private readonly _purchaseorderDetails: string = "/api/Vendor/GetvendorpurchaseList";
	private readonly _managementSiteDetails: string = "/api/Vendor/GetmanagementSiteList";
	private readonly _repaireorderDetails: string = "/api/Vendor/GetvendorrepairList";
	private readonly _updateShipvendorAddressDetails: string = environment.baseUrl + "/api/Vendor/updatevendorShipAddress";
	private readonly _updateBillvendorAddressDetails: string = "/api/Vendor/updatevendorBillAddress";
	private readonly _defaultsUpdate: string = "/api/Vendor/defaultmethodUpdate";
	private readonly _deletePoPart: string = "/api/Vendor/deletePoPart";
	private readonly _deleteRoPart: string = "/api/Vendor/deleteRoPart";
	private readonly _actionsUrlNew2: string = "/api/Vendor/GetATASubchapter";
	private readonly _capabilityListUrl: string = "/api/Vendor/capabilityTypeList";
	private readonly _vendorCapability: string = environment.baseUrl + "/api/Vendor/vendorCapabilityPost";
	private readonly _vendorCapabilityType: string = "/api/Vendor/vendorCapabilityTypePost";
	private readonly _vendorCapabilityAircraftType: string = "/api/Vendor/vendorCapabilityAircraftTypePost";
	private readonly _vendorCapabilityAircraftModel: string = "/api/Vendor/vendorCapabilityAircraftModelPost";
	private readonly _vendorCapabilityGet: string = "/api/Vendor/vendorCapabilityTypeGet";
	private readonly _vendorManufacturer: string = "/api/Vendor/vendorAircraftManufacturerGet";
	private readonly _vendorManufacturerModel: string = "/api/Vendor/vendorAircraftManufacturerModelGet";
	private readonly _vendorCapabilityUpdate: string =  environment.baseUrl + "/api/Vendor/vendorCapabilityUpdate";//this is used do not comments
	private readonly _deleteVendorCapabilityTypeUrl: string = "/api/Vendor/deleteVendorCapabilityType";
	private readonly _deleteVendorCapabilityAircraftManufacturer: string = "/api/Vendor/deleteVendorCapabilityAircraftManafacturer";
	private readonly _deleteVendorCapabilityAircraftModel: string = "/api/Vendor/deleteVendorCapabilityAircraftModel";
	private readonly _deleteVendorCapability: string = environment.baseUrl + "/api/Vendor/deleteVendorCapability";
	private readonly _getVendorContactByID: string = "/api/Vendor/getvendorContactByVendorID";
	private readonly _actionsCapsUrl: string = "/api/Vendor/GetListforCapes";
	private readonly _capesdata: string = "/api/Vendor/GetVendorCapesDatawithMasterId";
	private readonly _mancapPost: string = "/api/Vendor/VendorMancapespost";
	private readonly _aircraftmodelsPost: string = "/api/Vendor/Aircraftpost";
	private readonly _vendorContactsGetByID: string = "/api/Common/vendorcontacts";
	private readonly getVendor: string = "/api/vendor/pagination";
	private readonly _vendorsForDropDown: string = "/api/Vendor/GetVendorsForDropDown";
	private readonly _saveVendorRepairOrder: string = "/api/repairorder/createrepairorder";
	private readonly _saveROAddress: string = "/api/Vendor/saveVendorRepairAddress";
	private readonly _saveVendorRepairOrderPart: string = "/api/repairorder/createrepairorderparts";
	private readonly _roByIdUrl: string = "/api/Vendor/roById";
	private readonly _roPartByIdUrl: string = "/api/Vendor/roPartsById";
	private readonly _poPartByItemIdUrl: string = environment.baseUrl + "/api/Vendor/POListByMasterItemId";
	private readonly _roPartByItemIdUrl: string = environment.baseUrl + "/api/Vendor/ROListByMasterItemId";
	private readonly _roListWithFiltersUrl: string = "/api/repairorder/roListWithFilters";
	private readonly _saveCreateROApproval: string = "/api/Vendor/createRoApprover";
	private readonly _updateROApproval: string = "/api/Vendor/updateRoApprover";
	private readonly _getVendorPOmemolist: string = environment.baseUrl + "/api/Vendor/vendorpomemolist";
	private readonly _getVendorROmemolist: string = environment.baseUrl + "/api/Vendor/vendorromemolist";
	private readonly _updateVendorPOROmemolist: string = environment.baseUrl + "/api/Vendor/updatevendormemotext";
	private readonly _getVendorDocslist: string = environment.baseUrl + "/api/Vendor/getVendorDocumentDetailList";
	private readonly _addDocumentDetails: string = environment.baseUrl + "/api/Vendor/vendorDocumentUpload";
	private readonly _addCapesDocumentDetails: string = "/api/Vendor/uploadVendorCapsData";
	private readonly _UploadVendorCapesDetails: string = "/api/Vendor/UploadVendorCapsListData";	
	private readonly _updateDocumentDetails: string = "/api/Vendor/vendorDocumentUpdate";
	private readonly _getVendorDocsDetailsById: string = "/api/Vendor/getVendorDocumentDetail";
	private readonly _getVendorDocumentAttachmentslist: string = environment.baseUrl + "/api/FileUpload/getattachmentdetails";
	private readonly _getVendorDeleteDocsDetailsById: string = "/api/Vendor/vendorDocumentDelete";
	private readonly _getVendorShippingHistory: string = environment.baseUrl + "/api/Vendor/getVendorShippingHistory";
	private readonly _getVendorBillingHistory: string = environment.baseUrl + "/api/Vendor/getVendorBillingHistory";
	private readonly _getVendorContactHistory: string = environment.baseUrl + "/api/Vendor/getVendorContactHistory";
	private readonly _getVendorDocumentHistory: string = environment.baseUrl + "/api/Vendor/getVendorDocumentAudit";
	private readonly _getVendorCapabilityHistory: string = environment.baseUrl + "/api/Vendor/getVendorCapabilityHistory";
	private readonly _updateVendorBillAddressDetails: string = "/api/Vendor/updatevendorbillingaddress";
	private readonly _addVendorDocumentDetails: string = "/api/FileUpload/uploadfiles";
	private readonly _addVendorFileUpload: string = "/api/Vendor/vendorGeneralDocumentUpload";
	private readonly _addVendorgeneralFileDetails: string = environment.baseUrl + "/api/Vendor/getVendorGeneralDocumentDetail";
	private readonly _vendorDeleteAttachment: string = "/api/Vendor/vendorAttachmentDelete";
	private readonly _vendorProcess1099Id: string = "/api/Vendor/getVendorProcess1099ListForFinance";
	private readonly _vendorProcess1099IdFromTransaction: string = "/api/Vendor/getVendorProcess1099ListFromTransaction";
	private readonly _deleteVendorBillingAddressDelete: string = environment.baseUrl + "/api/Vendor/deletevendorbillingaddress";
	private readonly _restoreVendorBillingAddressDelete: string = environment.baseUrl + "/api/Vendor/restorevendorbillingaddress";
	private readonly _updateVendorBillingAddressStatus: string = environment.baseUrl + "/api/Vendor/vendorbillingaddressstatus";
	private readonly _vendorListsUrl: string = "/api/Vendor/vendorlist";
	private readonly excelUploadBilling: string = "/api/Vendor/uploadvendorbillingaddress"
	private readonly excelUploadShipping: string = "/api/Vendor/uploadvendorshippingaddress";
	private readonly excelUploadInternationalShipping: string = "/api/Vendor/uploadvendorinternationalshipping";
	private readonly excelUploadContact: string = "/api/Vendor/uploadvendorrcontacts"
	private readonly excelUploadPayment: string = "/api/Vendor/uploadvendorpaymentaddress"
	private readonly _receivingPOList: string = "/api/Vendor/receiveposearch"
	private readonly _receivingPOListGlobal: string = "/api/Vendor/receivepoglobalsearch"
	private readonly _receivingROList: string = "/api/Vendor/receiverosearch"
	private readonly _receivingROListGlobal: string = "/api/Vendor/receiveroglobalsearch"

	get capabilityTypeListUrl() { return this.configurations.baseUrl + this._capabilityListUrl; }
	get vendorlistsUrl() { return this.configurations.baseUrl + this._vendrUrl; }
	get vendorBasicListUrl() { return this.configurations.baseUrl + this._vendorLiteUrl }
	get vendorListWithId() { return this.configurations.baseUrl + this._vendorsWithId; }
	get vendorattributesUrl() { return this.configurations.baseUrl + this._vendorUrl; }
	get vendorCapabilityListsUrl() { return this.configurations.baseUrl + this._vendorCapabilityUrl; }
	get filteredVendorCapabilityListsUrl() { return this.configurations.baseUrl + this._filteredVendorCapabilityListsUrl; }
	get partDetails() { return this.configurations.baseUrl + this._partDetails; }
	get partDetailswithid() { return this.configurations.baseUrl + this._partDetailswithid; }
	get partDetailswithidForsinglePart() { return this.configurations.baseUrl + this._partDetailswithidForsinglePart; }
	get vendorDomestic() { return this.configurations.baseUrl + this._domesticWIthVendor; }
	get internationalWIthVendor() { return this.configurations.baseUrl + this._internationalWIthVendor; }
	get defaultVendor() { return this.configurations.baseUrl + this._defaultwithVendor; }
	get vendorsForDropDownURL() { return this.configurations.baseUrl + this._vendorsForDropDown; }
	get vendorCodeById() { return this.configurations.baseUrl + this._Vendercodebyid; }
	get VendorShipDetails() { return this.configurations.baseUrl + this._vendorShipViaDetilas; }
	get vendorShipAddressUrl() { return this.configurations.baseUrl + this._vendorShipAddressGetUrl; }
	get vendorBillAddressUrl() { return this.configurations.baseUrl + this._vendorBillAddressGetUrl; }
	get getSiteAddress() { return this.configurations.baseUrl + this._getSitesAddress; }
	get vendorWarningsDetails() { return this.configurations.baseUrl + this._vendorwarningsUrl; }
	get vendorShipViaDetails() { return this.configurations.baseUrl + this._vendorShipViaDetilas; }
	get vendorShipViaInterDetails() { return this.configurations.baseUrl + this._vendorShipViaInterDetails; }
	get vendorBillViaDetails() { return this.configurations.baseUrl + this._vendorBillViaDetails; }
	get contctsUrl() { return this.configurations.baseUrl + this._contacturl; }
	get contctsCompleteUrl() { return this.configurations.baseUrl + this._contactGeturl; }
	get contactEmptyurl() { return this.configurations.baseUrl + this._contactsEmptyObjurl }
	get fianlurl() { return this.configurations.baseUrl + this._finalEmptyObjurl }
	get paymenturl() { return this.configurations.baseUrl + this._paymentEmptyObjurl }
	get generalurl() { return this.configurations.baseUrl + this._generalEmptyObjurl }
	get addressUrl() { return this.configurations.baseUrl + this._addressUrl }
	get checkPaymentAddress() { return this.configurations.baseUrl + this._checkPaymnetAddressUrl; }
	get bencusAddress() { return this.configurations.baseUrl + this._bencusAddress; }
	get getContactHistory() { return this.configurations.baseUrl + this._getContactHistroty; }
	get getCheckPayHist() { return this.configurations.baseUrl + this._getCheckPayHist; }
	get getVendorhistory() { return this.configurations.baseUrl + this._getVendorhistory; }
	get getcheckhistory() { return this.configurations.baseUrl + this._getcheckhistory; }
	get getShipViaHistory() { return this.configurations.baseUrl + this._getShipViaHistory; }
	get getShipViaHistoryInter() { return this.configurations.baseUrl + this._getShipViaHistoryInter; }
	get getBillViaHistory() { return this.configurations.baseUrl + this._getBillViaHistory; }
	get getshipaddresshistory() { return this.configurations.baseUrl + this._getshipaddresshistory; }
	get getbilladdresshistory() { return this.configurations.baseUrl + this._getbilladdresshistory; }
	get capabilityUrl() { return this.configurations.baseUrl + this._capabilityUrl; }
	get polisturl() { return this.configurations.baseUrl + this._polisturl; }
	get stockLinepolisturl() { return this.configurations.baseUrl + this._stockLinePOlisturl; }
	get rolisturl() { return this.configurations.baseUrl + this._rolist; }
	get listUrl() { return this.configurations.baseUrl + this._listUrl; }
	get countryUrl() { return this.configurations.baseUrl + this._countryUrl; }
	get purchaseorderDetails() { return this.configurations.baseUrl + this._purchaseorderDetails; }
	get managementSiteDetails() { return this.configurations.baseUrl + this._managementSiteDetails; }
	get repaireorderDetails() { return this.configurations.baseUrl + this._repaireorderDetails; }
	get vendorCapabilityurl() { return this.configurations.baseUrl + this._vendorCapabilityGet; }
	get vendorManufacturerurl() { return this.configurations.baseUrl + this._vendorManufacturer; }
	get vendorManufacturerModelurl() { return this.configurations.baseUrl + this._vendorManufacturerModel; }
	get actionsUrlCaps() { return this.configurations.baseUrl + this._actionsCapsUrl; }
	get capesdata() { return this.configurations.baseUrl + this._capesdata; }
	get paginate() { return this.configurations.baseUrl + this.getVendor; }
	get roListWithFiltersUrl() { return this.configurations.baseUrl + this._roListWithFiltersUrl; }
	get vendorProcess1099Id() { return this.configurations.baseUrl + this._vendorProcess1099Id; }
	get vendorProcess1099IdFromTransaction() { return this.configurations.baseUrl + this._vendorProcess1099IdFromTransaction; }
	get vendorListUrl() { return this.configurations.baseUrl + this._vendorListsUrl; }

	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
		super(http, configurations, injector);
	}

	getReceivingPOListing() {
		return this.http.get(`${this.configurations.baseUrl}/api/vendor/recevingpolist`)
		.catch(error => {
			return this.handleError(error, () => this.getReceivingPOListing());
		});
	}

	postNewBillingAddress<T>(object) {
		let url = `${this.configurations.baseUrl}/api/Vendor/createvendorbillingaddress`
		return this.http.post<T>(url, JSON.stringify(object), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.postNewBillingAddress(object));
			});

	}
	getVendorCapesData<T>(vendorId: any): Observable<T> {
		let url = `${this.capesdata}/${vendorId}`;
		return this.http.get<T>(url, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorCapesData(vendorId));
			});
	}

	saveVendorCapesmaninfo<T>(data: any): Observable<T> {
		return this.http.post<T>(this._mancapPost, JSON.stringify(data), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.saveVendorCapesmaninfo(data));
			});
	}

	saveAircraftinfo<T>(data: any): Observable<T> {
		return this.http.post<T>(this._aircraftmodelsPost, JSON.stringify(data), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.saveVendorCapesmaninfo(data));
			});
	}

	getNewvendorEndpoint<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._vendorUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getNewvendorEndpoint(userObject));
			});
	}

	getEditvendorEndpoint<T>(vendorId?: number): Observable<T> {
		let endpointUrl = vendorId ? `${this._vendorUrlNew}/${vendorId}` : this._vendorUrlNew;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getEditvendorEndpoint(vendorId));
			});
	}

	getDeletevendorEndpoint<T>(vendorId: number): Observable<T> {
		let endpointUrl = `${this._vendorUrlNew}/${vendorId}`;

		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getDeletevendorEndpoint(vendorId));
			});
	}

	getvendorCapabilityListEndpoint<T>(status, vendorId): Observable<T> {
		return this.http.get<T>(`${this.vendorCapabilityListsUrl}/?status=${status}&vendorId=${vendorId}`, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getvendorEndpoint());
			});
	}

	getFilteredVendorCapabilityListEndpoint<T>(userObject): Observable<T> {
		return this.http.post<T>(this.filteredVendorCapabilityListsUrl, JSON.stringify(userObject), this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.getNewvendorEndpoint(userObject));
		});
	}

	getvendorEndpoint<T>(): Observable<T> {
		return this.http.get<T>(this.vendorattributesUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorEndpoint());
			});
	}

	getvendorBasicEndpoint<T>(): Observable<T> {
		return this.http.get<T>(this.vendorBasicListUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorBasicEndpoint());
			});
	}

	getCapabilityTypeListEndpoint<T>(): Observable<T> {
		return this.http.get<T>(this.capabilityTypeListUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getCapabilityTypeListEndpoint());
			});
	}

	getManagementSiteDataByCompanyIdEdpoint<T>(companyId): Observable<T> {
		let endUrl = `${this.managementSiteDetails}/${companyId}`;
		return this.http.get<T>(endUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getManagementSiteDataByCompanyIdEdpoint(companyId));
			});
	}

	getpurchasevendorlist<T>(vendorId): Observable<T> {
		let endUrl = `${this.purchaseorderDetails}/${vendorId}`;
		return this.http.get<T>(endUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorEndpoint());
			});
	}
	getrepairevendorlist<T>(vendorId): Observable<T> {
		let endUrl = `${this.repaireorderDetails}/${vendorId}`;
		return this.http.get<T>(endUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorEndpoint());
			});
	}
	getCompletePartDetails<T>(): Observable<T> {
		return this.http.get<T>(this.partDetails, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorEndpoint());
			});
	}
	getPartDetailsWithid<T>(partId): Observable<T> {
		let endpointurl = `${this.partDetailswithid}/${partId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorEndpoint());
			});
	}
	getPartDetailsWithidForSinglePart<T>(partId): Observable<T> {
		let endpointurl = `${this.partDetailswithidForsinglePart}/${partId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorEndpoint());
			});
	}
	saveVendorCapes<T>(vendorId: number, data ): Observable<T> {
        return this.http.put<T>(`${this._saveVendorCapesByVendor}/${vendorId}`, data, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.saveVendorCapes(vendorId, data));
            });
	}
	
	deleteVendorCapesRecordEndpoint<T>(id: number, updatedBy: string): Observable<T> {
        let endpointUrl = `${this.configurations.baseUrl}/api/Vendor/vendorcapesdelete/${id}?updatedBy=${updatedBy}`;
        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteVendorCapesRecordEndpoint(id, updatedBy));
            });
	}
	
	restoreVendorCapesRecordEndpoint<T>(id: number, updatedBy: string): Observable<T> {
        let endpointUrl = `${this.configurations.baseUrl}/api/Vendor/vendorcapesrestore/${id}?updatedBy=${updatedBy}`;
        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.restoreVendorCapesRecordEndpoint(id, updatedBy));
            });
    }
	
	getCapabilityEndpoint<T>(): Observable<T> {
		return this.http.get<T>(this.capabilityUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getCapabilityEndpoint());
			});
	}

	getDomesticWire<T>(vendorId: any): Observable<T> {
		let endpointurl = `${this.vendorDomestic}/${vendorId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorEndpoint());
			});
	}

	updateInternational<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._internationalUpdate}/${roleObject.internationalWirePaymentId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.updateDomestic(roleObject));
			});
	}
	updateDefault<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._defaultUpdate}/${roleObject.vendorPaymentId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.updateDefaults(roleObject));
			});
	}

	getInternational<T>(vendorId: any): Observable<T> {
		let endpointurl = `${this.internationalWIthVendor}/${vendorId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorEndpoint());
			});
	}
	getDefault<T>(vendorId: any): Observable<T> {
		let endpointurl = `${this.defaultVendor}/${vendorId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorEndpoint());
			});
	}

	getVendorCodeAndNameById<T>(vendorId: any): Observable<T> {
		let endpointurl = `${this.vendorCodeById}/${vendorId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorEndpoint());
			});
	}

	getVendorShipvia<T>(): Observable<T> {
		return this.http.get<T>(this.VendorShipDetails, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorEndpoint());
			});
	}
	getVendorShipAddressdetails<T>(vendorId: any): Observable<T> {
		let endpointurl = `${this.vendorShipAddressUrl}/${vendorId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getvendorEndpoint());
			});
	}
	getVendorBillAddressdetails<T>(vendorId: any): Observable<T> {
		let endpointurl = `${this.vendorBillAddressUrl}/${vendorId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorEndpoint());
			});
	}
	getSiteAddresses<T>(): Observable<T> {
		return this.http.get<T>(this.getSiteAddress, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getSiteAddresses());
			});
	}
	getVendorwarnigs<T>(vendorId: any): Observable<T> {
		let endpointurl = `${this.vendorWarningsDetails}/${vendorId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorEndpoint());
			});
	}


	getVendorShipViaDetails<T>(vendorShippingAddressId: any, currentDeletedstatusShipVia: boolean): Observable<T> {
		let endpointUrl = `${this.vendorShipViaDetails}/${vendorShippingAddressId}?isDeleted=${currentDeletedstatusShipVia}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorShipViaDetails(vendorShippingAddressId, currentDeletedstatusShipVia));
			});
	}

	getVendorShipViaInterDetails<T>(id: any, currentDeletedstatusIntShipVia: boolean): Observable<T> {
		let endpointUrl = `${this.vendorShipViaInterDetails}?VendorInternationalShippingId=${id}&isDeleted=${currentDeletedstatusIntShipVia}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorShipViaInterDetails(id, currentDeletedstatusIntShipVia));
			});
	}
	getVendorBillViaDetails<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this.vendorBillViaDetails}/${roleObject.vendorBillingAddressId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorBillViaDetails(roleObject));
			});
	}
	getvendorList<T>(): Observable<T> {

		return this.http.get<T>(this.vendorlistsUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorList());
			});
	}

	getvendorListForVendor<T>(isActive: any): Observable<T> {
		let endpointurl = `${this.vendorlistsUrl}?isActive=${isActive}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getvendorListForVendor(isActive));
			});
	}

	getVendorsDatawithid<T>(vendorId: any): Observable<T> {
		let endpointurl = `${this.vendorListWithId}/${vendorId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorsDatawithid(vendorId));
			});
	}

	getContcatDetails<T>(vendorId: any): Observable<T> {
		let endpointUrl = `${this.contctsUrl}/${vendorId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getContcatDetails(vendorId));
			});

	}
	getContcatCompleteDetails  <T>(): Observable<T> {
		return this.http.get<T>(this.contctsCompleteUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getContcatCompleteDetails());
			});
	}

	getCheckPaymnetDetails<T>(vendorId: any): Observable<T> {
		let endpointUrl = `${this.checkPaymentAddress}/${vendorId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getCheckPaymnetDetails(vendorId));
			});
	}

	getBeneficiaryCustomerDetails<T>(): Observable<T> {
		return this.http.get<T>(this.bencusAddress, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getBeneficiaryCustomerDetails());
			});
	}

	getEmptyrobj<T>(): Observable<T> {
		return this.http.get<T>(this.contactEmptyurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getEmptyrobj());
			});
	}

	getFinalrobj<T>(): Observable<T> {
		return this.http.get<T>(this.fianlurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getFinalrobj());
			});
	}

	getGeneralrobj<T>(): Observable<T> {
		return this.http.get<T>(this.generalurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getGeneralrobj());
			});
	}

	getPaymentrobj<T>(): Observable<T> {
		return this.http.get<T>(this.paymenturl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getPaymentrobj());
			});
	}

	getAddressDeatails<T>(): Observable<T> {
		return this.http.get<T>(this.addressUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getAddressDeatails());
			});
	}

	getNewVendorEndpoint<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post<T>(this._vendorsUrlNew, body, this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getNewVendorEndpoint(param   ));
		});
	}

	getVendorPoDetails<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._getVendorForPo, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;

			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	saveVendorWarningdata<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._vendorwarningUrl, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;

			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	savePurchaseorderdetails<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._saveVendorpurchases, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;

			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	savePurchaseorderAddress<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._savePOAddress, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;

			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	savesaveRepairorderorderdetails<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._saveVendorrepaire, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;

			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	savePurchaseorderdetailspart<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._saveVendorpurchasespart, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;

			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	saveRepaireorderpartrdetailspart<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._saveVendorrepairepart, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;
			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	getNewShipppinginfo<T>(param: any): Observable<Response> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http
			.post(this._shippingInfoUrl, body, this.getRequestHeaders())
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	getNewBillinginfo<T>(param: any): Observable<Response> {

		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http
			.post(this._billingInfoUrl, body, this.getRequestHeaders())
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	createNewBillinginfo<T>(param: any): Observable<Response> {

		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http
			.post(this._billingInfoNew, body, this.getRequestHeaders())
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	updateShipAddressDetails<T>(param: any): Observable<Promise<any>> {

		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http
			.post(this._updateShipAddressDetails, body, this.getRequestHeaders())
			.map((res: Response) => res.json())
			.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	saveShipViaDetails<T>(param: any): Observable<Response> {

		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http
			.post(this._saveShipViaDetails, body, this.getRequestHeaders())
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	saveInterShipViaDetails<T>(param: any): Observable<Response> {

		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http
			.post(this._saveShipViaInterDetails, body, this.getRequestHeaders())
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	saveBillViaDetails<T>(param: any): Observable<Response> {

		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http
			.post(this._saveBillViaDetails, body, this.getRequestHeaders())
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	addShipViaDetails<T>(roleObject: any, vendorId: number): Observable<T> {
		let endpointUrl = `${this._addShipViaDetails}/${vendorId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.addShipViaDetails(roleObject, vendorId));
			});
	}

	updateVendorIsDelete<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._updateVendorIsDelete}/${roleObject.vendorId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.updateVendorIsDelete(roleObject));
			});
	}

	getNewShipppinginfoWithAddressId<T>(param: any, addressId: any): Observable<Promise<any>> {
		param.vendorShippingAddressId = addressId;
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http
			.post(this._shippingInfoUrl, body, this.getRequestHeaders())
			.map((res: Response) => res.json())
			.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	getNewBillinginfoWithAddressId<T>(param: any, addressId: any): Observable<Promise<any>> {
		param.vendorBillingAddressId = addressId;
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http
			.post(this._billingInfoUrl, body, this.getRequestHeaders())
			.map((res: Response) => res.json())
			.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	getNewVendorContactInfo<T>(param: any): Observable<any> {
		delete param.contactId;
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._vendorsContctUrl, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;
			}).catch(error => {
				return this.handleErrorCommon(error, () => this.getNewVendorContactInfo(param));
			});
	}
	
	addPaymentCheckinfo<T>(param: any): Observable<any> {

		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._addpaymentUrl, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;

			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	addPaymentDomesticinfo<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._adddomesticpaymentUrl, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;

			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	addPaymentInternationalinfo<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._addinternationalpaymentUrl, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;

			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	addPaymentDefaultinfo<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._adddefaultpaymentUrl, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;

			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	AddvendorContactDetails<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._vendorsUpdateContctUrl, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;

			}).catch(error => {
				return this.handleErrorCommon(error, () => this.AddvendorContactDetails<T>(param));
			});
	}

	updateVendorCheckpayment<T>(param: any, vendorId: any): Observable<any> {
		param.VendorId = vendorId;
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._vendorCheckpaymentUpdate, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;
			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	updateVendorAddressDetails<T>(param: any, vendorId: any): Observable<any> {
		param.VendorId = vendorId;
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._vendorShipAddressdetails, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;
			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	updateVendorDomesticWirePayment<T>(param: any, vendorId: any): Observable<any> {
		param.VendorId = vendorId;
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._vendorDomesticpaymentUpdate, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;
			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	updateVendorInternationalWirePayment<T>(param: any, vendorId: any): Observable<any> {
		param.VendorId = vendorId;
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._vendorInternationalpaymentUpdate, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;

			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	getNewVendorfinanceInfo<T>(param: any): Observable<T> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._vendorFinanceUrl, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;
			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	getUpdatevendorEndpoint<T>(roleObject: any, addressId: any, vendorId: number): Observable<T> {
		let endpointUrl = `${this._vendorsUrlNew}/${addressId}/${vendorId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getUpdatevendorEndpoint(roleObject, addressId, vendorId));
			});
	}

	updateVendorWarnings<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._vendorwarningUrl}/${roleObject.vendorId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.updateVendorWarnings(roleObject));
			});
	}

	updateVendorListDetails<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._vendorUpdateUrl}/${roleObject.vendorId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.updateVendorListDetails(roleObject));
			});
	}

	getUpdateContactInfo<T>(roleObject: any, vendorId: number): Observable<T> {
		let endpointUrl = `${this._vendorsContctUrl}/${vendorId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getUpdateContactInfo(roleObject, vendorId));
			});
	}

	updateCheckPaymentInfo<T>(roleObject: any, vendorId: number): Observable<T> {
		let endpointUrl = `${this._checkPaymntUpdateUrl}/${vendorId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getUpdateContactInfo(roleObject, vendorId));
			});
	}

	updateDomestic<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._domesticUpdate}/${roleObject.domesticWirePaymentId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.updateDomestic(roleObject));
			});
	}

	updateDefaults<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._defaultsUpdate}/${roleObject.VendorPaymentMethodId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.updateDefaults(roleObject));
			});
	}

	getUpdateFinanceInfo<T>(roleObject: any, vendorId: number): Observable<T> {
		let endpointUrl = `${this._vendorFinanceUrl}/${vendorId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getUpdateFinanceInfo(roleObject, vendorId));
			});
	}

	updateShippinginfo<T>(roleObject: any, vendorId: any): Observable<T> {
		let endpointUrl = `${this._updateShipvendorAddressDetails}/${vendorId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.updateShippinginfo(roleObject, vendorId));
			});
	}

	updateBillinginfo<T>(roleObject: any, vendorId: any): Observable<T> {
		let endpointUrl = `${this._updateBillvendorAddressDetails}/${vendorId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.updateBillinginfo(roleObject, vendorId));
			});
	}

	updateShippingViainfo<T>(roleObject: any, vendorId: any): Observable<T> {
		let endpointUrl = `${this._updateShippingViaDetails}/${vendorId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.updateShippinginfo(roleObject, vendorId));
			});
	}

	updateBillingViainfo<T>(roleObject: any, vendorId: any): Observable<T> {
		let endpointUrl = `${this._updateBillingViaDetails}/${vendorId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.updateBillinginfo(roleObject, vendorId));
			});
	}

	getDeletevendorContactEndpoint<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._vendorContactUrlNew}/${roleObject.vendorShippingAddressId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getDeletevendorContactEndpoint(roleObject));
			});
	}

	deletePOPart<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._deletePoPart}/${roleObject}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.deletePOPart(roleObject));
			});
	}

	deleteROPart<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._deleteRoPart}/${roleObject}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.deletePOPart(roleObject));
			});
	}

	deleteCheckPayment<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._deleteCheckPayment}/${roleObject}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.deleteCheckPayment(roleObject));
			});
	}
	
	restoreCheckPayment<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._restoreCheckPayment}/${roleObject}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.restoreCheckPayment(roleObject));
			});
	}
	
	deleteContact<T>(contactId: any, updatedBy: any): Observable<T> {
		let endpointUrl = `${this._deleteContactUrl}/${contactId}?UpdatedBy=${updatedBy}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.deleteContact(contactId, updatedBy));
			});
	}

	getDeletevendorshippingEndpoint<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._vendorShippingAddressUrlDelete}/${roleObject.vendorShippingAddressId}?updatedBy=${roleObject.updatedBy}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getDeletevendorshippingEndpoint(roleObject));
			});
	}

	getRestorevendorshippingEndpoint<T>(vendorShippingAddressId: any, updatedBy: any): Observable<T> {
		let endpointUrl = `${this._vendorShippingAddressUrlRestore}/${vendorShippingAddressId}?updatedBy=${updatedBy}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getRestorevendorshippingEndpoint(vendorShippingAddressId, updatedBy));
			});
	}

	getDeletevendorshippingViaEndpoint<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._vendorShippingAddressViaUrlDelete}/${roleObject.vendorShippingId}?updatedBy=${roleObject.updatedBy}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getDeletevendorshippingViaEndpoint(roleObject));
			});
	}

	restorevendorshippingViaEndpoint<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._vendorShippingAddressViaUrlRestore}/${roleObject.vendorShippingId}?updatedBy=${roleObject.updatedBy}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.restorevendorshippingViaEndpoint(roleObject));
			});
	}

	getDeletevendorshipViaInterEndpoint<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._vendorShippingAddressViaInterUrlDelete}/?id=${roleObject.vendorInternationalShipViaDetailsId}&updatedBy=${roleObject.updatedBy}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getDeletevendorshipViaInterEndpoint(roleObject));
			});
	}

	getRestorevendorshipViaInterEndpoint<T>(roleObject: any): Observable<T> {
		let endpointUrl = `${this._vendorShippingAddressViaInterUrlRestore}/?id=${roleObject.vendorInternationalShipViaDetailsId}&updatedBy=${roleObject.updatedBy}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getRestorevendorshipViaInterEndpoint(roleObject));
			});
	}

	getHistoryvendorEndpoint<T>(vendorId: number): Observable<T> {
		let endpointUrl = `${this.getContactHistory}/${vendorId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getHistoryvendorEndpoint(vendorId));
			});
	}

	getCheckPaymentHist<T>(vendorId: number): Observable<T> {
		let endpointUrl = `${this.getCheckPayHist}/${vendorId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getCheckPaymentHist(vendorId));
			});
	}

	getVendndorhistory<T>(vendorId: number): Observable<T> {
		let endpointUrl = `${this.getVendorhistory}/${vendorId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendndorhistory(vendorId));
			});
	}

	gethistoryOfcheckpayment<T>(vendorId: number): Observable<T> {
		let endpointUrl = `${this.getcheckhistory}/${vendorId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.gethistoryOfcheckpayment(vendorId));
			});
	}

	getShipviaHistory<T>(vendorId: number): Observable<T> {

		let endpointUrl = `${this.getShipViaHistory}/${vendorId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getShipviaHistory(vendorId));
			});
	}

	getShipviaHistoryInter<T>(id: number): Observable<T> {

		let endpointUrl = `${this.getShipViaHistoryInter}/${id}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getShipviaHistoryInter(id));
			});
	}

	getBillviaHistory<T>(vendorId: number): Observable<T> {
		let endpointUrl = `${this.getShipViaHistory}/${vendorId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getBillviaHistory(vendorId));
			});
	}

	getShipaddressHistory<T>(vendorId: number): Observable<T> {
		let endpointUrl = `${this.getshipaddresshistory}/${vendorId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getShipaddressHistory(vendorId));
			});
	}

	getBilladdressHistory<T>(vendorId: number): Observable<T> {
		let endpointUrl = `${this.getbilladdresshistory}/${vendorId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getBilladdressHistory(vendorId));
			});
	}

	getDiscountEndpoint<T>(): Observable<T> {
		return this.http.get<T>(this._actionsUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getDiscountEndpoint());
			});
	}

	getNewDiscount<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._newDiscount, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getNewDiscount(userObject));
			});
	}

	getupdateDiscount<T>(roleObject: any, discountId: number): Observable<T> {
		let endpointUrl = `${this._discountPutUrl}/${discountId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getupdateDiscount(roleObject, discountId));
			});
	}

	getVendorByNameList<T>(vendorName): Observable<T> {
		let url = `${this.listUrl}/${vendorName}`;
		return this.http.get<T>(url, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorByNameList(vendorName));
			});
	}

	getUpdatevendorEndpointforActive<T>(roleObject: any, vendorId: number): Observable<T> {
		let endpointUrl = `${this._updateActiveInactive}/${roleObject.vendorId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getUpdatevendorsEndpoint(roleObject, vendorId));
			});
	}

	getUpdatevendorsEndpoint<T>(roleObject: any, vendorId: number): Observable<T> {
		let endpointUrl = `${this._vendorsUrlNew}/${vendorId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getUpdatevendorsEndpoint(roleObject, vendorId));
			});

	}

	getUpdatevendorContactEndpointforActive<T>(roleObject: any, contactId: number): Observable<T> {
		let endpointUrl = `${this._updateActiveInactiveforContact}/${roleObject.contactId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getUpdatevendorContactEndpoint(roleObject, contactId));
			});
	}

	getUpdatevendorContactEndpoint<T>(roleObject: any, contactId: number): Observable<T> {
		let endpointUrl = `${this._vendorsUrlNew}/${contactId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getUpdatevendorContactEndpoint(roleObject, contactId));
			});
	}

	getUpdatevendorpaymentEndpointforActive<T>(checkpayment: any): Observable<T> {
		let endpointUrl = `${this._updateActiveInactiveforpayment}/${checkpayment.checkPaymentId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(checkpayment), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getUpdatevendorpaymentEndpoint(checkpayment));
			});
	}

	getUpdatevendorpaymentEndpoint<T>(checkpayment: any): Observable<T> {
		let endpointUrl = `${this._vendorsUrlNew}/${checkpayment}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(checkpayment), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getUpdatevendorpaymentEndpoint(checkpayment));
			});
	}

	getUpdatevendorEndpointforActiveforshipping<T>(roleObject: any, vendorShippingAddressId: number): Observable<T> {
		let endpointUrl = `${this._updateActiveInactivefordshipping}/${roleObject.vendorShippingAddressId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getUpdatevendorsEndpointforshipping(roleObject, vendorShippingAddressId));
			});
	}

	getUpdatevendorEndpointforActiveforbilling<T>(roleObject: any, vendorBillingAddressId: number): Observable<T> {
		let endpointUrl = `${this._updateActiveInactivefordbilling}/${roleObject.vendorBillingAddressId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getUpdatevendorsEndpointforshipping(roleObject, vendorBillingAddressId));
			});
	}

	getUpdatevendorEndpointforActiveforshipViaDetails<T>(roleObject: any, vendorShippingId: number): Observable<T> {
		let endpointUrl = `${this._updateActiveInactivefordshipviaDetails}/${roleObject.vendorShippingId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getUpdatevendorsEndpointforshipping(roleObject, vendorShippingId));
			});
	}

	getUpdatevendorsEndpointforshipping<T>(roleObject: any, vendorShippingAddressId: number): Observable<T> {
		let endpointUrl = `${this._vendorsUrlNew}/${vendorShippingAddressId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getUpdatevendorsEndpointforshipping(roleObject, vendorShippingAddressId));
			});
	}

	getPurchaseOrderList<T>(): Observable<T> {
		return this.http.get<T>(this.stockLinepolisturl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getPurchaseOrderList());
			});
	}

	getPOList(data) {
		return this.http.post(this.polisturl, JSON.stringify(data), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getPOList(data));
			});
	}

	getcountryListEndpoint<T>(): Observable<T> {
		return this.http.get<T>(this.countryUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getcountryListEndpoint());
			});
	}

	getRepaireOrderList<T>(): Observable<T> {
		return this.http.get<T>(this.rolisturl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getRepaireOrderList());
			});
	}

	getATASubchapterDataEndpoint<T>(mainId: any): Observable<T> {
		let endpointUrl = `${this._actionsUrlNew2}/${mainId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getATASubchapterDataEndpoint(mainId));
			});
	}

	//for new Vendor Capability Post
	newVendorCapabilityEndPoint<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._vendorCapability, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.newVendorCapabilityEndPoint(userObject));
			});
	}

	newVendorCapabilityTypeListEndPoint<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._vendorCapabilityType, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.newVendorCapabilityTypeListEndPoint(userObject));
			});
	}

	newVendorCapabilityAircraftTypeEndPoint<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._vendorCapabilityAircraftType, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.newVendorCapabilityAircraftTypeEndPoint(userObject));
			});
	}

	newVendorCapabiltiyAircraftModelEndPoint<T>(userObject: any): Observable<T> {
		return this.http.post<T>(this._vendorCapabilityAircraftModel, JSON.stringify(userObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.newVendorCapabiltiyAircraftModelEndPoint(userObject));
			});
	}

	getVendorCapabilityListEndpoint<T>(vendorId: any): Observable<T> {
		let url = `${this.vendorCapabilityurl}/${vendorId}`;
		return this.http.get<T>(url, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorCapabilityListEndpoint(vendorId));
			});
	}

	getVendorCapabilityAircraftManafacturerListEndpoint<T>(vendorId: any): Observable<T> {
		let url = `${this.vendorManufacturerurl}/${vendorId}`;
		return this.http.get<T>(url, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorCapabilityAircraftManafacturerListEndpoint(vendorId));
			});
	}

	getVendorCapabilityAircraftManafacturerModelListEndpoint<T>(vendorId: any): Observable<T> {
		let url = `${this.vendorManufacturerModelurl}/${vendorId}`;
		return this.http.get<T>(url, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorCapabilityAircraftManafacturerModelListEndpoint(vendorId));
			});
	}

	//for updating stockline
	getupdateVendorCapabilityEndpoint<T>(roleObject: any, vendorCapabilityId: number): Observable<T> {
		let endpointUrl = `${this._vendorCapabilityUpdate}/${roleObject.vendorCapabilityId}`;

		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getupdateVendorCapabilityEndpoint(roleObject, vendorCapabilityId));
			});
	}

	getDeletevendorCapabilityTypeEndpoint<T>(capabilityid: any): Observable<T> {
		let endpointUrl = `${this._deleteVendorCapabilityTypeUrl}/${capabilityid}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getDeletevendorCapabilityTypeEndpoint(capabilityid));
			});
	}

	getDeletevendorCapabilityAircraftManafacturerEndpoint<T>(capabilityid: any): Observable<T> {
		let endpointUrl = `${this._deleteVendorCapabilityAircraftManufacturer}/${capabilityid}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getDeletevendorCapabilityAircraftManafacturerEndpoint(capabilityid));
			});
	}

	getDeletevendorCapabilityAircraftModelEndpoint<T>(capabilityid: any): Observable<T> {
		let endpointUrl = `${this._deleteVendorCapabilityAircraftModel}/${capabilityid}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getDeletevendorCapabilityAircraftModelEndpoint(capabilityid));
			});
	}

	deleteVendorCapabilityEndpoint<T>(capabilityid: any,UpdatedBy: any): Observable<T> {
		let endpointUrl = `${this._deleteVendorCapability}/${capabilityid}?UpdatedBy=${UpdatedBy}`;
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.deletePOPart(capabilityid));
			});
	}

	getVendorContactEndpoint<T>(vendorId: any, isDContact: any): Observable<T> {
		let url = `${this._getVendorContactByID}/${vendorId}/${isDContact}`;
		return this.http.get<T>(url, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorContactEndpoint(vendorId, isDContact));
			});
	}

	getVendorContactsByIDEndpoint<T>(vendorId: any): Observable<T> {
		let url = `${this._vendorContactsGetByID}?vendorId=${vendorId}`;
		return this.http.get<T>(url, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorContactsByIDEndpoint(vendorId));
			});
	}

	getVendorsForDropdownEndPoint<T>(): Observable<T> {
		return this.http.get<T>(this.vendorsForDropDownURL, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorsForDropdownEndPoint());
			});
	}

	getVendorbillingsitenames(vendorId) {
		return this.http.get(`${this.configurations.baseUrl}/api/Vendor/vendorbillingsitenames?vendorId=${vendorId}`)
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getVendorbillingsitenames(vendorId));
		});
	}

	getVendorAddressById(vendorId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/Vendor/vendorbillingaddressbyid?billingAddressId=${vendorId}`)
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getVendorAddressById(vendorId));
		});
	}

	saveRepairorderdetails<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._saveVendorRepairOrder, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;
			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	saveRepairOrderAddress<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._saveROAddress, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;
			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	saveRepairorderdetailspart<T>(param: any): Observable<any> {
		let body = JSON.stringify(param);
		let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
		return this.http.post(this._saveVendorRepairOrderPart, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;
			}).catch((error: any) => Observable.throw(error.error || 'Server error'));
	}

	getROStatus(repairOrderId, isActive, updatedBy) {
		return this.http.put(`${this.configurations.baseUrl}/api/Vendor/roStatus?repairOrderId=${repairOrderId}&isActive=${isActive}&updatedBy=${updatedBy}`, {}, this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.getROStatus(repairOrderId, isActive, updatedBy));
		});
	}

	deleteRO(repairOrderId, updatedBy) {
		return this.http.delete<any>(`${this.configurations.baseUrl}/api/repairorder/deleteRo?repairOrderId=${repairOrderId}&updatedBy=${updatedBy}`)
		.catch(error => {
			return this.handleError(error, () => this.deleteRO(repairOrderId, updatedBy));
		});
	}

	getROHistory(repairOrderId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/Vendor/roHistory?repairOrderId=${repairOrderId}`)
		.catch(error => {
			return this.handleError(error, () => this.getROHistory(repairOrderId));
		});
	}

	getVendorROById<T>(Id: number): Observable<T> {
		let endPointUrl = `${this._roByIdUrl}?repairOrderId=${Id}`;
		return this.http.get<T>(endPointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorROById(Id));
			});
	}

	getVendorROHeaderById(repairOrderId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/repairorder/roheaderdetails?repairOrderId=${repairOrderId}`)
	}

	getVendorROAddressById(repairOrderId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/repairorder/roaddressdetails?repairOrderId=${repairOrderId}`)
	}

	getRepairOrderPartsById<T>(Id: number, workOrderPartNumberId): Observable<T> {
		let endPointUrl = `${this._roPartByIdUrl}?repairOrderId=${Id}&workOrderPartNoId=${workOrderPartNumberId}`;

		return this.http.get<T>(endPointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getRepairOrderPartsById(Id, workOrderPartNumberId));
			});
	}

	getPurchaseOrderByItemId<T>(Id: number): Observable<T> {
		let endPointUrl = `${this._poPartByItemIdUrl}?itemMasterId=${Id}`;

		return this.http.get<T>(endPointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getPurchaseOrderByItemId(Id));
			});
	}

	getRepiarOrderByItemId<T>(Id: number): Observable<T> {
		let endPointUrl = `${this._roPartByItemIdUrl}?itemMasterId=${Id}`;

		return this.http.get<T>(endPointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getRepiarOrderByItemId(Id));
			});
	}

	getROViewById(repairOrderId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/repairorder/roViewById?repairOrderId=${repairOrderId}`)
	}

	getROPartsViewById(repairOrderId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/repairorder/roPartsViewById?repairOrderId=${repairOrderId}`)
	}

	getROList(data) {
		return this.http.post(this.roListWithFiltersUrl, JSON.stringify(data), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getROList(data));
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
		return this.http.put(this._updateROApproval, body, this.getRequestHeaders())
			.map((response: Response) => {
				return <any>response;

			}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	getROApproverList(repairOrderId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/Vendor/roApproversList?repairOrderId=${repairOrderId}`)
	}

	getReceivingROList() {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/Vendor/recevingRoList`)
	}

	getROTotalCostById(repairOrderId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/repairorder/getrototalcost?repairOrderId=${repairOrderId}`)
	}
	
	getApproversListByTaskIdModuleAmt(taskId, moduleAmount) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/approvalrule/approverslist?approvalTaskId=${taskId}&moduleAmount=${moduleAmount}`)
	}
	
	getROApprovalListById(repairOrderId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/repairorder/getroapprovallist?repairOrderId=${repairOrderId}`)
	}
	  
	saveRepairOrderApproval<T>(param: any): Observable<any> {
		let url = `${this.configurations.baseUrl}/api/repairorder/repairorderapproval`;
		let body = JSON.stringify(param);
		return this.http.post(url, body, this.getRequestHeaders())
		  .map((response: Response) => {
			return <any>response;
	
		  }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	getVendorPOMemolist<T>(vendorId: number): Observable<T> {
		let endpointUrl = `${this._getVendorPOmemolist}?vendorId=${vendorId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorPOMemolist(vendorId));
			});
	}

	getVendorROMemolist<T>(vendorId: number): Observable<T> {
		let endpointUrl = `${this._getVendorROmemolist}?vendorId=${vendorId}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorROMemolist(vendorId));
			});
	}

	updateVendorPOROmemolist(id, type, memoText, updatedBy) {
		return this.http.put(`${this._updateVendorPOROmemolist}?id=${id}&type=${type}&memoText=${memoText}&updatedBy=${updatedBy}`, {}, this.getRequestHeaders())
	}

	getDocumentList(vendorId, isDeleted: boolean) {
		return this.http.get<any>(`${this._getVendorDocslist}/${vendorId}?isDeleted=${isDeleted}`, this.getRequestHeaders())
		.map((response: Response) => {
			return <any>response;
		}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}


	getDocumentUploadEndpoint<T>(file: any): Observable<T> {
		const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
		return this.http.post<T>(`${this._addDocumentDetails}`, file);
	}

	getDocumentListbyId(vendorDocumentId) {
		return this.http.get<any>(`${this._getVendorDocsDetailsById}/${vendorDocumentId}`, this.getRequestHeaders())
		.map((response: Response) => {
			return <any>response;
		}).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
	}

	getUpdateDocumentUploadEndpoint<T>(file: any): Observable<T> {
		const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
		return this.http.put<T>(`${this._updateDocumentDetails}`, file);
	}

	GetUploadDocumentsList(attachmentId, vendorId, moduleId) {
		return this.http.get<any>(`${this._getVendorDocumentAttachmentslist}?attachmentId=${attachmentId}&referenceId=${vendorId}&moduleId=${moduleId}`, this.getRequestHeaders())
	}


	getdeleteDocumentListbyId(vendorDocumentId) {
		return this.http.delete(`${this._getVendorDeleteDocsDetailsById}/${vendorDocumentId}`, this.getRequestHeaders())
	}
	
	getVendorShippingAuditHistory(vendorId, vendorShippingAddressId) {
		return this.http.get<any>(`${this._getVendorShippingHistory}?vendorId=${vendorId}&vendorShippingAddressId=${vendorShippingAddressId}`, this.getRequestHeaders())
	}

	getVendorBillingAuditHistory(vendorId, vendorBillingaddressId) {
		return this.http.get<any>(`${this._getVendorBillingHistory}?vendorId=${vendorId}&vendorBillingaddressId=${vendorBillingaddressId}`, this.getRequestHeaders())
	}

	getVendorContactAuditHistory(vendorId, vendorContactId) {
		return this.http.get<any>(`${this._getVendorContactHistory}?vendorId=${vendorId}&vendorContactId=${vendorContactId}`, this.getRequestHeaders())
	}

	getVendorDocumentAuditHistory(id) {
		return this.http.get<any>(`${this._getVendorDocumentHistory}/${id}`, this.getRequestHeaders())
	}

	getVendorCapabilityAuditHistory(VendorCapabilityId, VendorId) {
		return this.http.get<any>(`${this._getVendorCapabilityHistory}?VendorCapabilityId=${VendorCapabilityId}&VendorId=${VendorId}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getVendorCapabilityAuditHistory(VendorCapabilityId, VendorId));
		});
	}

	updateBillAddressDetails<T>(roleObject: any, vendorBillingAddressId: number): Observable<T> {
		let endpointUrl = `${this._updateVendorBillAddressDetails}/${roleObject.vendorBillingAddressId}`;
		return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.updateBillAddressDetails(roleObject, vendorBillingAddressId));
			});
	}

	vendorGeneralDocumentUploadEndpoint<T>(file: any, vendorId, moduleId, moduleName, uploadedBy, masterCompanyId): Observable<T> {
		const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
		return this.http.post<T>(`${this._addVendorDocumentDetails}?referenceId=${vendorId}&moduleId=${moduleId}&moduleName=${moduleName}&uploadedBy=${uploadedBy}&masterCompanyId=${masterCompanyId}`, file);
	}

	vendorGeneralFileUploadEndpoint<T>(file: any): Observable<T> {
		const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
		return this.http.post<T>(`${this._addVendorFileUpload}`, file);
	}


	GetVendorGeneralDocumentsListEndpoint(vendorId, moduleId) {
		return this.http.get<any>(`${this._addVendorgeneralFileDetails}/${vendorId}?moduleId=${moduleId}`, this.getRequestHeaders())
	}

	GetVendorAttachmentDeleteEndpoint(attachmentDetailId, updatedBy) {
		return this.http.delete(`${this._vendorDeleteAttachment}/${attachmentDetailId}?updatedBy=${updatedBy}`, this.getRequestHeaders())
	}


	getVendorProcess1099id<T>(companyId: number): Observable<T> {
		let endpointurl = `${this.vendorProcess1099Id}?companyId=${companyId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorProcess1099id(companyId));
			});
	}

	getVendorProcess1099idFromTransaction<T>(vendorId: number): Observable<T> {
		let endpointurl = `${this.vendorProcess1099IdFromTransaction}?vendorId=${vendorId}`;
		return this.http.get<T>(endpointurl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorProcess1099idFromTransaction(vendorId));
			});
	}

	repairOrderGlobalSearch(filterText, pageNumber, pageSize, vendorId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/Vendor/roglobalsearch?filterText=${filterText}&pageNumber=${pageNumber}&pageSize=${pageSize}&vendorId=${vendorId}`)
	}


	GetVendorBillingAddressDeleteEndpoint(billingAddressId, updatedBy) {
		return this.http.get<any>(`${this._deleteVendorBillingAddressDelete}?billingAddressId=${billingAddressId}&updatedBy=${updatedBy}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.GetVendorBillingAddressDeleteEndpoint(billingAddressId, updatedBy));
		});
	}

	GetVendorBillingAddressRestoreEndpoint(billingAddressId, updatedBy) {
		return this.http.get<any>(`${this._restoreVendorBillingAddressDelete}?billingAddressId=${billingAddressId}&updatedBy=${updatedBy}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.GetVendorBillingAddressDeleteEndpoint(billingAddressId, updatedBy));
		});
	}

	GetUpdateVendorBillingAddressStatusEndpoint(billingAddressId, status, updatedBy) {
		return this.http.get<any>(`${this._updateVendorBillingAddressStatus}?billingAddressId=${billingAddressId}&status=${status}&updatedBy=${updatedBy}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.GetUpdateVendorBillingAddressStatusEndpoint(billingAddressId, status, updatedBy));
		});
	}

	getHistoryForVendor(vendorId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/Vendor/GetVendorAuditHistory/${vendorId}`)
		.catch(error => {
			return this.handleError(error, () => this.getHistoryForVendor(vendorId));
		});
	}

	getVendorCapabilityByVendorId(vendorId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/Vendor/getVendorCapabilityByVendorId?vendorId=${vendorId}`)
	}

	getVendorDataById(vendorId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/Vendor/getvendordatabyid/${vendorId}`)
		.catch(error => {
			return this.handleError(error, () => this.getVendorDataById(vendorId));
		});
	}

	getAllVendorList(data) {
		return this.http.post(this.vendorListUrl, JSON.stringify(data), this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getAllVendorList(data));
			});
	}

	vendorListGlobalSearch(filterText, pageNumber, pageSize, isActive) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/Vendor/vendorglobalsearch?filterText=${filterText}&pageNumber=${pageNumber}&pageSize=${pageSize}&isActive=${isActive}`)
	}

	VendorBillingFileUpload(file, vendorId) {
		return this.http.post(`${this.configurations.baseUrl}${this.excelUploadBilling}?vendorId=${vendorId}`, file)
	}

	VendorShippingFileUpload(file, vendorId) {
		return this.http.post(`${this.configurations.baseUrl}${this.excelUploadShipping}?vendorId=${vendorId}`, file)
	}

	VendorInternationalShippingFileUpload(file, vendorId) {
		return this.http.post(`${this.configurations.baseUrl}${this.excelUploadInternationalShipping}?vendorId=${vendorId}`, file)
	}

	VendorContactFileUpload(file, vendorId) {
		return this.http.post(`${this.configurations.baseUrl}${this.excelUploadContact}?vendorId=${vendorId}`, file)
	}

	VendorCheckPaymentFileUpload(file, vendorId) {
		return this.http.post(`${this.configurations.baseUrl}${this.excelUploadPayment}?vendorId=${vendorId}`, file)
	}

	getInternationalShippingByVendorId(vendorId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/Vendor/internationalshippingdetaillist?VendorId=${vendorId}`)
		.catch(error => {
			return this.handleError(error, () => this.getVendorDataById(vendorId));
		});
	}

	postInternationalShipping(data) {
		return this.http.post(`${this.configurations.baseUrl}/api/Vendor/createinternationalshipping`, JSON.stringify(data), this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.postInternationalShipping(data));
		});
	}

	updateInternationalShipping(data) {
		return this.http.post(`${this.configurations.baseUrl}/api/Vendor/createinternationalshipping`, JSON.stringify(data), this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.updateInternationalShipping(data));
		});
	}

	getInternationalShippingById(vendorInternationalShippingId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/Vendor/internationalshippingdetailsbyid/${vendorInternationalShippingId}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.getInternationalShippingById(vendorInternationalShippingId));
		});
	}

	getVendorInternationalAuditHistory(vendorInternationalShippingId) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/Vendor/internationalshippingaudit/${vendorInternationalShippingId}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.getVendorInternationalAuditHistory(vendorInternationalShippingId));
		});
	}

	deleteVendorInternationalShipping(vendorId, updatedBy) {
		return this.http.delete(`${this.configurations.baseUrl}/api/Vendor/deleteinternationalshipping?id=${vendorId}&updatedBy=${updatedBy}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.deleteVendorInternationalShipping(vendorId, updatedBy));
		});
	}

	updateStatusForInternationalShipping(vendorInternationalShippingId, status, updatedBy) {
		return this.http.put(`${this.configurations.baseUrl}/api/Vendor/internationalshippingstatusupdate?id=${vendorInternationalShippingId}&status=${status}&updatedBy=${updatedBy}`, {}, this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.updateStatusForInternationalShipping(vendorInternationalShippingId, status, updatedBy));
		});
	}

	updateStatusForInternationalShippingVia(id, status, updatedBy) {
		return this.http.put(`${this.configurations.baseUrl}/api/Vendor/internationalshipviastatusupdate?id=${id}&status=${status}&updatedBy=${updatedBy}`, {}, this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.updateStatusForInternationalShippingVia(id, status, updatedBy));
		});
	}

	updateStatusForDomesticShippingVia(id, status, updatedBy) {
		return this.http.put(`${this.configurations.baseUrl}/api/Vendor/vendorshippingstatus?id=${id}&status=${status}&updatedBy=${updatedBy}`, {}, this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.updateStatusForDomesticShippingVia(id, status, updatedBy));
		});
	}

	getATAMappingByContactId<T>(contactId: number, isDeleted? : boolean): Observable<T> {
		let endpointUrl = `${this.configurations.baseUrl}/api/Vendor/getVendorContactATAMapped/${contactId}?isDeleted=${isDeleted}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getATAMappingByContactId(contactId, isDeleted));
			});
	}

	postVendorContactATAMapped(data) {
		const url = `${this.configurations.baseUrl}/api/Vendor/VendorContactATAPost`;
		return this.http.post(url, JSON.stringify(data), this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.postVendorContactATAMapped(data));
		});
	}

	updateVendorContactATAMApped(data) {
		const url = `${this.configurations.baseUrl}/api/Vendor/VendorContactATAUpdate/${data.vendorContactATAMappingId}`
		return this.http.put(url, JSON.stringify(data), this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.updateVendorContactATAMApped(data));
		});
	}

	deleteATAMappedByContactId(contactId) {
		return this.http.delete(`${this.configurations.baseUrl}/api/Vendor/DeleteVendorContactATAMapping/${contactId}`, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.deleteATAMappedByContactId(contactId));
			});
	}

	restoreATAMappedByContactId(contactId) {
		return this.http.delete(`${this.configurations.baseUrl}/api/Vendor/RestoreVendorContactATAMapping/${contactId}`, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.restoreATAMappedByContactId(contactId));
			});
	}

	getVendorContactATAAuditDetails<T>(vendorContactATAMappingId: any): Observable<T> {
		let url = `${this.configurations.baseUrl}/api/Vendor/getVendorATAMappedAudit/${vendorContactATAMappingId}`;
		return this.http.get<T>(url, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getVendorContactATAAuditDetails(vendorContactATAMappingId));
			});
	}
	
	getATAMappedByVendorId(id,isDeleted) { ///${vendorId}?isDeleted=${moduleId}
		let url = `${this.configurations.baseUrl}/api/Vendor/getVendorATAMapped/${id}?isDeleted=${isDeleted}`
		return this.http.get<any>(url, this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.getATAMappedByVendorId(id, isDeleted));
		});
	}

	searchATAMappedByMultiATAIDATASUBIDByVendorId<T>(vendorId, searchUrl: string) {
		let endpointUrl = `${this.configurations.baseUrl}/api/Vendor/searchGetVendorATAMappedByMultiATAIDATASubID?vendorId=${vendorId}&${searchUrl}`;
		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.searchATAMappedByMultiATAIDATASUBIDByVendorId(vendorId, searchUrl));
		});
	}

	getContactsByVendorId(vendorId) {
		let url = `${this.configurations.baseUrl}/api/vendor/GetContactsByVendorId?id=${vendorId}`;
		return this.http.get<any>(url, this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.getContactsByVendorId(vendorId));
		});
	}

	getReceivingPOList(data) {
        return this.http.post(this._receivingPOList, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getReceivingPOList(data));
            });
	}

	getReceivingPOListGlobal(data) {
        return this.http.post(this._receivingPOListGlobal, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getReceivingPOListGlobal(data));
            });
	}

	getAllReceivingROList(data) {
        return this.http.post(this._receivingROList, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAllReceivingROList(data));
            });
	}

	getReceivingROListGlobal(data) {
        return this.http.post(this._receivingROListGlobal, JSON.stringify(data), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getReceivingROListGlobal(data));
            });
	}
	
	getVendorNameCodeListwithFilter(filterVal,count,idList?,masterCompanyId?) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/vendor/vendorDataFilter?filterVal=${filterVal}&count=${count}&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders())
		.catch(error => {
			return this.handleErrorCommon(error, () => this.getVendorNameCodeListwithFilter(filterVal,count,idList,masterCompanyId));
		});
	}

	getVendorNameCodeList() {
		let url = `${this.configurations.baseUrl}/api/vendor/vendordataforporo`
		return this.http.get<any>(url, this.getRequestHeaders())
		.catch(error => {
			return this.handleError(error, () => this.getVendorNameCodeList());
		});
	}	

	getVendorContactDataByVendorId(id) {
		let url = `${this.configurations.baseUrl}/api/vendor/vendorcontactdatabyvendorid/${id}`
		return this.http.get<any>(url, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getVendorContactDataByVendorId(id));
          });
	}
	
	getVendorCreditTermsByVendorId(id) {
		let url = `${this.configurations.baseUrl}/api/vendor/vendorcreditterms/${id}`
		return this.http.get<any>(url, this.getRequestHeaders()).catch(error => {
            return this.handleErrorCommon(error, () => this.getVendorCreditTermsByVendorId(id));
          });
	}

	uploadVendorCapabilitiesList(file, vendorId, data) {
        return this.http.post(`${this.configurations.baseUrl}${this._addCapesDocumentDetails}?vendorId=${vendorId}`, file, data)
	}

	uploadVendorCapsList(file, data) {
        return this.http.post(`${this.configurations.baseUrl}${this._UploadVendorCapesDetails}`, file, data)
	}
}