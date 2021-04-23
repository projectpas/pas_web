import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { fadeInOut } from '../../../services/animations';
import { MasterCompany } from '../../../models/mastercompany.model';
import { AuditHistory } from '../../../models/audithistory.model';
import { AuthService } from '../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { ItemMasterService } from '../../../services/itemMaster.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { CustomerClassification } from '../../../models/customer-classification.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GMapModule } from 'primeng/gmap';
import { AddActionsDialogComponent } from '../../dialogs/add-actions-dialog/add-actions-dialog.component';
// import { unescapeHtml } from '@angular/platform-browser/src/browser/transfer_state';
import { FileUploadModule } from 'primeng/fileupload';
import { Message } from 'primeng/components/common/message';
import { CustomerClassificationService } from '../../../services/CustomerClassification.service';
import { Integration } from '../../../models/integration.model';
import { IntegrationService } from '../../../services/integration-service';
import { DialogModule } from 'primeng/dialog';
import { timeInterval } from 'rxjs/operator/timeInterval';
import { BaseRowDef } from '@angular/cdk/table';
import { ItemClassificationService } from '../../../services/item-classfication.service';
import { ItemClassificationModel } from '../../../models/item-classification.model';
import { OnInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { Itemgroup } from '../../../models/item-group.model';
import { ItemGroupService } from '../../../services/item-group.service';
import { Provision } from '../../../models/provision.model';

import { ProvisionService } from '../../../services/provision.service';
import { ATAMain } from '../../../models/atamain.model';
import { AtaMainService } from '../../../services/atamain.service';
import { Priority } from '../../../models/priority.model';
import { PriorityService } from '../../../services/priority.service';
import { Currency } from '../../../models/currency.model';
import { CurrencyService } from '../../../services/currency.service';
import { UnitOfMeasureService } from '../../../services/unitofmeasure.service';
import { UnitOfMeasure } from '../../../models/unitofmeasure.model';

import { CalendarModule } from 'primeng/calendar';
import { ATAChapter } from '../../../models/atachapter.model';
import { GlAccount } from '../../../models/GlAccount.model';
import { GlAccountService } from '../../../services/glAccount/glAccount.service';
import { CommonService } from '../../../services/common.service';
import { DatePipe } from '@angular/common';
import { formatNumberAsGlobalSettingsModule } from '../../../generic/autocomplete';
@Component({
    selector: 'app-item-master-non-stock',
    templateUrl: './item-master-non-stock.component.html',
    styleUrls: ['./item-master-non-stock.component.scss'],
	providers: [DatePipe]
})

/** item-master-non-stock component*/
export class ItemMasterNonStockComponent {
	modelValue: boolean = false;
	display: boolean = false;
	disableSaveglAccount: boolean;
	disableSaveItemClassficationCode: boolean;
	selectedItemCode: any;
	selectdescription: any;
	disableSaveItemGroup: boolean;
	selectedItemGroup: any;
	disableSaveManufacturer: boolean;
	public sourceActions: any = {};
	selectedManufacturer: any;
	disableSavePurchaseUOM: boolean;
	disableSavepartNumber: boolean;
	selectedPurchaseUOM: any;
	disableSavePartName: boolean;
	disableSaveCusCode: boolean;
	selectedActionName: any;
    showLable: boolean;
    collectionofItemMaster: any;
    partCollection: any[];
	allPartnumbersInfo: any[];
	itemdescription: any[] = [];
	descriptionCollection: any[];
    partNumber: any;
    name: string;
    // itemValue= [];
	glAccountcla: any[];
	glAccountCollection: any[];
    localmanufacturer: any[];
    sourcemanufacturer: any = {};
    allManufacturerInfo: any[];
    itemclaColl: any[];
    localunit: any;
    sourceUOM: UnitOfMeasure;
    unitName: string;
	allUnitOfMeasureinfo: any[];
    localCollection: any[];
	itemNonStockClassificationCode: any; 
    purchaseUnitOfMeasureId: any;
    disabletypeSave: boolean;
    localNameCollection: any[];
    classnamecolle: any[]=[];
    localtypeCollection: any[];
    classificationtypecolle: any[]=[];
    disableClassdesc: boolean;
    className: string;
    itemTypeName: string;
    disableSavepartDescription: boolean;
    allGlInfo: any[];
    allitemNonStockclassificationInfo: any[];
    isEdit: boolean = false;
    itemMasterId: number;
    defaultCurrencyId: number;
    discDataList: any = [];
    isSpinnerVisible: boolean = true;


    /** item-master-non-stock ctor */
    constructor(private router: Router, private glAccountService: GlAccountService,public unitService: UnitOfMeasureService, private authService: AuthService, private modalService: NgbModal, public itemser: ItemMasterService, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public ataMainSer: AtaMainService, public currency: CurrencyService, public priority: PriorityService, public inteService: IntegrationService, public workFlowtService: ItemClassificationService, public itemservice: ItemGroupService, public proService: ProvisionService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService ,private _actRoute: ActivatedRoute, private commonService: CommonService, private datePipe: DatePipe) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        this.sourceAction = new ItemClassificationModel();
        this.sourceItem = new Itemgroup();
        this.sourceprovision = new Provision();
        this.sourceatamain = new ATAMain();
        // let selectedLink = 2;
        this.itemser.currentUrl = '/itemmastersmodule/itemmasterpages/app-item-master-non-stock';
        this.itemser.bredcrumbObj.next(this.itemser.currentUrl);//Bread Crumb
    }


	allglAccountInfo: any[];
    allCurrencyInfo: any[];
    localpriority: any[];
    priorityName: string;
    sourceintegratn: Integration;
    integrationName: string;
    localintegration: any[];
    allIntegrationInfo: Integration[];
    localatamain: any[];
    ataChapterName: string;
    localprovision: any[] = [];
    localgroup: any[] = [];
    itemGroupName: string;
    itemgroupservice: any;
    itemType: any;
    description: any;
    item_Name: any;
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createdDate: any = "";
    updatedDate: any = "";
    auditHisory: AuditHistory[];

    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;
    displayedColumns = ['itemclassificationId', 'itemNonStockClassificationCode', 'description', 'memo'];
    dataSource: MatTableDataSource<ItemClassificationModel>;
    allComapnies: MasterCompany[] = [];
    allitemgroupobjInfo: any[] = [];
    private isSaving: boolean;
    public sourceAction: any;
	descriptionbyPart: any[] = [];
    public sourceItem: Itemgroup;
	public sourceprovision: Provision;
    public sourcepriority: Priority;
    public sourceatamain: ATAMain;
    private bodyText: string;
    loadingIndicator: boolean;
    closeResult: string;
    selectedColumn: ItemClassificationModel[];
    title: string = "Create";
    id: number;
    errorMessage: any;
    Active: string = "Active";
    modal: NgbModalRef;
    itemName: string;
    filteredBrands: any[];
    sourceItemMaster: any = {};
    legalEntityId: number;
    public isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
    currentItemTypeId: number;

    ngOnInit(): void {
        this.itemgroup();
        this.CurrencyData();
        this.unitofmeasure();
        this.manufacturerdata();
		this.ptnumberlistdata();
        this.glList();
        this.itemNonStockclassification();
        this.getDefaultCurrency();
        this.getDiscountTableData();
        this.getItemTypeList();
        this.itemser.currentUrl = '/itemmastersmodule/itemmasterpages/app-item-master-non-stock';
        this.itemser.bredcrumbObj.next(this.itemser.currentUrl);
        this.itemMasterId = this._actRoute.snapshot.params['id'];
        if (this.itemMasterId !== undefined) {
            this.isEdit = true;
            this.getItemMasterDetailsById(this.itemMasterId);        
        }
    }

    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
	}

    getItemMasterDetailsById(id) {
        this.itemser.getItemMasterNonStockDataById(id).subscribe(res => {
            this.sourceItemMaster = {
                ...res,
                priceDate: res.priceDate ? new Date(res.priceDate) : '',
                partdescription: res.partDescription,
                unitCost: res.unitCost ? formatNumberAsGlobalSettingsModule(res.unitCost, 2) : '0.00',
                listPrice: res.listPrice ? formatNumberAsGlobalSettingsModule(res.listPrice, 2) : '0.00',
                itemNonStockClassificationId: this.getInactiveObjectOnEdit('value', res.itemNonStockClassificationId, this.allitemNonStockclassificationInfo, 'ItemClassification', 'ItemClassificationId', 'ItemClassificationCode'),
                itemGroupId: this.getInactiveObjectOnEdit('value', res.itemGroupId, this.allitemgroupobjInfo, 'ItemGroup', 'itemGroupId', 'ItemGroupCode'),
                manufacturerId: this.getInactiveObjectOnEdit('value', res.manufacturerId, this.allManufacturerInfo, 'Manufacturer', 'manufacturerId', 'name'),
                discountPurchasePercent: this.getInactiveObjectOnEdit('value', res.discountPurchasePercent, this.discDataList, 'Discount', 'DiscountId', 'DiscontValue'),
                glAccountId: this.getInactiveObjectOnEdit('value', res.glAccountId, this.allGlInfo, 'GLAccount', 'GLAccountId', 'AccountCode'),
                purchaseUnitOfMeasureId: this.getInactiveObjectOnEdit('value', res.purchaseUnitOfMeasureId, this.allUnitOfMeasureinfo, 'UnitOfMeasure', 'unitOfMeasureId', 'description'),
                currencyId: this.getInactiveObjectOnEdit('value', res.currencyId, this.allCurrencyInfo, 'Currency', 'CurrencyId', 'Code'),
            };
            if(this.sourceItemMaster.currencyId == null || this.sourceItemMaster.currencyId == undefined) {
                this.sourceItemMaster.currencyId = this.defaultCurrencyId;
            }
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        })
    }
    
    getInactiveObjectOnEdit(string, id, originalData, tableName, primaryColumn, description) {
        if(id) {
            if (originalData) {
                for (let i = 0; i < originalData.length; i++) {
                    if (originalData[i][string] == id) {
                        return id;
                    }
                }
            }
            let obj: any = {};
            this.commonService.smartDropDownGetObjectById(tableName, primaryColumn, description, primaryColumn, id,this.authService.currentUser.masterCompanyId).subscribe(res => {
            obj = res[0];
            if(tableName == 'ItemClassification') {
                this.allitemNonStockclassificationInfo = [...originalData, obj];
            }
            else if(tableName == 'ItemGroup') {
                this.allitemgroupobjInfo = [...originalData, obj];
            }
            else if(tableName == 'Manufacturer') {
                this.allManufacturerInfo = [...originalData, obj];
            }
            else if(tableName == 'Discount') {
                this.discDataList = [...originalData, obj];
            }
            else if(tableName == 'GLAccount') {
                this.allGlInfo = [...originalData, obj];
            }
            else if(tableName == 'UnitOfMeasure') {
                this.allUnitOfMeasureinfo = [...originalData, obj];
            }            
            else if(tableName == 'Currency') {
                this.allCurrencyInfo = [...originalData, obj];
            }
        });
        return id;
    } else {
            return null;
        }
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }


    public allWorkFlows: ItemClassificationModel[] = [];

    private glList() {
        this.commonService.getGlAccountList(this.currentUserMasterCompanyId).subscribe(res => {
            this.allGlInfo = res;
        });
    }

    getDefaultCurrency() {
        this.legalEntityId = 19;
        this.commonService.getDefaultCurrency(this.legalEntityId,this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.defaultCurrencyId = res.currencyId;
            this.sourceItemMaster.currencyId = res.currencyId;
        })
    }

    private manufacturerdata() {
        //this.commonService.smartDropDownWithStatusList('Manufacturer', 'manufacturerId', 'name', '', 1, 0).subscribe(res => {
        this.commonService.autoSuggestionSmartDropDownList('Manufacturer', 'manufacturerId', 'name','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {
            this.allManufacturerInfo= res;
        })
    }    

    async getDiscountTableData() {
        //await this.commonService.smartDropDownList('Discount', 'DiscountId', 'DiscontValue').subscribe(res => {
          await this.commonService.autoSuggestionSmartDropDownList('Discount', 'DiscountId', 'DiscontValue', '', '', 0, '0', this.currentUserMasterCompanyId).subscribe(res => {
            this.discDataList = res;
            this.discDataList.sort(function(a, b) {
                return parseFloat(a.label) - parseFloat(b.label);
            });
            for(let i = 0; i< this.discDataList.length; i++){
                if(this.discDataList[i].label == 0.00){
                    this.discDataList[i].value = 0;
                }
            }
        });
    }

    getItemTypeList() {
        //this.commonService.smartDropDownList('ItemType', 'ItemTypeId', 'Description').subscribe(res => {
        this.commonService.autoSuggestionSmartDropDownList('ItemType', 'ItemTypeId', 'Description','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {
            res.map(x => {
                if(x.label == 'Non-Stock') {
                    this.currentItemTypeId = x.value;
                }
            });
            if(!this.isEdit) {
                this.isSpinnerVisible = false;
            }
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    private ptnumberlistdata() {
        this.itemser.getActivePartListByItemType('nonstock',this.currentUserMasterCompanyId).subscribe(res => {
            this.allPartnumbersInfo = res;
        })
    }

    filterUnitOfMeasures(event) {

		this.localunit = [];
		if (this.allUnitOfMeasureinfo) {
			for (let i = 0; i < this.allUnitOfMeasureinfo.length; i++) {
				let unitName = this.allUnitOfMeasureinfo[i].description;
				if (unitName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.localunit.push(unitName);
				}
			}
		}
    }


    private CurrencyData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        //this.commonService.smartDropDownList('Currency', 'CurrencyId', 'Code').subscribe(
            this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(
            results => this.oncurrencySuccessful(results),
            error => {this.loadingIndicator=false;}
        );
    }


    private oncurrencySuccessful(getList: Currency[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allCurrencyInfo = getList;
    }
    
    private itemgroup() {
        //this.commonService.smartDropDownWithStatusList('ItemGroup', 'itemGroupId', 'description', 10, 1, 0).subscribe(res => {
            this.commonService.autoSuggestionSmartDropDownList('ItemGroup', 'itemGroupId', 'ItemGroupCode','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {
                this.allitemgroupobjInfo = res;           
        })
    }

	eventHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedActionName) {
				if (value == this.selectedActionName.toLowerCase()) {
					this.disableSavePartName = true;
				}
				else {
					this.disableSavePartName = false;
				}
			}

		}
    }

    saveItemNonStockclass() {

		this.isSaving = true;

		if (this.isEditMode == false) {
			this.sourceAction.createdBy = this.userName;
			this.sourceAction.updatedBy = this.userName;
			this.sourceAction.itemNonStockClassificationCode = this.itemName;
			this.sourceAction.description = this.className;
			this.sourceAction.itemType = this.itemTypeName;
			this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.itemser.newNonstockClass(this.sourceAction).subscribe(data => {
                this.itemNonStockclassification();
                this.sourceItemMaster.itemNonStockClassificationId = data.itemNonStockClassificationId;
			})
        }
	
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.itemNonStockClassificationCode = this.itemName;
			this.sourceAction.description = this.className;
			this.sourceAction.itemType = this.itemTypeName;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.itemser.updateNonstockClass(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error =>{this.isSpinnerVisible = false});
        }

        this.modal.close();
	}


	saveitemgroup() {

        this.isSaving = true;

        if (this.isEditMode == false) {
			this.sourceItem.createdBy = this.userName;
			this.sourceItem.updatedBy = this.userName;
			this.sourceItem.itemGroupCode = this.itemGroupName;
			this.sourceItem.masterCompanyId = this.currentUserMasterCompanyId;
			this.itemservice.newAction(this.sourceItem).subscribe(data => { this.itemgroup()})
        }
        else {

			this.sourceItem.updatedBy = this.userName;
			this.sourceItem.itemGroupCode = this.itemGroupName;
			this.sourceItem.masterCompanyId = this.currentUserMasterCompanyId;
			this.itemservice.updateAction(this.sourceItem).subscribe(
				response => this.saveCompleted(this.sourceItem),
                error =>{this.isSpinnerVisible = false});
        }

        this.modal.close();
    }

    private loadMasterCompanies() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.masterComapnyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error =>{this.isSpinnerVisible = false});
        

    }


    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    private refresh() {
        this.applyFilter(this.dataSource.filter);
    }

    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;

    }

    private onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
    }

    itemclassification(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;
		this.disabletypeSave = false;
		this.disableClassdesc = false;
		this.disableSaveItemClassficationCode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new ItemClassificationModel();
        this.sourceAction.isActive = true;
		this.itemName = "";
		this.className = "";
		this.itemTypeName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    priorty(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;

        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourcepriority = new Priority();
        this.sourceAction.isActive = true;
        this.priorityName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }


    atamai(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceatamain = new ATAMain();
        this.sourceAction.isActive = true;
        this.ataChapterName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    item(content) {
        this.disableSaveItemGroup = false;
        this.isEditMode = false;
        this.isDeleteMode = false;

        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceItem = new Itemgroup();
        this.sourceAction.isActive = true;
        this.itemGroupName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }


    provisionope(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceprovision = new Provision();
        this.sourceAction.isActive = true;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    integratn(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;

        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceintegratn = new Integration();
        this.sourceAction.isActive = true;
        this.integrationName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
       

    openDelete(content, row) {

        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openEdit(content, row) {
		this.disabletypeSave = false;
		this.disableClassdesc = false;
		this.disableSaveItemClassficationCode = false;
        this.isEditMode = true;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = row;
		this.itemName = this.sourceAction.itemNonStockClassificationCode;
		this.className = this.sourceAction.description;
		this.itemTypeName = this.sourceAction.itemType;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }


    openHist(content, row) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.sourceAction = row;
        this.isSaving = true;
        this.workFlowtService.historyAcion(this.sourceAction.itemClassificationId).subscribe(
            results => this.onHistoryLoadSuccessful(results[0], content),
            error => this.saveFailedHelper(error));
    }


	ItemHandler(event) {
        this.disableSaveItemClassficationCode = false;
		if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            for(let i=0; i < this.allitemNonStockclassificationInfo.length; i++) {
                if(this.allitemNonStockclassificationInfo[i].itemNonStockClassificationCode.toLowerCase() == value) {
                    this.disableSaveItemClassficationCode = true;
                    break;
                }else {
					this.disableSaveItemClassficationCode = false;
				}
            }
		}
    }


	ItemClassficationCode(event) {
        if (this.allitemNonStockclassificationInfo) {

            for (let i = 0; i < this.allitemNonStockclassificationInfo.length; i++) {
                if (event == this.allitemNonStockclassificationInfo[i].itemNonStockClassificationCode) {
                    this.sourceItemMaster.itemNonStockClassificationCode = this.allitemNonStockclassificationInfo[i].itemNonStockClassificationCode;
					this.disableSaveItemClassficationCode = true;

					this.selectedItemCode = event;
				}

			}
		}
    }


    partdescriptionId(event) {

		if (this.itemclaColl) {
            for (let i = 0; i < this.itemclaColl.length; i++) {

				if (event == this.itemclaColl[i][0].description) {
					this.sourceItemMaster.description = this.itemclaColl[i][0].description;
					this.disableSavepartDescription = true;
                    this.selectdescription = event;
                }
			}
		}
    }


	descriptionHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedActionName) {
				if (value == this.selectedActionName.toLowerCase()) {
					this.disableSavepartDescription = true;
				}
				else {
					this.disableSavepartDescription = false;
				}
			}
		}
    }


	filterdescription(event) {
        this.descriptionCollection = [];
		this.itemdescription = [];
		if (this.allPartnumbersInfo) {
			if (this.allPartnumbersInfo.length > 0) {

				for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
					let partDescription = this.allPartnumbersInfo[i].partDescription;
					if (partDescription) {
						this.descriptionCollection.push(partDescription);
					}
				}
			}
        }
        this.descriptionCollection = this.descriptionCollection.filter((el, i, a) => i === a.indexOf(el));
    }


	ItemGroupHandler(event) {
       
    }

	itemGroupCode(event) {
		
	}


	ManufacturerHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedManufacturer) {
				if (value == this.selectedManufacturer.toLowerCase()) {
					this.disableSaveManufacturer = true;

				}
				else {
					this.disableSaveManufacturer = false;

				}
			}

		}
    }


	Manufacturerdescription(event) {
		if (this.allManufacturerInfo) {

			for (let i = 0; i < this.allManufacturerInfo.length; i++) {
				if (event == this.allManufacturerInfo[i].name) {
					this.sourcemanufacturer.name = this.allManufacturerInfo[i].name;
					this.disableSaveManufacturer = true;

					this.selectedManufacturer = event;
				}

			}
		}
	}
    
	PurchaseUOMHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedPurchaseUOM) {
				if (value == this.selectedPurchaseUOM.toLowerCase()) {
					this.disableSavePurchaseUOM = true;
				}
				else {
					this.disableSavePurchaseUOM = false;

				}
			}

		}
    }


	PurchaseUOMdescription(event) {
		if (this.allUnitOfMeasureinfo) {
			for (let i = 0; i < this.allUnitOfMeasureinfo.length; i++) {
				if (event == this.allUnitOfMeasureinfo[i].description) {
					this.sourcemanufacturer.description = this.allUnitOfMeasureinfo[i].description;
					this.disableSavePurchaseUOM = true;

					this.selectedPurchaseUOM = event;
				}

			}
		}
    }


    filterItems(event) {
       
        this.localCollection = [];
        this.itemclaColl = [];
        if (this.allitemNonStockclassificationInfo) {
            for (let i = 0; i < this.allitemNonStockclassificationInfo.length; i++) {
                let itemName = this.allitemNonStockclassificationInfo[i].itemNonStockClassificationCode;
				if (itemName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.itemclaColl.push([{
                        "itemNonStockClassificationId": this.allitemNonStockclassificationInfo[i].itemNonStockClassificationId,
						"itemName": itemName
					}]),

						this.localCollection.push(itemName);
				}
			}
		}
	}

	

    filterItemgroups(event) {

    }
    

    filterintegrations(event) {

		this.localintegration = [];
		if (this.allIntegrationInfo) {
			for (let i = 0; i < this.allIntegrationInfo.length; i++) {
				let integrationName = this.allIntegrationInfo[i].description;
				if (integrationName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.localintegration.push(integrationName);
				}
			}
		}
    }


    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceAction.isActive == false;
            this.workFlowtService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error =>{this.isSpinnerVisible = false});
        }
        else {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceAction.isActive == true;
            this.workFlowtService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error =>{this.isSpinnerVisible = false});
        }
    }


    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {

        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.auditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }


    private unitofmeasure() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        //this.commonService.smartDropDownWithStatusList('UnitOfMeasure', 'unitOfMeasureId', 'description', '', 1, 0).subscribe(res => {
        this.commonService.autoSuggestionSmartDropDownList('UnitOfMeasure', 'unitOfMeasureId', 'shortname','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {
            this.allUnitOfMeasureinfo = res;
        })
    }

    unitmeasure(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceUOM = new UnitOfMeasure();
        this.sourceUOM.isActive = true;
        this.unitName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }


    saveunitofmeasure() {
        this.isSaving = true;
        if (this.isEditMode == false) {
			this.sourceUOM.createdBy = this.userName;
			this.sourceUOM.updatedBy = this.userName;
			this.sourceUOM.description = this.unitName;
			this.sourceUOM.masterCompanyId = this.currentUserMasterCompanyId;
            this.unitService.newUnitOfMeasure(this.sourceUOM).subscribe(data => { this.unitofmeasure() })
        }
        else {

			this.sourceUOM.updatedBy = this.userName;
			this.sourceUOM.description = this.unitName;
			this.sourceUOM.masterCompanyId = this.currentUserMasterCompanyId;
            this.unitService.updateUnitOfMeasure(this.sourceUOM).subscribe(
                response => this.saveCompleted(this.itemgroup),
                error =>{this.isSpinnerVisible = false});
        }

         this.modal.close();
    }


    captureId(event) {
		if (this.itemclaColl) {
			for (let i = 0; i < this.itemclaColl.length; i++) {
				if (event == this.itemclaColl[i][0].itemName) {
					this.sourceItemMaster.itemClassificationId = this.itemclaColl[i][0].itemClassificationId;
				}
			}
        }
    }


    editItemAndCloseModel() {

        if ((this.sourceItemMaster.partNumber && this.sourceItemMaster.partdescription && this.sourceItemMaster.itemNonStockClassificationId && this.sourceItemMaster.purchaseUnitOfMeasureId && this.sourceItemMaster.glAccountId)) {

            this.isSaving = true;
            this.sourceItemMaster.createdBy = this.userName;
            this.sourceItemMaster.updatedBy = this.userName;
            this.sourceItemMaster.masterCompanyId = this.currentUserMasterCompanyId;
            this.sourceItemMaster.priceDate = this.sourceItemMaster.priceDate ? this.datePipe.transform(this.sourceItemMaster.priceDate, "MM/dd/yyyy") : null;
            this.sourceItemMaster.unitCost = this.sourceItemMaster.unitCost ? parseFloat(this.sourceItemMaster.unitCost.toString().replace(/\,/g, '')) : 0;
            this.sourceItemMaster.listPrice = this.sourceItemMaster.listPrice ? parseFloat(this.sourceItemMaster.listPrice.toString().replace(/\,/g, '')) : 0;
            this.sourceItemMaster.itemGroupId === undefined || this.sourceItemMaster.itemGroupId === null || this.sourceItemMaster.itemGroupId === '' ? this.sourceItemMaster.itemGroupId = 0 : this.sourceItemMaster.itemGroupId;
            this.sourceItemMaster.discountPurchasePercent = this.sourceItemMaster.discountPurchasePercent ? parseFloat(this.sourceItemMaster.discountPurchasePercent.toString().replace(/\,/g, '')) : 0;
			if (!this.isEdit) {
				this.sourceItemMaster.isActive = true;				
				this.sourceItemMaster.itemNonStockClassificationCode = this.itemName;				
                //this.sourceItemMaster.itemTypeId = this.currentItemTypeId;
                this.sourceItemMaster.itemTypeId = 2;
                this.itemser.saveItemMasterNonStock(this.sourceItemMaster).subscribe(data => {
					this.collectionofItemMaster = data;
					this.itemser.listStock = true;
					this.itemser.listNonstock = false;
					this.itemser.listEquipment = false;
					this.savesuccessCompleted(this.sourceItemMaster);
                    this.router.navigate(['/itemmastersmodule/itemmasterpages/app-item-master-list'], { queryParams: { type: '2' } });
				})
			}
			else {

                //this.sourceItemMaster.itemTypeId = this.currentItemTypeId;
                this.sourceItemMaster.itemTypeId = 2
				this.sourceItemMaster.itemNonStockClassificationCode = this.itemName;                        
				this.itemser.updateNonStockItemMaster(this.sourceItemMaster).subscribe(
					response => {
                        this.alertService.showMessage("Success", `Action was updated successfully`, MessageSeverity.success);
                        this.router.navigate(['/itemmastersmodule/itemmasterpages/app-item-master-list'], { queryParams: { type: '2' } });
                    },
					error =>{this.isSpinnerVisible = false});
			}
		}      
    }


    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.workFlowtService.deleteAcion(this.sourceAction.itemClassificationId).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error =>{this.isSpinnerVisible = false});
        this.modal.close();
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    private saveCompleted(user?: any) {
        this.isSaving = false;

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);

        }

    }


    openView(content, row) {

        this.sourceAction = row;
        this.item_Name = row.itemNonStockClassificationCode;
        this.description = row.description;
        this.itemType = row.itemType;
        this.memo = row.memo;
        this.createdBy = row.createdBy;
        this.updatedBy = row.updatedBy;
        this.createdDate = row.createdDate;
        this.updatedDate = row.updatedDate;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }


    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    

	private savesuccessCompleted(user?: any) {
		this.isSaving = false;
		this.alertService.showMessage("Success", `Action was saved successfully`, MessageSeverity.success);
    }


    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }


    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }


    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }       
    }

    // Temporery Item Master Radiuo Route
   public stock() {
        this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-stock');
    }

    public nonStock() {
		this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-non-stock');

    }
    public equipment() {
        this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-equipment');
    }
    public exchange() {
        this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-exchange');
    }
    public loan() {
        this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-loan');
    }


    saveManufacturer() {
		this.isSaving = true;
		if (this.isEditMode == false) {
			this.sourcemanufacturer.masterCompanyId = this.currentUserMasterCompanyId;
			this.sourceAction.updatedBy = this.userName;
			this.sourceAction.description = this.integrationName;
			this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
			this.itemser.savemanufacutrer(this.sourcemanufacturer).subscribe(data => { this.manufacturerdata() })

		}
		else {

			this.sourceAction.updatedBy = this.userName;
			this.sourceAction.description = this.integrationName;
			this.inteService.updateAction(this.sourcemanufacturer).subscribe(
				response => this.saveCompleted(this.sourceAction),
				error =>{this.isSpinnerVisible = false});
		}

		this.modal.close();
	}
    

	
    filtermanufacturer(event) {

        this.localmanufacturer = [];
        for (let i = 0; i < this.allManufacturerInfo.length; i++) {
            let name = this.allManufacturerInfo[i].name;
            if (name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localmanufacturer.push(name);
            }
        }
    }


    Mfacturer(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction.isActive = true;
        this.name = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    partnmId(event) {
        for (let i = 0; i < this.itemclaColl.length; i++) {
            if (event == this.itemclaColl[i][0].partName) {
				this.sourceItemMaster.partId = this.itemclaColl[i][0].partId;
				this.disableSavePartName = true;
			
				this.selectedActionName = event;
            }
		}
		this.itemser.getDescriptionbypart(event).subscribe(
			results => this.onpartnumberloadsuccessfull(results[0]),
            error =>{this.isSpinnerVisible = false}
            );
		
		this.disableSavepartDescription = true;
    }


	private onpartnumberloadsuccessfull(allWorkFlows: any[]) {


		this.descriptionbyPart = allWorkFlows[0]
		this.sourceActions = this.descriptionbyPart;
		this.sourceItemMaster.partdescription = allWorkFlows[0].partDescription;
    }

    filterpartItems(event) {
        this.partCollection = [];
		this.itemclaColl = [];
		if (this.allPartnumbersInfo) {
			for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
				let partName = this.allPartnumbersInfo[i].partNumber;
				if (partName) {
					if (partName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
						this.itemclaColl.push([{
							"partId": this.allPartnumbersInfo[i].partId,
							"partName": partName
						}]),

							this.partCollection.push(partName);
					}
				}
			}
        }
    }

    // arrayItemMasterlist:any[] = [];
    // filterpartItems(event) {
    //     if(this.arrayItemMasterlist.length == 0) {			
    //         this.arrayItemMasterlist.push(0); }
    //     this.commonService.autoSuggestionSmartDropDownList('MasterParts', 'MasterPartId', 'PartNumber', event.query, false, 20, this.arrayItemMasterlist.join(),this.currentUserMasterCompanyId).subscribe(res => {
    //         this.itemclaColl = [];
    //         this.partCollection = [];
    //         for (let i = 0; i < res.length; i++) {
    //             this.partCollection.push(res[i].label);
    //             this.itemclaColl.push(res[i].label);
    //         };
    //     });
    // }


	classificationId(event) {
        if (this.allitemNonStockclassificationInfo) {
            for (let i = 0; i < this.allitemNonStockclassificationInfo.length; i++) {
                if (event == this.allitemNonStockclassificationInfo[i].description) {
					this.disableClassdesc = true;
					this.selectedActionName = event;
				}
			}
		}
    }


	classificationtypeId(event) {
        if (this.allitemNonStockclassificationInfo) {
            for (let i = 0; i < this.allitemNonStockclassificationInfo.length; i++) {
                if (event == this.allitemNonStockclassificationInfo[i].itemType) {
					this.disabletypeSave = true;
					this.selectedActionName = event;
				}
			}
		}
    }


	filterItemNames(event) {

		this.localNameCollection = [];
        if (this.allitemNonStockclassificationInfo) {
            for (let i = 0; i < this.allitemNonStockclassificationInfo.length; i++) {
                let className = this.allitemNonStockclassificationInfo[i].description;
				if (className.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.classnamecolle.push([{
                        "itemNonStockClassificationId": this.allitemNonStockclassificationInfo[i].itemNonStockClassificationId,
						"className": className
					}]),
						this.localNameCollection.push(className);
				}
			}
		}
    }


	filterItemtypes(event) {

		this.localtypeCollection = [];
        if (this.allitemNonStockclassificationInfo) {
            for (let i = 0; i < this.allitemNonStockclassificationInfo.length; i++) {
                let itemTypeName = this.allitemNonStockclassificationInfo[i].itemType;
				if (itemTypeName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
					this.classificationtypecolle.push([{
                        "itemNonStockClassificationId": this.allitemNonStockclassificationInfo[i].itemNonStockClassificationId,
						"itemTypeName": itemTypeName
					}]),
						this.localtypeCollection.push(itemTypeName);
				}
			}
		}
    }


	classeventHandler(event) {
        this.disableClassdesc = false;
        let value = event.target.value.toLowerCase();
        for(let i=0; i < this.allitemNonStockclassificationInfo.length; i++) {
            if(this.allitemNonStockclassificationInfo[i].description.toLowerCase() == value) {
                this.disableClassdesc = true;
                break;
            }else {
                this.disableClassdesc = false;
            }
        }
    }


	classeventtypeHandler(event) {
        this.disabletypeSave = false;
        let value = event.target.value.toLowerCase();
        for(let i=0; i < this.allitemNonStockclassificationInfo.length; i++) {
            if(this.allitemNonStockclassificationInfo[i].itemType.toLowerCase() == value) {
                this.disabletypeSave = true;
                break;
            }else {
                this.disabletypeSave = false;
            }
        }
    }

    private itemNonStockclassification() {
        this.itemser.getItemMasterClassificationByType('nonstock', this.currentUserMasterCompanyId).subscribe(res => {
            this.allitemNonStockclassificationInfo = res;
         })
    }

    onClearPN() {
        this.sourceItemMaster.partNumber = undefined;
    }
    onClearPNDesc() {
        this.sourceItemMaster.partdescription = undefined;
    }
    onChangeUnitCost() {
        this.sourceItemMaster.unitCost = this.sourceItemMaster.unitCost ? formatNumberAsGlobalSettingsModule(this.sourceItemMaster.unitCost, 2) : '0.00';
    }
    onChangeListPrice() {
        this.sourceItemMaster.listPrice = this.sourceItemMaster.listPrice ? formatNumberAsGlobalSettingsModule(this.sourceItemMaster.listPrice, 2) : '0.00';
    }
}