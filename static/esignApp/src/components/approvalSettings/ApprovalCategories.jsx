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
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles,withStyles } from "@material-ui/core/styles";
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
import Button from '@material-ui/core/Button';


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#99b2f7",
    color: theme.palette.common.white,
  },
  body: {
    fontSize:14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    
    
  },
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
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Approval Category",
  },
   
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
            style={{padding:5,paddingLeft:15}}
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
         <StyledTableCell style={{ padding: 5 }} width="20" component={"th"}>
                                      Edit/Delete
                                    </StyledTableCell>
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

function ApprovalCategories(props) {
  const {
    onSetAddCategoryOpen,
    onSetSelectedCategory,
    onSetNewCategory,
    onSetExistCategory,
    categories,
    onDeleteApprovalWorkflowOpen,
    onHandleSearch,
    onSetMode
  } = props;
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

  return (
    <div>
      
      <div style={{width:200,marginTop:-20}}>
      <TextField
          placeholder="Search"
          style={{ marginTop: -20,  marginLeft: 200 }}
          onChange={(e) => onHandleSearch(e,'category')}
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
      <Button size="small" variant="outlined" color="primary"
                  onClick={() => {onSetExistCategory(false);onSetMode('add');
                    onSetNewCategory("");onSetSelectedCategory(null);onSetAddCategoryOpen(true)}}
                  style={{ float: "left", marginTop:-40 }}
                >
                  {" "}
                  Add Approval Categories
                </Button>
      
      
      
       
                <div style={{maxHeight:400,overflow:"auto"}}>
             {categories && categories.length===0 &&  <div style={{opacity:0.5,marginLeft:'40%',marginTop:'10%'}}> No data to display</div>}
             {categories && categories.length > 0 && (
      <TableContainer component={Paper} style={{"marginTop":"20px", 'padding':"20px",'backgroundColor':'#efefef'}}>
        <Table aria-label="simple table">
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={categories.length}
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
          {categories &&
                stableSort(categories, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((category, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
            // {categories.map((category) => (
              return (
                <>
              <StyledTableRow key={"category"} style={{ }}>
                <StyledTableCell scope="row" style={{ padding: 0 ,paddingLeft:15}}>
                  {category.name}
                </StyledTableCell>
                <StyledTableCell   style={{ padding: 0 }}>
               { category.name!="NONE"? <span><IconButton >                    
                    <Edit
                      fontSize="small"
                      color="primary"
                      disabled={category.name==='NONE'}
                      onClick={() => {
                        onSetSelectedCategory(category.name);
                        onSetMode('edit');
                        onSetNewCategory(category.name);
                        onSetExistCategory(false);
                        onSetAddCategoryOpen(category.name);
                      }}
                    />
                  </IconButton>
                  <IconButton onClick={() => onDeleteApprovalWorkflowOpen('',category.name,"Category")} style={{ marginLeft:-10}} >
                    <Delete
                      fontSize="small"
                     
                      
                      style={{ color: "red" }}
                      
                    />
                  </IconButton></span>:<div style={{padding:5,height:44}}>{"  "}</div>}

                </StyledTableCell>
              </StyledTableRow>
              </>
                    );
                  })}
          </TableBody>
        </Table>
      </TableContainer>      
       )}

{categories && categories.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={categories.length}
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
export default ApprovalCategories;
