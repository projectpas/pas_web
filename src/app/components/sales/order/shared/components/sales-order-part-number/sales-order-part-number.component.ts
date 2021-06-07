import { Component, Input, ViewChild, ElementRef, EventEmitter, Output } from "@angular/core";
import { ISalesQuote } from "../../../../../../models/sales/ISalesQuote.model";
import { IPartJson } from "../../../../shared/models/ipart-json";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PartDetail } from "../../../../shared/models/part-detail";
import { SalesQuoteService } from "../../../../../../services/salesquote.service";
import { ItemMasterSearchQuery } from "../../../../quotes/models/item-master-search-query";
import {
  AlertService,
  MessageSeverity
} from "../../../../../../services/alert.service";
import { SalesOrderService } from "../../../../../../services/salesorder.service";
import { Router } from "@angular/router";
import { SalesOrderReference } from "../../../../../../models/sales/salesOrderReference";
import { SalesOrderReferenceStorage } from "../../../../shared/sales-order-reference-storage";
import { ISalesOrderView } from "../../../../../../models/sales/ISalesOrderView";
import { AuthService } from "../../../../../../services/auth.service";
import { CommonService } from "../../../../../../services/common.service";
import { ISalesOrderPart } from "../../../../../../models/sales/ISalesOrderPart";
declare var $: any;
import { SummaryPart } from "../../../../../../models/sales/SummaryPart";

@Component({
  selector: "app-sales-order-part-number",
  templateUrl: "./sales-order-part-number.component.html",
  styleUrls: ["./sales-order-part-number.component.scss"]
})
export class SalesOrderPartNumberComponent {
  show: boolean;
  addPartModal: NgbModalRef;
  deletePartModal: NgbModalRef;
  salesMarginModal: NgbModalRef;
  partActionModal: NgbModalRef;
  salesReserveModal: NgbModalRef;
  selectedPartDataForAction: any;
  part: PartDetail;
  selectedPart: IPartJson;
  selectedParts: any[] = [];
  summaryParts: any[] = [];
  showPaginator: boolean;
  totalRecords: number;
  pageLinks: any;
  chooseParts: any[] = [];
  columns: any[];
  summaryColumns: any[] = [];
  selectedSummaryRow: SummaryPart;
  isStockLineViewMode = false;
  clearData = false;
  selectedSummaryRowIndex = null;
  @ViewChild("addPart", { static: false }) addPart: ElementRef;
  @Input() salesOrderId: any;
  @Input() defaultSettingPriority;
  @ViewChild("salesMargin", { static: false }) salesMargin: ElementRef;
  @ViewChild("salesReserve", { static: false }) salesReserve: ElementRef;
  @Input() customer: any;
  @Input() totalFreights = 0;
  @Input() totalCharges = 0;
  @Input() salesQuote: ISalesQuote;
  @Input() employeesList: any = [];
  @Input() isViewMode: Boolean;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() reserve: EventEmitter<any> = new EventEmitter<any>();
  @Output('on-parts-save') onPartsSavedEvent: EventEmitter<ISalesOrderPart[]> = new EventEmitter<ISalesOrderPart[]>();
  query: ItemMasterSearchQuery;
  isEdit: boolean = false;
  isEditMode: boolean = false;
  isQtyAdjust: boolean = false;
  selectedPartActionType: any;
  @Input() salesOrderView: ISalesOrderView;
  @ViewChild("updatePNDetailsModal", { static: false })
  public updatePNDetailsModal: ElementRef;
  modal: NgbModalRef;
  @Output() myEvent = new EventEmitter();
  isPNView: boolean = true;
  salesOrderReferenceData: SalesOrderReference
  defaultCurrencyId: any;
  defaultCurrencyDiscription: any;
  legalEntity: number;
  isSpinnerVisible = false;
  saveButton = false;
  canSaveParts = false;
  inputValidCheckHeader: any;

  constructor(
    private modalService: NgbModal,
    private salesQuoteService: SalesQuoteService,
    private alertService: AlertService,
    private salesOrderService: SalesOrderService,
    private router: Router,
    private salesOrderReferenceStorage: SalesOrderReferenceStorage,
    private authService: AuthService,
    private commonService: CommonService
  ) {
    this.show = false;
    this.part = new PartDetail();
  }

  ngOnInit() {
    this.getDefaultCurrency();
    this.salesQuoteService.getSearchPartObject().subscribe(data => {
      this.query = data;
    });
    this.salesQuoteService.getSelectedParts().subscribe(data => {
      if (data) {
        this.selectedParts = data;
      } else {
        this.selectedParts = [];
      }
    });
    this.filterParts();
    if ((this.salesOrderView == null || this.salesOrderView == undefined)) {
      this.isPNView = false;
    }

    this.columns = [];
    this.initColumns();
  }

  refresh() {
    this.salesQuoteService.getSelectedParts().subscribe(data => {
      if (data) {
        this.selectedParts = data;
      } else {
        this.selectedParts = [];
      }
    });
    this.filterParts();
    this.canSaveParts = true;
  }

