import React, { useCallback, useState, Fragment, useEffect } from "react";
import Button from "@atlaskit/button";
import ButtonGroup from "@atlaskit/button/button-group";
import Select from "@atlaskit/select";
import Textfield from "@atlaskit/textfield";
import LoadingButton from "@atlaskit/button/loading-button";
import { Checkbox } from "@atlaskit/checkbox";
import TextField from "@atlaskit/textfield";
import {
  DialogContent,
  Dialog,
  DialogTitle,
  makeStyles,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Form, {
  CheckboxField,
  ErrorMessage,
  Field,
  FormFooter,
  FormHeader,
  FormSection,
  HelperMessage,
  ValidMessage,
} from "@atlaskit/form";
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from "@atlaskit/modal-dialog";
import * as MyConstClass from "../../constants/configureContants";

function EsignDialog(props) {
  const [fullWidth, setfullWidth] = React.useState(true);
  const [maxWidth, setmaxWidth] = React.useState("xl");
  const [loading, setLoading] = React.useState(false);
 // const [isSignout, setIsSignout] = React.useState(false);

  const {
    isEsign,
    onHideDialog,
    action,
    isSignout,
    onSignOut,
    reasonOptions,
    onPutApproval,
    tempReason,
    onSettempReason,
    onLoad,
  } = props;

  const styles = {
    dialogPaper: {
      height: "100%",
      width: "100%",
      position: "absolute",
      left: 10,
      top: 50,
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

  const clearCookie = () => {
    setLoading(true);
    document.cookie =
      "username=; expires=Thu, 01 Jan 2022 00:00:00 UTC; path=/;";
    onHideDialog(false);
    setLoading(false);
  };
  const submitEsign = (formData,tempReason) => {
    setLoading(true);
    onPutApproval(formData, tempReason)
   
  };
  useEffect(() => {
    document.cookie =
      "username=; expires=Thu, 01 Jan 2022 00:00:00 UTC; path=/;";
  }, []);
  const classes = useStyles();

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      scroll="paper"
      classes={{
        scrollPaper: classes.topScrollPaper,
        paperScrollBody: classes.topPaperScrollBody,
      }}
      open={isEsign}
      backdrop="static"
      onClose={() => clearCookie()}
    >
      <DialogTitle>
        {action}
        <div style={{ float: "right" }}>
          <span
            style={{ fontSize: "12px", cursor: "pointer" }}
            onClick={() => clearCookie()}
          >
            X
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        {MyConstClass.IS_SAML && (
          <div
            class="container"
            style={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              paddingTop: "56.25%",
            }}
          >
            {loading && (
              <CircularProgress
                size={40}
                left={-20}
                top={10}
                status={"loading"}
                style={{ marginLeft: "50%" }}
              />
            )}
            {!loading && MyConstClass.IS_SAML && (
              <iframe 
                src={MyConstClass.SAML_URL_LOGOUT}
                onLoad={() => onLoad()}
                id="frame_id"
                name="iframe_a"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
              ></iframe>
            )}
            {isSignout && MyConstClass.IS_SAML && (
              <iframe class="signoutLoader"
                src={MyConstClass.SAML_SIGNOUT_URL}
                onLoad={() => onSignOut()}
                id="frame_id"
                name="iframe_a"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
              ></iframe>
            )}
          </div>
        )}

        {/* <a href="https://id.atlassian.com/login" target="iframe_a">Okta</a>   */}

        {!MyConstClass.IS_SAML && loading && (
              <CircularProgress
                size={40}
                left={-20}
                top={10}
                status={"loading"}
                style={{ marginLeft: "50%" }}
              />
            )}
        {!MyConstClass.IS_SAML && !loading && (
          <Form onSubmit={(formData) => submitEsign(formData, tempReason)}>
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
            </Field>  */}
                <Field
                  label="Reasons"
                  name="reason"
                  isRequired={action === "Reject"}
                  validate={async (value) => {
                    if (value) {
                      onSettempReason(value.value);
                    }
                  }}
                  defaultValue=""
                >
                  {({ fieldProps }) => (
                    <Fragment>
                      <Select {...fieldProps} options={reasonOptions} />
                    </Fragment>
                  )}
                </Field>

                <Field label="Comments" name="comments" defaultValue="">
                  {({ fieldProps }) => (
                    <Fragment>
                      <Textfield
                        {...fieldProps}
                        data-testid="nativeFormValidationTest"
                      />
                    </Fragment>
                  )}
                </Field>

                <FormFooter>
                  <ButtonGroup>
                    {/* <Button   type="submit" >
                  Reset
                </Button> */}
                    <Button type="submit" appearance="primary">
                      Submit
                    </Button>
                  </ButtonGroup>
                </FormFooter>
              </form>
            )}
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
export default EsignDialog;
