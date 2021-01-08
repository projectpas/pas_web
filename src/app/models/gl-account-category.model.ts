

export class GLAccountCategory {

    constructor(glAccountCategoryId?: number, glAccountCategoryName?: string, glcid?: number, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, isDelete?: boolean) {

        this.glAccountCategoryId = glAccountCategoryId;
        this.glAccountCategoryName = glAccountCategoryName || "";
        this.glcid = glcid || 0;
        this.createdBy = createdBy || "admin";
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.isActive = isActive;
        this.isDelete = isDelete;
    }

    glAccountCategoryId: number;
    glAccountCategoryName: string;
    glcid: number;
    createdBy: string;
    updatedBy: string;
    createdDate: Date;
    updatedDate: Date;
    isDelete: boolean = false;
    isActive: boolean = false;
}

export class GLAccountCategorySingleScreen extends GLAccountCategory {

}
