export class User {
    id: string;
    name: string;
    email: string;
    roles: Array<string>;

    constructor(id:string, name: string, email: string, roles: Array<string>) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.roles = roles;
    }
}