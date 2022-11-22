import React, { useContext, useRef, useEffect, Fragment } from "react";
import { Collapse } from "@material-ui/core";
import AvatarGroup from "@atlaskit/avatar-group";
import { UserGroup, User } from "@forge/ui";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import EmptyState from "@atlaskit/empty-state";
import { invoke, requestJira } from "@forge/bridge";
import CircularProgress from "@material-ui/core/CircularProgress";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles, withStyles } from "@material-ui/core/styles";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableContainer,
  Paper,
  IconButton,
} from "@material-ui/core";
import { Edit, Delete, ExpandLess, ExpandMore } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
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
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Action",
  },
  {
    id: "createdBy",
    numeric: false,
    disablePadding: false,
    label: "Created By",
  },
  {
    id: "createdOn_sort",
    numeric: false,
    disablePadding: false,
    label: "Created On",
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "Entity",
  },
  {
    id: "changedField",
    numeric: false,
    disablePadding: false,
    label: "Changed Field",
  },
  {
    id: "from",
    numeric: false,
    disablePadding: false,
    label: "Old value",
  },
  {
    id: "to",
    numeric: false,
    disablePadding: false,
    label: "New value",
  },
  {
    id: "summary",
    numeric: false,
    disablePadding: false,
    label: "Summary",
  }
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
            style={{ padding: 5, paddingLeft: 15 }}
            width={80}
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
        {/* <StyledTableCell
        //   style={{ : 5 }}
          width="20"
          component={"th"}
        ></StyledTableCell> */}
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

