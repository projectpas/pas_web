﻿
import { MasterCompany } from './mastercompany.model';

export class Condition {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, conditionId?: number, description?: string, masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, memo?: string) {

        this.conditionId = conditionId;
        this.description = description;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.masterCompany = masterCompany;
		this.isActive = isActive;
		this.memo = memo;
    }

    public conditionId: number;
    public description: string;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public masterCompany?: MasterCompany;
	public isActive: boolean;
	public memo: string;
}