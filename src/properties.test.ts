import { toProperties, toPropertyDeclaration, toPropertyDeclarationMap } from "./properties";

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