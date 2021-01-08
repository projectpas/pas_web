import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { ItemMasterService } from "../../../../../services/itemMaster.service";
import { ItemSearchType } from "../../../quotes/models/item-search-type";
import { PartDetail } from "../../models/part-detail";
import { IPartJson } from "../../models/ipart-json";
import { ISalesQuote } from "../../../../../models/sales/ISalesQuote.model";
import { SalesQuoteService } from "../../../../../services/salesquote.service";
import { ItemMasterSearchQuery } from "../../../quotes/models/item-master-search-query";
import { SalesOrderService } from "../../../../../services/salesorder.service";
import { SalesOrder } from "../../../../../models/sales/SalesOrder.model";
import { ISalesOrder } from "../../../../../models/sales/ISalesOrder.model";
import { PartAction } from "../../models/part-action";
import { CommonService } from "../../../../../services/common.service";
import { DBkeys } from "../../../../../services/db-Keys";
import { AlertService, MessageSeverity } from "../../../../../services/alert.service";
import { AuthService } from "../../../../../services/auth.service";
import { Column } from "primeng/components/common/shared";
import * as $ from 'jquery'

@Component({
    selector: "add-reserve-unreserve-part-number",
    templateUrl: "./add-reserve-unreserve-part-number.html",
    styleUrls: ["./add-reserve-unreserve-part-number.css"]
})
export class SalesReserveUnreserveComponent implements OnInit {
    @Input() display: boolean;
    @Input() customer: any;
    @Input() selectedPartDataForAction: PartDetail;
    @Input() selectedPartActionType: any;
    @Input() salesQuote: ISalesQuote;
    @Input() salesOrderId;
    @Input() selectedPart: IPartJson;

    @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() select: EventEmitter<any> = new EventEmitter<any>();
    @Output() onPartReserve: EventEmitter<any> = new EventEmitter<any>();
    @Input() selectedParts: any = [];
    @Input() part: PartDetail;
    @Input() employeesList: any = [];
    searchType: ItemSearchType;
    parts: PartAction[] = [];
    showModalMargin: boolean;
    //part: PartAction;
    query: ItemMasterSearchQuery;
    salesOrder: ISalesQuote;
    columns: { field: string; header: string; width: string; }[];
    selectAllParts: Boolean = false;
    disableSubmitButtonForAction: boolean = true;
    constructor(private itemMasterService: ItemMasterService, private salesOrderService: SalesOrderService, private commonService: CommonService, private authService: AuthService,
        private alertService: AlertService) {
        console.log("add...");
        this.searchType = ItemSearchType.ItemMaster;
    }

    ngOnInit() {
        this.getParts();
        this.salesOrder = this.salesQuote;
        this.initColumns();
        console.log(this.selectedPartDataForAction);
    }

