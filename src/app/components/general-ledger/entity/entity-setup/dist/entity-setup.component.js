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
exports.ManagementStructureComponent = void 0;
var core_1 = require("@angular/core");
var animations_1 = require("../../../../services/animations");
var alert_service_1 = require("../../../../services/alert.service");
var material_1 = require("@angular/material");
var currency_model_1 = require("../../../../models/currency.model");
var ModuleConstant_1 = require("src/app/generic/ModuleConstant");
//import { TreeTableModule } from 'primeng/treetable';
var ManagementStructureComponent = /** @class */ (function () {
    function ManagementStructureComponent(messageService, authService, _fb, alertService, currency, msService, modalService, activeModal, dialog, masterComapnyService, commonService) {
        this.messageService = messageService;
        this.authService = authService;
        this._fb = _fb;
        this.alertService = alertService;
        this.currency = currency;
        this.msService = msService;
        this.modalService = modalService;
        this.activeModal = activeModal;
        this.dialog = dialog;
        this.masterComapnyService = masterComapnyService;
        this.commonService = commonService;
        this.tagNameCollection = [];
        this.modelValue = false;
        this.display = false;
        this.showicon = false;
        this.treeindex = 1;
        this.header = true;
        this.headerofMS = "";
        this.childCollection = [];
        this.isSpinnerVisible = true;
        this.currentDeletedstatus = false;
        this.rowDataToDelete = {};
        this.sourceLegalEntity = {};
        this.msAddbutton = false;
        this.allComapnies = [];
        this.allATAMaininfo = [];
        this.isEditMode = false;
        this.toggle = true;
        this.toggle_ms_header = true;
        this.sourceAction = [];
        this.GeneralInformationValue = true;
        this.LockboxValue = false;
        this.domesticWireValue = false;
        this.internationalValue = false;
        this.GeneralInformationStyle = true;
        this.LockboxStyle = false;
        this.domesticWireStyle = false;
        this.internationalStyle = false;
        this.managementViewData = {};
        this.isAdd = true;
        this.isEdit = true;
        this.isDelete = true;
        this.allWorkFlows = [];
        this.disableonchild = false;
        this.dataSource = new material_1.MatTableDataSource();
        this.isAdd = this.authService.checkPermission([ModuleConstant_1.ModuleConstants.ManagementStructure + "." + ModuleConstant_1.PermissionConstants.Add]);
        this.isEdit = this.authService.checkPermission([ModuleConstant_1.ModuleConstants.ManagementStructure + "." + ModuleConstant_1.PermissionConstants.Update]);
        this.isDelete = this.authService.checkPermission([ModuleConstant_1.ModuleConstants.ManagementStructure + "." + ModuleConstant_1.PermissionConstants.Delete]);
    }
    ManagementStructureComponent.prototype.ngOnInit = function () {
        this.loadManagementdata();
        this.getAllLegalEntityList();
        this.breadcrumbs = [
            { label: "Organization" },
            { label: "Management Structure" },
        ];
        this.isSpinnerVisible = false;
    };
    ManagementStructureComponent.prototype.ngAfterViewInit = function () {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    };
    ManagementStructureComponent.prototype.contextMenu = function (node, contextMenu) {
        if (node) {
            contextMenu.hide();
        }
    };
    ManagementStructureComponent.prototype.getDeleteListByStatus = function (value) {
        this.currentDeletedstatus = value;
    };
    ManagementStructureComponent.prototype.getAuditHistoryById = function (rowData) {
        var _this = this;
        this.isSpinnerVisible = true;
        $("#poHistory").modal("show");
        this.msService
            .getMSHistoryDataById(rowData.managementStructureId)
            .subscribe(function (res) {
            _this.auditHistory = res;
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    ManagementStructureComponent.prototype.getColorCodeForHistory = function (i, field, value) {
        var data = this.auditHistory;
        var dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if (i + 1 === dataLength) {
                return true;
            }
            else {
                return data[i + 1][field] === value;
            }
        }
    };
    ManagementStructureComponent.prototype.loadMasterCompanies = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.isSpinnerVisible = true;
        this.masterComapnyService.getMasterCompanies().subscribe(function (results) { return _this.onDataMasterCompaniesLoadSuccessful(results[0]); }, function (error) {
            _this.isSpinnerVisible = false;
        });
    };
    ManagementStructureComponent.prototype.expandAll = function (toggle) {
        this.gridData.map(function (node) {
            node.expanded = toggle;
        });
    };
    ManagementStructureComponent.prototype.exapandORcollapse = function (nodes) {
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            this.expandNode(node);
        }
        this.gridData = __spreadArrays(nodes);
    };
    ManagementStructureComponent.prototype.expandNode = function (node) {
        node.expanded = !node.expanded;
        if (node.children) {
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var cn = _a[_i];
                this.expandNode(cn);
            }
        }
    };
    ManagementStructureComponent.prototype.loadManagementdata = function () {
        var _this = this;
        this.isSpinnerVisible = true;
        this.alertService.startLoadingMessage();
        this.isSpinnerVisible = true;
        this.msService
            .getManagemententity(this.currentUserMasterCompanyId)
            .subscribe(function (results) { return _this.onManagemtntdataLoad(results[0]); }, function (error) {
            _this.isSpinnerVisible = false;
        });
        this.selectedColumns = this.cols;
    };
    ManagementStructureComponent.prototype.getAllLegalEntityList = function () {
        var _this = this;
        this.commonService
            .autoSuggestionSmartDropDownList("LegalEntity", "LegalEntityId", "Name", "", true, 0, "0", this.currentUserMasterCompanyId)
            .subscribe(function (res) {
            _this.dropDownLegalEntityList = res;
        });
    };
    ManagementStructureComponent.prototype.msAddChange = function () {
        this.msAddbutton = true;
    };
    ManagementStructureComponent.prototype.loadData = function () {
        var _this = this;
        this.alertService.startLoadingMessage();
        this.isSpinnerVisible = true;
        this.msService.getEntityList().subscribe(function (results) { return _this.onDataLoadSuccessful(results[0]); }, function (error) {
            _this.isSpinnerVisible = false;
        });
        this.cols = [
            //{ field: 'ataMainId', header: 'ATAMain Id' },
            { field: "name", header: "Name" },
            { field: "description", header: "Description" },
            { field: "cageCode", header: "CageCode" },
            { field: "doingLegalAs", header: "DoingLegalAs" },
            { field: "createdDate", header: "createdDate" },
            { field: "createdBy", header: "Created By" },
            { field: "updatedDate", header: "Updated Date" },
            { field: "updatedBy", header: "Updated By" },
        ];
        this.selectedColumns = this.cols;
    };
    ManagementStructureComponent.prototype.onDataLoadSuccessful = function (getAtaMainList) {
        this.alertService.stopLoadingMessage();
        this.isSpinnerVisible = false;
        this.dataSource.data = getAtaMainList;
        this.allATAMaininfo = getAtaMainList;
    };
    ManagementStructureComponent.prototype.nodeSelect = function (event) {
        this.messageService.add({
            severity: "info",
            summary: "Node Selected",
            detail: event.node.data.name
        });
    };
    ManagementStructureComponent.prototype.nodeUnselect = function (event) {
        this.messageService.add({
            severity: "info",
            summary: "Node Unselected",
            detail: event.node.data.name
        });
    };
    ManagementStructureComponent.prototype.onManagemtntdataLoad = function (getAtaMainList) {
        this.isSpinnerVisible = true;
        this.alertService.stopLoadingMessage();
        this.isSpinnerVisible = false;
        this.dataSource.data = getAtaMainList;
        this.allManagemtninfo = getAtaMainList;
        for (var i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].tagName != null) {
                this.tagNameCollection.push(this.allManagemtninfo[i]);
            }
        }
        if (this.allManagemtninfo) {
            this.gridData = this.makeNestedObj(this.allManagemtninfo, null);
        }
        this.cols1 = [
            { field: "code", header: "Code" },
            { field: "name", header: "Name" },
            { field: "description", header: "Description" },
            { field: "legalEntityName", header: "Legal Entity" },
            { field: "createdDate", header: "Created Date" },
            { field: "createdBy", header: "Created By" },
            { field: "updatedDate", header: "Updated Date" },
            { field: "updatedBy", header: "Updated By" },
        ];
        this.isSpinnerVisible = false;
    };
    ManagementStructureComponent.prototype.openDelete = function (content, row) {
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.isRestoreMode = false;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, {
            size: "sm",
            backdrop: "static",
            keyboard: false
        });
    };
    ManagementStructureComponent.prototype.openRestore = function (content, row) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isRestoreMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, {
            size: "sm",
            backdrop: "static",
            keyboard: false
        });
    };
    ManagementStructureComponent.prototype.deleteItemAndCloseModel = function () {
        var _this = this;
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.msService["delete"](this.sourceAction.managementStructureId)
            .subscribe(function (data) {
            _this.saveCompleted(_this.sourceLegalEntity);
            _this.loadManagementdata();
        });
        this.modal.close();
    };
    ManagementStructureComponent.prototype.restoreItemAndCloseModel = function () {
        var _this = this;
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.msService
            .restore(this.sourceAction.managementStructureId)
            .subscribe(function (data) {
            _this.saveCompleted(_this.sourceLegalEntity);
            _this.loadManagementdata();
        });
        this.modal.close();
    };
    ManagementStructureComponent.prototype.showViewData = function (viewContent, row) {
        this.managementViewData.legalEntityId = row.legalEntityId;
        this.managementViewData.legalEntityName = row.legalEntityName;
        this.managementViewData.code = row.code;
        this.managementViewData.name = row.name;
        this.managementViewData.description = row.description;
        this.modal = this.modalService.open(viewContent, {
            size: "sm",
            backdrop: "static",
            keyboard: false
        });
    };
    ManagementStructureComponent.prototype.makeNestedObj = function (arr, parent) {
        var out = [];
        for (var i in arr) {
            if (arr[i].parentId == parent) {
                var children = this.makeNestedObj(arr, arr[i].managementStructureId);
                arr[i] = { data: arr[i] };
                if (children.length) {
                    arr[i].children = children;
                }
                out.push(arr[i]);
            }
        }
        return out;
    };
    ManagementStructureComponent.prototype.GeneralInformation = function () {
        this.GeneralInformationValue = true;
        this.LockboxValue = false;
        this.domesticWireValue = false;
        this.internationalValue = false;
        this.ACHValue = false;
        this.GeneralInformationStyle = true;
        this.LockboxStyle = false;
        this.domesticWireStyle = false;
        this.internationalStyle = false;
        this.ACHStyle = false;
    };
    ManagementStructureComponent.prototype.Lockbox = function () {
        this.GeneralInformationValue = false;
        this.LockboxValue = true;
        this.domesticWireValue = false;
        this.internationalValue = false;
        this.ACHValue = false;
        this.GeneralInformationStyle = false;
        this.LockboxStyle = true;
        this.domesticWireStyle = false;
        this.internationalStyle = false;
        this.ACHStyle = false;
    };
    ManagementStructureComponent.prototype.DomesticWire = function () {
        this.GeneralInformationValue = false;
        this.LockboxValue = false;
        this.domesticWireValue = true;
        this.internationalValue = false;
        this.ACHValue = false;
        this.GeneralInformationStyle = false;
        this.LockboxStyle = false;
        this.domesticWireStyle = true;
        this.internationalStyle = false;
        this.ACHStyle = false;
    };
    ManagementStructureComponent.prototype.InternationalWire = function () {
        this.GeneralInformationValue = false;
        this.LockboxValue = false;
        this.domesticWireValue = false;
        this.internationalValue = true;
        this.ACHValue = false;
        this.GeneralInformationStyle = false;
        this.LockboxStyle = false;
        this.domesticWireStyle = false;
        this.internationalStyle = true;
        this.ACHStyle = false;
    };
    ManagementStructureComponent.prototype.ACH = function () {
        this.GeneralInformationValue = false;
        this.LockboxValue = false;
        this.domesticWireValue = false;
        this.internationalValue = false;
        this.ACHValue = true;
        this.GeneralInformationStyle = false;
        this.LockboxStyle = false;
        this.domesticWireStyle = false;
        this.internationalStyle = false;
        this.ACHStyle = true;
    };
    ManagementStructureComponent.prototype.showDomesticWire = function () {
        this.DomesticWire();
    };
    ManagementStructureComponent.prototype.openContentEdit = function (content, row, rowNode) {
        this.isSpinnerVisible = true;
        this.headerofMS = row.code;
        this.msAddbutton = false;
        var findIndex = -1;
        this.sourceLegalEntity = {};
        this.sourceLegalEntity.legalEntityId = 0;
        this.dropDownLegalEntityList.forEach(function (legEntity, index) {
            if (legEntity.value == row.legalEntityId) {
                findIndex = index;
            }
        });
        if (findIndex == -1) {
            var obj = {
                label: row.legalEntityName,
                value: row.legalEntityId
            };
            this.dropDownLegalEntityList.push(obj);
        }
        this.sourceLegalEntity = row;
        if (row.isLastChild == true) {
            this.sourceLegalEntity.isAssignable = true;
        }
        this.isParent = rowNode.node.parent;
        if (this.isParent) {
            this.disableonchild = true;
        }
        else {
            this.disableonchild = false;
        }
        this.modal1 = this.modalService.open(content, {
            size: "sm",
            backdrop: "static",
            keyboard: false
        });
        this.isSpinnerVisible = false;
    };
    ManagementStructureComponent.prototype.closeHistoryModal = function () {
        $("#poHistory").modal("hide");
    };
    ManagementStructureComponent.prototype.open = function (content) {
        this.headerofMS = "Add Root Management Structure";
        this.sourceLegalEntity = {};
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isRestoreMode = false;
        this.sourceLegalEntity.legalEntityId = 0;
        this.msAddbutton = false;
        this.disableonchild = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        //this.sourceLegalEntity = new ATAMain();
        this.sourceLegalEntity.isActive = true;
        this.entityName = "";
        this.modal = this.modalService.open(content, {
            size: "sm",
            backdrop: "static",
            keyboard: false
        });
    };
    ManagementStructureComponent.prototype.onDataMasterCompaniesLoadSuccessful = function (allComapnies) {
        this.toggle_ms_header = false;
        this.alertService.stopLoadingMessage();
        this.isSpinnerVisible = false;
        this.allComapnies = allComapnies;
    };
    Object.defineProperty(ManagementStructureComponent.prototype, "userName", {
        get: function () {
            return this.authService.currentUser
                ? this.authService.currentUser.userName
                : "";
        },
        enumerable: false,
        configurable: true
    });
    ManagementStructureComponent.prototype.openCurrency = function (content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isRestoreMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new currency_model_1.Currency();
        this.sourceAction.isActive = true;
        this.currencyName = "";
        this.modal = this.modalService.open(content, {
            size: "sm",
            backdrop: "static",
            keyboard: false
        });
    };
    Object.defineProperty(ManagementStructureComponent.prototype, "currentUserMasterCompanyId", {
        get: function () {
            return this.authService.currentUser
                ? this.authService.currentUser.masterCompanyId
                : null;
        },
        enumerable: false,
        configurable: true
    });
    ManagementStructureComponent.prototype.editItemAndCloseModel = function () {
        var _this = this;
        if (!this.sourceLegalEntity.code) {
            this.alertService.showMessage("Error", "Managment Strcture code is required!", alert_service_1.MessageSeverity.error);
            return;
        }
        if (!this.sourceLegalEntity.name) {
            this.alertService.showMessage("Error", "Managment Strcture name is required!", alert_service_1.MessageSeverity.error);
            return;
        }
        if (!this.sourceLegalEntity.legalEntityId) {
            this.alertService.showMessage("Error", "Managment Strcture LegalEntity is required!", alert_service_1.MessageSeverity.error);
            return;
        }
        //this.isSaving = true;
        if (this.sourceLegalEntity.code && this.sourceLegalEntity.name) {
            if (!this.sourceLegalEntity.managementStructureId) {
                this.sourceLegalEntity.createdBy = this.userName;
                this.sourceLegalEntity.updatedBy = this.userName;
                this.sourceLegalEntity.masterCompanyId = this.currentUserMasterCompanyId;
                this.msService
                    .getmanagementPost(this.sourceLegalEntity)
                    .subscribe(function (data) {
                    _this.saveSuccessHelper(_this.sourceLegalEntity);
                    //this.selectedNode1.children.data = data;
                    _this.loadManagementdata();
                });
            }
            else {
                this.sourceLegalEntity.createdBy = this.userName;
                this.sourceLegalEntity.updatedBy = this.userName;
                this.sourceLegalEntity.masterCompanyId = this.currentUserMasterCompanyId;
                this.msService
                    .updateManagementEntity(this.sourceLegalEntity)
                    .subscribe(function (data) {
                    _this.saveCompleted(_this.sourceLegalEntity);
                    _this.loadManagementdata();
                });
            }
        }
        if (this.display == false) {
            this.dismissModel();
        }
    };
    ManagementStructureComponent.prototype.saveSuccessHelper = function (role) {
        this.isSaving = false;
        this.alertService.showMessage("Success", "MS Added successfully", alert_service_1.MessageSeverity.success);
        this.getAllLegalEntityList();
        //this.loadData();
    };
    ManagementStructureComponent.prototype.saveCompleted = function (user) {
        this.isSaving = false;
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", "MS deleted successfully", alert_service_1.MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else if (this.isRestoreMode == true) {
            this.alertService.showMessage("Success", "MS restored successfully", alert_service_1.MessageSeverity.success);
            this.isRestoreMode = false;
        }
        else {
            this.alertService.showMessage("Success", "MS Updated successfully", alert_service_1.MessageSeverity.success);
            this.getAllLegalEntityList();
        }
        //this.loadData();
    };
    ManagementStructureComponent.prototype.saveFailedHelper = function (error) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", alert_service_1.MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, alert_service_1.MessageSeverity.error);
    };
    ManagementStructureComponent.prototype.dismissModel = function () {
        if (this.modal) {
            this.modal.close();
        }
        if (this.modal1) {
            this.modal1.close();
        }
    };
    ManagementStructureComponent.prototype.onNodeExpand = function (event) {
        if (event.node.parent == null) {
            this.treeindex == 1;
            this.treeindex++;
            if (this.treeindex == 4) {
                this.showicon = true;
                alert(this.showicon);
            }
        }
    };
    ManagementStructureComponent.prototype.openEdit = function (content, rowNode) {
        this.isSpinnerVisible = true;
        this.sourceLegalEntity.legalEntityId = 0;
        this.headerofMS = rowNode.node.data.code;
        this.selectedNode1 = rowNode.node;
        this.sourceLegalEntity = {};
        this.isSaving = true;
        this.msAddbutton = false;
        this.sourceLegalEntity.legalEntityId = rowNode.node.data.legalEntityId;
        this.sourceLegalEntity.parentId = rowNode.node.data.managementStructureId;
        this.isParent = rowNode.node.parent;
        this.disableonchild = true;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, {
            size: "sm",
            backdrop: "static",
            keyboard: false
        });
        this.isSpinnerVisible = false;
    };
    ManagementStructureComponent.prototype.openHist = function (content, row) {
        this.sourceLegalEntity = row;
    };
    __decorate([
        core_1.ViewChild(material_1.MatPaginator, { static: false })
    ], ManagementStructureComponent.prototype, "paginator");
    __decorate([
        core_1.ViewChild(material_1.MatSort, { static: false })
    ], ManagementStructureComponent.prototype, "sort");
    ManagementStructureComponent = __decorate([
        core_1.Component({
            selector: "app-managemententity-structure",
            templateUrl: "./entity-setup.component.html",
            styleUrls: ["./entity-setup.component.scss"],
            animations: [animations_1.fadeInOut]
        })
        /** EntitySetup component*/
    ], ManagementStructureComponent);
    return ManagementStructureComponent;
}());
exports.ManagementStructureComponent = ManagementStructureComponent;
