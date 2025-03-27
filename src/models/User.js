class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    getDetails() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
        };
    }
}

module.exports = User;
