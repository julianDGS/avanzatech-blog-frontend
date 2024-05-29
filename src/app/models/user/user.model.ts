export interface User {
    id:        number;
    name:      string;
    last_name: string;
    email:     string;
    nickname:  string;
    team?:     Team;
}

export interface Team {
    id:     number,
    name:   string
}
