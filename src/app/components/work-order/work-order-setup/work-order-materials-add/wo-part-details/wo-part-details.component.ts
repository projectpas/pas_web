import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
// import { PartDetail } from "./models/part-detail";
import { IPartJson } from "../../../../../components/sales/shared/models/ipart-json";
import { SalesQuoteService } from "../../../../../services/salesquote.service";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { StocklineService } from "../../../../../services/stockline.service";
import { StocklineListSalesFilter } from "../../../../../models/sales/StocklineListSalesFilter";
import { CustomPaginate } from "../../../../../models/custom-paginate";
import { formatNumberAsGlobalSettingsModule } from "../../../../../generic/autocomplete";
import { StocklineViewComponent } from "../../../../../shared/components/stockline/stockline-view/stockline-view.component";
import { StocklineHistoryComponent } from "../../../../../shared/components/stockline/stockline-history/stockline-history.component";
import { AlertService ,MessageSeverity} from "../../../../../services/alert.service";
import { PartDetail } from "../../../../../components/sales/shared/models/part-detail";
// import { ItemMasterSearchQuery } from "../../../../exchange-quote/models/item-master-search-query";
import { AuthService } from "../../../../../services/auth.service";
import { ItemMasterService } from "../../../../../services/itemMaster.service";
import { ItemSearchType } from '../../../../../../app/components/sales/quotes/models/item-search-type';
import { CommonService } from "../../../../../services/common.service";
import { WorkOrderService } from "../../../../../services/work-order/work-order.service";

@Component({
  selector: "app-wo-part-details",
  templateUrl: "./wo-part-details.component.html",
  styleUrls: ["./wo-part-details.component.scss"]
})
export class WoPartDetailsComponent implements OnChanges {
  @Input() customer: any;
  roleUpMaterialList: any = [];
  // @Input() parts: IPartJson[];
  // @Input() parts: IPartJson[];
  @Input() allConditionInfo: any;
  @Input() isStockLineViewMode = false;
  @Input() clearData = false;
  // @Input() query: ItemMasterSearchQuery;
  @Output() onPartSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  @Output() saveMaterialListData = new EventEmitter<any>();
  
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  selectedColumns: any[];
  showPaginator: boolean;
  totalRecords: number;
  pageLinks: any;
  part: PartDetail;
  show: boolean;
  columns: any[];
  stockLinecolumns: any[];
  modal: NgbModalRef;
  isSpinnerVisible = false;
  itemMasterRowData: any = {};
  isViewOpened: boolean = false;
  selectedParts = [];
  @Input() id: number;
  @Input() conditionId: number;

  @Input() workOrderId=0;
  @Input() workFlowWorkOrderId=0;
  @Input('part-number') partNumber: string;
  @Input() stockLineInformation: IPartJson[];
  auditHistory: any = [];
  adjAuditHistoryList: any = [];
  adjAuditHistoryData: any = [];
  hideme = [];
  rowIndex = -1;
  stockLineViewedRow: any;
  customPaginate: CustomPaginate<StocklineListSalesFilter> = new CustomPaginate<StocklineListSalesFilter>();
  parts: any = [];
  formObject:any={};
  searchQuery={
    first:0,
    rows:10,
    limit:5,
    pageCount:10,
    page:10,
    partSearchParamters:{}
  }
  constructor(private salesQuoteService: SalesQuoteService,
    private service: StocklineService,
    private modalService: NgbModal,
    public alertService: AlertService,
    private authService: AuthService,
    private commonService: CommonService,
    private workOrderService: WorkOrderService,
    private itemMasterService: ItemMasterService,) {
    this.parts = [];
    this.roleUpMaterialList = [];
    this.columns = [];
    this.stockLinecolumns = [];
    this.initColumns();
    this.part = null;
    this.customPaginate.filters = new StocklineListSalesFilter();
  }

  ngOnInit() {
    // this.salesQuoteService.getSearchPartResult()
    //   .subscribe(data => {
    //     this.parts = data;
    //     this.query = data;
    //     console.log("hello",this.query)
    //     this.totalRecords = this.parts.length;
    //     this.pageLinks = Math.ceil(
    //       this.totalRecords / 10
    //     );
    //   });

    // if (this.clearData) {
    //   this.parts = [];
    // }
    this.getTaskList();
    this.provisionList();
  }

