import { Component, Input, ViewChild, ElementRef, EventEmitter, Output } from "@angular/core";
import { ISalesQuote } from "../../../../../../models/sales/ISalesQuote.model";
import { IPartJson } from "../../../../shared/models/ipart-json";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PartDetail } from "../../../../shared/models/part-detail";
import { SalesQuoteService } from "../../../../../../services/salesquote.service";
import { ItemMasterSearchQuery } from "../../../../quotes/models/item-master-search-query";
import {
  AlertService,
  DialogType,
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
declare var $ : any;
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
  selectedSummaryRowIndex = null;
  @ViewChild("addPart",{static:false}) addPart: ElementRef;
  @Input() salesOrderId: any;
  @Input() defaultSettingPriority;
  @ViewChild("popupContentforPartAction",{static:false}) popupContentforPartAction: ElementRef;
  @ViewChild("salesMargin",{static:false}) salesMargin: ElementRef;
  @ViewChild("salesReserve",{static:false}) salesReserve: ElementRef;
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
  selectedPartActionType: any;
  @Input() salesOrderView: ISalesOrderView;
  @ViewChild("updatePNDetailsModal",{static:false})
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
      { header: "Cond", width: "70px" },
      { header: "Stk Type", width: "100px" },
      { header: "Alt/Equiv", width: "100px" },
      { header: "Customer Ref", width: "150px" },
      { header: "Qty On Back Orde", width: "100px" },
      { header: "Cust Request Date", width: "130px" },
      { header: "Cust Promised Date", width: "130px" },
      { header: "Est.Ship Date", width: "130px" },
      { header: "Priority", width: "100px" },
      { header: "Status", width: "80px" },
      { header: "Quote Num", width: "100px" },
      { header: "Quote Ver", width: "100px" },
      { header: "Quote Date", width: "100px" },
      // { header: "UOM", width: "70px" },
      { header: "Qty Ord", width: "90px" },
      { header: "Qty Reserved", width: "90px" },
      { header: "Qty to Ship", width: "90px" },
      { header: "Qty Invoiced", width: "90px" },
      { header: "Invoice Num", width: "90px" },
      { header: "Invoice Date", width: "110px" },
      { header: "Qty Previously Shipped", width: "110px" },
      { header: "Last Ship Date", width: "110px" },
      { header: "Shipping Ref", width: "110px" },
      { header: "Qty Avail", width: "110px" },
      { header: "Qty On Hand", width: "110px" },
      // { header: "Curr", width: "70px" },
      // { header: "FX Rate", width: "80px" },
      { header: "Unit Cost", width: "90px" },
      { header: "MarkUp %", width: "70px" },
      { header: "MarkUp Amt/Unit", width: "110px" },
      { header: "Gross Price/Unit", width: "110px" },
      { header: "Disc. %", width: "60px" },
      { header: "Disc. Amt/Unit", width: "110px" },
      { header: "MarkUp Amt", width: "100px" },
      { header: "Gross Sales Amt", width: "110px" },
      { header: "Disc. Amt", width: "90px" },
      { header: "Net Sales Amt", width: "100px" },
      // { header: "Misc Amt", width: "90px" },
      // { header: "Freight", width: "90px" },
      { header: "Tax Type", width: "90px" },
      { header: "Tax Amt", width: "90px" },
      { header: "Total", width: "90px" },
      { header: "Extended Cost", width: "100px" },
      { header: "Product Margin", width: "100px" },
      { header: "Product Margin (%)", width: "120px" },
      { header: "Cntrl Num", width: "80px" },
      { header: "Cntrl ID Num", width: "90px" },
      { header: "Notes", width: "120px" },

    ];
    if (!this.isViewMode) {
      this.columns.push({ header: "Notes", width: "120px" });
    }
    this.summaryColumns = [

      { field: 'hidePart', header: '', width: '30px', textalign: 'center' },
      { field: 'partNumber', header: 'PN' },
      { field: 'partDescription', header: 'PN Description' },
      { field: 'pmaStatus', header: 'Stk Type' },
      { field: 'conditionDescription', header: 'Cond' },
      { field: 'quantityRequested', header: 'Qty Req' },
      { field: 'quantityToBeQuoted', header: 'Qty To Quote' },
      { field: 'quantityAlreadyQuoted', header: 'Qty Prev Quoted' },
      { field: 'currencyDescription', header: 'Curr' },
      { field: 'fixRate', header: 'FX Rate' },
      { field: 'uom', header: 'UOM' },
      { field: 'customerRef', header: 'Cust Ref' },
      { field: 'grossSalePrice', header: 'Gross Sale Amt' },
      { field: 'salesDiscountExtended', header: 'Disc Amt' },
      { field: 'netSalesPriceExtended', header: 'Net Sale Amt' },
      { field: 'misc', header: 'Misc' },
      { field: 'freight', header: 'Freight' },
      { field: 'taxAmount', header: 'Tax Amt' },
      { field: 'totalSales', header: 'Total' },
      { field: 'unitCostExtended', header: 'Extended Cost' },
      { field: 'marginAmountExtended', header: 'Prod Margin' },
      { field: 'marginPercentageExtended', header: 'Prod Margin%' },
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

  onCloseReserve(event) {
    this.show = false;
    this.salesReserveModal.close();
  }

  onCloseMargin(event) {
    this.show = false;
    this.salesMarginModal.close();
    if (!this.isEdit) {
      this.selectedPart.selected = false;
      this.openPartNumber(false);
    }
  }

  onClosePartDelete() {
    this.deletePartModal.close();
  }

  addPartNumber(summaryRow: any = '', rowIndex = null) {
    this.salesQuoteService.resetSearchPart();
    //this.salesQuoteService.getSearchPartResult();
    if (summaryRow) {
      this.selectedSummaryRow = summaryRow;
      this.selectedSummaryRowIndex = rowIndex;
    } else {
      this.selectedSummaryRow = null;
      this.selectedSummaryRowIndex = null;
    }
    this.openPartNumber(false);
  }

  viewPartNumber(summaryRow: any = '', rowIndex = null) {
    this.salesQuoteService.resetSearchPart();
    //this.salesQuoteService.getSearchPartResult();
    if (summaryRow) {
      this.selectedSummaryRow = summaryRow;
      this.selectedSummaryRowIndex = rowIndex;
    } else {
      this.selectedSummaryRow = null;
      this.selectedSummaryRowIndex = null;
    }
    this.openPartNumber(true);
  }
  openPartNumber(viewMode) {
    this.isStockLineViewMode = viewMode;
    let contentPart = this.addPart;
    this.addPartModal = this.modalService.open(contentPart, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
  }
  partsAction(type) {
    this.selectedPartActionType = type;
    let contentPart = this.popupContentforPartAction;
    this.partActionModal = this.modalService.open(contentPart, { size: "lg", backdrop: 'static', keyboard: false });
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
          this.part.uom = this.selectedPart.uomDescription;
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
          // this.part.quantityFromThis = this.part.quantityToBeQuoted;
          if (this.selectedPart['qtyRemainedToQuote']) {
            if (this.selectedPart['qtyRemainedToQuote'] >= this.part.quantityToBeQuoted) {
              this.part.quantityFromThis = this.part.quantityToBeQuoted;
            } else {
              this.part.quantityFromThis = this.selectedPart['qtyRemainedToQuote'];
            }
          } else {
            this.part.quantityFromThis = this.part.quantityToBeQuoted;
            // if (this.selectedPart.qtyAvailable >= this.part.quantityToBeQuoted) {
            //   this.part.quantityFromThis = this.part.quantityToBeQuoted;
            // } else {
            //   this.part.quantityFromThis = this.selectedPart.qtyAvailable;
            // }
          }

          this.part.qtyAvailable = this.selectedPart.qtyAvailable;
          this.part.qtyOnHand = this.selectedPart.qtyOnHand;
          this.part.quantityAvailableForThis = this.query.partSearchParamters.qtyAvailable;
          this.part.quantityAlreadyQuoted = this.query.partSearchParamters.quantityAlreadyQuoted;
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
    console.log(event);
    // if(!this.checkForDuplicates(event)){
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
      this.openPartNumber(false);
      this.selectedParts.push(partObj);
    }
    this.salesMarginModal.close();
    this.filterParts();
    this.canSaveParts = false;
    console.log(this.query);
    console.log(this.selectedParts);
    // }
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
      });
      // this.addPartModal.close();
      this.salesMarginModal = this.modalService.open(contentPartEdit, { size: "lg", backdrop: 'static', keyboard: false });
    }
  }

  openPartDelete(contentPartDelete, part) {
    this.part = part;
    this.deletePartModal = this.modalService.open(contentPartDelete, { size: "sm", backdrop: 'static', keyboard: false });
  }
  deletePart(): void {
    if (this.part.salesOrderPartId) {
      this.salesOrderService.deletePart(this.part.salesOrderPartId).subscribe(response => {
        this.removePartNamber(this.part);
        this.deletePartModal.close();
        this.alertService.showMessage(
          "Success",
          `Part removed successfully.`,
          MessageSeverity.success
        );

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
    console.log(this.selectedParts);
  }

  initiateCreateWOROPO(part, type) {
    this.salesOrderService.getcommonsalesorderdetails(this.salesOrderId, part.salesOrderPartId).subscribe(data => {
      if (data.length > 0) {
        this.salesOrderService.setReferenceObject(data[0])
        this.salesOrderReferenceData = data[0];
        // this.salesOrderQuote = results[0];
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
      return (quote.isApproved || part.isApproved);
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
        this.alertService.showMessage(
          "Success",
          `PN  updated successfully.`,
          MessageSeverity.success
        );
        this.saveButton = true;
        this.onPartsSavedEvent.emit(this.selectedParts);
      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
      });
    }
    this.closeConfirmationModal();

  }

  onDataLoadFailed(error) {
    this.isSpinnerVisible = false;
    let errorMessage = '';
    if (error.message) {
      errorMessage = error.message;
    }
    this.alertService.resetStickyMessage();
    this.alertService.showStickyMessage("Sales Order", errorMessage, MessageSeverity.error, error);
    // this.alertService.showMessage(error);
  }

  notesIndex;
  notesSummaryIndex;
  onAddTextAreaInfo(material, stockIndex, index) {
    this.notesIndex = stockIndex;
    this.notesSummaryIndex = index;
    console.log("memolist", material, index);
    this.textAreaInfo = material.notes;
  }
  textAreaInfo: any;
  onSaveTextAreaInfo(notes) {
    if (notes) {
      this.textAreaInfo = notes;
      this.summaryParts[this.notesSummaryIndex].childParts[this.notesIndex].notes = this.textAreaInfo;
      this.combineParts(this.summaryParts);

      // this.selectedParts[this.notesIndex].notes = this.textAreaInfo;
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

  calculateSummarizedRow(parts: PartDetail[], uniquePart) {
    uniquePart = new SummaryPart();
    parts.forEach(part => {
      uniquePart.quantityToBeQuoted = this.getSum(uniquePart.quantityToBeQuoted, part.quantityFromThis);
      uniquePart.quantityAlreadyQuoted = uniquePart.quantityToBeQuoted;
      uniquePart.grossSalePrice = this.getSum(uniquePart.grossSalePrice, part.grossSalePrice);
      uniquePart.salesDiscountExtended = this.getSum(uniquePart.salesDiscountExtended, part.salesDiscountExtended);
      uniquePart.netSalesPriceExtended = this.getSum(uniquePart.netSalesPriceExtended, part.netSalesPriceExtended);
      uniquePart.taxAmount = this.getSum(uniquePart.taxAmount, part.taxAmount);
      uniquePart.totalSales = this.getSum(uniquePart.totalSales, part.totalSales);
      uniquePart.marginAmountExtended = this.getSum(uniquePart.marginAmountExtended, part.marginAmountExtended);
      uniquePart.marginPercentageExtended = this.getSum(uniquePart.marginPercentageExtended, part.marginPercentageExtended);
      if (Number(uniquePart.quantityRequested) != Number(part.quantityRequested)) {
        uniquePart.quantityRequested = Number(uniquePart.quantityRequested) + Number(part.quantityRequested);
      } else {
        uniquePart.quantityRequested = Number(part.quantityRequested);
      }
    })
    uniquePart.partId = parts[0].itemMasterId;
    uniquePart.quantityToBeQuoted = Number(uniquePart.quantityRequested) - Number(uniquePart.quantityAlreadyQuoted);
    uniquePart.conditionDescription = parts[0].conditionDescription;
    uniquePart.conditionId = parts[0].conditionId;
    uniquePart.partNumber = parts[0].partNumber;
    uniquePart.partDescription = parts[0].description;
    uniquePart.currencyDescription = parts[0].currencyDescription;
    uniquePart.currencyId = parts[0].currencyId;
    uniquePart.misc = parts[0].misc;
    uniquePart.fixRate = parts[0].fixRate;
    uniquePart.freight = parts[0].freight;
    uniquePart.uom = parts[0].uom;
    uniquePart.customerRef = parts[0].customerRef;
    uniquePart.pmaStatus = parts[0].pmaStatus;
    uniquePart.marginPercentageExtended = (uniquePart.marginPercentageExtended) / parts.length;
    return uniquePart;
  }

  getSum(num1, num2) {
    return Number(num1) + Number(num2);
  }


  getUniqueParts(myArr, prop1, prop2, prop3) {
    let uniqueParts = JSON.parse(JSON.stringify(myArr));
    // let uniquePartsFiltered = [];
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
    // if (!partFoundWithId) {
    //   this.saveButton = false;
    // }
  }

}
