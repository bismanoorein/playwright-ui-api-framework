import{test, expect} from '@playwright/test'

test('login with invalid credentials', async ({ request }) => {
    const response = await request.get('https://restful-booker.herokuapp.com/booking')
    const responseBody = await response.json();
    console.log(responseBody)
    expect(response.status()).toBe(200)
    expect(responseBody.length).toBeGreaterThan(0);

    expect(responseBody[0]).toHaveProperty('bookingid')
    expect(typeof responseBody[0].bookingid).toBe('number')
    expect(responseBody[0].bookingid).toBeGreaterThan(0)
})

// test crud operations on booking resource
test('create, update and delete a booking', async ({ request }) => {
    // create a new booking
    const createResponse = await request.post('https://restful-booker.herokuapp.com/booking', {
        data: {
            "firstname": "John",
            "lastname": "Doe",
            "totalprice": 150,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2024-01-01",
                "checkout": "2024-01-10"
            },
            "additionalneeds": "Breakfast"
        }
    })
    expect(createResponse.status()).toBe(200)
    const createResponseBody = await createResponse.json();
    console.log(createResponseBody)
    const bookingId = createResponseBody.bookingid;
    expect(bookingId).toBeGreaterThan(0)

    // update the booking
    const updateResponse = await request.put(`https://restful-booker.herokuapp.com/ 
booking/${bookingId}`, {
        data: {
            "firstname": "Jane",
            "lastname": "Smith",
            "totalprice": 200,
            "depositpaid": false,
            "bookingdates": {
                "checkin": "2024-02-01",
                "checkout": "2024-02-10"
            },
            "additionalneeds": "Lunch"
        }
    })
    expect(updateResponse.status()).toBe(200)
    const updateResponseBody = await updateResponse.json();
    console.log(updateResponseBody)
    expect(updateResponseBody.booking.firstname).toBe('Jane')
    expect(updateResponseBody.booking.lastname).toBe('Smith')
    expect(updateResponseBody.booking.totalprice).toBe(200)
    expect(updateResponseBody.booking.depositpaid).toBe(false)
    expect(updateResponseBody.booking.additionalneeds).toBe('Lunch')

    // delete the booking
    const deleteResponse = await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingId}`)
    expect(deleteResponse.status()).toBe(201)

    // verify the booking is deleted
    const getResponse = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`)
    expect(getResponse.status()).toBe(404)
})


test('should return error when request body is empty', async ({ request }) => {
    const createResponse1 = await request.post('https://restful-booker.herokuapp.com/booking', {
        data: {}
    })
    expect(createResponse1.status()).toBe(500)
})
    

