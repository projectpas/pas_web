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
import { RepairOrder, DropDownData, RepairOrderPart, StockLine, ReceiveParts } from '../receiving-ro/RepairOrder.model';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { ManagementStructure } from '../receiving-ro/managementstructure.model';
import { UnitOfMeasureService } from '../../../../services/unitofmeasure.service';
import { GlAccountService } from '../../../../services/glAccount/glAccount.service';
import { GlAccount } from '../../../../models/GlAccount.model';
import { ShippingService } from '../../../../services/shipping/shipping-service';
import { CommonService } from '../../../../services/common.service';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { RepairOrderService } from '../../../../services/repair-order.service';
import { AppModuleEnum } from '../../../../enum/appmodule.enum';

@Component({
    selector: 'app-view-ro',
    templateUrl: './view-ro.component.html',
    styleUrls: ['./view-ro.component.scss']
})

export class ViewRoComponent {
    localPoData: any;
    editPoData: any;
    allSites: any[];
    allManufacturerInfo: any[] = [];
    partList: any;
    // managementInfo: any[] = [];
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
    rpoEditPF: boolean = true; //remove once add dynamic content
    rpoEditCF: boolean = true; //remove once add dynamic content
    memoNotes: string;
    repairOrderData: RepairOrderPart[] = [];
    pageTitle: string = 'Edit Receieve RO';
    roStatus: any[];
    roUserType: DropDownData[];
    managementStructure: ManagementStructure[];
    // ConditionList: DropDownData[] = [];
    managementStructureHierarchy: ManagementStructure[][] = [];
    selectedManagementStructure: ManagementStructure[] = [];
    UOMList: any[];
    ManufacturerList: DropDownData[] = [];
    SiteList: any[];
    GLAccountList: GlAccount[];
    currentDate: Date;
    ShippingViaList: DropDownData[];
    repairOrderId: number;
    repairOrderHeaderData: any;
    headerManagementStructure: any = {};
    isSpinnerVisible: boolean = false;
    companyModuleId: number = 0;
    vendorModuleId: number = 0;
    customerModuleId: number = 0;
    otherModuleId: number = 0;

