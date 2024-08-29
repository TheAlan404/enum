type Obj = Record<string, any>;

export type Enum<T extends Obj> = {
    [K in keyof T]: { type: K, data: T[K] }
}[keyof T];

type A = Enum<{ a: string; b: number }>

export type InverseEnum<E extends Enum<Obj>> = {
    [Type in E["type"]]: EnumData<E, Type>;
};

export type EnumVariant<E extends Enum<Obj>, Type extends E["type"]> = Extract<E, { type: Type }>;

export type EnumData<E extends Enum<Obj>, Type extends E["type"]> = EnumVariant<E, Type>["data"];

export type EnumAsTuple<E extends Enum<Obj>> = {
    [Variant in E["type"]]: [Variant, EnumData<E, Variant>];
}[E["type"]];


