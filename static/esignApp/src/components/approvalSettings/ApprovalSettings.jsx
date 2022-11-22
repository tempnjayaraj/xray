import React, { useEffect } from "react";
import { invoke } from "@forge/bridge";
import ApprovalCategories from "./ApprovalCategories";
import ApprovalWorkflow from "./ApprovalWorkflow";
import WorkflowDialog from "./WorkflowDialog";
import CategoryDialog from "./CategoryDialog";
import InfoDialog from "./InfoDialog";
import AlertDialog from "./AlertDialog";
import AddUser from "./AddUser";

import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles } from "@material-ui/core/styles";
import Loader from "./Loader";
import SmartWorkflowDialog from "./SmartWorkflowDialog";
import History from "./History";
import { updateTimeline } from "./AuditLog";
import UsersList from "./UsersList";
export default function ApprovalSettings(props) {
  const [workflow, setWorkflowData] = React.useState(null);
  const [issueTypes, setIssueTypes] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [userDetails, setUserDetails] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [isAddCategoryOpen, setAddCategoryOpen] = React.useState(false);
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = React.useState(false);
  const [isInfoDialog, setIsInfoDialog] = React.useState(false);
  const [isLoader, setIsLoader] = React.useState(false);

  const [issueTypeOptions, setIssueTypeOptions] = React.useState([]);
  const [categoryOptions, setCategoryOptions] = React.useState([]);
  const [selectedCat, setSelectedCategory] = React.useState(null);
  const [isAddApprovalWorkflowOpen, setAddApprovalWorkflowOpen] =
    React.useState(false);
  const [newCategory, setNewCategory] = React.useState("");
  const [approvalWorkflowData, setApprovalWorkflowData] = React.useState(null);
  const [tempObject, setTempObject] = React.useState({
    issuetype: "",
    approvalcategory: "",
    status: "",
    approvalrole: "",
    approvers: [],
  });
  const [tempObjectCopy, setTempObjectCopy] = React.useState({
    issuetype: "",
    approvalcategory: "",
    status: "",
    approvalrole: "",
    approvers: [],
  });
  const [deleteType, setDeleteType] = React.useState("");
  const [deleteValue, setDeleteValue] = React.useState("");
  const [deleteData, setDeleteData] = React.useState("");
  const [infoTitle, setInfoTitle] = React.useState("");
  const [mode, setMode] = React.useState("");
  const [updateEnable, setUpdateEnable] = React.useState(false);
  const [editData, setEditData] = React.useState(null);
  const [editRole, setEditRole] = React.useState(null);
  const [position, setPosition] = React.useState("Approval workflow");
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });
  const [existCategory, setExistCategory] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [statusOptions, setStatusOptions] = React.useState([]);
  const [currentUserDetails, setCurrentUserDetails] = React.useState(null);
  const [approvalWorkflowMetaData, setApprovalWorkflowMetaData] =
    React.useState([]);
  const [approvalRoleEdit, setApprovalRoleEdit] = React.useState(false);
  const [loggedUser, setLoggedUser] = React.useState(null);
  const [userGroups, setUserGroups] = React.useState(null);
  const [categoriesMetaData, setCategoriesMetaData] = React.useState([]);
  const [filteredIssues, setFilteredIssues] = React.useState([]);
  const [filteredIssuesApprover, setFilteredIssuesApprover] = React.useState(
    []
  );
  const [customFieldID, setCustomFieldID] = React.useState(null);

  const [inValidUserMessage, setInValidUserMessage] = React.useState("");

  const [transitions, setTransitions] = React.useState([]);
  const [stateTransitions, setStateTransitions] = React.useState([]);
  const [addApprovalworkflowbutton, setAddApprovalworkflowbutton] =
    React.useState(false);
  const [isComment, setIsComment] = React.useState(false);
  const [userList, setUserList] = React.useState([]);

  const handleChange = async (event, data) => {
    setIsLoader(true);
    let customFieldID;
    const CustomFields = await invoke("getCustomfields");
    const customFieldsValue = CustomFields.filter((item) =>
      item.key.includes("approval-category-custom-field")
    );
    if (customFieldsValue.length) {
      customFieldID = customFieldsValue[0].id;
    }

    let jql =
      " issuetype = '" + data.issuetype + "' and status = '" + data.status;
    ("'");
    invoke("getIssues", { jql: jql }).then((responsedata) => {
      const issues = responsedata.issues;
      let filteredIssues = [];
      filteredIssues = issues.filter((issue) => {
        if (issue.fields[customFieldID] === data.approvalcategory) {
          return issue;
        }
      });
      if (filteredIssues.length > 0) {
        setIsDeleteCategoryOpen(false);
        setDeleteData(
          "You will not be able to enable/disable the workflow since associated with issue(s)."
        );
        setInfoTitle("Enable/Disable approval workflow");
        setIsLoader(false);
        setIsInfoDialog(true);
      } else {
        setIsLoader(false);
        let index = approvalWorkflowData.indexOf(data);
        approvalWorkflowData[index].enable =
          !approvalWorkflowData[index].enable;

        let workflow = { workflow: approvalWorkflowData };
        setApprovalWorkflowMetaData([...workflow.workflow]);
        const res = invoke("updateApprovalWorkflow", workflow);
        const workflowTimelineObj = timelineObjConstruct();
        workflowTimelineObj.type = "Approval Workflow";
        workflowTimelineObj.action = "Workflow Updated";
        workflowTimelineObj.category = data.approvalcategory;
        workflowTimelineObj.issuetype = data.issuetype;
        workflowTimelineObj.status = data.status;
        workflowTimelineObj.changedField = "Workflow";
        workflowTimelineObj.summary =
          "Workflow" + approvalWorkflowData[index].enable
            ? "Enabled"
            : "Disabled";
        updateTimeline(workflowTimelineObj);
        setApprovalWorkflowData([...approvalWorkflowData]);
      }
    });
  };

  useEffect(() => {
    (async () => {
      setLoading(true);

      const loggedUser = await invoke("getLoggedUserDetails", {}).then(
        (returnedData) => {
          setLoggedUser(returnedData);
        }
      );

      const userGroups = await invoke("getUserGroups", {}).then(
        (returnedData) => {
          setUserGroups(returnedData);
        }
      );

      const currentUserDetails = await invoke("getCurrenUserDetails");

      setCurrentUserDetails(currentUserDetails);
      const userList = await invoke("getUserList");
      console.log("tetaetasas " + JSON.stringify(userList));
      setUserList(userList);
      // const statusOptions = await invoke("getStatusCategory");
      // setStatusOptions(statusOptions);

      const users = await invoke("getUserSearch", "");

      const tempUsers = users.map((item) => ({
        label: item.name,
        value: item.id,
        src: item.avatarUrl["16x16"],
      }));
      setUsers(tempUsers);
      // const res = invoke("updateApprovalWorkflow",  {"workflow":[{"issuetype":"Story","approvalcategory":"esign1","status":false,
      // "roles":[{"approvalrole":"Service Manager","approvers":["61dcefc190cfd200715eeafa"]}],"show":true}]});

      const issueTypes = await invoke("getIssueTypes");
      setIssueTypes(issueTypes);
      if (issueTypes) {
        // let array = [];
        // issueTypes.map((item) => {
        //   array.push({ label: item, value: item });
        // });
        setIssueTypeOptions(issueTypes);
      }
      const categories = await invoke("getApprovalCategories");

      setCategories(Array.isArray(categories) ? categories : []);

      if (!Array.isArray(categories)) {
        let tempCategories = [{ name: "NONE" }];
        setCategories(tempCategories);
        //categories.push({"name":"NONE"});

        await invoke("addApprovalCategory", tempCategories).then((res) => {});
      }
      setCategoriesMetaData(Array.isArray(categories) ? categories : []);
      if (categories && Array.isArray(categories)) {
        let array = [];
        if (categories.length > 0) {
          categories.map((item) => {
            array.push({ label: item.name, value: item.name });
          });
        } else {
          array.push({ label: "NONE", value: "NONE" });
        }
        setCategoryOptions(array);
      } else {
        let array = [];
        array.push({ label: "NONE", value: "NONE" });
        setCategoryOptions(array);
      }
      const workflow = await invoke("getApprovalWorkflow");
      setWorkflowData(workflow);
      if (workflow) {
        let approvers = [];
        let workflowData = [];
        if (workflow.workflow && Array.isArray(workflow.workflow)) {
          workflow.workflow.map((workflow) => {
            let workflowObject = {};
            workflowObject.issuetype = workflow.issuetype;
            workflowObject.approvalcategory = workflow.approvalcategory;
            workflow.roles.map((role) => {
              workflowObject.approvalrole = role.approvalrole;

              workflowObject.approvers = role.approvers;
              // approvers = approvers.concat(role.approvers)
              role.approvers.map((role) => {
                if (approvers.indexOf(role) === -1) {
                  approvers.push(role);
                }
              });

              workflowData.push(JSON.parse(JSON.stringify(workflowObject)));
            });
          });
          setApprovalWorkflowMetaData([...workflow.workflow]);
          setApprovalWorkflowData(workflow.workflow);
        }
        let param = "";
        approvers.map((item, i) => {
          if (i > 0) {
            param = param + "&accountId=" + item;
          } else {
            param = item;
          }
        });
        invoke("getUserDetails", { approvers: param }).then((responsedata) => {
          const tempUserDetails = responsedata.values;

          let approverdetails = [];
          approvers.map((item) => {
            let user = tempUserDetails.filter(
              (user) => user.accountId === item
            );
            approverdetails.push({
              key: user[0].accountId,
              name: user[0].displayName,
              src: user[0].avatarUrls["16x16"],
            });
          });

          setUserDetails(approverdetails);
        });
      }
      setLoading(false);
    })();
    return () => {};
  }, []);

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  }));
  let lastIssueType = "";
  const showIssueType = (issueType) => {
    if (issueType !== lastIssueType) {
      lastIssueType = issueType;
      lastApprovalCategory = "";
      return issueType;
    } else {
      return "";
    }
  };

  let lastApprovalCategory = "";
  const showApprovalCategory = (approvalCategory) => {
    if (approvalCategory !== lastApprovalCategory) {
      lastApprovalCategory = approvalCategory;
      return approvalCategory;
    } else {
      return "";
    }
  };
  const putApprovalCategoriesForProject = (cats) => {
    invoke("addApprovalCategory", cats).then((res) => {});
  };
  function getIndexData(name, List) {
    for (var i = 0; i < List.length; ++i) {
      if (List[i].name === name) {
        return i;
      }
    }
    return -1;
  }
  function getIndex(name) {
    for (var i = 0; i < categories.length; ++i) {
      if (categories[i].name === name) {
        return i;
      }
    }
    return -1;
  }

  function timelineObjConstruct() {
    let timelineObj = {};
    var currentdate = new Date();
    var datetime = formatAMPM(currentdate);
    const timestamp = currentdate.toISOString();
    timelineObj.createdOn = datetime;
    timelineObj.createdOn_sort = timestamp;
    timelineObj.createdBy = loggedUser.displayName;
    return timelineObj;
  }

  const createApprovalCategory = () => {
    if (selectedCat) {
      let temp = categories;
      let index = getIndex(selectedCat);
      temp.splice(index, 1);
      if (index > -1) {
        categories.splice(index, 0, { name: newCategory });
        setCategoriesMetaData([...categories]);
        setCategories(categories);
        putApprovalCategoriesForProject(temp);
        const workflowValue = approvalWorkflowData.map((item) => {
          if (item.approvalcategory === selectedCat) {
            item.approvalcategory = newCategory;
          }
        });
        let workflowVal = { workflow: approvalWorkflowData };
        const res = invoke("updateApprovalWorkflow", workflowVal);
        setApprovalWorkflowMetaData([...approvalWorkflowData]);
        setApprovalWorkflowData(approvalWorkflowData);
      } else {
      }
      setAddCategoryOpen(false);
      const categoryTimelineObj = timelineObjConstruct();
      categoryTimelineObj.type = "Approval Category";
      categoryTimelineObj.action = "Category Updated";
      categoryTimelineObj.changedField = "Category";
      categoryTimelineObj.summary = 'Category "' + newCategory + '" updated';
      categoryTimelineObj.from = selectedCat;
      categoryTimelineObj.to = newCategory;
      updateTimeline(categoryTimelineObj);
      setNewCategory("");
      setSelectedCategory(null);
    } else {
      if (!categories || categories.length === 0) {
        let temp = [];
        temp.push({ name: newCategory });
        putApprovalCategoriesForProject(temp);
        // properties.onJiraProject(projectId).set('approvalcategories', temp);
        setCategoriesMetaData([...categories]);
        setCategories(temp);
      }
      if (categories.length > 0) {
        let temp = categories;
        temp.push({ name: newCategory });
        putApprovalCategoriesForProject(temp);
        // properties.onJiraProject(projectId).set('approvalcategories', temp);
        setCategoriesMetaData([...categories]);
        setCategories(temp);
      }
      // if (!categories.includes(newCategory)) {
      //   let temp = categories;
      //   temp.push(newCategory);
      //   putApprovalCategoriesForProject(temp);
      //   // properties.onJiraProject(projectId).set('approvalcategories', temp);
      //   setCategories(temp);
      // } else {
      // }
      setAddCategoryOpen(false);
      const categoryTimelineObj = timelineObjConstruct();
      categoryTimelineObj.type = "Approval Category";
      categoryTimelineObj.action = "Category Created";
      categoryTimelineObj.changedField = "Category";
      categoryTimelineObj.summary = 'Category "' + newCategory + '" created';
      updateTimeline(categoryTimelineObj);
    }
    if (categories && Array.isArray(categories)) {
      let array = [];
      categories.map((item) => {
        array.push({ label: item.name, value: item.name });
      });
      setCategoryOptions(array);
    }
  };
  const expandRow = (workflow) => {
    let index = approvalWorkflowData.indexOf(workflow);
    if (approvalWorkflowData[index].show) {
      approvalWorkflowData[index].show = !approvalWorkflowData[index].show;
    } else {
      approvalWorkflowData[index].show = true;
    }
    setApprovalWorkflowMetaData([...approvalWorkflowData]);
    setApprovalWorkflowData([...approvalWorkflowData]);
  };
  const deleteCategory = (category) => {
    let index = categories.indexOf(category);
    categories.splice(index, 1);
    if (categories && Array.isArray(categories)) {
      let array = [];
      categories.map((item) => {
        array.push({ label: item.name, value: item.name });
      });
      setCategoryOptions(array);
    }
    putApprovalCategoriesForProject(categories);
    setCategoriesMetaData([...categories]);
    setCategories([...categories]);
  };

  function formatAMPM(date) {
    var dat = date.getDate();
    var mon = date.toLocaleString("default", { month: "short" });
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime =
      dat + "-" + mon + "-" + year + " " + hours + ":" + minutes + " " + ampm;
    return strTime;
  }
  const putApprovalWorkflows = async (data) => {
    if (mode === "add") {
      setApprovalRoleEdit(false);
      let appFlow = { workflow: [] };
      let workflow = {};
      let obj = {};
      obj.issuetype = data.issuetype.value;
      obj.approvalcategory = data.approvalcategory.value;
      obj.status = data.status.value;
      obj.enable = true;
      var currentdate = new Date();
      var datetime = formatAMPM(currentdate);
      obj.onApprove = data.onApprove;
      obj.onReject = data.onReject;
      obj.updatedOn = datetime;
      obj.updatedBy = loggedUser.displayName;
      obj.roles = [];
      let role = {};
      role.approvalrole = data.approvalrole;
      role.approvers = [];

      data.approvers.map((approver) => {
        role.approvers.push(approver.value);
      });
      obj.roles.push(role);
      let itemInserted = false;

      if (Array.isArray(approvalWorkflowData) && approvalWorkflowData.length) {
        for (let i = 0; i < approvalWorkflowData.length; i++) {
          if (
            approvalWorkflowData[i].issuetype === data.issuetype.value &&
            !itemInserted
          ) {
            if (
              approvalWorkflowData[i].approvalcategory ===
                data.approvalcategory.value &&
              approvalWorkflowData[i].status === data.status.value
            ) {
              let appRoleFound = false;
              for (let j = 0; j < approvalWorkflowData[i].roles.length; j++) {
                if (
                  approvalWorkflowData[i].roles[j].approvalrole ===
                  data.approvalrole
                ) {
                  let approverValue = [];
                  approverValue = data.approvers.filter((approver) => {
                    if (
                      approvalWorkflowData[i].roles[j].approvers.indexOf(
                        approver.value
                      ) == -1
                    ) {
                      return approver;
                    }
                  });
                  if (approverValue.length > 0) {
                    approverValue.map((approver) => {
                      approvalWorkflowData[i].roles[j].approvers.push(
                        approver.value
                      );
                    });
                  }
                  approvalWorkflowData[i].status = data.status.value;

                  appRoleFound = true;
                  itemInserted = true;
                }
              }
              if (!appRoleFound) {
                let roleObj = {};
                roleObj.approvalrole = data.approvalrole;
                roleObj.approvers = [];
                data.approvers.map((approver) =>
                  roleObj.approvers.push(approver.value)
                );
                approvalWorkflowData[i].roles.push(roleObj);
                itemInserted = true;
              }
            }
          } else {
            // approvalWorkflowData.push(obj)
          }
          if (
            i > 0 &&
            approvalWorkflowData[i].issuetype !==
              approvalWorkflowData[i - 1].issuetype &&
            approvalWorkflowData[i - 1].issuetype === data.issuetype.value &&
            !itemInserted
          ) {
            approvalWorkflowData.splice(i, 0, obj);
            itemInserted = true;
          }
        }
        if (!itemInserted) {
          approvalWorkflowData.push(obj);
        }
        workflow = { workflow: approvalWorkflowData };
      } else {
        appFlow.workflow.push(obj);
        workflow = appFlow;
      }

      const res = await invoke("updateApprovalWorkflow", workflow);
      //let timelineObj = {};
      // timelineObj.createdOn = datetime;
      // timelineObj.createdBy = loggedUser.displayName;
      const categoryTimelineObj = timelineObjConstruct();
      categoryTimelineObj.type = "Approval Workflow";
      categoryTimelineObj.changedField = "workflow";
      categoryTimelineObj.action = "workflow created";
      categoryTimelineObj.issuetype = data.issuetype.value;
      categoryTimelineObj.category = data.approvalcategory.value;
      categoryTimelineObj.status = data.status.value;
      categoryTimelineObj.summary =
        "Workflow Created for combination " +
        data.issuetype.value +
        "-" +
        data.approvalcategory.value +
        "-" +
        data.status.value;

      updateTimeline(categoryTimelineObj);

      if (workflow) {
        let approvers = [];
        let workflowData = [];
        if (workflow.workflow && Array.isArray(workflow.workflow)) {
          workflow.workflow.map((workflow) => {
            let workflowObject = {};
            workflowObject.issuetype = workflow.issuetype;
            workflowObject.approvalcategory = workflow.approvalcategory;
            workflow.roles.map((role) => {
              workflowObject.approvalrole = role.approvalrole;

              workflowObject.approvers = role.approvers;
              // approvers = approvers.concat(role.approvers)
              role.approvers.map((role) => {
                if (approvers.indexOf(role) === -1) {
                  approvers.push(role);
                }
              });

              workflowData.push(JSON.parse(JSON.stringify(workflowObject)));
            });
          });
          setApprovalWorkflowMetaData([...workflow.workflow]);
          setApprovalWorkflowData(workflow.workflow);
        }
        let param = "";
        approvers.map((item, i) => {
          if (i > 0) {
            param = param + "&accountId=" + item;
          } else {
            param = item;
          }
        });
        invoke("getUserDetails", { approvers: param }).then((responsedata) => {
          const tempUserDetails = responsedata.values;
          let approverdetails = [];
          approvers.map((item) => {
            let user = tempUserDetails.filter(
              (user) => user.accountId === item
            );
            approverdetails.push({
              key: user[0].accountId,
              name: user[0].displayName,
              src: user[0].avatarUrls["16x16"],
            });
          });
          let arrayX = userDetails.concat(approverdetails);
          let obj = [
            ...new Map(
              arrayX.map((item) => [JSON.stringify(item), item])
            ).values(),
          ];
          setUserDetails(obj);
        });
      }

      setApprovalWorkflowMetaData([...workflow.workflow]);
      setApprovalWorkflowData(workflow.workflow);
    } else {
      let roles = [];
      let index = approvalWorkflowData.indexOf(editData);
      if (editRole) {
        let roleindex = approvalWorkflowData[index].roles.indexOf(editRole);
        data.approvers.map((role) => {
          roles.push(role.value);
        });
        approvalWorkflowData[index].roles[roleindex].approvalrole =
          data.approvalrole;
        //user updated
        const workflowTimelineObj = timelineObjConstruct();
        workflowTimelineObj.type = "Approval Workflow";
        workflowTimelineObj.action = "Workflow Updated";
        workflowTimelineObj.from =
          approvalWorkflowData[index].roles[roleindex].approvers;
        workflowTimelineObj.to = roles;
        workflowTimelineObj.changedField = "User";
        workflowTimelineObj.issuetype = editData.issuetype;
        workflowTimelineObj.category = editData.approvalcategory;
        workflowTimelineObj.status = editData.status;
        workflowTimelineObj.summary =
          "User added for combination " +
          editData.issuetype +
          "-" +
          editData.approvalcategory +
          "-" +
          editData.status;
        updateTimeline(workflowTimelineObj);
        approvalWorkflowData[index].roles[roleindex].approvers = roles;
      } else {
        // let roles = [];
        // let index = approvalWorkflowData.indexOf(editData);
        let role = {};
        role.approvalrole = data.approvalrole;
        role.approvers = [];

        data.approvers.map((approver) => {
          role.approvers.push(approver.value);
        });
        //roles.push(role);
        const workflowTimelineObj = timelineObjConstruct();
        workflowTimelineObj.type = "Approval Workflow";
        workflowTimelineObj.action = "Workflow Updated";
        workflowTimelineObj.from = "";
        workflowTimelineObj.to = "";
        workflowTimelineObj.changedField = "Group";
        workflowTimelineObj.issuetype = editData.issuetype;
        workflowTimelineObj.category = editData.approvalcategory;
        workflowTimelineObj.status = editData.status;
        workflowTimelineObj.summary =
          'Approval Group "' + data.approvalrole + '" Added';
        updateTimeline(workflowTimelineObj);

        approvalWorkflowData[index].roles.push(role);
      }
      var currentdate = new Date();
      var datetime = formatAMPM(currentdate);
      approvalWorkflowData[index].updatedOn = datetime;
      approvalWorkflowData[index].updatedBy = loggedUser.displayName;
      let param = "";
      roles.map((item, i) => {
        if (i > 0) {
          param = param + "&accountId=" + item;
        } else {
          param = item;
        }
      });
      invoke("getUserDetails", { approvers: param }).then((responsedata) => {
        const tempUserDetails = responsedata.values;

        let approverdetails = [];
        roles.map((item) => {
          let user = tempUserDetails.filter((user) => user.accountId === item);
          approverdetails.push({
            key: user[0].accountId,
            name: user[0].displayName,
            src: user[0].avatarUrls["16x16"],
          });
        });

        let arrayX = userDetails.concat(approverdetails);
        let obj = [
          ...new Map(
            arrayX.map((item) => [JSON.stringify(item), item])
          ).values(),
        ];
        setUserDetails(obj);
      });
      let workflowValue = { workflow: approvalWorkflowData };
      const res = invoke("updateApprovalWorkflow", workflowValue);
      //yes
      //update the users in issues
      if (filteredIssues.length > 0) {
        filteredIssues.map(async (issue) => {
          //const getApprovalGroups=  invoke("getApprovalGroupsByIsssue",{"id":issue.id});
          await invoke("getApprovalGroupsByIsssue", { id: issue.id }).then(
            (responsedata) => {
              if (responsedata.value) {
                if (responsedata.value[0].value) {
                  let appGroups = responsedata;
                  const getApprovalGroups = responsedata.value[0].value;

                  getApprovalGroups.map((groups) => {
                    if (groups.approver_group === data.approvalrole) {
                      groups.actioned_by = roles;
                    }
                  });
                  appGroups.value[0].value = getApprovalGroups;
                  invoke("updateApprovalGroupsByissue", {
                    approval: appGroups,
                    id: issue.id,
                  }).then((responsedata) => {});
                }
              }
            }
          );

          // const res = invoke("updateApprovalGroups", issue);
        });
      }

      // const res =  properties.onJiraProject(projectId).set('approvalworkflow',workflow);
      // return workflows
      setApprovalWorkflowMetaData([...approvalWorkflowData]);
      setApprovalWorkflowData([...approvalWorkflowData]);
    }
    setAddApprovalWorkflowOpen(false);
    setAddApprovalworkflowbutton(false);
  };
  function onInputChange() {}
  const getInitials = (data) => {
    const fullName = data.name.split(" ");
    const initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
    return initials.toUpperCase();
  };
  const getApprovers = (data) => {
    let result = users.filter((item) => data.indexOf(item.value) > -1);
    return result;
  };

  const editApprovalWorkflowOpen = async (formData, editType, role) => {
    if (editType === "add") {
      setFilteredIssues([]);
      setMode("add");
      setTempObject({
        issuetype: "",
        approvalcategory: "",
        status: "",
        approvalrole: "",
        approvers: [],
      });
      setApprovalRoleEdit(false);
      setAddApprovalWorkflowOpen(true);
    } else {
      setIsLoader(true);
      let customFieldID;
      setApprovalRoleEdit(false);
      const CustomFields = await invoke("getCustomfields");

      const customFieldsValue = CustomFields.filter((item) =>
        item.key.includes("approval-category-custom-field")
      );
      if (customFieldsValue.length) {
        customFieldID = customFieldsValue[0].id;
        setCustomFieldID(customFieldID);
      }
      let jqlApprover = " issuetype = '" + formData.issuetype + "'";
      invoke("getIssues", { jql: jqlApprover }).then((responsedata) => {
        const res = responsedata.issues;
        let filteredIssuesApprover = [];
        filteredIssuesApprover = res.filter((issue) => {
          if (issue.fields[customFieldID] === formData.approvalcategory) {
            return issue;
          }
        });
        setFilteredIssuesApprover(filteredIssuesApprover);
      });

      let jql =
        " issuetype = '" +
        formData.issuetype +
        "' and status = '" +
        formData.status +
        "'";
      invoke("getIssues", { jql: jql }).then((responsedata) => {
        const issues = responsedata.issues;
        let filteredIssues = [];
        filteredIssues = issues.filter((issue) => {
          if (issue.fields[customFieldID] === formData.approvalcategory) {
            return issue;
          }
        });
        setFilteredIssues(filteredIssues);
        if (filteredIssues.length > 0) {
          setApprovalRoleEdit(true);

          setIsLoader(true);
        }
        setMode("edit");
        setEditData(formData);
        setEditRole(role);

        tempObject.issuetype = {
          label: formData.issuetype,
          value: formData.issuetype,
        };
        tempObject.approvalcategory = {
          label: formData.approvalcategory,
          value: formData.approvalcategory,
        };
        tempObject.status = {
          label: formData.status,
          value: formData.status,
        };
        tempObject.onApprove = formData.onApprove;
        if (formData.signedUser) {
          tempObject.signedUser = formData.signedUser;
        }
        tempObject.onReject = formData.onReject;
        tempObject.approvalrole = role.approvalrole;
        tempObject.approvers = [];
        for (let i = 0; i < role.approvers.length; i++) {
          for (let j = 0; j < userDetails.length; j++) {
            if (role.approvers[i] === userDetails[j].key) {
              tempObject.approvers.push({
                label: userDetails[j].name,
                value: role.approvers[i],
              });
            }
          }
        }

        setTempObject(tempObject);
        setTempObjectCopy(tempObject);
        setIsLoader(false);
        setAddApprovalWorkflowOpen(true);
        // setAddApprovalworkflowbutton(true)
      });
    }
  };
  const Addbutton = async (formData, editType) => {
    setEditData(formData);
    setEditRole(null);
    setMode("edit");
    setApprovalRoleEdit(false);
    tempObject.issuetype = {
      label: formData.issuetype,
      value: formData.issuetype,
    };
    tempObject.approvalcategory = {
      label: formData.approvalcategory,
      value: formData.approvalcategory,
    };
    tempObject.status = {
      label: formData.status,
      value: formData.status,
    };
    tempObject.onApprove = formData.onApprove;
    if (formData.signedUser) {
      tempObject.signedUser = formData.signedUser;
    }
    tempObject.onReject = formData.onReject;
    tempObject.approvalrole = "";
    tempObject.approvers = [];
    setTempObject(tempObject);
    setTempObjectCopy(tempObject);
    // setAddApprovalWorkflowOpen(true);
    setAddApprovalworkflowbutton(true);
  };

  const deleteApproval = async (type, data) => {
    if (type === "Approval Workflow") {
      let index = approvalWorkflowData.indexOf(data);
      let rolesValue = [];
      rolesValue = approvalWorkflowData[index].roles.filter((role) => {
        if (role.approvalrole != deleteValue) {
          return role;
        }
      });
      approvalWorkflowData[index].roles = rolesValue;

      if (rolesValue.length === 0) {
        approvalWorkflowData.splice(index, 1);
      }
      let workflow = { workflow: approvalWorkflowData };
      const res = invoke("updateApprovalWorkflow", workflow);
      setApprovalWorkflowMetaData([...workflow.workflow]);
      setApprovalWorkflowData(workflow.workflow);
      setIsDeleteCategoryOpen(false);
      const workflowTimelineObj = timelineObjConstruct();
      workflowTimelineObj.type = "Approval Workflow";
      workflowTimelineObj.action = "Workflow Updated";
      workflowTimelineObj.category = data.approvalcategory;
      workflowTimelineObj.issuetype = data.issuetype;
      workflowTimelineObj.status = data.status;
      workflowTimelineObj.changedField = "Group";
      workflowTimelineObj.summary =
        'Approval Group "' + deleteValue + '" deleted';
      updateTimeline(workflowTimelineObj);
    } else if (type === "Category") {
      let index = getIndex(deleteValue);
      categories.splice(index, 1);
      if (categories && Array.isArray(categories)) {
        let array = [];
        categories.map((item) => {
          array.push({ label: item.name, value: item.name });
        });
        setCategoryOptions(array);
      }
      putApprovalCategoriesForProject(categories);
      setCategoriesMetaData([...categories]);
      setCategories(categories);
      setIsDeleteCategoryOpen(false);
      const categoryTimelineObj = timelineObjConstruct();
      categoryTimelineObj.type = "Approval Category";
      categoryTimelineObj.action = "Category deleted";
      categoryTimelineObj.changedField = "Category";
      categoryTimelineObj.summary = 'Category "' + deleteValue + '" deleted';
      updateTimeline(categoryTimelineObj);
    }
  };

  const deleteApprovalWorkflowOpen = async (data, deleteValue, deleteType) => {
    setDeleteValue(deleteValue);
    setDeleteType(deleteType);
    setDeleteData(data);
    if (deleteType === "Category") {
      let pop = false;
      if (Array.isArray(approvalWorkflowData)) {
        const workflowValue = approvalWorkflowData.map((item) => {
          if (item.approvalcategory === deleteValue) {
            setDeleteData(
              "You will not be able to delete the category since associated with workflow(s)"
            );
            setInfoTitle("Delete category");
            setIsInfoDialog(true);
            pop = true;
            return;
          }
        });
      }
      if (pop === false) {
        setIsDeleteCategoryOpen(true);
      }
    } else {
      setIsLoader(true);
      let customFieldID;
      const CustomFields = await invoke("getCustomfields");

      const customFieldsValue = CustomFields.filter((item) =>
        item.key.includes("approval-category-custom-field")
      );
      if (customFieldsValue.length) {
        customFieldID = customFieldsValue[0].id;
      }

      let jql =
        " issuetype = '" +
        data.issuetype +
        "' and status = '" +
        data.status +
        "'";
      invoke("getIssues", { jql: jql }).then((responsedata) => {
        const issues = responsedata.issues;
        let filteredIssues = [];
        filteredIssues = issues.filter((issue) => {
          if (issue.fields[customFieldID] === data.approvalcategory) {
            return issue;
          }
        });
        if (filteredIssues.length > 0) {
          setIsDeleteCategoryOpen(false);
          setDeleteData(
            "You will not be able to delete the workflow since associated with issue(s)."
          );
          setInfoTitle("Delete approval workflow");
          setIsLoader(false);
          setIsInfoDialog(true);
        } else {
          setIsLoader(false);
          setIsDeleteCategoryOpen(true);
        }
      });
    }
  };

  const checkCategoryExist = (newCategory) => {
    setNewCategory(newCategory);
    let index;
    let temp = [...categories];
    if (mode === "add") {
      index = getIndex(newCategory);
    } else {
      if (selectedCat) {
        let indexTemp = getIndex(selectedCat);
        temp.splice(indexTemp, 1);
        index = getIndexData(newCategory, temp);
      }
    }
    if (index === -1) {
      setExistCategory(false);
    } else {
      setExistCategory(true);
    }
  };

  const setTempValue = async (value, label, addrole) => {
    tempObject[label] = value;
    // console.log("set formdata Value" + JSON.stringify(formData))
    if (label === "issuetype" && value.id) {
      const statusResp = await invoke("getStatusCategory", {
        issuetypeid: value.id,
      });
      const statuses = statusResp.statuses;
      const transitions = statusResp.transitions;
      const tempstatuslist = statusResp.statuses.map((item) => item.label);
      if (
        tempObject.status &&
        !tempstatuslist.includes(tempObject.status.label)
      ) {
        tempObject.status = "";
      }
      setStatusOptions(statuses);
      setTransitions(transitions);
    }
    if (label === "status") {
      const transitionsresp = transitions.filter((item) =>
        item.from.includes(value.id)
      );
      let transitionArray = [];
      let temptransitionArray = [];
      transitionsresp.map((item) => {
        transitionArray.push({
          label: item.name,
          value: item.name,
          id: item.id,
        });
        temptransitionArray.push(item.name);
      });
      setStateTransitions(transitionArray);
      if (
        tempObject.onApprove &&
        !temptransitionArray.includes(tempObject.onApprove.label)
      ) {
        tempObject.onApprove = "";
      }
      if (
        tempObject.onReject &&
        !temptransitionArray.includes(tempObject.onReject.label)
      ) {
        tempObject.onReject = "";
      }
    }
    setTempObject(tempObject);
    if (mode === "edit" && label === "approvalrole") {
      tempObject.approverExist = false;
      setUpdateEnable(false);
      let index = approvalWorkflowData.indexOf(editData);
      let rolesValue = [];
      // if (editRole) {
      rolesValue = approvalWorkflowData[index].roles.filter((role) => {
        if (editRole && role.approvalrole != editRole.approvalrole) {
          return role;
        } else if (value && addrole) {
          return role;
        }
      });
      if (rolesValue.length > 0) {
        rolesValue.map((role) => {
          if (role.approvalrole === tempObject.approvalrole) {
            tempObject.approverExist = true;
            setUpdateEnable(true);
          }
        });
        setTempObject(tempObject);
      }
      //}else {
    } else if (mode === "add" && label === "approvalrole") {
      tempObject.approverExist = false;
      setUpdateEnable(false);
      //let index = approvalWorkflowData.indexOf(editData);
      let rolesValue = [];
      if (Array.isArray(approvalWorkflowData)) {
        approvalWorkflowData.map((workflow, i) => {
          if (
            workflow.issuetype === tempObject.issuetype.value &&
            workflow.approvalcategory === tempObject.approvalcategory.value &&
            workflow.status === tempObject.status.value
          ) {
            rolesValue = workflow.roles.filter((role) => {
              if (role.approvalrole === tempObject.approvalrole) {
                return role;
              }
            });
          }
        });
      }

      if (rolesValue.length > 0) {
        tempObject.approverExist = true;
        setUpdateEnable(true);
        setTempObject(tempObject);
      }
    } else if (mode === "edit" && label === "approvers") {
      setTempObject(tempObject);
      //Removal of user validation will be used in future reference
      // tempObject.removeApprovers =false;

      // let tempApprovers = []
      // tempObject.approvers.map((app)=>{
      //   tempApprovers.push(app.value)
      // })

      // for( let i=0; i<editData.roles.length;i++){
      //   if(tempObject.signedUser){
      //     for( let j=0; j<editData.roles[i].approvers.length;j++){
      //       if(tempObject.signedUser.includes(editData.roles[i].approvers[j]) && !tempApprovers.includes(editData.roles[i].approvers[j]) ){
      //         for (let k = 0; k< userDetails.length; k++) {
      //           if (editData.roles[i].approvers[j]=== userDetails[k].key) {
      //             if(tempObject.approvers.length>0){
      //               let filter=[];
      //               filter= tempObject.approvers.filter((t)=>{
      //                 return t.value===editData.roles[i].approvers[j]

      //               })
      //               if(filter.length===0){
      //                 tempObject.approvers.push({
      //                   label: userDetails[k].name,
      //                   value: editData.roles[i].approvers[j],
      //                 });
      //               }

      //             }else{
      //             tempObject.approvers.push({
      //               label: userDetails[k].name,
      //               value: editData.roles[i].approvers[j],
      //             });
      //           }
      //           }
      //         }
      //         tempObject.removeApprovers =true;
      //         setTempObject(tempObject);
      //         break;
      //       }
      //     }

      //   }
      // }
    } else {
      setTempObject(tempObject);
    }
  };

  const validate = (value) => {
    return undefined;
  };

  //  const searchResult = useMemo(() => handleSearch(setSearchData,type), [setSearchData]);

  const handleSearch = (event, type) => {
    //   setSearchData = event.target.value;

    if (type === "workflow") {
      var data = approvalWorkflowMetaData;
    } else {
      var data = categoriesMetaData;
    }
    let filteredDatas = [];
    filteredDatas = data.filter((e) => {
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
    if (type === "workflow") {
      setApprovalWorkflowData(filteredDatas);
    } else {
      setCategories(filteredDatas);
    }
  };
  const editCategory = async (category) => {
    setIsLoader(true);
    let customFieldID;
    const CustomFields = await invoke("getCustomfields");

    const customFieldsValue = CustomFields.filter((item) =>
      item.key.includes("approval-category-custom-field")
    );
    if (customFieldsValue.length) {
      customFieldID = customFieldsValue[0].id;
    }

    let jql = " issuetype in ('Story', 'Task', 'Bug', 'Epic')";
    invoke("getIssues", { jql: jql }).then((responsedata) => {
      const issues = responsedata.issues;
      let filteredIssues = [];
      filteredIssues = issues.filter((issue) => {
        if (issue.fields[customFieldID] === category) {
          return issue;
        }
      });
      if (filteredIssues.length > 0) {
        setIsDeleteCategoryOpen(false);
        setDeleteData(
          "You will not be able to edit the category since associated with issue(s)."
        );
        setInfoTitle("Edit Category");
        setIsLoader(false);
        setIsInfoDialog(true);
      } else {
        setIsLoader(false);
        setAddCategoryOpen(true);
      }
    });
  };
  function addUser() {
    setInValidUserMessage("");
    setIsComment(true);
  }
  const hideDialog = () => {
    setIsComment(false);
  };
  async function getUserList() {
    const userList = await invoke("getUserList");
    setUserList(userList);
  }
  const classes = useStyles();
  return (
    <div>
      <Button variant="outlined" color="primary" onClick={addUser}>
        Add User
      </Button>
      <div className={classes.root}>
        <ButtonGroup size="small" aria-label="small outlined button group">
          <Button
            variant="contained"
            color={position === "Approval workflow" ? "primary" : null}
            onClick={() => {
              setPosition("Approval workflow");
            }}
          >
            Approval Workflows
          </Button>
          <Button
            variant="contained"
            color={position === "category" ? "primary" : null}
            onClick={() => {
              setPosition("category");
            }}
          >
            Approval Categories
          </Button>
          <Button
            variant="contained"
            color={position === "History" ? "primary" : null}
            onClick={() => {
              setPosition("History");
            }}
          >
            History
          </Button>
          <Button
            variant="contained"
            color={position === "Users" ? "primary" : null}
            onClick={() => {
              setPosition("Users"), getUserList();
            }}
          >
            Users
          </Button>
        </ButtonGroup>
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
      {!loading && position === "History" && (
        <History
          categories={categories}
          onSetAddCategoryOpen={editCategory}
          onSetSelectedCategory={setSelectedCategory}
          onSetNewCategory={setNewCategory}
          onSetExistCategory={setExistCategory}
          onDeleteApprovalWorkflowOpen={deleteApprovalWorkflowOpen}
          onHandleSearch={handleSearch}
          onSetMode={setMode}
        />
      )}
      <br />
      {!loading && position === "category" && (
        <ApprovalCategories
          categories={categories}
          onSetAddCategoryOpen={editCategory}
          onSetSelectedCategory={setSelectedCategory}
          onSetNewCategory={setNewCategory}
          onSetExistCategory={setExistCategory}
          onDeleteApprovalWorkflowOpen={deleteApprovalWorkflowOpen}
          onHandleSearch={handleSearch}
          onSetMode={setMode}
        />
      )}
      <br />
      {!loading && position === "Users" && (
        <UsersList userList={userList} getUserList={getUserList} />
      )}
      <br />
      {!loading && position === "Approval workflow" && workflow && (
        <ApprovalWorkflow
          OnAddApprovalWorkflowbutton={Addbutton}
          approvalWorkflowData={approvalWorkflowData}
          onExpandRow={expandRow}
          onShowIssueType={showIssueType}
          onShowApprovalCategory={showApprovalCategory}
          onGetApprovers={getApprovers}
          onEditApprovalWorkflowOpen={editApprovalWorkflowOpen}
          onDeleteApprovalWorkflowOpen={deleteApprovalWorkflowOpen}
          checked={state.checkedB}
          onHandleChange={handleChange}
          onHandleSearch={handleSearch}
          userGroups={userGroups}
          onGetInitials={getInitials}
        />
      )}
      <AlertDialog
        deleteValue={deleteValue}
        deleteType={deleteType}
        data={deleteData}
        onDelete={deleteApproval}
        onDeleteCategoryOpen={setIsDeleteCategoryOpen}
        isDeleteCategoryOpen={isDeleteCategoryOpen}
      />
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
          getUserList={getUserList}
        />
      )}
      <Loader isLoader={isLoader} />
      <CategoryDialog
        onSetAddCategoryOpen={setAddCategoryOpen}
        isAddCategoryOpen={isAddCategoryOpen}
        existCategory={existCategory}
        onSetNewCategory={checkCategoryExist}
        onCreateApprovalCategory={createApprovalCategory}
        newCategory={newCategory}
        mode={mode}
      />

      {isAddApprovalWorkflowOpen && (
        <WorkflowDialog
          onSetAddApprovalWorkflowOpen={setAddApprovalWorkflowOpen}
          users={users}
          approvalWorkflowData={approvalWorkflowData}
          categoryOptions={categoryOptions}
          issueTypeOptions={issueTypeOptions}
          statusOptions={statusOptions}
          stateTransitions={stateTransitions}
          onPutApprovalWorkflows={putApprovalWorkflows}
          isAddApprovalWorkflowOpen={isAddApprovalWorkflowOpen}
          tempObject={tempObject}
          mode={mode}
          updateEnable={updateEnable}
          onValidate={validate}
          onSetTempValue={setTempValue}
          editData={editData}
          editRole={editRole}
          approvalRoleEdit={approvalRoleEdit}
        />
      )}
      {addApprovalworkflowbutton && (
        <SmartWorkflowDialog
          onSetAddApprovalWorkflowOpen={setAddApprovalWorkflowOpen}
          onSetAddApprovalWorkflowButtonOpen={setAddApprovalworkflowbutton}
          users={users}
          categoryOptions={categoryOptions}
          issueTypeOptions={issueTypeOptions}
          statusOptions={statusOptions}
          onPutApprovalWorkflows={putApprovalWorkflows}
          addApprovalworkflowbutton={addApprovalworkflowbutton}
          approvalWorkflowData={approvalWorkflowData}
          tempObject={tempObject}
          mode={mode}
          updateEnable={updateEnable}
          onValidate={validate}
          onSetTempValue={setTempValue}
          editData={editData}
          editRole={editRole}
          approvalRoleEdit={approvalRoleEdit}
        />
      )}
    </div>
  );
}
