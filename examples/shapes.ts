import { createFactory, Enum, match, variant } from "../src"

const Shape = createFactory<Shape>();
type Shape = Enum<{
    Triangle: { base: number };
    Square: { length: number };
    Circle: { circumference: number };
    Rectangle: {};
}>;

const storage: Shape[] = [
    // All three are the same:
    Shape.Triangle({ base: 2 }),
    variant<Shape>("Triangle", { base: 2 }),
    { type: "Triangle", data: { base: 2 } },
    //
    Shape.Circle({ circumference: 1 }),
];

for(let shape of storage) {
    let message = match(shape)({
        Circle: () => "a circle?? in the triangle factory?? how queer!!",
        _: () => "",
    });

    console.log(message);
}
