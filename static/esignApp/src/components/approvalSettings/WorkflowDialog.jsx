import React, { useContext, useRef, useEffect, Fragment } from "react";
import { DialogContent, Dialog, DialogTitle } from "@material-ui/core";
import { invoke, requestJira } from "@forge/bridge";
import Button from "@atlaskit/button";
import ButtonGroup from "@atlaskit/button/button-group";
import Select from "@atlaskit/select";
import Textfield from "@atlaskit/textfield";
import Form, {
  Field,
  FormFooter,
  ErrorMessage, 
} from "@atlaskit/form";
import { withStyles } from "@material-ui/core";


function WorkflowDialog(props) {
  const styles = {
    customMaxWidth: {
      maxWidth: "none" // arbitrary value
    }
  };
  
  const {
    onSetAddApprovalWorkflowOpen,
    onPutApprovalWorkflows,
    isAddApprovalWorkflowOpen,
    users,
    categoryOptions,
    issueTypeOptions,
    statusOptions,
    tempObject,
    onSetTempValue,
    mode,
    updateEnable,
    editRole,
    editData,
    approvalRoleEdit,
    stateTransitions
  } = props;
  return(
  <Dialog
  classes={{ paperScrollPaper: styles.customMaxWidth }}
    onClose={() => onSetAddApprovalWorkflowOpen(false)}
    open={isAddApprovalWorkflowOpen} backdrop="static" onBackdropClick="false"
  >
    <DialogTitle>Approval Workflow</DialogTitle>
   
    <DialogContent>     
      <Form onSubmit={(formData) => onPutApprovalWorkflows(formData)}>
       
        {({ formProps }) => (
         
          <form {...formProps} name="native-validation-example">
             
            <Field
              label="Issue Type"
              name="issuetype"
              isDisabled ={mode==='edit'}
              isRequired
              validate={async (value) => {
                if (value) {
                  onSetTempValue(value,"issuetype");
                }}}
              defaultValue={tempObject.issuetype}
            >
              {({ fieldProps }) => (
                <Fragment>
                  <Select {...fieldProps} options={issueTypeOptions} />
                </Fragment>
              )}
            </Field>
            <Field
              label="Status"
              name="status"
              isRequired
              validate={async (value) => {
                if (value) {
                  onSetTempValue(value,"status");
                }}}
              isDisabled ={mode==='edit'}
              defaultValue={tempObject.status}
            >
              {({ fieldProps }) => (
                <Fragment>
                  <Select {...fieldProps} options={statusOptions} />
                </Fragment>
              )}
            </Field>            
            <Field
              label="On Approval Transition"
              name="onApprove"
              isRequired
              validate={async (value) => {
                if (value) {
                  onSetTempValue(value,"onApprove");
                }}}
              isDisabled ={mode==='edit'}
              defaultValue={tempObject.onApprove}
            >
              {({ fieldProps }) => (
                <Fragment>
                  <Select {...fieldProps} options={stateTransitions} />
                </Fragment>
              )}
            </Field>
            <Field
              label="On Reject Transition"
              name="onReject"
              isRequired
              validate={async (value) => {
                if (value) {
                  onSetTempValue(value,"onReject");
                }}}
              isDisabled ={mode==='edit'}
              defaultValue={tempObject.onReject}
            >
              {({ fieldProps }) => (
                <Fragment>
                  <Select {...fieldProps} options={stateTransitions} />
                </Fragment>
              )}
            </Field>
            <Field
              label="Category"
              name="approvalcategory"
              isDisabled ={mode==='edit'}
              isRequired
              validate={async (value) => {
                if (value) {
                  onSetTempValue(value,"approvalcategory");
                }}}
              defaultValue={tempObject.approvalcategory}
            >
              {({ fieldProps }) => (
                <Fragment>
                  <Select {...fieldProps} options={categoryOptions} />
                </Fragment>
              )}
            </Field>
            <Field
              label="Approval Role"
              name="approvalrole"
              isDisabled ={approvalRoleEdit===true}
              validate={async (value) => {
                if (value) {
                  onSetTempValue(value,"approvalrole");
                  //call comment event handler to validate the fields 
                      if(tempObject.approverExist===true){
                        return "already exist"
                      }
                      else{
                        return undefined
                      }

    
                  
                  if(tempObject.issuetype!='' && tempObject.approvalcategory!=''){
                    //do logic to get values match with issuetype and category
                  }
                  
                }

              }}
              isRequired
              defaultValue={tempObject.approvalrole}
            >
              {({ fieldProps, error }) => (
                <Fragment>
                  <Textfield
                  validationState={error ? 'error' : 'default'}
                    {...fieldProps}
                    data-testid="nativeFormValidationTest"
                   
                    
                  />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </Fragment>
              )}
            </Field>
            {/* <Field
              label="Approval Role"
              name="approvalrole"
               
              isRequired
              defaultValue={tempObject.approvalrole}
            >
              {({ fieldProps }) => (
                <Fragment>
                  <Textfield
                    {...fieldProps}
                    data-testid="nativeFormValidationTest"
                    
                  />
                  
                </Fragment>
              )}
            </Field> */}
            <Field
              label="Approver(s)"
              name="approvers"
              isRequired
              defaultValue={tempObject.approvers}
              
              validate={async (value) => {
                if (value) {
                  // below code is used to validate the approvers add/remove, maintaining it for future refernce
                  onSetTempValue(value,"approvers");
                  // console.log(tempObject.removeApprovers);
                  // if(tempObject.removeApprovers===true){
                  //   console.log("true")
                  //   return "You will not be able to remove the user since associated with issue(s)."
                  // }
                  // else{
                  //   console.log("false")
                  //   return undefined
                  // }
                }}}
            >
              
              {({ fieldProps,error }) => (
                <Fragment>
                  <Select
                    {...fieldProps}
                    inputId={"users"}
                    validationState={error ? 'error' : 'default'}
                    options={users}
                    isMulti
                  />
                   {error && <ErrorMessage>{error}</ErrorMessage>}
                </Fragment>
              )}
               
            </Field>

            <FormFooter>
              <ButtonGroup>
                <Button 
                  appearance="default"
                  onClick={() => onSetAddApprovalWorkflowOpen(false)}
                >
                  Cancel
                </Button>
                {mode==='add'?<Button isDisabled={updateEnable===true || tempObject.approvers.length===0}  type="submit" appearance="primary">
                  Create
                </Button>:<Button isDisabled ={updateEnable===true || tempObject.approvers.length===0} type="submit" appearance="primary">
                  Save
                </Button>}
                
              </ButtonGroup>
            </FormFooter>
          </form>
        )}
      </Form>

    </DialogContent>
   
  </Dialog>)
}
export default WorkflowDialog;
