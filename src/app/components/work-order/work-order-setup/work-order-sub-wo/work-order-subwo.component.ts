import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { CommonService } from '../../../../services/common.service';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { AuthService } from '../../../../services/auth.service';
import { getValueFromArrayOfObjectById, editValueAssignByCondition, getObjectById } from '../../../../generic/autocomplete';
import * as moment from 'moment';
import { SubWorkOrderPartNumber } from '../../../../models/sub-work-order-partnumber.model';
import { Location } from '@angular/common';

@Component({
    selector: 'app-sub-work-order',
    templateUrl: './work-order-subwo.component.html',
    styleUrls: ['./work-order-subwo.component.scss']
})
/** WorkOrderShipping component*/
export class SubWorkOrderComponent implements OnInit {
    issubWorkOrderState: Boolean = true;
    subWorkOrderHeader: any;
    workOrderDetails: any;
    workOrderId: any;
    mpnId: any;
    subWorkOrderId: any;
    workOrderMaterialsId: any;
    subWorkOrderGeneralInformation: any;
    workOrderStagesList: any;
    workOrderStatusList: any;
    cmmList: any;
    workFlowList: any;
    isEdit: boolean = false;
    showTabsGrid: boolean;
    workFlowWorkOrderId: any;
    showGridMenu: boolean;
    workScopesList: { label: string; value: number; }[];
    conditionList: any = [];
    allValuesSame: any;
    statusId: any;
    workOrderNumberStatus: any;
    activeGridUpdateButton: boolean = false;
    subWOPartNoId: any;
    isSavedPartNumbers: boolean;
    addToExisting: any;
    mpnGridUpdated: boolean = false;
    isView: boolean;
    tearDownReportList: any;
    constructor(private router: Router,
        private commonService: CommonService,
        private acRouter: ActivatedRoute,
        private alertService: AlertService,
        private authService: AuthService,
        private cdRef: ChangeDetectorRef,
        private location: Location,
        private workOrderService: WorkOrderService) {
    }
    ngOnInit() {
        const queryParamsData = this.acRouter.snapshot.queryParams;
        this.workOrderId = parseInt(queryParamsData.workorderid);
        // this.url=`/http://localhost:5050/workordersmodule/workorderspages/app-work-order-edit/${this.workOrderId}`;

        this.subWorkOrderId = parseInt(queryParamsData.subworkorderid);
        this.addToExisting = parseInt(queryParamsData.exist);
        if (this.subWorkOrderId != 0) {
            this.isSavedPartNumbers = true;
            this.mpnGridUpdated = true;
        } else {
            this.isSavedPartNumbers = false;
            this.mpnGridUpdated = false;
        }
        this.workOrderMaterialsId = parseInt(queryParamsData.workordermaterialsid);
        this.mpnId = parseInt(queryParamsData.mpnid);
        // this.workOrderDetails = queryParamsData;
        console.log("sub work order id", this.subWorkOrderId)
        if (this.subWorkOrderId != 0) {
            this.isEdit = true;
            this.showTabsGrid = true;
            this.showGridMenu = true;
        }
        this.getAllExpertiseType();
        //grid calls
        this.getConditionsList();
        this.getAllTecStations();
        this.getAllPriority();
        this.getSubWorkOrderEditData();
        this.getAllWorkOrderStages(); // for stages dropdown
        this.getAllWorkOrderStatus();
        this.getSubWorOrderMpns();
        this.getAllWorkScpoes('');


    }
    navigateToWo() {
        this.router.navigateByUrl(`workordersmodule/workorderspages/app-work-order-edit/${this.workOrderId}`)
    }
    getSubWorOrderMpns() {
        this.subWorkOrderPartNumbers = [];
        if (this.subWorkOrderId != 0) {
            this.workOrderService.getSubWorOrderMpnsById(this.subWorkOrderId).subscribe(res => {
                if (res && res.length == 0) {
                    this.activeGridUpdateButton = false;
                    // for add subworkorder to existing sub workorder 
                    if (this.addToExisting == 1) {
                        this.subWorkOrderGridData();
                    }
                    console.log("exis", this.addToExisting);
                } else {
                    this.activeGridUpdateButton = true;
                    console.log("technision list", this.technicianByExpertiseTypeList);
                    res.map((x, index) => {
                        x.customerRequestDate = (x.customerRequestDate) ? new Date(x.customerRequestDate) : new Date();
                        x.estimatedCompletionDate = (x.customerRequestDate) ? new Date(x.estimatedCompletionDate) : new Date(x.customerRequestDate);
                        x.estimatedShipDate = (x.estimatedShipDate) ? new Date(x.estimatedShipDate) : new Date(x.customerRequestDate);
                        x.promisedDate = (x.promisedDate) ? new Date(x.promisedDate) : new Date(x.customerRequestDate);
                        x.createdDate = new Date(x.createdDate),
                            x.updatedDate = new Date(x.updatedDate)
                        x.partTechnicianId = getObjectById('employeeId', x.technicianId, this.technicianByExpertiseTypeList)
              
                        this.getWorkFlowByPNandScope(x, index);
                    })

                    this.subWorkOrderPartNumbers = res;
                    console.log("exis44", this.addToExisting);
                    if (this.addToExisting == 1) {
                        console.log("existing sub work order")
                        this.subWorkOrderGridData();
                    } else {
                        if (this.subWorkOrderPartNumbers && this.subWorkOrderPartNumbers.length != 0) {
                            this.getAllWorkScpoes('');
                            this.workOrderStatus();
                        }
                    }
                }
            })
        }
    }
    subWorkOrderPartNumbers: any;
    subWorkOrderGridData() {
        this.workOrderService.getSubWorkOrderDataForMpnGrid(this.workOrderMaterialsId, this.mpnId).subscribe(res => {
            console.log("grid Data", this.subWorkOrderId);
            res.workOrderMaterialsId = this.workOrderMaterialsId;
            res.conditionId = res.conditionCodeId;
            res.createdBy = "admin",
                res.updatedBy = "admin",
                res.subWorkOrderId = this.subWorkOrderId;
            if (this.addToExisting == NaN) {
                this.subWorkOrderPartNumbers = [];
            }
            const subWoObj = new SubWorkOrderPartNumber();
            const mylength = res.quantity;
            for (let i = 0; i < mylength; i++) {
                res.quantity = 1;
                const obj = JSON.parse(JSON.stringify(res))
                obj.tempId = i;
                obj.workOrderId = this.workOrderId;
                obj.customerRequestDate = new Date(res.customerRequestDate);
                obj.estimatedCompletionDate = new Date(res.estimatedCompletionDate);
                obj.estimatedShipDate = new Date(res.estimatedShipDate);
                obj.promisedDate = new Date(res.promisedDate);
                obj.createdDate = new Date(),
                    obj.updatedDate = new Date(),
                    this.subWorkOrderPartNumbers.push({ ...subWoObj, ...obj });
            }
            if (this.subWorkOrderPartNumbers && this.subWorkOrderPartNumbers.length != 0) {
                this.getAllWorkScpoes('');
                this.workOrderStatus();
                if (this.addToExisting == NaN) {
                    this.subWorkOrderPartNumbers.map((x, index) => {
                        this.getWorkFlowByPNandScope(x, index);
                    })
                }
            }
        }, error => {

        })
    }
    saveSubWorkOrderParts() {
        const subWorkOrder = this.subWorkOrderPartNumbers;
        subWorkOrder.map((x, index) => {
            if (this.activeGridUpdateButton == true) {
                x.technicianId = editValueAssignByCondition('employeeId', x.partTechnicianId)
            }
            x.workOrderMaterialsId = this.workOrderMaterialsId,
             x.customerRequestDate = x.customerRequestDate ? new Date(x.customerRequestDate) : null,
                x.estimatedCompletionDate = (x.estimatedCompletionDate) ? new Date(x.estimatedCompletionDate) : new Date(x.customerRequestDate),
                x.estimatedShipDate = (x.estimatedShipDate) ? new Date(x.estimatedShipDate) : new Date(x.customerRequestDate),
                x.promisedDate = (x.promisedDate) ? new Date(x.promisedDate) : new Date(x.customerRequestDate)
        })
        this.workOrderService.createSubWorkOrderGrid(subWorkOrder).subscribe(res => {
            this.location.replaceState(`/workordersmodule/workorderspages/app-sub-work-order?workorderid=${this.workOrderId}&mpnid=${this.mpnId}&subworkorderid=${this.subWorkOrderId}&workOrderMaterialsId=${this.workOrderMaterialsId}`);
            this.mpnGridUpdated = true;
            this.isSavedPartNumbers = true;
            this.alertService.showMessage(
                '',
                'Sub WorkOrder Updated Successfully',
                MessageSeverity.success
            );
        })
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    getSubWorkOrderEditData() {
        this.workOrderService.getSubWorkOrderDataBySubWorkOrderId(this.subWorkOrderId).subscribe(res => {
            this.getDataFormating(res);
            this.isEdit = true;
            this.getHeaderDetailsForCreateSubWO();
        }, error => {
            this.getHeaderDetailsForCreateSubWO();
            this.isEdit = false;
        })
    }
    getHeaderDetailsForCreateSubWO() {
        if (this.workOrderId && this.mpnId) {
            this.workOrderService.getSubWorkOrderHeaderByWorkOrderId(this.workOrderId, this.mpnId).subscribe(res => {
                this.subWorkOrderHeader = res;
                this.workFlowWorkOrderId = res.workFlowWorkOrderId;
                this.workOrderDetails = {
                    ...res,
                    workFlowId: res.workFlowId,
                    workFlowWorkOrderId: res.workFlowWorkOrderId,
                    workOrderId: this.workOrderId,
                    subWorkOrderId: this.subWorkOrderId
                }
                if (this.isEdit === false) {
                    this.getDataFormating(res);
                }
            })
        }
    }
    getDataFormating(res) {
        this.subWorkOrderGeneralInformation = {
            ...res,
            openDate: res.openDate !== undefined ? new Date(res.openDate) : new Date(),
            estimatedCompletionDate: res.estCompDate !== undefined ? new Date(res.estCompDate) : new Date(),
            needDate: res.needDate !== undefined ? new Date(res.needDate) : new Date(),
        };
    }
    getAllWorkOrderStages(): void {
        this.workOrderService.getWorkOrderStageAndStatus().subscribe(res => {
            this.workOrderStagesList = res.map(x => {
                return {
                    ...x,
                    value: x.workOrderStageId,
                    label: x.workOrderStage
                }
            });
        })
    }
    getAllWorkOrderStatus(): void {
        this.commonService.smartDropDownList('WorkOrderStatus', 'ID', 'Description').subscribe(res => {
            this.workOrderStatusList = res.sort(function (a, b) { return a.value - b.value; });
        })
    }
    saveSubWorkOrder() {
        const data = {
            workOrderMaterialsId: this.workOrderMaterialsId,
            workOrderNum: this.subWorkOrderGeneralInformation.workOrderNum,
            subWorkOrderId: this.subWorkOrderId,
            workOrderId: this.workOrderId,
            workFlowId: this.subWorkOrderGeneralInformation.workFlowId,
            workOrderPartNumberId: this.mpnId,
            subWorkOrderNo: this.subWorkOrderGeneralInformation.subWorkOrderNo,
            openDate: this.subWorkOrderGeneralInformation.openDate,
            needDate: this.subWorkOrderGeneralInformation.needDate,
            estCompDate: this.subWorkOrderGeneralInformation.estimatedCompletionDate,
            stageId: this.subWorkOrderGeneralInformation.stageId,
            statusId: this.subWorkOrderGeneralInformation.statusId,
            cmmId: this.subWorkOrderGeneralInformation.cmmId,
            isPMA: this.subWorkOrderGeneralInformation.isPMA,
            IsDER: this.subWorkOrderGeneralInformation.isDER,
            masterCompanyId: 1,
            createdBy: this.userName,
            updatedBy: this.userName,
            createdDate: new Date(),
            updatedDate: new Date(),
            isActive: true,
            isDeleted: false
        }
        if (!this.isEdit) {
            this.workOrderService.createSubWorkOrderHeaderByWorkOrderId(data).subscribe(res => {
                this.isEdit = true;
                this.showTabsGrid = true;
                this.showGridMenu = true;
                this.subWorkOrderGeneralInformation = res;
                this.subWorkOrderGeneralInformation.openDate = res.openDate !== undefined ? new Date(res.openDate) : new Date();
                this.subWorkOrderId = res.subWorkOrderId;
                this.updateURLParams();
                this.activeGridUpdateButton = false;
                this.subWorkOrderGridData();
                this.alertService.showMessage(
                    '',
                    'Sub WorkOrder Saved Successfully',
                    MessageSeverity.success
                );
            })
        } else {
            this.workOrderService.createSubWorkOrderHeaderByWorkOrderId(data).subscribe(res => {
                this.isEdit = true;
                this.showTabsGrid = true;
                this.showGridMenu = true;
                this.subWorkOrderGeneralInformation = res;
                this.subWorkOrderGeneralInformation.openDate = res.openDate !== undefined ? new Date(res.openDate) : new Date();
                this.subWorkOrderId = res.subWorkOrderId;
                this.workOrderMaterialsId = res.workOrderMaterialsId;
                this.updateURLParams();
                this.alertService.showMessage(
                    '',
                    'Sub WorkOrder Updated Successfully',
                    MessageSeverity.success
                );
            })
        }
    }
    updateURLParams() {
        window.history.replaceState({}, '', `/workordersmodule/workorderspages/app-sub-work-order?workorderid=${this.workOrderId}&mpnid=${this.mpnId}&subworkorderid=${this.subWorkOrderId}&workOrderMaterialsId=${this.workOrderMaterialsId}`);
    }
    setEditArray: any = [];
    getAllWorkScpoes(value): void {
        this.setEditArray = [];
        if (this.isEdit == true) {
            this.subWorkOrderPartNumbers.partNumbers.forEach(element => {
                if (element.workOrderScopeId) {
                    this.setEditArray.push(element.workOrderScopeId)
                }
            });
            if (this.setEditArray && this.setEditArray.length == 0) {
                this.setEditArray.push(0);
            }
        } else {
            this.setEditArray.push(0);
        }
        const strText = '';
        this.commonService.autoSuggestionSmartDropDownList('WorkScope', 'WorkScopeId', 'WorkScopeCode', strText, true, 20, this.setEditArray.join()).subscribe(res => {
            this.workScopesList = res;
        });
    }

    selectedCondition1(value, currentRecord, index,) {
        this.conditionList.forEach(element => {
            if (element.value == value) {
                currentRecord.condition = element.label;
                this.subWorkOrderPartNumbers[index].condition = element.label;
            }
        });
        this.workOrderStatus();
    }

    subWorkOrderScopeId;
    dybamicworkFlowList = {};
    getWorkFlowByPNandScope(workOrderPart, index) {

        const { subWorkOrderScopeId } = workOrderPart;
        if ((workOrderPart.itemMasterId !== 0 && workOrderPart.itemMasterId !== null) && (subWorkOrderScopeId !== null && subWorkOrderScopeId !== 0)) {
            this.workOrderService.getWorkFlowByPNandScope(workOrderPart.itemMasterId, subWorkOrderScopeId).subscribe(res => {

                this.dybamicworkFlowList[index] = res.map(x => {
                    return {
                        label: x.workFlowNo,
                        value: x.workFlowId
                    }
                })
                console.log("this.dybamicworkFlowList", this.dybamicworkFlowList)
                if (this.dybamicworkFlowList[index] && this.dybamicworkFlowList[index].length > 0) {
                    workOrderPart.workflowId = this.dybamicworkFlowList[index][0].value;
                } else {
                    workOrderPart.workflowId = 0;
                }
            })
        }
        //need to change after functionality change
        this.getPartPublicationByItemMasterId(workOrderPart, workOrderPart.itemMasterId);

    }

    getConditionsList() {
        this.commonService.smartDropDownList('Condition', 'ConditionId', 'Description').subscribe(res => {
            this.conditionList = res;
        })
    }
    selectedCondition(value, currentRecord, index,) {
        this.conditionList.forEach(element => {
            if (element.value == value) {
                currentRecord.condition = element.label;
                this.subWorkOrderPartNumbers[index].condition = element.label;
            }
        });
        this.workOrderStatus();
    }
    selectedStage(value, currentRecord, index,) {
        this.workOrderStagesList.forEach(element => {
            if (element.workOrderStageId == value) {
                currentRecord.subWorkOrderStatusId = element.subWorkOrderStatusId;
                this.subWorkOrderPartNumbers[index].subWorkOrderStatusId = element.subWorkOrderStatusId;
            }
        });
        this.workOrderStatus();
    }
    workOrderStatus() {
        if (this.subWorkOrderPartNumbers && this.subWorkOrderPartNumbers.length != 0) {

            this.allValuesSame = this.subWorkOrderPartNumbers.every((val, i, arr) => val.subWorkOrderStatusId === arr[0].subWorkOrderStatusId);
        }
        if (this.allValuesSame) {
            this.statusId = this.subWorkOrderPartNumbers[0].subWorkOrderStatusId;
        } else {
            this.statusId = 1;
        }
        if (this.workOrderStatusList && this.workOrderStatusList.length > 0) {
            this.workOrderStatusList.forEach(element => {
                if (element.value == this.statusId) {
                    this.workOrderNumberStatus = element.label;
                }
            });
        } else {
            this.workOrderNumberStatus = 'Open';
        }
    }
    async getPartPublicationByItemMasterId(currentRecord, itemMasterId) {
        await this.workOrderService.getPartPublicationByItemMaster(itemMasterId).subscribe(res => {
            this.cmmList = res.map(x => {
                return {
                    value: x.publicationRecordId,
                    label: x.publicationId
                }
            });
            if (this.cmmList && this.cmmList.length > 0) {

                currentRecord.cmmId = this.cmmList[0].value;
            }
        })
    }
    priorityList: any = [];
    getAllPriority() {
        this.commonService.smartDropDownList('Priority', 'PriorityId', 'Description').subscribe(res => {
            this.priorityList = res;
        })
    }
    expertiseTypeList: any = [];
    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }
    getAllExpertiseType() {
        this.commonService.getExpertise(this.currentUserMasterCompanyId).subscribe(res => {

            this.expertiseTypeList = res.map(x => {
             
                if (x.empExpCode == 'TECHNICIAN') {
                    this.getExpertiseEmployeeByExpertiseId(x.employeeExpertiseId);
                    return;
                }
            });
        })
    }
    technicianByExpertiseTypeList: any = [];
    getExpertiseEmployeeByExpertiseId(value) {
        this.commonService.getExpertiseEmployeesByCategory(value).subscribe(res => {
            this.technicianByExpertiseTypeList = res;
            this.subWorkOrderPartNumbers.map((x, index) => {
                x.partTechnicianId = x.technicianId ? getObjectById('employeeId', x.technicianId, this.technicianByExpertiseTypeList) : null;
            })
        })
    }

    technicianList: any = [];
    filterTechnician(event) {
        this.technicianList = this.technicianByExpertiseTypeList;
        if (event.query !== undefined && event.query !== null) {
            const technician = [...this.technicianByExpertiseTypeList.filter(x => {
                return x.name.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.technicianList = technician;
        }
    }
    onSelectedTechnician(object, currentRecord) {

        if (object.employeeId != undefined && object.employeeId > 0) {
            this.commonService.getTechnicianStation(object.employeeId).subscribe(res => {
                currentRecord.techStationId = res.stationId;
            });
        }

    }
    techStationList: any = [];
    async getAllTecStations() {
        await this.commonService.smartDropDownList('EmployeeStation', 'EmployeeStationId', 'StationName').subscribe(res => {
            this.techStationList = res.map(x => {
                return {
                    ...x,
                    techStationId: x.value,
                    name: x.label
                }
            });
        })
    }
}