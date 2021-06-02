import { Component, OnInit, ViewChild } from '@angular/core';
import { ConditionService } from '../../../services/condition.service';
import { Condition } from '../../../models/condition.model';
import { fadeInOut } from '../../../services/animations';
import { IntegrationService } from '../../../services/integration-service';
import { StocklineService } from '../../../services/stockline.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SiteService } from '../../../services/site.service';
import { Site } from '../../../models/site.model';
import { BinService } from '../../../services/bin.service';
import { VendorService } from '../../../services/vendor.service';
import { ItemMasterService } from '../../../services/itemMaster.service';
import { ManufacturerService } from '../../../services/manufacturer.service';
import { CommonService } from '../../../services/common.service';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { GlAccountService } from '../../../services/glAccount/glAccount.service';
import { getValueFromArrayOfObjectById, getValueFromObjectByKey, editValueAssignByCondition, getObjectById, getObjectByValue, formatNumberAsGlobalSettingsModule } from '../../../generic/autocomplete';
import { DatePipe } from '@angular/common';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
declare var $: any;
import * as moment from 'moment';
import { ConfigurationService } from '../../../services/configuration.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { masterCompanyId } from '../../../common-masterData/mastercompany-details';
import { timePattern } from '../../../validations/validation-pattern';


@Component({
	selector: 'app-stock-line-setup',
	templateUrl: './stock-line-setup.component.html',
	styleUrls: ['./stock-line-setup.component.scss'],
	animations: [fadeInOut],
	providers: [DatePipe]
})
/** stock-line-setup component*/
export class StockLineSetupComponent implements OnInit {
	uploadDocs: Subject<boolean> = new Subject();
	isEditMode: boolean = false;
	businessUnitList: any;
	disableSaveMemo: boolean = true;
	divisionList: any;
	timePattern = timePattern();
	stockLineForm: any = {};
	saveStockLineForm: any = {};
	tempOEMpartNumberId: number = null;
	allCustomersList: any = [];
	allVendorsList: any = [];
	allCompanyList: any = [];
	allPartnumbersList: any = [];
	allEmployeeList: any = [];
	alltagEmployeeList: any = [];
	partNumbersCollection: any = [];
	oempnList: any[];
	RevicepnList: any[];
	allConditionInfo: Condition[] = [];
	minDateValue: Date = new Date();
	currentDate: Date = new Date();
	itemMasterId:number=0;
	private onDestroy$: Subject<void> = new Subject<void>();
	managementStructure = {
		companyId: 0,
		buId: 0,
		divisionId: 0,
		departmentId: 0,
	}
	allWareHouses: any;
	allLocations: any;
	allShelfs: any;
	allBins: any;
	allSites: Site[];
	allPurchaseUnitOfMeasureinfo: any[] = [];
	customerNames: any[];
	vendorNames: any[];
	companyNames: any[];
	certifyByNames: any[];
	TagByNames: any[];
	allManufacturerInfo: any = [];
	allTagTypes: any = [];
	allPolistInfo: any = [];
	polistInfo: any = [];
	receicerlistInfo: any = [];
	allRolistInfo: any = [];
	rolistInfo: any = []
	textAreaInfo: string;
	textAreaLabel: string;
	integrationInfoList: any = [];
	sourceTimeLife: any = {};
	hideSerialNumber: boolean = true;
	disableMagmtStruct: boolean = true;
	disableCondition: boolean = true;
	disableManufacturer: boolean = true;
	disableSiteName: boolean = true;
	disableCustomer: boolean = true;
	stockLineId: number;
	timeLifeCyclesId: number;
	allNHAInfo: any = [];
	allTLAInfo: any = [];
	assetAcquisitionTypeList: any = [];
	allWorkOrderInfo: any = [];
	allWorkOrderDetails: any = [];
	allPODetails: any = [];
	allRODetails: any = [];
	disableQtyOnHand: boolean = false;
	defaultDate: Date = new Date('Fri Sep 1 2009 00:00:00');
	moduleListDropdown: any = [];
	isSpinnerVisible: boolean = true;
	documentInformation = {
		docName: '',
		docMemo: '',
		docDescription: '',
		attachmentDetailId: 0
	}
	@ViewChild('fileUploadInput', { static: false }) fileUploadInput: any;
	disableFileAttachmentSubmit: boolean = true;
	selectedFileAttachment: any = [];
	sourceViewforDocument: any = [];
	formData = new FormData();
	sourceViewforDocumentList: any = [];
	sourceViewforDocumentAudit: any = [];
	pageSize: number = 5;
	index: number;
	isEditButton: boolean = false;
	deletedDocumentList: any[] = [];
	isShowDeletedList: boolean = false;
	
