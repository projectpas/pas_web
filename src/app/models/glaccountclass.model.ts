import { MasterCompany } from './mastercompany.model';

export class GLAccountClass {
   // glaccountclassname: string;
   
  
	// Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(masterCompany?: MasterCompany, glAccountClassId?: number, glcid?: number, glAccountClassName?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, isDelete?: boolean, glAccountClassMemo?: string) {

        this.glAccountClassId = glAccountClassId;
        this.gLCID = glcid; 
        this.glAccountClassName = glAccountClassName;
        this.glAccountClassMemo = glAccountClassMemo;
		this.masterCompanyId = masterCompanyId;
		this.createdBy = createdBy;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
		this.updatedBy = updatedBy;
		this.isActive = isActive;
        this.isDelete = isDelete;		
	}

    public glAccountClassId: number;
    public gLCID: number;
    public glAccountClassName: string;
    public glAccountClassMemo: string;
    public masterCompanyId: number;
	public createdBy: string;
	public updatedBy: string;
	public createdDate: Date;
	public updatedDate: Date;
	public isActive: boolean;
    public isDelete: boolean;
	




}