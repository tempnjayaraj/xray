import React, { useEffect, useState } from 'react';
import { invoke, requestJira, view } from '@forge/bridge';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApprovalSettings from './components/approvalSettings/ApprovalSettings'

import './App.css'
import ApprovalCategory from './components/customFields/ApprovalCategory';
import ApprovalGroups from './components/ApprovalGroups/ApprovalGroups';
import UserGlobalPage from './components/GlobalPage/UserGlobalPage';


function App() {
    const [context, setContext] = useState({});
    const [isDetectingContext, setDetectingContext] = useState(true);
  
    useEffect(() => {
      setDetectingContext(true);
  
      // Use the "view" from Forge Bridge to get the context
      // where this React app is running
      view.getContext()
        .then(setContext)
        .finally(() => setDetectingContext(false));
    }, []);
  
    if (isDetectingContext) {
      return <div>Detecting context...</div>;
    }

     // Detect the module which calling this React app,
  // and render the content for that
  switch (context.moduleKey) {
    case 'approval-custom-ui':
      // Render and "AdminPage" if we are in module "admin-page"
      return <ApprovalSettings />;
    case 'issue-custom-ui-hello-world-panel':
      // Render and "IssuePanel" if we are in module "issue-panel"
      return <ApprovalGroups/>;
    case 'approval-category-custom-field':
      return <ApprovalCategory/>   
     
        case 'esign-user-management':
          return <UserGlobalPage/> 
    default:
      return <div>Cannot Detect Context</div>;
  }
  
    // const [data1, setData] = useState(null);
    // const [data2, setWorkflowData] = useState(null)
    // const [data3, setIssueTypes] = useState(null)
  //  const context = useProductContext();  

    

//     useEffect(() => {
//    //     console.log(context)
//         // if(context.platformContext.projectKey){
//         //     invoke('getText', { example: context.platformContext.projectKey }).then(setData);
//         // }else{
//             invoke('getApprovalCategories', { example: 'context' }).then(data1 => {
              
               
//                 setData(data1)
               
//                // const dataresponse = fetchApprovalCategoriesForProject(data)

//                // console.log(dataresponse)
        
//         });
//           invoke('getApprovalWorkflow', { example: 'context' }).then(data2 => {
           
//             setWorkflowData(data2)
//         })
//         invoke('getIssueTypes').then(data3 => {
//             setIssueTypes(data3)
//         })
       
//     }, []);

   
}

export default App;
