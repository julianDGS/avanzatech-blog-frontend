import { Post } from "../post/post.model";
import { User } from "../user/user.model";

export interface PaginatedComment {
    next:         string;
    previous:     string;
    total_count:  number;
    current_page: number;
    total_pages:  number;
    results:      Comment[];
}

export interface Comment {
    id:         number;
    comment:    string;
    created_at: Date;
    post:       Pick<Post, 'id' | 'title'>;
    user:       Omit<User, 'name' | 'lastname' | 'team'>;
}
