import { Component, OnInit, Input } from '@angular/core';
import { ReceivingService } from '../../../../services/receiving/receiving.service';
import { RepairOrder, RepairOrderPart } from '../receiving-ro/RepairOrder.model';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';

@Component({
  selector: 'app-ro-view-list',
  templateUrl: './ro-view-list.component.html',
  styleUrls: ['./ro-view-list.component.scss']
})

export class ROViewListComponent implements OnInit {
    //@Input() repairOrderData: RepairOrderPart[] = [];
    @Input() repairOrderId:any
    toggleIcon: boolean = false;
    toggleAddDetails: boolean = false;   
    currentSLIndex: number = 0;
    currentTLIndex: number = 0;
    currentSERIndex: number = 0;
    pageTitle: string = 'View Repair Order';
    isSpinnerVisible: boolean = false;
    repairOrderDatas: RepairOrderPart[] = [];
    constructor(private receivingService: ReceivingService,
        private alertService: AlertService) {
    }

    ngOnInit() {
        this.getStockDetailsOnLoad();
    }

    getStockDetailsOnLoad() {        
        this.receivingService.getReceivedROPartsForView(this.repairOrderId).subscribe(
            results => {               
                this.repairOrderDatas = results.map(x => {
                    return {
                        ...x,  
                        unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '',
                        extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '',                                        
                        stockLine: this.getStockLineDetails(x.stockLine),
                        timeLife: this.getTimeLifeDetails(x.timeLife)
                    }
                });                 
                var allParentParts = this.repairOrderDatas.filter(x => x.isParent == true);
                for (let parent of allParentParts) {
                    var splitParts = this.repairOrderDatas.filter(x => !x.isParent && x.parentId == parent.repairOrderPartRecordId);  
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
                //this.getStatus();               
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
    

    // moveStockLinePage(type: string, index: number, part: RepairOrderPart): void {
    //     var count = type == 'stockline' ? part.stockLine.length : part.timeLife.length;
    //     if (index >= 0 && index < count) {
    //         if (part.itemMaster.isSerialized) {
    //             part.currentSLIndex = index;
    //         }
    //         part.currentSERIndex = index;
    //         part.currentTLIndex = index;
    //     }
    // }

    // public gotoStockLinePage(event: any, part: RepairOrderPart): void {
    //     let value = event.target.value;
    //     let index: number = 0;
    //     if (value == '') {
    //         return;
    //     }
    //     index = Number.parseInt(value) - 1;

    //     if (index < part.stockLine.length && index >= 0) {
    //         if (part.itemMaster.isSerialized) {
    //             part.currentSLIndex = index;
    //             part.currentSERIndex = index;
    //         }
    //         part.currentTLIndex = index;
    //     }
    //     else {
    //         this.alertService.showMessage(this.pageTitle, "Invalid stock line page", MessageSeverity.error);
    //         event.target.value = "1";
    //         if (!part.isSameDetailsForAllParts) {
    //             part.currentSLIndex = 0;
    //             part.currentSERIndex = 0;
    //         }
    //         part.currentTLIndex = 0;
    //         part.currentSERIndex = 0;
    //         return;
    //     }
    // }

    // private onDataLoadFailed(error: any) {
    // }

    // toggleExpandIcon(part: RepairOrderPart) {
    //     part.showStockLineGrid = !part.showStockLineGrid;         
    // }

    // addStockLine() {
    //     this.toggleAddDetails = !this.toggleAddDetails;
    // }

    // paginatorFocusOut($event, part) {}
}