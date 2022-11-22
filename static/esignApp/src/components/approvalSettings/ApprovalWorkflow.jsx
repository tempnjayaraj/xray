import React, { useContext, useRef, useEffect, Fragment } from "react";
import { Collapse } from "@material-ui/core";
import { Edit, Delete, ExpandLess, ExpandMore } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import AvatarGroup from "@atlaskit/avatar-group";
import { UserGroup, User } from "@forge/ui";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import EmptyState from "@atlaskit/empty-state";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import "../../App.css";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import SmartWorkflowDialog from "./SmartWorkflowDialog";

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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy].toLowerCase() < a[orderBy].toLowerCase()) {
    return -1;
  }
  if (b[orderBy].toLowerCase() > a[orderBy].toLowerCase()) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "issuetype",
    numeric: false,
    disablePadding: true,
    label: "Issue Type",
  },
  {
    id: "approvalcategory",
    numeric: false,
    disablePadding: false,
    label: "Approval Category",
  },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  {
    id: "updatedOn",
    numeric: false,
    disablePadding: false,
    label: "Last Updated",
  },
  {
    id: "updatedBy",
    numeric: false,
    disablePadding: false,
    label: "Updated By",
  },
  { id: "enable", numeric: false, disablePadding: false, label: "Enable" },
  { id: "Add", numeric: false, disablePadding: false, label: "Add" },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    if (property != "enable") {
      onRequestSort(event, property);
    }
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ paddingLeft: 15 }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id && headCell.id != "enable" ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

