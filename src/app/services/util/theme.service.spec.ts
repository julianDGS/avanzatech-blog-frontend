import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';
import { StorageService } from './storage.service';
import { switchMap, take } from 'rxjs';

describe('ThemeService', () => {
  let service: ThemeService;
  let storageServiceMock: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    storageServiceMock = jasmine.createSpyObj('StorageService', ['set']);
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        {provide: StorageService, useValue: storageServiceMock}
      ]
    });
  });

  it('should be created', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  
  it('should load a defined value', (doneFn) => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify("light"))
    service = TestBed.inject(ThemeService);
    service.theme$.subscribe(resp => {
      expect(resp).toBeFalsy();
      doneFn();
    })
  });
  
  describe('', () => {
    
    beforeEach(() => {
      service = TestBed.inject(ThemeService);
    });

    it('should load default value if it is not defined', (doneFn) => {
      service.theme$.subscribe(resp => {
        expect(resp).toBeTruthy(); //It means dark theme will be setted
        doneFn();
      })
    });
  
    it('should toggle the value', (done) => {
      service.theme$
      .pipe(
        take(1),
        switchMap(value => {
          expect(value).toBeTruthy();
          service.toggleTheme();
          return service.theme$
        }),
        take(1)
      )
      .subscribe(newValue => {
        expect(newValue).toBeFalsy();
        expect(storageServiceMock.set).toHaveBeenCalledTimes(1);
        expect(storageServiceMock.set).toHaveBeenCalledWith('theme', 'light');
        done();
      });
    });

  })

});
