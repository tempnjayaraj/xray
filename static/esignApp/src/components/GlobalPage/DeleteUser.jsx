import React from "react";
import Button from "@atlaskit/button";
import ButtonGroup from "@atlaskit/button/button-group";
import {
  DialogContent,
  Dialog,
  DialogTitle,
  makeStyles,
} from "@material-ui/core";
import Form, { FormFooter } from "@atlaskit/form";
import { invoke } from "@forge/bridge";
function DeleteUser(props) {
  const { userDetails, isDeleteUser, onHideDialog, refreshList } = props;
  const [enableButton, setEnableButton] = React.useState(false);
  const [tempUser, setTempUser] = React.useState("");
  const [isPasswordMatched, setIsPasswordMatched] = React.useState("");
  const useStyles = makeStyles({
    topScrollPaper: {
      alignItems: "flex-start",
    },
    topPaperScrollBody: {
      verticalAlign: "top",
    },
  });
  const classes = useStyles();
  async function deletePassword() {
    const userList = await invoke("getUserList");
    //     userList.splice(userList.findIndex(({ username }) => username === userDetails.username), 1);
    const indexOfObject = userList.findIndex((object) => {
      return object.username === userDetails.username;
    });
    userList.splice(indexOfObject, 1);
    await invoke("setUserList", userList);
    refreshList();
    onHideDialog(false);
  }
  return (
    <Dialog
      scroll="paper"
      classes={{
        scrollPaper: classes.topScrollPaper,
        paperScrollBody: classes.topPaperScrollBody,
      }}
      open={isDeleteUser}
      backdrop="static"
      onClose={() => {
        onHideDialog(false);
      }}
    >
      <DialogTitle>
        Delete User
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
        <br />
        <Form onSubmit={(formData) => deletePassword(formData)}>
          {({ formProps }) => (
            <form {...formProps} name="native-validation-example">
              Do you want to delete the user {userDetails.username} ?
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
                  <Button type="submit" appearance="primary">
                    Delete
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
export default DeleteUser;
