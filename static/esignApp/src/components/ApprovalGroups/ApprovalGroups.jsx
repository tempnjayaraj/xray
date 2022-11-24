import { invoke } from "@forge/bridge";
import React, { useEffect } from "react";
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
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import EsignDialog from "./EsignDialog";
import InfoDialog from "../approvalSettings/InfoDialog";
import { B300 } from "@atlaskit/theme/colors";

import ReasonDialog from "./ReasonDialog";
import ResetPassword from "../GlobalPage/ResetPassword";

import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import ApprovalHistory from "./ApprovalHistory";
import "../../App.css";
import * as MyConstClass from "../../constants/configureContants";

import noop from "@atlaskit/ds-lib/noop";
import InfoIcon from "@atlaskit/icon/glyph/info";
import { token } from "@atlaskit/tokens";
import Flag from "@atlaskit/flag";
// import api, { route } from "@forge/api";

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

export default function ApprovalGroups() {
  const [approvalGroups, setApprovalGroups] = React.useState([]);
  const [userDetails, setUserDetails] = React.useState([]);

  const [userData, setUserData] = React.useState([]);
  const [isEsign, setIsEsign] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [action, setAction] = React.useState("");
  const [reasonOptions, setReasonOptions] = React.useState([]);
  const [actionWorkflow, setActionWorkflow] = React.useState(null);
  const [loggedUser, setLoggedUser] = React.useState(null);
  const [isInfoDialog, setIsInfoDialog] = React.useState(false);
  const [infoTitle, setInfoTitle] = React.useState("");
  const [infoData, setInfoData] = React.useState("");
  const [tempReason, setTempReason] = React.useState(null);
  const [getTransition, setGetTransition] = React.useState(null);
  const [updateFlow, setUpdateFlow] = React.useState(0);
  const [tempOptions, setTempOptions] = React.useState([]);
  const [isComment, setIsComment] = React.useState(false);
  const [isSignout, setIsSignout] = React.useState(false);
  const [inValidUserMessage, setInValidUserMessage] = React.useState("");

  //const [history, setHistory] = React.useState([{"cycle":1,"value":[{"id":1,"approver_group":"QA","actioned_by":["61efbf0c1c42100069457a15"],"status":"Rejected","requested_time":"11-May-2022   15:42","action_time":"11-May-2022   15:43","reason":"As an Approver - I Reject this record","comments":"not ok","actioned_by_display_name":"Chitra Sankar"},{"id":1,"approver_group":"Tester","actioned_by":["62600a129e7c190069e75bd1","557058:a52d5abe-62bd-4106-b55e-86616b595e10","61efbf0c1c42100069457a15"],"status":"No longer required","requested_time":"11-May-2022   15:42","action_time":"11-May-2022   15:42","reason":"NA","comments":"NA"}]}]);
  const [approvalHistory, setApprovalHistory] = React.useState([]);
  const [status, setStatus] = React.useState([]);
  const [transitions, setTransitions] = React.useState([]);
  const [approvalWorkflow, setApprovalWorkflow] = React.useState([]);
  const [issueType, setIssueType] = React.useState("");
  const [statusValue, setStatusValue] = React.useState("");
  const [approvalCategory, setApprovalCategory] = React.useState("");
  const [issueCreator, setIssueCreator] = React.useState(false);

  const getApprovers = (data) => {
    let result = userDetails.filter((item) => data.indexOf(item.key) > -1);

    return result;
  };
  const openDialog = async (esign, workflow, creator) => {
    setInValidUserMessage("");
    // if (creator == loggedUser.accountId) {
    //   setInfoData(
    //     "Approvals not allowed, as you are the creator of this issue."
    //   );
    //   setInfoTitle("Approvals");
    //   setIsInfoDialog(true);
    //   return;
    // }
    let index = approvalGroups.indexOf(workflow);

    let userExist = [];
    userExist = getApprovers(workflow.actioned_by).filter((user) => {
      return user.name === loggedUser.displayName;
    });
    if (userExist.length === 0) {
      setInfoData(
        "Approvals not allowed, as you have not added in the approval."
      );
      setInfoTitle("Approvals");
      setIsInfoDialog(true);
      return;
    }

    let data = [];
    data = approvalGroups.filter((groups) => {
      if (groups.actioned_by_display_name) {
        if (groups.actioned_by_display_name === loggedUser.displayName) {
          return groups;
        }
      }
    });
    // window.open("https://id.atlassian.com/rest/check-username", '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')

    if (data.length > 0) {
      setInfoData(
        "Approvals not allowed, as you have already approved in other role."
      );
      setInfoTitle("Approvals");
      setIsInfoDialog(true);

      // router.open('https://developatlassian.atlassian.net/login?application=jira');
      // window.open("https://id.atlassian.com/rest/check-username", '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')
      // <iframe src="https://id.atlassian.com/rest/check-username" sandbox="allow-popups allow-popups-to-escape-sandbox"></iframe>
      //window.location.reload();
      //router.reload();
      //  var window1 = router.open('https://id.atlassian.com/login');

      //router.navigate(window.location.href);
      //setIsEsign(true);
    }

    if (data.length === 0) {
      setUpdateFlow(0);
      //window.open("https://id.atlassian.com/login", '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')
      // setIsEsign(true);
      // router.open('https://id.atlassian.com/login');
      setAction(esign);
      let tempOptions = [];
      setActionWorkflow(workflow);

      if (esign === "Approve") {
        tempOptions.push({
          label: "As an Approver - I Approve this record",
          value: "As an Approver - I Approve this record",
        });
        setReasonOptions(tempOptions);
      } else {
        tempOptions.push({
          label: "As an Approver - I Reject this record",
          value: "As an Approver - I Reject this record",
        });
      }
      setReasonOptions(tempOptions);
      //  window.open("https://dev-9445864.okta.com/login/login.htm?iframe=true", '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')

      if (MyConstClass.IS_SAML) {
        setIsComment(true);
      } else {
        setIsEsign(true);
      }
    }
  };

  const expandRow = (his, historyStatus) => {
    approvalHistory.map((app, ind) => {
      if (app.status === historyStatus) {
        let index = app.history.indexOf(his);
        if (approvalHistory[ind].history[index].show) {
          approvalHistory[ind].history[index].show =
            !approvalHistory[ind].history[index].show;
        } else {
          approvalHistory[ind].history[index].show = true;
        }
        setApprovalHistory([...approvalHistory]);
      }
    });
  };
  const hideDialog = (esign) => {
    setIsEsign(false);
    setIsComment(false);
    setIsresetPassword(false);
  };
  const onSignOut = (location) => {
    setLoading(true);
    putApproval();
  };
  const getSamlresponse = (location) => {
    if (updateFlow === 0) {
      setUpdateFlow(1);
      return;
    }
    if (updateFlow === 1) {
      //putApproval();
      setIsSignout(true);
    }
  };

  

  
  const putComment = async (formData) => {

    let index = approvalGroups.indexOf(actionWorkflow);
    if (formData) {
      if (!formData.username) {
        setInValidUserMessage("Username is required");
        return;
      }
      actionWorkflow.comments = formData.comments;
    }
    if (MyConstClass.IS_SAML) {

      let username = formData.username;
      let password = formData.password;

      let userSSOResponse = postJson(MyConstClass.CheckSSOURL,{"username":username});
      let userSSO;
      if(userSSOResponse){
        userSSO = userSSOResponse.SSO;
        // console.log(userSSO);
      }
      console.log("User SSO Status "+JSON.stringify(userSSOResponse));

      const userDet = await invoke("getUserAccountId", {emailID:username});
      let formUserAccountId;
      if(userDet.length!=0){
        formUserAccountId = userDet[0].id;  
      }
      var authenticated = false;
      
      const issueDetails = await invoke("getIssueDetails");
      let creatorId = issueDetails.fields.creator.accountId;
      let apiS;
      if(!formUserAccountId){
        setInValidUserMessage("Username not valid");
      }else{
        if(loggedUser.accountId==formUserAccountId){
          if(formUserAccountId==creatorId){
            setInValidUserMessage("Creator cannot be the reviewer");
          }else{
            try{
              // console.log('Inside try block');
             if(userSSO=="Azure"){
              // console.log('Inside Azure block');
              console.log("I am trying to hit Azure Auth")
              let azureReqBody = {
                'clientID':'0990b18a-4ad0-44ef-a842-1d0b7083cc79',
                'tenantID':'f73264f6-5797-4035-9dbd-5803190f1a70',
                'username':username,
                'password':password
              }
              apiS = await postJson(MyConstClass.AzureAuthenticationURL,azureReqBody);  
              if(apiS){
                authenticated = true;
              }else{
                setInValidUserMessage("Invalid Credentials provided");
              }
             }else if(userSSO=="Okta"){
              console.log("I am trying to hit Okta Auth");
              let oktaReqBody = {
                      "username": username,
                      "password": password,
                      "options": {
                      "multiOptionalFactorEnroll": false,
                      "warnBeforePasswordExpired": true
                    }  
                  }
              apiS = await postJson(MyConstClass.OktaAuthURL,oktaReqBody);  
              let status = apiS.status;
              if(status==undefined){
                status='Unauthorized';  
              }
              
              if(status=="SUCCESS"){
                authenticated = true;
              }else{
                setInValidUserMessage("Invalid Credentials provided");
              }
             }else{
              setInValidUserMessage("The user is not configured under any SSO");
             }
              
            }catch{
              setInValidUserMessage("Invalid Credentials");
            }
       
          }
          
        }else{
          setInValidUserMessage("Please provide credentials for the logged in user");
        }
      }
   
    

      // userDetails.map((user) => {
      //   if (user.username === currentUsername && user.secretValue === pwd) {
      //     authenticated = true;
      //   }
      // });
      setActionWorkflow(actionWorkflow);

      if (authenticated) {
        setIsComment(false);
        console.log("Before call");
        putApproval(formData);
      } else {
        // setInValidUserMessage("Authentication failed!");
        return;
      }
    }
    //  approvalGroups[index]=actionWorkflow;
    else {
      setActionWorkflow(actionWorkflow);

      setIsComment(false);
      setIsEsign(false);
    }
    //for testing local db authentication
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
  function postROPC(api,json) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", api, false);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xmlhttp.send(JSON.stringify(json));
    var jsonObject = JSON.parse(xmlhttp.responseText);
    return jsonObject;
}
  function postJson(api,json) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", api, false);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(json));
        var jsonObject = JSON.parse(xmlhttp.responseText);
        return jsonObject;
      }
    function getJson(api) {
        var xhReq = new XMLHttpRequest();
        xhReq.open("GET", api, false);
        xhReq.send(null);
        var jsonObject = JSON.parse(xhReq.responseText);
        return jsonObject;
    }

  const putApproval = async (formData) => {
    console.log("Test");
    setLoading(true);

   

    let currentIndex = approvalGroups.indexOf(actionWorkflow);
    let actioned_by = [];
    actioned_by.push(loggedUser.accountId);
    actionWorkflow.actioned_by = actioned_by;
    actionWorkflow.comments = formData.comments;

    actionWorkflow.reason = reasonOptions[0].value;
    // actionWorkflow.comments='';
    actionWorkflow.actioned_by_display_name = loggedUser.displayName;

    


    var currentdate = new Date();
    var datetime = formatAMPM(currentdate);

    actionWorkflow.action_time = datetime;
    action === "Approve"
      ? (actionWorkflow.status = "Approved")
      : (actionWorkflow.status = "Rejected");
    approvalGroups[currentIndex] = actionWorkflow;

    if (action === "Reject") {
      let history = [];
      approvalGroups.map((group, index) => {
        if (index != currentIndex && group.status === "Pending") {
          group.status = "No longer required";
          group.reason = "NA";
          group.comments = "NA";
        }
      });
      const getTransitionValue = await invoke("getTransition", {}).then(
        (returnedData) => {
          setGetTransition(returnedData);
          return returnedData;
        }
      );
      // let transitionto = getTransitionValue.transitions.filter((item) => actionWorkflow.onReject.id === item.id)
      // const putTransition = await invoke("putTransition", {
      //   transition: transitionto,
      //   action: action,
      // })
      approvalWorkflow.map((group) => {
        if (
          group.issuetype === issueType &&
          group.approvalcategory === approvalCategory &&
          group.status === statusValue
        ) {
          if (group.signedUser) {
            if (group.signedUser.length > 0) {
              if (group.signedUser.indexOf(loggedUser.accountId) === -1) {
                group.signedUser.push(loggedUser.accountId);
              }
            }
          } else {
            group.signedUser = [];
            group.signedUser.push(loggedUser.accountId);
          }
        }
      });
      let workflowVal = { workflow: approvalWorkflow };
      const res = invoke("updateApprovalWorkflow", workflowVal);

      if (approvalHistory.length > 0) {
        let updated = false;
        let history = approvalHistory;
        history.map((his) => {
          if (his.status === status) {
            updated = true;
            his.history.push({
              cycle: his.history.length + 1,
              value: approvalGroups,
            });
          }
        });
        if (updated === false) {
          history.push({
            status: status,
            history: [{ cycle: 1, value: approvalGroups }],
          });
        }
        //data.push({"cycle":approvalHistory.length,"value":approvalGroups});
        setApprovalHistory(history);
      } else {
        history = [
          { status: status, history: [{ cycle: 1, value: approvalGroups }] },
        ];

        setApprovalHistory(history);
      }
      if (history.length > 0) {
        invoke("updateApprovalHistory", { history: history }).then(
          (responsedata) => {}
        );
      } else {
        invoke("updateApprovalHistory", { history: approvalHistory }).then(
          (responsedata) => {}
        );
      }
      setApprovalGroups([]);
      invoke("updateApprovalGroups", { approval: [] }).then((responsedata) => {
        let transitionto = getTransitionValue.transitions.filter(
          (item) => actionWorkflow.onReject.id === item.id
        );
        invoke("putTransition", {
          transition: transitionto,
          action: action,
        }).then((responsedata) => {});

        setIsSignout(false);
        setLoading(false);
        setIsEsign(false);
        setInfoData(actionWorkflow.status);
        setInfoTitle("Approvals");
        setIsInfoDialog(true);
      });
    }
    if (action != "Reject") {
      console.log("No reject");
      let tempApprovals = [];
      let history = [];
      tempApprovals = approvalGroups.filter((group) => {
        if (group.status != "Approved") {
          return group;
        }
      });
      approvalWorkflow.map((group) => {
        if (
          group.issuetype === issueType &&
          group.approvalcategory === approvalCategory &&
          group.status === statusValue
        ) {
          if (group.signedUser) {
            if (group.signedUser.length > 0) {
              if (group.signedUser.indexOf(loggedUser.accountId) === -1) {
                group.signedUser.push(loggedUser.accountId);
              }
            }
          } else {
            group.signedUser = [];
            group.signedUser.push(loggedUser.accountId);
          }
        }
      });
      let workflowVal = { workflow: approvalWorkflow };
      const res = invoke("updateApprovalWorkflow", workflowVal);
      if (tempApprovals.length === 0) {
        const getTransitionValue = await invoke("getTransition", {}).then(
          (returnedData) => {
            setGetTransition(returnedData);
            return returnedData;
          }
        );

        if (approvalHistory.length > 0) {
          let updated = false;
          history = approvalHistory;
          history.map((his) => {
            if (his.status === status) {
              updated = true;
              his.history.push({
                cycle: his.history.length + 1,
                value: approvalGroups,
              });
            }
          });
          if (updated === false) {
            history.push({
              status: status,
              history: [{ cycle: 1, value: approvalGroups }],
            });
          }
          //data.push({"cycle":approvalHistory.length,"value":approvalGroups});

          setApprovalHistory(history);
        } else {
          history = [
            { status: status, history: [{ cycle: 1, value: approvalGroups }] },
          ];

          setApprovalHistory(history);
        }
        if (history.length > 0) {
          invoke("updateApprovalHistory", { history: history }).then(
            (responsedata) => {}
          );
        } else {
          invoke("updateApprovalHistory", { history: approvalHistory }).then(
            (responsedata) => {}
          );
        }
        setApprovalGroups([]);
        invoke("updateApprovalGroups", { approval: [] }).then(
          (responsedata) => {
            let transitionto = getTransitionValue.transitions.filter(
              (item) => actionWorkflow.onApprove.id === item.id
            );
            invoke("putTransition", {
              transition: transitionto,
              action: action,
            }).then((returnedData) => {});
          }
        );

        //setIsSignout(true);
        // const timeout = setTimeout(() => {
        setIsSignout(false);
        setLoading(false);
        setIsEsign(false);
        setInfoData(actionWorkflow.status);
        setInfoTitle("Approvals");
        setIsInfoDialog(true);

        // }, 2000);

        //    setIsEsign(false);
      } else {
        setApprovalGroups(approvalGroups);
        invoke("updateApprovalGroups", {
          approval: [{ status: status, value: approvalGroups }],
        }).then((responsedata) => {});
        setIsSignout(false);
        setLoading(false);
        //const getApprovalGroupsData = await invoke("getApprovalGroups");
        //console.log("getApprovalGroupsData "+getApprovalGroupsData);
        //setApprovalGroups(getApprovalGroupsData);
        // setIsEsign(false);
        //  setIsSignout(true);
        //  const timeout = setTimeout(() => {
        setIsEsign(false);
        setInfoData(actionWorkflow.status);
        setInfoTitle("Approvals");
        setIsInfoDialog(true);
        //   setLoading(false);
        // }, 2000);
      }
    }

    //setIsEsign(false);

    //document.location.reload();
  };

  const [isresetPassword, setIsresetPassword] = React.useState(false);
  const [userList, setUserList] = React.useState([]);
  function resetPassword() {
    setIsresetPassword(true);
  }
  function refreshList() {}
  useEffect(() => {
    (async () => {
      setLoading(true);
      const users = await invoke("getUserList");
      setUserList(users);
      const loggedUser = await invoke("getLoggedUserDetails", {}).then(
        (returnedData) => {
          setLoggedUser(returnedData);
          let index = users.findIndex((object) => {
            return object.username === returnedData.displayName;
          });
          if (index == -1) {
          } else {
            setUserData(users[index]);
          }
        }
        
      );

      

      const issueDetails = await invoke("getIssueDetails");
      const abc = await invoke("getUserSearch");  
      console.log(abc + " creator " + issueCreator + " accountId "+ loggedUser);

      const getApprovalGroups = await invoke("getApprovalGroups");
      const getApprovalHistory = await invoke("getApprovalHistory");
      const issueType = issueDetails.fields.issuetype.name;
      const statusValue = issueDetails.fields.status.name;
      setIssueCreator(issueDetails.fields.creator.accountId);
      setStatusValue(statusValue);
      const CustomFields = await invoke("getCustomfields");

      const transitions1 = await invoke("getIssueTransitions");
      setTransitions(transitions1.transitions);

      let customFieldID;
      let customFieldValue;
      const customFieldsValue = CustomFields.filter((item) =>
        item.key.includes("approval-category-custom-field")
      );
      if (customFieldsValue.length) {
        customFieldID = customFieldsValue[0].id;
      }

      if (customFieldID) {
        customFieldValue = issueDetails.fields[customFieldID];
      }

      const workflow = await invoke("getApprovalWorkflow");
      const approvalWorkflow = workflow.workflow;
      setApprovalWorkflow(approvalWorkflow);
      setIssueType(issueType);
      setApprovalCategory(customFieldValue);
      if (getApprovalGroups.value && getApprovalGroups.value.length > 0) {
      } else {
        let approvalGroups1 = approvalWorkflow.filter(
          (item) =>
            item.issuetype === issueType &&
            item.approvalcategory === customFieldValue &&
            item.status === statusValue
        );

        let approvalsGroupList = [];
        let approvalGroupsObject = [];
        // getApprovalGroups.value=approvalGroups1;
        if (approvalGroups1.length > 0) {
          var currentdate = new Date();
          var datetime = formatAMPM(currentdate);
          var currentStatus = "Pending";
          var reason = "";
          let statusValue1 = approvalGroups1[0].status;
          let onApprove = approvalGroups1[0].onApprove;
          let onReject = approvalGroups1[0].onReject;
          approvalGroups1[0].roles.map((item) => {
            approvalsGroupList.push({
              id: 1,
              approver_group: item.approvalrole,
              onApprove,
              onReject,
              actioned_by: item.approvers,
              status: currentStatus,
              requested_time: datetime,
              action_time: "NA",
              reason: reason,
              approvalcategory: customFieldValue,
            });
          });
          approvalGroupsObject[0] = {
            status: statusValue1,
            value: approvalsGroupList,
          };
          getApprovalGroups.value = approvalGroupsObject;
          invoke("updateApprovalGroups", {
            approval: approvalGroupsObject,
          }).then((responsedata) => {});
        }
      }

      if (getApprovalGroups.value) {
        let result = [];
        let approvers = [];
        let approverdetails = [];
        if (getApprovalGroups.value.length > 0) {
          getApprovalGroups.value[0].value.map((data, j) => {
            data.actioned_by.map((role) => {
              if (approvers.indexOf(role) === -1) {
                approvers.push(role);
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
          });
        }
      }
      if (getApprovalGroups.value) {
        if (getApprovalGroups.value.length > 0) {
          setStatus(getApprovalGroups.value[0].status);
          setApprovalGroups(getApprovalGroups.value[0].value);
        }
      }
      if (getApprovalHistory.value) {
        setApprovalHistory(getApprovalHistory.value);
      }

      setLoading(false);
    })();
    return () => {};
  }, []);

  return (
    <div>
      <Flag
        icon={
          <InfoIcon
            label="Info"
            primaryColor={token("color.icon.information", B300)}
          />
        }
        id="1"
        key="1"
        title="Your esign Password has been expired"
        description="Reset your password using strong password requirements."
        actions={[
          { content: "Reset Password", onClick: resetPassword },
          { content: "Close", onClick: noop },
        ]}
      />
      {loading && (
        <CircularProgress
          size={40}
          left={-20}
          top={10}
          status={"loading"}
          style={{ marginLeft: "50%" }}
        />
      )}
      <EsignDialog
        isEsign={isEsign}
        action={action}
        reasonOptions={reasonOptions}
        onLoad={getSamlresponse}
        onSignOut={onSignOut}
        actionWorkflow={actionWorkflow}
        tempReason={tempReason}
        isSignout={isSignout}
        onSettempReason={setTempReason}
        onHideDialog={hideDialog}
        onPutApproval={putApproval}
      />
      {isComment && (
        <ReasonDialog
          isComment={isComment}
          action={action}
          onLoad={getSamlresponse}
          actionWorkflow={actionWorkflow}
          tempReason={tempReason}
          onPutComment={putComment}
          onHideDialog={hideDialog}
          onPutApproval={putApproval}
          loggedUser={loggedUser}
          inValidUserMessage={inValidUserMessage}
        />
      )}
      {isInfoDialog && (
        <InfoDialog
          onDeleteCategoryOpen={setIsInfoDialog}
          isInfoDialog={isInfoDialog}
          data={infoData}
          infoTitle={infoTitle}
        />
      )}
      {isresetPassword && (
        <ResetPassword
          loggedUser={loggedUser}
          userDetails={userData}
          isresetPassword={isresetPassword}
          inValidUserMessage={inValidUserMessage}
          onHideDialog={hideDialog}
          refreshList={refreshList}
        />
      )}
      {!loading &&
        (approvalGroups.length ? (
          <div
            className={
              approvalHistory.length > 0 ? "with-history" : "no-history"
            }
          >
            <TableContainer
              style={{
                marginTop: "15px",
              }}
              component={Paper}
            >
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell style={{ paddingLeft: 15 }}>
                      Group
                    </StyledTableCell>
                    <StyledTableCell>Approval </StyledTableCell>
                    <StyledTableCell>Requested Date</StyledTableCell>
                    <StyledTableCell>Action Date</StyledTableCell>
                    <StyledTableCell>Status </StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    {/* <TableCell component={"th"}>Approve/Reject </TableCell> */}
                  </TableRow>
                </TableHead>

                <TableBody style={{ border: 0 }}>
                  {approvalGroups &&
                    approvalGroups.length > 0 &&
                    approvalGroups.map((workflow) => (
                      <>
                        <StyledTableRow key={"approvalrole"} style={{}}>
                          <StyledTableCell style={{ paddingLeft: 15 }}>
                            {workflow.approver_group}
                          </StyledTableCell>

                          {workflow.status != "No longer required" ? (
                            <StyledTableCell>
                              {workflow.actioned_by_display_name && (
                                <span>{workflow.actioned_by_display_name}</span>
                              )}
                              <div>
                                {workflow.actioned_by &&
                                  !workflow.actioned_by_display_name && (
                                    <ul style={{ padding: 5 }}>
                                      {" "}
                                      {getApprovers(workflow.actioned_by).map(
                                        (user) => (
                                          <li>{user.name}</li>
                                        )
                                      )}
                                    </ul>
                                  )}
                              </div>
                            </StyledTableCell>
                          ) : (
                            <StyledTableCell>NA</StyledTableCell>
                          )}
                          <StyledTableCell>
                            {workflow.requested_time}
                          </StyledTableCell>
                          {workflow.status != "No longer required" ? (
                            <StyledTableCell>
                              {workflow.action_time}
                            </StyledTableCell>
                          ) : (
                            <StyledTableCell>NA</StyledTableCell>
                          )}
                          <StyledTableCell>
                            {workflow.status === "No longer required" && (
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
                          <StyledTableCell>
                            {" "}
                            {workflow.status === "Pending" &&
                              getApprovers(workflow.actioned_by).map((user) => {
                                return user.name === loggedUser.displayName ? (
                                  // <ButtonGroup>
                                  //   {transitions.map((trans) => (
                                  //     <Button onClick={() =>
                                  //       openDialog(trans.name, workflow)
                                  //     } appearance="primary" spacing="compact">
                                  //   {trans.name}
                                  // </Button>
                                  //   ))
                                  // }
                                  <>
                                    <IconButton
                                      title="Approve"
                                      onClick={() =>
                                        openDialog(
                                          "Approve",
                                          workflow,
                                          issueCreator
                                        )
                                      }
                                      style={{}}
                                    >
                                      <CheckIcon
                                        fontSize="small"
                                        style={{ color: "green" }}
                                      />
                                    </IconButton>
                                    <IconButton
                                      title="Reject"
                                      onClick={() =>
                                        openDialog(
                                          "Reject",
                                          workflow,
                                          issueCreator
                                        )
                                      }
                                      style={{}}
                                    >
                                      <ClearIcon
                                        fontSize="small"
                                        style={{ color: "red" }}
                                      />
                                    </IconButton>
                                  </>
                                ) : null;
                              })}{" "}
                          </StyledTableCell>
                        </StyledTableRow>
                        {workflow.status && workflow.status != "Pending" && (
                          <StyledTableRow>
                            <StyledTableCell style={{ paddingLeft: 15 }}>
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
                                  <span> No comments provided</span>
                                )}{" "}
                                <span>{workflow.comments}</span>
                              </div>
                            </StyledTableCell>
                          </StyledTableRow>
                        )}
                      </>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <div style={{ padding: 20 }}> {"No Data"}</div>
        ))}

      {approvalHistory && approvalHistory.length > 0 && (
        <ApprovalHistory
          approvalHistory={approvalHistory}
          onExpandRow={expandRow}
          onSetHistory={setApprovalHistory}
        />
      )}
    </div>
  );
}
