import { False, True } from 'prisma';

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type XOR<T, U> =
    T extends object ?
    U extends object ?
    (Without<T, U> & U) | (Without<U, T> & T)
    : U : T

export type IsObject<T extends any> = T extends Array<any>
    ? False
    : T extends Date
    ? False
    : T extends Uint8Array
    ? False
    : T extends BigInt
    ? False
    : T extends object
    ? True
    : False