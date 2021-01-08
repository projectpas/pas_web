import { MasterCompany } from './mastercompany.model';

export class CustomerClassification {
    CustomerClassificationId: any;
	constructor(masterCompany?: MasterCompany, customerClassificationId?: number, isActive?: boolean, description?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, memo?: string) {

        this.customerClassificationId = customerClassificationId;
        this.description = description;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.isActive = isActive;
		this.memo = memo;
    }

    public customerClassificationId: number;
    public description: string;
   
    public masterCompany: MasterCompany;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
	public isActive?: boolean;
	public memo: string;
}