class CustomError extends Error {
    constructor(s, msg) {   
        super();
        this.status = s;
        this.message = msg;
    }

    getStatus() {
        return this.status;
    }

    getMessage() {
        return this.message;
    }
}

module.exports = CustomError;