import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
declare var $: any;
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { WorkOrderService } from '../../../../../services/work-order/work-order.service';
import { AlertService, MessageSeverity } from '../../../../../services/alert.service';
import { AuthService } from '../../../../../services/auth.service';
import { TearDown } from '../../../../../models/work-order-teardown.model';
import { editValueAssignByCondition, getObjectById, getValueByFieldFromArrayofObject } from '../../../../../generic/autocomplete';
import { CommonService } from '../../../../../services/common.service';
// import { validateRecordExistsOrNot, selectedValueValidate, getValueFromObjectByKey, getObjectById, getObjectByValue, editValueAssignByCondition, getValueFromArrayOfObjectById, getValueByFieldFromArrayofObject } from '../../../../../../../generic/autocomplete';
@Component({
    selector: 'app-common-teardown',
    templateUrl: 'common-teardown.component.html',
    styleUrls: ['common-teardown.component.scss']
})
export class CommonTeardownComponent implements OnInit {
    private onDestroy$: Subject<void> = new Subject<void>();
    startDate = new Date();
    minimumDate = new Date();
    tearDownReasonList: any[];
    saveTearDownData = { ...new TearDown() };
    createdDate = new Date();
    updatedDate = new Date()
    technicianOriginalList = [];
    inspectorsOriginalList = [];
    checkMandatoryFields: boolean = false;
    isSpinnerVisible: boolean = false;
    showViewTemplate: boolean = false;
    @Input() workOrderId;
    @Input() isEdit;
    @Input() jobTitles;
    @Input() workFlowWorkOrderId;
    @Input() getsaveTearDownData;
    @Input() tearDownReasons;
    @Input() isView: boolean = false;
    @Input() workOrderGeneralInformation: any = {};
    @Input() savedWorkOrderData: any;
    @Input() isSubWorkOrder: boolean = false;
    @Input() subWOPartNoId: any;
    @Input() subWorkOrderDetails: any;
    workFlowWorkOrderIdEdited: any;
    teadownTypesList: any;
    RemovalReasonsList: any;
    additionalComments: any;
    finalInspection: any;
    finalTest: any;
    bullitensAndModifications: any;
    testDataUsed: any;
    workPerformed: any;
    preAssemblyInspection: any;
    tearDownDescovery: any;
    preAssesmentResults: any;
    prelinnaryReview: any;
    woSettingsTeardownsList: any = [];
    arrayInsectorlist:any[] = [];
    arrayTechnicianlist:any[] = [];
    constructor(private workOrderService: WorkOrderService, private authService: AuthService,
        private alertService: AlertService, private commonService: CommonService,) {
    }

    ngOnInit(): void {
        
        this.getTeardownServicesList();
        this.getReasonsByChecked();

        // this.getTearDownReasons();
        //this.getTechnicianList();
       // this.getInspectiorsList();
       
        this.getTearDownListFromWOSettings();
        // console.log("viewData",this.getsaveTearDownData)
        if (this.getsaveTearDownData && this.getsaveTearDownData.length != 0 && this.getsaveTearDownData != undefined && this.getsaveTearDownData != null && this.getsaveTearDownData != '') {
            this.showViewTemplate = true;
            // console.log("view in ngonInt",this.showViewTemplate);
        }
    }

    getTearDownListFromWOSettings() {
        this.workOrderService.getTearDownTypesFromWOSettings(this.workOrderGeneralInformation['masterCompanyId'] ? this.workOrderGeneralInformation['masterCompanyId'] : this.authService.currentUser.masterCompanyId, this.workOrderGeneralInformation['workOrderTypeId'] ? this.workOrderGeneralInformation['workOrderTypeId'] : 1)
            .subscribe(
                res => {
                    if (res && res['result']) {
                        this.woSettingsTeardownsList = [];
                    }
                    else if (res) {
                        this.woSettingsTeardownsList = res;
                    }
                }
            )
    }

