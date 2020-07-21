import { toTypedPropertyDeclaration, objectToPurePropertyDeclaration } from "./typer"

describe("typer", () => {
    it("should map a boolean value correctly", () => {
        expect(toTypedPropertyDeclaration(true))
            .toEqual({ type: Boolean })
    })
    it("should map an object value correctly", () => {
        expect(toTypedPropertyDeclaration({ value: {} }))
            .toEqual({ type: Object })
    })
    it("should map a array value correctly", () => {
        expect(toTypedPropertyDeclaration([]))
            .toEqual({ type: Array })
    })
    it("should map a string value correctly", () => {
        expect(toTypedPropertyDeclaration("true"))
            .toEqual({ })
    })

    it("should map a set of default properties correctly", () => {
        expect(objectToPurePropertyDeclaration({ 
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