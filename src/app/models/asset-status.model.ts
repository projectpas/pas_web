import { MasterCompany } from './mastercompany.model';

export class AssetStatus {
    constructor(masterCompany?: MasterCompany,
        assetStatusId?: number,
        Code?: string,
        Name?: string,
        Memo?: string,
        masterCompanyId?: number,
        createdBy?: string,
        updatedBy?: string,
        createdDate?: Date,
        updatedDate?: Date,
        isDelete?: boolean,
        isActive?: boolean) {
        this.assetStatusId = assetStatusId;
        this.code = Code;
        this.name = Name;
        this.memo = Memo;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.isDelete = isDelete;
        this.isActive = isActive;

    }
    public assetStatusId: number;
    public code: string;
    public name: string;
    public memo: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public isDelete: boolean;
    public isActive: boolean;   


}