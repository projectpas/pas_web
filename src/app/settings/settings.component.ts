// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatExpansionPanel } from '@angular/material';

import 'rxjs/add/operator/switchMap';

import { UserEditorComponent } from '../admin/user-editor.component';
import { UserPreferencesComponent } from './user-preferences.component';
import { AppTranslationService } from "../services/app-translation.service";
import { Permission } from '../models/permission.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { AccountService, RolesChangedEventArg } from "../services/account.service";
import { AlertService, DialogType, MessageSeverity } from '../services/alert.service';
import { fadeInOut } from '../services/animations';
import { Utilities } from '../services/utilities';
import { AuthService } from '../services/auth.service';


@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    animations: [fadeInOut]
})
export class SettingsComponent implements OnInit, OnDestroy, AfterViewInit {
    fragmentSubscription: any;

    @ViewChild('profile',{static:false}) profilePanel: MatExpansionPanel
    @ViewChild('preferences',{static:false}) preferencesPanel: MatExpansionPanel

    @ViewChild(UserEditorComponent,{static:false}) userProfile: UserEditorComponent;

    @ViewChild(UserPreferencesComponent,{static:false}) userPreferences: UserPreferencesComponent;

    constructor(
        private alertService: AlertService,
        private router: Router,
        private route: ActivatedRoute,
        private translationService: AppTranslationService,
        private accountService: AccountService,
        private authService:AuthService
    ) { }

    ngOnInit() {
        this.fragmentSubscription = this.route.fragment.subscribe(anchor => {
            switch (anchor) {
                case 'preferences':
                    console.log(this.preferencesPanel);
                    this.preferencesPanel.open();
                    break;
                default:
                    console.log(this.profilePanel);
                    this.profilePanel.open();
            }
        });
    }

    ngAfterViewInit() {
        this.loadCurrentUserData();

        this.userProfile.userSaved$.subscribe(user => {
            this.alertService.showMessage("Success", "Changes to your User Profile was saved successfully", MessageSeverity.success);
        });
    }

    ngOnDestroy() {
        this.fragmentSubscription.unsubscribe();
    }

    public navigateToFragment(fragment: string) {
        if (fragment) {
            this.router.navigateByUrl(`/settings#${fragment}`);
        }
    }

    private loadCurrentUserData() {
        this.alertService.startLoadingMessage();
        //var userId=this.authService.currentUser.userName;
        if (this.canViewRoles) {
            this.accountService.getUserAndRoles().subscribe(
                results => this.onCurrentUserDataLoadSuccessful(results[0], results[1]),
                error => this.onCurrentUserDataLoadFailed(error)
            );
        }
        else {
            this.accountService.getUser().subscribe(
                user => this.onCurrentUserDataLoadSuccessful(user, user.roles.map(r => new Role(r))),
                error => this.onCurrentUserDataLoadFailed(error)
            );
        }
    }

    private onCurrentUserDataLoadSuccessful(user: User, roles: Role[]) {
        this.alertService.stopLoadingMessage();
        this.userProfile.setUser(user, roles);
    }

    private onCurrentUserDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Load Error", `Unable to retrieve user data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
            MessageSeverity.error, error);
    }

    get canViewRoles() {
        return this.accountService.userHasPermission(Permission.viewRolesPermission);
    }
}