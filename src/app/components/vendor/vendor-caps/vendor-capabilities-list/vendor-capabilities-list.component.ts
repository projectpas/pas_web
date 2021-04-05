import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
// import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { Router } from '@angular/router';
import { fadeInOut } from '../../../../services/animations';
import { AuthService } from '../../../../services/auth.service';
import { AuditHistory } from '../../../../models/audithistory.model';
import { MasterCompany } from '../../../../models/mastercompany.model';
import { VendorService } from '../../../../services/vendor.service';
declare var $ : any;
import { VendorCapabilitiesService } from '../../../../services/vendorcapabilities.service';
import { ConfigurationService } from '../../../../services/configuration.service';
import { CommonService } from '../../../../services/common.service';
import { listSearchFilterObjectCreation } from '../../../../generic/autocomplete';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';

@Component({
    selector: 'app-vendor-capabilities-list',
    templateUrl: './vendor-capabilities-list.component.html',
    styleUrls: ['./vendor-capabilities-list.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})
/** vendor-capabilities-list component*/
export class VendorCapabilitiesListComponent implements OnInit {
    activeIndex: number;
    selectedColumns: any[] = [];
     downloadvendorCapsList: any = [];
    isDeleteMode: boolean;
    isEditMode: boolean;
    loadingIndicator: boolean;
    auditHisory: any[];
    selectedreason: any;
    disableSave: boolean;
    allComapnies: MasterCompany[];
    vendorName: any;
    vendorCode: any;
    modal: any;
    sourceAction: any;
    isSaving: boolean;
    allvendorCapsList: any[] = [];
    Active: string = "Active";
    selectedColumn: any;
    capabilityauditHisory: any[];
    vendorCapesGeneralInfo: any = {};
    aircraftListDataValues: any = [];
    status: string = "active";
    aircraftTablePageSize: Number = 6;
    colsaircraftLD: any[] = [
        { field: "aircraft", header: "Aircraft" },
        { field: "model", header: "Model" },
        { field: "dashNumber", header: "Dash Numbers" },
        { field: "memo", header: "Memo" }
    ];
    vendorNameHist: any;
    @Input() isEnableVendor: boolean;
    @Input() vendorId: number = 0;
    @Input() editVendorId: any;
    @Output() vendorCapabilityId = new EventEmitter<any>();
    totalRecords: number = 0;
    totalPages: number = 0;
    pageSize: number = 10;
    @Input() isViewMode: boolean = false;
    isCapesViewMode: boolean = false;
    vendorNameInHistory: any;
    vendorCodeInHistory: any;
    formData: any = new FormData();
    isSpinnerVisible: Boolean = false;
    dataSource: MatTableDataSource<any>;
    cols: any[];
    paginator: MatPaginator;
    sort: MatSort;
    currentDeletedstatus:boolean=false;
    restorerecord:any={}
    pageIndex: any = 0;
    dateObject: any = {};
    vendorData: any = {};
    viewPageSize: number = 5;
    lazyLoadEventData: any;
    lazyLoadEventDataInput: any;
    filterText: any = '';
    globalfilter: string;
    selectedRowforDelete: any;
    selectedOnly: boolean = false;
    targetData: any;
    showAdvancedSearchCard: boolean = false;
    search_PartNumberList: any = [];
    search_CapesTypeList: any = [];
    arraylistItemMasterId:any[] = [];
    arrayCapabilityTypelist:any[] = [];
    selectedPartNumberModel = [];
    selectedCapesTypeModel = [];
    isAdd:boolean=true;
    isEdit:boolean=true;
    isDelete:boolean=true;
    isDownload:boolean=true;

    constructor(private vendorService: VendorService, private modalService: NgbModal, private authService: AuthService,
        private _route: Router, private alertService: AlertService,
        private configurations: ConfigurationService,	private commonService: CommonService,
        private vendorCapesService: VendorCapabilitiesService, private datePipe: DatePipe) {
        this.dataSource = new MatTableDataSource();
        this.isAdd=this.authService.checkPermission([ModuleConstants.VendorCap+"."+PermissionConstants.Add]);
        this.isEdit=this.authService.checkPermission([ModuleConstants.VendorCap+"."+PermissionConstants.Update]);
        this.isDelete=this.authService.checkPermission([ModuleConstants.VendorCap+"."+PermissionConstants.Delete]);
        this.isDownload=this.authService.checkPermission([ModuleConstants.VendorCapList+"."+PermissionConstants.Download]);
    }

    ngOnInit() {
        if (!this.vendorId) {
            this.activeIndex = 0;
            this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-capabilities-list';
            this.vendorService.ShowPtab = false;
            this.vendorService.alertObj.next(this.vendorService.ShowPtab);
            this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
        }
        this.cols = [
            { field: 'vendorCode', header: 'Vendor Code' },
            { field: 'vendorName', header: 'Vendor Name' },
            { field: 'capabilityTypeName', header: 'Capability Type' },
            { field: 'partNumber', header: 'PN' },
            { field: 'partDescription', header: 'PN Description' },
            { field: 'vendorRanking', header: 'Vendor Ranking' },            
            { field: 'tat', header: 'TAT (Days)' },
            { field: 'cost', header: 'Price' },
            { field: 'memo', header: 'Memo' },
            { field: 'createdDate', header: 'Created Date' },
			{ field: 'createdBy', header: 'Created By' },
			{ field: 'updatedDate', header: 'Updated Date' },
			{ field: 'updatedBy', header: 'Updated By' },
        ];
        this.selectedColumns = this.cols;
    }

    private onDataLoadFailed(error: any) {
        this.isSpinnerVisible = false;
    }

    globalSearch(value) {
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status, isDeleted: this.currentDeletedstatus };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.getList(PagingData);
    }

    loadData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadEventDataInput = event;
        if (this.filterText == '') {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status, isDeleted: this.currentDeletedstatus }
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        } else {
            this.globalSearch(this.filterText);
        }
    }

    getList(inputData) {
        this.isSpinnerVisible = true;
        this.vendorService.getFilteredVendorCapabilityList(inputData).subscribe(
            results => this.onDataLoadSuccessful(results),
            error => this.onDataLoadFailed(error)
        );
    }

    resetGlobalFilter() {
        this.filterText = '';
        this.globalfilter = '';
    }

    dateFilterForTableVendorList(date, field) {
        this.dateObject={}
                date=moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY');
        if(date !="" && moment(date, 'MM/DD/YYYY',true).isValid()){
            if(field=='createdDate'){
                this.dateObject={'createdDate':date}
            }else if(field=='updatedDate'){
                this.dateObject={'updatedDate':date}
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status ,...this.dateObject};
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData); 
        }else{
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters,  status: this.status,...this.dateObject};
            if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate){
                delete this.lazyLoadEventDataInput.filters.createdDate;
            }
            if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate){
                delete this.lazyLoadEventDataInput.filters.updatedDate;
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status,...this.dateObject};
                const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                this.getList(PagingData); 
        }              
    }

	closeDeleteModal() {
        $("#downloadConfirmation").modal("hide");
    }

    exportCSV(dt) {
        this.isSpinnerVisible = true;
        let PagingData = {"first":0,"rows":dt.totalRecords,"sortOrder":1,"filters":{"status":this.status,"isDeleted":this.currentDeletedstatus},"globalFilter":""}
        let filters = Object.keys(dt.filters);
        filters.forEach(x=>{
			PagingData.filters[x] = dt.filters[x].value;
        })
        this.vendorService.getFilteredVendorCapabilityList(PagingData).subscribe(res => {
            dt._value = res[0]['results'].map(x => {
				return {
                    ...x,
                    createdDate : x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
                    updatedDate : x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
				}
			});	
            dt.exportCSV();
            dt.value = this.allvendorCapsList;
            this.isSpinnerVisible = false;
        },error => {
                this.onDataLoadFailed(error)
            },
        );
    }
    
    private onDataLoadSuccessful(allWorkFlows) {
        this.allvendorCapsList=[];
        this.isSpinnerVisible = false;
        if (allWorkFlows != undefined) {
            if (allWorkFlows[0]['results'].length > 0) {
                this.totalRecords = allWorkFlows[0]['totalRecordsCount'];
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            } else {
                this.totalRecords = 0;
                this.totalPages = 0;
            }
            this.isSpinnerVisible = false;
        } else {
            this.totalRecords = 0;
            this.totalPages = 0;
            this.isSpinnerVisible = false;
        }   
        allWorkFlows = allWorkFlows[0]['results'].map(x => {
            return {
                ...x,
                createdDate : x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a'): '',
                updatedDate : x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a'): '',
            }
        });	

        allWorkFlows.forEach(element => {
        if(element.isDeleted==false && this.currentDeletedstatus==false){
            this.allvendorCapsList.push(element);
        }else  if(element.isDeleted==true && this.currentDeletedstatus==true){
            this.allvendorCapsList.push(element);
        }
    });
        this.dataSource.data = allWorkFlows;
        this.isSpinnerVisible = false;
    }

    getVenCapesListByStatus(status) {
        this.lazyLoadEventDataInput.first = 0;
        this.status = status;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status, isDeleted: this.currentDeletedstatus };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.getList(PagingData);
    }

    getDeleteListByStatus(value){
        if(value){
            this.currentDeletedstatus=true;
        }else{
            this.currentDeletedstatus=false;
        }
        this.getVenCapesListByStatus(this.status ? this.status : 'active')
    } 

    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    
    restoreRecord(){       
        this.commonService.updatedeletedrecords('VendorCapability','VendorCapabilityId',this.restorerecord.vendorCapabilityId ).subscribe(res => {
            this.currentDeletedstatus=true;
            this.modal.close();
            this.getVenCapesListByStatus(this.status ? this.status : 'active')
            this.alertService.showMessage("Success", `Record Was Restored Successfully`, MessageSeverity.success);
        })
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    private refresh() {
        this.applyFilter(this.dataSource.filter);
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm' });
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

    openVendorCapes(content, row)
    {
        this.isCapesViewMode = true;
        this.vendorId = row.vendorId;
        this.sourceAction = row;
        this.vendorName = row.vendorName;
        this.vendorCode = row.vendorCode;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    dismissCapesModel() {
        this.isCapesViewMode = false;
        this.modal.close();
    }

    openEdits(row) {
        if (this.isEnableVendor) {
            const { vendorCapabilityId } = row;
            this.vendorCapabilityId.emit(vendorCapabilityId);
        }
        else {
            this.vendorService.isEditMode = true;
            this.isSaving = true;
            this.vendorService.listCollection = row; //Storing Row Data  and saving Data in Service that will used in StockLine Setup
            const { vendorCapabilityId } = row
            this._route.navigateByUrl(`/vendorsmodule/vendorpages/app-add-vendor-capabilities/edit/${vendorCapabilityId}`);
        }

    }

    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    public navigateTogeneralInfo() {
        this._route.navigateByUrl(`/vendorsmodule/vendorpages/app-add-vendor-capabilities`);
    }

    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceAction.isActive == false;
            this.vendorService.updateVendorCapability(this.sourceAction).subscribe(
                response => {
                    this.alertService.showMessage("Success", `Record was In-Activated successfully`, MessageSeverity.success);
                    this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters,  status: this.status,...this.dateObject};
                    if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate){
                        delete this.lazyLoadEventDataInput.filters.createdDate;
                    }
                    if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate){
                        delete this.lazyLoadEventDataInput.filters.updatedDate;
                    }
                    this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, isDeleted: this.currentDeletedstatus, status: this.status,...this.dateObject};
                        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                        this.getList(PagingData); 
                },
                error => this.saveFailedHelper(error));
        }
        else {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceAction.isActive == true;
            this.vendorService.updateVendorCapability(this.sourceAction).subscribe(
                response => {
                    this.alertService.showMessage("Success", `Record was Activated successfully`, MessageSeverity.success);
                    this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters,  status: this.status,...this.dateObject};
                    if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate){
                        delete this.lazyLoadEventDataInput.filters.createdDate;
                    }
                    if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate){
                        delete this.lazyLoadEventDataInput.filters.updatedDate;
                    }
                    this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, isDeleted: this.currentDeletedstatus, status: this.status,...this.dateObject};
                        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                        this.getList(PagingData); 
                },error => this.saveFailedHelper(error));
        }

    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.vendorService.deleteVendorCapability(this.sourceAction).subscribe(
            response => {
                this.alertService.showMessage("Success", `Record was deleted successfully`, MessageSeverity.success);

                this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters,  status: this.status,...this.dateObject};
                    
                if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate){
                    delete this.lazyLoadEventDataInput.filters.createdDate;
                }

                if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate){
                    delete this.lazyLoadEventDataInput.filters.updatedDate;
                }

                this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, isDeleted: this.currentDeletedstatus, status: this.status,...this.dateObject};
                
                const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                    
                this.getList(PagingData); 

                this.isDeleteMode = false;
            },
            error => this.saveFailedHelper(error));
        this.modal.close();
    }

    openHistory(content, row) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.isSaving = true;
        this.vendorNameHist = row.vendorName;
        this.vendorService.getVendorCapabilityAuditHistory(row.vendorCapabilityId, row.vendorId).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results, content),
            error => this.saveFailedHelper(error));
    }

    private onAuditHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.capabilityauditHisory = auditHistory;
        this.vendorNameInHistory = this.capabilityauditHisory[0].vendorName;
        this.vendorCodeInHistory = this.capabilityauditHisory[0].vendorCode;

        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.capabilityauditHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    gotoCreatePO(rowData) {      
        localStorage.setItem("itemMasterId",rowData.itemMasterId);
        localStorage.setItem("partNumber",rowData.partNumber);       
        const { vendorId } = rowData;
        this._route.navigateByUrl(`vendorsmodule/vendorpages/app-purchase-setup/vendor/${vendorId}`);
    }

    gotoCreateRO(rowData) {
        localStorage.setItem("itemMasterId",rowData.itemMasterId);
        localStorage.setItem("partNumber",rowData.partNumber);  
        const { vendorId } = rowData;
        this._route.navigateByUrl(`vendorsmodule/vendorpages/app-ro-setup/vendor/${vendorId}`);
    }

    viewSelectedRow(content,rowData) {
        this.getVendorCapabilitiesView(rowData.vendorCapabilityId);
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    getVendorCapabilitiesView(vendorCapesId) {
        this.isSpinnerVisible = true;
        this.vendorCapesService.getVendorCapabilitybyId(vendorCapesId).subscribe(res => {
            this.vendorCapesGeneralInfo = res;
            this.isSpinnerVisible = false;
        }, error => this.saveFailedHelper(error))
    }

    getVendorCapesAircraftView(vendorCapesId) {
        this.vendorCapesService.getVendorAircraftGetDataByCapsId(vendorCapesId).subscribe(res => {

            this.aircraftListDataValues = res.map(x => {
                return {
                    ...x,
                    aircraft: x.aircraftType,
                    model: x.aircraftModel,
                    dashNumber: x.dashNumber,
                    memo: x.memo,
                }
            })
        })
    }

    viewSelectedRowdbl(content,rowData) {
        this.viewSelectedRow(content,rowData);
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    enableDisableAdvancedSearch(val) {
        this.showAdvancedSearchCard = val;
        // reset the dropdowns
        this.selectedPartNumberModel = [];
        this.selectedCapesTypeModel = []; 
        if(val)
        {
            this.getItemMasterSmartDropDown();
            this.capabilityTypeListData();
        } 
        else
        {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, itemMasterId: this.selectedPartNumberModel.toString(), capabilityTypeId: this.selectedCapesTypeModel.toString(), status: this.status,...this.dateObject};
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData); 
        }
    }

    getItemMasterSmartDropDown(strText = ''){
		if(this.arraylistItemMasterId.length == 0) {
			this.arraylistItemMasterId.push(0); }
        this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'PartNumber','',true,50000,this.arraylistItemMasterId.join()).subscribe(response => {
            if(response)
            {
                this.search_PartNumberList = response;
            }            
		},err => {
			const errorLog = err;
			this.onDataLoadFailed(errorLog);
		});
    }

    advanSearchCapesInformation()
    {
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, itemMasterId: this.selectedPartNumberModel.toString(), capabilityTypeId: this.selectedCapesTypeModel.toString(), status: this.status,...this.dateObject};
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.getList(PagingData); 
    }

    capabilityTypeListData(strText = ''){
		if(this.arrayCapabilityTypelist.length == 0) {
			this.arrayCapabilityTypelist.push(0); }
        this.commonService.autoSuggestionSmartDropDownList('CapabilityType', 'CapabilityTypeId', 'Description','',true,50000,this.arrayCapabilityTypelist.join()).subscribe(response => {
            if(response)
            {
                this.search_CapesTypeList = response;
            }            
		},err => {
			this.onDataLoadFailed(err);
		});
    }

    customExcelUpload(event) {
        const file = event.target.files;
        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.formData.append('masterCompanyId', this.authService.currentUser.masterCompanyId.toString())
            this.formData.append('createdBy', this.userName);
            this.formData.append('updatedBy', this.userName);
            this.formData.append('isActive', 'true');
            this.formData.append('isDeleted', 'false');
            const data={'masterCompanyId': this.authService.currentUser.masterCompanyId,
                        'createdBy':this.userName,
                        'updatedBy':this.userName,
                        'isActive':true,
                        'isDeleted':false
            }

            this.vendorService.uploadVendorCapsList(this.formData, data).subscribe(res => {
                event.target.value = '';
                this.formData = new FormData();
                this.getVenCapesListByStatus(this.status ? this.status : 'active')
                this.alertService.showMessage(
                    'Success',
                    `Capability List Uploaded Successfully  `,
                    MessageSeverity.success
                );
            })
        }
    }

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=VendorCapability&fileName=VendorCaps.xlsx`;
        window.location.assign(url);
    }

    handleChanges(rowData, $event) {}
}