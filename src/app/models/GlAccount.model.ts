export class GlAccount {
    glAccountId: number = NaN;
    ledgerName: string='';
    oldAccountCode: string='';
    accountCode: string='';
    accountName: string='';
    accountDescription: string='';
    summaryAccount: boolean;
    allowManualJE: boolean = false;
    currencyId: number = NaN;
    interCompany: boolean;
    activeFlag: boolean = false;
    balanceTypeActual: boolean;
    balanceTypeBudget: boolean;
    balanceTypeForecast: boolean;
    glAccountTypeId: number = NaN;
    subAccountOf: number = NaN;
    glClassFlowClassificationId: number=NaN;
    glAccountMiscCategoryId: number=NaN;
    glCreatedBy: string='';
    masterCompanyId: number=NaN;
    createdBy: string='';
    updatedBy: string='';
    createdDate: Date;
    updatedDate: Date;
    isActive: boolean;
    isDeleted: boolean;
    shareWithEntityIds:any=[];
    nodeTypeName:any='';
    category1099Id:any=null;
    managementStrtureId: number = NaN;
    legalEntityId: number = NaN;
    poroCategoryId: number = NaN;
    glAccountNodeId: number = NaN;
    glAccountList: GlAccount[];


}