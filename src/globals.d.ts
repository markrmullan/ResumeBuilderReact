// TODO: in the future, make this stricter. for now, useful to indicate that a property is a uuid and not just a regular string
type Uuid = string;

type Maybe<T> = T | undefined;
type Nullable<T> = T | null;
type Voidable<T> = T | void;

type Obj<T> = Record<PropertyKey, T>;

declare const DEVELOPMENT: boolean;
declare const PRODUCTION: boolean;

declare module 'i18next-xhr-backend';
declare module 'i18next-browser-languagedetector';

declare module 'react-async-button';

interface Window {
  FB: any;
}

declare module '*.ttf' {
    const content: any;
    export default content;
}
