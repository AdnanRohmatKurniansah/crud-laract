import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validation, setValidation] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate("/blog")
        }
    }, []);

    const loginHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('email', email);
        formData.append('password', password);

        await axios.post(`http://localhost:7000/api/login`, formData).then(({data}) => {
            localStorage.setItem('token', data.token);
            Swal.fire({
                icon: "success",
                text: data.message
            })
            navigate("/blog")
        }).catch(({ response }) => {
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
                        <h4 className="fw-bold">Login</h4>
                        <hr/>
                        <Form onSubmit={loginHandler}>
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
                            <small className="d-flex my-3">Not registered ? <Link to={'/register'}>Register now</Link></small>
                            <Button variant="primary" className="mt-2"  block="block" type="submit">
                                Login
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}
export default Login