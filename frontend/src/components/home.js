/* eslint-disable no-unused-vars */

import React, { Fragment, useEffect, useState } from 'react';
import Pagination from  'react-js-pagination'
import MetaData from './layout/MetaData';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../action/productAction';
import Product from './product/Product';
import Loader from './layout/Loader';
import { useAlert } from 'react-alert';

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, products, err, productCount, resPerPage } = useSelector((state) => state.products);

  useEffect(() => {
    if (err) {
      return alert.error(err);
    }

    dispatch(getProducts(currentPage));
  }, [dispatch, alert, err, currentPage]); 

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
              {products &&
                products.map((product) => <Product key={product._id} product={product} />)}
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
