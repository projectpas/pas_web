/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { RolesManagementStructureComponent } from './roles-management-structure.component';

let component: RolesManagementStructureComponent;
let fixture: ComponentFixture<RolesManagementStructureComponent>;

describe('roles-management-structure component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ RolesManagementStructureComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(RolesManagementStructureComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});