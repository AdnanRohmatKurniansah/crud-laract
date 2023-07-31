import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/esm/Form";
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2";

const Edit = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [imagePreview, setImagePreview] = useState(null)
    const [image, setImage] = useState("")
    const [validationError, setValidationError] = useState({})
    const [oldImage, setOldImage] = useState("")

    useEffect(() => {
        fetchBlog()
    }, [])

    const fetchBlog = async () => {
        await axios.get(`http://localhost:7000/api/blogs/${id}`).then(({data}) => {
            const {title, description, image} = data.blog
            setTitle(title)
            setDescription(description)
            setImage(image)
            setOldImage(image)
        }).catch(({response: {data}}) => {
            Swal.fire({
                icon: "error",
                text: data.message
            })
        })
    }

    const changeHandler = (event) => {
        setImage(event.target.files[0]);

        const imageURL = URL.createObjectURL(event.target.files[0]);
        setImagePreview(imageURL);
    }

    const updateBlog = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append('_method', 'PUT')
        formData.append('title', title)
        formData.append('description', description)
        if (image !== null) {
            formData.append('image', image)
        }
        formData.append('oldImage', oldImage)

        await axios.post(`http://localhost:7000/api/blogs/${id}`, formData).then(({data}) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            navigate("/blog")
        }).catch(({response}) => {
            if (response.status === 422) {
                setValidationError(response.data.errors)
            } else {
                Swal.fire({
                    icon: "error",
                    text: data.message
                })
            }
        })
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
            <div className="col-12 col-sm-12 col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Update Product</h4>
                        <hr />
                        <div className="form-wrapper">
                            {
                                Object.keys(validationError).length > 0 && (
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="alert alert-danger">
                                                <ul className="mb-0">
                                                {
                                                    Object.entries(validationError).map(([key, value]) => (
                                                        <li key={key}>{value}</li>
                                                    ))
                                                }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            <Form onSubmit={updateBlog}>
                            <Row>
                                <Col>
                                    <Form.Group controlId="Title">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" value={title} onChange={(event)=>{
                                        setTitle(event.target.value)
                                    }}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="my-3">
                                <Col>
                                    <Form.Group controlId="Description">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control as="textarea" rows={3} value={description} onChange={(event)=>{
                                        setDescription(event.target.value)
                                        }}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                <Form.Group controlId="Image" className="mb-3">
                                    <Form.Label className="d-flex">Image</Form.Label>
                                    {   
                                        imagePreview ? (                            
                                            <img src={imagePreview} style={{ width: '200px', marginBottom: '10px' }} />
                                        ) : (
                                            image && <img src={`http://localhost:7000/storage/${image}`} style={{ width: '200px', marginBottom: '10px' }} />
                                        )
                                    }
                                    <Form.Control type="file" onChange={changeHandler} />
                                </Form.Group>
                                </Col>
                            </Row>
                            <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                                Update
                            </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}
export default Edit