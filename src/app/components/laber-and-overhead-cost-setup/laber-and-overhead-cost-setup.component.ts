import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { MasterCompany } from '../../models/mastercompany.model';
import { NgbModalRef, NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LaborAndOverheadCostService } from '../../services/laborandoverheadcost.service';
import { SingleScreenBreadcrumbService } from '../../services/single-screens-breadcrumb.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AuditHistory } from '../../models/audithistory.model';
import { fadeInOut } from '../../services/animations';
import { Laborandoverheadcostsetup } from '../../models/laborandoverheadcostsetup.model';
import { SingleScreenAuditDetails } from '../../models/single-screen-audit-details.model';

@Component({
    selector: 'app-laber-and-overhead-cost-setup',
    templateUrl: './laber-and-overhead-cost-setup.component.html',
    styleUrls: ['./laber-and-overhead-cost-setup.component.scss'],
    animations: [fadeInOut]
})
/** Laber-and-overhead-cost-setup component*/
export class LaberAndOverheadCostSetupComponent implements OnInit, AfterViewInit {
    disableSave: boolean;
    selectedActionName: any;
    actionamecolle: any[] = [];
    auditHisory: any[];

    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;
    cols: any[];
    selectedColumns: any[];
    //displayedColumns = ['actionattributeid', 'description', 'createdDate', 'companyName'];
    dataSource: MatTableDataSource<any>;
    allLaberOverheadCost: any[] = [];
    allComapnies: MasterCompany[] = [];
    private isSaving: boolean;
    public sourceAction: any;
    private bodyText: string;
    loadingIndicator: boolean;
    closeResult: string;
    title: string = "Create";
    id: number;


    errorMessage: any;
    modal: NgbModalRef;
    /** Actions ctor */
    public isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
    LaborOverheadCostName: string;
    filteredBrands: any[];
    localCollection: any[] = [];
    selectedColumn: any[];
    Active: string = "Active";
    sourceLaborOverheadCost: any = {};
    showAsPercentOfTechHourlyRate: boolean = false;
    showUseIndTechLaborRate: boolean = false;
    showFlatAmtPerHour: boolean = false;
    showFlatAmtPerWO: boolean = false;
    showUseAvgRateTechByAction: boolean = false;
    showUseAvgRateOfAllTech: boolean = false;
    displayedColumns: any;
    AuditDetails: SingleScreenAuditDetails[];


