/* eslint-disable no-unused-vars */

import React, { Fragment, useEffect, useState } from 'react';
import Pagination from  'react-js-pagination'
import MetaData from './layout/MetaData';
import Slider from 'rc-slider'
import 're-slider/assets/index.css';

import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../action/productAction';
import Product from './product/Product';
import Loader from './layout/Loader';
import { useAlert } from 'react-alert';


const { createSliderWithTooltip } = Slider
const Range = createSliderWithTooltip(Slider.Range)


const Home = ({ match }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [price, setPrice] = useState([1, 35000])


  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, products, err, productCount, resPerPage } = useSelector((state) => state.products);

  const keyword = match.prams.keyword
  useEffect(() => {
    if (err) {
      return alert.error(err);
    }

    dispatch(getProducts(keyword, currentPage, price));
  }, [dispatch, alert, err,  keyword, currentPage, price]); 

  function setCurrentpageNo(pageNumber) {
    setCurrentPage(pageNumber);
    };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {keyboars ? (
                <Fragment>
                  <div className='col-6 col-md-3 mt-5 mb-5'>
                    <div className='px-5'>
                      <Range
                      marks = {{
                        1 : `$1`,
                        100 : `$1000`
                      }}
                      min={1}
                      max={1000}
                      defaultValue={[1, 1000]}
                      tipFormatter={value =>  `$${value}`}
                      tipProps={{
                        placement: "top",
                        visible: true
                      }}
                      value={price}
                      onChange={price => setPrice(price)}
                      />
                    </div>
                  </div>
                  <div className='col-6 col-md-9'>
                    <div className='row'>
                    {product.map(product => (
                  <product key ={product._id} product={product} col={4} />
                ))}                     
                      
                    </div>

                  </div>

                </Fragment>
              ) :(
                product.map(product => (
                  <product key ={product._id} product={product} col={3} />
                ))
              )}
      
            </div>
          </section>

          {resPerPage <= productCount && (
            <div className='d-felex justify-content-center mt-5'>
            <Pagination
            activePage={currentPage}
            itemsCountPerPage={resPerPage}
            totalItemsCount={productCount}
            onChange={setCurrentpageNo}
            nextPageText={'Next'}
            prevPageText={'Prev'}
            firstPageText={'First'}
            lastPageText={'Last'}
            itemClass='page-item'
            linkClass='page-link'
            />
          </div>

          )}
          
        </Fragment>
      )}
      <MetaData title={'Finest wine online'} />
      <div></div>
    </Fragment>
  );
};

export default Home;
