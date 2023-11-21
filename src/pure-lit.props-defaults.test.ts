import { pureLit } from "./pure-lit";
import { html, css } from "lit";
import { LitElementWithProps } from "./types";

describe("pure-lit with prop by default specs", () => {
  type Props = { who: string, whoElse: string }
  let component: LitElementWithProps<Props>
  beforeEach(() => {
    component = pureLit("my-component", 
      (el : LitElementWithProps<Props>) => html`<p>Hello ${el.who}${el.whoElse}!</p>`,
      { 
        styles: [css`:host {}`],
        defaults: {
          who: "",
          whoElse: ""
        }
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
  it("renders updated dashed props correctlty", async () => {
    component.setAttribute("who", "John")
    component.setAttribute("who-else", "Wayne")
    await component.updateComplete
    expect(component.shadowRoot?.textContent).toContain("Hello JohnWayne!");
  });
})