// test missing mandatory fields for create booking
test('should return error when mandatory fields are missing', async ({ request }) => {
    const createResponse2 = await request.post('https://restful-booker.herokuapp.com/booking', {
        data: {
            "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : "",
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : 
        "" },
    "additionalneeds" : ""
        }
    })
    expect(createResponse2.status()).toBe(400)
   })


    // test null values for create booking
    test('should return error when null values are provided for mandatory fields', async ({ request }) => {
    const createResponse3 = await request.post('https://restful-booker.herokuapp.com/booking', {
        data: {
            "firstname": null,
            "lastname": null,
            "totalprice": null,
            "depositpaid": null,
            "bookingdates": null,
            "additionalneeds": null
        }
    })
    expect(createResponse3.status()).toBe(400) 
})

    // test very long firstname for create booking
    test('should return error when firstname exceeds maximum length', async ({ request }) => {
    const longFirstname = 'a'.repeat(500);
    const createResponse4 = await request.post('https://restful-booker.herokuapp.com/booking', {
        data: {
            "firstname": longFirstname,
            "lastname": "Doe",
            "totalprice": 150,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2024-01-01",
                "checkout": "2024-01-10"
            },
            "additionalneeds": "Breakfast"
        }
    })
    expect(createResponse4.status()).toBe(400)
})

    // test special characters for create booking
    test('should return error when special characters are provided in firstname', async ({ request }) => {
    const createResponse5 = await request.post('https://restful-booker.herokuapp.com/booking', {
        data: {
            "firstname": "<script>alert('hack')</script>",
            "lastname": "Doe",
            "totalprice": 150,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2024-01-01",
                "checkout": "2024-01-10"
            },
            "additionalneeds": "Breakfast"
        }
    })
    expect(createResponse5.status()).toBe(400)
})

    // test SQL injection payload for create booking
    test('should return error when SQL injection payload is provided in firstname', async ({ request }) => {
    const createResponse6 = await request.post('https://restful-booker.herokuapp.com/booking', {
        data: {
            "firstname": "' OR 1=1 --",
            "lastname": "Doe",
            "totalprice": 150,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2024-01-01",
                "checkout": "2024-01-10"
            },
            "additionalneeds": "Breakfast"
        }
    })
    expect(createResponse6.status()).toBe(400)
})

    // test XSS payload for create booking
    test('should return error when XSS payload is provided in firstname', async ({ request }) => {
    const createResponse7 = await request.post('https://restful-booker.herokuapp.com/booking', {
        data: {
            "firstname": "<script>alert('hack')</script>",
            "lastname": "Doe",
            "totalprice": 150,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2024-01-01",
                "checkout": "2024-01-10"
            },
            "additionalneeds": "Breakfast"
        }
    })
    expect(createResponse7.status()).toBe(400)
})

    // test negative totalprice for create booking
    test('should return error when totalprice is negative', async ({ request }) => {
    const createResponse8 = await request.post('https://restful-booker.herokuapp.com/booking', {
        data: {
            "firstname": "John",
            "lastname": "Doe",
            "totalprice": -100,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2024-01-01",
                "checkout": "2024-01-10"
            },
            "additionalneeds": "Breakfast"
        }
    })
    expect(createResponse8.status()).toBe(400)
})

    // test invalid date format for create booking
    test('should return error when date format is invalid', async ({ request }) => {
    const createResponse9 = await request.post('https://restful-booker.herokuapp.com/booking', {
        data: {
            "firstname": "John",
            "lastname": "Doe",
            "totalprice": 150,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "01-01-2024",
                "checkout": "10-01-2024"
            },
            "additionalneeds": "Breakfast"
        }
    })
    expect(createResponse9.status()).toBe(400)
})


    // test check-out before check-in for create booking
    test('should return error when check-out date is before check-in date', async ({ request }) => {
    const createResponse10 = await request.post('https://restful-booker.herokuapp.com/booking', {
        data: {
            "firstname": "John",
            "lastname": "Doe",
            "totalprice": 150,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2024-01-10",
                "checkout": "2024-01-01"
            },
            "additionalneeds": "Breakfast"
        }
    })
    expect(createResponse10.status()).toBe(400)
  })

    // test duplicate booking submission for create booking


    test('should create multiple bookings with same details and get unique booking IDs', async ({ request }) => {
    const createResponse11 = await request.post('https://restful-booker.herokuapp.com/booking', {
        data: {
            "firstname": "John",
            "lastname": "Doe",
            "totalprice": 150,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2024-01-01",
                "checkout": "2024-01-10"
            },
            "additionalneeds": "Breakfast"
        }
    })
    expect(createResponse11.status()).toBe(200)
    const createResponseBody11 = await createResponse11.json();
    const bookingId11 = createResponseBody11.bookingid;

    const createResponse12 = await request.post('https://restful-booker.herokuapp.com/booking', {
        data: {
            "firstname": "John",
            "lastname": "Doe",
            "totalprice": 150,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2024-01-01",
                "checkout": "2024-01-10"  
            },
            "additionalneeds": "Breakfast"
        }
    })
    expect(createResponse12.status()).toBe(200)
    const createResponseBody12 = await createResponse12.json();
    const bookingId12 = createResponseBody12.bookingid;

    expect(bookingId11).not.toBe(bookingId12)   

    // clean up - delete the created bookings
    await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingId11}`)
    await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingId12}`) 
    // verify the bookings are deleted
    const getResponse11 = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId11}`)
    expect(getResponse11.status()).toBe(404)
    const getResponse12 = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId12}`)
    expect(getResponse12.status()).toBe(404)

})
