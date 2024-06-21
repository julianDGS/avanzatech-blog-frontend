import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';
import { By } from '@angular/platform-browser';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    component.itemsPerPage = 10;
    component.totalPages = 5;
    component.totalItems = 45;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show counters of first, last and total items', () => {
    const content = fixture.debugElement.query(By.css('span'));
    expect(content.properties['innerText']).toContain(component.currentFirstItem());
    expect(content.properties['innerText']).toContain(component.currentLastItem);
    expect(content.properties['innerText']).toContain(component.totalItems);
  })

  it('should disable previous button in first page', () => {
    const prevButton = fixture.debugElement.query(By.css('#prev-btn'));
    expect(prevButton.attributes['disabled']).toBeTruthy()
  })

  it('should disable next button in last page', () => {
    component.currentPage.set(component.totalPages);
    fixture.detectChanges();
    const nextBtn = fixture.debugElement.query(By.css('#next-btn'));
    expect(nextBtn.attributes['disabled']).toBeTruthy()
  })

  it('should not show first page button if not post paginator', () => {
    component.isPostPaginator = false;
    fixture.detectChanges();
    const firstBtn = fixture.debugElement.query(By.css('#first-btn'));
    expect(firstBtn).toBeNull();
  })

  it('should not show last page button if not post paginator', () => {
    component.isPostPaginator = false;
    fixture.detectChanges();
    const lastBtn = fixture.debugElement.query(By.css('#last-btn'));
    expect(lastBtn).toBeNull()
  })

  it('should emit previous page value', () => {
    spyOn(component.onChangeClick, 'emit').and.callThrough();
    const page = 2
    const firstItem = 20;
    const items = component.itemsPerPage;
    component.currentPage.set(page);
    component.currentFirstItem.set(firstItem);
    const previousValue = component.currentPage();
    component.previousPage();
    expect(previousValue).toEqual(page);
    expect(component.currentFirstItem()).toEqual(firstItem - items);
    expect(component.currentPage()).toEqual(page - 1);
    expect(component.onChangeClick.emit).toHaveBeenCalledOnceWith(page - 1);
  })

  it('should emit next page value', () => {
    spyOn(component.onChangeClick, 'emit').and.callThrough();
    const page = 2
    const firstItem = 20;
    const items = component.itemsPerPage;
    component.currentPage.set(page);
    component.currentFirstItem.set(firstItem);
    const previousValue = component.currentPage();
    component.nextPage();
    expect(previousValue).toEqual(page);
    expect(component.currentFirstItem()).toEqual(firstItem + items);
    expect(component.currentPage()).toEqual(page + 1);
    expect(component.onChangeClick.emit).toHaveBeenCalledOnceWith(page + 1);
  })

  it('should emit last page value', () => {
    spyOn(component.onChangeClick, 'emit').and.callThrough();
    const page = 2
    const firstItem = 20;
    component.currentPage.set(page);
    component.currentFirstItem.set(firstItem);
    const previousValue = component.currentPage();
    component.firstPage();
    expect(previousValue).toEqual(page);
    expect(component.currentFirstItem()).toEqual(1);
    expect(component.currentPage()).toEqual(1);
    expect(component.onChangeClick.emit).toHaveBeenCalledOnceWith(1);
  })

  it('should emit first page value', () => {
    spyOn(component.onChangeClick, 'emit').and.callThrough();
    const page = 2
    const firstItem = 20;
    const items = component.itemsPerPage;
    component.currentPage.set(page);
    component.currentFirstItem.set(firstItem);
    const previousValue = component.currentPage();
    component.lastPage();
    expect(previousValue).toEqual(page);
    expect(component.currentFirstItem()).toEqual(items * 4);
    expect(component.currentPage()).toEqual(5);
    expect(component.onChangeClick.emit).toHaveBeenCalledOnceWith(5);
  })

  it('should change properties on changes', () => {
    const page = 2
    const firstItem = 20;
    component.currentPage.set(page);
    component.currentFirstItem.set(firstItem);
    const previousPageValue = component.currentPage();
    const previousFirstItem = component.currentFirstItem();
    expect(component.currentPage()).toEqual(previousPageValue);
    expect(component.currentFirstItem()).toEqual(previousFirstItem);
    component.ngOnChanges({});
    expect(component.currentPage()).toEqual(1);
    expect(component.currentFirstItem()).toEqual(1);
  })

});