    /** edit-ro ctor */
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
        private repairOrderService: RepairOrderService,
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
        this.repairOrderId = this._actRoute.snapshot.queryParams['repairOrderId'];
        this.getReceivingROHeaderById(this.repairOrderId);
        this.getStockDetailsOnLoad();
        this.localData = [
            { partNumber: 'PN123' }
        ]
    }

    getReceivingROHeaderById(id) {
        this.repairOrderService.getROViewById(id).subscribe(res => {
            this.repairOrderHeaderData = res;
            this.repairOrderHeaderData.openDate = this.repairOrderHeaderData.openDate ? new Date(this.repairOrderHeaderData.openDate) : '';
            this.repairOrderHeaderData.closedDate = this.repairOrderHeaderData.closedDate ? new Date(this.repairOrderHeaderData.closedDate) : '';
            this.repairOrderHeaderData.dateApproved = this.repairOrderHeaderData.dateApproved ? new Date(this.repairOrderHeaderData.dateApproved) : '';
            this.repairOrderHeaderData.needByDate = this.repairOrderHeaderData.needByDate ? new Date(this.repairOrderHeaderData.needByDate) : '';
            this.repairOrderHeaderData.creditLimit = this.repairOrderHeaderData.creditLimit ? formatNumberAsGlobalSettingsModule(this.repairOrderHeaderData.creditLimit, 2) : '0.00';
        });
    }

    getStockDetailsOnLoad() {
        this.receivingService.getReceivingROPartsForViewById(this.repairOrderId).subscribe(
            results => {               
                this.repairOrderData = results.map(x => {
                    return {
                        ...x,  
                        unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '',
                        extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '',                                        
                        stockLine: this.getStockLineDetails(x.stockLine),
                        timeLife: this.getTimeLifeDetails(x.timeLife)
                    }
                });                 
                var allParentParts = this.repairOrderData.filter(x => x.isParent == true);
                for (let parent of allParentParts) {
                    var splitParts = this.repairOrderData.filter(x => !x.isParent && x.parentId == parent.repairOrderPartRecordId);  
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
                this.getStatus();               
                this.isSpinnerVisible = false;                
            },
            error => {
                this.alertService.showMessage(this.pageTitle, "Something went wrong while loading the Repair Order detail", MessageSeverity.error);
                this.isSpinnerVisible = false;
            }
        );
    }

    getStockLineDetails(stockline) {
        stockline = stockline.map(x => {
            return {
                ...x,
                repairOrderUnitCost: x.repairOrderUnitCost ? formatNumberAsGlobalSettingsModule(x.repairOrderUnitCost, 2) : '0.00',
                repairOrderExtendedCost: x.repairOrderExtendedCost ? formatNumberAsGlobalSettingsModule(x.repairOrderExtendedCost, 2) : '0.00'
            }
        })
        return stockline;
    }

    getTimeLifeDetails(timeLife) {
        timeLife = timeLife.map(x => {
            return {
                cyclesRemaining: x.cyclesRemaining ? x.cyclesRemaining : '00:00',
                cyclesSinceInspection: x.cyclesSinceInspection ? x.cyclesSinceInspection : '00:00',
                cyclesSinceNew: x.cyclesSinceNew ? x.cyclesSinceNew : '00:00',
                cyclesSinceOVH: x.cyclesSinceOVH ? x.cyclesSinceOVH : '00:00',
                cyclesSinceRepair: x.cyclesSinceRepair ? x.cyclesSinceRepair : '00:00',
                timeRemaining: x.timeRemaining ? x.timeRemaining : '00:00',
                timeSinceInspection: x.timeSinceInspection ? x.timeSinceInspection : '00:00',
                timeSinceNew: x.timeSinceNew ? x.timeSinceNew : '00:00',
                timeSinceOVH: x.timeSinceOVH ? x.timeSinceOVH : '00:00',
                timeSinceRepair: x.timeSinceRepair ? x.timeSinceRepair : '00:00',
                lastSinceInspection: x.lastSinceInspection ? x.lastSinceInspection : '00:00',
                lastSinceNew: x.lastSinceNew ? x.lastSinceNew : '00:00',
                lastSinceOVH: x.lastSinceOVH ? x.lastSinceOVH : '00:00'
            }
        })
        return timeLife;
    }

    getManagementStructureCodes(id) {
        this.commonService.getManagementStructureCodes(id).subscribe(res => {
            if (res.Level1) {
                this.headerManagementStructure.level1 = res.Level1;
            }
            if (res.Level2) {
                this.headerManagementStructure.level2 = res.Level2;
            }
            if (res.Level3) {
                this.headerManagementStructure.level3 = res.Level3;
            }
            if (res.Level4) {
                this.headerManagementStructure.level4 = res.Level4;
            }
        })
    }

    getManagementStructureCodesForPart(part) {
        this.commonService.getManagementStructureCodes(part.managementStructureId).subscribe(res => {
            if (res.Level1) {
                part.companyText = res.Level1;
            }
            if (res.Level2) {
                part.businessUnitText = res.Level2;
            }
            if (res.Level3) {
                part.divisionText = res.Level3;
            }
            if (res.Level4) {
                part.departmentText = res.Level4;
            }
        })
    }

    private getManagementStructure() {
        return this.legalEntityService.getManagemententity();
    }

    // private getUOMList() {
    //     this.uomService.getUnitOfMeasureList().subscribe(
    //         result => {
    //             this.UOMList = result[0];
    //             for (var part of this.repairOrderData) {
    //                 var uom = this.UOMList.filter(x => x.unitOfMeasureId == part.uomId)[0];
    //                 if (uom != undefined) {
    //                     part.UOMText = uom.shortName;
    //                 }
    //             }
    //         }
    //     );
    // }

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

    // private getConditionList(): void {
    //     this.conditionService.getConditionList().subscribe(
    //         results => {
    //             for (let condition of results[0]) {
    //                 var dropdown = new DropDownData();
    //                 dropdown.Key = condition.conditionId.toLocaleString();
    //                 dropdown.Value = condition.description;
    //                 this.ConditionList.push(dropdown);
    //             }
    //         },
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

    private getStatus() {
        this.roStatus = [];
        this.commonService.smartDropDownList('ROStatus', 'ROStatusId', 'Description').subscribe(response => {
            this.roStatus = response;
            this.roStatus = this.roStatus.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
        });
        // this.roStatus.push(<DropDownData>{ Key: '1', Value: 'Open' });
        // this.roStatus.push(<DropDownData>{ Key: '2', Value: 'Pending' });
        // this.roStatus.push(<DropDownData>{ Key: '3', Value: 'Fulfilling' });
        // this.roStatus.push(<DropDownData>{ Key: '4', Value: 'Closed' });

        // this.roUserType = [];
        // this.roUserType.push(<DropDownData>{ Key: '1', Value: 'Customer' });
        // this.roUserType.push(<DropDownData>{ Key: '2', Value: 'Vendor' });
        // this.roUserType.push(<DropDownData>{ Key: '3', Value: 'Company' });
    }

    // private loadManagementdata() {
    //     this.legalEntityService.getManagemententity().subscribe(data => {
    //         this.managementInfo = data[0]
    //     });
    // }

    private getPartBusinessUnitList(part: RepairOrderPart): void {
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

    private getPartDivision(part: RepairOrderPart): void {
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

    private getPartDepartment(part: RepairOrderPart): void {

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

    private setPartDepartmentManagementStructureId(part: RepairOrderPart) {
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

    // private getAllSite(): void {
    //     this.siteService.getSiteList().subscribe(
    //         results => {
    //             this.SiteList = results[0];
    //             for (var part of this.repairOrderData) {
    //                 if (part.stockLine) {
    //                     part.siteId = 0;
    //                     part.warehouseId = 0;
    //                     part.locationId = 0;
    //                     part.shelfId = 0;
    //                     part.binId = 0;
    //                     part.SiteList = [];
    //                     for (var site of results[0]) {
    //                         var row = new DropDownData();
    //                         row.Key = site.siteId.toLocaleString();
    //                         row.Value = site.name;
    //                         part.SiteList.push(row);
    //                     }

    //                     for (var SL of part.stockLine) {
    //                         SL.SiteList = [];

    //                         for (var site of results[0]) {
    //                             var row = new DropDownData();
    //                             row.Key = site.siteId.toLocaleString();
    //                             row.Value = site.name;
    //                             SL.SiteList.push(row);
    //                         }

    //                         if (SL.warehouseId > 0) {
    //                             this.getStockLineWareHouse(SL, true);
    //                         }
    //                         if (SL.locationId > 0) {
    //                             this.getStockLineLocation(SL, true);
    //                         }
    //                         if (SL.shelfId > 0) {
    //                             this.getStockLineShelf(SL, true);
    //                         }
    //                         if (SL.binId > 0) {
    //                             this.getStockLineBin(SL, true);
    //                         }
    //                     }
    //                 }
    //             }
    //         },
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

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

    private getStockLineWareHouse(stockLine: StockLine, onPageLoad: boolean): void {
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

        this.binservice.getWareHouseBySiteId(stockLine.siteId).subscribe(
            results => {
                for (let wareHouse of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = wareHouse.warehouseId.toLocaleString();
                    dropdown.Value = wareHouse.warehouseName;
                    stockLine.WareHouseList.push(dropdown);
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    private getStockLineLocation(stockLine: StockLine, onPageLoad: boolean): void {
        stockLine.LocationList = [];
        stockLine.ShelfList = [];
        stockLine.BinList = [];

        if (!onPageLoad) {
            stockLine.locationId = 0;
            stockLine.shelfId = 0;
            stockLine.binId = 0;
        }

        this.binservice.getLocationByWareHouseId(stockLine.warehouseId).subscribe(
            results => {
                console.log(results);
                for (let loc of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = loc.locationId.toLocaleString();
                    dropdown.Value = loc.name;
                    stockLine.LocationList.push(dropdown);
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    private getStockLineShelf(stockLine: StockLine, onPageLoad: boolean): void {
        stockLine.ShelfList = [];
        stockLine.BinList = [];

        if (!onPageLoad) {
            stockLine.shelfId = 0;
            stockLine.binId = 0;
        }

        this.binservice.getShelfByLocationId(stockLine.locationId).subscribe(
            results => {

                for (let shelf of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = shelf.shelfId.toLocaleString();
                    dropdown.Value = shelf.name;
                    stockLine.ShelfList.push(dropdown);
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    private getPartWareHouse(part: RepairOrderPart): void {
        part.WareHouseList = [];
        part.LocationList = [];
        part.ShelfList = [];
        part.BinList = [];

        part.warehouseId = 0;
        part.locationId = 0;
        part.shelfId = 0;
        part.binId = 0;

        if (part.stockLine) {
            for (var SL of part.stockLine) {
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

        this.binservice.getWareHouseBySiteId(part.siteId).subscribe(
            results => {
                for (let wareHouse of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = wareHouse.warehouseId.toLocaleString();
                    dropdown.Value = wareHouse.warehouseName;
                    part.WareHouseList.push(dropdown);

                    if (part.stockLine) {
                        for (var SL of part.stockLine) {
                            SL.WareHouseList.push(dropdown);
                        }
                    }
                }


            },
            error => this.onDataLoadFailed(error)
        );
    }

    private getPartLocation(part: RepairOrderPart): void {
        part.LocationList = [];
        part.ShelfList = [];
        part.BinList = [];

        part.locationId = 0;
        part.shelfId = 0;
        part.binId = 0;

        if (part.stockLine) {
            for (var SL of part.stockLine) {
                SL.warehouseId = part.warehouseId;
                SL.locationId = 0;
                SL.shelfId = 0;
                SL.binId = 0;
                SL.LocationList = [];
                SL.ShelfList = [];
                SL.BinList = [];
            }
        }

        this.binservice.getLocationByWareHouseId(part.warehouseId).subscribe(
            results => {
                for (let loc of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = loc.locationId.toLocaleString();
                    dropdown.Value = loc.name;
                    part.LocationList.push(dropdown);

                    if (part.stockLine) {
                        for (var SL of part.stockLine) {
                            SL.LocationList.push(dropdown);
                        }
                    }
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    private getPartShelf(part: RepairOrderPart): void {
        part.ShelfList = [];
        part.BinList = [];

        part.shelfId = 0;
        part.binId = 0;

        if (part.stockLine) {
            for (var SL of part.stockLine) {
                SL.locationId = part.locationId;
                SL.shelfId = 0;
                SL.binId = 0;

                SL.ShelfList = [];
                SL.BinList = [];
            }
        }

        this.binservice.getShelfByLocationId(part.locationId).subscribe(
            results => {
                for (let shelf of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = shelf.shelfId.toLocaleString();
                    dropdown.Value = shelf.name;
                    part.ShelfList.push(dropdown);

                    if (part.stockLine) {
                        for (var SL of part.stockLine) {
                            SL.ShelfList.push(dropdown);
                        }
                    }
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    private getPartBin(part: RepairOrderPart): void {
        part.BinList = [];
        part.binId = 0;

        if (part.stockLine) {
            for (var SL of part.stockLine) {
                SL.shelfId = part.shelfId;
                SL.binId = 0;
                SL.BinList = [];
            }
        }

        this.binservice.getBinByShelfId(part.shelfId).subscribe(
            results => {
                for (let bin of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = bin.binId.toLocaleString();
                    dropdown.Value = bin.name;
                    part.BinList.push(dropdown);
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    private setPartBinIdToStockline(part: RepairOrderPart): void {
        if (part.stockLine) {
            for (var SL of part.stockLine) {
                SL.binId = part.binId;
            }
        }
    }

    private conditionChange(part: RepairOrderPart) {
        if (part.stockLine) {
            for (var SL of part.stockLine) {
                SL.conditionId = part.conditionId;
            }
        }

    }

    private getStockLineBin(stockLine: StockLine, onPageLoad: boolean): void {
        stockLine.BinList = [];

        if (!onPageLoad) {
            stockLine.binId = 0;
        }

        this.binservice.getBinByShelfId(stockLine.shelfId).subscribe(
            results => {
                for (let bin of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = bin.binId.toLocaleString();
                    dropdown.Value = bin.name;
                    stockLine.BinList.push(dropdown);
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    // private getAllGLAccount(): void {
    //     this.glAccountService.getAll().subscribe(glAccountData => {
    //         this.GLAccountList = glAccountData[0];

    //         for (var part of this.repairOrderData) {
    //             if (part.stockLine) {
    //                 for (var SL of part.stockLine) {
    //                     if (SL.glAccountId > 0) {
    //                         var glAccount = this.GLAccountList.filter(x => x.glAccountId == SL.glAccountId)[0];
    //                         SL.glAccountText = glAccount.accountCode;
    //                     }
    //                 }
    //             }
    //         }

    //     });
    // }

    calculateExtendedCost(part: any, stockLine: any): void {
        if (stockLine.purchaseOrderUnitCost == undefined || stockLine.purchaseOrderUnitCost == '') {
            return;
        }
        if (part.itemMaster.isSerialized) {
            stockLine.purchaseOrderExtendedCost = stockLine.purchaseOrderUnitCost;
        }
        else {
            stockLine.purchaseOrderExtendedCost = stockLine.purchaseOrderUnitCost * part.quantityActuallyReceived;
        }
    }

    calculatePartExtendedCost(part: any): void {
        if (part.unitCost == undefined || part.unitCost == '') {
            return;
        }
        if (part.itemMaster.isSerialized) {
            part.extendedCost = part.unitCost;
        }
        else {
            part.extendedCost = part.unitCost * part.quantityActuallyReceived;
        }

        if (part.stockLine) {
            for (var SL of part.stockLine) {
                SL.purchaseOrderUnitCost = part.unitCost;
                SL.purchaseOrderExtendedCost = part.extendedCost;
            }
        }
    }

    // private loadManufacturerData() {
    //     this.manufacturerService.getWorkFlows().subscribe(data => {
    //         this.allManufacturerInfo = data[0];
    //     });
    // }

    private onDataLoadFailed(error: any) {
        this.isSpinnerVisible = false;
    }  

    editStockLine(stockLine: StockLine) {
        stockLine.isEnabled = !stockLine.isEnabled;
        stockLine.quantityRejected = 0;
    }

    CreateRepairOrderStockline() {
        this.isSpinnerVisible = true;  
        this.receivingService.CreateStockLineForRepairOrder(this.repairOrderId).subscribe(
            results => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(this.pageTitle, "Stockline created successfully.", MessageSeverity.success);
                return this.route.navigate(['/receivingmodule/receivingpages/app-ro']);
            },
            err=>{this.isSpinnerVisible = false;}  
        );
    }

    deleteStockLine(stockLine) {
        if (stockLine) {
            var OkCancel = confirm("Stock Line will be deleted after save/update. Do you still want to continue?");
            if (OkCancel == true) {
                this.isSpinnerVisible = true;
                this.receivingService.deleteStockLineDraft(stockLine.stockLineDraftId, stockLine.quantity).subscribe(res => {
                    this.getStockDetailsOnLoad();
                },
                    err => {
                        this.isSpinnerVisible = false;
                    })
                // stockLine.isEnabled = true;
                // stockLine.isDeleted = true;
                this.alertService.showMessage(this.pageTitle, 'Stock Line removed from the list.', MessageSeverity.success);
                return;
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
}