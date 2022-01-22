import { LitElementWithProps } from ".";

export const dispatch = <T>(element: LitElementWithProps<any>, type: string, data?: T, options?: CustomEventInit<T>) => 
    element.dispatchEvent(new CustomEvent(type.trim(), {...options, detail : data}))