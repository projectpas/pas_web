export class JournalManual {
    id: number;
    isManual: boolean;
    gLAccountId: number;
    batchNumber: number;
    batchName: string;
    batchDescription: string;
    balanceTypeId: number;
    journalCategoryId: number;
    journalTypeId: number;
    entryDate: Date;
    effectiveDate: Date;
    accountingCalendarId: number;
    journalPeriodName: string;
    employeeId: number;
    localCurrencyId: number;
    reportingCurrencyId: number;
    currencyDate: Date;
    journalCurrencyTypeId: number;
    currencyRate: number;
    isReversing: boolean;
    reversingDate: Date;
    reversingAccountingCalendarId: number;
    isRecurring: boolean;
    recurringDate: Date;
    // reversingPeriodName: string;
    masterCompanyId: number;

    localDebitCurrency: number;
    localCreditCurrency: number;
    reportingDebitCurrency: number;
    reportingCreditCurrency: number;

    description: string;
    managementStructureEntityId: number;

    createdBy: string;
    updatedBy: string;
    createdDate: string;
    updatedDate: string;
    isDeleted: boolean;
    isActive: boolean;
    journalManualList: JournalManual[];
    
    constructor() {
        this.isManual = true;
        this.gLAccountId = 0;
        this.batchNumber = 0;
        this.batchName = '';
        this.batchDescription = '';
        this.balanceTypeId = 0;
        this.journalCategoryId = 0;
        this.journalTypeId = 0;
        this.entryDate = new Date;
        this.effectiveDate = new Date;
        this.accountingCalendarId = 0;
        this.journalPeriodName = '';
        this.employeeId = 0;
        this.localCurrencyId = 0;
        this.reportingCurrencyId = 0;
        this.currencyDate = new Date;
        this.journalCurrencyTypeId = 0;
        this.currencyRate = 0;
        this.isReversing = false;
        this.reversingDate = new Date;
        this.reversingAccountingCalendarId = 0;
        this.isRecurring = false;
    // reversingPeriodName: string;
        this.masterCompanyId = 0;

        this.localDebitCurrency = 0;
        this.localCreditCurrency = 0;
        this.reportingDebitCurrency = 0;
        this.reportingCreditCurrency = 0;

        this.description = '';
        this.managementStructureEntityId = 0;

        this.isDeleted = false;
        this.isActive = true;
    }
}