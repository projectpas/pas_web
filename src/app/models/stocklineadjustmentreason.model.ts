import { MasterCompany } from './mastercompany.model';

export class StocklineAdjustmentReason {
    // glaccountclassname: string;


    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(masterCompany?: MasterCompany, iD?: number, stockAdjustmentReason?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, isDelete?: boolean, Memo?: string) {

        this.iD = iD;
        this.stockAdjustmentReason = stockAdjustmentReason;
        this.memo = Memo;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.isActive = isActive;
        this.isDelete = isDelete;
    }

    public iD: number;
    public stockAdjustmentReason: string;
    public memo: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public isActive: boolean;
    public isDelete: boolean;





}