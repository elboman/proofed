import * as React from 'react';
import {Proofed} from '../code/index'; 

const isString = (val) => typeof val === "string";
const longerThan = (len) => (val) => val.length > len;
const isNumber = (val) => typeof val === "number";

// Create a form as you would normally
const schema = {
  age: [25, isNumber, longerThan(1)],
  name: {
    first: [isString, longerThan(3), 'Marco'],
    last: [isString, longerThan(3), 'Botto'],
    nickname: {
      snari: [isString, 'Elbo']
    }
  }
};

export default class Form extends React.Component<any,any> {
  // This handle function is called with the form value
  handleSubmit = (form) => {
    console.debug('Form submitted!', form);
  }

  render () {
    return (
      <Proofed schema={schema} render={({model, handle, submit}) =>
        <div>
          <h3>React is awesome!</h3>
          <input value={model.age} onChange={handle('age')} />
          <input value={model.name.first} onChange={handle('name.first')} />
          <input value={model.name.last} onChange={handle('name.last')} />
          <button onClick={submit(this.handleSubmit)}>submit!</button>
        </div>
      }/>
    );
  }
}