  getDefaultCurrency() {
    this.legalEntity = 19;
    this.commonService.getDefaultCurrency(this.legalEntity).subscribe(res => {
      this.defaultCurrencyId = res.currencyId;
      this.defaultCurrencyDiscription = res.currencyName;
    })
  }

  initColumns() {
    this.columns = [
      { header: "PN", width: "130px" },
      { header: "PN Description", width: "250px" },
      { header: "Stk Line Num", width: "100px" },
      { header: "Ser Num", width: "70px" },
      { header: "Stk Type", width: "100px" },
      { header: "Cond", width: "70px" },
      { header: "Priority", width: "100px" },
      { header: "Cust Req Date", width: "130px" },
      { header: "Cust Promised Date", width: "130px" },
      { header: "Est Ship Date", width: "130px" },
      { header: "Qty Ord", width: "90px" },
      { header: "Qty Resvd", width: "90px" },
      { header: "Qty Avail", width: "110px" },
      { header: "Qty On Hand", width: "110px" },
      { header: "Qty Back Ord", width: "100px" },
      { header: "Qty to Ship", width: "90px" },
      { header: "Alt/Equiv", width: "100px" },
      { header: "Cust Ref", width: "150px" },
      { header: "Status", width: "80px" },
      { header: "Qte Num", width: "100px" },
      { header: "Qte Ver", width: "100px" },
      { header: "Qte Date", width: "100px" },
      { header: "Qty Invoiced", width: "90px" },
      { header: "Invoice Num", width: "90px" },
      { header: "Invoice Date", width: "110px" },
      { header: "Qty Prev Shpd", width: "110px" },
      { header: "Last Ship Date", width: "110px" },
      { header: "Ship Ref", width: "110px" },
      { header: "Unit Cost", width: "90px" },
      { header: "MarkUp %", width: "70px" },
      { header: "MarkUp Amt/Unit", width: "110px" },
      { header: "Gross Price/Unit", width: "110px" },
      { header: "Disc. %", width: "60px" },
      { header: "Disc. Amt/Unit", width: "110px" },
      { header: "Markup Amt", width: "100px" },
      { header: "Gross Sales Amt", width: "110px" },
      { header: "Disc. Amt", width: "90px" },
      { header: "Net Sales Amt", width: "100px" },
      { header: "Tax Type", width: "90px" },
      { header: "Tax Amt", width: "90px" },
      { header: "Total", width: "90px" },
      { header: "Ext Cost", width: "100px" },
      { header: "Prod Margin", width: "100px" },
      { header: "Prod Margin (%)", width: "120px" },
      { header: "Cntrl Num", width: "80px" },
      { header: "Cntrl ID Num", width: "90px" },
      { header: "Notes", width: "120px" }
    ];

    if (!this.isViewMode) {
      this.columns.push({ header: "Notes", width: "120px" });
    }

    this.summaryColumns = [
      { field: 'itemNo', header: 'Line #', width: '43px', textalign: 'center' },
      { field: 'partNumber', header: 'PN', width: "140px" },
      { field: 'partDescription', header: 'PN Description', width: "200px" },
      { field: 'pmaStatus', header: 'Stk Type', width: "70px" },
      { field: 'conditionDescription', header: 'Cond', width: "70px" },
      { field: 'quantityRequested', header: 'Qty Req', width: "60px" },
      { field: 'quantityAlreadyQuoted', header: 'Qty Ord', width: "60px" },
      { field: 'qtyReserved', header: 'Qty Resvd', width: "70px" },
      { field: 'quantityPrevShipped', header: 'Qty Prev Shipped', width: "98px" },
      { field: 'qtyBackOrder', header: 'Qty Back Ord', width: "98px" },
      { field: 'qtyAvailable', header: 'Qty Avail', width: "98px" },
      { field: 'qtyOnHand', header: 'Qty on Hand', width: "98px" },
      { field: 'currencyDescription', header: 'Curr', width: "80px" },
      { field: 'fixRate', header: 'FX Rate', width: "75px" },
      { field: 'uomName', header: 'UOM', width: "90px" },
      { field: 'customerRef', header: 'Cust Ref', width: "110px" },
      { field: 'grossSalePrice', header: 'Gross Sale Amt', width: "110px" },
      { field: 'salesDiscountExtended', header: 'Disc Amt', width: "75px" },
      { field: 'netSalesPriceExtended', header: 'Net Sale Amt', width: "84px" },
      // { field: 'qtyPreviouslyShipped', header: 'Qty Prev Shpd', width: "84px" },
      { field: 'lastShippedDate', header: 'Last Ship Date', width: "84px" },
      { field: 'misc', header: 'Misc', width: "70px" },
      { field: 'freight', header: 'Freight', width: "80px" },
      { field: 'taxAmount', header: 'Tax Amt', width: "80px" },
      { field: 'totalSales', header: 'Total', width: "95px" },
      { field: 'unitCostExtended', header: 'Ext Cost', width: "90px" },
      { field: 'marginAmountExtended', header: 'Prod Margin', width: "80px" },
      { field: 'marginPercentageExtended', header: 'Prod Margin%', width: "90px" }
    ]
  }

  onEditPartDetails() {
    this.combineParts(this.summaryParts);
    this.canSaveParts = false;
  }

