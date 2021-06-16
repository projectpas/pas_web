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
import { GlAccount } from '../../../../models/GlAccount.model';
import { ShippingService } from '../../../../services/shipping/shipping-service';
import { CommonService } from '../../../../services/common.service';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { PurchaseOrderService } from '../../../../services/purchase-order.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-po',
  templateUrl: './view-po.component.html',
  styleUrls: ['./view-po.component.scss']
})
/** view-po component*/
export class ViewPoComponent implements OnInit {
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
    purchaseOrderData: PurchaseOrderPart[] = [];
    pageTitle: string = 'Edit Receieve RO';
    poStatus: any[];
    poUserType: DropDownData[];
    managementStructure: ManagementStructure[];
    // ConditionList: DropDownData[] = [];
    managementStructureHierarchy: ManagementStructure[][] = [];
    selectedManagementStructure: ManagementStructure[] = [];
    UOMList: any[];
    ManufacturerList: DropDownData[] = [];
    SiteList: any[];
    GLAccountList: GlAccount[];
    currentDate: Date;
    ShippingViaList : DropDownData[];
    purchaseOrderId: number;
    purchaseOrderHeaderData: any;
    headerManagementStructure: any = {};
    isSpinnerVisible: boolean = true;
    poDataHeader: any;
    modal: NgbModalRef;

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
        private purchaseOrderService: PurchaseOrderService
    ) {

        this.localPoData = this.vendorService.selectedPoCollection;
        this.editPoData = this.localData[0];
        this.currentDate = new Date();
    }

    ngOnInit() {        
        this.purchaseOrderId = this._actRoute.snapshot.queryParams['purchaseorderid'];
        this.getReceivingPOHeaderById(this.purchaseOrderId);
        this.getStockDetailsOnLoad();
        this.localData = [
            { partNumber: 'PN123' }
        ]
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
            });
    }

    getStockDetailsOnLoad() {
        this.receivingService.getReceivingPOPartsForViewById(this.purchaseOrderId).subscribe(
            results => {
                this.purchaseOrderData = results.map(x => {
                    return {
                        ...x,
                        unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '',
                        extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '',
                        stockLine: this.getStockLineDetails(x.stockLine),
                        timeLife: this.getTimeLifeDetails(x.timeLife)
                    }
                });               
                
                var allParentParts = this.purchaseOrderData.filter(x => x.isParent == true);
                        for (let parent of allParentParts) {
                            var splitParts = this.purchaseOrderData.filter(x => !x.isParent && x.parentId == parent.purchaseOrderPartRecordId);
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
                        this.isSpinnerVisible = false;               
            },
            error => {
                this.alertService.showMessage(this.pageTitle, "Something went wrong while loading the Purchase Order detail", MessageSeverity.error);
                this.isSpinnerVisible = false;
            }
        );
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
                x,
                stockLineDraftId: x.stockLineDraftId,
                timeLifeDraftCyclesId: x.timeLifeDraftCyclesId,
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
    
    parsedText(text) {
        if (text) {
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
        }
    } 

    editStockLine(stockLine: StockLine) {
        stockLine.isEnabled = !stockLine.isEnabled;
        stockLine.quantityRejected = 0;
    }
   

    CreatePurchaseOrderStockline() {   
        this.isSpinnerVisible = true;     
        this.receivingService.createStockLine(this.purchaseOrderId).subscribe(
            results => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(this.pageTitle, "Stockline created successfully.", MessageSeverity.success);
                return this.route.navigate(['/receivingmodule/receivingpages/app-purchase-order']);
            },err=>{this.isSpinnerVisible = false;}           
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
}