import { registered, pureLit } from "./pure-lit";
import { html } from "lit";
import { LitElementWithProps } from "./types";


describe("pure-lit", () => {
  type Props = { who: string }
  let component: LitElementWithProps<Props>
  let events: {[key:string]: any[]} = {}

  function isCustomEvent(event: Event | CustomEvent): event is CustomEvent {
    return (event as CustomEvent).detail
  }

  let eventTracker = (name: string) => (event: Event) => 
    events[name] = [...(events[name] ?? []), isCustomEvent(event) ? event.detail : event]

  const eventListeners = {
    connected: eventTracker("connected"),
    attributeChanged: eventTracker("attributeChanged"),
    firstUpdated: eventTracker("firstUpdated"),
    updated: eventTracker("updated")
  }

  beforeEach(async () => {
    component = pureLit("my-component", 
      (el : LitElementWithProps<Props>) => html`<p>Hello ${el.who}!</p>`,
      { defaults: { who: "noone" }});
    events = {}
    Object.entries(eventListeners).forEach(([name, trigger]) => component.addEventListener(name, trigger))
    document.body.appendChild(component)
    await component.updateComplete
  })

  afterEach(() => {
    Object.entries(eventListeners).forEach(([name, trigger]) => component.removeEventListener(name, trigger))
    document.body.removeChild(component)
    events = {}
  })

  it("creates a new component", () => {
    expect(component.outerHTML).toEqual("<my-component></my-component>");
    expect(Object.keys(registered).length).toBe(1);
  });
  
  it("calls all creation events", () => {
    expect(events["connected"].length).toBe(1)
    // never updated
    expect(events["updated"]).toBe(undefined)
  })
  
  it("renders the default correctly", async () => {
    expect(component.shadowRoot?.textContent).toContain("Hello noone!")
    expect(events["updated"]).toBe(undefined)
  });
  it("renders updated props correctlty", async () => {
    component.setAttribute("who", "John")
    await component.updateComplete
    expect(events["attributeChanged"].length).toBe(1)
    expect(events["attributeChanged"][0]).toEqual({"name": "who", "old": null, "value": "John"})
    expect(events["updated"].length).toBe(1)
    expect(component.shadowRoot?.textContent).toContain("Hello John!");
  });

  it("does not duplicate the component if it already exists", () => {
    pureLit("my-component", () => html``);
    pureLit("my-component", () => html``);
    expect(Object.keys(registered).length).toBe(1);
  });
});
