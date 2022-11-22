import React, { useContext, useRef, useEffect, Fragment } from "react";
import { DialogContent, Dialog, DialogTitle } from "@material-ui/core";
import { invoke, requestJira } from "@forge/bridge";
import Button from "@atlaskit/button";
import ButtonGroup from "@atlaskit/button/button-group";
import Select from "@atlaskit/select";
import Textfield from "@atlaskit/textfield";
import Form, { Field, FormFooter, ErrorMessage } from "@atlaskit/form";
import { withStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

function SmartWorkflowDialog(props) {
  const styles = {
    customMaxWidth: {
      maxWidth: "none", // arbitrary value
    },
  };

  const {
    onSetAddApprovalWorkflowOpen,
    onSetAddApprovalWorkflowButtonOpen,
    approvalWorkflowMetaData,
    addApprovalworkflowbutton,
    onPutApprovalWorkflows,
    approvalworkflow,
    approvalWorkflowData,
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
    stateTransitions,
  } = props;
 
  return (
    <Dialog
      classes={{ paperScrollPaper: styles.customMaxWidth }}
      onClose={() => onSetAddApprovalWorkflowButtonOpen(false)}
      open={addApprovalworkflowbutton}
      backdrop="static"
      onBackdropClick="false"
    >
      <DialogTitle>Approval Workflow</DialogTitle>

      <DialogContent>
        <Form onSubmit={(formData) => onPutApprovalWorkflows(formData)}>
          {({ formProps }) => (
            <form {...formProps} name="native-validation-example">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  margin: 0,
                }}
              >
                <h5 style={{ color: "#6B778C", margin: 0 }}>
                  IssueType :{" "}
                  <span
                    style={{
                      color: "black",
                      fontWeight: "lighter",
                      padding: 5,
                    }}
                  >
                    {" "}
                    {tempObject &&
                      tempObject.issuetype &&
                      tempObject.issuetype.value}
                  </span>
                </h5>
                <h5 style={{ color: "#6B778C", paddingLeft: 15, margin: 0 }}>
                  Status :
                  <span
                    style={{
                      color: "black",
                      fontWeight: "lighter",
                      paddingLeft: 5,
                    }}
                  >
                    {" "}
                    {tempObject && tempObject.status && tempObject.status.value}
                  </span>
                </h5>
                <h5 style={{ color: "#6B778C", paddingLeft: 15, margin: 0 }}>
                  Category :{" "}
                  <span
                    style={{
                      color: "black",
                      fontWeight: "lighter",
                      paddingLeft: 5,
                    }}
                  >
                    {" "}
                    {tempObject &&
                      tempObject.approvalcategory &&
                      tempObject.approvalcategory.value}
                  </span>
                </h5>

                <h5 style={{ color: "#6B778C", marginTop: 10 }}>
                  OnApprovalTransition :{" "}
                  <span
                    style={{
                      color: "black",
                      fontWeight: "lighter",
                      paddingLeft: 5,
                    }}
                  >
                    {tempObject &&
                      tempObject.onApprove &&
                      tempObject.onApprove.value}
                  </span>
                </h5>
                <h5
                  style={{ color: "#6B778C", marginTop: 10, paddingLeft: 15 }}
                >
                  OnRejectTransition :{" "}
                  <span
                    style={{
                      color: "black",
                      fontWeight: "lighter",
                      paddingLeft: 5,
                    }}
                  >
                    {" "}
                    {tempObject &&
                      tempObject.onReject &&
                      tempObject.onReject.value}
                  </span>
                </h5>
              </div>
              <Field
                label="Approval Role"
                name="approvalrole"
                // isDisabled={approvalRoleEdit === true}
                validate={async (value) => {
                  if (value) {
                    onSetTempValue(value, "approvalrole", "addrole");
                    //call comment event handler to validate the fields
                    if (tempObject.approverExist === true) {
                      return "already exist";
                    } else {
                      return undefined;
                    }

                    if (
                      tempObject.issuetype != "" &&
                      tempObject.approvalcategory != ""
                    ) {
                      //do logic to get values match with issuetype and category
                    }
                  }
                }
              }
                isRequired
                defaultValue={tempObject.approvalrole}
              >
                {({ fieldProps, error }) => (
                  <Fragment>
                    <Textfield
                      validationState={error ? "error" : "default"}
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
                    onSetTempValue(value, "approvers");
                    // console.log(tempObject.removeApprovers);
                    // if(tempObject.removeApprovers===true){
                    //   console.log("true")
                    //   return "You will not be able to remove the user since associated with issue(s)."
                    // }
                    // else{
                    //   console.log("false")
                    //   return undefined
                    // }
                  }
                }}
              >
                {({ fieldProps, error }) => (
                  <Fragment>
                    <Select
                      {...fieldProps}
                      inputId={"users"}
                      validationState={error ? "error" : "default"}
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
                    onClick={() => onSetAddApprovalWorkflowButtonOpen(false)}
                  >
                    Cancel
                  </Button>
                  {mode === "add" ? (
                    <Button
                      isDisabled={
                        updateEnable === true ||
                        tempObject.approvers.length === 0
                      }
                      type="submit"
                      appearance="primary"
                    >
                      Create
                    </Button>
                  ) : (
                    <Button
                      isDisabled={
                        updateEnable === true ||
                        tempObject.approvers.length === 0
                      }
                      type="submit"
                      appearance="primary"
                    >
                      Save
                    </Button>
                  )}
                </ButtonGroup>
              </FormFooter>
            </form>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
export default SmartWorkflowDialog;
