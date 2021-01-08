import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CreateWOQuoteSettingsComponent } from './create-wo-quote-settings.component';

let component: CreateWOQuoteSettingsComponent;
let fixture: ComponentFixture<CreateWOQuoteSettingsComponent>;

describe('create-work-order-settings component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CreateWOQuoteSettingsComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CreateWOQuoteSettingsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});