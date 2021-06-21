import { Component, OnInit, Input } from '@angular/core';
import { ReceivingService } from '../../../../services/receiving/receiving.service';
import { PurchaseOrder, PurchaseOrderPart } from '../receivng-po/PurchaseOrder.model';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';

@Component({
  selector: 'app-po-view-list',
  templateUrl: './po-view-list.component.html',
  styleUrls: ['./po-view-list.component.scss']
})

export class POViewListComponent implements OnInit {
    @Input() purchaseOrderData: PurchaseOrder;
    purchaseOrderDatas: PurchaseOrderPart[] = [];
    isSpinnerVisible: boolean = true;
    toggleIcon: boolean = false;
    toggleAddDetails: boolean = false;   
    currentSLIndex: number = 0;
    currentTLIndex: number = 0;
    currentSERIndex: number = 0;
    pageTitle: string = 'View Purchase Order';
    purchaseOrderPart: any = []; //PurchaseOrderPart[];
    currentStockLineShowIndex: number = 0;
    constructor(private receivingService: ReceivingService,
        private alertService: AlertService) {
    }
   
    ngOnInit() {
        this.getStockDetailsOnLoad();
    }

    getStockDetailsOnLoad() {
        
        this.receivingService.getReceivedPOPartsForView(this.purchaseOrderData.purchaseOrderId).subscribe(
            results => {
                this.purchaseOrderDatas = results.map(x => {
                    return {
                        ...x,
                        unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '',
                        extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '',
                        stockLine: this.getStockLineDetails(x.stockLine),
                        timeLife: this.getTimeLifeDetails(x.timeLife)
                    }
                });               
                
                var allParentParts = this.purchaseOrderDatas.filter(x => x.isParent == true);
                        for (let parent of allParentParts) {
                            var splitParts = this.purchaseOrderDatas.filter(x => !x.isParent && x.parentId == parent.purchaseOrderPartRecordId);
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
                unitCost: x.unitCost.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost.unitCost, 2) : '0.00',
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

    



    // ngOnInit() {       
    //     this.purchaseOrderData.purchaseOderPart.map(x => {
    //         const data = {
    //                  ...x,
    //                  stockLine: this.getStockline(x),
    //                  timeLife: x.timeLifeDraft
    //              }
    //              this.purchaseOrderPart.push(data);
    //          });
    // }

    // getStockline(data) {       
    //     if(data.stockLineDraft){
    //          data.stockLineDraft = data.stockLineDraft.map((x, index) => {               
    //              return {
    //                  ...x,
    //                  purchaseOrderUnitCost: x.purchaseOrderUnitCost ? formatNumberAsGlobalSettingsModule(x.purchaseOrderUnitCost, 2) : '0.00',
    //                  purchaseOrderExtendedCost: x.purchaseOrderExtendedCost ? formatNumberAsGlobalSettingsModule(x.purchaseOrderExtendedCost, 2) : '0.00',
    //                  currentSLIndexDraft: index
    //              }
    //          })
    //          return data.stockLineDraft;
    //      } else {
    //          return [];
    //      }
    // }

    // moveStockLinePage(type: string, index: number, part: PurchaseOrderPart): void {
    //     var count = type == 'stockline' ? part.stockLine.length : part.timeLife.length;
    //     if (index >= 0 && index < count) {
    //         part.currentSLIndex = index;            
    //         part.currentSERIndex = index;
    //         part.currentTLIndex = index;
    //     }
    // }

    // public gotoStockLinePage(event: any, part: PurchaseOrderPart): void {
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

    // toggleExpandIcon(part: PurchaseOrderPart) {
    //     part.showStockLineGrid = !part.showStockLineGrid;         
    // }

    // addStockLine() {
    //     this.toggleAddDetails = !this.toggleAddDetails;
    // }

    // paginatorFocusOut($event, part) {}
}