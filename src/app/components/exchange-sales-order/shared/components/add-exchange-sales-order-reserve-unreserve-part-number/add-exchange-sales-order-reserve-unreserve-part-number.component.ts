import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemSearchType } from "../../../../exchange-sales-order/models/item-search-type";
import { PartDetail } from "../../models/part-detail";
import { IPartJson } from "../../models/ipart-json";
import { IExchangeQuote } from "../../../../../models/exchange/IExchangeQuote.model";
import { ItemMasterSearchQuery } from "../../../../exchange-sales-order/models/item-master-search-query";
import { ExchangeSalesOrderService } from "../../../../../services/exchangesalesorder.service";
import { PartAction } from "../../models/part-action";
import { AlertService, MessageSeverity } from "../../../../../services/alert.service";
import { AuthService } from "../../../../../services/auth.service";
import { getObjectById } from "../../../../../generic/autocomplete";
declare var $: any;
@Component({
  selector: 'app-add-exchange-sales-order-reserve-unreserve-part-number',
  templateUrl: './add-exchange-sales-order-reserve-unreserve-part-number.component.html',
  styleUrls: ['./add-exchange-sales-order-reserve-unreserve-part-number.component.scss']
})
export class AddExchangeSalesOrderReserveUnreservePartNumberComponent implements OnInit {
  @Input() display: boolean;
  @Input() customer: any;
  @Input() selectedPartDataForAction: PartDetail;
  @Input() selectedPartActionType: any;
  @Input() salesQuote: IExchangeQuote;
  @Input() salesOrderId;
  @Input() selectedPart: IPartJson;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPartReserve: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedParts: any = [];
  @Input() part: PartDetail;
  @Input() employeesList: any = [];
  employees: any = [];
  searchType: ItemSearchType;
  parts: PartAction[] = [];
  showModalMargin: boolean;
  //part: PartAction;
  query: ItemMasterSearchQuery;
  salesOrder: IExchangeQuote;
  columns: { field: string; header: string; width: string; }[];
  selectAllParts: Boolean = false;
  disableSubmitButtonForAction: boolean = true;
  isSpinnerVisible: boolean = true;
  onlyParts: PartAction[] = [];
  altParts: PartAction[] = [];
  euqParts: PartAction[] = [];
  constructor(private exchangeSalesOrderService: ExchangeSalesOrderService, private authService: AuthService,
    private alertService: AlertService) {
      this.searchType = ItemSearchType.ItemMaster; }

  ngOnInit() {
    this.employees = this.employeesList;
        this.getParts();
        this.salesOrder = this.salesQuote;
        this.initColumns();
  }

