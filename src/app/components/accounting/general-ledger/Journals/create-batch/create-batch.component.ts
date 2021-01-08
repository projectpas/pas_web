import { OnInit, Component } from "@angular/core";
import { fadeInOut } from "../../../../../services/animations";
import { AlertService } from "../../../../../services/alert.service";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { SingleScreenAuditDetails, AuditChanges } from "../../../../../models/single-screen-audit-details.model";
import { AuthService } from "../../../../../services/auth.service";
import { JournalBatch } from "../../../../../models/JournalBatch";
import { JournelService } from "../../../../../services/journals/journals.service";
import { CurrencyService } from "../../../../../services/currency.service";
import { Currency } from '../../../../../models/currency.model';
import { LegalEntityService } from "../../../../../services/legalentity.service";
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'app-create-batch',
    templateUrl: './create-batch.component.html',
    animations: [fadeInOut]
    //styleUrls: ['./create-batch.component.scss']
})
/** create-batch component*/
export class CreateBatchComponent implements OnInit
{
    loadingIndicator: boolean;
    currentJournelBatch: JournalBatch;
    journelBatchToUpdate: JournalBatch;
    journelBatchToRemove: JournalBatch;
    journelBatchList: JournalBatch[];
    modal: NgbModalRef;
    display: boolean = false;
    modelValue: boolean = false;
    Active: string;
    allCurrencyInfo: any[];
    companyList: any[] = [];

    constructor(private router: Router,private legalEntityservice: LegalEntityService,public currency: CurrencyService,private alertService: AlertService, private journelService: JournelService, private modalService: NgbModal, private authService: AuthService)
    {
        if (this.journelService.manulaBatchCollection)
        {
            this.currentJournelBatch = this.journelService.manulaBatchCollection;
        }
    }

    ngOnInit(): void
    {
        this.CurrencyData();
        this.loadCompaniesData();

        //this.journelService.getAllBatch().subscribe(journelBatch => {
        //    this.journelBatchList = journelBatch[0];
        //    this.journelBatchList.forEach(function (journelBatch) {
        //        journelBatch.isActive = journelBatch.isActive == false ? false : true;
        //    });
        //});
        //this.currentJournelBatch = new JournalBatch();
    }

    private loadCompaniesData() {
        this.legalEntityservice.getEntityList().subscribe(entitydata => {
            this.companyList = entitydata[0];
        });
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    //addJournelBatch(): void {
    //    this.currentJournelBatch.createdBy = this.userName;
    //    this.currentJournelBatch.updatedBy = this.userName;
    //    this.journelService.addBatch(this.currentJournelBatch).subscribe(batch => {
    //        this.alertService.showMessage('Batch added successfully.');
    //        this.journelService.getAllBatch().subscribe(batch => {
    //            this.journelBatchList = batch[0];
    //        });
    //        this.resetAddBatch();
    //    });

    //}

    setJournelBatchToUpdate(editBatchPopup: any, id: number): void {
        this.currentJournelBatch = Object.assign({}, this.journelBatchList.filter(function (batch) {
            return batch.id == id;
        })[0]);
        this.modal = this.modalService.open(editBatchPopup, { size: 'sm' });
    }

    updateBatch(): void {
        this.currentJournelBatch.updatedBy = this.userName;
        this.journelService.updateBatch(this.currentJournelBatch).subscribe(batch => {
            this.alertService.showMessage('Batch updated successfully.');
            //this.journelService.getAllBatch().subscribe(batches => {
            //    this.journelBatchList = batches[0];
            //});
            //this.resetUpdateBatch();
            this.router.navigateByUrl('/accountmodule/accountpages/app-view-batch');
            this.dismissModel();
        });
        this.router.navigateByUrl('/accountmodule/accountpages/app-view-batch');
    }

    removeBatch(): void {
        this.journelService.removeBatch(this.journelBatchToRemove.id).subscribe(response => {
            this.alertService.showMessage("Batch removed successfully.");
            this.journelService.getAllBatch().subscribe(batches => {
                this.journelBatchList = batches[0];
                this.modal.close();
            });
        });

    }
    //resetAddBatch(): void {
    //    this.currentJournelBatch = new JournalBatch();
    //}

    resetUpdateBatch(): void {
        this.journelBatchToUpdate = new JournalBatch();
    }

    dismissModel(): void {
        if (this.modal != undefined) {
            this.modal.close();
        }
    }

    confirmDelete(content, id): void {
        this.journelBatchToRemove = Object.assign({}, this.journelBatchList.filter(function (batch) {
            return batch.id == id;
        })[0]);;
        this.modal = this.modalService.open(content, { size: 'sm' });
    }

    toggleIsActive(assetStatus: any, event): void {
        this.journelBatchToUpdate = assetStatus;
        this.journelBatchToUpdate.isActive = event.checked == false ? false : true;
        this.updateBatch();
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

    private onDataLoadFailed(error: any) {

    }

    //showAuditPopup(template, id): void {
    //    this.auditAssetStatus(id);
    //    this.modal = this.modalService.open(template, { size: 'sm' });
    //}

    //auditAssetStatus(assetStatusId: number): void {
    //    this.AuditDetails = [];
    //    this.journelService.getAssetAudit(assetStatusId).subscribe(audits => {
    //        if (audits.length > 0) {
    //            this.AuditDetails = audits;
    //            this.AuditDetails[0].ColumnsToAvoid = ["assetStatusAuditId", "id", "createdBy", "createdDate", "updatedDate"];
    //        }
    //    });
    //}
}