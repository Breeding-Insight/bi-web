export class Collaborator {
    id: string;
    active: boolean;
    userId: string;
    name: string;
    email: string;

    constructor(id: string, active: boolean, userId: string, name: string, email: string) {
        this.id = id;
        this.active = active;
        this.userId = userId;
        this.name = name;
        this.email = email;
    }
}