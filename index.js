let canvasBoard = document.querySelector("canvas");
canvasBoard.height = window.innerHeight;
canvasBoard.width = window.innerWidth;
let tool = canvasBoard.getContext("2d");

let body = document.querySelector("body");

let pencil = document.querySelector("img.pencil");
let eraser = document.querySelector("img.eraser");
let line = document.querySelector("img.line");
let rectangle = document.querySelector("img.rectangle");
let colPicker = document.querySelector("img.color");
let undo = document.querySelector("img.undo");
let redo = document.querySelector("img.redo");
let deleteDrawing = document.querySelector("img.delete");
let download = document.querySelector("img.download");
let notes = document.querySelector("img.notes");
let upload = document.querySelector("img.upload");

let colorPicker = document.querySelector("input.color");
let color = colorPicker.value;
let cTool = "null";
let drawing = false;
let ix, iy, fx, fy;
let boardTop = canvasBoard.getBoundingClientRect().top;
let boardLeft = canvasBoard.getBoundingClientRect().left;
let options = [pencil, eraser, line, rectangle, colPicker, deleteDrawing, download, undo, redo, upload, notes];
let index = -1;
let dataList = []; 

function applyShadow(element){
    for(let i = 0; i<options.length; i++)
    {
        let t = options[i];
        t.style.border = "none";
        t.style.borderRadius = "0px";
        t.style.boxShadow = "none";
    }

    element.style.border = "2px solid black";
    element.style.borderRadius = "8px";
    element.style.boxShadow = "2px 2px 10px black";
}

line.addEventListener("click", ()=>{

    applyShadow(line);
    let slider = document.querySelector("input.line");
    if(slider.style.display == "none")
        slider.style.display = "flex";
    else    
       slider.style.display = "none";
    cTool = "line";
});

rectangle.addEventListener("click", ()=>{

    applyShadow(rectangle);
    let slider = document.querySelector("input.rectangle");
    if(slider.style.display == "none")
        slider.style.display = "flex";
    else    
       slider.style.display = "none";
    cTool = "rectangle";
});

pencil.addEventListener("click", ()=>{
    
    applyShadow(pencil);
    let slider = document.querySelector("input.pencil");
    if(slider.style.display == "none")
        slider.style.display = "flex";
    else    
       slider.style.display = "none";
    cTool = "pencil";
})

eraser.addEventListener("click", ()=>{

    applyShadow(eraser);
    let slider = document.querySelector("input.eraser");
    if(slider.style.display == "none")
        slider.style.display = "flex";
    else    
       slider.style.display = "none";
    cTool = "eraser";
})

colPicker.addEventListener("click", ()=>{

    for(let i = 0; i<options.length; i++)
    {
        let t = options[i];
        if(t.className != cTool)
        {
            t.style.border = "none";
            t.style.borderRadius = "0px";
            t.style.boxShadow = "none";
        }
    }
    colPicker.style.border = "2px solid black";
    colPicker.style.borderRadius = "8px";
    colPicker.style.boxShadow = "2px 2px 10px black";

    if(colorPicker.style.display == "none")
        colorPicker.style.display = "flex";
    else    
        colorPicker.style.display = "none";
    setInterval(() => {
        color = colorPicker.value;
        console.log(color);
    }, 1000);
})

undo.addEventListener("click", ()=>{

    cTool = "undo";
    applyShadow(undo);
    
    if (index > 0) {
        index--;

        let img = new Image();
        img.src = dataList[index];
        img.onload = function() { 
            tool.clearRect(0, 0, canvasBoard.width, canvasBoard.height);
            tool.drawImage(img, 0, 0, canvasBoard.width, canvasBoard.height); 
        };
        
        img.onerror = function(){ 
            alert(img.src+' failed');
        }
    }
    else
        tool.clearRect(0, 0, canvasBoard.width, canvasBoard.height);

})

