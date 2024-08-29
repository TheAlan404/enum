import { Enum, EnumData, EnumVariant } from "./enum";

type Obj = Record<string, any>;

export type EnumInitializers<E extends Enum<Obj>> = {
    [Variant in E["type"]]: (data: EnumData<E, Variant>) => EnumVariant<E, Variant>;
};

export const createFactory = <E extends Enum<Obj>>(): EnumInitializers<E> => {
    return new Proxy({}, {
        get: (_, type: E["type"]) => {
            return (data: E["data"]) => ({ type, data }) as E;
        },
    }) as EnumInitializers<E>;
};
