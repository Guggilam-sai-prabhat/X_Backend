import app from "./index.js"

const PORT =  process.env.PORT || 8080
app.listen(process.env.port,()=>{
    console.log(`server is running at port ${PORT}`)
})