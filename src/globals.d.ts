// TODO: in the future, make this stricter. for now, useful to indicate that a property is a uuid and not just a regular string
type Uuid = string;

type Maybe<T> = T | undefined;
type Nullable<T> = T | null;
type Voidable<T> = T | void;

type Obj<T> = Record<PropertyKey, T>;

declare const DEVELOPMENT: boolean;

declare module 'react-async-button';
