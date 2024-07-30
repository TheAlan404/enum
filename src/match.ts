import { Enum } from "./enum";

type Obj = Record<string, any>;

export type ExhaustiveMatcher<T extends Enum<Obj>, R> = {
    [P in Extract<T["type"], string>]: (v: Extract<T, { type: P }>["data"]) => R;
};

export type WildcardMatcher<T extends Enum<Obj>, R> = Partial<ExhaustiveMatcher<T, R>> & { _: (v: T) => R };

export type Matcher<T extends Enum<Obj>, R> = ExhaustiveMatcher<T, R> | WildcardMatcher<T, R>;

export const match = <T extends Enum<Obj>, R>(value: T) =>
    (matchers: Matcher<T, R>) =>
        (matchers[value.type] ? matchers[value.type](value.data) : (matchers["_"]())) as R;


