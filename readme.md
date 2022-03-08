# pure-lit

[![Version](https://img.shields.io/npm/v/pure-lit?style=for-the-badge)](https://www.npmjs.com/package/pure-lit)
[![Size](https://img.shields.io/bundlephobia/minzip/pure-lit?style=for-the-badge)](https://bundlephobia.com/result?p=pure-lit)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/pure-lit?style=for-the-badge)](https://snyk.io/test/github/MatthiasKainer/pure-lit?targetFile=package.json)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=for-the-badge)](https://bundlephobia.com/result?p=pure-lit)
![Statements](docs/badges/badge-statements.svg)
![Branch](docs/badges/badge-branches.svg)
![Functions](docs/badges/badge-functions.svg)
![Lines](docs/badges/badge-lines.svg)

> [lit](https://lit.dev/) with pure functions.


## Install

`npm install pure-lit`

or add it to your page as module like this:

`<script type="module" src="https://unpkg.com/pure-lit@latest?module"></script>`

## Getting started

[![pure-lit.org](docs/img/documentation-button.png)](https://pure-lit.org)

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