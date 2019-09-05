import React, { useState } from 'react'

async function requestAjax(method) {
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
  const result = await fetch(`http://localhost:3000/api${suffix[method]}`, options)
  console.log('result ', result)
}
const App = function() {
  const [count, setCount] = useState(22)
  return <div className='app'>
    <h5>{count}</h5>
    <button onClick={() => setCount(count + 1)}>+</button>
    <button onClick={() => setCount(count-1)}>-</button>
    <button onClick={() => requestAjax('post')}>post</button>
    <button onClick={() => requestAjax('put')}>put</button>
    <button onClick={() => requestAjax('get')}>get</button>
    <button onClick={() => requestAjax('delete')}>delete</button>
  </div>
}
export default App;