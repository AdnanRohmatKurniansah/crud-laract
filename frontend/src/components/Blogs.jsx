import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Blogs = () => {
    const [blogs, setBlogs] = useState("")

    useEffect(() => {
        fetchBlogs();
    })

    const fetchBlogs = async () => {
        await axios.get(`http://localhost:7000/api/blogs`).then(({data}) => {
            setBlogs(data)
        })
    }

    return (
        <div className="container mt-5">
        <div className="row">
            {
            blogs.length > 0 && (
                blogs.map((row, key) => (
                <div className="col-md-4" key={key}>
                    <div className="card text-bg-dark border-0">
                    <img src={`http://localhost:7000/storage/${row.image}`} className="card-img" alt="..." />
                    <div className="card-img-overlay">
                        <h5 className="card-title">{row.title}</h5>
                        <p className="card-text">{row.excerpt}</p>
                        <p className="card-text"><small>Created at {row.created_at}</small></p>
                        <Link to={`/blog/${row.id}`} className="btn btn-primary mb-2">View more</Link>
                    </div>
                    </div>
                </div>
                ))
            )
            }
        </div>
    </div>
    )
}
export default Blogs