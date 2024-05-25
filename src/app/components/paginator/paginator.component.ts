import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent  {

  currentPage = signal<number>(1);
  currentFirstItem = signal<number>(1);
  
  @Input({required: true}) itemsPerPage!: number;
  @Input({required: true}) totalPages!: number;
  @Input() totalItems = 0;
  @Output() onChangeClick = new EventEmitter<number>()

  get currentLastItem(){
    if(this.currentPage() === this.totalPages){
      return this.totalItems; 
    }
    return this.currentFirstItem() + this.itemsPerPage - 1;
  }

  previousPage(){
    this.currentFirstItem.update(curr =>  curr - this.itemsPerPage);
    this.currentPage.update(curr =>  curr - 1);
    if (this.currentPage() >= 0){
      this.onChangeClick.emit(this.currentPage());
    }
  }

  nextPage(){
    this.currentFirstItem.update(prev =>  prev + this.itemsPerPage);
    this.currentPage.update(prev =>  prev + 1);
    if(this.currentPage() <= this.totalPages){
      this.onChangeClick.emit(this.currentPage());
    }
  }

  firstPage(){
    this.currentFirstItem.set(1);
    this.currentPage.set(1);
    this.onChangeClick.emit(this.currentPage());
  }

  lastPage(){
    this.currentFirstItem.set(this.itemsPerPage*(this.totalPages-1));
    this.currentPage.set(this.totalPages);
    this.onChangeClick.emit(this.currentPage());
  }

}
