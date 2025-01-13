export interface responseSumSub {
    token: string
    userId: string

    // si hay errores
    description: string
    code: number
    correlationId: string
    errorCode: number
    errorName: string
}