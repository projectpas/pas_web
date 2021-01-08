import { MasterCompany } from './mastercompany.model';

export class DepriciationMethod {
    constructor(masterCompany?: MasterCompany,
        assetDepreciationMethodId?: number,
        Code?: string,
        sequenceNo?: number,
        Name?: string,        
        DepreciationMethod?: string,
        Memo?: string,
        masterCompanyId?: number,
        createdBy?: string,
        updatedBy?: string,
        createdDate?: Date,
        updatedDate?: Date,
        isDeleted?: boolean,
        isActive?: boolean) {
        this.assetDepreciationMethodId = assetDepreciationMethodId;
        this.code = Code;
        this.name = Name;
        this.sequenceNo = sequenceNo;
        this.depreciationMethod = DepreciationMethod;
        this.memo = Memo;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.isDeleted = isDeleted;
        this.isActive = isActive;
    }

    public assetDepreciationMethodId: number;    
    public code: string;
    public name: string;
    public depreciationMethod: string;
    public memo: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public isDeleted: boolean;
    public isActive: boolean;
    public sequenceNo: number;

}