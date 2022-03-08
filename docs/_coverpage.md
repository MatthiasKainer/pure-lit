# pure-lit

[![Version](https://img.shields.io/npm/v/pure-lit?style=for-the-badge)](https://www.npmjs.com/package/pure-lit)
[![Size](https://img.shields.io/bundlephobia/minzip/pure-lit?style=for-the-badge)](https://bundlephobia.com/result?p=pure-lit)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/pure-lit?style=for-the-badge)](https://snyk.io/test/github/MatthiasKainer/pure-lit?targetFile=package.json)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=for-the-badge)](https://bundlephobia.com/result?p=pure-lit)<br>
![Statements](badges/badge-statements.svg)
![Branch](badges/badge-branches.svg)
![Functions](badges/badge-functions.svg)
![Lines](badges/badge-lines.svg)

> [lit](https://lit.dev/) elements as a pure function.


- Simple and lightweight
- No classes
- With state, reducer and workflows

<style>
    .cover-code>pre {
        text-align: left;
        width: 72ch;
        margin: 0 auto;
    }
</style>

<div class="cover-code">

```html
<script type="module">
    import { html } from "https://unpkg.com/lit@latest?module";
    import { pureLit } from "https://unpkg.com/pure-lit@latest?module";

    pureLit("hello-world", () => html`<div>Hello World!</div>`);
</script>
<hello-world></hello-world>
```

</div>

[GitHub](https://github.com/MatthiasKainer/pure-lit)
[Get Started](getting-started.md)