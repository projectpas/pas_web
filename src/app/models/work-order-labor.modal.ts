export class WorkOrderLabor {
  workOrderLaborHeaderId: number;
  workFlowWorkOrderId: any;
  dataEnteredBy: any;
  expertiseId: number;
  employeeId: any;
  isTaskCompletedByOne: boolean;
  workFloworSpecificTaskorWorkOrder: string;
  hoursorClockorScan: number;
  workOrderLaborList: any;
  totalWorkHours: any;
  costPlusType: any;
  laborFlatBillingAmount: any;
  employeeName:any;
  laborList:any=[]
  constructor() {
    this.workOrderLaborHeaderId = null;
    this.workFlowWorkOrderId = null;
    this.dataEnteredBy = null;
    this.expertiseId = null;
    this.employeeId = null;
    this.employeeId ="";
    this.isTaskCompletedByOne = false;
    this.workFloworSpecificTaskorWorkOrder = 'specificTasks';
    this.hoursorClockorScan = 1;
    this.costPlusType = null;
    this.laborFlatBillingAmount = null;
    this.laborList=[];
  }
}

export class AllTasks {
  workOrderLaborHeaderId: number;
  workOrderLaborId: number;
  expertiseId: number;
  employeeId: any;
  billableId: number;
  startDate: Date;
  startDateandTimeIsEdit: boolean;
  endDateandTimeIsEdit: boolean;
  endDate: Date;
  hours: number;
  adjustments: number;
  adjustedHours: number;
  memo: string;
  taskId: number;
  burdaenRatePercentageId:any=0;
  directLaborOHCost:any=0;


  constructor() {
    this.workOrderLaborHeaderId = 0;
    this.workOrderLaborId = 0;
    this.expertiseId = null;
    this.employeeId = null;
    this.billableId = 1;
    this.startDate = null;
    this.startDateandTimeIsEdit = false;
    this.endDate = null;
    this.endDateandTimeIsEdit = false;
    this.hours = 0;
    this.adjustments = 0;
    this.adjustedHours = 0;
    this.memo = '';
    this.taskId = 0;
    this.burdaenRatePercentageId=0;
this.directLaborOHCost='0.00';
  }
}

export class WorkOrderQuoteLabor {

  WorkOrderQuoteDetailsId: number;
  WorkOrderQuoteId: number;
  ItemMasterId: number;
  BuildMethodId: number;
  SelectedId: number;
  ReferenceNo: string;
  EstCompDate: any;
  StageId: number;
  StatusId: number;
  CMMId: any;
  IsPMA: boolean;
  IsDER: boolean;
  masterCompanyId: number;
  CreatedBy: any = "admin";
  UpdatedBy: any = "admin";
  IsActive: boolean = true;
  IsDeleted: boolean = false;
  WorkOrderQuoteLaborHeader:
    {
      WorkOrderQuoteLaborHeaderId: number;
      WorkOrderQuoteDetailsId: number;
      DataEnteredBy: number;
      HoursorClockorScan: number;
      IsTaskCompletedByOne: boolean;
      WorkOrderHoursType: number;
      LabourMemo: string;
      EmployeeId: number;
      ExpertiseId: number;
      TotalWorkHours: number;
      masterCompanyId: number;
      CreatedBy: string;
      UpdatedBy: string;
      IsActive: boolean;
      IsDeleted: boolean;
      WorkOrderQuoteLabor: any[]
    };

  constructor() {
    this.WorkOrderQuoteDetailsId = 0;
    this.WorkOrderQuoteId = 0;
    this.ItemMasterId = 0;
    this.BuildMethodId = 1;
    this.SelectedId = 0;
    this.ReferenceNo = "";
    this.EstCompDate = new Date()
    this.StageId = 0;
    this.StatusId = 0;
    this.CMMId = 0;
    this.IsPMA = true;
    this.IsDER = true;
    this.masterCompanyId = 0;
    this.CreatedBy = 'admin'
    this.UpdatedBy = 'admin'
    this.IsActive = true;
    this.IsDeleted = false;
    this.WorkOrderQuoteLaborHeader = {
      WorkOrderQuoteLaborHeaderId: 0,
      WorkOrderQuoteDetailsId: 0,
      DataEnteredBy: 0,
      HoursorClockorScan: 0,
      IsTaskCompletedByOne: true,
      WorkOrderHoursType: 0,
      LabourMemo: '',
      EmployeeId: 0,
      ExpertiseId: 0,
      TotalWorkHours: 0,
      masterCompanyId: 0,
      CreatedBy: 'admin',
      UpdatedBy: 'admin',
      IsActive: true,
      IsDeleted: false,
      WorkOrderQuoteLabor: []
    };
  }
}

export class ExclusionQuote {

  WorkOrderQuoteDetailsId: number;
  WorkOrderQuoteId: number;
  ItemMasterId: number;
  BuildMethodId: number;
  SelectedId: number;
  ReferenceNo: string;
  EstCompDate: string;
  StageId: number;
  StatusId: number;
  CMMId: number;
  IsPMA: boolean;
  IsDER: boolean;
  masterCompanyId: number;
  CreatedBy: string = 'admin';
  UpdatedBy: string = 'admin';
  IsActive: boolean = true;
  IsDeleted: boolean = false;
  WorkOrderQuoteExclusions: any[];

