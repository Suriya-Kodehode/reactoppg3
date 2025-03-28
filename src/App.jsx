import { Outlet } from 'react-router-dom'


import './App.css'

function App() {
  

  return (
    <>
      <div className='App'>
        <header>

        </header>
        <main>
            <Outlet />
        </main>
        <footer>

        </footer>
      </div>
    </>
  )
}

export default App
