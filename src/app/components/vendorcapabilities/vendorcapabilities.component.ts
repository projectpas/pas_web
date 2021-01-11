import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
declare var $ : any;
import { MenuItem } from 'primeng/api';//bread crumb
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MasterCompany } from '../../models/mastercompany.model';
import { VendorCapabilitiesService } from '../../services/vendorcapabilities.service';
// import { DataTableModule } from 'primeng/datatable';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
// import { Action } from 'rxjs/scheduler/Action';
import { AuditHistory } from '../../models/audithistory.model';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { MatTableDataSource, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { VendorCapabilities } from '../../models/vendorcapabilities.model';
import { VendorCapabilitiesEndpoint } from '../../services/VendorCapabilities-endpoint.service';
import { SingleScreenAuditDetails } from '../../models/single-screen-audit-details.model';

@Component({
    selector: 'app-vendorcapabilities',
    templateUrl: './vendorcapabilities.component.html',
    styleUrls: ['./vendorcapabilities.component.scss'],
    animations: [fadeInOut],
    //providers: [VendorCapabilities] 
})

export class VendorcapabilitiesComponent implements OnInit, AfterViewInit {
    capabilityViewfield: any = {};
    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    disableSave: boolean;
    auditHisory: any[];
    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;
    cols: any[];
    selectedColumns: any[];
    displayedColumns = ['capabilityName', 'capabilityId', 'createdDate', 'companyName'];
    dataSource: MatTableDataSource<any>;
    capabilityNamecolle: any[] = [];
    allComapnies: MasterCompany[] = [];
    private isSaving: boolean;
    public sourcevendorcapabilities: any = {}
    private bodyText: string;
    loadingIndicator: boolean;
    closeResult: string;
    title: string = "Create";
    id: number;
    actionamecolle: any;
    capabilityId: number;
    errorMessage: any;
    modal: NgbModalRef;
    /** Actions ctor */
    public isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
    filteredBrands: any[];
    localCollection: any[] = [];
    selectedColumn: any[];
    Active: string = "Active";
    allvendorcapabilities: any[];
    sourceAction: any;
    integrationName: any;
    selectedvendorcapabilities: any;
    disableSavevendorcapabilities: boolean = false;
    //allvendorcapabilities: any[]=[];
    localvendorcapabilities: any[];
    createdBy: any;
    updatedBy: any;
    createdDate: any;
    updatedDate: any;
    capabilityName: string;
    AuditDetails: SingleScreenAuditDetails[];

    constructor(private breadCrumb: SingleScreenBreadcrumbService, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public workFlowtService: VendorCapabilitiesService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        this.sourcevendorcapabilities = new VendorCapabilities();
    }
    ngOnInit(): void {

        this.loadData();

        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-vendorcapabilities';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);

    }
    private onDataLoadFailed(error: any) {
        // alert(error);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }
    private loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.workFlowtService.getWorkFlows().subscribe(
            results => this.onDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
        this.cols = [


            { field: 'capabilityName', header: 'Capability Name' },
            //{ field: 'capabilityId', header: 'VCID' },
            { field: 'createdBy', header: 'Created By' },
            { field: 'updatedBy', header: 'Updated By' },
            //	{ field: 'createdDate', header: 'Created Date' },
            //	{ field: 'updatedDate', header: 'Updated Date' }


        ];
        //this.breadCrumb.currentUrl = '/singlepages/singlepages/app-vendor-capabilities';
        //this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
        this.selectedColumns = this.cols;
    }
    private onDataLoadSuccessful(allWorkFlows: any[]) {

        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        //this.dataSource.data = allWorkFlows;
        this.allvendorcapabilities = allWorkFlows;

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
        this.applyFilter(this.dataSource.filter);
    }

    open(content) {
        this.disableSavevendorcapabilities = false;
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.disableSave = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourcevendorcapabilities = new VendorCapabilities();
        this.capabilityName = "";
        this.sourcevendorcapabilities.isActive = true;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {



            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openDelete(content, row) {

        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourcevendorcapabilities = row;
        this.modal = this.modalService.open(content, { size: 'sm' });
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
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }
    VendorcapabilitiesHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedvendorcapabilities) {
                if (value == this.selectedvendorcapabilities.toLowerCase()) {
                    //alert("Action Name already Exists");
                    this.disableSavevendorcapabilities = true;

                }
                else {
                    this.disableSavevendorcapabilities = false;

                }
            }

        }
    }
    Vendorcapabilitiesdescription(event) {
        //
        if (this.allvendorcapabilities) {

            for (let i = 0; i < this.allvendorcapabilities.length; i++) {
                if (event == this.allvendorcapabilities[i].capabilityName) {
                    this.sourcevendorcapabilities.capabilityName = this.allvendorcapabilities[i].capabilityName;
                    this.disableSavevendorcapabilities = true;

                    this.selectedvendorcapabilities = event;
                }

            }
        }
    }
    editItemAndCloseModel() {

        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourcevendorcapabilities.createdBy = this.userName;
            this.sourcevendorcapabilities.updatedBy = this.userName;
            this.sourcevendorcapabilities.masterCompanyId = 1;
            this.workFlowtService.newvendorcapabilities(this.sourcevendorcapabilities).subscribe(
                role => this.saveSuccessHelper(role),
                error => this.saveFailedHelper(error));
        }
        else {

            this.sourcevendorcapabilities.updatedBy = this.userName;
            this.sourcevendorcapabilities.masterCompanyId = 1;
            this.workFlowtService.updatevendorcapabilities(this.sourcevendorcapabilities).subscribe(
                response => this.saveCompleted(this.sourcevendorcapabilities),
                error => this.saveFailedHelper(error));
        }

        this.modal.close();
    }

    filtervendor(event) {

        this.localCollection = [];
        if (this.allvendorcapabilities) {
            for (let i = 0; i < this.allvendorcapabilities.length; i++) {
                let capabilityName = this.allvendorcapabilities[i].capabilityName;
                if (capabilityName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.capabilityNamecolle.push([{
                        "vendorCapabilityId": this.allvendorcapabilities[i].vendorCapabilityId,
                        "capabilityName": capabilityName
                    }]),
                        this.localCollection.push(capabilityName)

                }
            }
        }
    }

    private saveSuccessHelper(role?: any) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);

        this.loadData();

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

        this.loadData();
    }
    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }
    openEdit(content, row) {
        this.disableSavevendorcapabilities = false;
        this.isEditMode = true;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourcevendorcapabilities = row;
        this.capabilityName = this.sourcevendorcapabilities.capabilityName;
        //this.comments = this.sourcemanufacturer.comments;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openHist(content, row) {

        this.sourcevendorcapabilities = row;

        this.workFlowtService.historyvendorcapabilities(this.sourcevendorcapabilities.vendorCapabilityId).subscribe(
            results => this.onHistoryLoadSuccessful(results[0], content),
            error => this.saveFailedHelper(error));
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

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourcevendorcapabilities.updatedBy = this.userName;
        this.workFlowtService.deletevendorcapabilities(this.sourcevendorcapabilities.vendorCapabilityId).subscribe(
            response => this.saveCompleted(this.sourcevendorcapabilities),
            error => this.saveFailedHelper(error));
        this.modal.close();
    }


    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourcevendorcapabilities = rowData;
            this.sourcevendorcapabilities.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourcevendorcapabilities.isActive == false;
            this.workFlowtService.updatevendorcapabilities(this.sourcevendorcapabilities).subscribe(
                response => this.saveCompleted(this.sourcevendorcapabilities),
                error => this.saveFailedHelper(error));
            //alert(e);
        }
        else {
            this.sourcevendorcapabilities = rowData;
            this.sourcevendorcapabilities.updatedBy = this.userName;
            this.Active = "Active";
            this.sourcevendorcapabilities.isActive == true;
            this.workFlowtService.updatevendorcapabilities(this.sourcevendorcapabilities).subscribe(
                response => this.saveCompleted(this.sourcevendorcapabilities),
                error => this.saveFailedHelper(error));
            //alert(e);
        }

    }

    openView(content, row) {

        this.sourcevendorcapabilities = row;
        this.capabilityViewfield.capabilityName = row.capabilityName;
        this.capabilityViewfield.capabilityId = row.capabilityId;
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

    showAuditPopup(template, id): void {        
        this.getVendorCapabilityAuditDetails(id);
        this.modal = this.modalService.open(template, { size: 'sm' });
    }

    getVendorCapabilityAuditDetails(Id: number): void {
        this.workFlowtService.getVendorCapabilityAuditDetails(Id).subscribe(audits => {
            if (audits.length > 0) {
                this.AuditDetails = audits;
                this.AuditDetails[0].ColumnsToAvoid = ["vendorCapabiliyAuditId", "vendorCapabilityId", "capabilityId", "masterCompanyId", "createdBy", "createdDate", "updatedDate"];
            }
        });
    }

}