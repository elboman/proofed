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

  componentWillReceiveProps (nextProps) {
    this.validator.updateSchema(nextProps.schema);
  }

  render() {
    const arg = {
      model: this.validator.getModel(),
      handle: this.validator.handle,
      isPristine: this.validator.isPristine,
      submit: this.validator.getSubmit(),
      isValid: this.validator.valid,
      errors: this.validator.errors
    }
    let rendered = this.props.render(arg) 
    return rendered;
  }
}