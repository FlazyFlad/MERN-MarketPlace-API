const request = require('supertest');
const express = require('express');
const chai = require('chai');
const expect = chai.expect;

const app = express();
const productRouter = require('../routes/productRoutes');

app.use('/product', productRouter);

describe('Product API', () => {
    it('should get all products', (done) => {
      request(app)
        .get('/product/products')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  
    it('should create a new product', (done) => {
      request(app)
        .post('/product/products')
        .send({
          Name: 'Test Product',
          CategoryID: '657ec841aa42f83291ea8c29',
          Description: 'Test Description',
          Price: 19.99,
          StockQuantity: 10,
          ImageURL: 'test-image.jpg',
          ModelID: '65841422ea34529152c01667',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('Name', 'Test Product');
          done();
        });
    });
  });
