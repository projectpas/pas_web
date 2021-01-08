export class JournalBatch {
    id: number;
    JournalBatchNumber: number;
    JournalBatchDescription: string;
    JournalBatchName: string;
    glAccountId: number;
    JournalSourceId: number;
    JournalTypeId: number;
    JournalPeriodName: string;
    LocalCurrencyId: number;
    LocalDebitAmount: number;
    LocalCreditAmount: number;
    ReportingCurrencyId: number;
    ReportingDebitAmount: number;
    ReportingCreditAmount: number;
    IsReversing: boolean;
    IsRecurring: boolean;
    MasterCompanyId: number;
    
    createdBy: string;
    updatedBy: string;
    createdDate: Date;
    updatedDate: Date;
    isDeleted: boolean;
    isActive: boolean;
    journelBatchList: JournalBatch[];

}