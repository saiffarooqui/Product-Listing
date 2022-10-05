import React from 'react'
import {useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'

function ViewProduct() {
  const {id} = useParams()
  const products = useSelector(state => state.products)

  return (
    <section className="cta-secondary">
            <div className="cta-cover"></div>
            {
                    products.map((product,key) => (
                        product._id === id ?
                        <div className="cta-container" key={key}>
                        <div className="cta-details">
                            <h3> {product.title} </h3>
                            <div className="first">
                              <p>₹ {product.price}</p>
                              <p><i className="fa fa-map-marker" title="location"></i> {product.location}</p>
                            </div>
                            <div className="second">
                              <p>Category: {product.category}</p>
                              <p><i className="fa fa-calendar" title="Posted at"></i> {product.updatedAt.split('').slice(0, 10).join('')}</p>
                            </div>
                            <p> {product.description} </p>
                            <a
                                className="cta-btn"
                                href={`https://wa.me/${product.phone}`}
                                target="_blank"
                                rel="noreferrer">
                                Contact
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                        </div>
                        <div className="cta-image">
                            <img 
                                src={product.image} 
                                alt="" 
                            />
                        </div>
                        </div>
                        : null        
                    ))
            }
        </section>
  )
}

export default ViewProduct