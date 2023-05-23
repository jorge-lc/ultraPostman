/// <reference types='cypress' />

context("Validate different scenarios in the gorest users API", () => {
  let baseUrl;
  let token;
  let userId;
  let userName;
  let userEmail;
  let userGender;
  let userStatus;
  let newUserName;
  let newUserEmail;

  before(() => {
    baseUrl = Cypress.config().baseUrl;
    cy.fixture("token.json").then((tokenData) => {
      token = tokenData.token;
    });
  });

  it("Will retrieve all the users info", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/users`,
      auth: {
        bearer: token,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);

      const users = response.body;
      expect(users).to.be.an("array");
      expect(users).to.have.length.above(0);

      users.forEach((user) => {
        expect(user).to.be.an("object");
        cy.assertUserProperties(user);
      });
    });
  });

  it("Will create a new user", () => {
    let dynamicUser = Date.now();

    cy.request({
      method: "POST",
      url: `${baseUrl}/users`,
      auth: {
        bearer: token,
      },
      body: {
        name: `User ${dynamicUser}`,
        email: `user_${dynamicUser}@example.com`,
        gender: "male",
        status: "active",
      },
    }).then((response) => {
      expect(response.status).to.equal(201);

      const createdUser = response.body;
      expect(createdUser).to.be.an("object");
      cy.assertUserProperties(createdUser);

      userId = createdUser.id;
      userName = createdUser.name;
      userEmail = createdUser.email;
      userGender = createdUser.gender;
      userStatus = createdUser.status;
    });
  });

  it("Will retrieve the recently created user", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/users/${userId}`,
      auth: {
        bearer: token,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);

      const createdUser = response.body;
      expect(createdUser).to.be.an("object");
      cy.assertUserProperties(createdUser);
    });
  });

  it("Will update the recently created user", () => {
    let dynamicUser = Date.now();

    cy.request({
      method: "PUT",
      url: `${baseUrl}/users/${userId}`,
      auth: {
        bearer: token,
      },
      body: {
        name: `User ${dynamicUser}`,
        email: `user_${dynamicUser}@example.com`,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);

      const jsonData = response.body;

      expect(jsonData).to.be.an("object");
      cy.assertUserProperties(jsonData);
      expect(jsonData.id).to.equal(userId);
      expect(jsonData.name).to.equal(`User ${dynamicUser}`);
      expect(jsonData.email).to.equal(`user_${dynamicUser}@example.com`);
      expect(jsonData.gender).to.equal("male");
      expect(jsonData.status).to.equal("active");

      newUserName = jsonData.name;
      newUserEmail = jsonData.email;
    });
  });

  it("Will validate the updated user", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/users/${userId}`,
      auth: {
        bearer: token,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);

      const jsonData = response.body;

      expect(jsonData).to.be.an("object");
      expect(jsonData).to.have.property("id").that.is.a("number");
      expect(jsonData)
        .to.have.property("name")
        .that.is.a("string")
        .and.contain(newUserName);
      expect(jsonData)
        .to.have.property("email")
        .that.is.a("string")
        .and.contain(newUserEmail);
    });
  });

  it("Will delete the new user", () => {
    cy.request({
      method: "DELETE",
      url: `${baseUrl}/users/${userId}`,
      auth: {
        bearer: token,
      },
    }).then((response) => {
      expect(response.status).to.equal(204);
    });
  });

  it("Will confirm user deletion", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/users/${userId}`,
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(404);

      const jsonData = response.body;

      expect(jsonData).to.be.an("object");
      expect(jsonData)
        .to.have.property("message")
        .that.is.a("string")
        .and.contain("Resource not found");
    });
  });

  it("Will check Unprocessable Entity handling", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/users`,
      auth: {
        bearer: token,
      },
      body: {
        invalid_key: "value",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(422);

      const errors = response.body;
      expect(errors).to.be.an("array");
      expect(errors).to.have.length.above(0);

      errors.forEach((error) => {
        cy.assertValidationError(error);
      });
    });
  });

  it("Will check Invalid Gender handling", () => {
    let dynamicUser = Date.now();

    cy.request({
      method: "POST",
      url: `${baseUrl}/users`,
      auth: {
        bearer: token,
      },
      body: {
        name: `User ${dynamicUser}`,
        email: `user_${dynamicUser}@example.com`,
        gender: "Invalid Information",
        status: "active",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(422);

      const jsonData = response.body;

      expect(jsonData).to.be.an("array");
      expect(jsonData).to.have.lengthOf(1);

      jsonData.forEach(function (item) {
        expect(item).to.be.an("object");
        expect(item).to.have.property("field").that.is.a("string");
        expect(item)
          .to.have.property("message")
          .that.is.a("string")
          .and.contain("can't be blank, can be male of female");
      });
    });
  });
});
