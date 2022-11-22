import React, { useContext, useRef, useEffect, Fragment } from "react";
import {
  DialogContent,
  Dialog,
  DialogTitle,
  TextField,
  DialogActions  
} from "@material-ui/core";
import { invoke, requestJira } from "@forge/bridge";
import Button from "@atlaskit/button";

function CategoryDialog(props) {
  const {
    onSetAddCategoryOpen,
    isAddCategoryOpen,
    onSetNewCategory,
    onCreateApprovalCategory,
    newCategory,
    existCategory,
    mode
  } = props;
  return (
    <div>
      <Dialog
        onClose={() => onSetAddCategoryOpen(false)}
        open={isAddCategoryOpen} onBackdropClick="false"
      >
        <DialogTitle>Category</DialogTitle>
        <DialogContent>
          <div style={{ marginTop: 20 }}>
            <TextField
              name="category"
              label="Category"
              value={newCategory}
              onChange={(e) => onSetNewCategory(e.target.value)}
            />
            {existCategory && <span  style={{color:'red', forntSize:10}}>Category already exist</span> }
          </div>
        </DialogContent>
        <DialogActions> 
        <Button 
                  appearance="default"
                  onClick={() => onSetAddCategoryOpen(false)}
                >
                  Cancel
                </Button>         
          <Button
            appearance="primary"
            onClick={onCreateApprovalCategory}
            isDisabled={!newCategory || newCategory === '' || existCategory}
          >
         {mode==='add'? "Create":"Save"}  
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default CategoryDialog;
