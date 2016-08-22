# React Proofed 

React proofed is a user interaction validation library for React.
Its main use is for implementing form with validation, but can be used for any type of user interaction.

Many current implementation for forms requires you to create custom input Component.
I wanted to have a simple solution similar to how `ng-model` works in Angular.

## Getting started

React Proofed exposes a single `<Proofed/>` component.
This component requires two props in order to work: your validation `schema` and the `render` function.
The render function will be called with one object argument that act as API for the validation class in the render function.

```javascript
import React, {Component} from 'react';
import {Proofed} from 'react-proofed'; 

const isString = (val) => typeof val === "string";
const longerThan = (len) => (val) => val.length > len;
const isNumber = (val) => typeof val === "number";

const schema = {
  age: [30, isNumber, longerThan(1)],
  name: {
    first: ['First Name', isString, longerThan(3)],
    last: ['Last Name', isString, longerThan(3)],
  }
};

export default class Form extends Component {
  // This handle function is called with the form value
  handleSubmit = (form) => {
    console.debug('Form submitted:', form);
  }

  render () {
    return (
      <Proofed schema={schema} render={({model, handle, submit, isPristine}) =>
        <div>
          <h3>My awesome form!</h3>
          <input value={model.age} onChange={handle('age')} /><br/>
          <input value={model.name.first} onChange={handle('name.first')} /><br/>
          <input value={model.name.last} onChange={handle('name.last')} /><br/>
          <button onClick={submit(this.handleSubmit)}>submit!</button>
          <p>{isPristine() ? 'The form is pristine' : 'The form is dirty!'}</p>
        </div>
      }/>
    );
  }
}
```

## Validation schema

In order to implement validation, Proofed requires you to specify a validation schema. 
It look like a JS object, and can be nested. **You may not use the string notation for defining the properties**.
Every value is defined by an array, which contains the rules for validation and the default value (if needed).
```js
const mySchema = {
  name: ['My Default value', notEmpty, isString, () => true]
}
```

The validation rules are simple function that accept the node value as input and must return `true` or `false` based on any logic you may want to implement.
```js
const isString = (val) => typeof val === "string";
```