import { MasterCompany } from './mastercompany.model';
export class UnitOfMeasure {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, unitOfMeasureId?: number, description?: string, shortName?: string, standard?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean,isDelete?: boolean, memo?: string) {

        this.unitOfMeasureId = unitOfMeasureId;
        this.description = description;
        this.shortName = shortName;
        this.standard = standard;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.isActive = isActive;
        this.isDelete = isDelete;
		this.memo = memo;
    }

    public unitOfMeasureId: number;
    public description: string;
    public shortName: string;
    public standard: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public masterCompany: MasterCompany;
    public isActive: boolean;
    public isDelete: boolean;
	public memo: string;
}