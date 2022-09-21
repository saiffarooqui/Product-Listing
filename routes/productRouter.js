const router = require('express').Router()
const productCtrl = require('../controllers/productCtrl')
const uploadImage = require('../middleware/uploadImage')
const uploadCtrl = require('../controllers/uploadCtrl')
const auth = require('../middleware/auth')

router.route('/products')
    .post(auth, productCtrl.createProduct)
    .get(auth, productCtrl.getProducts)

router.route('/product/:id')
    .patch(auth, productCtrl.updateProduct)
    .get(auth, productCtrl.getProduct)
    .delete(auth, productCtrl.deleteProduct) 
    .patch(auth, productCtrl.archiveProduct)  
    
router.route('/archive_product/:id')
    .patch(auth, productCtrl.archiveProduct)  

module.exports = router