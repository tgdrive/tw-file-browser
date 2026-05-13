/** Local type aliases — formerly from tsdef */

export type Nullable<T> = T | null;
export type Nilable<T> = T | null | undefined;
export type Undefinable<T> = T | undefined;
export type MaybePromise<T> = T | Promise<T>;
export type WritableProps<T> = { -readonly [P in keyof T]: T[P] };
export type AnyObject = Record<string, any>;
