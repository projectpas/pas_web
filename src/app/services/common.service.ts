import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ConfigurationService } from './configuration.service';
import { EndpointFactory } from './endpoint-factory.service';
import { environment } from 'src/environments/environment';
import { masterCompanyId } from '../common-masterData/mastercompany-details';

@Injectable()
// module Types : 
// Customer : 1
// Vendor : 2 
// Company or Legacy : 3 

export class CommonService extends EndpointFactory {
  baseUrl = environment.baseUrl; //this.configurations.baseUrl
  constructor(http: HttpClient, injector: Injector, configurations: ConfigurationService) {
    super(http, configurations, injector);
  }

  smartDropDownList(tableName, primaryKeyColumn, labelColumn, parentName?, parentId?, count?,masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/binddropdowns?tableName=${tableName}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&count=${count !== undefined ? count : 0}&textColumn1=${parentName != undefined ? parentName : ''}&textColumn2=${parentId != undefined ? parentId : ''}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.smartDropDownList(tableName, primaryKeyColumn, labelColumn, parentName, parentId, count,masterCompanyId));
    });
  }

  smartDropDownUpdateList() {
    return this.http.get<any>(`${this.baseUrl}/api/single-screen?entityName=vw_ledger`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.smartDropDownUpdateList());
    });
  }

  smartDropDownGetNamaWithCode(tableName, primaryKeyColumn, labelColumn, parentName?, parentId?, count?,masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/binddropdowns?tableName=${tableName}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&count=${count !== undefined ? count : 0}&textColumn1=Code&textColumn2=${parentId != undefined ? parentId : ''}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.smartDropDownGetNamaWithCode(tableName, primaryKeyColumn, labelColumn, parentName, parentId, count,masterCompanyId));
    });
  }
  // smart call for name with code 

  smartDropDownWithStatusList(tableName, primaryKeyColumn, labelColumn, count?, isActive?, isDeleted?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/binddropdownsbasedonstatus?tableName=${tableName}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&count=${count !== undefined ? count : 0}&textColumn1=IsActive&textColumn2=${isActive != undefined ? isActive : ''}&textColumn3=IsDeleted&textColumn4=${isDeleted != undefined ? isDeleted : ''}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.smartDropDownWithStatusList(tableName, primaryKeyColumn, labelColumn, count, isActive, isDeleted));
    });
  }

  autoSuggestionSmartDropDownList(tableName, primaryKeyColumn, labelColumn, searchText, startWith, count?, idList?, masterCompanyId?) {
    //?tableName=Customer&primaryColumn=CustomerId&textColumn=Name&searchText=Av&startWith=false&count=0
    return this.http.get<any>(`${this.baseUrl}/api/Common/bindautocompletedropdowns?tableName=${tableName}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&searchText=${searchText}&startWith=${startWith}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoSuggestionSmartDropDownList(tableName, primaryKeyColumn, labelColumn, searchText, startWith, count, idList, masterCompanyId));
    });
  }

  //autoSuggestionSmartDropDownList        (tableName, primaryKeyColumn, labelColumn, searchText, startWith, count?, idList?)
  autoSuggestionSmartDropDownListWtihColumn(tableName, primaryKeyColumn, labelColumn, searchValue?, secondarycolumn?, secondarytextcolumn?, count?, idList?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/bindautocompletedropdownsbasedoncolumn?tableName=${tableName}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&searchText=${searchValue}&startWith=true&secondarycolumn=${secondarycolumn}&secondarytextcolumn=${secondarytextcolumn}&count=${count !== undefined ? count : 0}&idList=${idList}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoSuggestionSmartDropDownListWtihColumn(tableName, primaryKeyColumn, labelColumn, searchValue, secondarycolumn, secondarytextcolumn, count, idList));
    });
  }

  autoSuggestionSmartDropDownContactList(textColumn, searchText, startWith, idList?,masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/autoCompleteSmartDropDownContactList?textColumn=${textColumn}&searchText=${searchText}&startWith=${startWith}&idList=${idList !== undefined ? idList : '0'}&masterCompanyId=${masterCompanyId !== undefined ? masterCompanyId : 1} `, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoSuggestionSmartDropDownContactList(textColumn, searchText, startWith, idList,masterCompanyId));
    });
  }

  autoSuggestionSmartDropDownSelfContactList(textColumn, searchText, startWith, idList?,masterCompanyId?,customerId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/autoCompleteSmartDropDownSelfContactList?textColumn=${textColumn}&searchText=${searchText}&startWith=${startWith}&idList=${idList !== undefined ? idList : '0'}&masterCompanyId=${masterCompanyId !== undefined ? masterCompanyId : 1}&customerId=${customerId !== undefined ? customerId : 0} `, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoSuggestionSmartDropDownSelfContactList(textColumn, searchText, startWith, idList,masterCompanyId,customerId));
    });
  }

  autoSuggestionSmartDropDownSelfLEContactList(textColumn, searchText, startWith, idList?,masterCompanyId?,legalentityId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/autoCompleteSmartDropDownSelfLEContactList?textColumn=${textColumn}&searchText=${searchText}&startWith=${startWith}&idList=${idList !== undefined ? idList : '0'}&masterCompanyId=${masterCompanyId !== undefined ? masterCompanyId : 1}&legalentityId=${legalentityId !== undefined ? legalentityId : 0} `, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoSuggestionSmartDropDownSelfLEContactList(textColumn, searchText, startWith, idList,masterCompanyId,legalentityId));
    });
  }

  autoSuggestionSmartDropDownVendorContactList(textColumn, searchText, startWith, idList?,masterCompanyId?,vendorId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/AutoCompleteSmartDropDownVendorContactList?textColumn=${textColumn}&searchText=${searchText}&startWith=${startWith}&idList=${idList !== undefined ? idList : '0'}&masterCompanyId=${masterCompanyId !== undefined ? masterCompanyId : 1}&vendorId=${vendorId !== undefined ? vendorId : 0} `, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoSuggestionSmartDropDownVendorContactList(textColumn, searchText, startWith, idList,masterCompanyId,vendorId));
    });
  }

  autoSuggestionSmartDropDownVendorCheckPaymentList(textColumn, searchText, startWith, idList?,masterCompanyId?,vendorId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/AutoCompleteSmartDropDownVendorCheckPaymentList?textColumn=${textColumn}&searchText=${searchText}&startWith=${startWith}&idList=${idList !== undefined ? idList : '0'}&masterCompanyId=${masterCompanyId !== undefined ? masterCompanyId : 1}&vendorId=${vendorId !== undefined ? vendorId : 0} `, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoSuggestionSmartDropDownVendorCheckPaymentList(textColumn, searchText, startWith, idList,masterCompanyId,vendorId));
    });
  }


  autoCompleteSmartDropDownEmployeeList(textColumn, searchText, startWith, idList?, masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/autoCompleteSmartDropDownEmployeeList?textColumn=${textColumn}&searchText=${searchText}&startWith=${startWith}&idList=${idList !== undefined ? idList : '0'} &masterCompanyId=${masterCompanyId !== undefined ? masterCompanyId : 1}  `, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoCompleteSmartDropDownEmployeeList(textColumn, searchText, startWith, idList, masterCompanyId));
    });
  }

  autoCompleteSmartDropDownItemMasterList(searchText, startWith, count?, idList?, masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/AutoCompleteSmartDropDownItemMasterList?searchText=${searchText}&startWith=${startWith}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoCompleteSmartDropDownItemMasterList(searchText, startWith, count, idList, masterCompanyId));
    });
  }

  AutoCompleteDropdownsMaterialsItemMasterList(searchText, startWith, count?, idList?, masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/AutoCompleteDropdownsMaterialsItemMasterList?searchText=${searchText}&startWith=${startWith}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.AutoCompleteDropdownsMaterialsItemMasterList(searchText, startWith, count, idList, masterCompanyId));
    });
  }
  
  autoCompleteDropdownsItemMasterWithStockLine(searchText, startWith, count?, idList?, masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/AutoCompleteDropdownsItemMasterWithStockLine?searchText=${searchText}&startWith=${startWith}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoCompleteDropdownsItemMasterWithStockLine(searchText, startWith, count, idList, masterCompanyId));
    });
  }
  autoCompleteDropdownsWorkorderList(searchText, count?, idList?, masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/AutoCompleteDropdownsWorkorderList?searchText=${searchText}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoCompleteDropdownsWorkorderList(searchText, count, idList, masterCompanyId));
    });
  }
  AutoCompleteDropdownsPOByItemMaster(searchText,itemmasterid, count?, idList?, masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/AutoCompleteDropdownsPOByItemMaster?searchText=${searchText}&ItemMasterId=${itemmasterid !== undefined ? itemmasterid : 0}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoCompleteDropdownsWorkorderList(searchText, count, idList, masterCompanyId));
    });
  }
  AutoCompleteDropdownsROByItemMaster(searchText,itemmasterid, count?, idList?, masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/AutoCompleteDropdownsROByItemMaster?searchText=${searchText}&ItemMasterId=${itemmasterid !== undefined ? itemmasterid : 0}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoCompleteDropdownsWorkorderList(searchText, count, idList, masterCompanyId));
    });
  }


  autoCompleteSmartDropDownCustomerList(customerType, searchText, startWith, count?, idList?, masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/AutoCompleteSmartDropDownCustomerList?customerType=${customerType}&searchText=${searchText}&startWith=${startWith}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoCompleteSmartDropDownCustomerList(searchText, startWith, count, idList, masterCompanyId));
    });
  }

  autoCompleteSmartDropDownAssetList(searchText, startWith, count?, idList?,masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/AutoCompleteSmartDropDownAssetList?searchText=${searchText}&startWith=${startWith}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoCompleteSmartDropDownAssetList(searchText, startWith, count, idList,masterCompanyId));
    });
  }

  autoCompleteDropdownsCertifyEmployeeByMS(searchText, startWith, count?, idList?, managementStructureId?, masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/autoCompleteDropdownsCertifyEmployeeByMS?searchText=${searchText}&startWith=${startWith}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&managementStructureId=${managementStructureId !== undefined ? managementStructureId : 0}&masterCompanyId=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoCompleteDropdownsCertifyEmployeeByMS(searchText, startWith, count, idList, managementStructureId));
    });
  }
  autoCompleteDropdownsEmployeeByJobTitle(searchText, jobTitleId, count?, idList?, managementStructureId?, masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/autoCompleteDropdownsEmployeeByJobTitle?searchText=${searchText}&jobTitleId=${jobTitleId}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&managementStructureId=${managementStructureId !== undefined ? managementStructureId : 0}&masterCompanyId=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoCompleteDropdownsEmployeeByJobTitle(searchText, jobTitleId, count, idList, managementStructureId,masterCompanyId));
    });
  }
  autoCompleteDropdownsEmployeeByExpertise(searchText, employeeExpertiseId, count?, idList?, managementStructureId?, masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/autoCompleteDropdownsEmployeeByExpertise?searchText=${searchText}&employeeExpertiseId=${employeeExpertiseId}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&managementStructureId=${managementStructureId !== undefined ? managementStructureId : 0}&masterCompanyId=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoCompleteDropdownsEmployeeByExpertise(searchText, employeeExpertiseId, count, idList, managementStructureId,masterCompanyId));
    });
  }
  autoCompleteDropdownsEmployeeByMS(searchText, startWith, count?, idList?, managementStructureId?, masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/autoCompleteDropdownsEmployeeByMS?searchText=${searchText}&startWith=${startWith}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&managementStructureId=${managementStructureId !== undefined ? managementStructureId : 0}&masterCompanyId=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoCompleteDropdownsEmployeeByMS(searchText, startWith, count, idList, managementStructureId));
    });
  }

  autoCompleteDropdownsExpertiseTypes(searchText, startWith, count?, idList?, managementStructureId?, masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/autoCompleteDropdownsExpertiseTypes?searchText=${searchText}&startWith=${startWith}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&masterCompanyId=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoCompleteDropdownsExpertiseTypes(searchText, startWith, count, idList, managementStructureId,masterCompanyId));
    });
  }

  createShipVia(object) {
    return this.http.post<any>(`${this.baseUrl}/api/Common/createshipvia`, JSON.stringify(object), this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.createShipVia(object));
    });
  }

  createAllAddres(object) {
    return this.http.post<any>(`${this.baseUrl}/api/Common/createAllAddres`, JSON.stringify(object), this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.createAllAddres(object));
    });
  }

  getShipViaDetailsByModule(moduleId, referenceId,masterCompanyId) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/bindshipviadetails?userType=${moduleId}&referenceId=${referenceId}&masterCompanyId=${masterCompanyId !=undefined ?  masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getShipViaDetailsByModule(moduleId, referenceId,masterCompanyId));
    });
  }
  
  getShipViaDetailsByModuleActiveInactive(moduleId, referenceId, idList) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/bindshipviadetailswithInActive?userType=${moduleId}&referenceId=${referenceId}&idlist=${idList !== undefined ? idList : '0'}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getShipViaDetailsByModuleActiveInactive(moduleId, referenceId, idList));
    });
  }

  getShipViaDetailsById(shipViaId, userType,masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/shippingviadetails?shippingViaId=${shipViaId}&userType=${userType}&masterCompanyId=${masterCompanyId !=undefined ?  masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getShipViaDetailsById(shipViaId, userType,masterCompanyId));
    });
  }

  createAddress(object) {
    return this.http.post(`${this.baseUrl}/api/Common/createaddress`, JSON.stringify(object), this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.createAddress(object));
    });
  }

  smartExcelFileUpload(file) {
    return this.http.post(`${this.baseUrl}/api/FileUpload/uploadcustomFile`, file, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.smartExcelFileUpload(file));
    });
    //this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)
  }

  getManagementStructureDetails(id) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/managementstructure?manmgStrucId=${id}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getManagementStructureDetails(id));
    });
  }

  getManagementStructurelevelWithEmployee(parentId, employeeID?, editparentId?, masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/managementStructurelevelWithEmployee?parentId=${parentId}&employeeID=${employeeID !== undefined ? employeeID : 0}&editparentId=${editparentId !== undefined ? editparentId : 0}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getManagementStructurelevelWithEmployee(parentId, employeeID, editparentId));
    });
  }

  getManagmentStrctureData(id, employeeID?, editMSID?, masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getManagmentStrctureData?managementStructureId=${id}&employeeID=${employeeID !== undefined ? employeeID : 0}&editManagementStructureId=${editMSID !== undefined ? editMSID : 0}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getManagmentStrctureData(id, employeeID, editMSID));
    });
  }

  getManagementStructureNameandCodes(id) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/GetManagementStructureNameandCodes?manmgStrucId=${id}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getManagementStructureNameandCodes(id));
    });
  }

  getManagementStructureCodes(id) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/managementstructurecodes?manmgStrucId=${id}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getManagementStructureCodes(id));
    });
  }

  getManagementStructureNamesAndCodes(id) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/managementstructuredata?manmgStrucId=${id}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getManagementStructureNamesAndCodes(id));
    });
  }

  getCustomerNameandCode(value, customerType,masterCompanyId?) {
    return this.http.get(`${this.baseUrl}/api/customer/customernameandcodes?value=${value}&customerType=${customerType}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId :1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getCustomerNameandCode(value, customerType,masterCompanyId));
    });
  }

  getCustomerNameandCodeById(customerId) {
    return this.http.get(`${this.baseUrl}/api/Customer/customernameandcodesbyId?customerId=${customerId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getCustomerNameandCodeById(customerId));
    });
  }

  getReceiveCustomerPartDetailsById(id) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/ReceivingCustomerWork/receivecustomerpartdetails?itemMasterId=${id}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getReceiveCustomerPartDetailsById(id));
    });
  }

  getItemMasterDetails() {
    return this.http.get(`${this.baseUrl}/api/itemMaster/GetPartDetailsDropDown`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getItemMasterDetails());
    });
  }

  getRestrictedParts(moduleId, referenceId, partType) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getrestrictedparts?moduleId=${moduleId}&referenceId=${referenceId}&partType=${partType}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getRestrictedParts(moduleId, referenceId, partType))
    });
  }

  getDefaultCurrency(id,masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/defaultcurrency?legalEntityId=${id}&masterCompanyId=${masterCompanyId !=undefined ?  masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getDefaultCurrency(id,masterCompanyId));
    });
  }

  getClassificationMapping(id, moduleId) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/classificationmappings?referenceId=${id}&moduleId=${moduleId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getClassificationMapping(id, moduleId));
    });
  }

  getIntegrationMapping(id, moduleId) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/integrationmappings?referenceId=${id}&moduleId=${moduleId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getIntegrationMapping(id, moduleId));
    });
  }

  getLegalEntityList() {
    return this.http.get<any>(`${this.baseUrl}/api/common/levelonedata`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getLegalEntityList());
    });
  }

  getBusinessUnitListByLegalEntityId(legalEntityId) {
    return this.http.get<any>(`${this.baseUrl}/api/common/leveltwodata?parentId=${legalEntityId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getBusinessUnitListByLegalEntityId(legalEntityId));
    });
  }

  getDivisionListByBU(businessUnitId) {
    return this.http.get<any>(`${this.baseUrl}/api/common/levelthreedata?parentId=${businessUnitId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getDivisionListByBU(businessUnitId));
    });
  }

  getDepartmentListByDivisionId(divisionId) {
    return this.http.get<any>(`${this.baseUrl}/api/common/levelfourdata?parentId=${divisionId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getDepartmentListByDivisionId(divisionId));
    });
  }

  getRestrictedPartsWithDesc(moduleId, referenceId, partType, isDeleted) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getrestrictedpartswithdesc?moduleId=${moduleId}&referenceId=${referenceId}&partType=${partType}&isDeleted=${isDeleted}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getRestrictedPartsWithDesc(moduleId, referenceId, partType, isDeleted));
    });
  }

  GetDocumentsList(referenceId, moduleId, isDeleted?) {
    return this.http.get<any>(`${this.baseUrl}/api/FileUpload/getFileDocumentDetail/${referenceId}?moduleId=${moduleId}&isDeleted=${isDeleted !== undefined ? isDeleted : false}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetDocumentsList(referenceId, moduleId, isDeleted));
    });
  }

  GetDocumentsListNew(referenceId, moduleId, isDeleted?) {
    return this.http.get<any>(`${this.baseUrl}/api/FileUpload/getFileDocumentDetailNew/${referenceId}?moduleId=${moduleId}&isDeleted=${isDeleted !== undefined ? isDeleted : false}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetDocumentsListNew(referenceId, moduleId, isDeleted));
    });
  }

  GetDocumentsListWithType(referenceId, moduleId, typeId) {
    return this.http.get<any>(`${this.baseUrl}/api/FileUpload/getFileDocumentDetailwithType/${referenceId}?moduleId=${moduleId}&typeId=${typeId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetDocumentsListWithType(referenceId, moduleId, typeId));
    });
  }

  GetAttachmentRestoreById(attachmentDetailId, updatedBy) {
    return this.http.delete(`${this.baseUrl}/api/FileUpload/AttachmentRestore/${attachmentDetailId}?updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetAttachmentRestoreById(attachmentDetailId, updatedBy));
    });
  }

  restoreDocumentByAttachmentId(attachmentId, updatedby) {
    return this.http.delete<any>(`${this.baseUrl}/api/common/attachmentRestore/${attachmentId}?updatedBy=${updatedby}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.restoreDocumentByAttachmentId(attachmentId, updatedby));
    });
  }

  GetAttachmentDeleteById(attachmentDetailId, updatedBy) {
    return this.http.delete(`${this.baseUrl}/api/FileUpload/AttachmentDelete/${attachmentDetailId}?updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetAttachmentDeleteById(attachmentDetailId, updatedBy));
    });
  }

  GetAttachmentCommonDeleteById(attachmentDetailId, updatedBy) {
    return this.http.put(`${this.baseUrl}/api/Common/deleteDocuments?Id=${attachmentDetailId}&updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetAttachmentCommonDeleteById(attachmentDetailId, updatedBy));
    });
  }

  updatedRestoreCommonRecords(attachmentDetailId, updatedBy) {
    return this.http.put(`${this.baseUrl}/api/Common/RestoreDocumentdetails?id=${attachmentDetailId}&updatedBy=${updatedBy}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.updatedRestoreCommonRecords(attachmentDetailId, updatedBy));
    });
  }

  uploadDocumentsEndpoint<T>(file: any): Observable<T> {
    //const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    return this.http.post<T>(`${this.baseUrl}/api/FileUpload/commonDocumentUpload`, file).catch(error => {
      return this.handleErrorCommon(error, () => this.uploadDocumentsEndpoint<T>(file));
    });
  }

  uploadDocumentsCommonEndpoint<T>(file: any, arryData: any) {
    // const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    return this.http.post(`${this.baseUrl}/api/FileUpload/CommonDocumentUploadNew`, file, arryData).catch(error => {
      return this.handleErrorCommon(error, () => this.uploadDocumentsCommonEndpoint(file, arryData));
    });
  }

  uploadDocumentsCommonEndpointUpdate<T>(file: any, arryData: any) {
    // const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    return this.http.post(`${this.baseUrl}/api/FileUpload/CommonDocumentUploadupdate`, file, arryData).catch(error => {
      return this.handleErrorCommon(error, () => this.uploadDocumentsCommonEndpointUpdate(file, arryData));
    });
  }

  // uploadVendorCapabilitiesList(file, vendorId, data) {
  //     return this.http.post(`${this.configurations.baseUrl}${this._addCapesDocumentDetails}?vendorId=${vendorId}`, file, data)
  // }

  assetDocumentsEndpoint<T>(file: any): Observable<T> {
    const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    return this.http.post<T>(`${this.baseUrl}/api/FileUpload/AssetDocumentUpload`, file, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.assetDocumentsEndpoint(file));
    });
  }

  uploadVendorDocumentsEndpoint<T>(file: any): Observable<T> {
    const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    return this.http.post<T>(`${this.baseUrl}/api/FileUpload/commonVendorDocumentUpload`, file, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.uploadVendorDocumentsEndpoint(file));
    });
  }

  uploadVendorAuditDocumentsEndpoint<T>(file: any): Observable<T> {
    const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
    return this.http.post<T>(`${this.baseUrl}/api/FileUpload/vendorAuditDocumentUpload`, file, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.uploadVendorAuditDocumentsEndpoint(file));
    });
  }

  toDownLoadFile(fileUrl) {
    const url = `${this.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${fileUrl}`;
    window.location.assign(url);
  }

  getReceivingCustomers(value,masterCompanyId?) {
    return this.http.get(`${this.baseUrl}/api/receivingcustomerwork/getreceivingcustomerslist?value=${value}?masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getReceivingCustomers(value,masterCompanyId));
    });
  }

  getJobTitles(masterCompanyId) {
    // const masterCompany = masterCompanyId > 0 ? masterCompanyId : 1;
    return this.http.get<any>(`${this.baseUrl}/api/common/jobtitletypes?masterCompanyId=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getJobTitles(masterCompanyId));
    });
  }

  getCSRAndSalesPersonOrAgentList(managementStructureId, customerId, csrIds, salesIds) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/employeesdropdowns?managementStructureId=${managementStructureId}&customerId=${customerId}&csrId=${csrIds}&salesId=${salesIds}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getCSRAndSalesPersonOrAgentList(managementStructureId, customerId, csrIds, salesIds));
    });
  }

  getEmployeesByCategory(value) {
    return this.http.get<any>(`${this.baseUrl}/api/common/employeesbyjobtitle?jobTitleId=${value}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getEmployeesByCategory(value));
    });
  }

  getAllSalesEmployeeListByJobTitle(JobTitleIds,masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/common/GetEmployeesByJobTitles?jobTitleIds=${JobTitleIds}&masterCompanyId=${masterCompanyId !=undefined ?masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getAllSalesEmployeeListByJobTitle(JobTitleIds,masterCompanyId));
    });
  }
  getAllSalesEmployeeListByExpertiseIds(ExpTitleIds,masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/common/GetEmployeesByExpertiseIds?expTitleIds=${ExpTitleIds}&masterCompanyId=${masterCompanyId !=undefined ?masterCompanyId : 0}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getAllSalesEmployeeListByJobTitle(ExpTitleIds,masterCompanyId));
    });
  }

  getExpertise(masterCompanyId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/common/expertisetypes?masterCompanyId=${masterCompanyId} `, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getExpertise(masterCompanyId));
    });
  }
  getSalesExpertise(masterCompanyId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/common/salesexpertisetypes?masterCompanyId=${masterCompanyId} `, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getSalesExpertise(masterCompanyId));
    });
  }


  getExpertiseEmployeesByCategory(value,masterCompanyId?) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/common/employeesbyexpertise?expertiseId=${value}&masterCompanyId=${masterCompanyId !=undefined ?  masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getExpertiseEmployeesByCategory(value,masterCompanyId));
    });
  }

  getDocumentAttachmentList(attachmentId, referenceId, moduleId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/FileUpload/getattachmentdetails?attachmentId=${attachmentId}&referenceId=${referenceId}&moduleId=${moduleId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getDocumentAttachmentList(attachmentId, referenceId, moduleId));
    });
  }

  getTechnicianStation(technicianId,masterCompanyId?) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/common/getemployeestation?employeeId=${technicianId}&masterCompanyId=${masterCompanyId !=undefined ?  masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getTechnicianStation(technicianId,masterCompanyId));
    });
  }

  getVendorContact(vendorId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/Common/vendorcontacts?vendorId=${vendorId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getVendorContact(vendorId));
    });
  }

  //Cet charge by it's Id
  getChargeData(chargeId): Observable<any> {
    return this.http.get(`${this.configurations.baseUrl}/api/charge/GetChargeById/${chargeId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getChargeData(chargeId));
    });
  }

  getFunctionalReportCurrencyById(id) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/common/functionalreportingcurrencybyid?managementStructureId=${id}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getFunctionalReportCurrencyById(id));
    });
  }

  workOrderDefaultSettings(companyId, actionId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workordersettings?masterCompanyId=${companyId}&workOrderTypeId=${actionId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.workOrderDefaultSettings(companyId, actionId));
    });
  }

  getEmployeeData(masterCompanyId, employeeId) {
    return this.http.get(`${this.configurations.baseUrl}/api/common/loginuserdetails?masterCompanyId=${masterCompanyId}&employeeId=${employeeId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getEmployeeData(masterCompanyId, employeeId));
    });
  }

  getManagementStructureData(masterCompanyId, mangStructureId) {
    return this.http.get(`${this.configurations.baseUrl}/api/common/employeemangstructureinfo?masterCompanyId=${masterCompanyId}&mangStructureId=${mangStructureId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getManagementStructureData(masterCompanyId, mangStructureId));
    });
  }

  getPriceDetailsByCondId(itemMasterId, conditionId,masterCompanyId?) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/common/partpurchasesaledetails?itemMasterId=${itemMasterId}&condition=${conditionId}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getPriceDetailsByCondId(itemMasterId, conditionId,masterCompanyId));
    });
  }

  //customer restriction service and warning sercices
  customerWarnings(customerId, customerWarningListId,masterCompanyId?) {
    return this.http.get(`${this.configurations.baseUrl}/api/common/customerwarnings?customerId=${customerId}&customerWarningListId=${customerWarningListId}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.customerWarnings(customerId, customerWarningListId,masterCompanyId));
    });
  }

  customerResctrictions(customerId, customerWarningListId,masterCompanyId?) {
    return this.http.get(`${this.configurations.baseUrl}/api/common/customerrestrictions?customerId=${customerId}&customerWarningListId=${customerWarningListId}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.customerResctrictions(customerId, customerWarningListId,masterCompanyId));
    });
  }

  GetAttachment(id) {
    return this.http.get<any>(`${this.baseUrl}/api/FileUpload/getattachmentdetails/${id}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetAttachment(id));
    });
  }

  GetAttachmentAudit(id) {
    return this.http.get<any>(`${this.baseUrl}/api/FileUpload/getattachmentdetailsaudit/${id}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetAttachmentAudit(id));
    });
  }

  GetPurchaseAndSalesAuditHistory(id) {
    return this.http.get<any>(`${this.baseUrl}/api/ItemMaster/getAuditHistoryItemMasterPurchSaleByID/${id}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetPurchaseAndSalesAuditHistory(id));
    });
  }

  GetAttachmentPublicationAudit(id) {
    return this.http.get<any>(`${this.baseUrl}/api/FileUpload/getattachmentdetailspublicationaudit/${id}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetAttachmentPublicationAudit(id));
    });
  }

  getModuleListForObtainOwnerTraceable(masterCompanyId) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/modulelistfordropdown/${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getModuleListForObtainOwnerTraceable(masterCompanyId));
    });
  }

  getModuleListForVendorOther() {
    return this.http.get<any>(`${this.baseUrl}/api/Common/assetcompanylistfordropdown`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getModuleListForVendorOther());
    });
  }

  updatedeletedrecords(Condition, ConditionId, id) {
    return this.http.put<any>(`${this.baseUrl}/api/Common/updatedeletedrecords?tableName=${Condition}&primaryColumn=${ConditionId}&columnValue=${id}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.updatedeletedrecords(Condition, ConditionId, id));
    });
  }

  updatedeletedrecords1(GLAccount, GLAccountId, id) {
    return this.http.put<any>(`${this.baseUrl}/api/Common/updatedeletedrecords?tableName=${GLAccount}&primaryColumn=${GLAccountId}&columnValue=${id}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.updatedeletedrecords1(GLAccount, GLAccountId, id));
    });
  }

  updatedeletedrecords11(ItemMaster, itemMasterId, id) {
    return this.http.put<any>(`${this.baseUrl}/api/Common/updatedeletedrecords?tableName=${ItemMaster}&primaryColumn=${itemMasterId}&columnValue=${id}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.updatedeletedrecords11(ItemMaster, itemMasterId, id));
    });
  }

  getAttachmentModuleIdByName(name) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/togetattachmentmoduleid?moduleName=${name}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getAttachmentModuleIdByName(name));
    });
  }
  
  getGlAccountList(masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getglaccountlist/${masterCompanyId!==undefined?masterCompanyId:1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getGlAccountList(masterCompanyId));
    });
  }

  smartDropDownGetObjectById(tableName, primaryColumn, description, primaryIdLabel, primaryIdValue,masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/binddropdownsbyid?tableName=${tableName}&primaryColumn=${primaryColumn}&textColumn=${description}&textColumn1=${primaryIdLabel}&textColumn2=${primaryIdValue}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.smartDropDownGetObjectById(tableName, primaryColumn, description, primaryIdLabel, primaryIdValue,masterCompanyId));
    });
  }

  getLegalEntityIdByMangStrucId(managementStructureId) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/legalentitylistbymanagementstructure?mgmtStructId=${managementStructureId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getLegalEntityIdByMangStrucId(managementStructureId));
    });
  }

  getWODataFilter(filterVal, count, idList?, masterCompanyId?) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/Common/WODataFilter?filterVal=${filterVal}&count=${count}&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getWODataFilter(filterVal, count, idList, masterCompanyId));
    });
  }

  getsubWODataFilter(filterVal, count, idList?, masterCompanyId?) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/Common/subWODataFilter?filterVal=${filterVal}&count=${count}&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getsubWODataFilter(filterVal, count, idList, masterCompanyId));
    });
  }

  getSODataFilter(filterVal, count, idList?, masterCompanyId?) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/Common/SODataFilter?filterVal=${filterVal}&count=${count}&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getSODataFilter(filterVal, count, idList, masterCompanyId));
    });
  }

  getRODataFilter(filterVal, count, idList?, masterCompanyId?) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/Common/RODataFilter?filterVal=${filterVal}&count=${count}&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getRODataFilter(filterVal, count, idList, masterCompanyId));
    });
  }

  GetSubWolist(workOrderId) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/Common/GetSubWolistById?Id=${workOrderId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetSubWolist(workOrderId));
    });
  }

  getOpenWONumbers() {
    return this.http.get<any>(`${this.baseUrl}/api/Common/openwonumbers`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getOpenWONumbers());
    });
  }

  getOpenRONumbers() {
    return this.http.get<any>(`${this.baseUrl}/api/Common/openronumbers`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getOpenRONumbers());
    });
  }

  getOpenSONumbers() {
    return this.http.get<any>(`${this.baseUrl}/api/Common/opensonumbers`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getOpenSONumbers());
    });
  }

  getOpenPONumbers() {
    return this.http.get<any>(`${this.baseUrl}/api/Common/openponumbers`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getOpenPONumbers());
    });
  }

  getCertifiedEmpList(managementStructureId) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/certified-employeelist/${managementStructureId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getCertifiedEmpList(managementStructureId));
    });
  }

  getStockpartnumbersAutoComplete(value, all, count, masterCompanyID?) {
    return this.http.get<any>(`${this.baseUrl}/api/common/stockpartnumbersautocomplete?searchValue=${value}&all=${all}&count=${count}&masterCompanyID=${masterCompanyID !== undefined ? masterCompanyID : 1} `, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getStockpartnumbersAutoComplete(value, all, count, masterCompanyID));
    });
  }

  // for site based on the managementstructureId
  getSitesbymanagementstructrue(managementStructureId) {
    return this.http.get<any>(`${this.baseUrl}/api/workOrder/sitesbymanagementstructrue?managementStructureId=${managementStructureId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getSitesbymanagementstructrue(managementStructureId));
    });
  }

  getSitesbymanagementstructrueNew(managementStructureId) {
    return this.http.get<any>(`${this.baseUrl}/api/common/sitesdropdownbymanagementstructure?managementStructureId=${managementStructureId}&all=true `, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getSitesbymanagementstructrueNew(managementStructureId));
    });
  }

  getWareHouseDateNew(siteId) {
    return this.http.get<any>(`${this.baseUrl}/api/common/getwarehousebysiteId?siteId=${siteId}&all=true `, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getWareHouseDateNew(siteId));
    });
  }

  getLocationDateNew(id) {
    return this.http.get<any>(`${this.baseUrl}/api/common/getlocationbywarehouseid?wareHouseId=${id}&all=true `, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getLocationDateNew(id));
    });
  }

  getShelfDateNew(id) {
    return this.http.get<any>(`${this.baseUrl}/api/common/getshelfbylocationid?locationId=${id}&all=true `, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getShelfDateNew(id));
    });
  }

  getBinDataByIdNew(id) {
    return this.http.get<any>(`${this.baseUrl}/api/common/getbinbyshelfid?shelfId=${id}&all=true `, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getBinDataByIdNew(id));
    });
  }

  getSalesQuoteHeaderMarginDetails(id) {
    return this.http.get<any>(`${this.baseUrl}/api/SalesQuote/togetquoteheadermargindetails/${id}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getSalesQuoteHeaderMarginDetails(id));
    });
  }

  // common call for part numbers list
  getPartNumData(customerId) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/partnumbersbycustomer?customerId=${customerId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getPartNumData(customerId));
    });
  }
  // common api for customer names dropdown

  getcustomerList(value) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/bindautocompletedropdowns?tableName=Customer&primaryColumn=CustomerId&textColumn=Name&searchText=${value}&startWith=false&count=20`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getcustomerList(value));
    });
  }

  customergenericinformation(customerId,masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/customergenericinformation?customerId=${customerId}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.customergenericinformation(customerId,masterCompanyId));
    });
  }

  vendorWarnings(id, warningListId) {
    return this.http.get(`${this.configurations.baseUrl}/api/common/vendorwarnings?vendorId=${id}&vendorWarningListId=${warningListId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.vendorWarnings(id, warningListId));
    });
  }

  vendorResctrictions(id, warningListId) {
    return this.http.get(`${this.configurations.baseUrl}/api/common/vendorrestrictions?vendorId=${id}&vendorWarningListId=${warningListId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.vendorResctrictions(id, warningListId));
    });
  }

  vendorWarningsAndRestrction(id, warningListId) {
    return this.http.get(`${this.configurations.baseUrl}/api/common/VendorWarningsAndRestrction?vendorId=${id}&vendorWarningListId=${warningListId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.vendorWarningsAndRestrction(id, warningListId));
    });
  }

  getPartnumList(value,masterCompanyID?) {
    return this.http.get<any>(`${this.baseUrl}/api/common/stockpartnumbersautocomplete?searchValue=${value}&all=false&count=20&masterCompanyID=${masterCompanyID !== undefined ? masterCompanyID : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getPartnumList(value,masterCompanyID));
    });
  }

  getCustomerContactsById(id,masterCompanyId?) {
    return this.http.get<any>(`${this.configurations.baseUrl}/api/common/getcustomercontacts?customerId=${id}&all=true&masterCompanyId=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getCustomerContactsById(id,masterCompanyId));
    });
    // return this.http.get<any>(`${this.configurations.baseUrl}/api/common/customercontacts?customerId=${id}`)  // old call
  }

  getEmployeesbylegalentity(legalEntityId) {
    return this.http.get<any>(`${this.baseUrl}/api/common/employeesbylegalentity?legalEntityId=${legalEntityId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getEmployeesbylegalentity(legalEntityId));
    });
  }

  employeesByLegalEntityandMS(legalEntityId) {
    return this.http.get<any>(`${this.baseUrl}/api/common/employeesByLegalEntityandMS?legalEntityId=${legalEntityId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.employeesByLegalEntityandMS(legalEntityId));
    });
  }

  getEmployeeDetailsbylegalentity(managementStructureId) {
    return this.http.get<any>(`${this.baseUrl}/api/common/legalentitydetailsbymanagementid?managementStructureId=${managementStructureId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getEmployeeDetailsbylegalentity(managementStructureId));
    });
  }

  getCustomerShipAddressGet(customerId) {
    return this.http.get<any>(`${this.baseUrl}/api/common/legalentitydetailsbymanagementid?managementStructureId=${customerId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getCustomerShipAddressGet(customerId));
    });
  }

  getModuleListByUserType(addresstype) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getModuleListByUserType?addresstype=${addresstype}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getModuleListByUserType(addresstype));
    });
  }

  autoSuggestionSmartuserDropDownList(usertypeid, searchText, startWith, count?, idList?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getuserlistbymodule?usertypeid=${usertypeid}&StrFilter=${searchText}&startWith=${startWith}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoSuggestionSmartuserDropDownList(usertypeid, searchText, startWith, count, idList));
    });
  }

  getaddressdetailsbyuser(ModuleId, UserId, AddressType, purchaseOrderID?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getaddressdetailsbyuser?ModuleId=${ModuleId}&UserId=${UserId}&AddressType=${AddressType}&purchaseOrderID=${purchaseOrderID !== undefined ? purchaseOrderID : 0}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getaddressdetailsbyuser(ModuleId, UserId, AddressType, purchaseOrderID));
    });
  }

  getworkorderaddressdetailsbyuser(ModuleId, UserId, AddressType, IdList?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getworkorderaddressdetailsbyuser?ModuleId=${ModuleId}&UserId=${UserId}&AddressType=${AddressType}&IdList=${IdList !== undefined ? IdList : 0}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getaddressdetailsbyuser(ModuleId, UserId, AddressType, IdList));
    });
  }

  getaddressdetailsOnlyUserbyuser(ModuleId, UserId, AddressType, purchaseOrderID?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getaddressdetailsOnlyUserbyuser?ModuleId=${ModuleId}&UserId=${UserId}&AddressType=${AddressType}&purchaseOrderID=${purchaseOrderID !== undefined ? purchaseOrderID : 0}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getaddressdetailsOnlyUserbyuser(ModuleId, UserId, AddressType, purchaseOrderID));
    });
  }

  getAddressById(Id, AddressType, ModuleID) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getaddressdetailsbyid?Id=${Id}&AddressType=${AddressType}&ModuleID=${ModuleID}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getAddressById(Id, AddressType, ModuleID));
    });
  }

  GetDocumentsListNewAsset(referenceId, moduleId, isDeleted,masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/FileUpload/getFileDocumentDetailNew/${referenceId}?moduleId=${moduleId}&isdeleted=${isDeleted}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetDocumentsListNewAsset(referenceId, moduleId, isDeleted));
    });
  }

  GetDocumentsCommonList(referenceId, moduleId, isDeleted,masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getDocumentDetail?moduleId=${moduleId}&referenceId=${referenceId}&isdeleted=${isDeleted}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetDocumentsCommonList(referenceId, moduleId, isDeleted,masterCompanyId));
    });
  }

  GetAttachmentCommonAudit(id, referenceId, moduleId) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getDocumentsAudit?Id=${id}&referenceId=${referenceId}&moduleId=${moduleId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetAttachmentCommonAudit(id, referenceId, moduleId));
    });
  }

  getAssetListBasedOnType(tableName, primaryKeyColumn, labelColumn, searchValue?, secondarycolumn?, secondarytextcolumn?, count?, idList?,masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/bindautocompletedropdownsbasedoncolumn?tableName=${tableName}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&searchText=${searchValue}&startWith=true&secondarycolumn=${secondarycolumn}&secondarytextcolumn=${secondarytextcolumn}&count=${count !== undefined ? count : 0}&idList=${idList}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getAssetListBasedOnType(tableName, primaryKeyColumn, labelColumn, searchValue, secondarycolumn, secondarytextcolumn, count, idList));
    });
  }

  getAutoCompleteDropDownsByTwoTables(tableName1, tableName2, primaryKeyColumn, labelColumn, searchValue?, count?, idList?,masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/Bindautocompletedropdownsbasedontwotables?tableName1=${tableName1}&tableName2=${tableName2}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&searchText=${searchValue}&startWith=true&count=${count !== undefined ? count : 0}&idList=${idList}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getAutoCompleteDropDownsByTwoTables(tableName1, tableName2, primaryKeyColumn, labelColumn, searchValue, count, idList));
    });
  }

  getAutoCompleteDropDownsByCodeWithName(tableName1, primaryKeyColumn, labelColumn, secondarycolumn?, searchValue?, count?, idList?,masterCompany?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/Bindautocompletedropdownsbasedontwocolumns?tableName1=${tableName1}&primaryColumn=${primaryKeyColumn}&textColumn=${labelColumn}&searchText=${searchValue}&startWith=true&secondarycolumn=${secondarycolumn}&count=${count !== undefined ? count : 0}&idList=${idList}&masterCompanyId=${masterCompanyId !=undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getAutoCompleteDropDownsByCodeWithName(tableName1, primaryKeyColumn, labelColumn, secondarycolumn, searchValue, count, idList));
    });
  }

  // TO Get Vendor COntacts by vendor Id With Active inactive List
  autoDropListVendorContacts(vendorid, searchText, count?, idList?) {
    return this.http.get<any>(`${this.baseUrl}/api/vendor/vendorContactDataFilter?filterVal=${searchText}&vendorid=${vendorid}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoDropListVendorContacts(vendorid, searchText, count, idList));
    });
  }

  // TO Get Customer COntacts by Customer Id With Active inactive List
  autoDropListCustomerContacts(customerid, searchText, count?, idList?,masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/customer/customerContactDataFilter?filterVal=${searchText}&customerid=${customerid}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&masterCompanyId=${masterCompanyId !== undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoDropListCustomerContacts(customerid, searchText, count, idList,masterCompanyId));
    });
  }

  saveAllAddress(object) {
    return this.http.post<any>(`${this.baseUrl}/api/Common/savealladdress`, JSON.stringify(object), this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.saveAllAddress(object));
    });
  }

  getAllAddEditID(purchaseOrderId, ModuleID) {
    //return this.http.get<any>(`${this.baseUrl}/api/Common/getAllEditID?Id=${purchaseOrderId}&ModuleID=${ModuleID}`)
    return this.http.get<any>(`${this.baseUrl}/api/Common/getAllEditID?Id=${purchaseOrderId}&ModuleID=${ModuleID}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getAllAddEditID(purchaseOrderId, ModuleID));
    });
  }

  getPOAddressById(poId): any {
  }

  getShipVia(masterCompanyId) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getAllShipVia?Id=${masterCompanyId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getShipVia(masterCompanyId));
    });
  }

  createShipViaForMaster(object) {
    const formData = new FormData;
    formData.append('params1', JSON.stringify(object));
    return this.http.post<any>(`${this.baseUrl}/api/single-screen/add-new`, object, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.createShipVia(object));
    });
  }

  SaveShipVia(object) {
    return this.http.post<any>(`${this.baseUrl}/api/Common/saveshipvia`, JSON.stringify(object), this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.SaveShipVia(object));
    });
  }

  getDocumentType(masterCompanyId?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getDocumentType?masterCompanyId=${masterCompanyId !==undefined ? masterCompanyId : 1}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getDocumentType(masterCompanyId));
    });
  }

  SaveDocumentType(object) {
    return this.http.post<any>(`${this.baseUrl}/api/Common/savedocumenttype`, JSON.stringify(object), this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.SaveDocumentType(object));
    });
  }

  getReportsCreadentials() {
    return this.http.get<any>(`${this.baseUrl}/api/Common/getreportscreadentials`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getReportsCreadentials());
    });
  }


  getPickTicketList(referenceId,moduleId): Observable<any> {
    return this.http.get(`${this.configurations.baseUrl}/api/Common/getpickticketapprovelist?referenceId=${referenceId}&moduleId=${moduleId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.getPickTicketList(referenceId,moduleId));
    });
  }

  GetCapabilityTypeDescription(capabilityId){
    return this.http.get(`${this.configurations.baseUrl}/api/Common/getCapabilityTypeDescription?capabilityId=${capabilityId}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.GetCapabilityTypeDescription(capabilityId));
    });
  }

  autoCompleteSmartDropDownItemMasterIsPmaOrIsDerList(searchText, startWith, count?, idList?, masterCompanyId?,ispmaorIsder?) {
    return this.http.get<any>(`${this.baseUrl}/api/Common/AutoCompleteSmartDropDownItemMasterIsPmaOrIsDerList?searchText=${searchText}&startWith=${startWith}&count=${count !== undefined ? count : 0}&idList=${idList !== undefined ? idList : '0'}&masterCompanyID=${masterCompanyId !== undefined ? masterCompanyId : 1}&ispmaorIsder=${ispmaorIsder}`, this.getRequestHeaders()).catch(error => {
      return this.handleErrorCommon(error, () => this.autoCompleteSmartDropDownItemMasterIsPmaOrIsDerList(searchText, startWith, count, idList, masterCompanyId,ispmaorIsder));
    });
  }

  // getAllEditID(purchaseOrderId) {
  //     return this.purchaseOrderEndpoint.getAllEditID(purchaseOrderId);
  // }

  // http://localhost:5230/api/Common/Bindautocompletedropdownsbasedontwocolumns?tableName1=GLAccount&primaryColumn=GLAccountId&textColumn=AccountName&searchText=&startWith=true&secondaryColumn=AccountCode&count=20&idList=0

  // http://localhost:5230/api/Common/Bindautocompletedropdownsbasedontwotables?tableName1=AssetIntangibleAttributeType&tableName2=AssetIntangibleType&primaryColumn=AssetIntangibleTypeId&textColumn=AssetIntangibleName&searchText=&startWith=true&count=20&idList=0
  // 
  // localhost:5230/api/Common/Bindautocompletedropdownsbasedontwocolumns?tableName1=AssetLocation&primaryColumn=AssetLocationId&textColumn=Name&searchText=&startWith=true&secondaryColumn=Code&count=20&idList=0
}
 
// GetEmployeesByExpertiseIds