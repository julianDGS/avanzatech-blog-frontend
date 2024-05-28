import { User } from "../user/user.model";
import { Permissions } from "./permission.model";

export interface PaginatedPost {
    next:         string;
    previous:     string;
    total_count:  number;
    current_page: number;
    total_pages:  number;
    results:      Post[];
}

export interface Post {
    id:          number;
    createdAt:   Date,
    title:       string;
    content:     string;
    excerpt:     string;
    author:      Omit<User, 'name' | 'last_name'>;
    permissions: Permissions;
    likes:       number;
    comments:    number;
    post_liked?: boolean;
}


