
const BaseModel = require('./base_model');
const ErrorCode = require('../utilities/errors');
module.exports = class Payout extends BaseModel {


    constructor(payout) {
        super(payout);
        this.id = "";
        this.name = "";
        this.description = "";

        this.tags = [];
        this.owner = null;


        if (payout) {
            this.id = payout.id;
            this.name = payout.name;
            this.description = payout.description;

            this.tags = payout.tags || [];
            this.owner = payout.owner;
        }
    };

    static parseFromCreateRequest(payout) {
        if (payout) {
            payout.id = null;

        }
        return Payout.parseFromUpdateRequest(payout);
    };

    static parseFromUpdateRequest(payout) {
        let return_payout = new Payout();
        return_payout.id = payout.id;
        return_payout.name = payout.name;
        return_payout.description = payout.description;
        return_payout.youtupe_link = payout.youtupe_link;
        return return_payout
    };

    static parseExerciseInputList(payoutList) {
        if (payoutList && Array.isArray(payoutList)) {
            return payoutList.map(payout => Payout.parseFromUpdateRequest(payout));
        }
        return [];
    };

    static parseListToResponse(payout_list) {
        return !payout_list ? [] : payout_list.map(payout => Payout.parseToResponse(payout));
    }

    static parseToResponse(payout) {
        return {
            id: payout.id,
            name: payout.name,
            description: payout.description,
            tags: payout.tags || [],
        }
    };
}
