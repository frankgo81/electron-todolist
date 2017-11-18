const electron = require("electron");
const {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} = electron;

let mainWindow;
let addWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file:/${__dirname}/main.html`);
  mainWindow.on('closed', () => {
    app.quit();
  })

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
})

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'add a new todo'
  });
  addWindow.loadURL(`file:/${__dirname}/add.html`);
  addWindow.on('closed', ()=>{
    addWindow =null;
  })
};

let todos=[];

ipcMain.on('todo:add',(event, todo )=>{
   mainWindow.webContents.send( 'todo:add', todo);
    todos.push(todo);
    console.log(todos);

   //addWindow.close();
});


const menuTemplate = [{
  label: 'File',
  submenu: [
     {
      label: 'new todo',
      accelerator: process.platform === "darwin" ? 'Command+A' : 'Ctrl+A',
      click() {

        createAddWindow();
      }
    },
 
  {

    label: 'clear todo',
    //accelerator: process.platform === "darwin" ? 'Command+A' : 'Ctrl+A',
    click() {
     mainWindow.webContents.send('todo:clear');

    }
  }

    ,
    {
      label: 'exit',
      accelerator: process.platform === "darwin" ? 'Command+Q' : 'Ctrl+Q',
      click() {
        app.quit();
      }
    }
  ]

}]

if (process.platform === "darwin") {
  menuTemplate.unshift({});
}
if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
      label: 'view',
      submenu: [
        {role:'reload'},
        {
        label: 'toggle console',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();

        }

      }, ]


    }

  )
}
