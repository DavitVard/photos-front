import { extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/en.json';

Object
  .keys(rules)
  .forEach(rule => extend(rule, { ...rules[rule], message: messages[rule] }));

extend('string', {
  validate: value => typeof value === 'string',
  message: 'The {_field_} field must string.'
});

extend('array', {
  validate: value => Array.isArray(value),
  message: 'The {_field_} field must string.'
});

extend('boolean', {
  validate: value => {
    switch (typeof value) {
      case "boolean":
        return true;
      case "string":
        return (value === "0" || value === "1");
      case "number":
        return (value === 0 || value === 1);
      default:
        return false;
    }
  },
  message: 'The {_field_} field must string.'
});

extend('password', {
  params: ['target'],
  validate: (value, { target })  => value === target,
  message: 'Password confirmation does not match'
});

/**
 * Apply dragging items
 *
 * @param {Array} arr
 * @param dragResult
 * @return {*[]|*}
 */
export const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  return result
};
