import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { WOQuoteSettingsListComponent } from './wo-quote-settings-list.component';

let component: WOQuoteSettingsListComponent;
let fixture: ComponentFixture<WOQuoteSettingsListComponent>;

describe('work-order-settings-list component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WOQuoteSettingsListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(WOQuoteSettingsListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});