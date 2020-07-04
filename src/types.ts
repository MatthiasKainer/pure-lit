import { CSSResult, CSSResultArray, TemplateResult, LitElement, PropertyDeclaration } from "lit-element";

export type PurePropertyDeclaration = {
    [key: string]: PropertyDeclaration;
}

export type PropDefinedPureArguments = {
    styles?: CSSResult | CSSResultArray
    props?: (PurePropertyDeclaration | string)[]
}

export type DefaultObjectDefinition = {[key: string]: unknown}

export type DefaultDefinedPureArguments = {
    styles?: CSSResult | CSSResultArray
    defaults?: DefaultObjectDefinition
}

export type PureArguments = PropDefinedPureArguments | DefaultDefinedPureArguments

export type LitElementWithProps<TProps> = LitElement & TProps

export type RenderFunction<TProps> = (element: LitElementWithProps<TProps>) => TemplateResult

export type RegisteredElements = {
    [elementName: string] : HTMLElement
}