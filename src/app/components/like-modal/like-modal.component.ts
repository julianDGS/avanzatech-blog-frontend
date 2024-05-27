import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatedLike } from '../../models/like/like.model';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../paginator/paginator.component';
import {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-like-modal',
  standalone: true,
  imports: [CommonModule, PaginatorComponent, MatCardModule],
  templateUrl: './like-modal.component.html',
  styleUrl: './like-modal.component.scss'
})
export class LikeModalComponent {

  itemsPerPage = 20;

  @Input({required: true}) paginatedLike?: PaginatedLike;
  @Output() pageChanged = new EventEmitter<string>();

  changePage(page: number){
    const pageStr = String(page)
    this.pageChanged.emit(pageStr)
  }
}
