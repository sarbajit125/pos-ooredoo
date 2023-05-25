

export class UnauthorizedError extends Error {
    statusCode:number
    constructor(message: string) {
        super(message)
        this.statusCode = 400
    }
}

export class APIError extends Error {
    statusCode: number
    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
    }
}

export interface LoginSuccessfull {
    message: string
}

export interface RoleChangeSuccss {
    responseBody: string
}

