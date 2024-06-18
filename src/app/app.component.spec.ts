import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ThemeService } from './services/util/theme.service';
import { BehaviorSubject } from 'rxjs';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let themeSvSpy: jasmine.SpyObj<ThemeService>;
  let subject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    subject = new BehaviorSubject(true);
    themeSvSpy = jasmine.createSpyObj('ThemeService', [], {theme$: subject.asObservable()});
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {provide: ThemeService, useValue: themeSvSpy}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy();
  })

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'avanzatech_blog_frontend' title`, () => {
    expect(component.title).toEqual('avanzatech_blog_frontend');
  });

  it('should load theme class on init', () => {
    spyOn(component, 'loadTheme').and.callThrough();
    const body = fixture.debugElement.parent!;
    fixture.detectChanges(); //Executes a life cycle (to execute ngOnInit)
    expect(body.classes.hasOwnProperty('dark')).toBeTruthy();
    expect(body.classes.hasOwnProperty('light')).toBeFalsy();
    expect(component.loadTheme).toHaveBeenCalledTimes(1);
  })

  it('should toggleTheme when new Value is emitted', () => {
    spyOn(component, 'loadTheme').and.callThrough();
    const body = fixture.debugElement.parent!;
    fixture.detectChanges(); //Executes a life cycle (to execute ngOnInit)
    expect(body.classes.hasOwnProperty('dark')).toBeTruthy();
    expect(body.classes.hasOwnProperty('light')).toBeFalsy();
    
    //Toggle Theme
    subject.next(false);
    expect(body.classes.hasOwnProperty('dark')).toBeFalsy();
    expect(body.classes.hasOwnProperty('light')).toBeTruthy();
    expect(component.loadTheme).toHaveBeenCalledTimes(1);
  })
  
});
