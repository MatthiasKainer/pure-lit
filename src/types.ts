import { CSSResult, CSSResultArray, TemplateResult, LitElement, PropertyDeclaration, CSSResultGroup } from "lit";

export type PurePropertyDeclaration = {
    [key: string]: PropertyDeclaration;
}

export type PropDefinedPureArguments<TProps> = {
    styles?: CSSResultGroup
    props?: (PurePropertyDeclaration | string)[]
    defaults?: TProps & DefaultObjectDefinition
}

export type DefaultObjectDefinition = {[key: string]: unknown}

export type DefaultDefinedPureArguments<TProps> = {
    styles?: CSSResult | CSSResultArray
    defaults?: TProps & DefaultObjectDefinition
}

export type PureArguments<TProps> = PropDefinedPureArguments<TProps> | DefaultDefinedPureArguments<TProps>

export type LitElementWithProps<TProps> = LitElement & TProps

export type RenderFunction<TProps> = (element: LitElementWithProps<TProps>) => TemplateResult
export type AsyncRenderFunction<TProps> = (element: LitElementWithProps<TProps>) => Promise<TemplateResult>

export type RegisteredElements = {
    [elementName: string] : LitElementWithProps<any>
}