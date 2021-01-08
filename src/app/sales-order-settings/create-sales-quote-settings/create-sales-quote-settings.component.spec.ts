import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CreateSalesQuoteSettingsComponent } from './create-sales-quote-settings.component';

let component: CreateSalesQuoteSettingsComponent;
let fixture: ComponentFixture<CreateSalesQuoteSettingsComponent>;

describe('create-work-order-settings component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateSalesQuoteSettingsComponent],
            imports: [BrowserModule],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CreateSalesQuoteSettingsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});