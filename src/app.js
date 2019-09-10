import React, { useState } from 'react'
import { callbackify } from 'util';
import './app.scss'

async function requestAjax(method, callback) {
  const suffix = {
    'get': '/comments',
    'post': '/comments',
    'put': '/comments/1',
    'delete': '/comments/1'
  }
  const options = {
    method,
    mode: 'cors',
  }
  if (method !== 'get') {
    options.headers = {
      "Content-Type": "application/json"
    }
    options.body = JSON.stringify({
      "id": Date.now(),
      "body": "some comment put" + Date.now(),
      "postId": Date.now()
    })
  }
  const result = await fetch(`/api${suffix[method]}`, options)
  .then(res => {
    console.log('response ', res)
    return res.json()
  })
  callback && callback(result)
}
const App = function() {
  const [count, setCount] = useState(22)
  const [drawType, setDrawType] = useState('')
  const canvasRef = React.createRef();
  const parentRef = React.createRef();
  console.log(parentRef);
  const [list, setList] = useState([])
  console.log('outer position ', pos)
  let isDrawing = false;
  let pos;
  let x;
  let y;
  let ctx;
  let canvasDOM;
  let parentDOM;
  let isSave = false;
  let dragged = null;
  let times = 1;
  function updateList(list) {
    setList(list);
  }
  function draw() {

  }
  function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = '2';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  }
  // function drawRect(x, y, width, height) {
    
  // }
  function init() {
    canvasDOM = canvasRef.current;
    parentDOM = parentRef.current;
    pos = parentDOM.getBoundingClientRect();
    canvasDOM.width = pos.width / 2;
    canvasDOM.height = pos.height / 2;
    ctx = canvasDOM.getContext('2d');
    ctx.save();
  }
  document.addEventListener('DOMContentLoaded', () => {
    init();
  }, false)
  function drawFace() {
    ctx.restore();
    // ctx.clearRect()
    console.log('drawFace ', ctx, canvasDOM.width, canvasDOM.height)
    ctx.clearRect(0, 0, canvasDOM.width, canvasDOM.height)
    ctx.beginPath();
    // ctx.strokeStyle = 'black';
    // ctx.lineWidth = 1;
    ctx.arc(canvasDOM.width/2, canvasDOM.width/2, 50, 0, Math.PI * 2, true);
    // ctx.stroke()
    ctx.moveTo(canvasDOM.width/2 + 30, canvasDOM.height/2);
    ctx.arc(canvasDOM.width/2, canvasDOM.height/2, 30, 0, Math.PI, false);
    ctx.moveTo(canvasDOM.width/2 - 20, canvasDOM.height/2 -25)
    ctx.arc(canvasDOM.width/2 - 25, canvasDOM.height/2 -25, 5, 0, Math.PI * 2, true)
    ctx.moveTo(canvasDOM.width/2 + 30, canvasDOM.height/2 - 25)
    ctx.arc(canvasDOM.width/2 + 25, canvasDOM.height/2 -25, 5, 0, Math.PI * 2, true)
    ctx.stroke();
    ctx.closePath();
  }
  function onMouseDown(e) {
    if (isSave) {
      return
    }

    console.log('ctx ', canvasDOM, ctx)
    console.log('mounse down ', e.clientX, pos)
    x = e.clientX - pos.left;
    y = e.clientY - pos.top;
    isDrawing = true;
  }
  function onMouseMove(e) {
    if (isDrawing && !isSave) {
      drawLine(x, y, e.clientX - pos.left, e.clientY - pos.top)
      x = e.clientX - pos.left;
      y = e.clientY - pos.top;
    }
  }
  function onMouseLeave(e) {
    if (isDrawing) {
      drawLine(x, y, e.clientX - pos.left, e.clientY - pos.top)
      x = 0;
      y = 0;
      isDrawing = false;
    }
  }
  function onTypeChange(e) {
    console.log(e.target.value);
    setDrawType(e.target.value);
  }
  function saveHander() {
    // ctx.
    isSave = true
  }
  function dragEndFun(evt) {
    console.log('dragEndFun ', evt)
  }
  function dragFun(evt) {
    // console.log('dragFun ', evt)
  }
  function dragStartFun(evt) {
    console.log('dragStartFun ', evt)
    dragged = evt.target;
    evt.target.style.opacity = .3;
  }
  function dragMoveFun(evt) {
    console.log('dragMoveFun ', evt)
  }
  function dropHander(evt) {
    evt.preventDefault();
    console.log('dropHander ', evt)
    evt.target.appendChild(dragged)
  }
  function dragOverHander(evt) {
    evt.preventDefault();
    console.log('dragOverHander ', evt)
  }
  function dragEnterFun(evt) {
    console.log('dragEnterFun ', evt)
  }
  function framCb(count) {
    const w = canvasDOM.width
    const h = canvasDOM.height
    if (count <= 1.5) {
      count = count + 0.1;
    }
    ctx.restore();
    ctx.scale(count, count);
    // ctx.restore();
    ctx.beginPath();
    ctx.moveTo(w/2 - 25, h/2 - 50);
    ctx.lineTo(w/2 + 25, h/2 - 50);
    ctx.lineTo(w/2 - 25, h/2);
    ctx.fillStyle = '#000000';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w/2, h/2 + 50);
    ctx.lineTo(w/2 + 50, h/2);
    ctx.lineTo(w/2 + 50, h/2 + 50);
    ctx.strokeStyle = 'red'
    ctx.closePath();
    // ctx.save();
    ctx.stroke();
    ctx.save();
  }
  function initTriangle() {
    let largerCount = 0.1;
    window.requestAnimationFrame(() => {
      framCb(largerCount)
    })
    const w = canvasDOM.width
    const h = canvasDOM.height
    ctx.clearRect(0, 0, w, h);
  }
  function back() {
    ctx.restore();
  }
  function enlarge() {
    // ctx.clearRect(0, 0, canvasDOM.width, canvasDOM.height);

// Reset current transformation matrix to the identity matrix
    times += 1; 
    console.log('enlarge ', times)
    ctx.scale(times, times)
    // Non-scaled rectangle
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, 8, 20);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 8, 20);
  }
  return <div className='app'>
    <h5>{count}</h5>
    <button onClick={() => setCount(count + 1)}>+</button>
    <button onClick={() => setCount(count-1)}>-</button>
    <button onClick={() => requestAjax('post')}>post</button>
    <button onClick={() => requestAjax('put')}>put</button>
    <button onClick={() => requestAjax('get', updateList)}>get</button>
    <button onClick={() => requestAjax('delete')}>delete</button>
    <ul>
      { list.map(item => (
        <li key={item.id}>
          <span>{item.id}</span>
          <span>{item.postId}</span>
          <span>{item.body}</span>
        </li>
      ))}
    </ul>
    <div style={{
      marginBottom: '20px',
      marginTop: '30px'
    }}>
      <select
        onChange={onTypeChange}>
        <option value='rect'>矩形</option>
        <option value='circle'>圆形</option>
      </select>
    </div>
    <div className='canvas'
      ref={parentRef}
      >
      <canvas ref={canvasRef}
        draggable
        onDrag={dragFun}
        onDragStart={dragStartFun}
        onDragEnd={dragEndFun}
        ></canvas>
    </div>
    <div>
      <button onClick={drawFace}>脸</button>
      <button onClick={initTriangle}>对三角</button>
      <button onClick={back}>回退</button>
      <button onClick={draw}>开始</button>
      <button onClick={enlarge}>放大</button>
      <button onClick={saveHander}>保存</button>
    </div>
    <div
      className='drag'
      onDrop={dropHander}
      onDragOver={dragOverHander}
      onDragEnter={dragEnterFun}
      >

    </div>
    
  </div>
}
export default App;