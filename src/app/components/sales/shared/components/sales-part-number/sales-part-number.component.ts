import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from "@angular/core";
import { ISalesQuote } from "../../../../../models/sales/ISalesQuote.model";
import { IPartJson } from "../../models/ipart-json";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PartDetail } from "../../models/part-detail";
import { SalesQuoteService } from "../../../../../services/salesquote.service";
import { ItemMasterSearchQuery } from "../../../quotes/models/item-master-search-query";
import {
  AlertService,
  MessageSeverity
} from "../../../../../services/alert.service";
import { formatNumberAsGlobalSettingsModule } from "../../../../../generic/autocomplete";
import { ISalesQuoteView } from "../../../../../models/sales/ISalesQuoteView";
import { AuthService } from "../../../../../services/auth.service";
import { CommonService } from "../../../../../services/common.service";
import { ISalesOrderQuotePart } from "../../../../../models/sales/ISalesOrderQuotePart";
declare var $: any;
import { SummaryPart } from "../../../../../models/sales/SummaryPart";
import { StocklineViewComponent } from "../../../../../shared/components/stockline/stockline-view/stockline-view.component";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "app-sales-part-number",
  templateUrl: "./sales-part-number.component.html",
  styleUrls: ["./sales-part-number.component.scss"]
})
export class SalesPartNumberComponent {
  show: boolean;
  selectedSummaryRow: SummaryPart;
  selectedSummaryRowIndex = null;
  addPartModal: NgbModalRef;
  deletePartModal: NgbModalRef;
  salesMarginModal: NgbModalRef;
  modal: NgbModalRef;
  part: PartDetail;
  selectedPart: IPartJson;
  selectedParts: any[] = [];
  summaryParts: any[] = [];
  showPaginator: boolean;
  totalRecords: number;
  pageLinks: any;
  columns: any[];
  auditHistory = [];
  inputValidCheckHeader = false;;
  summaryColumns: any[] = [];
  @ViewChild("addPart", { static: false }) addPart: ElementRef;
  @ViewChild("salesMargin", { static: false }) salesMargin: ElementRef;
  @ViewChild("updateConfirmationModal", { static: false }) public updateConfirmationModal: ElementRef;
  @Input() customer: any;
  @Input() totalFreights = 0;
  @Input() totalCharges = 0;
  @Input() salesQuote: ISalesQuote;
  @Input() isViewMode: Boolean;
  query: ItemMasterSearchQuery;
  @Input() salesQuoteView: ISalesQuoteView;
  @Input() defaultSettingPriority;
  @ViewChild("updatePNDetailsModal", { static: false })
  public updatePNDetailsModal: ElementRef;
  @Output() myEvent = new EventEmitter();
  isEdit: boolean = false;
  isEditMode: boolean = false;
  isQtyAdjust: boolean = false;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output('on-parts-save') onPartsSavedEvent: EventEmitter<ISalesOrderQuotePart[]> = new EventEmitter<ISalesOrderQuotePart[]>();
  @Output('on-create-new-version') createNewVersionEvent: EventEmitter<any[]> = new EventEmitter<any[]>();
  public partSaveConfirmationModal: ElementRef;
  isSuccess: boolean = false;
  defaultCurrencyId: any;
  defaultCurrencyDiscription: any;
  legalEntity: number;
  isSpinnerVisible = false;
  isStockLineViewMode = false;
  clearData = false;
  canSaveParts = false;
  priorities = [];
  saveButton = false;
  isApprovedPartUpdated: boolean = false;
  currentStatusSOQSummary: any = "1";
  selectedMPNItemMasterId: any;
  SummaryMonths: number = 12;
  soqSummaryPNData: any = [];
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private modalService: NgbModal,
    private salesQuoteService: SalesQuoteService,
    private alertService: AlertService,
    private authService: AuthService,
    private commonService: CommonService
  ) {
    this.show = false;
    this.part = new PartDetail();
  }

  ngOnInit() {
    this.salesQuoteService.getSearchPartObject().subscribe(data => {
      this.query = data;
    });
    this.salesQuoteService.getSelectedParts().subscribe(data => {
      if (data) {
        this.selectedParts = data;
      } else {
        this.selectedParts = [];
      }
      this.filterParts();

      this.getDefaultCurrency();
      // this.selectedParts.forEach(x => {
      //   x.markUpPercentage = x.markUpPercentage;
      //   if (x.partDescription) x.description = x.partDescription;
      //   if (x.fxRate != undefined || x.fxRate != null) x.fixRate = x.fxRate;
      //   if (x.qtyQuoted != undefined || x.qtyQuoted != null) x.quantityFromThis = x.qtyQuoted;
      //   if (x.unitSalePrice != undefined || x.unitSalePrice != null) x.salesPricePerUnit = x.unitSalePrice;
      //   if (x.markupExtended != undefined || x.markupExtended != null) x.markupExtended = x.markupExtended;
      //   if (x.discount != undefined || x.discount != null) x.markUpPercentage = x.discount;
      //   if (x.discountAmount != undefined || x.discountAmount != null) x.salesDiscountPerUnit = x.discountAmount;
      //   if (x.netSales != undefined || x.netSales != null) x.netSalesPriceExtended = x.netSales;
      //   if (x.taxCode != undefined || x.taxCode != null) x.taxCode = x.taxCode;
      //   if (x.taxAmount != undefined || x.taxAmount != null) x.taxAmount = x.taxAmount;
      //   if (x.freight != undefined || x.freight != null) x.freight = x.freight;
      //   if (x.misc != undefined || x.misc != null) x.misc = x.misc;
      //   if (x.totalSales != undefined || x.totalSales != null) x.totalSales = x.totalSales;
      //   if (x.unitCost != undefined || x.unitCost != null) x.unitCostPerUnit = x.unitCost;
      //   if (x.unitCostExtended != undefined || x.unitCostExtended != null) x.unitCostExtended = x.unitCostExtended;
      //   if (x.marginAmountExtended != undefined || x.marginAmountExtended != null) x.marginAmountExtended = x.marginAmountExtended;
      //   if (x.marginPercentage != undefined || x.marginPercentage != null) x.marginPercentageExtended = x.marginPercentage
      //   if (x.customerPromiseDate != undefined || x.customerPromiseDate != null) x.customerPromiseDate = new Date(x.customerPromiseDate);
      //   if (x.promisedDate != undefined || x.promisedDate != null) x.promisedDate = new Date(x.promisedDate);
      //   if (x.estimatedShipDate != undefined || x.estimatedShipDate != null) x.estimatedShipDate = new Date(x.estimatedShipDate);
      // })
    });
    this.columns = [];
    this.initColumns();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  onPaging(event) {
  }

  refresh() {
    this.salesQuoteService.getSelectedParts().subscribe(data => {
      if (data) {
        this.selectedParts = data;
      } else {
        this.selectedParts = [];
      }
      this.filterParts();
    });
    this.canSaveParts = true;
    if (this.salesQuote.priorities) {
      let activePriorities = this.salesQuote.priorities.filter(x => x.isActive == true);
      if (activePriorities && activePriorities.length > 0) {
        this.priorities = activePriorities;
      }
    }
    if (this.summaryParts && this.summaryParts.length > 0) {
      this.summaryParts.forEach(summaryPart => {
        if (summaryPart.childParts && summaryPart.childParts.length > 0) {
          summaryPart.childParts.forEach(part => {
            if (part.salesOrderQuotePartId) {
              let priorityExists = this.priorities.find(x => x.priorityId == part.priorityId);
              if (!priorityExists) {
                let inActivePriority = this.salesQuote.priorities.find(x => x.priorityId == part.priorityId);
                if (inActivePriority) {
                  this.priorities.push(inActivePriority);
                }
              }
            }
          });
        }
      })
    }
  }

  getDefaultCurrency() {
    this.legalEntity = 19;
    this.commonService.getDefaultCurrency(this.legalEntity).subscribe(res => {
      this.defaultCurrencyId = res.currencyId;
      this.defaultCurrencyDiscription = res.currencyName;
    }, error => {
      this.isSpinnerVisible = false;
    })
  }

  formatNumber(val, decimalCount) {
    return formatNumberAsGlobalSettingsModule(val, decimalCount)
  }

  initColumns() {
    this.columns = [
      { field: 'partNumber', header: "PN", width: "130px" },
      { field: 'description', header: "PN Description", width: "250px" },
      { field: 'stockLineNumber', header: "Stk Line Num", width: "100px" },
      { field: 'serialNumber', header: "Ser Num", width: "70px" },
      { field: 'conditionDescription', header: "Cond", width: "70px" },
      // { header: "Customer Ref", width: "100px" },
      { field: 'priorityName', header: "Priority", width: "100px" },
      { field: 'openDate', header: "Quote Date", width: "100px" },
      // { header: "UOM", width: "70px" },
      { field: 'qtyAvailable', header: "Qty Req", width: "90px" },
      { field: 'quantityToBeQuoted', header: "Qty to Quote", width: "70px" },
      { field: 'quantityAlreadyQuoted', header: "Qty Prev Quoted", width: "70px" },
      { field: 'customerRequestDate', header: "Cust Request Date", width: "155px" },
      { field: 'promisedDate', header: "Cust Promised Date", width: "155px" },
      { field: 'estimatedShipDate', header: "Est.Ship Date", width: "155px" },
      { field: 'statusName', header: "Status", width: "70px" },
      // { header: "Curr", width: "60px" },
      // { header: "FX Rate", width: "80px" },
      { field: 'unitCostPerUnit', header: "Unit Cost", width: "90px" },
      { field: 'markUpPercentage', header: "MarkUp %", width: "70px" },
      { field: 'markupPerUnit', header: "MarkUp Amt/Unit", width: "110px" },
      { field: 'grossSalePricePerUnit', header: "Gross Price/Unit", width: "110px" },
      { field: 'salesDiscount', header: "Disc. %", width: "60px" },
      { field: 'salesDiscountPerUnit', header: "Disc. Amt/Unit", width: "110px" },
      { field: 'markupExtended', header: "MarkUp Amt", width: "100px" },
      { field: 'grossSalePrice', header: "Gross Sales Amt", width: "110px" },
      { field: 'salesDiscountExtended', header: "Disc. Amt", width: "90px" },
      { field: 'netSalesPriceExtended', header: "Net Sales Amt", width: "100px" },
      // { header: "Misc Amt", width: "90px" },
      // { header: "Freight", width: "90px" },
      { field: 'taxType', header: "Tax Type", width: "90px" },
      { field: 'taxAmount', header: "Tax Amt", width: "90px" },
      { field: 'totalSales', header: "Total", width: "90px" },
      { field: 'unitCostExtended', header: "Ext Cost", width: "100px" },
      { field: 'marginAmountExtended', header: "Product Margin", width: "100px" },
      { field: 'marginPercentageExtended', header: "Product Margin (%)", width: "120px" },
      { field: 'pmaStatus', header: "Stk Type", width: "100px" },
      { field: 'altOrEqType', header: "Alt/Equiv", width: "100px" },
      { field: 'controlNumber', header: "Cntrl Num", width: "80px" },
      { field: 'idNumber', header: "Cntrl ID Num", width: "90px" },
      { field: 'notes', header: "Notes", width: "120px" },
    ];

    this.summaryColumns = [
      // { field: 'count', header: 'Item #', width: '50px', textalign: 'center' },
      { field: 'itemNo', header: 'Line #', width: '42px', textalign: 'center' },
      { field: 'partNumber', header: 'PN', width: "140px" },
      { field: 'partDescription', header: 'PN Description', width: '200px' },
      { field: 'pmaStatus', header: 'Stk Type', width: "70px" },
      { field: 'conditionDescription', header: 'Cond', width: "70px" },
      { field: 'quantityRequested', header: 'Qty Req', width: "53px" },
      { field: 'quantityToBeQuoted', header: 'Qty To Qte', width: "66px" },
      { field: 'quantityAlreadyQuoted', header: 'Qty Prev Qted', width: "82px" },
      { field: 'quantityAvailable', header: 'Qty Avail', width: "58px" },
      { field: 'qtyOnHand', header: 'Qty OH', width: "75px" },
      { field: 'currencyDescription', header: 'Curr', width: "80px" },
      { field: 'fixRate', header: 'FX Rate', width: "80px" },
      { field: 'uom', header: 'UOM', width: "58px" },
      { field: 'customerRef', header: 'Cust Ref', width: "120px" },
      { field: 'grossSalePrice', header: 'Gross Sale Amt', width: "90px" },
      { field: 'salesDiscountExtended', header: 'Disc Amt', width: "90px" },
      { field: 'netSalesPriceExtended', header: 'Net Sale Amt', width: "84px" },
      { field: 'misc', header: 'Misc', width: "79px" },
      { field: 'freight', header: 'Freight', width: "84px" },
      { field: 'taxAmount', header: 'Tax Amt', width: "84px" },
      { field: 'totalSales', header: 'Total', width: "95px" },
      { field: 'unitCostExtended', header: 'Ext. Cost', width: "90px" },
      { field: 'marginAmountExtended', header: 'Prod Margin', width: "103px" },
      { field: 'marginPercentageExtended', header: 'Prod Margin%', width: "102px" }
    ]
    // if (!this.isViewMode) {
    //   // { header: "Notes", width: "100px" },
    //   this.summaryColumns.push({ header: "Actions", width: "100px" });
    // }
  }

  onClose(event) {
    this.show = false;
    this.addPartModal.close();
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
    this.inputValidCheckHeader = false;
    //this.salesQuoteService.getSearchPartResult();
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

  openQtyAdjust(viewMode) {
    this.isStockLineViewMode = viewMode;
    this.clearData = viewMode;
    let contentPart = this.addPart;
    this.isEditMode = false;
    this.isQtyAdjust = true;
    this.addPartModal = this.modalService.open(contentPart, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
  }

  onSave(selectedParts) {
    this.salesQuoteService.selectedParts = selectedParts;
    this.refresh();
    this.canSaveParts = false;
    this.addPartModal.close();
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
    this.openPartNumber(true, false);
    this.isEditMode = false;
  }

  openPartNumber(viewMode, close) {
    this.isStockLineViewMode = viewMode;
    let contentPart = this.addPart;
    if (close)
      this.isEditMode = false;
    else
      this.isEditMode = true;
    this.isQtyAdjust = false;
    this.addPartModal = this.modalService.open(contentPart, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
  }

  openPartNumberClear(viewMode) {
    this.clearData = viewMode;
    let contentPart = this.addPart;
    this.addPartModal = this.modalService.open(contentPart, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
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
          this.part.freight = this.salesQuoteService.getTotalFreights();
          this.part.misc = this.salesQuoteService.getTotalCharges();
          this.part.createdBy = this.userName;
          this.part.priorityId = this.defaultSettingPriority;
          // if (this.selectedPart.itemMasterSale) {
          //   this.part.fixRate = this.selectedPart.itemMasterSale.fxRate;
          // }
          this.part.fixRate = this.selectedPart.fixRate;
          this.part.taxType = this.customer.taxType;
          this.part.taxPercentage = this.customer.taxPercentage;
          if (this.selectedPart.mappingType == 1) {
            this.part.altOrEqType = "Alt";
          } else if (this.selectedPart.mappingType == 2) {
            this.part.altOrEqType = "Equi";
          } else {
            this.part.altOrEqType = "";
          }
          this.part.description = this.selectedPart.description;
          this.part.itemMasterId = this.selectedPart.itemMasterId;
          this.part.partId = this.selectedPart.partId;
          this.part.stockLineId = this.selectedPart.stockLineId;
          this.part.idNumber = this.selectedPart.idNumber;
          this.part.customerRef = this.salesQuote.customerReferenceName;
          this.part.serialNumber = this.selectedPart.serialNumber;
          this.part.qtyAvailable = this.selectedPart.qtyAvailable;
          this.part.quantityOnHand = this.selectedPart.qtyOnHand; //this.selectedPart.quantityOnHand;
          // if (this.selectedPart.itemClassification) {
          //   this.part.masterCompanyId = this.selectedPart.itemClassification.masterCompanyId;
          // } else {
          //   this.part.masterCompanyId = this.salesQuote.masterCompanyId;
          // }
          this.part.masterCompanyId = this.masterCompanyId;
          this.part.conditionId = this.selectedPart.conditionId;
          this.part.conditionDescription = this.selectedPart.conditionDescription;
          this.part.uomName = this.selectedPart.uomDescription;
          this.part.pmaStatus = this.selectedPart.oempmader;
          if (!this.part.pmaStatus) {
            this.part.pmaStatus = this.selectedPart['stockType'];
          }
          this.part.currencyId = this.selectedPart.currencyId;
          this.part.currencyDescription = this.defaultCurrencyDiscription;
          this.part.currencyId = this.defaultCurrencyId;
          this.part.controlNumber = this.selectedPart.controlNumber;
          this.part.salesDiscount = 0;
          this.part.markupPerUnit = 0;
          this.part.markUpPercentage = 0;
          this.part.salesDiscount = 0;
          this.part.grossSalePricePerUnit = 0;
          this.part.grossSalePrice = 0;
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
    if (event.isApproved == true) {
      this.isApprovedPartUpdated = true;
    }
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
      const partsList = this.selectedParts;
      partsList.push(partObj);
      this.salesQuoteService.selectedParts = partsList;
    }
    this.filterParts();
    this.salesMarginModal.close();
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
    this.part = part;
    this.deletePartModal = this.modalService.open(contentPartDelete, { size: "sm", backdrop: 'static', keyboard: false });
  }

  deletePart(): void {
    if (this.part.salesOrderQuotePartId) {
      this.salesQuoteService.deletePart(this.part.salesOrderQuotePartId).subscribe(response => {
        this.removePartNamber(this.part);
        this.deletePartModal.close();
        this.alertService.showMessage(
          "Success",
          `Part removed successfully.`,
          MessageSeverity.success
        );
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

  onCustomerDateChange(stockIndex, rowIndex) {
    let requestDate = this.summaryParts[rowIndex].childParts[stockIndex].customerRequestDate;
    this.summaryParts[rowIndex].childParts[stockIndex].promisedDate = requestDate;
    this.summaryParts[rowIndex].childParts[stockIndex].estimatedShipDate = requestDate;
    this.combineParts(this.summaryParts);
    this.canSaveParts = false;
  }

  onEditPartDetails() {
    this.combineParts(this.summaryParts);
    this.canSaveParts = false;
  }

  checkUpdateOrsaveButton() {
    let partFoundWithId = false;
    if (this.summaryParts && this.summaryParts.length > 0) {
      this.summaryParts.forEach(summaryPart => {
        if (summaryPart.childParts && summaryPart.childParts.length > 0) {
          summaryPart.childParts.forEach(part => {
            if (part.salesOrderQuotePartId && !partFoundWithId) {
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

  checkIfApprovedPartUpdated() {
    if (this.isApprovedPartUpdated) {
      this.modal = this.modalService.open(this.updateConfirmationModal, { size: "sm" });
    }
    else {
      this.approve();
    }
  }

  enableUpdateButton: boolean = false;

  approve() {
    this.enableUpdateButton = true;
    let partList: any = [];
    this.salesQuoteView.parts = [];
    let invalidParts = false;
    let invalidDate = false;
    var errmessage = '';
    for (let i = 0; i < this.selectedParts.length; i++) {
      let selectedPart = this.selectedParts[i];
      let partNameAdded = false;
      if (!selectedPart.customerRequestDate) {
        this.isSpinnerVisible = false;
        invalidParts = true;
        if (!partNameAdded) {
          errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
          partNameAdded = true;
        }
        errmessage = errmessage + '<br />' + "Please enter Customer Request Date."
      }
      if (!selectedPart.estimatedShipDate) {
        this.isSpinnerVisible = false;
        invalidParts = true;
        if (!partNameAdded) {
          errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
          partNameAdded = true;
        }
        errmessage = errmessage + '<br />' + "Please enter Estimated Ship Date."
      }
      if (!selectedPart.promisedDate) {
        this.isSpinnerVisible = false;
        invalidParts = true;
        if (!partNameAdded) {
          errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
          partNameAdded = true;
        }
        errmessage = errmessage + '<br />' + "Please enter Promised Date."
      }
      if (!selectedPart.priorityId) {
        this.isSpinnerVisible = false;
        invalidParts = true;
        if (!partNameAdded) {
          errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
          partNameAdded = true;
        }
        errmessage = errmessage + '<br />' + "Please enter priority ID."
      }
      if (selectedPart.customerRequestDate && selectedPart.promisedDate && selectedPart.estimatedShipDate) {
        let crdate = new Date(Date.UTC(selectedPart.customerRequestDate.getUTCFullYear(), selectedPart.customerRequestDate.getUTCMonth(), selectedPart.customerRequestDate.getUTCDate()));
        let esdate = new Date(Date.UTC(selectedPart.estimatedShipDate.getUTCFullYear(), selectedPart.estimatedShipDate.getUTCMonth(), selectedPart.estimatedShipDate.getUTCDate()));
        let pdate = new Date(Date.UTC(selectedPart.promisedDate.getUTCFullYear(), selectedPart.promisedDate.getUTCMonth(), selectedPart.promisedDate.getUTCDate()));
        let opendate = new Date(Date.UTC(this.salesQuote.openDate.getUTCFullYear(), this.salesQuote.openDate.getUTCMonth(), this.salesQuote.openDate.getUTCDate()));

        if (crdate < opendate || esdate < opendate || pdate < opendate) {
          invalidDate = true;
          if (crdate < opendate) {
            this.isSpinnerVisible = false;
            invalidParts = true;
            if (!partNameAdded) {
              errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
              partNameAdded = true;
            }
            errmessage = errmessage + '<br />' + "Request Date cannot be less than open date."
          }
          if (esdate < opendate) {
            this.isSpinnerVisible = false;
            invalidParts = true;
            if (!partNameAdded) {
              errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
              partNameAdded = true;
            }
            errmessage = errmessage + '<br />' + "Est. Ship Date cannot be less than open date."
          }
          if (pdate < opendate) {
            this.isSpinnerVisible = false;
            invalidParts = true;
            if (!partNameAdded) {
              errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
              partNameAdded = true;
            }
            errmessage = errmessage + '<br />' + "Cust Prmsd Date cannot be less than open date."
          }
        }
      }
      if (!invalidParts && !invalidDate) {
        let partNumberObj = this.salesQuoteService.marshalSOQPartToSave(selectedPart, this.userName);
        this.salesQuoteView.parts.push(partNumberObj);
      }
    }
    if (invalidParts) {
      this.alertService.resetStickyMessage();
      this.alertService.showStickyMessage('Sales Order Quote', errmessage, MessageSeverity.error);
    } else if (invalidDate) {
      this.alertService.resetStickyMessage();
      this.alertService.showStickyMessage('Sales Order Quote', "Please select valid Dates for Sales Order Quote PartsList!", MessageSeverity.error);
    } else {
      this.isSpinnerVisible = true;
      this.salesQuoteService.update(this.salesQuoteView).subscribe(data => {
        this.canSaveParts = true;
        this.alertService.stopLoadingMessage();
        this.isSpinnerVisible = false;
        this.inputValidCheckHeader = true;
        this.isApprovedPartUpdated = false;
        this.alertService.showMessage(
          "Success",
          `PN updated successfully.`,
          MessageSeverity.success
        );
        this.onPartsSavedEvent.emit(this.selectedParts);
      }, error => {
        this.isSpinnerVisible = false;
      });
    }
    this.closeConfirmationModal();
  }

  onClosePart(event) {
  }

  notesIndex;
  notesSummaryRowIndex;

  onAddTextAreaInfo(material, index, summaryIndex) {
    this.notesIndex = index;
    this.notesSummaryRowIndex = summaryIndex;
    this.textAreaInfo = material.notes;
  }

  textAreaInfo: any;

  onSaveTextAreaInfo(notes) {
    if (notes) {
      this.textAreaInfo = notes;
      this.summaryParts[this.notesSummaryRowIndex].childParts[this.notesIndex].notes = this.textAreaInfo;
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
      uniquePart.quantityAvailable = this.getSum(uniquePart.quantityAvailable ? uniquePart.quantityAvailable : 0, part.qtyAvailable);
      uniquePart.qtyOnHand = this.getSum(uniquePart.qtyOnHand ? uniquePart.qtyOnHand : 0, part.quantityOnHand);
      uniquePart.grossSalePrice = this.getSum(uniquePart.grossSalePrice, part.grossSalePrice);
      uniquePart.salesDiscountExtended = this.getSum(uniquePart.salesDiscountExtended, part.salesDiscountExtended);
      uniquePart.netSalesPriceExtended = this.getSum(uniquePart.netSalesPriceExtended, part.netSalesPriceExtended);
      uniquePart.taxAmount = this.getSum(uniquePart.taxAmount, part.taxAmount);
      uniquePart.totalSales = this.getSum(uniquePart.totalSales, part.totalSales);
      uniquePart.marginAmountExtended = this.getSum(uniquePart.marginAmountExtended, part.marginAmountExtended);
      uniquePart.marginPercentageExtended = this.getSum(uniquePart.marginPercentageExtended, part.marginPercentageExtended);
      uniquePart.unitCostExtended = this.getSum(uniquePart.unitCostExtended, part.unitCostExtended);
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
    uniquePart.uom = parts[0].uomName;
    uniquePart.methodType = parts[0].methodType;
    uniquePart.customerRef = parts[0].customerRef;
    uniquePart.pmaStatus = parts[0].pmaStatus;
    uniquePart.conditionId = parts[0].conditionId;
    uniquePart.marginPercentageExtended = (uniquePart.marginPercentageExtended) / parts.length;
    uniquePart.itemNo = parts[0].itemNo;
    uniquePart.qtyAvailable = parts[0].qtyAvailable;
    uniquePart.quantityOnHand = parts[0].quantityOnHand;
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

  closeHistoryModal() {
    $("#soqPartHistory").modal("hide");
  }

  getAuditHistoryById(rowData) {
    this.isSpinnerVisible = true;
    this.salesQuoteService.getSOQPartHistory(rowData.salesOrderQuotePartId).subscribe(res => {
      this.auditHistory = res;
      this.isSpinnerVisible = false;
    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  getColorCodeForHistory(i, field, value) {
    const data = this.auditHistory;
    const dataLength = data.length;
    if (i >= 0 && i <= dataLength) {
      if ((i + 1) === dataLength) {
        return true;
      } else {
        return data[i + 1][field] === value
      }
    }
  }

  checkToHide(i) {
    return !this.summaryParts[i].hidePart;
  }

  viewStockSelectedRow(rowData) {
    this.modal = this.modalService.open(StocklineViewComponent, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
    this.modal.componentInstance.stockLineId = rowData.stockLineId;
  }

  deletedata: number[] = [];
  deleteAllPartModal: NgbModalRef;

  openmultiplepartDelete(summarypart, index, deletepartcontent) {
    this.selectedSummaryRow = summarypart;
    this.deletedata = [];
    for (let i = 0; i < summarypart.childParts.length; i++) {
      if (this.selectedSummaryRow.childParts[i].salesOrderQuotePartId) {
        this.deletedata.push(this.selectedSummaryRow.childParts[i].salesOrderQuotePartId);
      }
    }
    this.deleteAllPartModal = this.modalService.open(deletepartcontent, { size: "sm", backdrop: 'static', keyboard: false });
  }

  deleteMultiplePart(): void {
    if (this.deletedata.length > 0) {
      let data = { "salesOrderQuotePartIds": this.deletedata }
      this.salesQuoteService.deleteMultiplePart(data).subscribe(response => {
        for (let i = 0; i < this.selectedSummaryRow.childParts.length; i++) {
          this.removePartNamber(this.selectedSummaryRow.childParts[i]);
        }
        this.deleteAllPartModal.close();
        this.alertService.showMessage(
          "Success",
          `Part removed successfully.`,
          MessageSeverity.success
        );
      }, error => {
        this.isSpinnerVisible = false;
      });
    } else {
      for (let i = 0; i < this.selectedSummaryRow.childParts.length; i++) {
        this.removePartNamber(this.selectedSummaryRow.childParts[i]);
      }
      //this.removePartNamber(this.part);
      this.deleteAllPartModal.close();
      this.alertService.showMessage(
        "Success",
        `Part removed successfully.`,
        MessageSeverity.success
      );
    }
  }

  createNewSalesOrderQuoteVersion() {
    let updatedParts = [];
    let invalidParts = false;
    let invalidDate = false;
    var errmessage = '';
    for (let i = 0; i < this.selectedParts.length; i++) {
      let selectedPart = this.selectedParts[i];
      let partNameAdded = false;
      if (!selectedPart.customerRequestDate) {
        this.isSpinnerVisible = false;
        invalidParts = true;
        if (!partNameAdded) {
          errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
          partNameAdded = true;
        }
        errmessage = errmessage + '<br />' + "Please enter Customer Request Date."
      }
      if (!selectedPart.estimatedShipDate) {
        this.isSpinnerVisible = false;
        invalidParts = true;
        if (!partNameAdded) {
          errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
          partNameAdded = true;
        }
        errmessage = errmessage + '<br />' + "Please enter Estimated Ship Date."
      }
      if (!selectedPart.promisedDate) {
        this.isSpinnerVisible = false;
        invalidParts = true;
        if (!partNameAdded) {
          errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
          partNameAdded = true;
        }
        errmessage = errmessage + '<br />' + "Please enter Promised Date."
      }
      if (!selectedPart.priorityId) {
        this.isSpinnerVisible = false;
        invalidParts = true;
        if (!partNameAdded) {
          errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
          partNameAdded = true;
        }
        errmessage = errmessage + '<br />' + "Please enter priority ID."
      }
      if (selectedPart.customerRequestDate && selectedPart.promisedDate && selectedPart.estimatedShipDate) {
        let crdate = new Date(Date.UTC(selectedPart.customerRequestDate.getUTCFullYear(), selectedPart.customerRequestDate.getUTCMonth(), selectedPart.customerRequestDate.getUTCDate()));
        let esdate = new Date(Date.UTC(selectedPart.estimatedShipDate.getUTCFullYear(), selectedPart.estimatedShipDate.getUTCMonth(), selectedPart.estimatedShipDate.getUTCDate()));
        let pdate = new Date(Date.UTC(selectedPart.promisedDate.getUTCFullYear(), selectedPart.promisedDate.getUTCMonth(), selectedPart.promisedDate.getUTCDate()));
        let opendate = new Date(Date.UTC(this.salesQuote.openDate.getUTCFullYear(), this.salesQuote.openDate.getUTCMonth(), this.salesQuote.openDate.getUTCDate()));

        if (crdate < opendate || esdate < opendate || pdate < opendate) {
          invalidDate = true;
          if (crdate < opendate) {
            this.isSpinnerVisible = false;
            invalidParts = true;
            if (!partNameAdded) {
              errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
              partNameAdded = true;
            }
            errmessage = errmessage + '<br />' + "Request Date cannot be less than open date."
          }
          if (esdate < opendate) {
            this.isSpinnerVisible = false;
            invalidParts = true;
            if (!partNameAdded) {
              errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
              partNameAdded = true;
            }
            errmessage = errmessage + '<br />' + "Est. Ship Date cannot be less than open date."
          }
          if (pdate < opendate) {
            this.isSpinnerVisible = false;
            invalidParts = true;
            if (!partNameAdded) {
              errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
              partNameAdded = true;
            }
            errmessage = errmessage + '<br />' + "Cust Prmsd Date cannot be less than open date."
          }
        }
      }
      if (!invalidParts && !invalidDate) {
        let partNumberObj = this.salesQuoteService.marshalSOQPartToSave(selectedPart, this.userName);
        updatedParts.push(partNumberObj);
      }
    }

    this.createNewVersionEvent.emit(updatedParts);
    this.closeConfirmationModal();
  }

  onCloseParMultipletDelete() {
    this.deleteAllPartModal.close();
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

  openSOQSummary(content, salesOrderQuotePartNumber) {
    this.selectedMPNItemMasterId = salesOrderQuotePartNumber.partId;
    this.getSOQSummaryDetails(this.SummaryMonths)
    this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, windowClass: 'assetMange' });
  }

  getSOQSummaryDetails(monthtatus) {
    if (this.selectedMPNItemMasterId > 0) {
      this.isSpinnerVisible = true;
      this.salesQuoteService.getSalesOrderQuoteSummarisedHistoryByPN(this.selectedMPNItemMasterId, monthtatus == 1 || monthtatus == "1" ? true : false).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
        this.isSpinnerVisible = false;
        if (res != undefined && res.mpnSummaryModel != undefined) {
          this.soqSummaryPNData = res.mpnSummaryModel;
        }
        if (res != undefined && res.custSummaryModel != undefined) {
          this.soqSummaryPNData = res.custSummaryModel;
        }
      }, err => {
        this.isSpinnerVisible = false;
      });
    }
  }

  dismissModel() {
    this.modal.close();
  }
}