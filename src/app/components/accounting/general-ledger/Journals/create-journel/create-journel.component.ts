import { Component, OnInit } from '@angular/core';
import { AlertService } from "../../../../../services/alert.service";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { SingleScreenAuditDetails, AuditChanges } from "../../../../../models/single-screen-audit-details.model";
import { AuthService } from "../../../../../services/auth.service";
import { JournelService } from "../../../../../services/journals/journals.service";
import { fadeInOut } from "../../../../../services/animations";
import { JournalManual } from '../../../../../models/journal-manual';
import { LegalEntityService } from '../../../../../services/legalentity.service';
import { EmployeeService } from '../../../../../services/employee.service';
import { Currency } from '../../../../../models/currency.model';
import { CurrencyService } from '../../../../../services/currency.service';
import { AccountListingService } from '../../../../../services/account-listing/account-listing.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { pulloutRequiredFieldsOfForm } from '../../../../../../app/validations/form.validator';

@Component({
    selector: 'app-create-journel',
    templateUrl: './create-journel.component.html',
    styleUrls: ['./create-journel.component.scss']
})
/** create-journel component*/
export class CreateJournelComponent implements OnInit
{

    divisionlist: any[];
    departmentList: any[];
    bulist: any[];
    accountNumberCollection: any[];
    accountNumberListForEntity: any;
    updateJournelButton: boolean;
    toggleRecurringGrid: boolean;
    toggleReversingGrid: boolean;
    allEmployeeinfo: any[] = [];
    balanceTypes: any[] = [];
    categoryTypes: any[] = [];
    journalTypes: any[] = [];
    generalLedgerList: any[] = [];
    firstCollection: any[];
    loadingIndicator: boolean;
    allCurrencyInfo: any[];
    EmployeeNamecoll: any[] = [];
    maincompanylist: any[] = [];
    allManagemtninfo: any[] = [];
    currencyTypes: any[] = [];

    currentManualJournel: JournalManual;
    manualJournelToUpdate: JournalManual;
    manualJournelToRemove: JournalManual;
    manualJournelList: JournalManual[];
    modal: NgbModalRef;
    display: boolean = false;
    modelValue: boolean = false;
    Active: string;
    companyList: any[] = [];
    AddRors: Array<any> = [];

    disableSaveLedgerName: boolean = false;
    ledgerNames: any[];
    ledgerName: string;
    formSubmitted: boolean = false;
    listOfErrors: any = [];

    /** create-journel ctor */
    constructor(public legalService: LegalEntityService,
                public currency: CurrencyService,
                public employeeService: EmployeeService,
                private legalEntityservice:LegalEntityService,
                private alertService: AlertService, 
                private journelService: JournelService, 
                private modalService: NgbModal, 
                private authService: AuthService,
                private accountListingService: AccountListingService,
                private fb: FormBuilder)
    {
        if (this.journelService.manulaJournelCollection)
        {
            this.currentManualJournel = this.journelService.manulaJournelCollection;

            if (this.currentManualJournel.entryDate) {
                this.currentManualJournel.entryDate = new Date(this.currentManualJournel.entryDate);
            }

            if (this.currentManualJournel.effectiveDate) {
                this.currentManualJournel.effectiveDate = new Date(this.currentManualJournel.effectiveDate);
            }

            if (this.currentManualJournel.currencyDate) {
              this.currentManualJournel.currencyDate = new Date(this.currentManualJournel.currencyDate);
            }

            if (this.currentManualJournel.reversingDate) {
                this.currentManualJournel.reversingDate = new Date(this.currentManualJournel.reversingDate);
            }

            this.updateJournelButton = true; 
        }
    }
    ngOnInit(): void
    {
        if (this.journelService.manulaJournelCollection == null) {
            this.currentManualJournel = new JournalManual();
            this.currentManualJournel.isManual = true;
        }

        this.loadCompaniesData();//loading for Company information
        this.CurrencyData();
        this.employeedata();
        this.loadManagementdata();
        this.loadBalanceTypes();
        this.loadCategoryTypes();
        this.loadJournalTypes();
        this.loadGeneralLedgerList();
        this.Add();
        this.formInitialise();
        this.loadJournalCurrencyTypes();
        console.log(this);
    }
    gLAccountId;
    journalForm: FormGroup;
    private formInitialise(){
        this.journalForm = this.fb.group({
            gLAccountId: new FormControl('', Validators.required),
            batchNumber: new FormControl({value:'Creating', disabled: true}),
            batchName: new FormControl('', Validators.required),
            batchDescription: new FormControl('', Validators.required),
            balanceTypeId: new FormControl('', Validators.required),
            journalCategoryId: new FormControl('', Validators.required),
            journalTypeId: new FormControl('', Validators.required),
            entryDate: new FormControl,
            effectiveDate: new FormControl,
            journalPeriodName: new FormControl,
            employeeId: new FormControl('', Validators.required),
            localCurrencyId: new FormControl('', Validators.required),
            reportingCurrencyId: new FormControl('', Validators.required),
            currencyDate: new FormControl,
            journalCurrencyTypeId: new FormControl('', Validators.required),
            currencyRate: new FormControl,
            isReversing: new FormControl,
            reversingDate: new FormControl,
            isRecurring: new FormControl,
            recurringDate: new FormControl,
            masterCompanyId: new FormControl,
            // reversingstatus: new FormControl,

        });
        
    }

