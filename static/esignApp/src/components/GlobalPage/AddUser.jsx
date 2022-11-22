import React, { Fragment, useEffect } from "react";
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

function AddUser(props) {
  const {
    onHideDialog,
    inValidUserMessage,
    isComment,
    setIsInfoDialog,
    setDeleteData,
    setInfoTitle,
    refreshList,
  } = props;
  const [enableButton, setEnableButton] = React.useState(false);
  const [tempUser, setTempUser] = React.useState("");
  const [isPasswordMatched, setIsPasswordMatched] = React.useState("");
  const [resultMessage, setResultMessage] = React.useState("");
  const [strength, setStrength] = React.useState("");
  const [loggedUser, setLoggedUser] = React.useState("");
  useEffect(() => {
    (async () => {
      await invoke("getLoggedUserDetails", {}).then((returnedData) => {
        setLoggedUser(returnedData);
        console.log(returnedData);
      });
    })();
    return () => {};
  }, []);
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
  async function addNewUser(formData) {
    setResultMessage("");
    setIsPasswordMatched("");
    const users = await invoke("getUserSearch", "");
    console.log(users);
    const tempUsers = users.filter(checkUser);
    function checkUser(user) {
      return user.name == formData.username;
    }
    if (tempUsers.length == 0) {
      setIsPasswordMatched("Username not exist");
      return;
    } else if (strength == "week" || strength == "medium") {
      setIsPasswordMatched("Your Password strength is weak");
      return;
    } else if (formData.confirmpassword != formData.password) {
      setIsPasswordMatched("Password mismatched");
      return;
    }
    formData.updated_by = loggedUser.displayName;
    const result = await invoke("addUserInStorage", formData);
    if (result.success) {
      setResultMessage(result.displayMessage);
      setDeleteData("User added successfully to eSign");
      setInfoTitle("Result");
      setIsInfoDialog(true);
      onHideDialog(false);
      refreshList();
    } else {
      setIsPasswordMatched(result.displayMessage);
      return;
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
      open={isComment}
      backdrop="static"
      onClose={() => {
        onHideDialog(false),
          setEnableButton(false),
          setIsPasswordMatched(""),
          setResultMessage("");
      }}
    >
      <DialogTitle>
        Create Password
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
        <Form onSubmit={(formData) => addNewUser(formData)}>
          {({ formProps }) => (
            <form {...formProps} name="native-validation-example">
              <Field
                aria-required={true}
                name="username"
                label="User display name"
                isDisabled
                validate={validate}
                defaultValue={loggedUser.displayName}
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
                validate={checkPassword}
                defaultValue=""
              >
                {({ fieldProps, error }) => (
                  <Fragment>
                    <TextField
                      autoComplete="off"
                      {...fieldProps}
                      className={
                        strength == "strong"
                          ? "strong-pwd"
                          : strength == "medium"
                          ? "medium-pwd"
                          : "week-pwd"
                      }
                    />
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
              <div
                className="text-center"
                style={{ fontSize: "14px", color: "Green" }}
              >
                {setResultMessage}
              </div>
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
                    Create Password
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
        </ul>
      </DialogContent>
    </Dialog>
  );
}
export default AddUser;
