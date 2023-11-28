const throwError  = async(error,res)=>{
    return res.status(400).send({
        status : "error",
        message : error.message,
        data : []
    });
}

const retrieveData  = async(result,res)=>{
    return res.status(200).send({
        status : "success",
        message : "Data retrieval successful",
        data: result
    })
}

const insertData  = async(result,res)=>{
    return res.status(200).send({
        status : "success",
        message : "Data inserted successfully",
        data: result
    })
}

const updateRecord  = async(result,res)=>{
    return res.send({
        status : "success",
        message : "Data updated successfully",
        data: result
    })
}

const failedToInsertData  = async(error,res)=>{
    return res.send({
        status : "error",
        message : "Failed to insert data",
        error : error.message
    })
}

const alreadyExist  = async(message,res)=>{
    return res.send({
        status : "error",
        message : message + " already exist",
        error : ""
    })
}

const errorMessage  = async(message,res)=>{
    return res.status(404).send({
        status : "error",
        message : message,
        error : ""
    })
}

const successMessage  = async(message,res)=>{
    return res.status(200).send({
        status : "success",
        message : message,
        error : ""
    })
}

const apiResponse = {
    throwError,
    retrieveData,
    insertData,
    updateRecord,
    failedToInsertData,
    alreadyExist,
    errorMessage,
    successMessage
}

module.exports = apiResponse
