# Getting started

You can read an introduction here: [Write Less Code For Smaller Packages With `pure-lit`](https://matthias-kainer.de/blog/posts/write-less-code-with-pure-lit/)

## Install

```bash
npm install pure-lit
```

or add it to your page as module like this:

```html
<script type="module" src="//unpkg.com/pure-lit@latest?module"></script>
```

## Hello World

The quickest way of getting started is by using JavaScript modules.

Create a file `index.html` that looks like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Awesome pure-lit</title>
    <script type="module">
      import { html } from "https://unpkg.com/lit@latest?module";
      import { pureLit } from "https://unpkg.com/pure-lit@latest?module";

      pureLit(
        "hello-you",
        async ({ who }) => {
          return html`<div>Hello ${who}!</div>`;
        },
        {
          defaults: { who: "" },
        }
      );
    </script>
  </head>
  <body>
    <hello-you who="me"></hello-you>
  </body>
</html>
```

Open it in the browser. Done.

## Function Interface

```typescript
pureLit = <TProps>(
  name: string,
  render: (element: LitElementWithProps<TProps>) => TemplateResult | Promise<TemplateResult>,
  args?: {
    styles?: CSSResult | CSSResultArray
    props?: [key: string]: PropertyDeclaration[]
  } | {
    styles?: CSSResult | CSSResultArray
    defaults?: {[key: string]: unknown}
  }
)
```

| name            | description                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `name`          | the name of the custom element                                                                                    |
| `render`        | a function that gets a `LitElement` with specified `Props`, and returns a `lit-html` TemplateResult. Can be async |
| `args.styles`   | `lit-html` CSSResult or CSSResultArray to add styles to the custom component                                      |
| `args.props`    | Property declarations for the element. A well defined PropertyDeclaration                                         |
| `args.defaults` | Set defaults for the properties. If set and no props are set, the PropertyDeclaration will be created for you     |


## Adding some state 

pureLit exports the hooks from [lit-element-state-decoupler](https://github.com/MatthiasKainer/lit-element-state-decoupler) and [lit-element-effect](https://github.com/MatthiasKainer/lit-element-effect) which you can use to manage your state inside the functional components.

You can import them via

```typescript
import { pureLit, useState, useReducer, useWorkflow, useEffect, useOnce } from "pure-lit";
```

and then use them like this:

```typescript
pureLit("hello-world", (element) => {
    const counter = useState(element, 0);
    return html`<button @click="${() => counter.set(counter.get() + 1)}">You clicked me ${counter.get()} times!</button>`
});
```

## Example using a lot of things

```typescript
type Props = { id: number };

const baseUrl = "https://jsonplaceholder.typicode.com/users"

pureLit("hello-incrementor",
  // this is an async function now, allowing us to await
  async (element: LitElementWithProps<Props>) => {
    // clicks is maintaining the state how often the item has been clicked
    const clicks = useState(element, element.id)
    // the number of clicks is used as id of the user to fetch
    const { name } = await fetch(`${baseUrl}/${clicks.value}`)
        .then((response) => response.json());
    return html`
      <p>
        Hello <em @click=${() => {
          clicks.set(clicks.value + 1)
        }}> ${name} </em>!
      </p>
      <p>
        You were clicked ${clicks.value} times
      </p>`;
  },
  {
    styles: [
      css`
        :host {
          display: block;
        }
      `,
      css`
        em {
          color: red;
        }
      `,
    ],
    defaults: {
      id: 1,
    },
  }
);
```

## More examples

For more examples see [MatthiasKainer/pure-lit-demos](https://github.com/MatthiasKainer/pure-lit-demos)