import React, {Component, PropTypes} from 'react';
import ValidatorHandler from './ValidatorHandler';

export interface IProps {
  schema: Object;
  render: Function;
}

export default class ProofedReactComponent extends Component<IProps, any> {
  validator: ValidatorHandler;
  static propTypes = {
    schema: PropTypes.object,
    render: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.validator = new ValidatorHandler(props.schema);
    this.validator.setUpdateCallback(this.updated);
  }

  updated = () => {
    this.setState({});
  }

  render() {
    const arg = {
      model: this.validator.getModel(),
      handle: this.validator.handle,
      isPristine: this.validator.isPristine,
      submit: this.validator.getSubmit(),
      valid: this.validator.valid
    }
    let rendered = this.props.render(arg) 
    return rendered;
  }
}