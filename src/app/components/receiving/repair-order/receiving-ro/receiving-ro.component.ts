import { Component, OnInit } from '@angular/core';
import { AppModuleEnum } from './../../../../enum/appmodule.enum';
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
import { RepairOrder, RepairOrderPart, StockLine, DropDownData, TimeLife, ReceiveParts } from './RepairOrder.model';
import { ManagementStructure } from './managementstructure.model';
import { AccountService } from '../../../../services/account.service';
import { CompanyService } from '../../../../services/company.service';
import { AddressModel } from '../../../../models/address.model';
import { GlAccountService } from '../../../../services/glAccount/glAccount.service';
import { ShippingService } from '../../../../services/shipping/shipping-service';
import { CommonService } from '../../../../services/common.service';
import { LocalStoreManager } from '../../../../services/local-store-manager.service';
import { AuthService } from '../../../../services/auth.service';
import { formatNumberAsGlobalSettingsModule, getObjectById,editValueAssignByCondition, getValueFromArrayOfObjectById } from '../../../../generic/autocomplete';
import { DatePipe } from '@angular/common';
import { RepairOrderService } from '../../../../services/repair-order.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Component({
    selector: 'app-receiving-ro',
    templateUrl: './receiving-ro.component.html',
    styleUrls: ['./receiving-ro.component.scss'],
    providers: [DatePipe]
})

export class ReceivingRoComponent implements OnInit {
    repairOrderData: RepairOrderPart[] = [];
    repairOrderId: number;
    repairOrderHeaderData: any;
    headerManagementStructure: any = {};
    managementStructure: ManagementStructure[];
    roCompanyList: DropDownData[];
    roBusinessUnitList: DropDownData[];
    roDivisionList: DropDownData[];
    roDepartmentList: DropDownData[];
    roStatus: any[] = [];
    roUserType: DropDownData[] = [];
    receiving_ro_header: boolean = false;
    roSelectedCompanyId: number;
    roSelectedBusinessUnitId: number;
    roSelectedDivisionId: number;
    roSelectedDepartmentId: number;
    roPartManagementStructureList: string[];
    managementStructureHierarchy: ManagementStructure[][] = [];
    selectedManagementStructure: ManagementStructure[] = [];
    sites: any[];
    CustomerList: DropDownData[] = [];
    VendorList: DropDownData[] = [];
    CompanyList: DropDownData[] = [];
    manufacturerList: DropDownData[] = [];
    ConditionList: DropDownData[] = [];
    GLAccountList: DropDownData[] = [];
    ShippingViaList: DropDownData[] = [];
    ConditionId: number = 0;
    allPartGLAccountId: number;
    headerMemo: any;
    toggleIcon: boolean = false;
    currentSLIndex: number = 0;
    currentTLIndex: number = 0;
    currentSERIndex: number = 0;
    pageTitle: string = "Receive RO";
    isDisabledSNboxes: boolean = false;
    obtainfromcustomer: boolean = false;
    obtainfromother: boolean = false;
    obtainfromvendor: boolean = false;
    ownercustomer: boolean = false;
    ownerother: boolean = false;
    ownervendor: boolean = false;
    taggedbycustomer : boolean = false;
    taggedbyother : boolean = false;
    taggedbyvendor : boolean = false;
    headerNotes: any;
    traceabletocustomer: boolean = false;
    traceabletoother: boolean = false;
    traceabletovendor: boolean = false;
    disableParentSpace: boolean = false;
    TagTypeList: any = [];
    CertTypeList: any = [];
    quantityreceivebtn: boolean = false;
    quantityreceive: boolean = false;
    legalEntityList: any = [];
    isSpinnerVisible: boolean = true;
    moduleListDropdown: any = [];
    arraySitelist: any[] = [];
    arrayCustlist: any[] = [];
    arrayVendlsit: any[] = [];
    arrayComplist: any[] = [];
    arraymanufacturerlist: any[] = [];
    arrayConditionlist: any[] = [];
    arrayglaccountlist: any[] = [];
    arrayshipvialist: any[] = [];
    arraytagtypelist: any[] = [];
    arraycerttypelist: any[] = [];
    arrayLegalEntitylsit: any[] = [];
    customerModuleId: number = 0;
    companyModuleId: number = 0;
    vendorModuleId: number = 0;
    otherModuleId: number = 0;
    arrayPostatuslist: any[] = [];
    private onDestroy$: Subject<void> = new Subject<void>();
    constructor(public binservice: BinService,
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
        private _actRoute: ActivatedRoute,
        private commonService: CommonService,
        private localStorage: LocalStoreManager,
        private authService: AuthService,
        private datePipe: DatePipe,
        private repairOrderService: RepairOrderService,
    ) {
        //this.getAllSite();
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
        this.getAllrevisedPart();
        this.companyModuleId = AppModuleEnum.Company;
        this.vendorModuleId = AppModuleEnum.Vendor;
        this.customerModuleId = AppModuleEnum.Customer;
        this.otherModuleId = AppModuleEnum.Others;
    }

