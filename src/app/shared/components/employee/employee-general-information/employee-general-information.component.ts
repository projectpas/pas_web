import { Component, OnInit, AfterViewInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, AbstractControl, RequiredValidator } from '@angular/forms';
import { fadeInOut } from '../../../../services/animations';
import { MasterComapnyService } from '../../../../services/mastercompany.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { AuditHistory } from '../../../../models/audithistory.model';
import { AuthService } from '../../../../services/auth.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MasterCompany } from '../../../../models/mastercompany.model';
import { EmployeeService } from '../../../../services/employee.service';
import { JobTitle } from '../../../../models/jobtitle.model';
import { JobType } from '../../../../models/jobtype.model';
import { JobTitleService } from '../../../../services/job-title.service';
import { JobTypeService } from '../../../../services/job-type.service';
import { EmployeeExpertiseService } from '../../../../services/employeeexpertise.service';
import { EmployeeExpertise } from '../../../../models/employeeexpertise.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AppTranslationService } from '../../../../services/app-translation.service';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { EmployeeLeaveType } from '../../../../models/EmployeeLeaveTypeModel';
import { LocalStoreManager } from '../../../../services/local-store-manager.service';
import { DBkeys } from '../../../../services/db-Keys';
import { User } from '../../../../models/user.model';
import { CompanyService } from '../../../../services/company.service';
import { CurrencyService } from '../../../../services/currency.service';
import { editValueAssignByCondition, formatNumberAsGlobalSettingsModule, getObjectByValue } from '../../../../generic/autocomplete';
import { CommonService } from '../../../../services/common.service';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
declare var $: any;
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { emailPattern, urlPattern, phonePattern } from '../../../../validations/validation-pattern';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';


@Component({
    selector: 'app-employee-general-information',
    templateUrl: './employee-general-information.component.html',
    styleUrls: ['./employee-general-information.component.scss'],
    animations: [fadeInOut]
})
export class EmployeeGeneralInformationComponent implements OnInit, AfterViewInit {
    @ViewChild("tabRedirectConfirmationModal", { static: false }) public tabRedirectConfirmationModal: ElementRef;
    local: any;
    dateTime = new Date();
    activeIndex: number;
    allLeaves: EmployeeLeaveType[];
    phonePattern = phonePattern();
    allCountries: any[];
    yearly: boolean = false;
    hourly: boolean = false;
    showsingle: boolean;
    showMultiple: boolean;
    shiftValues: any[] = [];
    allManufacturerInfo: any[];
    disableSavepartNumber: boolean;
    firstNameShow: boolean;
    selectedCars1: any;
    divisionId: any;
    departmentId: any;
    businessUnitId: any;
    companyId: any;
    isEnableNext: any = false;
    allEmployeeExpertiseInfo: EmployeeExpertise[];
    allJobTitlesinfo: JobTitle[];
    allJobTypesinfo: JobType[];
    jobName: string;
    isSpinnerVisible: boolean = false;
    _divisionlist: any[];
    _departmentList: any[];
    leavemultiValues: any[] = [];
    allLeaveDetails: any[];
    selectedshiftValues: any[];
    sessionShiftValues: any[];
    allShiftValues: any[] = [];
    collectionofItemMaster: any;
    allleaveInfo: any[] = [];
    selectedLeaveValues: any[];
    sessionLeaveValues: any[];
    description: any;
    localleaveCollection: any[] = [];
    allLeavesinfo: EmployeeLeaveType[];
    enableSaveBtn: boolean = false;
    employeeLeaveTypeId: any;
    allmultiLeaves: any[];
    allMultipleLeaves: any[] = [];
    managementStructureData: any[];
    selectedFirstName: any;
    disableSaveFirstName: boolean;
    disableSaveMiddleName: boolean;
    disableSaveName: any;
    disableSaveLastName: boolean;
    disableSaveLeaveName: boolean;
    selectedActionName: any;
    disableJobTitle: boolean = true;
    disableJobType: boolean = true;
    disableExpTitle: boolean = true;
    display: boolean = false;
    modelValue: boolean = false;
    public empId: any;
    public firstName: any;
    public lastName: any;
    public jobTypeName: any;
    public jobTypeDescription: any;
    employeeIdTemp = "Creating"
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    displayedColumns = ['employeeId', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    dataSource: MatTableDataSource<any>;
    allEmployeeinfo: any[] = [];
    allShiftdetails: any;
    allComapnies: MasterCompany[] = [];
    private isSaving: boolean;
    public sourceAction: any = {};
    public auditHisory: AuditHistory[] = [];
    private bodyText: string;
    loadingIndicator: boolean;
    closeResult: string;
    selectedColumn: any[];
    selectedColumns: any[];
    cols: any[];
    title: string = "Create";
    id: number;
    errorMessage: any;
    modal: NgbModalRef;
    employeeName: string;
    filteredBrands: any[];
    localCollection: any[] = [];
    firstCollection: any[];
    lastNameCollection: any[];
    empIdCollection: any[];
    middleNameCollection: any[];
    /** Actions ctor */
    allManagemtninfo: any[] = [];
    alllegalEntityInfo: any[] = [];
    maincompanylist: any[] = [];
    public isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
    desableJobTypeSave: boolean = true;
    departmentList: any[] = [];
    bulist: any[] = [];
    divisionlist: any[] = [];
    Active: string = "Active";
    allAircraftManufacturer: any[] = [];
    arrayExpertiselist: any = [];
    arrayAllStationlist: any = [];
    arraycurrencylist: any = [];
    arraymultileavelist: any = [];
    sourceEmployee: any = {};
    updateMode: boolean = false;
    showMsg: boolean = false;
    showTitle: string;
    sourceEmpFirst: {
        firstName: any;
    };
    sourceEmpLast: {
        lastName: any;
    };
    nextOrPreviousTab: any = "Next";
    public userInfo: any;
    public userA: any;
    public companylist: any;
    public supervisorId: any = 0;
    allCurrencyData: any[] = [];
    currencyList: any[];
    radioItems: any = [];
    model = { option: '' };
    payTypeValid: boolean = false;
    getAllAllStationInfodrpData;
    isWorksInShop: boolean = false;
    empIsWorksInShop: boolean = false;
    empEditdetailsdata: any;
    employeeDisplayView = 'Create Employee';
    empCreationForm = new FormGroup({
        firstname: new FormControl('firstName', Validators.minLength(1)),
        middleName: new FormControl('middleName', Validators.minLength(1)),
        lastName: new FormControl('lastName', Validators.minLength(1)),
        jobTitleId: new FormControl('jobTitleId', [Validators.required, Validators.minLength(1)]),
        employeeExpertiseId: new FormControl('employeeExpertiseId', Validators.minLength(1)),
        JobTypeId: new FormControl('JobTypeId', Validators.minLength(1)),
        companyId: new FormControl('companyId', [(Validators.required, Validators.minLength(1))]),
        startDate: new FormControl('startDate', Validators.minLength(1)),
        hourlyPay: new FormControl('hourlyPay', Validators.required),
        email: new FormControl('email', Validators.required),
        userName: new FormControl('userName', Validators.required),
    });
    employeeId: any;
    selectedLeaveValuesAssigned: any = [];
    isMonthly: boolean;
    managementStructure = {
        companyId: 0,
        buId: 0,
        divisionId: 0,
        departmentId: 0,
    }
    businessUnitList: any[];
    arrayjobtitlelist: any = [];
    divisionList: any[];
    disableMagmtStruct: boolean = true;
    legalEntityList: any = [];
    currencyObject: any = {};
    employeeid: any;
    currentFirstName: any = {};
    currentLastName: any = {};
    currentMiddleName: any = {};
    leaveType: any;
    memo: any;
    arrayContactlist: any[] = [];
    descriptiontype: any;
    stopmulticlicks: boolean;
    isEditContent: boolean = false;
    @ViewChild("empform", { static: false }) formdata;
    @Output() tab = new EventEmitter<any>();
    private onDestroy$: Subject<void> = new Subject<void>();
    isAdd: boolean=true;
    isEdit: boolean=true;
    constructor(private fb: FormBuilder, private Actroute: ActivatedRoute, private translationService: AppTranslationService, private router: Router, public jobTypeService: JobTypeService, public jobTitleService: JobTitleService, private empservice: EmployeeExpertiseService, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private route: Router, private alertService: AlertService, public employeeService: EmployeeService, public jobTitleService1: LegalEntityService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private localStorage: LocalStoreManager, private companyService: CompanyService, public currencyService: CurrencyService, public commonService: CommonService) {
        this.displayedColumns.push('action');
        this.radioItems = ['Hourly', 'Monthly'];
        //this.loadCompanyData();
        this.empCreationForm = fb.group({
            'firstName': [null, Validators.compose([Validators.required, Validators.minLength(1), this.checkfirstNameExists('firstName')])],
            'middleName': [null],
            'lastName': [null, Validators.compose([Validators.required, Validators.minLength(1), this.checklasttNameExists('lastName')])],
            'jobTitleId': [Validators.compose([Validators.required, Validators.minLength(1)])],
            'employeeExpertiseId': [Validators.compose([Validators.required, Validators.minLength(1)])],
            'JobTypeId': [0, Validators.compose([Validators.required, Validators.minLength(1)])],
            //'companyId': [0, Validators.compose([Validators.required, Validators.minLength(1)])],
            'companyId': [0, Validators.compose([Validators.required, Validators.minLength(1)])],
            //'startDate': [0, Validators.compose([Validators.required, Validators.minLength(1)])],
            'hourlyPay': [0, Validators.compose([Validators.required])],
            'BusinessUnitId': [0],
            'divisionId': [0],
            'departmentId': [0],
            'email': [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{3,}')])],
            'userName': [null, Validators.compose([Validators.required, Validators.pattern('/^[a-z\d]{5,12}$/i')])],
        });
        if (this.employeeService.listCollection != null && this.employeeService.isEditMode == true) {
            this.employeeDisplayView = 'Edit Employee';
            this.loadingIndicator = true;
        }
        let user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
        this.userA = user.userName;
        const control = new FormControl('1', Validators.pattern('[a-zA-Z ]*'));
        this.dataSource = new MatTableDataSource();
        this.translationService.closeCmpny = false;
        this.Actroute.queryParams
            .filter(params => params.order)
            .subscribe(params => {
                this.empId = params.order;
                this.firstName = params.firstname;
                this.lastName = params.lastname;
                if (this.empId != undefined || this.empId != null) {
                }
            });
        this.isAdd = this.authService.checkPermission([ModuleConstants.Employees_GeneralInformation + '.' + PermissionConstants.Add]);
        this.isEdit = this.authService.checkPermission([ModuleConstants.Employees_GeneralInformation + '.' + PermissionConstants.Update]);
    }
    ngOnInit(): void {
        this.isSpinnerVisible = true;
        this.employeeId = this.Actroute.snapshot.paramMap.get('id');
        if (this.employeeId) {
            this.employeeService.employeeId = this.employeeId;
            this.isEditContent = true;
            this.employeeService.isEditMode = true;
            this.employeeService.isDisbaleTabs = true;
            this.employeeService.currentUrl = this.employeeService.currentUrl = `/employeesmodule/employeepages/app-employee-general-information-edit/${this.employeeId}`;
        } else {
            this.employeeService.isEditMode = false;
            this.employeeService.isDisbaleTabs = false;
            this.employeeService.currentUrl = '/employeesmodule/employeepages/app-employee-general-information';
        }
        this.employeeService.bredcrumbObj.next(this.employeeService.currentUrl);
        this.employeeService.ShowPtab = true;
        this.employeeService.alertObj.next(this.employeeService.ShowPtab); //steps
        this.activeIndex = 0;
        this.employeeService.indexObj.next(this.activeIndex);
        this.shift();
        // this.loadManagementdata();
        //this.getLegalEntity();        

        this.loadData();
        //this.loadJobtitlesData('');
        //this.loademployeesexperties('');
        //this.multiLeavelist();
        // this.loadLegalEntityData();
        //this.getAllStationData('');
       
        this.employeeid = this.employeeService.listCollection ? this.employeeService.listCollection.employeeId : this.employeeId;
        if (this.employeeid && this.employeeid != null && this.employeeid != 0) {
            this.isEnableNext = true;
            setTimeout(() => {
                this.isSpinnerVisible = true;
                this.loadEditData();

            },
                1200);

            //this.getManagementStructureDetails(this.currentUserManagementStructureId,this.loginempId);
        }
        else {
            this.loadJobtitlesData('');
            this.loademployeesexperties('');
            this.getAllStationData('');
            this.loadCurrencyData('');
            this.multiLeavelist('');
            //this.getEmployeeData()
            this.sourceEmployee.jobTitleId = 0;
            this.sourceEmployee.employeeExpertiseId = 0;
            this.sourceEmployee.stationId = 0;
            this.getManagementStructureDetails(this.currentUserManagementStructureId, this.loginempId);
            this.isSpinnerVisible = false;

        }
    }

    getManagementStructureDetails(id, empployid = 0, editMSID = 0) {
        empployid = empployid == 0 ? this.employeeId : empployid;
        editMSID = this.isEditMode ? editMSID = id : 0;
        this.commonService.getManagmentStrctureData(id, empployid, editMSID).subscribe(response => {
            if (response) {
                const result = response;
                if (result[0] && result[0].level == 'Level1') {
                    this.maincompanylist = result[0].lstManagmentStrcture;
                    this.managementStructure.companyId = result[0].managementStructureId;
                    this.sourceEmployee.managementStructureId = result[0].managementStructureId;
                    this.managementStructure.buId = 0;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.bulist = [];
                    this.divisionlist = [];
                    this.departmentList = [];
                } else {
                    this.managementStructure.companyId = 0;
                    this.managementStructure.buId = 0;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.maincompanylist = [];
                    this.bulist = [];
                    this.divisionlist = [];
                    this.departmentList = [];
                }

                if (result[1] && result[1].level == 'Level2') {
                    this.bulist = result[1].lstManagmentStrcture;
                    this.managementStructure.buId = result[1].managementStructureId;
                    this.sourceEmployee.managementStructureId = result[1].managementStructureId;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.divisionlist = [];
                    this.departmentList = [];
                } else {
                    if (result[1] && result[1].level == 'NEXT') {
                        this.bulist = result[1].lstManagmentStrcture;
                    }
                    this.managementStructure.buId = 0;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.divisionlist = [];
                    this.departmentList = [];
                }

                if (result[2] && result[2].level == 'Level3') {
                    this.divisionlist = result[2].lstManagmentStrcture;
                    this.managementStructure.divisionId = result[2].managementStructureId;
                    this.sourceEmployee.managementStructureId = result[2].managementStructureId;
                    this.managementStructure.departmentId = 0;
                    this.departmentList = [];
                } else {
                    if (result[2] && result[2].level == 'NEXT') {
                        this.divisionlist = result[2].lstManagmentStrcture;
                    }
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.departmentList = [];
                }

                if (result[3] && result[3].level == 'Level4') {
                    this.departmentList = result[3].lstManagmentStrcture;;
                    this.managementStructure.departmentId = result[3].managementStructureId;
                    this.sourceEmployee.managementStructureId = result[3].managementStructureId;
                } else {
                    this.managementStructure.departmentId = 0;
                    if (result[3] && result[3].level == 'NEXT') {
                        this.departmentList = result[3].lstManagmentStrcture;
                    }
                }
                this.isSpinnerVisible = false;
            }
        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);
        });
    }

    getBUList(legalEntityId) {
        this.managementStructure.buId = 0;
        this.managementStructure.divisionId = 0;
        this.managementStructure.departmentId = 0;
        this.bulist = [];
        this.divisionlist = [];
        this.departmentList = [];
        if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
            this.sourceEmployee.managementStructureId = legalEntityId;
            this.managementStructure.companyId = legalEntityId;
            this.commonService.getManagementStructurelevelWithEmployee(legalEntityId, this.loginempId).subscribe(res => {
                this.bulist = res;
            });
        }
        else {
            this.sourceEmployee.managementStructureId = 0;
            this.managementStructure.companyId = 0;
        }

    }

