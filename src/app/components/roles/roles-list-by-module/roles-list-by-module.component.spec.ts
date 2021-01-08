/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { RolesListByModuleComponent } from './roles-list-by-module.component';

let component: RolesListByModuleComponent;
let fixture: ComponentFixture<RolesListByModuleComponent>;

describe('roles-list-by-module component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ RolesListByModuleComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(RolesListByModuleComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});