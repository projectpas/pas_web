import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigurationService } from './configuration.service';
import { EndpointFactory } from './endpoint-factory.service';

@Injectable()


// module Types : 
// Customer : 1
// Vendor : 2 
// Company or Legacy : 3 

export class CommonService  {
    baseUrl = this.configurations.baseUrl
    constructor(private http: HttpClient, private configurations: ConfigurationService, private authService: EndpointFactory) { }

    smartDropDownList(tableName, primaryKeyColumn, labelColumn, parentName?, parentId?, count?) {

        return this.http.get<any>(`${this.baseUrl}/api/Common/binddropdowns?tableName=${tableName}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&count=${count !== undefined ? count : 0}&textColumn1=${parentName != undefined ? parentName : ''}&textColumn2=${parentId != undefined ? parentId : ''}`, this.authService.getRequestHeaders())

    }
    smartDropDownUpdateList() {

        return this.http.get<any>(`${this.baseUrl}/api/single-screen?entityName=vw_ledger`, this.authService.getRequestHeaders())

    }
    smartDropDownGetNamaWithCode(tableName, primaryKeyColumn, labelColumn, parentName?, parentId?, count?) {

        return this.http.get<any>(`${this.baseUrl}/api/Common/binddropdowns?tableName=${tableName}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&count=${count !== undefined ? count : 0}&textColumn1=Code&textColumn2=${parentId != undefined ? parentId : ''}`, this.authService.getRequestHeaders())

    }
    // smart call for name with code 


