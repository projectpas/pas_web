import { Component, Input, Output, ElementRef,ViewChild, EventEmitter, OnInit } from "@angular/core";
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
import { CustomerService } from '../../../../../app/services/customer.service';
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: 'app-work-order-materials-add',
  templateUrl: './work-order-materials-add.component.html',
  styleUrls: ['./work-order-materials-add.component.scss']
})
export class WorkOrderMaterialsAddComponent implements OnInit {
  // // @Input() selectedSummaryRow: SummaryPart;
  // // @Input() isStockLineViewMode = false;    
  // @Input() customer: any;
  @Input() salesQuote: ISalesQuote;
   @Input() clearData = false;
   @Input() display: boolean;
   @Input() editData: any={};
   @Input() isEdit: boolean;
   @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
   @Output() select: EventEmitter<any> = new EventEmitter<any>();
   @Output() setmaterialListForSave: EventEmitter<any> = new EventEmitter<any>();
   @Output() setmaterialListForUpdate: EventEmitter<any> = new EventEmitter<any>();
   @Input() selectedParts: any = [];
   @Input() type: string;
   @Input() isWorkOrder = false;
   @Input() customerId : any;
   @ViewChild("salesMargin", { static: false }) salesMargin: ElementRef;
   woMarginModal: NgbModalRef;
   customer: any;
   searchType: ItemSearchType;
   parts: IPartJson[];
   showModalMargin: boolean;
   workorderdetails : any;
   part: PartDetail;
   query: ItemMasterSearchQuery;
   allConditionInfo: any[] = [];
   allConditionInfoArray: any[] = [];

  constructor(private authService: AuthService, 
    private modalService: NgbModal,
    private salesQuoteService: SalesQuoteService, private conditionService: ConditionService, private workOrderService: WorkOrderService, private customerService: CustomerService) {
    this.searchType = ItemSearchType.ItemMaster; 
    this.showModalMargin = false;
  }

  ngOnInit() {
      this.getCustomerDetails();
      this.getConditions();
      this.salesQuoteService.getSearchPartResult().subscribe(data => {
          this.parts = data;
        });
      this.salesQuoteService.getSearchPartObject().subscribe(data => {
          this.query = data;
          this.searchType = this.getSearchType(this.query.partSearchParamters.itemSearchType);
        });
  }

