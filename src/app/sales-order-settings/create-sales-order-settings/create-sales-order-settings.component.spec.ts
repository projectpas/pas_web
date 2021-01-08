import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CreateSalesOrderSettingsComponent } from './create-sales-order-settings.component';

let component: CreateSalesOrderSettingsComponent;
let fixture: ComponentFixture<CreateSalesOrderSettingsComponent>;

describe('create-sales-order-settings component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateSalesOrderSettingsComponent],
            imports: [BrowserModule],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CreateSalesOrderSettingsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});