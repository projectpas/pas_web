import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { SalesOrderSettingsListComponent } from './sales-order-settings-list.component';

let component: SalesOrderSettingsListComponent;
let fixture: ComponentFixture<SalesOrderSettingsListComponent>;

describe('sales-order-settings-list component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SalesOrderSettingsListComponent],
            imports: [BrowserModule],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(SalesOrderSettingsListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});