  hideStockline(rowIndex) {
    this.hideme[rowIndex] = !this.hideme[rowIndex];
    this.rowIndex = -1;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.salesQuoteService.getSelectedParts().subscribe(data => {
      if (data && data.length > 0) {
        this.selectedParts = data;
      }
    })
    if (this.parts.length > 0 && this.rowIndex != -1) {
      if (this.rowIndex < this.parts.length) {
        this.viewSelectedRow(this.parts[this.rowIndex], this.rowIndex);
      } else {
        this.viewSelectedRow(this.parts[0], 0);
      }
    }
  }

  initColumns() {
    this.columns = [
      { field: 'select', header: '', width: '30px', textalign: 'center' },
      { field: 'partNumber', header: 'PN', width: '40px', textalign: 'left' },
      { field: 'description', header: 'PN Description', width: '100px', textalign: 'left' },
      { field: 'conditionDescription', header: 'Cond', width: '90px', textalign: 'left' },
      { field: 'itemGroup', header: 'Item Group', width: '100px', textalign: 'left' },
      { field: 'manufacturer', header: 'Manufacturer', width: '90px', textalign: 'left' },
      { field: 'itemClassification', header: 'Classification', width: '90px', textalign: 'left' },
      { field: 'oempmader', header: 'OEM/PMA/DER', width: '90px', textalign: 'left' },
      { field: 'alternateFor', header: 'Alt/Equiv For', width: '90px', textalign: 'left' },
      { field: 'qtyToOrder', header: 'Qty Req', width: '110px', textalign: 'right' },
      { field: 'qtyAvailable', header: 'Qty Avail', width: '90px', textalign: 'right' },
      { field: 'qtyOnHand', header: 'Qty On Hand', width: '90px', textalign: 'right' },
    ]

    this.stockLinecolumns = [
      { field: 'selected', header: '', width: '30px', textalign: 'left' },
      { field: 'stockLineNumber', header: 'Stk Line Num', width: '80px', textalign: 'left' },
      { field: 'serialNumber', header: 'Ser Num', width: '80px', textalign: 'left' },
      { field: 'controlNumber', header: 'Cntrl Num', width: '80px', textalign: 'left' },
      { field: 'idNumber', header: 'Cntrl ID Num', width: '80px', textalign: 'left' },
      { field: 'partNumber', header: 'PN', width: '80px', textalign: 'left' },
      { field: 'description', header: 'PN Description', width: '100px', textalign: 'left' },
      { field: 'stockType', header: 'Stk Type', width: '100px', textalign: 'left' },
      { field: 'stkLineManufacturer', header: 'Manufacturer', width: '100px', textalign: 'left' },
      { field: 'uomDescription', header: 'UOM', width: '80px', textalign: 'left' },
      { field: 'qtyAvailable', header: 'Qty Avail', width: '100px', textalign: 'right' },
      { field: 'qtyOnHand', header: 'Qty On Hand', width: '100px', textalign: 'right' },
      { field: 'unitCost', header: 'Unit Cost', width: '80px', textalign: 'left' },
      { field: 'tracableToName', header: 'Traceable to', width: '80px', textalign: 'left' },
      { field: 'ownerName', header: 'Owner', width: '100px', textalign: 'left' },
      { field: 'obtainFromName', header: 'Obtain From', width: '100px', textalign: 'left' },
      { field: 'tagDate', header: 'Tag Date', width: '80px', textalign: 'left' },
      { field: 'tagType', header: 'Tag Type', width: '80px', textalign: 'left' },
      { field: 'certifiedBy', header: 'Cert By', width: '80px', textalign: 'left' },
      { field: 'certifiedDate', header: 'Cert Date', width: '80px', textalign: 'left' },
      { field: 'memo', header: 'Memo', width: '80px', textalign: 'left' }
    ]
  }