	isDocumentsToShow: boolean = false;
	attachDocumentsColumns = [
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
	selectedColumnsCertified = this.attachDocumentsColumns;
	allDocumentListOriginal: any = [];
	selectedRowForDelete: any;
	rowIndex: number;
	modal: NgbModalRef;
	userTypes: any = [];
	companyModuleId: number;
	vendorModuleId: number;
	customerModuleId: number;
	otherModuleId: number;
	disableVendor: boolean = false;
	disableSaveForEdit: boolean = true;
	disableSaveForEditDocument: boolean = true;
	arrayCustlist: any[] = [];
	arrayVendorlist: any[] = [];
	arrayCompanylist: any[] = [];
	arrayItemMasterlist: any[] = [];
	arrayReviceItemMasterlist: any[] = [];
	arrayWOlist: any[] = [];
	arrayPOlist: any[] = [];
	arrayROlist: any[] = [];
	arrayEmployeelist: any[] = [];
	arrayTagEmployeelist: any[] = [];
	arrayModulelist: any[] = [];
	arrayConditionlist: any[] = [];
	headerInfo: any = {};
	maincompanylist: any[] = [];
	bulist: any[] = [];
	departmentList: any[] = [];
	divisionlist: any[] = [];
	managementValidCheck: boolean;
	selectedPartNumber: any;
	receiverNumber: any;
	moduleName:any='StockLine';
	constructor(private alertService: AlertService, private stocklineser: StocklineService, private commonService: CommonService, private conditionService: ConditionService, private binService: BinService, private siteService: SiteService, private vendorService: VendorService, private manufacturerService: ManufacturerService, private integrationService: IntegrationService, private itemMasterService: ItemMasterService, private glAccountService: GlAccountService, private router: Router, private _actRoute: ActivatedRoute, private datePipe: DatePipe, private authService: AuthService, private configurations: ConfigurationService, private modalService: NgbModal) {
		this.stockLineForm.siteId = 0;
		this.stockLineForm.acquistionTypeId = 0;
		this.stockLineForm.nhaItemMasterId = 0;
		this.stockLineForm.tlaItemMasterId = 0;
		this.stockLineForm.warehouseId = 0;
		this.stockLineForm.locationId = 0;
		this.stockLineForm.shelfId = 0;
		this.stockLineForm.binId = 0;
		this.stockLineForm.obtainFromType = 0;
		this.stockLineForm.ownerType = 0;
		this.stockLineForm.traceableToType = 0;
		this.stockLineForm.manufacturerId = 0;
		this.stockLineForm.purchaseOrderId = 0;
		this.stockLineForm.repairOrderId = 0;
		this.stockLineForm.conditionId = 0;
		this.stockLineForm.nha = 0;
		this.stockLineForm.tla = 0;
		this.stockLineForm.quantityOnHand = null;
		this.stockLineForm.oem = 'true';
		this.stockLineForm.isCustomerStock = false;
		this.stockLineForm.isCustomerstockType = false;
		this.stockLineForm.unitCost='0.00';
		
		this.stockLineForm.customerId = 0;
		this.stockLineForm.tagType = [];
		this.stockLineForm.stockLineNumber = 'Creating';
		this.stockLineForm.controlNumber = 'Creating';
		this.stockLineForm.idNumber = 'Creating';
		this.stockLineForm.entryDate = new Date();

		this.stockLineForm.purchaseOrderUnitCost = '0.00';
		this.stockLineForm.repairOrderUnitCost = '0.00';
		this.stockLineForm.unitSalesPrice = '0.00';
		this.stockLineForm.coreUnitCost = '0.00';
		this.stockLineForm.lotCost = '0.00';
	}

	ngOnInit() {
		this.stocklineser.currentUrl = '/stocklinemodule/stocklinepages/app-stock-line-setup';
		this.stocklineser.bredcrumbObj.next(this.stocklineser.currentUrl);

		// this.getLegalEntity();
		this.loadConditionData();
		this.loadSiteData();
		this.Purchaseunitofmeasure();
		this.loadTagTypes();
		this.loadModuleTypes();
		this.loadModulesNamesForObtainOwnerTraceable();
		this.loadAssetAcquisitionTypeList();
	

		this.stockLineId = this._actRoute.snapshot.params['id'];
		if (this.stockLineId) {
			this.isEditMode = true;
			this.getStockLineDetailsById(this.stockLineId);
		} else {
			this.getManagementStructureDetails(this.currentUserManagementStructureId, this.employeeId);
			this.loadCustomerData();
			this.loadVendorData();
			this.loadCompanyData();
			this.loadPartNumData();
			this.loadRevicePnPartNumData('',0);
			this.loadEmployeeData();
			this.loadWorkOrderList();
			this.loadTagByEmployeeData('',0)
		}
	}

	loadData(event) {
		this.pageSize = event.rows;
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

	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}

	get employeeId() {
		return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
	}

	restoreRecord(rowData) {
		this.commonService.restoreDocumentByAttachmentId(rowData.attachmentDetailId, this.authService.currentUser.userName)
			.subscribe(
				res => {
					this.toGetDocumentsListNew(this.stockLineId);
					this.getDeletedList(this.stockLineId);
				}
			)
	}

	deleteFormList(rowData) {
		let newList = []
		for (let ind = 0; ind < this.deletedDocumentList.length; ind++) {
			if (this.deletedDocumentList[ind].attachmentId != rowData.attachmentId) {
				newList.push(this.deletedDocumentList[ind]);
			}
		}
		this.deletedDocumentList = newList;
	}

	loadCustomerData(strText = '') {
		if (this.arrayCustlist.length == 0) {
			this.arrayCustlist.push(0);
		}
		this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', strText, true, 20, this.arrayCustlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
			this.allCustomersList = response;
			this.customerNames = this.allCustomersList;
		}, error => this.saveFailedHelper(error));
	}

	loadVendorData(strText = '') {
		if (this.arrayVendorlist.length == 0) {
			this.arrayVendorlist.push(0);
		}
		this.commonService.autoSuggestionSmartDropDownList('Vendor', 'VendorId', 'VendorName', strText, true, 20, this.arrayVendorlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
			this.allVendorsList = response;
			this.vendorNames = this.allVendorsList;
		}, error => this.saveFailedHelper(error));
	}

	loadCompanyData(strText = '') {
		if (this.arrayCompanylist.length == 0) {
			this.arrayCompanylist.push(0);
		}
		this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name', strText, true, 20, this.arrayCompanylist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
			this.allCompanyList = response;
			this.companyNames = this.allCompanyList;
		}, error => this.saveFailedHelper(error));
	}

	loadPartNumData(strText = '') {
		if (this.arrayItemMasterlist.length == 0) {
			this.arrayItemMasterlist.push(0);
		}
		this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'partnumber', strText, true, 20, this.arrayItemMasterlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
			this.allPartnumbersList = response.map(x => {
				return {
					partnumber: x.label, itemMasterId: x.value
				}
			})
			this.partNumbersCollection = this.allPartnumbersList;
		}, error => this.saveFailedHelper(error));
	}
	loadRevicePnPartNumData(strText = '',revicedPNId) {
		if (this.arrayReviceItemMasterlist.length == 0) {
			this.arrayReviceItemMasterlist.push(0);
		}
		if (revicedPNId > 0) 
		{
			this.arrayReviceItemMasterlist.push(revicedPNId);
		}
		if (this.arrayReviceItemMasterlist.length == 0) {
			this.arrayReviceItemMasterlist.push(0);
		}
		this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'partnumber', strText, true, 20, this.arrayReviceItemMasterlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
			this.allPartnumbersList = response.map(x => {
				return {
					partnumber: x.label, itemMasterId: x.value
				}
			})

			this.RevicepnList = this.allPartnumbersList;
			if(revicedPNId >0)
			{
				this.stockLineForm.revicedPNId = getObjectById('itemMasterId', revicedPNId, this.RevicepnList);
			}

		}, error => this.saveFailedHelper(error));
	}

	loadOemPnPartNumData(strText = '') {
		if (this.arrayItemMasterlist.length == 0) {
			this.arrayItemMasterlist.push(0);
		}
		this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'partnumber', strText, true, 20, this.arrayItemMasterlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
			this.allPartnumbersList = response.map(x => {
				return {
					partnumber: x.label, itemMasterId: x.value
				}
			})

			const revisedPartId = this.stockLineForm.revisedPartId ? editValueAssignByCondition('itemMasterId', this.stockLineForm.revisedPartId) : 0;
			this.oempnList = [];

			const oemList = [...this.allPartnumbersList.filter(x => {
				return x.partnumber.toLowerCase().includes(strText.toLowerCase())
			})]

			for (let i = 0; i < oemList.length; i++) {
				if (oemList[i].partnumber != this.selectedPartNumber && oemList[i].itemMasterId != revisedPartId) {
					this.oempnList.push(oemList[i]);
				}
			};

		}, error => this.saveFailedHelper(error));
	}

	
    getStockStatus(value) {
        if (value == 1) {
            this.stockLineForm.isCustomerstockType = true;
        } else {
            this.stockLineForm.isCustomerstockType = false;
        }
    }

	private loadConditionData() {
		if (this.arrayConditionlist.length == 0) {
			this.arrayConditionlist.push(0);
		}
		this.commonService.autoSuggestionSmartDropDownList('Condition', 'ConditionId', 'Description', '', true, 20, this.arrayConditionlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
			this.allConditionInfo = response;
		}, error => this.saveFailedHelper(error));
	}

	private loadSiteData() {
		this.commonService.smartDropDownList('Site', 'SiteId', 'Name','','', 0,this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
			this.allSites = res;
		})
	}

	private Purchaseunitofmeasure() {
		this.commonService.smartDropDownList('UnitOfMeasure', 'unitOfMeasureId', 'shortname','','', 0,this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
			this.allPurchaseUnitOfMeasureinfo = res;
		})
	}

	loadManufacturerData() { 
		this.commonService.smartDropDownList('Manufacturer', 'ManufacturerId', 'Name','','', 0,this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
			this.allManufacturerInfo = res;
		})
	}

	loadAssetAcquisitionTypeList() {
		this.commonService.smartDropDownList('AssetAcquisitionType', 'AssetAcquisitionTypeId', 'Name','','', 0,this.authService.currentUser.masterCompanyId ).subscribe(response => {
			this.assetAcquisitionTypeList = response;
		});
	}

	loadEmployeeData(strText = '') {
		if (this.arrayEmployeelist.length == 0) {
			this.arrayEmployeelist.push(0);
		}
		this.commonService.autoCompleteDropdownsCertifyEmployeeByMS(strText, true, 20, this.arrayEmployeelist.join(), this.currentUserManagementStructureId)
			.subscribe(response => {
				this.allEmployeeList = response;
				this.certifyByNames = this.allEmployeeList;
			}, error => this.saveFailedHelper(error));
	}
	loadTagByEmployeeData(strText = '',taggedBy) {
		if(taggedBy >0)
		{
			this.arrayTagEmployeelist.push(taggedBy);
		}
		if (this.arrayTagEmployeelist.length == 0) {
			this.arrayTagEmployeelist.push(0);
		}

	
		this.commonService.autoCompleteDropdownsEmployeeByMS(strText, true, 20, this.arrayTagEmployeelist.join(), this.currentUserManagementStructureId)
			.subscribe(response => {
				this.alltagEmployeeList = response;
				this.TagByNames = this.alltagEmployeeList;
				if(taggedBy >0)
				{
					this.stockLineForm.taggedBy = getObjectById('value', taggedBy, this.alltagEmployeeList);
				}
				
			}, error => this.saveFailedHelper(error));
	}

	loadWorkOrderList(strText = '') {
		if (this.arrayWOlist.length == 0) {
			this.arrayWOlist.push(0);
		}
		this.commonService.autoCompleteDropdownsWorkorderList(strText, 20, this.arrayWOlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
			this.allWorkOrderDetails = [
				{ value: 0, label: 'Select' }
			];
			this.allWorkOrderInfo = [...this.allWorkOrderInfo, ...response];
			this.allWorkOrderDetails = [...this.allWorkOrderDetails, ...response];
		  })
	}

	private loadModuleTypes() {
		if (this.arrayModulelist.length == 0) {
			this.arrayModulelist.push(0);
		}
		this.commonService.autoSuggestionSmartDropDownList('Module', 'ModuleId', 'ModuleName', '', true, 200, this.arrayModulelist.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
			this.userTypes = res;
			this.userTypes.map(x => {
				if (x.label.toUpperCase() == 'COMPANY') {
					this.companyModuleId = x.value;
				}
				else if (x.label.toUpperCase() == 'VENDOR') {
					this.vendorModuleId = x.value;
				}
				else if (x.label.toUpperCase() == 'CUSTOMER') {
					this.customerModuleId = x.value;
				}
				else if (x.label.toUpperCase() == 'OTHERS') {
					this.otherModuleId = x.value;
				}
			});
		})
	}

	private loadTagTypes() {
		this.commonService.smartDropDownList('TagType', 'TagTypeId', 'Name','','', 0,this.authService.currentUser.masterCompanyId).subscribe(res => {
			this.allTagTypes = res;
		})
	}

	loadModulesNamesForObtainOwnerTraceable() {
		this.commonService.getModuleListForObtainOwnerTraceable(this.authService.currentUser.masterCompanyId).subscribe(res => {
			this.moduleListDropdown = res;
		})
	}
	loadPODataList(strText = '') {
		if (this.arrayPOlist.length == 0) {
			this.arrayPOlist.push(0);
		}
		this.commonService.AutoCompleteDropdownsPOByItemMaster(strText,this.itemMasterId, 20, this.arrayPOlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
			this.allPODetails = [
				{ value: 0, label: 'Select' }
			];
			this.allPolistInfo = [...this.allPolistInfo, ...response];
			this.allPODetails = [...this.allPODetails, ...response];
		  })
	}

	loadRODataList(strText = '') {
		if (this.arrayROlist.length == 0) {
			this.arrayROlist.push(0);
		}
		this.commonService.AutoCompleteDropdownsROByItemMaster(strText,this.itemMasterId, 20, this.arrayPOlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
			this.allPODetails = [
				{ value: 0, label: 'Select' }
			];
			this.allRolistInfo = [...this.allRolistInfo, ...response];
			this.allRODetails = [...this.allRODetails, ...response];
		  })
	}

	getPOSelecionOnEdit(strText = '',purchaseOrderId) {


		if (purchaseOrderId > 0) 
		{
			this.arrayPOlist.push(purchaseOrderId);
		}

		if (this.arrayPOlist.length == 0) {
			this.arrayPOlist.push(0);
		}
			
			this.commonService.AutoCompleteDropdownsPOByItemMaster(strText,this.itemMasterId, 20, this.arrayPOlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
				this.allPODetails = [
					{ value: 0, label: 'Select' }
				];
				this.allPolistInfo = [...this.allPolistInfo, ...response];
				this.allPODetails = [...this.allPODetails, ...response];

				this.stockLineForm.purchaseOrderId = getObjectById('value', purchaseOrderId == null ? 0 : purchaseOrderId, this.allPolistInfo);
			  })
	
	}

	getROSelecionOnEdit(strText = '',repairOrderId) {


		if (repairOrderId > 0) 
		{
			this.arrayROlist.push(repairOrderId);
		}
		if (this.arrayROlist.length == 0) {
			this.arrayROlist.push(0);
		}
			this.commonService.AutoCompleteDropdownsROByItemMaster(strText,this.itemMasterId, 20, this.arrayROlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
				this.allRODetails = [
					{ value: 0, label: 'Select' }
				];
				this.allRolistInfo = [...this.allRolistInfo, ...response];
				this.allRODetails = [...this.allRODetails, ...response];
				
				this.stockLineForm.repairOrderId = getObjectById('value', repairOrderId == null ? 0 : repairOrderId, this.allRolistInfo);
			  })
	
	}

	loadPOData(itemMasterId) {
		this.vendorService.getPurchaseOrderByItemId(itemMasterId).subscribe(res => {
			this.allPolistInfo = res[0];
		});
	}

	loadROData(itemMasterId) {
		this.vendorService.getRepairOrderByItemId(itemMasterId).subscribe(res => {
			this.allRolistInfo = res[0];
		});
	}

	loadNHAData(itemMasterId) {
		this.itemMasterService.getItemMasterNhaMappingParts(itemMasterId).subscribe(res => {
			this.allNHAInfo = res;
			if (this.allNHAInfo.length == 1) {
				this.allNHAInfo.map(x => {
					this.stockLineForm.nhaItemMasterId = x.nhaItemMasterId;
				});
			}
		});
	}

	loadTLAData(itemMasterId) {
		this.itemMasterService.getItemMasterTlaMappingParts(itemMasterId).subscribe(res => {
			this.allTLAInfo = res;
			if (this.allTLAInfo.length == 1) {
				this.allTLAInfo.map(x => {
					this.stockLineForm.tlaItemMasterId = x.tlaItemMasterId;
				});
			}
		});
	}

	GetManufacturerByitemMasterId(itemMasterId) 
	{
		this.itemMasterService.GetManufacturerByitemMasterId(itemMasterId).subscribe(res => {
			this.allManufacturerInfo = res;
		});
	}

	getManagementStructureDetails(id, empployid = 0, editMSID = 0) {
		empployid = empployid == 0 ? this.employeeId : empployid;
		editMSID = this.isEditMode ? editMSID = id : 0;
		this.commonService.getManagmentStrctureData(id, empployid, editMSID,this.authService.currentUser.masterCompanyId).subscribe(response => {
			if (response) {
				const result = response;
				if (result[0] && result[0].level == 'Level1') {
					this.maincompanylist = result[0].lstManagmentStrcture;
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

				if (result[1] && result[1].level == 'Level2') {
					this.bulist = result[1].lstManagmentStrcture;
					this.headerInfo.buId = result[1].managementStructureId;
					this.headerInfo.managementStructureId = result[1].managementStructureId;
					this.headerInfo.divisionId = 0;
					this.headerInfo.departmentId = 0;
					this.divisionlist = [];
					this.departmentList = [];
				} else {
					if (result[1] && result[1].level == 'NEXT') {
						this.bulist = result[1].lstManagmentStrcture;
					}
					this.headerInfo.buId = 0;
					this.headerInfo.divisionId = 0;
					this.headerInfo.departmentId = 0;
					this.divisionlist = [];
					this.departmentList = [];
				}

				if (result[2] && result[2].level == 'Level3') {
					this.divisionlist = result[2].lstManagmentStrcture;
					this.headerInfo.divisionId = result[2].managementStructureId;
					this.headerInfo.managementStructureId = result[2].managementStructureId;
					this.headerInfo.departmentId = 0;
					this.departmentList = [];
				} else {
					if (result[2] && result[2].level == 'NEXT') {
						this.divisionlist = result[2].lstManagmentStrcture;
					}
					this.headerInfo.divisionId = 0;
					this.headerInfo.departmentId = 0;
					this.departmentList = [];
				}

				if (result[3] && result[3].level == 'Level4') {
					this.departmentList = result[3].lstManagmentStrcture;;
					this.headerInfo.departmentId = result[3].managementStructureId;
					this.headerInfo.managementStructureId = result[3].managementStructureId;
				} else {
					this.headerInfo.departmentId = 0;
					if (result[3] && result[3].level == 'NEXT') {
						this.departmentList = result[3].lstManagmentStrcture;
					}
				}
				this.onSelectManagementStruc();
				this.isSpinnerVisible = false;
			}
			else {
				this.isSpinnerVisible = false;
			}
		}, err => {
			this.isSpinnerVisible = false;
			const errorLog = err;
			this.errorMessageHandler(errorLog);
		});
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
			this.commonService.getManagementStructurelevelWithEmployee(legalEntityId, this.employeeId).subscribe(res => {
				this.bulist = res;
			});
		}
		else {
			this.headerInfo.managementStructureId = 0;
			this.headerInfo.companyId = 0;
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
			this.commonService.getManagementStructurelevelWithEmployee(buId, this.employeeId).subscribe(res => {
				this.divisionlist = res;
			});
		} else {
			this.headerInfo.managementStructureId = this.headerInfo.companyId;
		}
	}

	getDepartmentlist(divisionId) {
		this.headerInfo.departmentId = 0;
		this.departmentList = [];
		if (divisionId != 0 && divisionId != null && divisionId != undefined) {
			this.headerInfo.divisionId = divisionId;
			this.headerInfo.managementStructureId = divisionId;
			this.commonService.getManagementStructurelevelWithEmployee(divisionId, this.employeeId).subscribe(res => {
				this.departmentList = res;
			});
		}
		else {
			this.headerInfo.managementStructureId = this.headerInfo.buId;
			this.headerInfo.divisionId = 0;
		}
	}

	getDepartmentId(departmentId) {
		if (departmentId != 0 && departmentId != null && departmentId != undefined) {
			this.headerInfo.managementStructureId = departmentId;
			this.headerInfo.departmentId = departmentId;
		}
		else {
			this.headerInfo.managementStructureId = this.headerInfo.divisionId;
			this.headerInfo.departmentId = 0;
		}
	}

	getStockLineDetailsById(stockLineId) {
		this.isDocumentsToShow=true;
		this.stocklineser.getStockLineDetailsById(stockLineId).subscribe(res => {

			this.itemMasterId= res.itemMasterId;
				//this.loadPOData(res.itemMasterId);
				//this.loadROData(res.itemMasterId);
				this.loadNHAData(res.itemMasterId);
				this.loadTLAData(res.itemMasterId);
				this.GetManufacturerByitemMasterId(res.itemMasterId);
			
		
			this.arrayItemMasterlist.push(res.itemMasterId);
			if (res.revisedPartId > 0) {
				this.arrayItemMasterlist.push(res.revisedPartId);
			}
			if (res.isOemPNId > 0) {
				this.arrayItemMasterlist.push(res.isOemPNId);
			}
			this.arrayVendorlist.push(res.vendorId);
			this.arrayModulelist.push(res.obtainFromType);
			this.arrayModulelist.push(res.ownerType);
			this.arrayModulelist.push(res.traceableToType);

			this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'partnumber', '', true, 20, this.arrayItemMasterlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
				this.allPartnumbersList = response.map(x => {
					return {
						partnumber: x.label, itemMasterId: x.value
					}
				})
				this.selectedPartNumber = res.partNumber;
				this.stockLineForm = {
					...res,
					itemMasterId: getObjectById('itemMasterId', res.itemMasterId, this.allPartnumbersList),
					isOemPNId: getObjectById('itemMasterId', res.isOemPNId, this.allPartnumbersList),
					oem: res.oem.toString(),
					certifiedDate: res.certifiedDate ? new Date(res.certifiedDate) : '',
					certifiedDueDate: res.certifiedDueDate ? new Date(res.certifiedDueDate) : '',
					manufacturingDate: res.manufacturingDate ? new Date(res.manufacturingDate) : '',
					orderDate: res.orderDate ? new Date(res.orderDate) : '',
					receivedDate: res.receivedDate ? new Date(res.receivedDate) : '',
					inspectionDate: res.inspectionDate ? new Date(res.inspectionDate) : '',
					entryDate: res.entryDate ? new Date(res.entryDate) : '',
					expirationDate: res.expirationDate ? new Date(res.expirationDate) : '',
					tagDate: res.tagDate ? new Date(res.tagDate) : '',
					shelfLifeExpirationDate: res.shelfLifeExpirationDate ? new Date(res.shelfLifeExpirationDate) : '',
					quantityOnHand: (res.quantityOnHand || res.quantityOnHand == 0) ? formatNumberAsGlobalSettingsModule(res.quantityOnHand, 0) : '0',
					quantityReserved: (res.quantityReserved || res.quantityReserved == 0) ? formatNumberAsGlobalSettingsModule(res.quantityReserved, 0) : '0',
					quantityIssued: (res.quantityIssued || res.quantityIssued == 0) ? formatNumberAsGlobalSettingsModule(res.quantityIssued, 0) : '0',
					quantityAvailable: (res.quantityAvailable || res.quantityAvailable == 0) ? formatNumberAsGlobalSettingsModule(res.quantityAvailable, 0) : '0',
					purchaseOrderUnitCost: res.purchaseOrderUnitCost ? formatNumberAsGlobalSettingsModule(res.purchaseOrderUnitCost, 2) : '0.00',
					repairOrderUnitCost: res.repairOrderUnitCost ? formatNumberAsGlobalSettingsModule(res.repairOrderUnitCost, 2) : '0.00',
					unitSalesPrice: res.unitSalesPrice ? formatNumberAsGlobalSettingsModule(res.unitSalesPrice, 2) : '0.00',	
					unitCost : res.unitCost ? formatNumberAsGlobalSettingsModule(res.unitCost, 2) : '0.00',
					coreUnitCost: res.coreUnitCost ? formatNumberAsGlobalSettingsModule(res.coreUnitCost, 2) : '0.00',
					lotCost: res.lotCost ? formatNumberAsGlobalSettingsModule(res.lotCost, 2) : '0.00',
					purchaseUnitOfMeasureId: this.getInactiveObjectOnEdit('value', res.purchaseUnitOfMeasureId, this.allPurchaseUnitOfMeasureinfo, 'UnitOfMeasure', 'unitOfMeasureId', 'shortname'),
					conditionId: this.getInactiveObjectOnEdit('value', res.conditionId, this.allConditionInfo, 'Condition', 'ConditionId', 'Description'),
					manufacturerId: this.getInactiveObjectOnEdit('value', res.manufacturerId, this.allManufacturerInfo, 'Manufacturer', 'ManufacturerId', 'Name'),
					acquistionTypeId: this.getInactiveObjectOnEdit('value', res.acquistionTypeId, this.assetAcquisitionTypeList, 'AssetAcquisitionType', 'AssetAcquisitionTypeId', 'Name'),
					//purchaseOrderId: this.getInactiveObjectOnEdit('purchaseOrderId', res.purchaseOrderId, this.allPolistInfo, 'PurchaseOrder', 'PurchaseOrderId', 'PurchaseOrderNumber'),
					//repairOrderId: this.getInactiveObjectOnEdit('repairOrderId', res.repairOrderId, this.allRolistInfo, 'RepairOrder', 'RepairOrderId', 'RepairOrderNumber'),
					nhaItemMasterId: this.getInactiveObjectNHATLAOnEdit('nhaItemMasterId', res.nhaItemMasterId, this.allNHAInfo),
					tlaItemMasterId: this.getInactiveObjectNHATLAOnEdit('tlaItemMasterId', res.tlaItemMasterId, this.allTLAInfo),
					receiverNumber : res.receiver,					
				};
				
				this.receiverNumber = res.receiver;
				//this.stockLineForm.purchaseOrderId = getObjectById('purchaseOrderId',  res.purchaseOrderId == null ? 0 :  res.purchaseOrderId, this.allPolistInfo);
				//this.stockLineForm.purchaseOrderId = getObjectById('repairOrderId',  res.repairOrderId == null ? 0 :  res.repairOrderId, this.allRolistInfo);
				this.loadModuleTypes();
				this.getSiteDetailsOnEdit(res);
				this.onPartNumberSelectedOnEdit(res.itemMasterId);
				this.headerInfo = {
					companyId: this.getManagementStructureDetails(res.managementStructureId, this.employeeId, res.managementStructureId)
				};
				this.getObtainOwnerTraceOnEdit(res);
				this.onSelectConditionType(res.conditionId);
				this.toGetDocumentsListNew(this.stockLineId);
				this.getDeletedList(this.stockLineId);
				this.getVendorSelecionOnEdit(res.vendorId);
				this.getCustomerSelecionOnEdit(res.customerId);
				this.getWOSelecionOnEdit(res.workOrderId);
				this.getPOSelecionOnEdit('',res.purchaseOrderId);
				this.getROSelecionOnEdit('',res.repairOrderId);
				this.loadRevicePnPartNumData('',res.revicedPNId);
				this.loadTagByEmployeeData('',res.taggedBy);
				
				this.getEmployeeSelecionOnEdit(res.requestorId, res.inspectionBy);

				if (res.isSerialized == true) {
					this.hideSerialNumber = false;
				}
				else {
					this.hideSerialNumber = true;
				}
				if (res.timelIfeData != undefined && res.timelIfeData != null && res.timelIfeData != 0) {
					this.timeLifeCyclesId = res.timelIfeData.timeLifeCyclesId;
					this.sourceTimeLife = res.timelIfeData;
				}
				if (this.stockLineForm.tagType && this.stockLineForm.tagType != '0') {
					this.stockLineForm.tagType = this.stockLineForm.tagType.split(',');
					for (let i = 0; i < this.stockLineForm.tagType.length; i++) {
						this.stockLineForm.tagType[i] = this.getIdFromArrayOfObjectByValue('value', 'label', this.stockLineForm.tagType[i], this.allTagTypes);
					}
				} else {
					this.stockLineForm.tagType = [];
				}
				if (this.stockLineForm.purchaseOrderId) {
					this.disableVendor = true;
				}
				this.getSiteDetailsInactive(res);
			});
		});
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

	getIdFromArrayOfObjectByValue(field: string, idField: string, name: any, originalData: any) {
		if ((field !== '' && field !== undefined) && (idField !== '' && idField !== undefined) && (name !== '' && name !== undefined) && (originalData !== undefined && originalData.length > 0)) {
			const data = originalData.filter(x => {
				if (x[idField].toLowerCase() === name.toLowerCase()) {
					return x;
				}
			})
			return data[0][field];
		}
	}

	getInactiveObjectOnEdit(string, id, originalData, tableName, primaryColumn, description) {
		if (id) {
			for (let i = 0; i < originalData.length; i++) {
				if (originalData[i][string] == id) {
					return id;
				}
			}
			let obj: any = {};
			this.commonService.smartDropDownGetObjectById(tableName, primaryColumn, description, primaryColumn, id,this.authService.currentUser.masterCompanyId).subscribe(res => {
				obj = res[0];
				if (tableName == 'Condition') {
					this.allConditionInfo = [...originalData, obj];
				}
				else if (tableName == 'UnitOfMeasure') {
					this.allPurchaseUnitOfMeasureinfo = [...originalData, obj];
				}
				else if (tableName == 'Manufacturer') {
					this.allManufacturerInfo = [...originalData, obj];
				}
				else if (tableName == 'AssetAcquisitionType') {
					this.assetAcquisitionTypeList = [...originalData, obj];
				}
				else if (tableName == 'PurchaseOrder') {
					this.allPolistInfo = [...originalData, { value: obj.value, label: obj.label }];
				}
				else if (tableName == 'RepairOrder') {
					this.allRolistInfo = [...originalData, { value: obj.value, label: obj.label }];
				}
				else if (tableName == 'Site') {
					this.allSites = [...originalData, obj];
				}
				else if (tableName == 'Warehouse') {
					this.allWareHouses = [...originalData, obj];
				}
				else if (tableName == 'Location') {
					this.allLocations = [...originalData, obj];
				}
				else if (tableName == 'Shelf') {
					this.allShelfs = [...originalData, obj];
				}
				else if (tableName == 'Bin') {
					this.allBins = [...originalData, obj];
				}
			});
			return id;
		} else {
			return null;
		}
	}

	getInactiveObjectNHATLAOnEdit(string, id, originalData) {
		if (id) {
			for (let i = 0; i < originalData.length; i++) {
				if (originalData[i][string] == id) {
					return id;
				}
			}
			let obj: any = {};
			this.itemMasterService.getItemMasterMappingPart(id).subscribe(res => {
				obj = res;
				if (string == 'nhaItemMasterId') {
					this.allNHAInfo = [...originalData, { nhaItemMasterId: res.value, partNumber: res.label }];
				}
				else if (string == 'tlaItemMasterId') {
					this.allTLAInfo = [...originalData, { tlaItemMasterId: res.value, partNumber: res.label }];
				}
			});
			return id;
		} else {
			return null;
		}
	}

	getSiteDetailsOnEdit(res) {
		this.onSelectSiteName(res.siteId);
		this.getWareHouseList(res.siteId);
		this.getLocationList(res.warehouseId);
		this.getShelfList(res.locationId);
		this.getBinList(res.shelfId);
	}

	getSiteDetailsInactive(res) {
		this.stockLineForm.siteId = this.getInactiveObjectOnEdit('value', res.siteId, this.allSites, 'Site', 'SiteId', 'Name');
		this.stockLineForm.warehouseId = this.getInactiveObjectOnEdit('value', res.warehouseId, this.allWareHouses, 'Warehouse', 'WarehouseId', 'Name');
		this.stockLineForm.locationId = this.getInactiveObjectOnEdit('value', res.locationId, this.allLocations, 'Location', 'LocationId', 'Name');
		this.stockLineForm.shelfId = this.getInactiveObjectOnEdit('value', res.shelfId, this.allShelfs, 'Shelf', 'ShelfId', 'Name');
		this.stockLineForm.binId = this.getInactiveObjectOnEdit('value', res.binId, this.allBins, 'Bin', 'BinId', 'Name');
	}

	getVendorSelecionOnEdit(vendorId) {
		this.arrayVendorlist.push(vendorId);
		if (vendorId > 0) {
			this.commonService.autoSuggestionSmartDropDownList('Vendor', 'VendorId', 'VendorName', '', true, 20, this.arrayVendorlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
				this.allVendorsList = response;
				this.vendorNames = this.allVendorsList;
				this.stockLineForm.vendorId = getObjectById('value', vendorId, this.allVendorsList);
			}, error => this.saveFailedHelper(error));
		}
	}
	prevent(event)
	{
		event.preventDefault();
	}

	getCustomerSelecionOnEdit(customerId) {
		this.arrayCustlist.push(customerId);
		if (customerId > 0) 
		{

			this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', '', true, 20, this.arrayCustlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
				this.allCustomersList = response;
				this.customerNames = this.allCustomersList;
				this.stockLineForm.customerId = getObjectById('value', customerId, this.allCustomersList);
			}, error => this.saveFailedHelper(error));
		}
	}

	getWOSelecionOnEdit(WorkOrderId) {
		this.arrayWOlist.push(WorkOrderId);
		if (WorkOrderId > 0) {

			let strText='';
			
			this.commonService.autoCompleteDropdownsWorkorderList(strText, 20, this.arrayWOlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
				this.allWorkOrderDetails = [
					{ value: 0, label: 'Select' }
				];
				this.allWorkOrderInfo = [...this.allWorkOrderInfo, ...response];
				this.allWorkOrderDetails = [...this.allWorkOrderDetails, ...response];
				this.stockLineForm.workOrderId = getObjectById('value', WorkOrderId == null ? 0 : WorkOrderId, this.allWorkOrderInfo);
			  })
		}
	}

	getEmployeeSelecionOnEdit(requestorId, inspectionBy) {
		this.arrayEmployeelist.push(requestorId);
		this.arrayEmployeelist.push(inspectionBy);
		this.commonService.autoSuggestionSmartDropDownList('Employee', 'employeeId', 'firstName', '', true, 20, this.arrayEmployeelist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
			this.allEmployeeList = response;
			this.certifyByNames = this.allEmployeeList;
			this.stockLineForm.requestorId = getObjectById('value', requestorId, this.allEmployeeList);
			this.stockLineForm.inspectionBy = getObjectById('value', inspectionBy, this.allEmployeeList);
		}, error => this.saveFailedHelper(error));
	}

	getObtainOwnerTraceOnEdit(res) {

		//Add Customer Id to Array list
		if (res.obtainFrom != null) { this.arrayCustlist.push(res.obtainFrom); }
		if (res.owner != null) { this.arrayCustlist.push(res.owner); }
		if (res.traceableTo != null) this.arrayCustlist.push(res.traceableTo);

		//Add Vendor Id to Array list
		if (res.obtainFrom != null) { this.arrayVendorlist.push(res.obtainFrom); }
		if (res.owner != null) { this.arrayVendorlist.push(res.owner); }
		if (res.traceableTo != null) { this.arrayVendorlist.push(res.traceableTo); }

		//Add Company Id to Array list
		if (res.obtainFrom != null) { this.arrayCompanylist.push(res.obtainFrom); }
		if (res.owner != null) { this.arrayCompanylist.push(res.owner); }
		if (res.traceableTo != null) { this.arrayCompanylist.push(res.traceableTo); }


		//obtain from
		if (res.obtainFromType == this.customerModuleId) {
			this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', '', true, 20, this.arrayCustlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
				this.allCustomersList = response;
				this.customerNames = this.allCustomersList;
				this.stockLineForm.obtainFrom = getObjectById('value', res.obtainFrom, this.allCustomersList);
			}, error => this.saveFailedHelper(error));
		}
		else if (res.obtainFromType == this.vendorModuleId) {
			this.commonService.autoSuggestionSmartDropDownList('Vendor', 'VendorId', 'VendorName', '', true, 20, this.arrayVendorlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
				this.allVendorsList = response;
				this.vendorNames = this.allVendorsList;
				this.stockLineForm.obtainFrom = getObjectById('value', res.obtainFrom, this.allVendorsList);
			}, error => this.saveFailedHelper(error));
		}
		else if (res.obtainFromType == this.companyModuleId) {
			this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name', '', true, 20, this.arrayCompanylist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
				this.allCompanyList = response;
				this.companyNames = this.allCompanyList;
				this.stockLineForm.obtainFrom = getObjectById('value', res.obtainFrom, this.allCompanyList);
			}, error => this.saveFailedHelper(error));
		}
		else if (res.obtainFromType == this.otherModuleId) {
			this.stockLineForm.obtainFrom = res.obtainFromName;
		}

		//owner
		if (res.ownerType == this.customerModuleId) {
			this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', '', true, 20, this.arrayCustlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
				this.allCustomersList = response;
				this.customerNames = this.allCustomersList;
				this.stockLineForm.owner = getObjectById('value', res.owner, this.allCustomersList);
			}, error => this.saveFailedHelper(error));
		}
		else if (res.ownerType == this.vendorModuleId) {
			this.commonService.autoSuggestionSmartDropDownList('Vendor', 'VendorId', 'VendorName', '', true, 20, this.arrayVendorlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
				this.allVendorsList = response;
				this.vendorNames = this.allVendorsList;
				this.stockLineForm.owner = getObjectById('value', res.owner, this.allVendorsList);
			}, error => this.saveFailedHelper(error));
		}
		else if (res.ownerType == this.companyModuleId) {
			this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name', '', true, 20, this.arrayCompanylist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
				this.allCompanyList = response;
				this.companyNames = this.allCompanyList;
				this.stockLineForm.owner = getObjectById('value', res.owner, this.allCompanyList);
			}, error => this.saveFailedHelper(error));
		}
		else if (res.ownerType == this.otherModuleId) {
			this.stockLineForm.owner = res.ownerName;
		}

		//traceable to
		if (res.traceableToType == this.customerModuleId) {
			this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', '', true, 20, this.arrayCustlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
				this.allCustomersList = response;
				this.customerNames = this.allCustomersList;
				this.stockLineForm.traceableTo = getObjectById('value', res.traceableTo, this.allCustomersList);
			}, error => this.saveFailedHelper(error));
		}
		else if (res.traceableToType == this.vendorModuleId) {
			this.commonService.autoSuggestionSmartDropDownList('Vendor', 'VendorId', 'VendorName', '', true, 20, this.arrayVendorlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
				this.allVendorsList = response;
				this.vendorNames = this.allVendorsList;
				this.stockLineForm.traceableTo = getObjectById('value', res.traceableTo, this.allVendorsList);
			}, error => this.saveFailedHelper(error));
		}
		else if (res.traceableToType == this.companyModuleId) {
			this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name', '', true, 20, this.arrayCompanylist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
				this.allCompanyList = response;
				this.companyNames = this.allCompanyList;
				this.stockLineForm.traceableTo = getObjectById('value', res.traceableTo, this.allCompanyList);
			}, error => this.saveFailedHelper(error));
		}
		else if (res.traceableToType == this.otherModuleId) {
			this.stockLineForm.traceableTo = res.tracableToName;
		}
	}

	filterPartNumbers(event) {
		this.partNumbersCollection = this.allPartnumbersList;
		if (event.query !== undefined && event.query !== null) {
			this.loadPartNumData(event.query);
		}
	}
	filterRevicePartNumbers(event) {
		this.partNumbersCollection = this.allPartnumbersList;
		if (event.query !== undefined && event.query !== null) {
			this.loadRevicePnPartNumData(event.query,0);
		}
	}

	filterPoNumber(event) {
		this.polistInfo = this.allPolistInfo;
		const polistData = [
			...this.allPolistInfo.filter(x => {
				return x.label.toLowerCase().includes(event.query.toLowerCase());
			})
		];
		this.polistInfo = polistData;

	}

	filterReceiverNumber(event) {
		const polistData = [
			...this.allPolistInfo.filter(x => {
				return x.label.toLowerCase().includes(event.query.toLowerCase());
			})
		];
		const receverlist = polistData.map(function(item) {
			return item['label'];
		  });

		  this.receicerlistInfo = receverlist;
	}

	filterRoNumber(event) {
		this.rolistInfo = this.allRolistInfo;
		const rolistData = [
			...this.allRolistInfo.filter(x => {
				return x.repairOrderNumber.toLowerCase().includes(event.query.toLowerCase());
			})
		];
		this.rolistInfo = rolistData;
	}

	filterpn(event) {
		if (event.query !== undefined && event.query !== null) {
			this.loadOemPnPartNumData(event.query);
		}
	}

	filterCustomerNames(event) {
		if (event.query !== undefined && event.query !== null) {
			this.loadCustomerData(event.query);
		}
	}

	filterVendorNames(event) {
		if (event.query !== undefined && event.query !== null) {
			this.loadVendorData(event.query);
		}
	}

	filterCompanyNames(event) {
		if (event.query !== undefined && event.query !== null) {
			this.loadCompanyData(event.query);
		}
	}

	filterEmployees(event) {
		if (event.query !== undefined && event.query !== null) {
			this.loadEmployeeData(event.query);
		}
	}

	filterTagEmployees(event) {
		if (event.query !== undefined && event.query !== null) {
			this.loadTagByEmployeeData(event.query,0);
		}
	}

	filterWorkOrderList(event) {
		if (event.query !== undefined && event.query !== null) {
			this.loadWorkOrderList(event.query);
		}
	}
	filterPOList(event) {
		if (event.query !== undefined && event.query !== null) {
			this.loadPODataList(event.query);
		}
	}
	filterROList(event) {
		if (event.query !== undefined && event.query !== null) {
			this.loadRODataList(event.query);
		}
	}

	onPartNumberSelected(itemMasterId) {

		this.itemMasterId=itemMasterId;
		this.getROSelecionOnEdit('',0);
		this.getPOSelecionOnEdit('',0);
		this.loadNHAData(itemMasterId);
		this.loadTLAData(itemMasterId);
		this.GetManufacturerByitemMasterId(itemMasterId);
		this.getUnitCostSalePrice();
		
		this.sourceTimeLife = {};
		this.itemMasterService.getDataForStocklineByItemMasterId(itemMasterId).subscribe(res => {			
			const partDetails = res;
			this.stockLineForm.oem = partDetails.isOEM.toString();
			if (res.isOemPNId > 0) {
				this.arrayItemMasterlist.push(res.isOemPNId);
				this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'partnumber', '', true, 20, this.arrayItemMasterlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
					this.allPartnumbersList = response.map(x => {
						return {
							partnumber: x.label, itemMasterId: x.value
						}
					})
					this.stockLineForm.isOemPNId = getObjectById('itemMasterId', res.isOemPNId, this.allPartnumbersList);
				}, error => this.saveFailedHelper(error));
			}
			this.stockLineForm.partDescription = partDetails.partDescription;
			this.stockLineForm.revisedPart = partDetails.revisedPart;
			this.stockLineForm.itemGroup = partDetails.itemGroup;
			this.stockLineForm.glAccountName = partDetails.glAccount;
			this.stockLineForm.acquistionTypeId = this.getInactiveObjectOnEdit('value', partDetails.assetAcquistionTypeId, this.assetAcquisitionTypeList, 'AssetAcquisitionType', 'AssetAcquisitionTypeId', 'Name');
			this.stockLineForm.manufacturerId = this.getInactiveObjectOnEdit('value', partDetails.manufacturerId, this.allManufacturerInfo, 'Manufacturer', 'ManufacturerId', 'Name');
			this.stockLineForm.integrationPortal = partDetails.integrationPortal;
			this.stockLineForm.shelfLife = partDetails.shelfLife;
			this.stockLineForm.shelfLifeExpirationDate = this.datePipe.transform(partDetails.expirationDate, "MM/dd/yyyy")
			this.stockLineForm.isSerialized = partDetails.isSerialized;
			this.stockLineForm.itarNumber = partDetails.itarNumber;
			this.stockLineForm.nationalStockNumber = partDetails.nationalStockNumber;
			this.stockLineForm.exportECCN = partDetails.exportECCN;
			this.stockLineForm.coreUnitCost = partDetails.coreUnitCost;
			this.stockLineForm.purchaseUnitOfMeasureId =  this.getInactiveObjectOnEdit('value', partDetails.purchaseUnitOfMeasureId, this.allPurchaseUnitOfMeasureinfo, 'UnitOfMeasure', 'unitOfMeasureId', 'shortname');
			this.stockLineForm.unitCost = partDetails.poUnitCost ? formatNumberAsGlobalSettingsModule(partDetails.poUnitCost, 2) : '0.00';
		    this.stockLineForm.unitSalesPrice = partDetails.unitSalesPrice ? formatNumberAsGlobalSettingsModule(partDetails.unitSalesPrice, 2) : '0.00';
			this.stockLineForm.conditionId = partDetails.conditionId;
			this.stockLineForm.tagDays = partDetails.tagDays;
			this.stockLineForm.manufacturingDays = partDetails.manufacturingDays;
			this.stockLineForm.daysReceived = partDetails.daysReceived;
			this.stockLineForm.openDays = partDetails.openDays;
			this.loadRevicePnPartNumData('',partDetails.revisedPartId)
			//this.stockLineForm.isDER = partDetails.isDER;
			this.stockLineForm.siteId = this.getInactiveObjectOnEdit('value', partDetails.siteId, this.allSites, 'Site', 'SiteId', 'Name');
			this.getWareHouseList(partDetails.siteId);
			this.getLocationList(partDetails.warehouseId);
			this.getShelfList(partDetails.locationId);
			this.getBinList(partDetails.shelfId);
			this.stockLineForm.IsManufacturingDateAvailable = partDetails.IsManufacturingDateAvailable;
			if(this.stockLineForm.conditionId){
				this.disableCondition=false;
			}
			if (this.stockLineForm.isSerialized == true) {
				this.hideSerialNumber = false;
				this.stockLineForm.quantityOnHand = 1;
				this.stockLineForm.quantityAvailable = 1;
				this.stockLineForm.quantityReserved = null;
				this.stockLineForm.quantityIssued = null;
				this.disableQtyOnHand = true;
			}
			else {
				this.hideSerialNumber = true;
				this.stockLineForm.quantityOnHand = null;
				this.stockLineForm.quantityReserved = null;
				this.stockLineForm.quantityIssued = null;
				this.stockLineForm.quantityAvailable = null;
				this.disableQtyOnHand = false;
			}
			this.stockLineForm.isDER = partDetails.isDER;
			this.stockLineForm.oem = partDetails.isOEM.toString();
			this.sourceTimeLife.timeLife = partDetails.isTimeLife;
			this.disableManufacturer = false;
			this.stockLineForm.locationId = this.getInactiveObjectOnEdit('value', partDetails.locationId, this.allLocations, 'Location', 'LocationId', 'Name');
			this.stockLineForm.shelfId = this.getInactiveObjectOnEdit('value', partDetails.shelfId, this.allShelfs, 'Shelf', 'ShelfId', 'Name');
			this.stockLineForm.warehouseId = this.getInactiveObjectOnEdit('value', partDetails.warehouseId, this.allWareHouses, 'Warehouse', 'WarehouseId', 'Name');
			this.stockLineForm.binId = this.getInactiveObjectOnEdit('value', partDetails.binId, this.allBins, 'Bin', 'BinId', 'Name');
		});
		this.stockLineForm.requestorId = null;
	}

	onPartNumberSelectedOnEdit(itemMasterId) {
		this.sourceTimeLife = {};
		this.disableManufacturer = false;
		this.itemMasterService.getDataForStocklineByItemMasterId(itemMasterId).subscribe(res => {			
			const partDetails = res;
			this.stockLineForm.tagDays = partDetails.tagDays;
			this.stockLineForm.manufacturingDays = partDetails.manufacturingDays;
			this.stockLineForm.daysReceived = partDetails.daysReceived;
			this.stockLineForm.openDays = partDetails.openDays;
			this.sourceTimeLife.timeLife = partDetails.isTimeLife;
			this.stockLineForm.revisedPart = partDetails.revisedPart;
			this.stockLineForm.itemGroup = partDetails.itemGroup;
			this.stockLineForm.glAccountName = partDetails.glAccount;
			this.stockLineForm.isSerialized = partDetails.isSerialized;
			if (this.stockLineForm.isSerialized == true) {
				this.disableQtyOnHand = true;
			} else {
				this.disableQtyOnHand = false;
			}
		});
	}

	getUnitCostSalePrice() {
		if (this.stockLineForm.itemMasterId && this.stockLineForm.conditionId != '0') {
			//const itemMasterId = getValueFromObjectByKey('value', this.stockLineForm.itemMasterId);
			const itemMasterId = getValueFromObjectByKey('itemMasterId', this.stockLineForm.itemMasterId)
			const conditionId = this.stockLineForm.conditionId;
			this.commonService.getPriceDetailsByCondId(itemMasterId, conditionId).subscribe(res => {
				if (res) {					
					this.stockLineForm.purchaseOrderUnitCost = res.unitCost ? formatNumberAsGlobalSettingsModule(res.unitCost, 2) : '0.00';
					this.stockLineForm.unitSalesPrice = res.salePrice ? formatNumberAsGlobalSettingsModule(res.salePrice, 2) : '0.00';
				}
			})
		}
	}

	// getLegalEntity() {
	// 	this.commonService.getLegalEntityList().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
	// 		this.legalEntityList = res;
	// 	})
	// }

	onSelectManagementStruc() {
		if (this.headerInfo.companyId != 0) {
			this.disableMagmtStruct = false;
		} else {
			this.disableMagmtStruct = true;
		}
	}

	resetQtyFields() {
		this.stockLineForm.quantityReserved = null;
		this.stockLineForm.quantityIssued = null;
		this.stockLineForm.quantityAvailable = null;
	}

	resetQtyIssued() {
		this.stockLineForm.quantityIssued = null;
	}

	calculateQtyAvailable() {
		this.stockLineForm.quantityOnHand = this.stockLineForm.quantityOnHand ? formatNumberAsGlobalSettingsModule(this.stockLineForm.quantityOnHand, 0) : '0';
		if (this.stockLineForm.quantityOnHand != null) {
			this.stockLineForm.quantityAvailable = this.stockLineForm.quantityOnHand;
		}
		if (this.stockLineForm.quantityOnHand != null && this.stockLineForm.quantityReserved != null) {
			const qtyOnHand = parseFloat(this.stockLineForm.quantityOnHand.toString().replace(/\,/g, ''));
			const qtyReserved = parseFloat(this.stockLineForm.quantityReserved.toString().replace(/\,/g, ''));
			const qtyAvailable = qtyOnHand - qtyReserved;
			this.stockLineForm.quantityAvailable = formatNumberAsGlobalSettingsModule(qtyAvailable, 0);
		}
	}

	calcQtyReservedByQtyIssued() {
		this.stockLineForm.quantityIssued = this.stockLineForm.quantityIssued ? formatNumberAsGlobalSettingsModule(this.stockLineForm.quantityIssued, 0) : '0';
		const qtyIssued = parseFloat(this.stockLineForm.quantityIssued.toString().replace(/\,/g, ''));
		const qtyReserved = parseFloat(this.stockLineForm.quantityReserved.toString().replace(/\,/g, ''));
		const qtyOnHand = parseFloat(this.stockLineForm.quantityOnHand.toString().replace(/\,/g, ''));
		const qtyAvailable = parseFloat(this.stockLineForm.quantityAvailable.toString().replace(/\,/g, ''));
		if (qtyIssued > qtyReserved) {
			this.stockLineForm.quantityIssued = null;
			const quantityReserved = qtyOnHand - qtyAvailable;
			this.stockLineForm.quantityReserved = formatNumberAsGlobalSettingsModule(quantityReserved, 0);
			this.alertService.showMessage(
				'Error',
				`Qty Issued cannot be greater than Qty Reserved`,
				MessageSeverity.error)
		}
		else if (qtyOnHand != null && qtyReserved != null && qtyIssued != null) {
			const quantityReserved = qtyReserved - qtyIssued;
			this.stockLineForm.quantityReserved = formatNumberAsGlobalSettingsModule(quantityReserved, 0);
			const quantityAvailable = qtyOnHand - quantityReserved - qtyIssued;
			this.stockLineForm.quantityAvailable = formatNumberAsGlobalSettingsModule(quantityAvailable, 0);
		}
	}

	onChangeQtyReserved() {
		this.stockLineForm.quantityReserved = this.stockLineForm.quantityReserved ? formatNumberAsGlobalSettingsModule(this.stockLineForm.quantityReserved, 0) : '0';
		const qtyReserved = parseFloat(this.stockLineForm.quantityReserved.toString().replace(/\,/g, ''));
		const qtyOnHand = parseFloat(this.stockLineForm.quantityOnHand.toString().replace(/\,/g, ''));
		if (qtyReserved > qtyOnHand) {
			this.stockLineForm.quantityReserved = null;
			this.stockLineForm.quantityAvailable = this.stockLineForm.quantityOnHand;
			this.alertService.showMessage(
				'Error',
				`Qty Reserved cannot be greater than Qty On Hand`,
				MessageSeverity.error)
		} else {
			this.calculateQtyAvailable();
		}
	}

	async getWareHouseList(siteId) {
		this.allWareHouses = [];
		this.allLocations = [];
		this.allShelfs = [];
		this.allBins = [];
		this.stockLineForm.warehouseId = 0;
		this.stockLineForm.locationId = 0;
		this.stockLineForm.shelfId = 0;
		this.stockLineForm.binId = 0;

		if (siteId != 0) {
			await this.commonService.smartDropDownList('Warehouse', 'WarehouseId', 'Name', 'SiteId', siteId, 0,this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
				this.allWareHouses = res;
			})
		}
		this.onSelectSiteName(siteId);
	}

	onSelectSiteName(siteId) {
		if (siteId != 0) {
			this.disableSiteName = false;
		} else {
			this.disableSiteName = true;
		}
	}

	async getLocationList(warehouseId) {
		this.allLocations = [];
		this.allShelfs = [];
		this.allBins = [];
		this.stockLineForm.locationId = 0;
		this.stockLineForm.shelfId = 0;
		this.stockLineForm.binId = 0;

		if (warehouseId != 0) {
			await this.commonService.smartDropDownList('Location', 'LocationId', 'Name', 'WarehouseId', warehouseId, 0,this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
				this.allLocations = res;
			})
		}
	}

	async getShelfList(locationId) {
		this.allShelfs = [];
		this.allBins = [];
		this.stockLineForm.shelfId = 0;
		this.stockLineForm.binId = 0;

		if (locationId != 0) {
			await this.commonService.smartDropDownList('Shelf', 'ShelfId', 'Name', 'LocationId', locationId,  0,this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
				this.allShelfs = res;
			})
		}
	}

	async getBinList(shelfId) {
		this.allBins = [];
		this.stockLineForm.binId = 0;

		if (shelfId != 0) {
			await this.commonService.smartDropDownList('Bin', 'BinId', 'Name', 'ShelfId', shelfId,  0,this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
				this.allBins = res;
			})
		}
	}

	onSelectObrainFrom() {
		this.stockLineForm.obtainFrom = undefined;
	}

	onSelectOwner() {
		this.stockLineForm.owner = undefined;
	}

	onSelectTraceableTo() {
		this.stockLineForm.traceableTo = undefined;
	}

	onChangePONum(selected) {
		this.stocklineser.getPurchaseOrderUnitCost(selected.value).subscribe(res => {
			const resp: any = res;
			if (resp.length > 0) {
				//this.stockLineForm.repairOrderUnitCost = null;
				this.stockLineForm.purchaseOrderUnitCost = resp[0].unitCost ? formatNumberAsGlobalSettingsModule(resp[0].unitCost, 2) : '0.00';
				this.changeUnitPrice();
				// this.arrayVendorlist.push(resp[0].vendorId);
				// this.commonService.autoSuggestionSmartDropDownList('Vendor', 'VendorId', 'VendorName', '', true, 20, this.arrayVendorlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
				// 	this.allVendorsList = response;
				// 	this.vendorNames = this.allVendorsList;
				// 	this.stockLineForm.vendorId = getObjectById('value', resp[0].vendorId, this.allVendorsList);
				// 	this.disableVendor = true;
				// }, error => this.saveFailedHelper(error));
			} else {
				this.disableVendor = false;
			}
		});

		// this.commonService.smartDropDownList('PurchaseOrder', 'PurchaseOrderId', 'RequestedBy', 'PurchaseOrderId', selected.purchaseOrderId, 0,this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
		// 	if (res.length > 0) {
		// 		const empId = res[0].label;
		// 		this.stockLineForm.requestorId = getObjectById('value', empId, this.allEmployeeList);
		// 	}
		// });
	}

	onChangeRONum(selected) {
		this.stocklineser.getRepairOrderUnitCost(selected.value).subscribe(res => {
			//this.stockLineForm.purchaseOrderUnitCost = null;
			this.stockLineForm.repairOrderUnitCost = res[0].unitCost ? formatNumberAsGlobalSettingsModule(res[0].unitCost, 2) : '0.00';
			this.changeUnitPrice();
		});
	}
	
	enableSaveMemo() {
		this.disableSaveMemo = false;
	}

	onAddTextAreaInfo(value) {
		if (value == 'blackListedReason') {
			this.textAreaLabel = 'BlackListed Reason';
			this.textAreaInfo = this.stockLineForm.blackListedReason;
			this.disableSaveMemo = true;
		}
		else if (value == 'incidentReason') {
			this.textAreaLabel = 'Incident Reason';
			this.textAreaInfo = this.stockLineForm.incidentReason;
			this.disableSaveMemo = true;
		}
		else if (value == 'accidentReason') {
			this.textAreaLabel = 'Accident Reason';
			this.textAreaInfo = this.stockLineForm.accidentReason;
			this.disableSaveMemo = true;
		}
		else if (value == 'memo') {
			this.textAreaLabel = 'Memo';
			this.textAreaInfo = this.stockLineForm.memo;
			this.disableSaveMemo = true;
		}
	}

	onSaveTextAreaInfo() {
		if (this.textAreaLabel == 'BlackListed Reason') {
			this.stockLineForm.blackListedReason = this.textAreaInfo;
		}
		else if (this.textAreaLabel == 'Incident Reason') {
			this.stockLineForm.incidentReason = this.textAreaInfo;
		}
		else if (this.textAreaLabel == 'Accident Reason') {
			this.stockLineForm.accidentReason = this.textAreaInfo;
		}
		else if (this.textAreaLabel == 'Memo') {
	
			this.stockLineForm.memo = this.textAreaInfo;
			this.enableSaveDocument();

		}
	}

	onSelectConditionType(value) {
		if (value != 0) {
			this.disableCondition = false;
		} else {
			this.disableCondition = true;
		}
	}

	onSelectManufacturer(value) {
		if (value != 0) {
			this.disableManufacturer = false;
		} else {
			this.disableManufacturer = true;
		}
	}

	onSelectCustomer() {
		if(this.stockLineForm.isCustomerStock)
		{
			if (this.stockLineForm.customerId != 0 && this.stockLineForm.customerId != null) 
			{
				this.disableCustomer = false;
			} 
			else {
				this.disableCustomer = true;
			}
		}
		else {
			this.disableCustomer = false;
		}
	
	}
	ChekisCustomerStock(isCustomerStock)
	{
		if(!isCustomerStock)
		{
			this.stockLineForm.customerId= null;
		}
	}

	onSaveStockLine() {
		this.isSpinnerVisible = true;

		const timeLife = {
			timeLifeCyclesId: this.timeLifeCyclesId > 0 ? this.timeLifeCyclesId : null,
			cyclesRemaining: typeof (this.sourceTimeLife.cyclesRemaining) == 'string' ? this.sourceTimeLife.cyclesRemaining : this.sourceTimeLife.cyclesRemaining ? this.datePipe.transform(this.sourceTimeLife.cyclesRemaining, "HH:mm") : null,
			timeRemaining: typeof (this.sourceTimeLife.timeRemaining) == 'string' ? this.sourceTimeLife.timeRemaining : this.sourceTimeLife.timeRemaining ? this.datePipe.transform(this.sourceTimeLife.timeRemaining, "HH:mm") : null,
			cyclesSinceNew: typeof (this.sourceTimeLife.cyclesSinceNew) == 'string' ? this.sourceTimeLife.cyclesSinceNew : this.sourceTimeLife.cyclesSinceNew ? this.datePipe.transform(this.sourceTimeLife.cyclesSinceNew, "HH:mm") : null,
			timeSinceNew: typeof (this.sourceTimeLife.timeSinceNew) == 'string' ? this.sourceTimeLife.timeSinceNew : this.sourceTimeLife.timeSinceNew ? this.datePipe.transform(this.sourceTimeLife.timeSinceNew, "HH:mm") : null,
			lastSinceNew: typeof (this.sourceTimeLife.lastSinceNew) == 'string' ? this.sourceTimeLife.lastSinceNew : this.sourceTimeLife.lastSinceNew ? this.datePipe.transform(this.sourceTimeLife.lastSinceNew, "HH:mm") : null,
			cyclesSinceOVH: typeof (this.sourceTimeLife.cyclesSinceOVH) == 'string' ? this.sourceTimeLife.cyclesSinceOVH : this.sourceTimeLife.cyclesSinceOVH ? this.datePipe.transform(this.sourceTimeLife.cyclesSinceOVH, "HH:mm") : null,
			timeSinceOVH: typeof (this.sourceTimeLife.timeSinceOVH) == 'string' ? this.sourceTimeLife.timeSinceOVH : this.sourceTimeLife.timeSinceOVH ? this.datePipe.transform(this.sourceTimeLife.timeSinceOVH, "HH:mm") : null,
			lastSinceOVH: typeof (this.sourceTimeLife.lastSinceOVH) == 'string' ? this.sourceTimeLife.lastSinceOVH : this.sourceTimeLife.lastSinceOVH ? this.datePipe.transform(this.sourceTimeLife.lastSinceOVH, "HH:mm") : null,
			cyclesSinceInspection: typeof (this.sourceTimeLife.cyclesSinceInspection) == 'string' ? this.sourceTimeLife.cyclesSinceInspection : this.sourceTimeLife.cyclesSinceInspection ? this.datePipe.transform(this.sourceTimeLife.cyclesSinceInspection, "HH:mm") : null,
			timeSinceInspection: typeof (this.sourceTimeLife.timeSinceInspection) == 'string' ? this.sourceTimeLife.timeSinceInspection : this.sourceTimeLife.timeSinceInspection ? this.datePipe.transform(this.sourceTimeLife.timeSinceInspection, "HH:mm") : null,
			lastSinceInspection: typeof (this.sourceTimeLife.lastSinceInspection) == 'string' ? this.sourceTimeLife.lastSinceInspection : this.sourceTimeLife.lastSinceInspection ? this.datePipe.transform(this.sourceTimeLife.lastSinceInspection, "HH:mm") : null,
			cyclesSinceRepair: typeof (this.sourceTimeLife.cyclesSinceRepair) == 'string' ? this.sourceTimeLife.cyclesSinceRepair : this.sourceTimeLife.cyclesSinceRepair ? this.datePipe.transform(this.sourceTimeLife.cyclesSinceRepair, "HH:mm") : null,
			timeSinceRepair: typeof (this.sourceTimeLife.timeSinceRepair) == 'string' ? this.sourceTimeLife.timeSinceRepair : this.sourceTimeLife.timeSinceRepair ? this.datePipe.transform(this.sourceTimeLife.timeSinceRepair, "HH:mm") : null,
		}
		this.saveStockLineForm = {
			...this.stockLineForm,
			purchaseUnitOfMeasureId: this.stockLineForm.purchaseUnitOfMeasureId > 0 ? this.stockLineForm.purchaseUnitOfMeasureId : null,
			isOemPNId: getValueFromObjectByKey('itemMasterId', this.stockLineForm.isOemPNId),
			isPMA: this.stockLineForm.oem == 'true' ? 'false' : 'true',
			certifiedDate: this.datePipe.transform(this.stockLineForm.certifiedDate, "MM/dd/yyyy"),
			tagDate: this.datePipe.transform(this.stockLineForm.tagDate, "MM/dd/yyyy"),
			certifiedDueDate: this.datePipe.transform(this.stockLineForm.certifiedDueDate, "MM/dd/yyyy"),
			shelfLifeExpirationDate: this.datePipe.transform(this.stockLineForm.shelfLifeExpirationDate, "MM/dd/yyyy"),
			receivedDate: this.datePipe.transform(this.stockLineForm.receivedDate, "MM/dd/yyyy"),
			inspectionDate: this.stockLineForm.inspectionDate ? this.datePipe.transform(this.stockLineForm.inspectionDate, "MM/dd/yyyy") : '',
			entryDate: this.datePipe.transform(this.stockLineForm.entryDate, "MM/dd/yyyy"),
			expirationDate: this.datePipe.transform(this.stockLineForm.expirationDate, "MM/dd/yyyy"),
			manufacturingDate: this.datePipe.transform(this.stockLineForm.manufacturingDate, "MM/dd/yyyy"), 
			//receiverNumber: this.stockLineForm.receiverNumber != undefined && this.stockLineForm.receiverNumber.purchaseOrderNumber != undefined? this.stockLineForm.receiverNumber.purchaseOrderNumber : this.stockLineForm.receiverNumber,
			partNumber: this.stockLineForm.itemMasterId != undefined ? this.stockLineForm.itemMasterId.partnumber : '',
			itemMasterId: getValueFromObjectByKey('itemMasterId', this.stockLineForm.itemMasterId),
			revicedPNId: getValueFromObjectByKey('itemMasterId', this.stockLineForm.revicedPNId),
			vendorId: this.stockLineForm.vendorId ? editValueAssignByCondition('value', this.stockLineForm.vendorId) : '',
			customerId: this.stockLineForm.customerId ? editValueAssignByCondition('value', this.stockLineForm.customerId) : '',
			obtainFromName: this.stockLineForm.obtainFromType == 4 ? this.stockLineForm.obtainFrom : (this.stockLineForm.obtainFrom ? getValueFromObjectByKey('label', this.stockLineForm.obtainFrom) : ''),
			obtainFrom: this.stockLineForm.obtainFromType == 4 ? null : (this.stockLineForm.obtainFrom ? editValueAssignByCondition('value', this.stockLineForm.obtainFrom) : ''),
			obtainFromType: this.stockLineForm.obtainFromType > 0 ? this.stockLineForm.obtainFromType : null,
			ownerType: this.stockLineForm.ownerType > 0 ? this.stockLineForm.ownerType : null,
			traceableToType: this.stockLineForm.traceableToType > 0 ? this.stockLineForm.traceableToType : null,
			manufacturerId: this.stockLineForm.manufacturerId > 0 ? this.stockLineForm.manufacturerId : null,
			//purchaseOrderId: this.stockLineForm.purchaseOrderId && getValueFromObjectByKey('purchaseOrderId',this.stockLineForm.purchaseOrderId) != 0 ? this.stockLineForm.purchaseOrderId.purchaseOrderId : null,
			//repairOrderId: this.stockLineForm.repairOrderId && getValueFromObjectByKey('repairOrderId',this.stockLineForm.repairOrderId) != 0 ? getValueFromObjectByKey('repairOrderId',this.stockLineForm.repairOrderId) : null,
			//purchaseOrderId: this.stockLineForm.purchaseOrderId != null  ?this.stockLineForm.purchaseOrderId.purchaseOrderId : null,
			//repairOrderId: this.stockLineForm.repairOrderId != null  ? this.stockLineForm.repairOrderId.repairOrderId : null,
			purchaseOrderId: this.stockLineForm.purchaseOrderId && this.getValueFromObj(this.stockLineForm.purchaseOrderId) != 0 ? this.getValueFromObj(this.stockLineForm.purchaseOrderId) : null,
			repairOrderId: this.stockLineForm.repairOrderId && this.getValueFromObj(this.stockLineForm.repairOrderId) != 0 ? this.getValueFromObj(this.stockLineForm.repairOrderId) : null,
			owneconditionIdrType: this.stockLineForm.conditionId > 0 ? this.stockLineForm.conditionId : null,
			nha: this.stockLineForm.nha > 0 ? this.stockLineForm.nha : null,
			tla: this.stockLineForm.tla > 0 ? this.stockLineForm.tla : null,
			warehouseId: this.stockLineForm.warehouseId > 0 ? this.stockLineForm.warehouseId : null,
			locationId: this.stockLineForm.locationId > 0 ? this.stockLineForm.locationId : null,
			shelfId: this.stockLineForm.shelfId > 0 ? this.stockLineForm.shelfId : null,
			binId: this.stockLineForm.binId > 0 ? this.stockLineForm.binId : null,
			isCustomerStock: this.stockLineForm.isCustomerStock,
			isCustomerstockType: this.stockLineForm.isCustomerstockType,

			ownerName: this.stockLineForm.ownerType == 4 ? this.stockLineForm.owner : (this.stockLineForm.owner ? getValueFromObjectByKey('label', this.stockLineForm.owner) : ''),
			owner: this.stockLineForm.ownerType == 4 ? null : (this.stockLineForm.owner ? editValueAssignByCondition('value', this.stockLineForm.owner) : ''),

			traceableToName: this.stockLineForm.traceableToType == 4 ? this.stockLineForm.traceableTo : (this.stockLineForm.traceableTo ? getValueFromObjectByKey('label', this.stockLineForm.traceableTo) : ''),
			traceableTo: this.stockLineForm.traceableToType == 4 ? null : (this.stockLineForm.traceableTo ? editValueAssignByCondition('value', this.stockLineForm.traceableTo) : ''),
			taggedBy: this.stockLineForm.taggedBy ? getValueFromObjectByKey('value', this.stockLineForm.taggedBy) : '',
			requestorId: this.stockLineForm.requestorId ? getValueFromObjectByKey('value', this.stockLineForm.requestorId) : '',
			inspectionBy: this.stockLineForm.inspectionBy ? getValueFromObjectByKey('value', this.stockLineForm.inspectionBy) : '',
			workOrderId: this.stockLineForm.workOrderId && this.getValueFromObj(this.stockLineForm.workOrderId) != 0 ? this.getValueFromObj(this.stockLineForm.workOrderId) : null,
			quantityOnHand: this.stockLineForm.quantityOnHand ? parseFloat(this.stockLineForm.quantityOnHand.toString().replace(/\,/g, '')) : 0,
			quantityReserved: this.stockLineForm.quantityReserved ? parseFloat(this.stockLineForm.quantityReserved.toString().replace(/\,/g, '')) : 0,
			quantityIssued: this.stockLineForm.quantityIssued ? parseFloat(this.stockLineForm.quantityIssued.toString().replace(/\,/g, '')) : 0,
			quantityAvailable: this.stockLineForm.quantityAvailable ? parseFloat(this.stockLineForm.quantityAvailable.toString().replace(/\,/g, '')) : 0,
			purchaseOrderUnitCost: this.stockLineForm.purchaseOrderUnitCost ? parseFloat(this.stockLineForm.purchaseOrderUnitCost.toString().replace(/\,/g, '')) : '0.00',
			repairOrderUnitCost: this.stockLineForm.repairOrderUnitCost ? parseFloat(this.stockLineForm.repairOrderUnitCost.toString().replace(/\,/g, '')) : '0.00',
			unitSalesPrice: this.stockLineForm.unitSalesPrice ? parseFloat(this.stockLineForm.unitSalesPrice.toString().replace(/\,/g, '')) : '0.00',
			unitCost: this.stockLineForm.unitCost ? parseFloat(this.stockLineForm.unitCost.toString().replace(/\,/g, '')) : '0.00',
			coreUnitCost: this.stockLineForm.coreUnitCost ? parseFloat(this.stockLineForm.coreUnitCost.toString().replace(/\,/g, '')) : '0.00',
			lotCost: this.stockLineForm.lotCost ? parseFloat(this.stockLineForm.lotCost.toString().replace(/\,/g, '')) : '0.00',
			timeLifes: { ...timeLife, timeLifeCyclesId: this.timeLifeCyclesId, updatedDate: new Date() },
			masterCompanyId: this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null,
			createdby: this.authService.currentUser ? this.authService.currentUser.userName : "",
			updatedby: this.authService.currentUser ? this.authService.currentUser.userName : "",
			timeLifeCyclesId: this.timeLifeCyclesId > 0 ? this.timeLifeCyclesId : null,
			managementStructureId: this.headerInfo.managementStructureId
		}

		if (this.stockLineForm.tagType.length > 0) {
			for (let i = 0; i < this.stockLineForm.tagType.length; i++) {
				this.saveStockLineForm.tagType[i] = getValueFromArrayOfObjectById('label', 'value', this.stockLineForm.tagType[i], this.allTagTypes);
			}
			this.saveStockLineForm.tagType = this.saveStockLineForm.tagType.join();
		} else {
			this.saveStockLineForm.tagType = "";
		}

		var errmessage = '';
		this.alertService.resetStickyMessage();
		if (this.saveStockLineForm.manufacturingDate != "" && moment(this.saveStockLineForm.manufacturingDate, 'MM/DD/YYYY', true).isValid()) {
			if (this.saveStockLineForm.tagDate != "" && moment(this.saveStockLineForm.tagDate, 'MM/DD/YYYY', true).isValid()) {
				if (this.saveStockLineForm.tagDate <= this.saveStockLineForm.manufacturingDate) {
					this.isSpinnerVisible = false;
					errmessage = errmessage + "Tag Date must be greater than Manufacturing Date."
				}
			}
			if (this.saveStockLineForm.inspectionDate != "" && moment(this.saveStockLineForm.inspectionDate, 'MM/DD/YYYY', true).isValid()) {
				if (this.saveStockLineForm.inspectionDate <= this.saveStockLineForm.manufacturingDate) {
					this.isSpinnerVisible = false;
					if (errmessage != '') {
						errmessage = errmessage + '<br />' + "Inspection Date must be greater than Manufacturing Date."
					}
					else {
						errmessage = errmessage + "Inspection Date must be greater than Manufacturing Date."
					}
				}
			}
			if (this.saveStockLineForm.certifiedDate != "" && moment(this.saveStockLineForm.certifiedDate, 'MM/DD/YYYY', true).isValid()) {
				if (this.saveStockLineForm.certifiedDate <= this.saveStockLineForm.manufacturingDate) {
					this.isSpinnerVisible = false;
					if (errmessage != '') {
						errmessage = errmessage + '<br />' + "Certified Date must be greater than Manufacturing Date."
					}
					else {
						errmessage = errmessage + "Certified Date must be greater than Manufacturing Date."
					}
				}
			}
			if (this.saveStockLineForm.receivedDate != "" && moment(this.saveStockLineForm.receivedDate, 'MM/DD/YYYY', true).isValid()) {
				if (this.saveStockLineForm.receivedDate <= this.saveStockLineForm.manufacturingDate) {
					this.isSpinnerVisible = false;
					if (errmessage != '') {
						errmessage = errmessage + '<br />' + "Received Date must be greater than Manufacturing Date."
					}
					else {
						errmessage = errmessage + "Received Date must be greater than Manufacturing Date."
					}
				}
			}
			if (this.saveStockLineForm.entryDate != "" && moment(this.saveStockLineForm.entryDate, 'MM/DD/YYYY', true).isValid()) {
				if (this.saveStockLineForm.entryDate <= this.saveStockLineForm.manufacturingDate) {
					this.isSpinnerVisible = false;
					if (errmessage != '') {
						errmessage = errmessage + '<br />' + "Entry Date must be greater than Manufacturing Date."
					}
					else {
						errmessage = errmessage + "Entry Date must be greater than Manufacturing Date."
					}
				}
			}
		}

		if (errmessage != '') {
			this.isSpinnerVisible = false;
			this.stockLineForm = {
				...this.stockLineForm,
				itemMasterId: getObjectById('itemMasterId', this.saveStockLineForm.itemMasterId, this.allPartnumbersList),
			}

			this.alertService.showStickyMessage("Validation failed", errmessage, MessageSeverity.error, errmessage);
			return;
		}

		this.saveStockLineForm.receiverNumber = this.receiverNumber;
		this.stocklineser.newStockLine(this.saveStockLineForm).subscribe(res => {
			this.isSpinnerVisible = false;
			this.stockLineId = res.stockLineId; 
			localStorage.setItem('commonId',this.stockLineId.toString())
			this.uploadDocs.next(true);
			// this.onUploadDocumentListNew();

			this.alertService.showMessage(
				'Success',
				`${this.isEditMode ? 'Updated' : 'Saved'} Stockline data Sucessfully `,
				MessageSeverity.success)
			this.router.navigateByUrl('/stocklinemodule/stocklinepages/app-stock-line-list');
		}, error => this.saveFailedHelper(error))
	}

	getValueFromObj(obj) {
		if (obj.value) {
			return obj.value;
		} else {
			return null;
		}
	}
	POValue : number = 0;
	ROValue : number = 0;
	UnitPrice : number = 0;
	changeUnitPrice()
	{
		debugger;
		
		var ROValue = 0
		if (this.stockLineForm.purchaseOrderUnitCost != "" && this.stockLineForm.purchaseOrderUnitCost != null && this.stockLineForm.purchaseOrderUnitCost != undefined) {
			this.POValue = this.stockLineForm.purchaseOrderUnitCost.replace(/,/g, '');
		}
		else {
			this.POValue = 0
		}

		if (this.stockLineForm.repairOrderUnitCost != "" && this.stockLineForm.repairOrderUnitCost != null && this.stockLineForm.repairOrderUnitCost != undefined) {
			this.ROValue = this.stockLineForm.repairOrderUnitCost.replace(/,/g, '');
		}
		else {
			ROValue = 0
		}

		 this.UnitPrice = Number(this.POValue)+ Number(this.ROValue);

		this.stockLineForm.unitCost = this.UnitPrice ? formatNumberAsGlobalSettingsModule(this.UnitPrice, 2) : '0.00';


	}

	onChangePOUnitCost() 
	{
		this.stockLineForm.purchaseOrderUnitCost = this.stockLineForm.purchaseOrderUnitCost ? formatNumberAsGlobalSettingsModule(this.stockLineForm.purchaseOrderUnitCost, 2) : '0.00';
		this.changeUnitPrice();
	}

	onChangeROUnitCost() 
	{
		this.stockLineForm.repairOrderUnitCost = this.stockLineForm.repairOrderUnitCost ? formatNumberAsGlobalSettingsModule(this.stockLineForm.repairOrderUnitCost, 2) : '0.00';
		this.changeUnitPrice();
	}

	onChangeUnitSalesPrice() {
		this.stockLineForm.unitSalesPrice = this.stockLineForm.unitSalesPrice ? formatNumberAsGlobalSettingsModule(this.stockLineForm.unitSalesPrice, 2) : '0.00';
	}

	onChangeCoreCost() {
		this.stockLineForm.coreUnitCost = this.stockLineForm.coreUnitCost ? formatNumberAsGlobalSettingsModule(this.stockLineForm.coreUnitCost, 2) : '0.00';
	}

	onChangelotCost() {
		this.stockLineForm.lotCost = this.stockLineForm.lotCost ? formatNumberAsGlobalSettingsModule(this.stockLineForm.lotCost, 2) : '0.00';
	}

	onUploadDocumentListNew() {
		// file upload
		const vdata = {
			referenceId: this.stockLineId,
			masterCompanyId: this.currentUserMasterCompanyId,
			createdBy: this.userName,
			updatedBy: this.userName,
			moduleId: 53,
		}
		let documentData: any = [];
		for (var key in vdata) {
			this.formData.append(key, vdata[key]);
		}
		if (this.sourceViewforDocumentList.length > 0) {
			for (var i = 0; i < this.sourceViewforDocumentList.length; i++) {
				documentData.push({

					docName: this.sourceViewforDocumentList[i].docName,
					docMemo: this.sourceViewforDocumentList[i].docMemo,
					docDescription: this.sourceViewforDocumentList[i].docDescription,
					link: this.sourceViewforDocumentList[i].link,
					fileName: this.sourceViewforDocumentList[i].fileName,
					isFileFromServer: false,
					attachmentDetailId: this.sourceViewforDocumentList[i].attachmentDetailId,
					createdBy: this.sourceViewforDocumentList[i].createdBy,
					updatedBy: this.sourceViewforDocumentList[i].updatedBy,
					createdDate: this.sourceViewforDocumentList[i].createdDate,
					updatedDate: this.sourceViewforDocumentList[i].updatedDate,
					fileSize: this.sourceViewforDocumentList[i].fileSize,
					moduleId: this.sourceViewforDocumentList[i].moduleId,
				})
			}
			this.formData.append('attachmentdetais', JSON.stringify(documentData));
			this.commonService.uploadDocumentsEndpoint(this.formData).subscribe(res => {
				this.toGetDocumentsListNew(this.stockLineId);
			});
		}
	}

	fileUploadCertifiedDeSelect(event) {
		let newFilesList = [];
		for (let selectedFile of this.selectedFileAttachment) {
			if (event.file.name != selectedFile.fileName) {
				newFilesList.push(selectedFile);
			}
		}
		this.selectedFileAttachment = newFilesList;
	}

	fileUploadCertified(event) {
		if (event.files.length === 0) {
			this.disableFileAttachmentSubmit = false;
		} else {
			this.disableFileAttachmentSubmit = true;
		}

		const filesSelectedTemp = [];
		this.selectedFileAttachment = [];
		for (let file of event.files) {
			filesSelectedTemp.push({
				link: file.objectURL,
				fileName: file.name,
				isFileFromServer: false,
				fileSize: file.size,
			})
			this.formData.append(file.name, file);
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
				attachmentDetailId: 0,
				moduleId: 53,

			})
		}
	}

	addDocumentInformation(type, documentInformation) {
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
					fileSize: `${((this.selectedFileAttachment[i].fileSize) / (1000)).toFixed(2)} KB`,
					moduleId: 53
				})
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
			this.dismissDocumentPopupModel(type)
		}
		this.sourceViewforDocumentList = [...this.sourceViewforDocumentList]
		if (this.sourceViewforDocumentList.length > 0) {
		}
		this.index = 0;
		this.isEditButton = false;
		this.disableFileAttachmentSubmit == true;;

		this.dismissDocumentPopupModel(type)

		if (this.fileUploadInput) {
			this.fileUploadInput.clear()
		}
	}

	downloadFileUpload(rowData) {
		const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
		window.location.assign(url);
	}

	addDocumentDetails() {
		this.selectedFileAttachment = [];
		this.disableFileAttachmentSubmit = false;
		this.index = 0;
		this.isEditButton = false;
		this.documentInformation = {

			docName: '',
			docMemo: '',
			docDescription: '',
			attachmentDetailId: 0
		}
	}

	dismissDocumentPopupModel(type) {
		this.fileUploadInput.clear();
		this.closeMyModel(type);
	}

	closeMyModel(type) {
		$(type).modal("hide");
	}

	dateFilterForTableNew(date, field) {
		if (date !== '' && moment(date).format('MMMM DD YYYY')) {
			this.sourceViewforDocumentList = this.allDocumentListOriginal;
			const data = [...this.sourceViewforDocumentList.filter(x => {
				if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
					return x;
				} else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
					return x;
				}
			})]
			this.sourceViewforDocumentList = data;
		} else {
			this.sourceViewforDocumentList = this.allDocumentListOriginal;
		}
	}

	editStockLineDocument(rowdata, index = 0) {
		this.disableSaveForEditDocument = true;
		this.selectedFileAttachment = [];

		this.isEditButton = true;
		this.documentInformation = rowdata;
		this.index = index;
		if (rowdata.attachmentDetailId > 0) {
			this.toGetDocumentView(rowdata.attachmentDetailId);
		}
		else {
			this.sourceViewforDocument = rowdata;
		}
	}

	toGetDocumentView(id) {
		this.commonService.GetAttachment(id).subscribe(res => {
			this.sourceViewforDocument = res || [];
		})
	}

	deleteAttachmentRow(rowdata, index, content) {
		this.selectedRowForDelete = rowdata;
		this.rowIndex = index;
		this.modal = this.modalService.open(content, { size: 'sm' });
	}

	openHistory(content, rowData) {
		this.alertService.startLoadingMessage();

		this.commonService.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(
			results => this.onAuditHistoryLoadSuccessful(results, content),
			error => this.saveFailedHelper(error));
	}

	private onAuditHistoryLoadSuccessful(auditHistory, content) {
		this.alertService.stopLoadingMessage();
		this.sourceViewforDocumentAudit = auditHistory;
		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
	}

	private saveFailedHelper(error: any) {
		this.isSpinnerVisible = false;
	}

	getColorCodeForHistory(i, field, value) {
		const data = this.sourceViewforDocumentAudit;
		const dataLength = data.length;
		if (i >= 0 && i <= dataLength) {
			if ((i + 1) === dataLength) {
				return true;
			} else {
				return data[i + 1][field] === value
			}
		}
	}

	deleteItemAndCloseModel() {
		let attachmentDetailId = this.selectedRowForDelete.attachmentDetailId;
		if (attachmentDetailId > 0) {
			this.commonService.GetAttachmentDeleteById(attachmentDetailId, this.userName).subscribe(res => {
				this.toGetDocumentsListNew(this.stockLineId);
				this.alertService.showMessage(
					'Success',
					`Deleted Attachment  Successfully`,
					MessageSeverity.success
				);
			})
		}
		else {
			this.sourceViewforDocumentList.splice(this.rowIndex, 1)
		}

		this.modal.close();
	}

	toGetDocumentsListNew(id) {
		var moduleId = 53;
		this.commonService.GetDocumentsListNew(id, moduleId).subscribe(res => {
			this.sourceViewforDocumentList = res || [];
			this.allDocumentListOriginal = res;

			if (this.sourceViewforDocumentList.length > 0) {
				this.sourceViewforDocumentList.forEach(item => {
					item["isFileFromServer"] = true;
					item["moduleId"] = 53;
				})
			}
		})
	}

	getDeletedList(id) {
		var moduleId = 53;
		this.commonService.GetDocumentsListNew(id, moduleId, true).subscribe(res => {
			this.deletedDocumentList = res || [];

			if (this.deletedDocumentList.length > 0) {
				this.deletedDocumentList.forEach(item => {
					item["isFileFromServer"] = true;
					item["moduleId"] = 53;
				})
			}
		})
	}

	dismissModel() {
		this.modal.close();
	}

	changeOfStatus(status){
        this.disableSaveForEdit=false;
    }

	getPageCount(totalNoofRecords, viewPageSize) {
		return Math.ceil(totalNoofRecords / viewPageSize)
	}

	enableSave() {

		if(this.stockLineForm.memo != "" && this.stockLineForm.memo != null)
		{
			this.disableSaveForEdit = false;
		}else
		{
			this.disableSaveForEdit = true;
		}

		if(this.stockLineForm.isCustomerStock)
		{
			if (this.stockLineForm.customerId != 0 && this.stockLineForm.customerId != null) 
			{
				this.disableCustomer = false;
			} 
			else {
				this.disableCustomer = true;
			}
		}
		else {
			this.disableCustomer = false;
		}

		if (!this.stockLineForm.inspectionBy) {
			this.stockLineForm.inspectionDate = null;
		}
	}

	enableSaveDocument() {

		if(this.stockLineForm.memo != "" && this.stockLineForm.memo != null)
		{
			this.disableSaveForEdit = false;
		}else
		{
			this.disableSaveForEditDocument = true;
			this.disableSaveForEdit = true;
		}
		
	}

	onCheckOem() {
		if (this.stockLineForm.oem == 'true') {
			this.stockLineForm.isOemPNId = undefined;
		}
	}

	onCheckPMA() {
		this.stockLineForm.isOemPNId = undefined;
	}

	selectedOEM(value) {

		this.tempOEMpartNumberId = value.value;
	}

	onChangeMfgDate(value) {
		if (value) {
			const todayDate = new Date();
			const mfgdate = new Date(value);
			const diffTime = Math.abs(mfgdate.getTime() - todayDate.getTime());
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			console.log(diffTime + " milliseconds");
			console.log(diffDays + " days");

			this.stockLineForm.manufacturingDays = diffDays;
		}
	}

	errorMessageHandler(log) {
		const errorLog = log;
		var msg = '';
		if (errorLog.message) {
			if (errorLog.error && errorLog.error.errors.length > 0) {
				for (let i = 0; i < errorLog.error.errors.length; i++) {
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
			);
		}
	}

	onChangeInspectedDate() {
		if (this.stockLineForm.inspectionBy) {
			this.stockLineForm.inspectionDate = new Date();
		} else {
			this.stockLineForm.inspectionDate = null;
		}
	}
}