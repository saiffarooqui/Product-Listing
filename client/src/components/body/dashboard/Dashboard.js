import React, {useEffect, useState}from 'react'
import {Link} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {fetchAllProducts, dispatchGetAllProducts} from '../../../redux/actions/productsAction'

import dashImage from '../../assets/dashboard.png'


function Dashboard() {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const products = useSelector(state => state.products)

    const [searchTerm, setSearchTerm] = useState("")

    const {isLogged} = auth
    const dispatch = useDispatch()
    useEffect(() => {
        if(isLogged){
            fetchAllProducts(token).then(res =>{
                dispatch(dispatchGetAllProducts(res))
            })
        }
    },[token, isLogged, dispatch])

    return (
        <>
            <section>
                <div className="cta-primary">
                    <div className="cta-container">
                        <div className="cta-details">
                            <h3>
                                Start Listing your Products for <span>higher reach</span>
                            </h3>
                            <p>
                                Get noticed by customers worldwide. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse in erat fermentum ante dignissim efficitur in sit amet urna. Praesent pretium erat sem, quis hendrerit mi mattis nec.
                            </p>
                        </div>
                        <p className="cta-btn">
                            <p><Link to="/create_product">List Product</Link></p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </p>
                    </div>
                    <div className="cta-image">
                        <img src={dashImage} alt="" />
                    </div>
                </div>            
            </section>

            <section className="cards-primary">
                <div className="cards-header">
                    <h1>
                        Products
                    </h1>
                    <p>
                        Products listed by users all over the world.
                    </p>
                </div>
                <form
                onSubmit={(e) => e.preventDefault()} 
                className="search-form-primary">
                    <div className="search-form-container">
                        <svg xmlns="http://www.w3.org/2000/svg" className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            className="search-input"
                            onChange={(event) => {
                                setSearchTerm(event.target.value)
                            }}
                        />
                    </div>
                </form>
                <div className="card-container">
                    {
                        products.filter((items) => {
                            if(searchTerm === ""){
                                return items
                            } else if(items.title.toLowerCase().includes(searchTerm.toLowerCase())){
                                return items
                            }
                        }).map((items, key) => (
                            !items.isArchived ?
                            <article className="card" key={key}>
                                <p className="card-details">
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
                                </p>
                            </article> : null
                        ))
                    }
                </div>
        </section>
        </>
        
    )
}

export default Dashboard
