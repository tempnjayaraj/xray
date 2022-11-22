import React, { useCallback, useState, Fragment, useEffect } from "react";
import Button from "@atlaskit/button";
import ButtonGroup from "@atlaskit/button/button-group";
import Textfield from "@atlaskit/textfield";
import { Checkbox } from "@atlaskit/checkbox";
import TextField from "@atlaskit/textfield";
import {
  DialogContent,
  Dialog,
  DialogTitle,
  makeStyles,
} from "@material-ui/core";
import Form, { Field, FormFooter } from "@atlaskit/form";

function ReasonDialog(props) {
  const {
    isComment,
    onHideDialog,
    action,
    onPutComment,
    loggedUser,
    inValidUserMessage,
    actionWorkflow,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const [enableButton, setEnableButton] = React.useState(false);
  const [tempUser, setTempUser] = React.useState("");
  const [roleValue, setRoleValue] = React.useState([]);

  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    (async () => {
      console.log(actionWorkflow);
      let tempOptions = [];
      if (action === "Approve") {
        tempOptions.push({
          label:
            "As a " +
            actionWorkflow["approver_group"] +
            " - I Approve this record",
          value:
            "As a " +
            actionWorkflow["approver_group"] +
            " - I Approve this record",
        });
      } else {
        tempOptions.push({
          label:
            "As a " +
            actionWorkflow["approver_group"] +
            " - I reject this record",
          value:
            "As a " +
            actionWorkflow["approver_group"] +
            " - I reject this record",
        });
      }
      setRoleValue(tempOptions);
    })();
    return () => {};
  }, []);
  const submitEsign = (formData) => {
    setLoading(true);
    onPutComment(formData);
  };
  const clearCookie = () => {
    setLoading(true);
    document.cookie =
      "username=; expires=Thu, 01 Jan 2022 00:00:00 UTC; path=/;";
    onHideDialog(false);
    setLoading(false);
  };

  const styles = {
    dialogPaper: {
      minHeight: "80vh",
      maxHeight: "80vh",
    },
  };

  const useStyles = makeStyles({
    topScrollPaper: {
      alignItems: "flex-start",
    },
    topPaperScrollBody: {
      verticalAlign: "top",
    },
  });

  function validate(value) {
    setTempUser(value);
  }
  function changeCheckbox() {
    if (enableButton) setEnableButton(false);
    else setEnableButton(true);
  }
  const classes = useStyles();
  return (
    <Dialog
      scroll="paper"
      classes={{
        scrollPaper: classes.topScrollPaper,
        paperScrollBody: classes.topPaperScrollBody,
      }}
      open={isComment}
      backdrop="static"
      onClose={() => {
        onHideDialog(false), setEnableButton(false), clearCookie();
      }}
    >
      <DialogTitle>
        {action}
        <div style={{ float: "right" }}>
          <span
            style={{ fontSize: "12px", cursor: "pointer" }}
            onClick={() => {
              onHideDialog(false);
              setEnableButton(false);
            }}
          >
            X
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        {/* <a href="https://id.atlassian.com/login" target="iframe_a">Okta</a>   */}
        <Form onSubmit={(formData) => submitEsign(formData)}>
          {({ formProps }) => (
            <form {...formProps} name="native-validation-example">
              {/* <Field
              aria-required={true}
              name="username"
              label="Username"
              isRequired
              defaultValue=""
            >
              {({ fieldProps, error }) => (
                <Fragment>
                  <TextField autoComplete="off" {...fieldProps} />
                 
                  {error && (
                    <ErrorMessage>
                      This username is already in use, try another one.
                    </ErrorMessage>
                  )}
                </Fragment>
              )}
            </Field>
            <Field
              aria-required={true}
              name="password"
              label="Password"
              defaultValue=""
              isRequired
             
            >
              {({ fieldProps, error, valid, meta }) => {
                return (
                  <Fragment>
                    <TextField type="password" {...fieldProps} />
                    {error && !valid && (
                      <HelperMessage>
                        Use 8 or more characters with a mix of letters, numbers
                        and symbols.
                      </HelperMessage>
                    )}
                    {error && (
                      <ErrorMessage>
                        Password needs to be more than 8 characters.
                      </ErrorMessage>
                    )}
                    {valid && meta.dirty ? (
                      <ValidMessage>Awesome password!</ValidMessage>
                    ) : null}
                  </Fragment>
                );
              }}
            </Field>
            <Field
              label="Approval Group"
              name="approvalgroup"
              
              isRequired
             
              defaultValue=""
            >
              {({ fieldProps }) => (
                <Fragment>
                  <Select {...fieldProps}  />
                </Fragment>
              )}
            </Field> */}

              <Field
                aria-required={true}
                name="username"
                label="Username"
                isRequired
                validate={validate}
                defaultValue=""
              >
                {({ fieldProps, error }) => (
                  <Fragment>
                    <TextField autoComplete="off" {...fieldProps} />
                    <span style={{ fontSize: "12px", color: "red" }}>
                      {inValidUserMessage}
                    </span>
                  </Fragment>
                )}
              </Field>
              <Field
                aria-required={true}
                name="password"
                label="Password"
                id="loginPassword"
                isRequired
                defaultValue=""
              >
                {({ fieldProps, error }) => (
                  <Fragment>
                    <TextField autoComplete="off" {...fieldProps} />
                    <span style={{ fontSize: "12px", color: "pointer" }}></span>
                  </Fragment>
                )}
              </Field>
              <Field
                label="Please add comment if any"
                name="comments"
                defaultValue=""
                isRequired={action === "Reject"}
              >
                {({ fieldProps }) => (
                  <Fragment>
                    <Textfield
                      {...fieldProps}
                      data-testid="nativeFormValidationTest"
                    />
                  </Fragment>
                )}
              </Field>

              <Checkbox
                name="comments"
                onChange={changeCheckbox}
                label={roleValue[0].label}
              />

              <FormFooter>
                <ButtonGroup>
                  <Button
                    appearance="default"
                    onClick={() => {
                      onHideDialog(false);
                      setEnableButton(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    appearance="primary"
                    isDisabled={enableButton === false || tempUser === ""}
                  >
                    Submit
                  </Button>
                </ButtonGroup>
              </FormFooter>
            </form>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
export default ReasonDialog;
