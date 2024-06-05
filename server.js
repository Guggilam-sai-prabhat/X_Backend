import app from "./index.js"

app.listen(process.env.port,()=>{
    console.log(`server is running at port ${process.env.port}`)
})