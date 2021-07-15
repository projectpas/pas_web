import { AppModuleEnum } from './../../../../enum/appmodule.enum';
//import { StockLine } from './../../repair-order/receiving-ro/RepairOrder.model';
import { Component, OnInit } from '@angular/core';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { CreditTermsService } from '../../../../services/Credit Terms.service';
import { VendorService } from '../../../../services/vendor.service';
import { PriorityService } from '../../../../services/priority.service';
import { ConditionService } from '../../../../services/condition.service';
import { UnitOfMeasureService } from '../../../../services/unitofmeasure.service';
import { CurrencyService } from '../../../../services/currency.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router'
import { EmployeeService } from '../../../../services/employee.service';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { CustomerService } from '../../../../services/customer.service';
import { SiteService } from '../../../../services/site.service';
import { WarehouseService } from '../../../../services/warehouse.service';
import { BinService } from '../../../../services/bin.service';
import { ManufacturerService } from '../../../../services/manufacturer.service';
import { StocklineService } from '../../../../services/stockline.service';
import { ReceivingService } from '../../../../services/receiving/receiving.service';
import { PurchaseOrder, PurchaseOrderPart, StockLine, StockLineDraft, DropDownData, TimeLife, ReceiveParts, TimeLifeDraft } from './PurchaseOrder.model';
import { ManagementStructure } from './managementstructure.model';
import { AccountService } from '../../../../services/account.service';
import { CompanyService } from '../../../../services/company.service'; import { AddressModel } from '../../../../models/address.model';
import { GlAccountService } from '../../../../services/glAccount/glAccount.service';
import { ShippingService } from '../../../../services/shipping/shipping-service';
import { TagTypeService } from '../../../../services/tagtype.service';
import { getValueFromObjectByKey, getValueFromArrayOfObjectById, formatNumberAsGlobalSettingsModule,getObjectById } from '../../../../generic/autocomplete';
import { CommonService } from '../../../../services/common.service';
import { LocalStoreManager } from '../../../../services/local-store-manager.service';
import { AuthService } from '../../../../services/auth.service';
import { DatePipe } from '@angular/common';
import { PurchaseOrderService } from '../../../../services/purchase-order.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs'
import * as moment from 'moment';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';



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
    ShippingViaList: DropDownData[] = [];
    TagTypeList: any = [];
    CertTypeList: any = [];
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
    taggedbycustomer : boolean = false;
    taggedbyother : boolean = false;
    taggedbyvendor : boolean = false;
    certbycustomer : boolean = false;
    certbyother : boolean = false;
    certbyvendor : boolean = false;
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
    arrayVendlsit: any[] = [];
    arrayComplist: any[] = [];
    arrayCustlist: any[] = [];
    arraymanufacturerlist: any[] = [];
    arrayConditionlist: any[] = [];
    arrayglaccountlist: any[] = [];
    arrayshipvialist: any[] = [];
    arraytagtypelist: any[] = [];
    arraycerttypelist: any[] = [];

    companyModuleId: number = 0;
    vendorModuleId: number = 0;
    customerModuleId: number = 0;
    otherModuleId: number = 0;
    alertText: string = '';
    modal: NgbModalRef;
    private onDestroy$: Subject<void> = new Subject<void>();
    isAddrpo:boolean=true;
    isEditrpo:boolean=true;
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
        private route: Router,
        public currencyService: CurrencyService,
        public unitofmeasureService: UnitOfMeasureService,
        public conditionService: ConditionService,
        public creditTermsService: CreditTermsService,
        public employeeService: EmployeeService,
        private alertService: AlertService,
        private shippingService: ShippingService,
        private _actRoute: ActivatedRoute,
        private commonService: CommonService,
        private authService: AuthService,

    ) {
        var lststockline = [];
        this.getCustomers('', lststockline);
        this.getCompanyList('', lststockline);
        this.getManufacturers();
        this.getConditionList();
        this.getAllGLAccount();
        this.getShippingVia();
        this.getTagType();
        this.getCertType();
        this.getLegalEntity();
        this.loadModulesNamesForObtainOwnerTraceable();
        this.Purchaseunitofmeasure();
        this.companyModuleId = AppModuleEnum.Company;
        this.vendorModuleId = AppModuleEnum.Vendor;
        this.customerModuleId = AppModuleEnum.Customer;
        this.otherModuleId = AppModuleEnum.Others;       
        this.isAddrpo = this.authService.checkPermission([ModuleConstants.ReceivePurchaseOrder+'.'+PermissionConstants.Add])
        this.isEditrpo = this.authService.checkPermission([ModuleConstants.ReceivePurchaseOrder+'.'+PermissionConstants.Update]) 
    }


    private getAllSite() {
        if (this.arraySitelist.length == 0) {
            this.arraySitelist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Site', 'SiteId', 'Name', '', true, 0, this.arraySitelist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.sites = res;
        });
    }

    getCustomers(strText = '', stockLine) {
        if (this.arrayCustlist.length == 0) {
            this.arrayCustlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', strText, true, 20, this.arrayCustlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            stockLine.filteredRecords = [];
            const data = response.map(x => {
                return {
                    Key: x.value.toString(),
                    Value: x.label
                }
            });
            this.CustomerList = data;
            stockLine.filteredRecords = this.CustomerList;
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    getVendors(filterVal = '', stockLine) {
        if (this.arrayVendlsit.length == 0) {
            this.arrayVendlsit.push(0);
        }
        this.vendorService.getVendorNameCodeListwithFilter(filterVal, 20, this.arrayVendlsit.join(), this.currentUserMasterCompanyId).subscribe(res => {
            stockLine.filteredRecords = [];
            const data = res.map(x => {
                return {
                    Key: x.vendorId,
                    Value: x.vendorName
                }
            });
            this.VendorList = data;
            stockLine.filteredRecords = this.VendorList;
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    dismissModel() {
        this.modal.close();
    }

    getCompanyList(strText = '', stockLine) {
        if (this.arrayComplist.length == 0) {
            this.arrayComplist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name', strText, true, 20, this.arrayComplist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            stockLine.filteredRecords = [];
            const data = response.map(x => {
                return {
                    Key: x.value.toString(),
                    Value: x.label
                }
            });
            this.CompanyList = data;
            stockLine.filteredRecords = this.CustomerList;
        }, err => {
            this.isSpinnerVisible = false;
        });
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

    getAllGLAccount(strText = '') {
        if (this.arrayglaccountlist.length == 0) {
            this.arrayglaccountlist.push(0);
        }
        this.commonService.getAutoCompleteDropDownsByCodeWithName('GLAccount', 'GLAccountId', 'AccountName', 'AccountCode', strText, 20, this.arrayglaccountlist.join(),this.currentUserMasterCompanyId).subscribe(res => {
            const data = res.map(x => {
                return {
                    Key: x.value,
                    Value: x.label
                }
            });
            this.GLAccountList = data;
        })
    }

    getShippingVia(strText = '') {
        if (this.arrayshipvialist.length == 0) {
            this.arrayshipvialist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('ShippingVia', 'ShippingViaId', 'Name', strText,
            true, 0, this.arrayshipvialist.join(), this.currentUserMasterCompanyId).subscribe(res => {
                for (let company of res) {
                    var dropdown = new DropDownData();
                    dropdown.Key = company.value.toLocaleString();
                    dropdown.Value = company.label
                    this.ShippingViaList.push(dropdown);
                }
            })
    }

    getTagType(strText = '') {
        if (this.arraytagtypelist.length == 0) {
            this.arraytagtypelist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('TagType', 'TagTypeId', 'Name', strText,true, 0, this.arraytagtypelist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            // this.TagTypeList = res;
            for (let tag of res) {
                var dropdown = new DropDownData();
                dropdown.Key = tag.value.toLocaleString();
                dropdown.Value = tag.label
                this.TagTypeList.push(dropdown);
            }
        })
    }

    getCertType(strText = '') {
        if (this.arraycerttypelist.length == 0) {
            this.arraycerttypelist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('CertificationType', 'CertificationTypeId', 'CertificationName', strText,true, 0, this.arraycerttypelist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.CertTypeList = res;
        })
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

    arrayPostatuslist: any[] = [];
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

    private getStatusById(statusId: string) {
        if (statusId == null)
            return 'NA';
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

    get currentUserManagementStructureId(): number {
		return this.authService.currentUser
			? this.authService.currentUser.managementStructureId
			: null;
	}

    ngOnInit() {
        this.isSpinnerVisible = true;        
        this.receivingService.purchaseOrderId = this._actRoute.snapshot.queryParams['purchaseorderid'];        
        this.getReceivingPOHeaderById(this.receivingService.purchaseOrderId);
        this.receivingService.getPurchaseOrderDataById(this.receivingService.purchaseOrderId, this.employeeId).subscribe(
            results => {
                this.receivingService.purchaseOrder = results[0][0];
                this.loadPurchaseOrderData(results[0][0], results[0][1]);
                this.isSpinnerVisible = false;
            },
            error => {
                return this.route.navigate(['/receivingmodule/receivingpages/app-purchase-order']);
                this.isSpinnerVisible = false;
            }
        );
        this.quantityreceivebtn = false;
    }

    getReceivingPOHeaderById(id) {
        this.purchaseOrderService.getPOViewById(id).subscribe(
            res => {
                this.poDataHeader = res;
                this.arrayVendlsit.push(res.vendorId);
                var stockline = [];
                this.getVendors('', stockline);
                this.poDataHeader.purchaseOrderNumber = this.poDataHeader.purchaseOrderNumber;
                this.poDataHeader.openDate = this.poDataHeader.openDate ? new Date(this.poDataHeader.openDate) : '';
                this.poDataHeader.closedDate = this.poDataHeader.closedDate ? new Date(this.poDataHeader.closedDate) : '';
                this.poDataHeader.dateApproved = this.poDataHeader.dateApproved ? new Date(this.poDataHeader.dateApproved) : '';
                this.poDataHeader.needByDate = this.poDataHeader.needByDate ? new Date(this.poDataHeader.needByDate) : '';
                //var shippingVia = this.ShippingViaList.find(temp => temp.Key == this.poDataHeader.shipViaId);
                this.poDataHeader.creditLimit = this.poDataHeader.creditLimit ? formatNumberAsGlobalSettingsModule(this.poDataHeader.creditLimit, 2) : '0.00';
                // if (!shippingVia || shippingVia == undefined) {
                //     var shippingVia = new DropDownData();
                //     shippingVia.Key = this.poDataHeader.shipViaId;
                //     shippingVia.Value = this.poDataHeader.shipVia;
                //     this.ShippingViaList.push(shippingVia);
                // }
            });
    }

    private loadPurchaseOrderData(purchaseOrder: PurchaseOrder, partms) {
        this.purchaseOrderData = purchaseOrder;
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
                // parent.showHeader = true;
                var i = 0;
                for (let childPart of splitParts) {
                    // if (i == 0) {
                    //     parent.showHeader = true;
                    //     i = 1;
                    // }
                    // else {
                    //     parent.showHeader = false;
                    // }
                    parent.stockLineCount += childPart.stockLineCount;
                    parent.draftedStockLineCount += childPart.draftedStockLineCount;
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
            part.toggleIcon = true;
            part.stocklineListObj = [];
            part.timeLifeList = [];
            part.currentSLIndex = 0;
            part.currentTLIndex = 0;
            part.currentSERIndex = 0;
            part.isDisabledTLboxes = false;
            part.visible = true;
            part.showStockLineGrid = false;
            part.isSameDetailsForAllParts = false;
            this.arraySitelist.push(part.itemMaster.siteId);
            part.eCCNAlreadyExist = part.itemMaster.exportECCN != null && part.itemMaster.exportECCN.length > 0;
            part.itarNumberExist = part.itemMaster.itarNumber != null && part.itemMaster.itarNumber.length > 0;
            if (part.isParent) {
                parentPart = part;
            }
            else {
                part.addressText = this.getAddress(part.poPartSplitAddress);
                part.userName = part.poPartSplitUser;
                part.userTypeName = part.poPartSplitUserTypeName;
                part.statusText = part.status;
            }
            this.getManagementStructureForPart(part, partms)
        }

        this.purchaseOrderData.dateRequested = new Date();
        this.purchaseOrderData.dateApprovied = new Date(this.purchaseOrderData.dateApprovied);
        this.purchaseOrderData.needByDate = new Date(); //new Date(this.purchaseOrderData.needByDate);
        this.isSpinnerVisible = false;
        this.getAllSite();

        for (let i = 0; i < this.purchaseOrderData.purchaseOderPart.length; i++) {
            var K = 0;
            this.purchaseOrderData.purchaseOderPart.forEach(p => {
                if (p.parentId == this.purchaseOrderData.purchaseOderPart[i].purchaseOrderPartRecordId) {
                    if (K == 0) {
                        p.showHeader = true;
                        K = 1;
                    }
                    else {
                        p.showHeader = false;
                    }
                }
            });
        }


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

    public showSplitShipmentParts(purchaseOrderPart: PurchaseOrderPart): void {
        var selectedParts: any = this.purchaseOrderData.purchaseOderPart.filter(function (part) {
            return part.purchaseOrderPartRecordId == purchaseOrderPart.purchaseOrderPartRecordId;
        });

        selectedParts.forEach(part => {
            part.toggleIcon = !part.toggleIcon;
            part.visible = !part.visible;
        });

        this.purchaseOrderData.purchaseOderPart.forEach(part => {
            if (part.parentId == purchaseOrderPart.purchaseOrderPartRecordId) {
                part.visible = !part.visible;
            }
        });
    }

    public isSplitShipmentPart(purchaseOrderPartRecordId: number): boolean {
        return this.purchaseOrderData.purchaseOderPart.filter(x => x.parentId == purchaseOrderPartRecordId).length > 0;
    }

    public toggleStockLine(event: any, part: PurchaseOrderPart): void {  
                     
        var condtion = this.ConditionList.find(temp => temp.Key == part.conditionId.toString())
        /// For InActive condtion
        if (!condtion || condtion == undefined) {
            var condtion = new DropDownData();
            condtion.Key = part.conditionId.toString();
            condtion.Value = part.condition.toString();
            this.ConditionList.push(condtion);
        }
        /// For InActive GL Account      
        var glAccount = this.GLAccountList.find(temp => temp.Key == part.glAccountId.toString())
        if (!glAccount || glAccount == undefined) {
            var glAccount = new DropDownData();
            glAccount.Key = part.glAccountId.toString();
            glAccount.Value = part.glAccount.toString();
            this.GLAccountList.push(glAccount);
        }

        var manufacturer = this.ManufacturerList.find(temp => temp.Key == part.itemMaster.manufacturerId)
        if (!manufacturer || manufacturer == undefined) {
            var manufacturer = new DropDownData();
            manufacturer.Key = part.itemMaster.manufacturerId.toString();
            manufacturer.Value = part.itemMaster.manufacturerName.toString();
            this.ManufacturerList.push(manufacturer);
        }

        var unitofmasure = this.allPurchaseUnitOfMeasureinfo.find(temp => temp.value == part.unitOfMeasureId)
        if (!unitofmasure || unitofmasure == undefined) {
            var uom = {label:part.unitOfMeasure , value : part.unitOfMeasureId}
            this.allPurchaseUnitOfMeasureinfo.push(uom);
        }

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
            (!part.itemMaster.isSerialized && part.stocklineListObj.length > 0
                && part.stocklineListObj[0].quantity != quantity)) {
            part.stocklineListObj = []
            part.timeLifeList = [];
            part.isSameDetailsForAllParts = false;
            part.currentSLIndex = 0;
            part.currentTLIndex = 0;
            part.currentSERIndex = 0;
        }

        if (quantity > (part.quantityOrdered - part.stockLineCount - part.draftedStockLineCount - part.quantityRejected)) {
            this.alertService.showMessage(this.pageTitle, "Quantity receive can not be more than expected Qty", MessageSeverity.error);
            return;
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
    }

    createStockLineItems(part: PurchaseOrderPart): void {
        part.stocklineListObj = [];
        this.currentSLIndex = 0;
        for (var i = 0; i < part.quantityActuallyReceived; i++) {
            let stockLine: StockLineDraft = new StockLineDraft();
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
            stockLine.shippingViaId = this.poDataHeader.shipViaId;
            stockLine.shelfId = 0;
            stockLine.warehouseId = 0;
            stockLine.binId = 0;
            stockLine.repairOrderId = 0;
            stockLine.locationId = 0;
            stockLine.shippingAccount = this.poDataHeader.shippingAccountNo;
            stockLine.conditionId = 0;
            stockLine.masterCompanyId = this.currentUserMasterCompanyId;
            stockLine.createdBy = this.userName;
            stockLine.updatedBy = this.userName;
            stockLine.serialNumberNotProvided = false;
            stockLine.purchaseOrderUnitCost = 0;
            stockLine.purchaseOrderExtendedCost = part.unitCost;
            stockLine.currentDate = new Date();
            stockLine.obtainFromType = AppModuleEnum.Vendor; // default is vendor and set the value from purchase order.
            stockLine.obtainFrom = this.purchaseOrderData.vendor.vendorId;
            stockLine.taggedByType = AppModuleEnum.Vendor; // default is vendor and set the value from purchase order.
            stockLine.taggedBy = this.purchaseOrderData.vendor.vendorId;
            stockLine.certifiedTypeId = AppModuleEnum.Vendor; // default is vendor and set the value from purchase order.
            stockLine.certifiedById = this.purchaseOrderData.vendor.vendorId;
            stockLine.ownerType = AppModuleEnum.Vendor;
            stockLine.owner = this.purchaseOrderData.vendor.vendorId;           
            stockLine.unitOfMeasureId = part.unitOfMeasureId;
            stockLine.maincompanylist = part.maincompanylist;
            stockLine.parentCompanyId = part.parentCompanyId;
            stockLine.managementStructureEntityId = part.managementStructureId;
            stockLine.parentBulist = part.parentBulist;
            stockLine.parentDivisionlist = part.parentDivisionlist;
            stockLine.parentDepartmentlist = part.parentDepartmentlist;
            stockLine.parentbuId = part.parentbuId;
            stockLine.parentDivisionId = part.parentDivisionId;
            stockLine.parentDeptId = part.parentDeptId;
            stockLine.obtainFromObject = this.VendorList.find(x => x.Key == this.purchaseOrderData.vendor.vendorId.toString());
            stockLine.ownerObject = this.VendorList.find(x => x.Key == this.purchaseOrderData.vendor.vendorId.toString());
            stockLine.taggedByObject = this.VendorList.find(x => x.Key == this.purchaseOrderData.vendor.vendorId.toString());
            stockLine.certByObject = this.VendorList.find(x => x.Key == this.purchaseOrderData.vendor.vendorId.toString());            
            stockLine.tagTypeId = 0;
            if (part.itemMaster != undefined) {
                stockLine.purchaseOrderUnitCost = part.unitCost;
                if (!part.itemMaster.isSerialized) {
                    stockLine.purchaseOrderExtendedCost = part.quantityActuallyReceived * part.unitCost;
                }
            }
            this.getStockLineSite(stockLine);
            this.getSiteDetailsOnEdit(part, stockLine)

            part.stocklineListObj.push(stockLine);
        }
    }

    addStockLine(part, visible?: boolean): void {
        const stockObj: any = part.stocklineListObj;
        part.stocklineListObj = stockObj.map(x => {
            return {
                ...x,
                //siteId: this.getSiteDetailsOnEdit(part, x),               
                //shippingViaId: part.shipViaId ? part.shipViaId.toLocaleString() : null,
                shippingViaId: part.shipViaId ? part.shipViaId.toLocaleString() : null,                
                shippingAccount: part.shippingAccountInfo,
                purchaseOrderUnitCost: formatNumberAsGlobalSettingsModule(x.purchaseOrderUnitCost, 2),
                purchaseOrderExtendedCost: formatNumberAsGlobalSettingsModule(x.purchaseOrderExtendedCost, 2)
            }
        });
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
    }

    selectedLegalEntity(legalEntityId, stockLine) {
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

    selectedBusinessUnit(businessUnitId, stockLine) {
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

    selectedDivision(divisionUnitId, stockLine) {
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

    selectedDepartment(departmentId, stockLine) {
        if (stockLine.parentDeptId != 0 && stockLine.parentDeptId != null && stockLine.parentDeptId != undefined) {
            stockLine.managementStructureEntityId = stockLine.parentDeptId;
        }
        else {
            stockLine.managementStructureEntityId = stockLine.parentDivisionId;
        }
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
            this.commonService.smartDropDownList('Warehouse', 'WarehouseId', 'Name',this.authService.currentUser.masterCompanyId, 'SiteId', stockLine.siteId).subscribe(
                results => {
                    for (let wareHouse of results) {
                        var dropdown = new DropDownData();
                        dropdown.Key = wareHouse.value.toLocaleString();
                        dropdown.Value = wareHouse.label;
                        stockLine.WareHouseList.push(dropdown);
                    }
                }
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
            this.commonService.smartDropDownList('Location', 'LocationId', 'Name',this.authService.currentUser.masterCompanyId, 'WarehouseId', stockLine.warehouseId).subscribe(
                results => {

                    for (let loc of results) {
                        var dropdown = new DropDownData();
                        dropdown.Key = loc.value.toLocaleString();
                        dropdown.Value = loc.label;
                        stockLine.LocationList.push(dropdown);
                    }
                }
            );
        }
    }

    getStockLineShelf(stockLine: StockLine): void {
        stockLine.ShelfList = [];
        stockLine.shelfId = 0;
        stockLine.BinList = [];
        stockLine.binId = 0;
        if (stockLine.locationId) {
            this.commonService.smartDropDownList('Shelf', 'ShelfId', 'Name',this.authService.currentUser.masterCompanyId, 'LocationId', stockLine.locationId).subscribe(
                results => {

                    for (let shelf of results) {
                        var dropdown = new DropDownData();
                        dropdown.Key = shelf.value.toLocaleString();
                        dropdown.Value = shelf.label;
                        stockLine.ShelfList.push(dropdown);
                    }
                }
            );
        }
    }

    getStockLineBin(stockLine: StockLine): void {
        stockLine.BinList = [];
        stockLine.binId = 0;
        if (stockLine.shelfId) {
            this.commonService.smartDropDownList('Bin', 'BinId', 'Name',this.authService.currentUser.masterCompanyId, 'ShelfId', stockLine.shelfId).subscribe(
                results => {
                    for (let bin of results) {
                        var dropdown = new DropDownData();
                        dropdown.Key = bin.value.toLocaleString();
                        dropdown.Value = bin.label;
                        stockLine.BinList.push(dropdown);
                    }
                }
            );
        }

    }

    onFilter(event, stockLine, type): void {
        if (event.query !== undefined && event.query !== null) {
            if (type == AppModuleEnum.Customer) {
                this.getCustomers(event.query, stockLine);
            } else if (type == AppModuleEnum.Vendor) {
                this.getVendors(event.query, stockLine);
            } else if (type == AppModuleEnum.Company) {
                this.getCompanyList(event.query, stockLine);
            }
        }
    }


    onObtainFromChange(event, stockLine) {
        stockLine.obtainFrom = '';
        stockLine.obtainFromObject = {};

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

    onTaggedTypeChange(event, stockLine) {
        stockLine.taggedBy = '';
        stockLine.taggedByObject = {};

        if (event.target.value === AppModuleEnum.Customer) {
            this.taggedbycustomer = true;
            this.taggedbyother = false;
            this.taggedbyvendor = false;
        }
        if (event.target.value === AppModuleEnum.Vendor) {
            this.taggedbyother = true;
            this.taggedbycustomer = false;
            this.taggedbyvendor = false;
        }
        if (event.target.value === AppModuleEnum.Company) {
            this.taggedbyvendor = true;
            this.taggedbycustomer = false;
            this.taggedbyother = false;
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


    onObtainSelect(stockLine: StockLine, type): void {
        stockLine.obtainFrom = stockLine.obtainFromObject.Key;        
        if (type == AppModuleEnum.Customer) {
            this.arrayCustlist.push(stockLine.obtainFromObject.Key);
        } else if (type == AppModuleEnum.Vendor) {
            this.arrayVendlsit.push(stockLine.obtainFromObject.Key);
        } else if (type == AppModuleEnum.Company) {
            this.arrayComplist.push(stockLine.obtainFromObject.Key);
        }
    }

    onOwnerSelect(stockLine: StockLine, type): void {
        stockLine.owner = stockLine.ownerObject.Key;
        if (type == AppModuleEnum.Customer) {
            this.arrayCustlist.push(stockLine.ownerObject.Key);
        } else if (type == AppModuleEnum.Vendor) {
            this.arrayVendlsit.push(stockLine.ownerObject.Key);
        } else if (type == AppModuleEnum.Company) {
            this.arrayComplist.push(stockLine.ownerObject.Key);
        }
    }

    onTraceableToSelect(stockLine: StockLine, type): void {
        stockLine.traceableTo = stockLine.traceableToObject.Key;
        if (type == AppModuleEnum.Customer) {
            this.arrayCustlist.push(stockLine.traceableToObject.Key);
        } else if (type == AppModuleEnum.Vendor) {
            this.arrayVendlsit.push(stockLine.traceableToObject.Key);
        } else if (type == AppModuleEnum.Company) {
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


    onTraceableToChange(event, stockLine) {
        stockLine.traceableTo = '';
        stockLine.traceableToObject = {};

        if (event.target.value === AppModuleEnum.Customer) {
            this.traceabletocustomer = true;
            this.traceabletoother = false;
            this.traceabletovendor = false;
        }
        if (event.target.value === AppModuleEnum.Others) {
            this.traceabletoother = true;
            this.traceabletocustomer = false;
            this.traceabletovendor = false;
        }
        if (event.target.value === AppModuleEnum.Vendor) {
            this.traceabletovendor = true;
            this.traceabletocustomer = false;
            this.traceabletoother = false;
        }
    }


    onOwnerChange(event, stockLine) {
        stockLine.owner = '';
        stockLine.ownerObject = {};

        if (event.target.value === AppModuleEnum.Customer) {
            this.ownercustomer = true;
            this.ownerother = false;
            this.ownervendor = false;
        }
        if (event.target.value === AppModuleEnum.Others) {
            this.ownerother = true;
            this.ownercustomer = false;
            this.ownervendor = false;
        }
        if (event.target.value === AppModuleEnum.Vendor) {
            this.ownervendor = true;
            this.ownercustomer = false;
            this.ownerother = false;
        }
    }

    moveStockLinePage(type: string, index: number, part: PurchaseOrderPart): void {
        var count = type == 'stockline' ? part.stocklineListObj.length : part.timeLifeList.length;
        if (index >= 0 && index < count) {
            // if (part.itemMaster.isSerialized) {
            //     part.currentSLIndex = index;
            // }
            part.currentSLIndex = index;
            part.currentSERIndex = index;
            part.currentTLIndex = index;

        }
    }


    moveStockLineMainPage(type: string, index: number, part: PurchaseOrderPart): void {
        var count = type == 'stockline' ? part.stocklineListObj.length : part.timeLifeList.length;
        if (index >= 0 && index < count) {
            // if (part.itemMaster.isSerialized) {
            part.currentSLIndex = index;
            part.currentSERIndex = index;
            part.currentTLIndex = index;

            // }
            // part.currentSERIndex = index;
            // part.currentTLIndex = index;
        }
    }

    public paginatorFocusOut(event: any, part: PurchaseOrderPart): void {
        if (event.target.value == '') {
            part.currentTLIndex = 0;
            part.currentSERIndex = 0;
            part.currentSLIndex = 0;
        }
    }

    public gotoStockLineMainPage(event: any, part: PurchaseOrderPart): void {
        let value = event.target.value;
        let index: number = 0;
        if (value == '') {
            return;
        }
        index = Number.parseInt(value) - 1;
        if (index < part.stocklineListObj.length && index >= 0) {
            part.currentSLIndex = index;
            part.currentSERIndex = index;
            part.currentTLIndex = index;
        }
        else {
            this.alertService.showMessage(this.pageTitle, "Invalid stock line page", MessageSeverity.error);
            event.target.value = "1";
            part.currentSLIndex = 0;
            part.currentSERIndex = 0;
            part.currentTLIndex = 0;
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
            part.currentSLIndex = index;
            part.currentSERIndex = index;
            part.currentTLIndex = index;
        }
        else {
            this.alertService.showMessage(this.pageTitle, "Invalid stock line page", MessageSeverity.error);
            event.target.value = "1";
            part.currentSLIndex = index;
            part.currentSERIndex = index;
            part.currentTLIndex = index;
            return;
        }
    }

    togglePartSerialized(part: PurchaseOrderPart): void {
        this.isSpinnerVisible = true;
        if (part.itemMaster.isSerialized == null) {
            part.itemMaster.isSerialized == false;
        }
        this.itemmaster.updateItemMasterSerialized(part.itemMaster.itemMasterId, part.itemMaster.isSerialized).subscribe(
            result => {
                var obj = part.stocklineListObj[this.currentSLIndex];
                var childParts = this.purchaseOrderData.purchaseOderPart.filter(x => x.parentId == part.purchaseOrderPartRecordId);
                for (let childPart of childParts) {
                    childPart.itemMaster.isSerialized = part.itemMaster.isSerialized;
                }
                this.isSpinnerVisible = false;
                this.alertService.showMessage(this.pageTitle, "Part " + part.itemMaster.partNumber + " IsSerialized feature " + (part.itemMaster.isSerialized ? "enabled" : "disabled") + " successfully.", MessageSeverity.success);
            },
            error => {
                this.isSpinnerVisible = false;
                part.itemMaster.isSerialized = !part.itemMaster.isSerialized;
                this.alertService.showMessage(this.pageTitle, 'Something went wrong while updating Item Master', MessageSeverity.error);
            });
    }

    togglePartTimeLife(part: PurchaseOrderPart, event) {

        // if ((part.itemMaster.isSerialized == null || part.itemMaster.isSerialized == false) && part.itemMaster.isTimeLife == true) {
        //     part.itemMaster.isTimeLife = false;
        //     this.alertService.showMessage(this.pageTitle, "Part is not serialized, please make the part serialzed before making it timeLife.", MessageSeverity.error);
        //     return false;
        // }
        this.isSpinnerVisible = true;
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

                var childParts = this.purchaseOrderData.purchaseOderPart.filter(x => x.parentId == part.purchaseOrderPartRecordId);
                for (let childPart of childParts) {
                    childPart.itemMaster.isTimeLife = part.itemMaster.isTimeLife;
                }
                this.isSpinnerVisible = false;
                this.alertService.showMessage(this.pageTitle, "Part " + part.itemMaster.partNumber + " IsTimeLife feature " + (part.itemMaster.isTimeLife ? "enabled" : "disabled") + " successfully.", MessageSeverity.success);
            },
            error => {
                this.isSpinnerVisible = false;
                part.itemMaster.isSerialized = !part.itemMaster.isSerialized;
                this.alertService.showMessage(this.pageTitle, 'Something went wrong while update Item Master', MessageSeverity.error);
            });
        this.receiving_po_header = false;
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
        let allParts: PurchaseOrderPart[] = this.purchaseOrderData.purchaseOderPart.filter(x => x.quantityActuallyReceived > 0);                
        for (let part of allParts) {
            if (part.isSameDetailsForAllParts) {
                if (part.isSameDetailsForAllParts && !part.itemMaster.isSerialized && part.stocklineListObj && part.stocklineListObj.length > 0) {
                    part.stocklineListObj.push(part.stocklineListObj[0]);
                    if (part.timeLifeList && part.timeLifeList.length > 0) {
                        part.timeLifeList.push(part.timeLifeList[0]);
                    }
                }
                for (var i = part.currentSLIndex; i < part.stocklineListObj.length; i++) {
                    var sernotprovide = false;
                    var serno = "";
                    if (part.itemMaster.isSerialized) {
                        sernotprovide = part.stocklineListObj[part.currentSERIndex].serialNumberNotProvided;
                        serno=  part.stocklineListObj[part.currentSERIndex].serialNumber;
                    }
    
                    var stockLineToCopy = { ...part.stocklineListObj[part.currentSLIndex] };
                    part.stocklineListObj[i] = stockLineToCopy;
                    if (part.itemMaster.isSerialized) {
                        part.stocklineListObj[i].serialNumberNotProvided = sernotprovide;
                        part.stocklineListObj[part.currentSERIndex].serialNumber= serno;
                    }
                    if (part.itemMaster.isTimeLife) {
                        var timeLifeToCopy = { ...part.timeLifeList[part.currentTLIndex] };
                        part.timeLifeList[i] = timeLifeToCopy;
                    }
                }
                // for (var i = part.currentSLIndex; i < part.stocklineListObj.length; i++) {
                //     if (part.itemMaster.isSerialized) {
                //         part.stocklineListObj[part.currentSERIndex].serialNumberNotProvided = false;
                //     }
                //     else {
                //         part.stocklineListObj[part.currentSERIndex].serialNumberNotProvided = true;
                //         part.stocklineListObj[part.currentSERIndex].serialNumber = "";
                //     }
                //     var stockLineToCopy = { ...part.stocklineListObj[part.currentSLIndex] };
                //     part.stocklineListObj[i] = stockLineToCopy;
                //     var timeLifeToCopy = { ...part.timeLifeList[part.currentTLIndex] };
                //     part.timeLifeList[i] = timeLifeToCopy;
                // }
            }
        }
        let errorMessages: string[] = this.validatePage();
        this.alertText = '';
        var index = 0;
        if (errorMessages.length > 0) {
            for (let i = 0; i < errorMessages.length; i++) {
                this.alertText = this.alertText + errorMessages[i] + "<br/>"
            }
            this.alertService.showMessage(this.pageTitle, this.alertText, MessageSeverity.error);
            return;
        }
        let partsToPost: ReceiveParts[] = this.extractAllAllStockLines();
        this.isSpinnerVisible = true;        
        this.shippingService.receiveParts(partsToPost).subscribe(data => {
            this.isSpinnerVisible = false;
            if(this.isEditrpo){
                this.alertService.showMessage(this.pageTitle, 'Parts Received successfully.', MessageSeverity.success);
                this.route.navigateByUrl(`/receivingmodule/receivingpages/app-edit-po?purchaseOrderId=${this.receivingService.purchaseOrderId}`);
                return;
            } else {
                this.alertService.showMessage(this.pageTitle, 'Parts Received successfully.', MessageSeverity.success);                
                return;
            }
        }, err => {
            this.isSpinnerVisible = false;            
        });
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

                    if (item.stocklineListObj[i].unitOfMeasureId == undefined ||  item.stocklineListObj[i].unitOfMeasureId == 0) {
                        errorMessages.push("Please select Unit Of Measure in Receiving Qty - " + (i + 1).toString() + ofPartMsg);
                    }
                    if (item.stocklineListObj[i].purchaseOrderUnitCost == undefined || (item.stocklineListObj[i].purchaseOrderUnitCost != undefined && item.stocklineListObj[i].purchaseOrderUnitCost.toString() == '')) {
                        errorMessages.push("Please enter Unit Cost in Receiving Qty - " + (i + 1).toString() + ofPartMsg);
                    }
                    //item.stocklineListObj[i].oEM = item.itemMaster.oemPNId;
                    if (item.stocklineListObj[i].managementStructureEntityId == undefined || item.stocklineListObj[i].managementStructureEntityId == 0) {
                        errorMessages.push("Please select Management Structure in Receiving Qty - " + (i + 1).toString() + ofPartMsg);
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

                    if (moment(item.stocklineListObj[i].manufacturingDate, 'MM/DD/YYYY', true).isValid()) {
                        if (moment(item.stocklineListObj[i].tagDate, 'MM/DD/YYYY', true).isValid()) {
                            if (item.stocklineListObj[i].tagDate <= item.stocklineListObj[i].manufacturingDate) {                                
                                errorMessages.push("Tag Date must be greater than Manufacturing Date - " + (i + 1).toString() + ofPartMsg);
                            }
                        }                        
                        if (moment(item.stocklineListObj[i].certifiedDate, 'MM/DD/YYYY', true).isValid()) {
                            if (item.stocklineListObj[i].certifiedDate <= item.stocklineListObj[i].manufacturingDate) {
                                errorMessages.push("Certified Date must be greater than Manufacturing Date - " + (i + 1).toString() + ofPartMsg);                               
                            }
                        }                        
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

            if (item.itemMaster.isTimeLife == true && item.timeLifeList != undefined && item.timeLifeList.length > 0) {
                // need to have some check to make sure atleast one field is entered.                
                for (var i = 0; i < item.timeLifeList.length; i++) {
                    var timeLife = item.timeLifeList[i];
                    if (timeLife.detailsNotProvided != true) {
                        if (timeLife.cyclesRemainingHrs == null && timeLife.cyclesRemainingMin == null
                            && timeLife.cyclesSinceNewHrs == null
                            && timeLife.cyclesSinceNewMin == null
                            && timeLife.cyclesSinceOVHHrs == null
                            && timeLife.cyclesSinceOVHMin == null
                            && timeLife.cyclesSinceInspectionHrs == null
                            && timeLife.cyclesSinceInspectionMin == null
                            && timeLife.cyclesSinceRepairHrs == null
                            && timeLife.cyclesSinceRepairMin == null
                            && timeLife.timeRemainingHrs == null
                            && timeLife.timeRemainingMin == null
                            && timeLife.timeSinceNewHrs == null
                            && timeLife.timeSinceNewMin == null
                            && timeLife.timeSinceOVHHrs == null
                            && timeLife.timeSinceOVHMin == null
                            && timeLife.timeSinceInspectionHrs == null
                            && timeLife.timeSinceInspectionMin == null
                            && timeLife.timeSinceRepairHrs == null
                            && timeLife.timeSinceRepairMin == null
                            && timeLife.lastSinceNewHrs == null
                            && timeLife.lastSinceNewMin == null
                            && timeLife.lastSinceOVHHrs == null
                            && timeLife.lastSinceOVHMin == null
                            && timeLife.lastSinceInspectionHrs == null
                            && timeLife.lastSinceInspectionMin == null) {
                            errorMessages.push("Please enter atleast one field in Time Life Page - " + (i + 1).toString() + ofPartMsg);
                        }
                    }
                }
            }

        }
        return errorMessages;
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
            receivePart.timeLife = this.getTimeLife(part.timeLifeList, part.purchaseOrderPartRecordId);
            receiveParts.push(receivePart);
        }
        for (let part of allParts) {
            for (let sl of part.stocklineListObj) {
                sl.createdBy = this.userName;
                sl.updatedBy = this.userName;
                sl.masterCompanyId = this.currentUserMasterCompanyId;                 
                // if (sl.tagTypeobject && sl.tagTypeobject.length > 0) {
                //     sl.tagTypeId = sl.tagTypeobject.join();                
                //     sl.tagType = sl.tagTypeId.split(',');
                //     for (let i = 0; i < sl.tagType.length; i++) {
                //         sl.tagType[i] = getValueFromArrayOfObjectById('label', 'value', sl.tagType[i], this.TagTypeList);
                //     }
                //     sl.tagType = sl.tagType.join();
                // } else {
                //     sl.tagType = "";
                //     sl.tagTypeId = "";
                // }
                sl.tagTypeId = sl.tagTypeId > 0 ? sl.tagTypeId : null;                
                //sl.taggedBy = sl.taggedBy ? this.getValueFromObj(sl.taggedBy) : null ; 
                sl.unitOfMeasureId =  sl.unitOfMeasureId > 0 ? sl.unitOfMeasureId : null ;

                if (sl.certTypeobject && sl.certTypeobject.length > 0) {
                    sl.certTypeId = sl.certTypeobject.join();                
                    sl.certType = sl.certTypeId.split(',');
                    for (let i = 0; i < sl.certType.length; i++) {
                        sl.certType[i] = getValueFromArrayOfObjectById('label', 'value', sl.certType[i], this.CertTypeList);
                    }
                    sl.certType = sl.certType.join();
                } else {
                    sl.certType = "";
                    sl.certTypeId = "";
                }
            }    

            if (part.isSameDetailsForAllParts) {
                // for (var i = part.currentSLIndex; i < part.stocklineListObj.length; i++) {
                //     part.stocklineListObj[part.currentSERIndex].serialNumberNotProvided = true;
                //     //part.stocklineListObj[part.currentSERIndex].serialNumber = "";
                //     var stockLineToCopy = { ...part.stocklineListObj[part.currentSLIndex] };
                //     part.stocklineListObj[i] = stockLineToCopy;
                //     var timeLifeToCopy = { ...part.timeLifeList[part.currentTLIndex] };
                //     part.timeLifeList[i] = timeLifeToCopy;
                // }
                for (var i = part.currentSLIndex; i < part.stocklineListObj.length; i++) {
                    var sernotprovide = false;
                    var serno = "";
                    if (part.itemMaster.isSerialized) {
                        sernotprovide = part.stocklineListObj[part.currentSERIndex].serialNumberNotProvided;
                        serno=  part.stocklineListObj[part.currentSERIndex].serialNumber;
                    }
    
                    var stockLineToCopy = { ...part.stocklineListObj[part.currentSLIndex] };
                    part.stocklineListObj[i] = stockLineToCopy;
                    if (part.itemMaster.isSerialized) {
                        part.stocklineListObj[i].serialNumberNotProvided = sernotprovide;
                        part.stocklineListObj[part.currentSERIndex].serialNumber= serno;
                    }
                    if (part.itemMaster.isTimeLife) {
                        var timeLifeToCopy = { ...part.timeLifeList[part.currentTLIndex] };
                        part.timeLifeList[i] = timeLifeToCopy;
                    }
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
                masterCompanyId: this.currentUserMasterCompanyId,
                createdBy: this.userName,
                updatedBy: this.userName
            }
        })
        return tmLife;
    }
    ///////////////////////////////////////// Not Used Code
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

    btnactive(event) {

    }

    addPageCustomer() {
        this.route.navigateByUrl('/customersmodule/customerpages/app-customer-general-information');
    }

    toggleSameDetailsForAllParts(part: PurchaseOrderPart): void {
        part.isSameDetailsForAllParts = !part.isSameDetailsForAllParts;        
        if (part.isSameDetailsForAllParts) {
            // if (part.itemMaster.isSerialized) {
            //     part.stocklineListObj[part.currentSERIndex].serialNumberNotProvided = false;
            // }
            // else {
            //     part.stocklineListObj[part.currentSERIndex].serialNumberNotProvided = true;
            //     part.stocklineListObj[part.currentSERIndex].serialNumber = "";
            // }
            for (var i = part.currentSLIndex; i < part.stocklineListObj.length; i++) {
                var sernotprovide = false;
                var serno = "";
                if (part.itemMaster.isSerialized) {
                    sernotprovide = part.stocklineListObj[part.currentSERIndex].serialNumberNotProvided;
                    serno=  part.stocklineListObj[part.currentSERIndex].serialNumber;
                }

                var stockLineToCopy = { ...part.stocklineListObj[part.currentSLIndex] };
                part.stocklineListObj[i] = stockLineToCopy;
                if (part.itemMaster.isSerialized) {
                    part.stocklineListObj[i].serialNumberNotProvided = sernotprovide;
                    part.stocklineListObj[part.currentSERIndex].serialNumber= serno;
                }
                if (part.itemMaster.isTimeLife) {
                    var timeLifeToCopy = { ...part.timeLifeList[part.currentTLIndex] };
                    part.timeLifeList[i] = timeLifeToCopy;
                }
            }
        }
    }

    isCheckedSameDetailsForAllParts(part: PurchaseOrderPart) {
        if (part.isSameDetailsForAllParts) {
            // for (var i = part.currentSLIndex; i < part.stocklineListObj.length; i++) {
            //     var stockLineToCopy = { ...part.stocklineListObj[part.currentSLIndex] };
            //     part.stocklineListObj[i] = stockLineToCopy;
            //     var timeLifeToCopy = { ...part.timeLifeList[part.currentTLIndex] }; var stockLineToCopy = { ...part.stocklineListObj[part.currentSLIndex] };
            //     part.timeLifeList[i] = timeLifeToCopy;
            // }
            for (var i = part.currentSLIndex; i < part.stocklineListObj.length; i++) {
                var sernotprovide = false;
                var serno = "";
                if (part.itemMaster.isSerialized) {
                    sernotprovide = part.stocklineListObj[part.currentSERIndex].serialNumberNotProvided;
                    serno =  part.stocklineListObj[part.currentSERIndex].serialNumber;
                }
                var stockLineToCopy = { ...part.stocklineListObj[part.currentSLIndex] };
                part.stocklineListObj[i] = stockLineToCopy;
                if (part.itemMaster.isSerialized) {
                    part.stocklineListObj[i].serialNumberNotProvided = sernotprovide;
                    part.stocklineListObj[part.currentSERIndex].serialNumber= serno;
                }
                if (part.itemMaster.isTimeLife) {
                    var timeLifeToCopy = { ...part.timeLifeList[part.currentTLIndex] };
                    part.timeLifeList[i] = timeLifeToCopy;
                }
            }
        }
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
        // CTRL +  Up Arrow
        if (event.ctrlKey && event.keyCode == 38) {
            this.moveStockLinePage('stockline', part.currentSERIndex - 1, part);
        }
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

    TagByNames: any[];
    arrayTagEmployeelist: any[] = [];
    alltagEmployeeList: any = [];
    allPurchaseUnitOfMeasureinfo: any[] = [];    
    
    loadTagByEmployeeData(strText = '',taggedBy) {
		if(taggedBy >0){
			this.arrayTagEmployeelist.push(taggedBy);
		}
		if (this.arrayTagEmployeelist.length == 0) {
			this.arrayTagEmployeelist.push(0);
		}	
		this.commonService.autoCompleteDropdownsEmployeeByMS(strText, true, 20, this.arrayTagEmployeelist.join(), this.currentUserManagementStructureId)
			.subscribe(response => {
				this.alltagEmployeeList = response;
				this.TagByNames = this.alltagEmployeeList;
				if(taggedBy >0){
					//this.stockLineForm.taggedBy = getObjectById('value', taggedBy, this.alltagEmployeeList);
				}
				
			}, error => {});
    }

    filterTagEmployees(event) {
		if (event.query !== undefined && event.query !== null) {
			this.loadTagByEmployeeData(event.query,0);
		}
    }
        
    getValueFromObj(obj) {
		if (obj.value) {
			return obj.value;
		} else {
			return null;
		}
    }
    
    Purchaseunitofmeasure() {
		this.commonService.smartDropDownList('UnitOfMeasure', 'unitOfMeasureId', 'shortname',this.authService.currentUser.masterCompanyId,'','', 0).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
			this.allPurchaseUnitOfMeasureinfo = res;
		})
    }
    
   
}