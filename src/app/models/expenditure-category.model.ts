

export class ExpenditureCategory {

    constructor(expenditureCategoryId?: number, description?: string, memo?: string, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, isDelete?: boolean) {

        this.expenditureCategoryId = expenditureCategoryId;
        this.description = description || "";
        this.memo = memo || "";
        this.createdBy = createdBy || "admin";
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.isActive = isActive;
        this.isDelete = isDelete;
    }

    expenditureCategoryId: number;
    description: string;
    memo: string;
    createdBy: string;
    updatedBy: string;
    createdDate: Date;
    updatedDate: Date;
    isDelete: boolean = false;
    isActive: boolean = false;
}

export class ExpenditureCategorySingleScreen extends ExpenditureCategory {

}
