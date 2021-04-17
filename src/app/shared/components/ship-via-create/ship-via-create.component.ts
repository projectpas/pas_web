import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { CustomerInternationalShipVia } from '../../../models/customer-internationalshipping.model';
import { AuthService } from '../../../services/auth.service';
import { editValueAssignByCondition, getValueFromArrayOfObjectById, getObjectByValue, getObjectById, formatNumberAsGlobalSettingsModule, getValueFromObjectByKey } from '../../../generic/autocomplete';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
declare var $ : any;
import { ShipVia } from '../../../models/sales/ship-via';
@Component({
  selector: 'app-ship-via-create',
  templateUrl: './ship-via-create.component.html',
  styleUrls: ['./ship-via-create.component.scss']
})
export class ShipViaCreateComponent implements OnInit {
  allShipViaInfo: any = [];
  isSpinnerVisible: boolean = false;
  addShipViaFormForShipping = new CustomerInternationalShipVia()
  ShipViabutton: boolean = false;
  @Input() shipViaValue: any;
  @Input() ShipViaEditID: number;
  @Input() shipViaList: any;
  @Output('on-shipvia-save') Event = new EventEmitter();
  tempAddshipViaMemo: any = {};
  isEditModeShipVia:boolean = false;
  lstfilterShippVia: any[];
  addShipViaFormForFreight = new ShipVia()
  isShipViaNameAlreadyExists:boolean=false;
  //MasterCompanyId = 1;
  constructor(private commonService: CommonService,
              private authService: AuthService,
              private alertService: AlertService,) { }

  ngOnInit() {
    this.loadShippingViaList();
    // this.isEditModeShipVia = this.shipViaValue.isEditModeShipVia;
  }

  get userName(): string {	
    return this.authService.currentUser ? this.authService.currentUser.userName : "";		
  }

  get masterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : 1;
  }
  
  // get currentUserMasterCompanyId(): number {
  //   return this.authService.currentUser
  //     ? this.authService.currentUser.masterCompanyId
  //     : null;
  // }

  loadShippingViaList() {
    this.commonService.getShipVia(this.masterCompanyId).subscribe(res => {
      this.allShipViaInfo = res;
      console.log("res",res);
      if(this.ShipViaEditID > 0){
        this.EditShipVia();
        this.isEditModeShipVia = true;
    }else{
        this.isEditModeShipVia = false;
        this.resetAddressShipViaForm();
    }
    },err => {
      this.isSpinnerVisible = false;	
    });
  }

  filterShippVia(event) {
    this.lstfilterShippVia = this.allShipViaInfo;
    if (event.query !== undefined && event.query !== null) {
      const shippingSite = [...this.allShipViaInfo.filter(x => {
        return x.name.toLowerCase().includes(event.query.toLowerCase())
      })]
      this.lstfilterShippVia = shippingSite;	
    }
  }

  checkShipViaNameExist(value) {
    this.isShipViaNameAlreadyExists = false;
    this.ShipViabutton = true;
    if (value != undefined && value != null) {
      if(this.allShipViaInfo && this.allShipViaInfo.length !=0){
      for (let i = 0; i < this.allShipViaInfo.length; i++) {
        if ((this.addShipViaFormForFreight.Name == this.allShipViaInfo[i].name 
          || value.toLowerCase() == this.allShipViaInfo[i].name.toLowerCase())
          &&  this.addShipViaFormForFreight.Name !=  '') {
          this.isShipViaNameAlreadyExists = true;
          this.ShipViabutton = false;
          return;
        }
      }
    }
  }
}

onAddShipMemo() {
	this.tempAddshipViaMemo = this.addShipViaFormForFreight.Memo;
}
onSaveTextAreaInfo() {
  this.addShipViaFormForFreight.Memo = this.tempAddshipViaMemo;
  this.ShipViabutton = true;
  $('#ship-via-add-memo').modal('hide');
}

// saveShipVia() {
//   const postData = [];
//   //const mgmtStructure = []
//   // const shipviaData = {
//   //   ...this.addShipViaFormForFreight,
//   //   IsActive : true,
//   //   CreatedBy:this.userName,
//   //   UpdatedBy:this.userName			

