import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import { comment, calender } from "../../utils/Icons";

function Todolist() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const taskTitle = useRef("");
  const taskSummary = useRef("");
  const taskPriority = useRef("low"); // Default priority is low
  const taskDeadline = useRef(""); // New deadline field

  function createTask() {
    if (!taskTitle.current.value) return; // Prevent creating empty tasks
    const newTask = {
      title: taskTitle.current.value,
      summary: taskSummary.current.value || "No summary",
      priority: taskPriority.current.value,
      deadline: taskDeadline.current.value || "No deadline", // Save deadline
    };
    setTasks([...tasks, newTask]);
    saveTasks([...tasks, newTask]);
    taskTitle.current.value = "";
    taskSummary.current.value = "";
    taskPriority.current.value = "low"; // Reset priority to low after creating a task
    taskDeadline.current.value = ""; // Reset deadline
    setOpened(false); // Close the modal after creating a task
  }

  function deleteTask(index) {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  function loadTasks() {
    const loadedTasks = localStorage.getItem("tasks");
    const parsedTasks = JSON.parse(loadedTasks);
    if (parsedTasks) {
      setTasks(parsedTasks);
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <StyledTodolist>
      <InnerLayout>
        <h1 className="title">TODO</h1>
        <div className="newtask-btn">
          <button onClick={() => setOpened(true)}>+ New Task</button>
        </div>
        {opened && (
          <div className="modal">
            <div className="modal-content">
              <input
                type="text"
                ref={taskTitle}
                placeholder="Task Title"
                required
                className="text-input"
              />
              <textarea
                ref={taskSummary}
                placeholder="Task Summary"
                className="text-area"
              ></textarea>
              <div className="select-priority">
                <label htmlFor="priority">Priority: </label>
                <select id="priority" ref={taskPriority} defaultValue="low">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="deadline">
                <label htmlFor="deadline">Deadline: </label>
                <input
                  type="datetime-local"
                  id="deadline"
                  ref={taskDeadline}
                  className="datetime-input"
                />
              </div>
              <div className="button-group">
                <button
                  onClick={() => {
                    setOpened(false);
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button onClick={createTask} className="create-button">
                  Create Task
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="container">
          <div className="group"></div>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <div className="card" key={index}>
                <div className="card-content">
                  <div>
                    {task.priority === "high" && (
                      <div className="priority-dot red"></div>
                    )}
                    {task.priority === "medium" && (
                      <div className="priority-dot yellow"></div>
                    )}
                    {task.priority === "low" && (
                      <div className="priority-dot green"></div>
                    )}
                    <strong>{task.title}</strong>
                  </div>
                  <button
                    onClick={() => {
                      deleteTask(index);
                    }}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
                <p className="summary">
                  {comment}
                  <strong>Summary:</strong>
                  {task.summary}
                </p>
                {task.deadline && (
                  <p className="deadline">
                    {calender}
                    <strong>Deadline:</strong> {task.deadline}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="no-ttasks-message">You have no tasks</p>
          )}
        </div>
      </InnerLayout>
    </StyledTodolist>
  );
}

const StyledTodolist = styled.div`
  .container {
    border-radius: 5px;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;

    .group {
      margin-bottom: 1rem;
    }
    .card {
      margin-bottom: 1rem;

      .card-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        button {
          background-color: transparent;
          border: none;
          cursor: pointer;
          color: red;
          font-size: 16px;
        }
      }
      .summary {
        color: rgba(34, 34, 96, 0.9);
        font-size: 16px;
      }
      .deadline {
        color: rgba(34, 34, 96, 0.9);
        font-size: 16px;
      }
    }
    .no-tasks-message {
      color: rgba(34, 34, 96, 0.9);
      font-size: 18px;
    }
  }
  .newtask-btn {
    display: flex;
    justify-content: flex-end;
    button {
      background-color: #4caf50;
      border: none;
      margin-bottom: 1rem;
      color: #fff;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      &:hover {
        background-color: #45a049;
      }
    }
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    .modal-content {
      background-color: #fff;
      padding: 1rem;
      border-radius: 5px;
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.2);
      .text-input,
      .text-area {
        width: 100%;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        border-radius: 5px;
        border: 1px solid #ccc;
        resize: vertical;
      }
      .select-priority,
      .deadline {
        margin-bottom: 0.5rem;
      }
      .button-group {
        display: flex;
        justify-content: flex-end;
        button {
          margin-left: 0.5rem;
          cursor: pointer;
          &:first-child {
            margin-left: 0;
          }
        }
        .cancel-button {
          background-color: #ff0000;
          border: none;
          color: #fff;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          &:hover {
            background-color: #a70000;
          }
        }
        .create-button {
          background-color: #4caf50;
          border: none;
          color: #fff;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          &:hover {
            background-color: #45a049;
          }
        }
      }
    }
  }
  .priority-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
  }
  p {
    display: flex;
    align-items: center;
    margin-top: 10px;
    gap: 0.5rem;
    color: var(--primary-color);
    opacity: 0.8;
  }

  .red {
    background-color: red;
  }

  .yellow {
    background-color: yellow;
  }

  .green {
    background-color: green;
  }
`;

export default Todolist;
