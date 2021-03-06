﻿import { Component, OnInit, Input } from '@angular/core';
import { ReceivingService } from '../../../../services/receiving/receiving.service';
import { RepairOrder, RepairOrderPart } from '../receiving-ro/RepairOrder.model';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';

@Component({
  selector: 'app-ro-view-draftlist',
  templateUrl: './ro-view-draftlist.component.html',
  styleUrls: ['./ro-view-draftlist.component.scss']
})

export class ROViewStockDraftListComponent implements OnInit {
    @Input() repairOrderData: RepairOrderPart[] = [];
    toggleIcon: boolean = false;
    toggleAddDetails: boolean = false;   
    currentSLIndexDraft: number = 0;
    currentTLIndexDraft: number = 0;
    currentSERIndexDraft: number = 0;
    pageTitle: string = 'View Repair Order';
    repairOrderPart: any = []; //PurchaseOrderPart[];
    currentStockLineShowIndex: number = 0;
    
    constructor(private receivingService: ReceivingService,
        private alertService: AlertService) {
    }
    
    ngOnInit() {             
       this.repairOrderData.map(x => {
        const data = {
                ...x,  
                unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '',
                extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '',                                                                       
                stockLine: this.getStockLineDetails(x.stockLine),
                timeLife: x.timeLife // this.getTimeLifeDetails(x.timeLife)
            }
            this.repairOrderPart.push(data);
        });        
    }

    getStockLineDetails(stockline) {
        stockline = stockline.map((x,index) => {
            return {
                ...x,
                repairOrderUnitCost: x.repairOrderUnitCost ? formatNumberAsGlobalSettingsModule(x.repairOrderUnitCost, 2) : '0.00',
                repairOrderExtendedCost: x.repairOrderExtendedCost ? formatNumberAsGlobalSettingsModule(x.repairOrderExtendedCost, 2) : '0.00',
                currentSLIndexDraft: index
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

    getStockline(data) {
        data.stockLineDraft = data.stockLineDraft.map((x, index) => {
            return {
                ...x,
                purchaseOrderUnitCost: x.purchaseOrderUnitCost ? formatNumberAsGlobalSettingsModule(x.purchaseOrderUnitCost, 2) : '0.00',
                purchaseOrderExtendedCost: x.purchaseOrderExtendedCost ? formatNumberAsGlobalSettingsModule(x.purchaseOrderExtendedCost, 2) : '0.00',
                currentSLIndexDraft: index
            }
        })
        return data.stockLineDraft;
    }

    moveStockLinePage(type: string, index: number, part: RepairOrderPart, stockline): void {
        var count = type == 'stockline' ? part.stockLine.length : part.timeLife.length;
        if (index >= 0 && index < count) {
            // if (part.itemMaster.isSerialized) {
            //     stockline.currentSLIndexDraft = index;
            // }
            // stockline.currentSLIndexDraft = index ;
            this.currentStockLineShowIndex = index;
            console.log(index);            
            console.log(stockline);
            stockline.currentSERIndexDraft = index;
            stockline.currentTLIndexDraft = index ;
            // this.purchaseOrderPart = this.purchaseOrderPart.map(x => {
            //     return {...x}
            // })
        }

    }

    public gotoStockLinePage(event: any, part: RepairOrderPart, stockline): void {
        let value = event.target.value;
        let index: number = 0;
        if (value == '') {
            return;
        }
        index = Number.parseInt(value) - 1;

        if (index < part.stockLine.length && index >= 0) {
            // if (part.itemMaster.isSerialized) {
                // stockline.currentSLIndexDraft = index;
                this.currentStockLineShowIndex = index;
                stockline.currentSERIndexDraft = index;
            // }
            stockline.currentTLIndexDraft = index;
        }
        else {
            this.alertService.showMessage(this.pageTitle, "Invalid stock line page", MessageSeverity.error);
            event.target.value = "1";
            if (!part.isSameDetailsForAllParts) {
                // stockline.currentSLIndexDraft = 0;
                this.currentStockLineShowIndex = index;
                stockline.currentSERIndexDraft = 0;
            }
            stockline.currentTLIndexDraft = 0;
            stockline.currentSERIndexDraft = 0;
            return;
        }
    }

    private onDataLoadFailed(error: any) {
    }

    toggleExpandIcon(part: RepairOrderPart) {
        part.showStockLineGridDraft = !part.showStockLineGridDraft; 
        // part.showStockLineGridDraft = part.showStockLineGridDraft != undefined ? true : !part.showStockLineGridDraft; 
        //this.toggleIcon = !this.toggleIcon;
    }

    addStockLine() {
        this.toggleAddDetails = !this.toggleAddDetails;
    }

    paginatorFocusOut($event, part) {}
}