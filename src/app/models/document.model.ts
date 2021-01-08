
import { MasterCompany } from './mastercompany.model';

export class DocumentModel {
    documentName: any;
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(masterCompany?: MasterCompany, isActive?:boolean, documentCode?:string, documentId?: number, description?: string,
        Customer?: boolean, ItemMaster?: boolean, PurchaseOrder?: boolean, RepairOrder?: boolean, SL?: boolean, 
        SalesOrder?: boolean, WorkOrder?: boolean, Vendor?: boolean, 
		masterCompanyId?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string
		, memo?: string) {

        this.documentId = documentId;
        this.documentCode = documentCode;
        this.isActive = isActive;
        this.description = description;
        this.Customer = Customer;
        this.itemmaster = ItemMaster;
        this.purchaseOrder = PurchaseOrder;
        this.RepairOrder = RepairOrder;
        this.SL = SL;
        this.SalesOrder = SalesOrder;
        this.WorkOrder = WorkOrder;
        this.Vendor = Vendor;
        this.masterCompanyId = masterCompanyId;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.masterCompany = masterCompany;
		this.memo = memo;

    }

    public documentId: number;
    public description: string;
    public documentCode: string;
    public Customer: boolean;
    public itemmaster: boolean;
    public purchaseOrder: boolean;
    public RepairOrder: boolean;
    public SL: boolean;
    public SalesOrder: boolean;
    public WorkOrder: boolean;
    public isActive: boolean;
    public Vendor: boolean;
    public masterCompanyId: number;
    public createdBy: string;
    public updatedBy: string;
    public createdDate: Date;
    public updatedDate: Date;
    public masterCompany?: MasterCompany;
	public memo: string;



}