    setReversing(): void {
        this.journalForm.controls.isRecurring.setValue(null);
    }

    setReccurring(): void {
        this.journalForm.controls.isReversing.setValue(null);
    }

    onSubmit(type: string){
        this.formSubmitted = true;
        if(!this.journalForm.valid){
            this.listOfErrors = pulloutRequiredFieldsOfForm(this.journalForm);
            this.display = true;
            this.modelValue = true;
            console.log('Form control has not been passed. please check.');
            console.log(this);
            return false;
        }
        this.addJournelManual(type);
    }
    private loadCompaniesData() {
        this.legalEntityservice.getEntityList().subscribe(entitydata => {
            this.companyList = entitydata[0];
        });
    }

    private loadBalanceTypes(){
        this.journelService.getAllBalanceTypes().subscribe(balanceTypes => {
            this.balanceTypes = balanceTypes;
        });
    }

    private loadCategoryTypes(){
        this.journelService.getAllJournalCategory().subscribe(journalCategory => {
            this.categoryTypes = journalCategory;
        });
    }

    private loadJournalTypes(){
        this.journelService.getAllJournalTypes().subscribe(journalTypes => {
            this.journalTypes = journalTypes;
        });
    }

    private loadGeneralLedgerList(){
        this.generalLedgerList = [];
        this.accountListingService.getLedgerData().subscribe(
            datalist=> {
                console.log(datalist);
                this.generalLedgerList = datalist;                
            },
            error => {
                console.log('error in getting information')
            }
        );
    }

    private loadJournalCurrencyTypes(){
        this.journelService.getJournalCurrencyTypes().subscribe(
            datalist => {
                this.currencyTypes = datalist;
            },
            error => {
                console.log('error while fetching journal currency types');
            }
        );
    }

