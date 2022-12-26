class Bank {

    constructor(name, license, phone = null, site = null) {
        this.name = name;
        this.license = license;
        this.phone = phone;
        this.site = site;
    }

    getData() {
        return {
            name: this.name,
            license: this.license,
            phone: this.phone,
            site: this.site
        }
    }
}

export {Bank};