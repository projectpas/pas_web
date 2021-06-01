import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth.service';
declare var $ : any;
import * as moment from 'moment';
import { formatNumberAsGlobalSettingsModule, listSearchFilterObjectCreation } from "../../../../generic/autocomplete";
import { templateJitUrl } from '@angular/compiler';
@Component({
    selector: 'app-work-order-labour-analysis',
    templateUrl: './work-order-labour-analysis.component.html',
    styleUrls: ['./work-order-labour-analysis.component.css']
})
/** WorkOrderMainComponent component*/ 
export class WorkOrderLabourAnalysisComponent implements OnInit, OnChanges {
    @Input() savedWorkOrderData;
    @Input() selectedPartNumber: any = {};
    @Input() subWorkOrderDetails;
    @Input() isSubWorkOrder:any=false;
    @Input() subWOPartNoId;
    lazyLoadEventData: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number = 10;
    data: any[] = [];
    isSpinnerVisible: boolean = false;
    viewType: any = 'detailedview';
    headers: any[];
    columns: any[];
    selectedColumns: any[];
    selectedColumn: any[];
    works: any[] = [];
    tempworks: any[] = [];
    showPaginator: boolean = false;
    isGlobalFilter: boolean = false;
    isDetailView: boolean = true;
    filterText: any = '';
    private onDestroy$: Subject<void> = new Subject<void>();
    workOrderId: any;
    
    constructor(private workOrderService: WorkOrderService, private authService: AuthService, ) { }

    ngOnInit() {
        this.workOrderId = this.savedWorkOrderData.workOrderId;
        this.initSummaryColumns();
        if (this.data.length != 0) {
            this.totalRecords = this.data.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        }
        this.getWorkOrderLabourAnalysisData(this.workOrderId);
    }

    ngOnChanges() {
        if (this.data.length != 0) {
            this.totalRecords = this.data.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        }
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }

    getWorkOrderLabourAnalysisData(workOrderId) {
        this.isSpinnerVisible = true;
        const id = this.isSubWorkOrder ? this.subWOPartNoId : this.selectedPartNumber.workOrderPartNumberId;
              this.workOrderService.workOrderLabourAnalysisData(workOrderId, id, this.isSubWorkOrder, this.isDetailView, this.authService.currentUser.masterCompanyId)
                  .pipe(takeUntil(this.onDestroy$)).subscribe(
                      (res: any) => {
                          this.isSpinnerVisible = false;
                          if (res) {
                              this.data = res;
                          }
                      },
                      err => {
                          this.isSpinnerVisible = false;
                      }
                  )
    }

