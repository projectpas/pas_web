import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { SalesQuoteService } from "../../../../../../services/salesquote.service";
import { IPartJson } from "../../../models/ipart-json";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StocklineViewComponent } from '../../../../../../shared/components/stockline/stockline-view/stockline-view.component';
import { StocklineHistoryComponent } from '../../../../../../shared/components/stockline/stockline-history/stockline-history.component';

@Component({
  selector: "app-stockline-part-details",
  templateUrl: "./stockline-part-details.component.html",
  styleUrls: ["./stockline-part-details.component.scss"]
})
export class StocklinePartDetailsComponent implements OnChanges {
  @Input() customer: any;
  @Input() parts: IPartJson[];
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  selectedColumns: any[];
  showPaginator: boolean;
  totalRecords: number;
  pageLinks: any;
  columns: any[];
  modal: NgbModalRef;

  constructor(private salesQuoteService: SalesQuoteService, private modalService: NgbModal,) {
    this.parts = [];
    this.columns = [];
    this.initColumns();
  }

  ngOnInit() {
    this.salesQuoteService.getSearchPartResult()
      .subscribe(data => {
        this.parts = data;
        this.totalRecords = this.parts.length;
        this.pageLinks = Math.ceil(
          this.totalRecords / 10
        );
      });
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  initColumns() {
    this.columns = [
      { field: 'selected', header: '', width: '30px', textalign: 'left' },
      { field: 'method', header: 'Method', width: '100px', textalign: 'left' },
      { field: 'partNumber', header: 'PN', width: '60px', textalign: 'left' },
      { field: 'alternateFor', header: 'Alternate / Equivalency For', width: '160px', textalign: 'left' },
      { field: 'description', header: 'PN Description', width: '100px', textalign: 'left' },
      { field: 'conditionType', header: 'Cond Type', width: '80px', textalign: 'left' },
      { field: 'uom', header: 'UOM', width: '60px', textalign: 'left' },
      { field: 'qtyAvailable', header: 'Qty Available', width: '100px', textalign: 'right' },
      { field: 'qtyOnHand', header: 'Qty On Hand', width: '100px', textalign: 'right' },
      { field: 'qtyToOrder', header: 'Qty To Order', width: '100px', textalign: 'right' },
      { field: 'qtyOnOrder', header: 'Qty On Order', width: '100px', textalign: 'right' },
      { field: 'itemClassification', header: 'Item Classification', width: '120px', textalign: 'left' },
      { field: 'itemGroup', header: 'Item Group', width: '80px', textalign: 'left' },
      { field: 'controlName', header: 'Control Name', width: '100px', textalign: 'left' },
      { field: 'idNumber', header: 'Id Num', width: '70px', textalign: 'left' },
      { field: 'serialNumber', header: 'Serial Num', width: '80px', textalign: 'left' }
    ]
  }

  onPaging(event) {
  }

  onChange(event, part, salesMargin) {
    let checked: boolean = event.srcElement.checked;
    this.select.emit({ checked: checked, part: part, salesMargin: salesMargin });
  }

  viewSelectedRow(rowData) {
    this.modal = this.modalService.open(StocklineViewComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    this.modal.componentInstance.stockLineId = rowData.stockLineId;
  }

  viewStockLineHistory(rowData) {
    this.modal = this.modalService.open(StocklineHistoryComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    this.modal.componentInstance.stockLineId = rowData.stockLineId;
  }
}