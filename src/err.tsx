export default class Err implements Error {
    readonly name: string = (this.constructor as any).name

    public constructor(public message: string) {}
}