  onPaging(event) {
  }
  savePart(){
    this.saveMaterialListData.emit(this.materialCreateObject)
  }
  onChange(event, part,index) {
    console.log("part item",part)
    let checked: boolean = event.srcElement.checked;
    this.formObject.qtyOnHand = part.qtyOnHand;
    this.formObject.qtyAvailable = part.qtyAvailable;
    // this.onPartSelect.emit({ checked: checked, part: part });

    if(checked==true){
      this.formObject.qtyOnHand = part.qtyOnHand;
      this.formObject.qtyAvailable = part.qtyAvailable;
      this.materialCreateObject.conditionCodeId=part.conditionId;
      this.materialCreateObject.itemMasterId=part.itemMasterId;
      this.materialCreateObject.unitCost=part.unitCost;
      this.materialCreateObject.partNumber=part.partNumber;
      this.materialCreateObject.itemClassificationId=part.itemClassificationId;
      this.materialCreateObject.itemClassification=part.itemClassification;
      this.materialCreateObject.partDescription=part.description;
      this.materialCreateObject.workOrderId=this.workOrderId;
      this.materialCreateObject.workFlowWorkOrderId=this.workFlowWorkOrderId;
      this.materialCreateObject.taskId=this.formObject.taskId;
      this.materialCreateObject.qtyOnHand = part.qtyOnHand;
      this.materialCreateObject.qtyAvailable = part.qtyAvailable;
      this.materialCreateObject.materialMandatoriesId=this.formObject.materialMandatoriesId ? this.formObject.materialMandatoriesId :1;
      this.materialCreateObject.stockLineId= null;
      this.materialCreateObject.quantity=this.formObject.quantity;
      this.materialCreateObject.provisionId=this.formObject.provisionId
      this.materialCreateObject.provision='';
      console.log("formObject",this.formObject);
    }else{
      this.formObject.qtyOnHand = part.qtyOnHand;
      this.formObject.qtyAvailable = part.qtyAvailable;
      this.materialCreateObject={};
  
    }
  }

  onChangeStock(event, part, salesMargin) {
    console.log("part item",part)
    let checked: boolean = event.srcElement.checked;
  if(checked==true){
    this.formObject.qtyOnHand = part.qtyOnHand;
    this.formObject.qtyAvailable = part.qtyAvailable;
    this.materialCreateObject.conditionCodeId=part.conditionId;
    this.materialCreateObject.itemMasterId=part.itemMasterId;
    this.materialCreateObject.unitCost=part.unitCost;
    this.materialCreateObject.partNumber=part.partNumber;
    this.materialCreateObject.itemClassificationId=part.itemClassificationId;
    this.materialCreateObject.itemClassification=part.itemClassification;
    this.materialCreateObject.partDescription=part.description;
    this.materialCreateObject.workOrderId=this.workOrderId;
    this.materialCreateObject.workFlowWorkOrderId=this.workFlowWorkOrderId;
    this.materialCreateObject.taskId=this.formObject.taskId;
    this.materialCreateObject.qtyOnHand = part.qtyOnHand;
    this.materialCreateObject.qtyAvailable = part.qtyAvailable;
    this.materialCreateObject.materialMandatoriesId=this.formObject.materialMandatoriesId ? this.formObject.materialMandatoriesId :1;
    this.materialCreateObject.stockLineId= part.stockLineId;
    this.materialCreateObject.quantity=this.formObject.quantity
    this.materialCreateObject.provisionId=this.formObject.provisionId
    this.materialCreateObject.provision='';
    console.log("formObject",this.formObject);
  }else{
    this.formObject.qtyOnHand = part.qtyOnHand;
    this.formObject.qtyAvailable = part.qtyAvailable;
    this.materialCreateObject={};

  }
    // this.select.emit({ checked: checked, part: part, salesMargin: salesMargin });
  }
  materialCreateObject:any={  
    isActive: true,
    isDeferred: false,
    isDeleted: false,
    createdBy:this.userName,
    updatedBy:this.userName,
    createdDate: new Date(),
    updatedDate: new Date(),
    memo: "",
    materialMandatoriesId: 1,
    workflowMaterialListId: "0",
  };


  // AltPartMasterPartId: null
  // MaterialMandatoriesName: "Mandatory"
  // billingRate: 0
  // extendedCost: "100.00"
  // extendedPrice: "0.00"
  // extraCost: "0.00"

  // itemClassification: "Rotables"
  // itemClassificationId: 10
  // itemMasterId: 213
  // markupPercentageId: 0
  // materialMandatoriesId: 1
  // qtyAvail: 0
  // qtyOnHand: 1
  // quantity: "10"
  // stockLineId: 499
  // stockType: "OEM"
  // unitOfMeasure: "Ea"
  // unitOfMeasureId: 3












