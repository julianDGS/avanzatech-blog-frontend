import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

fdescribe('StorageService', () => {
  let service: StorageService;
  const itemKey = 'test-item';
  const itemValue = {value: 'test-item-value'}

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get from local storage', async () => {
    localStorage.setItem(itemKey, JSON.stringify(itemValue));
    const resp = await service.get(itemKey);
    expect(resp.hasOwnProperty('value')).toBeTruthy();
    expect(resp.value).toEqual(itemValue.value);
    localStorage.removeItem(itemKey);
  })

  it('should handle non defined value when get from local storage', async () => {
    const resp = await service.get('non-defined');
    expect(resp).toBeNull();
  })

  it('should set an item', () => {
    service.set(itemKey, itemValue);
    const value = localStorage.getItem(itemKey);
    expect(JSON.parse(value!).value).toEqual(itemValue.value);
  })
  
  it('should delete an item', () => {
    localStorage.setItem(itemKey, JSON.stringify(itemValue));
    service.delete(itemKey);
    const value = localStorage.getItem(itemKey);
    expect(value).toBeNull();
  })
  
  it('should handle non define key on delete', () => {
    expect(() => service.delete(itemKey)).not.toThrowError();
  })

});