    private getAllSite(strText = '') {
        if (this.arraySitelist.length == 0) {
            this.arraySitelist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Site', 'SiteId', 'Name', strText, true, 0, this.arraySitelist.join(), this.currentUserMasterCompanyId).subscribe(res => {
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
            const data = response.map(x => {
                return {
                    Key: x.value,
                    Value: x.label
                }
            });
            this.manufacturerList = data;
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    getConditionList() {
        if (this.arrayConditionlist.length == 0) {
            this.arrayConditionlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Condition', 'ConditionId', 'Description', '', true, 0, this.arrayConditionlist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            const data = res.map(x => {
                return {
                    Key: x.value,
                    Value: x.label
                }
            });
            this.ConditionList = data;
        }, err => {
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
                for (let ship of res) {
                    var dropdown = new DropDownData();
                    dropdown.Key = ship.value.toLocaleString();
                    dropdown.Value = ship.label
                    this.ShippingViaList.push(dropdown);
                }  
            })
    }

    getTagType(strText = '') {
        if (this.arraytagtypelist.length == 0) {
            this.arraytagtypelist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('TagType', 'TagTypeId', 'Name', strText,true, 0, this.arraytagtypelist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            //this.TagTypeList = res;
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

    private getStatus() {
        if (this.arrayPostatuslist.length == 0) {
            this.arrayPostatuslist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('ROStatus', 'ROStatusId', 'Description', '',
            true, 0, this.arrayPostatuslist.join(), 0)
            .subscribe(res => {
                this.roStatus = res;
                this.roStatus = this.roStatus.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
            });
    }

    private getStatusById(statusId: string) {
        if (statusId == null)
            return 'NA';
        return this.roStatus.filter(function (status) {
            return status.Key == statusId;
        })[0].Value;
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
        this.repairOrderId = this._actRoute.snapshot.queryParams['repairorderid'];        
        this.getROViewById(this.repairOrderId);
        this.receivingService.getReceivingROPartById(this.repairOrderId, this.employeeId).subscribe(res => {
            this.loadRepairOrderData(res[0], res[1])
        });      
        this.quantityreceivebtn = false;       
    }

    getROViewById(id){
        this.repairOrderService.getROViewById(id).subscribe(res => {
            this.repairOrderHeaderData = res;            
            this.arrayVendlsit.push(res.vendorId);
            var stockline = [];
            this.getVendors('', stockline);
            this.repairOrderHeaderData.openDate = this.repairOrderHeaderData.openDate ? new Date(this.repairOrderHeaderData.openDate) : '';
            this.repairOrderHeaderData.closedDate = this.repairOrderHeaderData.closedDate ? new Date(this.repairOrderHeaderData.closedDate) : '';
            this.repairOrderHeaderData.dateApproved = this.repairOrderHeaderData.dateApproved ? new Date(this.repairOrderHeaderData.dateApproved) : '';
            this.repairOrderHeaderData.needByDate = this.repairOrderHeaderData.needByDate ? new Date(this.repairOrderHeaderData.needByDate) : '';
            this.repairOrderHeaderData.creditLimit = this.repairOrderHeaderData.creditLimit ? formatNumberAsGlobalSettingsModule(this.repairOrderHeaderData.creditLimit, 2) : '0.00';                 
            //var shippingVia = this.ShippingViaList.find(temp=> temp.Key == this.repairOrderHeaderData.shipViaId);                       
            // if(!shippingVia || shippingVia == undefined) {
            //     var shippingVia = new DropDownData(); 
            //     shippingVia.Key = this.repairOrderHeaderData.shipViaId;
            //     shippingVia.Value = this.repairOrderHeaderData.shipVia;
            //     this.ShippingViaList.push(shippingVia);
            // }      
        });
    }

    private loadRepairOrderData(repairOrder: RepairOrderPart[], partms) {
        this.repairOrderData = repairOrder;
        let parentPart: RepairOrderPart;

        var allParentParts = this.repairOrderData.filter(x => x.isParent == true);
        for (let parent of allParentParts) {
            parent.currentSLIndex = 0;
            parent.currentTLIndex = 0;
            parent.currentSERIndex = 0;
            parent.isDisabledTLboxes = false;
            parent.quantityRejected = 0;          //   in po method not in ro need to confirm
            var splitParts = this.repairOrderData.filter(x => x.parentId == parent.repairOrderPartRecordId);
            if (splitParts.length > 0) {
                parent.hasChildren = true;
                parent.quantityToRepair = 0;

                for (let childPart of splitParts) {
                    parent.stockLineCount += childPart.stockLineCount;       
                    parent.quantityDrafted += childPart.quantityDrafted; 
                    parent.quantityRepaired += childPart.quantityRepaired;                  
                    parent.quantityRejected += childPart.quantityRejected != null ? childPart.quantityRejected : 0;
                    childPart.managementStructureId = parent.managementStructureId;
                    childPart.managementStructureName = parent.managementStructureName;
                    parent.quantityToRepair += childPart.quantityToRepair;   
                }
            }
            else {
                parent.hasChildren = false;
            }
        }
        for (let part of this.repairOrderData) {
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
                part.addressText = this.getAddress(part.roPartSplitAddress);
                part.userName = part.roPartSplitUserName;
                part.userTypeName = part.roPartSplitUserTypeName;
                part.statusText = part.status;
            }
            this.getManagementStructureForPart(part, partms)
        }

        this.isSpinnerVisible = false;
        this.getAllSite();
        for (let i = 0; i < this.repairOrderData.length; i++) {
            var K = 0;
            this.repairOrderData.forEach(p => {
                if (p.parentId == this.repairOrderData[i].repairOrderPartRecordId) {
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
            const result = response[partList.repairOrderPartRecordId];
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

    public showSplitShipmentParts(repairOrderPart: RepairOrderPart): void {
        var selectedParts = this.repairOrderData.filter(function (part) {
            return part.repairOrderPartRecordId == repairOrderPart.repairOrderPartRecordId;
        });
        selectedParts.forEach(part => {
            part.toggleIcon = !part.toggleIcon;
            part.visible = !part.visible;
        });
        this.repairOrderData.forEach(part => {
            if (part.parentId == repairOrderPart.repairOrderPartRecordId) {
                part.visible = !part.visible;
            }
        });        
    }

    public isSplitShipmentPart(repairOrderPartRecordId: number): boolean {
        return this.repairOrderData.filter(x => x.parentId == repairOrderPartRecordId).length > 0;        
    }

    public toggleStockLine(event: any, part: RepairOrderPart): void {
               
        var condtion = this.ConditionList.find(temp => temp.Key == part.conditionId.toString())
        /// For InActive condtion
        if (!condtion || condtion == undefined) {
            var condtion = new DropDownData();
            condtion.Key = part.conditionId.toString();
            condtion.Value = part.condition.toString();
            this.ConditionList.push(condtion);
        }
        var glAccount = this.GLAccountList.find(temp => temp.Key == part.glAccountId.toString())
        if (!glAccount || glAccount == undefined) {
            var glAccount = new DropDownData();
            glAccount.Key = part.glAccountId.toString();
            glAccount.Value = part.glAccount.toString();
            this.GLAccountList.push(glAccount);
        }
        var manufacturer = this.manufacturerList.find(temp => temp.Key == part.itemMaster.manufacturerId)
        if (!manufacturer || manufacturer == undefined) {
            var manufacturer = new DropDownData();
            manufacturer.Key = part.itemMaster.manufacturerId.toString();
            manufacturer.Value = part.itemMaster.manufacturerName.toString();
            this.manufacturerList.push(manufacturer);
        }
        var unitofmasure = this.allPurchaseUnitOfMeasureinfo.find(temp => temp.value == part.uomId)
        if (!unitofmasure || unitofmasure == undefined) {
            var uom = {label:part.UOMText , value : part.uomId}
            this.allPurchaseUnitOfMeasureinfo.push(uom);
        }

        var revisedpn = this.revisedPartNumCollection.find(temp => temp.itemMasterId == part.revisedPartId)
        if (!revisedpn || revisedpn == undefined) {
            var rpn = { itemMasterId : part.revisedPartId , partNumber : part.revisedPartNumber }           
            this.revisedPartNumCollection.push(rpn);
        }
        
        if (part.quantityActuallyReceived == undefined || part.quantityActuallyReceived == null) {
            this.quantityreceive = true;
        } else { 
            this.quantityreceive = false;
        }
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
        var ROParts = this.repairOrderData.filter(x =>
            x.itemMaster.partnumber == part.itemMaster.partnumber && x.itemMaster.isParent == false
        );

        if (ROParts.length > 1) {
            if (quantity > (part.quantityToRepair - part.quantityRepaired - part.quantityDrafted - part.quantityRejected)) {
                this.alertService.showMessage(this.pageTitle, "Quantity receive can not be more than quantity ordered", MessageSeverity.error);
                return;
            }
        }
        else {
            if (quantity > (part.quantityToRepair - part.quantityRepaired - part.quantityDrafted - part.quantityRejected)) {
                this.alertService.showMessage(this.pageTitle, "Quantity receive can not be more than quantity ordered", MessageSeverity.error);
                return;
            }
        }       

        part.visible = true;
        if (part.stocklineListObj.length != quantity) {
            this.createStockLineItems(part);
            if (part.itemMaster.isTimeLife) {
                part.timeLifeList = [];
                for (var i = 0; i < quantity; i++) {
                    let timeLife: TimeLife = new TimeLife();
                    //let timeLife: TimeLifeDraft = new TimeLifeDraft();
                    timeLife.timeLifeCyclesId = 0;
                    timeLife.repairOrderId = part.repairOrderId;
                    timeLife.repairOrderPartRecordId = part.repairOrderPartRecordId;
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

    createStockLineItems(part: RepairOrderPart): void {
        part.stocklineListObj = [];
        this.currentSLIndex = 0;
        for (var i = 0; i < part.quantityActuallyReceived; i++) {
            let stockLine: StockLine = new StockLine();            
            stockLine.repairOrderId = part.repairOrderId;
            stockLine.repairOrderPartRecordId = part.repairOrderPartRecordId;
            stockLine.itemMasterId = part.itemMaster.itemMasterId;
            stockLine.partNumber = part.itemMaster.partNumber;
            stockLine.quantity = part.quantityActuallyReceived; //1;
            //stockLine.stockLineDraftId = 0;      
            stockLine.stockLineId = 0;
            stockLine.createdDate = new Date();
            stockLine.manufacturerId = part.itemMaster.manufacturerId;
            stockLine.visible = false;
            stockLine.shippingReference = '';
            stockLine.shippingViaId = this.repairOrderHeaderData.shipViaId;
            stockLine.shelfId = 0;
            stockLine.warehouseId = 0;
            stockLine.binId = 0;
            stockLine.locationId = 0;  
            stockLine.shippingAccount = this.repairOrderHeaderData.shippingAccountNo;       
            stockLine.conditionId = 0;
            stockLine.masterCompanyId = this.currentUserMasterCompanyId;
            stockLine.createdBy = this.userName;
            stockLine.updatedBy = this.userName;
            stockLine.serialNumberNotProvided = false;
            stockLine.repairOrderUnitCost = 0;
            stockLine.repairOrderExtendedCost = part.unitCost;
            stockLine.currentDate = new Date();
            stockLine.obtainFromType = AppModuleEnum.Vendor; // default is vendor and set the value from Repair order.
            stockLine.obtainFrom = this.repairOrderHeaderData.vendorId;
            stockLine.taggedByType = AppModuleEnum.Vendor; // default is vendor and set the value from Repair order.
            stockLine.taggedBy = this.repairOrderHeaderData.vendorId;
            stockLine.certifiedTypeId = AppModuleEnum.Vendor; // default is vendor and set the value from Repair order.
            stockLine.certifiedById = this.repairOrderHeaderData.vendorId;
            stockLine.ownerType = AppModuleEnum.Vendor;
            stockLine.owner = this.repairOrderHeaderData.vendorId; 
            stockLine.maincompanylist = part.maincompanylist;
            stockLine.parentCompanyId = part.parentCompanyId;           
            stockLine.managementStructureEntityId = part.managementStructureId;
            stockLine.parentBulist = part.parentBulist;
            stockLine.parentDivisionlist = part.parentDivisionlist;
            stockLine.parentDepartmentlist = part.parentDepartmentlist;
            stockLine.parentbuId = part.parentbuId;
            stockLine.parentDivisionId = part.parentDivisionId;
            stockLine.parentDeptId = part.parentDeptId;                 
            stockLine.unitOfMeasureId = part.uomId;              
            stockLine.serialNumber = part.serialNumber;         
            stockLine.obtainFromObject = this.VendorList.find(x => x.Key == this.repairOrderHeaderData.vendorId.toString());
            stockLine.ownerObject = this.VendorList.find(x => x.Key == this.repairOrderHeaderData.vendorId.toString()); 
            stockLine.taggedByObject = this.VendorList.find(x => x.Key == this.repairOrderHeaderData.vendorId.toString()); 
            stockLine.certByObject = this.VendorList.find(x => x.Key == this.repairOrderHeaderData.vendorId.toString()); 
            stockLine.tagTypeId =  0 ; 
            stockLine.revisedPartId = part.revisedPartId > 0 ? this.revisedPartNumCollection.find(x =>x.itemMasterId == part.revisedPartId) : 0;   
            stockLine.aircraftTailNumber = part.acTailNum;
            if (part.itemMaster != undefined) {
                stockLine.repairOrderUnitCost = part.unitCost;
                if (!part.itemMaster.isSerialized) {
                    stockLine.repairOrderExtendedCost = part.quantityActuallyReceived * part.unitCost;
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
                // certifiedBy: 0,
                shippingViaId: x.shippingViaId ? x.shippingViaId.toLocaleString() : null,
                shippingAccount: x.shippingAccount.toLocaleString(),
                repairOrderUnitCost: formatNumberAsGlobalSettingsModule(x.repairOrderUnitCost, 2),
                repairOrderExtendedCost: formatNumberAsGlobalSettingsModule(x.repairOrderExtendedCost, 2)
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
        } else {            
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

    getStockLineSite(stockLine: StockLine): void {
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
                }, //sending WareHouse                
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
                },                
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
                },                
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
                },                
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

        // if (event.target.value === AppModuleEnum.Customer) {
        //     this.certbycustomer = true;
        //     this.certbyother = false;
        //     this.certbyvendor = false;
        // }
        // if (event.target.value === AppModuleEnum.Vendor) {
        //     this.certbyother = true;
        //     this.certbycustomer = false;
        //     this.certbyvendor = false;
        // }
        // if (event.target.value === AppModuleEnum.Company) {
        //     this.certbyvendor = true;
        //     this.certbycustomer = false;
        //     this.certbyother = false;
        // }
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

    moveStockLinePage(type: string, index: number, part: RepairOrderPart): void {
        var count = type == 'stockline' ? part.stocklineListObj.length : part.timeLifeList.length;
        if (index >= 0 && index < count) {
            part.currentSLIndex = index;
            part.currentSERIndex = index;
            part.currentTLIndex = index;
        }
    }

    moveStockLineMainPage(type: string, index: number, part: RepairOrderPart): void {
        var count = type == 'stockline' ? part.stocklineListObj.length : part.timeLifeList.length;
        if (index >= 0 && index < count) {
            part.currentSLIndex = index;
            part.currentSERIndex = index;
            part.currentTLIndex = index;
        }
    }

    public paginatorFocusOut(event: any, part: RepairOrderPart): void {
        if (event.target.value == '') {
            part.currentTLIndex = 0;
            part.currentSERIndex = 0;
            part.currentSLIndex = 0;
        }
    }

    public gotoStockLineMainPage(event: any, part: RepairOrderPart): void {
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

    public gotoStockLinePage(event: any, part: RepairOrderPart): void {
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

    togglePartSerialized(part: RepairOrderPart): void {
        this.isSpinnerVisible = true;
        if (part.itemMaster.isSerialized == null) {
            part.itemMaster.isSerialized == false;
        }
        this.itemmaster.updateItemMasterSerialized(part.itemMasterId, part.itemMaster.isSerialized).subscribe(
            result => {               
                var childParts = this.repairOrderData.filter(x => x.parentId == part.repairOrderPartRecordId);                
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

    togglePartTimeLife(part: RepairOrderPart): void {
        this.isSpinnerVisible = true;
        if (part.itemMaster.isTimeLife == null) {
            part.itemMaster.isTimeLife == false;
        }
        this.itemmaster.updateItemMasterTimeLife(part.itemMasterId, part.itemMaster.isTimeLife).subscribe(
            result => {
                part.timeLifeList = [];
                if (part.quantityActuallyReceived) {
                    if (part.itemMaster.isTimeLife == true) {
                        part.currentSLIndex = 0;
                        part.currentSERIndex = 0;
                        part.currentTLIndex = 0;
                        for (var i = 0; i < part.quantityActuallyReceived; i++) {
                            let timeLife: TimeLife = new TimeLife();
                            timeLife.timeLifeCyclesId = 0;
                            timeLife.repairOrderId = part.repairOrderId;
                            timeLife.repairOrderPartRecordId = part.repairOrderPartRecordId;
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

                var childParts = this.repairOrderData.filter(x => x.parentId == part.repairOrderPartRecordId);
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
    }

    onSerialNumberNotProvided(stockLine: StockLine) {
        stockLine.isDisabledSNboxes = !stockLine.isDisabledSNboxes;
        stockLine.serialNumber = '';
        stockLine.serialNumberNotProvided = !stockLine.serialNumberNotProvided;
    }

    onChangeTimeLife(part: RepairOrderPart) {
        // part.timeLifeList[part.currentTLIndex].detailsNotProvided = part.detailsNotProvided;
        part.timeLifeList[part.currentTLIndex].timeLifeCyclesId = 0;
        part.timeLifeList[part.currentTLIndex].repairOrderId = part.repairOrderId;
        part.timeLifeList[part.currentTLIndex].repairOrderPartRecordId = part.repairOrderPartRecordId;
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
        //let partsToPost: ReceiveParts[] = this.extractAllAllStockLines();
        let partsToPost: any = this.extractAllAllStockLines();
        this.isSpinnerVisible = true;
        this.receivingService.receiveParts(partsToPost).subscribe(data => {
            this.isSpinnerVisible = false;
            this.alertService.showMessage(this.pageTitle, 'Stockline drafted successfully.', MessageSeverity.success);
            this.route.navigateByUrl(`/receivingmodule/receivingpages/app-edit-ro?repairOrderId=${this.repairOrderId}`);

        }, err => { this.isSpinnerVisible = false; });
    }

    validatePage() {
        let partsToFetch: RepairOrderPart[] = this.repairOrderData.filter(x => x.quantityActuallyReceived > 0);
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
            if (item.stocklineListObj == undefined || item.stocklineListObj.length == 0) {
                errorMessages.push("No part received for Part No." + item.itemMaster.PartNumber);
            }
            if (item.stocklineListObj == undefined || item.stocklineListObj.length == 0) {
                errorMessages.push("No part received for shippingViaId" + item.itemMaster.shippingViaId);
            }
            if (item.stocklineListObj == undefined || item.stocklineListObj.length == 0) {
                errorMessages.push("No part received for shipping Reference" + item.itemMaster.shippingReference);
            }
            var ofPartMsg = " of Part No. " + item.itemMaster.partNumber;
            if (item.stocklineListObj != undefined && item.stocklineListObj.length > 0) {
                for (var i = 0; i < item.stocklineListObj.length; i++) {
                    item.stocklineListObj[i].gLAccountId = item.itemMaster.glAccountId;
                    item.stocklineListObj[i].conditionId = item.conditionId;
                    item.stocklineListObj[i].quantityRejected = Number(item.quantityRejected);
                    item.stocklineListObj[i].isSerialized = item.itemMaster.isSerialized == undefined ? false : item.itemMaster.isSerialized;
                    item.stocklineListObj[i].isPMA = item.itemMaster.pma;
                    item.stocklineListObj[i].isDER = item.itemMaster.der;
                    item.stocklineListObj[i].repairOrderExtendedCost = item.stocklineListObj[i].repairOrderExtendedCost == undefined ||
                        item.stocklineListObj[i].repairOrderExtendedCost.toString() == '' ? 0 :
                        item.stocklineListObj[i].repairOrderExtendedCost;
                    // item.stocklineListObj[i].repairOrderUnitCost = item.stocklineListObj[i].repairOrderUnitCost == undefined ||
                    //     item.stocklineListObj[i].repairOrderUnitCost.toString() == '' ? 0 :
                    //     item.stocklineListObj[i].repairOrderUnitCost;
                    if (item.stocklineListObj[i].unitOfMeasureId == undefined ||  item.stocklineListObj[i].unitOfMeasureId == 0) {
                        errorMessages.push("Please select Unit Of Measure in Receiving Qty - " + (i + 1).toString() + ofPartMsg);
                    }
                    if (item.stocklineListObj[i].repairOrderUnitCost == undefined || (item.stocklineListObj[i].repairOrderUnitCost != undefined && item.stocklineListObj[i].repairOrderUnitCost.toString() == '')) {
                        errorMessages.push("Please enter Unit Cost in Receiving Qty - " + (i + 1).toString() + ofPartMsg);
                    }
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

            if(item.itemMaster.isTimeLife == true && item.timeLifeList != undefined && item.timeLifeList.length > 0) {                
                for (var i = 0; i < item.timeLifeList.length; i++) {
                    var timeLife = item.timeLifeList[i];
                    if (timeLife.detailsNotProvided != true) {
                        //var timeLife = item.timeLifeList[i];
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
        let allParts: RepairOrderPart[] = this.repairOrderData.filter(x => x.quantityActuallyReceived > 0);
        for (let part of allParts) {
            let receivePart: ReceiveParts = new ReceiveParts();
            receivePart.itemMasterId = part.itemMaster.itemMasterId;
            receivePart.isSerialized = part.itemMaster.isSerialized;
            receivePart.repairOrderPartRecordId = part.repairOrderPartRecordId;
            receivePart.stockLines = part.stocklineListObj;
            receivePart.quantityActuallyReceived = part.quantityActuallyReceived ? parseInt(part.quantityActuallyReceived.toString()) : null;
            receivePart.quantityRejected = part.quantityRejected;
            receivePart.isSameDetailsForAllParts = part.isSameDetailsForAllParts ? part.isSameDetailsForAllParts : false;
            receivePart.timeLife = this.getTimeLife(part.timeLifeList, part.repairOrderPartRecordId);
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
                sl.revisedPartId = sl.revisedPartId ? editValueAssignByCondition('itemMasterId', sl.revisedPartId) : null;

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
                // var stockLineToCopy = { ...part.stocklineListObj[part.currentSLIndex] };
                // for (let slObj of part.stocklineListObj) {
                //     slObj = stockLineToCopy;
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

    getTimeLife(timeLife, repairOrderPartRecordId) {
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
                repairOrderPartRecordId: repairOrderPartRecordId,
                masterCompanyId: this.currentUserMasterCompanyId,
                createdBy: this.userName,
                updatedBy: this.userName
            }
        })
        return tmLife;
    }
  
    private getItemMasterById(type: string, part: RepairOrderPart) {
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
                            let timeLife: TimeLife = new TimeLife();
                            timeLife.timeLifeCyclesId = 0;
                            timeLife.repairOrderId = part.repairOrderId;
                            timeLife.repairOrderPartRecordId = part.repairOrderPartRecordId;
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

    private getUserTypeById(userTypeId: string) {
        if (userTypeId == null)
            return 'NA';

        return this.roUserType.filter(function (status) {
            return status.Key == userTypeId;
        })[0].Value;
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

    private getManagementStructure() {
        return this.legalEntityService.getManagemententity();
    }
    private setStockLineManagementStructure(managementStructureId: number, stockLine: StockLine) {
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
        this.headerNotes = this.repairOrderHeaderData.notes;
    }
    onSaveNotes() {
        this.repairOrderHeaderData.notes = this.headerNotes;

    }

    onAddMemo() {
        this.headerMemo = this.repairOrderHeaderData.roMemo;
    }
    onSaveMemo() {
        this.repairOrderHeaderData.roMemo = this.headerMemo;
    }
    private managementStructureSuccess(managementStructureId: number, managementStructure: ManagementStructure[]) {

        this.alertService.stopLoadingMessage();
        this.managementStructure = managementStructure;
        if (this.managementStructure != undefined && this.managementStructure.length > 0) {
            this.roCompanyList = [];
            this.roBusinessUnitList = [];
            this.roDivisionList = [];
            this.roDepartmentList = [];

            this.getManagementStructureHierarchy(managementStructureId, this.managementStructureHierarchy, this.selectedManagementStructure);
            this.managementStructureHierarchy.reverse();
            this.selectedManagementStructure.reverse();

            if (this.managementStructureHierarchy[0] != undefined && this.managementStructureHierarchy[0].length > 0) {
                this.roSelectedCompanyId = this.selectedManagementStructure[0].managementStructureId;
                for (let managementStruct of this.managementStructureHierarchy[0]) {
                    var dropdown = new DropDownData();
                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                    dropdown.Value = managementStruct.code;
                    this.roCompanyList.push(dropdown);
                }
            }
            if (this.managementStructureHierarchy[1] != undefined && this.managementStructureHierarchy[1].length > 0) {
                this.roSelectedBusinessUnitId = this.selectedManagementStructure[1].managementStructureId;
                for (let managementStruct of this.managementStructureHierarchy[1]) {
                    var dropdown = new DropDownData();
                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                    dropdown.Value = managementStruct.code;
                    this.roBusinessUnitList.push(dropdown);
                }
            }
            if (this.managementStructureHierarchy[2] != undefined && this.managementStructureHierarchy[2].length > 0) {
                this.roSelectedDivisionId = this.selectedManagementStructure[2].managementStructureId;
                for (let managementStruct of this.managementStructureHierarchy[2]) {
                    var dropdown = new DropDownData();
                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                    dropdown.Value = managementStruct.code;
                    this.roDivisionList.push(dropdown);
                }
            }
            if (this.managementStructureHierarchy[3] != undefined && this.managementStructureHierarchy[3].length > 0) {
                this.roSelectedDepartmentId = this.selectedManagementStructure[3].managementStructureId;
                for (let managementStruct of this.managementStructureHierarchy[3]) {
                    var dropdown = new DropDownData();
                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                    dropdown.Value = managementStruct.code;
                    this.roDepartmentList.push(dropdown);
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

    

    

    // private getAllPriority() {
    //     this.priorityService.getPriorityList().subscribe(
    //         results => {
    //             this.roPriorityInfo = [];
    //             for (let priority of results[0]) {
    //                 var dropdown = new DropDownData();
    //                 dropdown.Key = priority.priorityId.toLocaleString();
    //                 dropdown.Value = priority.description;
    //                 this.roPriorityInfo.push(dropdown);
    //             }
    //         },
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

    // private getAllCreditTerms() {
    //     this.creditTermsService.getCreditTermsList().subscribe(
    //         results => {
    //             this.roCreditTermInfo = [];
    //             for (let creditTerm of results[0]) {
    //                 var dropdown = new DropDownData();
    //                 dropdown.Key = creditTerm.creditTermsId.toLocaleString();
    //                 dropdown.Value = creditTerm.name;
    //                 this.roCreditTermInfo.push(dropdown);
    //             }
    //         },
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

    private onDataLoadFailed(error: any): void {
        this.alertService.stopLoadingMessage();
        this.isSpinnerVisible = false;
    }

    


   

    getManagementStructureOnEdit(part, stock) {
        this.commonService.getManagementStructureDetails(part.managementStructureId).subscribe(res => {
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

    // selectedLegalEntity(legalEntityId, stockLine) {
    //     stockLine.BusinessUnitList = [];
    //     stockLine.DivisionList = [];
    //     stockLine.DepartmentList = [];
    //     stockLine.businessUnitId = 0;
    //     stockLine.divisionId = 0;
    //     stockLine.departmentId = 0;

    //     if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
    //         stockLine.managementStructureEntityId = legalEntityId;
    //         this.commonService.getBusinessUnitListByLegalEntityId(legalEntityId).subscribe(res => {
    //             stockLine.BusinessUnitList = res;
    //         });
    //     }
    // }

    

    // async selectedBusinessUnit(businessUnitId, stockLine) {
    //     stockLine.DivisionList = [];
    //     stockLine.DepartmentList = [];
    //     stockLine.divisionId = 0;
    //     stockLine.departmentId = 0;

    //     if (businessUnitId != 0 && businessUnitId != null && businessUnitId != undefined) {
    //         stockLine.managementStructureEntityId = businessUnitId;
    //         await this.commonService.getDivisionListByBU(businessUnitId).subscribe(res => {
    //             stockLine.DivisionList = res;
    //         })
    //     }
    // }

    

    // async selectedDivision(divisionUnitId, stockLine) {
    //     stockLine.DepartmentList = [];
    //     stockLine.departmentId = 0;

    //     if (divisionUnitId != 0 && divisionUnitId != null && divisionUnitId != undefined) {
    //         stockLine.managementStructureEntityId = divisionUnitId;
    //         await this.commonService.getDepartmentListByDivisionId(divisionUnitId).subscribe(res => {
    //             stockLine.DepartmentList = res;
    //         })
    //     }
    // }
    

    // selectedDepartment(departmentId, stockLine) {
    //     if (departmentId != 0 && departmentId != null && departmentId != undefined) {
    //         stockLine.managementStructureEntityId = departmentId;
    //     }
    // }

    

    

    // public paginatorFocusOut(event: any, part: RepairOrderPart): void {
    //     if (event.target.value == '') {
    //         if (!part.isSameDetailsForAllParts) {
    //             part.currentSLIndex = 0;
    //             part.currentSERIndex = 0;
    //         }

    //         part.currentTLIndex = 0;
    //         part.currentSERIndex = 0;
    //     }
    // }

    

    

    

    // public gotoStockLinePage(event: any, part: RepairOrderPart): void {
    //     let value = event.target.value;
    //     let index: number = 0;
    //     if (value == '') {
    //         return;
    //     }
    //     index = Number.parseInt(value) - 1;
    //     if (index < part.stocklineListObj.length && index >= 0) {
    //         if (!part.isSameDetailsForAllParts && part.itemMaster.isSerialized) {
    //             // part.currentSLIndex = index;
    //             part.currentSERIndex = index;
    //         }
    //         part.currentTLIndex = index;
    //     }
    //     else {
    //         this.alertService.showMessage(this.pageTitle, "Invalid stock line page", MessageSeverity.error);
    //         event.target.value = "1";
    //         if (!part.isSameDetailsForAllParts) {
    //             // part.currentSLIndex = 0;
    //             part.currentSERIndex = 0;
    //         }
    //         part.currentTLIndex = 0;
    //         part.currentSERIndex = 0;
    //         return;
    //     }
    // }

    

    // moveStockLineMainPage(type: string, index: number, part: RepairOrderPart): void {
    //     var count = type == 'stockline' ? part.stocklineListObj.length : part.timeLifeList.length;
    //     if (index >= 0 && index < count) {
    //         // if (part.itemMaster.isSerialized) {
    //         part.currentSLIndex = index;
    //         // }
    //         // part.currentSERIndex = index;
    //         // part.currentTLIndex = index;
    //     }
    // }

    

    // moveStockLinePage(type: string, index: number, part: RepairOrderPart): void {
    //     var count = type == 'stockline' ? part.stocklineListObj.length : part.timeLifeList.length;
    //     if (index >= 0 && index < count) {
    //         // if (part.itemMaster.isSerialized) {
    //         //     part.currentSLIndex = index;
    //         // }
    //         part.currentSERIndex = index;
    //         part.currentTLIndex = index;
    //     }
    // }

    

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

    // onObtainFromChange(event, stockLine) {
    //     stockLine.obtainFrom = '';
    //     stockLine.obtainFromObject = {};

    //     if (event.target.value === '1') {
    //         this.obtainfromcustomer = true;
    //         this.obtainfromother = false;
    //         this.obtainfromvendor = false;
    //     }
    //     if (event.target.value === '2') {
    //         this.obtainfromother = true;
    //         this.obtainfromcustomer = false;
    //         this.obtainfromvendor = false;
    //     }
    //     if (event.target.value === '3') {
    //         this.obtainfromvendor = true;
    //         this.obtainfromcustomer = false;
    //         this.obtainfromother = false;
    //     }
    // }
    

    // onOwnerChange(event, stockLine) {
    //     stockLine.owner = '';
    //     stockLine.ownerObject = {};

    //     if (event.target.value === '1') {
    //         this.ownercustomer = true;
    //         this.ownerother = false;
    //         this.ownervendor = false;
    //     }
    //     if (event.target.value === '2') {
    //         this.ownerother = true;
    //         this.ownercustomer = false;
    //         this.ownervendor = false;
    //     }
    //     if (event.target.value === '3') {
    //         this.ownervendor = true;
    //         this.ownercustomer = false;
    //         this.ownerother = false;
    //     }
    // }

    

    // onTraceableToChange(event, stockLine) {
    //     stockLine.traceableTo = '';
    //     stockLine.traceableToObject = {};

    //     if (event.target.value === '1') {
    //         this.traceabletocustomer = true;
    //         this.traceabletoother = false;
    //         this.traceabletovendor = false;
    //     }
    //     if (event.target.value === '2') {
    //         this.traceabletoother = true;
    //         this.traceabletocustomer = false;
    //         this.traceabletovendor = false;
    //     }
    //     if (event.target.value === '3') {
    //         this.traceabletovendor = true;
    //         this.traceabletocustomer = false;
    //         this.traceabletoother = false;
    //     }
    // }    

    addPageCustomer() {
        this.route.navigateByUrl('/customersmodule/customerpages/app-customer-general-information');
    }

    toggleSameDetailsForAllParts(part: RepairOrderPart): void {
        part.isSameDetailsForAllParts = !part.isSameDetailsForAllParts;

        if (part.isSameDetailsForAllParts) {
            // for (var i = part.currentSLIndex; i < part.stocklineListObj.length; i++) {
            //     // var serialNumber = part.stocklineListObj[i].serialNumber;
            //     // var serialNumberNotProvided = part.stocklineListObj[i].serialNumberNotProvided;

            //     var stockLineToCopy = { ...part.stocklineListObj[part.currentSLIndex] };
            //     part.stocklineListObj[i] = stockLineToCopy;
            //     // part.stocklineListObj[i].serialNumber = serialNumber;
            //     // part.stocklineListObj[i].serialNumberNotProvided = serialNumberNotProvided;
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
    
    isCheckedSameDetailsForAllParts(part: RepairOrderPart) {
        if (part.isSameDetailsForAllParts) {
            // for (var i = part.currentSLIndex; i < part.stocklineListObj.length; i++) {
            //     var stockLineToCopy = { ...part.stocklineListObj[part.currentSLIndex] };
            //     part.stocklineListObj[i] = stockLineToCopy;
            //     var timeLifeToCopy = { ...part.timeLifeList[part.currentTLIndex] };
            //     var stockLineToCopy = { ...part.stocklineListObj[part.currentSLIndex] };
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
        if (part.stocklineListObj[part.currentSLIndex].repairOrderUnitCost == undefined || part.stocklineListObj[part.currentSLIndex].repairOrderUnitCost == '') {
            return;
        }
        if (part.itemMaster.isSerialized) {
            part.stocklineListObj[part.currentSLIndex].repairOrderExtendedCost = part.stocklineListObj[part.currentSLIndex].repairOrderUnitCost;
        }
        else {
            const unitCost = part.stocklineListObj[part.currentSLIndex].repairOrderUnitCost ? parseFloat(part.stocklineListObj[part.currentSLIndex].repairOrderUnitCost.toString().replace(/\,/g, '')) : 0;
            part.stocklineListObj[part.currentSLIndex].repairOrderExtendedCost = unitCost * part.quantityActuallyReceived;
        }
        if (part.stocklineListObj[part.currentSLIndex].repairOrderUnitCost) {
            part.stocklineListObj[part.currentSLIndex].repairOrderUnitCost = formatNumberAsGlobalSettingsModule(part.stocklineListObj[part.currentSLIndex].repairOrderUnitCost, 2);
        }
        if (part.stocklineListObj[part.currentSLIndex].repairOrderExtendedCost) {
            part.stocklineListObj[part.currentSLIndex].repairOrderExtendedCost = formatNumberAsGlobalSettingsModule(part.stocklineListObj[part.currentSLIndex].repairOrderExtendedCost, 2);
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



    onChangeTimeLifeMin(str, part, index) {
        // for(let i=0; i < this.repairOrderData.length; i++) {
        // let part = this.repairOrderData[i];
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

    arrayrevisedPartlist: any = []	
    revisedPartNumCollection: any = [];
	getAllrevisedPart(strText = '') {
		if (this.arrayrevisedPartlist.length == 0) {
			this.arrayrevisedPartlist.push(0);
		}
		this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'partnumber', strText, false, 20, this.arrayrevisedPartlist.join(), this.currentUserMasterCompanyId).subscribe(res => {
			this.revisedPartNumCollection = [];
			for (let i = 0; i < res.length; i++) {				
				this.revisedPartNumCollection.push({ itemMasterId: res[i].value, partNumber: res[i].label });
			};
		});
	}

	filterRevisedPart(event) {
		if (event.query !== undefined && event.query !== null) {
			this.getAllrevisedPart(event.query);
		} else {
			this.getAllrevisedPart('');
		}
	}

}