const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number =process.argv[4]

const url =
  `mongodb+srv://lumilukko:${password}@cluster0.xia7i45.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: [String,Number],
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

if(process.argv<5){
console.log(process.argv.length)
    const note = new Note({
    content: [name,number],
    date: new Date(),
    important: true,
    })

    note.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
    })

}else{
    Note.find({}).then(persons=>{
        console.log("phonebook")
        persons.map(person=>console.log(`${person.content[0]} ${person.content[1]}`))
        mongoose.connection.close()
    })
}
