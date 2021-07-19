import { toProperties, toPropertyDeclaration, toPropertyDeclarationMap } from "./properties";
import { getType, toTypeDeclaration } from "./properties"

describe("typer", () => {
    it("should map a boolean value correctly", () => {
        expect(getType(true))
            .toEqual({ type: Boolean })
    })
    it("should map an object value correctly", () => {
        expect(getType({ value: {} }))
            .toEqual({ type: Object })
    })
    it("should map a array value correctly", () => {
        expect(getType([]))
            .toEqual({ type: Array })
    })
    it("should map a string value correctly", () => {
        expect(getType("true"))
            .toEqual({ })
    })

    it("should map a set of default properties correctly", () => {
        expect(toTypeDeclaration({ 
            bool: true,
            obj : {},
            arr: [],
            else: "string"
        })).toEqual({
            bool: {type: Boolean},
            obj: {type: Object},
            arr: {type: Array},
            else: { }
        })
    })
})

describe("toProperties", () => {
    it("returns empty if nothing", () => {
      expect(toProperties()).toEqual({});
    })
  
    it("returns properties for default values", () => {
      expect(toProperties({ defaults: { some: "value", bool: true } }))
        .toEqual({some: {}, bool: {type: Boolean}})
    })
    it("returns multiple generated properties for camelCases to support react https://reactjs.org/docs/dom-elements.html#all-supported-html-attributes `You may also use custom attributes as long as they’re fully lowercase.`", () => {
      expect(toProperties({ props: [{ someCamelCase: { type: String }, bool: {type: Boolean} }] }))
        .toEqual({
          someCamelCase: { type: String, attribute: "some-camel-case" }, 
          bool: {type: Boolean}
        })
        expect(toProperties({ defaults: { someCamelCase: "value", bool: true } }))
        .toEqual({
          someCamelCase: {attribute: "some-camel-case"},
          bool: {type: Boolean}
        })
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
        something: {
          type: Object
        },
        blub: {
          type: Boolean
        }
    });
  })
  
  describe("toPropertyDeclarationMap", () => {
    it("returns an empty property map on no data", () => {
      expect(toPropertyDeclarationMap()).toEqual({});
    });
  
    it("should map propertymaps correctly", () => {
      expect(
        toPropertyDeclarationMap([
          { type: { type: String } },
          { bla: { type: Boolean }, blub: { type: Object } },
        ])
      ).toEqual({
          type: { type: String },
          bla: { type: Boolean },
          blub: { type: Object }
      });
    });
  });