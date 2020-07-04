# pure-lit

![Statements](badges/badge-statements.svg)
![Branch](badges/badge-branches.svg)
![Functions](badges/badge-functions.svg)
![Lines](badges/badge-lines.svg)

A lightweight utility for state handling outside of the component for [lit-elements](https://lit-element.polymer-project.org/)

## Install

`npm install pure-lit`

## Usage

Register your lit-elements as a pure functions.


```ts

type Props = { who: string }

pureLit("hello-world",
  ({who}: Props) => html`Hello ${who}!`,
  { props: ["who"] }
);

```

_index.ts_

```html
<hello-world who="everyone"></hello-world>
```

_index.html_


> Hello everyone!

_browser_

## Advances usage

Most powerful in combination with `lit-element-state-decoupler` and `lit-element-effect`. An example can be [found here](docs/Example.ts)

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
