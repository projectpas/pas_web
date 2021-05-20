import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ISpeedQuote } from "../../../../../../models/sales/ISpeedQuote.model";
import { IPartJson } from "../../models/ipart-json";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PartDetail } from "../../models/part-detail";
import { SalesQuoteService } from "../../../../../../services/salesquote.service";
import { ItemMasterSearchQuery } from "../../../../quotes/models/item-master-search-query";
import {
  AlertService,
  DialogType,
  MessageSeverity
} from "../../../../../../services/alert.service";
import { formatNumberAsGlobalSettingsModule } from "../../../../../../generic/autocomplete";
import { ISalesQuoteView } from "../../../../../../models/sales/ISalesQuoteView";
import { AuthService } from "../../../../../../services/auth.service";
import { CommonService } from "../../../../../../services/common.service";
import { ISalesOrderQuotePart } from "../../../../../../models/sales/ISalesOrderQuotePart";
declare var $: any;
import { SummaryPart } from "../../../../../../models/sales/SummaryPart";
import { StocklineViewComponent } from "../../../../../../shared/components/stockline/stockline-view/stockline-view.component";
import { SpeedQuoteService } from "../../../../../../services/speedquote.service";
@Component({
  selector: 'app-speed-quote-part-number',
  templateUrl: './speed-quote-part-number.component.html',
  styleUrls: ['./speed-quote-part-number.component.scss']
})
export class SpeedQuotePartNumberComponent {
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
  @Input() customer: any;
  @Input() totalFreights = 0;
  @Input() totalCharges = 0;
  @Input() salesQuote: ISpeedQuote;
  @Input() isViewMode: Boolean;
  query: ItemMasterSearchQuery;
  @Input() salesQuoteView: ISalesQuoteView;
  @Input() defaultSettingPriority;
  @ViewChild("updatePNDetailsModal", { static: false })
  public updatePNDetailsModal: ElementRef;
  @Output() myEvent = new EventEmitter();
  isEdit: boolean = false;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output('on-parts-save') onPartsSavedEvent: EventEmitter<ISalesOrderQuotePart[]> = new EventEmitter<ISalesOrderQuotePart[]>();
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
  constructor(private modalService: NgbModal,
    //private salesQuoteService: SalesQuoteService,
    private alertService: AlertService,
    private authService: AuthService,
    private commonService: CommonService,
    private speedQuoteService: SpeedQuoteService,) {
    this.show = false;
    this.part = new PartDetail();
  }

  ngOnInit() {
  }

  addPartNumber(summaryRow: any = '', rowIndex = null) {
    this.speedQuoteService.resetSearchPart();
    this.inputValidCheckHeader = false;
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
  openPartNumber(viewMode) {
    this.isStockLineViewMode = viewMode;
    let contentPart = this.addPart;
    this.addPartModal = this.modalService.open(contentPart, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
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
        this.speedQuoteService.getSearchPartObject().subscribe(data => {
          this.query = data;
          this.part = new PartDetail();

          this.part.partNumber = this.selectedPart.partNumber;
          this.part.stockLineNumber = this.selectedPart.stockLineNumber;
          this.part.salesPricePerUnit = +this.selectedPart.unitSalePrice;
          this.part.unitCostPerUnit = +this.selectedPart.unitCost;
          this.part.itemClassification = this.selectedPart.itemClassification;
          //this.part.freight = this.speedQuoteService.getTotalFreights();
          //this.part.misc = this.speedQuoteService.getTotalCharges();
          this.part.createdBy = this.userName;
          this.part.priorityId = this.defaultSettingPriority;
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
          this.part.description = this.selectedPart.description;
          this.part.itemMasterId = this.selectedPart.itemMasterId;
          this.part.partId = this.selectedPart.partId;
          this.part.stockLineId = this.selectedPart.stockLineId;
          this.part.idNumber = this.selectedPart.idNumber;
          this.part.customerRef = this.salesQuote.customerReferenceName;
          this.part.serialNumber = this.selectedPart.serialNumber;
          this.part.qtyAvailable = this.selectedPart.qtyAvailable;
          this.part.quantityOnHand = this.selectedPart.quantityOnHand;
          // if (this.selectedPart.itemClassification) {
          //   this.part.masterCompanyId = this.selectedPart.itemClassification.masterCompanyId;
          // } else {
          //   this.part.masterCompanyId = this.salesQuote.masterCompanyId;
          // }
          this.part.masterCompanyId = this.masterCompanyId;
          this.part.conditionId = this.selectedPart.conditionId;
          this.part.conditionDescription = this.selectedPart.conditionDescription;
          this.part.uom = this.selectedPart.uomDescription;
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
        //this.removePartNamber(this.selectedPart);
      }
    }
  }

  openSalesMarginSave(event) {
    // if(!this.checkForDuplicates(event)){
    this.speedQuoteService.getSearchPartObject().subscribe(data => {
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
    //this.part.itemNo = this.countItemNo + 1;
    this.speedQuoteService.updateSearchPartObject(this.query);
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
      const partsList = this.selectedParts;
      partsList.push(partObj);
      this.speedQuoteService.selectedParts = partsList;
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
    }
    this.totalRecords = this.summaryParts.length;
    this.pageLinks = Math.ceil(
      this.totalRecords / 10
    );
    this.checkUpdateOrsaveButton();
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
  countItemNo: number = 0;
  calculateSummarizedRow(parts: PartDetail[], uniquePart) {
    uniquePart = new SummaryPart();
    parts.forEach(part => {
      uniquePart.quantityToBeQuoted = this.getSum(uniquePart.quantityToBeQuoted, part.quantityFromThis);
      uniquePart.quantityAlreadyQuoted = uniquePart.quantityToBeQuoted;
      uniquePart.qtyAvailable = this.getSum(uniquePart.qtyAvailable, part.qtyAvailable);
      uniquePart.qtyOnHand = this.getSum(uniquePart.qtyOnHand ? uniquePart.qtyOnHand : 0, part.quantityOnHand);
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
    uniquePart.quantityOnHand = parts[0].quantityOnHand;
    this.countItemNo = parts[0].itemNo;
    return uniquePart;
  }
  getSum(num1, num2) {
    return Number(num1) + Number(num2);
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
  }
  onCloseMargin(event) {
    this.show = false;
    this.salesMarginModal.close();
    if (!this.isEdit) {
      this.selectedPart.selected = false;
      this.openPartNumber(false);
    }
  }
}