  onClose(event) {
    this.show = false;
    if (this.addPartModal) {
      this.addPartModal.close();
    }
    if (this.partActionModal) {
      this.partActionModal.close();
    }
  }

  onSave(selectedParts) {
    this.salesQuoteService.selectedParts = selectedParts;
    this.refresh();
    this.canSaveParts = false;
    this.addPartModal.close();
  }

  onCloseReserve(event) {
    this.show = false;
    this.salesReserveModal.close();
    this.refreshParts();
  }

  salesOrderObj: any;
  refreshParts() {
    this.salesOrderService.getSalesOrder(this.salesOrderId).subscribe(res => {
      this.salesOrderObj = res[0].salesOrder;
      let partList: any[] = res[0].parts;

      if (this.selectedParts.length > 0)
        this.selectedParts = [];

      for (let i = 0; i < partList.length; i++) {
        let selectedPart = partList[i];
        let partNumberObj = this.salesOrderService.marshalSOPartToView(selectedPart, this.salesOrderObj);
        this.selectedParts.push(partNumberObj);
      }

      this.salesQuoteService.selectedParts = this.selectedParts;
      this.refresh();
    });
  }

  onCloseMargin(event) {
    this.show = false;
    this.salesMarginModal.close();
    if (!this.isEdit) {
      this.selectedPart.selected = false;
      this.openPartNumber(false, true);
    }
  }

  onSearchAnotherPN(event) {
    this.show = false;
    this.salesMarginModal.close();
    if (!this.isEdit) {
      this.selectedPart.selected = false;
      this.openPartNumberClear(true);
    }
  }

  onClosePartDelete() {
    this.deletePartModal.close();
  }

  addPartNumber(summaryRow: any = '', rowIndex = null) {
    this.salesQuoteService.resetSearchPart();
    if (summaryRow) {
      this.selectedSummaryRow = summaryRow;
      this.selectedSummaryRowIndex = rowIndex;
    } else {
      this.selectedSummaryRow = null;
      this.selectedSummaryRowIndex = null;
    }
    this.openPartNumber(false, false);
    if (summaryRow == "") {
      this.isEditMode = false;
    }
  }

  adjustQty(summaryRow: any = '', rowIndex = null) {
    this.salesQuoteService.resetSearchPart();
    if (summaryRow) {
      this.selectedSummaryRow = summaryRow;
      this.selectedSummaryRowIndex = rowIndex;
    } else {
      this.selectedSummaryRow = null;
      this.selectedSummaryRowIndex = null;
    }
    this.openQtyAdjust(false);
    if (summaryRow == "") {
      this.isEditMode = false;
    }
  }

  viewPartNumber(summaryRow: any = '', rowIndex = null) {
    this.salesQuoteService.resetSearchPart();
    if (summaryRow) {
      this.selectedSummaryRow = summaryRow;
      this.selectedSummaryRowIndex = rowIndex;
    } else {
      this.selectedSummaryRow = null;
      this.selectedSummaryRowIndex = null;
    }
    this.openPartNumber(true, false);
    this.isEditMode = false;
  }

