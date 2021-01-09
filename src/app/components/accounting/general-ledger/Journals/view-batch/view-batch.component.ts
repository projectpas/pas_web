import { Component, OnInit } from '@angular/core';
import { AlertService } from "../../../../../services/alert.service";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { SingleScreenAuditDetails, AuditChanges } from "../../../../../models/single-screen-audit-details.model";
import { AuthService } from "../../../../../services/auth.service";
import { JournelService } from "../../../../../services/journals/journals.service";
import { fadeInOut } from "../../../../../services/animations";
import { Router } from '@angular/router';
import { JournalBatch } from '../../../../../models/JournalBatch';
import { LegalEntityService } from '../../../../../services/legalentity.service';
import { EmployeeService } from '../../../../../services/employee.service';
import { Currency } from '../../../../../models/currency.model';
import { CurrencyService } from '../../../../../services/currency.service';

@Component({
    selector: 'app-view-batch',
    templateUrl: './view-batch.component.html',
    animations: [fadeInOut]
    //styleUrls: ['./view-batch-ts.component.scss']
})
/** view-batch.ts component*/
export class ViewBatchTsComponent implements OnInit{
    loadingIndicator: boolean;
    manualBatchData: any;
    modal: NgbModalRef;
    display: boolean = false;
    modelValue: boolean = false;
    Active: string;
    contactcols: any[];
    selectedColumns: any[];
    companyList: any[] = [];
    allEmployeeinfo: any[] = [];
    allCurrencyInfo: any[];
    /** view-batch.ts ctor */

    currentBatch: JournalBatch;
    batchToUpdate: JournalBatch;
    batchToRemove: JournalBatch;
    batchList: JournalBatch[];

    constructor(public currency: CurrencyService,public employeeService: EmployeeService,private legalEntityservice: LegalEntityService,private router: Router,private journelService: JournelService, private alertService: AlertService, private modalService: NgbModal, private authService: AuthService) {

        this.CurrencyData();
    }

    ngOnInit(): void
    {
        this.loadCompaniesData();//loading for Company information
        this.employeedata();

        this.journelService.manulaBatchCollection = null;

        this.journelService.getAllBatch().subscribe(batch => {
            this.batchList = batch[0];
            this.batchList.forEach(function (manualBatch) {
                manualBatch.isActive = manualBatch.isActive == false ? false : true;
            });
        });
    }
    get userName(): string
    {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    updateBatch(batch): void {
        this.journelService.manulaBatchCollection = batch;
        this.router.navigateByUrl('/accountmodule/accountpages/app-create-batch')
    }

    removeBatch(): void {
        this.journelService.removeBatch(this.batchToRemove.id).subscribe(response => {
            this.alertService.showMessage("Batch removed successfully.");
            this.journelService.getAllBatch().subscribe(batch => {
                this.batchList = batch[0];
                this.modal.close();
            });
        });

    }

    resetUpdateBatch(): void {
        this.batchToUpdate = new JournalBatch();
    }

    dismissModel(): void {
        if (this.modal != undefined) {
            this.modal.close();
        }
    }

    confirmDelete(content, id): void {
        this.batchToRemove = Object.assign({}, this.batchList.filter(function (batch) {
            return batch.id == id;
        })[0]);;
        this.modal = this.modalService.open(content, { size: 'sm' });
    }

    toggleIsActive(journelObje: any, e) {
        if (e.checked == false) {
            this.batchToUpdate = journelObje;
            this.Active = "In Active";
            this.batchToUpdate.isActive == false;
            this.journelService.updateActiveBatch(this.batchToUpdate).subscribe(glAccount => {
                this.alertService.showMessage('Batch  updated successfully.');
                this.journelService.getAllBatch().subscribe(batch => {
                    this.batchList = batch[0];
                });

            })
        }
        else {
            this.batchToUpdate = journelObje;
            this.Active = "Active";
            this.batchToUpdate.isActive == true;
            this.journelService.updateActiveBatch(this.batchToUpdate).subscribe(glAccount => {
                this.alertService.showMessage('batch updated successfully.');
                this.journelService.getAllBatch().subscribe(batch => {
                    this.batchList = batch[0];
                });
            })
        }

    }

    showViewData(viewContent, batch) {
        this.journelService.getBatchById(batch.id).subscribe(data => {
            this.manualBatchData = data[0][0];
            this.modal = this.modalService.open(viewContent, { size: 'lg' });
        })
    }

    private manualBatchEdit(batch) {
        this.journelService.manulaBatchCollection = batch;
        this.router.navigateByUrl('/accountmodule/accountpages/app-create-journel')
    }

    private loadCompaniesData() {
        this.legalEntityservice.getEntityList().subscribe(entitydata => {
            this.companyList = entitydata[0];
        });
    }

    //Employee Data
    private employeedata() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.employeeService.getEmployeeList().subscribe(
            results => this.onempDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onempDataLoadSuccessful(getEmployeeCerficationList: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allEmployeeinfo = getEmployeeCerficationList;
    }

    private onDataLoadFailed(error: any) {

    }

    //Currency Data
    private CurrencyData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.currency.getCurrencyList().subscribe(
            results => this.oncurrencySuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    private oncurrencySuccessful(getCreditTermsList: Currency[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allCurrencyInfo = getCreditTermsList;
    }

    removeManualJournel() {}
}