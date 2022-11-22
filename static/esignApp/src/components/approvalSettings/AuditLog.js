//import React, { useContext, useRef, useEffect, Fragment } from "react";
import { invoke } from "@forge/bridge";
import async from "react-select/async";
export const updateTimeline = async (timelineObj) => {
    var timeline =[];
       var timelineList = [];
       timelineList = await invoke("getWorkflowTimelineList");
       if(!Array.isArray(timelineList)){
        timelineList = [];
       }
     
      if(typeof(timelineList.length) !== 'undefined' && timelineList.length){
        const timelineListObj = timelineList[timelineList.length -1];
        let lastestPropertyKey = timelineListObj.key;
            await invoke("getWorkflowTimeline", { propertyKey: lastestPropertyKey}).then(
            (responsedata) => {
             responsedata.push(timelineObj);
              timeline = responsedata;
           }
          );
      
         
      }else{
        timeline.push(timelineObj); 
      }
      var updateTimeArugs = {};
      updateTimeArugs.timeline = timeline;
      updateTimeArugs.timelineList = timelineList;
      var timelineUpdate = await invoke ("updateWorkflowTimeline",updateTimeArugs);
return true;

}

export const getAllWorkflowTimeline = async () =>{
    const timelineListVal = await invoke("getWorkflowTimelineList");
     
     const timelineData = [];
     if(typeof(timelineListVal.length) !== 'undefined' && timelineListVal.length){
       timelineListVal.map(async (propertyKey) => {
         let propertyKeyValue = propertyKey.key;
         const responsedataValue = await invoke("getWorkflowTimeline",{ propertyKey: propertyKeyValue});
              const prtyTimeline = responsedataValue;
               prtyTimeline.map((timelineObj) => {
               timelineData.push(timelineObj);
              });       
                 
       });
     }
return timelineData;
}