  get employeeId() {
    return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
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
            { field: "quantity", header: "Qty Required ", width: "60px" },
            { field: "quantityReserved", header: "Qty Reserved", width: "60px" },
            { field: "qtyToBeReserved", header: "Qty To Be Reserved", width: "60px" },
            { field: "qtyToReserve", header: "Qty Actually Reserving", width: "80px" },
            //{ field: "qtyToUnReserve", header: "Qty To UnReserve", width: "100px" },
            { field: "quantityOnHand", header: "Qty On Hand", width: "60px" },
            { field: "quantityAvailable", header: "Qty Available   ", width: "60px" },
            { field: "quantityOnOrder", header: "Qty On Order", width: "60px" },
            { field: "reservedDate", header: "Reserved Date", width: "150px" },
            { field: "reservedById", header: "Reserved By", width: "150px" }
        ];
    }
    else {
        this.columns = [
            { field: "partNumber", header: "PN", width: "100px" },
            { field: "partDescription", header: "PN Description   ", width: "200px" },
            { field: "stockLineNumber", header: "Stk Line Num   ", width: "100px" },
            { field: "controlNumber", header: "Cntr Num   ", width: "80px" },
            { field: "condition", header: "Condition Type    ", width: "100px" },
            { field: "oemDer", header: "OEM / PMA / DER", width: "100px" },
            { field: "quantity", header: "Qty Required ", width: "60px" },
            { field: "quantityReserved", header: "Qty Reserved", width: "60px" },
            //{ field: "qtyToReserve", header: "Qty To Reserve", width: "100px" },
            { field: "qtyToUnReserve", header: "Qty To UnReserve", width: "80px" },
            { field: "quantityOnHand", header: "Qty On Hand", width: "60px" },
            { field: "quantityAvailable", header: "Qty Available   ", width: "60px" },
            { field: "quantityOnOrder", header: "Qty On Order", width: "60px" },
            { field: "reservedDate", header: "UnReserved Date", width: "150px" },
            { field: "reservedById", header: "UnReserved By", width: "150px" }
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
    this.isSpinnerVisible = true;
    this.exchangeSalesOrderService.getReservestockpartlistsBySOId(this.salesOrderId)
        .subscribe(data => {
            this.isSpinnerVisible = false;
            this.parts = data[0];
            this.onlyParts = data[0];

            this.bindProperValues();

            this.parts.forEach((item, index) => {
                if (item !== undefined) {
                    if (item.soReservedAltParts && item.soReservedAltParts.length > 0) {
                        item.soReservedAltParts.forEach((altPart, i) => {
                            this.altParts.push(altPart);
                        });
                    }
                    if (item.soReservedEquParts && item.soReservedEquParts.length > 0) {
                        item.soReservedEquParts.forEach((EquPart, i) => {
                            this.euqParts.push(EquPart);
                        });
                    }
                }
            });
        }, error => {
            this.isSpinnerVisible = false;
        });
}

getUnreservedParts() {
    this.isSpinnerVisible = true;
    this.exchangeSalesOrderService.getunreservedstockpartslistBySOId
        (this.salesOrderId)
        .subscribe(data => {
            this.isSpinnerVisible = false;
            this.parts = data[0];
            for (let i = 0; i < this.parts.length; i++) {

                if (this.parts[i].oemDer == null)
                    this.parts[i].oemDer = this.parts[i].stockType;

                this.parts[i].reservedDate = this.parts[i].reservedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
                this.parts[i]['isSelected'] = false;
                if (this.parts[i].qtyToUnReserve) {
                    if (this.parts[i].qtyToUnReserve == 0) {
                        this.parts[i].qtyToUnReserve = null
                    }
                }

                this.parts[i].reservedById = getObjectById('value', this.employeeId, this.employees);
            }
        }, error => {
            this.isSpinnerVisible = false;
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
    //this.releaseStock();
}

releaseStock() {
    this.exchangeSalesOrderService.releasestocklinereservedparts(this.part.exchangeSalesOrderId).subscribe((res: any[]) => {
    });
}

filterReservedBy(event) {
    const employeeListData = [
        ...this.employees.filter(x => {
            if (x.label.toLowerCase().includes(event.query.toLowerCase())) {
                return x.label;
            }
        })
    ];
    this.employees = employeeListData;
}

savereserveissuesparts(parts) {
    let invalidQty = false;
    for (let i = 0; i < parts.length; i++) {
        let selectedItem = parts[i];
        var errmessage = '';
        if (this.selectedPartActionType == "Reserve" && selectedItem.qtyToReserve > selectedItem.quantityAvailable) {
            this.isSpinnerVisible = false;
            invalidQty = true;
            errmessage = errmessage + '<br />' + "You cannot reserve more than available QTY"
        }
    }
    if (invalidQty) {
        this.isSpinnerVisible = false;
        this.alertService.resetStickyMessage();
        this.alertService.showStickyMessage('Exchange Sales Order', errmessage, MessageSeverity.error);
    }
    else {
        this.disableSubmitButtonForAction = true;
        let tempParts = [];
        parts.filter(x => {
            x.createdBy = this.userName;
            x.updatedBy = this.userName;

            if (x.reservedById != null)
                x.reservedById = x.reservedById.value;

            if (x.isSelected == true) {
                tempParts.push(x);
            }

            if (x.soReservedAltParts) {
                x.soReservedAltParts.filter(x => {
                    x.createdBy = this.userName;
                    x.updatedBy = this.userName;
                });
            }

            if (x.soReservedEquParts) {
                x.soReservedEquParts.filter(x => {
                    x.createdBy = this.userName;
                    x.updatedBy = this.userName;
                });
            }
        });
        parts = [];
        parts = [...tempParts];

        this.isSpinnerVisible = true;
        this.exchangeSalesOrderService
            .savereserveissuesparts(parts)
            .subscribe(data => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(
                    "Success",
                    `Part ` + this.selectedPartActionType + `d successfully.`,
                    MessageSeverity.success
                );
                this.close.emit(true);
            }, err => {
                this.isSpinnerVisible = false;
            });
    }
}

interval: any;
minutes: any;
seconds: any;
setTimer() {
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
            clearInterval(this.interval);
        }

        this.seconds = (this.seconds < 0) ? 59 : this.seconds;
        this.seconds = (this.seconds < 10) ? '0' + this.seconds : this.seconds;
        $('.clockdiv').html('Session Expire in' + ' ' + this.minutes + ':' + this.seconds);
        timer2 = this.minutes + ':' + this.seconds;
        if (this.minutes == 0 && this.seconds == 0) {
            this.minutes = '00';
            this.seconds = '00';
            timer2 == "10:01";
            clearInterval(this.interval)
            $('#reserve').modal("hide");
        }
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

showAlternateParts(event) {
    if (event == true) {
        this.parts = [...this.onlyParts, ...this.altParts]
    } else {
        this.parts = [...this.onlyParts];
    }
    this.bindProperValues();
}

showEqualientParts(event) {
    if (event == true) {
        this.parts = [...this.onlyParts, ...this.euqParts]
    } else {
        this.parts = [...this.onlyParts];
    }
    this.bindProperValues();
}

bindProperValues() {
    for (let i = 0; i < this.parts.length; i++) {

        if (this.parts[i].oemDer == null)
            this.parts[i].oemDer = this.parts[i].stockType;

        this.parts[i].reservedDate = this.parts[i].reservedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
        this.parts[i].issuedDate = this.parts[i].issuedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
        this.parts[i]['isSelected'] = false;

        if (this.parts[i].qtyToReserve == 0) {
            this.parts[i].qtyToReserve = null
        }

        this.parts[i].reservedById = getObjectById('value', this.employeeId, this.employees);
    }
}

validatePartsQuantity(event, data) {
    if (this.selectedPartActionType == 'Reserve') {
        if (data.qtyToReserve > data.quantityAvailable) {

            this.alertService.showMessage(
                '',
                ' Qty Actually Reserving Cant be greater than Qty Available',
                MessageSeverity.warn
            );
            data.qtyToReserve = null;
        } else if (data.qtyToReserve > data.qtyToBeReserved) {
            this.alertService.showMessage(
                '',
                ' Qty Actually Reserving Cant be greater than Qty To Be Reserved',
                MessageSeverity.warn
            );
            data.qtyToReserve = null;
        }
    } else {
        if (data.qtyToUnReserve > data.quantityReserved) {
            this.alertService.showMessage(
                '',
                'Qty Unreserving Cant be greater than Qty Reserved',
                MessageSeverity.warn
            );
            data.qtyToUnReserve = null;
        }
    }
}

}
