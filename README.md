# React Proofed 

React proofed is a user interaction validation library for React.
Its main use is for implementing form with validation, but can be used for any type of user interaction.

Many current implementation for forms requires you to create custom input Component.
I wanted to have a simple, flexible and declarative solution.

## Getting started

Install the library to get started:
```
npm install --save proofed
```

The library exposes a single `<Proofed>` component.
It requires two props in order to work: your validation `schema` and the `render` function.
The render function will be called with one object argument that act as API for the validation class in the function.

```jsx
import React, {Component} from 'react';
import {Proofed} from 'proofed'; 

const isString = (val) => /^[a-zA-Z]+$/.test(val);
const longerThan = (len) => (val) => val.length > len;
const isNumber = (val) => /\d/.test(val);

const schema = {
  age: [30, isNumber],
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
      <Proofed schema={schema} render={({model, handle, submit, isValid, isPristine, errors}) =>
        <div>
          <h3>My awesome form!</h3>
          <div>
            <input value={model.age} onChange={handle('age')} type="number" />
            {errors('age').map((error, i) => <p key={i}>{error}</p>)}
          </div>
          <div>
            <input value={model.name.first} onChange={handle('name.first')} />
            {errors('name.first').map((error, i) => <p key={i}>{error}</p>)}
          </div>
          <div>
            <input value={model.name.last} onChange={handle('name.last')} />
            {errors('name.last').map((error, i) => <p key={i}>{error}</p>)}
          </div>
          <button onClick={submit(this.handleSubmit)}>submit!</button>
          <p>{isPristine() ? 'The form is pristine' : 'The form is dirty!'}</p>
          <p>{isValid() ? 'The form is valid!' : 'The form is not valid!'}</p>
        </div>
      }/>
    );
  }
}
```

## Validation schema

In order to implement validation, Proofed requires you to specify a validation schema. 
It's a JS object which can have a nested structure. **You may not use the string notation for defining the properties**.
Every validation node is defined by an array which contains the rules for validation and the default value (if needed).
```js
const mySchema = {
  name: ['My Default value', notEmpty, isString, () => true]
}
```

The validation rules are simple function that accept the node value as input and must return `true` in case the value is valid. Any other value will be considered as not valid.
You may return a string for specifying the error in case the value is invalid.
```js
const isString = (val) => /^[a-zA-Z]+$/.test(val);

// if you want you can specify an error
const isString = (val) => /^[a-zA-Z]+$/.test(val) || 'The value must only contain letters.';
```

#### Advanced validation
Sometimes you may need to create validation for a node based on other nodes value (i.e. checking if two passwords match). 
You can specify a second argument in the validation rules functions that will have the whole object model as value.
```js
const matchPassword = (val, model) => val === model.password || 'Values do not match';
``` 

## API

The render function will be called with a single object as argument.
This object contains everything needed to implement custom render logic based on validation, as well as event handler for value changes.

```javascript
renderArgument = {
  // contains the user input data.
  model: Object,

  // returns a function to handle event change for the
  // given node path of the validation schema.
  handle: Function (nodePath, mapValueFunction),

  // returns a function for handling form submitting.
  // The provided handle function will be called with the model as argument.
  submit: Function (handlerFunction),

  // utility function used for evaluating the pristine/dirty
  // state of the whole tree or for each node (if a node string
  // is provided as argument)
  isPristine: Function (nodePath?),

  // utility function used for evaluating if path node (when provided)
  // of full model is valid in given time
  isValid: Function (nodePath?),
  
  // utility function for listing validation errors related to single
  // node (if specified) or whole model.
  // Returns an array of strings or empty array when no errors are found
  errors: Function (nodePath?)
}
```

If you are using ES6 you can use the object deconstruction notation for a cleaner code and to avoid repeating the single parameter object:
```jsx
<Proofed schema={schema} render={({model, handle}) =>
  <input value={model.myNode} onChange={handle('myNode')} /><br/>
}/>
```

### `handle()`
The handle function returns a function that handles the changes in the model for a particular node path.
By default it will update the node with the `e.target.value`.

Sometimes you may need to customise this behaviour (with check boxes for example).
In this case you pass a second argument that will work as a mapping function, this function receives the event `e` as argument:

```jsx
<Proofed schema={schema} render={({model, handle}) =>
  <input type="checkbox" checked={model.myNode} onChange={handle('myNode', e => e.target.checked)} /><br/>
}/>
```

### `submit()`
The submit function is used for handling the submission of the user inputs.
The function passed to `submit` is called with 3 arguments:

- `e`: The original event that triggered the submit.
- `model`: The model of the entire schema with the current values.
- `errors`: Any errors that maybe present with the current values.

> NOTE: `errors` will only contains errors that are specified by the validation rules functions.
>
> If no error is returned (and just `false` instead) the arrays may be empty.

The errors will be an array containing arrays of errors, one for each node that has errors:
```
errors = [
  ['Username must be defined.', 'Username is too short.'],
  ['Password is too long.']
]

// You may flatten the arrays to get one containing all errors:
allErrors = [].concat.apply([], errors);
```  
