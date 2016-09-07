import * as React from 'react';
import {Proofed} from '../code/index';

const isString = (val) => /^[a-zA-Z ]+$/.test(val) || "Not a string";
const longerThan = (len) => (val) => val.length > len || `Must be longer than ${len}`;
const isNumber = (val) => /\d/.test(val) || "Not a number";

const schema = {
  age: [30, isNumber],
  name: {
    first: ['First Name', isString, longerThan(3)],
    last: ['Last Name', isString, longerThan(3)],
  }
};

export default class Form extends React.Component<any,any> {
  // This handle function is called with the form value
  handleSubmit = (form) => {
    console.debug('Form submitted!', form);
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