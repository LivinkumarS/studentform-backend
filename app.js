import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"

const app = express()

function successconnect() {
    console.log("connect");

}
function failconnect() {
    console.log("fail");

}
mongoose.connect("mongodb+srv://Agalya:12345@cluster0.f2fptwz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(successconnect).catch(failconnect)

let userdataschema = new mongoose.Schema({
    name: String,
    age: Number,
    phone: Number,
    mail: String,
    height: Number,
    ispresent: String,
})

let studentbiodata = mongoose.model("Studentbiodata", userdataschema)
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
function handlehello(req, res) {
    console.log("request receive");
    res.status(200).json({ name: "vijay", age: 15, spouse: "sangeetha" })

}
app.get("/sayhello", handlehello)

function handleactor(req, res) {
    console.log("data received");
    function sendsuccess() {
        res.status(202).json({ datareceived: true })
    }
    function sendfail(err) {
        console.log(err)
        res.status(400).json({
            datareceived: false,
            error:err

        })
    }
    console.log(req.body);


    let newData = new studentbiodata(req.body)
    newData.save().then(sendsuccess).catch(sendfail)



}
app.post("/actorinfo", handleactor)


app.listen(3000)






