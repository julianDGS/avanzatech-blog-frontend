import { Component, ElementRef, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { PostService } from '../../../../services/post/post.service';

import {MatCardModule} from '@angular/material/card';

import { PaginatedPost, Post } from '../../../../models/post/post.model';
import { PaginatorComponent } from '../../../../components/paginator/paginator.component';
import { StorageService } from '../../../../services/util/storage.service';
import { PostComponent } from '../../../../components/post/post.component';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, debounceTime, delay, finalize, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    RouterLink,
    
    MatCardModule,
    MatIconModule, 
    MatButtonModule, 
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    
    PostComponent,
    PaginatorComponent
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit, OnDestroy {
  
  paginatedObject = signal<PaginatedPost | null>(null)
  isLogged = signal(false);
  itemsPerPage = 10;
  filterSubscription?: Subscription;
  filter$ = new Subject<string>();
  filterValue?: string;
  loading = signal(false)
  private user?: {id: number, teamId: number};
  
  @ViewChild('filter') filter!: ElementRef<HTMLInputElement>;

  constructor(
    private postSV: PostService,
    private toastrSV: ToastrService,
    private storageSV: StorageService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ){
    this.matIconRegistry.addSvgIcon(
      'search',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/images/search.svg'
      )
    );
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.filterSubscription = this.filter$
    .pipe(
      debounceTime(300)
    )
    .subscribe(inputValue => {
      if(inputValue){
        this.filterValue = inputValue;
      } else {
        this.filterValue = undefined;
      }
      this.listPosts();
    })

    this.listPosts();
    this.loadUser();
  }

  private async loadUser(){
    const resp = await this.storageSV.get('logged-user')
      if(resp && resp !== null){
        this.isLogged.set(true)
        this.user = {
          id: resp.id,
          teamId: resp.teamId
        }
      }
  }

  private listPosts(page='1'){
    this.loading.set(true);
    this.postSV.listPosts(page, this.filterValue)
    .pipe(
      tap(resp => {
        this.canEdit(resp.results)
      }),
      delay(300),
      finalize(() => this.loading.set(false)),
    )
    .subscribe((resp) => {
      this.paginatedObject.set(resp);
    })
  }

  private canEdit(posts: Post[]){
    if(this.isLogged()){
      for (let post of posts) {
        if (post.author.id === this.user?.id && post.permissions.author.name === 'edit') {
          post.can_edit = true
        } else if (post.author.team?.id === this.user?.teamId && post.permissions.team.name === 'edit') {
          post.can_edit = true
        } else if (post.permissions.auth.name === 'edit') {
          post.can_edit = true
        } else {
          post.can_edit = false
        }
      }
    }
  }

  changePage(page: number){
    const pageStr = String(page)
    this.listPosts(pageStr);
  }

  deletePost(event: Post){
    if(event){
      this.postSV.deletePost(event.id).subscribe(() => {
        this.toastrSV.success(`${event.title} deleted succesfully`, 'Success', {
          progressBar: true
        })
        this.listPosts()
      })
    }
  }

  onFilter(){
    this.filter$.next(this.filter.nativeElement.value)
  }

}
