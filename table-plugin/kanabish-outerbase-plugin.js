// var privileges = ["tableValue", "configuration"];
var observableAttributes = [
  // The value of the cell that the plugin is being rendered in
  "cellvalue",
  // The value of the row that the plugin is being rendered in
  "rowvalue",
  // The value of the table that the plugin is being rendered in
  "tablevalue",
  // The schema of the table that the plugin is being rendered in
  "tableschemavalue",
  // The schema of the database that the plugin is being rendered in
  "databaseschemavalue",
  // The configuration object that the user specified when installing the plugin
  "configuration",
  // Additional information about the view such as count, page and offset.
  "metadata",
];

var OuterbaseEvent = {
  // The user has triggered an action to save updates
  onSave: "onSave",
  // The user has triggered an action to configure the plugin
  configurePlugin: "configurePlugin",
};

var OuterbaseColumnEvent = {
  // The user has began editing the selected cell
  onEdit: "onEdit",
  // Stops editing a cells editor popup view and accept the changes
  onStopEdit: "onStopEdit",
  // Stops editing a cells editor popup view and prevent persisting the changes
  onCancelEdit: "onCancelEdit",
  // Updates the cells value with the provided value
  updateCell: "updateCell",
};

var OuterbaseTableEvent = {
  // Updates the value of a row with the provided JSON value
  updateRow: "updateRow",
  // Deletes an entire row with the provided JSON value
  deleteRow: "deleteRow",
  // Creates a new row with the provided JSON value
  createRow: "createRow",
  // Performs an action to get the next page of results, if they exist
  getNextPage: "getNextPage",
  // Performs an action to get the previous page of results, if they exist
  getPreviousPage: "getPreviousPage",
};

class OuterbasePluginConfig_$PLUGIN_ID {
  count = 0;
  limit = 0;
  offset = 0;
  page = 0;
  pageCount = 0;
  theme = "light";

  tableValue = undefined;
  taskId = undefined;
  taskName = undefined;
  taskDesc = undefined;
  taskDueDate = undefined;
  taskAssignedName = undefined;
  taskPriority = undefined;
  taskProjectTag = undefined;
  taskStatus = undefined;
  taskDocLink = undefined;

  constructor(object) {
    this.taskId = object?.taskId;
    this.taskName = object?.taskName;
    this.taskDesc = object?.taskDesc;
    this.taskDueDate = object?.taskDueDate;
    this.taskAssignedName = object?.taskAssignedName;
    this.taskPriority = object?.taskPriority;
    this.taskProjectTag = object?.taskProjectTag;
    this.taskStatus = object?.taskStatus;
    this.taskDocLink = object?.taskDocLink;
  }

  toJSON() {
    return {
      taskId: this.taskId,
      taskName: this.taskName,
      taskDesc: this.taskDesc,
      taskDueDate: this.taskDueDate,
      taskAssignedName: this.taskAssignedName,
      taskPriority: this.taskPriority,
      taskProjectTag: this.taskProjectTag,
      taskStatus: this.taskStatus,
      taskDocLink: this.taskDocLink,
    };
  }
}
var triggerEvent = (fromClass, data) => {
  console.log(data);
  const event = new CustomEvent("custom-change", {
    detail: data,
    bubbles: true,
    composed: true,
  });

  fromClass.dispatchEvent(event);
};

