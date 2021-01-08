import { MasterCompany } from './mastercompany.model';

export class ATAChapter {
	// Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(ataChapterCode?: number, ataChapterId?: number, isActive?: boolean, isDelete?: boolean, ataChapterName?: string, ataChapterCategory?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, memo?: string) {

		this.ataChapterId = ataChapterId;
        this.ataChapterName = ataChapterName;
		this.ataChapterCategory = ataChapterCategory;
		this.ataChapterCode = ataChapterCode;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.isActive = isActive;
        this.isDelete = isDelete;
		this.memo = memo;
    }

	public ataChapterId: number;
	public ataChapterName: string;
	public ataChapterCode: number;
    public ataChapterCategory: string;
    public isActive: boolean;
    public isDelete: boolean;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
	public memo: string;
}