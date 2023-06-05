class ValidInfo {
    constructor(valid, conflicting, reason='') {
        this.valid = valid;
        this.conflicting = conflicting;
        this.reason = reason;
    }
}

export default class Validator {
    children = new Map();
    rules = new Map();
    conflicting = []

    addRule(name, type, node) {
        this.rules.set(name, type);
        this.children.set(name, node);
        return this;
    }

    validate(data) {
        try {
            for(const name of this.rules.keys()) {
                if(!(name in data) || typeof data[name] !== this.rules.get(name)) {
                    this.conflicting.push(name);
                    const validInfo = new ValidInfo(false, this.conflicting, 'not found');
                    this.conflicting = [];
                    return validInfo;
                }
            }

            let valid = true;
            for(const name of this.children.keys()) {
                const validator = this.children.get(name);
                if(validator === null) {
                    continue;
                }

                const res = this.children.get(name).validate(data[name]);
                if(!res) {
                    this.conflicting.push(name);
                }
                valid = valid && res;
            }

            const validInfo = new ValidInfo(valid, this.conflicting);
            if(!validInfo.valid) {
                validInfo.reason = 'wrong types';
            }
            this.conflicting = [];
            return validInfo;
        } catch(e) {
            const validInfo = new ValidInfo(false, this.conflicting, e);
            this.conflicting = [];
            return validInfo;
        }
    }
}
