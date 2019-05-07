const chai = require('chai');
const expect = chai.expect;
const list = require('../../orderList');

let listInstance;
describe('list parser', () => {
  beforeEach((done) => {
    listInstance = list()
    done();
  });

  it('methods are defined', (done) => {
    expect(listInstance.getList).to.exist;
    expect(listInstance.push).to.exist;
    done()
  })

  it('init empty array', (done) => {
    expect(listInstance.getList()).to.be.an('array').that.is.empty;
    done();
  });

  it('sum two numbers', (done) => {
    const row = {
      action: 'order',
      price: '50',
    }
    const total = listInstance._private.sum(row, 49)
    expect(total).to.equal(99)
    done();
  });

  it('subtract two numbers', (done) => {
    const row = {
      action: 'refund',
      price: '50',
    }
    const total = listInstance._private.sum(row, 49)
    expect(total).to.equal(-1)
    done();
  });

  it('push one order and check schema', () => {
    const add = {
      email: 'person60542@email.com',
      order_id: '8762',
      item_id: '248',
      price: '50',
      action: 'order'
    }

    listInstance.push(add)

    const result = listInstance.getList()
    expect(result).to.be.an('array')
    expect(result).to.have.lengthOf(1)
    expect(result[0].email_id).to.be.an('string')
    expect(result[0].order_id).to.equal(8762)
    expect(result[0].items).to.be.an('array')
    expect(result[0].items).to.have.lengthOf(1)
    expect(result[0].items[0]).to.equal(248)
    expect(result[0].total).to.equal(50)
  });

  it('push 2 orders with same id', () => {
    const add = {
      email: 'person60542@email.com',
      order_id: '8762',
      item_id: '248',
      price: '50',
      action: 'order'
    }

    listInstance.push(add)

    add.item_id = '249'
    add.price = '49'
    add.action = 'order'

    listInstance.push(add)

    const result = listInstance.getList()
    expect(result).to.be.an('array')
    expect(result).to.have.lengthOf(1)
    expect(result[0].email_id).to.be.an('string')
    expect(result[0].order_id).to.equal(8762)
    expect(result[0].items).to.be.an('array')
    expect(result[0].items).to.have.lengthOf(2)
    expect(result[0].items[0]).to.equal(248)
    expect(result[0].items[1]).to.equal(249)
    expect(result[0].total).to.equal(99)
  });

});
