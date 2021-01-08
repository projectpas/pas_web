import { MasterCompany } from './mastercompany.model';

export class ATAMain {
	// Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(ataChapterCode?: number, masterCompany?: MasterCompany, ataMainId?: number, isActive?: boolean, isDelete?: boolean, ataChapterName?: string, ataChapterCategory?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, memo?: string) {

        this.ataMainId = ataMainId;
        this.ataChapterName = ataChapterName;
		this.ataChapterCategory = ataChapterCategory;
		
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.isActive = isActive;
        this.isDelete = isDelete;
		this.memo = memo;
    }

    public ataMainId: number;
	public ataChapterName: string;
    public ataChapterCategory: string;
    public isActive?: boolean;
    public isDelete?: boolean;
    public masterCompany: MasterCompany;
    
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
	public memo: string;
}