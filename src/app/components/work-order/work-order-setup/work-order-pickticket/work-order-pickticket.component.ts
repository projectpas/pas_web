import { CommonService } from '../../../../services/common.service';
import { SalesOrderService } from '../../../../services/salesorder.service';
import { Component, OnInit,Input,ViewEncapsulation } from '@angular/core';
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MenuItem } from "primeng/api";
import { PickTicket } from "../../../../models/PickTicket";
import { CurrencyService } from "../../../../services/currency.service";
import { EmployeeService } from "../../../../services/employee.service";
import { AuthService } from "../../../../services/auth.service";
import * as moment from 'moment';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { DatePipe } from "@angular/common";
import { WorkOrderPickticketprintComponent } from "../work-order-pickticketprint/work-order-pickticketprint.component";
declare var $: any;
import { listSearchFilterObjectCreation } from "../../../../generic/autocomplete";
import {AppModuleEnum} from "../../../../enum/appmodule.enum";

@Component({
  selector: 'app-work-order-pickticket',
  templateUrl: './work-order-pickticket.component.html',
  styleUrls: ['./work-order-pickticket.component.scss'],
 // encapsulation: ViewEncapsulation.None
})
export class WorkOrderPickticketComponent implements OnInit {
  //@Input() moduleId;
  @Input() referenceId;
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
  moduleId : number =15;
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
  isEdit : boolean = false;
  isView : boolean = false;
  //salesOrderId: any;
  searchParameters: any;
  PickTicketDetails = new PickTicket(); 
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
    private datePipe: DatePipe,
    private commonService:CommonService
  ) { }

  ngOnInit() 
  {
    //this.isSpinnerVisible = true;
    this.initColumns();
    this.referenceId = 64;
    this.moduleId=15;
    this.onSearch();
    //this.isSpinnerVisible = false;
  }
  attachmoduleList: any = [];
  arrayCustlist: any = [];

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
      { field: "orderNumber", header: "SO Num", width: "130px" },
      { field: "orderQuoteNumber", header: "SOQ Num", width: "130px" },
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
    // this.referenceId = id;
    // this.moduleId=11;
    this.onSearch();
  }
  onSearch() {
    //this.isSpinnerVisible = true;
    this.commonService
      .getPickTicketList(this.referenceId,this.moduleId)
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        //this.pickTickes = response[0];
        this.pickTickes = response;
        this.showPaginator = this.totalRecords > 0;
      }, error => {
        this.isSpinnerVisible = false;
      });
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
    this.modal = this.modalService.open(WorkOrderPickticketprintComponent, { size: "lg" });
    let instance: WorkOrderPickticketprintComponent = (<WorkOrderPickticketprintComponent>this.modal.componentInstance)
    instance.modalReference = this.modal;

    instance.onConfirm.subscribe($event => {
      if (this.modal) {
        this.modal.close();
      }
    });
    instance.referenceId = rowData.referenceId;
    instance.orderPartId = rowData.orderPartId;
    instance.pickTicketId = rowData.pickTicketId;
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
    this.salesOrderService.getpickticketHistory(rowData.pickTicketId).subscribe(res => {
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
    const itemMasterId = rowData.itemMasterId;
    const conditionId = rowData.conditionId;
    const referenceId = rowData.referenceId;
    const orderPartId = rowData.orderPartId;
    this.qtyToPick = rowData.qtyToPick;
    this.modal = this.modalService.open(pickticketieminterface, { size: "lg", backdrop: 'static', keyboard: false });
    this.commonService
      .getStockLineforPickTicket(itemMasterId, conditionId, referenceId,this.moduleId)
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.parts = response[0];
        for (let i = 0; i < this.parts.length; i++) {
          if (this.parts[i].oemDer == null)
            this.parts[i].oemDer = this.parts[i].stockType;
          this.parts[i]['isSelected'] = false;
          this.parts[i]['referenceId'] = referenceId;
          this.parts[i]['orderPartId'] = orderPartId;
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
    this.confirmselected = part.pickTicketId;
    this.ptNumber = part.pickTicketNumber;
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
    //this.modal = this.modalService.open(StocklineViewComponent, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
    this.modal.componentInstance.stockLineId = rowData.stockLineId;
  }
  
  pickticketItemInterfaceedit(rowData, pickticketieminterface) {
    const pickTicketId = rowData.pickTicketId;
    const referenceId = rowData.referenceId;
    const orderPartId = rowData.orderPartId;
    this.modal = this.modalService.open(pickticketieminterface, { size: "lg", backdrop: 'static', keyboard: false });
    this.salesOrderService
      .getPickTicketEdit(pickTicketId, referenceId, orderPartId)
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.parts = response;
        for (let i = 0; i < this.parts.length; i++) {
          if (this.parts[i].oemDer == null)
            this.parts[i].oemDer = this.parts[i].stockType;

          this.parts[i]['isSelected'] = false;
          this.parts[i]['pickTicketId'] = pickTicketId;
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