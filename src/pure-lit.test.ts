import { registered, pureLit, toPropertyDeclarationMap } from "./pure-lit";
import { html } from "lit-element";

describe("toPropertyDeclarationMap", () => {
  it("returns an empty property map on no data", () => {
    expect(toPropertyDeclarationMap()).toEqual({});
  });

  it("should map propertymaps correctly", () => {
    expect(
      toPropertyDeclarationMap([
        "something",
        { type: { type: String } },
        "lala",
        { bla: { type: Boolean }, blub: { type: Object } },
      ])
    ).toEqual({
        something: {},
        type: { type: String },
        lala: {},
        bla: { type: Boolean },
        blub: { type: Object }
    });
  });
});

describe("pure-lit", () => {
  it("creates a new component", () => {
    expect(pureLit("my-component", () => html``).outerHTML).toEqual("<my-component></my-component>");
    expect(Object.keys(registered).length).toBe(1);
  });

  it("does not duplicate the component if it already exists", () => {
    pureLit("my-component", () => html``);
    pureLit("my-component", () => html``);
    expect(Object.keys(registered).length).toBe(1);
  });
});
