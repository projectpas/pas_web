import { Component, OnInit, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import {  NgbActiveModal, NgbModalRef,  } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { AuthService } from "../../../services/auth.service";

@Component({
    selector: 'app-communication',
    templateUrl: './communication.component.html',
    styleUrls: ['./communication.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CommonCommunicationComponent implements OnInit, OnChanges {
 @Input() referenceId;
    modal: NgbModalRef;
    @Input() isViewMode:any=false;
    @Input() moduleName;
    @Input() idForContact;
    // @Input() ContactList;
    @Input() type:any;
    memoStyle:any=false;
    emailstyle:any=false;
    phoneStyle:any=false;
    textStyle:any=false;
    constructor(private activeModal: NgbActiveModal,private authService: AuthService,
      public  commonService: CommonService) { 
        }
    ngOnInit(): void {
        this.selectedTab(1);
        this.memoStyle=true;
        this.idForContact=this.idForContact;
        this.moduleName=this.moduleName;
    }
    ngOnChanges(): void {
        this.moduleName=this.moduleName;
        this.referenceId=this.referenceId;
        this.selectedTab(1);
        this.getModuleList();
        this.memoStyle=true;
    } 
    selectedTab(tab){
        if(tab==1){
            this.memoStyle=true;
            this.emailstyle=false;
            this.phoneStyle=false;
            this.textStyle=false;
        }else if(tab==2){
            this.memoStyle=false;
            this.emailstyle=true;
            this.phoneStyle=false;
            this.textStyle=false;
        }else if(tab==3){
            this.memoStyle=false;
            this.emailstyle=false;
            this.phoneStyle=true;
            this.textStyle=false;
        }else if(tab==4){
            this.memoStyle=false;
            this.emailstyle=false;
            this.phoneStyle=false;
            this.textStyle=true;
        }
    }
    moduleId:any;
    attachmoduleList: any = [];
    getModuleList(): void {
        this.commonService.smartDropDownList('Module', 'ModuleId', 'ModuleName', 0).subscribe(res => {
            this.attachmoduleList = res;
            this.attachmoduleList.forEach(element => {
                if (element.label == this.moduleName) {
                    this.moduleId = element.value;
                }
            });
        },
            err => {
                const errorLog = err;
            });
    }
}
