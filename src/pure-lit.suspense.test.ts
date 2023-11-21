import { registered, pureLit } from "./pure-lit";
import { html } from "lit";
import { LitElementWithProps } from "./types";

describe("pure-lit suspense happy case", () => {
  type Props = { who: string }
  let component: LitElementWithProps<Props>
  let cb: (e?: Error | undefined) => void;
  let setWaiter = (callback: (e?: Error | undefined) => void) => cb = callback
  let release = () => {
    cb()
  }

  beforeEach(async () => {
    component = pureLit("my-component",
      async (el: LitElementWithProps<Props>) =>
        await new Promise((resolve, reject) =>
          setWaiter((e) =>
            e
              ? (console.log("Rejecting", e), reject(e))
              : resolve(html`<p>Hello ${el.who}!</p>`)
          )
        ),
      {
        defaults: { who: "noone" },
        suspense: html`wait while loading...`
      });
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
    expect(component.shadowRoot?.textContent).toContain("wait while loading...")
    // while this has not resolved, it should continue to show loading
    component.requestUpdate()
    await new Promise(process.nextTick)
    expect(component.shadowRoot?.textContent).toContain("wait while loading...")
  });

  it("renders the result correctly", async () => {
    release()
    // suspense is slighty more async then your regular component
    await component.updateComplete
    await new Promise(process.nextTick)
    expect(component.shadowRoot?.textContent).toContain("Hello noone!")
  });

  it("renders updated props correctlty", async () => {
    release()
    component.setAttribute("who", "John")
    await component.updateComplete
    release()
    // suspense is slighty more async then your regular component
    await new Promise(process.nextTick)
    expect(component.shadowRoot?.textContent).toContain("Hello John!");
  });
});
