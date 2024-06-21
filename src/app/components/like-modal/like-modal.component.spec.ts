import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikeModalComponent } from './like-modal.component';
import { generatePaginatedLike } from '../../models/like/like.mock';
import { By } from '@angular/platform-browser';
import { PaginatorComponent } from '../paginator/paginator.component';

describe('LikeModalComponent', () => {
  let component: LikeModalComponent;
  let fixture: ComponentFixture<LikeModalComponent>;
  const mockPagLike = generatePaginatedLike();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LikeModalComponent);
    component = fixture.componentInstance;
    component.paginatedLike = mockPagLike;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show paginated results', () => {
    const content = fixture.debugElement.query(By.css('mat-card-content'))
    expect(content.children.length).toEqual(mockPagLike.results.length);
    expect(content.children[0].properties['innerText']).toBe(mockPagLike.results[0].user.nickname);

  })

  it('should not show paginated results if length is zero', () => {
    component.paginatedLike = undefined;
    fixture.detectChanges();
    const content = fixture.debugElement.query(By.css('mat-card-content'))
    expect(content).toBeNull()
  })

  it('should send data to paginator', () => {
    const paginator = fixture.debugElement.query(By.css('app-paginator')).componentInstance as PaginatorComponent;
    expect(paginator.isPostPaginator).toBeFalsy();
    expect(paginator.itemsPerPage).toEqual(component.itemsPerPage);
    expect(paginator.totalPages).toEqual(mockPagLike.total_pages);
    expect(paginator.totalItems).toEqual(mockPagLike.total_count);
  })

  it('should emit page number on page change', () => {
    spyOn(component.pageChanged, 'emit').and.callThrough();
    const pageNumber = 2;
    component.changePage(pageNumber);
    expect(component.pageChanged.emit).toHaveBeenCalledOnceWith(String(pageNumber));
  })


});
