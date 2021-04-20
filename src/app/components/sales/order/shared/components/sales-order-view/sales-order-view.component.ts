import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { SalesQuoteService } from "../../../../../../services/salesquote.service";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CurrencyService } from "../../../../../../services/currency.service";
import { EmployeeService } from "../../../../../../services/employee.service";
import { CustomerService } from "../../../../../../services/customer.service";
import { CommonService } from "../../../../../../services/common.service";
import { AuthService } from "../../../../../../services/auth.service";
import { StocklineViewComponent } from '../../../../../../shared/components/stockline/stockline-view/stockline-view.component';
import { SalesOrderService } from "../../../../../../services/salesorder.service";
import { SalesOrderApproveComponent } from "../sales-approve/sales-approve.component";
import { SalesOrderCustomerApprovalComponent } from "../sales-order-customer-approval/sales-order-customer-approval.component";
import { MarginSummary } from "../../../../../../models/sales/MarginSummaryForSalesorder";
import { SalesOrderChargesComponent } from "../sales-order-charges/sales-order-charges.component";
import { SalesOrderFreightComponent } from "../sales-order-freight/sales-order-freight.component";
import { forkJoin } from "rxjs/observable/forkJoin";
import { SalesOrderDocumentComponent } from "../sales-document/sales-order-document.component";
import { SalesOrderAnalysisComponent } from "../../../sales-order-analysis/sales-order-analysis.component";

@Component({
  selector: "app-sales-order-view",
  templateUrl: "./sales-order-view.component.html",
  styleUrls: ["./sales-order-view.component.scss"]
})
export class SalesOrderViewComponent implements OnInit {
  @ViewChild(SalesOrderApproveComponent, { static: false }) public salesOrderApproveComponent: SalesOrderApproveComponent;
  @ViewChild(SalesOrderCustomerApprovalComponent, { static: false }) public salesOrderCustomerApprovalComponent: SalesOrderCustomerApprovalComponent;
  @ViewChild(SalesOrderChargesComponent, { static: false }) public salesOrderChargesComponent: SalesOrderChargesComponent;
  @ViewChild(SalesOrderFreightComponent, { static: false }) public salesOrderFreightComponent: SalesOrderFreightComponent;
  @ViewChild(SalesOrderDocumentComponent, { static: false }) public salesOrderDocumentComponent: SalesOrderDocumentComponent;
  @ViewChild(SalesOrderAnalysisComponent, { static: false }) public salesOrderAnalysisComponent: SalesOrderAnalysisComponent;
  @Input() salesOrderId: any;
  @Input() customerId;
  @Input() salesOrderView: any;
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
  partColumns: any[];
  customerDetails: any;
  salesQuote: any;
  salesOrder: any;
  salesOrderQuote: any = {};
  selectedParts: any[] = [];
  creditTerms: any[];
  percents: any[];
  allCurrencyInfo: any[];
  allEmployeeinfo: any[] = [];
  customerWarningData: any = [];
  accountTypes: any[];
  partModal: NgbModalRef;
  customerContactList: any[];
  SalesOrderQuoteId: any;
  managementStructureId: any;
  isSpinnerVisible = false;
  status: any;
  marginSummary: MarginSummary = new MarginSummary();
  managementStructure: any = {};
  freight = [];
  charge = [];
  moduleName: any = "SalesOrder";

  constructor(
    private salesQuoteService: SalesQuoteService,
    private salesOrderService: SalesOrderService,
    private modalService: NgbModal,
    private customerService: CustomerService,
    public employeeService: EmployeeService,
    private commonservice: CommonService,
    public currencyService: CurrencyService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.salesOrder = this.salesOrderView.salesOrder;
    this.customerId = this.salesOrder.customerId;
    this.salesQuoteService.selectedParts = this.marshallParts(this.salesOrderView.parts);
    this.salesQuote = this.salesOrderView.salesOrder;
    this.getRequiredData();
  }

  getRequiredData() {
    this.isSpinnerVisible = true;
    this.managementStructureId = this.salesQuote.managementStructureId;
    forkJoin(
      this.employeeService.getEmployeeCommonData(this.managementStructureId),
      this.customerService.getContacts(this.customerId),
      this.commonservice.getManagementStructureNameandCodes(this.managementStructureId),
      this.salesOrderService.getSOMarginSummary(this.salesOrderView.salesOrder.salesOrderId)).subscribe(result => {
        this.isSpinnerVisible = false;
        this.onempDataLoadSuccessful(result[0][0]);
        this.setAllCustomerContact(result[1]);
        this.setManagementStructureCodes(result[2]);
        if (result[3]) {
          this.marginSummary = result[3];
        } else {
          this.marginSummary = new MarginSummary();
        }
      }, err => {
        this.isSpinnerVisible = false;
      });
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  viewSelectedStockLine(rowData) {
    this.partModal = this.modalService.open(StocklineViewComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    this.partModal.componentInstance.stockLineId = rowData.stockLineId;
  }

  get userId() {
    return this.authService.currentUser ? this.authService.currentUser.id : 0;
  }

  marshallParts(parts) {
    let selectedPartsTemp = [];
    if (parts && parts.length > 0) {
      parts.forEach((part, i) => {
        let selectedPart = parts[i];
        let partNumberObj = this.salesOrderService.marshalSOPartToView(selectedPart, this.salesOrder);
        selectedPartsTemp.push(partNumberObj)
      })
      return selectedPartsTemp;
    }
  }

  private onempDataLoadSuccessful(getEmployeeCerficationList: any[]) {
    this.allEmployeeinfo = getEmployeeCerficationList;
  }

  get currentUserManagementStructureId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.managementStructureId
      : null;
  }

  setAllCustomerContact(res) {
    if (res[0] && res[0].length > 0) {
      this.customerContactList = res[0];
    } else {
      this.customerContactList = [];
    }
  }

  onTabChange(event) {
    if (event.index == 1) {
      this.salesOrderApproveComponent.refresh(this.marginSummary);
    }
    if (event.index == 2) {
      this.salesOrderCustomerApprovalComponent.refresh(this.marginSummary, this.salesOrderView.salesOrder.salesOrderId, this.salesOrderView.salesOrder.salesOrderQuoteId, true, this.customerContactList);
    }
    if (event.index == 4) {
      this.salesOrderFreightComponent.refresh(true);
    }
    if (event.index == 5) {
      this.salesOrderChargesComponent.refresh(true);
    }
    if (event.index == 6) {
      this.salesOrderDocumentComponent.refresh();
    }
    if (event.index == 9) {
      this.salesOrderAnalysisComponent.refresh(this.salesOrderView.salesOrder.salesOrderId);
    }
  }

  verifySalesQuoteConversion(event) {
  }

  onPartsApprovedEvent(event) {
  }

  setManagementStructureCodes(res) {
    if (res.Level1) {
      this.managementStructure.level1 = res.Level1;
    } else {
      this.managementStructure.level1 = '-';
    }
    if (res.Level2) {
      this.managementStructure.level2 = res.Level2;
    } else {
      this.managementStructure.level2 = '-';
    }
    if (res.Level3) {
      this.managementStructure.level3 = res.Level3;
    } else {
      this.managementStructure.level3 = '-';
    }
    if (res.Level4) {
      this.managementStructure.level4 = res.Level4;
    } else {
      this.managementStructure.level4 = '-';
    }
  }

  saveSalesOrderFreightsList(e) {
  }

  updateSalesOrderFreightsList(e) {
  }

  getFreightList() {
  }

  saveSalesOrderChargesList(e) {
  }

  updateSalesOrderChargesList(e) {
  }

  getChargesList() {
  }
}