  constructor() {
    this.WorkOrderQuoteDetailsId = 0;
    this.WorkOrderQuoteId = 0;
    this.ItemMasterId = 0;
    this.BuildMethodId = 0
    this.SelectedId = 0;
    this.ReferenceNo = "";
    this.EstCompDate = "";
    this.StageId = 0;
    this.StatusId = 0;
    this.CMMId = 0;
    this.IsPMA = false;
    this.IsDER = false;
    this.masterCompanyId = 0;
    this.CreatedBy = 'admin';
    this.UpdatedBy = 'admin';
    this.IsActive = true;
    this.IsDeleted = true;
    this.WorkOrderQuoteExclusions = [];
  }
}

export class ChargesQuote {
  WorkOrderQuoteDetailsId: number;
  WorkOrderQuoteId: number;
  ItemMasterId: number;
  BuildMethodId: number;
  SelectedId: number;
  ReferenceNo: string;
  EstCompDate: string;
  StageId: number;
  StatusId: number;
  CMMId: number;
  IsPMA: boolean;
  IsDER: boolean;
  masterCompanyId: number;
  CreatedBy: string = 'admin';
  UpdatedBy: string = 'admin';
  IsActive: boolean = true;
  IsDeleted: boolean = false;
  WorkOrderQuoteCharges: any[];

  constructor() {
    this.WorkOrderQuoteDetailsId = 0;
    this.WorkOrderQuoteId = 0;
    this.ItemMasterId = 0;
    this.BuildMethodId = 0
    this.SelectedId = 0;
    this.ReferenceNo = "";
    this.EstCompDate = "";
    this.StageId = 0;
    this.StatusId = 0;
    this.CMMId = 0;
    this.IsPMA = false;
    this.IsDER = false;
    this.masterCompanyId = 0;
    this.CreatedBy = 'admin';
    this.UpdatedBy = 'admin';
    this.IsActive = true;
    this.IsDeleted = true;
    this.WorkOrderQuoteCharges = [];
  }
}

export class QuoteMaterialList {
  WorkOrderQuoteDetailsId: number;
  WorkOrderQuoteId: number;
  ItemMasterId: number;
  BuildMethodId: number;
  SelectedId: number;
  ReferenceNo: string;
  EstCompDate: string;
  StageId: number;
  StatusId: number;
  CMMId: number;
  IsPMA: boolean;
  IsDER: boolean;
  masterCompanyId: number;
  CreatedBy: string = "admin";
  UpdatedBy: string = "admin";
  IsActive: boolean = true;
  IsDeleted: boolean = false;
  WorkOrderQuoteMaterial: any[];

  constructor() {
    this.WorkOrderQuoteDetailsId = 0;
    this.WorkOrderQuoteId = 0;
    this.ItemMasterId = 0;
    this.BuildMethodId = 0
    this.SelectedId = 0;
    this.ReferenceNo = "";
    this.EstCompDate = "";
    this.StageId = 0;
    this.StatusId = 0;
    this.CMMId = 0;
    this.IsPMA = false;
    this.IsDER = false;
    this.masterCompanyId = 0;
    this.CreatedBy = 'admin';
    this.UpdatedBy = 'admin';
    this.IsActive = true;
    this.IsDeleted = true;
    this.WorkOrderQuoteMaterial = [];
  }
}

export class QuoteFreightList {
  WorkOrderQuoteDetailsId: number;
  WorkOrderQuoteId: number;
  ItemMasterId: number;
  BuildMethodId: number;
  SelectedId: number;
  ReferenceNo: string;
  EstCompDate: string;
  StageId: number;
  StatusId: number;
  CMMId: number;
  IsPMA: boolean;
  IsDER: boolean;
  masterCompanyId: number;
  CreatedBy: string = "admin";
  UpdatedBy: string = "admin";
  IsActive: boolean = true;
  IsDeleted: boolean = false;
  WorkOrderQuoteFreight: any[];

  constructor() {
    this.WorkOrderQuoteDetailsId = 0;
    this.WorkOrderQuoteId = 0;
    this.ItemMasterId = 0;
    this.BuildMethodId = 0
    this.SelectedId = 0;
    this.ReferenceNo = "";
    this.EstCompDate = "";
    this.StageId = 0;
    this.StatusId = 0;
    this.CMMId = 0;
    this.IsPMA = false;
    this.IsDER = false;
    this.masterCompanyId = 0;
    this.CreatedBy = 'admin';
    this.UpdatedBy = 'admin';
    this.IsActive = true;
    this.IsDeleted = true;
    this.WorkOrderQuoteFreight = [];
  }
}



// [
//       {
//         "WorkOrderQuoteMaterialId":0,
//         "WorkOrderQuoteDetailsId":0,
//         "ItemMasterId":630,
//         "ConditionCodeId":1,
//         "MandatoryOrSupplemental":"Mandatory",
//         "ItemClassificationId":1,
//         "Quantity":10,
//         "UnitOfMeasureId":1,
//         "UnitCost":102,
//         "ExtendedCost":103,
//         "Price":125,
//         "ExtendedPrice":10,
//         "Memo":"Memo",
//         "IsDefered":false,
//         "MatMarkup":1,
//         "TotalPartsCost":155,
//         "Markup":2,
//         "CostPlusAmount":145,
//         "FixedAmount":147,
//         "masterCompanyId":1,
//     "CreatedBy":"admin",
//     "UpdatedBy":"admin",
//     "CreatedDate":"2019-10-31T09:06:59.68",
//     "UpdatedDate":"2019-10-31T09:06:59.68",
//     "IsActive":true,
//     "IsDeleted":false
//       }
//       ]	
