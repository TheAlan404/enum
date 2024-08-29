# `@alan404/enum`

TypeScript "algebraic" enums

## Usage

```ts
import { Enum, match, createFactory, variant } from "@alan404/enum";

type Segment = Enum<{
    text: { content: string; bold: boolean };
    link: { label: string; link: string };
    image: { src: string };
}>;

// Segment is represented as:
// { type: "text", data: { ... } }
//   | { type: "link", data: { ... } }
//   | ...

const segmentToString = (segment: Segment) => {
    // rust-style match!
    return match(segment)({
        text: ({ content }) => content,
        link: ({ label, link }) => `[${label}](${link})`,
        _: () => "Unknown",
    });
    // types inferred!
};

segmentToString({
    type: "text",
    data: {
        content: "hi",
        bold: false
    },
});

// NEW! in 0.2
// Optional variant function
segmentToString(
    variant<Segment>("image", { src: "..." })
)

// NEW! in 0.2
// Optional factory-style
const Segment = createFactory<Segment>();

segmentToString(
    Segment.text({ content: "meow", bold: true })
)
```

## Exports

### `Enum<O>`

`O extends Record<string, any>`

`O` is an object where the key is the enum variant's name and the value is it's data.

Example:

```ts
type SingleOrMany<T> = Enum<{
    single: T,
    many: T[],
}>

// type SingleOrMany<T> =
//   { type: "single", data: T } | { type: "many", data: T[] }
```

### `match`

Signature: `match<Enum, R>(value: Enum) => (matchers: Matcher<Enum, R>) => R`

Match on an enum variant. You need to either exhaustively match all variants or provide a wildcard match

Example:

```ts
type MyEnum = Enum<{
    a: number;
    b: string[];
    c: boolean;
}>

let value: MyEnum = { type: "a", data: 1 };

// Exhaustive match
match(value)({
    a: () => {},
    b: () => {},
    c: () => {},
})

// Wildcard match
match(value)({
    a: () => {},
    _: () => {},
})

// Example with return value
let stringified = match(value)({
    a: (n: number) => n.toString(),
    b: (arr: string[]) => arr.join(", "),
    c: (b: boolean) => b ? "yes" : "no",

    // example with wildcard
    _: (value: MyEnum) => JSON.stringify(value),
});

// PS. types are annotated purely for documentation,
// your IDE should be able to infer them!
```

### `EnumVariant<Enum, Type>`

`Enum extends Enum<O>`, `Type extends Enum["type"]`

Extract a variant of an enum

Example:

```ts
EnumVariant<SingleOrMany<T>, "single">
// = { type: "single", data: T }
```

### `EnumData<Enum, Type>`

`Enum extends Enum<O>`, `Type extends Enum["type"]`

Similar to `EnumVariant`, but extracts its data type instead

```ts
EnumData<SingleOrMany<T>, "many">
// = T[]
```

### `variant<Enum>(type, data) => Enum`

Create an enum variant

### `createFactory<Enum>() => EnumInitializers<Enum>`

Creates an enum factory. Use it like this:

```ts
const SingleOrMany = createFactory<SingleOrMany>();
type SingleOrMany = Enum<{
    single: string,
    many: string[],
}>

SingleOrMany.single("hello world");
// { type: "single", data: "hello world" }
```
