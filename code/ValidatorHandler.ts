import {get, set, mapValues, cloneDeep} from 'lodash';
import {flatten, unflatten} from './utils/flat';

export type IRule = (any) => boolean;
export type ISchemaAttribute = IRule[];

export interface ISchemaNode {
  [attribute: string]: ISchemaAttribute | ISchemaNode;
}

export interface ISchema {
  [name: string]: ISchemaAttribute | ISchemaNode;
}

export interface IValidationModelNode {
  rules: IRule[];
  value: any;
  default: any;
  pristine: boolean;
  valid: boolean;
}

export interface IValidationModel {
  [path: string]: IValidationModelNode
}

export default class ValidatorHandler {
  /*
  * The validator runs the data agains the schema
  * The schema defines how the tree is structured
  * and for each value which rules are to be applied in validation
  */
  schema: ISchema;

  /*
  * The state for the validation instance.
  */
  pristine: boolean = true;
  model: IValidationModel;
  subscriber: Function;

  constructor (schema: ISchema) {
    this.schema = schema;
    this.model = this.createValidatorModelFromSchema(schema);
  }

  private createValidatorModelFromSchema = (schema: ISchema): IValidationModel => {
    let flattenSchema = flatten(schema, {});
    let validationModel = mapValues(flattenSchema, (rulesAndDefault, path) => {
      let rules = rulesAndDefault.filter(rule => typeof rule === 'function');
      let defaultValue = rulesAndDefault.filter(rule => typeof rule !== 'function')[0] || undefined;
      return <IValidationModelNode>{
        rules: rules,
        default: defaultValue,
        value: defaultValue,
        pristine: true,
        valid: this.isValid(defaultValue, rules)
      }
    }) as IValidationModel;
    return validationModel;
  }

  private isValid (value: any, rules: IRule[]): boolean {
    return rules.every(rule => rule(value) === true);
  }

  private updateNode = (path: string, newValue: any): void => {
    let node = this.model[path];
    let newNode = {
      rules: node.rules,
      default: node.default,
      value: newValue,
      pristine: false,
      valid: this.isValid(newValue, node.rules)
    }
    this.model[path] = newNode;
    this.pristine = false;
    this.subscriber();
  }

  /*
  * Public API
  */
  setUpdateCallback = (callback: Function): void => {
    this.subscriber = callback;
  }

  val = (path: string): any => {
    return this.model[path].value;
  }

  handle = (path: string): Function => {
    // return function for handling changes
    return (e) => this.updateNode(path, e.target.value);
  }

  getModel = (): any => {
    let modelWithJustValues = mapValues(this.model, fullModelNode => fullModelNode.value);
    let unflattenedModel = unflatten(modelWithJustValues, {});
    return unflattenedModel;
  }

  isPristine = (path?: string): boolean => {
    return path
      ? this.model[path].pristine === true
      : this.pristine === true;
  }
}