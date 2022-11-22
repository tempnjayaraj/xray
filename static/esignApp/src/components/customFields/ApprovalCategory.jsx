import React, {useState, useEffect, useCallback, Fragment} from 'react';
import {invoke, view} from '@forge/bridge';
import Form, {FormHeader, FormSection, FormFooter, Field} from '@atlaskit/form';
import Button, {ButtonGroup} from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';
import Select from "@atlaskit/select";
import styled from 'styled-components';

const Content = styled.div`
  margin: 24px 24px 0;
`;

export default function ApprovalCategory(){
    const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryValue,setcategoryValue]=useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
    view.getContext().then(({extension}) => {
      let value = extension.fieldValue ? extension.fieldValue : 'NONE'
      setcategoryValue({ label: value, value: value });
    });
    const categories = await invoke("getApprovalCategories");
     if (categories && Array.isArray(categories)) {
        let array = [];
        categories.map((item) => {
          array.push({ label: item.name, value: item.name });
        });
        setCategoryOptions(array);
      }
    })();
    return () => {};
  }, []);

  const onSubmit = useCallback(async (formData) => {
    try {      
      return await view.submit(formData.fieldValue.value);
    } catch {
      setError("Couldn't save the custom field");
    }
  }, [view]);

  if (!categoryOptions) {
    return <>{'Loading...'}</>;
  }

  return (
    <Content>
        {categoryOptions && Array.isArray(categoryOptions) && categoryOptions.length ? 
      <Form onSubmit={onSubmit}>
        {({formProps, dirty, submitting}) => (
          <form {...formProps}>
            <FormHeader title="Select Category"/>
            <FormSection>
              {error && <SectionMessage appearance="error">{error}</SectionMessage>}
              
              <Field
              label="Approval Category"
              name="fieldValue"
              isRequired
              defaultValue={categoryValue}
            > 
              {({ fieldProps}) => (
                <Fragment>
                  <Select {...fieldProps} options={categoryOptions} />
                </Fragment>
              )}
            </Field>
            </FormSection>
            <FormFooter>
              <ButtonGroup>
                <Button type="submit" appearance="primary" isDisabled={submitting}>
                  Submit
                </Button>
                <Button appearance="subtle" onClick={view.close}>
                  Cancel
                </Button>
              </ButtonGroup>
            </FormFooter>
          </form>
        )}
      </Form> : null
    } 
    </Content>
  );
}