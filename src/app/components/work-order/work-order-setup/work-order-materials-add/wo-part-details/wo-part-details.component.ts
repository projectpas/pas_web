import { Component, Input, Output, EventEmitter,ElementRef,ViewChild, OnChanges, SimpleChanges } from "@angular/core";
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
import { AuthService } from "../../../../../services/auth.service";
import { ItemMasterService } from "../../../../../services/itemMaster.service";
import { ItemSearchType } from '../../../../../../app/components/sales/quotes/models/item-search-type';
import { CommonService } from "../../../../../services/common.service";
import { WorkOrderService } from "../../../../../services/work-order/work-order.service";
declare var $: any;
@Component({
  selector: "app-wo-part-details",
  templateUrl: "./wo-part-details.component.html",
  styleUrls: ["./wo-part-details.component.scss"]
})
export class WoPartDetailsComponent implements OnChanges {
  @Input() customer: any;
  roleUpMaterialList: any = [];
  @Input() allConditionInfo: any;
  @Input() isStockLineViewMode = false;
  @Input() clearData = false;
  @Output() onPartSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() saveMaterialListData = new EventEmitter<any>();
  @Output() updateMaterialListData = new EventEmitter<any>();
  
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isEdit = false;
  @Input() editData;
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
  formObject:any={
    partNumberObj:undefined,
    quantity:0,
    conditionIds:undefined,
    provisionId:0
  };
  searchQuery={
    first:0,
    rows:10,
    limit:5,
    pageCount:10,
    page:10,
    partSearchParamters:{}
  }
  disableforPartNum:boolean=false;
  disableSaveUpdateButton:boolean=false;
  disableEditor:boolean=false;
  textAreaInfo:any;
  disableUpdateButton:boolean=true;
  partDetails: any = [];
  partDetailsList: any = [];
  setEditArray:any;
  taskList:any=[];
  provisionListData:any=[];
  materialMandatory:any=[];
  selectedMaterialPart:any;
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
   if(this.editData){
    // this.formObject=this.editData;
    this.disableforPartNum=true;
    this.formObject.restrictPMA= true,
    this.formObject.restrictDER= true,
    this.formObject.customerId= this.customer ? this.customer.customerId:0;
    this.formObject.partId=this.editData.partItem.partId;
    this.formObject.includeMultiplePartNumber= false;
    this.formObject.conditionId=this.editData.conditionCodeId;
    this.formObject.partNumber=this.editData.partItem.partName;
    this.formObject.partNumberObj={'partId': this.editData.partItem.partId,'partNumber': this.editData.partItem.partName};
    this.formObject.partDescription=this.editData.partDescription;
    this.formObject.conditionIds=[this.editData.conditionCodeId];
    this.formObject.quantity=this.editData.quantity;
    this.formObject.qtyOnHand=this.editData.qtyOnHand;
    this.formObject.qtyAvailable=this.editData.qtyAvail;
    // this.formObject.taskId=this.editData.taskId;
    // this.formObject.provisionId=this.editData.provisionId;
    // this.formObject.isDeferred=this.editData.isDeferred;
    // this.formObject.memo=this.editData.memo;
    // this.formObject.workOrderMaterialsId=this.editData.workOrderMaterialsId;
    // this.formObject.materialMandatoriesId=this.editData.materialMandatoriesId;
    // this.formObject.unitCost= this.editData.unitCost ? formatNumberAsGlobalSettingsModule(this.editData.unitCost, 2) : '0.00';
    // this.formObject.extendedCost= this.editData.extendedCost ? formatNumberAsGlobalSettingsModule(this.editData.extendedCost, 2) : '0.00';
    // this.getTaskList();
    // this.provisionList();
    // this.getMaterailMandatories();
    this.search();
   }else{
    // this.getTaskList();
    // this.provisionList();
    // this.getMaterailMandatories();
   }
    


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

  parsedText(text) {
    if (text) {
        const dom = new DOMParser().parseFromString(
            '<!doctype html><body>' + text,
            'text/html');
        const decodedString = dom.body.textContent;
        return decodedString;
   }
  }

  onAddTextAreaInfo(material) {
    this.disableEditor = true;
    this.textAreaInfo = material.memo;
  }

  onSaveTextAreaInfo(memo) {
    if (memo) {
        this.textAreaInfo = memo;
        this.formObject.memo = this.textAreaInfo;
    }
    this.disableEditor = true;
    $("#textarea-popup2").modal("hide");
    if(this.isEdit==true){
      this.disableUpdateButton = false;
    }
  }

