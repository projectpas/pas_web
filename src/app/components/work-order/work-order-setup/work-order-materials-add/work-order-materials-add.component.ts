import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { ConditionService } from "../../../../services/condition.service";
import { SummaryPart } from "../../../../models/sales/SummaryPart";
import { AuthService } from "../../../../services/auth.service";
import { ItemSearchType } from "../../../../components/sales/quotes/models/item-search-type";
import { PartDetail } from "../../../../components/sales/shared/models/part-detail";
import { IPartJson } from "../../../../components/sales/shared/models/ipart-json";
import { ItemMasterSearchQuery } from "../../../../components/sales/quotes/models/item-master-search-query";
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { SalesQuoteService } from "../../../../../app/services/salesquote.service";
import { ISalesQuote } from "../../../../../app/models/sales/ISalesQuote.model";

@Component({
  selector: 'app-work-order-materials-add',
  templateUrl: './work-order-materials-add.component.html',
  styleUrls: ['./work-order-materials-add.component.scss']
})
export class WorkOrderMaterialsAddComponent implements OnInit {
  @Input() selectedSummaryRow: SummaryPart;
  @Input() isStockLineViewMode = false;
  @Input() clearData = false;
  @Input() display: boolean;
  @Input() customer: any;
  @Input() salesQuote: ISalesQuote;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedParts: any = [];
  @Input() type: string;
  @Input() isWorkOrder = false;
  @Input() customerId : any;
  searchType: ItemSearchType;
  parts: IPartJson[];
  showModalMargin: boolean;
  part: PartDetail;
  query: ItemMasterSearchQuery;
  allConditionInfo: any[] = [];
  allConditionInfoArray: any[] = [];

  constructor(private authService: AuthService, private salesQuoteService: SalesQuoteService, private conditionService: ConditionService, private workOrderService: WorkOrderService,) {
    this.searchType = ItemSearchType.ItemMaster; 
    this.showModalMargin = false;
  }

  ngOnInit() {
    console.log(this.customerId);
    console.log(this.isWorkOrder)
      this.getConditions();
      this.salesQuoteService
        .getSearchPartResult()
        .subscribe(data => {
          this.parts = data;
        });
      this.salesQuoteService.getSearchPartObject()
        .subscribe(data => {
          this.query = data;
          this.searchType = this.getSearchType(this.query.partSearchParamters.itemSearchType);
        });
  }

  get masterCompanyId(): number {
      return this.authService.currentUser? this.authService.currentUser.masterCompanyId : 1;
  }

  getSearchType(event) {
      let searchType: ItemSearchType = ItemSearchType.None;
      switch (event) {
        case "1":
          searchType = ItemSearchType.ItemMaster;
          break;
        case "2":
          searchType = ItemSearchType.StockLine;
          break;
      }
      return searchType;
  }

  onClose() {
      this.close.emit(true);
  }

  show(value: boolean): void {
      this.display = value;
  }

  onAddPartNumberSubmit($event) {
      this.display = false;
  }

  onPartSearch(parts) {
      this.parts = parts.data;
      if (this.parts.length > 0) {
        this.parts.forEach((part, i) => {
          this.parts[i].qtyToOrder = this.query.partSearchParamters.quantityRequested;
        })
      }
      this.salesQuoteService.updateSearchPartResult(this.parts);
      this.salesQuoteService.getSearchPartObject()
        .subscribe(data => {
          this.query = data;
          this.searchType = this.getSearchType(this.query.partSearchParamters.itemSearchType);
        });
  }

  updateQuantiy() {
      let qtyOnHand = 0;
      let qtyAvailable = 0;
      for (let i = 0; i < this.parts.length; i++) {
        qtyAvailable = qtyAvailable + this.parts[i].qtyAvailable;
        qtyOnHand = qtyOnHand + this.parts[i].quantityOnHand;
      }
      this.query.partSearchParamters.qtyAvailable = qtyAvailable;
      this.query.partSearchParamters.qtyOnHand = qtyOnHand;
      this.salesQuoteService.updateSearchPartObject(this.query);
  }

  onSearchTypeChange(type: ItemSearchType) {
  }

  onShowModalMargin(part: any) {
      this.select.emit(part);
  }

  onSelect(part: any) {
      this.select.emit(part);
  }

  showMarginDetails() {
      var btnMarginDetails: any = document.querySelector("#btnMarginDetails");
      if (btnMarginDetails) {
        btnMarginDetails.click();
      }
  }

  getConditions() {
      this.conditionService.getConditionList(this.masterCompanyId).subscribe(
        results => {
          let activeConditions = results[0].filter(x => x.isActive == true);
          if (activeConditions && activeConditions.length > 0) {
            this.allConditionInfo = activeConditions;
            if (this.selectedSummaryRow) {
              let conditionExists = this.allConditionInfo.find(x => x.conditionId == this.query.partSearchParamters.conditionId);
              if (!conditionExists) {
                let addConditionExists = results[0].find(x => x.conditionId == this.query.partSearchParamters.conditionId);
                if (addConditionExists) {
                  this.allConditionInfo.push(addConditionExists);
                }
              }
            }
          }
          this.allConditionInfoArray = this.allConditionInfo.map((item) => ({ label: item.description, value: item.conditionId }));
        });
    }
}

// export class AddSalesPartNumberComponent implements OnInit {
  
//   @Input() salesQuote: ISalesQuote;
//   @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
//   @Output() select: EventEmitter<any> = new EventEmitter<any>();
//   @Input() selectedParts: any = [];
//   @Input() type: string;
//   searchType: ItemSearchType;
//   parts: IPartJson[];
//   showModalMargin: boolean;
//   part: PartDetail;
//   query: ItemMasterSearchQuery;
//   allConditionInfo: any[] = [];
//   allConditionInfoArray: any[] = [];

//   constructor(private authService: AuthService, private salesQuoteService: SalesQuoteService, private conditionService: ConditionService) {
//     this.searchType = ItemSearchType.ItemMaster;
//     this.showModalMargin = false;
//   }
// }