    enableSave() {
        this.enableSaveBtn = true;
    }

    getDivisionlist(buId) {
        this.divisionlist = [];
        this.departmentList = [];
        this.managementStructure.divisionId = 0;
        this.managementStructure.departmentId = 0;

        if (buId != 0 && buId != null && buId != undefined) {
            this.sourceEmployee.managementStructureId = buId;
            this.managementStructure.buId = buId;
            this.commonService.getManagementStructurelevelWithEmployee(buId, this.loginempId).subscribe(res => {
                this.divisionlist = res;
            });
        } else {
            this.sourceEmployee.managementStructureId = this.managementStructure.companyId;
        }

    }

    getDepartmentlist(divisionId) {
        this.managementStructure.departmentId = 0;
        this.departmentList = [];
        if (divisionId != 0 && divisionId != null && divisionId != undefined) {
            this.managementStructure.divisionId = divisionId;
            this.sourceEmployee.managementStructureId = divisionId;
            this.commonService.getManagementStructurelevelWithEmployee(divisionId, this.loginempId).subscribe(res => {
                this.departmentList = res;
            });
        }
        else {
            this.sourceEmployee.managementStructureId = this.managementStructure.buId;
            this.managementStructure.divisionId = 0;
        }
    }

    getDepartmentId(departmentId) {
        if (departmentId != 0 && departmentId != null && departmentId != undefined) {
            this.sourceEmployee.managementStructureId = departmentId;
            this.managementStructure.departmentId = departmentId;
        }
        else {
            this.sourceEmployee.managementStructureId = this.managementStructure.divisionId;
            this.managementStructure.departmentId = 0;
        }
    }

