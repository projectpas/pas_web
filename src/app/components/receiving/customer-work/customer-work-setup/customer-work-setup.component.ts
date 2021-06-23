import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
// declare var $ : any;
declare var $ : any;
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MenuItem } from 'primeng/api';//bread crumb
import { AuthService } from '../../../../services/auth.service';
import { ReceivingCustomerWorkService } from '../../../../services/receivingcustomerwork.service';
import { Router, ActivatedRoute } from '@angular/router';
import { getValueFromObjectByKey, getObjectById, editValueAssignByCondition, getValueFromArrayOfObjectById } from '../../../../generic/autocomplete';
import { CommonService } from '../../../../services/common.service';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { StocklineService } from '../../../../services/stockline.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { timePattern } from '../../../../validations/validation-pattern';
import { AppModuleEnum } from '../../../../enum/appmodule.enum';
import { TimeLifeDraftData } from '../../../../components/receiving/po-ro/receivng-po/PurchaseOrder.model';
// import { time } from 'console';
import * as moment from 'moment';

@Component({
    selector: 'app-customer-work-setup',
    templateUrl: './customer-work-setup.component.html',
    styleUrls: ['./customer-work-setup.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})
// 
export class CustomerWorkSetupComponent implements OnInit {    
    modal: NgbModalRef;
    receivingForm: any = {};
    isEditMode: boolean = false;
    private onDestroy$: Subject<void> = new Subject<void>();
    uploadDocs: Subject<boolean> = new Subject();
    timePattern = timePattern();
    breadcrumbs: MenuItem[] = [
        { label: 'Receiving' },
        { label: 'Customer Work List' },
        { label: 'Receiving Customer Work' }
    ];
    disableSave: boolean = true;
    allVendorsList: any = [];
    allCompanyList: any = [];
    customersList: any = [];
    vendorsList: any = [];
    companyList: any = [];
    allEmployeeList: any = [];
    employeeNames: any = [];
    allCustomersInfo: any = [];
    customerNamesInfo: any = [];
    customerCodesInfo: any = [];
    allPartnumbersList: any = [];
    partNumbersInfo: any = [];
    allWareHouses: any = [];
    allLocations: any = [];
    allShelfs: any = [];
    allBins: any = [];
    allSites: any = [];
    index: number;
    isDocumentsToShow: boolean = false;
    sourceViewforDocumentList: any = [];
    sourceViewforDocument: any = [];
    sourceViewforDocumentAudit: any = [];
    isEditButton: boolean = false;
    allDocumentListOriginal: any[];
    selectedRowForDelete: any;
    allPurchaseUnitOfMeasureinfo: any[] = [];
    managementStructure = {
        companyId: 0,
        buId: 0,
        divisionId: 0,
        departmentId: 0,
    }
    legalEntityList: any = [];
    businessUnitList: any = [];
    divisionList: any = [];
    departmentList: any = [];
    allConditionInfo: any = [];
    customerContactList: any = [];
    customerContactInfo: any = [];
    customerPhoneInfo: any = [];
    allTagTypes: any = [];
    currentDate = new Date();
    disableMagmtStruct: boolean = true;
    textAreaInfo: string;
    textAreaLabel: string;
    receivingCustomerWorkId: number;
    workOrderId: number;
    sourceTimeLife: any = {};
    customerId: number;
    timeLifeCyclesId: number;
    disableCondition: boolean = true;
    disableSite: boolean = true;
    formData = new FormData();
    customerWarningListId: any;
    restrictMessage: any;
    warningMessage: any;
    warningID: any;
    restrictID: any;
    isEditCustomerWork: boolean = false;
    managementStructureId: any;
    moduleListDropdown: any = [];
    isSpinnerVisible: boolean = false;
    moduleName: any = 'ReceivingCustomerWork';
    setEditArray: any = [];
    msId: any;
    arrayVendlsit: any = [];
    disableUpdateButton: any = false;
    isCustomerStock: any = 0;
    arrayCustlist: any = [];
    workScopeList: any = [];
    expiryDate: any;
    gettagTypeIds: any = [];
    allCustomerFinanceDocumentsListOriginal: any = [];
    customerWarningsList: any;
    disableSaveadd: boolean = true;
    disabledMemo: boolean = false;
    memoPopupContent: any;
    arrayEmplsit:any[] = [];
    certifiedEmployeeList: any = [];
    workorderSettings:any;
    companyModuleId: number = 0;   
    vendorModuleId: number = 0;   
    customerModuleId: number = 0;   
    otherModuleId: number = 0; 
    stockLineId : number = 0;
    customerTypeId: number = 1;

    constructor(private commonService: CommonService,
        private datePipe: DatePipe,
        private _actRoute: ActivatedRoute,
        private receivingCustomerWorkService: ReceivingCustomerWorkService,
        private authService: AuthService,
        private router: Router,		private modalService: NgbModal,
        private alertService: AlertService,        
        private stocklineService: StocklineService) {            
        this.receivingForm.receivingNumber = 'Creating';
        this.receivingForm.conditionId = 0;
        this.receivingForm.siteId = 0;
        this.receivingForm.warehouseId = 0;
        this.receivingForm.locationId = 0;
        this.receivingForm.shelfId = 0;
        this.receivingForm.binId = 0;
        this.receivingForm.obtainFromTypeId = 1;
        this.receivingForm.ownerTypeId = 1;
        this.receivingForm.traceableToTypeId = 1;
        this.receivingForm.taggedByType = 1;
        this.receivingForm.tagType = null;
        this.receivingForm.quantity = 1;
        this.receivingForm.isCustomerStock = true;
        this.receivingForm.receivedDate = new Date();
        this.companyModuleId = AppModuleEnum.Company;                 
        this.vendorModuleId = AppModuleEnum.Vendor;
        this.customerModuleId = AppModuleEnum.Customer;
        this.otherModuleId = AppModuleEnum.Others; 
    }

    ngOnInit() {
        this.loadSiteData('fromOnload');
        this.Purchaseunitofmeasure();
        this.loadModulesNamesForObtainOwnerTraceable();
        this.receivingCustomerWorkId = this._actRoute.snapshot.params['id'];
        this.loadPartNumData('');
        this.loadCompanyData();
        this.getCustomerWarningsList();
        this.getAllEmployeesByManagmentStructureID();
       
        if (this.receivingCustomerWorkId) {
            this.isEditMode = true;
            this.disableUpdateButton = true;
            this.getReceivingCustomerDataonEdit(this.receivingCustomerWorkId);
            this.breadcrumbs = [
                { label: 'Receiving' },
                { label: 'Customer Work List' },
                { label: 'Receiving Customer Work' }
            ];
        } else {
            this.getWorkOrderDefaultSetting();
            this.getEmployeeData();
            this.loadTagTypes('');
            this.loadEmployeeData('');
            this.loadConditionData('');
            this.getworkScope('');
            this.getManagementStructureDetails(this.authService.currentUser
                ? this.authService.currentUser.managementStructureId
                : null, this.authService.currentUser ? this.authService.currentUser.employeeId : 0);
        }
    }

    loadModulesNamesForObtainOwnerTraceable() {
        this.commonService.getModuleListForObtainOwnerTraceable(this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.moduleListDropdown = res; 
        })
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName  : '';
    }

    get employeeId() {
        return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
    }

    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null;
	}

    get currentUserManagementStructureId(): number {
        return this.authService.currentUser ? this.authService.currentUser.managementStructureId : null;
      }

    filterPartNumbers(event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadPartNumData(event.query)
        }else{
            this.loadPartNumData('');
        }
    }
    
    loadPartNumData(strText = '') {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.receivingForm.itemMasterId ? this.receivingForm.itemMasterId.value : 0);

        } else {
            this.setEditArray.push(0);
        }
        this.commonService.autoCompleteSmartDropDownItemMasterList(strText, true, 20, this.setEditArray.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.allPartnumbersList = res;
            this.partNumbersInfo = this.allPartnumbersList;
        })
    } 
    
    loadEmployeeData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.receivingForm.employeeId ? this.receivingForm.employeeId.value : 0);
        } else {
            this.setEditArray.push(0);
        }
        if (this.setEditArray.length == 0) {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoCompleteDropdownsEmployeeByMS(strText, true, 20, this.setEditArray.join(), this.currentUserManagementStructureId, this.currentUserMasterCompanyId).subscribe(res => {
           if (res && res.length != 0) {
                this.allEmployeeList = res;
            }
        })
    }

    getEmployeeData() {
        this.receivingForm.employeeId = this.authService.currentEmployee;
        this.selectedLegalEntity(this.authService.currentManagementStructure.levelId1,'onLoad');
        this.selectedBusinessUnit(this.authService.currentManagementStructure.levelId2,'onLoad');
        this.selectedDivision(this.authService.currentManagementStructure.levelId3,'onLoad');
        this.selectedDepartment(this.authService.currentManagementStructure.levelId4,'onLoad');
        this.managementStructure.companyId = this.authService.currentManagementStructure.levelId1;
        this.managementStructure.buId = this.authService.currentManagementStructure.levelId2;
        this.managementStructure.divisionId = this.authService.currentManagementStructure.levelId3;
        this.managementStructure.departmentId = this.authService.currentManagementStructure.levelId4;
    }

    filterVendorNames(event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadVendorData(event.query);
        }else{
            this.loadVendorData('');
        }
    }
    
    private loadVendorData(strText = '') {
        this.arrayVendlsit = [];
        if(this.isEditMode==true) {
            this.arrayVendlsit.push(this.receivingForm.traceableTo? this.receivingForm.traceableTo.value :0,
                this.receivingForm.owner?  this.receivingForm.owner.value : 0,
                this.receivingForm.obtainFrom ? this.receivingForm.obtainFrom.value : 0,
                this.receivingForm.taggedById ? this.receivingForm.taggedById.value : 0 ); 
        } else {
            this.arrayVendlsit.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Vendor', 'VendorId', 'VendorName', strText, true, 20, this.arrayVendlsit.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.allVendorsList = res;
            this.vendorsList = this.allVendorsList;
        })
    }

    filterCompanyNames(event) {
        if (event.query !== undefined && event.query !== null) {    
            this.loadCompanyData(event.query);        
        }else{
            this.loadCompanyData('');
        }
    }

    loadCompanyData(strText = '') {
        this.arrayVendlsit = [];
        if(this.isEditMode==true){
            this.arrayVendlsit.push(this.receivingForm.traceableTo? this.receivingForm.traceableTo.value :0,
                this.receivingForm.owner ? this.receivingForm.owner.value :0,
                this.receivingForm.obtainFrom ? this.receivingForm.obtainFrom.value :0 , 
                this.receivingForm.taggedById ? this.receivingForm.taggedById.value : 0 ); 
        }else{
            this.arrayVendlsit.push(0);
        }
      this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name', strText, true, 20, this.arrayVendlsit.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.allCompanyList = res;
            this.companyList = this.allCompanyList;
        })
    }

    loadConditionData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.receivingForm.conditionId ? this.receivingForm.conditionId : 0);

        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('Condition', 'ConditionId', 'Description', strText, true, 20, this.setEditArray.join(), this.currentUserMasterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.allConditionInfo = res.map(x => {
                    return {
                        ...x,
                        conditionId: x.value,
                        description: x.label
                    }
                });
            }
        })
    }

    async getAllEmployeesByManagmentStructureID() {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.arrayEmplsit.push(0,this.authService.currentEmployee.value);
            this.arrayEmplsit.push(this.receivingForm.certifieEemployeeId ? this.receivingForm.certifieEemployeeId.value : 0);
        } else {
            this.arrayEmplsit.push(0,this.authService.currentEmployee.value);
        }
        await this.commonService.autoCompleteDropdownsCertifyEmployeeByMS('',true, 200,this.arrayEmplsit.join(), this.currentUserManagementStructureId,this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.certifiedEmployeeList = res;            
        })
	}

    getActive() {
        this.disableUpdateButton = false;
    }

    onFilterTangible(value) {
        this.loadTagTypes(value);
    }

    loadTagTypes(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.receivingForm.tagTypeId ? this.receivingForm.tagTypeId : 0);

        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';        
        this.commonService.autoSuggestionSmartDropDownList('TagType', 'TagTypeId', 'Name', strText, true, 20, this.setEditArray.join(), this.currentUserMasterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.allTagTypes = res;
            }
            if (this.isEditMode == true) {
                if (this.receivingForm.tagType && this.receivingForm.tagType != '0') {
                    this.receivingForm.tagType = this.receivingForm.tagType.split(',').filter(function (el) {
                        return (el != null && el !='');
                      });
                    for (let i = 0; i < this.receivingForm.tagType.length; i++) {
                        this.receivingForm.tagType[i] = this.getIdFromArrayOfObjectByValue('value', 'label', this.receivingForm.tagType[i], this.allTagTypes);
                    }
                } else {
                    this.receivingForm.tagType = [];
                }
            }
        })
    }

    getReceivingCustomerDataonEdit(id) {
        this.isSpinnerVisible = true;
        this.receivingCustomerWorkService.getCustomerWorkdataById(id).subscribe(res => {
            this.loadEmployeeData('');
            this.isDocumentsToShow=true;
            this.customerId = res.customerId;
            this.isEditCustomerWork = true;
            this.managementStructureId = res.managementStructureId;
            this.receivingForm.customerContactId = res;
            this.receivingForm.customerPhone = res;
            if (this.receivingForm.isCustomerStock == true) {
                this.isCustomerStock = 0;
            } else {
                this.isCustomerStock = 1;
            }
            this.customerWarnings(this.customerId);
            this.receivingForm = {
                ...res,
                itemMasterId: { 'value': res.itemMasterId, 'label': res.partNumber },
                tagDate: res.tagDate ? new Date(res.tagDate) : '',
                mfgDate: res.mfgDate ? new Date(res.mfgDate) : '',
                expDate: res.expDate ? new Date(res.expDate) : '',
                certifiedDate: res.certifiedDate ? new Date(res.certifiedDate) : '',
                inspectedDate: res.inspectedDate ? new Date(res.inspectedDate) : '',
                receivedDate: res.receivedDate ? new Date(res.receivedDate) : '',
                timeLifeDate: res.timeLifeDate ? new Date(res.timeLifeDate) : '',
                custReqDate: res.custReqDate ? new Date(res.custReqDate) : '',
                customerId: { 'customerId': res.customerId, 'name': res.customerName },
                employeeId: { 'value': res.employeeId, 'label': res.employeeName },
                customerCode: res.customerCode,
                customerContactId: res,
                customerPhone: res,
                ownerTypeId:res.ownerTypeId==null? 0 :res.ownerTypeId,
                obtainFromTypeId:res.obtainFromTypeId==null? 0 :res.obtainFromTypeId,
                traceableToTypeId:res.traceableToTypeId==null? 0 :res.traceableToTypeId,
                taggedById: res.taggedById == null ? 0 :res.taggedById,  //---------------------------------
                purchaseUnitOfMeasureId: this.getInactiveObjectOnEdit('value', res.purchaseUnitOfMeasureId, this.allPurchaseUnitOfMeasureinfo, 'UnitOfMeasure', 'unitOfMeasureId', 'shortname'),
            };
            this.getManagementStructureDetails(this.receivingForm
                ? this.receivingForm.managementStructureId
                : null, this.authService.currentUser ? this.authService.currentUser.employeeId : 0);
            this.getAllCustomerContact(res.customerId,'formEditapi');
            this.onPartNumberSelected(res,'onLoad');
            setTimeout(() => { 
                this.getSiteDetailsOnEdit(res);
            }, 1000);
            this.getObtainOwnerTraceOnEdit(res);
            this.loadTagTypes('');
            if (res.obtainFromType == 'Vendor' || res.ownerType == 'Vendor' || res.tracableToType == 'Vendor' || res.taggedByTypeName == 'Vendor') {
                this.loadVendorData('');
            }
            this.loadConditionData('');
            this.getworkScope('');
            this.stockLineId = res.stockLineId > 0 ? res.stockLineId : null;
            if (res.timeLifeCyclesId != null || res.timeLifeCyclesId != 0) {
                this.timeLifeCyclesId = res.timeLifeCyclesId;
                this.getTimeLifeOnEdit(res.timeLifeCyclesId);
            }
        
            this.onChangeSiteName();
            this.onSelectCondition();
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        });
    }


    getSiteDetailsOnEdit(res) {
        this.getInactiveObjectOnEdit('value', res.siteId, this.allSites, 'Site', 'SiteId', 'Name');
        this.getInactiveObjectOnEdit('value', res.warehouseId, this.allWareHouses, 'Warehouse', 'WarehouseId', 'Name');
        this.getInactiveObjectOnEdit('value', res.locationId, this.allLocations, 'Location', 'LocationId', 'Name');
        this.getInactiveObjectOnEdit('value', res.shelfId, this.allShelfs, 'Shelf', 'ShelfId', 'Name');
        this.getInactiveObjectOnEdit('value', res.binId, this.allBins, 'Bin', 'BinId', 'Name');

    }
    getObtainOwnerTraceOnEdit(res) {
        if (res.obtainFromTypeId == this.customerModuleId) {
            this.receivingForm.obtainFrom = { 'customerId': res.obtainFrom, 'name': res.obtainFromName ,'label': res.obtainFromName, 'value': res.obtainFrom };
        }
        else if (res.obtainFromTypeId == this.vendorModuleId) {
            this.receivingForm.obtainFrom = { 'label': res.obtainFromName, 'value': res.obtainFrom };
        }
        else if (res.obtainFromTypeId == this.companyModuleId) {
            this.receivingForm.obtainFrom = { 'label': res.obtainFromName, 'value': res.obtainFrom };
        }
        else if (res.obtainFromTypeId == this.otherModuleId ) {
            this.receivingForm.obtainFrom = res.obtainFrom;
        }
        if (res.ownerTypeId == this.customerModuleId) {
            this.receivingForm.owner = { 'customerId': res.owner, 'name': res.ownerName,'label': res.ownerName, 'value': res.owner  };
        }
        else if (res.ownerTypeId == this.vendorModuleId) {
            this.receivingForm.owner = { 'label': res.ownerName, 'value': res.owner };
        }
        else if (res.ownerTypeId == this.companyModuleId) {
            this.receivingForm.owner = { 'label': res.ownerName, 'value': res.owner };
        }
        else if (res.ownerTypeId == this.otherModuleId ) {
            this.receivingForm.owner = res.owner;
        }
        if (res.traceableToTypeId == this.customerModuleId) {
            this.receivingForm.traceableTo = { 'customerId': res.traceableTo, 'name': res.tracableToName,'label': res.tracableToName, 'value': res.traceableTo };
        }
        else if (res.traceableToTypeId == this.vendorModuleId) {
            this.receivingForm.traceableTo = { 'label': res.tracableToName, 'value': res.traceableTo };
        }
        else if (res.traceableToTypeId == this.companyModuleId) {
            this.receivingForm.traceableTo = { 'label': res.tracableToName, 'value': res.traceableTo };
        }
        else if (res.traceableToTypeId == this.otherModuleId) {
            this.receivingForm.traceableTo = res.traceableTo;
        }
        //------------------------------------------- added    
        if (res.taggedByType == this.customerModuleId) {
            this.receivingForm.taggedById = { 'customerId': res.taggedById, 'name': res.taggedBy ,'label': res.taggedBy, 'value': res.taggedById };
        }
        else if (res.taggedByType == this.vendorModuleId) {
            this.receivingForm.taggedById = { 'label': res.taggedBy, 'value': res.taggedById };
        }
        else if (res.taggedByType == this.companyModuleId) {
            this.receivingForm.taggedById = { 'label': res.taggedBy, 'value': res.taggedById };
        }
        else if (res.taggedByType == this.otherModuleId ) {
            this.receivingForm.taggedBy = res.taggedBy;
        }
    }

    getInactiveObjectOnEdit(string, id, originalData, tableName, primaryColumn, description) {
        if (id) {
            for (let i = 0; i < originalData.length; i++) {
                if (originalData[i][string] == id) {
                    return id;
                }
            }
            let obj: any = {};
            this.commonService.smartDropDownGetObjectById(tableName, primaryColumn, description, primaryColumn, id,this.authService.currentUser.masterCompanyId).subscribe(res => {
                obj = res[0];
                if (tableName == 'Site') {
                    obj.siteId = obj.value,
                        obj.name = obj.label,
                        this.allSites = [...originalData, obj];
                }
                else if (tableName == 'Warehouse') {
                    obj.warehouseId = obj.value,
                        obj.name = obj.label,
                        this.allWareHouses = [...originalData, obj];
                }
                else if (tableName == 'Location') {
                    obj.locationId = obj.value,
                        obj.name = obj.label,
                        this.allLocations = [...originalData, obj];
                }
                else if (tableName == 'Shelf') {
                    obj.shelfId = obj.value,
                        obj.name = obj.label,
                        this.allShelfs = [...originalData, obj];
                }
                else if (tableName == 'Bin') {
                    obj.binId = obj.value,
                        obj.name = obj.label,
                        this.allBins = [...originalData, obj];
                }
            });
            return id;
        } else {
            return null;
        }
    }
    

    getStockStatus(value) {
        this.disableUpdateButton = false;
        if (value == 0) {
            this.receivingForm.isCustomerStock = true;
        } else {
            this.receivingForm.isCustomerStock = false;
        }
    }

    private Purchaseunitofmeasure() {
		this.commonService.smartDropDownList('UnitOfMeasure', 'unitOfMeasureId', 'shortname','','', 0,this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
			this.allPurchaseUnitOfMeasureinfo = res;
		})
	}


    getTimeLifeOnEdit(timeLifeId) {
        this.stocklineService.getStockLineTimeLifeList(timeLifeId).subscribe(res => {
            //this.sourceTimeLife = res[0];           
            this.sourceTimeLife = this.getTimeLifeDetails(res[0]);
        });
    }

    filterEmployees(event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadEmployeeData(event.query);
        }else{
            this.loadEmployeeData('');
        }
    }

    filterCustomerNames(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getCustomers(event.query, 2);
        }else{
            this.getCustomers('', 2);
        }
    }

    filterCustNames(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getCustomers(event.query, 1);
        }else{
            this.getCustomers('', 1);
        }
    }
    
    getCustomers(strText = '', type) {
        this.arrayCustlist = [];
        if (this.isEditMode == true) {
            this.arrayCustlist.push(this.receivingForm.traceableTo ? this.receivingForm.traceableTo.customerId :0,
                this.receivingForm.owner ? this.receivingForm.owner.customerId :0,
                this.receivingForm.obtainFrom ? this.receivingForm.obtainFrom.customerId :0,
                this.receivingForm.customerId ? this.receivingForm.customerId.customerId :0,
                this.receivingForm.taggedById ? this.receivingForm.taggedById.customerId :0 );  
        } else { 
            this.arrayCustlist.push(0);
        }

        this.commonService.autoCompleteSmartDropDownCustomerList(this.customerTypeId, strText, true, 20, this.arrayCustlist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.allCustomersInfo = res.map(x => {
                return {
                    ...x,
                    customerId: x.customerId,
                    name: x.customerName
                }
            });
            this.customerNamesInfo = this.allCustomersInfo;
            this.customersList = this.allCustomersInfo;
            if (this.isEditMode && type == 1) {
                this.onSelectCustomeronEdit(this.customerId);
            }
        });
    }
    
    onFilterWorkScope(value) {
        this.getworkScope(value);
    }

    getworkScope(strText = '') {
        this.arrayCustlist = [];
        if (this.isEditMode == true) {
            this.arrayCustlist.push(this.receivingForm.workScopeId ? this.receivingForm.workScopeId : 0);
        } else {
            this.arrayCustlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('WorkScope', 'WorkScopeId', 'WorkScopeCode', strText, true, 20, this.arrayCustlist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.workScopeList = res;
        });
    }

    filterCustCodes(event) {
        this.customerCodesInfo = this.allCustomersInfo;

        if (event.query !== undefined && event.query !== null) {
            const customers = [...this.allCustomersInfo.filter(x => {
                return x.customerCode.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.customerCodesInfo = customers;
        }
    }

    filterCustContacts(event) {
        this.customerContactInfo = this.customerContactList;

        if (event.query !== undefined && event.query !== null) {
            const customers = [...this.customerContactList.filter(x => {
                return x.customerContact.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.customerContactInfo = customers;
        }
    }

    filterCustContactPhone(event) {
        this.customerPhoneInfo = this.customerContactList;

        if (event.query !== undefined && event.query !== null) {
            const customers = [...this.customerContactList.filter(x => {
                return x.workPhone.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.customerPhoneInfo = customers;
        }
    }

    private loadSiteData(from) {
        if (this.isEditCustomerWork == false) {
            this.managementStructureId = this.authService.currentUser.managementStructureId;
        }
        if (from == 'fromstructure') {
            this.managementStructureId = this.receivingForm.managementStructureId;
        }
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.receivingForm.siteId ? this.receivingForm.siteId : 0);

        } else {
            this.setEditArray.push(0);
        }
        const strText = '';
        this.commonService.autoSuggestionSmartDropDownList('Site', 'SiteId', 'Name', strText, true, 20, this.setEditArray.join(), this.currentUserMasterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.allSites = res.map(x => {
                    return {
                        siteId: x.value,
                        name: x.label,
                        ...x
                    }
                });
            }
        })
    }

    siteValueChange(siteId) {
        this.allWareHouses = [];
        this.allLocations = [];
        this.allShelfs = [];
        this.allBins = [];
        this.commonService.smartDropDownList('Warehouse', 'WarehouseId', 'Name', 'SiteId', siteId,0,this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.allWareHouses = res.map(x => {
                return {

                    warehouseId: x.value,
                    name: x.label,
                    ...x
                }
            });
        })
        this.onChangeSiteName();
    }

    onChangeSiteName() {
        if (this.receivingForm.siteId != 0) {
            this.disableSite = false;
        } else {
            this.disableSite = true;
        }
    }

    wareHouseValueChange(warehouseId) {
        this.allLocations = [];
        this.allShelfs = [];
        this.allBins = [];
        if (warehouseId != 0) {

            this.commonService.smartDropDownList('Location', 'LocationId', 'Name', 'WarehouseId', warehouseId,0,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.allLocations = res.map(x => {
                    return {

                        locationId: x.value,
                        name: x.label,
                        ...x
                    }
                });
            })

        } else {
            this.allLocations = [];
        }
    }

    locationValueChange(locationId) {
        this.allShelfs = [];
        this.allBins = [];
        if (locationId != 0) {
            this.commonService.smartDropDownList('Shelf', 'ShelfId', 'Name', 'LocationId', locationId,0,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.allShelfs = res.map(x => {
                    return {

                        shelfId: x.value,
                        name: x.label,
                        ...x
                    }
                });
            })

        } else {
            this.allShelfs = [];
        }
    }

    shelfValueChange(shelfId) {
        this.allBins = [];
        if (shelfId != 0) {
            this.commonService.smartDropDownList('Bin', 'BinId', 'Name', 'ShelfId', shelfId,0,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.allBins = res.map(x => {
                    return {
                        binId: x.value,
                        name: x.label,
                        ...x
                    }
                });
            })

        } else {
            this.allBins = [];
        }
    }

    onAddTextAreaInfo(value) {
        if (value == 'memo') {
            this.textAreaLabel = 'Memo';
            this.textAreaInfo = this.receivingForm.memo;
        }
    }

    onSaveTextAreaInfo() {
        if (this.textAreaLabel == 'Memo') {
            this.receivingForm.memo = this.textAreaInfo;
        }
    }

    onSelectCustomer(value) {
        if (this.isEditCustomerWork == false) {
            this.receivingForm.obtainFrom = value;
            this.receivingForm.owner = value;
            this.receivingForm.traceableTo = value;
            this.receivingForm.taggedById = value;
        }
        this.receivingForm.customerId = value;
        this.isgotoWO=false;
        this.customerWarningListId=this.customerRcWaringListId;
        this.customerWarnings(value.customerId);
        this.getAllCustomerContact(value.customerId,'select');
        this.customergenericinformation(value.customerId);
    }

    customergenericinformation(id) {
        this.commonService.customergenericinformation(id,this.authService.currentUser.masterCompanyId).subscribe(res => {
            if (res) {
                this.receivingForm.customerCode = res[0].customerCode;
            }
        })
    }

    onSelectCustomerContact(value) {
        this.receivingForm.customerPhone = value;
        this.receivingForm.customerContactId = value;
    }

    onSelectCustomerContactPhone(value) {
        this.receivingForm.customerPhone = value;
    }

    onSelectCustomeronEdit(id) {
        const customerObj = getObjectById('customerId', id, this.allCustomersInfo);
        this.getAllCustomerContact(id,'edit');
    }

    getAllCustomerContact(id,from) {
        if (id) {
            this.setEditArray = [];
            if (this.isEditMode == true) {
                this.setEditArray.push(this.receivingForm.customerContactId ? this.receivingForm.customerContactId.customerContactId : 0);
            } else {
                this.setEditArray.push(0);
            }
            const strText = '';
            this.commonService.autoDropListCustomerContacts(id, strText, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.customerContactList = res.map(x => {
                    return {
                        ...x,
                        customerContact: x.customerContactName,
                        workPhone: `${x.workPhone} ${x.workPhoneExtn}`
                    }
                });
                const isDefaultContact = this.customerContactList.filter(x => {
                    if (x.isDefaultContact === true) {
                        return x;
                    }; //else return x;
                })
                if(from !="formEditapi"){

                    this.receivingForm.customerContactId = isDefaultContact[0];
                    this.receivingForm.customerPhone = isDefaultContact[0];
                }
                else{
                    if(this.receivingForm.customerContactId != undefined && this.receivingForm.customerContactId != '' && this.receivingForm.customerContactId != null){
                        this.receivingForm.customerPhone={'workPhone':this.receivingForm.contactPhone,'customerContactId':this.receivingForm.customerContactId}
                    }else{
                        this.receivingForm.customerContactId = this.customerContactList[0];
                        this.receivingForm.customerPhone = this.customerContactList[0];
                        
                    }
                }
            });
        }
    }

    onPartNumberSelected(value,from) {
        if (from=='html' ) {
            this.disableUpdateButton = false;
            this.receivingForm.partNumber = value.label;
            this.receivingForm.partDescription = value.partDescription;
            this.receivingForm.manufacturerId = value.manufacturerId;
            this.receivingForm.manufacturer = value.manufacturer;
            this.receivingForm.revisedPart = value.revisedPart;
            this.receivingForm.isSerialized = value.isSerialized;
            this.receivingForm.isTimeLife = value.isTimeLife;
            this.receivingForm.itemGroup = value.itemGroup;
            this.receivingForm.purchaseUnitOfMeasureId =  this.getInactiveObjectOnEdit('value', value.unitOfMeasureId, this.allPurchaseUnitOfMeasureinfo, 'UnitOfMeasure', 'unitOfMeasureId', 'shortname');
        
        }
    }
    resetSerialNoTimeLife() {
        this.receivingForm.isSkipSerialNo = false;
        this.receivingForm.serialNumber = '';
        this.receivingForm.isSkipTimeLife = false;
        this.receivingForm.timeLifeDate = null;
        this.receivingForm.timeLifeOrigin = '';
        this.sourceTimeLife = {};
    }

    resetSerialNo() {
        this.receivingForm.serialNumber = '';
    }

    resetTimelife() {
        this.receivingForm.timeLifeDate = null;
        this.receivingForm.timeLifeOrigin = '';
        this.sourceTimeLife = {};
    }

    onSelectObrainFrom(value) {     
        this.receivingForm.obtainFrom = undefined;
        this.receivingForm.obtainFromTypeId = value;
    }

    onSelectTaggedType(value) {     
        this.receivingForm.taggedById = undefined;
        this.receivingForm.taggedByType = value;
    }

    onSelectOwner(value) {
        this.receivingForm.owner = undefined;
        this.receivingForm.ownerTypeId = value;
    }

    onSelectTraceableTo(value) {
        this.receivingForm.traceableTo = undefined;
        this.receivingForm.traceableToTypeId = value;
    }

    onSelectCondition() {
        if (this.receivingForm.conditionId != 0) {
            this.disableCondition = false;
        } else {
            this.disableCondition = true;
        }
    }

    removeFile(event) {
    }

    restrictMinus(e) {
        var inputKeyCode = e.keyCode ? e.keyCode : e.which;
        if (inputKeyCode != null) {
            if (inputKeyCode == 45) e.preventDefault();
        }
    }

    getIdFromArrayOfObjectByValue(field: string, idField: string, name: any, originalData: any) {
        if ((field !== '' && field !== undefined) && (idField !== '' && idField !== undefined) && (name !== '' && name !== undefined) && (originalData !== undefined && originalData.length > 0)) {
            const data = originalData.filter(x => {
                if (x[idField].toLowerCase() === name.toLowerCase()) {
                    return x;
                }
            })
            return data[0][field];
        }
    }
   
    onSaveCustomerReceiving() {
        this.gettagTypeIds = [];
        const timeLife = this.getTimeLife(this.sourceTimeLife);


        const receivingForm = {
            ...this.receivingForm,
            customerId: getValueFromObjectByKey('customerId', this.receivingForm.customerId),
            purchaseUnitOfMeasureId: this.receivingForm.purchaseUnitOfMeasureId > 0 ? this.receivingForm.purchaseUnitOfMeasureId : null,
            customerContactId: getValueFromObjectByKey('customerContactId', this.receivingForm.customerContactId),
            mfgDate: this.receivingForm.mfgDate ? this.datePipe.transform(this.receivingForm.mfgDate, "MM/dd/yyyy") : '',
            certifiedDate: this.receivingForm.certifiedDate ? this.datePipe.transform(this.receivingForm.certifiedDate, "MM/dd/yyyy") : '',
            inspectedDate: this.receivingForm.inspectedDate ? this.datePipe.transform(this.receivingForm.inspectedDate, "MM/dd/yyyy") : '',
            receivedDate: this.receivingForm.receivedDate ? this.datePipe.transform(this.receivingForm.receivedDate, "MM/dd/yyyy") : '',
            expDate: this.receivingForm.expDate ? this.datePipe.transform(this.receivingForm.expDate, "MM/dd/yyyy") : '',
            tagDate: this.receivingForm.tagDate ? this.datePipe.transform(this.receivingForm.tagDate, "MM/dd/yyyy") : '',
            custReqDate: this.receivingForm.custReqDate ? this.datePipe.transform(this.receivingForm.custReqDate, "MM/dd/yyyy") : '',
            timeLifeDate: this.receivingForm.timeLifeDate ? this.datePipe.transform(this.receivingForm.timeLifeDate, "MM/dd/yyyy") : '',
            itemMasterId: this.receivingForm.itemMasterId ? editValueAssignByCondition('value', this.receivingForm.itemMasterId) : '',
            employeeId: this.receivingForm.employeeId ? editValueAssignByCondition('value', this.receivingForm.employeeId) : '',
            createdBy: this.userName,
            updatedBy: this.userName,
            masterCompanyId: this.authService.currentUser.masterCompanyId,
            warehouseId: this.receivingForm.warehouseId != 0 ? this.receivingForm.warehouseId : null,
            locationId: this.receivingForm.locationId ? this.receivingForm.locationId : null,
            binId: this.receivingForm.binId != 0 ? this.receivingForm.binId : null,
            shelfId: this.receivingForm.shelfId != 0 ? this.receivingForm.shelfId : null,
            workScopeId: this.receivingForm.workScopeId,
            isSerialized: this.receivingForm.isSerialized ? this.receivingForm.isSerialized : false,
            isTimeLife: this.receivingForm.isTimeLife ? this.receivingForm.isTimeLife : false,
            //timeLife: { ...this.sourceTimeLife, timeLifeCyclesId: this.timeLifeCyclesId, updatedDate: new Date() },
            timeLife: { ...timeLife, timeLifeCyclesId: this.timeLifeCyclesId, updatedDate: new Date() },
            ownerTypeId:this.receivingForm.ownerTypeId==0? null :this.receivingForm.ownerTypeId,
            obtainFromTypeId:this.receivingForm.obtainFromTypeId==0? null :this.receivingForm.obtainFromTypeId,
            traceableToTypeId:this.receivingForm.traceableToTypeId==0? null :this.receivingForm.traceableToTypeId,
            taggedByType : this.receivingForm.taggedByType == 0 ? null :this.receivingForm.taggedByType,
        }        
        var errmessage = '';
        if (this.receivingForm.mfgDate != "" && moment(this.receivingForm.mfgDate, 'MM/DD/YYYY', true).isValid()) {
			if (this.receivingForm.tagDate != "" && moment(this.receivingForm.tagDate, 'MM/DD/YYYY', true).isValid()) {
				if (this.receivingForm.tagDate <= this.receivingForm.mfgDate) {
					this.isSpinnerVisible = false;
					errmessage = errmessage + "Tag Date must be greater than Manufacturing Date."
				}
			}
			if (this.receivingForm.inspectedDate != "" && moment(this.receivingForm.inspectedDate, 'MM/DD/YYYY', true).isValid()) {
				if (this.receivingForm.inspectedDate <= this.receivingForm.mfgDate) {
					this.isSpinnerVisible = false;
					if (errmessage != '') {
						errmessage = errmessage + '<br />' + "Inspection Date must be greater than Manufacturing Date."
					}
					else {
						errmessage = errmessage + "Inspection Date must be greater than Manufacturing Date."
					}
				}
			}
			if (this.receivingForm.certifiedDate != "" && moment(this.receivingForm.certifiedDate, 'MM/DD/YYYY', true).isValid()) {
				if (this.receivingForm.certifiedDate <= this.receivingForm.mfgDate) {
					this.isSpinnerVisible = false;
					if (errmessage != '') {
						errmessage = errmessage + '<br />' + "Certified Date must be greater than Manufacturing Date."
					}
					else {
						errmessage = errmessage + "Certified Date must be greater than Manufacturing Date."
					}
				}
			}
        }
        
        if (errmessage != '') {
			this.isSpinnerVisible = false;
			this.alertService.showStickyMessage("Validation failed", errmessage, MessageSeverity.error, errmessage);
			return;
		}

        const { customerCode, customerPhone, partDescription, manufacturer, revisePartId, ...receivingInfo } = receivingForm;
        this.isSpinnerVisible = true;
        if (!this.isEditMode) {
                receivingInfo.obtainFrom = this.receivingForm.obtainFrom ? editValueAssignByCondition('value', this.receivingForm.obtainFrom) : null;
                receivingInfo.owner = this.receivingForm.owner ? editValueAssignByCondition('value', this.receivingForm.owner) : null;
                receivingInfo.traceableTo = this.receivingForm.traceableTo ? editValueAssignByCondition('value', this.receivingForm.traceableTo) : null;
                receivingInfo.taggedById = this.receivingForm.taggedById ? editValueAssignByCondition('value', this.receivingForm.taggedById) : null;
              
                if (receivingInfo.tagType && receivingInfo.tagType.length > 0) {
                    this.allTagTypes.forEach(element1 => {
                        receivingInfo.tagType.forEach(element2 => {
                            if (element1.value == element2) {
                                this.gettagTypeIds.push(element1.value);
                            }
                        });
                    });
                    receivingInfo.tagTypeIds = this.gettagTypeIds.join();
                    for (let i = 0; i < receivingInfo.tagType.length; i++) {
                        receivingInfo.tagType[i] = getValueFromArrayOfObjectById('label', 'value', receivingInfo.tagType[i], this.allTagTypes);
                    }
                    receivingInfo.tagType = receivingInfo.tagType.join();
                } else {
                    receivingInfo.tagType = "";
                }
              
              
                this.receivingCustomerWorkService.newReason(receivingInfo).subscribe(res => {
                    this.isSpinnerVisible = false;
                    this.customerId = res.customerId;
                    this.receivingCustomerWorkId=res.receivingCustomerWorkId;
                    this.uploadDocs.next(true);
                    $('#workorderpopup').modal('show');
                    this.alertService.showMessage(
                        'Success',
                        `Saved Customer Work Successfully`,
                        MessageSeverity.success
                    );
                }, err => {
                    this.isSpinnerVisible = false;
                });
        }
        else {
        
            receivingInfo.ownerTypeId=(receivingInfo.ownerTypeId==0 || receivingInfo.ownerTypeId==false)? null :receivingInfo.ownerTypeId;
            receivingInfo.obtainFromTypeId=(receivingInfo.obtainFromTypeId==0 || receivingInfo.obtainFromTypeId==false)? null :receivingInfo.obtainFromTypeId;
            receivingInfo.traceableToTypeId=(receivingInfo.traceableToTypeId==0 || receivingInfo.traceableToTypeId==0)? null :receivingInfo.traceableToTypeId;
            receivingInfo.taggedByType =(receivingInfo.taggedByType == 0 || receivingInfo.taggedByType == false) ? null :receivingInfo.taggedByType;

            if(receivingInfo.obtainFromTypeId !=null && receivingInfo.obtainFrom !=null){
                receivingInfo.obtainFrom = (typeof receivingInfo.obtainFrom=='object' )? receivingInfo.obtainFrom.value: receivingInfo.obtainFrom;
            }else{
                receivingInfo.obtainFrom=null;
            }
            if(receivingInfo.ownerTypeId !=null && receivingInfo.owner !=null){
                receivingInfo.owner =  (typeof  receivingInfo.owner=='object')? receivingInfo.owner.value : receivingInfo.owner;
            }else{
                receivingInfo.owner =null
            }
            if(receivingInfo.traceableToTypeId !=null && receivingInfo.traceableTo !=null){
                receivingInfo.traceableTo = (typeof receivingInfo.traceableTo=='object')? receivingInfo.traceableTo.value: receivingInfo.traceableTo;
            }else{
                receivingInfo.traceableTo=null;  
            }

            if(receivingInfo.taggedByType !=null && receivingInfo.taggedById !=null){
                receivingInfo.taggedById = (typeof receivingInfo.taggedById == 'object' )? receivingInfo.taggedById.value: receivingInfo.taggedById;
            }else{
                receivingInfo.taggedById=null;
            }


            if (receivingInfo.tagType && receivingInfo.tagType.length > 0) {
                this.allTagTypes.forEach(element1 => {
                    receivingInfo.tagType.forEach(element2 => {
                        if (element1.value == element2) {
                            this.gettagTypeIds.push(element1.value);
                        }
                    });
                });
                receivingInfo.tagTypeIds = this.gettagTypeIds.join();
                for (let i = 0; i < receivingInfo.tagType.length; i++) {
                    receivingInfo.tagType[i] = getValueFromArrayOfObjectById('label', 'value', receivingInfo.tagType[i], this.allTagTypes);
                }
                receivingInfo.tagType = receivingInfo.tagType.join();
            } else {
                receivingInfo.tagType = "";
            }


            this.receivingCustomerWorkService.updateCustomerWorkReceiving(receivingInfo).subscribe(res => {
                this.receivingCustomerWorkId=res.receivingCustomerWorkId;
                this.uploadDocs.next(true);
                $('#workorderpopup').modal('show');
                this.alertService.showMessage(
                    'Success',
                    `Updated Customer Work Successfully`,
                    MessageSeverity.success
                );
            }, err => {
                this.isSpinnerVisible = false;
            });
        }
    }
    // customerWOWaringListId:any;
    // customerRcWaringListId:any;
    goToWorkOrder() {
        // this.router.navigateByUrl(`/workordersmodule/workorderspages/app-work-order-receivingcustworkid/${this.receivingCustomerWorkId}`);
        this.isgotoWO=true;
        this.customerWarningListId=this.customerWOWaringListId;
        console.log("wo Changes",this.customerWOWaringListId);
        
        this.customerResctrictions(this.customerId);
       
   
    }

    goToCustomerWorkList() {
        this.router.navigateByUrl('/receivingmodule/receivingpages/app-customer-works-list');
    }
    customerWOWaringListId:any;
    customerRcWaringListId:any;
    isgotoWO:boolean=false;
    getCustomerWarningsList(): void {
        // const strText='Receive MPN';
        const strText='';
        this.isgotoWO=false;
        this.setEditArray.push(0);
        this.commonService.autoSuggestionSmartDropDownList('CustomerWarningType', 'CustomerWarningTypeId', 'Name', strText, true, 20, this.setEditArray.join(), this.currentUserMasterCompanyId).subscribe(res => {
         res.forEach(element => {
                if (element.label == 'Receive MPN') {
                    this.customerWarningListId = element.value;
                    this.customerRcWaringListId=element.value;
                    // return;
                }
                if (element.label == 'Create WO for MPN') {
                    this.customerWarningListId = element.value;
                    this.customerWOWaringListId=element.value;
                    // return;
                }
            });
        })
    }

    customerWarnings(customerId,) {
        this.isgotoWO=false;
        if (customerId && this.customerWarningListId) {
            this.warningMessage = '';
            this.commonService.customerWarnings(customerId, this.customerWarningListId).subscribe((res: any) => {
                if (res) {
                    this.warningMessage = res.warningMessage;
                    this.warningID = res.customerWarningId;
                }
                if (this.isEditCustomerWork == false) {
                    this.customerResctrictions(customerId);
                } else {
                    if (this.warningID != 0) {
                        this.showAlertMessage();
                    }
                    this.restrictID = 0
                }
            })
        }
    }

    customerResctrictions(customerId) {
        this.restrictMessage = '';
        console.log("wo Changes",customerId,this.customerWarningListId);
        if (customerId && this.customerWarningListId) {
            this.commonService.customerResctrictions(customerId, this.customerWarningListId).subscribe((res: any) => {
                if (res) {
                    this.restrictMessage = res.restrictMessage;
                    this.restrictID = res.customerWarningId;
                }
                if( this.restrictMessage =='' && this.isgotoWO==true){
                    this.router.navigateByUrl(`/workordersmodule/workorderspages/app-work-order-receivingcustworkid/${this.receivingCustomerWorkId}`);
                  }
                if (this.warningID != 0 && this.restrictID == 0) {
                    this.showAlertMessage();
                } else if (this.warningID == 0 && this.restrictID != 0) {
                    this.showAlertMessage();
                } else if (this.warningID != 0 && this.restrictID != 0) {
                    this.showAlertMessage();
                } else if (this.warningID == 0 && this.restrictID == 0) {

                }
            })
        }
    }

    showAlertMessage() {
        $('#warnRestrictMesg').modal("show");
   }

    WarnRescticModel() {
        this.isEditCustomerWork = false;
        $('#warnRestrictMesg').modal("hide");
        this.warningMessage = '';
        this.restrictMessage = '';

        if (this.restrictID != 0) {
            this.receivingForm.customerCode = null;
            this.receivingForm.customerId = null;
            this.receivingForm.customerId = null;
            this.receivingForm.customerContactId = null;
            this.receivingForm.customerPhone = null;
            if(this.isgotoWO==true){
                this.router.navigateByUrl('/receivingmodule/receivingpages/app-customer-works-list');
              }
        }else{
            if(this.isgotoWO==true){
                this.router.navigateByUrl(`/workordersmodule/workorderspages/app-work-order-receivingcustworkid/${this.receivingCustomerWorkId}`);
              }
            //   else{ 
            //         this.router.navigateByUrl('/receivingmodule/receivingpages/app-customer-works-list');
               
            //   }
        }
   
    }

    closeMyModel(type) {
        $(type).modal("hide");
    }

    enableSave() {
        if (this.isEditMode == true) {
            this.disableSave = false;
        }
    }

    dismissModel() {
        this.modal.close();
    }

    getManagementStructureDetails(id, empployid = 0, editMSID = 0) {
        empployid = empployid == 0 ? this.employeeId : empployid;
        editMSID = this.isEditMode ? editMSID = id : 0;
        this.commonService.getManagmentStrctureData(id, empployid, editMSID,this.authService.currentUser.masterCompanyId).subscribe(response => {
            if (response) {
                const result = response;
                if (result[0] && result[0].level == 'Level1') {
                    this.legalEntityList = result[0].lstManagmentStrcture;
                    this.managementStructure.companyId = result[0].managementStructureId;
                    this.receivingForm.managementStructureId = result[0].managementStructureId;
                    this.managementStructure.buId = 0;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.businessUnitList = [];
                    this.divisionList = [];
                    this.departmentList = [];
                } else {
                    this.managementStructure.companyId = 0;
                    this.managementStructure.buId = 0;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.legalEntityList = [];
                    this.businessUnitList = [];
                    this.divisionList = [];
                    this.departmentList = [];
                }
                if (result[1] && result[1].level == 'Level2') {
                    this.businessUnitList = result[1].lstManagmentStrcture;
                    this.managementStructure.buId = result[1].managementStructureId;
                    this.receivingForm.managementStructureId = result[1].managementStructureId;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.divisionList = [];
                    this.departmentList = [];
                } else {
                    if (result[1] && result[1].level == 'NEXT') {
                        this.businessUnitList = result[1].lstManagmentStrcture;
                    }
                    this.managementStructure.buId = 0;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.divisionList = [];
                    this.departmentList = [];
                }

                if (result[2] && result[2].level == 'Level3') {
                    this.divisionList = result[2].lstManagmentStrcture;
                    this.managementStructure.divisionId = result[2].managementStructureId;
                    this.receivingForm.managementStructureId = result[2].managementStructureId;
                    this.managementStructure.departmentId = 0;
                    this.departmentList = [];
                } else {
                    if (result[2] && result[2].level == 'NEXT') {
                        this.divisionList = result[2].lstManagmentStrcture;
                    }
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.departmentList = [];
                }

                if (result[3] && result[3].level == 'Level4') {
                    this.departmentList = result[3].lstManagmentStrcture;;
                    this.managementStructure.departmentId = result[3].managementStructureId;
                    this.receivingForm.managementStructureId = result[3].managementStructureId;
                } else {
                    this.managementStructure.departmentId = 0;
                    if (result[3] && result[3].level == 'NEXT') {
                        this.departmentList = result[3].lstManagmentStrcture;
                    }
                }
            }
        });
    }

    selectedLegalEntity(legalEntityId,from) {
        if (legalEntityId) {
            this.managementStructure.companyId = legalEntityId;
            this.receivingForm.managementStructureId = legalEntityId;
            this.commonService.getManagementStructurelevelWithEmployee(legalEntityId, this.employeeId,0,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.businessUnitList = res;
                this.managementStructure.buId = 0;
                this.managementStructure.divisionId = 0;
                this.managementStructure.departmentId = 0;
            })
            this.disableMagmtStruct = false;
        } else {
            this.disableMagmtStruct = true;
        }
    }

    getEmployeebylegalentity(id) {
    }

    selectedBusinessUnit(businessUnitId,from) {
        if (businessUnitId) {
            this.managementStructure.buId = businessUnitId;
            this.receivingForm.managementStructureId = businessUnitId;
            this.commonService.getManagementStructurelevelWithEmployee(businessUnitId, this.employeeId,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.divisionList = res;
                this.managementStructure.divisionId = 0;
                this.managementStructure.departmentId = 0;
            })
        }
    }

    selectedDivision(divisionId,from) {
        if (divisionId) {
            this.managementStructure.divisionId = divisionId;
            this.receivingForm.managementStructureId = divisionId;
            this.commonService.getManagementStructurelevelWithEmployee(divisionId, this.employeeId,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.departmentList = res;
                this.managementStructure.departmentId = 0;
            })
        }
    }

    selectedDepartment(departmentId,from) {
        if (departmentId) {
            this.managementStructure.departmentId = departmentId;
            this.receivingForm.managementStructureId = departmentId;
        }
    }

    onClickMemo() {
        $('#textareapopup').modal('show');
        this.memoPopupContent = this.receivingForm.memo;
    }

    onClickPopupSave() {
        this.receivingForm.memo = this.memoPopupContent;
        this.memoPopupContent = '';
        $('#textareapopup').modal("hide");
        this.disabledMemo = true;
        this.disableUpdateButton = false;
    }

    closeMemoModel() {
        $('#textareapopup').modal("hide");
        this.disabledMemo = true;
    }
    
    enableSaveMemo() {
        this.disabledMemo = false;
    }
    
    parsedText(text) {
        if (text) {
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
        }
    }
    changeOfStatus(status){
        this.disableUpdateButton=false;
    }

    getWorkOrderDefaultSetting() {
          this.commonService.workOrderDefaultSettings(this.currentUserMasterCompanyId, 1).subscribe(res => {         
            this.receivingForm.siteId=res[0].defaultSiteId;
            this.receivingForm.warehouseId=res[0].defaultWearhouseId;
            this.receivingForm.locationId=res[0].defaultLocationId;
            this.receivingForm.shelfId=res[0].defaultShelfId;
            this.receivingForm.binId=res[0].defaultBinId;
            this.receivingForm.conditionId=res[0].defaultConditionId;
            if (!this.receivingCustomerWorkId) {
                this.receivingForm.conditionId = this.receivingForm.conditionId?  this.receivingForm.conditionId : this.allConditionInfo[0].conditionId;
                this.onSelectCondition()
            }
            this.loadSiteData('fromOnload');
            this.siteValueChange(this.receivingForm.siteId)
            this.wareHouseValueChange( this.receivingForm.warehouseId)
            this.locationValueChange(this.receivingForm.locationId)
            this.shelfValueChange(this.receivingForm.shelfId)
          })
      }

      getTimeLifeDetails(x) {		
		let timeLife: TimeLifeDraftData = new TimeLifeDraftData();                      
		timeLife.timeLifeCyclesId = x.timeLifeCyclesId;
        timeLife.cyclesRemainingHrs = x.cyclesRemaining ? x.cyclesRemaining.split(':')[0] : null;
		timeLife.cyclesRemainingMin = x.cyclesRemaining ? x.cyclesRemaining.split(':')[1] : null;				
        timeLife.cyclesSinceInspectionHrs = x.cyclesSinceInspection ? x.cyclesSinceInspection.split(':')[0] : null;
		timeLife.cyclesSinceInspectionMin = x.cyclesSinceInspection ? x.cyclesSinceInspection.split(':')[1] : null;				
        timeLife.cyclesSinceNewHrs = x.cyclesSinceNew ? x.cyclesSinceNew.split(':')[0] : null;
		timeLife.cyclesSinceNewMin = x.cyclesSinceNew ? x.cyclesSinceNew.split(':')[1] : null;				
        timeLife.cyclesSinceOVHHrs = x.cyclesSinceOVH ? x.cyclesSinceOVH.split(':')[0] : null;
		timeLife.cyclesSinceOVHMin = x.cyclesSinceOVH ? x.cyclesSinceOVH.split(':')[1] : null;				
        timeLife.cyclesSinceRepairHrs = x.cyclesSinceRepair ? x.cyclesSinceRepair.split(':')[0] : null;
		timeLife.cyclesSinceRepairMin = x.cyclesSinceRepair ? x.cyclesSinceRepair.split(':')[1] : null;			
        timeLife.timeRemainingHrs = x.timeRemaining ? x.timeRemaining.split(':')[0] : null;
		timeLife.timeRemainingMin = x.timeRemaining ? x.timeRemaining.split(':')[1] : null;
        timeLife.timeSinceInspectionHrs = x.timeSinceInspection ? x.timeSinceInspection.split(':')[0] : null;
		timeLife.timeSinceInspectionMin = x.timeSinceInspection ? x.timeSinceInspection.split(':')[1] : null;				
        timeLife.timeSinceNewHrs = x.timeSinceNew ? x.timeSinceNew.split(':')[0] : null;
		timeLife.timeSinceNewMin = x.timeSinceNew ? x.timeSinceNew.split(':')[1] : null;				
        timeLife.timeSinceOVHHrs = x.timeSinceOVH ? x.timeSinceOVH.split(':')[0] : null;
		timeLife.timeSinceOVHMin = x.timeSinceOVH ? x.timeSinceOVH.split(':')[1] : null;				
        timeLife.timeSinceRepairHrs = x.timeSinceRepair ? x.timeSinceRepair.split(':')[0] : null;
		timeLife.timeSinceRepairMin = x.timeSinceRepair ? x.timeSinceRepair.split(':')[1] : null;	
        timeLife.lastSinceInspectionHrs = x.lastSinceInspection ? x.lastSinceInspection.split(':')[0] : null;
		timeLife.lastSinceInspectionMin = x.lastSinceInspection ? x.lastSinceInspection.split(':')[1] : null;				
        timeLife.lastSinceNewHrs = x.lastSinceNew ? x.lastSinceNew.split(':')[0] : null;
		timeLife.lastSinceNewMin = x.lastSinceNew ? x.lastSinceNew.split(':')[1] : null;				
        timeLife.lastSinceOVHHrs = x.lastSinceOVH ? x.lastSinceOVH.split(':')[0] : null;
        timeLife.lastSinceOVHMin = x.lastSinceOVH ? x.lastSinceOVH.split(':')[1] : null;           
        return timeLife;
	}

	getTimeLife(x) {
		let timeLife: TimeLifeDraftData = new TimeLifeDraftData(); 
        timeLife.timeLifeCyclesId = this.timeLifeCyclesId > 0 ? this.timeLifeCyclesId : null; 
        timeLife.masterCompanyId = this.authService.currentUser.masterCompanyId;
        timeLife.stockLineId = this.stockLineId > 0 ? this.stockLineId : 0 ;
		timeLife.cyclesRemaining = ((x.cyclesRemainingHrs ? x.cyclesRemainingHrs : '00') + ':' + (x.cyclesRemainingMin ? x.cyclesRemainingMin : '00'));
		timeLife.timeRemaining = ((x.timeRemainingHrs ? x.timeRemainingHrs : '00') + ':' + (x.timeRemainingMin ? x.timeRemainingMin : '00'));
		timeLife.cyclesSinceNew = ((x.cyclesSinceNewHrs ? x.cyclesSinceNewHrs : '00') + ':' + (x.cyclesSinceNewMin ? x.cyclesSinceNewMin : '00'));
		timeLife.timeSinceNew = ((x.timeSinceNewHrs ? x.timeSinceNewHrs : '00') + ':' + (x.timeSinceNewMin ? x.timeSinceNewMin : '00'));
		timeLife.lastSinceNew = ((x.lastSinceNewHrs ? x.lastSinceNewHrs : '00') + ':' + (x.lastSinceNewMin ? x.lastSinceNewMin : '00'));
		timeLife.cyclesSinceOVH = ((x.cyclesSinceOVHHrs ? x.cyclesSinceOVHHrs : '00') + ':' + (x.cyclesSinceOVHMin ? x.cyclesSinceOVHMin : '00'));
		timeLife.timeSinceOVH = ((x.timeSinceOVHHrs ? x.timeSinceOVHHrs : '00') + ':' + (x.timeSinceOVHMin ? x.timeSinceOVHMin : '00'));
		timeLife.lastSinceOVH = ((x.lastSinceOVHHrs ? x.lastSinceOVHHrs : '00') + ':' + (x.lastSinceOVHMin ? x.lastSinceOVHMin : '00'));
		timeLife.cyclesSinceInspection = ((x.cyclesSinceInspectionHrs ? x.cyclesSinceInspectionHrs : '00') + ':' + (x.cyclesSinceInspectionMin ? x.cyclesSinceInspectionMin : '00'));
		timeLife.timeSinceInspection = ((x.timeSinceInspectionHrs ? x.timeSinceInspectionHrs : '00') + ':' + (x.timeSinceInspectionMin ? x.timeSinceInspectionMin : '00'));
		timeLife.lastSinceInspection = ((x.lastSinceInspectionHrs ? x.lastSinceInspectionHrs : '00') + ':' + (x.lastSinceInspectionMin ? x.lastSinceInspectionMin : '00'));
		timeLife.cyclesSinceRepair = ((x.cyclesSinceRepairHrs ? x.cyclesSinceRepairHrs : '00') + ':' + (x.cyclesSinceRepairMin ? x.cyclesSinceRepairMin : '00'));
		timeLife.timeSinceRepair = ((x.timeSinceRepairHrs ? x.timeSinceRepairHrs : '00') + ':' + (x.timeSinceRepairMin ? x.timeSinceRepairMin : '00'));				
        return timeLife;
	}
}
