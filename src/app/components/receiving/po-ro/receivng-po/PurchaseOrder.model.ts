import { ManagementStructure } from './../../../../models/managementstructure.model';
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
    unitOfMeasure:string;
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
    poPartSplitUser: string;
    poPartSplitUserTypeName: string;
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
    condition: string;
    glAccountId: number;
    glAccount: string;
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
    draftedStockLineCount: number = 0;

    currentSLIndex: number;
    currentTLIndex: number;
    currentSERIndex: number;
    currentSLIndexDraft: number;
    currentTLIndexDraft: number;
    currentSERIndexDraft: number;
    isDisabledTLboxes: boolean;
    toggleIcon: boolean;
    isEnabled: boolean;
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
    companyId: number = 0;
    businessUnitId: number = 0;
    divisionId: number = 0;
    departmentId: number = 0;

    maincompanylist: [];
    parentBulist: [];
    parentDivisionlist: [];
    parentDepartmentlist: [];
    parentCompanyId: number = 0;
    parentbuId: number = 0;
    parentDivisionId: number = 0;
    parentDeptId: number = 0;


    SiteList: DropDownData[];
    WareHouseList: DropDownData[];
    LocationList: DropDownData[];
    ShelfList: DropDownData[];
    BinList: DropDownData[];
    stockLine: StockLine[];
    timeLife: TimeLife[];
    stockLineDraft: StockLine[];
    timeLifeDraft: TimeLife[];
    showHeader: boolean;
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

    timeLifeDraftCyclesId: number = 0;
    cyclesRemaining: string = null;
    cyclesSinceNew: string = null;
    cyclesSinceOVH: string = null;
    cyclesSinceInspection: string = null;
    cyclesSinceRepair: string = null;
    timeRemaining: string = null;
    timeSinceNew: string = null;
    timeSinceOVH: string = null;
    timeSinceInspection: string = null;
    timeSinceRepair: string = null;
    lastSinceNew: string = null;
    lastSinceOVH: string = null;
    lastSinceInspection: string = null;
    masterCompanyId: number = 0;
    isActive: boolean;
    StockLineDraftId: number = 0;
    detailsNotProvided: boolean = false;
    purchaseOrderId: number = null;
    purchaseOrderPartRecordId: number = null;
    RepairOrderId: number = null;
    RepairOrderPartRecordId: number = null;


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
    stockLineId: number;

    // timeLifeDraftCyclesId: number;
    // purchaseOrderId: number;
    // purchaseOrderPartRecordId: number;
    // cyclesRemainingHrs: number;
    // cyclesRemainingMin: number;
    // cyclesSinceNewHrs: number;
    // cyclesSinceNewMin: number;
    // cyclesSinceOVHHrs: number;
    // cyclesSinceOVHMin: number;
    // cyclesSinceInspectionHrs: number;
    // cyclesSinceInspectionMin: number;
    // cyclesSinceRepairHrs: number;
    // cyclesSinceRepairMin: number;

    // timeRemainingHrs: number;
    // timeRemainingMin: number;
    // timeSinceNewHrs: number;
    // timeSinceNewMin: number;
    // timeSinceOVHHrs: number;
    // timeSinceOVHMin: number;
    // timeSinceInspectionHrs: number;
    // timeSinceInspectionMin: number;
    // timeSinceRepairHrs: number;
    // timeSinceRepairMin: number;

    // lastSinceNewHrs: number;
    // lastSinceNewMin: number;
    // lastSinceOVHHrs: number;
    // lastSinceOVHMin: number;
    // lastSinceInspectionHrs: number;
    // lastSinceInspectionMin: number;

    // masterCompanyId: number;
    // isActive: boolean;

    // detailsNotProvided: boolean;
    // stockLineId: number;
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
    taggedBy:any;
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
    taggedByObject: DropDownData;
}