    get userName(): string
    {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    addJournelManual(type): void
    {
        console.log('Type of post : ', type);
        this.currentManualJournel.createdBy = this.userName;
        this.currentManualJournel.updatedBy = this.userName;
        this.currentManualJournel.createdDate = this.getCurrentTimeStamp();
        this.currentManualJournel.updatedDate = this.getCurrentTimeStamp();
        this.currentManualJournel.isActive = true;
        this.currentManualJournel.isDeleted = false;

        this.journelService.addJournel(this.currentManualJournel).subscribe(journel => {
            this.alertService.showMessage('Manual Journel added successfully.');
            //this.journelService.getAllJournel().subscribe(journel => {
            //    this.manualJournelList = journel[0];
            //});
            this.resetAddBatch();
        });
    }

    getCurrentTimeStamp(): string {
        const now = new Date();
        const year = "" + now.getFullYear();
        let month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
        let day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
        let hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
        let minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
        let second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }

    setManualJournlToUpdate(editManulaJournelPopup: any, id: number): void {
        this.manualJournelToUpdate = Object.assign({}, this.manualJournelList.filter(function (journel) {
            return journel.id == id;
        })[0]);
        this.modal = this.modalService.open(editManulaJournelPopup, { size: 'sm' });
    }

    updateManualJournel(): void {
        this.currentManualJournel.updatedBy = this.userName;
        this.journelService.updateJournel(this.currentManualJournel).subscribe(journel => {
            this.alertService.showMessage('Journel updated successfully.');
            this.journelService.getAllJournel().subscribe(journel => {
                this.manualJournelList = journel[0];
            });
            this.resetUpdateBatch();
            this.dismissModel();
        });
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
    resetAddBatch(): void {
        this.currentManualJournel = new JournalManual();
        this.currentManualJournel.isManual = true;
    }

    resetUpdateBatch(): void {
        this.manualJournelToUpdate = new JournalManual();
        this.manualJournelToUpdate.isManual = true;
    }

    Add() {
        this.AddRors.push({
            'Line 1': 1,
            'maincompanylist': this.maincompanylist,
            'bulist': this.bulist,
            'divisionlist': this.divisionlist,
            'departmentList': this.departmentList,
            'accountNumberCollection': this.accountNumberCollection
        })
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

    toggleIsActive(manualJournelStatus: any, event): void {
        this.manualJournelToUpdate = manualJournelStatus;
        this.manualJournelToUpdate.isActive = event.checked == false ? false : true;
        this.updateManualJournel();
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

    
    filterfirstName(event) {
        this.firstCollection = [];
        for (let i = 0; i < this.allEmployeeinfo.length; i++) {
            let firstName = this.allEmployeeinfo[i].firstName ;
            if (firstName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.EmployeeNamecoll.push([{
                    "employeeId": this.allEmployeeinfo[i].employeeId,
                    "employeeName": firstName
                }]) ,
                this.firstCollection.push(firstName);
            }
        }
    }

    onEmployeeselected(event)
    {
        for (let i = 0; i < this.EmployeeNamecoll.length; i++) {
            if (event == this.EmployeeNamecoll[i][0].employeeName)
            {
                this.currentManualJournel.employeeId = this.EmployeeNamecoll[i][0].employeeId;
            }

        }
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

    //show and Hide for Reversing and recurring

    toggleReversingData(data)
    {
        this.toggleReversingGrid = !this.toggleReversingGrid;
    }

    toggleRecurringData()
    {
        this.toggleRecurringGrid = !this.toggleRecurringGrid;
    }

    //get Legal Entity Data Based on ledger Selection

    getLegalEntityData(glAccountId)
    {
       this.accountNumberCollection = [];
        this.legalEntityservice.getEntityAccounts(glAccountId).subscribe(journels => {
            this.accountNumberListForEntity = journels[0][0];
            if (this.accountNumberListForEntity)
            {
                if (this.accountNumberListForEntity.accountNumber)
                {
                    this.accountNumberCollection.push({
                        "accountNO": this.accountNumberListForEntity.accountNumber,
                    })
                }
                if (this.accountNumberListForEntity.achAccountNumber) {
                    this.accountNumberCollection.push({
                        "accountNO": this.accountNumberListForEntity.achAccountNumber,
                    })
                }
                if (this.accountNumberListForEntity.beneficiaryBankAccount) {
                    this.accountNumberCollection.push({
                        "accountNO": this.accountNumberListForEntity.beneficiaryBankAccount,
                    })
                }
            }
        });
    }

    //company Data Handling

    private loadManagementdata()
    {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.legalService.getManagemententity().subscribe(
            results => this.onManagemtntdataLoad(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onManagemtntdataLoad(getAtaMainList: any[])
    {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allManagemtninfo = getAtaMainList;
        for (let i = 0; i < this.allManagemtninfo.length; i++)
        {
            if (this.allManagemtninfo[i].parentId == null) {
                this.maincompanylist.push(this.allManagemtninfo[i]);
            }
        }
    }

    getBUList(companyId) {
        this.currentManualJournel.masterCompanyId = companyId; //Saving Management Structure Id if there Company Id
        this.bulist = [];
        this.departmentList = [];
        this.divisionlist = [];
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == companyId) {
                this.bulist.push(this.allManagemtninfo[i]);
            }
        }
    }

    getDepartmentlist(businessUnitId) {
        this.currentManualJournel.masterCompanyId = businessUnitId;
        this.departmentList = [];
        this.divisionlist = [];
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == businessUnitId) {
                this.departmentList.push(this.allManagemtninfo[i]);
            }
        }
    }

    getDivisionlist(departmentId) {
        this.currentManualJournel.masterCompanyId = departmentId;
        this.divisionlist = [];
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == departmentId) {
                this.divisionlist.push(this.allManagemtninfo[i]);
            }
        }
    }
    getDivisionChangeManagementCode(divisionId) {
        this.currentManualJournel.masterCompanyId = divisionId;
    }

    localDebitCurrencyChange(amount)
    {
        this.currentManualJournel.reportingDebitCurrency = this.currentManualJournel.localDebitCurrency * this.currentManualJournel.currencyRate;
    }
}