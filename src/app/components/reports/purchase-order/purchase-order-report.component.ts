import { Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { takeUntil } from 'rxjs/operators';
import { listSearchFilterObjectCreation } from '../../../generic/autocomplete';
import { Subject } from 'rxjs';
// import { StocklineService } from '../../../services/stockline.service';



@Component({
    selector: 'app-purchase-order-report',
    templateUrl: './purchase-order-report.component.html',
    styleUrls: ['./purchase-order-report.component.scss']
})
export class PurchaseOrderReportComponent implements OnInit {

    businessUnitList: any;
    divisionList: any;
    departmentList: any;
    stockLineForm: any = {};
    disableMagmtStruct: boolean = true;
    
    
    public stockLineReportList: any[];
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: any;
    totalPages: number;
    purchaseOrderReportList =[];
    legalEntityList: any;
    private onDestroy$: Subject<void> = new Subject<void>();
    managementStructure = {
        companyId: 0,
        buId: 0,
        divisionId: 0,
        departmentId: 0,
	}
    
    
    constructor(private router: ActivatedRoute, 
       // private stocklineService: StocklineService,
        private commonService: CommonService) { }
    ngOnInit() {

    }

    headers = [
       
       
        { field: 'purchaseOrderNumber', header: 'PO Num' },
        { field: 'purchaseOrderDate', header: 'PO Date' },
        { field: 'partNumber', header: 'Part Number' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'vendorName', header: 'Vendor Name' },
        { field: 'vendorCode', header: 'Vendor Code' },
        { field: 'unitOfMeasure', header: 'UOM' },
        { field: 'quantity', header: 'Quantity' },
        { field: 'unitPrice', header: 'Unit Price' },
        { field: 'currency', header: 'Currency' },
        { field: 'extendedCost', header: 'Extended Cost' },
        { field: 'Request Date', header: 'Request Date' },
        { field: 'Promise Date', header: 'Promise Date' },


        
    ]

    loadData(event){}
    // loadData(event) {
    //     const pageIndex = parseInt(event.first) / event.rows;;
    //     this.pageIndex = pageIndex;
    //     this.pageSize = event.rows;
    //     event.first = pageIndex;
    //     this.getStockLineReportViewList(event);
    // }

    // getStockLineReportViewList(data) {
    //     console.log(data);
    //     const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
    //     this.stocklineService.getStockLineReportViewList(PagingData).pipe(takeUntil(this.onDestroy$)).subscribe((res: any[]) => {
    //         this.stockLineReportList = res;
    //         if (res.length > 0) {
    //             this.totalRecords = res[0].totalRecords;
    //             this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    //         }

    //     })
    // }


    getManagementStructureOnEdit(managementStructureId) {
        this.commonService.getManagementStructureDetails(managementStructureId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.selectedLegalEntity(res.Level1);
            this.selectedBusinessUnit(res.Level2);
            this.selectedDivision(res.Level3);
            this.selectedDepartment(res.Level4);
            this.managementStructure = {
                companyId: res.Level1 !== undefined ? res.Level1 : 0,
                buId: res.Level2 !== undefined ? res.Level2 : 0,
                divisionId: res.Level3 !== undefined ? res.Level3 : 0,
                departmentId: res.Level4 !== undefined ? res.Level4 : 0,
			}
			this.onSelectManagementStruc();
        })
    }


    selectedLegalEntity(legalEntityId) {
		this.businessUnitList = [];
		this.divisionList = [];
		this.departmentList = [];
		this.managementStructure.buId = 0;
		this.managementStructure.divisionId = 0;
		this.managementStructure.departmentId = 0;

        if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
            this.stockLineForm.managementStructureId = legalEntityId;
            this.commonService.getBusinessUnitListByLegalEntityId(legalEntityId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.businessUnitList = res;
			});
		}	
		this.onSelectManagementStruc();
	}

	onSelectManagementStruc() {
		if (this.managementStructure.companyId != 0) {            
			this.disableMagmtStruct = false;
		} else {
			this.disableMagmtStruct = true;
		}
	}	

    selectedBusinessUnit(businessUnitId) {
		this.divisionList = [];
		this.departmentList = [];
		this.managementStructure.divisionId = 0;
		this.managementStructure.departmentId = 0;

        if (businessUnitId != 0 && businessUnitId != null && businessUnitId != undefined) {
            this.stockLineForm.managementStructureId = businessUnitId;
            this.commonService.getDivisionListByBU(businessUnitId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.divisionList = res;
            })
        }
    }
    selectedDivision(divisionUnitId) {
		this.departmentList = [];
		this.managementStructure.departmentId = 0;

        if (divisionUnitId != 0 && divisionUnitId != null && divisionUnitId != undefined) {
            this.stockLineForm.managementStructureId = divisionUnitId;
            this.commonService.getDepartmentListByDivisionId(divisionUnitId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.departmentList = res;
            })
        }
    }
    selectedDepartment(departmentId) {
        if (departmentId != 0 && departmentId != null && departmentId != undefined) {
            this.stockLineForm.managementStructureId = departmentId;
        }
	}
	


    // downloadStockLineReport() {
        
    //     this.stocklineService.downloadStockLineReport();
    // }

    //downloadStockLineReport(event) {

    //    const pageIndex = parseInt(event.first) / event.rows;;
    //    this.pageIndex = pageIndex;
    //    this.pageSize = event.rows;
    //    event.first = pageIndex;
    //    this.downloadStockLineReportList(event);
    //}

    //downloadStockLineReportList(data) {
    //    console.log(data);
    //    const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
    //    this.stocklineService.downloadStockLineReport(PagingData);
    //}
    downloadStockLineReport() {}
}