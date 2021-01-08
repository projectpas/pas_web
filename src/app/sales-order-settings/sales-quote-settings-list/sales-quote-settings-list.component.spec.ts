import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { SalesQuoteSettingsListComponent } from './sales-quote-settings-list.component';

let component: SalesQuoteSettingsListComponent;
let fixture: ComponentFixture<SalesQuoteSettingsListComponent>;

describe('sales-order-settings-list component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SalesQuoteSettingsListComponent],
            imports: [BrowserModule],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(SalesQuoteSettingsListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});