import { pureLit } from "./pure-lit";
import { html, css } from "lit";
import { LitElementWithProps } from "./types";

describe("pure-lit with prop specs", () => {
  type Props = { who: string }
  let component: LitElementWithProps<Props>
  beforeEach(() => {
    component = pureLit("my-component", 
      (el : LitElementWithProps<Props>) => html`<p>Hello ${el.who}!</p>`,
      { 
        styles: [css`:host {}`],
        props: [ {"who": {type: String}} ]
      });
    document.body.appendChild(component)
  })

  afterEach(() => {
    document.body.removeChild(component)
  })


  it("renders the empty defaults", async () => {
    await component.updateComplete
    expect(component.shadowRoot?.textContent).toContain("Hello !")
  });
  it("renders updated props correctlty", async () => {
    component.setAttribute("who", "John")
    await component.updateComplete
    expect(component.shadowRoot?.textContent).toContain("Hello John!");
  });
})