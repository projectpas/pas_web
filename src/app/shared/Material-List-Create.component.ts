import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from "@angular/core";
import { IWorkFlow } from "../Workflow/WorkFlow";
import { ActionService } from "../Workflow/ActionService";
import { ItemClassificationService } from "../services/item-classfication.service";
import { UnitOfMeasureService } from "../services/unitofmeasure.service";
import { AlertService, MessageSeverity } from "../services/alert.service";
import { WorkOrderQuoteService } from "../services/work-order/work-order-quote.service";
import { NgForm } from "@angular/forms";
declare var $: any;
import * as cloneDeep from 'lodash/cloneDeep';
import { CommonService } from "../services/common.service";
import { formatNumberAsGlobalSettingsModule } from "../generic/autocomplete";
import { MasterComapnyService } from "../services/mastercompany.service";
import { ATASubChapter } from "../models/atasubchapter.model";
import { AuthService } from "../services/auth.service";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkOrderService } from "../services/work-order/work-order.service";
import { any } from "underscore";
@Component({
    selector: 'grd-material',
    templateUrl: './Material-List-Create.component.html',
    styleUrls: ['./Material-List-Create.component.css']
})
export class MaterialListCreateComponent implements OnInit, OnChanges {
    @Input() workFlowObject;
    partCollection: any[] = [];
    itemclaColl: any[] = [];
    allPartnumbersInfo: any[] = [];
    allUomdata: any[] = [];
    itemClassInfo: any[] = [];
    AltEquPartInfo: any = [];
    allconditioninfo: any[] = [];
    partListData: any[] = [];
    isEnableItemMasterView: boolean = true;
    isViewItemMasterNHA: boolean = true;
    isViewItemMasterTLA: boolean = true;
    isViewItemMasterAlternate: boolean = true;
    isViewItemMasterEquivalency: boolean = true;
    itemMasterView = false;
    @Input() isEdit = false;
    @Input() isWorkOrder = false;
    @Input() editData;
    @Input() isQuote = false;
    @Input() taskList: any = [];
    @Input() workFlow: any = {};
    @Input() markupList;
    @Input() UpdateMode: boolean;
    @Input() isWorkFlow: boolean = false;
    @Input() mpnPartNumbersList: any = [];
    @Output() workFlowChange = new EventEmitter();
    @Output() saveMaterialListForWO = new EventEmitter();
    @Output() updateMaterialListForWO = new EventEmitter();
    @Input() isSubWorkOrder = false;
    @Input() unitOfMeasuresList = [];
    @Input() percentageListFromSource = [];
    @Input() conditionsListFromSource = [];
    @Input() isView: boolean = false;
    @Output() notify: EventEmitter<IWorkFlow> = new EventEmitter<IWorkFlow>();
    @Input() customerId;
    materialCondition: any = [];
    materialMandatory: any = [];
    materialUOM: any[] = [];
    row: any;
    sourceWorkFlow: any = {};
    errorMessage: string;
    allPartDetails: any[] = [];
    totalCost: number = 0;
    globalDeffered = false;
    isDeferredBoolean: any = false;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    variableIdOfNew: any[];
    defaultUOMId: number;
    defaultConditionId: any;
    itemMasterId: any;
    allUploadedDocumentsList: any;
    viewItemMaster: any = {};
    partNumber: any;
    description: any;
    isAlternatePartChecked: boolean;
    isSerialized: any;
    isTimeLife: any;
    nha: any;
    stockLevel: any;
    nationalStockNumber: any;
    itemClassificationId: any;
    manufacturerId: any;
    priorityId: any;
    currencyId: any;
    stockUnitOfMeasureId: any;
    purchaseUnitOfMeasureId: any;
    itemGroupId: any;
    isAcquiredMethodBuy: any;
    expirationDate: any;
    isReceivedDateAvailable: any;
    isManufacturingDateAvailable: any;
    isTagDateAvailable: any;
    isOpenDateAvailable: any;
    isShippedDateAvailable: any;
    isOtherDateAvailable: any;
    provisionId: any;
    isHazardousMaterial: any;
    selectedAircraftTypes: any;
    isEnabeCapes: any;
    pma: any;
    der: any;
    ataMainId: any;
    isSchematic: any;
    overhaulHours: any;
    rpHours: any;
    testHours: any;
    turnTimeOverhaulHours: any;
    turnTimeRepairHours: any;
    rfqTracking: any;
    manufacturingDays: any;
    listPrice: any;
    glAccountId: any;
    exportCurrencyId: any;
    consumeUnitOfMeasureId: any;
    soldUnitOfMeasureId: any;
    leadTimeDays: any;
    leadTimeHours: any;
    reorderPoint: any;
    reorderQuantiy: any;
    minimumOrderQuantity: any;
    isExchangeInfoAvailable: any;
    exportWeight: any;
    exportValue: any;
    salesMarkUpOnListPrice: any;
    createdBy: any;
    exportClassificationId: any;
    exportSizeLength: any;
    exportSizeWidth: any;
    exportSizeHeight: any;
    updatedBy: any;
    memo: any;
    createddate: any;
    updatedDate: any;
    orginalAtaSubChapterValues: ATASubChapter[] = [];
    aircraftListDataValues: any;
    ataMappedList: any;
    filterManufacturerData: any[];
    filterDiscriptionData: any[];
    filterPartItemClassificationData: any[];
    ntaeData: any;
    ntaeData2: any;
    ntaeData3: any;
    ntaeData4: any;
    exchangeLoanInfo: any = {};
    viewItemMasterNS: any = {};
    aircraftauditHistory: any = [];
    pageSize: number = 10;
    isSpinnerVisible = false
    cols = [
        { field: 'partNumber', header: 'PN' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'manufacturerdesc', header: 'Manufacturer' },
        { field: 'classificationdesc', header: 'Classification' },
        { field: 'itemGroup', header: 'Group Name' },
        { field: 'nationalStockNumber', header: 'NSN' },
        { field: 'isSerialized', header: 'S/N' },
        { field: 'isTimeLife', header: 'Time Life' },
    ];
    cols1 = [
        { field: 'partNumber', header: 'PN' },
        { field: 'partDescription', header: 'Description' },
        { field: 'isHazardousMaterial', header: 'Is Hazardous Material' },
        { field: 'manufacturerdesc', header: 'Manufacturer' },
        { field: 'unitCost', header: 'Unit Cost' },
        { field: 'listPrice', header: 'List Price' },
    ];
    colsaircraftLD: any[] = [
        { field: "aircraft", header: "Aircraft" },
        { field: "model", header: "Model" },
        { field: "dashNumber", header: "Dash Numbers" },
        { field: "memo", header: "Memo" }
    ];
    atasub: any[] = [
        { field: 'ataChapterName', header: 'ATA Chapter' },
        { field: 'ataSubChapterDescription', header: 'ATA Sub-Chapter' }
    ];
    pnCols1 = [
        { field: 'partNo', header: 'PN' },
        { field: 'pnDiscription', header: 'PN Description' },
        { field: 'capabilityType', header: 'Cap Type' },
        { field: 'level1', header: 'Level 01' },
        { field: 'level2', header: 'Level 02' },
        { field: 'level3', header: 'Level 03' },
        { field: 'level4', header: 'Level 04' },
        { field: 'isVerified', header: 'Verified' },
        { field: 'verifiedBy', header: 'Verified By' },
        { field: 'verifiedDate', header: 'Date Verified' },
        { field: 'memo', header: 'Memo' }
    ];
    alterTableColumns: any[] = [
        { field: "altPartNo", header: "PN" },
        { field: "altPartDescription", header: "Description" },
        { field: "manufacturer", header: "Manufacturer " }
    ];
    equivalencyTableColumns: any[] = [
        { field: "altPartNo", header: "PN" },
        { field: "altPartDescription", header: "Description" },
        { field: "manufacturer", header: "Manufacturer " },
        { field: "itemClassification", header: "ITEM CLASSIFICATION " },
    ];
    provisionListData: any = [];
    conditionList: any = [];
    percentageList: any;
    defaultMaterialMandatory: string;
    partconditionsList = [];
    altequPartList = [];
    textAreaInfo: any;
    memoIndex;
    moduleName: any = '';
    modal: NgbModalRef;
    itemMasterRowData: any = {};
    showItemmasterView: any = false;
    deleteRowRecord: any = {};
    deletedRowIndex: any;
    currentForm: any;
    disableEditor: any = true;
    constructor(private actionService: ActionService,
        private commonService: CommonService,
        private authService: AuthService,
        private modalService: NgbModal,
        private workOrderQuoteService: WorkOrderQuoteService, 
        private workOrderService: WorkOrderService,
        private alertService: AlertService,
        public unitofmeasureService: UnitOfMeasureService,
        public itemClassService: ItemClassificationService,
        private masterComapnyService: MasterComapnyService,) {
    }
    ngOnInit(): void {
        this.isSubWorkOrder = this.isSubWorkOrder; 
            this.getPartnumbers('');
   
        if (this.isWorkOrder) {
            this.row = this.workFlow.materialList[0];
            if (this.isEdit) { 
                this.workFlow.materialList = [];
                this.editData.quantity = this.editData.quantity ? formatNumberAsGlobalSettingsModule(this.editData.quantity, 0) : '0';
                this.editData.unitCost = this.editData.unitCost ? formatNumberAsGlobalSettingsModule(this.editData.unitCost, 2) : '0.00';
                this.editData.extendedCost = this.editData.extendedCost ? formatNumberAsGlobalSettingsModule(this.editData.extendedCost, 2) : '0.00';
               
                this.workFlow.materialList.push(this.editData);
                this.reCalculate();
            } else {
                this.workFlow.materialList = [];
                this.addRow();
                this.workFlow.materialQtySummation = 0;
                this.workFlow.materialExtendedCostSummation = 0;
                this.workFlow.totalMaterialCost = 0;
                this.workFlow.materialExtendedPriceSummation = 0;
            }
        } else {
            if (this.row == undefined) {
                this.row = {};
            }
            // this.row.taskId = this.workFlow.taskId ? this.workFlow.taskId :"";
            this.workFlow.materialList.map((x, index) => {
                this.getPNDetails(x);
            })
        }
        if (this.isQuote && this.editData.length > 0) {
            this.editData.quantity = this.editData.quantity ? formatNumberAsGlobalSettingsModule(this.editData.quantity, 0) : '0';
            this.editData.unitCost = this.editData.unitCost ? formatNumberAsGlobalSettingsModule(this.editData.unitCost, 2) : '0.00';
            this.editData.extendedCost = this.editData.extendedCost ? formatNumberAsGlobalSettingsModule(this.editData.extendedCost, 2) : '0.00';
            this.workFlow.materialList = this.editData;
        }
        if (this.workFlow) { 
            if (this.workFlow.materialList.length > 0) {
                this.workFlow.materialList = this.workFlow.materialList.map(x => {
                    return {
                        ...x,
                        quantity: x.quantity ? formatNumberAsGlobalSettingsModule(x.quantity, 0) : '0',
                        unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
                        extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00',
                        price: x.price ? formatNumberAsGlobalSettingsModule(x.price, 2) : '0.00',
                        extendedPrice: x.extendedPrice ? formatNumberAsGlobalSettingsModule(x.extendedPrice, 2) : '0.00',
                        partItem: { partId: x.itemMasterId, partName: x.partNumber }
                    }
                })
            }
        }
        else if (this.isQuote) {
            this.workFlow.materialList = [];
            this.addRow();
        }
        this.getMaterailMandatories();

        if (this.isWorkOrder || this.isQuote) {
            this.provisionList();
            this.getConditionsList();
        }
        this.disableUpdateButton = true;
  if(this.editData && this.isEdit==true){
    this.getTaskList()
  }
    }
    ngOnChanges() {
        if (this.workFlow) {
            this.getConditionsList();
            if (this.workFlow.materialList.length > 0) {
                this.workFlow.materialList = this.workFlow.materialList.map(x => {
                    return {
                        ...x,
                        quantity: x.quantity ? formatNumberAsGlobalSettingsModule(x.quantity, 0) : '0',
                        unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
                        extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00',
                        price: x.price ? formatNumberAsGlobalSettingsModule(x.price, 2) : '0.00',
                        extendedPrice: x.extendedPrice ? formatNumberAsGlobalSettingsModule(x.extendedPrice, 2) : '0.00',
                        partItem: { partId: x.itemMasterId, partName: x.partNumber }
                    }
                })
            }
        }
        if (this.UpdateMode) {
            this.reCalculate(); 
        }
        if (this.isQuote && this.editData.length > 0) {
         const data=[...this.editData];
            this.workFlow.materialList =data;
        }
        else if (this.isQuote && (!this.editData || this.editData.length <= 0)) {
            this.workFlow.materialList = [];
            this.addRow();
        }
        this.disableUpdateButton = true;
        if(!this.isView){
            this.getPartnumbers('');
        }
    }
    onFilterTask(value){
        
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null;
    }
    getMaterailMandatories() {
        let materialMandatoriesIds = [];
        // if (!this.isWorkOrder || !this.isQuote) {
            if(this.workFlow.materialList && this.workFlow.materialList.length !=0){
              this.workFlow.materialList.forEach(element => {
                return materialMandatoriesIds.push(element.materialMandatoriesId);  
              }) 
        }else{
            materialMandatoriesIds.push(0)
        }
        // }
        console.log("hello",materialMandatoriesIds)
        this.isSpinnerVisible = true;
        this.commonService.autoSuggestionSmartDropDownList('MaterialMandatories', 'Id', 'Name', '', true, 0, materialMandatoriesIds,this.currentUserMasterCompanyId)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.materialMandatory = res.map(x => {
                    return {
                        ...x,
                        materialMandatoriesId: x.value,
                        materialMandatoriesName: x.label
                    }
                });

            }, error => {
                this.isSpinnerVisible = false;
            });
    }
    onSelectMaterialManditory(rowData) {
        this.materialMandatory.forEach(
            x => {
                if (x['materialMandatoriesId'] == rowData.materialMandatoriesId) {
                    rowData['materialMandatoriesName'] = x['materialMandatoriesName'];
                }
            }
        )
    }
    parsedText(text) {
        if (text) {
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
        }
    }
    getConditionsList() {
        this.isSpinnerVisible = true;
        let conditionIds = [];
        if ( this.workFlow.materialList &&  this.workFlow.materialList.length !=0) {
            this.workFlow.materialList.forEach(acc => {
                conditionIds.push(acc.conditionCodeId);
            })
        }else{
            conditionIds.push(0)
        }
        this.commonService.autoSuggestionSmartDropDownList('Condition', 'ConditionId', 'Description', '', true,  0, conditionIds,this.currentUserMasterCompanyId)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.conditionList = res
            }, error => {
                this.isSpinnerVisible = false;
            });
    }
    onTaskChhange(task) {
        this.taskList.forEach((t) => {
            if (t.taskId == task.taskId) {
                task['taskName'] = t.description;
            }
        })
    }
    reCalculate() {
        this.calculateExtendedCostSummation();
        this.calculateQtySummation();
        this.calculatePriceSummation();
        this.calculateExtendedPriceSummation();
    }
    filterpartItems(event) {
        this.partCollection =[];
        this.itemclaColl = [];
        if (event.query != undefined || event.query != null || event.query != '') {
            this.getPartnumbers(event.query);
        }
         else {
            this.getPartnumbers('');
        }
        this.partCollection = this.partCollection;
    } 
    getPartnumbers(value) {
        this.isSpinnerVisible = true;
        let exclusionsIds = [];
        if (this.UpdateMode) {
            exclusionsIds = this.workFlow.materialList.reduce((acc, x) => {
                return exclusionsIds.push(acc.itemMasterId);
            }, 0)
        }
      if(this.isWorkOrder || this.isSubWorkOrder){
        let partSearchParamters = {
            "customerId": 411,
            'partNumber': "",
            "includeAlternatePartNumber": true,
            "includeEquivalentPartNumber": true,
            "restrictPMA": true,
            "restrictDER": true,
            "custRestrictDER": true,
            "custRestrictPMA": true,
            "idlist":  null,
            "masterCompanyId":0
          };
          partSearchParamters.partNumber=value ? value :"";  
          partSearchParamters.customerId =this.customerId?this.customerId: 0;
          partSearchParamters.masterCompanyId =this.currentUserMasterCompanyId;
          if(this.isWorkOrder || this.isSubWorkOrder || this.isQuote){
          }else{
            partSearchParamters.restrictPMA=false;
            partSearchParamters.restrictDER=false
          }
          partSearchParamters.idlist=  exclusionsIds ? exclusionsIds : 0
        this.workOrderService.searchPartNumberAdvanced(partSearchParamters).subscribe((res:any) => {
            this.isSpinnerVisible = false;
            this.allPartnumbersInfo = res;
            this.allPartnumbersInfo.forEach(element => {
                if (element.value == this.workFlow.itemMasterId) {
                    this.partCollection.splice(element, 1);
                }
                this.partCollection.push({
                    "partId": element.value,
                    "partName": element.label,
                    "description": element.partDescription,
                    "masterCompanyId": element.masterCompanyId,
                    "itemClassificationId": element.itemClassificationId,
                    "itemClassification": element.itemClassification,
                    "unitOfMeasureId": element.unitOfMeasureId,
                    "unitOfMeasure": element.unitOfMeasure,
                    "stockType": element.stockType
                });
            });

            this.partCollection= this.partCollection;
        }, error => {
            this.isSpinnerVisible = false;
        });
      }else{
        this.commonService.autoCompleteSmartDropDownItemMasterList(value, true, 20, exclusionsIds ? exclusionsIds : 0,this.currentUserMasterCompanyId).subscribe((res:any) => {
            this.isSpinnerVisible = false;
            this.allPartnumbersInfo = res;
            this.allPartnumbersInfo.forEach(element => {
                if (element.value == this.workFlow.itemMasterId) {
                    this.partCollection.splice(element, 1);
                }
                this.partCollection.push({
                    "partId": element.value,
                    "partName": element.label,
                    "description": element.partDescription,
                    "masterCompanyId": element.masterCompanyId,
                    "itemClassificationId": element.itemClassificationId,
                    "itemClassification": element.itemClassification,
                    "unitOfMeasureId": element.unitOfMeasureId,
                    "unitOfMeasure": element.unitOfMeasure,
                    "stockType": element.stockType
                });
            });

            this.partCollection= this.partCollection;
        }, error => {
            this.isSpinnerVisible = false;
        });  
      }
    }
    onPartSelect(event, material, index) { 
        var materialObj = this.workFlow.materialList.find(x => x.partItem == event && x.taskId == this.workFlow.taskId);
        var itemMasterId = this.partCollection.find(x => {
            if (x.partName == event) {
                return x.partId
            }
        })
        if (materialObj != undefined) {
            if (this.workFlow.exclusions) {
                var isPartExcluded = this.workFlow.exclusions.find(x => x.itemMasterId != '' && x.itemMasterId == itemMasterId && x.taskId == this.workFlow.taskId)
                if (isPartExcluded != undefined) {
                    material.itemMasterId = '';
                    material.partDescription = '';
                    material.partItem = '';
                    material.itemClassificationId = '';
                    material.masterCompanyId = '';
                    material.partName = '';
                    event = '';
                    this.alertService.showMessage("Workflow", "Part Number already exist in Exclusion List.", MessageSeverity.error);
                    return;
                }
            }
        }
        material.qtyOnHand = material.quantityOnHand;
        material.qtyAvail = material.qtyAvailable;
        material.itemMasterId = material.partItem.partId;
        material.partDescription = material.partItem.description;
        material.partNumber = material.partItem.partName; 
        material.masterCompanyId = material.partItem.masterCompanyId ? material.partItem.masterCompanyId : 0;
        material.stockType = material.partItem.stockType;
        material.itemClassificationId = material.partItem.itemClassificationId;
        material.itemClassification = material.partItem.itemClassification;
        material.unitOfMeasure = material.partItem.unitOfMeasure;
        material.unitOfMeasureId = material.partItem.unitOfMeasureId;
        material.conditionCodeId = material.partItem.conditionId;
        material.conditionCodeId = material.conditionCodeId ? material.conditionCodeId : this.conditionList[0].value;
        this.materialMandatory.forEach(element => {
            if (element.materialMandatoriesName == 'Mandatory') {
                material.materialMandatoriesId = element.materialMandatoriesId;
                material.MaterialMandatoriesName = element.materialMandatoriesName;
            }
        });
        this.getPNDetails(material);
        if(this.isQuote){
            if(material.taskId){
                this.taskList.forEach(element => {
                    if(element.taskId==material.taskId){
                        material.taskName=element.description;
                        return;
                    }
                });
            }
        }
    }
    clearautoCompleteInput(currentRecord) {
        currentRecord.partItem = undefined;
    }
    provisionList() {
        this.isSpinnerVisible = true;
        let provisionIds = [];
        console.log("this.workFlow.materialList",this.workFlow.materialList) 
    if(this.workFlow.materialList && this.workFlow.materialList.length !=0){
             this.workFlow.materialList.forEach(element => {
            return provisionIds.push(element.provisionId);
        })
    }else{
        provisionIds.push(0)
    }
        console.log("this.workFlow.materialList",provisionIds)
        this.isSpinnerVisible = true;
        this.commonService.autoSuggestionSmartDropDownList('Provision', 'ProvisionId', 'Description', '', true, 0, provisionIds,this.currentUserMasterCompanyId)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.provisionListData = [];
                if (this.isSubWorkOrder) {
                    res.forEach(element => {
                        if (element.label != "Sub Work Order") {
                            this.provisionListData.push(element);
                        }
                    });
                } else {
                    this.provisionListData = res;
                }
            }, error => {
                this.isSpinnerVisible = false;
            });
    }
    getAllPercentage() {
        this.isSpinnerVisible = true;
        let provisionIds = [];
        provisionIds = this.workFlow.materialList.reduce((acc, x) => {
            return provisionIds.push(acc.provisionId);
        }, 0)
        this.commonService.autoSuggestionSmartDropDownList('[Percent]', 'PercentId', 'PercentValue', '', true, 0, provisionIds,this.currentUserMasterCompanyId)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.percentageList = res;
            }, error => {
                this.isSpinnerVisible = false;
            });
    }
    async getPartConditions(part, index) {
        this.isSpinnerVisible = true;
        if (part) {
            await this.workOrderQuoteService.getPartConditions(part.itemMasterId).subscribe(
                res => {
                    this.isSpinnerVisible = false;
                    this.materialCondition = res;
                    if (this.materialCondition && this.materialCondition.length > 0) {
                        this['partconditionsList' + index] = this.materialCondition;
                        var defaultCondition = this['partconditionsList' + index].find(x => x.condition.trim().toLowerCase() == "new");
                        this.defaultConditionId = defaultCondition != undefined ? defaultCondition.conditionId : this.materialCondition[0].conditionId;
                        if ((this.workFlow.workflowId == undefined || this.workFlow.workflowId == '0') && !this.isEdit && this.workFlow.materialList[index] != undefined) {
                            this.workFlow.materialList[index].conditionCodeId = this.defaultConditionId;
                        }
                        this.getPNDetails(this.workFlow.materialList[index]);
                    } else {
                        this['partconditionsList' + index] = [];
                    }

                }, error => {
                    this.isSpinnerVisible = false;
                });
        }
    }
    getProvisionDetails(event, part, index) {
    }
    async loadAltEquPartInfoData(data, index) {
        if (data) {
            this.isSpinnerVisible = true;
            await this.itemClassService.loadAltEquPartInfoData(data.itemMasterId).subscribe(res => {
                this.isSpinnerVisible = false;
                this.AltEquPartInfo = res;
                this['altequPartList' + index] = this.AltEquPartInfo;
                if (this.AltEquPartInfo && this.AltEquPartInfo.length > 0) {
                    if ((this.workFlow.workflowId == undefined || this.workFlow.workflowId == '0') && !this.isEdit && this.workFlow.materialList[0] != undefined) {
                        this.workFlow.materialList[0].AltEquPartDescription = this.altequPartList[index][0].partDescription
                    }
                } else {
                    this.workFlow.materialList[0].AltEquPartId = '';
                    this.workFlow.materialList[0].AltEquPartDescription = '';
                }
            }, error => {
                this.isSpinnerVisible = false;
            });
        }
    }
    onAddTextAreaInfo(material, index) {
        this.disableEditor = true;
        this.memoIndex = index;
        this.textAreaInfo = material.memo;
    }
    onSaveTextAreaInfo(memo) {
        if (memo) {
            this.textAreaInfo = memo;
            this.workFlow.materialList[this.memoIndex].memo = this.textAreaInfo;
        }
        this.disableEditor = true;
        $("#textarea-popup").modal("hide");
        this.disableUpdateButton = false;
    }
    onCloseTextAreaInfo() {
        this.disableEditor = true;
        $("#textarea-popup").modal("hide");
    }
    addRow(): void {
        var newRow = Object.assign({}, this.row);
        newRow.workflowMaterialListId = "0";
        if (this.taskList) {
            if(this.isWorkFlow==true){
            this.taskList.forEach(
                task => {
                    if (task.description == "Assemble") {
                        newRow.taskId = task.taskId;
                    }
                }
            )
            }
            if(this.isQuote || this.isWorkOrder){

                newRow.taskId = this.taskList[0].taskId;
            }
        }
        newRow.conditionCodeId = this.defaultConditionId;
        newRow.extendedCost = "0.00";
        newRow.extraCost = "0.00";
        newRow.itemClassificationId = "";
        newRow.itemMasterId = "";
        newRow.materialMandatoriesId = 1;
        newRow.partDescription = "";
        newRow.partItem = "";
        newRow.isDeferred = this.isDeferredBoolean;
        newRow.memo = "";
        newRow.price = "0.00";
        newRow.provisionId = "";
        newRow.quantity = "";
        newRow.unitCost = "0.00";
        newRow.unitOfMeasureId = this.defaultUOMId;
        newRow.isDeleted = false;
        newRow.extendedPrice = '';
        newRow.updatedBy = this.userName; 
        newRow.createdBy = this.userName;
        newRow.createdDate = new Date();
        newRow.masterCompanyId = this.currentUserMasterCompanyId;
        if (this.materialMandatory) {
            this.materialMandatory.forEach(
                x => {
                    if (x['materialMandatoriesId'] == 1) {
                        newRow['materialMandatoriesName'] = x['materialMandatoriesName'];
                    }
                }
            )
        }
        else {
            newRow['materialMandatoriesName'] = 'Mandatory';
        }
        this.workFlow.materialList.push(newRow);
    }
 
    calculateExtendedCost(material): void {
        material.unitCost = material.unitCost ? formatNumberAsGlobalSettingsModule(material.unitCost, 2) : '';
        material.quantity = material.quantity ? material.quantity.toString().replace(/\,/g, '') : 0;
        if (material.quantity != "" && material.unitCost) {
            material.extendedCost = formatNumberAsGlobalSettingsModule((material.quantity * material.unitCost.toString().replace(/\,/g, '')), 2);
        }
        else {
            material.extendedCost = "";
        }
        this.calculateExtendedCostSummation();
    }
    // sum of extended cost
    calculateExtendedCostSummation() {
        var total = 0;
        this.workFlow.materialList.map((element, i) => {
            if (element.isDeleted == false) {
                total = total + parseFloat(element.extendedCost == undefined || element.extendedCost === '' ? 0 : element.extendedCost.toString().replace(/\,/g, ''))
            }
        });
        this.workFlow.totalMaterialCostValue = total ? formatNumberAsGlobalSettingsModule(total, 2) : '0.00';
        this.workFlow.materialExtendedCostSummation = this.workFlow.totalMaterialCostValue;
    }
    calculateExtendedPrice(material): void {
        material.price = material.price ? formatNumberAsGlobalSettingsModule(material.price, 2) : '';
        if (material.quantity != "" && material.price != "") {
            material.extendedPrice = formatNumberAsGlobalSettingsModule((material.quantity * parseFloat(material.price.toString().replace(/\,/g, ''))), 2);
        }
        else {
            material.extendedPrice = "";
        }
        this.calculateExtendedPriceSummation();
    }
    // sum of extended cost
    calculateExtendedPriceSummation() {
        this.workFlow.materialExtendedPriceSummation = this.workFlow.materialList.reduce((acc, x) => {
            return acc + parseFloat(x.extendedPrice == undefined || x.extendedPrice === '' ? 0 : x.extendedPrice.toString().replace(/\,/g, ''))
        }, 0);
        this.workFlow.materialExtendedPriceSummation = this.workFlow.materialExtendedPriceSummation ? formatNumberAsGlobalSettingsModule(this.workFlow.materialExtendedPriceSummation, 2) : null;
    }
    // sum of the qty
    calculateQtySummation() {
        this.workFlow.materialQtySummation = this.workFlow.materialList.reduce((acc, x) => {
            return acc + parseFloat(x.quantity == undefined || x.quantity === '' ? 0 : x.quantity.toString().replace(/\,/g, ''))
        }, 0);

        this.workFlow.materialList.forEach(function (material) {
            material.quantity = material.quantity != '' ? parseFloat(material.quantity.toString().replace(/\,/g, '')) : '';
        });
    }
    validateQuantity(event, material): void {
        if (!material.quantity) {
            material.quantity = '0';
        }
    }
    // calculate the price summation 
    calculatePriceSummation() {
        this.workFlow.totalMaterialCost = this.workFlow.materialList.reduce((acc, x) => {
            return acc + parseFloat(x.price == undefined || x.price === '' ? 0 : x.price)
        }, 0);

        this.workFlow.totalMaterialCost = this.workFlow.totalMaterialCost ? formatNumberAsGlobalSettingsModule(this.workFlow.totalMaterialCost, 2) : '0.00';
    }
    isDeferredEnable(e) {
        if (e.target.checked) {
            this.workFlow.materialList = [...this.workFlow.materialList.map(x => {
                return {
                    ...x,
                    isDeferred: true
                }
            })]
            this.isDeferredBoolean = true;
        } else {
            this.workFlow.materialList = [...this.workFlow.materialList.map(x => {
                return {
                    ...x,
                    isDeferred: false
                }
            })]
            this.isDeferredBoolean = false;
        }
    }
    saveMaterialsWorkOrder() {
        if (this.isQuote == true || this.isWorkOrder == true) {
            this.workFlow.materialList.forEach(element => {
                if (element.provisionId) {
                    this.provisionListData.forEach(child => {
                        if (child.value == element.provisionId) {
                            element.provision = child.label;
                        }
                    });

                }
            });
        }
        this.saveMaterialListForWO.emit(this.workFlow);
        this.workFlow.materialList = [];
        this.addRow();
        this.workFlow.materialQtySummation = 0;
        this.workFlow.materialExtendedCostSummation = 0;
        this.workFlow.totalMaterialCost = 0;
        this.workFlow.materialExtendedPriceSummation = 0;
    }
    closeMaterialTab() {
        this.workFlow.materialList = [];
        this.updateMaterialListForWO.emit(this.workFlow);
        this.addRow();
        this.workFlow.materialList[0].conditionCodeId = 0;
        this.workFlow.materialList[0].partItem = null;
        this.editData={};
    }
    updateMaterialsWorkOrder() {
        this.updateMaterialListForWO.emit(this.workFlow);
        this.workFlow.materialList = [];
        this.addRow();
        this.workFlow.materialQtySummation = 0;
        this.workFlow.materialExtendedCostSummation = 0;
        this.workFlow.totalMaterialCost = 0;
        this.workFlow.materialExtendedPriceSummation = 0;
    }
    markupChanged(matData) {
        try {
            this.markupList.forEach((markup) => {
                if (markup.value == matData.markupPercentageId) {
                    matData.materialCostPlus = (matData.extendedPrice) + (((matData.extendedPrice) / 100) * Number(markup.label))
                }
            })
        }
        catch (e) {
        }
    }
    getTotalCostPlusAmount() {
        let total = 0;
        this.workFlow.materialList.forEach(
            (material) => {
                if (material.materialCostPlus) {
                    total += material.materialCostPlus;
                }
            }
        )
        return total;
    }
    getTotalFixedAmount() {
        let total = 0;
        this.workFlow.materialList.forEach(
            (material) => {
                if (material.fixedAmount) {
                    total += Number(material.fixedAmount);
                }
            }
        )
        return total;
    }
    getPNDetails(part) {
        if (part.partItem && part.conditionCodeId) {
            this.isSpinnerVisible = true;
            this.workOrderQuoteService.getPartDetails(part.itemMasterId, part.conditionCodeId,this.authService.currentUser.masterCompanyId)
                .subscribe(
                    partDetail => {

                        this.isSpinnerVisible = false;
                        if (partDetail) {
                            const unitCost = parseFloat(part.unitCost.toString().replace(/\,/g, ''));
                           part.unitCost = unitCost != 0 ? formatNumberAsGlobalSettingsModule(partDetail["unitCost"], 2) : formatNumberAsGlobalSettingsModule(partDetail["unitCost"], 2);
                            part.billingRate = partDetail["sP_FSP_FlatPriceAmount"];
                            part.markupPercentageId = partDetail["sP_CalSPByPP_MarkUpPercOnListPrice"];
                            part.stockType = part.stockType ? part.stockType : partDetail["stockType"];
                            part.price = part.price ? formatNumberAsGlobalSettingsModule(part.price, 2) : formatNumberAsGlobalSettingsModule(partDetail["salePrice"], 2);
                            this.calculateExtendedCost(part);
                        }
                    }, error => {
                        this.isSpinnerVisible = false;
                    });
        }
    }
    getDynamicVariableData(variable, index) {
        return this[variable + index];
    }
    openView(row) {
        this.itemMasterRowData = row;
        this.showItemmasterView = true;
        this.itemMasterId = row.itemMasterId;
        $('#itemMasterView').modal('show');
    }
    getntlafieds(ntaeData) {
        for (let i = 0; i < ntaeData.length; i++) {
            this.filterManufacturerData.push({
                label: ntaeData[i].manufacturer,
                value: ntaeData[i].manufacturerId
            });
            this.filterDiscriptionData.push({
                label: ntaeData[i].altPartDescription,
                value: ntaeData[i].altPartDescription
            });
        }
        this.itemMasterView = true;
        $('#itemMasterView').modal('show');
    }
    dismissItemMasterModel() {
        $('#itemMasterView').modal('hide');
        this.itemMasterId = undefined;
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    checkQuantityAvailability() {
        let result = false;
        this.workFlow.materialList.forEach(
            material => {
                if (!material.quantity || Number(material.quantity) <= 0) {
                    result = true;
                }
            }
        )
        return result;
    }
 
    onTaskChange(material) { 

    }
    editorgetmemo(ev) {
        this.disableEditor = false;
    }
    dismissModel() {
        this.modal.close();
    }
    openDelete(content, row, index, form: NgForm) {
        this.currentForm = form;
        this.deletedRowIndex = index;
        this.deleteRowRecord = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    deleteRow(): void {
        if (this.workFlow.materialList[this.deletedRowIndex].workflowMaterialListId == undefined || this.workFlow.materialList[this.deletedRowIndex].workflowMaterialListId == "0" || this.workFlow.materialList[this.deletedRowIndex].workflowMaterialListId == "") {
            this.workFlow.materialList.splice(this.deletedRowIndex, 1);
            let temp = cloneDeep(this.workFlow.materialList);
            this.currentForm.resetForm();
            this.workFlow.materialList = cloneDeep(temp);
        }
        else {
            this.workFlow.materialList[this.deletedRowIndex].isDeleted = true;
        }
        this.reCalculate();
        this.dismissModel();
    }
    disableUpdateButton: boolean = true;
    getActive() {
        this.disableUpdateButton = false;
    }
    setEditArray:any=[];
    getTaskList() {  
        this.setEditArray=[];
        if(this.editData){
            this.setEditArray.push(this.editData.taskId ? this.editData.taskId :0)
        }else{
            this.setEditArray.push(0);
        } 
        const strText = '';
        this.commonService.autoSuggestionSmartDropDownList('Task', 'TaskId', 'Description', strText, true, 0, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
         this.taskList = res.map(x => {
                return {
                    id: x.value,
                    description: x.label.toLowerCase(),
                    taskId: x.value,
                    label:x.label.toLowerCase(),
                }
            });
   
        },
            err => {
                // this.handleError(err);
            })
    }
} 