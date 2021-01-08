
import { Component } from "@angular/core";
import { MenuItem } from 'primeng/api';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { WorkFlowtService } from '../services/workflow.service';
import { AppComponent } from '../app.component';
import { AppTranslationService } from '../services/app-translation.service';

@Component({
	selector: "quickapp-pro-workflow",
	templateUrl: './workflowpages.component.html'
})
export class WorkFlowPagesComponent {
	otherurl: any;
	currentUrl: string;

	public items: MenuItem[];
	home: MenuItem;
	constructor(private router: ActivatedRoute, private route: Router, private workFlowService: WorkFlowtService,
		private appComponent: AppComponent, private appTranslationService: AppTranslationService) {

		this.workFlowService.bredcrumbObjChangeObject$.subscribe(value => {
			this.otherurl = value;
			this.loadmethod(this.otherurl);

		});
	}
	ngOnInit() {
		this.currentUrl = this.route.url;
		this.loadmethod(this.currentUrl)

	}
	loadmethod(url) {

		this.currentUrl = url;
		if (this.currentUrl) { 
			if (this.currentUrl == '/workflowmodule/workflowpages/app-workflow-list') {
				this.items = [
					{ label: 'Work Flow' },
					{ label: 'Work Flow-List' }
				];
			}
			else if (this.currentUrl == '/workflowmodule/workflowpages/wf-create') {
				this.items = [
					{ label: 'Work Flow' },
					{ label: 'Work Flow-Create ' }
				];
			}
			// else if (this.currentUrl == '/workflowmodule/workflowpages/wf-create') {
			// 	this.items = [
			// 		{ label: 'Work Flow' },
			// 		{ label: 'Work Flow-Edit ' }
			// 	];
			// }
			// else if (this.currentUrl == '/stocklinemodule/stocklinepages/app-stock-adjustment')
			// {
			// this.items = [
			// 	{ label: 'Work Flow' },
			// 	{ label: 'Stock Line Adjustment' }
			// 	];
			// }
		}
		

		if (this.otherurl) {
			if (this.currentUrl == '/workflowmodule/workflowpages/app-workflow-list') {
				this.items = [
					{ label: 'Work Flow' },
					{ label: 'Work Flow-List' }
				];
			}
			else if (this.otherurl == '/workflowmodule/workflowpages/wf-create') {
				this.items = [
					{ label: 'Stock Line' },
					{ label: (window.location.href.includes('edit'))?'Edit Work Flow':'Create Work Flow' }
				];
			}
		// 	else if (this.otherurl == '/stocklinemodule/stocklinepages/app-stock-line-edit') {
		// 		this.items = [
		// 			{ label: 'Stock Line' },
		// 			{ label: 'Stock Line-Edit' }
		// 		];
		// 	}
		// 	else if (this.currentUrl == '/stocklinemodule/stocklinepages/app-stock-adjustment') {
		// 		this.items = [
		// 			{ label: 'Stock Line' },
		// 			{ label: 'Stock Line Adjustment' }
		// 		];
		// 	}
		}
	}
}