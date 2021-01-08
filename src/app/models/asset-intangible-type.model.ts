

export class AssetIntangibleType {

    constructor(assetIntangibleTypeId?: number, assetIntangibleName?: string, assetIntangibleMemo?: string, createdBy?: string, createdDate?: Date, updatedDate?: Date, updatedBy?: string, isActive?: boolean, isDelete?: boolean) {

        this.assetIntangibleTypeId = assetIntangibleTypeId;
        this.assetIntangibleName = assetIntangibleName || "";
        this.assetIntangibleMemo = assetIntangibleMemo || "";
        this.createdBy = createdBy || "admin";
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.updatedBy = updatedBy;
        this.isActive = isActive;
        this.isDelete = isDelete;
    }

    assetIntangibleTypeId: number;
    assetIntangibleName: string;
    assetIntangibleMemo: string;
    createdBy: string;
    updatedBy: string;
    createdDate: Date;
    updatedDate: Date;
    isDelete: boolean;
    isActive: boolean = false;
}

export class AssetIntangibleTypeSingleScreen extends AssetIntangibleType {

}
