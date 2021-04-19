"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.EmployeeGeneralInformationComponent = void 0;
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var animations_1 = require("../../../../services/animations");
var alert_service_1 = require("../../../../services/alert.service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var jobtitle_model_1 = require("../../../../models/jobtitle.model");
var jobtype_model_1 = require("../../../../models/jobtype.model");
var employeeexpertise_model_1 = require("../../../../models/employeeexpertise.model");
var EmployeeLeaveTypeModel_1 = require("../../../../models/EmployeeLeaveTypeModel");
var db_Keys_1 = require("../../../../services/db-Keys");
var autocomplete_1 = require("../../../../generic/autocomplete");
var rxjs_1 = require("rxjs");
var validation_pattern_1 = require("../../../../validations/validation-pattern");
var ModuleConstant_1 = require("src/app/generic/ModuleConstant");
var EmployeeGeneralInformationComponent = /** @class */ (function () {
    function EmployeeGeneralInformationComponent(fb, Actroute, translationService, router, jobTypeService, jobTitleService, empservice, authService, modalService, activeModal, _fb, route, alertService, employeeService, jobTitleService1, dialog, masterComapnyService, localStorage, companyService, currencyService, commonService) {
        var _this = this;
        this.fb = fb;
        this.Actroute = Actroute;
        this.translationService = translationService;
        this.router = router;
        this.jobTypeService = jobTypeService;
        this.jobTitleService = jobTitleService;
        this.empservice = empservice;
        this.authService = authService;
        this.modalService = modalService;
        this.activeModal = activeModal;
        this._fb = _fb;
        this.route = route;
        this.alertService = alertService;
        this.employeeService = employeeService;
        this.jobTitleService1 = jobTitleService1;
        this.dialog = dialog;
        this.masterComapnyService = masterComapnyService;
        this.localStorage = localStorage;
        this.companyService = companyService;
        this.currencyService = currencyService;
        this.commonService = commonService;
        this.dateTime = new Date();
        this.phonePattern = validation_pattern_1.phonePattern();
        this.yearly = false;
        this.hourly = false;
        this.shiftValues = [];
        this.isEnableNext = false;
        this.isSpinnerVisible = false;
        this.leavemultiValues = [];
        this.allShiftValues = [];
        this.allleaveInfo = [];
        this.localleaveCollection = [];
        this.enableSaveBtn = false;
        this.allMultipleLeaves = [];
        this.disableJobTitle = true;
        this.disableJobType = true;
        this.disableExpTitle = true;
        this.display = false;
        this.modelValue = false;
        this.employeeIdTemp = "Creating";
        this.displayedColumns = ['employeeId', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
        this.allEmployeeinfo = [];
        this.allComapnies = [];
        this.sourceAction = {};
        this.auditHisory = [];
        this.title = "Create";
        this.localCollection = [];
        /** Actions ctor */
        this.allManagemtninfo = [];
        this.alllegalEntityInfo = [];
        this.maincompanylist = [];
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.desableJobTypeSave = true;
        this.departmentList = [];
        this.bulist = [];
        this.divisionlist = [];
        this.Active = "Active";
        this.allAircraftManufacturer = [];
        this.arrayExpertiselist = [];
        this.arrayAllStationlist = [];
        this.arraycurrencylist = [];
        this.arraymultileavelist = [];
        this.sourceEmployee = {};
        this.updateMode = false;
        this.showMsg = false;
        this.nextOrPreviousTab = "Next";
        this.supervisorId = 0;
        this.allCurrencyData = [];
        this.radioItems = [];
        this.model = { option: '' };
        this.payTypeValid = false;
        this.isWorksInShop = false;
        this.empIsWorksInShop = false;
        this.employeeDisplayView = 'Create Employee';
        this.empCreationForm = new forms_1.FormGroup({
            firstname: new forms_1.FormControl('firstName', forms_1.Validators.minLength(1)),
            middleName: new forms_1.FormControl('middleName', forms_1.Validators.minLength(1)),
            lastName: new forms_1.FormControl('lastName', forms_1.Validators.minLength(1)),
            jobTitleId: new forms_1.FormControl('jobTitleId', [forms_1.Validators.required, forms_1.Validators.minLength(1)]),
            employeeExpertiseId: new forms_1.FormControl('employeeExpertiseId', forms_1.Validators.minLength(1)),
            JobTypeId: new forms_1.FormControl('JobTypeId', forms_1.Validators.minLength(1)),
            companyId: new forms_1.FormControl('companyId', [(forms_1.Validators.required, forms_1.Validators.minLength(1))]),
            startDate: new forms_1.FormControl('startDate', forms_1.Validators.minLength(1)),
            hourlyPay: new forms_1.FormControl('hourlyPay', forms_1.Validators.required),
            email: new forms_1.FormControl('email', forms_1.Validators.required),
            userName: new forms_1.FormControl('userName', forms_1.Validators.required)
        });
        this.selectedLeaveValuesAssigned = [];
        this.managementStructure = {
            companyId: 0,
            buId: 0,
            divisionId: 0,
            departmentId: 0
        };
        this.arrayjobtitlelist = [];
        this.disableMagmtStruct = true;
        this.legalEntityList = [];
        this.currencyObject = {};
        this.currentFirstName = {};
        this.currentLastName = {};
        this.currentMiddleName = {};
        this.arrayContactlist = [];
        this.isEditContent = false;
        this.tab = new core_1.EventEmitter();
        this.onDestroy$ = new rxjs_1.Subject();
        this.isAdd = true;
        this.isEdit = true;
        this.allWorkFlows = [];
        this.displayedColumns.push('action');
        this.radioItems = ['Hourly', 'Monthly'];
        this.empCreationForm = fb.group({
            'firstName': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(1), this.checkfirstNameExists('firstName')])],
            'middleName': [null],
            'lastName': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(1), this.checklasttNameExists('lastName')])],
            'jobTitleId': [forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(1)])],
            'employeeExpertiseId': [forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(1)])],
            'JobTypeId': [0, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(1)])],
            'companyId': [0, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(1)])],
            'hourlyPay': [0, forms_1.Validators.compose([forms_1.Validators.required])],
            'BusinessUnitId': [0],
            'divisionId': [0],
            'departmentId': [0],
            'email': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern('[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{3,}')])],
            'userName': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern('/^[a-z\d]{5,12}$/i')])]
        });
        if (this.employeeService.listCollection != null && this.employeeService.isEditMode == true) {
            this.employeeDisplayView = 'Edit Employee';
            this.loadingIndicator = true;
        }
        var user = this.localStorage.getDataObject(db_Keys_1.DBkeys.CURRENT_USER);
        this.userA = user.userName;
        var control = new forms_1.FormControl('1', forms_1.Validators.pattern('[a-zA-Z ]*'));
        this.dataSource = new material_1.MatTableDataSource();
        this.translationService.closeCmpny = false;
        this.Actroute.queryParams
            .filter(function (params) { return params.order; })
            .subscribe(function (params) {
            _this.empId = params.order;
            _this.firstName = params.firstname;
            _this.lastName = params.lastname;
            if (_this.empId != undefined || _this.empId != null) {
            }
        });
        this.isAdd = this.authService.checkPermission([ModuleConstant_1.ModuleConstants.Employees_GeneralInformation + '.' + ModuleConstant_1.PermissionConstants.Add]);
        this.isEdit = this.authService.checkPermission([ModuleConstant_1.ModuleConstants.Employees_GeneralInformation + '.' + ModuleConstant_1.PermissionConstants.Update]);
    }
    EmployeeGeneralInformationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isSpinnerVisible = true;
        this.employeeId = this.Actroute.snapshot.paramMap.get('id');
        if (this.employeeId) {
            this.employeeService.employeeId = this.employeeId;
            this.isEditContent = true;
            this.employeeService.isEditMode = true;
            this.employeeService.isDisbaleTabs = true;
            this.employeeService.currentUrl = this.employeeService.currentUrl = "/employeesmodule/employeepages/app-employee-general-information-edit/" + this.employeeId;
        }
        else {
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
        this.loadData();
        this.employeeid = this.employeeService.listCollection ? this.employeeService.listCollection.employeeId : this.employeeId;
        if (this.employeeid && this.employeeid != null && this.employeeid != 0) {
            this.isEnableNext = true;
            setTimeout(function () {
                _this.isSpinnerVisible = true;
                _this.loadEditData();
            }, 1200);
        }
        else {
            this.loadJobtitlesData('');
            this.loademployeesexperties('');
            this.getAllStationData('');
            this.loadCurrencyData('');
            this.multiLeavelist('');
            this.sourceEmployee.jobTitleId = 0;
            this.sourceEmployee.employeeExpertiseId = 0;
            this.sourceEmployee.stationId = 0;
            this.getManagementStructureDetails(this.currentUserManagementStructureId, this.loginempId);
            this.isSpinnerVisible = false;
        }
    };
    EmployeeGeneralInformationComponent.prototype.getManagementStructureDetails = function (id, empployid, editMSID) {
        var _this = this;
        if (empployid === void 0) { empployid = 0; }
        if (editMSID === void 0) { editMSID = 0; }
        empployid = empployid == 0 ? this.employeeId : empployid;
        editMSID = this.isEditMode ? editMSID = id : 0;
        this.commonService.getManagmentStrctureData(id, empployid, editMSID).subscribe(function (response) {
            if (response) {
                var result = response;
                if (result[0] && result[0].level == 'Level1') {
                    _this.maincompanylist = result[0].lstManagmentStrcture;
                    _this.managementStructure.companyId = result[0].managementStructureId;
                    _this.sourceEmployee.managementStructureId = result[0].managementStructureId;
                    _this.managementStructure.buId = 0;
                    _this.managementStructure.divisionId = 0;
                    _this.managementStructure.departmentId = 0;
                    _this.bulist = [];
                    _this.divisionlist = [];
                    _this.departmentList = [];
                }
                else {
                    _this.managementStructure.companyId = 0;
                    _this.managementStructure.buId = 0;
                    _this.managementStructure.divisionId = 0;
                    _this.managementStructure.departmentId = 0;
                    _this.maincompanylist = [];
                    _this.bulist = [];
                    _this.divisionlist = [];
                    _this.departmentList = [];
                }
                if (result[1] && result[1].level == 'Level2') {
                    _this.bulist = result[1].lstManagmentStrcture;
                    _this.managementStructure.buId = result[1].managementStructureId;
                    _this.sourceEmployee.managementStructureId = result[1].managementStructureId;
                    _this.managementStructure.divisionId = 0;
                    _this.managementStructure.departmentId = 0;
                    _this.divisionlist = [];
                    _this.departmentList = [];
                }
                else {
                    if (result[1] && result[1].level == 'NEXT') {
                        _this.bulist = result[1].lstManagmentStrcture;
                    }
                    _this.managementStructure.buId = 0;
                    _this.managementStructure.divisionId = 0;
                    _this.managementStructure.departmentId = 0;
                    _this.divisionlist = [];
                    _this.departmentList = [];
                }
                if (result[2] && result[2].level == 'Level3') {
                    _this.divisionlist = result[2].lstManagmentStrcture;
                    _this.managementStructure.divisionId = result[2].managementStructureId;
                    _this.sourceEmployee.managementStructureId = result[2].managementStructureId;
                    _this.managementStructure.departmentId = 0;
                    _this.departmentList = [];
                }
                else {
                    if (result[2] && result[2].level == 'NEXT') {
                        _this.divisionlist = result[2].lstManagmentStrcture;
                    }
                    _this.managementStructure.divisionId = 0;
                    _this.managementStructure.departmentId = 0;
                    _this.departmentList = [];
                }
                if (result[3] && result[3].level == 'Level4') {
                    _this.departmentList = result[3].lstManagmentStrcture;
                    ;
                    _this.managementStructure.departmentId = result[3].managementStructureId;
                    _this.sourceEmployee.managementStructureId = result[3].managementStructureId;
                }
                else {
                    _this.managementStructure.departmentId = 0;
                    if (result[3] && result[3].level == 'NEXT') {
                        _this.departmentList = result[3].lstManagmentStrcture;
                    }
                }
                _this.isSpinnerVisible = false;
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);
        });
    };
    EmployeeGeneralInformationComponent.prototype.getBUList = function (legalEntityId) {
        var _this = this;
        this.managementStructure.buId = 0;
        this.managementStructure.divisionId = 0;
        this.managementStructure.departmentId = 0;
        this.bulist = [];
        this.divisionlist = [];
        this.departmentList = [];
        if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
            this.sourceEmployee.managementStructureId = legalEntityId;
            this.managementStructure.companyId = legalEntityId;
            this.commonService.getManagementStructurelevelWithEmployee(legalEntityId, this.loginempId).subscribe(function (res) {
                _this.bulist = res;
            });
        }
        else {
            this.sourceEmployee.managementStructureId = 0;
            this.managementStructure.companyId = 0;
        }
    };
    EmployeeGeneralInformationComponent.prototype.enableSave = function () {
        this.enableSaveBtn = true;
    };
    EmployeeGeneralInformationComponent.prototype.getDivisionlist = function (buId) {
        var _this = this;
        this.divisionlist = [];
        this.departmentList = [];
        this.managementStructure.divisionId = 0;
        this.managementStructure.departmentId = 0;
        if (buId != 0 && buId != null && buId != undefined) {
            this.sourceEmployee.managementStructureId = buId;
            this.managementStructure.buId = buId;
            this.commonService.getManagementStructurelevelWithEmployee(buId, this.loginempId).subscribe(function (res) {
                _this.divisionlist = res;
            });
        }
        else {
            this.sourceEmployee.managementStructureId = this.managementStructure.companyId;
        }
    };
    EmployeeGeneralInformationComponent.prototype.getDepartmentlist = function (divisionId) {
        var _this = this;
        this.managementStructure.departmentId = 0;
        this.departmentList = [];
        if (divisionId != 0 && divisionId != null && divisionId != undefined) {
            this.managementStructure.divisionId = divisionId;
            this.sourceEmployee.managementStructureId = divisionId;
            this.commonService.getManagementStructurelevelWithEmployee(divisionId, this.loginempId).subscribe(function (res) {
                _this.departmentList = res;
            });
        }
        else {
            this.sourceEmployee.managementStructureId = this.managementStructure.buId;
            this.managementStructure.divisionId = 0;
        }
    };
    EmployeeGeneralInformationComponent.prototype.getDepartmentId = function (departmentId) {
        if (departmentId != 0 && departmentId != null && departmentId != undefined) {
            this.sourceEmployee.managementStructureId = departmentId;
            this.managementStructure.departmentId = departmentId;
        }
        else {
            this.sourceEmployee.managementStructureId = this.managementStructure.divisionId;
            this.managementStructure.departmentId = 0;
        }
    };
    Object.defineProperty(EmployeeGeneralInformationComponent.prototype, "currentUserManagementStructureId", {
        get: function () {
            return this.authService.currentUser
                ? this.authService.currentUser.managementStructureId
                : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EmployeeGeneralInformationComponent.prototype, "currentUserMasterCompanyId", {
        get: function () {
            return this.authService.currentUser
                ? this.authService.currentUser.masterCompanyId
                : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EmployeeGeneralInformationComponent.prototype, "loginempId", {
        get: function () {
            return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
        },
        enumerable: false,
        configurable: true
    });
    EmployeeGeneralInformationComponent.prototype.getAllContactFirstNameSmartDropDown = function (strText, contactName) {
        var _this = this;
        if (strText === void 0) { strText = ''; }
        if (contactName === void 0) { contactName = ''; }
        if (this.arrayContactlist.length == 0) {
            this.arrayContactlist.push(0);
        }
        this.commonService.autoCompleteSmartDropDownEmployeeList('firstName', strText, true, this.arrayContactlist.join(), this.currentUserMasterCompanyId).subscribe(function (response) {
            var endResult = [];
            for (var resInd = 0; resInd < response.length; resInd++) {
                var alreadyExist = false;
                for (var endInd = 0; endInd < endResult.length; endInd++) {
                    if (endResult[endInd].firstName.toLowerCase() == response[resInd].label.toLowerCase()) {
                        alreadyExist = true;
                    }
                }
                if (!alreadyExist) {
                    endResult.push({ firstName: response[resInd].label });
                }
            }
            _this.firstCollection = endResult;
            if (contactName != '') {
                _this.sourceEmployee.firstName = autocomplete_1.getObjectByValue('firstName', contactName, _this.firstCollection);
            }
            // }, error => this.saveFailedHelper(error));
        }, function (error) { return _this.isSpinnerVisible = false; });
    };
    EmployeeGeneralInformationComponent.prototype.getAllContactMiddleNameSmartDropDown = function (strText, contactName) {
        var _this = this;
        if (strText === void 0) { strText = ''; }
        if (contactName === void 0) { contactName = ''; }
        if (this.arrayContactlist.length == 0) {
            this.arrayContactlist.push(0);
        }
        this.commonService.autoCompleteSmartDropDownEmployeeList('middlename', strText, true, this.arrayContactlist.join(), this.currentUserMasterCompanyId).subscribe(function (response) {
            var endResult = [];
            for (var resInd = 0; resInd < response.length; resInd++) {
                var alreadyExist = false;
                for (var endInd = 0; endInd < endResult.length; endInd++) {
                    if (endResult[endInd].middleName.toLowerCase() == response[resInd].label.toLowerCase()) {
                        alreadyExist = true;
                    }
                }
                if (!alreadyExist) {
                    endResult.push({ middleName: response[resInd].label });
                }
            }
            _this.middleNameCollection = endResult;
            if (contactName != '') {
                _this.sourceEmployee.middleName = autocomplete_1.getObjectByValue('middleName', contactName, _this.middleNameCollection);
            }
            //}, error => this.saveFailedHelper(error));
        }, function (error) { return _this.isSpinnerVisible = false; });
    };
    EmployeeGeneralInformationComponent.prototype.getAllContactLastNameSmartDropDown = function (strText, contactName) {
        var _this = this;
        if (strText === void 0) { strText = ''; }
        if (contactName === void 0) { contactName = ''; }
        if (this.arrayContactlist.length == 0) {
            this.arrayContactlist.push(0);
        }
        this.commonService.autoCompleteSmartDropDownEmployeeList('lastname', strText, true, this.arrayContactlist.join(), this.currentUserMasterCompanyId).subscribe(function (response) {
            var endResult = [];
            for (var resInd = 0; resInd < response.length; resInd++) {
                var alreadyExist = false;
                for (var endInd = 0; endInd < endResult.length; endInd++) {
                    if (endResult[endInd].lastName.toLowerCase() == response[resInd].label.toLowerCase()) {
                        alreadyExist = true;
                    }
                }
                if (!alreadyExist) {
                    endResult.push({ lastName: response[resInd].label });
                }
            }
            _this.lastNameCollection = endResult;
            if (contactName != '') {
                _this.sourceEmployee.lastName = autocomplete_1.getObjectByValue('lastName', contactName, _this.lastNameCollection);
            }
            _this.isSpinnerVisible = false;
        }, function (error) { return _this.isSpinnerVisible = false; });
    };
    EmployeeGeneralInformationComponent.prototype.getInactiveObjectOnEdit = function (string, id, originalData, tableName, primaryColumn, description) {
        var _this = this;
        if (id) {
            for (var i = 0; i < originalData.length; i++) {
                if (originalData[i][string] == id) {
                    return id;
                }
            }
            var obj_1 = {};
            this.commonService.smartDropDownGetObjectById(tableName, primaryColumn, description, primaryColumn, id).subscribe(function (res) {
                obj_1 = res[0];
                if (tableName == 'EmployeeExpertise') {
                    _this.allEmployeeExpertiseInfo = __spreadArrays(originalData, [obj_1]);
                }
                else if (tableName == 'JobTitle') {
                    _this.allJobTitlesinfo = __spreadArrays(originalData, [obj_1]);
                }
            }, function (err) {
                //const errorLog = err;
                //this.errorMessageHandler(errorLog);
                _this.isSpinnerVisible = false;
            });
            return id;
        }
        else {
            return null;
        }
    };
    EmployeeGeneralInformationComponent.prototype.errorMessageHandler = function (log) {
        this.isSpinnerVisible = false;
        var errorLog = log;
        if (errorLog.error) {
            this.alertService.showMessage("Validation Failed", errorLog.error, alert_service_1.MessageSeverity.error);
            return;
        }
        var msg = '';
        if (errorLog.message) {
            if (errorLog.error && errorLog.error.errors.length > 0) {
                for (var i = 0; i < errorLog.error.errors.length; i++) {
                    msg = msg + errorLog.error.errors[i].message + '<br/>';
                }
            }
            this.alertService.showMessage(errorLog.error.message, msg, alert_service_1.MessageSeverity.error);
        }
        else {
            this.alertService.showMessage('Error', log.error, alert_service_1.MessageSeverity.error);
        }
    };
    EmployeeGeneralInformationComponent.prototype.getDetailsInactive = function (res) {
        this.sourceEmployee.employeeExpertiseId = this.getInactiveObjectOnEdit('value', res.employeeExpertiseId, this.allEmployeeExpertiseInfo, 'EmployeeExpertise', 'EmployeeExpertiseId', 'Description');
        this.sourceEmployee.jobTitleId = this.getInactiveObjectOnEdit('value', res.jobTitleId, this.allJobTitlesinfo, 'JobTitle', 'JobTitleId', 'Description');
    };
    EmployeeGeneralInformationComponent.prototype.loadEditData = function () {
        var _this = this;
        this.isSpinnerVisible = true;
        this.employeeService.toGetEmployeeDetailsByEmpId(this.employeeid).subscribe(function (res) {
            _this.empEditdetailsdata = res;
            _this.updateMode = true;
            _this.sourceEmployee = _this.empEditdetailsdata;
            _this.selectedLeaveValues = _this.sourceEmployee.leaveTypeIds;
            _this.getManagementStructureDetails(_this.sourceEmployee.managementStructureId, _this.loginempId, _this.sourceEmployee.managementStructureId);
            if (_this.sourceEmployee.employeeId) {
                _this.empId = _this.sourceEmployee.employeeId;
            }
            _this.employeeIdTemp = _this.sourceEmployee.employeeCode ? _this.sourceEmployee.employeeCode : 'Creating';
            _this.empCreationForm.controls['JobTypeId'].setValue(_this.sourceEmployee.jobTypeId);
            _this.supervisorId = _this.sourceEmployee.supervisorId;
            if (_this.employeeId) {
                _this.sourceEmployee.startDate = new Date(_this.sourceEmployee.startDate);
            }
            else {
                _this.sourceEmployee.startDate = new Date();
            }
            _this.sourceEmployee.dateOfBirth = _this.sourceEmployee.dateOfBirth ? new Date(_this.sourceEmployee.dateOfBirth) : '';
            if (_this.local) {
                _this.employeeService.employeeCollection = _this.local;
            }
            var payType = _this.sourceEmployee.isHourly;
            if (_this.sourceEmployee.isHourly == true) {
                _this.hourly = true;
                _this.yearly = false;
                _this.model = { option: 'Hourly' };
                _this.sourceEmployee.hourlyPay = _this.sourceEmployee.hourlyPay ? autocomplete_1.formatNumberAsGlobalSettingsModule(_this.sourceEmployee.hourlyPay, 2) : '';
                _this.isMonthly = false;
            }
            if (_this.sourceEmployee.isHourly == false) {
                _this.yearly = true;
                _this.hourly = false;
                _this.model = { option: 'Monthly' };
                _this.sourceEmployee.hourlyPay = _this.sourceEmployee.hourlyPay ? autocomplete_1.formatNumberAsGlobalSettingsModule(_this.sourceEmployee.hourlyPay, 2) : '';
                _this.isMonthly = true;
            }
            if (_this.sourceEmployee.inMultipleShifts == true) {
                _this.sourceEmployee.multiShift = "multiShift";
                _this.showsingle = false;
                _this.showMultiple = true;
            }
            else {
                if (_this.sourceEmployee.shiftIds && _this.sourceEmployee.shiftIds.length > 0) {
                    _this.sourceEmployee.shiftId = _this.sourceEmployee.shiftIds[0];
                    _this.sourceEmployee.singleShift = "singleShift";
                    _this.showsingle = true;
                    _this.showMultiple = false;
                }
                else {
                    _this.showsingle = false;
                    _this.showMultiple = false;
                    _this.sourceEmployee.inMultipleShifts = null;
                    _this.sourceEmployee.multiShift = "";
                    _this.sourceEmployee.singleShift = "";
                }
            }
            _this.sourceEmployee.employeeCertifyingStaff = _this.sourceEmployee.employeeCertifyingStaff;
            // this.sourceEmployee.firstName = this.sourceEmployee.firstNameArray[0];
            _this.arrayContactlist.push(_this.employeeId);
            _this.getAllContactFirstNameSmartDropDown('', _this.sourceEmployee.firstNameArray[0].firstName);
            _this.getAllContactMiddleNameSmartDropDown('', _this.sourceEmployee.middleNameArray[0].middleName);
            _this.getAllContactLastNameSmartDropDown('', _this.sourceEmployee.lastNameArray[0].lastName);
            // this.sourceEmployee.middleName = this.sourceEmployee.middleNameArray[0];
            // this.sourceEmployee.lastName = this.sourceEmployee.lastNameArray[0];
            _this.sourceEmployee.currencyId = _this.sourceEmployee.currency[0];
            _this.loadingIndicator = false;
            if (_this.sourceEmployee.jobTitleId && _this.sourceEmployee.jobTitleId > 0) {
                _this.arrayjobtitlelist.push(_this.sourceEmployee.jobTitleId);
            }
            _this.loadJobtitlesData('');
            if (_this.sourceEmployee.employeeExpertiseId && _this.sourceEmployee.employeeExpertiseId > 0) {
                _this.arrayExpertiselist.push(_this.sourceEmployee.employeeExpertiseId);
            }
            _this.loademployeesexperties('');
            if (_this.sourceEmployee.stationId && _this.sourceEmployee.stationId > 0) {
                _this.arrayAllStationlist.push(_this.sourceEmployee.stationId);
            }
            _this.getAllStationData('');
            if (_this.sourceEmployee.currencyId && _this.sourceEmployee.currencyId > 0) {
                _this.arraycurrencylist.push(_this.sourceEmployee.currencyId);
            }
            _this.loadCurrencyData('');
            if (_this.sourceEmployee.leaveTypeIds) {
                _this.arraymultileavelist.push(_this.sourceEmployee.leaveTypeIds);
            }
            _this.multiLeavelist('');
            // setTimeout(() => {
            //     this.getDetailsInactive(res);
            // },
            //     1200);
            _this.isEnableNext = true;
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    EmployeeGeneralInformationComponent.prototype.loadEditDataAfterUpdate = function (res) {
        var _this = this;
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
        this.supervisorId = this.sourceEmployee.supervisor[0];
        if (this.employeeId) {
            this.sourceEmployee.startDate = new Date(this.sourceEmployee.startDate);
        }
        else {
            this.sourceEmployee.startDate = new Date();
        }
        this.sourceEmployee.dateOfBirth = this.sourceEmployee.dateOfBirth ? new Date(this.sourceEmployee.dateOfBirth) : '';
        if (this.local) {
            this.employeeService.employeeCollection = this.local;
        }
        var payType = this.sourceEmployee.isHourly;
        if (this.sourceEmployee.isHourly == true) {
            this.hourly = true;
            this.yearly = false;
            this.model = { option: 'Hourly' };
            this.sourceEmployee.hourlyPay = this.sourceEmployee.hourlyPay ? autocomplete_1.formatNumberAsGlobalSettingsModule(this.sourceEmployee.hourlyPay, 2) : '';
            this.isMonthly = false;
        }
        if (this.sourceEmployee.isHourly == false) {
            this.yearly = true;
            this.hourly = false;
            this.model = { option: 'Monthly' };
            this.sourceEmployee.hourlyPay = this.sourceEmployee.hourlyPay ? autocomplete_1.formatNumberAsGlobalSettingsModule(this.sourceEmployee.hourlyPay, 2) : '';
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
        this.arrayContactlist.push(this.employeeId);
        this.sourceEmployee.employeeCertifyingStaff = this.sourceEmployee.employeeCertifyingStaff;
        this.getAllContactFirstNameSmartDropDown('', this.sourceEmployee.firstNameArray[0].firstName);
        this.getAllContactMiddleNameSmartDropDown('', this.sourceEmployee.middleNameArray[0].middleName);
        this.getAllContactLastNameSmartDropDown('', this.sourceEmployee.lastNameArray[0].lastName);
        this.sourceEmployee.currencyId = this.sourceEmployee.currency[0];
        this.loadingIndicator = false;
        setTimeout(function () {
            _this.getDetailsInactive(res);
        }, 1200);
        this.isSpinnerVisible = false;
    };
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
    EmployeeGeneralInformationComponent.prototype.loadCurrencyData = function (strText) {
        var _this = this;
        if (strText === void 0) { strText = ''; }
        if (this.arraycurrencylist.length == 0) {
            this.arraycurrencylist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', strText, true, 0, this.arraycurrencylist.join(), this.currentUserMasterCompanyId).subscribe(function (response) {
            _this.allCurrencyData = response.map(function (x) {
                return {
                    currencyId: x.value,
                    code: x.label
                };
            });
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    EmployeeGeneralInformationComponent.prototype.filterCurrencyList = function (event) {
        this.currencyList = this.allCurrencyData;
        if (event.query !== undefined && event.query !== null) {
            var currlist = __spreadArrays(this.allCurrencyData.filter(function (x) {
                return x.code.toLowerCase().includes(event.query.toLowerCase());
            }));
            this.currencyList = currlist;
        }
    };
    EmployeeGeneralInformationComponent.prototype.filterSupervisorList = function (event) {
        this.supervisorList = this.allEmployeeinfo;
        if (event.query !== undefined && event.query !== null) {
            var supervisorlist = __spreadArrays(this.allEmployeeinfo.filter(function (x) {
                return x.name.toLowerCase().includes(event.query.toLowerCase());
            }));
            this.supervisorList = supervisorlist;
        }
    };
    EmployeeGeneralInformationComponent.prototype.onSelectMethod = function (event) {
        var d = new Date(Date.parse(event));
        this.sourceEmployee.dateOfBirth = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
    };
    EmployeeGeneralInformationComponent.prototype.checkfirstName = function (value) {
        var arr = this.allEmployeeinfo;
        return arr.find(function (e) { return e.firstName === value; });
    };
    EmployeeGeneralInformationComponent.prototype.checklastName = function (value) {
        var arr = this.allEmployeeinfo;
        return arr.find(function (e) { return e.lastName === value; });
    };
    EmployeeGeneralInformationComponent.prototype.checkfirstNameExists = function (field_name) {
        var _this = this;
        return function (control) {
            if (_this.allEmployeeinfo) {
                var res = _this.checkfirstName(control.value);
                var msg = true;
                if (res == undefined) {
                    return null;
                }
                else {
                    return { notSame: true };
                }
            }
        };
    };
    EmployeeGeneralInformationComponent.prototype.checklasttNameExists = function (field_name) {
        var _this = this;
        return function (control) {
            if (_this.allEmployeeinfo) {
                var res = _this.checklastName(control.value);
                var msg = true;
                if (res == undefined) {
                    return null;
                }
                else {
                    return { notSame: true };
                }
            }
        };
    };
    EmployeeGeneralInformationComponent.prototype.getEmpInfo = function (res) {
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
    };
    EmployeeGeneralInformationComponent.prototype.onSubmit2 = function () {
        var _this = this;
        console.log("On Submit date");
        this.isSpinnerVisible = true;
        this.enableSaveBtn = false;
        this.supervisorId;
        this.sourceEmployee.firstName = autocomplete_1.editValueAssignByCondition('firstName', this.sourceEmployee.firstName);
        this.sourceEmployee.lastName = autocomplete_1.editValueAssignByCondition('lastName', this.sourceEmployee.lastName);
        this.sourceEmployee.middleName = autocomplete_1.editValueAssignByCondition('middleName', this.sourceEmployee.middleName);
        this.sourceEmployee.currencyId = this.sourceEmployee.currencyId ? this.sourceEmployee.currencyId.currencyId : null;
        if (this.sourceEmployee.jobTitleId == 0) {
            this.alertService.showMessage("Validation Failed", "Job Title is require", alert_service_1.MessageSeverity.error);
            this.isSpinnerVisible = false;
            return;
        }
        if (this.sourceEmployee.employeeExpertiseId == 0) {
            this.alertService.showMessage("Validation Failed", "Employee Expertise is require", alert_service_1.MessageSeverity.error);
            this.isSpinnerVisible = false;
            return;
        }
        this.sourceEmployee.jobTitleId = this.sourceEmployee.jobTitleId;
        this.sourceEmployee.employeeExpertiseId = this.sourceEmployee.employeeExpertiseId;
        this.sourceEmployee.hourlyPay = this.sourceEmployee.hourlyPay ? this.sourceEmployee.hourlyPay : null;
        if (this.sourceEmployee.startDate) {
            var d = new Date(this.sourceEmployee.startDate);
            this.sourceEmployee.startDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
            ;
        }
        if (this.sourceEmployee.dateOfBirth) {
            var d = new Date(this.sourceEmployee.dateOfBirth);
            this.sourceEmployee.dateOfBirth = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
        }
        this.sourceEmployee.SupervisorId = this.supervisorId.employeeId;
        this.sourceEmployee.stationId = this.sourceEmployee.stationId == 0 ? null : this.sourceEmployee.stationId;
        if (this.sourceEmployee.inMultipleShifts == true) {
            this.sourceEmployee.shiftId = '';
        }
        else {
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
            this.employeeService.updateEmployee(this.sourceEmployee).subscribe(function (results) {
                if (results) {
                    _this.employeeService.listCollection = results[0];
                    _this.loadEditDataAfterUpdate(results[1]);
                    _this.employeeService.employeeStored = results[0];
                    _this.empUpdate(_this.sourceEmployee, results[0]);
                    _this.isSpinnerVisible = false;
                }
            }, function (err) {
                _this.isSpinnerVisible = false;
            });
        }
        else {
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
            this.employeeService.newAddEmployee(this.sourceEmployee).subscribe(function (results) {
                if (results) {
                    _this.employeeService.isEditMode = true;
                    _this.employeeService.isDisbaleTabs = true;
                    _this.employeeService.employeeId = results.employeeId;
                    _this.showTitle = 'Employee Added Sucessfully';
                    _this.alertService.showMessage("Success", _this.showTitle, alert_service_1.MessageSeverity.success);
                    _this.router.navigateByUrl("employeesmodule/employeepages/app-employee-general-information-edit/" + results.employeeId);
                }
            }, function (err) {
                _this.isSpinnerVisible = false;
            });
        }
    };
    EmployeeGeneralInformationComponent.prototype.removeEmployeeLevaes = function () {
        for (var i = 0; i < this.sessionLeaveValues.length; i++) {
            var selectedLevae = this.sessionLeaveValues[i];
            var selectedLeaveValues = this.selectedLeaveValues;
            if (selectedLeaveValues.indexOf(selectedLevae) !== -1) {
            }
            else {
                this.leaveTypeValueRemoved(selectedLevae);
            }
            ;
        }
    };
    EmployeeGeneralInformationComponent.prototype.leaveTypeValueRemoved = function (selectedLevae) {
        var _this = this;
        if (this.sourceEmployee.employeeId) {
            this.employeeService.updateEmployee(this.sourceEmployee).subscribe(function (results) {
                _this.empUpdate(_this.sourceEmployee, results),
                    _this.sourceEmployee.LeaveTypeId = selectedLevae;
                _this.sourceEmployee.EmployeeId = _this.sourceEmployee.employeeId;
                _this.employeeService.employeeLeavetypeRemove(_this.sourceEmployee).subscribe(function (results) {
                }, 
                //error => this.onDataLoadFailed(error))
                function (error) { _this.isSpinnerVisible = false; });
            });
        }
    };
    EmployeeGeneralInformationComponent.prototype.shiftTypeValueRemoved = function (selectedLevae) {
        var _this = this;
        this.sourceEmployee.ShiftTypeId = selectedLevae;
        this.sourceEmployee.EmployeeId = this.sourceEmployee.employeeId;
        this.employeeService.employeeshifttypeRemove(this.sourceEmployee).subscribe(function (results) {
        }, function (error) { _this.isSpinnerVisible = false; });
    };
    EmployeeGeneralInformationComponent.prototype.removeEmployeeShiftValues = function () {
        for (var i = 0; i < this.sessionShiftValues.length; i++) {
            var selectedShift = this.sessionShiftValues[i];
            var selectedshiftValues = this.selectedshiftValues;
            if (selectedshiftValues.indexOf(selectedShift) !== -1) {
            }
            else {
            }
            ;
        }
    };
    EmployeeGeneralInformationComponent.prototype.employeeShifttypeUpdate = function (empId) {
        for (var i = 0; i < this.selectedshiftValues.length; i++) {
            var selectedLevae = this.selectedshiftValues[i];
            var sessionValues = this.sessionShiftValues;
            if (sessionValues.indexOf(selectedLevae) !== -1) {
                if (selectedLevae != 0) {
                    this.newShiftValuetobeAdded(selectedLevae);
                }
            }
            else {
                if (selectedLevae != 0) {
                    this.newShiftValuetobeAdded(selectedLevae);
                }
            }
            ;
        }
    };
    EmployeeGeneralInformationComponent.prototype.newShiftValuetobeAdded = function (selectedLevae) {
        var _this = this;
        if (selectedLevae != null) {
            this.sourceEmployee.ShiftTypeId = selectedLevae;
            this.sourceEmployee.EmployeeId = this.sourceEmployee.employeeId;
            this.employeeService.employeeShifttypeAdd(this.sourceEmployee).subscribe(function (results) {
            }, function (error) { _this.isSpinnerVisible = false; });
        }
    };
    EmployeeGeneralInformationComponent.prototype.employeeLeavetypeUpdate = function (empId) {
        this.selectedLeaveValues;
        this.removeEmployeeLevaes();
        for (var i = 0; i < this.selectedLeaveValues.length; i++) {
            var selectedLevae = this.selectedLeaveValues[i];
            var sessionValues = this.sessionLeaveValues;
            if (sessionValues.indexOf(selectedLevae) !== -1) {
            }
            else {
                this.newValuetobeAdded(selectedLevae);
            }
            ;
        }
        var arr = this.sessionLeaveValues;
        var check = this.selectedLeaveValues;
        var found = false;
    };
    EmployeeGeneralInformationComponent.prototype.newValuetobeAdded = function (selectedLevae) {
        var _this = this;
        this.sourceEmployee.LeaveTypeId = selectedLevae;
        this.sourceEmployee.EmployeeId = this.sourceEmployee.employeeId;
        this.employeeService.employeeLeavetypeAdd(this.sourceEmployee).subscribe(function (results) {
        }, function (error) { _this.isSpinnerVisible = false; });
    };
    EmployeeGeneralInformationComponent.prototype.employeeShifttypeAdd = function (employeeId) {
        var _this = this;
        for (var i = 0; i < this.selectedshiftValues.length; i++) {
            var shiftTypeId = this.selectedshiftValues[i];
            if (shiftTypeId != null && shiftTypeId != "") {
                this.sourceEmployee.ShiftTypeId = shiftTypeId;
                this.sourceEmployee.EmployeeId = employeeId;
                this.employeeService.employeeShifttypeAdd(this.sourceEmployee).subscribe(function (results) {
                }, function (error) { _this.isSpinnerVisible = false; });
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.employeeLeavetypeAdd = function (employeeId) {
        var _this = this;
        this.selectedLeaveValues = this.selectedLeaveValues.filter(function (el, i, a) { return i === a.indexOf(el); });
        this.selectedLeaveValues;
        for (var i = 0; i < this.selectedLeaveValues.length; i++) {
            var leaveTypeId = this.selectedLeaveValues[i];
            this.sourceEmployee.LeaveTypeId = leaveTypeId;
            this.sourceEmployee.EmployeeId = employeeId;
            this.employeeService.employeeLeavetypeAdd(this.sourceEmployee).subscribe(function (results) {
            }, function (error) { _this.isSpinnerVisible = false; });
        }
    };
    // onSubmit() {
    //     this.sourceEmployee.firstName;
    //     this.employeeService.newAddEmployee(this.sourceEmployee).subscribe(
    //         results => this.empAdd(this.sourceEmployee, results),
    //         error => this.onDataLoadFailed(error)
    //     );
    // }
    EmployeeGeneralInformationComponent.prototype.empUpdate = function (obj, res) {
        this.showMsg = true;
        this.empId = res.employeeId ? res.employeeId : obj.employeeId;
        this.firstName = res.firstName;
        this.lastName = res.lastName;
        this.showTitle = 'Employee Updated Sucessfully';
        // this.router.navigate(['/employeesmodule/employeepages/app-employee-certification']),
        this.alertService.showMessage("Success", this.showTitle, alert_service_1.MessageSeverity.success);
        this.sourceEmpFirst = null;
        // this.loadData();
    };
    EmployeeGeneralInformationComponent.prototype.empAdd = function (obj, res) {
        this.showMsg = true;
        //this.sourceEmployee.reser
        if (res.employeeId) {
            this.employeeService.listCollection = res;
            this.empId = res.employeeId;
            this.firstName = res.firstName;
            this.lastName = res.lastName;
            this.showTitle = 'Employee Added Sucessfully';
            this.alertService.showMessage("Success", this.showTitle, alert_service_1.MessageSeverity.success);
            // this.gotoNext();
            this.sourceEmpFirst = null;
            // this.loadData();
        }
        else {
            this.showTitle = 'Some thing went wrong please try again later';
            this.alertService.showMessage("Failure", this.showTitle, alert_service_1.MessageSeverity.success);
        }
    };
    EmployeeGeneralInformationComponent.prototype.singleClick = function (click) {
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
    };
    EmployeeGeneralInformationComponent.prototype.ngAfterViewInit = function () {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    };
    EmployeeGeneralInformationComponent.prototype.loadData = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.employeeService.getEmployeeNamesList(this.currentUserMasterCompanyId).subscribe(function (results) { return _this.onDataLoadSuccessful(results[0]); }, function (error) { _this.isSpinnerVisible = false; });
        this.selectedColumns = this.cols;
    };
    EmployeeGeneralInformationComponent.prototype.loadMasterCompanies = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.masterComapnyService.getMasterCompanies().subscribe(function (results) { return _this.onDataMasterCompaniesLoadSuccessful(results[0]); }, function (error) { _this.isSpinnerVisible = false; });
    };
    EmployeeGeneralInformationComponent.prototype.shift = function () {
        var _this = this;
        // this.alertService.startLoadingMessage();
        // this.loadingIndicator = true;
        // this.employeeService.getshift().subscribe(
        //     results => this.onshiftData(results[0]),
        //     error => this.onDataLoadFailed(error)
        // );
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.commonService.autoSuggestionSmartDropDownList('shift', 'ShiftId', 'Description', '', true, 1000, '0', this.currentUserMasterCompanyId).subscribe(function (res) {
            _this.shiftValues = res;
            // this.legalEntityList_Forgrid = res;
            // this.legalEntityList_ForShipping = res;
            // this.legalEntityList_ForBilling= res;
        }, function (err) {
            _this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);
        });
    };
    EmployeeGeneralInformationComponent.prototype.EmployeeTrainingType = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.employeeService.getEmployeeTrainingType().subscribe(function (results) { return _this.onDataLoadSuccessful(results[0]); }, function (error) { _this.isSpinnerVisible = false; });
    };
    EmployeeGeneralInformationComponent.prototype.EmployeeLeaveType = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.employeeService.getEmployeeLeaveType().subscribe(function (results) { return _this.onLeavedata(results[0]); }, function (error) { _this.isSpinnerVisible = false; });
    };
    // private multiLeavelist() {
    //     this.alertService.startLoadingMessage();
    //     this.loadingIndicator = true;
    //     this.employeeService.getEmployeeLeaveType().subscribe(
    //         results => this.onmultiLeavedata(results[0]),
    //         error => this.onDataLoadFailed(error)
    //     );
    // }   
    EmployeeGeneralInformationComponent.prototype.multiLeavelist = function (strText) {
        var _this = this;
        if (strText === void 0) { strText = ''; }
        if (this.arraymultileavelist.length == 0) {
            this.arraymultileavelist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('EmployeeLeaveType', 'employeeLeaveTypeId', 'leaveType', strText, true, 2000, this.arraymultileavelist.join(), this.currentUserMasterCompanyId).subscribe(function (response) {
            _this.leavemultiValues = response;
            _this.leavemultiValues = _this.leavemultiValues.reduce(function (unique, o) {
                if (!unique.some(function (obj) { return obj.label === o.label; })) {
                    unique.push(o);
                }
                return unique;
            }, []);
            var valAirCraft = [];
        }, function (err) {
            // const errorLog = err;
            // this.errorMessageHandler(errorLog);	
            _this.isSpinnerVisible = false;
        });
    };
    EmployeeGeneralInformationComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue;
    };
    EmployeeGeneralInformationComponent.prototype.refresh = function () {
        this.applyFilter(this.dataSource.filter);
    };
    EmployeeGeneralInformationComponent.prototype.onDataLoadSuccessful = function (getEmployeeCerficationList) {
        this.alertService.stopLoadingMessage();
        this.dataSource.data = getEmployeeCerficationList;
        this.allEmployeeinfo = getEmployeeCerficationList;
        this.loadingIndicator = false;
    };
    EmployeeGeneralInformationComponent.prototype.onCountryloadsuccessfull = function (getEmployeeCerficationList) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getEmployeeCerficationList;
        this.allCountries = getEmployeeCerficationList;
    };
    EmployeeGeneralInformationComponent.prototype.onshiftData = function (getEmployeeCerficationList) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getEmployeeCerficationList;
        this.allShiftdetails = getEmployeeCerficationList;
        if (this.allShiftdetails.length > 0) {
            this.shiftValues = [];
            for (var i = 0; i < this.allShiftdetails.length; i++)
                this.shiftValues.push({
                    value: this.allShiftdetails[i].shiftId, label: this.allShiftdetails[i].description
                });
        }
        var valAirCraft = [];
    };
    EmployeeGeneralInformationComponent.prototype.onLeavedata = function (getEmployeeCerficationList) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getEmployeeCerficationList;
        this.allLeaves = getEmployeeCerficationList;
    };
    EmployeeGeneralInformationComponent.prototype.onmultiLeavedata = function (getMultiLeaveList) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getMultiLeaveList;
        this.allLeaveDetails = getMultiLeaveList;
        if (this.allLeaveDetails.length > 0) {
            for (var i = 0; i < this.allLeaveDetails.length; i++)
                this.leavemultiValues.push({ value: this.allLeaveDetails[i].employeeLeaveTypeId, label: this.allLeaveDetails[i].leaveType });
        }
        this.leavemultiValues = this.leavemultiValues.reduce(function (unique, o) {
            if (!unique.some(function (obj) { return obj.label === o.label; })) {
                unique.push(o);
            }
            return unique;
        }, []);
        var valAirCraft = [];
    };
    EmployeeGeneralInformationComponent.prototype.getUnique = function (array) {
        var uniqueArray = [];
        for (var i in array) {
            if (uniqueArray.indexOf(array[i]) === -1) {
                uniqueArray.push(array[i]);
            }
        }
        return uniqueArray;
    };
    EmployeeGeneralInformationComponent.prototype.patternMobilevalidationWithSpl = function (event) {
        var pattern = /[0-9\+\-()\ ]/;
        var inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    };
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
    EmployeeGeneralInformationComponent.prototype.loadJobtitlesData = function (strText) {
        var _this = this;
        if (strText === void 0) { strText = ''; }
        //this.alertService.startLoadingMessage();
        //this.loadingIndicator = true;
        if (this.arrayjobtitlelist.length == 0) {
            this.arrayjobtitlelist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('JobTitle', 'JobTitleId', 'Description', strText, true, 2000, this.arrayjobtitlelist.join(), this.currentUserMasterCompanyId).subscribe(function (response) {
            _this.allJobTitlesinfo = response;
        }, function (err) {
            _this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);		
        });
    };
    EmployeeGeneralInformationComponent.prototype.loadjobtypesData = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.jobTypeService.getAllJobTypeList().subscribe(function (results) { return _this.onJobtypeDataLoadSuccessful(results[0]); }, function (error) { return _this.isSpinnerVisible = false; });
    };
    EmployeeGeneralInformationComponent.prototype.onJobtypeDataLoadSuccessful = function (jobTypes) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allJobTypesinfo = jobTypes;
    };
    EmployeeGeneralInformationComponent.prototype.onJobtitlesDataLoadSuccessful = function (jobTitles) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = jobTitles;
        this.allJobTitlesinfo = jobTitles;
    };
    EmployeeGeneralInformationComponent.prototype.filterJobs = function (event) {
        this.localCollection = [];
        for (var i = 0; i < this.allJobTypesinfo.length; i++) {
            var jobName = this.allJobTypesinfo[i].jobTypeName;
            if (jobName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(jobName);
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.filterEMpExpertise = function (event) {
        this.localCollection = [];
        for (var i = 0; i < this.allEmployeeExpertiseInfo.length; i++) {
            var empExpertise = this.allEmployeeExpertiseInfo[i].description;
            if (empExpertise.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(empExpertise);
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.filterJObTitles = function (event) {
        this.localCollection = [];
        for (var i = 0; i < this.allJobTitlesinfo.length; i++) {
            var jobtitle = this.allJobTitlesinfo[i].description;
            if (jobtitle.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(jobtitle);
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.filterLeaves = function (event) {
        this.localleaveCollection = [];
        for (var i = 0; i < this.allLeaves.length; i++) {
            var description = this.allLeaves[i].description;
            if (description.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localleaveCollection.push(description);
            }
        }
    };
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
    EmployeeGeneralInformationComponent.prototype.loademployeesexperties = function (strText) {
        var _this = this;
        if (strText === void 0) { strText = ''; }
        if (this.arrayExpertiselist.length == 0) {
            this.arrayExpertiselist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('EmployeeExpertise', 'EmployeeExpertiseId', 'Description', strText, true, 2000, this.arrayExpertiselist.join(), this.currentUserMasterCompanyId).subscribe(function (response) {
            _this.allEmployeeExpertiseInfo = response;
        }, function (err) {
            _this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);		
        });
    };
    EmployeeGeneralInformationComponent.prototype.onEmpDataLoadSuccessful = function (allWorkFlows) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.allEmployeeExpertiseInfo = allWorkFlows;
    };
    EmployeeGeneralInformationComponent.prototype.filterEmployeeNames = function (event) {
        this.localCollection = [];
        for (var i = 0; i < this.allEmployeeExpertiseInfo.length; i++) {
            var employeeName = this.allEmployeeExpertiseInfo[i].description;
            if (employeeName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(employeeName);
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.onHistoryLoadSuccessful = function (auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.auditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg' });
        this.modal.result.then(function () {
        }, function () { });
    };
    EmployeeGeneralInformationComponent.prototype.onDataMasterCompaniesLoadSuccessful = function (allComapnies) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;
    };
    EmployeeGeneralInformationComponent.prototype.onDataLoadFailed = function (error) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
    };
    EmployeeGeneralInformationComponent.prototype.handleChange = function (rowData, e) {
        var _this = this;
        if (e.checked == false) {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceAction.isActive == false;
            this.employeeService.updateEmployee(this.sourceAction).subscribe(function (response) { return _this.saveCompleted(_this.sourceAction); }, function (error) { return _this.isSpinnerVisible = false; }); //this.saveFailedHelper(error));
        }
        else {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceAction.isActive == true;
            this.employeeService.updateEmployee(this.sourceAction).subscribe(function (response) { return _this.saveCompleted(_this.sourceAction); }, function (error) { return _this.isSpinnerVisible = false; }); //this.saveFailedHelper(error));
        }
    };
    EmployeeGeneralInformationComponent.prototype.open = function (content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction.isActive = true;
        this.employeeName = "";
        this.modal = this.modalService.open(content, { size: 'lg' });
        this.modal.result.then(function () {
        }, function () { });
    };
    EmployeeGeneralInformationComponent.prototype.openDelete = function (content, row) {
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(function () {
        }, function () { });
    };
    EmployeeGeneralInformationComponent.prototype.openjobtype = function (content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        //this.sourceAction = new JobTitle();
        this.sourceAction = new jobtype_model_1.JobType();
        this.sourceAction.isActive = true;
        this.jobName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(function () {
        }, function () { });
    };
    EmployeeGeneralInformationComponent.prototype.openjobtitle = function (content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new jobtitle_model_1.JobTitle();
        this.sourceAction.isActive = true;
        this.jobName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(function () {
        }, function () { });
    };
    EmployeeGeneralInformationComponent.prototype.openemployeeExpertise = function (content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new employeeexpertise_model_1.EmployeeExpertise();
        this.sourceAction.isActive = true;
        this.employeeName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(function () {
        });
    };
    EmployeeGeneralInformationComponent.prototype.openLeaveType = function (content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new EmployeeLeaveTypeModel_1.EmployeeLeaveType();
        this.sourceAction.isActive = true;
        this.description = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(function () {
            //}, () => {  
        });
    };
    EmployeeGeneralInformationComponent.prototype.openEdit = function (content, row) {
        this.isEditMode = true;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = row;
        this.employeeName = this.sourceAction.employeeName;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(function () {
        }, function () { });
    };
    EmployeeGeneralInformationComponent.prototype.openHelpText = function (content) {
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(function () {
        }, function () { });
    };
    EmployeeGeneralInformationComponent.prototype.openHist = function (content, row) {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.sourceAction = row;
        this.employeeService.historyEmployee(this.sourceAction.employeeId).subscribe(function (results) { return _this.onHistoryLoadSuccessful(results[0], content); }, function (error) { return _this.isSpinnerVisible = false; }); // this.saveFailedHelper(error));
    };
    EmployeeGeneralInformationComponent.prototype.editItemAndCloseModel = function () {
        var _this = this;
        if (!(this.sourceEmployee.firstName && this.sourceEmployee.middleName && this.sourceEmployee.employeeIdAsPerPayroll && this.sourceEmployee.stationId
            && this.sourceEmployee.workPhone && this.sourceEmployee.employeeCertifyingStaff && this.sourceEmployee.mobilePhone)) {
            this.display = true;
            this.modelValue = true;
        }
        if (this.sourceEmployee.firstName && this.sourceEmployee.middleName && this.sourceEmployee.employeeIdAsPerPayroll && this.sourceEmployee.stationId
            && this.sourceEmployee.workPhone && this.sourceEmployee.employeeCertifyingStaff && this.sourceEmployee.mobilePhone) {
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
                this.employeeService.newAddEmployee(this.sourceEmployee).subscribe(function (data) {
                    _this.sourceEmployee.updatedBy = _this.userName;
                    _this.localCollection = data;
                    _this.employeeService.generalCollection = _this.localCollection;
                    _this.activeIndex = 0;
                });
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
                this.employeeService.updateEmployeeDetails(this.sourceEmployee).subscribe(function (response) { return _this.saveCompleted(_this.sourceEmployee); }, function (error) { return _this.isSpinnerVisible = false; }); //this.saveFailedHelper(error));
                this.activeIndex = 0;
                this.employeeService.indexObj.next(this.activeIndex);
            }
        }
        this.multiLeavelist('');
        //this.modal.close();
    };
    EmployeeGeneralInformationComponent.prototype.saveJobTitle = function () {
        var _this = this;
        this.sourceAction.createdBy = this.userA;
        this.sourceAction.updatedBy = this.userA;
        this.sourceAction.description = this.jobName;
        this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
        this.sourceAction.description = this.jobName;
        this.jobTitleService.newJobTitle(this.sourceAction).subscribe(function (data) {
            _this.loadJobtitlesData('');
            _this.showTitle = 'job Title Added Sucessfully';
            ///this.sourceEmployee.reset();
            _this.alertService.showMessage("Success", _this.showTitle, alert_service_1.MessageSeverity.success);
        }, function (err) {
            _this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);
        });
    };
    EmployeeGeneralInformationComponent.prototype.saveJobType = function () {
        var _this = this;
        if (this.jobTypeName) {
            this.sourceAction.createdBy = this.userA;
            this.sourceAction.updatedBy = this.userA;
            this.sourceAction.jobTypeName = this.jobTypeName;
            this.sourceAction.jobTypeDescription = this.jobTypeDescription;
            this.sourceAction.masterCompanyId =
                this.sourceAction.description = this.jobName;
            this.jobTypeService.newJobType(this.sourceAction).subscribe(function (data) {
                _this.loadJobtitlesData('');
                _this.showTitle = 'job Type Added Sucessfully';
                // this.loadjobtypesData();
                ///this.sourceEmployee.reset();
                _this.alertService.showMessage("Success", _this.showTitle, alert_service_1.MessageSeverity.success);
            });
        }
        else {
            this.showTitle = 'Job Title Required';
            this.alertService.showMessage("Failure", this.showTitle, alert_service_1.MessageSeverity.error);
        }
    };
    EmployeeGeneralInformationComponent.prototype.editItemJobCloseModel = function () {
        var _this = this;
        this.isSaving = true;
        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.jobName;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.sourceAction.jobTitleId = this.jobName;
            this.jobTitleService.newJobTitle(this.sourceAction).subscribe(function (data) { _this.loadJobtitlesData(''); });
        }
        else {
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.jobName;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.jobTitleService.updateAction(this.sourceAction).subscribe(function (response) { return _this.saveCompleted(_this.sourceAction); }, function (error) { return _this.isSpinnerVisible = false; }); //this.saveFailedHelper(error));
        }
    };
    EmployeeGeneralInformationComponent.prototype.editItemLeaveCloseModel = function () {
        var _this = this;
        this.isSaving = true;
        if (this.leaveType.toLowerCase().trim() == "") {
            this.alertService.showMessage("Empty", 'Cannot Submit Empty', alert_service_1.MessageSeverity.warn);
            return;
        }
        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.leaveType = this.leaveType;
            this.sourceAction.description = this.descriptiontype;
            this.sourceAction.memo = this.memo;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.employeeService.newActionforLeave(this.sourceAction).subscribe(function (data) {
                _this.saveCompleted(_this.sourceAction);
                _this.sourceEmployee.employeeLeaveTypeId = data.employeeLeaveTypeId;
                // this.EmployeeLeaveType();
                _this.multiLeavelist('');
            });
        }
        else {
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.description;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.employeeService.newActionforLeave(this.sourceAction).subscribe(function (data) {
                _this.saveCompleted(_this.sourceAction);
                _this.sourceEmployee.employeeLeaveTypeId = data.employeeLeaveTypeId;
                // this.EmployeeLeaveType();
                _this.multiLeavelist('');
            });
        }
        this.modal.close();
    };
    EmployeeGeneralInformationComponent.prototype.saveEmpExpertise = function () {
        var _this = this;
        this.sourceAction.createdBy = this.userName;
        this.sourceAction.updatedBy = this.userName;
        this.sourceAction.description = this.employeeName;
        this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
        this.sourceAction.isWorksInShop = this.isWorksInShop;
        this.empservice.newAction(this.sourceAction).subscribe(function (data) {
            _this.showTitle = 'Employee Expertise Added Sucessfully';
            ///this.sourceEmployee.reset();
            _this.alertService.showMessage("Success", _this.showTitle, alert_service_1.MessageSeverity.success);
            _this.loademployeesexperties('');
        });
    };
    EmployeeGeneralInformationComponent.prototype.editItemExpertiesCloseModel = function () {
        var _this = this;
        this.isSaving = true;
        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.employeeName;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.empservice.newAction(this.sourceAction).subscribe(function (data) { _this.loademployeesexperties(''); });
        }
        else {
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.employeeName;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.jobTitleService.updateAction(this.sourceAction).subscribe(function (response) { return _this.saveCompleted(_this.sourceAction); }, function (error) { return _this.isSpinnerVisible = false; }); //this.saveFailedHelper(error));
        }
        //s this.modal.close();
    };
    EmployeeGeneralInformationComponent.prototype.filterfirstName = function (event) {
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
    };
    //already exits first name
    EmployeeGeneralInformationComponent.prototype.firstnameeventHandler = function (firstName) {
        if (firstName.firstName != "") {
            var value = firstName.firstName;
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
    };
    EmployeeGeneralInformationComponent.prototype.firstNameSel = function (firstName) {
        if (firstName.firstName != "") {
            var value = firstName.firstName;
            if (this.firstCollection) {
                for (var i in this.firstCollection) {
                    if (this.firstCollection[i]['firstName'] == firstName.firstName) {
                        this.firstNameShow = true;
                        this.sourceEmployee.firstName = '';
                    }
                }
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.filterlastName = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.getAllContactLastNameSmartDropDown(event.query);
        }
    };
    EmployeeGeneralInformationComponent.prototype.filtermiddleName = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.getAllContactMiddleNameSmartDropDown(event.query);
        }
    };
    EmployeeGeneralInformationComponent.prototype.filterempIdName = function (event) {
        this.empIdCollection = [];
        for (var i = 0; i < this.allEmployeeinfo.length; i++) {
            var employeeId = this.allEmployeeinfo[i].employeeId;
            if (employeeId) {
                if (employeeId.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.empIdCollection.push(employeeId);
                }
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.deleteItemAndCloseModel = function () {
        var _this = this;
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.employeeService.deleteEmployee(this.sourceAction.employeeId).subscribe(function (response) { return _this.saveCompleted(_this.sourceAction); }, function (error) { return _this.isSpinnerVisible = false; }); //this.saveFailedHelper(error));
        this.modal.close();
    };
    EmployeeGeneralInformationComponent.prototype.filterEmployees = function (event) {
        this.localCollection = [];
        for (var i = 0; i < this.allEmployeeinfo.length; i++) {
            var employeeName = this.allEmployeeinfo[i].employeeName;
            if (employeeName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(employeeName);
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.dismissModel = function () {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    };
    EmployeeGeneralInformationComponent.prototype.saveCompleted = function (user) {
        this.isSaving = false;
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", "Action was deleted successfully", alert_service_1.MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", "Action was edited successfully", alert_service_1.MessageSeverity.success);
        }
        this.loadData();
    };
    EmployeeGeneralInformationComponent.prototype.saveSuccessHelper = function (role) {
        this.isSaving = false;
        this.alertService.showMessage("Success", "Action was created successfully", alert_service_1.MessageSeverity.success);
        this.loadData();
    };
    Object.defineProperty(EmployeeGeneralInformationComponent.prototype, "userName", {
        get: function () {
            return this.authService.currentUser ? this.authService.currentUser.userName : "";
        },
        enumerable: false,
        configurable: true
    });
    EmployeeGeneralInformationComponent.prototype.saveFailedHelper = function (error) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", alert_service_1.MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, alert_service_1.MessageSeverity.error);
    };
    EmployeeGeneralInformationComponent.prototype.getDismissReason = function (reason) {
        if (reason === ng_bootstrap_1.ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        }
        else if (reason === ng_bootstrap_1.ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        }
        else {
            return "with: " + reason;
        }
    };
    EmployeeGeneralInformationComponent.prototype.getBUList2 = function (id) {
        var companyId = id;
        if (this.updateMode == false) {
            this.sourceEmployee.buisinessUnitId = "";
            this.sourceEmployee.departmentId = "";
            this.sourceEmployee.divisionId = "";
            this.sourceEmployee.managementStructureId = companyId;
            this.departmentList = [];
            this.divisionlist = [];
            this.bulist = [];
            for (var i = 0; i < this.allManagemtninfo.length; i++) {
                if (this.allManagemtninfo[i].parentId == companyId) {
                    this.bulist.push(this.allManagemtninfo[i]);
                }
            }
        }
        else {
            this.bulist = [];
            this.departmentList = [];
            this.divisionlist = [];
            for (var i = 0; i < this.allManagemtninfo.length; i++) {
                if (this.allManagemtninfo[i].parentId == companyId) {
                    this.bulist.push(this.allManagemtninfo[i]);
                }
            }
            this.empCreationForm.controls['BusinessUnitId'].setValue(this.sourceEmployee.biumanagmentLegalEntityId);
        }
    };
    EmployeeGeneralInformationComponent.prototype.getDepartmentlist2 = function (value) {
        if (this.updateMode == false) {
            this.sourceEmployee.departmentId = "";
            this.sourceEmployee.divisionId = "";
            this.sourceEmployee.managementStructureId = value;
            this.departmentList = [];
            this.divisionlist = [];
            for (var i = 0; i < this.allManagemtninfo.length; i++) {
                if (this.allManagemtninfo[i].parentId == value) {
                    this.departmentList.push(this.allManagemtninfo[i]);
                }
            }
        }
        else {
            this.departmentList = [];
            this.divisionlist = [];
            for (var i = 0; i < this.allManagemtninfo.length; i++) {
                if (this.allManagemtninfo[i].parentId == value) {
                    this.departmentList.push(this.allManagemtninfo[i]);
                }
            }
            this.empCreationForm.controls['divisionId'].setValue(this.sourceEmployee.divmanagmentLegalEntityId);
        }
    };
    EmployeeGeneralInformationComponent.prototype.divisionChange = function (divisionId) {
        this.sourceEmployee.managementStructureId = divisionId;
    };
    EmployeeGeneralInformationComponent.prototype.AddLeavedata = function (imObj) {
        var _this = this;
        for (var i = 0; i < this.selectedLeaveValues.length; i++) {
            imObj.employeeLeaveTypeId = this.selectedLeaveValues[i];
            this.employeeService.Addmultileaves(imObj).subscribe(function (data) {
                _this.localCollection = data;
            });
        }
    };
    EmployeeGeneralInformationComponent.prototype.AddShiftsdata = function (employeeObject) {
        var _this = this;
        for (var i = 0; i < this.selectedshiftValues.length; i++) {
            employeeObject.employeeShiftId = this.selectedshiftValues[i];
            this.employeeService.AddShifts(employeeObject).subscribe(function (data) {
                _this.localCollection = data;
            });
        }
    };
    EmployeeGeneralInformationComponent.prototype.setManagementStrucureData = function (obj) {
        this.managementStructureData = [];
        this.checkMSParents(obj.managementStructureId);
        if (this.sourceEmployee) {
            this.getBUList2(this.sourceEmployee.compmanagmentLegalEntityId);
            this.getDepartmentlist2(this.sourceEmployee.biumanagmentLegalEntityId);
            this.getDivisionlist(this.sourceEmployee.managmentLegalEntityId);
        }
        ;
    };
    EmployeeGeneralInformationComponent.prototype.checkMSParents = function (msId) {
        this.managementStructureData.push(msId);
        for (var a = 0; a < this.allManagemtninfo.length; a++) {
            if (this.allManagemtninfo[a].managementStructureId == msId) {
                if (this.allManagemtninfo[a].parentId) {
                    this.checkMSParents(this.allManagemtninfo[a].parentId);
                    break;
                }
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.onKeyUpFirstNames = function (event) {
        if (event.target.value != "") {
            var value = event.target.value.toLowerCase();
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
    };
    EmployeeGeneralInformationComponent.prototype.handlePayType = function (value) {
        this.sourceEmployee.hourlyPay = '';
        if (value == 'Hourly') {
            this.hourly = true;
            this.yearly = false;
            this.sourceEmployee.isHourly = true;
        }
        else {
            this.yearly = true;
            this.hourly = false;
            this.sourceEmployee.isHourly = false;
        }
    };
    EmployeeGeneralInformationComponent.prototype.onSelectFirstName = function (event) {
        if (this.allEmployeeinfo) {
            for (var i = 0; i < this.allEmployeeinfo.length; i++) {
                if (event == this.allEmployeeinfo[i].firstName) {
                    this.sourceEmployee.firstName = event;
                    this.disableSaveFirstName = true;
                    this.selectedFirstName = event;
                }
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.onKeyUpMiddleNames = function (event) {
        if (event.target.value != "") {
            var value = event.target.value.toLowerCase();
            if (this.disableSaveName) {
                if (value == this.disableSaveName.toLowerCase()) {
                    this.disableSaveMiddleName = true;
                }
                else {
                    this.disableSaveMiddleName = false;
                }
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.onSelectMiddleName = function (event) {
        if (this.allEmployeeinfo) {
            for (var i = 0; i < this.allEmployeeinfo.length; i++) {
                if (event == this.allEmployeeinfo[i].middleName) {
                    this.sourceEmployee.middleName = event;
                    this.disableSaveMiddleName = true;
                    this.disableSaveName = event;
                }
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.onBlurLeaveName = function (event) {
        if (event.target.value != "") {
            var value = event.target.value.toLowerCase();
            if (this.allLeaves) {
                for (var i = 0; i < this.allLeaves.length; i++) {
                    if (value == this.allLeaves[i].description) {
                        this.sourceEmployee.description = event;
                        this.disableSaveLeaveName = true;
                        this.disableSaveName = event;
                    }
                }
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.onSelectLeaveName = function (event) {
        if (this.allLeaves) {
            for (var i = 0; i < this.allLeaves.length; i++) {
                if (event == this.allLeaves[i].description) {
                    this.sourceEmployee.description = event;
                    this.disableSaveLeaveName = true;
                    this.disableSaveName = event;
                }
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.onSelectJob = function (event) {
        if (this.allJobTitlesinfo) {
            for (var i = 0; i < this.allJobTitlesinfo.length; i++) {
                if (event == this.allJobTitlesinfo[i].description) {
                    this.sourceEmployee.jobName = event;
                    this.disableJobTitle = true;
                    this.selectedActionName = event;
                }
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.onSelectEmpExpertise = function (event) {
        var validBtn = false;
        if (this.allJobTitlesinfo) {
            for (var i = 0; i < this.allEmployeeExpertiseInfo.length; i++) {
                if (event == this.allEmployeeExpertiseInfo[i].description) {
                    this.disableExpTitle = true;
                }
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.onJobTypeKeyUP = function () {
        if (this.jobTypeName != "") {
            this.disableJobType = false;
        }
        else {
            this.disableJobType = true;
        }
    };
    EmployeeGeneralInformationComponent.prototype.onEmpExpertiseKeyUP = function () {
        if (this.employeeName != "") {
            this.disableExpTitle = false;
        }
        else {
            this.disableExpTitle = true;
        }
    };
    EmployeeGeneralInformationComponent.prototype.onKeyJob = function (event) {
        if (event.target.value != "") {
            var value = event.target.value.toLowerCase();
            if (this.selectedActionName) {
                if (value == this.selectedActionName.toLowerCase()) {
                    this.disableJobTitle = true;
                }
                else {
                    this.disableJobTitle = false;
                }
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.onjobTitleKeyUP = function () {
        if (this.jobName != "") {
            this.disableJobTitle = false;
        }
        else {
            this.disableJobTitle = true;
        }
    };
    EmployeeGeneralInformationComponent.prototype.onKeyUpExp = function (event) {
        if (event.target.value != "") {
            var value = event.target.value.toLowerCase();
            if (this.selectedActionName) {
                if (value == this.selectedActionName.toLowerCase()) {
                    this.disableExpTitle = true;
                }
                else {
                    this.disableExpTitle = false;
                }
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.onSelectExp = function (event) {
        if (this.allEmployeeExpertiseInfo) {
            for (var i = 0; i < this.allEmployeeExpertiseInfo.length; i++) {
                if (event == this.allEmployeeExpertiseInfo[i].description) {
                    this.sourceEmployee.employeeName = event;
                    this.disableExpTitle = true;
                    this.selectedActionName = event;
                }
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.getAllStationData = function (strText) {
        var _this = this;
        if (strText === void 0) { strText = ''; }
        if (this.arrayAllStationlist.length == 0) {
            this.arrayAllStationlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('EmployeeStation', 'EmployeeStationId', 'StationName', strText, true, 0, this.arrayAllStationlist.join(), this.currentUserMasterCompanyId).subscribe(function (response) {
            _this.getAllAllStationInfodrpData = response;
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    EmployeeGeneralInformationComponent.prototype.onChangeemployeeExpertiseId = function (event) {
        if (event.target.value != "") {
            var value = event.target.value;
            value = value.split(":");
            if (this.allEmployeeExpertiseInfo) {
                for (var i = 0; i < this.allEmployeeExpertiseInfo.length; i++) {
                    if (value[1] == this.allEmployeeExpertiseInfo[i].employeeExpertiseId) {
                        this.empIsWorksInShop = this.allEmployeeExpertiseInfo[i].isWorksInShop;
                    }
                }
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.onKeyUpLeaveNames = function (event) {
        if (event.target.value != "") {
            var value = event.target.value.toLowerCase();
            if (this.disableSaveName) {
                if (value == this.disableSaveName.toLowerCase()) {
                    this.disableSaveLeaveName = true;
                }
                else {
                    this.disableSaveLeaveName = false;
                }
            }
        }
    };
    EmployeeGeneralInformationComponent.prototype.formateNumber = function (obj) {
        obj.hourlyPay = obj.hourlyPay ? autocomplete_1.formatNumberAsGlobalSettingsModule(obj.hourlyPay, 2) : '';
    };
    EmployeeGeneralInformationComponent.prototype.nextClick = function (nextOrPrevious) {
        if (this.enableSaveBtn == true) {
            this.nextOrPreviousTab = nextOrPrevious;
            var content = this.tabRedirectConfirmationModal;
            this.modal = this.modalService.open(content, { size: "sm" });
        }
        else {
            this.router.navigate(["/employeesmodule/employeepages/app-employee-certification-edit/" + this.empId]);
            this.activeIndex = 1;
            this.employeeService.indexObj.next(this.activeIndex);
        }
    };
    EmployeeGeneralInformationComponent.prototype.redirectToTab = function () {
        this.dismissModel();
        this.onSubmit2();
        if (this.employeeService.isEditMode == true) {
            this.router.navigate(["/employeesmodule/employeepages/app-employee-certification-edit/" + this.empId]);
            this.activeIndex = 1;
            this.employeeService.indexObj.next(this.activeIndex);
        }
        else {
            this.gotoNext();
        }
    };
    EmployeeGeneralInformationComponent.prototype.redirectToTabWithoutSave = function () {
        this.dismissModel();
        if (this.employeeService.isEditMode == true) {
            this.router.navigate(["/employeesmodule/employeepages/app-employee-certification-edit/" + this.empId]);
            this.activeIndex = 1;
            this.employeeService.indexObj.next(this.activeIndex);
        }
        else {
            this.gotoNext();
        }
    };
    EmployeeGeneralInformationComponent.prototype.gotoNext = function () {
        this.activeIndex = 1;
        this.employeeService.indexObj.next(this.activeIndex);
        var data = { "empId": this.empId, "firstName": this.firstName, "lastName": this.lastName };
        var stringData = JSON.stringify(data);
        var encryptedData = btoa(JSON.stringify(data));
        this.route.navigate(['/employeesmodule/employeepages/app-employee-certification'], { queryParams: { order: this.empId, 'firstName': this.firstName, 'lastName': this.lastName }, skipLocationChange: true });
    };
    __decorate([
        core_1.ViewChild("tabRedirectConfirmationModal", { static: false })
    ], EmployeeGeneralInformationComponent.prototype, "tabRedirectConfirmationModal");
    __decorate([
        core_1.ViewChild(material_1.MatPaginator, { static: false })
    ], EmployeeGeneralInformationComponent.prototype, "paginator");
    __decorate([
        core_1.ViewChild(material_1.MatSort, { static: false })
    ], EmployeeGeneralInformationComponent.prototype, "sort");
    __decorate([
        core_1.ViewChild("empform", { static: false })
    ], EmployeeGeneralInformationComponent.prototype, "formdata");
    __decorate([
        core_1.Output()
    ], EmployeeGeneralInformationComponent.prototype, "tab");
    EmployeeGeneralInformationComponent = __decorate([
        core_1.Component({
            selector: 'app-employee-general-information',
            templateUrl: './employee-general-information.component.html',
            styleUrls: ['./employee-general-information.component.scss'],
            animations: [animations_1.fadeInOut]
        })
    ], EmployeeGeneralInformationComponent);
    return EmployeeGeneralInformationComponent;
}());
exports.EmployeeGeneralInformationComponent = EmployeeGeneralInformationComponent;