    smartDropDownWithStatusList(tableName, primaryKeyColumn, labelColumn, count?, isActive?, isDeleted?) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/binddropdownsbasedonstatus?tableName=${tableName}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&count=${count !== undefined ? count : 0}&textColumn1=IsActive&textColumn2=${isActive != undefined ? isActive : ''}&textColumn3=IsDeleted&textColumn4=${isDeleted != undefined ? isDeleted : ''}`, this.authService.getRequestHeaders())
    }

    autoSuggestionSmartDropDownList(tableName, primaryKeyColumn, labelColumn, searchText, startWith, count?, idList?) {
        //?tableName=Customer&primaryColumn=CustomerId&textColumn=Name&searchText=Av&startWith=false&count=0
        return this.http.get<any>(`${this.baseUrl}/api/Common/bindautocompletedropdowns?tableName=${tableName}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&searchText=${searchText}&startWith=${startWith}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}`, this.authService.getRequestHeaders())
    }
    //autoSuggestionSmartDropDownList        (tableName, primaryKeyColumn, labelColumn, searchText, startWith, count?, idList?)
    autoSuggestionSmartDropDownListWtihColumn(tableName, primaryKeyColumn, labelColumn,searchValue?,secondarycolumn?, secondarytextcolumn?,count?, idList? ) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/bindautocompletedropdownsbasedoncolumn?tableName=${tableName}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&searchText=${searchValue}&startWith=true&secondarycolumn=${secondarycolumn}&secondarytextcolumn=${secondarytextcolumn}&count=${count !== undefined ? count : 0}&idList=${idList}`, this.authService.getRequestHeaders())
  }

    autoSuggestionSmartDropDownContactList(textColumn, searchText, startWith, idList?) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/autoCompleteSmartDropDownContactList?textColumn=${textColumn}&searchText=${searchText}&startWith=${startWith}&idList=${idList !== undefined ? idList : '0'}`, this.authService.getRequestHeaders())
    }

    autoCompleteSmartDropDownEmployeeList(textColumn, searchText, startWith, idList?) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/autoCompleteSmartDropDownEmployeeList?textColumn=${textColumn}&searchText=${searchText}&startWith=${startWith}&idList=${idList !== undefined ? idList : '0'}`, this.authService.getRequestHeaders())
    }

    
    
    autoCompleteDropdownsEmployeeByMS(searchText, startWith, count?,idList?,managementStructureId?) {

        return this.http.get<any>(`${this.baseUrl}/api/Common/autoCompleteDropdownsEmployeeByMS?searchText=${searchText}&startWith=${startWith}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&managementStructureId=${managementStructureId !== undefined ? managementStructureId : 0}`, this.authService.getRequestHeaders())
    }
    createShipVia(object) {
        return this.http.post<any>(`${this.baseUrl}/api/Common/createshipvia`, JSON.stringify(object), this.authService.getRequestHeaders())
    }

    createAllAddres(object) {
        return this.http.post<any>(`${this.baseUrl}/api/Common/createAllAddres`, JSON.stringify(object), this.authService.getRequestHeaders())
    }



    getShipViaDetailsByModule(moduleId, referenceId) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/bindshipviadetails?userType=${moduleId}&referenceId=${referenceId}`, this.authService.getRequestHeaders())
    }
    getShipViaDetailsById(shipViaId, userType) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/shippingviadetails?shippingViaId=${shipViaId}&userType=${userType}`, this.authService.getRequestHeaders())

    }
    createAddress(object) {
        return this.http.post(`${this.baseUrl}/api/Common/createaddress`, JSON.stringify(object), this.authService.getRequestHeaders())
    }
    smartExcelFileUpload(file) {
        return this.http.post(`${this.baseUrl}/api/FileUpload/uploadcustomFile`, file)
        //this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)
    }
    getManagementStructureDetails(id) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/managementstructure?manmgStrucId=${id}`, this.authService.getRequestHeaders())
    }

    getManagementStructurelevelWithEmployee(parentId,employeeID?,editparentId?) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/managementStructurelevelWithEmployee?parentId=${parentId}&employeeID=${employeeID !== undefined ? employeeID : 0}&editparentId=${editparentId !== undefined ? editparentId : 0}`, this.authService.getRequestHeaders())
    }

    

    getManagmentStrctureData(id,employeeID?,editMSID?) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/getManagmentStrctureData?managementStructureId=${id}&employeeID=${employeeID !== undefined ? employeeID : 0}&editManagementStructureId=${editMSID !== undefined ? editMSID : 0}`, this.authService.getRequestHeaders())
    }

    getManagementStructureNameandCodes(id) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/GetManagementStructureNameandCodes?manmgStrucId=${id}`, this.authService.getRequestHeaders())
    }


    getManagementStructureCodes(id) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/managementstructurecodes?manmgStrucId=${id}`, this.authService.getRequestHeaders())
    }


    getManagementStructureNamesAndCodes(id) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/managementstructuredata?manmgStrucId=${id}`, this.authService.getRequestHeaders())
    }

    getCustomerNameandCode(value, customerType) {
        return this.http.get(`${this.baseUrl}/api/customer/customernameandcodes?value=${value}&customerType=${customerType}`, this.authService.getRequestHeaders())
    }

    getCustomerNameandCodeById(customerId) {
        return this.http.get(`${this.baseUrl}/api/Customer/customernameandcodesbyId?customerId=${customerId}`, this.authService.getRequestHeaders())
    }

    getReceiveCustomerPartDetailsById(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/ReceivingCustomerWork/receivecustomerpartdetails?itemMasterId=${id}`)
    }

    getItemMasterDetails() {
        return this.http.get(`${this.baseUrl}/api/itemMaster/GetPartDetailsDropDown`, this.authService.getRequestHeaders())
    }

    getRestrictedParts(moduleId, referenceId, partType) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/getrestrictedparts?moduleId=${moduleId}&referenceId=${referenceId}&partType=${partType}`)
    }

    getDefaultCurrency(id) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/defaultcurrency?legalEntityId=${id}`, this.authService.getRequestHeaders())
    }

    getClassificationMapping(id, moduleId) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/classificationmappings?referenceId=${id}&moduleId=${moduleId}`, this.authService.getRequestHeaders())
    }

    getIntegrationMapping(id, moduleId) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/integrationmappings?referenceId=${id}&moduleId=${moduleId}`, this.authService.getRequestHeaders())
    }

    getLegalEntityList() {
        return this.http.get<any>(`${this.baseUrl}/api/common/levelonedata`, this.authService.getRequestHeaders());
    }
    getBusinessUnitListByLegalEntityId(legalEntityId) {
        return this.http.get<any>(`${this.baseUrl}/api/common/leveltwodata?parentId=${legalEntityId}`, this.authService.getRequestHeaders());
    }
    getDivisionListByBU(businessUnitId) {
        return this.http.get<any>(`${this.baseUrl}/api/common/levelthreedata?parentId=${businessUnitId}`, this.authService.getRequestHeaders());
    }
    getDepartmentListByDivisionId(divisionId) {
        return this.http.get<any>(`${this.baseUrl}/api/common/levelfourdata?parentId=${divisionId}`, this.authService.getRequestHeaders());
    }

    getRestrictedPartsWithDesc(moduleId, referenceId, partType, isDeleted) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/getrestrictedpartswithdesc?moduleId=${moduleId}&referenceId=${referenceId}&partType=${partType}&isDeleted=${isDeleted}`)
    }

    GetDocumentsList(referenceId, moduleId,isDeleted?) {
        return this.http.get<any>(`${this.baseUrl}/api/FileUpload/getFileDocumentDetail/${referenceId}?moduleId=${moduleId}&isDeleted=${isDeleted !== undefined ? isDeleted : false}`, this.authService.getRequestHeaders())
    }
    GetDocumentsListNew(referenceId, moduleId,isDeleted?) {
        return this.http.get<any>(`${this.baseUrl}/api/FileUpload/getFileDocumentDetailNew/${referenceId}?moduleId=${moduleId}&isDeleted=${isDeleted !== undefined ? isDeleted : false}`, this.authService.getRequestHeaders())
    }
    GetDocumentsListWithType(referenceId, moduleId, typeId) {
        return this.http.get<any>(`${this.baseUrl}/api/FileUpload/getFileDocumentDetailwithType/${referenceId}?moduleId=${moduleId}&typeId=${typeId}`, this.authService.getRequestHeaders())
    }

    GetAttachmentRestoreById(attachmentDetailId, updatedBy) {
        return this.http.delete(`${this.baseUrl}/api/FileUpload/AttachmentRestore/${attachmentDetailId}?updatedBy=${updatedBy}`, this.authService.getRequestHeaders())
    }

    restoreDocumentByAttachmentId(attachmentId, updatedby) {
        return this.http.delete<any>(`${this.baseUrl}/api/common/attachmentRestore/${attachmentId}?updatedBy=${updatedby}`, this.authService.getRequestHeaders());
    }

    GetAttachmentDeleteById(attachmentDetailId, updatedBy) {
        return this.http.delete(`${this.baseUrl}/api/FileUpload/AttachmentDelete/${attachmentDetailId}?updatedBy=${updatedBy}`, this.authService.getRequestHeaders())
    }
    GetAttachmentCommonDeleteById(attachmentDetailId, updatedBy) {
        return this.http.put(`${this.baseUrl}/api/Common/deleteDocuments?Id=${attachmentDetailId}&updatedBy=${updatedBy}`, this.authService.getRequestHeaders())
    }
    updatedRestoreCommonRecords(attachmentDetailId, updatedBy) {
        return this.http.put(`${this.baseUrl}/api/Common/RestoreDocumentdetails?id=${attachmentDetailId}&updatedBy=${updatedBy}`, this.authService.getRequestHeaders())
    }

    uploadDocumentsEndpoint<T>(file: any): Observable<T> {
        const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post<T>(`${this.baseUrl}/api/FileUpload/commonDocumentUpload`, file);
    }
    uploadDocumentsCommonEndpoint<T>(file: any,arryData:any){
        // const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post(`${this.baseUrl}/api/FileUpload/CommonDocumentUploadNew`, file,arryData);
    }
    uploadDocumentsCommonEndpointUpdate<T>(file: any,arryData:any){
        // const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post(`${this.baseUrl}/api/FileUpload/CommonDocumentUploadupdate`, file,arryData);
    }
    
    // uploadVendorCapabilitiesList(file, vendorId, data) {
    //     return this.http.post(`${this.configurations.baseUrl}${this._addCapesDocumentDetails}?vendorId=${vendorId}`, file, data)

    // }
    assetDocumentsEndpoint<T>(file: any): Observable<T> {
        const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post<T>(`${this.baseUrl}/api/FileUpload/AssetDocumentUpload`, file);
    }
    uploadVendorDocumentsEndpoint<T>(file: any): Observable<T> {
        const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post<T>(`${this.baseUrl}/api/FileUpload/commonVendorDocumentUpload`, file);
    }
    uploadVendorAuditDocumentsEndpoint<T>(file: any): Observable<T> {
        const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post<T>(`${this.baseUrl}/api/FileUpload/vendorAuditDocumentUpload`, file);
    }

    toDownLoadFile(fileUrl) {
        const url = `${this.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${fileUrl}`;
        window.location.assign(url);
    }

    getReceivingCustomers(value) {
        return this.http.get(`${this.baseUrl}/api/receivingcustomerwork/getreceivingcustomerslist?value=${value}`, this.authService.getRequestHeaders());
    }

    getJobTitles(masterCompanyId?) {
        const masterCompany = masterCompanyId > 0 ? masterCompanyId : 1;
        return this.http.get<any>(`${this.baseUrl}/api/common/jobtitletypes?masterCompanyId=${masterCompany}`, this.authService.getRequestHeaders());
    }

    getCSRAndSalesPersonOrAgentList(managementStructureId) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/employeesdropdowns/${managementStructureId}`, this.authService.getRequestHeaders());
    }

    getEmployeesByCategory(value) {
        return this.http.get<any>(`${this.baseUrl}/api/common/employeesbyjobtitle?jobTitleId=${value}`, this.authService.getRequestHeaders());
    }

    getAllSalesEmployeeListByJobTitle(JobTitleIds) {
        return this.http.get<any>(`${this.baseUrl}/api/common/GetEmployeesByJobTitles?jobTitleIds=${JobTitleIds}`, this.authService.getRequestHeaders());
    }

    getExpertise() {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/common/expertisetypes?masterCompanyId=1 `, this.authService.getRequestHeaders());
    }
    getExpertiseEmployeesByCategory(value) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/common/employeesbyexpertise?expertiseId=${value}`, this.authService.getRequestHeaders());
    }

    getDocumentAttachmentList(attachmentId, referenceId, moduleId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/FileUpload/getattachmentdetails?attachmentId=${attachmentId}&referenceId=${referenceId}&moduleId=${moduleId}`, this.authService.getRequestHeaders());
    }

    getTechnicianStation(technicianId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/common/getemployeestation?employeeId=${technicianId}`, this.authService.getRequestHeaders());
    }
    getVendorContact(vendorId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/Common/vendorcontacts?vendorId=${vendorId}`, this.authService.getRequestHeaders());
    }

    //Cet charge by it's Id
    getChargeData(chargeId): Observable<any> {
        return this.http.get(`${this.configurations.baseUrl}/api/charge/GetChargeById/${chargeId}`, this.authService.getRequestHeaders());
    }

    getFunctionalReportCurrencyById(id) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/common/functionalreportingcurrencybyid?managementStructureId=${id}`, this.authService.getRequestHeaders())
    }

    workOrderDefaultSettings(companyId, actionId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workordersettings?masterCompanyId=${companyId}&workOrderTypeId=${actionId}`, this.authService.getRequestHeaders())
    }
    getEmployeeData(masterCompanyId, employeeId) {
        return this.http.get(`${this.configurations.baseUrl}/api/common/loginuserdetails?masterCompanyId=${masterCompanyId}&employeeId=${employeeId}`, this.authService.getRequestHeaders())

    }
    getManagementStructureData(masterCompanyId, mangStructureId) {
        return this.http.get(`${this.configurations.baseUrl}/api/common/employeemangstructureinfo?masterCompanyId=${masterCompanyId}&mangStructureId=${mangStructureId}`, this.authService.getRequestHeaders())

    }

    getPriceDetailsByCondId(itemMasterId, conditionId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/common/partpurchasesaledetails?itemMasterId=${itemMasterId}&condition=${conditionId}`);
    }

    //customer restriction service and warning sercices
    customerWarnings(customerId, customerWarningListId) {
        return this.http.get(`${this.configurations.baseUrl}/api/common/customerwarnings?customerId=${customerId}&customerWarningListId=${customerWarningListId}`, this.authService.getRequestHeaders())
    }
    customerResctrictions(customerId, customerWarningListId) {
        return this.http.get(`${this.configurations.baseUrl}/api/common/customerrestrictions?customerId=${customerId}&customerWarningListId=${customerWarningListId}`, this.authService.getRequestHeaders())
    }
    GetAttachment(id) {
        return this.http.get<any>(`${this.baseUrl}/api/FileUpload/getattachmentdetails/${id}`, this.authService.getRequestHeaders())
    }
    GetAttachmentAudit(id) {
        return this.http.get<any>(`${this.baseUrl}/api/FileUpload/getattachmentdetailsaudit/${id}`, this.authService.getRequestHeaders())
    }

    GetPurchaseAndSalesAuditHistory(id) {
        return this.http.get<any>(`${this.baseUrl}/api/ItemMaster/getAuditHistoryItemMasterPurchSaleByID/${id}`, this.authService.getRequestHeaders())
    }
    GetAttachmentPublicationAudit(id) {
        return this.http.get<any>(`${this.baseUrl}/api/FileUpload/getattachmentdetailspublicationaudit/${id}`, this.authService.getRequestHeaders())
    }
    getModuleListForObtainOwnerTraceable() {
        return this.http.get<any>(`${this.baseUrl}/api/Common/modulelistfordropdown`, this.authService.getRequestHeaders())

    }
    getModuleListForVendorOther() {
        return this.http.get<any>(`${this.baseUrl}/api/Common/assetcompanylistfordropdown`, this.authService.getRequestHeaders())
    }

    updatedeletedrecords(Condition, ConditionId, id) {
        return this.http.put<any>(`${this.baseUrl}/api/Common/updatedeletedrecords?tableName=${Condition}&primaryColumn=${ConditionId}&columnValue=${id}`, this.authService.getRequestHeaders())

    }
    updatedeletedrecords1(GLAccount,GLAccountId, id) {
        return this.http.put<any>(`${this.baseUrl}/api/Common/updatedeletedrecords?tableName=${GLAccount}&primaryColumn=${GLAccountId}&columnValue=${id}`, this.authService.getRequestHeaders())

    }
    updatedeletedrecords11(ItemMaster,itemMasterId, id) {
        return this.http.put<any>(`${this.baseUrl}/api/Common/updatedeletedrecords?tableName=${ItemMaster}&primaryColumn=${itemMasterId}&columnValue=${id}`, this.authService.getRequestHeaders())

    }

    getAttachmentModuleIdByName(name) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/togetattachmentmoduleid?moduleName=${name}`, this.authService.getRequestHeaders())
    }
    getGlAccountList() {
        return this.http.get<any>(`${this.baseUrl}/api/Common/getglaccountlist`, this.authService.getRequestHeaders())
    }
    smartDropDownGetObjectById(tableName, primaryColumn, description, primaryIdLabel, primaryIdValue) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/binddropdownsbyid?tableName=${tableName}&primaryColumn=${primaryColumn}&textColumn=${description}&textColumn1=${primaryIdLabel}&textColumn2=${primaryIdValue}`, this.authService.getRequestHeaders())
    }
    

    getLegalEntityIdByMangStrucId(managementStructureId) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/legalentitylistbymanagementstructure?mgmtStructId=${managementStructureId}`, this.authService.getRequestHeaders())
    }

    getWODataFilter(filterVal,count,idList?) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/Common/WODataFilter?filterVal=${filterVal}&count=${count}&idList=${idList !== undefined ? idList : '0'}`, this.authService.getRequestHeaders())
    }
    getsubWODataFilter(filterVal,count,idList?) {
		return this.http.get<any>(`${this.configurations.baseUrl}/api/Common/subWODataFilter?filterVal=${filterVal}&count=${count}&idList=${idList !== undefined ? idList : '0'}`, this.authService.getRequestHeaders())
	}
    getSODataFilter(filterVal,count,idList?) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/Common/SODataFilter?filterVal=${filterVal}&count=${count}&idList=${idList !== undefined ? idList : '0'}`, this.authService.getRequestHeaders())
    }
    getRODataFilter(filterVal,count,idList?) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/Common/RODataFilter?filterVal=${filterVal}&count=${count}&idList=${idList !== undefined ? idList : '0'}`, this.authService.getRequestHeaders())
    }
   


    getOpenWONumbers() {
        return this.http.get<any>(`${this.baseUrl}/api/Common/openwonumbers`, this.authService.getRequestHeaders())
    }
    getOpenRONumbers() {
        return this.http.get<any>(`${this.baseUrl}/api/Common/openronumbers`, this.authService.getRequestHeaders())
    }
    getOpenSONumbers() {
        return this.http.get<any>(`${this.baseUrl}/api/Common/opensonumbers`, this.authService.getRequestHeaders())
    }
    getOpenPONumbers() {
        return this.http.get<any>(`${this.baseUrl}/api/Common/openponumbers`, this.authService.getRequestHeaders())
    }
    getCertifiedEmpList(managementStructureId) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/certified-employeelist/${managementStructureId}`, this.authService.getRequestHeaders())
    }
    getStockpartnumbersAutoComplete(value, all, count) {
        return this.http.get<any>(`${this.baseUrl}/api/common/stockpartnumbersautocomplete?searchValue=${value}&all=${all}&count=${count}`, this.authService.getRequestHeaders())
    }
    // for site based on the managementstructureId
    getSitesbymanagementstructrue(managementStructureId) {
        return this.http.get<any>(`${this.baseUrl}/api/workOrder/sitesbymanagementstructrue?managementStructureId=${managementStructureId}`, this.authService.getRequestHeaders())
    }
    getSitesbymanagementstructrueNew(managementStructureId) {
        return this.http.get<any>(`${this.baseUrl}/api/common/sitesdropdownbymanagementstructure?managementStructureId=${managementStructureId}&all=true `, this.authService.getRequestHeaders())
    }
    getWareHouseDateNew(siteId) {
        return this.http.get<any>(`${this.baseUrl}/api/common/getwarehousebysiteId?siteId=${siteId}&all=true `, this.authService.getRequestHeaders())
    }
    getLocationDateNew(id) {
        return this.http.get<any>(`${this.baseUrl}/api/common/getlocationbywarehouseid?wareHouseId=${id}&all=true `, this.authService.getRequestHeaders())
    }
    getShelfDateNew(id) {
        return this.http.get<any>(`${this.baseUrl}/api/common/getshelfbylocationid?locationId=${id}&all=true `, this.authService.getRequestHeaders())
    }
    getBinDataByIdNew(id) {
        return this.http.get<any>(`${this.baseUrl}/api/common/getbinbyshelfid?shelfId=${id}&all=true `, this.authService.getRequestHeaders())
    }
    getSalesQuoteHeaderMarginDetails(id) {
        return this.http.get<any>(`${this.baseUrl}/api/SalesQuote/togetquoteheadermargindetails/${id}`, this.authService.getRequestHeaders())

    }
    // common call for part numbers list
    getPartNumData(customerId) {
        return this.http.get<any>(`${this.baseUrl}/api/Common/partnumbersbycustomer?customerId=${customerId}`, this.authService.getRequestHeaders())
    }
