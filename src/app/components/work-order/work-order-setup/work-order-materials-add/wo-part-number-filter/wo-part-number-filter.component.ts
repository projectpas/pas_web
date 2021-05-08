import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef }  from '@angular/core';
import { ItemMasterSearchQuery } from "../../../../../../app/components/sales/quotes/models/item-master-search-query";
import { Subscription } from 'rxjs';
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ItemMasterService } from "../../../../../../app/services/itemMaster.service";
import { AlertService, MessageSeverity } from "../../../../../../app/services/alert.service";
import { IMultiPartJson } from "../../../../../../app/components/sales/shared/models/imulti-part-json";
import { AuthService } from "../../../../../../app/services/auth.service";
import { IWOrkOrderQuote } from "src/app/models/workorder/IWorkOrderQuote";


@Component({
  selector: 'app-wo-part-number-filter',
  templateUrl: './wo-part-number-filter.component.html',
  styleUrls: ['./wo-part-number-filter.component.scss']
})
export class WoPartNumberFilterComponent implements OnInit, OnDestroy {
  @Input() type: string;
  @Input() allConditionInfo: any;
  @Input() workOrderQuote: IWOrkOrderQuote;
  @ViewChild("searchMultiPart", { static: false }) searchMultiPart: ElementRef;
  query: ItemMasterSearchQuery;
  partDetails: any[];
  partDetailsList = [];
  partDetail: any;
  searchDisabled: boolean;
  subscription: Subscription;
  isSpinnerVisible: boolean = false;
  enableMultiSearch: boolean = false;
  partEditDisable = false;
  multiPartNumbers = "";
  multiPartModal: NgbModalRef;
  multiSearchResult: IMultiPartJson[] = [];

  constructor(private modalService: NgbModal, private itemMasterService: ItemMasterService,private alertService: AlertService,
    private authService: AuthService, private changeDetector: ChangeDetectorRef,) {
    this.partDetails = [];
    
    this.query = new ItemMasterSearchQuery();
    this.partDetail = {
      id: null,
      partNumber: '',
      partDescription: ''
    };
   }

  ngOnInit() {
    //this.bindPartsDroppdown('');
  }

  get masterCompanyId(): number {
    return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : 1;
  }

  onConditionSelect() {
    if (this.query.partSearchParamters.conditionIds.length > 0 && this.query.partSearchParamters.partNumber && this.query.partSearchParamters.quantityRequested > 0)
      this.searchDisabled = false;
  }

  calculate() {
  }

  search($event, programaticSearch = false) {
  }

  async searchPartByPartNumber(event) {
    if (event.query !== undefined && event.query !== null) {
      this.bindPartsDroppdown(event.query);
    }
  }

  bindPartsDroppdown(query) {
    this.searchDisabled = true;
    let partSearchParamters = {
      'partNumber': query,
      "restrictPMA": this.query.partSearchParamters.restrictPMA,
      "restrictDER": this.query.partSearchParamters.restrictDER,
      "customerId": this.workOrderQuote.customerId,
      "custRestrictDER": this.workOrderQuote.restrictDER,
      "custRestrictPMA": this.workOrderQuote.restrictPMA,
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

  searchMultiPartNumbers(): void {
    let partSearchParamters = {
      'parts': this.multiPartNumbers.split(","),
      "restrictPMA": this.workOrderQuote.restrictPMA,
      "restrictDER": this.workOrderQuote.restrictDER,
      "customerId": this.workOrderQuote.customerId
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

  onPartNumberSelect(part: any) {
    this.resetActionButtons();
    this.query.partSearchParamters.partNumber = part.partNumber;
    this.query.partSearchParamters.partId = part.partId;
    this.query.partSearchParamters.partDescription = part.partDescription;
    this.query.partSearchParamters.customerId = this.workOrderQuote.customerId;
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

  resetActionButtons() {
    this.searchDisabled = true;
    //this.historicalDisabled = true;
  }

  openMultiPartSearch() {
    this.multiPartModal = this.modalService.open(this.searchMultiPart, { size: "lg" });
  }

  onCloseMultiPartNumbers() {
    this.multiPartModal.close();
  }

  ngOnDestroy() {
    if (this.subscription !== undefined) this.subscription.unsubscribe();
  }

}
