import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroZoekplatform } from './hero-zoekplatform';

describe('HeroZoekplatform', () => {
  let component: HeroZoekplatform;
  let fixture: ComponentFixture<HeroZoekplatform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroZoekplatform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroZoekplatform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
