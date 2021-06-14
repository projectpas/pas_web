import { Vendor } from "../../../../models/vendor.model";
import { AddressModel } from "../../../../models/address.model";
import { Dropdown } from "primeng/dropdown";

export class RepairOrder {
    repairOrderPartRecordId: number;
    repairOrderId: number;
    repairOrderNumber: string;
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
    billToUserType: number;
    shipToUserName: string;
    billToUserName: string;
    deferredReceiver: boolean;
    resale: boolean;
    isActive: boolean;
    managementStructureId: number;
    openDate: string;
    
    dateApproved: string;

    repairOderPart: RepairOrderPart[];
    vendor: Vendor;
    stockLine: StockLine[];
}

export class PartStockLineMapper {
    id: number;
    repairOrderPartRecordId: number;
    stockLineId: number;
}

export class RepairOrderPart {
    repairOrderPartRecordId: number;
    repairOrderId: number;
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
    salesOrderId: number;
    generalLedgerAccounId: number;
    memo: string;
    roPartSplitUserTypeId: number;
    roPartSplitUserId: number;
    roPartSplitUserTypeName:string;
    roPartSplitAddress1: string;
    roPartSplitAddress2: string;
    roPartSplitAddress3: string;
    roPartSplitCity: string;
    roPartSplitState: string;
    roPartSplitPostalCodestring; string;
    roPartSplitCountry: string;
    roPartSplitAddressId: number;
    managementStructureId: number;
    createdBy: string;
    updatedBy: string;
    createdDate: Date;
    updatedDate: Date;
    isActive: boolean;    
    isParent: boolean;
    parentId:number;
    itemMaster: any;
    visible: boolean;
    conditionId: number;
    condition: string;
    quantityRepaired: number;
    quantityToRepair: number;

    public stocklineListObj: StockLine[];
    public timeLifeList: TimeLife[];
    roPartSplitAddress: AddressModel;
    roPartSplitUserName:string;
    // UI Properties
    // below properties does not play role on the server side and are being used to show the data on UI and should be limited to UI only.
    siteId: number;
    shelfId: number;
    binId: number;
    warehouseId: number;
    locationId: number;
    glAccountId: number;
    glAccount: string;

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

    stockLineCount: number;

    currentSLIndex: number;
    currentTLIndex: number;
    currentSERIndex: number;
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
    detailsNotProvided: boolean;
    shipViaId: number;
    shippingAccountInfo: string;

    maincompanylist: [];    
    parentBulist: [];
    parentDivisionlist: [];
    parentDepartmentlist: [];
    parentCompanyId: number = 0;
    parentbuId: number = 0;
    parentDivisionId: number = 0;
    parentDeptId: number = 0;
    quantityDrafted: number = 0;
    showHeader:boolean;
    revisedPartId:number=0;
    acTailNum: string;
}

export class TimeLife {

    timeLifeCyclesId: number;
    repairOrderId: number;
    repairOrderPartRecordId: number;
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
    tagTypeId:any;
    tagTypeobject:any;
    certifiedDueDate: Date;
    calibrationMemo: string;
    orderDate: Date;
    repairOrderId: number;
    repairOrderUnitCost: number;
    repairOrderExtendedCost: number;
    inventoryUnitCost: number;
    //repairOrderId: number;
    //repairOrderUnitCost: number;
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
    repairOrderPartRecordId: number;
    timeLifeDetailsNotProvided: boolean;

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
    isDeleted: boolean;
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
    obtainFromName: string = null;
    ownerName: string = null;
    traceableToName: string = null;
    createdBy: string;
    updatedBy: string;

    maincompanylist: [];
    parentCompanyId: number = 0;
    parentBulist: [];
    parentDivisionlist: [];
    parentDepartmentlist: [];
    parentbuId: number = 0;
    parentDivisionId: number = 0;
    parentDeptId: number = 0;
    taggedByType : number = null;    //-----------------------------------------
    taggedBy:any = null;
    taggedByName: string = null;
    unitOfMeasureId:number = null;
    unitOfMeasure: string = null;
    revisedPartId:any = null;
    revisedPartNumber: string = null;
    revisedPartObject: DropDownData;
}

export class ReceiveParts {
    itemMasterId: boolean;
    isSerialized: boolean;
    isSameDetailsForAllParts: boolean;
    repairOrderPartRecordId: number;
    stockLines: StockLine[];
    timeLife: TimeLife[];
    managementStructureEntityId: any;
    quantityActuallyReceived: any;
    quantityRejected: number;
}

export class DropDownData {
    contructor(key: string, value: string) {
        this.Key = key;
        this.Value = value;
    }

    Key: string;
    Value: string;
}

