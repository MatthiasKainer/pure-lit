# Advanced usage

## Dispatching events

### Using the dispatch-function

If you want to dispatch a custom event, you don't have to write the `CustomEvent` code, you can either use a reducer or just use the `dispatch` method provided like so:

```typescript
pureLit("todo-add", (element: LitElement) => {
  const todo = useState(element, "");

  const onComplete = () => {
    if (todo.get().length > 0) {
      // dipatch a custom event "added"
      dispatch(element, "added", todo.get());
      todo.set("");
    }
  };
  const onUpdate = ({ value }: { value: string }) => todo.set(value);
  return html`
    <div>
      <input
        type="text"
        name="item"
        .value="${todo.get()}"
        @input="${(e: InputEvent) => onUpdate(e.target as HTMLInputElement)}"
        @keypress="${(e: KeyboardEvent) => e.key === "Enter" && onComplete()}"
        placeholder="insert new item"
      />
      <button @click=${() => onComplete()}>Add Item</button>
    </div>
  `;
});
```

This event can then be subscribed by a parent like any other event

```typescript
pureLit("todo-app", (element: LitElement) => {
  const { get, set } = useState<string[]>(element, []);
  return html`
    <div>
      <todo-add @add=${(e: CustomEvent<string>) => set([...get(), e.detail])}></todo-add>
    </div>
    <div>
      <todo-list
        .items=${get()}
        @remove=${(e: CustomEvent<string>) => set([...get().filter((el) => el === e.detail)])}
      ></todo-list>
    </div>
  `;
});
```

### Dispatching from the reducer

When using a reducer, you can also use it to directly dispatch an event that has the same name as the reducer action. Whenever `set` is called, the event will be triggered.

```typescript
const todo = (state: string) => ({
  update: (payload: string) => payload,
  added: () => state,
});

pureLit("todo-add", (element: LitElement) => {
  const { set, get } = useReducer(element, todo, "", {
    // this is the line that dispatches a custom event for you
    dispatchEvent: true,
  });
  const onComplete = () => get().length > 0 && (set("added"), set("update", ""));
  const onUpdate = ({ value }: { value: string }) => set("update", value);
  return html`
    <div>
      <input
        type="text"
        name="item"
        .value="${get()}"
        @input="${(e: InputEvent) => onUpdate(e.target as HTMLInputElement)}"
        @keypress="${(e: KeyboardEvent) => e.key === "Enter" && onComplete()}"
        placeholder="insert new item"
      />
      <button @click=${() => onComplete()}>Add Item</button>
    </div>
  `;
});
```

## Usage with React

As long as you use the property syntax from lit-element, everything will work seamlessly. It will be more difficult once you try to use your component in a framework like react. There are two things to consider:

1. React does not work well with `camelCase` attribute names (see also https://reactjs.org/docs/dom-elements.html#all-supported-html-attributes).
2. React does not work well with your custom events.

To workaround this issue pure-lit tries to be friendly, but there is something for you to be left.

Let's take a look at an example:

```js
pureLit("hello-world",
  (el) => {
    dispatch(el, "knockknock", `Who's there? - ${el.whoIsTher} - Not funny`))
    return html`<p>Hello ${el.whoIsThere}!</p>`
  },
  { defaults: { whoIsThere: "noone" }});
```

Using this via lit-html looks like this:

```js
const who = "me";
return html`<hello-world .whoIsThere=${who} @knockknock=${(e) => console.log(e.detail)}></hello-world>`;
```

First, pure-lit changes `camelCase` attribute names to `dashed`, thus in jsx the component will look like this:

```jsx
const who = "me";
return <hello-world who-is-there={me}></hello-world>;
```

Accessing the event is slightly more difficult.

```jsx
function HelloWorld({ whoIsThere, knockknock }) {
  // create a ref for the html element
  const helloWorldRef = useRef<HTMLElement>()

  // The event listener that handles the submitted event
  function eventListener(e) {
    knockknock(e.detail)
  }

  // add the event listener to the ref in an effect
  useEffect(() => {
    const { current } = helloWorldRef
    current.addEventListener('knockknock', eventListener)

    // remove it when the element is unmounted
    return () => current.removeEventListener('knockknock', eventListener)
  }, [])

  return (
    <hello-world
      // create the reference for the ref
      ref={helloWorldRef}
      who-is-there={me}>
    </hello-world>
  )
}
```

Now we can use the Wrapped Component like so:

```jsx
<HelloWorld whoIsThere="me" knockknock={console.log}>
```