  onCloseTextAreaInfo() {
    this.disableEditor = true;
    $("#textarea-popup2").modal("hide");
  }

  onPaging(event) {
  }




  getActive(){
    this.disableUpdateButton=false;
  }

  onChange(event, part,index) {
    console.log("part item",part)
    let checked: boolean = event.srcElement.checked;
    this.formObject.qtyOnHand = part.qtyOnHand;
    this.formObject.qtyAvailable = part.qtyAvailable; 
    // this.onPartSelect.emit({ checked: checked, part: part });

    if(checked==true){
      event.srcElement.checked=false;
      // this.parts.forEach(element => {
      //   element.isPartChecked=false;
      // });
      // part.isPartChecked==true;
      part.method='ItemMaster';
      this.materialCreateObject=part;
      
      this.formObject.qtyOnHand = part.qtyOnHand;
      this.formObject.qtyAvailable = part.qtyAvailable;
      this.materialCreateObject.conditionCodeId=part.conditionId;
      this.materialCreateObject.itemMasterId=part.itemMasterId;
      this.materialCreateObject.unitCost=part.unitCost ? formatNumberAsGlobalSettingsModule(part.unitCost, 2) : '0.00';
      this.materialCreateObject.partNumber=part.partNumber;
      this.materialCreateObject.itemClassificationId=part.itemClassificationId;
      this.materialCreateObject.itemClassification=part.itemClassification;
      this.materialCreateObject.partDescription=part.description;
      this.materialCreateObject.workOrderId=this.workOrderId;
      this.materialCreateObject.workFlowWorkOrderId=this.workFlowWorkOrderId;
      this.materialCreateObject.taskId=this.formObject.taskId;
      this.materialCreateObject.qtyOnHand = part.qtyOnHand;
      this.materialCreateObject.qtyAvailable = part.qtyAvailable;
      this.materialCreateObject.materialMandatoriesId=this.formObject.materialMandatoriesId ? this.formObject.materialMandatoriesId :null;
      this.materialCreateObject.stockLineId= null;
      this.materialCreateObject.quantity=this.formObject.quantity;
      this.materialCreateObject.provisionId=this.formObject.provisionId;
      this.materialCreateObject.unitOfMeasure=part.unitOfMeasure;
      this.materialCreateObject.unitOfMeasureId=part.unitOfMeasureId;
      this.materialCreateObject.provision=''; 
      this.materialCreateObject.memo=this.formObject.memo;
      console.log("form object",this.formObject);
      this.materialCreateObject.stocklineQuantity=part.qtyToOrder;
      this.disableSaveUpdateButton=true;
      this.selectedMaterialPart=undefined;
      this.selectedMaterialPart=this.materialCreateObject;
      this.openSalesMargin();
      this.provisionListData.forEach(element => {
        if(element.value==this.formObject.provisionId){
          this.materialCreateObject.provision=element.label;
        }
      });

    }else{ 
      this.selectedMaterialPart=undefined;
      this.parts.forEach(element => {
        element.isPartChecked=false;
      });
      part.isPartChecked==false;
      this.disableSaveUpdateButton=false;
      this.formObject.qtyOnHand = part.qtyOnHand;
      this.formObject.qtyAvailable = part.qtyAvailable;
      this.materialCreateObject={};
    }
  }
  childPartChecked
  onChangeStock(event, part, salesMargin) {
    console.log("part item",part)
    let checked: boolean = event.srcElement.checked;
    console.log("roleUpparts",this.roleUpMaterialList)
    if(checked==true){

      // this.roleUpMaterialList.forEach(element => {
      //   element.childPartChecked=false;
      // });
      part.method='StockLine';
    part.childPartChecked=true;
    this.materialCreateObject=part;
    this.formObject.qtyOnHand = part.qtyOnHand;
    this.formObject.qtyAvailable = part.qtyAvailable;
    this.materialCreateObject.conditionCodeId=part.conditionId;
    this.materialCreateObject.itemMasterId=part.itemMasterId;
    this.materialCreateObject.unitCost=part.unitCost ? formatNumberAsGlobalSettingsModule(part.unitCost, 2) : '0.00';
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
    this.materialCreateObject.provisionId=this.formObject.provisionId;
    this.materialCreateObject.provision='';
    this.materialCreateObject.memo=this.formObject.memo;
    this.materialCreateObject.unitOfMeasure=part.unitOfMeasure;
    this.materialCreateObject.unitOfMeasureId=part.unitOfMeasureId;
    this.disableSaveUpdateButton=true;
    this.materialCreateObject.stocklineQuantity=part.qtyAvailable;
    this.provisionListData.forEach(element => {
    if(element.value==this.formObject.provisionId){
      this.materialCreateObject.provision=element.label;
    }
    });
    this.selectedMaterialPart=this.materialCreateObject
    this.openSalesMargin();
  }else{
    this.roleUpMaterialList.forEach(element => {
      element.childPartChecked=false;
    });
    part.childPartChecked=false;
    this.formObject.qtyOnHand = part.qtyOnHand;
    this.formObject.qtyAvailable = part.qtyAvailable;
    this.materialCreateObject={};
    this.disableSaveUpdateButton=false;
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
    this.formObject.conditionId = part.conditionId;
    this.formObject.partId = part.partId;
    this.service.searchstocklinefromsoqpop(this.searchQuery)
      .subscribe(data => {
        this.isSpinnerVisible = false;
        let resultdata = data['data'];
        if (resultdata && resultdata.length > 0) {
          this.roleUpMaterialList = resultdata;
          this.roleUpMaterialList.forEach((part, i) => {
            part.childPartChecked=false;
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
  clearautoCompleteInput(){
    this.disableforPartNum=false; 
  }
  onPartNumberSelect(part: any) {
    this.disableforPartNum=true;
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
  }
  resetActionButtons() {
    // this.searchDisabled = true;
    //this.historicalDisabled = true;
  }
  search() {
    // let searchQuery = JSON.parse(JSON.stringify(this.formObject));
    this.formObject.restrictDER = !this.formObject.restrictDER;
    this.formObject.restrictPMA = !this.formObject.restrictPMA;
    if (this.formObject.conditionIds !== undefined && this.formObject.conditionIds.length == 0) {
      this.formObject.conditionIds.push(this.formObject.conditionId);
    }
    // let searchQuery= new ItemMasterSearchQuery();
    this.searchQuery.partSearchParamters=this.formObject;
    // if (!programaticSearch) {
    //   $event.preventDefault();
    // }
    if (this.formObject.includeMultiplePartNumber) {
      // this.getMultipartsQuery();
    } else {
      switch (this.formObject.itemSearchType) {
        case ItemSearchType.StockLine:
          this.isSpinnerVisible = true;
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
              this.parts.forEach(element => {
                element.isPartChecked=false;
              });
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
              this.parts.forEach(element => {
                element.isPartChecked=false;
                element.qtyToOrder=this.formObject.quantity;
              });
              // this.onPartSearch.emit(result);
            }, error => {
              this.isSpinnerVisible = false;
            });
          break;
      }
    }
  }

  provisionList() {
    this.isSpinnerVisible = true;
    let provisionIds = []; 
    if(this.editData){
      this.setEditArray.push(this.editData.provisionId ? this.editData.provisionId :0);
    }else{
      this.setEditArray.push(0);
    }
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

  getTaskList() {  
  this.setEditArray=[];

  if(this.editData){
    this.setEditArray.push(this.editData.taskId ? this.editData.taskId :0);
  }else{
    this.setEditArray.push(0);
  }
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
              if(!this.isEdit){
                if (task.description == "Assemble" || task.description == "assemble") {
                  this.formObject.taskId = task.taskId;
              }
              }
            }
        )
    }
  },
      err => {
      })
}

getMaterailMandatories() {
  let materialMandatoriesIds = [];
  materialMandatoriesIds.push(0)
  if(this.editData){
    materialMandatoriesIds.push(this.editData.materialMandatoriesId ? this.editData.materialMandatoriesId :0);
  }else{
   materialMandatoriesIds.push(0);
  }
  this.isSpinnerVisible = true;
  this.commonService.autoSuggestionSmartDropDownList('MaterialMandatories', 'Id', 'Name', '', true, 0, materialMandatoriesIds,this.masterCompanyId)
      .subscribe(res => {
          this.isSpinnerVisible = false;
          this.materialMandatory = res.map(x => {
              return {
                  ...x,
                  materialMandatoriesId: x.value,
                  materialMandatoriesName: x.label
              }
          });
          if(!this.isEdit){
          this.materialMandatory.forEach(element => {
            if (element.materialMandatoriesName == 'Mandatory') {
                this.formObject.materialMandatoriesId = element.materialMandatoriesId;
                this.formObject.materialMandatoriesName = element.materialMandatoriesName;
            }
        });
      }
      }, error => {
          this.isSpinnerVisible = false;
      });
}
get userName(): string {
  return this.authService.currentUser ? this.authService.currentUser.userName : "";
}
onClose() {
  this.close.emit(true);
}
onCloseMargin(){
  $("#showMarginDetails").modal("hide");
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
              unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
              partNumber: x.partItem.partName,
              taskId:(typeof x.taskId == 'object')? x.taskId.taskId :x.taskId 
          }
      })
      this.isSpinnerVisible = true;            
      this.workOrderService.createWorkOrderMaterialList(materialArr).subscribe(res => {
          this.isSpinnerVisible = false;
          this.alertService.showMessage('',
              'Saved Work Order MaterialList Succesfully',
              MessageSeverity.success);
      },
          err => {
          })
}

