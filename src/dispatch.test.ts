import {dispatch} from "."

describe("on", () => {
    const mock = jest.fn()
    const mockElement = { 
        dispatchEvent: (e: CustomEvent) => mock(e.type, e.detail, e.bubbles)
    }
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it("adds the event dispatcher to the element with no data and bubbling", () => {
        dispatch(mockElement, "custom");
        expect(mock).toBeCalledWith("custom", null, false)
    })

    it("adds the event dispatcher and data if passed", () => {
        dispatch(mockElement, "custom", "data");
        expect(mock).toBeCalledWith("custom", "data", false)
    })
    it("adds the event dispatcher, data and options if passed", () => {
        dispatch(mockElement, "custom", "data", { bubbles: true });
        expect(mock).toBeCalledWith("custom", "data", true)
    })
})