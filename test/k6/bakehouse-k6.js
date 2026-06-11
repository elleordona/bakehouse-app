import http from 'k6/http';
import { group, check, sleep } from 'k6';

const stackName = process.env.BAKEHOUSE_STACK_NAME;
const BASE_URL = `https://${stackName}.cta-training.academy/`;

export const options = {
    scenarios: {
        getCustomer: {
            exec: 'getCustomers',
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 2 },
                { duration: '90s', target: 2 }
            ],
            gracefulRampDown: '5s'
        },
        getProduct: {
            exec: 'getProducts',
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 2 },
                { duration: '90s', target: 2 }
            ],
            gracefulRampDown: '5s'
        },
        getOrders: {
            exec: 'getOrders',
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 2 },
                { duration: '90s', target: 2 }
            ],
            gracefulRampDown: '5s'
        },
        postCustomer: {
            exec: 'postCustomer',
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 2 },
                { duration: '90s', target: 2 }
            ],
            gracefulRampDown: '5s'
        }
    },
    thresholds: {
        http_req_duration: ['p(95)<250', 'max<2000'],
        http_req_failed: ['rate<0.1']
    }
}

export function getRequest() {
    let res = http.get(BASE_URL)

    statusCheck(res);
    sleep(5);
}

export function getCustomers() {
    let res = http.get(`${BASE_URL}api/customers`)

    statusCheck(res, 200);
    sleep(5);
};

export function getProducts() {
    let res = http.get(`${BASE_URL}api/products`)

    statusCheck(res, 200);
    sleep(5);
};

export function getOrders() {
    let res = http.get(`${BASE_URL}api/orders`)

    statusCheck(res, 200);
    sleep(5);
};

export function postCustomer() {
    const payload = JSON.stringify({
        name: 'test',
        email: 'test@test.com'
    })

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let res =  http.post(`${BASE_URL}api/customers`, payload, params)

    statusCheck(res, 201);
    sleep(5);
}

const statusCheck = (res, statusCode) => {
    const success = check(res, {
        "is status code correct": (r) => r.status === statusCode,
    });

    if (!success) {
        console.log(`FAILED REQUEST with status: ${res.status}`)
        console.log(`status_text: ${res.status_text}`)
        console.log(`Request Type: ${res.request.method}`)
        console.log(`Request URL: ${res.request.url}`)
        console.log(`Request Body: ${res.request.body}`)
    }
}
