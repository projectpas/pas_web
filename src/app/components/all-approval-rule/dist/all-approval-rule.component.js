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
exports.__esModule = true;
exports.AllApprovalRuleComponent = void 0;
var core_1 = require("@angular/core");
var alert_service_1 = require("../../services/alert.service");
var autocomplete_1 = require("../../generic/autocomplete");
var AllApprovalRuleComponent = /** @class */ (function () {
    function AllApprovalRuleComponent(poapprovalService, modalService, authService, commonService, alertService) {
        this.poapprovalService = poapprovalService;
        this.modalService = modalService;
        this.authService = authService;
        this.commonService = commonService;
        this.alertService = alertService;
        this.arrayEmplsit = [];
        this.pageIndex = 0;
        this.totalRecords = 0;
        this.totalRecordsemp = 0;
        this.totalPages = 0;
        this.arrayLegalEntitylsit = [];
        this.maincompanylist = [];
        this.bulist = [];
        this.departmentList = [];
        this.divisionlist = [];
        this.poTaskID = 10;
        this.isSpinnerVisible = false;
        this.pageSizeemp = 5;
        this.pageSize = 10;
        this.employeeNames = [];
        this.emplColumns = [
            { field: 'employee', header: 'Employee' },
            { field: 'seqNo', header: 'Seq No' },
        ];
        this.newDataObject = {
            "approvalRuleId": 0,
            "approvalTaskId": null,
            //"autoApproveId":null,     
            //"actionId":null,
            "ruleNumberId": 0,
            //"entityId":null,
            //"operatorId":null,
            "amountId": null,
            "value": null,
            "lowerValue": null,
            "upperValue": null,
            "companyId": 0,
            "buId": 0,
            "divisionId": 0,
            "departmentId": 0,
            "enforceApproval": false,
            "approver": this.employeeNames,
            "managementStructureId": this.currentUserManagementStructureId,
            "memo": "",
            "masterCompanyId": this.currentUserMasterCompanyId,
            "createdBy": this.userName,
            "updatedBy": this.userName,
            "createdDate": new Date(),
            "updatedDate": new Date(),
            "isActive": true,
            "isDeleted": false
        };
        this.dropdownSettings = {};
        this.headers = [
            // { field: 'memoId', header: 'Memo Id' },
            { field: 'taskName', header: 'Task Name' },
            { field: 'ruleNo', header: 'Rule No' },
            { field: 'operator', header: 'Operator' },
            { field: 'amount', header: 'Amount' },
            { field: 'value', header: 'Value' },
            { field: 'lowerValue', header: 'Lower Value' },
            { field: 'upperValue', header: 'Upper Value' },
            { field: 'approver', header: 'Approver' }
        ];
        this.selectedColumns = this.headers;
        this.isEdit = false;
    }
    AllApprovalRuleComponent.prototype.ngOnInit = function () {
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'value',
            textField: 'label',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 1,
            allowSearchFilter: false
        };
        this.getPOApprovalData();
        this.getRuleNumber();
        this.getPoAmountList();
        this.getPoApprovalList();
        this.creatingData = Object.assign({}, this.newDataObject);
        if (this.moduleType == 'PO') {
            this.moduleName = 'Purchase Order';
        }
        this.getTaskNames();
    };
    Object.defineProperty(AllApprovalRuleComponent.prototype, "currentUserMasterCompanyId", {
        get: function () {
            return this.authService.currentUser
                ? this.authService.currentUser.masterCompanyId
                : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AllApprovalRuleComponent.prototype, "employeeId", {
        get: function () {
            return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AllApprovalRuleComponent.prototype, "userName", {
        get: function () {
            return this.authService.currentUser ? this.authService.currentUser.userName : "";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AllApprovalRuleComponent.prototype, "currentUserManagementStructureId", {
        get: function () {
            return this.authService.currentUser
                ? this.authService.currentUser.managementStructureId
                : null;
        },
        enumerable: false,
        configurable: true
    });
    AllApprovalRuleComponent.prototype.filterapprover = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.employeedata(event.query, this.creatingData.managementStructureId);
        }
    };
    AllApprovalRuleComponent.prototype.makePrimary = function (employeeId) {
        this.employeeNames.forEach(function (x) {
            if (x.employeeId == employeeId) {
                x.isPrimary = true;
                x.seqNo = 1;
            }
            else {
                x.isPrimary = false;
            }
        });
        var seq = 1;
        this.employeeNames.forEach(function (x) {
            if (x.isPrimary == true) {
                x.seqNo = 1;
            }
            else {
                seq = seq + 1;
                x.seqNo = seq;
            }
        });
    };
    AllApprovalRuleComponent.prototype.openDeletesemployee = function (content, rowData, row) {
        this.tagIndex = row;
        this.tagRowData = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    };
    AllApprovalRuleComponent.prototype.onAddApprover = function () {
        var _this = this;
        if (this.employeelist && this.employeelist.value && this.employeelist.value > 0) {
            var isPrimaryflag = true;
            var isEmpExists = false;
            var SeqNo = 1;
            this.employeeNames.forEach(function (x) {
                if (x.employeeId == _this.employeelist.value) {
                    isEmpExists = true;
                }
                if (x.isPrimary == true) {
                    isPrimaryflag = false;
                }
            });
            if (isEmpExists) {
                this.alertService.showMessage('Error', 'Employee Already Exists', alert_service_1.MessageSeverity.error);
                return;
            }
            if (!isPrimaryflag) {
                SeqNo = Math.max.apply(Math, this.employeeNames.map(function (o) {
                    return o.seqNo;
                }));
                SeqNo = SeqNo + 1;
            }
            this.employeeNames.push({
                approverId: 0,
                isPrimary: isPrimaryflag,
                approvalRuleId: this.creatingData.approvalRuleId,
                seqNo: SeqNo,
                employeeId: this.employeelist.value,
                employee: this.employeelist.label,
                createdBy: this.userName,
                updatedBy: this.userName,
                createdDate: new Date(),
                updatedDate: new Date(),
                isActive: true,
                isDeleted: false
            });
            this.employeeNames.map(function (x) {
                return __assign({}, x);
            });
            this.totalRecordsemp = this.employeeNames.length;
            this.alertService.showMessage('Success', 'Employee Added Successfully', alert_service_1.MessageSeverity.success);
        }
    };
    AllApprovalRuleComponent.prototype.onDeleteTagName = function () {
        this.employeeNames.splice(this.tagIndex, 1);
        this.modal.close();
        this.alertService.showMessage('Success', 'Employee Deleted Successfully', alert_service_1.MessageSeverity.success);
    };
    AllApprovalRuleComponent.prototype.dismissModel = function () {
        this.modal.close();
    };
    AllApprovalRuleComponent.prototype.getTaxPageCount = function (totalNoofRecordsT, pageSizeT) {
        if (totalNoofRecordsT && pageSizeT && totalNoofRecordsT > pageSizeT) {
            return Math.ceil(totalNoofRecordsT / pageSizeT);
        }
        else {
            return 1;
        }
    };
    AllApprovalRuleComponent.prototype.getManagementStructureDetails = function (id, empployid, editMSID) {
        var _this = this;
        if (empployid === void 0) { empployid = 0; }
        if (editMSID === void 0) { editMSID = 0; }
        empployid = empployid == 0 ? this.employeeId : empployid;
        editMSID = this.isEdit ? editMSID = id : 0;
        this.commonService.getManagmentStrctureData(id, empployid, editMSID).subscribe(function (response) {
            if (response) {
                var result = response;
                if (result[0] && result[0].level == 'Level1') {
                    _this.maincompanylist = result[0].lstManagmentStrcture;
                    _this.creatingData.companyId = result[0].managementStructureId;
                    _this.creatingData.managementStructureId = result[0].managementStructureId;
                    _this.creatingData.buId = 0;
                    _this.creatingData.divisionId = 0;
                    _this.creatingData.departmentId = 0;
                    _this.bulist = [];
                    _this.divisionlist = [];
                    _this.departmentList = [];
                }
                else {
                    _this.creatingData.companyId = 0;
                    _this.creatingData.buId = 0;
                    _this.creatingData.divisionId = 0;
                    _this.creatingData.departmentId = 0;
                    _this.maincompanylist = [];
                    _this.bulist = [];
                    _this.divisionlist = [];
                    _this.departmentList = [];
                }
                if (result[1] && result[1].level == 'Level2') {
                    _this.bulist = result[1].lstManagmentStrcture;
                    _this.creatingData.buId = result[1].managementStructureId;
                    _this.creatingData.managementStructureId = result[1].managementStructureId;
                    _this.creatingData.divisionId = 0;
                    _this.creatingData.departmentId = 0;
                    _this.divisionlist = [];
                    _this.departmentList = [];
                }
                else {
                    if (result[1] && result[1].level == 'NEXT') {
                        _this.bulist = result[1].lstManagmentStrcture;
                    }
                    _this.creatingData.buId = 0;
                    _this.creatingData.divisionId = 0;
                    _this.creatingData.departmentId = 0;
                    _this.divisionlist = [];
                    _this.departmentList = [];
                }
                if (result[2] && result[2].level == 'Level3') {
                    _this.divisionlist = result[2].lstManagmentStrcture;
                    _this.creatingData.divisionId = result[2].managementStructureId;
                    _this.creatingData.managementStructureId = result[2].managementStructureId;
                    _this.creatingData.departmentId = 0;
                    _this.departmentList = [];
                }
                else {
                    if (result[2] && result[2].level == 'NEXT') {
                        _this.divisionlist = result[2].lstManagmentStrcture;
                    }
                    _this.creatingData.divisionId = 0;
                    _this.creatingData.departmentId = 0;
                    _this.departmentList = [];
                }
                if (result[3] && result[3].level == 'Level4') {
                    _this.departmentList = result[3].lstManagmentStrcture;
                    ;
                    _this.creatingData.departmentId = result[3].managementStructureId;
                    _this.creatingData.managementStructureId = result[3].managementStructureId;
                }
                else {
                    _this.creatingData.departmentId = 0;
                    if (result[3] && result[3].level == 'NEXT') {
                        _this.departmentList = result[3].lstManagmentStrcture;
                    }
                }
                // this.employeedata('',this.creatingData.managementStructureId);	
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    AllApprovalRuleComponent.prototype.employeedata = function (strText, manStructID) {
        var _this = this;
        if (strText === void 0) { strText = ''; }
        if (manStructID === void 0) { manStructID = 0; }
        if (this.arrayEmplsit.length == 0) {
            this.arrayEmplsit.push(0);
        }
        this.arrayEmplsit.push(this.employeeId == null ? 0 : this.employeeId);
        this.commonService.autoCompleteDropdownsEmployeeByMS(strText, true, 20, this.arrayEmplsit.join(), manStructID).subscribe(function (res) {
            _this.approverList = res;
        }, function (err) {
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    AllApprovalRuleComponent.prototype.getBUList = function (legalEntityId) {
        var _this = this;
        this.creatingData.buId = 0;
        this.creatingData.divisionId = 0;
        this.creatingData.departmentId = 0;
        this.bulist = [];
        this.divisionlist = [];
        this.departmentList = [];
        if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
            this.creatingData.managementStructureId = legalEntityId;
            this.creatingData.companyId = legalEntityId;
            this.commonService.getManagementStructurelevelWithEmployee(legalEntityId, this.employeeId).subscribe(function (res) {
                _this.bulist = res;
            });
        }
        else {
            this.creatingData.managementStructureId = 0;
            this.creatingData.companyId = 0;
        }
        this.employeedata('', this.creatingData.managementStructureId);
    };
    AllApprovalRuleComponent.prototype.getDivisionlist = function (buId) {
        var _this = this;
        this.divisionlist = [];
        this.departmentList = [];
        this.creatingData.divisionId = 0;
        this.creatingData.departmentId = 0;
        if (buId != 0 && buId != null && buId != undefined) {
            this.creatingData.managementStructureId = buId;
            this.creatingData.buId = buId;
            this.commonService.getManagementStructurelevelWithEmployee(buId, this.employeeId).subscribe(function (res) {
                _this.divisionlist = res;
            });
        }
        else {
            this.creatingData.managementStructureId = this.creatingData.companyId;
        }
        this.employeedata('', this.creatingData.managementStructureId);
    };
    AllApprovalRuleComponent.prototype.getDepartmentlist = function (divisionId) {
        var _this = this;
        this.creatingData.departmentId = 0;
        this.departmentList = [];
        if (divisionId != 0 && divisionId != null && divisionId != undefined) {
            this.creatingData.divisionId = divisionId;
            this.creatingData.managementStructureId = divisionId;
            this.commonService.getManagementStructurelevelWithEmployee(divisionId, this.employeeId).subscribe(function (res) {
                _this.departmentList = res;
            });
        }
        else {
            this.creatingData.managementStructureId = this.creatingData.buId;
            this.creatingData.divisionId = 0;
        }
        this.employeedata('', this.creatingData.managementStructureId);
    };
    AllApprovalRuleComponent.prototype.getDepartmentId = function (departmentId) {
        if (departmentId != 0 && departmentId != null && departmentId != undefined) {
            this.creatingData.managementStructureId = departmentId;
            this.creatingData.departmentId = departmentId;
        }
        else {
            this.creatingData.managementStructureId = this.creatingData.divisionId;
            this.creatingData.departmentId = 0;
        }
        this.employeedata('', this.creatingData.managementStructureId);
    };
    AllApprovalRuleComponent.prototype.errorMessageHandler = function (log) {
        this.alertService.showMessage('Error', log.error, alert_service_1.MessageSeverity.error);
    };
    AllApprovalRuleComponent.prototype.addNewApproval = function () {
        this.creatingData = Object.assign({}, this.newDataObject);
        if (this.moduleType == 'PO') {
            this.moduleName = 'Purchase Order';
            this.creatingData.approvalTaskId = this.poTaskID;
        }
        this.getManagementStructureDetails(this.currentUserManagementStructureId, this.employeeId);
        this.creatingData.managementStructureId = this.currentUserManagementStructureId;
        this.employeedata('', this.currentUserManagementStructureId);
        this.employeeNames = [];
    };
    AllApprovalRuleComponent.prototype.getPOApprovalData = function () {
        var _this = this;
        this.poapprovalService.getAllPOApprovalData()
            .subscribe(function (res) {
            _this.poApprovalData = res;
        });
    };
    AllApprovalRuleComponent.prototype.getTaskNames = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.commonService.smartDropDownList('ApprovalTask', 'ApprovalTaskId', 'Name')
                            .subscribe(function (res) {
                            _this.taskNameList = res;
                            res.forEach(function (element) {
                                if (element.label == 'PO Approval') {
                                    _this.poTaskID = element.value;
                                }
                            });
                            if (_this.moduleType == 'PO') {
                                _this.creatingData.approvalTaskId = _this.poTaskID;
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AllApprovalRuleComponent.prototype.getRuleNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.commonService.smartDropDownList('ApprovalRuleNo', 'ApprovalRuleNoId', 'RuleNo')
                            .subscribe(function (res) {
                            _this.ruleNumList = res;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AllApprovalRuleComponent.prototype.getPoAmountList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.commonService.smartDropDownList('ApprovalAmount', 'ApprovalAmountId', 'Name')
                            .subscribe(function (res) {
                            _this.approvalAmountList = res;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AllApprovalRuleComponent.prototype.savePoApproval = function () {
        var _this = this;
        this.creatingData.approver = this.employeeNames;
        this.poapprovalService.createapprovalrulecommon(this.creatingData)
            .subscribe(function (res) {
            _this.alertService.showMessage("Success", "Record " + (_this.isEdit ? 'Updated' : 'Created') + " successfully", alert_service_1.MessageSeverity.success);
            _this.getPoApprovalList();
        });
    };
    AllApprovalRuleComponent.prototype.getPoApprovalList = function () {
        var _this = this;
        this.poapprovalService.getAllPOApprovalData()
            .subscribe(function (res) {
            _this.poApprovalData = res;
            _this.totalRecords = res.length;
            _this.totalPages = Math.ceil(_this.totalRecords / _this.pageSize);
        });
    };
    AllApprovalRuleComponent.prototype.pageIndexChange = function (event) {
        this.pageSize = event.rows;
    };
    AllApprovalRuleComponent.prototype.getPageCount = function (totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize);
    };
    AllApprovalRuleComponent.prototype.edit = function (data) {
        var _this = this;
        this.isEdit = true;
        this.creatingData = Object.assign({}, this.newDataObject);
        this.poapprovalService.getApprovalById(data.approvalRuleId)
            .subscribe(function (res) {
            _this.creatingData = res;
            _this.arrayLegalEntitylsit.push(_this.creatingData.entityId);
            _this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name', '', true, 20, _this.arrayLegalEntitylsit.join()).subscribe(function (res) {
                _this.legalEntityList = res;
            });
            //this.getEntity(this.creatingData.entityId);
            _this.creatingData.entityId = autocomplete_1.getObjectByValue('value', _this.creatingData.entityId, _this.legalEntityList);
            _this.creatingData.lowerValue = _this.creatingData.lowerValue ? autocomplete_1.formatNumberAsGlobalSettingsModule(_this.creatingData.lowerValue, 2) : '0.00';
            _this.creatingData.upperValue = _this.creatingData.upperValue ? autocomplete_1.formatNumberAsGlobalSettingsModule(_this.creatingData.upperValue, 2) : '0.00';
            _this.creatingData.value = _this.creatingData.value ? autocomplete_1.formatNumberAsGlobalSettingsModule(_this.creatingData.value, 2) : '0.00';
        });
    };
    AllApprovalRuleComponent.prototype.onChangevalue = function (str) {
        this.creatingData[str] = this.creatingData[str] ? autocomplete_1.formatNumberAsGlobalSettingsModule(this.creatingData[str], 2) : '0.00';
    };
    AllApprovalRuleComponent.prototype["delete"] = function (data) {
        var _this = this;
        this.poapprovalService.deleteApprovalById(data.approvalRuleId)
            .subscribe(function (res) {
            _this.alertService.showMessage("Success", "Record Deleted successfully", alert_service_1.MessageSeverity.success);
            _this.getPoApprovalList();
        });
    };
    __decorate([
        core_1.Input()
    ], AllApprovalRuleComponent.prototype, "moduleType");
    AllApprovalRuleComponent = __decorate([
        core_1.Component({
            selector: 'app-all-approval-rule',
            templateUrl: './all-approval-rule.component.html',
            styleUrls: ['./all-approval-rule.component.css']
        })
    ], AllApprovalRuleComponent);
    return AllApprovalRuleComponent;
}());
exports.AllApprovalRuleComponent = AllApprovalRuleComponent;
