import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatedLike } from '../../models/like/like.model';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../paginator/paginator.component';
import {MatCardModule} from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-like-modal',
  standalone: true,
  imports: [CommonModule, PaginatorComponent, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './like-modal.component.html',
  styleUrl: './like-modal.component.scss'
})
export class LikeModalComponent {

  itemsPerPage = 15;

  @Input({required: true}) paginatedLike?: PaginatedLike;
  @Input() loading = false;
  @Output() pageChanged = new EventEmitter<string>();

  changePage(page: number){
    const pageStr = String(page)
    this.pageChanged.emit(pageStr)
  }
}