// export class StockLineDraft {
//     stockLineDraftId: number;
//     partNumber: string;
//     stockLineNumber: string;
//     stocklineMatchKey: string;
//     controlNumber: string;
//     itemMasterId: number;
//     quantity: number;
//     quantityRejected: number;
//     conditionId: number;
//     serialNumber: string;
//     shelfLife: boolean;
//     shelfLifeExpirationDate: Date;
//     siteId: number;
//     shelfId: number;
//     binId: number;
//     warehouseId: number;
//     locationId: number;
//     obtainFrom: string;
//     owner: string;
//     traceableTo: string;
//     manufacturerId: number;
//     manufacturer: string;
//     manufacturerLotNumber: string;
//     manufacturingDate: Date;
//     expirationDate: Date;
//     manufacturingBatchNumber: string;
//     manufacturingTrace: string;
//     partCertificationNumber: string;
//     certifiedBy: string;
//     certifiedDate: Date;
//     tagDate: Date;
//     tagType: any;
//     certifiedDueDate: Date;
//     calibrationMemo: string;
//     orderDate: Date;
//     purchaseOrderId: number;
//     purchaseOrderUnitCost: number;
//     purchaseOrderExtendedCost: number;
//     inventoryUnitCost: number;
//     repairOrderId: number;
//     repairOrderUnitCost: number;
//     receivedDate: Date;
//     receiverNumber: string;
//     reconciliationNumber: string;
//     unitSalesPrice: number;
//     coreUnitCost: number;
//     gLAccountId: number;
//     glAccountId: number;
//     assetId: number;
//     isHazardousMaterial: boolean;
//     isPMA: boolean;
//     isDER: boolean;
//     oEM: boolean;
//     memo: string;
//     managementStructureEntityId: number;
//     managementStructureId: number;
//     timeLifeCyclesId: number;
//     site: string;
//     shelf: string;
//     bin: string;
//     obtainFromType: number;
//     ownerType: number;
//     traceableToType: number;
//     timeLife: boolean;
//     timeLifeId: number;
//     unitCostAdjustmentReasonTypeId: number;
//     unitSalePriceAdjustmentReasonTypeId: number;
//     masterCompanyId: number;
//     companyId: number;
//     businessUnitId: number;
//     divisionId: number;
//     departmentId: number;
//     quantityToReceive: number;
//     isSerialized: boolean;
//     idNumber: number;
//     aircraftTailNumber: string;
//     shippingReference: string;
//     shippingViaId: number;
//     shippingAccount: string;
//     engineSerialNumber: string;
//     createdDate: Date;
//     purchaseOrderPartRecordId: number;
//     timeLifeDetailsNotProvided: boolean;
//     isDeleted: boolean;

//     //View Properties

//     companyText: string;
//     businessUnitText: string;
//     divisionText: string;
//     departmentText: string;
//     siteText: string;
//     wareHouseText: string;
//     locationText: string;
//     shelfText: string;
//     binText: string;

//     isEnabled: boolean;
//     CompanyList: any[];
//     BusinessUnitList: any[];
//     DivisionList: any[];
//     DepartmentList: any[];

//     SiteList: DropDownData[];
//     WareHouseList: DropDownData[];
//     LocationList: DropDownData[];
//     ShelfList: DropDownData[];
//     BinList: DropDownData[];
//     CustomerList: DropDownData[];
//     VendorList: DropDownData[];
//     visible: boolean;
//     serialNumberNotProvided: boolean;
//     isDisabledSNboxes: boolean;
//     currentDate: Date;
//     glAccountText: string;
//     obtainFromObject: DropDownData;
//     ownerObject: DropDownData;
//     traceableToObject: DropDownData;
//     createdBy: string;
//     updatedBy: string;

//     maincompanylist: [];
//     parentCompanyId: number = 0;
//     parentBulist: [];
//     parentDivisionlist: [];
//     parentDepartmentlist: [];
//     parentbuId: number = 0;
//     parentDivisionId: number = 0;
//     parentDeptId: number = 0;
// }

