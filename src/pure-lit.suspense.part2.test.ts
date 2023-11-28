import { pureLit } from "./pure-lit";
import { html } from "lit";
import { LitElementWithProps } from "./types";

// jest doesn't run tests in the same file in isolation,
//  which has led to sideeffects and bugs. Splitting this up

describe("pure-lit suspense happy case", () => {
  type Props = { who: string }
  let component: LitElementWithProps<Props>
  let cb: (e?: Error | undefined) => void;
  let setWaiter = (callback: (e?: Error | undefined) => void) => cb = callback
  let releaseSuspense = async () => {
    await component.updateComplete
    if (cb) cb();
    (cb as any) = null
  }

  beforeEach(async () => {
    component = pureLit("my-component",
      async (el: LitElementWithProps<Props>) =>
        await new Promise((resolve, reject) => {
          return setWaiter((e) =>
            e
              ? (console.log("Rejecting", e), reject(e))
              : (resolve(html`<p>Hello ${el.who}!</p>`))
          )
        }),
      {
        defaults: { who: "noone" },
        suspense: html`wait while loading...`
      });
    document.body.appendChild(component)
    await component.updateComplete
  })

  afterEach(() => {
    global.window.document.documentElement.innerHTML = "";
  })

  it("renders updated props correctly for suspense", async () => {
    await releaseSuspense()
    await component.suspenseComplete();
    expect(component.shadowRoot?.textContent).toContain("Hello noone!")

    component.setAttribute("who", "John")
    await releaseSuspense()
    await component.suspenseComplete();
    expect(component.shadowRoot?.textContent).toContain("Hello John!");
  });
});
