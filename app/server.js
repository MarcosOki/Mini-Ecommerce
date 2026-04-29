require('dotenv').config()
const express = require('express')
const { PrismaClient } = require('../generated/prisma')

const app = express()
const port = 3001
app.use(express.json())

const prisma = new PrismaClient()



// Categoria

app.post('/categorias', async (req, res) => {
    try {
        const { nome, descricao } = req.body
        if (!nome || !descricao)
            return res.status(400).json({ erro: 'nome e descricao são obrigatórios' })

        const resultado = await prisma.categoria.create({
            data: { nome, descricao }
        })
        res.status(201).json(resultado)
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})

app.get('/categorias', async (req, res) => {
    try {
        const categorias = await prisma.categoria.findMany({
            select:{id:true, nome:true, descricao:true}
        })
        res.status(200).json(categorias)
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})

app.get('/categorias/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const categoria = await prisma.categoria.findUnique({ where: { id } })
        if (!categoria)
            return res.status(404).json({ erro: 'Categoria não encontrada' })
        res.status(200).json(categoria)
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})

app.put('/categorias/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const categoria = await prisma.categoria.update({
            where:{id},
            data:{
                ...req.body
            }
        })

        res.status(200).json(categoria)
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})

app.delete('/categorias/:id', async (req, res) =>{
    try {
        const id = parseInt(req.params.id)
        const categoria = await prisma.categoria.delete({
            where:{id}
        })

        res.status(200).json(categoria)
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})

//Produtos

app.post('/produtos', async (req, res) => {
    try {
        const { nome, descricao, preco, estoque, sku, categoriaId } = req.body
        if (!nome || !descricao || preco == null || estoque == null || !sku || !categoriaId)
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios' })

        const resultado = await prisma.produto.create({
            data: { nome, descricao, preco, estoque, sku, categoriaId }
        })
        res.status(201).json(resultado)
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})

app.get('/produtos', async (req, res) => {
    try {
        const produtos = await prisma.produto.findMany({
            include: { categoria: true }
        })
        res.status(200).json(produtos)
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})

app.get('/produtos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const produto = await prisma.produto.findUnique({
            where: { id },
            include: { categoria: true }
        })
        if (!produto)
            return res.status(404).json({ erro: 'Produto não encontrado' })
        res.status(200).json(produto)
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})

app.put('/produtos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const produto = await prisma.produto.update({
            where:{id},
            data:{
                ...req.body
            }
        })

        res.status(200).json(produto)
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})

app.delete('/produtos/:id', async (req, res) =>{
    try {
        const id = parseInt(req.params.id)
        const produto = await prisma.produto.delete({
            where:{id},
        })

        res.status(200).json(produto)
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})



app.listen(port, () => {
    console.log(`API rodando na porta ${port}`)
})
