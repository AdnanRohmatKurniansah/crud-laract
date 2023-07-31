import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const Blog = () => {
    const { id } = useParams()
    const [title, setTitle] = useState("")
    const [excerpt, setExcerpt] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")
    const [created_at, setCreated_at] = useState("")

    useEffect(() => {
        fetchBlog()
    }, [])

    const fetchBlog = async () => {
        await axios.get(`http://localhost:7000/api/blogs/${id}`).then(({data}) => {
            const {title, description, image, created_at} = data.blog
            setTitle(title)
            setExcerpt(excerpt)
            setDescription(description)
            setImage(image)
            setCreated_at(created_at)
        })
    }
    
    return (
        <div className="col-md-8 mx-auto mb-5">
            <div className="card">
            <img height="500px" src={`http://localhost:7000/storage/${image}`} className="card-img-top" alt="..." />
            <div className="card-body">
                <p className="card-text"><small className="text-body-secondary">Created at {created_at}</small></p>
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{description}</p>
            </div>
            </div>
        </div>
    )
}
export default Blog