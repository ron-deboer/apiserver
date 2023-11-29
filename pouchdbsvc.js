import PouchDB from "pouchdb";

class PouchDbSvc {
    constructor() {
        this.remoteCouch = false;
        this.db = new PouchDB("http://localhost:5984/customers");
    }

    async fetchAllCustomers() {
        const docs = await this.db.allDocs({ include_docs: true, descending: true });
        const data = docs.rows.map((x) => {
            const cust = {
                id: x.id,
                ...x.doc.customer,
            };
            return cust;
        });
        return data;
    }

    async fetchCustomerById(id) {
        const doc = await this.db.get(id);
        const cust = {
            id,
            ...doc.customer,
        };
        return cust;
    }

    async insertCustomer(data) {
        delete data.id;
        const item = {
            _id: new Date().toISOString(),
            customer: data,
        };
        const resp = await this.db.put(item);
        return { status: "success" };
    }

    async deleteCustomer(id) {
        const doc = await this.db.get(id);
        this.db.remove(doc);
        return { status: "success" };
    }

    async updateCustomer(id, data) {
        delete data.id;
        const doc = await this.db.get(id);
        const item = {
            _id: id,
            _rev: doc._rev,
            customer: data,
        };
        this.db.put(doc);
        return { status: "success" };
    }
}

export default new PouchDbSvc();
