import { Component, OnInit,Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { ExchangequoteService } from "../../../../../services/exchangequote.service";
declare var $: any;
import { SummaryPart } from "../../../../../models/exchange/SummaryPart";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IPartJson } from "../models/ipart-json";
import { IExchangeQuote } from "../../../../../models/exchange/IExchangeQuote.model";
import { PartDetail } from "../models/part-detail";
import { AuthService } from "../../../../../services/auth.service";
import { ItemMasterSearchQuery } from "../../../models/item-master-search-query";
import { IExchangeQuotePart } from "../../../../../models/exchange/IExchangeQuotePart";
import { IExchangeQuoteView } from "../../../../../models/exchange/IExchangeQuoteView";
import {
  AlertService,
  DialogType,
  MessageSeverity
} from "../../../../../services/alert.service";
@Component({
  selector: 'app-exchange-quote-part-number',
  templateUrl: './exchange-quote-part-number.component.html',
  styleUrls: ['./exchange-quote-part-number.component.scss']
})
export class ExchangeQuotePartNumberComponent {
  @Input() isViewMode: Boolean;
  @Input() customer: any;
  @ViewChild("addPart", { static: false }) addPart: ElementRef;
  selectedSummaryRow: SummaryPart;
  selectedSummaryRowIndex = null;
  isStockLineViewMode = false;
  addPartModal: NgbModalRef;
  deletePartModal: NgbModalRef;
  salesMarginModal: NgbModalRef;
  partActionModal: NgbModalRef;
  isSpinnerVisible = false;
  saveButton = false;
  canSaveParts = false;
  inputValidCheckHeader: any;
  selectedPart: IPartJson;
  selectedParts: any[] = [];
  summaryParts: any[] = [];
  @Input() totalFreights = 0;
  @Input() totalCharges = 0;
  @Input() exchangeQuote: IExchangeQuote;
  @Input() employeesList: any = [];
  part: PartDetail;
  show: boolean;
  isEdit: boolean = false;
  @ViewChild("salesMargin", { static: false }) salesMargin: ElementRef;
  query: ItemMasterSearchQuery;
  @Output('on-parts-save') onPartsSavedEvent: EventEmitter<IExchangeQuotePart[]> = new EventEmitter<IExchangeQuotePart[]>();
  @Input() exchangeQuoteView: IExchangeQuoteView;
  totalRecords: number;
  pageLinks: any;
  @Input() exchangeQuoteId: any;
  summaryColumns: any[] = [];
  IsRestrictOnePN:boolean=false;
  constructor(private exchangequoteService: ExchangequoteService,
    private authService: AuthService,
    private modalService: NgbModal,
    private alertService: AlertService,) {
      this.show = false;
      this.part = new PartDetail();
     }

  ngOnInit() {
    this.initColumns();
  }

  initColumns() {
    this.summaryColumns = [
      { field: 'partNumber', header: 'PN',  width: "140px" },
      { field: 'partDescription', header: 'PN Description', width: '200px' },
      // { field: 'pmaStatus', header: 'Stk Type', width: "70px" },
      // { field: 'conditionDescription', header: 'Cond', width: "70px" },
      // { field: 'quantityRequested', header: 'Qty Req', width: "60px" },
      // { field: 'quantityToBeQuoted', header: 'Qty To Quote', width: "84px" },
      // { field: 'quantityAlreadyQuoted', header: 'Qty Prev Qted', width: "84px" },
      // { field: 'quantityAvailable', header: 'Qty Avail', width: "75px" },
      // { field: 'quantityOnHand', header: 'Qty on Hand', width: "75px" },
      // { field: 'currencyDescription', header: 'Curr', width: "80px" },
      // { field: 'fixRate', header: 'FX Rate', width: "80px" },
      // { field: 'uom', header: 'UOM', width: "58px" },
      // { field: 'customerRef', header: 'Cust Ref', width: "120px" },
      // { field: 'grossSalePrice', header: 'Gross Sale Amt', width: "90px" },
      // { field: 'salesDiscountExtended', header: 'Disc Amt', width: "90px" },
      // { field: 'netSalesPriceExtended', header: 'Net Sale Amt', width: "84px" },
      // { field: 'misc', header: 'Misc', width: "79px" },
      // { field: 'freight', header: 'Freight', width: "84px" },
      // { field: 'taxAmount', header: 'Tax Amt', width: "84px" },
      // { field: 'totalSales', header: 'Total', width: "95px" },
      // { field: 'unitCostExtended', header: 'Extended Cost', width: "90px" },
      // { field: 'marginAmountExtended', header: 'Prod Margin', width: "103px" },
      // { field: 'marginPercentageExtended', header: 'Prod Margin%', width: "102px" }
    ]
    // if (!this.isViewMode) {
    //   // { header: "Notes", width: "100px" },
    //   this.summaryColumns.push({ header: "Actions", width: "100px" });
    // }
  }

