import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { CommonService } from '../../../../../services/common.service';
import { formatNumberAsGlobalSettingsModule } from "../../../../../generic/autocomplete";
import { AuthService } from "../../../../../services/auth.service";
declare var $: any;
@Component({
  selector: "app-wo-margin",
  templateUrl: "./wo-margin.component.html",
  styleUrls: ["./wo-margin.component.css"]
})
export class WoMarginComponent implements OnInit {
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() searchAnotherPN: EventEmitter<boolean> = new EventEmitter<boolean>();
  // @Output() save: EventEmitter<PartDetail> = new EventEmitter<PartDetail>();
  @Input() part: any={
    partNumberObj:undefined,
    quantity:0,
    conditionIds:undefined,
    provisionId:0
  };;
  @Input() display: boolean;
  // query: ItemMasterSearchQuery;
  @Input() isEdit = false;
  @Input() editData;
  @Output() saveFinalMaterialListData = new EventEmitter<any>();
  @Output() updateFinalMaterialListData = new EventEmitter<any>();
  disableUpdateButton:boolean=true;
  percentage: any[] = [];
  invalidQuantityenteredForQuantityFromThis: boolean = false;
  formObject:any={
    partNumberObj:undefined,
    quantity:0,
    conditionIds:undefined,
    provisionId:0
  };
  isSpinnerVisible = false;
  setEditArray:any=[];
  provisionListData:any=[];
  taskList:any=[];
  materialMandatory:any=[];
  constructor(private commonService: CommonService,
    private authService: AuthService, ) {
  }
  ngOnInit() {
    this.part=this.part;
    console.log("selected part",this.editData)
    console.log("this.isEdit",this.isEdit)
    this.formObject.stocklineQuantity=this.part.stocklineQuantity;
    if(this.editData){
     this.formObject.partNumberObj={'partId': this.editData.partItem.partId,'partNumber': this.editData.partItem.partName};
     this.formObject.partDescription=this.editData.partDescription;
     this.formObject.conditionIds=[this.editData.conditionCodeId];
     this.formObject.quantity=this.editData.quantity;
     this.formObject.qtyOnHand=this.editData.qtyOnHand;
     this.formObject.qtyAvailable=this.editData.qtyAvail;
     this.formObject.taskId=this.editData.taskId;
     this.formObject.provisionId=this.editData.provisionId;
     this.formObject.isDeferred=this.editData.isDeferred;
     this.formObject.memo=this.editData.memo;
     this.formObject.workOrderMaterialsId=this.editData.workOrderMaterialsId;
     this.formObject.materialMandatoriesId=this.editData.materialMandatoriesId;
     this.formObject.unitCost= this.editData.unitCost ? formatNumberAsGlobalSettingsModule(this.editData.unitCost, 2) : '0.00';
     this.formObject.extendedCost= this.editData.extendedCost ? formatNumberAsGlobalSettingsModule(this.editData.extendedCost, 2) : '0.00';
      this.getTaskList();
      this.provisionList();
      this.getMaterailMandatories();
     }else{
      this.getTaskList();
      this.provisionList();
      this.getMaterailMandatories();
     }
  }
  get masterCompanyId(): number {
    return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : 1;
  }
  provisionList() {
    this.isSpinnerVisible = true;
    let provisionIds = []; 
    if(this.editData){
      this.setEditArray.push(this.editData.provisionId ? this.editData.provisionId :0);
    }else{
      this.setEditArray.push(0);
    }
    this.isSpinnerVisible = true;
    this.commonService.autoSuggestionSmartDropDownList('Provision', 'ProvisionId', 'Description', '', true, 0, provisionIds,this.masterCompanyId)
        .subscribe(res => {
            this.isSpinnerVisible = false;
            this.provisionListData = [];
                this.provisionListData = res;
        }, error => {
            this.isSpinnerVisible = false;
        });
  }

