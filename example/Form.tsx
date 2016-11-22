import * as React from 'react';
import {Proofed} from '../code/index';

const isString = (val) => /^[a-zA-Z ]+$/.test(val) || "Not a string";
const longerThan = (len) => (val) => val.length > len || `Must be longer than ${len}`;
const isNumber = (val) => /\d/.test(val) || "Not a number";

let schema = {
  age: [30, isNumber],
  name: {
    first: ['First Name', isString, longerThan(3)],
    last: ['Last Name', isString, longerThan(3)],
  },
  subscribe: [false, (val) => val],
  repeatName: ['', (val, model) => val === model.name.first || 'Not the same as name']
};

let schemaWithLast = {
  age: [30, isNumber],
  name: {
    first: ['First Name', isString, longerThan(3)],
    last: ['Last Name', isString, longerThan(3)],
  },
  subscribe: [false, (val) => val],
  repeatName: ['', (val, model) => val === model.name.first || 'Not the same as name'],
  repeatLast: [
    '', (val, model) => val === model.name.last || 'Not the same as last name'
  ]
};

export default class Form extends React.Component<any,any> {
  state = {
    showRepeatLastname: false,
    schema: schema,
    schemaWithLast: schemaWithLast
  }

  toggleShow = () => {
    this.setState({showRepeatLastname: !this.state.showRepeatLastname});
  }

  // This handle function is called with the form value
  handleSubmit = (e, form) => {
    console.debug('Form submitted!', form);
  }

  render () {
    const {showRepeatLastname, schema: _schema, schemaWithLast: _schemaWithLast} = this.state;
    return (
      <Proofed schema={showRepeatLastname ? _schemaWithLast : _schema} render={({model, handle, submit, isValid, isPristine, errors}) =>
        <div>
          <button onClick={this.toggleShow}>toggle</button>
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
          <div>
            <input type="checkbox" checked={model.subscribe} onChange={handle('subscribe', (e) => e.target.checked)} />
            {' '}Subscribe
          </div>
          <div>
            <input value={model.repeatName} onChange={handle('repeatName')} />
            {errors('repeatName').map((error, i) => <p key={i}>{error}</p>)}
          </div>
          {
            showRepeatLastname
            ? <div>
                <input value={model.repeatLast} onChange={handle('repeatLast')} />
                {errors('repeatLast').map((error, i) => <p key={i}>{error}</p>)}
              </div>
            : null
          }
          <button onClick={submit(this.handleSubmit)}>submit!</button>
          <p>{isPristine() ? 'The form is pristine' : 'The form is dirty!'}</p>
          <p>{isValid() ? 'The form is valid!' : 'The form is not valid!'}</p>
          <br />
          <h4>Output</h4>
          <pre dangerouslySetInnerHTML={{__html: JSON.stringify(model, null, 2)}}></pre>
        </div>
      }/>
    );
  }
}