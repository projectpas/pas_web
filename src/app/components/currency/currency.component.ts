import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';

import { CurrencyService } from '../../services/currency.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { Currency } from '../../models/currency.model';
declare var $ : any;
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import { MasterCompany } from '../../models/mastercompany.model';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AuthService } from '../../services/auth.service';
import { AuditHistory } from '../../models/audithistory.model';
import { MenuItem, LazyLoadEvent } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";
import { selectedValueValidate, validateRecordExistsOrNot, getObjectByValue, editValueAssignByCondition, getObjectById, getValueFromObjectByKey } from '../../generic/autocomplete';
import { Table } from 'primeng/table';
import { ConfigurationService } from '../../services/configuration.service';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-currency',
    templateUrl: './currency.component.html',
    styleUrls: ['./currency.component.scss'],
    animations: [fadeInOut]
})
/** Currency component*/
export class CurrencyComponent implements OnInit {
    
    totalRecords: number;
    originalData:any[] = [];
    totalPages: number;
    pageIndex: number = 0;
    modal: NgbModalRef;
    pageSize: number = 10;
    headers = [
        { field: 'displayName', header: 'Curr Name' },
        { field: 'code', header: 'Curr Code' },
        { field: 'symbol', header: 'Curr Symbol' },
        { field: 'countryName', header: 'Country' },

        { field: 'memo', header: 'Memo' }
    ];
    selectedColumns = this.headers;
    formData = new FormData()
    new = {
        code: "",
        displayName: "",
        isActive: true,
        masterCompanyId: 1,
        memo: "",
        symbol: "",   
        countryId:""
    }
    addNew = { ...this.new };
    disableSaveCurrencyCode: boolean = false;
    disableSaveCurrencyName: boolean = false;
    disableSaveCurrencySymbol: boolean = false;
    selectedRecordForEdit: any;
    currencyCodeList: any[];
    currencyNameList: any[];
    currencySymbolList: any[];
    viewRowData: any;
    isEdit: boolean = false;
    selectedRowforDelete: any;
    private table: Table;
    auditHistory: any[] = [];
    existingRecordsResponse: any;
    countrycollection: any[];
    countryListOriginal: any[];
    disableSaveCurrency:boolean=false;

    currentstatus: string = 'Active';
    rowIndex: any;
    AuditDetails: any;
    // curreencyPaginationList: any[] = [];
    // totelPages
    // event: any;
    // currency = [];
    // updatedByInputFieldValue: any;
    // createdByInputFieldValue: any;
    // memoInputFieldValue: any;
    // displayNameInputFieldValue: any;
    // symbolInputFieldValue: any;
    // matvhMode: any;
    // field: any;
    // display: boolean;
    // modelValue: boolean;
    // codeInputFieldValue: any;
    // currency_Name: any = "";
    // symbol: any =  "";
    // displayName: any = "";
    // memo: any = "";
    // createdBy: any = "";
    // updatedBy: any = "";
    // createdDate: any = "";
    // updatedDate: any = "";
    // selectedActionName: any;
    // disableSave: boolean;
    // actionamecolle: any[] = [];
    // AuditDetails: SingleScreenAuditDetails[];

    // auditHisory: AuditHistory[];
    // Active: string = "Active";
    // /** Currency ctor */
   
    // @ViewChild(MatPaginator) paginator: MatPaginator;
    // @ViewChild(MatSort) sort: MatSort;

    // displayedColumns = ['currencyId', 'code', 'symbol', 'displayName', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    // dataSource: MatTableDataSource<Currency>;
    // allCurrencyInfo: Currency[] = [];
    // sourceAction: Currency;

    // loadingIndicator: boolean;
   
    // actionForm: FormGroup;
    // title: string = "Create";
    // id: number;
    // errorMessage: any;
    // cols: any[];
    // selectedColumns: any[];
    // private isEditMode: boolean = false;
    // private isDeleteMode: boolean = false;
    // allComapnies: MasterCompany[];
    // private isSaving: boolean;
    // modal: NgbModalRef;
    // selectedColumn: Currency[];
    // currencyName: string;
    // filteredBrands: any[];
    // localCollection: any[] = [];
    // /** Currency ctor */

    // pageSearch: { query: any; field: any; };
    // first: number;
    // rows: number;
    // paginatorState: any;

