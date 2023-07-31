import axios from "axios"
import React, { useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const List = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState({})
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    const fetchData = async () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        await axios.get(`http://localhost:7000/api/dashboard`).then((response) => {
            setUser(response.data);
        })
    }

    useEffect(() => {
        if (!token) {
            Swal.fire({
                icon: "error",
                text: "You must login first"
            })
            navigate("/login");
        } else {
            fetchData()
            fetchBlogs()
        }
    }, [])
    
    const fetchBlogs = async () => {
        await axios.get(`http://localhost:7000/api/blogs`).then(({data}) => {
            setBlogs(data)
        })
    }

    const deleteBlog = async (id) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to delete this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            return result.isConfirmed
        })

        if(!isConfirm){
            return;
        }

        await axios.delete(`http://localhost:7000/api/blogs/${id}`).then(({data}) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            fetchBlogs()
        }).catch(({response:{data}})=>{
            Swal.fire({
                icon: "error",
                text: data.message
            })
        })
    }

    return (
        <div className="container">
            <h3 className="d-flex justify-content-center my-3">Halo {user.name}</h3>
            <div className="row">
                <div className="col-md-12">
                <Link className="btn btn-primary mb-3 float-end" to={"/blog/create"}>
                    Create Blog
                </Link>
                </div>
                <div className="col-12">
                    <div className="card card-body">
                        <div className="table-responsive">
                        <table className="table table-bordered mb-0 ">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Excerpt</th>
                                    <th>Description</th>
                                    <th>Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    blogs.length > 0 && (
                                        blogs.map((row, key) => (
                                            <tr key={key}>
                                                <td>{row.title}</td>
                                                <td>{row.excerpt}</td>
                                                <td>{row.description}</td>
                                                <td>
                                                    <img width="100px" src={`http://localhost:7000/storage/${row.image}`} alt="" />
                                                </td>
                                                <td>
                                                    <Link to={`/blog/edit/${row.id}`} className="btn btn-success mb-2">Edit</Link>
                                                    <Button variant="danger" onClick={() => deleteBlog(row.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default List