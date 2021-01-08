import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { fadeInOut } from '../../../services/animations';
import { MasterCompany } from '../../../models/mastercompany.model';
import { AuditHistory } from '../../../models/audithistory.model';
import { AuthService } from '../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { VendorService } from '../../../services/vendor.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { Vendor } from '../../../models/vendor.model';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { Message } from 'primeng/components/common/message';
import { MenuItem } from 'primeng/components/common/menuitem';


@Component({
    selector: 'app-vendor-conversations',
    templateUrl: './vendor-conversations.component.html',
	styleUrls: ['./vendor-conversations.component.scss'],
	animations: [fadeInOut]
})
/** VendorConversations component*/
export class VendorConversationsComponent implements OnInit, AfterViewInit {
    /** VendorConversations ctor */
	modal: NgbModalRef;
	ngOnInit(): void {
		this.workFlowtService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-conversations';
		this.workFlowtService.bredcrumbObj.next(this.workFlowtService.currentUrl); 
		this.workFlowtService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-conversations';
		this.workFlowtService.bredcrumbObj.next(this.workFlowtService.currentUrl);
		this.workFlowtService.ShowPtab = true;
		this.workFlowtService.alertObj.next(this.workFlowtService.ShowPtab);
	}
	ngAfterViewInit() {
	}
	constructor(private modalService: NgbModal, public workFlowtService: VendorService) {
	}

	openClassification(content) {
		this.modal = this.modalService.open(content, { size: 'lg' });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}
	dismissModel() {
		this.modal.close();
	}
}