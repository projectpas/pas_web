import { Component, OnInit } from "@angular/core";
declare var $: any;
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CurrencyService } from "../../../../services/currency.service";
import { EmployeeService } from "../../../../services/employee.service";
import { AuthService } from "../../../../services/auth.service";
import * as moment from 'moment';
import { MenuItem } from "primeng/api";
import { SalesOrderService } from "../../../../services/salesorder.service";
import { listSearchFilterObjectCreation } from "../../../../generic/autocomplete";
import { SalesOrderpickTicketComponent } from "../sales-order-pickTicket/sales-order-pickTicket.component";
import { SOPickTicket } from "../../../../models/sales/SOPickTicket";
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { DatePipe } from "@angular/common";
import { StocklineViewComponent } from "../../../../shared/components/stockline/stockline-view/stockline-view.component";

@Component({
  selector: "app-sales-order-pick-tickets",
  templateUrl: "./sales-order-pick-tickets.component.html",
  styleUrls: ["./sales-order-pick-tickets.component.css"]
})
export class SalesOrderPickTicketsComponent implements OnInit {
  isEdit: boolean = false;
  isEnablePOList: any;
  pickTickes: any[] = [];
  tempSales: any[] = [];
  pnViewSelected = false;
  selected: any;
  modal: NgbModalRef;
  partModal: NgbModalRef;
  headers: any[];
  columns: any[];
  selectedColumns: any[];
  selectedColumn: any[];
  totalRecords: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  first = 0;
  showPaginator: boolean = false;
  isSpinnerVisible: boolean = true;
  partColumns: any[];
  customerDetails: any;
  selectedParts: any[] = [];
  customerId: any;
  statusList: any = [];
  lazyLoadEventData: any;
  currentStatus: any = "0";
  viewType: any = 'detailedview';
  breadcrumbs: MenuItem[];
  home: any;
  salesOrderId: any;
  searchParameters: any;
  PickTicketDetails = new SOPickTicket();
  disableSave: boolean = true;
  pickticketauditHistory: any[] = [];
  pickTicketItemInterfaceheader: any[];
  disableSubmitButton: boolean = true;

  constructor(
    private salesOrderService: SalesOrderService,
    public employeeService: EmployeeService,
    public currencyService: CurrencyService,
    private authService: AuthService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.isSpinnerVisible = true;
    this.initColumns();
    this.isSpinnerVisible = false;
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  get userId() {
    return this.authService.currentUser ? this.authService.currentUser.id : 0;
  }

  get masterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : 1;
  }

  initColumns() {
    this.headers = [
      { field: "partNumber", header: "PN Num", width: "130px" },
      { field: "partDescription", header: "PN Description", width: "130px" },
      { field: "serialNumber", header: "Serial Num", width: "130px" },
      { field: "qty", header: "Qty Ord", width: "130px" },
      { field: "qtyToShip", header: "Qty Picked", width: "130px" },
      { field: "qtyToPick", header: "Qty To Pick", width: "130px" },
      { field: "quantityAvailable", header: "Qty Avail", width: "130px" },
      { field: "qtyToPick", header: "Ready To Pick", width: "130px" },
      { field: "status", header: "Status", width: "130px" },
      { field: "salesOrderNumber", header: "SO Num", width: "130px" },
      { field: "salesOrderQuoteNumber", header: "SOQ Num", width: "130px" },
      { field: "customerName", header: "Customer Name", width: "130px" },
      { field: "customerCode", header: "Customer Code", width: "130px" },
    ];
    this.selectedColumns = this.headers;

    this.pickTicketItemInterfaceheader = [
      { field: "partNumber", header: "PN", width: "100px" },
      { field: "stockLineNumber", header: "Stk Line Num", width: "200px" },
      { field: "qtyOnHand", header: "Qty On Hand", width: "50px" },
      { field: "qtyAvailable", header: "Qty Avail", width: "80px" },
      { field: "qtyToShip", header: "Qty To Pick", width: "100px" },
      { field: "serialNumber", header: "Serial Num", width: "100px" },
      { field: "stkLineManufacturer", header: "Manufacturer", width: "100px" },
      { field: "stockType", header: "Stock Type", width: "100px" },
      { field: "tracableToName", header: "Tracable To", width: "100px" },
    ];
  }

