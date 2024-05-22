export interface AuthRequest{
    password: string,
    username?: string,
    email?: string,
    name?: string,
    last_name?: string,
    confirm_password?: string
}