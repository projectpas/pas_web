import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/components/common/message';
import { JournelService } from '../../../../../services/journals/journals.service';

@Component({
    selector: 'app-journel-steps',
    templateUrl: './journel-steps.component.html',
    styleUrls: ['./journel-steps.component.scss']
})
/** journel-steps component*/
export class JournelStepsComponent implements OnInit
{
    activeIndex: number;
    currentUrl: any;
    items: MenuItem[];
    showComponentPTab: boolean;
    msgs: Message[] = [];
    constructor(private router: ActivatedRoute, private route: Router, private journelService: JournelService)
    {
        let currentUrl = this.route.url;
        this.journelService.alertChangeObject$.subscribe(value => {
            this.showComponentPTab = value;

        });
        this.journelService.indexObjChangeObject$.subscribe(value => {
            this.activeIndex = value;

        });

    }

    ngOnInit() {
        //debugger
        this.showComponentPTab = this.journelService.ShowPtab;
        this.currentUrl = this.route.url;
        //
        if (this.currentUrl == '/assetmodule/assetpages/app-asset-listing') {
            //this.showComponentPTab = false;
            this.activeIndex = 0;
        }
        else if (this.currentUrl == '/accountmodule/accountpages/app-view-batch') {
            this.activeIndex = 0;
        }
        else if (this.currentUrl == '/accountmodule/accountpages/app-create-journel') {
            this.activeIndex = 1;
        }
        else if (this.currentUrl == '/accountmodule/accountpages/app-list-journel') {
            this.activeIndex = 2;
        }

        else if (this.currentUrl == '/accountmodule/accountpages/app-import') {
            this.activeIndex = 3;
        }
        else if (this.currentUrl == '/accountmodule/accountpages/app-schedule') {
            this.activeIndex = 4;
        }



        this.items = [{
            label: 'View Batch',
            command: (event: any) => {
                this.activeIndex = 0;
                this.msgs.length = 0;
                this.msgs.push({ severity: 'info', summary: 'Create Asset', detail: event.item.label });
                this.route.navigateByUrl('/accountmodule/accountpages/app-view-batch');

            }
        },
        {
            label: 'Add Journel',
            command: (event: any) => {
                this.activeIndex = 1;
                this.msgs.length = 0;
                this.msgs.push({ severity: 'info', summary: 'Capes', detail: event.item.label });
                this.route.navigateByUrl('/accountmodule/accountpages/app-create-journel');
            }
            },
            {
                label: 'Journel List',
                command: (event: any) => {
                    this.activeIndex = 2;
                    this.msgs.length = 0;
                    this.msgs.push({ severity: 'info', summary: 'Capes', detail: event.item.label });
                    this.route.navigateByUrl('/accountmodule/accountpages/app-list-journel');
                }
            },
        {
            label: 'Import',
            command: (event: any) => {
                this.activeIndex = 3;
                this.msgs.length = 0;
                this.msgs.push({ severity: 'info', summary: 'Calibration', detail: event.item.label });
                this.route.navigateByUrl('/accountmodule/accountpages/app-import');
            }
        },
        {
            label: 'Schedule',
            command: (event: any) => {
                this.activeIndex = 4;
                this.msgs.length = 0;
                this.msgs.push({ severity: 'info', summary: 'Maintance & Warrenty', detail: event.item.label });
                this.route.navigateByUrl('/accountmodule/accountpages/app-schedule');
            }
        },
        ];
    }
}