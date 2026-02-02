import { CreateAccount } from './components/createAccount'
import { ForgotPassword, PasswordChanged } from './components/ForgotPassword'
import {Login} from './components/login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { VerifySuccess } from './components/EmailVerified'
import {Landing} from './components/home'
import { useEffect } from 'react'
function App() {

  return ( 
    <>
     <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}></Route>
          <Route path='/create' element={<CreateAccount/>}></Route>
          <Route path='/forgotPassword' element={<ForgotPassword/>}></Route>
          <Route path='/verified' element={<VerifySuccess/>} />
          <Route path='/home' element={<Landing/>}/>
          <Route path='/passwordChanged' element={<PasswordChanged/>} />
        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
