"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EmployeeCertificationComponent = void 0;
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var animations_1 = require("../../../../services/animations");
var alert_service_1 = require("../../../../services/alert.service");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
// import { CertificationType } from '../../../../models/certificationtype.model';
var common_1 = require("@angular/common");
var EmployeeCertificationComponent = /** @class */ (function () {
    function EmployeeCertificationComponent(route, translationService, datePipe, certificationser, router, authService, modalService, activeModal, _fb, alertService, employeeService, dialog, masterComapnyService) {
        this.route = route;
        this.translationService = translationService;
        this.datePipe = datePipe;
        this.certificationser = certificationser;
        this.router = router;
        this.authService = authService;
        this.modalService = modalService;
        this.activeModal = activeModal;
        this._fb = _fb;
        this.alertService = alertService;
        this.employeeService = employeeService;
        this.dialog = dialog;
        this.masterComapnyService = masterComapnyService;
        this.isEnableNext = false;
        this.isSpinnerVisible = false;
        this.descriptioncolle = [];
        this.displayedColumns = ['employeeId', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
        this.allEmployeeinfo = [];
        this.allComapnies = [];
        this.sourceAction = {};
        this.auditHisory = [];
        this.title = "Create";
        this.localCollection = [];
        this.nextbuttonEnable = false;
        this.today = new Date();
        /** Actions ctor */
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.enableSaveBtn = false;
        this.Active = "Active";
        this.allWorkFlows = [];
        this.isEditContent = false;
        this.sourceEmployee = {};
        this.displayedColumns.push('action');
        this.dataSource = new material_1.MatTableDataSource();
    }
    EmployeeCertificationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loadDataforCertification();
        this.employeeId = this.route.snapshot.paramMap.get('id');
        this.isSpinnerVisible = true;
        if (this.employeeId) {
            this.employeeService.employeeId = this.employeeId;
            this.isEditContent = true;
            this.employeeService.employeeId = this.employeeId;
            if (this.empId == null || this.empId == undefined) {
                this.employeeService.toGetEmployeeDetailsByEmpId(this.employeeId).subscribe(function (res) {
                    if (res) {
                        _this.sourceEmployee = res;
                        if (_this.sourceEmployee.employeeLicenseTypeId == null)
                            _this.sourceEmployee.employeeLicenseTypeId = 0;
                        _this.route.queryParams
                            .filter(function (params) { return params.order; })
                            .subscribe(function (params) {
                            _this.empId = params.order;
                            if (_this.empId) {
                                _this.nextbuttonEnable = true;
                            }
                            else {
                            }
                            _this.firstName = params.firstname;
                            _this.lastName = params.lastname;
                        });
                    }
                    _this.empId = _this.sourceEmployee.employeeId;
                    _this.firstName = _this.sourceEmployee.firstName;
                    _this.lastName = _this.sourceEmployee.lastName;
                    _this.isEnableNext = true;
                    if (_this.sourceEmployee.employeeId) {
                        _this.nextbuttonEnable = true;
                    }
                    _this.employeeService.bredcrumbObj.next(_this.employeeService.currentUrl);
                    _this.employeeService.ShowPtab = true;
                    _this.employeeService.alertObj.next(_this.employeeService.ShowPtab); //steps   
                    setTimeout(function () {
                        _this.isSpinnerVisible = true;
                        _this.getwithemployeeLicensureId();
                        _this.isSpinnerVisible = false;
                    }, 1200);
                });
            }
            this.employeeService.currentUrl = this.employeeService.currentUrl = "/employeesmodule/employeepages/app-employee-certification-edit/" + this.employeeId;
        }
        else {
            this.isSpinnerVisible = false;
            this.employeeService.currentUrl = '/employeesmodule/employeepages/app-employee-certification';
        }
        // if (this.employeeService.generalCollection) {
        //     this.local = this.employeeService.generalCollection;
        // }
        /*
        if (this.employeeService.listCollection && this.employeeService.isEditMode == true) {
            this.isEnableNext=true;
            this.sourceEmployee = this.employeeService.listCollection;
            if (this.sourceEmployee.employeeId) {
                this.nextbuttonEnable = true;
            }
            this.empId = this.sourceEmployee.employeeId;
            this.firstName=this.employeeService.listCollection.firstName;
            this.lastName=this.employeeService.listCollection.lastName;
            // this.firstName = editValueAssignByCondition('firstName', this.sourceEmployee.firstName);
            // this.lastName = editValueAssignByCondition('lastName', this.sourceEmployee.lastName);
            this.local = this.employeeService.listCollection;
            // this.sourceEmployee.certificationDate = new Date();
            this.getwithemployeeLicensureId();
        }
        else if(this.employeeService.listCollection){  //for add load data when switch between tabs
            this.getwithemployeeLicensureId();
        }*/
        // this.employeeService.currentUrl = '/employeesmodule/employeepages/app-employee-certification';
        // this.route.queryParams
        //     .filter(params => params.order)
        //     .subscribe(params => {               
        //         this.empId = params.order;
        //         if (this.empId) {
        //             this.nextbuttonEnable = true;
        //         }
        //         else {
        //         }
        //         //this.nextEnable();
        //         this.firstName = params.firstname;
        //         this.lastName = params.lastname;
        //     });      
        // if (this.local) {
        //     this.loadData();
        //     // this.loadDataforCertification();
        // }
    };
    EmployeeCertificationComponent.prototype.ngAfterViewInit = function () {
        //this.loadCerertifcationByempId();
        //this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;
    };
    EmployeeCertificationComponent.prototype.enableSave = function () {
        this.enableSaveBtn = true;
    };
    EmployeeCertificationComponent.prototype.loadCerertifcationByempId = function () {
        var _this = this;
        this.isSpinnerVisible = true;
        this.employeeService.getEmployeeCertifications(this.employeeId).subscribe(function (data) {
            _this.bindData(data[0]);
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeeCertificationComponent.prototype.errorMessageHandler = function (log) {
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
    EmployeeCertificationComponent.prototype.bindData = function (data) {
        if (this.sourceEmployee.expirationDate == undefined) {
            this.sourceEmployee.expirationDate = "";
        }
        else {
            this.sourceEmployee.expirationDate = this.datePipe.transform(data.t.expirationDate, "MM/dd/yyyy");
            // this.sourceEmployee.expirationDate=new Date(data.workOrderDiscovery.inspectorDate)
        }
        if (this.sourceEmployee.isExpirationDate == undefined) {
            this.sourceEmployee.isExpirationDate = false;
        }
        else {
            this.sourceEmployee.isExpirationDate = data.t.isExpirationDate;
        }
    };
    EmployeeCertificationComponent.prototype.saveCertificateData = function () {
        var _this = this;
        this.isSpinnerVisible = true;
        if (this.sourceEmployee.isExpirationDate == undefined) {
            this.sourceEmployee.isExpirationDate = false;
        }
        if (this.sourceEmployee.isLicenseInForce == undefined) {
            this.sourceEmployee.isLicenseInForce = false;
        }
        this.isSaving = true;
        if (!this.sourceEmployee.employeeLicensureId) {
            this.sourceEmployee.createdBy = this.userName;
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.isActive = true;
            this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
            this.sourceEmployee.employeeId = this.empId;
            this.sourceEmployee.certificationDate = this.datePipe.transform(this.sourceEmployee.certificationDate, "MM/dd/yyyy");
            this.sourceEmployee.expirationDate = this.datePipe.transform(this.sourceEmployee.expirationDate, "MM/dd/yyyy");
            this.employeeService.newAddCertification(this.sourceEmployee).subscribe(function (data) {
                _this.getwithemployeeLicensureId();
                _this.isEnableNext = true;
                _this.isEditContent = true;
                _this.nextbuttonEnable = true;
                _this.alertService.showMessage("Success", 'Employee Certification Added Successfully.', alert_service_1.MessageSeverity.success);
                if (data.employeeId) {
                    _this.isEnableNext = true;
                }
                _this.employeeService.generalCollection = _this.local;
                _this.enableSaveBtn = false;
                _this.isSpinnerVisible = false;
            });
        }
        else {
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
            this.sourceEmployee['expirationDateTemp'] = this.sourceEmployee.expirationDate;
            this.sourceEmployee.expirationDate = this.datePipe.transform(this.sourceEmployee.expirationDate, "MM/dd/yyyy");
            this.sourceEmployee.certificationDate = this.datePipe.transform(this.sourceEmployee.certificationDate, "MM/dd/yyyy");
            this.employeeService.updateCertificationDetails(this.sourceEmployee).subscribe(function (data) {
                _this.alertService.showMessage("Success", 'Employee Certification updated successfully.', alert_service_1.MessageSeverity.success);
                _this.employeeService.generalCollection = _this.local;
                _this.enableSaveBtn = false;
                _this.isSpinnerVisible = false;
            });
            var data = { "empId": this.empId, "firstName": this.firstName, "lastName": this.lastName };
            var stringData = JSON.stringify(data);
            var encryptedData = btoa(JSON.stringify(data));
        }
    };
    Object.defineProperty(EmployeeCertificationComponent.prototype, "currentUserMasterCompanyId", {
        get: function () {
            return this.authService.currentUser
                ? this.authService.currentUser.masterCompanyId
                : null;
        },
        enumerable: false,
        configurable: true
    });
    // Load Employee lcience data//
    EmployeeCertificationComponent.prototype.getwithemployeeLicensureId = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.employeeService.getCertificationList(this.empId).subscribe(function (results) { return _this.onCertifywithEmpId(results[0]); }, function (error) { return _this.onDataLoadFailed(error); });
        this.cols = [
            { field: 'licenseNumber', header: 'Certification' },
            { field: 'employeeLicenseTypeId', header: 'Certification Type' },
            { field: 'certifyingInstitution', header: 'Certification Institution' },
            { field: 'certificationDate', header: 'certification Date' },
            { field: 'isLicenseInForce', header: 'Certification In Force' },
            { field: 'createdBy', header: 'Created By' },
            { field: 'updatedBy', header: 'Updated By' },
            { field: 'updatedDate', header: 'Updated Date' },
            { field: 'createdDate', header: 'Created Date' }
        ];
        this.selectedColumns = this.cols;
    };
    // Load Emp list
    EmployeeCertificationComponent.prototype.loadData = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.employeeService.getEmployeeList().subscribe(function (results) { return _this.onDataLoadSuccessful(results[0]); }, function (error) { return _this.onDataLoadFailed(error); });
    };
    // Load Master Cpmpanies
    EmployeeCertificationComponent.prototype.loadMasterCompanies = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.masterComapnyService.getMasterCompanies().subscribe(function (results) { return _this.onDataMasterCompaniesLoadSuccessful(results[0]); }, function (error) { return _this.onDataLoadFailed(error); });
    };
    EmployeeCertificationComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue;
    };
    EmployeeCertificationComponent.prototype.refresh = function () {
        // Causes the filter to refresh there by updating with recently added data.
        this.applyFilter(this.dataSource.filter);
    };
    EmployeeCertificationComponent.prototype.onDataLoadSuccessful = function (getCertificationList) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getCertificationList;
        this.allEmployeeinfo = getCertificationList;
    };
    EmployeeCertificationComponent.prototype.loadDataforCertification = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.certificationser.getWorkFlows().subscribe(function (results) { return _this.onDataLoadSuccessfulforCertification(results[0]); }, function (error) { return _this.onDataLoadFailed(error); });
    };
    EmployeeCertificationComponent.prototype.onDataLoadSuccessfulforCertification = function (allWorkFlows) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allCertification = allWorkFlows;
    };
    EmployeeCertificationComponent.prototype.onCertifywithEmpId = function (certfilist) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = certfilist;
        this.data = certfilist;
        if (this.data.length > 0) {
            this.sourceEmployee = this.data[0].t;
            if (this.sourceEmployee.certificationDate != null) {
                this.sourceEmployee.certificationDate = new Date(this.sourceEmployee.certificationDate);
            }
            if (this.sourceEmployee.expirationDate != null) {
                this.sourceEmployee.expirationDate = new Date(this.sourceEmployee.expirationDate);
            }
        }
    };
    EmployeeCertificationComponent.prototype.onHistoryLoadSuccessful = function (auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.auditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg' });
        this.modal.result.then(function () {
        }, function () { });
    };
    EmployeeCertificationComponent.prototype.onDataMasterCompaniesLoadSuccessful = function (allComapnies) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;
    };
    EmployeeCertificationComponent.prototype.onDataLoadFailed = function (error) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
    };
    EmployeeCertificationComponent.prototype.handleChange = function (rowData, e) {
        var _this = this;
        if (e.checked == false) {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceAction.isActive == false;
            this.employeeService.updateEmployee(this.sourceAction).subscribe(function (response) { return _this.saveCompleted(_this.sourceAction); }, function (error) { return _this.saveFailedHelper(error); });
        }
        else {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceAction.isActive == true;
            this.employeeService.updateEmployee(this.sourceAction).subscribe(function (response) { return _this.saveCompleted(_this.sourceAction); }, function (error) { return _this.saveFailedHelper(error); });
        }
    };
    EmployeeCertificationComponent.prototype.open = function (content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction.isActive = true;
        this.employeeName = "";
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(function () {
        }, function () { });
    };
    EmployeeCertificationComponent.prototype.openDelete = function (content, row) {
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(function () {
        }, function () { });
    };
    EmployeeCertificationComponent.prototype.openEdit = function (content, row) {
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
    EmployeeCertificationComponent.prototype.openHelpText = function (content) {
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(function () {
        }, function () { });
    };
    EmployeeCertificationComponent.prototype.openHist = function (content, row) {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.sourceAction = row;
        this.employeeService.historyEmployee(this.sourceAction.employeeId).subscribe(function (results) { return _this.onHistoryLoadSuccessful(results[0], content); }, function (error) { return _this.saveFailedHelper(error); });
    };
    EmployeeCertificationComponent.prototype.editItemAndCloseModel = function () {
        var _this = this;
        this.isSaving = true;
        if (!this.sourceEmployee.employeeLicensureId) {
            this.sourceEmployee.createdBy = this.userName;
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.isActive = true;
            this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
            this.sourceEmployee.employeeId = this.local.employeeId;
            this.employeeService.newAddCertification(this.sourceEmployee).subscribe(function (data) {
                _this.alertService.showMessage('Employee Certification Added successfully.');
                _this.localCollection = data;
                _this.employeeService.generalCollection = _this.local;
            });
            (function (response) { return _this.saveCompleted(_this.sourceEmployee); });
            this.activeIndex = 1;
            this.employeeService.indexObj.next(this.activeIndex);
        }
        else {
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
            this.employeeService.updateCertificationDetails(this.sourceEmployee).subscribe(function (data) {
                //this.alertService.showMessage('Employee Certification updated successfully.');
                _this.alertService.showMessage("Success", 'Employee Certification updated successfully.', alert_service_1.MessageSeverity.success);
                _this.employeeService.generalCollection = _this.local;
            });
            (function (response) { return _this.saveCompleted(_this.sourceEmployee); });
            this.activeIndex = 1;
            this.employeeService.indexObj.next(this.activeIndex);
        }
    };
    EmployeeCertificationComponent.prototype.deleteItemAndCloseModel = function () {
        var _this = this;
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.employeeService.deleteEmployee(this.sourceAction.employeeId).subscribe(function (response) { return _this.saveCompleted(_this.sourceAction); }, function (error) { return _this.saveFailedHelper(error); });
        this.modal.close();
    };
    EmployeeCertificationComponent.prototype.filterEmployees = function (event) {
        this.localCollection = [];
        for (var i = 0; i < this.allEmployeeinfo.length; i++) {
            var employeeName = this.allEmployeeinfo[i].employeeName;
            if (employeeName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(employeeName);
            }
        }
    };
    EmployeeCertificationComponent.prototype.dismissModel = function () {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    };
    EmployeeCertificationComponent.prototype.saveCompleted = function (user) {
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
    EmployeeCertificationComponent.prototype.saveSuccessHelper = function (role) {
        this.isSaving = false;
        this.alertService.showMessage("Success", "Action was created successfully", alert_service_1.MessageSeverity.success);
        this.loadData();
    };
    Object.defineProperty(EmployeeCertificationComponent.prototype, "userName", {
        get: function () {
            return this.authService.currentUser ? this.authService.currentUser.userName : "";
        },
        enumerable: false,
        configurable: true
    });
    EmployeeCertificationComponent.prototype.saveFailedHelper = function (error) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", alert_service_1.MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, alert_service_1.MessageSeverity.error);
    };
    EmployeeCertificationComponent.prototype.getDismissReason = function (reason) {
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
    EmployeeCertificationComponent.prototype.gotnextClick = function () {
        this.activeIndex = 2;
        this.employeeService.indexObj.next(this.activeIndex);
        if (this.employeeId) {
            this.router.navigateByUrl("/employeesmodule/employeepages/app-employee-training-edit/" + this.employeeId);
        }
        else {
            this.router.navigate(['/employeesmodule/employeepages/app-employee-training'], { queryParams: { order: this.empId, 'firstName': this.firstName, 'lastName': this.lastName } });
        }
    };
    EmployeeCertificationComponent.prototype.previousClick = function () {
        // this.employeeService.listCollection = this.local;
        this.activeIndex = 0;
        this.employeeService.indexObj.next(this.activeIndex);
        if (this.employeeId) {
            this.router.navigateByUrl("employeesmodule/employeepages/app-employee-general-information-edit/" + this.employeeId);
        }
        else {
            this.router.navigate(['/employeesmodule/employeepages/app-employee-general-information'], { queryParams: { order: this.empId, 'firstName': this.firstName, 'lastName': this.lastName } });
        }
        // this.router.navigateByUrl('/employeesmodule/employeepages/app-employee-general-information');
    };
    EmployeeCertificationComponent.prototype.certificationType = function (event) {
        if (this.allCertification) {
            for (var i = 0; i < this.allCertification.length; i++) {
                if (event == this.allCertification[i].description) {
                    this.disablesave = true;
                    this.selecteddescription = event;
                }
            }
        }
    };
    EmployeeCertificationComponent.prototype.certificationHandlerHandler = function (event) {
        if (event.target.value != "") {
            var value = event.target.value.toLowerCase();
            if (this.selecteddescription) {
                if (value == this.selecteddescription.toLowerCase()) {
                    this.disablesave = true;
                }
                else {
                    this.disablesave = false;
                }
            }
        }
    };
    EmployeeCertificationComponent.prototype.filtercertificationType = function (event) {
        this.certificationtypeCollection = [];
        for (var i = 0; i < this.allCertification.length; i++) {
            var description = this.allCertification[i].description;
            if (description.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.descriptioncolle.push([{
                        "employeeLicensureId": this.allCertification[i].employeeLicensureId,
                        "description": description
                    }]),
                    this.certificationtypeCollection.push(description);
            }
        }
    };
    EmployeeCertificationComponent.prototype.saveCertification = function () {
        var _this = this;
        this.isSaving = true;
        if (this.isEditMode == false) {
            this.sourceEmployee.createdBy = this.userName;
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.description = this.description;
            this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
            this.certificationser.newCertificationtype(this.sourceEmployee).subscribe(function (data) {
                _this.getwithemployeeLicensureId();
                _this.loadDataforCertification();
                _this.isEnableNext = true;
                _this.nextbuttonEnable = true;
                _this.sourceEmployee.employeeLicensureId = data.employeeLicensureId;
            });
        }
        else {
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.description = this.description;
            this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
            this.certificationser.updateCertificationtype(this.sourceEmployee).subscribe(function (response) {
                // this.router.navigate(['/employeesmodule/employeepages/app-employee-training']);
                _this.isEnableNext = true;
                _this.saveCompleted(_this.sourceEmployee),
                    function (error) { return _this.saveFailedHelper(error); };
            });
        }
        this.modal.close();
    };
    EmployeeCertificationComponent.prototype.openCertification = function (content) {
        this.disablesave = false;
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.disablesave = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.description = "";
        this.sourceEmployee.isActive = true;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(function () {
        }, function () { });
    };
    EmployeeCertificationComponent.prototype.nextClick = function (nextOrPrevious) {
        this.nextOrPreviousTab = nextOrPrevious;
        if (this.formdata.form.dirty) {
            var content = this.tabRedirectConfirmationModal2;
            this.modal = this.modalService.open(content, { size: "sm" });
        }
        else {
            if (this.nextOrPreviousTab == 'Previous') {
                this.previousClick();
            }
            else {
                this.gotnextClick();
            }
        }
    };
    EmployeeCertificationComponent.prototype.redirectToTabWithoutSave = function () {
        this.dismissModel();
        if (this.nextOrPreviousTab == 'Previous') {
            this.previousClick();
        }
        else {
            this.gotnextClick();
        }
    };
    EmployeeCertificationComponent.prototype.redirectToTab = function () {
        this.saveCertificateData();
        this.dismissModel();
        if (this.nextOrPreviousTab == 'Previous') {
            this.previousClick();
        }
        else {
            this.gotnextClick();
        }
    };
    __decorate([
        core_1.ViewChild("tabRedirectConfirmationModal2")
    ], EmployeeCertificationComponent.prototype, "tabRedirectConfirmationModal2");
    __decorate([
        core_1.ViewChild("empform")
    ], EmployeeCertificationComponent.prototype, "formdata");
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], EmployeeCertificationComponent.prototype, "paginator");
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], EmployeeCertificationComponent.prototype, "sort");
    EmployeeCertificationComponent = __decorate([
        core_1.Component({
            selector: 'app-employee-certification',
            templateUrl: './employee-certification.component.html',
            styleUrls: ['./employee-certification.component.scss'],
            animations: [animations_1.fadeInOut],
            providers: [common_1.DatePipe]
        })
    ], EmployeeCertificationComponent);
    return EmployeeCertificationComponent;
}());
exports.EmployeeCertificationComponent = EmployeeCertificationComponent;
