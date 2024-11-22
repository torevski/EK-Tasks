class FormField {
  constructor({ key, label, type, validation = {}, conditional = null }) {
    this.key = key;
    this.label = label;
    this.type = type;
    this.validation = validation;
    this.conditional = conditional;
  }
}

class TextField extends FormField {
  constructor({ key, label, placeholder = '', validation = {}, conditional = null }) {
    super({ key, label, type: 'text', validation, conditional });
    this.placeholder = placeholder;
  }
}

class NumberField extends FormField {
  constructor({ key, label, placeholder = '', validation = {}, conditional = null }) {
    super({ key, label, type: 'number', validation, conditional });
    this.placeholder = placeholder;
  }
}

class CheckboxField extends FormField {
  constructor({ key, label, conditional = null }) {
    super({ key, label, type: 'checkbox', conditional });
  }
}

class DropdownField extends FormField {
  constructor({ key, label, options = [], validation = {}, conditional = null }) {
    super({ key, label, type: 'dropdown', validation, conditional });
    this.options = options;
  }
}

export { FormField, TextField, NumberField, CheckboxField, DropdownField };
