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

## Install

`npm install pure-lit`

## Usage

Register your lit-elements as a pure functions.

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
    props?: ([key: string]: PropertyDeclaration | string)[]
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
| `args.props` | Property declarations for the element. Can be either a string (in which case the type is not defined) or a well defined PropertyDeclaration |

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
