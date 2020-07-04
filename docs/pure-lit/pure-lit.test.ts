import { registered, pureLit } from "./pure-lit"
import { html } from "lit-element"

describe("pure-lit", () => {

    it("should create a new component", () => {
        expect(pureLit("my-component", () => html`yes`).outerHTML).toEqual("<my-component></my-component>")
        expect(Object.keys(registered).length).toBe(1)
    })

    it("should not duplicate the component if it already exists", () => {
        pureLit("my-component", () => html``)
        pureLit("my-component", () => html``)
        expect(Object.keys(registered).length).toBe(1)
    })
})