/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { WarehouseComponent } from './warehouse.component';

let component: WarehouseComponent;
let fixture: ComponentFixture<WarehouseComponent>;

describe('warehouse component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WarehouseComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(WarehouseComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});