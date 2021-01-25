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

@Component({
  selector: "app-sales-order-part-actions",
  templateUrl: "./sales-order-part-actions.component.html",
  styleUrls: ["./sales-order-part-actions.component.scss"]
})
export class SalesOrderPartActionsComponent implements OnInit {
  @Input() display: boolean;
  @Input() customer: any;
  @Input() selectedPartDataForAction: PartDetail;
  @Input() selectedPartActionType: any;
  @Input() salesQuote: ISalesQuote;
  @Input() salesOrderId;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPartReserve: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedParts: any = [];
  @Input() employeesList: any = [];
  searchType: ItemSearchType;
  parts: PartAction[] = [];
  showModalMargin: boolean;
  part: PartAction;
  query: ItemMasterSearchQuery;
  salesOrder: ISalesQuote;
  columns: { field: string; header: string; width: string; }[];
  selectAllParts: Boolean = false;
  disableSubmitButtonForAction: boolean = true;
  isSpinnerVisible: boolean = true;

  constructor(private itemMasterService: ItemMasterService, private salesOrderService: SalesOrderService, private commonService: CommonService, private authService: AuthService,
    private alertService: AlertService) {
    this.searchType = ItemSearchType.ItemMaster;
  }

  ngOnInit() {
    this.getParts();
    this.salesOrder = this.salesQuote;
    this.initColumns();
  }

  initColumns() {
    this.columns = [
      { field: "partNumber", header: "PN", width: "100px" },
      { field: "partDescription", header: "PN Description   ", width: "200px" },
      { field: "condition", header: "Condition Type    ", width: "100px" },
      { field: "oemDer", header: "OEM / PMA / DER", width: "100px" },
      { field: "quantity", header: "Qty Required ", width: "100px" },
      { field: "quantityReserved", header: "Qty Reserved", width: "100px" },
      //{ field: "qtyToReserve", header: "Qty To Reserve", width: "100px" },
      ////{ field: "quantityIssued", header: "Qty Issued  ", width: "100px" },
      ////{ field: "qtyToIssued", header: "Qty To Issue", width: "100px" },
      //{ field: "qtyToReserveAndIssue", header: "Qty To Reserve And Issue", width: "100px" },
      //{ field: "qtyToUnReserve", header: "Qty To UnReserve", width: "100px" },
      //{ field: "qtyToUnIssued ", header: "Qty To UnIssue", width: "100px" },
      { field: "quantityOnHand", header: "Qty On Hand", width: "100px" },
      { field: "quantityAvailable", header: "Qty Available   ", width: "100px" },
      { field: "quantityOnOrder", header: "Qty On Order", width: "100px" },
      //{ field: "reservedDate", header: "Reserved Date", width: "150px" },
      //{ field: "reservedById", header: "Reserved By", width: "150px" },
      //{ field: "issuedDate", header: "Issued Date", width: "150px" },
      //{ field: "issuedById", header: "Issued By", width: "150px" }      
    ];
  }

  get userName(): string {
    return this.authService.currentUser ? this.authService.currentUser.userName : "";
  }

  getParts() {
    switch (this.selectedPartActionType) {
      case 'Reserve':
        this.getReserverdParts();
        break;
      case 'Issue':
        this.getIssuedParts();
        break;
      case 'Reserve & Issue':
        this.getReservedAndIssuedParts();
        break;
      case 'Unreserve':
        this.getUnreservedParts();
        break;
      case 'UnIssue':
        this.getUnissuedParts();
        break;
    }
  }

  onChange(event, part) {
    let checked: boolean = event.srcElement.checked;
    this.onPartReserve.emit({ checked: checked, part: part });
  }

