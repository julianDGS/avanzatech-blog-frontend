export interface Permissions {
    public: PermissionResponse;
    auth:   PermissionResponse;
    team:   PermissionResponse;
    author: PermissionResponse;
}

export interface PermissionResponse {
    id:   number;
    name: string;
}