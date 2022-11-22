import React, { useCallback, useState, Fragment, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import { Edit, Delete, ExpandLess, ExpandMore } from "@material-ui/icons";
import async from "react-select/async";
import { invoke } from "@forge/bridge";
import ResetPassword from "./ResetPassword";
import DeleteUser from "./DeleteUser";

import AvatarGroup from "@atlaskit/avatar-group";
import { UserGroup, User } from "@forge/ui";

export default function UsersList(props) {
  const { userList, getUserList } = props;
  const [isresetPassword, setIsresetPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [userDetails, setUserDetails] = React.useState({});
  const [isDeleteUser, setIsDeleteUser] = React.useState(false);
  const [isComment, setIsComment] = React.useState(false);

  const [inValidUserMessage, setInValidUserMessage] = React.useState("");
  const hideDialog = (esign) => {
    setIsresetPassword(false);

    setIsComment(false);
  };

  function refreshList() {
    getUserList();
  }

  function resetPassword(user) {
    setUserDetails(user);
    setIsresetPassword(true);
  }
  function deleteUser(user) {
    setUserDetails(user);
    setIsComment(true);
    setIsDeleteUser(true);
  }

  return (
    <div>
      {userList == undefined ||
        !userList ||
        (userList.length == 0 && <h5>No Data to display</h5>)}
      {userList.length > 0 && (
        <TableContainer
          component={Paper}
          style={{ width: "650px", margin: "auto" }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>

                <TableCell>Actions</TableCell>
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

                  <TableCell>
                    <IconButton onClick={() => resetPassword(row)}>
                      <Edit fontSize="small" color="primary" />
                    </IconButton>
                    <IconButton
                      onClick={() => deleteUser(row.username)}
                      style={{ marginLeft: -10 }}
                    >
                      <Delete fontSize="small" style={{ color: "red" }} />
                    </IconButton>
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
          isComment={isComment}
          inValidUserMessage={inValidUserMessage}
          onHideDialog={hideDialog}
          refreshList={refreshList}
        />
      )}
    </div>
  );
}
