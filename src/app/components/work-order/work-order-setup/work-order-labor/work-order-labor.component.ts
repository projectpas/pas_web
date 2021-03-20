import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { WorkOrderLabor, AllTasks } from '../../../../models/work-order-labor.modal';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { CommonService } from '../../../../services/common.service';
import { getValueFromObjectByKey, getObjectById, isEmptyObject, formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { AuthService } from '../../../../services/auth.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditComponentComponent } from '../../../../shared/components/audit-component/audit-component.component';
declare var $: any;
@Component({
  selector: 'app-work-order-labor',
  templateUrl: './work-order-labor.component.html',
  styleUrls: ['./work-order-labor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkOrderLaborComponent implements OnInit, OnChanges { 
  @Input() savedWorkOrderData;
  @Input() laborForm: WorkOrderLabor; 
  @Input() workOrderWorkFlowOriginalData: any;
  @Output() saveworkOrderLabor = new EventEmitter();
  @Output() refreshLabor = new EventEmitter(); 
  @Input() workOrderLaborList: any={};
  @Input() taskList: any;
  @Input() isQuote = false;
  @Input() markupList;
  @Input() employeesOriginalData;
  @Input() isView: boolean = false;
  @Input() isEdit: boolean = false;
  @Input() workFlowId: any = 0;
  @Input() buildMethodDetails: any = {};
  @Input() selectedPartNumber: any = {};
  @Input() workFlowData: any = {};
  @Input() subWorkOrderDetails: any;
  @Input() subWOPartNoId: any;
  @Input() isSubWorkOrder: boolean = false;
  @Input() frombilling: any = false;
  @Input() hideHeader: boolean = false;
  totalHours: number;
  disableSaveForEdit:boolean=false; 
  workOrderWorkFlowList: any;
  employeeList: any;
  dataEnteredByList: any;
  expertiseTypeList: Object;
  id: any;
  toggle_po_header: boolean = true;
  saveFormdata: any;
  totalWorkHours: any;
  minDateValue: Date = new Date()
  billableList = [
    { label: 'Billable', value: 1 },
    { label: 'Non-Billable', value: 2 }
  ];
  overAllMarkup: any;
  dropdownSettings = {};
  selectedItems: any = [];
  taskListForHeader: any[];
  type: string = "";
  currentItem: any;
  allEmployees: any[];
  basicLabourDetail: any;
  defaultBurdenRate: any = 0;
  deletingLabourObj: any;
  taskIndexToggle: any;
  labourHeader: any;
  disabledUpdatebtn:boolean=true; 
  modal: NgbModalRef;
  constructor(private workOrderService: WorkOrderService,
    private authService: AuthService,private modalService: NgbModal,
    private commonService: CommonService) { }
 
  ngOnInit() {
    this.disabledUpdatebtn=true;
    this.allEmployees = this.employeesOriginalData;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'taskId',
      textField: 'description',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: false
    };
    if (this.taskList) {
      this.taskListForHeader = this.taskList.map(x => { return { taskId: x.taskId, description: x.description } })
    }
    this.workOrderWorkFlowList = this.workOrderWorkFlowOriginalData;
    this.laborForm.costPlusType = 'Mark Up';
    if (this.workOrderLaborList) {
      this.laborForm.workFlowWorkOrderId = (this.workOrderLaborList['workFlowWorkOrderId']) ? this.workOrderLaborList['workFlowWorkOrderId'] : this.laborForm.workFlowWorkOrderId;
     this.laborForm.employeeId =this.workOrderLaborList.employeeId;
      this.laborForm.isTaskCompletedByOne = this.workOrderLaborList['isTaskCompletedByOne'];
      this.laborForm.expertiseId = (this.workOrderLaborList['expertiseId']) ? this.workOrderLaborList['expertiseId'] : this.laborForm.expertiseId;
    }
    else {
      this.laborForm.workFloworSpecificTaskorWorkOrder = 'specificTasks';
      this.laborForm.dataEnteredBy = {
        employeeId: this.authService.currentUser.employeeId,
        label: this.authService.currentUser.fullName,
        name: this.authService.currentUser.fullName,
        value: this.authService.currentUser.employeeId
      };
    }
   
    this.id = this.savedWorkOrderData.workOrderId;
    if (this.isView || this.isEdit) {
      for (let task of this.taskList) {
        this.calculateTaskHours(task);
        this.calculateAdjustmentHours(task);
        this.calculateAdjustedHours(task);
      }
    }
    if (this.laborForm.costPlusType) {
      this.laborForm.costPlusType = this.laborForm['markupFixedPrice'];
      this.overAllMarkup = Number(this.laborForm['headerMarkupId']);
    }
    if (this.buildMethodDetails) {
      this.laborForm.costPlusType = this.buildMethodDetails['laborBuildMethod'];
      this.laborForm['laborFlatBillingAmount'] = this.buildMethodDetails['laborFlatBillingAmount'];
    }
    if (this.selectedPartNumber && this.selectedPartNumber.managementStructureId && !this.basicLabourDetail) {
      this.getBasicLabourData(this.selectedPartNumber.managementStructureId);
    }
   
  }
laborTaskData:any;
  ngOnChanges() {
    if(this.workOrderLaborList !=undefined){
      this.laborTaskData=this.workOrderLaborList;
      this.isEdit=true;
      this.disabledUpdatebtn=true;
    }
    if(this.employeesOriginalData && this.employeesOriginalData.length !=0){
      this.allEmployees = this.employeesOriginalData;
    }
   this.laborForm.dataEnteredBy = getObjectById('value', this.laborForm.dataEnteredBy, this.employeesOriginalData);
    if (this.taskList) {
      this.taskListForHeader = this.taskList.map(x => { return { taskId: x.taskId, description: x.description } });
    }
    if (!this.isQuote) {
      this.getEmployeeData();
    }
    this.selectedItems =[];
    this.laborForm.costPlusType = 'Mark Up'
    this.workOrderWorkFlowList = this.workOrderWorkFlowOriginalData;
    if (this.laborForm['workOrderHoursType']) {
      this.laborForm.workFloworSpecificTaskorWorkOrder = 'specificTasks';
      if (this.laborForm['workOrderHoursType'] == 1) {
        this.laborForm.workFloworSpecificTaskorWorkOrder = 'workFlow';
      }
      else if (this.laborForm['workOrderHoursType'] == 2) {
        this.laborForm.workFloworSpecificTaskorWorkOrder = 'specificTasks';
      }
      else if (this.laborForm['workOrderHoursType'] == 3) {
        this.laborForm.workFloworSpecificTaskorWorkOrder = "workOrder";
      }
    }
    this.selectedItems = [];
    for (let tData in this.laborForm.workOrderLaborList[0]) {
      if (this.laborForm.workOrderLaborList[0][tData].length == 0) {
        delete this.laborForm.workOrderLaborList[0][tData]
      }
      else {
        for (let task in this.taskListForHeader) {
          if (tData == this.taskListForHeader[task]['description']) 
          {
            this.selectedItems = [...this.selectedItems, {
              "taskId": this.taskListForHeader[task]['taskId'],
              "description": this.taskListForHeader[task]['description']
            }]
          }
        }
      }
    }
    this.calculateTotalWorkHours();
    setTimeout(() => {
      if (this.workOrderLaborList) {
        this.employeeList = this.employeesOriginalData;
        this.laborForm.workFlowWorkOrderId = (this.workOrderLaborList['workFlowWorkOrderId']) ? this.workOrderLaborList['workFlowWorkOrderId'] : this.laborForm.workFlowWorkOrderId;
        this.laborForm.dataEnteredBy = (this.workOrderLaborList['dataEnteredBy']) ? this.workOrderLaborList['dataEnteredBy'] : this.laborForm.dataEnteredBy;
        this.laborForm.employeeId =this.workOrderLaborList.employeeId;
        this.laborForm.isTaskCompletedByOne = this.workOrderLaborList['isTaskCompletedByOne'];
        this.laborForm.expertiseId = (this.workOrderLaborList['expertiseId']) ? this.workOrderLaborList['expertiseId'] : this.laborForm.expertiseId;
        if (!this.laborForm['dataEnteredBy']) {
          this.laborForm.dataEnteredBy = {
            employeeId: this.authService.currentEmployee.employeeId,
            label: this.authService.currentEmployee.label,
            name: this.authService.currentEmployee.name,
            value: this.authService.currentEmployee.value
          };
        }
      }
      else {
        this.laborForm.dataEnteredBy = {
          employeeId: this.authService.currentEmployee.employeeId,
          label: this.authService.currentEmployee.label,
          name: this.authService.currentEmployee.name,
          value: this.authService.currentEmployee.value
        };
        this.employeesOriginalData = [];
      }
    }, 0)
    if (this.isView || this.isEdit) {
      for (let task of this.taskList) {
        this.calculateTaskHours(task);
        this.calculateAdjustmentHours(task);
        this.calculateAdjustedHours(task);
      }
    }
    if (this.laborForm.costPlusType) {
      this.laborForm.costPlusType = this.laborForm['markupFixedPrice'];
      this.overAllMarkup = Number(this.laborForm['headerMarkupId']);
    }
    this.getAllExpertiseType();
  }
  assignHoursToToalWorkOrder() {
    if (this.laborForm.isTaskCompletedByOne) {
      this.clearHoursData();
      this.laborForm.totalWorkHours = 0;
      this.assignAllTask()
    }
  }
  getWorkFlowLaborList() {
    if (this.workFlowData['laborList']) {
      for (let labList of this.workFlowData['laborList']) {
        if (this.taskList) {
          for (let task of this.taskList) {
            if (task.taskId == labList['taskId']) {
              if (!this.laborForm.workOrderLaborList[0][task.description]) {
                this.laborForm.workOrderLaborList[0][task.description] = []
              }
              if (this.laborForm.workOrderLaborList[0][task.description][0] && (this.laborForm.workOrderLaborList[0][task.description][0]['expertiseId'] == undefined || this.laborForm.workOrderLaborList[0][task.description][0]['expertiseId'] == null)) {
                this.laborForm.workOrderLaborList[0][task.description].splice(0, 1);
              }
              let taskData = new AllTasks()
              taskData['workOrderLaborHeaderId'] = labList['workOrderLaborHeaderId'];
              taskData['workOrderLaborId'] = labList['workOrderLaborId'];
              taskData['expertiseId'] = labList['expertiseId'];
              taskData['employeeId'] = getObjectById('value', labList['employeeId'], this.employeesOriginalData);
              taskData['billableId'] = labList['billableId'];
              taskData['startDate'] = labList['startDate'] ? new Date(labList['startDate']) : null;
              taskData['endDate'] = labList['endDate'] ? new Date(labList['endDate']) : null;
              taskData['hours'] = labList['hours'];
              taskData['adjustments'] = labList['adjustments'];
              taskData['adjustedHours'] = labList['adjustedHours'];
              taskData['memo'] = labList['memo'];
              this.laborForm.workOrderLaborList[0][task.description].push(taskData);
            }
          }
        }
      }
    }
    for (let task of this.taskList) {
      this.calculateTaskHours(task);
    }
  }
  getBasicLabourData(managementStructureId) {
    this.workOrderService.getLaborOHSettingsByManagementstrucId(managementStructureId)
      .subscribe(
        (res) => {
          if (res.length > 0) {
            this.basicLabourDetail = res[0];
            this.populateDefaultData();
          }
          else {
            this.basicLabourDetail = undefined;
          }
        },
        err => {
          this.basicLabourDetail = undefined;
        }
      )
  }
  populateDefaultData() {
    if (isEmptyObject(this.laborForm.workOrderLaborList[0]) && this.basicLabourDetail) {
      if (!this.isQuote && this.basicLabourDetail) {
        if (this.basicLabourDetail['laborHoursIdText'] == 'Assign Total Hours To Work Order') {
          this.laborForm.workFloworSpecificTaskorWorkOrder = 'workOrder';
          this.laborForm.isTaskCompletedByOne = true;
        }
        else if (this.basicLabourDetail['laborHoursIdText'] == 'Assign Hours by Specific Actions') {
          this.laborForm.workFloworSpecificTaskorWorkOrder = 'specificTasks';
        }
      }
      else {
        this.populateQuoteData();
      }
    }
    else if (this.isQuote && !this.isEdit && this.basicLabourDetail) {
      this.populateQuoteData();
    }
  }
  populateQuoteData() {
    if (this.basicLabourDetail) {
      if (this.basicLabourDetail['burdenRateIdText'] == 'As A % Of Technician/Mechanic Hourly Rate') {
        this.defaultBurdenRate = this.basicLabourDetail['burdenRateId'];
      }
      else if (this.basicLabourDetail['burdenRateIdText'] == 'Flat Amount Per Work Order') {
        this.laborForm.costPlusType = 3;
        this.laborForm['laborFlatBillingAmount'] = this.basicLabourDetail['flatAmount'];
      }
    }
  }
  calculateBurderRate(rec) {
    if (rec.burdaenRatePercentageId && rec.directLaborOHCost) {
      this.markupList.forEach((markup) => {
        if (markup.value == rec.burdaenRatePercentageId) {
          rec.burdenRateAmount = (rec.directLaborOHCost / 100) * Number(markup.label);
        }
      })
      this.calculateTotalCost(rec);
      this.markupChanged(rec, 'row');
    }
  }
  calculateOverallTotalHours() {
    if (this.laborForm && this.laborForm['workOrderLaborList']) {
      this.laborForm['totalWorkHours'] = 0;
      this.laborForm['workOrderLaborList'].forEach(
        (lList) => {
          for (let list in lList) {
            lList[list].forEach(
              x => {
                if (x['hours'] && !x['isDeleted']) {
                  this.laborForm['totalWorkHours'] += x['hours'];
                }
              }
            )
          }
        }
      )
      this.laborForm['totalWorkHours'] = this.laborForm['totalWorkHours'].toFixed(2);
    }
  }
  getEmployeeData() {
    if (this.laborForm && this.laborForm.workOrderLaborList[0]) {
      Object.keys(this.laborForm.workOrderLaborList[0]).forEach((task, index) => {
        this.laborForm.workOrderLaborList[0][task].forEach((value) => {
          if (this.laborForm.hoursorClockorScan != 1) {
            this.calculateWorkingHoursandMins(value);
          }
          this.taskList.forEach(t => {
            if (t.description == task) {
              this.calculateTaskHours(t);
              this.calculateAdjustmentHours(t);
              this.calculateAdjustedHours(t);
            }
          })
          if (value.expertiseId) {
            this.commonService.getExpertiseEmployeesByCategory(value.expertiseId).subscribe(res => {
              this['expertiseEmployeeOriginalData' + index] = res.map(x => { return { value: x.employeeId, label: x.name } });
            },
              err => {
              })
          }
        })
      })
    }
    if (this.laborForm && this.laborForm.expertiseId && (!this.employeesOriginalData || this.employeesOriginalData.length <= 0)) {
      this.commonService.getExpertiseEmployeesByCategory(this.laborForm.expertiseId).subscribe(res => {
        this.employeesOriginalData = res.map(x => { return { value: x.employeeId, label: x.name } });
      },
        err => {
        })
    }
  }
  onDeSelect(item: any) {
    this.currentItem = item;
    this.type = "single";
    document.body.click();
    $('#confirmationTaskDelete').modal('show');

  }
  onDeSelectAll(items: any) {
    this.type = "all";
    document.body.click();
    $('#confirmationTaskDelete').modal('show');
  }
  onItemSelect(item: any) {
    if (!this.laborForm.workOrderLaborList[0][item.description]) {
      this.laborForm.workOrderLaborList[0][item.description] = [];
      if (this.laborForm.isTaskCompletedByOne) {
        this.addNewTask(item.description);
      }
    }
    this.disabledUpdatebtn=false;
  }
  onSelectAll(items: any) {
    items.forEach(x => {
      if (!this.laborForm.workOrderLaborList[0][x.description]) {
        this.laborForm.workOrderLaborList[0][x.description] = [];
        if (this.laborForm.isTaskCompletedByOne) {
          this.addNewTask(x.description);
        }
      }
    })
    this.disabledUpdatebtn=false;
  }
  deleteConfirmationTask(type) {
    if (type == 'single') {
      delete this.laborForm.workOrderLaborList[0][this.currentItem.description]
    }
    else if (type == 'all') {
      this.laborForm.workOrderLaborList[0] = {};
    }
    Object.keys(this.laborForm.workOrderLaborList[0]).forEach((task, index) => {
      this.laborForm.workOrderLaborList[0][task].forEach((value) => {
        if (this.laborForm.hoursorClockorScan != 1) {
          this.calculateWorkingHoursandMins(value);
        }
        this.taskList.forEach(t => {
          if (t.description == task) {
            this.calculateTaskHours(t);
            this.calculateAdjustmentHours(t);
            this.calculateAdjustedHours(t);
          }
        })
      })
    })
    $('#confirmationTaskDelete').modal('hide');
    this.disabledUpdatebtn=false;
  }



  clearHoursData() {
    Object.keys(this.laborForm.workOrderLaborList[0]).forEach((task, index) => {
      this.laborForm.workOrderLaborList[0][task].forEach((value) => {
        if (this.laborForm.hoursorClockorScan != 1) {
          this.calculateWorkingHoursandMins(value);
        }
        this.taskList.forEach(t => {
          if (t.description == task) {
            this.clearHours(t);
            this.calculateTaskHours(t);
            this.calculateAdjustmentHours(t);
            this.calculateAdjustedHours(t);
          }
        })
      })
    })
  }
  dismissModelTask() {
    $('#confirmationTaskDelete').modal('hide');
    if (this.type == 'single') {
      this.selectedItems = [...this.selectedItems, { "description": this.currentItem.description, "taskId": this.currentItem.taskId }];
    }
    else if (this.type == 'all') {
      this.selectedItems = this.taskListForHeader;
    }
  }
  getLenghtOfTask(taskList) {
    if (taskList && taskList.length == 0 && !this.isView) {
      return true;
    }
    else if (taskList) {
      for (let task of taskList) {
        if (!task.isDeleted) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  get userName(): string {
    return this.authService.currentUser ? this.authService.currentUser.userName : "";
  }
  generateLaborForm() {
    const keysArray = Object.keys(this.laborForm.workOrderLaborList[0]);
    for (let i = 0; i < keysArray.length; i++) {
      this.laborForm = {
        ...this.laborForm,
        workOrderLaborList: [{ ...this.laborForm.workOrderLaborList[0], [keysArray[i]]: [new AllTasks()] }]
      };
    }
  }
  calculateHoursDifference(obj) {
    if (obj.hours != null && obj.adjustments != null) {
      this.totalWorkHours = 0;
      if (!obj.totalMinutes) {
        obj.totalMinutes = 0;
      }
      if (!obj.totalHours) {
        obj.totalHours = 0;
      }
      obj.hours = Number(`${obj.totalHours}.${obj.totalMinutes}`)
      obj['adjustedHours'] = Number(obj.hours) + Number(obj.adjustments)
      var totalHours = 0;
    }
    this.calculateTotalWorkHours();
  }
  filterWorkFlowNumbers(event): void {
    this.workOrderWorkFlowList = this.workOrderWorkFlowOriginalData;
    if (event.query !== undefined && event.query !== null) {
      const workFlowNos = [...this.workOrderWorkFlowOriginalData.filter(x => {
        return x.label.includes(event.query)
      })]
      this.workOrderWorkFlowList = workFlowNos;
    }
  }
  filterDataEnteredBy(event): void {
    this.dataEnteredByList = this.allEmployees;
    if (event.query !== undefined && event.query !== null) {
      const dataEnteredBy = [...this.allEmployees.filter(x => {
        return x.label.includes(event.query)
      })]
      this.dataEnteredByList = dataEnteredBy;
    }
  }
  filterEmployee(event): void {
    this.employeeList = this.employeesOriginalData;
    if (event.query !== undefined && event.query !== null) {
      const employee = [...this.employeesOriginalData.filter(x => {
        return x.label.includes(event.query)
      })]
      this.employeeList = employee;
    }
  }
  get currentUserMasterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : null;
  }
  setEditArray:any=[];
  getAllExpertiseType(value?) {
    this.setEditArray = [];
    this.setEditArray.push(this.laborForm.expertiseId ? this.laborForm.expertiseId : 0);
if(this.laborTaskData && this.laborTaskData.laborList && this.laborTaskData.laborList.length !=0){
  this.laborTaskData.laborList.forEach(element => {
    if(element.expertiseId !=0 || element.expertiseId !=null){
      this.setEditArray.push(element.expertiseId);
    }
  });
}
    if (this.setEditArray.length == 0) {
        this.setEditArray.push(0);
    }
    const strText = value ? value : '';
    this.commonService.autoCompleteDropdownsExpertiseTypes(strText, true, 20, this.setEditArray.join()).subscribe(res => {
        if (res && res.length != 0) {
          this.expertiseTypeList = res;
        }else{
          this.expertiseTypeList =[];
        }
    })
}
  getExpertiseEmployeeByExpertiseId(value, index, object) {
    if (!this.isQuote) {
      object.employeeId = null;
      if (value) {
        this.commonService.getExpertiseEmployeesByCategory(value).subscribe(res => {
          this['expertiseEmployeeOriginalData' + index] = res.map(x => { return { value: x.employeeId, label: x.name } });;
        },
          err => {
          })
      }
    }
  }

  getExpertiseEmployeeByExpertiseIdForHeader(value) {
    this.commonService.getExpertiseEmployeesByCategory(value).subscribe(res => {
      this.employeesOriginalData = res.map(x => { return { value: x.employeeId, label: x.name } });
      this.laborForm.employeeId = undefined;
    },
      err => {
      })
  }
  getDynamicVariableData(variable, index) {
    return this[variable + index]
  }
  filterExpertiseEmployee(event, index) {
    this['expertiseEmployee' + index] = this['expertiseEmployeeOriginalData' + index] == undefined ? this.employeesOriginalData : this['expertiseEmployeeOriginalData' + index];
    if (event.query !== undefined && event.query !== null) {
      const partNumbers = [...this['expertiseEmployeeOriginalData' + index].filter(x => {
        return x.label.includes(event.query)
      })]
      this['expertiseEmployee' + index] = partNumbers;
    }
  }

  addNewTask(taskName) {
    let taskData = new AllTasks();
    taskData.expertiseId = Number(this.laborForm.expertiseId);
    taskData.employeeId = this.laborForm.employeeId;
    this.taskList.forEach(
      task => {
        if (task.description == "Assemble") {
          taskData.taskId = task.taskId;

        }
      }
    )
    if (this.isQuote && this.basicLabourDetail) {
      if (this.basicLabourDetail['burdenRateIdText'] == 'As A % Of Technician/Mechanic Hourly Rate') {
        taskData['burdaenRatePercentageId'] = this.basicLabourDetail['flatAmount'];
        this.calculateTotalCost(taskData);
        this.markupChanged(taskData, 'row');
      }
      else if (this.basicLabourDetail['burdenRateIdText'] == 'Flat Amount Per Hour') {
        taskData['burdenRateAmount'] = this.basicLabourDetail['flatAmount'];
        this.calculateTotalCost(taskData);
        this.markupChanged(taskData, 'row');
      }
      if (this.basicLabourDetail['laborRateIdText'] == 'Use Average Rate Of ALL Technician/Mechanic') {
        if (this.basicLabourDetail['averageRate']) {
          taskData['directLaborOHCost'] = Number(this.basicLabourDetail['averageRate']).toFixed(2);
        }
        this.calculateTotalCost(taskData);
        this.markupChanged(taskData, 'row');
        this.calculateBurderRate(taskData);
      }

    }
    this.laborForm.workOrderLaborList[0][taskName].unshift(taskData);
    Object.keys(this.laborForm.workOrderLaborList[0]).forEach((task, index) => {
    if(this.laborForm.workOrderLaborList[0][task] && this.laborForm.workOrderLaborList[0][task].length !=0){
      this.laborForm.workOrderLaborList[0][task].forEach((value) => {
        if (this.laborForm.hoursorClockorScan != 1) {
          this.calculateWorkingHoursandMins(value);
        }
        this.taskList.forEach(t => {
          if (t.description == task) {
            this.calculateTaskHours(t);
            this.calculateAdjustmentHours(t);
            this.calculateAdjustedHours(t);
          }
        })
        if (value.expertiseId && !isNaN(value.expertiseId)) {
          this.commonService.getExpertiseEmployeesByCategory(value.expertiseId).subscribe(res => {
            this['expertiseEmployeeOriginalData' + index] = res.map(x => { return { value: x.employeeId, label: x.name } });
          },
            err => {
            })
        }
      })
    }
    })
  }

  startandStop(currentRecord) {
    this.disabledUpdatebtn=false;
    if (currentRecord.startDate === null) {
      currentRecord.startDate = new Date();
    } else if (currentRecord.endDate === null) {
      currentRecord.endDate = new Date();
    }
    this.calculateWorkingHoursandMins(currentRecord)
  }
  resetEndDateandTime(currentRecord) {
    currentRecord.endDate = null;
  }
  calculateWorkingHoursandMins(currentRecord) {
    if (currentRecord.startDate && currentRecord.endDate) {
      const start = moment(currentRecord.startDate)
      const end = moment(currentRecord.endDate)
      const ms = moment(end, "DD/MM/YYYY HH:mm:ss").diff(moment(start, "DD/MM/YYYY HH:mm:ss"));
      const days = moment.duration(ms)
      currentRecord.hours = Math.floor(days.asHours()) + moment.utc(ms).format(".mm");
      currentRecord.totalMinutes = moment.utc(ms).format("mm");
      currentRecord.totalHours = Math.floor(days.asHours());
      this.calculateHoursDifference(currentRecord);
    }
  }
  isEditTime(currentRecord, field) {
    if (field === 'endDateandTimeIsEdit') {
      currentRecord[field] = currentRecord[field] === true ? false : true;
    } else if (field === 'startDateandTimeIsEdit') {
      currentRecord[field] = currentRecord[field] === true ? false : true;
    }
  }
  saveLabor() {
    var wolHeaderId = 0;
    let WorkOrderQuoteTask = [];
    this.taskList.forEach(
      (task) => {
        if (this.laborForm.workOrderLaborList[0][task.description] && this.laborForm.workOrderLaborList[0][task.description].length > 0) {
          if (this.isSubWorkOrder == true) {
            const data = {
              "subWorkOrderLaborId": 0,
              "subWorkOrderLaborHeaderId": 0,
              "WorkOrderQuoteTaskId": 0,
              "TaskId": task.taskId,
              "LaborHours": task.totalHours,
              "OverHeadCost": this.getOverHeadCost(this.laborForm.workOrderLaborList[0][task.description]),
              "AdjustmentHours": 0,
              "AdjustedHours": 0,
              "LaborCost": this.getTotalLabourCost(this.laborForm.workOrderLaborList[0][task.description]),
              "LaborBilling": this.getTotalBillingAmount(this.laborForm.workOrderLaborList[0][task.description]),
              "LaborRevenue": this.getTotalBillingAmount(this.laborForm.workOrderLaborList[0][task.description]),
              "masterCompanyId": task.masterCompany.masterCompanyId,
              "CreatedBy": "admin",
              "UpdatedBy": "admin",
              "CreatedDate": new Date().toDateString(),
              "UpdatedDate": new Date().toDateString(),
              "IsActive": true,
              "isDeleted": false
            }
            WorkOrderQuoteTask.push(data)
            task.masterCompany.masterCompanyId
          } else {
            const data = {
              "WorkOrderQuoteTaskId": 0,
              "TaskId": task.taskId,
              "LaborHours": task.totalHours,
              "OverHeadCost": this.getOverHeadCost(this.laborForm.workOrderLaborList[0][task.description]),
              "AdjustmentHours": 0,
              "AdjustedHours": 0,
              "LaborCost": this.getTotalLabourCost(this.laborForm.workOrderLaborList[0][task.description]),
              "LaborBilling": this.getTotalBillingAmount(this.laborForm.workOrderLaborList[0][task.description]),
              "LaborRevenue": this.getTotalBillingAmount(this.laborForm.workOrderLaborList[0][task.description]),
              "masterCompanyId": this.authService.currentUser.masterCompanyId,
              "CreatedBy": "admin",
              "UpdatedBy": "admin",
              "CreatedDate": new Date().toDateString(),
              "UpdatedDate": new Date().toDateString(),
              "IsActive": true,
              "isDeleted": false
            }
            WorkOrderQuoteTask.push(data)
          }
        }
      }
    )
    if (this.workOrderLaborList !== undefined && this.workOrderLaborList !== null) {
      wolHeaderId = this.workOrderLaborList.workOrderLaborHeaderId;
    }
    const excessParams = {
      createdBy: this.userName,
      updatedBy: this.userName,
      createdate: new Date(),
      updatdate: new Date(),
      isActive: true,
    }


    let tasksData = this.laborForm.workOrderLaborList[0];
    let formedData = {}
    for (let tdata in tasksData) {
      if (tdata != 'length') 
      {


        formedData[tdata] = tasksData[tdata].map(x => {
          return {
            ...x,
            ...excessParams,
            taskId: this.getTaksId(tdata),
            employeeId: getValueFromObjectByKey('value', x.employeeId)
          }
        })
      }
    }
    this.saveFormdata = {
      ...this.laborForm,
      hoursorClockorScan: this.laborForm.hoursorClockorScan,
      dataEnteredBy: getValueFromObjectByKey('value', this.laborForm.dataEnteredBy),
      employeeId: getValueFromObjectByKey('value', this.laborForm.employeeId),
      masterCompanyId: this.authService.currentUser.masterCompanyId,
      ...excessParams,
      workOrderId: this.id,
      workFlowWorkOrderId: getValueFromObjectByKey('value', this.laborForm.workFlowWorkOrderId),
      workOrderLaborHeaderId: wolHeaderId,
      workOrderLaborList: formedData,
      totalWorkHours: this.laborForm.totalWorkHours,
      WorkOrderQuoteTask: WorkOrderQuoteTask,
      LaborBuildMethod: this.laborForm.costPlusType
    }
    if (this.laborForm.workFloworSpecificTaskorWorkOrder == 'workFlow') {
      this.saveFormdata['workOrderHoursType'] = 1;
    }
    else if (this.laborForm.workFloworSpecificTaskorWorkOrder == 'specificTasks') {
      this.saveFormdata['workOrderHoursType'] = 2;
    }
    else if (this.laborForm.workFloworSpecificTaskorWorkOrder == "workOrder") {
      this.saveFormdata['workOrderHoursType'] = 3;
    }
    if (this.isQuote) {
      this.saveFormdata.headerMarkupId = Number(this.overAllMarkup);
      this.saveFormdata.markupFixedPrice = this.laborForm.costPlusType;
    }
    this.saveworkOrderLabor.emit(this.saveFormdata);
    this.disabledUpdatebtn=true;
    this.isEdit=true;
  }
  getOverHeadCost(taskList) {
    let total = 0;
    taskList.forEach(
      (tl) => {
        if (tl['directLaborOHCost']) {
          tl['directLaborOHCost'] = Number(tl['directLaborOHCost']).toFixed(2);
          total += Number(tl['directLaborOHCost']);
        }
      }
    )
    return total;
  }
  getTotalLabourCost(taskList) {
    let total = 0;
    taskList.forEach(
      (tl) => {
        if (tl['totalCost']) {
          total += Number(tl['totalCost']);
        }
      }
    )
    return total;
  }
  getExpertise(expertiseType, taskId) {
    try {
      if (this.workOrderLaborList) {
        for (let workOrdLList of this.workOrderLaborList['laborList']) {
          if (workOrdLList['taskId'] == taskId && workOrdLList['expertiseId'] == expertiseType['value']) {
            return true;
          }
        }
        return false
      }
      return true;
    }
    catch {
      return true;
    }
  }
  getTaksId(taskName) {
    for (let t of this.taskList) {
      if (t['description'] == taskName) {
        return t['taskId']
      }
    }
  }
  isAllowedTask(taskId) {
    try {
      if (this.workOrderLaborList) {
        for (let workOrdLList of this.workOrderLaborList['laborList']) {
          if (workOrdLList['taskId'] == taskId) {
            return true;
          }
        }
        return false
      }
      return true;
    }
    catch {
      return true;
    }
  }
  checkDisability(record, taskId) {
    try {
      if (this.workOrderLaborList) {
        if (this.laborForm['workFloworSpecificTaskorWorkOrder'] == 'workOrder') {
          return true;
        }
        else if (this.laborForm['workFloworSpecificTaskorWorkOrder'] == 'workFlow') {
          for (let workOrdLList of this.workOrderLaborList['laborList']) {
            if (workOrdLList['taskId'] == taskId && workOrdLList['expertiseId'] == record['expertiseId']) {
              record['hours'] = workOrdLList['hours'];
              this.calculateHoursDifference(record);
            }
          }
          return true;
        }
      }
      return false;
    }
    catch {
      return false;
    }
  }
  currentRecord:any={};
  showDeleteLabourPopup(taskName, res, index) {
    this.currentRecord=res;
    console.log("hello", this.currentRecord)
    this.deletingLabourObj = {
      taskName: taskName,
      index: index
    }
    $('#deleteRowConfirmation').modal('show');
  }
  deleteLabor(taskName, index) {
    this.laborForm.workOrderLaborList[0][taskName][index].isDeleted = true;
    let temp = this.laborForm.workOrderLaborList[0][taskName].splice(index, 1);
    this.laborForm.workOrderLaborList[0][taskName].push(temp[0]);
    this.disabledUpdatebtn=false;
this.commonfunctionHandler();
  }
  commonfunctionHandler(){
    Object.keys(this.laborForm.workOrderLaborList[0]).forEach((task, index) => {
      this.laborForm.workOrderLaborList[0][task].forEach((value) => {
        if (this.laborForm.hoursorClockorScan != 1) {
          this.calculateWorkingHoursandMins(value);
        }
        this.taskList.forEach(t => {
          if (t.description == task) {
            this.calculateTaskHours(t);
            this.calculateAdjustmentHours(t);
            this.calculateAdjustedHours(t);
          }
        })
        this.commonService.getExpertiseEmployeesByCategory(value.expertiseId).subscribe(res => {
          this['expertiseEmployeeOriginalData' + index] = res.map(x => { return { value: x.employeeId, label: x.name } });
        },
          err => {
          })
      })
    })
    this.calculateOverallTotalHours()
  }
  calculateTotalCost(rec) {
    if (rec['directLaborOHCost']) {
      rec.totalCostPerHour = Number(rec['directLaborOHCost']);
      if (rec['burdenRateAmount']) {
        rec.totalCostPerHour += Number(rec['burdenRateAmount']);
      }
      if (rec.hours) {
        rec['totalCost'] = (Number(rec.totalCostPerHour) * Number(rec.hours)).toFixed(2);
      }
    }
  }
  tmchange() {
    this.overAllMarkup = '';
    let billingMethodId = Number(this.laborForm.costPlusType);
    for (let t in this.laborForm.workOrderLaborList[0]) {
      for (let mData of this.laborForm.workOrderLaborList[0][t]) {
        if (this.laborForm.costPlusType && this.laborForm.costPlusType == 3) {
          mData.billingAmount = 0.00;
          mData.billingRate = 0.00;
          this.laborForm['laborFlatBillingAmount'] = 0.00;
        }
        mData.billingMethodId = (billingMethodId == 3) ? '' : billingMethodId;
        if (billingMethodId == 2 || billingMethodId == 3) {
          mData.markupPercentageId = undefined;
        }
      }
    }
  }
  markupChanged(matData, type) {
    try {
      if (this.markupList) {
        this.markupList.forEach((markup) => {
          if (type == 'row' && markup.value == matData.markupPercentageId && matData['totalCostPerHour'] && matData['totalCostPerHour']) {
            matData['billingRate'] = ((matData['totalCostPerHour']) + (((matData['totalCostPerHour']) / 100) * Number(markup.label))).toFixed(2)
            matData['billingAmount'] = formatNumberAsGlobalSettingsModule(Number(matData['billingRate']) * Number(matData.hours), 0);
          }
          else if (type == 'all' && markup.value == this.overAllMarkup) {
            for (let t in this.laborForm.workOrderLaborList[0]) {
              for (let mData of this.laborForm.workOrderLaborList[0][t]) {
                if (mData['billingMethodId'] == 1) {
                  mData.markupPercentageId = this.overAllMarkup;
                  if (mData['totalCostPerHour'] && mData['totalCostPerHour']) {
                    mData['billingRate'] = ((mData['totalCostPerHour']) + (((mData['totalCostPerHour']) / 100) * Number(markup.label))).toFixed(2)
                    mData['billingAmount'] = formatNumberAsGlobalSettingsModule(Number(mData['billingRate']) * Number(mData.hours), 0);
                  }
                }
              }
            }
          }
        })
      }
    }
    catch (e) {
    }
  }
  calculateTotalWorkHours() {
    if (this.laborForm.workFloworSpecificTaskorWorkOrder == 'specificTasks' || this.laborForm.workFloworSpecificTaskorWorkOrder == 'workFlow') {
      this.laborForm.totalWorkHours = 0;
      if (this.laborForm.workOrderLaborList) {
        for (let task in this.laborForm.workOrderLaborList[0]) {
          if (this.laborForm.workOrderLaborList[0][task][0] && this.laborForm.workOrderLaborList[0][task][0]['hours'] != null) {
            for (let taskList of this.laborForm.workOrderLaborList[0][task]) {
              this.laborForm.totalWorkHours += Number(taskList['hours']);
            }
          }
        }
        this.laborForm.totalWorkHours = this.laborForm.totalWorkHours.toFixed(2);
      }
    }
  }
  getTotalCostPlusAmount() {
    let total = 0;
    this.laborForm.workOrderLaborList.forEach(
      (material) => {
        if (material.labourCostPlus) {
          total += material.labourCostPlus;
        }
      }
    )
    return formatNumberAsGlobalSettingsModule(total, 0);
  }
  getTotalFixedAmount(taskList) {
    let total = 0;
    for (let labor of taskList) {
      if (labor.fixedAmount) {
        total += Number(labor.fixedAmount.toString().split(',').join(''));
      }
    }
    return formatNumberAsGlobalSettingsModule(total, 0);
  }
  getTotalLaborOHCost(taskList) {
    let total = 0;
    for (let labor of taskList) {
      if (labor.directLaborOHCost) {
        total += Number(labor.directLaborOHCost.toString().split(',').join(''));
      }
    }
    return formatNumberAsGlobalSettingsModule(total, 0);
  }
  getTotalLaborBurdenRate(taskList) {
    let total = 0;
    for (let labor of taskList) {
      if (labor.burdenRateAmount) {
        total += Number(labor.burdenRateAmount.toString().split(',').join(''));
      }
    }
    return formatNumberAsGlobalSettingsModule(total, 0);
  }
  getTotalCostPerHour(taskList) {
    let total = 0;
    for (let labor of taskList) {
      if (labor.totalCostPerHour) {
        total += Number(labor.totalCostPerHour.toString().split(',').join(''));
      }
    }
    return formatNumberAsGlobalSettingsModule(total, 0);
  }
  getTotalCost(taskList) {
    let total = 0;
    for (let labor of taskList) {
      if (labor.totalCost && !labor.isDeleted) {
        total += Number(labor.totalCost.toString().split(',').join(''));
      }
    }
    return formatNumberAsGlobalSettingsModule(total, 0);
  }
  getTotalBillingRate(taskList) {
    let total = 0;
    for (let labor of taskList) {
      if (labor.billingRate) {
        total += Number(labor.billingRate.toString().split(',').join(''));
      }
    }
    return total.toFixed(2);
  }
  getTotalBillingAmount(taskList) {
    let total = 0;
    for (let labor of taskList) {
      if (labor.billingAmount && !labor.isDeleted) {
        total += Number(labor.billingAmount.toString().split(',').join(''));
      }
    }
    this.laborForm['laborFlatBillingAmount'] = total.toFixed(2);
    return formatNumberAsGlobalSettingsModule(total, 0);
  }
  getTotalCostPlus(taskList) {
    let total = 0;
    for (let labor of taskList) {
      if (labor.labourCostPlus) {
        total += labor.labourCostPlus;
      }
    }
    return total.toFixed(2);
  }
  getTotalHours(taskList) {
    let total = 0;
    for (let labor of taskList) {
      if (labor.hours) {
        total += Number(labor.hours);
      }
    }
    return total.toFixed(2);
  }
  calculateTotalHours() {
    if (this.laborForm.workFloworSpecificTaskorWorkOrder == 'specificTasks' || !this.laborForm.workFloworSpecificTaskorWorkOrder) {
      this.laborForm.totalWorkHours = 0;
      for (let task of this.taskList) {
        if (task.totalWorkHours) {
          this.laborForm.totalWorkHours += Number(task.totalWorkHours);
        }
      }
      this.laborForm.totalWorkHours = this.laborForm.totalWorkHours.toFixed(2);
    }
  }
  calculateTotalAdjustment() {
    let total = 0;
    for (let task of this.taskList) {
      if (task['totalAdjustments'])
        total += task['totalAdjustments'];
    }
    return total;
  }
  calculateTotalAdjustedHours() {
    let total = 0;
    for (let task of this.taskList) {
      if (task['totalAdjustedHours'])
        total += task['totalAdjustedHours'];
    }
    return total;
  }
  calculateTaskHours(task) {
    task.totalWorkHours = 0;
    if (this.laborForm.workOrderLaborList[0] && this.laborForm.workOrderLaborList[0][task.description]) {
      for (let taskData of this.laborForm.workOrderLaborList[0][task.description]) {
        if (!taskData.totalMinutes) {
          taskData.totalMinutes = 0;
        }
        if (!taskData.totalHours) {
          taskData.totalHours = 0;
        }
        taskData.hours = Number(`${taskData.totalHours}.${taskData.totalMinutes}`)
        if (taskData.hours && !taskData.isDeleted)
          task.totalWorkHours += Number(taskData.hours);
      }
      task.totalWorkHours = task.totalWorkHours.toFixed(2);
    }
    this.calculateTotalHours();
  }
  calculateAdjustmentHours(task) {
    task.totalAdjustments = 0;
    if (this.laborForm.workOrderLaborList[0] && this.laborForm.workOrderLaborList[0][task.description]) {
      for (let taskData of this.laborForm.workOrderLaborList[0][task.description]) {
        if (taskData.adjustments && !taskData.isDeleted)
          task.totalAdjustments += Number(taskData.adjustments);
      }
    }
    this.calculateAdjustedHours(task);
  }
  calculateAdjustedHours(task) {
    task.totalAdjustedHours = 0;
    if (this.laborForm.workOrderLaborList[0] && this.laborForm.workOrderLaborList[0][task.description]) {
      for (let taskData of this.laborForm.workOrderLaborList[0][task.description]) {
        if (taskData.adjustedHours && !taskData.isDeleted)
          task.totalAdjustedHours += Number(taskData.adjustedHours);
      }
    }
  }
  clearHours(task) {
    task.totalWorkHours = 0;
    if (this.laborForm.workOrderLaborList[0] && this.laborForm.workOrderLaborList[0][task.description]) {
      for (let taskData of this.laborForm.workOrderLaborList[0][task.description]) {
        if (taskData.hours && !taskData.isDeleted)
          taskData.hours = 0;
      }
    }
  }
  getOverAlltotal(type) {
    let htotal = 0;
    let loTotal = 0;
    let burTotal = 0;
    let cpTotal = 0;
    let costTotal = 0;
    let bRTotal = 0;
    let bATotal = 0;
    for (let task in this.laborForm.workOrderLaborList[0]) {
      this.laborForm.workOrderLaborList[0][task].forEach(
        data => {
          switch (type) {
            case "Hours": {
              if (data.hours) htotal += Number(data.hours);
            }
            case "LaborOHCost": {
              if (data.directLaborOHCost) loTotal += Number(data.directLaborOHCost.toString().split(',').join(''));
            }
            case "LaborBurdenRate": {
              if (data.burdenRateAmount) burTotal += Number(data.burdenRateAmount.toString().split(',').join(''));
            }
            case "CostPerHour": {
              if (data.totalCostPerHour) cpTotal += Number(data.totalCostPerHour);
            }
            case "Cost": {
              if (data.totalCost && !data.isDeleted) costTotal += Number(data.totalCost.toString().split(',').join(''));
            }
            case "BillingRate": {
              if (data.billingRate) bRTotal += Number(data.billingRate);
            }
            default: {
              if (data.billingAmount && !data.isDeleted) bATotal += Number(data.billingAmount.toString().split(',').join(''));
            }
          }
        }
      )
    }
    return (type == 'Hours') ? htotal.toFixed(2) : (type == 'LaborOHCost') ? formatNumberAsGlobalSettingsModule(loTotal, 0) : (type == 'LaborBurdenRate') ? formatNumberAsGlobalSettingsModule(burTotal, 0) : (type == 'CostPerHour') ? formatNumberAsGlobalSettingsModule(cpTotal, 0) : (type == 'Cost') ? formatNumberAsGlobalSettingsModule(costTotal, 0) : (type == 'BillingRate') ? formatNumberAsGlobalSettingsModule(bRTotal, 0) : formatNumberAsGlobalSettingsModule(bATotal, 0);
  }
  deleteConfirmation() {
    // Object.keys(this.laborForm.workOrderLaborList[0]).forEach((task, index) => {
    //   this.laborForm.workOrderLaborList[0][task] = [];
    //   this.addNewTask(task);
    // })
    Object.keys(this.laborForm.workOrderLaborList[0]).forEach((task, index) => {
      this.laborForm.workOrderLaborList[0][task].forEach((value) => {
        if (this.laborForm.hoursorClockorScan != 1) {
          this.calculateWorkingHoursandMins(value);
        }
        this.taskList.forEach(t => {
          if (t.description == task) {
            this.calculateTaskHours(t);
            this.calculateAdjustmentHours(t);
            this.calculateAdjustedHours(t);
          }
        })
      })
    })
    if (!this.laborForm.isTaskCompletedByOne) {
      this.laborForm.workFloworSpecificTaskorWorkOrder = 'specificTasks';
      this.laborForm.totalWorkHours = 0;
    }
    $('#confirmation').modal('hide');
    this.disabledUpdatebtn=false;
  }
  dismissModel() {
    this.laborForm['isTaskCompletedByOne'] = !this.laborForm['isTaskCompletedByOne'];
    $('#confirmation').modal('hide');
  }
  taskComletedByConfirmation(event) {
    $('#confirmation').modal('show');
  }
  checkHoursAndDirectLabour() { 
    var result = false;
    for (let task in this.laborForm.workOrderLaborList[0]) {
      this.laborForm.workOrderLaborList[0][task].forEach(
        data => {
          if (!data.isDeleted && this.isQuote) {
            if (!data.hours || !data.directLaborOHCost) {
              result = true;
            }
          }
          if (data.adjustments>0 && !this.isQuote) {
            if (data.memo =='' || !data.memo || data.memo ==undefined || data.memo ==null) {
              result = true;
            }
          }
        }
      )
    }
    return result;
  }
  assignAllTask() {
    this.laborForm.workOrderLaborList[0] = {};
    this.laborForm.hoursorClockorScan = 1;
    if (this.laborForm.workFloworSpecificTaskorWorkOrder == 'workOrder') {
      this.taskList.forEach(
        (task) => {
          if (task['description'] == "all task") {
            this.laborForm.workOrderLaborList[0][task.description] = [];
            this.addNewTask(task.description);
          }
        }
      )
    }
  }
  formateCurrency(value) {
    if (value) {
      value = (Number(value.toString().split(',').join(''))).toFixed(2);
      let result = formatNumberAsGlobalSettingsModule(value, 0.00);
      return `${result}.00`;
    }
    return value;
  }
  assignLabourExpertise(id) {
    if (this.laborForm.workFloworSpecificTaskorWorkOrder == 'workOrder') {
      this.laborForm.workOrderLaborList[0]['all task'][0]['expertiseId'] = id;
    }
  }
  assignLabourEmployee(id) {
    if (this.laborForm.workFloworSpecificTaskorWorkOrder == 'workOrder') {
      this.laborForm.workOrderLaborList[0]['all task'][0]['employeeId'] = id;
    }
  }
  parsedText(text) {
    
    if(text){
        const dom = new DOMParser().parseFromString(
            '<!doctype html><body>' + text,
            'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
    }
      }
      currentIndex:any;
      taskIndex:any;
      currentTaks:any;
      onAddTextAreaInfo(material,taskName,index,track) {
        this.currentIndex=index;
        this.taskIndex=track;
        console.log("index,trek",index,track)
        this.currentTaks=taskName;
        this.textAreaInfoLabor = material;
        this.disableEditor=true;
    }
    textAreaInfoLabor: any;
    disableEditor:any=true;
    editorgetmemo(ev){
        this.disableEditor=false;
                    }
    onSaveTextAreaInfo(memo) {
        this.disableSaveForEdit=false;
        if (memo) {
            this.textAreaInfoLabor = memo;
            this.laborForm.workOrderLaborList[0][this.currentTaks][this.currentIndex].memo = memo;
        }
        $("#textarea-popup5").modal("hide");
        this.disabledUpdatebtn=false;
    }
    onCloseTextAreaInfo() {
        $("#textarea-popup5").modal("hide");
    }
   checkValid(v){
    this.disabledUpdatebtn=false;
    }
    headerMaintanance(){
      // this.refreshLabor.emit(true);
    }
    historyData:any=[];
    // auditHistoryHeaders:any=[];
    auditHistoryHeaders = [
        { field: 'taskName', header: 'Task' ,isRequired:false},
        { field: 'expertise', header: 'Expertise',isRequired:false },
        { field: 'billabletype', header: 'Billable /NonBillable',isRequired:false },
        { field: 'hours', header: 'Hours',isRequired:false },
        { field: 'directLaborOHCost', header: 'Direct Labor',isRequired:false },
        { field: 'uomName', header: 'Burden Rate %',isRequired:false },
        { field: 'burdaenRatePercentage', header: 'Burden Rate %',isRequired:false },
        { field: 'burdenRateAmount', header: 'Burden Rate Amount',isRequired:false },
        { field: 'totalCostPerHour', header: 'Labor Cost/Hr',isRequired:false },
        { field: 'totalCost', header: 'Total Direct Cost',isRequired:false },
        { field: 'billingName', header: 'Billing Method',isRequired:false },
        { field: 'markUp', header: 'Mark Up',isRequired:false },
        { field: 'billingRate', header: 'Billing Rate',isRequired:false },
        { field: 'billingAmount', header: 'Billing Amount',isRequired:false },
        { field: 'isDeleted', header: 'Is Deleted',isRequired:false },
        { field: 'createdDate', header: 'Created Date',isRequired:false },
        { field: 'createdBy', header: 'Created By',isRequired:false },
        { field: 'updatedDate', header: 'Updated Date',isRequired:false },
        { field: 'updatedBy', header: 'Updated By',isRequired:false },
      ]
    getAuditHistoryById(rowData) { 
      console.log("roeData",rowData)
        if(rowData.workOrderQuoteLaborId){
        this.workOrderService.getquoteLaborHistory(rowData.workOrderQuoteLaborId).subscribe(res => {
          this.historyData = res;
        //   this.historyData = res.forEach(element => {
        //     element.billingAmount=element.billingAmount ?  formatNumberAsGlobalSettingsModule(element.billingAmount, 2) : '0.00';
        //     element.billingRate=element.billingRate ?  formatNumberAsGlobalSettingsModule(element.billingRate, 2) : '0.00';
        //     element.markUp=element.markUp ?  formatNumberAsGlobalSettingsModule(element.markUp, 2) : '0.00';

        //     element.burdaenRatePercentage=element.burdaenRatePercentage ?  formatNumberAsGlobalSettingsModule(element.burdaenRatePercentage, 2) : '0.00';
        //     element.burdenRateAmount=element.burdenRateAmount ?  formatNumberAsGlobalSettingsModule(element.burdenRateAmount, 2) : '0.00';
        //     element.totalCostPerHour=element.totalCostPerHour ?  formatNumberAsGlobalSettingsModule(element.totalCostPerHour, 2) : '0.00';
          
        //     element.totalCost=element.totalCost ?  formatNumberAsGlobalSettingsModule(element.totalCost, 2) : '0.00';
        // });
          this.auditHistoryHeaders=this.auditHistoryHeaders;
          // this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
       
          this.modal = this.modalService.open(AuditComponentComponent, { size: 'lg', backdrop: 'static', keyboard: false,windowClass: 'assetMange' });
          this.modal.componentInstance.auditHistoryHeader = this.auditHistoryHeaders;
          this.modal.componentInstance.auditHistory = this.historyData;
          
        })
    }else{
        this.modal = this.modalService.open(AuditComponentComponent, { size: 'lg', backdrop: 'static', keyboard: false,windowClass: 'assetMange' });
        this.modal.componentInstance.auditHistoryHeader = this.auditHistoryHeaders;
        this.modal.componentInstance.auditHistory = [];  
    }
      }

}