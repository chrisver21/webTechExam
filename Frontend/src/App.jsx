import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProductsTable from './components/productsTable'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="app">
        <ProductsTable/>
      </div>
    </>
  )
}

export default App
