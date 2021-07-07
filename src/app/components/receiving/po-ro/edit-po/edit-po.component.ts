import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VendorService } from '../../../../services/vendor.service';
import { ConditionService } from '../../../../services/condition.service';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { ManufacturerService } from '../../../../services/manufacturer.service';
import { BinService } from '../../../../services/bin.service';
import { SiteService } from '../../../../services/site.service';
import { PriorityService } from '../../../../services/priority.service';
import { ReceivingService } from '../../../../services/receiving/receiving.service';
import { PurchaseOrder, DropDownData, PurchaseOrderPart, StockLine, ReceiveParts } from '../receivng-po/PurchaseOrder.model';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { ManagementStructure } from '../receivng-po/managementstructure.model';
import { UnitOfMeasureService } from '../../../../services/unitofmeasure.service';
import { GlAccountService } from '../../../../services/glAccount/glAccount.service';
import { ShippingService } from '../../../../services/shipping/shipping-service';
import { CommonService } from '../../../../services/common.service';
import { CustomerService } from '../../../../services/customer.service';
import { LocalStoreManager } from '../../../../services/local-store-manager.service';
import { formatNumberAsGlobalSettingsModule,getValueFromArrayOfObjectById } from '../../../../generic/autocomplete';
import { DatePipe } from '@angular/common';
import { PurchaseOrderService } from '../../../../services/purchase-order.service';
import { AuthService } from '../../../../services/auth.service';
import { AppModuleEnum } from '../../../../enum/appmodule.enum';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgbModalRef, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
    selector: 'app-edit-po',
    templateUrl: './edit-po.component.html',
    styleUrls: ['./edit-po.component.scss'],
    providers: [DatePipe]
})
/** edit-po component*/
export class EditPoComponent implements OnInit {
    localPoData: any;
    editPoData: any;
    allSites: any[];
    partList: any;
    allconditioninfo: any[] = [];
    localData: any[] = [];
    partBulist: any[] = [];
    partDepartmentList: any[] = [];
    partDivisionlist: any[] = [];
    allPriorityInfo: any[] = [];
    toggle_epo_header: boolean = false;
    obtainfromcustomer: boolean = false;
    obtainfromother: boolean = false;
    obtainfromvendor: boolean = false;
    ownercustomer: boolean = false;
    ownerother: boolean = false;
    ownervendor: boolean = false;
    traceabletocustomer: boolean = false;
    traceabletoother: boolean = false;
    traceabletovendor: boolean = false;
    certbycustomer : boolean = false;
    certbyother : boolean = false;
    certbyvendor : boolean = false;
    rpoEditPF: boolean = true; //remove once add dynamic content
    rpoEditCF: boolean = true; //remove once add dynamic content
    poDataHeader: any;
    memoNotes: string;
    headerNotes: any;
    headerMemo: any;
    purchaseOrderData: any = {};
    pageTitle: string = 'Edit Receieve PO';
    poStatus: any[];
    poUserType: DropDownData[];
    managementStructure: ManagementStructure[];
    ConditionList: DropDownData[] = [];
    managementStructureHierarchy: ManagementStructure[][] = [];
    selectedManagementStructure: ManagementStructure[] = [];
    // UOMList: any[];
    ManufacturerList: DropDownData[] = [];
    SiteList: any[];
    // GLAccountList: any[];
    currentDate: Date;
    ShippingViaList: DropDownData[];
    purchaseOrderId: number;
    purchaseOrderHeaderData: any;
    headerManagementStructure: any = {};
    CustomerList: DropDownData[] = [];
    VendorList: DropDownData[] = [];
    CompanyList: DropDownData[] = [];
    isPOStockline: boolean = false;
    legalEntityList: any = [];
    isSpinnerVisible: boolean = true;
    moduleListDropdown: any = [];
    arrayLegalEntitylsit: any[] = [];
    arraySitelist: any[] = [];
    arrayVendlsit: any[] = [];
    arrayComplist: any[] = [];
    arrayCustlist: any[] = [];
    arraymanufacturerlist: any[] = [];
    arrayConditionlist: any[] = [];
    arrayglaccountlist: any[] = [];
    arrayshipvialist: any[] = [];
    arraytagtypelist: any[] = [];
    companyModuleId: number = 0;
    vendorModuleId: number = 0;
    customerModuleId: number = 0;
    otherModuleId: number = 0;
    alertText: string = '';
    arrayPostatuslist: any[] = [];
    private onDestroy$: Subject<void> = new Subject<void>();
    modal: NgbModalRef;
    /** edit-po ctor */
    constructor(public receivingService: ReceivingService,
        public priority: PriorityService,
        private vendorService: VendorService,
        public conditionService: ConditionService,
        public siteService: SiteService,
        public binservice: BinService,
        public legalEntityService: LegalEntityService,
        public manufacturerService: ManufacturerService,
        public route: Router,
        private alertService: AlertService,
        private uomService: UnitOfMeasureService,
        private glAccountService: GlAccountService,
        private shippingService: ShippingService,
        private _actRoute: ActivatedRoute,
        private commonService: CommonService,
        private customerService: CustomerService,
        private localStorage: LocalStoreManager,
        private datePipe: DatePipe,
        private purchaseOrderService: PurchaseOrderService,
        private authService: AuthService,
        private modalService: NgbModal,
    ) {

        this.localPoData = this.vendorService.selectedPoCollection;
        this.editPoData = this.localData[0];
        this.currentDate = new Date();
        this.companyModuleId = AppModuleEnum.Company;
        this.vendorModuleId = AppModuleEnum.Vendor;
        this.customerModuleId = AppModuleEnum.Customer;
        this.otherModuleId = AppModuleEnum.Others;
    }