// common api for customer names dropdown


getcustomerList(value) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/bindautocompletedropdowns?tableName=Customer&primaryColumn=CustomerId&textColumn=Name&searchText=${value}&startWith=false&count=20`, this.authService.getRequestHeaders())
}

customergenericinformation(customerId){
    return this.http.get<any>(`${this.baseUrl}/api/Common/customergenericinformation?customerId=${customerId}`, this.authService.getRequestHeaders())
}


vendorWarnings(id, warningListId) {
    return this.http.get(`${this.configurations.baseUrl}/api/common/vendorwarnings?vendorId=${id}&vendorWarningListId=${warningListId}`, this.authService.getRequestHeaders())
}
vendorResctrictions(id, warningListId) {
    return this.http.get(`${this.configurations.baseUrl}/api/common/vendorrestrictions?vendorId=${id}&vendorWarningListId=${warningListId}`, this.authService.getRequestHeaders())
}

vendorWarningsAndRestrction(id, warningListId) {
    return this.http.get(`${this.configurations.baseUrl}/api/common/VendorWarningsAndRestrction?vendorId=${id}&vendorWarningListId=${warningListId}`, this.authService.getRequestHeaders())    
}



getPartnumList(value){
    return this.http.get<any>(`${this.baseUrl}/api/common/stockpartnumbersautocomplete?searchValue=${value}&all=false&count=20`, this.authService.getRequestHeaders())
}

getCustomerContactsById(id) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/common/getcustomercontacts?customerId=${id}&all=true`)
    // return this.http.get<any>(`${this.configurations.baseUrl}/api/common/customercontacts?customerId=${id}`)  // old call
}
getEmployeesbylegalentity(legalEntityId){
    return this.http.get<any>(`${this.baseUrl}/api/common/employeesbylegalentity?legalEntityId=${legalEntityId}`, this.authService.getRequestHeaders())
}

