import { PermissionConstants } from './../../../generic/ModuleConstant';
import { ModuleConstants } from 'src/app/generic/ModuleConstant';
import { Component, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { Router } from '@angular/router';
import { StocklineService } from '../../../services/stockline.service';
import { fadeInOut } from '../../../services/animations';
import { AuthService } from '../../../services/auth.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { AuditHistory } from '../../../models/audithistory.model';
import { MasterCompany } from '../../../models/mastercompany.model';
import { Stockline } from '../../../models/stockline.model';
import { listSearchFilterObjectCreation, formatNumberAsGlobalSettingsModule } from '../../../generic/autocomplete';
import { Table } from 'primeng/table';
import { CommonService } from '../../../services/common.service';
import { getValueFromArrayOfObjectById, getValueFromObjectByKey, editValueAssignByCondition, getObjectById } from '../../../generic/autocomplete';
import { StocklineViewComponent } from '../../../shared/components/stockline/stockline-view/stockline-view.component';
import { StocklineReferenceStorage } from '../shared/stockline-reference-storage';
import { StocklineReference } from '../../../models/stocklineReference';
declare var $ : any;
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-stock-line-list',
    templateUrl: './stock-line-list.component.html',
    styleUrls: ['./stock-line-list.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe],
})
export class StockLineListComponent implements OnInit {
    activeIndex: number;
    modal: any;
    public sourceAction: Stockline;
    isSaving: boolean;
    isDeleteMode: boolean;
    currentDeletedstatus: boolean = false;
    currentstatus: string = 'Active';
    isEditMode: boolean;
    loadingIndicator: boolean;
    auditHisory: any[];
    selectedreason: any;
    disableSave: boolean;
    allComapnies: MasterCompany[];
    paginator: MatPaginator;
    sort: MatSort;
    sourceViewOptions: any = {};
    public sourceStockLine: any = {};

    createdBy: any = "";
    quantityOnHand: any = "";
    quantityReserved: any = "";
    quantityIssued: any = "";
    quantityAvailable: any = "";
    engineSerialNumber: any = "";
    aircraftTailNumber: any = "";
    blackListed: boolean = false;
    blackListedReason: any = "";
    incident: boolean = false;
    incidentReason: any = ""
    accident: boolean = false;
    accicentReason: any = "";
    memo: any = "";
    stockLineNumber: any = "";
    stocklineMatchKey: any = "";
    partNumber: any = "";
    purchaseOrderUnitCost: any = "";
    repairOrderUnitCost: any = "";
    receiverNumber: any = "";
    reconciliationNumber: any = "";
    unitSalesPrice: any = "";
    coreUnitCost: any = "";
    glAccountId: any = "";
    glAccountName: any = "";
    assetId: any = "";
    updatedBy: any = "";
    updatedDate: any = "";
    createdDate: any = "";
    oem: any = "";
    enableExternal: boolean = false;
    businessUnitName: any;
    company: any;
    managementStructureName: any;
    division: any;
    departmentName: any;
    partDescription: any;
    isSerialized: any;
    controlNumber: any;
    condition: any;
    serialNumber: any;
    shelfLife: any;
    shelfLifeExpirationDate: any;
    site: any;
    warehouse: any;
    location: any;
    shelf: any;
    bin: any;
    obtainFrom: any;
    obtainFromName: any;
    owner: any;
    ownerName: any;
    traceableTo: any;
    traceableToName: any;
    manufacturer: any;
    manufacturerLotNumber: any;
    manufacturingDate: any;
    manufacturingBatchNumber: any;
    partCertificationNumber: any;
    certifiedBy: any;
    certifiedDate: any;
    tagType: any;
    certifiedDueDate: any;
    calibrationMemo: any;
    orderDate: any;
    purchaseOrderNumber: any;
    repairOrderNumber: any;
    receivedDate: any;
    isHazardousMaterial: any;
    isPMA: any;
    isDER: any;
    isAdjustSaving: boolean;
    tagdate: any;
    entryDate: any;
    idNumber: any;
    manufacturerId: any;

    cyclesRemaining: any;
    cyclesSinceNew: any;
    cyclesSinceOVH: any;
    cyclesSinceInspection: any;
    cyclesSinceRepair: any;
    timeRemaining: any;
    timeSinceNew: any;
    timeSinceOVH: any;
    timeSinceInspection: any;
    lastSinceInspection: any;
    lastSinceOVH: any;
    lastSinceNew: any;
    timeSinceRepair: any;

