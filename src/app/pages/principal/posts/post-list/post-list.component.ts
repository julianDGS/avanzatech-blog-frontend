import { Component, OnInit, signal } from '@angular/core';
import { PostService } from '../../../../services/post/post.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit {
  
  page = signal(0);
  posts = signal<unknown>([])

  constructor(
    private postSV: PostService
  ){}

  ngOnInit(): void {
    let page = '';
    if(this.page() !== 0){
      page = String(this.page());
    }
    this.postSV.listPosts(page).subscribe((resp) => {
      this.posts.set(resp)
      console.log(this.posts());
    })
  }

}
