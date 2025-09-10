import React from 'react'
import women_pic from '../../assets/womens-pic.avif'
import men_pic from '../../assets/mens-pic.avif'
import { Link } from 'react-router-dom'

const GenderCollection = () => {
  return (
    <section className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Women collection */}
        <div className="relative group overflow-hidden rounded-2xl shadow-lg">
          <img 
            className="w-full h-[400px] object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
            src={women_pic} 
            alt="Women's collection" 
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80"></div>
          {/* Content */}
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Women’s Collection</h2>
            <Link 
              to="/collections/all/?gender=Women"
              className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-full shadow-md hover:from-yellow-500 hover:to-yellow-700 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Men collection */}
        <div className="relative group overflow-hidden rounded-2xl shadow-lg">
          <img 
            className="w-full h-[400px] object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
            src={men_pic} 
            alt="Men's collection" 
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80"></div>
          {/* Content */}
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Men’s Collection</h2>
            <Link 
              to="/collections/all/?gender=Men"
              className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-full shadow-md hover:from-yellow-500 hover:to-yellow-700 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}

export default GenderCollection
