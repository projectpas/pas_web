import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ItemMasterSearchQuery } from "../../../../models/item-master-search-query";
import { ItemSearchType } from "../../../../models/item-search-type";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ItemMasterService } from "../../../../../../../services/itemMaster.service";
import { StocklineService } from "../../../../../../../services/stockline.service";
import { SalesQuoteService } from "../../../../../../../services/salesquote.service";
import { ConditionService } from '../../../../../../../services/condition.service';
import { ISpeedQuote } from "../../../../../../../models/sales/ISpeedQuote.model";
import { PartSearchParamters } from "../../../../models/part-search-parameters";
import { IMultiPartJson } from "../../../models/imulti-part-json";
import { Router } from "@angular/router";
import { formatStringToNumber } from "../../../../../../../generic/autocomplete";
import { SpeedQuoteSummaryPart } from "../../../../../../../models/sales/SpeedQuoteSummaryPart";
import { AlertService, MessageSeverity } from "../../../../../../../services/alert.service";
import { Subscription } from 'rxjs';
import { AuthService } from "../../../../../../../services/auth.service";
import { SpeedQuoteService } from "../../../../../../../services/speedquote.service";
@Component({
  selector: 'app-speed-quote-part-number-filter',
  templateUrl: './speed-quote-part-number-filter.component.html',
  styleUrls: ['./speed-quote-part-number-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpeedQuotePartNumberFilterComponent implements OnInit {
  @Input() customer: any;
  @Input() salesQuote: ISpeedQuote;
  @Input() allConditionInfo: any;
  @Input() parts: any = [];
  @Input() isStockLineViewMode = false;
  @Input() clearData = false;
  @Input() selectedParts: any = [];
  @Input() selectedSummaryRow: SpeedQuoteSummaryPart;
  @Input() type: string;
  @Output() onPartSearch: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSearchTypeChange: EventEmitter<ItemSearchType> = new EventEmitter<ItemSearchType>();
  @ViewChild("searchMultiPart", { static: false }) searchMultiPart: ElementRef;
  query: ItemMasterSearchQuery;
  partDetails: any[];
  partDetailsList = [];
  partDetail: any;
  searchDisabled: boolean;
  historicalDisabled: boolean;
  displayPartError: boolean = false;
  enableMultiSearch: boolean = false;
  errorMessages: any[] = [];
  multiPartModal: NgbModalRef;
  multiPartNumbers = "";
  multiSearchResult: IMultiPartJson[] = [];
  isSpinnerVisible: boolean = false;
  columns: any[];
  partEditDisable = false;
  salesMargin: any;
  showPaginator: any;
  pageLinks: any;
  subscription: Subscription;
  constructor(private modalService: NgbModal,
    private itemMasterService: ItemMasterService,
    private stockLineService: StocklineService,
    private salesQuoteService: SalesQuoteService,
    private router: Router,
    private alertService: AlertService,
    public conditionService: ConditionService,
    private changeDetector: ChangeDetectorRef,
    private authService: AuthService,
    private speedQuoteService: SpeedQuoteService,) {
    this.partDetails = [];
    this.query = new ItemMasterSearchQuery();
    this.partDetail = {
      id: null,
      partNumber: '',
      partDescription: ''
    };
    this.resetActionButtons();
  }

  openSalesMarginWithSummaryRow(selectedSummaryRow) {
    if (selectedSummaryRow) {
      this.partDetail.partNumber = selectedSummaryRow.partNumber;
      this.partDetail.partDescription = selectedSummaryRow.partDescription;
      this.query.partSearchParamters.partNumber = selectedSummaryRow.partNumber;
      this.query.partSearchParamters.partId = selectedSummaryRow.partId;
      this.query.partSearchParamters.partDescription = selectedSummaryRow.partDescription;
      this.query.partSearchParamters.quantityAlreadyQuoted = selectedSummaryRow.quantityAlreadyQuoted;
      this.query.partSearchParamters.quantityRequested = selectedSummaryRow.quantityRequested;
      this.query.partSearchParamters.conditionId = selectedSummaryRow.conditionId;
      let part = { exist: false, partDescription: '', partId: '', partNumber: '', restricted: false, stockType: '' };
      part.partDescription = selectedSummaryRow.partDescription;
      part.partId = selectedSummaryRow.partId;
      part.partNumber = selectedSummaryRow.partNumber;
      part.stockType = selectedSummaryRow.pmaStatus;
      this.query.partSearchParamters.partNumberObj = part;
      this.partDetails.push(part);
      this.calculate();
    }
  }

  ngOnInit() {
    this.speedQuoteService.getSearchPartObject()
      .subscribe(data => {
        this.query = data;
        this.calculate();
      });

    if (this.selectedSummaryRow) {
      this.onPartNumberSelect(this.selectedSummaryRow);
      this.openSalesMarginWithSummaryRow(this.selectedSummaryRow);
      if (Number(this.query.partSearchParamters.quantityToQuote) > 0 || this.isStockLineViewMode) {
        this.search('', true);
      }
      this.partEditDisable = true;
    } else {
      this.partEditDisable = false;
    }

    if (this.clearData) {
      this.query = new ItemMasterSearchQuery;
    }

    this.bindPartsDroppdown('');
  }

  initColumns() {
    this.columns = [
      { field: null, header: '', width: '50px' },
      { field: 'partNumber', header: 'PN', width: '200px' },
      { field: 'partNumber', header: 'PN Description', width: '200px' },
      { field: 'conditionType', header: 'Condition Type', width: '200px' },
      { field: 'alternatePartNumber', header: 'Alternate PN', width: '200px' },
      { field: 'qtyAvailable', header: 'Qty Avail', width: '200px' },
      { field: 'qtyOnHand', header: 'Qty OH', width: '200px' },
      { field: 'qtyRequested', header: 'Qty Req', width: '200px' },
      { field: '', header: 'Actions', width: '100px' },
    ]
  }

  formatStringToNumberGlobal(val) {
    let tempValue = Number(val.toString().replace(/\,/g, ''));
    return formatStringToNumber(tempValue)
  }

  resetActionButtons() {
    this.searchDisabled = true;
    this.historicalDisabled = true;
  }

  search($event, programaticSearch = false) {
    let searchQuery = JSON.parse(JSON.stringify(this.query));
    searchQuery.partSearchParamters.restrictDER = !searchQuery.partSearchParamters.restrictDER;
    searchQuery.partSearchParamters.restrictPMA = !searchQuery.partSearchParamters.restrictPMA;
    if (searchQuery.partSearchParamters.conditionIds !== undefined && searchQuery.partSearchParamters.conditionIds.length == 0) {
      searchQuery.partSearchParamters.conditionIds.push(searchQuery.partSearchParamters.conditionId);
    }

    if (!programaticSearch) {
      $event.preventDefault();
    }
    if (this.query.partSearchParamters.includeMultiplePartNumber) {
      this.getMultipartsQuery();
    } else {
      switch (this.query.partSearchParamters.itemSearchType) {
        case ItemSearchType.StockLine:
          this.isSpinnerVisible = true;
          this.stockLineService.searchstocklinefromsoqpop(searchQuery)
            .subscribe(result => {
              this.isSpinnerVisible = false;
              let resultdata = result['data'] || [];
              let qtyOnHandTemp = 0;
              let qtyAvailableTemp = 0;
              if (resultdata.length > 0) {
                for (let i = 0; i < resultdata.length; i++) {
                  qtyOnHandTemp = qtyOnHandTemp + resultdata[i].qtyOnHand;
                  qtyAvailableTemp = qtyAvailableTemp + resultdata[i].qtyAvailable
                }
              }

              this.query.partSearchParamters.qtyOnHand = qtyOnHandTemp;
              this.query.partSearchParamters.qtyAvailable = qtyAvailableTemp;
              this.onPartSearch.emit(result);
            }, error => {
              this.isSpinnerVisible = false;
            });
          break;
        default:
          this.isSpinnerVisible = true;
          this.itemMasterService.searchitemmasterfromSpeedQuotepop(searchQuery)
            .subscribe(result => {
              this.isSpinnerVisible = false;
              if (result && result['data'] && result['data'][0]) {
                this.query.partSearchParamters.qtyOnHand = result['data'][0].qtyOnHand;
                this.query.partSearchParamters.qtyAvailable = result['data'][0].qtyAvailable;
              }

              this.onPartSearch.emit(result);
            }, error => {
              this.isSpinnerVisible = false;
            });
          break;
      }
    }
  }

  calculate() {
    // if (this.query.partSearchParamters.conditionIds.length > 0
    //   && this.query.partSearchParamters.partNumber
    //   && formatStringToNumber(this.query.partSearchParamters.quantityRequested) > 0) {
    //   this.searchDisabled = false;
    // } else {
    //   this.searchDisabled = true;
    //   if (this.query.partSearchParamters.conditionIds !== undefined && this.query.partSearchParamters.conditionIds.length == 0 && this.query.partSearchParamters.conditionId !== 0) {
    //     this.query.partSearchParamters.conditionIds.push(this.query.partSearchParamters.conditionId);
    //   }
    // }
    if (this.query.partSearchParamters.partNumber
      && formatStringToNumber(this.query.partSearchParamters.quantityRequested) > 0) {
      this.searchDisabled = false;
    } else {
      this.searchDisabled = true;
      // if (this.query.partSearchParamters.conditionIds !== undefined && this.query.partSearchParamters.conditionIds.length == 0 && this.query.partSearchParamters.conditionId !== 0) {
      //   this.query.partSearchParamters.conditionIds.push(this.query.partSearchParamters.conditionId);
      // }
    }
    let qr = + formatStringToNumber(this.query.partSearchParamters.quantityRequested);
    if (qr) {
      this.query.partSearchParamters.quantityToQuote = qr - formatStringToNumber(this.query.partSearchParamters.quantityAlreadyQuoted);
    }
    if (this.query.partSearchParamters.quantityToQuote < 0) {
      this.searchDisabled = false;
      this.alertService.showStickyMessage('', 'Qty To Quote can not be negative', MessageSeverity.error);
    } else {
      this.alertService.resetStickyMessage();
    }
    this.speedQuoteService.updateSearchPartObject(this.query);
  }

  onPartNumberSelect(part: any) {
    this.resetActionButtons();
    this.query.partSearchParamters.partNumber = part.partNumber;
    this.query.partSearchParamters.partId = part.partId;
    this.query.partSearchParamters.partDescription = part.partDescription;
    this.query.partSearchParamters.customerId = this.salesQuote.customerId;
    this.query.partSearchParamters.conditionId = 0;
    this.query.partSearchParamters.quantityAlreadyQuoted = 0;
    this.query.partSearchParamters.quantityRequested = 0;
    this.query.partSearchParamters.quantityRequired = 0;
    this.query.partSearchParamters.quantityToQuote = 0;
    this.query.partSearchParamters.qtyOnHand = 0;
    this.query.partSearchParamters.qtyAvailable = 0;
    this.query.partSearchParamters.includeMultiplePartNumber = false;
    this.enableMultiSearch = false;
    if (this.query.partSearchParamters.conditionIds.length > 0 && this.query.partSearchParamters.quantityRequested > 0)
      this.searchDisabled = false;
    this.calculate();
  }

  onConditionSelect() {
    if (this.query.partSearchParamters.conditionIds.length > 0 && this.query.partSearchParamters.partNumber && this.query.partSearchParamters.quantityRequested > 0)
      this.searchDisabled = false;
  }

  async searchPartByPartNumber(event) {
    if (event.query !== undefined && event.query !== null) {
      this.bindPartsDroppdown(event.query);
    }
  }

  get masterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : 1;
  }

  bindPartsDroppdown(query) {
    this.searchDisabled = true;
    let partSearchParamters = {
      'partNumber': query,
      "restrictPMA": this.query.partSearchParamters.restrictPMA,
      "restrictDER": this.query.partSearchParamters.restrictDER,
      "customerId": this.salesQuote.customerId,
      "custRestrictDER": this.salesQuote.restrictDER,
      "custRestrictPMA": this.salesQuote.restrictPMA,
      "includeAlternatePartNumber": this.query.partSearchParamters.includeAlternatePartNumber,
      "includeEquivalentPartNumber": this.query.partSearchParamters.includeEquivalentPartNumber,
      "idlist": '0',
      "masterCompanyId": this.masterCompanyId
    };
    this.subscription = this.itemMasterService.searchPartNumberAdvanced(partSearchParamters).subscribe(
      (result: any) => {
        if (result && result.length > 0) {
          this.partDetailsList = result;
          this.partDetails = [...this.partDetailsList];
        }
        else {
          this.partDetailsList = [];
          this.partDetails = [];
        }
        this.changeDetector.detectChanges();
      }
    )
  }

  onChangeSearchType(event) {
    this.partDetails = [];
    let searchType: ItemSearchType = ItemSearchType.None;
    switch (event.target.value) {
      case "1":
        searchType = ItemSearchType.ItemMaster;
        break;
      case "2":
        searchType = ItemSearchType.StockLine;
        break;
    }
    this.onSearchTypeChange.emit(searchType);
  }

  openMultiPartSearch() {
    this.multiPartModal = this.modalService.open(this.searchMultiPart, { size: "lg" });
  }

  getMultipartsQuery() {
    let multiParts = [];
    for (let i = 0; i < this.multiSearchResult.length; i++) {
      if (this.multiSearchResult[i].exist) {
        let partSearchParamters = new PartSearchParamters();
        partSearchParamters = { ...this.query.partSearchParamters };
        partSearchParamters.partNumber = this.multiSearchResult[i].partNumber;
        partSearchParamters.partId = this.multiSearchResult[i].partId;
        partSearchParamters.partDescription = this.multiSearchResult[i].partDescription;
        partSearchParamters.conditionId = this.multiSearchResult[i].conditionType;
        multiParts.push(partSearchParamters);
      }
    }
    if (multiParts.length > 0) {
      this.query.multiPartSearchParamters = multiParts;
      switch (this.query.partSearchParamters.itemSearchType) {
        case ItemSearchType.StockLine:
          this.stockLineService.multiSearch(this.query)
            .subscribe(result => {
              this.onPartSearch.emit(result);
            }, error => {
              this.isSpinnerVisible = false;
            });
          break;
        default:
          this.itemMasterService.multiSearch(this.query)
            .subscribe(result => {
              this.onPartSearch.emit(result);
            }, error => {
              this.isSpinnerVisible = false;
            });
          break;
      }
    }
  }

  searchMultiPartNumbers(): void {
    let partSearchParamters = {
      'parts': this.multiPartNumbers.split(","),
      "restrictPMA": this.salesQuote.restrictPMA,
      "restrictDER": this.salesQuote.restrictDER,
      "customerId": this.salesQuote.customerId
    }

    this.isSpinnerVisible = true;
    this.itemMasterService.searchMultiPartNumbers(partSearchParamters).subscribe((response: any[]) => {
      this.multiSearchResult = response;
      this.isSpinnerVisible = false;
      if (this.multiSearchResult.length > 0)
        this.searchDisabled = false;
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  includeMultiplePN(event) {
    let checked: boolean = event.srcElement.checked;
    if (checked) {
      this.enableMultiSearch = true;
      if (this.multiSearchResult.length > 0)
        this.searchDisabled = false;
    } else {
      this.enableMultiSearch = false;
      if (this.query.partSearchParamters.conditionIds.length > 0 && this.query.partSearchParamters.partNumber && this.query.partSearchParamters.quantityRequested > 0)
        this.searchDisabled = false;
      else
        this.searchDisabled = true;
    }
  }

  onCloseMultiPartNumbers() {
    this.multiPartModal.close();
  }

  public navigateToAddItemMaster() {
    this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-stock');
  }

  onChange($event, part, salesMargin) { }

  ngOnDestroy() {
    if (this.subscription !== undefined) this.subscription.unsubscribe();
  }
}