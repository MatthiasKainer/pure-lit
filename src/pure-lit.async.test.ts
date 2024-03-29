import { registered, pureLit } from "./pure-lit";
import { html } from "lit";
import { LitElementWithProps } from "./types";

describe("pure-lit async", () => {
  type Props = { who: string }
  let component: LitElementWithProps<Props>
  beforeEach(async () => {
    component = pureLit("my-component", 
      async (el : LitElementWithProps<Props>) => await Promise.resolve(html`<p>Hello ${el.who}!</p>`),
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
  
  it("renders the default correctly", () => {
    expect(component.shadowRoot?.textContent).toContain("Hello noone!")
  });
  
  it("renders updated props correctlty", async () => {
    component.setAttribute("who", "John")
    await component.updateComplete
    expect(component.shadowRoot?.textContent).toContain("Hello John!");

    // updated props survive rerender
    component.requestUpdate()
    await component.updateComplete
    expect(component.shadowRoot?.textContent).toContain("Hello John!");

    // updated props don't survive reinit
    component.reinitialize()
    await component.updateComplete
    expect(component.shadowRoot?.textContent).toContain("Hello noone!");
  });

  it("doesn't fail on calls to suspense waiter, even if there is no suspense", async () => {
    component.setAttribute("who", "Connor")
    await component.suspenseComplete()
    expect(component.shadowRoot?.textContent).toContain("Hello Connor!");
  })

  it("does not duplicate the component if it already exists", () => {
    pureLit("my-component", () => html``);
    pureLit("my-component", () => html``);
    expect(Object.keys(registered).length).toBe(1);
  });
});
describe("pure-lit async failure", () => {
  type Props = { who: string | undefined }
  let component: LitElementWithProps<Props>
  beforeAll(() => {
    console.error = jest.fn()
  })

  beforeEach(async () => {
    
    component = pureLit("my-failing-component", 
      async (el : LitElementWithProps<Props>) => 
        el.who 
        ? await Promise.resolve(html`<p>Hello ${el.who}!</p>`)
        : await Promise.reject(html`<p>Noone to greet</p>`),
      { defaults: { who: undefined }});
    const errorSlot = document.createElement("div")
    errorSlot.setAttribute("slot", "error")
    component.appendChild(errorSlot)
    document.body.appendChild(component)
    await component.updateComplete
  })

  afterEach(() => {
    document.body.removeChild(component)
  });

  afterAll(() => {
    (console.error as any).mockRestore();
  });

  it("creates a new component", () => {
    expect(component.outerHTML).toEqual("<my-failing-component><div slot=\"error\"></div></my-failing-component>");
  });  

  it("logs the error to console log", () => {
    expect(console.error).toBeCalledWith(html`<p>Noone to greet</p>`);
  });  
  
  it("renders the error slot correctly", () => {
    expect(component.shadowRoot?.textContent).toContain("Noone to greet")
  });
  
  it("renders updated props correctlty", async () => {
    component.setAttribute("who", "John")
    await component.updateComplete
    expect(component.shadowRoot?.textContent).toContain("Hello John!");
  });
});