import { useState } from 'react'
import Card from './Card/Card'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='bg-black flex flex-wrap justify-center '>
        <Card/>
        
      </div>
    </>
  )
}

export default App
