/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AssetMaintenanceWarrantyComponent } from './asset-maintenance-warranty.component';

let component: AssetMaintenanceWarrantyComponent;
let fixture: ComponentFixture<AssetMaintenanceWarrantyComponent>;

describe('asset-maintenance-warranty component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AssetMaintenanceWarrantyComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AssetMaintenanceWarrantyComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});