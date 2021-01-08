import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from "@angular/core";
import { ISalesQuote } from "../../../../../../models/sales/ISalesQuote.model";
// import { DataTable } from "primeng/datatable";
import { PartDetail } from "../../../models/part-detail";
import { IPartJson } from "../../../models/ipart-json";
import { SalesQuoteService } from "../../../../../../services/salesquote.service";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ItemMasterViewComponent } from "../../../../../item-masters/item-master-view/item-master-view.component";
import { SalesStockLineDetailsViewComponent } from "../../sales-stockline-part-details-view/sales-stockline-part-details-view.component";
import { StocklineService } from "../../../../../../services/stockline.service";
import { StocklineListSalesFilter } from "../../../../../../models/sales/StocklineListSalesFilter";
import { CustomPaginate } from "../../../../../../models/custom-paginate";
import { formatNumberAsGlobalSettingsModule, listSearchFilterObjectCreation } from "../../../../../../generic/autocomplete";
import { StocklineViewComponent } from "../../../../../../shared/components/stockline/stockline-view/stockline-view.component";
import { StocklineHistoryComponent } from "../../../../../../shared/components/stockline/stockline-history/stockline-history.component";
import { ItemMasterSearchQuery } from "../../../../quotes/models/item-master-search-query";
import { ItemSearchType } from "../../../../quotes/models/item-search-type";
import { AlertService, MessageSeverity } from "../../../../../../services/alert.service";

@Component({
  selector: "app-part-details",
  templateUrl: "./part-details.component.html",
  styleUrls: ["./part-details.component.scss"]
})
export class PartDetailsComponent implements OnChanges {
  @Input() customer: any;
  roleUpMaterialList: any = [];
  @Input() parts: IPartJson[];
  @Input() isStockLineViewMode = false;
  @Input() query: ItemMasterSearchQuery;
  @Output() onPartSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
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
  @Input('part-number') partNumber: string;
  @Input() stockLineInformation: IPartJson[];
  auditHistory: any = [];
  adjAuditHistoryList: any = [];
  adjAuditHistoryData: any = [];
  hideme = [];
  rowIndex = -1;;
  //@Input('modal-ref') modal: NgbModalRef;

  stockLineViewedRow: any;
  customPaginate: CustomPaginate<StocklineListSalesFilter> = new CustomPaginate<StocklineListSalesFilter>();
  constructor(private salesQuoteService: SalesQuoteService, private service: StocklineService,
    private modalService: NgbModal, public alertService: AlertService
  ) {

    this.parts = [];
    this.roleUpMaterialList = [];

    this.columns = [];
    this.stockLinecolumns = [];

    this.initColumns();
    this.part = null;

    this.customPaginate.filters = new StocklineListSalesFilter();
  }
  ngOnInit() {
    this.salesQuoteService.getSearchPartResult()
      .subscribe(data => {

        this.parts = data;
        this.query = data;
        this.totalRecords = this.parts.length;
        this.pageLinks = Math.ceil(
          this.totalRecords / 10
        );
      });


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
      { field: 'itemGroup', header: 'Item Group', width: '100px', textalign: 'left' },
      { field: 'manufacturer', header: 'Manufacturer', width: '90px', textalign: 'left' },
      { field: 'itemClassificationCode', header: 'Classification', width: '90px', textalign: 'left' },
      { field: 'conditionDescription', header: 'Cond', width: '90px', textalign: 'left' },
      { field: 'oempmader', header: 'OEM/PMA/DER', width: '90px', textalign: 'left' },
      { field: 'alternateFor', header: 'Alternate / Equivalency PN', width: '90px', textalign: 'left' },
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
      { field: 'Manufacturer', header: 'Manufacturer', width: '100px', textalign: 'left' },
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
      { field: 'memo', header: 'Memo', width: '80px', textalign: 'left' },
      // { field: '', header: 'Actions', width: '100px', textalign: 'left' },
    ]
  }

  onPaging(event) {

  }

  onChange(event, part) {
    let checked: boolean = event.srcElement.checked;
    this.onPartSelect.emit({ checked: checked, part: part });
  }
  onChangeStock(event, part, salesMargin) {
    let checked: boolean = event.srcElement.checked;
    this.select.emit({ checked: checked, part: part, salesMargin: salesMargin });
  }
  dismissItemMasterModel() {
    this.isViewOpened = false;
    this.modal.close()
  }


  getCheckBoxDisplay(stockLineItem, rowIndex, isStock) {
    if (this.selectedParts.length > 0) {
      // this.selectedParts = data;
      let sameParts = [];
      if (isStock) {
        sameParts = this.selectedParts.filter(part =>
          part.partNumber == this.query.partSearchParamters.partNumber && part.stockLineNumber == stockLineItem.stockLineNumber
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
      // return false;
    } else {
      this.selectedParts = [];
      return false;
    }
    // });
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
    this.salesQuoteService.getSearchPartResult()
      .subscribe(data => {
        this.parts = data;
        // this.parts.forEach((part, i) => {
        //   this.parts[i]['qtyRemainedToQuote'] = this.parts[i].qtyAvailable;
        // });
        //this.query = data;
        this.totalRecords = this.parts.length;
        this.pageLinks = Math.ceil(
          this.totalRecords / 10
        );
        this.isSpinnerVisible = false;
      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
        this.onDataLoadFailed(errorLog)
      });
    this.salesQuoteService.getSearchPartObject()
      .subscribe(data => {
        this.query = data;
      });

    // this.isSpinnerVisible = true;
    this.query.partSearchParamters.partId = part.partId;
    this.service.searchstocklinefromsoqpop(this.query)
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
        const errorLog = error;
        this.onDataLoadFailed(errorLog)
      });
  }

  viewStockSelectedRow(rowData) {
    this.modal = this.modalService.open(StocklineViewComponent, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });

    // this.modal = this.modalService.open(StocklineViewComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    this.modal.componentInstance.stockLineId = rowData.stockLineId;
    this.modal.result.then(() => {
    }, () => { })
  }

  viewStockLineHistory(rowData) {

    this.modal = this.modalService.open(StocklineHistoryComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    this.modal.componentInstance.stockLineId = rowData.stockLineId;
    this.modal.result.then(() => {
    }, () => { })
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
      })
      this.isSpinnerVisible = false
    }, error => {
      this.isSpinnerVisible = false;
      const errorLog = error;
      this.onDataLoadFailed(errorLog)
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

  onDataLoadFailed(log) {
    this.isSpinnerVisible = false;
    const errorLog = log;
    var msg = '';
    if (errorLog.message) {
      if (errorLog.error && errorLog.error.errors.length > 0) {
        for (let i = 0; i < errorLog.error.errors.length; i++) {
          msg = msg + errorLog.error.errors[i].message + '<br/>'
        }
      }
      this.alertService.showMessage(
        errorLog.error.message,
        msg,
        MessageSeverity.error
      );
    }
    else {
      this.alertService.showMessage(
        'Error',
        log.error,
        MessageSeverity.error
      );
    }
  }

}