function ApprovalWorkflow(props) {
  const {
    OnAddApprovalWorkflowbutton,
    onExpandRow,
    onShowIssueType,
    approvalWorkflowData,
    onShowApprovalCategory,
    onGetApprovers,
    onEditApprovalWorkflowOpen,
    onDeleteApprovalWorkflowOpen,
    checked,
    onHandleChange,
    onHandleSearch,
    userGroups,
    onGetInitials,
  } = props;
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("issuetype");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <div>
      <div style={{ width: 200 }}>
        {" "}
        <TextField
          placeholder="Search"
          style={{ marginTop: -60, marginLeft: 200 }}
          onChange={(e) => onHandleSearch(e, "workflow")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      {/* {userGroups.name==='site-admin'?<Button
        variant="outlined"
        color="primary"
        style={{ float: "left", marginRight: 20, marginTop: -80 }}
        onClick={() => onEditApprovalWorkflowOpen("", "add", "")}
      >
        Add Approval Workflow
      </Button>:""} */}
      <Button
        variant="outlined"
        color="primary"
        style={{ float: "left", marginRight: 20, marginTop: -80 }}
        onClick={() => onEditApprovalWorkflowOpen("", "add", "")}
      >
        Add Approval Workflow
      </Button>

      {approvalWorkflowData && approvalWorkflowData.length > 0 ? (
        <TableContainer
          component={Paper}
          style={{
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "#efefef",
          }}
        >
          <Table aria-label="customized table">
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={approvalWorkflowData.length}
            />
            {/* <TableHead>
            <TableRow>
              <TableCell  key="issueType" sortDirection={orderBy === 'issuetype' ? order : false}   component={"th"}>Issue Type</TableCell>
              <TableCell  key="approvalCategory" sortDirection={orderBy === 'approvalCategory' ? order : false} component={"th"}>Approval Category</TableCell>
              <TableCell key="status" sortDirection={orderBy === 'status' ? order : false} component={"th"}>Status</TableCell>
              <TableCell key="updatedOn" sortDirection={orderBy === 'updatedOn' ? order : false} component={"th"}>Last Updated</TableCell>
              <TableCell key="updatedBy" sortDirection={orderBy === 'updatedBy' ? order : false} component={"th"}>Updated By</TableCell>
              <TableCell key="enable" sortDirection={orderBy === 'enable' ? order : false} component={"th"}>Enable</TableCell>
              {/* <TableCell component={'th'}>
         Approver Role
           
           </TableCell> 
           <TableCell component={'th'}>
         Approvers
           
           </TableCell>  
              
            </TableRow>
          </TableHead>           */}
            <TableBody style={{ border: 0 }}>
              {approvalWorkflowData &&
                stableSort(approvalWorkflowData, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((workflow, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <>
                        <StyledTableRow key={"approvalcategory"}>
                          <StyledTableCell
                            style={{ padding: 5, paddingLeft: 15 }}
                          >
                            <IconButton
                              color="primary"
                              onClick={() => onExpandRow(workflow)}
                              aria-label="Expand"
                              component="span"
                              style={{ padding: 0 }}
                            >
                              {workflow.show ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                            {workflow.issuetype}
                          </StyledTableCell>
                          <StyledTableCell style={{ padding: 5 }}>
                            {workflow.approvalcategory}
                          </StyledTableCell>
                          <StyledTableCell style={{ padding: 5 }}>
                            {workflow.status}
                          </StyledTableCell>
                          <StyledTableCell style={{ padding: 5 }}>
                            {workflow.updatedOn}
                          </StyledTableCell>
                          {workflow.updatedBy && (
                            <StyledTableCell style={{ padding: 5 }}>
                              {workflow.updatedBy}
                            </StyledTableCell>
                          )}
                          {!workflow.updatedBy && (
                            <StyledTableCell style={{ padding: 5 }}>
                              -
                            </StyledTableCell>
                          )}
                          <StyledTableCell style={{ padding: 5 }}>
                            <FormGroup row>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={
                                      workflow.enable ? workflow.enable : false
                                    }
                                    onChange={(e) =>
                                      onHandleChange(e.target.checked, workflow)
                                    }
                                    name={index + workflow.approvalcategory}
                                    color="primary"
                                  />
                                }
                                label=""
                              />
                            </FormGroup>
                          </StyledTableCell>
                          <StyledTableCell style={{ padding: 5 }}>
                            <IconButton color="primary">
                              <AddCircleOutlineOutlinedIcon
                                onClick={() =>
                                  OnAddApprovalWorkflowbutton(workflow, "edit")
                                }
                              />
                            </IconButton>
                          </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell
                            style={{
                              paddingBottom: 0,
                              paddingTop: 0,
                              borderBottom: 0,
                              width: "100%",
                            }}
                            colSpan={7}
                          >
                            <Collapse
                              in={workflow.show}
                              timeout="auto"
                              unmountOnExit
                            >
                              {/* {workflow.approvers.map((approver) => <div>{approver},</div>)} */}
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell
                                      width="30"
                                      style={{ paddingLeft: 15 }}
                                      component={"th"}
                                    >
                                      Group name
                                    </TableCell>
                                    <TableCell width="60" component={"th"}>
                                      Users
                                    </TableCell>
                                    <TableCell
                                      width="10"
                                      component={"th"}
                                      align="center"
                                      style={{
                                        padding: 10,
                                        marginRight: "-40px",
                                      }}
                                    >
                                      Edit/Delete
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody style={{ border: 0 }}>
                                  {workflow.roles.map((role) => (
                                    <TableRow>
                                      <TableCell
                                        width="30"
                                        style={{ paddingLeft: 15 }}
                                      >
                                        {role.approvalrole}
                                      </TableCell>
                                      <TableCell width="60">
                                        {/* {role.approvers
                                            ? onGetApprovers(role.approvers).map((approver) => (
                                              <><span style={{
                                                width: 30, height: 30, borderRadius: 15,
                                                backgroundColor: "black",
                                                color: "white",
                                                fontSize: 10,
                                                padding: 5
                                              }}>{onGetInitials(approver)}</span></>
                                              ))
                                            : null}
                                        <span></span> */}
                                        <UserGroup>
                                          {role.approvers
                                            ? role.approvers.map((approver) => (
                                                <User id={approver} />
                                              ))
                                            : null}
                                        </UserGroup>

                                        <AvatarGroup
                                          appearance="stack"
                                          data={onGetApprovers(role.approvers)}
                                        />
                                      </TableCell>
                                      <TableCell
                                        width="10"
                                        align="center"
                                        style={{ padding: 10 }}
                                      >
                                        <IconButton
                                          onClick={() =>
                                            onEditApprovalWorkflowOpen(
                                              workflow,
                                              "edit",
                                              role
                                            )
                                          }
                                        >
                                          <Edit
                                            fontSize="small"
                                            color="primary"
                                          />
                                        </IconButton>
                                        <IconButton
                                          onClick={() =>
                                            onDeleteApprovalWorkflowOpen(
                                              workflow,
                                              role.approvalrole,
                                              "Approval Workflow"
                                            )
                                          }
                                          style={{ marginLeft: -10 }}
                                        >
                                          <Delete
                                            fontSize="small"
                                            style={{ color: "red" }}
                                          />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Collapse>
                          </StyledTableCell>
                        </StyledTableRow>
                      </>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div style={{ opacity: 0.5, marginLeft: "40%", marginTop: "10%" }}>
          {" "}
          No data to display
        </div>
      )}
      {approvalWorkflowData && approvalWorkflowData.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={approvalWorkflowData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
}
export default ApprovalWorkflow;