employeesByLegalEntityandMS(legalEntityId){
    return this.http.get<any>(`${this.baseUrl}/api/common/employeesByLegalEntityandMS?legalEntityId=${legalEntityId}`, this.authService.getRequestHeaders())
}


getEmployeeDetailsbylegalentity(managementStructureId){
    return this.http.get<any>(`${this.baseUrl}/api/common/legalentitydetailsbymanagementid?managementStructureId=${managementStructureId}`, this.authService.getRequestHeaders())
}
getCustomerShipAddressGet(customerId){
    return this.http.get<any>(`${this.baseUrl}/api/common/legalentitydetailsbymanagementid?managementStructureId=${customerId}`, this.authService.getRequestHeaders())
}
getModuleListByUserType(addresstype) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getModuleListByUserType?addresstype=${addresstype}`, this.authService.getRequestHeaders())
}
autoSuggestionSmartuserDropDownList(usertypeid, searchText, startWith, count?,idList?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getuserlistbymodule?usertypeid=${usertypeid}&StrFilter=${searchText}&startWith=${startWith}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}`, this.authService.getRequestHeaders())
}
getaddressdetailsbyuser(ModuleId, UserId, AddressType, purchaseOrderID?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getaddressdetailsbyuser?ModuleId=${ModuleId}&UserId=${UserId}&AddressType=${AddressType}&purchaseOrderID=${purchaseOrderID !== undefined ? purchaseOrderID : 0}`, this.authService.getRequestHeaders())
}

getaddressdetailsOnlyUserbyuser(ModuleId, UserId, AddressType, purchaseOrderID?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getaddressdetailsOnlyUserbyuser?ModuleId=${ModuleId}&UserId=${UserId}&AddressType=${AddressType}&purchaseOrderID=${purchaseOrderID !== undefined ? purchaseOrderID : 0}`, this.authService.getRequestHeaders())
}

