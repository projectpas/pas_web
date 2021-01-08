
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {catchError,map} from 'rxjs/operators'

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class CustomerEndpoint extends EndpointFactory {

    private readonly _getContactHistroty: string = "/api/Customer/getContactHistroty";
    private readonly _customersUrl: string = "/api/Customer/Get";
    private readonly _customersUrlAll: string = "/api/Customer/GetAll";

    private readonly _customerTypeUrl: string = "/api/Customer/CustomerTypeGet";
    private readonly _aircraftTypeUrl: string = "/api/Customer/aircraftTypeGet";
    private readonly _updateShipAddressDetails: string = "/api/Customer/updateShipAddress";
    private readonly _customersUrlNew: string = "/api/Customer/customers";
    private readonly _updateActiveInactive: string = "/api/Customer/customersUpdateforActive";
    private readonly _insertToaddAudit: string = "/api/Customer/insertToAuditaddress";
    private readonly _updateToaddressaudit: string = "/api/Customer/updateToAuditaddress";
    private readonly _deleteShipingData: string = "/api/Customer/deleteCustomerShipping";
    private readonly _updatelists: string = "/api/Customer/updatelistStatus";
    private readonly _generalurl: string = "/api/Customer/customergeneralinfo";
    private readonly _addressUrl: string = "/api/Customer/AddressGet";
    private readonly _customerBillAddressUrl = "/api/Customer/customerAddressGet";
    private readonly _cusShippingGeturl = "/api/Customer/cusshippingGet";
    private readonly _cusShippingGeturlwithId = "/api/Vendor/cusshippingGetwithid";
    private readonly _customerList: string = '/api/Customer/List';
    private readonly __venshipwithid = "/api/Vendor/venshippingGetwithid";
    private readonly _customerBillViaDetails = "/api/Customer/getCustomerBillViaDetails";
    private readonly _getBilladdresshistory = "/api/Customer/getCustomerBillAddressHistory";
    private readonly _billingInfoUrl: string = "/api/Customer/CustomerBillingPost";
    private readonly _updateBillAddressDetails: string = "/api/Customer/customerBillAddressdetails";
    private readonly _updatshippingAddressDetails: string = "/api/Customer/cusShippingUpdate";
    private readonly _updateStatusCustomerShipping: string = "/api/Customer/updateStatusCustomerShipping";
    // private readonly _saveBillViaDetails: string = "/api/Customer/addShipViaDetails";
    private readonly _customerShipViaDetails: string = "/api/Customer/getCustomerShipViaDetails";
    private readonly _updateBillingViaDetails: string = "/api/Customer/customerBillAddressdetails";
    private readonly _deleteBillingCusDettilas: string = "/api/Customer/DeleteCustomerBillingInfo";
    private readonly _customerBillAddressdetails: string = "/api/Customer/customerBillAddressdetails";
    //private readonly _customerBillingUrlNew: string = "/api/Customer/updateStatusCustomerBilling";
    private readonly _contacturl: string = "/api/Customer/ContactGet";
    private readonly _getATAchapterUrl: string = "/api/Customer/AtachapterGet";
    private readonly _fianlurl: string = "/api/Customer/fianlEmptyObj";
    private readonly _customerListWithId: string = "/api/Customer/CustomerlistIdGet";
    private readonly _customerRowBySearchId: string = "/api/Customer/CustomerRowByIdGet";
    private readonly _customerCommonDataBySearchId: string = "/api/Customer/customer-common-data";
    private readonly _customerCommonDataWithContactsBySearchId: string = "/api/Customer/customer-common-data-with-contact";
    private readonly _salesListWithId: string = "/api/Customer/Saleslist";
    private readonly _contactGeturl: string = "/api/Vendor/ContactCompleteGet"; LegalContact
    private readonly _deleteContactUrl: string = "/api/Customer/CustomerContact";
    private readonly _deleteContactUrl1: string = "/api/Customer/LegalContact";
    private readonly _CustomerContactUrlNew: string = "/api/Customer/updateStatusCusShippingAddress";
    private readonly _CustomerContctUrl: string = "/api/Customer/CustomerContactPost";

    private readonly _CustomerContctUrl1: string = "/api/Customer/LegalContactPost";
    private readonly _CustomerUpdateContctUrl: string = "/api/Customer/ContactPost";
    private readonly _contactsEmptyObjurl: string = "/api/Customer/contactEmptyObj";
    private readonly _getShipViaByShippingId: string = "/api/Customer/GetShipVia";
    private readonly _getShipViaHistory: string = "/api/Customer/getShipViaHistory";
    private readonly _shippingInfoUrl: string = "/api/Customer/CustomerShippingPost";
    private readonly _saveShipViaDetails: string = "/api/Customer/addShipViaDetails";
    private readonly _updateShippingViaDetails: string = "/api/Customer/updateShipViaDetails";
    private readonly _CustomerShipAddressdetails: string = "/api/Customer/CustomerShippingAddressDetails";
    private readonly _CustomerShippingUrlNew: string = "/api/Customer/updateStatusCustomerShipping";
    private readonly _customerFinanceUrl: string = "/api/Customer/customerFinancePost";
    private readonly _customerFinanceInfoSaveUrl: string = "/api/Customer/customer-financial-info-save";
    private readonly _customerFinanceInfoGetUrl: string = "/api/Customer/customer-financial-info-get";
    private readonly _customerSalesUrl: string = "/api/Customer/customerSalesPost";
    private readonly _customerSalesSaveUrl: string = "/api/Customer/customer-sales-info-save";
    private readonly _customerSalesGetUrl: string = "/api/Customer/customer-sales-info-get";
    private readonly _CustomerwarningUrl: string = "/api/Customer/saveCustomerWarnings";
    private readonly _CustomerdataUrl: string = "/api/Customer/saveCustomeraircraftdata";
    private readonly _countryUrl: string = "/api/Customer/GetcountryList";
    private readonly _countryUrlNew: string = "api/Customer/postCountryList";
    private readonly _actionsUrl: string = "api/customer/Getdiscount";
    private readonly _discountPutUrl: string = "api/Customer/updatediscount";
    private readonly _newDiscount: string = "api/Customer/insertDiscount";
    private readonly _Customerwarningget: string = "/api/Customer/CustomerWarningsget";
    private readonly _aircraftmodelsPost: string = "/api/Customer/Aircraftpost";
    private readonly _getAircraftUrl: string = "/api/Customer/Aircraftget";
    //private readonly _customersUrlAuditHistory: string = "/api/customer/auditHistoryById";
    private readonly _listUrl: string = "/api/Customer/GetCustomerBynameList";
    private readonly _aircraftmodelsurl: string = "/api/Customer/GetAircarftmodelsdata";
    private readonly _updateActiveInactiveforBilling: string = "/api/Customer/billingUpdateforActive";
    private readonly _updateActiveInactiveforshipping: string = "/api/Customer/shippingUpdateforActive";
    private readonly _getAircraftManufacturerUrl: string = "/api/Customer/aircraftManufacturerGet";
    private readonly _multiintegrationsdataUrl: string = "/api/Customer/savemultiIntegrations";
    private readonly _getIntegrationUrl: string = "/api/Customer/IntegrationGet";
    private readonly _listsUrl: string = "/api/Customer/GetDescriptionbypart";
    private readonly getMarkup: string = "api/customer/getMarkUpValues";
    private readonly addMarkUp: string = "/api/customer/addMarkUp";
    private readonly getAllCustomersURL: string = "/api/customer/getAllCustomers";
    private readonly getAllCustomersInfoURL: string = "/api/customer/getAllCustomersInfo";
    private readonly getCustomer: string = "/api/customer/pagination";
    private readonly getGlobalCustomer: string = "/api/customer/globalSearch";


    private readonly _getAircraftMapped: string = "/api/Customer/getCustomerAircraftMapped";
    private readonly _getAircraftMappedAudit: string = "/api/Customer/getCustomerAircraftMappedAudit";
    private readonly _CustomerAircraftPostUrl: string = "/api/Customer/CustomerAircraftPost";
    private readonly _getTaxTypeRateMapped: string = "/api/Customer/getCustomerTaxTypeRateMapped";
    private readonly _CustomerTaxTypeRatePostUrl: string = "/api/Customer/CustomerTaxTypeRatePost";

    private readonly _CustomerAircraftSearchUrl: string = '/api/Customer/searchCustomerAircraftMappingDataByMultiTypeIdModelIDDashID';
    private readonly _CustomerATAPostUrl: string = "/api/Customer/CustomerContactATAPost";
    private readonly _getATAMappedByContactId: string = "/api/Customer/getCustomerContactATAMapped";
    private readonly _getATAMappedByCustomerId: string = "/api/Customer/getCustomerATAMapped";
    private readonly _getContactsByCustomerId: string = "/api/Customer/GetCustomerContacts";
    private readonly _getCustomerContactGet: string = "/api/Customer/customer-contact-get";


    private readonly _deleteATAMappedByContactId: string = "/api/Customer/DeleteCustomerContactATAMapping"
    private readonly _restoreATAMappedByContactId: string = "/api/Customer/RestoreCustomerContactATAMapping"
    private readonly _CustomerAtaSearchUrl: string = '/api/Customer/searchGetCustomerATAMappedByMultiATAIDATASubID';

    private readonly _internationalshippingpost: string = '/api/Customer/createinternationalshipping'
    private readonly _internationalshippingget: string = '/api/Customer/internationalshippingdetaillist'
    private readonly _internationalstatus: string = '/api/Customer/internationalshippingdetailsstatus'
    private readonly _internationalShippingDelete: string = '/api/Customer/deleteinternationalshipping';
    private readonly _internationalshippingdetailsbyid: string = '/api/Customer/internationalshippingdetailsbyid';
    private readonly _updateinternationalshipping: string = '/api/Customer/updateinternationalshipping';
    private readonly _createinternationalshippingviadetails: string = '/api/Customer/createshippingviadetails';
    private readonly _internationalShipViaList: string = '/api/Customer/getshippingviadetails';
    private readonly _updateshippingviadetails: string = '/api/Customer/updateshippingviadetails';
    private readonly _deleteATAMapped: string = '/api/Customer/DeleteCustomerATAMapping';
    private readonly _deleteAircraftMappedInventory: string = '/api/Customer/DeleteCustomerAircraftMapping';
    private readonly _restoreAircraftMappedInventory: string = '/api/Customer/RestoreCustomerAircraftMapping';
    private readonly _updateActiveAircraftInvetory: string = '/api/Customer/UpdateActiveStatusCustomerAircraftMapping';
    private readonly _deleteTaxTypeRateMapped: string = '/api/Customer/DeleteCustomerTaxTypeRateMapping';
    private readonly _addShipViaDetails: string = '/api/Customer/addShipViaDetails';
    private readonly _addDocumentDetails: string = '/api/Customer/customerDocumentUpload';
    private readonly _addRemoveDetails: string = '/api/Customer/customerDocumentDelete';

    private readonly _deleteCustomerDocuments: string = '/api/Customer/deleteCustomerDocuments';

    private readonly _customerContactHistory: string = '/api/Customer/customercontactauditdetails'
    private readonly _customerContactHistory1: string = '/api/Customer/Legalcontactauditdetails'
    private readonly _customerGlobalSearch: string = '/api/Customer/ListGlobalSearch'
    private readonly _customerGetWarning: string = '/api/Customer/GetCustomerWarnings';
    private readonly _customerWarningsByCustomerAndCustomerWarningListIdUrl: string = '/api/common/customerwarnings'
    private readonly _customerRestrictionsByCustomerAndCustomerWarningListIdUrl: string = '/api/common/customerrestrictions'
    private readonly _customerBillingHistory: string = "/api/Customer/getCustomerBillingHistory"
    private readonly _customerclassificationMapUrl: string = "/api/Customer/customerclassificationmappings";
    private readonly _deleteInternationalShippingViaMapUrl: string = '/api/Customer/deleteshippingviadetails';
    private readonly _restoreInternationalShippingViaMapUrl: string = '/api/Customer/restoreshippingviadetails';
    private readonly _deleteShipVia: string = '/api/Customer/deleteshipviadetails';
    private readonly _restoreShipVia: string = '/api/Customer/restoreshipviadetails';

    private readonly _deleteRestrictedParts: string = '/api/Customer/deletesRestrictedParts';
    private readonly _restoreRestrictedParts: string = '/api/Customer/restoreRestrictedParts';

    private readonly _shippingDetailsStatus: string = '/api/Customer/shippingdetailsstatus';
    private readonly _shippingdetailsviastatus: string = '/api/Customer/shippingdetailsviastatus'



    private readonly _customersBillingUpdateforActive: string = '/api/Customer/customersBillingUpdateStatus'
    private readonly _getCustomerDocumentAttachmentslist: string = "/api/FileUpload/getcustomerdocumentattachmentdetails";
    private readonly _updateCustomerDocument: string = '/api/Customer/customerDocumentUpdate';
    private readonly _addCustomerFileUpload: string = "/api/Customer/customerFinanceDocumentUpload";

    private readonly _addCustomerFinanceFileDetails: string = "/api/Customer/getCustmerFinanceDocumentDetail";

    private readonly _customerDeleteAttachment: string = "/api/Customer/customerAttachmentDelete";
    private readonly _customerAircraftUpdate: string = "/api/Customer/CustomerAircraftUpdate";
    private readonly _customerHistory: string = "/api/Customer/GetCustomerAuditHistoryByid"
    private readonly _customerShippingHistory: string = "/api/Customer/getCustomerShippingHistory"
    private readonly _customerInterShippingHistory: string = "/api/Customer/GetCustomerInternationalShippingAuditHistoryByid";
    private readonly _customerShipViaHistory: string = "/api/Customer/GetShipViaAudit"
    private readonly _customerInterShipViaHistory: string = "/api/Customer/getauditshippingviadetailsbyid"
    private readonly _getCustomerDocumentHistory: string = "/api/Customer/getCustomerDocumentAudit"
    private readonly excelUpload: string = "/api/Customer/uploadcustomerbillingaddress"
    private readonly excelUploadShipping: string = "/api/Customer/uploadcustomershippingaddress"
    private readonly excelUploadInterShipping: string = "/api/Customer/uploadcustomerinternationalshipping"
    private readonly excelUploadContact: string = "/api/Customer/uploadcustomercontacts"
    private readonly _internationalShipViaByShippingIdList: string = '/api/Customer/getinternationalshippingviadetails';
    private readonly _customerContacATAHistory: string = '/api/Customer/getCustomerATAMappedAudit'
    get globalSearch() { return this.configurations.baseUrl + this.getGlobalCustomer; }
    get paginate() { return this.configurations.baseUrl + this.getCustomer; }
    get customerBillAddressUrl() { return this.configurations.baseUrl + this._customerBillAddressUrl; }
    get cusShippingUrl() { return this.configurations.baseUrl + this._cusShippingGeturl; }
    get cusShippingUrlwithaddressid() { return this.configurations.baseUrl + this._cusShippingGeturlwithId; }
    get venShippingUrlwithaddressid() { return this.configurations.baseUrl + this.__venshipwithid; }
    get customerBillViaDetails() { return this.configurations.baseUrl + this._customerBillViaDetails; }
    get getBilladdresshistory() { return this.configurations.baseUrl + this._getBilladdresshistory; }
    get customerShipViaDetails() { return this.configurations.baseUrl + this._customerShipViaDetails; }
    get getContactHistory() { return this.configurations.baseUrl + this._getContactHistroty; }
    get customersUrl() { return this.configurations.baseUrl + this._customersUrl; }
    get customersUrlAll() { return this.configurations.baseUrl + this._customersUrlAll; }
    get getCustomerTypeUrl() { return this.configurations.baseUrl + this._customerTypeUrl; }
    get getAircraftTypeUrl() { return this.configurations.baseUrl + this._aircraftTypeUrl; }
    get generalurl() { return this.configurations.baseUrl + this._generalurl; }
    get customerListWithId() { return this.configurations.baseUrl + this._customerListWithId; }
    get customerRowById() { return this.configurations.baseUrl + this._customerRowBySearchId; }
    get customerCommonDataById() { return this.configurations.baseUrl + this._customerCommonDataBySearchId; }
    get customerCommonDataWithContactsById() { return this.configurations.baseUrl + this._customerCommonDataWithContactsBySearchId; }
    get addressUrl() { return this.configurations.baseUrl + this._addressUrl }
    get customersattributesUrl() { return this.configurations.baseUrl + this._customersUrl; }
    get contctsCompleteUrl() { return this.configurations.baseUrl + this._contactGeturl; }
    get contctsUrl() { return this.configurations.baseUrl + this._contacturl; }
    get contactEmptyurl() { return this.configurations.baseUrl + this._contactsEmptyObjurl }
    get getATAchapterUrl() { return this.configurations.baseUrl + this._getATAchapterUrl }
    get getAircraftUrl() { return this.configurations.baseUrl + this._getAircraftUrl }
    get salesListWithId() { return this.configurations.baseUrl + this._salesListWithId }
    get fianlurl() { return this.configurations.baseUrl + this._fianlurl }
    get getShipViaHistory() { return this.configurations.baseUrl + this._getShipViaHistory; }
    get CustomerWarningsDetails() { return this.configurations.baseUrl + this._Customerwarningget; }
    get countryUrl() { return this.configurations.baseUrl + this._countryUrl; }
    //get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; } 
    //get discountPutUrl() { return this.configurations.baseUrl + this._discountPutUrl; }
    //get discountPostUrl() { return this.configurations.baseUrl + this._discountPostUrl; }
    get listUrl() { return this.configurations.baseUrl + this._listUrl; }
    get aircraftmodelsurl() { return this.configurations.baseUrl + this._aircraftmodelsurl; }
    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }
    get getAircraftManufacturerUrl() { return this.configurations.baseUrl + this._getAircraftManufacturerUrl; }
    get getIntegrationUrl() { return this.configurations.baseUrl + this._getIntegrationUrl; }
    get listsUrl() { return this.configurations.baseUrl + this._listsUrl; }

    get getCustomerAircrafPosttUrl() { return this.configurations.baseUrl + this._CustomerAircraftPostUrl }
    get getCustomerATAPosttUrl() { return this.configurations.baseUrl + this._CustomerATAPostUrl }
    get getCustomerTaxTypeRatePosttUrl() { return this.configurations.baseUrl + this._CustomerTaxTypeRatePostUrl }
    get InternationalShippingPost() { return this.configurations.baseUrl + this._internationalshippingpost }
    get InternationalShippingList() { return this.configurations.baseUrl + this._internationalshippingget }
    get InternationalShippingStatus() { return this.configurations.baseUrl + this._internationalstatus }
    get InternationalShippingDelete() { return this.configurations.baseUrl + this._internationalShippingDelete }
    get InternationalShippingById() { return this.configurations.baseUrl + this._internationalshippingdetailsbyid }
    get UpdateInternationalshipping() { return this.configurations.baseUrl + this._updateinternationalshipping }
    get InternationalShipVia() { return this.configurations.baseUrl + this._createinternationalshippingviadetails }
    get ShipViaByInternationalShippingId() { return this.configurations.baseUrl + this._internationalShipViaList }
    get UpdateShipViaInternational() { return this.configurations.baseUrl + this._updateshippingviadetails }
    get CustomerAircraftSearchUrl() { return this.configurations.baseUrl + this._CustomerAircraftSearchUrl }
    get CustomerATASearchUrl() { return this.configurations.baseUrl + this._CustomerAtaSearchUrl }
    get deleteATAMapped() { return this.configurations.baseUrl + this._deleteATAMapped }
    get deleteAircraftInvetory() { return this.configurations.baseUrl + this._deleteAircraftMappedInventory }
    get restoreAircraftInvetory() { return this.configurations.baseUrl + this._restoreAircraftMappedInventory }
    get updateActiveAircraftInvetory() { return this.configurations.baseUrl + this._updateActiveAircraftInvetory }
    get deleteTaxTypeRateMapped() { return this.configurations.baseUrl + this._deleteTaxTypeRateMapped }
    get domesticShipVia() { return this.configurations.baseUrl + this._addShipViaDetails }
    get customerclassificationMapUrl() { return this.configurations.baseUrl + this._customerclassificationMapUrl; }

    get deleteInternationalShippingViaMapUrl() { return this.configurations.baseUrl + this._deleteInternationalShippingViaMapUrl; }
    get deleteRestrictedParts() { return this.configurations.baseUrl + this._deleteRestrictedParts; }
    get ShippingDetailsStatus() { return this.configurations.baseUrl + this._shippingDetailsStatus }
    get shippingdetailsviastatus() { return this.configurations.baseUrl + this._shippingdetailsviastatus }


    get customersBillingUpdateforActive() { return this.configurations.baseUrl + this._customersBillingUpdateforActive }
    get deleteShipVia() { return this.configurations.baseUrl + this._deleteShipVia; }
    get restoreShipVia() { return this.configurations.baseUrl + this._restoreShipVia; }
    get deleteCustomerDocuments() { return this.configurations.baseUrl + this._addRemoveDetails; }
    get InternatioanlShipViaByInternationalShippingId() { return this.configurations.baseUrl + this._internationalShipViaByShippingIdList }
    get customerContacATAHistory() { return this.configurations.baseUrl + this._customerContacATAHistory }



    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getCustomerBillingHistory<T>(customerId: number, customerBillingAddressId: number): Observable<T> {
        return this.http.get<T>(`${this.configurations.baseUrl}/${this._customerBillingHistory}?customerId=${customerId}&customerBillingaddressId=${customerBillingAddressId}`)
    }

    getShipViaByDomesticShippingId<T>(customerShippingId: number, isDeleted: boolean): Observable<T> {
        return this.http.get<any>(`${this.configurations.baseUrl}/${this._getShipViaByShippingId}/${customerShippingId}?isDeleted=${isDeleted}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getShipViaByDomesticShippingId(customerShippingId, isDeleted));
            }));
    }

    getCustomerWarningsById<T>(customerId: number): Observable<T> {
        return this.http.get<any>(`${this.configurations.baseUrl}${this._customerGetWarning}/${customerId}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerWarningsById(customerId));
            }));
    }

    getCustomerWarningsByCustomerIdandCustomerWarningsListID(customerId, customerWarningListId) {
        return this.http.get<any>(`${this.configurations.baseUrl}${this._customerWarningsByCustomerAndCustomerWarningListIdUrl}?customerId=${customerId}&customerWarningListId=${customerWarningListId}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerWarningsByCustomerIdandCustomerWarningsListID(customerId, customerWarningListId));
            }));
    }
    getCustomerRestrictionsByCustomerIdandCustomerWarningsListID(customerId, customerWarningListId) {
        return this.http.get<any>(`${this.configurations.baseUrl}${this._customerRestrictionsByCustomerAndCustomerWarningListIdUrl}?customerId=${customerId}&customerWarningListId=${customerWarningListId}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerRestrictionsByCustomerIdandCustomerWarningsListID(customerId, customerWarningListId));
            }));
    }
    getDocumentList(customerId: number, isDeleted: boolean) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/Customer/getCustomerDocumentDetail/${customerId}?isDeleted=${isDeleted}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDocumentList(customerId, isDeleted));
            }));
    }

    postDomesticShipVia<T>(postData: any): Observable<T> {
        return this.http.post<any>(this.domesticShipVia, JSON.stringify(postData), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.postDomesticShipVia(postData));
            }));
    }

    getCustomerAll(data) {
        return this.http.post(this._customerList, JSON.stringify(data), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerAll(data));
            }));
    }

    getDocumentUploadEndpoint<T>(file: any): Observable<T> {
        const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post<any>(`${this._addDocumentDetails}`, file)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDocumentUploadEndpoint(file));
            }));
    }

    getDeleteDocumentEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._addDocumentDetails}/${actionId}`;
        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () =>
                    this.getDeleteDocumentEndpoint(actionId)
                );
            }));
    }

    getCustomerContactAuditDetails<T>(customerContactId: number, customerId: number): Observable<T> {
        return this.http.get<any>(`${this.configurations.baseUrl}${this._customerContactHistory}?customerContactId=${customerContactId}&customerId=${customerId}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () =>
                    this.getCustomerContactAuditDetails(customerContactId, customerId)
                );
            }));
    }

    getCustomerContactAuditDetails1<T>(customerContactId, customerId): Observable<T> {
        return this.http.get<any>(`${this.configurations.baseUrl}${this._customerContactHistory1}?customerContactId=${customerContactId}&customerId=${customerId}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () =>
                    this.getCustomerContactAuditDetails1(customerContactId, customerId)
                );
            }));
    }

    deleteAircraftInvetoryById<T>(id): Observable<T> {
        let endpointUrl = `${this.deleteAircraftInvetory}/${id}`;
        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.deleteAircraftInvetoryById(id));
            }));
    }

    restoreAircraftInvetoryById<T>(id): Observable<T> {
        let endpointUrl = `${this.restoreAircraftInvetory}/${id}`;
        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.restoreAircraftInvetoryById(id));
            }));
    }

    updateActiveStatusAircraftInvetoryById<T>(id, status, user): Observable<T> {
        let endpointUrl = `${this.updateActiveAircraftInvetory}?id=${id}&status=${status}&updatedBy=${user}`
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateActiveStatusAircraftInvetoryById(id, status, user));
            }));
    }

    deleteTaxTypeRateMappedDataById<T>(id, status, user): Observable<T> {
        let endpointUrl = `${this.deleteTaxTypeRateMapped}?id=${id}&status=${status}&updatedBy=${user}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.deleteTaxTypeRateMappedDataById(id, status, user));
            }));
    }
    searchATAMappedByMultiATAIDATASUBIDByCustomerId<T>(contactId: number, searchUrl: string): Observable<T> {
        let endpointUrl = `${this.CustomerATASearchUrl}?customerId=${contactId}&${searchUrl}`;

        return this.http
            .get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.searchATAMappedByMultiATAIDATASUBIDByCustomerId(contactId, searchUrl));
            }));
    }
    searchAirMappedByMultiTypeIDModelIDDashIDByCustomerId<T>(customerId: number, searchUrl: string): Observable<T> {
        let endpointUrl = `${this.CustomerAircraftSearchUrl}?customerId=${customerId}&${searchUrl}`;

        return this.http
            .get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.searchAirMappedByMultiTypeIDModelIDDashIDByCustomerId(customerId, searchUrl));
            }));
    }

    updateShipViaInternational<T>(postData): Observable<T> {

        return this.http.post<any>(this.UpdateShipViaInternational, JSON.stringify(postData), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateShipViaInternational(postData));
            }));
    }

    getShipViaByInternationalShippingId<T>(id, pageIndex, pageSize): Observable<T> {
        return this.http.get<any>(`${this.ShipViaByInternationalShippingId}?internationalShippingId=${id}&pageNumber=${pageIndex}&pageSize=${pageSize}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getShipViaByInternationalShippingId(id, pageIndex, pageSize));
            }));
    }

    postInternationalShipVia<T>(postData): Observable<T> {
        return this.http.post<any>(this.InternationalShipVia, JSON.stringify(postData), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.postInternationalShipVia(postData));
            }));
    }

    updateInternationalShipping<T>(postData): Observable<T> {
        return this.http.post<any>(this.UpdateInternationalshipping, JSON.stringify(postData), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateInternationalShipping(postData));
            }));
    }

    getInternationalShippingById<T>(id): Observable<T> {
        return this.http.get<any>(`${this.InternationalShippingById}?id=${id}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getInternationalShippingById(id));
            }));
    }

    deleteInternationalShipping<T>(id, updatedBy): Observable<T> {
        return this.http.get<any>(`${this.InternationalShippingDelete}?id=${id}&updatedBy=${updatedBy}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.deleteInternationalShipping(id, updatedBy));
            }));
    }

    updateStatusForInternationalShipping<T>(id, status, updatedBy): Observable<T> {
        return this.http.get<any>(`${this.InternationalShippingStatus}?id=${id}&status=${status}&updatedBy=${updatedBy}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateStatusForInternationalShipping(id, status, updatedBy));
            }));
    }
    updateStatusForInternationalShippingVia<T>(id, status, updatedBy): Observable<T> {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/customer/shippingviadetailsstatus?id=${id}&status=${status}&updatedBy=${updatedBy}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateStatusForInternationalShippingVia(id, status, updatedBy));
            }));
    }

    getInternationalShippingByCustomerId<T>(customerId) {
        return this.http.get<any>(`${this.InternationalShippingList}?customerId=${customerId}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getInternationalShippingByCustomerId(customerId));
            }));
    }

    postInternationalShippingPost<T>(postData): Observable<T> {
        return this.http.post<any>(this.InternationalShippingPost, JSON.stringify(postData), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.postInternationalShippingPost(postData));
            }));
    }

    postCustomerAircraft<T>(postData): Observable<T> {
        return this.http.post<any>(this.getCustomerAircrafPosttUrl, JSON.stringify(postData), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.postCustomerAircraft(postData));
            }));
    }

    postCustomerTaxTypeRate<T>(postData): Observable<T> {
        return this.http.post<any>(this.getCustomerTaxTypeRatePosttUrl, JSON.stringify(postData), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.postCustomerTaxTypeRate(postData));
            }));
    }

    postCustomerATA(postData): any {
        return this.http.post<any>(this.getCustomerATAPosttUrl, JSON.stringify(postData), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.postCustomerATA(postData));
            }));
    }
    updateCustomerTaxTypeRate<T>(data) {
        const url = `${this.configurations.baseUrl}/api/Customer/CustomerTaxTypeRateUpdate/${data.customerTaxTypeRateMappingId}`
        return this.http.put<any>(url, JSON.stringify(data), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateCustomerTaxTypeRate(data));
            }));
    }

    getAuditHistoryForTaxType<T>(customerTaxTypeRateMappingId): Observable<T> {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/Customer/CustomerTaxTypeRateAudit/${customerTaxTypeRateMappingId}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAuditHistoryForTaxType(customerTaxTypeRateMappingId));
            }));
    }

    getNewitemAircraftEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<any>(this._CustomerAircraftPostUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewitemAircraftEndpoint(userObject));
            }));
    }

    getNewitemATAEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<any>(this._CustomerATAPostUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewitemATAEndpoint(userObject));
            }));
    }

    getcustomerEndpoint<T>(): Observable<T> {
        return this.http.get<any>(this.customersUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getcustomerEndpoint());
            }));
    }

    getAllcustomerEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.customersUrlAll, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllcustomerEndpoint());
            }));
    }

    getcountryListEndpoint<T>(): Observable<T> {
        return this.http.get<any>(this.countryUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getcountryListEndpoint());
            }));
    }

    getCustomerTypes<T>(): Observable<T> {
        return this.http.get<any>(this.getCustomerTypeUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerTypes());
            }));
    }

    getAirccraftTypes<T>(selectedvalues: any): Observable<T> {
        let url = `${this.getAircraftTypeUrl}/${selectedvalues}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAirccraftTypes(selectedvalues));
            }));
    }

    getATAChapters<T>(): Observable<T> {
        return this.http.get<any>(this.getATAchapterUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getATAChapters());
            }));
    }

    getAircraftmodels<T>(): Observable<T> {
        return this.http.get<any>(this.getAircraftUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAircraftmodels());
            }));
    }

    getFinalrobj<T>(): Observable<T> {
        return this.http.get<any>(this.fianlurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getFinalrobj());
            }));
    }

    getUpdateFinanceInfo<T>(roleObject: any, customerId: number): Observable<T> {
        let endpointUrl = `${this._customerFinanceInfoSaveUrl}/${customerId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateFinanceInfo(roleObject, customerId));
            }));
    }

    getFinanceInfo<T>(customerId: number): Observable<T> {
        let endpointUrl = `${this._customerFinanceInfoGetUrl}/${customerId}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getFinanceInfo(customerId));
            }));
    }

    getUpdateSalesInfo(roleObject: any, customerId: number) {
        let endpointUrl = `${this._customerSalesSaveUrl}/${customerId}`;
        return this.http.put(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateSalesInfo(roleObject, customerId));
            }));
    }

    getSalesInfo<T>(customerId: number): Observable<T> {
        let endpointUrl = `${this._customerSalesGetUrl}/${customerId}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getSalesInfo(customerId));
            }));
    }

    getGeneralrobj<T>(): Observable<T> {
        return this.http.get<any>(this.generalurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getGeneralrobj());
            }));
    }

    getCustomersDatawithid<T>(customerId: any): Observable<T> {
        let endpointurl = `${this.customerListWithId}/${customerId}`;
        return this.http.get<any>(endpointurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomersDatawithid(customerId));
            }));
    }

    getCustomerListByid<T>(customerId: any): Observable<T> {
        let endpointurl = `${this.customerRowById}/${customerId}`;
        return this.http.get<any>(endpointurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerListByid(customerId));
            }));
    }

    getCustomerCommonDataByid<T>(customerId: any): Observable<T> {
        let endpointurl = `${this.customerCommonDataById}/${customerId}`;
        return this.http.get<any>(endpointurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerCommonDataByid(customerId));
            }));
    }

    getCustomerCommonDataWithContactsById<T>(customerId: any): Observable<T> {
        let endpointurl = `${this.customerCommonDataWithContactsById}/${customerId}`;
        return this.http.get<any>(endpointurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerCommonDataWithContactsById(customerId));
            }));
    }

    getsalespersonwithid<T>(customerId: any): Observable<T> {
        let endpointurl = `${this.salesListWithId}/${customerId}`;
        return this.http.get<any>(endpointurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getsalespersonwithid(customerId));
            }));
    }

    getNewCustomerContactInfo<T>(param: any): Observable<any> {
        delete param.contactId;
        let body = JSON.stringify(param);
        // delete param.masterCompanyId;        
        //let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
        return this.http.post(this._CustomerContctUrl, body, this.getRequestHeaders())
            .pipe(map((response: Response) => {
                return <any>response;
            }),catchError(error => {
                return this.handleError(error, () => this.getNewCustomerContactInfo(param));
            }));
    }

    getNewcustomerEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<any>(this._customersUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewcustomerEndpoint(userObject));
            }));
    }

    getNewcountryEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<any>(this._countryUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewcountryEndpoint(userObject));
            }));
    }

    insertToaddressAudit<T>(userObject: any): Observable<T> {
        return this.http.post<any>(this._insertToaddAudit, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.insertToaddressAudit(userObject));
            }));
    }

    AddCustomerContactDetails<T>(param: any): Observable<any> {
        let body = JSON.stringify(param);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
        return this.http.post(this._CustomerUpdateContctUrl, body, this.getRequestHeaders())
            .pipe(map((response: Response) => {
                return <any>response;

            }),catchError(error => {
                return this.handleError(error, () => this.AddCustomerContactDetails(param));
            }));
    }

    getEditcustomerEndpoint<T>(customerId?: number): Observable<T> {
        let endpointUrl = customerId ? `${this._customersUrlNew}/${customerId}` : this._customersUrlNew;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditcustomerEndpoint(customerId));
            }));
    }

    getUpdatecustomerEndpoint<T>(roleObject: any, customerId: number): Observable<T> {
        let endpointUrl = `${this._customersUrlNew}/${roleObject.customerId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdatecustomerEndpoint(roleObject, customerId));
            }));

    }

    getUpdatecustomerEndpointforActive<T>(roleObject: any, login): Observable<T> {
        let endpointUrl = `${this._updateActiveInactive}?CustomerId=${roleObject.customerId}&status=${roleObject.isActive}&updatedBy=${login}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdatecustomerEndpointforActive(roleObject, login));
            }));

    }

    updateAuditaddress<T>(roleObject: any, customerId: number): Observable<T> {
        let endpointUrl = `${this._updateToaddressaudit}/${roleObject.addressId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateAuditaddress(roleObject, customerId));
            }));
    }

    getHistoryCustomerEndpoint<T>(CustomerId: number): Observable<T> {
        let endpointUrl = `${this.getContactHistory}/${CustomerId}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getHistoryCustomerEndpoint(CustomerId));
            }));
    }

    getDeletecustomerEndpoint<T>(customerId: number): Observable<T> {
        let endpointUrl = `${this._customersUrlNew}/${customerId}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeletecustomerEndpoint(customerId));
            }));
    }

    removeById<T>(customerId: number): Observable<T> {
        let endpointUrl = `${this._updatelists}/${customerId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.removeById(customerId));
            }));
    }

    getDeleteShippingEndpoint<T>(customerId: number): Observable<T> {
        let endpointUrl = `${this._deleteShipingData}/${customerId}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteShippingEndpoint(customerId));
            }));
    }

    getContcatDetails<T>(CustomerId: any): Observable<T> {
        let endpointUrl = `${this.contctsUrl}/${CustomerId}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getContcatDetails(CustomerId));
            }));
    }
    getContcatCompleteDetails<T>(): Observable<T> {
        return this.http.get<any>(this.contctsCompleteUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getContcatCompleteDetails());
            }));
    }

    getCustomerBillAddressdetails<T>(customerId: any): Observable<T> {
        let endpointurl = `${this.customerBillAddressUrl}/${customerId}`;
        return this.http.get<any>(endpointurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerBillAddressdetails(customerId));
            }));
    }

    getCusHippingaddresdetails<T>(customerId: any): Observable<T> {
        let endpointurl = `${this.cusShippingUrl}/${customerId}`;
        return this.http.get<any>(endpointurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCusHippingaddresdetails(customerId));
            }));
    }

    getCusHippingaddresdetailswithid<T>(customerId: any): Observable<T> {
        let endpointurl = `${this.cusShippingUrlwithaddressid}/${customerId}`;
        return this.http.get<any>(endpointurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCusHippingaddresdetailswithid(customerId));
            }));
    }

    getvenHippingaddresdetailswithid<T>(customerId: any): Observable<T> {
        let endpointurl = `${this.venShippingUrlwithaddressid}/${customerId}`;
        return this.http.get<any>(endpointurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getvenHippingaddresdetailswithid(customerId));
            }));
    }

    getCustomerBillViaDetails<T>(roleObject: any): Observable<T> {
        let endpointUrl = `${this.customerBillViaDetails}/${roleObject}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerBillViaDetails(roleObject));
            }));
    }

    getBillviaHistory<T>(customerId: number): Observable<T> {
        let endpointUrl = `${this.getBillviaHistory}/${customerId}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getBillviaHistory(customerId));
            }));
    }

    getAircraftMappingEndpoint<T>(customerId: number): Observable<T> {
        let endpointUrl = `${this._getAircraftMapped}/${customerId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAircraftMappingEndpoint(customerId));
            }));
    }

    getMappedAirCraftDetailsByIdAndStatusEndpoint<T>(customerId: number, status: boolean): Observable<T> {
        let endpointUrl = `${this._getAircraftMapped}/${customerId}?status=${status}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getMappedAirCraftDetailsByIdAndStatusEndpoint(customerId, status));
            }));
    }

    getATAMappingByCustomerId<T>(customerId: number): Observable<T> {
        let endpointUrl = `${this._getATAMappedByCustomerId}/${customerId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getATAMappingByCustomerId(customerId));
            }));
    }

    getATAMappingByContactId<T>(contactId: number, isDeleted?: boolean): Observable<T> {
        let endpointUrl = `${this._getATAMappedByContactId}/${contactId}?isDeleted=${isDeleted}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getATAMappingByContactId(contactId, isDeleted));
            }));
    }

    deleteATAMappedByContactId(contactId) {
        return this.http.delete(`${this.configurations.baseUrl}${this._deleteATAMappedByContactId}/${contactId}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.deleteATAMappedByContactId(contactId));
            }));
    }

    restoreATAMappedByContactId(contactId) {
        return this.http.delete(`${this.configurations.baseUrl}${this._restoreATAMappedByContactId}/${contactId}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.restoreATAMappedByContactId(contactId));
            }));
    }

    getTaxTypeRateMappingEndpoint<T>(customerId: number, status: boolean): Observable<T> {
        let endpointUrl = `${this._getTaxTypeRateMapped}/${customerId}?status=${status}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getTaxTypeRateMappingEndpoint(customerId, status));
            }));
    }

    getShipaddressHistory<T>(customerId: number): Observable<T> {
        let endpointUrl = `${this.getBilladdresshistory}/${customerId}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getShipaddressHistory(customerId));
            }));
    }

    getNewBillinginfo<T>(param: any): Observable<T> {
        let body = JSON.stringify(param);
        //let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
        // post request to create new book
        return this.http
            .post<any>(this._billingInfoUrl, body, this.getRequestHeaders())
            //.map((res: Response) => res)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewBillinginfo(param));
            }));
    }

    getUpdateContactInfo<T>(roleObject: any, vendorId: number): Observable<T> {
        let endpointUrl = `${this._CustomerContctUrl}/${vendorId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateContactInfo(roleObject, vendorId));
            }));
    }

    getUpdateContactInfo1<T>(roleObject: any, vendorId: number): Observable<T> {
        let endpointUrl = `${this._CustomerContctUrl1}/${vendorId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateContactInfo1(roleObject, vendorId));
            }));
    }

    updateShippinginfo<T>(roleObject: any, customerId: any): Observable<T> {
        let endpointUrl = `${this._updatshippingAddressDetails}/${roleObject.customerDomensticShippingId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateShippinginfo(roleObject, customerId));
            }));
    }
    updateBillingInfo<T>(roleObject: any, customerId: any): Observable<T> {
        let endpointUrl = `${this._updatshippingAddressDetails}/${roleObject.customerShippingAddressId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateBillingInfo(roleObject, customerId));
            }));
    }

    updateStatusShippinginfo<T>(roleObject: any, customerId: any): Observable<T> {
        let endpointUrl = `${this._updateStatusCustomerShipping}/${roleObject.customerShippingAddressId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateStatusShippinginfo(roleObject, customerId));
            }));
    }
    getDeleteCustomerEndpoint<T>(roleObject: any): Observable<T> {
        let endpointUrl = `${this._CustomerContactUrlNew}/${roleObject.CustomerShippingAddressId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteCustomerEndpoint(roleObject));
            }));
    }

    getCustomerShipViaDetails<T>(roleObject: any): Observable<T> {
        let endpointUrl = `${this.customerShipViaDetails}/${roleObject.customerShippingAddressId}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerShipViaDetails(roleObject));
            }));
    }

    deleteContact<T>(id, updatedBy): Observable<T> {
        return this.http.delete<any>(`${this._deleteContactUrl}/${id}?updatedBy=${updatedBy}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.deleteContact(id, updatedBy));
            }));
    }

    deleteContactLegal<T>(id, updatedBy): Observable<T> {
        return this.http.delete<any>(`${this._deleteContactUrl1}/${id}?updatedBy=${updatedBy}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.deleteContactLegal(id, updatedBy));
            }));
    }

    updateBillingViainfo<T>(roleObject: any, customerId: any): Observable<T> {
        let endpointUrl = `${this._updateBillingViaDetails}/${customerId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateBillingViainfo(roleObject, customerId));
            }));
    }

    deleteBillingAddress<T>(roleObject: any, customerId: any): Observable<T> {
        let endpointUrl = `${this._deleteBillingCusDettilas}/${customerId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.deleteBillingAddress(roleObject, customerId));
            }));
    }

    getNewBillinginfoWithAddressId<T>(param: any, addressId: any): Observable<T> {
        param.vendorShippingAddressId = addressId;
        let body = JSON.stringify(param);
        //let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
        // post request to create new book
        return this.http
            .post(this._billingInfoUrl, body, this.getRequestHeaders())
            .pipe(map((res: Response) => <any>res.json())
            ,catchError(error => {
                return this.handleError(error, () => this.getNewBillinginfoWithAddressId(param, addressId));
            }));
    }

    getShipviaHistory<T>(CustomerId: number): Observable<T> {
        let endpointUrl = `${this.getShipViaHistory}/${CustomerId}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getShipviaHistory(CustomerId));
            }));
    }

    //Not In Use
    // getDeleteCustomerBillingEndpoint<T>(roleObject: any): Observable<T> {
    //     let endpointUrl = `${this._customerBillingUrlNew}/${roleObject.customerBillingId}`;
    //     return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
    //         .catch(error => {
    //             return this.handleError(error, () => this.getDeleteCustomerBillingEndpoint(roleObject));
    //         });
    // }    

    newShippingAll<T>(param: any): Observable<T> {

        let body = JSON.stringify(param);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
        //let options = new RequestOptions({ headers: headers });  // create a request option

        // post request to create new book
        return this.http
            .post(this._shippingInfoUrl, body, this.getRequestHeaders())
            .pipe(map((res: Response) => <any>res)
             ,catchError((error: any) => observableThrowError(error.json().error || 'Server error')));
    }


    // getNewShipppinginfo<T>(param: any): Observable<T> {


    getNewShipppinginfo<T>(param: any): Observable<T> {
        let body = JSON.stringify(param);
        //let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
        // post request to create new book
        return this.http
            .post(this._shippingInfoUrl, body, this.getRequestHeaders())
            .pipe(map((res: Response) => <any>res)
            ,catchError(error => {
                return this.handleError(error, () => this.getNewShipppinginfo(param));
            }));
    }

    getAddressDetails<T>(): Observable<T> {
        return this.http.get<any>(this.addressUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAddressDetails());
            }));
    }

    getEmptyrobj<T>(): Observable<T> {
        return this.http.get<any>(this.contactEmptyurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEmptyrobj());
            }));
    }

    getCustomerEndpoint<T>(): Observable<T> {
        return this.http.get<any>(this.customersattributesUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerEndpoint());
            }));
    }

    updateShippingViainfo<T>(roleObject: any, CustomerId: any): Observable<T> {
        let endpointUrl = `${this._updateShippingViaDetails}/${CustomerId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateShippingViainfo(roleObject, CustomerId));
            }));
    }

    updateCustomershippingAddressDetails<T>(param: any, CustomerId: any): Observable<any> {
        param.CustomerId = CustomerId;
        let body = JSON.stringify(param);
        //let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
        return this.http.post(this._CustomerShipAddressdetails, body, this.getRequestHeaders())
            .pipe(map((response: Response) => {
                return <any>response;
            })
            ,catchError(error => {
                return this.handleError(error, () => this.updateCustomershippingAddressDetails(param, CustomerId));
            }));
    }

    getNewShipppinginfoWithAddressId<T>(param: any, addressId: any): Observable<T> {
        param.CustomerShippingAddressId = addressId;
        let body = JSON.stringify(param);
        //let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
        // post request to create new book
        return this.http
            .post(this._shippingInfoUrl, body, this.getRequestHeaders())
            .pipe(map((res: Response) => <any>res.json())
            ,catchError(error => {
                return this.handleError(error, () => this.getNewShipppinginfoWithAddressId(param, addressId));
            }));
    }

    getDeletecustomershippingEndpoint<T>(roleObject: any): Observable<T> {
        let endpointUrl = `${this._CustomerShippingUrlNew}/${roleObject.customerShippingId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeletecustomershippingEndpoint(roleObject));
            }));
    }

    updateCustomerBillingAddressDetails<T>(param: any, customerId: any): Observable<any> {
        param.customerId = customerId;
        let body = JSON.stringify(param);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
        return this.http.post(this._customerBillAddressdetails, body, this.getRequestHeaders())
            .pipe(map((response: Response) => {
                return <any>response;
            })
            ,catchError(error => {
                return this.handleError(error, () => this.updateCustomerBillingAddressDetails(param, customerId));
            }));
    }

    getAddressDeatails<T>(): Observable<T> {
        return this.http.get<any>(this.addressUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAddressDeatails());
            }));
    }

    getCustomerwarnigs<T>(CustomerId: any): Observable<T> {
        let endpointurl = `${this.CustomerWarningsDetails}/${CustomerId}`;
        return this.http.get<any>(endpointurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerwarnigs(CustomerId));
            }));
    }

    saveCustomerWarningdata<T>(param: any): Observable<any> {
        let body = JSON.stringify(param);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
        return this.http.post(this._CustomerwarningUrl, body, this.getRequestHeaders())
            .pipe(map((response: Response) => {
                return <any>response;
            }),catchError(error => {
                return this.handleError(error, () => this.saveCustomerWarningdata(param));
            }));
    }
    //Not In Use
    // updateCustomerWarnings<T>(roleObject: any, customerWarningId): Observable<T> {
    //     let endpointUrl = `${this._CustomerwarningUrl}/${customerWarningId}`;
    //     return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
    //         .catch(error => {
    //             return this.handleError(error, () => this.updateCustomerWarnings(roleObject, customerWarningId));
    //         });
    // }

    getcustomeraircrafttypeEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<any>(this._CustomerdataUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getcustomeraircrafttypeEndpoint(userObject));
            }));
    }

    getDiscountEndpoint<T>(): Observable<T> {
        return this.http.get<any>(this._actionsUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDiscountEndpoint());
            }));
    }

    getNewDiscount<T>(userObject: any): Observable<T> {
        return this.http.post<any>(this._newDiscount, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewDiscount(userObject));
            }));
    }

    getupdateDiscount<T>(roleObject: any, discountId: number): Observable<T> {
        let endpointUrl = `${this._discountPutUrl}/${discountId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getupdateDiscount(roleObject, discountId));
            }));
    }

    getCustomerByname<T>(name): Observable<T> {
        let url = `${this.listUrl}/${name}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerByname(name));
            }));
    }

    saveAircraftinfo<T>(data: any): Observable<T> {
        return this.http.post<any>(this._aircraftmodelsPost, JSON.stringify(data), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.saveAircraftinfo(data));
            }));
    }

    geticustomertemMasterEndpoint<T>(): Observable<T> {
        return this.http.get<any>(this.actionsUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.geticustomertemMasterEndpoint());
            }));
    }

    getAircraftList<T>(cusId: any): Observable<T> {
        let url = `${this.aircraftmodelsurl}/${cusId}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAircraftList(cusId));
            }));
    }

    getUpdateBillingEndpointforActive<T>(roleObject: any, customerBillingAddressId: number): Observable<T> {
        let endpointUrl = `${this._updateActiveInactiveforBilling}/${roleObject.customerBillingAddressId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateBillingEndpointforActive(roleObject, customerBillingAddressId));
            }));
    }

    getUpdateBillingEndpoint<T>(roleObject: any, customerBillingAddressId: number): Observable<T> {
        let endpointUrl = `${this._customerBillAddressdetails}/${roleObject.customerBillingAddressId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateBillingEndpoint(roleObject, customerBillingAddressId));
            }));
    }

    getUpdateshippingEndpointforActive<T>(roleObject: any, customerShippingAddressId: number): Observable<T> {
        let endpointUrl = `${this._updateActiveInactiveforshipping}/${roleObject.customerShippingAddressId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateshippingEndpointforActive(roleObject, customerShippingAddressId));
            }));

    }

    getUpdateshippingEndpoint<T>(roleObject: any, customerShippingAddressId: number): Observable<T> {
        let endpointUrl = `${this._updateShippingViaDetails}/${roleObject.customerShippingAddressId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateshippingEndpoint(roleObject, customerShippingAddressId));
            }));
    }

    getAircraftManufacturerEndpoint<T>(cusId: any): Observable<T> {
        let url = `${this.getAircraftManufacturerUrl}/${cusId}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAircraftManufacturerEndpoint(cusId));
            }));
    }

    getMultiIntegrations<T>(userObject: any): Observable<T> {
        return this.http.post<any>(this._multiintegrationsdataUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getMultiIntegrations(userObject));
            }));
    }

    getIntegrationEndpoint<T>(customerId: any): Observable<T> {
        let url = `${this.getIntegrationUrl}/${customerId}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getIntegrationEndpoint(customerId));
            }));
    }

    getDescriptionbypart<T>(name): Observable<T> {
        let url = `${this.listsUrl}/${name}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDescriptionbypart(name));
            }));
    }

    getMarkUpEndpoint<T>(): Observable<T> {
        return this.http.get<any>(this.getMarkup, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getMarkUpEndpoint());
            }));
    }

    newMarkUp<T>(userObject: any): Observable<T> {
        return this.http.post<any>(this.addMarkUp, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.newMarkUp(userObject));
            }));
    }

    updateMarkUp<T>(roleObject: any, markUpPercentageId: number): Observable<T> {
        let endpointUrl = `${this.addMarkUp}/${markUpPercentageId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateMarkUp(roleObject, markUpPercentageId));
            }));
    }

    getAllCustomers<T>(): Observable<T> {
        let endPointUrl = this.getAllCustomersURL;
        return this.http.get<any>(endPointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllCustomers());
            }));
    }

    getAllCustomerInfo<T>(): Observable<T> {
        let endPointURL = this.getAllCustomersInfoURL;
        return this.http.get<any>(endPointURL, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllCustomerInfo());
            }));
    }

    getCustomerRecords<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.paginate;
        return this.http.post<any>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerRecords(paginationOption));
            }));
    }

    getGlobalCustomerRecords<T>(value, pageIndex, pageSize): Observable<T> {
        return this.http.get<any>(`${this.configurations.baseUrl}${this._customerGlobalSearch}?value=${value}&pageNumber=${pageIndex}&pageSize=${pageSize}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getGlobalCustomerRecords(value, pageIndex, pageSize));
            }));
    }

    getCustomerClassificationMapping(customerId) {
        let url = `${this.customerclassificationMapUrl}?referenceId=${customerId}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerClassificationMapping(customerId));
            }));
    }

    deleteInternationalShipViaId<T>(id, updatedBy): Observable<T> {
        return this.http.get<any>(`${this._deleteInternationalShippingViaMapUrl}?id=${id}&updatedBy=${updatedBy}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.deleteInternationalShipViaId(id, updatedBy));
            }));
    }

    restoreInternationalShipViaId<T>(id, updatedBy): Observable<T> {
        return this.http.get<any>(`${this._restoreInternationalShippingViaMapUrl}?id=${id}&updatedBy=${updatedBy}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.restoreInternationalShipViaId(id, updatedBy));
            }));
    }

    deleteShipViaDetails<T>(id, updatedBy): Observable<T> {
        return this.http.get<any>(`${this._deleteShipVia}?id=${id}&updatedBy=${updatedBy}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.deleteShipViaDetails(id, updatedBy));
            }));
    }

    restoreShipViaDetails<T>(id, updatedBy): Observable<T> {
        return this.http.get<any>(`${this._restoreShipVia}?id=${id}&updatedBy=${updatedBy}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.restoreShipViaDetails(id, updatedBy));
            }));
    }

    deleteRestrictedPartsById<T>(id, updatedBy): Observable<T> {
        return this.http.get<any>(`${this._deleteRestrictedParts}?id=${id}&updatedBy=${updatedBy}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.deleteRestrictedPartsById(id, updatedBy));
            }));
    }

    restoreRestrictedPartsById<T>(id, updatedBy): Observable<T> {
        return this.http.get<any>(`${this._restoreRestrictedParts}?id=${id}&updatedBy=${updatedBy}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.restoreRestrictedPartsById(id, updatedBy));
            }));
    }

    updateStatusForShippingDetails<T>(id, status, updatedBy): Observable<T> {
        return this.http.get<any>(`${this.ShippingDetailsStatus}?id=${id}&status=${status}&updatedBy=${updatedBy}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateStatusForShippingDetails(id, status, updatedBy));
            }));
    }

    Shippingdetailsviastatus<T>(id, status, updatedBy): Observable<T> {
        return this.http.get<any>(`${this.shippingdetailsviastatus}?id=${id}&status=${status}&updatedBy=${updatedBy}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.Shippingdetailsviastatus(id, status, updatedBy));
            }));
    }

    CustomersBillingUpdateforActive<T>(id, status, updatedBy): Observable<T> {
        return this.http.get<any>(`${this.customersBillingUpdateforActive}?id=${id}&status=${status}&updatedBy=${updatedBy}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.CustomersBillingUpdateforActive(id, status, updatedBy));
            }));
    }

    GetUploadDocumentsList(attachmentId, customerId, moduleId) {
        return this.http.get<any>(`${this._getCustomerDocumentAttachmentslist}?attachmentId=${attachmentId}&referenceId=${customerId}&moduleId=${moduleId}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.GetUploadDocumentsList(attachmentId, customerId, moduleId));
            }));
    } GetCustomerFinanceDocumentsListEndpoin

    getdeleteDocumentListbyId<T>(customerDocumentId): Observable<T> {
        return this.http.delete<any>(`${this._deleteCustomerDocuments}/${customerDocumentId}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getdeleteDocumentListbyId(customerDocumentId));
            }));
    }

    UpdateDocumentUpload<T>(file: any): Observable<T> {
        const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.put<any>(`${this._updateCustomerDocument}`, file)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.UpdateDocumentUpload(file));
            }));
    }
    deleteDocumentByCustomerAttachementId<T>(customerAttachementId, updatedBy): Observable<T> {
        return this.http.delete<any>(`${this.configurations.baseUrl}/api/common/attachmentDelete/${customerAttachementId}?updatedBy=${updatedBy}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.deleteDocumentByCustomerAttachementId(customerAttachementId, updatedBy));
            }));
    }

    restoreDocumentByAttachmentId<T>(AttachmentId, updatedBy): Observable<T> {
        return this.http.delete<any>(`${this.configurations.baseUrl}/api/common/attachmentRestore/${AttachmentId}?updatedBy=${updatedBy}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.restoreDocumentByAttachmentId(AttachmentId, updatedBy));
            }));
    }

    customerFinanceFileUploadEndpoint<T>(file: any): Observable<T> {
        const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post<any>(`${this._addCustomerFileUpload}`, file)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.customerFinanceFileUploadEndpoint(file));
            }));
    }

    GetCustomerFinanceDocumentsListEndpoint<T>(customerId, moduleId): Observable<T> {
        return this.http.get<any>(`${this._addCustomerFinanceFileDetails}/${customerId}?moduleId=${moduleId}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.GetCustomerFinanceDocumentsListEndpoint(customerId, moduleId));
            }));
    }

    GetCustomerAttachmentDeleteEndpoint<T>(attachmentDetailId, status, updatedBy): Observable<T> {
        return this.http.delete<any>(`${this._customerDeleteAttachment}/${attachmentDetailId}?updatedBy=${updatedBy}&status=${status}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.GetCustomerAttachmentDeleteEndpoint(attachmentDetailId, status, updatedBy));
            }));
    }

    getContactsByCustomerId<T>(customerId: number): Observable<T> {
        let endpointUrl = `${this._getContactsByCustomerId}?id=${customerId}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getContactsByCustomerId(customerId));
            }));
    }

    getCustomerContactGet<T>(customerId: number): Observable<T> {
        let endpointUrl = `${this._getCustomerContactGet}/${customerId}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerContactGet(customerId));
            }));
    }

    getUpdateAircraft<T>(roleObject: any, customerAircraftId: number): Observable<T> {
        let endpointUrl = `${this._customerAircraftUpdate}/${customerAircraftId}`;
        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateAircraft(roleObject, customerAircraftId));
            }));
    }
    getCustomerHistory(customerId) {
        return this.http.get(`${this.configurations.baseUrl}/${this._customerHistory}?customerId=${customerId}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerHistory(customerId));
            }));
    }

    getAircraftMappingEndpointAudit<T>(customerAircraftMappingId: number): Observable<T> {
        let endpointUrl = `${this._getAircraftMappedAudit}/${customerAircraftMappingId}`;
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAircraftMappingEndpointAudit(customerAircraftMappingId));
            }));
    }

    getCustomerShippingHistory<T>(customerId, customerShippingAddressId): Observable<T> {
        return this.http.get<any>(`${this.configurations.baseUrl}/${this._customerShippingHistory}?customerId=${customerId}&customerShippingAddressId=${customerShippingAddressId}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerShippingHistory(customerId, customerShippingAddressId));
            }));
    }
    getCustomerInterShippingHistory<T>(customerId, customerInterShippingId): Observable<T> {
        return this.http.get<any>(`${this.configurations.baseUrl}/${this._customerInterShippingHistory}?customerId=${customerId}&internationalShippingId=${customerInterShippingId}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerInterShippingHistory(customerId, customerInterShippingId));
            }));
    }

    getCustomerShipViaHistory<T>(customerId, customerShippingAddressId, customerShippingId): Observable<T> {
        return this.http.get<any>(`${this.configurations.baseUrl}/${this._customerShipViaHistory}?customerId=${customerId}&customerShippingAddressId=${customerShippingAddressId}&customerShippingId=${customerShippingId}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerShipViaHistory(customerId, customerShippingAddressId, customerShippingId));
            }));
    }
    getCustomerInterShipViaHistory<T>(customerId, internationalShippingId, shippingViaDetailsId): Observable<T> {
        return this.http.get<any>(`${this.configurations.baseUrl}/${this._customerInterShipViaHistory}?customerId=${customerId}&internationalShippingId=${internationalShippingId}&shippingViaDetailsId=${shippingViaDetailsId}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerInterShipViaHistory(customerId, internationalShippingId, shippingViaDetailsId));
            }));
    }
    getCustomerDocumentAuditHistory<T>(id, customerId): Observable<T> {
        return this.http.get<any>(`${this._getCustomerDocumentHistory}?id=${id}&customerId=${customerId}`, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerDocumentAuditHistory(id, customerId));
            }));
    }

    CustomerBillingFileUpload<T>(file, customerId): Observable<T> {
        return this.http.post<any>(`${this.configurations.baseUrl}${this.excelUpload}?customerId=${customerId}`, file)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.CustomerBillingFileUpload(file, customerId));
            }));
    }

    CustomerShippingFileUpload<T>(file, customerId): Observable<T> {
        return this.http.post<any>(`${this.configurations.baseUrl}${this.excelUploadShipping}?customerId=${customerId}`, file)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.CustomerShippingFileUpload(file, customerId));
            }));
    }

    CustomerInternationalShippingFileUpload<T>(file, customerId): Observable<T> {
        return this.http.post<any>(`${this.configurations.baseUrl}${this.excelUploadInterShipping}?customerId=${customerId}`, file)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.CustomerInternationalShippingFileUpload(file, customerId));
            }));
    }

    CustomerContactFileUpload<T>(file, customerId, MasterCompanyId): Observable<T> {
        return this.http.post<any>(`${this.configurations.baseUrl}${this.excelUploadContact}?customerId=${customerId}&masterCompanyId=${MasterCompanyId}`, file)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.CustomerContactFileUpload(file, customerId, MasterCompanyId));
            }));
    }

    getInternationalShipViaByInternationalShippingId<T>(id, isDeleted): Observable<T> {
        return this.http.get<any>(`${this.InternatioanlShipViaByInternationalShippingId}?internationalShippingId=${id}&isDeleted=${isDeleted}`)
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getInternationalShipViaByInternationalShippingId(id, isDeleted));
            }));
    }

    getCustomerContactATAAuditDetails<T>(customerContactATAMappingId: any): Observable<T> {
        let url = `${this.customerContacATAHistory}/${customerContactATAMappingId}`;
        return this.http.get<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerContactATAAuditDetails(customerContactATAMappingId));
            }));
    }

    updateCustomerContactATAMApped<T>(data): Observable<T> {
        const url = `${this.configurations.baseUrl}/api/Customer/customercontactataupdate/${data.customerContactATAMappingId}`
        return this.http.put<any>(url, JSON.stringify(data), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateCustomerContactATAMApped(data));
            }));
    }

    restoreCustomerRecord<T>(id, name): Observable<T> {
        const url = `${this.configurations.baseUrl}/api/Customer/RestoreCustomer/${id}?updatedBy=${name}`
        return this.http.put<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.restoreCustomerRecord(id, name));
            }));
    }
    restoreCustomerDocumentRecord<T>(attachmentDetailId, name): Observable<T> {
        const url = `${this.configurations.baseUrl}/api/Customer/RestoreCustomerDocument/${attachmentDetailId}?updatedBy=${name}`
        return this.http.put<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.restoreCustomerDocumentRecord(attachmentDetailId, name));
            }));
    }
    deleteCustomerDocumentRecord<T>(attachmentDetailId, name): Observable<T> {
        const url = `${this.configurations.baseUrl}/api/Customer/DeleteCustomerDocument/${attachmentDetailId}?updatedBy=${name}`
        return this.http.put<any>(url, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.deleteCustomerDocumentRecord(attachmentDetailId, name));
            }));
    }
}