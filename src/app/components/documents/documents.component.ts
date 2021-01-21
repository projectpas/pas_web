import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { ActionService } from '../../services/action.service';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { Action } from '../../models/action.model';
import { AuditHistory } from '../../models/audithistory.model';
import { AuthService } from '../../services/auth.service';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MasterCompany } from '../../models/mastercompany.model';


import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DocumentService } from '../../services/document.service';
import { DocumentModel } from '../../models/document.model';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuItem, LazyLoadEvent } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails } from '../../models/single-screen-audit-details.model';

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.scss'],
    animations: [fadeInOut]
})
/** Actions component*/
export class DocumentsComponent implements OnInit, AfterViewInit {

    document = [];
    updatedByInputFieldValue: any;
    createdByInputFieldValue: any;
    vendorInputFieldValue: any;
    workOrderInputFieldValue: any;
    salesOrderInputFieldValue: any;
    slInputFieldValue: any;
    repairOrderInputFieldValue: any;
    purchaseOrderInputFieldValue: any;
    itemMasterInputFieldValue: any;
    customerInputFieldValue: any;
    descriptionInputFieldValue: any;
    documentCodeInputFieldValue: any;
    matvhMode: any;
    field: any;
    event: any;
    allreasn: any[]=[];
    disableSave: boolean=false;
    selectedreason: any;
    document_Name: any = "";
    description: any = "";
    customer: any = "";
    itemMaster: any = "";
    purchaseOrder: any = "";
    repairOrder: any = "";
    sl: any = "";
    salesOrder: any = "";
    workOrder: any = "";
    vendor: any = "";
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createdDate: any = "";
    updatedDate: any = "";

