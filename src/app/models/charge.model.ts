import { MasterCompany } from './mastercompany.model';

export class Charge {
    ManagementStructureId: any;
    
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(masterCompany?: MasterCompany, chargeId?: number, cost?: number, billableAmount?: number, isActive?: boolean, chargeType?: string, quantity?: number, markUp?: number, 
        currencyId?: number, purchaseOrderId?: number, vendorId?: number, integrationPortalId?: number,
         glAccountId?: number, functionalCurrencyId ?: number, masterCompanyId?: number, managementStructureId?:number,
          createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, memo?: string, IsDeleted?:boolean,
           description?:string,markUpPercentage?:number) {

        this.chargeId = chargeId;
       // this.currencyId = currencyId;
        //this.purchaseOrderId = purchaseOrderId;
        //this.vendorId = vendorId;
        //this.integrationPortalId = integrationPortalId;
        this.glAccountId = glAccountId;
        //this.functionalCurrencyId = functionalCurrencyId;
        //this.markUp = markUp;
        this.chargeType = chargeType;
        //this.quantity = quantity;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.isActive = isActive;
        this.isDeleted=IsDeleted;
        this.memo = memo;
        //this.cost=cost;
        //this.billableAmount= billableAmount;
        //this.managementStructureId=managementStructureId;
        this.description=description;
       // this.markUpPercentage=markUpPercentage;
    }

    public chargeId: number;
    //public currencyId: number;
    //public purchaseOrderId: number;
    //public vendorId: number;
    //public integrationPortalId: number;
    public glAccountId: number;
    //public functionalCurrencyId: number;
    //public markUp: number;
    public chargeType: string;
    //public billableAmount:number;
    //public quantity: number;
    public isActive?: boolean;
    public isDeleted?:boolean;
    public masterCompany: MasterCompany;
    //public cost:number;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public memo: string;
    //public managementStructureId:number;
    public description:string
    //public markUpPercentage:number
}