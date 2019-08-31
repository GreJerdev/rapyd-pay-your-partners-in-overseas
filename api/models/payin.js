'use strict';

const BaseModel = require('./base_model');
const ErrorCode = require('../utilities/errors');
module.exports = class Payin extends BaseModel {


    constructor(payin) {
        super(payin);
        this.id = "";
        this.name = "";
        this.description = "";

        this.tags = [];
        this.owner = null;


        if (payin) {
            this.id = payin.id;
            this.name = payin.name;
            this.description = payin.description;

            this.tags = payin.tags || [];
            this.owner = payin.owner;
        }
    };

    static parseFromCreateRequest(payin) {
        if (payin) {
            payin.id = null;

        }
        return Payin.parseFromUpdateRequest(payin);
    };

    static parseFromUpdateRequest(payin) {
        let return_payin = new Payin();
        return_payin.id = payin.id;
        return_payin.name = payin.name;
        return_payin.description = payin.description;
        return_payin.youtupe_link = payin.youtupe_link;
        return return_payin
    };

    static parseExerciseInputList(payinList) {
        if (payinList && Array.isArray(payinList)) {
            return payinList.map(payin => Payin.parseFromUpdateRequest(payin));
        }
        return [];
    };

    static parseListToResponse(payin_list) {
        return !payin_list ? [] : payin_list.map(payin => Payin.parseToResponse(payin));
    }

    static parseToResponse(payin) {
        return {
            id: payin.id,
            name: payin.name,
            description: payin.description,
            tags: payin.tags || [],
        }
    };
}
