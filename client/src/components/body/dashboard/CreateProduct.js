import React, { useState } from 'react'
import axios from 'axios'
import {useSelector} from 'react-redux'
// import {Link} from 'react-router-dom'
import {isEmpty, priceValidate, validatePhone} from '../../utils/validation/Validation'
import {showSuccessMsg, showErrMsg} from '../../utils/notification/Notification'
import {useNavigate} from 'react-router-dom'

const initialState = {
  title:'',
  price: 0,
  description: '',
  location:'',
  category:'',
  phone:'',
  err: '',
  success:''
}

function CreateProduct() {
    const [product, setProduct] = useState(initialState)
    const { title, price, description, location, category, phone, err, success } = product

    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const {user} = auth
    const userId = user._id

    const [avatar, setAvatar] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleChangeInput = e => {
          const { name, value } = e.target
          setProduct({...product,[name]:value, err:'', success:''})
    }

    const changeAvatar = async(e) => {
      e.preventDefault()
      try {
          const file = e.target.files[0]

          if(!file) return setProduct({...product, err: "No files were uploaded." , success: ''})

          if(file.size > 1024 * 1024)
              return setProduct({...product, err: "Size too large." , success: ''})

          if(file.type !== 'image/jpeg' && file.type !== 'image/png')
              return setProduct({...product, err: "File format is incorrect." , success: ''})

          let formData =  new FormData()
          formData.append('file', file)

          setLoading(true)
          const res = await axios.post('/api/upload_avatar', formData, {
              headers: {'content-type': 'multipart/form-data', Authorization: token}
          })

          setLoading(false)
          setAvatar(res.data.url)
          
      } catch (err) {
          setProduct({...product, err: err.response.data.msg , success: ''})
      }
  }

    const handleSubmit = async e => {
      e.preventDefault()
      if (isEmpty(title) || isEmpty(price) || isEmpty(description) || isEmpty(location) || isEmpty(category) || isEmpty(phone))
           return  setProduct({ ...product, err:"Please fill in all fields", success: '' })

      if(priceValidate(price))
          return setProduct({...product, err: "Price must be greater than or equal to 0", success: ''})
      
      if(!validatePhone(phone))
          return setProduct({...product, err: "Enter a valid phone number", success: ''})    

      if(!avatar)
        return setProduct({...product, err: "Please Upload an image", success: ''})

      try {
          console.log({title, description, price, location ,category, phone, avatar, userId})
          const res = await axios.post('api/products', {
            title, description, price, location ,category, phone, image:avatar, user:userId
          },{ headers: {Authorization: token} }
        )

        setProduct({...product, err: '', success: res.data.msg})
      } catch (err) {
          err.response.data.msg && 
          setProduct({...product, err: err.response.data.msg, success: ''})
      }
    }

    return (
      <>

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
           <h2>Create Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" placeholder="Enter Title" value={title} onChange={handleChangeInput} required/>
                </div>

                <div>
                    <label htmlFor="price">Price</label>
                    <input type="number" name="price" id="price" placeholder="Enter Price" value={price} onChange={handleChangeInput} required/>
                </div>

                <div>
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description" placeholder="Enter Description" value={description} onChange={handleChangeInput} required/>
                </div>

                <div>
                    <label htmlFor="location">Location</label>
                    <input type="text" name="location" id="location" placeholder="Enter Location" value={location} onChange={handleChangeInput} required/>
                </div>

                <div>
                    <label htmlFor="category">Category</label>
                    <input type="text" name="category" id="category" placeholder="Enter Category" value={category} onChange={handleChangeInput} required/>
                </div>

                <div>
                    <label htmlFor="phone">Phone no.</label>
                    <input type="text" name="phone" id="phone"placeholder="Enter Phone Number" value={phone} onChange={handleChangeInput} required/>
                </div>

                <div className="row file">
                <input type="file" name="file" id="file_upload" onChange={changeAvatar} />
                </div>

                <div className="row">
                <button type="submit">create</button>
                </div>
               
            </form>

        </div>
      </>  
    )
}

export default CreateProduct