export interface ShippingVia {
    shippingViaId: number;
    name: string;
    memo: string;
    masterCompanyId: number;
    createdBy: string;
    updatedBy: string;
    createdDate: Date;
    updatedDate: Date;
    isDeleted: boolean;
    isActive: boolean;
}