    daysReceived: any;
    tagDays: any;
    manufacturingDays: any;
    openDays: any;
    nsn: any;

    totalRecords: number = 0;
    totalPages: number = 0;
    pageSize: number = 10;

    allCustomersList: any = [];
    allVendorsList: any = [];
    allCompanyList: any = [];
    auditHistory: any = [];
    adjAuditHistoryList: any = [];
    adjAuditHistoryData: any = [];
    dateObject: any = {};
    targetData: any;

    // To display the values in header and column name values
    headers = [        
        { field: 'partNumber', header: 'PN' },
        { field: 'partDescription', header: 'PN Description' ,width:"200px"},
        { field: 'manufacturer', header: 'Manufacturer' },
        { field: 'revisedPN', header: 'Revised PN' },
        { field: 'itemGroup', header: 'Item Group' },
        { field: 'unitOfMeasure', header: 'UOM' ,width:"60px"},
        { field: 'quantityOnHand', header: 'Qty OH',width:"100px" },
        { field: 'quantityAvailable', header: 'Qty Avail',width:"80px" },
        { field: 'serialNumber', header: 'Serial Num' },
        { field: 'isCustomerStock', header: 'C/S',width:"50px" },
        { field: 'stocklineNumber', header: 'SL Num',width:"100px"  },
        { field: 'controlNumber', header: 'Cntrl Num',width:"80px" },
        { field: 'idNumber', header: 'Cntrl ID',width:"80px" },
        { field: 'condition', header: 'Cond' },
        { field: 'receivedDate', header: "Rec'd Date",width:"120px" },
        // { field: 'awb', header: 'AWB' },
        { field: 'expirationDate', header: 'Exp Date',width:"120px" }, 
        { field: 'traceableToName', header: 'Traceable To' }, 
        { field: 'tagType', header: 'Tag Type' },
        { field: 'taggedByName', header: 'Tagged By' },
        { field: 'tagDate', header: 'Tag Date',width:"120px" },
        // { field: 'createdBy', header: 'Created By' },
        // { field: 'createdDate', header: 'Created Date' },
        { field: 'partCertificationNumber', header: 'Certified Num' },
        { field: 'certifiedBy', header: 'Cert By' },
        { field: 'certifiedDate', header: 'Cert Date',width:"120px" },
        { field: 'updatedBy', header: 'Updated By' },
        { field: 'updatedDate', header: 'Updated Date',width:"120px" },
        { field: 'companyName', header: 'Level 01' },
        { field: 'buName', header: 'Level 02' },
        { field: 'divName', header: 'Level 03' },
        { field: 'deptName', header: 'Level 04' },
    ]
    selectedGridColumns = this.headers;
    lazyLoadFilterData: any;
    pageIndex: number = 0;
    data: any = [];
    private table: Table;
    viewSLInfo: any = {};
    timeLifeInfo: any = {};
    managementStructure: any = {};
    filterText: string = '';
    dataSource: MatTableDataSource<any>;
    cols: any[];
    allStockInfo: StockLineListComponent[] = [];
    public allWorkFlows: StockLineListComponent[] = [];
    isSpinnerVisible: boolean = true;
    stocklineReferenceData: StocklineReference;
    emptyInputFields: string;
    currentStock: string = 'stock';
    globalSearchText: string;
    columnInputText: any;
    selectedOnly: boolean = false;
    isAdd:boolean=true;
    isEdit:boolean=true;
    isDelete:boolean=true;
    isView:boolean=true;
    isDownload:boolean=true;
    isActive:boolean=true;
    isstocklineadjustmentAdd:boolean=true;
    isstocklineadjustmentEdit:boolean=true;
    isstocklineadjustmentView:boolean=true;

    constructor(private workFlowtService: StocklineService, private datePipe: DatePipe, private _route: Router, private authService: AuthService, private commonService: CommonService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private stocklineReferenceStorage: StocklineReferenceStorage) {
        this.dataSource = new MatTableDataSource();
        this.isAdd=this.authService.checkPermission([ModuleConstants.Stockline+'.'+PermissionConstants.Add]);
        this.isEdit=this.authService.checkPermission([ModuleConstants.Stockline+'.'+PermissionConstants.Update]);
        this.isView=this.authService.checkPermission([ModuleConstants.Stockline+'.'+PermissionConstants.View]);
        this.isDelete=this.authService.checkPermission([ModuleConstants.Stockline+'.'+PermissionConstants.Delete]);
        this.isDownload=this.authService.checkPermission([ModuleConstants.Stockline+'.'+PermissionConstants.Download])
        this.isstocklineadjustmentEdit=this.authService.checkPermission([ModuleConstants.Stockline_Adjustment+'.'+PermissionConstants.Update]);
        this.isstocklineadjustmentAdd=this.authService.checkPermission([ModuleConstants.Stockline_Adjustment+'.'+PermissionConstants.Add]);
        this.isstocklineadjustmentView=this.authService.checkPermission([ModuleConstants.Stockline_Adjustment+'.'+PermissionConstants.View]);
    }