  getIssuedParts() {
    this.salesOrderService
      .getIssuedParts(this.salesOrderId)
      .subscribe(data => {
        this.parts = data[0];
        for (let i = 0; i < this.parts.length; i++) {
          this.parts[i].reservedDate = this.parts[i].reservedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
          this.parts[i].issuedDate = this.parts[i].issuedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
          this.parts[i]['isSelected'] = false;
          if (this.parts[i].qtyToIssued == 0) {
            this.parts[i].qtyToIssued = null
          }
        }

        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i].field == 'qtyToReserveAndIssue') {
            this.columns.splice(i, 1);
          }
          if (this.columns[i].field == 'qtyToUnReserve') {
            this.columns.splice(i, 1);
          }
          if (this.columns[i].header == 'Qty To UnIssue') {
            this.columns.splice(i, 1);
          }
        }
      });
  }

  getReserverdParts() {
    this.isSpinnerVisible = true;
    this.salesOrderService
      .getReservedParts(this.salesOrderId)
      .subscribe(data => {
        this.isSpinnerVisible = false;
        this.parts = data[0];
        for (let i = 0; i < this.parts.length; i++) {
          this.parts[i].reservedDate = this.parts[i].reservedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
          this.parts[i].issuedDate = this.parts[i].issuedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
          this.parts[i]['isSelected'] = false;
          // if (this.parts[i].qtyToReserve == 0) {
          //   this.parts[i].qtyToReserve = null
          // }
        }

        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i].field == 'qtyToReserveAndIssue') {
            this.columns.splice(i, 1);
          }
          if (this.columns[i].field == 'qtyToUnReserve') {
            this.columns.splice(i, 1);
          }
          if (this.columns[i].header == 'Qty To UnIssue') {
            this.columns.splice(i, 1);
          }
        }
      }, error => {
        this.isSpinnerVisible = false;
      });
  }

  getReservedAndIssuedParts() {
    this.salesOrderService
      .getReservedAndIssuedParts(this.salesOrderId)
      .subscribe(data => {
        this.parts = data[0];
        for (let i = 0; i < this.parts.length; i++) {
          this.parts[i].reservedDate = this.parts[i].reservedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
          this.parts[i].issuedDate = this.parts[i].issuedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
          this.parts[i]['isSelected'] = false;
          if (this.parts[i].qtyToReserveAndIssue) {
            if (this.parts[i].qtyToReserveAndIssue == 0) {
              this.parts[i].qtyToReserveAndIssue = null
            }
          }
        }
        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i].field == 'qtyToUnReserve') {
            this.columns.splice(i, 1);
          }
          if (this.columns[i].header == 'Qty To UnIssue') {
            this.columns.splice(i, 1);
          }
        }
      });
  }

  getUnreservedParts() {
    this.isSpinnerVisible = true;
    this.salesOrderService
      .getUnreservedParts(this.salesOrderId)
      .subscribe(data => {
        this.isSpinnerVisible = false;
        this.parts = data[0];
        for (let i = 0; i < this.parts.length; i++) {
          this.parts[i].reservedDate = this.parts[i].reservedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
          this.parts[i].issuedDate = this.parts[i].issuedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
          this.parts[i]['isSelected'] = false;
          if (this.parts[i].qtyToUnReserve) {
            if (this.parts[i].qtyToUnReserve == 0) {
              this.parts[i].qtyToUnReserve = null;
            }
          }
        }
        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i].field == 'qtyToReserveAndIssue') {
            this.columns.splice(i, 1);
          }

          if (this.columns[i].header == 'Qty To UnIssue') {
            this.columns.splice(i, 1);
          }
        }
      }, error => {
        this.isSpinnerVisible = false;
      });
  }

  getUnissuedParts() {
    this.salesOrderService
      .getReservedParts(this.salesOrderId)
      .subscribe(data => {
        this.parts = data[0];
        for (let i = 0; i < this.parts.length; i++) {
          this.parts[i].reservedDate = this.parts[i].reservedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
          this.parts[i].issuedDate = this.parts[i].issuedDate == null ? new Date() : new Date(this.parts[i].reservedDate);
          this.parts[i]['isSelected'] = false;
          if (this.parts[i].qtyToUnIssued) {
            if (this.parts[i].qtyToUnIssued == 0) {
              this.parts[i].qtyToUnIssued = null
            }
          }
        }

        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i].field == 'qtyToReserveAndIssue') {
            this.columns.splice(i, 1);
          }
          if (this.columns[i].field == 'qtyToUnReserve') {
            this.columns.splice(i, 1);
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
    this.close.emit(true);
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
      // x.reservedById = x.reservedById.value;
      // x.issuedById = x.issuedById.value;
      if (x.isSelected == true) {
        tempParts.push(x)
      }
    });

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
        this.onClose()
      },
        error => this.saveFailedHelper(error));
  }

  private saveFailedHelper(error: any) {
    this.alertService.stopLoadingMessage();
    // this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);
  }
}
