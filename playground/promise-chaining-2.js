require('../src/db/mongoose')
const Task = require('../src/models/task.js')

// Task.findByIdAndDelete('5d67ddeed42424007887fc5c').then((task) => {
//     console.log(task)
//     return Task.countDocuments({completed: false})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false})
    return count
}

deleteTaskAndCount('5d6801542956b602a5cdc659').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})