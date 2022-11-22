import { invoke } from "@forge/bridge";
import React, { useState, useEffect, useCallback, Fragment } from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableContainer,
  Paper,
  IconButton,
  Collapse,
} from "@material-ui/core";
import Button from "@atlaskit/button";
import CircularProgress from "@material-ui/core/CircularProgress";
import EsignDialog from "./EsignDialog";
import { UserGroup, User } from "@forge/ui";
import AvatarGroup from "@atlaskit/avatar-group";
import async from "react-select/async";
import InfoDialog from "../approvalSettings/InfoDialog";
import ReasonDialog from "./ReasonDialog";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { router, view } from "@forge/bridge";

import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#99b2f7",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {},
  body: {
    fontSize: 14,
  },
}))(TableRow);

const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    backgroundColor: "#1890ff",
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      color: "#40a9ff",
      opacity: 1,
    },
    "&$selected": {
      color: "#1890ff",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "#40a9ff",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#635ee7",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#fff",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    "&:focus": {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  padding: {
    padding: theme.spacing(3),
  },
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
  demo2: {
    backgroundColor: "#2e1534",
  },
  tab: {
    backgroundColor: theme.palette.background.paper,
    
  },
}));

export default function ApprovalHistory(props) {
  // const [history, setHistory] = React.useState([{"cycle":1,"value":[{"id":1,"approver_group":"QA","actioned_by":["61efbf0c1c42100069457a15"],"status":"Rejected","requested_time":"11-May-2022   15:42","action_time":"11-May-2022   15:43","reason":"As an Approver - I Reject this record","comments":"not ok","actioned_by_display_name":"Chitra Sankar"},{"id":1,"approver_group":"Tester","actioned_by":["62600a129e7c190069e75bd1","557058:a52d5abe-62bd-4106-b55e-86616b595e10","61efbf0c1c42100069457a15"],"status":"No longer required","requested_time":"11-May-2022   15:42","action_time":"11-May-2022   15:42","reason":"NA","comments":"NA"}]}]);

  const { approvalHistory, onSetHistory, onExpandRow } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };


  return (
    <div>
      <IconButton
        color="primary"
        aria-label="Expand1"
        component="span"
        style={{ paddingBottom: 15, fontSize: 14, color: "black", fontWeight: 500 }}
      >
     Approval history
      </IconButton>
      {approvalHistory && approvalHistory.length > 0 ? (
        <div style={{ minHeight: 400 }}>
       <div className={classes.tab}>
      <AppBar position="static" color="white" >
        <Tabs
          value={value}
          onChange={handleChange}
          
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
           {approvalHistory &&
                  approvalHistory.length > 0 &&
                  approvalHistory.map((his,index) => (
                    <>
                    <Tab onClick={()=>{handleChangeIndex(index)}} label={his.status} {...a11yProps(index)} />
                    </>
                  ))}
         
         
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {approvalHistory &&
                  approvalHistory.length > 0 &&
                  approvalHistory.map((hist,ind) => (
                    <>
                    
                    <TabPanel value={value}  index={ind} dir={theme.direction}>
                    <TableContainer style={{ padding: 0, fontSize: 14, color: "black", fontWeight: 500 }}
                      component={Paper}
          >
           
            <Table aria-label="simple table" style={{ padding: 0 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell component={"th"} style={{ paddingLeft: 35 }}>
                    Group
                  </StyledTableCell>
                  <StyledTableCell component={"th"}>User </StyledTableCell>
                  <StyledTableCell component={"th"}>
                    Approval category{" "}
                  </StyledTableCell>
                  <StyledTableCell component={"th"}>
                    Requested Date
                  </StyledTableCell>
                  <StyledTableCell component={"th"}>
                    Action Date
                  </StyledTableCell>
                  <StyledTableCell component={"th"}>Status </StyledTableCell>
                  {/* <TableCell component={"th"}>Approve/Reject </TableCell> */}
                </TableRow>
              </TableHead>

              <TableBody style={{ border: 0 }}>
                {approvalHistory &&
                  approvalHistory.length > 0 &&
                  hist.history.map((his) => (
                    <>
                      <StyledTableRow key={"approvalcategory1"}>
                        <StyledTableCell style={{ padding: 5 }} colSpan={6}>
                          <IconButton
                            color="primary"
                            onClick={() => onExpandRow(his,hist.status)}
                            aria-label="Expand"
                            component="span"
                            style={{ padding: 0 }}
                          >
                            {his.show ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                          <b> Cycle - {his.cycle} </b>
                        </StyledTableCell>
                      </StyledTableRow>

                      {his.value &&
                        his.value.length > 0 &&
                        his.value.map((workflow) => (
                          <TableRow>
                            <TableCell
                              style={{
                                paddingBottom: 0,
                                paddingTop: 0,
                                borderBottom: 0,
                                width: "100%",
                              }}
                              colSpan={6}
                            >
                              <Collapse
                                in={his.show}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Table>
                                  <TableBody>
                                    <StyledTableRow>
                                      <StyledTableCell
                                        style={{ paddingLeft: 35 }}
                                        component={"td"}
                                      >
                                        {workflow.approver_group}
                                      </StyledTableCell>

                                      {workflow.status !=
                                      "No longer required" ? (
                                        <StyledTableCell>
                                          {workflow.actioned_by_display_name && (
                                            <span>
                                              {
                                                workflow.actioned_by_display_name
                                              }
                                            </span>
                                          )}

                                          {workflow.actioned_by &&
                                            !workflow.actioned_by_display_name && (
                                              <ul style={{ padding: 5 }}>
                                                {" "}
                                                {getApprovers(
                                                  workflow.actioned_by
                                                ).map((user) => (
                                                  <li>{user.name}</li>
                                                ))}
                                              </ul>
                                            )}
                                        </StyledTableCell>
                                      ) : (
                                        <StyledTableCell>NA</StyledTableCell>
                                      )}
                                      <StyledTableCell>
                                        {workflow.approvalcategory}
                                      </StyledTableCell>
                                      <StyledTableCell>
                                        {workflow.requested_time}
                                      </StyledTableCell>

                                      {workflow.status !=
                                      "No longer required" ? (
                                        <StyledTableCell>
                                          {workflow.action_time}
                                        </StyledTableCell>
                                      ) : (
                                        <StyledTableCell>NA</StyledTableCell>
                                      )}
                                      <StyledTableCell>
                                        {workflow.status ===
                                          "No longer required" && (
                                          <span className="badge badge-pill badge-primary">
                                            {workflow.status}
                                          </span>
                                        )}

                                        {workflow.status === "Pending" && (
                                          <span className="badge badge-pill badge-secondary">
                                            {workflow.status}
                                          </span>
                                        )}
                                        {workflow.status === "Approved" && (
                                          <span className="badge badge-pill badge-success">
                                            {workflow.status}
                                          </span>
                                        )}
                                        {workflow.status === "Rejected" && (
                                          <span className="badge badge-pill badge-danger">
                                            {workflow.status}
                                          </span>
                                        )}
                                      </StyledTableCell>
                                      {workflow.status === "Pending" && (
                                        <StyledTableCell>
                                          {getApprovers(
                                            workflow.actioned_by
                                          ).map((user) => {
                                            return user.name ===
                                              loggedUser.displayName ? (
                                              <>
                                                <IconButton style={{}}>
                                                  <CheckIcon
                                                    fontSize="small"
                                                    style={{ color: "green" }}
                                                    onClick={() =>
                                                      openDialog(
                                                        "Approve",
                                                        workflow
                                                      )
                                                    }
                                                  />
                                                </IconButton>
                                                <IconButton style={{}}>
                                                  <ClearIcon
                                                    fontSize="small"
                                                    style={{ color: "red" }}
                                                    onClick={() =>
                                                      openDialog(
                                                        "Reject",
                                                        workflow
                                                      )
                                                    }
                                                  />
                                                </IconButton>
                                              </>
                                            ) : null;
                                          })}
                                        </StyledTableCell>
                                      )}
                                    </StyledTableRow>
                                    {workflow.status &&
                                      workflow.status != "Pending" && (
                                        <StyledTableRow>
                                          <StyledTableCell
                                            style={{ paddingLeft: 15 }}
                                          >
                                            <div>
                                              <b>Reason</b>
                                            </div>
                                            <div>
                                              <b>Comments</b>
                                            </div>
                                          </StyledTableCell>
                                          <StyledTableCell colSpan={5}>
                                            <div>
                                              <span>{workflow.reason}</span>
                                            </div>
                                            <div>
                                              {workflow.comments === "" && (
                                                <span>
                                                  {" "}
                                                  No comments provided
                                                </span>
                                              )}{" "}
                                              <span>{workflow.comments}</span>
                                            </div>
                                          </StyledTableCell>
                                        </StyledTableRow>
                                      )}
                                  </TableBody>
                                </Table>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
                    </>
                  ))}
         
        
      </SwipeableViews>
    </div> 
          
        </div>
      ) : (
        "No Data"
      )}
    </div>
  );
}
