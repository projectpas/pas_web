/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { RolesSetupComponent } from './roles-setup.component';

let component: RolesSetupComponent;
let fixture: ComponentFixture<RolesSetupComponent>;

describe('roles-setup component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ RolesSetupComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(RolesSetupComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});