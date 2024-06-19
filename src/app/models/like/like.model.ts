import { Post } from "../post/post.model";
import { User } from "../user/user.model";

export interface PaginatedLike {
    next:         string;
    previous:     string;
    total_count:  number;
    current_page: number;
    total_pages:  number;
    results:      Like[];
}

export interface Like {
    id:   number;
    post: Pick<Post, 'id' | 'title'>;
    user: Omit<User, 'name' | 'last_name' | 'team'>;
}
