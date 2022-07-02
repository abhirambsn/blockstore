import React from 'react'
import Products from './Products'

const Main = () => {
  return (
    <div className='pt-4 flex flex-col items-center justify-center'>
        <h3 className='text-2xl text-white'>All Products</h3>
        
        <Products />
    </div>
  )
}

export default Main