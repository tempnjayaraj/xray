import React, { Fragment } from "react";
import Button from "@atlaskit/button";
import ButtonGroup from "@atlaskit/button/button-group";
import TextField from "@atlaskit/textfield";

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
    loggedUser,
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
  const [strength, setStrength] = React.useState("");
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

  var strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  var mediumRegex = new RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
  );
  function checkPassword(value) {
    if (strongRegex.test(value)) {
      console.log("green");
      setStrength("strong");
    } else if (mediumRegex.test(value)) {
      console.log("orange");
      setStrength("medium");
    } else {
      setStrength("week");
      console.log("red");
    }
  }
  function formatAMPM(date) {
    var dat = date.getDate();
    var mon = date.toLocaleString("default", { month: "short" });
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime =
      dat + "-" + mon + "-" + year + " " + hours + ":" + minutes + " " + ampm;
    return strTime;
  }
  async function resetPassword(formData) {
    setResultMessage("");
    setIsPasswordMatched("");
    if (userDetails.secretValue != formData.secretValue) {
      setIsPasswordMatched("Password Incorrect");
      return;
    }
    if (strength == "week" || strength == "medium") {
      setIsPasswordMatched("Your Password strength is weak");
      return;
    }
    if (formData.confirmpassword != formData.newpassword) {
      setIsPasswordMatched("Password mismatched");
      return;
    }
    const userList = await invoke("getUserList");
    const indexOfObject = userList.findIndex((object) => {
      return object.username === userDetails.username;
    });
    userList[indexOfObject].secretValue = formData.newpassword;
    userList[indexOfObject].updated_by = loggedUser.displayName;
    var currentdate = new Date();
    var datetime = formatAMPM(currentdate);
    userList[indexOfObject].updated_on = datetime;
    await invoke("setUserList", userList);
    onHideDialog(false);
    refreshList();
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
                validate={checkPassword}
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