    ngOnInit() {        
        this.receivingService.purchaseOrderId = this._actRoute.snapshot.queryParams['purchaseorderid'];        
        if (this.receivingService.purchaseOrderId == undefined && this.receivingService.purchaseOrderId == null) {
            this.alertService.showMessage(this.pageTitle, "No purchase order is selected to edit.", MessageSeverity.error);
            return this.route.navigate(['/receivingmodule/receivingpages/app-purchase-order']);
        }

        this.receivingService.getAllRecevingEditID(this.receivingService.purchaseOrderId).subscribe(res => {
            this.isSpinnerVisible = true;
            const result = res;
            if (result && result.length > 0) {
                result.forEach(x => {
                    if (x.label == "VENDOR") {
                        this.arrayVendlsit.push(x.value);
                    }
                    else if (x.label == "SITEID") {
                        this.arraySitelist.push(x.value);
                    }
                    else if (x.label == "SHIPPINGVIA") {
                        this.arrayshipvialist.push(x.value);
                    }
                    else if (x.label == "CONDITIONID") {
                        this.arrayConditionlist.push(x.value);
                    }
                    else if (x.label == "CUSTOMER") {
                        this.arrayCustlist.push(x.value);
                    }
                    else if (x.label == "COMPANY") {
                        this.arrayComplist.push(x.value);
                    }
                    else if (x.label == "MANUFACTURER") {
                        this.arraymanufacturerlist.push(x.value);
                    }
                });
                this.getShippingVia();
                this.getConditionList();
                this.getLegalEntity();
                this.loadModulesNamesForObtainOwnerTraceable();                
                this.isSpinnerVisible = true;
                setTimeout(() => {
                    this.isSpinnerVisible = true;
                    this.getReceivingPOHeaderById(this.receivingService.purchaseOrderId);
                    this.receivingService.getPurchaseOrderDataForEditById(this.receivingService.purchaseOrderId, this.employeeId).subscribe(
                        results => {
                            if (results[0] == null || results[0] == undefined) {
                                this.alertService.showMessage(this.pageTitle, "No purchase order is selected to edit.", MessageSeverity.error);
                                return this.route.navigate(['/receivingmodule/receivingpages/app-purchase-order']);
                            }
                            if (results[0][0]) {
                                this.purchaseOrderData.purchaseOderPart = results[0][0].map(x => {
                                    return {
                                        ...x,
                                        discountPerUnit : x.discountPerUnit ? formatNumberAsGlobalSettingsModule(x.discountPerUnit, 2) : '0.00',
                                        unitCost : x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
                                        extendedCost : x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00',
                                        stockLine: this.getStockLineDetails(x.stockLine),
                                        timeLife: this.getTimeLifeDetails(x.timeLife)
                                    }
                                });
                            }
                            const data = this.purchaseOrderData.purchaseOderPart;
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].stockLine.length > 0) {
                                    this.isPOStockline = true;
                                    break;
                                }
                            }
                            var allParentParts = this.purchaseOrderData.purchaseOderPart.filter(x => x.isParent == true);
                            for (let parent of allParentParts) {                                                                
                                var splitParts = this.purchaseOrderData.purchaseOderPart.filter(x => !x.isParent && x.parentId == parent.purchaseOrderPartRecordId);
                                if (splitParts.length > 0) {
                                    parent.hasChildren = true;
                                    parent.quantityOrdered = 0;
                                    for (let childPart of splitParts) {
                                        parent.stockLineCount += childPart.stockLineCount;
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
                                part.isEnabled = false;
                                this.getManagementStructureForPart(part, results[0][1]);
                                if (part.stockLine != null) {
                                    for (var SL of part.stockLine) {
                                        SL.isEnabled = false;
                                        this.getManagementStructureForSL(SL, results[0][2]);
                                    }

                                }
                            }
                            this.purchaseOrderData.dateRequested = new Date(); //new Date(this.purchaseOrderData.dateRequested);
                            this.purchaseOrderData.dateApprovied = new Date(this.purchaseOrderData.dateApprovied);
                            this.purchaseOrderData.needByDate = new Date(); //new Date(this.purchaseOrderData.needByDate);
                            this.getManufacturers();
                            //this.getStatus();                                      
                            this.getConditionList();
                            this.getAllSite();
                            this.getCustomers();
                            this.getVendors();
                            this.getCompanyList();
                            //this.loadTagByEmployeeData();
                            this.Purchaseunitofmeasure();
                            this.getTagType();
                            if (this.purchaseOrderData.purchaseOderPart) {
                                for (let i = 0; i < this.purchaseOrderData.purchaseOderPart.length; i++) {
                                    this.getCondIdPart(this.purchaseOrderData.purchaseOderPart[i]);
                                    this.getSiteDetailsOnEdit(this.purchaseOrderData.purchaseOderPart[i]);
                                }
                            }
                            this.isSpinnerVisible = false;

                        },
                        error => {
                            this.isSpinnerVisible = false;
                            this.alertService.showMessage(this.pageTitle, "Something went wrong while loading the Purchase Order detail", MessageSeverity.error);
                            return this.route.navigate(['/receivingmodule/receivingpages/app-purchase-order']);
                        }
                    );

                }, 2200);
            }
            else {
                this.isSpinnerVisible = false;
            }

        },
            err => {
                this.isSpinnerVisible = false;
            });
        this.localData = [
            { partNumber: 'PN123' }
        ]
    }

    get employeeId() {
        return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    getManagementStructureForPart(partList, response) {
        if (response) {
            const result = response[partList.purchaseOrderPartRecordId];
            if (result[0] && result[0].level == 'Level1') {
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

            if (result[1] && result[1].level == 'Level2') {
                partList.parentBulist = result[1].lstManagmentStrcture;
                partList.parentbuId = result[1].managementStructureId;
                partList.managementStructureId = result[1].managementStructureId;
                partList.parentDivisionlist = [];
                partList.parentDepartmentlist = [];
                partList.parentDivisionId = 0;
                partList.parentDeptId = 0;
            } else {
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
            } else {
                if (result[2] && result[2].level == 'NEXT') {
                    partList.parentDivisionlist = result[2].lstManagmentStrcture;
                }
                partList.parentDivisionId = 0;
                partList.parentDeptId = 0;
                partList.parentDepartmentlist = [];
            }

            if (result[3] && result[3].level == 'Level4') {
                partList.parentDepartmentlist = result[3].lstManagmentStrcture;;
                partList.parentDeptId = result[3].managementStructureId;
                partList.managementStructureId = result[3].managementStructureId;
            } else {
                partList.parentDeptId = 0;
                if (result[3] && result[3].level == 'NEXT') {
                    partList.parentDepartmentlist = result[3].lstManagmentStrcture;
                }
            }
        }

    }

    selectedLegalEntity(legalEntityId, part) {
        part.parentBulist = [];
        part.parentDivisionlist = [];
        part.parentDepartmentlist = [];
        part.parentbuId = 0;
        part.parentDivisionId = 0;
        part.parentDeptId = 0;

        if (part.stockLine) {
            for (let j = 0; j < part.stockLine.length; j++) {
                if (part.stockLine[j].stockLineId > 0) {

                }
                else {                
                part.stockLine[j].parentCompanyId = part.parentCompanyId;
                part.stockLine[j].parentBulist = [];
                part.stockLine[j].parentDivisionlist = [];
                part.stockLine[j].parentDepartmentlist = [];
                part.stockLine[j].parentbuId = 0;
                part.stockLine[j].parentDivisionId = 0;
                part.stockLine[j].parentDeptId = 0;
                }
            }
        }


        if (part.parentCompanyId != 0 && part.parentCompanyId != null
            && part.parentCompanyId != undefined) {
            part.managementStructureId = part.parentCompanyId;
            this.commonService.getManagementStructurelevelWithEmployee(part.parentCompanyId, this.employeeId).subscribe(res => {
                part.parentBulist = res;
                if (part.stockLine) {
                    for (let j = 0; j < part.stockLine.length; j++) {
                        if (part.stockLine[j].stockLineId > 0) {

                        }
                        else {  
                        part.stockLine[j].parentBulist = part.parentBulist;
                        part.stockLine[j].parentCompanyId = part.parentCompanyId;
                        part.stockLine[j].managementStructureEntityId = part.parentCompanyId;
                        }
                    }
                }
            });
        }
        else {
            part.managementStructureId = 0;
            if (part.stockLine) {
                for (let j = 0; j < part.stockLine.length; j++) {
                    if (part.stockLine[j].stockLineId > 0) {
                    }
                    else {  
                        part.stockLine[j].managementStructureEntityId = 0;
                    }
                }
            }
        }
    }

    selectedBusinessUnit(businessUnitId, part) {
        part.parentDivisionlist = [];
        part.parentDepartmentlist = [];
        part.parentDivisionId = 0;
        part.parentDeptId = 0;

        if (part.stockLine) {
            for (let j = 0; j < part.stockLine.length; j++) {
                if (part.stockLine[j].stockLineId > 0) {
                }
                else {  
                part.stockLine[j].parentbuId = part.parentbuId;
                part.stockLine[j].parentDivisionlist = [];
                part.stockLine[j].parentDepartmentlist = [];
                part.stockLine[j].parentDivisionId = 0;
                part.stockLine[j].parentDeptId = 0;
                }
            }
        }

        if (part.parentbuId != 0 && part.parentbuId != null && part.parentbuId != undefined) {
            part.managementStructureId = part.parentbuId;
            this.commonService.getManagementStructurelevelWithEmployee(part.parentbuId, this.employeeId).subscribe(res => {
                part.parentDivisionlist = res;
                if (part.stockLine) {
                    for (let j = 0; j < part.stockLine.length; j++) {
                        if (part.stockLine[j].stockLineId > 0) {

                        }
                        else {  
                        part.stockLine[j].parentDivisionlist = part.parentDivisionlist;
                        part.stockLine[j].parentbuId = part.parentbuId;
                        part.stockLine[j].managementStructureEntityId = part.parentbuId;
                        }
                    }
                }
            });
        }
        else {
            part.managementStructureId = part.parentCompanyId;
            if (part.stockLine) {
                for (let j = 0; j < part.stockLine.length; j++) {
                    if (part.stockLine[j].stockLineId > 0) {

                    }
                    else {  
                        part.stockLine[j].managementStructureEntityId = part.parentCompanyId;
                    }
                }
            }
        }
    }

    selectedDivision(divisionUnitId, part) {
        part.parentDeptId = 0;
        part.parentDepartmentlist = [];

        if (part.stockLine) {
            for (let j = 0; j < part.stockLine.length; j++) {
                if (part.stockLine[j].stockLineId > 0) {

                }
                else {  
                part.stockLine[j].parentDivisionId = part.parentDivisionId;
                part.stockLine[j].parentDepartmentlist = [];
                part.stockLine[j].parentDeptId = 0;
                }
            }
        }

        if (part.parentDivisionId != 0 && part.parentDivisionId != null
            && part.parentDivisionId != undefined) {
            part.managementStructureId = part.parentDivisionId;
            this.commonService.getManagementStructurelevelWithEmployee(part.parentDivisionId, this.employeeId).subscribe(res => {
                part.parentDepartmentlist = res;
                if (part.stockLine) {
                    for (let j = 0; j < part.stockLine.length; j++) {
                        if (part.stockLine[j].stockLineId > 0) {

                        }
                        else {  
                        part.stockLine[j].parentDepartmentlist = part.parentDepartmentlist;
                        part.stockLine[j].parentDivisionId = part.parentDivisionId;
                        part.stockLine[j].managementStructureEntityId = part.parentDivisionId;
                        }
                    }
                }
            });
        }
        else {
            part.managementStructureId = part.parentbuId;
            if (part.stockLine) {
                for (let j = 0; j < part.stockLine.length; j++) {
                    if (part.stockLine[j].stockLineId > 0) {

                    }
                    else {  
                    part.stockLine[j].managementStructureEntityId = part.parentbuId;
                    }
                }
            }
        }
    }

    selectedDepartment(departmentId, part) {
        if (part.parentDeptId != 0 && part.parentDeptId != null && part.parentDeptId != undefined) {
            part.managementStructureId = part.parentDeptId;
            if (part.stockLine) {
                for (let j = 0; j < part.stockLine.length; j++) {
                    if (part.stockLine[j].stockLineId > 0) {

                    }
                    else {  
                    part.stockLine[j].parentDeptId = part.parentDeptId;
                    part.stockLine[j].managementStructureEntityId = part.parentDeptId;
                    }
                }
            }
        }
        else {
            part.managementStructureId = part.parentDivisionId;
            if (part.stockLine) {
                for (let j = 0; j < part.stockLine.length; j++) {
                    if (part.stockLine[j].stockLineId > 0) {

                    }
                    else {  
                    part.stockLine[j].managementStructureEntityId = part.parentDivisionId;
                    }
                }
            }
        }
    }

    getManagementStructureForSL(sl1, response) {
        if (response) {
            const result = response[sl1.stockLineDraftId];
            if (result[0] && result[0].level == 'Level1') {
                sl1.maincompanylist = result[0].lstManagmentStrcture;
                sl1.parentCompanyId = result[0].managementStructureId;
                sl1.managementStructureEntityId = result[0].managementStructureId;
                sl1.parentBulist = []
                sl1.parentDivisionlist = [];
                sl1.parentDepartmentlist = [];
                sl1.parentbuId = 0;
                sl1.parentDivisionId = 0;
                sl1.parentDeptId = 0;
            } else {
                sl1.parentCompanyId = 0;
                sl1.parentbuId = 0;
                sl1.parentDivisionId = 0;
                sl1.parentDeptId = 0;
                sl1.maincompanylist = [];
                sl1.parentBulist = []
                sl1.parentDivisionlist = [];
                sl1.parentDepartmentlist = [];
            }

            if (result[1] && result[1].level == 'Level2') {
                sl1.parentBulist = result[1].lstManagmentStrcture;
                sl1.parentbuId = result[1].managementStructureId;
                sl1.managementStructureEntityId = result[1].managementStructureId;
                sl1.parentDivisionlist = [];
                sl1.parentDepartmentlist = [];
                sl1.parentDivisionId = 0;
                sl1.parentDeptId = 0;
            } else {
                if (result[1] && result[1].level == 'NEXT') {
                    sl1.parentBulist = result[1].lstManagmentStrcture;
                }
                sl1.parentbuId = 0;
                sl1.parentDivisionId = 0;
                sl1.parentDeptId = 0;
                sl1.parentDivisionlist = [];
                sl1.parentDepartmentlist = [];
            }

            if (result[2] && result[2].level == 'Level3') {
                sl1.parentDivisionlist = result[2].lstManagmentStrcture;
                sl1.parentDivisionId = result[2].managementStructureId;
                sl1.managementStructureEntityId = result[2].managementStructureId;
                sl1.parentDeptId = 0;
                sl1.parentDepartmentlist = [];
            } else {
                if (result[2] && result[2].level == 'NEXT') {
                    sl1.parentDivisionlist = result[2].lstManagmentStrcture;
                }
                sl1.parentDivisionId = 0;
                sl1.parentDeptId = 0;
                sl1.parentDepartmentlist = [];
            }

            if (result[3] && result[3].level == 'Level4') {
                sl1.parentDepartmentlist = result[3].lstManagmentStrcture;;
                sl1.parentDeptId = result[3].managementStructureId;
                sl1.managementStructureEntityId = result[3].managementStructureId;
            } else {
                sl1.parentDeptId = 0;
                if (result[3] && result[3].level == 'NEXT') {
                    sl1.parentDepartmentlist = result[3].lstManagmentStrcture;
                }
            }
        }

    }

    selectedLegalEntitySL(legalEntityId, stockLine) {
        stockLine.parentBulist = [];
        stockLine.parentDivisionlist = [];
        stockLine.parentDepartmentlist = [];
        stockLine.parentbuId = 0;
        stockLine.parentDivisionId = 0;
        stockLine.parentDeptId = 0;
        if (stockLine.parentCompanyId != 0 && stockLine.parentCompanyId != null
            && stockLine.parentCompanyId != undefined) {
            stockLine.managementStructureEntityId = stockLine.parentCompanyId;
            this.commonService.getManagementStructurelevelWithEmployee(stockLine.parentCompanyId, this.employeeId).subscribe(res => {
                stockLine.parentBulist = res;
            });
        }
        else {
            stockLine.managementStructureEntityId = 0;
        }
    }

    selectedBusinessUnitSL(businessUnitId, stockLine) {
        stockLine.parentDivisionlist = [];
        stockLine.parentDepartmentlist = [];
        stockLine.parentDivisionId = 0;
        stockLine.parentDeptId = 0;
        if (stockLine.parentbuId != 0 && stockLine.parentbuId != null && stockLine.parentbuId != undefined) {
            stockLine.managementStructureEntityId = stockLine.parentbuId;
            this.commonService.getManagementStructurelevelWithEmployee(stockLine.parentbuId, this.employeeId).subscribe(res => {
                stockLine.parentDivisionlist = res;
            });
        }
        else {
            stockLine.managementStructureEntityId = stockLine.parentCompanyId;
        }
    }

    selectedDivisionSL(divisionUnitId, stockLine) {
        stockLine.parentDeptId = 0;
        stockLine.parentDepartmentlist = [];
        if (stockLine.parentDivisionId != 0 && stockLine.parentDivisionId != null
            && stockLine.parentDivisionId != undefined) {
            stockLine.managementStructureEntityId = stockLine.parentDivisionId;
            this.commonService.getManagementStructurelevelWithEmployee(stockLine.parentDivisionId, this.employeeId).subscribe(res => {
                stockLine.parentDepartmentlist = res;
            });
        }
        else {
            stockLine.managementStructureEntityId = stockLine.parentbuId;
        }
    }

    selectedDepartmentSL(departmentId, stockLine) {
        if (stockLine.parentDeptId != 0 && stockLine.parentDeptId != null && stockLine.parentDeptId != undefined) {
            stockLine.managementStructureEntityId = stockLine.parentDeptId;
        }
        else {
            stockLine.managementStructureEntityId = stockLine.parentDivisionId;
        }
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

    getReceivingPOHeaderById(id) {
        this.purchaseOrderService.getPOViewById(id).subscribe(
            res => {
                this.poDataHeader = res;
                this.poDataHeader.purchaseOrderNumber = this.poDataHeader.purchaseOrderNumber;
                this.poDataHeader.openDate = this.poDataHeader.openDate ? new Date(this.poDataHeader.openDate) : '';
                this.poDataHeader.closedDate = this.poDataHeader.closedDate ? new Date(this.poDataHeader.closedDate) : '';
                this.poDataHeader.dateApproved = this.poDataHeader.dateApproved ? new Date(this.poDataHeader.dateApproved) : '';
                this.poDataHeader.needByDate = this.poDataHeader.needByDate ? new Date(this.poDataHeader.needByDate) : '';
                this.poDataHeader.creditLimit = this.poDataHeader.creditLimit ? formatNumberAsGlobalSettingsModule(this.poDataHeader.creditLimit, 2) : '0.00';
                if (this.poDataHeader.shipViaId && this.poDataHeader.shipViaId > 0) {
                    var shippingVia = this.ShippingViaList.find(temp => temp.Key == this.poDataHeader.shipViaId);
                    if (!shippingVia || shippingVia == undefined) {
                        var shippingVia = new DropDownData();
                        shippingVia.Key = this.poDataHeader.shipViaId.toString();
                        shippingVia.Value = this.poDataHeader.shipVia.toString();
                        this.ShippingViaList.push(shippingVia);
                    }
                }
            });
    }

    getLegalEntity(strText = '') {
        if (this.arrayLegalEntitylsit.length == 0) {
            this.arrayLegalEntitylsit.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name', strText, true, 20, this.arrayLegalEntitylsit.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.legalEntityList = res;
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    loadModulesNamesForObtainOwnerTraceable() {
        this.commonService.getModuleListForObtainOwnerTraceable(0).subscribe(res => {
            this.moduleListDropdown = res;
        })
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
        this.headerNotes = this.purchaseOrderData.notes;
    }
    
    onSaveNotes() {
        this.purchaseOrderData.notes = this.headerNotes;
    }

    onAddMemo() {
        this.headerMemo = this.purchaseOrderData.memo;
    }
    onSaveMemo() {
        this.purchaseOrderData.memo = this.headerMemo;
    }

    getStockLineDetails(stockline) {
        stockline = stockline.map(x => {
            return {
                ...x,
                purchaseOrderUnitCost: x.purchaseOrderUnitCost ? formatNumberAsGlobalSettingsModule(x.purchaseOrderUnitCost, 2) : '0.00',
                purchaseOrderExtendedCost: x.purchaseOrderExtendedCost ? formatNumberAsGlobalSettingsModule(x.purchaseOrderExtendedCost, 2) : '0.00'
            }
        })
        return stockline;
    }

    getTimeLifeDetails(timeLife) {
        timeLife = timeLife.map(x => {
            return {
                stockLineDraftId: x.stockLineDraftId,
                timeLifeDraftCyclesId: x.timeLifeDraftCyclesId,
                cyclesRemainingHrs: x.cyclesRemaining ? x.cyclesRemaining.split(':')[0] : null,
                cyclesRemainingMin: x.cyclesRemaining ? x.cyclesRemaining.split(':')[1] : null,
                cyclesSinceInspectionHrs: x.cyclesSinceInspection ? x.cyclesSinceInspection.split(':')[0] : null,
                cyclesSinceInspectionMin: x.cyclesSinceInspection ? x.cyclesSinceInspection.split(':')[1] : null,
                cyclesSinceNewHrs: x.cyclesSinceNew ? x.cyclesSinceNew.split(':')[0] : null,
                cyclesSinceNewMin: x.cyclesSinceNew ? x.cyclesSinceNew.split(':')[1] : null,
                cyclesSinceOVHHrs: x.cyclesSinceOVH ? x.cyclesSinceOVH.split(':')[0] : null,
                cyclesSinceOVHMin: x.cyclesSinceOVH ? x.cyclesSinceOVH.split(':')[1] : null,
                cyclesSinceRepairHrs: x.cyclesSinceRepair ? x.cyclesSinceRepair.split(':')[0] : null,
                cyclesSinceRepairMin: x.cyclesSinceRepair ? x.cyclesSinceRepair.split(':')[1] : null,
                timeRemainingHrs: x.timeRemaining ? x.timeRemaining.split(':')[0] : null,
                timeRemainingMin: x.timeRemaining ? x.timeRemaining.split(':')[1] : null,
                timeSinceInspectionHrs: x.timeSinceInspection ? x.timeSinceInspection.split(':')[0] : null,
                timeSinceInspectionMin: x.timeSinceInspection ? x.timeSinceInspection.split(':')[1] : null,
                timeSinceNewHrs: x.timeSinceNew ? x.timeSinceNew.split(':')[0] : null,
                timeSinceNewMin: x.timeSinceNew ? x.timeSinceNew.split(':')[1] : null,
                timeSinceOVHHrs: x.timeSinceOVH ? x.timeSinceOVH.split(':')[0] : null,
                timeSinceOVHMin: x.timeSinceOVH ? x.timeSinceOVH.split(':')[1] : null,
                timeSinceRepairHrs: x.timeSinceRepair ? x.timeSinceRepair.split(':')[0] : null,
                timeSinceRepairMin: x.timeSinceRepair ? x.timeSinceRepair.split(':')[1] : null,
                lastSinceInspectionHrs: x.lastSinceInspection ? x.lastSinceInspection.split(':')[0] : null,
                lastSinceInspectionMin: x.lastSinceInspection ? x.lastSinceInspection.split(':')[1] : null,
                lastSinceNewHrs: x.lastSinceNew ? x.lastSinceNew.split(':')[0] : null,
                lastSinceNewMin: x.lastSinceNew ? x.lastSinceNew.split(':')[1] : null,
                lastSinceOVHHrs: x.lastSinceOVH ? x.lastSinceOVH.split(':')[0] : null,
                lastSinceOVHMin: x.lastSinceOVH ? x.lastSinceOVH.split(':')[1] : null,
            }
        })
        return timeLife;
    }

    getCondIdPart(part) {
        if (part.stockLine && part.stockLine.length > 0) {
            const id = part.stockLine[0].conditionId;
            part.conditionId = id;
        }
    }

    getSiteDetailsOnEdit(part) {
        const stock = part.stockLine[0];
        if (stock) {
            part.siteId = stock.siteId ? stock.siteId : null;
            this.getPartWareHouse(part);
            part.warehouseId = stock.warehouseId ? stock.warehouseId : null;
            this.getPartLocation(part);
            part.locationId = stock.locationId ? stock.locationId : null;
            this.getPartShelf(part);
            part.shelfId = stock.shelfId ? stock.shelfId : null;
            this.getPartBin(part);
            part.binId = stock.binId ? stock.binId : null;
        }
    }

    getCustomers(strText = '') {

        if (this.arrayCustlist.length == 0) {
            this.arrayCustlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', strText, true, 20, this.arrayCustlist.join(), this.currentUserMasterCompanyId).subscribe(response => {

            const data = response.map(x => {
                return {
                    Key: x.value.toString(),
                    Value: x.label
                }
            });
            this.CustomerList = data;            
            for (let part of this.purchaseOrderData.purchaseOderPart) {
                for (let SL of part.stockLine) {                    
                    if (SL.owner != null && SL.owner != '' && SL.ownerType == 1) {
                        SL.ownerObject = this.CustomerList.find(x => x.Key == SL.owner);
                    }
                    if (SL.obtainFrom != null && SL.obtainFrom != '' && SL.obtainFromType == 1) {
                        SL.obtainFromObject = this.CustomerList.find(x => x.Key == SL.obtainFrom);
                    }
                    if (SL.traceableTo != null && SL.traceableTo != '' && SL.traceableToType == 1) {
                        SL.traceableToObject = this.CustomerList.find(x => x.Key == SL.traceableTo);
                    }
                    if (SL.taggedBy != null && SL.taggedBy != '' && SL.taggedByType == 1) {
                        var taggedBy = this.CustomerList.find(temp => temp.Key == SL.taggedBy)
                        if (!taggedBy || taggedBy == undefined) {                          
                            var taggedBy = new DropDownData();
                            taggedBy.Key = SL.taggedBy;
                            taggedBy.Value = SL.taggedByName;
                            this.CustomerList.push(taggedBy);                           
                        }                       
                        SL.taggedByObject = this.CustomerList.find(x => x.Key == SL.taggedBy);
                    }
                    if (SL.certifiedById != null && SL.certifiedById != '' && SL.certifiedTypeId == 1) {
                        var certifiedById = this.CustomerList.find(temp => temp.Key == SL.certifiedById)
                        if (!certifiedById || certifiedById == undefined) {                          
                            var certifiedBy = new DropDownData();
                            certifiedBy.Key = SL.certifiedById;
                            certifiedBy.Value = SL.certifiedBy;
                            this.CustomerList.push(certifiedBy);                           
                        }                       
                        SL.certByObject = this.CustomerList.find(x => x.Key == SL.certifiedById);
                    }
                }
            }
        },
            error => this.onDataLoadFailed(error)
        );
    }

    getVendors(filterVal = '') {

        if (this.arrayVendlsit.length == 0) {
            this.arrayVendlsit.push(0);
        }
        this.vendorService.getVendorNameCodeListwithFilter(filterVal, 20, this.arrayVendlsit.join(), this.currentUserMasterCompanyId).subscribe(res => {
            const data = res.map(x => {
                return {
                    Key: x.vendorId,
                    Value: x.vendorName
                }
            });
            this.VendorList = data;            
            for (let part of this.purchaseOrderData.purchaseOderPart) {
                for (let SL of part.stockLine) {                    
                    if (SL.owner != null && SL.owner != '' && SL.ownerType == 2) {
                        SL.ownerObject = this.VendorList.find(x => x.Key == SL.owner);
                    }
                    if (SL.obtainFrom != null && SL.obtainFrom != '' && SL.obtainFromType == 2) {
                        SL.obtainFromObject = this.VendorList.find(x => x.Key == SL.obtainFrom);
                    }
                    if (SL.traceableTo != null && SL.traceableTo != '' && SL.traceableToType == 2) {
                        SL.traceableToObject = this.VendorList.find(x => x.Key == SL.traceableTo);
                    }
                    if (SL.taggedBy != null && SL.taggedBy != '' && SL.taggedByType == 2) {
                        var taggedBy = this.VendorList.find(temp => temp.Key == SL.taggedBy)
                        if (!taggedBy || taggedBy == undefined) {                          
                            var taggedBy = new DropDownData();
                            taggedBy.Key = SL.taggedBy;
                            taggedBy.Value = SL.taggedByName;
                            this.VendorList.push(taggedBy);                           
                        } 
                        SL.taggedByObject = this.VendorList.find(x => x.Key == SL.taggedBy);
                    }
                    if (SL.certifiedById != null && SL.certifiedById != '' && SL.certifiedTypeId == 2) {
                        var certifiedById = this.VendorList.find(temp => temp.Key == SL.certifiedById)
                        if (!certifiedById || certifiedById == undefined) {                          
                            var certifiedBy = new DropDownData();
                            certifiedBy.Key = SL.certifiedById;
                            certifiedBy.Value = SL.certifiedBy;
                            this.VendorList.push(certifiedBy);                           
                        }                       
                        SL.certByObject = this.VendorList.find(x => x.Key == SL.certifiedById);
                    }
                }
            }
        },
            error => this.onDataLoadFailed(error)
        );        
    }

    getCompanyList(strText = '') {

        if (this.arrayComplist.length == 0) {
            this.arrayComplist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name', strText, true, 20, this.arrayComplist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            const data = response.map(x => {
                return {
                    Key: x.value.toString(),
                    Value: x.label
                }
            });
            this.CompanyList = data;

            for (let part of this.purchaseOrderData.purchaseOderPart) {
                for (let SL of part.stockLine) {
                    if (SL.owner != null && SL.owner != '' && SL.ownerType == 9) {
                        SL.ownerObject = this.CompanyList.find(x => x.Key == SL.owner);
                    }
                    if (SL.obtainFrom != null && SL.obtainFrom != '' && SL.obtainFromType == 9) {
                        SL.obtainFromObject = this.CompanyList.find(x => x.Key == SL.obtainFrom);
                    }
                    if (SL.traceableTo != null && SL.traceableTo != '' && SL.traceableToType == 9) {
                        SL.traceableToObject = this.CompanyList.find(x => x.Key == SL.traceableTo);
                    }
                    if (SL.taggedBy != null && SL.taggedBy != '' && SL.taggedByType == 9) {
                        var taggedBy = this.CompanyList.find(temp => temp.Key == SL.taggedBy)
                        if (!taggedBy || taggedBy == undefined) {                          
                            var taggedBy = new DropDownData();
                            taggedBy.Key = SL.taggedBy;
                            taggedBy.Value = SL.taggedByName;
                            this.CompanyList.push(taggedBy);                           
                        }
                        SL.taggedByObject = this.CompanyList.find(x => x.Key == SL.taggedBy);
                    }
                    if (SL.certifiedById != null && SL.certifiedById != '' && SL.certifiedTypeId == 9) {
                        var certifiedById = this.CompanyList.find(temp => temp.Key == SL.certifiedById)
                        if (!certifiedById || certifiedById == undefined) {                          
                            var certifiedBy = new DropDownData();
                            certifiedBy.Key = SL.certifiedById;
                            certifiedBy.Value = SL.certifiedBy;
                            this.CompanyList.push(certifiedBy);                           
                        }                       
                        SL.certByObject = this.CompanyList.find(x => x.Key == SL.certifiedById);
                    }
                }
            }
        });
    }

    getConditionList() {
        if (this.arrayConditionlist.length == 0) {
            this.arrayConditionlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Condition', 'ConditionId', 'Description', '', true, 0, this.arrayConditionlist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            for (let company of res) {
                var dropdown = new DropDownData();
                dropdown.Key = company.value.toLocaleString();
                dropdown.Value = company.label
                this.ConditionList.push(dropdown);
            }
        },
            err => {
                this.isSpinnerVisible = false;
            });
    }

    private getStatus() {
        if (this.arrayPostatuslist.length == 0) {
            this.arrayPostatuslist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('POStatus', 'POStatusId', 'Description', '',
            true, 0, this.arrayPostatuslist.join(), 0)
            .subscribe(res => {
                this.poStatus = res;
                this.poStatus = this.poStatus.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
            }
            );
    }


    /////////////Reffrance


    private getPartBusinessUnitList(part: PurchaseOrderPart): void {
        part.managementStructureId = part.companyId;
        var businessUnits = this.managementStructure.filter(function (management) {
            return management.parentId == part.companyId;
        });

        part.BusinessUnitList = [];
        part.DivisionList = [];
        part.DepartmentList = [];
        part.businessUnitId = 0;
        part.divisionId = 0;
        part.departmentId = 0;

        for (let businessUnit of businessUnits) {
            var dropdown = new DropDownData();
            dropdown.Key = businessUnit.managementStructureId.toLocaleString();
            dropdown.Value = businessUnit.code;
            part.BusinessUnitList.push(dropdown);
        }
    }

    private getPartDivision(part: PurchaseOrderPart): void {
        if (part.businessUnitId != undefined && part.businessUnitId > 0) {
            part.managementStructureId = part.businessUnitId;
        }
        else {
            part.managementStructureId = part.companyId;
        }

        var divisions = this.managementStructure.filter(function (management) {
            return management.parentId == part.businessUnitId;
        });

        part.DivisionList = [];
        part.DepartmentList = [];
        part.divisionId = 0;
        part.departmentId = 0;

        for (let division of divisions) {
            var dropdown = new DropDownData();
            dropdown.Key = division.managementStructureId.toLocaleString();
            dropdown.Value = division.code;
            part.DivisionList.push(dropdown);
        }
    }

    private getPartDepartment(part: PurchaseOrderPart): void {

        if (part.divisionId != undefined && part.divisionId > 0) {
            part.managementStructureId = part.divisionId;
        }
        else {
            part.managementStructureId = part.businessUnitId;
        }

        var departments = this.managementStructure.filter(function (management) {
            return management.parentId == part.divisionId;
        });

        part.DepartmentList = [];
        part.departmentId = 0;
        for (let deparment of departments) {
            var dropdown = new DropDownData();
            dropdown.Key = deparment.managementStructureId.toLocaleString();
            dropdown.Value = deparment.code;
            part.DepartmentList.push(dropdown);
        }
    }

    private setPartDepartmentManagementStructureId(part: PurchaseOrderPart) {
        if (part.departmentId != undefined && part.departmentId > 0) {
            part.managementStructureId = part.departmentId;
        }
        else {
            part.managementStructureId = part.divisionId;
        }
    }

    private getStockLineBusinessUnitList(SL: StockLine): void {
        SL.managementStructureEntityId = SL.companyId;
        var businessUnits = this.managementStructure.filter(function (management) {
            return management.parentId == SL.companyId;
        });

        SL.BusinessUnitList = [];
        SL.DivisionList = [];
        SL.DepartmentList = [];
        SL.businessUnitId = 0;
        SL.divisionId = 0;
        SL.departmentId = 0;

        for (let businessUnit of businessUnits) {
            var dropdown = new DropDownData();
            dropdown.Key = businessUnit.managementStructureId.toLocaleString();
            dropdown.Value = businessUnit.code;
            SL.BusinessUnitList.push(dropdown);
        }
    }

    private getStockLineDivision(SL: StockLine): void {
        if (SL.businessUnitId != undefined && SL.businessUnitId > 0) {
            SL.managementStructureEntityId = SL.businessUnitId;
        }
        else {
            SL.managementStructureEntityId = SL.companyId;
        }

        var divisions = this.managementStructure.filter(function (management) {
            return management.parentId == SL.businessUnitId;
        });

        SL.DivisionList = [];
        SL.DepartmentList = [];
        SL.divisionId = 0;
        SL.departmentId = 0;

        for (let division of divisions) {
            var dropdown = new DropDownData();
            dropdown.Key = division.managementStructureId.toLocaleString();
            dropdown.Value = division.code;
            SL.DivisionList.push(dropdown);
        }
    }

    private getStockLineDepartment(SL: StockLine): void {

        if (SL.divisionId != undefined && SL.divisionId > 0) {
            SL.managementStructureEntityId = SL.divisionId;
        }
        else {
            SL.managementStructureEntityId = SL.businessUnitId;
        }

        var departments = this.managementStructure.filter(function (management) {
            return management.parentId == SL.divisionId;
        });

        SL.DepartmentList = [];
        SL.departmentId = 0;
        for (let deparment of departments) {
            var dropdown = new DropDownData();
            dropdown.Key = deparment.managementStructureId.toLocaleString();
            dropdown.Value = deparment.code;
            SL.DepartmentList.push(dropdown);
        }
    }

    private setStockLineDepartmentManagementStructureId(SL: StockLine) {
        if (SL.departmentId != undefined && SL.departmentId > 0) {
            SL.managementStructureEntityId = SL.departmentId;
        }
        else {
            SL.managementStructureEntityId = SL.divisionId;
        }
    }

    private getAllSite() {
        if (this.arraySitelist.length == 0) {
            this.arraySitelist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Site', 'SiteId', 'Name', '', true, 0, this.arraySitelist.join(), this.currentUserMasterCompanyId).subscribe(
            results => {
                this.SiteList = results.map(x => {
                    return {
                        siteId: x.value,
                        name: x.label
                    }
                });
                for (var part of this.purchaseOrderData.purchaseOderPart) {
                    if (part.stockLine) {
                        part.SiteList = [];
                        for (var site of this.SiteList) {
                            var row = new DropDownData();
                            row.Key = site.siteId.toLocaleString();
                            row.Value = site.name;
                            part.SiteList.push(row);
                        }

                        for (var SL of part.stockLine) {
                            SL.SiteList = [];
                            for (var site of this.SiteList) {
                                var row = new DropDownData();
                                row.Key = site.siteId.toLocaleString();
                                row.Value = site.name;
                                SL.SiteList.push(row);
                            }
                            if (SL.siteId > 0) {
                                this.getStockLineWareHouse(SL, true);
                            }
                            if (SL.warehouseId > 0) {
                                this.getStockLineLocation(SL, true);
                            }
                            if (SL.locationId > 0) {
                                this.getStockLineShelf(SL, true);
                            }
                            if (SL.shelfId > 0) {
                                this.getStockLineBin(SL, true);
                            }
                        }
                    }
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    private getStockLineSite(stockLine: StockLine, onPageLoad: boolean): void {
        stockLine.SiteList = [];
        stockLine.WareHouseList = [];
        stockLine.LocationList = [];
        stockLine.ShelfList = [];
        stockLine.BinList = [];

        if (!onPageLoad) {
            stockLine.siteId = 0;
            stockLine.warehouseId = 0;
            stockLine.locationId = 0;
            stockLine.shelfId = 0;
            stockLine.binId = 0;
        }

        for (let site of this.SiteList) {
            var dropdown = new DropDownData();
            dropdown.Key = site.siteId.toLocaleString();
            dropdown.Value = site.name;
            stockLine.SiteList.push(dropdown);
        }
    }

    public getStockLineWareHouse(stockLine: StockLine, onPageLoad: boolean): void {
        stockLine.WareHouseList = [];
        stockLine.LocationList = [];
        stockLine.ShelfList = [];
        stockLine.BinList = [];

        if (!onPageLoad) {
            stockLine.warehouseId = 0;
            stockLine.locationId = 0;
            stockLine.shelfId = 0;
            stockLine.binId = 0;
        }

        if (stockLine.siteId != 0) {
            this.commonService.smartDropDownList('Warehouse', 'WarehouseId', 'Name', 'SiteId', stockLine.siteId).subscribe(
                results => {
                    for (let wareHouse of results) {
                        var dropdown = new DropDownData();
                        dropdown.Key = wareHouse.value.toLocaleString();
                        dropdown.Value = wareHouse.label;
                        stockLine.WareHouseList.push(dropdown);
                    }
                },
                error => this.onDataLoadFailed(error)
            );
        }
    }

    public getStockLineLocation(stockLine: StockLine, onPageLoad: boolean): void {
        stockLine.LocationList = [];
        stockLine.ShelfList = [];
        stockLine.BinList = [];

        if (!onPageLoad) {
            stockLine.locationId = 0;
            stockLine.shelfId = 0;
            stockLine.binId = 0;
        }

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

    public getStockLineShelf(stockLine: StockLine, onPageLoad: boolean): void {
        stockLine.ShelfList = [];
        stockLine.BinList = [];

        if (!onPageLoad) {
            stockLine.shelfId = 0;
            stockLine.binId = 0;
        }

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

    public getPartWareHouse(part: PurchaseOrderPart, onLoad?): void {
        part.WareHouseList = [];
        part.LocationList = [];
        part.ShelfList = [];
        part.BinList = [];

        part.warehouseId = 0;
        part.locationId = 0;
        part.shelfId = 0;
        part.binId = 0;

        if (part.stockLine && onLoad) {
            for (var SL of part.stockLine) {
                if (SL.stockLineId > 0) {
                }
                else {
                SL.siteId = part.siteId;
                SL.warehouseId = 0;
                SL.locationId = 0;
                SL.shelfId = 0;
                SL.binId = 0;

                SL.WareHouseList = [];
                SL.LocationList = [];
                SL.ShelfList = [];
                SL.BinList = [];
                }
            }
        }

        this.commonService.smartDropDownList('Warehouse', 'WarehouseId', 'Name', 'SiteId', part.siteId).subscribe(
            results => {
                for (let wareHouse of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = wareHouse.value.toLocaleString();
                    dropdown.Value = wareHouse.label;
                    part.WareHouseList.push(dropdown);

                    if (part.stockLine && onLoad) {
                        for (var SL of part.stockLine) {
                            if (SL.stockLineId > 0) {

                            }
                            else {
                                SL.WareHouseList.push(dropdown);
                            }
                        }
                    }
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    public getPartLocation(part: PurchaseOrderPart, onLoad?): void {
        part.LocationList = [];
        part.ShelfList = [];
        part.BinList = [];

        part.locationId = 0;
        part.shelfId = 0;
        part.binId = 0;

        if (part.stockLine && onLoad) {
            for (var SL of part.stockLine) {
                if (SL.stockLineId > 0) {
                }else {
                SL.warehouseId = part.warehouseId;
                SL.locationId = 0;
                SL.shelfId = 0;
                SL.binId = 0;
                SL.LocationList = [];
                SL.ShelfList = [];
                SL.BinList = [];
                }
            }
        }

        this.commonService.smartDropDownList('Location', 'LocationId', 'Name', 'WarehouseId', part.warehouseId).subscribe(
            results => {
                for (let loc of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = loc.value.toLocaleString();
                    dropdown.Value = loc.label;
                    part.LocationList.push(dropdown);

                    if (part.stockLine && onLoad) {
                        for (var SL of part.stockLine) {
                            if (SL.stockLineId > 0) {
                            }else {
                            SL.LocationList.push(dropdown);
                            }
                        }
                    }
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    public getPartShelf(part: PurchaseOrderPart, onLoad?): void {
        part.ShelfList = [];
        part.BinList = [];

        part.shelfId = 0;
        part.binId = 0;

        if (part.stockLine && onLoad) {
            for (var SL of part.stockLine) {
                if (SL.stockLineId > 0) {
                }else {
                SL.locationId = part.locationId;
                SL.shelfId = 0;
                SL.binId = 0;
                SL.ShelfList = [];
                SL.BinList = [];
                }
            }
        }

        this.commonService.smartDropDownList('Shelf', 'ShelfId', 'Name', 'LocationId', part.locationId).subscribe(
            results => {
                for (let shelf of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = shelf.value.toLocaleString();
                    dropdown.Value = shelf.label;
                    part.ShelfList.push(dropdown);

                    if (part.stockLine && onLoad) {
                        for (var SL of part.stockLine) {
                            if (SL.stockLineId > 0) {
                            }else {
                            SL.ShelfList.push(dropdown);
                            }
                        }
                    }
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    public getPartBin(part: PurchaseOrderPart, onLoad?): void {
        part.BinList = [];
        part.binId = 0;

        if (part.stockLine && onLoad) {
            for (var SL of part.stockLine) {
                if (SL.stockLineId > 0) {
                }else {
                SL.shelfId = part.shelfId;
                SL.binId = 0;
                SL.BinList = [];
                }
            }
        }

        this.commonService.smartDropDownList('Bin', 'BinId', 'Name', 'ShelfId', part.shelfId).subscribe(
            results => {
                for (let bin of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = bin.value.toLocaleString();
                    dropdown.Value = bin.label;
                    part.BinList.push(dropdown);

                    if (part.stockLine && onLoad) {
                        for (var SL of part.stockLine) {
                            if (SL.stockLineId > 0) {
                            }else {
                            SL.BinList.push(dropdown);
                            }
                        }
                    }
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    public setPartBinIdToStockline(part: PurchaseOrderPart): void {
        if (part.stockLine) {
            for (var SL of part.stockLine) {
                if (SL.stockLineId > 0) {

                }
                else {
                    SL.binId = part.binId;
                }
            }
        }
    } 

    public conditionChange(part: PurchaseOrderPart) {
        if (part.stockLine) {
            for (var SL of part.stockLine) {
                if (SL.stockLineId > 0) {

                }
                else {
                    SL.conditionId = part.conditionId;
                }
            }
        }

    }

    public getStockLineBin(stockLine: StockLine, onPageLoad: boolean): void {
        stockLine.BinList = [];

        if (!onPageLoad) {
            stockLine.binId = 0;
        }

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

    calculateExtendedCost(part: any, stockLine: any): void {        
        if (stockLine.purchaseOrderUnitCost == undefined || stockLine.purchaseOrderUnitCost == '') {
            return;
        }
        if (part.itemMaster.isSerialized) {
            stockLine.purchaseOrderExtendedCost = stockLine.purchaseOrderUnitCost;
        }
        else {
            const unitCost = stockLine.purchaseOrderUnitCost ? parseFloat(stockLine.purchaseOrderUnitCost.toString().replace(/\,/g, '')) : 0;
            //stockLine.purchaseOrderExtendedCost = unitCost * part.quantityActuallyReceived;  
            stockLine.purchaseOrderExtendedCost = unitCost * stockLine.quantity;
        }
        if (stockLine.purchaseOrderUnitCost) {
            stockLine.purchaseOrderUnitCost = stockLine.purchaseOrderUnitCost ? formatNumberAsGlobalSettingsModule(stockLine.purchaseOrderUnitCost, 2) : '0.00';
        }
        if (stockLine.purchaseOrderExtendedCost) {
            stockLine.purchaseOrderExtendedCost = stockLine.purchaseOrderExtendedCost ? formatNumberAsGlobalSettingsModule(stockLine.purchaseOrderExtendedCost, 2) : '0.00';
        }
    }

    calculatePartExtendedCost(part: any): void {                
        if (part.unitCost == undefined || part.unitCost == '') {
            return;
        }
        part.unitCost = part.unitCost ? formatNumberAsGlobalSettingsModule(part.unitCost, 2) : '0.00';
        if (part.itemMaster.isSerialized) {
            const unitCost = part.unitCost ? parseFloat(part.unitCost.toString().replace(/\,/g, '')) : 0;
            const extendedCost = unitCost;
            part.extendedCost = extendedCost ? formatNumberAsGlobalSettingsModule(extendedCost, 2) : '0.00';
        }
        else {
            const unitCost = part.unitCost ? parseFloat(part.unitCost.toString().replace(/\,/g, '')) : 0;
            //const extendedCost = unitCost * part.quantityActuallyReceived; 
            const extendedCost = unitCost * part.quantityOrdered;
            part.extendedCost = extendedCost ? formatNumberAsGlobalSettingsModule(extendedCost, 2) : '0.00';
        }

        if (part.stockLine) {
            for (var SL of part.stockLine) {
                if (SL.stockLineId > 0) {

                }
                else {
                    SL.purchaseOrderUnitCost = part.unitCost;
                    SL.purchaseOrderExtendedCost = part.extendedCost;
                }               
            }
        }
    }

    private onDataLoadFailed(error: any) {
        this.isSpinnerVisible = false;
    }

    onObtainFromChange(event, stockLine) {
        stockLine.obtainFromObject = {};
        stockLine.obtainFrom = '';

        if (event.target.value === this.customerModuleId) {
            this.obtainfromcustomer = true;
            this.obtainfromother = false;
            this.obtainfromvendor = false;
        }
        if (event.target.value === this.otherModuleId) {
            this.obtainfromother = true;
            this.obtainfromcustomer = false;
            this.obtainfromvendor = false;
        }
        if (event.target.value === this.vendorModuleId) {
            this.obtainfromvendor = true;
            this.obtainfromcustomer = false;
            this.obtainfromother = false;
        }
    }

    onTaggedTypeChange(event, stockLine) {
        stockLine.taggedBy = '';
        stockLine.taggedByObject = {};

        if (event.target.value === AppModuleEnum.Customer) {
            this.obtainfromcustomer = true;
            this.obtainfromother = false;
            this.obtainfromvendor = false;
        }
        if (event.target.value === AppModuleEnum.Vendor) {
            this.obtainfromother = true;
            this.obtainfromcustomer = false;
            this.obtainfromvendor = false;
        }
        if (event.target.value === AppModuleEnum.Company) {
            this.obtainfromvendor = true;
            this.obtainfromcustomer = false;
            this.obtainfromother = false;
        }
    }

    onCertTypeChange(event, stockLine) {
        stockLine.certifiedById = '';
        stockLine.certByObject = {};

        if (event.target.value === AppModuleEnum.Customer) {
            this.certbycustomer = true;
            this.certbyother = false;
            this.certbyvendor = false;
        }
        if (event.target.value === AppModuleEnum.Vendor) {
            this.certbyother = true;
            this.certbycustomer = false;
            this.certbyvendor = false;
        }
        if (event.target.value === AppModuleEnum.Company) {
            this.certbyvendor = true;
            this.certbycustomer = false;
            this.certbyother = false;
        }
    }

    onOwnerChange(event, stockLine) {
        stockLine.ownerObject = {};
        stockLine.owner = '';

        if (event.target.value === this.customerModuleId) {
            this.ownercustomer = true;
            this.ownerother = false;
            this.ownervendor = false;
        }
        if (event.target.value === this.otherModuleId) {
            this.ownerother = true;
            this.ownercustomer = false;
            this.ownervendor = false;
        }
        if (event.target.value === this.vendorModuleId) {
            this.ownervendor = true;
            this.ownercustomer = false;
            this.ownerother = false;
        }
    }

    onTraceableToChange(event, stockLine) {
        stockLine.traceableToObject = '';
        stockLine.traceableTo = '';

        if (event.target.value === this.customerModuleId) {
            this.traceabletocustomer = true;
            this.traceabletoother = false;
            this.traceabletovendor = false;
        }
        if (event.target.value === this.otherModuleId) {
            this.traceabletoother = true;
            this.traceabletocustomer = false;
            this.traceabletovendor = false;
        }
        if (event.target.value === this.vendorModuleId) {
            this.traceabletovendor = true;
            this.traceabletocustomer = false;
            this.traceabletoother = false;
        }
    }

    onFilter(event, stockLine, type): void {
        if (event.query !== undefined && event.query !== null) {
            if (type == AppModuleEnum.Customer) {
                this.getCustomers(event.query);
            } else if (type == AppModuleEnum.Vendor) {
                this.getVendors(event.query);
            } else if (type == AppModuleEnum.Company) {
                this.getCompanyList(event.query);
            }
        }
    }


    // onFilter(event, stockLine, type): void {
    //     stockLine.filteredRecords = [];        
    //     if(type == 1) {
    //         var dropdownSource = this.CustomerList;
    //     } else if(type == 2) {
    //         var dropdownSource = this.VendorList;
    //     } else if(type == 9) {
    //         var dropdownSource = this.CompanyList;
    //     }
    //     if (dropdownSource != undefined && dropdownSource.length > 0) {
    //         for (let row of dropdownSource) {
    //             if (row.Value != undefined && row.Value.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
    //                 stockLine.filteredRecords.push(row);
    //             }
    //         }
    //     }
    // }

    onObtainSelect(stockLine: StockLine): void {
        stockLine.obtainFrom = stockLine.obtainFromObject.Key;
        if (stockLine.ownerType == AppModuleEnum.Customer) {
            this.arrayCustlist.push(stockLine.obtainFromObject.Key);
        } else if (stockLine.ownerType == AppModuleEnum.Vendor) {
            this.arrayVendlsit.push(stockLine.obtainFromObject.Key);
        } else if (stockLine.ownerType == AppModuleEnum.Company) {
            this.arrayComplist.push(stockLine.obtainFromObject.Key);
        }
    }

    onOwnerSelect(stockLine: StockLine): void {        
        stockLine.owner = stockLine.ownerObject.Key;
        if (stockLine.ownerType == AppModuleEnum.Customer) {
            this.arrayCustlist.push(stockLine.ownerObject.Key);
        } else if (stockLine.ownerType == AppModuleEnum.Vendor) {
            this.arrayVendlsit.push(stockLine.ownerObject.Key);
        } else if (stockLine.ownerType == AppModuleEnum.Company) {
            this.arrayComplist.push(stockLine.ownerObject.Key);
        }
    }

    onTraceableToSelect(stockLine: StockLine): void {
        stockLine.traceableTo = stockLine.traceableToObject.Key;
        if (stockLine.ownerType == AppModuleEnum.Customer) {
            this.arrayCustlist.push(stockLine.traceableToObject.Key);
        } else if (stockLine.ownerType == AppModuleEnum.Vendor) {
            this.arrayVendlsit.push(stockLine.traceableToObject.Key);
        } else if (stockLine.ownerType == AppModuleEnum.Company) {
            this.arrayComplist.push(stockLine.traceableToObject.Key);
        }
    }

    ontagTypeSelect(stockLine: StockLine, type): void {
        stockLine.taggedBy = stockLine.taggedByObject.Key;         
        if (type == AppModuleEnum.Customer) {
            this.arrayCustlist.push(stockLine.taggedByObject.Key);
        } else if (type == AppModuleEnum.Vendor) {
            this.arrayVendlsit.push(stockLine.taggedByObject.Key);
        } else if (type == AppModuleEnum.Company) {
            this.arrayComplist.push(stockLine.taggedByObject.Key);
        }
    }

    oncertTypeSelect(stockLine: StockLine, type): void {
        stockLine.certifiedById = stockLine.certByObject.Key;         
        if (type == AppModuleEnum.Customer) {
            this.arrayCustlist.push(stockLine.certByObject.Key);
        } else if (type == AppModuleEnum.Vendor) {
            this.arrayVendlsit.push(stockLine.certByObject.Key);
        } else if (type == AppModuleEnum.Company) {
            this.arrayComplist.push(stockLine.certByObject.Key);
        }
    }

    //remove once add dynamic content
    editPart(part: PurchaseOrderPart) {
        part.isEnabled = !part.isEnabled;
        if (part.stockLine) {
            for (var sl of part.stockLine) {
                if (sl.stockLineId > 0) {
                    sl.isEnabled = false;
                }
                else {
                    sl.isEnabled = part.isEnabled;
                }
                sl.quantityRejected = 0;
            }
        }
    }

    deletestockline : any
    deleteStockLine(stockLine: StockLine,deletepoConfirm) {
        if (stockLine) {
            this.modal = this.modalService.open(deletepoConfirm, { size: 'sm', backdrop: 'static', keyboard: false });
            this.deletestockline = stockLine;
            return;
            //var OkCancel = confirm("Stock Line will be deleted after save/update. Do you still want to continue?");
            // if (OkCancel == true) {
            //     stockLine.isEnabled = true;
            //     stockLine.isDeleted = true;
            //     this.alertService.showMessage(this.pageTitle, 'Stock Line removed from the list.', MessageSeverity.success);
            //     return;
            // }
        }
    }

    DeleteStockLineCloseModel(){        
        this.deletestockline.isEnabled = true;
        this.deletestockline.isDeleted = true;
        this.alertService.showMessage(this.pageTitle, 'Stock Line removed from the list.', MessageSeverity.success);
        this.modal.close();		
    }

    editStockLine(stockLine: StockLine) {
        stockLine.isEnabled = !stockLine.isEnabled;
        stockLine.quantityRejected = 0;
    }

    updateStockLine() {
        let receiveParts: ReceiveParts[] = [];
        for (var part of this.purchaseOrderData.purchaseOderPart) {
            if (part.stockLine) {
                var timeLife = [];

                var stockLineToUpdate = part.stockLine;
                var index = 1;
                for (var stockLine of stockLineToUpdate) {

                    stockLine.updatedBy = this.userName;
                    stockLine.purchaseOrderId = this.receivingService.purchaseOrderId;
                    stockLine.masterCompanyId = this.currentUserMasterCompanyId;

                    if (stockLine.unitOfMeasureId == undefined ||  stockLine.unitOfMeasureId == 0) {
                        this.alertService.showMessage(this.pageTitle,"Please select Unit Of Measure in Receiving Qty - "  + part.itemMaster.partNumber + " at stockline " + stockLine.stockLineNumber, MessageSeverity.error);
                        return
                    }
                    if (stockLine.conditionId == undefined || stockLine.conditionId == 0) {
                        this.alertService.showMessage(this.pageTitle, "Please select Condition in Part No. " + part.itemMaster.partNumber + " at stockline " + stockLine.stockLineNumber, MessageSeverity.error);
                        return;
                    }
                    if (stockLine.siteId == undefined || stockLine.siteId == 0) {
                        this.alertService.showMessage(this.pageTitle, "Please select Site in Part No. " + part.itemMaster.partNumber + " of stockline " + stockLine.stockLineNumber, MessageSeverity.error);
                        return;
                    }
                    if (stockLine.purchaseOrderUnitCost == undefined || (stockLine.purchaseOrderUnitCost != undefined && stockLine.purchaseOrderUnitCost.toString() == '')) {
                        this.alertService.showMessage(this.pageTitle, "Please enter Unit Cost in Part No. " + part.itemMaster.partNumber + " of stockline " + stockLine.stockLineNumber, MessageSeverity.error);
                        return;
                    }                    
                    if(stockLine.manufacturingDate){
                        if(stockLine.tagDate){
                            if (new Date(stockLine.tagDate) <=  new Date(stockLine.manufacturingDate)) {   
                                this.alertService.showMessage(this.pageTitle, "Tag Date must be greater than Manufacturing Date. " + part.itemMaster.partNumber + " of stockline " + stockLine.stockLineNumber, MessageSeverity.error);
                                return;                                                            
                            }
                         }                      
                         if(stockLine.certifiedDate){
                            if (new Date(stockLine.certifiedDate) <= new Date(stockLine.manufacturingDate)) {
                                this.alertService.showMessage(this.pageTitle, "Certified Date must be greater than Manufacturing Date. " + part.itemMaster.partNumber + " of stockline " + stockLine.stockLineNumber, MessageSeverity.error);
                                return;                                  
                            }
                        }
                    }
                    for (var tl of part.timeLife) {
                        if (tl.stockLineDraftId == stockLine.stockLineDraftId) {
                            timeLife.push(tl);
                        }
                    }
                    if (stockLine.tagType && stockLine.tagType.length > 0) {
                        stockLine.tagTypeId = stockLine.tagType.join();                
                        stockLine.tagType = stockLine.tagTypeId.split(',');
                        for (let i = 0; i < stockLine.tagType.length; i++) {
                            stockLine.tagType[i] = getValueFromArrayOfObjectById('label', 'value', stockLine.tagType[i], this.TagTypeList);
                        }
                        stockLine.tagType = stockLine.tagType.join();
                    } else {
                        stockLine.tagType = "";
                        stockLine.tagTypeId = "";
                    }
                    index += 1;
                }

                if (stockLineToUpdate.length > 0) {
                    let receivePart: ReceiveParts = new ReceiveParts();
                    receivePart.purchaseOrderPartRecordId = part.purchaseOrderPartRecordId;
                    receivePart.managementStructureEntityId = part.managementStructureEntityId ? part.managementStructureEntityId : null;
                    receivePart.stockLines = stockLineToUpdate;
                    receivePart.timeLife = this.getTimeLife(timeLife, part.purchaseOrderPartRecordId);
                    receiveParts.push(receivePart);
                }
            }
        }
        if (receiveParts.length > 0) {
            this.isSpinnerVisible = true;            
            this.shippingService.updateStockLine(receiveParts).subscribe(data => {
                this.alertService.showMessage(this.pageTitle, 'Stock Line Draft Updated Successfully.', MessageSeverity.success);
                this.isSpinnerVisible = false;
                //return this.route.navigate(['/receivingmodule/receivingpages/app-purchase-order']);
                this.route.navigateByUrl(`/receivingmodule/receivingpages/app-view-po?purchaseOrderId=${this.receivingService.purchaseOrderId}`);
            },
            errr => {
                this.isSpinnerVisible = false;
            });
        }
        else {
            this.alertService.showMessage(this.pageTitle, 'Please edit Stock Line to update.', MessageSeverity.info);
        }
    }

    getTimeLife(timeLife, purchaseOrderPartRecordId) {
        let tmLife = [];
        tmLife = timeLife.map(x => {
            return {
                stockLineDraftId: x.stockLineDraftId,
                timeLifeDraftCyclesId: x.timeLifeDraftCyclesId,
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
                isActive: true,
                createdBy: this.userName,
                updatedBy: this.userName,
                masterCompanyId: this.currentUserMasterCompanyId,
                purchaseOrderId: this.receivingService.purchaseOrderId,
            }
        })
        return tmLife;
    }

    onChangeTimeLifeMin(str, index) {
        for (let i = 0; i < this.purchaseOrderData.purchaseOderPart.length; i++) {
            let part = this.purchaseOrderData.purchaseOderPart[i];
            let value = part.timeLife[index][str];
            if (value > 59) {
                part.timeLife[index][str] = 0;
                this.alertService.showMessage(this.pageTitle, 'Minutes can\'t be greater than 59', MessageSeverity.error);
            }
        }
    }

    getShippingVia(strText = '') {
        if (this.arrayshipvialist.length == 0) {
            this.arrayshipvialist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('ShippingVia', 'ShippingViaId', 'Name', strText,
            true, 0, this.arrayshipvialist.join(), this.currentUserMasterCompanyId).subscribe(res => {
                const data = res.map(x => {
                    return {
                        Key: x.value,
                        Value: x.label
                    }
                });
                this.ShippingViaList = data;
            })
    }

    getManufacturers(strText = '') {
        if (this.arraymanufacturerlist.length == 0) {
            this.arraymanufacturerlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Manufacturer', 'ManufacturerId', 'Name', strText, true, 20, this.arraymanufacturerlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
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



    getPartBUList(part) {
        if (part.stockLine != null) {
            part.stockLine.map(x => {
                part.BusinessUnitList = [];
                part.DivisionList = [];
                part.DepartmentList = [];
                part.businessUnitId = 0;
                part.divisionId = 0;
                part.departmentId = 0;

                x.BusinessUnitList = [];
                x.DivisionList = [];
                x.DepartmentList = [];
                x.businessUnitId = 0;
                x.divisionId = 0;
                x.departmentId = 0;

                x.companyId = part.companyId;
                if (part.companyId != 0 && part.companyId != null && part.companyId != undefined) {
                    x.managementStructureEntityId = part.companyId;
                    part.managementStructureEntityId = part.companyId;
                    this.commonService.getBusinessUnitListByLegalEntityId(part.companyId).subscribe(res => {
                        part.BusinessUnitList = res;
                        x.BusinessUnitList = res;
                    });
                }
            })
        }
    }

    getPartDiviList(part) {
        if (part.stockLine != null) {
            part.stockLine.map(x => {
                part.DivisionList = [];
                part.DepartmentList = [];
                part.divisionId = 0;
                part.departmentId = 0;

                x.DivisionList = [];
                x.DepartmentList = [];
                x.divisionId = 0;
                x.departmentId = 0;

                x.businessUnitId = part.businessUnitId;
                if (part.businessUnitId != 0 && part.businessUnitId != null && part.businessUnitId != undefined) {
                    x.managementStructureEntityId = part.businessUnitId;
                    part.managementStructureEntityId = part.businessUnitId;
                    this.commonService.getDivisionListByBU(part.businessUnitId).subscribe(res => {
                        part.DivisionList = res;
                        x.DivisionList = res;
                    })
                }
            })
        }
    }

    getPartDeptList(part) {
        if (part.stockLine != null) {
            part.stockLine.map(x => {
                part.DepartmentList = [];
                part.departmentId = 0;

                x.DepartmentList = [];
                x.departmentId = 0;

                x.divisionId = part.divisionId;
                if (part.divisionId != 0 && part.divisionId != null && part.divisionId != undefined) {
                    x.managementStructureEntityId = part.divisionId;
                    part.managementStructureEntityId = part.divisionId;
                    this.commonService.getDepartmentListByDivisionId(part.divisionId).subscribe(res => {
                        part.DepartmentList = res;
                        x.DepartmentList = res;
                    })
                }
            })
        }
    }

    onSelectPartDept(part) {
        if (part.stockLine != null) {
            part.stockLine.map(x => {
                x.departmentId = part.departmentId;
                if (part.departmentId != 0 && part.departmentId != null && part.departmentId != undefined) {
                    x.managementStructureEntityId = part.departmentId;
                    part.managementStructureEntityId = part.departmentId;
                }
            })
        }
    }

    getManagementStructureDetailsForStockline(SL) {
        this.commonService.getManagementStructureDetails(SL.managementStructureEntityId).subscribe(res => {
            this.getStockLineBUList(SL, res.Level1);
            this.getStockLineDiviList(SL, res.Level2);
            this.getStockLineDeptList(SL, res.Level3);
            this.onSelectStockLineDept(SL, res.Level4);
            SL.companyId = res.Level1 !== undefined ? res.Level1 : 0;
            SL.businessUnitId = res.Level1 !== undefined ? res.Level2 : 0;
            SL.divisionId = res.Level1 !== undefined ? res.Level3 : 0;
            SL.departmentId = res.Level1 !== undefined ? res.Level4 : 0;
        })
    }

    getStockLineBUList(SL, companyId) {
        SL.BusinessUnitList = [];
        SL.DivisionList = [];
        SL.DepartmentList = [];
        SL.businessUnitId = 0;
        SL.divisionId = 0;
        SL.departmentId = 0;

        if (companyId != 0 && companyId != null && companyId != undefined) {
            SL.managementStructureEntityId = companyId;
            this.commonService.getBusinessUnitListByLegalEntityId(companyId).subscribe(res => {
                SL.BusinessUnitList = res;
            });
        }
    }

    getStockLineDiviList(SL, businessUnitId) {
        SL.DivisionList = [];
        SL.DepartmentList = [];
        SL.divisionId = 0;
        SL.departmentId = 0;

        if (businessUnitId != 0 && businessUnitId != null && businessUnitId != undefined) {
            SL.managementStructureEntityId = businessUnitId;
            this.commonService.getDivisionListByBU(businessUnitId).subscribe(res => {
                SL.DivisionList = res;
            })
        }
    }

    getStockLineDeptList(SL, divisionId) {
        SL.DepartmentList = [];
        SL.departmentId = 0;

        if (divisionId != 0 && divisionId != null && divisionId != undefined) {
            SL.managementStructureEntityId = divisionId;
            this.commonService.getDepartmentListByDivisionId(divisionId).subscribe(res => {
                SL.DepartmentList = res;
            })
        }
    }

    onSelectStockLineDept(SL, departmentId) {
        if (departmentId != 0 && departmentId != null && departmentId != undefined) {
            SL.managementStructureEntityId = departmentId;
        }
    }
    
    TagByNames: DropDownData[] = [];
    arrayTagEmployeelist: any[] = [];
    alltagEmployeeList: any = [];
    allPurchaseUnitOfMeasureinfo: any[] = [];    
    
    loadTagByEmployeeData(strText = '') {		
		if (this.arrayTagEmployeelist.length == 0) {
			this.arrayTagEmployeelist.push(0);
		}	
		this.commonService.autoCompleteDropdownsEmployeeByMS(strText, true, 20, this.arrayTagEmployeelist.join(), this.currentUserManagementStructureId)
			.subscribe(response => {				               
                const data = response.map(x => {
                    return {
                        Key: x.value.toString(),
                        Value: x.label
                    }
                });                
                this.TagByNames = data;   
                for (let part of this.purchaseOrderData.purchaseOderPart) {
                    for (let SL of part.stockLine) {    
                        if (SL.taggedBy != null) {
                            SL.taggedByObject = this.TagByNames.find(x => x.Key == SL.taggedBy);
                        }                       
                    }
                }
				
			}, error => {});
    }

    filterTagEmployees(event,stockLine) {        
		if (event.query !== undefined && event.query !== null) {
			this.loadTagByEmployeeData(event.query);
		}
    }       

    onOwnerSelectTag(stockLine: StockLine): void {          
        stockLine.taggedBy = stockLine.taggedByObject.Key;
        this.arrayTagEmployeelist.push(stockLine.taggedByObject.Key);        
    } 

    Purchaseunitofmeasure() {
		this.commonService.smartDropDownList('UnitOfMeasure', 'unitOfMeasureId', 'shortname','','', 0,this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.allPurchaseUnitOfMeasureinfo = res;            
            for (let part of this.purchaseOrderData.purchaseOderPart) {
                for (let SL of part.stockLine) {    
                    if (SL.unitOfMeasureId != null) {                       
                        var unitofmasure = this.allPurchaseUnitOfMeasureinfo.find(temp => temp.value == SL.unitOfMeasureId)
                        if (!unitofmasure || unitofmasure == undefined) {
                            var uom = {label:SL.unitOfMeasure , value : SL.unitOfMeasureId}
                            this.allPurchaseUnitOfMeasureinfo.push(uom);
                        }
                    }                       
                }
            }
		})
    }

    TagTypeList: any = [];
    getTagType(strText = '') {
        if (this.arraytagtypelist.length == 0) {
            this.arraytagtypelist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('TagType', 'TagTypeId', 'Name', strText,true, 0, this.arraytagtypelist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.TagTypeList = res;            
            for (let part of this.purchaseOrderData.purchaseOderPart) {
                for (let SL of part.stockLine) {    
                    if (SL.tagType && SL.tagType.length > 0) {                                      
                        SL.tagType = SL.tagTypeId.split(',');
                        for (let i = 0; i < SL.tagType.length; i++) { 
                            SL.tagType[i] = parseInt(SL.tagType[i]);
                        }                       

                    } else {
                        SL.tagType = "";
                        SL.tagTypeId = "";
                    }                      
                }
            }
        })
    }   

    CloseModel(status) {
		this.modal.close();		
	}

}