calculateExtendedCost(): void {
  this.formObject.unitCost = this.formObject.unitCost ? formatNumberAsGlobalSettingsModule(this.formObject.unitCost, 2) : '0.00';
  this.formObject.quantity = this.formObject.quantity ? this.formObject.quantity.toString().replace(/\,/g, '') : 0;
  if (this.formObject.quantity != 0 && this.formObject.unitCost) {
      this.formObject.extendedCost = formatNumberAsGlobalSettingsModule((this.formObject.quantity * this.formObject.unitCost.toString().replace(/\,/g, '')), 2);
  }
  else {
      this.formObject.extendedCost = "";
  }
  // this.calculateExtendedCostSummation();
}
editorgetmemo(ev) {
  this.disableEditor = false;
}

onCloseMaterial(){
  $("#showMarginDetails").modal("hide");
}
finalSaveMaterial(){

}

savePart(data){
console.log("wo part detaisl")
  // this.materialCreateObject.unitCost=this.formObject.unitCost ? formatNumberAsGlobalSettingsModule(this.formObject.unitCost, 2) : '0.00';
  // this.materialCreateObject.extendedCost=this.formObject.extendedCost ? formatNumberAsGlobalSettingsModule(this.formObject.extendedCost, 2) : '0.00';
  // this.materialCreateObject.memo=this.formObject.memo;
  // this.materialCreateObject.isDeferred=this.formObject.isDeferred;
  // this.materialCreateObject.mandatorySupplementalId=this.formObject.materialMandatoriesId;
  this.saveMaterialListData.emit(data);
  $("#showMarginDetails").modal("hide");
  this.close.emit(true);
  console.log("wo part detaisl22")
}

