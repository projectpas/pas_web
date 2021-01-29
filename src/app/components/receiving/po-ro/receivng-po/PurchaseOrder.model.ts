import { Vendor } from "../../../../models/vendor.model";
import { AddressModel } from "../../../../models/address.model";
import { Dropdown } from "primeng/dropdown";

export class PurchaseOrder {
    purchaseOrderPartRecordId: number;
    purchaseOrderId: number;
    purchaseOrderNumber: string;
    referenceId: string;
    priorityId: number;
    requestedBy: string
    dateRequested: Date;
    approver: string
    dateApprovied: Date
    needByDate: Date;
    statusId: number;
    employeeId: string;
    vendorId: number;
    vendorContactId: number;
    shipToCompanyId: number;
    shipViaAccountId: number;
    terms: string;
    creditLimit: number;
    notes: string;
    siteId: number;
    locationId: number;
    issuedToAddressId: number;
    issuedToContactName: string;
    issuedToMemo: string;
    shipToAddressId: number;
    shipToContactName: string;
    shipToMemo: string;
    billToAddressId: number;
    billToContactName: string;
    billToMemo: string;
    masterCompanyId: number;

    shipToUserType: number;
    billToUserId: number;
    billToUserType: number;
    shipToUserName: string;
    billToUserName: string;
    deferredReceiver: boolean;
    resale: boolean;
    isActive: boolean;
    managementStructureId: number;
    openDate: string;
    
    dateApproved: string;

    purchaseOderPart: PurchaseOrderPart[];
    vendor: Vendor;
    stockLine: StockLine[];    
}

export class PartStockLineMapper {
    id: number;
    purchaseOrderPartRecordId: number;
    stockLineId: number;
}

export class PurchaseOrderPart {
    purchaseOrderPartRecordId: number;
    purchaseOrderId: number;
    itemMasterId: number;
    serialNumber: string;
    nonInventory: boolean;
    requisitionedBy: string;
    requisitionedDate: Date;
    approver: string;
    approvedDate: Date;
    needByDate: Date;
    manufacturer: string;
    status: string;
    trace: string;
    conditionCode: string;
    quantityActuallyReceived: number;
    quantityRejected: number;
    uomId: number;
    quantityOrdered: number;
    quantityBackOrdered: number;
    unitCost: number;
    discountPerUnit: number;
    discountCostPerUnit: number;
    extendedCost: number;
    transactionalCurrencyId: number;
    functionalCurrencyId: number;
    foreignExchangeRate: number;
    workOrderId: number;
    repairOrderId: number;
    salesOrderId: number;
    generalLedgerAccounId: number;
    memo: string;
    poPartSplitUserTypeId: number;
    poPartSplitUserId: number;
    poPartSplitUser:string;
    poPartSplitUserTypeName:string;
    poPartSplitAddress1: string;
    poPartSplitAddress2: string;
    poPartSplitAddress3: string;
    poPartSplitCity: string;
    poPartSplitState: string;
    poPartSplitPostalCodestring; string;
    poPartSplitCountry: string;
    poPartSplitAddressId: number;
    managementStructureId: number;
    createdBy: string;
    updatedBy: string;
    createdDate: Date;
    updatedDate: Date;
    isActive: boolean;
    isParent: boolean;
    parentId: number;
    itemMaster: any;
    visible: boolean;
    conditionId: number;
    shipViaId: number;
    shippingAccountInfo: string;

    public stocklineListObj: StockLineDraft[];
    public timeLifeList: TimeLifeDraft[];
    poPartSplitAddress: AddressModel;
    //poPartSplitAddress:string;
    // UI Properties
    // below properties does not play role on the server side and are being used to show the data on UI and should be limited to UI only.
    siteId: number;
    shelfId: number;
    binId: number;
    warehouseId: number;
    locationId: number;

    managementStructureName: string[];
    statusText: string;
    UOMText: string;
    isPMA: true;
    isOEM: true;
    isDER: true;
    userTypeName: string;
    userName: string;
    addressText: string;
    showStockLineGrid: boolean;
    showStockLineGridDraft: boolean;
    quantityToReceive: number;
    isSameDetailsForAllParts: boolean;
    isTimeLifeUpdateLater: boolean;
    hasChildren: boolean;
    eCCNAlreadyExist: boolean;
    itarNumberExist: boolean;
    detailsNotProvided: boolean;
    stockLineCount: number;

    currentSLIndex: number;
    currentTLIndex: number;
    currentSERIndex: number;
    currentSLIndexDraft: number;
    currentTLIndexDraft: number;
    currentSERIndexDraft: number;
    isDisabledTLboxes: boolean;
    toggleIcon: boolean;
    isEnabled: boolean;

    companyId: number;
    businessUnitId: number;
    divisionId: number;
    departmentId: number;

    companyText: string;
    businessUnitText: string;
    divisionText: string;
    departmentText: string;
    isDeleted: boolean;
    purchaseOrder: any;

