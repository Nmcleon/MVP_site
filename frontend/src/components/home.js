/* eslint-disable no-unused-vars */

import React, { Fragment, useEffect } from 'react';
import MetaData from './layout/MetaData';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../action/productAction';
import Product from './product/Product';
import Loader from './layout/Loader';
import { useAlert } from 'react-alert';

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, products, err, productCount } = useSelector((state) => state.products);

  useEffect(() => {
    if (err) {
      return alert.error(err);
    }

    dispatch(getProducts());
  }, [dispatch, alert, err]); 

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
        </Fragment>
      )}
      <MetaData title={'Finest wine online'} />
      <div></div>
    </Fragment>
  );
};

export default Home;
