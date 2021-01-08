

export class ItemMasterLoanExchange {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(isLoan?: boolean, isActive?: boolean, isExchange?: boolean,
        exchangeCurrencyId?: number, 
        masterCompanyId?: number, loanCurrencyId?:number,exchangeListPrice?: number, exchangeCorePrice?: number,
        exchangeOverhaulPrice?: number,exchangeOverhaulCost?: number,exchangeOutrightPrice?: number,exchangeCoreCost?: number,loanFees?: number,
        loanCorePrice? :number, loanOutrightPrice?: number,isDeleted?: boolean,
         createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string
		, memo?: string, itemMasterId?:number,itemMasterLoanExchId?:number ) {

        this.itemMasterLoanExchId= itemMasterLoanExchId;
        this.itemMasterId=itemMasterId;
        this.isLoan = isLoan;
        this.isExchange = isExchange;
        this.isActive = isActive;
        this.exchangeCurrencyId = exchangeCurrencyId;
        this.loanCurrencyId= loanCurrencyId;
        this.exchangeListPrice=exchangeListPrice;
        this.exchangeCorePrice=exchangeCorePrice;
        this.exchangeOverhaulPrice=exchangeOverhaulPrice;
        this.exchangeOverhaulCost=exchangeOverhaulCost;
        this.exchangeOutrightPrice=exchangeOutrightPrice;
        this.exchangeCoreCost=exchangeCoreCost;
        this.loanFees=loanFees;
        this.loanCorePrice=loanCorePrice;
        this.loanOutrightPrice=loanOutrightPrice;
        this.masterCompanyId = masterCompanyId;
        this.isDeleted = isDeleted;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
	
    }

    public itemMasterLoanExchId:number;
    public itemMasterId:number;
    public isLoan: boolean;
    public isExchange: boolean;
    public exchangeCurrencyId: number;
    public loanCurrencyId: number;
    public exchangeListPrice: number;
    public exchangeCorePrice : number;
    public exchangeOverhaulPrice: number;
    public exchangeOverhaulCost: number;
    public exchangeOutrightPrice: number;
    public exchangeCoreCost: number;
    public loanFees: number;
    public loanCorePrice: number;
    public loanOutrightPrice: number;
    public  isActive : boolean;
    public  isDeleted: boolean;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;



}