    checkForTeardownAvalabilityFromWO(name) {
        let result = false;
        this.woSettingsTeardownsList.forEach(
            x => {
                if (x['name'].toLowerCase() == name.toLowerCase()) {
                    result = true;
                }
            }
        )
        return result;
    }
    getReasonsByChecked() {
        if (this.getsaveTearDownData) {
            if (this.getsaveTearDownData.isRemovalReasons) {
                this.worOrderTearDownReasonListById(1);
            } 
         if (this.getsaveTearDownData.isPmaDerBulletins) {
                this.worOrderTearDownReasonListById(2);
            }  if (this.getsaveTearDownData.isPreliinaryReview) {
                this.worOrderTearDownReasonListById(3);
            }  if (this.getsaveTearDownData.isPreAssmentResults) {
                this.worOrderTearDownReasonListById(4);
            }  if (this.getsaveTearDownData.isDiscovery) {
                this.worOrderTearDownReasonListById(5);
            }  if (this.getsaveTearDownData.isPreAssemblyInspection) {
                this.worOrderTearDownReasonListById(6);
            }  if (this.getsaveTearDownData.isWorkPerformed) {
                this.worOrderTearDownReasonListById(7);
            }  if (this.getsaveTearDownData.isTestDataUsed) {
                this.worOrderTearDownReasonListById(8);
            }  if (this.getsaveTearDownData.isBulletinsModification) {
                this.worOrderTearDownReasonListById(9);
            } if (this.getsaveTearDownData.isFinalTest) {
                this.worOrderTearDownReasonListById(10);
            } if (this.getsaveTearDownData.isFinalInspection) {
                this.worOrderTearDownReasonListById(11);
            } if (this.getsaveTearDownData.isAdditionalComments) {
                this.worOrderTearDownReasonListById(12);
            } 
            // {
            //     this.worOrderTearDownReasonListById(1);
            // }
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        // console.log(this.workOrderGeneralInformation)
        // console.log("chnages",changes);
        //this.technicianList = this.technicianOriginalList;
        //this.inspectionList = this.inspectorsOriginalList;  
        if (this.getsaveTearDownData && this.getsaveTearDownData.length != 0 && this.getsaveTearDownData != null) {
            this.showViewTemplate = true;
          var iscall= false;  
        

        const TechnicianId = getValueByFieldFromArrayofObject('jobTitle', 'Technician', this.jobTitles);
        if (TechnicianId !== undefined) 
        {
            if(this.arrayTechnicianlist.length == 0) 
            {	
                if(this.getsaveTearDownData.workOrderPreAssmentResults.technicianId != null)
                {
                    if(this.getsaveTearDownData.workOrderPreAssmentResults.technicianId.employeeId != null)
                    {
                        iscall= true;
                       this.arrayTechnicianlist.push(this.getsaveTearDownData.workOrderPreAssmentResults.technicianId.employeeId);
                    }else
                    {
                        this.arrayTechnicianlist.push(this.getsaveTearDownData.workOrderPreAssmentResults.technicianId);
                    }
                    
                }
                if(this.getsaveTearDownData.workOrderDiscovery.technicianId != null && this.getsaveTearDownData.workOrderDiscovery.technicianId.employeeId != null)
                {
                    if(this.getsaveTearDownData.workOrderDiscovery.technicianId.employeeId != null)
                    {
                        iscall= true;
                       this.arrayTechnicianlist.push(this.getsaveTearDownData.workOrderDiscovery.technicianId.employeeId);
                    }else
                    { 
                        this.arrayTechnicianlist.push(this.getsaveTearDownData.workOrderDiscovery.technicianId);
                    }
                }
                if(this.getsaveTearDownData.workOrderPreAssemblyInspection.technicianId != null)
                {
                    if(this.getsaveTearDownData.workOrderPreAssemblyInspection.technicianId.employeeId != null)
                    { iscall= true;
                       this.arrayTechnicianlist.push(this.getsaveTearDownData.workOrderPreAssemblyInspection.technicianId.employeeId);
                    }else
                    {
                        this.arrayTechnicianlist.push(this.getsaveTearDownData.workOrderPreAssemblyInspection.technicianId);
                    }
                }
                if(this.getsaveTearDownData.workOrderWorkPerformed.technicianId != null)
                {
                    if(this.getsaveTearDownData.workOrderWorkPerformed.technicianId.employeeId != null)
                    { iscall= true;
                       this.arrayTechnicianlist.push(this.getsaveTearDownData.workOrderWorkPerformed.technicianId.employeeId);
                    }else
                    {
                        this.arrayTechnicianlist.push(this.getsaveTearDownData.workOrderWorkPerformed.technicianId);
                    }
                }
                if(this.getsaveTearDownData.workOrderFinalTest.technicianId != null)
                {
                    if(this.getsaveTearDownData.workOrderFinalTest.technicianId.employeeId != null)
                    { iscall= true;
                       this.arrayTechnicianlist.push(this.getsaveTearDownData.workOrderFinalTest.technicianId.employeeId);
                    }else
                    { 
                        this.arrayTechnicianlist.push(this.getsaveTearDownData.workOrderFinalTest.technicianId);
                    }
                }		
            }	
                 this.commonService.autoCompleteDropdownsEmployeeByJobTitle('',TechnicianId[0].jobTitleId, 20,this.arrayTechnicianlist.join(), this.currentUserManagementStructureId).subscribe(res => {
                    this.technicianOriginalList = res; 
                    this.technicianList = this.technicianOriginalList;
                }, error => error => this.saveFailedHelper(error))
        }

        const id = getValueByFieldFromArrayofObject('jobTitle', 'Inspector', this.jobTitles);
        if (id !== undefined) 
        {
            if(this.arrayInsectorlist.length == 0) 
            {	
                if(this.getsaveTearDownData.workOrderPreAssmentResults.inspectorId != null)	
                {
                    if(this.getsaveTearDownData.workOrderPreAssmentResults.inspectorId.employeeId != null)
                    { iscall= true;
                       this.arrayInsectorlist.push(this.getsaveTearDownData.workOrderPreAssmentResults.inspectorId.employeeId);
                    }else
                    { 
                        this.arrayInsectorlist.push(this.getsaveTearDownData.workOrderPreAssmentResults.inspectorId);
                    }
                   
                }
                if(this.getsaveTearDownData.workOrderDiscovery.inspectorId != null)	
                {
                     if(this.getsaveTearDownData.workOrderDiscovery.inspectorId.employeeId != null)
                     { iscall= true;
                        this.arrayInsectorlist.push(this.getsaveTearDownData.workOrderDiscovery.inspectorId.employeeId);
                     }else
                     { 
                        this.arrayInsectorlist.push(this.getsaveTearDownData.workOrderDiscovery.inspectorId );
                     }
 
                }
                if(this.getsaveTearDownData.workOrderPreAssemblyInspection.inspectorId != null )	
                {
                    if(this.getsaveTearDownData.workOrderPreAssemblyInspection.inspectorId.employeeId != null)
                    { iscall= true;
                       this.arrayInsectorlist.push(this.getsaveTearDownData.workOrderPreAssemblyInspection.inspectorId.employeeId);
                    }else
                    {
                        this.arrayInsectorlist.push(this.getsaveTearDownData.workOrderPreAssemblyInspection.inspectorId);
                    }
                }
                if(this.getsaveTearDownData.workOrderWorkPerformed.inspectorId != null)	
                {
                    if(this.getsaveTearDownData.workOrderWorkPerformed.inspectorId.employeeId != null)
                    { iscall= true;
                       this.arrayInsectorlist.push(this.getsaveTearDownData.workOrderWorkPerformed.inspectorId.employeeId);
                    }else
                    {
                        this.arrayInsectorlist.push(this.getsaveTearDownData.workOrderWorkPerformed.inspectorId);
                    }
                }
                if(this.getsaveTearDownData.workOrderFinalTest.inspectorId != null)	
                {
                    if(this.getsaveTearDownData.workOrderFinalTest.inspectorId.employeeId != null)
                    { iscall= true;
                       this.arrayInsectorlist.push(this.getsaveTearDownData.workOrderFinalTest.inspectorId.employeeId);
                    }else
                    { 
                        this.arrayInsectorlist.push(this.getsaveTearDownData.workOrderFinalTest.inspectorId);
                    }
                }
                if(this.getsaveTearDownData.workOrderFinalInspection.inspectorId != null)	
                {
                    if(this.getsaveTearDownData.workOrderFinalInspection.inspectorId.employeeId != null)
                    {iscall= true;
                       this.arrayInsectorlist.push(this.getsaveTearDownData.workOrderFinalInspection.inspectorId.employeeId);
                    }else
                    {
                        this.arrayInsectorlist.push(this.getsaveTearDownData.workOrderFinalInspection.inspectorId);
                    }
                }
                if(this.getsaveTearDownData.workOrderPreliinaryReview.inspectorId != null)	
                {
                    if(this.getsaveTearDownData.workOrderPreliinaryReview.inspectorId.employeeId != null)
                    {iscall= true;
                       this.arrayInsectorlist.push(this.getsaveTearDownData.workOrderPreliinaryReview.inspectorId.employeeId);
                    }else
                    {
                        this.arrayInsectorlist.push(this.getsaveTearDownData.workOrderPreliinaryReview.inspectorId);
                    }
                }	
            }	
                 this.commonService.autoCompleteDropdownsEmployeeByJobTitle('',id[0].jobTitleId, 20,this.arrayInsectorlist.join(), this.currentUserManagementStructureId).subscribe(res => {
                    this.inspectorsOriginalList = res; 
                    this.inspectionList = this.inspectorsOriginalList; 
                    if(!iscall) 
                    {
                        this.assignDatatoFields(this.getsaveTearDownData);  
                    }
                    
                }, error => error => this.saveFailedHelper(error))
        }

            this.getReasonsByChecked();
           
        } else {
            this.saveTearDownData = { ...new TearDown() };
            this.autoCompleteDropdownsEmployeeByJobTitleInspector('');
            this.autoCompleteDropdownsEmployeeByJobTitleTechnician('');
            this.showViewTemplate = false;
        }
    }
    ngOnDestroy(): void {
    }

    ExpandAllCustomerDetailsModelEdit() {
        $('#stepadd1').collapse('show');
        $('#stepadd2').collapse('show');
        $('#stepadd3').collapse('show');
        $('#stepadd4').collapse('show');
        $('#stepadd5').collapse('show');
        $('#stepadd6').collapse('show');
        $('#stepadd7').collapse('show');
        $('#stepadd8').collapse('show');
        $('#stepadd9').collapse('show');
        $('#stepadd10').collapse('show');
        $('#stepadd11').collapse('show');
        $('#stepadd12').collapse('show');
    }
    CloseAllCustomerDetailsModelEdit() {
        $('#stepadd1').collapse('hide');
        $('#stepadd2').collapse('hide');
        $('#stepadd3').collapse('hide');
        $('#stepadd4').collapse('hide');
        $('#stepadd5').collapse('hide');
        $('#stepadd6').collapse('hide');
        $('#stepadd7').collapse('hide');
        $('#stepadd8').collapse('hide');
        $('#stepadd9').collapse('hide');
        $('#stepadd10').collapse('hide');
        $('#stepadd11').collapse('hide');
        $('#stepadd12').collapse('hide');
    }

    // getInspectiorsList() {
    //     const id = getValueByFieldFromArrayofObject('jobTitle', 'Inspector', this.jobTitles);
    //     if (id !== undefined) {
    //         this.commonService.getEmployeesByCategory(id[0].jobTitleId).subscribe(res => {
    //             this.inspectorsOriginalList = res;
    //             // console.log("inspector", res);
    //         })
    //     }
    // }
    // getTechnicianList() {
    //     const id = getValueByFieldFromArrayofObject('jobTitle', 'Technician', this.jobTitles);
    //     if (id !== undefined) {
    //         this.commonService.getEmployeesByCategory(id[0].jobTitleId).subscribe(res => {
    //             this.technicianOriginalList = res;
    //             // console.log("Technician", res);
    //         })
    //     }
    // }
    async autoCompleteDropdownsEmployeeByJobTitleInspector(serachtext:string) {

        const id = getValueByFieldFromArrayofObject('jobTitle', 'Inspector', this.jobTitles);
        if (id !== undefined) 
        {
            // if(this.arrayInsectorlist.length == 0) {			
            //     this.arrayInsectorlist.push(0); 
            // }	
                await this.commonService.autoCompleteDropdownsEmployeeByJobTitle(serachtext,id[0].jobTitleId, 20,this.arrayInsectorlist.join(), this.currentUserManagementStructureId).subscribe(res => {
                    this.inspectorsOriginalList = res; 
                    this.inspectionList = this.inspectorsOriginalList;           
                }, error => error => this.saveFailedHelper(error))
        }
		
	}
    async autoCompleteDropdownsEmployeeByJobTitleTechnician(serachtext:string) {

        const id = getValueByFieldFromArrayofObject('jobTitle', 'Technician', this.jobTitles);
        if (id !== undefined) 
        {
            // if(this.arrayTechnicianlist.length == 0) {			
            //     this.arrayTechnicianlist.push(0); 
            // }	
                await this.commonService.autoCompleteDropdownsEmployeeByJobTitle(serachtext,id[0].jobTitleId, 20,this.arrayTechnicianlist.join(), this.currentUserManagementStructureId).subscribe(res => {
                    this.technicianOriginalList = res; 
                    this.technicianList = this.technicianOriginalList;           
                }, error => error => this.saveFailedHelper(error))
        }
		
	}
    get currentUserManagementStructureId(): number {
        return this.authService.currentUser
          ? this.authService.currentUser.managementStructureId
          : null;
      }
    private saveFailedHelper(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }
    // getTearDownReasons(): void {
    //     this.commonService.smartDropDownList('TeardownReason', 'TeardownReasonId', 'Reason').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
    //         this.tearDownReasonList = res;
    //         console.log("reasons list", res);
    //     })
    // }
    getTeardownServicesList() {
        this.commonService.smartDropDownList('TeardownType', 'TeardownTypeId', 'Name').subscribe(res => {
            // console.log("tearodown types list",res);
            this.teadownTypesList = res.map(x => {
                return {
                    ...x,
                    teardownTypeId: x.value,
                    name: x.label
                }
            });
            //   console.log("this.teardownList",this.teadownTypesList);
        })
    }
    worOrderTearDownReasonListById(id) {

        this.workOrderService.worOrderTearDownReasonListById(id).subscribe(res => {
            this.deStructureReasonsData(id, res);
        })
    }
    deStructureReasonsData(id, data) {
        const dataForReasons = data.map(x => {
            return {
                ...x,
                value: x.teardownReasonId,
                label: x.reason
            }
        });
        if (id === 1) {
            this.RemovalReasonsList = dataForReasons;
        } else if (id == 3) {
            this.prelinnaryReview = dataForReasons
        } else if (id == 4) {
            this.preAssesmentResults = dataForReasons
        } else if (id == 5) {
            this.tearDownDescovery = dataForReasons
        } else if (id == 6) {
            this.preAssemblyInspection = dataForReasons
        } else if (id == 7) {
            this.workPerformed = dataForReasons
        } else if (id == 8) {
            this.testDataUsed = dataForReasons
        } else if (id == 9) {
            this.bullitensAndModifications = dataForReasons
        } else if (id == 10) {
            this.finalTest = dataForReasons
        } else if (id == 11) {
            this.finalInspection = dataForReasons
        } else if (id == 12) {
            this.additionalComments = dataForReasons
        }
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    getUpdatedvalue(event) {
    }
    onSelectedTechnician(object) {
    }
    technicianList: any = [];
    inspectionList: any = [];
    // filterTWTechnician(event) {
    //     this.technicianList = this.technicianOriginalList;
    //     if (event.query !== undefined && event.query !== null) {
    //         const technician = [...this.technicianOriginalList.filter(x => {
    //             return x.name.toLowerCase().includes(event.query.toLowerCase())
    //         })]
    //         this.technicianList = technician;
    //     }
    // }
    filterTWTechnician(event) {
        if (event.query !== undefined && event.query !== null) {
            this.autoCompleteDropdownsEmployeeByJobTitleTechnician(event.query);
        }
    }
    filterTWInspections(event) {
        if (event.query !== undefined && event.query !== null) {
            this.autoCompleteDropdownsEmployeeByJobTitleInspector(event.query);
        }
    }
    // filterTWInspections(event) {
    //     this.inspectionList = this.inspectorsOriginalList;
    //     if (event.query !== undefined && event.query !== null) {
    //         const technician1 = [...this.inspectorsOriginalList.filter(x => {
    //             return x.name.toLowerCase().includes(event.query.toLowerCase())
    //         })]
    //         this.inspectionList = technician1;
    //     }
    // }
    TearDownReasons: any;
    selectedReason(value, type) {
        // console.log("value",value)
        if (value != 0) {
            this.workOrderService.getteardownreasonbyidData(value).subscribe(res => {
                this.TearDownReasons = res;
                if (this.TearDownReasons) {
                    if (type == 1) {
                        this.saveTearDownData.workOrderRemovalReasons.memo = this.TearDownReasons.memo;
                    } else if (type == 2) {
                        this.saveTearDownData.workOrderPreliinaryReview.memo = this.TearDownReasons.memo;
                    } else if (type == 3) {
                        this.saveTearDownData.workOrderPreAssmentResults.memo = this.TearDownReasons.memo;
                    } else if (type == 4) {
                        this.saveTearDownData.workOrderDiscovery.memo = this.TearDownReasons.memo;
                    } else if (type == 5) {
                        this.saveTearDownData.workOrderPreAssemblyInspection.memo = this.TearDownReasons.memo;
                    } else if (type == 6) {
                        this.saveTearDownData.workOrderWorkPerformed.memo = this.TearDownReasons.memo;
                    } else if (type == 7) {
                        this.saveTearDownData.workOrderTestDataUsed.memo = this.TearDownReasons.memo;
                    } else if (type == 8) {
                        this.saveTearDownData.workOrderBulletinsModification.memo = this.TearDownReasons.memo;
                    } else if (type == 9) {
                        this.saveTearDownData.workOrderFinalTest.memo = this.TearDownReasons.memo;
                    } else if (type == 10) {
                        this.saveTearDownData.workOrderFinalInspection.memo = this.TearDownReasons.memo;
                    } else if (type == 11) {
                        this.saveTearDownData.workOrderAdditionalComments.memo = this.TearDownReasons.memo;
                    }
                }
            })
        }
    }
    tearDownView() {
        this.isView = true;
        this.workFlowWorkOrderId = this.workFlowWorkOrderId
        // console.log("this is true",this.workFlowWorkOrderId);
    }
    checkValue(event, source, type) {
        // console.log("event check value",event,source, type);
        if (event.target.checked && type != 2) {
            this.worOrderTearDownReasonListById(type);
        }
        if (type == 1) {
            source.reasonId = 0;
            source.memo = '';
            // this.saveTearDownData.isRemovalReasons=true;
        } else if (type == 2) {
            source.airworthinessDirecetives = '';
            source.mandatoryService = '';
            source.requestedService = '';
            source.serviceLetters = '';
            source.pmaParts = '';
            source.derRepairs = '';
        } else if (type == 3) {
            source.memo = '';
            source.reasonId = 0;
            source.inspectorId = 0;
            source.inspectorDate = new Date();
        }
        else if (type == 4) {
            source.reasonId = 0;
            source.memo = '';
            source.technicianId = 0;
            source.inspectorId = 0;
            source.technicianDate = new Date();
        } else if (type == 5) {

            source.reasonId = 0;
            source.memo = '';
            source.technicianId = 0;
            source.technicianDate = new Date();
            source.inspectorId = 0;
            source.inspectorDate = new Date();
        }
        else if (type == 6) {
            source.memo = '';
            source.reasonId = 0;
            source.technicianId = 0;
            source.technicianDate = new Date();
            source.inspectorId = 0;
            source.inspectorDate = new Date();
        } else if (type == 7) {
            source.reasonId = 0;
            source.memo = '';
            source.technicianId = 0;
            source.technicianDate = new Date();
            source.inspectorId = 0;
            source.inspectorDate = new Date();
        }
        else if (type == 8) {
            source.reasonId = 0;
            source.memo = '';
        } else if (type == 9) {
            source.reasonId = 0;
            source.memo = '';
        } else if (type == 10) {
            source.reasonId = 0;
            source.memo = '';
            source.technicianId = 0;
            source.technicianDate = new Date();
            source.inspectorId = 0;
            source.inspectorDate = new Date();
        } else if (type == 11) {
            source.reasonId = 0;
            source.memo = '';
            source.inspectorId = 0;
            source.inspectorDate = new Date();
        }
        else if (type == 12) {
            source.reasonId = 0;
            source.memo = '';
        }
    }
    createTearDownData(form: NgForm) {
        // console.log("save form",form.valid);
        this.saveTearDownData = {
            ...this.saveTearDownData,
            workOrderId: this.workOrderId,
            workFlowWorkOrderId: this.workFlowWorkOrderId,
            updatedDate: this.updatedDate,
            createdBy: this.userName,
            updatedBy: this.userName,

        }
        this.saveTearDownData.workOrderPreAssmentResults.technicianId = editValueAssignByCondition('employeeId', this.saveTearDownData.workOrderPreAssmentResults.technicianId);
        this.saveTearDownData.workOrderPreAssmentResults.inspectorId = editValueAssignByCondition('employeeId', this.saveTearDownData.workOrderPreAssmentResults.inspectorId);
        this.saveTearDownData.workOrderDiscovery.technicianId = editValueAssignByCondition('employeeId', this.saveTearDownData.workOrderDiscovery.technicianId);
        this.saveTearDownData.workOrderDiscovery.inspectorId = editValueAssignByCondition('employeeId', this.saveTearDownData.workOrderDiscovery.inspectorId);
        this.saveTearDownData.workOrderPreAssemblyInspection.technicianId = editValueAssignByCondition('employeeId', this.saveTearDownData.workOrderPreAssemblyInspection.technicianId);
        this.saveTearDownData.workOrderPreAssemblyInspection.inspectorId = editValueAssignByCondition('employeeId', this.saveTearDownData.workOrderPreAssemblyInspection.inspectorId);
        this.saveTearDownData.workOrderWorkPerformed.technicianId = editValueAssignByCondition('employeeId', this.saveTearDownData.workOrderWorkPerformed.technicianId);
        this.saveTearDownData.workOrderWorkPerformed.inspectorId = editValueAssignByCondition('employeeId', this.saveTearDownData.workOrderWorkPerformed.inspectorId);
        this.saveTearDownData.workOrderFinalTest.technicianId = editValueAssignByCondition('employeeId', this.saveTearDownData.workOrderFinalTest.technicianId);
        this.saveTearDownData.workOrderFinalTest.inspectorId = editValueAssignByCondition('employeeId', this.saveTearDownData.workOrderFinalTest.inspectorId);
        this.saveTearDownData.workOrderFinalInspection.inspectorId = editValueAssignByCondition('employeeId', this.saveTearDownData.workOrderFinalInspection.inspectorId);
        this.saveTearDownData.workOrderPreliinaryReview.inspectorId = editValueAssignByCondition('employeeId', this.saveTearDownData.workOrderPreliinaryReview.inspectorId);
        const data = this.saveTearDownData;
        if (this.isSubWorkOrder == true) {
            //  console.log("sub Data",this.subWorkOrderDetails)
            this.saveTearDownData.subWOPartNoId = this.subWOPartNoId,
                this.saveTearDownData.subWorkOrderId = this.subWorkOrderDetails.subWorkOrderId;
            this.saveTearDownData.workOrderId = this.subWorkOrderDetails.workOrderId;
        }
        // if (form.validation) {
        // alert("service success")

        // }
        // console.log("tear down saved data",this.saveTearDownData)
        if (this.saveTearDownData.isRemovalReasons == true && (this.saveTearDownData.workOrderRemovalReasons.memo == '' || this.saveTearDownData.workOrderRemovalReasons.reasonId == 0)) {
            this.checkMandatoryFields = true;
            // console.log("alert 1")
            return this.validator();
        } else if (this.saveTearDownData.isPmaDerBulletins == true && (this.saveTearDownData.workOrderPmaDerBulletins.airworthinessDirecetives == '' || this.saveTearDownData.workOrderPmaDerBulletins.mandatoryService == '' || this.saveTearDownData.workOrderPmaDerBulletins.requestedService == '' || this.saveTearDownData.workOrderPmaDerBulletins.serviceLetters == '' || this.saveTearDownData.workOrderPmaDerBulletins.pmaParts == '' || this.saveTearDownData.workOrderPmaDerBulletins.derRepairs == '')) {
            this.checkMandatoryFields = true;
            // console.log("alert 2")
            return this.validator();
        } else if (this.saveTearDownData.isPreliinaryReview == true && (this.saveTearDownData.workOrderPreliinaryReview.memo == '' || this.saveTearDownData.workOrderPreliinaryReview.reasonId == 0 || this.saveTearDownData.workOrderPreliinaryReview.inspectorId == 0)) {
            this.checkMandatoryFields = true;
            // console.log("alert 3")
            return this.validator();
        } else if (this.saveTearDownData.isPreAssmentResults == true && (this.saveTearDownData.workOrderPreAssmentResults.memo == '' || this.saveTearDownData.workOrderPreAssmentResults.reasonId == 0 || this.saveTearDownData.workOrderPreAssmentResults.technicianId == 0 || this.saveTearDownData.workOrderPreAssmentResults.inspectorId == 0)) {
            this.checkMandatoryFields = true;
            // console.log("alert 4")
            return this.validator();
        } else if (this.saveTearDownData.isDiscovery == true && (this.saveTearDownData.workOrderDiscovery.memo == '' || this.saveTearDownData.workOrderDiscovery.reasonId == 0 || this.saveTearDownData.workOrderDiscovery.technicianId == 0 || this.saveTearDownData.workOrderDiscovery.inspectorId == 0)) {
            this.checkMandatoryFields = true;
            // console.log("alert 5")
            return this.validator();
        } else if (this.saveTearDownData.isPreAssemblyInspection == true && (this.saveTearDownData.workOrderPreAssemblyInspection.memo == '' || this.saveTearDownData.workOrderPreAssemblyInspection.reasonId == 0 || this.saveTearDownData.workOrderPreAssemblyInspection.technicianId == 0 || this.saveTearDownData.workOrderPreAssemblyInspection.inspectorId == 0)) {
            // console.log("alert 6")
            this.checkMandatoryFields = true;
            return this.validator();
        }
        else if (this.saveTearDownData.isWorkPerformed == true && (this.saveTearDownData.workOrderWorkPerformed.memo == '' || this.saveTearDownData.workOrderWorkPerformed.reasonId == 0 || this.saveTearDownData.workOrderWorkPerformed.technicianId == 0 || this.saveTearDownData.workOrderWorkPerformed.inspectorId == 0)) {
            // this.checkMandatoryFields=true;
            // console.log("alert 7")
            return this.validator();
        } else if (this.saveTearDownData.isTestDataUsed == true && (this.saveTearDownData.workOrderTestDataUsed.memo == '' || this.saveTearDownData.workOrderTestDataUsed.reasonId == 0)) {
            this.checkMandatoryFields = true;
            // console.log("alert 8")
            return this.validator();
        } else if (this.saveTearDownData.isBulletinsModification == true && (this.saveTearDownData.workOrderBulletinsModification.memo == '' || this.saveTearDownData.workOrderBulletinsModification.reasonId == 0)) {
            this.checkMandatoryFields = true;
            // console.log("alert 9")
            return this.validator();
        } else if (this.saveTearDownData.isFinalTest == true && (this.saveTearDownData.workOrderFinalTest.memo == '' || this.saveTearDownData.workOrderFinalTest.reasonId == 0 || this.saveTearDownData.workOrderFinalTest.technicianId == 0 || this.saveTearDownData.workOrderFinalTest.inspectorId == 0)) {
            this.checkMandatoryFields = true;
            // console.log("alert 10")
            return this.validator();
        } else if (this.saveTearDownData.isFinalInspection == true && (this.saveTearDownData.workOrderFinalInspection.memo == '' || this.saveTearDownData.workOrderFinalInspection.reasonId == 0)) {
            this.checkMandatoryFields = true;
            // console.log("alert 11")
            return this.validator();
        } else if (this.saveTearDownData.isAdditionalComments == true && (this.saveTearDownData.workOrderAdditionalComments.memo == '' || this.saveTearDownData.workOrderAdditionalComments.reasonId == 0)) {
            this.checkMandatoryFields = true;
            // console.log("alert 12")
            return this.validator();
        }
        this.isSpinnerVisible = true;
        this.workOrderService.createworkOrderTearDownData(data, this.isSubWorkOrder).subscribe(res => {
            this.saveTearDownData = res;
            this.isSpinnerVisible = false;
            this.showViewTemplate = true;
            this.assignDatatoFields(this.saveTearDownData);
            this.alertService.showMessage(
                '', ' WorkOrder TearDown saved Successfully',
                MessageSeverity.success
            );
        }, err => {
            this.isSpinnerVisible = false;
        })
    }
    validator() {
        this.alertService.showMessage(
            'Alert', ' Please Add Mandatory Fields',
            MessageSeverity.success
        );
        return;
    }

    assignDatatoFields(data) {
        if (data) {
            
            data.workOrderPreliinaryReview.inspectorDate = data.workOrderPreliinaryReview.inspectorDate ? new Date(data.workOrderPreliinaryReview.inspectorDate) : null;
            data.workOrderPreAssmentResults.technicianDate = data.workOrderPreAssmentResults.technicianDate ? new Date(data.workOrderPreAssmentResults.technicianDate) : null;
            data.workOrderPreAssmentResults.inspectorDate = data.workOrderPreAssmentResults.inspectorDate ? new Date(data.workOrderPreAssmentResults.inspectorDate) : null;
            data.workOrderDiscovery.technicianDate = data.workOrderDiscovery.technicianDate ? new Date(data.workOrderDiscovery.technicianDate) : null;
            data.workOrderDiscovery.inspectorDate = data.workOrderDiscovery.inspectorDate ? new Date(data.workOrderDiscovery.inspectorDate) : null;
            data.workOrderPreAssemblyInspection.technicianDate = data.workOrderPreAssemblyInspection.technicianDate ? new Date(data.workOrderPreAssemblyInspection.technicianDate) : null;
            data.workOrderPreAssemblyInspection.inspectorDate = data.workOrderPreAssemblyInspection.inspectorDate ? new Date(data.workOrderPreAssemblyInspection.inspectorDate) : null;
            data.workOrderWorkPerformed.technicianDate = data.workOrderWorkPerformed.technicianDate ? new Date(data.workOrderWorkPerformed.technicianDate) : null;
            data.workOrderWorkPerformed.inspectorDate = data.workOrderWorkPerformed.inspectorDate ? new Date(data.workOrderWorkPerformed.inspectorDate) : null;
            data.workOrderFinalTest.technicianDate = data.workOrderFinalTest.technicianDate ? new Date(data.workOrderFinalTest.technicianDate) : null;
            data.workOrderFinalTest.inspectorDate = data.workOrderFinalTest.inspectorDate ? new Date(data.workOrderFinalTest.inspectorDate) : null;
            data.workOrderFinalInspection.inspectorDate = data.workOrderFinalInspection.inspectorDate ? new Date(data.workOrderFinalInspection.inspectorDate) : null;
            if (data.workOrderPreAssmentResults != null) {
                data.workOrderPreAssmentResults.technicianId = getObjectById('employeeId', data.workOrderPreAssmentResults.technicianId, this.technicianOriginalList);
                data.workOrderPreAssmentResults.inspectorId = getObjectById('employeeId', data.workOrderPreAssmentResults.inspectorId, this.inspectorsOriginalList);
            }
            if (data.workOrderDiscovery != null) {
                data.workOrderDiscovery.technicianId = getObjectById('employeeId', data.workOrderDiscovery.technicianId, this.technicianOriginalList);
                data.workOrderDiscovery.inspectorId = getObjectById('employeeId', data.workOrderDiscovery.inspectorId, this.inspectorsOriginalList);
            }
            if (data.workOrderPreAssemblyInspection != null) {
                data.workOrderPreAssemblyInspection.technicianId = getObjectById('employeeId', data.workOrderPreAssemblyInspection.technicianId, this.technicianOriginalList);
                data.workOrderPreAssemblyInspection.inspectorId = getObjectById('employeeId', data.workOrderPreAssemblyInspection.inspectorId, this.inspectorsOriginalList);
            }
            if (data.workOrderWorkPerformed != null) {
                data.workOrderWorkPerformed.technicianId = getObjectById('employeeId', data.workOrderWorkPerformed.technicianId, this.technicianOriginalList);
                data.workOrderWorkPerformed.inspectorId = getObjectById('employeeId', data.workOrderWorkPerformed.inspectorId, this.inspectorsOriginalList);
            }
            if (data.workOrderFinalTest != null) {
                data.workOrderFinalTest.technicianId = getObjectById('employeeId', data.workOrderFinalTest.technicianId, this.technicianOriginalList);
                data.workOrderFinalTest.inspectorId = getObjectById('employeeId', data.workOrderFinalTest.inspectorId, this.inspectorsOriginalList);
            }
            if (data.workOrderFinalInspection != null) {
                data.workOrderFinalInspection.inspectorId = getObjectById('employeeId', data.workOrderFinalInspection.inspectorId, this.inspectorsOriginalList);
            }
            if (data.workOrderPreliinaryReview != null) {
                //data.workOrderPreliinaryReview.inspector = 'reddt123-67 reddt123';
                data.workOrderPreliinaryReview.inspectorId = getObjectById('employeeId', data.workOrderPreliinaryReview.inspectorId, this.inspectorsOriginalList);
            }
            this.saveTearDownData = data;
        }
    }
}
