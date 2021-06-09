import express from 'express';
import createError from 'http-errors'
import { checkBlogPostSchema, checkValidationResult } from '../methods/validations.js';
import query from "../methods/db/pool.js"

const bpRouter = express.Router();

bpRouter.get("/", async (req, res, next) =>{  
      try { 
      const blogPosts = await query('SELECT * FROM blogposts')
      res.status(200).send(blogPosts)
    } catch (err) {
      console.log(err)
      next(err)
    }
})

bpRouter.get("/:id", async ( req, res, next) =>{
  try {
   const blogPost = await query(`SELECT * FROM blogposts WHERE blogpost_id=${req.params.id}`)
     res.status(blogPost?200:400).send(blogPost? blogPost: "blogPost not found")
  } catch (err) {
    console.log(err)
    next(err)
  }
})

bpRouter.post("/post/:author_id",checkBlogPostSchema,checkValidationResult, async ( req, res, next) =>{
  try {
  const {title, cover, content, category, read_time_value, read_time_unit} = req.body
  const blogPost = await query(`INSERT INTO blogposts (title, cover, content, category, read_time_value, read_time_unit) 
  VALUES ('${title}', '${cover}', '${content}', '${category}',${read_time_value}, '${read_time_unit}') RETURNING *`)
  const relation = await query(`INSERT INTO blogpost_modules(author_id,blogpost_id) VALUES('${req.params.author_id}','${blogPost.blogpost_id}')`)
  res.status(200).send({_id:blogPost.blogpost_id})
  } catch (err) {
    console.log(err)
    next(err)
  }
})

bpRouter.get('/:id/email', async (req, res, next) =>{
  try {
  } catch (error) {
  }
})

bpRouter.put("/:id",checkBlogPostSchema,checkValidationResult, async (req, res, next) =>{
  try {
    const {title} = req.body
    const blogPost = await query(`UPDATE blogposts SET title='${title}' WHERE blogpost_id=${req.params.id} RETURNING *`)
    res.status(200).send({_id:blogPost.blogpost_id})
  } catch (err) {
    console.log(err)
    next(err)
  }
})
bpRouter.delete("/:id", async (req, res, next) =>{
  try {
  const blogPost = await query(`DELETE FROM blogposts WHERE blogpost_id=${req.params.id}`)
  res.status(204).send()
  } catch (err) {
    console.log(err)
    next(err)
  }
})

export default bpRouter