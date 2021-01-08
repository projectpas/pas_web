import { MasterCompany } from './mastercompany.model';

export class ATASubChapter {
    ataChapterCode: any;
	// Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(ataChapterId?: number, ataSubChapterCode?: number, masterCompany?: MasterCompany, ataSubChapterId?: number, description?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, memo?: string) {
        this.ataSubChapterId = ataSubChapterId;
        this.ataSubChapterCode = ataSubChapterCode;
		this.description = description;
		this.ataChapterId = ataChapterId,
		this.masterCompanyId = masterCompanyId;
		this.createdBy = createdBy;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
		this.updatedBy = updatedBy;
		this.masterCompany = masterCompany;
		this.isActive = isActive;
		this.memo = memo;
	}
	public ataSubChapterId: number;
	public ataChapterId: number;
	public description: string;
	public ataSubChapter1Id: number;
	public masterCompanyId: number;
	public createdBy: string;
	public updatedBy: string;
	public createdDate: Date;
	public updatedDate: Date;
	public masterCompany?: MasterCompany;
	public isActive: boolean;
	public memo: string;
    public ataSubChapterCode: number;

}