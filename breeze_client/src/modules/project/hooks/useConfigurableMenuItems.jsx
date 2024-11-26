import {
  ImportConfigForm,
  PropConfigForm,
  VariableConfigForm,
  AddELement,
  FunctionConfigForm,
  LifecycleConfigForm,
  HookConfigForm,
  IfBlockConfigForm,
  WhileBlockConfigForm,
  DoWhileConfigForm,
  TryCatchConfigForm,
  ComponentConfigForm,
  StateVariableConfigForm,
  RefVarConfigForm,
} from '../../component-configuration/components/config-forms';

const useConfigurableMenuItems = (onSubmit, onCancel) => {
  const getConfigComponent = (item) => {
    switch (item) {
      case 'Component Config':
        return <ComponentConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Add Import':
        return <ImportConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Import':
        return <ImportConfigForm onSubmit={onSubmit} onCancel={onCancel} formData={{}} editMode={true} />;
      case 'Props':
        return <PropConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Prop':
        return <PropConfigForm onSubmit={onSubmit} onCancel={onCancel} formData={{}} editMode={true} />;
      case 'Variable':
        return <VariableConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'State Variable':
        return <StateVariableConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit State Variable':
        return <StateVariableConfigForm onSubmit={onSubmit} onCancel={onCancel} formData={{}} editMode={true} />;
      case 'Ref Variable':
        return <RefVarConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Ref Variable':
        return <RefVarConfigForm onSubmit={onSubmit} onCancel={onCancel} formData={{}} editMode={true} />;
      case 'Html elements':
        return <AddELement />;
      case 'Function':
        return <FunctionConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Lifecycle':
        return <LifecycleConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Hook':
        return <HookConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'If Block':
        return <IfBlockConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit If Block':
        return <IfBlockConfigForm onSubmit={onSubmit} onCancel={onCancel} formData={{}} editMode={true} />;
      case 'While Block':
        return <WhileBlockConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit While Block':
        return <WhileBlockConfigForm onSubmit={onSubmit} onCancel={onCancel} formData={{}} editMode={true} />;
      case 'Do While Block':
        return <DoWhileConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Do While':
        return <DoWhileConfigForm onSubmit={onSubmit} onCancel={onCancel} formData={{}} editMode={true} />;
      case 'Try Catch':
        return <TryCatchConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      default:
        return null;
    }
  };

  return { getConfigComponent };
};

export default useConfigurableMenuItems;
