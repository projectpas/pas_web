import { AppTranslationService } from '../../../services/app-translation.service';

import { Component, ViewChild, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';


import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';

import { Subscription } from 'rxjs';
import { VendorClassification } from '../../../models/vendorclassification.model';
import { AlertDialog, AlertService, MessageSeverity, DialogType } from '../../../services/alert.service';
import { VendorService } from '../../../services/vendor.service';
import { AuthService } from '../../../services/auth.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { VendorClassificationService } from '../../../services/vendorclassification.service';
import { MasterCompany } from '../../../models/mastercompany.model';
import { AuditHistory } from '../../../models/audithistory.model';
@Component({
    selector: 'app-add-actions-dialog',
    templateUrl: './add-actions-dialog.component.html',
    styleUrls: ['./add-actions-dialog.component.scss']
})
/** add-actions-dialog component*/
export class AddActionsDialogComponent {
    classificationName: any = "";
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createdDate: any = "";
    updatedDate: any = "";

    isSaving: boolean;
    ngOnInit(): void {
        this.loadData();
    }
    Active: string = "Active";
    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;

    displayedColumns = ['vendorclassificationId', 'classificationName', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    dataSource: MatTableDataSource<VendorClassification>;
    allVendorClassInfo: VendorClassification[] = [];
    allComapnies: MasterCompany[] = [];
    public auditHisory: AuditHistory[] = [];
    sourceAction: VendorClassification;
    loadingIndicator: boolean;
    actionForm: FormGroup;

    id: number;
    errorMessage: any;
    cols: any[];
    selectedColumns: any[];
    modal: NgbModalRef;
    selectedColumn: VendorClassification[];

    vendorName: string;
    filteredBrands: any[];
    localCollection: any[] = [];
    /** Actions ctor */

    public isEditMode: boolean = false;
    public isDeleteMode: boolean = false;
    subscription: Subscription;
    constructor(
        public dialogRef: MatDialogRef<AddActionsDialogComponent>,
        private translationService: AppTranslationService,
        @Inject(MAT_DIALOG_DATA) private data: AlertDialog, private venService: VendorService, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public vendorclassificationService: VendorClassificationService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService
    ) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        this.sourceAction = new VendorClassification();
    }


    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    public allWorkFlows: VendorClassification[] = [];

    private loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.vendorclassificationService.getVendorClassificationEndpointList().subscribe(
            results => this.onDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );

        this.cols = [
            //{ field: 'vendorClassificationId', header: 'Vendor Classification Id' },
            { field: 'classificationName', header: 'Classification Name' },
            { field: 'memo', header: 'Memo' },
            { field: 'createdBy', header: 'Created By' },
            { field: 'updatedBy', header: 'Updated By' },
            { field: 'updatedDate', header: 'Updated Date' },
            { field: 'createdDate', header: 'Created Date' }
        ];
        this.selectedColumns = this.cols;
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
    private onDataLoadSuccessful(getVendorClassificationList: VendorClassification[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getVendorClassificationList;
        this.allVendorClassInfo = getVendorClassificationList;
    }

    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {

        // debugger;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.auditHisory = auditHistory;


        this.modal = this.modalService.open(content, { size: 'lg' });

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

        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new VendorClassification();
        this.sourceAction.isActive = true;
        this.vendorName = "";
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {



            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openView(content, row) {

        this.sourceAction = row;
        this.classificationName = row.classificationName;
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
        this.sourceAction = row;
        this.vendorName = this.sourceAction.classificationName;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
    filterVendors(event) {

        this.localCollection = [];
        for (let i = 0; i < this.allVendorClassInfo.length; i++) {
            let vendorName = this.allVendorClassInfo[i].classificationName;
            if (vendorName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(vendorName);
            }
        }
    }

    openHist(content, row) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;


        this.sourceAction = row;



        //this.isSaving = true;
        // debugger;
        this.vendorclassificationService.historyVendorClassification(this.sourceAction.vendorClassificationId).subscribe(
            results => this.onHistoryLoadSuccessful(results[0], content),
            error => this.saveFailedHelper(error));


    }


    editItemAndCloseModel() {

        // debugger;

        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.classificationName = this.vendorName;
            this.sourceAction.masterCompanyId = 1;
            this.vendorclassificationService.newVendorClassification(this.sourceAction).subscribe(
                role => this.saveSuccessHelper(role),
                error => this.saveFailedHelper(error));
        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.classificationName = this.vendorName;
            this.sourceAction.masterCompanyId = 1;
            this.vendorclassificationService.updateVendorClassification(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

        this.modal.close();
    }

    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceAction.isActive == false;
            this.vendorclassificationService.updateVendorClassification(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
            //alert(e);
        }
        else {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceAction.isActive == true;
            this.vendorclassificationService.updateVendorClassification(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
            //alert(e);
        }

    }



    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.vendorclassificationService.deleteVendorClassification(this.sourceAction.vendorClassificationId).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error => this.saveFailedHelper(error));
        this.modal.close();
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    private saveCompleted(user?: VendorClassification) {
        this.isSaving = false;

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);

        }

        this.loadData();
    }

    private saveSuccessHelper(role?: VendorClassification) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);

        this.loadData();

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
    /** add-actions-dialog ctor */
    get showTitle() {
        return this.data.title && this.data.title.length;
    }

    get title() {
        return this.data.title;
    }

    get message() {
        return this.data.message;
    }

    get okLabel() {
        return this.data.okLabel || 'OK';
    }

    get cancelLabel() {
        return this.data.cancelLabel || 'CANCEL';
    }

    get showCancel() {
        return this.data.type != DialogType.alert;
    }

    get isPrompt() {
        return this.data.type == DialogType.prompt;
    }

    result: string;


    ok() {
        if (this.data.type == DialogType.prompt) {
            this.data.okCallback(this.result || this.data.defaultValue);
        }
        else {
            this.data.okCallback();
        }
        this.dialogRef.close();
    }

    cancel(): void {
        if (this.data.cancelCallback) {
            this.data.cancelCallback();
        }
        this.dialogRef.close();
    }

}