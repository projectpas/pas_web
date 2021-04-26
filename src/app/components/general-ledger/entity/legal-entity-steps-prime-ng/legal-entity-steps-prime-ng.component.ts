import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Message } from 'primeng/components/common/message';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-legal-entity-steps-prime-ng',
	templateUrl: './legal-entity-steps-prime-ng.component.html',
	styleUrls: ['./legal-entity-steps-prime-ng.component.scss']
})
/** legal-entity-steps-primeNG component*/
export class LegalEntityStepsPrimeNgComponent implements OnInit {
	activeMenuItem: number = 1;
	ifvalue: boolean;
	generalcollection: any;
	collection: any;
	currentUrl: any;
	isDisabledSteps = false;

	items: MenuItem[];

	msgs: Message[] = [];


	showComponentPTab: boolean;

	constructor(private router: ActivatedRoute,
		private _changeDetectionRef: ChangeDetectorRef,
		private route: Router, private entityService: LegalEntityService,private authService:AuthService) {
		this.entityService.activeStep.subscribe(activeIndex => {
			this.changeStep(activeIndex);
		})
	}
	ngOnInit() {
		if (this.entityService.isEditMode) {
			this.isDisabledSteps = true;
		}
	}

	isShowTab(value){
		
		var isShow=this.authService.ShowTab('Create Legal Entity',value);
		return isShow;
	
	}

	changeStep(value) {
		console.log(value);
		console.log(this.entityService.listCollection);
		if (value == 1) {
			this.activeMenuItem = 1;
			this.route.navigateByUrl('/generalledgermodule/generalledgerpage/app-legal-entity-add');
		}

		else if (value == 2) {
			this.activeMenuItem = 3;
			this.route.navigateByUrl('/generalledgermodule/generalledgerpage/app-legal-entity-contact');
		}
		else if (value == 3) {

			this.activeMenuItem = 3;
			this.route.navigateByUrl('/generalledgermodule/generalledgerpage/app-legal-entity-banking');
		}
		else if (value == 4) {

			this.activeMenuItem = 4;
			this.route.navigateByUrl('/generalledgermodule/generalledgerpage/app-legal-entity-billing');
		}
		else if (value == 5) {

			this.activeMenuItem = 5;
			this.route.navigateByUrl('/generalledgermodule/generalledgerpage/app-legal-entity-shipping');
		}
		else if (value == 6) {

			this.activeMenuItem = 6;
			this.route.navigateByUrl('/generalledgermodule/generalledgerpage/app-legal-entity-documents');
		}
	}


}