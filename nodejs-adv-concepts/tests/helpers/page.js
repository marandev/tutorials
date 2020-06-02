const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
    static async build() {
        const browser = await puppeteer.launch({
            headless: false
        });

        const page = await browser.newPage();
        const customePage = new CustomPage(page);

        return new Proxy(customePage, {
            get: function(target, property) {
                return customePage[property] || browser[property] || page[property];
            }
        })
    }

    constructor(page) {
        this.page = page;
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);

        await this.setCookie({ name: 'session', value: session });
        await this.setCookie({ name: 'session.sig', value: sig });
        await this.goto('localhost:3000/blogs');
        await this.waitFor('a[href="/auth/logout"]');
    }

    async getContentsOf(selector) {
        return this.$eval(selector, el => el.innerHTML);
    }

    get(path) {
        return this.page.evaluate((_path) => {
            return fetch(_path, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json());
        }, path);
    }

    post(path, data) {
        return this.page.evaluate((_path, _data) => {
            return fetch(_path, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(_data)
            }).then(res => res.json());
        }, path, data);
    }

    execRequests(actions) {
        return Promise.all(
            actions.map(({ method, path, data}) => {
                return this[method](path, data);
            })
        );
    }
}

module.exports = CustomPage;