    ngOnInit(): void {
		this.loadData();
		this.breadCrumb.currentUrl = '/singlepages/singlepages/app-documents';
		this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
    }
    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;
    localCollection: any[] = [];
    documentName: string;
    displayedColumns = ['actionId', 'companyName', 'description', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    dataSource: MatTableDataSource<DocumentModel>;
    alldocuments: DocumentModel[] = [];
    allComapnies: MasterCompany[] = [];
    private isSaving: boolean;
    public sourceAction: DocumentModel;
    public auditHisory: AuditHistory[] = [];
    private bodyText: string;
    loadingIndicator: boolean;
    closeResult: string;
    selectedColumn: any[];
    selectedColumns: any[];
    cols: any[];
    title: string = "Create";
    id: number;
    errorMessage: any;
    modal: NgbModalRef;
    /** Actions ctor */

    pageSearch: { query: any; field: any; };
    first: number;
    rows: number;
    paginatorState: any;

    documentPagination: Document[];//added
    totalRecords: number;
    loading: boolean;

    AuditDetails: SingleScreenAuditDetails[];
    public isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
    totelPages: any;
    
	constructor(private breadCrumb: SingleScreenBreadcrumbService,private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public documentService: DocumentService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        //this.sourceAction = new Action();

    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    public allWorkFlows: any[] = [];

    private loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.documentService.getWorkFlows().subscribe(
            results => this.onDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );

        this.cols = [
			{ field: 'documentCode', header: 'Document Code' },
            { field: 'description', header: 'Description' },
            { field: 'customer', header: 'Cust' },
            { field: 'itemMaster', header: 'Item Master' },
            { field: 'purchaseOrder', header: 'PO' },
            { field: 'repairOrder', header: 'RO' },
            { field: 'sl', header: 'SL #' },
            { field: 'salesOrder', header: 'SO' },
            { field: 'workOrder', header: 'WO' },
            { field: 'vendor',header:'Vendor'},
        ];

        this.selectedColumns = this.cols;

    }
    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
           
            this.sourceAction.isActive == false;
            this.documentService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
            //alert(e);
        }
        else {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            
            this.sourceAction.isActive == true;
            this.documentService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
            //alert(e);
        }

    }

    //eventHandler(event) {
    //    let value = event.target.value.toLowerCase()
    //    if (value == this.selectedreason.toLowerCase()) {
    //        this.disableSave = true;
    //    }
    //    else {
    //        this.disableSave = false;
    //    }
    //}

	eventHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedreason) {
				if (value == this.selectedreason.toLowerCase()) {
					//alert("Action Name already Exists");
					this.disableSave = true;

				}
				else {
					this.disableSave = false;

				}
			}

		}
	}

	documentId(event) {
		if (this.allreasn){
			for (let i = 0; i < this.allreasn.length; i++) {
				if (event == this.allreasn[i][0].documentName) {
					this.sourceAction.documentCode = this.allreasn[i][0].documentName;
					this.disableSave = true;
					this.selectedreason = event;
				}
			}
        }
}





    filterDocuments(event) {

        this.localCollection = [];
        for (let i = 0; i < this.alldocuments.length; i++) {
            let documentName = this.alldocuments[i].documentCode;
            if (documentName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.allreasn.push([{
                    "documentId": this.alldocuments[i].documentId,
                    "documentName": documentName
                }]),
                this.localCollection.push(documentName);
            }
        }
    }

    private loadMasterCompanies() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.masterComapnyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
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
    private onDataLoadSuccessful(allWorkFlows: any[]) {
      
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.totalRecords = allWorkFlows.length;
        this.alldocuments = allWorkFlows;
       // console.log(allWorkFlows);
    }

    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {

        // debugger;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.auditHisory = auditHistory;


        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });

        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })


    }

    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;

    }

    private onDataLoadFailed(error: any) {
        // alert(error);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }

    open(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;
		this.disableSave = false;
        this.isSaving = true;
        this.loadMasterCompanies();
		this.sourceAction = new DocumentModel();
		this.sourceAction.isActive = true;
        this.documentName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {



            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }


    openDelete(content, row) {

        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openEdit(content, row) {

        this.isEditMode = true;

        this.isSaving = true;
        this.loadMasterCompanies();

		this.disableSave = false;

        this.sourceAction = row;
        this.documentName = this.sourceAction.documentCode;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openHist(content, row) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;


        this.sourceAction = row;



        //this.isSaving = true;
        // debugger;
        this.documentService.historyAcion(this.sourceAction.documentId).subscribe(
            results => this.onHistoryLoadSuccessful(results[0], content),
            error => this.saveFailedHelper(error));


    }
    openView(content, row) {

        this.sourceAction = row;
        this.document_Name = row.documentCode;
        this.description = row.description;
        this.customer = row.customer;
        this.itemMaster = row.itemMaster;
        this.purchaseOrder = row.purchaseOrder;
        this.repairOrder = row.repairOrder;
        this.sl = row.sl;
        this.salesOrder = row.salesOrder;
        this.workOrder = row.workOrder;
        this.vendor = row.vendor;
        this.memo = row.memo;
        this.createdBy = row.createdBy;
        this.updatedBy = row.updatedBy;
        this.createdDate = row.createdDate;
        this.updatedDate = row.updatedDate;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }



    editItemAndCloseModel() {

        // debugger;

        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.documentCode = this.documentName;
              this.sourceAction.masterCompanyId= 1;
            this.documentService.newAction(this.sourceAction).subscribe(
                role => this.saveSuccessHelper(role),
                error => this.saveFailedHelper(error));
        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.documentCode = this.documentName;
              this.sourceAction.masterCompanyId= 1;
            this.documentService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        this.modal.close();
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.documentService.deleteAcion(this.sourceAction.documentId).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error => this.saveFailedHelper(error));
        this.modal.close();
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
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

        this.updatePaginatorState();
    }

    private saveSuccessHelper(role?: any) {
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

    showAuditPopup(template, documentId): void {
        this.auditDocument(documentId);
        this.modal = this.modalService.open(template, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    auditDocument(documentId: number): void {
        this.AuditDetails = [];
        this.documentService.getAudit(documentId).subscribe(audits => {
            if (audits.length > 0) {
                this.AuditDetails = audits;
                this.AuditDetails[0].ColumnsToAvoid = ["documentAuditId", "documentId", "masterCompanyId", "createdBy", "createdDate", "updatedDate"];
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
            this.loadDocument(this.paginatorState);
        }
    }

    loadDocument(event: LazyLoadEvent) //when page initilizes it will call this method
    {
        this.loading = true;
        this.rows = event.rows;
        this.first = event.first;
        setTimeout(() => {
            if (this.alldocuments) {
                this.documentService.getServerPages(event).subscribe( //we are sending event details to service
                    pages => {
                        if (pages.length > 0) {
                            this.documentPagination = pages[0];
                        }
                    });
                this.loading = false;
            }
        }, 1000);
    }

    inputFiledFilter(event, filed, matchMode) {

        this.event = event;
        this.field = filed;
        this.matvhMode = matchMode;

        if (filed == 'documentCode') {
            this.documentCodeInputFieldValue = event;
        }
        if (filed == 'description') {
            this.descriptionInputFieldValue = event;
        }
        if (filed == 'customer') {
            this.customerInputFieldValue = event;
        }
        if (filed == 'itemMaster') {
            this.itemMasterInputFieldValue = event;
        }
        if (filed == 'purchaseOrder') {
            this.purchaseOrderInputFieldValue = event;
        }
        if (filed == 'repairOrder') {
            this.repairOrderInputFieldValue = event;
        }
        if (filed == 'sl') {
            this.slInputFieldValue = event;
        }
        if (filed == 'salesOrder') {
            this.salesOrderInputFieldValue = event;
        }
        if (filed == 'workOrder') {
            this.workOrderInputFieldValue = event;
        }
        if (filed == 'vendor') {
            this.vendorInputFieldValue = event;
        }
        if (filed == 'createdBy') {
            this.createdByInputFieldValue = event;
        }
        if (filed == 'updatedBy') {
            this.updatedByInputFieldValue = event;
        }
        this.document.push({
            documentCode: this.documentCodeInputFieldValue,
            description: this.descriptionInputFieldValue,
            customer: this.customerInputFieldValue,
            itemMaster: this.itemMasterInputFieldValue,
            purchaseOrder: this.purchaseOrderInputFieldValue,
            repairOrder: this.repairOrderInputFieldValue,
            sl: this.slInputFieldValue,
            salesOrder: this.salesOrderInputFieldValue,
            workOrder: this.workOrderInputFieldValue,
            vendor: this.vendorInputFieldValue,
            CreatedBy: this.createdByInputFieldValue,
            UpdatedBy: this.updatedByInputFieldValue,
            first: this.first,
            page: 10,
            pageCount: 10,
            rows: this.rows,
            limit: 5
        })
        if (this.document) {
            this.documentService.getServerPages(this.document[this.document.length - 1]).subscribe( //we are sending event details to service
                pages => {
                    if (pages.length > 0) {
                        this.documentPagination = pages[0];
                    }
                });
        }
        else {
        }
    }

}