    CompanyList: DropDownData[];
    BusinessUnitList: DropDownData[];
    DivisionList: DropDownData[];
    DepartmentList: DropDownData[];
    SiteList: DropDownData[];
    WareHouseList: DropDownData[];
    LocationList: DropDownData[];
    ShelfList: DropDownData[];
    BinList: DropDownData[];
    stockLine: StockLine[];
    timeLife: TimeLife[];
    stockLineDraft: StockLine[];
    timeLifeDraft: TimeLife[];
}

export class TimeLife {

    timeLifeCyclesId: number;
    purchaseOrderId: number;
    purchaseOrderPartRecordId: number;
    cyclesRemaining: string;
    cyclesSinceNew: string;
    cyclesSinceOVH: string;
    cyclesSinceInspection: string;
    cyclesSinceRepair: string;

    timeRemaining: string;
    timeSinceNew: string;
    timeSinceOVH: string;
    timeSinceInspection: string;
    timeSinceRepair: string;

    lastSinceNew: string;
    lastSinceOVH: string;
    lastSinceInspection: string;

    masterCompanyId: number;
    isActive: boolean;

    detailsNotProvided: boolean;
    stockLineId: number;
}

export class TimeLifeDraft {

    timeLifeDraftCyclesId: number;
    purchaseOrderId: number;
    purchaseOrderPartRecordId: number;
    cyclesRemainingHrs: number;
    cyclesRemainingMin: number;
    cyclesSinceNewHrs: number;
    cyclesSinceNewMin: number;
    cyclesSinceOVHHrs: number;
    cyclesSinceOVHMin: number;
    cyclesSinceInspectionHrs: number;
    cyclesSinceInspectionMin: number;
    cyclesSinceRepairHrs: number;
    cyclesSinceRepairMin: number;

    timeRemainingHrs: number;
    timeRemainingMin: number;
    timeSinceNewHrs: number;
    timeSinceNewMin: number;
    timeSinceOVHHrs: number;
    timeSinceOVHMin: number;
    timeSinceInspectionHrs: number;
    timeSinceInspectionMin: number;
    timeSinceRepairHrs: number;
    timeSinceRepairMin: number;

    lastSinceNewHrs: number;
    lastSinceNewMin: number;
    lastSinceOVHHrs: number;
    lastSinceOVHMin: number;
    lastSinceInspectionHrs: number;
    lastSinceInspectionMin: number;

    masterCompanyId: number;
    isActive: boolean;

    detailsNotProvided: boolean;
    stockLineId: number;
}

export class StockLine {
    stockLineId: number;
    partNumber: string;
    stockLineNumber: string;
    stocklineMatchKey: string;
    controlNumber: string;
    itemMasterId: number;
    quantity: number;
    quantityRejected: number;
    conditionId: number;
    serialNumber: string;
    shelfLife: boolean;
    shelfLifeExpirationDate: Date;
    siteId: number;
    shelfId: number;
    binId: number;
    warehouseId: number;
    locationId: number;
    obtainFrom: string;
    owner: string;
    traceableTo: string;
    manufacturerId: number;
    manufacturer: string;
    manufacturerLotNumber: string;
    manufacturingDate: Date;
    expirationDate: Date;
    manufacturingBatchNumber: string;
    manufacturingTrace: string;
    partCertificationNumber: string;
    certifiedBy: string;
    certifiedDate: Date;
    tagDate: Date;
    tagType: any;
    certifiedDueDate: Date;
    calibrationMemo: string;
    orderDate: Date;
    purchaseOrderId: number;
    purchaseOrderUnitCost: number;
    purchaseOrderExtendedCost: number;
    inventoryUnitCost: number;
    repairOrderId: number;
    repairOrderUnitCost: number;
    receivedDate: Date;
    receiverNumber: string;
    reconciliationNumber: string;
    unitSalesPrice: number;
    coreUnitCost: number;
    gLAccountId: number;
    glAccountId: number;
    assetId: number;
    isHazardousMaterial: boolean;
    isPMA: boolean;
    isDER: boolean;
    oEM: boolean;
    memo: string;
    managementStructureEntityId: number;
    managementStructureId: number;
    timeLifeCyclesId: number;
    site: string;
    shelf: string;
    bin: string;
    obtainFromType: number;
    ownerType: number;
    traceableToType: number;
    timeLife: boolean;
    timeLifeId: number;
    unitCostAdjustmentReasonTypeId: number;
    unitSalePriceAdjustmentReasonTypeId: number;
    masterCompanyId: number;
    companyId: number;
    businessUnitId: number;
    divisionId: number;
    departmentId: number;
    quantityToReceive: number;
    isSerialized: boolean;
    idNumber: number;
    aircraftTailNumber: string;
    shippingReference: string;
    shippingViaId: number;
    shippingAccount: string;
    engineSerialNumber: string;
    createdDate: Date;
    purchaseOrderPartRecordId: number;
    timeLifeDetailsNotProvided: boolean;
    isDeleted: boolean;

