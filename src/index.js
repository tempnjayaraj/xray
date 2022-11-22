import Resolver from '@forge/resolver';
import API, { route, properties, fetch } from '@forge/api';
import * as Myconstants from "./appConstants";
import axios from 'axios';
import { storage } from '@forge/api';
const resolver = new Resolver();
//const context = useProductContext(); 
let key = "jira.user.name"
resolver.define("getLoggedUserDetails", async ({ payload, context }) => {
  let accountId = context.accountId;
  const response = await API.asApp().requestJira(route`/rest/api/3/user?accountId=${accountId}`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  const data = await response.json()
  // console.log(data);
  return data;
  
});
resolver.define('getUserRole', async (req) => {
  const response = await API.asApp().requestJira(route`/rest/api/3/mypreferences?key=${key}`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  const data = await response.json()

  return data;
});

resolver.define('getIssues', async (req) => {
  let projectId = req.context.extension.project.key;
  let jql = req.payload.jql;
  const response = await API.asApp().requestJira(route`/rest/api/3/search?jql=project=${projectId} and ${jql}`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  const data = await response.json()
  //const outputValue=JSON.stringify(data);

  return data
})
resolver.define('getStatusCategory', async (req) => {
  let projectId = req.context.extension.project.id
  const response2 = await API.asApp().requestJira(route`/rest/api/3/workflowscheme/project?projectId=${projectId}`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  const data2 = await response2.json();
  let workflowId = data2.values[0].workflowScheme.id;
  let issuetypeid = req.payload.issuetypeid

  const responseworkflow = await API.asApp().requestJira(route`/rest/api/3/workflowscheme/${workflowId}/issuetype/${issuetypeid}?expand=transitions`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  const dataworkflowsc = await responseworkflow.json();

  const responsetrans = await API.asApp().requestJira(route`/rest/api/3/workflow/search?workflowName=${dataworkflowsc.workflow}&expand=statuses,transitions`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  const responsetrans1 = await responsetrans.json();
  let responsestatuses = []
  let responsetransitions = []
  if (responsetrans1.values.length) {
    responsestatuses = responsetrans1.values[0].statuses
    responsetransitions = responsetrans1.values[0].transitions
  }
  let statuses = []
  if (responsestatuses.length) {
    responsestatuses.map((item) => {
      statuses.push({ label: item.name, value: item.name, id: item.id })
    })
  }
  let responseobject = { statuses, transitions: responsetransitions }

  return responseobject
})

resolver.define('getCurrentUserGroup', async (req) => {
  let accountId = req.payload.accountId;
  const response = await API.asApp().requestJira(route`/rest/api/2/user/groups?accountId=${accountId}`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  const data = await response.json()

  return data
})

resolver.define('getCurrenUserDetails', async (req) => {
  let projectId = req.context.extension.project.key
  const response = await API.asApp().requestJira(route`/rest/api/3/groupuserpicker?projectKey=${projectId}`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  const data = await response.json()

  return data
})


resolver.define('getApprovalCategories', async (req) => {
  let projectId = req.context.extension.project.key
  const response = await properties.onJiraProject(projectId).get('approvalcategories');

  return response

});
resolver.define('addApprovalCategory', async (req) => {
  let projectId = req.context.extension.project.key
  let data = req.payload
  const response = await properties.onJiraProject(projectId).set('approvalcategories', data);


  return response
});

resolver.define('updateApprovalWorkflow', async (req) => {
  let projectId = req.context.extension.project.key
  let data = req.payload
  const response = await properties.onJiraProject(projectId).set('approvalworkflow', data);

  return response
});

resolver.define('updateWorkflowTimeline', async (req) => {
  let projectId = req.context.extension.project.key
  let timelineData = req.payload.timeline;
  let timelineList = req.payload.timelineList;
  var approvalSettingTimeline = "workflow_timeline";
  const response = await properties.onJiraProject(projectId).set(approvalSettingTimeline, timelineData);

  // if(response.status ==200){
  //   console.log("success ")
  // }else{
  //  console.log("size exceed ");
  //  var dateTime = new Date();
  ///  dateTime = dateTime * 1;
  //   var approvalSettingTimeline = "workflow_timeline_"+dateTime;
  //  const response = await properties.onJiraProject(projectId).set(approvalSettingTimeline,data);
  // }
  let timelineObj = {};
  timelineObj.key = approvalSettingTimeline;
  if (timelineList.length) {
    const timelineListArr = timelineList.map((item) => item.key);
    if (!timelineListArr.includes(approvalSettingTimeline)) {
      timelineList.push(timelineObj);
      const timelineListRes = await properties.onJiraProject(projectId).set('workflowTimelineList', timelineList);
    }
  } else {
    timelineList.push(timelineObj);
    const timelineListRes = await properties.onJiraProject(projectId).set('workflowTimelineList', timelineList);
  }
  return true
});

resolver.define('getWorkflowTimeline', async (req) => {
  let propertyKey = req.payload.propertyKey
  let projectId = req.context.extension.project.key
  const response = await properties.onJiraProject(projectId).get(propertyKey);
  return response
});

resolver.define('getWorkflowTimelineList', async (req) => {
  let projectId = req.context.extension.project.key
  const response = await properties.onJiraProject(projectId).get('workflowTimelineList');
  return response
});

resolver.define('getAllWorkflowTimeline', async (req) => {
  let projectId = req.context.extension.project.key
  const timelineData = [];
  const timelineList = req.payload.inputVal;
  if (typeof (timelineList.length) !== 'undefined' && timelineList.length) {
    timelineList.map(async (propertyKey) => {

      let propertyKeyValue = propertyKey.key;


      const response = await properties.onJiraProject(projectId).get(propertyKeyValue);


      const prtyTimeline = response;
      prtyTimeline.map(async (timelineObj) => {
        timelineData.push("test");
      });

    });
  }

  return timelineData
});
resolver.define('getApprovalWorkflow', async (req) => {
  let projectId = req.context.extension.project.key
  const response = await properties.onJiraProject(projectId).get('approvalworkflow');

  return response
});

resolver.define('getIssueTypes', async (req) => {
  let projectId = req.context.extension.project.key
  const result = await API
    .asApp()
    .requestJira(
      route`/rest/api/3/project/${projectId}`
    );
  const data = await result.json();
  let issueTypes = []
  data.issueTypes.map(type => {
    //if(!type.subtask){
    issueTypes.push({ label: type.name, value: type.name, id: type.id })
    //}
  })
  //  const response = await properties.onJiraProject(projectId).get('issuetypes');

  return issueTypes
});

resolver.define('getUserSearch', async (req) => {
  let projectId = req.context.extension.project.key
  const result = await API
    .asApp()
    .requestJira(
      route`/rest/api/3/user/permission/search?permissions=${'TRANSITION_ISSUE'}&projectKey=${projectId}&startAt=0&maxResults=1000`
    );
  const data = await result.json()
  const actualUserList = data.filter((item) => item.accountType.includes('atlassian'));
  console.log("Output "+JSON.stringify(actualUserList));
  let users = []
  actualUserList.map((item) => {
    users.push({ id: item.accountId, type: 'user', name: item.displayName, avatarUrl: item.avatarUrls })
  })
  
  return users
});
resolver.define('getUserAccountId', async ({ payload, context }) => {
  let emailID = payload.emailID;
  const result = await API
    .asApp()
    .requestJira(
      route`/rest/api/3/user/search?query=${emailID}`
    );
  const data = await result.json()
  const actualUserList = data.filter((item) => item.accountType.includes('atlassian'));
  console.log("Output "+JSON.stringify(actualUserList));
  let users = []
  actualUserList.map((item) => {
    users.push({ id: item.accountId, type: 'user', name: item.displayName, avatarUrl: item.avatarUrls })
  })
  
  return users
});
resolver.define('getUserDetails', async (req) => {
  let projectId = req.context.extension.project.key
  let approvers = req.payload.approvers
  const result = await API
    .asApp()
    .requestJira(
      route(decodeURIComponent(`/rest/api/3/user/bulk?accountId=${approvers}&startAt=0&maxResults=1000`))
    );

  const data = await result.json()
  return data
});
resolver.define('getIssueTransitions', async (req) => {
  let issueID = req.context.extension.issue.id;
  let issueType = req.context.extension.issue.type;
  const response = await API.asApp().requestJira(route`/rest/api/3/issue/${issueID}/transitions`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  const data = await response.json()
  return data
});
resolver.define('getIssueDetails', async (req) => {
  let issueID = req.context.extension.issue.id;
  const result = await API
    .asApp()
    .requestJira(
      route`/rest/api/2/issue/${issueID}?fields=*all&expand=operations,schema`);

  const data = await result.json()
  const outputValue = JSON.stringify(data);
  return data
});



resolver.define('getCustomfields', async (req) => {

  const result = await API
    .asApp()
    .requestJira(
      route`/rest/api/3/field`);

  const data = await result.json()

  return data
})


resolver.define('getApprovalGroups', async (req) => {
  let issueID;
  req.payload.id ? issueID = req.payload.id : issueID = req.context.extension.issue.id;


  let propertyKey = 'approval';
  const result = await API
    .asApp()
    .requestJira(
      route`/rest/api/2/issue/${issueID}/properties/${propertyKey}`);

  const data = await result.json()


  return data
})

resolver.define('getApprovalGroupsByIsssue', async (req) => {
  let issueID = req.payload.id


  let propertyKey = 'approval';
  const result = await API
    .asApp()
    .requestJira(
      route`/rest/api/2/issue/${issueID}/properties/${propertyKey}`);

  const data = await result.json()

  return data
})

resolver.define("updateApprovalGroups", async ({ payload, context }) => {
  let issueID = context.extension.issue.id;
  let propertyKey = 'approval';
  const response = await API.asApp().requestJira(route`/rest/api/3/issue/${issueID}/properties/${propertyKey}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload.approval)
  });

})

resolver.define("updateApprovalGroupsByissue", async ({ payload, context }) => {
  let issueID = payload.id;
  let propertyKey = 'approval';
  const response = await API.asApp().requestJira(route`/rest/api/3/issue/${issueID}/properties/${propertyKey}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload.approval)
  });

})


resolver.define("getUserGroups", async ({ payload, context }) => {

  let accountId = context.accountId;
  const result = await API
    .asApp()
    .requestJira(
      route`/rest/api/3/user/groups?accountId=${accountId}`);

  const data = await result.json()


  return data
})

resolver.define("getWorkflows", async ({ payload, context }) => {
  let name = "WorkflowValidator"
  const response = await API.asApp().requestJira(route`/rest/api/3/workflowscheme/10001/workflow?workflowName=${name}`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  const data = await response.json()


  return data
})

resolver.define("getWorkflowsScheme", async ({ payload, context }) => {


  const response = await API.asApp().requestJira(route`/rest/api/3/workflowscheme`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  const data = await response.json()


  return data
})
resolver.define("getTransition", async ({ payload, context }) => {
  let issueID = context.extension.issue.id;
  const response = await API.asApp().requestJira(route`/rest/api/3/issue/${issueID}/transitions`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  const data = await response.json()
  return data
})
resolver.define("putTransition", async (req) => {
  let issueID = req.context.extension.issue.id;
  let bodyData = {};
  bodyData = {
    "transition": {
      "id": req.payload.transition[0].id
    }
  };
  const response = await API.asApp().requestJira(route`/rest/api/3/issue/${issueID}/transitions?expand=transitions.fields`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyData)
  });

})


resolver.define("updateApprovalHistory", async ({ payload, context }) => {
  let issueID = context.extension.issue.id;
  let propertyKey = 'history';
  const response = await API.asApp().requestJira(route`/rest/api/3/issue/${issueID}/properties/${propertyKey}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload.history)
  });

})

resolver.define('getApprovalHistory', async (req) => {
  let issueID = req.context.extension.issue.id


  let propertyKey = 'history';
  const result = await API
    .asApp()
    .requestJira(
      route`/rest/api/2/issue/${issueID}/properties/${propertyKey}`);

  const data = await result.json()
  return data
})

export const run = async ({ issue }) => {
  let propertyKey = 'approval';
  let issueID = issue.id;
  let approversApproved = true;
  const result = await API
    .asApp()
    .requestJira(
      route`/rest/api/2/issue/${issueID}/properties/${propertyKey}`);

  const data = await result.json();
  //if(data &&data.value){
  let approversList = [];
  approversList = data.value;
  if (typeof (approversList) !== 'undefined' && approversList.length > 0) {
    let tempApprovals = [];
    tempApprovals = approversList.filter((group) => {
      if (group.status != "Approved") {
        approversApproved = false;
      }
    });
  }
  //}
  let errorContent = Myconstants.ISSUES_IS_APPROVED;
  return {
    result: approversApproved,
    errorMessage: errorContent
  };
};

export const categoryValidate = async ({ issue }) => {
  let categoryIsEmpty = false;
  let customFieldID;
  let customFieldValue;
  const result = await API
    .asApp()
    .requestJira(
      route`/rest/api/3/field`);

  const CustomFields = await result.json()
  const customFieldsValue = CustomFields.filter((item) => item.key.includes('approval-category-custom-field'))
  if (customFieldsValue.length) {
    customFieldID = customFieldsValue[0].id;
  }

  let issueID = issue.id;
  const IssueDetailsresponse = await API
    .asApp()
    .requestJira(
      route`/rest/api/2/issue/${issueID}?fields=*all&expand=operations,schema`);

  const issueDetails = await IssueDetailsresponse.json()
  if (customFieldID) {
    customFieldValue = issueDetails.fields[customFieldID];
    if (customFieldValue != null) {
      categoryIsEmpty = true;
    }
  }
  let errorContent = Myconstants.APPROVAL_CATEGORY_EMPTY_ERROR;
  return {
    result: categoryIsEmpty,
    errorMessage: errorContent
  };

};
export const testcaseValidator = async ({ issue, req }) => {
  let issueID = issue.id;
  let validated = true;
  let errorContent = "";
  const result = await API
    .asApp()
    .requestJira(
      route`/rest/api/2/issue/${issueID}?fields=*all&expand=operations,schema`);

  const issueDetails = await result.json();
  let issueType = issueDetails.fields.issuetype.name;
  if (issueType == "Test Execution") {

    let clientID = Myconstants.XRAY_CLIENT_ID;
    let clientSecret = Myconstants.XRAY_CLIENT_SECRET;
    let authURL = Myconstants.XRAY_AUTHENTICATE_URL;
    let getTestsURL = Myconstants.XRAY_GETTESTS_FROM_EXECUTION_URL;
    const xrayAuthResponse = await fetch(`${authURL}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'client_id': `${clientID}`,
        'client_secret': `${clientSecret}`
      })
    });
    const tokenValue = await xrayAuthResponse.json();
    const getTestResponse = await fetch(`${getTestsURL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenValue}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query:
          `{
            getTestExecution(issueId: "${issueID}") {
                issueId
                tests(limit: 100) {
                    total
                    start
                    limit
                    results {
                        issueId
                        testType {
                            name
                        }
                    }
                }
            }
        }`

      })
    });
    const getTestResponseData = await getTestResponse.json();
    const issueIDList = getTestResponseData.data.getTestExecution.tests.results;
    var issueIds = issueIDList.map(function (item) {
      return item.issueId;
    }).join(',');
    let jql =
      " id in (" + issueIds + ") and status != 'Completed'";

    const response = await API.asApp().requestJira(route`/rest/api/3/search?jql=${jql}&fields=summary&startAt=0&maxResults=1000`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const jqlResponse = await response.json();
    const issuesList = jqlResponse.issues;

    if (issuesList.length > 0) {
      validated = false;
      errorContent = Myconstants.XRAY_NOT_APPROVED_TEST;
    }
  }


  return {
    result: validated,
    errorMessage: errorContent
  };

}

  
  // resolver.define('getSamlADResponse', async (req) => {
  //   let userName = req.payload.username;
  //   let passWord = req.payload.password;
  //   let result;
  //   const url= 'https://externalauth-1663003440810.azurewebsites.net/AuthClass';
  //   const data={"name": userName,"pwd": passWord}
  //   await axios.post(url, data, {
  //     headers: {
  //       "Accept": "application/json",
  //       "Content-Type": "application/json;charset=UTF-8"
  //       },
  //     }).then(({data}) => {
  //       //console.log(data);
  //       result=data;
  //     });
    

  //   return result;
  // })
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
  resolver.define('addUserInStorage', async (req) => {
  console.log("Inside add user");
  const getUserData = [];
  const userData = {};
  userData.username = req.payload.username;
  userData.secretValue = req.payload.password;
  var currentdate = new Date();
  var datetime = formatAMPM(currentdate);
  userData.updated_on=datetime;
  userData.updated_by=req.payload.updated_by;
  const getUserData1 = await storage.get('userData');
  var userExists = true;
  console.log("User Details "+JSON.stringify(getUserData1));
  if (typeof(getUserData1) !== 'undefined') {
    var userDetails = getUserData1.filter((item) =>
      item.username.includes(req.payload.username)
    );
    var message = 'User added successfully to eSign';
    userDetails.map((user) => {
      if (user.username === req.payload.username) {
        userExists = false;
        message = 'User already exists';
      }
    }
    )
    getUserData1.map((userObject) => {
      getUserData.push(userObject);
    })
  }


  if (userExists) {
    getUserData.push(userData);
    await storage.set('userData', getUserData);
  }
  const returnData = {};
  returnData.success = userExists;
  returnData.displayMessage = message;
  return returnData;
})
resolver.define('getUserList', async () => {
  const getUserData = await storage.get('userData');
  return getUserData;
});
resolver.define('setUserList', async (req) => {
  var currentdate = new Date();
  var datetime = formatAMPM(currentdate);
  req.payload.updated_on=datetime;
  await storage.set('userData', req.payload);

});
  resolver.define('getUserStorageDetails', async (req) => {
    
   var username = req.payload.username;
    const getUserData = await storage.get('userData');
    var userDetails = getUserData.filter((item) => 
    item.username.includes(username)
    );
    
    return userDetails;
  });

export const handler = resolver.getDefinitions();

