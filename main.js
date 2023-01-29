const task = document.querySelector('.task')
const inputTodo = document.getElementById('input-todo')
const blackBackground = document.querySelector('.black-background')

let completedTasks = 0, indexRemove

//for the first time
let todoLists = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : []
render(todoLists)

// inputTodo.autofocus(1) ????
function reRender() {
    //JSON.stringify: localStorage only save 'string'
    localStorage.setItem('tasks', JSON.stringify(todoLists))
    render(todoLists)
    setDataFooter()
}

function render(todoLists = []) {
    let content = ''

    if(todoLists.length != 0) {
        todoLists.forEach((todo, index) => {
            if(todo.edit) {
                
            } 
            content +=  `<li id=${index} class="todo-item ${todo.finished ? 'done no-active' : ''}">
                            ${todo.edit ? `<input type="text" class="input-temp" value=${todo.content}></input>` : `<p>${todo.content}</p>`}
                            <div class="todo-icon">
                                <i class="fa-solid fa-square-check check ${todo.edit ? 'display-none' : ''}"></i>
                                ${todo.edit ? `<i class="fa-solid fa-check-double confirm"></i>` : `<i class="fa-solid fa-pen-to-square edit"></i>`}
                                <i class="fa-solid fa-trash delete"></i>
                            </div>
                        </li>`})
    } else {
        content = `<p class="no-task">- no todo have been added yet -</p>`
    }

    task.innerHTML = content
    
}

function setDataFooter() {
    document.querySelector('.all span').innerText = `${todoLists.length}`
    document.querySelector('.active span').innerText = `${todoLists.length - completedTasks}`
    document.querySelector('.completed span').innerText = `${completedTasks}`
}

function createTodo() {
    let todoValue = {
        content: inputTodo.value,
        finished: false,
        edit: false
    }

    if(todoValue.content.trim() != '') {
        
        todoLists.push(todoValue)
        reRender()
        inputTodo.value = ''
        inputTodo.focus()
    }
}

//add task || add task with enter
document.getElementById('add-btn').addEventListener('click', createTodo);
inputTodo.addEventListener('keypress', (e) => {
    if(e.key === "Enter") {
        createTodo()
    }
})

task.addEventListener('click', (e) => {
    let target = e.target
    let id = target.parentElement.parentElement.id
    let selectedTodo = todoLists[id]
    // selectedTodo
    if(target.matches('.check')) {
        
        if(selectedTodo.finished) {
            selectedTodo.finished = false   
            completedTasks-- 
        } else {
            selectedTodo.finished = true
            completedTasks++
        }  
        reRender()
    } else if(target.matches('.delete')) {
        
        if(selectedTodo.finished) {
            completedTasks--
            todoLists.splice(id, 1)
            reRender()
        } else {
            //processing black background
            blackBackground.style.display = 'block'
            indexRemove = removeTodo(id)
        }
        //yes: 
        //no:
        //bg:
    } else if(target.matches('.edit')) {
        if(!selectedTodo.edit && !selectedTodo.finished) {
            selectedTodo.edit = true
            reRender()
            let inputTemp = document.querySelector('.input-temp')
            //focus the cursor in the end of line
            let end = inputTemp.value.length 
            inputTemp.setSelectionRange(end, end)
            inputTemp.focus()
        } 

    } else if(target.matches('.confirm')) {
            
            selectedTodo.edit = false
            let inputTemp = document.querySelector('.input-temp')
            if(inputTemp.value) {
                selectedTodo.content = inputTemp.value  
            } else {
                alert('type some content')
            }
            reRender()
            
    }
        //target.parentElement.previousElementSibling.style.display = 'none'
        // const inputTemp = document.createElement('input')
        // console.log(target.parentElement.parentElement);
        // target.parentElement.parentElement.appendChild(inputTemp) 
        //click edit-btn then an input appear, as the same time edit-btn => check-btn 
})

function removeTodo(id = null, isConfirm = false) {
    if(isConfirm) {
        todoLists.splice(id, 1) //remove 1 obj
        blackBackground.style.display = 'none'
        reRender()
    }
    return id
}

document.querySelector('.confirm-btn').addEventListener('click', (e) => {
    let target = e.target
    if(target.matches('.yes-wrap')) {
        removeTodo(indexRemove, true)
    } else {
        blackBackground.style.display = 'none'
    }
    
})

document.body.addEventListener('click', (e) => {
    if(e.target === blackBackground) {
        blackBackground.style.display = 'none'
    }
})



//map, forEach,...
document.querySelector('.clear-completed').addEventListener('click',() => {
    todoLists.map((todo, index) => {
        if(todo.finished) {
            todoLists = todoLists.filter(todo => {
                if(!todo.finished) {
                    return todo
                } else {
                    completedTasks--
                }
            })
        }
    })
    reRender()
})








