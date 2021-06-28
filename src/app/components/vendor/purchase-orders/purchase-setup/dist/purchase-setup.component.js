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
exports.PurchaseSetupComponent = void 0;
var core_1 = require("@angular/core");
var alert_service_1 = require("../../../../services/alert.service");
var create_po_partslist_model_1 = require("../../../../models/create-po-partslist.model");
var autocomplete_1 = require("../../../../generic/autocomplete");
var customer_shipping_model_1 = require("../../../../models/customer-shipping.model");
var customer_internationalshipping_model_1 = require("../../../../models/customer-internationalshipping.model");
var common_1 = require("@angular/common");
//import { connectableObservableDescriptor } from 'rxjs/observable/ConnectableObservable';
var appmodule_enum_1 = require("../../../../enum/appmodule.enum");
var vendorwarning_enum_1 = require("../../../../enum/vendorwarning.enum");
var PurchaseSetupComponent = /** @class */ (function () {
    function PurchaseSetupComponent(route, legalEntityService, modalService, currencyService, unitofmeasureService, conditionService, CreditTermsService, employeeService, vendorService, priority, alertService, glAccountService, authService, customerService, companyService, commonService, _actRoute, purchaseOrderService, vendorCapesService, itemser, datePipe, salesOrderReferenceStorage, stocklineReferenceStorage) {
        this.route = route;
        this.legalEntityService = legalEntityService;
        this.modalService = modalService;
        this.currencyService = currencyService;
        this.unitofmeasureService = unitofmeasureService;
        this.conditionService = conditionService;
        this.CreditTermsService = CreditTermsService;
        this.employeeService = employeeService;
        this.vendorService = vendorService;
        this.priority = priority;
        this.alertService = alertService;
        this.glAccountService = glAccountService;
        this.authService = authService;
        this.customerService = customerService;
        this.companyService = companyService;
        this.commonService = commonService;
        this._actRoute = _actRoute;
        this.purchaseOrderService = purchaseOrderService;
        this.vendorCapesService = vendorCapesService;
        this.itemser = itemser;
        this.datePipe = datePipe;
        this.salesOrderReferenceStorage = salesOrderReferenceStorage;
        this.stocklineReferenceStorage = stocklineReferenceStorage;
        this.arrayPrioritylist = [];
        this.arrayPostatuslist = [];
        this.arrayCurrencylist = [];
        this.arrayConditionlist = [];
        this.managmentstrctureId = 0;
        this.isheaderEmployee = false;
        this.showAddresstab = false;
        this.showDocumenttab = false;
        this.showComunicationtab = false;
        this.showVendorCaptab = false;
        this.addressType = 'PO';
        this.vendorContactsForshipTo = [];
        this.vendorContactsForBillTO = [];
        this.firstNamesShipTo = [];
        this.firstNamesbillTo = [];
        this.billToContactData = [];
        this.shipToContactData = [];
        this.shipToCusData = [];
        this.vendorSelected = [];
        this.allCustomers = [];
        this.childDataList = [];
        this.allCurrencyData = [];
        this.allconditioninfo = [];
        this.allPartDetails = [];
        this.billToAddress = {};
        this.shipToAddress = {};
        this.tempshipToAddress = {};
        this.tempbillToAddress = {};
        this.tempshipVia = {};
        this.tempAddshipViaMemo = {};
        this.allActions = [];
        this.partListData = [];
        this.allPriorityInfo = [];
        this.sourcePoApproval = {};
        this.headerInfo = {};
        this.sourcePoApprovalObj = {};
        this.partList = {};
        this.maincompanylist = [];
        this.bulist = [];
        this.departmentList = [];
        this.divisionlist = [];
        this.ifSplitShip = false;
        this.allManagemtninfo = [];
        this.allPartnumbersInfo = [];
        this.showInput = false;
        this.vendorCapesInfo = [];
        this.needByTempDate = new Date();
        this.currentDate = new Date();
        this.addAllMultiPN = false;
        this.disablePOStatus = true;
        this.childObject = {};
        this.parentObject = {};
        this.childObjectArray = [];
        this.childObjectArrayEdit = [];
        this.parentObjectArray = [];
        this.poAddressArray = {};
        this.poShippingAddress = {};
        this.newPNList = [];
        this.newPartsList = [];
        this.addressSiteName = {};
        this.splitUserTypeAddress = {};
        this.tempMultiplePN = {};
        this.newData = [];
        this.childOrderQtyArray = [];
        this.arraySearch = [];
        this.approversData = {};
        this.approver1 = {};
        this.approver2 = {};
        this.approver3 = {};
        this.approver4 = {};
        this.approver5 = {};
        this.allEmployeeList = [];
        this.poApproverData = {};
        this.poApproverList = [];
        this.poApproverListEdit = [];
        this.approverIds = [];
        this.multiplePNIdArray = [];
        this.tempNewPNArray = [];
        this.newObjectForParent = new create_po_partslist_model_1.CreatePOPartsList();
        this.newObjectForChild = new create_po_partslist_model_1.PartDetails();
        this.addressFormForShipping = new customer_shipping_model_1.CustomerShippingModel();
        this.addressFormForBilling = new customer_shipping_model_1.CustomerShippingModel();
        this.addShipViaFormForShipping = new customer_internationalshipping_model_1.CustomerInternationalShipVia();
        this.shipViaList = [];
        this.addNewAddress = new customer_shipping_model_1.CustomerShippingModel();
        this.discountPercentList = [];
        this.allPercentData = [];
        this.splitcustomersList = [];
        this.splitAddressData = [];
        this.tempSplitAddressData = [];
        this.approveListEdit = [];
        this.isEditModeShipping = false;
        this.isEditModeBilling = false;
        this.isEditModeShipVia = false;
        this.isEditModeSplitAddress = false;
        this.isEditModeSplitPoOnly = false;
        this.allCountriesList = [];
        this.countriesList = [];
        this.vendorContactInfo = {};
        this.venContactList = [];
        this.venContactFirstNames = [];
        this.venContactLastNames = [];
        this.venContactMiddleNames = [];
        this.workOrderPartNumberId = 0;
        this.vendorCapesGeneralInfo = {};
        this.isViewMode = true;
        this.disableAddPart = false;
        this.disableHeaderInfo = false;
        this.allWorkOrderInfo = [];
        this.allsubWorkOrderInfo = [];
        this.allRepairOrderInfo = [];
        this.allSalesOrderInfo = [];
        this.allShipViaInfo = [];
        this.allWorkOrderDetails = [];
        this.allsubWorkOrderDetails = [];
        this.allRepairOrderDetails = [];
        this.allSalesOrderDetails = [];
        this.altPartNumList = [];
        this.altPartCollection = [];
        this.toggle_po_header = true;
        this.isEditModeHeader = false;
        this.isEditModePart = false;
        this.isEditModeAdd = false;
        this.poStatusList = [];
        this.poApproverStatusList = [];
        this.enableHeaderSaveBtn = false;
        this.enablePartSaveBtn = false;
        this.enableApproverSaveBtn = false;
        this.enableAddSaveBtn = false;
        this.isSpinnerVisible = true;
        this.tempPartList = {};
        this.userTypes = [];
        this.capabilityauditHistory = [];
        this.internalApproversList = [];
        this.displayWarningModal = false;
        this.poFulfillingstatusID = -1;
        this.poOpenstatusID = -1;
        this.poApprovaltaskId = 0;
        this.ApprovedstatusId = 0;
        this.WaitingForApprovalstatusId = 0;
        this.ShowWarning = 0;
        this.SubmitInternalApprovalID = 0;
        this.pendingApprovalID = 0;
        this.SentForInternalApprovalID = 0;
        this.arrayEmplsit = [];
        this.arrayLegalEntitylsit = [];
        this.arrayVendlsit = [];
        this.arrayCustlist = [];
        this.arrayWOlist = [];
        this.arraysubWOlist = [];
        this.arrayROlist = [];
        this.arraySOlist = [];
        this.splitAddbutton = false;
        this.changeName = false;
        this.issplitSiteNameAlreadyExists = false;
        this.editSiteName = '';
        this.splitmoduleId = 0;
        this.splituserId = 0;
        this.posettingModel = {};
        this.fields = ['partsCost', 'partsRevPercentage', 'unitCost', 'extCost', 'qty', 'laborCost', 'laborRevPercentage', 'overHeadCost', 'overHeadPercentage', 'chargesCost', 'freightCost', 'exclusionCost', 'directCost', 'directCostPercentage', 'revenue', 'margin', 'marginPercentage'];
        this.approvalProcessHeader = [
            {
                header: 'Action',
                field: 'actionStatus'
            }, {
                header: 'Send Date',
                field: 'sentDate'
            }, {
                header: 'Status',
                field: 'statusId'
            }, {
                header: 'Memo',
                field: 'memo'
            }, {
                header: 'Approved By',
                field: 'approvedBy'
            }, {
                header: 'Approved Date',
                field: 'approvedDate'
            }, {
                header: 'Rejected By',
                field: 'rejectedBy'
            }, {
                header: 'Rejected Date',
                field: 'rejectedDate'
            },
            {
                header: 'PN',
                field: 'partNumber'
            }, {
                header: 'PN Desc',
                field: 'partDescription'
            }, {
                header: 'ALT/Equiv PN',
                field: 'altEquiPartNumber'
            }, {
                header: 'ALT/Equiv PN Desc',
                field: 'altEquiPartDescription'
            },
            {
                header: 'Item Type',
                field: 'itemType'
            }, {
                header: 'Stock Type',
                field: 'stockType'
            }, {
                header: 'Qty',
                field: 'qty',
                width: "70px"
            }, {
                header: 'Unit Cost',
                field: 'unitCost',
                width: "70px"
            }, {
                header: 'Ext Cost',
                field: 'extCost',
                width: "70px"
            }
        ];
        this.approvalProcessList = [];
        this.tempApproverObj = {};
        this.apporoverNamesList = [];
        this.disableApproverSelectAll = false;
        this.enableMultiPartAddBtn = false;
        this.moduleId = 0;
        this.referenceId = 0;
        this.moduleName = "PurchaseOrder";
        this.adddefaultpart = true;
        this.msgflag = 0;
        this.warningID = 0;
        this.isEditWork = false;
        this.restrictID = 0;
        this.suborderlist = [];
        this.vendorService.ShowPtab = false;
        this.vendorService.alertObj.next(this.vendorService.ShowPtab);
        this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-purchase-setup';
        this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
        this.partName = (localStorage.getItem('partNumber'));
        this.salesOrderId = JSON.parse(localStorage.getItem('salesOrderId'));
        this.itemMasterId = JSON.parse(localStorage.getItem('itemMasterId'));
        this.lsconditionId = JSON.parse(localStorage.getItem('lsconditionId'));
        this.lsWoId = JSON.parse(localStorage.getItem('lsWoId'));
        this.lsSubWoId = JSON.parse(localStorage.getItem('lsSubWoId'));
    }
    PurchaseSetupComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.companyModuleId = appmodule_enum_1.AppModuleEnum.Company;
        this.sourcePoApproval.shipToUserTypeId = appmodule_enum_1.AppModuleEnum.Company;
        this.sourcePoApproval.billToUserTypeId = appmodule_enum_1.AppModuleEnum.Company;
        this.vendorModuleId = appmodule_enum_1.AppModuleEnum.Vendor;
        this.customerModuleId = appmodule_enum_1.AppModuleEnum.Customer;
        this.headerInfo.companyId = 0;
        this.headerInfo.buId = 0;
        this.headerInfo.divisionId = 0;
        this.headerInfo.departmentId = 0;
        this.headerInfo.statusId = 0;
        this.headerInfo.openDate = new Date();
        this.headerInfo.closedDate = '';
        this.posettingModel.IsResale = false;
        this.posettingModel.IsDeferredReceiver = false;
        this.posettingModel.IsEnforceApproval = false;
        this.getPurchaseOrderMasterData(this.currentUserMasterCompanyId);
        this.vendorIdByParams = this._actRoute.snapshot.params['vendorId'];
        this.id = this.poId = this._actRoute.snapshot.params['id'];
        this.workOrderPartNumberId = this._actRoute.snapshot.params['mpnid'];
        if (this.poId !== 0 && this.poId !== undefined) {
            this.breadcrumbs = [
                { label: 'Purchase Order' },
                { label: 'Edit Purchase Order' },
            ];
            this.isEditMode = true;
            this.isEditModeHeader = true;
            this.toggle_po_header = false;
            this.isSpinnerVisible = false;
            this.purchaseOrderService.getAllEditID(this.poId).subscribe(function (res) {
                var result = res;
                if (result && result.length > 0) {
                    result.forEach(function (x) {
                        if (x.label == "VENDOR") {
                            _this.arrayVendlsit.push(x.value);
                            _this.vendorId = x.value;
                        }
                        else if (x.label == "EMPLOYEE") {
                            _this.arrayEmplsit.push(x.value);
                        }
                        else if (x.label == "CUSTOMER") {
                            _this.arrayCustlist.push(x.value);
                        }
                        else if (x.label == "COMPANY") {
                            _this.arrayLegalEntitylsit.push(x.value);
                        }
                        else if (x.label == "WONO") {
                            _this.arrayWOlist.push(x.value);
                        }
                        else if (x.label == "SOWONO") {
                            _this.arraysubWOlist.push(x.value);
                        }
                        else if (x.label == "RONO") {
                            _this.arrayROlist.push(x.value);
                        }
                        else if (x.label == "SONO") {
                            _this.arraySOlist.push(x.value);
                        }
                        else if (x.label == "PRIORITY") {
                            _this.arrayPrioritylist.push(x.value);
                        }
                        else if (x.label == "CURRENCY") {
                            _this.arrayCurrencylist.push(x.value);
                        }
                        else if (x.label == "CONDITION") {
                            _this.arrayConditionlist.push(x.value);
                        }
                    });
                    _this.editDropDownLoad();
                    _this.isEditMode = true;
                    _this.isEditModeHeader = true;
                    _this.toggle_po_header = false;
                    _this.isSpinnerVisible = true;
                    setTimeout(function () {
                        _this.isSpinnerVisible = true;
                        _this.getVendorPOHeaderById(_this.poId);
                        _this.getPurchaseOrderAllPartsById(_this.poId);
                        _this.enableHeaderSaveBtn = false;
                        _this.isSpinnerVisible = false;
                        setTimeout(function () {
                            if (_this.itemMasterId > 0 && _this.adddefaultpart) {
                                _this.isSpinnerVisible = true;
                                _this.addPartNumbers(_this.itemMasterId, _this.partName, _this.lsconditionId);
                                _this.adddefaultpart = false;
                                _this.isSpinnerVisible = false;
                            }
                        }, 2000);
                    }, 2200);
                }
            });
        }
        else {
            if (this.headerInfo.purchaseOrderNumber == "" || this.headerInfo.purchaseOrderNumber == undefined) {
                this.headerInfo.purchaseOrderNumber = 'Creating';
            }
            this.priorityData();
            this.loadPOStatus();
            this.getManagementStructureDetails(this.currentUserManagementStructureId, this.employeeId);
            this.isSpinnerVisible = false;
            if (this.vendorIdByParams) {
                this.arrayVendlsit.push(this.vendorIdByParams);
                this.loadvendorDataById(this.vendorIdByParams);
            }
            else {
                this.loadVendorList('');
            }
            this.breadcrumbs = [
                { label: 'Purchase Order' },
                { label: 'Create Purchase Order' },
            ];
        }
    };
    PurchaseSetupComponent.prototype.getPurchaseOrderMasterData = function (currentUserMasterCompanyId) {
        var _this = this;
        this.purchaseOrderService.getPurchaseOrderSettingMasterData(currentUserMasterCompanyId).subscribe(function (res) {
            if (res) {
                _this.posettingModel.PurchaseOrderSettingId = res.purchaseOrderSettingId;
                _this.posettingModel.IsResale = res.isResale;
                _this.posettingModel.IsDeferredReceiver = res.isDeferredReceiver;
                _this.posettingModel.IsEnforceApproval = res.isEnforceApproval;
                _this.posettingModel.effectivedate = new Date(res.effectivedate);
                if (!_this.isEditMode) {
                    _this.headerInfo.resale = _this.posettingModel.IsResale;
                    _this.headerInfo.deferredReceiver = res.isDeferredReceiver;
                }
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.warningsandRestriction = function (Id) {
        var _this = this;
        this.WarningListId = vendorwarning_enum_1.VendorWarningEnum.Create_Purchase_Order;
        this.warningMessage = "";
        this.warningID = 0;
        this.restrictID = 0;
        this.restrictMessage = "";
        if (Id && this.WarningListId) {
            this.commonService.vendorWarningsAndRestrction(Id, this.WarningListId).subscribe(function (res) {
                if (res) {
                    if (res.warning) {
                        _this.warningMessage = res.warningMessage;
                        _this.warningID = res.vendorWarningId;
                        _this.restrictID == 0;
                    }
                    if (res.restrict && !_this.isEditMode) {
                        _this.restrictMessage = res.restrictMessage;
                        _this.restrictID = res.vendorWarningId;
                    }
                    if (_this.warningID != 0 && _this.restrictID == 0) {
                        _this.showAlertMessage();
                    }
                    else if (_this.warningID == 0 && _this.restrictID != 0) {
                        _this.showAlertMessage();
                    }
                    else if (_this.warningID != 0 && _this.restrictID != 0) {
                        _this.showAlertMessage();
                    }
                }
            }, function (err) {
                _this.isSpinnerVisible = false;
            });
        }
    };
    PurchaseSetupComponent.prototype.getStatusvalue = function (status, action) {
        if (status == 'Submit Approval' && action == '1') {
            return true;
        }
        else {
            return false;
        }
    };
    PurchaseSetupComponent.prototype.filterSplitSite = function (event) {
        var _this = this;
        this.commonService.getaddressdetailsOnlyUserbyuser(this.splitmoduleId, this.splituserId, 'Ship', this.poId).subscribe(function (returnddataforbill) {
            _this.splitSieListOriginal = returnddataforbill.address.map(function (x) {
                return {
                    siteName: x.siteName, siteId: x.siteId
                };
            });
            _this.lstfilterSplitSite = _this.splitSieListOriginal;
            if (event.query !== undefined && event.query !== null) {
                var shippingSite = __spreadArrays(_this.splitSieListOriginal.filter(function (x) {
                    return x.siteName.toLowerCase().includes(event.query.toLowerCase());
                }));
                _this.lstfilterSplitSite = shippingSite;
            }
        });
    };
    PurchaseSetupComponent.prototype.checkSplitSiteNameSelect = function () {
        if (this.isEditModeSplitPoOnly == false && this.isEditModeSplitAddress == false) {
            this.issplitSiteNameAlreadyExists = true;
            this.splitAddbutton = false;
        }
        else {
            if (this.editSiteName != autocomplete_1.editValueAssignByCondition('siteName', this.addNewAddress.siteName)) {
                this.issplitSiteNameAlreadyExists = true;
                this.splitAddbutton = false;
            }
            else {
                this.issplitSiteNameAlreadyExists = false;
                this.splitAddbutton = true;
            }
        }
    };
    PurchaseSetupComponent.prototype.checkSplitSiteNameExist = function (value) {
        if (this.isEditModeSplitPoOnly == false && this.isEditModeSplitAddress == false) {
            this.changeName = true;
            this.issplitSiteNameAlreadyExists = false;
            this.splitAddbutton = true;
            if (value != undefined && value != null) {
                for (var i = 0; i < this.splitSieListOriginal.length; i++) {
                    if (this.addNewAddress.siteName == this.splitSieListOriginal[i].siteName
                        || value.toLowerCase() == this.splitSieListOriginal[i].siteName.toLowerCase()) {
                        this.issplitSiteNameAlreadyExists = true;
                        this.splitAddbutton = false;
                        return;
                    }
                }
            }
        }
        else {
            this.changeName = true;
            this.issplitSiteNameAlreadyExists = false;
            this.splitAddbutton = true;
            if (value != undefined && value != null && value != this.editSiteName) {
                for (var i = 0; i < this.splitSieListOriginal.length; i++) {
                    if (this.addNewAddress.siteName == this.splitSieListOriginal[i].siteName
                        || value.toLowerCase() == this.splitSieListOriginal[i].siteName.toLowerCase()) {
                        this.issplitSiteNameAlreadyExists = true;
                        this.splitAddbutton = false;
                        return;
                    }
                }
            }
        }
    };
    PurchaseSetupComponent.prototype.getManagementStructureDetails = function (id, empployid, editMSID) {
        var _this = this;
        if (empployid === void 0) { empployid = 0; }
        if (editMSID === void 0) { editMSID = 0; }
        empployid = empployid == 0 ? this.employeeId : empployid;
        editMSID = this.isEditMode ? editMSID = id : 0;
        this.commonService.getManagmentStrctureData(id, empployid, editMSID, this.currentUserMasterCompanyId).subscribe(function (response) {
            if (response) {
                var result = response;
                if (result[0] && result[0].level == 'Level1') {
                    _this.maincompanylist = result[0].lstManagmentStrcture;
                    _this.headerInfo.companyId = result[0].managementStructureId;
                    _this.headerInfo.managementStructureId = result[0].managementStructureId;
                    _this.headerInfo.buId = 0;
                    _this.headerInfo.divisionId = 0;
                    _this.headerInfo.departmentId = 0;
                    _this.bulist = [];
                    _this.divisionlist = [];
                    _this.departmentList = [];
                }
                else {
                    _this.headerInfo.companyId = 0;
                    _this.headerInfo.buId = 0;
                    _this.headerInfo.divisionId = 0;
                    _this.headerInfo.departmentId = 0;
                    _this.maincompanylist = [];
                    _this.bulist = [];
                    _this.divisionlist = [];
                    _this.departmentList = [];
                }
                if (result[1] && result[1].level == 'Level2') {
                    _this.bulist = result[1].lstManagmentStrcture;
                    _this.headerInfo.buId = result[1].managementStructureId;
                    _this.headerInfo.managementStructureId = result[1].managementStructureId;
                    _this.headerInfo.divisionId = 0;
                    _this.headerInfo.departmentId = 0;
                    _this.divisionlist = [];
                    _this.departmentList = [];
                }
                else {
                    if (result[1] && result[1].level == 'NEXT') {
                        _this.bulist = result[1].lstManagmentStrcture;
                    }
                    _this.headerInfo.buId = 0;
                    _this.headerInfo.divisionId = 0;
                    _this.headerInfo.departmentId = 0;
                    _this.divisionlist = [];
                    _this.departmentList = [];
                }
                if (result[2] && result[2].level == 'Level3') {
                    _this.divisionlist = result[2].lstManagmentStrcture;
                    _this.headerInfo.divisionId = result[2].managementStructureId;
                    _this.headerInfo.managementStructureId = result[2].managementStructureId;
                    _this.headerInfo.departmentId = 0;
                    _this.departmentList = [];
                }
                else {
                    if (result[2] && result[2].level == 'NEXT') {
                        _this.divisionlist = result[2].lstManagmentStrcture;
                    }
                    _this.headerInfo.divisionId = 0;
                    _this.headerInfo.departmentId = 0;
                    _this.departmentList = [];
                }
                if (result[3] && result[3].level == 'Level4') {
                    _this.departmentList = result[3].lstManagmentStrcture;
                    ;
                    _this.headerInfo.departmentId = result[3].managementStructureId;
                    _this.headerInfo.managementStructureId = result[3].managementStructureId;
                }
                else {
                    _this.headerInfo.departmentId = 0;
                    if (result[3] && result[3].level == 'NEXT') {
                        _this.departmentList = result[3].lstManagmentStrcture;
                    }
                }
                _this.employeedata('', _this.headerInfo.managementStructureId);
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.getManagementStructureForParentEdit = function (partList, employid, editMSID) {
        var _this = this;
        if (employid === void 0) { employid = 0; }
        if (editMSID === void 0) { editMSID = 0; }
        var msId = partList.managementStructureId ? partList.managementStructureId : this.headerInfo.managementStructureId;
        employid = employid == 0 ? this.employeeId : employid;
        editMSID = this.isEditMode ? msId : 0;
        if (msId == this.headerInfo.managementStructureId) {
            if (this.headerInfo.companyId > 0) {
                partList.maincompanylist = this.maincompanylist;
                partList.parentCompanyId = this.headerInfo.companyId;
                partList.managementStructureId = this.headerInfo.companyId;
                partList.parentBulist = [];
                partList.parentDivisionlist = [];
                partList.parentDepartmentlist = [];
                partList.parentbuId = 0;
                partList.parentDivisionId = 0;
                partList.parentDeptId = 0;
            }
            else {
                partList.parentCompanyId = 0;
                partList.parentbuId = 0;
                partList.parentDivisionId = 0;
                partList.parentDeptId = 0;
                partList.maincompanylist = [];
                partList.parentBulist = [];
                partList.parentDivisionlist = [];
                partList.parentDepartmentlist = [];
            }
            if (this.headerInfo.buId > 0) {
                partList.parentBulist = this.bulist;
                partList.parentbuId = this.headerInfo.buId;
                partList.managementStructureId = this.headerInfo.buId;
                partList.parentDivisionlist = [];
                partList.parentDepartmentlist = [];
                partList.parentDivisionId = 0;
                partList.parentDeptId = 0;
            }
            else {
                partList.parentbuId = 0;
                partList.parentDivisionId = 0;
                partList.parentDeptId = 0;
                partList.parentBulist = this.bulist;
                partList.parentDivisionlist = [];
                partList.parentDepartmentlist = [];
            }
            if (this.headerInfo.divisionId > 0) {
                partList.parentDivisionlist = this.divisionlist;
                partList.parentDivisionId = this.headerInfo.divisionId;
                partList.managementStructureId = this.headerInfo.divisionId;
                partList.parentDepartmentlist = [];
                partList.parentDeptId = 0;
            }
            else {
                partList.parentDivisionId = 0;
                partList.parentDeptId = 0;
                partList.parentDivisionlist = this.divisionlist;
                partList.parentDepartmentlist = [];
            }
            if (this.headerInfo.departmentId > 0) {
                partList.parentDepartmentlist = this.departmentList;
                partList.parentDeptId = this.headerInfo.departmentId;
                partList.managementStructureId = this.headerInfo.departmentId;
            }
            else {
                partList.parentDeptId = 0;
                partList.parentDepartmentlist = this.departmentList;
            }
        }
        else {
            this.commonService.getManagmentStrctureData(msId, employid, editMSID, this.currentUserMasterCompanyId).subscribe(function (response) {
                if (response) {
                    var result = response;
                    if (result[0] && result[0].level == 'Level1') {
                        partList.maincompanylist = result[0].lstManagmentStrcture;
                        partList.parentCompanyId = result[0].managementStructureId;
                        partList.managementStructureId = result[0].managementStructureId;
                        partList.parentBulist = [];
                        partList.parentDivisionlist = [];
                        partList.parentDepartmentlist = [];
                        partList.parentbuId = 0;
                        partList.parentDivisionId = 0;
                        partList.parentDeptId = 0;
                    }
                    else {
                        partList.parentCompanyId = 0;
                        partList.parentbuId = 0;
                        partList.parentDivisionId = 0;
                        partList.parentDeptId = 0;
                        partList.maincompanylist = [];
                        partList.parentBulist = [];
                        partList.parentDivisionlist = [];
                        partList.parentDepartmentlist = [];
                    }
                    if (result[1] && result[1].level == 'Level2') {
                        partList.parentBulist = result[1].lstManagmentStrcture;
                        partList.parentbuId = result[1].managementStructureId;
                        partList.managementStructureId = result[1].managementStructureId;
                        partList.parentDivisionlist = [];
                        partList.parentDepartmentlist = [];
                        partList.parentDivisionId = 0;
                        partList.parentDeptId = 0;
                    }
                    else {
                        if (result[1] && result[1].level == 'NEXT') {
                            partList.parentBulist = result[1].lstManagmentStrcture;
                        }
                        partList.parentbuId = 0;
                        partList.parentDivisionId = 0;
                        partList.parentDeptId = 0;
                        partList.parentDivisionlist = [];
                        partList.parentDepartmentlist = [];
                    }
                    if (result[2] && result[2].level == 'Level3') {
                        partList.parentDivisionlist = result[2].lstManagmentStrcture;
                        partList.parentDivisionId = result[2].managementStructureId;
                        partList.managementStructureId = result[2].managementStructureId;
                        partList.parentDeptId = 0;
                        partList.parentDepartmentlist = [];
                    }
                    else {
                        if (result[2] && result[2].level == 'NEXT') {
                            partList.parentDivisionlist = result[2].lstManagmentStrcture;
                        }
                        partList.parentDivisionId = 0;
                        partList.parentDeptId = 0;
                        partList.parentDepartmentlist = [];
                    }
                    if (result[3] && result[3].level == 'Level4') {
                        partList.parentDepartmentlist = result[3].lstManagmentStrcture;
                        ;
                        partList.parentDeptId = result[3].managementStructureId;
                        partList.managementStructureId = result[3].managementStructureId;
                    }
                    else {
                        partList.parentDeptId = 0;
                        if (result[3] && result[3].level == 'NEXT') {
                            partList.parentDepartmentlist = result[3].lstManagmentStrcture;
                        }
                    }
                }
            }, function (err) {
                _this.isSpinnerVisible = false;
            });
        }
        this.getFunctionalReportCurrencyById(partList);
        this.getManagementStructureForChildEditAll(partList);
    };
    PurchaseSetupComponent.prototype.getManagementStructureForChildEditAll = function (partList) {
        if (partList.parentCompanyId > 0) {
            if (partList.childList) {
                for (var j = 0; j < partList.childList.length; j++) {
                    partList.childList[j].maincompanylist = partList.maincompanylist;
                    partList.childList[j].childCompanyId = partList.parentCompanyId;
                    partList.childList[j].managementStructureId == partList.parentCompanyId;
                    partList.childList[j].childBulist = [];
                    partList.childList[j].childDivisionlist = [];
                    partList.childList[j].childDepartmentlist = [];
                    partList.childList[j].childbuId = 0;
                    partList.childList[j].childDivisionId = 0;
                    partList.childList[j].childDeptId = 0;
                }
            }
        }
        else {
            if (partList.childList) {
                for (var j = 0; j < partList.childList.length; j++) {
                    partList.childList[j].childCompanyId = 0;
                    partList.childList[j].maincompanylist = [];
                    partList.childList[j].childBulist = [];
                    partList.childList[j].childDivisionlist = [];
                    partList.childList[j].childDepartmentlist = [];
                    partList.childList[j].childbuId = 0;
                    partList.childList[j].childDivisionId = 0;
                    partList.childList[j].childDeptId = 0;
                }
            }
        }
        if (partList.parentbuId > 0) {
            if (partList.childList) {
                for (var j = 0; j < partList.childList.length; j++) {
                    partList.childList[j].childBulist = partList.parentBulist;
                    partList.childList[j].managementStructureId = partList.parentbuId;
                    partList.childList[j].childbuId = partList.parentbuId;
                    partList.childList[j].childDivisionlist = [];
                    partList.childList[j].childDepartmentlist = [];
                    partList.childList[j].childDivisionId = 0;
                    partList.childList[j].childDeptId = 0;
                }
            }
        }
        else {
            if (partList.childList) {
                for (var j = 0; j < partList.childList.length; j++) {
                    partList.childList[j].childbuId = 0;
                    partList.childList[j].childBulist = partList.parentBulist;
                    partList.childList[j].childDivisionlist = [];
                    partList.childList[j].childDepartmentlist = [];
                    partList.childList[j].childDivisionId = 0;
                    partList.childList[j].childDeptId = 0;
                }
            }
        }
        if (partList.parentDivisionId > 0) {
            if (partList.childList) {
                for (var j = 0; j < partList.childList.length; j++) {
                    partList.childList[j].childDivisionlist = partList.parentDivisionlist;
                    partList.childList[j].managementStructureId = partList.parentDivisionId;
                    partList.childList[j].childDivisionId = partList.parentDivisionId;
                    partList.childList[j].childDepartmentlist = [];
                    partList.childList[j].childDeptId = 0;
                }
            }
        }
        else {
            if (partList.childList) {
                for (var j = 0; j < partList.childList.length; j++) {
                    partList.childList[j].childDivisionlist = partList.parentDivisionlist;
                    partList.childList[j].childDepartmentlist = [];
                    partList.childList[j].childDivisionId = 0;
                    partList.childList[j].childDeptId = 0;
                }
            }
        }
        if (partList.parentDeptId > 0) {
            if (partList.childList) {
                for (var j = 0; j < partList.childList.length; j++) {
                    partList.childList[j].childDivisionlist = partList.parentDepartmentlist;
                    partList.childList[j].managementStructureId = partList.parentDeptId;
                    partList.childList[j].childDeptId = partList.parentDeptId;
                }
            }
        }
        else {
            if (partList.childList) {
                for (var j = 0; j < partList.childList.length; j++) {
                    partList.childList[j].childDepartmentlist = partList.parentDepartmentlist;
                    partList.childList[j].childDeptId = 0;
                }
            }
        }
    };
    PurchaseSetupComponent.prototype.getManagementStructureForChildEdit = function (partChildList) {
        var editMSID = this.isEditMode ? partChildList.managementStructureId : 0;
        this.commonService.getManagmentStrctureData(partChildList.managementStructureId, this.employeeId, editMSID, this.currentUserMasterCompanyId).subscribe(function (response) {
            if (response) {
                var result = response;
                if (result[0] && result[0].level == 'Level1') {
                    partChildList.maincompanylist = result[0].lstManagmentStrcture;
                    partChildList.childCompanyId = result[0].managementStructureId;
                    partChildList.managementStructureId = result[0].managementStructureId;
                    partChildList.childBulist = [];
                    partChildList.childDivisionlist = [];
                    partChildList.childDepartmentlist = [];
                    partChildList.childbuId = 0;
                    partChildList.childDivisionId = 0;
                    partChildList.childDeptId = 0;
                }
                else {
                    partChildList.maincompanylist = [];
                    partChildList.childBulist = [];
                    partChildList.childDivisionlist = [];
                    partChildList.childDepartmentlist = [];
                    partChildList.childCompanyId = 0;
                    partChildList.childbuId = 0;
                    partChildList.childDivisionId = 0;
                    partChildList.childDeptId = 0;
                }
                if (result[1] && result[1].level == 'Level2') {
                    partChildList.childBulist = result[1].lstManagmentStrcture;
                    partChildList.managementStructureId = result[1].managementStructureId;
                    partChildList.childbuId = result[1].managementStructureId;
                    partChildList.childDivisionlist = [];
                    partChildList.childDepartmentlist = [];
                    partChildList.childDivisionId = 0;
                    partChildList.childDeptId = 0;
                }
                else {
                    if (result[1] && result[1].level == 'NEXT') {
                        partChildList.childBulist = result[1].lstManagmentStrcture;
                    }
                    partChildList.childDivisionlist = [];
                    partChildList.childDepartmentlist = [];
                    partChildList.childbuId = 0;
                    partChildList.childDivisionId = 0;
                    partChildList.childDeptId = 0;
                }
                if (result[2] && result[2].level == 'Level3') {
                    partChildList.childDivisionlist = result[2].lstManagmentStrcture;
                    partChildList.childDivisionId = result[2].managementStructureId;
                    partChildList.managementStructureId = result[2].managementStructureId;
                    partChildList.childDeptId = 0;
                    partChildList.childDepartmentlist = [];
                }
                else {
                    if (result[2] && result[2].level == 'NEXT') {
                        partChildList.childDivisionlist = result[2].lstManagmentStrcture;
                    }
                    partChildList.childDepartmentlist = [];
                    partChildList.childDivisionId = 0;
                    partChildList.childDeptId = 0;
                }
                if (result[3] && result[3].level == 'Level4') {
                    partChildList.childDepartmentlist = result[3].lstManagmentStrcture;
                    ;
                    partChildList.childDeptId = result[3].managementStructureId;
                    partChildList.managementStructureId = result[3].managementStructureId;
                }
                else {
                    if (result[3] && result[3].level == 'NEXT') {
                        partChildList.childDepartmentlist = result[3].lstManagmentStrcture;
                    }
                    partChildList.childDeptId = 0;
                }
            }
        });
    };
    PurchaseSetupComponent.prototype.getBUList = function (legalEntityId) {
        var _this = this;
        this.headerInfo.buId = 0;
        this.headerInfo.divisionId = 0;
        this.headerInfo.departmentId = 0;
        this.bulist = [];
        this.divisionlist = [];
        this.departmentList = [];
        if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
            this.headerInfo.managementStructureId = legalEntityId;
            this.headerInfo.companyId = legalEntityId;
            this.commonService.getManagementStructurelevelWithEmployee(legalEntityId, this.employeeId).subscribe(function (res) {
                _this.bulist = res;
                _this.employeedata('', _this.headerInfo.managementStructureId);
            });
        }
        else {
            this.headerInfo.managementStructureId = 0;
            this.headerInfo.companyId = 0;
        }
    };
    PurchaseSetupComponent.prototype.getParentBUList = function (partList) {
        partList.parentBulist = [];
        partList.parentDivisionlist = [];
        partList.parentDepartmentlist = [];
        partList.parentbuId = 0;
        partList.parentDivisionId = 0;
        partList.parentDeptId = 0;
        if (partList.childList) {
            for (var j = 0; j < partList.childList.length; j++) {
                partList.childList[j].childCompanyId = partList.parentCompanyId;
                partList.childList[j].childBulist = [];
                partList.childList[j].childDivisionlist = [];
                partList.childList[j].childDepartmentlist = [];
                partList.childList[j].childbuId = 0;
                partList.childList[j].childDivisionId = 0;
                partList.childList[j].childDeptId = 0;
            }
        }
        if (partList.parentCompanyId != 0 && partList.parentCompanyId != null && partList.parentCompanyId != undefined) {
            partList.managementStructureId = partList.parentCompanyId;
            this.commonService.getManagementStructurelevelWithEmployee(partList.parentCompanyId, this.employeeId).subscribe(function (res) {
                partList.parentBulist = res;
                if (partList.childList) {
                    for (var j = 0; j < partList.childList.length; j++) {
                        partList.childList[j].childBulist = partList.parentBulist;
                        partList.childList[j].childCompanyId = partList.parentCompanyId;
                        partList.childList[j].managementStructureId = partList.parentCompanyId;
                    }
                }
            });
        }
        else {
            partList.managementStructureId = 0;
            if (partList.childList) {
                for (var j = 0; j < partList.childList.length; j++) {
                    partList.childList[j].managementStructureId = 0;
                }
            }
        }
        this.getFunctionalReportCurrencyById(partList);
    };
    PurchaseSetupComponent.prototype.getChildBUList = function (partChildList) {
        partChildList.childBulist = [];
        partChildList.childDivisionlist = [];
        partChildList.childDepartmentlist = [];
        partChildList.childbuId = 0;
        partChildList.childDivisionId = 0;
        partChildList.childDeptId = 0;
        if (partChildList.childCompanyId != 0 && partChildList.childCompanyId != null && partChildList.childCompanyId != undefined) {
            partChildList.managementStructureId = partChildList.childCompanyId;
            this.commonService.getManagementStructurelevelWithEmployee(partChildList.childCompanyId, this.employeeId).subscribe(function (res) {
                partChildList.childBulist = res;
            });
        }
        else {
            partChildList.managementStructureId = 0;
        }
    };
    PurchaseSetupComponent.prototype.getDivisionlist = function (buId) {
        var _this = this;
        this.divisionlist = [];
        this.departmentList = [];
        this.headerInfo.divisionId = 0;
        this.headerInfo.departmentId = 0;
        if (buId != 0 && buId != null && buId != undefined) {
            this.headerInfo.managementStructureId = buId;
            this.headerInfo.buId = buId;
            this.commonService.getManagementStructurelevelWithEmployee(buId, this.employeeId).subscribe(function (res) {
                _this.divisionlist = res;
            });
        }
        else {
            this.headerInfo.managementStructureId = this.headerInfo.companyId;
        }
        this.employeedata('', this.headerInfo.managementStructureId);
    };
    PurchaseSetupComponent.prototype.getParentDivisionlist = function (partList) {
        partList.parentDivisionlist = [];
        partList.parentDepartmentlist = [];
        partList.parentDivisionId = 0;
        partList.parentDeptId = 0;
        if (partList.childList) {
            for (var j = 0; j < partList.childList.length; j++) {
                partList.childList[j].childbuId = partList.parentbuId;
                partList.childList[j].childDivisionlist = [];
                partList.childList[j].childDepartmentlist = [];
                partList.childList[j].childDivisionId = 0;
                partList.childList[j].childDeptId = 0;
            }
        }
        if (partList.parentbuId != 0 && partList.parentbuId != null && partList.parentbuId != undefined) {
            partList.managementStructureId = partList.parentbuId;
            this.commonService.getManagementStructurelevelWithEmployee(partList.parentbuId, this.employeeId).subscribe(function (res) {
                partList.parentDivisionlist = res;
                if (partList.childList) {
                    for (var j = 0; j < partList.childList.length; j++) {
                        partList.childList[j].childDivisionlist = partList.parentDivisionlist;
                        partList.childList[j].childbuId = partList.parentbuId;
                        partList.childList[j].managementStructureId = partList.parentbuId;
                    }
                }
            });
        }
        else {
            partList.managementStructureId = partList.parentCompanyId;
            if (partList.childList) {
                for (var j = 0; j < partList.childList.length; j++) {
                    partList.childList[j].managementStructureId = partList.parentCompanyId;
                }
            }
        }
        this.getFunctionalReportCurrencyById(partList);
    };
    PurchaseSetupComponent.prototype.getChildDivisionlist = function (partChildList) {
        partChildList.childDivisionId = 0;
        partChildList.childDeptId = 0;
        partChildList.childDivisionlist = [];
        partChildList.childDepartmentlist = [];
        if (partChildList.childbuId != 0 && partChildList.childbuId != null && partChildList.childbuId != undefined) {
            partChildList.managementStructureId = partChildList.childbuId;
            this.commonService.getManagementStructurelevelWithEmployee(partChildList.childbuId, this.employeeId).subscribe(function (res) {
                partChildList.childDivisionlist = res;
            });
        }
        else {
            partChildList.managementStructureId = partChildList.childCompanyId;
            ;
        }
    };
    PurchaseSetupComponent.prototype.getDepartmentlist = function (divisionId) {
        var _this = this;
        this.headerInfo.departmentId = 0;
        this.departmentList = [];
        if (divisionId != 0 && divisionId != null && divisionId != undefined) {
            this.headerInfo.divisionId = divisionId;
            this.headerInfo.managementStructureId = divisionId;
            this.commonService.getManagementStructurelevelWithEmployee(divisionId, this.employeeId).subscribe(function (res) {
                _this.departmentList = res;
            });
        }
        else {
            this.headerInfo.managementStructureId = this.headerInfo.buId;
            this.headerInfo.divisionId = 0;
        }
        this.employeedata('', this.headerInfo.managementStructureId);
    };
    PurchaseSetupComponent.prototype.getParentDeptlist = function (partList) {
        partList.parentDeptId = 0;
        partList.parentDepartmentlist = [];
        if (partList.childList) {
            for (var j = 0; j < partList.childList.length; j++) {
                partList.childList[j].childDivisionId = partList.parentDivisionId;
                partList.childList[j].childDepartmentlist = [];
                partList.childList[j].childDeptId = 0;
            }
        }
        if (partList.parentDivisionId != 0 && partList.parentDivisionId != null && partList.parentDivisionId != undefined) {
            partList.managementStructureId = partList.parentDivisionId;
            this.commonService.getManagementStructurelevelWithEmployee(partList.parentDivisionId, this.employeeId).subscribe(function (res) {
                partList.parentDepartmentlist = res;
                if (partList.childList) {
                    for (var j = 0; j < partList.childList.length; j++) {
                        partList.childList[j].childDepartmentlist = partList.parentDepartmentlist;
                        partList.childList[j].childDivisionId = partList.parentDivisionId;
                        partList.childList[j].managementStructureId = partList.parentDivisionId;
                    }
                }
            });
        }
        else {
            partList.managementStructureId = partList.parentbuId;
            if (partList.childList) {
                for (var j = 0; j < partList.childList.length; j++) {
                    partList.childList[j].managementStructureId = partList.parentbuId;
                }
            }
        }
        this.getFunctionalReportCurrencyById(partList);
    };
    PurchaseSetupComponent.prototype.getChildDeptlist = function (partChildList) {
        partChildList.childDepartmentlist = [];
        partChildList.childDeptId = 0;
        if (partChildList.childDivisionId != 0 && partChildList.childDivisionId != null && partChildList.childDivisionId != undefined) {
            partChildList.managementStructureId = partChildList.childDivisionId;
            this.commonService.getManagementStructurelevelWithEmployee(partChildList.childDivisionId, this.employeeId).subscribe(function (res) {
                partChildList.childDepartmentlist = res;
            });
        }
        else {
            partChildList.managementStructureId = partChildList.childbuId;
        }
    };
    PurchaseSetupComponent.prototype.getDepartmentId = function (departmentId) {
        if (departmentId != 0 && departmentId != null && departmentId != undefined) {
            this.headerInfo.managementStructureId = departmentId;
            this.headerInfo.departmentId = departmentId;
        }
        else {
            this.headerInfo.managementStructureId = this.headerInfo.divisionId;
            this.headerInfo.departmentId = 0;
        }
        this.employeedata('', this.headerInfo.managementStructureId);
    };
    PurchaseSetupComponent.prototype.getParentDeptId = function (partList) {
        if (partList.parentDeptId != 0 && partList.parentDeptId != null && partList.parentDeptId != undefined) {
            partList.managementStructureId = partList.parentDeptId;
            if (partList.childList) {
                for (var j = 0; j < partList.childList.length; j++) {
                    partList.childList[j].childDeptId = partList.parentDeptId;
                    this.getChildDeptId(partList.childList[j]);
                }
            }
        }
        else {
            partList.managementStructureId = partList.parentDivisionId;
            if (partList.childList) {
                for (var j = 0; j < partList.childList.length; j++) {
                    partList.childList[j].managementStructureId = partList.parentDivisionId;
                    partList.childList[j].childDeptId = partList.parentDeptId;
                }
            }
        }
        this.getFunctionalReportCurrencyById(partList);
    };
    PurchaseSetupComponent.prototype.getChildDeptId = function (partChildList) {
        if (partChildList.childDeptId != 0 && partChildList.childDeptId != null && partChildList.childDeptId != undefined) {
            partChildList.managementStructureId = partChildList.childDeptId;
        }
        else {
            partChildList.managementStructureId = partChildList.childDivisionId;
        }
    };
    PurchaseSetupComponent.prototype.getFunctionalReportCurrencyById = function (partList) {
        var _this = this;
        if (partList.managementStructureId != null && partList.managementStructureId != 0) {
            this.commonService.getFunctionalReportCurrencyById(partList.managementStructureId).subscribe(function (res) {
                partList.functionalCurrencyId = {
                    label: res.functionalCurrencyCode,
                    value: res.functionalCurrencyId
                };
                partList.reportCurrencyId = {
                    label: res.reportingCurrencyCode,
                    value: res.reportingCurrencyId
                };
                _this.getFXRate(partList);
            }, function (err) {
                _this.isSpinnerVisible = false;
            });
        }
    };
    PurchaseSetupComponent.prototype.loadPOStatus = function () {
        var _this = this;
        if (this.arrayPostatuslist.length == 0) {
            this.arrayPostatuslist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('POStatus', 'POStatusId', 'Description', '', true, 0, this.arrayPostatuslist.join(), 0)
            .subscribe(function (res) {
            _this.poStatusList = res;
            _this.poStatusList = _this.poStatusList.sort(function (a, b) { return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0); });
            res.forEach(function (x) {
                if (x.label.toUpperCase() == "OPEN") {
                    _this.headerInfo.statusId = x.value;
                    _this.poOpenstatusID = x.value;
                }
                else if (x.label.toUpperCase() == "FULFILLING") {
                    _this.poFulfillingstatusID = x.value;
                }
            });
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.loadApprovalProcessStatus = function () {
        var _this = this;
        this.commonService.smartDropDownList('ApprovalProcess', 'ApprovalProcessId', 'Name').subscribe(function (response) {
            if (response) {
                response.forEach(function (x) {
                    if (x.label.toUpperCase() == "APPROVED") {
                        _this.ApprovedstatusId = x.value;
                    }
                    else if (x.label.toUpperCase() == "SENTFORINTERNALAPPROVAL") {
                        _this.SentForInternalApprovalID = x.value;
                    }
                    else if (x.label.toUpperCase() == "SUBMITINTERNALAPPROVAL") {
                        _this.SubmitInternalApprovalID = x.value;
                    }
                    else if (x.label.toUpperCase() == "SUBMITINTERNALAPPROVAL") {
                        _this.pendingApprovalID = x.value;
                    }
                });
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.enableNotes = function () {
    };
    PurchaseSetupComponent.prototype.onWOSelect = function (id, partList, index) {
        this.arrayWOlist.push(id);
        this.GetSubWolist(id, partList, index);
    };
    PurchaseSetupComponent.prototype.onSubWOSelect = function (id) {
        this.arraysubWOlist.push(id);
    };
    PurchaseSetupComponent.prototype.onROSelect = function (id) {
        this.arrayROlist.push(id);
    };
    PurchaseSetupComponent.prototype.onSOSelect = function (id) {
        this.arraySOlist.push(id);
    };
    // private salesStockRefData() {		
    // 		if(this.salesOrderReferenceData){
    //             this.newObjectForParent.partNumberId = {value: this.salesOrderReferenceData.itemMasterId, label: this.salesOrderReferenceData.partNumber};
    // 				const newObject = {
    // 						...this.newObjectForParent,
    // 						partNumberId: {value: this.salesOrderReferenceData.itemMasterId, label: this.salesOrderReferenceData.partNumber},
    // 						needByDate: this.headerInfo.needByDate,
    // 						priorityId: this.headerInfo.priorityId ? editValueAssignByCondition('value', this.headerInfo.priorityId) : null,
    // 						discountPercent: {percentId: 0, percentValue: 'Select'}
    // 					}
    // 					this.getManagementStructureForParentEdit(newObject);
    // 					this.getPNDetailsById(this.newObjectForParent)
    // 			this.newObjectForParent.quantityOrdered = this.salesOrderReferenceData.quantity;
    // 			this.newObjectForParent.managementStructureId = this.salesOrderReferenceData.quantity;
    // 			this.newObjectForParent.conditionId = this.salesOrderReferenceData.conditionId;
    // 		}
    // 		//bind part details by stocklineid
    // 		if(this.stocklineReferenceData){
    // 					this.newObjectForParent.partNumberId = {value: this.stocklineReferenceData.itemMasterId, label: this.stocklineReferenceData.partNumber};
    // 					this.getPNDetailsById(this.newObjectForParent);
    // 			this.newObjectForParent.quantityOrdered = this.stocklineReferenceData.quantity;	
    // 		}	
    // }
    PurchaseSetupComponent.prototype.loadModuleListForVendorComp = function () {
        var _this = this;
        this.commonService.getModuleListForObtainOwnerTraceable(this.authService.currentUser.masterCompanyId).subscribe(function (res) {
            _this.userTypes = res;
            _this.userTypes.map(function (x) {
                if (x.moduleName.toUpperCase() == 'COMPANY') {
                    _this.companyModuleId = x.moduleId;
                    _this.sourcePoApproval.shipToUserTypeId = _this.companyModuleId;
                    _this.sourcePoApproval.billToUserTypeId = _this.companyModuleId;
                }
                else if (x.moduleName.toUpperCase() == 'VENDOR') {
                    _this.vendorModuleId = x.moduleId;
                }
                else if (x.moduleName.toUpperCase() == 'CUSTOMER') {
                    _this.customerModuleId = x.moduleId;
                }
            });
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    //#endregion
    // Load Vendor data
    PurchaseSetupComponent.prototype.loadvendorDataById = function (vendorId) {
        var _this = this;
        if (vendorId) {
            this.vendorContactList = [];
            this.getVendorContactsListByID(vendorId);
            this.getVendorCreditTermsByID(vendorId);
            this.warningsandRestriction(vendorId);
            if (this.arrayVendlsit.length == 0) {
                this.arrayVendlsit.push(0);
            }
            this.arrayVendlsit.push(vendorId);
            this.isSpinnerVisible = true;
            this.vendorService.getVendorNameCodeListwithFilter('', 20, this.arrayVendlsit.join(), this.currentUserMasterCompanyId).subscribe(function (res) {
                _this.allActions = res;
                _this.vendorNames = res;
                _this.vendorCodes = res;
                _this.splitVendorNames = res;
                _this.headerInfo.vendorId = autocomplete_1.getObjectById('vendorId', vendorId, _this.allActions);
                _this.headerInfo.vendorCode = autocomplete_1.getObjectById('vendorId', vendorId, _this.allActions);
                _this.headerInfo.vendorName = autocomplete_1.getValueFromArrayOfObjectById('vendorName', 'vendorId', vendorId, _this.allActions);
                _this.isSpinnerVisible = false;
            }, function (err) {
                _this.isSpinnerVisible = false;
            });
        }
    };
    PurchaseSetupComponent.prototype.getVendorContactsListByID = function (vendorId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.vendorService.getVendorContactDataByVendorId(vendorId).subscribe(function (data) {
                            _this.vendorContactList = data;
                            var isDefaultContact = _this.vendorContactList.filter(function (x) {
                                if (x.isDefaultContact === true) {
                                    return x;
                                }
                                else
                                    return x;
                            });
                            _this.headerInfo.vendorContactId = isDefaultContact[0];
                            _this.headerInfo.vendorContactPhone = isDefaultContact[0];
                        }, function (err) {
                            _this.isSpinnerVisible = false;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PurchaseSetupComponent.prototype.getVendorCreditTermsByID = function (vendorId) {
        var _this = this;
        this.headerInfo.creditLimit = '0.00';
        this.headerInfo.creditTerms = '';
        this.vendorService.getVendorCreditTermsByVendorId(vendorId).subscribe(function (res) {
            if (res) {
                _this.headerInfo.creditLimit = res.creditLimit ? autocomplete_1.formatNumberAsGlobalSettingsModule(res.creditLimit, 2) : '0.00';
                _this.headerInfo.creditTermsId = res.creditTermsId;
                _this.headerInfo.creditTerms = res.creditTerms;
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.getVendorPOHeaderById = function (poId) {
        var _this = this;
        this.purchaseOrderService.getVendorPOHeaderById(poId).subscribe(function (res) {
            _this.isheaderEmployee = true;
            _this.headerInfo = {
                purchaseOrderNumber: res.purchaseOrderNumber,
                openDate: new Date(res.openDate),
                closedDate: res.closedDate ? new Date(res.closedDate) : '',
                needByDate: new Date(res.needByDate),
                priorityId: autocomplete_1.getObjectById('value', res.priorityId, _this.allPriorityInfo),
                deferredReceiver: res.deferredReceiver,
                vendorId: autocomplete_1.getObjectById('vendorId', res.vendorId, _this.allActions),
                vendorCode: autocomplete_1.getObjectById('vendorId', res.vendorId, _this.allActions),
                //vendorCode: res.VendorCode,
                //vendorContactId: this.getVendorContactsListByIDEdit(res),
                //vendorContactPhone: this.getVendorContactsListByIDEdit(res),
                vendorName: autocomplete_1.getValueFromArrayOfObjectById('vendorName', 'vendorId', res.vendorId, _this.allActions),
                creditLimit: res.creditLimit ? autocomplete_1.formatNumberAsGlobalSettingsModule(res.creditLimit, 2) : '0.00',
                creditTerms: res.creditTerms,
                creditTermsId: res.creditTermsId,
                requestedBy: res.requestedBy,
                requisitionerId: autocomplete_1.getObjectById('value', res.requestedBy, _this.allEmployeeList),
                approverId: autocomplete_1.getObjectById('value', res.approverId, _this.allEmployeeList),
                approvedDate: res.dateApproved ? new Date(res.dateApproved) : '',
                statusId: res.statusId,
                resale: res.resale,
                managementStructureId: res.managementStructureId,
                companyId: _this.getManagementStructureDetails(res.managementStructureId, _this.employeeId, res.managementStructureId),
                poMemo: res.poMemo,
                notes: res.notes,
                createdDate: res.createdDate,
                updatedDate: res.updatedDate,
                createdBy: res.createdBy,
                updatedBy: res.updatedBy
            };
            _this.getVendorContactsListByIDEdit(res);
            if (_this.headerInfo.statusId == _this.poOpenstatusID) {
                _this.disableHeaderInfo = false;
            }
            else {
                _this.disableHeaderInfo = true;
            }
            if (_this.headerInfo.statusId == _this.poFulfillingstatusID) {
                _this.disableAddPart = true;
            }
            else {
                _this.disableAddPart = false;
            }
            _this.enableHeaderSaveBtn = false;
            if (_this.posettingModel.IsEnforceApproval) {
                _this.disablePOStatus = true;
            }
            else {
                if (_this.headerInfo.openDate
                    && _this.posettingModel.effectivedate
                    && new Date(_this.headerInfo.openDate) > new Date(_this.posettingModel.effectivedate)) {
                    _this.posettingModel.IsEnforceApproval = false;
                    _this.disablePOStatus = false;
                }
                else if (_this.headerInfo.openDate
                    && _this.posettingModel.effectivedate
                    && new Date(_this.headerInfo.openDate) < new Date(_this.posettingModel.effectivedate)) {
                    _this.posettingModel.IsEnforceApproval = true;
                    _this.disablePOStatus = true;
                }
                else {
                    _this.disablePOStatus = true;
                }
            }
            _this.capvendorId = res.vendorId;
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.getPurchaseOrderAllPartsById = function (poId) {
        var _this = this;
        this.isSpinnerVisible = true;
        this.purchaseOrderService.getPurchaseOrderAllPartsById(poId, this.employeeId, this.workOrderPartNumberId).subscribe(function (res) {
            if (res) {
                _this.isSpinnerVisible = true;
                _this.BindAllParts(res);
                _this.isSpinnerVisible = false;
                _this.enableHeaderSaveBtn = false;
            }
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.BindAllParts = function (data) {
        var _this = this;
        this.partListData = [];
        this.newPartsList = [this.newObjectForParent];
        if (data) {
            data[0].map(function (x, pindex) {
                _this.newPartsList = __assign(__assign({}, x), { partNumberId: { value: x.itemMasterId, label: x.partNumber }, ifSplitShip: x.purchaseOrderSplitParts.length > 0 ? true : false, partNumber: x.partNumber, partDescription: x.partDescription, needByDate: x.needByDate ? new Date(x.needByDate) : '', conditionId: parseInt(x.conditionId), priorityId: parseInt(x.priorityId), discountPercent: x.discountPercent ? parseInt(x.discountPercent) : 0, functionalCurrencyId: autocomplete_1.getObjectById('value', x.functionalCurrencyId, _this.allCurrencyData), reportCurrencyId: autocomplete_1.getObjectById('value', x.reportCurrencyId, _this.allCurrencyData), workOrderId: autocomplete_1.getObjectById('value', x.workOrderId == null ? 0 : x.workOrderId, _this.allWorkOrderInfo), subWorkOrderId: x.subWorkOrderId, repairOrderId: autocomplete_1.getObjectById('value', x.repairOrderId == null ? 0 : x.repairOrderId, _this.allRepairOrderInfo), salesOrderId: autocomplete_1.getObjectById('value', x.salesOrderId == null ? 0 : x.salesOrderId, _this.allSalesOrderInfo), quantityOrdered: x.quantityOrdered ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.quantityOrdered, 0) : '0', vendorListPrice: x.vendorListPrice ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.vendorListPrice, 2) : '0.00', discountPerUnit: x.discountPerUnit ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.discountPerUnit, 2) : '0.00', discountAmount: x.discountAmount ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.discountAmount, 2) : '0.00', unitCost: x.unitCost ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00', extendedCost: x.extendedCost ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00', isApproved: x.isApproved ? x.isApproved : false, childList: _this.getPurchaseOrderSplitPartsEdit(x, pindex, data[1]), remQty: 0 });
                _this.getManagementStructureForParentPart(_this.newPartsList, data[1], data[3]);
                if (_this.newPartsList.childList && _this.newPartsList.childList.length > 0) {
                    for (var i = 0; i < _this.newPartsList.childList.length; i++) {
                        _this.getManagementStructureForChildPart(_this.newPartsList.childList[i], data[1]);
                    }
                }
                _this.getPartItemDetailsById(_this.newPartsList, data[2]);
                if (!_this.newPartsList.childList) {
                    _this.newPartsList.childList = [];
                }
                var childQty = 0;
                if (_this.newPartsList.childList != null && _this.newPartsList.childList.length > 0) {
                    for (var j = 0; j < _this.newPartsList.childList.length; j++) {
                        if (!_this.newPartsList.childList[j].isDeleted) {
                            childQty += _this.newPartsList.childList[j].quantityOrdered ? parseInt(_this.newPartsList.childList[j].quantityOrdered.toString().replace(/\,/g, '')) : 0;
                        }
                    }
                    var quantityOrdered = _this.newPartsList.quantityOrdered ? parseInt(_this.newPartsList.quantityOrdered.toString().replace(/\,/g, '')) : 0;
                    _this.newPartsList.remQty = quantityOrdered - childQty;
                }
                _this.getSubWOlsitId(_this.newPartsList, data[4]);
                _this.partListData.push(_this.newPartsList);
                if (_this.partListData.length > 0) {
                    _this.isEditModePart = true;
                }
                else {
                    _this.isEditModePart = false;
                }
                _this.getTotalExtCost();
                _this.getTotalDiscAmount();
            });
        }
        this.enableHeaderSaveBtn = false;
    };
    PurchaseSetupComponent.prototype.parsedText = function (text) {
        if (text) {
            var dom = new DOMParser().parseFromString('<!doctype html><body>' + text, 'text/html');
            var decodedString = dom.body.textContent;
            return decodedString;
        }
    };
    PurchaseSetupComponent.prototype.getPurchaseOrderSplitPartsEdit = function (partList, pindex, ms) {
        var _this = this;
        if (partList.purchaseOrderSplitParts) {
            return partList.purchaseOrderSplitParts.map(function (y, cindex) {
                var splitpart = __assign(__assign({}, y), { needByDate: y.needByDate ? new Date(y.needByDate) : '', isApproved: y.isApproved ? y.isApproved : false, partListUserTypeId: y.poPartSplitUserTypeId, poPartSplitSiteId: y.poPartSplitSiteId, priorityId: partList.priorityId ? autocomplete_1.getValueFromArrayOfObjectById('label', 'value', partList.priorityId, _this.allPriorityInfo) : null, partListUserId: _this.getPartSplitUserIdEdit(y, pindex, cindex), partListAddressId: y.poPartSplitAddressId ? y.poPartSplitAddressId : 0, quantityOrdered: y.quantityOrdered ? autocomplete_1.formatNumberAsGlobalSettingsModule(y.quantityOrdered, 0) : '0' });
                return splitpart;
            });
        }
    };
    PurchaseSetupComponent.prototype.getManagementStructureForChildPart = function (partChildList, response) {
        if (response) {
            var result = response[partChildList.purchaseOrderPartRecordId];
            if (result[0] && result[0].level == 'Level1') {
                partChildList.maincompanylist = result[0].lstManagmentStrcture;
                partChildList.childCompanyId = result[0].managementStructureId;
                partChildList.managementStructureId = result[0].managementStructureId;
                partChildList.childBulist = [];
                partChildList.childDivisionlist = [];
                partChildList.childDepartmentlist = [];
                partChildList.childbuId = 0;
                partChildList.childDivisionId = 0;
                partChildList.childDeptId = 0;
            }
            else {
                partChildList.maincompanylist = [];
                partChildList.childBulist = [];
                partChildList.childDivisionlist = [];
                partChildList.childDepartmentlist = [];
                partChildList.childCompanyId = 0;
                partChildList.childbuId = 0;
                partChildList.childDivisionId = 0;
                partChildList.childDeptId = 0;
            }
            if (result[1] && result[1].level == 'Level2') {
                partChildList.childBulist = result[1].lstManagmentStrcture;
                partChildList.managementStructureId = result[1].managementStructureId;
                partChildList.childbuId = result[1].managementStructureId;
                partChildList.childDivisionlist = [];
                partChildList.childDepartmentlist = [];
                partChildList.childDivisionId = 0;
                partChildList.childDeptId = 0;
            }
            else {
                if (result[1] && result[1].level == 'NEXT') {
                    partChildList.childBulist = result[1].lstManagmentStrcture;
                }
                partChildList.childDivisionlist = [];
                partChildList.childDepartmentlist = [];
                partChildList.childbuId = 0;
                partChildList.childDivisionId = 0;
                partChildList.childDeptId = 0;
            }
            if (result[2] && result[2].level == 'Level3') {
                partChildList.childDivisionlist = result[2].lstManagmentStrcture;
                partChildList.childDivisionId = result[2].managementStructureId;
                partChildList.managementStructureId = result[2].managementStructureId;
                partChildList.childDeptId = 0;
                partChildList.childDepartmentlist = [];
            }
            else {
                if (result[2] && result[2].level == 'NEXT') {
                    partChildList.childDivisionlist = result[2].lstManagmentStrcture;
                }
                partChildList.childDepartmentlist = [];
                partChildList.childDivisionId = 0;
                partChildList.childDeptId = 0;
            }
            if (result[3] && result[3].level == 'Level4') {
                partChildList.childDepartmentlist = result[3].lstManagmentStrcture;
                ;
                partChildList.childDeptId = result[3].managementStructureId;
                partChildList.managementStructureId = result[3].managementStructureId;
            }
            else {
                if (result[3] && result[3].level == 'NEXT') {
                    partChildList.childDepartmentlist = result[3].lstManagmentStrcture;
                }
                partChildList.childDeptId = 0;
            }
        }
    };
    PurchaseSetupComponent.prototype.getSubWOlsitId = function (parentdata, response) {
        var data1 = response[parentdata.purchaseOrderPartRecordId];
        if (data1) {
            if (data1[0]) {
                //parentdata.subWorkOrderlist = data1[0];
                var data = data1.map(function (x) {
                    return {
                        value: x.subWorkOrderId,
                        label: x.subWorkOrderNo
                    };
                });
                this.allsubWorkOrderInfo = [
                    { value: 0, label: '-- Select --' }
                ];
                parentdata.subWorkOrderlist = __spreadArrays(this.allsubWorkOrderInfo, data);
                parentdata.subWorkOrderId = autocomplete_1.getObjectByValue('value', parentdata.subWorkOrderId == null ? 0 : parentdata.subWorkOrderId, parentdata.subWorkOrderlist);
            }
        }
    };
    PurchaseSetupComponent.prototype.getPartItemDetailsById = function (parentdata, response) {
        this.showInput = true;
        var itemMasterId = autocomplete_1.getValueFromObjectByKey('value', parentdata.partNumberId);
        this.sourcePoApproval.itemMasterId = itemMasterId;
        this.partWithId = [];
        this.altPartNumList = [];
        //parentdata.altEquiPartNumberId = null;
        this.itemTypeId = 1;
        var data1 = response[parentdata.purchaseOrderPartRecordId];
        if (data1) {
            if (data1[0]) {
                this.partWithId = data1[0];
                parentdata.partId = this.partWithId.itemMasterId;
                parentdata.partDescription = this.partWithId.partDescription;
                parentdata.minimumOrderQuantity = this.partWithId.minimumOrderQuantity;
                parentdata.itemTypeId = this.partWithId.itemTypeId;
                parentdata.stockType = this.partWithId.stockType;
                parentdata.manufacturerId = this.partWithId.manufacturerId;
                parentdata.manufacturerName = this.partWithId.name;
                parentdata.glAccountId = this.partWithId.glAccountId;
                parentdata.glAccountName = this.partWithId.glAccount;
                parentdata.UOMId = this.partWithId.purchaseUnitOfMeasureId;
                parentdata.UOMShortName = this.partWithId.shortName;
                parentdata.partNumber = this.partWithId.partNumber;
                parentdata.itemMasterId = this.partWithId.itemMasterId;
                parentdata.altPartCollection = this.partWithId.altPartNumList.map(function (x) {
                    return { value: x.altEquiPartNumberId, label: x.altEquiPartNumber };
                });
                this.altPartNumList = this.partWithId.altPartNumList;
                if (parentdata.altEquiPartNumberId) {
                    parentdata.altEquiPartNumberId = autocomplete_1.getObjectById('value', parentdata.altEquiPartNumberId, parentdata.altPartCollection);
                }
                else if (this.altPartNumList.length > 0) {
                    parentdata.altEquiPartNumberId = parentdata.altPartCollection[0];
                }
            }
        }
    };
    PurchaseSetupComponent.prototype.getFunctionalReportCurrencyforPart = function (partList, responseFC) {
        if (partList.managementStructureId != null && partList.managementStructureId != 0) {
            if (responseFC) {
                var result = responseFC[partList.managementStructureId];
                partList.functionalCurrencyId = {
                    label: result.functionalCurrencyCode,
                    value: result.functionalCurrencyId
                };
                partList.reportCurrencyId = {
                    label: result.reportingCurrencyCode,
                    value: result.reportingCurrencyId
                };
                this.getFXRate(partList);
            }
        }
    };
    PurchaseSetupComponent.prototype.getManagementStructureForParentPart = function (partList, response, responseFC) {
        if (response) {
            var result = response[partList.purchaseOrderPartRecordId];
            if (result[0] && result[0].level == 'Level1') {
                partList.maincompanylist = result[0].lstManagmentStrcture;
                partList.parentCompanyId = result[0].managementStructureId;
                partList.managementStructureId = result[0].managementStructureId;
                partList.parentBulist = [];
                partList.parentDivisionlist = [];
                partList.parentDepartmentlist = [];
                partList.parentbuId = 0;
                partList.parentDivisionId = 0;
                partList.parentDeptId = 0;
            }
            else {
                partList.parentCompanyId = 0;
                partList.parentbuId = 0;
                partList.parentDivisionId = 0;
                partList.parentDeptId = 0;
                partList.maincompanylist = [];
                partList.parentBulist = [];
                partList.parentDivisionlist = [];
                partList.parentDepartmentlist = [];
            }
            if (result[1] && result[1].level == 'Level2') {
                partList.parentBulist = result[1].lstManagmentStrcture;
                partList.parentbuId = result[1].managementStructureId;
                partList.managementStructureId = result[1].managementStructureId;
                partList.parentDivisionlist = [];
                partList.parentDepartmentlist = [];
                partList.parentDivisionId = 0;
                partList.parentDeptId = 0;
            }
            else {
                if (result[1] && result[1].level == 'NEXT') {
                    partList.parentBulist = result[1].lstManagmentStrcture;
                }
                partList.parentbuId = 0;
                partList.parentDivisionId = 0;
                partList.parentDeptId = 0;
                partList.parentDivisionlist = [];
                partList.parentDepartmentlist = [];
            }
            if (result[2] && result[2].level == 'Level3') {
                partList.parentDivisionlist = result[2].lstManagmentStrcture;
                partList.parentDivisionId = result[2].managementStructureId;
                partList.managementStructureId = result[2].managementStructureId;
                partList.parentDeptId = 0;
                partList.parentDepartmentlist = [];
            }
            else {
                if (result[2] && result[2].level == 'NEXT') {
                    partList.parentDivisionlist = result[2].lstManagmentStrcture;
                }
                partList.parentDivisionId = 0;
                partList.parentDeptId = 0;
                partList.parentDepartmentlist = [];
            }
            if (result[3] && result[3].level == 'Level4') {
                partList.parentDepartmentlist = result[3].lstManagmentStrcture;
                ;
                partList.parentDeptId = result[3].managementStructureId;
                partList.managementStructureId = result[3].managementStructureId;
            }
            else {
                partList.parentDeptId = 0;
                if (result[3] && result[3].level == 'NEXT') {
                    partList.parentDepartmentlist = result[3].lstManagmentStrcture;
                }
            }
        }
        this.getFunctionalReportCurrencyforPart(partList, responseFC);
    };
    PurchaseSetupComponent.prototype.getPartSplitUserIdEdit = function (data, pindex, cindex) {
        if (data.poPartSplitUserTypeId === this.customerModuleId) {
            this.onUserNameChange(this.customerModuleId, data.poPartSplitUserId, data, pindex, cindex);
            return autocomplete_1.getObjectById('value', data.poPartSplitUserId, this.allCustomers);
        }
        if (data.poPartSplitUserTypeId === this.vendorModuleId) {
            this.onUserNameChange(this.vendorModuleId, data.poPartSplitUserId, data, pindex, cindex);
            return autocomplete_1.getObjectById('vendorId', data.poPartSplitUserId, this.allActions);
        }
        if (data.poPartSplitUserTypeId === this.companyModuleId) {
            this.onUserNameChange(this.companyModuleId, data.poPartSplitUserId, data, pindex, cindex);
            return autocomplete_1.getObjectById('value', data.poPartSplitUserId, this.legalEntity);
        }
    };
    PurchaseSetupComponent.prototype.onUserNameChange = function (moduleID, userID, data, pindex, cindex, siteID) {
        var _this = this;
        if (moduleID == this.vendorModuleId) {
            this.arrayVendlsit.push(userID);
            pindex;
        }
        else if (moduleID == this.customerModuleId) {
            this.arrayCustlist.push(userID);
        }
        else if (moduleID == this.companyModuleId) {
            this.arrayLegalEntitylsit.push(userID);
        }
        this.commonService.getaddressdetailsOnlyUserbyuser(moduleID, userID, 'Ship', this.poId).subscribe(function (returnddataforbill) {
            if (returnddataforbill) {
                _this["splitAddressData" + pindex + cindex] = [];
                _this["splitAddressData" + pindex + cindex] = returnddataforbill.address;
                if (!data || data == null) {
                    if (returnddataforbill.address && returnddataforbill.address.length > 0) {
                        for (var i = 0; i < returnddataforbill.address.length; i++) {
                            if (returnddataforbill.address[i].isPrimary) {
                                _this.partListData[pindex].childList[cindex].poPartSplitSiteId = returnddataforbill.address[i].siteID;
                            }
                        }
                    }
                }
                if (siteID && siteID > 0) {
                    _this.partListData[pindex].childList[cindex].poPartSplitSiteId = siteID;
                }
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.getPNDetailsById = function (parentdata, value) {
        var _this = this;
        this.showInput = true;
        var itemMasterId = autocomplete_1.getValueFromObjectByKey('value', parentdata.partNumberId);
        this.sourcePoApproval.itemMasterId = itemMasterId;
        this.partWithId = [];
        this.altPartNumList = [];
        parentdata.altEquiPartNumberId = null;
        if (value != 'onEdit') {
            parentdata.needByDate = this.headerInfo.needByDate;
            parentdata.conditionId = this.defaultCondtionId;
            parentdata.priorityId = this.headerInfo.priorityId ? autocomplete_1.editValueAssignByCondition('value', this.headerInfo.priorityId) : null;
            parentdata.quantityOrdered = '0';
            //parentdata.workOrderId = null;
            //parentdata.repairOrderId = null;
            //parentdata.salesOrderId = null;
            parentdata.memo = null;
            //this.getManagementStructureForParentEdit(parentdata,this.employeeId);
        }
        this.itemTypeId = 1;
        //For Getting Data After Part Selected
        this.purchaseOrderService.getPartDetailsWithidForSinglePart(itemMasterId).subscribe(function (data1) {
            if (data1[0]) {
                _this.partWithId = data1[0];
                parentdata.partId = _this.partWithId.itemMasterId;
                parentdata.minimumOrderQuantity = _this.partWithId.minimumOrderQuantity;
                parentdata.partDescription = _this.partWithId.partDescription;
                parentdata.itemTypeId = _this.partWithId.itemTypeId;
                parentdata.stockType = _this.partWithId.stockType;
                parentdata.manufacturerId = _this.partWithId.manufacturerId;
                parentdata.manufacturerName = _this.partWithId.name;
                parentdata.glAccountId = _this.partWithId.glAccountId;
                parentdata.glAccountName = _this.partWithId.glAccount;
                parentdata.UOMId = _this.partWithId.purchaseUnitOfMeasureId;
                parentdata.UOMShortName = _this.partWithId.shortName;
                parentdata.partNumber = _this.partWithId.partNumber;
                parentdata.itemMasterId = _this.partWithId.itemMasterId;
                parentdata.altPartCollection = _this.partWithId.altPartNumList.map(function (x) {
                    return { value: x.altEquiPartNumberId, label: x.altEquiPartNumber };
                });
                if (parentdata.conditionId && value != 'onEdit') {
                    _this.getPriceDetailsByCondId(parentdata);
                }
                _this.altPartNumList = _this.partWithId.altPartNumList;
                if (parentdata.altEquiPartNumberId && value == 'onEdit') {
                    parentdata.altEquiPartNumberId = autocomplete_1.getObjectById('value', parentdata.altEquiPartNumberId, parentdata.altPartCollection);
                }
                else if (_this.altPartNumList.length > 0) {
                    parentdata.altEquiPartNumberId = parentdata.altPartCollection[0];
                }
            }
        }, function (err) {
        });
    };
    PurchaseSetupComponent.prototype.getPriceDetailsByCondId = function (parentdata) {
        var _this = this;
        this.commonService.getPriceDetailsByCondId(parentdata.itemMasterId, parentdata.conditionId).subscribe(function (res) {
            if (res) {
                parentdata.vendorListPrice = res.vendorListPrice ? autocomplete_1.formatNumberAsGlobalSettingsModule(res.vendorListPrice, 2) : '0.00';
                parentdata.unitCost = res.unitCost ? autocomplete_1.formatNumberAsGlobalSettingsModule(res.unitCost, 2) : '0.00';
                parentdata.discountPercent = res.discountPercent ? res.discountPercent : 0;
                parentdata.discountPerUnit = res.discountPerUnit ? autocomplete_1.formatNumberAsGlobalSettingsModule(res.discountPerUnit, 2) : '0.00';
                _this.onGetDiscPerUnit(parentdata);
                _this.onGetDiscAmount(parentdata);
                _this.onGetExtCost(parentdata);
            }
        });
    };
    PurchaseSetupComponent.prototype.onGetDiscPerUnit = function (partList) {
        if (partList.vendorListPrice !== null && partList.vendorListPrice !== 0) {
            var discountPercentValue = void 0;
            if (partList.discountPercent !== 0 && partList.discountPercent != null) {
                discountPercentValue = parseFloat(autocomplete_1.getValueFromArrayOfObjectById('percentValue', 'percentId', partList.discountPercent, this.allPercentData));
            }
            else {
                discountPercentValue = 0;
            }
            var vendorListPrice = partList.vendorListPrice ? parseFloat(partList.vendorListPrice.toString().replace(/\,/g, '')) : 0;
            var discountPerUnit = (vendorListPrice * discountPercentValue) / 100;
            partList.discountPerUnit = autocomplete_1.formatNumberAsGlobalSettingsModule(discountPerUnit, 2);
        }
        partList.quantityOrdered = partList.quantityOrdered ? autocomplete_1.formatNumberAsGlobalSettingsModule(partList.quantityOrdered, 0) : '0';
        this.onGetUnitCost(partList);
        partList.vendorListPrice = partList.vendorListPrice ? autocomplete_1.formatNumberAsGlobalSettingsModule(partList.vendorListPrice, 2) : '0.00';
    };
    PurchaseSetupComponent.prototype.onGetUnitCost = function (partList) {
        if (partList.vendorListPrice !== null && partList.vendorListPrice !== undefined) {
            var vendorListPrice = partList.vendorListPrice ? parseFloat(partList.vendorListPrice.toString().replace(/\,/g, '')) : 0;
            var discountPerUnit = partList.discountPerUnit ? parseFloat(partList.discountPerUnit.toString().replace(/\,/g, '')) : 0;
            var unitCost = (vendorListPrice - discountPerUnit);
            partList.unitCost = autocomplete_1.formatNumberAsGlobalSettingsModule(unitCost, 2);
        }
    };
    PurchaseSetupComponent.prototype.onGetDiscAmount = function (partList) {
        if (partList.discountPerUnit !== null && partList.quantityOrdered !== null) {
            var discountPerUnit = partList.discountPerUnit ? parseFloat(partList.discountPerUnit.toString().replace(/\,/g, '')) : 0;
            var quantityOrdered = partList.quantityOrdered ? parseInt(partList.quantityOrdered.toString().replace(/\,/g, '')) : 0;
            var discountAmount = (discountPerUnit * quantityOrdered);
            partList.discountAmount = autocomplete_1.formatNumberAsGlobalSettingsModule(discountAmount, 2);
        }
        this.onGetExtCost(partList);
        partList.discountPerUnit = partList.discountPerUnit ? autocomplete_1.formatNumberAsGlobalSettingsModule(partList.discountPerUnit, 2) : '0.00';
        this.getTotalDiscAmount();
    };
    PurchaseSetupComponent.prototype.getTotalDiscAmount = function () {
        var _this = this;
        this.totalDiscAmount = 0;
        this.partListData.map(function (x) {
            x.tempDiscAmt = x.discountAmount ? parseFloat(x.discountAmount.toString().replace(/\,/g, '')) : 0;
            _this.totalDiscAmount = parseFloat(_this.totalDiscAmount) + parseFloat(x.tempDiscAmt);
            _this.totalDiscAmount = _this.totalDiscAmount ? autocomplete_1.formatNumberAsGlobalSettingsModule(_this.totalDiscAmount, 2) : '0.00';
        });
    };
    PurchaseSetupComponent.prototype.onGetExtCost = function (partList) {
        this.onGetUnitCost(partList);
        if (partList.quantityOrdered !== null && partList.unitCost !== null) {
            var quantityOrdered = partList.quantityOrdered ? parseInt(partList.quantityOrdered.toString().replace(/\,/g, '')) : 0;
            var unitCost = partList.unitCost ? parseFloat(partList.unitCost.toString().replace(/\,/g, '')) : 0;
            // partList.extendedCost = (partList.quantityOrdered * partList.unitCost);
            partList.extendedCost = (quantityOrdered * unitCost);
            partList.extendedCost = autocomplete_1.formatNumberAsGlobalSettingsModule(partList.extendedCost, 2);
        }
        this.getTotalExtCost();
    };
    PurchaseSetupComponent.prototype.getTotalExtCost = function () {
        var _this = this;
        this.totalExtCost = 0;
        this.partListData.map(function (x) {
            x.tempExtCost = x.extendedCost ? parseFloat(x.extendedCost.toString().replace(/\,/g, '')) : 0;
            _this.totalExtCost += x.tempExtCost;
        });
        this.totalExtCost = this.totalExtCost ? autocomplete_1.formatNumberAsGlobalSettingsModule(this.totalExtCost, 2) : '0.00';
    };
    PurchaseSetupComponent.prototype.getVendorContactsListByIDEdit = function (res) {
        var _this = this;
        this.vendorContactList = [];
        this.warningsandRestriction(res.vendorId);
        this.vendorService.getVendorContactDataByVendorId(res.vendorId).subscribe(function (data) {
            _this.vendorContactList = data;
            var isContact = _this.vendorContactList.filter(function (x) {
                if (x.vendorContactId === res.vendorContactId) {
                    return x;
                }
            });
            _this.headerInfo.vendorContactId = isContact[0];
            _this.headerInfo.vendorContactPhone = isContact[0];
            _this.getVendorCreditTermsByID(res.vendorId);
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.getApproversListById = function (poId) {
        var _this = this;
        this.isSpinnerVisible = true;
        if (this.poApprovaltaskId == 0) {
            this.commonService.smartDropDownList('ApprovalTask', 'ApprovalTaskId', 'Name').subscribe(function (response) {
                if (response) {
                    response.forEach(function (x) {
                        if (x.label.toUpperCase() == "PO APPROVAL") {
                            _this.poApprovaltaskId = x.value;
                        }
                    });
                    _this.getApproversByTask(poId);
                }
            }, function (err) {
                _this.isSpinnerVisible = false;
            });
        }
        else {
            this.getApproversByTask(poId);
        }
    };
    PurchaseSetupComponent.prototype.getApproversByTask = function (poId) {
        var _this = this;
        this.isSpinnerVisible = true;
        this.purchaseOrderService.approverslistbyTaskId(this.poApprovaltaskId, poId).subscribe(function (res) {
            _this.internalApproversList = res;
            _this.internalApproversList.map(function (x) {
                _this.apporoverEmailList = x.approverEmails;
                _this.apporoverNamesList.push(x.approverName);
            });
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.getApprovalProcessListById = function (poId) {
        var _this = this;
        this.isSpinnerVisible = true;
        this.selectallApprovers = false;
        this.enableApproverSaveBtn = false;
        this.purchaseOrderService.getPOApprovalListById(poId).subscribe(function (res) {
            var arrayLen = res.length;
            var count = 0;
            _this.approvalProcessList = res.map(function (x) {
                if (x.actionId == _this.ApprovedstatusId) {
                    count++;
                }
                if (count == arrayLen) {
                    _this.disableApproverSelectAll = true;
                }
                return __assign(__assign({}, x), { sentDate: x.sentDate ? new Date(x.sentDate) : null, approvedDate: x.approvedDate ? new Date(x.approvedDate) : null, previousstatusId: x.statusId, unitCost: x.unitCost ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00', extCost: x.extCost ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.extCost, 2) : '0.00' });
            });
            if (_this.approvalProcessList && _this.approvalProcessList.length > 0) {
                var approvalProcessListWithChild = [];
                _this.approvalProcessList = _this.approvalProcessList.forEach(function (element) {
                    if (element.isParent) {
                        approvalProcessListWithChild.push(element);
                        _this.approvalProcessList.filter(function (x) { return x.parentId == element.purchaseOrderPartId; }).forEach(function (child) {
                            if (child) {
                                approvalProcessListWithChild.push(child);
                            }
                        });
                    }
                });
                _this.approvalProcessList = approvalProcessListWithChild;
            }
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.onDataLoadVendorCapsSuccessful = function (allWorkFlows) {
        this.vendorCapesInfo = allWorkFlows.map(function (x) {
            return __assign(__assign({}, x), { cost: x.cost ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.cost, 2) : '0.00' });
        });
        this.isSpinnerVisible = false;
    };
    PurchaseSetupComponent.prototype.onChangeTabView = function (event) {
        if (event.index == 0) {
            this.getPurchaseOrderAllPartsById(this.poId);
            this.enablePartSaveBtn = false;
        }
        if (event.index == 1) {
            this.showAddresstab = true;
        }
        if (event.index == 2 && this.posettingModel.IsEnforceApproval) {
            this.getApproversListById(this.poId);
        }
        if (event.index == 3 && this.posettingModel.IsEnforceApproval) {
            this.getApproversListById(this.poId);
            this.getApprovalProcessListById(this.poId);
            this.enableApproverSaveBtn = false;
        }
        if (event.index == 4 && this.posettingModel.IsEnforceApproval) {
            this.showVendorCaptab = true;
            var id = autocomplete_1.editValueAssignByCondition('vendorId', this.headerInfo.vendorId);
        }
        if (event.index == 5 && this.posettingModel.IsEnforceApproval) {
            this.showDocumenttab = true;
        }
        if (event.index == 6 && this.posettingModel.IsEnforceApproval) {
            this.showComunicationtab = true;
        }
        if (event.index == 2 && !this.posettingModel.IsEnforceApproval) {
            this.showVendorCaptab = true;
            var id = autocomplete_1.editValueAssignByCondition('vendorId', this.headerInfo.vendorId);
        }
        if (event.index == 3 && !this.posettingModel.IsEnforceApproval) {
            this.showDocumenttab = true;
        }
        if (event.index == 4 && !this.posettingModel.IsEnforceApproval) {
            this.showComunicationtab = true;
        }
    };
    PurchaseSetupComponent.prototype.employeedata = function (strText, manStructID) {
        var _this = this;
        if (strText === void 0) { strText = ''; }
        if (manStructID === void 0) { manStructID = 0; }
        if (this.arrayEmplsit.length == 0) {
            this.arrayEmplsit.push(0);
        }
        this.arrayEmplsit.push(this.employeeId == null ? 0 : this.employeeId);
        this.commonService.autoCompleteDropdownsEmployeeByMS(strText, true, 20, this.arrayEmplsit.join(), manStructID, this.currentUserMasterCompanyId).subscribe(function (res) {
            _this.allEmployeeList = res;
            _this.requisitionerList = res;
            _this.currentUserEmployeeName = autocomplete_1.getValueFromArrayOfObjectById('label', 'value', _this.employeeId, res);
            if (_this.isheaderEmployee) {
                _this.headerInfo.requisitionerId = autocomplete_1.getObjectById('value', _this.headerInfo.requestedBy, _this.allEmployeeList);
                _this.isheaderEmployee = false;
            }
            if (!_this.isEditMode) {
                _this.getRequisitionerOnLoad(_this.employeeId);
            }
        }, function (err) {
        });
    };
    PurchaseSetupComponent.prototype.getRequisitionerOnLoad = function (id) {
        this.headerInfo.requisitionerId = autocomplete_1.getObjectById('value', id, this.allEmployeeList);
    };
    PurchaseSetupComponent.prototype.getLegalEntity = function (strText) {
        var _this = this;
        if (strText === void 0) { strText = ''; }
        if (this.arrayLegalEntitylsit.length == 0) {
            this.arrayLegalEntitylsit.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name', strText, true, 20, this.arrayLegalEntitylsit.join(), this.currentUserMasterCompanyId).subscribe(function (res) {
            _this.legalEntity = res;
            _this.legalEntityList_Forgrid = res;
            _this.legalEntityList_ForShipping = res;
            _this.legalEntityList_ForBilling = res;
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.getCountriesList = function () {
        var _this = this;
        this.commonService.smartDropDownList('Countries', 'countries_id', 'nice_name').subscribe(function (res) {
            _this.allCountriesList = res;
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.filterCompanyNameforgrid = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.getLegalEntity(event.query);
        }
    };
    PurchaseSetupComponent.prototype.priorityData = function (strText) {
        var _this = this;
        if (strText === void 0) { strText = ''; }
        if (this.arrayPrioritylist.length == 0) {
            this.arrayPrioritylist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Priority', 'PriorityId', 'Description', strText, true, 0, this.arrayPrioritylist.join(), this.currentUserMasterCompanyId).subscribe(function (res) {
            _this.allPriorityInfo = res;
            _this.allPriorityInfo.map(function (x) {
                if (x.label == 'Routine') {
                    _this.headerInfo.priorityId = x;
                }
            });
            _this.onSelectPriority();
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.loadWorkOrderList = function (filterVal) {
        var _this = this;
        if (filterVal === void 0) { filterVal = ''; }
        if (this.lsWoId != undefined && this.lsWoId != null) {
            this.arrayWOlist.push(this.lsWoId);
        }
        else {
            if (this.arrayWOlist.length == 0) {
                this.arrayWOlist.push(0);
            }
        }
        this.commonService.getWODataFilter(filterVal, 20, this.arrayWOlist.join(), this.currentUserMasterCompanyId).subscribe(function (res) {
            var data = res.map(function (x) {
                return {
                    value: x.workOrderId,
                    label: x.workOrderNum
                };
            });
            _this.allWorkOrderInfo = [
                { value: 0, label: '-- Select --' }
            ];
            _this.allWorkOrderInfo = __spreadArrays(_this.allWorkOrderInfo, data);
            _this.allWorkOrderDetails = __spreadArrays(_this.allWorkOrderInfo, data);
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.loadSubWorkOrderList = function (filterVal, workOrderId, partList, index) {
        var _this = this;
        if (this.arraysubWOlist.length == 0) {
            this.arraysubWOlist.push(0);
        }
        // this.commonService.getsubWODataFilter(filterVal, 20, this.arraysubWOlist.join()).subscribe(res => {
        this.commonService.GetSubWolist(workOrderId.value).subscribe(function (res) {
            var data = res.map(function (x) {
                return {
                    value: x.subWorkOrderId,
                    label: x.subWorkOrderNo
                };
            });
            _this.allsubWorkOrderInfo = [
                { value: 0, label: '-- Select --' }
            ];
            //this.allsubWorkOrderInfo = [...this.allsubWorkOrderInfo, ...data];
            _this.allsubWorkOrderDetails = __spreadArrays(_this.allsubWorkOrderInfo, data);
            partList.subWorkOrderlist = __spreadArrays(_this.allsubWorkOrderInfo, data);
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.loadRepairOrderList = function (filterVal) {
        var _this = this;
        if (filterVal === void 0) { filterVal = ''; }
        if (this.arrayROlist.length == 0) {
            this.arrayROlist.push(0);
        }
        this.commonService.getRODataFilter(filterVal, 20, this.arrayROlist.join(), this.currentUserMasterCompanyId).subscribe(function (res) {
            var data = res.map(function (x) {
                return {
                    value: x.repairOrderId,
                    label: x.repairOrderNumber
                };
            });
            _this.allRepairOrderInfo = [
                { value: 0, label: '-- Select --' }
            ];
            _this.allRepairOrderInfo = __spreadArrays(_this.allRepairOrderInfo, data);
            _this.allRepairOrderDetails = __spreadArrays(_this.allRepairOrderInfo, data);
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.loadSalesOrderList = function (filterVal) {
        var _this = this;
        if (filterVal === void 0) { filterVal = ''; }
        if (this.salesOrderId != undefined && this.salesOrderId != null) {
            this.arraySOlist.push(this.salesOrderId);
        }
        else {
            if (this.arraySOlist.length == 0) {
                this.arraySOlist.push(0);
            }
        }
        this.commonService.getSODataFilter(filterVal, 20, this.arraySOlist.join(), this.currentUserMasterCompanyId).subscribe(function (res) {
            var data = res.map(function (x) {
                return {
                    value: x.salesOrderId,
                    label: x.salesOrderNumber
                };
            });
            _this.allSalesOrderInfo = [
                { value: 0, label: '-- Select --' }
            ];
            _this.allSalesOrderInfo = __spreadArrays(_this.allSalesOrderInfo, data);
            _this.allSalesOrderDetails = __spreadArrays(_this.allSalesOrderInfo, data);
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    Object.defineProperty(PurchaseSetupComponent.prototype, "userName", {
        get: function () {
            return this.authService.currentUser ? this.authService.currentUser.userName : "";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PurchaseSetupComponent.prototype, "currentUserManagementStructureId", {
        get: function () {
            return this.authService.currentUser
                ? this.authService.currentUser.managementStructureId
                : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PurchaseSetupComponent.prototype, "currentUserMasterCompanyId", {
        get: function () {
            return this.authService.currentUser
                ? this.authService.currentUser.masterCompanyId
                : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PurchaseSetupComponent.prototype, "employeeId", {
        get: function () {
            return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
        },
        enumerable: false,
        configurable: true
    });
    PurchaseSetupComponent.prototype.editDropDownLoad = function () {
        this.loadVendorList('');
        this.priorityData();
        this.loadPOStatus();
        this.loadCurrencyData();
        this.loadConditionData();
        this.loadApprovalProcessStatus();
        this.loadPOApproverStatus();
        this.loadcustomerData();
        this.getLegalEntity();
        this.getCountriesList();
        this.loadPercentData();
        this.loadWorkOrderList();
        this.loadRepairOrderList();
        this.loadSalesOrderList();
        this.loapartItems();
        this.loadModuleListForVendorComp();
    };
    PurchaseSetupComponent.prototype.savePurchaseOrderHeader = function () {
        var _this = this;
        if (this.createPOForm.invalid ||
            this.headerInfo.companyId == 0
            || this.headerInfo.companyId == null) {
            this.alertService.showMessage('Purchase Order', "Please enter required highlighted fields for PO Header!", alert_service_1.MessageSeverity.error);
            this.inputValidCheckHeader = true;
            if (this.headerInfo.companyId == null || this.headerInfo.companyId == 0) {
                this.managementValidCheck = true;
            }
        }
        else {
            this.isSpinnerVisible = true;
            var headerInfoObj = {
                purchaseOrderNumber: this.headerInfo.purchaseOrderNumber,
                priorityId: this.headerInfo.priorityId ? this.getPriorityId(this.headerInfo.priorityId) : 0,
                Priority: this.headerInfo.priorityId && this.headerInfo.priorityId.label
                    && this.headerInfo.priorityId.label != null && this.headerInfo.priorityId.label != undefined ? this.headerInfo.priorityId.label : '',
                openDate: new Date(this.headerInfo.openDate),
                needByDate: new Date(this.headerInfo.needByDate),
                statusId: this.headerInfo.statusId ? this.headerInfo.statusId : 0,
                Status: this.headerInfo.statusId && this.headerInfo.statusId > 0 ? autocomplete_1.getValueFromArrayOfObjectById('label', 'value', this.headerInfo.statusId, this.poStatusList) : '',
                vendorId: this.headerInfo.vendorId ? this.getVendorId(this.headerInfo.vendorId) : 0,
                VendorName: this.headerInfo.vendorId && this.headerInfo.vendorId.vendorName
                    && this.headerInfo.vendorId.vendorName != null && this.headerInfo.vendorId.vendorName != undefined ? this.headerInfo.vendorId.vendorName : '',
                VendorCode: this.headerInfo.vendorId && this.headerInfo.vendorId.vendorCode
                    && this.headerInfo.vendorId.vendorCode != null && this.headerInfo.vendorId.vendorCode != undefined ? this.headerInfo.vendorId.vendorCode : '',
                vendorContactId: this.headerInfo.vendorContactId ? this.getVendorContactId(this.headerInfo.vendorContactId) : 0,
                VendorContact: this.headerInfo.vendorContactId && this.headerInfo.vendorContactId.vendorContact
                    && this.headerInfo.vendorContactId.vendorContact != null && this.headerInfo.vendorContactId.vendorContact != undefined ? this.headerInfo.vendorContactId.vendorContact : '',
                vendorContactPhone: this.headerInfo.vendorContactId && this.headerInfo.vendorContactId.fullContactNo
                    && this.headerInfo.vendorContactId.fullContactNo != null && this.headerInfo.vendorContactId.fullContactNo != undefined ? this.headerInfo.vendorContactId.fullContactNo : '',
                creditTermsId: this.headerInfo.creditTermsId ? this.headerInfo.creditTermsId : 0,
                Terms: this.headerInfo.creditTerms ? this.headerInfo.creditTerms : '',
                creditLimit: this.headerInfo.creditLimit ? parseFloat(this.headerInfo.creditLimit.toString().replace(/\,/g, '')) : '0.00',
                RequestedBy: this.headerInfo.requisitionerId ? this.getEmployeeId(this.headerInfo.requisitionerId) : 0,
                Requisitioner: this.headerInfo.requisitionerId && this.headerInfo.requisitionerId.label
                    && this.headerInfo.requisitionerId.label != null && this.headerInfo.requisitionerId.label != undefined ? this.headerInfo.requisitionerId.label : '',
                closedDate: this.datePipe.transform(this.headerInfo.closedDate, "MM/dd/yyyy"),
                approverId: this.headerInfo.approverId ? this.getEmployeeId(this.headerInfo.approverId) : 0,
                approvedDate: this.headerInfo.approvedDate,
                deferredReceiver: this.headerInfo.deferredReceiver ? this.headerInfo.deferredReceiver : false,
                resale: this.headerInfo.resale ? this.headerInfo.resale : false,
                poMemo: this.headerInfo.poMemo ? this.headerInfo.poMemo : '',
                notes: this.headerInfo.notes ? this.headerInfo.notes : '',
                managementStructureId: this.headerInfo.managementStructureId ? this.headerInfo.managementStructureId : 0,
                masterCompanyId: this.currentUserMasterCompanyId,
                createdDate: this.headerInfo.createdDate,
                createdBy: this.headerInfo.createdBy ? this.headerInfo.createdBy : this.userName,
                updatedBy: this.headerInfo.updatedBy ? this.headerInfo.updatedBy : this.userName
            };
            if (!this.isEditModeHeader) {
                this.purchaseOrderService.savePurchaseOrderHeader(__assign({}, headerInfoObj)).subscribe(function (saveddata) {
                    _this.purchaseOrderId = saveddata.purchaseOrderId;
                    _this.poId = saveddata.purchaseOrderId;
                    _this.headerInfo.purchaseOrderNumber = saveddata.purchaseOrderNumber;
                    _this.isSpinnerVisible = false;
                    _this.enableHeaderSaveBtn = false;
                    _this.alertService.showMessage('Success', "Saved PO Header Successfully", alert_service_1.MessageSeverity.success);
                    _this.route.navigate(['/vendorsmodule/vendorpages/app-purchase-setup/edit/' + _this.poId]);
                    if (_this.poId) {
                        _this.isEditModeHeader = true;
                        //this.isEditMode = true;
                    }
                    _this.isSpinnerVisible = false;
                }, function (err) {
                    _this.isSpinnerVisible = false;
                    _this.toggle_po_header = true;
                    _this.enableHeaderSaveBtn = true;
                });
            }
            else {
                headerInfoObj.updatedBy = this.userName;
                var poHeaderEdit = __assign(__assign({}, headerInfoObj), { purchaseOrderId: parseInt(this.poId) });
                this.purchaseOrderService.savePurchaseOrderHeader(__assign({}, poHeaderEdit)).subscribe(function (saveddata) {
                    _this.purchaseOrderId = saveddata.purchaseOrderId;
                    _this.poId = saveddata.purchaseOrderId;
                    _this.headerInfo.purchaseOrderNumber = saveddata.purchaseOrderNumber;
                    _this.isEditMode = true;
                    _this.isSpinnerVisible = false;
                    _this.enableHeaderSaveBtn = false;
                    _this.alertService.showMessage('Success', "Updated PO Header Successfully", alert_service_1.MessageSeverity.success);
                }, function (err) {
                    _this.isSpinnerVisible = false;
                    _this.toggle_po_header = true;
                    _this.enableHeaderSaveBtn = true;
                });
            }
            this.toggle_po_header = false;
            this.enableHeaderSaveBtn = false;
            if (this.posettingModel.IsEnforceApproval) {
                this.disablePOStatus = true;
            }
            else {
                if (headerInfoObj.openDate
                    && this.posettingModel.effectivedate
                    && new Date(headerInfoObj.openDate) > new Date(this.posettingModel.effectivedate)) {
                    this.posettingModel.IsEnforceApproval = false;
                    this.disablePOStatus = false;
                }
                else if (headerInfoObj.openDate
                    && this.posettingModel.effectivedate
                    && new Date(headerInfoObj.openDate) < new Date(this.posettingModel.effectivedate)) {
                    this.posettingModel.IsEnforceApproval = true;
                    this.disablePOStatus = true;
                }
                else {
                    this.disablePOStatus = true;
                }
            }
        }
    };
    PurchaseSetupComponent.prototype.dismissModel = function (status) {
        this.displayWarningModal = status;
        this.modal.close();
        if (status)
            this.savePurchaseOrderPartsList('');
    };
    PurchaseSetupComponent.prototype.savePurchaseOrderPartsList = function (content) {
        var _this = this;
        this.isSpinnerVisible = true;
        this.parentObjectArray = [];
        var errmessage = '';
        this.msgflag = 0;
        for (var i = 0; i < this.partListData.length; i++) {
            this.alertService.resetStickyMessage();
            // if(this.partListData[i].quantityOrdered == 0) {	
            // 	this.isSpinnerVisible = false;	
            // 	errmessage = errmessage + '<br />' + "Please Enter Qty."
            // }
            if (this.partListData[i].quantityOrdered == 0) {
                this.isSpinnerVisible = false;
                this.displayWarningModal = false;
                this.alertText = 'Part No: ' + this.getPartnumber(this.partListData[i].itemMasterId) + '<br/>' + "Please Enter Qty.";
                this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
                return;
            }
            if (this.partListData[i].workOrderId) {
                if (this.partListData[i].workOrderId.value != 0) {
                    if (this.partListData[i].repairOrderId) {
                        if (this.partListData[i].repairOrderId.value != 0) {
                            this.isSpinnerVisible = false;
                            errmessage = errmessage + '<br />' + "Work Order already selected please unselect Repair Order.";
                            this.msgflag = 1;
                        }
                    }
                    if (this.partListData[i].salesOrderId) {
                        if (this.partListData[i].salesOrderId.value != 0) {
                            this.isSpinnerVisible = false;
                            errmessage = errmessage + '<br />' + "Work Order already selected please unselect Sales Order.";
                            this.msgflag = 1;
                        }
                    }
                }
            }
            if (this.msgflag == 0) {
                if (this.partListData[i].repairOrderId) {
                    if (this.partListData[i].repairOrderId.value != 0) {
                        if (this.partListData[i].workOrderId) {
                            if (this.partListData[i].workOrderId.value != 0) {
                                this.isSpinnerVisible = false;
                                errmessage = errmessage + '<br />' + "Repair Order already selected please unselect Work Order.";
                            }
                        }
                        if (this.partListData[i].salesOrderId) {
                            if (this.partListData[i].salesOrderId.value != 0) {
                                this.isSpinnerVisible = false;
                                errmessage = errmessage + '<br />' + "Repair Order already selected please unselect Sales Order.";
                            }
                        }
                    }
                }
            }
            if (this.partListData[i].minimumOrderQuantity > 0
                && this.partListData[i].quantityOrdered > 0
                && this.partListData[i].quantityOrdered < this.partListData[i].minimumOrderQuantity) {
                this.partListData[i].quantityOrdered = this.partListData[i].minimumOrderQuantity;
                this.isSpinnerVisible = false;
                errmessage = errmessage + '<br />' + 'Minimum Order Qty : ' + this.partListData[i].minimumOrder + '<br /> Order quantity can not be less then Minimum order quantity.';
            }
            if (!this.partListData[i].itemMasterId) {
                this.isSpinnerVisible = false;
                errmessage = errmessage + '<br />' + "PN is required.";
            }
            if (!this.partListData[i].priorityId) {
                this.isSpinnerVisible = false;
                errmessage = errmessage + '<br />' + "Priority is required.";
            }
            if (!this.partListData[i].needByDate) {
                this.isSpinnerVisible = false;
                errmessage = errmessage + '<br />' + "Need By is required.";
            }
            if (!this.partListData[i].conditionId) {
                this.isSpinnerVisible = false;
                errmessage = errmessage + '<br />' + "Cond is required.";
            }
            if (!this.partListData[i].functionalCurrencyId) {
                this.isSpinnerVisible = false;
                errmessage = errmessage + '<br />' + "Functional CUR is required.";
            }
            if (!this.partListData[i].foreignExchangeRate) {
                this.isSpinnerVisible = false;
                errmessage = errmessage + '<br />' + "FX Rate is required.";
            }
            if (!this.partListData[i].reportCurrencyId) {
                this.isSpinnerVisible = false;
                errmessage = errmessage + '<br />' + "Report CUR is required.";
            }
            if (!this.partListData[i].managementStructureId || this.partListData[i].managementStructureId == 0) {
                this.isSpinnerVisible = false;
                errmessage = errmessage + '<br />' + "Management Structure is required.";
            }
            if (this.partListData[i].childList && this.partListData[i].childList.length > 0) {
                for (var j = 0; j < this.partListData[i].childList.length; j++) {
                    if (!this.partListData[i].childList[j].partListUserTypeId
                        || this.partListData[i].childList[j].partListUserTypeId == 0
                        || this.partListData[i].childList[j].partListUserTypeId == null) {
                        this.isSpinnerVisible = false;
                        errmessage = errmessage + '<br />' + "Split Shipment User Type is required.";
                    }
                    if (!this.partListData[i].childList[j].partListUserId
                        || this.partListData[i].childList[j].partListUserId == 0
                        || this.partListData[i].childList[j].partListUserId == null) {
                        this.isSpinnerVisible = false;
                        errmessage = errmessage + '<br />' + "Split Shipment Name is required.";
                    }
                    if (!this.partListData[i].childList[j].poPartSplitSiteId
                        || this.partListData[i].childList[j].poPartSplitSiteId == 0
                        || this.partListData[i].childList[j].poPartSplitSiteId == null) {
                        this.isSpinnerVisible = false;
                        errmessage = errmessage + '<br />' + "Split Shipment Select Address is required.";
                    }
                    // if(!this.partListData[i].childList[j].quantityOrdered || this.partListData[i].childList[j].quantityOrdered == 0 ) {	
                    // 	this.isSpinnerVisible = false;	
                    // 	errmessage = errmessage + '<br />' + "Split Shipment Qty is required."
                    // }
                    if (!this.partListData[i].childList[j].quantityOrdered || this.partListData[i].childList[j].quantityOrdered == 0) {
                        this.isSpinnerVisible = false;
                        this.displayWarningModal = false;
                        this.alertText = 'Part No: ' + this.getPartnumber(this.partListData[i].itemMasterId) + '<br/>' + "Split Shipment Qty is required.";
                        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
                        return;
                    }
                    if (!this.partListData[i].childList[j].managementStructureId || this.partListData[i].childList[j].managementStructureId == 0) {
                        this.isSpinnerVisible = false;
                        errmessage = errmessage + '<br />' + "Split Shipment Management Structure is required.";
                    }
                    if (!this.partListData[i].childList[j].needByDate) {
                        this.isSpinnerVisible = false;
                        errmessage = errmessage + '<br />' + "Split Shipment Need By is required.";
                    }
                }
            }
            if (errmessage != '') {
                var message = 'Part No: ' + this.getPartnumber(this.partListData[i].itemMasterId) + errmessage;
                this.alertService.showStickyMessage("Validation failed", message, alert_service_1.MessageSeverity.error, 'Please enter Qty');
                return;
            }
            if (this.partListData[i].vendorListPrice == 0 && this.displayWarningModal == false) {
                this.isSpinnerVisible = false;
                this.displayWarningModal = true;
                this.alertText = 'Part No: ' + this.getPartnumber(this.partListData[i].itemMasterId) + '<br />' + "Vendor Price is not populated  - Continue Y/N";
                this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
                return;
            }
            var childDataList = [];
            this.childObjectArray = [];
            this.childObjectArrayEdit = [];
            this.parentObject = {};
            this.childObject = {};
            if (this.partListData[i].childList) {
                if (this.partListData[i].childList.length > 0) {
                    for (var j = 0; j < this.partListData[i].childList.length; j++) {
                        childDataList.push(this.partListData[i].childList[j]);
                    }
                }
            }
            if (this.partListData[i].ifSplitShip) {
                if (childDataList.length > 0) {
                    this.childObjectArray = [];
                    for (var j = 0; j < childDataList.length; j++) {
                        this.childObject = {
                            purchaseOrderId: this.poId,
                            itemMasterId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
                            assetId: this.partListData[i].assetId ? this.partListData[i].assetId : 0,
                            partNumberId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
                            poPartSplitUserTypeId: childDataList[j].partListUserTypeId ? childDataList[j].partListUserTypeId : 0,
                            poPartSplitUserId: childDataList[j].partListUserId ? this.getIdByObject(childDataList[j].partListUserId) : 0,
                            poPartSplitSiteId: childDataList[j].poPartSplitSiteId ? childDataList[j].poPartSplitSiteId : 0,
                            poPartSplitAddressId: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('addressId', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : 0,
                            poPartSplitAddress1: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('address1', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
                            poPartSplitAddress2: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('address2', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
                            poPartSplitCity: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('city', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
                            POPartSplitState: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('stateOrProvince', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
                            poPartSplitPostalCode: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('postalCode', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
                            POPartSplitCountryId: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('countryId', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : 0,
                            POPartSplitCountryName: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('country', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
                            UOMId: this.partListData[i].UOMId ? this.partListData[i].UOMId : 0,
                            quantityOrdered: childDataList[j].quantityOrdered ? parseFloat(childDataList[j].quantityOrdered.toString().replace(/\,/g, '')) : 0,
                            needByDate: this.datePipe.transform(childDataList[j].needByDate, "MM/dd/yyyy"),
                            managementStructureId: childDataList[j].managementStructureId && childDataList[j].managementStructureId != null ? childDataList[j].managementStructureId : null,
                            isDeleted: childDataList[j].isDeleted,
                            createdBy: this.userName,
                            updatedBy: this.userName
                        };
                        this.childObjectArray.push(this.childObject);
                        this.childObjectArrayEdit.push(__assign(__assign({}, this.childObject), { purchaseOrderPartRecordId: childDataList[j].purchaseOrderPartRecordId ? childDataList[j].purchaseOrderPartRecordId : 0 }));
                    }
                }
            }
            else {
                if (childDataList.length > 0) {
                    this.childObjectArray = [];
                    for (var j = 0; j < childDataList.length; j++) {
                        this.childObject = {
                            purchaseOrderId: this.poId,
                            itemMasterId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
                            assetId: this.partListData[i].assetId ? this.partListData[i].assetId : 0,
                            partNumberId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
                            poPartSplitUserTypeId: childDataList[j].partListUserTypeId ? childDataList[j].partListUserTypeId : 0,
                            poPartSplitUserId: childDataList[j].partListUserId ? this.getIdByObject(childDataList[j].partListUserId) : 0,
                            poPartSplitSiteId: childDataList[j].poPartSplitSiteId ? childDataList[j].poPartSplitSiteId : 0,
                            poPartSplitAddressId: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('addressId', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : 0,
                            poPartSplitAddress1: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('address1', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
                            poPartSplitAddress2: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('address2', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
                            poPartSplitCity: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('city', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
                            POPartSplitState: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('stateOrProvince', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
                            poPartSplitPostalCode: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('postalCode', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
                            POPartSplitCountryId: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('countryId', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : 0,
                            POPartSplitCountryName: this["splitAddressData" + i + j].length > 0 ? autocomplete_1.getValueFromArrayOfObjectById('country', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
                            UOMId: this.partListData[i].UOMId ? this.partListData[i].UOMId : 0,
                            quantityOrdered: childDataList[j].quantityOrdered ? parseFloat(childDataList[j].quantityOrdered.toString().replace(/\,/g, '')) : 0,
                            needByDate: this.datePipe.transform(childDataList[j].needByDate, "MM/dd/yyyy"),
                            managementStructureId: childDataList[j].managementStructureId && childDataList[j].managementStructureId != null ? childDataList[j].managementStructureId : null,
                            isDeleted: true,
                            createdBy: this.userName,
                            updatedBy: this.userName
                        };
                        this.childObjectArray.push(this.childObject);
                        this.childObjectArrayEdit.push(__assign(__assign({}, this.childObject), { purchaseOrderPartRecordId: childDataList[j].purchaseOrderPartRecordId ? childDataList[j].purchaseOrderPartRecordId : 0 }));
                    }
                }
            }
            this.parentObject = {
                purchaseOrderId: this.poId,
                isParent: true,
                itemMasterId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
                //partNumber : this.partListData[i].itemMasterId ? this.getPartnumber(this.partListData[i].itemMasterId) : null,
                altEquiPartNumberId: this.partListData[i].altEquiPartNumberId ? this.getValueFromObj(this.partListData[i].altEquiPartNumberId) : null,
                //altPartNumber : this.partListData[i].altEquiPartNumberId ? this.getAltEquiPartNumer(this.partListData[i].altEquiPartNumberId) : null,
                assetId: this.partListData[i].assetId ? this.partListData[i].assetId : 0,
                partNumberId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
                itemTypeId: this.partListData[i].itemTypeId ? this.partListData[i].itemTypeId : 0,
                manufacturerId: this.partListData[i].manufacturerId ? this.partListData[i].manufacturerId : 0,
                glAccountId: this.partListData[i].glAccountId ? this.partListData[i].glAccountId : 0,
                UOMId: this.partListData[i].UOMId ? this.partListData[i].UOMId : 0,
                needByDate: this.datePipe.transform(this.partListData[i].needByDate, "MM/dd/yyyy"),
                conditionId: this.partListData[i].conditionId ? this.partListData[i].conditionId : 0,
                //condition : this.partListData[i].conditionId ? this.getCondition(this.partListData[i].conditionId): 0,
                priorityId: this.partListData[i].priorityId ? this.partListData[i].priorityId : 0,
                //priority : this.partListData[i].priorityId ? this.getPriorityName(this.partListData[i].priorityId) : 0,
                quantityOrdered: this.partListData[i].quantityOrdered ? parseFloat(this.partListData[i].quantityOrdered.toString().replace(/\,/g, '')) : 0,
                unitCost: this.partListData[i].unitCost ? parseFloat(this.partListData[i].unitCost.toString().replace(/\,/g, '')) : 0,
                vendorListPrice: this.partListData[i].vendorListPrice ? parseFloat(this.partListData[i].vendorListPrice.toString().replace(/\,/g, '')) : 0,
                discountPerUnit: this.partListData[i].discountPerUnit ? parseFloat(this.partListData[i].discountPerUnit.toString().replace(/\,/g, '')) : 0,
                discountPercent: this.partListData[i].discountPercent ? this.partListData[i].discountPercent : 0,
                discountAmount: this.partListData[i].discountAmount ? parseFloat(this.partListData[i].discountAmount.toString().replace(/\,/g, '')) : 0,
                extendedCost: this.partListData[i].extendedCost ? parseFloat(this.partListData[i].extendedCost.toString().replace(/\,/g, '')) : 0,
                functionalCurrencyId: this.partListData[i].functionalCurrencyId ? this.getCurrencyIdByObject(this.partListData[i].functionalCurrencyId) : null,
                //functionalCurrency: this.partListData[i].functionalCurrencyId ? this.getlabelFromObj(this.partListData[i].functionalCurrencyId) : null,
                foreignExchangeRate: this.partListData[i].foreignExchangeRate ? this.partListData[i].foreignExchangeRate : 0,
                reportCurrencyId: this.partListData[i].reportCurrencyId ? this.getCurrencyIdByObject(this.partListData[i].reportCurrencyId) : null,
                //reportCurrency : this.partListData[i].reportCurrencyId ? this.getlabelFromObj(this.partListData[i].reportCurrencyId) : null,				
                workOrderId: this.partListData[i].workOrderId && this.getValueFromObj(this.partListData[i].workOrderId) != 0 ? this.getValueFromObj(this.partListData[i].workOrderId) : null,
                //WorkOrderNo : this.partListData[i].workOrderId  && this.getValueFromObj(this.partListData[i].workOrderId) != 0 ? this.getlabelFromObj(this.partListData[i].workOrderId) : null,
                subWorkOrderId: this.partListData[i].subWorkOrderId && this.getValueFromObj(this.partListData[i].subWorkOrderId) != 0 ? this.getValueFromObj(this.partListData[i].subWorkOrderId) : null,
                //subWorkOrderNo : this.partListData[i].subWorkOrderId && this.getValueFromObj(this.partListData[i].subWorkOrderId) != 0 ? this.getlabelFromObj(this.partListData[i].subWorkOrderId) : null,				
                repairOrderId: this.partListData[i].repairOrderId && this.getValueFromObj(this.partListData[i].repairOrderId) != 0 ? this.getValueFromObj(this.partListData[i].repairOrderId) : null,
                //reapairOrderNo: this.partListData[i].repairOrderId && this.getValueFromObj(this.partListData[i].repairOrderId) != 0 ? this.getlabelFromObj(this.partListData[i].repairOrderId) : null,				
                salesOrderId: this.partListData[i].salesOrderId && this.getValueFromObj(this.partListData[i].salesOrderId) != 0 ? this.getValueFromObj(this.partListData[i].salesOrderId) : null,
                //salesOrderNo: this.partListData[i].salesOrderId && this.getValueFromObj(this.partListData[i].salesOrderId) != 0 ? this.getlabelFromObj(this.partListData[i].salesOrderId) : null,
                managementStructureId: this.partListData[i].managementStructureId && this.partListData[i].managementStructureId != 0 ? this.partListData[i].managementStructureId : null,
                memo: this.partListData[i].memo,
                isApproved: this.partListData[i].isApproved ? this.partListData[i].isApproved : false,
                masterCompanyId: this.currentUserMasterCompanyId,
                isDeleted: this.partListData[i].isDeleted,
                createdBy: this.userName,
                updatedBy: this.userName,
                employeeID: this.employeeId ? this.employeeId : 0
            };
            if (!this.isEditMode) {
                this.parentObjectArray.push(__assign(__assign({}, this.parentObject), { purchaseOrderSplitParts: this.childObjectArray }));
            }
            else {
                this.parentObjectArray.push(__assign(__assign({}, this.parentObject), { purchaseOrderSplitParts: this.childObjectArrayEdit, purchaseOrderPartRecordId: this.partListData[i].purchaseOrderPartRecordId ? this.partListData[i].purchaseOrderPartRecordId : 0 }));
            }
        }
        this.purchaseOrderService.savePurchaseOrderParts(this.parentObjectArray).subscribe(function (res) {
            if (res) {
                _this.BindAllParts(res);
            }
            _this.isSpinnerVisible = false;
            _this.enablePartSaveBtn = false;
            _this.alertService.showMessage('Success', "Saved PO PartsList Successfully", alert_service_1.MessageSeverity.success);
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
        this.enableHeaderSaveBtn = false;
    };
    PurchaseSetupComponent.prototype.goToCreatePOList = function () {
        this.route.navigate(['/vendorsmodule/vendorpages/app-create-po']);
    };
    PurchaseSetupComponent.prototype.loadcustomerData = function (strText) {
        var _this = this;
        if (strText === void 0) { strText = ''; }
        if (this.arrayCustlist.length == 0) {
            this.arrayCustlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', strText, true, 20, this.arrayCustlist.join(), this.currentUserMasterCompanyId).subscribe(function (response) {
            _this.allCustomers = response;
            _this.customerNames = response;
            _this.splitcustomersList = response;
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.loapartItems = function (strvalue) {
        var _this = this;
        if (strvalue === void 0) { strvalue = ''; }
        this.commonService.getStockpartnumbersAutoComplete(strvalue, false, 0, this.currentUserMasterCompanyId).subscribe(function (res) {
            _this.partCollection = res.map(function (x) {
                return {
                    value: x.itemMasterId,
                    label: x.partNumber
                };
            });
        });
    };
    PurchaseSetupComponent.prototype.filterpartItems = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.loapartItems(event.query);
        }
    };
    PurchaseSetupComponent.prototype.filterAltPartItems = function (event, partNo, partList) {
        var _this = this;
        var itemMasterId = autocomplete_1.getValueFromObjectByKey('value', partNo);
        this.itemser.getItemMasterAltEquiMappingParts(itemMasterId).subscribe(function (res) {
            _this.altPartNumList = res;
            _this.altPartCollection = _this.altPartNumList.map(function (x) {
                return { value: x.altEquiPartNumberId, label: x.altEquiPartNumber };
            });
            partList.altPartCollection = _this.altPartCollection;
            if (event.query !== undefined && event.query !== null) {
                var partNumberFilter = __spreadArrays(_this.altPartCollection.filter(function (x) {
                    return x.label.toLowerCase().includes(event.query.toLowerCase());
                }));
                partList.altPartCollection = partNumberFilter;
            }
        }, function (err) {
        });
    };
    PurchaseSetupComponent.prototype.filterNames = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadcustomerData(event.query);
        }
    };
    PurchaseSetupComponent.prototype.getAddressDetails = function (variable, pindex, cindex) {
        return this[variable + pindex + cindex];
    };
    PurchaseSetupComponent.prototype.filterCustomersSplit = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadcustomerData(event.query);
        }
    };
    PurchaseSetupComponent.prototype.filterSplitVendorNames = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadVendorList(event.query);
        }
    };
    PurchaseSetupComponent.prototype.onSelectSplitUserType = function (part, pindex, cindex) {
        part.addressData = [];
        part.partListUserId = {};
        part.partListAddressId = 0;
        this["splitAddressData" + pindex + cindex] = [];
    };
    PurchaseSetupComponent.prototype.deleteSplitShipment = function (childata, index, mainindex) {
        var _this = this;
        this.enablePartSave();
        if (childata.purchaseOrderPartRecordId !== undefined && childata.purchaseOrderPartRecordId !== null) {
            this.partListData[mainindex].childList = this.partListData[mainindex].childList.map(function (x) {
                if (x.purchaseOrderPartRecordId == childata.purchaseOrderPartRecordId) {
                    var remQty = _this.partListData[mainindex].remQty ? parseInt(_this.partListData[mainindex].remQty.toString().replace(/\,/g, '')) : 0;
                    var childQty = x.quantityOrdered ? parseInt(x.quantityOrdered.toString().replace(/\,/g, '')) : 0;
                    _this.partListData[mainindex].remQty = remQty + childQty;
                    return __assign(__assign({}, x), { isDeleted: true });
                }
                else {
                    return x;
                }
            });
        }
        else {
            this.partListData[mainindex].childList.splice(index, 1);
        }
    };
    PurchaseSetupComponent.prototype.onClickShipMemo = function () {
        this.addressMemoLabel = 'Edit Ship';
        this.tempMemo = this.sourcePoApproval.shipToMemo;
    };
    PurchaseSetupComponent.prototype.onClickPartsMemo = function (partList) {
        this.tempPartList = partList;
        this.partsMemo = partList.memo;
        this.addressMemoLabel = 'Edit Notes';
    };
    PurchaseSetupComponent.prototype.onSavePartsMemo = function () {
        this.enablePartSaveBtn = true;
        if (this.addressMemoLabel == 'Edit Notes') {
            this.tempPartList.memo = this.partsMemo;
        }
    };
    PurchaseSetupComponent.prototype.onClickApproversMemo = function (approver) {
        this.tempApproverObj = approver;
        this.tempApproverMemo = approver.memo;
    };
    PurchaseSetupComponent.prototype.onSaveApproversMemo = function () {
        this.tempApproverObj.memo = this.tempApproverMemo;
    };
    PurchaseSetupComponent.prototype.onAddShipMemo = function () {
        this.tempAddshipViaMemo = this.addShipViaFormForShipping.memo;
    };
    PurchaseSetupComponent.prototype.onSaveTextAreaInfo = function () {
        this.addShipViaFormForShipping.memo = this.tempAddshipViaMemo;
        $('#ship-via-memo').modal('hide');
    };
    PurchaseSetupComponent.prototype.closeMemoModel = function () {
        $('#ship-via-memo').modal('hide');
    };
    PurchaseSetupComponent.prototype.onClickBillMemo = function () {
        this.addressMemoLabel = 'Edit Bill';
        this.tempMemo = this.sourcePoApproval.billToMemo;
    };
    PurchaseSetupComponent.prototype.getFXRate = function (partList, onChange) {
        if ((partList.reportCurrencyId != null || partList.reportCurrencyId != undefined) && (partList.functionalCurrencyId != null || partList.functionalCurrencyId != undefined)) {
            var funcCurrency = autocomplete_1.editValueAssignByCondition('value', partList.functionalCurrencyId);
            var reportCurrency = autocomplete_1.editValueAssignByCondition('value', partList.reportCurrencyId);
            if (funcCurrency == reportCurrency) {
                partList.foreignExchangeRate = '1.00';
                if (onChange == 'onChange') {
                    this.alertService.showMessage('Error', "FXRate can't be greater than 1, if Func CUR and Report CUR are same", alert_service_1.MessageSeverity.error);
                }
                return;
            }
            if (partList.foreignExchangeRate) {
                partList.foreignExchangeRate = autocomplete_1.formatNumberAsGlobalSettingsModule(partList.foreignExchangeRate, 2);
            }
        }
    };
    PurchaseSetupComponent.prototype.loadConditionData = function () {
        var _this = this;
        if (this.lsconditionId != undefined && this.lsconditionId != null) {
            this.arrayConditionlist.push(this.lsconditionId);
        }
        else {
            if (this.arrayConditionlist.length == 0) {
                this.arrayConditionlist.push(0);
            }
        }
        this.commonService.autoSuggestionSmartDropDownList('Condition', 'ConditionId', 'Description', '', true, 0, this.arrayConditionlist.join(), this.currentUserMasterCompanyId).subscribe(function (res) {
            _this.allconditioninfo = res;
            _this.allconditioninfo.map(function (x) {
                if (x.label.toUpperCase() == 'NEW') {
                    _this.defaultCondtionId = x.value;
                    _this.newObjectForParent.conditionId = x.value;
                }
            });
            if (_this.stocklineReferenceData != null && _this.stocklineReferenceData != undefined) {
                for (var i = 0; i < _this.allconditioninfo.length; i++) {
                    if (_this.allconditioninfo[i].value == _this.stocklineReferenceData.conditionId) {
                        _this.newObjectForParent.conditionId = _this.allconditioninfo[i].value;
                        _this.newObjectForParent.itemMasterId = _this.stocklineReferenceData.itemMasterId;
                        _this.getPriceDetailsByCondId(_this.newObjectForParent);
                    }
                }
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.loadPOApproverStatus = function () {
        var _this = this;
        this.commonService.smartDropDownList('ApprovalStatus', 'ApprovalStatusId', 'Name').subscribe(function (response) {
            _this.poApproverStatusList = response;
            _this.poApproverStatusList = _this.poApproverStatusList.sort(function (a, b) { return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0); });
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.ifSplitShipment = function (partList, event) {
        if (partList.ifSplitShip) {
            if (partList.partNumberId !== null && partList.partNumberId !== undefined) {
                this.addRow(partList);
            }
            else {
                this.alertService.showMessage('Error', 'Please select Part Number!', alert_service_1.MessageSeverity.error);
                event.target.checked = false;
                partList.ifSplitShip = false;
            }
        }
        else {
            this.enablePartSaveBtn = true;
            //partList.childList = [];
        }
    };
    PurchaseSetupComponent.prototype.addAvailableParts = function () {
        var _this = this;
        this.tempNewPNArray = [];
        var newParentObject = new create_po_partslist_model_1.CreatePOPartsList();
        if (this.newData) {
            var data = this.newData.map(function (x) {
                if (x.addAllMultiPNRows) {
                    var newObject = __assign(__assign({}, newParentObject), { partNumberId: { value: x.itemMasterId, label: x.partNumber }, needByDate: _this.headerInfo.needByDate, conditionId: _this.defaultCondtionId, priorityId: _this.headerInfo.priorityId ? autocomplete_1.editValueAssignByCondition('value', _this.headerInfo.priorityId) : null, discountPercent: 0 });
                    _this.getManagementStructureForParentEdit(newObject);
                    _this.getPNDetailsById(newObject);
                    //this.getPriceDetailsByCondId(newObject);
                    _this.partListData = __spreadArrays(_this.partListData, [newObject]);
                }
            });
            for (var i = 0; i < this.partListData.length; i++) {
                if (!this.partListData[i].ifSplitShip) {
                    this.partListData[i].childList = [];
                }
            }
        }
        this.partNumbers = null;
        this.addAllMultiPN = false;
    };
    PurchaseSetupComponent.prototype.onChangeAddAllMultiPN = function (event) {
        if (event.target.checked) {
            if (this.newData) {
                for (var i = 0; i < this.newData.length; i++) {
                    this.newData[i].addAllMultiPNRows = true;
                }
            }
        }
        else {
            if (this.newData) {
                for (var i = 0; i < this.newData.length; i++) {
                    this.newData[i].addAllMultiPNRows = false;
                }
            }
        }
        this.onChangeAddEachMultiPN();
    };
    PurchaseSetupComponent.prototype.onChangeAddEachMultiPN = function () {
        if (this.newData) {
            for (var i = 0; i < this.newData.length; i++) {
                if (this.newData[i].addAllMultiPNRows) {
                    this.enableMultiPartAddBtn = true;
                    break;
                }
                else {
                    this.enableMultiPartAddBtn = false;
                }
            }
        }
    };
    PurchaseSetupComponent.prototype.onAddMultParts = function () {
        this.partNumbers = null;
        this.newPNList = [];
        this.newData = [];
        this.addAllMultiPN = false;
        this.enableMultiPartAddBtn = false;
    };
    PurchaseSetupComponent.prototype.addPartNumber = function () {
        this.inputValidCheck = false;
        //if (this.vendorService.isEditMode == false) {
        var newParentObject = new create_po_partslist_model_1.CreatePOPartsList();
        newParentObject = __assign(__assign({}, newParentObject), { needByDate: this.headerInfo.needByDate, priorityId: this.headerInfo.priorityId ? autocomplete_1.editValueAssignByCondition('value', this.headerInfo.priorityId) : null, conditionId: this.defaultCondtionId, discountPercent: 0, workOrderId: { value: 0, label: '-- Select --' }, subWorkOrderId: { value: 0, label: '-- Select --' }, repairOrderId: { value: 0, label: '-- Select --' }, salesOrderId: { value: 0, label: '-- Select --' } });
        this.partListData.push(newParentObject);
        for (var i = 0; i < this.partListData.length; i++) {
            if (!this.partListData[i].ifSplitShip) {
                this.partListData[i].childList = [];
            }
        }
        if (this.headerInfo.companyId > 0) {
            for (var i = 0; i < this.partListData.length; i++) {
                if (i == this.partListData.length - 1) {
                    this.partListData[i].maincompanylist = this.maincompanylist;
                    this.partListData[i].parentCompanyId = this.headerInfo.companyId;
                    this.partListData[i].managementStructureId = this.headerInfo.companyId;
                    this.partListData[i].parentBulist = this.bulist;
                    this.partListData[i].parentDivisionlist = this.divisionlist;
                    this.partListData[i].parentDepartmentlist = this.departmentList;
                    ;
                    this.partListData[i].parentbuId = 0;
                    this.partListData[i].parentDivisionId = 0;
                    this.partListData[i].parentDeptId = 0;
                }
            }
        }
        if (this.headerInfo.buId) {
            for (var i = 0; i < this.partListData.length; i++) {
                if (i == this.partListData.length - 1) {
                    this.partListData[i].parentBulist = this.bulist;
                    this.partListData[i].parentbuId = this.headerInfo.buId;
                    this.partListData[i].managementStructureId = this.headerInfo.buId;
                    this.partListData[i].parentDivisionId = 0;
                    this.partListData[i].parentDeptId = 0;
                }
            }
        }
        if (this.headerInfo.divisionId) {
            for (var i = 0; i < this.partListData.length; i++) {
                if (i == this.partListData.length - 1) {
                    this.partListData[i].parentDivisionlist = this.divisionlist;
                    this.partListData[i].parentDivisionId = this.headerInfo.divisionId;
                    this.partListData[i].managementStructureId = this.headerInfo.divisionId;
                    this.partListData[i].parentDeptId = 0;
                }
            }
        }
        if (this.headerInfo.departmentId) {
            for (var i = 0; i < this.partListData.length; i++) {
                if (i == this.partListData.length - 1) {
                    this.partListData[i].parentDepartmentlist = this.departmentList;
                    this.partListData[i].parentDeptId = this.headerInfo.departmentId;
                    this.partListData[i].managementStructureId = this.headerInfo.departmentId;
                }
            }
        }
        for (var i = 0; i < this.partListData.length; i++) {
            if (i == this.partListData.length - 1) {
                this.partListData[i].conditionId = this.defaultCondtionId;
                this.getFunctionalReportCurrencyById(this.partListData[i]);
            }
        }
        //}
        //this.getRemainingAllQty();
    };
    PurchaseSetupComponent.prototype.getAllparts = function () {
        var _this = this;
        this.arraySearch = this.partNumbers.replace(/\s/g, "");
        this.newData = [];
        this.newPNList = [];
        if (this.arraySearch.length > 0) {
            this.itemser.getPartDetailsByid(this.arraySearch).subscribe(function (data) {
                _this.newData = data.multiParts.map(function (x) {
                    return __assign(__assign({}, x), { addAllMultiPNRows: false });
                });
                _this.newPNList = data.partsNotFound;
            }, function (err) {
                _this.isSpinnerVisible = false;
            });
        }
    };
    PurchaseSetupComponent.prototype.addRow = function (partList) {
        var childPart = new create_po_partslist_model_1.PartDetails();
        childPart = __assign(__assign({}, childPart), { quantityOrdered: 0, needByDate: partList.needByDate ? partList.needByDate : null, priorityId: partList.priorityId ? autocomplete_1.getValueFromArrayOfObjectById('label', 'value', partList.priorityId, this.allPriorityInfo) : null });
        partList.childList.push(childPart);
        if (partList.parentCompanyId) {
            for (var i = 0; i < partList.childList.length; i++) {
                if (i == partList.childList.length - 1) {
                    partList.childList[i].childCompanyId = partList.parentCompanyId;
                    partList.childList[i].maincompanylist = partList.maincompanylist;
                    partList.childList[i].childBulist = partList.parentBulist;
                    partList.childList[i].childDivisionlist = partList.parentDivisionlist;
                    partList.childList[i].childDepartmentlist = partList.parentDepartmentlist;
                    partList.childList[i].managementStructureId == partList.parentCompanyId;
                }
            }
        }
        if (partList.parentbuId) {
            for (var i = 0; i < partList.childList.length; i++) {
                if (i == partList.childList.length - 1 && partList.childList[i].childCompanyId !== 0) {
                    partList.childList[i].childBulist = partList.parentBulist;
                    partList.childList[i].managementStructureId = partList.parentbuId;
                    partList.childList[i].childbuId = partList.parentbuId;
                }
            }
        }
        if (partList.parentDivisionId) {
            for (var i = 0; i < partList.childList.length; i++) {
                if (i == partList.childList.length - 1 && partList.childList[i].childbuId !== 0) {
                    partList.childList[i].childDivisionlist = partList.parentDivisionlist;
                    partList.childList[i].managementStructureId = partList.parentDivisionId;
                    partList.childList[i].childDivisionId = partList.parentDivisionId;
                }
            }
        }
        if (partList.parentDeptId) {
            for (var i = 0; i < partList.childList.length; i++) {
                if (i == partList.childList.length - 1 && partList.childList[i].childDivisionId !== 0) {
                    partList.childList[i].childDepartmentlist = partList.parentDepartmentlist;
                    partList.childList[i].managementStructureId = partList.parentDeptId;
                    partList.childList[i].childDeptId = partList.parentDeptId;
                }
            }
        }
        var childQty = 0;
        if (partList.childList != null && partList.childList.length > 0) {
            for (var j = 0; j < partList.childList.length; j++) {
                if (!partList.childList[j].isDeleted) {
                    childQty += partList.childList[j].quantityOrdered ? parseInt(partList.childList[j].quantityOrdered.toString().replace(/\,/g, '')) : 0;
                }
            }
            var quantityOrdered = partList.quantityOrdered ? parseInt(partList.quantityOrdered.toString().replace(/\,/g, '')) : 0;
            partList.remQty = quantityOrdered - childQty;
        }
    };
    PurchaseSetupComponent.prototype.getAddRowCompanyId = function (partList) {
        for (var i = 0; i < partList.childList.length; i++) {
            if (i == partList.childList.length - 1) {
                partList.childList[i].childCompanyId = partList.parentCompanyId;
                this.getChildBUList(partList.childList[i]);
            }
        }
    };
    PurchaseSetupComponent.prototype.getAddRowBUId = function (partList) {
        for (var i = 0; i < partList.childList.length; i++) {
            if (i == partList.childList.length - 1 && partList.childList[i].childCompanyId !== 0) {
                partList.childList[i].childbuId = partList.parentbuId;
                this.getChildDivisionlist(partList.childList[i]);
            }
        }
    };
    PurchaseSetupComponent.prototype.getAddRowDivisionId = function (partList) {
        for (var i = 0; i < partList.childList.length; i++) {
            if (i == partList.childList.length - 1 && partList.childList[i].childbuId !== 0) {
                partList.childList[i].childDivisionId = partList.parentDivisionId;
                this.getChildDeptlist(partList.childList[i]);
            }
        }
    };
    PurchaseSetupComponent.prototype.getAddRowDeptId = function (partList) {
        for (var i = 0; i < partList.childList.length; i++) {
            if (i == partList.childList.length - 1 && partList.childList[i].childDivisionId !== 0) {
                partList.childList[i].childDeptId = partList.parentDeptId;
                this.getChildDeptId(partList.childList[i]);
            }
        }
    };
    PurchaseSetupComponent.prototype.loadCurrencyData = function () {
        var _this = this;
        if (this.arrayCurrencylist.length == 0) {
            this.arrayCurrencylist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', '', true, 0, this.arrayCurrencylist.join(), this.currentUserMasterCompanyId).subscribe(function (res) {
            _this.allCurrencyData = res;
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.eventHandler = function (event) {
        if (event.target.value != "") {
            var value = event.target.value.toLowerCase();
            if (this.selectedActionName) {
                if (value == this.selectedActionName.toLowerCase()) {
                    this.disableSaveVenderName = true;
                    this.disableSaveVenName = true;
                }
                else {
                    this.disableSaveVenderName = false;
                    this.disableSaveVenName = false;
                }
            }
        }
    };
    PurchaseSetupComponent.prototype.selectedVendorName = function (value) {
        this.loadvendorDataById(value.vendorId);
    };
    PurchaseSetupComponent.prototype.onChangeVendorContact = function (value) {
        this.headerInfo.vendorContactId = value;
        this.headerInfo.vendorContactPhone = value;
    };
    PurchaseSetupComponent.prototype.filterVendorContacts = function (event) {
        this.vendorContactsHeader = this.vendorContactList;
        if (event.query !== undefined && event.query !== null) {
            var vendorFilter = __spreadArrays(this.vendorContactList.filter(function (x) {
                return x.vendorContact.toLowerCase().includes(event.query.toLowerCase());
            }));
            this.vendorContactsHeader = vendorFilter;
        }
    };
    PurchaseSetupComponent.prototype.filterVendorPhone = function (event) {
        this.vendorPhoneNum = this.vendorContactList;
        if (event.query !== undefined && event.query !== null) {
            var vendorPhone = __spreadArrays(this.vendorContactList.filter(function (x) {
                return x.workPhone;
            }));
            this.vendorPhoneNum = vendorPhone;
        }
    };
    PurchaseSetupComponent.prototype.filterPriorityNames = function (event) {
        this.allPriorityDetails = this.allPriorityInfo;
        if (event.query !== undefined && event.query !== null) {
            var priority = __spreadArrays(this.allPriorityInfo.filter(function (x) {
                return x.label.toLowerCase().includes(event.query.toLowerCase());
            }));
            this.allPriorityDetails = priority;
        }
    };
    PurchaseSetupComponent.prototype.filterCond = function (event) {
        this.conditionList = this.allconditioninfo;
        if (event.query !== undefined && event.query !== null) {
            var condlist = __spreadArrays(this.allconditioninfo.filter(function (x) {
                return x.description.toLowerCase().includes(event.query.toLowerCase());
            }));
            this.conditionList = condlist;
        }
    };
    PurchaseSetupComponent.prototype.filterFunctionalCurrency = function (event) {
        this.functionalCurrList = this.allCurrencyData;
        if (event.query !== undefined && event.query !== null) {
            var funcCurrlist = __spreadArrays(this.allCurrencyData.filter(function (x) {
                return x.label.toLowerCase().includes(event.query.toLowerCase());
            }));
            this.functionalCurrList = funcCurrlist;
        }
    };
    PurchaseSetupComponent.prototype.filterTransCurrency = function (event) {
        this.functionalTransList = this.allCurrencyData;
        if (event.query !== undefined && event.query !== null) {
            var transCurrlist = __spreadArrays(this.allCurrencyData.filter(function (x) {
                return x.label.toLowerCase().includes(event.query.toLowerCase());
            }));
            this.functionalTransList = transCurrlist;
        }
    };
    PurchaseSetupComponent.prototype.filterCountries = function (event) {
        this.countriesList = this.allCountriesList;
        if (event.query !== undefined && event.query !== null) {
            var countries = __spreadArrays(this.allCountriesList.filter(function (x) {
                return x.label.toLowerCase().includes(event.query.toLowerCase());
            }));
            this.countriesList = countries;
        }
    };
    PurchaseSetupComponent.prototype.filterWorkOrderList = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadWorkOrderList(event.query);
        }
    };
    PurchaseSetupComponent.prototype.filtersubWorkOrderList = function (event, workOrderId, partList, index) {
        if (event.query !== undefined && event.query !== null) {
            this.loadSubWorkOrderList(event.query, workOrderId, partList, index);
        }
    };
    PurchaseSetupComponent.prototype.filterRepairOrderList = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadRepairOrderList(event.query);
        }
    };
    PurchaseSetupComponent.prototype.filterSalesOrderList = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadSalesOrderList(event.query);
        }
    };
    PurchaseSetupComponent.prototype.loadPercentData = function () {
        var _this = this;
        this.commonService.smartDropDownList('[Percent]', 'PercentId', 'PercentValue').subscribe(function (res) {
            var data = res.map(function (x) {
                return {
                    percentId: x.value,
                    percentValue: x.label
                };
            });
            _this.allPercentData = [
                { percentId: 0, percentValue: '-- Select --' }
            ];
            _this.allPercentData = __spreadArrays(_this.allPercentData, data);
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.loadVendorList = function (filterVal) {
        var _this = this;
        if (filterVal === void 0) { filterVal = ''; }
        if (this.arrayVendlsit.length == 0) {
            this.arrayVendlsit.push(0);
        }
        this.vendorService.getVendorNameCodeListwithFilter(filterVal, 20, this.arrayVendlsit.join(), this.currentUserMasterCompanyId).subscribe(function (res) {
            _this.allActions = res;
            _this.vendorNames = res;
            _this.vendorCodes = res;
            _this.splitVendorNames = res;
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.filterVendorCodes = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadVendorList(event.query);
        }
    };
    PurchaseSetupComponent.prototype.filterRequisitioner = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.employeedata(event.query, this.headerInfo.managementStructureId);
        }
    };
    PurchaseSetupComponent.prototype.filterVendorNames = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadVendorList(event.query);
        }
    };
    PurchaseSetupComponent.prototype.onDelPNRow = function (partList, index) {
        var _this = this;
        this.enablePartSave();
        if (partList.purchaseOrderPartRecordId !== undefined && partList.purchaseOrderPartRecordId !== null) {
            this.partListData = this.partListData.map(function (x) {
                if (x.purchaseOrderPartRecordId == partList.purchaseOrderPartRecordId) {
                    return __assign(__assign({}, x), { isDeleted: true });
                }
                else {
                    return x;
                }
            });
        }
        else {
            this.partListData.splice(index, 1);
        }
        if (this.partListData.length == 1) {
            this.partListData.map(function (x) {
                if (x.isDeleted) {
                    _this.totalExtCost = '0.00';
                    _this.totalDiscAmount = '0.00';
                }
            });
        }
    };
    PurchaseSetupComponent.prototype.onSaveAddressMemo = function () {
        if (this.addressMemoLabel == 'Edit Ship') {
            this.sourcePoApproval.shipToMemo = this.tempMemo;
        }
        if (this.addressMemoLabel == 'Edit Bill') {
            this.sourcePoApproval.billToMemo = this.tempMemo;
        }
        this.enableAddSaveBtn = true;
    };
    PurchaseSetupComponent.prototype.onAddMemo = function () {
        this.headerMemo = this.headerInfo.poMemo;
    };
    PurchaseSetupComponent.prototype.onSaveMemo = function () {
        this.headerInfo.poMemo = this.headerMemo;
        this.enableHeaderSaveBtn = true;
    };
    PurchaseSetupComponent.prototype.onAddContactMemo = function () {
        this.contactMemo = this.vendorContactInfo.notes;
    };
    PurchaseSetupComponent.prototype.onSaveContactMemo = function () {
        this.vendorContactInfo.notes = this.contactMemo;
        // this.enableHeaderSaveBtn = true;
    };
    PurchaseSetupComponent.prototype.onAddNotes = function () {
        this.headerNotes = this.headerInfo.notes;
    };
    PurchaseSetupComponent.prototype.onSaveNotes = function () {
        this.headerInfo.notes = this.headerNotes;
        this.enableHeaderSaveBtn = true;
    };
    PurchaseSetupComponent.prototype.onSelectNeedByDate = function () {
        this.needByTempDate = this.headerInfo.needByDate;
        if (this.partListData) {
            for (var i = 0; i < this.partListData.length; i++) {
                this.partListData[i].needByDate = this.needByTempDate;
            }
        }
        for (var i = 0; i < this.partListData.length; i++) {
            if (this.partListData[i].childList) {
                if (this.partListData[i].childList.length > 0) {
                    for (var j = 0; j < this.partListData[i].childList.length; j++) {
                        this.partListData[i].childList[j].needByDate = this.needByTempDate;
                    }
                }
            }
        }
    };
    PurchaseSetupComponent.prototype.onSelectPriority = function () {
        if (this.partListData) {
            for (var i = 0; i < this.partListData.length; i++) {
                if (!this.partListData[i].isApproved) {
                    this.partListData[i].priorityId = this.headerInfo.priorityId ? autocomplete_1.editValueAssignByCondition('value', this.headerInfo.priorityId) : null;
                }
            }
            for (var i = 0; i < this.partListData.length; i++) {
                if (this.partListData[i].childList) {
                    if (this.partListData[i].childList.length > 0) {
                        for (var j = 0; j < this.partListData[i].childList.length; j++) {
                            if (!this.partListData[i].isApproved) {
                                this.partListData[i].childList[j].priorityId = this.headerInfo.priorityId ? autocomplete_1.editValueAssignByCondition('label', this.headerInfo.priorityId) : null;
                            }
                        }
                    }
                }
            }
        }
    };
    PurchaseSetupComponent.prototype.onGetDiscPerUnitByUnitCost = function (partList) {
        partList.unitCost = partList.unitCost ? autocomplete_1.formatNumberAsGlobalSettingsModule(partList.unitCost, 2) : '0.00';
        if (partList.vendorListPrice !== null && partList.vendorListPrice !== undefined) {
            var quantityOrdered = partList.quantityOrdered ? parseInt(partList.quantityOrdered.toString().replace(/\,/g, '')) : 0;
            var vendorListPrice = partList.vendorListPrice ? parseFloat(partList.vendorListPrice.toString().replace(/\,/g, '')) : 0;
            var unitCost = partList.unitCost ? parseFloat(partList.unitCost.toString().replace(/\,/g, '')) : 0;
            if (unitCost > vendorListPrice) {
                this.alertService.showMessage('Error', "Unit Cost cannot be greater than Vend List Price", alert_service_1.MessageSeverity.error);
                unitCost = 0;
                partList.unitCost = '0.00';
            }
            var discountPerUnit = (vendorListPrice - unitCost);
            partList.discountPerUnit = discountPerUnit ? autocomplete_1.formatNumberAsGlobalSettingsModule(discountPerUnit, 2) : '0.00';
            partList.extendedCost = (quantityOrdered * unitCost);
            partList.extendedCost = autocomplete_1.formatNumberAsGlobalSettingsModule(partList.extendedCost, 2);
            this.onGetDiscPercent(partList);
            this.getTotalExtCost();
        }
    };
    PurchaseSetupComponent.prototype.onGetDiscPercent = function (partList) {
        if (partList.vendorListPrice !== null && partList.vendorListPrice !== undefined && partList.vendorListPrice !== '0.00') {
            var discountPerUnit = partList.discountPerUnit ? parseFloat(partList.discountPerUnit.toString().replace(/\,/g, '')) : 0;
            var vendorListPrice = partList.vendorListPrice ? parseFloat(partList.vendorListPrice.toString().replace(/\,/g, '')) : 0;
            var discountPercentValue = Math.round((discountPerUnit * 100) / vendorListPrice).toFixed(2);
            partList.discountPercent = autocomplete_1.getObjectByValue('percentValue', discountPercentValue, this.allPercentData);
            partList.discountPercent = partList.discountPercent.percentId;
        }
    };
    PurchaseSetupComponent.prototype.getAltEquiPartNumByObject = function (obj) {
        if (obj.altEquiPartNumberId) {
            return obj.altEquiPartNumberId;
        }
    };
    PurchaseSetupComponent.prototype.getIdByObject = function (obj) {
        if (obj.customerId) {
            return obj.customerId;
        }
        if (obj.vendorId) {
            return obj.vendorId;
        }
        if (obj.value) {
            return obj.value;
        }
    };
    PurchaseSetupComponent.prototype.getCurrencyIdByObject = function (obj) {
        if (obj.value) {
            return obj.value;
        }
    };
    PurchaseSetupComponent.prototype.getShipToBillToUserId = function (obj) {
        if (obj.vendorId) {
            return obj.vendorId;
        }
        if (obj.customerId) {
            return obj.customerId;
        }
        if (obj.value) {
            return obj.value;
        }
    };
    PurchaseSetupComponent.prototype.getEmployeeId = function (obj) {
        if (obj.value) {
            return obj.value;
        }
        else {
            return 0;
        }
    };
    PurchaseSetupComponent.prototype.getValueFromObj = function (obj) {
        if (obj.value) {
            return obj.value;
        }
        else {
            return null;
        }
    };
    PurchaseSetupComponent.prototype.getShipBillContactId = function (obj) {
        if (obj.contactId) {
            return obj.contactId;
        }
        else {
            return 0;
        }
    };
    PurchaseSetupComponent.prototype.getVendorContactId = function (obj) {
        if (obj.vendorContactId) {
            return obj.vendorContactId;
        }
        else {
            return 0;
        }
    };
    PurchaseSetupComponent.prototype.getVendorContactPhone = function (obj) {
        if (obj.vendorPhone) {
            return obj.vendorPhone;
        }
        else {
            return 0;
        }
    };
    PurchaseSetupComponent.prototype.getPriorityId = function (obj) {
        if (obj.value) {
            return obj.value;
        }
        else {
            return 0;
        }
    };
    PurchaseSetupComponent.prototype.getVendorId = function (obj) {
        if (obj.vendorId) {
            return obj.vendorId;
        }
        else {
            return 0;
        }
    };
    PurchaseSetupComponent.prototype.resetAddressShippingForm = function () {
        this.addressFormForShipping = new customer_shipping_model_1.CustomerShippingModel();
        this.isEditModeShipping = false;
    };
    PurchaseSetupComponent.prototype.resetAddressBillingForm = function () {
        this.addressFormForBilling = new customer_shipping_model_1.CustomerShippingModel();
        this.isEditModeBilling = false;
    };
    PurchaseSetupComponent.prototype.splitAddChange = function () {
        this.splitAddbutton = true;
    };
    PurchaseSetupComponent.prototype.resetAddressForm = function () {
        this.addNewAddress = new customer_shipping_model_1.CustomerShippingModel();
        this.isEditModeSplitAddress = false;
        this.isEditModeSplitPoOnly = false;
    };
    PurchaseSetupComponent.prototype.onEditShipVia = function (data) {
        this.tempshipVia = autocomplete_1.getObjectById('shipViaId', data.shipViaId, this.shipViaList);
        this.addShipViaFormForShipping = __assign(__assign({}, this.tempshipVia), { shipVia: this.tempshipVia.name });
        this.isEditModeShipVia = true;
    };
    PurchaseSetupComponent.prototype.onClickPartsListAddress = function (value, splitPart, pindex, cindex) {
        var _this = this;
        this.tempSplitPart = splitPart;
        this.parentIndex = pindex;
        this.childIndex = cindex;
        this.issplitSiteNameAlreadyExists = false;
        this.tempSplitAddressData = this["splitAddressData" + pindex + cindex];
        if (value === 'Add') {
            this.addressHeader = 'Add Split Shipment Address';
            this.resetAddressForm();
            this.splitmoduleId = splitPart.partListUserTypeId;
            this.splituserId = this.getIdByObject(splitPart.partListUserId);
            this.splitAddbutton = true;
            this.isEditModeSplitAddress = false;
            this.isEditModeSplitPoOnly = false;
            this.commonService.getaddressdetailsOnlyUserbyuser(this.splitmoduleId, this.splituserId, 'Ship', this.poId).subscribe(function (returnddataforbill) {
                _this.splitSieListOriginal = returnddataforbill.address.map(function (x) {
                    return {
                        siteName: x.siteName, siteId: x.siteId
                    };
                });
            });
        }
        if (value === 'Edit') {
            this.addressHeader = 'Edit Split Shipment Address';
            this.splitAddbutton = false;
            this.splitmoduleId = splitPart.partListUserTypeId;
            this.splituserId = this.getIdByObject(splitPart.partListUserId);
            this.tempSplitAddress = autocomplete_1.getObjectById('siteID', splitPart.poPartSplitSiteId, this["splitAddressData" + pindex + cindex]);
            this.editSiteName = this.tempSplitAddress.siteName;
            if (this.tempSplitAddress.isPoOnly)
                this.isEditModeSplitPoOnly = true;
            else
                this.isEditModeSplitAddress = true;
            this.addNewAddress = __assign(__assign({}, this.tempSplitAddress), { countryId: autocomplete_1.getObjectByValue('value', this.tempSplitAddress.countryId, this.allCountriesList) });
            this.commonService.getaddressdetailsOnlyUserbyuser(this.splitmoduleId, this.splituserId, 'Ship', this.poId).subscribe(function (returnddataforbill) {
                _this.splitSieListOriginal = returnddataforbill.address.map(function (x) {
                    return {
                        siteName: x.siteName, siteId: x.siteId
                    };
                });
                _this.addNewAddress.siteName = autocomplete_1.getObjectByValue('siteName', _this.tempSplitAddress.siteName, _this.splitSieListOriginal);
            });
        }
    };
    PurchaseSetupComponent.prototype.saveShippingAddress = function () {
        var _this = this;
        var data = __assign(__assign({}, this.addNewAddress), { createdBy: this.userName, updatedBy: this.userName, masterCompanyId: this.currentUserMasterCompanyId, isActive: true });
        var addressData = __assign(__assign({}, data), { userTypeId: this.splitmoduleId, userId: this.splituserId, siteName: autocomplete_1.editValueAssignByCondition('siteName', data.siteName), countryId: autocomplete_1.getValueFromObjectByKey('value', data.countryId) });
        if (!this.isEditModeSplitAddress) {
            this.commonService.createAllAddres(addressData).subscribe(function (response) {
                if (response) {
                    _this.onUserNameChange(_this.splitmoduleId, _this.splituserId, addressData, _this.parentIndex, _this.childIndex, response);
                    _this.alertService.showMessage('Success', "Saved Shipping Information Successfully", alert_service_1.MessageSeverity.success);
                }
                else {
                    _this.alertService.showMessage('Error', "Eroor While Saving Shipping Address", alert_service_1.MessageSeverity.error);
                }
            }, function (err) {
                _this.isSpinnerVisible = false;
            });
        }
        else {
            this.commonService.createAllAddres(addressData).subscribe(function (response) {
                if (response) {
                    _this.onUserNameChange(_this.splitmoduleId, _this.splituserId, addressData, _this.parentIndex, _this.childIndex, response);
                    _this.alertService.showMessage('Success', "Shipping Information Updated Successfully", alert_service_1.MessageSeverity.success);
                }
                else {
                    _this.alertService.showMessage('Error', "Eroor While Saving Shipping Address", alert_service_1.MessageSeverity.error);
                }
            }, function (err) {
                _this.isSpinnerVisible = false;
            });
        }
    };
    PurchaseSetupComponent.prototype.saveShippingAddressToPO = function () {
        var _this = this;
        var data = __assign(__assign({}, this.addNewAddress), { createdBy: this.userName, updatedBy: this.userName, masterCompanyId: this.currentUserMasterCompanyId, isActive: true });
        var addressData = __assign(__assign({}, data), { purchaseOrderID: this.id, isPoOnly: true, siteName: autocomplete_1.editValueAssignByCondition('siteName', data.siteName), userTypeId: this.splitmoduleId, userId: this.splituserId, countryId: autocomplete_1.getValueFromObjectByKey('value', data.countryId) });
        if (!this.isEditModeSplitPoOnly) {
            this.commonService.createAllAddres(addressData).subscribe(function (response) {
                if (response) {
                    _this.onUserNameChange(_this.splitmoduleId, _this.splituserId, addressData, _this.parentIndex, _this.childIndex, response);
                    ;
                    _this.alertService.showMessage('Success', "Saved Shipping Information Successfully", alert_service_1.MessageSeverity.success);
                }
                else {
                    _this.alertService.showMessage('Error', "Eroor While Saving Shipping Address", alert_service_1.MessageSeverity.error);
                }
            }, function (err) {
                _this.isSpinnerVisible = false;
            });
        }
        else {
            this.commonService.createAllAddres(addressData).subscribe(function (response) {
                if (response) {
                    _this.onUserNameChange(_this.splitmoduleId, _this.splituserId, addressData, _this.parentIndex, _this.childIndex, response);
                    ;
                    _this.alertService.showMessage('Success', "Shipping Information Updated Successfully", alert_service_1.MessageSeverity.success);
                }
                else {
                    _this.alertService.showMessage('Error', "Eroor While Saving Shipping Address", alert_service_1.MessageSeverity.error);
                }
            }, function (err) {
                _this.isSpinnerVisible = false;
            });
        }
    };
    PurchaseSetupComponent.prototype.onChangeParentQtyOrdered = function (event, partList) {
        this.parentQty = event.target.value;
        if (partList.minimumOrderQuantity > 0
            && this.parentQty > 0
            && this.parentQty < partList.minimumOrderQuantity) {
            partList.quantityOrdered = partList.minimumOrderQuantity;
            var childQty = 0;
            if (partList.childList != null && partList.childList.length > 0) {
                for (var j = 0; j < partList.childList.length; j++) {
                    if (!partList.childList[j].isDeleted) {
                        childQty += partList.childList[j].quantityOrdered ? parseInt(partList.childList[j].quantityOrdered.toString().replace(/\,/g, '')) : 0;
                    }
                }
                var quantityOrdered = partList.quantityOrdered ? parseInt(partList.quantityOrdered.toString().replace(/\,/g, '')) : 0;
                partList.remQty = quantityOrdered - childQty;
            }
            this.alertService.showMessage('Error', 'Minimum Order Qty : ' + partList.minimumOrderQuantity + '<br /> Order quantity can not be less then Minimum order quantity.', alert_service_1.MessageSeverity.error);
            return;
        }
        if (partList.childList.length > 0) {
            this.onChangeChildQtyOrdered(partList);
        }
    };
    PurchaseSetupComponent.prototype.getRemainingAllQty = function () {
        var childQty = 0;
        if (this.partList && this.partList.length > 0) {
            for (var i = 0; i < this.partList[i].length; i++) {
                childQty = 0;
                if (this.partList[i].childList != null && this.partList[i].childList.length > 0) {
                    for (var j = 0; j < this.partList[i].childList.length; j++) {
                        childQty += this.partList[i].childList[j].quantityOrdered ? parseInt(this.partList[i].childList[j].quantityOrdered.toString().replace(/\,/g, '')) : 0;
                    }
                }
                var quantityOrdered = this.partList[i].quantityOrdered ? parseInt(this.partList[i].quantityOrdered.toString().replace(/\,/g, '')) : 0;
                this.partList[i].remQty = quantityOrdered - childQty;
            }
        }
    };
    PurchaseSetupComponent.prototype.onChangeChildQtyOrdered = function (partList, partChildList) {
        this.childOrderQtyArray = [];
        this.childOrderQtyTotal = null;
        this.parentQty = partList.quantityOrdered ? parseFloat(partList.quantityOrdered.toString().replace(/\,/g, '')) : 0;
        for (var i = 0; i < partList.childList.length; i++) {
            if (partList.childList[i].quantityOrdered === null || partList.childList[i].quantityOrdered === undefined || partList.childList[i].isDeleted) {
                partList.childList[i].quantityOrdered = 0;
            }
            this.childOrderQtyArray.push(parseInt(partList.childList[i].quantityOrdered.toString().replace(/\,/g, '')));
            this.childOrderQtyTotal = this.childOrderQtyArray.reduce(function (acc, val) { return acc + val; }, 0);
            if (this.childOrderQtyTotal > this.parentQty) {
                if (partChildList) {
                    partChildList.quantityOrdered = 0;
                }
                else {
                    partList.quantityOrdered = 0;
                }
            }
        }
        if (this.childOrderQtyTotal > this.parentQty) {
            this.alertService.showMessage('Error', 'Total Child Order Quantity exceeded the Parent Quantity!', alert_service_1.MessageSeverity.error);
        }
        if (partChildList) {
            partChildList.quantityOrdered = partChildList.quantityOrdered ? autocomplete_1.formatNumberAsGlobalSettingsModule(partChildList.quantityOrdered, 0) : 0;
        }
        var childQty = 0;
        if (partList.childList != null && partList.childList.length > 0) {
            for (var j = 0; j < partList.childList.length; j++) {
                if (!partList.childList[j].isDeleted) {
                    childQty += partList.childList[j].quantityOrdered ? parseInt(partList.childList[j].quantityOrdered.toString().replace(/\,/g, '')) : 0;
                }
            }
            var quantityOrdered = partList.quantityOrdered ? parseInt(partList.quantityOrdered.toString().replace(/\,/g, '')) : 0;
            partList.remQty = quantityOrdered - childQty;
        }
    };
    PurchaseSetupComponent.prototype.filterVenContactFirstNames = function (event) {
        this.venContactFirstNames = [];
        for (var i = 0; i < this.venContactList.length; i++) {
            var firstName = this.venContactList[i].firstName;
            if (firstName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.venContactFirstNames.push(firstName);
            }
        }
        this.venContactFirstNames = this.venContactFirstNames.filter(function (el, i, a) { return i === a.indexOf(el); });
    };
    PurchaseSetupComponent.prototype.filterVenContactLastNames = function (event) {
        this.venContactLastNames = [];
        for (var i = 0; i < this.venContactList.length; i++) {
            var lastName = this.venContactList[i].lastName;
            if (lastName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.venContactLastNames.push(lastName);
            }
        }
        this.venContactLastNames = this.venContactLastNames.filter(function (el, i, a) { return i === a.indexOf(el); });
    };
    PurchaseSetupComponent.prototype.filterVenContactMiddleNames = function (event) {
        this.venContactMiddleNames = [];
        for (var i = 0; i < this.venContactList.length; i++) {
            var middleName = this.venContactList[i].middleName;
            if (middleName != "" && middleName != null && middleName != null) {
                if (middleName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.venContactMiddleNames.push(middleName);
                }
            }
        }
        this.venContactMiddleNames = this.venContactMiddleNames.filter(function (el, i, a) { return i === a.indexOf(el); });
    };
    PurchaseSetupComponent.prototype.resetVenContactInfo = function () {
        this.vendorContactInfo = new Object();
    };
    PurchaseSetupComponent.prototype.addContactForVendor = function () {
        var _this = this;
        var vendorContactInfo = __assign(__assign({}, this.vendorContactInfo), { vendorId: autocomplete_1.editValueAssignByCondition('vendorId', this.headerInfo.vendorId), isDefaultContact: this.vendorContactInfo.isDefaultContact ? this.vendorContactInfo.isDefaultContact : false, createdBy: this.userName, updatedBy: this.userName, masterCompanyId: this.currentUserMasterCompanyId });
        this.vendorService.newAddContactInfo(vendorContactInfo).subscribe(function (res) {
            var data = __assign(__assign({}, res), { createdBy: _this.userName, updatedBy: _this.userName, isDefaultContact: _this.vendorContactInfo.isDefaultContact ? _this.vendorContactInfo.isDefaultContact : false, masterCompanyId: _this.currentUserMasterCompanyId, vendorId: autocomplete_1.editValueAssignByCondition('vendorId', _this.headerInfo.vendorId) });
            _this.vendorService.newAddvendorContact(data).subscribe(function (data) {
                _this.getVendorContactsListByID(vendorContactInfo.vendorId);
                _this.alertService.showMessage('Success', "Saved Vendor Contact Successfully", alert_service_1.MessageSeverity.success);
            }, function (err) {
                _this.isSpinnerVisible = false;
            });
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.patternMobilevalidationWithSpl = function (event) {
        var pattern = /[0-9\+\-()\ ]/;
        var inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    };
    PurchaseSetupComponent.prototype.checkValidOnChange = function (condition, value) {
        if (condition != null && condition != 0 && value == "companyId") {
            this.managementValidCheck = false;
        }
        if (condition != null && condition != 0 && value == "shipToUserTypeId") {
            this.shipToUserTypeValidCheck = false;
        }
        if (condition != null && condition != 0 && value == "shipToSiteId") {
            this.shipToSiteNameValidCheck = false;
        }
        if (condition != null && condition != 0 && value == "shipViaId") {
            this.shipViaValidCheck = false;
        }
        if (condition != null && condition != 0 && value == "billToUserTypeId") {
            this.billToUserTypeValidCheck = false;
        }
        if (condition != null && condition != 0 && value == "billToSiteId") {
            this.billToSiteNameValidCheck = false;
        }
    };
    PurchaseSetupComponent.prototype.viewSelectedCapsRow = function (rowData) {
        var vendorCapabilityId = rowData.vendorCapabilityId;
        this.getVendorCapabilitiesView(vendorCapabilityId);
        this.getVendorCapesAircraftView(vendorCapabilityId);
    };
    PurchaseSetupComponent.prototype.getVendorCapabilitiesView = function (vendorCapesId) {
        var _this = this;
        this.vendorCapesService.getVendorCapabilitybyId(vendorCapesId).subscribe(function (res) {
            _this.vendorCapesGeneralInfo = __assign(__assign({}, res), { cost: res.cost ? autocomplete_1.formatNumberAsGlobalSettingsModule(res.cost, 2) : '0.00' });
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.getVendorCapesAircraftView = function (vendorCapesId) {
        var _this = this;
        this.vendorCapesService.getVendorAircraftGetDataByCapsId(vendorCapesId).subscribe(function (res) {
            _this.aircraftListDataValues = res.map(function (x) {
                return __assign(__assign({}, x), { aircraft: x.aircraftType, model: x.aircraftModel, dashNumber: x.dashNumber, memo: x.memo });
            });
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.onSelectStatus = function () {
        if (this.headerInfo.statusId == this.poFulfillingstatusID) {
            this.disableAddPart = true;
            this.enableHeaderSaveBtn = true;
        }
        else {
            this.disableAddPart = false;
            this.enableHeaderSaveBtn = false;
        }
        if (this.headerInfo.statusId == this.poOpenstatusID) {
            this.disableHeaderInfo = false;
        }
        else {
            this.disableHeaderInfo = true;
        }
    };
    PurchaseSetupComponent.prototype.enableHeaderSave = function () {
        if (this.createPOForm.valid) {
            this.enableHeaderSaveBtn = true;
        }
        else {
            this.enableHeaderSaveBtn = false;
        }
    };
    PurchaseSetupComponent.prototype.enablePartSave = function () {
        this.enablePartSaveBtn = true;
    };
    PurchaseSetupComponent.prototype.enableAddSave = function () {
        this.enableAddSaveBtn = true;
    };
    PurchaseSetupComponent.prototype.onChangeShippingHandlingCost = function (str) {
        this.sourcePoApproval[str] = this.sourcePoApproval[str] ? autocomplete_1.formatNumberAsGlobalSettingsModule(this.sourcePoApproval[str], 2) : '0.00';
    };
    PurchaseSetupComponent.prototype.openVendorCapesHistory = function (row) {
        var _this = this;
        this.isSpinnerVisible = true;
        this.vendorService.getVendorCapabilityAuditHistory(row.vendorCapabilityId, row.vendorId).subscribe(function (res) {
            _this.capabilityauditHistory = res.map(function (x) {
                return __assign(__assign({}, x), { cost: x.cost ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.cost, 2) : '0.00' });
            });
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.getColorCodeForHistory = function (i, field, value) {
        var data = this.capabilityauditHistory;
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
    PurchaseSetupComponent.prototype.selectAllApproval = function (isSelected) {
        var _this = this;
        this.approvalProcessList.forEach(function (x) {
            var disableEdit = _this.getPartToDisableOrNot(x);
            if ((x.actionId != _this.ApprovedstatusId && x.actionId != 0) && disableEdit) {
                x.isSelected = !isSelected;
            }
        });
        this.selectEachApproval();
    };
    PurchaseSetupComponent.prototype.onStatusChange = function (approver) {
        if (approver.isParent) {
            for (var j = 0; j < this.approvalProcessList.length; j++) {
                if (this.approvalProcessList[j].parentId == approver.purchaseOrderPartId
                    && this.approvalProcessList[j].actionId != this.ApprovedstatusId &&
                    this.approvalProcessList[j].actionStatus != 'Returned to Requisitioner') {
                    this.approvalProcessList[j].statusId = approver.statusId;
                    this.approvalProcessList[j].sentDate = approver.sentDate;
                    this.approvalProcessList[j].approvedDate = approver.approvedDate;
                }
            }
        }
    };
    PurchaseSetupComponent.prototype.selectApproval = function (approver) {
        if (approver.isSelected) {
            if (approver.isParent) {
                for (var j = 0; j < this.approvalProcessList.length; j++) {
                    var disableEdit = this.getPartToDisableOrNot(this.approvalProcessList[j]);
                    if (this.approvalProcessList[j].parentId == approver.purchaseOrderPartId
                        && this.approvalProcessList[j].actionId != this.ApprovedstatusId
                        && disableEdit) {
                        this.approvalProcessList[j].isSelected = true;
                    }
                }
            }
            this.enableApproverSaveBtn = true;
        }
        else {
            approver.statusId = approver.previousstatusId;
            this.selectallApprovers = false;
            if (approver.isParent) {
                for (var j = 0; j < this.approvalProcessList.length; j++) {
                    if (this.approvalProcessList[j].parentId == approver.purchaseOrderPartId) {
                        this.approvalProcessList[j].isSelected = false;
                        this.selectallApprovers = false;
                        this.approvalProcessList[j].statusId = this.approvalProcessList[j].previousstatusId;
                    }
                }
            }
            this.enableApproverSaveBtn = false;
            for (var j = 0; j < this.approvalProcessList.length; j++) {
                if (this.approvalProcessList[j].isSelected) {
                    this.enableApproverSaveBtn = true;
                }
            }
        }
    };
    PurchaseSetupComponent.prototype.selectEachApproval = function () {
        for (var i = 0; i < this.approvalProcessList.length; i++) {
            if (this.approvalProcessList[i].isSelected) {
                this.enableApproverSaveBtn = true;
                break;
            }
            else {
                this.enableApproverSaveBtn = false;
                this.approvalProcessList[i].statusId = this.approvalProcessList[i].previousstatusId;
            }
        }
    };
    PurchaseSetupComponent.prototype.saveApprovalProcess = function () {
        var _this = this;
        var data = [];
        this.isSpinnerVisible = true;
        this.approvalProcessList = this.approvalProcessList.map(function (x) {
            return __assign(__assign({}, x), { legalEntityId: _this.currentUserLegalEntityId, internalEmails: _this.apporoverEmailList, approvers: _this.apporoverNamesList.join(), approvedById: x.actionId == _this.SubmitInternalApprovalID ? parseInt(_this.employeeId.toString()) : 0, rejectedBy: x.actionId == _this.SubmitInternalApprovalID ? parseInt(_this.employeeId.toString()) : 0, createdBy: _this.userName, updatedBy: _this.userName });
        });
        var selectedcnt = 0;
        var waitingforcnt = 0;
        this.approvalProcessList.map(function (x) {
            if (x.isSelected) {
                data.push(x);
                selectedcnt++;
            }
        });
        data.forEach(function (x) {
            if (x.statusId == 4) {
                waitingforcnt++;
            }
        });
        if (selectedcnt == waitingforcnt) {
            this.alertService.showMessage('Error', 'Select atleast one part other than Waiting for Approval status', alert_service_1.MessageSeverity.error);
            this.isSpinnerVisible = false;
            return;
        }
        this.purchaseOrderService.savePurchaseOrderApproval(data).subscribe(function (res) {
            if (res) {
                _this.getApprovalProcessListById(_this.poId);
                _this.headerInfo.statusId = res.response;
                //this.getVendorPOHeaderById(this.poId);
                _this.enableHeaderSaveBtn = false;
                if (_this.headerInfo.statusId == _this.poFulfillingstatusID) {
                    _this.disableAddPart = true;
                }
                else {
                    _this.disableAddPart = false;
                }
                _this.isSpinnerVisible = false;
                _this.alertService.showMessage('Success', "Saved Approver Process Successfully", alert_service_1.MessageSeverity.success);
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
        this.enableHeaderSaveBtn = false;
    };
    PurchaseSetupComponent.prototype.showAlertMessage = function () {
        $('#warnRestrictMesg').modal("show");
    };
    PurchaseSetupComponent.prototype.WarnRescticModel = function () {
        this.isEditWork = false;
        $('#warnRestrictMesg').modal("hide");
        // this.warningMessage = '';
        // this.restrictMessage = '';
        if (this.restrictID != 0) {
            this.headerInfo.vendorCode = null;
            this.headerInfo.vendorId = null;
            this.headerInfo.vendorContactId = null;
            this.headerInfo.vendorContactPhone = null;
        }
    };
    PurchaseSetupComponent.prototype.getPartToDisableOrNot = function (part) {
        var _this = this;
        if (part.actionStatus != 'Approved') {
            if (part.actionId == this.SentForInternalApprovalID) {
                return true;
            }
            else if (part.actionId == this.SubmitInternalApprovalID) {
                if (this.internalApproversList && this.internalApproversList.length > 0) {
                    var approverFound = this.internalApproversList.find(function (approver) { return approver.approverId == _this.employeeId && approver.isExceeded == false; });
                    if (approverFound) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    };
    PurchaseSetupComponent.prototype.GetSubWolist = function (workOrderId, partList, index) {
        var _this = this;
        this.allsubWorkOrderDetails = [];
        this.commonService.GetSubWolist(workOrderId).subscribe(function (res) {
            var data = res.map(function (x) {
                return {
                    value: x.subWorkOrderId,
                    label: x.subWorkOrderNo
                };
            });
            //this.suborderlist = data;
            _this.allsubWorkOrderInfo = __spreadArrays(_this.allsubWorkOrderInfo, data);
            _this.allsubWorkOrderDetails = __spreadArrays(_this.allsubWorkOrderInfo, data);
            partList.subWorkOrderlist = __spreadArrays(_this.allsubWorkOrderInfo, data);
        }, function (err) {
            _this.isSpinnerVisible = false;
        });
    };
    PurchaseSetupComponent.prototype.getPartnumber = function (id) {
        this.partNumber = this.partCollection.find(function (x) { return x.value == id; });
        this.partNumber = this.partNumber["label"];
        return this.partNumber;
    };
    PurchaseSetupComponent.prototype.getAltEquiPartNumer = function (id) {
        this.altPartNumber = this.altPartCollection.find(function (x) { return x.altEquiPartNumberId == id.altEquiPartNumberId; });
        this.altPartNumber = this.altPartNumber["altEquiPartNumber"];
        return this.altPartNumber;
    };
    PurchaseSetupComponent.prototype.getPriorityName = function (id) {
        this.prioritys = this.allPriorityInfo.find(function (x) { return x.value == id; });
        this.prioritys = this.prioritys["label"];
        return this.prioritys;
    };
    PurchaseSetupComponent.prototype.getCondition = function (id) {
        this.condition = this.allconditioninfo.find(function (x) { return x.value == id; });
        this.condition = this.condition["label"];
        return this.condition;
    };
    PurchaseSetupComponent.prototype.getlabelFromObj = function (obj) {
        if (obj.value) {
            return obj.label;
        }
        else {
            return null;
        }
    };
    PurchaseSetupComponent.prototype.addPartNumbers = function (partNumberId, partName, conditionid) {
        this.inputValidCheck = false;
        //if (this.vendorService.isEditMode == false) {
        var newParentObject = new create_po_partslist_model_1.CreatePOPartsList();
        newParentObject = __assign(__assign({}, newParentObject), { needByDate: this.headerInfo.needByDate, priorityId: this.headerInfo.priorityId ? autocomplete_1.editValueAssignByCondition('value', this.headerInfo.priorityId) : null, conditionId: conditionid > 0 ? conditionid : this.defaultCondtionId, discountPercent: 0, partNumberId: { value: partNumberId, label: partName }, workOrderId: autocomplete_1.getObjectById('value', this.lsWoId == null ? 0 : this.lsWoId, this.allWorkOrderDetails), subWorkOrderId: autocomplete_1.getObjectById('value', this.lsSubWoId == null ? 0 : this.lsSubWoId, this.allSalesOrderInfo), salesOrderId: autocomplete_1.getObjectById('value', this.salesOrderId == null ? 0 : this.salesOrderId, this.allSalesOrderInfo) });
        this.partListData.push(newParentObject);
        for (var i = 0; i < this.partListData.length; i++) {
            if (!this.partListData[i].ifSplitShip) {
                this.partListData[i].childList = [];
            }
        }
        if (this.headerInfo.companyId > 0) {
            for (var i = 0; i < this.partListData.length; i++) {
                if (i == this.partListData.length - 1) {
                    this.partListData[i].maincompanylist = this.maincompanylist;
                    this.partListData[i].parentCompanyId = this.headerInfo.companyId;
                    this.partListData[i].managementStructureId = this.headerInfo.companyId;
                    this.partListData[i].parentBulist = this.bulist;
                    this.partListData[i].parentDivisionlist = this.divisionlist;
                    this.partListData[i].parentDepartmentlist = this.departmentList;
                    ;
                    this.partListData[i].parentbuId = 0;
                    this.partListData[i].parentDivisionId = 0;
                    this.partListData[i].parentDeptId = 0;
                }
            }
        }
        if (this.headerInfo.buId) {
            for (var i = 0; i < this.partListData.length; i++) {
                if (i == this.partListData.length - 1) {
                    this.partListData[i].parentBulist = this.bulist;
                    this.partListData[i].parentbuId = this.headerInfo.buId;
                    this.partListData[i].managementStructureId = this.headerInfo.buId;
                    this.partListData[i].parentDivisionId = 0;
                    this.partListData[i].parentDeptId = 0;
                }
            }
        }
        if (this.headerInfo.divisionId) {
            for (var i = 0; i < this.partListData.length; i++) {
                if (i == this.partListData.length - 1) {
                    this.partListData[i].parentDivisionlist = this.divisionlist;
                    this.partListData[i].parentDivisionId = this.headerInfo.divisionId;
                    this.partListData[i].managementStructureId = this.headerInfo.divisionId;
                    this.partListData[i].parentDeptId = 0;
                }
            }
        }
        if (this.headerInfo.departmentId) {
            for (var i = 0; i < this.partListData.length; i++) {
                if (i == this.partListData.length - 1) {
                    this.partListData[i].parentDepartmentlist = this.departmentList;
                    this.partListData[i].parentDeptId = this.headerInfo.departmentId;
                    this.partListData[i].managementStructureId = this.headerInfo.departmentId;
                }
            }
        }
        for (var i = 0; i < this.partListData.length; i++) {
            if (i == this.partListData.length - 1) {
                this.partListData[i].conditionId = this.defaultCondtionId;
                //this.partListData[i].salesOrderId = this.salesOrderId;
                this.getFunctionalReportCurrencyById(this.partListData[i]);
            }
        }
        this.getPNDetailsById(newParentObject, null);
        //}
        //this.getRemainingAllQty();
    };
    PurchaseSetupComponent.prototype.ngOnDestroy = function () {
        if (this.isEditMode) {
            localStorage.removeItem("itemMasterId");
            localStorage.removeItem("partNumber");
            localStorage.removeItem("salesOrderId");
            localStorage.removeItem("lsconditionId");
            localStorage.removeItem("lsWoId");
            localStorage.removeItem("lsSubWoId");
        }
    };
    __decorate([
        core_1.ViewChild('createPOForm', { static: false })
    ], PurchaseSetupComponent.prototype, "createPOForm");
    __decorate([
        core_1.ViewChild('createPOPartsForm', { static: false })
    ], PurchaseSetupComponent.prototype, "createPOPartsForm");
    __decorate([
        core_1.ViewChild('createPOAddressForm', { static: false })
    ], PurchaseSetupComponent.prototype, "createPOAddressForm");
    PurchaseSetupComponent = __decorate([
        core_1.Component({
            selector: 'app-purchase-setup',
            templateUrl: './purchase-setup.component.html',
            styleUrls: ['./purchase-setup.component.scss'],
            providers: [common_1.DatePipe]
        })
        /** purchase-setup component*/
    ], PurchaseSetupComponent);
    return PurchaseSetupComponent;
}());
exports.PurchaseSetupComponent = PurchaseSetupComponent;