  refresh() {
    this.exchangequoteService.getSelectedParts().subscribe(data => {
      if (data) {
        this.selectedParts = data;
      } else {
        this.selectedParts = [];
      }
      this.filterParts();
    });
    this.canSaveParts = true;
  }

  addPartNumber(summaryRow: any = '', rowIndex = null) {
    this.exchangequoteService.resetSearchPart();
    if (summaryRow) {
      this.selectedSummaryRow = summaryRow;
      this.selectedSummaryRowIndex = rowIndex;
    } else {
      this.selectedSummaryRow = null;
      this.selectedSummaryRowIndex = null;
    }
    this.openPartNumber(false);
  }

  openPartNumber(viewMode) {
    this.isStockLineViewMode = viewMode;
    let contentPart = this.addPart;
    this.addPartModal = this.modalService.open(contentPart, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
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

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
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
        this.exchangequoteService.getSearchPartObject().subscribe(data => {
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
          this.part.statusId = this.exchangeQuote.statusId;
          this.part.exchangeCorePrice = this.selectedPart.exchangeCorePrice;
          this.part.exchangeListPrice = this.selectedPart.exchangeListPrice;
          this.part.exchangeOverhaulPrice = this.selectedPart.exchangeOverhaulPrice;
          this.part.exchangeOutrightPrice = this.selectedPart.exchangeOutrightPrice;
          this.part.exchangeOverhaulCost = this.selectedPart.exchangeOverhaulCost;
          this.part.exchangeCurrencyId = this.selectedPart.exchangeCurrencyId;
          this.part.loanCurrencyId = this.selectedPart.loanCurrencyId;
          this.part.entryDate = this.exchangeQuote.openDate;
          this.part.billingStartDate = new Date();
          this.part.coreDueDate = new Date();
          //this.part.exchangeQuoteScheduleBilling.cogs = this.exchangeQuote.cogs;
          this.part.cogs = this.exchangeQuote.cogs;
          this.part.daysForCoreReturn = this.exchangeQuote.daysForCoreReturn;
          //this.part.freight = this.salesOrderService.getTotalFreights();
          //this.part.misc = this.salesOrderService.getTotalCharges();
          //this.part.priorityId = this.defaultSettingPriority;
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
          //this.part.currencyId = this.defaultCurrencyId;
          //this.part.currencyDescription = this.defaultCurrencyDiscription;
          this.part.exchangeQuoteNumber = this.exchangeQuote.exchangeQuoteNumber;
          this.part.quoteVesrion = this.exchangeQuote.versionNumber;
          this.part.customerRef = this.exchangeQuote.customerReference;
          this.part.serialNumber = this.selectedPart.serialNumber;
          this.part.uom = this.selectedPart.uomDescription;
          this.part.pmaStatus = this.selectedPart.oempmader;
          if (!this.part.pmaStatus) {
            this.part.pmaStatus = this.selectedPart['stockType'];
          }
          this.part.controlNumber = this.selectedPart.controlNumber;
          if (this.exchangeQuote.exchangeQuoteNumber) {
            this.part.quoteDate = this.exchangeQuote.openDate;
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

  onCloseMargin(event) {
    this.show = false;
    this.salesMarginModal.close();
    if (!this.isEdit) {
      this.selectedPart.selected = false;
      this.openPartNumber(false);
    }
  }

  openSalesMarginSave(event) {
    console.log("event_summary", event);
    console.log('part_summary', this.part);
    // if(!this.checkForDuplicates(event)){
    this.exchangequoteService.getSearchPartObject().subscribe(data => {
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
    this.exchangequoteService.updateSearchPartObject(this.query);
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
      //this.openPartNumber(false);
      const partsList = this.selectedParts;
      partsList.push(partObj);
      this.exchangequoteService.selectedParts = partsList;
      console.log("margin_summaryParts",this.summaryParts);
    }
    this.filterParts();
    this.salesMarginModal.close();
    this.canSaveParts = false;
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
      console.log("filterParts_summaryParts",this.summaryParts);
      if(this.summaryParts.length > 0)
      {
        this.IsRestrictOnePN = true;
      }
    }

    //console.log("summaryParts" , this.summaryParts);
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
    uniquePart.conditionId = parts[0].conditionId;
    uniquePart.marginPercentageExtended = (uniquePart.marginPercentageExtended) / parts.length;
    uniquePart.itemNo = parts[0].itemNo;
    uniquePart.quantityAvailable = parts[0].qtyAvailable;
    uniquePart.quantityOnHand = parts[0].qtyOnHand;
    this.countItemNo = parts[0].itemNo;
    return uniquePart;
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

  getSum(num1, num2) {
    return Number(num1) + Number(num2);
  }
  enableUpdateButton: boolean = false;
  approve() {
    console.log("selectedParts",this.selectedParts);
    this.enableUpdateButton = true;
    let partList: any = [];
    this.exchangeQuoteView.parts = [];
    let invalidParts = false;
    let invalidDate = false;
    var errmessage = '';
    for (let i = 0; i < this.selectedParts.length; i++) {
      let selectedPart = this.selectedParts[i];
      let partNameAdded = false;
      //if (!invalidParts && !invalidDate) {
        let partNumberObj = this.exchangequoteService.marshalExchangeQuotePartToSave(selectedPart, this.userName);
        this.exchangeQuoteView.parts.push(partNumberObj);
        console.log("this.exchangeQuoteView.parts" , this.exchangeQuoteView.parts);
      //}
    }
    this.isSpinnerVisible = true;
    this.exchangequoteService.update(this.exchangeQuoteView).subscribe(data => {
      this.canSaveParts = true;
      this.alertService.stopLoadingMessage();
      this.isSpinnerVisible = false;
      this.inputValidCheckHeader = true;
      this.alertService.showMessage(
        "Success",
        `PN  updated successfully.`,
        MessageSeverity.success
      );
      this.onPartsSavedEvent.emit(this.selectedParts);
    }, error => {
      this.isSpinnerVisible = false;
      const errorLog = error;
      //this.onDataLoadFailed(errorLog)
    });
  }

  checkUpdateOrsaveButton() {
    let partFoundWithId = false;
    if (this.summaryParts && this.summaryParts.length > 0) {
      this.summaryParts.forEach(summaryPart => {
        if (summaryPart.childParts && summaryPart.childParts.length > 0) {
          summaryPart.childParts.forEach(part => {
            if (part.exchangeQuotePartId && !partFoundWithId) {
              partFoundWithId = true;
              this.saveButton = true;
            }
          });
        }
      })
    }
  }

  isEditDisabled(quote: IExchangeQuote, part: any): boolean {
    if (part.createdBy && part.createdBy == this.userName) {
      return ((quote.isApproved || part.isApproved) && part.methodType != "S")
    } else {
      return true;
    }
  }

  openPartToEdit(part) {
    debugger;
    this.isEdit = true;
    let contentPartEdit = this.salesMargin;
    this.part = part;
    if (this.part) {
      this.exchangequoteService.getSearchPartObject().subscribe(data => {
        this.query = data;
        this.part = part;
        // this.query.partSearchParamters.quantityRequested = this.part.quantityRequested;
        // this.query.partSearchParamters.quantityToQuote = this.part.quantityToBeQuoted;
        // this.query.partSearchParamters.quantityAlreadyQuoted = this.part.quantityAlreadyQuoted;
      });
      this.salesMarginModal = this.modalService.open(contentPartEdit, { size: "lg", backdrop: 'static', keyboard: false });
    }
  }
}