    loadData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        if (this.viewType) {
            this.lazyLoadEventData.filters = {
                ...this.lazyLoadEventData.filters,
                viewType: this.viewType
            }
        }
    }

    initColumns() {
      this.headers = [
        { field: "workOrderNum", header: "WO Num" },         
        { field: "partNumber", header: "PN" },
        { field: 'revisedPN', header: 'Revised PN'},
        { field: "partDescription", header: "PN Description" },
        { field: 'customer', header: 'Customer'  },
        { field: 'hours', header: 'Act Hours'},
        { field: 'stdHours', header: 'Std Hours' },
        { field: 'burdenRateAmount', header: 'Var. Hours' },
        { field: 'varPercentage', header: 'Var %'},
        { field: 'stage', header: 'Stage' },
        { field: 'status', header: 'Status' },
      ];
        this.selectedColumns = this.headers;
      }

      initSummaryColumns() {
        this.headers = [
          { field: "workOrderNum", header: "WO Num", width: "120px" },         
          { field: "partNumber", header: "PN", width: "130px" },
          { field: 'revisedPN', header: 'Revised PN' },
          { field: "partDescription", header: "PN Description", width: "180px" },
          { field: 'customer', header: 'Customer' },
          { field: 'action', header: 'Task' },
          { field: 'expertise', header: 'Expertise' },
          { field: 'employeeName', header: 'Employee' },
          { field: 'hours', header: 'Act Hours',width:"60px" },
          { field: 'stdHours', header: 'Std Hours',width:"60px" },
          { field: 'burdenRateAmount', header: 'Var. Hours',width:"60px" },
          { field: 'varPercentage', header: 'Var %',width:"60px" },
          { field: 'stage', header: 'Stage' },
          { field: 'status', header: 'Status' },
        ];
        this.selectedColumns = this.headers;
      }

    changeOfStatus(part, viewType) {
        if (viewType == 'detailedview') {
          this.initSummaryColumns();
          this.data = JSON.parse(JSON.stringify(this.tempworks));
          this.isDetailView = true;
          this.getWorkOrderLabourAnalysisData(this.workOrderId);
    
        } else {
          this.initColumns();
          this.tempworks = JSON.parse(JSON.stringify(this.data));
          this.isDetailView = false;
          this.getWorkOrderLabourAnalysisData(this.workOrderId);
          //this.filterParts(this.data);
        }
      }

      filterParts(tempwo) {
        this.data = [];
        let uniqueParts = this.getUniqueParts(tempwo, 'partNumber');
        if (uniqueParts.length > 0) {
          uniqueParts.forEach((part, i) => {
            let childParts = tempwo.filter(selectedPart => selectedPart.partNumber == part.partNumber)
            if (childParts && childParts.length > 0) {
              uniqueParts[i] = this.calculateSummarizedRow(childParts, part);
              uniqueParts[i].childParts = childParts;
            }
          });
          this.data = uniqueParts;
        }
        this.totalRecords = this.data.length;
        this.totalPages = Math.ceil(
          this.totalRecords / this.pageSize
        );
        this.showPaginator = this.totalRecords > 0;
      }

      calculateSummarizedRow(parts, uniquePart) {
        uniquePart = parts[0];
        if (parts.length > 1) {
          parts.splice(0, 1);
          parts.forEach(part => {
            uniquePart.qty = this.getSum(uniquePart.qty, part.qty);
            uniquePart.markupExtended = this.getSum(uniquePart.markupExtended, part.markupExtended);
            uniquePart.grossSalePrice = this.getSum(uniquePart.grossSalePrice, part.grossSalePrice);
            uniquePart.salesDiscountExtended = this.getSum(uniquePart.salesDiscountExtended, part.salesDiscountExtended);
            uniquePart.netSales = this.getSum(uniquePart.netSales, part.netSales);
            uniquePart.misc = this.getSum(uniquePart.misc, part.misc);
            uniquePart.totalSales = this.getSum(uniquePart.totalSales, part.totalSales);
            uniquePart.unitCostExtended = this.getSum(uniquePart.unitCostExtended, part.unitCostExtended);
            uniquePart.marginAmountExtended = this.getSum(uniquePart.marginAmountExtended, part.marginAmountExtended);
            uniquePart.marginPercentage = this.getSum(uniquePart.marginPercentage, part.marginPercentage);
            uniquePart.freight = this.getSum(uniquePart.freight, part.freight);
            uniquePart.taxAmount = this.getSum(uniquePart.taxAmount, part.taxAmount);
            uniquePart.totalRevenue = this.getSum(uniquePart.totalRevenue, part.totalRevenue);
          })
          uniquePart.marginPercentage = uniquePart.marginPercentage / parts.length + 1;
        }
        return uniquePart;
      }

      getSum(num1, num2) {
        return Number(num1) + Number(num2);
      }
    
      getUniqueParts(myArr, prop1) {
        let uniqueParts = JSON.parse(JSON.stringify(myArr));
        uniqueParts.reduceRight((acc, v, i) => {
          if (acc.some(obj => v[prop1] === obj[prop1])) {
            uniqueParts.splice(i, 1);
          } else {
            acc.push(v);
          }
          return acc;
        }, []);
        return uniqueParts;
      }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    closeModal() {
        $("#downloadConfirmation").modal("hide");
    }

    mouseOverData(key, data) {
        if (key === 'partNumberType') {
          return data['partNumber']
        } else if (key === 'partDescriptionType') {
          return data['partDescription']
        } else if (key === 'priorityType') {
          return data['priority']
        }
        else if (key === 'quoteDate' && data[key]) {
          return moment(data['quoteDate']).format('MM-DD-YYYY');
        } else if (key === 'createdDate' && data[key]) {
          return moment(data['createdDate']).format('MM-DD-YYYY');
        } else if (key === 'updatedDate' && data[key]) {
          return moment(data['updatedDate']).format('MM-DD-YYYY');
        }
        else {
          return data[key];
        }
      }
    
      convertDate(key, data) {
        if ((key === 'quoteDate' || key === 'updatedDate' || key === 'createdDate') && data[key]) {
          return moment(data[key]).format('MM/DD/YYYY');
        } else {
          return data[key];
        }
      }
    
      getColorCodeForMultiple(data) {
        return data['partNumberType'] === 'Multiple' ? 'green' : 'black';
      }
    
      calculateMarginPercentage(part: PartDetail, i) {
        return ((this.data[i].marginAmountExtended / (this.data[i]['totalRevenue'])) * 100).toFixed(2);
      }
    
      calculateMarginAmount(part: PartDetail, i) {
        return (this.data[i].marginAmountExtended + this.data[i].misc).toFixed(2);
      }
    
      calculateTotalRevenue(part: PartDetail, i) {
        return (this.data[i].netSales + this.data[i].misc).toFixed(2);
      }
    
      calculateProductRevenue(part, i) {
        return this.data[i].netSales + this.data[i].misc; // + this.sales[i].freight + this.sales[i].taxAmount;
      }
    
      getPercentage(key) {
        if (this.data && this.data.length > 0) {
          let percentage = this.getTotalAmount(key);
          return (percentage / this.data.length).toFixed(2);
        }
      }
    
      getTotalAmount(key) {
        let total = 0;
        if (this.data && this.data.length > 0) {
          this.data.forEach(
            (part) => {
              total += Number(this.sumAmount(part, key));
            }
          )
        }
        total.toFixed(2);
        return this.formateCurrency(total);
      }
    
      sumAmount(part, key) {
        let total = 0;
        if (part[key]) {
          total += Number(part[key].toString().replace(/\,/g, ''));
        }
        return total.toFixed(2);
      }
    
      formateCurrency(amount) {
        return amount ? formatNumberAsGlobalSettingsModule(amount, 2) : '0.00';
      }
}

