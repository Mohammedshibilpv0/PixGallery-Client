import { Routes,Route } from "react-router-dom"
import UserRouter from "./Routes/userRouter"

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<UserRouter/>}/>
      </Routes>
    </>
  )
}

export default App
