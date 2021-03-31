import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { CommonService } from '../../../../services/common.service';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { AuthService } from '../../../../services/auth.service';
import {   editValueAssignByCondition, getObjectById } from '../../../../generic/autocomplete';
import * as moment from 'moment';
import { SubWorkOrderPartNumber } from '../../../../models/sub-work-order-partnumber.model';
import { Location } from '@angular/common';
@Component({
    selector: 'app-sub-work-order',
    templateUrl: './work-order-subwo.component.html',
    styleUrls: ['./work-order-subwo.component.scss']
}) 
export class SubWorkOrderComponent implements OnInit {
    @Input() isView: boolean = false;
    @Input() subWorkOrderIdForView;
    @Input() workOrderIdForView;
    @Input() mpnIdForView;
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
    tearDownReportList: any;
    quantityValue:any=1;
    subWorkOrderPartNumbers: any;
    setEditArray: any = [];
    subWorkOrderScopeId;
    dybamicworkFlowList = {};
    priorityList: any = [];
    expertiseTypeList: any = [];
    technicianByExpertiseTypeList: any = [];
    technicianList: any = [];
    techStationList: any = [];
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
        console.log("sub work order id", this.subWorkOrderId)
        if(this.subWorkOrderIdForView){
            this.subWorkOrderId=this.subWorkOrderIdForView;
            this.workOrderId=this.workOrderIdForView;
            this.mpnId=this.mpnIdForView;
        }
        if (this.subWorkOrderId != 0) {
            this.isEdit = true;
            this.showTabsGrid = true;
            this.showGridMenu = true;
        }
        this.getAllExpertiseType(); 
        this.getSubWorkOrderEditData();
        this.getSubWorOrderMpns();


    }
    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    navigateToWo() {
        this.router.navigateByUrl(`workordersmodule/workorderspages/app-work-order-edit/${this.workOrderId}`)
    }
    getSubWorOrderMpns() {
        this.subWorkOrderPartNumbers = [];
        console.log("this.subWorkOrderId",this.subWorkOrderId)
        if (this.subWorkOrderId != 0) {
            this.workOrderService.getSubWorOrderMpnsById(this.subWorkOrderId).subscribe(res => {
                if (res && res.length == 0) {
                    this.activeGridUpdateButton = false;
                    // for add subworkorder to existing sub workorder 
                    if (this.addToExisting == 1) {
                        console.log("text 33")
                        this.subWorkOrderGridData();
                    }
                } else {
                    console.log("text 3355")
                    this.activeGridUpdateButton = true;
                    console.log("technision list", this.technicianByExpertiseTypeList);
                    res.map((x, index) => {
                        x.customerRequestDate = (x.customerRequestDate) ? new Date(x.customerRequestDate) : new Date();
                        x.estimatedCompletionDate = (x.customerRequestDate) ? new Date(x.estimatedCompletionDate) : new Date(x.customerRequestDate);
                        x.estimatedShipDate = (x.estimatedShipDate) ? new Date(x.estimatedShipDate) : new Date(x.customerRequestDate);
                        x.promisedDate = (x.promisedDate) ? new Date(x.promisedDate) : new Date(x.customerRequestDate);
                        x.createdDate = new Date(x.createdDate),
                            x.updatedDate = new Date(x.updatedDate)
                        x.partTechnicianId =   getObjectById('employeeId', x.technicianId, this.technicianByExpertiseTypeList)
                        // {name:x.technicianName,employeeId:x.technicianId}
                        this.getWorkFlowByPNandScope(x, index);
                    }) 

                    this.subWorkOrderPartNumbers = res;
                    console.log("exis44",this.subWorkOrderPartNumbers);
                    if (this.addToExisting == 1) {
                        console.log("existing sub work order")
                        this.subWorkOrderGridData();
                    } else {
                        if (this.subWorkOrderPartNumbers && this.subWorkOrderPartNumbers.length != 0) {
                            this.getAllWorkOrderStages();  
                            this.getAllWorkScpoes('');
                            this.getAllPriority('');
                     
                            this.getConditionsList();
                            this.getAllTecStations();
                        }
                    }
                }
            })
        }else{
            this.getAllWorkOrderStages();  
            this.getAllWorkScpoes('');
            this.getAllPriority(''); 
            this.getConditionsList();
            this.getAllTecStations();
        }
    }
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
            const mylength = res.quantity==0 ? 1 : res.quantity;
            for (let i = 0; i < mylength; i++) {
                // res.quantity = 1;
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
                this.getAllWorkOrderStages();  
                this.getAllWorkScpoes('');
                this.getAllPriority(''); 
                this.getConditionsList();
                this.getAllTecStations();
                if (this.addToExisting == NaN) {
                    this.subWorkOrderPartNumbers.map((x, index) => {
                        this.getWorkFlowByPNandScope(x, index);
                    })
                }
            }
        }, error => {

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
                x.technicianId=x.partTechnicianId.employeeId
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
        console.log("textfffs")
        if (this.workOrderId && this.mpnId) {
            this.workOrderService.getSubWorkOrderHeaderByWorkOrderId(this.workOrderId, this.mpnId).subscribe(res => {
                console.log("text gg")
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
        console.log("text 34443")
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
        this.allValuesSame = this.subWorkOrderGeneralInformation.partNumbers.every((val, i, arr) => val.workOrderStatusId === arr[0].workOrderStatusId);
        if (this.allValuesSame) {
            this.statusId = this.subWorkOrderGeneralInformation.partNumbers[0].workOrderStatusId;
            this.subWorkOrderGeneralInformation.workOrderStatusId = this.statusId;
        } else {
            this.statusId = 1;
            this.subWorkOrderGeneralInformation.workOrderStatusId = this.statusId;
        }
        if (this.workOrderStatusList && this.workOrderStatusList.length > 0) {
            this.workOrderStatusList.forEach(element => {
                if (element.value == this.statusId) {
                    this.workOrderNumberStatus = element.label;
                    this.subWorkOrderGeneralInformation.workOrderStatusId = this.statusId;
                }
            });
        } else {
            this.workOrderNumberStatus = 'Open';
            this.subWorkOrderGeneralInformation.workOrderStatusId = 1;
        }
    }
    updateURLParams() {
        window.history.replaceState({}, '', `/workordersmodule/workorderspages/app-sub-work-order?workorderid=${this.workOrderId}&mpnid=${this.mpnId}&subworkorderid=${this.subWorkOrderId}&workOrderMaterialsId=${this.workOrderMaterialsId}`);
    }
    getAllWorkScpoes(value): void {
        this.setEditArray = [];
        console.log("workscopw",this.subWorkOrderPartNumbers )
        if (this.isEdit == true) {
            if(this.subWorkOrderPartNumbers   && this.subWorkOrderPartNumbers.length !=0){
            this.subWorkOrderPartNumbers.forEach(element => {
                if (element.workOrderScopeId) {
                    this.setEditArray.push(element.workOrderScopeId)
                }
            });
        }
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
        this.getAllWorkScpoes('');
        this.workOrderStatus();
        this.getAllPriority('');
    }
    getConditionsList() {
        this.setEditArray = [];
        if (this.isEdit == true) {
            this.subWorkOrderPartNumbers.forEach(element => {
                if (element.conditionId) {
                    this.setEditArray.push(element.conditionId)
                }
            });
            if (this.setEditArray && this.setEditArray.length == 0) {
                this.setEditArray.push(0);
            }
        } else {
            this.setEditArray.push(0);
        }
        const strText = ''; 
        this.commonService.autoSuggestionSmartDropDownList('Condition', 'ConditionId', 'Description', strText, true, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
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
    workOrderStatus(): void {
        this.setEditArray = [];
        if (this.isEdit == true) {
            if(this.subWorkOrderPartNumbers  && this.subWorkOrderPartNumbers.length !=0){
            this.subWorkOrderPartNumbers.forEach(element => {
                if(element.workOrderStatusId){
                    this.setEditArray.push(element.workOrderStatusId)
                }
            });
        }
            if(this.setEditArray && this.setEditArray.length==0){
                this.setEditArray.push(0);  
            }
        } else {
            this.setEditArray.push(0); 
        }
        const strText ='';
        this.commonService.autoSuggestionSmartDropDownList('WorkOrderStatus', 'ID', 'Description', strText, true, 20, this.setEditArray.join()).subscribe(res => {
         this.workOrderStatusList = res.sort(function (a, b) { return a.value - b.value; });
        })
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
    getAllPriority(value) {
        this.setEditArray = [];
        if (this.isEdit == true) {
            if(this.subWorkOrderPartNumbers  && this.subWorkOrderPartNumbers.length !=0){
            this.subWorkOrderPartNumbers.forEach(element => {
                if (element.workOrderPriorityId) {
                    this.setEditArray.push(element.workOrderPriorityId)
                }
            });
        }
            if (this.setEditArray && this.setEditArray.length == 0) {
                this.setEditArray.push(0);
            }
        } else {
            this.setEditArray.push(0);
        }
        const strText = '';
        this.commonService.autoSuggestionSmartDropDownList('Priority', 'PriorityId', 'Description', strText, true, 20, this.setEditArray.join()).subscribe(res => {
            this.priorityList = res;
        })
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
    getExpertiseEmployeeByExpertiseId(value) {
        this.commonService.getExpertiseEmployeesByCategory(value).subscribe(res => {
            this.technicianByExpertiseTypeList = res;
            this.subWorkOrderPartNumbers.map((x, index) => {
                x.partTechnicianId = x.technicianId ? getObjectById('employeeId', x.technicianId, this.technicianByExpertiseTypeList) : null;
            })
        })
    }
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
    getAllTecStations() {
        this.setEditArray = [];
        console.log("edit mode",this.isEdit,this.subWorkOrderPartNumbers)
        debugger;
        if (this.isEdit == true) {
            if(this.subWorkOrderPartNumbers &&  this.subWorkOrderPartNumbers.length !=0){
            this.subWorkOrderPartNumbers.forEach(element => {
   this.setEditArray.push(element.techStationId)
            });
        }
            if (this.setEditArray && this.setEditArray.length == 0) {
                this.setEditArray.push(0);
            }
        } else {
            this.setEditArray.push(0);
        }
        const strText = '';
        this.commonService.autoSuggestionSmartDropDownList('EmployeeStation', 'EmployeeStationId', 'StationName', strText, true, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
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