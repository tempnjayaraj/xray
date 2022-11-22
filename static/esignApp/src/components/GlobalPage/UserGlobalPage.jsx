import React, { useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Button from "@atlaskit/button";
import { Edit, Delete } from "@material-ui/icons";
import AddUser from "./AddUser";
import InfoDialog from "./InfoDialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import { invoke } from "@forge/bridge";
import ResetPassword from "./ResetPassword";
import DeleteUser from "./DeleteUser";
import Avatar, { AvatarItem } from "@atlaskit/avatar";

import noop from "@atlaskit/ds-lib/noop";
import InfoIcon from "@atlaskit/icon/glyph/info";
import { N500 } from "@atlaskit/theme/colors";
import { token } from "@atlaskit/tokens";
import Flag from "@atlaskit/flag";

function UserGlobalPage() {
  const [userList, setUserList] = React.useState([]);
  const [isresetPassword, setIsresetPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [userDetails, setUserDetails] = React.useState({});
  const [isDeleteUser, setIsDeleteUser] = React.useState(false);
  const [isComment, setIsComment] = React.useState(false);
  const [isInfoDialog, setIsInfoDialog] = React.useState(false);
  const [deleteData, setDeleteData] = React.useState("");
  const [loggedUser, setLoggedUser] = React.useState("");
  const [infoTitle, setInfoTitle] = React.useState("");
  const [createPasswordButton, setCreatePasswordButton] = React.useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const users = await invoke("getUserList");
      setUserList(users);
      await invoke("getLoggedUserDetails", {}).then((returnedData) => {
        setLoggedUser(returnedData);
        console.log(returnedData);
        let index = users.findIndex((object) => {
          return object.username === returnedData.displayName;
        });
        if (index == -1) {
          setCreatePasswordButton(false);
        } else {
          setUserDetails(users[index]);
          setCreatePasswordButton(true);
        }
        setLoading(false);
      });
    })();
    return () => {};
  }, []);

  const [inValidUserMessage, setInValidUserMessage] = React.useState("");
  const hideDialog = (esign) => {
    setIsresetPassword(false);
    setIsDeleteUser(false);
    setIsComment(false);
  };
  function addUser() {
    setInValidUserMessage("");
    setIsComment(true);
  }

  async function refreshList() {
    const newusers = await invoke("getUserList");
    console.log(newusers);
    setUserList(newusers);
  }

  function resetPassword() {
    setIsresetPassword(true);
  }
  function deleteUser(user) {
    setUserDetails(user);
    setIsDeleteUser(true);
  }
  return (
    <div>
      <Flag
        appearance="info"
        icon={
          <InfoIcon
            label="Info"
            secondaryColor={token("color.background.neutral.bold", N500)}
          />
        }
        id="info"
        key="info"
        title="Your esign Password has been expired"
        description="Reset your password using strong password requirements."
        actions={[
          { content: "Reset Password", onClick: resetPassword },
          { content: "Close", onClick: noop },
        ]}
      />
      <hr />
      <Button
        className="pull-right"
        style={{ margin: "15px" }}
        appearance="primary"
        isDisabled={createPasswordButton === true}
        onClick={addUser}
      >
        Create Password
      </Button>
      <hr />
      {!loading &&
        (userList == undefined ||
          !userList ||
          (userList.length == 0 && (
            <h5 style={{ width: "150px", margin: "auto" }}>
              No Data to display
            </h5>
          )))}
      {loading && (
        <CircularProgress
          size={40}
          left={-20}
          top={10}
          status={"loading"}
          style={{ marginLeft: "30%" }}
        />
      )}
      {userList.length > 0 && (
        <TableContainer
          component={Paper}
          style={{ width: "850px", margin: "auto" }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Updated On</TableCell>
                <TableCell>Updated By</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map((row) => (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.username}
                  </TableCell>

                  <TableCell component="th" scope="row">
                    {row.updated_on}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.updated_by}
                  </TableCell>

                  <TableCell>
                    {row.username == loggedUser.displayName && (
                      <Button
                        className="pull-right"
                        onClick={() => resetPassword()}
                      >
                        Change Password
                      </Button>
                    )}

                    {/* {
                      <IconButton
                        onClick={() => deleteUser(row.username)}
                        style={{ marginLeft: -10 }}
                      >
                        <Delete fontSize="small" style={{ color: "red" }} />
                      </IconButton>
                    } */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <br />
      {!loading && isresetPassword && (
        <ResetPassword
          loggedUser={loggedUser}
          userDetails={userDetails}
          isresetPassword={isresetPassword}
          inValidUserMessage={inValidUserMessage}
          onHideDialog={hideDialog}
          refreshList={refreshList}
        />
      )}
      <br />
      {!loading && isDeleteUser && (
        <DeleteUser
          userDetails={userDetails}
          isDeleteUser={isDeleteUser}
          inValidUserMessage={inValidUserMessage}
          onHideDialog={hideDialog}
          refreshList={refreshList}
        />
      )}
      <InfoDialog
        onDeleteCategoryOpen={setIsInfoDialog}
        isInfoDialog={isInfoDialog}
        data={deleteData}
        infoTitle={infoTitle}
      />
      {isComment && (
        <AddUser
          isComment={isComment}
          setIsInfoDialog={setIsInfoDialog}
          setDeleteData={setDeleteData}
          setInfoTitle={setInfoTitle}
          onHideDialog={hideDialog}
          inValidUserMessage={inValidUserMessage}
          refreshList={refreshList}
        />
      )}
    </div>
  );
}

export default UserGlobalPage;
