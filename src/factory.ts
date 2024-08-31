import { Enum, EnumData, EnumVariant } from "./enum";

type Obj = Record<string, any>;

export type EnumInitializers<E extends Enum<Obj>> = {
    [Variant in E["type"]]: (data: EnumData<E, Variant>) => EnumVariant<E, Variant>;
};

type IsEmptyObject<T> = T extends Record<string, never> ? true : false;
export type EnumExtra<E extends Enum<Obj>> = Omit<E, keyof Enum<Obj>>;
export type FactoryCompleter<E extends Enum<Obj>> = (e: Pick<E, keyof Enum<Obj>>) => EnumExtra<E>;

export const createFactory = <E extends Enum<Obj>>(
    ...[completer]: IsEmptyObject<EnumExtra<E>> extends true ? [completer?: FactoryCompleter<E>] : [completer: FactoryCompleter<E>]
): EnumInitializers<E> => {
    return new Proxy({}, {
        get: (_, type: E["type"]) => {
            return (data: E["data"]): E => ({
                type,
                data,
                ...completer?.({ type, data }),
            }) as E;
        },
    }) as EnumInitializers<E>;
};
