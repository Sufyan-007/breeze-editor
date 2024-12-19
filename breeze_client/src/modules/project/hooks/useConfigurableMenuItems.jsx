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
  FunctionCall,
  ServiceCall,
  RouterNavigateConfigForm,
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
        return (
          <VariableConfigForm
            getConfig={getConfig}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editMode={true}
            onUpdate={onUpdate}
          />
        );
      case 'State Variable':
        return <StateVariableConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit State Variable':
        return (
          <StateVariableConfigForm
            getConfig={getConfig}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editMode={true}
            onUpdate={onUpdate}
          />
        );
      case 'Ref Variable':
        return <RefVarConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Ref Variable':
        return (
          <RefVarConfigForm
            getConfig={getConfig}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editMode={true}
            onUpdate={onUpdate}
          />
        );
      case 'Add elements':
        return <AddELement onSubmit={onSubmit} getConfig={getConfig} />;
      case 'Edit elements':
        return <AddELement onSubmit={onSubmit} getConfig={getConfig} onUpdate={onUpdate} editMode={true} />;
      case 'Function':
        return <FunctionConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Function':
        return (
          <FunctionConfigForm
            getConfig={getConfig}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editMode={true}
            onUpdate={onUpdate}
          />
        );
      case 'Use Effect':
        return <LifecycleConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Use Effect':
        return (
          <LifecycleConfigForm
            getConfig={getConfig}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editMode={true}
            onUpdate={onUpdate}
          />
        );
      case 'Use Memo':
        return <UseMemoConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Use Memo':
        return (
          <UseMemoConfigForm
            getConfig={getConfig}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editMode={true}
            onUpdate={onUpdate}
          />
        );
      case 'Use Callback':
        return <UseCallbackConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Use Callback':
        return (
          <UseCallbackConfigForm
            getConfig={getConfig}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editMode={true}
            onUpdate={onUpdate}
          />
        );
      case 'If Block':
        return <IfBlockConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit If Block':
        return (
          <IfBlockConfigForm
            getConfig={getConfig}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editMode={true}
            onUpdate={onUpdate}
          />
        );
      case 'While Block':
        return <WhileBlockConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit While Block':
        return (
          <WhileBlockConfigForm
            getConfig={getConfig}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editMode={true}
            onUpdate={onUpdate}
          />
        );
      case 'Do While Block':
        return <DoWhileConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Do While':
        return (
          <DoWhileConfigForm
            getConfig={getConfig}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editMode={true}
            onUpdate={onUpdate}
          />
        );
      case 'Try Catch':
        return <TryCatchConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Try Catch':
        return (
          <TryCatchConfigForm
            getConfig={getConfig}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editMode={true}
            onUpdate={onUpdate}
          />
        );
      case 'Custom Code':
        return <CustomCode onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Custom Code':
        return (
          <CustomCode
            getConfig={getConfig}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editMode={true}
            onUpdate={onUpdate}
          />
        );
      case 'Console.log':
        return <ConsoleStatementForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Add Comment':
        return <CommentConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Comment':
        return (
          <CommentConfigForm
            getConfig={getConfig}
            onSubmit={onSubmit}
            onCancel={onCancel}
            editMode={true}
            onUpdate={onUpdate}
          />
        );
      case 'Function Call':
        return <FunctionCall onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Service Call':
        return <ServiceCall onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Add Navigation':
        return <RouterNavigateConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      default:
        return null;
    }
  };

  return { getConfigComponent };
};

export default useConfigurableMenuItems;
