import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef }  from '@angular/core';
import { ItemMasterSearchQuery } from "../../../../../../app/components/sales/quotes/models/item-master-search-query";
import { Subscription } from 'rxjs';
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ItemMasterService } from "../../../../../../app/services/itemMaster.service";
import { AlertService, MessageSeverity } from "../../../../../../app/services/alert.service";
import { IMultiPartJson } from "../../../../../../app/components/sales/shared/models/imulti-part-json";
import { AuthService } from "../../../../../../app/services/auth.service";
import { IWOrkOrderQuote } from "../../../../../../app/models/workorder/IWorkOrderQuote";
import { formatNumberAsGlobalSettingsModule } from '../../../../../../app/generic/autocomplete';
import { StocklineService } from '../../../../../../app/services/stockline.service';
import { ItemSearchType } from '../../../../../../app/components/sales/quotes/models/item-search-type';
import { CommonService } from '../../../../../../app/services/common.service';


@Component({
  selector: 'app-wo-part-number-filter',
  templateUrl: './wo-part-number-filter.component.html',
  styleUrls: ['./wo-part-number-filter.component.scss']
})
export class WoPartNumberFilterComponent implements OnInit, OnDestroy {
  @Input() type: string;
  @Input() allConditionInfo: any;
  @Input() workOrderQuote: IWOrkOrderQuote;
  @Input() customer :any={}
  @Output() onPartSearch: EventEmitter<any> = new EventEmitter<any>();
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
  provisionListData:any=[];
  constructor(private modalService: NgbModal, private itemMasterService: ItemMasterService,private alertService: AlertService,
    private authService: AuthService,    private commonService: CommonService,private changeDetector: ChangeDetectorRef,    private stockLineService: StocklineService,) {
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
    this.provisionList();
  }
  provisionList() {
    this.isSpinnerVisible = true;
    let provisionIds = []; 
// if(this.workFlow.materialList && this.workFlow.materialList.length !=0){
//          this.workFlow.materialList.forEach(element => {
//         return provisionIds.push(element.provisionId);
//     })
// }else{
// } 
provisionIds.push(0)
    this.isSpinnerVisible = true;
    this.commonService.autoSuggestionSmartDropDownList('Provision', 'ProvisionId', 'Description', '', true, 0, provisionIds,this.masterCompanyId)
        .subscribe(res => {
            this.isSpinnerVisible = false;
            this.provisionListData = [];
                this.provisionListData = res;
        }, error => {
            this.isSpinnerVisible = false;
        });
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

  // search($event, programaticSearch = false) {

  // }
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
      // this.getMultipartsQuery();
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
              // this.onPartSearch.emit(result);
            }, error => {
              this.isSpinnerVisible = false;
            });
          break;
        default:
          this.isSpinnerVisible = true;
          this.itemMasterService.searchitemmasterfromsoqpop(searchQuery)
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

  async searchPartByPartNumber(event) {
    if (event.query !== undefined && event.query !== null) {
      this.bindPartsDroppdown(event.query);
    }
  }

  bindPartsDroppdown(query) {
    // this.searchDisabled = true;
    let partSearchParamters = {
      'partNumber': query,
      "restrictPMA": this.query.partSearchParamters.restrictPMA,
      "restrictDER": this.query.partSearchParamters.restrictDER,
      "customerId": this.customer.customerId,
      "custRestrictDER": this.customer.restrictDER,
      "custRestrictPMA": this.customer.restrictPMA,
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
      "restrictPMA": this.customer.restrictPMA,
      "restrictDER": this.customer.restrictDER,
      "customerId": this.customer.customerId
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
    this.query.partSearchParamters.customerId = this.customer.customerId;
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
  unitCost;
  extendedCost;
  quantity;
  calculateExtendedCost(): void {
    this.unitCost = this.unitCost ? formatNumberAsGlobalSettingsModule(this.unitCost, 2) : '';
    this.quantity = this.quantity ? this.quantity.toString().replace(/\,/g, '') : 0;
    if (this.quantity != "" && this.unitCost) {
        this.extendedCost = formatNumberAsGlobalSettingsModule((this.quantity * this.unitCost.toString().replace(/\,/g, '')), 2);
    }
    else {
        this.extendedCost = "";
    }
}
}