export class StockLineDraft {
    stockLineDraftId: number = 0;
    partNumber: string = null;
    stockLineNumber: string = null;
    stocklineMatchKey: string = null;
    controlNumber: string = null;
    itemMasterId: number = null;
    quantity: number = 0;
    blackListed: boolean = false;
    blackListedReason: string = null;
    incident: boolean = false;
    incidentReason: string = null;
    accident: boolean = false;
    accidentReason: string = null;
    quantityOnOrder: number = null;
    quantityAvailable: number = null;
    quantityOnHand: number = null;
    quantityIssued: number = null;
    quantityTurnIn: number = null;
    quantityReserved: number = null;
    workOrderMaterialsId: number = null;
    workOrderId: number = null;
    conditionId: number = null;
    serialNumber: string = null;
    shelfLife: boolean = null;
    shelfLifeExpirationDate: Date = null;
    warehouseId: number = null;
    locationId: number = null;
    obtainFrom: number = null;
    owner: number = null;
    traceableTo: number = null;
    manufacturerId: number = null;
    manufacturer: string = null;
    manufacturerLotNumber: string = null;
    manufacturingDate: Date = null;
    manufacturingBatchNumber: string = null;
    partCertificationNumber: string = null;
    certifiedBy: string = null;
    certifiedDate: Date = null;
    tagDate: Date = null;
    tagType: any = null;
    certifiedDueDate: Date = null;
    calibrationMemo: string = null;
    orderDate: Date = null;
    purchaseOrderId: number = null;
    purchaseOrderUnitCost: number = null;
    inventoryUnitCost: number = null;
    repairOrderId: number = 0;
    repairOrderUnitCost: number = null;
    repairOrderExtendedCost: number = null;
    receivedDate: Date = null;
    receiverNumber: string = null;
    reconciliationNumber: string = null;
    unitSalesPrice: number = null;
    coreUnitCost: number = null;
    gLAccountId: number = null;
    assetId: number = null;
    isHazardousMaterial: boolean = null;
    isPMA: boolean = null;
    isDER: boolean = null;
    oEM: boolean = null;
    memo: string = null;
    managementStructureEntityId: number = null;
    legalEntityId: number = null;
    masterCompanyId: number = null;
    isSerialized: boolean = null;
    shelfId: number = null;
    binId: number = null;
    siteId: number = null;
    obtainFromType: number = null;
    ownerType: number = null;
    traceableToType: number = null;
    unitCostAdjustmentReasonTypeId: number = null;
    unitSalePriceAdjustmentReasonTypeId: number = null;
    idNumber: string = null;
    quantityToReceive: number = 0;
    expirationDate: Date = null;
    manufacturingTrace: string = null;
    purchaseOrderExtendedCost: number = 0;
    aircraftTailNumber: string = null;
    shippingViaId: number = null;
    engineSerialNumber: string = null;
    quantityRejected: number = 0;
    purchaseOrderPartRecordId: number = null;
    shippingAccount: string = null;
    shippingReference: string = null;
    timeLifeCyclesId: number = null;
    timeLifeDetailsNotProvided: boolean = false;
    repairOrderPartRecordId: number = null;
    isActive: boolean = false;
    isDeleted: boolean = false;
    workOrderExtendedCost: number = 0;
    nHAItemMasterId: number = null;
    tLAItemMasterId: number = null;
    isParent: boolean = null;
    parentId: number = null;
    isSameDetailsForAllParts: boolean = null;

    managementStructureId: number = null;
    site: string = null;
    shelf: string = null;
    bin: string = null;
    timeLife: boolean = null;
    timeLifeId: number = null;
    companyId: number = null;
    businessUnitId: number = null;
    divisionId: number = null;
    departmentId: number = null;
    createdDate: Date = new Date();
    updatedDate: Date = new Date();

    //View Properties

    companyText: string = null;
    businessUnitText: string = null;
    divisionText: string = null;
    departmentText: string = null;
    siteText: string = null;
    wareHouseText: string = null;
    locationText: string = null;
    shelfText: string = null;
    binText: string = null;

    isEnabled: boolean = null;
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
    visible: boolean = null;
    serialNumberNotProvided: boolean = null;
    isDisabledSNboxes: boolean = null;
    currentDate: Date = null;
    glAccountText: string = null;
    obtainFromObject: DropDownData = null;
    ownerObject: DropDownData = null;
    traceableToObject: DropDownData = null;
    createdBy: string = null;
    updatedBy: string = null;

    maincompanylist: [];
    parentCompanyId: number = 0;
    parentBulist: [];
    parentDivisionlist: [];
    parentDepartmentlist: [];
    parentbuId: number = 0;
    parentDivisionId: number = 0;
    parentDeptId: number = 0;
    level1: string = null;
    level2: string = null;
    level3: string = null;
    level4: string = null;
    Condition: string = null;
    Warehouse: string = null;
    Location: string = null;
    obtainFromName: string = null;
    ownerName: string = null;
    traceableToName: string = null;
    GLAccount: string = null;
    AssetName: string = null;
    LegalEntityName: string = null;
    ShelfName: string = null;
    BinName: string = null;
    SiteName: string = null;
    ObtainFromTypeName: string = null;
    OwnerTypeName: string = null;
    TraceableToTypeName: string = null;
    UnitCostAdjustmentReasonType: string = null;
    UnitSalePriceAdjustmentReasonType: string = null;
    ShippingVia: string = null;
    WorkOrder: string = null;
    WorkOrderMaterialsName: string = null;
    tagTypeId: any = null;
    taggedBy:number = null;
    taggedByName: string = null;
    unitOfMeasureId:number = null;
    unitOfMeasure: string = null;
}

export class ReceiveParts {
    itemMasterId: boolean;
    isSerialized: boolean;
    isSameDetailsForAllParts: boolean;
    purchaseOrderPartRecordId: number;
    repairOrderPartRecordId: number = 0;
    altEquiPartNumberId: number = 0;
    mappingType: number = 0;
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