  refresh(id) {
    this.salesOrderId = id;
    this.onSearch();
  }

  loadData(event, globalFilter = "") {
    event.filters.statusId = this.currentStatus;
    this.searchParameters.first = parseInt(event.first) / event.rows;
    this.searchParameters.rows = event.rows;
    this.searchParameters.sortOrder = event.sortOrder;
    this.searchParameters.sortField = event.sortField;
    this.lazyLoadEventData = event;

    this.searchParameters.filters = listSearchFilterObjectCreation(
      event.filters
    );
    this.searchParameters.filters = {
      ...this.searchParameters.filters,
      viewType: this.viewType
    }

    this.searchParameters.globalFilter = globalFilter;
  }

  onSearch() {
    this.isSpinnerVisible = true;
    this.salesOrderService
      .getPickTicketList(this.salesOrderId)
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.pickTickes = response[0];
        this.showPaginator = this.totalRecords > 0;
      }, error => {
        this.isSpinnerVisible = false;
      });
  }

  dismissModel() {
    this.modal.close();
  }

  dismissViewModel() {
    this.modal.close();
  }

  dismissPartViewModel() {
    this.partModal.close();
  }

  convertDate(key, data) {
    if ((key === 'quoteDate' || key === 'updatedDate' || key === 'createdDate' || key === 'soPickTicketDate') && data[key]) {
      return moment(data[key]).format('MM/DD/YYYY');
    } else {
      return data[key];
    }
  }

  printPickTicket(rowData: any) {
    this.modal = this.modalService.open(SalesOrderpickTicketComponent, { size: "lg" });
    let instance: SalesOrderpickTicketComponent = (<SalesOrderpickTicketComponent>this.modal.componentInstance)
    instance.modalReference = this.modal;

    instance.onConfirm.subscribe($event => {
      if (this.modal) {
        this.modal.close();
      }
    });
    instance.salesOrderId = rowData.salesOrderId;
    instance.salesOrderPartId = rowData.salesOrderPartId;
    instance.soPickTicketId = rowData.soPickTicketId;
  }

  QtyRem: Number = 0;
  openEdit(rowData) {
    this.QtyRem = rowData.qtyRemaining;
    this.PickTicketDetails = rowData;
  }

  disabledMemo: boolean = false;

  closeMyModel(type) {
    $(type).modal("hide");
  }

  get employeeId() {
    return this.authService.currentUser
      ? this.authService.currentUser.employeeId
      : "";
  }

  enableSave() {
    this.disableSave = false;
  }

  getpickticketHistory(rowData) {
    this.isSpinnerVisible = true;
    this.salesOrderService.getpickticketHistory(rowData.soPickTicketId).subscribe(res => {
      this.pickticketauditHistory = res.map(x => {
        return {
          ...x,
          createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy h:mm a') : '',
          updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy h:mm a') : '',
        }
      });
      this.isSpinnerVisible = false;
    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  getColorCodeForHistory(i, field, value) {
    const data = this.pickticketauditHistory;
    const dataLength = data.length;
    if (i >= 0 && i <= dataLength) {
      if ((i + 1) === dataLength) {
        return true;
      } else {
        return data[i + 1][field] === value
      }
    }
  }

  closepickticketHistoryModal() {
    $("#pickticketHistory").modal("hide");
  }

  checkQtyToPicked(value) {
    if (value > this.QtyRem) {
    }
  }

  parts: any[] = [];
  qtyToPick: number = 0;
  pickticketItemInterface(rowData, pickticketieminterface) {
    this.isEdit=false;
    const itemMasterId = rowData.itemMasterId;
    const conditionId = rowData.conditionId;
    const salesOrderId = rowData.salesOrderId;
    const salesOrderPartId = rowData.salesOrderPartId;
    this.qtyToPick = rowData.qtyToPick;
    this.modal = this.modalService.open(pickticketieminterface, { size: "lg", backdrop: 'static', keyboard: false });
    this.salesOrderService
      .getStockLineforPickTicket(itemMasterId, conditionId, salesOrderId)
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.parts = response[0];
        for (let i = 0; i < this.parts.length; i++) {
          if (this.parts[i].oemDer == null)
            this.parts[i].oemDer = this.parts[i].stockType;
          this.parts[i]['isSelected'] = false;
          this.parts[i]['salesOrderId'] = salesOrderId;
          this.parts[i]['salesOrderPartId'] = salesOrderPartId;
          this.parts[i].qtyToShip = this.qtyToPick;
          if (this.parts[i].qtyToReserve == 0) {
            this.parts[i].qtyToReserve = null
          }
        }
      }, error => {
        this.isSpinnerVisible = false;
      });
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
      this.disableSubmitButton = true;
    } else {
      this.disableSubmitButton = false;
    }
  }

  savepickticketiteminterface(parts) {
    let tempParts = [];
    let invalidQty = false;
    parts.filter(x => {
      x.createdBy = this.userName;
      x.updatedBy = this.userName;
      x.pickedById = this.employeeId;
      x.masterCompanyId = this.masterCompanyId;
      if (x.isSelected == true) {
        tempParts.push(x)
      }
    })
    parts = [];
    parts = tempParts;
    for (let i = 0; i < parts.length; i++) {
      let selectedItem = parts[i];
      var errmessage = '';
      if (selectedItem.qtyToShip > this.qtyToPick) {
        this.isSpinnerVisible = false;
        invalidQty = true;
        errmessage = errmessage + '<br />' + "You cannot pick more than Qty To Pick"
      }
    }
    if (invalidQty) {
      this.isSpinnerVisible = false;
      this.alertService.resetStickyMessage();
      this.alertService.showStickyMessage('Sales Order', errmessage, MessageSeverity.error);
    }
    else {
      this.disableSubmitButton = true;
      this.salesOrderService
        .savepickticketiteminterface(parts)
        .subscribe(data => {
          this.isEdit=false;
          this.alertService.stopLoadingMessage();
          this.alertService.showMessage(
            "Success",
            `Item Picked Successfully..`,
            MessageSeverity.success
          );
          this.dismissModel();
          this.onSearch();
        }, error => this.isSpinnerVisible = false);
    }
  }

  confirmselected: number;
  ptNumber: number;
  confirmedById: any;
  ConfirmPTpopup(confirm, part) {
    this.confirmselected = part.soPickTicketId;
    this.ptNumber = part.soPickTicketNumber;
    this.modal = this.modalService.open(confirm, { size: "sm", backdrop: 'static', keyboard: false });
  }

  confirmPickTicket(): void {
    this.isSpinnerVisible = true;
    this.confirmedById = this.employeeId;
    this.salesOrderService.confirmPickTicket(this.confirmselected, this.confirmedById).subscribe(response => {
      this.isSpinnerVisible = false;
      this.modal.close();
      this.alertService.showMessage(
        "Success",
        `Pick Ticket confirmed successfully.`,
        MessageSeverity.success
      );
      this.onSearch();
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  viewStockSelectedRow(rowData) {
    this.modal = this.modalService.open(StocklineViewComponent, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
    this.modal.componentInstance.stockLineId = rowData.stockLineId;
  }
  
  pickticketItemInterfaceedit(rowData, pickticketieminterface) {
    this.isEdit = true;
    const soPickTicketId = rowData.soPickTicketId;
    const salesOrderId = rowData.salesOrderId;
    const salesOrderPartId = rowData.salesOrderPartId;
    this.modal = this.modalService.open(pickticketieminterface, { size: "lg", backdrop: 'static', keyboard: false });
    this.salesOrderService
      .getPickTicketEdit(soPickTicketId, salesOrderId, salesOrderPartId)
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.parts = response;
        for (let i = 0; i < this.parts.length; i++) {
          if (this.parts[i].oemDer == null)
            this.parts[i].oemDer = this.parts[i].stockType;

          this.parts[i]['isSelected'] = false;
          this.parts[i]['soPickTicketId'] = soPickTicketId;
          this.qtyToPick = this.parts[i].qtyToPick;
          if (this.parts[i].qtyToReserve == 0) {
            this.parts[i].qtyToReserve = null
          }
        }
      }, error => {
        this.isSpinnerVisible = false;
      });
  }
}