  getTaskList() {  
  this.setEditArray=[];

  if(this.editData){
    this.setEditArray.push(this.editData.taskId ? this.editData.taskId :0);
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
      if (this.taskList) {
        this.taskList.forEach(
            task => {
              if(!this.isEdit){
                if (task.description == "Assemble" || task.description == "assemble") {
                  this.formObject.taskId = task.taskId;
              }
              }
            }
        )
    }
  },
      err => {
      })
}
editorgetmemo(ev) {
  this.disableEditor = false;
}
getMaterailMandatories() {
  let materialMandatoriesIds = [];
  materialMandatoriesIds.push(0)
  if(this.editData){
    materialMandatoriesIds.push(this.editData.materialMandatoriesId ? this.editData.materialMandatoriesId :0);
  }else{
   materialMandatoriesIds.push(0);
  }
  this.isSpinnerVisible = true;
  this.commonService.autoSuggestionSmartDropDownList('MaterialMandatories', 'Id', 'Name', '', true, 0, materialMandatoriesIds,this.masterCompanyId)
      .subscribe(res => {
          this.isSpinnerVisible = false;
          this.materialMandatory = res.map(x => {
              return {
                  ...x,
                  materialMandatoriesId: x.value,
                  materialMandatoriesName: x.label
              }
          });
          if(!this.isEdit){
          this.materialMandatory.forEach(element => {
            if (element.materialMandatoriesName == 'Mandatory') {
               this.formObject.materialMandatoriesId = element.materialMandatoriesId;
               this.formObject.materialMandatoriesName = element.materialMandatoriesName;
            }
        });
      }
      }, error => {
          this.isSpinnerVisible = false;
      });
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
disableEditor:boolean=false;
textAreaInfo:any;
onAddTextAreaInfo(material) {
  this.disableEditor = true;
  this.textAreaInfo = material.memo;
}

onSaveTextAreaInfo(memo) {
  if (memo) {
      this.textAreaInfo = memo;
      this.formObject.memo = this.textAreaInfo;
  }
  this.disableEditor = true;
  $("#textarea-popup2").modal("hide");
  if(this.isEdit==true){
    this.disableUpdateButton = false;
  }
}
onClose() {
  this.close.emit(true);
}
onCloseTextAreaInfo() {
  this.disableEditor = true;
  $("#textarea-popup2").modal("hide");
}
calculateExtendedCost(): void {
  this.formObject.unitCost = this.formObject.unitCost ? formatNumberAsGlobalSettingsModule(this.formObject.unitCost, 2) : '0.00';
  this.formObject.quantity = this.formObject.quantity ? this.formObject.quantity.toString().replace(/\,/g, '') : 0;
  if (this.formObject.quantity != 0 && this.formObject.unitCost) {
      this.formObject.extendedCost = formatNumberAsGlobalSettingsModule((this.formObject.quantity * this.formObject.unitCost.toString().replace(/\,/g, '')), 2);
  }
  else {
      this.formObject.extendedCost = "";
  }
  // this.calculateExtendedCostSummation();
}
onChangeQuantityFromThis(event) {

  if (Number(this.formObject.stocklineQuantity) != 0) {
    if (this.formObject['qtyRemainedToQuote']) {
      this.invalidQuantityenteredForQuantityFromThis = this.formObject.stocklineQuantity > this.formObject.quantity;
    }
    else if (Number(this.formObject.stocklineQuantity) < 0)
    {
      this.invalidQuantityenteredForQuantityFromThis = true;
    }
    else {
      this.invalidQuantityenteredForQuantityFromThis = this.formObject.stocklineQuantity > this.formObject.quantity;
    }
  } else {
    this.invalidQuantityenteredForQuantityFromThis = true;
  }
}



materialCreateObject:any={};
savePart(){
  console.log("all save part",this.formObject)
  this.provisionListData.forEach(element => {
    if(element.value==this.formObject.provisionId){
      this.formObject.provision=element.label;
    }
    });
  this.formObject.unitCost=this.formObject.unitCost ? formatNumberAsGlobalSettingsModule(this.formObject.unitCost, 2) : '0.00';
  this.formObject.extendedCost=this.formObject.extendedCost ? formatNumberAsGlobalSettingsModule(this.formObject.extendedCost, 2) : '0.00';
  this.formObject.memo=this.formObject.memo;
  this.formObject.isDeferred=this.formObject.isDeferred;
  this.saveFinalMaterialListData.emit(this.formObject);
  this.close.emit(true);
  // $("#showMarginDetails").modal("hide");
}

getActive(){
  this.disableUpdateButton=false;
}
upDatePart(){ 
  if(this.isEdit){
    // this.part= this.editData
    // this.part.workOrderMaterialsId=this.editData.workOrderMaterialsId;
  }
  console.log("all save part",this.formObject)
  this.formObject.mandatorySupplementalId=this.formObject.materialMandatoriesId;
  this.formObject.provisionId=this.formObject.provisionId;
  this.formObject.materialMandatoriesId=this.formObject.materialMandatoriesId ? this.formObject.materialMandatoriesId :null;
  this.formObject.quantity=this.formObject.quantity;
  this.formObject.taskId=this.formObject.taskId;
  this.formObject.isDeferred=this.formObject.isDeferred;
  this.formObject.memo=this.formObject.memo;
   this.formObject.unitCost=this.formObject.unitCost ? formatNumberAsGlobalSettingsModule(this.formObject.unitCost, 2) : '0.00';
   this.formObject.extendedCost=this.formObject.extendedCost ? formatNumberAsGlobalSettingsModule(this.formObject.extendedCost, 2) : '0.00';
  this.updateFinalMaterialListData.emit(this.formObject)
  this.disableUpdateButton=true;
  // $("#showMarginDetails").modal("hide");
  this.close.emit(true);
}



  }

  

 