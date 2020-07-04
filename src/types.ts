import { CSSResult, CSSResultArray, TemplateResult, LitElement, PropertyDeclaration } from "lit-element";

export type PurePropertyDeclaration = {
    [key: string]: PropertyDeclaration;
}

export type PureArguments = {
    styles?: CSSResult | CSSResultArray
    props?: (PurePropertyDeclaration | string)[]
}

export type LitElementWithProps<TProps> = LitElement & TProps

export type RenderFunction<TProps> = (element: LitElementWithProps<TProps>) => TemplateResult

export type RegisteredElements = {
    [elementName: string] : HTMLElement
}