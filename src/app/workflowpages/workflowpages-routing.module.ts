// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';

import { WorkFlowPagesComponent } from './workflowpages.component';
import { WorkflowListComponent } from '../components/workflow/workflow-list/workflow-list.component';
import { WorkflowCreateComponent } from "../components/workflow/workflow-create/workflow-create.component";
import { WorkflowCreateTestComponent } from '../Workflow/Workflow-Create.component';

const workflowpagesRoutes: Routes = [
	{
		path: 'workflowpages',
		component: WorkFlowPagesComponent,
		children: [
		
			{ path: "app-workflow-list", component: WorkflowListComponent, data: { title: "WorkFlow List" } },

      { path: "app-workflow-create", component: WorkflowCreateComponent, data: { title: "WorkFlow Create" } },

			{ path: "wf-create", component: WorkflowCreateTestComponent, data: { title: "WorkFlow" } },
      
      { path: "wf-update", component: WorkflowCreateTestComponent, data: { title: "WorkFlow" } }
        ]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(workflowpagesRoutes)
	],
	exports: [
		RouterModule
	],
	providers: [
		AuthService, AuthGuard
	]
})
export class WorkFlowPagesRoutingModule { }