export class PartDetail {
    salesOrderPartId: number;
    partNumber: string;
    stockLineNumber: string;
    description: string;
    conditionId: number;
    conditionDescription: string;
    classification: string;
    itemClassification: any;
    itemGroup: any;
    quantityRequested: number;
    quantityAlreadyQuoted: number;
    quantityToBeQuoted: number;
    quantityFromThis: number;
    quantityAvailableForThis: number;
    uomName: string;
    currency: any;
    currencyId: string;
    currencyDescription: string;
    fixRate: number;
    partType: string;
    markUpPercentage: number;
    salesDiscount: number;
    itemMasterId: number;
    partId: number;
    stockLineId: number;
    masterCompanyId: number;
    method: string;
    methodType: string;
    serialNumber: string;
    pmaStatus: string;
    idNumber: string;
    salesPricePerUnit: number;
    markupPerUnit: number;
    salesDiscountPerUnit: number;
    netSalesPricePerUnit: number;
    unitCostPerUnit: number;
    marginAmountPerUnit: number;
    marginPercentagePerUnit: number;
    salesPriceExtended: number;
    markupExtended: number;
    salesDiscountExtended: number;
    netSalesPriceExtended: number;
    unitCostExtended: number;
    marginAmountExtended: number;
    marginPercentageExtended: number;
    taxCode: string;
    taxType: string;
    taxAmount: number;
    taxPercentage: number;
    freight: number;
    misc: number;
    totalSales: number;
    isApproved: boolean;
    salesOrderId: number;
    salesOrderQuoteId: number;
    salesOrderQuotePartId: number;
    qtyReserved: number;
    qtyAvailable: number;
    qtyToShip: number;
    qtyShipped: number;
    qtyInvoiced: number;
    invoiceDate: Date;
    invoiceNumber: string;
    shipReference: string;
    salesQuoteNumber: string;
    customerRef: string;
    priority: string;
    quoteDate?: Date;
    quoteVesrion: string;
    itar: string;
    eccn: string;
    customerRequestDate?: Date;
    promisedDate?: Date;
    estimatedShipDate?: Date;
    priorityId?: number;
    statusId?: number;
    CustomerReference: string;
    statusName: string;
    priorityName: string;
    controlNumber: string;
    grossSalePrice: number;
    grossSalePricePerUnit: number;
    altOrEqType: string;
    quantityOnHand: number;
    notes: string;
    createdBy: string;
    itemNo: number;
    qty: number;
  
