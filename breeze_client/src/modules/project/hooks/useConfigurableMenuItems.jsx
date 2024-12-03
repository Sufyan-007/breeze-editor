import {
  ImportConfigForm,
  VariableConfigForm,
  AddELement,
  FunctionConfigForm,
  LifecycleConfigForm,
  UseMemoConfigForm,
  UseCallbackConfigForm,
  IfBlockConfigForm,
  WhileBlockConfigForm,
  DoWhileConfigForm,
  TryCatchConfigForm,
  ComponentConfigForm,
  StateVariableConfigForm,
  RefVarConfigForm,
  CustomCode,
  ConsoleStatementForm,
  CommentConfigForm,
} from '../../component-configuration/components/config-forms';

const useConfigurableMenuItems = (onSubmit, onCancel, onUpdate, getConfig) => {
  const getConfigComponent = (item) => {
    switch (item) {
      case 'Component Config':
        return (
          <ComponentConfigForm
            getConfig={getConfig}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editMode={true}
            onUpdate={onUpdate}
          />
        );
      case 'Add Import':
        return <ImportConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Import':
        return <ImportConfigForm onSubmit={onSubmit} onCancel={onCancel} editMode={true} />;
      case 'Props':
        return (
          <ComponentConfigForm
            getConfig={getConfig}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editMode={true}
            onUpdate={onUpdate}
          />
        );
      case 'Variable':
        return <VariableConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Variable':
        return <VariableConfigForm onSubmit={onSubmit} onCancel={onCancel} editMode={true} />;
      case 'State Variable':
        return <StateVariableConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit State Variable':
        return <StateVariableConfigForm onSubmit={onSubmit} onCancel={onCancel} editMode={true} />;
      case 'Ref Variable':
        return <RefVarConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Ref Variable':
        return <RefVarConfigForm onSubmit={onSubmit} onCancel={onCancel} editMode={true} />;
      case 'Html elements':
        return <AddELement />;
      case 'Function':
        return <FunctionConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Function':
        return <FunctionConfigForm onSubmit={onSubmit} onCancel={onCancel} editMode={true} />;
      case 'Use Effect':
        return <LifecycleConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Use Effect':
        return <LifecycleConfigForm onSubmit={onSubmit} onCancel={onCancel} editMode={true} />;
      case 'Use Memo':
        return <UseMemoConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Use Memo':
        return <UseMemoConfigForm onSubmit={onSubmit} onCancel={onCancel} editMode={true} />;
      case 'Use Callback':
        return <UseCallbackConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Use Callback':
        return <UseCallbackConfigForm onSubmit={onSubmit} onCancel={onCancel} editMode={true} />;
      case 'If Block':
        return <IfBlockConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit If Block':
        return <IfBlockConfigForm onSubmit={onSubmit} onCancel={onCancel} editMode={true} />;
      case 'While Block':
        return <WhileBlockConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit While Block':
        return <WhileBlockConfigForm onSubmit={onSubmit} onCancel={onCancel} editMode={true} />;
      case 'Do While Block':
        return <DoWhileConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Do While':
        return <DoWhileConfigForm onSubmit={onSubmit} onCancel={onCancel} editMode={true} />;
      case 'Try Catch':
        return <TryCatchConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Try Catch':
        return <TryCatchConfigForm onSubmit={onSubmit} onCancel={onCancel} editMode={true} />;
      case 'Custom Code':
        return <CustomCode onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Console.log':
        return <ConsoleStatementForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Add Comment':
        return <CommentConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      default:
        return null;
    }
  };

  return { getConfigComponent };
};

export default useConfigurableMenuItems;