    ngOnInit(): void {
        this.activeIndex = 0;
        this.workFlowtService.currentUrl = '/stocklinemodule/stocklinepages/app-stock-line-list';
        this.workFlowtService.bredcrumbObj.next(this.workFlowtService.currentUrl);
    }

    closeDeleteModal() {
        $("#downloadConfirmation").modal("hide");
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    get employeeId() {
        return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
    }

    getFormatedDate(date) {
        if(date){
            let actualDate = new Date(date);
            return `${actualDate.getMonth()}/${actualDate.getDate()}/${actualDate.getFullYear()} ${actualDate.getHours()}:${actualDate.getMinutes()}`;
        }
        return date;
    }
  
    loadData(event) {
        this.isSpinnerVisible = true;
        this.lazyLoadFilterData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadFilterData = { ...event, filters: listSearchFilterObjectCreation(event.filters), globalFilter: this.filterText };
        this.lazyLoadFilterData.filters = { ...this.lazyLoadFilterData.filters, stocktype: this.currentStock };
        this.getList(this.lazyLoadFilterData);
    }

    getList(data) {
        this.isSpinnerVisible = true;
        data.filters.employeeId = this.employeeId;
        data.filters.masterCompanyId = this.currentUserMasterCompanyId;
        this.workFlowtService.getStockLineListing(data).subscribe(res => {           
            this.data = res['results'].map(x => {
				return {
                    ...x,
                    createdDate : x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a'): '',
                    certifiedDate : x.certifiedDate ?  this.datePipe.transform(x.certifiedDate, 'MM/dd/yyyy hh:mm a'): '',
                    updatedDate : x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a'): '',
                    receivedDate : x.receivedDate ?  this.datePipe.transform(x.receivedDate, 'MM/dd/yyyy'): '',
                    expirationDate : x.expirationDate ?  this.datePipe.transform(x.expirationDate, 'MM/dd/yyyy'): '',  
                    tagDate : x.tagDate ?  this.datePipe.transform(x.tagDate, 'MM/dd/yyyy'): '',                       
				}
			});	
            if (res.results.length > 0) {
                this.totalRecords = res.totalRecordsCount;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            } else {
                this.totalRecords = 0;
                this.totalPages = 0;
            }
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
            })
    }

    globalSearch(value) {
        this.isSpinnerVisible = true;
        this.filterText = value;
        this.lazyLoadFilterData.filters = { ...this.lazyLoadFilterData.filters, stocktype: this.currentStock };
        const data = {...this.lazyLoadFilterData, globalFilter: value}
        this.getList(data);
    }

    geStocklineByStock(value) {
        this.isSpinnerVisible = true;
        this.currentStock = value;
        this.lazyLoadFilterData.filters.stocktype = value;
        const data = {...this.lazyLoadFilterData, globalFilter: ''}
        this.data.forEach(x => {
            x.createdDate = this.getFormatedDate(x.createdDate);
            x.certifiedDate = this.getFormatedDate(x.certifiedDate);
            x.updatedDate = this.getFormatedDate(x.updatedDate);
        })
        this.getList(data);
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
    
    columnsChanges() {
        this.refreshList();
    }

    refreshList() {
        this.table.reset();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    routeToPORO(part, type) {
        this.workFlowtService.getDataForPOROByStocklineId(part.stockLineId).subscribe(data => {
            if (data) {
              this.stocklineReferenceData = data;
              this.stocklineReferenceStorage.stocklineReferenceData = this.stocklineReferenceData;
              if (type == "RO") {
                this._route.navigateByUrl('vendorsmodule/vendorpages/app-create-ro');
              }
              if (type == "PO") {
                this._route.navigateByUrl('vendorsmodule/vendorpages/app-create-po');
              }      
            }
        }, error => this.saveFailedHelper(error));
    }

    changeStatus(rowData) {
        this.workFlowtService.updateActionforActive(rowData, this.userName).subscribe(res => {
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        })
    }

    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }    

    openView(row) {
        this.modal = this.modalService.open(StocklineViewComponent, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modal.componentInstance.stockLineId = row.stockLineId;
        this.modal.result.then(() => { }, () => { });
    }

    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    exportCSV(dt) {
        this.isSpinnerVisible = true;
        const isdelete = this.currentDeletedstatus ? true : false;
        let PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": {"employeeId": this.employeeId, "masterCompanyId": this.currentUserMasterCompanyId, "status": this.currentstatus, "isDeleted": isdelete }, "globalFilter": "" }
        let filters = Object.keys(dt.filters);
        filters.forEach(x => {
            PagingData.filters[x] = dt.filters[x].value;
        });
          this.workFlowtService.getStockLineListing(PagingData).subscribe(    
            results => {
                this.loadingIndicator = false;
                results['results'].forEach(x => {
                    x.receivedDate = x.receivedDate ?  this.datePipe.transform(x.receivedDate, 'MMM-dd-yyyy'): '';  
                    x.expirationDate = x.expirationDate ?  this.datePipe.transform(x.expirationDate, 'MMM-dd-yyyy'): '';  
                    x.tagDate = x.tagDate ?  this.datePipe.transform(x.tagDate, 'MMM-dd-yyyy'): '';                       
                    //x.createdDate = x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '';
                    x.certifiedDate = x.certifiedDate ?  this.datePipe.transform(x.certifiedDate, 'MMM-dd-yyyy hh:mm a'): '';
                    x.updatedDate = x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '';
                })
                dt._value = results['results'];
                dt.exportCSV();
                dt.value = this.data;
                this.isSpinnerVisible = false;
            }, err => {
                this.isSpinnerVisible = false;
            }
        );
    } 

    errorMessageHandler(log) {
        this.isSpinnerVisible = false;
        var msg = '';

        if (typeof log.error == 'string') {
            this.alertService.showMessage(
                'Error',
                log.error,
                MessageSeverity.error
            );

        } else {
            if (log.error && log.error.errors.length > 0) {
                for (let i = 0; i < log.error.errors.length; i++) {
                    msg = msg + log.error.errors[i].message + '<br/>'
                }
            }
            this.alertService.showMessage(
                log.error.message,
                msg,
                MessageSeverity.error
            );
        }
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    openDelete(content, row) {

        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openEdits(row) {
        this.workFlowtService.isEditMode = true;
        this.isSaving = true;
        this.workFlowtService.listCollection = row; //Storing Row Data  and saving Data in Service that will used in StockLine Setup
        const { stockLineId } = row;
        this._route.navigateByUrl(`/stocklinemodule/stocklinepages/app-stock-line-setup/edit/${stockLineId}`);
    }

    openStocklineAudit(row) {
        this.isSpinnerVisible = true;
        this.workFlowtService.getStocklineAudit(row.stockLineId).subscribe(response => {
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
        }, error => this.saveFailedHelper(error))
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
    
    getColorCodeForAdjAudit(i, field, value) {
		const data = this.adjAuditHistoryData;
		const dataLength = data.length;
		if (i >= 0 && i <= dataLength) {
			if ((i + 1) === dataLength) {
				return true;
			} else {
				return data[i + 1][field] === value
			}
		}
	}

    openAdjustment(row) {
        this.workFlowtService.isAdjustment = true;
        this.isAdjustSaving = true;
        this.workFlowtService.adjustmentCollection = row;
        this._route.navigateByUrl(`/stocklinemodule/stocklinepages/app-stock-adjustment/${row.stockLineId}`);
    }

    openStocklineAdj(row) {
        this.workFlowtService.getStocklineAdjList(row.stockLineId).subscribe(res => {
            this.adjAuditHistoryList = res.map(x => {                
                if(x.stocklineAdjustmentDataTypeId == 11 || x.stocklineAdjustmentDataTypeId == 12 || x.stocklineAdjustmentDataTypeId == 13) {
                    return {
                        ...x,
                        changedFrom: formatNumberAsGlobalSettingsModule(x.changedFrom, 2),
                        changedTo: formatNumberAsGlobalSettingsModule(x.changedTo, 2),
                        auditRightAlign: true
                    }                                        
                }
                if(x.stocklineAdjustmentDataTypeId == 10) {
                    return {
                        ...x,
                        changedFrom: formatNumberAsGlobalSettingsModule(x.changedFrom, 0),
                        changedTo: formatNumberAsGlobalSettingsModule(x.changedTo, 0),
                        auditRightAlign: true
                    } 
                }
                return {
                    ...x,
                } 
            });
        }, error => this.saveFailedHelper(error))
    }

    openStocklineAdjData(row) {
        this.workFlowtService.getStocklineAdjData(row.stockLineId, row.stocklineAdjustmentDataTypeId).subscribe(res => {
            this.adjAuditHistoryData = res.map(x => {                
                if(x.stocklineAdjustmentDataTypeId == 11 || x.stocklineAdjustmentDataTypeId == 12 || x.stocklineAdjustmentDataTypeId == 13) {
                    return {
                        ...x,
                        changedFrom: formatNumberAsGlobalSettingsModule(x.changedFrom, 2),
                        changedTo: formatNumberAsGlobalSettingsModule(x.changedTo, 2),
                        auditRightAlign: true
                    }                                        
                }
                if(x.stocklineAdjustmentDataTypeId == 10) {
                    return {
                        ...x,
                        changedFrom: formatNumberAsGlobalSettingsModule(x.changedFrom, 0),
                        changedTo: formatNumberAsGlobalSettingsModule(x.changedTo, 0),
                        auditRightAlign: true
                    } 
                }
                return {
                    ...x,
                } 
            });
        }, error => this.saveFailedHelper(error))
    }

    dismissStockAdjAudit() {
        $('#stockAdjAudit').modal('hide');
    }

    private saveCompleted(user?: any) {
        this.isSaving = false;
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
        }

    }
    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    public navigateTogeneralInfo() {
        this.workFlowtService.isEditMode = false;
        this.workFlowtService.enableExternal = false;
        this._route.navigateByUrl('stocklinemodule/stocklinepages/app-stock-line-setup');
    }

    enableDateFilter(el) {
        if (el.value === '') { el.classList.add("hidePlaceHolder"); }
        else el.classList.remove("hidePlaceHolder");
    }

    getColorCodeForStockLineAdjHistory(i, field, value) {
        const data = this.adjAuditHistoryList;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    dateFilterForTable(date, field) {
        const minyear = '1900';
        const dateyear = moment(date).format('YYYY');
        this.dateObject={}
        date=moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY');
        if(date !="" && moment(date, 'MM/DD/YYYY',true).isValid()){
            if (dateyear > minyear) {
                // if(field=='createdDate'){
                //     this.dateObject={'createdDate':date}
                if(field=='certifiedDate'){
                    this.dateObject={'certifiedDate':date}
                }else if(field=='updatedDate'){
                    this.dateObject={'updatedDate':date}
                }else if(field=='receivedDate'){
                    this.dateObject={'receivedDate':date}
                }else if(field=='expirationDate'){
                    this.dateObject={'expirationDate':date}
                }else if(field=='tagDate'){
                    this.dateObject={'tagDate':date}
                }
                this.lazyLoadFilterData.filters = { ...this.lazyLoadFilterData.filters ,...this.dateObject};
                const PagingData = { ...this.lazyLoadFilterData, filters: listSearchFilterObjectCreation(this.lazyLoadFilterData.filters) }
                this.getList(PagingData); 
            }
        }else{
            this.lazyLoadFilterData.filters = { ...this.lazyLoadFilterData.filters,...this.dateObject};
            // if(this.lazyLoadFilterData.filters && this.lazyLoadFilterData.filters.createdDate){
            //     delete this.lazyLoadFilterData.filters.createdDate;
            // }
            if(this.lazyLoadFilterData.filters && this.lazyLoadFilterData.filters.certifiedDate){
                delete this.lazyLoadFilterData.filters.certifiedDate;
            }
            if(this.lazyLoadFilterData.filters && this.lazyLoadFilterData.filters.updatedDate){
                delete this.lazyLoadFilterData.filters.updatedDate;
            }
            if(this.lazyLoadFilterData.filters && this.lazyLoadFilterData.filters.receivedDate){
                delete this.lazyLoadFilterData.filters.receivedDate;
            }
            if(this.lazyLoadFilterData.filters && this.lazyLoadFilterData.filters.expirationDate){
                delete this.lazyLoadFilterData.filters.expirationDate;
            }
            if(this.lazyLoadFilterData.filters && this.lazyLoadFilterData.filters.tagDate){
                delete this.lazyLoadFilterData.filters.tagDate;
            }
            this.lazyLoadFilterData.filters = { ...this.lazyLoadFilterData.filters,...this.dateObject};
                const PagingData = { ...this.lazyLoadFilterData, filters: listSearchFilterObjectCreation(this.lazyLoadFilterData.filters) }
                this.getList(PagingData); 
        }              
    }
}
