"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.EmployeesListComponent = void 0;
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var animations_1 = require("../../../../services/animations");
var alert_service_1 = require("../../../../services/alert.service");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var jquery_1 = require("jquery");
var moment = require("moment");
var autocomplete_1 = require("../../../../generic/autocomplete");
var autocomplete_2 = require("../../../../generic/autocomplete");
var common_1 = require("@angular/common");
var EmployeesListComponent = /** @class */ (function () {
    /** employees-list ctor */
    function EmployeesListComponent(modalService, translationService, empService, router, authService, datePipe, alertService, commonService, configurations, currencyService, legalEntityService, itemser) {
        this.modalService = modalService;
        this.translationService = translationService;
        this.empService = empService;
        this.router = router;
        this.authService = authService;
        this.datePipe = datePipe;
        this.alertService = alertService;
        this.commonService = commonService;
        this.configurations = configurations;
        this.currencyService = currencyService;
        this.legalEntityService = legalEntityService;
        this.itemser = itemser;
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.viewactive = false;
        this.viewinactive = true;
        this.isSpinnerVisible = false;
        this.exportData = [];
        this.allCapesInfo = [];
        this.viewempDetails = {};
        //viewempDetails: any = {};
        this.viewTraining = {};
        this.viewGeneralDetails = {};
        this.allEmployeelist = [];
        this.EmployeeViewlist = {};
        this.EmployeeEditlist = {};
        this.pageSize = 10;
        this.shiftMapArray = [];
        //public auditHistory: AuditHistory[] = [];
        this.auditHistory = [];
        this.allEmployeeTrainingDocumentsList = [];
        this.allCurrencyData = [];
        this.allShiftData = [];
        this.allCustomerFinanceDocumentsListOriginal = [];
        this.pageIndex = 0;
        this.onDestroy$ = new rxjs_1.Subject();
        this.showTitle = '';
        this.headerManagementStructureWithName = {};
        this.currenDocDeletedstatus = false;
        this.headers = [
            { field: 'firstName', header: 'First Name' },
            { field: 'lastName', header: 'Last Name' },
            { field: 'employeeCode', header: 'Emp ID' },
            // { field: 'email', header: 'Email' },
            //{ field: 'businessUnitId', header: 'BU' },
            //{ field: 'divisionId', header: 'Division' },
            //{ field: 'departmentId', header: 'Department' },
            { field: 'jobtitle', header: 'Job Title' },
            { field: 'employeeExpertise', header: 'Emp Expertise' },
            //{ field: 'jobtype', header: 'Job Type'},
            { field: 'startDate', header: 'Start Date' },
            { field: 'company', header: 'Company' },
            { field: 'shopEmployee', header: 'Shop Employee' },
            { field: 'paytype', header: 'Pay Type' },
            { field: 'createdBy', header: 'CreatedBy' },
            { field: 'createdDate', header: 'Created Date' },
            { field: 'updatedBy', header: 'UpdatedBy' },
            { field: 'updatedDate', header: 'Updated Date' },
        ];
        this.customerDocumentsColumns = [
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
        this.selectedColumnsDoc = this.customerDocumentsColumns;
        this.selectedColumns = this.headers;
        this.sourceEmployee = {};
        this.Active = "Active";
        this.employeeRoleLabel = [];
        this.tagNameCollection = [];
        this.selectedRoleNames = '';
        this.gridData = [];
        this.status = 'Active';
        this.filterText = false;
        this.currentstatus = 'Active';
        this.viewEmpID = 0;
        this.viewType = 'mpn';
        this.empshifttype = '';
        this.supervisorname = '';
        this.empcreatedby = '';
        this.compmanagmentLegalEntityName = '';
        this.biumanagmentLegalEntityName = '';
        this.divmanagmentLegalEntityName = '';
        this.managmentLegalEntityName = '';
        this.originatingCountryName = '';
        this.shiftNames = '';
        this.leavetypenames = '';
        this.empcreatedDate = '';
        this.empExpertiseName = '';
        this.empleaveType = '';
        this.empstatus = '';
        this.durationType = '';
        this.durationTypelist = [
            { id: 1, type: 'Days' },
            { id: 2, type: 'Weeks' },
            { id: 3, type: 'Months' },
            { id: 3, type: 'Years' }
        ];
        this.sourceViewforDocumentAudit = [];
        this.documentTableColumns = [
            { field: "docName", header: "Name" },
            { field: "docDescription", header: "Description" },
            { field: "docMemo", header: "Memo" },
            { field: "fileName", header: "File Name" },
            { field: "fileSize", header: "File Size" },
            { field: 'createdDate', header: 'Created Date' },
            { field: 'createdBy', header: 'CreatedBy' },
            { field: 'updatedDate', header: 'Updated Date' },
            { field: 'updatedBy', header: 'UpdatedBy' },
            { field: 'download', header: 'Actions' },
        ];
        this.currentDeletedstatus = false;
        this.dataSource = new material_1.MatTableDataSource();
        this.translationService.closeCmpny = false;
        this.activeIndex = 0;
        this.empService.listCollection = null;
    }
    EmployeesListComponent.prototype.ngOnInit = function () {
        this.activeIndex = 0;
        this.empService.currentUrl = '/employeesmodule/employeepages/app-employees-list';
        this.empService.bredcrumbObj.next(this.empService.currentUrl);
        this.empService.ShowPtab = false;
        this.empService.alertObj.next(this.empService.ShowPtab);
        // this.getAllFrequencyTrainingData();
        // this.loadCurrencyData();
        // this.getAllStationData();
        // this.getAllAircraftManfacturer();
    };
    EmployeesListComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next();
    };
    EmployeesListComponent.prototype.onDataLoadSuccessful = function (allWorkFlows) {
        //this.alertService.stopLoadingMessage();
        //this.loadingIndicator = false;
        this.totalRecords = allWorkFlows.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.dataSource.data = allWorkFlows;
        this.allEmployeesList = allWorkFlows;
        this.isSpinnerVisible = false;
    };
    EmployeesListComponent.prototype.onemployeeDataLoadSuccessful = function (allWorkFlows) {
        if (allWorkFlows[0].employeeLeaveTypeMapping != null) {
            this.employeeLeaveType = allWorkFlows[0].employeeLeaveTypeMapping.employeeLeaveTypeId;
            this.shiftId = allWorkFlows[0].employeeShiftMapping.shiftId;
            this.leaveMapArray = allWorkFlows[0].employeeLeaveTypeMapping;
            this.shiftMapArray = allWorkFlows[0].employeeShiftMapping;
            // if(this.shiftMapArray.length>0)
            // {
            //     console.log(this.shiftMapArray);
            //     for(var i=0; i< this.shiftMapArray; i++){
            //         this.selectedShiftData += getValueFromArrayOfObjectById('description', 'shiftId', this.shiftMapArray[i].shiftId , this.allCurrencyData); 
            //     }
            // }
        }
        //this.alertService.stopLoadingMessage();
        //this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.allEmployeelist = allWorkFlows[0];
        if (this.allEmployeelist.employeeTraining[0] && this.allEmployeelist.employeeTraining[0].durationTypeId)
            this.durationType = autocomplete_1.getValueFromArrayOfObjectById('type', 'id', this.allEmployeelist.employeeTraining[0].durationTypeId, this.durationTypelist);
        else
            this.durationType = '';
        this.allEmployeelist.hourlyPay = this.allEmployeelist.hourlyPay ? autocomplete_1.formatNumberAsGlobalSettingsModule(this.allEmployeelist.hourlyPay, 2) : '0';
        //this.allEmployeelist.employeeTraining[0].cost= this.allEmployeelist.employeeTraining[0].cost ? formatNumberAsGlobalSettingsModule(this.allEmployeelist.employeeTraining[0].cost, 2) : '0',
        //if (this.allEmployeelist.employeetraining != null && this.allEmployeelist.employeetrainginfo.aircraftmodelid > 0) {
        //    this.aircraftmodelname = getvaluefromarrayofobjectbyid('label', 'value', this.allEmployeelist.employeetrainginfo.aircraftmodelid, this.manufacturerData)
        //}
        //else {
        //    this.aircraftModelName = "";
        //}
        // this.EmployeeViewlist = allWorkFlows[0];
        this.isSpinnerVisible = false;
    };
    EmployeesListComponent.prototype.navigateTogeneralInfo = function () {
        this.empService.isEditMode = false;
        this.empService.isDisbaleTabs = false;
        this.empService.ShowPtab = true;
        this.router.navigateByUrl('/employeesmodule/employeepages/app-employee-general-information');
        this.empService.currentUrl = '/employeesmodule/employeepages/app-employee-general-information';
        this.empService.alertObj.next(this.empService.ShowPtab);
        this.empService.bredcrumbObj.next(this.empService.currentUrl);
        this.empService.listCollection = undefined;
    };
    EmployeesListComponent.prototype.getManagementStructureNameandCodes = function (id) {
        var _this = this;
        this.commonService.getManagementStructureNameandCodes(id).subscribe(function (res) {
            if (res.Level1) {
                _this.headerManagementStructureWithName.level1 = res.Level1;
            }
            else {
                _this.headerManagementStructureWithName.level1 = '-';
            }
            if (res.Level2) {
                _this.headerManagementStructureWithName.level2 = res.Level2;
            }
            else {
                _this.headerManagementStructureWithName.level2 = '-';
            }
            if (res.Level3) {
                _this.headerManagementStructureWithName.level3 = res.Level3;
            }
            else {
                _this.headerManagementStructureWithName.level3 = '-';
            }
            if (res.Level4) {
                _this.headerManagementStructureWithName.level4 = res.Level4;
            }
            else {
                _this.headerManagementStructureWithName.level4 = '-';
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeesListComponent.prototype.openEdit = function (row) {
        //for tabs enable in editmode
        this.empService.isDisbaleTabs = true;
        //this.isEditMode = true;
        this.empService.isEditMode = true;
        //this.isSaving = true;
        //this.sourceVendor = row;
        //this.loadMasterCompanies();
        this.empService.employeeId;
        this.empService.listCollection = row;
        // this.actionName = this.sourceVendor.description;
        // this.router.navigateByUrl('/employeesmodule/employeepages/app-employee-general-information');
        var employeeId = row.employeeId;
        this.empService.employeeId = employeeId;
        this.router.navigateByUrl("employeesmodule/employeepages/app-employee-general-information-edit/" + employeeId);
    };
    EmployeesListComponent.prototype.onDataLoadFailed = function (error) {
        this.isSpinnerVisible = false;
        // alert(error);
        //this.alertService.stopLoadingMessage();
        //this.loadingIndicator = false;
    };
    Object.defineProperty(EmployeesListComponent.prototype, "userName", {
        get: function () {
            return this.authService.currentUser ? this.authService.currentUser.userName : "";
        },
        enumerable: false,
        configurable: true
    });
    //deleteItemAndCloseModel(rowData) {
    //	this.isSaving = true;
    //	this.sourceEmployee = rowData;
    //	this.sourceEmployee.updatedBy = this.userName;
    //	this.sourceEmployee.isActive = false;
    //	this.sourceEmployee.employeeId = rowData.employeeId;
    //	this.empService.updateListstatus(this.sourceEmployee).subscribe(
    //		response => this.saveCompleted(this.sourceEmployee),
    //		error => this.saveFailedHelper(error));
    //}
    EmployeesListComponent.prototype.loadData = function () {
        var _this = this;
        this.empService.getEmployeeList().subscribe(function (results) { return _this.onDataLoadSuccessful(results[0]); }, function (error) { return _this.onDataLoadFailed(error); });
    };
    EmployeesListComponent.prototype.activeStatus = function (value) {
        if (value && this.currentDeletedstatus == true) {
            this.filterText = true;
        }
        else {
            this.filterText = false;
        }
    };
    EmployeesListComponent.prototype.loadEmployeePages = function (event) {
        this.isSpinnerVisible = true;
        this.lazyLoadEventData = event;
        var pageIndex = parseInt(event.first) / event.rows;
        ;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadEventDataInput = event;
        this.lazyLoadEventDataInput.filters = __assign(__assign({}, this.lazyLoadEventDataInput.filters), { status: this.status ? this.status : 'Active' });
        if (this.filterText == true) {
            this.lazyLoadEventDataInput.filters.isDeleted = true;
        }
        else {
            this.lazyLoadEventDataInput.filters.isDeleted = false;
        }
        this.getList(this.lazyLoadEventDataInput);
    };
    //global search 
    //                this.lazyLoadEventDataInput.filters = {
    //    purchaseOrderNo: this.purchaseOrderNoInput,
    //    openDate: this.openDateInput,
    //    closedDate: this.closedDateInput,
    //    vendorName: this.vendorNameInput,
    //    vendorCode: this.vendorCodeInput,
    //    status: this.statusIdInput ? this.statusIdInput : this.currentStatusPO,
    //    requestedBy: this.requestedByInput,
    //    approvedBy: this.approvedByInput,
    //    vendorId: this.vendorId ? this.vendorId : null
    //}
    //employee list status radio buttons 
    EmployeesListComponent.prototype.geEmpListByStatus = function (status) {
        this.isSpinnerVisible = true;
        var pageIndex = 0;
        this.viewactive = !this.viewactive;
        this.viewinactive = !this.viewinactive;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.status = status;
        this.lazyLoadEventDataInput.filters = __assign(__assign({}, this.lazyLoadEventDataInput.filters), { status: status });
        var PagingData = __assign(__assign({}, this.lazyLoadEventDataInput), { filters: autocomplete_2.listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) });
        this.getList(PagingData);
    };
    EmployeesListComponent.prototype.getDeleteListByStatus = function (value) {
        this.isSpinnerVisible = true;
        this.currentDeletedstatus = true;
        var pageIndex = 0;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.status = status;
        if (value == true) {
            //this.currentstatus="ALL";
            this.lazyLoadEventDataInput.filters = __assign(__assign({}, this.lazyLoadEventDataInput.filters), { status: this.currentstatus });
            var PagingData = __assign(__assign({}, this.lazyLoadEventDataInput), { filters: autocomplete_2.listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) });
            this.getList(PagingData);
        }
        else {
            this.currentDeletedstatus = false;
            //this.currentstatus="ALL"
            this.lazyLoadEventDataInput.filters = __assign(__assign({}, this.lazyLoadEventDataInput.filters), { status: this.currentstatus });
            var PagingData = __assign(__assign({}, this.lazyLoadEventDataInput), { filters: autocomplete_2.listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) });
            this.getList(PagingData);
        }
    };
    EmployeesListComponent.prototype.restore = function (content, rowData) {
        this.restoreRecordData = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    };
    EmployeesListComponent.prototype.restoreRecord = function () {
        var _this = this;
        this.commonService.updatedeletedrecords('Employee', 'EmployeeId', this.restoreRecordData.employeeId).subscribe(function (res) {
            _this.modal.close();
            _this.getDeleteListByStatus(true);
            _this.alertService.showMessage("Success", "Employee Restored Successfully.", alert_service_1.MessageSeverity.success);
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeesListComponent.prototype.globalSearch = function (value) {
        this.isSpinnerVisible = true;
        var pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;
        ;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.status = this.currentstatus;
        this.lazyLoadEventDataInput.filters = __assign(__assign({}, this.lazyLoadEventDataInput.filters), { status: this.status });
        var PagingData = __assign(__assign({}, this.lazyLoadEventDataInput), { filters: autocomplete_2.listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) });
        this.getList(PagingData);
    };
    //ge pagination list function
    EmployeesListComponent.prototype.getList = function (data) {
        var _this = this;
        this.isSpinnerVisible = true;
        //this.empService.getAllEmployeeList(data).subscribe(res => {
        var isdelete = this.currentDeletedstatus ? true : false;
        data.filters.isDeleted = isdelete;
        var Data = __assign(__assign({}, data), { filters: autocomplete_2.listSearchFilterObjectCreation(data.filters) });
        this.empService.getAllEmployeeList(Data).pipe(operators_1.takeUntil(this.onDestroy$)).subscribe(function (res) {
            _this.data = res[0]['results'];
            _this.allEmployeesList = _this.data;
            _this.allCapesInfo = _this.data;
            if (_this.allEmployeesList.length > 0) {
                _this.totalRecords = res[0]['totalRecordsCount'];
                _this.totalPages = Math.ceil(_this.totalRecords / _this.pageSize);
            }
            else {
                _this.allEmployeesList = [];
                _this.totalRecords = 0;
                _this.totalPages = 0;
            }
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeesListComponent.prototype.exportCSV = function (dt) {
        var _this = this;
        this.isSpinnerVisible = true;
        this.exportData = [];
        var isdelete = this.currentDeletedstatus ? true : false;
        var PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "status": this.currentstatus, "isDeleted": isdelete }, "globalFilter": "" };
        this.empService.downloadAllEmployeeList(PagingData).subscribe(function (results) {
            var vList = results['results'].map(function (x) {
                return __assign(__assign({}, x), { startDate: x.startDate ? _this.datePipe.transform(x.startDate, 'MM/dd/yyyy') : '', createdDate: x.createdDate ? _this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '', updatedDate: x.updatedDate ? _this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '' });
            });
            _this.loadingIndicator = false;
            dt._value = vList;
            dt.exportCSV();
            dt.value = _this.data;
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeesListComponent.prototype.errorMessageHandler = function (log) {
        var msg = '';
        if (typeof log.error == 'string') {
            this.alertService.showMessage('Error', log.error, alert_service_1.MessageSeverity.error);
        }
        else {
            //if (log.error && log.error.errors.length > 0) {
            // for (let i = 0; i < log.error.errors.length; i++) {
            // msg = msg + log.error.errors[i].message + '<br/>'
            //}
            this.alertService.showMessage(log.error.message, msg, alert_service_1.MessageSeverity.error);
        }
    };
    // restoreRecord(record){
    //     this.customerService.restoreCustomerRecord(record.customerId, this.userName).subscribe(res => {
    //         this.getDeleteListByStatus(true)
    //         this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
    //     })
    // }
    //date conversion related function
    EmployeesListComponent.prototype.mouseOverData = function (key, data) {
        if (key === 'startDate') {
            return moment(data['startDate']).format('MM/DD/YYYY');
        }
    };
    EmployeesListComponent.prototype.convertDate = function (key, data) {
        if (key === 'startDate') {
            return moment(data['startDate']).format('MM/DD/YYYY');
        }
    };
    EmployeesListComponent.prototype.getData = function (rowData, field) {
        if (field === 'jobtitle')
            return rowData['jobtitle'] ? rowData['jobtitle'] : 'NA';
        //if (field === 'jobtype') return rowData['jobtype'] ? rowData['jobtype']['jobTypeName'] : 'NA';
        else if (field === 'company') {
            // return rowData['masterCompany'] ? rowData['masterCompany']['companyName'] : 'NA';
            if (rowData.managmentLegalEntity != null && rowData.divmanagmentLegalEntity != null && rowData.biumanagmentLegalEntity != null && rowData.compmanagmentLegalEntity != null) {
                return rowData.compmanagmentLegalEntity.name;
            }
            else if (rowData.biumanagmentLegalEntity != null && rowData.divmanagmentLegalEntity != null && rowData.managmentLegalEntity != null) {
                return rowData.biumanagmentLegalEntity.name;
            }
            else if (rowData.divmanagmentLegalEntity != null && rowData.managmentLegalEntity != null) {
                return rowData.divmanagmentLegalEntity.name;
            }
            else if (rowData.managementStructeInfo != null) {
                return rowData.managmentLegalEntity.name;
            }
            else {
                return 'NA';
            }
        }
        else if (field === 'employeeExpertise')
            return rowData['employeeExpertise'] ? rowData['employeeExpertise']['description'] : 'NA';
        else if (field === 'employeeId')
            return "EMP " + rowData[field];
        else if (field === 'paytype')
            return rowData['isHourly'] ? 'Hourly' : 'Yearly';
        else
            return rowData[field];
    };
    EmployeesListComponent.prototype.deleteItemAndCloseModel = function () {
        var _this = this;
        this.isSaving = true;
        this.isDeleteMode = true;
        this.sourceEmployee.isdelete = true;
        //this.sourceVendor = content;
        //this.sourceEmployee.employeeId = rowData.employeeId;
        this.sourceEmployee.employeeId = this.deleteEmployeeId;
        this.sourceEmployee.updatedBy = this.userName;
        this.showTitle = "Employee removed successfully.";
        this.empService.deleteEmployee(this.sourceEmployee).subscribe(function (data) {
            _this.alertService.showMessage("Success", _this.showTitle, alert_service_1.MessageSeverity.success);
            _this.modal.close();
            // this.loadData();
            _this.loadEmployeePages(_this.lazyLoadEventData);
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeesListComponent.prototype.openDelete = function (content, row) {
        this.deleteEmployeeId = row.employeeId;
        this.deleteEmployeeName = row.firstName;
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceEmployee = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(function () {
        }, function () { });
    };
    EmployeesListComponent.prototype.saveCompleted = function (user) {
        this.isSaving = false;
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", "Employee deleted successfully", alert_service_1.MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", "Employee Action edited successfully", alert_service_1.MessageSeverity.success);
        }
        //	this.loadData();
        this.loadEmployeePages(this.lazyLoadEventData);
    };
    EmployeesListComponent.prototype.saveFailedHelper = function (error) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", alert_service_1.MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, alert_service_1.MessageSeverity.error);
    };
    EmployeesListComponent.prototype.openView = function (content, row) {
        var _this = this;
        this.isSpinnerVisible = true;
        jquery_1["default"]('#step1').collapse('show');
        this.toGetEmployeeDetailsByEmpId(row.employeeId);
        this.toGetDocumentsListNew(row.employeeId);
        this.viewEmpID = row.employeeId;
        this.loadEmployeeRoles(row.employeeId);
        //this.getManagementStructureData(row.employeeId);
        //if (row.managmentLegalEntity != null && row.divmanagmentLegalEntity != null && row.biumanagmentLegalEntity != null && row.compmanagmentLegalEntity != null) {
        //    this.departname = row.managementStructeInfo.name;
        //    this.divsioname = row.divmanagmentLegalEntity.name;
        //    this.biuName = row.biumanagmentLegalEntity.name;
        //    this.compnayname = row.compmanagmentLegalEntity.name;
        //}
        //else if (row.biumanagmentLegalEntity != null && row.divmanagmentLegalEntity != null && row.managmentLegalEntity != null) {
        //    this.divsioname = row.managmentLegalEntity.name;
        //    this.biuName = row.divmanagmentLegalEntity.name;
        //    this.compnayname = row.biumanagmentLegalEntity.name;
        //}
        //else if (row.divmanagmentLegalEntity != null && row.managmentLegalEntity != null) {
        //    this.biuName = row.managmentLegalEntity.name;
        //    this.compnayname = row.divmanagmentLegalEntity.name;
        //}
        //else if (row.managementStructeInfo != null) {
        //    this.compnayname = row.managmentLegalEntity.name;
        //}
        //else {
        //    //console.log("no Info Presnts")
        //}
        //this.empMemo = row.memo;
        //if (row.employeetraingInfo != null && row.employeetraingInfo.frequencyOfTrainingId > 0) {
        //    this.frequencyOfTrainingData = getValueFromArrayOfObjectById('label', 'value', row.employeetraingInfo.frequencyOfTrainingId, this.getAllFrequencyTrainingInfodrpData);
        //}
        //else {
        //    this.frequencyOfTrainingData = "";
        //}
        //if (row.currencyId > 0) {
        //    this.currencyName = getValueFromArrayOfObjectById('symbol', 'currencyId', row.currencyId, this.allCurrencyData);
        //}
        //else {
        //    this.currencyName = "";
        //}
        //if (row.stationId > 0) {
        //    this.stationName = getValueFromArrayOfObjectById('label', 'value', row.stationId, this.getAllAllStationInfodrpData);
        //}
        //else {
        //    this.stationName = "";
        //}
        //if (row.empSupervisor != null) {
        //    this.supervisiorname = row.empSupervisor.firstName
        //}
        //this.originationCounty = row.orgCountries ? row.orgCountries.countries_name : '';
        //this.nationalCountry = row.nationalCountryId ? row.nationalCountryId.countries_name : '';
        //if (row.employeeExpertise != null) {
        //    this.empExpertisedescription = row.employeeExpertise.description
        //}
        //// if (row.jobtype != null) {
        ////     this.jobTypeName = row.jobtype.jobTypeName
        //// }
        //if (row.jobtitle != null) {
        //    this.jobTitleName = row.jobtitle.description
        //}
        //if (row.employeetraingType != null) {
        //    this.empTrainningInfo = row.employeetraingType.description
        //}
        //if (row.managementStructeInfo != null) {
        //    this.companyCode = row.managementStructeInfo.code;
        //}
        //if (row.buInfo != null) {
        //    this.businessUnit = row.buInfo.code;
        //}
        //if (row.departmentInfo != null) {
        //    this.departmentCode = row.departmentInfo.code;
        //}
        //if (row.divisonInfo != null) {
        //    this.divisionCode = row.divisonInfo.code;
        //}
        //this.jobTypeName = row.jobtype.jobTypeName;
        //this.viewGeneralDetails = row;
        //this.viewempDetails = row;
        //this.viewTraining = row;
        // this.allEmployeelist = row;
        this.empService.getEmployeeListforView(row.employeeId).subscribe(function (results) { return _this.onemployeeDataLoadSuccessful(results[0]); }, function (error) { return _this.onDataLoadFailed(error); });
    };
    EmployeesListComponent.prototype.dismissModel = function () {
        this.modal.close();
    };
    EmployeesListComponent.prototype.handleChange = function (rowData, e) {
        var _this = this;
        if (e.checked == false) {
            this.sourceEmployee = rowData;
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.IsActive = false;
            var employpeeleaveTypeId = [];
            employpeeleaveTypeId.push(this.sourceEmployee.employeeLeaveTypeId);
            this.sourceEmployee.employeeLeaveTypeId = employpeeleaveTypeId;
            this.Active = "In Active";
            this.sourceEmployee.isActive = false;
            this.empService.updateActionforActive(this.sourceEmployee).subscribe(function (response) { return _this.saveCompleted(_this.sourceEmployee); }, function (error) { return _this.saveFailedHelper(error); });
            //alert(e);
        }
        else {
            var employpeeleaveTypeId = [];
            this.sourceEmployee = rowData;
            employpeeleaveTypeId.push(this.sourceEmployee.employeeLeaveTypeId);
            this.sourceEmployee.employeeLeaveTypeId = employpeeleaveTypeId;
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.IsActive = true;
            this.Active = "Active";
            this.sourceEmployee.isActive == true;
            this.empService.updateActionforActive(this.sourceEmployee).subscribe(function (response) { return _this.saveCompleted(_this.sourceEmployee); }, function (error) { return _this.saveFailedHelper(error); });
            //alert(e);
        }
    };
    EmployeesListComponent.prototype.ExpandAllEmployeeDetailsModel = function () {
        jquery_1["default"]('#step1').collapse('show');
        jquery_1["default"]('#step2').collapse('show');
        jquery_1["default"]('#step3').collapse('show');
        jquery_1["default"]('#step4').collapse('show');
    };
    EmployeesListComponent.prototype.CloseAllEmployeerDetailsModel = function () {
        jquery_1["default"]('#step1').collapse('hide');
        jquery_1["default"]('#step2').collapse('hide');
        jquery_1["default"]('#step3').collapse('hide');
        jquery_1["default"]('#step4').collapse('hide');
    };
    EmployeesListComponent.prototype.dismissDocumentPopupModel = function (type) {
        this.closeMyModel(type);
    };
    EmployeesListComponent.prototype.closeMyModel = function (type) {
        jquery_1["default"](type).modal("hide");
    };
    EmployeesListComponent.prototype.getAuditHistoryById = function (rowData) {
        var _this = this;
        this.isSpinnerVisible = true;
        this.empService.getEmployeeAuditDetails(rowData.employeeId).subscribe(function (res) {
            _this.auditHistory = res;
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeesListComponent.prototype.getColorCodeForHistory = function (i, field, value) {
        var data = this.auditHistory;
        var dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            }
            else {
                return data[i + 1][field] === value;
            }
        }
    };
    EmployeesListComponent.prototype.getAllFrequencyTrainingData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.commonService.smartDropDownList('FrequencyOfTraining', 'FrequencyOfTrainingId', 'FrequencyName').subscribe(function (res) {
                            _this.getAllFrequencyTrainingInfodrpData = res;
                        }, function (err) {
                            _this.isSpinnerVisible = false;
                            var errorLog = err;
                            _this.errorMessageHandler(errorLog);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EmployeesListComponent.prototype.getDeleteDocumentListByStatus = function (value, empID) {
        if (value) {
            this.currenDocDeletedstatus = true;
        }
        else {
            this.currenDocDeletedstatus = false;
        }
        this.toGetDocumentsListNew(empID);
    };
    // toGetEmployeeTrainingDocumentsList(employeeId) {
    //     var moduleId = 4;
    //     this.commonService.GetDocumentsList(employeeId, moduleId).subscribe(res => {
    //         this.allEmployeeTrainingDocumentsList = res;
    //     })
    // }
    EmployeesListComponent.prototype.toGetDocumentsListNew = function (employeeId) {
        var _this = this;
        var moduleId = 4;
        this.commonService.GetDocumentsListNew(employeeId, moduleId, this.currenDocDeletedstatus).subscribe(function (res) {
            _this.allEmployeeTrainingDocumentsList = res;
            _this.allCustomerFinanceDocumentsListOriginal = res;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeesListComponent.prototype.downloadFileUpload = function (rowData) {
        var url = this.configurations.baseUrl + "/api/FileUpload/downloadattachedfile?filePath=" + rowData.link;
        window.location.assign(url);
    };
    EmployeesListComponent.prototype.loadCurrencyData = function () {
        var _this = this;
        this.currencyService.getCurrencyList().subscribe(function (currencydata) {
            _this.allCurrencyData = currencydata[0];
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    // private loadShiftData() {       
    //     this.empService.getshift().subscribe(data => {           
    //             this.allShiftData = data[0];     
    //             console.log(this.allShiftData);
    //         })
    // }
    EmployeesListComponent.prototype.getAllStationData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.commonService.smartDropDownList('EmployeeStation', 'EmployeeStationId', 'StationName').subscribe(function (res) {
                            _this.getAllAllStationInfodrpData = res;
                        }, function (err) {
                            _this.isSpinnerVisible = false;
                            var errorLog = err;
                            _this.errorMessageHandler(errorLog);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EmployeesListComponent.prototype.getManagementStructureData = function (empId) {
        var _this = this;
        this.selectedRoleNames = '';
        //let roles = [];
        this.empService.getStoredEmployeeRoles(empId)
            .subscribe(function (employeeList) {
            if (_this.employeeRolesList != null) {
                _this.employeeRolesList.forEach(function (mainRole) {
                    employeeList.forEach(function (role) {
                        if (role.roleId == mainRole['id']) {
                            //roles.push(mainRole['name']);
                            _this.selectedRoleNames += mainRole['name'] + ',';
                        }
                    });
                });
            }
        });
        this.empService.getStoredEmployeeManagementStructure(empId)
            .subscribe(function (managementStructureList) {
            _this.empService.legalEnityList = managementStructureList;
        });
    };
    EmployeesListComponent.prototype.loadEmployeeRoles = function (empId) {
        var _this = this;
        this.empService.getAllRolesOfEmployee().subscribe(function (results) {
            _this.employeeRolesList = results;
            _this.employeeRoleLabel = _this.employeeRolesList.map(function (emp) { return emp['name']; });
            _this.loadManagementStructure(empId);
        }, function (error) { return console.log(error); });
    };
    EmployeesListComponent.prototype.loadManagementStructure = function (empId) {
        var _this = this;
        this.legalEntityService.getManagemententity().subscribe(function (results) {
            _this.onManagemtntdataLoad(results[0]);
            _this.getManagementStructureData(empId);
        }, function (error) {
            console.log(error);
        });
    };
    EmployeesListComponent.prototype.onManagemtntdataLoad = function (getAtaMainList) {
        this.allManagemtninfo = getAtaMainList;
        for (var i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].tagName != null) {
                this.tagNameCollection.push(this.allManagemtninfo[i]);
            }
        }
        if (this.allManagemtninfo) {
            this.gridData = [{
                    data: {
                        fullName: this.allManagemtninfo[0].companyName,
                        isRoot: true,
                        managementStructureId: 0
                    },
                    children: this.makeNestedObj(this.allManagemtninfo, null),
                    isCheckboxNotDisable: true
                }];
        }
    };
    EmployeesListComponent.prototype.makeNestedObj = function (arr, parent) {
        var out = [];
        for (var i in arr) {
            if (arr[i].parentId == parent) {
                var children = this.makeNestedObj(arr, arr[i].managementStructureId);
                arr[i] = { "data": arr[i] };
                if (children.length) {
                    arr[i].children = children;
                }
                out.push(arr[i]);
            }
        }
        return out;
    };
    EmployeesListComponent.prototype.toGetEmployeeDetailsByEmpId = function (employeeId) {
        var _this = this;
        this.empService.toGetEmployeeDetailsByEmpId(employeeId).subscribe(function (res) {
            _this.empDetailsData = res;
            _this.empshifttype = _this.empDetailsData.shiftnames;
            _this.supervisorname = _this.empDetailsData.supervisorName;
            _this.empcreatedby = _this.empDetailsData.createdBy;
            _this.empcreatedDate = _this.empDetailsData.createdDate;
            _this.compmanagmentLegalEntityName = _this.empDetailsData.compmanagmentLegalEntityName;
            _this.biumanagmentLegalEntityName = _this.empDetailsData.biumanagmentLegalEntityName;
            _this.divmanagmentLegalEntityName = _this.empDetailsData.divmanagmentLegalEntityName;
            _this.managmentLegalEntityName = _this.empDetailsData.managmentLegalEntityName;
            _this.originatingCountryName = _this.empDetailsData.originatingCountryName;
            _this.shiftNames = _this.empDetailsData.shiftNames;
            _this.currencyName = _this.empDetailsData.currencyName;
            _this.leavetypenames = _this.empDetailsData.leavetypenames;
            _this.stationName = _this.empDetailsData.stationName;
            _this.jobTitleName = _this.empDetailsData.jobTitle;
            _this.empExpertiseName = _this.empDetailsData.employeeExpertiseName;
            _this.empleaveType = _this.empDetailsData.leaveTypeNames;
            _this.empstatus = _this.empDetailsData.isActive;
            _this.getManagementStructureNameandCodes(_this.empDetailsData.managementStructureId);
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeesListComponent.prototype.getAllAircraftManfacturer = function () {
        var _this = this;
        this.itemser.getAircraft().subscribe(function (res) {
            _this.manufacturerData = res[0].map(function (x) {
                return {
                    value: x.aircraftTypeId, label: x.description
                };
            });
        });
    };
    EmployeesListComponent.prototype.pageIndexChange = function (event) {
        this.pageSize = event.rows;
    };
    EmployeesListComponent.prototype.getPageCount = function (totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize);
    };
    EmployeesListComponent.prototype.dateFilterForTable = function (date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.allEmployeeTrainingDocumentsList = this.allCustomerFinanceDocumentsListOriginal;
            var data = __spreadArrays(this.allEmployeeTrainingDocumentsList.filter(function (x) {
                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                }
                else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            }));
            this.allEmployeeTrainingDocumentsList = data;
        }
        else {
            this.allEmployeeTrainingDocumentsList = this.allCustomerFinanceDocumentsListOriginal;
        }
    };
    EmployeesListComponent.prototype.openHistoryDoc = function (rowData) {
        var _this = this;
        this.isSpinnerVisible = true;
        this.commonService.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(function (res) {
            _this.sourceViewforDocumentAudit = res;
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeesListComponent.prototype.getColorCodeForHistoryDoc = function (i, field, value) {
        var data = this.sourceViewforDocumentAudit;
        var dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            }
            else {
                return data[i + 1][field] === value;
            }
        }
    };
    __decorate([
        core_1.Input()
    ], EmployeesListComponent.prototype, "isEnablePOList");
    EmployeesListComponent = __decorate([
        core_1.Component({
            selector: 'app-employees-list',
            templateUrl: './employees-list.component.html',
            styleUrls: ['./employees-list.component.scss'],
            animations: [animations_1.fadeInOut],
            providers: [common_1.DatePipe]
        })
        /** employees-list component*/
    ], EmployeesListComponent);
    return EmployeesListComponent;
}());
exports.EmployeesListComponent = EmployeesListComponent;
