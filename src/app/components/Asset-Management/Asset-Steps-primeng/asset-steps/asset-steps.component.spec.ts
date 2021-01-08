import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AssetStepsComponent } from './asset-steps.component';

let component: AssetStepsComponent;
let fixture: ComponentFixture<AssetStepsComponent>;

describe('Asset-Steps component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AssetStepsComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AssetStepsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});