redo.addEventListener("click", ()=>{
    
    cTool = "redo";
    applyShadow(redo);

    if (index < dataList.length-1) {
        index++;
        let img = new Image();
        img.src = dataList[index];
        img.onload = function() { 
            tool.clearRect(0, 0, canvasBoard.width, canvasBoard.height);
            tool.drawImage(img, 0, 0, canvasBoard.width, canvasBoard.height); 
        };
        
        img.onerror = function(){ 
            alert(img.src+' failed');
        }
    }
})

notes.addEventListener("click", ()=>{

    cTool = null;
    applyShadow(notes);

    let template = document.createElement("div");
    template.setAttribute("class", "template");
    template.innerHTML = `
    <div class = "header">
        <div class="nav"></div>
        <div class = "buttons">
            <button style="background-color: rgba(255, 0, 51, 0.747);" class = "del"></button>
            <button style="background-color: rgb(255, 204, 74);" class = "minimize"></button>
        </div>
    </div>
    <textarea class = "text" spellcheck="false"></textarea>
    </div>
    `;
    body.appendChild(template);
    
    let minimize = template.querySelector(".minimize");
    let del = template.querySelector(".del");
    
    let nav = template.querySelector(".nav");

    
    minimize.addEventListener("click", ()=>{
        let text = template.querySelector("textarea.text");
        if(text.style.display == "none")
            text.style.display = "block";
        else
            text.style.display = "none";
        })

    del.addEventListener("click", ()=>{
        body.removeChild(template);
    })
    
    nav.ontouchstart = (e)=>dragAndDrop(nav, template, e);
    nav.onmousedown = (e)=>dragAndDrop(nav, template, e);

    nav.ondragstart = function() {
        return false;
    };
    
})

function dragAndDrop(base, element, event){

    document.body.append(element);
    
    function moveAt(pageX, pageY) {
        element.style.left = pageX - element.offsetWidth / 2 + 'px';
        element.style.top = pageY - element.offsetHeight / 2 + 'px';
    }
    
    moveAt(event.pageX, event.pageY);
    
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    function onTouchMove(event) {
        let x,y;
        ;[...event.changedTouches].forEach(touch => {
            x = `${touch.pageX}`;
            y = `${touch.pageY}`;
        })
        moveAt(x, y);
    }
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
    base.ontouchend = function(){
        document.removeEventListener('touchmove', onTouchMove);
        base.ontouchend = null;
    }
    base.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        base.onmouseup = null;
    };
}

download.addEventListener("click", ()=>{

    applyShadow(download);
    let url = canvasBoard.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

upload.addEventListener("click", ()=>{

    applyShadow(upload);
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e)=>{
        let file = input.files[0];
        let url = URL.createObjectURL(file);
        
        cTool = null;
        let template = document.createElement("div");
        template.setAttribute("class", "template");
        template.innerHTML = `
        <div class = "header">
            <div class="nav"></div>
            <div class = "buttons">
                <button style="background-color: rgba(255, 0, 51, 0.747);" class = "del"></button>
                <button style="background-color: rgb(255, 204, 74);" class = "minimize"></button>
            </div>
        </div>
        <img class = "notesImg">
        `;
        body.appendChild(template);
        let img = template.querySelector("img.notesImg");
        img.src = url;
        img.style.display = "block";

        let minimize = template.querySelector(".minimize");
        let del = template.querySelector(".del");
        
        let nav = template.querySelector(".nav");
        
        minimize.addEventListener("click", ()=>{
            let text = template.querySelector("textarea.text");
            if(text.style.display == "none")
                text.style.display = "block";
            else
                text.style.display = "none";
            })

        del.addEventListener("click", ()=>{
            body.removeChild(template);
        })
        
        nav.ontouchstart = (e)=>dragAndDrop(nav, template, e);
        nav.onmousedown = (e)=>dragAndDrop(nav, template, e);
        
        nav.ondragstart = function() {
            return false;
        };
    })
})

