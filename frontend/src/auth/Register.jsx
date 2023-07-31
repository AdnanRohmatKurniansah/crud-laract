import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";
import Swal from "sweetalert2";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validation, setValidation] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate("/blog")
        }
    }, []);

    const registerHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);

        await axios.post(`http://localhost:7000/api/register`, formData).then(({data}) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            navigate("/login")
        }).catch(({response}) => {
            if (response.status === 422) {
                setValidation(response.data.errors)
            } else {
                Swal.fire({
                    text: response.data.message,
                    icon: "error"
                })
            }
        })
    }

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            <div className="d-flex justify-content-center">
            <div className="col-md-6">
                <div className="card border-0 rounded shadow-sm">
                    <div className="card-body">
                        <h4 className="fw-bold">Register</h4>
                        <hr/>
                        <Form onSubmit={registerHandler}>
                            <Row>
                                <Col>
                                    <Form.Group controlId="Name">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" value={name} onChange={(event)=>{
                                            setName(event.target.value)
                                        }}/>
                                        {
                                            validation.name && (
                                                <div className="alert alert-danger mt-1">
                                                    {validation.name[0]}
                                                </div>
                                            )
                                        }
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="Email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" value={email} onChange={(event)=>{
                                            setEmail(event.target.value)
                                        }}/>
                                        {
                                            validation.email && (
                                                <div className="alert alert-danger mt-1">
                                                    {validation.email[0]}
                                                </div>
                                            )
                                        }
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="Password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" value={password} onChange={(event)=>{
                                            setPassword(event.target.value)
                                        }}/>
                                        {
                                            validation.password && (
                                                <div className="alert alert-danger mt-1">
                                                    {validation.password[0]}
                                                </div>
                                            )
                                        }
                                    </Form.Group>
                                </Col>
                            </Row>
                            <small className="d-flex my-3">Already registered ? <Link to={'/login'}>Login now</Link></small>
                            <Button variant="primary" className="mt-2"  block="block" type="submit">
                                Register
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}
export default Register