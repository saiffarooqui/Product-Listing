import React, {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import axios from 'axios'
import {showSuccessMsg, showErrMsg} from '../../utils/notification/Notification'
import {isEmpty, priceValidate} from '../../utils/validation/Validation'

const initialState = {
    title:'',
    price: 0,
    description: '',
    location:'',
    category:'',
    phone:'',
    isArchived: 0,
    err: '',
    success:''
  }

function EditProduct() {
    const {id} = useParams()
    const products = useSelector(state => state.products)
    const token = useSelector(state => state.token)
    const [editProduct, setProduct] = useState(initialState)
    const { title, price, description, location, category, phone, isArchived, image, err, success } = editProduct

    const [oldProduct, setOldProduct] = useState(initialState)
    

    const [avatar, setAvatar] = useState(false)

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if(products.length !== 0){
            products.forEach(product => {
                // console.log(product)
                if(product._id === id){
                    setOldProduct(product)
                    setProduct(product)
                    // console.log({oldProduct})
                }
            })
        }else{
            navigate('/profile')
        }
    },[products, id, navigate])

    const handleChangeInput = e => {
        const { name, value } = e.target
        setProduct({...editProduct,[name]:value, err:'', success:''})
  }


    const handleUpdate = () => {
        if (isEmpty(title) || isEmpty(price) || isEmpty(description) || isEmpty(location) || isEmpty(category) || isEmpty(phone))
             return  setProduct({ ...editProduct, err:"Please fill in all fields", success: '' })
  
        if(priceValidate(price))
            return setProduct({...editProduct, err: "Price must be greater than or equal to 0", success: ''})
  
        try {
            // console.log({oldProduct})
            // console.log({title: title ? title : oldProduct.title, 
            //     description: description ? description : oldProduct.description,
            //     price: price ? price : oldProduct.price,
            //     location: location ? location : oldProduct.price,
            //     category: category ? category : oldProduct.category,
            //     phone: phone ? phone : oldProduct.phone,
            //     isArchived, 
            //     image: avatar ? avatar : image})
            axios.patch(`/api/product/${id}`, {
              title: title ? title : oldProduct.title, 
              description: description ? description : oldProduct.description,
              price: price ? price : oldProduct.price,
              location: location ? location : oldProduct.price,
              category: category ? category : oldProduct.category,
              phone: phone ? phone : oldProduct.phone,
              isArchived, 
              image: avatar ? avatar : image
            },{ headers: {Authorization: token} }
          )
  
          setProduct({...editProduct, err: '', success: 'update successful'})
        } catch (err) {
            err.response.data.msg && 
            setProduct({...editProduct, err: err.response.data.msg, success: ''})
        }
    }  

    const changeAvatar = async(e) => {
        e.preventDefault()
        try {
            const file = e.target.files[0]
  
            if(!file) return setProduct({...editProduct, err: "No files were uploaded." , success: ''})
  
            if(file.size > 1024 * 1024)
                return setProduct({...editProduct, err: "Size too large." , success: ''})
  
            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
                return setProduct({...editProduct, err: "File format is incorrect." , success: ''})
  
            let formData =  new FormData()
            formData.append('file', file)
  
            setLoading(true)
            const res = await axios.post('/api/upload_avatar', formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })
  
            setLoading(false)
            setAvatar(res.data.url)
            
        } catch (err) {
            setProduct({...editProduct, err: err.response.data.msg , success: ''})
        }
    }

    const handleCheck = () => {
        // isArchived ? isArchived = 0 : isArchived = 1
        setProduct({...editProduct, isArchived: isArchived ? 0 : 1 ,err: '' , success: ''})
    }

    return (
        <div>
            <div>
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}
                {loading && <h3>Loading.....</h3>}
            </div>
            <div className="back">
                    <button onClick={() => navigate(-1)} className="go_back">
                        <i className="fas fa-long-arrow-alt-left"></i> Go Back
                    </button>
            </div>

            <div className="create_product">
                <h2>Edit Product</h2>

                <div className="avatar">
                    <img src={avatar ? avatar : editProduct.image} alt=""/>
                    <span>
                        <i className="fas fa-camera"></i>
                        <p>Change</p>
                        <input type="file" name="file" id="file_up" onChange={changeAvatar} />
                    </span>
                </div>

                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" placeholder="Enter Title" value={title} onChange={handleChangeInput}/>
                </div>

                <div>
                    <label htmlFor="price">Price</label>
                    <input type="number" name="price" id="price" placeholder="Enter Price" value={price} onChange={handleChangeInput}/>
                </div>

                <div>
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description" placeholder="Enter Description" value={description} onChange={handleChangeInput}/>
                </div>

                <div>
                    <label htmlFor="location">Location</label>
                    <input type="text" name="location" id="location" placeholder="Enter Location" value={location} onChange={handleChangeInput}/>
                </div>

                <div>
                    <label htmlFor="category">Category</label>
                    <input type="text" name="category" id="category" placeholder="Enter Category" value={category} onChange={handleChangeInput}/>
                </div>

                <div>
                    <label htmlFor="phone">Phone no.</label>
                    <input type="text" name="phone" id="phone"placeholder="Enter Phone Number" value={phone} onChange={handleChangeInput}/>
                </div>

                <div className="check">
                    <input type="checkbox" id="isArchived" checked={isArchived} onChange={handleCheck} />
                    <label htmlFor="isArchived">Archive</label>
                </div>

                <div className="row">
                    <button disabled={loading} onClick={handleUpdate}>Update</button>
                </div>
            </div>
        </div>
    )
}

export default EditProduct