import { registered, pureLit, toPropertyDeclarationMap, toPropertyDeclaration, toProperties } from "./pure-lit";
import { html } from "lit-element";

describe("toProperties", () => {
  it("returns empty if nothing", () => {
    expect(toProperties()).toEqual({});
  })

  it("returns properties for default values", () => {
    expect(toProperties({ defaults: { some: "value" } }))
      .toEqual({some: {}})
  })
  it("returns properties for default declarations", () => {
    expect(toProperties({ props: [{ some: { type: String } }] }))
      .toEqual({some: { type: String }})
  })
})

describe("toPropertyDeclaration", () => {
  expect(toPropertyDeclaration()).toEqual({});
  expect(
    toPropertyDeclaration({
      "something": {
        "inner": "data"
      },
      blub: true
    })
  ).toEqual({
      something: {},
      blub: {}
  });
})

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
