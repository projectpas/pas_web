import { MasterCompany } from './mastercompany.model';

export class TagType {
    constructor(masterCompany?: MasterCompany, tagTypeId?: number,
        name?: string,
        description?: string,
        masterCompanyId?: number,
        createdBy?: string,
        createdDate?: Date,
        updatedDate?: Date,
        updatedBy?: string,
        isActive?: boolean,
        memo?: string,
        isDeleted?: boolean) {
        this.name = name;
        this.tagTypeId = tagTypeId;
        this.description = description;
        this.memo = memo;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.isActive = isActive;
        this.isDeleted = isDeleted;
    }

    public tagTypeId: number;
    public name: string;
    public description: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public masterCompany?: MasterCompany;
    public isActive: boolean;
    public memo: string;
    public isDeleted: boolean;
}
