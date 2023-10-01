function userCode() {
    let statusRel ={
      'to-do':"TO DO🎯",
      'work-in-progress':"WORK IN PROGRESS🕒",
      'under-review':"UNDER REVIEW📝",
      'completed':"COMPLETED🎉"
    }
       const id = {{request.body.id}}
      const taskName = {{request.body.title}}
      const taskNewStatus = {{request.body.status}}
      const taskPrevStatus = {{request.body.previous}}  
     const msg = `#Board-${id}, *${taskName}* has been moved from *${statusRel[taskPrevStatus]}* to *${statusRel[taskNewStatus]}*`;
     fetch(
      "https://hooks.slack.com/services/<YOUR-WEBHOOK-ID>",
      {
        method: "POST",
        body: JSON.stringify({ text: msg }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
  }
  