var decodeAttributeByName = (fromClass, name) => {
  const encodedJSON = fromClass.getAttribute(name);
  const decodedJSON = encodedJSON
    ?.replace(/&quot;/g, '"')
    ?.replace(/&#39;/g, "'");
  return decodedJSON ? JSON.parse(decodedJSON) : {};
};

var templateTable = document.createElement("template");
templateTable.innerHTML = `
  <style>
  h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p,
        span,
        a {
          margin: 0;
          padding: 0;
        }
        a:visited {
          color: black;
        }
        button {
          outline: none;
          background-color: transparent;
          border: none;
          cursor: pointer;
          margin: 0;
        }
        #container {
          min-width: 100%;
          height: 100%;
          overflow: auto;
        }
        #container-overflow {
          position: relative;
          padding: 20px;
        }
        #heading {
          font-weight: 700;
          font-size: 24px;
        }
        .all-boards {
          margin-top: 20px;
          width: "100%";
          display: flex;
          gap: 30px;
        }
        .board {
          min-width: 200px;
          width: 320px;
        }
        .board-header {
          border-bottom: 2px solid #eeeeee;
          padding-bottom: 7px;
          display: flex;
          justify-content: space-between;
        }
        .label {
          padding: 6px 12px;
          width: fit-content;
          border-radius: 5px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(210, 80, 80, 1);
  
          background-color: rgba(210, 80, 80, 0.2);
        }
        .attention-label {
          padding: 2px 8px;
          width: fit-content;
          border-radius: 5px;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          // color: rgba(210, 80, 80, 1);
          background-color: rgba(210, 80, 80, 0.2);
        }
        .board-body {
          background-color: #f9f9f9;
          height: fit-content;
          margin-top: 20px;
          border-radius: 15px;
          border: 1px solid #eeeeee;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .board-card {
          cursor: grabbing;
          min-height: 100px;
          height: fit-content;
          background-color: #ffffff;
          padding: 15px;
          border-radius: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border: 1px solid #eeeeee;
          transition: 0.3s ease;
        }
        .board-card:hover {
          border: 1px solid #d0d0d0;
        }
        .labels {
          display: flex;
          gap: 10px;
        }
        .board-title {
          font-size: 16px;
          font-weight: 500;
        }
        .board-desc {
          font-size: 14px;
          font-weight: 300;
        }
        .assigned-to {
          display: flex;
          width: 100%;
          flex-direction: row;
          gap: 5px;
          align-items: center;
          flex: 1;
        }
        .assigned-profile {
          height: 20px;
          width: 22px;
          border-radius: 50px;
          background-color: #a27bfa;
          overflow: hidden;
        }
        .assigned-name {
          width: 100%;
          font-size: 12px;
          font-weight: 500;
        }
        .due-date {
          /* flex: 1; */
          color: #5e5d61;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .due-icon {
          stroke: #5e5d61;
        }
        #add-task-button {
          padding: 20px 0;
          background-color: #ffffff;
          padding: 15px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #eeeeee;
        }
        .creator {
          color: #5e5d61;
          font-size: 12px;
          display: flex;
          gap: 5px;
        }
        .board-card-top {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .board-card-head {
          display: flex;
          justify-content: space-between;
          align-content: center;
        }
        .menu-button {
          padding: 0;
        }
        .board-card-bottom {
          display: flex;
          justify-content: space-between;
        }
        .document-link {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 14px;
          text-decoration: underline;
          cursor: pointer;
          color: #5e5d61;
          width: fit-content;
        }
        .sheet {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          /* min-height: 700px; */
          background-color: rgba(0, 0, 0, 0.3);
          display: none;
        }
        .sheet-main {
          width: 350px;
          padding: 20px;
          height: 100%;
          background-color: white;
          position: absolute;
          left: 0;
          top: 0;
        }
        .sheet-head {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .form-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        label {
          color: black;
          font-size: 16px;
        }
        input,
        textarea,
        select {
          outline: none;
          min-width: 150px;
          max-width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: 2px solid #eef0f4;
          color: #00000E;
        }
        input::placeholder {
          color: #6a7181;
        }
        .form-flex {
          display: flex;
          gap: 10px;
        }
        .sheet-body {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        #submit-button {
          padding: 10px 20px;
          background-color: black;
          color: white;
          font-size: 16px;
          font-weight: 500;
          border-radius: 10px;
          width: fit-content;
          align-self: flex-end;
        }
  </style>
  <div id="container">
  
  </div>
  `;

class OuterbasePluginTable_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes() {
    return observableAttributes;
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID({});

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateTable.content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      decodeAttributeByName(this, "configuration")
    );
    this.config.tableValue = decodeAttributeByName(this, "tableValue");

    let metadata = decodeAttributeByName(this, "metadata");
    this.config.count = metadata?.count;
    this.config.limit = metadata?.limit;
    this.config.offset = metadata?.offset;
    this.config.theme = metadata?.theme;
    this.config.page = metadata?.page;
    this.config.pageCount = metadata?.pageCount;

    this.render();
  }

  render() {
    function getCard(
      id,
      name,
      desc,
      status,
      description,
      doc_link,
      due_date,
      priority,
      project_tag,
      assigned_to
    ) {
      let priorityTags = {
        Low: {
          tag: "Low 🏖️",
          color: "rgba(75, 75, 255, 1)",
          bgColor: "rgba(75, 75, 255, 0.1)",
        },
        Medium: {
          tag: "Medium 🕹️",
          color: "rgba(255, 167, 0, 1)",
          bgColor: "rgba(255, 167, 0, 0.1)",
        },
        High: {
          tag: "High 🔥",
          color: "rgba(255, 61, 61, 1)",
          bgColor: "rgba(255, 61, 61, 0.1)",
        },
      };
      return `<div class="board-card" draggable="true" id="task${id}" data-pkid="${id}">
        <div class="board-card-head">
          <div class="labels">
          <h5 class="attention-label" style="color:${
            priorityTags[priority].color
          };background-color:${priorityTags[priority].bgColor};">${
        priorityTags[priority].tag
      }</h5>
          <h5 class="attention-label" style="color:rgba(38, 87, 72, 1);background-color:rgba(38, 87, 72, 0.1);">${project_tag}</h5>
          </div>
          <button class="menu-button" id="delete-button">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.25 5.25L13.5995 14.3569C13.5434 15.1418 12.8903 15.75 12.1033 15.75H5.89668C5.10972 15.75 4.45656 15.1418 4.40049 14.3569L3.75 5.25M7.5 8.25V12.75M10.5 8.25V12.75M11.25 5.25V3C11.25 2.58579 10.9142 2.25 10.5 2.25H7.5C7.08579 2.25 6.75 2.58579 6.75 3V5.25M3 5.25H15" stroke="#BF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>        
          </button>
        </div>
        <div class="board-card-top">
          <h1 class="board-title">${name}</h1>
          <!-- <div class="creator">
            <p>24, oct</p>
            |
            <p>Created by amit shah</p>
          </div> -->
          <h1 class="board-desc">
          ${description}
          </h1>
        </div>
        <a class="document-link" href="${doc_link}" target="_blank">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.625 7.5H9.375M5.625 10H9.375M10.625 13.125H4.375C3.68464 13.125 3.125 12.5654 3.125 11.875V3.125C3.125 2.43464 3.68464 1.875 4.375 1.875H7.86612C8.03188 1.875 8.19085 1.94085 8.30806 2.05806L11.6919 5.44194C11.8092 5.55915 11.875 5.71812 11.875 5.88388V11.875C11.875 12.5654 11.3154 13.125 10.625 13.125Z"
              stroke="black"
              stroke-width="1.25"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Document Link</span>
        </a>
        <div class="board-card-bottom">
          <div class="assigned-to">
            <div class="assigned-profile">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
                alt=""
                style="height: 100%; width: 100%; object-fit: contain"
              />
            </div>
            <p class="assigned-name">${assigned_to}</p>
          </div>
          <div class="due-date">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                class="due-icon"
                d="M10 6.66667V10L12.5 12.5M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                stroke="black"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p>Due on ${new Date(due_date).toLocaleDateString("en-US", {
              timeZone: "Asia/Kolkata",
              dateStyle: "medium",
            })}</p>
          </div>
        </div>
      </div>`;
    }
    const boards = [
      {
        name: "TO DO 🎯",
        id: "to-do",
        color: "rgba(121, 121, 255, 1)",
        bgcolor: "rgba(121, 121, 255,0.1)",
      },
      {
        name: "WORK IN PROGRESS🕒",
        id: "work-in-progress",
        color: "rgba(255, 63, 63, 1)",
        bgcolor: "rgba(255, 63, 63, 0.1)",
      },
      {
        name: "UNDER REVIEW📝",
        id: "under-review",
        color: "rgba(255, 167, 0, 1)",
        bgcolor: "rgba(255, 167, 0, 0.1)",
      },
      {
        name: "COMPLETED🎉",
        id: "completed",
        color: "rgba(29, 116, 85, 1)",
        bgcolor: "rgba(29, 116, 85, 0.1)",
      },
    ];
    this.shadow.querySelector("#container").innerHTML = `
      <div id="container-overflow">
    <h1 id="heading">Kanban Board</h1>
    <div class="all-boards" id="all-boards">
    ${boards
      .map(
        (board) => `<div class="board" data-status=${board.id}>
    <div class="board-header">
      <h5
        class="label"
        style="
          color: ${board.color};
          background-color: ${board.bgcolor};
        "
      >
       ${board.name}
      </h5>
      <button class="menu-button">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.99996 4.16665V4.17498M9.99996 9.99998V10.0083M9.99996 15.8333V15.8416M9.99996 4.99998C9.53971 4.99998 9.16663 4.62688 9.16663 4.16665C9.16663 3.70641 9.53971 3.33331 9.99996 3.33331C10.4602 3.33331 10.8333 3.70641 10.8333 4.16665C10.8333 4.62688 10.4602 4.99998 9.99996 4.99998ZM9.99996 10.8333C9.53971 10.8333 9.16663 10.4602 9.16663 9.99998C9.16663 9.53973 9.53971 9.16665 9.99996 9.16665C10.4602 9.16665 10.8333 9.53973 10.8333 9.99998C10.8333 10.4602 10.4602 10.8333 9.99996 10.8333ZM9.99996 16.6666C9.53971 16.6666 9.16663 16.2936 9.16663 15.8333C9.16663 15.3731 9.53971 15 9.99996 15C10.4602 15 10.8333 15.3731 10.8333 15.8333C10.8333 16.2936 10.4602 16.6666 9.99996 16.6666Z"
            stroke="black"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    <div
      class="board-body"
      style="background-color: ${board.bgcolor};"
    >
      ${
        this.config.tableValue &&
        this.config.tableValue
          .map(
            (
              {
                id,
                name,
                desc,
                status,
                description,
                doc_link,
                due_date,
                priority,
                project_tag,
                assigned_to,
              },
              index
            ) => {
              if (status === board.id)
                return getCard(
                  id,
                  name,
                  desc,
                  status,
                  description,
                  doc_link,
                  due_date,
                  priority,
                  project_tag,
                  assigned_to
                );
            }
          )
          .join("")
      }
      <button id="add-task-button">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 3.33331V16.6666M16.6667 9.99998L3.33337 9.99998"
            stroke="black"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Add entry</span>
      </button>
    </div>
  </div>
    `
      )
      .join("")}
  </div>
    </div>
    <div class="sheet">
      <div class="sheet-main">
        <div class="sheet-head">
          <h1 id="heading">Add Entry</h1>
          <button id="sheet-close">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 15L15 5M5 5L15 15"
                stroke="black"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
  
        <div class="sheet-body" id="add-entry-form">
          <div class="form-item">
            <label>Task Name</label>
            <input type="text" id="task-name" placeholder="create Ui" />
          </div>
          <div class="form-flex">
            <div class="form-item">
              <label>Assign to </label>
              <input
                type="text"
                id="task-assined-name"
                placeholder="john doe"
              />
            </div>
            <div class="form-item">
              <label>Due Date</label>
              <input type="date" id="task-due-date" />
            </div>
          </div>
          <div class="form-item">
            <label>Document Link</label>
            <input
              type="text"
              id="task-doc-link"
              placeholder="https://www.figma.com"
            />
          </div>
          <div class="form-flex">
            <div class="form-item">
              <label>Project </label>
              <input
                type="text"
                id="task-project-tag"
                placeholder="UI Design"
              />
            </div>
            <div class="form-item">
              <label>Priority</label>
              <select id="task-priority">
                <option name="high" id="">High</option>
                <option name="medium" id="">Medium</option>
                <option name="low" id="">Low</option>
              </select>
            </div>
          </div>
          <div class="form-item">
            <label>Description</label>
            <textarea
              rows="4"
              cols="20"
              id="task-desc"
              placeholder="type something"
            ></textarea>
          </div>
          <button id="submit-button" >Submit</button>
        </div>
      </div>
    </div>
      `;

    let kanbanBlock = this.shadow.querySelectorAll(".board-body");
    kanbanBlock.forEach((el) => {
      el.addEventListener("drop", (ev) => {
        drop(ev, this.shadow);
      });
      el.addEventListener("dragover", allowDrop);
    });

    let tasks = this.shadow.querySelectorAll(".board-card");
    tasks.forEach((el) => {
      el.addEventListener("dragstart", drag);
    });

    function drag(ev) {
      console.log(ev);
      ev.dataTransfer.setData("text", ev.target.id);
      ev.dataTransfer.setData("pkid", ev.target.dataset.pkid);
      ev.dataTransfer.setData(
        "prevStatus",
        ev.srcElement.parentNode.parentNode.dataset.status
      );
      ev.dataTransfer.setData(
        "title",
        ev.srcElement.childNodes[3].childNodes[1].innerText
      );
    }

    function allowDrop(ev) {
      ev.preventDefault();
    }

    function drop(ev, shadow) {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");
      var pkid = ev.dataTransfer.getData("pkid");
      var title = ev.dataTransfer.getData("title");
      var prevStatus = ev.dataTransfer.getData("prevStatus");

      const status = ev.currentTarget.parentNode.dataset.status;
      if (pkid && title && prevStatus !== status) {
        updateTaskStatus(pkid, status, prevStatus, title);
      }
      ev.currentTarget.insertBefore(
        shadow.querySelector(`#${data}`),
        ev.currentTarget.children[0]
      );
    }
    function updateTaskStatus(id, status, previous, title) {
      try {
        const data = {
          id,
          status,
          title,
          previous,
        };
        let res = fetch(
          "https://polite-aquamarine.cmd.outerbase.io/update-status",
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
    let status = undefined;
    this.shadow.querySelectorAll("#add-task-button").forEach((el) => {
      el.addEventListener("click", () => {
        this.shadow.querySelector(".sheet").style.display = "block";
        status = el.parentNode.parentNode.dataset.status;
      });
    });

    this.shadow.querySelector("#sheet-close").addEventListener("click", () => {
      this.shadow.querySelector(".sheet").style.display = "none";
      status = undefined;
    });

    this.shadow.querySelectorAll("#delete-button").forEach((el) => {
      el.addEventListener("click", () => {
        let id = el.parentNode.parentNode.dataset.pkid;
        this.config.tableValue = this.config.tableValue.filter(
          (d) => d.id !== id
        );
        let d = {
          id,
        };
        fetch("https://polite-aquamarine.cmd.outerbase.io/delete-task", {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(d),
        });
        this.render();
      });
    });

    var creatTask = this.shadow.getElementById("submit-button");

    creatTask.addEventListener("click", () => {
      const taskName = this.shadow
        .querySelector("#task-name")
        .value.toUpperCase();
      const taskAssignedName =
        this.shadow.querySelector("#task-assined-name").value;
      const taskDueDate = this.shadow.querySelector("#task-due-date").value;
      const taskDocLink = this.shadow.querySelector("#task-doc-link").value;
      const taskProjectTag =
        this.shadow.querySelector("#task-project-tag").value;
      const taskPriority = this.shadow.querySelector("#task-priority").value;
      const taskDesc = this.shadow.querySelector("#task-desc").value;
      if (
        Boolean(taskName) &&
        Boolean(taskAssignedName) &&
        Boolean(taskDueDate) &&
        Boolean(taskProjectTag) &&
        Boolean(taskPriority) &&
        Boolean(taskDesc) &&
        status
      ) {
        let row = {
          assigned_to: taskAssignedName,
          description: taskDesc,
          doc_link: taskDocLink,
          due_date: taskDueDate,
          id: String(this.config.tableValue.length + 1),
          name: taskName,
          priority: taskPriority,
          project_tag: taskProjectTag,
          status: status,
        };
        this.config.tableValue.push(row);
        fetch("https://polite-aquamarine.cmd.outerbase.io/create-task", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(row),
        });
        this.render();
        // triggerEvent(this,{
        //   action: OuterbaseTableEvent.createRow,
        //   value: row,
        // });
      }
    });
  }
}

var templateConfiguration = document.createElement("template");
templateConfiguration.innerHTML = `
<style>
h1,
h2,
h3,
h4,
h5,
h6,
p,
span,
a {
  margin: 0;
  padding: 0;
}
#configuration-container {
  display: flex;
  height: 100%;
  overflow-y: scroll;
  padding: 25px;
  gap: 20px;
}
button {
  outline: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin: 0;
}
.form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
label {
  color: black;
  font-size: 16px;
}
input,
textarea,
select {
  outline: none;
  width: 180px;
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #eef0f4;
  color: #00000e;
}
input::placeholder {
  color: #6a7181;
}
.form-flex {
  display: flex;
  gap: 10px;
}
#submit-button {
  padding: 10px 20px;
  background-color: black;
  color: white;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  width: fit-content;
  align-self: flex-end;
}
.keyFormContainer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}
.board-card {
  cursor: grabbing;
  height: fit-content;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #eeeeee;
  transition: 0.3s ease;
  backdrop-filter: blur(50px);
}
.board-card:hover {
  border: 1px solid #d0d0d0;
}
.labels {
  display: flex;
  gap: 10px;
}
.board-title {
  font-size: 16px;
  font-weight: 500;
}
.board-desc {
  font-size: 14px;
  font-weight: 300;
}
.assigned-to {
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  flex: 1;
}
.assigned-profile {
  height: 20px;
  width: 22px;
  border-radius: 50px;
  background-color: #a27bfa;
  overflow: hidden;
}
.assigned-name {
  width: 100%;
  font-size: 12px;
  font-weight: 500;
}
.due-date {
  /* flex: 1; */
  color: #5e5d61;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.due-icon {
  stroke: #5e5d61;
}
#add-task-button {
  padding: 20px 0;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #eeeeee;
}
.creator {
  color: #5e5d61;
  font-size: 12px;
  display: flex;
  gap: 5px;
}
.board-card-top {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.board-card-head {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.menu-button {
  padding: 0;
}
.board-card-bottom {
  display: flex;
  justify-content: space-between;
}
.document-link {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
  color: #5e5d61;
  width: fit-content;
}
.board-body {
  background-color: rgba(255, 189, 63, 0.2);
  height: fit-content;
  border-radius: 15px;
  border: 1px solid #eeeeee;
  padding: 10px;
}
</style>

    <div id="configuration-container">
        
    </div>
  `;

class OuterbasePluginTableConfiguration_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes() {
    return observableAttributes;
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID({});

  constructor() {
    super();

    // The shadow DOM is a separate DOM tree that is attached to the element.
    // This allows us to encapsulate our styles and markup. It also prevents
    // styles from the parent page from leaking into our plugin.
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateConfiguration.content.cloneNode(true));
  }
  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      decodeAttributeByName(this, "configuration")
    );
    this.config.tableValue = decodeAttributeByName(this, "tableValue");
    this.config.theme = decodeAttributeByName(this, "metadata").theme;

    this.render();
  }

  render() {
    let sample = this.config.tableValue.length ? this.config.tableValue[0] : {};
    let keys = Object.keys(sample);

    if (
      !keys ||
      keys.length === 0 ||
      !this.shadow.querySelector("#configuration-container")
    )
      return;

    this.shadow.querySelector("#configuration-container").innerHTML =
      `<div class="keyFormContainer">
      <div class="form-flex">
        <div class="form-item">
          <label>Task Id Key</label>
          <select id="taskIdKey">
          ` +
      keys
        .map(
          (key) =>
            `<option value="${key}" ${
              key === this.config.taskId ? "selected" : ""
            }>${key}</option>`
        )
        .join("") +
      `</select>
        </div>
        <div class="form-item">
          <label>Task Name Key</label>
          <select id="taskNameKey">
          ` +
      keys
        .map(
          (key) =>
            `<option value="${key}" ${
              key === this.config.taskName ? "selected" : ""
            }>${key}</option>`
        )
        .join("") +
      `</select>
        </div>
      </div>
  
      <div class="form-flex">
        <div class="form-item">
          <label>Task Description Key</label>
          <select id="taskDescKey">
          ` +
      keys
        .map(
          (key) =>
            `<option value="${key}" ${
              key === this.config.taskDesc ? "selected" : ""
            }>${key}</option>`
        )
        .join("") +
      `
          </select>
        </div>
        <div class="form-item">
          <label>Task Assigned to name Key</label>
          <select id="taskAssignedNameKey"> ` +
      keys
        .map(
          (key) =>
            `<option value="${key}" ${
              key === this.config.taskAssignedName ? "selected" : ""
            }>${key}</option>`
        )
        .join("") +
      `</select>
        </div>
      </div>
  
      <div class="form-flex">
        <div class="form-item">
          <label>Task Document Link Key</label>
          <select id="taskDocLinkKey">
          ` +
      keys
        .map(
          (key) =>
            `<option value="${key}" ${
              key === this.config.taskDocLink ? "selected" : ""
            }>${key}</option>`
        )
        .join("") +
      `</select>
        </div>
        <div class="form-item">
          <label>Task Due Date key</label>
          <select id="taskDueDateKey">
          ` +
      keys
        .map(
          (key) =>
            `<option value="${key}" ${
              key === this.config.taskDueDate ? "selected" : ""
            }>${key}</option>`
        )
        .join("") +
      `</select>
        </div>
      </div>
  
      <div class="form-flex">
        <div class="form-item">
          <label>Task priority key</label>
          <select id="taskPriorityKey">
          ` +
      keys
        .map(
          (key) =>
            `<option value="${key}" ${
              key === this.config.taskPriority ? "selected" : ""
            }>${key}</option>`
        )
        .join("") +
      `</select>
        </div>
        <div class="form-item">
          <label>Task Project Tag key</label>
          <select id="taskProjectTagKey">
          elect id="taskProjectTagKey">
            ` +
      keys
        .map(
          (key) =>
            `<option value="${key}" ${
              key === this.config.taskProjectTag ? "selected" : ""
            }>${key}</option>`
        )
        .join("") +
      `</select>
        </div>
      </div>
  
      <div class="form-item">
        <label>Task Status key</label>
        <select id="taskStatusKey"> ` +
      keys
        .map(
          (key) =>
            `<option value="${key}" ${
              key === this.config.taskStatus ? "selected" : ""
            }>${key}</option>`
        )
        .join("") +
      `</select>
      </div>
  
      <div style="margin-top: 8px">
        <button id="submit-button">Save View</button>
      </div>
    </div>
    <div class="board-body">
      <div class="board-card">
        <div class="board-card-head">
          <div class="labels">
            <h5 class="attention-label" sty>${
              sample[this.config.taskProjectTag]
            }</h5>
            <h5 class="attention-label">🔥 ${
              sample[this.config.taskPriority]
            }</h5>
          </div>
          <button class="menu-button" id="delete button">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.25 5.25L13.5995 14.3569C13.5434 15.1418 12.8903 15.75 12.1033 15.75H5.89668C5.10972 15.75 4.45656 15.1418 4.40049 14.3569L3.75 5.25M7.5 8.25V12.75M10.5 8.25V12.75M11.25 5.25V3C11.25 2.58579 10.9142 2.25 10.5 2.25H7.5C7.08579 2.25 6.75 2.58579 6.75 3V5.25M3 5.25H15"
                stroke="#BF4444"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <div class="board-card-top">
          <h1 class="board-title">${sample[this.config.taskName]}</h1>
          <!-- <div class="creator">
              <p>24, oct</p>
              |
              <p>Created by amit shah</p>
            </div> -->
          <h1 class="board-desc">
          ${sample[this.config.taskDesc]}
          </h1>
        </div>
        <a class="document-link" href="www.google.com" target="_blank">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.625 7.5H9.375M5.625 10H9.375M10.625 13.125H4.375C3.68464 13.125 3.125 12.5654 3.125 11.875V3.125C3.125 2.43464 3.68464 1.875 4.375 1.875H7.86612C8.03188 1.875 8.19085 1.94085 8.30806 2.05806L11.6919 5.44194C11.8092 5.55915 11.875 5.71812 11.875 5.88388V11.875C11.875 12.5654 11.3154 13.125 10.625 13.125Z"
              stroke="black"
              stroke-width="1.25"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Document Link</span>
        </a>
        <div class="board-card-bottom">
          <div class="assigned-to">
            <div class="assigned-profile">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
                alt=""
                style="height: 100%; width: 100%; object-fit: contain"
              />
            </div>
            <p class="assigned-name">${sample[this.config.taskAssignedName]}</p>
          </div>
          <div class="due-date">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                class="due-icon"
                d="M10 6.66667V10L12.5 12.5M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                stroke="black"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p>Due on ${sample[this.config.taskDueDate]}</p>
          </div>
        </div>
      </div>
    </div>`;

    var saveButton = this.shadow.querySelector("#submit-button");
    saveButton.addEventListener("click", () => {
      triggerEvent(this, {
        action: OuterbaseEvent.onSave,
        value: this.config.toJSON(),
      });
    });

    var taskIdKey = this.shadow.querySelector("#taskIdKey");
    taskIdKey.addEventListener("change", () => {
      this.config.taskId = taskIdKey.value;
      this.render();
    });
    var taskNameKey = this.shadow.querySelector("#taskNameKey");
    taskNameKey.addEventListener("change", () => {
      this.config.taskName = taskNameKey.value;
      this.render();
    });
    var taskDescKey = this.shadow.querySelector("#taskDescKey");
    taskDescKey.addEventListener("change", () => {
      this.config.taskDesc = taskDescKey.value;
      this.render();
    });
    var taskAssignedName = this.shadow.querySelector("#taskAssignedNameKey");
    taskAssignedName.addEventListener("change", () => {
      this.config.taskAssignedName = taskAssignedName.value;
      this.render();
    });
    var taskDueDateKey = this.shadow.querySelector("#taskDueDateKey");
    taskDescKey.addEventListener("change", () => {
      this.config.taskDueDate = taskDueDateKey.value;
      this.render();
    });
    var taskPriorityKey = this.shadow.querySelector("#taskPriorityKey");
    taskPriorityKey.addEventListener("change", () => {
      this.config.taskPriority = taskPriorityKey.value;
      this.render();
    });
    var taskProjectTagKey = this.shadow.querySelector("#taskProjectTagKey");
    taskProjectTagKey.addEventListener("change", () => {
      this.config.taskProjectTag = taskProjectTagKey.value;
      this.render();
    });
    var taskStatusKey = this.shadow.querySelector("#taskStatusKey");
    taskStatusKey.addEventListener("change", () => {
      this.config.taskStatus = taskStatusKey.value;
      this.render();
    });
  }
}

window.customElements.define(
  "outerbase-plugin-table-$PLUGIN_ID",
  OuterbasePluginTable_$PLUGIN_ID
);
window.customElements.define(
  "outerbase-plugin-configuration-$PLUGIN_ID",
  OuterbasePluginTableConfiguration_$PLUGIN_ID
);
