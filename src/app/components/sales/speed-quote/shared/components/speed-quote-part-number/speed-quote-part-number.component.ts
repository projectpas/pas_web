import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ISpeedQuote } from "../../../../../../models/sales/ISpeedQuote.model";
import { IPartJson } from "../../models/ipart-json";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PartDetail } from "../../models/part-detail";
import { SalesQuoteService } from "../../../../../../services/salesquote.service";
import { ItemMasterSearchQuery } from "../../../../quotes/models/item-master-search-query";
import {
  AlertService,
  DialogType,
  MessageSeverity
} from "../../../../../../services/alert.service";
import { formatNumberAsGlobalSettingsModule } from "../../../../../../generic/autocomplete";
import { ISalesQuoteView } from "../../../../../../models/sales/ISalesQuoteView";
import { AuthService } from "../../../../../../services/auth.service";
import { CommonService } from "../../../../../../services/common.service";
import { ISalesOrderQuotePart } from "../../../../../../models/sales/ISalesOrderQuotePart";
declare var $: any;
import { SummaryPart } from "../../../../../../models/sales/SummaryPart";
import { StocklineViewComponent } from "../../../../../../shared/components/stockline/stockline-view/stockline-view.component";
import { SpeedQuoteService } from "../../../../../../services/speedquote.service";
@Component({
  selector: 'app-speed-quote-part-number',
  templateUrl: './speed-quote-part-number.component.html',
  styleUrls: ['./speed-quote-part-number.component.scss']
})
export class SpeedQuotePartNumberComponent {
  show: boolean;
  selectedSummaryRow: SummaryPart;
  selectedSummaryRowIndex = null;
  addPartModal: NgbModalRef;
  deletePartModal: NgbModalRef;
  salesMarginModal: NgbModalRef;
  modal: NgbModalRef;
  part: PartDetail;
  selectedPart: IPartJson;
  selectedParts: any[] = [];
  summaryParts: any[] = [];
  showPaginator: boolean;
  totalRecords: number;
  pageLinks: any;
  columns: any[];
  auditHistory = [];
  inputValidCheckHeader = false;;
  summaryColumns: any[] = [];
  @ViewChild("addPart", { static: false }) addPart: ElementRef;
  @ViewChild("salesMargin", { static: false }) salesMargin: ElementRef;
  @Input() customer: any;
  @Input() totalFreights = 0;
  @Input() totalCharges = 0;
  @Input() salesQuote: ISpeedQuote;
  @Input() isViewMode: Boolean;
  query: ItemMasterSearchQuery;
  @Input() salesQuoteView: ISalesQuoteView;
  @Input() defaultSettingPriority;
  @ViewChild("updatePNDetailsModal", { static: false })
  public updatePNDetailsModal: ElementRef;
  @Output() myEvent = new EventEmitter();
  isEdit: boolean = false;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output('on-parts-save') onPartsSavedEvent: EventEmitter<ISalesOrderQuotePart[]> = new EventEmitter<ISalesOrderQuotePart[]>();
  public partSaveConfirmationModal: ElementRef;
  isSuccess: boolean = false;
  defaultCurrencyId: any;
  defaultCurrencyDiscription: any;
  legalEntity: number;
  isSpinnerVisible = false;
  isStockLineViewMode = false;
  clearData = false;
  canSaveParts = false;
  priorities = [];
  saveButton = false;
  constructor(private modalService: NgbModal,
    //private salesQuoteService: SalesQuoteService,
    private alertService: AlertService,
    private authService: AuthService,
    private commonService: CommonService,
    private speedQuoteService: SpeedQuoteService,) {
    this.show = false;
    this.part = new PartDetail();
  }

  ngOnInit() {
  }

  addPartNumber(summaryRow: any = '', rowIndex = null) {
    this.speedQuoteService.resetSearchPart();
    this.inputValidCheckHeader = false;
    //this.salesQuoteService.getSearchPartResult();
    if (summaryRow) {
      this.selectedSummaryRow = summaryRow;
      this.selectedSummaryRowIndex = rowIndex;
    } else {
      this.selectedSummaryRow = null;
      this.selectedSummaryRowIndex = null;
    }
    this.openPartNumber(false);
  }
  openPartNumber(viewMode) {
    this.isStockLineViewMode = viewMode;
    let contentPart = this.addPart;
    this.addPartModal = this.modalService.open(contentPart, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
  }
}