import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { CreditTermsService } from '../../../../services/Credit Terms.service';
import { VendorService } from '../../../../services/vendor.service';
import { PriorityService } from '../../../../services/priority.service';
import { ConditionService } from '../../../../services/condition.service';
import { UnitOfMeasureService } from '../../../../services/unitofmeasure.service';
import { CurrencyService } from '../../../../services/currency.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../../services/employee.service';
import { CustomerService } from '../../../../services/customer.service';
import { CreatePOPartsList, PartDetails } from '../../../../models/create-po-partslist.model';
import { NgForm } from '@angular/forms';
import * as $ from 'jquery';
import { GlAccountService } from '../../../../services/glAccount/glAccount.service';
import { getValueFromObjectByKey, getObjectByValue, getValueFromArrayOfObjectById, getObjectById, editValueAssignByCondition, formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { AuthService } from '../../../../services/auth.service';
import { CommonService } from '../../../../services/common.service';
import { CustomerShippingModel } from '../../../../models/customer-shipping.model';
import { CompanyService } from '../../../../services/company.service';
import { CustomerInternationalShipVia } from '../../../../models/customer-internationalshipping.model';
import { AddressNew } from '../../../../models/address-new-model';
import { VendorCapabilitiesService } from '../../../../services/vendorcapabilities.service';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { DatePipe } from '@angular/common';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { StocklineService } from '../../../../services/stockline.service';
import { SalesOrderReference } from '../../../../models/sales/salesOrderReference';
import { SalesOrderReferenceStorage } from '../../../sales/shared/sales-order-reference-storage';
import { StocklineReferenceStorage } from '../../../stockline/shared/stockline-reference-storage';
import { RepairOrderService } from '../../../../services/repair-order.service';

@Component({
	selector: 'app-ro-setup',
	templateUrl: './ro-setup.component.html',
	styleUrls: ['./ro-setup.component.scss'],
	providers: [DatePipe]
})

export class RoSetupComponent implements OnInit {
	firstNamesbillTo1: any;
	firstNamesShipTo1: any[];
	vendorContactsForshipTo: any[] = [];
	vendorContactsForBillTO: any[] = [];
	firstNamesShipTo: any[] = [];
	firstNamesbillTo: any[] = [];
	billToContactData: any[] = [];
	shipToContactData: any = [];	
	vendorSelectedForBillTo: any;
	shipToCusData: any[] = [];
	vendorSelected: any[] = [];
	billToCusData: any;
	allCustomers: any = [];
	customerNames: any[];
	childDataList: any[] = [];
	allCurrencyData: any[] = [];	
	allconditioninfo: any[] = [];
	itemTypeId: number;
	partWithId: any;
	allPartDetails: any[] = [];
	billToAddress: any = {};
	shipToAddress: any = {};
	tempshipToAddress: any = {};
	tempbillToAddress: any = {};
	tempshipVia: any = {};
	allActions: any[] = [];
	selectedActionName: any;
	partListData: any[] = [];
	allPriorityInfo: any = [];
	sourceRoApproval: any = {};
	sourceRoApprovalObj: any = {};
	partList: any = {};
	maincompanylist: any[] = [];
	bulist: any[] = [];
	vendorNames: any[];
	allPriorityDetails: any[];
	vendorContactsHeader: any[];
	vendorPhoneNum: any[];
	departmentList: any[] = [];
	divisionlist: any[] = [];
	ifSplitShip: boolean = false;
	allManagemtninfo: any[] = [];	
	disableSaveVenName: boolean;
	partCollection: any[];
	disableSaveVenderName: boolean;
	vendorId: any;
	loadingIndicator: boolean;
	vendorCodes: any[];
	isEditMode: boolean = false;
	allPartnumbersInfo: any = [];
	showInput: boolean = false;
	partNumbers: any;
	headerNotes:any;
	tempMemo: any;
	headerMemo: any;
	multiplePNDetails: boolean;
	addressMemoLabel: string;
	addressHeader: string;
	vendorCapesCols: any[];
	vendorCapesInfo: any[] = [];	
	needByTempDate: Date = new Date();
	currentDate: Date = new Date();
	conditionList: any[];
	functionalCurrList: any[];
	functionalTransList: any[];
	roApprovaltaskId: number = 0;
	@ViewChild('createROForm',{static:false}) createROForm: NgForm;
	@ViewChild('createROPartsForm',{static:false}) createROPartsForm: NgForm;
	@ViewChild('createROAddressForm',{static:false}) createROAddressForm: NgForm;
	repairOrderId: any;
	repairOrderPartRecordId: any;
	addAllMultiPN: boolean = false;
	childObject: any = {};
	parentObject: any = {};
	childObjectArray: any[] = [];
	childObjectArrayEdit: any = [];
	parentObjectArray: any[] = [];
	tempParentData: any;
	requisitionerList: any[];
	approverList: any[];
	approversList: any[];
	newPNList: any = [];
	newPartsList: any = [];
	splitVendorNames: any[];	
	vendorContactList: any[];
	addressSiteNameHeader: string;
	addressSiteName: any = {};
	splitUserTypeAddress: any = {};
	tempMultiplePNArray: any[];
	partNumberNames: any[];
	tempPartListData: any[];
	tempMultiplePN = {};
	parentQty: any;
	newData: any = [];
	childOrderQtyArray: any = [];
	childOrderQtyTotal: any;
	arraySearch: any = [];
	responseData: any;
	approversData: any = {};
	approver1: any = {};
	approver2: any = {};
	approver3: any = {};
	approver4: any = {};
	approver5: any = {};
	allEmployeeList: any = [];
	roApproverData: any = {};
	roApproverList: any = [];
	roApproverListEdit: any = [];
	approverIds: any = [];
	multiplePNIdArray: any = [];
	tempNewPNArray: any = [];
	newObjectForParent = new CreatePOPartsList();
	newObjectForChild = new PartDetails();
	addressFormForShipping = new CustomerShippingModel()
	addressFormForBilling = new CustomerShippingModel()
	legalEntity: any;
	legalEntityList_ForShipping: Object;
	legalEntityList_ForBilling: Object;
	addShipViaFormForShipping = new CustomerInternationalShipVia()
	shipViaList: any = [];
	companySiteList_Shipping: any;
	contactListForShippingCompany: any;
	contactListForCompanyShipping: any;
	companySiteList_Billing: any;
	contactListForCompanyBilling: any;
	contactListForBillingCompany: any;
	roId: any;
	tempShipTOAddressId: any;
	tempBillTOAddressId: any;
	shipToSelectedvalue: any;
	billToSelectedvalue: any;
	addNewAddress = new AddressNew();
	gridSelectedVendorId: any;
	gridSelectedCustomerId: any;
	legalEntityList_Forgrid: any;
	discountPercentList: any = [];
	allPercentData: any = [];
	splitcustomersList: any = [];
	splitAddressData: any = [];
	tempSplitAddressData: any = [];
	approveListEdit: any = [];
	roApproverId: number;
	vendorIdByParams: number;
	tempSplitPart: any;
	tempSplitAddress: any;
	isEditModeShipping: boolean = false;
	isEditModeBilling: boolean = false;
	isEditModeShipVia: boolean = false;
	isEditModeSplitAddress: boolean = false;
	addressFormForShippingCompany: any;
	
	parentIndex: number;
	childIndex: number;
	allCountriesList: any = [];
	countriesList: any = [];
	inputValidCheck: any;
	inputValidCheckHeader: any;
	inputValidCheckAdd: any;
	allStocklineInfo: any = [];
	allStocklineDetails: any = [];
	workOrderPartNumberId: any = 0;
	managementValidCheck: boolean;
	shipToUserTypeValidCheck: boolean;
	shipToSiteNameValidCheck: boolean;
	shipViaValidCheck: boolean;
	billToUserTypeValidCheck: boolean;
	billToSiteNameValidCheck: boolean;
	vendorCapesGeneralInfo: any = {};
    aircraftListDataValues: any;
    colsaircraftLD: any[] = [
        { field: "aircraft", header: "Aircraft" },
        { field: "model", header: "Model" },
        { field: "dashNumber", header: "Dash Numbers" },
        { field: "memo", header: "Memo" }
	];
	disableAddPart: boolean = false;
	allWorkOrderInfo: any = [];
	allSalesOrderInfo: any = [];
	allShipViaInfo: any = [];
	allWorkOrderDetails: any = [];
	allSalesOrderDetails: any = [];	
	altPartNumList: any = [];
	altPartCollection: any = [];
	toggle_ro_header: boolean = true;
	vendorContactInfo: any = {};
	venContactList: any = [];
	venContactFirstNames: any = [];
	venContactLastNames: any = [];
	venContactMiddleNames: any = [];
	isEditModeHeader: boolean = false;
	isEditModePart: boolean = false;
	isEditModeAdd: boolean = false;
	headerInfo: any = {};
	salesOrderReferenceData: SalesOrderReference;
	stocklineReferenceData: any;
	roStatusList: any = [];
	roApproverStatusList: any = [];
	defaultCondtionId: number;
	enableHeaderSaveBtn: boolean = false;
	enablePartSaveBtn: boolean = false;
	enableApproverSaveBtn: boolean = false;
	enableAddSaveBtn: boolean = false;
	totalExtCost: any;
	totalDiscAmount: any;
	isSpinnerVisible: boolean = true;
	userTypes: any = [];
	capabilityauditHistory: any = [];
	currentUserLegalEntityId: number;
	companyModuleId: number;
	vendorModuleId: number;
	customerModuleId: number;
	poTotalCost: number;
	internalApproversList: any = [];
	selectallApprovers: boolean;
	disableHeaderInfo: boolean = false; 
	displayWarningModal: boolean = false;
	roFulfillingstatusID: number;
	fields = ['partsCost', 'partsRevPercentage', 'unitCost', 'extCost', 'qty', 'laborCost', 'laborRevPercentage', 'overHeadCost', 'overHeadPercentage', 'chargesCost', 'freightCost', 'exclusionCost', 'directCost', 'directCostPercentage', 'revenue', 'margin', 'marginPercentage'];
	approvalProcessHeader = [
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
	approvalProcessList: any = [];
	tempApproverObj: any = {};
	tempApproverMemo: string;
	apporoverEmailList: string;
	apporoverNamesList: any = [];
	currentUserEmployeeName: string;
	disableApproverSelectAll: boolean = false;
	enableMultiPartAddBtn: boolean = false;
	ApprovedstatusId = 0; 
	SubmitInternalApprovalID = 0;
	SentForInternalApprovalID = 0;
	
	constructor(private route: Router,
		public legalEntityService: LegalEntityService,
		public currencyService: CurrencyService,
		public unitofmeasureService: UnitOfMeasureService,
		public conditionService: ConditionService,
		public CreditTermsService: CreditTermsService,
		public employeeService: EmployeeService,
		public vendorService: VendorService,
		public priority: PriorityService,
		private alertService: AlertService,
		public glAccountService: GlAccountService,
		private authService: AuthService,
		private customerService: CustomerService,
		private companyService: CompanyService,
		private commonService: CommonService,
		private _actRoute: ActivatedRoute,	
		private repairOrderService: RepairOrderService,  
		private vendorCapesService: VendorCapabilitiesService,
		private itemser: ItemMasterService,
		private datePipe: DatePipe,
		private workOrderService: WorkOrderService,
		private stocklineService: StocklineService, 
		private salesOrderReferenceStorage: SalesOrderReferenceStorage,
		private stocklineReferenceStorage: StocklineReferenceStorage) {

		this.vendorService.ShowPtab = false;
		this.vendorService.alertObj.next(this.vendorService.ShowPtab);
		this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-ro-setup';
		this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
	}

	ngOnInit() {
		this.getWarningsList();
		this.loadVendorList();
		this.priorityData();	
		this.loadManagementdata();	
		this.loadCurrencyData();
		this.loadConditionData();
		this.loadROStatus();
		this.loadROApproverStatus();	
		this.employeedata();
		this.salesStockRefData();
		this.loadcustomerData();
		this.getLegalEntity();
		this.getCountriesList();
		this.loadPercentData();
		this.loadVendorContactInfo();
		this.loadWorkOrderList();
		this.loadSalesOrderList();
		this.loadShippingViaList();
		this.loadModuleListForVendorComp();
		this.loadApprovalProcessStatus()
		this.salesOrderReferenceData = this.salesOrderReferenceStorage.salesOrderReferenceData;  
		this.stocklineReferenceData = this.stocklineReferenceStorage.stocklineReferenceData;
        
		if(!this.isEditMode) {
			this.getManagementStructureDetailsForCurrentUser(this.currentUserManagementStructureId);
		}
		this.headerInfo.resale = true;
		this.headerInfo.companyId = 0;
		this.headerInfo.buId = 0;
		this.headerInfo.divisionId = 0;
		this.headerInfo.departmentId = 0;
		if (this.headerInfo.repairOrderNumber == "" || this.headerInfo.repairOrderNumber == undefined) {
			this.headerInfo.repairOrderNumber = 'Creating';
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
		this.headerInfo.closedDate = '';
		
		this.vendorIdByParams = this._actRoute.snapshot.params['vendorId'];
		if(this.vendorIdByParams) {
			setTimeout(() => {
				this.loadvendorDataById(this.vendorIdByParams);
			}, 1200);
		} 

		this.roId = this._actRoute.snapshot.params['id'];
		this.workOrderPartNumberId = this._actRoute.snapshot.params['mpnid'];	
		if (this.roId !== 0 && this.roId !== undefined) {
			this.isEditMode = true;
			this.isEditModeHeader = true;
			this.toggle_ro_header = false;		
			setTimeout(() => {				
				this.getVendorROHeaderById(this.roId);
				this.getRepairOrderPartsById(this.roId);
			}, 1200);
		}
		else if (this.roId === 0) {
			setTimeout(() => {
				this.getRepairOrderPartsById(this.roId);
			}, 1200);
		}
		
		if (!this.isEditMode) {
			this.partListData = [this.newObjectForParent];
			for (let i = 0; i < this.partListData.length; i++) {
				if (!this.partListData[i].ifSplitShip) {
					this.partListData[i].childList = [];
				}
			}
		}
	} 

	getManagementStructureDetailsForCurrentUser(id) {
		this.commonService.getManagementStructureDetails(id).subscribe(res => {
			if (res.Level1) {
				this.headerInfo.companyId = res.Level1;
				this.getBUList(res.Level1);
			} else
				this.headerInfo.companyId = 0;

			if (res.Level2) {
				this.headerInfo.buId = res.Level2;
				this.getDivisionlist(res.Level2);
			} else
				this.headerInfo.buId = 0;

			if (res.Level3) {
				this.headerInfo.divisionId = res.Level3;
				this.getDepartmentlist(res.Level3);
			} else
				this.headerInfo.divisionId = 0;

			if (res.Level4) {
				this.headerInfo.departmentId = res.Level4;
				this.getDepartmentId(res.Level4);
			} else
				this.headerInfo.departmentId = 0;

			this.isSpinnerVisible = false;
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	getRequisitionerOnLoad(id) {
		this.headerInfo.requisitionerId = getObjectById('value', id, this.allEmployeeList);
	}

	loadvendorDataById(vendorId) {		
		if(vendorId) {
			this.vendorContactList = [];
			this.getVendorContactsListByID(vendorId);			
			this.getVendorCreditTermsByID(vendorId);
			this.headerInfo.vendorId = getObjectById('vendorId', vendorId, this.allActions);
			this.headerInfo.vendorCode = getObjectById('vendorId', vendorId, this.allActions);
			this.headerInfo.vendorName = getValueFromArrayOfObjectById('vendorName', 'vendorId', vendorId, this.allActions);
		}
	}

	getManagementStructureDetails(id) {
		this.commonService.getManagementStructureDetails(id).subscribe(res => {
			if (res.Level1) {
				this.headerInfo.companyId = res.Level1;
				this.getBUList(res.Level1);
			} else
				this.headerInfo.companyId = 0;

			if (res.Level2) {
				this.headerInfo.buId = res.Level2;
				this.getDivisionlist(res.Level2);
			} else
				this.headerInfo.buId = 0;

			if (res.Level3) {
				this.headerInfo.divisionId = res.Level3;
				this.getDepartmentlist(res.Level3);
			} else
				this.headerInfo.divisionId = 0;

			if (res.Level4) {
				this.headerInfo.departmentId = res.Level4;
				this.getDepartmentId(res.Level4);
			} else
				this.headerInfo.departmentId = 0;

		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	getVendorROHeaderById(roId) {
		this.repairOrderService.getVendorROHeaderById(roId).subscribe(res => {
			this.headerInfo = {
				repairOrderNumber: res.repairOrderNumber,
				openDate: new Date(res.openDate),
				closedDate: res.closedDate ? new Date(res.closedDate) : '',
				needByDate: new Date(res.needByDate),
				priorityId: getObjectById('value', res.priorityId, this.allPriorityInfo),
				deferredReceiver: res.deferredReceiver,
				vendorId: getObjectById('vendorId', res.vendorId, this.allActions),
				vendorCode: getObjectById('vendorId', res.vendorId, this.allActions),
				vendorContactId: this.getVendorContactsListByIDEdit(res),
				vendorContactPhone: this.getVendorContactsListByIDEdit(res),
				vendorName: getValueFromArrayOfObjectById('vendorName', 'vendorId', res.vendorId, this.allActions),
				creditLimit: res.creditLimit ? formatNumberAsGlobalSettingsModule(res.creditLimit, 2) : '0.00',
				creditTerms: res.creditTerms,
				creditTermsId: res.creditTermsId,
				requisitionerId: getObjectById('value', res.requisitionerId, this.allEmployeeList),
				approverId: getObjectById('value', res.approverId, this.allEmployeeList),
				approvedDate: res.approvedDate ? new Date(res.approvedDate) : '',
				statusId: res.statusId,
				resale: res.resale,
				companyId: this.getManagementStructureDetails(res.managementStructureId),
                roMemo: res.roMemo,
                notes: res.notes,
			};
			if(this.headerInfo.statusId == this.roFulfillingstatusID) {
				this.disableAddPart = true;
				this.disableHeaderInfo = true; 
			} else {
				this.disableAddPart = false;
				this.disableHeaderInfo = false; 
			}
		}, err => {			
			const errorLog = err;
			this.errorMessageHandler(errorLog);});
	}

	getVendorROAddressById(roId) {
		this.isSpinnerVisible = true;
		this.repairOrderService.getVendorROAddressById(roId).subscribe(res => {
			this.sourceRoApproval = {
				shipToUserTypeId: res.shipToUserTypeId,
				shipToSiteName: res.shipToSiteName,
				shipToAddress1: res.shipToAddress1,
				shipToAddress2: res.shipToAddress2,
				shipToCity: res.shipToCity,
				shipToStateOrProvince: res.shipToState,
				shipToPostalCode: res.shipToPostalCode,
				shipToCountry: res.shipToCountry,				
				shipToMemo: res.shipToMemo,				
				shipVia: res.shipVia,
				shippingCost: formatNumberAsGlobalSettingsModule(res.shippingCost, 2),
				handlingCost: formatNumberAsGlobalSettingsModule(res.handlingCost, 2),				
				billToUserTypeId: res.billToUserTypeId,				
				billToAddress1: res.billToAddress1,
				billToAddress2: res.billToAddress2,				
				billToCity: res.billToCity,
				billToStateOrProvince: res.billToStateOrProvince,
				billToPostalCode: res.billToPostalCode,
				billToCountry: res.billToCountry,
				billToAddressId: res.billToAddressId,				
				billToMemo: res.billToMemo,
				shipToUserId: this.getShipToUserIdEdit(res),
				shipToAddressId: this.tempShipTOAddressId ? this.tempShipTOAddressId : 0,
				billToUserId: this.getBillToUserIdEdit(res),
				shipViaId: this.getShipViaEdit(res)

			};
			if(this.sourceRoApproval && this.sourceRoApproval.shipToUserTypeId && this.sourceRoApproval.billToUserTypeId) {
				this.isEditModeAdd = true;
				this.isSpinnerVisible = false;
			} else {
				this.isEditModeAdd = false;
				this.sourceRoApproval.shipToUserTypeId = this.companyModuleId;
				this.sourceRoApproval.billToUserTypeId = this.companyModuleId;
				this.getLegalEntityDetailsById();
			}
		}, err => {			
			const errorLog = err;
		   this.errorMessageHandler(errorLog);
		})
	}
	getRepairOrderPartsById(roId) {
		this.partListData = [];
		this.isSpinnerVisible = true;			
				this.repairOrderService.getRepairOrderPartsById(roId, this.workOrderPartNumberId).subscribe(res => {
					this.newPartsList = [this.newObjectForParent];					
					res[0].map((x, pindex) => {
						this.newPartsList = {
							...x,
							partNumberId: {value: x.itemMasterId, label: x.partNumber},
							ifSplitShip: x.roPartSplits ? true : false,
							partNumber: x.partNumber,
							partDescription: x.partDescription,
							needByDate: new Date(x.needByDate),
							conditionId: parseInt(x.conditionId),
							priorityId: parseInt(x.priorityId),
							discountPercent: x.discountPercent ? parseInt(x.discountPercent) : null,							
							functionalCurrencyId: getObjectById('value', x.functionalCurrencyId, this.allCurrencyData),
							reportCurrencyId: getObjectById('value', x.reportCurrencyId, this.allCurrencyData),
							workOrderId: getObjectById('value', x.workOrderId, this.allWorkOrderInfo),
							salesOrderId: getObjectById('value', x.salesOrderId, this.allSalesOrderInfo),
							quantityOrdered: x.quantityOrdered ? formatNumberAsGlobalSettingsModule(x.quantityOrdered, 0) : '0',
							vendorListPrice: x.vendorListPrice ? formatNumberAsGlobalSettingsModule(x.vendorListPrice, 2) : '0.00',
							discountPerUnit: x.discountPerUnit ? formatNumberAsGlobalSettingsModule(x.discountPerUnit, 2) : '0.00',
							discountAmount: x.discountAmount ? formatNumberAsGlobalSettingsModule(x.discountAmount, 2) : '0.00',
							unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
							extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00',
							isApproved: x.isApproved ? x.isApproved : false,
							childList: this.getRepairOrderSplitPartsEdit(x, pindex),

						}
						this.getManagementStructureForParentEdit(this.newPartsList);
						this.getPNDetailsById(this.newPartsList, 'onEdit');					
						if (!this.newPartsList.childList) {
							this.newPartsList.childList = [];
						}
						this.partListData.push(this.newPartsList);
						if(this.partListData.length > 0) {
							this.isEditModePart = true;
						} else {
							this.isEditModePart = false;
						}
						this.getTotalExtCost();
						this.getTotalDiscAmount();
					})
					this.isSpinnerVisible = false;
				}, err => {					
					const errorLog = err;
					this.errorMessageHandler(errorLog);
				});			
	}

	getRepairOrderSplitPartsEdit(partList, pindex) {
		if (partList.roPartSplits) {
			return partList.roPartSplits.map((y, cindex) => {
				const splitpart = {
					...y,
					needByDate: y.needByDate ? new Date(y.needByDate) : '',
					partListUserTypeId: y.roPartSplitUserTypeId,
					priorityId: partList.priorityId ? getValueFromArrayOfObjectById('label', 'value', partList.priorityId, this.allPriorityInfo) : null,
					partListUserId: this.getPartSplitUserIdEdit(y, pindex, cindex),
					partListAddressId: y.roPartSplitAddressId ? y.roPartSplitAddressId : 0,
					quantityOrdered: y.quantityOrdered ? formatNumberAsGlobalSettingsModule(y.quantityOrdered, 0) : '0'			
				}
				this.getManagementStructureForChildEdit(splitpart);
				return splitpart;
			})
		}
	}
	getManagementStructureForParentEdit(partList) {
		const msId = partList.managementStructureId ? partList.managementStructureId : this.headerInfo.managementStructureId;
		this.commonService.getManagementStructureDetails(msId).subscribe(msparent => {
			if (msparent.Level1) {
				partList.parentCompanyId = msparent.Level1;
				this.getParentBUList(partList);
			} else
				partList.parentCompanyId = 0;

			if (msparent.Level2) {
				partList.parentbuId = msparent.Level2;
				this.getParentDivisionlist(partList);
			} else
				partList.parentbuId = 0;

			if (msparent.Level3) {
				partList.parentDivisionId = msparent.Level3;
				this.getParentDeptlist(partList);
			} else
				partList.parentDivisionId = 0;

			if (msparent.Level4) {
				partList.parentDeptId = msparent.Level4;
				this.getParentDeptId(partList);
			} else
				partList.parentDeptId = 0;

		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})
	}

	getManagementStructureForChildEdit(partChildList) {
		this.commonService.getManagementStructureDetails(partChildList.managementStructureId).subscribe(mschild => {
			if (mschild.Level1) {
				partChildList.childCompanyId = mschild.Level1;
				this.getChildBUList(partChildList);
			} else
				partChildList.childCompanyId = 0;

			if (mschild.Level2) {
				partChildList.childbuId = mschild.Level2;
				this.getChildDivisionlist(partChildList);
			} else
				partChildList.childbuId = 0;

			if (mschild.Level3) {
				partChildList.childDivisionId = mschild.Level3;
				this.getChildDeptlist(partChildList);
			} else
				partChildList.childDivisionId = 0;

			if (mschild.Level4) {
				partChildList.childDeptId = mschild.Level4;
				this.getChildDeptId(partChildList);
			} else
				partChildList.childDeptId = 0;

		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})
	}

	getApproversListById(roId) {
		if(this.roApprovaltaskId == 0) {
            this.commonService.smartDropDownList('ApprovalTask', 'ApprovalTaskId', 'Name').subscribe(response => { 		        
            if(response) {					
                response.forEach(x => {
                    if (x.label.toUpperCase() == "RO APPROVAL") {
                        this.roApprovaltaskId = x.value;
                    }              
                });
            }
            },err => {               
                const errorLog = err;
                this.errorMessageHandler(errorLog);		
            });
            }
		this.isSpinnerVisible = true;
		this.vendorService.getROTotalCostById(roId).subscribe(res => {
			if(res) {
				this.poTotalCost = res.totalCost;				
				this.repairOrderService.getApproversListByTaskIdModuleAmt( this.roApprovaltaskId, this.poTotalCost).subscribe(res => {
					this.internalApproversList = res;
					this.internalApproversList.map(x => {
						this.apporoverEmailList = x.approverEmails;
						this.apporoverNamesList.push(x.approverName);
					})
				})
			}
			this.isSpinnerVisible = false;
		}, err => {			
			const errorLog = err;
			this.errorMessageHandler(errorLog);
		})
	}

	loadApprovalProcessStatus() {		
        this.commonService.smartDropDownList('ApprovalProcess', 'ApprovalProcessId', 'Name').subscribe(response => { 		        
		     response.forEach(x => {
                if (x.label.toUpperCase() == "APPROVED") {
                    this.ApprovedstatusId = x.value;
				}
				else if (x.label.toUpperCase() == "SENTFORINTERNALAPPROVAL") {
                    this.SentForInternalApprovalID = x.value;
				}
				else if (x.label.toUpperCase() == "SUBMITINTERNALAPPROVALID") {
                    this.SubmitInternalApprovalID = x.value;
				}				
				
            });
		},err => {			
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
	}

	getApprovalProcessListById(poId) {
		this.isSpinnerVisible = true;
		this.selectallApprovers = false;
		this.enableApproverSaveBtn = false;
		this.repairOrderService.getROApprovalListById(poId).subscribe(res => {
			const arrayLen = res.length;
			let count = 0;
			this.approvalProcessList = res.map(x => {
				if(x.actionId == this.ApprovedstatusId) {
					count++;
				}
				if(count == arrayLen) {
					this.disableApproverSelectAll = true;
				}
				return {
					...x,
					sentDate: x.sentDate ? new Date(x.sentDate) : null, 
					approvedDate: x.approvedDate ? new Date(x.approvedDate) : null,
					unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
					extCost: x.extCost ? formatNumberAsGlobalSettingsModule(x.extCost, 2) : '0.00'
				}
			});
			this.isSpinnerVisible = false;
		}, err => {			
			const errorLog = err;
					this.errorMessageHandler(errorLog);
		})
	}

	getShipToUserIdEdit(data) {
		if (data.shipToUserTypeId === this.customerModuleId ) {
			this.tempShipTOAddressId = data.shipToAddressId;
			this.onShipToCustomerSelected(data.shipToUserId, data, null, 'shipEdit');			
			return getObjectById('value', data.shipToUserId, this.allCustomers);
		}
		if (data.shipToUserTypeId === this.vendorModuleId) {
			this.tempShipTOAddressId = data.shipToAddressId;
			this.onShipToVendorSelected(data.shipToUserId, data, null, 'shipEdit');			
			return getObjectById('vendorId', data.shipToUserId, this.allActions);
		}
		if (data.shipToUserTypeId === this.companyModuleId) {
			this.tempShipTOAddressId = data.shipToAddressId;			
			this.shipToSelectedvalue = data.shipToUserId;
			this.companyService.getShippingCompanySiteNames(this.shipToSelectedvalue).subscribe(response => {
				this.companySiteList_Shipping = response;
				if (this.isEditMode) {
					if (data.shipToAddressId == 0) {
						this.companySiteList_Shipping.push({ legalEntityShippingAddressId: 0, siteName: data.shipToSiteName });
						this.shipToAddress.address1 = data.shipToAddress1;
						this.shipToAddress.address2 = data.shipToAddress2;						
						this.shipToAddress.city = data.shipToCity;
						this.shipToAddress.stateOrProvince = data.shipToState;
						this.shipToAddress.postalCode = data.shipToPostalCode;
						this.shipToAddress.country = data.shipToCountry;
					} else {
						this.onShipToGetCompanyAddress(this.companySiteList_Shipping[0].legalEntityShippingAddressId);
					}
				}
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);})
			this.companyService.getCompanyContacts(this.shipToSelectedvalue).subscribe(response => {
				this.contactListForCompanyShipping = response;
				this.sourceRoApproval.shipToContactId = getObjectById('contactId', data.shipToContactId, this.contactListForCompanyShipping);
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);})			
			return getObjectById('value', data.shipToUserId, this.legalEntity);
		}
	}

	getShipViaEdit(data) {
		this.commonService.getShipViaDetailsByModule(data.shipToUserTypeId, this.shipToSelectedvalue).subscribe(response => {
			this.shipViaList = response;		
			this.sourceRoApproval.shippingAcctNum = data.shippingAcctNum;
			this.sourceRoApproval.shipViaId = data.shipViaId;
			if(this.sourceRoApproval.shipViaId) {
				this.getShipViaDetails(this.sourceRoApproval.shipViaId);
			}
			if (data.shipViaId == 0) {
				this.shipViaList.push({ shipViaId: 0, name: data.shipVia, shippingAccountInfo: data.shippingAcctNum });
				this.sourceRoApproval.shippingAcctNum = data.shippingAcctNum;			
			} 			
			return this.sourceRoApproval.shipViaId;
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})		
	}

	getBillToUserIdEdit(data) {
		if (data.billToUserTypeId === this.customerModuleId) {
			this.tempBillTOAddressId = data.billToAddressId;
			this.onBillToCustomerSelected(data.billToUserId, data, null, 'billEdit');
			return getObjectById('value', data.billToUserId, this.allCustomers);
		}
		if (data.billToUserTypeId === this.vendorModuleId) {
			this.tempBillTOAddressId = data.billToAddressId;
			this.onBillToVendorSelected(data.billToUserId, data, null, 'billEdit');
			return getObjectById('vendorId', data.billToUserId, this.allActions);
		}
		if (data.billToUserTypeId === this.companyModuleId) {
			this.tempBillTOAddressId = data.billToAddressId;			
			this.billToSelectedvalue = data.billToUserId;
			this.companyService.getBillingCompanySiteNames(this.billToSelectedvalue).subscribe(response => {
				this.companySiteList_Billing = response;
				if (this.isEditMode) {
					if (data.billToAddressId == 0) {
						this.companySiteList_Billing.push({ legalEntityBillingAddressId: 0, siteName: data.billToSiteName });
						this.billToAddress.address1 = data.billToAddress1;
						this.billToAddress.address2 = data.billToAddress2;						
						this.billToAddress.city = data.billToCity;
						this.billToAddress.stateOrProvince = data.billToState;
						this.billToAddress.postalCode = data.billToPostalCode;
						this.billToAddress.country = data.billToCountry;
					} else {
						this.onBillToGetCompanyAddress(this.companySiteList_Billing[0].legalEntityBillingAddressId);
					}
				}
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);})
			this.companyService.getCompanyContacts(this.billToSelectedvalue).subscribe(response => {
				this.contactListForCompanyBilling = response;
				this.sourceRoApproval.billToContactId = getObjectById('contactId', data.billToContactId, this.contactListForCompanyBilling);
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);});			
			return getObjectById('value', data.billToUserId, this.legalEntity);
		}
	}

	getPartSplitUserIdEdit(data, pindex, cindex) {
		if (data.roPartSplitUserTypeId === this.customerModuleId) {		
			this.onCustomerNameChange(data.roPartSplitUserId, data, pindex, cindex);
			return getObjectById('value', data.roPartSplitUserId, this.allCustomers);
		}
		if (data.roPartSplitUserTypeId === this.vendorModuleId) {
			this.onVendorNameChange(data.roPartSplitUserId, data, pindex, cindex);
			return getObjectById('vendorId', data.roPartSplitUserId, this.allActions);
		}
		if (data.roPartSplitUserTypeId === this.companyModuleId) {
			this.onCompanyNameChange(data.roPartSplitUserId, data, pindex, cindex);
			return getObjectById('value', data.roPartSplitUserId, this.legalEntity);
		}
	}

	getLegalEntity() {
		this.commonService.smartDropDownList('LegalEntity', 'LegalEntityId', 'Name').subscribe(res => {
			this.legalEntity = res;			
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})
	}

	getLegalEntityDetailsById() {
		this.commonService.getLegalEntityIdByMangStrucId(this.currentUserManagementStructureId).subscribe(res => {
			this.currentUserLegalEntityId = res.legalEntityId;
			this.getInactiveObjectForLEOnEdit('value', this.currentUserLegalEntityId, this.legalEntity, 'LegalEntity', 'LegalEntityId', 'Name');
			this.isSpinnerVisible = false;
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	getInactiveObjectForLEOnEdit(string, id, originalData, tableName, primaryColumn, description) {
        if(id) {
            for(let i=0; i < originalData.length; i++) {
                if(originalData[i][string] == id) {
                    this.sourceRoApproval.shipToUserId = originalData[i];
					this.sourceRoApproval.billToUserId = originalData[i];
					this.onShipToCompanySelected(originalData[i]);
					this.onBillToCompanySelected(originalData[i]);
                }
            }
            let obj: any = {};
            this.commonService.smartDropDownGetObjectById(tableName, primaryColumn, description, primaryColumn, id).subscribe(res => {
				obj = res[0];
				this.legalEntity = [...originalData, obj];
				this.sourceRoApproval.shipToUserId = obj;
				this.sourceRoApproval.billToUserId = obj;
				this.onShipToCompanySelected(obj);
				this.onBillToCompanySelected(obj);
			});
		} else {
            return null;
        }
    }

	getCountriesList() {
		this.commonService.smartDropDownList('Countries', 'countries_id', 'nice_name').subscribe(res => {
			this.allCountriesList = res;
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	filterCompanyNameforgrid(event) {
		this.legalEntityList_Forgrid = this.legalEntity;
		const legalFilter = [...this.legalEntity.filter(x => {
			return x.label.toLowerCase().includes(event.query.toLowerCase())
		})]
		this.legalEntityList_Forgrid = legalFilter;
	}
	filterCompanyNameforShipping(event) {
		this.legalEntityList_ForShipping = this.legalEntity;
		const legalFilter = [...this.legalEntity.filter(x => {
			return x.label.toLowerCase().includes(event.query.toLowerCase())
		})]

		this.legalEntityList_ForShipping = legalFilter;
	}

	filterCompanyNameforBilling(event) {
		this.legalEntityList_ForBilling = this.legalEntity;
		const legalFilter = [...this.legalEntity.filter(x => {
			return x.label.toLowerCase().includes(event.query.toLowerCase())
		})]

		this.legalEntityList_ForBilling = legalFilter;
	}

	private loadVendorContactInfo() {	
		this.vendorService.getContactsFirstName().subscribe(results => {
			this.venContactList = results[0];
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	private priorityData() {
		this.commonService.smartDropDownList('Priority', 'PriorityId', 'Description').subscribe(res => {
			this.allPriorityInfo = res;
			this.allPriorityInfo.map(x => {
				if(x.label == 'Routine') {
					this.headerInfo.priorityId = x;
				}
			})
			this.onSelectPriority();
		});		
	}
	loadWorkOrderList() {
		this.commonService.getOpenWONumbers().subscribe(res => {
			this.allWorkOrderInfo = res.map(x => {
				return {
					value: x.workOrderId,
					label: x.workOrderNum
				}
			});
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	loadSalesOrderList() {
		this.commonService.getOpenSONumbers().subscribe(res => {
			this.allSalesOrderInfo = res.map(x => {
				return {
					value: x.salesOrderId,
					label: x.salesOrderNumber
				}
			});
			for(let i = 0; i< this.allSalesOrderInfo.length; i++){
				if(this.salesOrderReferenceData) {
					if(this.allSalesOrderInfo[i].value == this.salesOrderReferenceData.salesOrderId){
						this.newObjectForParent.salesOrderId = this.allSalesOrderInfo[i];
					}
				}
			}
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	loadShippingViaList() {
		this.commonService.smartDropDownList('ShippingVia', 'ShippingViaId', 'Name').subscribe(res => {
			this.allShipViaInfo = res;
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	loadModuleListForVendorComp() {
		this.commonService.getModuleListForObtainOwnerTraceable().subscribe(res => {
			this.userTypes = res;
			this.userTypes.map(x => {
				if(x.moduleName.toUpperCase() == 'COMPANY') {
					this.companyModuleId = x.moduleId;
					this.sourceRoApproval.shipToUserTypeId = this.companyModuleId;
					this.sourceRoApproval.billToUserTypeId = this.companyModuleId;
				}
				else if(x.moduleName.toUpperCase() == 'VENDOR') {
					this.vendorModuleId = x.moduleId;					
				}
				else if(x.moduleName.toUpperCase() == 'CUSTOMER') {
					this.customerModuleId = x.moduleId;
				}
			})
			
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
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

	get employeeId() {
	return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
	}

	saveRepairOrderHeader() {
		if (this.createROForm.invalid 
			|| this.headerInfo.companyId == 0 || this.headerInfo.companyId == null) { 	
			this.alertService.showMessage('Repair Order', "Please enter required highlighted fields for RO Header!", MessageSeverity.error);
			this.inputValidCheckHeader = true;
			if(this.headerInfo.companyId == 0) {
				this.managementValidCheck = true;
			}
		}
		else {
			this.isSpinnerVisible = true;
			const headerInfoObj = {
				repairOrderNumber: this.headerInfo.repairOrderNumber,
				openDate: this.datePipe.transform(this.headerInfo.openDate, "MM/dd/yyyy"),//new Date(this.headerInfo.openDate),
				closedDate: this.datePipe.transform(this.headerInfo.closedDate, "MM/dd/yyyy"),
				needByDate: this.datePipe.transform(this.headerInfo.needByDate, "MM/dd/yyyy"),
				priorityId: this.headerInfo.priorityId ? this.getPriorityId(this.headerInfo.priorityId) : 0,
				deferredReceiver: this.headerInfo.deferredReceiver ? this.headerInfo.deferredReceiver : false,
				vendorId: this.headerInfo.vendorId ? this.getVendorId(this.headerInfo.vendorId) : 0,
				vendorContactId: this.headerInfo.vendorContactId ? this.getVendorContactId(this.headerInfo.vendorContactId) : 0,
				vendorContactPhone: this.headerInfo.vendorContactPhone ? this.getVendorContactPhone(this.headerInfo.vendorContactPhone) : '',
				creditLimit: this.headerInfo.creditLimit ? parseFloat(this.headerInfo.creditLimit.toString().replace(/\,/g,'')) : '0.00',
				creditTermsId: this.headerInfo.creditTermsId ? this.headerInfo.creditTermsId : 0,
				requisitionerId: this.headerInfo.requisitionerId ? this.getValueByObj(this.headerInfo.requisitionerId) : 0,
				approverId: this.headerInfo.approverId ? this.getValueByObj(this.headerInfo.approverId) : 0,
				approvedDate: this.datePipe.transform(this.headerInfo.approvedDate, "MM/dd/yyyy"),
				statusId: this.headerInfo.statusId ? this.headerInfo.statusId : 0,
				resale: this.headerInfo.resale ? this.headerInfo.resale : false,
				managementStructureId: this.headerInfo.managementStructureId ? this.headerInfo.managementStructureId : 0,
                roMemo: this.headerInfo.roMemo ? this.headerInfo.roMemo : '',
                notes: this.headerInfo.notes ? this.headerInfo.notes : '',
				masterCompanyId: this.currentUserMasterCompanyId,
				createdBy: this.userName,
				updatedBy: this.userName
			}
			// header save 
			if (!this.isEditModeHeader) {
				this.repairOrderService.saveRepairOrder({ ...headerInfoObj }).subscribe(saveddata => {
					this.repairOrderId = saveddata.repairOrderId;
					this.roId = saveddata.repairOrderId;
					this.headerInfo.repairOrderNumber = saveddata.repairOrderNumber;
					if(this.stocklineReferenceData != null && this.stocklineReferenceData != undefined) {
						this.getManagementStructureByStockline(this.stocklineReferenceData.managementStructureEntityId);
					}				
					if(this.roId) {
						this.isEditModeHeader = true;
						this.isEditMode = true;
					}
					this.isSpinnerVisible = false;
					this.alertService.showMessage(
						'Success',
						`Saved RO Header Successfully`,
						MessageSeverity.success
					);
				}, err => {					
					const errorLog = err;
					this.errorMessageHandler(errorLog);
					this.toggle_ro_header = true;
					this.enableHeaderSaveBtn = true;
				});
			} else {
				const roHeaderEdit = { ...headerInfoObj, repairOrderId: parseInt(this.roId) };
				this.repairOrderService.saveRepairOrder({ ...roHeaderEdit }).subscribe(saveddata => {
					this.repairOrderId = saveddata.repairOrderId;
					this.roId = saveddata.repairOrderId;
					this.headerInfo.repairOrderNumber = saveddata.repairOrderNumber;
					this.isEditMode = true;				
					this.isSpinnerVisible = false;
					this.alertService.showMessage(
						'Success',
						`Updated RO Header Successfully`,
						MessageSeverity.success
					);
				}, err => {					
					const errorLog = err;
					this.errorMessageHandler(errorLog);
					this.toggle_ro_header = true;
					this.enableHeaderSaveBtn = true;
				});
			}
			this.toggle_ro_header = false;
			this.enableHeaderSaveBtn = false;
		}
	}
	
	errorMessageHandler(log) {
		this.isSpinnerVisible = false;
		this.alertService.showMessage(
			'Error',
			log.error,
			MessageSeverity.error
		);
	}
	
	dismissModel() {
		this.saveRepairOrderPartsList(true); 
    }

	parsedText(text) {
        if (text) {
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
        }
    }
	saveRepairOrderPartsList(contwithoutVendorPrice = false) {
		if(this.createROPartsForm.invalid) {
			this.alertService.showMessage('Repair Order', "Please enter required highlighted fields for RO PartsList!", MessageSeverity.error);
			this.inputValidCheck = true;
			return;
		}
		this.isSpinnerVisible = true;
		this.parentObjectArray = [];
		for (let i = 0; i < this.partListData.length; i++) {
			this.alertService.resetStickyMessage();
			if(this.partListData[i].quantityOrdered == 0) {
				this.isSpinnerVisible = false;
			  this.alertService.showStickyMessage("Validation failed", "Please enter Qty.", MessageSeverity.error, 'Please enter Qty');
				return;
			}
			if(this.partListData[i].vendorListPrice == 0 && contwithoutVendorPrice == false) {	
				this.isSpinnerVisible = false;
				this.displayWarningModal = true;										
				return;
		    }			
			let childDataList = [];
			this.childObjectArray = [];
			this.childObjectArrayEdit = [];			
			this.parentObject = {};
			this.childObject = {};	
			if (this.partListData[i].childList) {
				if (this.partListData[i].childList.length > 0) {
					for (let j = 0; j < this.partListData[i].childList.length; j++) {
						childDataList.push(this.partListData[i].childList[j])
					}
				}
			}

			if (childDataList.length > 0) {
				this.childObjectArray = [];
				for (let j = 0; j < childDataList.length; j++) {
					this["splitAddressData" + i + j] = this["splitAddressData" + i + j] ? this["splitAddressData" + i + j] : [];				
					this.childObject = {
						repairOrderId: this.roId,						
						itemMasterId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
						assetId: this.partListData[i].assetId ? this.partListData[i].assetId : 0,
						partNumberId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
						roPartSplitUserTypeId: childDataList[j].partListUserTypeId ? parseInt(childDataList[j].partListUserTypeId) : 0,
						roPartSplitUserId: childDataList[j].partListUserId ? this.getIdByObject(childDataList[j].partListUserId) : 0,
						roPartSplitAddressId: childDataList[j].partListAddressId ? parseInt(childDataList[j].partListAddressId) : 0,
						roPartSplitAddress1: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('address1', 'addressId', childDataList[j].partListAddressId, this["splitAddressData" + i + j]) : '',
						roPartSplitAddress2: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('address2', 'addressId', childDataList[j].partListAddressId, this["splitAddressData" + i + j]) : '',
						roPartSplitCity: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('city', 'addressId', childDataList[j].partListAddressId, this["splitAddressData" + i + j]) : '',
						roPartSplitStateOrProvince: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('stateOrProvince', 'addressId', childDataList[j].partListAddressId, this["splitAddressData" + i + j]) : '',
						roPartSplitPostalCode: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('postalCode', 'addressId', childDataList[j].partListAddressId, this["splitAddressData" + i + j]) : '',
						roPartSplitCountry: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('country', 'addressId', childDataList[j].partListAddressId, this["splitAddressData" + i + j]) : '',
						UOMId: this.partListData[i].UOMId ? this.partListData[i].UOMId : 0,
						quantityOrdered: childDataList[j].quantityOrdered ? parseFloat(childDataList[j].quantityOrdered.toString().replace(/\,/g,'')) : 0,
						needByDate: this.datePipe.transform(childDataList[j].needByDate, "MM/dd/yyyy"),					  
						managementStructureId: childDataList[j].managementStructureId ? childDataList[j].managementStructureId : 0, //109
						isDeleted: childDataList[j].isDeleted,						
					}
					this.childObjectArray.push(this.childObject)
					this.childObjectArrayEdit.push({
						...this.childObject,
						repairOrderPartRecordId: childDataList[j].repairOrderPartRecordId ? childDataList[j].repairOrderPartRecordId : 0
					})
				}
			}

			this.parentObject = {
				repairOrderId: this.roId,
				isParent: true,			
				itemMasterId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
				altEquiPartNumberId: this.partListData[i].altEquiPartNumberId ? this.getAltEquiPartNumByObject(this.partListData[i].altEquiPartNumberId) : null,
				assetId: this.partListData[i].assetId ? this.partListData[i].assetId : 0,
				partNumberId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
				altPartNumberId: this.partListData[i].altPartNumberId ? this.partListData[i].altPartNumberId : 0,
				itemTypeId: this.partListData[i].itemTypeId ? this.partListData[i].itemTypeId : 0,
				manufacturerId: this.partListData[i].manufacturerId ? this.partListData[i].manufacturerId : 0,
				glAccountId: this.partListData[i].glAccountId ? this.partListData[i].glAccountId : 0,
				UOMId: this.partListData[i].UOMId ? this.partListData[i].UOMId : 0,				
				needByDate: this.datePipe.transform(this.partListData[i].needByDate, "MM/dd/yyyy"),
				conditionId: this.partListData[i].conditionId ? this.partListData[i].conditionId : 0,
				priorityId: this.partListData[i].priorityId ? this.partListData[i].priorityId : 0,
				quantityOrdered: this.partListData[i].quantityOrdered ? parseFloat(this.partListData[i].quantityOrdered.toString().replace(/\,/g,'')) : 0,
				unitCost: this.partListData[i].unitCost ? parseFloat(this.partListData[i].unitCost.toString().replace(/\,/g,'')) : 0,
				vendorListPrice: this.partListData[i].vendorListPrice ? parseFloat(this.partListData[i].vendorListPrice.toString().replace(/\,/g,'')) : 0,
				discountPerUnit: this.partListData[i].discountPerUnit ? parseFloat(this.partListData[i].discountPerUnit.toString().replace(/\,/g,'')) : 0,
				discountPercent: this.partListData[i].discountPercent ? this.partListData[i].discountPercent : null,
				discountAmount: this.partListData[i].discountAmount ? parseFloat(this.partListData[i].discountAmount.toString().replace(/\,/g,'')) : 0,
				extendedCost: this.partListData[i].extendedCost ? parseFloat(this.partListData[i].extendedCost.toString().replace(/\,/g,'')) : 0,
				functionalCurrencyId: this.partListData[i].functionalCurrencyId ? this.getCurrencyIdByObject(this.partListData[i].functionalCurrencyId) : null,
				foreignExchangeRate: this.partListData[i].foreignExchangeRate ? this.partListData[i].foreignExchangeRate : 0,				
				reportCurrencyId: this.partListData[i].reportCurrencyId ? this.getCurrencyIdByObject(this.partListData[i].reportCurrencyId) : null,
				workOrderId: this.partListData[i].workOrderId ? this.getValueFromObj(this.partListData[i].workOrderId) : null,
				salesOrderId: this.partListData[i].salesOrderId ? this.getValueFromObj(this.partListData[i].salesOrderId) : null,
				stocklineId: this.partListData[i].stocklineId ? this.getValueByStocklineObj(this.partListData[i].stocklineId) : null,
				managementStructureId: this.partListData[i].managementStructureId ? this.partListData[i].managementStructureId : 0,
				memo: this.partListData[i].memo,
				isApproved: this.partListData[i].isApproved ? this.partListData[i].isApproved : false,
				masterCompanyId: this.currentUserMasterCompanyId,
				isDeleted: this.partListData[i].isDeleted,
				createdBy: this.userName,
				updatedBy: this.userName,						
			}
			if (!this.isEditMode) {
				this.parentObjectArray.push({
					...this.parentObject,
					roPartSplits: this.childObjectArray					
				})				
			} else {
				this.parentObjectArray.push({
					...this.parentObject,
					roPartSplits: this.childObjectArrayEdit,
					repairOrderPartRecordId: this.partListData[i].repairOrderPartRecordId ? this.partListData[i].repairOrderPartRecordId : 0
				})
			}
		}

		this.repairOrderService.saveRepairOrderParts(this.parentObjectArray).subscribe(res => {			
			this.getRepairOrderPartsById(this.roId);
			this.enablePartSaveBtn = false;
			this.alertService.showMessage(
				'Success',
				`Saved RO PartsList Successfully`,
				MessageSeverity.success
			);
		}, err => {		
			const errorLog = err;
			this.errorMessageHandler(errorLog);
		});
	}

	getApproverIdUpdate(level, value) {
		for (let i = 0; i < this.approveListEdit.length; i++) {
			if (level == this.approveListEdit[i].level) {
				if (value == 'id') {
					return getValueFromArrayOfObjectById('roApproverId', 'level', level, this.approveListEdit);
				}
				if (value == 'listId') {
					return getValueFromArrayOfObjectById('roApproverListId', 'level', level, this.approveListEdit);
				}
			}
		}
	}

	saveRepairOrderAddress() {
		if (this.createROAddressForm.invalid 
			|| this.sourceRoApproval.shipToUserTypeId == 0 ||  this.sourceRoApproval.shipToUserTypeId == null
			 || this.sourceRoApproval.shipToAddressId == 0  || this.sourceRoApproval.shipToAddressId == null 
			 || this.sourceRoApproval.shipViaId == 0 || this.sourceRoApproval.shipViaId == null
			 || this.sourceRoApproval.billToUserTypeId == 0  || this.sourceRoApproval.billToUserTypeId == null
			 || this.sourceRoApproval.billToAddressId == 0 || this.sourceRoApproval.billToAddressId == null) { 		
			this.alertService.showMessage('Repair Order', "Please enter required highlighted fields for RO Address!", MessageSeverity.error);
			this.inputValidCheckAdd = true;
			if(this.sourceRoApproval.shipToUserTypeId == 0) {
				this.shipToUserTypeValidCheck = true;
			}
			if(this.sourceRoApproval.shipToAddressId == 0) {
				this.shipToSiteNameValidCheck = true;
			}
			if(this.sourceRoApproval.shipViaId == 0) {
				this.shipViaValidCheck = true;
			}
			if(this.sourceRoApproval.billToUserTypeId == 0) {
				this.billToUserTypeValidCheck = true;
			}
			if(this.sourceRoApproval.billToAddressId == 0) {
				this.billToSiteNameValidCheck = true;
			}
		}
		else {
			this.isSpinnerVisible = true;
			this.sourceRoApprovalObj = {
				repairOrderId: this.roId,			
				shipToUserTypeId: this.sourceRoApproval.shipToUserTypeId ? parseInt(this.sourceRoApproval.shipToUserTypeId) : 0,
				shipToUserId: this.sourceRoApproval.shipToUserId ? this.getShipToBillToUserId(this.sourceRoApproval.shipToUserId) : 0,
				shipToAddressId: this.sourceRoApproval.shipToAddressId ? this.sourceRoApproval.shipToAddressId : 0,			
				shipToContactId: this.sourceRoApproval.shipToContactId ? editValueAssignByCondition('contactId', this.sourceRoApproval.shipToContactId) : 0,
				shipViaId: this.sourceRoApproval.shipViaId,
				shippingCost: this.sourceRoApproval.shippingCost ? parseFloat(this.sourceRoApproval.shippingCost.toString().replace(/\,/g,'')) : null,
				handlingCost: this.sourceRoApproval.handlingCost ? parseFloat(this.sourceRoApproval.handlingCost.toString().replace(/\,/g,'')) : null,
				shipVia: this.sourceRoApproval.shipVia,
				shippingAcctNum: this.sourceRoApproval.shippingAcctNum,				
				shipToMemo: this.sourceRoApproval.shipToMemo ? this.sourceRoApproval.shipToMemo : '',
				billToUserTypeId: this.sourceRoApproval.billToUserTypeId ? parseInt(this.sourceRoApproval.billToUserTypeId) : 0,
				billToUserId: this.sourceRoApproval.billToUserId ? this.getShipToBillToUserId(this.sourceRoApproval.billToUserId) : 0,
				billToAddressId: this.sourceRoApproval.billToAddressId ? this.sourceRoApproval.billToAddressId : 0,				
				billToContactId: this.sourceRoApproval.billToContactId ? editValueAssignByCondition('contactId', this.sourceRoApproval.billToContactId) : 0,
				billToMemo: this.sourceRoApproval.billToMemo ? this.sourceRoApproval.billToMemo : '',
				shipToSiteName: this.postSiteNameForShipping(this.sourceRoApproval.shipToUserTypeId, this.sourceRoApproval.shipToAddressId),
				shipToAddress1: this.shipToAddress.address1,
				shipToAddress2: this.shipToAddress.address2,				
				shipToCity: this.shipToAddress.city,
				shipToStateOrProvince: this.shipToAddress.stateOrProvince,
				shipToPostalCode: this.shipToAddress.postalCode,
				shipToCountry: this.shipToAddress.country,
				billToSiteName: this.postSiteNameForBilling(this.sourceRoApproval.billToUserTypeId, this.sourceRoApproval.billToAddressId),
				billToAddress1: this.billToAddress.address1,
				billToAddress2: this.billToAddress.address2,				
				billToCity: this.billToAddress.city,
				billToStateOrProvince: this.billToAddress.stateOrProvince,
				billToPostalCode: this.billToAddress.postalCode,
				billToCountry: this.billToAddress.country,
				shipToSiteId: this.sourceRoApproval.shipToAddressId ? this.sourceRoApproval.shipToAddressId : 0,
				billToSiteId: this.sourceRoApproval.billToAddressId ? this.sourceRoApproval.billToAddressId : 0,
				createdBy: this.userName,
				updatedBy: this.userName
			}			
			const roAddressEdit = { ...this.sourceRoApprovalObj, repairOrderId: parseInt(this.roId) };
				this.vendorService.saveRepairOrderAddress({ ...roAddressEdit }).subscribe(saveddata => {
					if(saveddata.shipToUserTypeId && saveddata.shipToUserTypeId) {
						this.isEditModeAdd = true;
					} else {
						this.isEditModeAdd = false;
					}
					this.isSpinnerVisible = false;
					this.enableAddSaveBtn = false;
					this.alertService.showMessage(
						'Success',
						`Saved RO Address Successfully`,
						MessageSeverity.success
					);
				}, err => {				
					const errorLog = err;
					this.errorMessageHandler(errorLog);
				});			
		}
	}	

	goToCreateROList() {
		this.route.navigate(['/vendorsmodule/vendorpages/app-create-ro']);
	}

	getManagementStructureByStockline(id) {
		this.commonService.getManagementStructureNamesAndCodes(id).subscribe(msparent => {
			if (msparent.Level1) {
				this.newObjectForParent.parentCompanyId = msparent.Level1;
				this.getParentBUList(this.newObjectForParent);
			} else
			this.newObjectForParent.parentCompanyId = 0;

			if (msparent.Level2) {
				this.newObjectForParent.parentbuId = msparent.Level2;
				this.getParentDivisionlist(this.newObjectForParent);
			} else
			this.newObjectForParent.parentbuId = 0;

			if (msparent.Level3) {
				this.newObjectForParent.parentDivisionId = msparent.Level3;
				this.getParentDeptlist(this.newObjectForParent);
			} else
			this.newObjectForParent.parentDivisionId = 0;

			if (msparent.Level4) {
				this.newObjectForParent.parentDeptId = msparent.Level4;
				this.getParentDeptId(this.newObjectForParent);
			} else
			this.newObjectForParent.parentDeptId = 0;
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	postSiteNameForShipping(moduleId, currentshipToAddressId) {	
		if (moduleId !== undefined && currentshipToAddressId !== undefined) {
			moduleId = parseInt(moduleId)
			if (moduleId == this.customerModuleId) {
				return getValueFromArrayOfObjectById('siteName', 'customerShippingAddressId', currentshipToAddressId, this.shipToCusData);
			} else
				if (moduleId == this.vendorModuleId) {
					return getValueFromArrayOfObjectById('siteName', 'vendorShippingAddressId', currentshipToAddressId, this.vendorSelected);
				} else
					if (moduleId == this.companyModuleId) {
						return getValueFromArrayOfObjectById('siteName', 'legalEntityShippingAddressId', currentshipToAddressId, this.companySiteList_Shipping);
					}
		}
	}

	postSiteNameForBilling(moduleId, currentbillToAddressId) {
		if (moduleId !== undefined && currentbillToAddressId !== undefined) {
			moduleId = parseInt(moduleId)
			if (moduleId == this.customerModuleId) {
				return getValueFromArrayOfObjectById('siteName', 'customerBillingAddressId', currentbillToAddressId, this.billToCusData);
			} else
				if (moduleId == this.vendorModuleId) {
					return getValueFromArrayOfObjectById('siteName', 'vendorBillingAddressId', currentbillToAddressId, this.vendorSelectedForBillTo);
				} else
					if (moduleId == this.companyModuleId) {
						return getValueFromArrayOfObjectById('siteName', 'legalEntityBillingAddressId', currentbillToAddressId, this.companySiteList_Billing);
					}
		}
	}	

	loadcustomerData() {
		this.commonService.smartDropDownList('Customer', 'CustomerId', 'Name').subscribe(response => {
			this.allCustomers = response;
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	private salesStockRefData() {	
			if(this.salesOrderReferenceData){			
						this.newObjectForParent.partNumberId = {value: this.salesOrderReferenceData.itemMasterId, label: this.salesOrderReferenceData.partNumber};
						const newObject = {
							...this.newObjectForParent,
							partNumberId: {value: this.salesOrderReferenceData.itemMasterId, label: this.salesOrderReferenceData.partNumber},
							needByDate: this.headerInfo.needByDate,
							discountPercent: {percentId: null, percentValue: 'Select'}
						}
						this.getManagementStructureForParentEdit(newObject);
						this.getPNDetailsById(this.newObjectForParent);  
				this.newObjectForParent.quantityOrdered = this.salesOrderReferenceData.quantity;
				this.newObjectForParent.managementStructureId = this.salesOrderReferenceData.quantity;
				this.newObjectForParent.conditionId = this.salesOrderReferenceData.conditionId;	
			}
			if(this.stocklineReferenceData){			
						this.newObjectForParent.partNumberId = {value: this.stocklineReferenceData.itemMasterId, label: this.stocklineReferenceData.partNumber};
						this.getPNDetailsById(this.newObjectForParent);            
				this.newObjectForParent.quantityOrdered = this.stocklineReferenceData.quantity;											
			}	
	}

	filterpartItems(event) {
		if(event.query) {
			this.commonService.getStockpartnumbersAutoComplete(event.query, false, 0).subscribe(res => {
				this.partCollection = res.map(x => {
					return {
						value: x.itemMasterId,
						label: x.partNumber
					}
				});
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);})
		} else {
			this.partCollection = [];
		}
	}

	filterAltPartItems(event) {
		this.altPartCollection = this.altPartNumList;
		if (event.query !== undefined && event.query !== null) {
			const partNumberFilter = [...this.altPartNumList.filter(x => {
				return x.altEquiPartNumber.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.altPartCollection = partNumberFilter;
		}
	}

	getPNDetailsById(parentdata, value?) {	
		this.showInput = true;
		const itemMasterId = getValueFromObjectByKey('value', parentdata.partNumberId)
		this.sourceRoApproval.itemMasterId = itemMasterId;
		this.partWithId = [];
		this.altPartNumList = [];
		parentdata.altEquiPartNumberId = null;
		this.itemTypeId = 1;
		if(value != 'onEdit') {
			parentdata.needByDate = this.headerInfo.needByDate;
			parentdata.conditionId = this.defaultCondtionId;
			parentdata.priorityId = this.headerInfo.priorityId ? editValueAssignByCondition('value', this.headerInfo.priorityId) : null;
			parentdata.quantityOrdered = '0';
			parentdata.workOrderId = null;
			parentdata.salesOrderId = null;
			parentdata.memo = null;
			this.getManagementStructureForParentEdit(parentdata);
		}		
		parentdata.controlId = '';
		parentdata.purchaseOrderNum = '';
		parentdata.controlNumber = '';
		this.vendorService.getPartDetailsWithidForSinglePart(itemMasterId).subscribe(
			data1 => {
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
					if (parentdata.stockLineId) {
						this.workOrderService.getStockLineByItemMasterId(parentdata.itemMasterId, parentdata.conditionId).subscribe(resp => {
							parentdata.allStocklineInfo = resp;
							parentdata.stocklineId = getObjectById('stockLineId', parentdata.stockLineId, parentdata.allStocklineInfo);
							this.getStockLineDetails(parentdata);
						},err => {const errorLog = err;           
							this.errorMessageHandler(errorLog);});
					}
					if(parentdata.conditionId && value != 'onEdit') {
						this.getStockLineByItemMasterId(parentdata);
						this.getPriceDetailsByCondId(parentdata);
					}
				}
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);});		
			this.itemser.getItemMasterAltEquiMappingParts(itemMasterId).subscribe(res => {
				this.altPartNumList = res;
				if(parentdata.altEquiPartNumberId && value == 'onEdit') {
					parentdata.altEquiPartNumberId = getObjectById('altEquiPartNumberId', parentdata.altEquiPartNumberId, this.altPartNumList);
				} else if(this.altPartNumList.length > 0) {
					parentdata.altEquiPartNumberId = this.altPartNumList[0];
				}
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);})
	}

	getPriceDetailsByCondId(parentdata) {	
		this.commonService.getPriceDetailsByCondId(parentdata.itemMasterId, parentdata.conditionId).subscribe(res => {
			if(res) {
				parentdata.vendorListPrice = res.vendorListPrice ? formatNumberAsGlobalSettingsModule(res.vendorListPrice, 2) : '0.00';
				parentdata.unitCost = res.unitCost ? formatNumberAsGlobalSettingsModule(res.unitCost, 2) : '0.00';
				parentdata.discountPercent = res.discountPercent ? res.discountPercent : null;
				parentdata.discountPerUnit = res.discountPerUnit ? formatNumberAsGlobalSettingsModule(res.discountPerUnit, 2) : '0.00';
				this.onGetDiscPerUnit(parentdata);
				this.onGetDiscAmount(parentdata);
				this.onGetExtCost(parentdata);
			}
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})
	}

	filterNames(event) {
		this.customerNames = this.allCustomers;
		if (event.query !== undefined && event.query !== null) {
			const customers = [...this.allCustomers.filter(x => {
				return x.label.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.customerNames = customers;
		}
	}
	onCustomerNameChange(customerId, data?, pindex?, cindex?) {	
		this.customerService.getCustomerShipAddressGet(customerId).subscribe(returnedcustomerAddressses => {		
			this["splitAddressData" + pindex + cindex] = [];
			this["splitAddressData" + pindex + cindex] = returnedcustomerAddressses[0];
			if (this.isEditMode) {
				if (data && data.roPartSplitAddressId == 0) {
					this["splitAddressData" + pindex + cindex].push({ customerShippingAddressId: 0, address1: data.roPartSplitAddress1, address2: data.roPartSplitAddress2, city: data.roPartSplitCity, stateOrProvince: data.roPartSplitStateOrProvince, postalCode: data.roPartSplitPostalCode, country: data.roPartSplitCountry })
				}
				this["splitAddressData" + pindex + cindex].map(x => {
					if (x.customerShippingAddressId == 0) {
						data.partListAddressId = x.customerShippingAddressId;
					}
				});				
			}
			if(data){
			data.poPartSplitAddressId = 0;
			data.partListAddressId = 0;}
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	getAddressDetails(variable, pindex, cindex) {
		return this[variable + pindex + cindex]
	}
	filterCustomersSplit(event): void {
		this.splitcustomersList = this.allCustomers;

		if (event.query !== undefined && event.query !== null) {
			const customers = [...this.allCustomers.filter(x => {
				return x.label.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.splitcustomersList = customers;
		}
	}

	onVendorNameChange(vendorId, data?, pindex?, cindex?): void {		
		this.vendorService.getVendorShipAddressGet(vendorId).subscribe(
			vendorAddresses => {				
				this["splitAddressData" + pindex + cindex] = [];
				this["splitAddressData" + pindex + cindex] = vendorAddresses[0].map(x => {
					return {
						...x,
						countryName: x.country
					}
				});				
				if (this.isEditMode) {
					if (data && data.roPartSplitAddressId == 0) {
						this["splitAddressData" + pindex + cindex].push({ vendorShippingAddressId: 0, address1: data.roPartSplitAddress1, address2: data.roPartSplitAddress2, city: data.roPartSplitCity, stateOrProvince: data.roPartSplitStateOrProvince, postalCode: data.roPartSplitPostalCode, country: data.roPartSplitCountry })
					}	
					this["splitAddressData" + pindex + cindex].map(x => {
						if (x.vendorShippingAddressId == 0) {
							data.partListAddressId = x.vendorShippingAddressId;
						}
					});					
				}
				if(data) {
				data.poPartSplitAddressId = 0;
				data.partListAddressId = 0;}
			})

	}

	onCompanyNameChange(companyId, data?, pindex?, cindex?) {
		this.legalEntityService.getLegalEntityAddressById(companyId).subscribe(response => {
			this["splitAddressData" + pindex + cindex] = [];
			this["splitAddressData" + pindex + cindex] = response[0].map(x => {
				return {
					...x,
					address1: x.line1,
					address2: x.line2,				
					countryName: x.country
				}
			});
			if (this.isEditMode) {
				if (data && data.roPartSplitAddressId == 0) {
					this["splitAddressData" + pindex + cindex].push({ legalEntityShippingAddressId: 0, address1: data.roPartSplitAddress1, address2: data.roPartSplitAddress2, city: data.roPartSplitCity, country: data.roPartSplitCountry, postalCode: data.roPartSplitPostalCode, stateOrProvince: data.roPartSplitStateOrProvince });
				}
			} else {
				this.onShipToGetCompanyAddress(this.companySiteList_Shipping[0].legalEntityShippingAddressId);
			}
			if(data) {
			data.poPartSplitAddressId = 0;
			data.partListAddressId = 0;}
		})
	}

	filterSplitVendorNames(event) {
		this.splitVendorNames = this.allActions;
		if (event.query !== undefined && event.query !== null) {
			const vendorNames = [...this.allActions.filter(x => {
				return x.vendorName.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.splitVendorNames = vendorNames;
		}
	}

	onSelectSplitUserType(part, pindex, cindex) {
		part.addressData = [];
		part.partListUserId = {};
		part.partListAddressId = null;
		this["splitAddressData" + pindex + cindex] = [];
	}

	deleteSplitShipment(childata, index, mainindex) {	
		if(childata.repairOrderPartRecordId !== undefined && childata.repairOrderPartRecordId !== null) {
			this.partListData[mainindex].childList = this.partListData[mainindex].childList.map(x => {
				if(x.repairOrderPartRecordId == childata.repairOrderPartRecordId){
					return{...x, isDeleted : true}		
				} else {
					return x;
				}
			});
		} else{
			this.partListData[mainindex].childList.splice(index, 1);
		}
	}

	filterCustomerContactsForShipTo(event) {
		this.firstNamesShipTo = this.shipToContactData;
		if (event.query !== undefined && event.query !== null) {
			const customerContacts = [...this.shipToContactData.filter(x => {
				return x.firstName.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.firstNamesShipTo = customerContacts;
		}
	}

	filterVendorContactsForShipTo(event) {
		this.firstNamesShipTo1 = this.vendorContactsForshipTo;

		if (event.query !== undefined && event.query !== null) {
			const vendorContacts = [...this.vendorContactsForshipTo.filter(x => {
				return x.firstName.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.firstNamesShipTo1 = vendorContacts;	

		}
	}
	filterShippingContacts(event) {
		this.contactListForShippingCompany = this.contactListForCompanyShipping;
		const customerContacts = [...this.contactListForCompanyShipping.filter(x => {
			return x.firstName.toLowerCase().includes(event.query.toLowerCase())
		})]
		this.contactListForShippingCompany = customerContacts;
	}

	filterBillingContact(event) {
		this.contactListForBillingCompany = this.contactListForCompanyBilling;
		const customerContacts = [...this.contactListForCompanyBilling.filter(x => {
			return x.firstName.toLowerCase().includes(event.query.toLowerCase())
		})]
		this.contactListForBillingCompany = customerContacts;
	}

	filterCustomerContactsForBillTo(event) {
		this.firstNamesbillTo = this.billToContactData;

		if (event.query !== undefined && event.query !== null) {
			const customerContacts = [...this.billToContactData.filter(x => {
				return x.firstName.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.firstNamesbillTo = customerContacts;
		}
	}

	filterVendorContactsForBillTo(event) {
		this.firstNamesbillTo1 = this.vendorContactsForBillTO;
		if (event.query !== undefined && event.query !== null) {
			const vendorContacts = [...this.vendorContactsForBillTO.filter(x => {
				return x.firstName.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.firstNamesbillTo1 = vendorContacts;
		}
	}

	// ship to
	onShipToCustomerSelected(customerId, res?, id?, value?) {
		this.clearInputOnClickUserIdShipTo();
		this.shipToSelectedvalue = customerId;
		this.customerService.getCustomerShipAddressGet(customerId).subscribe(
			returnddataforbill => {
				this.shipToCusData = returnddataforbill[0];
				for(var i =0; i < this.shipToCusData.length; i++) {
					if(this.shipToCusData[i].isPrimary && value != 'shipEdit') {
						this.sourceRoApproval.shipToAddressId = this.shipToCusData[i].customerShippingAddressId;
					}
				}
				if (id) {
					res.shipToAddressId = id;
				}
				if (this.isEditMode) {
					if (res.shipToAddressId == 0) {
						this.shipToCusData.push({ customerShippingAddressId: 0, address1: res.shipToAddress1, address2: res.shipToAddress2, city: res.shipToCity, stateOrProvince: res.shipToState, postalCode: res.shipToPostalCode, country: res.shipToCountry, siteName: res.shipToSiteName })
					}
				}
				this.onShipToGetAddress(res, res.shipToAddressId);
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);});
		this.customerService.getContacts(customerId).subscribe(data => {
			this.shipToContactData = data[0];
			for(var i =0; i < this.shipToContactData.length; i++) {
				if(this.shipToContactData[i].isDefaultContact) {
					this.sourceRoApproval.shipToContactId = this.shipToContactData[i];
				}
			}
			if (this.isEditMode && value == 'shipEdit') {
				this.sourceRoApproval.shipToContactId = getObjectById('contactId', res.shipToContactId, this.shipToContactData);
			}
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
		this.getShipViaDetailsForShipTo();
	}

	onShipToVendorSelected(vendorId, res?, id?, value?) {
		this.clearInputOnClickUserIdShipTo();
		this.shipToSelectedvalue = vendorId;
		this.showInput = true;
		this.vendorService.getVendorShipAddressGet(vendorId).subscribe(
			returdaa => {				
				this.vendorSelected = returdaa[0];
				for(var i =0; i < this.vendorSelected.length; i++) {
					if(this.vendorSelected[i].isPrimary && value != 'shipEdit') {
						this.sourceRoApproval.shipToAddressId = this.vendorSelected[i].vendorShippingAddressId;
					}
				}
				if (id) {
					res.shipToAddressId = id;
				}
				if (this.isEditMode && res) {
					if (res.shipToAddressId == 0) {
						this.vendorSelected.push({ vendorShippingAddressId: 0, address1: res.shipToAddress1, address2: res.shipToAddress2, city: res.shipToCity, stateOrProvince: res.shipToState, postalCode: res.shipToPostalCode, country: res.shipToCountry, siteName: res.shipToSiteName })
					}
				}
				if(res) {
					this.onShipToGetAddress(res, res.shipToAddressId);
				} else {
					this.onShipToGetAddress(this.sourceRoApproval, this.sourceRoApproval.shipToAddressId);
				}
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);});
		this.vendorService.getContacts(vendorId).subscribe(data => {
			this.vendorContactsForshipTo = data[0];
			for(var i =0; i < this.vendorContactsForshipTo.length; i++) {
				if(this.vendorContactsForshipTo[i].isDefaultContact) {
					this.sourceRoApproval.shipToContactId = this.vendorContactsForshipTo[i];
				}
			}
			if (this.isEditMode && value == 'shipEdit') {
				this.sourceRoApproval.shipToContactId = getObjectById('contactId', res.shipToContactId, this.vendorContactsForshipTo);
			}
			this.commonService.getShipViaDetailsByModule(this.sourceRoApproval.shipToUserTypeId, vendorId).subscribe(res => {
				this.shipViaList = res;
			})
			this.getShipViaDetailsForShipTo();
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	onShipToCompanySelected(object?, res?, id?) {
		this.clearInputOnClickUserIdShipTo();
		this.shipToSelectedvalue = object ? object.value : this.shipToSelectedvalue;

		this.companyService.getShippingCompanySiteNames(this.shipToSelectedvalue).subscribe(response => {
			this.companySiteList_Shipping = response;
			for(var i =0; i < this.companySiteList_Shipping.length; i++) {
				if(this.companySiteList_Shipping[i].isPrimary) {
					this.sourceRoApproval.shipToAddressId = this.companySiteList_Shipping[i].legalEntityShippingAddressId;
					this.onShipToGetCompanyAddress(this.sourceRoApproval.shipToAddressId);
				}
			}
			if (id) {
				res.shipToAddressId = id;
				this.onShipToGetCompanyAddress(id);
			}
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})
		this.companyService.getCompanyContacts(this.shipToSelectedvalue).subscribe(response => {
			this.contactListForCompanyShipping = response;
			for(var i =0; i < this.contactListForCompanyShipping.length; i++) {
				if(this.contactListForCompanyShipping[i].isDefaultContact) {
					this.sourceRoApproval.shipToContactId = this.contactListForCompanyShipping[i];
				}
			}
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})
		this.getShipViaDetailsForShipTo();
	}

	onShipToGetAddress(data, id) {	
		this.shipToAddress = {};

		if (data.shipToUserTypeId == this.customerModuleId || data.shipToUserType == this.customerModuleId) {
			this.shipToAddress = getObjectById('customerShippingAddressId', id, this.shipToCusData);
		} else if (data.shipToUserTypeId == this.vendorModuleId || data.shipToUserType == this.vendorModuleId) {
			this.shipToAddress = getObjectById('vendorShippingAddressId', id, this.vendorSelected);
		}
		this.shipToAddress = { ...this.shipToAddress, country: this.shipToAddress.countryName ? this.shipToAddress.countryName : this.shipToAddress.country }

	}

	onShipToGetCompanyAddress(id) {
		this.shipToAddress = {};
		this.companyService.getShippingAddress(id).subscribe(res => {
			const resp = res;
			if (resp) {
				this.shipToAddress.address1 = resp.line1;
				this.shipToAddress.address2 = resp.line2;			
				this.shipToAddress.city = resp.city;
				this.shipToAddress.stateOrProvince = resp.stateOrProvince;
				this.shipToAddress.postalCode = resp.postalCode;
				this.shipToAddress.country = getValueFromArrayOfObjectById('label', 'value', resp.countryId, this.allCountriesList);
			} else {
				this.shipToAddress.address1 = '';
				this.shipToAddress.address2 = '';				
				this.shipToAddress.city = '';
				this.shipToAddress.stateOrProvince = '';
				this.shipToAddress.postalCode = '';
				this.shipToAddress.country = '';
			}
		})
	}
	onClickShipMemo() {
		this.addressMemoLabel = 'Edit Ship';
		this.tempMemo = this.sourceRoApproval.shipToMemo;
	}

	onClickApproversMemo(approver) {	
		this.tempApproverObj = approver;
		this.tempApproverMemo = approver.memo;
	}

	onSaveApproversMemo(){
		this.tempApproverObj.memo = this.tempApproverMemo;
	}

	getShipViaDetails(id) {		
		this.sourceRoApproval.shippingAcctNum = null;		
		var userType = this.sourceRoApproval.shipToUserTypeId ? parseInt(this.sourceRoApproval.shipToUserTypeId) : 0;
		const shippingViaId = id ? getValueFromArrayOfObjectById('shippingViaId', 'shipViaId', id, this.shipViaList) : 0;		
		if(shippingViaId != 0) {
			this.commonService.getShipViaDetailsById(shippingViaId, userType).subscribe(res => {
				const responseData = res;
				this.sourceRoApproval.shippingAcctNum = responseData.shippingAccountInfo;				
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);})
		}
        
	}
	onClickShipSiteName(value, data?) {
		this.resetAddressShippingForm();
		if (value === 'AddCusSiteName') {
			this.addressSiteNameHeader = 'Add Ship To Customer Details';
		}
		if (value === 'EditCusSiteName') {
			this.addressSiteNameHeader = 'Edit Ship To Customer Details';
			this.isEditModeShipping = true;
			this.tempshipToAddress = getObjectById('customerShippingAddressId', data.shipToAddressId, this.shipToCusData);
			if (typeof this.tempshipToAddress.country == 'number') {
				this.addressFormForShipping = { ...this.tempshipToAddress, country: getObjectByValue('value', this.tempshipToAddress.country, this.allCountriesList) };
			} else {
				this.addressFormForShipping = { ...this.tempshipToAddress, countryId: getObjectByValue('value', this.tempshipToAddress.countryId, this.allCountriesList) };
			}
		}
		if (value === 'AddVenSiteName') {
			this.addressSiteNameHeader = 'Add Ship To Vendor Details';
		}
		if (value === 'EditVenSiteName') {			
			this.addressSiteNameHeader = 'Edit Ship To Vendor Details';
			this.isEditModeShipping = true;

			this.tempshipToAddress = getObjectById('vendorShippingAddressId', data.shipToAddressId, this.vendorSelected);
			if (typeof this.tempshipToAddress.country == 'number') {
				this.addressFormForShipping = { ...this.tempshipToAddress, country: getObjectByValue('value', this.tempshipToAddress.country, this.allCountriesList) };
			} else {
				this.addressFormForShipping = { ...this.tempshipToAddress, countryId: getObjectByValue('value', this.tempshipToAddress.countryId, this.allCountriesList) };
			}					
		}
		if (value === 'AddComSiteName') {
			this.addressSiteNameHeader = 'Add Ship To Company Details';
		}
		if (value === 'EditComSiteName') {
			this.addressSiteNameHeader = 'Edit Ship To Company Details';
			this.isEditModeShipping = true;
			this.tempshipToAddress = getObjectById('legalEntityShippingAddressId', data.shipToAddressId, this.companySiteList_Shipping);
			if (data.shipToAddressId != 0) {
				this.companyService.getShippingAddress(data.shipToAddressId).subscribe(res => {
					const resp = res;
					const tempShipToAdd:any = {};
					tempShipToAdd.address1 = resp.line1;
					tempShipToAdd.address2 = resp.line2;					
					tempShipToAdd.city = resp.city;
					tempShipToAdd.stateOrProvince = resp.stateOrProvince;
					tempShipToAdd.postalCode = resp.postalCode;
					tempShipToAdd.countryId = resp.countryId;
					this.addressFormForShipping = { ...tempShipToAdd, siteName: this.tempshipToAddress.siteName, legalEntityShippingAddressId: this.tempshipToAddress.legalEntityShippingAddressId };
					if (typeof this.addressFormForShipping.country == 'number') {
						this.addressFormForShipping = { ...this.addressFormForShipping, country: getObjectByValue('value', this.addressFormForShipping.country, this.allCountriesList) };
					} else {
						this.addressFormForShipping = { ...this.addressFormForShipping, countryId: getObjectByValue('value', this.addressFormForShipping.countryId, this.allCountriesList) };
					}
				})

			} else {
				this.addressFormForShipping = { ...this.tempshipToAddress, siteName: this.tempshipToAddress.siteName, legalEntityShippingAddressId: this.tempshipToAddress.legalEntityShippingAddressId };
				if (typeof this.addressFormForShipping.country == 'number') {
					this.addressFormForShipping = { ...this.addressFormForShipping, country: getObjectByValue('value', this.addressFormForShipping.country, this.allCountriesList) };
				} else {
					this.addressFormForShipping = { ...this.addressFormForShipping, country: getObjectByValue('label', this.addressFormForShipping.country, this.allCountriesList) };
				}
			}
		}
	}

	// bill to
	onBillToCustomerSelected(customerId, res?, id?, value?) {	
		this.clearInputOnClickUserIdBillTo();
		this.billToSelectedvalue = customerId;
		this.customerService.getCustomerBillViaDetails(customerId).subscribe(
			returnddataforbill => {
				this.billToCusData = returnddataforbill[0];
				for(var i =0; i < this.billToCusData.length; i++) {
					if(this.billToCusData[i].isPrimary && value != 'billEdit') {
						this.sourceRoApproval.billToAddressId = this.billToCusData[i].customerBillingAddressId;
					}
				}
				if (id) {
					res.billToAddressId = id;
				}
				if (this.isEditMode) {
					if (res && res.billToAddressId == 0) {
						this.billToCusData.push({ customerBillingAddressId: 0, address1: res.billToAddress1, address2: res.billToAddress2, city: res.billToCity, stateOrProvince: res.billToStateOrProvince, postalCode: res.billToPostalCode, country: res.billToCountry, siteName: res.billToSiteName })
					}
				}
				if(res) {
					this.onBillToGetAddress(res, res.billToAddressId);
				} else {
					this.onBillToGetAddress(this.sourceRoApproval, this.sourceRoApproval.billToAddressId);
				}
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);});
		this.customerService.getContacts(customerId).subscribe(data => {
			this.billToContactData = data[0];
			for(var i =0; i < this.billToContactData.length; i++) {
				if(this.billToContactData[i].isDefaultContact) {
					this.sourceRoApproval.billToContactId = this.billToContactData[i];
				}
			}
			if (this.isEditMode && value == 'billEdit') {
				this.sourceRoApproval.billToContactId = getObjectById('contactId', res.billToContactId, this.billToContactData);
			}
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}
	async onBillToVendorSelected(vendorId, res?, id?, value?) {
		this.clearInputOnClickUserIdBillTo();
		this.billToSelectedvalue = vendorId;
		this.showInput = true;
		await this.vendorService.getVendorSiteNames(vendorId).subscribe(
			returdaa => {
				this.vendorSelectedForBillTo = returdaa;
				for(var i =0; i < this.vendorSelectedForBillTo.length; i++) {
					if(this.vendorSelectedForBillTo[i].isPrimary && value != 'billEdit') {
						this.sourceRoApproval.billToAddressId = this.vendorSelectedForBillTo[i].vendorBillingAddressId;
					}
				}
				if (id) {
					res.billToAddressId = id;
					this.onBillToGetAddress(res, res.billToAddressId);
				}
				if (this.isEditMode) {
					if (res && res.billToAddressId == 0) {
						this.vendorSelectedForBillTo.push({ vendorBillingAddressId: 0, siteName: res.billToSiteName });
						this.billToAddress.address1 = res.billToAddress1;
						this.billToAddress.address2 = res.billToAddress2;					
						this.billToAddress.city = res.billToCity;
						this.billToAddress.stateOrProvince = res.billToState;
						this.billToAddress.postalCode = res.billToPostalCode;
						this.billToAddress.country = res.billToCountry;						
					} else {
						if(res) {
							this.onBillToGetAddress(res, res.billToAddressId);
						} else {
							this.onBillToGetAddress(this.sourceRoApproval, this.sourceRoApproval.billToAddressId);
						}
					}
				}
			})
		this.vendorService.getContacts(vendorId).subscribe(
			returdaa => {
				this.vendorContactsForBillTO = returdaa[0];
				for(var i =0; i < this.vendorContactsForBillTO.length; i++) {
					if(this.vendorContactsForBillTO[i].isDefaultContact) {
						this.sourceRoApproval.billToContactId = this.vendorContactsForBillTO[i];
					}
				}
				if (this.isEditMode && value == 'billEdit') {
					this.sourceRoApproval.billToContactId = getObjectById('contactId', res.billToContactId, this.vendorContactsForBillTO);
				}
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);})
	}

	onBillToCompanySelected(object?, response?, id?) {
		this.clearInputOnClickUserIdBillTo();
		this.billToSelectedvalue = object ? object.value : this.billToSelectedvalue;

		this.companyService.getBillingCompanySiteNames(this.billToSelectedvalue).subscribe(res => {
			this.companySiteList_Billing = res;
			for(var i =0; i < this.companySiteList_Billing.length; i++) {
				if(this.companySiteList_Billing[i].isPrimary) {
					this.sourceRoApproval.billToAddressId = this.companySiteList_Billing[i].legalEntityBillingAddressId;
					this.onBillToGetCompanyAddress(this.sourceRoApproval.billToAddressId);
				}
			}
			if (id) {
				response.billToAddressId = id;
				this.onBillToGetCompanyAddress(id);
			}
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})
		this.companyService.getCompanyContacts(this.billToSelectedvalue).subscribe(res => {
			this.contactListForCompanyBilling = res;
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});

		this.commonService.getShipViaDetailsByModule(this.sourceRoApproval.billToUserTypeId, this.billToSelectedvalue).subscribe(res => {
			this.shipViaList = res;
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	onBillToGetAddress(data, id) {	
		if (data.billToUserTypeId == this.customerModuleId || data.billToUserType == this.customerModuleId) {			
			const resp = getObjectById('customerBillingAddressId', id, this.billToCusData);	
			if (resp) {
				this.billToAddress.address1 = resp.address1;
				this.billToAddress.address2 = resp.address2;			
				this.billToAddress.city = resp.city;
				this.billToAddress.stateOrProvince = resp.stateOrProvince;
				this.billToAddress.postalCode = resp.postalCode;
				this.billToAddress.country = resp.countryName ? resp.countryName : resp.country;
			} else {
				this.billToAddress.address1 = '';
				this.billToAddress.address2 = '';				
				this.billToAddress.city = '';
				this.billToAddress.stateOrProvince = '';
				this.billToAddress.postalCode = '';
				this.billToAddress.country = '';
			}			
		} else if (data.billToUserTypeId == this.vendorModuleId || data.billToUserType == this.vendorModuleId) {
			if(id != 0) {
				this.vendorService.getVendorAddressById(id).subscribe(res => {
					const resp = res;
					if (resp) {
						this.billToAddress.addressId = resp.vba.addressId;
						this.billToAddress.address1 = resp.line1;
						this.billToAddress.address2 = resp.line2;						
						this.billToAddress.city = resp.city;
						this.billToAddress.stateOrProvince = resp.stateOrProvince;
						this.billToAddress.postalCode = resp.postalCode;
						this.billToAddress.countryId = resp.countryId;
						this.billToAddress.country = resp.countryId ? getValueFromArrayOfObjectById('label', 'value', resp.countryId, this.allCountriesList) : '';
					} else {
						this.billToAddress.address1 = '';
						this.billToAddress.address2 = '';						
						this.billToAddress.city = '';
						this.billToAddress.stateOrProvince = '';
						this.billToAddress.postalCode = '';
						this.billToAddress.countryId = null;
						this.billToAddress.country = '';
					}
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			} else {
				const resp = getObjectById('vendorBillingAddressId', id, this.vendorSelectedForBillTo);
				if (resp) {
					this.billToAddress.address1 = resp.address1;
					this.billToAddress.address2 = resp.address2;
					this.billToAddress.city = resp.city;
					this.billToAddress.stateOrProvince = resp.stateOrProvince;
					this.billToAddress.postalCode = resp.postalCode;
					this.billToAddress.country = resp.countryName ? resp.countryName : resp.country;
				} else {
					this.billToAddress.address1 = '';
					this.billToAddress.address2 = '';
					this.billToAddress.city = '';
					this.billToAddress.stateOrProvince = '';
					this.billToAddress.postalCode = '';
					this.billToAddress.country = '';
				}
			}
			
		}
	}

	onBillToGetCompanyAddress(id) {
		this.companyService.getBillingAddress(id).subscribe(res => {
			const resp = res;
			if (resp) {
				this.billToAddress.address1 = resp.line1;
				this.billToAddress.address2 = resp.line2;				
				this.billToAddress.city = resp.city;
				this.billToAddress.stateOrProvince = resp.stateOrProvince;
				this.billToAddress.postalCode = resp.postalCode;
				this.billToAddress.country = resp.countryId ? getValueFromArrayOfObjectById('label', 'value', resp.countryId, this.allCountriesList) : '';
			} else {
				this.billToAddress.address1 = '';
				this.billToAddress.address2 = '';				
				this.billToAddress.city = '';
				this.billToAddress.stateOrProvince = '';
				this.billToAddress.postalCode = '';
				this.billToAddress.country = '';
			}
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})
	}

	onClickBillMemo() {
		this.addressMemoLabel = 'Edit Bill';
		this.tempMemo = this.sourceRoApproval.billToMemo;
	}

	onClickBillSiteName(value, data?) {
		this.resetAddressBillingForm();
		if (value === 'AddCusSiteName') {
			this.addressSiteNameHeader = 'Add Bill To Customer Details';
		}
		if (value === 'EditCusSiteName') {
			this.addressSiteNameHeader = 'Edit Bill To Customer Details';
			this.isEditModeBilling = true;
			this.tempbillToAddress = getObjectById('customerBillingAddressId', data.billToAddressId, this.billToCusData);
			if (typeof this.tempbillToAddress.country == 'number') {
				this.addressFormForBilling = { ...this.tempbillToAddress, country: getObjectByValue('value', this.tempbillToAddress.country, this.allCountriesList) };
			} else {
				this.addressFormForBilling = { ...this.tempbillToAddress, countryId: getObjectByValue('value', this.tempbillToAddress.countryId, this.allCountriesList) };
			}
		}
		if (value === 'AddVenSiteName') {
			this.addressSiteNameHeader = 'Add Bill To Vendor Details';
		}
		if (value === 'EditVenSiteName') {
			this.addressSiteNameHeader = 'Edit Bill To Vendor Details';
			this.isEditModeBilling = true;
			this.tempbillToAddress = getObjectById('vendorBillingAddressId', data.billToAddressId, this.vendorSelectedForBillTo);
			this.onBillToGetAddress(data, data.billToAddressId);
			const tempBillToAdd = this.billToAddress;
			this.addressFormForBilling = { ...tempBillToAdd, siteName: this.tempbillToAddress.siteName, vendorBillingAddressId: this.tempbillToAddress.vendorBillingAddressId };
			if (typeof this.addressFormForBilling.country == 'number') {
				this.addressFormForBilling = { ...this.addressFormForBilling, country: getObjectByValue('value', this.addressFormForBilling.country, this.allCountriesList) };
			} else {
				this.addressFormForBilling = { ...this.addressFormForBilling, countryId: getObjectByValue('value', this.addressFormForBilling.countryId, this.allCountriesList) };
			}
		}
		if (value === 'AddComSiteName') {
			this.addressSiteNameHeader = 'Add Bill To Company Details';
		}
		if (value === 'EditComSiteName') {
			this.addressSiteNameHeader = 'Edit Bill To Company Details';
			this.isEditModeBilling = true;
			this.tempbillToAddress = getObjectById('legalEntityBillingAddressId', data.billToAddressId, this.companySiteList_Billing);
			if (data.billToAddressId != 0) {				
				this.companyService.getBillingAddress(data.billToAddressId).subscribe(res => {
					const resp = res;
					const tempBillToAdd:any = {};
					tempBillToAdd.address1 = resp.line1;
					tempBillToAdd.address2 = resp.line2;				
					tempBillToAdd.city = resp.city;
					tempBillToAdd.stateOrProvince = resp.stateOrProvince;
					tempBillToAdd.postalCode = resp.postalCode;
					tempBillToAdd.countryId = resp.countryId;
					this.addressFormForBilling = { ...tempBillToAdd, siteName: this.tempbillToAddress.siteName, legalEntityBillingAddressId: this.tempbillToAddress.legalEntityBillingAddressId };
					if (typeof this.addressFormForBilling.country == 'number') {
						this.addressFormForBilling = { ...this.addressFormForBilling, country: getObjectByValue('value', this.addressFormForBilling.country, this.allCountriesList) };
					} else {
						this.addressFormForBilling = { ...this.addressFormForBilling, countryId: getObjectByValue('value', this.addressFormForBilling.countryId, this.allCountriesList) };
					}
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			} else {
				this.addressFormForBilling = { ...this.tempbillToAddress, siteName: this.tempbillToAddress.siteName, legalEntityBillingAddressId: this.tempbillToAddress.legalEntityBillingAddressId };
				if (typeof this.addressFormForBilling.country == 'number') {
					this.addressFormForBilling = { ...this.addressFormForBilling, country: getObjectByValue('value', this.addressFormForBilling.country, this.allCountriesList) };
				} else {
					this.addressFormForBilling = { ...this.addressFormForBilling, countryId: getObjectByValue('value', this.addressFormForBilling.countryId, this.allCountriesList) };
				}
			}

		}
	}

	private loadManagementdata() {
		this.commonService.getLegalEntityList().subscribe(res => {
            this.maincompanylist = res;
        },err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})
	}

	getBUList(legalEntityId) {
		this.bulist = [];
		this.divisionlist = [];
		this.departmentList = [];
		this.headerInfo.buId = 0;
		this.headerInfo.divisionId = 0;
		this.headerInfo.departmentId = 0;
        if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
            this.headerInfo.managementStructureId = legalEntityId;
            this.commonService.getBusinessUnitListByLegalEntityId(legalEntityId).subscribe(res => {
                this.bulist = res;
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);});
		}
		for (let i = 0; i < this.partListData.length; i++) {
			this.partListData[i].parentCompanyId = legalEntityId;
			this.getParentBUList(this.partListData[i]);			
		}
	}

	getDivisionlist(buId) {
		this.divisionlist = [];
		this.departmentList = [];
		this.headerInfo.divisionId = 0;
		this.headerInfo.departmentId = 0;
        if (buId != 0 && buId != null && buId != undefined) {
            this.headerInfo.managementStructureId = buId;
            this.commonService.getDivisionListByBU(buId).subscribe(res => {
                this.divisionlist = res;
            },err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);})
		}
		
		for (let i = 0; i < this.partListData.length; i++) {
			this.partListData[i].parentbuId = buId;
			this.getParentDivisionlist(this.partListData[i]);			
		}
	}

	getDepartmentlist(divisionId) {
		this.departmentList = [];
		this.headerInfo.departmentId = 0;
        if (divisionId != 0 && divisionId != null && divisionId != undefined) {
            this.headerInfo.managementStructureId = divisionId;
            this.commonService.getDepartmentListByDivisionId(divisionId).subscribe(res => {
                this.departmentList = res;
            },err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);})
		}
		for (let i = 0; i < this.partListData.length; i++) {
			this.partListData[i].parentDivisionId = divisionId;
			this.getParentDeptlist(this.partListData[i]);			
		}
	}

	getDepartmentId(departmentId) {
		if (departmentId != 0 && departmentId != null && departmentId != undefined) {
            this.headerInfo.managementStructureId = departmentId;
		}

		for (let i = 0; i < this.partListData.length; i++) {
			this.partListData[i].parentDeptId = departmentId;
		}
		for (let i = 0; i < this.partListData.length; i++) {
			this.partListData[i].parentDeptId = departmentId;
			this.getParentDeptId(this.partListData[i]);			
		}
	}

	getParentBUList(partList) {
		partList.parentBulist = []
		partList.parentDivisionlist = [];
		partList.parentDepartmentlist = [];
		partList.parentbuId = 0;
		partList.parentDivisionId = 0;
		partList.parentDeptId = 0;

        if (partList.parentCompanyId != 0 && partList.parentCompanyId != null && partList.parentCompanyId != undefined) {
            partList.managementStructureId = partList.parentCompanyId;
            this.commonService.getBusinessUnitListByLegalEntityId(partList.parentCompanyId).subscribe(res => {
                partList.parentBulist = res;
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);});
		}
		if (partList.childList) {
			for (let j = 0; j < partList.childList.length; j++) {
				partList.childList[j].childCompanyId = partList.parentCompanyId;
				this.getChildBUList(partList.childList[j]);
			}
		}
		this.getFunctionalReportCurrencyById(partList);
	}

	getParentDivisionlist(partList) {
		partList.parentDivisionlist = [];
		partList.parentDepartmentlist = [];
		partList.parentDivisionId = 0;
		partList.parentDeptId = 0;

        if (partList.parentbuId != 0 && partList.parentbuId != null && partList.parentbuId != undefined) {
            partList.managementStructureId = partList.parentbuId;
            this.commonService.getDivisionListByBU(partList.parentbuId).subscribe(res => {
                partList.parentDivisionlist = res;
            },err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);})
		}
		if (partList.childList) {
			for (let j = 0; j < partList.childList.length; j++) {
				partList.childList[j].childbuId = partList.parentbuId;
				this.getChildDivisionlist(partList.childList[j]);
			}
		}
		this.getFunctionalReportCurrencyById(partList);
	}

	getParentDeptlist(partList) {
		partList.parentDepartmentlist = [];
		partList.parentDeptId = 0;

        if (partList.parentDivisionId != 0 && partList.parentDivisionId != null && partList.parentDivisionId != undefined) {
            partList.managementStructureId = partList.parentDivisionId;
            this.commonService.getDepartmentListByDivisionId(partList.parentDivisionId).subscribe(res => {
                partList.parentDepartmentlist = res;
            },err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);});
		}
		if (partList.childList) {
			for (let j = 0; j < partList.childList.length; j++) {
				partList.childList[j].childDivisionId = partList.parentDivisionId;
				this.getChildDeptlist(partList.childList[j]);
			}
		}
		this.getFunctionalReportCurrencyById(partList);
	}

	getParentDeptId(partList) {
		if (partList.parentDeptId != 0 && partList.parentDeptId != null && partList.parentDeptId != undefined) {
            partList.managementStructureId = partList.parentDeptId;
		}
		if (partList.childList) {
			for (let j = 0; j < partList.childList.length; j++) {
				partList.childList[j].childDeptId = partList.parentDeptId;
				this.getChildDeptId(partList.childList[j]);
			}
		}
		this.getFunctionalReportCurrencyById(partList);
	}

	getChildBUList(partChildList) {
		partChildList.childBulist = [];
		partChildList.childDivisionlist = [];
		partChildList.childDepartmentlist = [];
		partChildList.childbuId = 0;
		partChildList.childDivisionId = 0;
		partChildList.childDeptId = 0;

        if (partChildList.childCompanyId != 0 && partChildList.childCompanyId != null && partChildList.childCompanyId != undefined) {
            partChildList.managementStructureId = partChildList.childCompanyId;
            this.commonService.getBusinessUnitListByLegalEntityId(partChildList.childCompanyId).subscribe(res => {
                partChildList.childBulist = res;
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);});
		}
	}

	getChildDivisionlist(partChildList) {
		partChildList.childDivisionlist = [];
		partChildList.childDepartmentlist = [];
		partChildList.childDivisionId = 0;
		partChildList.childDeptId = 0;

        if (partChildList.childbuId != 0 && partChildList.childbuId != null && partChildList.childbuId != undefined) {
            partChildList.managementStructureId = partChildList.childbuId;
            this.commonService.getDivisionListByBU(partChildList.childbuId).subscribe(res => {
                partChildList.childDivisionlist = res;
            },err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);})
		}
	}

	getChildDeptlist(partChildList) {
		partChildList.childDepartmentlist = [];
		partChildList.childDeptId = 0;

        if (partChildList.childDivisionId != 0 && partChildList.childDivisionId != null && partChildList.childDivisionId != undefined) {
            partChildList.managementStructureId = partChildList.childDivisionId;
            this.commonService.getDepartmentListByDivisionId(partChildList.childDivisionId).subscribe(res => {
                partChildList.childDepartmentlist = res;
            },err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);});
		}
	}

	getChildDeptId(partChildList) {
		if (partChildList.childDeptId != 0 && partChildList.childDeptId != null && partChildList.childDeptId != undefined) {
            partChildList.managementStructureId = partChildList.childDeptId;
		}
	}

	getFunctionalReportCurrencyById(partList) {
		if(partList.managementStructureId != 0 && partList.managementStructureId != 0) {
			this.commonService.getFunctionalReportCurrencyById(partList.managementStructureId).subscribe(res => {
				partList.functionalCurrencyId = {
					label: res.functionalCurrencyCode,
					value: res.functionalCurrencyId
				}
				partList.reportCurrencyId = {
					label: res.reportingCurrencyCode,
					value: res.reportingCurrencyId
				}
				this.getFXRate(partList);
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);});
		}
	}

	getFXRate(partList, onChange?) {
		if((partList.reportCurrencyId != null || partList.reportCurrencyId != undefined) && (partList.functionalCurrencyId != null || partList.functionalCurrencyId != undefined)) {
			const funcCurrency = editValueAssignByCondition('value', partList.functionalCurrencyId);
			const reportCurrency = editValueAssignByCondition('value', partList.reportCurrencyId);
			if (funcCurrency == reportCurrency) {
				partList.foreignExchangeRate = '1.00000';
				if(onChange == 'onChange') {
					this.alertService.showMessage(
					'Error',
					`FXRate can\'t be greater than 1, if Func CUR and Report CUR are same`,
					MessageSeverity.error);
				}
				return;
			}
			if(partList.foreignExchangeRate) {
				partList.foreignExchangeRate = formatNumberAsGlobalSettingsModule(partList.foreignExchangeRate, 5);
			}
		}
	}

	private onDataLoadFailed(error: any) { 
		this.isSpinnerVisible = false;
	}	
	loadConditionData() {
		this.commonService.smartDropDownList('Condition', 'ConditionId', 'Description').subscribe(response => {
			this.allconditioninfo = response;
			this.allconditioninfo.map(x => {
				if(x.label == 'New') {
					this.defaultCondtionId = x.value;
					this.newObjectForParent.conditionId = x.value;
				}
			});
			if(this.stocklineReferenceData != null && this.stocklineReferenceData != undefined) {
				for(let i = 0; i< this.allconditioninfo.length; i++){
					if(this.allconditioninfo[i].value == this.stocklineReferenceData.conditionId){
						this.newObjectForParent.conditionId = this.allconditioninfo[i].value;
						this.newObjectForParent.itemMasterId = this.stocklineReferenceData.itemMasterId;
						this.getPriceDetailsByCondId(this.newObjectForParent);
						this.getStockLineByItemMasterId(this.newObjectForParent);
					}
				}
			}
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});		
	}

	loadROStatus() {
		this.commonService.smartDropDownList('ROStatus', 'ROStatusId', 'Description').subscribe(response => {
			this.roStatusList = response;
			this.roStatusList = this.roStatusList.sort((a,b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
			response.forEach(x => {
                if (x.label.toUpperCase() == "OPEN") {
                    this.headerInfo.statusId = x.value;
                }
                else if (x.label.toUpperCase()  == "FULFILLING") {
                    this.roFulfillingstatusID = x.value;
                }
            });
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	loadROApproverStatus() {
		this.commonService.smartDropDownList('ApprovalStatus', 'ApprovalStatusId', 'Name').subscribe(response => {
			 this.roApproverStatusList = response;			
			 this.roApproverStatusList = this.roApproverStatusList.sort((a,b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}



	ifSplitShipment(partList, event) {
		if (partList.ifSplitShip) {
			if (partList.partNumberId !== null && partList.partNumberId !== undefined) {
				//if(partList.childList.length == 0) {
				this.addRow(partList);
				//}
			} else {				
				this.alertService.showStickyMessage("Validation failed", "Please select Part Number!", MessageSeverity.error, 'Please enter Qty');
				event.target.checked = false;
				partList.ifSplitShip = false;
			}
		} else {
			partList.childList = [];
		}
	}

	addAvailableParts() {
		this.tempNewPNArray = [];
		let newParentObject = new CreatePOPartsList()
		if (this.newData) {
			const data = this.newData.map(x => {
				if (x.addAllMultiPNRows) {

					const newObject = {
						...newParentObject,
						partNumberId: {value: x.itemMasterId, label: x.partNumber},
						needByDate: this.headerInfo.needByDate,
						conditionId: this.defaultCondtionId,
						priorityId: this.headerInfo.priorityId ? editValueAssignByCondition('value', this.headerInfo.priorityId) : null,
						discountPercent: null
					}
					this.getManagementStructureForParentEdit(newObject);
					this.getPNDetailsById(newObject);
					this.getPriceDetailsByCondId(newObject);
					this.getStockLineByItemMasterId(newObject);
					this.partListData = [...this.partListData, newObject]
				}
			})

			for (let i = 0; i < this.partListData.length; i++) {
				if (!this.partListData[i].ifSplitShip) {
					this.partListData[i].childList = [];
				}
			}
		}
		this.partNumbers = null;
		this.addAllMultiPN = false;
	}

	onChangeAddAllMultiPN(event) {
		if (event.target.checked) {
			if (this.newData) {
				for (let i = 0; i < this.newData.length; i++) {
					this.newData[i].addAllMultiPNRows = true;
				}
			}		
		} else {
			if (this.newData) {
				for (let i = 0; i < this.newData.length; i++) {
					this.newData[i].addAllMultiPNRows = false;
				}
			}		
		}
		this.onChangeAddEachMultiPN();
	}

	onChangeAddEachMultiPN() {
		if(this.newData) {
			for(let i=0; i < this.newData.length; i++) {
				if(this.newData[i].addAllMultiPNRows) {
					this.enableMultiPartAddBtn = true;
					break;
				} else {
					this.enableMultiPartAddBtn = false;
				}
			}
		}
	}

	onAddMultParts() {
		this.partNumbers = null;
		this.newPNList = [];
		this.newData = [];
		this.addAllMultiPN = false;
		this.enableMultiPartAddBtn = false;
	}

	addPartNumber() {
		this.inputValidCheck = false;
		if (this.vendorService.isEditMode == false) {
			let newParentObject = new CreatePOPartsList();
			newParentObject = {
				...newParentObject, 
				needByDate: this.headerInfo.needByDate,
				priorityId: this.headerInfo.priorityId ? editValueAssignByCondition('value', this.headerInfo.priorityId) : null,
				conditionId: this.defaultCondtionId,
				discountPercent: null
			}
			this.partListData.push(newParentObject); 		
			for (let i = 0; i < this.partListData.length; i++) {
				if (!this.partListData[i].ifSplitShip) {
					this.partListData[i].childList = [];
				}
			}
			if (this.headerInfo.companyId) {
				for (let i = 0; i < this.partListData.length; i++) {
					if (i == this.partListData.length - 1) {
						this.partListData[i].parentCompanyId = this.headerInfo.companyId;
						this.getParentBUList(this.partListData[i]);
					}
				}
			}
			if (this.headerInfo.buId) {
				for (let i = 0; i < this.partListData.length; i++) {
					if (i == this.partListData.length - 1) {
						this.partListData[i].parentbuId = this.headerInfo.buId;
						this.getParentDivisionlist(this.partListData[i]);
					}
				}
			}
			if (this.headerInfo.divisionId) {
				for (let i = 0; i < this.partListData.length; i++) {
					if (i == this.partListData.length - 1) {
						this.partListData[i].parentDivisionId = this.headerInfo.divisionId;
						this.getParentDeptlist(this.partListData[i]);
					}
				}
			}
			if (this.headerInfo.departmentId) {
				for (let i = 0; i < this.partListData.length; i++) {
					if (i == this.partListData.length - 1) {
						this.partListData[i].parentDeptId = this.headerInfo.departmentId;
						this.getParentDeptId(this.partListData[i]);
					}
				}
			}
		}
	}

	getAllparts() {
		this.arraySearch = this.partNumbers;		
		this.newData = [];
		this.newPNList = [];

		if (this.arraySearch.length > 0) {
			this.itemser.getPartDetailsByid(this.arraySearch).subscribe(data => {				
				this.newData = data.multiParts.map(x => {
					return {
						...x,
						addAllMultiPNRows: false
					}
				})
				this.newPNList = data.partsNotFound;
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);});
		}
	}

	addRow(partList) {
		let childPart = new PartDetails();
		childPart = {
			...childPart,
			needByDate: partList.needByDate ? partList.needByDate : null,
			priorityId: partList.priorityId ? getValueFromArrayOfObjectById('label', 'value', partList.priorityId, this.allPriorityInfo) : null
		}
		partList.childList.push(childPart);
		if (partList.parentCompanyId) {
			for (let i = 0; i < partList.childList.length; i++) {
				if (i == partList.childList.length - 1) {
					partList.childList[i].childCompanyId = partList.parentCompanyId;
					this.getChildBUList(partList.childList[i]);
				}
			}
		}
		if (partList.parentbuId) {
			for (let i = 0; i < partList.childList.length; i++) {
				if (i == partList.childList.length - 1 && partList.childList[i].childCompanyId !== 0) {
					partList.childList[i].childbuId = partList.parentbuId;
					this.getChildDivisionlist(partList.childList[i]);
				}
			}
		}
		if (partList.parentDivisionId) {
			for (let i = 0; i < partList.childList.length; i++) {
				if (i == partList.childList.length - 1 && partList.childList[i].childbuId !== 0) {
					partList.childList[i].childDivisionId = partList.parentDivisionId;
					this.getChildDeptlist(partList.childList[i]);
				}
			}
		}
		if (partList.parentDeptId) {
			for (let i = 0; i < partList.childList.length; i++) {
				if (i == partList.childList.length - 1 && partList.childList[i].childDivisionId !== 0) {
					partList.childList[i].childDeptId = partList.parentDeptId;
					this.getChildDeptId(partList.childList[i]);
				}
			}
		}
	}


	getAddRowCompanyId(partList) {
		for (let i = 0; i < partList.childList.length; i++) {
			if (i == partList.childList.length - 1) {
				partList.childList[i].childCompanyId = partList.parentCompanyId;
				this.getChildBUList(partList.childList[i]);
			}
		}
	}

	getAddRowBUId(partList) {
		for (let i = 0; i < partList.childList.length; i++) {
			if (i == partList.childList.length - 1 && partList.childList[i].childCompanyId !== 0) {
				partList.childList[i].childbuId = partList.parentbuId;
				this.getChildDivisionlist(partList.childList[i]);
			}
		}
	}

	getAddRowDivisionId(partList) {
		for (let i = 0; i < partList.childList.length; i++) {
			if (i == partList.childList.length - 1 && partList.childList[i].childbuId !== 0) {
				partList.childList[i].childDivisionId = partList.parentDivisionId;
				this.getChildDeptlist(partList.childList[i]);
			}
		}
	}

	getAddRowDeptId(partList) {
		for (let i = 0; i < partList.childList.length; i++) {
			if (i == partList.childList.length - 1 && partList.childList[i].childDivisionId !== 0) {
				partList.childList[i].childDeptId = partList.parentDeptId;
				this.getChildDeptId(partList.childList[i]);
			}
		}
	}

	private loadCurrencyData() {
		this.commonService.smartDropDownList('Currency', 'CurrencyId', 'Code').subscribe(res => {
			this.allCurrencyData = res;
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	clearInputShipTo() {
		this.sourceRoApproval.shipToUserId = null;
		this.sourceRoApproval.shipToAddressId = 0;
		this.sourceRoApproval.shipToContactId = null;
		this.sourceRoApproval.shipToMemo = '';
		this.sourceRoApproval.shipViaId = 0;
		this.sourceRoApproval.shippingCost = null;
		this.sourceRoApproval.handlingCost = null;
		this.sourceRoApproval.shippingAcctNum = null;	
		this.shipToAddress = {};
		this.shipViaList = [];
		this.shipToCusData = [];
		this.vendorSelected = [];
		this.companySiteList_Shipping = [];
	}

	clearInputOnClickUserIdShipTo() {
		this.sourceRoApproval.shipToAddressId = 0;
		this.sourceRoApproval.shipToContactId = null;
		this.sourceRoApproval.shipToMemo = '';
		this.sourceRoApproval.shipViaId = 0;
		this.sourceRoApproval.shippingCost = null;
		this.sourceRoApproval.handlingCost = null;
		this.sourceRoApproval.shippingAcctNum = null;		
		this.shipToAddress = {};
		this.shipViaList = [];
		this.shipToCusData = [];
		this.vendorSelected = [];
		this.companySiteList_Shipping = [];
	}

	clearInputBillTo() {
		this.sourceRoApproval.billToUserId = null;
		this.sourceRoApproval.billToAddressId = 0;
		this.sourceRoApproval.billToContactId = null;
		this.billToAddress = {};
		this.sourceRoApproval.billToMemo = '';
		this.billToCusData = [];
		this.vendorSelectedForBillTo = [];
		this.companySiteList_Billing = [];
	}

	clearInputOnClickUserIdBillTo() {
		this.sourceRoApproval.billToAddressId = 0;
		this.sourceRoApproval.billToContactId = null;
		this.billToAddress = {};
		this.sourceRoApproval.billToMemo = '';
		this.billToCusData = [];
		this.vendorSelectedForBillTo = [];
		this.companySiteList_Billing = [];
	}

	clearShipToContact() {
		this.sourceRoApproval.shipToContactId = null;
	}

	clearBillToContact() {
		this.sourceRoApproval.billToContactId = null;
	}

	eventHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
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
	}

	filterVendorNames(event) {
		this.vendorNames = this.allActions;
		if (event.query !== undefined && event.query !== null) {
			const vendorFilter = [...this.allActions.filter(x => {
				return x.vendorName.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.vendorNames = vendorFilter;		}
	}

	selectedVendorName(value) {
		this.vendorContactList = [];
		this.getVendorContactsListByID(value.vendorId);
		this.getVendorCreditTermsByID(value.vendorId);
		this.getVendorCapesByID(value.vendorId);
		this.headerInfo.vendorName = value.vendorName;
		this.headerInfo.vendorId = getObjectById('vendorId', value.vendorId, this.allActions);
		this.headerInfo.vendorCode = getObjectById('vendorId', value.vendorId, this.allActions);
		this.warnings(value.vendorId);
			
	}

	onChangeVendorContact(value) {
		this.headerInfo.vendorContactId = value;
		this.headerInfo.vendorContactPhone = value;
	}

	getVendorCapesByID(vendorId) {
		const status = 'active';
        if(vendorId != undefined) {
			this.isSpinnerVisible = true;
            this.vendorService.getVendorCapabilityList(status, vendorId).subscribe(     
                results => this.onDataLoadVendorCapsSuccessful(results[0]),
                error => this.onDataLoadFailed(error)
            );
        }		
	}
	public onDataLoadVendorCapsSuccessful(allWorkFlows: any[]) { 
		this.vendorCapesInfo = allWorkFlows;
		this.vendorCapesInfo = allWorkFlows.map(x => {
			return {
				...x,
				cost: x.cost ? formatNumberAsGlobalSettingsModule(x.cost, 2) : '0.00'
			}
		});
		this.isSpinnerVisible = false;
	}
	
	getVendorCreditTermsByID(vendorId) {
		this.headerInfo.creditLimit = '0.00';
		this.headerInfo.creditTerms = '';
		this.vendorService.getVendorCreditTermsByVendorId(vendorId).subscribe(res => {
			if(res) {
			this.headerInfo.creditLimit = res.creditLimit ? formatNumberAsGlobalSettingsModule(res.creditLimit, 2) : '0.00';
			this.headerInfo.creditTermsId = res.creditTermsId;
			this.headerInfo.creditTerms = res.creditTerms;
		}},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})
	}

	filterVendorContacts(event) {
		this.vendorContactsHeader = this.vendorContactList;

		if (event.query !== undefined && event.query !== null) {
			const vendorFilter = [...this.vendorContactList.filter(x => {
				return x.vendorContact.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.vendorContactsHeader = vendorFilter;
		}
	}

	filterVendorPhone(event) {
		this.vendorPhoneNum = this.vendorContactList;

		if (event.query !== undefined && event.query !== null) {
			const vendorPhone = [...this.vendorContactList.filter(x => {
				return x.workPhone;
			})]
			this.vendorPhoneNum = vendorPhone;
		}
	}

	filterPriorityNames(event) {
		this.allPriorityDetails = this.allPriorityInfo;

		if (event.query !== undefined && event.query !== null) {
			const priority = [...this.allPriorityInfo.filter(x => {
				return x.label.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.allPriorityDetails = priority;
		}
	}

	filterCond(event) {
		this.conditionList = this.allconditioninfo;
		if (event.query !== undefined && event.query !== null) {
			const condlist = [...this.allconditioninfo.filter(x => {
				return x.description.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.conditionList = condlist;
		}
	}

	filterFunctionalCurrency(event) {
		this.functionalCurrList = this.allCurrencyData;
		if (event.query !== undefined && event.query !== null) {
			const funcCurrlist = [...this.allCurrencyData.filter(x => {
				return x.label.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.functionalCurrList = funcCurrlist;
		}
	}

	filterTransCurrency(event) {
		this.functionalTransList = this.allCurrencyData;
		if (event.query !== undefined && event.query !== null) {
			const transCurrlist = [...this.allCurrencyData.filter(x => {
				return x.label.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.functionalTransList = transCurrlist;
		}
	}
	filterCountries(event) {
		this.countriesList = this.allCountriesList;
		if (event.query !== undefined && event.query !== null) {
			const countries = [...this.allCountriesList.filter(x => {
				return x.label.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.countriesList = countries;
		}
	}

	filterWorkOrderList(event) {
		this.allWorkOrderDetails = this.allWorkOrderInfo;
		if (event.query !== undefined && event.query !== null) {
			const wo = [...this.allWorkOrderInfo.filter(x => {
				return x.label.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.allWorkOrderDetails = wo;
		}
	}

	filterSalesOrderList(event) {
		this.allSalesOrderDetails = this.allSalesOrderInfo;
		if (event.query !== undefined && event.query !== null) {
			const so = [...this.allSalesOrderInfo.filter(x => {
				return x.label.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.allSalesOrderDetails = so;
		}
	}

	filterStocklineNum(event, partsList) {
		partsList.allStocklineDetails = partsList.allStocklineInfo;

		if (event.query !== undefined && event.query !== null) {
			const stockline = [...partsList.allStocklineInfo.filter(x => {
				return x.stockLineNumber.toLowerCase().includes(event.query.toLowerCase())
			})]
			partsList.allStocklineDetails = stockline;
		}
	}

	private loadPercentData() {
		this.commonService.smartDropDownList('[Percent]', 'PercentId', 'PercentValue').subscribe(res => {
			const data = res.map(x => {
				return {
					percentId: x.value,
					percentValue: x.label
				}
			});
			this.allPercentData = [
				{percentId: null, percentValue: 'Select'}
			];
			this.allPercentData = [...this.allPercentData, ...data];
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})
	}	
	loadVendorList() {
		this.vendorService.getVendorNameCodeList().subscribe(res => {
			this.allActions = res;
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	filterVendorCodes(event) {
		this.vendorCodes = this.allActions;

		if (event.query !== undefined && event.query !== null) {
			const vendorCodesTemp = [...this.allActions.filter(x => {
				return x.vendorCode.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.vendorCodes = vendorCodesTemp;
		}
	}

	filterRequisitioner(event) {
		this.requisitionerList = this.allEmployeeList;

		if (event.query !== undefined && event.query !== null) {
			const empFirstName = [...this.allEmployeeList.filter(x => {
				return x.label;
			})]
			this.requisitionerList = empFirstName;
		}
	}

	filterApprover(event) {
		this.approverList = this.allEmployeeList;

		if (event.query !== undefined && event.query !== null) {
			const empFirstName = [...this.allEmployeeList.filter(x => {
				return x.label;
			})]
			this.approverList = empFirstName;
		}
	}

	employeedata() {
		this.commonService.smartDropDownList('Employee', 'employeeId', 'firstName').subscribe(res => {
			this.allEmployeeList = res;
			this.currentUserEmployeeName = getValueFromArrayOfObjectById('label', 'value', this.employeeId, res);
			if(!this.isEditMode) {
				this.getRequisitionerOnLoad(this.employeeId);
			}
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	onDelPNRow(partList, index) {		
		if(partList.repairOrderPartRecordId !== undefined && partList.repairOrderPartRecordId !== null) {
			this.partListData = this.partListData.map(x => {
				if(x.repairOrderPartRecordId == partList.repairOrderPartRecordId){
					return{...x, isDeleted : true}		
				} else {
					return x;
				}
			});
		} else{
			this.partListData.splice(index, 1);
		}
		if(this.partListData.length == 1) {
			this.partListData.map(x => {
				if(x.isDeleted) {
					this.totalExtCost = '0.00';
					this.totalDiscAmount = '0.00';
				}
			})
		}
	}

	onSaveAddressMemo() {
		if (this.addressMemoLabel == 'Edit Ship') {
			this.sourceRoApproval.shipToMemo = this.tempMemo;
		}
		if (this.addressMemoLabel == 'Edit Bill') {
			this.sourceRoApproval.billToMemo = this.tempMemo;
		}
	}

	onAddMemo() {
		this.headerMemo = this.headerInfo.roMemo;
	}
	onSaveMemo() {
		this.headerInfo.roMemo = this.headerMemo;
		this.enableHeaderSaveBtn = true;
	}

	onAddNotes() {
		this.headerNotes = this.headerInfo.notes;
	}
	onSaveNotes() {
		this.headerInfo.notes = this.headerNotes;
		this.enableHeaderSaveBtn = true;
	}

	onSelectNeedByDate() {
		this.needByTempDate = this.headerInfo.needByDate;
		if (this.partListData) {
			for (let i = 0; i < this.partListData.length; i++) {
				this.partListData[i].needByDate = this.needByTempDate;
			}
		}

		for (let i = 0; i < this.partListData.length; i++) {
			if (this.partListData[i].childList) {
				if (this.partListData[i].childList.length > 0) {
					for (let j = 0; j < this.partListData[i].childList.length; j++) {
						this.partListData[i].childList[j].needByDate = this.needByTempDate;
					}
				}
			}
		}		
	}

	onSelectPriority() {
		if (this.partListData) {
			for (let i = 0; i < this.partListData.length; i++) {
				if(!this.partListData[i].isApproved) {
					this.partListData[i].priorityId = this.headerInfo.priorityId ? editValueAssignByCondition('value', this.headerInfo.priorityId) : null;
				}
			}

			for (let i = 0; i < this.partListData.length; i++) {
				if (this.partListData[i].childList) {
					if (this.partListData[i].childList.length > 0) {
						for (let j = 0; j < this.partListData[i].childList.length; j++) {
							if(!this.partListData[i].isApproved) {
								this.partListData[i].childList[j].priorityId = this.headerInfo.priorityId ? editValueAssignByCondition('label', this.headerInfo.priorityId) : null;
							}
						}
					}
				}
			}
		}
	}

	onGetDiscPerUnit(partList) {
		if (partList.vendorListPrice !== null) {
			let discountPercentValue;
			if(partList.discountPercent !== null) {
				discountPercentValue = parseFloat(getValueFromArrayOfObjectById('percentValue', 'percentId', partList.discountPercent, this.allPercentData));
			} else {
				discountPercentValue = 0;
			}
			const vendorListPrice = partList.vendorListPrice ? parseFloat(partList.vendorListPrice.toString().replace(/\,/g,'')) : 0;
			const discountPerUnit = (vendorListPrice * discountPercentValue) / 100;
			partList.discountPerUnit = formatNumberAsGlobalSettingsModule(discountPerUnit, 2);
		}
		this.onGetUnitCost(partList);
		partList.quantityOrdered = partList.quantityOrdered ? formatNumberAsGlobalSettingsModule(partList.quantityOrdered, 0) : '0';
		partList.vendorListPrice = partList.vendorListPrice ? formatNumberAsGlobalSettingsModule(partList.vendorListPrice, 2) : '0.00';
	}

	onGetDiscPerUnitByUnitCost(partList) {
		partList.unitCost = partList.unitCost ? formatNumberAsGlobalSettingsModule(partList.unitCost, 2) : '0.00';
		if (partList.vendorListPrice !== null && partList.vendorListPrice !== undefined) {
			const quantityOrdered = partList.quantityOrdered ? parseInt(partList.quantityOrdered.toString().replace(/\,/g,'')) : 0;
			const vendorListPrice = partList.vendorListPrice ? parseFloat(partList.vendorListPrice.toString().replace(/\,/g,'')) : 0;
			let unitCost = partList.unitCost ? parseFloat(partList.unitCost.toString().replace(/\,/g,'')) : 0;
			if(unitCost > vendorListPrice) {
				this.alertService.showMessage(
					'Error',
					`Unit Cost cannot be greater than Vend List Price`,
					MessageSeverity.error);
				unitCost = 0;
				partList.unitCost = '0.00';				
			}
			const discountPerUnit  = (vendorListPrice - unitCost);
			partList.discountPerUnit = discountPerUnit ? formatNumberAsGlobalSettingsModule(discountPerUnit, 2) : '0.00';
			partList.extendedCost = (quantityOrdered * unitCost);
			partList.extendedCost = formatNumberAsGlobalSettingsModule(partList.extendedCost, 2);
			this.onGetDiscPercent(partList);
			this.getTotalExtCost();
		}
	}

	onGetUnitCost(partList) {
		if (partList.vendorListPrice !== null && partList.vendorListPrice !== undefined) {
			const vendorListPrice = partList.vendorListPrice ? parseFloat(partList.vendorListPrice.toString().replace(/\,/g,'')) : 0;
			const discountPerUnit = partList.discountPerUnit ? parseFloat(partList.discountPerUnit.toString().replace(/\,/g,'')) : 0;
			const unitCost = (vendorListPrice - discountPerUnit);
			partList.unitCost = formatNumberAsGlobalSettingsModule(unitCost, 2);
		}
	}	

	onGetDiscAmount(partList) {
		if (partList.discountPerUnit !== null && partList.quantityOrdered !== null) {
			const discountPerUnit = partList.discountPerUnit ? parseFloat(partList.discountPerUnit.toString().replace(/\,/g,'')) : 0;
			const quantityOrdered = partList.quantityOrdered ? parseInt(partList.quantityOrdered.toString().replace(/\,/g,'')) : 0;
			const discountAmount = (discountPerUnit * quantityOrdered);
			partList.discountAmount = formatNumberAsGlobalSettingsModule(discountAmount, 2);
		}
		this.onGetExtCost(partList);
		partList.discountPerUnit = partList.discountPerUnit ? formatNumberAsGlobalSettingsModule(partList.discountPerUnit, 2) : '0.00';
		this.getTotalDiscAmount();
	}

	onGetExtCost(partList) {
		this.onGetUnitCost(partList);
		if (partList.quantityOrdered !== null && partList.unitCost !== null) {
			const quantityOrdered = partList.quantityOrdered ? parseInt(partList.quantityOrdered.toString().replace(/\,/g,'')) : 0;
			const unitCost = partList.unitCost ? parseFloat(partList.unitCost.toString().replace(/\,/g,'')) : 0;
			partList.extendedCost = (quantityOrdered * unitCost);
			partList.extendedCost = formatNumberAsGlobalSettingsModule(partList.extendedCost, 2);
		}	
		this.getTotalExtCost();
	}

	getTotalExtCost() {
		this.totalExtCost = 0;
		this.partListData.map(x => {			
			x.tempExtCost = x.extendedCost ? parseFloat(x.extendedCost.toString().replace(/\,/g,'')) : 0;
			this.totalExtCost += x.tempExtCost;
		})
		this.totalExtCost = this.totalExtCost ? formatNumberAsGlobalSettingsModule(this.totalExtCost, 2) : '0.00';
	}	
	getTotalDiscAmount() {
		this.totalDiscAmount = 0;
		this.partListData.map(x => {			
			x.tempDiscAmt = x.discountAmount ? parseFloat(x.discountAmount.toString().replace(/\,/g,'')) : 0;
			this.totalDiscAmount += x.tempDiscAmt;
		})
		this.totalDiscAmount = this.totalDiscAmount ? formatNumberAsGlobalSettingsModule(this.totalDiscAmount, 2) : '0.00';
	}	

	onGetDiscPercent(partList) {
		if (partList.vendorListPrice !== null && partList.vendorListPrice !== undefined && partList.vendorListPrice !== '0.00') {
			const discountPerUnit = partList.discountPerUnit ? parseFloat(partList.discountPerUnit.toString().replace(/\,/g,'')) : 0;
			const vendorListPrice = partList.vendorListPrice ? parseFloat(partList.vendorListPrice.toString().replace(/\,/g,'')) : 0;
			const discountPercentValue = Math.round((discountPerUnit * 100) / vendorListPrice).toFixed(2);
			partList.discountPercent = getObjectByValue('percentValue', discountPercentValue, this.allPercentData);
			partList.discountPercent = partList.discountPercent.percentId;
		}
	}

	async getVendorContactsListByID(vendorId) {
		await this.vendorService.getVendorContactDataByVendorId(vendorId).subscribe(data => {
			this.vendorContactList = data;
			const isDefaultContact = this.vendorContactList.filter(x => {
				if (x.isDefaultContact === true) {
					return x;
				} else return x;
			})
			this.headerInfo.vendorContactId = isDefaultContact[0];
			this.headerInfo.vendorContactPhone = isDefaultContact[0];
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})
	}

	async getVendorContactsListByIDEdit(res) {
		await this.vendorService.getVendorContactDataByVendorId(res.vendorId).subscribe(data => {
			this.vendorContactList = data;
			const isContact = this.vendorContactList.filter(x => {
				if (x.vendorContactId === res.vendorContactId) {
					return x;
				}
			})
			this.headerInfo.vendorContactId = isContact[0];
			this.headerInfo.vendorContactPhone = isContact[0];
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	getAltEquiPartNumByObject(obj) {
		if (obj.altEquiPartNumberId) {
			return obj.altEquiPartNumberId;
		}
	}

	getIdByObject(obj) {
		if (obj.customerId) {
			return obj.customerId;
		}
		if (obj.vendorId) {
			return obj.vendorId;
		}
		if (obj.value) {
			return obj.value;
		}
	}

	getCurrencyIdByObject(obj) {
		if (obj.value) {
			return obj.value;
		}
	}

	getShipToBillToUserId(obj) {
		if (obj.vendorId) {
			return obj.vendorId;
		}
		if (obj.customerId) {
			return obj.customerId;
		}
		if (obj.value) {
			return obj.value;
		}
	}

	getValueByObj(obj) {
		if (obj.value) {
			return obj.value;
		} else {
			return 0;
		}
	}

	getValueByStocklineObj(obj) {
		if (obj.stockLineId) {
			return obj.stockLineId;
		} else {
			return 0;
		}
	}

	getValueFromObj(obj) {
		if (obj.value) {
			return obj.value;
		} else {
			return null;
		}
	}

	getShipBillContactId(obj) {
		if (obj.contactId) {
			return obj.contactId;
		} else {
			return 0;
		}
	}

	getVendorContactId(obj) {
		if (obj.vendorContactId) {
			return obj.vendorContactId;
		} else {
			return 0;
		}
	}

	getVendorContactPhone(obj) {
		if (obj.vendorPhone) {
			return obj.vendorPhone;
		} else {
			return 0;
		}
	}

	getPriorityId(obj) {
		if (obj.value) {
			return obj.value;
		} else {
			return 0;
		}
	}

	getVendorId(obj) {
		if (obj.vendorId) {
			return obj.vendorId;
		} else {
			return 0;
		}
	}

	getShipViaDetailsForShipTo(id?) {
		this.commonService.getShipViaDetailsByModule(this.sourceRoApproval.shipToUserTypeId, this.shipToSelectedvalue).subscribe(response => {
			this.shipViaList = response;
			for(var i =0; i < this.shipViaList.length; i++) {
				if(this.shipViaList[i].isPrimary) {
					this.sourceRoApproval.shipViaId = this.shipViaList[i].shipViaId;
					this.getShipViaDetails(this.sourceRoApproval.shipViaId);
				}
			}
			if (id) {
				this.sourceRoApproval.shipViaId = id;
				this.getShipViaDetails(id);
			}
		})
	}

	resetAddressShippingForm() {
		this.addressFormForShipping = new CustomerShippingModel();
		this.isEditModeShipping = false;
	}

	resetAddressBillingForm() {
		this.addressFormForBilling = new CustomerShippingModel();
		this.isEditModeBilling = false;
	}

	async saveShippingAddress() {
		const data = {
			...this.addressFormForShipping,
			createdBy: this.userName,
			updatedBy: this.userName,
			masterCompanyId: this.currentUserMasterCompanyId,
			isActive: true,
		}
		if (this.sourceRoApproval.shipToUserTypeId == this.customerModuleId) {
			const customerData = { ...data, isPrimary: true, customerId: getValueFromObjectByKey('value', this.sourceRoApproval.shipToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
			if (!this.isEditModeShipping) {
				await this.customerService.newShippingAdd(customerData).subscribe(response => {
					this.onShipToCustomerSelected(customerData.customerId, this.sourceRoApproval, response.customerShippingId);
					this.enableAddSaveBtn = true;
					// this.addressFormForShipping = new CustomerShippingModel()
					this.alertService.showMessage(
						'Success',
						`Saved Shipping Information Successfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			} else {
				await this.customerService.newShippingAdd(customerData).subscribe(response => {
					this.onShipToCustomerSelected(customerData.customerId, this.sourceRoApproval, response.customerShippingId);
					this.enableAddSaveBtn = true;
					this.alertService.showMessage(
						'Success',
						`Updated Shipping Information Successfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			}
		}
		if (this.sourceRoApproval.shipToUserTypeId == this.vendorModuleId) {
			const vendorData = { ...data, vendorId: getValueFromObjectByKey('vendorId', this.sourceRoApproval.shipToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
			if (!this.isEditModeShipping) {
				await this.vendorService.newShippingAdd(vendorData).subscribe(response => {
					this.onShipToVendorSelected(vendorData.vendorId, this.sourceRoApproval, response.vendorShippingAddressId);
					this.enableAddSaveBtn = true;				
					this.alertService.showMessage(
						'Success',
						`Saved Shipping Information Successfully `,
						MessageSeverity.success
					);

				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			} else {
				await this.vendorService.newShippingAdd(vendorData).subscribe(response => {
					this.onShipToVendorSelected(vendorData.vendorId, this.sourceRoApproval, response.vendorShippingAddressId);
					this.enableAddSaveBtn = true;
					this.alertService.showMessage(
						'Success',
						`Updated Shipping Information Successfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			}
		}
		if (this.sourceRoApproval.shipToUserTypeId == this.companyModuleId) {
			const companyData = { ...data, legalentityId: getValueFromObjectByKey('value', this.sourceRoApproval.shipToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
			if (!this.isEditModeShipping) {
				await this.companyService.addNewShippingAddress(companyData).subscribe(response => {
					this.onShipToCompanySelected(null, this.sourceRoApproval, response.legalEntityShippingAddressId);
					this.enableAddSaveBtn = true;				
					this.alertService.showMessage(
						'Success',
						`Saved Shipping Information Successfully `,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			} else {				
				await this.companyService.addNewShippingAddress(companyData).subscribe(response => {
					this.onShipToCompanySelected(null, this.sourceRoApproval, response.legalEntityShippingAddressId);
					this.enableAddSaveBtn = true;
					this.alertService.showMessage(
						'Success',
						`Updated Shipping Information Successfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			}
		}
	}

	saveShippingAddressToPO() {
		if (this.sourceRoApproval.shipToUserTypeId == this.customerModuleId) {
			for (let i = 0; i < this.shipToCusData.length; i++) {
				if (this.shipToCusData[i].customerShippingAddressId == 0) {
					this.shipToCusData.splice(i, 1);;
				}
			}
			const addressInfo = {
				...this.addressFormForShipping,
				country: getValueFromObjectByKey('label', this.addressFormForShipping.countryId),
				countryId: getValueFromObjectByKey('value', this.addressFormForShipping.countryId),
				customerShippingAddressId: 0
			}
			this.shipToCusData.push(addressInfo);
			this.shipToCusData.map(x => {
				if (x.customerShippingAddressId == 0) {
					this.sourceRoApproval.shipToAddressId = x.customerShippingAddressId;
				}
			});
			this.onShipToGetAddress(this.sourceRoApproval, this.sourceRoApproval.shipToAddressId);
		}
		if (this.sourceRoApproval.shipToUserTypeId == this.vendorModuleId) {
			for (let i = 0; i < this.vendorSelected.length; i++) {
				if (this.vendorSelected[i].vendorShippingAddressId == 0) {
					this.vendorSelected.splice(i, 1);;
				}
			}
			const addressInfo = {
				...this.addressFormForShipping,
				country: getValueFromObjectByKey('value', this.addressFormForShipping.countryId),
				countryId: getValueFromObjectByKey('value', this.addressFormForShipping.countryId),
				vendorShippingAddressId: 0
			}
			this.vendorSelected.push(addressInfo);
			this.vendorSelected.map(x => {
				if (x.vendorShippingAddressId == 0) {
					this.sourceRoApproval.shipToAddressId = x.vendorShippingAddressId;
				}
			});
			this.onShipToGetAddress(this.sourceRoApproval, this.sourceRoApproval.shipToAddressId);
		}
		if (this.sourceRoApproval.shipToUserTypeId == this.companyModuleId) {
			for (let i = 0; i < this.companySiteList_Shipping.length; i++) {
				if (this.companySiteList_Shipping[i].legalEntityShippingAddressId == 0) {
					this.companySiteList_Shipping.splice(i, 1);;
				}
			}
			const addressInfo = {
				...this.addressFormForShipping,
				country: getValueFromObjectByKey('label', this.addressFormForShipping.countryId),
				countryId: getValueFromObjectByKey('value', this.addressFormForShipping.countryId),
				legalEntityShippingAddressId: 0
			}
			this.companySiteList_Shipping.push(addressInfo);
			this.companySiteList_Shipping.map(x => {
				if (x.legalEntityShippingAddressId == 0) {
					this.sourceRoApproval.shipToAddressId = x.legalEntityShippingAddressId;
				}
			});
			this.shipToAddress = addressInfo;			
		}
		this.enableAddSaveBtn = true;
		if (!this.isEditModeShipping) {
			this.alertService.showMessage(
				'Success',
				`Saved Shipping Information Successfully`,
				MessageSeverity.success
			);
		} else {
			this.alertService.showMessage(
				'Success',
				`Updated Shipping Information Successfully`,
				MessageSeverity.success
			);
		}
	}

	async saveBillingAddress() {
		const data = {
			...this.addressFormForBilling,
			createdBy: this.userName,
			updatedBy: this.userName,
			masterCompanyId: this.currentUserMasterCompanyId,
			isActive: true,
			isPrimary: true
		}
		if (this.sourceRoApproval.billToUserTypeId == this.customerModuleId) {
			const customerData = { ...data, customerId: getValueFromObjectByKey('value', this.sourceRoApproval.billToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
			if (!this.isEditModeBilling) {
				await this.customerService.newBillingAdd(customerData).subscribe(response => {
					this.onBillToCustomerSelected(customerData.customerId, this.sourceRoApproval, response.customerBillingAddressId);
					this.enableAddSaveBtn = true;
					// this.addressFormForBilling = new CustomerShippingModel()
					this.alertService.showMessage(
						'Success',
						`Saved  Billing Information Sucessfully `,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			} else {
				await this.customerService.newBillingAdd(customerData).subscribe(response => {
					this.onBillToCustomerSelected(customerData.customerId, this.sourceRoApproval, response.customerBillingAddressId);
					this.enableAddSaveBtn = true;
					this.alertService.showMessage(
						'Success',
						`Updated Billing Information Successfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			}

		}
		if (this.sourceRoApproval.billToUserTypeId == this.vendorModuleId) {
			const vendorData = { ...data, vendorId: getValueFromObjectByKey('vendorId', this.sourceRoApproval.billToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
			if (!this.isEditModeBilling) {
				await this.vendorService.addNewBillingAddress(vendorData).subscribe(response => {
					this.onBillToVendorSelected(vendorData.vendorId, this.sourceRoApproval, response.vendorBillingAddressId);
					this.enableAddSaveBtn = true;
					//this.onBillCompanySelected();
					// this.addressFormForBilling = new CustomerShippingModel()
					this.alertService.showMessage(
						'Success',
						`Saved  Billing Information Sucessfully `,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			} else {
				await this.vendorService.addNewBillingAddress(vendorData).subscribe(response => {
					this.onBillToVendorSelected(vendorData.vendorId, this.sourceRoApproval, response.vendorBillingAddressId);
					this.enableAddSaveBtn = true;
					this.alertService.showMessage(
						'Success',
						`Updated Billing Information Successfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			}
		}
		if (this.sourceRoApproval.billToUserTypeId == this.companyModuleId) {
			const companyData = { ...data, legalentityId: getValueFromObjectByKey('value', this.sourceRoApproval.billToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
			if (!this.isEditModeBilling) {
				await this.companyService.addNewBillingAddress(companyData).subscribe(response => {
					this.onBillToCompanySelected(null, this.sourceRoApproval, response.legalEntityBillingAddressId);
					this.enableAddSaveBtn = true;					
					this.alertService.showMessage(
						'Success',
						`Saved  Billing Information Sucessfully `,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			} else {
				await this.companyService.addNewBillingAddress(companyData).subscribe(response => {
					this.onBillToCompanySelected(null, this.sourceRoApproval, response.legalEntityBillingAddressId);
					this.enableAddSaveBtn = true;
					this.alertService.showMessage(
						'Success',
						`Updated Billing Information Successfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			}
		}		
	}

	saveBillingAddressToPO() {
		if (this.sourceRoApproval.billToUserTypeId == this.customerModuleId) {
			for (let i = 0; i < this.billToCusData.length; i++) {
				if (this.billToCusData[i].customerBillingAddressId == 0) {
					this.billToCusData.splice(i, 1);;
				}
			}
			const addressInfo = {
				...this.addressFormForBilling,
				country: getValueFromObjectByKey('label', this.addressFormForBilling.countryId),
				countryId: getValueFromObjectByKey('value', this.addressFormForBilling.countryId),
				customerBillingAddressId: 0
			}
			this.billToCusData.push(addressInfo);
			this.billToCusData.map(x => {
				if (x.customerBillingAddressId == 0) {
					this.sourceRoApproval.billToAddressId = x.customerBillingAddressId;
				}
			});
			this.onBillToGetAddress(this.sourceRoApproval, this.sourceRoApproval.billToAddressId);
		}
		if (this.sourceRoApproval.billToUserTypeId == this.vendorModuleId) {
			for (let i = 0; i < this.vendorSelectedForBillTo.length; i++) {
				if (this.vendorSelectedForBillTo[i].vendorBillingAddressId == 0) {
					this.vendorSelectedForBillTo.splice(i, 1);;
				}
			}
			const addressInfo = {
				...this.addressFormForBilling,
				country: getValueFromObjectByKey('label', this.addressFormForBilling.country),
				countryId: getValueFromObjectByKey('value', this.addressFormForBilling.countryId),
				vendorBillingAddressId: 0
			}
			this.vendorSelectedForBillTo.push(addressInfo);
			this.vendorSelectedForBillTo.map(x => {
				if (x.vendorBillingAddressId == 0) {
					this.sourceRoApproval.billToAddressId = x.vendorBillingAddressId;
				}
			});
			this.billToAddress = addressInfo;			
		}
		if (this.sourceRoApproval.billToUserTypeId == this.companyModuleId) {
			for (let i = 0; i < this.companySiteList_Billing.length; i++) {
				if (this.companySiteList_Billing[i].legalEntityBillingAddressId == 0) {
					this.companySiteList_Billing.splice(i, 1);;
				}
			}
			const addressInfo = {
				...this.addressFormForBilling,
				country: getValueFromObjectByKey('label', this.addressFormForBilling.country),
				countryId: getValueFromObjectByKey('value', this.addressFormForBilling.countryId),
				legalEntityBillingAddressId: 0
			}
			this.companySiteList_Billing.push(addressInfo);
			this.companySiteList_Billing.map(x => {
				if (x.legalEntityBillingAddressId == 0) {
					this.sourceRoApproval.billToAddressId = x.legalEntityBillingAddressId;
				}
			});
			this.billToAddress = addressInfo;
		}
		this.enableAddSaveBtn = true;
		if (!this.isEditModeBilling) {
			this.alertService.showMessage(
				'Success',
				`Saved Billing Information Successfully`,
				MessageSeverity.success
			);
		} else {
			this.alertService.showMessage(
				'Success',
				`Updated Billing Information Successfully`,
				MessageSeverity.success
			);
		}
	}


	resetAddressShipViaForm() {
		this.addShipViaFormForShipping = new CustomerInternationalShipVia();
		this.isEditModeShipVia = false;
	}

	async saveShipViaForShipTo() {
		this.sourceRoApproval.shipViaId = 0;
		this.sourceRoApproval.shippingAcctNum = '';		
		const data = {
			...this.addShipViaFormForShipping,		
			name: getValueFromArrayOfObjectById('label', 'value', this.addShipViaFormForShipping.shipViaId, this.allShipViaInfo),
			createdBy: this.userName,
			updatedBy: this.userName,
			masterCompanyId: this.currentUserMasterCompanyId,
			isActive: true,
			UserType: parseInt(this.sourceRoApproval.shipToUserTypeId)
		}

		if (this.sourceRoApproval.shipToUserTypeId == this.customerModuleId) {
            const customerData = { ...data, ReferenceId: getValueFromObjectByKey('value', this.sourceRoApproval.shipToUserId), AddressId: this.sourceRoApproval.shipToAddressId ? this.sourceRoApproval.shipToAddressId : 0 }
			if (!this.isEditModeShipVia) {
				await this.commonService.createShipVia(customerData).subscribe(response => {
					this.getShipViaDetailsForShipTo(response.shipViaId);
					this.enableAddSaveBtn = true;					
					this.alertService.showMessage(
						'Success',
						`Saved Ship Via Information Sucessfully `,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);});
			} else {
				await this.commonService.createShipVia(customerData).subscribe(response => {
					this.getShipViaDetailsForShipTo(response.shipViaId);
					this.enableAddSaveBtn = true;
					this.alertService.showMessage(
						'Success',
						`Updated Ship Via Information Sucessfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);});
			}
		}
		if (this.sourceRoApproval.shipToUserTypeId == this.vendorModuleId) {
            const vendorData = { ...data, ReferenceId: getValueFromObjectByKey('vendorId', this.sourceRoApproval.shipToUserId), AddressId: this.sourceRoApproval.shipToAddressId ? this.sourceRoApproval.shipToAddressId : 0 }
			if (!this.isEditModeShipVia) {
				await this.commonService.createShipVia(vendorData).subscribe(response => {
					this.getShipViaDetailsForShipTo(response.shipViaId);
					this.enableAddSaveBtn = true;					
					this.alertService.showMessage(
						'Success',
						`Saved  Ship Via Information Sucessfully `,
						MessageSeverity.success
					);

				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			} else {
				await this.commonService.createShipVia(vendorData).subscribe(response => {
					this.getShipViaDetailsForShipTo(response.shipViaId);
					this.enableAddSaveBtn = true;
					this.alertService.showMessage(
						'Success',
						`Updated Ship Via Information Sucessfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);});
			}

		}
		if (this.sourceRoApproval.shipToUserTypeId == this.companyModuleId) {
            const companyData = { ...data, ReferenceId: getValueFromObjectByKey('value', this.sourceRoApproval.shipToUserId), AddressId: this.sourceRoApproval.shipToAddressId ? this.sourceRoApproval.shipToAddressId : 0}
			if (!this.isEditModeShipVia) {
				await this.commonService.createShipVia(companyData).subscribe(response => {
					this.getShipViaDetailsForShipTo(response.shipViaId);
					this.enableAddSaveBtn = true;					
					this.alertService.showMessage(
						'Success',
						`Saved  Ship Via Information Sucessfully `,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			} else {
				await this.commonService.createShipVia(companyData).subscribe(response => {
					this.getShipViaDetailsForShipTo(response.shipViaId);
					this.enableAddSaveBtn = true;
					this.alertService.showMessage(
						'Success',
						`Updated Ship Via Information Sucessfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			}
		}
		$('#shipToShipVia').modal('hide');
	}

	resetAddressForm() {
		this.addNewAddress = new AddressNew();
		this.isEditModeSplitAddress = false;
	}
	
	async saveSplitAddress() {
		const data = {
			...this.addNewAddress,
			siteName: this.addNewAddress.siteName,
			address1: this.addNewAddress.line1,
			address2: this.addNewAddress.line2,			
			createdBy: this.userName,
			updatedBy: this.userName,
			masterCompanyId: this.currentUserMasterCompanyId,
			isActive: true,
		}
		if (this.tempSplitPart.partListUserTypeId == this.customerModuleId) {
			const customerData = { ...data, isPrimary: true, customerId: getValueFromObjectByKey('value', this.tempSplitPart.partListUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
			if (!this.isEditModeSplitAddress) {
				await this.customerService.newShippingAdd(customerData).subscribe(res => {
					this.onCustomerNameChange(customerData.customerId, null, this.parentIndex, this.childIndex); //res.customerId
					this.enablePartSaveBtn = true;
					this.alertService.showMessage(
						'Success',
						`Saved Address Successfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			} else {
				await this.customerService.newShippingAdd(customerData).subscribe(res => {
					this.onCustomerNameChange(customerData.customerId, null, this.parentIndex, this.childIndex);
					this.enablePartSaveBtn = true;
					this.alertService.showMessage(
						'Success',
						`Updated Address Successfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			}
		}
		if (this.tempSplitPart.partListUserTypeId == this.vendorModuleId) {
			const vendorData = { ...data, vendorId: getValueFromObjectByKey('vendorId', this.tempSplitPart.partListUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
			if (!this.isEditModeSplitAddress) {
				await this.vendorService.newShippingAdd(vendorData).subscribe(res => {
					this.onVendorNameChange(vendorData.vendorId, null, this.parentIndex, this.childIndex);
					this.enablePartSaveBtn = true;
					this.alertService.showMessage(
						'Success',
						`Saved Address Successfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			} else {
				await this.vendorService.newShippingAdd(vendorData).subscribe(res => {
					this.onVendorNameChange(vendorData.vendorId, null, this.parentIndex, this.childIndex);
					this.enablePartSaveBtn = true;
					this.alertService.showMessage(
						'Success',
						`Updated Address Successfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			}
		}
		if (this.tempSplitPart.partListUserTypeId == this.companyModuleId) {
			const companyData = { ...data, legalentityId: getValueFromObjectByKey('value', this.tempSplitPart.partListUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
			if (!this.isEditModeSplitAddress) {
				await this.companyService.addNewShippingAddress(companyData).subscribe(res => {
					this.onCompanyNameChange(companyData.legalentityId, null, this.parentIndex, this.childIndex); //res.legalEntityId
					this.enablePartSaveBtn = true;
					this.alertService.showMessage(
						'Success',
						`Saved Address Successfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			} else {
				await this.companyService.addNewShippingAddress(companyData).subscribe(res => {
					this.onCompanyNameChange(companyData.legalentityId, null, this.parentIndex, this.childIndex);
					this.enablePartSaveBtn = true;
					this.alertService.showMessage(
						'Success',
						`Updated Address Successfully`,
						MessageSeverity.success
					);
				},err => {const errorLog = err;           
					this.errorMessageHandler(errorLog);})
			}
		}
	}

	saveSplitAddressToPO() {		
		for (let i = 0; i < this.tempSplitAddressData.length; i++) {
			if (this.tempSplitAddressData[i].addressId == 0) {
				this.tempSplitAddressData.splice(i, 1);;
			}
		}
		const addressInfo = {
			...this.addNewAddress,
			country: getValueFromObjectByKey('label', this.addNewAddress.countryId),
			countryName: getValueFromObjectByKey('label', this.addNewAddress.countryId),
			countryId: getValueFromObjectByKey('value', this.addNewAddress.countryId),
			addressId: 0,
			address1: this.addNewAddress.line1,
			address2: this.addNewAddress.line2,			
		}
		this.tempSplitAddressData.push(addressInfo);
		this.tempSplitAddressData.map(x => {
			if (x.addressId == 0) {
				this.tempSplitPart.partListAddressId = x.addressId;
			}
		});
		this.enablePartSaveBtn = true;
		if (!this.isEditModeSplitAddress) {
			this.alertService.showMessage(
				'Success',
				`Saved Address Successfully`,
				MessageSeverity.success
			);
		} else {
			this.alertService.showMessage(
				'Success',
				`Updated Address Successfully`,
				MessageSeverity.success
			);
		}		
	}

	onEditShipVia(data) {		
		this.tempshipVia = getObjectById('shipViaId', data.shipViaId, this.shipViaList);
		this.addShipViaFormForShipping = { ...this.tempshipVia, shipVia: this.tempshipVia.name };	
		this.isEditModeShipVia = true;
	}
	saveShipToShipViaDetailsToPO() {		
		for (let i = 0; i < this.shipViaList.length; i++) {
			if (this.shipViaList[i].shipViaId == 0) {
				this.shipViaList.splice(i, 1);;
			}
		}
		const shipViaInfo = {
			...this.addShipViaFormForShipping,
			shipViaId: 0,
			name: getValueFromArrayOfObjectById('label', 'value', this.addShipViaFormForShipping.shipViaId, this.allShipViaInfo)
		}
		this.shipViaList.push(shipViaInfo);
		this.shipViaList.map(x => {
			if (x.shipViaId == 0) {
				this.sourceRoApproval.shipViaId = x.shipViaId;
			}
		});
		if(this.sourceRoApproval.shipViaId != 0) {
			this.sourceRoApproval.shipViaId = this.addShipViaFormForShipping.shipViaId;
		}	
		this.sourceRoApproval.shippingAcctNum = this.addShipViaFormForShipping.shippingAccountInfo;		
		this.enableAddSaveBtn = true;
		if (!this.isEditModeShipVia) {
			this.alertService.showMessage(
				'Success',
				`Saved ShipVia Successfully`,
				MessageSeverity.success
			);
		} else {
			this.alertService.showMessage(
				'Success',
				`Updated ShipVia Successfully`,
				MessageSeverity.success
			);
		}
	}

	onClickPartsListAddress(value, splitPart, pindex?, cindex?) {
		this.tempSplitPart = splitPart;
		this.parentIndex = pindex;
		this.childIndex = cindex;
		this.tempSplitAddressData = this["splitAddressData" + pindex + cindex];
		if (value === 'Add') {
			this.addressHeader = 'Add Split Shipment Address';
			this.resetAddressForm();
		}
		if (value === 'Edit') {
			this.addressHeader = 'Edit Split Shipment Address';
			this.isEditModeSplitAddress = true;
			this.tempSplitAddress = getObjectById('addressId', splitPart.partListAddressId, this["splitAddressData" + pindex + cindex]);
			this.addNewAddress = {
				...this.tempSplitAddress,
				line1: this.tempSplitAddress.address1,
				line2: this.tempSplitAddress.address2,				
			};
			if (typeof this.tempSplitAddress.country == 'number') {
				this.addNewAddress = { ...this.addNewAddress, country: getObjectByValue('value', this.tempSplitAddress.country, this.allCountriesList) }
			} else {
				this.addNewAddress = { ...this.addNewAddress, countryId: getObjectByValue('value', this.tempSplitAddress.countryId, this.allCountriesList) }
			}

		}
	}

	onChangeParentQtyOrdered(event, partList) {
		this.parentQty = event.target.value;
		if (partList.childList.length > 0) {
			this.onChangeChildQtyOrdered(partList);
		}
	}

	onChangeChildQtyOrdered(partList, partChildList?) {
		this.childOrderQtyArray = [];
		this.childOrderQtyTotal = null;
		this.parentQty = this.parentQty ? parseFloat(this.parentQty.toString().replace(/\,/g,'')) : parseFloat(partList.quantityOrdered.toString().replace(/\,/g,''));
		for (let i = 0; i < partList.childList.length; i++) {
			if (partList.childList[i].quantityOrdered === null || partList.childList[i].quantityOrdered === undefined) {
				partList.childList[i].quantityOrdered = 0;
			}
			this.childOrderQtyArray.push(parseInt(partList.childList[i].quantityOrdered.toString().replace(/\,/g,'')));
			this.childOrderQtyTotal = this.childOrderQtyArray.reduce((acc, val) => acc + val, 0);			
			if (this.childOrderQtyTotal > this.parentQty) {
				partList.childList[i].quantityOrdered = 0;
			}
		}
		if (this.childOrderQtyTotal > this.parentQty) {			
			this.alertService.showStickyMessage("Validation failed", "Total Child Order Quantity exceeded the Parent Quantity!", MessageSeverity.error, 'Please enter Qty');
		}
		if(partChildList) {
			partChildList.quantityOrdered = partChildList.quantityOrdered ? formatNumberAsGlobalSettingsModule(partChildList.quantityOrdered, 0) : 0;
		}
	}
	
	getStockLineByItemMasterId(partList) {		
		partList.stocklineId = null;
		partList.controlId = '';
		partList.purchaseOrderNum = '';
		partList.controlNumber = '';
		this.workOrderService.getStockLineByItemMasterId(partList.itemMasterId, partList.conditionId).subscribe(res => {
			partList.allStocklineInfo = res;
			if(partList.allStocklineInfo.length > 0) {
				partList.stocklineId = partList.allStocklineInfo[0];
				this.getStockLineDetails(partList);
			}
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	getStockLineDetails(partList) {
		if(partList.stocklineId) {
			this.stocklineService.getStockLineDetailsByStockLineId(partList.stocklineId.stockLineId).subscribe(res => {
				partList.controlId = res.controlId;
				partList.purchaseOrderNum = res.purchaseOrderNo;
				partList.controlNumber = res.controlNumber;
				partList.workOrderId = res.WorkOrderId;
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);});
		}
	}	

	checkValidOnChange(condition, value) {
		if(condition != 0 && condition != null  && value == "companyId") {
			this.managementValidCheck = false;
		}
		if(condition != 0 && condition != null  && value == "shipToUserTypeId") {
			this.shipToUserTypeValidCheck = false;
		}
		if(condition != 0 && condition != null  && value == "shipToAddressId") {
			this.shipToSiteNameValidCheck = false;
		}
		if(condition != 0 && condition != null  && value == "shipViaId") {
			this.shipViaValidCheck = false;
		}
		if(condition != 0 && condition != null  && value == "billToUserTypeId") {
			this.billToUserTypeValidCheck = false;
		}
		if(condition != 0 && condition != null  && value == "billToAddressId") {
			this.billToSiteNameValidCheck = false;
		}
	}

	
	viewSelectedCapsRow(rowData) {       
        const {vendorCapabilityId} = rowData;
        this.getVendorCapabilitiesView(vendorCapabilityId);     
        this.getVendorCapesAircraftView(vendorCapabilityId);     
    }
    getVendorCapabilitiesView(vendorCapesId) {
		this.vendorCapesService.getVendorCapabilitybyId(vendorCapesId).subscribe(res => {			
			this.vendorCapesGeneralInfo = {
				...res,
				cost: res.cost ? formatNumberAsGlobalSettingsModule(res.cost, 2) : '0.00'
			};
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})
	}

	getVendorCapesAircraftView(vendorCapesId) {
		this.vendorCapesService.getVendorAircraftGetDataByCapsId(vendorCapesId).subscribe(res => {          
            this.aircraftListDataValues = res.map(x => {
                return {
                    ...x,
                    aircraft: x.aircraftType,
                    model: x.aircraftModel,
                    dashNumber: x.dashNumber,
                    memo: x.memo,
                }
            })
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
	}

	onSelectStatus() {
		if(this.headerInfo.statusId == this.roFulfillingstatusID) {
			this.disableAddPart = true;
			this.disableHeaderInfo = true; 
		} else {
			this.disableAddPart = false;
			this.disableHeaderInfo = false; 
		}
	}

   filterVenContactFirstNames(event) {
		this.venContactFirstNames = [];
        for (let i = 0; i < this.venContactList.length; i++) {
            let firstName = this.venContactList[i].firstName;
            if (firstName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.venContactFirstNames.push(firstName);
            }
		}
		this.venContactFirstNames = this.venContactFirstNames.filter((el, i, a) => i === a.indexOf(el));
	}
	filterVenContactLastNames(event) {
		this.venContactLastNames = [];
        for (let i = 0; i < this.venContactList.length; i++) {
            let lastName = this.venContactList[i].lastName;
            if (lastName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.venContactLastNames.push(lastName);
            }
		}
		this.venContactLastNames = this.venContactLastNames.filter((el, i, a) => i === a.indexOf(el));
	}
	filterVenContactMiddleNames(event) {
		this.venContactMiddleNames = [];
        for (let i = 0; i < this.venContactList.length; i++) {
            let middleName = this.venContactList[i].middleName;
            if (middleName != "" && middleName != null && middleName != "Null") {
                if (middleName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.venContactMiddleNames.push(middleName);
                }
            }
		}
		this.venContactMiddleNames = this.venContactMiddleNames.filter((el, i, a) => i === a.indexOf(el));
	}

	resetVenContactInfo() {
		this.vendorContactInfo = new Object();
	}

	addContactForVendor() {
		let vendorContactInfo = {
			...this.vendorContactInfo,
			vendorId: editValueAssignByCondition('vendorId', this.headerInfo.vendorId),
			isDefaultContact: this.vendorContactInfo.isDefaultContact ? this.vendorContactInfo.isDefaultContact : false,
			createdBy: this.userName,
			updatedBy: this.userName
		}
		this.vendorService.newAddContactInfo(vendorContactInfo).subscribe(res => {
			const data = {...res, vendorId: editValueAssignByCondition('vendorId', this.headerInfo.vendorId)}
			this.vendorService.newAddvendorContact(data).subscribe(data => {
				this.getVendorContactsListByID(vendorContactInfo.vendorId);
				this.alertService.showMessage(
					'Success',
					`Saved Vendor Contact Successfully`,
					MessageSeverity.success
				);
			});			
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})  
	}

	patternMobilevalidationWithSpl(event: any) {
        const pattern = /[0-9\+\-()\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

	enableHeaderSave() {
		this.enableHeaderSaveBtn = true;
	}

	enablePartSave() {
		this.enablePartSaveBtn = true;
	}

	enableAddSave() {
		this.enableAddSaveBtn = true;
	}

	onChangeShippingHandlingCost(str) {
		this.sourceRoApproval[str] = this.sourceRoApproval[str] ? formatNumberAsGlobalSettingsModule(this.sourceRoApproval[str], 2) : '0.00';
	}

	openVendorCapesHistory(row) {
        this.vendorService.getVendorCapabilityAuditHistory(row.vendorCapabilityId, row.vendorId).subscribe(res => {
			this.capabilityauditHistory = res.map(x => {
				return {
					...x,
					cost: x.cost ? formatNumberAsGlobalSettingsModule(x.cost, 2) : '0.00'
				}
			});
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.capabilityauditHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
	}

	selectAllApproval(isSelected) {
        this.approvalProcessList.forEach(
            (x) => {
				if(x.actionId != this.ApprovedstatusId && x.actionId != 0) {
					x.isSelected = !isSelected;
				}
            }
		);
		this.selectEachApproval();
	}

	selectEachApproval() {
		for(let i=0; i < this.approvalProcessList.length; i++) {
			if(this.approvalProcessList[i].isSelected) {
				this.enableApproverSaveBtn = true;
				break;
			} else {
				this.enableApproverSaveBtn = false;
			}
		}
	}

	saveApprovalProcess() {
		const data = [];
		this.isSpinnerVisible = true;
		this.approvalProcessList = this.approvalProcessList.map(x => {
			return {
				...x,
				legalEntityId: this.currentUserLegalEntityId,
				internalEmails: this.apporoverEmailList,
				approvers: this.apporoverNamesList.join(),
				approvedById: x.actionId == this.SubmitInternalApprovalID ? parseInt(this.employeeId.toString()) : null,
                createdBy: this.userName,
                updatedBy: this.userName
			}
		});
		this.approvalProcessList.map(x => {
			if(x.isSelected) {
				data.push(x)
			}
		});		
		this.repairOrderService.saveRepairOrderApproval(data).subscribe(res => {			
			this.getApprovalProcessListById(this.roId);
			this.getVendorROHeaderById(this.roId);
			this.isSpinnerVisible = false;
			this.alertService.showMessage(
				'Success',
				`Saved Approver Process Successfully`,
				MessageSeverity.success
			);
		}, err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);
		})
	}

	onChangeTabView(event) {
		if(event.index == 0) {
			this.getRepairOrderPartsById(this.roId);
			this.enablePartSaveBtn = false;
		}
		if(event.index == 1) {
			this.getApproversListById(this.roId);
		}
		if(event.index == 2) {
			this.getApproversListById(this.roId);
			this.getApprovalProcessListById(this.roId);
			this.enableApproverSaveBtn = false;
		}
		if(event.index == 3) {
			const id = editValueAssignByCondition('vendorId', this.headerInfo.vendorId);
			this.getVendorCapesByID(id);
		}
		if(event.index == 4) {
			this.enableAddSaveBtn = false;
			this.getVendorROAddressById(this.roId);
		}
	}
	WarningsList: any;
	WarningListId:any;
	getWarningsList(): void {
		this.commonService.smartDropDownList('VendorWarningList', 'VendorWarningListId ', 'Name').subscribe(res => {
			res.forEach(element => {
				if (element.label == 'Create Repair Order') {
					this.WarningListId = element.value;
					return;
				}
			});
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);}) 
	}
	warningMessage:any;
	warningID;
	isEditWork:any;
	restrictID:any;
	restrictMessage:any;
	warnings(Id) {
		if (Id && this.WarningListId) {
			this.warningMessage = '';
			this.commonService.vendorWarnings(Id, this.WarningListId).subscribe((res: any) => {
				if (res) {
					this.warningMessage = res.warningMessage;
					this.warningID = res.vendorWarningId;
				}
				if (this.isEditWork == false) {
					this.resctrictions(Id, this.warningMessage);
				} else {
					if(this.warningID !=0){
						this.showAlertMessage();
					}
					this.restrictID = 0
				} 
			},err => {const errorLog = err;           
				this.errorMessageHandler(errorLog);})
		}
	}
	resctrictions(Id, warningMessage) {
		this.restrictMessage = '';
		if (Id && this.WarningListId) {
			this.commonService.vendorResctrictions(Id, this.WarningListId).subscribe((res: any) => {
				if (res) {
			this.restrictMessage = res.restrictMessage;
							this.restrictID = res.vendorWarningId;
						}

			if (this.warningID != 0 && this.restrictID == 0) {
				this.showAlertMessage();
			} else if (this.warningID == 0 && this.restrictID != 0) {
				this.showAlertMessage();
			} else if (this.warningID != 0 && this.restrictID != 0) {
				this.showAlertMessage();
			} else if (this.warningID == 0 && this.restrictID == 0) {

			}
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);})
		}
	}
	showAlertMessage() {
		$('#warnRestrictMesg').modal("show");
	}
	WarnRescticModel() {
		this.isEditWork = false;
		$('#warnRestrictMesg').modal("hide");
		this.warningMessage = '';
		this.restrictMessage = '';
		if (this.restrictID != 0) {
			this.headerInfo.vendorCode = null;
			this.headerInfo.vendorId = null;
			this.headerInfo.vendorContactId = null;
			this.headerInfo.vendorContactPhone = null;
		}
	}

	getPartToDisableOrNot(part) {
		if (part.actionStatus != 'Approved') {

			if (part.actionId ==  this.SentForInternalApprovalID) {
				return true;
			}
			else if (part.actionId == this.SubmitInternalApprovalID) {
				if (this.internalApproversList && this.internalApproversList.length > 0) {
					let approverFound = this.internalApproversList.find(approver => approver.approverId == this.employeeId && approver.isExceeded==false);
					if (approverFound) {
						return true;
					} else {
						return false;
					}
				}  
			}
		}
	}
	}