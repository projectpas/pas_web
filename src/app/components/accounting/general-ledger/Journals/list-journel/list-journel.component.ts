import { Component, OnInit } from '@angular/core';
import { AlertService } from "../../../../../services/alert.service";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { SingleScreenAuditDetails, AuditChanges } from "../../../../../models/single-screen-audit-details.model";
import { AuthService } from "../../../../../services/auth.service";
import { JournelService } from "../../../../../services/journals/journals.service";
import { fadeInOut } from "../../../../../services/animations";
import { JournalManual } from '../../../../../models/journal-manual';
import { Router } from '@angular/router';
import { LegalEntityService } from '../../../../../services/legalentity.service';
import { EmployeeService } from '../../../../../services/employee.service';
import { MatTableDataSource } from '@angular/material';

@Component({
    selector: 'app-list-journel',
    templateUrl: './list-journel.component.html',
    styleUrls: ['./list-journel.component.scss'],
    animations: [fadeInOut]
})
/** list-journel component*/
export class ListJournelComponent implements OnInit {
    loadingIndicator: boolean;
    manualJournelData: any;
    /** list-journel ctor */

    currentManualJournel: JournalManual;
    manualJournelToUpdate: JournalManual;
    manualJournelToRemove: JournalManual;
    manualJournelList: JournalManual[];

    modal: NgbModalRef;
    display: boolean = false;
    modelValue: boolean = false;
    Active: string;
    contactcols: any[];
    selectedColumns: any[] = [];
    companyList: any[] = [];
    allEmployeeinfo: any[] = [];

    dataSource: MatTableDataSource<{}>;
    journalList: any[];
    
    constructor(public employeeService: EmployeeService,
                private legalEntityservice: LegalEntityService,
                private router: Router,
                private journelService: JournelService, 
                private alertService: AlertService, 
                private modalService: NgbModal, 
                private authService: AuthService) {

        this.dataSource = new MatTableDataSource();                    
    }

    ngOnInit(): void
    {
        this.loadCompaniesData();//loading for Company information
        this.employeedata();

        this.journelService.manulaJournelCollection = null;

        this.journelService.getAllJournel().subscribe(resultManualJournel => {
            console.log(' journal list : ', resultManualJournel);
            this.manualJournelList = resultManualJournel[0];
            this.manualJournelList.forEach(function (manualJournel) {
                manualJournel.isActive = manualJournel.isActive == false ? false : true;
            });
            this.journalList = this.manualJournelList;
        });

        this.contactcols = [
            { field: 'glAccountId', header: 'Ledger Name' },
            { field: 'batchNumber', header: 'Batch Number' },
            { field: 'batchName', header: 'Batch Name' },
            { field: 'balanceTypeId', header: 'Balance Type' },
            { field: 'journalCategoryId', header: 'Category' },
            { field: 'journalTypeId', header: 'Journel Type' },
            { field: 'employeeId', header: 'Employee' },
            { field: 'createdBy', header: 'Created By' },
            { field: 'updatedBy', header: 'Updated By' },
            { field: 'updatedDate', header: 'Updated Date' },
            { field: 'createdDate', header: 'Created Date' }

        ];

        this.selectedColumns = this.contactcols;
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    updateManualJournel(Journel): void {
        //this.currentManualJournel.updatedBy = this.userName;
        //this.journelService.updateJournel(this.manualJournelToUpdate).subscribe(journel => {
        //    this.alertService.showMessage('Journel updated successfully.');
        //    this.journelService.getAllJournel().subscribe(journel => {
        //        this.manualJournelList = journel[0];
        //    });
        //    this.resetUpdateBatch();
        //    this.dismissModel();
        //});

        this.journelService.manulaJournelCollection = Journel;
        this.router.navigateByUrl('/accountmodule/accountpages/app-list-journel')
    }

    removeManualJournel(): void {
        this.journelService.removeJournel(this.manualJournelToRemove.id).subscribe(response => {
            this.alertService.showMessage("Journel removed successfully.");
            this.journelService.getAllJournel().subscribe(journels => {
                this.manualJournelList = journels[0];
                this.modal.close();
            });
        });

    }

    resetUpdateBatch(): void {
        this.manualJournelToUpdate = new JournalManual();
    }

    dismissModel(): void {
        if (this.modal != undefined) {
            this.modal.close();
        }
    }

    confirmDelete(content, id): void {
        this.manualJournelToRemove = Object.assign({}, this.manualJournelList.filter(function (journel) {
            return journel.id == id;
        })[0]);;
        this.modal = this.modalService.open(content, { size: 'sm' });
    }

    toggleIsActive(journelObje: any, e) {
        if (e.checked == false) {
            this.manualJournelToUpdate = journelObje;
            this.Active = "In Active";
            this.manualJournelToUpdate.isActive == false;
            this.journelService.updateJournel(this.manualJournelToUpdate).subscribe(glAccount => {
                this.alertService.showMessage('Journel  updated successfully.');
                this.journelService.getAllJournel().subscribe(journel => {
                    this.manualJournelList = journel[0];
                });

            })
        }
        else {
            this.manualJournelToUpdate = journelObje;
            this.Active = "Active";
            this.manualJournelToUpdate.isActive == true;
            this.journelService.updateJournel(this.manualJournelToUpdate).subscribe(glAccount => {
                this.alertService.showMessage('journel updated successfully.');
                this.journelService.getAllJournel().subscribe(journel => {
                    this.manualJournelList = journel[0];
                });
            })
        }

    }

    //adding

    showViewData(viewContent, journel) {
        this.journelService.getJournelById(journel.id).subscribe(data => {
            this.manualJournelData = data[0][0];
            this.modal = this.modalService.open(viewContent, { size: 'lg' });
        })
    }

    private manualJournelEdit(journel)
    {
        this.journelService.manulaJournelCollection = journel;
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

    openCreateJournalPage(){
        this.router.navigate(['accountmodule/accountpages/app-create-journel']);
    }
}
