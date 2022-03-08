# Testing

## Jest

It's pretty simple to test it with jest. In your jest config you will need the following two lines

```json
  "preset": "ts-jest/presets/js-with-babel",
  "transformIgnorePatterns": [
    "node_modules/(?!(lit|lit-element|lit-html|pure-lit)/)"
  ],
```

which you will need for lit-element and pure-lit to be transpiled as well.

Then you need (if you haven't already) a `babel.conf.js` with at least the following content

```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
  ],
};
```

The `pureLit` function returns the element, which you can then put on the page for tests.

The test itself can be seen [in this project](src/pure-lit.tests.ts), but the gist looks like this:

```typescript
// MyComponent.ts
export default pureLit("my-component",
      (el) => html`<p>Hello ${el.who}!</p>`,
      { defaults: { who: "noone" }});

// myComponent.test.ts
import MyComponent from "./MyComponent.ts"

describe("pure-lit", () => {
  type Props = { who: string }
  beforeEach(async () => {
    document.body.appendChild(MyComponent)
    await MyComponent.updateComplete
  })

  afterEach(() => {
    document.body.removeChild(MyComponent)
  })

  it("renders the default correctly", async () => {
    expect(MyComponent.shadowRoot?.innerHTML).toContain("Hello noone!")
  });

  it("renders updated props correctlty", async () => {
    MyComponent.setAttribute("who", "John")
    await MyComponent.updateComplete
    expect(MyComponent.shadowRoot?.innerHTML).toContain("<p>Hello John!</p>");
  });
```

Note that the tests in jest are not entirely side-effect free: In between the tests jsdom will not clean up the registry for the custom component. So if you create a component in the test, it's created only the first time.

This means you cannot change the behavior of the component later (ie change the render method, or the defaults). To run it with a different scenario create a new test file.