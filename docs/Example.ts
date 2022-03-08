import { html, LitElement, css } from "lit";
import { LitElementWithProps, pureLit, useReducer, useState, Reducer } from "pure-lit";

type ListProps = { items: string[] };

const add: Reducer<string> = (state: string) => ({
  update: (payload: string) => Promise.resolve(payload),
  add: () => Promise.resolve(state),
});

pureLit(
  "todo-list",
  (element: LitElementWithProps<ListProps>) => html`<ul>
    ${element.items.map(
      (el) => html`<li @click=${() => element.dispatchEvent(new CustomEvent("remove", { detail: el }))}>${el}</li>`
    )}
  </ul>`,
  {
    styles: [
      css`
        ul {
          padding: 0;
          margin: 1rem 0;
          list-style: none;
          overflow: hidden;
        }
        li {
          background-color:inherit;
          padding: .5em;
          border-bottom: solid 1px var(--colorFocus);
          color: var(--colorContrast);
          font-style: italic;
          cursor: pointer;
          transition: all 500ms;
        }
        li:hover {
          background-color:var(--colorShow);
        }
      `,
    ],
    defaults: { items: [] },
  }
);

pureLit("todo-add", (element) => {
  const { get, set } = useReducer<string>(element, add, "", {
    dispatchEvent: true,
  });
  const onComplete = async () => get().length > 0 && (await set("add"), await set("update", ""));
  const onUpdate = async ({ value }: { value: string }) => await set("update", value);

  return html`
    <input
      type="text"
      name="item"
      .value="${get()}"
      @input="${(e: InputEvent) => onUpdate(e.target as HTMLInputElement)}"
      @keypress="${(e: KeyboardEvent) => e.key === "Enter" && onComplete()}"
      placeholder="insert new item"
    />
    <button @click=${() => onComplete()}>
      Add Item
    </button>
  `;
});

pureLit("todo-app", (element: LitElement) => {
  const { get, set } = useState<string[]>(element, []);
  return html`
    <div>
      <todo-add @add=${(e: CustomEvent<string>) => set([...get(), e.detail])}></todo-add>
    </div>
    <div>
      <todo-list
        .items=${get()}
        @remove=${(e: CustomEvent<string>) => set([...get().filter((el) => el !== e.detail)])}
      ></todo-list>
    </div>
  `;
});
