
import { MasterCompany } from './mastercompany.model';

export class AuditHistory {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
	constructor(masterCompany?: MasterCompany, auditHistoryId?: number, tableRecordId?: number, columnName?: string, previousValue?: string, newValue?: string, masterCompanyId?: number, updatedDate?: Date, updatedBy?: string) {

        this.auditHistoryId = auditHistoryId;
        this.tableRecordId = tableRecordId;
        this.columnName = columnName;
        this.previousValue = previousValue;
        this.newValue = newValue;

        this.masterCompanyId = masterCompanyId;
     
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.masterCompany = masterCompany;

    }

    public auditHistoryId: number;
    public tableRecordId: number;
    public columnName: string;
    public previousValue: string;
    public newValue: string;
    public masterCompanyId: number;
   
    public updatedBy: string;
 
    public updatedDate: Date;
    public masterCompany?: MasterCompany;



}