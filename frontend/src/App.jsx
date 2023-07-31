import './App.css'
import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Edit from "./components/Edit";
import Create from "./components/Create";
import List from "./components/List";
import Register from './auth/Register';
import Login from './auth/Login';
import Blog from './components/Blog';
import Blogs from './components/Blogs';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';
import Swal from 'sweetalert2';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const token = localStorage.getItem("token")
  const navigate = useNavigate();

  const logoutHandler = async () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    await axios.post(`http://localhost:7000/api/logout`).then(({data}) => {
        localStorage.removeItem("token");

        Swal.fire({
            icon: "success",
            text: data.message
        })
        navigate("/");
    })
  }

  React.useEffect(() => {
    if (!token) {
      setIsLoggedIn(false)
    } else {
      setIsLoggedIn(true)
    }
  }, [token])

  return (
    <div>

    <Navbar bg='primary'>
      <Container>
        <Link to={"/"} className='navbar-brand text-white'>
          <h4 className='fw-bolder'>ARK Blog.</h4>
        </Link>
        {
          isLoggedIn ? (
            <div className='d-flex'>
              <Link to={"/blog"} className='navbar-brand text-white'>
                <h5 className='fw-bold mr-5 '>Dashboard</h5>
              </Link>
              <Button onClick={logoutHandler} className="btn btn-md btn-danger">
                Logout
              </Button>
            </div>
          ) : (
            <Link to={"/login"} className='nav-link text-white'>
              <h5 className='btn btn-success fw-bold'>Login</h5>
            </Link>
          )
        }
      </Container>
    </Navbar>

    <Container className="mt-5">
      <Row>
        <Col md={12}>
          <Routes>
            <Route exact path="/" element={<Blogs />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/blog/create" element={<Create />} />
            <Route path="/blog/edit/:id" element={<Edit />} />
            <Route path='/blog' element={<List />} /> 
            <Route path='/register' element={<Register />} /> 
            <Route path='/login' element={<Login />} />
          </Routes>
        </Col>
      </Row>
    </Container>
    </div>
  )
}

export default App