    //View Properties

    companyText: string;
    businessUnitText: string;
    divisionText: string;
    departmentText: string;
    siteText: string;
    wareHouseText: string;
    locationText: string;
    shelfText: string;
    binText: string;

    isEnabled: boolean;
    CompanyList: DropDownData[];
    BusinessUnitList: DropDownData[];
    DivisionList: DropDownData[];
    DepartmentList: DropDownData[];

    SiteList: DropDownData[];
    WareHouseList: DropDownData[];
    LocationList: DropDownData[];
    ShelfList: DropDownData[];
    BinList: DropDownData[];
    CustomerList: DropDownData[];
    VendorList: DropDownData[];
    visible: boolean;
    serialNumberNotProvided: boolean;
    isDisabledSNboxes: boolean;
    currentDate: Date;
    glAccountText: string;
    obtainFromObject: DropDownData;
    ownerObject: DropDownData;
    traceableToObject: DropDownData;
}

export class StockLineDraft {
    stockLineDraftId: number;
    partNumber: string;
    stockLineNumber: string;
    stocklineMatchKey: string;
    controlNumber: string;
    itemMasterId: number;
    quantity: number;
    quantityRejected: number;
    conditionId: number;
    serialNumber: string;
    shelfLife: boolean;
    shelfLifeExpirationDate: Date;
    siteId: number;
    shelfId: number;
    binId: number;
    warehouseId: number;
    locationId: number;
    obtainFrom: string;
    owner: string;
    traceableTo: string;
    manufacturerId: number;
    manufacturer: string;
    manufacturerLotNumber: string;
    manufacturingDate: Date;
    expirationDate: Date;
    manufacturingBatchNumber: string;
    manufacturingTrace: string;
    partCertificationNumber: string;
    certifiedBy: string;
    certifiedDate: Date;
    tagDate: Date;
    tagType: any;
    certifiedDueDate: Date;
    calibrationMemo: string;
    orderDate: Date;
    purchaseOrderId: number;
    purchaseOrderUnitCost: number;
    purchaseOrderExtendedCost: number;
    inventoryUnitCost: number;
    repairOrderId: number;
    repairOrderUnitCost: number;
    receivedDate: Date;
    receiverNumber: string;
    reconciliationNumber: string;
    unitSalesPrice: number;
    coreUnitCost: number;
    gLAccountId: number;
    glAccountId: number;
    assetId: number;
    isHazardousMaterial: boolean;
    isPMA: boolean;
    isDER: boolean;
    oEM: boolean;
    memo: string;
    managementStructureEntityId: number;
    managementStructureId: number;
    timeLifeCyclesId: number;
    site: string;
    shelf: string;
    bin: string;
    obtainFromType: number;
    ownerType: number;
    traceableToType: number;
    timeLife: boolean;
    timeLifeId: number;
    unitCostAdjustmentReasonTypeId: number;
    unitSalePriceAdjustmentReasonTypeId: number;
    masterCompanyId: number;
    companyId: number;
    businessUnitId: number;
    divisionId: number;
    departmentId: number;
    quantityToReceive: number;
    isSerialized: boolean;
    idNumber: number;
    aircraftTailNumber: string;
    shippingReference: string;
    shippingViaId: number;
    shippingAccount: string;
    engineSerialNumber: string;
    createdDate: Date;
    purchaseOrderPartRecordId: number;
    timeLifeDetailsNotProvided: boolean;
    isDeleted: boolean;

    //View Properties

    companyText: string;
    businessUnitText: string;
    divisionText: string;
    departmentText: string;
    siteText: string;
    wareHouseText: string;
    locationText: string;
    shelfText: string;
    binText: string;

    isEnabled: boolean;
    CompanyList: any[];
    BusinessUnitList: any[];
    DivisionList: any[];
    DepartmentList: any[];

    SiteList: DropDownData[];
    WareHouseList: DropDownData[];
    LocationList: DropDownData[];
    ShelfList: DropDownData[];
    BinList: DropDownData[];
    CustomerList: DropDownData[];
    VendorList: DropDownData[];
    visible: boolean;
    serialNumberNotProvided: boolean;
    isDisabledSNboxes: boolean;
    currentDate: Date;
    glAccountText: string;
    obtainFromObject: DropDownData;
    ownerObject: DropDownData;
    traceableToObject: DropDownData;
    createdBy: string;
    updatedBy: string;
}

export class ReceiveParts {
    itemMasterId: boolean;
    isSerialized: boolean;
    isSameDetailsForAllParts: boolean;
    purchaseOrderPartRecordId: number;
    stockLines: StockLineDraft[];
    timeLife: TimeLifeDraft[];
    quantityRejected: number;
    quantityActuallyReceived: number;
    managementStructureEntityId: any
}

export class DropDownData {
    contructor(key: string, value: string) {
        this.Key = key;
        this.Value = value;
    }

    Key: string;
    Value: string;
}

