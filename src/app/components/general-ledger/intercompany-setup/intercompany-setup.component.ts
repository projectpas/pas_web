import { Component, OnInit } from '@angular/core';
import { GlAccountService } from '../../../services/glAccount/glAccount.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { InterCompanySetupService } from '../../../services/intercompany-setup-service';
import { GlAccount } from '../../../models/GlAccount.model';
import { InterCompanySetup } from '../../../models/intercompany-setup.model';
import { JournalType } from '../../../models/journaltype.model';
import { transformMenu } from '@angular/material';

@Component({
    selector: 'app-intercompany-setup',
    templateUrl: './intercompany-setup.component.html',
    styleUrls: ['./intercompany-setup.component.scss']
})
/** GLAccountList component*/
export class InterCompanySetupComponent implements OnInit {
    GlAccountList: GlAccount[];
    listInterCompanySetup: InterCompanySetup[];
    interCompanySetup: InterCompanySetup;
    journalTypes: JournalType[];
    modal: NgbModalRef;
    editableMode: boolean;
    disableSaveCusCode: boolean;
    disableSaveCusName: boolean;
    currentWorkingInterCompanySetup: InterCompanySetup;
    customerCodes: any[];
    customerNames: any[];
    filteredCustomerCodes: any[];
    filteredCustomerNames: any[];
    internetCompanySetupView: InterCompanySetup;
    moduleName: string = 'Intercompany Setup';


    constructor(
        private router: Router,
        private modalService: NgbModal,
        private alertService: AlertService,
        private glAccountService: GlAccountService,
        private interCompanySetupService: InterCompanySetupService) {
        this.currentWorkingInterCompanySetup = new InterCompanySetup();
        this.interCompanySetup = new InterCompanySetup();
        this.internetCompanySetupView = new InterCompanySetup();

    }

    ngOnInit(): void {
        this.getJournalTypes();
        this.getGlAccountList();
        this.getInterCompanySetupList();
    }

    getGlAccountList(): void {
        this.glAccountService.getAll().subscribe(glAccountData => {
            this.GlAccountList = glAccountData[0];
        });
    }

    getJournalTypes(): void {
        this.journalTypes = [
            { journalTypeId: 1, journalType: "Dummy" },
            { journalTypeId: 2, journalType: "Dummy2" }
        ];
    }

    getInterCompanySetupList(): void {

        this.interCompanySetupService.getIntercompanySetupList().subscribe(result => {
            this.listInterCompanySetup = result;
            for (let interCompany of this.listInterCompanySetup) {
                interCompany.objjournalType = Object.assign({}, this.getJournalTypeById(interCompany.journalType));
            }
            console.log(result[0]);
        });
    }

    addInterCompanySetup(): void {
        if (!this.disableSaveCusCode && !this.disableSaveCusName) {
            this.interCompanySetupService.addInterCompanySetup(this.interCompanySetup).subscribe(
                result => {
                    this.alertService.showMessage(this.moduleName, "Intercompany Setup Successfully Added : " + this.interCompanySetup.affiliateCode, MessageSeverity.success);
                    this.getInterCompanySetupList();
                    this.resetEditableMode();
                },
                error => {
                    var message = '';
                    if (error.error.constructor == Array) {
                        message = error.error[0].errorMessage;
                    }
                    else {
                        message = error.error.Message;
                    }
                    this.alertService.showMessage(this.moduleName, message, MessageSeverity.error);
                    this.resetEditableMode();
                }
            );
        }
        else {
            this.alertService.showMessage(this.moduleName, "Company Code OR Company name already exists", MessageSeverity.error)
        }
    }

    openDelete(content, row): void {
        this.currentWorkingInterCompanySetup = row;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    viewInterCompanySetup(content, interCompanySetup) {
        this.internetCompanySetupView = interCompanySetup;
        this.modal = this.modalService.open(content, { size: 'sm' });
        ////this.modal.result.then(() => {
        ////    console.log('When user closes');
        ////}, () => { console.log('Backdrop click') })

    }

    deleteItemAndCloseModel(): void {
        this.interCompanySetupService.removeInterCompanySetup(this.currentWorkingInterCompanySetup.interCompanySetupId).subscribe(
            result => {
                this.alertService.showMessage(this.moduleName, "Intercompany Setup deleted Successfully : " + this.currentWorkingInterCompanySetup.affiliateCode, MessageSeverity.success);
                this.getInterCompanySetupList();
            },
            error => {
                var message = '';
                if (error.error.constructor == Array) {
                    message = error.error[0].errorMessage;
                }
                else {
                    message = error.error.Message;
                }
                this.alertService.showMessage(this.moduleName, message, MessageSeverity.error);
                this.resetEditableMode();
            }
        );
        this.modal.close();
    }

    getJournalTypeById(JournalTypeId: number): JournalType {
        return this.journalTypes.filter(function (journal) {
            return journal.journalTypeId == JournalTypeId;
        })[0];
    }

    editInterCompanySetup(interCompanySetup: InterCompanySetup): void { 
        this.editableMode = true;
        this.interCompanySetup = interCompanySetup;
    }

    resetEditableMode(): void {
        this.editableMode = false;
        this.interCompanySetup = new InterCompanySetup();
    }

    updateInterCompanySetup(): void {
        this.interCompanySetupService.updateInterCompanySetup(this.interCompanySetup).subscribe(
            result => {
                this.alertService.showMessage(this.moduleName, "Intercompany Setup updated Successfully : " + this.interCompanySetup.affiliateCode, MessageSeverity.success);
                this.getInterCompanySetupList();
                this.resetEditableMode();
            },
            error => {
                var message = '';
                if (error.error.constructor == Array) {
                    message = error.error[0].errorMessage;
                }
                else {
                    message = error.error.Message;
                }
                this.alertService.showMessage(this.moduleName, message, MessageSeverity.error);
                this.resetEditableMode();
            }
        );
    }

    dismissModel() {
        this.modal.close();
    }

    filterCustomerCodes(event): void {
        this.customerCodes = [];
        this.disableSaveCusCode = false;
        this.filteredCustomerCodes = [];
        if (this.listInterCompanySetup.length > 0) {
            for (let i = 0; i < this.listInterCompanySetup.length; i++) {
                let code: string = this.listInterCompanySetup[i].affiliateCode;
                if (code.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.filteredCustomerCodes.push([{
                        "customerId": this.listInterCompanySetup[i].affiliateCode,
                        "code": code
                    }]),
                        this.customerCodes.push(code);
                }
            }
        }
    }

    onCustomercodeSelected(event): void {
        for (let i = 0; i < this.filteredCustomerCodes.length; i++) {
            if (event == this.filteredCustomerCodes[i][0].code) {
                this.disableSaveCusCode = true;
            }
        }
    }

    filterCustomerNames(event): void {
        this.customerNames = [];
        this.disableSaveCusName = false;
        this.filteredCustomerNames = [];
        if (this.listInterCompanySetup.length > 0) {
            for (let i = 0; i < this.listInterCompanySetup.length; i++) {
                let code: string = this.listInterCompanySetup[i].affiliateName;
                if (code.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.filteredCustomerNames.push([{
                        "customerId": this.listInterCompanySetup[i].affiliateName,
                        "name": code
                    }]),
                        this.customerNames.push(code);
                }
            }
        }
    }

    onCustomernameSelected(event): void {
        for (let i = 0; i < this.filteredCustomerNames.length; i++) {
            if (event == this.filteredCustomerNames[i][0].name) {
                this.disableSaveCusName = true;
            }
        }
    }

}