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
var $ = require("jquery");
var autocomplete_1 = require("../../../../generic/autocomplete");
var customer_shipping_model_1 = require("../../../../models/customer-shipping.model");
var customer_internationalshipping_model_1 = require("../../../../models/customer-internationalshipping.model");
var common_1 = require("@angular/common");
var PurchaseSetupComponent = /** @class */ (function () {
    function PurchaseSetupComponent(route, legalEntityService, currencyService, unitofmeasureService, conditionService, CreditTermsService, employeeService, vendorService, priority, alertService, glAccountService, authService, customerService, companyService, commonService, _actRoute, purchaseOrderService, vendorCapesService, itemser, datePipe, salesOrderReferenceStorage, stocklineReferenceStorage) {
        this.route = route;
        this.legalEntityService = legalEntityService;
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
        this.colsaircraftLD = [
            { field: "aircraft", header: "Aircraft" },
            { field: "model", header: "Model" },
            { field: "dashNumber", header: "Dash Numbers" },
            { field: "memo", header: "Memo" }
        ];
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
        this.fields = ['partsCost', 'partsRevPercentage', 'unitCost', 'extCost', 'qty', 'laborCost', 'laborRevPercentage', 'overHeadCost', 'overHeadPercentage', 'chargesCost', 'freightCost', 'exclusionCost', 'directCost', 'directCostPercentage', 'revenue', 'margin', 'marginPercentage'];
        this.approvalProcessHeader = [
            {
                header: 'Action',
                field: 'actionStatus'
            }, {
                header: 'Sent Date',
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
                header: 'PN',
                field: 'partNumber'
            }, {
                header: 'PN Desc',
                field: 'partDescription'
            }, {
                header: 'Item Type',
                field: 'itemType'
            }, {
                header: 'Stock Type',
                field: 'stockType'
            }, {
                header: 'Qty',
                field: 'qty'
            }, {
                header: 'Unit Cost',
                field: 'unitCost'
            }, {
                header: 'Ext Cost',
                field: 'extCost'
            }
        ];
        this.approvalProcessList = [];
        this.tempApproverObj = {};
        this.apporoverNamesList = [];
        this.disableApproverSelectAll = false;
        this.enableMultiPartAddBtn = false;
        this.moduleId = 0;
        this.referenceId = 0;
        this.moduleName = "PurchseOrder";
        this.warningID = 0;
        this.isEditWork = false;
        this.restrictID = 0;
        this.vendorService.ShowPtab = false;
        this.vendorService.alertObj.next(this.vendorService.ShowPtab);
        this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-purchase-setup';
        this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
    }
    PurchaseSetupComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.priorityData();
        this.loadModuleListForVendorComp();
        this.loadPOStatus();
        //#Happy this.loadManagementdata(); // 
        //#Happy this.loadCurrencyData();
        //#Happy this.loadConditionData();		
        //#Happy this.loadApprovalProcessStatus();
        //#Happy this.loadPOApproverStatus();		
        //#Happy this.loadcustomerData();		
        //#Happy this.getLegalEntity();
        //#Happy this.getCountriesList();
        //#Happy this.loadPercentData();
        //#Happy this.loadVendorContactInfo();
        //#Happy this.loadWorkOrderList();
        //#Happy this.loadRepairOrderList();
        //#Happy this.loadSalesOrderList();
        //#Happy this.loadShippingViaList();
        this.salesOrderReferenceData = this.salesOrderReferenceStorage.salesOrderReferenceData;
        this.stocklineReferenceData = this.stocklineReferenceStorage.stocklineReferenceData;
        //vendor Warnings and Restrictions Functionality.
        if (!this.isEditMode) {
            this.getManagementStructureDetails(this.currentUserManagementStructureId, this.employeeId);
            this.isSpinnerVisible = false;
        }
        this.headerInfo.resale = true;
        this.headerInfo.companyId = 0;
        this.headerInfo.buId = 0;
        this.headerInfo.divisionId = 0;
        this.headerInfo.departmentId = 0;
        if (this.headerInfo.purchaseOrderNumber == "" || this.headerInfo.purchaseOrderNumber == undefined) {
            this.headerInfo.purchaseOrderNumber = 'Creating';
        }
        this.vendorCapesCols = [
            { field: 'vendorRanking', header: 'Ranking' },
            { field: 'partNumber', header: 'PN' },
            { field: 'partDescription', header: 'PN Description' },
            { field: 'capabilityType', header: 'Capability Type' },
            { field: 'cost', header: 'Cost' },
            { field: 'tat', header: 'TAT' },
            { field: 'manufacturerName', header: 'PN Mfg' },
        ];
        this.headerInfo.statusId = 0;
        this.headerInfo.openDate = new Date();
        this.poId = this._actRoute.snapshot.params['id'];
        this.ShowWarning = this._actRoute.snapshot.params['ShowWarning'];
        this.id = this.poId;
        this.workOrderPartNumberId = this._actRoute.snapshot.params['mpnid'];
        if (this.poId !== 0 && this.poId !== undefined) {
            this.purchaseOrderService.getAllEditID(this.poId).subscribe(function (res) {
                var result = res;
                if (result && result.length > 0) {
                    result.forEach(function (x) {
                        if (x.label == "VENDOR") {
                            _this.arrayVendlsit.push(x.value);
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
                    });
                    _this.editDropDownLoad();
                    _this.isEditMode = true;
                    _this.isEditModeHeader = true;
                    _this.toggle_po_header = false;
                    _this.isSpinnerVisible = true;
                    setTimeout(function () {
                        _this.getVendorPOHeaderById(_this.poId);
                        // this.getPurchaseOrderPartsById(this.poId);
                        _this.getPurchaseOrderAllPartsById(_this.poId);
                        _this.enableHeaderSaveBtn = false;
                        _this.isSpinnerVisible = false;
                    }, 2200);
                }
            });
        }
        else if (this.poId === 0) {
            setTimeout(function () {
                _this.editDropDownLoad();
            }, 2200);
            setTimeout(function () {
                // this.getPurchaseOrderPartsById(this.poId);
                _this.getPurchaseOrderAllPartsById(_this.poId);
            }, 1200);
        }
        this.vendorIdByParams = this._actRoute.snapshot.params['vendorId'];
        if (this.vendorIdByParams) {
            setTimeout(function () {
                _this.arrayVendlsit.push(_this.vendorIdByParams);
                _this.vendorService.getVendorNameCodeListwithFilter('', 20, _this.arrayVendlsit.join()).subscribe(function (res) {
                    _this.allActions = res;
                    _this.vendorNames = res;
                    _this.vendorCodes = res;
                    _this.splitVendorNames = res;
                    _this.loadvendorDataById(_this.vendorIdByParams);
                    _this.warningsandRestriction(_this.vendorIdByParams);
                    _this.capvendorId = _this.vendorIdByParams;
                }, function (err) {
                    _this.isSpinnerVisible = false;
                    var errorLog = err;
                    _this.errorMessageHandler(errorLog);
                });
                ;
            }, 1200);
        }
        else if (this.poId == 0 || this.poId == undefined || this.poId == null) {
            this.loadVendorList();
        }
        //grid childlist disable on load
        // if (!this.isEditMode) {
        // 	this.partListData = [this.newObjectForParent];
        // 	for (let i = 0; i < this.partListData.length; i++) {
        // 		if (!this.partListData[i].ifSplitShip) {
        // 			this.partListData[i].childList = [];
        // 		}
        // 	}
        // }
    };
    //#region All Binding 
    PurchaseSetupComponent.prototype.warningsandRestriction = function (Id) {
        var _this = this;
        this.commonService.smartDropDownList('VendorWarningList', 'VendorWarningListId ', 'Name').subscribe(function (res) {
            if (res) {
                res.forEach(function (element) {
                    if (element.label == 'Create Purchase Order') {
                        _this.WarningListId = element.value;
                    }
                });
                if (Id && _this.WarningListId) {
                    _this.commonService.vendorWarningsAndRestrction(Id, _this.WarningListId).subscribe(function (res) {
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
                        var errorLog = err;
                        _this.errorMessageHandler(errorLog);
                    });
                }
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.getStatusvalue = function (status, action) {
        if (status == 'Submit Approval' && action == '1') {
            return true;
        }
        else {
            return false;
        }
    };
    // resctrictions(Id, warningMessage) {
    // 	//this.restrictMessage = '';
    // 	if (Id && this.WarningListId) {
    // 		this.commonService.vendorResctrictions(Id, this.WarningListId).subscribe((res: any) => {
    // 			if (res) {
    // 				this.restrictMessage = res.restrictMessage;
    // 				this.restrictID = res.vendorWarningId;
    // 			}
    // 			if (this.warningID != 0 && this.restrictID == 0) {
    // 				this.showAlertMessage();
    // 			} else if (this.warningID == 0 && this.restrictID != 0) {
    // 				this.showAlertMessage();
    // 			} else if (this.warningID != 0 && this.restrictID != 0) {
    // 				this.showAlertMessage();
    // 			} else if (this.warningID == 0 && this.restrictID == 0) {
    // 			}
    // 		},err => {
    // 			this.isSpinnerVisible = false;
    // 			const errorLog = err;
    // 			this.errorMessageHandler(errorLog);		
    // 		});
    // 	}
    // }	
    PurchaseSetupComponent.prototype.bindshippingSieListOriginal = function (moduleId, userId) {
        var _this = this;
        if (moduleId === void 0) { moduleId = 0; }
        if (userId === void 0) { userId = 0; }
        moduleId = moduleId = 0 ? this.splitmoduleId : 0;
        userId = userId = 0 ? this.splituserId : 0;
        this.commonService.getaddressdetailsOnlyUserbyuser(moduleId, userId, 'Ship', this.poId).subscribe(function (returnddataforbill) {
            _this.splitSieListOriginal = returnddataforbill.address.map(function (x) {
                return {
                    siteName: x.siteName, siteId: x.siteId
                };
            });
        });
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
        this.commonService.getManagmentStrctureData(id, empployid, editMSID).subscribe(function (response) {
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
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
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
            this.commonService.getManagmentStrctureData(msId, employid, editMSID).subscribe(function (response) {
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
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
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
        this.commonService.getManagmentStrctureData(partChildList.managementStructureId, this.employeeId, editMSID).subscribe(function (response) {
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
            // for (let i = 0; i < this.partListData.length; i++) {
            // 	this.partListData[i].parentbuId = buId;
            // 	this.getParentDivisionlist(this.partListData[i]);
            // }		
        }
        else {
            this.headerInfo.managementStructureId = this.headerInfo.companyId;
        }
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
            //    for (let i = 0; i < this.partListData.length; i++) {
            // 	this.partListData[i].divisionId = divisionId;
            // 	this.getParentDeptlist(this.partListData[i]);
            // 	}
        }
        else {
            this.headerInfo.managementStructureId = this.headerInfo.buId;
            this.headerInfo.divisionId = 0;
        }
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
            //  for (let i = 0; i < this.partListData.length; i++) {
            // 	this.partListData[i].parentDeptId = departmentId;
            // 	this.getParentDeptId(this.partListData[i]);			
            // }
        }
        else {
            this.headerInfo.managementStructureId = this.headerInfo.divisionId;
            this.headerInfo.departmentId = 0;
        }
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
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
            });
        }
    };
    PurchaseSetupComponent.prototype.loadPOStatus = function () {
        var _this = this;
        this.commonService.smartDropDownList('POStatus', 'POStatusId', 'Description').subscribe(function (response) {
            if (response) {
                _this.poStatusList = response;
                _this.poStatusList = _this.poStatusList.sort(function (a, b) { return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0); });
                response.forEach(function (x) {
                    if (x.label.toUpperCase() == "OPEN") {
                        _this.headerInfo.statusId = x.value;
                        _this.poOpenstatusID = x.value;
                    }
                    else if (x.label.toUpperCase() == "FULFILLING") {
                        _this.poFulfillingstatusID = x.value;
                    }
                });
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
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
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.enableNotes = function () {
    };
    PurchaseSetupComponent.prototype.onWOSelect = function (id) {
        this.arrayWOlist.push(id);
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
    PurchaseSetupComponent.prototype.salesStockRefData = function () {
        if (this.salesOrderReferenceData) {
            this.newObjectForParent.partNumberId = { value: this.salesOrderReferenceData.itemMasterId, label: this.salesOrderReferenceData.partNumber };
            var newObject = __assign(__assign({}, this.newObjectForParent), { partNumberId: { value: this.salesOrderReferenceData.itemMasterId, label: this.salesOrderReferenceData.partNumber }, needByDate: this.headerInfo.needByDate, priorityId: this.headerInfo.priorityId ? autocomplete_1.editValueAssignByCondition('value', this.headerInfo.priorityId) : null, discountPercent: { percentId: 0, percentValue: 'Select' } });
            this.getManagementStructureForParentEdit(newObject);
            this.getPNDetailsById(this.newObjectForParent);
            this.newObjectForParent.quantityOrdered = this.salesOrderReferenceData.quantity;
            this.newObjectForParent.managementStructureId = this.salesOrderReferenceData.quantity;
            this.newObjectForParent.conditionId = this.salesOrderReferenceData.conditionId;
        }
        //bind part details by stocklineid
        if (this.stocklineReferenceData) {
            this.newObjectForParent.partNumberId = { value: this.stocklineReferenceData.itemMasterId, label: this.stocklineReferenceData.partNumber };
            this.getPNDetailsById(this.newObjectForParent);
            this.newObjectForParent.quantityOrdered = this.stocklineReferenceData.quantity;
        }
    };
    PurchaseSetupComponent.prototype.loadModuleListForVendorComp = function () {
        var _this = this;
        this.commonService.getModuleListForObtainOwnerTraceable().subscribe(function (res) {
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
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    //#endregion
    // Load Vendor data
    PurchaseSetupComponent.prototype.loadvendorDataById = function (vendorId) {
        if (vendorId) {
            this.vendorContactList = [];
            this.getVendorContactsListByID(vendorId);
            this.getVendorCreditTermsByID(vendorId);
            this.headerInfo.vendorId = autocomplete_1.getObjectById('vendorId', vendorId, this.allActions);
            this.headerInfo.vendorCode = autocomplete_1.getObjectById('vendorId', vendorId, this.allActions);
            this.headerInfo.vendorName = autocomplete_1.getValueFromArrayOfObjectById('vendorName', 'vendorId', vendorId, this.allActions);
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
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.getVendorPOHeaderById = function (poId) {
        var _this = this;
        this.purchaseOrderService.getVendorPOHeaderById(poId).subscribe(function (res) {
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
                vendorContactId: _this.getVendorContactsListByIDEdit(res),
                vendorContactPhone: _this.getVendorContactsListByIDEdit(res),
                vendorName: autocomplete_1.getValueFromArrayOfObjectById('vendorName', 'vendorId', res.vendorId, _this.allActions),
                creditLimit: res.creditLimit ? autocomplete_1.formatNumberAsGlobalSettingsModule(res.creditLimit, 2) : '0.00',
                creditTerms: res.creditTerms,
                creditTermsId: res.creditTermsId,
                requisitionerId: autocomplete_1.getObjectById('value', res.requestedBy, _this.allEmployeeList),
                approverId: autocomplete_1.getObjectById('value', res.approverId, _this.allEmployeeList),
                approvedDate: res.dateApproved ? new Date(res.dateApproved) : '',
                statusId: res.statusId,
                resale: res.resale,
                companyId: _this.getManagementStructureDetails(res.managementStructureId, _this.employeeId, res.managementStructureId),
                poMemo: res.poMemo,
                notes: res.notes,
                createdDate: res.createdDate,
                updatedDate: res.updatedDate,
                createdBy: res.createdBy,
                updatedBy: res.updatedBy
            };
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
            _this.capvendorId = res.vendorId;
            _this.warningsandRestriction(res.vendorId);
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.getPurchaseOrderAllPartsById = function (poId) {
        var _this = this;
        this.isSpinnerVisible = true;
        this.purchaseOrderService.getPurchaseOrderAllPartsById(poId, this.employeeId, this.workOrderPartNumberId).subscribe(function (res) {
            if (res) {
                _this.BindAllParts(res);
                _this.isSpinnerVisible = false;
                _this.enableHeaderSaveBtn = false;
            }
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.BindAllParts = function (data) {
        var _this = this;
        this.partListData = [];
        this.newPartsList = [this.newObjectForParent];
        if (data) {
            data[0].map(function (x, pindex) {
                _this.newPartsList = __assign(__assign({}, x), { partNumberId: { value: x.itemMasterId, label: x.partNumber }, ifSplitShip: x.purchaseOrderSplitParts.length > 0 ? true : false, partNumber: x.partNumber, partDescription: x.partDescription, needByDate: x.needByDate ? new Date(x.needByDate) : '', conditionId: parseInt(x.conditionId), priorityId: parseInt(x.priorityId), discountPercent: x.discountPercent ? parseInt(x.discountPercent) : 0, functionalCurrencyId: autocomplete_1.getObjectById('value', x.functionalCurrencyId, _this.allCurrencyData), reportCurrencyId: autocomplete_1.getObjectById('value', x.reportCurrencyId, _this.allCurrencyData), workOrderId: autocomplete_1.getObjectById('value', x.workOrderId == null ? 0 : x.workOrderId, _this.allWorkOrderInfo), repairOrderId: autocomplete_1.getObjectById('value', x.repairOrderId == null ? 0 : x.repairOrderId, _this.allRepairOrderInfo), salesOrderId: autocomplete_1.getObjectById('value', x.salesOrderId == null ? 0 : x.salesOrderId, _this.allSalesOrderInfo), quantityOrdered: x.quantityOrdered ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.quantityOrdered, 0) : '0', vendorListPrice: x.vendorListPrice ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.vendorListPrice, 2) : '0.00', discountPerUnit: x.discountPerUnit ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.discountPerUnit, 2) : '0.00', discountAmount: x.discountAmount ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.discountAmount, 2) : '0.00', unitCost: x.unitCost ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00', extendedCost: x.extendedCost ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00', isApproved: x.isApproved ? x.isApproved : false, childList: _this.getPurchaseOrderSplitPartsEdit(x, pindex, data[1]) });
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
                //this.getManagementStructureForChildPart(splitpart,ms);
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
                parentdata.altPartCollection = this.partWithId.altPartNumList;
                this.altPartNumList = this.partWithId.altPartNumList;
                if (parentdata.altEquiPartNumberId) {
                    parentdata.altEquiPartNumberId = autocomplete_1.getObjectById('altEquiPartNumberId', parentdata.altEquiPartNumberId, this.altPartNumList);
                }
                else if (this.altPartNumList.length > 0) {
                    parentdata.altEquiPartNumberId = this.altPartNumList[0];
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
    // getPurchaseOrderPartsById(poId) {
    // 	this.partListData = [];
    // 	this.isSpinnerVisible = true;
    // 				this.purchaseOrderService.getPurchaseOrderPartsById(poId, this.workOrderPartNumberId).subscribe(res => {
    // 				this.newPartsList = [this.newObjectForParent];					
    // 				res.map((x, pindex) => {
    // 					this.newPartsList = {
    // 						...x,							
    // 						partNumberId: {value: x.itemMasterId, label: x.partNumber},
    // 						ifSplitShip: x.purchaseOrderSplitParts.length > 0 ? true : false,
    // 						partNumber: x.partNumber,
    // 						partDescription: x.partDescription,
    // 						needByDate: x.needByDate ? new Date(x.needByDate) : '',
    // 						conditionId: parseInt(x.conditionId),
    // 						priorityId: parseInt(x.priorityId),
    // 						discountPercent: x.discountPercent ? parseInt(x.discountPercent) : 0,							
    // 						functionalCurrencyId: getObjectById('value', x.functionalCurrencyId, this.allCurrencyData),
    // 						reportCurrencyId: getObjectById('value', x.reportCurrencyId, this.allCurrencyData),							
    // 						workOrderId: getObjectById('value', x.workOrderId, this.allWorkOrderInfo),
    // 						repairOrderId: getObjectById('value', x.repairOrderId, this.allRepairOrderInfo),
    // 						salesOrderId: getObjectById('value', x.salesOrderId, this.allSalesOrderInfo),
    // 						quantityOrdered: x.quantityOrdered ? formatNumberAsGlobalSettingsModule(x.quantityOrdered, 0) : '0',
    // 						vendorListPrice: x.vendorListPrice ? formatNumberAsGlobalSettingsModule(x.vendorListPrice, 2) : '0.00',
    // 						discountPerUnit: x.discountPerUnit ? formatNumberAsGlobalSettingsModule(x.discountPerUnit, 2) : '0.00',
    // 						discountAmount: x.discountAmount ? formatNumberAsGlobalSettingsModule(x.discountAmount, 2) : '0.00',
    // 						unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
    // 						extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00',
    // 						isApproved: x.isApproved ? x.isApproved : false,							
    // 						childList: this.getPurchaseOrderSplitPartsEdit(x, pindex),
    // 					}
    // 					this.getManagementStructureForParentEdit(this.newPartsList,this.employeeId,this.newPartsList.managementStructureId);
    // 					this.getPNDetailsById(this.newPartsList, 'onEdit');
    // 					if (!this.newPartsList.childList) {
    // 						this.newPartsList.childList = [];
    // 					}
    // 					this.partListData.push(this.newPartsList);
    // 					if(this.partListData.length > 0) {
    // 						this.isEditModePart = true;
    // 					} else {
    // 						this.isEditModePart = false;
    // 					}
    // 					this.getTotalExtCost();
    // 					this.getTotalDiscAmount();
    // 				})
    // 				this.isSpinnerVisible = false;
    // 			}, err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);
    // 			})	
    // }
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
    // onCustomerNameChange(customerId, data?, pindex?, cindex?) {
    // 	this.customerService.getCustomerShipAddressGet(customerId).subscribe(returnedcustomerAddressses => {			
    // 		this["splitAddressData" + pindex + cindex] = [];
    // 		this["splitAddressData" + pindex + cindex] = returnedcustomerAddressses[0];
    // 		if (this.isEditMode) {
    // 			if (data && data.poPartSplitAddressId == 0) {
    // 				this["splitAddressData" + pindex + cindex].push({ addressId: 0, address1: data.poPartSplitAddress1, address2: data.poPartSplitAddress2, city: data.poPartSplitCity, stateOrProvince: data.poPartSplitState, postalCode: data.poPartSplitPostalCode, country: data.poPartSplitCountry })
    // 			}
    // 			this["splitAddressData" + pindex + cindex].map(x => {
    // 				if (x.addressId == 0) {
    // 					data.partListAddressId = x.addressId;
    // 				}
    // 			});	
    // 		}	
    // 		if(data) {	
    // 		data.poPartSplitAddressId = 0;
    // 		data.partListAddressId = 0;}
    // 	},err => {
    // 		this.isSpinnerVisible = false;
    // 		const errorLog = err;
    // 		this.errorMessageHandler(errorLog);		
    // 	});
    // }
    // onVendorNameChange(vendorId, data?, pindex?, cindex?): void {		
    // 	this.vendorService.getVendorShipAddressGet(vendorId).subscribe(
    // 		vendorAddresses => {				
    // 			this["splitAddressData" + pindex + cindex] = [];
    // 			this["splitAddressData" + pindex + cindex] = vendorAddresses[0].map(x => {
    // 				return {
    // 					...x,
    // 					countryName: x.country
    // 				}
    // 			});				
    // 			if (this.isEditMode) {
    // 				if (data && data.poPartSplitAddressId != null && data.poPartSplitAddressId == 0) {
    // 					this["splitAddressData" + pindex + cindex].push({ addressId: 0, address1: data.poPartSplitAddress1, address2: data.poPartSplitAddress2, city: data.poPartSplitCity, stateOrProvince: data.poPartSplitState, postalCode: data.poPartSplitPostalCode, country: data.poPartSplitCountry })
    // 				}				
    // 			}
    // 			if(data) {
    // 			data.poPartSplitAddressId = 0;
    // 			data.partListAddressId = 0;}
    // 		},err => {
    // 			this.isSpinnerVisible = false;
    // 			const errorLog = err;
    // 			this.errorMessageHandler(errorLog);		
    // 		});
    // }
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
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    // onCompanyNameChange(companyId, data?, pindex?, cindex?) {
    // 	this.commonService.getaddressdetailsbyuser(this.companyModuleId, companyId, 'Ship',this.poId).subscribe(
    // 		returnddataforbill => {
    // 			this["splitAddressData" + pindex + cindex] = [];
    // 			this["splitAddressData" + pindex + cindex] = returnddataforbill.address;
    // 			// if (this.isEditMode) {
    // 			// 	if (data && data.poPartSplitAddressId == 0) {
    // 			// 		this["splitAddressData" + pindex + cindex].push({ addressId: 0, address1: data.poPartSplitAddress1, address2: data.poPartSplitAddress2, city: data.poPartSplitCity, country: data.poPartSplitCountry, postalCode: data.poPartSplitPostalCode, stateOrProvince: data.poPartSplitState });
    // 			// 	}
    // 			// } else {
    // 			// 	this.onShipToGetCompanyAddress(this.companySiteList_Shipping[0].legalEntityShippingAddressId);
    // 			// }
    // 			// if (data) {
    // 			// data.POPartSplitSiteId = 0;
    // 			// data.partListAddressId = 0;}
    // 		},err => {
    // 		this.isSpinnerVisible = false;
    // 		const errorLog = err;
    // 		this.errorMessageHandler(errorLog);		
    // 	});
    // 	// this.legalEntityService.getLegalEntityAddressById(companyId).subscribe(response => {
    // 	// 	this["splitAddressData" + pindex + cindex] = [];
    // 	//     this["splitAddressData" + pindex + cindex] = response[0];
    // 	// 	// .map(x => {
    // 	// 	// // 	return {
    // 	// 	// // 		...x,
    // 	// 	// // 		address1: x.line1,
    // 	// 	// // 		address2: x.line2,					
    // 	// 	// // 		countryName: x.country
    // 	// 	// // 	}
    // 	// 	// });
    // 	// 	if (this.isEditMode) {
    // 	// 		if (data && data.poPartSplitAddressId == 0) {
    // 	// 			this["splitAddressData" + pindex + cindex].push({ addressId: 0, address1: data.poPartSplitAddress1, address2: data.poPartSplitAddress2, city: data.poPartSplitCity, country: data.poPartSplitCountry, postalCode: data.poPartSplitPostalCode, stateOrProvince: data.poPartSplitState });
    // 	// 		}
    // 	// 	} else {
    // 	// 		this.onShipToGetCompanyAddress(this.companySiteList_Shipping[0].legalEntityShippingAddressId);
    // 	// 	}
    // 	// 	if (data) {
    // 	// 	data.poPartSplitAddressId = 0;
    // 	// 	data.partListAddressId = 0;}
    // 	// },err => {
    // 	// 	this.isSpinnerVisible = false;
    // 	// 	const errorLog = err;
    // 	// 	this.errorMessageHandler(errorLog);		
    // 	// });
    // }
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
            parentdata.workOrderId = null;
            parentdata.repairOrderId = null;
            parentdata.salesOrderId = null;
            parentdata.memo = null;
            //this.getManagementStructureForParentEdit(parentdata,this.employeeId);
        }
        this.itemTypeId = 1;
        //For Getting Data After Part Selected
        this.purchaseOrderService.getPartDetailsWithidForSinglePart(itemMasterId).subscribe(function (data1) {
            if (data1[0]) {
                _this.partWithId = data1[0];
                parentdata.partId = _this.partWithId.itemMasterId;
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
                parentdata.altPartCollection = _this.partWithId.altPartNumList;
                if (parentdata.conditionId && value != 'onEdit') {
                    _this.getPriceDetailsByCondId(parentdata);
                }
                _this.altPartNumList = _this.partWithId.altPartNumList;
                if (parentdata.altEquiPartNumberId && value == 'onEdit') {
                    parentdata.altEquiPartNumberId = autocomplete_1.getObjectById('altEquiPartNumberId', parentdata.altEquiPartNumberId, _this.altPartNumList);
                }
                else if (_this.altPartNumList.length > 0) {
                    parentdata.altEquiPartNumberId = _this.altPartNumList[0];
                }
            }
        }, function (err) {
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
        //get altPartNummbers
        // this.itemser.getItemMasterAltEquiMappingParts(itemMasterId).subscribe(res => {
        // 	this.altPartNumList = res;
        // 	if(parentdata.altEquiPartNumberId && value == 'onEdit') {
        // 		parentdata.altEquiPartNumberId = getObjectById('altEquiPartNumberId', parentdata.altEquiPartNumberId, this.altPartNumList);
        // 	} else if(this.altPartNumList.length > 0) {
        // 		parentdata.altEquiPartNumberId = this.altPartNumList[0];
        // 	}
        // }, err => {				
        // 	const errorLog = err;
        // 	this.errorMessageHandler(errorLog);
        // })
    };
    PurchaseSetupComponent.prototype.getPriceDetailsByCondId = function (parentdata) {
        var _this = this;
        // const condId = getValueFromObjectByKey('conditionId', parentdata.conditionId);
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
            _this.totalDiscAmount += x.tempDiscAmt;
        });
        this.totalDiscAmount = this.totalDiscAmount ? autocomplete_1.formatNumberAsGlobalSettingsModule(this.totalDiscAmount, 2) : '0.00';
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.vendorService.getVendorContactDataByVendorId(res.vendorId).subscribe(function (data) {
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
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
            });
        }
        else {
            this.getApproversByTask(poId);
        }
    };
    PurchaseSetupComponent.prototype.getApproversByTask = function (poId) {
        var _this = this;
        this.purchaseOrderService.getPOTotalCostById(poId).subscribe(function (res) {
            if (res) {
                _this.poTotalCost = res.totalCost;
                _this.purchaseOrderService.getApproversListByTaskIdModuleAmt(_this.poApprovaltaskId, _this.poTotalCost).subscribe(function (res) {
                    _this.internalApproversList = res;
                    _this.internalApproversList.map(function (x) {
                        _this.apporoverEmailList = x.approverEmails;
                        _this.apporoverNamesList.push(x.approverName);
                    });
                });
            }
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
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
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.getVendorCapesByID = function (vendorId) {
        var _this = this;
        var status = 'active';
        if (vendorId != undefined) {
            this.isSpinnerVisible = true;
            this.vendorService.getVendorCapabilityList(status, vendorId).subscribe(function (results) { _this.onDataLoadVendorCapsSuccessful(results[0]); }, function (err) {
                _this.isSpinnerVisible = false;
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
            });
        }
    };
    PurchaseSetupComponent.prototype.onDataLoadVendorCapsSuccessful = function (allWorkFlows) {
        this.vendorCapesInfo = allWorkFlows.map(function (x) {
            return __assign(__assign({}, x), { cost: x.cost ? autocomplete_1.formatNumberAsGlobalSettingsModule(x.cost, 2) : '0.00' });
        });
        this.isSpinnerVisible = false;
    };
    ////////// Address Tab
    // getVendorPOAddressById(poId) {
    // 	this.isSpinnerVisible = true;
    // 	this.purchaseOrderService.getVendorPOAddressById(poId).subscribe(res => {
    // 		this.sourcePoApproval = {
    // 			shipToPOAddressId: res.shipToPOAddressId,
    // 			shipToUserTypeId: res.shipToUserType,	
    // 			shipToUserId: this.getShipToUserIdEdit(res),
    // 			shipToSiteId: res.shipToSiteId,
    // 			shipToSiteName: res.shipToSiteName,
    // 			shipToContactId: res.shipToContactId,
    // 			shipToContact: res.shipToContact,  
    // 			shipToMemo: res.shipToMemo,
    // 			shipToAddressId: res.shipToAddressId,
    // 			shipToAddress1: res.shipToAddress1,
    // 			shipToAddress2: res.shipToAddress2,			
    // 			shipToCity: res.shipToCity,
    // 			shipToStateOrProvince: res.shipToState,
    // 			shipToPostalCode: res.shipToPostalCode,
    // 			ShipToCountryId: res.ShipToCountryId,
    // 			poShipViaId: res.poShipViaId,
    // 			billToPOAddressId: res.billToPOAddressId,
    // 			billToUserTypeId: res.billToUserType,
    // 			billToUserId: this.getBillToUserIdEdit(res),
    // 			billToSiteId: res.billToSiteId,
    // 			billToSiteName: res.billToSiteName,
    // 			billToContactId: res.billToContactId,
    // 			billToContactName: res.billToContactName,
    // 			billToMemo: res.billToMemo,				
    // 			billToAddressId: res.billToAddressId,	
    // 			billToAddress1: res.billToAddress1,
    // 			billToAddress2: res.billToAddress2,
    // 			billToCity: res.billToCity,
    // 			billToStateOrProvince: res.billToState,
    // 			billToPostalCode: res.billToPostalCode,
    // 			billToCountryId: res.billToCountryId,				
    // 			shipViaId: res.shipViaId,
    // 			shipVia: res.shipVia,
    // 			shippingCost: formatNumberAsGlobalSettingsModule(res.shippingCost, 2),
    // 			handlingCost: formatNumberAsGlobalSettingsModule(res.handlingCost, 2),	
    // 			shippingAccountNo: res.shippingAccountNo
    // 		};
    // 		if(this.sourcePoApproval && this.sourcePoApproval.shipToUserTypeId && this.sourcePoApproval.billToUserTypeId) {
    // 			this.isEditModeAdd = true;
    // 			this.isSpinnerVisible = false;
    // 		} else {
    // 			this.isEditModeAdd = false;
    // 			this.sourcePoApproval.shipToUserTypeId = this.companyModuleId;
    // 			this.sourcePoApproval.billToUserTypeId = this.companyModuleId;
    // 			//this.getLegalEntityDetailsById();
    // 		}
    // 		this.isSpinnerVisible = false;
    // 	}, err => {
    // 		this.isSpinnerVisible = false;
    // 		const errorLog = err;
    // 		this.errorMessageHandler(errorLog);		
    // 	})		
    // }
    PurchaseSetupComponent.prototype.getShipToUserIdEdit = function (data) {
        var _this = this;
        if (data.shipToUserType === this.customerModuleId) {
            this.tempShipTOAddressId = data.shipToAddressId;
            this.onShipToCustomerSelected(data.shipToUserId, data, data.shipToSiteId, 'shipEdit');
            this.getShipViaEdit(data);
            return autocomplete_1.getObjectById('value', data.shipToUserId, this.allCustomers);
        }
        if (data.shipToUserType === this.vendorModuleId) {
            this.tempShipTOAddressId = data.shipToAddressId;
            this.onShipToVendorSelected(data.shipToUserId, data, data.shipToSiteId, 'shipEdit');
            this.getShipViaEdit(data);
            return autocomplete_1.getObjectById('vendorId', data.shipToUserId, this.allActions);
        }
        if (data.shipToUserType === this.companyModuleId) {
            this.tempShipTOAddressId = data.shipToAddressId;
            this.shipToSelectedvalue = data.shipToUserId;
            this.companyService.getShippingCompanySiteNames(this.shipToSelectedvalue).subscribe(function (response) {
                _this.companySiteList_Shipping = response;
                if (_this.isEditMode) {
                    if (data.shipToSiteId == 0) {
                        _this.companySiteList_Shipping.push({ legalEntityShippingAddressId: 0, siteName: data.shipToSiteName, addressId: data.shipToAddressId });
                        _this.shipToAddress.address1 = data.shipToAddress1;
                        _this.shipToAddress.address2 = data.shipToAddress2;
                        _this.shipToAddress.city = data.shipToCity;
                        _this.shipToAddress.stateOrProvince = data.shipToState;
                        _this.shipToAddress.postalCode = data.shipToPostalCode;
                        _this.shipToAddress.country = data.shipToCountry;
                    }
                    else {
                        _this.onShipToGetCompanyAddress(data.shipToSiteId);
                    }
                }
            }, function (err) {
                _this.isSpinnerVisible = false;
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
            });
            this.companyService.getCompanyContacts(this.shipToSelectedvalue).subscribe(function (response) {
                _this.contactListForCompanyShipping = response;
                _this.sourcePoApproval.shipToContactId = autocomplete_1.getObjectById('contactId', data.shipToContactId, _this.contactListForCompanyShipping);
            }, function (err) {
                _this.isSpinnerVisible = false;
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
            });
            this.getShipViaEdit(data);
            return autocomplete_1.getObjectById('value', data.shipToUserId, this.legalEntity);
        }
    };
    PurchaseSetupComponent.prototype.onShipToCustomerSelected = function (customerId, res, id, value) {
        var _this = this;
        this.clearInputOnClickUserIdShipTo();
        this.shipToSelectedvalue = customerId;
        this.customerService.getCustomerShipAddressGet(customerId).subscribe(function (returnddataforbill) {
            _this.shipToCusData = returnddataforbill[0];
            for (var i = 0; i < _this.shipToCusData.length; i++) {
                if (_this.shipToCusData[i].isPrimary && value != 'shipEdit') {
                    _this.sourcePoApproval.shipToSiteId = _this.shipToCusData[i].customerShippingAddressId;
                    _this.sourcePoApproval.shipToAddressId = _this.shipToCusData[i].AddressId;
                }
            }
            if (id) {
                res.shipToSiteId = id;
            }
            if (_this.isEditMode) {
                if (res) {
                    if (res.shipToSiteId == 0) {
                        _this.shipToCusData.push({ customerShippingAddressId: 0, addressId: res.shipToAddressId, address1: res.shipToAddress1, address2: res.shipToAddress2, city: res.shipToCity, stateOrProvince: res.shipToState, postalCode: res.shipToPostalCode, country: res.shipToCountry, siteName: res.shipToSiteName });
                    }
                }
            }
            _this.onShipToGetAddress(res, res.shipToSiteId);
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
        this.customerService.getContacts(customerId).subscribe(function (data) {
            _this.shipToContactData = data[0];
            for (var i = 0; i < _this.shipToContactData.length; i++) {
                if (_this.shipToContactData[i].isDefaultContact) {
                    _this.sourcePoApproval.shipToContactId = _this.shipToContactData[i];
                }
            }
            if (_this.isEditMode && value == 'shipEdit') {
                _this.sourcePoApproval.shipToContactId = autocomplete_1.getObjectById('contactId', res.shipToContactId, _this.shipToContactData);
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
        this.getShipViaDetailsForShipTo(res.shipViaId);
    };
    PurchaseSetupComponent.prototype.clearInputOnClickUserIdShipTo = function () {
        this.sourcePoApproval.shipToSiteId = 0;
        this.sourcePoApproval.shipToAddressId = 0;
        this.sourcePoApproval.shipToContactId = 0;
        this.sourcePoApproval.shipToMemo = '';
        this.sourcePoApproval.shipViaId = 0;
        this.sourcePoApproval.shippingCost = 0;
        this.sourcePoApproval.handlingCost = 0;
        this.sourcePoApproval.shippingAcctNum = 0;
        this.shipToAddress = {};
        this.shipViaList = [];
        this.shipToCusData = [];
        this.vendorSelected = [];
        this.companySiteList_Shipping = [];
    };
    PurchaseSetupComponent.prototype.getShipViaDetailsForShipTo = function (id) {
        var _this = this;
        this.commonService.getShipViaDetailsByModule(this.sourcePoApproval.shipToUserTypeId, this.shipToSelectedvalue).subscribe(function (response) {
            _this.shipViaList = response;
            for (var i = 0; i < _this.shipViaList.length; i++) {
                if (_this.shipViaList[i].isPrimary) {
                    _this.sourcePoApproval.shipViaId = _this.shipViaList[i].shipViaId;
                    _this.getShipViaDetails(_this.sourcePoApproval.shipViaId);
                }
            }
            if (id) {
                _this.sourcePoApproval.shipViaId = id;
                _this.getShipViaDetails(id);
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.getShipViaDetails = function (id) {
        var _this = this;
        this.sourcePoApproval.shippingAcctNum = null;
        var userType = this.sourcePoApproval.shipToUserTypeId ? parseInt(this.sourcePoApproval.shipToUserTypeId) : 0;
        var shippingViaId = id ? autocomplete_1.getValueFromArrayOfObjectById('shippingViaId', 'shipViaId', id, this.shipViaList) : 0;
        if (shippingViaId != 0 && shippingViaId != null) {
            this.commonService.getShipViaDetailsById(shippingViaId, userType).subscribe(function (res) {
                var responseData = res;
                _this.sourcePoApproval.shippingAcctNum = responseData.shippingAccountInfo;
                _this.sourcePoApproval.shipVia = responseData.shipVia;
            }, function (err) {
                _this.isSpinnerVisible = false;
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
            });
        }
    };
    PurchaseSetupComponent.prototype.onShipToGetAddress = function (data, id) {
        this.shipToAddress = {};
        if (data.shipToUserTypeId == this.customerModuleId || data.shipToUserType == this.customerModuleId) {
            this.shipToAddress = autocomplete_1.getObjectById('customerShippingAddressId', id, this.shipToCusData);
        }
        else if (data.shipToUserTypeId == this.vendorModuleId || data.shipToUserType == this.vendorModuleId) {
            this.shipToAddress = autocomplete_1.getObjectById('vendorShippingAddressId', id, this.vendorSelected);
        }
        this.shipToAddress = __assign(__assign({}, this.shipToAddress), { country: this.shipToAddress.countryName ? this.shipToAddress.countryName : this.shipToAddress.country });
    };
    PurchaseSetupComponent.prototype.getShipViaEdit = function (data) {
        var _this = this;
        this.commonService.getShipViaDetailsByModule(data.shipToUserType, this.shipToSelectedvalue).subscribe(function (response) {
            _this.shipViaList = response;
            _this.sourcePoApproval.shippingAcctNum = data.shippingAccountNo;
            _this.sourcePoApproval.shipViaId = data.shipViaId;
            if (_this.sourcePoApproval.shipViaId) {
                _this.getShipViaDetails(_this.sourcePoApproval.shipViaId);
            }
            if (data.shipViaId == 0) {
                _this.shipViaList.push({ shipViaId: 0, name: data.shipVia, shippingAccountInfo: data.shippingAcctNum });
                _this.sourcePoApproval.shippingAcctNum = data.shippingAcctNum;
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.onShipToVendorSelected = function (vendorId, res, id, value) {
        var _this = this;
        this.clearInputOnClickUserIdShipTo();
        this.shipToSelectedvalue = vendorId;
        this.showInput = true;
        this.vendorService.getVendorShipAddressGet(vendorId).subscribe(function (returdaa) {
            _this.vendorSelected = returdaa[0];
            for (var i = 0; i < _this.vendorSelected.length; i++) {
                if (_this.vendorSelected[i].isPrimary && value != 'shipEdit') {
                    _this.sourcePoApproval.shipToSiteId = _this.vendorSelected[i].vendorShippingAddressId;
                    _this.sourcePoApproval.shipToAddressId = _this.vendorSelected[i].AddressId;
                }
            }
            if (id) {
                res.shipToSiteId = id;
            }
            if (_this.isEditMode && res) {
                if (res.shipToSiteId == 0) {
                    _this.vendorSelected.push({ vendorShippingAddressId: 0, addressId: res.shipToAddressId, address1: res.shipToAddress1, address2: res.shipToAddress2, city: res.shipToCity, stateOrProvince: res.shipToState, postalCode: res.shipToPostalCode, country: res.shipToCountry, siteName: res.shipToSiteName });
                }
            }
            if (res) {
                _this.onShipToGetAddress(res, res.shipToSiteId);
            }
            else {
                _this.onShipToGetAddress(_this.sourcePoApproval, _this.sourcePoApproval.shipToSiteId);
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
        this.vendorService.getContacts(vendorId).subscribe(function (data) {
            _this.vendorContactsForshipTo = data[0];
            for (var i = 0; i < _this.vendorContactsForshipTo.length; i++) {
                if (_this.vendorContactsForshipTo[i].isDefaultContact) {
                    _this.sourcePoApproval.shipToContactId = _this.vendorContactsForshipTo[i];
                }
            }
            if (_this.isEditMode && value == 'shipEdit') {
                _this.sourcePoApproval.shipToContactId = autocomplete_1.getObjectById('contactId', res.shipToContactId, _this.vendorContactsForshipTo);
            }
            _this.commonService.getShipViaDetailsByModule(_this.sourcePoApproval.shipToUserTypeId, vendorId).subscribe(function (res) {
                _this.shipViaList = res;
            }, function (err) {
                _this.isSpinnerVisible = false;
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
            });
            _this.getShipViaDetailsForShipTo(res.shipViaId);
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.onShipToGetCompanyAddress = function (id) {
        var _this = this;
        this.shipToAddress = {};
        this.companyService.getShippingAddress(id).subscribe(function (res) {
            var resp = res;
            if (resp) {
                _this.shipToAddress.addressId = resp.addressId;
                _this.shipToAddress.address1 = resp.line1;
                _this.shipToAddress.address2 = resp.line2;
                _this.shipToAddress.city = resp.city;
                _this.shipToAddress.stateOrProvince = resp.stateOrProvince;
                _this.shipToAddress.postalCode = resp.postalCode;
                _this.shipToAddress.countryId = resp.countryId;
                _this.shipToAddress.country = autocomplete_1.getValueFromArrayOfObjectById('label', 'value', resp.countryId, _this.allCountriesList);
            }
            else {
                _this.shipToAddress.addressId = 0;
                _this.shipToAddress.address1 = '';
                _this.shipToAddress.address2 = '';
                _this.shipToAddress.city = '';
                _this.shipToAddress.stateOrProvince = '';
                _this.shipToAddress.postalCode = '';
                _this.shipToAddress.country = '';
                _this.shipToAddress.countryId = null;
            }
        }, function (err) {
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.errorMessageHandler = function (log) {
        var errorLog = log;
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
    PurchaseSetupComponent.prototype.getLegalEntityDetailsById = function () {
        var _this = this;
        this.commonService.getLegalEntityIdByMangStrucId(this.currentUserManagementStructureId).subscribe(function (res) {
            _this.currentUserLegalEntityId = res.legalEntityId;
            _this.getInactiveObjectForLEOnEdit('value', _this.currentUserLegalEntityId, _this.legalEntity, 'LegalEntity', 'LegalEntityId', 'Name');
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.getInactiveObjectForLEOnEdit = function (string, id, originalData, tableName, primaryColumn, description) {
        var _this = this;
        if (id) {
            for (var i = 0; i < originalData.length; i++) {
                if (originalData[i][string] == id) {
                    this.sourcePoApproval.shipToUserId = originalData[i];
                    this.sourcePoApproval.billToUserId = originalData[i];
                    this.onShipToCompanySelected(originalData[i]);
                    this.onBillToCompanySelected(originalData[i]);
                }
            }
            var obj_1 = {};
            this.commonService.smartDropDownGetObjectById(tableName, primaryColumn, description, primaryColumn, id).subscribe(function (res) {
                obj_1 = res[0];
                _this.legalEntity = __spreadArrays(originalData, [obj_1]);
                _this.sourcePoApproval.shipToUserId = obj_1;
                _this.sourcePoApproval.billToUserId = obj_1;
                _this.onShipToCompanySelected(obj_1);
                _this.onBillToCompanySelected(obj_1);
            }, function (err) {
                _this.isSpinnerVisible = false;
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
            });
        }
        else {
            return null;
        }
    };
    PurchaseSetupComponent.prototype.onShipToCompanySelected = function (object, res, id) {
        var _this = this;
        this.clearInputOnClickUserIdShipTo();
        this.shipToSelectedvalue = object ? object.value : this.shipToSelectedvalue;
        this.companyService.getShippingCompanySiteNames(this.shipToSelectedvalue).subscribe(function (response) {
            _this.companySiteList_Shipping = response;
            for (var i = 0; i < _this.companySiteList_Shipping.length; i++) {
                if (_this.companySiteList_Shipping[i].isPrimary) {
                    _this.sourcePoApproval.shipToSiteId = _this.companySiteList_Shipping[i].legalEntityShippingAddressId;
                    _this.sourcePoApproval.shipToAddressId = _this.companySiteList_Shipping[i].AddressId;
                    _this.onShipToGetCompanyAddress(_this.sourcePoApproval.shipToSiteId);
                }
            }
            if (id) {
                res.shipToSiteId = id;
                _this.onShipToGetCompanyAddress(id);
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
        this.companyService.getCompanyContacts(this.shipToSelectedvalue).subscribe(function (response) {
            _this.contactListForCompanyShipping = response;
            for (var i = 0; i < _this.contactListForCompanyShipping.length; i++) {
                if (_this.contactListForCompanyShipping[i].isDefaultContact) {
                    _this.sourcePoApproval.shipToContactId = _this.contactListForCompanyShipping[i];
                }
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
        this.getShipViaDetailsForShipTo();
    };
    PurchaseSetupComponent.prototype.onBillToCompanySelected = function (object, response, id) {
        var _this = this;
        this.clearInputOnClickUserIdBillTo();
        this.billToSelectedvalue = object ? object.value : this.billToSelectedvalue;
        this.companyService.getBillingCompanySiteNames(this.billToSelectedvalue).subscribe(function (res) {
            _this.companySiteList_Billing = res;
            for (var i = 0; i < _this.companySiteList_Billing.length; i++) {
                if (_this.companySiteList_Billing[i].isPrimary) {
                    _this.sourcePoApproval.billToSiteId = _this.companySiteList_Billing[i].legalEntityBillingAddressId;
                    _this.sourcePoApproval.billToAddressId = _this.companySiteList_Billing[i].AddressId;
                    _this.onBillToGetCompanyAddress(_this.sourcePoApproval.billToSiteId);
                }
            }
            if (id) {
                response.billToSiteId = id;
                _this.onBillToGetCompanyAddress(id);
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
        this.companyService.getCompanyContacts(this.billToSelectedvalue).subscribe(function (res) {
            _this.contactListForCompanyBilling = res;
            for (var i = 0; i < _this.contactListForCompanyBilling.length; i++) {
                if (_this.contactListForCompanyBilling[i].isDefaultContact) {
                    _this.sourcePoApproval.billToContactId = _this.contactListForCompanyBilling[i];
                }
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
        // this.commonService.getShipViaDetailsByModule(this.sourcePoApproval.billToUserTypeId, this.billToSelectedvalue).subscribe(res => {
        // 	this.shipViaList = res;
        // },err => {
        // 	this.isSpinnerVisible = false;
        // 	const errorLog = err;
        // 	this.errorMessageHandler(errorLog);		
        // });
    };
    PurchaseSetupComponent.prototype.clearInputOnClickUserIdBillTo = function () {
        this.sourcePoApproval.billToSiteId = 0;
        this.sourcePoApproval.billToContactId = 0;
        this.billToAddress = {};
        this.sourcePoApproval.billToMemo = '';
        this.billToCusData = [];
        this.vendorSelectedForBillTo = [];
        this.companySiteList_Billing = [];
    };
    PurchaseSetupComponent.prototype.onBillToGetCompanyAddress = function (id) {
        var _this = this;
        this.billToAddress = {};
        this.companyService.getBillingAddress(id).subscribe(function (res) {
            if (res) {
                _this.billToAddress.addressId = res[0].addressId;
                _this.billToAddress.address1 = res[0].address1;
                _this.billToAddress.address2 = res[0].address2;
                _this.billToAddress.city = res[0].city;
                _this.billToAddress.stateOrProvince = res[0].stateOrProvince;
                _this.billToAddress.postalCode = res[0].postalCode;
                _this.billToAddress.countryId = res[0].countryId;
                _this.billToAddress.country = res[0].countryId ? autocomplete_1.getValueFromArrayOfObjectById('label', 'value', res[0].countryId, _this.allCountriesList) : '';
            }
            else {
                _this.billToAddress.addressId = 0;
                _this.billToAddress.address1 = '';
                _this.billToAddress.address2 = '';
                _this.billToAddress.city = '';
                _this.billToAddress.stateOrProvince = '';
                _this.billToAddress.postalCode = '';
                _this.billToAddress.country = '';
                _this.billToAddress.countryId = null;
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.getBillToUserIdEdit = function (data) {
        var _this = this;
        if (data.billToUserType === this.customerModuleId) {
            this.tempBillTOAddressId = data.billToAddressId;
            this.onBillToCustomerSelected(data.billToUserId, data, data.billToSiteId, 'billEdit');
            return autocomplete_1.getObjectById('value', data.billToUserId, this.allCustomers);
        }
        if (data.billToUserType === this.vendorModuleId) {
            this.tempBillTOAddressId = data.billToAddressId;
            this.onBillToVendorSelected(data.billToUserId, data, data.billToSiteId, 'billEdit');
            return autocomplete_1.getObjectById('vendorId', data.billToUserId, this.allActions);
        }
        if (data.billToUserType === this.companyModuleId) {
            this.tempBillTOAddressId = data.billToAddressId;
            this.billToSelectedvalue = data.billToUserId;
            this.companyService.getBillingCompanySiteNames(this.billToSelectedvalue).subscribe(function (response) {
                _this.companySiteList_Billing = response;
                if (_this.isEditMode) {
                    if (data.billToSiteId == 0) {
                        _this.companySiteList_Billing.push({ legalEntityBillingAddressId: 0, siteName: data.billToSiteName });
                        _this.billToAddress.address1 = data.billToAddress1;
                        _this.billToAddress.address2 = data.billToAddress2;
                        _this.billToAddress.city = data.billToCity;
                        _this.billToAddress.stateOrProvince = data.billToState;
                        _this.billToAddress.postalCode = data.billToPostalCode;
                        _this.billToAddress.country = data.billToCountry;
                    }
                    else {
                        _this.onBillToGetCompanyAddress(data.billToSiteId);
                    }
                }
            }, function (err) {
                _this.isSpinnerVisible = false;
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
            });
            this.companyService.getCompanyContacts(this.billToSelectedvalue).subscribe(function (response) {
                _this.contactListForCompanyBilling = response;
                _this.sourcePoApproval.billToContactId = autocomplete_1.getObjectById('contactId', data.billToContactId, _this.contactListForCompanyBilling);
            }, function (err) {
                _this.isSpinnerVisible = false;
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
            });
            return autocomplete_1.getObjectById('value', data.billToUserId, this.legalEntity);
        }
    };
    // bill to
    PurchaseSetupComponent.prototype.onBillToGetAddress = function (data, id) {
        var _this = this;
        if (data.billToUserTypeId == this.customerModuleId || data.billToUserType == this.customerModuleId) {
            var resp = autocomplete_1.getObjectById('customerBillingAddressId', id, this.billToCusData);
            if (resp) {
                this.billToAddress.address1 = resp.address1;
                this.billToAddress.address2 = resp.address2;
                this.billToAddress.city = resp.city;
                this.billToAddress.stateOrProvince = resp.stateOrProvince;
                this.billToAddress.postalCode = resp.postalCode;
                this.billToAddress.country = resp.countryName ? resp.countryName : resp.country;
            }
            else {
                this.billToAddress.address1 = '';
                this.billToAddress.address2 = '';
                this.billToAddress.city = '';
                this.billToAddress.stateOrProvince = '';
                this.billToAddress.postalCode = '';
                this.billToAddress.country = '';
            }
        }
        else if (data.billToUserTypeId == this.vendorModuleId || data.billToUserType == this.vendorModuleId) {
            if (id != 0) {
                this.vendorService.getVendorAddressById(id).subscribe(function (res) {
                    var resp = res;
                    if (resp) {
                        _this.billToAddress.addressId = resp.vba.addressId;
                        _this.billToAddress.address1 = resp.line1;
                        _this.billToAddress.address2 = resp.line2;
                        _this.billToAddress.city = resp.city;
                        _this.billToAddress.stateOrProvince = resp.stateOrProvince;
                        _this.billToAddress.postalCode = resp.postalCode;
                        _this.billToAddress.countryId = resp.countryId;
                        _this.billToAddress.country = resp.countryId ? autocomplete_1.getValueFromArrayOfObjectById('label', 'value', resp.countryId, _this.allCountriesList) : '';
                    }
                    else {
                        _this.billToAddress.address1 = '';
                        _this.billToAddress.address2 = '';
                        _this.billToAddress.city = '';
                        _this.billToAddress.stateOrProvince = '';
                        _this.billToAddress.postalCode = '';
                        _this.billToAddress.countryId = null;
                        _this.billToAddress.country = '';
                    }
                }, function (err) {
                    _this.isSpinnerVisible = false;
                    var errorLog = err;
                    _this.errorMessageHandler(errorLog);
                });
            }
            else {
                var resp = autocomplete_1.getObjectById('vendorBillingAddressId', id, this.vendorSelectedForBillTo);
                if (resp) {
                    this.billToAddress.address1 = resp.address1;
                    this.billToAddress.address2 = resp.address2;
                    this.billToAddress.city = resp.city;
                    this.billToAddress.stateOrProvince = resp.stateOrProvince;
                    this.billToAddress.postalCode = resp.postalCode;
                    this.billToAddress.country = resp.countryName ? resp.countryName : resp.country;
                }
                else {
                    this.billToAddress.address1 = '';
                    this.billToAddress.address2 = '';
                    this.billToAddress.city = '';
                    this.billToAddress.stateOrProvince = '';
                    this.billToAddress.postalCode = '';
                    this.billToAddress.country = '';
                }
            }
        }
    };
    PurchaseSetupComponent.prototype.onBillToCustomerSelected = function (customerId, res, id, value) {
        var _this = this;
        if (res) {
            res.billToStateOrProvince = res.billToState ? res.billToState : '';
        }
        this.clearInputOnClickUserIdBillTo();
        this.billToSelectedvalue = customerId;
        this.customerService.getCustomerBillViaDetails(customerId).subscribe(function (returnddataforbill) {
            _this.billToCusData = returnddataforbill[0];
            for (var i = 0; i < _this.billToCusData.length; i++) {
                if (_this.billToCusData[i].isPrimary && value != 'billEdit') {
                    _this.sourcePoApproval.billToSiteId = _this.billToCusData[i].customerBillingAddressId;
                    _this.sourcePoApproval.billToAddressId = _this.billToCusData[i].AddressId;
                }
            }
            if (id) {
                res.billToSiteId = id;
            }
            if (_this.isEditMode) {
                if (res && res.billToSiteId == 0) {
                    _this.billToCusData.push({ customerBillingAddressId: 0, address1: res.billToAddress1, address2: res.billToAddress2, city: res.billToCity, stateOrProvince: res.billToStateOrProvince, postalCode: res.billToPostalCode, country: res.billToCountry, siteName: res.billToSiteName });
                }
            }
            if (res) {
                _this.onBillToGetAddress(res, res.billToSiteId);
            }
            else {
                _this.onBillToGetAddress(_this.sourcePoApproval, _this.sourcePoApproval.billToSiteId);
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
        this.customerService.getContacts(customerId).subscribe(function (data) {
            _this.billToContactData = data[0];
            for (var i = 0; i < _this.billToContactData.length; i++) {
                if (_this.billToContactData[i].isDefaultContact) {
                    _this.sourcePoApproval.billToContactId = _this.billToContactData[i];
                }
            }
            if (_this.isEditMode && value == 'billEdit') {
                _this.sourcePoApproval.billToContactId = autocomplete_1.getObjectById('contactId', res.billToContactId, _this.billToContactData);
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.onBillToVendorSelected = function (vendorId, res, id, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.clearInputOnClickUserIdBillTo();
                        this.billToSelectedvalue = vendorId;
                        this.showInput = true;
                        return [4 /*yield*/, this.vendorService.getVendorSiteNames(vendorId).subscribe(function (returdaa) {
                                _this.vendorSelectedForBillTo = returdaa;
                                for (var i = 0; i < _this.vendorSelectedForBillTo.length; i++) {
                                    if (_this.vendorSelectedForBillTo[i].isPrimary && value != 'billEdit') {
                                        _this.sourcePoApproval.billToSiteId = _this.vendorSelectedForBillTo[i].vendorBillingAddressId;
                                        _this.sourcePoApproval.billToAddressId = _this.vendorSelectedForBillTo[i].AddressId;
                                    }
                                }
                                if (id) {
                                    res.billToSiteId = id;
                                    _this.onBillToGetAddress(res, res.billToSiteId);
                                }
                                if (_this.isEditMode) {
                                    if (res && res.billToSiteId == 0) {
                                        _this.vendorSelectedForBillTo.push({ vendorBillingAddressId: 0, siteName: res.billToSiteName });
                                        _this.billToAddress.address1 = res.billToAddress1;
                                        _this.billToAddress.address2 = res.billToAddress2;
                                        _this.billToAddress.city = res.billToCity;
                                        _this.billToAddress.stateOrProvince = res.billToState;
                                        _this.billToAddress.postalCode = res.billToPostalCode;
                                        _this.billToAddress.country = res.billToCountry;
                                    }
                                    else {
                                        if (res) {
                                            _this.onBillToGetAddress(res, res.billToSiteId);
                                        }
                                        else {
                                            _this.onBillToGetAddress(_this.sourcePoApproval, _this.sourcePoApproval.billToSiteId);
                                        }
                                    }
                                }
                            }, function (err) {
                                _this.isSpinnerVisible = false;
                                var errorLog = err;
                                _this.errorMessageHandler(errorLog);
                            })];
                    case 1:
                        _a.sent();
                        this.vendorService.getContacts(vendorId).subscribe(function (returdaa) {
                            _this.vendorContactsForBillTO = returdaa[0];
                            for (var i = 0; i < _this.vendorContactsForBillTO.length; i++) {
                                if (_this.vendorContactsForBillTO[i].isDefaultContact) {
                                    _this.sourcePoApproval.billToContactId = _this.vendorContactsForBillTO[i];
                                }
                            }
                            if (_this.isEditMode && value == 'billEdit') {
                                _this.sourcePoApproval.billToContactId = autocomplete_1.getObjectById('contactId', res.billToContactId, _this.vendorContactsForBillTO);
                            }
                        }, function (err) {
                            _this.isSpinnerVisible = false;
                            var errorLog = err;
                            _this.errorMessageHandler(errorLog);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    PurchaseSetupComponent.prototype.onChangeTabView = function (event) {
        if (event.index == 0) {
            // this.getPurchaseOrderPartsById(this.poId);
            this.getPurchaseOrderAllPartsById(this.poId);
            this.enablePartSaveBtn = false;
        }
        if (event.index == 1) {
            this.getApproversListById(this.poId);
        }
        if (event.index == 2) {
            this.getApproversListById(this.poId);
            this.getApprovalProcessListById(this.poId);
            this.enableApproverSaveBtn = false;
        }
        if (event.index == 3) {
            var id = autocomplete_1.editValueAssignByCondition('vendorId', this.headerInfo.vendorId);
            this.getVendorCapesByID(id);
        }
        // if(event.index == 4) {
        // 	this.enableAddSaveBtn = false;
        // 	this.getVendorPOAddressById(this.poId);
        // }
    };
    PurchaseSetupComponent.prototype.employeedata = function (strText, manStructID) {
        var _this = this;
        if (strText === void 0) { strText = ''; }
        if (manStructID === void 0) { manStructID = 0; }
        if (this.arrayEmplsit.length == 0) {
            this.arrayEmplsit.push(0);
        }
        this.arrayEmplsit.push(this.employeeId == null ? 0 : this.employeeId);
        this.commonService.autoCompleteDropdownsEmployeeByMS(strText, true, 20, this.arrayEmplsit.join(), manStructID).subscribe(function (res) {
            _this.allEmployeeList = res;
            _this.requisitionerList = res;
            _this.currentUserEmployeeName = autocomplete_1.getValueFromArrayOfObjectById('label', 'value', _this.employeeId, res);
            if (!_this.isEditMode) {
                _this.getRequisitionerOnLoad(_this.employeeId);
            }
        }, function (err) {
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
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
        this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name', strText, true, 20, this.arrayLegalEntitylsit.join()).subscribe(function (res) {
            _this.legalEntity = res;
            _this.legalEntityList_Forgrid = res;
            _this.legalEntityList_ForShipping = res;
            _this.legalEntityList_ForBilling = res;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.getCountriesList = function () {
        var _this = this;
        this.commonService.smartDropDownList('Countries', 'countries_id', 'nice_name').subscribe(function (res) {
            _this.allCountriesList = res;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.filterCompanyNameforgrid = function (event) {
        // 	this.legalEntityList_Forgrid = this.legalEntity;
        // 	const legalFilter = [...this.legalEntity.filter(x => {
        // 		return x.label.toLowerCase().includes(event.query.toLowerCase())
        // 	})]
        // 	this.legalEntityList_Forgrid = legalFilter;
        if (event.query !== undefined && event.query !== null) {
            this.getLegalEntity(event.query);
        }
    };
    PurchaseSetupComponent.prototype.filterCompanyNameforShipping = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.getLegalEntity(event.query);
        }
    };
    PurchaseSetupComponent.prototype.filterCompanyNameforBilling = function (event) {
        if (event.query !== undefined && event.query !== null) {
            this.getLegalEntity(event.query);
        }
    };
    PurchaseSetupComponent.prototype.loadVendorContactInfo = function () {
        var _this = this;
        this.vendorService.getContactsFirstName().subscribe(function (results) {
            _this.venContactList = results[0];
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.priorityData = function () {
        var _this = this;
        this.commonService.smartDropDownList('Priority', 'PriorityId', 'Description').subscribe(function (res) {
            _this.allPriorityInfo = res;
            _this.allPriorityInfo.map(function (x) {
                if (x.label == 'Routine') {
                    _this.headerInfo.priorityId = x;
                }
            });
            _this.onSelectPriority();
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.loadWorkOrderList = function (filterVal) {
        var _this = this;
        if (filterVal === void 0) { filterVal = ''; }
        if (this.arrayWOlist.length == 0) {
            this.arrayWOlist.push(0);
        }
        this.commonService.getWODataFilter(filterVal, 20, this.arrayWOlist.join()).subscribe(function (res) {
            var data = res.map(function (x) {
                return {
                    value: x.workOrderId,
                    label: x.workOrderNum
                };
            });
            _this.allWorkOrderInfo = [
                { value: 0, label: 'Select' }
            ];
            _this.allWorkOrderInfo = __spreadArrays(_this.allWorkOrderInfo, data);
            _this.allWorkOrderDetails = __spreadArrays(_this.allWorkOrderInfo, data);
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.loadSubWorkOrderList = function (filterVal) {
        var _this = this;
        if (filterVal === void 0) { filterVal = ''; }
        if (this.arraysubWOlist.length == 0) {
            this.arraysubWOlist.push(0);
        }
        this.commonService.getsubWODataFilter(filterVal, 20, this.arraysubWOlist.join()).subscribe(function (res) {
            var data = res.map(function (x) {
                return {
                    value: x.subWorkOrderId,
                    label: x.subWorkOrderNo
                };
            });
            _this.allsubWorkOrderInfo = [
                { value: 0, label: 'Select' }
            ];
            _this.allsubWorkOrderInfo = __spreadArrays(_this.allsubWorkOrderInfo, data);
            _this.allsubWorkOrderDetails = __spreadArrays(_this.allsubWorkOrderDetails, data);
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.loadRepairOrderList = function (filterVal) {
        var _this = this;
        if (filterVal === void 0) { filterVal = ''; }
        if (this.arrayROlist.length == 0) {
            this.arrayROlist.push(0);
        }
        this.commonService.getRODataFilter(filterVal, 20, this.arrayROlist.join()).subscribe(function (res) {
            var data = res.map(function (x) {
                return {
                    value: x.repairOrderId,
                    label: x.repairOrderNumber
                };
            });
            _this.allRepairOrderInfo = [
                { value: 0, label: 'Select' }
            ];
            _this.allRepairOrderInfo = __spreadArrays(_this.allRepairOrderInfo, data);
            _this.allRepairOrderDetails = __spreadArrays(_this.allRepairOrderInfo, data);
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.loadSalesOrderList = function (filterVal) {
        var _this = this;
        if (filterVal === void 0) { filterVal = ''; }
        if (this.arraySOlist.length == 0) {
            this.arraySOlist.push(0);
        }
        this.commonService.getSODataFilter(filterVal, 20, this.arraySOlist.join()).subscribe(function (res) {
            var data = res.map(function (x) {
                return {
                    value: x.salesOrderId,
                    label: x.salesOrderNumber
                };
            });
            _this.allSalesOrderInfo = [
                { value: 0, label: 'Select' }
            ];
            _this.allSalesOrderInfo = __spreadArrays(_this.allSalesOrderInfo, data);
            _this.allSalesOrderDetails = __spreadArrays(_this.allSalesOrderInfo, data);
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
        // this.commonService.getOpenSONumbers().subscribe(res => {
        // 	this.allSalesOrderInfo = res.map(x => {
        // 		return {
        // 			value: x.salesOrderId,
        // 			label: x.salesOrderNumber
        // 		}
        // 	});
        // 	for(let i = 0; i< this.allSalesOrderInfo.length; i++){
        // 		if(this.salesOrderReferenceData) {
        // 			if(this.allSalesOrderInfo[i].value == this.salesOrderReferenceData.salesOrderId){
        // 				this.newObjectForParent.salesOrderId = this.allSalesOrderInfo[i];
        // 			}
        // 		}
        // 	}
        // },err => {
        // 	this.isSpinnerVisible = false;
        // 	const errorLog = err;
        // 	this.errorMessageHandler(errorLog);		
        // });
    };
    PurchaseSetupComponent.prototype.loadShippingViaList = function () {
        var _this = this;
        this.commonService.smartDropDownList('ShippingVia', 'ShippingViaId', 'Name').subscribe(function (res) {
            _this.allShipViaInfo = res;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
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
        this.employeedata('', 0);
        this.loadVendorList();
        this.loadCurrencyData();
        this.loadConditionData();
        this.loadApprovalProcessStatus();
        this.loadPOApproverStatus();
        this.loadcustomerData();
        this.getLegalEntity();
        this.getCountriesList();
        this.loadPercentData();
        this.loadWorkOrderList();
        this.loadSubWorkOrderList();
        this.loadRepairOrderList();
        this.loadSalesOrderList();
        this.loadShippingViaList();
        this.loapartItems();
        //#Happy 	
        //#Happy this.loadVendorContactInfo();
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
                openDate: this.headerInfo.openDate,
                needByDate: this.headerInfo.needByDate,
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
                    // setTimeout(() => {
                    // 	this.editDropDownLoad(); 	
                    // }, 1200);
                    // ///After Save load data
                    // this.addPartNumber();
                    //#Happy this.salesStockRefData();  // need to check
                    //#Happy 
                    /*
                    if(this.stocklineReferenceData != null && this.stocklineReferenceData != undefined) {
                        this.getManagementStructureByStockline(this.stocklineReferenceData.managementStructureEntityId);
                    }	*/
                    if (_this.poId) {
                        _this.isEditModeHeader = true;
                        _this.isEditMode = true;
                    }
                    _this.isSpinnerVisible = false;
                }, function (err) {
                    _this.isSpinnerVisible = false;
                    var errorLog = err;
                    _this.errorMessageHandler(errorLog);
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
                    var errorLog = err;
                    _this.errorMessageHandler(errorLog);
                    _this.toggle_po_header = true;
                    _this.enableHeaderSaveBtn = true;
                });
            }
            this.toggle_po_header = false;
            this.enableHeaderSaveBtn = false;
        }
    };
    PurchaseSetupComponent.prototype.dismissModel = function () {
        this.savePurchaseOrderPartsList(true);
    };
    PurchaseSetupComponent.prototype.savePurchaseOrderPartsList = function (contwithoutVendorPrice) {
        var _this = this;
        if (contwithoutVendorPrice === void 0) { contwithoutVendorPrice = false; }
        // if(this.createPOPartsForm.invalid) {
        // 	this.alertService.showMessage('Purchase Order', "Please enter required highlighted fields for PO PartsList!", MessageSeverity.error);
        // 	this.inputValidCheck = true;
        // 	return;
        // }		
        this.isSpinnerVisible = true;
        this.parentObjectArray = [];
        var errmessage = '';
        for (var i = 0; i < this.partListData.length; i++) {
            this.alertService.resetStickyMessage();
            if (this.partListData[i].quantityOrdered == 0) {
                this.isSpinnerVisible = false;
                errmessage = errmessage + '<br />' + "Please enter Qty.";
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
                    if (!this.partListData[i].childList[j].quantityOrdered || this.partListData[i].childList[j].quantityOrdered == 0) {
                        this.isSpinnerVisible = false;
                        errmessage = errmessage + '<br />' + "Split Shipment Qty is required.";
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
                this.alertService.showStickyMessage("Validation failed", errmessage, alert_service_1.MessageSeverity.error, 'Please enter Qty');
                return;
            }
            if (this.partListData[i].vendorListPrice == 0 && contwithoutVendorPrice == false) {
                this.isSpinnerVisible = false;
                this.displayWarningModal = true;
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
            this.parentObject = {
                purchaseOrderId: this.poId,
                isParent: true,
                itemMasterId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
                altEquiPartNumberId: this.partListData[i].altEquiPartNumberId ? this.getAltEquiPartNumByObject(this.partListData[i].altEquiPartNumberId) : null,
                assetId: this.partListData[i].assetId ? this.partListData[i].assetId : 0,
                partNumberId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
                itemTypeId: this.partListData[i].itemTypeId ? this.partListData[i].itemTypeId : 0,
                manufacturerId: this.partListData[i].manufacturerId ? this.partListData[i].manufacturerId : 0,
                glAccountId: this.partListData[i].glAccountId ? this.partListData[i].glAccountId : 0,
                UOMId: this.partListData[i].UOMId ? this.partListData[i].UOMId : 0,
                needByDate: this.datePipe.transform(this.partListData[i].needByDate, "MM/dd/yyyy"),
                conditionId: this.partListData[i].conditionId ? this.partListData[i].conditionId : 0,
                priorityId: this.partListData[i].priorityId ? this.partListData[i].priorityId : 0,
                quantityOrdered: this.partListData[i].quantityOrdered ? parseFloat(this.partListData[i].quantityOrdered.toString().replace(/\,/g, '')) : 0,
                unitCost: this.partListData[i].unitCost ? parseFloat(this.partListData[i].unitCost.toString().replace(/\,/g, '')) : 0,
                vendorListPrice: this.partListData[i].vendorListPrice ? parseFloat(this.partListData[i].vendorListPrice.toString().replace(/\,/g, '')) : 0,
                discountPerUnit: this.partListData[i].discountPerUnit ? parseFloat(this.partListData[i].discountPerUnit.toString().replace(/\,/g, '')) : 0,
                discountPercent: this.partListData[i].discountPercent ? this.partListData[i].discountPercent : 0,
                discountAmount: this.partListData[i].discountAmount ? parseFloat(this.partListData[i].discountAmount.toString().replace(/\,/g, '')) : 0,
                extendedCost: this.partListData[i].extendedCost ? parseFloat(this.partListData[i].extendedCost.toString().replace(/\,/g, '')) : 0,
                functionalCurrencyId: this.partListData[i].functionalCurrencyId ? this.getCurrencyIdByObject(this.partListData[i].functionalCurrencyId) : null,
                foreignExchangeRate: this.partListData[i].foreignExchangeRate ? this.partListData[i].foreignExchangeRate : 0,
                reportCurrencyId: this.partListData[i].reportCurrencyId ? this.getCurrencyIdByObject(this.partListData[i].reportCurrencyId) : null,
                workOrderId: this.partListData[i].workOrderId && this.getValueFromObj(this.partListData[i].workOrderId) != 0 ? this.getValueFromObj(this.partListData[i].workOrderId) : null,
                repairOrderId: this.partListData[i].repairOrderId && this.getValueFromObj(this.partListData[i].repairOrderId) != 0 ? this.getValueFromObj(this.partListData[i].repairOrderId) : null,
                salesOrderId: this.partListData[i].salesOrderId && this.getValueFromObj(this.partListData[i].salesOrderId) != 0 ? this.getValueFromObj(this.partListData[i].salesOrderId) : null,
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
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
        this.enableHeaderSaveBtn = false;
    };
    // savePurchaseOrderAddress() {	
    // 	if(this.createPOAddressForm.invalid || 
    // 		 this.sourcePoApproval.shipToUserTypeId == 0 || this.sourcePoApproval.shipToUserTypeId == null 
    // 		 || this.sourcePoApproval.shipToSiteId == 0  || this.sourcePoApproval.shipToSiteId == null 
    // 		 || this.sourcePoApproval.shipViaId == 0  || this.sourcePoApproval.shipViaId == null
    // 		 || this.sourcePoApproval.billToUserTypeId == 0 || this.sourcePoApproval.billToUserTypeId == null
    // 		 || this.sourcePoApproval.billToSiteId == 0 || this.sourcePoApproval.billToSiteId == null ) {
    // 		this.alertService.showMessage('Purchase Order', "Please enter required highlighted fields for PO Address!", MessageSeverity.error);
    // 		this.inputValidCheckAdd = true;
    // 		if(this.sourcePoApproval.shipToUserTypeId == 0) {
    // 			this.shipToUserTypeValidCheck = true;
    // 		}
    // 		if(this.sourcePoApproval.shipToSiteId == 0) {
    // 			this.shipToSiteNameValidCheck = true;
    // 		}
    // 		if(this.sourcePoApproval.shipViaId == 0) {
    // 			this.shipViaValidCheck = true;
    // 		}
    // 		if(this.sourcePoApproval.billToUserTypeId == 0) {
    // 			this.billToUserTypeValidCheck = true;
    // 		}
    // 		if(this.sourcePoApproval.billToAddressId == 0) {
    // 			this.billToSiteNameValidCheck = true;
    // 		}
    // 	}
    // 	else {
    // 		this.isSpinnerVisible = true;			
    // 		this.sourcePoApprovalObj = {
    // 			purchaseOrderId: this.poId,		
    // 			shipToPOAddressId :  this.sourcePoApproval.shipToPOAddressId ? this.sourcePoApproval.shipToPOAddressId : 0 ,	
    // 			shipToUserTypeId: this.sourcePoApproval.shipToUserTypeId ? parseInt(this.sourcePoApproval.shipToUserTypeId) : 0,
    // 			shipToUserId: this.sourcePoApproval.shipToUserId ? this.getShipToBillToUserId(this.sourcePoApproval.shipToUserId) : 0,
    // 			shipToSiteId: this.sourcePoApproval.shipToSiteId ? this.sourcePoApproval.shipToSiteId : 0,
    // 			shipToSiteName: this.postSiteNameForShipping(this.sourcePoApproval.shipToUserTypeId, this.sourcePoApproval.shipToSiteId),
    // 			shipToMemo: this.sourcePoApproval.shipToMemo ? this.sourcePoApproval.shipToMemo : '',
    // 			shipToContactId: this.sourcePoApproval.shipToContactId ? editValueAssignByCondition('contactId', this.sourcePoApproval.shipToContactId) : 0,
    // 			ShipToContact: this.sourcePoApproval.shipToContactId && this.sourcePoApproval.shipToContactId.firstName 
    // 			 	          && this.sourcePoApproval.shipToContactId.firstName != null && this.sourcePoApproval.shipToContactId.firstName != undefined  ? this.sourcePoApproval.shipToContactId.firstName : '',
    // 			ShipAddIsPoOnly: false,
    // 			shipToAddressId: this.shipToAddress.addressId ? this.shipToAddress.addressId : 0,
    // 			shipToAddress1: this.shipToAddress.address1,
    // 			shipToAddress2: this.shipToAddress.address2,
    // 			shipToAddress3: this.shipToAddress.address3,
    // 			shipToCity: this.shipToAddress.city,
    // 			shipToStateOrProvince: this.shipToAddress.stateOrProvince,
    // 			shipToPostalCode: this.shipToAddress.postalCode,
    // 			shipToCountry: this.shipToAddress.country,
    // 			shipToCountryId: this.shipToAddress.countryId,
    // 			billToPOAddressId : this.sourcePoApproval.billToPOAddressId ? this.sourcePoApproval.billToPOAddressId : 0 ,	
    // 			billToUserTypeId: this.sourcePoApproval.billToUserTypeId ? parseInt(this.sourcePoApproval.billToUserTypeId) : 0,
    // 			billToUserId: this.sourcePoApproval.billToUserId ? this.getShipToBillToUserId(this.sourcePoApproval.billToUserId) : 0,
    // 			billToSiteId: this.sourcePoApproval.billToSiteId ? this.sourcePoApproval.billToSiteId : 0,
    // 			billToSiteName: this.postSiteNameForBilling(this.sourcePoApproval.billToUserTypeId, this.sourcePoApproval.billToSiteId),
    // 			billToMemo: this.sourcePoApproval.billToMemo ? this.sourcePoApproval.billToMemo : '',				
    // 			billToContactId: this.sourcePoApproval.billToContactId ? editValueAssignByCondition('contactId', this.sourcePoApproval.billToContactId) : 0,
    // 			billToContact: this.sourcePoApproval.billToContactId && this.sourcePoApproval.billToContactId.firstName 
    // 			 	          && this.sourcePoApproval.billToContactId.firstName != null && this.sourcePoApproval.billToContactId.firstName != undefined  ? this.sourcePoApproval.billToContactId.firstName : '',
    // 			billAddIsPoOnly: false,	
    // 			billToAddressId: this.billToAddress.addressId ? this.billToAddress.addressId : 0,
    // 			billToAddress1: this.billToAddress.address1,
    // 			billToAddress2: this.billToAddress.address2,				
    // 			billToCity: this.billToAddress.city,
    // 			billToStateOrProvince: this.billToAddress.stateOrProvince,
    // 			billToPostalCode: this.billToAddress.postalCode,
    // 			billToCountry: this.billToAddress.country,
    // 			billToCountryId: this.billToAddress.countryId,	    		
    // 			poShipViaId: this.sourcePoApproval.poShipViaId ? this.sourcePoApproval.poShipViaId : 0,
    // 			shipViaId: this.sourcePoApproval.shipViaId,
    // 			shippingCost: this.sourcePoApproval.shippingCost ? parseFloat(this.sourcePoApproval.shippingCost.toString().replace(/\,/g,'')) : 0,
    // 			handlingCost: this.sourcePoApproval.handlingCost ? parseFloat(this.sourcePoApproval.handlingCost.toString().replace(/\,/g,'')) : 0,
    // 			shipVia: this.sourcePoApproval.shipVia,
    // 			shippingAcctNum: this.sourcePoApproval.shippingAcctNum,	
    // 			MasterCompanyId: this.currentUserMasterCompanyId,
    // 			createdBy: this.userName,
    // 			updatedBy: this.userName,	
    // 		}
    // 		// debugger; 
    // 		// const tempShipToAdd = {
    // 		// AddressId: 0,	
    // 		// line1: this.shipToAddress.address1,
    // 		// line2: this.shipToAddress.address2,					
    // 		// city: this.shipToAddress.city,
    // 		// stateOrProvince: this.shipToAddress.stateOrProvince,
    // 		// postalCode: this.shipToAddress.postalCode,
    // 		// countryId: 0}
    // 		// this.commonService.createAddress({...tempShipToAdd}).subscribe
    // 		// ( res => {
    // 		// 	var addressId =
    // 		// },
    // 		// err=>{this.isSpinnerVisible = false;
    // 		// 		const errorLog = err;
    // 		// 		this.errorMessageHandler(errorLog);}
    // 		// );
    // 		// const poShippingAddress = {
    // 		// 	POAddressId: 0,
    // 		// 	PurchaseOrderId: this.poId,
    // 		// 	IsShippingAdd: true,
    // 		// 	UserType: this.sourcePoApproval.shipToUserTypeId ? parseInt(this.sourcePoApproval.shipToUserTypeId) : 0,
    // 		// 	UserId: this.sourcePoApproval.shipToUserId ? this.getShipToBillToUserId(this.sourcePoApproval.shipToUserId) : 0,
    // 		// 	SiteId: this.postSiteNameForShipping(this.sourcePoApproval.shipToUserTypeId, this.sourcePoApproval.shipToAddressId),
    // 		// 	shipToSiteName: this.postSiteNameForShipping(this.sourcePoApproval.shipToUserTypeId, this.sourcePoApproval.shipToAddressId),
    // 		// 	AddressId: this.sourcePoApproval.shipToAddressId ? this.sourcePoApproval.shipToAddressId : 0,
    // 		// 	ContactId: this.sourcePoApproval.shipToContactId ? editValueAssignByCondition('contactId', this.sourcePoApproval.shipToContactId) : 0,
    // 		// 	ContactName: this.sourcePoApproval.shipToContactId && this.sourcePoApproval.shipToContactId.firstName 
    // 		// 	             && this.sourcePoApproval.shipToContactId.firstName != null && this.sourcePoApproval.shipToContactId.firstName != undefined  ? this.sourcePoApproval.shipToContactId.firstName : '',	
    // 		// 	IsPoOnly: false,				 
    // 		// 	createdBy: this.userName,
    // 		// 	updatedBy: this.userName,
    // 		// }
    // 		// const Address = { AddressId: 0, line1:this.shipToAddress.address1,line2:this.shipToAddress.address2	}
    // 		// //let poShippingAddress = {}
    // 		// //this.poAddressArray.push[poShippingAddress];poShippingAddress
    // 		//..this.poAddressArray.push[this.poShippingAddress];
    // 		const poAddressEdit = { ...this.sourcePoApprovalObj, purchaseOrderId: parseInt(this.poId) };
    // 		this.purchaseOrderService.savePurchaseOrderAddress({ ...poAddressEdit }).subscribe(res => {
    // 				if(res.shipToUserTypeId && res.shipToUserTypeId > 0) {
    // 					this.sourcePoApproval = {
    // 						shipToPOAddressId: res.shipToPOAddressId,
    // 						shipToUserTypeId: res.shipToUserType,	
    // 						shipToUserId: this.getShipToUserIdEdit(res),
    // 						shipToSiteId: res.shipToSiteId,
    // 						shipToSiteName: res.shipToSiteName,
    // 						shipToContactId: res.shipToContactId,
    // 						shipToContact: res.shipToContact,  
    // 						shipToMemo: res.shipToMemo,
    // 						shipToAddressId: res.shipToAddressId,
    // 						shipToAddress1: res.shipToAddress1,
    // 						shipToAddress2: res.shipToAddress2,			
    // 						shipToCity: res.shipToCity,
    // 						shipToStateOrProvince: res.shipToState,
    // 						shipToPostalCode: res.shipToPostalCode,
    // 						ShipToCountryId: res.ShipToCountryId,
    // 						poShipViaId: res.poShipViaId,
    // 						billToPOAddressId: res.billToPOAddressId,
    // 						billToUserTypeId: res.billToUserType,
    // 						billToUserId: this.getBillToUserIdEdit(res),
    // 						billToSiteId: res.billToSiteId,
    // 						billToSiteName: res.billToSiteName,
    // 						billToContactId: res.billToContactId,
    // 						billToContactName: res.billToContactName,
    // 						billToMemo: res.billToMemo,
    // 						billToAddressId: res.billToAddressId,	
    // 						billToAddress1: res.billToAddress1,
    // 						billToAddress2: res.billToAddress2,
    // 						billToCity: res.billToCity,
    // 						billToStateOrProvince: res.billToState,
    // 						billToPostalCode: res.billToPostalCode,
    // 						billToCountryId: res.billToCountryId,							
    // 						shipViaId: res.shipViaId,
    // 						shipVia: res.shipVia,
    // 						shippingCost: formatNumberAsGlobalSettingsModule(res.shippingCost, 2),
    // 						handlingCost: formatNumberAsGlobalSettingsModule(res.handlingCost, 2),	
    // 						shippingAccountNo: res.shippingAccountNo
    // 					};
    // 					this.isEditModeAdd = true;
    // 				} else {
    // 					this.isEditModeAdd = false;
    // 				}
    // 				this.isSpinnerVisible = false;
    // 				this.enableAddSaveBtn = false;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Saved PO Address Successfully`,
    // 					MessageSeverity.success
    // 				);					
    // 			}, err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);
    // 			});			
    // 	}
    // }
    PurchaseSetupComponent.prototype.goToCreatePOList = function () {
        this.route.navigate(['/vendorsmodule/vendorpages/app-create-po']);
    };
    PurchaseSetupComponent.prototype.getManagementStructureByStockline = function (id) {
        var _this = this;
        this.commonService.getManagementStructureNamesAndCodes(id).subscribe(function (msparent) {
            if (msparent.Level1) {
                _this.newObjectForParent.parentCompanyId = msparent.Level1;
                _this.getParentBUList(_this.newObjectForParent);
            }
            else
                _this.newObjectForParent.parentCompanyId = 0;
            if (msparent.Level2) {
                _this.newObjectForParent.parentbuId = msparent.Level2;
                _this.getParentDivisionlist(_this.newObjectForParent);
            }
            else
                _this.newObjectForParent.parentbuId = 0;
            if (msparent.Level3) {
                _this.newObjectForParent.parentDivisionId = msparent.Level3;
                _this.getParentDeptlist(_this.newObjectForParent);
            }
            else
                _this.newObjectForParent.parentDivisionId = 0;
            if (msparent.Level4) {
                _this.newObjectForParent.parentDeptId = msparent.Level4;
                _this.getParentDeptId(_this.newObjectForParent);
            }
            else
                _this.newObjectForParent.parentDeptId = 0;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    // postSiteNameForShipping(moduleId, currentshipToAddressId) {
    // 	if (moduleId !== undefined && currentshipToAddressId !== undefined) {
    // 		moduleId = parseInt(moduleId)
    // 		if (moduleId == this.customerModuleId) {
    // 			return getValueFromArrayOfObjectById('siteName', 'customerShippingAddressId', currentshipToAddressId, this.shipToCusData);
    // 		} else if (moduleId == this.vendorModuleId) {
    // 				return getValueFromArrayOfObjectById('siteName', 'vendorShippingAddressId', currentshipToAddressId, this.vendorSelected);
    // 		} else if (moduleId == this.companyModuleId) {
    // 				return getValueFromArrayOfObjectById('siteName', 'legalEntityShippingAddressId', currentshipToAddressId, this.companySiteList_Shipping);
    // 		}
    // 	}
    // }
    // postSiteNameForBilling(moduleId, currentbillToAddressId) {
    // 	if (moduleId !== undefined && currentbillToAddressId !== undefined) {
    // 		moduleId = parseInt(moduleId)
    // 		if (moduleId == this.customerModuleId) {
    // 			return getValueFromArrayOfObjectById('siteName', 'customerBillingAddressId', currentbillToAddressId, this.billToCusData);
    // 		} else if (moduleId == this.vendorModuleId) {
    // 				return getValueFromArrayOfObjectById('siteName', 'vendorBillingAddressId', currentbillToAddressId, this.vendorSelectedForBillTo);
    // 		} else if (moduleId == this.companyModuleId) {
    // 				return getValueFromArrayOfObjectById('siteName', 'legalEntityBillingAddressId', currentbillToAddressId, this.companySiteList_Billing);
    // 		}
    // 	}
    // }	
    PurchaseSetupComponent.prototype.loadcustomerData = function (strText) {
        var _this = this;
        if (strText === void 0) { strText = ''; }
        if (this.arrayCustlist.length == 0) {
            this.arrayCustlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', strText, true, 20, this.arrayCustlist.join()).subscribe(function (response) {
            _this.allCustomers = response;
            _this.customerNames = response;
            _this.splitcustomersList = response;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.loapartItems = function (strvalue) {
        var _this = this;
        if (strvalue === void 0) { strvalue = ''; }
        this.commonService.getStockpartnumbersAutoComplete(strvalue, false, 0).subscribe(function (res) {
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
    PurchaseSetupComponent.prototype.filterAltPartItems = function (event, partNo) {
        var _this = this;
        var itemMasterId = autocomplete_1.getValueFromObjectByKey('value', partNo);
        this.itemser.getItemMasterAltEquiMappingParts(itemMasterId).subscribe(function (res) {
            _this.altPartNumList = res;
            _this.altPartCollection = _this.altPartNumList;
            if (event.query !== undefined && event.query !== null) {
                var partNumberFilter = __spreadArrays(_this.altPartNumList.filter(function (x) {
                    return x.altEquiPartNumber.toLowerCase().includes(event.query.toLowerCase());
                }));
                _this.altPartCollection = partNumberFilter;
            }
        }, function (err) {
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.filterNames = function (event) {
        // this.customerNames = this.allCustomers;
        // if (event.query !== undefined && event.query !== null) {
        // 	const customers = [...this.allCustomers.filter(x => {
        // 		return x.label.toLowerCase().includes(event.query.toLowerCase())
        // 	})]
        // 	this.customerNames = customers;
        // }
        if (event.query !== undefined && event.query !== null) {
            this.loadcustomerData(event.query);
        }
    };
    PurchaseSetupComponent.prototype.getAddressDetails = function (variable, pindex, cindex) {
        return this[variable + pindex + cindex];
    };
    PurchaseSetupComponent.prototype.filterCustomersSplit = function (event) {
        // this.splitcustomersList = this.allCustomers;
        // if (event.query !== undefined && event.query !== null) {
        // 	const customers = [...this.allCustomers.filter(x => {
        // 		return x.label.toLowerCase().includes(event.query.toLowerCase())
        // 	})]
        // 	this.splitcustomersList = customers;
        // 		}
        if (event.query !== undefined && event.query !== null) {
            this.loadcustomerData(event.query);
        }
    };
    PurchaseSetupComponent.prototype.filterSplitVendorNames = function (event) {
        // this.splitVendorNames = this.allActions;
        // if (event.query !== undefined && event.query !== null) {
        // 	const vendorNames = [...this.allActions.filter(x => {
        // 		return x.vendorName.toLowerCase().includes(event.query.toLowerCase())
        // 	})]
        // 	this.splitVendorNames = vendorNames;
        // }
        if (event.query !== undefined && event.query !== null) {
            //	this(event.query);
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
        this.enablePartSave();
        if (childata.purchaseOrderPartRecordId !== undefined && childata.purchaseOrderPartRecordId !== null) {
            this.partListData[mainindex].childList = this.partListData[mainindex].childList.map(function (x) {
                if (x.purchaseOrderPartRecordId == childata.purchaseOrderPartRecordId) {
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
    PurchaseSetupComponent.prototype.filterCustomerContactsForShipTo = function (event) {
        this.firstNamesShipTo = this.shipToContactData;
        if (event.query !== undefined && event.query !== null) {
            var customerContacts = __spreadArrays(this.shipToContactData.filter(function (x) {
                return x.firstName.toLowerCase().includes(event.query.toLowerCase());
            }));
            this.firstNamesShipTo = customerContacts;
        }
    };
    PurchaseSetupComponent.prototype.filterVendorContactsForShipTo = function (event) {
        this.firstNamesShipTo1 = this.vendorContactsForshipTo;
        if (event.query !== undefined && event.query !== null) {
            var vendorContacts = __spreadArrays(this.vendorContactsForshipTo.filter(function (x) {
                return x.firstName.toLowerCase().includes(event.query.toLowerCase());
            }));
            this.firstNamesShipTo1 = vendorContacts;
        }
    };
    PurchaseSetupComponent.prototype.filterShippingContacts = function (event) {
        this.contactListForShippingCompany = this.contactListForCompanyShipping;
        var customerContacts = __spreadArrays(this.contactListForCompanyShipping.filter(function (x) {
            return x.firstName.toLowerCase().includes(event.query.toLowerCase());
        }));
        this.contactListForShippingCompany = customerContacts;
    };
    PurchaseSetupComponent.prototype.filterBillingContact = function (event) {
        this.contactListForBillingCompany = this.contactListForCompanyBilling;
        var customerContacts = __spreadArrays(this.contactListForCompanyBilling.filter(function (x) {
            return x.firstName.toLowerCase().includes(event.query.toLowerCase());
        }));
        this.contactListForBillingCompany = customerContacts;
    };
    PurchaseSetupComponent.prototype.filterCustomerContactsForBillTo = function (event) {
        this.firstNamesbillTo = this.billToContactData;
        if (event.query !== undefined && event.query !== null) {
            var customerContacts = __spreadArrays(this.billToContactData.filter(function (x) {
                return x.firstName.toLowerCase().includes(event.query.toLowerCase());
            }));
            this.firstNamesbillTo = customerContacts;
        }
    };
    PurchaseSetupComponent.prototype.filterVendorContactsForBillTo = function (event) {
        this.firstNamesbillTo1 = this.vendorContactsForBillTO;
        if (event.query !== undefined && event.query !== null) {
            var vendorContacts = __spreadArrays(this.vendorContactsForBillTO.filter(function (x) {
                return x.firstName.toLowerCase().includes(event.query.toLowerCase());
            }));
            this.firstNamesbillTo1 = vendorContacts;
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
    // onClickBillSiteName(value, data?) {
    // 	this.resetAddressBillingForm();
    // 	if (value === 'AddCusSiteName') {
    // 		this.addressSiteNameHeader = 'Add Bill To Customer Details';
    // 	}
    // 	if (value === 'EditCusSiteName') {
    // 		this.addressSiteNameHeader = 'Edit Bill To Customer Details';
    // 		this.isEditModeBilling = true;
    // 		this.tempbillToAddress = getObjectById('customerBillingAddressId', data.billToSiteId, this.billToCusData);
    // 		this.onBillToGetAddress(data, data.billToSiteId);
    // 		if (typeof this.tempbillToAddress.country == 'number') {
    // 			this.addressFormForBilling = { ...this.tempbillToAddress, country: getObjectByValue('value', this.tempbillToAddress.country, this.allCountriesList) };
    // 		} else {
    // 			this.addressFormForBilling = { ...this.tempbillToAddress, countryId: getObjectByValue('value', this.tempbillToAddress.countryId, this.allCountriesList) };
    // 		}
    // 	}
    // 	if (value === 'AddVenSiteName') {
    // 		this.addressSiteNameHeader = 'Add Bill To Vendor Details';
    // 	}
    // 	if (value === 'EditVenSiteName') {
    // 		this.addressSiteNameHeader = 'Edit Bill To Vendor Details';
    // 		this.isEditModeBilling = true;
    // 		this.tempbillToAddress = getObjectById('vendorBillingAddressId', data.billToSiteId, this.vendorSelectedForBillTo);
    // 		this.onBillToGetAddress(data, data.billToSiteId);
    // 		const tempBillToAdd = this.billToAddress;
    // 		this.addressFormForBilling = { ...tempBillToAdd, siteName: this.tempbillToAddress.siteName, vendorBillingAddressId: this.tempbillToAddress.vendorBillingAddressId };			
    // 		if (typeof this.addressFormForBilling.country == 'number') {
    // 			this.addressFormForBilling = { ...this.addressFormForBilling, country: getObjectByValue('value', this.addressFormForBilling.country, this.allCountriesList) };
    // 		} else {
    // 			this.addressFormForBilling = { ...this.addressFormForBilling, countryId: getObjectByValue('value', this.addressFormForBilling.countryId, this.allCountriesList) };
    // 		}
    // 	}
    // 	if (value === 'AddComSiteName') {
    // 		this.addressSiteNameHeader = 'Add Bill To Company Details';
    // 	}
    // 	if (value === 'EditComSiteName') {
    // 		this.addressSiteNameHeader = 'Edit Bill To Company Details';
    // 		this.isEditModeBilling = true;
    // 		this.tempbillToAddress = getObjectById('legalEntityBillingAddressId', data.billToSiteId, this.companySiteList_Billing);
    // 		if (data.billToSiteId != null  && data.billToSiteId != 0) {				
    // 			this.companyService.getBillingAddress(data.billToSiteId).subscribe(res => {
    // 				const resp = res;
    // 				const tempBillToAdd:any = {};				
    // 				tempBillToAdd.addressId = resp[0].addressId;
    // 				tempBillToAdd.address1 = res[0].address1;
    // 				tempBillToAdd.address2 = res[0].address2;						
    // 				tempBillToAdd.city = resp[0].city;
    // 				tempBillToAdd.stateOrProvince = resp[0].stateOrProvince;
    // 				tempBillToAdd.postalCode = resp[0].postalCode;
    // 				tempBillToAdd.countryId = resp[0].countryId;
    // 				this.addressFormForBilling = { ...tempBillToAdd, siteName: this.tempbillToAddress.siteName, legalEntityBillingAddressId: this.tempbillToAddress.legalEntityBillingAddressId };
    // 				if (typeof this.addressFormForBilling.country == 'number') {
    // 					this.addressFormForBilling = { ...this.addressFormForBilling, country: getObjectByValue('value', this.addressFormForBilling.country, this.allCountriesList) };
    // 				} else {
    // 					this.addressFormForBilling = { ...this.addressFormForBilling, countryId: getObjectByValue('value', this.addressFormForBilling.countryId, this.allCountriesList) };
    // 				}
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		} else {
    // 			this.addressFormForBilling = { ...this.tempbillToAddress, siteName: this.tempbillToAddress.siteName, legalEntityBillingAddressId: this.tempbillToAddress.legalEntityBillingAddressId };
    // 			if (typeof this.addressFormForBilling.country == 'number') {
    // 				this.addressFormForBilling = { ...this.addressFormForBilling, country: getObjectByValue('value', this.addressFormForBilling.country, this.allCountriesList) };
    // 			} else {
    // 				this.addressFormForBilling = { ...this.addressFormForBilling, countryId: getObjectByValue('value', this.addressFormForBilling.countryId, this.allCountriesList) };
    // 			}
    // 		}
    // 	}
    // }
    // private loadManagementdata() {
    // 	this.commonService.getLegalEntityList().subscribe(res => {
    //         this.maincompanylist = res;
    //     },err => {
    // 		this.isSpinnerVisible = false;
    // 		const errorLog = err;
    // 		this.errorMessageHandler(errorLog);		
    // 	});
    // }
    PurchaseSetupComponent.prototype.getFXRate = function (partList, onChange) {
        if ((partList.reportCurrencyId != null || partList.reportCurrencyId != undefined) && (partList.functionalCurrencyId != null || partList.functionalCurrencyId != undefined)) {
            var funcCurrency = autocomplete_1.editValueAssignByCondition('value', partList.functionalCurrencyId);
            var reportCurrency = autocomplete_1.editValueAssignByCondition('value', partList.reportCurrencyId);
            if (funcCurrency == reportCurrency) {
                partList.foreignExchangeRate = '1.00000';
                if (onChange == 'onChange') {
                    this.alertService.showMessage('Error', "FXRate can't be greater than 1, if Func CUR and Report CUR are same", alert_service_1.MessageSeverity.error);
                }
                return;
            }
            if (partList.foreignExchangeRate) {
                partList.foreignExchangeRate = autocomplete_1.formatNumberAsGlobalSettingsModule(partList.foreignExchangeRate, 5);
            }
        }
    };
    PurchaseSetupComponent.prototype.loadConditionData = function () {
        var _this = this;
        this.commonService.smartDropDownList('Condition', 'ConditionId', 'Description').subscribe(function (response) {
            _this.allconditioninfo = response;
            _this.allconditioninfo.map(function (x) {
                if (x.label == 'New') {
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
        });
    };
    PurchaseSetupComponent.prototype.loadPOApproverStatus = function () {
        var _this = this;
        this.commonService.smartDropDownList('ApprovalStatus', 'ApprovalStatusId', 'Name').subscribe(function (response) {
            _this.poApproverStatusList = response;
            _this.poApproverStatusList = _this.poApproverStatusList.sort(function (a, b) { return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0); });
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
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
            partList.childList = [];
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
        if (this.vendorService.isEditMode == false) {
            var newParentObject = new create_po_partslist_model_1.CreatePOPartsList();
            newParentObject = __assign(__assign({}, newParentObject), { needByDate: this.headerInfo.needByDate, priorityId: this.headerInfo.priorityId ? autocomplete_1.editValueAssignByCondition('value', this.headerInfo.priorityId) : null, conditionId: this.defaultCondtionId, discountPercent: 0 });
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
        }
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
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
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
        this.commonService.smartDropDownList('Currency', 'CurrencyId', 'Code').subscribe(function (res) {
            _this.allCurrencyData = res;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.clearInputShipTo = function () {
        this.sourcePoApproval.shipToUserId = 0;
        this.sourcePoApproval.shipToAddressId = 0;
        this.sourcePoApproval.shipToContactId = 0;
        this.sourcePoApproval.shipToMemo = '';
        this.sourcePoApproval.shipViaId = 0;
        this.sourcePoApproval.shippingCost = 0;
        this.sourcePoApproval.handlingCost = 0;
        this.sourcePoApproval.shippingAcctNum = null;
        this.shipToAddress = {};
        this.shipViaList = [];
        this.shipToCusData = [];
        this.vendorSelected = [];
        this.companySiteList_Shipping = [];
    };
    PurchaseSetupComponent.prototype.clearInputBillTo = function () {
        this.sourcePoApproval.billToUserId = 0;
        this.sourcePoApproval.billToAddressId = 0;
        this.sourcePoApproval.billToContactId = 0;
        this.billToAddress = {};
        this.sourcePoApproval.billToMemo = '';
        this.billToCusData = [];
        this.vendorSelectedForBillTo = [];
        this.companySiteList_Billing = [];
    };
    PurchaseSetupComponent.prototype.clearShipToContact = function () {
        this.sourcePoApproval.shipToContactId = null;
    };
    PurchaseSetupComponent.prototype.clearBillToContact = function () {
        this.sourcePoApproval.billToContactId = null;
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
        this.vendorContactList = [];
        this.getVendorContactsListByID(value.vendorId);
        this.getVendorCreditTermsByID(value.vendorId);
        //this.getVendorCapesByID(value.vendorId);
        this.headerInfo.vendorName = value.vendorName;
        this.headerInfo.vendorId = autocomplete_1.getObjectById('vendorId', value.vendorId, this.allActions);
        this.headerInfo.vendorCode = autocomplete_1.getObjectById('vendorId', value.vendorId, this.allActions);
        this.warningsandRestriction(value.vendorId);
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
        // this.allWorkOrderDetails = this.allWorkOrderInfo;
        // if (event.query !== undefined && event.query !== null) {
        // 	const wo = [...this.allWorkOrderInfo.filter(x => {
        // 		return x.label.toLowerCase().includes(event.query.toLowerCase())
        // 	})]
        // 	this.allWorkOrderDetails = wo;
        // }
        if (event.query !== undefined && event.query !== null) {
            this.loadWorkOrderList(event.query);
        }
    };
    PurchaseSetupComponent.prototype.filtersubWorkOrderList = function (event) {
        // this.allWorkOrderDetails = this.allWorkOrderInfo;
        // if (event.query !== undefined && event.query !== null) {
        // 	const wo = [...this.allWorkOrderInfo.filter(x => {
        // 		return x.label.toLowerCase().includes(event.query.toLowerCase())
        // 	})]
        // 	this.allWorkOrderDetails = wo;
        // }
        if (event.query !== undefined && event.query !== null) {
            this.loadSubWorkOrderList(event.query);
        }
    };
    PurchaseSetupComponent.prototype.filterRepairOrderList = function (event) {
        // this.allRepairOrderDetails = this.allRepairOrderInfo;
        // if (event.query !== undefined && event.query !== null) {
        // 	const ro = [...this.allRepairOrderInfo.filter(x => {
        // 		return x.label.toLowerCase().includes(event.query.toLowerCase())
        // 	})]
        // 	this.allRepairOrderDetails = ro;
        // }
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
                { percentId: 0, percentValue: 'Select' }
            ];
            _this.allPercentData = __spreadArrays(_this.allPercentData, data);
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.loadVendorList = function (filterVal) {
        var _this = this;
        if (filterVal === void 0) { filterVal = ''; }
        if (this.arrayVendlsit.length == 0) {
            this.arrayVendlsit.push(0);
        }
        this.vendorService.getVendorNameCodeListwithFilter(filterVal, 20, this.arrayVendlsit.join()).subscribe(function (res) {
            _this.allActions = res;
            _this.vendorNames = res;
            _this.vendorCodes = res;
            _this.splitVendorNames = res;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    PurchaseSetupComponent.prototype.filterVendorCodes = function (event) {
        // this.vendorCodes = this.allActions;
        // if (event.query !== undefined && event.query !== null) {
        // 	const vendorCodesTemp = [...this.allActions.filter(x => {
        // 		return x.vendorCode.toLowerCase().includes(event.query.toLowerCase())
        // 	})]
        // 	this.vendorCodes = vendorCodesTemp;
        // 	if (event.query !== undefined && event.query !== null) {
        // 		this.employeedata(event.query);
        // 		}
        // }
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
        // this.vendorNames = this.allActions;
        // if (event.query !== undefined && event.query !== null) {
        // 	const vendorFilter = [...this.allActions.filter(x => {
        // 		return x.vendorName.toLowerCase().includes(event.query.toLowerCase())
        // 	})]
        // 	this.vendorNames = vendorFilter;
        // }
        if (event.query !== undefined && event.query !== null) {
            this.loadVendorList(event.query);
        }
    };
    /*
   filterApprover(event) {
       this.approverList = this.allEmployeeList;

       if (event.query !== undefined && event.query !== null) {
           const empFirstName = [...this.allEmployeeList.filter(x => {
               return x.label;
           })]
           this.approverList = empFirstName;
       }
   }	*/
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
    // onClickShipSiteName(value, data?) {			
    // 	this.resetAddressShippingForm();
    // 	if (value === 'AddCusSiteName') {
    // 		this.addressSiteNameHeader = 'Add Ship To Customer Details';
    // 	}
    // 	if (value === 'EditCusSiteName') {
    // 		this.addressSiteNameHeader = 'Edit Ship To Customer Details';
    // 		this.isEditModeShipping = true;
    // 		this.tempshipToAddress = getObjectById('customerShippingAddressId', data.shipToSiteId, this.shipToCusData);
    // 		if (typeof this.tempshipToAddress.country == 'number') {
    // 			this.addressFormForShipping = { ...this.tempshipToAddress, country: getObjectByValue('value', this.tempshipToAddress.country, this.allCountriesList) };
    // 		} else {
    // 			this.addressFormForShipping = { ...this.tempshipToAddress, countryId: getObjectByValue('value', this.tempshipToAddress.countryId, this.allCountriesList) };
    // 		}
    // 	}
    // 	if (value === 'AddVenSiteName') {
    // 		this.addressSiteNameHeader = 'Add Ship To Vendor Details';
    // 	}
    // 	if (value === 'EditVenSiteName') {
    // 		this.addressSiteNameHeader = 'Edit Ship To Vendor Details';
    // 		this.isEditModeShipping = true;
    // 		this.tempshipToAddress = getObjectById('vendorShippingAddressId', data.shipToSiteId, this.vendorSelected);
    // 		if (typeof this.tempshipToAddress.country == 'number') {
    // 			this.addressFormForShipping = { ...this.tempshipToAddress, country: getObjectByValue('value', this.tempshipToAddress.country, this.allCountriesList) };
    // 		} else {
    // 			this.addressFormForShipping = { ...this.tempshipToAddress, countryId: getObjectByValue('value', this.tempshipToAddress.countryId, this.allCountriesList) };
    // 		}		
    // 	}
    // 	if (value === 'AddComSiteName') {
    // 		this.addressSiteNameHeader = 'Add Ship To Company Details';
    // 	}
    // 	if (value === 'EditComSiteName') {		
    // 		this.addressSiteNameHeader = 'Edit Ship To Company Details';
    // 		this.isEditModeShipping = true;
    // 		this.tempshipToAddress = getObjectById('legalEntityShippingAddressId', data.shipToSiteId, this.companySiteList_Shipping);
    // 		if (data.shipToSiteId != null && data.shipToSiteId != 0) {
    // 			this.companyService.getShippingAddress(data.shipToSiteId).subscribe(res => {
    // 				const resp = res;
    // 				const tempShipToAdd:any = {};
    // 				tempShipToAdd.addressId =  resp.addressId;
    // 				tempShipToAdd.address1 = resp.line1;
    // 				tempShipToAdd.address2 = resp.line2;					
    // 				tempShipToAdd.city = resp.city;
    // 				tempShipToAdd.stateOrProvince = resp.stateOrProvince;
    // 				tempShipToAdd.postalCode = resp.postalCode;
    // 				tempShipToAdd.countryId = resp.countryId;		
    // 				this.addressFormForShipping = { ...tempShipToAdd, siteName: this.tempshipToAddress.siteName, legalEntityShippingAddressId: this.tempshipToAddress.legalEntityShippingAddressId };
    // 				if (typeof this.addressFormForShipping.country == 'number') {
    // 					this.addressFormForShipping = { ...this.addressFormForShipping, country: getObjectByValue('value', this.addressFormForShipping.country, this.allCountriesList) };
    // 				} else {
    // 					this.addressFormForShipping = { ...this.addressFormForShipping, countryId: getObjectByValue('value', this.addressFormForShipping.countryId, this.allCountriesList) };
    // 				}
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		} else {
    // 			this.addressFormForShipping = { ...this.tempshipToAddress, siteName: this.tempshipToAddress.siteName, legalEntityShippingAddressId: this.tempshipToAddress.legalEntityShippingAddressId };
    // 			if (typeof this.addressFormForShipping.country == 'number') {
    // 				this.addressFormForShipping = { ...this.addressFormForShipping, country: getObjectByValue('value', this.addressFormForShipping.country, this.allCountriesList) };
    // 			} else {
    // 				this.addressFormForShipping = { ...this.addressFormForShipping, countryId: getObjectByValue('value', this.addressFormForShipping.countryId, this.allCountriesList) };
    // 			}
    // 		}
    // 	}
    // }
    // async saveShippingAddress() {
    // 	const data = {
    // 		...this.addressFormForShipping,
    // 		createdBy: this.userName,
    // 		updatedBy: this.userName,
    // 		masterCompanyId: this.currentUserMasterCompanyId,
    // 		isActive: true,
    // 	}
    // 	if (this.sourcePoApproval.shipToUserTypeId == this.customerModuleId) {
    // 		const customerData = { ...data, isPrimary: true, customerId: getValueFromObjectByKey('value', this.sourcePoApproval.shipToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
    // 		if (!this.isEditModeShipping) {
    // 			await this.customerService.newShippingAdd(customerData).subscribe(response => {
    //                 this.onShipToCustomerSelected(customerData.customerId, this.sourcePoApproval, response.customerShippingAddressId );
    // 				this.enableAddSaveBtn = true;					
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Saved Shipping Information Successfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		} else {
    // 			await this.customerService.newShippingAdd(customerData).subscribe(response => {
    //                 this.onShipToCustomerSelected(customerData.customerId, this.sourcePoApproval, response.customerShippingAddressId );
    // 				this.enableAddSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Updated Shipping Information Successfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		}
    // 	}
    // 	if (this.sourcePoApproval.shipToUserTypeId == this.vendorModuleId) {
    // 		const vendorData = { ...data, vendorId: getValueFromObjectByKey('vendorId', this.sourcePoApproval.shipToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
    // 		if (!this.isEditModeShipping) {
    // 			await this.vendorService.newShippingAdd(vendorData).subscribe(response => {
    // 				this.onShipToVendorSelected(vendorData.vendorId, this.sourcePoApproval, response.vendorShippingAddressId);
    // 				this.enableAddSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Saved Shipping Information Successfully `,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		} else {
    // 			await this.vendorService.newShippingAdd(vendorData).subscribe(response => {
    // 				this.onShipToVendorSelected(vendorData.vendorId, this.sourcePoApproval, response.vendorShippingAddressId);
    // 				this.enableAddSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Updated Shipping Information Successfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		}
    // 	}
    // 	if (this.sourcePoApproval.shipToUserTypeId == this.companyModuleId) {
    // 		const companyData = { ...data, legalentityId: getValueFromObjectByKey('value', this.sourcePoApproval.shipToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
    // 		if (!this.isEditModeShipping) {
    // 			await this.companyService.addNewShippingAddress(companyData).subscribe(response => {
    // 				this.onShipToCompanySelected(null, this.sourcePoApproval, response.legalEntityShippingAddressId);
    // 				this.enableAddSaveBtn = true;				
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Saved Shipping Information Successfully `,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		} else {				
    // 			await this.companyService.addNewShippingAddress(companyData).subscribe(response => {
    // 				this.onShipToCompanySelected(null, this.sourcePoApproval, response.legalEntityShippingAddressId);
    // 				this.enableAddSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Updated Shipping Information Successfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		}
    // 	}
    // }
    // saveShippingAddressToPO() {
    // 	if (this.sourcePoApproval.shipToUserTypeId == this.customerModuleId) {
    // 		for (let i = 0; i < this.shipToCusData.length; i++) {
    // 			if (this.shipToCusData[i].customerShippingAddressId == 0) {
    // 				this.shipToCusData.splice(i, 1);;
    // 			}
    // 		}
    // 		const addressInfo = {
    // 			...this.addressFormForShipping,
    // 			country: getValueFromObjectByKey('label', this.addressFormForShipping.countryId),
    // 			countryId: getValueFromObjectByKey('value', this.addressFormForShipping.countryId),
    // 			customerShippingAddressId: 0
    // 		}
    // 		this.shipToCusData.push(addressInfo);
    // 		this.shipToCusData.map(x => {
    // 			if (x.customerShippingAddressId == 0) {
    // 				this.sourcePoApproval.shipToAddressId = x.customerShippingAddressId;
    // 			}
    // 		});
    // 		this.onShipToGetAddress(this.sourcePoApproval, this.sourcePoApproval.shipToAddressId);
    // 	}
    // 	if (this.sourcePoApproval.shipToUserTypeId == this.vendorModuleId) {
    // 		for (let i = 0; i < this.vendorSelected.length; i++) {
    // 			if (this.vendorSelected[i].vendorShippingAddressId == 0) {
    // 				this.vendorSelected.splice(i, 1);;
    // 			}
    // 		}
    // 		const addressInfo = {
    // 			...this.addressFormForShipping,
    // 			country: getValueFromObjectByKey('label', this.addressFormForShipping.countryId),
    // 			countryId: getValueFromObjectByKey('value', this.addressFormForShipping.countryId),
    // 			vendorShippingAddressId: 0
    // 		}
    // 		this.vendorSelected.push(addressInfo);
    // 		this.vendorSelected.map(x => {
    // 			if (x.vendorShippingAddressId == 0) {
    // 				this.sourcePoApproval.shipToAddressId = x.vendorShippingAddressId;
    // 			}
    // 		});
    // 		this.onShipToGetAddress(this.sourcePoApproval, this.sourcePoApproval.shipToAddressId);
    // 	}
    // 	if (this.sourcePoApproval.shipToUserTypeId == this.companyModuleId) {
    // 		for (let i = 0; i < this.companySiteList_Shipping.length; i++) {
    // 			if (this.companySiteList_Shipping[i].legalEntityShippingAddressId == 0) {
    // 				this.companySiteList_Shipping.splice(i, 1);;
    // 			}
    // 		}
    // 		const addressInfo = {
    // 			...this.addressFormForShipping,
    // 			country: getValueFromObjectByKey('label', this.addressFormForShipping.countryId),
    // 			countryId: getValueFromObjectByKey('value', this.addressFormForShipping.countryId),
    // 			legalEntityShippingAddressId: 0
    // 		}
    // 		this.companySiteList_Shipping.push(addressInfo);
    // 		this.companySiteList_Shipping.map(x => {
    // 			if (x.legalEntityShippingAddressId == 0) {
    // 				this.sourcePoApproval.shipToAddressId = x.legalEntityShippingAddressId;
    // 			}
    // 		});
    // 		this.shipToAddress = addressInfo;			
    // 	}
    // 	this.enableAddSaveBtn = true;
    // 	if (!this.isEditModeShipping) {
    // 		this.alertService.showMessage(
    // 			'Success',
    // 			`Saved Shipping Information Successfully`,
    // 			MessageSeverity.success
    // 		);
    // 	} else {
    // 		this.alertService.showMessage(
    // 			'Success',
    // 			`Updated Shipping Information Successfully`,
    // 			MessageSeverity.success
    // 		);
    // 	}
    // }
    // async saveBillingAddress() {
    // 	const data = {
    // 		...this.addressFormForBilling,
    // 		createdBy: this.userName,
    // 		updatedBy: this.userName,
    // 		masterCompanyId: this.currentUserMasterCompanyId,
    // 		isActive: true,
    // 		isPrimary: true
    // 	}
    // 	if (this.sourcePoApproval.billToUserTypeId == this.customerModuleId) {
    // 		const customerData = { ...data, customerId: getValueFromObjectByKey('value', this.sourcePoApproval.billToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
    // 		if (!this.isEditModeBilling) {
    // 			await this.customerService.newBillingAdd(customerData).subscribe(response => {
    // 				this.onBillToCustomerSelected(customerData.customerId, this.sourcePoApproval, response.customerBillingAddressId);
    // 				this.enableAddSaveBtn = true;					
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Saved  Billing Information Sucessfully `,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		} else {
    // 			await this.customerService.newBillingAdd(customerData).subscribe(response => {
    // 				this.onBillToCustomerSelected(customerData.customerId, this.sourcePoApproval, response.customerBillingAddressId);
    // 				this.enableAddSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Updated Billing Information Successfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		}
    // 	}
    // 	if (this.sourcePoApproval.billToUserTypeId == this.vendorModuleId ) {
    // 		const vendorData = { ...data, vendorId: getValueFromObjectByKey('vendorId', this.sourcePoApproval.billToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
    // 		if (!this.isEditModeBilling) {
    // 			await this.vendorService.addNewBillingAddress(vendorData).subscribe(response => {
    // 				this.onBillToVendorSelected(vendorData.vendorId, this.sourcePoApproval, response.vendorBillingAddressId);
    // 				this.enableAddSaveBtn = true;					
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Saved  Billing Information Sucessfully `,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		} else {
    // 			await this.vendorService.addNewBillingAddress(vendorData).subscribe(response => {
    // 				this.onBillToVendorSelected(vendorData.vendorId, this.sourcePoApproval, response.vendorBillingAddressId);
    // 				this.enableAddSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Updated Billing Information Successfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		}
    // 	}
    // 	if (this.sourcePoApproval.billToUserTypeId == this.companyModuleId) {
    // 		const companyData = { ...data, legalentityId: getValueFromObjectByKey('value', this.sourcePoApproval.billToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
    // 		if (!this.isEditModeBilling) {
    // 			await this.companyService.addNewBillingAddress(companyData).subscribe(response => {
    // 				this.onBillToCompanySelected(null, this.sourcePoApproval, response.legalEntityBillingAddressId);
    // 				this.enableAddSaveBtn = true;
    // 				// this.addressFormForBilling = new CustomerShippingModel()
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Saved  Billing Information Sucessfully `,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		} else {
    // 			await this.companyService.addNewBillingAddress(companyData).subscribe(response => {
    // 				this.onBillToCompanySelected(null, this.sourcePoApproval, response.legalEntityBillingAddressId);
    // 				this.enableAddSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Updated Billing Information Successfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		}
    // 	}	
    // }
    // saveBillingAddressToPO() {
    // 	if (this.sourcePoApproval.billToUserTypeId == this.customerModuleId) {
    // 		for (let i = 0; i < this.billToCusData.length; i++) {
    // 			if (this.billToCusData[i].customerBillingAddressId == 0) {
    // 				this.billToCusData.splice(i, 1);;
    // 			}
    // 		}
    // 		const addressInfo = {
    // 			...this.addressFormForBilling,
    // 			country: getValueFromObjectByKey('label', this.addressFormForBilling.countryId),
    // 			countryId: getValueFromObjectByKey('value', this.addressFormForBilling.countryId),
    // 			customerBillingAddressId: 0
    // 		}
    // 		this.billToCusData.push(addressInfo);
    // 		this.billToCusData.map(x => {
    // 			if (x.customerBillingAddressId == 0) {
    // 				this.sourcePoApproval.billToAddressId = x.customerBillingAddressId;
    // 			}
    // 		});
    // 		this.onBillToGetAddress(this.sourcePoApproval, this.sourcePoApproval.billToAddressId);
    // 	}
    // 	if (this.sourcePoApproval.billToUserTypeId == this.vendorModuleId) {
    // 		for (let i = 0; i < this.vendorSelectedForBillTo.length; i++) {
    // 			if (this.vendorSelectedForBillTo[i].vendorBillingAddressId == 0) {
    // 				this.vendorSelectedForBillTo.splice(i, 1);;
    // 			}
    // 		}
    // 		const addressInfo = {
    // 			...this.addressFormForBilling,
    // 			country: getValueFromObjectByKey('label', this.addressFormForBilling.countryId),
    // 			countryId: getValueFromObjectByKey('value', this.addressFormForBilling.countryId),
    // 			vendorBillingAddressId: 0
    // 		}
    // 		this.vendorSelectedForBillTo.push(addressInfo);
    // 		this.vendorSelectedForBillTo.map(x => {
    // 			if (x.vendorBillingAddressId == 0) {
    // 				this.sourcePoApproval.billToAddressId = x.vendorBillingAddressId;
    // 			}
    // 		});			
    // 		this.onBillToGetAddress(this.sourcePoApproval, this.sourcePoApproval.billToAddressId);
    // 	}
    // 	if (this.sourcePoApproval.billToUserTypeId == this.customerModuleId) {
    // 		for (let i = 0; i < this.companySiteList_Billing.length; i++) {
    // 			if (this.companySiteList_Billing[i].legalEntityBillingAddressId == 0) {
    // 				this.companySiteList_Billing.splice(i, 1);;
    // 			}
    // 		}
    // 		const addressInfo = {
    // 			...this.addressFormForBilling,
    // 			country: getValueFromObjectByKey('label', this.addressFormForBilling.countryId),
    // 			countryId: getValueFromObjectByKey('value', this.addressFormForBilling.countryId),
    // 			legalEntityBillingAddressId: 0
    // 		}
    // 		this.companySiteList_Billing.push(addressInfo);
    // 		this.companySiteList_Billing.map(x => {
    // 			if (x.legalEntityBillingAddressId == 0) {
    // 				this.sourcePoApproval.billToAddressId = x.legalEntityBillingAddressId;
    // 			}
    // 		});
    // 		this.billToAddress = addressInfo;						
    // 	}
    // 	this.enableAddSaveBtn = true;
    // 	if (!this.isEditModeBilling) {
    // 		this.alertService.showMessage(
    // 			'Success',
    // 			`Saved Billing Information Successfully`,
    // 			MessageSeverity.success
    // 		);
    // 	} else {
    // 		this.alertService.showMessage(
    // 			'Success',
    // 			`Updated Billing Information Successfully`,
    // 			MessageSeverity.success
    // 		);
    // 	}
    // }
    // resetAddressShipViaForm() {
    // 	this.addShipViaFormForShipping = new CustomerInternationalShipVia();
    // 	this.isEditModeShipVia = false;
    // }
    // async saveShipViaForShipTo() {
    // 	this.sourcePoApproval.shipViaId = 0;
    // 	this.sourcePoApproval.shippingAcctNum = '';		
    // 	const data = {
    // 		...this.addShipViaFormForShipping,			
    // 		name: getValueFromArrayOfObjectById('label', 'value', this.addShipViaFormForShipping.shipViaId, this.allShipViaInfo),
    // 		createdBy: this.userName,
    // 		updatedBy: this.userName,
    // 		masterCompanyId: this.currentUserMasterCompanyId,
    // 		isActive: true,
    // 		UserType: parseInt(this.sourcePoApproval.shipToUserTypeId)
    // 	}
    // 	if (this.sourcePoApproval.shipToUserTypeId == this.customerModuleId) {
    // 		const customerData = { ...data, 
    // 			ReferenceId: getValueFromObjectByKey('value', this.sourcePoApproval.shipToUserId),
    // 			 AddressId: this.sourcePoApproval.shipToSiteId ? this.sourcePoApproval.shipToSiteId : 0 }
    // 		if (!this.isEditModeShipVia) {
    // 			await this.commonService.createShipVia(customerData).subscribe(response => {
    // 				this.getShipViaDetailsForShipTo(response.shipViaId);
    // 				this.enableAddSaveBtn = true;					
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Saved Ship Via Information Sucessfully `,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		} else {
    // 			await this.commonService.createShipVia(customerData).subscribe(response => {
    // 				this.getShipViaDetailsForShipTo(response.shipViaId);
    // 				this.enableAddSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Updated Ship Via Information Sucessfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			})
    // 		}
    // 	}
    // 	if (this.sourcePoApproval.shipToUserTypeId == this.vendorModuleId) {
    // 		const vendorData = { ...data, ReferenceId: getValueFromObjectByKey('vendorId', this.sourcePoApproval.shipToUserId), 
    // 		AddressId: this.sourcePoApproval.shipToSiteId ? this.sourcePoApproval.shipToSiteId : 0 }
    // 		if (!this.isEditModeShipVia) {
    // 			await this.commonService.createShipVia(vendorData).subscribe(response => {
    // 				this.getShipViaDetailsForShipTo(response.shipViaId);
    // 				this.enableAddSaveBtn = true;
    // 				// this.addressFormForShipping = new CustomerShippingModel()
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Saved  Ship Via Information Sucessfully `,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		} else {
    // 			await this.commonService.createShipVia(vendorData).subscribe(response => {
    // 				this.getShipViaDetailsForShipTo(response.shipViaId);
    // 				this.enableAddSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Updated Ship Via Information Sucessfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		}
    // 	}
    // 	if (this.sourcePoApproval.shipToUserTypeId == this.companyModuleId) {
    // 		const companyData = { ...data, ReferenceId: getValueFromObjectByKey('value', this.sourcePoApproval.shipToUserId),
    // 					 AddressId: this.sourcePoApproval.shipToSiteId ? this.sourcePoApproval.shipToSiteId : 0 }
    // 		if (!this.isEditModeShipVia) {
    // 			await this.commonService.createShipVia(companyData).subscribe(response => {
    // 				this.getShipViaDetailsForShipTo(response.shipViaId);
    // 				this.enableAddSaveBtn = true;					
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Saved  Ship Via Information Sucessfully `,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		} else {
    // 			await this.commonService.createShipVia(companyData).subscribe(response => {
    // 				this.getShipViaDetailsForShipTo(response.shipViaId);
    // 				this.enableAddSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Updated Ship Via Information Sucessfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		}
    // 	}
    // 	$('#shipToShipVia').modal('hide');
    // }
    PurchaseSetupComponent.prototype.splitAddChange = function () {
        this.splitAddbutton = true;
    };
    PurchaseSetupComponent.prototype.resetAddressForm = function () {
        this.addNewAddress = new customer_shipping_model_1.CustomerShippingModel();
        this.isEditModeSplitAddress = false;
        this.isEditModeSplitPoOnly = false;
    };
    // async saveSplitAddress() {
    // 	const data = {
    // 		...this.addNewAddress,
    // 		siteName: this.addNewAddress.siteName,
    // 		address1: this.addNewAddress.line1,
    // 		address2: this.addNewAddress.line2,			
    // 		createdBy: this.userName,
    // 		updatedBy: this.userName,
    // 		masterCompanyId: this.currentUserMasterCompanyId,
    // 		isActive: true,			
    // 	}
    // 	if (this.tempSplitPart.partListUserTypeId == this.customerModuleId) {
    // 		const customerData = { ...data, isPrimary: true, customerId: getValueFromObjectByKey('value', this.tempSplitPart.partListUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
    // 		if (!this.isEditModeSplitAddress) {
    // 			await this.customerService.newShippingAdd(customerData).subscribe(res => {
    // 				this.onCustomerNameChange(customerData.customerId, null, this.parentIndex, this.childIndex); //res.customerId
    // 				this.enablePartSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Saved Address Successfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		} else {
    // 			await this.customerService.newShippingAdd(customerData).subscribe(res => {
    // 				this.onCustomerNameChange(customerData.customerId, null, this.parentIndex, this.childIndex);
    // 				this.enablePartSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Updated Address Successfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		}
    // 	}
    // 	if (this.tempSplitPart.partListUserTypeId == this.vendorModuleId) {
    // 		const vendorData = { ...data, vendorId: getValueFromObjectByKey('vendorId', this.tempSplitPart.partListUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
    // 		if (!this.isEditModeSplitAddress) {
    // 			await this.vendorService.newShippingAdd(vendorData).subscribe(res => {
    // 				this.onVendorNameChange(vendorData.vendorId, null, this.parentIndex, this.childIndex);
    // 				this.enablePartSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Saved Address Successfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		} else {
    // 			await this.vendorService.newShippingAdd(vendorData).subscribe(res => {
    // 				this.onVendorNameChange(vendorData.vendorId, null, this.parentIndex, this.childIndex);
    // 				this.enablePartSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Updated Address Successfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		}
    // 	}
    // 	if (this.tempSplitPart.partListUserTypeId == this.companyModuleId) {
    // 		const companyData = { ...data, legalentityId: getValueFromObjectByKey('value', this.tempSplitPart.partListUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
    // 		if (!this.isEditModeSplitAddress) {
    // 			await this.companyService.addNewShippingAddress(companyData).subscribe(res => {
    // 				this.onCompanyNameChange(companyData.legalentityId, null, this.parentIndex, this.childIndex); //res.legalEntityId
    // 				this.enablePartSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Saved Address Successfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		} else {
    // 			await this.companyService.addNewShippingAddress(companyData).subscribe(res => {
    // 				this.onCompanyNameChange(companyData.legalentityId, null, this.parentIndex, this.childIndex);
    // 				this.enablePartSaveBtn = true;
    // 				this.alertService.showMessage(
    // 					'Success',
    // 					`Updated Address Successfully`,
    // 					MessageSeverity.success
    // 				);
    // 			},err => {
    // 				this.isSpinnerVisible = false;
    // 				const errorLog = err;
    // 				this.errorMessageHandler(errorLog);		
    // 			});
    // 		}
    // 	}
    // }
    // saveSplitAddressToPO() {
    // 	for (let i = 0; i < this.tempSplitAddressData.length; i++) {
    // 		if (this.tempSplitAddressData[i].addressId == 0) {
    // 			this.tempSplitAddressData.splice(i, 1);;
    // 		}
    // 	}
    // 	const addressInfo = {
    // 		...this.addNewAddress,
    // 		country: getValueFromObjectByKey('label', this.addNewAddress.countryId),
    // 		countryName: getValueFromObjectByKey('label', this.addNewAddress.countryId),
    // 		countryId: getValueFromObjectByKey('value', this.addNewAddress.countryId),
    // 		addressId: 0,
    // 		address1: this.addNewAddress.line1,
    // 		address2: this.addNewAddress.line2,			
    // 	}
    // 	this.tempSplitAddressData.push(addressInfo);
    // 	this.tempSplitAddressData.map(x => {
    // 		if (x.addressId == 0) {
    // 			this.tempSplitPart.partListAddressId = x.addressId;			
    // 		}
    // 	});
    // 	this["splitAddressData" + this.parentIndex + this.childIndex] = this.tempSplitAddressData;
    // 	this.enablePartSaveBtn = true;
    // 	if (!this.isEditModeSplitAddress) {
    // 		this.alertService.showMessage(
    // 			'Success',
    // 			`Saved Address Successfully`,
    // 			MessageSeverity.success
    // 		);
    // 	} else {
    // 		this.alertService.showMessage(
    // 			'Success',
    // 			`Updated Address Successfully`,
    // 			MessageSeverity.success
    // 		);
    // 	}		
    // }
    PurchaseSetupComponent.prototype.onEditShipVia = function (data) {
        this.tempshipVia = autocomplete_1.getObjectById('shipViaId', data.shipViaId, this.shipViaList);
        this.addShipViaFormForShipping = __assign(__assign({}, this.tempshipVia), { shipVia: this.tempshipVia.name });
        this.isEditModeShipVia = true;
    };
    // saveShipToShipViaDetailsToPO() {	
    // 	for (let i = 0; i < this.shipViaList.length; i++) {
    // 		if (this.shipViaList[i].shipViaId == 0) {
    // 			this.shipViaList.splice(i, 1);;
    // 		}
    // 	}
    // 	const shipViaInfo = {
    // 		...this.addShipViaFormForShipping,
    // 		shipViaId: 0,
    // 		name: getValueFromArrayOfObjectById('label', 'value', this.addShipViaFormForShipping.shipViaId, this.allShipViaInfo)	
    // 	}
    // 	this.shipViaList.push(shipViaInfo);
    // 	this.shipViaList.map(x => {
    // 		if (x.shipViaId == 0) {
    // 			this.sourcePoApproval.shipViaId = x.shipViaId;
    // 		}
    // 	});
    // 	if(this.sourcePoApproval.shipViaId != 0) {
    // 		this.sourcePoApproval.shipViaId = this.addShipViaFormForShipping.shipViaId;
    // 	}
    // 	this.sourcePoApproval.shippingAcctNum = this.addShipViaFormForShipping.shippingAccountInfo;		
    // 	this.enableAddSaveBtn = true;
    // 	if (!this.isEditModeShipVia) {
    // 		this.alertService.showMessage(
    // 			'Success',
    // 			`Saved ShipVia Successfully`,
    // 			MessageSeverity.success
    // 		);
    // 	} else {
    // 		this.alertService.showMessage(
    // 			'Success',
    // 			`Updated ShipVia Successfully`,
    // 			MessageSeverity.success
    // 		);
    // 	}
    // }
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
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
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
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
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
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
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
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
            });
        }
    };
    PurchaseSetupComponent.prototype.onChangeParentQtyOrdered = function (event, partList) {
        this.parentQty = event.target.value;
        if (partList.childList.length > 0) {
            this.onChangeChildQtyOrdered(partList);
        }
    };
    PurchaseSetupComponent.prototype.onChangeChildQtyOrdered = function (partList, partChildList) {
        this.childOrderQtyArray = [];
        this.childOrderQtyTotal = null;
        this.parentQty = partList.quantityOrdered ? parseFloat(partList.quantityOrdered.toString().replace(/\,/g, '')) : 0;
        for (var i = 0; i < partList.childList.length; i++) {
            if (partList.childList[i].quantityOrdered === null || partList.childList[i].quantityOrdered === undefined) {
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
            var data = __assign(__assign({}, res), { createdBy: _this.userName, updatedBy: _this.userName, masterCompanyId: _this.currentUserMasterCompanyId, vendorId: autocomplete_1.editValueAssignByCondition('vendorId', _this.headerInfo.vendorId) });
            _this.vendorService.newAddvendorContact(data).subscribe(function (data) {
                _this.getVendorContactsListByID(vendorContactInfo.vendorId);
                _this.alertService.showMessage('Success', "Saved Vendor Contact Successfully", alert_service_1.MessageSeverity.success);
            }, function (err) {
                _this.isSpinnerVisible = false;
                var errorLog = err;
                _this.errorMessageHandler(errorLog);
            });
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
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
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
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
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
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
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
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
            return __assign(__assign({}, x), { legalEntityId: _this.currentUserLegalEntityId, internalEmails: _this.apporoverEmailList, approvers: _this.apporoverNamesList.join(), approvedById: x.actionId == _this.SubmitInternalApprovalID ? parseInt(_this.employeeId.toString()) : null, createdBy: _this.userName, updatedBy: _this.userName });
        });
        this.approvalProcessList.map(function (x) {
            if (x.isSelected) {
                data.push(x);
            }
        });
        this.purchaseOrderService.savePurchaseOrderApproval(data).subscribe(function (res) {
            if (res) {
                if (res.response) {
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
                else {
                    _this.isSpinnerVisible = false;
                    _this.alertService.showMessage('Error', res.message, alert_service_1.MessageSeverity.error);
                }
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
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
    __decorate([
        core_1.ViewChild('createPOForm')
    ], PurchaseSetupComponent.prototype, "createPOForm");
    __decorate([
        core_1.ViewChild('createPOPartsForm')
    ], PurchaseSetupComponent.prototype, "createPOPartsForm");
    __decorate([
        core_1.ViewChild('createPOAddressForm')
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
