/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { RoSetupComponent } from './ro-setup.component';

let component: RoSetupComponent;
let fixture: ComponentFixture<RoSetupComponent>;

describe('ro-setup component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ RoSetupComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(RoSetupComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});