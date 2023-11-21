import { html } from "lit";
import { pureLit } from "./pure-lit";

test("pure-lit", async () => {
    const component = pureLit("hello-lit", () => html`<p>Hello Lit!</p>`);
    document.body.appendChild(component)
    await component.updateComplete
    expect(component.shadowRoot?.textContent).toContain("Hello Lit!")
  })