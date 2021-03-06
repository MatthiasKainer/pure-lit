# pure-lit

[![Version](https://img.shields.io/npm/v/pure-lit?style=for-the-badge)](https://www.npmjs.com/package/pure-lit)
[![Size](https://img.shields.io/bundlephobia/minzip/pure-lit?style=for-the-badge)](https://bundlephobia.com/result?p=pure-lit)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/pure-lit?style=for-the-badge)](https://snyk.io/test/github/MatthiasKainer/pure-lit?targetFile=package.json)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=for-the-badge)](https://bundlephobia.com/result?p=pure-lit)
![Statements](badges/badge-statements.svg)
![Branch](badges/badge-branches.svg)
![Functions](badges/badge-functions.svg)
![Lines](badges/badge-lines.svg)

A lightweight utility for state handling outside of the component for [lit-elements](https://lit-element.polymer-project.org/)

You can read an introduction here: [Write Less Code For Smaller Packages With `pure-lit`](https://matthias-kainer.de/blog/posts/write-less-code-with-pure-lit/)

Find a demo [here](https://matthiaskainer.github.io/pure-lit/)

## Install

`npm install pure-lit`

## Usage

Register your lit-elements as pure functions.

Import via 

```ts
import {pureLit} from "pureLit"
// if you want hooks from lit-element-state-decoupler & lit-element-effect
import {
  pureLit, 
  useState, 
  useReducer, 
  useEffect, 
  useOnce
} from "pure-lit/lib/full"
```

_index.ts_

```ts
type Props = { who: string }

pureLit("hello-world",
  ({who}: Props) => html`Hello ${who}!`,
  { defaults: { who: "noone" } }
);

```

_index.html_

```html
<hello-world who="everyone"></hello-world>
```

_browser_

> Hello everyone!

## Interface

```ts
pureLit = <TProps>(
  name: string,
  render: (element: LitElementWithProps<TProps>) => TemplateResult,
  args?: {
    styles?: CSSResult | CSSResultArray
    props?: [key: string]: PropertyDeclaration[]
  } | {
    styles?: CSSResult | CSSResultArray
    defaults?: {[key: string]: unknown}
  }
)
```

| name | description |
|--|--|
| `name` | the name of the custom element |
| `render` | a function that gets a `LitElement` with specified `Props`, and returns a `lit-html` TemplateResult |
| `args.styles` | `lit-html` CSSResult or CSSResultArray to add styles to the custom component |
| `args.props` | Property declarations for the element. A well defined PropertyDeclaration |
| `args.defaults` | Set defaults for the properties. If set and no props are set, the PropertyDeclaration will be created for you |

## Example using everything

```ts
type Props = { who: string }

pureLit("hello-world",
  (element: LitElementWithProps<Props>) => html`Hello
  <em @click=${() =>
    element.dispatchEvent(
      new CustomEvent(
        "highlight",
        {detail: element.who}
      )
    )}>
      ${element.who}
    </em>!`,
  {
    styles: [
      css`:host { display:block; }`,
      css`em { color: red; }`
    ]
    defaults: [
      "who" : "noone",
    ]
  }
);
  

```

## Testing

### Jest

It's pretty simple to test it with jest. In your jest config you will need the following two lines

```json
  "preset": "ts-jest/presets/js-with-babel",
  "transformIgnorePatterns": [
    "node_modules/(?!(lit-element|lit-html|pure-lit)/)"
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

```ts
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

## Advances usage

Most powerful in combination with `pure-lit` and `lit-element-effect`. An example can be [found here](docs/Example.ts)

```ts
pureLit("todo-app", (element: LitElement) => {
    const { getState, publish } = useState<string[]>(element, []);
    return html`
      <div>
        <todo-add @add=${(e: CustomEvent<string>) => publish([...getState(), e.detail])}></todo-add>
      </div>
      <div>
        <todo-list
          .items=${getState()}
          @remove=${(e: CustomEvent<string>) => publish([...getState().filter((el) => el === e.detail)])}
        ></todo-list>
      </div>
    `;
  }
);

```
