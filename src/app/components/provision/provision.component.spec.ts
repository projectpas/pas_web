/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ProvisionComponent } from './provision.component';

let component: ProvisionComponent;
let fixture: ComponentFixture<ProvisionComponent>;

describe('Provision component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ProvisionComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ProvisionComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});