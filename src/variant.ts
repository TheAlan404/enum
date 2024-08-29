import { Enum, EnumAsTuple } from "./enum";

type Obj = Record<string, any>;

export const variant = <E extends Enum<Obj>>(
    ...[type, data]: EnumAsTuple<E>
): E => ({ type, data }) as E;
