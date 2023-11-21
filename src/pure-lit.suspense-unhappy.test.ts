import { pureLit } from "./pure-lit";
import { html } from "lit";
import { LitElementWithProps } from "./types";

describe("pure-lit suspense unhappy case", () => {
  type Props = { who: string }
  let component: LitElementWithProps<Props>
  let cb: (e?: Error | undefined) => void;
  let setWaiter = (callback: (e?: Error | undefined) => void) => cb = callback

  let fail = (message: string) => {
    cb(new Error(message))
  }

  beforeEach(async () => {
    console.error = jest.fn()
    component = pureLit("my-component",
      async (el: LitElementWithProps<Props>) =>
        await new Promise((resolve, reject) =>
          setWaiter((e) =>
            e
              ? reject(e)
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
    jest.resetAllMocks()
  })

  it("renders the error correctly", async () => {
    component.setAttribute("who", "John")
    await component.updateComplete
    fail("omg omg we all gonna die")
    // suspense is slighty more async then your regular component
    await component.updateComplete
    await new Promise(process.nextTick)
    expect(component.shadowRoot?.textContent).toContain("omg omg we all gonna die")
  });

});