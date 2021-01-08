

export class AssetAttributeType {

    constructor(assetAttributeTypeId?: number, assetTypeId?: number, description?: string, assetAttributeTypeName?: string,
        conventionType?: number, depreciationMethod?: number, residualPercentage?: number, residualValue?: number, assetLife?: number, depreciationFrequencyId?: number, acquiredGLAccountId?: number, deprExpenseGLAccountId?: number, adDepsGLAccountId?: number, assetSale?: number, assetWriteOff?: number, assetWriteDown?: number, managementStructureId?: number, selectedCompanyIds?: string,
        createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, isDelete?: boolean) {

        this.assetAttributeTypeId = assetAttributeTypeId;
        this.assetTypeId = assetTypeId;
        this.description = description || "";
        this.assetAttributeTypeName = assetAttributeTypeName || "";
        this.conventionType = conventionType;
        this.depreciationMethod = depreciationMethod || 0;
        this.residualPercentage = residualPercentage;
        this.residualValue = residualValue || 0;
        this.assetLife = assetLife || 0;
        this.depreciationFrequencyId = depreciationFrequencyId;
        this.acquiredGLAccountId = acquiredGLAccountId || 0;
        this.deprExpenseGLAccountId = deprExpenseGLAccountId || 0;
        this.adDepsGLAccountId = adDepsGLAccountId || 0;
        this.assetSale = assetSale || 0;
        this.assetWriteOff = assetWriteOff || 0;
        this.assetWriteDown = assetWriteDown || 0;
        this.managementStructureId = managementStructureId || 0;
        this.selectedCompanyIds = selectedCompanyIds || "";
        this.createdBy = createdBy || "admin";
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.isActive = isActive;
        this.isDelete = isDelete;
    }

    assetAttributeTypeId: number;
    assetTypeId: number;
    description: string;
    assetAttributeTypeName: string;
    conventionType: number;
    depreciationMethod: number;
    residualPercentage: number;
    residualValue: number;
    assetLife: number;
    depreciationFrequencyId: number;
    acquiredGLAccountId: number;
    deprExpenseGLAccountId: number;
    adDepsGLAccountId: number;
    assetSale: number;
    assetWriteOff: number;
    assetWriteDown: number;
    managementStructureId: number;
    selectedCompanyIds: string;
    createdBy: string;
    updatedBy: string;
    createdDate: Date;
    updatedDate: Date;
    isDelete: boolean = false;
    isActive: boolean = false;
}

export class AssetAttributeTypeSingleScreen extends AssetAttributeType {

}
