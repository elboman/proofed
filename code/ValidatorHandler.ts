import * as get from 'lodash/get';
import * as set from 'lodash/set';
import * as mapValues from 'lodash/mapValues';
import * as cloneDeep from 'lodash/cloneDeep';
import * as pick from 'lodash/pick';
import {flatten, unflatten} from './utils/flat';

export type IRule = (value:any, model:any) => boolean | string;
export type ISchemaAttribute = IRule[];

export type IErrorList = string[];

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
  errors: string[];
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
    Object.getOwnPropertyNames(this.model).forEach(path => {
      this.updateNode(path, this.model[path].value, true);
    });
  }

  private createValidatorModelFromSchema = (schema: ISchema, retainModel?: boolean): IValidationModel => {
    let flattenSchema = flatten(schema, {});
    let validationModel = mapValues(flattenSchema, (rulesAndDefault: IRule[], path: string) => {
      let rules = rulesAndDefault.filter(rule => typeof rule === 'function');
      let defaultValue = rulesAndDefault.filter(rule => typeof rule !== 'function')[0];
      let value = defaultValue;
      if (retainModel && this.model && this.model[path] && this.model[path].value)
        value = this.model[path].value;
      return <IValidationModelNode>{
        rules: rules,
        default: defaultValue,
        value: value,
        pristine: true,
        valid: true,
        errors: []
      }
    }) as IValidationModel;
    return validationModel;
  }

  private isValid (value: any, rules: IRule[]): boolean {
    let model = this.getModel();
    return rules.every(rule => rule(value, model) === true);
  }

  private getErrors (value: any, rules: IRule[]): string[] {
    let model = this.getModel();
    return rules
      .map(rule => rule(value, model))
      .filter(result => typeof result === 'string') as string[];
  }

  private updateNode = (path: string, newValue: any, skipPristineCheck?: boolean): void => {
    let node = this.model[path];
    let newNode = {
      rules: node.rules,
      default: node.default,
      value: newValue,
      pristine: skipPristineCheck ? node.pristine : false,
      valid: this.isValid(newValue, node.rules),
      errors: this.getErrors(newValue, node.rules)
    }
    this.model[path] = newNode;
    this.pristine = skipPristineCheck ? this.pristine : false;
    // update all errors that may depend on current node being updated
    Object.getOwnPropertyNames(this.model)
      .map(path => this.model[path].errors = this.getErrors(this.model[path].value, this.model[path].rules))
    typeof this.subscriber === 'function' && this.subscriber();
  }

  /*
  * Public API
  */

  updateSchema = (schema: ISchema):void => {
    this.schema = schema;
    this.model = this.createValidatorModelFromSchema(schema, true);
    Object.getOwnPropertyNames(this.model).forEach(path => {
      this.updateNode(path, this.model[path].value, true);
    });
  }

  setUpdateCallback = (callback: Function): void => {
    this.subscriber = callback;
  }

  val = (path: string): any => {
    return this.model[path].value;
  }

  handle = (path: string, mapValue?: (e:any) => any ): Function => {
    // check if provided path is a valid one
    if (typeof this.model[path] === 'undefined') throw new Error(`[handle('${path}')] Schema path ('${path}') not found. Please check your validation schema.`);
    // return function for handling changes
    if (mapValue && typeof mapValue !== 'function') throw new Error(`[handle('${path}', mapValue)]: mapValue must be of type function, instead got '${typeof mapValue}'`);
    else if(mapValue && typeof mapValue == 'function') return (e) => {
      let mapped = mapValue(e);
      if (typeof mapped === 'undefined') throw new Error(`[handle('${path}', mapValue)]: mapValue must return a value, instead got 'undefined'`);
      this.updateNode(path, mapped);
    }
    return (e) => this.updateNode(path, e.target.value);
  }

  getModel = (): any => {
    let modelWithJustValues = mapValues(this.model, fullModelNode => fullModelNode.value);
    let flattenSchema = flatten(this.schema, {});
    let modelWithJustValuesFiltered = pick(modelWithJustValues, Object.keys(flattenSchema));
    let unflattenedModel = unflatten(modelWithJustValuesFiltered, {});
    return unflattenedModel;
  }

  getSubmit = () => {
    return (cb) => {
      if (typeof cb !== 'function') throw new Error(`Function '${cb}' provided to 'submit()' is not valid.`);
      else return (e) => cb(e, this.getModel(), this.errors())
    }
  }

  isPristine = (path?: string): boolean => {
    return path
      ? this.model[path].pristine === true
      : this.pristine === true;
  }

  valid = (path?: string): boolean => {
    return path
      ? this.model[path].valid === true
      : Object.getOwnPropertyNames(this.model).every(path => this.model[path].valid === true)
  }

  errors = (path?: string): IErrorList => {
    return path
      ? this.model[path].errors
      : [].concat(Object.getOwnPropertyNames(this.model).map(path => this.model[path].errors))
  }
}