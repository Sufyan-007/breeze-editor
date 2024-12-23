// /* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useRef, useEffect, useState } from 'react';
import '../styles.css';

const PRESET_TEMPLATES = {
  form: ({ onClick, data, value }) => {
    const handleClick = () => {
      onClick(data);
    };

    const item = data[2];
    const formName = item.name;
    const accountName = item.account ? item.account.name : '';
    const className = value === data[0] ? 'item active' : 'item';

    return (
      <div onClick={handleClick} className={className}>
        <div className="breeze-list-item-title">{formName}</div>
        <span>{accountName}</span>
      </div>
    );
  },

  alarm: ({ onClick, data, value }) => {
    const handleClick = () => {
      onClick(data);
    };

    const item = data[2];
    const alarmName = item.name;
    const accountName = item.account.name;
    const className = value === data[0] ? 'item active' : 'item';

    return (
      <div onClick={handleClick} className={className}>
        <div className="breeze list-item-title">{alarmName}</div>
        <span>{accountName}</span>
      </div>
    );
  },

  assignment: ({ onClick, data, value }) => {
    const handleClick = () => {
      onClick(data);
    };

    const shortName = data[2][0];
    const longName = data[2][1].split(',');
    const className = value === data[0] ? 'item active' : 'item';

    return (
      <div onClick={handleClick} className={className}>
        <div className="breeze list-item-title">{shortName}</div>
        <div className="loc-long-name">
          <div className="wrap">
            {longName.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

const MultiSelectWrapper = ({ onClick, data, value, children }) => {
  const handleClick = () => {
    onClick(data);
  };

  console.log(data);
  console.log(value);
  console.log(children);

  const iconClass = value && value.includes(data[0]) ? 'bi bi-check-square' : 'bi bi-square';

  return (
    <div className="breeze-select-multi-item" onClick={handleClick}>
      <table width="100%">
        <tbody>
          <tr>
            <td width="25px">
              <div className="breeze-select-check">
                <i className={iconClass}></i>
              </div>
            </td>
            <td>{children}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const processExternalOptions = (options, hProp) => {
  const optionsMap = {};
  console.log(hProp);
  options.forEach((option) => {
    if (!optionsMap[option.id]) {
      optionsMap[option.id] = { ...option, children: [] };
    }
  });

  Object.values(optionsMap).forEach((option) => {
    if (option.parent_id && optionsMap[option.parent_id]) {
      optionsMap[option.parent_id].children.push(option);
    }
  });

  const cleaned = Object.values(optionsMap).filter((item) => !item.parent_id);

  return cleaned;
};

const recurseOptions = (items, label, val, level = 0) => {
  const options = [];
  const dashes = level > 0 ? ' '.repeat(level) + '-' : '';

  items.forEach((option) => {
    const itemLabel = `${dashes} ${option[label]}`;
    options.push([option[val], itemLabel]);

    if (option.children.length > 0) {
      const subOptions = recurseOptions(option.children, label, val, level + 1);
      options.push(...subOptions);
    }
  });

  return options;
};

const Item = ({ onClick, data, value, multiple }) => {
  const className = value === data[0] ? 'item active' : 'item';
  const handleClick = multiple ? null : () => onClick(data);
  return (
    <div className={className} onClick={handleClick}>
      {data[1]}
    </div>
  );
};

const init = (value, config, setInitialLoaded, toggle, setState) => {
  if (value && config?.optionsSource) {
    if (config.multiple) {
      setInitialLoaded(true);
      toggle(null);
      return;
    }

    const resource = config.optionsSource.resource.toLowerCase();
    let select = [config.optionsSource.labelSource, config.optionsSource.valSource];
    if (config.optionsSource.select) {
      select = config.optionsSource.select;
    }

    if (config.optionsSource.additionalProperties) {
      select = select.concat(config.optionsSource.additionalProperties);
    }

    let isPrefix = false;
    if (config.optionsSource.prefixed) {
      const suspects = config.optionsSource.prefixed.filter((item) => item[0] === value);
      if (suspects.length > 0) isPrefix = true;
    }

    if (!isPrefix) {
      let queryBuilder = {};
      queryBuilder.tx('com.ewars.resource', [resource, value, select, null]).then((resp) => {
        if (resp) {
          const newOptions = [[resp[config.optionsSource.valSource], resp[config.optionsSource.labelSource]]];
          setState((prevState) => ({
            ...prevState,
            options: [...newOptions, ...prevState.options],
          }));

          if (config?.optionsSource?.additional) {
            const additionalOptions = config.optionsSource.additional.map((option) => {
              const optionValue = option[0] ?? 'null';
              return [optionValue, option[1]];
            });
            setState((prevState) => ({
              ...prevState,
              options: [...additionalOptions, ...prevState.options],
            }));
          }
        }
        setInitialLoaded(true);
      });
    } else {
      setInitialLoaded(true);
    }
  }
};

const GenUniqueId = () => Math.random().toString(36).substring(2, 9);

const HandleSingleSelect = ({ emptyText, value, options, prefixed, onClick }) => {
  const name = value
    ? options.find((item) => item[0] === value)?.[1] || prefixed?.find((item) => item[0] === value)?.[1] || emptyText
    : emptyText || 'NO_SELECTION';

  console.log(value);
  console.log(options);
  console.log(name);

  return (
    <div className="handle" onClick={onClick}>
      <table width="100%">
        <tbody>
          <tr className="single-select">
            <td>{name}</td>
            <td width="20px" className="icon">
              <i className="bi bi-caret-down"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// root file for common select component
function SelectField(props) {
  const {
    config,
    path,
    name,
    value,
    onUpdate,
    readOnly,
    template,
    ItemTemplate,
    addNoSelection = true,
    styleClass,
  } = props;

  const selectorRef = useRef(null);
  const [state, setState] = useState({
    showOptions: false,
    rawOptions: [],
    options: [],
    placeKey: GenUniqueId(),
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const previousValue = useRef(null);

  const handleBodyClick = (evt) => {
    // it is for closing down the options when user clicks somewhere else on the UI
    if (selectorRef.current && !selectorRef.current.contains(evt.target)) {
      setState((prevState) => ({ ...prevState, showOptions: false }));
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleBodyClick);
    return () => {
      document.removeEventListener('click', handleBodyClick);
    };
  }, []); // Empty dependency array means this effect runs only once

  useEffect(() => {
    if (config?.optionsSource && value) {
      if (value !== previousValue.current) {
        init(value, config, setInitialLoaded, toggle, setState);
      }
    } else {
      setInitialLoaded(true);
      setState((prevState) => ({ ...prevState, options: config.options }));
    }
    previousValue.current = value;
  }, [config, value]);

  const toggle = (e) => {
    if (e) e.stopPropagation();
    setState((prevState) => ({
      ...prevState,
      showOptions: !prevState.showOptions,
    }));
  };

  useEffect(() => {
    if (config.optionsSource && isLoaded) {
      let optionsList = [];

      if (config.optionsSource.hierarchical) {
        const optionsH = processExternalOptions(state.rawOptions, config.optionsSource.hierarchyProp);
        optionsList = recurseOptions(optionsH, config.optionsSource.labelSource, config.optionsSource.valSource, 0);
      } else {
        optionsList = state.rawOptions.map((item) => [
          item[config.optionsSource.valSource],
          item[config.optionsSource.labelSource],
          item,
        ]);

        if (config.optionsSource.additional) {
          config.optionsSource.additional.forEach((option) => {
            const optionValue = option[0] == null ? 'null' : option[0];
            optionsList.unshift([optionValue, option[1]]);
          });
        }
      }

      setState((prevState) => ({
        ...prevState,
        options: optionsList,
      }));
    }
  }, [config, state.rawOptions, isLoaded]);

  useEffect(() => {
    if (config.optionsSource && !isLoaded) {
      const resource = config.optionsSource.resource.toLowerCase();
      let select = config.optionsSource.select || [config.optionsSource.labelSource, config.optionsSource.valSource];

      if (config.optionsSource.additionalProperties) {
        select = select.concat(config.optionsSource.additionalProperties);
      }

      const join = config.optionsSource.join || null;
      const orderby = config.optionsSource.orderby || null;

      let queryBuilder = {};
      queryBuilder
        .tx('com.ewars.query', [resource, select, config.optionsSource.query, orderby, null, null, join])
        .then((resp) => {
          let optionsList = [];

          if (config.optionsSource.hierarchical) {
            const optionsH = processExternalOptions(resp, config.optionsSource.hierarchyProp);
            optionsList = recurseOptions(optionsH, config.optionsSource.labelSource, config.optionsSource.valSource, 0);
          } else {
            optionsList = resp.map((item) => [
              item[config.optionsSource.valSource],
              item[config.optionsSource.labelSource],
              item,
            ]);

            if (config.optionsSource.additional) {
              config.optionsSource.additional.forEach((option) => {
                const optionValue = option[0] == null ? 'null' : option[0];
                optionsList.unshift([optionValue, option[1]]);
              });
            }

            setState((prevState) => ({
              ...prevState,
              rawOptions: resp,
            }));
          }

          setState((prevState) => ({
            ...prevState,
            options: optionsList,
          }));
          setIsLoaded(true);
        });
    }
  }, [config, isLoaded]);

  const getOptions = () => {
    return config.options.length ? config.options : state.options.length ? state.options : [];
  };

  const processConfig = (config) => {
    return {
      ...config,
      multiple: config?.multiple ?? false,
    };
  };

  const selectNone = (e) => {
    e.preventDefault();
    const selectedName = config.nameOverride || name;
    onUpdate(selectedName, [], path, null);
  };

  const selectAll = (e) => {
    e.preventDefault();
    const selectedName = config.nameOverride || name;
    const value = config.optionsSource
      ? state.rawOptions.map((item) => item[config.optionsSource.valSource])
      : config.options.map((item) => item[0]);
    // here value is array of keys where key is a unique identifier
    // its an array here since we can suse selectAll multi-select
    onUpdate(selectedName, value, path, null);
  };

  const onPrefixSelect = (e) => {
    if (readOnly) return;
    const val = e.target.getAttribute('data-value');
    const selectedName = config.nameOverride || name;
    setState((prevState) => ({ ...prevState, showOptions: false }));
    onUpdate(selectedName, val, path, null);
  };

  const onChange = (item) => {
    if (readOnly) return;
    const selectedName = config.nameOverride || name;
    setState((prevState) => ({ ...prevState, showOptions: false }));
    const selectedPath = path || name;

    const node = config.optionsSource
      ? state.rawOptions.find((result) => result[config.optionsSource.valSource] === item[0])
      : item;

    console.log(node);
    console.log(state);

    // if is a single select
    if (!config.multiple) {
      onUpdate(selectedName, item[0], selectedPath, node);
    } else {
      // for adding or removing a selected option
      console.log(value);

      let newVal = Array.isArray(value) ? [...value] : [];
      if (!newVal.includes(item[0])) {
        newVal.push(item[0]);
      } else {
        newVal = newVal.filter((p) => p !== item[0]);
      }
      console.log(newVal);

      onUpdate(selectedName, newVal, selectedPath, node);
    }
  };

  const getOptionDisplay = () => {
    return state.options.find((option) => option[0] === value)?.[1] || 'NO_1SELECTION';
  };

  const dataClassName = `breeze-select-data ${styleClass ? styleClass : ''}`;

  const multiple = config?.multiple ?? false;

  if (!initialLoaded) {
    return (
      <div className="breeze-select">
        <div className="handle">
          <i className="fal fa-spin fa-circle-o-notch"></i>
        </div>
      </div>
    );
  }

  let currentConfig = processConfig();
  !currentConfig ? console.log(currentConfig) : '';

  if (readOnly && !multiple) {
    const value = getOptionDisplay();
    return <input type="text" disabled={true} value={value} />;
  }

  const rawOptions = getOptions();
  console.log(rawOptions);

  let finalItemTemplate = ItemTemplate || config.ItemTemplate || Item;
  const templateName = template || config.template || null;
  const TemplateComponent = templateName ? PRESET_TEMPLATES[templateName] : finalItemTemplate;

  let options = rawOptions.map((option) => {
    const id = GenUniqueId();

    // wraps each single option in the dropdown
    let item = (
      <TemplateComponent
        readOnly={readOnly}
        multiple={multiple}
        data={option}
        onClick={onChange}
        value={value}
        key={id}
      />
    );

    // converts the option into a multi-select's option
    if (multiple) {
      item = (
        <MultiSelectWrapper readOnly={readOnly} data={option} onClick={onChange} value={value} key={id}>
          {item}
        </MultiSelectWrapper>
      );
    }

    return item;
  });
  console.log(options);
  console.log(state.showOptions);

  let prefixed = [];
  if (config?.optionsSource?.prefixed) {
    prefixed = config.optionsSource.prefixed;
    prefixed.forEach((item) => {
      options.unshift(
        <div key={item[0]} className="item" data-key={item[0]} data-value={item[0]} onClick={onPrefixSelect}>
          {item[1]}
        </div>
      );

      rawOptions.push(item);
    });
  }

  if (!multiple && addNoSelection === true) {
    options.unshift(
      <div key={state.placeKey} className="item" data-key={state.placeKey} data-value="null" onClick={onChange}>
        No Selection
      </div>
    );
  }

  if (config?.optionsSource && !isLoaded) {
    options = <i className="fa fa-circle-o-notch fa-spin" style="font-size:24px"></i>;
  }

  const handleClass = `breeze-select ${state.showOptions && !multiple ? 'breeze-select-open' : ''}`;
  const handleStyle = config?.handleWidth ? { width: config.handleWidth } : undefined;

  return (
    <div ref={selectorRef} className={handleClass} onClick={multiple ? null : handleBodyClick} style={handleStyle}>
      {!multiple ? (
        <HandleSingleSelect
          onClick={toggle}
          emptyText={config.emptyText}
          value={value}
          prefixed={prefixed}
          options={rawOptions}
        />
      ) : null}
      {!state.showOptions ? <div className={dataClassName}>{options}</div> : null}
      {multiple && !readOnly ? (
        <div style={{ padding: 8, borderTop: '1px solid #CCC' }}>
          <a onClick={selectAll} href="#">
            {'SELECT_ALL'}
          </a>{' '}
          |{' '}
          <a onClick={selectNone} href="#">
            {'SELECT_NONE'}
          </a>
        </div>
      ) : null}
    </div>
  );
}

export default SelectField;
