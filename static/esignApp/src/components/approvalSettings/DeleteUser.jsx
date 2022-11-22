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
import { invoke } from "@forge/bridge";
import async from "react-select/async";
function DeleteUser(props){
    const {userDetails,isComment,inValidUserMessage,onHideDialog,refreshList } = props;
    const [enableButton, setEnableButton] = React.useState(false);
    const [tempUser, setTempUser] = React.useState('');
    const[isPasswordMatched,setIsPasswordMatched]=React.useState('');
    const useStyles = makeStyles({
        topScrollPaper: {
          alignItems: "flex-start",
        },
        topPaperScrollBody: {
          verticalAlign: "top",
        },
      });
    const classes = useStyles();
   async function deletePassword(){
        const userList = await invoke("getUserList")
        userList.splice(userList.findIndex(({ username }) => username === userDetails.username), 1);      
      await invoke("setUserList",userList);
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
      open={isComment}
      backdrop="static"
      onClose={() => {onHideDialog(false),setEnableButton(false),setIsPasswordMatched(""),setResultMessage('');
    }}
    >
      <DialogTitle>
      Delete User
        <div style={{ float: "right" }}>
          <span
            style={{ fontSize: "12px", cursor: "pointer" }}
            onClick={() =>{ onHideDialog(false);setEnableButton(false)}}
          >
            X
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        {/* <a href="https://id.atlassian.com/login" target="iframe_a">Okta</a>   */}
        <br />
        <Form onSubmit={(formData) => deletePassword(formData)} >
          {({ formProps }) => (
            <form {...formProps} name="native-validation-example">

            
     Do you want to delete the user {userDetails.username} ?
                       
              <FormFooter>
                <ButtonGroup>
                  <Button
                    appearance="default"
                    onClick={() => {onHideDialog(false);setEnableButton(false)}}
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
