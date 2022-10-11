import React from 'react'
import FaqsCard from './FaqsCard'

function Home() {

    const currentYear = (new Date().getFullYear())
    const yearTxt = currentYear === 2022 ? "2022" : "2022 - "+currentYear

    return (
        <>
            <div className="hero-dark-container">
                <section className="hero-dark">
                    <div className="hero-details">
                        <h1>
                            Get started with us and
                            <span> List your Products</span>
                        </h1>
                        <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus suscipit rutrum mauris ut faucibus. Suspendisse potenti. Nunc sollicitudin lacus quis dui tempor, vel pharetra lacus efficitur.
                        </p>
                        <div className="hero-btns">
                            <a href="/login" className="btn-primary">
                                Get started
                            </a>
                        </div>
                    </div>
                    <div className="hero-img">
                        <img src= {require('./hero.png')} alt=""/>
                    </div>
                </section>
            </div>
            <FaqsCard />
            <footer>
                © { yearTxt } Product Listing
            </footer>
        </>
    )
}

export default Home
