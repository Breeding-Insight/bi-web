export class Collaborator {
    collaboratorId: string;
    active: boolean;
    userId: string;
    name: string;
    email: string;

    constructor(id: string, active: boolean, userId: string, name: string, email: string) {
        this.collaboratorId = id;
        this.active = active;
        this.userId = userId;
        this.name = name;
        this.email = email;
    }
}