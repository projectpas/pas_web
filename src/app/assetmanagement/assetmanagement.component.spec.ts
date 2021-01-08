
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { AssetmanagementComponent } from './assetmanagement.component';

let component: AssetmanagementComponent;
let fixture: ComponentFixture<AssetmanagementComponent>;

describe('assetmanagement component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AssetmanagementComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(AssetmanagementComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});