deleteDrawing.addEventListener("click", ()=>{

    applyShadow(deleteDrawing);
    tool.clearRect(0, 0, canvasBoard.width, canvasBoard.height);
})

function down(e){
    if(cTool == null)
        return;
    if(cTool == "line")
    {
        let width;
        line.style.border = "2px solid black";
        let slider = document.querySelector("input.line");
        drawing = true;
        console.log(ix);
        tool.beginPath();
        width = slider.value;
        tool.lineWidth = width;
        tool.moveTo(ix, iy);
    }
    else if(cTool == "rectangle")
    {
        let width;
        rectangle.style.border = "2px solid black";
        let slider = document.querySelector("input.rectangle");
        drawing = true;
        tool.beginPath();
        width = slider.value;
        tool.lineWidth = width;
        tool.moveTo(ix, iy);
    }
    else if(cTool == "pencil")
    {
        let width;
        pencil.style.border = "2px solid black";
        let slider = document.querySelector("input.pencil");
        drawing = true;
        tool.beginPath();
        width = slider.value;
        tool.lineWidth = width;
        tool.moveTo(ix, iy);
    }
    else if(cTool == "eraser")
    {
        let width;
        eraser.style.border = "2px solid black";
        let slider = document.querySelector("input.eraser");
        drawing = true;
        tool.beginPath();
        width = slider.value;
        tool.lineWidth = width;
        tool.moveTo(ix, iy);
    }
}

function move(e){
    if(drawing == false || (cTool != "pencil" && cTool != "eraser"))
        return;

    let col = color;
    if(cTool == "eraser")
        col = "black";

    tool.moveTo(ix, iy);
    tool.lineTo(fx, fy);
    tool.strokeStyle = col;
    tool.stroke();
    ix = fx;
    iy = fy;
}

function up(e){
    if(cTool == null || drawing == false)
        return;
   
    if(cTool == "line") 
    {
        tool.lineTo(fx, fy);
        tool.strokeStyle = color;
        tool.stroke();
        drawing = false;
    }
    if(cTool == "rectangle")
    {
        let l = fx - ix;
        let b = fy - iy;
        tool.strokeStyle = color;
        tool.strokeRect(ix, iy, l, b);
        drawing = false;
    }
    if(cTool == "pencil")
    {
        tool.lineTo(fx, fy);
        tool.strokeStyle = color;
        tool.stroke();
        drawing = false;
    }
    if(cTool == "eraser")
    {
        tool.lineTo(fx, fy);
        tool.strokeStyle = "black";
        tool.stroke();
        drawing = false;
    }
    if(cTool == "undo" || cTool == "redo")
        return;
    index++;
    if (index <= dataList.length) 
    {   
        if(index != 0)
            dataList = dataList.slice(0, index);
        dataList.push(canvasBoard.toDataURL());
    }
}

body.addEventListener("mousedown", function(e){
    ix = e.clientX - boardLeft;
    iy = e.clientY - boardTop;
    down(e);
})

body.addEventListener("touchstart", function(e){
    ;[...e.changedTouches].forEach(touch => {
        ix = `${touch.pageX}`;
        iy = `${touch.pageY}`;
        down(e);
    })
})

body.addEventListener("mousemove", function(e){
    fx = e.clientX - boardLeft;
    fy = e.clientY - boardTop;
    move(e);
})

body.addEventListener("touchmove", function(e){
    ;[...e.changedTouches].forEach(touch => {
        fx = `${touch.pageX}`;
        fy = `${touch.pageY}`;
        move(e);
    })
})

body.addEventListener("mouseup", function(e){
    fx = e.clientX - boardLeft;
    fy = e.clientY - boardTop;
    up(e);
})

body.addEventListener("touchend", function(e){
    ;[...e.changedTouches].forEach(touch => {
        fx = `${touch.pageX}`;
        fy = `${touch.pageY}`;
        up(e);
    })
})