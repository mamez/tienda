var express = require('express');
var session = require('express-session')
var bd = require('./data/bd')
var app = express();

app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: false
}))

/**
 * Pagina inicio
 */
app.get('/', async (req, res) => {
    const context = await bd.getData("context.json");
    res.render('index', {
        experiencias: context.experiencias,
        promocion: context.promocion,
        productos: context.productos
    })
});

/**
 * Pagina de contacto
 */
app.get('/contact', (req, res) => {
    res.render('contacto');
});

/**
 * Pagina Nosotros
 */
app.get('/about', (req, res) => {
    res.render('about');
});

/**
 * Pagina de accesorios
 */
app.get('/accesorios', async (req, res) => {
    const context = await bd.getData("context.json");
    res.render('accesorios', {
        productos: context.productos
    });
});

/**
 * Productos
 */
app.get('/product', async (req, res) => {
    const producType = req.query.type;
    let productos = [];
    productos = await bd.getData("productos/"+producType + ".json");
    const context = await bd.getData("context.json");
    res.render('productos', {
        titulo: context.produtTitle[producType],
        grupo: producType,
        productos: productos
    });
});
/**
 * Guardar producto al carrito de compra
 */
app.post('/store', async (req, res) => {
    const id = req.body.id;
    const producType = req.body.group;
    let product = {};
    if (!req.session.productos) {
        req.session.productos=[];
    }
    let productos = [];
    productos = await bd.getData("productos/" + producType + ".json");
    productos.forEach(element => {
        if(element.id == id){
            product = element;
            product["cont"]=1;
        }
    });
    let encontrado =false;
    req.session.productos.forEach((element, index )=> {
        if (element.id == product.id){
            let total = element.cont +1;
            req.session.productos[index].cont=total;
            encontrado = true;
        }
    });
    if (!encontrado){
        req.session.productos.push(product);
    }
    res.status(201).json(product);
});

/**
 * Lista todos los productos del carrito de compra
 */
app.get('/store', async (req, res) => {
    res.render('productos', {
        titulo: "Productos a comprar",
        grupo: "",
        productos: req.session.productos
    });
});

/**
 * Retorna el numero de productos del carrito
 */
app.get('/store/count', async (req, res) => {
    let cont=0;
    req.session.productos?.forEach(element => {
        cont = cont + element.cont;
    });
    res.status(201).json({total:cont});
});

/**
 * Salir de la compra
 */
app.get('/store/abort', async (req, res) => {
    req.session.productos=[];
    res.redirect('/');
});

/**
 * Elimina un producto del carrito
 */
app.get('/store/delete/:id', async (req, res) => {
    const id = req.params.id;
    
    req.session.productos.forEach((element,index)=> {
        if (element.id == id && element.cont <= 1){
            req.session.productos.splice(index, 1);
        } else if (element.id == id){
            req.session.productos[index].cont = element.cont - 1;
        }
    });
    if (req.session.productos.length > 0){
        res.redirect('/store');
    }else{
        res.redirect('/');
    }
});


/**
 * Pasarela de pago
 */
app.get('/payment', async (req, res) => {
    req.session.productos = [];
    res.render('pasarela/pagos');
});




app.listen(3000);