upDatePart(data){ 
  console.log("wo part detaisl22 ")
  // if(this.isEdit){
  //   this.materialCreateObject= this.editData
  //   this.materialCreateObject.workOrderMaterialsId=this.editData.workOrderMaterialsId;
  // }

  // this.materialCreateObject.mandatorySupplementalId=this.formObject.materialMandatoriesId;
  // this.materialCreateObject.provisionId=this.formObject.provisionId;
  // this.materialCreateObject.materialMandatoriesId=this.formObject.materialMandatoriesId ? this.formObject.materialMandatoriesId :null;
  // this.materialCreateObject.quantity=this.formObject.quantity;
  // this.materialCreateObject.taskId=this.formObject.taskId;
  // this.materialCreateObject.isDeferred=this.formObject.isDeferred;
  // this.materialCreateObject.memo=this.formObject.memo;
  //  this.materialCreateObject.unitCost=this.formObject.unitCost ? formatNumberAsGlobalSettingsModule(this.formObject.unitCost, 2) : '0.00';
  //  this.materialCreateObject.extendedCost=this.formObject.extendedCost ? formatNumberAsGlobalSettingsModule(this.formObject.extendedCost, 2) : '0.00';
  this.updateMaterialListData.emit(data)
  this.disableUpdateButton=true;
  $("#showMarginDetails").modal("hide");
  this.close.emit(true);
  console.log("wo part detaisl22444")
}
openSalesMargin() {
  // this.isEdit = false;
  // let contentMargin = this.salesMargin;
    //  this.woMarginModal = this.modalService.open(contentMargin, { size: "lg", backdrop: 'static', keyboard: false });
    //   this.woMarginModal.result.then(
    //     () => { },
    //     () => {
    //       // this.selectedPart.selected = false;
    //     }
    //   ); 



    $("#showMarginDetails").modal("show");

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