  getCustomerDetails(){
    this.customerService.getCustomerdataById(this.customerId).subscribe(response => {
      this.customer = response[0];
    })
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
  saveMaterial(part:any){
    this.setmaterialListForSave.emit(part);
    // this.close.emit(true);

  }
  updateMaterial(part:any){
    this.setmaterialListForUpdate.emit(part);
    // this.close.emit(true);
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
            //if (this.selectedSummaryRow) {
              let conditionExists = this.allConditionInfo.find(x => x.conditionId == this.query.partSearchParamters.conditionId);
              if (!conditionExists) {
                let addConditionExists = results[0].find(x => x.conditionId == this.query.partSearchParamters.conditionId);
                if (addConditionExists) {
                  this.allConditionInfo.push(addConditionExists);
                }
              }
            //}
          }
          this.allConditionInfoArray = this.allConditionInfo.map((item) => ({ label: item.description, value: item.conditionId }));
        });
    }
    savePart(){

    }



    openSalesMargin(event) {
      this.isEdit = false;
      let contentMargin = this.salesMargin;
    
    
         this.woMarginModal = this.modalService.open(contentMargin, { size: "lg", backdrop: 'static', keyboard: false });
          this.woMarginModal.result.then(
            () => { },
            () => {
              // this.selectedPart.selected = false;
            }
          );
    
    
    
    
    
    
    
    
    
    
    
    
    
    
      // this.selectedPart = event.part;
      let checked = event.checked;
      // if (this.selectedPart) {
      //   if (checked) {
      //     this.salesQuoteService.getSearchPartObject().subscribe(data => {
      //       this.query = data;
      //       this.part = new PartDetail();
    
      //       this.part.partNumber = this.selectedPart.partNumber;
      //       this.part.stockLineNumber = this.selectedPart.stockLineNumber;
      //       this.part.salesPricePerUnit = +this.selectedPart.unitSalePrice;
      //       this.part.unitCostPerUnit = +this.selectedPart.unitCost;
      //       this.part.itemClassification = this.selectedPart.itemClassification;
      //       this.part.freight = this.salesQuoteService.getTotalFreights();
      //       this.part.misc = this.salesQuoteService.getTotalCharges();
      //       this.part.createdBy = this.userName;
      //       this.part.priorityId = this.defaultSettingPriority;
      //       if (this.selectedPart.itemMasterSale) {
      //         this.part.fixRate = this.selectedPart.itemMasterSale.fxRate;
      //       }
      //       this.part.taxType = this.customer.taxType;
      //       this.part.taxPercentage = this.customer.taxPercentage;
      //       if (this.selectedPart.mappingType == 1) {
      //         this.part.altOrEqType = "Alt";
      //       } else if (this.selectedPart.mappingType == 2) {
      //         this.part.altOrEqType = "Equi";
      //       } else {
      //         this.part.altOrEqType = "";
      //       }
      //       this.part.description = this.selectedPart.description;
      //       this.part.itemMasterId = this.selectedPart.itemMasterId;
      //       this.part.partId = this.selectedPart.partId;
      //       this.part.stockLineId = this.selectedPart.stockLineId;
      //       this.part.idNumber = this.selectedPart.idNumber;
      //       this.part.customerRef = this.salesQuote.customerReferenceName;
      //       this.part.serialNumber = this.selectedPart.serialNumber;
      //       this.part.qtyAvailable = this.selectedPart.qtyAvailable;
      //       this.part.quantityOnHand = this.selectedPart.quantityOnHand;
     
      //       this.part.masterCompanyId = this.masterCompanyId;
      //       this.part.conditionId = this.selectedPart.conditionId;
      //       this.part.conditionDescription = this.selectedPart.conditionDescription;
      //       this.part.uom = this.selectedPart.uomDescription;
      //       this.part.pmaStatus = this.selectedPart.oempmader;
      //       if (!this.part.pmaStatus) {
      //         this.part.pmaStatus = this.selectedPart['stockType'];
      //       }
      //       this.part.currencyId = this.selectedPart.currencyId;
      //       this.part.currencyDescription = this.defaultCurrencyDiscription;
      //       this.part.currencyId = this.defaultCurrencyId;
      //       this.part.controlNumber = this.selectedPart.controlNumber;
      //       this.part.salesDiscount = 0;
      //       this.part.markupPerUnit = 0;
      //       this.part.markUpPercentage = 0;
      //       this.part.salesDiscount = 0;
      //       this.part.grossSalePricePerUnit = 0;
      //       this.part.grossSalePrice = 0;
      //       this.part.quantityRequested = this.query.partSearchParamters.quantityRequested;
      //       this.part.quantityToBeQuoted = this.query.partSearchParamters.quantityToQuote;
      //       if (this.selectedPart['qtyRemainedToQuote']) {
      //         if (this.selectedPart['qtyRemainedToQuote'] >= this.part.quantityToBeQuoted) {
      //           this.part.quantityFromThis = this.part.quantityToBeQuoted;
      //         } else {
      //           this.part.quantityFromThis = this.selectedPart['qtyRemainedToQuote'];
      //         }
      //       } else {
      //         this.part.quantityFromThis = this.part.quantityToBeQuoted;
      //       }
      //       this.part.quantityAvailableForThis = this.query.partSearchParamters.qtyAvailable;
      //       this.part.quantityAlreadyQuoted = this.query.partSearchParamters.quantityAlreadyQuoted;
      //     });
      //     this.addPartModal.close();
      //     this.salesMarginModal = this.modalService.open(contentMargin, { size: "lg", backdrop: 'static', keyboard: false });
      //     this.salesMarginModal.result.then(
      //       () => { },
      //       () => {
      //         this.selectedPart.selected = false;
      //       }
      //     );
      //   } else {
      //     this.removePartNamber(this.selectedPart);
      //   }
      // }
    }
    
}