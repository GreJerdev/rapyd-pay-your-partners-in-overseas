"use strict";

module.exports = (request, response) => {

    return (error,error_code) => {
        if(!error_code){
            error_code = 200;
        }
        response.status(error_code);
        return response.send({
            "status": {
                "operiration_id":request.requiest_guid,
                "status_code": "ERROR",
                "error_code": error_code|| 0,
                "error_massage": error
            }
            
        });
    }
}