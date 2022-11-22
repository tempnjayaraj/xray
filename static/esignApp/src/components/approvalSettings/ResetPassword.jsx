import React, { Fragment } from "react";
import Button from "@atlaskit/button";
import ButtonGroup from "@atlaskit/button/button-group";
import TextField from "@atlaskit/textfield";
import CircularProgress from "@material-ui/core/CircularProgress";

import {
  DialogContent,
  Dialog,
  DialogTitle,
  makeStyles,
} from "@material-ui/core";
import Form, { Field, FormFooter } from "@atlaskit/form";
import { invoke } from "@forge/bridge";
function ResetPassword(props) {
  const {
    userDetails,
    isresetPassword,
    inValidUserMessage,
    onHideDialog,
    refreshList,
  } = props;
  const [enableButton, setEnableButton] = React.useState(false);
  const [tempUser, setTempUser] = React.useState("");
  const [isPasswordMatched, setIsPasswordMatched] = React.useState("");
  const [resultMessage, setResultMessage] = React.useState("");
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
  async function resetPassword(formData) {
    setResultMessage("");
    setIsPasswordMatched("");
    const users = await invoke("getUserList");
    console.log(users);
    const tempUsers = users.filter(checkUser);
    function checkUser(user) {
      if (user.username == userDetails.username) {
        if (user.secretValue != formData.secretValue) {
          setIsPasswordMatched("Password Incorrect");
          return;
        }
      }
    }

    if (formData.confirmpassword != formData.newpassword) {
      setIsPasswordMatched("Password mismatched");
      return;
    } else {
      let index = users.findIndex(
        ({ username }) => username === userDetails.username
      );
      users[index].secretValue = formData.newpassword;
      await invoke("setUserList", users);
      onHideDialog(false);
      refreshList();
    }
  }
  const classes = useStyles();
  return (
    <Dialog
      scroll="paper"
      classes={{
        scrollPaper: classes.topScrollPaper,
        paperScrollBody: classes.topPaperScrollBody,
      }}
      open={isresetPassword}
      backdrop="static"
      onClose={() => {
        onHideDialog(false),
          setEnableButton(false),
          setIsPasswordMatched(""),
          setResultMessage("");
      }}
    >
      <DialogTitle>
        Change Password
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
        <Form onSubmit={(formData) => resetPassword(formData)}>
          {({ formProps }) => (
            <form {...formProps} name="native-validation-example">
              <Field
                aria-required={true}
                name="username"
                label="User display name"
                isDisabled
                validate={validate}
                defaultValue={userDetails.username}
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
                name="secretValue"
                label="Old Password"
                id="loginPassword"
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
                name="newpassword"
                label="New Password"
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
                aria-required={true}
                name="confirmpassword"
                label="Confirm Password"
                id="loginPassword"
                isRequired
                defaultValue=""
              >
                {({ fieldProps, error }) => (
                  <Fragment>
                    <TextField autoComplete="off" {...fieldProps} />
                    <span style={{ fontSize: "12px", color: "red" }}>
                      {isPasswordMatched}
                    </span>
                  </Fragment>
                )}
              </Field>
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
                    isDisabled={tempUser === ""}
                  >
                    Change Password
                  </Button>
                </ButtonGroup>
              </FormFooter>
            </form>
          )}
        </Form>
        <h4> Tips for setting strong passwords</h4>
        <ul>
          <li>
            Avoid patterns. Consecutive letters (either alphabetical or on the
            keyboard) and numbers
          </li>

          <li>
            {" "}
            Avoid replacing letters with similar numbers or symbols (example 3
            for e or $ for s){" "}
          </li>

          <li>
            Avoid short passwords. Using a single word and a single number is
            easy for an attacker to break{" "}
          </li>

          <li>Use a password manager to generate long/random passwords </li>

          <li>
            Use lots of 'parts' to your password, making it hard to crack and
            easier to remember. Four unrelated words make a strong password
            (correcthorsebatterystaple), so does making a combination of words
            and random numbers (tape934elephant%*Pass)
          </li>
        </ul>{" "}
      </DialogContent>
    </Dialog>
  );
}
export default ResetPassword;
