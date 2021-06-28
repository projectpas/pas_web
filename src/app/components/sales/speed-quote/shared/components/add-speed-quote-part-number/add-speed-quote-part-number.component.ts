import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemMasterService } from "../../../../../../services/itemMaster.service";
import { ItemSearchType } from "../../../../quotes/models/item-search-type";
import { PartDetail } from "../../models/part-detail";
import { IPartJson } from "../../models/ipart-json";
import { ISpeedQuote } from "../../../../../../models/sales/ISpeedQuote.model";
//import { SalesQuoteService } from "../../../../../../services/salesquote.service";
import { ItemMasterSearchQuery } from "../../../../quotes/models/item-master-search-query";
import { ConditionService } from "../../../../../../services/condition.service";
import { SummaryPart } from "../../../../../../models/sales/SummaryPart";
import { AuthService } from "../../../../../../services/auth.service";
import { SpeedQuoteService } from "../../../../../../services/speedquote.service";

@Component({
  selector: 'app-add-speed-quote-part-number',
  templateUrl: './add-speed-quote-part-number.component.html',
  styleUrls: ['./add-speed-quote-part-number.component.scss']
})
export class AddSpeedQuotePartNumberComponent implements OnInit {
  @Input() selectedSummaryRow: SummaryPart;
  @Input() isStockLineViewMode = false;
  @Input() clearData = false;
  @Input() display: boolean;
  @Input() customer: any;
  @Input() salesQuote: ISpeedQuote;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedParts: any = [];
  @Input() type: string;
  searchType: ItemSearchType;
  parts: IPartJson[];
  showModalMargin: boolean;
  part: PartDetail;
  query: ItemMasterSearchQuery;
  allConditionInfo: any[] = [];
  allConditionInfoArray: any[] = [];
  constructor(private authService: AuthService,
    //private salesQuoteService: SalesQuoteService,
    private conditionService: ConditionService,
    private speedQuoteService: SpeedQuoteService,) {
    this.searchType = ItemSearchType.ItemMaster;
    this.showModalMargin = false;
  }

  ngOnInit() {
    this.getConditions();
    this.speedQuoteService
      .getSearchPartResult()
      .subscribe(data => {
        this.parts = data;
      });
    this.speedQuoteService.getSearchPartObject()
      .subscribe(data => {
        this.query = data;
        this.searchType = this.getSearchType(this.query.partSearchParamters.itemSearchType);
      });
  }
  get masterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : 1;
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
    this.speedQuoteService.updateSearchPartResult(this.parts);
    this.speedQuoteService.getSearchPartObject()
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
    this.speedQuoteService.updateSearchPartObject(this.query);
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