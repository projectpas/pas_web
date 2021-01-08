import { MasterCompany } from './mastercompany.model';

export class TeardownReason {
    constructor(masterCompany?: MasterCompany, teardownReasonId?: number,
        reason?: string,
        masterCompanyId?: number,
        createdBy?: string,
        createdDate?: Date,
        updatedDate?: Date,
        updatedBy?: string,
        isActive?: boolean,
        memo?: string,
        isDeleted?: boolean) {
        this.teardownReasonId = teardownReasonId;
        this.reason = reason;
        this.memo = memo;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.isActive = isActive;
        this.isDeleted = isDeleted;
    }

    public teardownReasonId?: number;
    public reason?: string;
    public masterCompanyId?: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate?: Date;
    public updatedDate?: Date;
    public masterCompany?: MasterCompany;
    public isActive?: boolean;
    public memo: string;
    public isDeleted?: boolean;
}
