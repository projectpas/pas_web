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
declare var $ : any;
import { MenuItem } from 'primeng/api';
import { GlAccountService } from '../../../../services/glAccount/glAccount.service';
import { getValueFromObjectByKey, getObjectByValue, getValueFromArrayOfObjectById, getObjectById, editValueAssignByCondition, getValueByFieldFromArrayofObject, formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { AuthService } from '../../../../services/auth.service';
import { CommonService } from '../../../../services/common.service';
import { CustomerShippingModel } from '../../../../models/customer-shipping.model';
import { CompanyService } from '../../../../services/company.service';
import { CustomerInternationalShipVia } from '../../../../models/customer-internationalshipping.model';
import { PurchaseOrderService } from '../../../../services/purchase-order.service';
import { VendorCapabilitiesService } from '../../../../services/vendorcapabilities.service';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { DatePipe } from '@angular/common';
import { SalesOrderReferenceStorage } from '../../../sales/shared/sales-order-reference-storage';
import { StocklineReferenceStorage } from '../../../stockline/shared/stockline-reference-storage';
import { AppModuleEnum } from '../../../../enum/appmodule.enum';
import { VendorWarningEnum } from '../../../../enum/vendorwarning.enum';
import { RepairOrderService } from '../../../../services/repair-order.service';
import { StocklineService } from '../../../../services/stockline.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { NgbModalRef, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-ro-setup',
	templateUrl: './ro-setup.component.html',
	styleUrls: ['./ro-setup.component.scss'],
	providers: [DatePipe]
})
/** purchase-setup component*/
export class RoSetupComponent implements OnInit {
	arrayPrioritylist:any[] = [];
	arrayRostatuslist:any[] = [];
	arrayCurrencylist:any[] = [];
	arrayConditionlist:any[] = [];
	managmentstrctureId: number = 0;
	isheaderEmployee: boolean = false;
	showAddresstab:boolean  = false;
	showDocumenttab:boolean  = false;
	showComunicationtab:boolean  = false;
	showVendorCaptab:boolean  = false;
	addressType:any  = 'RO';
	id: number;
	filterSearchText : string;
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
	contactMemo:any;
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
	@ViewChild('createROForm',{static:false}) createROForm: NgForm;
	@ViewChild('createROPartsForm',{static:false}) createROPartsForm: NgForm;
	@ViewChild('createROAddressForm',{static:false}) createROAddressForm: NgForm;
	repairOrderId: any;	
	repairOrderPartRecordId : any
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
	roId: any;	
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
	listOfErrors: any;
	disableAddPart: boolean = false;
	disableHeaderInfo: boolean = false; 
	allWorkOrderInfo: any = [];
	allsubWorkOrderInfo: any = [];
	//allRepairOrderInfo: any = [];
	allSalesOrderInfo: any = [];
	allShipViaInfo: any = [];
	allWorkOrderDetails: any = [];
	allsubWorkOrderDetails: any = [];
	allRepairOrderDetails: any = [];
	allSalesOrderDetails: any = [];	
	altPartNumList: any = [];
	altPartCollection: any = [];
	toggle_ro_header: boolean = true;
	isEditModeHeader: boolean = false;
	isEditModePart: boolean = false;
	isEditModeAdd: boolean = false;
	salesOrderReferenceData: any;
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
	roFulfillingstatusID: number = -1;
	roOpenstatusID: number = -1;
	roApprovaltaskId = 0;
	ApprovedstatusId = 0; 
	WaitingForApprovalstatusId = 0; 
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
	//arrayROlist:any[] = [];
	arraySOlist:any[] = [];
	breadcrumbs: MenuItem[];
	splitAddbutton: boolean = false;
	lstfilterSplitSite: any[];
	changeName: boolean = false;
	issplitSiteNameAlreadyExists: boolean = false;
	editSiteName: string = '';
	splitSieListOriginal: any[];
	splitmoduleId: number=0;
	splituserId:number=0;
	rosettingModel: any = {};
	fields = ['partsCost', 'partsRevPercentage', 'unitCost', 'extCost', 'qty', 'laborCost', 'laborRevPercentage', 'overHeadCost', 'overHeadPercentage', 'chargesCost', 'freightCost', 'exclusionCost', 'directCost', 'directCostPercentage', 'revenue', 'margin', 'marginPercentage'];
	approvalProcessHeader = [
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
        }
		, {
            header: 'PN',
            field: 'partNumber'
        }, {
            header: 'PN Desc',
            field: 'partDescription'
		},{
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
	moduleName:any="RepairOrder";
	home: any;
	itemMasterId : number;
	partName : string;
	adddefaultpart : boolean = true;
	modal: NgbModalRef;
	alertText:string
	salesOrderId:number;
	msgflag: number = 0;

	constructor(private route: Router,
		public legalEntityService: LegalEntityService,
		private modalService: NgbModal,
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
		private commonService: CommonService,
		private _actRoute: ActivatedRoute,
		private purchaseOrderService: PurchaseOrderService,		
		private vendorCapesService: VendorCapabilitiesService,
		private itemser: ItemMasterService,
		private datePipe: DatePipe,
		private stocklineService: StocklineService, 
		private workOrderService: WorkOrderService,
		private repairOrderService: RepairOrderService) {
		this.vendorService.ShowPtab = false;
		this.vendorService.alertObj.next(this.vendorService.ShowPtab);
		this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-ro-setup';
		this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
		this.itemMasterId = JSON.parse(localStorage.getItem('itemMasterId'));
		this.partName = (localStorage.getItem('partNumber'));	
		this.salesOrderId = JSON.parse(localStorage.getItem('salesOrderId'));	
	}

	ngOnInit() {		
		this.companyModuleId = AppModuleEnum.Company;
        this.sourcePoApproval.shipToUserTypeId = AppModuleEnum.Company;
        this.sourcePoApproval.billToUserTypeId = AppModuleEnum.Company;
        this.vendorModuleId = AppModuleEnum.Vendor;
        this.customerModuleId = AppModuleEnum.Customer;
        this.headerInfo.companyId = 0;
        this.headerInfo.buId = 0;
        this.headerInfo.divisionId = 0;
        this.headerInfo.departmentId = 0;
        this.headerInfo.statusId = 0;
        this.headerInfo.openDate = new Date();
		this.headerInfo.closedDate = ''; 
		this.rosettingModel.IsResale = false;
        this.rosettingModel.IsDeferredReceiver = false;
        this.rosettingModel.IsEnforceApproval = false;
        this.getRepairOrderMasterData();
		

		this.vendorIdByParams = this._actRoute.snapshot.params['vendorId'];       
		this.id = this.roId = this._actRoute.snapshot.params['id'];	
		this.workOrderPartNumberId = this._actRoute.snapshot.params['mpnid'];
        if (this.roId !== 0 && this.roId !== undefined) {
				this.breadcrumbs = [
					{ label: 'Repair Order' },
					{ label: 'Edit Repair Order' },
				];
                this.isEditMode = true;
                this.isEditModeHeader = true;
				this.toggle_ro_header = false;				
				this.isSpinnerVisible = false;
				this.repairOrderService.getAllEditID(this.roId).subscribe(res => {
					const result = res;
					if(result && result.length > 0) {
						result.forEach(x => 
							{
								if(x.label == "VENDOR"){
									this.arrayVendlsit.push(x.value);
									this.vendorId=x.value; 
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
								// else if (x.label == "RONO") {
                                //     this.arrayROlist.push(x.value);
								// }
								else if (x.label == "SONO") {
                                    this.arraySOlist.push(x.value);
								}
								else if (x.label == "PRIORITY") {
                                    this.arrayPrioritylist.push(x.value);
								}
								else if (x.label == "CURRENCY") {
                                    this.arrayCurrencylist.push(x.value);
								}
								else if (x.label == "CONDITION") {
                                    this.arrayConditionlist.push(x.value);
								}								
							});
						this.editDropDownLoad();
						this.isEditMode = true;
						this.isEditModeHeader = true;
						this.toggle_ro_header = false;
						this.isSpinnerVisible = true;			
						setTimeout(() => {	
							this.isSpinnerVisible = true;			
							this.getVendorROHeaderById(this.roId);
							this.getRepairOrderAllPartsById(this.roId);
							this.enableHeaderSaveBtn = false;
							this.isSpinnerVisible = false;
						},2200);
					}
				});
				setTimeout(() => {
					if (this.itemMasterId > 0 && this.adddefaultpart) {
						this.isSpinnerVisible = true;
						this.addPartNumbers(this.itemMasterId,this.partName)
						this.adddefaultpart = false;
						this.isSpinnerVisible = false;		
					}
				},3000);
               
		}
		else {
				if (this.headerInfo.repairOrderNumber == "" || this.headerInfo.repairOrderNumber == undefined) {
					this.headerInfo.repairOrderNumber = 'Creating';
				}          
				this.priorityData();           
				this.loadROStatus();			
				this.getManagementStructureDetails(this.currentUserManagementStructureId,this.employeeId);			
				this.isSpinnerVisible = false;
				if (this.vendorIdByParams) {
						this.arrayVendlsit.push(this.vendorIdByParams);
						this.loadvendorDataById(this.vendorIdByParams);               
				}else {
					this.loadVendorList(''); 
				}
				this.breadcrumbs = [
					{ label: 'Repair Order' },
					{ label: 'Create Repair Order' },
				];           
		}
		
        
	}
	getRepairOrderMasterData() {    
        this.repairOrderService.getRepairOrderSettingMasterData(this.currentUserMasterCompanyId).subscribe(res => {
            if (res) {
                this.rosettingModel.repairOrderSettingId = res.repairOrderSettingId;
                this.rosettingModel.IsResale = res.isResale;
                this.rosettingModel.IsDeferredReceiver = res.isDeferredReceiver;
				this.rosettingModel.IsEnforceApproval = res.isEnforceApproval;
				if(!this.isEditMode) {
				this.headerInfo.resale =  this.rosettingModel.IsResale;
				this.headerInfo.deferredReceiver = this.rosettingModel.IsDeferredReceiver;
			   }
            }
        }, err => {
            this.isSpinnerVisible = false;  
        });
    }

	//#region All Binding 
    warningMessage:any;
	warningID:any = 0;
    isEditWork:any = false;
	restrictID:any = 0;
	restrictMessage:any;
	WarningsList: any;
	WarningListId:any;
	warningsandRestriction(Id) {       
			this.WarningListId = VendorWarningEnum.Create_Repair_Order;
			this.warningMessage = "";
			this.warningID = 0;					
			this.restrictID = 0;
			this.restrictMessage= "";
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
                });
            }
	}
	
	getStatusvalue(status, action ) {
        if (status == 'Submit Approval' && action == '1') {
            return true;
        } else { return false; }
	}

	// bindshippingSieListOriginal(moduleId=0,userId=0) {
	// 	moduleId = moduleId = 0 ? this.splitmoduleId : 0;
	// 	userId= userId = 0 ? this.splituserId : 0;

	// this.commonService.getaddressdetailsOnlyUserbyuser(moduleId, userId, 'Ship',this.roId).subscribe(
	// 	returnddataforbill => {
	// 		this.splitSieListOriginal = returnddataforbill.address.map(x => {
	// 																		return {
	// 																			siteName: x.siteName, siteId: x.siteId
	// 																		}});
	// 	});
	// }

	filterSplitSite(event) {		
        this.commonService.getaddressdetailsOnlyUserbyuser(this.splitmoduleId, this.splituserId, 'Ship',this.roId).subscribe(
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
		this.commonService.getManagmentStrctureData(id,empployid,editMSID,this.currentUserMasterCompanyId).subscribe(response => {
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
		this.commonService.getManagmentStrctureData(msId,employid,editMSID,this.currentUserMasterCompanyId).subscribe(response => {
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
		this.commonService.getManagmentStrctureData(partChildList.managementStructureId,this.employeeId,editMSID,this.currentUserMasterCompanyId).subscribe(response => {
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
				this.employeedata('',this.headerInfo.managementStructureId);
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
		 }  else {
			 this.headerInfo.managementStructureId  = this.headerInfo.companyId;		
		 }
		 this.employeedata('',this.headerInfo.managementStructureId);
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
		}
		 else {
			 this.headerInfo.managementStructureId  = this.headerInfo.buId;
			 this.headerInfo.divisionId = 0;
		 }
		 this.employeedata('',this.headerInfo.managementStructureId);
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
		}
		 else {
			 this.headerInfo.managementStructureId  = this.headerInfo.divisionId;
			 this.headerInfo.departmentId = 0;
		 }	
		 this.employeedata('',this.headerInfo.managementStructureId);	
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
			});
		}
	}
	
	loadROStatus() {
		if (this.arrayRostatuslist.length == 0) {
            this.arrayRostatuslist.push(0); }
			this.commonService.autoSuggestionSmartDropDownList('ROStatus','ROStatusId','Description','',
								  true, 0,this.arrayRostatuslist.join(),this.currentUserMasterCompanyId)
				.subscribe(res => {
				this.roStatusList = res;
				this.roStatusList = this.roStatusList.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));	
				res.forEach(x => {
					if (x.label.toUpperCase() == "OPEN") {
						this.headerInfo.statusId = x.value;
						this.roOpenstatusID = x.value;
					}
					else if (x.label.toUpperCase()  == "FULFILLING") {
						this.roFulfillingstatusID = x.value;
					}
				}); }
			,err => {
				this.isSpinnerVisible = false;	}
			); 
		
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
		});
	}

	enableNotes() {
	
	}

	onWOSelect(id,partList,index){		
		this.arrayWOlist.push(id);		
		this.GetSubWolist(id,partList,index);		
	}

	onSubWOSelect(id){
		this.arraysubWOlist.push(id);
	}

	onSOSelect(id){
		this.arraySOlist.push(id);
	}
	
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

	loadModuleListForVendorComp() {
		this.commonService.getModuleListForObtainOwnerTraceable(this.authService.currentUser.masterCompanyId).subscribe(res => {
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
		});
	}
	
	//#endregion
	// Load Vendor data
	loadvendorDataById(vendorId) {			
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
            this.vendorService.getVendorNameCodeListwithFilter('', 20, this.arrayVendlsit.join(),this.currentUserMasterCompanyId).subscribe(res => {
                this.allActions = res;
                this.vendorNames = res;
                this.vendorCodes = res;
                this.splitVendorNames = res;
                this.headerInfo.vendorId = getObjectById('vendorId', vendorId, this.allActions);
                this.headerInfo.vendorCode = getObjectById('vendorId', vendorId, this.allActions);
                this.headerInfo.vendorName = getValueFromArrayOfObjectById('vendorName', 'vendorId', vendorId, this.allActions);
                this.isSpinnerVisible = false;    
            }, err => {
                this.isSpinnerVisible = false;            
            });
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
		});
	}

	getVendorROHeaderById(roId) {			
		this.repairOrderService.getVendorROHeaderById(roId).subscribe(res => {			
			this.isheaderEmployee = true;					
			this.headerInfo = {
				repairOrderNumber: res.repairOrderNumber,
				openDate: new Date(res.openDate),
				closedDate: res.closedDate ? new Date(res.closedDate) : '',
				needByDate: new Date(res.needByDate),
				priorityId: getObjectById('value', res.priorityId, this.allPriorityInfo),
				deferredReceiver: res.deferredReceiver,
				vendorId: getObjectById('vendorId', res.vendorId, this.allActions),
				vendorCode: getObjectById('vendorId', res.vendorId, this.allActions),
				//vendorCode: res.VendorCode,
				//vendorContactId: this.getVendorContactsListByIDEdit(res),
				//vendorContactPhone: this.getVendorContactsListByIDEdit(res),
				vendorName: getValueFromArrayOfObjectById('vendorName', 'vendorId', res.vendorId, this.allActions),
				creditLimit: res.creditLimit ? formatNumberAsGlobalSettingsModule(res.creditLimit, 2) : '0.00',
				creditTerms: res.creditTerms,
				creditTermsId: res.creditTermsId,
				requestedBy: res.requestedBy,
				requisitionerId: getObjectById('value', res.requestedBy, this.allEmployeeList),
				approverId: getObjectById('value', res.approverId, this.allEmployeeList),
				approvedDate: res.dateApproved ? new Date(res.dateApproved) : '',
				statusId: res.statusId,
				resale: res.resale,
				managementStructureId:res.managementStructureId,
				companyId: this.getManagementStructureDetails(res.managementStructureId,this.employeeId,res.managementStructureId),
                roMemo: res.roMemo,
				notes: res.notes,
                createdDate: res.createdDate,
				updatedDate:res.updatedDate,
				createdBy:res.createdBy,
				updatedBy:res.updatedBy 
			};	
			this.getVendorContactsListByIDEdit(res);		
			if(this.headerInfo.statusId == this.roOpenstatusID)
			{
				this.disableHeaderInfo = false;
			}
			else 
			{
				this.disableHeaderInfo = true;	
			}
			if(this.headerInfo.statusId == this.roFulfillingstatusID) {
				this.disableAddPart = true;	
			} else {
				this.disableAddPart = false;	
			}
			this.enableHeaderSaveBtn = false;
			this.capvendorId = res.vendorId;
		},err => {
			this.isSpinnerVisible = false;			
		});
	}

   
	getRepairOrderAllPartsById(roId) {	
		this.isSpinnerVisible = true;
		this.repairOrderService.getRepairOrderAllPartsById(roId,this.employeeId, this.workOrderPartNumberId).subscribe(res => {
			if(res) {
				this.isSpinnerVisible = true;
				this.BindAllParts(res);
				this.isSpinnerVisible = false;
				this.enableHeaderSaveBtn = false;
				}
				this.isSpinnerVisible = false;
		}, err => {
			this.isSpinnerVisible = false;			
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
					ifSplitShip: x.roPartSplits.length > 0 ? true : false,
					partNumber: x.partNumber,
					partDescription: x.partDescription,
					needByDate: x.needByDate ? new Date(x.needByDate) : '',
					conditionId: parseInt(x.conditionId),
					priorityId: parseInt(x.priorityId),
					discountPercent: x.discountPercent ? parseInt(x.discountPercent) : 0,							
					functionalCurrencyId: getObjectById('value', x.functionalCurrencyId, this.allCurrencyData),
					reportCurrencyId: getObjectById('value', x.reportCurrencyId, this.allCurrencyData),							
					workOrderId: getObjectById('value', x.workOrderId == null ? 0 : x.workOrderId, this.allWorkOrderInfo),					
					subWorkOrderId: x.subWorkOrderId,
					//repairOrderId: getObjectById('value', x.repairOrderId == null ? 0 : x.repairOrderId, this.allRepairOrderInfo),
					salesOrderId: getObjectById('value', x.salesOrderId == null ? 0 : x.salesOrderId, this.allSalesOrderInfo),
					quantityOrdered: x.quantityOrdered ? formatNumberAsGlobalSettingsModule(x.quantityOrdered, 0) : '0',
					vendorListPrice: x.vendorListPrice ? formatNumberAsGlobalSettingsModule(x.vendorListPrice, 2) : '0.00',
					discountPerUnit: x.discountPerUnit ? formatNumberAsGlobalSettingsModule(x.discountPerUnit, 2) : '0.00',
					discountAmount: x.discountAmount ? formatNumberAsGlobalSettingsModule(x.discountAmount, 2) : '0.00',
					unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
					extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00',
					isApproved: x.isApproved ? x.isApproved : false,							
					childList: this.getRepairOrderSplitPartsEdit(x, pindex,data[1]),
					remQty: 0,
					stocklineId:x.stocklineId
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

				var childQty = 0;
				if (this.newPartsList.childList != null && this.newPartsList.childList.length > 0) {
					for (let j = 0; j < this.newPartsList.childList.length; j++) {
						if(!this.newPartsList.childList[j].isDeleted){
							childQty +=  this.newPartsList.childList[j].quantityOrdered ? parseInt(this.newPartsList.childList[j].quantityOrdered.toString().replace(/\,/g,'')) : 0;
						}					
					}
					var quantityOrdered =  this.newPartsList.quantityOrdered ? parseInt(this.newPartsList.quantityOrdered.toString().replace(/\,/g,'')) : 0;					
					this.newPartsList.remQty = quantityOrdered - childQty;
				}
				this.getSubWOlsitId(this.newPartsList,data[4]);		
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
	getRepairOrderSplitPartsEdit(partList, pindex,ms?) {
		if (partList.roPartSplits) {
			return partList.roPartSplits.map((y, cindex) => {
				const splitpart = {
					...y,
					needByDate: y.needByDate ? new Date(y.needByDate) : '',
					isApproved: y.isApproved ? y.isApproved : false,
					partListUserTypeId: y.roPartSplitUserTypeId,
					roPartSplitSiteId : y.roPartSplitSiteId,
					priorityId: partList.priorityId ? getValueFromArrayOfObjectById('label', 'value', partList.priorityId, this.allPriorityInfo) : null,
					partListUserId: this.getPartSplitUserIdEdit(y, pindex, cindex),
					partListAddressId: y.roPartSplitAddressId ? y.roPartSplitAddressId : 0,
					quantityOrdered: y.quantityOrdered ? formatNumberAsGlobalSettingsModule(y.quantityOrdered, 0) : '0'				
				}				
				return splitpart;
			})
		}
	}

	getManagementStructureForChildPart(partChildList,response) {
			if(response) {				
				const result = response[partChildList.repairOrderPartRecordId];
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

	getSubWOlsitId(parentdata,response) {		
        const data1 = response[parentdata.repairOrderPartRecordId];
		if(data1) {
				if (data1[0]) {
					//parentdata.subWorkOrderlist = data1[0];
					const data = data1.map(x => {
						return {
							value: x.subWorkOrderId,
							label: x.subWorkOrderNo
						}
					});
					this.allsubWorkOrderInfo = [
						{ value: 0, label: '-- Select --' }
					];
					parentdata.subWorkOrderlist = [...this.allsubWorkOrderInfo, ...data];					
					parentdata.subWorkOrderId = getObjectByValue('value',parentdata.subWorkOrderId  == null ? 0 : parentdata.subWorkOrderId, parentdata.subWorkOrderlist);

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
        const data1 = response[parentdata.repairOrderPartRecordId];
		if(data1) {
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
					parentdata.altPartCollection = this.partWithId.altPartNumList.map(x => {
						return {value: x.altEquiPartNumberId, label: x.altEquiPartNumber }});
					this.altPartNumList = this.partWithId.altPartNumList;
					if(parentdata.altEquiPartNumberId) {
						parentdata.altEquiPartNumberId = getObjectById('value', parentdata.altEquiPartNumberId, parentdata.altPartCollection);
					} else if(this.altPartNumList.length > 0) {
						parentdata.altEquiPartNumberId = parentdata.altPartCollection[0];
					}				
					this.workOrderService.getStockLineByItemMasterId(parentdata.itemMasterId, parentdata.conditionId,this.authService.currentUser.masterCompanyId).subscribe(resp => {
						   parentdata.allStocklineDetails = resp;
							if (parentdata.stockLineId) {
							parentdata.stocklineId = getObjectById('stockLineId', parentdata.stockLineId, parentdata.allStocklineDetails);
							}
							this.getStockLineDetails(parentdata);
					},err => {const errorLog = err;});
					
					// if(parentdata.conditionId && value != 'onEdit') {
					// 	this.getStockLineByItemMasterId(parentdata);
					// 	this.getPriceDetailsByCondId(parentdata);
					// }					
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
				const result = response[partList.repairOrderPartRecordId];
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
	
	getPartSplitUserIdEdit(data, pindex, cindex) {
		if (data.roPartSplitUserTypeId === this.customerModuleId) {		
			this.onUserNameChange( this.customerModuleId,data.roPartSplitUserId, data, pindex, cindex);
			return getObjectById('value', data.roPartSplitUserId, this.allCustomers);
		}
		if (data.roPartSplitUserTypeId === this.vendorModuleId) {
			this.onUserNameChange( this.vendorModuleId,data.roPartSplitUserId, data, pindex, cindex);
			return getObjectById('vendorId', data.roPartSplitUserId, this.allActions);
		}
		if (data.roPartSplitUserTypeId === this.companyModuleId) {
			this.onUserNameChange(this.companyModuleId,data.roPartSplitUserId, data, pindex, cindex);
			return getObjectById('value', data.roPartSplitUserId, this.legalEntity);
		}
	}

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

		this.commonService.getaddressdetailsOnlyUserbyuser(moduleID, userID, 'Ship',this.roId).subscribe(
			returnddataforbill => {
				if(returnddataforbill) {
				this["splitAddressData" + pindex + cindex] = [];
				this["splitAddressData" + pindex + cindex] = returnddataforbill.address;
				if(!data || data == null) {
					if(returnddataforbill.address && returnddataforbill.address.length > 0) {
							for(var i =0; i < returnddataforbill.address.length; i++) {
								if(returnddataforbill.address[i].isPrimary) {			
									this.partListData[pindex].childList[cindex].roPartSplitSiteId = returnddataforbill.address[i].siteID;
								}
							}
					}
				}
				
				if(siteID && siteID > 0)  {     
					this.partListData[pindex].childList[cindex].roPartSplitSiteId = siteID;
				}
			}
			},err => {
			this.isSpinnerVisible = false;				
		});
		
	}
	

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
			//parentdata.salesOrderId = null;
			parentdata.memo = null;
			//this.getManagementStructureForParentEdit(parentdata,this.employeeId);
		}
		this.itemTypeId = 1;

		//For Getting Data After Part Selected	
		this.isSpinnerVisible = true;	
		this.repairOrderService.getPartDetailsWithidForSinglePart(itemMasterId).subscribe(
			data1 => {
				if (data1[0]) {
					this.partWithId = data1[0];
					parentdata.partId = this.partWithId.itemMasterId;
					parentdata.minimumOrderQuantity = this.partWithId.minimumOrderQuantity;					
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
					parentdata.conditionId = this.partWithId.conditionId;	
					parentdata.altPartCollection = this.partWithId.altPartNumList.map(x => {
						return {value: x.altEquiPartNumberId, label: x.altEquiPartNumber }});				
					if(parentdata.conditionId && value != 'onEdit') {
						this.getPriceDetailsByCondId(parentdata);
					}
					this.altPartNumList = this.partWithId.altPartNumList;
					if (parentdata.altEquiPartNumberId && value == 'onEdit') {
						parentdata.altEquiPartNumberId = getObjectById('value', parentdata.altEquiPartNumberId, parentdata.altPartCollection);
					} else if(this.altPartNumList.length > 0) {
						parentdata.altEquiPartNumberId = parentdata.altPartCollection[0];
					}
										
				}
				this.isSpinnerVisible = false;
			}, err => {	this.isSpinnerVisible = false;								
			});			
	}

	getPriceDetailsByCondId(parentdata) {
		this.isSpinnerVisible = true;	
		this.commonService.getPriceDetailsByCondId(parentdata.itemMasterId, parentdata.conditionId).subscribe(res => {
			if(res) {
				parentdata.vendorListPrice = res.vendorListPrice ? formatNumberAsGlobalSettingsModule(res.vendorListPrice, 2) : '0.00';
				parentdata.unitCost = res.unitCost ? formatNumberAsGlobalSettingsModule(res.unitCost, 2) : '0.00';
				parentdata.discountPercent = res.discountPercent ? res.discountPercent : 0;
				parentdata.discountPerUnit = res.discountPerUnit ? formatNumberAsGlobalSettingsModule(res.discountPerUnit, 2) : '0.00';
				this.onGetDiscPerUnit(parentdata);
				this.onGetDiscAmount(parentdata);
				this.onGetExtCost(parentdata);
				this.isSpinnerVisible = false;
			}
		},err=>{
			this.isSpinnerVisible =  false;} )
		this.getStockLineByItemMasterId(parentdata);		
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
			this.totalDiscAmount = parseFloat(this.totalDiscAmount) +  parseFloat(x.tempDiscAmt);
			this.totalDiscAmount = this.totalDiscAmount ? formatNumberAsGlobalSettingsModule(this.totalDiscAmount, 2) : '0.00';
		})
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

	getVendorContactsListByIDEdit(res) {
		this.vendorContactList = [];		
		this.warningsandRestriction(res.vendorId);
		this.vendorService.getVendorContactDataByVendorId(res.vendorId).subscribe(data => {
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
		});
	}

	getApproversListById(roId) {	
		this.isSpinnerVisible = true;
		if(this.roApprovaltaskId == 0) {
		this.commonService.smartDropDownList('ApprovalTask', 'ApprovalTaskId', 'Name').subscribe(response => { 		        
		if(response) {					
            response.forEach(x => {
                if (x.label.toUpperCase() == "RO APPROVAL") {
                    this.roApprovaltaskId = x.value;
                }              
			});
			this.getApproversByTask(roId)
		}
		},err => {
			this.isSpinnerVisible = false;				
		});
		}
		else {
			this.getApproversByTask(roId)
		}
		
	}
	getApproversByTask(roId) {		
		this.isSpinnerVisible = true;
		this.repairOrderService.approverslistbyTaskId(this.roApprovaltaskId, roId).subscribe(res => {
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
	
	getApprovalProcessListById(roId) {
		this.isSpinnerVisible = true;
		this.selectallApprovers = false;
		this.enableApproverSaveBtn = false;
		this.repairOrderService.getROApprovalListById(roId).subscribe(res => {			
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
                    this.approvalProcessList.filter(x => x.parentId == element.repairOrderPartId).forEach(					
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
		});
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

	getShipViaDetailsForShipTo(id?) {		
		this.commonService.getShipViaDetailsByModule(this.sourcePoApproval.shipToUserTypeId, this.shipToSelectedvalue,this.authService.currentUser.masterCompanyId).subscribe(response => {
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
		this.commonService.getShipViaDetailsByModule(data.shipToUserType, this.shipToSelectedvalue,this.authService.currentUser.masterCompanyId).subscribe(response => {
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
		});
	}	
	
	onChangeTabView(event) {
		if(event.index == 0) {
			this.getRepairOrderAllPartsById(this.roId);
			this.enablePartSaveBtn = false;
		}
		if(event.index == 1 ) {
			this.showAddresstab = true;
		}
		if(event.index == 2 ) {
			this.getApproversListById(this.roId);
		}
		if(event.index == 3  && this.rosettingModel.IsEnforceApproval) {
			this.getApproversListById(this.roId);
			this.getApprovalProcessListById(this.roId);
			this.enableApproverSaveBtn = false;
		}
		if(event.index == 4 && this.rosettingModel.IsEnforceApproval) {
			this.showVendorCaptab = true;
			const id = editValueAssignByCondition('vendorId', this.headerInfo.vendorId);			
		}
		if(event.index == 5 && this.rosettingModel.IsEnforceApproval) {
			this.showDocumenttab = true;
		}
		if(event.index == 6 && this.rosettingModel.IsEnforceApproval) {
			this.showComunicationtab = true;
		}	
		if(event.index == 2 && !this.rosettingModel.IsEnforceApproval) {
			this.showVendorCaptab = true;
			const id = editValueAssignByCondition('vendorId', this.headerInfo.vendorId);			
		}
		if(event.index == 3 && !this.rosettingModel.IsEnforceApproval) {
			this.showDocumenttab = true;
		}
		if(event.index == 4 && !this.rosettingModel.IsEnforceApproval) {
			this.showComunicationtab = true;
		}	
		
	}

	employeedata(strText = '',manStructID = 0) {
		if(this.arrayEmplsit.length == 0) {			
		this.arrayEmplsit.push(0); }	
		this.arrayEmplsit.push(this.employeeId == null ? 0 : this.employeeId);
		this.commonService.autoCompleteDropdownsEmployeeByMS(strText,true, 20,this.arrayEmplsit.join(),manStructID,this.currentUserMasterCompanyId).subscribe(res => {
			this.allEmployeeList = res;
			this.requisitionerList = res;
			this.currentUserEmployeeName = getValueFromArrayOfObjectById('label', 'value', this.employeeId, res);			
			if(this.isheaderEmployee){
				this.headerInfo.requisitionerId = getObjectById('value', this.headerInfo.requestedBy, this.allEmployeeList);
				this.isheaderEmployee = false;
			}
			if(!this.isEditMode) {
				this.getRequisitionerOnLoad(this.employeeId);
			}			
		},err => {					
		})
	}
	getRequisitionerOnLoad(id) {
		this.headerInfo.requisitionerId = getObjectById('value', id, this.allEmployeeList);
	}

	getLegalEntity(strText = '') {
		if(this.arrayLegalEntitylsit.length == 0) {			
			this.arrayLegalEntitylsit.push(0); }	
			this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name',strText,true, 20,this.arrayLegalEntitylsit.join(),this.currentUserMasterCompanyId).subscribe(res => {
				this.legalEntity = res;
				this.legalEntityList_Forgrid = res;
				this.legalEntityList_ForShipping = res;
				this.legalEntityList_ForBilling= res;
			},err => {
				this.isSpinnerVisible = false;					
			});
	}

	getCountriesList() {
		this.commonService.smartDropDownList('Countries', 'countries_id', 'nice_name').subscribe(res => {
			this.allCountriesList = res;
		},err => {
			this.isSpinnerVisible = false;				
		})
	}	

    filterCompanyNameforgrid(event) {	
			if (event.query !== undefined && event.query !== null) {
				this.getLegalEntity(event.query); }
	}
	// filterCompanyNameforShipping(event) {
	// 	if (event.query !== undefined && event.query !== null) {
	// 		this.getLegalEntity(event.query); }
	// }

	// filterCompanyNameforBilling(event) {
	// 	if (event.query !== undefined && event.query !== null) {
	// 		this.getLegalEntity(event.query); }
	// }

	private priorityData(strText = '') {
        if (this.arrayPrioritylist.length == 0) {
            this.arrayPrioritylist.push(0); }
            this.commonService.autoSuggestionSmartDropDownList('Priority','PriorityId','Description',strText,true, 0,this.arrayPrioritylist.join(),this.currentUserMasterCompanyId).subscribe(res => {
				this.allPriorityInfo = res;
                this.allPriorityInfo.map(x => {
                    if (x.label == 'Routine') {
                        this.headerInfo.priorityId = x;
                    }
            })
            this.onSelectPriority();
            },
            err => {
                this.isSpinnerVisible = false;	});                
    }

	loadWorkOrderList(filterVal = '') {
		if (this.arrayWOlist.length == 0) {
            this.arrayWOlist.push(0); }
		  this.commonService.getWODataFilter(filterVal,20,this.arrayWOlist.join(),this.currentUserMasterCompanyId).subscribe(res => {
			const data = res.map(x => {
				return {
					value: x.workOrderId,
					label: x.workOrderNum
				}
			});
			this.allWorkOrderInfo = [
				{value: 0, label: '-- Select --'}
			];
			this.allWorkOrderInfo = [...this.allWorkOrderInfo, ...data];
			this.allWorkOrderDetails = [...this.allWorkOrderInfo, ...data];
		},err => {
			this.isSpinnerVisible = false;				
		})

	
	}

	loadSubWorkOrderList(filterVal, workOrderId,partList,index) {
		if (this.arraysubWOlist.length == 0) {
			this.arraysubWOlist.push(0);
		}
		// this.commonService.getsubWODataFilter(filterVal, 20, this.arraysubWOlist.join()).subscribe(res => {
		this.commonService.GetSubWolist(workOrderId.value).subscribe(res => {
			const data = res.map(x => {
				return {
					value: x.subWorkOrderId,
					label: x.subWorkOrderNo
				}
			});
			this.allsubWorkOrderInfo = [
				{ value: 0, label: '-- Select --' }
			];
			//this.allsubWorkOrderInfo = [...this.allsubWorkOrderInfo, ...data];
			this.allsubWorkOrderDetails = [...this.allsubWorkOrderInfo, ...data];
			partList.subWorkOrderlist = [...this.allsubWorkOrderInfo, ...data];
		}, err => {
			this.isSpinnerVisible = false;			
		})
	}	

	loadSalesOrderList(filterVal = '') {
		if (this.salesOrderId != undefined && this.salesOrderId != null) {
			this.arraySOlist.push(this.salesOrderId);
		}
		else{
			if (this.arraySOlist.length == 0) {
				this.arraySOlist.push(0); }
		}
		this.commonService.getSODataFilter(filterVal,20,this.arraySOlist.join(),this.currentUserMasterCompanyId).subscribe(res => {
			const data = res.map(x => {
				return {
					value: x.salesOrderId,
		 			label: x.salesOrderNumber
				}
			});
			this.allSalesOrderInfo = [
				{value: 0, label: '-- Select --'}
			];
			this.allSalesOrderInfo = [...this.allSalesOrderInfo, ...data];
			this.allSalesOrderDetails = [...this.allSalesOrderInfo, ...data];
		},err => {
			this.isSpinnerVisible = false;				
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
		this.loadVendorList('');
		this.priorityData();           
		this.loadROStatus();			
		this.loadVendorList();	
		this.loadCurrencyData();
		this.loadConditionData();	
		this.loadApprovalProcessStatus();
		this.loadROApproverStatus();
		this.loadcustomerData();	
		this.getLegalEntity();	
		this.getCountriesList();
		this.loadPercentData();
		this.loadWorkOrderList();	
		this.loadSalesOrderList();
		this.loapartItems();
		this.loadModuleListForVendorComp();
	}

	saveRepairOrderHeader() {			
		if(this.createROForm.invalid || 
			this.headerInfo.companyId == 0 
		    || this.headerInfo.companyId == null) {
			this.alertService.showMessage('Repair Order', "Please enter required highlighted fields for PO Header!", MessageSeverity.error);
			this.inputValidCheckHeader = true;
			if(this.headerInfo.companyId == null ||  this.headerInfo.companyId == 0) { 
				this.managementValidCheck = true;
			}
		}
		else {     
			this.isSpinnerVisible = true;				
			var headerInfoObj = {				
				repairOrderNumber: this.headerInfo.repairOrderNumber,
				priorityId: this.headerInfo.priorityId ? this.getPriorityId(this.headerInfo.priorityId) : 0,
				Priority: this.headerInfo.priorityId && this.headerInfo.priorityId.label 
				           && this.headerInfo.priorityId.label != null && this.headerInfo.priorityId.label != undefined  ? this.headerInfo.priorityId.label : '',				
				openDate: new Date(this.headerInfo.openDate), //this.headerInfo.openDate, //  this.datePipe.transform(this.headerInfo.openDate, "MM/dd/yyyy"),
				needByDate: new Date(this.headerInfo.needByDate), //this.headerInfo.needByDate, //this.datePipe.transform(this.headerInfo.needByDate, "MM/dd/yyyy"),
				statusId: this.headerInfo.statusId ? this.headerInfo.statusId : 0,
				Status: this.headerInfo.statusId && this.headerInfo.statusId > 0 ? getValueFromArrayOfObjectById('label', 'value', this.headerInfo.statusId, this.roStatusList) : '',				
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
				RequisitionerId : this.headerInfo.requisitionerId ? this.headerInfo.requisitionerId.value : 0,
				Requisitioner: this.headerInfo.requisitionerId && this.headerInfo.requisitionerId.label 
								&& this.headerInfo.requisitionerId.label != null && this.headerInfo.requisitionerId.label != undefined  ? this.headerInfo.requisitionerId.label : '',	
				closedDate: this.datePipe.transform(this.headerInfo.closedDate, "MM/dd/yyyy"),
				approverId: this.headerInfo.approverId ? this.getEmployeeId(this.headerInfo.approverId) : 0,
				approvedDate: this.headerInfo.approvedDate,				
				deferredReceiver: this.headerInfo.deferredReceiver ? this.headerInfo.deferredReceiver : false,
				resale: this.headerInfo.resale ? this.headerInfo.resale : false,
				roMemo: this.headerInfo.roMemo ? this.headerInfo.roMemo : '',
                notes: this.headerInfo.notes ? this.headerInfo.notes : '',				
				managementStructureId: this.headerInfo.managementStructureId ? this.headerInfo.managementStructureId : 0,
				masterCompanyId: this.currentUserMasterCompanyId,
			    createdDate: this.headerInfo.createdDate, 	
				createdBy: this.headerInfo.createdBy ? this.headerInfo.createdBy : this.userName,	
				updatedBy:  this.headerInfo.updatedBy ? this.headerInfo.updatedBy : this.userName
			}
        
			if (!this.isEditModeHeader) {				
				this.repairOrderService.saveRepairOrder({ ...headerInfoObj }).subscribe(saveddata => {
					this.repairOrderId = saveddata.repairOrderId;					
					this.roId = saveddata.repairOrderId;					
					//this.headerInfo.repairOrderNumber = saveddata.repairOrderNumber;
					this.isSpinnerVisible = false;
					this.enableHeaderSaveBtn = false;
					this.alertService.showMessage(
						'Success',
						`Saved RO Header Successfully`,
						MessageSeverity.success
					);			
					this.route.navigateByUrl(`vendorsmodule/vendorpages/app-ro-setup/edit/${this.roId}`);
					//this.route.navigate[('/vendorsmodule/vendorpages/app-ro-setup/edit/'+this.roId)];
					if(this.roId) {
						this.isEditModeHeader = true;
						//this.isEditMode = true;
					}
					this.isSpinnerVisible = false;				
				}, err => {
					this.isSpinnerVisible = false;					
					this.toggle_ro_header = true;
					this.enableHeaderSaveBtn = true;
				});
			} else {
				headerInfoObj.updatedBy = this.userName;
				const poHeaderEdit = { ...headerInfoObj, repairOrderId: parseInt(this.roId) };
				this.repairOrderService.saveRepairOrder({ ...poHeaderEdit }).subscribe(saveddata => {
					this.repairOrderId = saveddata.repairOrderId;
					this.roId = saveddata.repairOrderId;
					this.headerInfo.repairOrderNumber = saveddata.repairOrderNumber;
					this.isEditMode = true;
					this.isSpinnerVisible = false;	
					this.enableHeaderSaveBtn = false;			
					this.alertService.showMessage(
						'Success',
						`Updated RO Header Successfully`,
						MessageSeverity.success
					);
				}, err => {
					this.isSpinnerVisible = false;					
					this.toggle_ro_header = true;
					this.enableHeaderSaveBtn = true;
				});
			}
			this.toggle_ro_header = false;
			this.enableHeaderSaveBtn = false;
		}
	}

	dismissModel(status) {		
		this.displayWarningModal = status;
		this.modal.close();	
		if(status)
		this.saveRepairOrderPartsList(''); 
    }
	saveRepairOrderPartsList(content) {
		this.isSpinnerVisible = true;
		this.parentObjectArray = [];
		var errmessage = '';
		for (let i = 0; i < this.partListData.length; i++) {
			this.alertService.resetStickyMessage();			
			// if(this.partListData[i].quantityOrdered == 0) {	
			// 	this.isSpinnerVisible = false;	
			// 	errmessage = errmessage + '<br />' + "Please Enter Qty."
			// }
			if(this.partListData[i].quantityOrdered == 0) {	
				this.isSpinnerVisible = false;
				this.displayWarningModal = false;
				this.alertText = "Part No: "+ this.getPartnumber(this.partListData[i].itemMasterId) + '<br/>' +"Please Enter Qty";
				this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });												
				return;
			}
			if(this.partListData[i].workOrderId) {
				if(this.partListData[i].workOrderId.value != 0) {					
					if (this.partListData[i].salesOrderId) {
						if (this.partListData[i].salesOrderId.value != 0) {
							this.isSpinnerVisible = false;
							errmessage = errmessage + '<br />' + "Work Order already selected please unselect Sales Order."
							this.msgflag = 1;
						}
					}				
				}
			}
			if(this.msgflag == 0) {
				if(this.partListData[i].salesOrderId) {
					if(this.partListData[i].salesOrderId.value != 0) {
						if(this.partListData[i].workOrderId) {
							if (this.partListData[i].workOrderId.value != 0) {
								this.isSpinnerVisible = false;
								errmessage = errmessage + '<br />' +"Sales Order already selected please unselect Work Order."					
							}
						}										
			 		}						    
				}
			 }			

			if(this.partListData[i].minimumOrderQuantity > 0
				&& this.partListData[i].quantityOrdered > 0
				&& this.partListData[i].quantityOrdered < this.partListData[i].minimumOrderQuantity) {
				this.partListData[i].quantityOrdered = this.partListData[i].minimumOrderQuantity;
				this.isSpinnerVisible = false;	
				errmessage = errmessage + '<br />' + 'Minimum Order Qty : '+ this.partListData[i].minimumOrder +'<br /> Order quantity can not be less then Minimum order quantity.'
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
			if(!this.partListData[i].stocklineId || this.partListData[i].stocklineId == 0) {	
				this.isSpinnerVisible = false;	
				errmessage = errmessage + '<br />' + "Stockline is required."
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
					if(!this.partListData[i].childList[j].roPartSplitSiteId 
						|| this.partListData[i].childList[j].roPartSplitSiteId == 0 
						|| this.partListData[i].childList[j].roPartSplitSiteId == null) {	
						this.isSpinnerVisible = false;	
						errmessage = errmessage + '<br />' + "Split Shipment Select Address is required."
					}					

					// if(!this.partListData[i].childList[j].quantityOrdered || this.partListData[i].childList[j].quantityOrdered == 0 ) {	
					// 	this.isSpinnerVisible = false;	
					// 	errmessage = errmessage + '<br />' + "Split Shipment Qty is required."
					// }

					if(!this.partListData[i].childList[j].quantityOrdered || this.partListData[i].childList[j].quantityOrdered == 0 ) {	
						this.isSpinnerVisible = false;
						this.displayWarningModal = false;
						this.alertText ='Part No: ' + this.getPartnumber(this.partListData[i].itemMasterId) + '<br/>' + " Split Shipment Qty is required."
						this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });												
						return;
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
			    var message = 'Part No: ' + this.getPartnumber(this.partListData[i].itemMasterId)  + errmessage 
				this.alertService.showStickyMessage("Validation failed", message, MessageSeverity.error, 'Please enter Qty');
				return;
		    }

			if(this.partListData[i].vendorListPrice == 0 && this.displayWarningModal == false) {	
				// this.isSpinnerVisible = false;
				// this.displayWarningModal = true;										
				// return;
				this.isSpinnerVisible = false;	
				this.displayWarningModal = true;		    				
				this.alertText = 'Part No: ' + this.getPartnumber(this.partListData[i].itemMasterId)  + '<br />'+"Vendor Price is not populated  - Continue Y/N"
				this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });	
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
			if (this.partListData[i].ifSplitShip) {
				if (childDataList.length > 0) {
					this.childObjectArray = [];
					for (let j = 0; j < childDataList.length; j++) {					
						this.childObject = {
						repairOrderId: this.roId,
						itemMasterId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,						
						assetId: this.partListData[i].assetId ? this.partListData[i].assetId : 0,
						partNumberId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
						roPartSplitUserTypeId: childDataList[j].partListUserTypeId ? childDataList[j].partListUserTypeId : 0,
						roPartSplitUserId: childDataList[j].partListUserId ? this.getIdByObject(childDataList[j].partListUserId) : 0,						
						roPartSplitSiteId: childDataList[j].roPartSplitSiteId ? childDataList[j].roPartSplitSiteId : 0, 
						roPartSplitAddressId: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('addressId', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : 0,
						roPartSplitAddress1: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('address1', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						roPartSplitAddress2: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('address2', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						roPartSplitCity: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('city', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						roPartSplitStateOrProvince: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('stateOrProvince', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						roPartSplitPostalCode: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('postalCode', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						roPartSplitCountryId: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('countryId', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : 0,
						roPartSplitCountry: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('country', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : '',
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
							repairOrderPartRecordId: childDataList[j].repairOrderPartRecordId ? childDataList[j].repairOrderPartRecordId : 0
						});					
					}
				}
			} else {
				if (childDataList.length > 0) {
					this.childObjectArray = [];
					for (let j = 0; j < childDataList.length; j++) {					
						this.childObject = {
						repairOrderId: this.roId,
						itemMasterId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,						
						assetId: this.partListData[i].assetId ? this.partListData[i].assetId : 0,
						partNumberId: this.partListData[i].itemMasterId ? this.partListData[i].itemMasterId : 0,
						roPartSplitUserTypeId: childDataList[j].partListUserTypeId ? childDataList[j].partListUserTypeId : 0,
						roPartSplitUserId: childDataList[j].partListUserId ? this.getIdByObject(childDataList[j].partListUserId) : 0,						
						roPartSplitSiteId: childDataList[j].roPartSplitSiteId ? childDataList[j].roPartSplitSiteId : 0, 
						roPartSplitAddressId: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('addressId', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : 0,
						roPartSplitAddress1: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('address1', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						roPartSplitAddress2: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('address2', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						roPartSplitCity: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('city', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						roPartSplitStateOrProvince: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('stateOrProvince', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						roPartSplitPostalCode: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('postalCode', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						roPartSplitCountryId: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('countryId', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : 0,
						roPartSplitCountry: this["splitAddressData" + i + j].length > 0 ? getValueFromArrayOfObjectById('country', 'siteID', childDataList[j].roPartSplitSiteId, this["splitAddressData" + i + j]) : '',
						UOMId: this.partListData[i].UOMId ? this.partListData[i].UOMId : 0,
						quantityOrdered: childDataList[j].quantityOrdered ? parseFloat(childDataList[j].quantityOrdered.toString().replace(/\,/g,'')) : 0,
						needByDate: this.datePipe.transform(childDataList[j].needByDate, "MM/dd/yyyy"),
						managementStructureId: childDataList[j].managementStructureId && childDataList[j].managementStructureId  != null ? childDataList[j].managementStructureId : null, //109
                        isDeleted: true,
                        createdBy: this.userName,
                        updatedBy: this.userName,
						}
						this.childObjectArray.push(this.childObject)
						this.childObjectArrayEdit.push({
							...this.childObject,
							repairOrderPartRecordId: childDataList[j].repairOrderPartRecordId ? childDataList[j].repairOrderPartRecordId : 0
						});					
					}
				}
			}			

			this.parentObject = {
				repairOrderId: this.roId,
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
				quantityOrdered: this.partListData[i].quantityOrdered ? parseFloat(this.partListData[i].quantityOrdered.toString().replace(/\,/g,'')) : 0,
				unitCost: this.partListData[i].unitCost ? parseFloat(this.partListData[i].unitCost.toString().replace(/\,/g,'')) : 0,
				vendorListPrice: this.partListData[i].vendorListPrice ? parseFloat(this.partListData[i].vendorListPrice.toString().replace(/\,/g,'')) : 0,
				discountPerUnit: this.partListData[i].discountPerUnit ? parseFloat(this.partListData[i].discountPerUnit.toString().replace(/\,/g,'')) : 0,
				discountPercent: this.partListData[i].discountPercent ? this.partListData[i].discountPercent : 0,
				discountAmount: this.partListData[i].discountAmount ? parseFloat(this.partListData[i].discountAmount.toString().replace(/\,/g,'')) : 0,
				extendedCost: this.partListData[i].extendedCost ? parseFloat(this.partListData[i].extendedCost.toString().replace(/\,/g,'')) : 0,
				functionalCurrencyId: this.partListData[i].functionalCurrencyId ? this.getCurrencyIdByObject(this.partListData[i].functionalCurrencyId) : null,				
				//functionalCurrency: this.partListData[i].functionalCurrencyId ? this.getlabelFromObj(this.partListData[i].functionalCurrencyId) : null,
				foreignExchangeRate: this.partListData[i].foreignExchangeRate ? this.partListData[i].foreignExchangeRate : 0,
				reportCurrencyId: this.partListData[i].reportCurrencyId ? this.getCurrencyIdByObject(this.partListData[i].reportCurrencyId) : null,				
				//reportCurrency : this.partListData[i].reportCurrencyId ? this.getlabelFromObj(this.partListData[i].reportCurrencyId) : null,				
				workOrderId: this.partListData[i].workOrderId  && this.getValueFromObj(this.partListData[i].workOrderId) != 0 ? this.getValueFromObj(this.partListData[i].workOrderId) : null,
				//WorkOrderNo : this.partListData[i].workOrderId  && this.getValueFromObj(this.partListData[i].workOrderId) != 0 ? this.getlabelFromObj(this.partListData[i].workOrderId) : null,
				subWorkOrderId: this.partListData[i].subWorkOrderId && this.getValueFromObj(this.partListData[i].subWorkOrderId) != 0 ? this.getValueFromObj(this.partListData[i].subWorkOrderId) : null,				
				//subWorkOrderNo : this.partListData[i].subWorkOrderId && this.getValueFromObj(this.partListData[i].subWorkOrderId) != 0 ? this.getlabelFromObj(this.partListData[i].subWorkOrderId) : null,				
				//repairOrderId: this.partListData[i].repairOrderId && this.getValueFromObj(this.partListData[i].repairOrderId) != 0 ? this.getValueFromObj(this.partListData[i].repairOrderId) : null,
				//reapairOrderNo: this.partListData[i].repairOrderId && this.getValueFromObj(this.partListData[i].repairOrderId) != 0 ? this.getlabelFromObj(this.partListData[i].repairOrderId) : null,				
				salesOrderId: this.partListData[i].salesOrderId && this.getValueFromObj(this.partListData[i].salesOrderId) != 0 ? this.getValueFromObj(this.partListData[i].salesOrderId) : null,
				//salesOrderNo: this.partListData[i].salesOrderId && this.getValueFromObj(this.partListData[i].salesOrderId) != 0 ? this.getlabelFromObj(this.partListData[i].salesOrderId) : null,				
				stocklineId: this.partListData[i].stocklineId ? this.getValueByStocklineObj(this.partListData[i].stocklineId) : null,
				//stocklineId: 1,
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
					roPartSplits: this.childObjectArray					
				});				
			} else {
				this.parentObjectArray.push({
					...this.parentObject,
					roPartSplits: this.childObjectArrayEdit,
					repairOrderPartRecordId: this.partListData[i].repairOrderPartRecordId ? this.partListData[i].repairOrderPartRecordId : 0
				})
			}
		}
		
		this.repairOrderService.saveRepairOrderParts(this.parentObjectArray).subscribe(res => {
			if(res) {				
				this.BindAllParts(res);
			}
			this.isSpinnerVisible = false;
			this.enablePartSaveBtn = false;
			this.alertService.showMessage(
				'Success',
				`Saved RO PartsList Successfully`,
				MessageSeverity.success
			);
        }, err => {
			this.isSpinnerVisible = false;			
		});
		this.enableHeaderSaveBtn = false;
	}
	
	
	goToCreatePOList() {
		this.route.navigate(['/vendorsmodule/vendorpages/app-create-ro']);
	}	

	loadcustomerData(strText = '') {
		if(this.arrayCustlist.length == 0) {			
			this.arrayCustlist.push(0); }
		this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name',strText,true,20,this.arrayCustlist.join(),this.currentUserMasterCompanyId).subscribe(response => {
			this.allCustomers = response;
			this.customerNames = response;
			this.splitcustomersList = response;
		},err => {
			this.isSpinnerVisible = false;				
		});
	}
	
	loapartItems(strvalue = '', initialCall = false) {
        this.isSpinnerVisible = true;
        let measurementIds = [];       
        this.commonService.autoCompleteDropdownsItemMasterWithStockLine(strvalue, true, 20, '0')
            .subscribe(res => {
                this.isSpinnerVisible = false;
				this.partCollection = res.map(x => {
					return {
						value: x.value,
						label: x.label
					}
				});
            }, error => {
                this.isSpinnerVisible = false;
            });
    }

	filterpartItems(event) {
		if (event.query !== undefined && event.query !== null) {
			this.loapartItems(event.query); }	
	} 
		
	

	filterAltPartItems(event,partNo,partList) {
		const itemMasterId = getValueFromObjectByKey('value', partNo)		
		this.itemser.getItemMasterAltEquiMappingParts(itemMasterId).subscribe(res => {
				this.altPartNumList = res;			
				this.altPartCollection = this.altPartNumList.map(x => {
					return {value: x.altEquiPartNumberId, label: x.altEquiPartNumber }});
				partList.altPartCollection = this.altPartCollection;				
				if (event.query !== undefined && event.query !== null) {
					const partNumberFilter = [...this.altPartCollection.filter(x => {
						return x.label.toLowerCase().includes(event.query.toLowerCase())
					})]
					partList.altPartCollection = partNumberFilter;
				}				
			});
	}

	filterNames(event) {		
		if (event.query !== undefined && event.query !== null) {
			this.loadcustomerData(event.query); }
	}

	getAddressDetails(variable, pindex, cindex) {
		return this[variable + pindex + cindex]
	}

	filterCustomersSplit(event): void {		
				if (event.query !== undefined && event.query !== null) {
					this.loadcustomerData(event.query); }		
	}

	filterSplitVendorNames(event) {		
		if (event.query !== undefined && event.query !== null) {	
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
	

		if(childata.repairOrderPartRecordId !== undefined && childata.repairOrderPartRecordId !== null) {
			this.partListData[mainindex].childList = this.partListData[mainindex].childList.map(x => {
				if (x.repairOrderPartRecordId == childata.repairOrderPartRecordId) {
					var remQty = this.partListData[mainindex].remQty ? parseInt(this.partListData[mainindex].remQty.toString().replace(/\,/g,'')) : 0;
					var childQty = x.quantityOrdered ? parseInt(x.quantityOrdered.toString().replace(/\,/g,'')) : 0;						
					this.partListData[mainindex].remQty = remQty + childQty;
					return{...x, isDeleted : true}		

				} else {
					return x;
				}
			});
		} else{
			this.partListData[mainindex].childList.splice(index, 1);
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
	
	getFXRate(partList, onChange?) {
		if ((partList.reportCurrencyId != null || partList.reportCurrencyId != undefined) && (partList.functionalCurrencyId != null || partList.functionalCurrencyId != undefined)) {
			const funcCurrency = editValueAssignByCondition('value', partList.functionalCurrencyId);
			const reportCurrency = editValueAssignByCondition('value', partList.reportCurrencyId);
			if (funcCurrency == reportCurrency) {
				partList.foreignExchangeRate = '1.00000';
				if(onChange == 'onChange') {
					this.alertService.showMessage(
					'Error',
					`FXRate can't be greater than 1, if Func CUR and Report CUR are same`,
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
		if (this.arrayConditionlist.length == 0) {
            this.arrayConditionlist.push(0); }
            this.commonService.autoSuggestionSmartDropDownList('Condition','ConditionId','Description','',true, 0,this.arrayConditionlist.join(),this.currentUserMasterCompanyId).subscribe(res => {
				this.allconditioninfo = res;
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
            },
            err => {
                this.isSpinnerVisible = false;	}); 
	}

	loadROApproverStatus() {
		this.commonService.smartDropDownList('ApprovalStatus', 'ApprovalStatusId', 'Name').subscribe(response => {
			 this.roApproverStatusList = response;			
			 this.roApproverStatusList = this.roApproverStatusList.sort((a,b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
		},err => {
			this.isSpinnerVisible = false;				
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
			this.enablePartSaveBtn = true;
			//partList.childList = [];
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
						discountPercent: 0,
						itemMasterId:x.itemMasterId 
					}
					this.getManagementStructureForParentEdit(newObject);
					this.getPNDetailsById(newObject);
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
		//if (this.vendorService.isEditMode == false) {
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
			
		//}
		//this.getRemainingAllQty();
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
		var childQty = 0;
			if (partList.childList != null && partList.childList.length > 0) {
				for (let j = 0; j < partList.childList.length; j++) {
					if(!partList.childList[j].isDeleted){
						childQty +=  partList.childList[j].quantityOrdered ? parseInt(partList.childList[j].quantityOrdered.toString().replace(/\,/g,'')) : 0;	
					}				
				}
				var quantityOrdered =  partList.quantityOrdered ? parseInt(partList.quantityOrdered.toString().replace(/\,/g,'')) : 0;					
				partList.remQty = quantityOrdered - childQty;
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
		if (this.arrayCurrencylist.length == 0) {
            this.arrayCurrencylist.push(0); }
            this.commonService.autoSuggestionSmartDropDownList('Currency','CurrencyId','Code','',true, 0,this.arrayCurrencylist.join(),this.currentUserMasterCompanyId).subscribe(res => {
				this.allCurrencyData = res;        
            },
            err => {
                this.isSpinnerVisible = false;	});      
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
		this.loadvendorDataById(value.vendorId);
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
			if (event.query !== undefined && event.query !== null) {			 
			this.loadWorkOrderList(event.query);
		}
	}

	filtersubWorkOrderList(event,workOrderId,partList,index) {
		if (event.query !== undefined && event.query !== null) {
			this.loadSubWorkOrderList(event.query, workOrderId,partList,index);
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
				{percentId: 0, percentValue: '-- Select --'}
			];
			this.allPercentData = [...this.allPercentData, ...data];
		},err => {
			this.isSpinnerVisible = false;				
		});
	}	
	
	loadVendorList(filterVal = '') {
        if (this.arrayVendlsit.length == 0) {
            this.arrayVendlsit.push(0); }
		this.vendorService.getVendorNameCodeListwithFilter(filterVal,20,this.arrayVendlsit.join(),this.currentUserMasterCompanyId).subscribe(res => {
			this.allActions = res;
			this.vendorNames = res;
			this.vendorCodes = res;
			this.splitVendorNames = res; 
		},err => {
			this.isSpinnerVisible = false;					
		});
	}

	filterVendorCodes(event) {		
		if (event.query !== undefined && event.query !== null) {
			this.loadVendorList(event.query); }
	}

	filterRequisitioner(event) {	 	
		 if (event.query !== undefined && event.query !== null) {
		 this.employeedata(event.query,this.headerInfo.managementStructureId);
		 }
	 }

	 filterVendorNames(event) {		
		if (event.query !== undefined && event.query !== null) {
		this.loadVendorList(event.query); }
	}	

    onDelPNRow(partList, index) {
        this.enablePartSave();		
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
			this.sourcePoApproval.shipToMemo = this.tempMemo;
		}
		if (this.addressMemoLabel == 'Edit Bill') {
			this.sourcePoApproval.billToMemo = this.tempMemo;
		}
		this.enableAddSaveBtn = true;		
	}

	onAddMemo() {
		this.headerMemo = this.headerInfo.roMemo;
	}
	onSaveMemo() {
		this.headerInfo.roMemo = this.headerMemo;
		this.enableHeaderSaveBtn = true;
	}
	onAddContactMemo() {
		this.contactMemo = this.vendorContactInfo.notes;
	}
	onSaveContactMemo() {
		this.vendorContactInfo.notes = this.contactMemo;
		// this.enableHeaderSaveBtn = true;
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
	

	splitAddChange(){
		this.splitAddbutton = true;	}

	resetAddressForm() {
		this.addNewAddress = new CustomerShippingModel();
		this.isEditModeSplitAddress = false;
		this.isEditModeSplitPoOnly = false;		
	}
	
	onEditShipVia(data) {	
		this.tempshipVia = getObjectById('shipViaId', data.shipViaId, this.shipViaList);
		this.addShipViaFormForShipping = { ...this.tempshipVia, shipVia: this.tempshipVia.name };	
		this.isEditModeShipVia = true;		
	}

	
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
			this.commonService.getaddressdetailsOnlyUserbyuser(this.splitmoduleId, this.splituserId, 'Ship',this.roId).subscribe(
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
			this.tempSplitAddress = getObjectById('siteID', splitPart.roPartSplitSiteId, this["splitAddressData" + pindex + cindex]);
			this.editSiteName = this.tempSplitAddress.siteName;
			if(this.tempSplitAddress.isPoOnly) 
				this.isEditModeSplitPoOnly = true;
			else
				this.isEditModeSplitAddress = true;	
			
				this.addNewAddress = { ...this.tempSplitAddress,
					countryId: getObjectByValue('value', this.tempSplitAddress.countryId, this.allCountriesList)
				}
				this.commonService.getaddressdetailsOnlyUserbyuser(this.splitmoduleId, this.splituserId, 'Ship',this.roId).subscribe(
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
				});
			 }
	}

	saveShippingAddressToRO() {
		const data = {
			...this.addNewAddress,
			createdBy: this.userName,
			updatedBy: this.userName,
			masterCompanyId: this.currentUserMasterCompanyId,
			isActive: true,
		}		
		const addressData = { ...data,
			                      repairOrderId : this.id,
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
				});
			 }
	}


	onChangeParentQtyOrdered(event, partList) {	
		this.parentQty = event.target.value;
		if(partList.minimumOrderQuantity > 0
			&& this.parentQty > 0
			&& this.parentQty < partList.minimumOrderQuantity
			) {
			partList.quantityOrdered = partList.minimumOrderQuantity;
			var childQty = 0;
			if (partList.childList != null && partList.childList.length > 0) {
				for (let j = 0; j < partList.childList.length; j++) {
					if(!partList.childList[j].isDeleted){
						childQty +=  partList.childList[j].quantityOrdered ? parseInt(partList.childList[j].quantityOrdered.toString().replace(/\,/g,'')) : 0;	
					}				
				}
				var quantityOrdered =  partList.quantityOrdered ? parseInt(partList.quantityOrdered.toString().replace(/\,/g,'')) : 0;					
				partList.remQty = quantityOrdered - childQty;
			}
			
			this.alertService.showMessage(
				'Error',				
				'Minimum Order Qty : '+ partList.minimumOrderQuantity +'<br /> Order quantity can not be less then Minimum order quantity.',
				MessageSeverity.error
			);
		return;
	    }
		
		if (partList.childList.length > 0) {
			this.onChangeChildQtyOrdered(partList);
		}
		
	}

	getRemainingAllQty() {
		var childQty = 0;
		if(this.partList && this.partList.length > 0) {
			for (let i = 0; i < this.partList[i].length; i++) {
				childQty = 0;
				if (this.partList[i].childList != null && this.partList[i].childList.length > 0) {
					for (let j = 0; j < this.partList[i].childList.length; j++) {
						childQty +=  this.partList[i].childList[j].quantityOrdered ?  parseInt(this.partList[i].childList[j].quantityOrdered.toString().replace(/\,/g,'')) : 0;					
					}
				}
				var quantityOrdered =  this.partList[i].quantityOrdered ? parseInt(this.partList[i].quantityOrdered.toString().replace(/\,/g,'')) : 0;					
				this.partList[i].remQty = quantityOrdered -  childQty;
			}
		}		
	}

	onChangeChildQtyOrdered(partList, partChildList?) {
		this.childOrderQtyArray = [];
		this.childOrderQtyTotal = null;
        this.parentQty = partList.quantityOrdered ? parseFloat(partList.quantityOrdered.toString().replace(/\,/g,'')) : 0;
		for (let i = 0; i < partList.childList.length; i++) {
			if (partList.childList[i].quantityOrdered === null || partList.childList[i].quantityOrdered === undefined || partList.childList[i].isDeleted ) {
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
		var childQty = 0;
			if (partList.childList != null && partList.childList.length > 0) {
				for (let j = 0; j < partList.childList.length; j++) {
					if(!partList.childList[j].isDeleted){
						childQty +=  partList.childList[j].quantityOrdered ? parseInt(partList.childList[j].quantityOrdered.toString().replace(/\,/g,'')) : 0;		
					}			
				}
				var quantityOrdered =  partList.quantityOrdered ? parseInt(partList.quantityOrdered.toString().replace(/\,/g,'')) : 0;					
				partList.remQty = quantityOrdered - childQty;
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
						  isDefaultContact: this.vendorContactInfo.isDefaultContact ? this.vendorContactInfo.isDefaultContact : false,
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
			});			
		},err => {
			this.isSpinnerVisible = false;					
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
		});
	}

	onSelectStatus() {
		if(this.headerInfo.statusId == this.roFulfillingstatusID) {	
			this.disableAddPart = true;
			this.enableHeaderSaveBtn = true;
		} else {
			this.disableAddPart = false;			
			this.enableHeaderSaveBtn = false;			
		}
		if(this.headerInfo.statusId == this.roOpenstatusID)
			{
				this.disableHeaderInfo = false;
				
			}
			else 
			{
				this.disableHeaderInfo = true;
						
			}
	}

	enableHeaderSave() {
		if(this.createROForm.valid) {
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
				if(this.approvalProcessList[j].parentId == approver.repairOrderPartId 
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
				if(this.approvalProcessList[j].parentId == approver.repairOrderPartId 
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
				if(this.approvalProcessList[j].parentId == approver.repairOrderPartId ) {
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
				rejectedBy: x.actionId == this.SubmitInternalApprovalID ? parseInt(this.employeeId.toString()) : null,
                createdBy: this.userName,
                updatedBy: this.userName
			}
		});
		var selectedcnt = 0;
		var waitingforcnt = 0;
		
		this.approvalProcessList.map(x => {
			if(x.isSelected) {
				data.push(x);
				selectedcnt++;				
			}
			
		});

		data.forEach(x=> {
			if (x.statusId == 4) {
				waitingforcnt++;
			}
		});		

		if (selectedcnt == waitingforcnt) {
			this.alertService.showMessage(
				'Error', 
				'Select atleast one part other than Waiting for Approval status',
				MessageSeverity.error
			);
			this.isSpinnerVisible = false;
			return;
		}
		
        this.repairOrderService.saveRepairOrderApproval(data).subscribe(res => {
			if(res) {
						this.getApprovalProcessListById(this.roId);
						this.headerInfo.statusId = res.response;
						//this.getVendorPOHeaderById(this.roId);
						this.enableHeaderSaveBtn = false;
						if(this.headerInfo.statusId == this.roFulfillingstatusID) {
							this.disableAddPart = true;	
						} else {
							this.disableAddPart = false;
						}
						this.isSpinnerVisible = false;
						this.alertService.showMessage(
							'Success',
							`Saved Approver Process Successfully`,
							MessageSeverity.success
						);			
			 }
			}, err => {
			this.isSpinnerVisible = false;
			
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
	
	suborderlist: any = [];

	GetSubWolist(workOrderId,partList,index) {
		this.allsubWorkOrderDetails = [];
		this.commonService.GetSubWolist(workOrderId).subscribe(res => {			
			const data = res.map(x => {
				return {
					value: x.subWorkOrderId,
					label: x.subWorkOrderNo
				}
			});
			//this.suborderlist = data;
			this.allsubWorkOrderInfo = [...this.allsubWorkOrderInfo, ...data];
			this.allsubWorkOrderDetails = [...this.allsubWorkOrderInfo, ...data]
			partList.subWorkOrderlist = [...this.allsubWorkOrderInfo, ...data];	
		}, err => {
			this.isSpinnerVisible = false;			
		})
	}	

	partNumber : any
	getPartnumber(id){		
		this.partNumber = this.partCollection.find((x: any) => x.value == id);
		this.partNumber = this.partNumber["label"];	
		return this.partNumber;
	}

	altPartNumber : any
	getAltEquiPartNumer(id){
		this.altPartNumber = this.altPartCollection.find((x: any) => x.altEquiPartNumberId == id.altEquiPartNumberId);		
		this.altPartNumber = this.altPartNumber["altEquiPartNumber"];	
		return this.altPartNumber;		
	}

	prioritys : any
	getPriorityName(id){		
		this.prioritys = this.allPriorityInfo.find((x: any) => x.value == id);		
		this.prioritys = this.prioritys["label"];	
		return this.prioritys;
	}

	condition : any
	getCondition(id){
		this.condition = this.allconditioninfo.find((x: any) => x.value == id);		
		this.condition = this.condition["label"];	
		return this.condition;
	}
	
	getlabelFromObj(obj) {
		if (obj.value) {
			return obj.label;
		} else {
			return null;
		}
	}

	getValueByStocklineObj(obj) {
		if (obj.stockLineId) {
			return obj.stockLineId;
		} else {
			return 0;
		}
	}

	getStockLineDetails(partList) {
		if(partList.stocklineId) {
			this.isSpinnerVisible = true;
			this.stocklineService.getStockLineDetailsByStockLineId(partList.stocklineId.stockLineId).subscribe(res => {
				partList.controlId = res.controlId;
				partList.purchaseOrderNum = res.purchaseOrderNo;
				partList.controlNumber = res.controlNumber;
				//partList.workOrderId = res.WorkOrderId;
				this.isSpinnerVisible = false;
			},err => {this.isSpinnerVisible = false;});
		}
	}

	filterStocklineNum(event, partList) {
		partList.allStocklineDetails = partList.allStocklineDetails;
		if (event.query !== undefined && event.query !== null) {
			const stockline = [...partList.allStocklineDetails.filter(x => {
				return x.stockLineNumber.toLowerCase().includes(event.query.toLowerCase())
			})]
			partList.allStocklineDetails = stockline;
		}
	}
	
	getStockLineByItemMasterId(partList) {
		this.isSpinnerVisible = true;		
		partList.stocklineId = null;
		partList.controlId = '';
		partList.purchaseOrderNum = '';
		partList.controlNumber = '';
		this.workOrderService.getStockLineByItemMasterId(partList.itemMasterId, partList.conditionId,this.authService.currentUser.masterCompanyId).subscribe(res => {
			partList.allStocklineDetails = res;			
			if(partList.allStocklineDetails.length > 0) {
				partList.stocklineId = partList.allStocklineDetails[0];
				this.getStockLineDetails(partList);
			}
			this.isSpinnerVisible = false;
		},err => {	this.isSpinnerVisible = false;});
	}

	addPartNumbers(partNumberId,partName) {
		this.inputValidCheck = false;			
		//if (this.vendorService.isEditMode == false) {
			let newParentObject = new CreatePOPartsList();
			newParentObject = {
				...newParentObject, 
				needByDate: this.headerInfo.needByDate, 
				priorityId: this.headerInfo.priorityId ? editValueAssignByCondition('value', this.headerInfo.priorityId) : null,
				conditionId: this.defaultCondtionId,
				discountPercent: 0,
				partNumberId: {value: partNumberId, label: partName},
				salesOrderId: getObjectById('value', this.salesOrderId == null ? 0 : this.salesOrderId, this.allSalesOrderInfo),
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
			this.getPNDetailsById(newParentObject,null)
			
		//}
		//this.getRemainingAllQty();
	}

	ngOnDestroy() {		
		if (this.isEditMode) {
			localStorage.removeItem("itemMasterId");
			localStorage.removeItem("partNumber");
			localStorage.removeItem("salesOrderId");
		}
	}
	
	
}