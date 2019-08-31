"use strict";

module.exports = (request, response) => {

    return (data) => {
        response.status(200);
        return response.send({
            "status": {
                "operiration_id":request.requiest_guid,
                "status_code": "SUCCESS",
                "error_code": "0",
                "error_massage": ""
            },
            "data":data
        });
    }
}