  openPartNumber(viewMode, close) {
    this.isStockLineViewMode = viewMode;
    this.clearData = viewMode;
    let contentPart = this.addPart;
    if (close)
      this.isEditMode = false;
    else
      this.isEditMode = true;
    this.isQtyAdjust = false;
    this.addPartModal = this.modalService.open(contentPart, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
  }

  openQtyAdjust(viewMode) {
    this.isStockLineViewMode = viewMode;
    this.clearData = viewMode;
    let contentPart = this.addPart;
    this.isEditMode = false;
    this.isQtyAdjust = true;
    this.addPartModal = this.modalService.open(contentPart, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
  }

  openPartNumberClear(viewMode) {
    this.clearData = viewMode;
    let contentPart = this.addPart;
    this.addPartModal = this.modalService.open(contentPart, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
  }

  partsAction(type) {
    this.selectedPartActionType = type;
    let contentPart = this.salesReserve;
    this.salesReserveModal = this.modalService.open(contentPart, { size: "xlg", backdrop: 'static', keyboard: false });
  }

  onPartRowSelect(event) {
    this.selectedPartDataForAction = event.data;
  }

  onShowModalReserve(event) {
    this.isEdit = false;
    let contentMargin = this.salesMargin;
    this.selectedPart = event.part;
    let checked = event.checked;
    if (this.selectedPart) {
      if (checked) {
        this.part = event.part;
        this.salesReserveModal = this.modalService.open(this.salesReserve, { size: "lg", backdrop: 'static', keyboard: false });
      } else {
        this.removePartNamber(this.selectedPart);
      }
    }
  }

  get masterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : 1;
  }

  openSalesMargin(event) {
    this.isEdit = false;
    let contentMargin = this.salesMargin;
    this.selectedPart = event.part;
    let checked = event.checked;
    if (this.selectedPart) {
      if (checked) {
        this.salesQuoteService.getSearchPartObject().subscribe(data => {
          this.query = data;
          this.part = new PartDetail();
          this.part.partNumber = this.selectedPart.partNumber;
          this.part.stockLineNumber = this.selectedPart.stockLineNumber;
          this.part.salesPricePerUnit = +this.selectedPart.unitSalePrice;
          this.part.unitCostPerUnit = +this.selectedPart.unitCost;
          this.part.itemClassification = this.selectedPart.itemClassification;
          this.part.description = this.selectedPart.description;
          this.part.itemMasterId = this.selectedPart.itemMasterId;
          this.part.partId = this.selectedPart.partId;
          this.part.stockLineId = this.selectedPart.stockLineId;
          this.part.idNumber = this.selectedPart.idNumber;
          this.part.statusId = this.salesQuote.statusId;
          this.part.freight = this.salesOrderService.getTotalFreights();
          this.part.misc = this.salesOrderService.getTotalCharges();
          this.part.priorityId = this.defaultSettingPriority;
          this.part.createdBy = this.userName;
          if (this.selectedPart.itemMasterSale) {
            this.part.fixRate = this.selectedPart.itemMasterSale.fxRate;
          }
          this.part.taxType = this.customer.taxType;
          this.part.taxPercentage = this.customer.taxPercentage;
          if (this.selectedPart.mappingType == 1) {
            this.part.altOrEqType = "Alt";
          } else if (this.selectedPart.mappingType == 2) {
            this.part.altOrEqType = "Equi";
          } else {
            this.part.altOrEqType = "";
          }
          this.part.masterCompanyId = this.masterCompanyId;
          this.part.conditionId = this.selectedPart.conditionId;
          this.part.conditionDescription = this.selectedPart.conditionDescription;
          this.part.currencyId = this.defaultCurrencyId;
          this.part.currencyDescription = this.defaultCurrencyDiscription;
          this.part.salesQuoteNumber = this.salesQuote.salesOrderQuoteNumber;
          this.part.quoteVesrion = this.salesQuote.versionNumber;
          this.part.customerRef = this.salesQuote.customerReferenceName;
          this.part.serialNumber = this.selectedPart.serialNumber;
          this.part.uomName = this.selectedPart.uomDescription;
          this.part.pmaStatus = this.selectedPart.oempmader;
          if (!this.part.pmaStatus) {
            this.part.pmaStatus = this.selectedPart['stockType'];
          }
          this.part.controlNumber = this.selectedPart.controlNumber;
          if (this.salesQuote.salesOrderQuoteNumber) {
            this.part.quoteDate = this.salesQuote.openDate;
          }
          this.part.salesDiscount = 0;
          this.part.markupPerUnit = 0;
          this.part.markUpPercentage = 0;
          this.part.salesDiscount = 0;
          this.part.grossSalePrice = 0;
          this.part.grossSalePricePerUnit = 0;
          this.part.quantityRequested = this.query.partSearchParamters.quantityRequested;
          this.part.quantityToBeQuoted = this.query.partSearchParamters.quantityToQuote;
          if (this.selectedPart['qtyRemainedToQuote']) {
            if (this.selectedPart['qtyRemainedToQuote'] >= this.part.quantityToBeQuoted) {
              this.part.quantityFromThis = this.part.quantityToBeQuoted;
            } else {
              this.part.quantityFromThis = this.selectedPart['qtyRemainedToQuote'];
            }
          } else {
            this.part.quantityFromThis = this.part.quantityToBeQuoted;
          }

          this.part.qtyAvailable = this.selectedPart.qtyAvailable;
          this.part.quantityOnHand = this.selectedPart.quantityOnHand;
          this.part.quantityAvailableForThis = this.query.partSearchParamters.qtyAvailable;
          this.part.quantityAlreadyQuoted = this.query.partSearchParamters.quantityAlreadyQuoted;
          this.part.itemGroup = this.selectedPart.itemGroup;
        });
        this.addPartModal.close();
        this.salesMarginModal = this.modalService.open(contentMargin, { size: "lg", backdrop: 'static', keyboard: false });
        this.salesMarginModal.result.then(
          () => { },
          () => {
            this.selectedPart.selected = false;
          }
        );
      } else {
        this.removePartNamber(this.selectedPart);
      }
    }
  }

  openSalesMarginSave(event) {
    this.salesQuoteService.getSearchPartObject().subscribe(data => {
      this.query = data;
      this.query.partSearchParamters.quantityAlreadyQuoted =
        Number(this.query.partSearchParamters.quantityAlreadyQuoted) +
        Number(event.quantityFromThis);
      this.query.partSearchParamters.quantityToQuote =
        Number(this.query.partSearchParamters.quantityRequested) -
        Number(this.query.partSearchParamters.quantityAlreadyQuoted);
    });
    this.part.quantityToBeQuoted = Number(event.quantityFromThis);
    this.part.quantityAlreadyQuoted = Number(event.quantityFromThis);
    this.part.itemNo = this.countItemNo + 1;
    this.salesQuoteService.updateSearchPartObject(this.query);

    let partObj = { ...this.part };
    if (!this.isEdit) {
      if (this.selectedSummaryRow) {
        this.selectedSummaryRow.quantityToBeQuoted = this.query.partSearchParamters.quantityToQuote;
        this.selectedSummaryRow.quantityAlreadyQuoted = this.query.partSearchParamters.quantityAlreadyQuoted;
        this.selectedSummaryRow.quantityRequested = this.query.partSearchParamters.quantityRequested;
        this.selectedSummaryRow.childParts.forEach((part, i) => {
          this.summaryParts[this.selectedSummaryRowIndex].childParts[i].quantityRequested = this.selectedSummaryRow.quantityRequested;
        })
        this.combineParts(this.summaryParts);
      }
      this.openPartNumber(false, true);
      this.selectedParts.push(partObj);
      this.salesQuoteService.selectedParts = this.selectedParts;
    }
    this.salesMarginModal.close();
    this.filterParts();
    this.canSaveParts = false;
  }

  openPartToEdit(part) {
    this.isEdit = true;
    let contentPartEdit = this.salesMargin;
    this.part = part;
    if (this.part) {
      this.salesQuoteService.getSearchPartObject().subscribe(data => {
        this.query = data;
        this.part = part;
        this.query.partSearchParamters.quantityRequested = this.part.quantityRequested;

        this.query.partSearchParamters.quantityToQuote = this.part.quantityToBeQuoted;
        this.query.partSearchParamters.quantityAlreadyQuoted = this.part.quantityAlreadyQuoted;
        let parentLine = this.summaryParts.filter(a => a.partId == this.part.itemMasterId && a.conditionId == this.part.conditionId);

        if (parentLine) {
          this.query.partSearchParamters.quantityToQuote = parentLine[0].quantityToBeQuoted;
          this.query.partSearchParamters.quantityAlreadyQuoted = parentLine[0].quantityAlreadyQuoted;
          this.part['quantityToQuote'] = parentLine[0].quantityToBeQuoted;

          if ((parentLine[0].quantityAlreadyQuoted - Number(this.part['quantityFromThis'])) > 0)
            this.part['quantityAlreadyQuoted'] = parentLine[0].quantityAlreadyQuoted - Number(this.part['quantityFromThis']);
          else
            this.part['quantityAlreadyQuoted'] = Number(this.part['quantityFromThis']);

          this.part['quantityToBeQuoted'] = (this.part.quantityRequested - parentLine[0].quantityAlreadyQuoted) + Number(this.part['quantityFromThis']);
        }

      });
      this.salesMarginModal = this.modalService.open(contentPartEdit, { size: "lg", backdrop: 'static', keyboard: false });
    }
  }

  openPartDelete(contentPartDelete, part) {
    this.countItemNo = this.countItemNo - 1;
    this.part = part;
    this.deletePartModal = this.modalService.open(contentPartDelete, { size: "sm", backdrop: 'static', keyboard: false });
  }

  deletePart(): void {
    if (this.part.salesOrderPartId) {
      this.isSpinnerVisible = true;
      this.salesOrderService.deletePart(this.part.salesOrderPartId).subscribe(response => {
        this.removePartNamber(this.part);
        this.deletePartModal.close();
        this.alertService.showMessage(
          "Success",
          `Part removed successfully.`,
          MessageSeverity.success
        );
        this.isSpinnerVisible = false;
        this.refreshParts();
      }, error => {
        this.isSpinnerVisible = false;
      });
    } else {
      this.removePartNamber(this.part);
      this.deletePartModal.close();
      this.alertService.showMessage(
        "Success",
        `Part removed successfully.`,
        MessageSeverity.success
      );
    }
  }

  checkForDuplicates(selectedPart) {
    let selectedPartNamber = selectedPart.partNumber;
    let selectedStockLineNumber = selectedPart.stockLineNumber;
    let selectedConditionId = selectedPart.conditionId;
    let selectedPmaStatus = selectedPart.pmaStatus;

    for (let i = 0; i < this.selectedParts.length; i++) {
      let partNumber = this.selectedParts[i].partNumber;
      let stockLineNumber = this.selectedParts[i].stockLineNumber;
      let conditionId = this.selectedParts[i].conditionId;
      let pmaStatus = this.selectedParts[i].pmaStatus;
      if (
        partNumber == selectedPartNamber &&
        stockLineNumber == selectedStockLineNumber &&
        conditionId == selectedConditionId &&
        pmaStatus == selectedPmaStatus
      ) {
        return true;
      }
      return false;
    }
  }

  removePartNamber(selectedPart) {
    let selectedPartNamber = selectedPart.partNumber;
    let selectedStockLineNumber = selectedPart.stockLineNumber;
    let selectedConditionId = selectedPart.conditionId;
    let selectedPmaStatus = selectedPart.pmaStatus;

    for (let i = 0; i < this.selectedParts.length; i++) {
      let partNumber = this.selectedParts[i].partNumber;
      let stockLineNumber = this.selectedParts[i].stockLineNumber;
      let conditionId = this.selectedParts[i].conditionId;
      let pmaStatus = this.selectedParts[i].pmaStatus;
      if (
        partNumber == selectedPartNamber &&
        stockLineNumber == selectedStockLineNumber &&
        conditionId == selectedConditionId &&
        pmaStatus == selectedPmaStatus
      ) {
        this.selectedParts.splice(i, 1);
        this.onPartsSavedEvent.emit(this.selectedParts);
      }
    }
    this.filterParts();
    this.checkUpdateOrsaveButton();
  }

  initiateCreateWOROPO(part, type) {
    this.salesOrderService.getcommonsalesorderdetails(this.salesOrderId, part.salesOrderPartId).subscribe(data => {
      if (data.length > 0) {
        this.salesOrderService.setReferenceObject(data[0])
        this.salesOrderReferenceData = data[0];
        this.salesOrderReferenceStorage.salesOrderReferenceData = this.salesOrderReferenceData;
        if (type == "WO") {
          this.router.navigateByUrl('workordersmodule/workorderspages/app-work-order-add');
        }
        if (type == "RO") {
          this.router.navigateByUrl('vendorsmodule/vendorpages/app-create-ro');
        }
        if (type == "PO") {
          this.router.navigateByUrl('vendorsmodule/vendorpages/app-create-po');
        }
      }
    });
  }

  ngOnDestroy() {
    this.salesOrderService.salesOrderReference = this.salesOrderReferenceData;
  }

  isEditDisabled(quote: ISalesQuote, part: any): boolean {
    if (part.createdBy && part.createdBy == this.userName) {
      return ((quote.isApproved || part.isApproved) && part.methodType != "S")
    } else {
      return true;
    }
  }

  isDeleteDisabled(quote: ISalesQuote, part: any) {
    if (part.createdBy && part.createdBy == this.userName) {
      if (quote.isApproved || part.isApproved) {
        return true;
      }
      else if (part.qtyReserved > 0 || part.qtyShipped > 0 || part.qtyInvoiced > 0) {
        return true;
      }
      else {
        return false;
      }
    } else {
      return true;
    }
  }

  openConfirmationModal() {
    this.modal = this.modalService.open(this.updatePNDetailsModal, { size: "sm", backdrop: 'static', keyboard: false });
  }

  closeConfirmationModal() {
    if (this.modal) {
      this.modal.close();
    }
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  onPaging(event) {
  }

  approve() {
    let partList: any = [];
    this.salesOrderView.parts = [];
    this.salesOrderView.salesOrder.salesOrderQuoteId = this.salesQuote.salesOrderQuoteId;
    let invalidParts = false;
    let invalidDate = false;

    for (let i = 0; i < this.selectedParts.length; i++) {
      let selectedPart = this.selectedParts[i];
      if (!selectedPart.salesOrderPartId) {
        var errmessage = '';
        if (!selectedPart.customerRequestDate) {
          this.isSpinnerVisible = false;
          invalidParts = true;
          errmessage = errmessage + '<br />' + "Please enter Customer Request Date."
        }
        if (!selectedPart.estimatedShipDate) {
          this.isSpinnerVisible = false;
          invalidParts = true;
          errmessage = errmessage + '<br />' + "Please enter Estimated Ship Date."
        }
        if (!selectedPart.promisedDate) {
          this.isSpinnerVisible = false;
          invalidParts = true;
          errmessage = errmessage + '<br />' + "Please enter Promised Date."
        }
        if (!selectedPart.priorityId) {
          this.isSpinnerVisible = false;
          invalidParts = true;
          errmessage = errmessage + '<br />' + "Please enter priority ID."
        }
        if (selectedPart.customerRequestDate && selectedPart.promisedDate && selectedPart.estimatedShipDate) {
          if (selectedPart.customerRequestDate < this.salesQuote.openDate ||
            selectedPart.estimatedShipDate < this.salesQuote.openDate ||
            selectedPart.promisedDate < this.salesQuote.openDate) {
            invalidDate = true;
          }
        }
      }
      if (!invalidParts && !invalidDate) {
        let partNumberObj = this.salesOrderService.marshalSOPartToSave(selectedPart, this.userName);
        this.salesOrderView.parts.push(partNumberObj);
      }
    }
    if (invalidParts) {
      this.alertService.resetStickyMessage();
      this.alertService.showStickyMessage('Sales Order', errmessage, MessageSeverity.error);
    } else if (invalidDate) {
      this.alertService.resetStickyMessage();
      this.alertService.showStickyMessage('Sales Order', "Please select valid Dates for Sales Order PartsList!", MessageSeverity.error);
    } else {
      this.isSpinnerVisible = true;
      this.salesOrderService.update(this.salesOrderView).subscribe(data => {
        this.canSaveParts = true;
        this.alertService.stopLoadingMessage();
        this.isSpinnerVisible = false;
        this.updateNewSalesOrderPartNumber(data[0]);
        this.alertService.showMessage(
          "Success",
          `PN updated successfully.`,
          MessageSeverity.success
        );
        this.saveButton = true;
        this.onPartsSavedEvent.emit(this.selectedParts);
        this.refreshParts();
      }, error => {
        this.isSpinnerVisible = false;
      });
    }
    this.closeConfirmationModal();
  }

  updateNewSalesOrderPartNumber(data) {
    for (let i = 0; i < this.selectedParts.length; i++) {
      let selectedPart = this.selectedParts[i];
      for (let j = 0; j < data.parts.length; j++) {
        let dt = data.parts[j];
        if (selectedPart.conditionId == dt.conditionId && selectedPart.itemMasterId == dt.itemMasterId) {
          this.selectedParts[i].salesOrderPartId = dt.salesOrderPartId;
        }
      }
    }
  }

  onDataLoadFailed(error) {
    this.isSpinnerVisible = false;
    let errorMessage = '';
    if (error.message) {
      errorMessage = error.message;
    }
    this.alertService.resetStickyMessage();
    this.alertService.showStickyMessage("Sales Order", errorMessage, MessageSeverity.error, error);
  }

  notesIndex;
  notesSummaryIndex;
  onAddTextAreaInfo(material, stockIndex, index) {
    this.notesIndex = stockIndex;
    this.notesSummaryIndex = index;
    this.textAreaInfo = material.notes;
  }

  textAreaInfo: any;
  onSaveTextAreaInfo(notes) {
    if (notes) {
      this.textAreaInfo = notes;
      this.summaryParts[this.notesSummaryIndex].childParts[this.notesIndex].notes = this.textAreaInfo;
      this.combineParts(this.summaryParts);
    }
    this.canSaveParts = false;
    $("#textarea-popupNotes").modal("hide");
  }

  onCloseTextAreaInfo() {
    $("#textarea-popupNotes").modal("hide");
  }

  filterParts() {
    this.summaryParts = [];
    let uniqueParts = this.getUniqueParts(this.selectedParts, 'partNumber', 'conditionId', 'pmaStatus');
    if (uniqueParts.length > 0) {
      uniqueParts.forEach((part, i) => {
        let childParts = this.selectedParts.filter(selectedPart => selectedPart.partNumber == part.partNumber && selectedPart.conditionId == part.conditionId && selectedPart.pmaStatus == part.pmaStatus)
        if (childParts && childParts.length > 0) {
          uniqueParts[i] = this.calculateSummarizedRow(childParts, part);
          uniqueParts[i].childParts = childParts;
        }
      });
      this.summaryParts = uniqueParts;
    }
    this.totalRecords = this.summaryParts.length;
    this.pageLinks = Math.ceil(
      this.totalRecords / 10
    );
    this.checkUpdateOrsaveButton();
  }

  countItemNo: number = 0;
  calculateSummarizedRow(parts: PartDetail[], uniquePart) {
    uniquePart = new SummaryPart();
    parts.forEach(part => {
      uniquePart.quantityToBeQuoted = this.getSum(uniquePart.quantityToBeQuoted, part.quantityFromThis);
      uniquePart.quantityAlreadyQuoted = uniquePart.quantityToBeQuoted;
      uniquePart.qtyReserved = this.getSum(uniquePart.qtyReserved, part.qtyReserved);
      uniquePart.quantityPrevShipped = this.getSum(uniquePart.quantityPrevShipped, part.qtyShipped);
      uniquePart.qtyAvailable = this.getSum(uniquePart.qtyAvailable, part.qtyAvailable);
      uniquePart.qtyOnHand = this.getSum(uniquePart.qtyOnHand ? uniquePart.qtyOnHand : 0, part.quantityOnHand);
      uniquePart.grossSalePrice = this.getSum(uniquePart.grossSalePrice, part.grossSalePrice);
      uniquePart.salesDiscountExtended = this.getSum(uniquePart.salesDiscountExtended, part.salesDiscountExtended);
      uniquePart.netSalesPriceExtended = this.getSum(uniquePart.netSalesPriceExtended, part.netSalesPriceExtended);
      uniquePart.taxAmount = this.getSum(uniquePart.taxAmount, part.taxAmount);
      uniquePart.totalSales = this.getSum(uniquePart.totalSales, part.totalSales);
      uniquePart.unitCostExtended = this.getSum(uniquePart.unitCostExtended, part.unitCostExtended);
      uniquePart.marginAmountExtended = this.getSum(uniquePart.marginAmountExtended, part.marginAmountExtended);
      uniquePart.marginPercentageExtended = this.getSum(uniquePart.marginPercentageExtended, part.marginPercentagePerUnit);
      if (Number(uniquePart.quantityRequested) != Number(part.quantityRequested)) {
        uniquePart.quantityRequested = Number(uniquePart.quantityRequested) + Number(part.quantityRequested);
      } else {
        uniquePart.quantityRequested = Number(part.quantityRequested);
      }
    })
    uniquePart.partId = parts[0].itemMasterId;
    uniquePart.quantityToBeQuoted = Number(uniquePart.quantityRequested) - Number(uniquePart.quantityAlreadyQuoted);
    uniquePart.qtyBackOrder = Number(uniquePart.quantityAlreadyQuoted) - Number(uniquePart.quantityPrevShipped);
    uniquePart.conditionDescription = parts[0].conditionDescription;
    uniquePart.conditionId = parts[0].conditionId;
    uniquePart.partNumber = parts[0].partNumber;
    uniquePart.partDescription = parts[0].description;
    uniquePart.currencyDescription = parts[0].currencyDescription;
    uniquePart.currencyId = parts[0].currencyId;
    uniquePart.misc = parts[0].misc;
    uniquePart.fixRate = parts[0].fixRate;
    uniquePart.freight = parts[0].freight;
    uniquePart.uomName = parts[0].uomName;
    uniquePart.methodType = parts[0].methodType;
    uniquePart.customerRef = parts[0].customerRef;
    uniquePart.pmaStatus = parts[0].pmaStatus;
    uniquePart.marginPercentageExtended = (uniquePart.marginPercentageExtended) / parts.length;
    uniquePart.itemNo = parts[0].itemNo;
    this.countItemNo = parts[0].itemNo;
    return uniquePart;
  }

  getSum(num1, num2) {
    return Number(num1) + Number(num2);
  }

  getUniqueParts(myArr, prop1, prop2, prop3) {
    let uniqueParts = JSON.parse(JSON.stringify(myArr));
    uniqueParts.reduceRight((acc, v, i) => {
      if (acc.some(obj => v[prop1] === obj[prop1] && v[prop2] === obj[prop2] && v[prop3] === obj[prop3])) {
        uniqueParts.splice(i, 1);
      } else {
        acc.push(v);
      }
      return acc;
    }, []);
    return uniqueParts;
  }

  combineParts(parts) {
    this.selectedParts = [];
    parts.forEach(part => {
      if (part.childParts && part.childParts.length > 0) {
        if (this.selectedParts.length > 0) {
          this.selectedParts = [...this.selectedParts, ...part.childParts];
        } else {
          this.selectedParts = [...part.childParts];
        }
      }
    })
  }

  checkUpdateOrsaveButton() {
    let partFoundWithId = false;
    if (this.summaryParts && this.summaryParts.length > 0) {
      this.summaryParts.forEach(summaryPart => {
        if (summaryPart.childParts && summaryPart.childParts.length > 0) {
          summaryPart.childParts.forEach(part => {
            if (part.salesOrderPartId && !partFoundWithId) {
              partFoundWithId = true;
              this.saveButton = true;
            }
          });
        }
      })
    }
  }

  deletedata: number[] = [];
  deleteAllPartModal: NgbModalRef;

  openmultiplepartDelete(summarypart, index, deletepartcontent) {
    this.selectedSummaryRow = summarypart;
    this.deletedata = [];
    for (let i = 0; i < summarypart.childParts.length; i++) {
      if (this.selectedSummaryRow.childParts[i].salesOrderPartId) {
        this.deletedata.push(this.selectedSummaryRow.childParts[i].salesOrderPartId);
      }
    }
    for (let i = 0; i < summarypart.childParts.length; i++) {
      this.deletedata.push(this.selectedSummaryRow.childParts[i].salesOrderPartId);
    }
    this.deleteAllPartModal = this.modalService.open(deletepartcontent, { size: "sm", backdrop: 'static', keyboard: false });
  }

  deleteMultiplePart(): void {
    if (this.deletedata.length > 0) {
      let data = { "salesOrderPartIds": this.deletedata }
      this.isSpinnerVisible = true;
      this.salesOrderService.deleteMultiplePart(data).subscribe(response => {
        for (let i = 0; i < this.selectedSummaryRow.childParts.length; i++) {
          this.removePartNamber(this.selectedSummaryRow.childParts[i]);
        }
        this.deleteAllPartModal.close();
        this.alertService.showMessage(
          "Success",
          `Part removed successfully.`,
          MessageSeverity.success
        );
        this.isSpinnerVisible = false;
        this.refreshParts();
      }, error => {
        this.isSpinnerVisible = false;
      });
    } else {
      for (let i = 0; i < this.selectedSummaryRow.childParts.length; i++) {
        this.removePartNamber(this.selectedSummaryRow.childParts[i]);
      }
      this.deleteAllPartModal.close();
      this.alertService.showMessage(
        "Success",
        `Part removed successfully.`,
        MessageSeverity.success
      );
    }
  }

  onCloseParMultipletDelete() {
    this.deleteAllPartModal.close();
  }

  createPO(rowData) {
    localStorage.setItem("itemMasterId", rowData.partId);
    localStorage.setItem("partNumber", rowData.partNumber);
    localStorage.setItem("salesOrderId", this.salesOrderId);
    localStorage.setItem("lsconditionId", rowData.conditionId);
    this.router.navigateByUrl(`vendorsmodule/vendorpages/app-purchase-setup`);
  }

  createRO(rowData) {
    localStorage.setItem("itemMasterId", rowData.partId);
    localStorage.setItem("partNumber", rowData.partNumber);
    localStorage.setItem("salesOrderId", this.salesOrderId);
    this.router.navigateByUrl(`vendorsmodule/vendorpages/app-ro-setup`);
  }

  getMarginPercentage(part) {
    return ((((part.salesPriceExtended + Number(part.misc)) - (part.unitCostExtended)) / (part.salesPriceExtended + Number(part.misc))) * 100).toFixed(2);
  }

  getMarginAmount(part) {
    return (part.salesPriceExtended + Number(part.misc)) - (part.unitCostExtended).toFixed(2);
  }

  getTotalRevenue(part) {
    return (part.salesPriceExtended + Number(part.misc)).toFixed(2);
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
}