function History(props) {
  const {
    onSetAddCategoryOpen,
    onSetSelectedCategory,
    onSetNewCategory,
    onSetExistCategory,
    categories,
    onDeleteApprovalWorkflowOpen,
    onSetMode,
  } = props;
  const classes = useStyles();
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("createdOn_sort");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [timelinehistory, setTimelineHistory] = React.useState([]);
  const [userDetails, setUserDetails] = React.useState([]);
  const [loading, setLoading] = React.useState(false);


  useEffect(() => {
    (async () => {
    const timelineData = [];
    setLoading(true);
    const timelineListVal = await invoke("getWorkflowTimelineList");
    if (
      typeof timelineListVal.length !== "undefined" &&
      timelineListVal.length
    ) {
      setLoading(false);
      timelineListVal.map(async (propertyKey) => {
        let propertyKeyValue = propertyKey.key;
        const responsedataValue = await invoke("getWorkflowTimeline", {
          propertyKey: propertyKeyValue,
        });
        const prtyTimeline = responsedataValue;
        prtyTimeline.map((timelineObj) => {
          timelineData.push(timelineObj);
        });
        let approvers = [];
          timelineData.map((element) => {
            if (element.from && element.changedField === "User") {
              element.from.map((user) => {
                if (!approvers.includes(user)) {
                  approvers.push(user);
                }
              });
            } else if (element.to && element.changedField === "User") {
              element.to.map((user) => {
                if (!approvers.includes(user)) {
                  approvers.push(user);
                }
              });
            }
          });

          let param = "";
          approvers.map((item, i) => {
            if (i > 0) {
              param = param + "&accountId=" + item;
            } else {
              param = item;
            }
          });
          invoke("getUserDetails", { approvers: param }).then(
            (responsedata) => {
              const tempUserDetails = responsedata.values;
              let approverdetails = [];
              approvers.map((item) => {
                let user = tempUserDetails.filter(
                  (user) => user.accountId === item
                );
                if (user.length > 0) {
                  if (approverdetails.length > 0) {
                    let tempArray = [];
                    tempArray = approverdetails.filter((detail) => {
                      if (user[0].accountId === detail.key) {
                        return detail;
                      }
                    });
                    if (tempArray.length === 0) {
                      approverdetails.push({
                        key: user[0].accountId,
                        name: user[0].displayName,
                        src: user[0].avatarUrls["16x16"],
                      });
                    }
                  } else {
                    approverdetails.push({
                      key: user[0].accountId,
                      name: user[0].displayName,
                      src: user[0].avatarUrls["16x16"],
                    });
                  }
                }
              });
              setUserDetails([...approverdetails]);
              }
          );     
        setTimelineHistory(timelineData);
      });      
      
    }
  })();
  return () => {};
  }, []);
  const getApprovers = (data) => {
    let result = userDetails.filter((item) => data.indexOf(item.key) > -1);
    return result;
  };
  const handleSearch = (event, type) => {
    //   setSearchData = event.target.value;

    
    let filteredDatas = [];
    filteredDatas = timelinehistory.filter((e) => {
      const mathesItems = Object.values(e);
      let retVal = null;
      for (const e1 of mathesItems) {
        const regex = event.target.value.toLowerCase();

        if (typeof e1 === "string") {
          retVal = e1.toLowerCase().match(regex);
          if (retVal !== null) {
            break;
          }
        }
      }

      return retVal;
    });
    
      setTimelineHistory(timelinehistory);
    
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const data = [
    {
      createdOn: "2/3/2101",
      createdBy: "sr48",
      action: "workflow created",
      issuetype: "Story",
      status: "In Review",
      category: "NONE",
    },
    {
      createdOn: "13/7/2022",
      createdBy: "vaishu",
      action: "workflow updated",
      issuetype: "Story",
      status: "In Review",
      category: "NONE",
    },
    {
      createdOn: "13/7/2022",
      createdBy: "vaishu",
      action: "workflow disabled",
      issuetype: "Story",
      status: "In Review",
      category: "NONE",
    },
    {
      createdOn: "13/7/2022",
      createdBy: "vaishu",
      action: "workflow enabled",
      issuetype: "Story",
      status: "In Review",
      category: "NONE",
    },
  ];

  return (
    <div>
      <div style={{ width: 200, marginTop: -20 }}>
        <TextField
          placeholder="Search"
          style={{ marginTop: -20 }}
          onChange={(e) => handleSearch(e, "history")}
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
      {loading && (
        <CircularProgress
          size={40}
          left={-20}
          top={10}
          status={"loading"}
          style={{ marginLeft: "50%" }}
        />
      )}
      <div style={{ maxHeight: '100%', overflow: "auto" }}>
        {data && data.length === 0 && (
          <div style={{ opacity: 0.5, marginLeft: "40%", marginTop: "10%" }}>
            {" "}
            No data to display
          </div>
        )}
        {timelinehistory && timelinehistory.length > 0 && (
          <TableContainer
            component={Paper}
            style={{
              marginTop: "20px",
            }}
          >
            <Table aria-label="simple table">
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={data.length}
              />

              {/* <TableHead>
                                  <TableRow>
                                    <TableCell style={{ padding: 5 }} width="80" component={"th"}>
                                      Approval category
                                    </TableCell>
                                    <TableCell align="right" style={{ padding: 5,paddingRight:20 }} width="20" component={"th"}>
                                      Edit/Delete
                                    </TableCell>
         </TableRow>
         </TableHead> */}
              <TableBody>
                {timelinehistory &&
                  stableSort(timelinehistory, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((category, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;
                      // {categories.map((category) => (
                      return (
                        <>
                          <StyledTableRow key={category+index} style={{}}>
                            
                            <StyledTableCell
                              scope="row"
                              style={{ padding: 0, paddingLeft: 15 }}>{category.action}</StyledTableCell>
                            <StyledTableCell>
                              {category.createdBy}
                            </StyledTableCell>
                            <StyledTableCell>
                              {category.createdOn}
                            </StyledTableCell>
                            <StyledTableCell
                            >
                              {category.type}
                            </StyledTableCell>
                            <StyledTableCell>
                              {category.changedField}
                            </StyledTableCell>
                            <StyledTableCell>
                            {category.changedField === "User" ? (
                                <ul style={{ padding: 5 }}>
                                  {" "}
                                  {getApprovers(category.from).map((user) => (
                                    <li>{user.name}</li>
                                  ))}
                                </ul>
                              ) : (
                                category.from
                              )}
                            </StyledTableCell>
                            <StyledTableCell>
                            {category.changedField === "User" ? (
                                <ul style={{ padding: 5 }}>
                                  {" "}
                                  {getApprovers(category.to).map((user) => (
                                    <li>{user.name}</li>
                                  ))}
                                </ul>
                              ) : (
                                category.to
                              )}
                            </StyledTableCell>
                            <StyledTableCell>
                              {category.summary}
                            </StyledTableCell>
                          </StyledTableRow>
                        </>
                      );
                    })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {data && data.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={timelinehistory.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </div>
    </div>
  );
}
export default History;
