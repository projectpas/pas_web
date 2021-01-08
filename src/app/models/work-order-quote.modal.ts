export class WorkOrderQuote {
  // quoteNumber: string;
  // openDate: string;
  // quoteDueDate: string;
  // validForDays: null;
  // expirationDate: Date;
  // expirationDateStatus: string;
  // workOrderNumber: string;
  // customerId: string;
  // customerCodeId: null;
  // customerReference: string;
  // isContract: boolean;
  // contract: string;
  // quantity: null;
  // customerRequestDate: Date;
  // promiseDate: Date;
  // estCompletionDate: Date;
  // estShipDate: Date;
  // creditTerms: string;
  // creditTermsandLimit: string;
  // itemCount: null;
  // currency: string;
  // dso: string;
  // accountsReceivableBalance: string;
  // partsDetails: multiParts[];
  WorkOrderQuoteId:number;
    WorkOrderId:number;
    WorkFlowWorkOrderId:number;
    QuoteNumber:number;
    openDate:Date = new Date();
    QuoteDueDate:Date;
    ValidForDays:number;
    ExpirationDate:Date;
    QuoteStatusId:number;
    CustomerId:number;
    Quantity:number;
    ItemCount:number;
    CurrencyId:number;
    // DSO:DSO;
    AccountsReceivableBalance:number;
    SalesPersonId:number;
    EmployeeId:number;
    masterCompanyId:number;
    createdBy:string = "admin";
    updatedBy:string = "admin";
    CreatedDate:Date;
    UpdatedDate:number;
    IsActive:boolean = true;
    IsDeleted:boolean = false;
    creditTermsandLimit: string;
    quoteNumber: any;
    expirationDateStatus: number;
    employeeId: any;
    versionNo: any;
  constructor() {
      this.WorkOrderId = 0;
      this.expirationDateStatus = 1;
  }
}
export class multiParts {
  partNumberId: number;
  partNumberDescription: string;
  revisedPartNumberId: number;
  workScopeId: number;
  qty: number;
  isCMMorPubRef: string;
  workFlowId: number;
  priority: string;
  customerRequestDate: string;
  promiseDate: string;
  estCompletionDate: string;
  estShipDate: string;
  isPMA: boolean;
  isDER: boolean;
  tatDaysStandard: number;
  isActive: boolean;

  constructor() {
    this.partNumberId = null;
    this.partNumberDescription = '';
    this.revisedPartNumberId = null;
    this.workScopeId = null;
    this.qty = null;
    this.isCMMorPubRef = '';
    this.workFlowId = null;
    this.priority = '';
    this.customerRequestDate = '';
    this.promiseDate = '';
    this.estCompletionDate = '';
    this.estShipDate = '';
    this.isPMA = false;
    this.isDER = false;
    this.tatDaysStandard = null;
      this.isActive = false;
      
  }
}

export class partsDetail{
  partNumber: string;
  partDescription: string;
  revisedPartNo: string;
  nte: number;
  condition: string;
  stockLine: string;
  serialNumber: number;
  publicationId: string;
  workOrderStage: string;
  workOrderStatus: string;
  priority: string;
  customerRequestDate: string;
  promisedDate: string;
  estimatedShipDate: string;
  estimatedCompletionDate: string;
  isDER: boolean;
  isPMA: boolean;
  firstName: string;
  techStation: string;
  tearDownReport: string;
  tatDaysCurrent: number;
  tatDaysStandard: number;
  workScope: number;
  workOrderId: number;
}
