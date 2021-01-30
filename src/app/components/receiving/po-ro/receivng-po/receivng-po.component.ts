import { Component, OnInit } from '@angular/core';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { CreditTermsService } from '../../../../services/Credit Terms.service';
import { VendorService } from '../../../../services/vendor.service';
import { PriorityService } from '../../../../services/priority.service';
import { ConditionService } from '../../../../services/condition.service';
import { UnitOfMeasureService } from '../../../../services/unitofmeasure.service';
import { CurrencyService } from '../../../../services/currency.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router'
import { EmployeeService } from '../../../../services/employee.service';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { CustomerService } from '../../../../services/customer.service';
import { SiteService } from '../../../../services/site.service';
import { WarehouseService } from '../../../../services/warehouse.service';
import { Site } from '../../../../models/site.model';
import { BinService } from '../../../../services/bin.service';
import { ManufacturerService } from '../../../../services/manufacturer.service';
import { StocklineService } from '../../../../services/stockline.service';
import { ReceivingService } from '../../../../services/receiving/receiving.service';
import { PurchaseOrder, PurchaseOrderPart, StockLine, StockLineDraft, DropDownData, TimeLife, ReceiveParts, TimeLifeDraft } from './PurchaseOrder.model';
import { ManagementStructure } from './managementstructure.model';
import { Dropdown } from 'primeng/dropdown';
import { AccountService } from '../../../../services/account.service';
import { CompanyService } from '../../../../services/company.service';
import { ConvertActionBindingResult } from '@angular/compiler/src/compiler_util/expression_converter';
import { AddressModel } from '../../../../models/address.model';
import { Warehouse } from '../../../../models/warehouse.model';
import { Bin } from '../../../../models/bin.model';
import { Shelf } from '../../../../models/shelf.model';
import { error } from '@angular/compiler/src/util';
import { Customer } from '../../../../models/customer.model';
import { GlAccountService } from '../../../../services/glAccount/glAccount.service';
import { ShippingService } from '../../../../services/shipping/shipping-service';
import { TagTypeService } from '../../../../services/tagtype.service';
import { getValueFromObjectByKey, getValueFromArrayOfObjectById, formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { CommonService } from '../../../../services/common.service';
import { LocalStoreManager } from '../../../../services/local-store-manager.service';
import { DBkeys } from '../../../../services/db-Keys';
import { AuthService } from '../../../../services/auth.service';
import { DatePipe } from '@angular/common';
import { PurchaseOrderService } from '../../../../services/purchase-order.service';


@Component({
    selector: 'app-receivng-po',
    templateUrl: './receivng-po.component.html',
    styleUrls: ['./receivng-po.component.scss'],
    providers: [DatePipe]
})
/** purchase-setup component*/
export class ReceivngPoComponent implements OnInit {
    purchaseOrderData: PurchaseOrder;
    managementStructure: ManagementStructure[];
    poCompanyList: DropDownData[];
    poBusinessUnitList: DropDownData[];
    poDivisionList: DropDownData[];
    poDepartmentList: DropDownData[];
    poStatus: any[] = [];
    poSelectedCompanyId: number;
    poSelectedBusinessUnitId: number;
    poSelectedDivisionId: number;
    poSelectedDepartmentId: number;
    poPartManagementStructureList: string[];
    managementStructureHierarchy: ManagementStructure[][] = [];
    selectedManagementStructure: ManagementStructure[] = [];
    sites: any[];
    CustomerList: DropDownData[] = [];
    VendorList: DropDownData[] = [];
    CompanyList: DropDownData[] = [];
    ManufacturerList: DropDownData[] = [];
    ConditionList: DropDownData[] = [];
    GLAccountList: DropDownData[] = [];
    ShippingViaList: DropDownData[];
    TagTypeList: any = [];
    receiving_po_header: boolean = false;
    ConditionId: number = 0;
    allPartGLAccountId: number;
    quantityreceive: boolean = false;
    toggleIcon: boolean = false;
    currentSLIndex: number = 0;
    currentTLIndex: number = 0;
    currentSERIndex: number = 0;
    pageTitle: string = "Receive PO";
    isDisabledSNboxes: boolean = false;
    obtainfromcustomer: boolean = false;
    obtainfromother: boolean = false;
    obtainfromvendor: boolean = false;
    ownercustomer: boolean = false;
    ownerother: boolean = false;
    ownervendor: boolean = false;
    quantityreceivebtn: boolean = false;
    traceabletocustomer: boolean = false;
    traceabletoother: boolean = false;
    traceabletovendor: boolean = false;
    creditTermsList: any = [];
    poDataHeader: any;
    headerManagementStructure: any = {};
    disableParentSpace: boolean = false;
    legalEntityList: any = [];
    isSpinnerVisible: boolean = true;
    moduleListDropdown: any = [];
    headerMemo: any;
    headerNotes: any;
    /** po-approval ctor */
    arrayLegalEntitylsit: any[] = [];
    arraySitelist: any[] = [];
    arrayVendlsit:any[] = [];
    arrayComplist: any[] = [];
    arrayCustlist: any[] = [];
    arraymanufacturerlist: any[] = [];
    arrayConditionlist: any[] = [];
    arrayglaccountlist: any[] = [];
    arrayshipvialist: any[] = [];
    arraytagtypelist: any[] = [];
    constructor(public binservice: BinService,
        private purchaseOrderService: PurchaseOrderService,
        public manufacturerService: ManufacturerService,
        public legalEntityService: LegalEntityService,
        public receivingService: ReceivingService,
        public priorityService: PriorityService,
        public stocklineService: StocklineService,
        public siteService: SiteService,
        public warehouseService: WarehouseService,
        public vendorService: VendorService,
        public customerService: CustomerService,
        public companyService: CompanyService,
        private itemmaster: ItemMasterService,
        private modalService: NgbModal,
        private route: Router,
        public currencyService: CurrencyService,
        public unitofmeasureService: UnitOfMeasureService,
        public conditionService: ConditionService,
        public creditTermsService: CreditTermsService,
        public employeeService: EmployeeService,
        private alertService: AlertService,
        private accountService: AccountService,
        private glAccountService: GlAccountService,
        private shippingService: ShippingService,
        private _actRoute: ActivatedRoute,
        private tagTypeService: TagTypeService,
        private commonService: CommonService,
        private localStorage: LocalStoreManager,
        private authService: AuthService,
        private datePipe: DatePipe
    ) {
        this.getAllSite();
        this.getCustomers();
        this.getVendors();
        this.getCompanyList();
        this.getManufacturers();
        this.getConditionList();
        this.getAllGLAccount();
        this.getShippingVia();
        this.getTagType();
        this.getLegalEntity();
        this.loadModulesNamesForObtainOwnerTraceable();
        this.getStatus();
    }
    ngOnInit() {       
        this.receivingService.purchaseOrderId = this._actRoute.snapshot.queryParams['purchaseorderid'];
        this.getReceivingPOHeaderById(this.receivingService.purchaseOrderId);
        this.receivingService.getPurchaseOrderDataById(this.receivingService.purchaseOrderId).subscribe(
            results => {
                this.receivingService.purchaseOrder = results[0];
                this.loadPurchaseOrderData(results[0])
            },
            error => {
                return this.route.navigate(['/receivingmodule/receivingpages/app-purchase-order']);
            }
        );
        this.poStatus = [];
        this.quantityreceivebtn = false;
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    // getLegalEntity() {
    //     this.commonService.getLegalEntityList().subscribe(res => {
    //         this.legalEntityList = res;
    //     })
    // } 
    getLegalEntity(strText = '') {
        if (this.arrayLegalEntitylsit.length == 0) {
            this.arrayLegalEntitylsit.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name', strText, true, 20, this.arrayLegalEntitylsit.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.legalEntityList = res;
            // this.legalEntity = res;
            // this.legalEntityList_Forgrid = res;
            // this.legalEntityList_ForShipping = res;
            // this.legalEntityList_ForBilling= res;
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    loadModulesNamesForObtainOwnerTraceable() {
        this.commonService.getModuleListForObtainOwnerTraceable().subscribe(res => {
            this.moduleListDropdown = res;
        })
    }

    getReceivingPOHeaderById(id) {       
        this.purchaseOrderService.getPOViewById(id).subscribe(
            res => {
                this.poDataHeader = res;
                this.poDataHeader.purchaseOrderNumber = this.poDataHeader.purchaseOrderNumber;
                this.poDataHeader.openDate = this.poDataHeader.openDate ? new Date(this.poDataHeader.openDate) : '';
                this.poDataHeader.closedDate = this.poDataHeader.closedDate ? new Date(this.poDataHeader.closedDate) : '';
                this.poDataHeader.dateApproved = this.poDataHeader.dateApproved ? new Date(this.poDataHeader.dateApproved) : '';
                this.poDataHeader.needByDate = this.poDataHeader.needByDate ? new Date(this.poDataHeader.needByDate) : '';
            });
    }
    private getItemMasterById(type: string, part: PurchaseOrderPart) {
        this.itemmaster.getItemMasterByItemMasterId(part.itemMaster.itemMasterId).subscribe(
            result => {
                if (result != undefined && result[0] != undefined) {
                    if (type == 'serialized') {
                        part.itemMaster.isSerialized = result[0].isSerialized;
                        part.serialNumber = '';
                    }
                    else {
                        part.itemMaster.isTimeLife = result[0].isTimeLife;
                        part.timeLifeList = [];

                        for (var i = 0; i < part.stocklineListObj.length; i++) {
                            let timeLife: TimeLifeDraft = new TimeLifeDraft();
                            timeLife.timeLifeDraftCyclesId = 0;
                            timeLife.purchaseOrderId = part.purchaseOrderId;
                            timeLife.purchaseOrderPartRecordId = part.purchaseOrderPartRecordId;
                            timeLife.cyclesRemainingHrs = null;
                            timeLife.cyclesRemainingMin = null;
                            timeLife.cyclesSinceInspectionHrs = null;
                            timeLife.cyclesSinceInspectionMin = null;
                            timeLife.cyclesSinceNewHrs = null;
                            timeLife.cyclesSinceNewMin = null;
                            timeLife.cyclesSinceOVHHrs = null;
                            timeLife.cyclesSinceOVHMin = null;
                            timeLife.cyclesSinceRepairHrs = null;
                            timeLife.cyclesSinceRepairMin = null;
                            timeLife.timeRemainingHrs = null;
                            timeLife.timeRemainingMin = null;
                            timeLife.timeSinceInspectionHrs = null;
                            timeLife.timeSinceInspectionMin = null;
                            timeLife.timeSinceNewHrs = null;
                            timeLife.timeSinceNewMin = null;
                            timeLife.timeSinceOVHHrs = null;
                            timeLife.timeSinceOVHMin = null;
                            timeLife.timeSinceRepairHrs = null;
                            timeLife.timeSinceRepairMin = null;
                            timeLife.lastSinceNewHrs = null;
                            timeLife.lastSinceNewMin = null;
                            timeLife.lastSinceInspectionHrs = null;
                            timeLife.lastSinceInspectionMin = null;
                            timeLife.lastSinceOVHHrs = null;
                            timeLife.lastSinceOVHMin = null;
                            timeLife.detailsNotProvided = false;
                            part.timeLifeList.push(timeLife);
                        }
                    }
                }

                if (type == 'serialized' && !result[0].isSerialized) {
                    this.alertService.showMessage(this.pageTitle, 'Serialized is not enabled', MessageSeverity.info);
                }
                if (type == 'timelife' && !result[0].isTimeLife) {
                    this.alertService.showMessage(this.pageTitle, 'Time Life is not enabled', MessageSeverity.info);
                }
            }
        )
    }

    // private getShippingVia(): void {
    //     this.commonService.smartDropDownList('ShippingVia', 'ShippingViaId', 'Name').subscribe(results => {
    //         this.ShippingViaList = [];
    //         for (let shippingVia of results) {
    //             var dropdown = new DropDownData();
    //             dropdown.Key = shippingVia.value.toLocaleString();
    //             dropdown.Value = shippingVia.label;
    //             this.ShippingViaList.push(dropdown);
    //         }
    //     });
    // }

    getShippingVia(strText = '') {
        if (this.arrayshipvialist.length == 0) {
            this.arrayshipvialist.push(0);
        }       
        this.commonService.autoSuggestionSmartDropDownList('ShippingVia', 'ShippingViaId', 'Name', strText,
            true, 0, this.arrayshipvialist.join(), this.currentUserMasterCompanyId).subscribe(res => {
        const data= res.map(x => {
                    return {
                        Key:x.value,
                        Value: x.label
                    }
                });
        this.ShippingViaList = data;             
        })   
    }

    arrayPostatuslist: any[] = [];
    private getStatus() {
        if (this.arrayPostatuslist.length == 0) {
            this.arrayPostatuslist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('POStatus', 'POStatusId', 'Description', '',
            true, 0, this.arrayPostatuslist.join(), this.currentUserMasterCompanyId)
            .subscribe(res => {
                this.poStatus = res;
                this.poStatus = this.poStatus.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));        
                }
            );
    }

    private getStatusById(statusId: string) {
        if (statusId == null)
            return 'NA';            
    }

    private getUserTypeById(userTypeId: string) {
        if (userTypeId == null)
            return 'NA';
    }

    private getAddress(address: AddressModel): string {
        let addr: string = '';
        if (address != null) {
            if (address.line1)
                addr += address.line1 + ', ';
            if (address.line2)
                addr += address.line2 + ', ';
            if (address.line3)
                addr += address.line3 + ', ';
            if (address.city)
                addr += address.city + ', ';
            if (address.stateOrProvince)
                addr += address.stateOrProvince + ', ';
            if (address.postalCode)
                addr += address.postalCode + ', ';
            if (address.country)
                addr += address.country;
        }

        return addr;
    }
    

    private loadPurchaseOrderData(purchaseOrder: PurchaseOrder) {
        //if (this.receivingService.selectedPurchaseorderCollection != undefined) {
        //this.purchaseOrderData = this.receivingService.selectedPurchaseorderCollection;
        this.purchaseOrderData = purchaseOrder;
        // {
        //     ...purchaseOrder,
        //     creditLimit: getValueFromObjectByKey('creditLimit', purchaseOrder.vendor),
        //     terms: getValueFromObjectByKey('creditTermsId', purchaseOrder.vendor),
        //     priorityId: getValueFromObjectByKey('priorityId', purchaseOrder.purchaseOderPart[0].purchaseOrder),
        //     dateApproved: new Date(purchaseOrder.dateApproved).toLocaleDateString()
        // };
        // if (this.purchaseOrderData.terms) {
        //     this.purchaseOrderData.terms = getValueFromArrayOfObjectById('name', 'creditTermsId', this.purchaseOrderData.terms, this.creditTermsList)
        // }


        // this.getManagementStructure().subscribe(
        //     results => {
        //         this.managementStructureSuccess(this.purchaseOrderData.managementStructureId, results[0]);
        //this.purchaseOrderData.purchaseOderPart.forEach(part => {
          
        let parentPart: PurchaseOrderPart;
        var allParentParts = this.purchaseOrderData.purchaseOderPart.filter(x => x.isParent == true);
        for (let parent of allParentParts) {
            parent.currentSLIndex = 0;
            parent.currentTLIndex = 0;
            parent.currentSERIndex = 0;
            parent.isDisabledTLboxes = false;
            parent.quantityRejected = 0;
            var splitParts = this.purchaseOrderData.purchaseOderPart.filter(x => x.parentId == parent.purchaseOrderPartRecordId);

            if (splitParts.length > 0) {
                parent.hasChildren = true;
                parent.quantityOrdered = 0;
                for (let childPart of splitParts) {
                    parent.stockLineCount += childPart.stockLineCount;
                    parent.quantityRejected += childPart.quantityRejected != null ? childPart.quantityRejected : 0;
                    childPart.managementStructureId = parent.managementStructureId;
                    childPart.managementStructureName = parent.managementStructureName;
                    parent.quantityOrdered += childPart.quantityOrdered;
                }
            }
            else {
                parent.hasChildren = false;
            }
        }

        for (let part of this.purchaseOrderData.purchaseOderPart) {
            part.toggleIcon = false;
            part.stocklineListObj = [];
            part.timeLifeList = [];
            part.currentSLIndex = 0;
            part.currentTLIndex = 0;
            part.currentSERIndex = 0;
            part.isDisabledTLboxes = false;
            part.visible = false;
            part.showStockLineGrid = false;
            part.isSameDetailsForAllParts = false;
            let selectedOrgStruct: ManagementStructure[] = [];
            //part.conditionId = 0;
            part.eCCNAlreadyExist = part.itemMaster.exportECCN != null && part.itemMaster.exportECCN.length > 0;
            part.itarNumberExist = part.itemMaster.itarNumber != null && part.itemMaster.itarNumber.length > 0;
            if (part.isParent) {
                // this.getManagementStructureHierarchy(part.managementStructureId, null, selectedOrgStruct);
                selectedOrgStruct.reverse();
                part.managementStructureName = [];
                for (let mangStructure of selectedOrgStruct) {
                    part.managementStructureName.push(mangStructure.code);
                }
                parentPart = part;
            }
            else {
                part.addressText = this.getAddress(part.poPartSplitAddress);
                // if (part.poPartSplitUserTypeId == 1) {
                //     this.customerService.getCustomerdata(part.poPartSplitUserId).subscribe(
                //         result => {
                //             part.userName = result[0][0].name;
                //         },
                //         error => this.onDataLoadFailed(error)
                //     );
                // }
                part.userName = part.poPartSplitUser;
                part.userTypeName = part.poPartSplitUserTypeName;//this.getUserTypeById(part.poPartSplitUserTypeId.toLocaleString());
                part.statusText = part.status;//this.getStatusById(part.status);
                //part.managementStructureName = parentPart.managementStructureName;
            }
            //this.getManagementStructureCodesForPart(part);
        }
        this.purchaseOrderData.dateRequested = new Date(); //new Date(this.purchaseOrderData.dateRequested);
        this.purchaseOrderData.dateApprovied = new Date(this.purchaseOrderData.dateApprovied);
        this.purchaseOrderData.needByDate = new Date(); //new Date(this.purchaseOrderData.needByDate);
        this.isSpinnerVisible = false;
        //     },
        //     error => this.onDataLoadFailed(error)
        // );
        // var pPart: any = this.purchaseOrderData.purchaseOderPart;
        // this.purchaseOrderData.purchaseOderPart = pPart.map((x, index) => {
        //     this.getItemMasterDetails(x, index);
        // });
        console.log(this.purchaseOrderData);

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

    onAddNotes() {
        this.headerNotes = this.poDataHeader.notes;
    }
    onSaveNotes() {
        this.poDataHeader.notes = this.headerNotes;

    }

    onAddMemo() {
        this.headerMemo = this.poDataHeader.poMemo;
    }
    onSaveMemo() {
        this.poDataHeader.poMemo = this.headerMemo;
    }
    getManagementStructureCodesForPart(part) {
        part.managementStructureName = [];
        this.commonService.getManagementStructureCodes(part.managementStructureId).subscribe(res => {
            if (res.Level1) {
                part.managementStructureName.push(res.Level1);
            }
            if (res.Level2) {
                part.managementStructureName.push(res.Level2);
            }
            if (res.Level3) {
                part.managementStructureName.push(res.Level3);
            }
            if (res.Level4) {
                part.managementStructureName.push(res.Level4);
            }
        })
    }

    // getItemMasterDetails(obj, index) {
    //     const itemMaster = obj.itemMaster;
    //     obj.stocklineListObj = [];
    //     obj.stocklineListObj[index].siteId = itemMaster.siteId;
    //     return obj;
    // }

    private getManagementStructure() {
        return this.legalEntityService.getManagemententity();
    }

    private setStockLineManagementStructure(managementStructureId: number, stockLine: StockLineDraft) {
        let stockLineManagementStructureHierarchy: ManagementStructure[][] = [[]];
        let stockLineSelectedManagementStructureHierarchy: ManagementStructure[] = [];

        if (this.managementStructure != undefined && this.managementStructure.length > 0) {
            stockLine.CompanyList = [];
            stockLine.BusinessUnitList = [];
            stockLine.DivisionList = [];
            stockLine.DepartmentList = [];


            this.getManagementStructureHierarchy(managementStructureId, stockLineManagementStructureHierarchy, stockLineSelectedManagementStructureHierarchy);
            stockLineManagementStructureHierarchy.reverse();
            stockLineSelectedManagementStructureHierarchy.reverse();

            if (stockLineManagementStructureHierarchy[0] != undefined && stockLineManagementStructureHierarchy[0].length > 0) {
                stockLine.companyId = stockLineSelectedManagementStructureHierarchy[0].managementStructureId;
                stockLine.managementStructureEntityId = stockLine.companyId;
                for (let managementStruct of stockLineManagementStructureHierarchy[0]) {
                    var dropdown = new DropDownData();
                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                    dropdown.Value = managementStruct.code;
                    stockLine.CompanyList.push(dropdown);
                }
            }
            if (stockLineManagementStructureHierarchy[1] != undefined && stockLineManagementStructureHierarchy[1].length > 0) {
                stockLine.businessUnitId = stockLineSelectedManagementStructureHierarchy[1].managementStructureId;
                stockLine.managementStructureEntityId = stockLine.businessUnitId;
                for (let managementStruct of stockLineManagementStructureHierarchy[1]) {
                    var dropdown = new DropDownData();
                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                    dropdown.Value = managementStruct.code;
                    stockLine.BusinessUnitList.push(dropdown);
                }
            }
            if (stockLineManagementStructureHierarchy[2] != undefined && stockLineManagementStructureHierarchy[2].length > 0) {
                stockLine.divisionId = stockLineSelectedManagementStructureHierarchy[2].managementStructureId;
                stockLine.managementStructureEntityId = stockLine.divisionId;
                for (let managementStruct of stockLineManagementStructureHierarchy[2]) {
                    var dropdown = new DropDownData();
                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                    dropdown.Value = managementStruct.code;
                    stockLine.DivisionList.push(dropdown);
                }
            }
            if (stockLineManagementStructureHierarchy[3] != undefined && stockLineManagementStructureHierarchy[3].length > 0) {
                stockLine.departmentId = stockLineSelectedManagementStructureHierarchy[3].managementStructureId;
                stockLine.managementStructureEntityId = stockLine.departmentId;
                for (let managementStruct of stockLineManagementStructureHierarchy[3]) {
                    var dropdown = new DropDownData();
                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                    dropdown.Value = managementStruct.code;
                    stockLine.DepartmentList.push(dropdown);
                }
            }

        }
    }

    private managementStructureSuccess(managementStructureId: number, managementStructure: ManagementStructure[]) {

        this.alertService.stopLoadingMessage();
        this.managementStructure = managementStructure;
        if (this.managementStructure != undefined && this.managementStructure.length > 0) {
            this.poCompanyList = [];
            this.poBusinessUnitList = [];
            this.poDivisionList = [];
            this.poDepartmentList = [];

            this.getManagementStructureHierarchy(managementStructureId, this.managementStructureHierarchy, this.selectedManagementStructure);
            this.managementStructureHierarchy.reverse();
            this.selectedManagementStructure.reverse();

            if (this.managementStructureHierarchy[0] != undefined && this.managementStructureHierarchy[0].length > 0) {
                this.poSelectedCompanyId = this.selectedManagementStructure[0].managementStructureId;
                for (let managementStruct of this.managementStructureHierarchy[0]) {
                    var dropdown = new DropDownData();
                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                    dropdown.Value = managementStruct.code;
                    this.poCompanyList.push(dropdown);
                }
            }
            if (this.managementStructureHierarchy[1] != undefined && this.managementStructureHierarchy[1].length > 0) {
                this.poSelectedBusinessUnitId = this.selectedManagementStructure[1].managementStructureId;
                for (let managementStruct of this.managementStructureHierarchy[1]) {
                    var dropdown = new DropDownData();
                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                    dropdown.Value = managementStruct.code;
                    this.poBusinessUnitList.push(dropdown);
                }
            }
            if (this.managementStructureHierarchy[2] != undefined && this.managementStructureHierarchy[2].length > 0) {
                this.poSelectedDivisionId = this.selectedManagementStructure[2].managementStructureId;
                for (let managementStruct of this.managementStructureHierarchy[2]) {
                    var dropdown = new DropDownData();
                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                    dropdown.Value = managementStruct.code;
                    this.poDivisionList.push(dropdown);
                }
            }
            if (this.managementStructureHierarchy[3] != undefined && this.managementStructureHierarchy[3].length > 0) {
                this.poSelectedDepartmentId = this.selectedManagementStructure[3].managementStructureId;
                for (let managementStruct of this.managementStructureHierarchy[3]) {
                    var dropdown = new DropDownData();
                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                    dropdown.Value = managementStruct.code;
                    this.poDepartmentList.push(dropdown);
                }
            }

        }
    }

    private getManagementStructureHierarchy(managementStructureId: number, managementStructureHierarchy: ManagementStructure[][], selectedManagementStructure: ManagementStructure[]) {

        var selectedManagementStructures = this.managementStructure.filter(function (management) {
            return management.managementStructureId == managementStructureId;
        });

        if (selectedManagementStructures != undefined && selectedManagementStructures.length > 0) {
            var selectedMangStruc = selectedManagementStructures[0];

            if (selectedMangStruc.parentId != null) {
                var selectedMSList = this.managementStructure.filter(function (management) {
                    return management.parentId == selectedMangStruc.parentId;
                });

                if (managementStructureHierarchy != null) {
                    managementStructureHierarchy.push(selectedMSList);
                }

                if (selectedManagementStructure != null) {
                    selectedManagementStructure.push(selectedMangStruc);
                }

                this.getManagementStructureHierarchy(selectedMangStruc.parentId, managementStructureHierarchy, selectedManagementStructure);
            }
            else {
                var selectedMSList = this.managementStructure.filter(function (management) {
                    return management.parentId == null;
                });

                if (managementStructureHierarchy != null) {
                    managementStructureHierarchy.push(selectedMSList);
                }

                if (selectedManagementStructure != null) {
                    selectedManagementStructure.push(selectedMangStruc);
                }
            }
        }
    }

    public showSplitShipmentParts(purchaseOrderPart: PurchaseOrderPart): void {
        var selectedParts: any = this.purchaseOrderData.purchaseOderPart.filter(function (part) {
            return part.purchaseOrderPartRecordId == purchaseOrderPart.purchaseOrderPartRecordId;
        });
   
        selectedParts.forEach(part => {
            part.toggleIcon = !part.toggleIcon;
            part.visible = !part.visible;
            // part.disableParentSpace = !part.disableParentSpace;
        });

        this.purchaseOrderData.purchaseOderPart.forEach(part => {   
            if(part.parentId == purchaseOrderPart.purchaseOrderPartRecordId) {        
            part.visible = !part.visible;
        }
        });        

        // this.selectedChildParts =  [...selectedParts.filter(x => {
        //     console.log(x.itemMasterId, purchaseOrderPart.itemMasterId);

        //     if(x.itemMasterId !== purchaseOrderPart.itemMasterId){
        //         return x;
        //     }
        // })]
        // this.selectedChildParts = [...this.selectedChildParts, ...selectedParts];

        const data = this.purchaseOrderData.purchaseOderPart;
        for (var i = 0; i < data.length; i++) {
            if (data[i].isParent == false && data[i].visible == true) {
                this.disableParentSpace = true;
                break;
            } else {
                this.disableParentSpace = false;
            }
            // if(data[i].isParent == false){
            //  data[i].visible == true ? this.disableParentSpace = true : this.disableParentSpace = false;
            //  console.log(this.disableParentSpace);             
            //  break;
            // }
        }
    }

    // selectedChild(partData){
    //     const data = partData;
    //     for(var i =0; i< data.length; i++){
    //         data.filter(x => {
    //             if(x.purchaseOrderPart)
    //         })
    //        this.arrForChild.push(data[i])
    //     }
    // }

    public isSplitShipmentPart(purchaseOrderPartRecordId: number): boolean {
        return this.purchaseOrderData.purchaseOderPart.filter(x => x.parentId == purchaseOrderPartRecordId).length > 0;
    }

    // private getAllPriority() {
    //     this.priorityService.getPriorityList().subscribe(
    //         results => {
    //             this.poPriorityInfo = [];
    //             for (let priority of results[0]) {
    //                 var dropdown = new DropDownData();
    //                 dropdown.Key = priority.priorityId.toLocaleString();
    //                 dropdown.Value = priority.description;
    //                 this.poPriorityInfo.push(dropdown);
    //             }
    //         },
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

    // private getAllCreditTerms() {
    //     this.creditTermsService.getCreditTermsList().subscribe(
    //         results => {
    //             this.creditTermsList = results[0].columnData;                
    //             this.poCreditTermInfo = [];
    //             for (let creditTerm of results[0]) {
    //                 var dropdown = new DropDownData();
    //                 dropdown.Key = creditTerm.creditTermsId.toLocaleString();
    //                 dropdown.Value = creditTerm.name;
    //                 this.poCreditTermInfo.push(dropdown);
    //             }
    //         },
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

    private onDataLoadFailed(error: any): void {
        console.log(error);
        this.alertService.stopLoadingMessage();
        this.isSpinnerVisible = false;
    }

    btnactive(event) {

    }

    public toggleStockLine(event: any, part: PurchaseOrderPart): void {

        // alert(part.quantityActuallyReceived);
        if (part.quantityActuallyReceived == undefined || part.quantityActuallyReceived == null) {
            this.quantityreceive = true;
        }
        else { this.quantityreceive = false; }
        if (part.showStockLineGrid) {
            this.addStockLine(part, false);
            return;
        }


        if (part.quantityActuallyReceived == undefined || part.quantityActuallyReceived == 0) {
            part.showStockLineGrid = false;
            this.alertService.showMessage(this.pageTitle, 'Please enter Quantity Received.', MessageSeverity.error);
            return;
        }

        let quantity: number = (part.quantityActuallyReceived != undefined || part.quantityActuallyReceived.toString()) != '' ? part.quantityActuallyReceived : 0;

        if ((part.itemMaster.isSerialized && part.stocklineListObj.length != quantity) ||
            (!part.itemMaster.isSerialized && part.stocklineListObj.length > 0 && part.stocklineListObj[0].quantity != quantity)) {

            part.stocklineListObj = []
            part.timeLifeList = [];
            part.isSameDetailsForAllParts = false;
            part.currentSLIndex = 0;
            part.currentTLIndex = 0;
            part.currentSERIndex = 0;
        }

        var POParts = this.purchaseOrderData.purchaseOderPart.filter(x =>
            x.itemMaster.partnumber == part.itemMaster.partnumber && x.itemMaster.isParent == false
        );

        if (POParts.length > 1) {
            if (quantity > part.quantityOrdered - part.stockLineCount) {
                this.alertService.showMessage(this.pageTitle, "Quantity receive can not be more than quantity ordered", MessageSeverity.error);
                return;
            }
        }
        else {
            if (quantity > part.quantityOrdered - part.stockLineCount) {
                this.alertService.showMessage(this.pageTitle, "Quantity receive can not be more than quantity ordered", MessageSeverity.error);
                return;
            }

        }

        part.visible = true;

        if (part.stocklineListObj.length != quantity) {
            this.createStockLineItems(part);

            if (part.itemMaster.isTimeLife) {
                for (var i = 0; i < quantity; i++) {
                    let timeLife: TimeLifeDraft = new TimeLifeDraft();
                    timeLife.timeLifeDraftCyclesId = 0;
                    timeLife.purchaseOrderId = part.purchaseOrderId;
                    timeLife.purchaseOrderPartRecordId = part.purchaseOrderPartRecordId;
                    timeLife.cyclesRemainingHrs = null;
                    timeLife.cyclesRemainingMin = null;
                    timeLife.cyclesSinceInspectionHrs = null;
                    timeLife.cyclesSinceInspectionMin = null;
                    timeLife.cyclesSinceNewHrs = null;
                    timeLife.cyclesSinceNewMin = null;
                    timeLife.cyclesSinceOVHHrs = null;
                    timeLife.cyclesSinceOVHMin = null;
                    timeLife.cyclesSinceRepairHrs = null;
                    timeLife.cyclesSinceRepairMin = null;
                    timeLife.timeRemainingHrs = null;
                    timeLife.timeRemainingMin = null;
                    timeLife.timeSinceInspectionHrs = null;
                    timeLife.timeSinceInspectionMin = null;
                    timeLife.timeSinceNewHrs = null;
                    timeLife.timeSinceNewMin = null;
                    timeLife.timeSinceOVHHrs = null;
                    timeLife.timeSinceOVHMin = null;
                    timeLife.timeSinceRepairHrs = null;
                    timeLife.timeSinceRepairMin = null;
                    timeLife.lastSinceNewHrs = null;
                    timeLife.lastSinceNewMin = null;
                    timeLife.lastSinceInspectionHrs = null;
                    timeLife.lastSinceInspectionMin = null;
                    timeLife.lastSinceOVHHrs = null;
                    timeLife.lastSinceOVHMin = null;
                    timeLife.detailsNotProvided = false;
                    part.timeLifeList.push(timeLife);
                }
            }
        }

        this.addStockLine(part, true);
        if (this.quantityreceive == true) {
            this.quantityreceivebtn = true;
        } else {
            this.quantityreceivebtn = false;
        }
        console.log(part);
    }


    addStockLine(part, visible?: boolean): void {
        const stockObj: any = part.stocklineListObj;
        part.stocklineListObj = stockObj.map(x => {
            return {
                ...x,
                // CompanyList: this.legalEntityList,
                // company: this.getManagementStructureOnEdit(part, x),
                siteId: this.getSiteDetailsOnEdit(part, x),
                // certifiedBy: 0,
                shippingViaId: part.shipViaId ? part.shipViaId.toLocaleString() : null,
                shippingAccount: part.shippingAccountInfo,
                purchaseOrderUnitCost: formatNumberAsGlobalSettingsModule(x.purchaseOrderUnitCost, 2),
                purchaseOrderExtendedCost: formatNumberAsGlobalSettingsModule(x.purchaseOrderExtendedCost, 2)
            }
        });
        for (let i = 0; i < part.stocklineListObj.length; i++) {
            part.stocklineListObj[i].CompanyList = this.legalEntityList;
            this.getManagementStructureOnEdit(part, part.stocklineListObj[i]);
        }
        console.log(part.stocklineListObj);
        if (visible == undefined) {
            part.showStockLineGrid = !part.showStockLineGrid;
        }
        else {
            part.showStockLineGrid = visible;
        }

        if (part.quantityActuallyReceived == null || part.quantityActuallyReceived == undefined || part.quantityActuallyReceived.toString() == '') {
            this.quantityreceive = false;
        }
        else {
            this.quantityreceive = true;
            this.quantityreceivebtn = false;
        }
        console.log(part);
    }

    getManagementStructureOnEdit(part, stock) {
        this.commonService.getManagementStructureDetails(part.managementStructureId).subscribe(res => {
            // this.getLegalEntity(stock);
            this.selectedLegalEntity(res.Level1, stock);
            this.selectedBusinessUnit(res.Level2, stock);
            this.selectedDivision(res.Level3, stock);
            this.selectedDepartment(res.Level4, stock);
            stock.companyId = res.Level1 !== undefined ? res.Level1.toString() : 0;
            stock.businessUnitId = res.Level2 !== undefined ? res.Level2.toString() : 0;
            stock.divisionId = res.Level3 !== undefined ? res.Level3.toString() : 0;
            stock.departmentId = res.Level4 !== undefined ? res.Level4.toString() : 0;
            return stock.companyId;
        })        
    }

    // async getLegalEntity(stockLine) {
    //     await this.commonService.getLegalEntityList().subscribe(res => {
    //         stockLine.CompanyList = res.map(x => {
    //             return {
    //                 Key: x.value.toString(),
    //                 Value: x.label,
    //             }
    //         });
    //     })
    // }

    selectedLegalEntity(legalEntityId, stockLine) {
        stockLine.BusinessUnitList = [];
        stockLine.DivisionList = [];
        stockLine.DepartmentList = [];
        stockLine.businessUnitId = 0;
        stockLine.divisionId = 0;
        stockLine.departmentId = 0;

        if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
            stockLine.managementStructureEntityId = legalEntityId;
            this.commonService.getBusinessUnitListByLegalEntityId(legalEntityId).subscribe(res => {
                stockLine.BusinessUnitList = res;
            });
        }
    }

    async selectedBusinessUnit(businessUnitId, stockLine) {
        stockLine.DivisionList = [];
        stockLine.DepartmentList = [];
        stockLine.divisionId = 0;
        stockLine.departmentId = 0;

        if (businessUnitId != 0 && businessUnitId != null && businessUnitId != undefined) {
            stockLine.managementStructureEntityId = businessUnitId;
            await this.commonService.getDivisionListByBU(businessUnitId).subscribe(res => {
                stockLine.DivisionList = res;
            })
        }
    }
    async selectedDivision(divisionUnitId, stockLine) {
        stockLine.DepartmentList = [];
        stockLine.departmentId = 0;

        if (divisionUnitId != 0 && divisionUnitId != null && divisionUnitId != undefined) {
            stockLine.managementStructureEntityId = divisionUnitId;
            await this.commonService.getDepartmentListByDivisionId(divisionUnitId).subscribe(res => {
                stockLine.DepartmentList = res;
            })
        }
    }
    selectedDepartment(departmentId, stockLine) {
        if (departmentId != 0 && departmentId != null && departmentId != undefined) {
            stockLine.managementStructureEntityId = departmentId;
        }
    }

    getSiteDetailsOnEdit(part, stock) {
        const itemMasterDetails = part.itemMaster;
        stock.siteId = itemMasterDetails.siteId ? itemMasterDetails.siteId.toLocaleString() : null;
        this.getStockLineWareHouse(stock);
        stock.warehouseId = itemMasterDetails.warehouseId ? itemMasterDetails.warehouseId.toLocaleString() : null;
        this.getStockLineLocation(stock);
        stock.locationId = itemMasterDetails.locationId ? itemMasterDetails.locationId.toLocaleString() : null;
        this.getStockLineShelf(stock);
        stock.shelfId = itemMasterDetails.shelfId ? itemMasterDetails.shelfId.toLocaleString() : null;
        this.getStockLineBin(stock);
        stock.binId = itemMasterDetails.binId ? itemMasterDetails.binId.toLocaleString() : null;
        return stock.siteId;
    }

    public paginatorFocusOut(event: any, part: PurchaseOrderPart): void {
        if (event.target.value == '') {
            if (!part.isSameDetailsForAllParts) {
                part.currentSLIndex = 0;
                part.currentSERIndex = 0;
            }

            part.currentTLIndex = 0;
            part.currentSERIndex = 0;
        }
    }

    createStockLineItems(part: PurchaseOrderPart): void {
        part.stocklineListObj = [];
        // part.isSameDetailsForAllParts = false;

        this.currentSLIndex = 0;

        // if (part.itemMaster.isSerialized) {
        for (var i = 0; i < part.quantityActuallyReceived; i++) {
            let stockLine: StockLineDraft = new StockLineDraft();
            // this.setStockLineManagementStructure(part.managementStructureId, stockLine);

            stockLine.purchaseOrderId = part.purchaseOrderId;
            stockLine.purchaseOrderPartRecordId = part.purchaseOrderPartRecordId;
            stockLine.itemMasterId = part.itemMaster.itemMasterId;
            stockLine.partNumber = part.itemMaster.partNumber;
            stockLine.quantity = part.quantityActuallyReceived; //1;
            stockLine.stockLineDraftId = 0;
            stockLine.createdDate = new Date();
            stockLine.manufacturerId = part.itemMaster.manufacturerId;
            stockLine.visible = false;
            stockLine.shippingReference = '';
            stockLine.shippingViaId = null;
            stockLine.shelfId = null;
            stockLine.warehouseId = null;
            stockLine.binId = null;
            stockLine.repairOrderId = null;
            stockLine.locationId = null;
            stockLine.shippingAccount = '';
            stockLine.conditionId = 0;
            stockLine.masterCompanyId = this.currentUserMasterCompanyId;
            stockLine.serialNumberNotProvided = false;
            stockLine.purchaseOrderUnitCost = 0;
            stockLine.purchaseOrderExtendedCost = part.unitCost;
            stockLine.currentDate = new Date();
            stockLine.obtainFromType = 2; // default is vendor and set the value from purchase order.
            stockLine.obtainFrom = this.purchaseOrderData.vendor.vendorId.toString();
            stockLine.ownerType = 2;
            stockLine.owner = this.purchaseOrderData.vendor.vendorId.toString();
            stockLine.obtainFromObject = this.VendorList.find(x => x.Key == this.purchaseOrderData.vendor.vendorId.toString());
            stockLine.ownerObject = this.VendorList.find(x => x.Key == this.purchaseOrderData.vendor.vendorId.toString());

            // if (this.purchaseOrderData.billToUserType == 1 || this.purchaseOrderData.billToUserType == 2) {
            // stockLine.ownerType = this.purchaseOrderData.billToUserType == 2 ? 3 : this.purchaseOrderData.billToUserType;
            // stockLine.owner = this.purchaseOrderData.billToUserId.toString();
            // stockLine.ownerObject = stockLine.ownerType == 1 ? this.CustomerList.find(x => x.Key == this.purchaseOrderData.billToUserId.toString()) : this.VendorList.find(x => x.Key == this.purchaseOrderData.billToUserId.toString());
            // }

            if (part.itemMaster != undefined) {
                stockLine.purchaseOrderUnitCost = part.unitCost;
                if (!part.itemMaster.isSerialized) {
                    stockLine.purchaseOrderExtendedCost = part.quantityActuallyReceived * part.unitCost;
                }
            }

            this.getStockLineSite(stockLine);
            part.stocklineListObj.push(stockLine);
        }

        // }
        // else {
        //     let stockLine: StockLineDraft = new StockLineDraft();
        //     this.setStockLineManagementStructure(part.managementStructureId, stockLine);
        //     stockLine.purchaseOrderId = part.purchaseOrderId;
        //     stockLine.purchaseOrderPartRecordId = part.purchaseOrderPartRecordId;
        //     stockLine.partNumber = part.itemMaster.partNumber;
        //     stockLine.itemMasterId = part.itemMaster.itemMasterId;
        //     stockLine.quantity = part.quantityActuallyReceived;
        //     stockLine.stockLineDraftId = 0;
        //     stockLine.createdDate = new Date();
        //     stockLine.manufacturerId = part.itemMaster.manufacturerId;
        //     stockLine.visible = false;
        //     stockLine.shippingReference = '';
        //     stockLine.shippingViaId = null;
        //     stockLine.shelfId = null;
        //     stockLine.warehouseId = null;
        //     stockLine.binId = null;
        //     stockLine.repairOrderId = null;
        //     stockLine.locationId = null;
        //     stockLine.shippingAccount = '';
        //     stockLine.conditionId = 0;
        //     stockLine.masterCompanyId = this.currentUserMasterCompanyId;
        //     stockLine.serialNumberNotProvided = false;
        //     stockLine.purchaseOrderUnitCost = 0;
        //     stockLine.purchaseOrderExtendedCost = part.unitCost;
        //     stockLine.currentDate = new Date();
        //     stockLine.obtainFromType = 3;
        //     stockLine.obtainFrom = this.purchaseOrderData.vendor.vendorId.toString();
        //     stockLine.obtainFromObject = this.VendorList.find(x => x.Key == this.purchaseOrderData.vendor.vendorId.toString());
        //     if (this.purchaseOrderData.billToUserType == 1 || this.purchaseOrderData.billToUserType == 2) {
        //         stockLine.ownerType = this.purchaseOrderData.billToUserType == 2 ? 3 : this.purchaseOrderData.billToUserType;
        //         stockLine.owner = this.purchaseOrderData.billToUserId.toString();
        //         stockLine.ownerObject = stockLine.ownerType == 1 ? this.CustomerList.find(x => x.Key == this.purchaseOrderData.billToUserId.toString())
        //             : this.VendorList.find(x => x.Key == this.purchaseOrderData.billToUserId.toString());
        //     }

        //     if (part.itemMaster != undefined) {
        //         stockLine.purchaseOrderUnitCost = part.unitCost;
        //         if (!part.itemMaster.isSerialized) {
        //             stockLine.purchaseOrderExtendedCost = part.quantityActuallyReceived * part.unitCost;
        //         }
        //     }

        //     this.getStockLineSite(stockLine);
        //     part.stocklineListObj.push(stockLine);
        // }
    }

    getManagementDetails(stockLine) {
        this.commonService.getLegalEntityList().subscribe(res => {
            stockLine.CompanyList = res;
            console.log(stockLine.CompanyList);
        });
    }

    public gotoStockLineMainPage(event: any, part: PurchaseOrderPart): void {
        let value = event.target.value;
        let index: number = 0;
        if (value == '') {
            return;
        }
        index = Number.parseInt(value) - 1;
        if (index < part.stocklineListObj.length && index >= 0) {
            if (!part.isSameDetailsForAllParts) {
                part.currentSLIndex = index;
                // part.currentSERIndex = index;
            }
            // part.currentTLIndex = index;
        }
        else {
            this.alertService.showMessage(this.pageTitle, "Invalid stock line page", MessageSeverity.error);
            event.target.value = "1";
            if (!part.isSameDetailsForAllParts) {
                part.currentSLIndex = 0;
                // part.currentSERIndex = 0;
            }
            // part.currentTLIndex = 0;
            // part.currentSERIndex = 0;
            return;
        }
    }

    public gotoStockLinePage(event: any, part: PurchaseOrderPart): void {
        let value = event.target.value;
        let index: number = 0;
        if (value == '') {
            return;
        }
        index = Number.parseInt(value) - 1;
        if (index < part.stocklineListObj.length && index >= 0) {
            if (!part.isSameDetailsForAllParts && part.itemMaster.isSerialized) {
                // part.currentSLIndex = index;
                part.currentSERIndex = index;
            }
            part.currentTLIndex = index;
        }
        else {
            this.alertService.showMessage(this.pageTitle, "Invalid stock line page", MessageSeverity.error);
            event.target.value = "1";
            if (!part.isSameDetailsForAllParts) {
                // part.currentSLIndex = 0;
                part.currentSERIndex = 0;
            }
            part.currentTLIndex = 0;
            part.currentSERIndex = 0;
            return;
        }
    }

    moveStockLineMainPage(type: string, index: number, part: PurchaseOrderPart): void {
        var count = type == 'stockline' ? part.stocklineListObj.length : part.timeLifeList.length;
        if (index >= 0 && index < count) {
            // if (part.itemMaster.isSerialized) {
            part.currentSLIndex = index;
            // }
            // part.currentSERIndex = index;
            // part.currentTLIndex = index;
        }
    }

    moveStockLinePage(type: string, index: number, part: PurchaseOrderPart): void {
        var count = type == 'stockline' ? part.stocklineListObj.length : part.timeLifeList.length;
        if (index >= 0 && index < count) {
            // if (part.itemMaster.isSerialized) {
            //     part.currentSLIndex = index;
            // }
            part.currentSERIndex = index;
            part.currentTLIndex = index;
        }
    }

    getStockLineCompanies(stockLine: StockLine): void {
        var companies = this.managementStructure.filter(function (management) {
            return management.parentId == null;
        });

        stockLine.CompanyList = [];
        stockLine.BusinessUnitList = [];
        stockLine.DivisionList = [];
        stockLine.DepartmentList = [];
        stockLine.companyId = 0;
        stockLine.businessUnitId = 0;
        stockLine.divisionId = 0;
        stockLine.departmentId = 0;

        for (let company of companies) {
            var dropdown = new DropDownData();
            dropdown.Key = company.managementStructureId.toLocaleString();
            dropdown.Value = company.code;
            stockLine.CompanyList.push(dropdown);
        }

    }

    getStockLineBusinessUnitList(stockLine: StockLine): void {
        stockLine.managementStructureEntityId = stockLine.companyId;
        var businessUnits = this.managementStructure.filter(function (management) {
            return management.parentId == stockLine.companyId;
        });

        stockLine.BusinessUnitList = [];
        stockLine.DivisionList = [];
        stockLine.DepartmentList = [];
        stockLine.businessUnitId = 0;
        stockLine.divisionId = 0;
        stockLine.departmentId = 0;

        for (let businessUnit of businessUnits) {
            var dropdown = new DropDownData();
            dropdown.Key = businessUnit.managementStructureId.toLocaleString();
            dropdown.Value = businessUnit.code;
            stockLine.BusinessUnitList.push(dropdown);
        }
    }

    getStockLineDivision(stockLine: StockLine): void {
        if (stockLine.businessUnitId != undefined && stockLine.businessUnitId > 0) {
            stockLine.managementStructureEntityId = stockLine.businessUnitId;
        }
        else {
            stockLine.managementStructureEntityId = stockLine.companyId;
        }

        var divisions = this.managementStructure.filter(function (management) {
            return management.parentId == stockLine.businessUnitId;
        });

        stockLine.DivisionList = [];
        stockLine.DepartmentList = [];
        stockLine.divisionId = 0;
        stockLine.departmentId = 0;
        for (let division of divisions) {
            var dropdown = new DropDownData();
            dropdown.Key = division.managementStructureId.toLocaleString();
            dropdown.Value = division.code;
            stockLine.DivisionList.push(dropdown);
        }
    }

    getStockLineDepartment(stockLine: StockLine): void {

        if (stockLine.divisionId != undefined && stockLine.divisionId > 0) {
            stockLine.managementStructureEntityId = stockLine.divisionId;
        }
        else {
            stockLine.managementStructureEntityId = stockLine.businessUnitId;
        }

        var departments = this.managementStructure.filter(function (management) {
            return management.parentId == stockLine.divisionId;
        });

        stockLine.DepartmentList = [];
        stockLine.departmentId = 0;
        for (let deparment of departments) {
            var dropdown = new DropDownData();
            dropdown.Key = deparment.managementStructureId.toLocaleString();
            dropdown.Value = deparment.code;
            stockLine.DepartmentList.push(dropdown);
        }
    }

    setStockLineDepartmentManagementStructureId(stockLine: StockLine) {
        if (stockLine.departmentId != undefined && stockLine.departmentId > 0) {
            stockLine.managementStructureEntityId = stockLine.departmentId;
        }
        else {
            stockLine.managementStructureEntityId = stockLine.divisionId;
        }
    }

    // getAllSite(): void {
    //     this.commonService.smartDropDownList('Site', 'SiteId', 'Name').subscribe(res => {
    //         this.sites = res;
    //     })
    //     // this.siteService.getSiteList().subscribe(
    //     //     results => {
    //     //         this.sites = results[0];
    //     //     },
    //     //     error => this.onDataLoadFailed(error)
    //     // );
    // }
    
    private getAllSite() {
		if (this.arraySitelist.length == 0) {
            this.arraySitelist.push(0); }
            this.commonService.autoSuggestionSmartDropDownList('Site','SiteId','Name','',true, 0,this.arraySitelist.join(),this.currentUserMasterCompanyId).subscribe(res => {
                this.sites = res;                
            });				
	}

    getStockLineSite(stockLine: StockLineDraft): void {
        stockLine.SiteList = [];
        stockLine.siteId = 0;
        stockLine.WareHouseList = [];
        stockLine.warehouseId = 0;
        stockLine.LocationList = [];
        stockLine.locationId = 0;
        stockLine.ShelfList = [];
        stockLine.shelfId = 0;
        stockLine.BinList = [];
        stockLine.binId = 0;

        for (let site of this.sites) {
            var dropdown = new DropDownData();
            dropdown.Key = site.value.toLocaleString();
            dropdown.Value = site.label;
            stockLine.SiteList.push(dropdown);
        }
    }

    getStockLineWareHouse(stockLine: StockLine): void {
        stockLine.WareHouseList = [];
        stockLine.warehouseId = 0;
        stockLine.LocationList = [];
        stockLine.locationId = 0;
        stockLine.ShelfList = [];
        stockLine.shelfId = 0;
        stockLine.BinList = [];
        stockLine.binId = 0;
        if (stockLine.siteId) {
            this.commonService.smartDropDownList('Warehouse', 'WarehouseId', 'Name', 'SiteId', stockLine.siteId).subscribe(
                results => {

                    
                    for (let wareHouse of results) {
                        var dropdown = new DropDownData();
                        dropdown.Key = wareHouse.value.toLocaleString();
                        dropdown.Value = wareHouse.label;
                        stockLine.WareHouseList.push(dropdown);
                    }
                }, //sending WareHouse
                error => this.onDataLoadFailed(error)
            );
        }

    }

    getStockLineLocation(stockLine: StockLine): void {
        stockLine.LocationList = [];
        stockLine.locationId = 0;
        stockLine.ShelfList = [];
        stockLine.shelfId = 0;
        stockLine.BinList = [];
        stockLine.binId = 0;
        if (stockLine.warehouseId) {
            this.commonService.smartDropDownList('Location', 'LocationId', 'Name', 'WarehouseId', stockLine.warehouseId).subscribe(
                results => {
                    
                    for (let loc of results) {
                        var dropdown = new DropDownData();
                        dropdown.Key = loc.value.toLocaleString();
                        dropdown.Value = loc.label;
                        stockLine.LocationList.push(dropdown);
                    }
                },
                error => this.onDataLoadFailed(error)
            );
        }
    }

    getStockLineShelf(stockLine: StockLine): void {
        stockLine.ShelfList = [];
        stockLine.shelfId = 0;
        stockLine.BinList = [];
        stockLine.binId = 0;
        if (stockLine.locationId) {
            this.commonService.smartDropDownList('Shelf', 'ShelfId', 'Name', 'LocationId', stockLine.locationId).subscribe(
                results => {
                    
                    for (let shelf of results) {
                        var dropdown = new DropDownData();
                        dropdown.Key = shelf.value.toLocaleString();
                        dropdown.Value = shelf.label;
                        stockLine.ShelfList.push(dropdown);
                    }
                },
                error => this.onDataLoadFailed(error)
            );
        }
    }

    getStockLineBin(stockLine: StockLine): void {
        stockLine.BinList = [];
        stockLine.binId = 0;
        if (stockLine.shelfId) {
            this.commonService.smartDropDownList('Bin', 'BinId', 'Name', 'ShelfId', stockLine.shelfId).subscribe(
                results => {
                    for (let bin of results) {
                        var dropdown = new DropDownData();
                        dropdown.Key = bin.value.toLocaleString();
                        dropdown.Value = bin.label;
                        stockLine.BinList.push(dropdown);
                    }
                },
                error => this.onDataLoadFailed(error)
            );
        }

    }

    // getCustomers(): void {
    //     //stockLine.CustomerList = [];
    //     this.commonService.smartDropDownList('Customer', 'CustomerId', 'Name').subscribe(
    //         results => {
    //             for (let customer of results) {
    //                 var dropdown = new DropDownData();
    //                 dropdown.Key = customer.value.toLocaleString();
    //                 dropdown.Value = customer.label;
    //                 this.CustomerList.push(dropdown);
    //             }
    //             console.log(this.CustomerList)
    //         },
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

    
    getCustomers(strText = '') {
        if (this.arrayCustlist.length == 0) {
            this.arrayCustlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', strText, true, 20, this.arrayCustlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            //this.CustomerList = response;
            for (let customer of response) {
                var dropdown = new DropDownData();
                dropdown.Key = customer.value.toLocaleString();
                dropdown.Value = customer.label
                this.CustomerList.push(dropdown);
            }
            // this.allCustomers = response;
            // this.customerNames = response;
            // this.splitcustomersList = response;
        }, err => {
            this.isSpinnerVisible = false;
        });
    }


    // getVendors(): void {
    //     //stockLine.VendorList = [];
    //     this.commonService.smartDropDownList('Vendor', 'VendorId', 'VendorName').subscribe(vendors => {
    //         for (let vendor of vendors) {
    //             var dropdown = new DropDownData();
    //             dropdown.Key = vendor.value.toLocaleString();
    //             dropdown.Value = vendor.label;
    //             this.VendorList.push(dropdown);
    //         }
    //         console.log(this.VendorList)
    //     },
    //         error => this.onDataLoadFailed(error)
    //     );       
    // }

    getVendors(filterVal = '') {
        if (this.arrayVendlsit.length == 0) {
            this.arrayVendlsit.push(0); }
		this.vendorService.getVendorNameCodeListwithFilter(filterVal,20,this.arrayVendlsit.join(),this.currentUserMasterCompanyId).subscribe(res => {			            
            const data = res.map(x => {
                return {
                    Key: x.vendorId,
                    Value: x.vendorName
                }
            });
            this.VendorList = data;            
		},err => {
			this.isSpinnerVisible = false;					
		});
    }
    
    filterVendorNames(event) {		
		if (event.query !== undefined && event.query !== null) {
		this.getVendors(event.query); }
	}	

    // getCompanyList() {
    //     this.commonService.smartDropDownList('LegalEntity', 'LegalEntityId', 'Name').subscribe(companies => {
    //         for (let company of companies) {
    //             var dropdown = new DropDownData();
    //             dropdown.Key = company.value.toLocaleString();
    //             dropdown.Value = company.label;
    //             this.CompanyList.push(dropdown);
    //         }
    // 	},
    //     error => this.onDataLoadFailed(error)
    //     );        
    // }

   
    getCompanyList(strText = '') {
        if (this.arrayComplist.length == 0) {
            this.arrayComplist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name', strText, true, 20, this.arrayComplist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            //this.CustomerList = response;
            for (let company of response) {
                var dropdown = new DropDownData();
                dropdown.Key = company.value.toLocaleString();
                dropdown.Value = company.label
                this.CompanyList.push(dropdown);
            }
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    // getManufacturers() {
    //     this.ManufacturerList = [];
    //     this.commonService.smartDropDownList('Manufacturer', 'ManufacturerId', 'Name').subscribe(
    //         results => {
    //             for (let manufacturer of results) {
    //                 var dropdown = new DropDownData();
    //                 dropdown.Key = manufacturer.value.toLocaleString();
    //                 dropdown.Value = manufacturer.label;
    //                 this.ManufacturerList.push(dropdown);
    //             }
    //         },
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

    
    getManufacturers(strText = '') {
        if (this.arraymanufacturerlist.length == 0) {
            this.arraymanufacturerlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Manufacturer', 'ManufacturerId', 'Name', strText, true, 20, this.arraymanufacturerlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            //this.CustomerList = response;
            for (let company of response) {
                var dropdown = new DropDownData();
                dropdown.Key = company.value.toLocaleString();
                dropdown.Value = company.label
                this.ManufacturerList.push(dropdown);
            }
            
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    onSerialNumberNotProvided(stockLine: StockLine) {
        stockLine.isDisabledSNboxes = !stockLine.isDisabledSNboxes;
        stockLine.serialNumber = '';
        stockLine.serialNumberNotProvided = !stockLine.serialNumberNotProvided;
    }

    onChangeTimeLife(part: PurchaseOrderPart) {
        // part.timeLifeList[part.currentTLIndex].detailsNotProvided = part.detailsNotProvided;
        part.timeLifeList[part.currentTLIndex].timeLifeDraftCyclesId = 0;
        part.timeLifeList[part.currentTLIndex].purchaseOrderId = part.purchaseOrderId;
        part.timeLifeList[part.currentTLIndex].purchaseOrderPartRecordId = part.purchaseOrderPartRecordId;
        part.timeLifeList[part.currentTLIndex].cyclesRemainingHrs = null;
        part.timeLifeList[part.currentTLIndex].cyclesRemainingMin = null;
        part.timeLifeList[part.currentTLIndex].cyclesSinceInspectionHrs = null;
        part.timeLifeList[part.currentTLIndex].cyclesSinceInspectionMin = null;
        part.timeLifeList[part.currentTLIndex].cyclesSinceNewHrs = null;
        part.timeLifeList[part.currentTLIndex].cyclesSinceNewMin = null;
        part.timeLifeList[part.currentTLIndex].cyclesSinceOVHHrs = null;
        part.timeLifeList[part.currentTLIndex].cyclesSinceOVHMin = null;
        part.timeLifeList[part.currentTLIndex].cyclesSinceRepairHrs = null;
        part.timeLifeList[part.currentTLIndex].cyclesSinceRepairMin = null;
        part.timeLifeList[part.currentTLIndex].timeRemainingHrs = null;
        part.timeLifeList[part.currentTLIndex].timeRemainingMin = null;
        part.timeLifeList[part.currentTLIndex].timeSinceInspectionHrs = null;
        part.timeLifeList[part.currentTLIndex].timeSinceInspectionMin = null;
        part.timeLifeList[part.currentTLIndex].timeSinceNewHrs = null;
        part.timeLifeList[part.currentTLIndex].timeSinceNewMin = null;
        part.timeLifeList[part.currentTLIndex].timeSinceOVHHrs = null;
        part.timeLifeList[part.currentTLIndex].timeSinceOVHMin = null;
        part.timeLifeList[part.currentTLIndex].timeSinceRepairHrs = null;
        part.timeLifeList[part.currentTLIndex].timeSinceRepairMin = null;
        part.timeLifeList[part.currentTLIndex].lastSinceNewHrs = null;
        part.timeLifeList[part.currentTLIndex].lastSinceNewMin = null;
        part.timeLifeList[part.currentTLIndex].lastSinceInspectionHrs = null;
        part.timeLifeList[part.currentTLIndex].lastSinceInspectionMin = null;
        part.timeLifeList[part.currentTLIndex].lastSinceOVHHrs = null;
        part.timeLifeList[part.currentTLIndex].lastSinceOVHMin = null;
    }

    onSubmitToReceive() {
        let errorMessages: string[] = this.validatePage();
        let msg = '';
        var index = 0;
        if (errorMessages.length > 0) {
            this.alertService.showMessage(this.pageTitle, errorMessages[0], MessageSeverity.error);
            return;
        }
        let partsToPost: ReceiveParts[] = this.extractAllAllStockLines();
        this.shippingService.receiveParts(partsToPost).subscribe(data => {
            this.alertService.showMessage(this.pageTitle, 'Parts Received successfully.', MessageSeverity.success);
            this.route.navigateByUrl(`/receivingmodule/receivingpages/app-edit-po?purchaseOrderId=${this.receivingService.purchaseOrderId}`);
            return;
            //this.route.navigate([`/receivingmodule/receivingpages/app-edit-po?purchaseOrderId=${this.receivingService.purchaseOrderId}`]);
        },
            error => {
                var message = '';
                if (error.error.constructor == Array) {
                    message = error.error[0].errorMessage;
                }
                else {
                    message = error.error.Message;
                }
                this.alertService.showMessage(this.pageTitle, message, MessageSeverity.error);
            }
        );

    }

    extractAllAllStockLines(): ReceiveParts[] {
        let receiveParts: ReceiveParts[] = [];

        let allParts: PurchaseOrderPart[] = this.purchaseOrderData.purchaseOderPart.filter(x => x.quantityActuallyReceived > 0);

        for (let part of allParts) {
            let receivePart: ReceiveParts = new ReceiveParts();
            receivePart.itemMasterId = part.itemMaster.itemMasterId;
            receivePart.isSerialized = part.itemMaster.isSerialized;
            receivePart.purchaseOrderPartRecordId = part.purchaseOrderPartRecordId;
            receivePart.stockLines = part.stocklineListObj;
            receivePart.quantityActuallyReceived = part.quantityActuallyReceived ? parseInt(part.quantityActuallyReceived.toString()) : null;
            receivePart.quantityRejected = part.quantityRejected;
            receivePart.isSameDetailsForAllParts = part.isSameDetailsForAllParts ? part.isSameDetailsForAllParts : false;
            // receivePart.timeLife = part.timeLifeList;;
            receivePart.timeLife = this.getTimeLife(part.timeLifeList, part.purchaseOrderPartRecordId);
            receiveParts.push(receivePart);
        }
        for (let part of allParts) {
            for (let sl of part.stocklineListObj) {
                sl.createdBy = this.userName;
                sl.updatedBy = this.userName;
                if (sl.tagType && sl.tagType.length > 0) {
                    for (let i = 0; i < sl.tagType.length; i++) {
                        sl.tagType[i] = getValueFromArrayOfObjectById('label', 'value', sl.tagType[i], this.TagTypeList);
                    }
                    sl.tagType = sl.tagType.join();
                } else {
                    sl.tagType = "";
                }
            }
            if (part.isSameDetailsForAllParts) {
                var stockLineToCopy = { ...part.stocklineListObj[part.currentSLIndex] };
                for (let slObj of part.stocklineListObj) {
                    slObj = stockLineToCopy;
                }
            }
        }
        return receiveParts;
    }

    getTimeLife(timeLife, purchaseOrderPartRecordId) {
        let tmLife = [];
        tmLife = timeLife.map(x => {
            return {
                cyclesRemaining: ((x.cyclesRemainingHrs ? x.cyclesRemainingHrs : '00') + ':' + (x.cyclesRemainingMin ? x.cyclesRemainingMin : '00')),
                timeRemaining: ((x.timeRemainingHrs ? x.timeRemainingHrs : '00') + ':' + (x.timeRemainingMin ? x.timeRemainingMin : '00')),
                cyclesSinceNew: ((x.cyclesSinceNewHrs ? x.cyclesSinceNewHrs : '00') + ':' + (x.cyclesSinceNewMin ? x.cyclesSinceNewMin : '00')),
                timeSinceNew: ((x.timeSinceNewHrs ? x.timeSinceNewHrs : '00') + ':' + (x.timeSinceNewMin ? x.timeSinceNewMin : '00')),
                lastSinceNew: ((x.lastSinceNewHrs ? x.lastSinceNewHrs : '00') + ':' + (x.lastSinceNewMin ? x.lastSinceNewMin : '00')),
                cyclesSinceOVH: ((x.cyclesSinceOVHHrs ? x.cyclesSinceOVHHrs : '00') + ':' + (x.cyclesSinceOVHMin ? x.cyclesSinceOVHMin : '00')),
                timeSinceOVH: ((x.timeSinceOVHHrs ? x.timeSinceOVHHrs : '00') + ':' + (x.timeSinceOVHMin ? x.timeSinceOVHMin : '00')),
                lastSinceOVH: ((x.lastSinceOVHHrs ? x.lastSinceOVHHrs : '00') + ':' + (x.lastSinceOVHMin ? x.lastSinceOVHMin : '00')),
                cyclesSinceInspection: ((x.cyclesSinceInspectionHrs ? x.cyclesSinceInspectionHrs : '00') + ':' + (x.cyclesSinceInspectionMin ? x.cyclesSinceInspectionMin : '00')),
                timeSinceInspection: ((x.timeSinceInspectionHrs ? x.timeSinceInspectionHrs : '00') + ':' + (x.timeSinceInspectionMin ? x.timeSinceInspectionMin : '00')),
                lastSinceInspection: ((x.lastSinceInspectionHrs ? x.lastSinceInspectionHrs : '00') + ':' + (x.lastSinceInspectionMin ? x.lastSinceInspectionMin : '00')),
                cyclesSinceRepair: ((x.cyclesSinceRepairHrs ? x.cyclesSinceRepairHrs : '00') + ':' + (x.cyclesSinceRepairMin ? x.cyclesSinceRepairMin : '00')),
                timeSinceRepair: ((x.timeSinceRepairHrs ? x.timeSinceRepairHrs : '00') + ':' + (x.timeSinceRepairMin ? x.timeSinceRepairMin : '00')),
                purchaseOrderPartRecordId: purchaseOrderPartRecordId,
            }
        })
        return tmLife;
    }

    validatePage() {
        let partsToFetch: PurchaseOrderPart[] = this.purchaseOrderData.purchaseOderPart.filter(x => x.quantityActuallyReceived > 0);
        let errorMessages: string[] = [];

        for (let item of partsToFetch) {
            if (item.itemMaster.glAccountId == 0) {
                errorMessages.push("Please select GL Account of Part No. " + item.itemMaster.partNumber);
            }
            if (item.conditionId == undefined || item.conditionId == 0) {
                errorMessages.push("Please select Condition of Part No. " + item.itemMaster.partNumber);
            }
            if (item.quantityRejected == undefined || (item.quantityRejected != undefined && item.quantityRejected.toString() == '')) {
                errorMessages.push("Please enter Quantity Rejected of Part No." + item.itemMaster.partNumber);
            }
            if (item.stocklineListObj == undefined || item.stocklineListObj.length == 0)
                errorMessages.push("No part received for Part No." + item.itemMaster.PartNumber);

            if (item.stocklineListObj == undefined || item.stocklineListObj.length == 0)
                errorMessages.push("No part received for shippingViaId" + item.itemMaster.shippingViaId);

            if (item.stocklineListObj == undefined || item.stocklineListObj.length == 0)
                errorMessages.push("No part received for shipping Reference" + item.itemMaster.shippingReference);

            var ofPartMsg = " of Part No. " + item.itemMaster.partNumber;
            if (item.stocklineListObj != undefined && item.stocklineListObj.length > 0) {
                for (var i = 0; i < item.stocklineListObj.length; i++) {
                    item.stocklineListObj[i].gLAccountId = item.itemMaster.glAccountId;
                    item.stocklineListObj[i].conditionId = item.conditionId;
                    item.stocklineListObj[i].quantityRejected = Number(item.quantityRejected);
                    item.stocklineListObj[i].isSerialized = item.itemMaster.isSerialized == undefined ? false : item.itemMaster.isSerialized;
                    item.stocklineListObj[i].isPMA = item.itemMaster.pma;
                    item.stocklineListObj[i].isDER = item.itemMaster.der;
                    item.stocklineListObj[i].purchaseOrderExtendedCost = item.stocklineListObj[i].purchaseOrderExtendedCost == undefined ||
                        item.stocklineListObj[i].purchaseOrderExtendedCost.toString() == '' ? 0 :
                        item.stocklineListObj[i].purchaseOrderExtendedCost;

                    if (item.stocklineListObj[i].purchaseOrderUnitCost == undefined || (item.stocklineListObj[i].purchaseOrderUnitCost != undefined && item.stocklineListObj[i].purchaseOrderUnitCost.toString() == '')) {
                        errorMessages.push("Please enter Unit Cost in Receiving Qty - " + (i + 1).toString() + ofPartMsg);
                    }

                    //item.stocklineListObj[i].oEM = item.itemMaster.oemPNId;

                    if (item.stocklineListObj[i].companyId == undefined || item.stocklineListObj[i].companyId == 0) {
                        errorMessages.push("Please select Company in Receiving Qty - " + (i + 1).toString() + ofPartMsg);
                    }

                    if (item.stocklineListObj[i].siteId == undefined || item.stocklineListObj[i].siteId == 0) {
                        errorMessages.push("Please select Site in Receiving Qty - " + (i + 1).toString() + ofPartMsg);
                    }


                    if (item.stocklineListObj[i].shippingViaId == undefined || item.stocklineListObj[i].shippingViaId == 0) {
                        errorMessages.push("Please select shipping Via in Receiving Qty - " + (i + 1).toString() + ofPartMsg);
                    }

                    if (item.stocklineListObj[i].shippingReference == undefined || item.stocklineListObj[i].shippingReference == '') {
                        errorMessages.push("Please select shipping Reference in Receiving Qty - " + (i + 1).toString() + ofPartMsg);
                    }


                    if (item.itemMaster.isSerialized == true) {
                        item.stocklineListObj[i].serialNumber = item.stocklineListObj[i].serialNumber != undefined ? item.stocklineListObj[i].serialNumber.trim() : '';
                        if (!item.stocklineListObj[i].serialNumberNotProvided && (item.stocklineListObj[i].serialNumber == undefined || item.stocklineListObj[i].serialNumber == '')) {
                            errorMessages.push("Please enter Serial Number in Receiving Qty - " + (i + 1).toString() + ofPartMsg);
                        }
                        if (!item.stocklineListObj[i].serialNumberNotProvided) {
                            for (var j = i + 1; j < item.stocklineListObj.length; j++) {
                                if (!item.stocklineListObj[i].serialNumberNotProvided && item.stocklineListObj[j].serialNumber == item.stocklineListObj[i].serialNumber) {
                                    errorMessages.push("Duplicate Serial Number is entered in Stock Line Page " + (i + 1).toString() + " and Page " + (j + 1).toString());
                                }
                            }
                        }
                    }
                }
            }

            if (item.timeLifeList != undefined && item.timeLifeList.length > 0) {
                // need to have some check to make sure atleast one field is entered.
                for (var i = 0; i < item.timeLifeList.length; i++) {
                    var timeLife = item.timeLifeList[i];
                    if (timeLife.detailsNotProvided != true) {
                        if (timeLife.cyclesRemainingHrs == null && timeLife.cyclesRemainingMin == null && timeLife.cyclesSinceNewHrs == null && timeLife.cyclesSinceNewMin == null && timeLife.cyclesSinceOVHHrs == null && timeLife.cyclesSinceOVHMin == null && timeLife.cyclesSinceInspectionHrs == null && timeLife.cyclesSinceInspectionMin == null && timeLife.cyclesSinceRepairHrs == null && timeLife.cyclesSinceRepairMin == null && timeLife.timeRemainingHrs == null && timeLife.timeRemainingMin == null && timeLife.timeSinceNewHrs == null && timeLife.timeSinceNewMin == null && timeLife.timeSinceOVHHrs == null && timeLife.timeSinceOVHMin == null && timeLife.timeSinceInspectionHrs == null && timeLife.timeSinceInspectionMin == null && timeLife.timeSinceRepairHrs == null && timeLife.timeSinceRepairMin == null && timeLife.lastSinceNewHrs == null && timeLife.lastSinceNewMin == null && timeLife.lastSinceOVHHrs == null && timeLife.lastSinceOVHMin == null && timeLife.lastSinceInspectionHrs == null && timeLife.lastSinceInspectionMin == null) {
                            errorMessages.push("Please enter atleast one field in Time Life Page - " + (i + 1).toString() + ofPartMsg);
                        }
                    }
                }
            }

        }
        return errorMessages;
    }

    onObtainFromChange(event, stockLine) {
        stockLine.obtainFrom = '';
        stockLine.obtainFromObject = {};

        if (event.target.value === '1') {
            this.obtainfromcustomer = true;
            this.obtainfromother = false;
            this.obtainfromvendor = false;
        }
        if (event.target.value === '2') {
            this.obtainfromother = true;
            this.obtainfromcustomer = false;
            this.obtainfromvendor = false;
        }
        if (event.target.value === '3') {
            this.obtainfromvendor = true;
            this.obtainfromcustomer = false;
            this.obtainfromother = false;
        }
    }

    onOwnerChange(event, stockLine) {
        stockLine.owner = '';
        stockLine.ownerObject = {};

        if (event.target.value === '1') {
            this.ownercustomer = true;
            this.ownerother = false;
            this.ownervendor = false;
        }
        if (event.target.value === '2') {
            this.ownerother = true;
            this.ownercustomer = false;
            this.ownervendor = false;
        }
        if (event.target.value === '3') {
            this.ownervendor = true;
            this.ownercustomer = false;
            this.ownerother = false;
        }
    }

    onTraceableToChange(event, stockLine) {
        stockLine.traceableTo = '';
        stockLine.traceableToObject = {};

        if (event.target.value === '1') {
            this.traceabletocustomer = true;
            this.traceabletoother = false;
            this.traceabletovendor = false;
        }
        if (event.target.value === '2') {
            this.traceabletoother = true;
            this.traceabletocustomer = false;
            this.traceabletovendor = false;
        }
        if (event.target.value === '3') {
            this.traceabletovendor = true;
            this.traceabletocustomer = false;
            this.traceabletoother = false;
        }
    }

    addPageCustomer() {
        this.route.navigateByUrl('/customersmodule/customerpages/app-customer-general-information');
    }

    onFilter(event, stockLine, type): void {
        stockLine.filteredRecords = [];
        // var dropdownSource = type == 1 ? this.CustomerList : this.VendorList;
        if (type == 1) {
            var dropdownSource = this.CustomerList;
        } else if (type == 2) {
            var dropdownSource = this.VendorList;
        } else if (type == 9) {
            var dropdownSource = this.CompanyList;
        }
        if (dropdownSource != undefined && dropdownSource.length > 0) {
            for (let row of dropdownSource) {
                if (row.Value != undefined && row.Value.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    stockLine.filteredRecords.push(row);
                }
            }
        }
    }

    onObtainSelect(stockLine: StockLine): void {
        stockLine.obtainFrom = stockLine.obtainFromObject.Key;
    }

    onOwnerSelect(stockLine: StockLine): void {
        stockLine.owner = stockLine.ownerObject.Key;
    }

    onTraceableToSelect(stockLine: StockLine): void {
        stockLine.traceableTo = stockLine.traceableToObject.Key;
    }

    // getConditionList(): void {
    //     this.commonService.smartDropDownList('Condition', 'ConditionId', 'Description').subscribe(
    //         results => {
    //             for (let condition of results) {
    //                 var dropdown = new DropDownData();
    //                 dropdown.Key = condition.value.toLocaleString();
    //                 dropdown.Value = condition.label;
    //                 this.ConditionList.push(dropdown);
    //             }
    //         },
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

    
    getConditionList() {
        if (this.arrayConditionlist.length == 0) {
            this.arrayConditionlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Condition', 'ConditionId', 'Description', '', true, 0, this.arrayConditionlist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            //this.ConditionList = res;
            for (let company of res) {
                var dropdown = new DropDownData();
                dropdown.Key = company.value.toLocaleString();
                dropdown.Value = company.label
                this.ConditionList.push(dropdown);
            }
            
            // this.ConditionList.map(x => {
            // 	if(x.label == 'New') {
            // 		this.defaultCondtionId = x.value;
            // 		this.newObjectForParent.conditionId = x.value;
            // 	}
            // });
            // if(this.stocklineReferenceData != null && this.stocklineReferenceData != undefined) {
            // 	for(let i = 0; i< this.allconditioninfo.length; i++){
            // 		if(this.allconditioninfo[i].value == this.stocklineReferenceData.conditionId){
            // 			this.newObjectForParent.conditionId = this.allconditioninfo[i].value;
            // 			this.newObjectForParent.itemMasterId = this.stocklineReferenceData.itemMasterId;
            // 			this.getPriceDetailsByCondId(this.newObjectForParent);
            // 		}
            // 	}
            // }       
        },
            err => {
                this.isSpinnerVisible = false;
            });
    }

    // getAllGLAccount(): void {
    //     this.commonService.getGlAccountList().subscribe(glAccountData => {
    //         for (let glAccount of glAccountData) {
    //             var dropdown = new DropDownData();
    //             dropdown.Key = glAccount.value.toLocaleString();
    //             dropdown.Value = glAccount.label;
    //             this.GLAccountList.push(dropdown);
    //         }
    //         console.log("glaccount")
    //         console.log(this.GLAccountList)
    //         console.log("glaccount")
    //     });
    // }

    getAllGLAccount(strText = '') {
        if (this.arrayglaccountlist.length == 0) {
            this.arrayglaccountlist.push(0);
        }       
        this.commonService.getAutoCompleteDropDownsByCodeWithName('GLAccount', 'GLAccountId', 'AccountName', 'AccountCode', strText, 20, this.arrayglaccountlist.join()).subscribe(res => {
        const data= res.map(x => {
                    return {
                        Key:x.value,
                        Value: x.label
                    }
                });
        this.GLAccountList = data;          
        })   
    }


    toggleSameDetailsForAllParts(part: PurchaseOrderPart): void {
        part.isSameDetailsForAllParts = !part.isSameDetailsForAllParts;

        if (part.isSameDetailsForAllParts) {
            for (var i = part.currentSLIndex; i < part.stocklineListObj.length; i++) {
                // var serialNumber = part.stocklineListObj[i].serialNumber;
                // var serialNumberNotProvided = part.stocklineListObj[i].serialNumberNotProvided;

                var stockLineToCopy = { ...part.stocklineListObj[part.currentSLIndex] };
                part.stocklineListObj[i] = stockLineToCopy;
                // part.stocklineListObj[i].serialNumber = serialNumber;
                // part.stocklineListObj[i].serialNumberNotProvided = serialNumberNotProvided;
            }
        }
    }

    isCheckedSameDetailsForAllParts(part: PurchaseOrderPart) {
        if (part.isSameDetailsForAllParts) {
            for (var i = part.currentSLIndex; i < part.stocklineListObj.length; i++) {
                var stockLineToCopy = { ...part.stocklineListObj[part.currentSLIndex] };
                part.stocklineListObj[i] = stockLineToCopy;
            }
        }
    }

    togglePartSerialized(part: PurchaseOrderPart): void {

        if (part.itemMaster.isSerialized == null) {
            part.itemMaster.isSerialized == false;
        }
        
        this.itemmaster.updateItemMasterSerialized(part.itemMaster.itemMasterId, part.itemMaster.isSerialized).subscribe(
            result => {
                var obj = part.stocklineListObj[this.currentSLIndex];
                // part.stocklineListObj = [];
                // this.createStockLineItems(part);
                // part.stocklineListObj[0] = obj;
                var childParts = this.purchaseOrderData.purchaseOderPart.filter(x => x.itemMaster.partNumber == part.itemMaster.partNumber && !x.itemMaster.isParent);
                for (let childPart of childParts) {
                    childPart.itemMaster.isSerialized = part.itemMaster.isSerialized;
                }
                this.alertService.showMessage(this.pageTitle, "Part " + part.itemMaster.partNumber + " IsSerialized feature " + (part.itemMaster.isSerialized ? "enabled" : "disabled") + " successfully.", MessageSeverity.success);
            },
            error => {
                part.itemMaster.isSerialized = !part.itemMaster.isSerialized;
                this.alertService.showMessage(this.pageTitle, 'Something went wrong while updating Item Master', MessageSeverity.error);
            });
    }

    togglePartTimeLife(part: PurchaseOrderPart, event) {

        if ((part.itemMaster.isSerialized == null || part.itemMaster.isSerialized == false) && part.itemMaster.isTimeLife == true) {
            part.itemMaster.isTimeLife = false;
            this.alertService.showMessage(this.pageTitle, "Part is not serialized, please make the part serialzed before making it timeLife.", MessageSeverity.error);
            return false;
        }


        this.itemmaster.updateItemMasterTimeLife(part.itemMaster.itemMasterId, part.itemMaster.isTimeLife).subscribe(
            result => {
                part.timeLifeList = [];
                if (part.quantityActuallyReceived) {
                    if (part.itemMaster.isTimeLife == true) {
                        part.currentSLIndex = 0;
                        part.currentSERIndex = 0;
                        part.currentTLIndex = 0;
                        for (var i = 0; i < part.quantityActuallyReceived; i++) {
                            let timeLife: TimeLifeDraft = new TimeLifeDraft();
                            timeLife.timeLifeDraftCyclesId = 0;
                            timeLife.purchaseOrderId = part.purchaseOrderId;
                            timeLife.purchaseOrderPartRecordId = part.purchaseOrderPartRecordId;
                            timeLife.cyclesRemainingHrs = null;
                            timeLife.cyclesRemainingMin = null;
                            timeLife.cyclesSinceInspectionHrs = null;
                            timeLife.cyclesSinceInspectionMin = null;
                            timeLife.cyclesSinceNewHrs = null;
                            timeLife.cyclesSinceNewMin = null;
                            timeLife.cyclesSinceOVHHrs = null;
                            timeLife.cyclesSinceOVHMin = null;
                            timeLife.cyclesSinceRepairHrs = null;
                            timeLife.cyclesSinceRepairMin = null;
                            timeLife.timeRemainingHrs = null;
                            timeLife.timeRemainingMin = null;
                            timeLife.timeSinceInspectionHrs = null;
                            timeLife.timeSinceInspectionMin = null;
                            timeLife.timeSinceNewHrs = null;
                            timeLife.timeSinceNewMin = null;
                            timeLife.timeSinceOVHHrs = null;
                            timeLife.timeSinceOVHMin = null;
                            timeLife.timeSinceRepairHrs = null;
                            timeLife.timeSinceRepairMin = null;
                            timeLife.lastSinceNewHrs = null;
                            timeLife.lastSinceNewMin = null;
                            timeLife.lastSinceInspectionHrs = null;
                            timeLife.lastSinceInspectionMin = null;
                            timeLife.lastSinceOVHHrs = null;
                            timeLife.lastSinceOVHMin = null;
                            timeLife.detailsNotProvided = false;
                            part.timeLifeList.push(timeLife);
                        }
                    }
                }

                var childParts = this.purchaseOrderData.purchaseOderPart.filter(x => x.itemMaster.partNumber == part.itemMaster.partNumber && !x.itemMaster.isParent);
                for (let childPart of childParts) {
                    childPart.itemMaster.isTimeLife = part.itemMaster.isTimeLife;
                }
                this.alertService.showMessage(this.pageTitle, "Part " + part.itemMaster.partNumber + " IsTimeLife feature " + (part.itemMaster.isTimeLife ? "enabled" : "disabled") + " successfully.", MessageSeverity.success);
            },
            error => {
                part.itemMaster.isSerialized = !part.itemMaster.isSerialized;
                this.alertService.showMessage(this.pageTitle, 'Something went wrong while update Item Master', MessageSeverity.error);
            });
        this.receiving_po_header = false;
    }

    quantityRejectedFocusOut(event, part) {
        if (event.target.value == "") {
            event.target.value = "0";
            return true;
        }
    }

    quantityRejectedFocusIn(event, part) {
        if (event.target.value == "0") {
            event.target.value = "";
            return true;
        }
    }

    calculateExtendedCost(event, part) {
        if (part.stocklineListObj[part.currentSLIndex].purchaseOrderUnitCost == undefined || part.stocklineListObj[part.currentSLIndex].purchaseOrderUnitCost == '') {
            return;
        }
        if (part.itemMaster.isSerialized) {
            part.stocklineListObj[part.currentSLIndex].purchaseOrderExtendedCost = part.stocklineListObj[part.currentSLIndex].purchaseOrderUnitCost;
        }
        else {
            const unitCost = part.stocklineListObj[part.currentSLIndex].purchaseOrderUnitCost ? parseFloat(part.stocklineListObj[part.currentSLIndex].purchaseOrderUnitCost.toString().replace(/\,/g, '')) : 0;
            part.stocklineListObj[part.currentSLIndex].purchaseOrderExtendedCost = unitCost * part.quantityActuallyReceived;
        }
        if (part.stocklineListObj[part.currentSLIndex].purchaseOrderUnitCost) {
            part.stocklineListObj[part.currentSLIndex].purchaseOrderUnitCost = formatNumberAsGlobalSettingsModule(part.stocklineListObj[part.currentSLIndex].purchaseOrderUnitCost, 2);
        }
        if (part.stocklineListObj[part.currentSLIndex].purchaseOrderExtendedCost) {
            part.stocklineListObj[part.currentSLIndex].purchaseOrderExtendedCost = formatNumberAsGlobalSettingsModule(part.stocklineListObj[part.currentSLIndex].purchaseOrderUnitCost, 2);
        }

    }

    public moveByKey(event, part) {
        // CTRL + Down Arrow
        if (event.ctrlKey && event.keyCode == 40) {
            this.moveStockLinePage('stockline', part.currentSERIndex + 1, part);
        }
        // CTRL + Up Arrow
        if (event.ctrlKey && event.keyCode == 38) {
            this.moveStockLinePage('stockline', part.currentSERIndex - 1, part);
        }
    }

    // private getTagType(): void {
    //     this.commonService.smartDropDownList('TagType', 'TagTypeId', 'Name').subscribe(results => {
    //         this.TagTypeList = results;
    //         // for (let tagType of results) {
    //         //     var dropdown = new DropDownData();
    //         //     dropdown.Key = tagType.value.toLocaleString();
    //         //     dropdown.Value = tagType.label;
    //         //     this.TagTypeList.push(dropdown);
    //         // }
    //         console.log(this.TagTypeList)   
    //     });
    // }
    
    
    getTagType(strText = '') {
    if (this.arraytagtypelist.length == 0) {
        this.arraytagtypelist.push(0);
    }       
    this.commonService.autoSuggestionSmartDropDownList('TagType', 'TagTypeId', 'Name', strText,
        true, 0, this.arraytagtypelist.join(), this.currentUserMasterCompanyId).subscribe(res => {   
        this.TagTypeList = res;
    })   
  }

    

    onChangeTimeLifeMin(str, part, index) {
        // for(let i=0; i < this.purchaseOrderData.purchaseOderPart.length; i++) {
        //     let part = this.purchaseOrderData.purchaseOderPart[i];
        let value = part.timeLifeList[index][str];
        if (value > 59) {
            part.timeLifeList[index][str] = 0;
            this.alertService.showMessage(this.pageTitle, 'Minutes can\'t be greater than 59', MessageSeverity.error);
        }
        // }
    }
}