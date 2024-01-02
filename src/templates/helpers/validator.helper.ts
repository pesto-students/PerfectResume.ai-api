import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const ajv = new Ajv({ allErrors: true, $data: true });
addFormats(ajv);
addErrors(ajv);

const ajvValidator = (schema: object) => {
  const validate = ajv.compile(schema);
  return validate;
};

export { ajvValidator };
