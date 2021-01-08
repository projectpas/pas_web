"use strict";
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
exports.EmployeeTrainingComponent = void 0;
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var animations_1 = require("../../../../services/animations");
var alert_service_1 = require("../../../../services/alert.service");
var db_Keys_1 = require("../../../../services/db-Keys");
var autocomplete_1 = require("../../../../generic/autocomplete");
var $ = require("jquery");
var moment = require("moment");
var EmployeeTrainingComponent = /** @class */ (function () {
    function EmployeeTrainingComponent(route, aircraftModelService, itemser, translationService, unitService, authService, modalService, activeModal, _fb, alertService, router, employeeService, dialog, masterComapnyService, localStorage, commonService, configurations) {
        this.route = route;
        this.aircraftModelService = aircraftModelService;
        this.itemser = itemser;
        this.translationService = translationService;
        this.unitService = unitService;
        this.authService = authService;
        this.modalService = modalService;
        this.activeModal = activeModal;
        this._fb = _fb;
        this.alertService = alertService;
        this.router = router;
        this.employeeService = employeeService;
        this.dialog = dialog;
        this.masterComapnyService = masterComapnyService;
        this.localStorage = localStorage;
        this.commonService = commonService;
        this.configurations = configurations;
        this.isSaving = true;
        this.durationTypes = [
            { id: 1, type: 'Days' },
            { id: 2, type: 'Weeks' },
            { id: 3, type: 'Months' },
            { id: 3, type: 'Years' }
        ];
        this.isEnableNext = false;
        this.displayedColumns = ['employeeId', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
        this.allEmployeeinfo = [];
        this.allComapnies = [];
        this.sourceAction = {};
        this.auditHisory = [];
        this.isSpinnerVisible = false;
        this.title = "Create";
        this.localCollection = [];
        this.sourceEmployee = {};
        this.allWorkFlows = [];
        this.nextbuttonEnable = false;
        this.formData = new FormData();
        this.allEmployeeTrainingDocumentsList = [];
        /** Actions ctor */
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.Active = "Active";
        this.isPopup = false;
        this.disableFileAttachmentSubmit = true;
        this.disableSave = true;
        this.totalRecordNew = 0;
        this.pageSizeNew = 3;
        this.empModuleId = 0;
        this.totalPagesNew = 0;
        this.currentDeletedstatus = false;
        this.pageSize = 3;
        this.sourceViewforDocumentListColumns = [
            { field: 'fileName', header: 'File Name' },
        ];
        this.customerDocumentsColumns = [
            { field: 'docName', header: 'Name' },
            { field: 'docDescription', header: 'Description' },
            { field: 'docMemo', header: 'Memo' },
            { field: 'fileName', header: 'File Name' },
            { field: 'fileSize', header: 'File Size' },
            { field: 'createdDate', header: 'Created Date' },
            { field: 'createdBy', header: 'Created By' },
            { field: 'updatedDate', header: 'Updated Date' },
            { field: 'updatedBy', header: 'Updated By' },
        ];
        this.selectedColumnsDoc = this.customerDocumentsColumns;
        this.sourceViewforDocumentList = [];
        this.sourceViewforDocument = [];
        this.sourceViewforDocumentAudit = [];
        this.isEditButton = false;
        this.documentInformation = {
            docName: '',
            docMemo: '',
            docDescription: '',
            attachmentDetailId: 0
        };
        this.selectedFileAttachment = [];
        this.selectedFile = null;
        this.allDocumentListOriginal = [];
        this.isEditContent = false;
        this.setExpireDate = new Date();
        this.displayedColumns.push('action');
        this.dataSource = new material_1.MatTableDataSource();
        if (this.employeeService.generalCollection) {
            this.local = this.employeeService.generalCollection;
        }
        this.getAllFrequencyTrainingData();
        this.loadTariningTypes();
        var user = this.localStorage.getDataObject(db_Keys_1.DBkeys.CURRENT_USER);
        this.userA = user.userName;
        this.translationService.closeCmpny = false;
    }
    EmployeeTrainingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isSpinnerVisible = true;
        this.employeeId = this.route.snapshot.paramMap.get('id');
        if (this.employeeId) {
            this.isEditContent = true;
            this.employeeService.employeeId = this.employeeId;
            if (this.empId == null || this.empId == undefined) {
                this.employeeService.toGetEmployeeDetailsByEmpId(this.employeeId).subscribe(function (res) {
                    if (res) {
                        _this.employeeService.employeeId = _this.employeeId;
                        _this.sourceEmployee = res;
                        _this.empId = _this.sourceEmployee.employeeId;
                        _this.firstName = _this.sourceEmployee.firstName;
                        _this.lastName = _this.sourceEmployee.lastName;
                        _this.sourceEmployee.aircraftManufacturerId = 0;
                        _this.sourceEmployee.aircraftModelId = 0;
                        _this.sourceEmployee.employeeTrainingTypeId = 0;
                        _this.sourceEmployee.frequencyOfTrainingId = 0;
                        _this.sourceEmployee.durationTypeId = 0;
                        _this.isEnableNext = true;
                        if (_this.sourceEmployee.employeeId) {
                            _this.nextbuttonEnable = true;
                        }
                        setTimeout(function () {
                            _this.isSpinnerVisible = true;
                            _this.loadData();
                            if (_this.empModuleId == 0 || _this.empModuleId == undefined || _this.empModuleId == null) {
                                _this.commonService.smartDropDownList('AttachmentModule', 'AttachmentModuleId', 'Name').subscribe(function (response) {
                                    if (response) {
                                        response.forEach(function (x) {
                                            if (x.label.toUpperCase() == "EMPLOYEE") {
                                                _this.empModuleId = x.value;
                                            }
                                        });
                                        //this.toGetEmployeeTrainingDocumentsList(this.employeeId,this.empModuleId);
                                        _this.toGetDocumentsListNew(_this.employeeId, _this.empModuleId);
                                    }
                                });
                            }
                            else if (_this.empModuleId > 0) {
                                // this.toGetEmployeeTrainingDocumentsList(this.employeeId,this.empModuleId);
                                _this.toGetDocumentsListNew(_this.employeeId, _this.empModuleId);
                            }
                            _this.isSpinnerVisible = false;
                        }, 1200);
                    }
                }, function (err) {
                    _this.isSpinnerVisible = false;
                    var errorLog = err;
                    _this.errorMessageHandler(errorLog);
                });
            }
            this.employeeService.currentUrl = this.employeeService.currentUrl = "/employeesmodule/employeepages/app-employee-training-edit/" + this.employeeId;
        }
        else {
            this.isSpinnerVisible = false;
            this.employeeService.currentUrl = '/employeesmodule/employeepages/app-employee-training';
        }
        this.employeeService.bredcrumbObj.next(this.employeeService.currentUrl);
        this.employeeService.ShowPtab = true;
        this.employeeService.alertObj.next(this.employeeService.ShowPtab);
        this.getAllAircraftManfacturer();
        this.getAllFrequencyTrainingData();
    };
    EmployeeTrainingComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.route.queryParams
            .filter(function (params) { return params.order; })
            .subscribe(function (params) {
            _this.empId = params.order;
            _this.empId = params.order;
            if (_this.empId) {
                _this.nextbuttonEnable = true;
            }
            else {
            }
            _this.firstName = params.firstname;
            _this.lastName = params.lastname;
        });
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    };
    EmployeeTrainingComponent.prototype.loadData = function () {
        var _this = this;
        this.empId = this.employeeId;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.employeeService.getTrainingList(this.empId).subscribe(function (results) { return _this.onDataLoadSuccessful(results[0]); }, function (error) { return _this.onDataLoadFailed(error); });
    };
    EmployeeTrainingComponent.prototype.loadTariningTypes = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.commonService.smartDropDownList('EmployeeTrainingType', 'EmployeeTrainingTypeId', 'TrainingType').subscribe(function (results) { return _this.onTariningTypesData(results); }, function (error) { return _this.onDataLoadFailed(error); });
    };
    EmployeeTrainingComponent.prototype.getDeleteListByStatus = function (value) {
        if (value) {
            this.currentDeletedstatus = true;
        }
        else {
            this.currentDeletedstatus = false;
        }
        this.toGetDocumentsListNew(this.empId, this.empModuleId);
    };
    EmployeeTrainingComponent.prototype.getAllAircraftManfacturer = function () {
        var _this = this;
        this.itemser.getAircraft().subscribe(function (res) {
            _this.manufacturerData = res[0].map(function (x) {
                return {
                    value: x.aircraftTypeId, label: x.description
                };
            });
        }, function (err) {
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeeTrainingComponent.prototype.onChangeManufacture = function (event, value) {
        this.search_AircraftModelList = [];
        this.loadmodels(value);
    };
    EmployeeTrainingComponent.prototype.loadmodels = function (value) {
        var _this = this;
        this.aircraftModelService
            .getAircraftModelListByManufactureId(value)
            .subscribe(function (models) {
            var responseValue = models[0];
            if (responseValue) {
                _this.search_AircraftModelList = responseValue.map(function (models) {
                    return {
                        label: models.modelName,
                        value: models.aircraftModelId
                    };
                });
            }
        }, function (err) {
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeeTrainingComponent.prototype.loadMasterCompanies = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.masterComapnyService.getMasterCompanies().subscribe(function (results) { return _this.onDataMasterCompaniesLoadSuccessful(results[0]); }, function (error) { return _this.onDataLoadFailed(error); });
    };
    EmployeeTrainingComponent.prototype.applyFilter = function (filterValue) {
        this.dataSource.filter = filterValue;
    };
    EmployeeTrainingComponent.prototype.changeDateEv = function (date) {
        if (date && date < this.setExpireDate) {
            this.setExpireDate = new Date();
        }
        else {
            this.setExpireDate = date;
        }
    };
    EmployeeTrainingComponent.prototype.onDataLoadSuccessful = function (getTrainingList) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getTrainingList;
        this.allEmployeeinfo = getTrainingList;
        if (this.allEmployeeinfo.length > 0) {
            this.sourceEmployee = this.allEmployeeinfo[0].t;
            this.sourceEmployee.aircraftManufacturerId = this.sourceEmployee.aircraftManufacturerId == null ? 0 : this.sourceEmployee.aircraftManufacturerId;
            if (this.sourceEmployee.aircraftManufacturerId > 0) {
                this.loadmodels(this.sourceEmployee.aircraftManufacturerId);
            }
            else {
                this.sourceEmployee.aircraftManufacturerId = 0;
                this.sourceEmployee.aircraftModelId = 0;
            }
            this.sourceEmployee.durationTypeId = this.sourceEmployee.durationTypeId == null ? 0 : this.sourceEmployee.durationTypeId;
            if (this.sourceEmployee.scheduleDate != null) {
                this.sourceEmployee.scheduleDate = new Date(this.sourceEmployee.scheduleDate);
            }
            if (this.sourceEmployee.completionDate != null) {
                this.sourceEmployee.completionDate = new Date(this.sourceEmployee.completionDate);
            }
            if (this.sourceEmployee.completionDate < this.setExpireDate) {
                this.setExpireDate = new Date();
            }
            else {
                this.setExpireDate = this.sourceEmployee.completionDate;
            }
            //this.sourceEmployee.completionDate
            if (this.sourceEmployee.expirationDate != null) {
                this.sourceEmployee.expirationDate = new Date(this.sourceEmployee.expirationDate);
            }
            this.sourceEmployee.cost = this.sourceEmployee.cost ? autocomplete_1.formatNumberAsGlobalSettingsModule(this.sourceEmployee.cost, 2) : '0.00';
        }
    };
    EmployeeTrainingComponent.prototype.pageIndexChange = function (event) {
        this.pageSize = event.rows;
    };
    EmployeeTrainingComponent.prototype.onTariningTypesData = function (getTrainingList) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getTrainingList;
        this.alltrainingTypes = getTrainingList;
    };
    EmployeeTrainingComponent.prototype.onHistoryLoadSuccessful = function (auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.auditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg' });
    };
    EmployeeTrainingComponent.prototype.onDataMasterCompaniesLoadSuccessful = function (allComapnies) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;
    };
    EmployeeTrainingComponent.prototype.onDataLoadFailed = function (error) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
    };
    EmployeeTrainingComponent.prototype.handleChange = function (rowData, e) {
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
    EmployeeTrainingComponent.prototype.onDataPurchaseunitSuccessful = function (getUnitOfMeasureList) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allPurchaseUnitOfMeasureinfo = getUnitOfMeasureList;
    };
    EmployeeTrainingComponent.prototype.Purchaseunitofmeasure = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.unitService.getUnitOfMeasureList().subscribe(function (results) { return _this.onDataPurchaseunitSuccessful(results[0]); }, function (error) { return _this.onDataLoadFailed(error); });
    };
    EmployeeTrainingComponent.prototype.filterPurchaseUnitOfMeasures = function (event) {
        this.localunit = [];
        if (this.allPurchaseUnitOfMeasureinfo) {
            for (var i = 0; i < this.allPurchaseUnitOfMeasureinfo.length; i++) {
                var unitName = this.allPurchaseUnitOfMeasureinfo[i].description;
                if (unitName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.localunit.push(unitName);
                }
            }
        }
    };
    EmployeeTrainingComponent.prototype.open = function (content) {
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
    EmployeeTrainingComponent.prototype.openDelete = function (content, row) {
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(function () {
        }, function () { });
    };
    EmployeeTrainingComponent.prototype.openEdit = function (content, row) {
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
    EmployeeTrainingComponent.prototype.openHelpText = function (content) {
        this.modal = this.modalService.open(content, { size: 'sm' });
    };
    EmployeeTrainingComponent.prototype.openHist = function (content, row) {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.sourceAction = row;
        this.employeeService.historyEmployee(this.sourceAction.employeeId).subscribe(function (results) { return _this.onHistoryLoadSuccessful(results[0], content); }, function (error) { return _this.saveFailedHelper(error); });
    };
    Object.defineProperty(EmployeeTrainingComponent.prototype, "currentUserMasterCompanyId", {
        get: function () {
            return this.authService.currentUser
                ? this.authService.currentUser.masterCompanyId
                : null;
        },
        enumerable: false,
        configurable: true
    });
    EmployeeTrainingComponent.prototype.savetrainigSection = function () {
        var _this = this;
        if (!this.sourceEmployee.employeeTrainingTypeId) {
            this.alertService.showMessage("Failure", "Training Type Required", alert_service_1.MessageSeverity.success);
        }
        else {
            this.isSpinnerVisible = true;
            if (!this.sourceEmployee.employeeTrainingId) {
                this.sourceEmployee.aircraftManufacturerId = this.sourceEmployee.aircraftManufacturerId == 0 ? null : this.sourceEmployee.aircraftManufacturerId;
                this.sourceEmployee.aircraftModelId = this.sourceEmployee.aircraftModelId == 0 ? null : this.sourceEmployee.aircraftModelId;
                this.sourceEmployee.createdBy = this.userName;
                this.sourceEmployee.updatedBy = this.userName;
                this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
                this.sourceEmployee.isActive = true;
                this.sourceEmployee.employeeId = this.empId;
                this.sourceEmployee.createdBy = this.userA;
                this.sourceEmployee.updatedBy = this.userA;
                this.employeeService.newAddTraining(this.sourceEmployee).subscribe(function (data) {
                    _this.isEnableNext = true;
                    _this.isEditContent = true;
                    _this.loadData();
                    _this.onUploadDocumentListNew();
                    _this.isSpinnerVisible = false;
                    _this.isSaving = false;
                    _this.alertService.showMessage("Success", "Training Information Saved Successfully", alert_service_1.MessageSeverity.success);
                    _this.loadData();
                    _this.disableSave = true;
                }, function (err) {
                    _this.isSpinnerVisible = false;
                    var errorLog = err;
                    _this.errorMessageHandler(errorLog);
                });
            }
            else {
                this.sourceEmployee.updatedBy = this.userName;
                this.sourceEmployee.aircraftManufacturerId = this.sourceEmployee.aircraftManufacturerId == 0 ? null : this.sourceEmployee.aircraftManufacturerId;
                this.sourceEmployee.aircraftModelId = this.sourceEmployee.aircraftModelId == 0 ? null : this.sourceEmployee.aircraftModelId;
                this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
                this.employeeService.updateTrainingDetails(this.sourceEmployee).subscribe(function (data) {
                    _this.onUploadDocumentListNew();
                    _this.isSpinnerVisible = false;
                    _this.isSaving = false;
                    _this.disableSave = true;
                    _this.alertService.showMessage("Success", "Training Information Updated Successfully", alert_service_1.MessageSeverity.success);
                    _this.loadData();
                }, function (err) {
                    _this.isSpinnerVisible = false;
                    var errorLog = err;
                    _this.errorMessageHandler(errorLog);
                });
            }
        }
    };
    EmployeeTrainingComponent.prototype.deleteItemAndCloseModel = function () {
        var _this = this;
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.employeeService.deleteEmployee(this.sourceAction.employeeId).subscribe(function (response) { return _this.saveCompleted(_this.sourceAction); }, function (error) { return _this.saveFailedHelper(error); });
        this.modal.close();
    };
    EmployeeTrainingComponent.prototype.dismissModelNew = function () {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    };
    EmployeeTrainingComponent.prototype.saveCompleted = function (user) {
        this.isSaving = false;
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", "Action was deleted Successfully", alert_service_1.MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", "Action was edited Successfully", alert_service_1.MessageSeverity.success);
        }
        this.loadData();
    };
    Object.defineProperty(EmployeeTrainingComponent.prototype, "userName", {
        get: function () {
            return this.authService.currentUser ? this.authService.currentUser.userName : "";
        },
        enumerable: false,
        configurable: true
    });
    EmployeeTrainingComponent.prototype.previousClick = function () {
        this.activeIndex = 1;
        this.employeeService.indexObj.next(this.activeIndex);
        if (this.employeeId) {
            this.router.navigateByUrl("/employeesmodule/employeepages/app-employee-certification-edit/" + this.employeeId);
        }
        else {
            this.router.navigateByUrl('/employeesmodule/employeepages/app-employee-certification');
        }
    };
    EmployeeTrainingComponent.prototype.getAllFrequencyTrainingData = function () {
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
    EmployeeTrainingComponent.prototype.errorMessageHandler = function (log) {
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
    // toGetEmployeeTrainingDocumentsList(employeeId,moduleId) {       
    //     this.commonService.GetDocumentsList(employeeId, moduleId,this.currentDeletedstatus).subscribe(res => {
    //         this.allEmployeeTrainingDocumentsList = res;
    //     })
    // }
    EmployeeTrainingComponent.prototype.downloadFileUpload = function (rowData) {
        var url = this.configurations.baseUrl + "/api/FileUpload/downloadattachedfile?filePath=" + rowData.link;
        window.location.assign(url);
    };
    // getEmployeeAttachmentDelete(rowData) {
    //     let attachmentDetailId = rowData.attachmentDetailId;
    //     let updatedBy = this.userName;
    //     this.commonService.GetAttachmentDeleteById(attachmentDetailId, updatedBy).subscribe(res => {
    //         this.toGetEmployeeTrainingDocumentsList(this.empId,this.empModuleId)
    //     })
    // }
    EmployeeTrainingComponent.prototype.addDocumentDetails = function () {
        this.selectedFileAttachment = [];
        this.index = 0;
        this.disableFileAttachmentSubmit = false;
        this.isEditButton = false;
        this.documentInformation = {
            docName: '',
            docMemo: '',
            docDescription: '',
            attachmentDetailId: 0
        };
    };
    EmployeeTrainingComponent.prototype.dismissDocumentPopupModel = function (type) {
        this.fileUploadInput.clear();
        this.closeMyModel(type);
    };
    EmployeeTrainingComponent.prototype.closeMyModel = function (type) {
        $(type).modal("hide");
    };
    EmployeeTrainingComponent.prototype.downloadFileUploadNew = function (link) {
        var url = this.configurations.baseUrl + "/api/FileUpload/downloadattachedfile?filePath=" + link;
        window.location.assign(url);
    };
    EmployeeTrainingComponent.prototype.fileUpload = function (event) {
        if (event.files.length === 0) {
            this.disableFileAttachmentSubmit = false;
        }
        else {
            this.disableFileAttachmentSubmit = true;
            this.enableSave();
        }
        var flag = false;
        var filesSelectedTemp = [];
        this.selectedFileAttachment = [];
        for (var _i = 0, _a = event.files; _i < _a.length; _i++) {
            var file = _a[_i];
            for (var i = 0; i < this.sourceViewforDocumentList.length; i++) {
                if (this.sourceViewforDocumentList[i].fileName == file.name) {
                    flag = true;
                    this.alertService.showMessage('Duplicate', "Already Exists this file ", alert_service_1.MessageSeverity.warn);
                    this.disableFileAttachmentSubmit = false;
                    if (this.fileUploadInput) {
                        this.fileUploadInput.clear();
                    }
                }
            }
            if (!flag) {
                filesSelectedTemp.push({
                    link: file.objectURL,
                    fileName: file.name,
                    isFileFromServer: false,
                    fileSize: file.size
                });
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
                attachmentDetailId: 0
            });
        }
    };
    EmployeeTrainingComponent.prototype.onFileChanged = function (event) {
        this.selectedFile = event.target.files[0];
    };
    EmployeeTrainingComponent.prototype.addDocumentInformation = function (type, documentInformation) {
        if (this.selectedFileAttachment != []) {
            for (var i = 0; i < this.selectedFileAttachment.length; i++) {
                this.sourceViewforDocumentList.push({
                    docName: documentInformation.docName,
                    docMemo: documentInformation.docMemo,
                    docDescription: documentInformation.docDescription,
                    link: this.selectedFileAttachment[i].link,
                    fileName: this.selectedFileAttachment[i].fileName,
                    isFileFromServer: false,
                    attachmentDetailId: 0,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    createdDate: Date.now(),
                    updatedDate: Date.now(),
                    fileSize: ((this.selectedFileAttachment[i].fileSize) / (1024 * 1024)).toFixed(2)
                });
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
            this.disableFileAttachmentSubmit == true;
            this.dismissDocumentPopupModel(type);
        }
        this.dismissDocumentPopupModel(type);
        this.sourceViewforDocumentList = __spreadArrays(this.sourceViewforDocumentList);
        if (this.sourceViewforDocumentList.length > 0) {
            this.totalRecordNew = this.sourceViewforDocumentList.length;
            this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
        }
        this.alertService.showMessage('Success', "Added Attachment  Successfully", alert_service_1.MessageSeverity.success);
        this.index = 0;
        this.isEditButton = false;
        this.disableFileAttachmentSubmit == true;
        this.disableSave = false;
        if (this.fileUploadInput) {
            this.fileUploadInput.clear();
        }
    };
    EmployeeTrainingComponent.prototype.editCustomerDocument = function (rowdata, index) {
        if (index === void 0) { index = 0; }
        this.selectedFileAttachment = [];
        this.isEditButton = true;
        this.index = index;
        this.documentInformation = rowdata;
        if (rowdata.attachmentDetailId > 0) {
            this.toGetDocumentView(rowdata.attachmentDetailId);
        }
        else {
            this.sourceViewforDocument = rowdata;
        }
    };
    EmployeeTrainingComponent.prototype.deleteAttachmentRow = function (rowdata, index, content) {
        this.selectedRowForDelete = rowdata;
        this.rowIndex = index;
        this.modal = this.modalService.open(content, { size: 'sm' });
    };
    EmployeeTrainingComponent.prototype.restoreAttachmentRow = function (rowdata, index, content) {
        this.selectedRowForDelete = rowdata;
        this.rowIndex = index;
        this.modal = this.modalService.open(content, { size: 'sm' });
    };
    EmployeeTrainingComponent.prototype.deleteItemAndCloseModelNew = function () {
        var _this = this;
        var attachmentDetailId = this.selectedRowForDelete.attachmentDetailId;
        if (attachmentDetailId > 0) {
            this.commonService.GetAttachmentDeleteById(attachmentDetailId, this.userName).subscribe(function (res) {
                _this.toGetDocumentsListNew(_this.employeeId, _this.empModuleId);
                _this.alertService.showMessage('Success', "Deleted Attachment  Successfully", alert_service_1.MessageSeverity.success);
            });
        }
        else {
            this.sourceViewforDocumentList.splice(this.rowIndex, 1);
            this.totalRecordNew = this.sourceViewforDocumentList.length;
            this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
        }
        this.modal.close();
    };
    EmployeeTrainingComponent.prototype.restoreItemAndCloseModel = function () {
        var _this = this;
        var attachmentDetailId = this.selectedRowForDelete.attachmentDetailId;
        if (attachmentDetailId > 0) {
            this.commonService.GetAttachmentRestoreById(attachmentDetailId, this.userName).subscribe(function (res) {
                _this.toGetDocumentsListNew(_this.employeeId, _this.empModuleId);
                _this.alertService.showMessage('Success', "Restored Attachment  Successfully", alert_service_1.MessageSeverity.success);
            });
        }
        else {
            this.sourceViewforDocumentList.splice(this.rowIndex, 1);
            this.totalRecordNew = this.sourceViewforDocumentList.length;
            this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
        }
        this.modal.close();
    };
    EmployeeTrainingComponent.prototype.onUploadDocumentListNew = function () {
        var _this = this;
        var vdata = {
            referenceId: this.employeeId,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName,
            moduleId: this.empModuleId
        };
        for (var key in vdata) {
            this.formData.append(key, vdata[key]);
        }
        this.formData.append('attachmentdetais', JSON.stringify(this.sourceViewforDocumentList));
        this.commonService.uploadDocumentsEndpoint(this.formData).subscribe(function (res) {
            _this.formData = new FormData();
            _this.toGetDocumentsListNew(_this.empId, _this.empModuleId);
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeeTrainingComponent.prototype.toGetDocumentsListNew = function (id, moduleId) {
        var _this = this;
        this.commonService.GetDocumentsListNew(id, moduleId, this.currentDeletedstatus).subscribe(function (res) {
            _this.sourceViewforDocumentList = res || [];
            _this.allDocumentListOriginal = res;
            if (_this.sourceViewforDocumentList.length > 0) {
                _this.sourceViewforDocumentList.forEach(function (item) {
                    item["isFileFromServer"] = true;
                });
            }
            _this.totalRecordNew = _this.sourceViewforDocumentList.length;
            _this.totalPagesNew = Math.ceil(_this.totalRecordNew / _this.pageSizeNew);
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeeTrainingComponent.prototype.toGetDocumentView = function (id) {
        var _this = this;
        this.commonService.GetAttachment(id).subscribe(function (res) {
            _this.sourceViewforDocument = res || [];
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeeTrainingComponent.prototype.dateFilterForTableNew = function (date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            var data = __spreadArrays(this.sourceViewforDocumentList.filter(function (x) {
                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                }
                else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            }));
            this.sourceViewforDocumentList = data;
        }
        else {
            this.sourceViewforDocumentList = this.allDocumentListOriginal;
        }
    };
    EmployeeTrainingComponent.prototype.dismissModel = function () {
        this.modal.close();
    };
    EmployeeTrainingComponent.prototype.onAuditHistoryLoadSuccessful = function (auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.sourceViewforDocumentAudit = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    };
    EmployeeTrainingComponent.prototype.saveFailedHelper = function (error) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", alert_service_1.MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, alert_service_1.MessageSeverity.error);
    };
    EmployeeTrainingComponent.prototype.openHistory = function (content, rowData) {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.commonService.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(function (results) { return _this.onAuditHistoryLoadSuccessful(results, content); }, function (error) { return _this.saveFailedHelper(error); });
    };
    EmployeeTrainingComponent.prototype.getColorCodeForHistory = function (i, field, value) {
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
    EmployeeTrainingComponent.prototype.removeFile = function (event) {
        //this.formData.delete(event.file.name)
    };
    EmployeeTrainingComponent.prototype.getPageCount = function (totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize);
    };
    EmployeeTrainingComponent.prototype.formateNumber = function (obj) {
        obj.cost = obj.cost ? autocomplete_1.formatNumberAsGlobalSettingsModule(obj.cost, 2) : '0.00';
    };
    EmployeeTrainingComponent.prototype.nextClick = function (nextOrPrevious) {
        this.nextOrPreviousTab = nextOrPrevious;
        if (this.formdata.form.dirty) {
            var content = this.tabRedirectConfirmationModal3;
            this.modal = this.modalService.open(content, { size: "sm" });
        }
        else {
            if (this.nextOrPreviousTab == 'Previous') {
                this.previousClick();
            }
            else {
                this.activeIndex = 3;
                this.employeeService.indexObj.next(this.activeIndex);
                var data = { "empId": this.empId, "firstName": this.firstName, "lastName": this.lastName };
                var stringData = JSON.stringify(data);
                var encryptedData = btoa(JSON.stringify(data));
                if (this.employeeId) {
                    this.router.navigateByUrl("/employeesmodule/employeepages/app-employees-management-structure-edit/" + this.empId);
                }
                else {
                    this.router.navigate(['/employeesmodule/employeepages/app-employees-management-structure'], { queryParams: { order: this.empId, 'firstName': this.firstName, 'lastName': this.lastName }, skipLocationChange: true });
                }
            }
        }
    };
    EmployeeTrainingComponent.prototype.redirectToTabWithoutSave = function () {
        this.dismissModel();
        if (this.nextOrPreviousTab == 'Previous') {
            this.previousClick();
        }
        else {
            this.activeIndex = 3;
            this.employeeService.indexObj.next(this.activeIndex);
            this.activeIndex = 3;
            this.employeeService.indexObj.next(this.activeIndex);
            var data = { "empId": this.empId, "firstName": this.firstName, "lastName": this.lastName };
            var stringData = JSON.stringify(data);
            var encryptedData = btoa(JSON.stringify(data));
            if (this.employeeId) {
                this.router.navigateByUrl("/employeesmodule/employeepages/app-employees-management-structure-edit/" + this.empId);
            }
            else {
                this.router.navigate(['/employeesmodule/employeepages/app-employees-management-structure'], { queryParams: { order: this.empId, 'firstName': this.firstName, 'lastName': this.lastName }, skipLocationChange: true });
            }
        }
    };
    EmployeeTrainingComponent.prototype.onClickMemo = function () {
        this.memoPopupContent = this.documentInformation.docMemo;
        //this.memoPopupValue = value;
    };
    EmployeeTrainingComponent.prototype.onClickPopupSave = function () {
        this.documentInformation.docMemo = this.memoPopupContent;
        this.memoPopupContent = '';
        $('#memo-popup-Doc').modal("hide");
    };
    EmployeeTrainingComponent.prototype.closeMemoModel = function () {
        $('#memo-popup-Doc').modal("hide");
    };
    EmployeeTrainingComponent.prototype.redirectToTab = function () {
        this.dismissModel();
        this.savetrainigSection();
        if (this.nextOrPreviousTab == 'Previous') {
            this.previousClick();
        }
        else {
            this.activeIndex = 3;
            this.employeeService.indexObj.next(this.activeIndex);
            this.activeIndex = 3;
            this.employeeService.indexObj.next(this.activeIndex);
            var data = { "empId": this.empId, "firstName": this.firstName, "lastName": this.lastName };
            var stringData = JSON.stringify(data);
            var encryptedData = btoa(JSON.stringify(data));
            if (this.employeeId) {
                this.router.navigateByUrl("/employeesmodule/employeepages/app-employees-management-structure-edit/" + this.empId);
            }
            else {
                this.router.navigate(['/employeesmodule/employeepages/app-employees-management-structure'], { queryParams: { order: this.empId, 'firstName': this.firstName, 'lastName': this.lastName }, skipLocationChange: true });
            }
        }
    };
    EmployeeTrainingComponent.prototype.enableSave = function () {
        if (this.sourceViewforDocumentList && this.sourceViewforDocumentList.length > 0) {
            this.disableSave = false;
        }
        else if (this.isEditButton == true) {
            this.disableSave = false;
        }
        else {
            this.disableSave = false;
        }
    };
    __decorate([
        core_1.ViewChild("tabRedirectConfirmationModal3")
    ], EmployeeTrainingComponent.prototype, "tabRedirectConfirmationModal3");
    __decorate([
        core_1.ViewChild('fileUploadInput')
    ], EmployeeTrainingComponent.prototype, "fileUploadInput");
    __decorate([
        core_1.ViewChild(material_1.MatPaginator)
    ], EmployeeTrainingComponent.prototype, "paginator");
    __decorate([
        core_1.ViewChild(material_1.MatSort)
    ], EmployeeTrainingComponent.prototype, "sort");
    __decorate([
        core_1.ViewChild("empform")
    ], EmployeeTrainingComponent.prototype, "formdata");
    EmployeeTrainingComponent = __decorate([
        core_1.Component({
            selector: 'app-employee-training',
            templateUrl: './employee-training.component.html',
            styleUrls: ['./employee-training.component.scss'],
            animations: [animations_1.fadeInOut]
        })
    ], EmployeeTrainingComponent);
    return EmployeeTrainingComponent;
}());
exports.EmployeeTrainingComponent = EmployeeTrainingComponent;