       initColumns() {
        if (this.selectedPartActionType != "Unreserve") {


            this.columns = [
                { field: "partNumber", header: "PN", width: "100px" },
                { field: "partDescription", header: "PN Description   ", width: "200px" },
                { field: "stockLineNumber", header: "Stk Line Num   ", width: "100px" },
                { field: "controlNumber", header: "Cntr Num   ", width: "80px" },
                { field: "condition", header: "Condition Type    ", width: "100px" },
                { field: "oemDer", header: "OEM / PMA / DER", width: "100px" },
                { field: "quantity", header: "Qty Required ", width: "100px" },
                { field: "quantityReserved", header: "Qty Reserved", width: "100px" },
                { field: "qtyToReserve", header: "Qty To Reserve", width: "100px" },


                { field: "qtyToUnReserve", header: "Qty To UnReserve", width: "100px" },

                { field: "quantityOnHand", header: "Qty On Hand", width: "100px" },
                { field: "quantityAvailable", header: "Qty Available   ", width: "100px" },
                { field: "quantityOnOrder", header: "Qty On Order", width: "100px" },

                { field: "reservedDate", header: "Reserved Date", width: "150px" },
                { field: "reservedById", header: "Reserved By", width: "150px" },

            ];
        }
        else {
            this.columns = [
                { field: "partNumber", header: "PN", width: "100px" },
                { field: "partDescription", header: "PN Description   ", width: "200px" },
                { field: "stockLineNumber", header: "Stk Line Num   ", width: "100px" },
                { field: "controlNumber", header: "Cntr Num   ", width: "800px" },
                { field: "condition", header: "Condition Type    ", width: "100px" },
                { field: "oemDer", header: "OEM / PMA / DER", width: "100px" },
                { field: "quantity", header: "Qty Required ", width: "100px" },
                { field: "quantityReserved", header: "Qty Reserved", width: "100px" },
                { field: "qtyToReserve", header: "Qty To Reserve", width: "100px" },


                { field: "qtyToUnReserve", header: "Qty To UnReserve", width: "100px" },

                { field: "quantityOnHand", header: "Qty On Hand", width: "100px" },
                { field: "quantityAvailable", header: "Qty Available   ", width: "100px" },
                { field: "quantityOnOrder", header: "Qty On Order", width: "100px" },
                { field: "reservedDate", header: "UnReserved Date", width: "150px" },
                { field: "reservedById", header: "UnReserved By", width: "150px" },

            ];
        }
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    getParts() {
        switch (this.selectedPartActionType) {
            case 'Reserve':
                this.getReserverdParts();
                break;
       
            case 'Unreserve':
                this.getUnreservedParts();
                break;
         

        }

    }

    onChange(event, part) {
        let checked: boolean = event.srcElement.checked;
        this.onPartReserve.emit({ checked: checked, part: part });
    }

   

    getReserverdParts() {
        this.startTimer();
        this.salesOrderService.getReservestockpartlists
            (this.part.salesOrderId, this.part.itemMasterId)
            .subscribe(data => {
                this.parts = data[0];
                for (let i = 0; i < this.parts.length; i++) {
                    console.log(this.parts[i].oemDer);
                    if (this.parts[i].oemDer == null)
                        this.parts[i].oemDer = this.parts[i].stockType;

                    this.parts[i].reservedDate = this.parts[i].reservedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
                    this.parts[i].issuedDate = this.parts[i].issuedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
                    this.parts[i]['isSelected'] = false;
                    // if(this.parts[i].qtyToReserve){
                    if (this.parts[i].qtyToReserve == 0) {
                        this.parts[i].qtyToReserve = null
                    }
                    // }
                }
               
            });

    }
   

    getUnreservedParts() {
        this.salesOrderService.getunreservedstockpartslist
            (this.part.salesOrderId, this.part.itemMasterId)
            .subscribe(data => {
                this.parts = data[0];
                for (let i = 0; i < this.parts.length; i++) {
                    console.log(this.parts[i].oemDer);
                    if (this.parts[i].oemDer == null)
                        this.parts[i].oemDer = this.parts[i].stockType;

                    this.parts[i].reservedDate = this.parts[i].reservedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
                    this.parts[i]['isSelected'] = false;
                    if (this.parts[i].qtyToUnReserve) {
                        if (this.parts[i].qtyToUnReserve == 0) {
                            this.parts[i].qtyToUnReserve = null
                        }
                    }
                }
             
            });

    }
   
    onChangeOfSelectAllQuotes(event) {
        for (let i = 0; i < this.parts.length; i++) {
            if (event == true) {
                this.parts[i]['isSelected'] = true;
                this.disableSubmitButtonForAction = false;

            } else {
                this.parts[i]['isSelected'] = false;
                this.disableSubmitButtonForAction = true;

            }
        }
    }
    onChangeOfPartSelection(event) {
        this.salesOrderService.getholdstocklinereservedparts(this.part.salesOrderId, this.part.salesOrderPartId,this.part.stockLineId,this.part.quantityRequested)
           .subscribe(data => {
                this.parts = data[0];
            });

        let selectedPartsLength = 0;
        for (let i = 0; i < this.parts.length; i++) {
            if (event == true) {
                selectedPartsLength = selectedPartsLength + 1;
            }
            else {
                if (selectedPartsLength != 0) {
                    selectedPartsLength = selectedPartsLength - 1;
                }
            }
        }
        if (selectedPartsLength == 0) {
            this.disableSubmitButtonForAction = true;
        } else {
            this.disableSubmitButtonForAction = false;
        }
    }


    show(value: boolean): void {
        this.display = value;
    }

    onClose() { 
        event.preventDefault();
        this.close.emit(true);
        clearInterval(this.interval);
        this.minutes = '00';
        this.seconds = '00';
        this.releaseStock();
    }
  
releaseStock(){
    
    this.salesOrderService.releasestocklinereservedparts(this.part.salesOrderId).subscribe((res: any[]) => {

    });
}
    filterReservedBy(event) {
        // this.firstCollection = this.employeesList;

        const employeeListData = [
            ...this.employeesList.filter(x => {
                if (x.name.toLowerCase().includes(event.query.toLowerCase())) {
                    return x.name;
                }

            })
        ];
        this.employeesList = employeeListData;


    }

    savereserveissuesparts(parts) {
        let tempParts = [];
        parts.filter(x => {
            x.createdBy = this.userName;
            x.updatedBy = this.userName;
          
            if (x.reservedById!=null)
                x.reservedById = x.reservedById.employeeId;

            if (x.isSelected == true) {
                tempParts.push(x)
                
            }
        })
        parts = [];
        parts = tempParts;

        this.salesOrderService
            .savereserveissuesparts(parts)
            .subscribe(data => {
                this.alertService.stopLoadingMessage();
                this.alertService.showMessage(
                    "Success",
                    `Part updated.`,
                    MessageSeverity.success
                );
                // this.partActionModalClose.emit(true)
               
            },
                error => this.saveFailedHelper(error));

    }

    private saveFailedHelper(error: any) {
        this.alertService.stopLoadingMessage();
        // this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    interval: any;
    minutes: any;
    seconds: any;
    setTimer() {
        var minutes;
        this.seconds;
        var timer2 = "1:01";
        this.interval = setInterval(function () {
            var timer = timer2.split(':');
            //by parsing integer, I avoid all extra string processing
            this.minutes = parseInt(timer[0], 10);
            this.seconds = parseInt(timer[1], 10);
            --this.seconds;
            this.minutes = (this.seconds < 0) ? --this.minutes : this.minutes;
            if (this.minutes < 0) {
                // this.minutes='00';
                // this.seconds='00';
                // timer2== "10:01";
                clearInterval(this.interval);
                // this.closeMaterial(); 
                // $('#reserve').modal("hide");
            }
            this.seconds = (this.seconds < 0) ? 59 : this.seconds;
            this.seconds = (this.seconds < 10) ? '0' + this.seconds : this.seconds;
            //   this.minutes = (this.minutes < 10) ?  this.minutes : this.minutes;
            $('.clockdiv').html('Session Expire in' + ' ' + this.minutes + ':' + this.seconds);
            timer2 = this.minutes + ':' + this.seconds;
            if (this.minutes == 0 && this.seconds == 0) {
                this.minutes = '00';
                this.seconds = '00';
                timer2 == "10:01";
                clearInterval(this.interval)
                $('#reserve').modal("hide");
            }
            // timer2== "1:01";
        }, 1000);
    }


    counter: { min: number, sec: number }

    startTimer() {
        this.counter = { min: 10, sec: 1 } // choose whatever you want
        let intervalId = setInterval(() => {
            if (this.counter.sec - 1 == -1) {
                this.counter.min -= 1;
                this.counter.sec = 59
            }
            else this.counter.sec -= 1
            //   if(this.counter.min >10)
            //   this.counter.min = (this.counter.min < 10) ? '0' + this.counter.min : this.counter.min;
            if (this.counter.min == 0 && this.counter.sec == 0) {
                clearInterval(intervalId)
                $('#reserve').modal("hide");
            }
            else if (this.counter.min < 0) {
                clearInterval(intervalId)
                $('#reserve').modal("hide");
            }
        }, 1200)
    }
  
}