  dismissItemMasterModel() {
    this.isViewOpened = false;
    this.modal.close()
  }

  getCheckBoxDisplay(stockLineItem, rowIndex, isStock) {
    if (this.selectedParts.length > 0) {
      let sameParts = [];
      if (isStock) {
        sameParts = this.selectedParts.filter(part =>
          part.partNumber == this.formObject.partNumber && part.stockLineNumber == stockLineItem.stockLineNumber
        );
      } else {
        sameParts = this.selectedParts.filter(part =>
          part.partNumber == stockLineItem.partNumber
        );
      }

      let qtyQuoted = 0;
      if (sameParts && sameParts.length > 0) {
        sameParts.forEach(samePart => {
          qtyQuoted = qtyQuoted + samePart.quantityFromThis;
        });
      }
      if (qtyQuoted < stockLineItem.qtyAvailable) {
        let remained = stockLineItem.qtyAvailable - qtyQuoted;
        if (remained != stockLineItem.qtyAvailable) {
          if (isStock) {
            this.roleUpMaterialList[rowIndex]['qtyRemainedToQuote'] = stockLineItem.qtyAvailable - qtyQuoted;
          } else {
            this.parts[rowIndex]['qtyRemainedToQuote'] = stockLineItem.qtyAvailable - qtyQuoted;
          }
        }
        if (this.roleUpMaterialList[rowIndex]['qtyRemainedToQuote'] != this.roleUpMaterialList[rowIndex].qtyAvailable) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    } else {
      this.selectedParts = [];
      return false;
    }
  }

  getStocklineAccess() {
  }

  viewSelectedRow(part, rowindex) {
    if (this.parts.length > 0) {
      this.parts.forEach((part, index) => {
        if (rowindex != index) {
          this.hideme[index] = false;
        }
      })
    }
    this.stockLineViewedRow = rowindex;
    part.isShowPlus = false;
    this.roleUpMaterialList = [];
    this.customPaginate.filters.itemMasterId = part.partId;
    this.customPaginate.filters.conditionId = part.conditionId;
    this.customPaginate.filters.partNumber = part.partNumber;
    this.isSpinnerVisible = true;
    // this.salesQuoteService.getSearchPartResult()
    //   .subscribe(data => {
    //     this.parts = data;
    //     this.totalRecords = this.parts.length;
    //     this.pageLinks = Math.ceil(
    //       this.totalRecords / 10
    //     );
    //     this.isSpinnerVisible = false;
    //   }, error => {
    //     this.isSpinnerVisible = false;
    //   });

    // this.salesQuoteService.getSearchPartObject()
    //   .subscribe(data => {
    //     this.query = data;
    //   });
    this.formObject.conditionId = part.conditionId;
    this.formObject.partId = part.partId;
    this.service.searchstocklinefromsoqpop(this.searchQuery)
      .subscribe(data => {
        this.isSpinnerVisible = false;
        let resultdata = data['data'];
        if (resultdata && resultdata.length > 0) {
          this.roleUpMaterialList = resultdata;
          this.roleUpMaterialList.forEach((part, i) => {
            this.roleUpMaterialList[i]['qtyRemainedToQuote'] = this.roleUpMaterialList[i].qtyAvailable;
          });
        } else {
          this.roleUpMaterialList = [];
        }
        this.salesQuoteService.getSelectedParts().subscribe(data => {
          if (data && data.length > 0) {
            this.selectedParts = data;
          }
        })
        this.hideme[rowindex] = !this.hideme[rowindex];
        this.rowIndex = rowindex;
      }, error => {
        this.isSpinnerVisible = false;
      });
  }

  viewStockSelectedRow(rowData) {
    this.modal = this.modalService.open(StocklineViewComponent, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
    this.modal.componentInstance.stockLineId = rowData.stockLineId;
  }

  viewStockLineHistory(rowData) {
    this.modal = this.modalService.open(StocklineHistoryComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    this.modal.componentInstance.stockLineId = rowData.stockLineId;
  }

  openStocklineAudit(row) {
    this.isSpinnerVisible = true;
    this.service.getStocklineAudit(row.stockLineId).subscribe(response => {
      this.auditHistory = response.map(res => {
        return {
          ...res,
          quantityOnHand: (res.quantityOnHand || res.quantityOnHand == 0) ? formatNumberAsGlobalSettingsModule(res.quantityOnHand, 0) : '',
          quantityReserved: (res.quantityReserved || res.quantityReserved == 0) ? formatNumberAsGlobalSettingsModule(res.quantityReserved, 0) : '',
          quantityIssued: (res.quantityIssued || res.quantityIssued == 0) ? formatNumberAsGlobalSettingsModule(res.quantityIssued, 0) : '',
          quantityAvailable: (res.quantityAvailable || res.quantityAvailable == 0) ? formatNumberAsGlobalSettingsModule(res.quantityAvailable, 0) : '',
          purchaseOrderUnitCost: res.purchaseOrderUnitCost ? formatNumberAsGlobalSettingsModule(res.purchaseOrderUnitCost, 2) : '',
          repairOrderUnitCost: res.repairOrderUnitCost ? formatNumberAsGlobalSettingsModule(res.repairOrderUnitCost, 2) : '',
          unitSalesPrice: res.unitSalesPrice ? formatNumberAsGlobalSettingsModule(res.unitSalesPrice, 2) : '',
          coreUnitCost: res.coreUnitCost ? formatNumberAsGlobalSettingsModule(res.coreUnitCost, 2) : '',
          lotCost: res.lotCost ? formatNumberAsGlobalSettingsModule(res.lotCost, 2) : '',
        }
      });
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    })
  }

  getColorCodeForHistory(i, field, value) {
    const data = this.auditHistory;
    const dataLength = data.length;
    if (i >= 0 && i <= dataLength) {
      if ((i + 1) === dataLength) {
        return true;
      } else {
        return data[i + 1][field] === value
      }
    }
  }

  get masterCompanyId(): number {
    return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : 1;
  }
  //part filters start from here
  async searchPartByPartNumber(event) {
    if (event.query !== undefined && event.query !== null) {
      this.bindPartsDroppdown(event.query);
    }
  }


  onConditionSelect() {
    if (this.formObject.conditionIds.length > 0 && this.formObject.partNumber && this.formObject.quantity > 0){
      // this.searchDisabled = false;
    }
  }

  partDetails: any = [];
  partDetailsList: any = [];
  bindPartsDroppdown(query) {
    // this.searchDisabled = true;
    let partSearchParamters = {
      'partNumber': query,
      "restrictPMA": this.formObject.restrictPMA,
      "restrictDER": this.formObject.restrictDER,
      "customerId": this.customer.customerId,
      "custRestrictDER": this.customer.restrictDER,
      "custRestrictPMA": this.customer.restrictPMA,
      "includeAlternatePartNumber": this.formObject.includeAlternatePartNumber,
      "includeEquivalentPartNumber": this.formObject.includeEquivalentPartNumber,
      "idlist": '0',
      "masterCompanyId": this.masterCompanyId
    };
    this.itemMasterService.searchPartNumberAdvanced(partSearchParamters).subscribe(
      (result: any) => {
        if (result && result.length > 0) {
          this.partDetailsList = result;
          this.partDetails = [...this.partDetailsList];
        }
        else {
          this.partDetailsList = [];
          this.partDetails = [];
        }
        // this.changeDetector.detectChanges();
      }
    )
  }
  onPartNumberSelect(part: any) {
  
    this.resetActionButtons();
    this.formObject.partNumber = part.partNumber;
    this.formObject.partId = part.partId;
    this.formObject.partDescription = part.partDescription;
    this.formObject.customerId = this.customer.customerId;
    this.formObject.conditionId = 0;
    this.formObject.quantityAlreadyQuoted = 0;
    this.formObject.quantity = 0;
    this.formObject.quantityRequired = 0;
    this.formObject.quantityToQuote = 0;
    this.formObject.qtyOnHand = 0;
    this.formObject.qtyAvailable = 0;
    this.formObject.includeMultiplePartNumber = false;
    // if (this.formObject.conditionIds.length > 0 && this.formObject.quantity > 0)
    // this.searchDisabled = false;
    // this.calculate();
  }

  resetActionButtons() {
    // this.searchDisabled = true;
    //this.historicalDisabled = true;
  }

  search($event, programaticSearch = false) {
    // let searchQuery = JSON.parse(JSON.stringify(this.formObject));
    this.formObject.restrictDER = !this.formObject.restrictDER;
    this.formObject.restrictPMA = !this.formObject.restrictPMA;
    if (this.formObject.conditionIds !== undefined && this.formObject.conditionIds.length == 0) {
      this.formObject.conditionIds.push(this.formObject.conditionId);
    }

   



    // let searchQuery= new ItemMasterSearchQuery();
    this.searchQuery.partSearchParamters=this.formObject;

console.log("this.formObject",this.formObject)



    if (!programaticSearch) {
      $event.preventDefault();
    }
    if (this.formObject.includeMultiplePartNumber) {
      // this.getMultipartsQuery();
    } else {
      switch (this.formObject.itemSearchType) {
        case ItemSearchType.StockLine:
          this.isSpinnerVisible = true;
          console.log("hello viewa")
          this.service.searchstocklinefromsoqpop(this.searchQuery)
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

              this.formObject.qtyOnHand = qtyOnHandTemp;
              this.formObject.qtyAvailable = qtyAvailableTemp;
              this.parts = result['data'];
              // this.onPartSearch.emit(result);
            }, error => {
              this.isSpinnerVisible = false;
            });
          break;
        default:
          this.isSpinnerVisible = true;
          this.itemMasterService.searchitemmasterfromsoqpop(this.searchQuery)
            .subscribe(result => {
              this.isSpinnerVisible = false;
              if (result && result['data'] && result['data'][0]) {
                // this.formObject.qtyOnHand = result['data'][0].qtyOnHand;
                // this.formObject.qtyAvailable = result['data'][0].qtyAvailable;
              }
              this.parts = result['data'];
              // this.onPartSearch.emit(result);
            }, error => {
              this.isSpinnerVisible = false;
            });
          break;
      }
    }
  }
  provisionListData:any=[];
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
setEditArray:any;
taskList:any=[];
getTaskList() {  
  this.setEditArray=[];
  // if(this.editData){
  //     this.setEditArray.push(this.editData.taskId ? this.editData.taskId :0)
  // }else{
  // } 
  this.setEditArray.push(0);
  const strText = '';
  this.commonService.autoSuggestionSmartDropDownList('Task', 'TaskId', 'Description', strText, true, 0, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
   this.taskList = res.map(x => {
          return {
              id: x.value,
              description: x.label.toLowerCase(),
              taskId: x.value,
              label:x.label.toLowerCase(),
          }
      });
      if (this.taskList) {
        this.taskList.forEach(
            task => {
                if (task.description == "Assemble" || task.description == "assemble") {
                    this.formObject.taskId = task.taskId;
                }
            }
        )
    }
  },
      err => {
      })
}
get userName(): string {
  return this.authService.currentUser ? this.authService.currentUser.userName : "";
}

onClose() {
  this.close.emit(true);
}
saveWorkOrderMaterialList(data) { 
      const materialArr = data.materialList.map(x => {
          return {
              ...x,
              masterCompanyId: this.authService.currentUser.masterCompanyId,
              isActive: true,
              createdBy: this.userName,
              updatedBy: this.userName,
              workOrderId: this.workOrderId,
              workFlowWorkOrderId: this.workFlowWorkOrderId,
              AltPartMasterPartId : null,
              materialMandatoriesId :x.materialMandatoriesId,
              extendedCost:x.extendedCost? x.extendedCost : 0,
              unitCost:x.unitCost?  x.unitCost: 0,
              partNumber: x.partItem.partName,
              taskId:(typeof x.taskId == 'object')? x.taskId.taskId :x.taskId 
          }
      })
      this.isSpinnerVisible = true;            
      this.workOrderService.createWorkOrderMaterialList(materialArr).subscribe(res => {
          this.isSpinnerVisible = false;
          // this.workFlowObject.materialList = [];
          // this.moduleName,
          this.alertService.showMessage(
       '',
              'Saved Work Order MaterialList Succesfully',
              MessageSeverity.success
          );
          // this.getMaterialListByWorkOrderId();
      },
          err => {
          })
}
}