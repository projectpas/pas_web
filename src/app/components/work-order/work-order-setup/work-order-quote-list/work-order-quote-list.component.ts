import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import {  ActivatedRoute } from '@angular/router';
import { WorkOrderQuoteService } from '../../../../services/work-order/work-order-quote.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { CommonService } from '../../../../services/common.service';
import { WorkFlowtService } from '../../../../services/workflow.service';
import { CurrencyService } from '../../../../services/currency.service';
import { listSearchFilterObjectCreation } from '../../../../generic/autocomplete';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
declare var $ : any;
import {AlertService} from '../../../../services/alert.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { DatePipe } from "@angular/common";
import { Table } from 'primeng/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../..//services/auth.service';
@Component({
  selector: 'app-work-order-quote-list',
  templateUrl: './work-order-quote-list.component.html',
  styleUrls: ['./work-order-quote-list.component.scss']
})
/** WorkOrderQuote component*/
export class WorkOrderQuoteListComponent implements OnInit {
  breadcrumbs: MenuItem[];
  @Output() closeView = new EventEmitter();
  public woQuoteList: any[];
  private onDestroy$: Subject<void> = new Subject<void>();
  pageSize: number = 10;
  first=0
  private table: Table;
  modal: NgbModalRef;
  headers = [
    { field: 'quoteNumber', header: 'Quote Num' },
    { field: 'workOrderNum', header: 'WO Num' },
    { field: 'customerName', header: 'Cust Name' },
    { field: 'customerCode', header: 'Cust Code' },
    { field: 'openDate', header: 'Open Date' },
    { field: 'promisedDate', header: 'Promise Date' },
    { field: 'estCompletionDate', header: 'Est. Comp Date' },
    { field: 'quoteStatus', header: 'Quote Status' },
    { field: "createdDate", header: "Created Date", width: "130px" },
    { field: "createdBy", header: "CreatedBy", width: "130px" },
    { field: "updatedDate", header: "Updated Date", width: "130px" },
    { field: "updatedBy", header: "UpdatedBy", width: "130px" }
]
  selectedColumns = this.headers;
  pageIndex: number = 0;
  totalRecords: number=0;
  totalPages: number;
  woQuoteViewData: any;
  isSpinnerVisible: boolean = false;
  lazyLoadEventData: any;
  isGlobalFilter: boolean = false;
  filterText: any = '';
  filteredText: any = '';
  constructor(private router: ActivatedRoute,      private authService: AuthService, private modalService: NgbModal, private datePipe: DatePipe,private workOrderService: WorkOrderQuoteService, private commonService: CommonService, private _workflowService: WorkFlowtService, private alertService:AlertService, private workorderMainService: WorkOrderService, private currencyService:CurrencyService, private cdRef: ChangeDetectorRef,  private route: Router) {}
  ngOnInit() {
    this.breadcrumbs = [
      { label: 'Work Order Quote' },
      { label: 'Work Order Quote List' },
  ];
  }
  getColorCodeForMultiple(data) {
    return data['partNoType'] === 'Multiple' ? 'green' : 'black';
  }
  getPageCount(totalNoofRecords, pageSize) {
   const value= Math.ceil(totalNoofRecords / pageSize)
   return value ? value :0
}
  convertDate(key, data) {
    if (key === 'openDate') {
        return moment(data['openDate']).format('MM-DD-YYYY');
    }
    else if (key === 'promisedDate') {
        return moment(data['promisedDate']).format('MM-DD-YYYY');
    }
    else  if (key === 'estCompletionDate') {
        return moment(data['estCompletionDate']).format('MM-DD-YYYY');
    } else {
        return data[key];
    }


  }
  columnsChanges() {
    this.refreshList();
}
openDownload(content) {
  this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
}

closeModal() {
  //$("#downloadConfirmation").modal("hide");
  this.modal.close();
}

dismissModel() {
  this.modal.close();
}
refreshList() {
    this.table.reset();
}
  mouseOverData(key, data) {
    if (key === 'partNoType') {
        return data['partNos']
    } else if (key === 'pnDescriptionType') {
        return data['pnDescription']
    } else if (key === 'workScopeType') {
        return data['workScope']
    } else if (key === 'priorityType') {
        return data['priority']
    } else if (key === 'customerType') {
        return data['customer']
    }
    else if (key === 'openDate') {
        return moment(data['openDate']).format('MM-DD-YYYY');
    }
    else if (key === 'customerRequestDateType') {

        return this.convertmultipleDates(data['customerRequestDate']);
    }
    else if (key === 'promisedDateType') {
        return this.convertmultipleDates(data['promisedDate']);
    } else if (key === 'estimatedShipDateType') {
        return this.convertmultipleDates(data['estimatedShipDate']);
    } else if (key === 'stageType') {
        return data['stage']
    } else if (key === 'estimatedCompletionDateType') {
        return this.convertmultipleDates(data['estimatedCompletionDate']);
        // return data['estimatedCompletionDateType'] !== 'Multiple' ? moment(data['estimatedCompletionDate']).format('MM-DD-YYYY') : data['estimatedCompletionDate'];
    } else {
        return data[key]
    }

  }
  convertmultipleDates(value) {
    const arrDates = [];
    const arr = value.split(',');
    for (var i = 0; i < arr.length; i++) {
        arrDates.push(moment(arr[i]).format('MM-DD-YYYY'));
    }
    return arrDates;
  }
  edit(data){
    window.open(` /workordersmodule/workorderspages/app-work-order-quote?workorderid=${data.workOrderId}`, "_self");
  }
  view(data){
    this.woQuoteViewData = undefined;
    this.workOrderService.getWorkOrderQuoteData(data.workOrderQuoteId)
    .subscribe(
      (quoteData)=>{
        this.woQuoteViewData = quoteData;
      }
    )
  }
  pageIndexChange(event) {
    this.pageSize = event.rows;
}

loadData(event) {
  this.lazyLoadEventData = event;
  const pageIndex = parseInt(event.first) / event.rows;
  this.pageIndex = pageIndex;
  this.pageSize = event.rows;
  event.first = pageIndex;
  if (!this.isGlobalFilter) {   
    this.getAllWorkOrderQuoteList(event);       
} else {
    this.globalSearch(this.filterText)
}
}

fieldSearch(field) {
  this.isGlobalFilter = false;
  // if (field === 'workOrderStatus') {
  //     this.currentStatus = 'open';
  // }
}
globalSearch(value) {
  this.pageIndex = 0;
  this.filteredText = value;
  if (this.filteredText != "" && this.filteredText != null && this.filteredText != undefined) {
      this.isGlobalFilter = true;
  }
  else
  {
      this.isGlobalFilter = false;
  }        
  const pageIndex = parseInt(this.lazyLoadEventData.first) / this.lazyLoadEventData.rows;;
  this.pageIndex = pageIndex;
  this.pageSize = this.lazyLoadEventData.rows;
  this.lazyLoadEventData.first = pageIndex;
  this.lazyLoadEventData.globalFilter = value;
  this.filterText = value;
  this.lazyLoadEventData.filters = { ...this.lazyLoadEventData.filters};
  this.getAllWorkOrderQuoteList(this.lazyLoadEventData);
}
get currentUserMasterCompanyId(): number {
  return this.authService.currentUser
    ? this.authService.currentUser.masterCompanyId
    : null;
  }
  getAllWorkOrderQuoteList(data) {
      data.filters.masterCompanyId= this.currentUserMasterCompanyId;
      const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
      this.isSpinnerVisible = true;
      this.workOrderService.getWorkOrderQuoteList(PagingData).pipe(takeUntil(this.onDestroy$)).subscribe((res: any) => {
          // this.woQuoteList = res;
          this.isSpinnerVisible = false;
          this.woQuoteList = res['results'].map(x => {
            return {
                ...x,
                createdDate : x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a'): '',
                updatedDate : x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a'): '',
                openDate: x.openDate ? this.datePipe.transform(x.openDate, 'MM/dd/yyyy') : '',  
                promisedDate : x.promisedDate ?  this.datePipe.transform(x.promisedDate, 'MM/dd/yyyy hh:mm a'): '',
                estCompletionDate: x.estCompletionDate ? this.datePipe.transform(x.estCompletionDate, 'MM/dd/yyyy') : '',  
            }
        });

          if (res['results'].length > 0) {
        this.totalRecords = res.totalRecordsCount;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          }else {
            this.totalRecords = 0;
            this.totalPages = 0;
        }


      },err=>{
        this.isSpinnerVisible = false;
      })
  }


  exportCSV(dt) {
    let PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { masterCompanyId: this.currentUserMasterCompanyId}, "globalFilter": "" }
    let filters = Object.keys(dt.filters);
    filters.forEach(x => {
        PagingData.filters[x] = dt.filters[x].value;
    });
 this.workOrderService.getWorkOrderQuoteList(PagingData).pipe(takeUntil(this.onDestroy$)).subscribe((res: any[]) => {
     const vList = res['results'].map(x => {
                return {
                    ...x,
                    openDate: x.openDate ? this.datePipe.transform(x.openDate, 'MMM-dd-yyyy') : '',
                    promisedDate: x.promisedDate ? this.datePipe.transform(x.promisedDate, 'MMM-dd-yyyy hh:mm a') : '',
                    estCompletionDate: x.estCompletionDate ? this.datePipe.transform(x.estCompletionDate, 'MMM-dd-yyyy hh:mm a') : '',
                    createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                    updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
                }
            });
            dt._value = vList;
            dt.exportCSV();
            dt.value = this.woQuoteList;
            this.modal.close();
        }, err => {
        });
}
}