    // currencyPagination: Currency[];//added
    // totalRecords: number;
    // loading: boolean;

    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private commonService: CommonService, private authService: AuthService,
         private _fb: FormBuilder, private alertService: AlertService,
          private masterComapnyService: MasterComapnyService, private modalService: NgbModal, public currencyService: CurrencyService, private dialog: MatDialog, private configurations: ConfigurationService) {
        // this.displayedColumns.push('action');
        // this.dataSource = new MatTableDataSource();

    }
    ngOnInit(): void {
        this.getList();
        this.getAllCountries();
        // this.cols = [
        //     //{ field: 'currencyId', header: 'Currency ID' },
        //     { field: 'code', header: 'CurrencyCode' },
        //     { field: 'symbol', header: 'Currency Symbol' },
        //     { field: 'displayName', header: ' Currency Name' },
        //     { field: 'memo', header: 'Memo' },
        //     { field: 'createdBy', header: 'Created By' },
        //     { field: 'updatedBy', header: 'Updated By' },
        //     //{ field: 'updatedDate', header: 'Updated Date' },
        //    //{ field: 'createdDate', header: 'Created Date' }
		// ];
		 this.breadCrumb.currentUrl = '/singlepages/singlepages/app-currency';
		 this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
        // this.selectedColumns = this.cols;

    }
    /*ngAfterViewInit() {
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
    }*/

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }
    getList() {
        this.currencyService.getCurrencyListAll().subscribe(res => {
           // this.currencyService.getCurrencyList().subscribe(res => {

            // const responseData = res[0];
            // this.originalData = responseData;
            this.originalTableData=res[0];
            this.getListByStatus(this.status ? this.status :this.currentstatus)



            // console.log(this.originalData);
            // this.totalRecords = responseData.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
    }
    getAllCountries() {
        this.currencyService.getCountryListAll().subscribe(res => {
          this.countryListOriginal = res[0];
       })
    }

    filterCountries(event) {
      this.countrycollection = this.countryListOriginal;

      this.countrycollection = [...this.countryListOriginal.filter(x => {
           return x.nice_name.toLowerCase().includes(event.query.toLowerCase())
        })]

    }

    getChange() {
        // if (this.disableSaveForDescriptionmsg == false) {
        //     this.disableSaveForDescription = false;
        // }

       this.disableSaveCurrencyName = false;
            this.disableSaveCurrency = false;
     
    }
  
    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);
        // this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }


    selectedCurrencyCode(object) {
        const exists = selectedValueValidate('code', object, this.selectedRecordForEdit)
        this.disableSaveCurrencyCode = !exists;
    }
    checkCurrencyCodeExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.originalData, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveCurrencyCode = true;
        }
        else {
            this.disableSaveCurrencyCode = false;
        }
    }
    filterCurrencyCode(event) {
        this.currencyCodeList = this.originalData;
        const currencyData = [...this.originalData.filter(x => {
            return x.code.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.currencyCodeList = currencyData;
    }

    selectedCurrencyName(object) {
        const exists = selectedValueValidate('displayName', object, this.selectedRecordForEdit)
        this.disableSaveCurrencyName = !exists;
        this.disableSaveCurrency=!exists;
    }
    checkCurrencyNameExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.originalData, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveCurrencyName = true;
            this.disableSaveCurrency=true;
        }
        else {
            this.disableSaveCurrencyName = false;
            this.disableSaveCurrency=false;
        }
    }
    filterCurrencyName(event) {
        this.currencyNameList = this.originalData;
        const currencyData = [...this.originalData.filter(x => {
            return x.displayName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.currencyNameList = currencyData;
    }

    selectedCurrencySymbol(object) {
        const exists = selectedValueValidate('symbol', object, this.selectedRecordForEdit)
        this.disableSaveCurrencySymbol = !exists;
    }
    checkCurrencySymbolExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.originalData, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveCurrencySymbol = true;
        }
        else {
            this.disableSaveCurrencySymbol = false;
        }
    }
    filterCurrencySymbol(event) {
        this.currencySymbolList = this.originalData;
        const currencyData = [...this.originalData.filter(x => {
            return x.symbol.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.currencySymbolList = currencyData;
    }

    save() {
        const data = {
            ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
            displayName: editValueAssignByCondition('displayName', this.addNew.displayName),
            code: editValueAssignByCondition('code', this.addNew.code),
            symbol: editValueAssignByCondition('symbol', this.addNew.symbol),
            countryId: getValueFromObjectByKey('countries_id', this.addNew.countryId),


        };
        if (!this.isEdit) {
            this.currencyService.newAddcurrency(data).subscribe(() => {
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added New Currency Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.currencyService.updatecurrency(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Updated Currency Successfully`,
                    MessageSeverity.success
                );
            })
        }
    }

    resetForm() {
        this.isEdit = false;
        this.selectedRecordForEdit = undefined;
        this.addNew = { ...this.new };
        this.disableSaveCurrencyCode = false;
        this.disableSaveCurrencyName = false;
        this.disableSaveCurrencySymbol = false;
    }

    viewSelectedRow(rowData) {
        console.log(rowData);
        this.viewRowData = rowData;
    }

    edit(rowData) {
        console.log(rowData);
        this.isEdit = true;
        this.disableSaveCurrency=true;
        this.disableSaveCurrencyName = false;
        this.disableSaveCurrencyCode = false;
        this.disableSaveCurrencySymbol = false;

        this.addNew = {
            ...rowData,
            displayName: getObjectById('currencyId', rowData.currencyId, this.originalData),
            code: getObjectById('currencyId', rowData.currencyId, this.originalData),
            symbol: getObjectById('currencyId', rowData.currencyId, this.originalData),
            countryId: getObjectById('countries_id', rowData.countryId, this.countryListOriginal),

        //     displayName: getObjectByValue('displayName', rowData.displayName, this.originalData),
        //     code: getObjectByValue('code', rowData.code, this.originalData),
        //     symbol: getObjectByValue('symbol', rowData.symbol, this.originalData),
         };
        this.selectedRecordForEdit = { ...this.addNew }
    }

    resetViewData() {
        this.viewRowData = undefined;
    }
    delete(rowData) {
        this.selectedRowforDelete = rowData;
    }

    columnsChanges() {
        this.refreshList();
    }
    refreshList() {
        this.table.reset();
        this.getList();
    }
    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.currencyService.updatecurrency(data).subscribe(() => {
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully  `,
                MessageSeverity.success
            );
        })
    }
    deleteConformation(value) {
        if (value === 'Yes') {
            this.currencyService.deletecurrency(this.selectedRowforDelete.currencyId).subscribe(() => {
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Currency Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    getAuditHistoryById(rowData) {
        this.currencyService.historycurrency(rowData.currencyId).subscribe(res => {
            this.auditHistory = res[0];
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

    customExcelUpload(event) {
        const file = event.target.files;
      
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.currencyService.currencyFileUpload(this.formData).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.existingRecordsResponse = res;

                var result = this.existingRecordsResponse[0].uploadStatus;
                if (result == "Duplicate") {

                    this.alertService.showMessage(
                        'Duplicate',
                        `Duplicate Records found `,
                        MessageSeverity.warn
                    );
                }
                if (result === "Success") {
                    this.alertService.showMessage(
                        'Success',
                        `Success Records found `,
                        MessageSeverity.success
                    );
                }

                if (result === "Failed") {
                    this.alertService.showMessage(
                        'Failed',
                        `Failed `,
                        MessageSeverity.error
                    );
                }
                this.getList();
            })
        }


    }
    sampleExcelDownload() {
         const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=Currency&fileName=currency.xlsx`;

         window.location.assign(url);
    }



    getDeleteListByStatus(value){
        if(value){
            this.currentDeletedstatus=true;
        }else{
            this.currentDeletedstatus=false;
        }
        this.getListByStatus(this.status ? this.status : this.currentstatus)
            }
            
	originalTableData:any=[];
    currentDeletedstatus:boolean=false;
    status:any="Active";
    getListByStatus(status) {
        const newarry=[];
        if(status=='Active'){ 
            this.status=status;
			if(this.currentDeletedstatus==false){
			   this.originalTableData.forEach(element => {
				if(element.isActive ==true && element.isDeleted ==false){
				newarry.push(element);
				}
			   });
	       }else{
		        this.originalTableData.forEach(element => {
				if(element.isActive ==true && element.isDeleted ==true){
			     newarry.push(element);
				}
			   });
	   }
         this.originalData=newarry;
        }else if(status=='InActive' ){
            this.status=status;
			if(this.currentDeletedstatus==false){
				this.originalTableData.forEach(element => {
				 if(element.isActive ==false && element.isDeleted ==false){
				 newarry.push(element);
				 }
				});
			}else{
				 this.originalTableData.forEach(element => {
				 if(element.isActive ==false && element.isDeleted ==true){
				  newarry.push(element);
				 }
				});
		}
              this.originalData = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.originalData= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.originalData= newarry;
			}
        }
        this.totalRecords = this.originalData.length ;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        }
        restore(content, rowData) {
            this.restorerecord = rowData;
            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
            this.modal.result.then(() => {
                console.log('When user closes');
            }, () => { console.log('Backdrop click') })
        }
        restorerecord:any={}
        restoreRecord(){  
            this.commonService.updatedeletedrecords('Currency',
            'CurrencyId',this.restorerecord.currencyId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
 









    /*private loadData() {
        // debugger;
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.currencyService.getCurrencyList().subscribe(
            results => this.onDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );

    }
    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    private refresh() {
        // Causes the filter to refresh there by updating with recently added data.
        this.applyFilter(this.dataSource.filter);
    }
    private onDataLoadSuccessful(getCurrencyList: Currency[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getCurrencyList;
        this.totalRecords = getCurrencyList.length;
        this.allCurrencyInfo = getCurrencyList;
    }

    private onDataLoadFailed(error: any) {
        // alert(error);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }
    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;

    }

    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceAction.isActive == false;
            this.currencyService.updatecurrency(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
            //alert(e);
        }
        else {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceAction.isActive == true;
            this.currencyService.updatecurrency(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
            //alert(e);
        }

    }

   

    open(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;
		this.disableSave = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new Currency();
        this.sourceAction.isActive = true;
        this.currencyName = "";
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {



            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }


    openDelete(content, row) {

        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.currency_Name = row.code;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
    private loadMasterCompanies() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.masterComapnyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );

    }
    openEdit(content, row) {

        this.isEditMode = true;
		this.isSaving = true;
		this.disableSave = false;
        this.loadMasterCompanies();
        this.sourceAction = row;
        this.currencyName = this.sourceAction.code;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openHist(content, row) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;


        this.sourceAction = row;



        this.isSaving = true;
      
        this.currencyService.historycurrency(this.sourceAction.currencyId).subscribe(
            results => this.onHistoryLoadSuccessful(results[0], content),
            error => this.saveFailedHelper(error));


    }
    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {

        
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.auditHisory = auditHistory;


        this.modal = this.modalService.open(content, { size: 'lg' });

        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })


    }
    openView(content, row) {

        this.sourceAction = row;
        this.currency_Name = row.code;
        this.symbol = row.symbol;
        this.displayName = row.displayName;
        this.memo = row.memo;
        this.createdBy = row.createdBy;
        this.updatedBy = row.updatedBy;
        this.createdDate = row.createdDate;
        this.updatedDate = row.updatedDate;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
    eventHandler(event) {
        let value = event.target.value.toLowerCase();
        if (this.selectedActionName) {
            if (value == this.selectedActionName.toLowerCase()) {
                //alert("Action Name already Exists");
                this.disableSave = true;
            }
            else {
                this.disableSave = false;
            }
        }
    }
    partnmId(event) {
        //debugger;
        for (let i = 0; i < this.actionamecolle.length; i++) {
            if (event == this.actionamecolle[i][0].currencyName) {
                //alert("Action Name already Exists");
                this.disableSave = true;
                this.selectedActionName = event;
            }
        }
    }


    filterCurrency(event) {

        this.localCollection = [];
        for (let i = 0; i < this.allCurrencyInfo.length; i++) {
            let currencyName = this.allCurrencyInfo[i].code;
            if (currencyName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.actionamecolle.push([{
                    "currencyId": this.allCurrencyInfo[i].currencyId,
                    "currencyName": currencyName
                }]),
                this.localCollection.push(currencyName);
            }
        }
    }


    editItemAndCloseModel() {

        // debugger;

        this.isSaving = true;
        if (this.currencyName.toLowerCase().trim() == "") {
            this.alertService.showMessage("Empty", 'Cannot Submit Empty', MessageSeverity.warn);
            return;
        }
        if (!(this.sourceAction.displayName)) {
            this.alertService.showMessage("Empty", 'Name Cannot Be Empty', MessageSeverity.warn);
            return;
        }

        if (!(this.sourceAction.symbol)) {
            this.alertService.showMessage("Empty", 'Symbol Cannot Be Empty', MessageSeverity.warn);
            return;
        }
        
        for (let i = 0; i < this.allCurrencyInfo.length; i++) {
            if (this.allCurrencyInfo[i].code.toLowerCase().localeCompare(this.currencyName.toLowerCase()) == 0) {
                this.alertService.showMessage("Duplicate", 'Already Exist', MessageSeverity.warn);
                return;
            }
            else {
            }
        }
        if (this.isEditMode == false) {

            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.code = this.currencyName;
              this.sourceAction.masterCompanyId= 1;
            this.currencyService.newAddcurrency(this.sourceAction).subscribe(
                role => this.saveSuccessHelper(role),
                error => this.saveFailedHelper(error));
        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.code = this.currencyName;
              this.sourceAction.masterCompanyId= 1;
            this.currencyService.updatecurrency(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        this.modal.close();
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.currencyService.deletecurrency(this.sourceAction.currencyId).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error => this.saveFailedHelper(error));
        this.modal.close();
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    private saveCompleted(user?: Currency) {
        this.isSaving = false;
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
        }
        this.updatePaginatorState();
    }

    private saveSuccessHelper(role?: Currency) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
        this.updatePaginatorState();
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    showAuditPopup(template, id): void {
        this.auditCurrency(id);
        this.modal = this.modalService.open(template, { size: 'sm' });
    }

    auditCurrency(currencyId: number): void {
        this.AuditDetails = [];
        this.currencyService.getCurrencyAudit(currencyId).subscribe(audits => {
            if (audits.length > 0) {
                this.AuditDetails = audits;
                this.AuditDetails[0].ColumnsToAvoid = ["currencyAuditId", "currencyId", "masterCompanyId", "createdBy", "createdDate", "updatedDate"];
            }
        });
    }

    updatePaginatorState() //need to pass this Object after update or Delete to get Server Side pagination
    {
        this.paginatorState = {
            rows: this.rows,
            first: this.first
        }
        if (this.paginatorState) {
            this.loadCurrency(this.paginatorState);
        }
    }

    loadCurrency(event: LazyLoadEvent) //when page initilizes it will call this method
    {
        this.loading = true;
        this.rows = event.rows;
        this.first = event.first;
        if (this.event) {
            this.currency.push({
                Code: this.codeInputFieldValue,
                Symbol: this.symbolInputFieldValue,
                DisplayName: this.displayNameInputFieldValue,
                Memo: this.memoInputFieldValue,
                CreatedBy: this.createdByInputFieldValue,
                UpdatedBy: this.updatedByInputFieldValue,
                first: this.first,
                page: 10,
                pageCount: 10,
                rows: this.rows,
                limit: 5
            })
            if (this.currency) {
                this.currencyService.getServerPages(this.currency[this.currency.length - 1]).subscribe( //we are sending event details to service
                    pages => {
                        this.curreencyPaginationList = pages;
                        this.currencyPagination = this.curreencyPaginationList[0].currencyList;
                        this.totalRecords = this.curreencyPaginationList[0].totalRecordsCount;
                        this.totelPages = Math.ceil(this.totalRecords / this.rows);
                    });
            }
        }
        else
        {
            setTimeout(() => {
                if (this.totalRecords) {
                    this.currencyService.getServerPages(event).subscribe( //we are sending event details to service
                        pages => {
                            this.curreencyPaginationList = pages;
                            this.currencyPagination = this.curreencyPaginationList[0].currencyList;
                            this.totalRecords = this.curreencyPaginationList[0].totalRecordsCount;
                            this.totelPages = Math.ceil(this.totalRecords / this.rows);
                        });
                    this.loading = false;
                }
            }, 1000);
        }
        
    }

    inputFiledFilter(event, filed, matchMode) {
        this.first = 0;
        this.event = event;
        this.field = filed;
        this.matvhMode = matchMode;

        if (filed == 'code') {
            this.codeInputFieldValue = event;
        }
        if (filed == 'symbol') {
            this.symbolInputFieldValue = event;
        }
        if (filed == 'displayName') {
            this.displayNameInputFieldValue = event;
        }
        if (filed == 'memo') {
            this.memoInputFieldValue = event;
        }
        if (filed == 'createdBy') {
            this.createdByInputFieldValue = event;
        }
        if (filed == 'updatedBy') {
            this.updatedByInputFieldValue = event;
        }
        this.currency.push({
            Code: this.codeInputFieldValue,
            Symbol: this.symbolInputFieldValue,
            DisplayName: this.displayNameInputFieldValue,
            Memo: this.memoInputFieldValue,
            CreatedBy: this.createdByInputFieldValue,
            UpdatedBy: this.updatedByInputFieldValue,
            first: this.first,
            page: 10,
            pageCount: 10,
            rows: this.rows,
            limit: 5
        })
        if (this.currency) {
            this.currencyService.getServerPages(this.currency[this.currency.length - 1]).subscribe( //we are sending event details to service
                pages => {
                    this.curreencyPaginationList = pages;
                    this.currencyPagination = this.curreencyPaginationList[0].currencyList;
                    this.totalRecords = this.curreencyPaginationList[0].totalRecordsCount;
                    this.totelPages = Math.ceil(this.totalRecords / this.rows);
                });
        }
        else {
        }
    }*/
}
