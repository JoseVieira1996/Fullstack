const express = require('express')
const bodyParser= require('body-parser')
const mysql = require('mysql')
const handlebars = require('express-handlebars')
const urlencodeParser=bodyParser.urlencoded({extended: false})
const sql = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'Mysql2020',
    port: 3306
})

sql.query('use celke')

const app = express()


//template engine
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('views engine', 'handlebars')
app.use('/css', express.static('css'))
app.use('/img',express.static('img'))

//rotas
app.get ('/index', function(req,res){
    res.render(__dirname + '/views/index.handlebars')
    
})

///INSERIR
app.get ('/inserir', function(req,res){
    res.render(__dirname + '/views/inserir.handlebars')
})

app.post('/controllerForm', urlencodeParser, function(req,res){
    sql.query('insert into personagens values(?,?,?,?)', [req.body.id, req.body.nome, req.body.cor, req.body.imagem])
    res.render(__dirname + '/views/controllerForm.handlebars')
})

/////// SELECIONAR
app.get ('/select/:id?', function(req,res){
    if(!req.params.id){
        sql.query('select * from personagens order by id asc', function (err,results,fields){
            res.render(__dirname + '/views/select.handlebars', {data: results})
        })
    }else{
        sql.query('select * from personagens where id=? order by id asc', [req.params.id],function(err,results,fields){
            res.render(__dirname + '/views/select.handlebars', {data: results})
        })
    }
    
})
///////////////// DELETAR
app.get('/deletar/:id', function(req,res){
    sql.query('delete from personagens where id=?', [req.params.id])
    res.render(__dirname + '/views/deletar.handlebars')
})




////////////////// UPDATE
app.get('/update/:id', function(req,res){
    sql.query('select * from personagens where id=?', [req.params.id],function(err,results,fields){
        res.render(__dirname + '/views/update.handlebars', {id: req.params.id, nome:results.nome, cor:results.cor, imagem: results.imagem})
    })
})


app.post('/controllerUpdate', urlencodeParser, function(req,res){
    sql.query('update personagens set nome=?, cor=?, imagem=? where id=?', [req.body.nome, req.body.cor, req.body.imagem, req.body.id])
    res.render(__dirname + '/views/controllerUpdate.handlebars' )
})



app.listen(8088)