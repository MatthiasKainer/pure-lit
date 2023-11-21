import { html, LitElement, TemplateResult } from "lit";
import {
  RegisteredElements,
  RenderFunction,
  LitElementWithProps,
  PureArguments,
  AsyncRenderFunction,
} from "./types";
import { toProperties, isDefault } from "./properties";
import { dispatch } from "./dispatch";

export const registered: RegisteredElements = {};

enum SuspenseStatus {
  INITAL,
  WAITING,
  COMPLETE,
  ERROR
}

class SuspenseRender<TProps> {
  status: SuspenseStatus = SuspenseStatus.INITAL
  suspense: TemplateResult;
  result: TemplateResult;
  renderLater: AsyncRenderFunction<TProps> | RenderFunction<TProps>;
  onChanged: () => void

  constructor(
    suspense: TemplateResult,
    render: AsyncRenderFunction<TProps> | RenderFunction<TProps>,
    onChange: () => void
  ) {
    this.suspense = suspense;
    this.result = suspense;
    this.renderLater = render;
    this.onChanged = onChange;
  }

  reset() {
    this.status = SuspenseStatus.INITAL;
  }

  render(element: LitElementWithProps<TProps>) {
    switch (this.status) {
      case SuspenseStatus.INITAL:
        this.result = this.suspense;
        this.status = SuspenseStatus.WAITING;

        Promise.resolve(this.renderLater(element))
          .then(result => (
            this.result = result,
            this.status = SuspenseStatus.COMPLETE,
            this.onChanged()
          ))
          .catch(e => (
            console.error(e),
            this.result = html`<slot name="error">${e}</slot>`,
            this.status = SuspenseStatus.COMPLETE,
            this.onChanged()
          ));

        return this.result;
      case SuspenseStatus.WAITING:
        return this.result;
      default:
        return this.result;
    }
  }
}

export const pureLit = <TProps>(
  name: string,
  render: AsyncRenderFunction<TProps> | RenderFunction<TProps>,
  args?: PureArguments<TProps>
): LitElementWithProps<TProps> => {
  if (registered[name]) return registered[name];

  class RuntimeRepresentation extends LitElement {
    content: TemplateResult = html``;
    suspense?: SuspenseRender<TProps>;
    static get properties() {
      return toProperties(args);
    }
    static get styles() {
      /* istanbul ignore next */
      return args?.styles;
    }
    constructor() {
      super();
      if (args?.suspense)
        this.suspense = new SuspenseRender(
          args.suspense,
          render,
          () => this.requestUpdate()
        );
      if (isDefault(args)) {
        Object.entries(args!.defaults!).forEach(([key, value]) => {
          (this as any)[key] = value
        })
      }
    }
    connectedCallback() {
      super.connectedCallback()
      dispatch(this, "connected")
    }

    firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
      super.firstUpdated(changedProperties)
      dispatch(this, "firstUpdated", changedProperties)
    }

    attributeChangedCallback(name: string, old: string | null, value: string | null): void {
      this.suspense?.reset()
      super.attributeChangedCallback(name, old, value)
      dispatch(this, "attributeChanged", { name, old, value })
    }

    protected async performUpdate(): Promise<unknown> {
      if (this.suspense) {
        this.content = this.suspense.render((this as any) as LitElementWithProps<TProps>);
      } else {
        this.content = await Promise.resolve(render((this as any) as LitElementWithProps<TProps>))
          .catch(e => (console.error(e), html`<slot name="error">${e}</slot>`));
      }
      const result = super.performUpdate();
      dispatch(this, "updated")
      return result
    }
    render(): TemplateResult {
      return this.content;
    }
  }

  customElements.define(name, RuntimeRepresentation);

  const element = document.createElement(name);
  registered[name] = element;
  return element as LitElementWithProps<TProps>;
};
