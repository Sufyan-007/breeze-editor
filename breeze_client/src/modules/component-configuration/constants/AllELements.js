const htmlElements = {
  1: 'div',
  2: 'span',
  3: 'table',
  4: 'tr',
  5: 'td',
  6: 'th',
  7: 'ul',
  8: 'ol',
  9: 'li',
  10: 'a',
  11: 'input',
  12: 'button',
  13: 'form',
  14: 'textarea',
  15: 'select',
  16: 'option',
  17: 'label',
  18: 'fieldset',
  19: 'legend',
  20: 'datalist',
  21: 'output',
  22: 'img',
  23: 'nav',
  24: 'header',
  25: 'footer',
  26: 'section',
  27: 'article',
  28: 'aside',
  29: 'main',
  30: 'h1',
  31: 'h2',
  32: 'h3',
  33: 'h4',
  34: 'h5',
  35: 'h6',
  36: 'p',
  37: 'br',
  38: 'hr',
  39: 'pre',
  40: 'code',
};

export default htmlElements;

const elementAttributes = {
  data: {
    div: {
      props: {
        div_001: {
          prop_name: 'id',
          type: 'string | undefined',
          default_value: '',
          id: 'div_001',
        },
        div_002: {
          prop_name: 'className',
          type: 'string | undefined',
          default_value: '',
          id: 'div_002',
        },
        div_003: {
          prop_name: 'style',
          type: 'CSSProperties | undefined',
          default_value: '',
          id: 'div_003',
        },
        div_004: {
          prop_name: 'onClick',
          type: 'function | undefined',
          default_value: null,
          id: 'div_004',
        },
      },
    },
    span: {
      props: {
        span_001: {
          prop_name: 'id',
          type: 'string | undefined',
          default_value: '',
          id: 'span_001',
        },
        span_002: {
          prop_name: 'className',
          type: 'string | undefined',
          default_value: '',
          id: 'span_002',
        },
        span_003: {
          prop_name: 'style',
          type: 'CSSProperties | undefined',
          default_value: '',
          id: 'span_003',
        },
        span_004: {
          prop_name: 'onClick',
          type: 'function | undefined',
          default_value: null,
          id: 'span_004',
        },
      },
    },
    a: {
      props: {
        a_001: {
          prop_name: 'href',
          type: 'string | undefined',
          default_value: '',
          id: 'a_001',
        },
        a_002: {
          prop_name: 'target',
          type: 'string | undefined',
          default_value: '',
          id: 'a_002',
        },
        a_003: {
          prop_name: 'rel',
          type: 'string | undefined',
          default_value: '',
          id: 'a_003',
        },
        a_004: {
          prop_name: 'onClick',
          type: 'function | undefined',
          default_value: null,
          id: 'a_004',
        },
      },
    },
    input: {
      props: {
        input_001: {
          prop_name: 'type',
          type: 'string',
          default_value: 'text',
          id: 'input_001',
        },
        input_002: {
          prop_name: 'disabled',
          type: 'boolean | undefined',
          default_value: false,
          id: 'input_002',
        },
        input_003: {
          prop_name: 'value',
          type: 'string | number | undefined',
          default_value: '',
          id: 'input_003',
        },
        input_004: {
          prop_name: 'onChange',
          type: 'function | undefined',
          default_value: null,
          id: 'input_004',
        },
      },
    },
    button: {
      props: {
        button_001: {
          prop_name: 'onClick',
          type: 'function | undefined',
          default_value: null,
          id: 'button_001',
        },
        button_002: {
          prop_name: 'disabled',
          type: 'boolean | undefined',
          default_value: false,
          id: 'button_002',
        },
        button_003: {
          prop_name: 'type',
          type: 'string',
          default_value: 'button',
          id: 'button_003',
        },
      },
    },
    form: {
      props: {
        form_001: {
          prop_name: 'action',
          type: 'string | undefined',
          default_value: '',
          id: 'form_001',
        },
        form_002: {
          prop_name: 'method',
          type: 'string',
          default_value: 'get',
          id: 'form_002',
        },
        form_003: {
          prop_name: 'enctype',
          type: 'string | undefined',
          default_value: '',
          id: 'form_003',
        },
        form_004: {
          prop_name: 'onSubmit',
          type: 'function | undefined',
          default_value: null,
          id: 'form_004',
        },
      },
    },
    textarea: {
      props: {
        textarea_001: {
          prop_name: 'rows',
          type: 'number | undefined',
          default_value: '',
          id: 'textarea_001',
        },
        textarea_002: {
          prop_name: 'cols',
          type: 'number | undefined',
          default_value: '',
          id: 'textarea_002',
        },
        textarea_003: {
          prop_name: 'placeholder',
          type: 'string | undefined',
          default_value: '',
          id: 'textarea_003',
        },
        textarea_004: {
          prop_name: 'onChange',
          type: 'function | undefined',
          default_value: null,
          id: 'textarea_004',
        },
      },
    },
    select: {
      props: {
        select_001: {
          prop_name: 'multiple',
          type: 'boolean | undefined',
          default_value: false,
          id: 'select_001',
        },
        select_002: {
          prop_name: 'disabled',
          type: 'boolean | undefined',
          default_value: false,
          id: 'select_002',
        },
        select_003: {
          prop_name: 'onChange',
          type: 'function | undefined',
          default_value: null,
          id: 'select_003',
        },
      },
    },
    option: {
      props: {
        option_001: {
          prop_name: 'value',
          type: 'string | undefined',
          default_value: '',
          id: 'option_001',
        },
        option_002: {
          prop_name: 'selected',
          type: 'boolean | undefined',
          default_value: false,
          id: 'option_002',
        },
      },
    },
    img: {
      props: {
        img_001: {
          prop_name: 'src',
          type: 'string | undefined',
          default_value: '',
          id: 'img_001',
        },
        img_002: {
          prop_name: 'alt',
          type: 'string | undefined',
          default_value: '',
          id: 'img_002',
        },
        img_003: {
          prop_name: 'width',
          type: 'number | string | undefined',
          default_value: '',
          id: 'img_003',
        },
        img_004: {
          prop_name: 'height',
          type: 'number | string | undefined',
          default_value: '',
          id: 'img_004',
        },
      },
    },
  },
};

export { elementAttributes };