    constructor(private labcost: LaborAndOverheadCostService, private breadCrumb: SingleScreenBreadcrumbService, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public workFlowtService: LaborAndOverheadCostService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService) {

        //this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        this.sourceLaborOverheadCost = new Laborandoverheadcostsetup();

    }
    ngOnInit(): void {

        this.loadData();
        this.cols = [
            { field: 'averagerateofalltechnicianmechanic', header: 'USE AVERAGE RATE OF ALL TECHNICIAN/MECHANIC' },
            //{ field: 'flatamountperhour', header: 'Flat Amount Per Hour' },
            { field: 'flatamountperworkorder', header: 'Flat Amount Per Work order' },
            { field: 'createdBy', header: 'Created By' },
            { field: 'updatedBy', header: 'Updated By' },
            { field: 'createdDate', header: 'Created Date' },
            { field: 'updatedDate', header: 'Updated Date' }


        ];
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-labor-and-overhead-cost-setup';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
        this.selectedColumns = this.cols;
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    showinputs(event) {
        if (event == "AsPercentOfTechHourlyRate") {
            this.showAsPercentOfTechHourlyRate = true;
            this.showFlatAmtPerHour = false;
            this.showFlatAmtPerWO = false;
            //this.sourceLaborOverheadCost.asPercentOfTechHourlyRate = true;
            //this.sourceLaborOverheadCost.flatAmtPerHour = false;
            //this.sourceLaborOverheadCost.flatAmtPerWO = false;

        }
        else if (event == "FlatAmtPerHour") {
            this.showFlatAmtPerHour = true;
            this.showAsPercentOfTechHourlyRate = false;
            this.showFlatAmtPerWO = false;
            //this.sourceLaborOverheadCost.asPercentOfTechHourlyRate = false;
            //this.sourceLaborOverheadCost.flatAmtPerHour = true;
            //this.sourceLaborOverheadCost.flatAmtPerWO = false;
        }
        else if (event == "FlatAmtPerWO") {
            this.showFlatAmtPerWO = true;
            this.showFlatAmtPerHour = false;
            this.showAsPercentOfTechHourlyRate = false;
            //this.sourceLaborOverheadCost.asPercentOfTechHourlyRate = false;
            //this.sourceLaborOverheadCost.flatAmtPerHour = false;
            //this.sourceLaborOverheadCost.flatAmtPerWO = true;
        }
    }

    enableinputs(event) {
        if (event == "UseIndTechLaborRate") {
            this.showUseIndTechLaborRate = true;
            this.showUseAvgRateOfAllTech = false;
            //this.sourceLaborOverheadCost.useIndTechLaborRate = true;
            //this.sourceLaborOverheadCost.useAvgRateOfAllTech = false;
        }

        else if (event == "UseAvgRateOfAllTech") {
            this.showUseIndTechLaborRate = false;
            this.showUseAvgRateOfAllTech = true;
            //this.sourceLaborOverheadCost.useIndTechLaborRate = false;
            //this.sourceLaborOverheadCost.useAvgRateOfAllTech = true;
        }
    }
    applyHours(event) {
        if (event == "AssignHoursBySpecificAction") {
            //this.sourceLaborOverheadCost.assignHoursBySpecificAction = true;
            //this.sourceLaborOverheadCost.assignTotalHoursToWO = false;

        }
        else if (event == "AssignTotalHoursToWO") {
            //this.sourceLaborOverheadCost.assignHoursBySpecificAction = false;
            //this.sourceLaborOverheadCost.assignTotalHoursToWO = true;
        }

    }


    public allWorkFlows: any[] = [];
    private loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.workFlowtService.getWorkFlows().subscribe(
            results => this.onDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
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

        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.allLaberOverheadCost = allWorkFlows;

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
        this.sourceLaborOverheadCost = new Laborandoverheadcostsetup();
        this.LaborOverheadCostName = "";
        this.sourceLaborOverheadCost.isActive = true;
        this.modal = this.modalService.open(content, { size: 'lg' });
        this.modal.result.then(() => {



            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }


    openDelete(content, row) {

        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceLaborOverheadCost = row;
        this.modal = this.modalService.open(content, { size: 'lg' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openEdit(content, row) {

        this.isEditMode = true;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceLaborOverheadCost = row;
        this.LaborOverheadCostName = this.sourceLaborOverheadCost.description;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'lg' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openHist(content, row) {

        this.sourceLaborOverheadCost = row;

        this.workFlowtService.historyLaborandOverheadcost(this.sourceLaborOverheadCost.laborOverloadCostId).subscribe(
            results => this.onHistoryLoadSuccessful(results[0], content),
            error => this.saveFailedHelper(error));
    }
    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceLaborOverheadCost = rowData;
            this.sourceLaborOverheadCost.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceLaborOverheadCost.isActive == false;
            this.workFlowtService.updateLaborandOverheadcost(this.sourceLaborOverheadCost).subscribe(
                response => this.saveCompleted(this.sourceLaborOverheadCost),
                error => this.saveFailedHelper(error));
            //alert(e);
        }
        else {
            this.sourceLaborOverheadCost = rowData;
            this.sourceLaborOverheadCost.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceLaborOverheadCost.isActive == true;
            this.workFlowtService.updateLaborandOverheadcost(this.sourceLaborOverheadCost).subscribe(
                response => this.saveCompleted(this.sourceLaborOverheadCost),
                error => this.saveFailedHelper(error));
            //alert(e);
        }

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
        else {
            for (let i = 0; i < this.actionamecolle.length; i++) {
                if (value == this.actionamecolle[i][0].LaborOverheadCostName.toLowerCase()) {
                    //alert("Action Name already Exists");
                    this.disableSave = true;
                    this.selectedActionName = event;
                }
            }
        }

    }
    //partnmId(event) {
    //	//debugger;
    //	for (let i = 0; i < this.actionamecolle.length; i++) {
    //		if (event == this.actionamecolle[i][0].LaborOverheadCostName) {
    //			//alert("Action Name already Exists");
    //			this.disableSave = true;
    //			this.selectedActionName = event;
    //		}
    //	}
    //}
    //filterActionAttributes(event) {

    //	this.localCollection = [];
    //	for (let i = 0; i < this.allLaberOverheadCost.length; i++) {
    //		let LaborOverheadCostName = this.allLaberOverheadCost[i].description;
    //		if (LaborOverheadCostName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
    //			this.actionamecolle.push([{
    //				"LaborOverloadCostId": this.allLaberOverheadCost[i].LaborOverloadCostId,
    //				"LaborOverheadCostName": LaborOverheadCostName
    //			}]),
    //				this.localCollection.push(LaborOverheadCostName)

    //		}
    //	}
    //}


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


    editItemAndCloseModel() {

        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceLaborOverheadCost.createdBy = this.userName;
            this.sourceLaborOverheadCost.updatedBy = this.userName;
            this.sourceLaborOverheadCost.masterCompanyId = 1;
            //this.sourceLaborOverheadCost.description = this.LaborOverheadCostName;
            this.workFlowtService.newLaborandOverheadcost(this.sourceLaborOverheadCost).subscribe(
                role => this.saveSuccessHelper(role),
                error => this.saveFailedHelper(error));
        }
        else {

            this.sourceLaborOverheadCost.updatedBy = this.userName;
            //this.sourceLaborOverheadCost.description = this.LaborOverheadCostName;
            this.sourceLaborOverheadCost.masterCompanyId = 1;
            this.workFlowtService.updateLaborandOverheadcost(this.sourceLaborOverheadCost).subscribe(
                response => this.saveCompleted(this.sourceLaborOverheadCost),
                error => this.saveFailedHelper(error));
        }

        this.modal.close();
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceLaborOverheadCost.updatedBy = this.userName;
        this.workFlowtService.deleteLaborandOverheadcost(this.sourceLaborOverheadCost.laborOverloadCostId).subscribe(
            response => this.saveCompleted(this.sourceLaborOverheadCost),
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

        this.loadData();
    }

    private saveSuccessHelper(role?: any) {
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

    showAuditPopup(template, id): void {
        this.getHistoryLaborandOverheadCostAuditDetails(id);
        this.modal = this.modalService.open(template, { size: 'sm' });
    }

    getHistoryLaborandOverheadCostAuditDetails(Id: number): void {
        this.AuditDetails = [];
        this.workFlowtService.getHistoryLaborandOverheadCostAuditDetails(Id).subscribe(audits => {
            if (audits.length > 0) {
                this.AuditDetails = audits;
                this.AuditDetails[0].ColumnsToAvoid = ["laborOverloadCostAuditId", "laborOverloadCostId", "masterCompanyId", "createdBy", "createdDate", "updatedDate"];
            }
        });
    }

}