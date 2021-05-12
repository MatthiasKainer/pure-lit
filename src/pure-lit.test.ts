import { registered, pureLit } from "./pure-lit";
import { html } from "lit";
import { LitElementWithProps } from "./types";


describe("pure-lit", () => {
  type Props = { who: string }
  let component: LitElementWithProps<Props>
  beforeEach(async () => {
    component = pureLit("my-component", 
      (el : LitElementWithProps<Props>) => html`<p>Hello ${el.who}!</p>`,
      { defaults: { who: "noone" }});
    document.body.appendChild(component)
    await component.updateComplete
  })

  afterEach(() => {
    document.body.removeChild(component)
  })

  it("creates a new component", () => {
    expect(component.outerHTML).toEqual("<my-component></my-component>");
    expect(Object.keys(registered).length).toBe(1);
  });  
  
  it("renders the default correctly", async () => {
    expect(component.shadowRoot?.textContent).toContain("Hello noone!")
  });
  it("renders updated props correctlty", async () => {
    component.setAttribute("who", "John")
    await component.updateComplete
    expect(component.shadowRoot?.textContent).toContain("Hello John!");
  });

  it("does not duplicate the component if it already exists", () => {
    pureLit("my-component", () => html``);
    pureLit("my-component", () => html``);
    expect(Object.keys(registered).length).toBe(1);
  });
});