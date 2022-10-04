import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import {isPassword, isMatch} from '../../utils/validation/Validation'
import {showSuccessMsg, showErrMsg} from '../../utils/notification/Notification'
import {fetchAllProducts, dispatchGetAllProducts} from '../../../redux/actions/productsAction'

const initialState = {
    name: '',
    password: '',
    cf_password: '',
    err: '',
    success: ''
}

function Profile() {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const products = useSelector(state => state.products)

    const {user, isLogged} = auth
    const [data, setData] = useState(initialState)
    const {name, password, cf_password, err, success} = data

    const [avatar, setAvatar] = useState(false)
    const [loading, setLoading] = useState(false)
    const [callback, setCallback] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        if(isLogged){
            fetchAllProducts(token).then(res =>{
                dispatch(dispatchGetAllProducts(res))
            })
        }
    },[token, isLogged, dispatch, callback])

    const handleChange = e => {
        const {name, value} = e.target
        setData({...data, [name]:value, err:'', success: ''})
    }

    const changeAvatar = async(e) => {
        e.preventDefault()
        try {
            const file = e.target.files[0]

            if(!file) return setData({...data, err: "No files were uploaded." , success: ''})

            if(file.size > 1024 * 1024)
                return setData({...data, err: "Size too large." , success: ''})

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
                return setData({...data, err: "File format is incorrect." , success: ''})

            let formData =  new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload_avatar', formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })

            setLoading(false)
            setAvatar(res.data.url)
            
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    const updateInfor = () => {
        try {
            axios.patch('/user/update', {
                name: name ? name : user.name,
                avatar: avatar ? avatar : user.avatar
            },{
                headers: {Authorization: token}
            })

            setData({...data, err: '' , success: "Updated Success!"})
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    const updatePassword = () => {
        if (!isPassword(password))
            return setData({ ...data, err: "Password must be min 8 letter, with at least a symbol, upper and lower case letters and a number", success: '' })

        if(!isMatch(password, cf_password))
            return setData({...data, err: "Password did not match.", success: ''})

        try {
            axios.post('/user/reset', {password},{
                headers: {Authorization: token}
            })

            setData({...data, err: '' , success: "Updated Success!"})
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    const handleUpdate = () => {
        if(name || avatar) updateInfor()
        if(password) updatePassword()
    }

    const handleDelete = async (id) => {
        try {
            if(user._id !== id){
                if(window.confirm("Are you sure you want to delete this product permanently?")){
                    setLoading(true)
                    await axios.delete(`/api/product/${id}`, {
                        headers: {Authorization: token}
                    })
                    setLoading(false)
                    setCallback(!callback)
                }
            }
            
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    return (
        <>
        <div>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            {loading && <h3>Loading.....</h3>}
        </div>
        <div className="profile_page">
            <div className="col-left">
                <h2>User Profile</h2>

                <div className="avatar">
                    <img src={avatar ? avatar : user.avatar} alt=""/>
                    <span>
                        <i className="fas fa-camera"></i>
                        <p>Change</p>
                        <input type="file" name="file" id="file_up" onChange={changeAvatar} />
                    </span>
                </div>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" defaultValue={user.name}
                    placeholder="Your name" onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" defaultValue={user.email}
                    placeholder="Your email address" disabled />
                </div>

                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input type="password" name="password" id="password"
                    placeholder="Your password" value={password} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="cf_password">Confirm New Password</label>
                    <input type="password" name="cf_password" id="cf_password"
                    placeholder="Confirm password" value={cf_password} onChange={handleChange} />
                </div>

                <button disabled={loading} onClick={handleUpdate}>Update</button>
            </div>

            <div className="col-right">
                {/* <h2>My Products</h2> */}

                {/* <div style={{overflowX: "auto"}}>
                    <table className="customers">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Archive</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.map(product => (
                                    product.user === user._id ?
                                        <tr key={product._id}>
                                            <td>{product.title}</td>
                                            <td>{product.description}</td>
                                            <td>
                                                {
                                                    product.isArchived === 1
                                                    ? <i className="fas fa-check" title="isArchived"></i>
                                                    : <i className="fas fa-times" title="isNotArchived"></i>
                                                }
                                            </td>
                                            <td>
                                                <Link to={`/edit_product/${product._id}`}>
                                                    <i className="fas fa-edit" title="Edit"> Edit</i>
                                                </Link>
                                                <i className="fas fa-trash-alt" title="Remove"
                                                onClick={() => handleDelete(product._id)} > Delete</i>
                                            </td>
                                        </tr>  : null        
                            ))
                            }
                        </tbody>
                    </table>
                </div> */}

                <div className="cards-primary">
                    <div className="cards-header">
                        <h2>
                            MY PRODUCTS
                        </h2>
                        {/* <p>
                            
                        </p> */}
                    </div>

                    <div className="card-container">
                    {
                        products.map((items, key) => (
                            items.user === user._id ?
                            <article className="card" key={key}>
                                <div className="card-details">
                                    <Link to={`/view_product/${items._id}`}>
                                        <img src={items.image} loading="lazy" alt={items.title}  className="w-full h-48 rounded-tl-md rounded-tr-md" />
                                        <div className="card-header">
                                            {/* <div className="avatar">
                                                <img src={items.authorLogo} alt={items.authorName} />
                                            </div> */}
                                            <div className="info">
                                                <span className="cost">₹ {items.price}</span>
                                                <span className="date">{items.updatedAt.split('').slice(0, 10).join('')}</span>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <h3>
                                                {items.title}
                                            </h3>
                                            <p>{items.description}</p>
                                        </div>
                                    </Link> 
                                    <div className="card-archive">
                                        <p>
                                            ARCHIVED :&nbsp;&nbsp;
                                            {
                                                items.isArchived === 1
                                                ? <i className="fas fa-check" title="isArchived"></i>
                                                : <i className="fas fa-times" title="isNotArchived"></i>
                                            }
                                        </p>
                                    </div>
                                    <div className="card-actions">
                                        <Link to={`/edit_product/${items._id}`}>
                                            <i className="fas fa-edit" title="Edit"> Edit</i>
                                        </Link>
                                            <i className="fas fa-trash-alt" title="Remove"
                                            onClick={() => handleDelete(items._id)} > Delete</i>
                                    </div>
                                </div>
                            </article> : null
                        ))
                    }
                    </div>
                </div>

            </div>
        </div>
        </>
    )
}

export default Profile
