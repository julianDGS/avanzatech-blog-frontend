export interface Permissions {
    public: string;
    auth:   string;
    team:   string;
    author: string;
}

export interface PermissionResponse {
    id:   number;
    name: string;
}