import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import * as $ from 'jquery';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuItem } from 'primeng/api';//bread crumb
import { AuthService } from '../../../../services/auth.service';
import { ReceivingCustomerWorkService } from '../../../../services/receivingcustomerwork.service';
import { CustomerService } from '../../../../services/customer.service';
import { ConditionService } from '../../../../services/condition.service';
import { BinService } from '../../../../services/bin.service';
import { SiteService } from '../../../../services/site.service';
import { Router, ActivatedRoute } from '@angular/router';
import { getValueFromObjectByKey, getObjectById, editValueAssignByCondition, getValueFromArrayOfObjectById } from '../../../../generic/autocomplete';
import { CommonService } from '../../../../services/common.service';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { StocklineService } from '../../../../services/stockline.service';
import { ConfigurationService } from '../../../../services/configuration.service';
import * as moment from 'moment';
@Component({
    selector: 'app-customer-work-setup',
    templateUrl: './customer-work-setup.component.html',
    styleUrls: ['./customer-work-setup.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})

export class CustomerWorkSetupComponent implements OnInit {
    modal: NgbModalRef;
    receivingForm: any = {};
    isEditMode: boolean = false;
    private onDestroy$: Subject<void> = new Subject<void>();
    breadcrumbs: MenuItem[] = [
        { label: 'Receiving' },
        { label: 'Customer Work' },
        { label: 'Create Customer Work' }
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
    disableFileAttachmentSubmit: boolean = true;
    isDocumentsToShow:boolean=false;
    sourceViewforDocumentListColumns = [
        { field: 'fileName', header: 'File Name' },
    ]
    customerDocumentsColumns = [
        { field: 'docName', header: 'Name' },
        { field: 'docDescription', header: 'Description' },
        { field: 'docMemo', header: 'Memo' },
        { field: 'fileName', header: 'File Name' },
        { field: 'fileSize', header: 'File Size' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedBy', header: 'Updated By' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'updatedDate', header: 'Updated Date' },
           ];
    @ViewChild('fileUploadInput',{static:false}) fileUploadInput: any;
    selectedColumns = this.customerDocumentsColumns;
    sourceViewforDocumentList: any = [];
    sourceViewforDocument: any = [];
    sourceViewforDocumentAudit: any = [];
    isEditButton: boolean = false;
    documentInformation = {
        docName: '',
        docMemo: '',
        docDescription: '',
        attachmentDetailId:0
    }
    selectedFileAttachment: any= [];
    selectedFile: File = null;
    allDocumentListOriginal:any[];
    selectedRowForDelete: any;
    rowIndex: number;
    totalRecordNew: number = 0;
    pageSizeNew: number = 3;
    totalPagesNew: number = 0;
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
    loadingIndicator: boolean;
    formData = new FormData();
    customerWorkDocumentsList: any = [];
    documentTableColumns: any[] = [
        { field: "fileName", header: "File Name" },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'CreatedBy' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'UpdatedBy' },
        { field: 'download', header: 'Download' },
        { field: 'delete', header: 'Delete' },
    ];
    pageSize: number = 5;
    totalRecords: number = 0;
    totalPages: number = 0;
    dates = [];
    date1: any;
    date2: any;
    date3: any;
    customerWarningListId: any;
    restrictMessage: any;
    warningMessage: any;
    warningID: any;
    restrictID: any;
    isEditCustomerWork: boolean = false;
    managementStructureId:any;
    moduleListDropdown: any = [];
    isSpinnerEnable: boolean=false;
    constructor(private commonService: CommonService,
        private customerService: CustomerService,
        private binService: BinService,
        private siteService: SiteService,
        private conditionService: ConditionService,
        private datePipe: DatePipe,
        private _actRoute: ActivatedRoute,
        private modalService: NgbModal,
        private receivingCustomerWorkService: ReceivingCustomerWorkService,
        private authService: AuthService,
        private router: Router,
        private alertService: AlertService,
        private stocklineService: StocklineService,
        private configurations: ConfigurationService) {
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
        this.receivingForm.tagType = null;
        this.receivingForm.quantity = 1;
        this.receivingForm.isCustomerStock = true;
        this.receivingForm.receivedDate = new Date();
    }
    ngOnInit() {
        
        this.loadModulesNamesForObtainOwnerTraceable();
        this.receivingCustomerWorkId = this._actRoute.snapshot.params['id'];
         this.loadEmployeeData();
            this.loadPartNumData('');
            this.getCustomers('');
        // this.loadCustomerData();
        this.loadVendorData();
        this.loadCompanyData();
        this.loadSiteData('fromOnload');
        this.getLegalEntity();
        this.loadConditionData();
        this.loadTagTypes();
        this.getCustomerWarningsList();
        if (this.receivingCustomerWorkId) {
            this.isEditMode = true;
            this.getReceivingCustomerDataonEdit(this.receivingCustomerWorkId);
            this.toGetDocumentsListNew(this.receivingCustomerWorkId);
            this.breadcrumbs = [
                { label: 'Receiving' },
                { label: 'Customer Work' },
                { label: 'Edit Customer Work' }
            ];
        } else {
            this.isSpinnerEnable = true;
            this.getEmployeeData();
            // this.loadEmployeeData();
            // this.loadPartNumData('');
            // this.getCustomers('');
            console.log("create the customer work");
        }
    }
	loadModulesNamesForObtainOwnerTraceable() {
		this.commonService.getModuleListForObtainOwnerTraceable().subscribe(res => {
			this.moduleListDropdown = res;
		})
	}
    get userName(): string {
        return this.authService.currentUser
            ? this.authService.currentUser.userName
            : '';
    }
    // private loadPartNumData() {
    //     this.commonService.smartDropDownList('ItemMaster', 'ItemMasterId', 'partnumber').subscribe(response => {
    //         this.allPartnumbersList = response;
    //     });
    // }
    loadPartNumData(value){
        console.log("value",value)
        this.commonService.getPartnumList(value).subscribe(res=>{
            // console.log("res",res)
            this.allPartnumbersList = res;
        },
        err => {
            // this.isSpinnerVisible = false;
            // this.errorHandling(err);
        }) 
    }
    loadEmployeeData() {
        this.commonService.smartDropDownList('Employee', 'employeeId', 'firstName').subscribe(res => {
            this.allEmployeeList = res;
            if (this.isEditMode) {
                this.receivingForm.employeeId = getObjectById('value', this.receivingForm.employeeId, this.allEmployeeList);
            }
        })
    }
    getEmployeeData() {
        this.receivingForm.employeeId = this.authService.currentEmployee;
        this.selectedLegalEntity(this.authService.currentManagementStructure.levelId1);
        this.selectedBusinessUnit(this.authService.currentManagementStructure.levelId2);
        this.selectedDivision(this.authService.currentManagementStructure.levelId3);
        this.selectedDepartment(this.authService.currentManagementStructure.levelId4);
        this.managementStructure.companyId = this.authService.currentManagementStructure.levelId1;
        this.managementStructure.buId = this.authService.currentManagementStructure.levelId2;
        this.managementStructure.divisionId = this.authService.currentManagementStructure.levelId3;
        this.managementStructure.departmentId = this.authService.currentManagementStructure.levelId4;
    }
    // loadCustomerData() {
    //     this.commonService.smartDropDownList('Customer', 'CustomerId', 'Name').subscribe(response => {
    //         this.allCustomersList = response;
    //     });
    // } 
    loadVendorData() {
        this.commonService.smartDropDownList('Vendor', 'VendorId', 'VendorName').subscribe(response => {
            this.allVendorsList = response;
        });
    }
    loadCompanyData() {
        this.commonService.smartDropDownList('LegalEntity', 'LegalEntityId', 'Name').subscribe(res => {
            this.allCompanyList = res;
        })
    }
    private loadSiteData(from) {

        if(this.isEditCustomerWork==false){
            this.managementStructureId=this.authService.currentUser.managementStructureId;
        }
        if(from=='fromstructure'){
            this.managementStructureId=this.receivingForm.managementStructureId;
        }
        this.commonService.getSitesbymanagementstructrueNew(this.managementStructureId).subscribe(res=>{
            this.allSites = res;
        // if(res && res.length>0){
        //     this.allSites = res.map(x => {
        //         return {
        //             ...x,
        //             siteId: x.originSiteId,
        //             name: x.originName
        //         }
        //     });
        // }
        });
    }
    private loadConditionData() {
        this.commonService.smartDropDownList('Condition', 'ConditionId', 'Description').subscribe(response => {
            this.allConditionInfo = response.map(x => {
                return {
                    ...x,
                    conditionId: x.value,
                    description: x.label
                }
            });
            if (!this.receivingCustomerWorkId) {
                this.receivingForm.conditionId = this.allConditionInfo[0].conditionId
                this.onSelectCondition()
            }
        });
    }
    getLegalEntity() {
        this.commonService.getLegalEntityList().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.legalEntityList = res;
        })
    }
    loadTagTypes() {
        this.commonService.smartDropDownList('TagType', 'TagTypeId', 'Name').subscribe(response => {
            this.allTagTypes = response.map(x => {
                return {
                    ...x,
                    tagTypeId: x.value,
                    name:  x.label
                }
            });
        
        });
    }
    getReceivingCustomerDataonEdit(id) {
        this.isSpinnerEnable = false;
        this.receivingCustomerWorkService.getCustomerWorkdataById(id).subscribe(res => {
            // this.loadPartNumData(res.partNumber);
            this.customerId = res.customerId;
            this.isEditCustomerWork = true;
            this.managementStructureId=res.managementStructureId;
            this.receivingForm.customerContactId = res;
            this.receivingForm.customerPhone = res;
            this.customerWarnings(this.customerId);
            this.receivingForm = {
                ...res,
                itemMasterId: {'itemMasterId':res.itemMasterId , 'partNumber': res.partNumber},
                // itemMasterId: getObjectById('itemMasterId', res.itemMasterId, this.allPartnumbersList),
                tagDate: res.tagDate ? new Date(res.tagDate) : '',
                mfgDate: res.mfgDate ? new Date(res.mfgDate) : '',
                expDate: res.expDate ? new Date(res.expDate) : '',
                receivedDate: res.receivedDate ? new Date(res.receivedDate) : '',
                timeLifeDate: res.timeLifeDate ? new Date(res.timeLifeDate) : '',
                custReqDate: res.custReqDate ? new Date(res.custReqDate) : '',
                customerId: res.customer,
                customerCode: res.customerCode,
                customerContactId:res,
                customerPhone: res
            }; 
            this.isSpinnerEnable = true;
            this.getAllCustomerContact(res.customerId);  
            this.onPartNumberSelected(res);
            this.getManagementStructureOnEdit(res.managementStructureId);
            this.getSiteDetailsOnEdit(res);
            this.getObtainOwnerTraceOnEdit(res);
            if (res.timeLifeCyclesId != null || res.timeLifeCyclesId != 0) {
                this.timeLifeCyclesId = res.timeLifeCyclesId;
                this.getTimeLifeOnEdit(res.timeLifeCyclesId);
            }
            // this.getCustomers(''); 
            this.loadEmployeeData();
            this.onChangeSiteName();
            this.onSelectCondition();
            this.setTagType(res)
        });
    }
    setTagType(res){
        if(this.receivingForm.tagType && this.receivingForm.tagType != '0') {
            this.receivingForm.tagType = this.receivingForm.tagType.toString().split(',');
            for(let i=0; i<this.receivingForm.tagType.length; i++) {
                this.receivingForm.tagType[i] = this.getIdFromArrayOfObjectByValue('value', 'label', this.receivingForm.tagType[i], this.allTagTypes);
            }
        } else {
            this.receivingForm.tagType = [];
        }
    }
    getManagementStructureOnEdit(managementStructureId) {
        this.commonService.getManagementStructureDetails(managementStructureId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.selectedLegalEntity(res.Level1);
            this.selectedBusinessUnit(res.Level2);
            this.selectedDivision(res.Level3);
            this.selectedDepartment(res.Level4);
            this.managementStructure = {
                companyId: res.Level1 !== undefined ? res.Level1 : 0,
                buId: res.Level2 !== undefined ? res.Level2 : 0,
                divisionId: res.Level3 !== undefined ? res.Level3 : 0,
                departmentId: res.Level4 !== undefined ? res.Level4 : 0,
            }
        })
    }
    getSiteDetailsOnEdit(res) {
        this.siteValueChange(res.siteId);
        this.wareHouseValueChange(res.warehouseId);
        this.locationValueChange(res.locationId);
        this.shelfValueChange(res.shelfId);    
    }

    getObtainOwnerTraceOnEdit(res) {
        console.log("legal entity 0",this.allCompanyList);
        if (res.obtainFromTypeId == 1) {
            console.log("legal entity 1");
            // this.receivingForm.obtainFrom = getObjectById('value', parseInt(res.obtainFrom), this.allCustomersInfo);
            this.receivingForm.obtainFrom = {'customerId':res.obtainFrom, 'name':res.obtainFromName};
        }
        
        else if (res.obtainFromTypeId == 2) {
            this.receivingForm.obtainFrom = {'label':res.obtainFromName, 'value': res.obtainFrom };
            // this.receivingForm.obtainFrom = getObjectById('value', parseInt(res.obtainFrom), this.allVendorsList);
            console.log("legal entity", this.receivingForm.obtainFrom);
        }
        else if (res.obtainFromTypeId == 9) {
            this.receivingForm.obtainFrom = {'label':res.obtainFromName, 'value': res.obtainFrom };
            // this.receivingForm.obtainFrom = getObjectById('value', parseInt(res.obtainFrom), this.allCompanyList);
            console.log("legal entity 3",this.receivingForm.obtainFrom);
        }
        else if (res.obtainFromTypeId == 4) {
            console.log("legal entity 4");
            this.receivingForm.obtainFrom = res.obtainFrom;
        }
        if (res.ownerTypeId == 1) {
            // this.receivingForm.owner = getObjectById('value', parseInt(res.owner), this.allCustomersInfo);
            this.receivingForm.owner = {'customerId':res.owner, 'name':res.ownerName};
        }
        else if (res.ownerTypeId == 2) {
            // this.receivingForm.owner = getObjectById('value', parseInt(res.owner), this.allVendorsList);
            this.receivingForm.owner =  {'label': res.ownerName , 'value':res.owner};
        }
        else if (res.ownerTypeId == 9) {
            // this.receivingForm.owner = getObjectById('value', parseInt(res.owner), this.allCompanyList);
            this.receivingForm.owner =  {'label': res.ownerName , 'value':res.owner};
        }
        else if (res.ownerTypeId == 4) {
            this.receivingForm.owner = res.owner;
        }
        if (res.traceableToTypeId == 1) {
            // this.receivingForm.traceableTo = getObjectById('value', parseInt(res.traceableTo), this.allCustomersInfo);
            this.receivingForm.traceableTo = {'customerId':res.traceableTo, 'name':res.tracableToName};
        }
        else if (res.traceableToTypeId == 2) {
            this.receivingForm.traceableTo =  {'label': res.tracableToName , 'value':res.traceableTo};
            // this.receivingForm.traceableTo = getObjectById('value', parseInt(res.traceableTo), this.allVendorsList);
        }
        else if (res.traceableToTypeId == 9) {
            this.receivingForm.traceableTo =  {'label': res.tracableToName , 'value':res.traceableTo};
            // this.receivingForm.traceableTo = getObjectById('value', parseInt(res.traceableTo), this.allCompanyList);
        }
        else if (res.traceableToTypeId == 4) {
            this.receivingForm.traceableTo = res.traceableTo;
        }
        console.log("legal entity 0", this.receivingForm);
    }
    getTimeLifeOnEdit(timeLifeId) {
        this.stocklineService.getStockLineTimeLifeList(timeLifeId).subscribe(res => {
            this.sourceTimeLife = res[0];
        });
    }
    selectedLegalEntity(legalEntityId) {
        this.businessUnitList = [];
        this.divisionList = [];
        this.departmentList = [];
        this.managementStructure.buId = 0;
        this.managementStructure.divisionId = 0;
        this.managementStructure.departmentId = 0;

        if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
            this.receivingForm.managementStructureId = legalEntityId;
            this.loadSiteData('fromstructure');
            this.getEmployeebylegalentity(this.receivingForm.managementStructureId);
            this.commonService.getBusinessUnitListByLegalEntityId(legalEntityId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.businessUnitList = res;
            });
            this.disableMagmtStruct = false;
        } else {
            this.disableMagmtStruct = true;
        }
    }
    getEmployeebylegalentity(id){
// this.commonService.getEmployeeDetailsbylegalentity(id).subscribe(res=>{
//     console.log("res",res);
// })
    }
    selectedBusinessUnit(businessUnitId) {
        this.divisionList = [];
        this.departmentList = [];
        this.managementStructure.divisionId = 0;
        this.managementStructure.departmentId = 0;

        if (businessUnitId != 0 && businessUnitId != null && businessUnitId != undefined) {
            this.receivingForm.managementStructureId = businessUnitId;
            this.commonService.getDivisionListByBU(businessUnitId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.divisionList = res;
            })
        }
    }
    selectedDivision(divisionUnitId) {
        this.departmentList = [];
        this.managementStructure.departmentId = 0;

        if (divisionUnitId != 0 && divisionUnitId != null && divisionUnitId != undefined) {
            this.receivingForm.managementStructureId = divisionUnitId;
            this.commonService.getDepartmentListByDivisionId(divisionUnitId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.departmentList = res;
            })
        }
    }
    selectedDepartment(departmentId) {
        if (departmentId != 0 && departmentId != null && departmentId != undefined) {
            this.receivingForm.managementStructureId = departmentId;
        }
    }
    filterPartNumbers(event) {
        this.partNumbersInfo = this.allPartnumbersList;
        if (event.query !== undefined && event.query !== null) {
            const partNumberFilter = [...this.allPartnumbersList.filter(x => {
                return x.partNumber.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.partNumbersInfo = partNumberFilter;
        }
    }
    filterEmployees(event) {
        this.employeeNames = this.allEmployeeList;

        if (event.query !== undefined && event.query !== null) {
            const empFirstName = [...this.allEmployeeList.filter(x => {
                return x.label.toLowerCase().includes(event.query.toLowerCase());
            })]
            this.employeeNames = empFirstName;
        }
    }
    filterCustomerNames(event) { 
        this.customersList = this.allCustomersInfo;

        if (event.query !== undefined && event.query !== null) {
            const customers = [...this.allCustomersInfo.filter(x => {
                return x.name.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.customersList = customers;
        }
    }

    filterCustNames(event) {
        this.customerNamesInfo = this.allCustomersInfo;

        if (event.query !== undefined && event.query !== null) {
            const customers = [...this.allCustomersInfo.filter(x => {
                return x.name.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.customerNamesInfo = customers;
        }
        if(event.query == null || event.query == ''){
            console.log("filter chck")
            this.getCustomers('');
        }
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
    filterVendorNames(event) {
        this.vendorsList = this.allVendorsList;

        if (event.query !== undefined && event.query !== null) {
            const vendors = [...this.allVendorsList.filter(x => {
                return x.label.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.vendorsList = vendors;
        }
    }
    filterCompanyNames(event) {
        this.companyList = this.allCompanyList;

        if (event.query !== undefined && event.query !== null) {
            const companies = [...this.allCompanyList.filter(x => {
                return x.label.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.companyList = companies;
        }
    }
    siteValueChange(siteId) { 
        this.commonService.getWareHouseDateNew(siteId).subscribe(res => {
            this.allWareHouses = res;
        });
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
        if (warehouseId != 0) {
            this.commonService.getLocationDateNew(warehouseId).subscribe(res => {
                this.allLocations = res;
            });
        } else {
            this.allLocations = [];
        }
    }
    locationValueChange(locationId) {
        if (locationId != 0) {
            this.commonService.getShelfDateNew(locationId).subscribe(res => {
                this.allShelfs = res;
            });
        } else {
            this.allShelfs = [];
        }
    }
    shelfValueChange(shelfId) {
        if (shelfId != 0) {
            this.commonService.getBinDataByIdNew(shelfId).subscribe(res => {
                this.allBins = res; 
                this.allBins = res.map(x => {
                    return {
                        binId: x.shelfId,
                        ...x
                    }
                });
            });
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
        console.log("value",value)
        if(this.isEditCustomerWork==false){        
            console.log("value",value)
            // let object ={label:value.name,value:value.customerId}
            this.receivingForm.obtainFrom=value;
            this.receivingForm.owner=value;
            this.receivingForm.traceableTo=value;
        }
        this.receivingForm.customerId = value;
        this.customerWarnings(value.customerId);
        this.getAllCustomerContact(value.customerId);
        this.customergenericinformation(value.customerId);
    }

    customergenericinformation(id){
this.commonService.customergenericinformation(id).subscribe(res=>{
    
    if(res){
        this.receivingForm.customerCode=res[0].customerCode;
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

    getCustomers(value){ 
        console.log("value",value);
        this.commonService.getcustomerList(value).subscribe(
            results => {
                this.allCustomersInfo = results.map(x => {
                    return {
                        ...x,
                        customerId: x.value,
                        name: x.label
                    }
                });
                if (this.isEditMode) {
                            this.onSelectCustomeronEdit(this.customerId);
                        }
            }) 
    }
    onSelectCustomeronEdit(id) {
        const customerObj = getObjectById('customerId', id, this.allCustomersInfo);
        this.getAllCustomerContact(id);
    }
    getAllCustomerContact(id) {
        if(id){
        this.commonService.getCustomerContactsById(id).subscribe(res => {
            this.customerContactList = res.map(x => {
                return {
                    ...x,
                    customerContact:x.name,
                    workPhone: `${x.workPhone} ${x.workPhoneExtn}`
                }
            });
            const isDefaultContact = this.customerContactList.filter(x => {
                if (x.isDefaultContact === true) {
                    return x;
                } else return x;
            })
            this.receivingForm.customerContactId = isDefaultContact[0];
            this.receivingForm.customerPhone = isDefaultContact[0];
        });
    }
    }
    onPartNumberSelected(value) {
        console.log("value",value)
        this.receivingForm.partNumber=value.partNumber;
        this.commonService.getReceiveCustomerPartDetailsById(value.itemMasterId).subscribe(res => {
            this.receivingForm.partDescription = res.partDescription;  
            this.receivingForm.manufacturerId = res.manufacturerId;
            this.receivingForm.manufacturer = res.manufacturer;
            this.receivingForm.revisePartId = res.revisedPart;
            this.receivingForm.isSerialized = res.isSerialized;
            this.receivingForm.isTimeLife = res.isTimeLife;
            this.receivingForm.itemGroup = res.itemGroup;
            this.calculateExpireDate(res);
        });
    }
    expiryDate: any;
    calculateExpireDate(res) {
        if (this.receivingForm.receivedDate) {
            this.date1 = moment(this.receivingForm.receivedDate, "DD-MM-YYYY").add('days', res.daysReceived);
            this.dates.push(new Date(this.date1))
        } else if (this.receivingForm.tagDate) {
            this.date2 = moment(this.receivingForm.tagDate, "DD-MM-YYYY").add('days', res.tagDays);
            this.dates.push(new Date(this.date2))
        } else if (this.receivingForm.isMFGDate) {
            this.date3 = moment(this.receivingForm.tagDate, "DD-MM-YYYY").add('days', res.manufacturingDays);
            this.dates.push(new Date(this.date2))
        }
        this.dates.push(new Date("2011/06/26"))
        this.dates.push(new Date("2011/06/27"))
        this.dates.push(new Date("2011/06/28"))
        this.expiryDate = new Date(Math.min.apply(null, this.dates));
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
        console.log("valie",value)
        this.receivingForm.obtainFrom = undefined;
        this.receivingForm.obtainFromTypeId=value;
    }
    onSelectOwner(value) {
        this.receivingForm.owner = undefined;
        this.receivingForm.ownerTypeId=value;
    }
    pageIndexChange(event) {
        this.pageSize = event.rows;
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    onSelectTraceableTo(value) {
        this.receivingForm.traceableTo = undefined;
        this.receivingForm.traceableToTypeId=value;
    }
    dateFilterForTable(date, field) {

        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.customerWorkDocumentsList = this.allCustomerFinanceDocumentsListOriginal;
            const data = [...this.customerWorkDocumentsList.filter(x => {
               if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.customerWorkDocumentsList = data;
        } else {
            this.customerWorkDocumentsList = this.allCustomerFinanceDocumentsListOriginal;
        }
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
        // console.log("recevibf",this.receivingForm);

        if(this.receivingForm.tagType && this.receivingForm.tagType.length > 0) {
			for(let i=0; i<this.receivingForm.tagType.length; i++) {
				this.receivingForm.tagType[i] = getValueFromArrayOfObjectById('label', 'value', this.receivingForm.tagType[i], this.allTagTypes);
			}
			this.receivingForm.tagType = this.receivingForm.tagType.join();
		} else {
			this.receivingForm.tagType = "";
		}
        // console.log("recevibf",this.receivingForm);
        const receivingForm = {
            ...this.receivingForm,
            customerId: getValueFromObjectByKey('customerId', this.receivingForm.customerId),
            customerContactId: getValueFromObjectByKey('customerContactId', this.receivingForm.customerContactId),
            mfgDate: this.receivingForm.mfgDate ? this.datePipe.transform(this.receivingForm.mfgDate, "MM/dd/yyyy") : '',
            receivedDate: this.receivingForm.receivedDate ? this.datePipe.transform(this.receivingForm.receivedDate, "MM/dd/yyyy") : '',
            expDate: this.receivingForm.expDate ? this.datePipe.transform(this.receivingForm.expDate, "MM/dd/yyyy") : '',
            tagDate: this.receivingForm.tagDate ? this.datePipe.transform(this.receivingForm.tagDate, "MM/dd/yyyy") : '',
            custReqDate: this.receivingForm.custReqDate ? this.datePipe.transform(this.receivingForm.custReqDate, "MM/dd/yyyy") : '',
            timeLifeDate: this.receivingForm.timeLifeDate ? this.datePipe.transform(this.receivingForm.timeLifeDate, "MM/dd/yyyy") : '',
            itemMasterId: this.receivingForm.itemMasterId ? editValueAssignByCondition('itemMasterId', this.receivingForm.itemMasterId) : '',
            // partNumber: this.receivingForm.itemMasterId ? editValueAssignByCondition('partNumber', this.receivingForm.itemMasterId) : '',
            employeeId: this.receivingForm.employeeId ? editValueAssignByCondition('value', this.receivingForm.employeeId) : '',
            
            createdBy: this.userName,
            updatedBy: this.userName,
            masterCompanyId: 1,
            isSerialized: this.receivingForm.isSerialized ?  this.receivingForm.isSerialized :false,
            isTimeLife: this.receivingForm.isTimeLife ?  this.receivingForm.isTimeLife :false,
            // isSerialized: this.receivingForm.isSerialized ?  this.receivingForm.isSerialized :false,
            timeLife: { ...this.sourceTimeLife, timeLifeCyclesId: this.timeLifeCyclesId, updatedDate: new Date() }
        }
        const { customerCode, customerPhone, partDescription, manufacturer, revisePartId, ...receivingInfo } = receivingForm;
        if (!this.isEditMode) {
            receivingInfo.obtainFrom= this.receivingForm.obtainFrom ? editValueAssignByCondition('value', this.receivingForm.obtainFrom) : '',
            receivingInfo.owner= this.receivingForm.owner ? editValueAssignByCondition('value', this.receivingForm.owner) : '',
            receivingInfo.traceableTo= this.receivingForm.traceableTo ? editValueAssignByCondition('value', this.receivingForm.traceableTo) : '',
            this.receivingCustomerWorkService.newReason(receivingInfo).subscribe(res => {
                $('#workorderpopup').modal('show');
                this.receivingCustomerWorkId = res.receivingCustomerWorkId;
                this.onUploadDocumentListNew();
                this.alertService.showMessage(
                    'Success',
                    `Saved Customer Work Successfully`,
                    MessageSeverity.success
                );
            });
        }
        else {
            console.log("edit form aa",receivingInfo);
            if (receivingInfo.obtainFromTypeId == 1 ) {
                receivingInfo.obtainFrom = receivingInfo.obtainFrom.customerId;
                // console.log("edit form2",receivingInfo);
            }else if(receivingInfo.obtainFromTypeId = 2 ){
                receivingInfo.obtainFrom= receivingInfo.obtainFrom.value;
            }else if( receivingInfo.obtainFromTypeId == 9){
                receivingInfo.obtainFrom= receivingInfo.obtainFrom.value;
            }
            if (receivingInfo.ownerTypeId == 1) {
                receivingInfo.owner = receivingInfo.owner.customerId;
            }else if(receivingInfo.ownerTypeId = 2 ){
                receivingInfo.owner= receivingInfo.owner.value;
            }else if( receivingInfo.ownerTypeId == 9){
                receivingInfo.owner= receivingInfo.owner.value;
            }
            if (receivingInfo.traceableToTypeId == 1) {
                receivingInfo.traceableTo = receivingInfo.traceableTo.customerId;
            }else if(receivingInfo.traceableToTypeId = 2 ){
                receivingInfo.traceableTo= receivingInfo.traceableTo.value;
            }else if( receivingInfo.traceableToTypeId == 9){
                receivingInfo.traceableTo= receivingInfo.traceableTo.value;
            }
            console.log("edit form aa ccc",receivingInfo);
            this.receivingCustomerWorkService.updateCustomerWorkReceiving(receivingInfo).subscribe(res => {
                $('#workorderpopup').modal('show');
                this.onUploadDocumentListNew();
                this.alertService.showMessage(
                    'Success',
                    `Updated Customer Work Successfully`,
                    MessageSeverity.success
                );
            });
        }
    }

    onUploadDocumentList() {
        const vdata = {
            referenceId: this.receivingCustomerWorkId,
            masterCompanyId: 1,
            createdBy: this.userName,
            updatedBy: this.userName,
            moduleId: 37
        }
        for (var key in vdata) {
            this.formData.append(key, vdata[key]);
        }
        this.commonService.uploadDocumentsEndpoint(this.formData).subscribe(res => {
            this.formData = new FormData();
            this.toGetDocumentsList(this.receivingCustomerWorkId);
        });
    }
    allCustomerFinanceDocumentsListOriginal: any = [];
    toGetDocumentsList(id) {
        var moduleId = 37;
        this.commonService.GetDocumentsList(id, moduleId).subscribe(res => {
            this.customerWorkDocumentsList = res;
            this.allCustomerFinanceDocumentsListOriginal = res;
        })
    }

    downloadFileUpload(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }
    getEmployeeAttachmentDelete(rowData) {
        let attachmentDetailId = rowData.attachmentDetailId;
        let updatedBy = this.userName;

        this.commonService.GetAttachmentDeleteById(attachmentDetailId, updatedBy).subscribe(res => {
            this.toGetDocumentsList(this.receivingCustomerWorkId)
        })
    }

    goToWorkOrder() {
        this.router.navigateByUrl(`/workordersmodule/workorderspages/app-work-order-receivingcustworkid/${this.receivingCustomerWorkId}`);
    }
    goToCustomerWorkList() {
        this.router.navigateByUrl('/receivingmodule/receivingpages/app-customer-works-list');
    }
    customerWarningsList: any;
    getCustomerWarningsList(): void {
        this.commonService.smartDropDownList('CustomerWarningType', 'CustomerWarningTypeId ', 'Name').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            res.forEach(element => {
                if (element.label == 'Receive MPN') {
                    this.customerWarningListId = element.value;
                    return;
                }
            });
        })
    }
    customerWarnings(customerId) {
        if (customerId && this.customerWarningListId) {
            this.warningMessage = '';
            this.commonService.customerWarnings(customerId, this.customerWarningListId).subscribe((res: any) => {
                if (res) {
                    this.warningMessage = res.warningMessage;
                    this.warningID = res.customerWarningId;
                }
                if (this.isEditCustomerWork == false) {
                    this.customerResctrictions(customerId, this.warningMessage);
                } else {
                    if(this.warningID !=0){
                        this.showAlertMessage();
                    }
                    this.restrictID = 0
                }
            })
        }
    }
    customerResctrictions(customerId, warningMessage) {
        this.restrictMessage = '';
        if (customerId && this.customerWarningListId) {
            this.commonService.customerResctrictions(customerId, this.customerWarningListId).subscribe((res: any) => {
                if (res) {
    this.restrictMessage = res.restrictMessage;
                    this.restrictID = res.customerWarningId;
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
        }
    }
    addDocumentDetails() {
        this.selectedFileAttachment = [];
        this.disableFileAttachmentSubmit = false;
        this.index = 0;
        this.isEditButton = false;
        this.documentInformation = {
            docName: '',
            docMemo: '',
            docDescription: '',
            attachmentDetailId:0
        }
    }
    dismissDocumentPopupModel(type) {
        this.disableSave = true;
        this.fileUploadInput.clear();
        this.closeMyModel(type);
    }
    closeMyModel(type) {
        $(type).modal("hide");

    }
    downloadFileUploadNew(link) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${link}`;
        window.location.assign(url);
    }
    disableSaveadd:boolean=true;
    fileUpload(event) {
        // if (event.files.length === 0) {
        //     this.disableFileAttachmentSubmit = false;
        // } else {
        //     this.disableFileAttachmentSubmit = true;
        // }
        if (event.files.length === 0){
			return  this.disableSaveadd = true;
		}else{
			this.disableSaveadd = false;	
		}
        const filesSelectedTemp = [];
        this.selectedFileAttachment=[];
        for (let file of event.files) {
            var flag = false;
            for (var i = 0; i < this.sourceViewforDocumentList.length; i++) {
                if (this.sourceViewforDocumentList[i].fileName == file.name) {
                    flag = true;
                    this.alertService.showMessage(
                        'Duplicate',
                        `Already Exists this file `,
                        MessageSeverity.warn
                    );
                    // this.disableFileAttachmentSubmit = false;
                    if (this.fileUploadInput) {
                        this.fileUploadInput.clear()
                    }
                }
            }
            if (!flag) {
                filesSelectedTemp.push({
                    link: file.objectURL,
                    fileName: file.name,
                    isFileFromServer: false,
                    fileSize: file.size,
                })
                this.formData.append(file.name, file);
            }
        } 
        for (var i = 0; i < filesSelectedTemp.length; i++) {
            this.selectedFileAttachment.push({
                docName: this.documentInformation.docName,
                docMemo: this.documentInformation.docMemo,
                docDescription: this.documentInformation.docDescription,
                createdBy: this.userName,
                updatedBy: this.userName,
                link: filesSelectedTemp[i].link,
                fileName: filesSelectedTemp[i].fileName,
                fileSize: filesSelectedTemp[i].fileSize,
                isFileFromServer: false,
                attachmentDetailId: 0,
                })
        }
    }
    onFileChanged(event) {
        this.selectedFile = event.target.files[0];
    }
    addDocumentInformation(type, documentInformation) {
        if (this.selectedFileAttachment != []) {
            for (var i = 0; i < this.selectedFileAttachment.length; i++) {
                this.sourceViewforDocumentList.push({
                    docName: documentInformation.docName, 
                    docMemo: documentInformation.docMemo,
                    docDescription: documentInformation.docDescription,
                    link:this.selectedFileAttachment[i].link,
                    fileName: this.selectedFileAttachment[i].fileName,
                    isFileFromServer: false,
                    attachmentDetailId: 0,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    createdDate: Date.now(),
                    updatedDate: Date.now(),
                    fileSize: ((this.selectedFileAttachment[i].fileSize) / (1024 * 1024)).toFixed(2),
                })
            }
   }
        if (documentInformation.attachmentDetailId > 0 || this.index > 0) {
            for (var i = 0; i <= this.sourceViewforDocumentList.length; i++) {
                if (this.sourceViewforDocumentList[i].attachmentDetailId > 0) {
                    if (this.sourceViewforDocumentList[i].attachmentDetailId == documentInformation.attachmentDetailId) {
                        this.sourceViewforDocumentList[i].docName = documentInformation.docName;
                        this.sourceViewforDocumentList[i].docMemo = documentInformation.docMemo;
                        this.sourceViewforDocumentList[i].docDescription = documentInformation.docDescription;
                        break;
                    }
                }
                else {
                    if (i == this.index) {
                        this.sourceViewforDocumentList[i].docName = documentInformation.docName;
                        this.sourceViewforDocumentList[i].docMemo = documentInformation.docMemo;
                        this.sourceViewforDocumentList[i].docDescription = documentInformation.docDescription;
                        break;
                    }
                }
            }
            this.index = 0;
            this.isEditButton = false;
            // this.disableFileAttachmentSubmit == true;;
            this.dismissDocumentPopupModel(type)
        }
        this.sourceViewforDocumentList = [...this.sourceViewforDocumentList]
        if (this.sourceViewforDocumentList.length > 0) {
            this.totalRecordNew = this.sourceViewforDocumentList.length;
            this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
        }
            this.index = 0;
            this.isEditButton = false;
            // this.disableFileAttachmentSubmit == true;;
        this.dismissDocumentPopupModel(type)
        if (this.fileUploadInput) {
            this.fileUploadInput.clear()
        }
    } editCustomerDocument(rowdata,index=0) {
        this.isEditButton = true;
        this.selectedFileAttachment = [];
        this.index = index;
        this.documentInformation = rowdata;
        if (rowdata.attachmentDetailId > 0) {
            this.toGetDocumentView(rowdata.attachmentDetailId);
        }
        else {
            this.sourceViewforDocument = rowdata;
        }
    }
    deleteAttachmentRow(rowdata, index, content) {
        this.selectedRowForDelete = rowdata;
        this.rowIndex = index;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { })
    }
    deleteItemAndCloseModel() {
        let attachmentDetailId = this.selectedRowForDelete.attachmentDetailId;
        if (attachmentDetailId > 0) {
            this.commonService.GetAttachmentDeleteById(attachmentDetailId, this.userName).subscribe(res => {
                this.toGetDocumentsListNew(this.receivingCustomerWorkId);
                this.alertService.showMessage(
                    'Success',
                    `Deleted Attachment  Successfully`,
                    MessageSeverity.success
                );
            })
        }
        else {
            this.sourceViewforDocumentList.splice(this.rowIndex, 1)
            this.totalRecordNew = this.sourceViewforDocumentList.length;
            this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
        }
        this.modal.close();
    }
    onUploadDocumentListNew() {
        const vdata = {
            referenceId: this.receivingCustomerWorkId,
            masterCompanyId: 1,
            createdBy: this.userName,
            updatedBy: this.userName,
            moduleId: 37,
        }
        for (var key in vdata) {
            this.formData.append(key, vdata[key]);
        }
        this.formData.append('attachmentdetais', JSON.stringify(this.sourceViewforDocumentList));
 this.commonService.uploadDocumentsEndpoint(this.formData).subscribe(res => {
            this.formData = new FormData();
            this.disableSave = true;
            this.toGetDocumentsListNew(this.receivingCustomerWorkId);
        });
    }

    enableSave() {
        if(this.isEditMode==true){
            this.disableSave = false; 
    }
    //else{
    //     if(this.sourceViewforDocumentList && this.sourceViewforDocumentList.length>0){
    //         this.disableSave = false;
    //     }else{
    //         this.disableSave = true; 
    //     }
    // }
    } 
    toGetDocumentsListNew(id) {
        var moduleId = 37;
        this.commonService.GetDocumentsListNew(id, moduleId).subscribe(res => {
            this.sourceViewforDocumentList = res || [];
            this.allDocumentListOriginal = res;
            if (this.sourceViewforDocumentList.length > 0) {
                this.sourceViewforDocumentList.forEach(item => {
                    item["isFileFromServer"] = true;
                                  })
                                  this.isDocumentsToShow=true;
            }else{
                this.isDocumentsToShow=false;
            }
            this.totalRecordNew = this.sourceViewforDocumentList.length;
            this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
        })
    }
    toGetDocumentView(id) {
        this.commonService.GetAttachment(id).subscribe(res => {
            this.sourceViewforDocument = res || [];     
        })
    }
    dateFilterForTableNew(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            const data = [...this.sourceViewforDocumentList.filter(x => {
               if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.sourceViewforDocumentList = data;
        } else {
            this.sourceViewforDocumentList = this.allDocumentListOriginal;
        }
    }
    dismissModel() {
        this.modal.close();
    }
    private onAuditHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.sourceViewforDocumentAudit = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => { })
    }
    private saveFailedHelper(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    openHistory(content, rowData) {
        this.alertService.startLoadingMessage();
        this.commonService.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results, content),
            error => this.saveFailedHelper(error));
    }
    getColorCodeForHistory(i, field, value) {
        const data = this.sourceViewforDocumentAudit;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
}
