import { MasterCompany } from './mastercompany.model';

export class GlCashFlowClassification {



	// Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, GlCashFlowClassificationId?: number, GLCID?: number, GLClassFlowClassificationName?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean) {

		this.GlCashFlowClassificationId = GlCashFlowClassificationId;
		
		this.GLCID = GLCID;
		this.GLClassFlowClassificationName = GLClassFlowClassificationName,
		this.masterCompanyId = masterCompanyId;
		this.createdBy = createdBy;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
		this.updatedBy = updatedBy;
		this.masterCompany = masterCompany;
		this.isActive = isActive;
		

	}

	public GlCashFlowClassificationId: number;
	public GLCID: number;
	public GLClassFlowClassificationName: string;
	public masterCompanyId: number;
	public createdBy: string;
	public updatedBy: string;
	public createdDate: Date;
	public updatedDate: Date;
	public masterCompany?: MasterCompany;
	public isActive: boolean;
	




}