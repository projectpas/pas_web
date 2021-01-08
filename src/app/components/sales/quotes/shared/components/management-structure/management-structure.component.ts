import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ISalesOrderQuoteApproverList } from "../../../../../../models/sales/ISalesOrderQuoteApproverList";
import { SalesOrderQuoteApproverList } from "../../../../../../models/sales/SalesOrderQuoteApproverList";
import { ISalesOrderQuote } from "../../../../../../models/sales/ISalesOrderQuote";
import { SalesQuoteService } from "../../../../../../services/salesquote.service";
import { EmployeeService } from "../../../../../../services/employee.service";
import { AuthService } from "../../../../../../services/auth.service";
import { ISalesQuote } from "../../../../../../models/sales/ISalesQuote.model";
import { CommonService } from "../../../../../../services/common.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { AlertService, MessageSeverity } from "../../../../../../services/alert.service";
import { getObjectById, getValueFromArrayOfObjectById } from "../../../../../../generic/autocomplete";

@Component({
  selector: "app-management-structure",
  templateUrl: "./management-structure.component.html",
  styleUrls: ["./management-structure.component.css"]
})
export class ManagementStructureComponent {
  salesOrderQuote: ISalesOrderQuote;
  @Input() salesQuote: ISalesQuote;
  @Input() managementStructureId: any;
  managementValidCheck: boolean;
  isEditMode = false;
  //@Output() onPartSearch: EventEmitter<any> = new EventEmitter<any>();
  legalEntityList: any;
  businessUnitList: any;
  enableHeaderSaveBtn: boolean = false;
  departmentList: any;
  divisionList: any;
  bulist: any[] = [];
  divisionlist: any[] = [];
  isSpinnerVisible: boolean = false;
  maincompanylist: any[] = [];
  arrayEmplsit: any[] = [];
  allEmployeeList: any = [];
  requisitionerList: any[];
  currentUserEmployeeName: string;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private commonservice: CommonService,
    private alertService: AlertService,
    private salesQuoteService: SalesQuoteService,
    private authService: AuthService,
    private commonService: CommonService
  ) { }
  ngOnInit(): void {
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  load(managementStructureId: number) {
    this.managementStructureId = managementStructureId;
    this.getManagementStructureDetails(managementStructureId, this.employeeId);
  }

  get employeeId() {
    return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
  }

  enableHeaderSave() {
    this.enableHeaderSaveBtn = true;
  }
  checkValidOnChange(condition, value) {
    if (condition != null && condition != 0 && value == "companyId") {
      this.managementValidCheck = false;
    }
  }
  getManagementStructureDetails(id, empployid = 0, editMSID = 0) {
    empployid = empployid == 0 ? this.employeeId : empployid;
    editMSID = this.isEditMode ? editMSID = id : 0;
    this.commonService.getManagmentStrctureData(id, empployid, editMSID).subscribe(response => {
      if (response) {
        const result = response;
        if (result[0] && result[0].level == 'Level1') {
          this.maincompanylist = result[0].lstManagmentStrcture;
          this.salesQuote.companyId = result[0].managementStructureId;
          this.salesQuote.managementStructureId = result[0].managementStructureId;
          this.salesQuote.buId = 0;
          this.salesQuote.divisionId = 0;
          this.salesQuote.departmentId = 0;
          this.bulist = [];
          this.divisionlist = [];
          this.departmentList = [];
        } else {
          this.salesQuote.companyId = 0;
          this.salesQuote.buId = 0;
          this.salesQuote.divisionId = 0;
          this.salesQuote.departmentId = 0;
          this.maincompanylist = [];
          this.bulist = [];
          this.divisionlist = [];
          this.departmentList = [];
        }

        if (result[1] && result[1].level == 'Level2') {
          this.bulist = result[1].lstManagmentStrcture;
          this.salesQuote.buId = result[1].managementStructureId;
          this.salesQuote.managementStructureId = result[1].managementStructureId;
          this.salesQuote.divisionId = 0;
          this.salesQuote.departmentId = 0;
          this.divisionlist = [];
          this.departmentList = [];
        } else {
          if (result[1] && result[1].level == 'NEXT') {
            this.bulist = result[1].lstManagmentStrcture;
          }
          this.salesQuote.buId = 0;
          this.salesQuote.divisionId = 0;
          this.salesQuote.departmentId = 0;
          this.divisionlist = [];
          this.departmentList = [];
        }

        if (result[2] && result[2].level == 'Level3') {
          this.divisionlist = result[2].lstManagmentStrcture;
          this.salesQuote.divisionId = result[2].managementStructureId;
          this.salesQuote.managementStructureId = result[2].managementStructureId;
          this.salesQuote.departmentId = 0;
          this.departmentList = [];
        } else {
          if (result[2] && result[2].level == 'NEXT') {
            this.divisionlist = result[2].lstManagmentStrcture;
          }
          this.salesQuote.divisionId = 0;
          this.salesQuote.departmentId = 0;
          this.departmentList = [];
        }

        if (result[3] && result[3].level == 'Level4') {
          this.departmentList = result[3].lstManagmentStrcture;;
          this.salesQuote.departmentId = result[3].managementStructureId;
          this.salesQuote.managementStructureId = result[3].managementStructureId;
        } else {
          this.salesQuote.departmentId = 0;
          if (result[3] && result[3].level == 'NEXT') {
            this.departmentList = result[3].lstManagmentStrcture;
          }
        }
        this.employeedata('', this.salesQuote.managementStructureId);
      }
    }, err => {
      this.isSpinnerVisible = false;
      const errorLog = err;
      this.errorMessageHandler(errorLog);
    });
  }

  employeedata(strText = '', manStructID = 0) {
    if (this.arrayEmplsit.length == 0) {
      this.arrayEmplsit.push(0);
    }
    this.arrayEmplsit.push(this.employeeId == null ? 0 : this.employeeId);
    this.commonService.autoCompleteDropdownsEmployeeByMS(strText, true, 20, this.arrayEmplsit.join(), manStructID).subscribe(res => {
      this.allEmployeeList = res;
      this.requisitionerList = res;
      this.currentUserEmployeeName = getValueFromArrayOfObjectById('label', 'value', this.employeeId, res);
      if (!this.isEditMode) {
        this.getRequisitionerOnLoad(this.employeeId);
      }
    }, err => {
      const errorLog = err;
      this.errorMessageHandler(errorLog);
    })
  }
  getRequisitionerOnLoad(id) {
    this.salesQuote['requisitionerId'] = getObjectById('value', id, this.allEmployeeList);
  }
  errorMessageHandler(log) {
    const errorLog = log;
    var msg = '';
    if (errorLog.message) {
      if (errorLog.error && errorLog.error.errors.length > 0) {
        for (let i = 0; i < errorLog.error.errors.length; i++) {
          msg = msg + errorLog.error.errors[i].message + '<br/>'
        }
      }
      this.alertService.showMessage(
        errorLog.error.message,
        msg,
        MessageSeverity.error
      );
    }
    else {
      this.alertService.showMessage(
        'Error',
        log.error,
        MessageSeverity.error
      );
    }
  }


  getManagementStructureForChildEdit(partChildList) {
    var editMSID = this.isEditMode ? partChildList.managementStructureId : 0;
    this.commonService.getManagmentStrctureData(partChildList.managementStructureId, this.employeeId, editMSID).subscribe(response => {
      if (response) {
        const result = response;
        if (result[0] && result[0].level == 'Level1') {
          partChildList.maincompanylist = result[0].lstManagmentStrcture;
          partChildList.childCompanyId = result[0].managementStructureId;
          partChildList.managementStructureId = result[0].managementStructureId;
          partChildList.childBulist = [];
          partChildList.childDivisionlist = [];
          partChildList.childDepartmentlist = [];
          partChildList.childbuId = 0;
          partChildList.childDivisionId = 0;
          partChildList.childDeptId = 0;

        } else {
          partChildList.maincompanylist = [];
          partChildList.childBulist = [];
          partChildList.childDivisionlist = [];
          partChildList.childDepartmentlist = [];
          partChildList.childCompanyId = 0;
          partChildList.childbuId = 0;
          partChildList.childDivisionId = 0;
          partChildList.childDeptId = 0;
        }

        if (result[1] && result[1].level == 'Level2') {
          partChildList.childBulist = result[1].lstManagmentStrcture;
          partChildList.managementStructureId = result[1].managementStructureId;
          partChildList.childbuId = result[1].managementStructureId;
          partChildList.childDivisionlist = [];
          partChildList.childDepartmentlist = [];
          partChildList.childDivisionId = 0;
          partChildList.childDeptId = 0;
        } else {
          if (result[1] && result[1].level == 'NEXT') {
            partChildList.childBulist = result[1].lstManagmentStrcture;
          }
          partChildList.childDivisionlist = [];
          partChildList.childDepartmentlist = [];
          partChildList.childbuId = 0;
          partChildList.childDivisionId = 0;
          partChildList.childDeptId = 0;
        }

        if (result[2] && result[2].level == 'Level3') {
          partChildList.childDivisionlist = result[2].lstManagmentStrcture;
          partChildList.childDivisionId = result[2].managementStructureId;
          partChildList.managementStructureId = result[2].managementStructureId;
          partChildList.childDeptId = 0;
          partChildList.childDepartmentlist = [];
        } else {
          if (result[2] && result[2].level == 'NEXT') {
            partChildList.childDivisionlist = result[2].lstManagmentStrcture;
          }
          partChildList.childDepartmentlist = [];
          partChildList.childDivisionId = 0;
          partChildList.childDeptId = 0;
        }

        if (result[3] && result[3].level == 'Level4') {
          partChildList.childDepartmentlist = result[3].lstManagmentStrcture;;
          partChildList.childDeptId = result[3].managementStructureId;
          partChildList.managementStructureId = result[3].managementStructureId;
        } else {
          if (result[3] && result[3].level == 'NEXT') {
            partChildList.childDepartmentlist = result[3].lstManagmentStrcture;
          }

          partChildList.childDeptId = 0;
        }

      }
    })
  }

  getBUList(legalEntityId) {
    this.salesQuote.buId = 0;
    this.salesQuote.divisionId = 0;
    this.salesQuote.departmentId = 0;
    this.bulist = [];
    this.divisionlist = [];
    this.departmentList = [];
    if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
      this.salesQuote.managementStructureId = legalEntityId;
      this.salesQuote.companyId = legalEntityId;
      this.commonService.getManagementStructurelevelWithEmployee(legalEntityId, this.employeeId).subscribe(res => {
        this.bulist = res;
      });
    }
    else {
      this.salesQuote.managementStructureId = 0;
      this.salesQuote.companyId = 0;
    }

  }

  getParentBUList(partList) {
    partList.parentBulist = [];
    partList.parentDivisionlist = [];
    partList.parentDepartmentlist = [];
    partList.parentbuId = 0;
    partList.parentDivisionId = 0;
    partList.parentDeptId = 0;
    if (partList.childList) {
      for (let j = 0; j < partList.childList.length; j++) {
        partList.childList[j].childCompanyId = partList.parentCompanyId;
        partList.childList[j].childBulist = [];
        partList.childList[j].childDivisionlist = [];
        partList.childList[j].childDepartmentlist = [];
        partList.childList[j].childbuId = 0;
        partList.childList[j].childDivisionId = 0;
        partList.childList[j].childDeptId = 0;
      }
    }

    if (partList.parentCompanyId != 0 && partList.parentCompanyId != null && partList.parentCompanyId != undefined) {
      partList.managementStructureId = partList.parentCompanyId;
      this.commonService.getManagementStructurelevelWithEmployee(partList.parentCompanyId, this.employeeId).subscribe(res => {
        partList.parentBulist = res;
        if (partList.childList) {
          for (let j = 0; j < partList.childList.length; j++) {
            partList.childList[j].childBulist = partList.parentBulist;
            partList.childList[j].childCompanyId = partList.parentCompanyId;
            partList.childList[j].managementStructureId = partList.parentCompanyId;
          }
        }

      });
    }
    else {
      partList.managementStructureId = 0;
      if (partList.childList) {
        for (let j = 0; j < partList.childList.length; j++) {
          partList.childList[j].managementStructureId = 0;
        }
      }
    }
  }

  getChildBUList(partChildList) {
    partChildList.childBulist = [];
    partChildList.childDivisionlist = [];
    partChildList.childDepartmentlist = [];
    partChildList.childbuId = 0;
    partChildList.childDivisionId = 0;
    partChildList.childDeptId = 0;
    if (partChildList.childCompanyId != 0 && partChildList.childCompanyId != null && partChildList.childCompanyId != undefined) {
      partChildList.managementStructureId = partChildList.childCompanyId;
      this.commonService.getManagementStructurelevelWithEmployee(partChildList.childCompanyId, this.employeeId).subscribe(res => {
        partChildList.childBulist = res;
      });
    }
    else {
      partChildList.managementStructureId = 0;
    }
  }

  getDivisionlist(buId) {
    this.divisionlist = [];
    this.departmentList = [];
    this.salesQuote.divisionId = 0;
    this.salesQuote.departmentId = 0;

    if (buId != 0 && buId != null && buId != undefined) {
      this.salesQuote.managementStructureId = buId;
      this.salesQuote.buId = buId;
      this.commonService.getManagementStructurelevelWithEmployee(buId, this.employeeId).subscribe(res => {
        this.divisionlist = res;
      });
      // for (let i = 0; i < this.partListData.length; i++) {
      // 	this.partListData[i].parentbuId = buId;
      // 	this.getParentDivisionlist(this.partListData[i]);
      // }		
    } else {
      this.salesQuote.managementStructureId = this.salesQuote.companyId;
    }

  }

  getParentDivisionlist(partList) {

    partList.parentDivisionlist = [];
    partList.parentDepartmentlist = [];
    partList.parentDivisionId = 0;
    partList.parentDeptId = 0;
    if (partList.childList) {
      for (let j = 0; j < partList.childList.length; j++) {
        partList.childList[j].childbuId = partList.parentbuId;
        partList.childList[j].childDivisionlist = [];
        partList.childList[j].childDepartmentlist = [];
        partList.childList[j].childDivisionId = 0;
        partList.childList[j].childDeptId = 0;
      }
    }
    if (partList.parentbuId != 0 && partList.parentbuId != null && partList.parentbuId != undefined) {
      partList.managementStructureId = partList.parentbuId;
      this.commonService.getManagementStructurelevelWithEmployee(partList.parentbuId, this.employeeId).subscribe(res => {
        partList.parentDivisionlist = res;
        if (partList.childList) {
          for (let j = 0; j < partList.childList.length; j++) {
            partList.childList[j].childDivisionlist = partList.parentDivisionlist;
            partList.childList[j].childbuId = partList.parentbuId;
            partList.childList[j].managementStructureId = partList.parentbuId;
          }
        }
      });
    }
    else {
      partList.managementStructureId = partList.parentCompanyId;
      if (partList.childList) {
        for (let j = 0; j < partList.childList.length; j++) {
          partList.childList[j].managementStructureId = partList.parentCompanyId;
        }
      }

    }
  }



  getChildDivisionlist(partChildList) {
    partChildList.childDivisionId = 0;
    partChildList.childDeptId = 0;
    partChildList.childDivisionlist = [];
    partChildList.childDepartmentlist = [];
    if (partChildList.childbuId != 0 && partChildList.childbuId != null && partChildList.childbuId != undefined) {
      partChildList.managementStructureId = partChildList.childbuId;
      this.commonService.getManagementStructurelevelWithEmployee(partChildList.childbuId, this.employeeId).subscribe(res => {
        partChildList.childDivisionlist = res;
      });
    }
    else {
      partChildList.managementStructureId = partChildList.childCompanyId;;
    }

  }

  getDepartmentlist(divisionId) {
    this.salesQuote.departmentId = 0;
    this.departmentList = [];
    if (divisionId != 0 && divisionId != null && divisionId != undefined) {
      this.salesQuote.divisionId = divisionId;
      this.salesQuote.managementStructureId = divisionId;
      this.commonService.getManagementStructurelevelWithEmployee(divisionId, this.employeeId).subscribe(res => {
        this.departmentList = res;
      });
      //    for (let i = 0; i < this.partListData.length; i++) {
      // 	this.partListData[i].divisionId = divisionId;
      // 	this.getParentDeptlist(this.partListData[i]);
      // 	}
    }
    else {
      this.salesQuote.managementStructureId = this.salesQuote.buId;
      this.salesQuote.divisionId = 0;
    }
  }
  getParentDeptlist(partList) {
    partList.parentDeptId = 0;
    partList.parentDepartmentlist = [];
    if (partList.childList) {
      for (let j = 0; j < partList.childList.length; j++) {
        partList.childList[j].childDivisionId = partList.parentDivisionId;
        partList.childList[j].childDepartmentlist = [];
        partList.childList[j].childDeptId = 0;
      }
    }

    if (partList.parentDivisionId != 0 && partList.parentDivisionId != null && partList.parentDivisionId != undefined) {
      partList.managementStructureId = partList.parentDivisionId;
      this.commonService.getManagementStructurelevelWithEmployee(partList.parentDivisionId, this.employeeId).subscribe(res => {
        partList.parentDepartmentlist = res;
        if (partList.childList) {
          for (let j = 0; j < partList.childList.length; j++) {
            partList.childList[j].childDepartmentlist = partList.parentDepartmentlist;
            partList.childList[j].childDivisionId = partList.parentDivisionId;
            partList.childList[j].managementStructureId = partList.parentDivisionId;
          }
        }
      });
    }
    else {
      partList.managementStructureId = partList.parentbuId;
      if (partList.childList) {
        for (let j = 0; j < partList.childList.length; j++) {
          partList.childList[j].managementStructureId = partList.parentbuId;
        }
      }
    }
  }
  getChildDeptlist(partChildList) {
    partChildList.childDepartmentlist = [];
    partChildList.childDeptId = 0;
    if (partChildList.childDivisionId != 0 && partChildList.childDivisionId != null && partChildList.childDivisionId != undefined) {
      partChildList.managementStructureId = partChildList.childDivisionId;
      this.commonService.getManagementStructurelevelWithEmployee(partChildList.childDivisionId, this.employeeId).subscribe(res => {
        partChildList.childDepartmentlist = res;
      });
    }
    else {
      partChildList.managementStructureId = partChildList.childbuId;
    }
  }

  getDepartmentId(departmentId) {
    if (departmentId != 0 && departmentId != null && departmentId != undefined) {
      this.salesQuote.managementStructureId = departmentId;
      this.salesQuote.departmentId = departmentId;
      //  for (let i = 0; i < this.partListData.length; i++) {
      // 	this.partListData[i].parentDeptId = departmentId;
      // 	this.getParentDeptId(this.partListData[i]);			
      // }
    }
    else {
      this.salesQuote.managementStructureId = this.salesQuote.divisionId;
      this.salesQuote.departmentId = 0;
    }
  }
  getParentDeptId(partList) {
    if (partList.parentDeptId != 0 && partList.parentDeptId != null && partList.parentDeptId != undefined) {
      partList.managementStructureId = partList.parentDeptId;
      if (partList.childList) {
        for (let j = 0; j < partList.childList.length; j++) {
          partList.childList[j].childDeptId = partList.parentDeptId;
          this.getChildDeptId(partList.childList[j]);
        }
      }
    }
    else {
      partList.managementStructureId = partList.parentDivisionId;
      if (partList.childList) {
        for (let j = 0; j < partList.childList.length; j++) {
          partList.childList[j].managementStructureId = partList.parentDivisionId;
          partList.childList[j].childDeptId = partList.parentDeptId;
        }
      }

    }

  }

  getChildDeptId(partChildList) {
    if (partChildList.childDeptId != 0 && partChildList.childDeptId != null && partChildList.childDeptId != undefined) {
      partChildList.managementStructureId = partChildList.childDeptId;
    }
    else {
      partChildList.managementStructureId = partChildList.childDivisionId;
    }
  }
}