getPOAddressById(purchaseOrderId) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getaddressdetailsbyid?Id=${purchaseOrderId}`, this.authService.getRequestHeaders())
  }
  GetDocumentsListNewAsset(referenceId, moduleId,isDeleted) {
    return this.http.get<any>(`${this.baseUrl}/api/FileUpload/getFileDocumentDetailNew/${referenceId}?moduleId=${moduleId}&isdeleted=${isDeleted}`, this.authService.getRequestHeaders())
}
GetDocumentsCommonList(referenceId, moduleId,isDeleted) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getDocumentDetail?moduleId=${moduleId}&referenceId=${referenceId}&isdeleted=${isDeleted}`, this.authService.getRequestHeaders())
}
GetAttachmentCommonAudit(id,referenceId, moduleId) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getDocumentsAudit?Id=${id}&referenceId=${referenceId}&moduleId=${moduleId}`, this.authService.getRequestHeaders())
}
getAssetListBasedOnType(tableName, primaryKeyColumn, labelColumn,searchValue?,secondarycolumn?, secondarytextcolumn?,count?, idList? ) {

    return this.http.get<any>(`${this.baseUrl}/api/Common/bindautocompletedropdownsbasedoncolumn?tableName=${tableName}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&searchText=${searchValue}&startWith=true&secondarycolumn=${secondarycolumn}&secondarytextcolumn=${secondarytextcolumn}&count=${count !== undefined ? count : 0}&idList=${idList}`, this.authService.getRequestHeaders())

}

getAutoCompleteDropDownsByTwoTables(tableName1, tableName2,primaryKeyColumn, labelColumn,searchValue?,count?, idList?){
    return this.http.get<any>(`${this.baseUrl}/api/Common/Bindautocompletedropdownsbasedontwotables?tableName1=${tableName1}&tableName2=${tableName2}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&searchText=${searchValue}&startWith=true&count=${count !== undefined ? count : 0}&idList=${idList}`, this.authService.getRequestHeaders())  
}
getAutoCompleteDropDownsByCodeWithName(tableName1,primaryKeyColumn,labelColumn,secondarycolumn?,searchValue?,count?, idList?){
    return this.http.get<any>(`${this.baseUrl}/api/Common/Bindautocompletedropdownsbasedontwocolumns?tableName1=${tableName1}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&searchText=${searchValue}&startWith=true&secondarycolumn=${secondarycolumn}&count=${count !== undefined ? count : 0}&idList=${idList}`, this.authService.getRequestHeaders())  
}
// http://localhost:5230/api/Common/Bindautocompletedropdownsbasedontwocolumns?tableName1=GLAccount&primaryColumn=GLAccountId&textColumn=AccountName&searchText=&startWith=true&secondaryColumn=AccountCode&count=20&idList=0



// http://localhost:5230/api/Common/Bindautocompletedropdownsbasedontwotables?tableName1=AssetIntangibleAttributeType&tableName2=AssetIntangibleType&primaryColumn=AssetIntangibleTypeId&textColumn=AssetIntangibleName&searchText=&startWith=true&count=20&idList=0
// 





// localhost:5230/api/Common/Bindautocompletedropdownsbasedontwocolumns?tableName1=AssetLocation&primaryColumn=AssetLocationId&textColumn=Name&searchText=&startWith=true&secondaryColumn=Code&count=20&idList=0
}

