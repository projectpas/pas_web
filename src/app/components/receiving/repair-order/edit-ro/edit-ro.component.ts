﻿import { Component, OnInit } from '@angular/core';
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

import { CustomerService } from '../../../../services/customer.service';
import { Dropdown } from 'primeng/dropdown';
import { LocalStoreManager } from '../../../../services/local-store-manager.service';
import { DBkeys } from '../../../../services/db-Keys';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-edit-ro',
    templateUrl: './edit-ro.component.html',
    styleUrls: ['./edit-ro.component.scss'],
    providers: [DatePipe]
})

export class EditRoComponent implements OnInit {
    localPoData: any;
    editPoData: any;
    allSites: any[];
    // allManufacturerInfo: any[] = [];
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
    repairOrderData: any[] = [];
    pageTitle: string = 'Edit Receieve RO';
    roStatus: any[];
    roUserType: DropDownData[];
    managementStructure: ManagementStructure[];
    ConditionList: DropDownData[] = [];
    managementStructureHierarchy: ManagementStructure[][] = [];
    selectedManagementStructure: ManagementStructure[] = [];
    // UOMList: any[];
    ManufacturerList: DropDownData[] = [];
    SiteList: any[];
    // GLAccountList: any[];
    currentDate: Date;
    headerNotes:any;
    headerMemo: any;
    ShippingViaList: DropDownData[];
    repairOrderId: number;
    repairOrderHeaderData: any;
    headerManagementStructure: any = {};
    CustomerList: DropDownData[] = [];
    VendorList: DropDownData[] = [];
    CompanyList: DropDownData[] = [];
    isROStockline: boolean = false;
    legalEntityList: any = [];
    isSpinnerVisible: boolean = true;
    moduleListDropdown: any = [];

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
        private customerService: CustomerService,
        private localStorage: LocalStoreManager,
        private datePipe: DatePipe
    ) {

        this.localPoData = this.vendorService.selectedPoCollection;
        this.editPoData = this.localData[0];
        this.currentDate = new Date();
    }

    ngOnInit() {
        this.getLegalEntity();
        this.loadModulesNamesForObtainOwnerTraceable();
        this.repairOrderId = this._actRoute.snapshot.queryParams['repairorderid'];
        this.receivingService.getReceivingROHeaderById(this.repairOrderId).subscribe(res => {
            this.repairOrderHeaderData = res;
            this.repairOrderHeaderData.openDate = this.repairOrderHeaderData.openDate ? new Date(this.repairOrderHeaderData.openDate) : '';
            this.repairOrderHeaderData.closedDate = this.repairOrderHeaderData.closedDate ? new Date(this.repairOrderHeaderData.closedDate) : '';
            this.repairOrderHeaderData.dateApproved = this.repairOrderHeaderData.dateApproved ? new Date(this.repairOrderHeaderData.dateApproved) : '';
            this.repairOrderHeaderData.needByDate = this.repairOrderHeaderData.needByDate ? new Date(this.repairOrderHeaderData.needByDate) : '';
            this.getManagementStructureCodes(this.repairOrderHeaderData.managementStructureId);
        });

        this.receivingService.getReceivingROPartsForEditById(this.repairOrderId).subscribe(
            results => {

                this.repairOrderData = results.map(x => {
                    return {
                        ...x,                        
                        stockLine: this.getStockLineDetails(x.stockLine),
                        timeLife: this.getTimeLifeDetails(x.timeLife)
                    }
                });
                const data: any = this.repairOrderData;
                for(var i = 0; i < data.length ; i++) {
                    if(data[i].stockLine.length > 0) {
                        this.isROStockline = true;
                        break;
                    }
                }
                // this.getManagementStructure().subscribe(
                //     results => {
                //         this.managementStructure = results[0];
                        var allParentParts = this.repairOrderData.filter(x => x.isParent == true);
                        for (let parent of allParentParts) {
                            var splitParts = this.repairOrderData.filter(x => !x.isParent && x.itemMaster.partNumber == parent.itemMaster.partNumber);

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

                        for (let part of this.repairOrderData) {
                            part.isEnabled = false;
                            // part.conditionId = 0;
                            let managementHierarchy: ManagementStructure[][] = [];
                            let selectedManagementStructure: ManagementStructure[] = [];
                            // this.getManagementStructureHierarchy(part.managementStructureId, managementHierarchy, selectedManagementStructure);
                            managementHierarchy.reverse();
                            selectedManagementStructure.reverse();

                            if (managementHierarchy[0] != undefined && managementHierarchy[0].length > 0) {
                                part.companyId = selectedManagementStructure[0].managementStructureId;
                                part.CompanyList = [];
                                for (let managementStruct of managementHierarchy[0]) {
                                    var dropdown = new DropDownData();
                                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                    dropdown.Value = managementStruct.code;
                                    part.CompanyList.push(dropdown);
                                }
                            }
                            if (managementHierarchy[1] != undefined && managementHierarchy[1].length > 0) {
                                part.businessUnitId = selectedManagementStructure[1].managementStructureId;
                                part.BusinessUnitList = [];
                                for (let managementStruct of managementHierarchy[1]) {
                                    var dropdown = new DropDownData();
                                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                    dropdown.Value = managementStruct.code;
                                    part.BusinessUnitList.push(dropdown);
                                }
                            }

                            if (managementHierarchy[2] != undefined && managementHierarchy[2].length > 0) {
                                part.divisionId = selectedManagementStructure[2].managementStructureId;
                                part.DivisionList = [];
                                for (let managementStruct of managementHierarchy[2]) {
                                    var dropdown = new DropDownData();
                                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                    dropdown.Value = managementStruct.code;
                                    part.DivisionList.push(dropdown);
                                }
                            }
                            if (managementHierarchy[3] != undefined && managementHierarchy[3].length > 0) {
                                part.departmentId = selectedManagementStructure[3].managementStructureId;
                                part.DepartmentList = [];
                                for (let managementStruct of managementHierarchy[3]) {
                                    var dropdown = new DropDownData();
                                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                    dropdown.Value = managementStruct.code;
                                    part.DepartmentList.push(dropdown);
                                }
                            }

                            if (part.stockLine != null) {
                                for (var SL of part.stockLine) {
                                    SL.obtainFromObject = new DropDownData();
                                    SL.ownerObject = new DropDownData();
                                    SL.traceableToObject = new DropDownData();

                                    SL.isEnabled = false;
                                    let stockLinemanagementHierarchy: ManagementStructure[][] = [];
                                    let stockLineSelectedManagementStructure: ManagementStructure[] = [];
                                    // this.getManagementStructureHierarchy(SL.managementStructureEntityId, stockLinemanagementHierarchy, stockLineSelectedManagementStructure);
                                    stockLinemanagementHierarchy.reverse();
                                    stockLineSelectedManagementStructure.reverse();

                                    if (stockLinemanagementHierarchy[0] != undefined && stockLinemanagementHierarchy[0].length > 0) {
                                        SL.companyId = stockLineSelectedManagementStructure[0].managementStructureId;
                                        SL.CompanyList = [];
                                        for (let managementStruct of stockLinemanagementHierarchy[0]) {
                                            var dropdown = new DropDownData();
                                            dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                            dropdown.Value = managementStruct.code;
                                            SL.CompanyList.push(dropdown);
                                        }
                                    }
                                    if (stockLinemanagementHierarchy[1] != undefined && stockLinemanagementHierarchy[1].length > 0) {
                                        SL.businessUnitId = stockLineSelectedManagementStructure[1].managementStructureId;
                                        SL.BusinessUnitList = [];
                                        for (let managementStruct of stockLinemanagementHierarchy[1]) {
                                            var dropdown = new DropDownData();
                                            dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                            dropdown.Value = managementStruct.code;
                                            SL.BusinessUnitList.push(dropdown);
                                        }
                                    }
                                    if (stockLinemanagementHierarchy[2] != undefined && stockLinemanagementHierarchy[2].length > 0) {
                                        SL.divisionId = stockLineSelectedManagementStructure[2].managementStructureId;
                                        SL.DivisionList = [];
                                        for (let managementStruct of stockLinemanagementHierarchy[2]) {
                                            var dropdown = new DropDownData();
                                            dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                            dropdown.Value = managementStruct.code;
                                            SL.DivisionList.push(dropdown);
                                        }
                                    }
                                    if (stockLinemanagementHierarchy[3] != undefined && stockLinemanagementHierarchy[3].length > 0) {
                                        SL.departmentId = stockLineSelectedManagementStructure[3].managementStructureId;
                                        SL.DepartmentList = [];
                                        for (let managementStruct of stockLinemanagementHierarchy[3]) {
                                            var dropdown = new DropDownData();
                                            dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                            dropdown.Value = managementStruct.code;
                                            SL.DepartmentList.push(dropdown);
                                        }
                                    }

                                }

                            }
                            part.CompanyList = this.legalEntityList;
                            if (part.stockLine != null) {
                                for (var SL of part.stockLine) {
                                    SL.CompanyList = this.legalEntityList;
                                    this.getManagementStructureDetailsForStockline(SL);
                                }
                            }
                        }

                        this.getManufacturers();
                        this.getStatus();
                        // this.getUOMList();
                        this.getConditionList();
                        // this.loadManagementdata();
                        // this.loadManufacturerData();
                        this.getAllSite();
                        // this.getAllGLAccount();
                        this.getShippingVia();
                        this.getCustomers();
                        this.getVendors();
                        this.getCompanyList();
                        this.isSpinnerVisible = false;

                        if(this.repairOrderData) {
                            for(let i=0; i < this.repairOrderData.length; i++) {
                                this.getCondIdPart(this.repairOrderData[i]);
                                this.getSiteDetailsOnEdit(this.repairOrderData[i]);
                            }
                            console.log(this.repairOrderData);
                        }
                //     },
                //     error => this.onDataLoadFailed(error)
                // );
            },
            error => {
                this.alertService.showMessage(this.pageTitle, "Something went wrong while loading the Repair Order detail", MessageSeverity.error);
                //return this.route.navigate(['/receivingmodule/receivingpages/app-purchase-order']);
            }
        );



        this.localData = [
            { partNumber: 'PN123' }
        ]
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
		this.headerMemo = this.repairOrderHeaderData.memo;
	}
	onSaveMemo() {
		this.repairOrderHeaderData.memo = this.headerMemo;
	}
    getLegalEntity() {
        this.commonService.getLegalEntityList().subscribe(res => {
            this.legalEntityList = res;
        })
    }
    
    loadModulesNamesForObtainOwnerTraceable() {
		this.commonService.getModuleListForObtainOwnerTraceable().subscribe(res => {
			this.moduleListDropdown = res;
		})
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
        if(part.stockLine && part.stockLine.length > 0) {
            const id = part.stockLine[0].conditionId;
            part.conditionId = id;
        }
    }

    getSiteDetailsOnEdit(part) {
        const stock = part.stockLine[0];
        if(stock) {
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

    getCustomers(): void {

        this.commonService.smartDropDownList('Customer', 'CustomerId', 'Name').subscribe(
            results => {
                for (let customer of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = customer.value.toLocaleString();
                    dropdown.Value = customer.label;
                    this.CustomerList.push(dropdown);
                }

                for (let part of this.repairOrderData) {
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
                    }
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    getVendors(): void {
        //stockLine.VendorList = [];
        this.commonService.smartDropDownList('Vendor', 'VendorId', 'VendorName').subscribe(vendors => {
                for (let vendor of vendors) {
                    var dropdown = new DropDownData();
                    dropdown.Key = vendor.value.toLocaleString();
                    dropdown.Value = vendor.label;
                    this.VendorList.push(dropdown);
                }

                for (let part of this.repairOrderData) {
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
                    }
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    getCompanyList() {
        this.commonService.smartDropDownList('LegalEntity', 'LegalEntityId', 'Name').subscribe(companies => {
            for (let company of companies) {
                var dropdown = new DropDownData();
                dropdown.Key = company.value.toLocaleString();
                dropdown.Value = company.label;
                this.CompanyList.push(dropdown);
            }

            for (let part of this.repairOrderData) {
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
                }
            }
		},
        error => this.onDataLoadFailed(error)
        );        
    }

    onFilter(event, stockLine, type): void {
        stockLine.filteredRecords = [];
        // var dropdownSource = type == 1 ? this.CustomerList : this.VendorList;
        if(type == 1) {
            var dropdownSource = this.CustomerList;
        } else if(type == 2) {
            var dropdownSource = this.VendorList;
        } else if(type == 9) {
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

    private getConditionList(): void {
        this.commonService.smartDropDownList('Condition', 'ConditionId', 'Description').subscribe(
            results => {
                for (let condition of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = condition.value.toLocaleString();
                    dropdown.Value = condition.label;
                    this.ConditionList.push(dropdown);
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    private getStatus() {
        this.roStatus = [];
        this.commonService.smartDropDownList('ROStatus', 'ROStatusId', 'Description').subscribe(response => {
			this.roStatus = response;
			this.roStatus = this.roStatus.sort((a,b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
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

    private getAllSite(): void {
        this.commonService.smartDropDownList('Site', 'SiteId', 'Name').subscribe(
            results => {
                this.SiteList = results.map(x => {
                    return {
                        siteId: x.value,
                        name: x.label
                    }
                });
                for (var part of this.repairOrderData) {
                    if (part.stockLine) {
                        // part.siteId = 0;
                        // part.warehouseId = 0;
                        // part.locationId = 0;
                        // part.shelfId = 0;
                        // part.binId = 0;
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

        if(stockLine.siteId != 0) {
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
                console.log(results);
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

    public getPartWareHouse(part: RepairOrderPart, onLoad?): void {
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

        this.commonService.smartDropDownList('Warehouse', 'WarehouseId', 'Name', 'SiteId', part.siteId).subscribe(
            results => {
                for (let wareHouse of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = wareHouse.value.toLocaleString();
                    dropdown.Value = wareHouse.label;
                    part.WareHouseList.push(dropdown);

                    if (part.stockLine && onLoad) {
                        for (var SL of part.stockLine) {
                            SL.WareHouseList.push(dropdown);
                        }
                    }
                }


            },
            error => this.onDataLoadFailed(error)
        );
    }

    public getPartLocation(part: RepairOrderPart, onLoad?): void {
        part.LocationList = [];
        part.ShelfList = [];
        part.BinList = [];

        part.locationId = 0;
        part.shelfId = 0;
        part.binId = 0;

        if (part.stockLine && onLoad) {
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

        this.commonService.smartDropDownList('Location', 'LocationId', 'Name', 'WarehouseId', part.warehouseId).subscribe(
            results => {
                for (let loc of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = loc.value.toLocaleString();
                    dropdown.Value = loc.label;
                    part.LocationList.push(dropdown);

                    if (part.stockLine && onLoad) {
                        for (var SL of part.stockLine) {
                            SL.LocationList.push(dropdown);
                        }
                    }
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    public getPartShelf(part: RepairOrderPart, onLoad?): void {
        part.ShelfList = [];
        part.BinList = [];

        part.shelfId = 0;
        part.binId = 0;

        if (part.stockLine && onLoad) {
            for (var SL of part.stockLine) {
                SL.locationId = part.locationId;
                SL.shelfId = 0;
                SL.binId = 0;

                SL.ShelfList = [];
                SL.BinList = [];
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
                            SL.ShelfList.push(dropdown);
                        }
                    }
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    public getPartBin(part: RepairOrderPart, onLoad?): void {
        part.BinList = [];
        part.binId = 0;

        if (part.stockLine && onLoad) {
            for (var SL of part.stockLine) {
                SL.shelfId = part.shelfId;
                SL.binId = 0;
                SL.BinList = [];
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
                            SL.BinList.push(dropdown);
                        }
                    }
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    public setPartBinIdToStockline(part: RepairOrderPart): void {
        if (part.stockLine) {
            for (var SL of part.stockLine) {
                SL.binId = part.binId;
            }
        }
    }

    public conditionChange(part: RepairOrderPart) {
        if (part.stockLine) {
            for (var SL of part.stockLine) {
                SL.conditionId = part.conditionId;
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

    // private getAllGLAccount(): void {
    //     this.commonService.getGlAccountList().subscribe(glAccountData => {
    //         this.GLAccountList = glAccountData;

    //         for (var part of this.repairOrderData) {
    //             if (part.stockLine) {
    //                 for (var SL of part.stockLine) {
    //                     if (SL.glAccountId > 0) {
    //                         var glAccount = this.GLAccountList.filter(x => x.value == SL.glAccountId)[0];
    //                         SL.glAccountText = glAccount.label;
    //                     }
    //                 }
    //             }
    //         }

    //     });
    // }

    calculateExtendedCost(part: any, stockLine: any): void {
        if (stockLine.repairOrderUnitCost == undefined || stockLine.repairOrderUnitCost == '') {
            return;
        }
        if (part.itemMaster.isSerialized) {
            stockLine.repairOrderExtendedCost = stockLine.repairOrderUnitCost;
        }
        else {
            const unitCost = stockLine.repairOrderUnitCost ? parseFloat(stockLine.repairOrderUnitCost.toString().replace(/\,/g,'')) : 0;
            stockLine.repairOrderExtendedCost = unitCost * part.quantityActuallyReceived;
        }
        if (stockLine.repairOrderUnitCost) {
            stockLine.repairOrderUnitCost = stockLine.repairOrderUnitCost ? formatNumberAsGlobalSettingsModule(stockLine.repairOrderUnitCost, 2) : '0.00';
        }
        if (stockLine.repairOrderExtendedCost) {
            stockLine.repairOrderExtendedCost = stockLine.repairOrderExtendedCost ? formatNumberAsGlobalSettingsModule(stockLine.repairOrderExtendedCost, 2) : '0.00';
        }
    }

    calculatePartExtendedCost(part: any): void {
        if (part.unitCost == undefined || part.unitCost == '') {
            return;
        }
        part.unitCost = part.unitCost ? formatNumberAsGlobalSettingsModule(part.unitCost, 2) : '0.00';
        if (part.itemMaster.isSerialized) {
            const unitCost = part.unitCost ? parseFloat(part.unitCost.toString().replace(/\,/g,'')) : '0.00';
            const extendedCost = unitCost;
            part.extendedCost = extendedCost ? formatNumberAsGlobalSettingsModule(extendedCost, 2) : '0.00';
        }
        else {
            const unitCost = part.unitCost ? parseFloat(part.unitCost.toString().replace(/\,/g,'')) : 0;
            const extendedCost = unitCost * part.quantityActuallyReceived;
            part.extendedCost = extendedCost ? formatNumberAsGlobalSettingsModule(extendedCost, 2) : '0.00';
        }

        if (part.stockLine) {
            for (var SL of part.stockLine) {
                SL.repairOrderUnitCost = part.unitCost;
                SL.repairOrderExtendedCost = part.extendedCost;
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

    onObtainFromChange(event, stockLine) {
        stockLine.obtainFromObject = {};
        stockLine.obtainFrom = '';


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
        stockLine.ownerObject = {};
        stockLine.owner = '';

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
        stockLine.traceableToObject = '';
        stockLine.traceableTo = '';

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

    onObtainSelect(stockLine: StockLine): void {
        stockLine.obtainFrom = stockLine.obtainFromObject.Key;
    }

    onOwnerSelect(stockLine: StockLine): void {
        stockLine.owner = stockLine.ownerObject.Key;
    }

    onTraceableToSelect(stockLine: StockLine): void {
        stockLine.traceableTo = stockLine.traceableToObject.Key;
    }

    //remove once add dynamic content
    editPart(part: RepairOrderPart) {
        part.isEnabled = !part.isEnabled;
        if (part.stockLine) {
            for (var sl of part.stockLine) {
                sl.isEnabled = part.isEnabled;
                sl.quantityRejected = 0;
            }
        }
    }

    editStockLine(stockLine: StockLine) {
        stockLine.isEnabled = !stockLine.isEnabled;
        stockLine.quantityRejected = 0;
    }

    updateStockLine() {
        //let receiveParts: ReceiveParts[] = [];
        let receiveParts: any[] = [];

        for (var part of this.repairOrderData) {
            if (part.stockLine) {

                var timeLife = [];
                var stockLineToUpdate = part.stockLine;

                for (var stockLine of stockLineToUpdate) {


                    if (stockLine.conditionId == undefined || stockLine.conditionId == 0) {
                        this.alertService.showMessage(this.pageTitle, "Please select Condition in Part No. " + part.itemMaster.partNumber + " at stockline " + stockLine.stockLineNumber, MessageSeverity.error);
                        return;
                    }

                    if (stockLine.siteId == undefined || stockLine.siteId == 0) {
                        this.alertService.showMessage(this.pageTitle, "Please select Site in Part No. " + part.itemMaster.partNumber + " of stockline " + stockLine.stockLineNumber, MessageSeverity.error);
                        return;
                    }

                    for (var tl of part.timeLife) {
                        if (tl.stockLineDraftId == stockLine.stockLineDraftId) {
                            timeLife.push(tl);
                        }
                    }
                }

                if (stockLineToUpdate.length > 0) {
                    let receivePart: ReceiveParts = new ReceiveParts();
                    receivePart.repairOrderPartRecordId = part.repairOrderPartRecordId;
                    receivePart.managementStructureEntityId  = part.managementStructureEntityId ? part.managementStructureEntityId : null;
                    receivePart.stockLines = stockLineToUpdate;
                    // receivePart.timeLife = timeLife;
                    receivePart.timeLife = this.getTimeLife(timeLife, part.repairOrderPartRecordId);
                    receiveParts.push(receivePart);
                }
            }
        }
        if (receiveParts.length > 0) {
            this.receivingService.updateStockLine(receiveParts).subscribe(data => {
                this.alertService.showMessage(this.pageTitle, 'Stock Line updated successfully.', MessageSeverity.success);
                this.route.navigateByUrl(`/receivingmodule/receivingpages/app-view-ro?repairOrderId=${this.repairOrderId}`);
                //return this.route.navigate(['/receivingmodule/receivingpages/app-view-po']);
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
        else {
            this.alertService.showMessage(this.pageTitle, 'Please edit Stock Line to update.', MessageSeverity.info);
        }

        //this.alertService.showMessage(this.pageTitle, 'Stock Lines update successfully.', MessageSeverity.success)
        //return this.route.navigate(['/receivingmodule/receivingpages/app-view-po']);
    }

    getTimeLife(timeLife, repairOrderPartRecordId) {
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
                repairOrderPartRecordId: repairOrderPartRecordId,
                isActive: true
            }
        })
        return tmLife;
    }

    onChangeTimeLifeMin(str, index) {
        for(let i=0; i < this.repairOrderData.length; i++) {
            let part = this.repairOrderData[i];
            let value = part.timeLife[index][str];
            if(value > 59) {
                part.timeLife[index][str] = 0;
                this.alertService.showMessage(this.pageTitle, 'Minutes can\'t be greater than 59', MessageSeverity.error);
            }
        }
    }


    private getShippingVia(): void {
        this.commonService.smartDropDownList('ShippingVia', 'ShippingViaId', 'Name').subscribe(results => {
            this.ShippingViaList = [];
            for (let shippingVia of results) {
                var dropdown = new DropDownData();
                dropdown.Key = shippingVia.value.toLocaleString();
                dropdown.Value = shippingVia.label;
                this.ShippingViaList.push(dropdown);
            }
        });
    }

    getManufacturers() {
        this.ManufacturerList = [];
        this.commonService.smartDropDownList('Manufacturer', 'ManufacturerId', 'Name').subscribe(
            results => {
                for (let manufacturer of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = manufacturer.value.toLocaleString();
                    dropdown.Value = manufacturer.label;
                    this.ManufacturerList.push(dropdown);
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    deleteStockLine(stockLine: StockLine) {               
        if (stockLine) {
            var OkCancel = confirm("Stock Line will be deleted after save/update. Do you still want to continue?");
            if (OkCancel == true) {
                stockLine.isEnabled = true;
                stockLine.isDeleted = true;
                this.alertService.showMessage(this.pageTitle, 'Stock Line removed from the list.', MessageSeverity.success);
                return;
            }
        }
    }

    // SetStockLineUnitCost(part: RepairOrderPart): void {
    //     for (var SL of part.stockLine) {
    //         SL.repairOrderUnitCost = part.unitCost;
    //         SL.repairOrderExtendedCost = SL.quantity * SL.repairOrderUnitCost;
    //     }
    // }

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
}

