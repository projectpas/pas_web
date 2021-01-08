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
import { getValueFromObjectByKey, getObjectByValue, getValueFromArrayOfObjectById, getObjectById, editValueAssignByCondition, getValueByFieldFromArrayofObject, formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { AuthService } from '../../../../services/auth.service';
import { CommonService } from '../../../../services/common.service';
import { CustomerShippingModel } from '../../../../models/customer-shipping.model';
import { CompanyService } from '../../../../services/company.service';
import { CustomerInternationalShipVia } from '../../../../models/customer-internationalshipping.model';
import { PurchaseOrderService } from '../../../../services/purchase-order.service';
import { AddressNew } from '../../../../models/address-new-model';
import { VendorCapabilitiesService } from '../../../../services/vendorcapabilities.service';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { DatePipe } from '@angular/common';
import { SalesOrderReferenceStorage } from '../../../sales/shared/sales-order-reference-storage';
import { StocklineReferenceStorage } from '../../../stockline/shared/stockline-reference-storage';

@Component({
	selector: 'app-purchase-setup',
	templateUrl: './purchase-setup.component.html',
	styleUrls: ['./purchase-setup.component.scss'],
	providers: [DatePipe]
})
/** purchase-setup component*/
export class PurchaseSetupComponent implements OnInit {
	addressType:any  = 'PO';
	id: number;
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
	tempAddshipViaMemo: any = {};
	allActions: any[] = [];
	selectedActionName: any;
	partListData: any[] = [];
	allPriorityInfo: any = [];
	sourcePoApproval: any = {};
	headerInfo: any = {};
	sourcePoApprovalObj: any = {};
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
	isEditMode: boolean;
	allPartnumbersInfo: any = [];
	showInput: boolean = false;
	partNumbers: any;
	tempMemo: any;
	headerMemo: any;
	headerNotes:any;
	partsMemo:any;	
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
	@ViewChild('createPOForm',{static:false}) createPOForm: NgForm;
	@ViewChild('createPOPartsForm',{static:false}) createPOPartsForm: NgForm;
	@ViewChild('createPOAddressForm',{static:false}) createPOAddressForm: NgForm;
	purchaseOrderId: any;
	purchaseOrderPartRecordId: any;
	addAllMultiPN: boolean = false;	
	childObject: any = {};
	parentObject: any = {};
	childObjectArray: any[] = [];
	childObjectArrayEdit: any = [];
	parentObjectArray: any[] = [];
	poAddressArray: any = {};
	poShippingAddress: any = {};
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
	poApproverData: any = {};
	poApproverList: any = [];
	poApproverListEdit: any = [];
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
	poId: any;	
	tempShipTOAddressId: any;
	tempBillTOAddressId: any;
	shipToSelectedvalue: any;
	billToSelectedvalue: any;
	addNewAddress = new CustomerShippingModel();
	gridSelectedVendorId: any;
	gridSelectedCustomerId: any;
	legalEntityList_Forgrid: any;
	discountPercentList: any = [];
	allPercentData: any = [];
	splitcustomersList: any = [];
	splitAddressData: any = [];
	tempSplitAddressData: any = [];
	approveListEdit: any = [];
	poApproverId: number;
	vendorIdByParams: number;
	tempSplitPart: any;
	tempSplitAddress: any;
	isEditModeShipping: boolean = false;
	isEditModeBilling: boolean = false;
	isEditModeShipVia: boolean = false;
	isEditModeSplitAddress: boolean = false;
	isEditModeSplitPoOnly: boolean = false;
	addressFormForShippingCompany: any;
	parentIndex: number;
	childIndex: number;
	allCountriesList: any = [];
	countriesList: any = [];
	inputValidCheck: any;
	inputValidCheckHeader: any;
	inputValidCheckAdd: any;
	vendorContactInfo: any = {}
	venContactList: any = [];
	venContactFirstNames: any = [];
	venContactLastNames: any = [];
	venContactMiddleNames: any = [];
	workOrderPartNumberId: any = 0;
	managementValidCheck: boolean;
	shipToUserTypeValidCheck: boolean;
	shipToSiteNameValidCheck: boolean;
	shipViaValidCheck: boolean;
	billToUserTypeValidCheck: boolean;
	billToSiteNameValidCheck: boolean;
	vendorCapesGeneralInfo: any = {};
	aircraftListDataValues: any;
	isViewMode: boolean = true;
    capvendorId: number; 
    colsaircraftLD: any[] = [
        { field: "aircraft", header: "Aircraft" },
        { field: "model", header: "Model" },
        { field: "dashNumber", header: "Dash Numbers" },
        { field: "memo", header: "Memo" }
    ];
	listOfErrors: any;
	disableAddPart: boolean = false;
	disableHeaderInfo: boolean = false; 
	allWorkOrderInfo: any = [];
	allsubWorkOrderInfo: any = [];
	allRepairOrderInfo: any = [];
	allSalesOrderInfo: any = [];
	allShipViaInfo: any = [];
	allWorkOrderDetails: any = [];
	allsubWorkOrderDetails: any = [];
	allRepairOrderDetails: any = [];
	allSalesOrderDetails: any = [];	
	altPartNumList: any = [];
	altPartCollection: any = [];
	toggle_po_header: boolean = true;
	isEditModeHeader: boolean = false;
	isEditModePart: boolean = false;
	isEditModeAdd: boolean = false;
	salesOrderReferenceData: any;
	stocklineReferenceData: any;
	poStatusList: any = [];
	poApproverStatusList: any = [];
	defaultCondtionId: number;
	enableHeaderSaveBtn: boolean = false;
	enablePartSaveBtn: boolean = false;
	enableApproverSaveBtn: boolean = false;
	enableAddSaveBtn: boolean = false;
	totalExtCost: any;
	totalDiscAmount: any;
	isSpinnerVisible: boolean = true;
	tempPartList:any = {};
	userTypes: any = [];
	capabilityauditHistory: any = [];
	currentUserLegalEntityId: number;
	companyModuleId: number;
	vendorModuleId: number;
	customerModuleId: number;
	poTotalCost: number;
	internalApproversList: any = [];
	selectallApprovers: boolean;
	displayWarningModal: boolean = false;
	poFulfillingstatusID: number = -1;
	poOpenstatusID: number = -1;
	poApprovaltaskId = 0;
	ApprovedstatusId = 0; 
	ShowWarning = 0; 
	SubmitInternalApprovalID = 0;
	pendingApprovalID = 0;
	SentForInternalApprovalID = 0;
	arrayEmplsit:any[] = [];
	arrayLegalEntitylsit:any[] = [];
	arrayVendlsit:any[] = [];
	arrayCustlist:any[] = [];
	arrayWOlist:any[] = [];
	arraysubWOlist:any[] = [];
	arrayROlist:any[] = [];
	arraySOlist:any[] = [];

	splitAddbutton: boolean = false;
	lstfilterSplitSite: any[];
	changeName: boolean = false;
	issplitSiteNameAlreadyExists: boolean = false;
	editSiteName: string = '';
	splitSieListOriginal: any[];
	splitmoduleId: number=0;
	splituserId:number=0

	posettingModel: any = {};
	
	
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
	approvalProcessListWithChild: any []; 
	tempApproverObj: any = {};
	tempApproverMemo: string;
    apporoverEmailList: string;
	apporoverNamesList: any = [];
	currentUserEmployeeName: string;
	disableApproverSelectAll: boolean = false;
	enableMultiPartAddBtn: boolean = false;
	moduleId:any=0;
	referenceId:any=0;
	moduleName:any="PurchseOrder"
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
		private purchaseOrderService: PurchaseOrderService,		
		private vendorCapesService: VendorCapabilitiesService,
		private itemser: ItemMasterService,
		private datePipe: DatePipe,		
		private salesOrderReferenceStorage: SalesOrderReferenceStorage,
		private stocklineReferenceStorage: StocklineReferenceStorage) {

		this.vendorService.ShowPtab = false;
		this.vendorService.alertObj.next(this.vendorService.ShowPtab);
		this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-purchase-setup';
		this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
	}

	ngOnInit() {
		this.priorityData();
		this.loadModuleListForVendorComp();		
		this.loadPOStatus();
		this.posettingModel.IsResale = false;
        this.posettingModel.IsDeferredReceiver = false;
		this.posettingModel.IsEnforceApproval = false;
        this.isSpinnerVisible = false;
        this.getPurchaseOrderMasterData();		
		
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
	
        
		if(!this.isEditMode) {
			this.getManagementStructureDetails(this.currentUserManagementStructureId,this.employeeId);			
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
				this.purchaseOrderService.getAllEditID(this.poId).subscribe(res => {
					const result = res;
					if(result && result.length > 0) {
						result.forEach(x => 
							{
								if(x.label == "VENDOR"){
									this.arrayVendlsit.push(x.value); 
								}
								else if (x.label == "EMPLOYEE") {
									this.arrayEmplsit.push(x.value); 
                                }
                                else if (x.label == "CUSTOMER") {
                                    this.arrayCustlist.push(x.value);
								}
								else if (x.label == "COMPANY") {
                                    this.arrayLegalEntitylsit.push(x.value);
								}
								else if (x.label == "WONO") {
                                    this.arrayWOlist.push(x.value);
								}
								else if (x.label == "SOWONO") {
                                    this.arraysubWOlist.push(x.value);
								}								
								else if (x.label == "RONO") {
                                    this.arrayROlist.push(x.value);
								}
								else if (x.label == "SONO") {
                                    this.arraySOlist.push(x.value);
								}
							});
						this.editDropDownLoad();
						this.isEditMode = true;
						this.isEditModeHeader = true;
						this.toggle_po_header = false;
						this.isSpinnerVisible = true;			
						setTimeout(() => {				
							this.getVendorPOHeaderById(this.poId);
							// this.getPurchaseOrderPartsById(this.poId);
							this.getPurchaseOrderAllPartsById(this.poId);
							this.enableHeaderSaveBtn = false;
							this.isSpinnerVisible = false;
						},							 
						2200); 	
						
					}
				});
			
		} else if (this.poId === 0) {
			setTimeout(() => {
				this.editDropDownLoad(); 	
			}, 2200);
			setTimeout(() => {
				// this.getPurchaseOrderPartsById(this.poId);
				this.getPurchaseOrderAllPartsById(this.poId);
			}, 1200);
		}

		this.vendorIdByParams = this._actRoute.snapshot.params['vendorId'];
		if(this.vendorIdByParams) {
			setTimeout(() => {			
					this.arrayVendlsit.push(this.vendorIdByParams); 				
					this.vendorService.getVendorNameCodeListwithFilter('',20,this.arrayVendlsit.join()).subscribe(res => {
					this.allActions = res;
					this.vendorNames = res;
					this.vendorCodes = res;
					this.splitVendorNames = res; 								
					this.loadvendorDataById(this.vendorIdByParams);
					this.warningsandRestriction(this.vendorIdByParams);
					this.capvendorId = this.vendorIdByParams;
				},err => {
					this.isSpinnerVisible = false;
					const errorLog = err;
					this.errorMessageHandler(errorLog);		
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
	}
	getPurchaseOrderMasterData() {
        this.purchaseOrderService.getPurchaseOrderSettingMasterData();
        this.purchaseOrderService.getPurchaseOrderSettingMasterData().subscribe(res => {
            if (res) {
                this.posettingModel.PurchaseOrderSettingId = res.purchaseOrderSettingId;
                this.posettingModel.IsResale = res.isResale;
                this.posettingModel.IsDeferredReceiver = res.isDeferredReceiver;
                this.posettingModel.IsEnforceApproval = res.isEnforceApproval;
            }
        }, err => {
            this.isSpinnerVisible = false;
            const errorLog = err;
            //this.errorMessageHandler(errorLog);
        });
    }
	    warningMessage:any;
		warningID:any = 0;
		isEditWork:any = false;
		restrictID:any = 0;
		restrictMessage:any;
		WarningsList: any;
		WarningListId:any;

	//#region All Binding 
	warningsandRestriction(Id) {
			this.commonService.smartDropDownList('VendorWarningList', 'VendorWarningListId ', 'Name').subscribe(res => {
				if(res) {
				res.forEach(element => {
					if (element.label == 'Create Purchase Order') {
						this.WarningListId = element.value;
					}
				});
				if (Id && this.WarningListId) {
					this.commonService.vendorWarningsAndRestrction(Id, this.WarningListId).subscribe((res: any) => {
						if (res) {
							if(res.warning) {
							this.warningMessage = res.warningMessage;
							this.warningID = res.vendorWarningId;
							this.restrictID == 0;
						   }
							if(res.restrict && !this.isEditMode) {
							this.restrictMessage = res.restrictMessage;
							this.restrictID = res.vendorWarningId;}
		
							if (this.warningID != 0 && this.restrictID == 0) {
								this.showAlertMessage();
							} else if (this.warningID == 0 && this.restrictID != 0) {
								this.showAlertMessage();
							} 
							else if (this.warningID != 0 && this.restrictID != 0) {
								this.showAlertMessage();
							} 
						}
					},err => {
						this.isSpinnerVisible = false;
						const errorLog = err;
						this.errorMessageHandler(errorLog);		
					});
				}}
			},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			}); 
		
	}

	getStatusvalue(status, action ) {
        if (status == 'Submit Approval' && action == '1') {
            return true;
        } else { return false; }
	}

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

	bindshippingSieListOriginal(moduleId=0,userId=0) {
		moduleId = moduleId = 0 ? this.splitmoduleId : 0;
		userId= userId = 0 ? this.splituserId : 0;

	this.commonService.getaddressdetailsOnlyUserbyuser(moduleId, userId, 'Ship',this.poId).subscribe(
		returnddataforbill => {
			this.splitSieListOriginal = returnddataforbill.address.map(x => {
																			return {
																				siteName: x.siteName, siteId: x.siteId
																			}});
		});
	}



	filterSplitSite(event) {
		
        this.commonService.getaddressdetailsOnlyUserbyuser(this.splitmoduleId, this.splituserId, 'Ship',this.poId).subscribe(
			returnddataforbill => {
				this.splitSieListOriginal = returnddataforbill.address.map(x => {
																				return {
																					siteName: x.siteName, siteId: x.siteId
																				}});
			
		this.lstfilterSplitSite = this.splitSieListOriginal;
		if (event.query !== undefined && event.query !== null ) {
			const shippingSite = [...this.splitSieListOriginal.filter(x => {
				return x.siteName.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.lstfilterSplitSite = shippingSite;	
		}
	});		
		
	  }
	 
	 
	checkSplitSiteNameSelect() {
		if(this.isEditModeSplitPoOnly == false && this.isEditModeSplitAddress == false) {
		this.issplitSiteNameAlreadyExists = true;
		this.splitAddbutton = false;}
		else {
			if(this.editSiteName  != editValueAssignByCondition('siteName', this.addNewAddress.siteName))
			{
				this.issplitSiteNameAlreadyExists = true;
				this.splitAddbutton = false;
			}else
			{
				this.issplitSiteNameAlreadyExists = false;
				this.splitAddbutton = true;
			}

		}
	}  

	checkSplitSiteNameExist(value) {
		if(this.isEditModeSplitPoOnly == false && this.isEditModeSplitAddress == false) {
		this.changeName = true;
		this.issplitSiteNameAlreadyExists = false;
		this.splitAddbutton = true;
		if (value != undefined && value != null ) {
			for (let i = 0; i < this.splitSieListOriginal.length; i++) {
				if (this.addNewAddress.siteName == this.splitSieListOriginal[i].siteName 
					|| value.toLowerCase() == this.splitSieListOriginal[i].siteName.toLowerCase()) {
					this.issplitSiteNameAlreadyExists = true;
					this.splitAddbutton = false;
					return;
				}
			}
		}
		} else {
		this.changeName = true;
		this.issplitSiteNameAlreadyExists = false;
		this.splitAddbutton = true;
		if (value != undefined && value != null && value != this.editSiteName ) {
			for (let i = 0; i < this.splitSieListOriginal.length; i++) {
				if (this.addNewAddress.siteName == this.splitSieListOriginal[i].siteName 
					|| value.toLowerCase() == this.splitSieListOriginal[i].siteName.toLowerCase()) {
					this.issplitSiteNameAlreadyExists = true;
					this.splitAddbutton = false;
					return;
				}
			}
		}

		}
	}
	
	

	getManagementStructureDetails(id,empployid=0,editMSID=0) {
		empployid = empployid == 0 ? this.employeeId : empployid ;
		editMSID = this.isEditMode ? editMSID = id : 0;
		this.commonService.getManagmentStrctureData(id,empployid,editMSID).subscribe(response => {
			if(response) {
				const result = response;
				if(result[0] && result[0].level == 'Level1') {
					this.maincompanylist =  result[0].lstManagmentStrcture;	
					this.headerInfo.companyId = result[0].managementStructureId;
					this.headerInfo.managementStructureId = result[0].managementStructureId;				
					this.headerInfo.buId = 0;
					this.headerInfo.divisionId = 0;
					this.headerInfo.departmentId = 0;	
					this.bulist = [];
					this.divisionlist = [];
					this.departmentList = [];
				} else {
					this.headerInfo.companyId = 0;
					this.headerInfo.buId = 0;
					this.headerInfo.divisionId = 0;
					this.headerInfo.departmentId = 0;	
					this.maincompanylist = [];
					this.bulist = [];
					this.divisionlist = [];
					this.departmentList = [];
				}
				
				if(result[1] && result[1].level == 'Level2') {	
					this.bulist = result[1].lstManagmentStrcture;
					this.headerInfo.buId = result[1].managementStructureId;
					this.headerInfo.managementStructureId = result[1].managementStructureId;
					this.headerInfo.divisionId = 0;
					this.headerInfo.departmentId = 0;
					this.divisionlist = [];
					this.departmentList = [];
				} else {
					if(result[1] && result[1].level == 'NEXT') {
						this.bulist = result[1].lstManagmentStrcture;
					}
					this.headerInfo.buId = 0;
					this.headerInfo.divisionId = 0;
					this.headerInfo.departmentId = 0;					
					this.divisionlist = [];
					this.departmentList = []; 
				}

				if(result[2] && result[2].level == 'Level3') {		
					this.divisionlist =  result[2].lstManagmentStrcture;		
					this.headerInfo.divisionId = result[2].managementStructureId;		
					this.headerInfo.managementStructureId = result[2].managementStructureId;			
					this.headerInfo.departmentId = 0;						
					this.departmentList = [];			
				} else {
					if(result[2] && result[2].level == 'NEXT') {
						this.divisionlist = result[2].lstManagmentStrcture;						
					}
					this.headerInfo.divisionId = 0; 
					this.headerInfo.departmentId = 0;	
					this.departmentList = [];}

				if(result[3] && result[3].level == 'Level4') {		
					this.departmentList = result[3].lstManagmentStrcture;;			
					this.headerInfo.departmentId = result[3].managementStructureId;	
					this.headerInfo.managementStructureId = result[3].managementStructureId;				
				} else {
					this.headerInfo.departmentId = 0; 
					if(result[3] && result[3].level == 'NEXT') {
						this.departmentList = result[3].lstManagmentStrcture;						
					}
				}	
				this.employeedata('',this.headerInfo.managementStructureId);	
			}
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
	}

	getManagementStructureForParentEdit(partList,employid=0,editMSID=0) {
		const msId = partList.managementStructureId ? partList.managementStructureId : this.headerInfo.managementStructureId;
		employid = employid == 0 ? this.employeeId : employid ;
		editMSID = this.isEditMode ?  msId : 0;
		if(msId == this.headerInfo.managementStructureId) {
			if (this.headerInfo.companyId > 0) {
				partList.maincompanylist = this.maincompanylist;
				partList.parentCompanyId = this.headerInfo.companyId;
				partList.managementStructureId = this.headerInfo.companyId;
				partList.parentBulist = []
				partList.parentDivisionlist = [];
				partList.parentDepartmentlist = [];
				partList.parentbuId = 0;
				partList.parentDivisionId = 0;
				partList.parentDeptId = 0;
			}else {
				partList.parentCompanyId = 0;
				partList.parentbuId = 0;
				partList.parentDivisionId = 0;
				partList.parentDeptId = 0;
				partList.maincompanylist = [];
				partList.parentBulist = []
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
			} else {
				partList.parentDivisionId = 0;
				partList.parentDeptId = 0;					
				partList.parentDivisionlist = this.divisionlist;
				partList.parentDepartmentlist = [];
			}
			if (this.headerInfo.departmentId > 0) {
				partList.parentDepartmentlist = this.departmentList;
				partList.parentDeptId = this.headerInfo.departmentId;	
				partList.managementStructureId = this.headerInfo.departmentId;
			} else {
				partList.parentDeptId = 0;					
				partList.parentDepartmentlist = this.departmentList;
			}

		} else {
		this.commonService.getManagmentStrctureData(msId,employid,editMSID).subscribe(response => {
			if(response) {
				const result = response;
				if(result[0] && result[0].level == 'Level1') {
					partList.maincompanylist = result[0].lstManagmentStrcture;
					partList.parentCompanyId = result[0].managementStructureId;
					partList.managementStructureId = result[0].managementStructureId;
					partList.parentBulist = []
					partList.parentDivisionlist = [];
					partList.parentDepartmentlist = [];
					partList.parentbuId = 0;
					partList.parentDivisionId = 0;
					partList.parentDeptId = 0;
				} else {
					partList.parentCompanyId = 0;
					partList.parentbuId = 0;
					partList.parentDivisionId = 0;
					partList.parentDeptId = 0;
					partList.maincompanylist = [];
					partList.parentBulist = []
					partList.parentDivisionlist = [];
					partList.parentDepartmentlist = [];
				}
				
				if(result[1] && result[1].level == 'Level2') {	
					partList.parentBulist = result[1].lstManagmentStrcture;
					partList.parentbuId = result[1].managementStructureId;
					partList.managementStructureId = result[1].managementStructureId;
					partList.parentDivisionlist = [];
					partList.parentDepartmentlist = [];					
					partList.parentDivisionId = 0;
					partList.parentDeptId = 0;
				} else {	
					if(result[1] && result[1].level == 'NEXT') {						
						partList.parentBulist = result[1].lstManagmentStrcture;
					}			
					partList.parentbuId = 0;
					partList.parentDivisionId = 0;
					partList.parentDeptId = 0;	
					partList.parentDivisionlist = [];
					partList.parentDepartmentlist = [];
				}

				if(result[2] && result[2].level == 'Level3') {	
					partList.parentDivisionlist = result[2].lstManagmentStrcture;
					partList.parentDivisionId = result[2].managementStructureId;
					partList.managementStructureId = result[2].managementStructureId;
					partList.parentDeptId = 0;	
					partList.parentDepartmentlist = [];
				} else {
					if(result[2] && result[2].level == 'NEXT') {						
						partList.parentDivisionlist = result[2].lstManagmentStrcture;
					}
					partList.parentDivisionId = 0;
					partList.parentDeptId = 0;				
					partList.parentDepartmentlist = [];
				}

				if(result[3] && result[3].level == 'Level4') {		
					partList.parentDepartmentlist = result[3].lstManagmentStrcture;;			
					partList.parentDeptId = result[3].managementStructureId;	
					partList.managementStructureId  = result[3].managementStructureId;				
				} else {
					partList.parentDeptId = 0;	
					if(result[3] && result[3].level == 'NEXT') {						
						partList.parentDepartmentlist = result[3].lstManagmentStrcture;
					}
				}
			}
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
		}
		this.getFunctionalReportCurrencyById(partList);
		this.getManagementStructureForChildEditAll(partList);
	}

	getManagementStructureForChildEditAll(partList)
	{
		if(partList.parentCompanyId > 0) {
			if (partList.childList) {
				for (let j = 0; j < partList.childList.length; j++) {
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
		} else {	
			if (partList.childList) {
				for (let j = 0; j < partList.childList.length; j++) {
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

		if(partList.parentbuId > 0) {
			if (partList.childList) {
				for (let j = 0; j < partList.childList.length; j++) {
					partList.childList[j].childBulist = partList.parentBulist;
					partList.childList[j].managementStructureId = partList.parentbuId;
					partList.childList[j].childbuId = partList.parentbuId;
					partList.childList[j].childDivisionlist = [];
					partList.childList[j].childDepartmentlist = [];
					partList.childList[j].childDivisionId = 0;
					partList.childList[j].childDeptId = 0;						
				}
			}
		} else {	
			if (partList.childList) {
				for (let j = 0; j < partList.childList.length; j++) {
					partList.childList[j].childbuId =0;
					partList.childList[j].childBulist =  partList.parentBulist;
					partList.childList[j].childDivisionlist = [];
					partList.childList[j].childDepartmentlist = [];
					partList.childList[j].childDivisionId = 0;
					partList.childList[j].childDeptId = 0;							
				}
			}
		}

		if(partList.parentDivisionId > 0) {
			if (partList.childList) {
				for (let j = 0; j < partList.childList.length; j++) {
					partList.childList[j].childDivisionlist = partList.parentDivisionlist;
					partList.childList[j].managementStructureId = partList.parentDivisionId;
					partList.childList[j].childDivisionId = partList.parentDivisionId;				
					partList.childList[j].childDepartmentlist = [];				
					partList.childList[j].childDeptId = 0;						
				}
			}
		} else {	
			if (partList.childList) {
				for (let j = 0; j < partList.childList.length; j++) {
					partList.childList[j].childDivisionlist =  partList.parentDivisionlist;
					partList.childList[j].childDepartmentlist = [];
					partList.childList[j].childDivisionId = 0;
					partList.childList[j].childDeptId = 0;							
				}
			}
		}

		if(partList.parentDeptId > 0) {
			if (partList.childList) {
				for (let j = 0; j < partList.childList.length; j++) {
					partList.childList[j].childDivisionlist = partList.parentDepartmentlist;
					partList.childList[j].managementStructureId = partList.parentDeptId;
					partList.childList[j].childDeptId = partList.parentDeptId;	
				}
			}
		} else {	
			if (partList.childList) {
				for (let j = 0; j < partList.childList.length; j++) {
					partList.childList[j].childDepartmentlist = partList.parentDepartmentlist;			
					partList.childList[j].childDeptId = 0;								
				}
			}
		}
	}

	
	getManagementStructureForChildEdit(partChildList) {
		var editMSID = this.isEditMode ? partChildList.managementStructureId : 0;
		this.commonService.getManagmentStrctureData(partChildList.managementStructureId,this.employeeId,editMSID).subscribe(response => {
			if(response) {
				const result = response;
				if(result[0] && result[0].level == 'Level1') {
					partChildList.maincompanylist =  result[0].lstManagmentStrcture;
					partChildList.childCompanyId = result[0].managementStructureId;
					partChildList.managementStructureId = result[0].managementStructureId;	
					partChildList.childBulist = [];
					partChildList.childDivisionlist = [];
					partChildList.childDepartmentlist = [];				
					partChildList.childbuId = 0;
					partChildList.childDivisionId = 0;
					partChildList.childDeptId = 0;				
				
				} else {
					partChildList.maincompanylist = [];
					partChildList.childBulist = [];
					partChildList.childDivisionlist = [];
					partChildList.childDepartmentlist = [];	
					partChildList.childCompanyId = 0;
					partChildList.childbuId = 0;
					partChildList.childDivisionId = 0;
					partChildList.childDeptId = 0;	
				}
				
				if(result[1] && result[1].level == 'Level2') {
					partChildList.childBulist =  result[1].lstManagmentStrcture;
					partChildList.managementStructureId = result[1].managementStructureId;
					partChildList.childbuId = result[1].managementStructureId;						
					partChildList.childDivisionlist = [];
					partChildList.childDepartmentlist = [];								
					partChildList.childDivisionId = 0;
					partChildList.childDeptId = 0;
				} else {
					if(result[1] && result[1].level == 'NEXT') {						
						partChildList.childBulist = result[1].lstManagmentStrcture;
					}					 
					partChildList.childDivisionlist = [];
					partChildList.childDepartmentlist = [];	
					partChildList.childbuId = 0;
					partChildList.childDivisionId = 0;
					partChildList.childDeptId = 0;	
				}

				if(result[2] && result[2].level == 'Level3') {		
					partChildList.childDivisionlist =  result[2].lstManagmentStrcture;		
					partChildList.childDivisionId = result[2].managementStructureId;		
					partChildList.managementStructureId = result[2].managementStructureId;			
					partChildList.childDeptId = 0;	
					partChildList.childDepartmentlist = [];				
				} else {
					if(result[2] && result[2].level == 'NEXT') {						
						partChildList.childDivisionlist = result[2].lstManagmentStrcture;
					}						
					partChildList.childDepartmentlist = [];	
					partChildList.childDivisionId = 0;
					partChildList.childDeptId = 0;	
				}

				if(result[3] && result[3].level == 'Level4') {		
					partChildList.childDepartmentlist = result[3].lstManagmentStrcture;;			
					partChildList.childDeptId = result[3].managementStructureId;	
					partChildList.managementStructureId = result[3].managementStructureId;				
				} else {
					if(result[3] && result[3].level == 'NEXT') {						
						partChildList.childDepartmentlist = result[3].lstManagmentStrcture;
					}
										
					partChildList.childDeptId = 0;
				}	
	
			}
		})
	}

	getBUList(legalEntityId) {
		this.headerInfo.buId = 0;
		this.headerInfo.divisionId = 0;
		this.headerInfo.departmentId = 0;	
		this.bulist = [];
		this.divisionlist = [];
		this.departmentList = [];
        if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
			this.headerInfo.managementStructureId = legalEntityId;	
			this.headerInfo.companyId = legalEntityId;		
			this.commonService.getManagementStructurelevelWithEmployee(legalEntityId,this.employeeId ).subscribe(res => {
                this.bulist = res;
			});
		}
	    else {
			 this.headerInfo.managementStructureId  = 0;
			 this.headerInfo.companyId = 0;
		 }
		
	}	
	
	getParentBUList(partList) {
		partList.parentBulist = [];
		partList.parentDivisionlist = [];
		partList.parentDepartmentlist = [];
		partList.parentbuId = 0;
		partList.parentDivisionId = 0;
		partList.parentDeptId = 0;
		if (partList.childList) {
		for (let j = 0; j < partList.childList.length; j++) {
			partList.childList[j].childCompanyId = partList.parentCompanyId;
			partList.childList[j].childBulist = [];
			partList.childList[j].childDivisionlist = [];
			partList.childList[j].childDepartmentlist = [];
			partList.childList[j].childbuId = 0;
			partList.childList[j].childDivisionId = 0;
			partList.childList[j].childDeptId = 0;
		}}
		
		if (partList.parentCompanyId != 0 && partList.parentCompanyId != null && partList.parentCompanyId != undefined) {
			partList.managementStructureId = partList.parentCompanyId;
			this.commonService.getManagementStructurelevelWithEmployee(partList.parentCompanyId,this.employeeId ).subscribe(res => {
				partList.parentBulist = res;
				if (partList.childList) {
					for (let j = 0; j < partList.childList.length; j++) {
						partList.childList[j].childBulist = partList.parentBulist;
						partList.childList[j].childCompanyId =  partList.parentCompanyId;
						partList.childList[j].managementStructureId = partList.parentCompanyId;
					}
				}

			});
		 } 
		  else {
			 partList.managementStructureId = 0;	
			 if (partList.childList) {
				for (let j = 0; j < partList.childList.length; j++) {					
					partList.childList[j].managementStructureId = 0;
				}
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
			partChildList.managementStructureId =  partChildList.childCompanyId ;
			this.commonService.getManagementStructurelevelWithEmployee(partChildList.childCompanyId,this.employeeId ).subscribe(res => {
                partChildList.childBulist = res;
			});
		}
		else {
		 	partChildList.managementStructureId  = 0;
		 }
	}

	getDivisionlist(buId) {
		this.divisionlist = [];
		this.departmentList = [];
		this.headerInfo.divisionId = 0;		
		this.headerInfo.departmentId = 0;		

		if (buId != 0 && buId != null && buId != undefined) {			
			this.headerInfo.managementStructureId = buId;
			this.headerInfo.buId = buId;
			this.commonService.getManagementStructurelevelWithEmployee(buId,this.employeeId ).subscribe(res => {
                this.divisionlist = res;
			});
			// for (let i = 0; i < this.partListData.length; i++) {
			// 	this.partListData[i].parentbuId = buId;
			// 	this.getParentDivisionlist(this.partListData[i]);
			// }		
		 }  else {
			 this.headerInfo.managementStructureId  = this.headerInfo.companyId;		
		 }

	}
	
	getParentDivisionlist(partList) {
	 	
	 	partList.parentDivisionlist = [];
	 	partList.parentDepartmentlist = [];		
	 	partList.parentDivisionId = 0;
	 	partList.parentDeptId = 0;
	 	if (partList.childList) {
	 		for (let j = 0; j < partList.childList.length; j++) {
	 			partList.childList[j].childbuId = partList.parentbuId;				
	 			partList.childList[j].childDivisionlist = [];
	 			partList.childList[j].childDepartmentlist = [];			
	 			partList.childList[j].childDivisionId = 0;
	 			partList.childList[j].childDeptId = 0;
	 		}}
	 	if (partList.parentbuId != 0 && partList.parentbuId != null && partList.parentbuId != undefined) {
             partList.managementStructureId = partList.parentbuId;
	 		this.commonService.getManagementStructurelevelWithEmployee(partList.parentbuId,this.employeeId ).subscribe(res => {
	 			partList.parentDivisionlist = res;
	 			if (partList.childList) {
					for (let j = 0; j < partList.childList.length; j++) {
	 					partList.childList[j].childDivisionlist = partList.parentDivisionlist;
	 					partList.childList[j].childbuId = partList.parentbuId;
	 					partList.childList[j].managementStructureId = partList.parentbuId;
	 				}
	 			}
	 		});
	 	}
	 	 else {
	 		 partList.managementStructureId  = partList.parentCompanyId;
	 		 if (partList.childList) {
	 			for (let j = 0; j < partList.childList.length; j++) {					
	 				partList.childList[j].managementStructureId =  partList.parentCompanyId;
	 			}
	 		}	
			 
	 	 }

	 	 this.getFunctionalReportCurrencyById(partList);
	 }

	

	getChildDivisionlist(partChildList) {	
		partChildList.childDivisionId = 0;
		partChildList.childDeptId = 0;
		partChildList.childDivisionlist = [];
		partChildList.childDepartmentlist = [];
		 if (partChildList.childbuId != 0 && partChildList.childbuId != null && partChildList.childbuId != undefined) {
		 	partChildList.managementStructureId = partChildList.childbuId;
		 	this.commonService.getManagementStructurelevelWithEmployee(partChildList.childbuId,this.employeeId ).subscribe(res => {
		 		partChildList.childDivisionlist = res;
		 	}); 
		 }
		  else {
		  	partChildList.managementStructureId  =  partChildList.childCompanyId;;
		  }

	}

	getDepartmentlist(divisionId) {
		this.headerInfo.departmentId = 0;
		this.departmentList = [];
		if (divisionId != 0 && divisionId != null && divisionId != undefined) {
		   this.headerInfo.divisionId = divisionId;
		   this.headerInfo.managementStructureId = divisionId;
		   this.commonService.getManagementStructurelevelWithEmployee(divisionId,this.employeeId ).subscribe(res => {
			this.departmentList = res;
		});
		//    for (let i = 0; i < this.partListData.length; i++) {
		// 	this.partListData[i].divisionId = divisionId;
		// 	this.getParentDeptlist(this.partListData[i]);
		// 	}
		}
		 else {
			 this.headerInfo.managementStructureId  = this.headerInfo.buId;
			 this.headerInfo.divisionId = 0;
		 }
	}
	getParentDeptlist(partList) {	
		partList.parentDeptId = 0;
		partList.parentDepartmentlist = [];	
		if (partList.childList) {
			for (let j = 0; j < partList.childList.length; j++) {	
				partList.childList[j].childDivisionId = partList.parentDivisionId;			
				partList.childList[j].childDepartmentlist = [];				
				partList.childList[j].childDeptId = 0;
			}}

		if (partList.parentDivisionId != 0 && partList.parentDivisionId != null && partList.parentDivisionId != undefined) {
			partList.managementStructureId = partList.parentDivisionId; 
				this.commonService.getManagementStructurelevelWithEmployee(partList.parentDivisionId ,this.employeeId ).subscribe(res => {
				partList.parentDepartmentlist = res;
				if (partList.childList) {
					for (let j = 0; j < partList.childList.length; j++) {
						partList.childList[j].childDepartmentlist = partList.parentDepartmentlist;
						partList.childList[j].childDivisionId = partList.parentDivisionId;
						partList.childList[j].managementStructureId = partList.parentDivisionId;
					}
				}
			});   
		}
		 else {
			 partList.managementStructureId  = partList.parentbuId;
			 if (partList.childList) {
				for (let j = 0; j < partList.childList.length; j++) {					
					partList.childList[j].managementStructureId =   partList.parentbuId;
				}
			}	
		 }	
		 this.getFunctionalReportCurrencyById(partList);	
	}
	getChildDeptlist(partChildList) {
		partChildList.childDepartmentlist = [];
		partChildList.childDeptId = 0;
		if (partChildList.childDivisionId != 0 && partChildList.childDivisionId != null && partChildList.childDivisionId != undefined) {
            partChildList.managementStructureId = partChildList.childDivisionId;
			this.commonService.getManagementStructurelevelWithEmployee(partChildList.childDivisionId ,this.employeeId ).subscribe(res => {
				partChildList.childDepartmentlist = res;
			});   
		}
		 else {
		 	partChildList.managementStructureId  = partChildList.childbuId;
		 }
	}
	
	getDepartmentId(departmentId) {
		if (departmentId != 0 && departmentId != null && departmentId != undefined) {
			this.headerInfo.managementStructureId = departmentId;
			this.headerInfo.departmentId = departmentId;			
			//  for (let i = 0; i < this.partListData.length; i++) {
		    // 	this.partListData[i].parentDeptId = departmentId;
		    // 	this.getParentDeptId(this.partListData[i]);			
		    // }
		}
		 else {
			 this.headerInfo.managementStructureId  = this.headerInfo.divisionId;
			 this.headerInfo.departmentId = 0;
		 }		
	}	
	getParentDeptId(partList) {
		if (partList.parentDeptId != 0 && partList.parentDeptId != null && partList.parentDeptId != undefined) {
			partList.managementStructureId = partList.parentDeptId;
			if (partList.childList) {
				for (let j = 0; j < partList.childList.length; j++) {
					partList.childList[j].childDeptId = partList.parentDeptId;
					this.getChildDeptId(partList.childList[j]);
				}
			}
		}
		 else {
			partList.managementStructureId = partList.parentDivisionId;
			if (partList.childList) {
				for (let j = 0; j < partList.childList.length; j++) {						
					partList.childList[j].managementStructureId = partList.parentDivisionId;	
					partList.childList[j].childDeptId = partList.parentDeptId;			
				}
			}
		 	
		 }		
		
		this.getFunctionalReportCurrencyById(partList);
	}

	getChildDeptId(partChildList) {
		if (partChildList.childDeptId != 0 && partChildList.childDeptId != null && partChildList.childDeptId != undefined) {
            partChildList.managementStructureId = partChildList.childDeptId;
		}
	   else {
			partChildList.managementStructureId = partChildList.childDivisionId;
		 }
	}
	
	getFunctionalReportCurrencyById(partList) {
		if(partList.managementStructureId != null && partList.managementStructureId != 0) {
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
			},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			});
		}
	}
	
	loadPOStatus() {		
        this.commonService.smartDropDownList('POStatus', 'POStatusId', 'Description').subscribe(response => { 		        
			if(response) {
			this.poStatusList = response;
            this.poStatusList = this.poStatusList.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));	
            response.forEach(x => {
                if (x.label.toUpperCase() == "OPEN") {
					this.headerInfo.statusId = x.value;
					this.poOpenstatusID = x.value;
                }
                else if (x.label.toUpperCase()  == "FULFILLING") {
                    this.poFulfillingstatusID = x.value;
                }
            }); }
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
	}

	loadApprovalProcessStatus() {		
        this.commonService.smartDropDownList('ApprovalProcess', 'ApprovalProcessId', 'Name').subscribe(response => { 		        
			if(response) { 
			response.forEach(x => {
                if (x.label.toUpperCase() == "APPROVED") {
                    this.ApprovedstatusId = x.value;
				}
				else if (x.label.toUpperCase() == "SENTFORINTERNALAPPROVAL") {
                    this.SentForInternalApprovalID = x.value;
				}
				else if (x.label.toUpperCase() == "SUBMITINTERNALAPPROVAL") {
                    this.SubmitInternalApprovalID = x.value;
				}
				else if (x.label.toUpperCase() == "SUBMITINTERNALAPPROVAL") {
                    this.pendingApprovalID = x.value;
				}		
				
            });}
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
	}

	enableNotes() {
	
	}

	onWOSelect(id)
	{
		this.arrayWOlist.push(id);
	}

	onSubWOSelect(id)
	{
		this.arraysubWOlist.push(id);
	}	

	onROSelect(id)
	{
		this.arrayROlist.push(id);
	}

	onSOSelect(id)
	{
		this.arraySOlist.push(id);
	}
	
	private salesStockRefData() {		
			if(this.salesOrderReferenceData){
                this.newObjectForParent.partNumberId = {value: this.salesOrderReferenceData.itemMasterId, label: this.salesOrderReferenceData.partNumber};
					const newObject = {
							...this.newObjectForParent,
							partNumberId: {value: this.salesOrderReferenceData.itemMasterId, label: this.salesOrderReferenceData.partNumber},
							needByDate: this.headerInfo.needByDate,
							priorityId: this.headerInfo.priorityId ? editValueAssignByCondition('value', this.headerInfo.priorityId) : null,
							discountPercent: {percentId: 0, percentValue: 'Select'}
						}
						this.getManagementStructureForParentEdit(newObject);
						this.getPNDetailsById(this.newObjectForParent)
				this.newObjectForParent.quantityOrdered = this.salesOrderReferenceData.quantity;
				this.newObjectForParent.managementStructureId = this.salesOrderReferenceData.quantity;
				this.newObjectForParent.conditionId = this.salesOrderReferenceData.conditionId;
			}
			//bind part details by stocklineid
			if(this.stocklineReferenceData){
						this.newObjectForParent.partNumberId = {value: this.stocklineReferenceData.itemMasterId, label: this.stocklineReferenceData.partNumber};
						this.getPNDetailsById(this.newObjectForParent);
				this.newObjectForParent.quantityOrdered = this.stocklineReferenceData.quantity;	
			}	
	}

	loadModuleListForVendorComp() {
		this.commonService.getModuleListForObtainOwnerTraceable().subscribe(res => {
			this.userTypes = res;
			this.userTypes.map(x => {
				if(x.moduleName.toUpperCase() == 'COMPANY') {
					this.companyModuleId = x.moduleId;
					this.sourcePoApproval.shipToUserTypeId = this.companyModuleId;
					this.sourcePoApproval.billToUserTypeId = this.companyModuleId;
				}
				else if(x.moduleName.toUpperCase() == 'VENDOR') {
					this.vendorModuleId = x.moduleId;					
				}
				else if(x.moduleName.toUpperCase() == 'CUSTOMER') {
					this.customerModuleId = x.moduleId;
				}
			});			
		}
		,err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);
		});
	}
	
	//#endregion
	// Load Vendor data
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
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);
		});
	}

	getVendorCreditTermsByID(vendorId) {
		this.headerInfo.creditLimit = '0.00';
		this.headerInfo.creditTerms = '';
		this.vendorService.getVendorCreditTermsByVendorId(vendorId).subscribe(res => {
			if(res) {
			this.headerInfo.creditLimit = res.creditLimit ? formatNumberAsGlobalSettingsModule(res.creditLimit, 2) : '0.00';
			this.headerInfo.creditTermsId = res.creditTermsId;
			this.headerInfo.creditTerms = res.creditTerms; }
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);
		});
	}

	getVendorPOHeaderById(poId) {	
		
		this.purchaseOrderService.getVendorPOHeaderById(poId).subscribe(res => {			
								
			this.headerInfo = {
				purchaseOrderNumber: res.purchaseOrderNumber,
				openDate: new Date(res.openDate),
				closedDate: res.closedDate ? new Date(res.closedDate) : '',
				needByDate: new Date(res.needByDate),
				priorityId: getObjectById('value', res.priorityId, this.allPriorityInfo),
				deferredReceiver: res.deferredReceiver,
				vendorId: getObjectById('vendorId', res.vendorId, this.allActions),
				vendorCode: getObjectById('vendorId', res.vendorId, this.allActions),
				//vendorCode: res.VendorCode,
				vendorContactId: this.getVendorContactsListByIDEdit(res),
				vendorContactPhone: this.getVendorContactsListByIDEdit(res),
				vendorName: getValueFromArrayOfObjectById('vendorName', 'vendorId', res.vendorId, this.allActions),
				creditLimit: res.creditLimit ? formatNumberAsGlobalSettingsModule(res.creditLimit, 2) : '0.00',
				creditTerms: res.creditTerms,
				creditTermsId: res.creditTermsId,
				requisitionerId: getObjectById('value', res.requestedBy, this.allEmployeeList),
				approverId: getObjectById('value', res.approverId, this.allEmployeeList),
				approvedDate: res.dateApproved ? new Date(res.dateApproved) : '',
				statusId: res.statusId,
				resale: res.resale,
				companyId: this.getManagementStructureDetails(res.managementStructureId,this.employeeId,res.managementStructureId),
                poMemo: res.poMemo,
				notes: res.notes,
                createdDate: res.createdDate,
				updatedDate:res.updatedDate,
				createdBy:res.createdBy,
				updatedBy:res.updatedBy 
			};			
			if(this.headerInfo.statusId == this.poOpenstatusID)
			{
				this.disableHeaderInfo = false;
			}
			else 
			{
				this.disableHeaderInfo = true;	
			}
			if(this.headerInfo.statusId == this.poFulfillingstatusID) {
				this.disableAddPart = true;	
			} else {
				this.disableAddPart = false;	
			}
			this.enableHeaderSaveBtn = false;
			this.capvendorId = res.vendorId;
			 this.warningsandRestriction(res.vendorId); 
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);
		});
	}

   
	getPurchaseOrderAllPartsById(poId) {	
		this.isSpinnerVisible = true;
		this.purchaseOrderService.getPurchaseOrderAllPartsById(poId,this.employeeId, this.workOrderPartNumberId).subscribe(res => {
			if(res) {
				this.BindAllParts(res);
				this.isSpinnerVisible = false;
				this.enableHeaderSaveBtn = false;
				}
				this.isSpinnerVisible = false;
		}, err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);
		});
	}
	BindAllParts(data) {
		this.partListData = [];
		this.newPartsList = [this.newObjectForParent];	
		if(data) {	
			data[0].map((x, pindex) => {
				this.newPartsList = {
					...x,							
					partNumberId: {value: x.itemMasterId, label: x.partNumber},					
					ifSplitShip: x.purchaseOrderSplitParts.length > 0 ? true : false,
					partNumber: x.partNumber,
					partDescription: x.partDescription,
					needByDate: x.needByDate ? new Date(x.needByDate) : '',
					conditionId: parseInt(x.conditionId),
					priorityId: parseInt(x.priorityId),
					discountPercent: x.discountPercent ? parseInt(x.discountPercent) : 0,							
					functionalCurrencyId: getObjectById('value', x.functionalCurrencyId, this.allCurrencyData),
					reportCurrencyId: getObjectById('value', x.reportCurrencyId, this.allCurrencyData),							
					workOrderId: getObjectById('value', x.workOrderId == null ? 0 : x.workOrderId, this.allWorkOrderInfo),
					repairOrderId: getObjectById('value', x.repairOrderId == null ? 0 : x.repairOrderId, this.allRepairOrderInfo),
					salesOrderId: getObjectById('value', x.salesOrderId == null ? 0 : x.salesOrderId, this.allSalesOrderInfo),
					quantityOrdered: x.quantityOrdered ? formatNumberAsGlobalSettingsModule(x.quantityOrdered, 0) : '0',
					vendorListPrice: x.vendorListPrice ? formatNumberAsGlobalSettingsModule(x.vendorListPrice, 2) : '0.00',
					discountPerUnit: x.discountPerUnit ? formatNumberAsGlobalSettingsModule(x.discountPerUnit, 2) : '0.00',
					discountAmount: x.discountAmount ? formatNumberAsGlobalSettingsModule(x.discountAmount, 2) : '0.00',
					unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
					extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00',
					isApproved: x.isApproved ? x.isApproved : false,							
					childList: this.getPurchaseOrderSplitPartsEdit(x, pindex,data[1]),
				}
				this.getManagementStructureForParentPart(this.newPartsList,data[1],data[3]);

				if (this.newPartsList.childList && this.newPartsList.childList.length > 0 ) {
					for(let i =0; i < this.newPartsList.childList.length; i++){
						this.getManagementStructureForChildPart(this.newPartsList.childList[i],data[1]);
					}
										
				}
			
				this.getPartItemDetailsById(this.newPartsList, data[2]);
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
			});		
		}
		this.enableHeaderSaveBtn = false;
	
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
	getPurchaseOrderSplitPartsEdit(partList, pindex,ms?) {
		if (partList.purchaseOrderSplitParts) {
			return partList.purchaseOrderSplitParts.map((y, cindex) => {
				const splitpart = {
					...y,
					needByDate: y.needByDate ? new Date(y.needByDate) : '',
					isApproved: y.isApproved ? y.isApproved : false,
					partListUserTypeId: y.poPartSplitUserTypeId,
					poPartSplitSiteId : y.poPartSplitSiteId,
					priorityId: partList.priorityId ? getValueFromArrayOfObjectById('label', 'value', partList.priorityId, this.allPriorityInfo) : null,
					partListUserId: this.getPartSplitUserIdEdit(y, pindex, cindex),
					partListAddressId: y.poPartSplitAddressId ? y.poPartSplitAddressId : 0,
					quantityOrdered: y.quantityOrdered ? formatNumberAsGlobalSettingsModule(y.quantityOrdered, 0) : '0'				
				}
				//this.getManagementStructureForChildPart(splitpart,ms);
				return splitpart;
			})
		}
	}

	getManagementStructureForChildPart(partChildList,response) {
			if(response) {				
				const result = response[partChildList.purchaseOrderPartRecordId];
				if(result[0] && result[0].level == 'Level1') {
					partChildList.maincompanylist =  result[0].lstManagmentStrcture;
					partChildList.childCompanyId = result[0].managementStructureId;
					partChildList.managementStructureId = result[0].managementStructureId;	
					partChildList.childBulist = [];
					partChildList.childDivisionlist = [];
					partChildList.childDepartmentlist = [];				
					partChildList.childbuId = 0;
					partChildList.childDivisionId = 0;
					partChildList.childDeptId = 0;				
				
				} else {
					partChildList.maincompanylist = [];
					partChildList.childBulist = [];
					partChildList.childDivisionlist = [];
					partChildList.childDepartmentlist = [];	
					partChildList.childCompanyId = 0;
					partChildList.childbuId = 0;
					partChildList.childDivisionId = 0;
					partChildList.childDeptId = 0;	
				}
				
				if(result[1] && result[1].level == 'Level2') {
					partChildList.childBulist =  result[1].lstManagmentStrcture;
					partChildList.managementStructureId = result[1].managementStructureId;
					partChildList.childbuId = result[1].managementStructureId;						
					partChildList.childDivisionlist = [];
					partChildList.childDepartmentlist = [];								
					partChildList.childDivisionId = 0;
					partChildList.childDeptId = 0;
				} else {
					if(result[1] && result[1].level == 'NEXT') {						
						partChildList.childBulist = result[1].lstManagmentStrcture;
					}					
					partChildList.childDivisionlist = [];
					partChildList.childDepartmentlist = [];	
					partChildList.childbuId = 0;
					partChildList.childDivisionId = 0;
					partChildList.childDeptId = 0;	
				}

				if(result[2] && result[2].level == 'Level3') {		
					partChildList.childDivisionlist =  result[2].lstManagmentStrcture;		
					partChildList.childDivisionId = result[2].managementStructureId;		
					partChildList.managementStructureId = result[2].managementStructureId;			
					partChildList.childDeptId = 0;	
					partChildList.childDepartmentlist = [];				
				} else {
					if(result[2] && result[2].level == 'NEXT') {						
						partChildList.childDivisionlist = result[2].lstManagmentStrcture;
					}				
					partChildList.childDepartmentlist = [];	
					partChildList.childDivisionId = 0;
					partChildList.childDeptId = 0;	
				}

				if(result[3] && result[3].level == 'Level4') {		
					partChildList.childDepartmentlist = result[3].lstManagmentStrcture;;			
					partChildList.childDeptId = result[3].managementStructureId;	
					partChildList.managementStructureId = result[3].managementStructureId;				
				} else {
					if(result[3] && result[3].level == 'NEXT') {						
						partChildList.childDepartmentlist = result[3].lstManagmentStrcture;
					}									
					partChildList.childDeptId = 0;
				}	
	
			}
	
	}

	getPartItemDetailsById(parentdata,response) {	
		this.showInput = true;
		const itemMasterId = getValueFromObjectByKey('value', parentdata.partNumberId)
		this.sourcePoApproval.itemMasterId = itemMasterId;
		this.partWithId = [];
		this.altPartNumList = [];
		//parentdata.altEquiPartNumberId = null;
		this.itemTypeId = 1;
        const data1 = response[parentdata.purchaseOrderPartRecordId];
		if(data1) {
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
					if(parentdata.altEquiPartNumberId) {
						parentdata.altEquiPartNumberId = getObjectById('altEquiPartNumberId', parentdata.altEquiPartNumberId, this.altPartNumList);
					} else if(this.altPartNumList.length > 0) {
						parentdata.altEquiPartNumberId = this.altPartNumList[0];
					}
										
				}
			}
			
	}

	getFunctionalReportCurrencyforPart(partList,responseFC) {
		if(partList.managementStructureId != null && partList.managementStructureId != 0) {
			if(responseFC) {
				const result = responseFC[partList.managementStructureId]
				partList.functionalCurrencyId = {
					label: result.functionalCurrencyCode,
					value: result.functionalCurrencyId
				}
				partList.reportCurrencyId = {
					label: result.reportingCurrencyCode,
					value: result.reportingCurrencyId
				}
				this.getFXRate(partList);
			}
		}
	}

	getManagementStructureForParentPart(partList,response,responseFC) {
	     	if(response) {
				const result = response[partList.purchaseOrderPartRecordId];
				if(result[0] && result[0].level == 'Level1') {
					partList.maincompanylist = result[0].lstManagmentStrcture;
					partList.parentCompanyId = result[0].managementStructureId;
					partList.managementStructureId = result[0].managementStructureId;
					partList.parentBulist = []
					partList.parentDivisionlist = [];
					partList.parentDepartmentlist = [];
					partList.parentbuId = 0;
					partList.parentDivisionId = 0;
					partList.parentDeptId = 0;
				} else {
					partList.parentCompanyId = 0;
					partList.parentbuId = 0;
					partList.parentDivisionId = 0;
					partList.parentDeptId = 0;
					partList.maincompanylist = [];
					partList.parentBulist = []
					partList.parentDivisionlist = [];
					partList.parentDepartmentlist = [];
				}
				
				if(result[1] && result[1].level == 'Level2') {	
					partList.parentBulist = result[1].lstManagmentStrcture;
					partList.parentbuId = result[1].managementStructureId;
					partList.managementStructureId = result[1].managementStructureId;
					partList.parentDivisionlist = [];
					partList.parentDepartmentlist = [];					
					partList.parentDivisionId = 0;
					partList.parentDeptId = 0;
				} else {	
					if(result[1] && result[1].level == 'NEXT') {						
						partList.parentBulist = result[1].lstManagmentStrcture;
					}				
					partList.parentbuId = 0;
					partList.parentDivisionId = 0;
					partList.parentDeptId = 0;	
					partList.parentDivisionlist = [];
					partList.parentDepartmentlist = [];
				}

				if(result[2] && result[2].level == 'Level3') {	
					partList.parentDivisionlist = result[2].lstManagmentStrcture;
					partList.parentDivisionId = result[2].managementStructureId;
					partList.managementStructureId = result[2].managementStructureId;
					partList.parentDeptId = 0;	
					partList.parentDepartmentlist = [];
				} else {
					if(result[2] && result[2].level == 'NEXT') {						
						partList.parentDivisionlist = result[2].lstManagmentStrcture;
					}
					partList.parentDivisionId = 0;
					partList.parentDeptId = 0;	
					partList.parentDepartmentlist = [];
				}

				if(result[3] && result[3].level == 'Level4') {		
					partList.parentDepartmentlist = result[3].lstManagmentStrcture;;			
					partList.parentDeptId = result[3].managementStructureId;	
					partList.managementStructureId  = result[3].managementStructureId;				
				} else {
					partList.parentDeptId = 0;	
					if(result[3] && result[3].level == 'NEXT') {						
						partList.parentDepartmentlist = result[3].lstManagmentStrcture;
					}
				}
			}	
		this.getFunctionalReportCurrencyforPart(partList,responseFC);
	}


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
	
	
	
	getPartSplitUserIdEdit(data, pindex, cindex) {
		if (data.poPartSplitUserTypeId === this.customerModuleId) {		
			this.onUserNameChange( this.customerModuleId,data.poPartSplitUserId, data, pindex, cindex);
			return getObjectById('value', data.poPartSplitUserId, this.allCustomers);
		}
		if (data.poPartSplitUserTypeId === this.vendorModuleId) {
			this.onUserNameChange( this.vendorModuleId,data.poPartSplitUserId, data, pindex, cindex);
			return getObjectById('vendorId', data.poPartSplitUserId, this.allActions);
		}
		if (data.poPartSplitUserTypeId === this.companyModuleId) {
			this.onUserNameChange(this.companyModuleId,data.poPartSplitUserId, data, pindex, cindex);
			return getObjectById('value', data.poPartSplitUserId, this.legalEntity);
		}
	}
	

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

    onUserNameChange(moduleID, userID, data?, pindex?, cindex?, siteID?) {      
		if(moduleID == this.vendorModuleId){
			this.arrayVendlsit.push(userID); pindex
		}
		else if (moduleID == this.customerModuleId) {
			this.arrayCustlist.push(userID); 
		}
		else if (moduleID == this.companyModuleId) {
			this.arrayLegalEntitylsit.push(userID); 
		}

		this.commonService.getaddressdetailsOnlyUserbyuser(moduleID, userID, 'Ship',this.poId).subscribe(
			returnddataforbill => {
				if(returnddataforbill) {
				this["splitAddressData" + pindex + cindex] = [];
				this["splitAddressData" + pindex + cindex] = returnddataforbill.address;
				if(!data || data == null) {
					if(returnddataforbill.address && returnddataforbill.address.length > 0) {
							for(var i =0; i < returnddataforbill.address.length; i++) {
								if(returnddataforbill.address[i].isPrimary) {			
									this.partListData[pindex].childList[cindex].poPartSplitSiteId = returnddataforbill.address[i].siteID;
								}
							}
					}
				}
				
				if(siteID && siteID > 0)  {     
					this.partListData[pindex].childList[cindex].poPartSplitSiteId = siteID;
				}
			}
			},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
		
	}

	

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



	


	getPNDetailsById(parentdata, value?) {	
		this.showInput = true;
		const itemMasterId = getValueFromObjectByKey('value', parentdata.partNumberId)
		this.sourcePoApproval.itemMasterId = itemMasterId;
		this.partWithId = [];
		this.altPartNumList = [];
		parentdata.altEquiPartNumberId = null;
		if(value != 'onEdit') {
			parentdata.needByDate = this.headerInfo.needByDate;
			parentdata.conditionId = this.defaultCondtionId;
			parentdata.priorityId = this.headerInfo.priorityId ? editValueAssignByCondition('value', this.headerInfo.priorityId) : null;
			parentdata.quantityOrdered = '0';
			parentdata.workOrderId = null;
			parentdata.repairOrderId = null;
			parentdata.salesOrderId = null;
			parentdata.memo = null;
			//this.getManagementStructureForParentEdit(parentdata,this.employeeId);
		}
		this.itemTypeId = 1;

		//For Getting Data After Part Selected
		this.purchaseOrderService.getPartDetailsWithidForSinglePart(itemMasterId).subscribe(
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
					parentdata.altPartCollection = this.partWithId.altPartNumList;
					if(parentdata.conditionId && value != 'onEdit') {
						this.getPriceDetailsByCondId(parentdata);
					}
					this.altPartNumList = this.partWithId.altPartNumList;
					if(parentdata.altEquiPartNumberId && value == 'onEdit') {
						parentdata.altEquiPartNumberId = getObjectById('altEquiPartNumberId', parentdata.altEquiPartNumberId, this.altPartNumList);
					} else if(this.altPartNumList.length > 0) {
						parentdata.altEquiPartNumberId = this.altPartNumList[0];
					}
										
				}
			}, err => {				
				const errorLog = err;
				this.errorMessageHandler(errorLog);
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
	}

	getPriceDetailsByCondId(parentdata) {
		// const condId = getValueFromObjectByKey('conditionId', parentdata.conditionId);
		this.commonService.getPriceDetailsByCondId(parentdata.itemMasterId, parentdata.conditionId).subscribe(res => {
			if(res) {
				parentdata.vendorListPrice = res.vendorListPrice ? formatNumberAsGlobalSettingsModule(res.vendorListPrice, 2) : '0.00';
				parentdata.unitCost = res.unitCost ? formatNumberAsGlobalSettingsModule(res.unitCost, 2) : '0.00';
				parentdata.discountPercent = res.discountPercent ? res.discountPercent : 0;
				parentdata.discountPerUnit = res.discountPerUnit ? formatNumberAsGlobalSettingsModule(res.discountPerUnit, 2) : '0.00';
				this.onGetDiscPerUnit(parentdata);
				this.onGetDiscAmount(parentdata);
				this.onGetExtCost(parentdata);
			}
		})
	}
	
	onGetDiscPerUnit(partList) {
		if (partList.vendorListPrice !== null && partList.vendorListPrice !== 0) {
			let discountPercentValue;
			if(partList.discountPercent !== 0 && partList.discountPercent != null) {
				discountPercentValue = parseFloat(getValueFromArrayOfObjectById('percentValue', 'percentId', partList.discountPercent, this.allPercentData));
			} else {
				discountPercentValue = 0;
			}
			const vendorListPrice = partList.vendorListPrice ? parseFloat(partList.vendorListPrice.toString().replace(/\,/g,'')) : 0;
			const discountPerUnit = (vendorListPrice * discountPercentValue) / 100;
			partList.discountPerUnit = formatNumberAsGlobalSettingsModule(discountPerUnit, 2);			
		}
		partList.quantityOrdered = partList.quantityOrdered ? formatNumberAsGlobalSettingsModule(partList.quantityOrdered, 0) : '0';
		this.onGetUnitCost(partList);
		partList.vendorListPrice = partList.vendorListPrice ? formatNumberAsGlobalSettingsModule(partList.vendorListPrice, 2) : '0.00';
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

	getTotalDiscAmount() {
		this.totalDiscAmount = 0;
		this.partListData.map(x => {			
			x.tempDiscAmt = x.discountAmount ? parseFloat(x.discountAmount.toString().replace(/\,/g,'')) : 0;
			this.totalDiscAmount += x.tempDiscAmt;
		})
		this.totalDiscAmount = this.totalDiscAmount ? formatNumberAsGlobalSettingsModule(this.totalDiscAmount, 2) : '0.00';
	}

	
	onGetExtCost(partList) {
		this.onGetUnitCost(partList);
		if (partList.quantityOrdered !== null && partList.unitCost !== null) {
			const quantityOrdered = partList.quantityOrdered ? parseInt(partList.quantityOrdered.toString().replace(/\,/g,'')) : 0;
			const unitCost = partList.unitCost ? parseFloat(partList.unitCost.toString().replace(/\,/g,'')) : 0;
			// partList.extendedCost = (partList.quantityOrdered * partList.unitCost);
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
			this.getVendorCreditTermsByID(res.vendorId);
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);
		});
	}

	getApproversListById(poId) {	
		this.isSpinnerVisible = true;
		if(this.poApprovaltaskId == 0) {
		this.commonService.smartDropDownList('ApprovalTask', 'ApprovalTaskId', 'Name').subscribe(response => { 		        
		if(response) {					
            response.forEach(x => {
                if (x.label.toUpperCase() == "PO APPROVAL") {
                    this.poApprovaltaskId = x.value;
                }              
			});
			this.getApproversByTask(poId)
		}
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
		}
		else {
			this.getApproversByTask(poId)
		}
		
	}
	getApproversByTask(poId) {		
		this.isSpinnerVisible = true;
		this.purchaseOrderService.approverslistbyTaskId(this.poApprovaltaskId, poId).subscribe(res => {
						 this.internalApproversList = res;
						 this.internalApproversList.map(x => {
							this.apporoverEmailList = x.approverEmails;
							this.apporoverNamesList.push(x.approverName);
						})
						 this.isSpinnerVisible = false;
						},
						err =>{
							 this.isSpinnerVisible = false;
						 });
	}
	
	getApprovalProcessListById(poId) {
		this.isSpinnerVisible = true;
		this.selectallApprovers = false;
		this.enableApproverSaveBtn = false;
		this.purchaseOrderService.getPOApprovalListById(poId).subscribe(res => {
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
					previousstatusId: x.statusId,
					unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
					extCost: x.extCost ? formatNumberAsGlobalSettingsModule(x.extCost, 2) : '0.00'
				}
			});
			if(this.approvalProcessList && this.approvalProcessList.length > 0) {
			var approvalProcessListWithChild:any[] = [];
			this.approvalProcessList = this.approvalProcessList.forEach(element => {
				if(element.isParent) {
					approvalProcessListWithChild.push(element);
                    this.approvalProcessList.filter(x => x.parentId == element.purchaseOrderPartId).forEach(					
						child => {	if(child) {
							approvalProcessListWithChild.push(child);
						}}
					);
				}
			});
			this.approvalProcessList = approvalProcessListWithChild;	
				}	
			this.isSpinnerVisible = false; 
		}, err => {
			this.isSpinnerVisible = false;						
			const errorLog = err;
			this.errorMessageHandler(errorLog);						
		});
	}
	
	getVendorCapesByID(vendorId) {
		const status = 'active';	
        if(vendorId != undefined) {
			this.isSpinnerVisible = true;
            this.vendorService.getVendorCapabilityList(status, vendorId).subscribe(   
				results => {this.onDataLoadVendorCapsSuccessful(results[0])	}
				,err => {
					this.isSpinnerVisible = false;						
					const errorLog = err;
					this.errorMessageHandler(errorLog);					
				});
		}
	}

	public onDataLoadVendorCapsSuccessful(allWorkFlows: any[]) {
        this.vendorCapesInfo = allWorkFlows.map(x => {
			return {
				...x,
				cost: x.cost ? formatNumberAsGlobalSettingsModule(x.cost, 2) : '0.00'
			}
		});   
		this.isSpinnerVisible = false;    
	}	

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

	getShipToUserIdEdit(data) {
		if (data.shipToUserType === this.customerModuleId) {
			this.tempShipTOAddressId = data.shipToAddressId;
			this.onShipToCustomerSelected(data.shipToUserId, data, data.shipToSiteId, 'shipEdit');
			this.getShipViaEdit(data);
			return getObjectById('value', data.shipToUserId, this.allCustomers);
		}
		if (data.shipToUserType === this.vendorModuleId) {
			this.tempShipTOAddressId = data.shipToAddressId;
			this.onShipToVendorSelected(data.shipToUserId, data, data.shipToSiteId, 'shipEdit');
			this.getShipViaEdit(data);
			return getObjectById('vendorId', data.shipToUserId, this.allActions);
		}
		if (data.shipToUserType === this.companyModuleId) {			
			this.tempShipTOAddressId = data.shipToAddressId;		
			this.shipToSelectedvalue = data.shipToUserId;
			this.companyService.getShippingCompanySiteNames(this.shipToSelectedvalue).subscribe(response => {
				this.companySiteList_Shipping = response;
				if (this.isEditMode) {
                    if (data.shipToSiteId == 0) {
                        this.companySiteList_Shipping.push({ legalEntityShippingAddressId: 0, siteName: data.shipToSiteName, addressId: data.shipToAddressId });
						this.shipToAddress.address1 = data.shipToAddress1;
						this.shipToAddress.address2 = data.shipToAddress2;						
						this.shipToAddress.city = data.shipToCity;
						this.shipToAddress.stateOrProvince = data.shipToState;
						this.shipToAddress.postalCode = data.shipToPostalCode;
						this.shipToAddress.country = data.shipToCountry;
					} else {
                        this.onShipToGetCompanyAddress(data.shipToSiteId);
					}
				}
			},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			});
			this.companyService.getCompanyContacts(this.shipToSelectedvalue).subscribe(response => {
				this.contactListForCompanyShipping = response;
				this.sourcePoApproval.shipToContactId = getObjectById('contactId', data.shipToContactId, this.contactListForCompanyShipping);
			},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			});
			this.getShipViaEdit(data);			
			return getObjectById('value', data.shipToUserId, this.legalEntity);
		}
	}

	onShipToCustomerSelected(customerId, res?, id?, value?) {	
		this.clearInputOnClickUserIdShipTo();
		this.shipToSelectedvalue = customerId;
		this.customerService.getCustomerShipAddressGet(customerId).subscribe(
			returnddataforbill => {
				this.shipToCusData = returnddataforbill[0];
				for(var i =0; i < this.shipToCusData.length; i++) {
					if(this.shipToCusData[i].isPrimary && value != 'shipEdit') {
						this.sourcePoApproval.shipToSiteId = this.shipToCusData[i].customerShippingAddressId;
						this.sourcePoApproval.shipToAddressId = this.shipToCusData[i].AddressId;
					}
				}
				if (id) {
					res.shipToSiteId = id;
				}
				if (this.isEditMode) {
					if(res){
						if (res.shipToSiteId == 0) {
						this.shipToCusData.push({ customerShippingAddressId: 0, addressId:res.shipToAddressId, address1: res.shipToAddress1, address2: res.shipToAddress2, city: res.shipToCity, stateOrProvince: res.shipToState, postalCode: res.shipToPostalCode, country: res.shipToCountry, siteName: res.shipToSiteName })
					}}
				}
				this.onShipToGetAddress(res, res.shipToSiteId);
			}, err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			});

		this.customerService.getContacts(customerId).subscribe(data => {
			this.shipToContactData = data[0];
			for(var i =0; i < this.shipToContactData.length; i++) {
				if(this.shipToContactData[i].isDefaultContact) {
					this.sourcePoApproval.shipToContactId = this.shipToContactData[i];
				}
			}
			if (this.isEditMode && value == 'shipEdit') {
				this.sourcePoApproval.shipToContactId = getObjectById('contactId', res.shipToContactId, this.shipToContactData);
			}
		},
		err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
		this.getShipViaDetailsForShipTo(res.shipViaId);
	}

	
	clearInputOnClickUserIdShipTo() {
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
	}

	
	getShipViaDetailsForShipTo(id?) {		
		this.commonService.getShipViaDetailsByModule(this.sourcePoApproval.shipToUserTypeId, this.shipToSelectedvalue).subscribe(response => {
			this.shipViaList = response;
			for(var i =0; i < this.shipViaList.length; i++) {
				if(this.shipViaList[i].isPrimary) {
					this.sourcePoApproval.shipViaId = this.shipViaList[i].shipViaId;
					this.getShipViaDetails(this.sourcePoApproval.shipViaId);
				}
			}
			if (id) {
				this.sourcePoApproval.shipViaId = id;
				this.getShipViaDetails(id);
			}
		},
		err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		})
	}

	getShipViaDetails(id) {	
		
		this.sourcePoApproval.shippingAcctNum = null;
		var userType = this.sourcePoApproval.shipToUserTypeId ? parseInt(this.sourcePoApproval.shipToUserTypeId) : 0;
		const shippingViaId = id ? getValueFromArrayOfObjectById('shippingViaId', 'shipViaId', id, this.shipViaList) : 0;
		if(shippingViaId != 0 && shippingViaId != null) {
			
			this.commonService.getShipViaDetailsById(shippingViaId, userType).subscribe(res => {
				const responseData = res;
				this.sourcePoApproval.shippingAcctNum = responseData.shippingAccountInfo;
                this.sourcePoApproval.shipVia = responseData.shipVia;					
				
			},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			})
		} 		
	}
	
	onShipToGetAddress(data, id) {		
		this.shipToAddress = {};
		if (data.shipToUserTypeId == this.customerModuleId || data.shipToUserType == this.customerModuleId) {
			this.shipToAddress = getObjectById('customerShippingAddressId', id, this.shipToCusData);
		}
		else if (data.shipToUserTypeId == this.vendorModuleId || data.shipToUserType == this.vendorModuleId) {
			this.shipToAddress = getObjectById('vendorShippingAddressId', id, this.vendorSelected);
		}
		this.shipToAddress = { ...this.shipToAddress, country: this.shipToAddress.countryName ? this.shipToAddress.countryName : this.shipToAddress.country }
	}
	
	getShipViaEdit(data) {
		this.commonService.getShipViaDetailsByModule(data.shipToUserType, this.shipToSelectedvalue).subscribe(response => {
			this.shipViaList = response;
			this.sourcePoApproval.shippingAcctNum = data.shippingAccountNo;
			this.sourcePoApproval.shipViaId = data.shipViaId;
			if(this.sourcePoApproval.shipViaId) {
				this.getShipViaDetails(this.sourcePoApproval.shipViaId);
			}
			if (data.shipViaId == 0) {
				this.shipViaList.push({ shipViaId: 0, name: data.shipVia, shippingAccountInfo: data.shippingAcctNum });
				this.sourcePoApproval.shippingAcctNum = data.shippingAcctNum;
			} 
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
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
                        this.sourcePoApproval.shipToSiteId = this.vendorSelected[i].vendorShippingAddressId;
                        this.sourcePoApproval.shipToAddressId = this.vendorSelected[i].AddressId;
					}
				}
				if (id) {
                    res.shipToSiteId = id;
				}
				if (this.isEditMode && res) {
                    if (res.shipToSiteId == 0) {
                        this.vendorSelected.push({ vendorShippingAddressId: 0, addressId: res.shipToAddressId, address1: res.shipToAddress1, address2: res.shipToAddress2, city: res.shipToCity, stateOrProvince: res.shipToState, postalCode: res.shipToPostalCode, country: res.shipToCountry, siteName: res.shipToSiteName })
					}
				}
				if(res) {
                    this.onShipToGetAddress(res, res.shipToSiteId);
				} else {
                    this.onShipToGetAddress(this.sourcePoApproval, this.sourcePoApproval.shipToSiteId);
				}
			},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			});
		this.vendorService.getContacts(vendorId).subscribe(data => {
			this.vendorContactsForshipTo = data[0];
			for(var i =0; i < this.vendorContactsForshipTo.length; i++) {
				if(this.vendorContactsForshipTo[i].isDefaultContact) {
					this.sourcePoApproval.shipToContactId = this.vendorContactsForshipTo[i];
				}
			}
			if (this.isEditMode && value == 'shipEdit') {
				this.sourcePoApproval.shipToContactId = getObjectById('contactId', res.shipToContactId, this.vendorContactsForshipTo);
			}	

			this.commonService.getShipViaDetailsByModule(this.sourcePoApproval.shipToUserTypeId, vendorId).subscribe(res => {
				this.shipViaList = res;
						},err => {
							this.isSpinnerVisible = false;
							const errorLog = err;
							this.errorMessageHandler(errorLog);		
						});
            this.getShipViaDetailsForShipTo(res.shipViaId);
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
	}

	onShipToGetCompanyAddress(id) {
		this.shipToAddress = {};		
		this.companyService.getShippingAddress(id).subscribe(res => {			
			const resp = res;
            if (resp) {
                this.shipToAddress.addressId = resp.addressId;
				this.shipToAddress.address1 = resp.line1;
				this.shipToAddress.address2 = resp.line2;				
				this.shipToAddress.city = resp.city;
				this.shipToAddress.stateOrProvince = resp.stateOrProvince;
				this.shipToAddress.postalCode = resp.postalCode;
				this.shipToAddress.countryId = resp.countryId;
				this.shipToAddress.country = getValueFromArrayOfObjectById('label', 'value', resp.countryId, this.allCountriesList);
            } else {
                this.shipToAddress.addressId = 0;
				this.shipToAddress.address1 = '';
				this.shipToAddress.address2 = '';				
				this.shipToAddress.city = '';
				this.shipToAddress.stateOrProvince = '';
				this.shipToAddress.postalCode = '';
				this.shipToAddress.country = '';
				this.shipToAddress.countryId = null;
			}
				},
		err => {			
			const errorLog = err;
			this.errorMessageHandler(errorLog);});		
	}	

	errorMessageHandler(log) {
		const errorLog = log;
		var msg = '';
		if(errorLog.message) {
		  if (errorLog.error && errorLog.error.errors.length > 0) {
					for (let i = 0; i < errorLog.error.errors.length; i++){
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
			); }
	}

	getLegalEntityDetailsById() {
		this.commonService.getLegalEntityIdByMangStrucId(this.currentUserManagementStructureId).subscribe(res => {
			this.currentUserLegalEntityId = res.legalEntityId;
			this.getInactiveObjectForLEOnEdit('value', this.currentUserLegalEntityId, this.legalEntity, 'LegalEntity', 'LegalEntityId', 'Name');
			this.isSpinnerVisible = false;			
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
	}

	
	getInactiveObjectForLEOnEdit(string, id, originalData, tableName, primaryColumn, description) {
        if(id) {
            for(let i=0; i < originalData.length; i++) {
                if(originalData[i][string] == id) {
                    this.sourcePoApproval.shipToUserId = originalData[i];
					this.sourcePoApproval.billToUserId = originalData[i];
					this.onShipToCompanySelected(originalData[i]);
					this.onBillToCompanySelected(originalData[i]);
                } 
            }
            let obj: any = {};
            this.commonService.smartDropDownGetObjectById(tableName, primaryColumn, description, primaryColumn, id).subscribe(res => {
				obj = res[0];
				this.legalEntity = [...originalData, obj];
				this.sourcePoApproval.shipToUserId = obj;
				this.sourcePoApproval.billToUserId = obj;
				this.onShipToCompanySelected(obj);
				this.onBillToCompanySelected(obj);
			},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			});
		} else {
            return null;
        }
	}	
	
	onShipToCompanySelected(object?, res?, id?) {
		this.clearInputOnClickUserIdShipTo();
		this.shipToSelectedvalue = object ? object.value : this.shipToSelectedvalue;
		this.companyService.getShippingCompanySiteNames(this.shipToSelectedvalue).subscribe(response => {
			this.companySiteList_Shipping = response;
			for(var i =0; i < this.companySiteList_Shipping.length; i++) {
				if(this.companySiteList_Shipping[i].isPrimary) {
					this.sourcePoApproval.shipToSiteId = this.companySiteList_Shipping[i].legalEntityShippingAddressId;
					this.sourcePoApproval.shipToAddressId = this.companySiteList_Shipping[i].AddressId;
					this.onShipToGetCompanyAddress(this.sourcePoApproval.shipToSiteId);
				}
			}
			if (id) {
				res.shipToSiteId = id;
				this.onShipToGetCompanyAddress(id);
			}
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
		this.companyService.getCompanyContacts(this.shipToSelectedvalue).subscribe(response => {
			this.contactListForCompanyShipping = response;
			for(var i =0; i < this.contactListForCompanyShipping.length; i++) {
				if(this.contactListForCompanyShipping[i].isDefaultContact) {
					this.sourcePoApproval.shipToContactId = this.contactListForCompanyShipping[i];
				}
			}
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
		this.getShipViaDetailsForShipTo();
	}

	onBillToCompanySelected(object?, response?, id?) {
		this.clearInputOnClickUserIdBillTo();
		this.billToSelectedvalue = object ? object.value : this.billToSelectedvalue;
		this.companyService.getBillingCompanySiteNames(this.billToSelectedvalue).subscribe(res => {
			this.companySiteList_Billing = res;
			for(var i =0; i < this.companySiteList_Billing.length; i++) {
				if(this.companySiteList_Billing[i].isPrimary) {
					this.sourcePoApproval.billToSiteId = this.companySiteList_Billing[i].legalEntityBillingAddressId;
					this.sourcePoApproval.billToAddressId = this.companySiteList_Billing[i].AddressId;
					this.onBillToGetCompanyAddress(this.sourcePoApproval.billToSiteId);
				}
			}
			if (id) {
				response.billToSiteId = id;
				this.onBillToGetCompanyAddress(id);
			}
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
		this.companyService.getCompanyContacts(this.billToSelectedvalue).subscribe(res => {
			this.contactListForCompanyBilling = res;
			for(var i =0; i < this.contactListForCompanyBilling.length; i++) {
				if(this.contactListForCompanyBilling[i].isDefaultContact) {
					this.sourcePoApproval.billToContactId = this.contactListForCompanyBilling[i];
				}
			}
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
		// this.commonService.getShipViaDetailsByModule(this.sourcePoApproval.billToUserTypeId, this.billToSelectedvalue).subscribe(res => {
		// 	this.shipViaList = res;
		// },err => {
		// 	this.isSpinnerVisible = false;
		// 	const errorLog = err;
		// 	this.errorMessageHandler(errorLog);		
		// });
	}

	clearInputOnClickUserIdBillTo() {
		this.sourcePoApproval.billToSiteId = 0;
		this.sourcePoApproval.billToContactId = 0;
		this.billToAddress = {};
		this.sourcePoApproval.billToMemo = '';
		this.billToCusData = [];
		this.vendorSelectedForBillTo = [];
		this.companySiteList_Billing = [];
	}
	onBillToGetCompanyAddress(id) {
		this.billToAddress = {};
		this.companyService.getBillingAddress(id).subscribe(res => {
            if (res) {
                this.billToAddress.addressId = res[0].addressId;
				this.billToAddress.address1 = res[0].address1;
				this.billToAddress.address2 = res[0].address2;				
				this.billToAddress.city = res[0].city;
				this.billToAddress.stateOrProvince = res[0].stateOrProvince;
				this.billToAddress.postalCode = res[0].postalCode;
				this.billToAddress.countryId= res[0].countryId;
				this.billToAddress.country = res[0].countryId ? getValueFromArrayOfObjectById('label', 'value', res[0].countryId, this.allCountriesList) : '';
				
            } else {
                this.billToAddress.addressId = 0;
				this.billToAddress.address1 = '';
				this.billToAddress.address2 = '';			
				this.billToAddress.city = '';
				this.billToAddress.stateOrProvince = '';
				this.billToAddress.postalCode = '';
				this.billToAddress.country = '';
				this.billToAddress.countryId= null;
			}
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
	
	}
	
	getBillToUserIdEdit(data) {
		if (data.billToUserType === this.customerModuleId) {
			this.tempBillTOAddressId = data.billToAddressId;
			this.onBillToCustomerSelected(data.billToUserId, data, data.billToSiteId, 'billEdit');
			return getObjectById('value', data.billToUserId, this.allCustomers);
		}
		if (data.billToUserType === this.vendorModuleId) {
			this.tempBillTOAddressId = data.billToAddressId;
			this.onBillToVendorSelected(data.billToUserId, data, data.billToSiteId, 'billEdit');
			return getObjectById('vendorId', data.billToUserId, this.allActions);
		}
		if (data.billToUserType === this.companyModuleId) {
			this.tempBillTOAddressId = data.billToAddressId;			
			this.billToSelectedvalue = data.billToUserId;
			this.companyService.getBillingCompanySiteNames(this.billToSelectedvalue).subscribe(response => {
				this.companySiteList_Billing = response;
				if (this.isEditMode) {
					if (data.billToSiteId == 0) {
						this.companySiteList_Billing.push({ legalEntityBillingAddressId: 0, siteName: data.billToSiteName });
						this.billToAddress.address1 = data.billToAddress1;
						this.billToAddress.address2 = data.billToAddress2;						
						this.billToAddress.city = data.billToCity;
						this.billToAddress.stateOrProvince = data.billToState;
						this.billToAddress.postalCode = data.billToPostalCode;
						this.billToAddress.country = data.billToCountry;
					} else {
						this.onBillToGetCompanyAddress(data.billToSiteId);
					}
				}
			},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			});
			this.companyService.getCompanyContacts(this.billToSelectedvalue).subscribe(response => {
				this.contactListForCompanyBilling = response;
				this.sourcePoApproval.billToContactId = getObjectById('contactId', data.billToContactId, this.contactListForCompanyBilling);
			},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			});
			return getObjectById('value', data.billToUserId, this.legalEntity);
		}
	}
	
    // bill to
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
				},err => {
					this.isSpinnerVisible = false;
					const errorLog = err;
					this.errorMessageHandler(errorLog);		
				});
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


	onBillToCustomerSelected(customerId, res?, id?, value?) {		
		if(res) {
			res.billToStateOrProvince = res.billToState ? res.billToState : '';
		}		
		this.clearInputOnClickUserIdBillTo();
		this.billToSelectedvalue = customerId;
		this.customerService.getCustomerBillViaDetails(customerId).subscribe(
			returnddataforbill => {
				this.billToCusData = returnddataforbill[0];
				for(var i =0; i < this.billToCusData.length; i++) {
					if(this.billToCusData[i].isPrimary && value != 'billEdit') {
						this.sourcePoApproval.billToSiteId = this.billToCusData[i].customerBillingAddressId;
						this.sourcePoApproval.billToAddressId = this.billToCusData[i].AddressId;
					}
				}
				if (id) {
					res.billToSiteId = id;
				}
				if (this.isEditMode) {
					if (res && res.billToSiteId == 0) {
						this.billToCusData.push({ customerBillingAddressId: 0, address1: res.billToAddress1, address2: res.billToAddress2, city: res.billToCity, stateOrProvince: res.billToStateOrProvince, postalCode: res.billToPostalCode, country: res.billToCountry, siteName: res.billToSiteName })
					}
				}
				if(res) {
					this.onBillToGetAddress(res, res.billToSiteId);
				} else {
					this.onBillToGetAddress(this.sourcePoApproval, this.sourcePoApproval.billToSiteId);
				}
			},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			});
		this.customerService.getContacts(customerId).subscribe(data => {
			this.billToContactData = data[0];
			for(var i =0; i < this.billToContactData.length; i++) {
				if(this.billToContactData[i].isDefaultContact) {
					this.sourcePoApproval.billToContactId = this.billToContactData[i];
				}
			}
			if (this.isEditMode && value == 'billEdit') {
				this.sourcePoApproval.billToContactId = getObjectById('contactId', res.billToContactId, this.billToContactData);
			}
		},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			});
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
						this.sourcePoApproval.billToSiteId = this.vendorSelectedForBillTo[i].vendorBillingAddressId;
						this.sourcePoApproval.billToAddressId = this.vendorSelectedForBillTo[i].AddressId;
						
					}
				}
				if (id) {
					res.billToSiteId = id;
					this.onBillToGetAddress(res, res.billToSiteId);
				}
				if (this.isEditMode) {
					if (res && res.billToSiteId == 0) {
						this.vendorSelectedForBillTo.push({ vendorBillingAddressId: 0, siteName: res.billToSiteName });
						this.billToAddress.address1 = res.billToAddress1;
						this.billToAddress.address2 = res.billToAddress2;
						this.billToAddress.city = res.billToCity;
						this.billToAddress.stateOrProvince = res.billToState;
						this.billToAddress.postalCode = res.billToPostalCode;
						this.billToAddress.country = res.billToCountry;
					} else {
						if(res) {
							this.onBillToGetAddress(res, res.billToSiteId);
						} else {
							this.onBillToGetAddress(this.sourcePoApproval, this.sourcePoApproval.billToSiteId);
						}
					}
				}
			},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			});
		this.vendorService.getContacts(vendorId).subscribe(
			returdaa => {
				this.vendorContactsForBillTO = returdaa[0];
				for(var i =0; i < this.vendorContactsForBillTO.length; i++) {
					if(this.vendorContactsForBillTO[i].isDefaultContact) {
						this.sourcePoApproval.billToContactId = this.vendorContactsForBillTO[i];
					}
				}
				if (this.isEditMode && value == 'billEdit') {
					this.sourcePoApproval.billToContactId = getObjectById('contactId', res.billToContactId, this.vendorContactsForBillTO);
				}
			},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			});
		
		}

	onChangeTabView(event) {
		if(event.index == 0) {
			// this.getPurchaseOrderPartsById(this.poId);
			this.getPurchaseOrderAllPartsById(this.poId);
			this.enablePartSaveBtn = false;
		}
		if(event.index == 2 && this.posettingModel.IsEnforceApproval == false) {
			this.getApproversListById(this.poId);
		}
		if(event.index == 3 && this.posettingModel.IsEnforceApproval == false) {
			this.getApproversListById(this.poId);
			this.getApprovalProcessListById(this.poId);
			this.enableApproverSaveBtn = false;
		}
		if(event.index == 4) {
			const id = editValueAssignByCondition('vendorId', this.headerInfo.vendorId);
			this.getVendorCapesByID(id);
		}
		// if(event.index == 4) {
		// 	this.enableAddSaveBtn = false;
		// 	this.getVendorPOAddressById(this.poId);
		// }
	}

	employeedata(strText = '',manStructID = 0) {
		if(this.arrayEmplsit.length == 0) {			
		this.arrayEmplsit.push(0); }	
		this.arrayEmplsit.push(this.employeeId == null ? 0 : this.employeeId);
		this.commonService.autoCompleteDropdownsEmployeeByMS(strText,true, 20,this.arrayEmplsit.join(),manStructID).subscribe(res => {
			this.allEmployeeList = res;
			this.requisitionerList = res;
			this.currentUserEmployeeName = getValueFromArrayOfObjectById('label', 'value', this.employeeId, res);			
			if(!this.isEditMode) {
				this.getRequisitionerOnLoad(this.employeeId);
			}
		},err => {
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		})
	}
	getRequisitionerOnLoad(id) {
		this.headerInfo.requisitionerId = getObjectById('value', id, this.allEmployeeList);
	}

	getLegalEntity(strText = '') {
		if(this.arrayLegalEntitylsit.length == 0) {			
			this.arrayLegalEntitylsit.push(0); }	
			this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name',strText,true, 20,this.arrayLegalEntitylsit.join()).subscribe(res => {
				this.legalEntity = res;
				this.legalEntityList_Forgrid = res;
				this.legalEntityList_ForShipping = res;
				this.legalEntityList_ForBilling= res;
			},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			});
	}

	getCountriesList() {
		this.commonService.smartDropDownList('Countries', 'countries_id', 'nice_name').subscribe(res => {
			this.allCountriesList = res;
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		})
	}

	

    filterCompanyNameforgrid(event) {
	// 	this.legalEntityList_Forgrid = this.legalEntity;
	// 	const legalFilter = [...this.legalEntity.filter(x => {
	// 		return x.label.toLowerCase().includes(event.query.toLowerCase())
	// 	})]
	// 	this.legalEntityList_Forgrid = legalFilter;
			if (event.query !== undefined && event.query !== null) {
				this.getLegalEntity(event.query); }
		

	}
	filterCompanyNameforShipping(event) {
		if (event.query !== undefined && event.query !== null) {
			this.getLegalEntity(event.query); }
	}

	filterCompanyNameforBilling(event) {
		if (event.query !== undefined && event.query !== null) {
			this.getLegalEntity(event.query); }
	}

	private loadVendorContactInfo() {		
		this.vendorService.getContactsFirstName().subscribe(results => {
			this.venContactList = results[0];
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
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
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		})
		
	}

	loadWorkOrderList(filterVal = '') {
		if (this.arrayWOlist.length == 0) {
            this.arrayWOlist.push(0); }
		  this.commonService.getWODataFilter(filterVal,20,this.arrayWOlist.join()).subscribe(res => {
			const data = res.map(x => {
				return {
					value: x.workOrderId,
					label: x.workOrderNum
				}
			});
			this.allWorkOrderInfo = [
				{value: 0, label: 'Select'}
			];
			this.allWorkOrderInfo = [...this.allWorkOrderInfo, ...data];
			this.allWorkOrderDetails = [...this.allWorkOrderInfo, ...data];
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		})

	
	}

	loadSubWorkOrderList(filterVal = '') {
		if (this.arraysubWOlist.length == 0) {
            this.arraysubWOlist.push(0); }
		  this.commonService.getsubWODataFilter(filterVal,20,this.arraysubWOlist.join()).subscribe(res => {
			const data = res.map(x => {
				return {
					value: x.subWorkOrderId,
					label: x.subWorkOrderNo
				}
			});
			this.allsubWorkOrderInfo = [
				{value: 0, label: 'Select'}
			];
			this.allsubWorkOrderInfo = [...this.allsubWorkOrderInfo, ...data];
			this.allsubWorkOrderDetails = [...this.allsubWorkOrderDetails, ...data];
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		})

	
	}

	

	loadRepairOrderList(filterVal = '') {
		if (this.arrayROlist.length == 0) {
            this.arrayROlist.push(0); }
		this.commonService.getRODataFilter(filterVal,20,this.arrayROlist.join()).subscribe(res => {
			const data = res.map(x => {
				return {
					value: x.repairOrderId,
					label: x.repairOrderNumber
				}
			});
			this.allRepairOrderInfo = [
				{value: 0, label: 'Select'}
			];
			this.allRepairOrderInfo = [...this.allRepairOrderInfo, ...data];
			this.allRepairOrderDetails = [...this.allRepairOrderInfo, ...data];
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
	}

	loadSalesOrderList(filterVal = '') {
		if (this.arraySOlist.length == 0) {
            this.arraySOlist.push(0); }
		this.commonService.getSODataFilter(filterVal,20,this.arraySOlist.join()).subscribe(res => {
			const data = res.map(x => {
				return {
					value: x.salesOrderId,
		 			label: x.salesOrderNumber
				}
			});
			this.allSalesOrderInfo = [
				{value: 0, label: 'Select'}
			];
			this.allSalesOrderInfo = [...this.allSalesOrderInfo, ...data];
			this.allSalesOrderDetails = [...this.allSalesOrderInfo, ...data];
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
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
	}

	loadShippingViaList() {
		this.commonService.smartDropDownList('ShippingVia', 'ShippingViaId', 'Name').subscribe(res => {
			this.allShipViaInfo = res;
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
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
	
	editDropDownLoad() {
		this.employeedata('',0);
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

	}

	savePurchaseOrderHeader() {		
		if(this.createPOForm.invalid || 
			this.headerInfo.companyId == 0 
		    || this.headerInfo.companyId == null) {
			this.alertService.showMessage('Purchase Order', "Please enter required highlighted fields for PO Header!", MessageSeverity.error);
			this.inputValidCheckHeader = true;
			if(this.headerInfo.companyId == null ||  this.headerInfo.companyId == 0) { 
				this.managementValidCheck = true;
			}
		}
		else {     
			this.isSpinnerVisible = true;
			
			var headerInfoObj = {				
				purchaseOrderNumber: this.headerInfo.purchaseOrderNumber,
				priorityId: this.headerInfo.priorityId ? this.getPriorityId(this.headerInfo.priorityId) : 0,
				Priority: this.headerInfo.priorityId && this.headerInfo.priorityId.label 
				           && this.headerInfo.priorityId.label != null && this.headerInfo.priorityId.label != undefined  ? this.headerInfo.priorityId.label : '',				
				openDate: this.headerInfo.openDate, //  this.datePipe.transform(this.headerInfo.openDate, "MM/dd/yyyy"),
				needByDate: this.headerInfo.needByDate, //this.datePipe.transform(this.headerInfo.needByDate, "MM/dd/yyyy"),
				statusId: this.headerInfo.statusId ? this.headerInfo.statusId : 0,
				Status: this.headerInfo.statusId && this.headerInfo.statusId > 0 ? getValueFromArrayOfObjectById('label', 'value', this.headerInfo.statusId, this.poStatusList) : '',				
				vendorId: this.headerInfo.vendorId ? this.getVendorId(this.headerInfo.vendorId) : 0,
				VendorName: this.headerInfo.vendorId && this.headerInfo.vendorId.vendorName 
								&& this.headerInfo.vendorId.vendorName != null && this.headerInfo.vendorId.vendorName != undefined  ? this.headerInfo.vendorId.vendorName : '',	
				VendorCode: this.headerInfo.vendorId && this.headerInfo.vendorId.vendorCode 
								&& this.headerInfo.vendorId.vendorCode != null && this.headerInfo.vendorId.vendorCode != undefined  ? this.headerInfo.vendorId.vendorCode : '',	
				vendorContactId: this.headerInfo.vendorContactId ? this.getVendorContactId(this.headerInfo.vendorContactId) : 0,
				VendorContact:  this.headerInfo.vendorContactId && this.headerInfo.vendorContactId.vendorContact 
								 && this.headerInfo.vendorContactId.vendorContact != null && this.headerInfo.vendorContactId.vendorContact != undefined  ? this.headerInfo.vendorContactId.vendorContact : '',	
				vendorContactPhone:  this.headerInfo.vendorContactId && this.headerInfo.vendorContactId.fullContactNo 
									&& this.headerInfo.vendorContactId.fullContactNo != null && this.headerInfo.vendorContactId.fullContactNo != undefined  ? this.headerInfo.vendorContactId.fullContactNo : '',	
				creditTermsId: this.headerInfo.creditTermsId ? this.headerInfo.creditTermsId : 0,
				Terms: this.headerInfo.creditTerms ? this.headerInfo.creditTerms : '',
				creditLimit: this.headerInfo.creditLimit ? parseFloat(this.headerInfo.creditLimit.toString().replace(/\,/g,'')) : '0.00',
				RequestedBy: this.headerInfo.requisitionerId ? this.getEmployeeId(this.headerInfo.requisitionerId) : 0,
				Requisitioner: this.headerInfo.requisitionerId && this.headerInfo.requisitionerId.label 
								&& this.headerInfo.requisitionerId.label != null && this.headerInfo.requisitionerId.label != undefined  ? this.headerInfo.requisitionerId.label : '',	
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
				updatedBy:  this.headerInfo.updatedBy ? this.headerInfo.updatedBy : this.userName
			}

			if (!this.isEditModeHeader) {
				
				this.purchaseOrderService.savePurchaseOrderHeader({ ...headerInfoObj }).subscribe(saveddata => {
					this.purchaseOrderId = saveddata.purchaseOrderId;
					this.poId = saveddata.purchaseOrderId;
					this.headerInfo.purchaseOrderNumber = saveddata.purchaseOrderNumber;
					this.isSpinnerVisible = false;
					this.enableHeaderSaveBtn = false;
					this.alertService.showMessage(
						'Success',
						`Saved PO Header Successfully`,
						MessageSeverity.success
					);
					this.route.navigate(['/vendorsmodule/vendorpages/app-purchase-setup/edit/'+this.poId]);
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
							
					if(this.poId) {
						this.isEditModeHeader = true;
						this.isEditMode = true;
					}
					this.isSpinnerVisible = false;				
				}, err => {
					this.isSpinnerVisible = false;
					const errorLog = err;
					this.errorMessageHandler(errorLog);
					this.toggle_po_header = true;
					this.enableHeaderSaveBtn = true;

				});
			} else {
				headerInfoObj.updatedBy = this.userName;
				const poHeaderEdit = { ...headerInfoObj, purchaseOrderId: parseInt(this.poId) };
				this.purchaseOrderService.savePurchaseOrderHeader({ ...poHeaderEdit }).subscribe(saveddata => {
					this.purchaseOrderId = saveddata.purchaseOrderId;
					this.poId = saveddata.purchaseOrderId;
					this.headerInfo.purchaseOrderNumber = saveddata.purchaseOrderNumber;
					this.isEditMode = true;
					this.isSpinnerVisible = false;	
					this.enableHeaderSaveBtn = false;			
					this.alertService.showMessage(
						'Success',
						`Updated PO Header Successfully`,
						MessageSeverity.success
					);
				}, err => {
					this.isSpinnerVisible = false;
					const errorLog = err;
					this.errorMessageHandler(errorLog);
					this.toggle_po_header = true;
					this.enableHeaderSaveBtn = true;
				});
			}
			this.toggle_po_header = false;
			this.enableHeaderSaveBtn = false;
		}
	}

	dismissModel() {
		this.savePurchaseOrderPartsList(true); 
    }
	savePurchaseOrderPartsList(contwithoutVendorPrice = false) {
		
		// if(this.createPOPartsForm.invalid) {
		// 	this.alertService.showMessage('Purchase Order', "Please enter required highlighted fields for PO PartsList!", MessageSeverity.error);
		// 	this.inputValidCheck = true;
		// 	return;
		// }		
		this.isSpinnerVisible = true;
		this.parentObjectArray = [];
		var errmessage = '';
		for (let i = 0; i < this.partListData.length; i++) {
			this.alertService.resetStickyMessage();			
			if(this.partListData[i].quantityOrdered == 0) {	
				this.isSpinnerVisible = false;	
				errmessage = errmessage + '<br />' + "Please enter Qty."
			}
			if(!this.partListData[i].itemMasterId) {	
				this.isSpinnerVisible = false;	
				errmessage = errmessage + '<br />' + "PN is required."
			}
			if(!this.partListData[i].priorityId) {	
				this.isSpinnerVisible = false;	
				errmessage = errmessage + '<br />' + "Priority is required."
			}
			if(!this.partListData[i].needByDate) {	
				this.isSpinnerVisible = false;	
				errmessage = errmessage + '<br />' + "Need By is required."
			}
			if(!this.partListData[i].conditionId) {	
				this.isSpinnerVisible = false;	
				errmessage = errmessage + '<br />' + "Cond is required."
			}
			if(!this.partListData[i].functionalCurrencyId) {	
				this.isSpinnerVisible = false;	
				errmessage = errmessage + '<br />' + "Functional CUR is required."
			}
			if(!this.partListData[i].foreignExchangeRate) {	
				this.isSpinnerVisible = false;	
				errmessage = errmessage + '<br />' + "FX Rate is required."
			}
			if(!this.partListData[i].reportCurrencyId) {	
				this.isSpinnerVisible = false;	
				errmessage = errmessage + '<br />' + "Report CUR is required."
			}
			if(!this.partListData[i].managementStructureId || this.partListData[i].managementStructureId == 0) {	
				this.isSpinnerVisible = false;	
				errmessage = errmessage + '<br />' + "Management Structure is required."
			}
			if (this.partListData[i].childList && this.partListData[i].childList.length > 0) {
				for (let j = 0; j < this.partListData[i].childList.length; j++) {
					
					if(!this.partListData[i].childList[j].partListUserTypeId 
						  || this.partListData[i].childList[j].partListUserTypeId == 0
						  || this.partListData[i].childList[j].partListUserTypeId == null) {	
						this.isSpinnerVisible = false;	
						errmessage = errmessage + '<br />' + "Split Shipment User Type is required."
					}
					if(!this.partListData[i].childList[j].partListUserId
						|| this.partListData[i].childList[j].partListUserId == 0
						  || this.partListData[i].childList[j].partListUserId == null) {	
						this.isSpinnerVisible = false;	
						errmessage = errmessage + '<br />' + "Split Shipment Name is required."
					}
					if(!this.partListData[i].childList[j].poPartSplitSiteId 
						|| this.partListData[i].childList[j].poPartSplitSiteId == 0 
						|| this.partListData[i].childList[j].poPartSplitSiteId == null) {	
						this.isSpinnerVisible = false;	
						errmessage = errmessage + '<br />' + "Split Shipment Select Address is required."
					}					

					if(!this.partListData[i].childList[j].quantityOrdered || this.partListData[i].childList[j].quantityOrdered == 0 ) {	
						this.isSpinnerVisible = false;	
						errmessage = errmessage + '<br />' + "Split Shipment Qty is required."
					}
					if(!this.partListData[i].childList[j].managementStructureId || this.partListData[i].childList[j].managementStructureId == 0) {	
						this.isSpinnerVisible = false;	
						errmessage = errmessage + '<br />' + "Split Shipment Management Structure is required."
					}
					if(!this.partListData[i].childList[j].needByDate) {	
						this.isSpinnerVisible = false;	
						errmessage = errmessage + '<br />' + "Split Shipment Need By is required."
					}
					
				}
			}
			if(errmessage != '') {
				this.alertService.showStickyMessage("Validation failed", errmessage, MessageSeverity.error, 'Please enter Qty');
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
					this.childObject = {
						purchaseOrderId: this.poId,
						itemMasterId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
						assetId: this.partListData[i].assetId ? this.partListData[i].assetId : 0,
						partNumberId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
						poPartSplitUserTypeId: childDataList[j].partListUserTypeId ? childDataList[j].partListUserTypeId : 0,
						poPartSplitUserId: childDataList[j].partListUserId ? this.getIdByObject(childDataList[j].partListUserId) : 0,						
						poPartSplitSiteId: childDataList[j].poPartSplitSiteId ? childDataList[j].poPartSplitSiteId : 0, 
						poPartSplitAddressId: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('addressId', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : 0,
						poPartSplitAddress1: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('address1', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						poPartSplitAddress2: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('address2', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						poPartSplitCity: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('city', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						POPartSplitState: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('stateOrProvince', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						poPartSplitPostalCode: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('postalCode', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						POPartSplitCountryId: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('countryId', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : 0,
						POPartSplitCountryName: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('country', 'siteID', childDataList[j].poPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						UOMId: this.partListData[i].UOMId ? this.partListData[i].UOMId : 0,
						quantityOrdered: childDataList[j].quantityOrdered ? parseFloat(childDataList[j].quantityOrdered.toString().replace(/\,/g,'')) : 0,
						needByDate: this.datePipe.transform(childDataList[j].needByDate, "MM/dd/yyyy"),
						managementStructureId: childDataList[j].managementStructureId && childDataList[j].managementStructureId  != null ? childDataList[j].managementStructureId : null, //109
                        isDeleted: childDataList[j].isDeleted,
                        createdBy: this.userName,
                        updatedBy: this.userName,
					}
					this.childObjectArray.push(this.childObject)
					this.childObjectArrayEdit.push({
						...this.childObject,
						purchaseOrderPartRecordId: childDataList[j].purchaseOrderPartRecordId ? childDataList[j].purchaseOrderPartRecordId : 0
					});					
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
				quantityOrdered: this.partListData[i].quantityOrdered ? parseFloat(this.partListData[i].quantityOrdered.toString().replace(/\,/g,'')) : 0,
				unitCost: this.partListData[i].unitCost ? parseFloat(this.partListData[i].unitCost.toString().replace(/\,/g,'')) : 0,
				vendorListPrice: this.partListData[i].vendorListPrice ? parseFloat(this.partListData[i].vendorListPrice.toString().replace(/\,/g,'')) : 0,
				discountPerUnit: this.partListData[i].discountPerUnit ? parseFloat(this.partListData[i].discountPerUnit.toString().replace(/\,/g,'')) : 0,
				discountPercent: this.partListData[i].discountPercent ? this.partListData[i].discountPercent : 0,
				discountAmount: this.partListData[i].discountAmount ? parseFloat(this.partListData[i].discountAmount.toString().replace(/\,/g,'')) : 0,
				extendedCost: this.partListData[i].extendedCost ? parseFloat(this.partListData[i].extendedCost.toString().replace(/\,/g,'')) : 0,
				functionalCurrencyId: this.partListData[i].functionalCurrencyId ? this.getCurrencyIdByObject(this.partListData[i].functionalCurrencyId) : null,
				foreignExchangeRate: this.partListData[i].foreignExchangeRate ? this.partListData[i].foreignExchangeRate : 0,
				reportCurrencyId: this.partListData[i].reportCurrencyId ? this.getCurrencyIdByObject(this.partListData[i].reportCurrencyId) : null,
				workOrderId: this.partListData[i].workOrderId  && this.getValueFromObj(this.partListData[i].workOrderId) != 0 ? this.getValueFromObj(this.partListData[i].workOrderId) : null,
				repairOrderId: this.partListData[i].repairOrderId && this.getValueFromObj(this.partListData[i].repairOrderId) != 0 ? this.getValueFromObj(this.partListData[i].repairOrderId) : null,
				salesOrderId: this.partListData[i].salesOrderId && this.getValueFromObj(this.partListData[i].salesOrderId) != 0 ? this.getValueFromObj(this.partListData[i].salesOrderId) : null,
				managementStructureId: this.partListData[i].managementStructureId && this.partListData[i].managementStructureId != 0  ? this.partListData[i].managementStructureId : null,
				memo: this.partListData[i].memo,
				isApproved: this.partListData[i].isApproved ? this.partListData[i].isApproved : false, 
				masterCompanyId: this.currentUserMasterCompanyId,
				isDeleted: this.partListData[i].isDeleted,
				createdBy: this.userName,
				updatedBy: this.userName,	
				employeeID: this.employeeId ? this.employeeId : 0,						
			}
			if (!this.isEditMode) {			
				this.parentObjectArray.push({
					...this.parentObject,
					purchaseOrderSplitParts: this.childObjectArray					
				});				
			} else {
				this.parentObjectArray.push({
					...this.parentObject,
					purchaseOrderSplitParts: this.childObjectArrayEdit,
					purchaseOrderPartRecordId: this.partListData[i].purchaseOrderPartRecordId ? this.partListData[i].purchaseOrderPartRecordId : 0
				})
			}
		}	
		
		
		this.purchaseOrderService.savePurchaseOrderParts(this.parentObjectArray).subscribe(res => {
			if(res) {
					this.BindAllParts(res);
			}
			this.isSpinnerVisible = false;
			this.enablePartSaveBtn = false;
			this.alertService.showMessage(
				'Success',
				`Saved PO PartsList Successfully`,
				MessageSeverity.success
			);
        }, err => {
			this.isSpinnerVisible = false;
			const errorLog = err;		
			this.errorMessageHandler(errorLog); 
		});
		this.enableHeaderSaveBtn = false;
	}
	
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

	goToCreatePOList() {
		this.route.navigate(['/vendorsmodule/vendorpages/app-create-po']);
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

		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
	}	

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

	loadcustomerData(strText = '') {
		if(this.arrayCustlist.length == 0) {			
			this.arrayCustlist.push(0); }
		this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name',strText,true,20,this.arrayCustlist.join()).subscribe(response => {
			this.allCustomers = response;
			this.customerNames = response;
			this.splitcustomersList = response;
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
	}
	
	loapartItems(strvalue = '') {
			this.commonService.getStockpartnumbersAutoComplete(strvalue, false, 0).subscribe(res => {
				this.partCollection = res.map(x => {
					return {
						value: x.itemMasterId,
						label: x.partNumber
					}
				});
			})
		
				
	}

	filterpartItems(event) {
		if (event.query !== undefined && event.query !== null) {
			this.loapartItems(event.query); }	
	} 
		
	

	filterAltPartItems(event,partNo) {
		const itemMasterId = getValueFromObjectByKey('value', partNo)
		this.itemser.getItemMasterAltEquiMappingParts(itemMasterId).subscribe(res => {
				this.altPartNumList = res;
				this.altPartCollection = this.altPartNumList;
				if (event.query !== undefined && event.query !== null) {
					const partNumberFilter = [...this.altPartNumList.filter(x => {
						return x.altEquiPartNumber.toLowerCase().includes(event.query.toLowerCase())
					})]
					this.altPartCollection = partNumberFilter;
				}
			}, err => {				
				const errorLog = err;
			 	this.errorMessageHandler(errorLog);
			});
	}

	filterNames(event) {
		// this.customerNames = this.allCustomers;
		// if (event.query !== undefined && event.query !== null) {
		// 	const customers = [...this.allCustomers.filter(x => {
		// 		return x.label.toLowerCase().includes(event.query.toLowerCase())
		// 	})]
		// 	this.customerNames = customers;
		// }

		if (event.query !== undefined && event.query !== null) {
			this.loadcustomerData(event.query); }
	}

	getAddressDetails(variable, pindex, cindex) {
		return this[variable + pindex + cindex]
	}

	filterCustomersSplit(event): void {
		// this.splitcustomersList = this.allCustomers;
		// if (event.query !== undefined && event.query !== null) {
		// 	const customers = [...this.allCustomers.filter(x => {
		// 		return x.label.toLowerCase().includes(event.query.toLowerCase())
		// 	})]
		// 	this.splitcustomersList = customers;
		// 		}
				if (event.query !== undefined && event.query !== null) {
					this.loadcustomerData(event.query); }		
	}

	filterSplitVendorNames(event) {
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
		
	}

	onSelectSplitUserType(part, pindex, cindex) {
		part.addressData = [];
		part.partListUserId = {};
		part.partListAddressId = 0;
		this["splitAddressData" + pindex + cindex] = [];
	}

    deleteSplitShipment(childata, index, mainindex) {
        this.enablePartSave();
	

		if(childata.purchaseOrderPartRecordId !== undefined && childata.purchaseOrderPartRecordId !== null) {
			this.partListData[mainindex].childList = this.partListData[mainindex].childList.map(x => {
				if(x.purchaseOrderPartRecordId == childata.purchaseOrderPartRecordId){
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

	onClickShipMemo() {
		this.addressMemoLabel = 'Edit Ship';
		this.tempMemo = this.sourcePoApproval.shipToMemo;
	}

	onClickPartsMemo(partList) {	
		this.tempPartList = partList;
		this.partsMemo = partList.memo;
		this.addressMemoLabel = 'Edit Notes';
	}
	onSavePartsMemo(){
		this.enablePartSaveBtn = true;
		if (this.addressMemoLabel == 'Edit Notes') {
			this.tempPartList.memo = this.partsMemo;
		}
	}

	onClickApproversMemo(approver) {	
		this.tempApproverObj = approver;
		this.tempApproverMemo = approver.memo;
	}

	onSaveApproversMemo(){
		this.tempApproverObj.memo = this.tempApproverMemo;
	}

	onAddShipMemo() {
		this.tempAddshipViaMemo = this.addShipViaFormForShipping.memo;
	}

	onSaveTextAreaInfo() {
		this.addShipViaFormForShipping.memo = this.tempAddshipViaMemo;
        $('#ship-via-memo').modal('hide');
	}

	closeMemoModel()
    {
        $('#ship-via-memo').modal('hide');
    }

	onClickBillMemo() {
		this.addressMemoLabel = 'Edit Bill';
		this.tempMemo = this.sourcePoApproval.billToMemo;
	}
	
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


	


	




	getFXRate(partList, onChange?) {
		if ((partList.reportCurrencyId != null || partList.reportCurrencyId != undefined) && (partList.functionalCurrencyId != null || partList.functionalCurrencyId != undefined)) {
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

	private loadConditionData() {
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
					}
				}
			}
		});		
	}
	loadPOApproverStatus() {
		this.commonService.smartDropDownList('ApprovalStatus', 'ApprovalStatusId', 'Name').subscribe(response => {
			 this.poApproverStatusList = response;			
			 this.poApproverStatusList = this.poApproverStatusList.sort((a,b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
	}	

	ifSplitShipment(partList, event) {
		if (partList.ifSplitShip) {
			if (partList.partNumberId !== null && partList.partNumberId !== undefined) {				
				this.addRow(partList);				
			} else {
				this.alertService.showMessage(
					'Error',
					'Please select Part Number!',
					MessageSeverity.error
				);				
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
						discountPercent: 0
					}
					this.getManagementStructureForParentEdit(newObject);
					this.getPNDetailsById(newObject);
					//this.getPriceDetailsByCondId(newObject);
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
				discountPercent: 0
			}
			this.partListData.push(newParentObject); 			
			for (let i = 0; i < this.partListData.length; i++) {
				if (!this.partListData[i].ifSplitShip) {
					this.partListData[i].childList = [];
				}
			}

			if (this.headerInfo.companyId > 0) {
				for (let i = 0; i < this.partListData.length; i++) {
					if (i == this.partListData.length - 1) {
						this.partListData[i].maincompanylist = this.maincompanylist;
						this.partListData[i].parentCompanyId = this.headerInfo.companyId;
						this.partListData[i].managementStructureId = this.headerInfo.companyId;
						this.partListData[i].parentBulist = this.bulist;
						this.partListData[i].parentDivisionlist = this.divisionlist;
						this.partListData[i].parentDepartmentlist = this.departmentList;;
						this.partListData[i].parentbuId = 0;
						this.partListData[i].parentDivisionId = 0;
						this.partListData[i].parentDeptId = 0;
					} 
				}
			}
			if (this.headerInfo.buId) {
				for (let i = 0; i < this.partListData.length; i++) {
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
				for (let i = 0; i < this.partListData.length; i++) {
					if (i == this.partListData.length - 1) {
						this.partListData[i].parentDivisionlist = this.divisionlist;
						this.partListData[i].parentDivisionId = this.headerInfo.divisionId;
						this.partListData[i].managementStructureId = this.headerInfo.divisionId;						
						this.partListData[i].parentDeptId = 0;
					}
				}
			}
			if (this.headerInfo.departmentId) {
				for (let i = 0; i < this.partListData.length; i++) {
					if (i == this.partListData.length - 1) {
						this.partListData[i].parentDepartmentlist = this.departmentList;
						this.partListData[i].parentDeptId = this.headerInfo.departmentId;	
						this.partListData[i].managementStructureId = this.headerInfo.departmentId;				
					}
				}
			}

			for (let i = 0; i < this.partListData.length; i++) {
				if (i == this.partListData.length - 1) { 
					this.partListData[i].conditionId = this.defaultCondtionId;
					this.getFunctionalReportCurrencyById(this.partListData[i]);
				}
			}
			
		}
	}

	getAllparts() {
		this.arraySearch = this.partNumbers.replace(/\s/g, "");	
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
			},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			});
		}
	}

	addRow(partList) {
		let childPart = new PartDetails();
		childPart = {
			...childPart,
			quantityOrdered : 0,
			needByDate: partList.needByDate ? partList.needByDate : null,
			priorityId: partList.priorityId ? getValueFromArrayOfObjectById('label', 'value', partList.priorityId, this.allPriorityInfo) : null
		}
		partList.childList.push(childPart);
		if (partList.parentCompanyId) {
			for (let i = 0; i < partList.childList.length; i++) {
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
			for (let i = 0; i < partList.childList.length; i++) {
				if (i == partList.childList.length - 1 && partList.childList[i].childCompanyId !== 0) {
					partList.childList[i].childBulist = partList.parentBulist;
					partList.childList[i].managementStructureId = partList.parentbuId;
					partList.childList[i].childbuId = partList.parentbuId;
				}
			}
		}
		if (partList.parentDivisionId) {
			for (let i = 0; i < partList.childList.length; i++) {
				if (i == partList.childList.length - 1 && partList.childList[i].childbuId !== 0) {
					partList.childList[i].childDivisionlist = partList.parentDivisionlist;
					partList.childList[i].managementStructureId = partList.parentDivisionId;
					partList.childList[i].childDivisionId = partList.parentDivisionId;	
				}
			}
		}
		if (partList.parentDeptId) {
			for (let i = 0; i < partList.childList.length; i++) {
				if (i == partList.childList.length - 1 && partList.childList[i].childDivisionId !== 0) {
					partList.childList[i].childDepartmentlist = partList.parentDepartmentlist;
					partList.childList[i].managementStructureId = partList.parentDeptId;
					partList.childList[i].childDeptId = partList.parentDeptId;	
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
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});		
	}

	clearInputShipTo() {
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
	}

	clearInputBillTo() {
		this.sourcePoApproval.billToUserId = 0;
		this.sourcePoApproval.billToAddressId = 0;
		this.sourcePoApproval.billToContactId = 0;
		this.billToAddress = {};
		this.sourcePoApproval.billToMemo = '';
		this.billToCusData = [];
		this.vendorSelectedForBillTo = [];
		this.companySiteList_Billing = [];
	}

	clearShipToContact() {
		this.sourcePoApproval.shipToContactId = null;
	}
	clearBillToContact() {
		this.sourcePoApproval.billToContactId = null;
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



	selectedVendorName(value) {
		this.vendorContactList = [];
		this.getVendorContactsListByID(value.vendorId);
		this.getVendorCreditTermsByID(value.vendorId);
		//this.getVendorCapesByID(value.vendorId);
		this.headerInfo.vendorName = value.vendorName;
		this.headerInfo.vendorId = getObjectById('vendorId', value.vendorId, this.allActions);
		this.headerInfo.vendorCode = getObjectById('vendorId', value.vendorId, this.allActions);
		this.warningsandRestriction(value.vendorId);
	}
	onChangeVendorContact(value) {
		this.headerInfo.vendorContactId = value;
		this.headerInfo.vendorContactPhone = value;
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
	}

	filtersubWorkOrderList(event) {
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
	}

	filterRepairOrderList(event) {
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
}

	filterSalesOrderList(event) {
		if (event.query !== undefined && event.query !== null) {
			this.loadSalesOrderList(event.query);
	}}

	private loadPercentData() {		
		this.commonService.smartDropDownList('[Percent]', 'PercentId', 'PercentValue').subscribe(res => {
			const data = res.map(x => {
				return {
					percentId: x.value,
					percentValue: x.label
				}
			});
			this.allPercentData = [
				{percentId: 0, percentValue: 'Select'}
			];
			this.allPercentData = [...this.allPercentData, ...data];
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
	}
	
	
	loadVendorList(filterVal = '') {
        if (this.arrayVendlsit.length == 0) {
            this.arrayVendlsit.push(0); }
		this.vendorService.getVendorNameCodeListwithFilter(filterVal,20,this.arrayVendlsit.join()).subscribe(res => {
			this.allActions = res;
			this.vendorNames = res;
			this.vendorCodes = res;
			this.splitVendorNames = res; 
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
	}

	filterVendorCodes(event) {
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
			this.loadVendorList(event.query); }
	}

	filterRequisitioner(event) {	 	
		 if (event.query !== undefined && event.query !== null) {
		 this.employeedata(event.query,this.headerInfo.managementStructureId);
		 }
	 }

	 filterVendorNames(event) {
		// this.vendorNames = this.allActions;

		// if (event.query !== undefined && event.query !== null) {
		// 	const vendorFilter = [...this.allActions.filter(x => {
		// 		return x.vendorName.toLowerCase().includes(event.query.toLowerCase())
		// 	})]
		// 	this.vendorNames = vendorFilter;
		// }
		if (event.query !== undefined && event.query !== null) {
		this.loadVendorList(event.query); }
	}

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

    onDelPNRow(partList, index) {
        this.enablePartSave();		
		if(partList.purchaseOrderPartRecordId !== undefined && partList.purchaseOrderPartRecordId !== null) {
			this.partListData = this.partListData.map(x => {
				if(x.purchaseOrderPartRecordId == partList.purchaseOrderPartRecordId){
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
			this.sourcePoApproval.shipToMemo = this.tempMemo;
		}
		if (this.addressMemoLabel == 'Edit Bill') {
			this.sourcePoApproval.billToMemo = this.tempMemo;
		}
		this.enableAddSaveBtn = true;		
	}

	onAddMemo() {
		this.headerMemo = this.headerInfo.poMemo;
	}
	onSaveMemo() {
		this.headerInfo.poMemo = this.headerMemo;
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

	onGetDiscPercent(partList) {
		if (partList.vendorListPrice !== null && partList.vendorListPrice !== undefined && partList.vendorListPrice !== '0.00') {
			const discountPerUnit = partList.discountPerUnit ? parseFloat(partList.discountPerUnit.toString().replace(/\,/g,'')) : 0;
			const vendorListPrice = partList.vendorListPrice ? parseFloat(partList.vendorListPrice.toString().replace(/\,/g,'')) : 0;
			const discountPercentValue = Math.round((discountPerUnit * 100) / vendorListPrice).toFixed(2);
			partList.discountPercent = getObjectByValue('percentValue', discountPercentValue, this.allPercentData);
			partList.discountPercent = partList.discountPercent.percentId;
		}
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

	getEmployeeId(obj) {
		if (obj.value) {
			return obj.value;
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
	resetAddressShippingForm() {
		this.addressFormForShipping = new CustomerShippingModel();
		this.isEditModeShipping = false;
	}

	resetAddressBillingForm() {
		this.addressFormForBilling = new CustomerShippingModel();
		this.isEditModeBilling = false;
	}
	

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

	splitAddChange(){
		this.splitAddbutton = true;	}

	resetAddressForm() {
		this.addNewAddress = new CustomerShippingModel();
		this.isEditModeSplitAddress = false;
		this.isEditModeSplitPoOnly = false;		
	}

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

	onEditShipVia(data) {	
		this.tempshipVia = getObjectById('shipViaId', data.shipViaId, this.shipViaList);
		this.addShipViaFormForShipping = { ...this.tempshipVia, shipVia: this.tempshipVia.name };	
		this.isEditModeShipVia = true;		
	}

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

	onClickPartsListAddress(value, splitPart, pindex?, cindex?) {				
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
			this.commonService.getaddressdetailsOnlyUserbyuser(this.splitmoduleId, this.splituserId, 'Ship',this.poId).subscribe(
				returnddataforbill => {
					this.splitSieListOriginal = returnddataforbill.address.map(x => {
																					return {
																						siteName: x.siteName, siteId: x.siteId
																					}});
																				});
		}
		if (value === 'Edit') {
			this.addressHeader = 'Edit Split Shipment Address';			
			this.splitAddbutton = false;
			this.splitmoduleId = splitPart.partListUserTypeId;
			this.splituserId = this.getIdByObject(splitPart.partListUserId);
			this.tempSplitAddress = getObjectById('siteID', splitPart.poPartSplitSiteId, this["splitAddressData" + pindex + cindex]);
			this.editSiteName = this.tempSplitAddress.siteName;
			if(this.tempSplitAddress.isPoOnly) 
				this.isEditModeSplitPoOnly = true;
			else
				this.isEditModeSplitAddress = true;	
			
				this.addNewAddress = { ...this.tempSplitAddress,
					countryId: getObjectByValue('value', this.tempSplitAddress.countryId, this.allCountriesList)
				}
				this.commonService.getaddressdetailsOnlyUserbyuser(this.splitmoduleId, this.splituserId, 'Ship',this.poId).subscribe(
					returnddataforbill => {
						this.splitSieListOriginal = returnddataforbill.address.map(x => {
																						return {
																							siteName: x.siteName, siteId: x.siteId
																						}});
																						this.addNewAddress.siteName = getObjectByValue('siteName',this.tempSplitAddress.siteName, this.splitSieListOriginal);		
					});
		}
	}
	
	saveShippingAddress() {
			
		const data = {
			...this.addNewAddress,
			createdBy: this.userName,
			updatedBy: this.userName,
			masterCompanyId: this.currentUserMasterCompanyId,
			isActive: true,
		}		
		const addressData = { ...data, 									 
								  userTypeId: this.splitmoduleId, 
								  userId: this.splituserId, 
								  siteName: editValueAssignByCondition('siteName', data.siteName),  
								  countryId: getValueFromObjectByKey('value', data.countryId) 
        }       
		
		if (!this.isEditModeSplitAddress) {
			 this.commonService.createAllAddres(addressData).subscribe(response => {  
				   if(response) {
					this.onUserNameChange(this.splitmoduleId,this.splituserId,addressData,this.parentIndex,this.childIndex,response);                  			
					 this.alertService.showMessage(
						 'Success',
						 `Saved Shipping Information Successfully`,
						 MessageSeverity.success
					 );} else {
						this.alertService.showMessage(
							'Error',
							`Eroor While Saving Shipping Address`,
							MessageSeverity.error
						);
					 }
				 },err => {
					 this.isSpinnerVisible = false;
					 const errorLog = err;
					 this.errorMessageHandler(errorLog);		
				});
			} else {
				 this.commonService.createAllAddres(addressData).subscribe(response => {  
					if(response) {
					this.onUserNameChange(this.splitmoduleId,this.splituserId,addressData,this.parentIndex,this.childIndex,response);      						         			
					 this.alertService.showMessage(
						 'Success',
						 `Shipping Information Updated Successfully`,
						 MessageSeverity.success
					 );} else {
						this.alertService.showMessage(
							'Error',
							`Eroor While Saving Shipping Address`,
							MessageSeverity.error
						);
					 }
				 },err => {
					 this.isSpinnerVisible = false;
					 const errorLog = err;
					 this.errorMessageHandler(errorLog);		
				});
			 }
	}

	saveShippingAddressToPO() {
		const data = {
			...this.addNewAddress,
			createdBy: this.userName,
			updatedBy: this.userName,
			masterCompanyId: this.currentUserMasterCompanyId,
			isActive: true,
		}		
		const addressData = { ...data,
								  purchaseOrderID : this.id,
								  isPoOnly: true,
								  siteName: editValueAssignByCondition('siteName', data.siteName),
								  userTypeId: this.splitmoduleId, 
								  userId: this.splituserId, 
								  countryId: getValueFromObjectByKey('value', data.countryId) 
								}
		
		if (!this.isEditModeSplitPoOnly) {
			 this.commonService.createAllAddres(addressData).subscribe(response => {  
				if(response) {
				this.onUserNameChange(this.splitmoduleId,this.splituserId,addressData,this.parentIndex,this.childIndex,response);                  			;                  			                  			
					 this.alertService.showMessage(
						 'Success',
						 `Saved Shipping Information Successfully`,
						 MessageSeverity.success
					 );}else {
						this.alertService.showMessage(
							'Error',
							`Eroor While Saving Shipping Address`,
							MessageSeverity.error
						);
					 }
				 },err => {
					 this.isSpinnerVisible = false;
					 const errorLog = err;
					 this.errorMessageHandler(errorLog);		
				});
			} else {
				 this.commonService.createAllAddres(addressData).subscribe(response => {  
					if(response) {
					this.onUserNameChange(this.splitmoduleId,this.splituserId,addressData,this.parentIndex,this.childIndex,response);                  			;                  			
					 this.alertService.showMessage(
						 'Success',
						 `Shipping Information Updated Successfully`,
						 MessageSeverity.success
					 );}else {
						this.alertService.showMessage(
							'Error',
							`Eroor While Saving Shipping Address`,
							MessageSeverity.error
						);
					 }
				 },err => {
					 this.isSpinnerVisible = false;
					 const errorLog = err;
					 this.errorMessageHandler(errorLog);		
				});
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
        this.parentQty = partList.quantityOrdered ? parseFloat(partList.quantityOrdered.toString().replace(/\,/g,'')) : 0;
		for (let i = 0; i < partList.childList.length; i++) {
			if (partList.childList[i].quantityOrdered === null || partList.childList[i].quantityOrdered === undefined) {
				partList.childList[i].quantityOrdered = 0;
			}
			this.childOrderQtyArray.push(parseInt(partList.childList[i].quantityOrdered.toString().replace(/\,/g,'')));
			this.childOrderQtyTotal = this.childOrderQtyArray.reduce((acc, val) => acc + val, 0);			
			if (this.childOrderQtyTotal > this.parentQty) {
				if(partChildList) {
					partChildList.quantityOrdered = 0;}
				else {
					partList.quantityOrdered = 0;}
			}
		}
		if (this.childOrderQtyTotal > this.parentQty) {		
			this.alertService.showMessage(
				'Error',
				'Total Child Order Quantity exceeded the Parent Quantity!',
				MessageSeverity.error
			);
		}
		if(partChildList) {
			partChildList.quantityOrdered = partChildList.quantityOrdered ? formatNumberAsGlobalSettingsModule(partChildList.quantityOrdered, 0) : 0;
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
            if (middleName != "" && middleName != null && middleName != null) {
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
			updatedBy: this.userName,
			masterCompanyId: this.currentUserMasterCompanyId
			
		}
		this.vendorService.newAddContactInfo(vendorContactInfo).subscribe(res => {
			const data = {...res,	
				          createdBy: this.userName,
						  updatedBy: this.userName,
						  masterCompanyId: this.currentUserMasterCompanyId,
						  vendorId: editValueAssignByCondition('vendorId', this.headerInfo.vendorId)}
			this.vendorService.newAddvendorContact(data).subscribe(data => {
				this.getVendorContactsListByID(vendorContactInfo.vendorId);
				this.alertService.showMessage(
					'Success',
					`Saved Vendor Contact Successfully`,
					MessageSeverity.success
				);
			},err => {
				this.isSpinnerVisible = false;
				const errorLog = err;
				this.errorMessageHandler(errorLog);		
			});			
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});		
	}	

	patternMobilevalidationWithSpl(event: any) {
        const pattern = /[0-9\+\-()\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

	checkValidOnChange(condition, value) {
		if(condition != null && condition != 0 && value == "companyId") {
			this.managementValidCheck = false;
		}
		if(condition != null &&  condition != 0 && value == "shipToUserTypeId") {
			this.shipToUserTypeValidCheck = false;
		}
		if(condition != null &&  condition != 0 && value == "shipToSiteId") {
			this.shipToSiteNameValidCheck = false;
		}
		if(condition != null && condition != 0 && value == "shipViaId") {
			this.shipViaValidCheck = false;
		}
		if(condition != null &&  condition != 0 && value == "billToUserTypeId") {
			this.billToUserTypeValidCheck = false;
		}
		if(condition != null &&  condition != 0  && value == "billToSiteId") {
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
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
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
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
	}

	onSelectStatus() {
		if(this.headerInfo.statusId == this.poFulfillingstatusID) {	
			this.disableAddPart = true;
			this.enableHeaderSaveBtn = true;
		} else {
			this.disableAddPart = false;			
			this.enableHeaderSaveBtn = false;			
		}
		if(this.headerInfo.statusId == this.poOpenstatusID)
			{
				this.disableHeaderInfo = false;
				
			}
			else 
			{
				this.disableHeaderInfo = true;
						
			}
	}

	enableHeaderSave() {
		if(this.createPOForm.valid) {
		this.enableHeaderSaveBtn = true;}
		else{
			this.enableHeaderSaveBtn = false;
		}
	}

	enablePartSave() {
		this.enablePartSaveBtn = true;
	}

	enableAddSave() {
		this.enableAddSaveBtn = true;
	}

	onChangeShippingHandlingCost(str) {
		this.sourcePoApproval[str] = this.sourcePoApproval[str] ? formatNumberAsGlobalSettingsModule(this.sourcePoApproval[str], 2) : '0.00';
	}

	openVendorCapesHistory(row) {
		this.isSpinnerVisible = true;
        this.vendorService.getVendorCapabilityAuditHistory(row.vendorCapabilityId, row.vendorId).subscribe(res => {
			this.capabilityauditHistory = res.map(x => {
				return {
					...x,
					cost: x.cost ? formatNumberAsGlobalSettingsModule(x.cost, 2) : '0.00'
				}
			});
			this.isSpinnerVisible = false;
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
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
                let disableEdit = this.getPartToDisableOrNot(x);
                if ((x.actionId != this.ApprovedstatusId && x.actionId != 0) && disableEdit) {
                    x.isSelected = !isSelected;
                }
            }
		);
		this.selectEachApproval();
	}

	onStatusChange(approver) {
		if(approver.isParent) {
			for(let j=0; j < this.approvalProcessList.length; j++) {
				if(this.approvalProcessList[j].parentId == approver.purchaseOrderPartId 
					&& this.approvalProcessList[j].actionId != this.ApprovedstatusId &&
						  this.approvalProcessList[j].actionStatus != 'Returned to Requisitioner') {
					this.approvalProcessList[j].statusId = approver.statusId;	
					this.approvalProcessList[j].sentDate = approver.sentDate;
					this.approvalProcessList[j].approvedDate = approver.approvedDate;
				}
			}
		}
	}


	selectApproval(approver) {
       if(approver.isSelected) {
		if(approver.isParent) {
			for(let j=0; j < this.approvalProcessList.length; j++) {
				let disableEdit = this.getPartToDisableOrNot(this.approvalProcessList[j]);
				if(this.approvalProcessList[j].parentId == approver.purchaseOrderPartId 
					 && this.approvalProcessList[j].actionId != this.ApprovedstatusId
					 && disableEdit) {
					this.approvalProcessList[j].isSelected = true;	
				}
			}
		}
	    this.enableApproverSaveBtn = true;
	   }else{
		approver.statusId =  approver.previousstatusId; 
		this.selectallApprovers = false;
		if(approver.isParent) {
			for(let j=0; j < this.approvalProcessList.length; j++) {
				if(this.approvalProcessList[j].parentId == approver.purchaseOrderPartId ) {
					this.approvalProcessList[j].isSelected = false;	
					this.selectallApprovers = false;
					this.approvalProcessList[j].statusId = this.approvalProcessList[j].previousstatusId;	
										
				}
			}
		}
		this.enableApproverSaveBtn = false;

		for(let j=0; j < this.approvalProcessList.length; j++) {
			if(this.approvalProcessList[j].isSelected) {
				this.enableApproverSaveBtn = true;					
			}
		}
	   }
	}

	selectEachApproval() {
		 for(let i=0; i < this.approvalProcessList.length; i++) {
		 	if(this.approvalProcessList[i].isSelected) {
		 		this.enableApproverSaveBtn = true;
		 		break;
		 	}else {				
				 this.enableApproverSaveBtn = false;
				 this.approvalProcessList[i].statusId = this.approvalProcessList[i].previousstatusId;
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
        this.purchaseOrderService.savePurchaseOrderApproval(data).subscribe(res => {
			if(res) {
                if (res.response) {
						this.getApprovalProcessListById(this.poId);
						this.headerInfo.statusId = res.response;
						//this.getVendorPOHeaderById(this.poId);
						this.enableHeaderSaveBtn = false;
						if(this.headerInfo.statusId == this.poFulfillingstatusID) {
							this.disableAddPart = true;	
						} else {
							this.disableAddPart = false;
						}
						this.isSpinnerVisible = false;
						this.alertService.showMessage(
							'Success',
							`Saved Approver Process Successfully`,
							MessageSeverity.success
						);}
			 else {
				this.isSpinnerVisible = false;
				this.alertService.showMessage(
					'Error',
					res.message,
					MessageSeverity.error
				);}
			 }
			}, err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);
		});
		this.enableHeaderSaveBtn = false;

	}

showAlertMessage() {
	$('#warnRestrictMesg').modal("show");
}

WarnRescticModel() {
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
}
    getPartToDisableOrNot(part) {
        if (part.actionStatus != 'Approved') {
            if (part.actionId == this.SentForInternalApprovalID) {
                return true;
            }
            else if (part.actionId == this.SubmitInternalApprovalID) {
                if (this.internalApproversList && this.internalApproversList.length > 0) {
                    let approverFound = this.internalApproversList.find(approver => approver.approverId == this.employeeId && approver.isExceeded == false);
                    if (approverFound) {
                        return true;
                    } else {
                        return false;
                    }
                }
                else { return false; }
            }
		} else {return false;}
		
    }
}