import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SummaryPart } from "../../../../../models/exchange/SummaryPart";
//import { IExchangeQuote } from 'src/app/models/exchange/IExchangeQuote.model';
import { IExchangeSalesOrder } from 'src/app/models/exchange/IExchangeSalesOrder.model';
import { ItemSearchType } from "../../../models/item-search-type";
import { IPartJson } from "../../models/ipart-json";
import { PartDetail } from "../../models/part-detail";
import { ItemMasterSearchQuery } from "../../../models/item-master-search-query";
import { ItemMasterService } from "../../../../../services/itemMaster.service";
import { ConditionService } from "../../../../../services/condition.service";
import { ExchangeSalesOrderService } from "../../../../../services/exchangesalesorder.service";
import { SalesQuoteService } from "../../../../../services/salesquote.service";
@Component({
  selector: 'app-add-exchange-sales-order-part-number',
  templateUrl: './add-exchange-sales-order-part-number.component.html',
  styleUrls: ['./add-exchange-sales-order-part-number.component.scss']
})
export class AddExchangeSalesOrderPartNumberComponent implements OnInit {
  @Input() display: boolean;
  @Input() type: string;
  @Input() selectedParts: any = [];
  @Input() isStockLineViewMode = false;
  @Input() selectedSummaryRow: SummaryPart;
  @Input() exchangeQuote: IExchangeSalesOrder;
  searchType: ItemSearchType;
  parts: IPartJson[];
  showModalMargin: boolean;
  part: PartDetail;
  query: ItemMasterSearchQuery;
  allConditionInfo: any[] = [];
  allConditionInfoArray: any[] = [];
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  constructor(private itemMasterService: ItemMasterService, private exchangeSalesOrderService: ExchangeSalesOrderService, private conditionService: ConditionService)
  {
    this.searchType = ItemSearchType.ItemMaster;
    this.showModalMargin = false;
  }

  ngOnInit() {
    this.getConditions();
    this.exchangeSalesOrderService
      .getSearchPartResult()
      .subscribe(data => {
        this.parts = data;
      });
    this.exchangeSalesOrderService.getSearchPartObject()
      .subscribe(data => {
        this.query = data;
        this.searchType = this.getSearchType(this.query.partSearchParamters.itemSearchType);
      });
  }
  getConditions() {
    this.conditionService.getConditionList().subscribe(
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

  show(value: boolean): void {
    this.display = value;
  }

  onClose() {
    this.close.emit(true);
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
    this.exchangeSalesOrderService.updateSearchPartResult(this.parts);
    this.exchangeSalesOrderService.getSearchPartObject()
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
      qtyOnHand = qtyOnHand + this.parts[i].qtyOnHand;
    }
    this.query.partSearchParamters.qtyAvailable = qtyAvailable;
    this.query.partSearchParamters.qtyOnHand = qtyOnHand;
    this.exchangeSalesOrderService.updateSearchPartObject(this.query);
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
}