//   // }
//   postData.push(
//     {fieldName: "Name", fieldValue: this.addShipViaFormForFreight.Name},
//     {fieldName: "Memo", fieldValue: this.addShipViaFormForFreight.Memo},
//     {fieldName: "MasterCompanyId", fieldValue: this.MasterCompanyId},
//     {fieldName: "CreatedBy", fieldValue: this.userName},
//     {fieldName: "UpdatedBy", fieldValue: this.userName},
//   )
//   const frmData = {
//     table: 'ShippingVia',
//     data: postData,
//   };

//   //if (!this.shipViaValue.isEditModeShipVia) {
//     this.commonService.createShipViaForMaster(frmData).subscribe(response => {
//       this.alertService.showMessage(
//         'Success',
//         `Saved Ship Via Information Sucessfully `,
//         MessageSeverity.success
//       );
//       //this.Event.emit(false);
//     },err => {
//       this.isSpinnerVisible = false;
//       //const errorLog = err;
//       //this.errorMessageHandler(errorLog);		
//     });
//   // } else {
//   //   this.commonService.createShipViaForMaster(frmData).subscribe(response => {
//   //     //this.onShipToSelected(this.sourcePoApproval.shipToUserId,0,0,0,0,response.shipViaId);
//   //     //this.enableAddSaveBtn = true;
//   //     this.alertService.showMessage(
//   //       'Success',
//   //       `Updated Ship Via Information Sucessfully`,
//   //       MessageSeverity.success
//   //     );
//   //     //this.Event.emit(response);
//   //   },err => {
//   //     this.isSpinnerVisible = false;		
//   //   })
//   // }


//   $('#shipToShipVia').modal('hide');
// }

saveShipVia() {
  const data = {
    ...this.addShipViaFormForFreight,
    IsActive : true,
    CreatedBy:this.userName,
    UpdatedBy:this.userName,			
    MasterCompanyId:this.masterCompanyId,
    ShippingViaId:this.ShipViaEditID,
    //Name: getValueFromArrayOfObjectById('label', 'value', this.addShipViaFormForFreight.ShippingViaId, this.allShipViaInfo),
    //Name:this.addShipViaFormForFreight.Name.name
   }
   const  shipviaData = {
     ...data,
     Name: editValueAssignByCondition('name', data.Name),									 
   }

   if(this.ShipViaEditID == 0){
      this.commonService.SaveShipVia(shipviaData).subscribe(response => {
        this.alertService.showMessage(
          'Success',
          `Saved Ship Via Information Sucessfully`,
          MessageSeverity.success
        );
        //this.Event.emit(response);
        console.log("response",response);
        this.Event.emit(response.shippingViaId);
      },err => {
        this.isSpinnerVisible = false;		
      })
    }else{
      this.commonService.SaveShipVia(shipviaData).subscribe(response => {
        this.alertService.showMessage(
          'Success',
          `Updated Ship Via Information Sucessfully`,
          MessageSeverity.success
        );
        //this.Event.emit(response);
        console.log("response",response);
        this.Event.emit(response.shippingViaId);
      },err => {
        this.isSpinnerVisible = false;		
      })
    }

  $('#shipToShipVia').modal('hide');
}

shipAddChange(){
  this.ShipViabutton = true;
}

  EditShipVia(){
    this.resetAddressShipViaForm();
    if(this.allShipViaInfo && this.allShipViaInfo.length !=0){
			for(var i =0; i < this.allShipViaInfo.length; i++) {
          if (this.allShipViaInfo[i].shippingViaId == this.ShipViaEditID) {
					this.addShipViaFormForFreight.ShippingViaId = this.allShipViaInfo[i].shippingViaId;
          //this.addShipViaFormForFreight.Name = this.allShipViaInfo[i].name;
          this.addShipViaFormForFreight.Name = getObjectByValue('name',this.allShipViaInfo[i].name, this.allShipViaInfo);
					this.addShipViaFormForFreight.Memo = this.allShipViaInfo[i].memo;
				}
			}
    }
  }

  shipViaChange(){
		this.ShipViabutton = true;
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

  resetAddressShipViaForm() {
    this.addShipViaFormForFreight = new ShipVia();
    this.isEditModeShipVia = false;
  }

  closeMemoModel()
  {
    this.isEditModeShipVia = false;
      $('#ship-via-add-memo').modal('hide');
  }
  closeModel(){
    this.Event.emit();
    $('#shipToShipVia').modal('hide');
  }
}
