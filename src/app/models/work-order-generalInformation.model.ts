import { WorkOrderPartNumber } from './work-order-partnumber.model';
import { CommonService } from '../services/common.service';


export class workOrderGeneralInfo {

  isSinglePN: boolean;
  // customerContactId: number;
  customerId: number;
  employeeId: number;
  workOrderTypeId: string;
  openDate: Date;
  creditTerm: string;
  creditTermsId: number;
  creditLimit: number;
  workOrderStatusId: number;
  salesPersonId: number;
  workOrderNum: string;
  isContractAvl: boolean;
  contract: string;
  workOrderNumber: string;
  customerReference: string;
  csr: string;
  workOrderType: string;
  managementStructureId: number;
  receivingCustomerWorkId: number;
  partNumbers: WorkOrderPartNumber[]

  // workOrderType: string;
  // workOrderDealerType: string;
  // workOrderNumber: string;
  // openDate: Date;
  // workOrderStatus: string;
  // customerId: number;
  // customerCodeId: number ;
  // customerReference: string;
  // isContract: boolean;
  // contract: string;
  // creditTerms: string;
  // creditTermsandLimitId: string;
  // employeeId: number;
  // salesPersonId: number;
  // csr: string;
  constructor() {


    this.isSinglePN = true;
    // this.customerContactId = null;
    this.customerId = null;
    this.employeeId = null;
    this.workOrderTypeId = "1";
    this.openDate = new Date();
    this.creditTermsId = null;
    this.creditTerm = '';
    this.creditLimit = null;
    this.workOrderStatusId = 1;
    this.salesPersonId = null;
    this.workOrderNum = '';
    this.isContractAvl = false;
    this.contract = '';
    this.workOrderNumber = '';
    this.customerReference = '';
    this.csr = '';
    this.workOrderType = '';
    this.managementStructureId = null;
    this.receivingCustomerWorkId = null;
    this.partNumbers = []

    // this.workOrderType = 'single';
    // this.workOrderDealerType = 'customer';
    // this.workOrderNumber = 'Creating';
    // this.openDate = new Date();
    // this.workOrderStatus = '';
    // this.customerId = null;
    // this.customerCodeId = null;
    // this.customerReference = '';
    // this.isContract = false;
    // this.contract = '';
    // this.creditTerms = '';
    // this.creditTermsandLimitId = '';
    // this.employeeId = null;
    // this.salesPersonId = null;
    // this.csr = '';
  }
}


