import { MasterCompany } from './mastercompany.model';
export class Currency {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, currencyId?: number, code?: string, symbol?: string, displayName?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, memo?: string) {

        this.currencyId = currencyId;
        this.code = code;
        this.symbol = symbol;
        this.displayName = displayName;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
		this.isActive = isActive;
		this.memo = memo;
    }

    public currencyId: number;
    public code: string;
    public symbol: string;
    public displayName: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public masterCompany: MasterCompany;
	public isActive: boolean;
	public memo: string;
}