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
  FunctionCallEdit,
  ReturnConfigForm,
  ExportConfigForm,
} from '../../component-configuration/components/config-forms';

const useConfigurableMenuItems = (onSubmit, onCancel, onUpdate, getConfig) => {
  const getConfigComponent = (item) => {
    switch (item) {
      case 'Configure Imports':
        return <ImportConfigForm />;
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
      case 'Html elements':
        return <AddELement />;
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
      case 'Return Statement':
        return <ReturnConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Edit Return':
        return (
          <ReturnConfigForm
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
      case 'Edit Function Call':
        return <FunctionCallEdit onUpdate={onUpdate} onCancel={onCancel} getConfig={getConfig} />;
      case 'Add Navigation':
        return <RouterNavigateConfigForm onSubmit={onSubmit} onCancel={onCancel} />;
      case 'Configure Exports':
        return <ExportConfigForm />;
      default:
        return null;
    }
  };

  return { getConfigComponent };
};

export default useConfigurableMenuItems;