    constructor() { }
  
    get QuantityToBeQuoted(): number {
      return this.quantityToBeQuoted;
    }
  
    set QuantityToBeQuoted(value: number) {
      this.quantityToBeQuoted = value;
    }
  
    get SalesPricePerUnit(): number {
      return this.salesPricePerUnit;
    }
  
    set SalesPricePerUnit(value: number) {
      this.salesPricePerUnit = value;
    }
  
    get MarkupPerUnit(): number {
      return this.markupPerUnit;
    }
  
    set MarkupPerUnit(value: number) {
      this.markupPerUnit = value;
    }
  
    get SalesDiscountPerUnit(): number {
      return this.salesDiscountPerUnit;
    }
  
    set SalesDiscountPerUnit(value: number) {
      this.salesDiscountPerUnit = value;
    }
  
    get NetSalesPricePerUnit(): number {
      return this.netSalesPricePerUnit;
    }
  
    set NetSalesPricePerUnit(value: number) {
      this.netSalesPricePerUnit = value;
    }
  
    get UnitCostPerUnit(): number {
      return this.unitCostPerUnit;
    }
  
    set MarginAmountPerUnit(value: number) {
      this.marginAmountPerUnit = value;
    }
  
    get MarginPercentagePerUnit(): number {
      return this.marginAmountPerUnit;
    }
  
    set MarginPercentagePerUnit(value: number) {
      this.marginAmountPerUnit = value;
    }
  
    get SalesPriceExtended(): number {
      return this.salesPriceExtended;
    }
  
    set SalesPriceExtended(value: number) {
      this.salesDiscountExtended = value;
    }
  
    get MarkupExtended(): number {
      return this.markupExtended;
    }
  
    set MarkupExtended(value: number) {
      this.markupExtended = value;
    }
  
    get SalesDiscountExtended(): number {
      return this.salesDiscountExtended;
    }
  
    set SalesDiscountExtended(value: number) {
      this.salesDiscountExtended = value;
    }
  
    get NetSalesPriceExtended(): number {
      return this.netSalesPriceExtended;
    }
  
    set NetSalesPriceExtended(value: number) {
      this.netSalesPriceExtended = value;
    }
  
    get UnitCostExtended(): number {
      return this.unitCostExtended;
    }
  
    set UnitCostExtended(value: number) {
      this.unitCostExtended = value;
    }
  
    get MarginAmountExtended(): number {
      return this.marginAmountExtended;
    }
  
    set MarginAmountExtended(value: number) {
      this.marginAmountExtended = value;
    }
  
    get MarginPercentageExtended(): number {
      return this.marginPercentageExtended;
    }
  
    set MarginPercentageExtended(value: number) {
      this.marginPercentageExtended = value;
    }
  
    get MarkUpPercentage(): number {
      return this.markUpPercentage;
    }
  
    set MarkUpPercentage(value: number) {
      this.markUpPercentage = value;
    }
  
    get SalesDiscount(): number {
      return this.salesDiscount;
    }
  
    set SalesDiscount(value: number) {
      this.salesDiscount = value;
    }
  }
  
