import { useEffect, useState } from 'react';
import CustomFormBuilder from './CustomFormBuilder';
import { lifeCycleConfigMapping, NestedMapping } from './mappings/TestMappings';
const TestingComponent = () => {
  const [user, setUser] = useState({
    name: '',
    role: '',
    age: 90,
    interests: ['a', 'b', 'c'],
    sampleRecord: {
      a: 'abv',
      b: 'abvasd',
      c: 'ghjk',
    },
  });
  const [formErrors, setFormErrors] = useState([]);
  const [formState, setFormState] = useState({
    name: '',
    type: 'lifecycle',
    body: {
      lifecycleType: 'onInitialMount',
      dependentVars: [],
      lifecycleBody: {
        name: '',
        type: 'function',
        parameters: [],
        isAnonymous: true,
        isAsync: false,
        bodyConfig: {
          type: 'BLOCK',
          statements: [],
        },
      },
      description: '',
    },
  });
  const handleFormChange = (key, value) => {
    setFormState((prevState) => ({
      ...prevState,
      body: {
        ...prevState.body,
        [key]: value,
      },
    }));
  };
  useEffect(() => {
    // console.log(user, 'new user data');
    console.log(formState, 'formstate');
  }, [formState]);

  function someFunc() {
    setUser((state) => {
      state.role = 'admin';
      state.name = 'John';
      state.interests = ['a', 'b', 'c'];
      return { ...state };
    });
  }

  return (
    <div>
      <h1>Custom Form Builder</h1>
      <h2>Sample</h2>
      <CustomFormBuilder
        config={NestedMapping}
        value={user}
        otherStates={{ MyCondition: formErrors.length < 0 }}
        metaData={user}
        onChange={setUser}
      />
      {/* <CustomFormBuilder
        config={lifeCycleConfigMapping}
        value={formState}
        otherStates={null}
        metaData={formState}
        onChange={setFormState}
      /> */}
      <button onClick={someFunc}>Reset States</button>
    </div>
  );
};

export default TestingComponent;
