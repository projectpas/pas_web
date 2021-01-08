import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { ItemMasterService } from "../../../../../services/itemMaster.service";
import { ItemSearchType } from "../../../quotes/models/item-search-type";
import { PartDetail } from "../../models/part-detail";
import { IPartJson } from "../../models/ipart-json";
import { ISalesQuote } from "../../../../../models/sales/ISalesQuote.model";
import { SalesQuoteService } from "../../../../../services/salesquote.service";
import { ItemMasterSearchQuery } from "../../../quotes/models/item-master-search-query";
import { ConditionService } from "../../../../../services/condition.service";
import { SummaryPart } from "../../../../../models/sales/SummaryPart";

@Component({
  selector: "app-add-sales-part-number",
  templateUrl: "./add-sales-part-number.component.html",
  styleUrls: ["./add-sales-part-number.component.css"]
})
export class AddSalesPartNumberComponent implements OnInit {
  @Input() selectedSummaryRow: SummaryPart;
  @Input() isStockLineViewMode = false;
  @Input() display: boolean;
  @Input() customer: any;
  @Input() salesQuote: ISalesQuote;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedParts: any = [];
  searchType: ItemSearchType;
  parts: IPartJson[];
  showModalMargin: boolean;
  part: PartDetail;
  query: ItemMasterSearchQuery;
  allConditionInfo: any[] = [];

  constructor(private itemMasterService: ItemMasterService, private salesQuoteService: SalesQuoteService, private conditionService: ConditionService) {
    console.log("add...");
    this.searchType = ItemSearchType.ItemMaster;
    this.showModalMargin = false;
  }

  ngOnInit() {
    // this.parts = [];
    this.getConditions();
    this.salesQuoteService
      .getSearchPartResult()
      .subscribe(data => {
        this.parts = data;
        console.log(this.parts);
      });
    this.salesQuoteService.getSearchPartObject()
      .subscribe(data => {
        this.query = data;
        this.searchType = this.getSearchType(this.query.partSearchParamters.itemSearchType);
        console.log(this.query);
        console.log(this.searchType);

      });
  }

  getConditions() {
    this.conditionService.getConditionList().subscribe(
      results => {
        this.allConditionInfo = results[0];
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
    console.log(parts);
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
        console.log(this.query);
        console.log(this.searchType);

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
    this.salesQuoteService.updateSearchPartObject(this.query);
    console.log(this.parts);
  }

  onSearchTypeChange(type: ItemSearchType) {
    //this.searchType = type;
  }

  /*onShowModalMargin(event: any) {
    this.showModalMargin = event.checked;
    if (this.showMarginDetails) {
      this.part = event.part;
     
      setTimeout(this.showMarginDetails, 100);
    }
  }*/

  onShowModalMargin(part: any) {
    console.log(part);
    this.select.emit(part);
  }

  onSelect(part: any) {
    console.log(part);
    this.select.emit(part);
  }

  showMarginDetails() {
    var btnMarginDetails: any = document.querySelector("#btnMarginDetails");
    if (btnMarginDetails) {
      btnMarginDetails.click();
    }
  }
}
