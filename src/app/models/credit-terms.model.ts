import { MasterCompany } from './mastercompany.model';

export class CreditTerms {
	constructor(masterCompany?: MasterCompany, creditTermsId?: number, isActive?: boolean, isDelete?:boolean, name?: string, percentage?: number, days?: number, netDays?: number, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, memo?: string) {

        this.creditTermsId = creditTermsId;
        this.name = name;
        this.percentage = percentage;
        this.days = days;
        this.netDays = netDays;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.isActive = isActive;
        this.isDelete= isDelete;
		this.memo = memo;
    }

    public creditTermsId: number;
    public name: string;
    public percentage: number;
    public days: number;
    public netDays: number;
    public masterCompany: MasterCompany;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
  public isActive?: boolean;
  public isDelete?:boolean;
	public memo: string;
}