    get currentUserManagementStructureId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.managementStructureId
            : null;
    }
    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    get loginempId() {
        return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
    }

    getAllContactFirstNameSmartDropDown(strText = '', contactName = '') {
        if (this.arrayContactlist.length == 0) {
            this.arrayContactlist.push(0);
        }
        this.commonService.autoCompleteSmartDropDownEmployeeList('firstName', strText, true, this.arrayContactlist.join(), this.currentUserMasterCompanyId).subscribe(response => {

            var endResult = [];
            for (let resInd = 0; resInd < response.length; resInd++) {
                let alreadyExist = false;
                for (let endInd = 0; endInd < endResult.length; endInd++) {
                    if (endResult[endInd].firstName.toLowerCase() == response[resInd].label.toLowerCase()) {
                        alreadyExist = true;
                    }
                }
                if (!alreadyExist) {
                    endResult.push({ firstName: response[resInd].label })
                }
            }

            this.firstCollection = endResult;
            if (contactName != '') {
                this.sourceEmployee.firstName = getObjectByValue('firstName', contactName, this.firstCollection);
            }

            // }, error => this.saveFailedHelper(error));
        }, error => this.isSpinnerVisible = false);
    }

    getAllContactMiddleNameSmartDropDown(strText = '', contactName = '') {
        if (this.arrayContactlist.length == 0) {
            this.arrayContactlist.push(0);
        }
        this.commonService.autoCompleteSmartDropDownEmployeeList('middlename', strText, true, this.arrayContactlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            var endResult = [];
            for (let resInd = 0; resInd < response.length; resInd++) {
                let alreadyExist = false;
                for (let endInd = 0; endInd < endResult.length; endInd++) {
                    if (endResult[endInd].middleName.toLowerCase() == response[resInd].label.toLowerCase()) {
                        alreadyExist = true;
                    }
                }
                if (!alreadyExist) {
                    endResult.push({ middleName: response[resInd].label })
                }
            }
            this.middleNameCollection = endResult;
            if (contactName != '') {
                this.sourceEmployee.middleName = getObjectByValue('middleName', contactName, this.middleNameCollection);
            }
            //}, error => this.saveFailedHelper(error));
        }, error => this.isSpinnerVisible = false);
    }

    getAllContactLastNameSmartDropDown(strText = '', contactName = '') {
        if (this.arrayContactlist.length == 0) {
            this.arrayContactlist.push(0);
        }
        this.commonService.autoCompleteSmartDropDownEmployeeList('lastname', strText, true, this.arrayContactlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            var endResult = [];
            for (let resInd = 0; resInd < response.length; resInd++) {
                let alreadyExist = false;
                for (let endInd = 0; endInd < endResult.length; endInd++) {
                    if (endResult[endInd].lastName.toLowerCase() == response[resInd].label.toLowerCase()) {
                        alreadyExist = true;
                    }
                }
                if (!alreadyExist) {
                    endResult.push({ lastName: response[resInd].label })
                }
            }
            this.lastNameCollection = endResult;
            if (contactName != '') {
                this.sourceEmployee.lastName = getObjectByValue('lastName', contactName, this.lastNameCollection);
            }
            this.isSpinnerVisible = false;
        }, error => this.isSpinnerVisible = false);
    }



    getInactiveObjectOnEdit(string, id, originalData, tableName, primaryColumn, description) {
        if (id) {
            for (let i = 0; i < originalData.length; i++) {
                if (originalData[i][string] == id) {
                    return id;
                }
            }
            let obj: any = {};
            this.commonService.smartDropDownGetObjectById(tableName, primaryColumn, description, primaryColumn, id).subscribe(res => {
                obj = res[0];
                if (tableName == 'EmployeeExpertise') {
                    this.allEmployeeExpertiseInfo = [...originalData, obj];
                } else if (tableName == 'JobTitle') {
                    this.allJobTitlesinfo = [...originalData, obj];
                }
            }, err => {
                //const errorLog = err;
                //this.errorMessageHandler(errorLog);
                this.isSpinnerVisible = false
            });
            return id;
        } else {
            return null;
        }
    }

    errorMessageHandler(log) {
        this.isSpinnerVisible = false;
        const errorLog = log;
        if (errorLog.error) {
            this.alertService.showMessage(
                "Validation Failed",
                errorLog.error,
                MessageSeverity.error
            );
            return;
        }
        var msg = '';
        if (errorLog.message) {
            if (errorLog.error && errorLog.error.errors.length > 0) {
                for (let i = 0; i < errorLog.error.errors.length; i++) {
                    msg = msg + errorLog.error.errors[i].message + '<br/>'
                }
            }
            this.alertService.showMessage(
                errorLog.error.message,
                msg,
                MessageSeverity.error
            );
        }
        else {
            this.alertService.showMessage(
                'Error',
                log.error,
                MessageSeverity.error
            );
        }
    }

    getDetailsInactive(res) {
        this.sourceEmployee.employeeExpertiseId = this.getInactiveObjectOnEdit('value', res.employeeExpertiseId, this.allEmployeeExpertiseInfo, 'EmployeeExpertise', 'EmployeeExpertiseId', 'Description');
        this.sourceEmployee.jobTitleId = this.getInactiveObjectOnEdit('value', res.jobTitleId, this.allJobTitlesinfo, 'JobTitle', 'JobTitleId', 'Description');
    }

    loadEditData() {
        this.isSpinnerVisible = true;
        this.employeeService.toGetEmployeeDetailsByEmpId(this.employeeid).subscribe(res => {
            this.empEditdetailsdata = res;
            this.updateMode = true;
            this.sourceEmployee = this.empEditdetailsdata;
            this.selectedLeaveValues = this.sourceEmployee.leaveTypeIds;
            this.getManagementStructureDetails(this.sourceEmployee.managementStructureId, this.loginempId, this.sourceEmployee.managementStructureId);
            if (this.sourceEmployee.employeeId) {
                this.empId = this.sourceEmployee.employeeId;
            }
            this.employeeIdTemp = this.sourceEmployee.employeeCode ? this.sourceEmployee.employeeCode : 'Creating';
            //this.sourceEmployee.jobTitleId = this.sourceEmployee.jobTitleId;
            //this.sourceEmployee.employeeExpertiseId = this.sourceEmployee.employeeExpertiseId;
            this.empCreationForm.controls['JobTypeId'].setValue(this.sourceEmployee.jobTypeId);
            this.supervisorId = this.sourceEmployee.supervisorId;
            if (this.employeeId) {
                this.sourceEmployee.startDate = new Date(this.sourceEmployee.startDate);
            } else {
                this.sourceEmployee.startDate = new Date();
            }
            this.sourceEmployee.dateOfBirth = this.sourceEmployee.dateOfBirth ? new Date(this.sourceEmployee.dateOfBirth) : '';
            if (this.local) {
                this.employeeService.employeeCollection = this.local;
            }
            let payType = this.sourceEmployee.isHourly;
            // if(this.sourceEmployee.inMultipleShifts==false){
            //     this.sourceEmployee.shiftId=this.sourceEmployee.shiftIds[0];
            // }
            if (this.sourceEmployee.isHourly == true) {
                this.hourly = true
                this.yearly = false
                this.model = { option: 'Hourly' };
                this.sourceEmployee.hourlyPay = this.sourceEmployee.hourlyPay ? formatNumberAsGlobalSettingsModule(this.sourceEmployee.hourlyPay, 2) : '';
                this.isMonthly = false;
            }
            if (this.sourceEmployee.isHourly == false) {
                this.yearly = true
                this.hourly = false
                this.model = { option: 'Monthly' };
                this.sourceEmployee.hourlyPay = this.sourceEmployee.hourlyPay ? formatNumberAsGlobalSettingsModule(this.sourceEmployee.hourlyPay, 2) : '';
                this.isMonthly = true;
            }
            if (this.sourceEmployee.inMultipleShifts == true) {
                this.sourceEmployee.multiShift = "multiShift";
                this.showsingle = false;
                this.showMultiple = true;
            }
            else {
                if (this.sourceEmployee.shiftIds && this.sourceEmployee.shiftIds.length > 0) {
                    this.sourceEmployee.shiftId = this.sourceEmployee.shiftIds[0];
                    this.sourceEmployee.singleShift = "singleShift";
                    this.showsingle = true;
                    this.showMultiple = false;
                }
                else {
                    this.showsingle = false;
                    this.showMultiple = false;
                    this.sourceEmployee.inMultipleShifts = null;
                    this.sourceEmployee.multiShift = "";
                    this.sourceEmployee.singleShift = "";
                }
            }
            this.sourceEmployee.employeeCertifyingStaff = this.sourceEmployee.employeeCertifyingStaff;
            // this.sourceEmployee.firstName = this.sourceEmployee.firstNameArray[0];
            this.arrayContactlist.push(this.employeeId);
            this.getAllContactFirstNameSmartDropDown('', this.sourceEmployee.firstNameArray[0].firstName);
            this.getAllContactMiddleNameSmartDropDown('', this.sourceEmployee.middleNameArray[0].middleName);
            this.getAllContactLastNameSmartDropDown('', this.sourceEmployee.lastNameArray[0].lastName);
            // this.sourceEmployee.middleName = this.sourceEmployee.middleNameArray[0];
            // this.sourceEmployee.lastName = this.sourceEmployee.lastNameArray[0];
            this.sourceEmployee.currencyId = this.sourceEmployee.currency[0];
            this.loadingIndicator = false;
            if (this.sourceEmployee.jobTitleId && this.sourceEmployee.jobTitleId > 0) {
                this.arrayjobtitlelist.push(this.sourceEmployee.jobTitleId);
            }
            this.loadJobtitlesData('');

            if (this.sourceEmployee.employeeExpertiseId && this.sourceEmployee.employeeExpertiseId > 0) {
                this.arrayExpertiselist.push(this.sourceEmployee.employeeExpertiseId);
            }
            this.loademployeesexperties('');

            if (this.sourceEmployee.stationId && this.sourceEmployee.stationId > 0) {
                this.arrayAllStationlist.push(this.sourceEmployee.stationId);
            }
            this.getAllStationData('');

            if (this.sourceEmployee.currencyId && this.sourceEmployee.currencyId > 0) {
                this.arraycurrencylist.push(this.sourceEmployee.currencyId);
            }
            this.loadCurrencyData('');

            if (this.sourceEmployee.leaveTypeIds) {
                this.arraymultileavelist.push(this.sourceEmployee.leaveTypeIds);
            }
            this.multiLeavelist('');

            // setTimeout(() => {
            //     this.getDetailsInactive(res);
            // },
            //     1200);
            this.isEnableNext = true;
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    loadEditDataAfterUpdate(res) {
        this.isEnableNext = true;
        this.empEditdetailsdata = res;
        this.updateMode = true;
        this.sourceEmployee = this.empEditdetailsdata;
        this.selectedLeaveValues = this.sourceEmployee.leaveTypeIds;

        if (this.sourceEmployee.employeeId) {
            this.empId = this.sourceEmployee.employeeId;
        }
        this.employeeIdTemp = this.sourceEmployee.employeeCode ? this.sourceEmployee.employeeCode : 'Creating';
        //this.sourceEmployee.jobTitleId = this.sourceEmployee.jobTitleId;
        //this.sourceEmployee.employeeExpertiseId = this.sourceEmployee.employeeExpertiseId;
        this.empCreationForm.controls['JobTypeId'].setValue(this.sourceEmployee.jobTypeId);
        this.supervisorId = this.sourceEmployee.supervisorId;
        if (this.employeeId) {
            this.sourceEmployee.startDate = new Date(this.sourceEmployee.startDate);
        } else {
            this.sourceEmployee.startDate = new Date();
        }
        this.sourceEmployee.dateOfBirth = this.sourceEmployee.dateOfBirth ? new Date(this.sourceEmployee.dateOfBirth) : '';
        if (this.local) {
            this.employeeService.employeeCollection = this.local;
        }
        let payType = this.sourceEmployee.isHourly;

        if (this.sourceEmployee.isHourly == true) {
            this.hourly = true
            this.yearly = false
            this.model = { option: 'Hourly' };
            this.sourceEmployee.hourlyPay = this.sourceEmployee.hourlyPay ? formatNumberAsGlobalSettingsModule(this.sourceEmployee.hourlyPay, 2) : '';
            this.isMonthly = false;
        }
        if (this.sourceEmployee.isHourly == false) {
            this.yearly = true
            this.hourly = false
            this.model = { option: 'Monthly' };
            this.sourceEmployee.hourlyPay = this.sourceEmployee.hourlyPay ? formatNumberAsGlobalSettingsModule(this.sourceEmployee.hourlyPay, 2) : '';
            this.isMonthly = true;
        }
        if (this.sourceEmployee.inMultipleShifts == true) {
            this.sourceEmployee.multiShift = "multiShift";
            this.showsingle = false;
            this.showMultiple = true;
        }
        else {
            if (this.sourceEmployee.shiftIds && this.sourceEmployee.shiftIds.length > 0) {
                this.sourceEmployee.shiftId = this.sourceEmployee.shiftIds[0];
                this.sourceEmployee.singleShift = "singleShift";
                this.showsingle = true;
                this.showMultiple = false;
            }
            else {
                this.showsingle = false;
                this.showMultiple = false;
                this.sourceEmployee.inMultipleShifts = null;
                this.sourceEmployee.multiShift = "";
                this.sourceEmployee.singleShift = "";

            }
        }

        // this.empCreationForm.controls['companyId'].setValue(this.sourceEmployee.compmanagmentLegalEntityId); 
        // this.empCreationForm.controls['BusinessUnitId'].setValue(this.sourceEmployee.biumanagmentLegalEntityId);
        // this.empCreationForm.controls['divisionId'].setValue(this.sourceEmployee.divmanagmentLegalEntityId);
        // this.empCreationForm.controls['departmentId'].setValue(this.sourceEmployee.managmentLegalEntityId);
        this.arrayContactlist.push(this.employeeId);
        this.sourceEmployee.employeeCertifyingStaff = this.sourceEmployee.employeeCertifyingStaff;
        this.getAllContactFirstNameSmartDropDown('', this.sourceEmployee.firstNameArray[0].firstName);
        this.getAllContactMiddleNameSmartDropDown('', this.sourceEmployee.middleNameArray[0].middleName);
        this.getAllContactLastNameSmartDropDown('', this.sourceEmployee.lastNameArray[0].lastName);
        this.sourceEmployee.currencyId = this.sourceEmployee.currency[0];
        this.loadingIndicator = false;
        setTimeout(() => {
            this.getDetailsInactive(res);
        },
            1200);
        this.isSpinnerVisible = false;
    }
    // getManagementStructureOnEdit(managementStructureId) {
    //     this.commonService.getManagementStructureDetails(managementStructureId).subscribe(res => {
    //         this.selectedLegalEntity(res.Level1);
    //         this.selectedBusinessUnit(res.Level2);
    //         this.selectedDivision(res.Level3);
    //         this.selectedDepartment(res.Level4);
    //         // this.managementStructure = {
    //         //     companyId: res.Level1 !== undefined ? res.Level1 : 0,
    //         //     buId: res.Level2 !== undefined ? res.Level2 : 0,
    //         //     divisionId: res.Level3 !== undefined ? res.Level3 : 0,
    //         //     departmentId: res.Level4 !== undefined ? res.Level4 : 0,
    //         // }
    //     }, err => {

    //         const errorLog = err;
    //         this.errorMessageHandler(errorLog);
    //     });
    // }

    // getEmployeeData() {
    //     this.selectedLegalEntity(this.authService.currentManagementStructure.levelId1);
    //     this.selectedBusinessUnit(this.authService.currentManagementStructure.levelId2);
    //     this.selectedDivision(this.authService.currentManagementStructure.levelId3);
    //     this.selectedDepartment(this.authService.currentManagementStructure.levelId4);
    //     //  this.sourceEmployee.compmanagmentLegalEntityId = this.authService.currentManagementStructure.levelId1;
    //     //  this.sourceEmployee.biumanagmentLegalEntityId = this.authService.currentManagementStructure.levelId2;
    //     //  this.sourceEmployee.divmanagmentLegalEntityId = this.authService.currentManagementStructure.levelId3;
    //     //  this.sourceEmployee.managmentLegalEntityId = this.authService.currentManagementStructure.levelId4;
    //     this.managementStructure.companyId = this.authService.currentManagementStructure.levelId1;
    //     this.managementStructure.buId = this.authService.currentManagementStructure.levelId2;
    //     this.managementStructure.divisionId = this.authService.currentManagementStructure.levelId3;
    //     this.managementStructure.departmentId = this.authService.currentManagementStructure.levelId4;
    // }

    // getLegalEntity() {
    //     this.commonService.getLegalEntityList().subscribe(res => {
    //         this.legalEntityList = res;
    //     },err => {

    //         const errorLog = err;
    //         this.errorMessageHandler(errorLog);
    //     });
    // }

    /*

    selectedLegalEntity(legalEntityId) {
        this.businessUnitList = [];
        this.divisionList = [];
        this.departmentList = [];
        this.managementStructure.buId = 0;
        this.managementStructure.divisionId = 0;
        this.managementStructure.departmentId = 0;
        // this.sourceEmployee.biumanagmentLegalEntityId = 0;
        // this.sourceEmployee.divmanagmentLegalEntityId = 0;
        // this.sourceEmployee.managmentLegalEntityId = 0;
        if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
            this.sourceEmployee.managementStructureId = legalEntityId;
            this.commonService.getBusinessUnitListByLegalEntityId(legalEntityId).subscribe(res => {
                this.businessUnitList = res;
            }, err => {

                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
            this.disableMagmtStruct = false;
        } else {
            this.disableMagmtStruct = true;
        }
    }

    selectedBusinessUnit(businessUnitId) {
        this.divisionList = [];
        this.departmentList = [];
        this.managementStructure.divisionId = 0;
        this.managementStructure.departmentId = 0;

        // this.sourceEmployee.divmanagmentLegalEntityId =0;
        // this.sourceEmployee.managmentLegalEntityId = 0;
        if (businessUnitId != 0 && businessUnitId != null && businessUnitId != undefined) {
            this.sourceEmployee.managementStructureId = businessUnitId;
            this.commonService.getDivisionListByBU(businessUnitId).subscribe(res => {
                this.divisionList = res;
            }, err => {

                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
    }
    selectedDivision(divisionUnitId) {
        this.departmentList = [];
        this.managementStructure.departmentId = 0;
            // this.sourceEmployee.managmentLegalEntityId = 0;
        if (divisionUnitId != 0 && divisionUnitId != null && divisionUnitId != undefined) {
            this.sourceEmployee.managementStructureId = divisionUnitId;
            this.commonService.getDepartmentListByDivisionId(divisionUnitId).subscribe(res => {
                this.departmentList = res;
            }, err => {

                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
    }
    selectedDepartment(departmentId) {
        if (departmentId != 0 && departmentId != null && departmentId != undefined) {
            this.sourceEmployee.managementStructureId = departmentId;
        }
    }*/

    /*
    loadLegalEntityData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.jobTitleService1.getManagemtentLengalEntityData().subscribe(
            results => this.onManagemtntlegaldataLoad(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }*/

    /*
    private onManagemtntlegaldataLoad(getAtaMainList: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.alllegalEntityInfo = getAtaMainList;
        for (let i = 0; i < this.alllegalEntityInfo.length; i++) {

            if (this.alllegalEntityInfo[i].parentId == null) {
                this.maincompanylist.push(this.alllegalEntityInfo[i]);

            }
        }
        if (this.maincompanylist) {
            this.maincompanylist = this.maincompanylist.reduce((unique, o) => {
                if (!unique.some(obj => obj.name === o.name)) {
                    unique.push(o);
                }
                return unique;
            }, []);
        }
    }
    */

    /*
     private loadManagementdata() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.jobTitleService1.getManagemententity().subscribe(
            results => this.onManagemtntdataLoad(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    private onManagemtntdataLoad(getAtaMainList: any[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getAtaMainList;
        this.allManagemtninfo = getAtaMainList;
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == null) {
                this.maincompanylist.push(this.allManagemtninfo[i]);
            }
        }
        if (this.sourceEmployee.managmentLegalEntity != null && this.sourceEmployee.divmanagmentLegalEntity != null && this.sourceEmployee.biumanagmentLegalEntity != null && this.sourceEmployee.compmanagmentLegalEntity != null) {
            this.empCreationForm.controls['companyId'].setValue(this.sourceEmployee.compmanagmentLegalEntity.managementStructureId);
            this.empCreationForm.controls['BusinessUnitId'].setValue(this.sourceEmployee.biumanagmentLegalEntity.managementStructureId);
            this.empCreationForm.controls['divisionId'].setValue(this.sourceEmployee.divmanagmentLegalEntity.managementStructureId);
            this.empCreationForm.controls['departmentId'].setValue(this.sourceEmployee.managementStructeInfo.managementStructureId);
        }
        else if (this.sourceEmployee.biumanagmentLegalEntity != null && this.sourceEmployee.divmanagmentLegalEntity != null && this.sourceEmployee.managmentLegalEntity != null) {
            this.empCreationForm.controls['companyId'].setValue(this.sourceEmployee.biumanagmentLegalEntity.managementStructureId);
            this.empCreationForm.controls['BusinessUnitId'].setValue(this.sourceEmployee.divmanagmentLegalEntity.managementStructureId);
            this.empCreationForm.controls['divisionId'].setValue(this.sourceEmployee.managmentLegalEntity.managementStructureId);
        }
        else if (this.sourceEmployee.divmanagmentLegalEntity != null && this.sourceEmployee.managmentLegalEntity != null) {

            this.empCreationForm.controls['companyId'].setValue(this.sourceEmployee.divmanagmentLegalEntity.managementStructureId);
            this.empCreationForm.controls['BusinessUnitId'].setValue(this.sourceEmployee.managmentLegalEntity.managementStructureId);

        }
        else if (this.sourceEmployee.managementStructeInfo != null) {

            this.empCreationForm.controls['companyId'].setValue(this.sourceEmployee.managmentLegalEntity.managementStructureId);
        }
        else {
        }

        this.setManagementStrucureData(this.sourceEmployee);
    }*/
    /*

    loadCompanyData() {
        this.companyService.getallCompanyData().subscribe(
            results => this.assigninCOmpanyData(results),

            error => this.onDataLoadFailed(error)
        );
    }
    assigninCOmpanyData(results: any) {

        this.companylist = results[0];
    }*/

    // private loadCurrencyData() {
    //     this.commonService.smartDropDownList('Currency', 'CurrencyId', 'Code').subscribe(res => {
    //         this.allCurrencyData = res.map(x => {
    //             return {
    //                 ...x,
    //                 currencyId: x.value,
    //                 code: x.label
    //             }
    //         });
    //     }, err => {

    //         const errorLog = err;
    //         this.errorMessageHandler(errorLog);
    //     });
    // }

    private loadCurrencyData(strText = '') {
        if (this.arraycurrencylist.length == 0) {
            this.arraycurrencylist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', strText, true, 20000, this.arraycurrencylist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            this.allCurrencyData = response.map(x => {
                return {
                    currencyId: x.value,
                    code: x.label
                }
            });
        }, err => {
            // const errorLog = err;
            // this.errorMessageHandler(errorLog);	
            this.isSpinnerVisible = false;
        });
    }


    filterCurrencyList(event) {
        this.currencyList = this.allCurrencyData;
        if (event.query !== undefined && event.query !== null) {
            const currlist = [...this.allCurrencyData.filter(x => {
                return x.code.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.currencyList = currlist;
        }
    }


    onSelectMethod(event) {
        let d = new Date(Date.parse(event));
        this.sourceEmployee.dateOfBirth = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    }
    checkfirstName(value) {
        const arr = this.allEmployeeinfo;

        return arr.find(e => e.firstName === value);
    }
    checklastName(value) {
        const arr = this.allEmployeeinfo;
        return arr.find(e => e.lastName === value);
    }
    checkfirstNameExists(field_name): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (this.allEmployeeinfo) {
                var res = this.checkfirstName(control.value);
                var msg = true;
                if (res == undefined) {
                    return null;
                }
                else {
                    return { notSame: true }
                }
            }
        }
    }
    checklasttNameExists(field_name): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (this.allEmployeeinfo) {
                var res = this.checklastName(control.value);
                var msg = true;
                if (res == undefined) {
                    return null;
                }
                else {
                    return { notSame: true }
                }
            }
        }
    }
    getEmpInfo(res: any) {
        this.sourceEmployee = res[0][0];
        this.empCreationForm.patchValue({
            employeeExpertiseId: res[0][0].employeeExpertiseId,
            JobTypeId: res[0][0].jobTypeId,
            jobTitleId: res[0][0].jobTitleId,
            startDate: new Date(res[0][0].startDate)
        });
        this.sourceEmployee.startDate = new Date(res[0][0].startDate);
        this.sourceEmpFirst.firstName = res[0][0].firstName;
        this.sourceEmpLast.lastName = res[0][0].lastName;
    }
    onSubmit2() {
        console.log("On Submit date");
        this.isSpinnerVisible = true;
        this.enableSaveBtn = false;
        this.supervisorId;
        this.sourceEmployee.firstName = editValueAssignByCondition('firstName', this.sourceEmployee.firstName);
        this.sourceEmployee.lastName = editValueAssignByCondition('lastName', this.sourceEmployee.lastName);
        this.sourceEmployee.middleName = editValueAssignByCondition('middleName', this.sourceEmployee.middleName);
        this.sourceEmployee.currencyId = this.sourceEmployee.currencyId ? this.sourceEmployee.currencyId.currencyId : null;
        if (this.sourceEmployee.jobTitleId == 0) {
            this.alertService.showMessage(
                "Validation Failed",
                "Job Title is require",
                MessageSeverity.error
            );
            this.isSpinnerVisible = false;
            return;
        }
        if (this.sourceEmployee.employeeExpertiseId == 0) {
            this.alertService.showMessage(
                "Validation Failed",
                "Employee Expertise is require",
                MessageSeverity.error
            );
            this.isSpinnerVisible = false;
            return;
        }
        // if (this.sourceEmployee.currencyId == 0 || this.sourceEmployee.currencyId == null) {
        //     this.alertService.showMessage(
        //         "Validation Failed",
        //         "Currency is require",
        //         MessageSeverity.error
        //     );
        //     this.isSpinnerVisible = false;
        //     return;
        // }
        this.sourceEmployee.jobTitleId = this.sourceEmployee.jobTitleId;
        this.sourceEmployee.employeeExpertiseId = this.sourceEmployee.employeeExpertiseId;
        this.sourceEmployee.hourlyPay = this.sourceEmployee.hourlyPay ? this.sourceEmployee.hourlyPay : null;
        //this.sourceEmployee.startDate = this.empCreationForm.get('startDate').value;
        this.sourceEmployee.startDate = this.sourceEmployee.startDate;
        this.sourceEmployee.SupervisorId = this.supervisorId;
        this.sourceEmployee.stationId = this.sourceEmployee.stationId == 0 ? null : this.sourceEmployee.stationId;
        if (this.sourceEmployee.inMultipleShifts == true) {
            this.sourceEmployee.shiftId = '';
        } else {
            if (this.sourceEmployee.shiftId && this.sourceEmployee.shiftId > 0) {
                this.sourceEmployee.shiftIds = [];
                this.sourceEmployee.shiftIds.push(this.sourceEmployee.shiftId);
            }
            else {
                this.sourceEmployee.shiftIds = [];
            }
            this.sourceEmployee.inMultipleShifts = false;

        }
        this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
        this.sourceEmployee.createdBy = this.userA;
        this.sourceEmployee.updatedBy = this.userA;
        if (this.sourceEmployee.dateOfBirth == undefined) {
            this.sourceEmployee.dateOfBirth = null;
        }

        if (this.sourceEmployee.employeeId) {
            if (this.sourceEmployee.isHourly == true) {
                this.model = { option: 'Hourly' };
                this.sourceEmployee.isHourly = true;
                this.sourceEmployee.hourlyPay = this.sourceEmployee.hourlyPay;
            }
            else {
                this.model = { option: 'Monthly' };
                this.sourceEmployee.isHourly = false;
                this.sourceEmployee.hourlyPay = this.sourceEmployee.hourlyPay;
            }

            this.employeeService.updateEmployee(this.sourceEmployee).subscribe(
                results => {
                    if (results) {
                        this.employeeService.listCollection = results[0];
                        this.loadEditDataAfterUpdate(results[1]);
                        this.employeeService.employeeStored = results[0];
                        this.empUpdate(this.sourceEmployee, results[0]);
                        this.isSpinnerVisible = false;

                    }
                },
                err => {
                    this.isSpinnerVisible = false;
                }
            );
        }
        else {
            this.sourceEmployee.isHourly = this.sourceEmployee.isHourly;
            this.sourceEmployee.HourlyPay = this.sourceEmployee.hourlyPay;
            this.employeeService.newAddEmployee(this.sourceEmployee).subscribe(
                results => {
                    if (results) {
                        this.employeeService.isEditMode = true;
                        this.employeeService.isDisbaleTabs = true;
                        this.employeeService.employeeId = results.employeeId;
                        this.showTitle = 'Employee Added Sucessfully';
                        this.alertService.showMessage("Success", this.showTitle, MessageSeverity.success);
                        this.router.navigateByUrl(`employeesmodule/employeepages/app-employee-general-information-edit/${results.employeeId}`);
                    }
                },
                err => {
                    this.isSpinnerVisible = false;
                });
        }
    }




    removeEmployeeLevaes() {
        for (var i = 0; i < this.sessionLeaveValues.length; i++) {
            var selectedLevae = this.sessionLeaveValues[i];
            var selectedLeaveValues = this.selectedLeaveValues;
            if (selectedLeaveValues.indexOf(selectedLevae) !== -1) {
            } else {
                this.leaveTypeValueRemoved(selectedLevae);
            };
        }
    }
    leaveTypeValueRemoved(selectedLevae) {
        if (this.sourceEmployee.employeeId) {
            this.employeeService.updateEmployee(this.sourceEmployee).subscribe(
                results => {
                    this.empUpdate(this.sourceEmployee, results),
                        this.sourceEmployee.LeaveTypeId = selectedLevae;
                    this.sourceEmployee.EmployeeId = this.sourceEmployee.employeeId;
                    this.employeeService.employeeLeavetypeRemove(this.sourceEmployee).subscribe(
                        results => {
                        },
                        //error => this.onDataLoadFailed(error))
                        error => { this.isSpinnerVisible = false });
                });
        }
    }
    shiftTypeValueRemoved(selectedLevae) {
        this.sourceEmployee.ShiftTypeId = selectedLevae;
        this.sourceEmployee.EmployeeId = this.sourceEmployee.employeeId;
        this.employeeService.employeeshifttypeRemove(this.sourceEmployee).subscribe(
            results => {
            },
            error => { this.isSpinnerVisible = false });
    }

    removeEmployeeShiftValues() {
        for (var i = 0; i < this.sessionShiftValues.length; i++) {
            var selectedShift = this.sessionShiftValues[i];
            var selectedshiftValues = this.selectedshiftValues;
            if (selectedshiftValues.indexOf(selectedShift) !== -1) {
            } else {
            };
        }
    }

    employeeShifttypeUpdate(empId) {
        for (var i = 0; i < this.selectedshiftValues.length; i++) {
            var selectedLevae = this.selectedshiftValues[i];
            var sessionValues = this.sessionShiftValues;
            if (sessionValues.indexOf(selectedLevae) !== -1) {
                if (selectedLevae != 0) {
                    this.newShiftValuetobeAdded(selectedLevae);
                }
            } else {
                if (selectedLevae != 0) {
                    this.newShiftValuetobeAdded(selectedLevae);
                }
            };
        }
    }

    newShiftValuetobeAdded(selectedLevae) {
        if (selectedLevae != null) {
            this.sourceEmployee.ShiftTypeId = selectedLevae;
            this.sourceEmployee.EmployeeId = this.sourceEmployee.employeeId;
            this.employeeService.employeeShifttypeAdd(this.sourceEmployee).subscribe(
                results => {
                },
                error => { this.isSpinnerVisible = false });
        }
    }

    employeeLeavetypeUpdate(empId) {
        this.selectedLeaveValues;
        this.removeEmployeeLevaes();
        for (var i = 0; i < this.selectedLeaveValues.length; i++) {
            var selectedLevae = this.selectedLeaveValues[i];
            var sessionValues = this.sessionLeaveValues;
            if (sessionValues.indexOf(selectedLevae) !== -1) {
            } else {
                this.newValuetobeAdded(selectedLevae);
            };
        }
        var arr = this.sessionLeaveValues;
        var check = this.selectedLeaveValues;
        var found = false;
    }

    newValuetobeAdded(selectedLevae) {
        this.sourceEmployee.LeaveTypeId = selectedLevae;
        this.sourceEmployee.EmployeeId = this.sourceEmployee.employeeId;
        this.employeeService.employeeLeavetypeAdd(this.sourceEmployee).subscribe(
            results => {
            },
            error => { this.isSpinnerVisible = false });
    }

    employeeShifttypeAdd(employeeId) {
        for (var i = 0; i < this.selectedshiftValues.length; i++) {
            var shiftTypeId = this.selectedshiftValues[i];
            if (shiftTypeId != null && shiftTypeId != "") {
                this.sourceEmployee.ShiftTypeId = shiftTypeId;
                this.sourceEmployee.EmployeeId = employeeId;
                this.employeeService.employeeShifttypeAdd(this.sourceEmployee).subscribe(
                    results => {
                    },
                    error => { this.isSpinnerVisible = false });
            }
        }
    }

    employeeLeavetypeAdd(employeeId) {
        this.selectedLeaveValues = this.selectedLeaveValues.filter((el, i, a) => i === a.indexOf(el));
        this.selectedLeaveValues;
        for (var i = 0; i < this.selectedLeaveValues.length; i++) {
            var leaveTypeId = this.selectedLeaveValues[i];
            this.sourceEmployee.LeaveTypeId = leaveTypeId;
            this.sourceEmployee.EmployeeId = employeeId;
            this.employeeService.employeeLeavetypeAdd(this.sourceEmployee).subscribe(
                results => {
                },
                error => { this.isSpinnerVisible = false });
        }
    }
    // onSubmit() {
    //     this.sourceEmployee.firstName;

    //     this.employeeService.newAddEmployee(this.sourceEmployee).subscribe(
    //         results => this.empAdd(this.sourceEmployee, results),

    //         error => this.onDataLoadFailed(error)
    //     );
    // }
    empUpdate(obj: any, res: any) {
        this.showMsg = true;
        this.empId = res.employeeId ? res.employeeId : obj.employeeId;
        this.firstName = res.firstName;
        this.lastName = res.lastName;
        this.showTitle = 'Employee Updated Sucessfully';
        // this.router.navigate(['/employeesmodule/employeepages/app-employee-certification']),
        this.alertService.showMessage("Success", this.showTitle, MessageSeverity.success);
        this.sourceEmpFirst = null;
        // this.loadData();
    }

    empAdd(obj: any, res: any) {
        this.showMsg = true;
        //this.sourceEmployee.reser
        if (res.employeeId) {
            this.employeeService.listCollection = res;
            this.empId = res.employeeId;
            this.firstName = res.firstName;
            this.lastName = res.lastName;
            this.showTitle = 'Employee Added Sucessfully';
            this.alertService.showMessage("Success", this.showTitle, MessageSeverity.success);
            // this.gotoNext();
            this.sourceEmpFirst = null;
            // this.loadData();
        }
        else {
            this.showTitle = 'Some thing went wrong please try again later';
            this.alertService.showMessage("Failure", this.showTitle, MessageSeverity.success);
        }
    }

    singleClick(click) {
        if (click == 'single') {
            this.selectedshiftValues = [];
            this.showsingle = true;
            this.showMultiple = false;
            this.sourceEmployee.inMultipleShifts = false;
        }
        if (click == 'multiple') {
            this.selectedshiftValues = [];
            this.showMultiple = true;
            this.showsingle = false;
            this.sourceEmployee.inMultipleShifts = true;
        }
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    public allWorkFlows: any[] = [];
    private loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.employeeService.getEmployeeNamesList().subscribe(
            results => this.onDataLoadSuccessful(results[0]),
            error => { this.isSpinnerVisible = false }
        );
        this.selectedColumns = this.cols;

    }
    private loadMasterCompanies() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.masterComapnyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error => { this.isSpinnerVisible = false }
        );
    }

    private shift() {
        // this.alertService.startLoadingMessage();
        // this.loadingIndicator = true;
        // this.employeeService.getshift().subscribe(
        //     results => this.onshiftData(results[0]),
        //     error => this.onDataLoadFailed(error)
        // );
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.commonService.autoSuggestionSmartDropDownList('shift', 'ShiftId', 'Description', '', true, 1000, '0', this.currentUserMasterCompanyId).subscribe(res => {
            this.shiftValues = res;
            // this.legalEntityList_Forgrid = res;
            // this.legalEntityList_ForShipping = res;
            // this.legalEntityList_ForBilling= res;
        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);
        });
    }

    private EmployeeTrainingType() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.employeeService.getEmployeeTrainingType().subscribe(
            results => this.onDataLoadSuccessful(results[0]),
            error => { this.isSpinnerVisible = false }
        );
    }
    private EmployeeLeaveType() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.employeeService.getEmployeeLeaveType().subscribe(
            results => this.onLeavedata(results[0]),
            error => { this.isSpinnerVisible = false }
        );
    }
    // private multiLeavelist() {
    //     this.alertService.startLoadingMessage();
    //     this.loadingIndicator = true;

    //     this.employeeService.getEmployeeLeaveType().subscribe(
    //         results => this.onmultiLeavedata(results[0]),
    //         error => this.onDataLoadFailed(error)
    //     );
    // }   

    private multiLeavelist(strText = '') {
        if (this.arraymultileavelist.length == 0) {
            this.arraymultileavelist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('EmployeeLeaveType', 'employeeLeaveTypeId', 'leaveType', strText, true, 2000, this.arraymultileavelist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            this.leavemultiValues = response;
            this.leavemultiValues = this.leavemultiValues.reduce((unique, o) => {
                if (!unique.some(obj => obj.label === o.label)) {
                    unique.push(o);
                }
                return unique;
            }, []);
            let valAirCraft = [];
        }, err => {
            // const errorLog = err;
            // this.errorMessageHandler(errorLog);	
            this.isSpinnerVisible = false;
        });
    }

    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }
    private refresh() {
        this.applyFilter(this.dataSource.filter);
    }
    private onDataLoadSuccessful(getEmployeeCerficationList: any[]) {
        this.alertService.stopLoadingMessage();
        this.dataSource.data = getEmployeeCerficationList;
        this.allEmployeeinfo = getEmployeeCerficationList;
        this.loadingIndicator = false;
    }
    private onCountryloadsuccessfull(getEmployeeCerficationList: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getEmployeeCerficationList;
        this.allCountries = getEmployeeCerficationList;
    }
    private onshiftData(getEmployeeCerficationList: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getEmployeeCerficationList;
        this.allShiftdetails = getEmployeeCerficationList;
        if (this.allShiftdetails.length > 0) {
            this.shiftValues = [];
            for (let i = 0; i < this.allShiftdetails.length; i++)
                this.shiftValues.push(
                    {
                        value: this.allShiftdetails[i].shiftId, label: this.allShiftdetails[i].description
                    },
                );
        }
        let valAirCraft = [];
    }
    private onLeavedata(getEmployeeCerficationList: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getEmployeeCerficationList;
        this.allLeaves = getEmployeeCerficationList;
    }
    private onmultiLeavedata(getMultiLeaveList: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getMultiLeaveList;
        this.allLeaveDetails = getMultiLeaveList;
        if (this.allLeaveDetails.length > 0) {
            for (let i = 0; i < this.allLeaveDetails.length; i++)
                this.leavemultiValues.push(
                    { value: this.allLeaveDetails[i].employeeLeaveTypeId, label: this.allLeaveDetails[i].leaveType },

                );
        }
        this.leavemultiValues = this.leavemultiValues.reduce((unique, o) => {
            if (!unique.some(obj => obj.label === o.label)) {
                unique.push(o);
            }
            return unique;
        }, []);
        let valAirCraft = [];
    }
    getUnique(array) {
        var uniqueArray = [];
        for (var i in array) {
            if (uniqueArray.indexOf(array[i]) === -1) {
                uniqueArray.push(array[i]);
            }
        }
        return uniqueArray;
    }
    patternMobilevalidationWithSpl(event: any) {
        const pattern = /[0-9\+\-()\ ]/;

        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    //private loadJobtitlesData() {
    //    this.alertService.startLoadingMessage();
    //    this.loadingIndicator = true;
    //    this.jobTitleService.getAllJobTitleList().subscribe(
    //        results => this.onJobtitlesDataLoadSuccessful(results[0]),
    //        error => this.onDataLoadFailed(error)
    //    );
    //}
    // private loadJobtitlesData() {
    //     this.alertService.startLoadingMessage();
    //     this.loadingIndicator = true;
    //     this.commonService.smartDropDownList('JobTitle', 'JobTitleId', 'Description').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
    //         this.allJobTitlesinfo = res;
    //     });
    // }


    private loadJobtitlesData(strText = '') {
        //this.alertService.startLoadingMessage();
        //this.loadingIndicator = true;
        if (this.arrayjobtitlelist.length == 0) {
            this.arrayjobtitlelist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('JobTitle', 'JobTitleId', 'Description', strText, true, 2000, this.arrayjobtitlelist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            this.allJobTitlesinfo = response;
        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);		
        });
    }

    private loadjobtypesData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.jobTypeService.getAllJobTypeList().subscribe(
            results => this.onJobtypeDataLoadSuccessful(results[0]),
            error => this.isSpinnerVisible = false
        );
    }
    onJobtypeDataLoadSuccessful(jobTypes: JobType[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allJobTypesinfo = jobTypes
    }
    private onJobtitlesDataLoadSuccessful(jobTitles: JobTitle[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = jobTitles;
        this.allJobTitlesinfo = jobTitles;
    }
    filterJobs(event) {
        this.localCollection = [];
        for (let i = 0; i < this.allJobTypesinfo.length; i++) {
            let jobName = this.allJobTypesinfo[i].jobTypeName;
            if (jobName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(jobName);
            }
        }
    }
    filterEMpExpertise(event) {
        this.localCollection = [];
        for (let i = 0; i < this.allEmployeeExpertiseInfo.length; i++) {
            let empExpertise = this.allEmployeeExpertiseInfo[i].description;
            if (empExpertise.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(empExpertise);
            }
        }
    }
    filterJObTitles(event) {
        this.localCollection = [];
        for (let i = 0; i < this.allJobTitlesinfo.length; i++) {
            let jobtitle = this.allJobTitlesinfo[i].description;
            if (jobtitle.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(jobtitle);
            }
        }
    }

    filterLeaves(event) {
        this.localleaveCollection = [];
        for (let i = 0; i < this.allLeaves.length; i++) {
            let description = this.allLeaves[i].description;
            if (description.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localleaveCollection.push(description);
            }
        }
    }
    //private loademployeesexperties() {
    //    this.alertService.startLoadingMessage();
    //    this.loadingIndicator = true;
    //    this.empservice.getWorkFlows().subscribe(
    //        results => this.onEmpDataLoadSuccessful(results[0]),
    //        error => this.onDataLoadFailed(error)
    //    );
    //}
    // private loademployeesexperties() {
    //     this.alertService.startLoadingMessage();
    //     this.loadingIndicator = true;
    //     this.commonService.smartDropDownList('EmployeeExpertise', 'EmployeeExpertiseId', 'Description').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
    //         this.allEmployeeExpertiseInfo = res;
    //     });
    // }

    private loademployeesexperties(strText = '') {
        if (this.arrayExpertiselist.length == 0) {
            this.arrayExpertiselist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('EmployeeExpertise', 'EmployeeExpertiseId', 'Description', strText, true, 2000, this.arrayExpertiselist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            this.allEmployeeExpertiseInfo = response;
        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);		
        });
    }

    private onEmpDataLoadSuccessful(allWorkFlows: EmployeeExpertise[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.allEmployeeExpertiseInfo = allWorkFlows;
    }
    filterEmployeeNames(event) {

        this.localCollection = [];
        for (let i = 0; i < this.allEmployeeExpertiseInfo.length; i++) {
            let employeeName = this.allEmployeeExpertiseInfo[i].description;
            if (employeeName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(employeeName);
            }
        }
    }
    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.auditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg' });
        this.modal.result.then(() => {
        }, () => { })
    }
    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;
    }
    private onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }
    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceAction.isActive == false;
            this.employeeService.updateEmployee(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.isSpinnerVisible = false)//this.saveFailedHelper(error));
        }
        else {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceAction.isActive == true;
            this.employeeService.updateEmployee(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.isSpinnerVisible = false)//this.saveFailedHelper(error));
        }
    }
    open(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction.isActive = true;
        this.employeeName = "";
        this.modal = this.modalService.open(content, { size: 'lg' });
        this.modal.result.then(() => {
        }, () => { })
    }
    openDelete(content, row) {
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { })
    }
    openjobtype(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        //this.sourceAction = new JobTitle();
        this.sourceAction = new JobType();
        this.sourceAction.isActive = true;
        this.jobName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => { })
    }
    openjobtitle(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new JobTitle();
        this.sourceAction.isActive = true;
        this.jobName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => { })
    }
    openemployeeExpertise(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new EmployeeExpertise();
        this.sourceAction.isActive = true;
        this.employeeName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        });
    }
    openLeaveType(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new EmployeeLeaveType();
        this.sourceAction.isActive = true;
        this.description = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            //}, () => {  
        });
    }
    openEdit(content, row) {
        this.isEditMode = true;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = row;
        this.employeeName = this.sourceAction.employeeName;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { })
    }
    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { })
    }
    openHist(content, row) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.sourceAction = row;
        this.employeeService.historyEmployee(this.sourceAction.employeeId).subscribe(
            results => this.onHistoryLoadSuccessful(results[0], content),
            error => this.isSpinnerVisible = false)// this.saveFailedHelper(error));
    }
    editItemAndCloseModel() {
        if (!(this.sourceEmployee.firstName && this.sourceEmployee.middleName && this.sourceEmployee.employeeIdAsPerPayroll && this.sourceEmployee.stationId
            && this.sourceEmployee.workPhone && this.sourceEmployee.employeeCertifyingStaff && this.sourceEmployee.mobilePhone
        )) {
            this.display = true;
            this.modelValue = true;
        }
        if (this.sourceEmployee.firstName && this.sourceEmployee.middleName && this.sourceEmployee.employeeIdAsPerPayroll && this.sourceEmployee.stationId
            && this.sourceEmployee.workPhone && this.sourceEmployee.employeeCertifyingStaff && this.sourceEmployee.mobilePhone
        ) {
            if (!this.sourceEmployee.employeeId) {
                this.sourceEmployee.createdBy = this.userName;
                this.sourceEmployee.updatedBy = this.userName;
                this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
                this.sourceEmployee.employeeName = this.employeeName;
                this.sourceEmployee.isActive = true;
                if (this.sourceEmployee.singleShift) {
                    this.sourceEmployee.inMultipleShifts = false;
                }
                if (this.sourceEmployee.multiShift) {
                    this.sourceEmployee.inMultipleShifts = true;
                }
                this.employeeService.newAddEmployee(this.sourceEmployee).subscribe(data => {
                    this.sourceEmployee.updatedBy = this.userName;
                    this.localCollection = data;

                    this.employeeService.generalCollection = this.localCollection;
                    this.activeIndex = 0;
                })
                if (this.selectedshiftValues != null) //separting Array whic is having ","
                {
                    this.sourceEmployee.ShiftId = this.selectedshiftValues.toString().split(",");
                }
                if (this.selectedLeaveValues != null) //separting Array whic is having ","
                {
                    this.sourceEmployee.employeeLeaveTypeId = this.selectedLeaveValues.toString().split(",");
                }
            }
            else {
                if (this.selectedshiftValues != null) //separting Array whic is having ","
                {
                    this.sourceEmployee.ShiftId = this.selectedshiftValues.toString().split(",");
                }
                if (this.selectedLeaveValues != null) //separting Array which is having ","
                {
                    this.sourceEmployee.employeeLeaveTypeId = this.selectedLeaveValues.toString().split(",");
                }
                if (this.sourceEmployee.singleShift) {
                    this.sourceEmployee.inMultipleShifts = false;
                }
                if (this.sourceEmployee.multiShift) {
                    this.sourceEmployee.inMultipleShifts = true;
                }
                if (this.sourceEmployee["employeeShift"]) {
                    delete this.sourceEmployee["employeeShift"];
                }
                this.sourceEmployee.updatedBy = this.userName;
                this.sourceEmployee.employeeName = this.employeeName;
                this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
                this.employeeService.updateEmployeeDetails(this.sourceEmployee).subscribe(
                    response => this.saveCompleted(this.sourceEmployee),
                    error => this.isSpinnerVisible = false)//this.saveFailedHelper(error));
                this.activeIndex = 0;
                this.employeeService.indexObj.next(this.activeIndex);
            }
        }
        this.multiLeavelist('')
        //this.modal.close();
    }
    saveJobTitle() {
        this.sourceAction.createdBy = this.userA;
        this.sourceAction.updatedBy = this.userA;
        this.sourceAction.description = this.jobName;
        this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
        this.sourceAction.description = this.jobName;
        this.jobTitleService.newJobTitle(this.sourceAction).subscribe(data => {
            this.loadJobtitlesData('')
            this.showTitle = 'job Title Added Sucessfully';

            ///this.sourceEmployee.reset();
            this.alertService.showMessage("Success", this.showTitle, MessageSeverity.success);
        }, err => {
            this.isSpinnerVisible = false
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);
        });
    }
    saveJobType() {
        if (this.jobTypeName) {
            this.sourceAction.createdBy = this.userA;
            this.sourceAction.updatedBy = this.userA;
            this.sourceAction.jobTypeName = this.jobTypeName;
            this.sourceAction.jobTypeDescription = this.jobTypeDescription;
            this.sourceAction.masterCompanyId =
                this.sourceAction.description = this.jobName;

            this.jobTypeService.newJobType(this.sourceAction).subscribe(data => {
                this.loadJobtitlesData('')
                this.showTitle = 'job Type Added Sucessfully';
                // this.loadjobtypesData();

                ///this.sourceEmployee.reset();
                this.alertService.showMessage("Success", this.showTitle, MessageSeverity.success);
            })

        }
        else {
            this.showTitle = 'Job Title Required';
            this.alertService.showMessage("Failure", this.showTitle, MessageSeverity.error);
        }
    }
    editItemJobCloseModel() {
        this.isSaving = true;
        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.jobName;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.sourceAction.jobTitleId = this.jobName;
            this.jobTitleService.newJobTitle(this.sourceAction).subscribe(data => { this.loadJobtitlesData('') })
        }
        else {
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.jobName;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.jobTitleService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.isSpinnerVisible = false) //this.saveFailedHelper(error));
        }
    }

    editItemLeaveCloseModel() {
        this.isSaving = true;
        if (this.leaveType.toLowerCase().trim() == "") {
            this.alertService.showMessage("Empty", 'Cannot Submit Empty', MessageSeverity.warn);
            return;
        }
        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.leaveType = this.leaveType;
            this.sourceAction.description = this.descriptiontype;
            this.sourceAction.memo = this.memo;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.employeeService.newActionforLeave(this.sourceAction).subscribe(data => {
                this.saveCompleted(this.sourceAction);
                this.sourceEmployee.employeeLeaveTypeId = data.employeeLeaveTypeId;
                // this.EmployeeLeaveType();
                this.multiLeavelist('');
            })
        }
        else {
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.description;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.employeeService.newActionforLeave(this.sourceAction).subscribe(data => {
                this.saveCompleted(this.sourceAction);
                this.sourceEmployee.employeeLeaveTypeId = data.employeeLeaveTypeId;
                // this.EmployeeLeaveType();
                this.multiLeavelist('');
            });
        }
        this.modal.close();
    }
    saveEmpExpertise() {
        this.sourceAction.createdBy = this.userName;
        this.sourceAction.updatedBy = this.userName;
        this.sourceAction.description = this.employeeName;
        this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
        this.sourceAction.isWorksInShop = this.isWorksInShop;
        this.empservice.newAction(this.sourceAction).subscribe(data => {
            this.showTitle = 'Employee Expertise Added Sucessfully';
            ///this.sourceEmployee.reset();
            this.alertService.showMessage("Success", this.showTitle, MessageSeverity.success);
            this.loademployeesexperties('')

        })
    }
    editItemExpertiesCloseModel() {
        this.isSaving = true;
        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.employeeName;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.empservice.newAction(this.sourceAction).subscribe(data => { this.loademployeesexperties('') })
        }
        else {
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.employeeName;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.jobTitleService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.isSpinnerVisible = false) //this.saveFailedHelper(error));
        }
        //s this.modal.close();
    }
    filterfirstName(event) {
        // // this.firstCollection = [];
        // // for (let i = 0; i < this.allEmployeeinfo.length; i++) {
        // //     let firstName = this.allEmployeeinfo[i].firstName;
        // //     if (firstName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        // //         this.firstCollection.push(firstName);
        // //     }
        // // }
        // this.firstNameShow = false;
        // this.firstCollection = this.allEmployeeinfo;
        // if (event.query !== undefined && event.query !== null) {
        //     const emplist = [...this.allEmployeeinfo.filter(x => {
        //         return x.firstName.toLowerCase().includes(event.query.toLowerCase())
        //     })]
        //     this.firstCollection = emplist;
        // }
        if (event.query !== undefined && event.query !== null) {
            this.getAllContactFirstNameSmartDropDown(event.query);
        }
    }
    //already exits first name
    firstnameeventHandler(firstName) {
        if (firstName.firstName != "") {
            let value = firstName.firstName;
            if (this.firstCollection) {
                for (var i in this.firstCollection) {
                    if (this.firstCollection[i]['firstName'] == firstName.firstName) {
                        this.firstNameShow = true;
                        this.sourceEmployee.firstName = '';

                    }
                    //else {
                    //    this.firstNameShow = false;
                    //}
                }
            }
        }
    }
    firstNameSel(firstName) {
        if (firstName.firstName != "") {
            let value = firstName.firstName;
            if (this.firstCollection) {
                for (var i in this.firstCollection) {
                    if (this.firstCollection[i]['firstName'] == firstName.firstName) {
                        this.firstNameShow = true;
                        this.sourceEmployee.firstName = '';
                    }
                    //else {
                    //    this.firstNameShow = false;
                    //}
                }
            }
        }
    }
    filterlastName(event) {
        // this.lastNameCollection = [];
        // for (let i = 0; i < this.allEmployeeinfo.length; i++) {
        //     let lastName = this.allEmployeeinfo[i].lastName;
        //     if (lastName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        //         this.lastNameCollection.push(lastName);
        //     }
        // }
        // this.lastNameCollection = this.allEmployeeinfo;
        // if (event.query !== undefined && event.query !== null) {
        //     const emplist = [...this.allEmployeeinfo.filter(x => {
        //         return x.lastName.toLowerCase().includes(event.query.toLowerCase())
        //     })]
        //     this.lastNameCollection = emplist;
        // }
        if (event.query !== undefined && event.query !== null) {
            this.getAllContactLastNameSmartDropDown(event.query);
        }
    }
    filtermiddleName(event) {
        // this.middleNameCollection = [];
        // for (let i = 0; i < this.allEmployeeinfo.length; i++) {
        //     let middleName = this.allEmployeeinfo[i].middleName;
        //     if (middleName) {
        //         if (middleName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        //             this.middleNameCollection.push(middleName);
        //         }
        //     }
        // }
        // this.middleNameCollection = this.allEmployeeinfo;
        // if (event.query !== undefined && event.query !== null) {
        //     const emplist = [...this.allEmployeeinfo.filter(x => {
        //         return x.middleName
        //         //.toLowerCase().includes(event.query.toLowerCase())
        //     })]
        //     this.middleNameCollection = emplist;
        // }
        if (event.query !== undefined && event.query !== null) {
            this.getAllContactMiddleNameSmartDropDown(event.query);
        }
    }
    filterempIdName(event) {
        this.empIdCollection = [];
        for (let i = 0; i < this.allEmployeeinfo.length; i++) {
            let employeeId = this.allEmployeeinfo[i].employeeId;
            if (employeeId) {
                if (employeeId.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.empIdCollection.push(employeeId);
                }
            }
        }
    }
    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.employeeService.deleteEmployee(this.sourceAction.employeeId).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error => this.isSpinnerVisible = false)//this.saveFailedHelper(error));
        this.modal.close();
    }
    filterEmployees(event) {
        this.localCollection = [];
        for (let i = 0; i < this.allEmployeeinfo.length; i++) {
            let employeeName = this.allEmployeeinfo[i].employeeName;
            if (employeeName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(employeeName);
            }
        }
    }
    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }
    private saveCompleted(user?: any) {
        this.isSaving = false;

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
        }
        this.loadData();
    }
    private saveSuccessHelper(role?: any) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
        this.loadData();
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    getBUList2(id) {
        var companyId = id;
        if (this.updateMode == false) {
            this.sourceEmployee.buisinessUnitId = "";
            this.sourceEmployee.departmentId = "";
            this.sourceEmployee.divisionId = "";
            this.sourceEmployee.managementStructureId = companyId;
            this.departmentList = [];
            this.divisionlist = [];
            this.bulist = [];
            for (let i = 0; i < this.allManagemtninfo.length; i++) {
                if (this.allManagemtninfo[i].parentId == companyId) {
                    this.bulist.push(this.allManagemtninfo[i])
                }
            }
            //this.empCreationForm.controls['BusinessUnitId'].setValue(this.sourceEmployee.biumanagmentLegalEntityId);
            //this.empCreationForm.controls['divisionId'].setValue(this.sourceEmployee.divmanagmentLegalEntityId);
            //this.empCreationForm.controls['departmentId'].setValue(this.sourceEmployee.managmentLegalEntityId);
        }
        else {
            this.bulist = [];
            this.departmentList = [];
            this.divisionlist = [];
            for (let i = 0; i < this.allManagemtninfo.length; i++) {
                if (this.allManagemtninfo[i].parentId == companyId) {
                    this.bulist.push(this.allManagemtninfo[i])
                }
            }
            this.empCreationForm.controls['BusinessUnitId'].setValue(this.sourceEmployee.biumanagmentLegalEntityId);
        }
    }
    // getBUList(event) {
    //     var companyId = this.empCreationForm.controls['companyId'].value;
    //     if (this.updateMode == false) {
    //         this.sourceEmployee.buisinessUnitId = "";
    //         this.sourceEmployee.departmentId = "";
    //         this.sourceEmployee.divisionId = "";
    //         this.sourceEmployee.managementStructureId = companyId;
    //         this.departmentList = [];
    //         this.divisionlist = [];
    //         this.bulist = [];
    //         for (let i = 0; i < this.allManagemtninfo.length; i++) {
    //             if (this.allManagemtninfo[i].parentId == companyId) {
    //                 this.bulist.push(this.allManagemtninfo[i])
    //             }
    //         }
    //     }
    //     else {
    //         this.sourceEmployee.buisinessUnitId = null;
    //         this.empCreationForm.controls['BusinessUnitId'].setValue(null);
    //         this.empCreationForm.controls['divisionId'].setValue(null);
    //         this.empCreationForm.controls['departmentId'].setValue(null);
    //         this.sourceEmployee.departmentId = "";
    //         this.sourceEmployee.divisionId = "";
    //         this.sourceEmployee.buisinessUnitId = "";
    //         this.bulist = [];
    //         this.departmentList = [];
    //         this.divisionlist = [];
    //         for (let i = 0; i < this.allManagemtninfo.length; i++) {
    //             if (this.allManagemtninfo[i].parentId == companyId) {
    //                 this.bulist.push(this.allManagemtninfo[i])
    //             }
    //         }
    //     }
    // }
    // getDepartmentlist(value) {
    //     var splitted = value.split(": ");
    //     var businessUnitId = this.empCreationForm.controls['BusinessUnitId'].value;
    //     if (this.updateMode == false) {
    //         this.sourceEmployee.departmentId = "";
    //         this.sourceEmployee.divisionId = "";
    //         this.sourceEmployee.managementStructureId = businessUnitId;
    //         this.departmentList = [];
    //         this.divisionlist = [];
    //         for (let i = 0; i < this.allManagemtninfo.length; i++) {
    //             if (this.allManagemtninfo[i].parentId == businessUnitId) {
    //                 this.departmentList.push(this.allManagemtninfo[i]);
    //             }
    //         }
    //     }
    //     else {
    //         this.empCreationForm.controls['divisionId'].setValue(null);
    //         this.empCreationForm.controls['departmentId'].setValue(null);
    //         this.sourceEmployee.departmentId = "";
    //         this.sourceEmployee.divisionId = "";
    //         this.departmentList = [];
    //         this.divisionlist = [];
    //         for (let i = 0; i < this.allManagemtninfo.length; i++) {
    //             if (this.allManagemtninfo[i].parentId == businessUnitId) {
    //                 this.departmentList.push(this.allManagemtninfo[i]);
    //             }
    //         }
    //     }
    // }
    getDepartmentlist2(value) {
        if (this.updateMode == false) {
            this.sourceEmployee.departmentId = "";
            this.sourceEmployee.divisionId = "";
            this.sourceEmployee.managementStructureId = value;
            this.departmentList = [];
            this.divisionlist = [];

            for (let i = 0; i < this.allManagemtninfo.length; i++) {
                if (this.allManagemtninfo[i].parentId == value) {

                    this.departmentList.push(this.allManagemtninfo[i]);
                }
            }
            //this.empCreationForm.controls['BusinessUnitId'].setValue(this.sourceEmployee.biumanagmentLegalEntityId);
            //this.empCreationForm.controls['divisionId'].setValue(this.sourceEmployee.divmanagmentLegalEntityId);
            //this.empCreationForm.controls['departmentId'].setValue(this.sourceEmployee.managmentLegalEntityId);
        }
        else {
            this.departmentList = [];
            this.divisionlist = [];
            for (let i = 0; i < this.allManagemtninfo.length; i++) {
                if (this.allManagemtninfo[i].parentId == value) {
                    this.departmentList.push(this.allManagemtninfo[i]);
                }
            }
            //this.empCreationForm.controls['BusinessUnitId'].setValue(this.sourceEmployee.biumanagmentLegalEntityId);
            this.empCreationForm.controls['divisionId'].setValue(this.sourceEmployee.divmanagmentLegalEntityId);
            //this.empCreationForm.controls['departmentId'].setValue(this.sourceEmployee.managmentLegalEntityId);
        }
    }
    //     getDivisionlist(value) {
    //    var departmentId = this.empCreationForm.controls['divisionId'].value;;
    //         if (this.updateMode == false) {
    //             this.sourceEmployee.divisionId = "";
    //             this.sourceEmployee.managementStructureId = departmentId;
    //             this.divisionlist = [];
    //             for (let i = 0; i < this.allManagemtninfo.length; i++) {
    //                 if (this.allManagemtninfo[i].parentId == departmentId) {
    //                     this.divisionlist.push(this.allManagemtninfo[i]);
    //                 }
    //             }

    //         }
    //         else {
    //             this.divisionlist = [];
    //             for (let i = 0; i < this.allManagemtninfo.length; i++) {
    //                 if (this.allManagemtninfo[i].parentId == departmentId) {
    //                     this.divisionlist.push(this.allManagemtninfo[i]);
    //                 }
    //             }
    //                this.empCreationForm.controls['departmentId'].setValue(this.sourceEmployee.managmentLegalEntityId);
    //         }

    //     }
    divisionChange(divisionId) {
        this.sourceEmployee.managementStructureId = divisionId;
    }

    public AddLeavedata(imObj) {
        for (let i = 0; i < this.selectedLeaveValues.length; i++) {
            imObj.employeeLeaveTypeId = this.selectedLeaveValues[i];
            this.employeeService.Addmultileaves(imObj).subscribe(data => {
                this.localCollection = data;
            })
        }
    }
    public AddShiftsdata(employeeObject) {
        for (let i = 0; i < this.selectedshiftValues.length; i++) {
            employeeObject.employeeShiftId = this.selectedshiftValues[i];
            this.employeeService.AddShifts(employeeObject).subscribe(data => {
                this.localCollection = data;
            })
        }
    }
    setManagementStrucureData(obj) {
        this.managementStructureData = [];
        this.checkMSParents(obj.managementStructureId);
        if (this.sourceEmployee) {
            //this.empCreationForm.controls['companyid'].setValue(this.sourceEmployee.compmanagmentlegalentityid);

            //this.empCreationForm.controls['businessunitid'].setValue(this.sourceEmployee.biumanagmentlegalentityid);
            //this.empCreationForm.controls['divisionid'].setValue(this.sourceEmployee.divmanagmentlegalentityid);
            //this.empCreationForm.controls['departmentid'].setValue(this.sourceEmployee.managmentlegalentityid);
            this.getBUList2(this.sourceEmployee.compmanagmentLegalEntityId);
            this.getDepartmentlist2(this.sourceEmployee.biumanagmentLegalEntityId);
            this.getDivisionlist(this.sourceEmployee.managmentLegalEntityId);
            //          this.empCreationForm.controls['BusinessUnitId'].setValue(this.sourceEmployee.biumanagmentLegalEntityId);
            //this.empCreationForm.controls['divisionId'].setValue(this.sourceEmployee.divmanagmentLegalEntityId);
            //this.empCreationForm.controls['departmentId'].setValue(this.sourceEmployee.managmentLegalEntityId);
        };
        //if (this.managementStructureData.length == 4) {
        //    this.sourceEmployee.companyId = this.managementStructureData[3];
        //    this.sourceEmployee.buisinessUnitId = this.managementStructureData[2];
        //    this.sourceEmployee.departmentId = this.managementStructureData[1];
        //    this.sourceEmployee.divisionId = this.managementStructureData[0];
        //    this.getBUList2(this.sourceEmployee.companyId);
        //    this.getDepartmentlist2(this.sourceEmployee.buisinessUnitId);
        //    this.getDivisionlist(this.sourceEmployee.departmentId);
        //}
        //if (this.managementStructureData.length == 3) {
        //    this.sourceEmployee.companyId = this.managementStructureData[2];
        //    this.sourceEmployee.buisinessUnitId = this.managementStructureData[1];
        //    this.sourceEmployee.departmentId = this.managementStructureData[0];
        //    this.getBUList2(this.sourceEmployee.companyId);
        //    this.getDepartmentlist2(this.sourceEmployee.buisinessUnitId);
        //}
        //if (this.managementStructureData.length == 2) {
        //    this.sourceEmployee.companyId = this.managementStructureData[1];
        //    this.sourceEmployee.buisinessUnitId = this.managementStructureData[0];
        //    this.getBUList2(this.sourceEmployee.companyId);
        //}
        //if (this.managementStructureData.length == 1) {
        //    this.sourceEmployee.companyId = this.managementStructureData[0];
        //}

    }
    checkMSParents(msId) {
        this.managementStructureData.push(msId);
        for (let a = 0; a < this.allManagemtninfo.length; a++) {
            if (this.allManagemtninfo[a].managementStructureId == msId) {
                if (this.allManagemtninfo[a].parentId) {
                    this.checkMSParents(this.allManagemtninfo[a].parentId);
                    break;
                }
            }
        }
    }
    onKeyUpFirstNames(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            this.sourceEmployee.firstName = value;
            if (this.selectedFirstName) {
                if (value == this.selectedFirstName.toLowerCase()) {
                    this.disableSaveFirstName = true;
                }
                else {
                    this.disableSaveFirstName = false;
                }
            }
        }
    }
    handlePayType(value) {
        this.sourceEmployee.hourlyPay = '';
        if (value == 'Hourly') {
            this.hourly = true;
            this.yearly = false;
            this.sourceEmployee.isHourly = true;
            // this.sourceEmployee.HourlyPay = this.sourceEmployee.hourlyPay;
        }
        else {
            this.yearly = true;
            this.hourly = false;
            this.sourceEmployee.isHourly = false;
        }
    }
    onSelectFirstName(event) {
        if (this.allEmployeeinfo) {
            for (let i = 0; i < this.allEmployeeinfo.length; i++) {
                if (event == this.allEmployeeinfo[i].firstName) {
                    this.sourceEmployee.firstName = event;
                    this.disableSaveFirstName = true;
                    this.selectedFirstName = event;
                }
            }
        }
    }
    onKeyUpMiddleNames(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.disableSaveName) {
                if (value == this.disableSaveName.toLowerCase()) {
                    this.disableSaveMiddleName = true;
                }
                else {
                    this.disableSaveMiddleName = false;
                }
            }
        }
    }
    onSelectMiddleName(event) {
        if (this.allEmployeeinfo) {
            for (let i = 0; i < this.allEmployeeinfo.length; i++) {
                if (event == this.allEmployeeinfo[i].middleName) {
                    this.sourceEmployee.middleName = event;
                    this.disableSaveMiddleName = true;
                    this.disableSaveName = event;
                }

            }
        }
    }
    onBlurLeaveName(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.allLeaves) {
                for (let i = 0; i < this.allLeaves.length; i++) {
                    if (value == this.allLeaves[i].description) {
                        this.sourceEmployee.description = event;
                        this.disableSaveLeaveName = true;
                        this.disableSaveName = event;
                    }
                }
            }
        }
    }
    onSelectLeaveName(event) {
        if (this.allLeaves) {
            for (let i = 0; i < this.allLeaves.length; i++) {
                if (event == this.allLeaves[i].description) {
                    this.sourceEmployee.description = event;
                    this.disableSaveLeaveName = true;

                    this.disableSaveName = event;
                }
            }
        }
    }
    onSelectJob(event) {
        if (this.allJobTitlesinfo) {
            for (let i = 0; i < this.allJobTitlesinfo.length; i++) {
                if (event == this.allJobTitlesinfo[i].description) {
                    this.sourceEmployee.jobName = event;
                    this.disableJobTitle = true;
                    this.selectedActionName = event;
                }
            }
        }
    }
    onSelectEmpExpertise(event) {

        let validBtn = false;
        if (this.allJobTitlesinfo) {
            for (let i = 0; i < this.allEmployeeExpertiseInfo.length; i++) {
                if (event == this.allEmployeeExpertiseInfo[i].description) {
                    // this.sourceEmployee.jobName = event;
                    this.disableExpTitle = true;
                }
            }
        }
    }
    onJobTypeKeyUP() {
        if (this.jobTypeName != "") {
            this.disableJobType = false;
        } else {
            this.disableJobType = true;
        }
    }
    onEmpExpertiseKeyUP() {
        if (this.employeeName != "") {
            this.disableExpTitle = false;
        } else {
            this.disableExpTitle = true;
        }
    }
    onKeyJob(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedActionName) {
                if (value == this.selectedActionName.toLowerCase()) {
                    this.disableJobTitle = true;
                }
                else {
                    this.disableJobTitle = false;
                }
            }

        }
    }
    onjobTitleKeyUP() {
        if (this.jobName != "") {
            this.disableJobTitle = false;
        } else {
            this.disableJobTitle = true;
        }
    }
    onKeyUpExp(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedActionName) {
                if (value == this.selectedActionName.toLowerCase()) {
                    this.disableExpTitle = true;
                }
                else {
                    this.disableExpTitle = false;
                }
            }
        }
    }
    onSelectExp(event) {
        if (this.allEmployeeExpertiseInfo) {
            for (let i = 0; i < this.allEmployeeExpertiseInfo.length; i++) {
                if (event == this.allEmployeeExpertiseInfo[i].description) {
                    this.sourceEmployee.employeeName = event;
                    this.disableExpTitle = true;
                    this.selectedActionName = event;
                }
            }
        }
    }
    // async getAllStationData() {
    //     await this.commonService.smartDropDownList('EmployeeStation', 'EmployeeStationId', 'StationName').subscribe(res => {
    //         this.getAllAllStationInfodrpData = res;
    //     });
    // }

    getAllStationData(strText = '') {
        if (this.arrayAllStationlist.length == 0) {
            this.arrayAllStationlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('EmployeeStation', 'EmployeeStationId', 'StationName', strText, true, 20000, this.arrayAllStationlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            this.getAllAllStationInfodrpData = response;
        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);		
        });
    }


    onChangeemployeeExpertiseId(event) {
        if (event.target.value != "") {
            let value = event.target.value;
            value = value.split(":");
            if (this.allEmployeeExpertiseInfo) {
                for (let i = 0; i < this.allEmployeeExpertiseInfo.length; i++) {
                    if (value[1] == this.allEmployeeExpertiseInfo[i].employeeExpertiseId) {
                        this.empIsWorksInShop = this.allEmployeeExpertiseInfo[i].isWorksInShop;
                    }
                }
            }
        }
    }
    onKeyUpLeaveNames(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.disableSaveName) {
                if (value == this.disableSaveName.toLowerCase()) {
                    this.disableSaveLeaveName = true;

                }
                else {
                    this.disableSaveLeaveName = false;

                }
            }

        }
    }
    formateNumber(obj) {
        obj.hourlyPay = obj.hourlyPay ? formatNumberAsGlobalSettingsModule(obj.hourlyPay, 2) : '';
    }
    nextClick(nextOrPrevious) {
        // if (this.formdata.form.dirty) {
        if (this.enableSaveBtn == true) {
            this.nextOrPreviousTab = nextOrPrevious;
            let content = this.tabRedirectConfirmationModal;
            this.modal = this.modalService.open(content, { size: "sm" });
        } else {
            this.router.navigate([`/employeesmodule/employeepages/app-employee-certification-edit/${this.empId}`])
            this.activeIndex = 1;
            this.employeeService.indexObj.next(this.activeIndex);
        }
    }
    redirectToTab() {
        this.dismissModel();
        this.onSubmit2();
        if (this.employeeService.isEditMode == true) {
            this.router.navigate([`/employeesmodule/employeepages/app-employee-certification-edit/${this.empId}`])
            this.activeIndex = 1;
            this.employeeService.indexObj.next(this.activeIndex);
        } else {
            this.gotoNext();
        }
    }
    redirectToTabWithoutSave() {
        this.dismissModel();
        if (this.employeeService.isEditMode == true) {
            this.router.navigate([`/employeesmodule/employeepages/app-employee-certification-edit/${this.empId}`])
            this.activeIndex = 1;
            this.employeeService.indexObj.next(this.activeIndex);
        } else {
            this.gotoNext();
        }
    }
    gotoNext() {
        // this.employeeService.listCollection = this.local;
        this.activeIndex = 1;
        this.employeeService.indexObj.next(this.activeIndex);
        var data = { "empId": this.empId, "firstName": this.firstName, "lastName": this.lastName };
        var stringData = JSON.stringify(data);
        var encryptedData = btoa(JSON.stringify(data));
        this.route.navigate(['/employeesmodule/employeepages/app-employee-certification'], { queryParams: { order: this.empId, 'firstName': this.firstName, 'lastName': this.lastName }, skipLocationChange: true });
        // this.route.navigate(['/employeesmodule/employeepages/app-employee-certification'], { queryParams: { order: stringData } });
    }
}
// redirectToTab(){
//     this.dismissModel();
//     this.stopmulticlicks = true;
//     this.tab.emit('Contacts');

//     setTimeout(() => {
//         this.stopmulticlicks = false;
//     }, 500)
// }